/**
 * Store Reativo e Engine de Agendamento de Metrônomo e Acompanhamento Musical.
 * Utiliza o relógio de alta precisão do Web Audio API (currentTime) com Lookahead Scheduler.
 * Garante zero-drift de sincronismo e controle independente por canais (Mute, Solo, Volume).
 */

import { useSyncExternalStore } from 'react';
import { soundEngine } from './soundEngine';
import { drumSynthesizer } from './drumSynthesizer';
import {
  accompanimentSynthesizer,
  type MetronomeSoundType,
} from './accompanimentSynthesizer';
import {
  ACCOMPANIMENT_STYLES,
  type AccompanimentStyleId,
  type AccompanimentStyleDefinition,
} from './accompanimentStyles';
import {
  buildProgressionChords,
  type HarmonicChord,
} from './harmonicProgressions';
import type { TimeSignature } from './types';

export type MetronomeSubdivision = 'quarter' | 'eighth' | 'sixteenth' | 'triplet';

export interface ChannelControl {
  volume: number; // 0 a 100
  muted: boolean;
  solo: boolean;
}

export interface AccompanimentState {
  // Estado de Reprodução
  isPlaying: boolean;
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: MetronomeSubdivision;

  // Metrônomo
  metronomeSound: MetronomeSoundType;
  metronomeVolume: number; // 0 a 100
  muteMetronomeMaster: boolean;
  muteDownbeat: boolean;      // Muta o tempo 1 (acento/forte)
  muteUpbeats: boolean;       // Muta os tempos 2, 3, 4 (fracos)
  muteSubdivisions: boolean;  // Muta as subdivisões intermediárias
  hiddenMode: boolean;        // 2 compassos com som, 2 compassos sem som

  // Acompanhamento
  accompanimentEnabled: boolean;
  accompanimentVolume: number; // 0 a 100
  styleId: AccompanimentStyleId;
  rootKey: string;
  scaleMode: 'major' | 'minor';
  progressionId: string;

  // Canais do Acompanhamento
  drums: ChannelControl;
  bass: ChannelControl;
  chords: ChannelControl;
  arpeggio: ChannelControl;

  // Status Dinâmico em Execução (para UI)
  currentBeat: number;        // 1 a beatsPerMeasure
  currentMeasure: number;
  currentChordIndex: number;
  isAudibleMeasure: boolean;
}

type Listener = () => void;

const STORAGE_KEY = 'harmonia_accompaniment_config';

class AccompanimentStore {
  private state: AccompanimentState;
  private listeners: Set<Listener> = new Set();

  // Scheduler Web Audio Timing
  private timerId: number | null = null;
  private lookaheadMs = 25.0;       // Intervalo de verificação (ms)
  private scheduleAheadTime = 0.12;  // Janela futura agendada (s)
  private nextStepTime = 0.0;
  private currentStep = 0;          // Índice do step no compasso atual
  private measureCounter = 0;
  private wakeLock: any = null;

  // Tap tempo buffer
  private tapTimes: number[] = [];

  constructor() {
    this.state = this.loadInitialState();
    if (typeof window !== 'undefined') {
      window.addEventListener('harmonia-metronome-sound-changed', (e: Event) => {
        const customEvent = e as CustomEvent<MetronomeSoundType>;
        const sound = customEvent.detail;
        if (sound && this.state.metronomeSound !== sound) {
          this.updateState({ metronomeSound: sound });
        }
      });
    }
  }

  private loadInitialState(): AccompanimentState {
    const dedicatedSound = typeof localStorage !== 'undefined' ? localStorage.getItem('harmonia_metronome_sound') : null;
    const initialSound: MetronomeSoundType =
      dedicatedSound === 'cowbell' || dedicatedSound === 'woodblock' || dedicatedSound === 'keyboard-sidestick' || dedicatedSound === 'mechanical' || dedicatedSound === 'digital'
        ? dedicatedSound
        : 'cowbell'; // Padrão soberano: cowbell

    const defaultState: AccompanimentState = {
      isPlaying: false,
      bpm: 90,
      timeSignature: '4/4',
      subdivision: 'quarter',

      metronomeSound: initialSound,
      metronomeVolume: 80,
      muteMetronomeMaster: false,
      muteDownbeat: false,
      muteUpbeats: false,
      muteSubdivisions: false,
      hiddenMode: false,

      accompanimentEnabled: true,
      accompanimentVolume: 85,
      styleId: 'pop_rock',
      rootKey: 'C',
      scaleMode: 'major',
      progressionId: 'pop_4chords',

      drums: { volume: 85, muted: false, solo: false },
      bass: { volume: 90, muted: false, solo: false },
      chords: { volume: 75, muted: false, solo: false },
      arpeggio: { volume: 70, muted: false, solo: false },

      currentBeat: 1,
      currentMeasure: 1,
      currentChordIndex: 0,
      isAudibleMeasure: true,
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          metronomeSound: dedicatedSound ? initialSound : (parsed.metronomeSound === 'digital' ? 'cowbell' : (parsed.metronomeSound || 'cowbell')),
          isPlaying: false,
          currentBeat: 1,
          currentMeasure: 1,
          currentChordIndex: 0,
        };
      }
    } catch {
      // Ignora erro de parsing
    }

    return defaultState;
  }

  private saveState() {
    try {
      const {
        bpm,
        timeSignature,
        subdivision,
        metronomeSound,
        metronomeVolume,
        muteMetronomeMaster,
        muteDownbeat,
        muteUpbeats,
        muteSubdivisions,
        hiddenMode,
        accompanimentEnabled,
        accompanimentVolume,
        styleId,
        rootKey,
        scaleMode,
        progressionId,
        drums,
        bass,
        chords,
        arpeggio,
      } = this.state;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          bpm,
          timeSignature,
          subdivision,
          metronomeSound,
          metronomeVolume,
          muteMetronomeMaster,
          muteDownbeat,
          muteUpbeats,
          muteSubdivisions,
          hiddenMode,
          accompanimentEnabled,
          accompanimentVolume,
          styleId,
          rootKey,
          scaleMode,
          progressionId,
          drums,
          bass,
          chords,
          arpeggio,
        })
      );
    } catch {
      // localStorage pode estar desativado
    }
  }

  // ── Gestão de Assinaturas (useSyncExternalStore) ─────────────────────────

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): AccompanimentState => {
    return this.state;
  };

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  private updateState(updater: Partial<AccompanimentState> | ((prev: AccompanimentState) => Partial<AccompanimentState>)) {
    const partial = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...partial };
    this.notify();
    this.saveState();
  }

  // ── Controles de Metrônomo & Tempo ───────────────────────────────────────

  public setBpm(newBpm: number) {
    const clamped = Math.max(30, Math.min(280, Math.round(newBpm)));
    this.updateState({ bpm: clamped });
  }

  public setTimeSignature(ts: TimeSignature) {
    this.updateState({ timeSignature: ts });
  }

  public setSubdivision(sub: MetronomeSubdivision) {
    this.updateState({ subdivision: sub });
  }

  public setMetronomeSound(sound: MetronomeSoundType, preview = false) {
    if (this.state.metronomeSound !== sound) {
      this.updateState({ metronomeSound: sound });
      this.saveState();
      try {
        localStorage.setItem('harmonia_metronome_sound', sound);
      } catch {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('harmonia-metronome-sound-changed', { detail: sound })
        );
      }
    }
    if (preview) {
      accompanimentSynthesizer.playMetronomeSound(
        sound,
        true,
        false,
        undefined,
        (this.state.metronomeVolume / 100) * 0.95
      );
    }
  }

  public setMetronomeVolume(vol: number) {
    this.updateState({ metronomeVolume: Math.max(0, Math.min(100, Math.round(vol))) });
  }

  public toggleMuteMetronomeMaster() {
    this.updateState((s) => ({ muteMetronomeMaster: !s.muteMetronomeMaster }));
  }

  public toggleMuteDownbeat() {
    this.updateState((s) => ({ muteDownbeat: !s.muteDownbeat }));
  }

  public toggleMuteUpbeats() {
    this.updateState((s) => ({ muteUpbeats: !s.muteUpbeats }));
  }

  public toggleMuteSubdivisions() {
    this.updateState((s) => ({ muteSubdivisions: !s.muteSubdivisions }));
  }

  public toggleHiddenMode() {
    this.updateState((s) => ({ hiddenMode: !s.hiddenMode }));
  }

  public tapTempo() {
    const now = performance.now();
    this.tapTimes = [...this.tapTimes, now].slice(-5);

    if (this.tapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < this.tapTimes.length; i++) {
        intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calcBpm = Math.round(60000 / avgInterval);
      this.setBpm(calcBpm);
    }
  }

  // ── Controles de Acompanhamento ──────────────────────────────────────────

  public toggleAccompaniment() {
    this.updateState((s) => ({ accompanimentEnabled: !s.accompanimentEnabled }));
  }

  public setAccompanimentVolume(vol: number) {
    this.updateState({ accompanimentVolume: Math.max(0, Math.min(100, Math.round(vol))) });
  }

  public setStyle(id: AccompanimentStyleId) {
    const style = ACCOMPANIMENT_STYLES.find((s) => s.id === id);
    if (style) {
      this.updateState({
        styleId: id,
        timeSignature: style.timeSignature,
      });
    }
  }

  public setRootKey(key: string) {
    this.updateState({ rootKey: key });
  }

  public setScaleMode(mode: 'major' | 'minor') {
    this.updateState({ scaleMode: mode });
  }

  public setProgression(id: string) {
    this.updateState({ progressionId: id });
  }

  public setChannelVolume(channel: 'drums' | 'bass' | 'chords' | 'arpeggio', vol: number) {
    this.updateState((s) => ({
      [channel]: { ...s[channel], volume: Math.max(0, Math.min(100, Math.round(vol))) },
    }));
  }

  public toggleChannelMute(channel: 'drums' | 'bass' | 'chords' | 'arpeggio') {
    this.updateState((s) => ({
      [channel]: { ...s[channel], muted: !s[channel].muted },
    }));
  }

  public toggleChannelSolo(channel: 'drums' | 'bass' | 'chords' | 'arpeggio') {
    this.updateState((s) => {
      const current = s[channel].solo;
      return {
        drums: { ...s.drums, solo: channel === 'drums' ? !current : false },
        bass: { ...s.bass, solo: channel === 'bass' ? !current : false },
        chords: { ...s.chords, solo: channel === 'chords' ? !current : false },
        arpeggio: { ...s.arpeggio, solo: channel === 'arpeggio' ? !current : false },
      };
    });
  }

  // ── Cálculos Rítmicos ───────────────────────────────────────────────────

  public getBeatsPerMeasure(): number {
    switch (this.state.timeSignature) {
      case '2/4': return 2;
      case '3/4': return 3;
      case '4/4': return 4;
      case '5/4': return 5;
      case '6/8': return 6;
      default: return 4;
    }
  }

  public getSubdivisionsPerBeat(): number {
    if (this.state.timeSignature === '6/8') return 1; // em 6/8 o pulso é a colcheia
    switch (this.state.subdivision) {
      case 'quarter': return 1;
      case 'eighth': return 2;
      case 'sixteenth': return 4;
      case 'triplet': return 3;
      default: return 1;
    }
  }

  public getTempoTerm(): string {
    const b = this.state.bpm;
    if (b < 40) return 'Grave';
    if (b < 60) return 'Largo';
    if (b < 66) return 'Larghetto';
    if (b < 76) return 'Adagio';
    if (b < 108) return 'Andante';
    if (b < 120) return 'Moderato';
    if (b < 168) return 'Allegro';
    if (b < 200) return 'Vivace';
    return 'Presto';
  }

  public getCurrentChordsList(): HarmonicChord[] {
    return buildProgressionChords(
      this.state.rootKey,
      this.state.scaleMode,
      this.state.progressionId
    );
  }

  // ── Engine de Reprodução & Scheduler Lookahead ───────────────────────────

  public async start() {
    if (this.state.isPlaying) return;
    await soundEngine.ensureAudioReady();

    this.currentStep = 0;
    this.measureCounter = 0;

    const ctxTime = soundEngine.getCurrentTime();
    this.nextStepTime = ctxTime + 0.05; // Pequeno delay de estabilização

    this.updateState({
      isPlaying: true,
      currentBeat: 1,
      currentMeasure: 1,
      currentChordIndex: 0,
      isAudibleMeasure: true,
    });

    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // Ignora erro de wakeLock
    }

    this.schedulerLoop();
  }

  public stop() {
    if (!this.state.isPlaying) return;

    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (this.wakeLock) {
      try {
        this.wakeLock.release();
        this.wakeLock = null;
      } catch {
        // Ignora erro
      }
    }

    this.updateState({
      isPlaying: false,
      currentBeat: 1,
      currentMeasure: 1,
      currentChordIndex: 0,
    });
  }

  public toggle() {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Determina a duração em segundos de cada step (passo da subdivisão)
   */
  private getSecondsPerStep(style: AccompanimentStyleDefinition): number {
    const is68 = this.state.timeSignature === '6/8';
    // Tempo básico de 1 semínima (ou colcheia pontuada em 6/8)
    const secondsPerQuarter = 60.0 / this.state.bpm;

    if (is68) {
      // Em 6/8, cada colcheia dura 1/3 de uma semínima pontuada
      return secondsPerQuarter / 1.5;
    }

    // Passos por compasso do estilo (geralmente 8 colcheias em 4/4)
    const beatsPerMeasure = this.getBeatsPerMeasure();
    const stepsInMeasure = style.stepsPerMeasure || (beatsPerMeasure * 2);
    const totalMeasureSeconds = beatsPerMeasure * secondsPerQuarter;
    return totalMeasureSeconds / stepsInMeasure;
  }

  /**
   * Agenda áudio e eventos visuais para um step específico na timeline Web Audio
   */
  private scheduleStep(stepIndex: number, time: number, style: AccompanimentStyleDefinition) {
    const beatsPerMeasure = this.getBeatsPerMeasure();
    const stepsPerMeasure = style.stepsPerMeasure;
    const stepsPerBeat = stepsPerMeasure / beatsPerMeasure;

    const beatNumber = Math.floor(stepIndex / stepsPerBeat) + 1;
    const isBeatStart = (stepIndex % stepsPerBeat) === 0;
    const isDownbeat = (beatNumber === 1 && isBeatStart);

    // Modo Oculto (2 compassos soando, 2 compassos mudos)
    let isAudibleMeasure = true;
    if (this.state.hiddenMode) {
      const cycle = this.measureCounter % 4;
      isAudibleMeasure = cycle < 2;
    }

    const chords = this.getCurrentChordsList();
    const chordIndex = this.measureCounter % chords.length;
    const currentChord = chords[chordIndex] || chords[0];

    const secondsPerBeat = (this.state.timeSignature === '6/8')
      ? (60.0 / this.state.bpm) / 1.5
      : (60.0 / this.state.bpm);

    // ── 1. Metrônomo Áudio ────────────────────────────────────────────────
    if (!this.state.muteMetronomeMaster && isAudibleMeasure) {
      const metVol = this.state.metronomeVolume / 100;

      if (isDownbeat) {
        if (!this.state.muteDownbeat) {
          accompanimentSynthesizer.playMetronomeSound(
            this.state.metronomeSound,
            true,
            false,
            time,
            metVol
          );
        }
      } else if (isBeatStart) {
        if (!this.state.muteUpbeats) {
          accompanimentSynthesizer.playMetronomeSound(
            this.state.metronomeSound,
            false,
            false,
            time,
            metVol
          );
        }
      } else {
        // Subdivisão intermediária
        if (!this.state.muteSubdivisions) {
          accompanimentSynthesizer.playMetronomeSound(
            this.state.metronomeSound,
            false,
            true,
            time,
            metVol * 0.75
          );
        }
      }
    }

    // ── 2. Acompanhamento Musical Áudio ────────────────────────────────────
    if (this.state.accompanimentEnabled && isAudibleMeasure) {
      const masterAccVol = this.state.accompanimentVolume / 100;

      // Resolução de Solos: se algum canal estiver em solo, apenas ele soa
      const anySolo =
        this.state.drums.solo ||
        this.state.bass.solo ||
        this.state.chords.solo ||
        this.state.arpeggio.solo;

      const isChannelActive = (ch: ChannelControl) => {
        if (anySolo) return ch.solo && !ch.muted;
        return !ch.muted;
      };

      // 2.1 BATERIA
      if (isChannelActive(this.state.drums)) {
        const drumVol = (this.state.drums.volume / 100) * masterAccVol;
        const dStep = style.drumPattern.find((p) => p.step === stepIndex);

        if (dStep && drumVol > 0.01) {
          const v = (dStep.velocity ?? 0.8) * drumVol;
          if (dStep.kick) drumSynthesizer.playKick(time, v);
          if (dStep.snare) drumSynthesizer.playSnare(time, v);
          if (dStep.hihat) drumSynthesizer.playHiHat(time, dStep.hihat === 'open', v);
          if (dStep.rimshot) drumSynthesizer.playRimshot(time, v);
          if (dStep.shaker) drumSynthesizer.playShaker(time, v);
          if (dStep.surdo) drumSynthesizer.playSurdo(time, isDownbeat, v);
          if (dStep.ride) drumSynthesizer.playRide(time, v);
          if (dStep.clap) drumSynthesizer.playClap(time, v);
        }
      }

      // 2.2 BAIXO
      if (isChannelActive(this.state.bass) && currentChord) {
        const bassVol = (this.state.bass.volume / 100) * masterAccVol;
        const bStep = style.bassPattern.find((p) => p.step === stepIndex);

        if (bStep && bassVol > 0.01) {
          let bassMidi = currentChord.rootMidi;
          if (bStep.type === 'fifth') bassMidi = currentChord.fifthMidi;
          else if (bStep.type === 'octave') bassMidi = currentChord.rootMidi + 12;
          else if (bStep.type === 'third') bassMidi = currentChord.rootMidi + 4;
          else if (bStep.type === 'approach') bassMidi = currentChord.rootMidi - 1;

          accompanimentSynthesizer.playBassNote(
            bassMidi,
            bStep.durationBeats,
            secondsPerBeat,
            time,
            (bStep.velocity ?? 0.85) * bassVol
          );
        }
      }

      // 2.3 ACORDES / HARMONIA
      if (isChannelActive(this.state.chords) && currentChord) {
        const chordVol = (this.state.chords.volume / 100) * masterAccVol;
        const cStep = style.chordPattern.find((p) => p.step === stepIndex);

        if (cStep && chordVol > 0.01) {
          accompanimentSynthesizer.playHarmonicChord(
            currentChord.voicingMidi,
            style.chordInstrument,
            cStep.durationBeats,
            secondsPerBeat,
            time,
            (cStep.velocity ?? 0.8) * chordVol
          );
        }
      }

      // 2.4 ARPEJO
      if (isChannelActive(this.state.arpeggio) && currentChord) {
        const arpVol = (this.state.arpeggio.volume / 100) * masterAccVol;
        const aStep = style.arpeggioPattern.find((p) => p.step === stepIndex);

        if (aStep && arpVol > 0.01) {
          const notes = currentChord.arpeggioMidi;
          const noteMidi = notes[aStep.noteIndex % notes.length] || notes[0];

          accompanimentSynthesizer.playArpeggioNote(
            noteMidi,
            aStep.durationBeats,
            secondsPerBeat,
            time,
            (aStep.velocity ?? 0.75) * arpVol
          );
        }
      }
    }

    // ── 3. Sincronização de Estado da UI ───────────────────────────────────
    if (isBeatStart) {
      const delayMs = Math.max(0, (time - soundEngine.getCurrentTime()) * 1000);
      window.setTimeout(() => {
        if (this.state.isPlaying) {
          this.state = {
            ...this.state,
            currentBeat: beatNumber,
            currentMeasure: this.measureCounter + 1,
            currentChordIndex: chordIndex,
            isAudibleMeasure,
          };
          this.notify();
        }
      }, delayMs);
    }
  }

  /**
   * Loop contínuo com Web Audio Lookahead
   */
  private schedulerLoop = () => {
    if (!this.state.isPlaying) return;

    const ctxTime = soundEngine.getCurrentTime();
    const style =
      ACCOMPANIMENT_STYLES.find((s) => s.id === this.state.styleId) ||
      ACCOMPANIMENT_STYLES[0];
    const secondsPerStep = this.getSecondsPerStep(style);
    const stepsPerMeasure = style.stepsPerMeasure;

    while (this.nextStepTime < ctxTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime, style);

      this.nextStepTime += secondsPerStep;
      this.currentStep++;

      if (this.currentStep >= stepsPerMeasure) {
        this.currentStep = 0;
        this.measureCounter++;
      }
    }

    this.timerId = window.setTimeout(this.schedulerLoop, this.lookaheadMs);
  };
}

export const accompanimentStore = new AccompanimentStore();

/**
 * Hook React reativo para metrônomo e acompanhamento
 */
export function useAccompaniment(): AccompanimentState {
  return useSyncExternalStore(accompanimentStore.subscribe, accompanimentStore.getSnapshot);
}
