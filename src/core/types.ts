// Tipos fundamentais do Domínio Musical e da Plataforma Harmonia

export type Accidental = '' | '#' | 'b';

export interface NoteInfo {
  name: string;              // ex: 'C', 'F#', 'Bb'
  letter: string;            // ex: 'C', 'F', 'B'
  accidental: Accidental;    // '', '#', 'b'
  midi: number;              // MIDI number (ex: 60 = C4)
  octave: number;            // ex: 4
  frequency: number;         // ex: 261.63 Hz
}

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'dom7' | 'maj7' | 'min7' | 'm7b5';

export interface ChordDefinition {
  root: string;
  quality: ChordQuality;
  symbol: string;            // ex: 'Cmaj7', 'Am', 'F#m7b5'
  name: string;              // ex: 'Dó Maior com Sétima Maior'
  intervals: number[];       // semitons a partir da raiz, ex: [0, 4, 7, 11]
  notes: string[];           // ex: ['C', 'E', 'G', 'B']
  degrees: string[];         // ex: ['1', '3', '5', '7M']
  bassNote?: string;         // ex: 'E' para C/E
}

export interface KeyboardVoicing {
  root: string;
  symbol: string;
  inversion: 0 | 1 | 2;      // 0 = fundamental, 1 = 1ª inversão, 2 = 2ª inversão
  inversionName: string;
  midiNotes: number[];       // notas MIDI a serem acionadas
  fingeringsRightHand: number[]; // 1 = polegar, 2 = indicador, etc.
  fingeringsLeftHand: number[];
}

export interface FretboardCoordinate {
  stringNumber: number;      // 1 a 6 (1 = E aguda, 6 = E grave)
  fretNumber: number;        // 0 a 15 (0 = corda solta)
  note: string;
  finger?: number;           // 1 a 4 (1 = indicador, 4 = mínimo)
  isRoot: boolean;
  isMuted: boolean;          // 'X'
  isOpen: boolean;           // 'O'
  isBarre?: boolean;         // Pestana
  barreStartString?: number;
  barreEndString?: number;
}

export interface GuitarChordShape {
  name: string;              // ex: 'C (Shape de A)'
  cagedLetter: 'C' | 'A' | 'G' | 'E' | 'D';
  rootNote: string;
  frets: number[];           // 6 cordas: [E, A, D, G, B, e], -1 = muted (X), 0 = solta (O)
  fingers: number[];         // 0 = sem dedo, 1 = indicador, 2 = médio, etc.
  barreFret?: number;
  barreStrings?: [number, number]; // [cordaInicial, cordaFinal]
  bassNote: string;
}

export type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8';

export interface RhythmTarget {
  id: string;
  targetTimeMs: number;      // tempo exato em relação ao início
  beatIndex: number;         // 1, 2, 3, 4
  isDownbeat: boolean;       // Tempo forte (1)
  chord?: string;            // Opcional para o módulo híbrido
  hitResult?: 'perfect' | 'good' | 'early' | 'late' | 'miss';
  hitDiffMs?: number;
}

export interface LatencyCalibrationProfile {
  deviceType: 'speaker' | 'wired_headphone' | 'bluetooth';
  offsetMs: number;          // Valor a descontar (ex: +120ms para bluetooth)
  isCalibrated: boolean;
  lastCalibrationDate?: string;
}
