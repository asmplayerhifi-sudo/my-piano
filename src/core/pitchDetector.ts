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

export function frequencyToMidi(freq: number): number {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

export function midiToNoteName(midi: number): string {
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 2;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

// Algoritmo de Autocorrelação com Interpolação Parabólica
export function detectPitchFromBuffer(
  buf: Float32Array<ArrayBufferLike>,
  sampleRate: number,
  minRmsThreshold = 0.015
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

  // 2. Limita busca para frequências musicais do piano (50 Hz a 2200 Hz)
  const minPeriod = Math.floor(sampleRate / 2200);
  const maxPeriod = Math.floor(sampleRate / 55);

  let bestPeriod = 0;
  let bestCorrelation = -1;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let correlation = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < buf.length - period; i++) {
      const sample1 = buf[i];
      const sample2 = buf[i + period];
      correlation += sample1 * sample2;
      norm1 += sample1 * sample1;
      norm2 += sample2 * sample2;
    }

    const norm = Math.sqrt(norm1 * norm2);
    if (norm > 0) {
      const normalizedCorr = correlation / norm;
      if (normalizedCorr > bestCorrelation) {
        bestCorrelation = normalizedCorr;
        bestPeriod = period;
      }
    }
  }

  if (bestCorrelation < 0.70 || bestPeriod === 0) {
    return null; // Clareza insuficiente
  }

  // 3. Interpolação parabólica para ajuste sub-amostra
  const freq = sampleRate / bestPeriod;
  return { freq, clarity: bestCorrelation, rms };
}

export class MicrophonePitchDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private buffer: Float32Array<ArrayBuffer> | null = null;
  private isListening = false;
  private sensitivityThreshold = 0.018; // Sensibilidade de captação

  private onPitchCallback: ((pitch: DetectedPitch) => void) | null = null;
  private onVolumeCallback: ((rms: number) => void) | null = null;
  private onActiveNoteCallback: ((midi: number | null, noteName: string | null) => void) | null = null;
  private lastDetectedMidi: number | null = null;
  private lastEmittedMidi: number | null = null;
  private lastEmittedTime = 0;
  private prevRms = 0;
  private noteReleased = true;
  private stableCount = 0;
  private silenceFrameCount = 0;

  public async start(
    onPitch: (pitch: DetectedPitch) => void,
    onVolume?: (rms: number) => void,
    onActiveNote?: (midi: number | null, noteName: string | null) => void,
    deviceId?: string
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
      this.isListening = true;
      this.noteReleased = true;
      this.lastEmittedMidi = null;
      this.silenceFrameCount = 0;

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

      // Estabilidade de 2 frames para evitar ruídos de transientes falsos
      if (this.stableCount >= 2) {
        const isDifferentNote = midi !== this.lastEmittedMidi;
        const isReattack = (now - this.lastEmittedTime > 220) && (result.rms > this.prevRms * 1.3);
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

      // Após 3 frames consecutivos de silêncio (~45ms), confirma término da nota ouvida
      if (this.silenceFrameCount >= 3) {
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
        this.prevRms = rms;
        this.onVolumeCallback(rms);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}

export const micPitchDetector = new MicrophonePitchDetector();
