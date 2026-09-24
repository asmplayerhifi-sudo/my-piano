import { soundEngine } from './soundEngine';
import type { TimeSignature } from './types';

export interface BeatEvent {
  beatNumber: number;        // 1-based (1, 2, 3, 4)
  isDownbeat: boolean;       // true if beatNumber === 1
  isAudible: boolean;        // false when in hidden mode
  time: number;              // AudioContext currentTime
  measureNumber: number;
}

type BeatCallback = (event: BeatEvent) => void;

class MetronomeScheduler {
  private bpm = 80;
  private timeSignature: TimeSignature = '4/4';
  private isPlaying = false;
  private timerId: number | null = null;
  private wakeLock: any = null;

  // Web Audio Lookahead timing
  private lookaheadMs = 25.0;      // Quão frequentemente checar notas futuras (ms)
  private scheduleAheadTime = 0.12; // Quanto tempo à frente agendar no AudioContext (s)
  private nextNoteTime = 0.0;
  private currentBeat = 0;         // 0 a beatsPerMeasure - 1
  private measureCount = 0;

  // Modo Metrônomo Oculto (2 compassos soando, 2 compassos mudos)
  private isHiddenMode = false;
  private hiddenCycleBars = 2;     // compassos audíveis / compassos mudos

  private callbacks: Set<BeatCallback> = new Set();

  public getBpm(): number {
    return this.bpm;
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(30, Math.min(260, Math.round(newBpm)));
  }

  public getTimeSignature(): TimeSignature {
    return this.timeSignature;
  }

  public setTimeSignature(ts: TimeSignature) {
    this.timeSignature = ts;
    this.currentBeat = 0;
  }

  public getBeatsPerMeasure(): number {
    switch (this.timeSignature) {
      case '2/4': return 2;
      case '3/4': return 3;
      case '4/4': return 4;
      case '6/8': return 6;
      default: return 4;
    }
  }

  public setHiddenMode(enabled: boolean) {
    this.isHiddenMode = enabled;
  }

  public isHiddenModeActive(): boolean {
    return this.isHiddenMode;
  }

  public subscribe(cb: BeatCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentBeat = 0;
    this.measureCount = 0;

    const currentTime = soundEngine.getCurrentTime();
    this.nextNoteTime = currentTime + 0.05; // Pequeno delay inicial para estabilizar

    // Solicita WakeLock para manter tela ligada (RNF05)
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // Navegadores sem suporte a WakeLock continuam normalmente
    }

    this.schedulerLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (this.wakeLock) {
      try {
        this.wakeLock.release();
        this.wakeLock = null;
      } catch {
        // ignorar
      }
    }
  }

  private nextNote() {
    const beatsPerMeasure = this.getBeatsPerMeasure();
    // Em 6/8, cada pulso é uma colcheia (andamento composto)
    const secondsPerBeat = (this.timeSignature === '6/8')
      ? (60.0 / this.bpm) / 1.5 
      : (60.0 / this.bpm);

    this.nextNoteTime += secondsPerBeat;
    this.currentBeat++;

    if (this.currentBeat >= beatsPerMeasure) {
      this.currentBeat = 0;
      this.measureCount++;
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    const isDownbeat = (beatNumber === 1);
    const is68 = this.timeSignature === '6/8';

    // Determina se este compasso está audível no Modo Metrônomo Oculto
    let isAudible = true;
    if (this.isHiddenMode) {
      const cyclePos = this.measureCount % (this.hiddenCycleBars * 2);
      isAudible = cyclePos < this.hiddenCycleBars;
    }

    if (isAudible) {
      // Em 6/8, os tempos 1 e 4 são os principais
      if (is68) {
        if (beatNumber === 1) {
          soundEngine.playMetronomeClick(true, false, time);
        } else if (beatNumber === 4) {
          soundEngine.playMetronomeClick(false, false, time);
        } else {
          soundEngine.playMetronomeClick(false, true, time);
        }
      } else {
        soundEngine.playMetronomeClick(isDownbeat, false, time);
      }
    }

    // Notifica subscribers (com timeout sincronizado para animação visual)
    const delayMs = Math.max(0, (time - soundEngine.getCurrentTime()) * 1000);
    window.setTimeout(() => {
      if (this.isPlaying) {
        const event: BeatEvent = {
          beatNumber,
          isDownbeat,
          isAudible,
          time,
          measureNumber: this.measureCount + 1,
        };
        this.callbacks.forEach(cb => cb(event));
      }
    }, delayMs);
  }

  private schedulerLoop = () => {
    if (!this.isPlaying) return;

    const currentTime = soundEngine.getCurrentTime();

    // Enquanto houver notas que precisam ser agendadas antes da janela futura
    while (this.nextNoteTime < currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat + 1, this.nextNoteTime);
      this.nextNote();
    }

    this.timerId = window.setTimeout(this.schedulerLoop, this.lookaheadMs);
  };
}

export const metronomeScheduler = new MetronomeScheduler();
