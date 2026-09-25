/**
 * Detecção Polifônica de Acordes via Chroma Features (Pitch Class Profile — PCP)
 *
 * Responsabilidade: identificar acordes tocados simultaneamente (piano, violão, etc.)
 * capturados por microfone usando o domínio de frequência (FFT). O PCP mapeia o
 * espectro inteiro em 12 bins cromáticos, comparados contra templates de acordes.
 *
 * Integração: usado pelo MicrophonePitchBar quando o usuário ativa detecção de acordes.
 * Coexiste com o MicrophonePitchDetector (monofônico) — ambos compartilham
 * o mesmo MediaStream, pois o AnalyserNode é read-only e não interfere.
 *
 * Melhorias de precisão (v2):
 * - FFT ampliado para 8192 pontos (~5.4 Hz/bin) melhor separação espectral.
 * - Penalidade de energia fora do template aumentada (0.50 vs 0.35 anterior).
 * - Limiar de confiança elevado (0.52) menos falsos positivos.
 * - Limiar de RMS mais alto (0.015) filtra ruído de fundo mais agressivamente.
 * - Suavização interna mais conservadora (alpha 0.25) chroma mais estável.
 * - Estabilidade requerida aumentada (4 frames, ~67ms) antes de emitir.
 * - smoothingTimeConstant do AnalyserNode reduzido para 0.3.
 * - Templates de triades avaliados antes de tetrades.
 * - Normalizacao L-inf (max-norm) substitui L1.
 * - Clamping de bins abaixo de -80 dB.
 * - DetectedChord inclui estimatedMidiNotes para destacar teclas no teclado.
 */

// ── Tipos ─────────────────────────────────────────────────────────────────────

/** Perfil de Classe de Altura (Pitch Class Profile), 12 valores para C..B */
export type ChromaVector = Float32Array;

/** Resultado de uma detecção de acorde polifonico */
export interface DetectedChord {
  /** Pitch class da raiz (0 = C, 1 = C#, ..., 11 = B) */
  rootPc: number;
  /** Nome da raiz em notacao ocidental */
  rootName: string;
  /** Qualidade do acorde detectado */
  quality: ChordQuality;
  /** Sufixo simbolico (ex: '', 'm', 'maj7', '7') */
  suffix: string;
  /** Score de confianca normalizado [0, 1] */
  confidence: number;
  /** Vetor chroma bruto que originou esta deteccao */
  chromaVector: ChromaVector;
  /** Energia RMS do frame analisado */
  rmsEnergy: number;
  /**
   * MIDIs estimados das notas detectadas.
   * Posicionados na oitava 3-4 (MIDI 48-71) para coincidir com
   * o registro mais comum do piano.
   * Usado para destacar as teclas correspondentes no PianoKeyboard.
   */
  estimatedMidiNotes: number[];
}

export type ChordQuality =
  | 'major' | 'minor' | 'diminished' | 'augmented'
  | 'maj7' | 'dom7' | 'min7' | 'm7b5' | 'dim7'
  | 'sus4' | 'sus2' | 'add9';

// ── Constantes ────────────────────────────────────────────────────────────────

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const CHORD_TEMPLATES: Array<{
  quality: ChordQuality;
  suffix: string;
  intervals: number[];
  weights: number[];
}> = [
  // Triades (avaliadas primeiro)
  { quality: 'major',      suffix: '',       intervals: [0, 4, 7], weights: [1, 0.95, 0.9]  },
  { quality: 'minor',      suffix: 'm',      intervals: [0, 3, 7], weights: [1, 0.95, 0.9]  },
  { quality: 'diminished', suffix: 'dim',    intervals: [0, 3, 6], weights: [1, 0.95, 1.0]  },
  { quality: 'augmented',  suffix: 'aug',    intervals: [0, 4, 8], weights: [1, 0.95, 1.0]  },
  { quality: 'sus4',       suffix: 'sus4',   intervals: [0, 5, 7], weights: [1, 0.9,  0.9]  },
  { quality: 'sus2',       suffix: 'sus2',   intervals: [0, 2, 7], weights: [1, 0.85, 0.9]  },
  // Tetrades
  { quality: 'maj7',  suffix: 'maj7',   intervals: [0, 4, 7, 11], weights: [1, 0.95, 0.85, 0.9]  },
  { quality: 'dom7',  suffix: '7',      intervals: [0, 4, 7, 10], weights: [1, 0.95, 0.85, 0.9]  },
  { quality: 'min7',  suffix: 'm7',     intervals: [0, 3, 7, 10], weights: [1, 0.95, 0.85, 0.9]  },
  { quality: 'm7b5',  suffix: 'm7(b5)', intervals: [0, 3, 6, 10], weights: [1, 0.95, 0.9,  0.85] },
  { quality: 'dim7',  suffix: 'dim7',   intervals: [0, 3, 6,  9], weights: [1, 0.95, 1.0,  0.9]  },
  { quality: 'add9',  suffix: 'add9',   intervals: [0, 2, 4,  7], weights: [1, 0.75, 0.95, 0.85] },
];

const A4_FREQ = 440;
const A4_MIDI = 69;

const MIN_RMS_THRESHOLD = 0.015;
const MIN_CONFIDENCE_THRESHOLD = 0.52;
const STABILITY_FRAMES_REQUIRED = 4;

// ── Funcoes Puras ─────────────────────────────────────────────────────────────

export function computeChroma(
  magnitudes: Float32Array,
  sampleRate: number,
  fftSize: number
): ChromaVector {
  const chroma = new Float32Array(12);
  const binCount = magnitudes.length;
  const freqPerBin = sampleRate / fftSize;

  const minBin = Math.max(1, Math.floor(60 / freqPerBin));
  const maxBin = Math.min(binCount - 1, Math.ceil(1800 / freqPerBin));

  const harmonicWeights = [1.0, 0.4, 0.25, 0.15, 0.1];

  for (let bin = minBin; bin <= maxBin; bin++) {
    const mag = magnitudes[bin];
    if (mag < 1e-6) continue;

    const freq = bin * freqPerBin;

    for (let h = 1; h <= harmonicWeights.length; h++) {
      const fundamentalFreq = freq / h;
      if (fundamentalFreq < 40) break;

      const midiContinuous = A4_MIDI + 12 * Math.log2(fundamentalFreq / A4_FREQ);
      const pitchClass = ((Math.round(midiContinuous) % 12) + 12) % 12;

      chroma[pitchClass] += mag * harmonicWeights[h - 1];
    }
  }

  // Normalizacao L-inf (max-norm)
  let maxVal = 0;
  for (let i = 0; i < 12; i++) if (chroma[i] > maxVal) maxVal = chroma[i];
  if (maxVal > 0) {
    for (let i = 0; i < 12; i++) chroma[i] /= maxVal;
  }

  return chroma;
}

export function matchChordTemplate(chroma: ChromaVector): {
  rootPc: number;
  quality: ChordQuality;
  suffix: string;
  confidence: number;
} | null {
  let bestScore = -1;
  let bestRootPc = 0;
  let bestTemplate = CHORD_TEMPLATES[0];

  let chromaSum = 0;
  for (let i = 0; i < 12; i++) chromaSum += chroma[i];

  if (chromaSum < 1.0) return null;

  for (let rootPc = 0; rootPc < 12; rootPc++) {
    for (const template of CHORD_TEMPLATES) {
      let templateEnergy = 0;
      let maxTemplateWeight = 0;

      for (let i = 0; i < template.intervals.length; i++) {
        const pc = (rootPc + template.intervals[i]) % 12;
        templateEnergy += chroma[pc] * template.weights[i];
        maxTemplateWeight += template.weights[i];
      }

      const templatePCSet = new Set(template.intervals.map(iv => (rootPc + iv) % 12));
      let outsideEnergy = 0;
      for (let pc = 0; pc < 12; pc++) {
        if (!templatePCSet.has(pc)) outsideEnergy += chroma[pc];
      }

      const score = (templateEnergy / maxTemplateWeight) *
                    (1 - 0.5 * (outsideEnergy / (chromaSum + 1e-6)));

      if (score > bestScore) {
        bestScore = score;
        bestRootPc = rootPc;
        bestTemplate = template;
      }
    }
  }

  if (bestScore < MIN_CONFIDENCE_THRESHOLD) return null;

  return {
    rootPc: bestRootPc,
    quality: bestTemplate.quality,
    suffix: bestTemplate.suffix,
    confidence: Math.min(1, bestScore),
  };
}

export function computeRmsFromTimeDomain(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}

function estimateMidiNotes(rootPc: number, intervals: number[]): number[] {
  const rootMidi = 48 + rootPc;
  return intervals.map(interval => {
    let midi = rootMidi + interval;
    while (midi < 48) midi += 12;
    while (midi > 83) midi -= 12;
    return midi;
  });
}

// ── Classe Principal ──────────────────────────────────────────────────────────

/**
 * Detector de acordes polifonicos em tempo real via FFT + PCP.
 *
 * Fluxo:
 * 1. Recebe um MediaStream ja autorizado pelo usuario.
 * 2. Cria AnalyserNode com FFT de 8192 pontos (resolucao ~5.4 Hz/bin a 44.1kHz).
 * 3. A cada frame (~60fps): coleta FFT, aplica floor -80 dB, computa chroma,
 *    suaviza temporalmente (alpha=0.25), compara com templates.
 * 4. Emite o acorde via callback apos STABILITY_FRAMES_REQUIRED frames estaveis.
 */
export class PolyphonicChordDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private magnitudeBuffer: Float32Array | null = null;
  private timeDomainBuffer: Float32Array | null = null;
  private animationFrameId: number | null = null;
  private isListening = false;

  private onChordCallback: ((chord: DetectedChord | null) => void) | null = null;

  private stabilityCount = 0;
  private lastCandidateKey = '';
  private lastEmittedChordKey = '';

  private smoothedChroma: Float32Array = new Float32Array(12);
  private readonly SMOOTH_ALPHA = 0.25;

  public start(stream: MediaStream, onChord: (chord: DetectedChord | null) => void): void {
    if (this.isListening) return;

    const AudioCtxClass = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioCtxClass({ latencyHint: 'interactive' });

    const source = this.audioCtx.createMediaStreamSource(stream);

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 8192;
    this.analyser.smoothingTimeConstant = 0.3;

    source.connect(this.analyser);

    this.magnitudeBuffer = new Float32Array(this.analyser.frequencyBinCount);
    this.timeDomainBuffer = new Float32Array(this.analyser.fftSize);

    this.onChordCallback = onChord;
    this.isListening = true;
    this.stabilityCount = 0;
    this.lastCandidateKey = '';
    this.lastEmittedChordKey = '';
    this.smoothedChroma.fill(0);

    this.loop();
  }

  public stop(): void {
    this.isListening = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }

    this.analyser = null;
    this.magnitudeBuffer = null;
    this.timeDomainBuffer = null;
    this.stabilityCount = 0;
    this.lastCandidateKey = '';
    this.lastEmittedChordKey = '';
    this.smoothedChroma.fill(0);

    this.onChordCallback?.(null);
    this.onChordCallback = null;
  }

  public isActive(): boolean {
    return this.isListening;
  }

  private loop = (): void => {
    if (!this.isListening || !this.analyser || !this.magnitudeBuffer || !this.timeDomainBuffer || !this.audioCtx) {
      return;
    }

    // 1. Coleta espectro em dB com floor de -80 dB e converte para magnitude linear
    this.analyser.getFloatFrequencyData(this.magnitudeBuffer);
    const linMagnitudes = new Float32Array(this.magnitudeBuffer.length);
    for (let i = 0; i < this.magnitudeBuffer.length; i++) {
      const db = this.magnitudeBuffer[i];
      linMagnitudes[i] = db > -80 ? Math.pow(10, db / 20) : 0;
    }

    // 2. Verifica silencio via RMS do dominio de tempo
    this.analyser.getFloatTimeDomainData(this.timeDomainBuffer);
    const rms = computeRmsFromTimeDomain(this.timeDomainBuffer);

    if (rms < MIN_RMS_THRESHOLD) {
      if (this.lastEmittedChordKey !== '') {
        this.lastEmittedChordKey = '';
        this.stabilityCount = 0;
        this.lastCandidateKey = '';
        this.smoothedChroma.fill(0);
        this.onChordCallback?.(null);
      }
      this.animationFrameId = requestAnimationFrame(this.loop);
      return;
    }

    // 3. Calcula chroma do frame atual
    const frameChroma = computeChroma(linMagnitudes, this.audioCtx.sampleRate, this.analyser.fftSize);

    // 4. Suavizacao exponencial temporal (alpha 0.25 = resposta conservadora)
    for (let i = 0; i < 12; i++) {
      this.smoothedChroma[i] = this.SMOOTH_ALPHA * frameChroma[i] + (1 - this.SMOOTH_ALPHA) * this.smoothedChroma[i];
    }

    // 5. Compara chroma suavizado contra todos os templates
    const match = matchChordTemplate(this.smoothedChroma);

    if (match) {
      const candidateKey = `${match.rootPc}-${match.suffix}`;

      if (candidateKey === this.lastCandidateKey) {
        this.stabilityCount++;
      } else {
        this.lastCandidateKey = candidateKey;
        this.stabilityCount = 1;
      }

      // 6. Emite somente apos estabilidade e somente se mudou
      if (this.stabilityCount >= STABILITY_FRAMES_REQUIRED && candidateKey !== this.lastEmittedChordKey) {
        this.lastEmittedChordKey = candidateKey;

        const template = CHORD_TEMPLATES.find(
          t => t.quality === match.quality && t.suffix === match.suffix
        ) ?? CHORD_TEMPLATES[0];

        this.onChordCallback?.({
          rootPc: match.rootPc,
          rootName: NOTE_NAMES[match.rootPc],
          quality: match.quality,
          suffix: match.suffix,
          confidence: match.confidence,
          chromaVector: new Float32Array(this.smoothedChroma),
          rmsEnergy: rms,
          estimatedMidiNotes: estimateMidiNotes(match.rootPc, template.intervals),
        });
      }
    } else {
      // Sem match: reseta debounce mas nao emite silencio (ha som mas nao e tonal)
      this.stabilityCount = 0;
      this.lastCandidateKey = '';
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}

/** Instancia singleton compartilhada entre componentes */
export const polyphonicChordDetector = new PolyphonicChordDetector();
