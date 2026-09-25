/**
 * MetronomeEngine
 * Motor de metrônomo de alta precisão baseado em Web Audio API com lookahead scheduling.
 * Suporta andamentos de 30 a 280 BPM, múltiplos compassos, timbres orgânicos e sincronização bidirecional.
 */

import { useSyncExternalStore } from 'react';
import { soundEngine } from './soundEngine';
import { accompanimentSynthesizer, type MetronomeSoundType } from './accompanimentSynthesizer';

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  timeSignature: string;
  beatsPerMeasure: number;
  currentBeat: number;
  soundType: MetronomeSoundType;
  volume: number; // 0 a 100
  isDownbeat: boolean;
}

export type MetronomeListener = (state: MetronomeState) => void;
export type BeatTickListener = (beatNumber: number, isDownbeat: boolean) => void;

class MetronomeEngine {
  private state: MetronomeState = {
    isPlaying: false,
    bpm: 90,
    timeSignature: '4/4',
    beatsPerMeasure: 4,
    currentBeat: 1,
    soundType: 'keyboard-sidestick',
    volume: 85,
    isDownbeat: true,
  };

  private nextNoteTime = 0.0;
  private timerId: number | null = null;
  private lookaheadMs = 25;
  private scheduleAheadSec = 0.1;
  private scheduledBeat = 1;
  private visualTimeouts: number[] = [];

  private subscribers = new Set<MetronomeListener>();
  private beatTickListeners = new Set<BeatTickListener>();

  constructor() {
    this.updateBeatsPerMeasure();
  }

  private updateBeatsPerMeasure(timeSignature = this.state.timeSignature): number {
    const parts = timeSignature.split('/');
    return parseInt(parts[0], 10) || 4;
  }

  public getSnapshot = (): MetronomeState => {
    return this.state;
  };

  public subscribe = (listener: MetronomeListener): (() => void) => {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  };

  public onBeatTick = (cb: BeatTickListener): (() => void) => {
    this.beatTickListeners.add(cb);
    return () => this.beatTickListeners.delete(cb);
  };

  private notify() {
    this.subscribers.forEach((fn) => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Erro em subscriber do metronomeEngine:', err);
      }
    });
  }

  /**
   * Atualização imutável estrita de estado.
   * Cria sempre uma nova referência de objeto, essencial para o correto
   * funcionamento do `useSyncExternalStore` do React 18/19.
   */
  private updateState(updater: Partial<MetronomeState>) {
    this.state = { ...this.state, ...updater };
    this.notify();
  }

  public async start(initialOptions?: { bpm?: number; timeSignature?: string; soundType?: MetronomeSoundType }) {
    await soundEngine.ensureAudioReady();

    const newBpm = initialOptions?.bpm && initialOptions.bpm > 0
      ? Math.max(30, Math.min(280, Math.round(initialOptions.bpm)))
      : this.state.bpm;
    const newTimeSig = initialOptions?.timeSignature || this.state.timeSignature;
    const newBeats = this.updateBeatsPerMeasure(newTimeSig);
    const newSoundType = initialOptions?.soundType || this.state.soundType;

    if (this.state.isPlaying) {
      this.updateState({
        bpm: newBpm,
        timeSignature: newTimeSig,
        beatsPerMeasure: newBeats,
        soundType: newSoundType,
      });
      return;
    }

    this.clearVisualTimeouts();
    this.scheduledBeat = 1;

    const ctx = soundEngine.getAudioContext();
    const now = ctx ? ctx.currentTime : 0;
    this.nextNoteTime = now + 0.05;

    this.timerId = window.setInterval(() => {
      this.scheduler();
    }, this.lookaheadMs);

    this.updateState({
      isPlaying: true,
      bpm: newBpm,
      timeSignature: newTimeSig,
      beatsPerMeasure: newBeats,
      soundType: newSoundType,
      currentBeat: 1,
      isDownbeat: true,
    });
  }

  public stop() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.clearVisualTimeouts();
    this.updateState({
      isPlaying: false,
      currentBeat: 1,
      isDownbeat: true,
    });
  }

  public async toggle(initialOptions?: { bpm?: number; timeSignature?: string }) {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      await this.start(initialOptions);
    }
  }

  public setBpm(newBpm: number) {
    const clamped = Math.max(30, Math.min(280, Math.round(newBpm)));
    if (this.state.bpm !== clamped) {
      this.updateState({ bpm: clamped });
    }
  }

  public setTimeSignature(ts: string) {
    if (this.state.timeSignature !== ts) {
      const beats = this.updateBeatsPerMeasure(ts);
      this.updateState({
        timeSignature: ts,
        beatsPerMeasure: beats,
        currentBeat: this.state.currentBeat > beats ? 1 : this.state.currentBeat,
      });
    }
  }

  public setSoundType(sound: MetronomeSoundType) {
    if (this.state.soundType !== sound) {
      this.updateState({ soundType: sound });
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(vol)));
    if (this.state.volume !== clamped) {
      this.updateState({ volume: clamped });
    }
  }

  private clearVisualTimeouts() {
    this.visualTimeouts.forEach((t) => window.clearTimeout(t));
    this.visualTimeouts = [];
  }

  private scheduler() {
    const ctx = soundEngine.getAudioContext();
    if (!ctx) return;

    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadSec) {
      this.scheduleBeat(this.scheduledBeat, this.nextNoteTime);
      this.advanceBeat();
    }
  }

  private scheduleBeat(beatNum: number, time: number) {
    const isDownbeat = beatNum === 1;

    // Emite áudio do metrônomo no tempo exato
    accompanimentSynthesizer.playMetronomeSound(
      this.state.soundType,
      isDownbeat,
      false,
      time,
      (this.state.volume / 100) * 0.95
    );

    // Sincroniza indicador visual rigorosamente no momento do clique sonoro
    const ctx = soundEngine.getAudioContext();
    const delayMs = ctx ? Math.max(0, (time - ctx.currentTime) * 1000) : 0;

    const timeout = window.setTimeout(() => {
      if (!this.state.isPlaying) return;
      this.updateState({
        currentBeat: beatNum,
        isDownbeat,
      });

      this.beatTickListeners.forEach((fn) => {
        try {
          fn(beatNum, isDownbeat);
        } catch (e) {
          console.error('Erro em beatTickListener:', e);
        }
      });
    }, delayMs);

    this.visualTimeouts.push(timeout);
    if (this.visualTimeouts.length > 20) {
      this.visualTimeouts.shift();
    }
  }

  private advanceBeat() {
    const parts = this.state.timeSignature.split('/');
    const den = parseInt(parts[1], 10) || 4;
    const num = parseInt(parts[0], 10) || 4;

    let secondsPerBeat = 60.0 / this.state.bpm;
    if (den === 8 && num >= 6) {
      secondsPerBeat = (60.0 / this.state.bpm) / 1.5;
    }

    this.nextNoteTime += secondsPerBeat;
    this.scheduledBeat = (this.scheduledBeat % this.state.beatsPerMeasure) + 1;
  }
}

export const metronomeEngine = new MetronomeEngine();

/** Hook reativo para componentes React utilizarem o estado do metrônomo instantaneamente */
export function useMetronome(): MetronomeState {
  return useSyncExternalStore(
    metronomeEngine.subscribe,
    metronomeEngine.getSnapshot,
    metronomeEngine.getSnapshot
  );
}
