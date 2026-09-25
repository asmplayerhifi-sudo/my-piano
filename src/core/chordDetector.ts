/**
 * Detecção Polifônica de Acordes via Chroma Features (Pitch Class Profile — PCP)
 *
 * Responsabilidade: identificar acordes tocados simultaneamente (piano, violão, etc.)
 * capturados por microfone usando o domínio de frequência (FFT). O PCP mapeia o
 * espectro inteiro em 12 bins cromáticos, comparados contra templates de acordes.
 *
 * Integração: usado pelo MicrophonePitchBar quando o usuário ativa detecção de acordes.
 * Coexiste com o MicrophonePitchDetector (monofônico) — ambos podem compartilhar
 * o mesmo MediaStream, pois o AnalyserNode é read-only e não interfere.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Perfil de Classe de Altura (Pitch Class Profile), 12 valores para C..B */
export type ChromaVector = Float32Array;

/** Resultado de uma detecção de acorde polifônico */
export interface DetectedChord {
  /** Pitch class da raiz (0 = C, 1 = C#, ..., 11 = B) */
  rootPc: number;
  /** Nome da raiz em notação ocidental */
  rootName: string;
  /** Qualidade do acorde detectado */
  quality: ChordQuality;
  /** Sufixo simbólico (ex: '', 'm', 'maj7', '7') */
  suffix: string;
  /** Score de confiança normalizado [0, 1] */
  confidence: number;
  /** Vetor chroma bruto que originou esta detecção */
  chromaVector: ChromaVector;
  /** Energia RMS do frame analisado */
  rmsEnergy: number;
}

export type ChordQuality =
  | 'major' | 'minor' | 'diminished' | 'augmented'
  | 'maj7' | 'dom7' | 'min7' | 'm7b5' | 'dim7'
  | 'sus4' | 'sus2' | 'add9';

// ─── Constantes ──────────────────────────────────────────────────────────────

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Templates de acorde: intervalos (semitons a partir da raiz) que devem ter
 * energia dominante no vetor chroma. Ordenados do mais específico ao genérico.
 */
const CHORD_TEMPLATES: Array<{
  quality: ChordQuality;
  suffix: string;
  intervals: number[];
  weights: number[];
}> = [
  // ── Tétrades ──
  { quality: 'maj7',       suffix: 'maj7',   intervals: [0, 4, 7, 11], weights: [1, 1, 0.8, 0.9] },
  { quality: 'dom7',       suffix: '7',      intervals: [0, 4, 7, 10], weights: [1, 1, 0.8, 0.9] },
  { quality: 'min7',       suffix: 'm7',     intervals: [0, 3, 7, 10], weights: [1, 1, 0.8, 0.9] },
  { quality: 'm7b5',       suffix: 'm7(b5)', intervals: [0, 3, 6, 10], weights: [1, 1, 0.9, 0.8] },
  { quality: 'dim7',       suffix: 'dim7',   intervals: [0, 3, 6,  9], weights: [1, 1, 1,   0.9] },
  { quality: 'add9',       suffix: 'add9',   intervals: [0, 2, 4,  7], weights: [1, 0.7, 1, 0.8] },
  // ── Tríades ──
  { quality: 'major',      suffix: '',       intervals: [0, 4, 7], weights: [1, 1, 0.9] },
  { quality: 'minor',      suffix: 'm',      intervals: [0, 3, 7], weights: [1, 1, 0.9] },
  { quality: 'diminished', suffix: 'dim',    intervals: [0, 3, 6], weights: [1, 1, 1]   },
  { quality: 'augmented',  suffix: 'aug',    intervals: [0, 4, 8], weights: [1, 1, 1]   },
  { quality: 'sus4',       suffix: 'sus4',   intervals: [0, 5, 7], weights: [1, 0.9, 0.9] },
  { quality: 'sus2',       suffix: 'sus2',   intervals: [0, 2, 7], weights: [1, 0.8, 0.9] },
];

const A4_FREQ = 440;
const A4_MIDI = 69;

/** Energia RMS mínima para iniciar análise (evita ruído de fundo) */
const MIN_RMS_THRESHOLD = 0.01;

/** Confiança mínima para considerar um acorde detectado */
const MIN_CONFIDENCE_THRESHOLD = 0.45;

/** Frames consecutivos idênticos exigidos antes de emitir (debounce) */
const STABILITY_FRAMES_REQUIRED = 3;

// ─── Funções Puras ───────────────────────────────────────────────────────────

/**
 * Calcula o vetor Chroma (PCP) a partir das magnitudes espectrais do FFT.
 *
 * Técnica: Pitch Class Profile com harmonic summation.
 * Cada bin FFT é tratado como potencial H2..H5 de uma fundamental, permitindo
 * detectar notas cujo fundamental é fraco no espectro (típico de piano acústico).
 *
 * @param magnitudes - Magnitudes lineares do FFT (não dB)
 * @param sampleRate - Taxa de amostragem do AudioContext
 * @param fftSize    - Tamanho do FFT (o dobro do frequencyBinCount)
 */
export function computeChroma(
  magnitudes: Float32Array,
  sampleRate: number,
  fftSize: number
): ChromaVector {
  const chroma = new Float32Array(12);
  const binCount = magnitudes.length;
  const freqPerBin = sampleRate / fftSize;

  // Cobre C2 (65 Hz) a E7 (2637 Hz) — registros do piano e violão
  const minBin = Math.max(1, Math.floor(60 / freqPerBin));
  const maxBin = Math.min(binCount - 1, Math.ceil(2700 / freqPerBin));

  // Pesos por harmônico: H1 (fundamental) com peso 1.0, H2..H5 decrescentes
  const harmonicWeights = [1.0, 0.5, 0.33, 0.25, 0.2];

  for (let bin = minBin; bin <= maxBin; bin++) {
    const mag = magnitudes[bin];
    if (mag < 1e-6) continue;

    const freq = bin * freqPerBin;

    for (let h = 1; h <= harmonicWeights.length; h++) {
      const fundamentalFreq = freq / h;
      if (fundamentalFreq < 30) break;

      // Converte frequência para pitch class via distância em semitons de A4
      const midiContinuous = A4_MIDI + 12 * Math.log2(fundamentalFreq / A4_FREQ);
      const pitchClass = ((Math.round(midiContinuous) % 12) + 12) % 12;

      chroma[pitchClass] += mag * harmonicWeights[h - 1];
    }
  }

  // Normaliza para [0, 1]
  let maxVal = 0;
  for (let i = 0; i < 12; i++) if (chroma[i] > maxVal) maxVal = chroma[i];
  if (maxVal > 0) {
    for (let i = 0; i < 12; i++) chroma[i] /= maxVal;
  }

  return chroma;
}

/**
 * Compara um vetor chroma contra todos os templates de acorde.
 * Penaliza acordes com energia em notas fora do template (notas "erradas").
 *
 * @param chroma - ChromaVector normalizada
 * @returns Melhor match ou null se a confiança estiver abaixo do limiar
 */
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
  if (chromaSum < 0.5) return null;

  for (let rootPc = 0; rootPc < 12; rootPc++) {
    for (const template of CHORD_TEMPLATES) {
      let templateEnergy = 0;
      let maxTemplateWeight = 0;

      for (let i = 0; i < template.intervals.length; i++) {
        const pc = (rootPc + template.intervals[i]) % 12;
        templateEnergy += chroma[pc] * template.weights[i];
        maxTemplateWeight += template.weights[i];
      }

      // Energia em pitch classes fora do template (penalidade)
      const templatePCSet = new Set(template.intervals.map(iv => (rootPc + iv) % 12));
      let outsideEnergy = 0;
      for (let pc = 0; pc < 12; pc++) {
        if (!templatePCSet.has(pc)) outsideEnergy += chroma[pc];
      }

      const score = (templateEnergy / maxTemplateWeight) *
                    (1 - 0.35 * (outsideEnergy / (chromaSum + 1e-6)));

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

/** Calcula energia RMS de um buffer de domínio de tempo. */
export function computeRmsFromTimeDomain(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}

// ─── Classe Principal ─────────────────────────────────────────────────────────

/**
 * Detector de acordes polifônicos em tempo real.
 *
 * Fluxo:
 * 1. Recebe um MediaStream já autorizado.
 * 2. Cria AnalyserNode com FFT de 4096 pontos para boa resolução espectral.
 * 3. A cada frame (~60fps): coleta FFT, converte dB→magnitude, computa chroma,
 *    suaviza temporalmente, compara com templates.
 * 4. Emite o acorde via callback após STABILITY_FRAMES_REQUIRED frames estáveis.
 *
 * Dependências: Web Audio API nativa (sem bibliotecas externas).
 */
export class PolyphonicChordDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private magnitudeBuffer: Float32Array | null = null;
  private timeDomainBuffer: Float32Array | null = null;
  private animationFrameId: number | null = null;
  private isListening = false;

  private onChordCallback: ((chord: DetectedChord | null) => void) | null = null;

  // Estado de debounce temporal
  private stabilityCount = 0;
  private lastCandidateKey = '';
  private lastEmittedChordKey = '';

  // Suavização exponencial do chroma entre frames
  private smoothedChroma: Float32Array = new Float32Array(12);
  private readonly SMOOTH_ALPHA = 0.4;

  /**
   * Inicia a detecção de acordes usando o MediaStream fornecido.
   *
   * @param stream  - MediaStream já autorizado pelo usuário
   * @param onChord - Callback chamado ao detectar/encerrar um acorde
   */
  public start(stream: MediaStream, onChord: (chord: DetectedChord | null) => void): void {
    if (this.isListening) return;

    const AudioCtxClass = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioCtxClass({ latencyHint: 'interactive' });

    const source = this.audioCtx.createMediaStreamSource(stream);

    this.analyser = this.audioCtx.createAnalyser();
    // 4096 pontos → resolução ~10.8 Hz/bin a 44.1kHz: suficiente para distinguir
    // notas no registro médio (C3 = 261 Hz, resolução de ~0.7 semitons nessa faixa)
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0.5;

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

  /** Encerra a detecção e libera todos os recursos. */
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

  /** Retorna se o detector está ativo. */
  public isActive(): boolean {
    return this.isListening;
  }

  private loop = (): void => {
    if (!this.isListening || !this.analyser || !this.magnitudeBuffer || !this.timeDomainBuffer || !this.audioCtx) {
      return;
    }

    // 1. Coleta espectro em dB e converte para magnitude linear
    this.analyser.getFloatFrequencyData(this.magnitudeBuffer);
    const linMagnitudes = new Float32Array(this.magnitudeBuffer.length);
    for (let i = 0; i < this.magnitudeBuffer.length; i++) {
      linMagnitudes[i] = Math.pow(10, this.magnitudeBuffer[i] / 20);
    }

    // 2. Verifica energia via domínio de tempo (mais rápido para decisão de silêncio)
    this.analyser.getFloatTimeDomainData(this.timeDomainBuffer);
    const rms = computeRmsFromTimeDomain(this.timeDomainBuffer);

    if (rms < MIN_RMS_THRESHOLD) {
      if (this.lastEmittedChordKey !== '') {
        this.lastEmittedChordKey = '';
        this.stabilityCount = 0;
        this.lastCandidateKey = '';
        this.onChordCallback?.(null);
      }
      this.animationFrameId = requestAnimationFrame(this.loop);
      return;
    }

    // 3. Calcula chroma do frame atual
    const frameChroma = computeChroma(linMagnitudes, this.audioCtx.sampleRate, this.analyser.fftSize);

    // 4. Suavização exponencial temporal (reduz flickering entre frames)
    for (let i = 0; i < 12; i++) {
      this.smoothedChroma[i] = this.SMOOTH_ALPHA * frameChroma[i] + (1 - this.SMOOTH_ALPHA) * this.smoothedChroma[i];
    }

    // 5. Compara chroma suavizado com templates
    const match = matchChordTemplate(this.smoothedChroma);

    if (match) {
      const candidateKey = `${match.rootPc}-${match.suffix}`;

      if (candidateKey === this.lastCandidateKey) {
        this.stabilityCount++;
      } else {
        this.lastCandidateKey = candidateKey;
        this.stabilityCount = 1;
      }

      // 6. Emite apenas após estabilidade suficiente e somente se mudou
      if (this.stabilityCount >= STABILITY_FRAMES_REQUIRED && candidateKey !== this.lastEmittedChordKey) {
        this.lastEmittedChordKey = candidateKey;
        this.onChordCallback?.({
          rootPc: match.rootPc,
          rootName: NOTE_NAMES[match.rootPc],
          quality: match.quality,
          suffix: match.suffix,
          confidence: match.confidence,
          chromaVector: new Float32Array(this.smoothedChroma),
          rmsEnergy: rms,
        });
      }
    } else {
      // Sem match confiante: reseta debounce mas não emite silêncio ainda
      // (o sinal acima do RMS continua; só o chroma não bateu com nenhum template)
      this.stabilityCount = 0;
      this.lastCandidateKey = '';
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}

/** Instância singleton compartilhada entre componentes */
export const polyphonicChordDetector = new PolyphonicChordDetector();
