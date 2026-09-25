/**
 * Adaptador de compatibilidade para MetronomeScheduler.
 * Delega o ciclo de tempo, precisão Web Audio e agendamento ao accompanimentStore centralizado.
 */

import { accompanimentStore } from './accompanimentStore';
import { soundEngine } from './soundEngine';
import type { TimeSignature } from './types';

export interface BeatEvent {
  beatNumber: number;        // 1-based (1, 2, 3, 4)
  isDownbeat: boolean;       // true se beatNumber === 1
  isAudible: boolean;        // false no modo oculto durante os compassos silenciosos
  time: number;              // AudioContext currentTime
  measureNumber: number;
}

type BeatCallback = (event: BeatEvent) => void;

class MetronomeSchedulerAdapter {
  private callbacks: Set<BeatCallback> = new Set();
  private lastReportedBeat = -1;
  private lastReportedMeasure = -1;

  constructor() {
    // Sincroniza com as mudanças do store
    accompanimentStore.subscribe(() => {
      const snap = accompanimentStore.getSnapshot();
      if (!snap.isPlaying) {
        this.lastReportedBeat = -1;
        this.lastReportedMeasure = -1;
        return;
      }

      if (snap.currentBeat !== this.lastReportedBeat || snap.currentMeasure !== this.lastReportedMeasure) {
        this.lastReportedBeat = snap.currentBeat;
        this.lastReportedMeasure = snap.currentMeasure;

        const event: BeatEvent = {
          beatNumber: snap.currentBeat,
          isDownbeat: snap.currentBeat === 1,
          isAudible: snap.isAudibleMeasure,
          time: soundEngine.getCurrentTime(),
          measureNumber: snap.currentMeasure,
        };

        this.callbacks.forEach((cb) => {
          try {
            cb(event);
          } catch (e) {
            console.error('Erro em subscriber do metronomeScheduler:', e);
          }
        });
      }
    });
  }

  public getBpm(): number {
    return accompanimentStore.getSnapshot().bpm;
  }

  public setBpm(newBpm: number) {
    accompanimentStore.setBpm(newBpm);
  }

  public getTimeSignature(): TimeSignature {
    return accompanimentStore.getSnapshot().timeSignature;
  }

  public setTimeSignature(ts: TimeSignature) {
    accompanimentStore.setTimeSignature(ts);
  }

  public getBeatsPerMeasure(): number {
    return accompanimentStore.getBeatsPerMeasure();
  }

  public setHiddenMode(enabled: boolean) {
    if (accompanimentStore.getSnapshot().hiddenMode !== enabled) {
      accompanimentStore.toggleHiddenMode();
    }
  }

  public isHiddenModeActive(): boolean {
    return accompanimentStore.getSnapshot().hiddenMode;
  }

  public subscribe(cb: BeatCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public getIsPlaying(): boolean {
    return accompanimentStore.getSnapshot().isPlaying;
  }

  public async start() {
    await accompanimentStore.start();
  }

  public stop() {
    accompanimentStore.stop();
  }
}

export const metronomeScheduler = new MetronomeSchedulerAdapter();
