// Motor de Detecção de Altura (Pitch Detection) em Tempo Real via Microfone
// Utiliza Autocorrelação de Alta Precisão (Time-Domain Normalized Autocorrelation)

export interface DetectedPitch {
  midi: number;
  noteName: string;
  frequency: number;
  clarity: number;
  volumeRms: number;
  isNewAttack?: boolean;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

import { octaveConfigStore, type OctaveStandard } from './octaveConfigStore';

export function frequencyToMidi(freq: number): number {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

export function midiToNoteName(midi: number, standard?: OctaveStandard): string {
  const std = standard ?? octaveConfigStore.getStandard();
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) + (std === 'C4' ? -1 : -2);
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

// Algoritmo de Autocorrelação Normalizada com Supressão de Sub-harmônicos e Interpolação Parabólica
export function detectPitchFromBuffer(
  buf: Float32Array<ArrayBufferLike>,
  sampleRate: number,
  minRmsThreshold = 0.008
): { freq: number; clarity: number; rms: number } | null {
  // 1. Calcula volume RMS
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    sum += buf[i] * buf[i];
  }
  const rms = Math.sqrt(sum / buf.length);
  if (rms < minRmsThreshold) {
    return null; // Silêncio ou ruído de fundo
  }

  // 2. Limita busca para frequências musicais do piano e violão (50 Hz a 2200 Hz)
  const minPeriod = Math.max(2, Math.floor(sampleRate / 2200));
  const maxPeriod = Math.min(Math.floor(sampleRate / 50), Math.floor(buf.length / 2));

  const correlations = new Float32Array(maxPeriod + 2);
  let globalMax = -1;
  let globalMaxPeriod = 0;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let correlation = 0;
    let norm1 = 0;
    let norm2 = 0;

    const len = buf.length - period;
    for (let i = 0; i < len; i++) {
      const s1 = buf[i];
      const s2 = buf[i + period];
      correlation += s1 * s2;
      norm1 += s1 * s1;
      norm2 += s2 * s2;
    }

    const norm = Math.sqrt(norm1 * norm2);
    if (norm > 0) {
      const normalizedCorr = correlation / norm;
      correlations[period] = normalizedCorr;
      if (normalizedCorr > globalMax) {
        globalMax = normalizedCorr;
        globalMaxPeriod = period;
      }
    }
  }

  // Limiar de clareza calibrado para microfones reais (notebooks, smartphones, interfaces USB).
  // 0.38 permite capturar instrumentos acústicos sem inventar notas em silêncio.
  if (globalMax < 0.38 || globalMaxPeriod === 0) {
    return null; // Clareza insuficiente
  }

  // 3. Supressão de Erro de Sub-harmônico / Octave Drop:
  // Se globalMaxPeriod for um múltiplo de T0 (2*T0, 3*T0 ou 4*T0),
  // deve existir um pico forte de autocorrelação próximo a globalMaxPeriod / k.
  let chosenPeriod = globalMaxPeriod;

  // Testa divisores k = 4, 3, 2 (do menor período / maior frequência para o maior)
  for (const divisor of [4, 3, 2]) {
    const candidateP = Math.round(globalMaxPeriod / divisor);
    if (candidateP < minPeriod) continue;

    // Busca o pico local mais próximo em uma janela de ±5 amostras em torno de candidateP
    let localPeakP = candidateP;
    let localPeakCorr = -1;
    const searchStart = Math.max(minPeriod, candidateP - 5);
    const searchEnd = Math.min(maxPeriod, candidateP + 5);

    for (let p = searchStart; p <= searchEnd; p++) {
      if (correlations[p] > localPeakCorr) {
        localPeakCorr = correlations[p];
        localPeakP = p;
      }
    }

    // Threshold 0.72: o candidato (período menor / nota mais aguda) precisa ter >= 72% da
    // correlação do falso máximo E >= 0.38 de clareza absoluta para ser eleito fundamental.
    // Calibrado para piano/teclado captado por microfone:
    //   - C3 (261 Hz) detectado erroneamente como C2 (130 Hz): correlação real ~ 73-80% -> corrige.
    //   - C2 (130 Hz) com harmônico forte em C3: correlação harmônica ~ 55-68% -> não inverte.
    if (localPeakCorr >= Math.max(0.38, globalMax * 0.72)) {
      chosenPeriod = localPeakP;
      break;
    }
  }

  // 4. Interpolação parabólica refinada em torno de chosenPeriod para frequência contínua precisa
  let refinedPeriod = chosenPeriod;
  if (chosenPeriod > minPeriod && chosenPeriod < maxPeriod) {
    const alpha = correlations[chosenPeriod - 1];
    const beta = correlations[chosenPeriod];
    const gamma = correlations[chosenPeriod + 1];
    const denom = 2 * (2 * beta - alpha - gamma);
    if (Math.abs(denom) > 1e-6) {
      const delta = (gamma - alpha) / denom;
      if (Math.abs(delta) <= 1) {
        refinedPeriod = chosenPeriod + delta;
      }
    }
  }

  const freq = sampleRate / refinedPeriod;
  const clarity = correlations[chosenPeriod];
  return { freq, clarity, rms };
}

export class MicrophonePitchDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private buffer: Float32Array<ArrayBuffer> | null = null;
  private isListening = false;
  private sensitivityThreshold = 0.015; // Sensibilidade padrão: detecta notas suaves sem capturar ruído de fundo

  private onPitchCallback: ((pitch: DetectedPitch) => void) | null = null;
  private onVolumeCallback: ((rms: number) => void) | null = null;
  private onActiveNoteCallback: ((midi: number | null, noteName: string | null) => void) | null = null;
  private onOnsetCallback: ((rms: number) => void) | null = null;
  private lastDetectedMidi: number | null = null;
  private lastEmittedMidi: number | null = null;
  private lastEmittedTime = 0;
  private lastClapTime = 0;
  private prevRms = 0;
  private noteReleased = true;
  private stableCount = 0;
  private silenceFrameCount = 0;

  public async start(
    onPitch: (pitch: DetectedPitch) => void,
    onVolume?: (rms: number) => void,
    onActiveNote?: (midi: number | null, noteName: string | null) => void,
    deviceId?: string,
    onOnset?: (rms: number) => void
  ): Promise<boolean> {
    if (this.isListening) return true;

    try {
      // Solicita acesso ao dispositivo de áudio (microfone, interface USB ou entrada de linha/cabo)
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      };
      if (deviceId) {
        audioConstraints.deviceId = { exact: deviceId };
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx({ latencyHint: 'interactive' });
      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      this.buffer = new Float32Array(new ArrayBuffer(this.analyser.fftSize * 4)) as Float32Array<ArrayBuffer>;
      this.onPitchCallback = onPitch;
      this.onVolumeCallback = onVolume || null;
      this.onActiveNoteCallback = onActiveNote || null;
      this.onOnsetCallback = onOnset || null;
      this.isListening = true;
      this.noteReleased = true;
      this.lastEmittedMidi = null;
      this.silenceFrameCount = 0;
      this.lastClapTime = 0;

      this.loop();
      return true;
    } catch (err) {
      console.warn('Não foi possível acessar o dispositivo de áudio (microfone/USB/cabo):', err);
      this.stop();
      return false;
    }
  }

  public static async getAvailableAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return [];
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'audioinput');
    } catch {
      return [];
    }
  }

  constructor() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('harmonia_mic_sensitivity_percent');
        if (saved !== null) {
          const val = Number(saved);
          if (!isNaN(val) && val >= 0 && val <= 100) {
            this.sensitivityThreshold = MicrophonePitchDetector.percentToThreshold(val);
          }
        }
      }
    } catch {
      // fallback
    }
  }

  public static percentToThreshold(percent: number): number {
    const clamped = Math.max(0, Math.min(100, percent));
    return 0.055 - (clamped / 100) * (0.055 - 0.005);
  }

  public static thresholdToPercent(threshold: number): number {
    const percent = ((0.055 - threshold) / (0.055 - 0.005)) * 100;
    return Math.round(Math.max(0, Math.min(100, percent)));
  }

  public setSensitivityPercent(percent: number) {
    const thresh = MicrophonePitchDetector.percentToThreshold(percent);
    this.setSensitivity(thresh);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('harmonia_mic_sensitivity_percent', String(Math.round(percent)));
      }
    } catch {
      // fallback
    }
  }

  public getSensitivityPercent(): number {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('harmonia_mic_sensitivity_percent');
        if (saved !== null) {
          const val = Number(saved);
          if (!isNaN(val) && val >= 0 && val <= 100) return val;
        }
      }
    } catch {
      // fallback
    }
    return MicrophonePitchDetector.thresholdToPercent(this.sensitivityThreshold);
  }

  public setSensitivity(threshold: number) {
    this.sensitivityThreshold = Math.max(0.005, Math.min(0.08, threshold));
  }

  public getSensitivity(): number {
    return this.sensitivityThreshold;
  }

  public isActive(): boolean {
    return this.isListening;
  }

  public stop() {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.analyser = null;
    this.buffer = null;
    this.lastDetectedMidi = null;
    this.lastEmittedMidi = null;
    this.stableCount = 0;
    this.silenceFrameCount = 0;
    this.noteReleased = true;
    if (this.onActiveNoteCallback) {
      this.onActiveNoteCallback(null, null);
    }
  }

  private loop = () => {
    if (!this.isListening || !this.analyser || !this.buffer || !this.audioCtx) return;

    this.analyser.getFloatTimeDomainData(this.buffer);

    const result = detectPitchFromBuffer(this.buffer, this.audioCtx.sampleRate, this.sensitivityThreshold);
    const now = performance.now();

    if (result && this.onPitchCallback) {
      const midi = frequencyToMidi(result.freq);
      const noteName = midiToNoteName(midi);

      if (midi === this.lastDetectedMidi) {
        this.stableCount++;
      } else {
        this.lastDetectedMidi = midi;
        this.stableCount = 1;
      }

      // Estabilidade de 1 frame: resposta imediata ao ataque com sub-harmônico suprimido
      // O algoritmo de autocorrelação já é robusto o suficiente para dispensar espera dupla.
      if (this.stableCount >= 1) {
        const isDifferentNote = midi !== this.lastEmittedMidi;
        const isReattack = (now - this.lastEmittedTime > 200) && (result.rms > this.prevRms * 1.25);
        const isNewAttack = isDifferentNote || this.noteReleased || isReattack;

        if (isNewAttack) {
          this.lastEmittedMidi = midi;
          this.lastEmittedTime = now;
          this.noteReleased = false;
        }

        this.onPitchCallback({
          midi,
          noteName,
          frequency: Math.round(result.freq * 10) / 10,
          clarity: Math.round(result.clarity * 100),
          volumeRms: result.rms,
          isNewAttack,
        });

        // Notifica que esta nota está sendo ativamente ouvida no momento
        this.silenceFrameCount = 0;
        if (this.onActiveNoteCallback) {
          this.onActiveNoteCallback(midi, noteName);
        }
      }

      this.prevRms = result.rms;

      if (this.onVolumeCallback) {
        this.onVolumeCallback(result.rms);
      }
    } else {
      // Sinal abaixo do threshold de sensibilidade: incrementa frames de silêncio
      this.silenceFrameCount++;

      // Após 4 frames consecutivos de silêncio (~60ms), confirma término da nota ouvida.
      // 4 frames evita encerramento prematuro em notas com sustain natural (piano, violão).
      if (this.silenceFrameCount >= 4) {
        this.noteReleased = true;
        this.stableCount = 0;
        this.lastDetectedMidi = null;
        this.lastEmittedMidi = null;

        if (this.onActiveNoteCallback) {
          this.onActiveNoteCallback(null, null);
        }
      }

      if (this.onVolumeCallback && this.buffer) {
        let sum = 0;
        for (let i = 0; i < 256; i++) {
          sum += this.buffer[i] * this.buffer[i];
        }
        const rms = Math.sqrt(sum / 256);

        // Detecção de palmas e ataques percussivos acústicos (transiente súbito sem afinação tonal)
        const clapThreshold = Math.max(0.02, this.sensitivityThreshold * 1.4);
        if (
          rms > clapThreshold &&
          rms > (this.prevRms * 2.2 + 0.012) &&
          (now - this.lastClapTime > 150)
        ) {
          this.lastClapTime = now;
          if (this.onOnsetCallback) {
            this.onOnsetCallback(rms);
          }
        }

        this.prevRms = rms;
        this.onVolumeCallback(rms);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}

export const micPitchDetector = new MicrophonePitchDetector();
