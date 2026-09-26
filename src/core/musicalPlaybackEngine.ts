/**
 * musicalPlaybackEngine.ts
 * Fonte única da verdade temporal e musical para reprodução da partitura,
 * cursor, áudio, teclado virtual e metrônomo sincronizado ao compasso.
 *
 * Contratos arquiteturais:
 * 1. Zero drift por cálculo analítico de fase: beat(t) = startBeat + (t - t0) * (BPM / 60)
 * 2. Metrônomo travado em fase ao compasso (downbeat no tempo 1 de cada compasso)
 * 3. Coincidência milimétrica: no instante em que o cursor cruza a nota, o som toca
 */

import type { ScoreNote } from './coursesData';
import { parseScoreTimeSignature } from '../components/score/scrolling/useScoreTimeline';
import { computeNoteOffsets } from '../components/score/scrolling/scoreGeometry';
import { soundEngine } from './soundEngine';
import { accompanimentSynthesizer } from './accompanimentSynthesizer';
import { metronomeEngine } from './metronomeEngine';
import type { ScoreSustainMode } from '../components/score/scrolling/types';

export interface MusicalTimePosition {
  currentBeat: number;        // Beat acumulado total (0-based)
  currentMeasure: number;     // Compasso (1-based: 1, 2, 3...)
  beatInMeasure: number;      // Tempo dentro do compasso (1-based: 1.0, 2.5, 4.0...)
  subdivision: number;        // Fração rítmica do tempo (0.0 a 1.0)
  isPlaying: boolean;
  bpm: number;
  timeSignature: string;
  beatsPerMeasure: number;
}

export type PositionTickListener = (pos: MusicalTimePosition) => void;
export type BeatTickListener = (measure: number, beat: number, isDownbeat: boolean) => void;
export type ActiveNotesListener = (midiNotes: number[]) => void;
export type PlaybackStateListener = (isPlaying: boolean) => void;
export type TrackEndedListener = () => void;

export class MusicalPlaybackEngine {
  private notes: ScoreNote[] = [];
  private noteOffsets: number[] = [];
  private timeSignature = '4/4';
  private beatsPerMeasure = 4;
  private bpm = 84;
  private isPlaying = false;

  private startBeat = 0;
  private startTimeMs = 0;
  private startAudioContextTime = 0;
  private lastEvaluatedBeat = -1;
  private playedNotes = new Set<number>();
  private playedChords = new Set<number>();
  private lastTickedIntegerBeat = -1;

  private animationFrameId: number | null = null;
  private timerId: number | null = null;

  private sustainMode: ScoreSustainMode = 'off';
  private instrument: 'piano' | 'guitar' = 'piano';
  private metronomeEnabled = false;
  private loopMode: 'end' | 'repeat' = 'end';

  private positionListeners = new Set<PositionTickListener>();
  private beatTickListeners = new Set<BeatTickListener>();
  private activeNotesListeners = new Set<ActiveNotesListener>();
  private stateListeners = new Set<PlaybackStateListener>();
  private trackEndedListeners = new Set<TrackEndedListener>();

  constructor() {
    this.updateTimeSignature(this.timeSignature);
  }

  public loadScore(notes: ScoreNote[], timeSignature = '4/4', bpm = 84) {
    // Se a mesma partitura (mesmas notas e compasso) já estiver carregada, preserva o playback em andamento
    // sem interrupções nem cliques/pops (Seamless Hot-Reload)
    const isSameNotes = this.notes === notes || (
      this.notes.length === notes.length &&
      this.notes.length > 0 &&
      this.notes[0]?.midi === notes[0]?.midi &&
      this.notes[0]?.measure === notes[0]?.measure &&
      this.notes[this.notes.length - 1]?.midi === notes[notes.length - 1]?.midi &&
      this.notes[this.notes.length - 1]?.measure === notes[notes.length - 1]?.measure
    );

    if (isSameNotes && this.timeSignature === timeSignature) {
      if (this.bpm !== Math.round(bpm)) {
        this.setBpm(bpm);
      }
      return;
    }

    soundEngine.stopAllNotes(0.025);
    this.notes = notes;
    this.updateTimeSignature(timeSignature);
    this.bpm = Math.max(30, Math.min(280, Math.round(bpm)));
    this.noteOffsets = computeNoteOffsets(notes, timeSignature);
    this.resetPlaybackPosition();
  }

  public setSustainMode(mode: ScoreSustainMode) {
    if (this.sustainMode !== mode) {
      this.sustainMode = mode;
      if (mode === 'off') {
        soundEngine.cancelSustainedNotes(0.025);
      }
    }
  }

  public setInstrument(inst: 'piano' | 'guitar') {
    if (this.instrument !== inst) {
      if (!this.isPlaying) {
        soundEngine.stopAllNotes(0.025);
      }
      this.instrument = inst;
    }
  }

  public setMetronomeEnabled(enabled: boolean) {
    this.metronomeEnabled = enabled;
    if (this.isPlaying) {
      if (enabled) {
        metronomeEngine.setPlaybackDriven(true);
      } else {
        accompanimentSynthesizer.silenceMetronome();
      }
    }
  }

  public isMetronomeEnabled(): boolean {
    return this.metronomeEnabled;
  }

  public setLoopMode(mode: 'end' | 'repeat') {
    this.loopMode = mode;
  }

  public updateTimeSignature(ts: string) {
    this.timeSignature = ts;
    const { beatsPerMeasure } = parseScoreTimeSignature(ts);
    this.beatsPerMeasure = beatsPerMeasure;
  }

  public getNotes(): ScoreNote[] {
    return this.notes;
  }

  public getNoteOffsets(): number[] {
    return this.noteOffsets;
  }

  public getBpm(): number {
    return this.bpm;
  }

  public getBeatsPerMeasure(): number {
    return this.beatsPerMeasure;
  }

  public getTimeSignature(): string {
    return this.timeSignature;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentBeat(): number {
    if (!this.isPlaying) return this.startBeat;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsedSec = (now - this.startTimeMs) / 1000;
    return this.startBeat + elapsedSec * (this.bpm / 60);
  }

  public getPositionForBeat(beat: number): MusicalTimePosition {
    const clampedBeat = Math.max(0, beat);
    const currentMeasure = Math.floor(clampedBeat / this.beatsPerMeasure) + 1;
    const beatInMeasure = (clampedBeat % this.beatsPerMeasure) + 1;
    const subdivision = beatInMeasure - Math.floor(beatInMeasure);

    return {
      currentBeat: clampedBeat,
      currentMeasure,
      beatInMeasure,
      subdivision,
      isPlaying: this.isPlaying,
      bpm: this.bpm,
      timeSignature: this.timeSignature,
      beatsPerMeasure: this.beatsPerMeasure,
    };
  }

  public getPosition(): MusicalTimePosition {
    return this.getPositionForBeat(this.getCurrentBeat());
  }

  public setBpm(newBpm: number) {
    const clamped = Math.max(30, Math.min(280, Math.round(newBpm)));
    if (this.bpm === clamped) return;

    if (this.isPlaying) {
      // Âncora de fase: preserva exatamente o beat atual sem drift
      const currentBeat = this.getCurrentBeat();
      this.startBeat = currentBeat;
      this.startTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const ctx = soundEngine.getAudioContext();
      this.startAudioContextTime = ctx ? ctx.currentTime : 0;
    }
    this.bpm = clamped;
    this.notifyPosition();
  }

  public play(fromBeat?: number) {
    if (fromBeat !== undefined) {
      this.startBeat = Math.max(0, fromBeat);
    }
    this.startTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const ctx = soundEngine.getAudioContext();
    this.startAudioContextTime = ctx ? ctx.currentTime : 0;
    this.isPlaying = true;
    this.lastEvaluatedBeat = this.startBeat - 0.001;
    this.lastTickedIntegerBeat = Math.floor(this.startBeat) - 1;

    // Se o metrônomo estiver ativado (pelo player ou pelo metronomeEngine), coloca
    // o metronomeEngine em modo playback-driven para evitar emissão simultânea de dois metrônomos
    const isMetronomeActive = this.metronomeEnabled || metronomeEngine.getSnapshot().isPlaying;
    this.metronomeEnabled = isMetronomeActive;
    if (isMetronomeActive) {
      metronomeEngine.setPlaybackDriven(true);
    }

    // Reconstrói notas já tocadas anteriores ao beat de início
    this.playedNotes.clear();
    this.playedChords.clear();
    for (let i = 0; i < this.notes.length; i++) {
      const offset = this.noteOffsets[i] ?? 0;
      if (offset < this.startBeat - 0.02) {
        this.playedNotes.add(i);
      }
    }

    this.startLoop();
    this.notifyState();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.startBeat = this.getCurrentBeat();
    this.isPlaying = false;
    this.stopLoop();
    this.notifyState();
    this.activeNotesListeners.forEach(fn => fn([]));
    soundEngine.stopAllNotes();
    metronomeEngine.setPlaybackDriven(false);
    accompanimentSynthesizer.silenceMetronome();
  }

  public stop() {
    this.pause();
    this.resetPlaybackPosition();
    this.notifyPosition();
  }

  public restart() {
    this.resetPlaybackPosition();
    if (this.isPlaying) {
      this.play(0);
    } else {
      this.notifyPosition();
    }
  }

  public seekToBeat(targetBeat: number) {
    const clamped = Math.max(0, targetBeat);
    this.startBeat = clamped;
    this.startTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const ctx = soundEngine.getAudioContext();
    this.startAudioContextTime = ctx ? ctx.currentTime : 0;
    this.lastEvaluatedBeat = clamped - 0.001;
    this.lastTickedIntegerBeat = Math.floor(clamped) - 1;

    this.playedNotes.clear();
    this.playedChords.clear();
    for (let i = 0; i < this.notes.length; i++) {
      const offset = this.noteOffsets[i] ?? 0;
      if (offset < clamped - 0.02) {
        this.playedNotes.add(i);
      }
    }

    this.notifyPosition();
  }

  public seekToMeasure(measure: number) {
    const targetBeat = (Math.max(1, measure) - 1) * this.beatsPerMeasure;
    this.seekToBeat(targetBeat);
  }

  public seekToNote(noteIndex: number) {
    if (noteIndex >= 0 && noteIndex < this.notes.length) {
      const targetBeat = this.noteOffsets[noteIndex] ?? 0;
      this.seekToBeat(targetBeat);
    }
  }

  public calculateNextMetronomeTick() {
    const currentBeat = this.getCurrentBeat();
    const nextIntegerBeat = Math.floor(currentBeat) + 1;
    const targetMeasure = Math.floor(nextIntegerBeat / this.beatsPerMeasure) + 1;
    const targetBeatInMeasure = (nextIntegerBeat % this.beatsPerMeasure) + 1;
    const isDownbeat = (nextIntegerBeat % this.beatsPerMeasure) === 0;

    const beatDiff = nextIntegerBeat - currentBeat;
    const delayMs = Math.max(0, (beatDiff * (60 / this.bpm)) * 1000);

    return {
      targetBeat: nextIntegerBeat,
      targetMeasure,
      targetBeatInMeasure,
      isDownbeat,
      delayMs,
    };
  }

  public calculateNextDownbeatTick() {
    const currentBeat = this.getCurrentBeat();
    // Próximo múltiplo exato de beatsPerMeasure
    const currentMeasureIndex = Math.floor(currentBeat / this.beatsPerMeasure);
    const nextDownbeat = (currentMeasureIndex + 1) * this.beatsPerMeasure;
    const targetMeasure = currentMeasureIndex + 2;

    return {
      targetBeat: nextDownbeat,
      targetMeasure,
      targetBeatInMeasure: 1,
      isDownbeat: true,
    };
  }

  private resetPlaybackPosition() {
    this.startBeat = 0;
    this.startTimeMs = 0;
    this.lastEvaluatedBeat = -1;
    this.lastTickedIntegerBeat = -1;
    this.playedNotes.clear();
    this.playedChords.clear();
    this.activeNotesListeners.forEach(fn => fn([]));
  }

  private startLoop() {
    this.stopLoop();

    const tick = () => {
      if (!this.isPlaying) return;
      this.evaluateTimeline();

      if (typeof requestAnimationFrame !== 'undefined') {
        this.animationFrameId = requestAnimationFrame(tick);
      } else {
        this.timerId = setTimeout(tick, 16) as unknown as number;
      }
    };

    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrameId = requestAnimationFrame(tick);
    } else {
      this.timerId = setTimeout(tick, 16) as unknown as number;
    }
  }

  private stopLoop() {
    if (this.animationFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Avalia notas e metrônomo correspondentes à janela de tempo transcorrida.
   */
  private evaluateTimeline() {
    const currentBeat = this.getCurrentBeat();
    const prevBeat = this.lastEvaluatedBeat;
    this.lastEvaluatedBeat = currentBeat;

    // 1. Ticks do Metrônomo (travado em fase no compasso e sincronizado com precisão de hardware WebAudio)
    const currentIntBeat = Math.floor(currentBeat);
    if (currentIntBeat > this.lastTickedIntegerBeat) {
      const ctx = soundEngine.getAudioContext();
      for (let b = this.lastTickedIntegerBeat + 1; b <= currentIntBeat; b++) {
        const m = Math.floor(b / this.beatsPerMeasure) + 1;
        const beatNum = (b % this.beatsPerMeasure) + 1;
        const isDownbeat = beatNum === 1;

        if (this.metronomeEnabled) {
          const soundType = metronomeEngine.getSnapshot().soundType || 'cowbell';
          const volume = (metronomeEngine.getSnapshot().volume / 100) * 0.95;
          const targetAudioTime = this.startAudioContextTime > 0
            ? this.startAudioContextTime + (b - this.startBeat) * (60 / this.bpm)
            : undefined;
          const playTime = ctx && targetAudioTime !== undefined
            ? Math.max(ctx.currentTime, targetAudioTime)
            : undefined;

          accompanimentSynthesizer.playMetronomeSound(
            soundType,
            isDownbeat,
            false,
            playTime,
            isDownbeat ? volume : volume * 0.8
          );
        }
        metronomeEngine.syncPlaybackBeat(m, beatNum, isDownbeat);
        this.beatTickListeners.forEach(fn => fn(m, beatNum, isDownbeat));
      }
      this.lastTickedIntegerBeat = currentIntBeat;
    }

    // 2. Disparo de Notas da Partitura
    const activeMidisInThisTick: number[] = [];
    const beatSec = 60 / this.bpm;
    const isNotesSustain = this.sustainMode === 'notes' || this.sustainMode === 'all';
    const isChordsSustain = this.sustainMode === 'chords' || this.sustainMode === 'all';

    for (let i = 0; i < this.notes.length; i++) {
      const noteOffset = this.noteOffsets[i] ?? 0;
      if (noteOffset <= currentBeat && noteOffset > prevBeat - 0.001 && !this.playedNotes.has(i)) {
        this.playedNotes.add(i);
        const n = this.notes[i];
        if (n) {
          const noteDurSec = (n.duration || 1) * beatSec;
          const isChordTone = n.clef === 'bass' || Boolean(n.chordName);
          let soundDuration: number;
          let noteSustained: boolean;

          if (isChordTone && isChordsSustain) {
            soundDuration = Math.max(noteDurSec * 1.5, 2.5);
            noteSustained = true;
          } else if (!isChordTone && isNotesSustain) {
            soundDuration = Math.max(noteDurSec * 1.4, 2.0);
            noteSustained = true;
          } else {
            soundDuration = Math.max(0.15, noteDurSec * 0.6);
            noteSustained = false;
          }

          if (this.instrument === 'guitar') {
            soundEngine.playGuitarPluck(n.midi, soundDuration, undefined, 0.8, noteSustained);
          } else {
            soundEngine.playPianoNote(n.midi, soundDuration, undefined, 0.8, noteSustained);
          }
          activeMidisInThisTick.push(n.midi);
        }
      }
    }

    if (activeMidisInThisTick.length > 0) {
      this.activeNotesListeners.forEach(fn => fn(activeMidisInThisTick));
    }

    // 3. Verifica Fim da Obra (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.2)
    const totalScoreBeats = this.notes.reduce((max, n, i) => {
      const off = this.noteOffsets[i] ?? 0;
      return Math.max(max, off + (n.duration || 1));
    }, 0);

    if (totalScoreBeats > 0 && currentBeat >= totalScoreBeats + 0.3) {
      if (this.loopMode === 'repeat') {
        this.play(0);
      } else {
        this.stop();
        this.notifyTrackEnded();
        return;
      }
    }

    this.notifyPosition();
  }

  // Inscrições e Observadores
  public onPositionTick(listener: PositionTickListener): () => void {
    this.positionListeners.add(listener);
    return () => this.positionListeners.delete(listener);
  }

  public onBeatTick(listener: BeatTickListener): () => void {
    this.beatTickListeners.add(listener);
    return () => this.beatTickListeners.delete(listener);
  }

  public onActiveNotesChange(listener: ActiveNotesListener): () => void {
    this.activeNotesListeners.add(listener);
    return () => this.activeNotesListeners.delete(listener);
  }

  public onStateChange(listener: PlaybackStateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public onTrackEnded(listener: TrackEndedListener): () => void {
    this.trackEndedListeners.add(listener);
    return () => this.trackEndedListeners.delete(listener);
  }

  private notifyPosition() {
    const pos = this.getPosition();
    this.positionListeners.forEach(fn => fn(pos));
  }

  private notifyState() {
    this.stateListeners.forEach(fn => fn(this.isPlaying));
  }

  private notifyTrackEnded() {
    this.trackEndedListeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Erro em trackEndedListener:', err);
      }
    });
  }
}

// Singleton oficial exportado
export const musicalPlaybackEngine = new MusicalPlaybackEngine();
