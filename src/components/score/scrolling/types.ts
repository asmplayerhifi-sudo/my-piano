/**
 * scrolling/types.ts
 * Contratos, tipos e interfaces para o módulo de partitura deslizante.
 * Regra: Tipos puros (< 60 linhas).
 */

import type { ScoreNote } from '../../../core/coursesData';

export type MidiInputNote = number | { midi: number; timestamp?: number } | null;

export interface ChordSpan {
  chordName: string;
  startBeat: number;
  duration: number;
  measure: number;
}

export interface RestItem {
  clef: 'treble' | 'bass';
  beatOffset: number;
  duration: number;
  measure: number;
}

export interface DisplayOptions {
  showFingering: boolean;
  showNoteNames: boolean;
  showRests: boolean;
  showBarlines: boolean;
  showBeatNumbers: boolean;
  showSubdivisions: boolean;
  showChords: boolean;
}

export type ScoreTheme = 'traditional' | 'dark';

export interface ScoreErrorEvent {
  playedMidi: number;
  expectedMidi: number;
  timestamp: number;
}

export interface ScrollingScoreProps {
  notes: ScoreNote[];
  bpm?: number;
  timeSignature?: string;
  initialMode?: 'wait' | 'flow';
  initialTheme?: ScoreTheme;
  onNoteHit?: (note: ScoreNote, diffMs: number) => void;
  onNoteError?: (error: ScoreErrorEvent) => void;
  onTargetNoteChange?: (note: ScoreNote | null, index: number) => void;
  onLessonComplete?: () => void;
  currentMidiPressed?: MidiInputNote;
  isPlaying?: boolean;
  onPlayPauseToggle?: (playing: boolean) => void;
  onTempoChange?: (tempo: number) => void;
  instrument?: 'piano' | 'guitar';
  toleranceMs?: number;
  isDemoMode?: boolean;
  currentNoteIndex?: number;
  autoPlayAudio?: boolean;
  enableMetronomeSound?: boolean;
  enableSustain?: boolean;
  /** Oculta controles de playback/metrônomo internos caso a tela pai já os forneça (ex: RepertoireView). */
  hidePlaybackControls?: boolean;
}
