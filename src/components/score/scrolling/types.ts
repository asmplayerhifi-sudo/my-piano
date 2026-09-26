/**
 * scrolling/types.ts
 * Contratos, tipos e interfaces para o módulo de partitura deslizante.
 * Regra: Tipos puros (< 60 linhas).
 */

import type { ScoreNote } from '../../../core/coursesData';

export interface DetailedMidiInput {
  midi?: number;
  midis?: number[];
  timestamp?: number;
  velocity?: number;
  chordName?: string;
}

export type MidiInputNote = number | number[] | DetailedMidiInput | null;

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

export type ScoreSustainMode = 'off' | 'notes' | 'chords' | 'all';

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
  /** Modo de sustain: 'off' (desligado), 'notes' (apenas notas), 'chords' (apenas acordes), 'all' (ambos) */
  sustainMode?: ScoreSustainMode;
  onSustainModeChange?: (mode: ScoreSustainMode) => void;
  /** @deprecated Mantido para compatibilidade com implementações existentes */
  enableSustain?: boolean;
  /** Oculta controles de playback/metrônomo internos caso a tela pai já os forneça (ex: RepertoireView). */
  hidePlaybackControls?: boolean;
  /** Notifica notas MIDI ativas em execução para iluminação no teclado virtual */
  onActiveNotesChange?: (activeMidis: number[]) => void;
  /** Notifica batida rítmica e compasso em tempo real para sincronização de metrônomo */
  onBeatTick?: (measure: number, beat: number, isDownbeat: boolean) => void;
  /** Modo de execução interativo: 'wait' (espera a nota/acorde ser tocado) ou 'flow' (rola no tempo da métrica) */
  mode?: 'wait' | 'flow';
  /** Notifica mudanças nas notas do passo ativo e notas já satisfeitas */
  onStepChange?: (stepIndices: number[], satisfiedIndices: Set<number>) => void;
}


