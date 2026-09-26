/**
 * core/sightReadingEngine.ts
 *
 * Motor Pedagógico de Treino de Leitura de Partitura (Clave de Sol e Clave de Fá).
 * Responsável por:
 *  - Catálogo de notas diatônicas e cromáticas mapeadas na pauta (linhas, espaços e linhas suplementares).
 *  - Geradores dinâmicos de exercícios:
 *      1. Nota Única (Flashcards Rápidos)
 *      2. Intervalos & Distâncias (2ª a 8ª)
 *      3. Sequências Rítmico-Melódicas (Fluência passo a passo / Wait Mode)
 *      4. Leitura de Acordes (Tríades e Tétrades)
 *      5. Linhas Suplementares (Registro Agudo e Grave Extremo)
 *  - Validação de toques (MIDI, Teclado Virtual, Microfone).
 *  - Gerenciamento de métricas de sessão: precisão, tempo médio de reação, streaks e mapa de calor de notas fracas.
 */

import { octaveConfigStore } from './octaveConfigStore';

export type ClefType = 'treble' | 'bass' | 'grand';
export type AccidentalMode = 'natural' | 'sharps' | 'flats' | 'all';
export type ExerciseType = 'single' | 'intervals' | 'sequences' | 'chords' | 'ledger';
export type TrainingMode = 'free' | 'challenge';

export type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8';

export interface KeySignatureDef {
  id: string;
  name: string;
  root: string;
  accidentalsCount: number;
  type: 'natural' | 'sharp' | 'flat';
  sharpsOrFlats: string[];
}

export type NoteDurationFigure = 'whole' | 'half' | 'quarter' | 'eighth';

export const FIGURE_BEATS: Record<NoteDurationFigure, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
};

export const FIGURE_LABELS: Record<NoteDurationFigure, string> = {
  whole: 'Semibreve (4T)',
  half: 'Mínima (2T)',
  quarter: 'Semínima (1T)',
  eighth: 'Colcheia (0.5T)',
};

export const KEY_SIGNATURES: KeySignatureDef[] = [
  { id: 'c_major', name: 'Dó Maior / Lá Menor (0)', root: 'C', accidentalsCount: 0, type: 'natural', sharpsOrFlats: [] },
  { id: 'g_major', name: 'Sol Maior / Mi Menor (1♯: F♯)', root: 'G', accidentalsCount: 1, type: 'sharp', sharpsOrFlats: ['F'] },
  { id: 'd_major', name: 'Ré Maior / Si Menor (2♯: F♯, C♯)', root: 'D', accidentalsCount: 2, type: 'sharp', sharpsOrFlats: ['F', 'C'] },
  { id: 'a_major', name: 'Lá Maior / Fá♯ Menor (3♯: F♯, C♯, G♯)', root: 'A', accidentalsCount: 3, type: 'sharp', sharpsOrFlats: ['F', 'C', 'G'] },
  { id: 'e_major', name: 'Mi Maior / Dó♯ Menor (4♯)', root: 'E', accidentalsCount: 4, type: 'sharp', sharpsOrFlats: ['F', 'C', 'G', 'D'] },
  { id: 'f_major', name: 'Fá Maior / Ré Menor (1♭: B♭)', root: 'F', accidentalsCount: 1, type: 'flat', sharpsOrFlats: ['B'] },
  { id: 'bb_major', name: 'Si♭ Maior / Sol Menor (2♭: B♭, E♭)', root: 'Bb', accidentalsCount: 2, type: 'flat', sharpsOrFlats: ['B', 'E'] },
  { id: 'eb_major', name: 'Mi♭ Maior / Dó Menor (3♭: B♭, E♭, A♭)', root: 'Eb', accidentalsCount: 3, type: 'flat', sharpsOrFlats: ['B', 'E', 'A'] },
];

export interface StaffPosition {
  type: 'line' | 'space' | 'ledger-above' | 'ledger-below';
  index: number; // 1 a 5 para linhas/espaços normais, ou 1 a 4 para linhas suplementares
  description: string;
}

export interface SightReadingNote {
  id: string;
  midi: number;
  pitchLetter: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B'
  accidental: '' | '#' | 'b';
  clef: 'treble' | 'bass';
  staffPosition: StaffPosition;
  isLedger: boolean;
  durationFigure?: NoteDurationFigure;
  beats?: number;
  isRest?: boolean;
  beatOffset?: number;
  chordId?: string;
}

export interface SightReadingExercise {
  id: string;
  type: ExerciseType;
  clef: ClefType;
  title: string;
  description: string;
  notes: SightReadingNote[];
  expectedMidis: number[];
  chordSymbol?: string;
  intervalName?: string;
  timeSignature?: TimeSignature;
  keySignature?: KeySignatureDef;
  bpm?: number;
  isPolyphonic?: boolean;
}

export interface NotePerformanceRecord {
  noteKey: string; // Ex: "C4 (Treble)"
  noteNamePt: string;
  midi: number;
  clef: 'treble' | 'bass';
  attempts: number;
  errors: number;
  totalReactionMs: number;
  avgReactionMs: number;
  errorRate: number; // 0.0 a 1.0
}

export interface SightReadingSessionMetrics {
  totalAttempts: number;
  correctHits: number;
  wrongHits: number;
  accuracyPercent: number;
  currentStreak: number;
  bestStreak: number;
  averageReactionTimeMs: number;
  notesTestedCount: number;
  noteStats: Record<string, NotePerformanceRecord>;
}

// ─── NOTAS FUNDAMENTAIS DIATÔNICAS NA CLAVE DE SOL ─────────────────────────────
// Linha 1: E4 (64), Linha 2: G4 (67), Linha 3: B4 (71), Linha 4: D5 (74), Linha 5: F5 (77)
// Espaço 1: F4 (65), Espaço 2: A4 (69), Espaço 3: C5 (72), Espaço 4: E5 (76)
export const TREBLE_STAFF_NOTES: SightReadingNote[] = [
  // Abaixo da pauta (sem suplementar)
  { id: 't_d4', midi: 62, pitchLetter: 'D', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 0, description: 'Espaço abaixo da 1ª Linha' }, isLedger: false },
  // Linhas da pauta
  { id: 't_e4', midi: 64, pitchLetter: 'E', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 1, description: '1ª Linha' }, isLedger: false },
  { id: 't_g4', midi: 67, pitchLetter: 'G', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 2, description: '2ª Linha (Sol da Clave)' }, isLedger: false },
  { id: 't_b4', midi: 71, pitchLetter: 'B', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 3, description: '3ª Linha' }, isLedger: false },
  { id: 't_d5', midi: 74, pitchLetter: 'D', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 4, description: '4ª Linha' }, isLedger: false },
  { id: 't_f5', midi: 77, pitchLetter: 'F', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 5, description: '5ª Linha' }, isLedger: false },
  // Espaços da pauta
  { id: 't_f4', midi: 65, pitchLetter: 'F', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 1, description: '1º Espaço' }, isLedger: false },
  { id: 't_a4', midi: 69, pitchLetter: 'A', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 2, description: '2º Espaço' }, isLedger: false },
  { id: 't_c5', midi: 72, pitchLetter: 'C', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 3, description: '3º Espaço' }, isLedger: false },
  { id: 't_e5', midi: 76, pitchLetter: 'E', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 4, description: '4º Espaço' }, isLedger: false },
  // Acima da pauta (sem suplementar)
  { id: 't_g5', midi: 79, pitchLetter: 'G', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 5, description: 'Espaço acima da 5ª Linha' }, isLedger: false },
];

export const TREBLE_LEDGER_NOTES: SightReadingNote[] = [
  // Linhas suplementares inferiores (Dó Central e abaixo)
  { id: 't_c4', midi: 60, pitchLetter: 'C', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-below', index: 1, description: '1ª Linha Suplementar Inferior (Dó Central)' }, isLedger: true },
  { id: 't_b3', midi: 59, pitchLetter: 'B', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-below', index: 1, description: '1º Espaço Suplementar Inferior' }, isLedger: true },
  { id: 't_a3', midi: 57, pitchLetter: 'A', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-below', index: 2, description: '2ª Linha Suplementar Inferior' }, isLedger: true },
  { id: 't_g3', midi: 55, pitchLetter: 'G', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-below', index: 2, description: '2º Espaço Suplementar Inferior' }, isLedger: true },
  { id: 't_f3', midi: 53, pitchLetter: 'F', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-below', index: 3, description: '3ª Linha Suplementar Inferior' }, isLedger: true },
  // Linhas suplementares superiores (Lá5 e acima)
  { id: 't_a5', midi: 81, pitchLetter: 'A', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-above', index: 1, description: '1ª Linha Suplementar Superior' }, isLedger: true },
  { id: 't_b5', midi: 83, pitchLetter: 'B', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-above', index: 1, description: '1º Espaço Suplementar Superior' }, isLedger: true },
  { id: 't_c6', midi: 84, pitchLetter: 'C', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-above', index: 2, description: '2ª Linha Suplementar Superior' }, isLedger: true },
  { id: 't_d6', midi: 86, pitchLetter: 'D', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-above', index: 2, description: '2º Espaço Suplementar Superior' }, isLedger: true },
  { id: 't_e6', midi: 88, pitchLetter: 'E', accidental: '', clef: 'treble', staffPosition: { type: 'ledger-above', index: 3, description: '3ª Linha Suplementar Superior' }, isLedger: true },
];

// ─── NOTAS FUNDAMENTAIS DIATÔNICAS NA CLAVE DE FÁ ──────────────────────────────
// Linha 1: G2 (43), Linha 2: B2 (47), Linha 3: D3 (50), Linha 4: F3 (53), Linha 5: A3 (57)
// Espaço 1: A2 (45), Espaço 2: C3 (48), Espaço 3: E3 (52), Espaço 4: G3 (55)
export const BASS_STAFF_NOTES: SightReadingNote[] = [
  // Abaixo da pauta (sem suplementar)
  { id: 'b_f2', midi: 41, pitchLetter: 'F', accidental: '', clef: 'bass', staffPosition: { type: 'space', index: 0, description: 'Espaço abaixo da 1ª Linha' }, isLedger: false },
  // Linhas da pauta
  { id: 'b_g2', midi: 43, pitchLetter: 'G', accidental: '', clef: 'bass', staffPosition: { type: 'line', index: 1, description: '1ª Linha' }, isLedger: false },
  { id: 'b_b2', midi: 47, pitchLetter: 'B', accidental: '', clef: 'bass', staffPosition: { type: 'line', index: 2, description: '2ª Linha' }, isLedger: false },
  { id: 'b_d3', midi: 50, pitchLetter: 'D', accidental: '', clef: 'bass', staffPosition: { type: 'line', index: 3, description: '3ª Linha' }, isLedger: false },
  { id: 'b_f3', midi: 53, pitchLetter: 'F', accidental: '', clef: 'bass', staffPosition: { type: 'line', index: 4, description: '4ª Linha (Fá da Clave)' }, isLedger: false },
  { id: 'b_a3', midi: 57, pitchLetter: 'A', accidental: '', clef: 'bass', staffPosition: { type: 'line', index: 5, description: '5ª Linha' }, isLedger: false },
  // Espaços da pauta
  { id: 'b_a2', midi: 45, pitchLetter: 'A', accidental: '', clef: 'bass', staffPosition: { type: 'space', index: 1, description: '1º Espaço' }, isLedger: false },
  { id: 'b_c3', midi: 48, pitchLetter: 'C', accidental: '', clef: 'bass', staffPosition: { type: 'space', index: 2, description: '2º Espaço' }, isLedger: false },
  { id: 'b_e3', midi: 52, pitchLetter: 'E', accidental: '', clef: 'bass', staffPosition: { type: 'space', index: 3, description: '3º Espaço' }, isLedger: false },
  { id: 'b_g3', midi: 55, pitchLetter: 'G', accidental: '', clef: 'bass', staffPosition: { type: 'space', index: 4, description: '4º Espaço' }, isLedger: false },
  // Acima da pauta (sem suplementar)
  { id: 'b_b3', midi: 59, pitchLetter: 'B', accidental: '', clef: 'bass', staffPosition: { type: 'space', index: 5, description: 'Espaço acima da 5ª Linha' }, isLedger: false },
];

export const BASS_LEDGER_NOTES: SightReadingNote[] = [
  // Linhas suplementares superiores (Dó Central e acima)
  { id: 'b_c4', midi: 60, pitchLetter: 'C', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-above', index: 1, description: '1ª Linha Suplementar Superior (Dó Central)' }, isLedger: true },
  { id: 'b_d4', midi: 62, pitchLetter: 'D', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-above', index: 1, description: '1º Espaço Suplementar Superior' }, isLedger: true },
  { id: 'b_e4', midi: 64, pitchLetter: 'E', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-above', index: 2, description: '2ª Linha Suplementar Superior' }, isLedger: true },
  { id: 'b_f4', midi: 65, pitchLetter: 'F', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-above', index: 2, description: '2º Espaço Suplementar Superior' }, isLedger: true },
  { id: 'b_g4', midi: 67, pitchLetter: 'G', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-above', index: 3, description: '3ª Linha Suplementar Superior' }, isLedger: true },
  // Linhas suplementares inferiores (Mi2 e abaixo)
  { id: 'b_e2', midi: 40, pitchLetter: 'E', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-below', index: 1, description: '1ª Linha Suplementar Inferior' }, isLedger: true },
  { id: 'b_d2', midi: 38, pitchLetter: 'D', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-below', index: 1, description: '1º Espaço Suplementar Inferior' }, isLedger: true },
  { id: 'b_c2', midi: 36, pitchLetter: 'C', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-below', index: 2, description: '2ª Linha Suplementar Inferior' }, isLedger: true },
  { id: 'b_b1', midi: 35, pitchLetter: 'B', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-below', index: 2, description: '2º Espaço Suplementar Inferior' }, isLedger: true },
  { id: 'b_a1', midi: 33, pitchLetter: 'A', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-below', index: 3, description: '3ª Linha Suplementar Inferior' }, isLedger: true },
];

/** Cria uma variação com acidente (# ou b) para uma nota base */
function createAccidentalVariant(base: SightReadingNote, accidental: '#' | 'b'): SightReadingNote {
  const semitoneShift = accidental === '#' ? 1 : -1;
  const newMidi = base.midi + semitoneShift;
  const accSymbol = accidental === '#' ? '♯' : '♭';
  return {
    ...base,
    id: `${base.id}_${accidental === '#' ? 'sharp' : 'flat'}`,
    midi: newMidi,
    accidental,
    staffPosition: {
      ...base.staffPosition,
      description: `${base.staffPosition.description} (${accSymbol})`,
    },
  };
}

/** Obtém o nome formatado da nota respeitando o padrão de oitava (C3 vs C4) */
export function getFormattedNoteName(midi: number, accidental: '' | '#' | 'b' = ''): { english: string; portuguese: string } {
  const preferFlat = accidental === 'b';
  const english = octaveConfigStore.midiToNoteName(midi, preferFlat);
  const portuguese = octaveConfigStore.midiToPtName(midi, preferFlat);
  return { english, portuguese };
}

/** Retorna o pool de notas disponíveis filtrado por clave, acidentes e inclusão de suplementares */
export function getNotePool(clef: ClefType, accidentalMode: AccidentalMode, includeLedger: boolean = true): SightReadingNote[] {
  let baseNotes: SightReadingNote[] = [];

  if (clef === 'treble') {
    baseNotes = [...TREBLE_STAFF_NOTES];
    if (includeLedger) baseNotes.push(...TREBLE_LEDGER_NOTES);
  } else if (clef === 'bass') {
    baseNotes = [...BASS_STAFF_NOTES];
    if (includeLedger) baseNotes.push(...BASS_LEDGER_NOTES);
  } else {
    // Grand staff
    baseNotes = [...TREBLE_STAFF_NOTES, ...BASS_STAFF_NOTES];
    if (includeLedger) {
      baseNotes.push(...TREBLE_LEDGER_NOTES, ...BASS_LEDGER_NOTES);
    }
  }

  if (accidentalMode === 'natural') {
    return baseNotes;
  }

  const result: SightReadingNote[] = [...baseNotes];

  baseNotes.forEach((note) => {
    // Teclas que admitem sustenido/bemol natural (C, D, F, G, A admitem sustenido; D, E, G, A, B admitem bemol)
    const canSharp = ['C', 'D', 'F', 'G', 'A'].includes(note.pitchLetter);
    const canFlat = ['D', 'E', 'G', 'A', 'B'].includes(note.pitchLetter);

    if ((accidentalMode === 'sharps' || accidentalMode === 'all') && canSharp) {
      result.push(createAccidentalVariant(note, '#'));
    }
    if ((accidentalMode === 'flats' || accidentalMode === 'all') && canFlat) {
      result.push(createAccidentalVariant(note, 'b'));
    }
  });

  return result;
}

/**
 * Calcula o alcance dinâmico de leitura (ex: "C4 – G5") a partir das notas reais do exercício ativo.
 * Conforme Requisito 1: "Esse alcance deve ser calculado a partir do exercício efetivamente apresentado, e não ser apenas um texto fixo."
 */
export function calculateExerciseRange(
  notes: SightReadingNote[],
  clef: ClefType = 'treble'
): {
  minMidi: number;
  maxMidi: number;
  minFormatted: string;
  maxFormatted: string;
  rangeText: string;
} {
  if (!notes || notes.length === 0) {
    const fallbackMidi = clef === 'bass' ? 48 : 60;
    const name = octaveConfigStore.midiToNoteName(fallbackMidi);
    return {
      minMidi: fallbackMidi,
      maxMidi: fallbackMidi,
      minFormatted: name,
      maxFormatted: name,
      rangeText: name,
    };
  }

  let minMidi = notes[0].midi;
  let maxMidi = notes[0].midi;

  for (const n of notes) {
    if (n.midi < minMidi) minMidi = n.midi;
    if (n.midi > maxMidi) maxMidi = n.midi;
  }

  const minFormatted = octaveConfigStore.midiToNoteName(minMidi);
  const maxFormatted = octaveConfigStore.midiToNoteName(maxMidi);

  return {
    minMidi,
    maxMidi,
    minFormatted,
    maxFormatted,
    rangeText: minMidi === maxMidi ? minFormatted : `${minFormatted} – ${maxFormatted}`,
  };
}

/**
 * Avaliação Polifônica Rigorosa para Exercícios de Acordes e Blocos Harmônicos (Requisito 5).
 * - Todas as notas pertencentes ao bloco devem ser avaliadas em conjunto.
 * - O exercício NUNCA avança com acorde incompleto.
 * - Identifica notas faltantes e notas extras.
 */
export interface PolyphonicChordResult {
  isComplete: boolean;
  missingMidis: number[];
  extraMidis: number[];
  missingNames: string[];
  statusText: string;
}

export function evaluatePolyphonicChord(
  playedMidis: number[],
  expectedMidis: number[]
): PolyphonicChordResult {
  const uniquePlayed = Array.from(new Set(playedMidis));
  const uniqueExpected = Array.from(new Set(expectedMidis));

  const missingMidis = uniqueExpected.filter((m) => !uniquePlayed.includes(m));
  const extraMidis = uniquePlayed.filter((m) => !uniqueExpected.includes(m));

  const missingNames = missingMidis.map((m) => {
    const { portuguese, english } = getFormattedNoteName(m);
    return `${portuguese} (${english})`;
  });

  const isComplete = missingMidis.length === 0 && extraMidis.length === 0 && uniquePlayed.length > 0;

  let statusText = '';
  if (isComplete) {
    statusText = '✨ Acorde Completo!';
  } else if (extraMidis.length > 0) {
    const extraNames = extraMidis.map((m) => getFormattedNoteName(m).portuguese).join(', ');
    statusText = `❌ Nota extra incorreta tocada: ${extraNames}`;
  } else if (missingMidis.length > 0) {
    statusText = `⚠️ Incompleto: falta ${missingNames.join(', ')}`;
  } else {
    statusText = 'Toque o acorde indicado...';
  }

  return {
    isComplete,
    missingMidis,
    extraMidis,
    missingNames,
    statusText,
  };
}

/**
 * Classificação Rítmica de Precisão Temporal (Requisito 6).
 * Classifica a execução em ON TIME, EARLY ou LATE com janela de tolerância temporal simétrica.
 */
export type TimingClassification = 'ON_TIME' | 'EARLY' | 'LATE';

export interface RhythmicTimingResult {
  classification: TimingClassification;
  deltaMs: number; // playedMs - targetMs (negativo se adiantado, positivo se atrasado)
  label: string;
  color: string;
}

export function evaluateRhythmicTiming(
  playedMs: number,
  targetMs: number,
  _bpm: number = 60,
  toleranceMs: number = 140
): RhythmicTimingResult {
  const deltaMs = playedMs - targetMs;

  if (Math.abs(deltaMs) <= toleranceMs) {
    return {
      classification: 'ON_TIME',
      deltaMs,
      label: 'ON TIME',
      color: '#10b981', // emerald
    };
  } else if (deltaMs < -toleranceMs) {
    return {
      classification: 'EARLY',
      deltaMs,
      label: 'EARLY',
      color: '#f59e0b', // amber
    };
  } else {
    return {
      classification: 'LATE',
      deltaMs,
      label: 'LATE',
      color: '#f43f5e', // rose
    };
  }
}

// ─── GERADORES DE EXERCÍCIOS ───────────────────────────────────────────────────

/** 1. Gerador de Flashcard de Nota Única */
export function generateSingleNoteExercise(
  clef: ClefType,
  accidentalMode: AccidentalMode,
  lastNoteMidi?: number,
  targetNotePool?: SightReadingNote[]
): SightReadingExercise {
  const pool = targetNotePool && targetNotePool.length > 0 ? targetNotePool : getNotePool(clef, accidentalMode, true);
  // Evita repetir exatamente a mesma nota imediatamente se houver alternativas
  let candidates = pool;
  if (candidates.length > 1 && lastNoteMidi !== undefined) {
    candidates = candidates.filter((n) => n.midi !== lastNoteMidi);
    if (candidates.length === 0) candidates = pool;
  }

  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  const { english, portuguese } = getFormattedNoteName(selected.midi, selected.accidental);

  return {
    id: `ex_single_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type: 'single',
    clef,
    title: 'Nota Única (Flashcard)',
    description: `Identifique a nota na pauta: ${portuguese} (${english})`,
    notes: [selected],
    expectedMidis: [selected.midi],
  };
}

/** 2. Gerador de Intervalos & Distâncias (2ª a 8ª) */
export const INTERVAL_TYPES = [
  { semitones: 1, name: '2ª Menor', namePt: 'Segunda Menor' },
  { semitones: 2, name: '2ª Maior', namePt: 'Segunda Maior' },
  { semitones: 3, name: '3ª Menor', namePt: 'Terça Menor' },
  { semitones: 4, name: '3ª Maior', namePt: 'Terça Maior' },
  { semitones: 5, name: '4ª Justa', namePt: 'Quarta Justa' },
  { semitones: 7, name: '5ª Justa', namePt: 'Quinta Justa' },
  { semitones: 8, name: '6ª Menor', namePt: 'Sexta Menor' },
  { semitones: 9, name: '6ª Maior', namePt: 'Sexta Maior' },
  { semitones: 11, name: '7ª Maior', namePt: 'Sétima Maior' },
  { semitones: 12, name: '8ª Justa', namePt: 'Oitava Justa' },
];

export function generateIntervalExercise(clef: ClefType, accidentalMode: AccidentalMode): SightReadingExercise {
  const pool = getNotePool(clef, accidentalMode, false);
  const selectedInterval = INTERVAL_TYPES[Math.floor(Math.random() * INTERVAL_TYPES.length)];

  // Escolhe uma nota base que permita o salto sem sair do registro
  const validBaseNotes = pool.filter((n) => n.midi + selectedInterval.semitones <= 88);
  const baseNote = validBaseNotes.length > 0 ? validBaseNotes[Math.floor(Math.random() * validBaseNotes.length)] : pool[0];
  const targetMidi = baseNote.midi + selectedInterval.semitones;

  // Cria nota alvo no mesmo clef
  const targetNote: SightReadingNote = {
    id: `${baseNote.id}_interval_${selectedInterval.semitones}`,
    midi: targetMidi,
    pitchLetter: 'C', // Aproximação diatônica renderizada
    accidental: '',
    clef: baseNote.clef,
    staffPosition: { type: 'space', index: 3, description: `Intervalo de ${selectedInterval.namePt}` },
    isLedger: false,
  };

  return {
    id: `ex_interval_${Date.now()}`,
    type: 'intervals',
    clef,
    title: `Intervalo: ${selectedInterval.namePt}`,
    description: `Toque as 2 notas do intervalo de ${selectedInterval.name} a partir de ${baseNote.pitchLetter}`,
    notes: [baseNote, targetNote],
    expectedMidis: [baseNote.midi, targetMidi],
    intervalName: selectedInterval.name,
  };
}

/** 3. Sequências Rítmico-Melódicas (Fluência passo a passo) */
export interface SequencePreset {
  title: string;
  category: 'diatonic' | 'pentatonic' | 'modes' | 'arpeggios' | 'phrases';
  clef: 'treble' | 'bass' | 'grand';
  timeSignature?: TimeSignature;
  keySignature?: KeySignatureDef;
  notes: {
    letter: string;
    accidental: '' | '#' | 'b';
    midi: number;
    durationFigure?: NoteDurationFigure;
    beats?: number;
    beatOffset?: number;
  }[];
}

export const PRESET_SEQUENCES: SequencePreset[] = [
  // ── ESCALAS DIATÔNICAS MAIORES E MENORES ──────────────────────────
  {
    title: 'Escala de Dó Maior Ascendente',
    category: 'diatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Escala de Dó Maior Descendente',
    category: 'diatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Escala de Sol Maior Ascendente (1♯)',
    category: 'diatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'D', accidental: '', midi: 74, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'E', accidental: '', midi: 76, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'F', accidental: '#', midi: 78, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'G', accidental: '', midi: 79, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Escala de Fá Maior Ascendente (1♭)',
    category: 'diatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'B', accidental: 'b', midi: 70, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'D', accidental: '', midi: 74, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'E', accidental: '', midi: 76, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'F', accidental: '', midi: 77, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Escala de Lá Menor Natural (A3–A4)',
    category: 'diatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'A', accidental: '', midi: 57, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'B', accidental: '', midi: 59, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },

  // ── ESCALAS PENTATÔNICAS ──────────────────────────────────────────
  {
    title: 'Pentatônica de Dó Maior (C-D-E-G-A-C)',
    category: 'pentatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'half', beats: 2, beatOffset: 5 },
    ],
  },
  {
    title: 'Pentatônica de Lá Menor (A-C-D-E-G-A)',
    category: 'pentatonic',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'A', accidental: '', midi: 57, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'half', beats: 2, beatOffset: 5 },
    ],
  },

  // ── MODOS GREGOS ──────────────────────────────────────────────────
  {
    title: 'Modo Dórico em Ré (D4–D5)',
    category: 'modes',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'D', accidental: '', midi: 74, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Modo Frígio em Mi (E4–E5)',
    category: 'modes',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'D', accidental: '', midi: 74, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'E', accidental: '', midi: 76, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Modo Lídio em Fá (F4–F5: 4ª Aum)',
    category: 'modes',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'D', accidental: '', midi: 74, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'E', accidental: '', midi: 76, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'F', accidental: '', midi: 77, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
  {
    title: 'Modo Mixolídio em Sol (G4–G5: 7ª Men)',
    category: 'modes',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'A', accidental: '', midi: 69, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'B', accidental: '', midi: 71, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'D', accidental: '', midi: 74, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'E', accidental: '', midi: 76, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'F', accidental: '', midi: 77, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'G', accidental: '', midi: 79, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },

  // ── ARPEJOS & FRASES ──────────────────────────────────────────────
  {
    title: 'Arpejo Maior Triádico (Dó - Mi - Sol)',
    category: 'arpeggios',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'C', accidental: '', midi: 72, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'C', accidental: '', midi: 60, durationFigure: 'half', beats: 2, beatOffset: 6 },
    ],
  },
  {
    title: 'Frase Clássica: Ode à Alegria (Beethoven)',
    category: 'phrases',
    clef: 'treble',
    timeSignature: '4/4',
    notes: [
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'G', accidental: '', midi: 67, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'F', accidental: '', midi: 65, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'E', accidental: '', midi: 64, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'D', accidental: '', midi: 62, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },

  // ── SEQUÊNCIAS EM CLAVE DE FÁ (GRAVE) ─────────────────────────────
  {
    title: 'Baixo Fundamental em Clave de Fá (C - G - Am - F)',
    category: 'phrases',
    clef: 'bass',
    timeSignature: '4/4',
    notes: [
      { letter: 'C', accidental: '', midi: 48, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'G', accidental: '', midi: 43, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'A', accidental: '', midi: 45, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'F', accidental: '', midi: 41, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
    ],
  },
  {
    title: 'Arpejo Grave em Clave de Fá (Dó - Mi - Sol - Dó)',
    category: 'arpeggios',
    clef: 'bass',
    timeSignature: '4/4',
    notes: [
      { letter: 'C', accidental: '', midi: 36, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'E', accidental: '', midi: 40, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'G', accidental: '', midi: 43, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'C', accidental: '', midi: 48, durationFigure: 'half', beats: 2, beatOffset: 3 },
    ],
  },
  {
    title: 'Escala de Sol Maior no Baixo (G2–G3)',
    category: 'diatonic',
    clef: 'bass',
    timeSignature: '4/4',
    notes: [
      { letter: 'G', accidental: '', midi: 43, durationFigure: 'quarter', beats: 1, beatOffset: 0 },
      { letter: 'A', accidental: '', midi: 45, durationFigure: 'quarter', beats: 1, beatOffset: 1 },
      { letter: 'B', accidental: '', midi: 47, durationFigure: 'quarter', beats: 1, beatOffset: 2 },
      { letter: 'C', accidental: '', midi: 48, durationFigure: 'quarter', beats: 1, beatOffset: 3 },
      { letter: 'D', accidental: '', midi: 50, durationFigure: 'quarter', beats: 1, beatOffset: 4 },
      { letter: 'E', accidental: '', midi: 52, durationFigure: 'quarter', beats: 1, beatOffset: 5 },
      { letter: 'F', accidental: '#', midi: 54, durationFigure: 'quarter', beats: 1, beatOffset: 6 },
      { letter: 'G', accidental: '', midi: 55, durationFigure: 'quarter', beats: 1, beatOffset: 7 },
    ],
  },
];

export function generateSequenceExercise(clef: ClefType): SightReadingExercise {
  const compatiblePresets = PRESET_SEQUENCES.filter((p) => clef === 'grand' || p.clef === clef);
  const preset = compatiblePresets[Math.floor(Math.random() * compatiblePresets.length)] || PRESET_SEQUENCES[0];

  const notes: SightReadingNote[] = preset.notes.map((n, idx) => ({
    id: `seq_${idx}_${n.midi}`,
    midi: n.midi,
    pitchLetter: n.letter,
    accidental: n.accidental,
    clef: preset.clef === 'grand' ? (n.midi >= 60 ? 'treble' : 'bass') : preset.clef,
    staffPosition: { type: 'space', index: 2, description: `Nota ${idx + 1}` },
    isLedger: n.midi <= 60 && preset.clef === 'treble',
    durationFigure: n.durationFigure || 'quarter',
    beats: n.beats || 1,
    beatOffset: n.beatOffset ?? idx,
  }));

  return {
    id: `ex_seq_${Date.now()}`,
    type: 'sequences',
    clef: preset.clef,
    title: preset.title,
    description: `Toque cada nota em sequência no seu ritmo (Wait Mode ativo)`,
    notes,
    expectedMidis: notes.map((n) => n.midi),
    timeSignature: preset.timeSignature || '4/4',
    keySignature: preset.keySignature,
  };
}

/** 4. Leitura de Acordes (Harmonia) */
export interface ChordReadingPreset {
  symbol: string;
  namePt: string;
  category: 'triad' | 'inversion' | 'tetrad' | 'open_voicing';
  clef: 'treble' | 'bass' | 'grand';
  notes: { midi: number; letter: string; accidental: '' | '#' | 'b'; clef: 'treble' | 'bass' }[];
}

export const CHORD_PRESETS: ChordReadingPreset[] = [
  // ── TRÍADES BÁSICAS ───────────────────────────────────────────────
  {
    symbol: 'C',
    namePt: 'Dó Maior (Fundamental)',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 60, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Dm',
    namePt: 'Ré Menor',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 62, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Em',
    namePt: 'Mi Menor',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 71, letter: 'B', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'F',
    namePt: 'Fá Maior',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'G',
    namePt: 'Sol Maior',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 71, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 74, letter: 'D', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Am',
    namePt: 'Lá Menor',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 76, letter: 'E', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Bdim',
    namePt: 'Si Diminuto (Tríade)',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 59, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 62, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Caug',
    namePt: 'Dó Aumentado',
    category: 'triad',
    clef: 'treble',
    notes: [
      { midi: 60, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 68, letter: 'G', accidental: '#', clef: 'treble' },
    ],
  },

  // ── INVERSÕES DE ACORDES ──────────────────────────────────────────
  {
    symbol: 'C/E',
    namePt: 'Dó Maior (1ª Inversão)',
    category: 'inversion',
    clef: 'treble',
    notes: [
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'C/G',
    namePt: 'Dó Maior (2ª Inversão)',
    category: 'inversion',
    clef: 'treble',
    notes: [
      { midi: 55, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 60, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'G/B',
    namePt: 'Sol Maior (1ª Inversão)',
    category: 'inversion',
    clef: 'treble',
    notes: [
      { midi: 59, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 62, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Am/C',
    namePt: 'Lá Menor (1ª Inversão)',
    category: 'inversion',
    clef: 'treble',
    notes: [
      { midi: 60, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
    ],
  },

  // ── TÉTRADES (ACORDES COM SÉTIMA) ─────────────────────────────────
  {
    symbol: 'Cmaj7',
    namePt: 'Dó com Sétima Maior',
    category: 'tetrad',
    clef: 'treble',
    notes: [
      { midi: 60, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 71, letter: 'B', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'G7',
    namePt: 'Sol com Sétima Dominante',
    category: 'tetrad',
    clef: 'treble',
    notes: [
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 71, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 74, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 77, letter: 'F', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Dm7',
    namePt: 'Ré Menor com Sétima',
    category: 'tetrad',
    clef: 'treble',
    notes: [
      { midi: 62, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Bm7(b5)',
    namePt: 'Si Meio-Diminuto',
    category: 'tetrad',
    clef: 'treble',
    notes: [
      { midi: 59, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 62, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
    ],
  },

  // ── VOICINGS ABERTOS NA PAUTA DUPLA (GRAND STAFF) ─────────────────
  {
    symbol: 'C (Grand)',
    namePt: 'Dó Maior (Voicing Aberto)',
    category: 'open_voicing',
    clef: 'grand',
    notes: [
      { midi: 48, letter: 'C', accidental: '', clef: 'bass' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'Am (Grand)',
    namePt: 'Lá Menor (Voicing Aberto)',
    category: 'open_voicing',
    clef: 'grand',
    notes: [
      { midi: 45, letter: 'A', accidental: '', clef: 'bass' },
      { midi: 64, letter: 'E', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'G7 (Grand)',
    namePt: 'Sol 7 Dominante (Grand)',
    category: 'open_voicing',
    clef: 'grand',
    notes: [
      { midi: 43, letter: 'G', accidental: '', clef: 'bass' },
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
      { midi: 71, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 74, letter: 'D', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'F (Grand)',
    namePt: 'Fá Maior (Grand Staff)',
    category: 'open_voicing',
    clef: 'grand',
    notes: [
      { midi: 41, letter: 'F', accidental: '', clef: 'bass' },
      { midi: 65, letter: 'F', accidental: '', clef: 'treble' },
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
    ],
  },

  // ── ACORDES EM CLAVE DE FÁ (GRAVE) ────────────────────────────────
  {
    symbol: 'C (Baixo)',
    namePt: 'Dó Maior no Baixo',
    category: 'triad',
    clef: 'bass',
    notes: [
      { midi: 48, letter: 'C', accidental: '', clef: 'bass' },
      { midi: 52, letter: 'E', accidental: '', clef: 'bass' },
      { midi: 55, letter: 'G', accidental: '', clef: 'bass' },
    ],
  },
  {
    symbol: 'Am (Baixo)',
    namePt: 'Lá Menor no Baixo',
    category: 'triad',
    clef: 'bass',
    notes: [
      { midi: 45, letter: 'A', accidental: '', clef: 'bass' },
      { midi: 48, letter: 'C', accidental: '', clef: 'bass' },
      { midi: 52, letter: 'E', accidental: '', clef: 'bass' },
    ],
  },
];

export function generateChordExercise(clef: ClefType): SightReadingExercise {
  const candidates = CHORD_PRESETS.filter((c) => clef === 'grand' || c.clef === clef);
  const preset = candidates[Math.floor(Math.random() * candidates.length)] || CHORD_PRESETS[0];

  const notes: SightReadingNote[] = preset.notes.map((n, idx) => ({
    id: `chord_${idx}_${n.midi}`,
    midi: n.midi,
    pitchLetter: n.letter,
    accidental: n.accidental,
    clef: n.clef,
    staffPosition: { type: 'space', index: idx + 1, description: `Nota ${idx + 1} do Acorde` },
    isLedger: (n.midi <= 60 && n.clef === 'treble') || (n.midi >= 60 && n.clef === 'bass'),
    durationFigure: 'whole',
    beats: 4,
    chordId: preset.symbol,
  }));

  return {
    id: `ex_chord_${Date.now()}`,
    type: 'chords',
    clef: preset.clef,
    title: `Acorde: ${preset.symbol} (${preset.namePt})`,
    description: `Leia e toque todas as notas do bloco simultaneamente (Validação Polifônica)`,
    notes,
    expectedMidis: notes.map((n) => n.midi),
    chordSymbol: preset.symbol,
    isPolyphonic: true,
  };
}

/** 5. Linhas Suplementares (Registro Agudo e Grave Extremo) */
export function generateLedgerExercise(clef: ClefType, accidentalMode: AccidentalMode): SightReadingExercise {
  let pool: SightReadingNote[] = [];
  if (clef === 'treble') {
    pool = [...TREBLE_LEDGER_NOTES];
  } else if (clef === 'bass') {
    pool = [...BASS_LEDGER_NOTES];
  } else {
    pool = [...TREBLE_LEDGER_NOTES, ...BASS_LEDGER_NOTES];
  }

  return generateSingleNoteExercise(clef, accidentalMode, undefined, pool);
}

// ─── GERENCIADOR DE MÉTRICAS E MAPA DE CALOR ─────────────────────────────────

export class SightReadingMetricsTracker {
  private metrics: SightReadingSessionMetrics = {
    totalAttempts: 0,
    correctHits: 0,
    wrongHits: 0,
    accuracyPercent: 100,
    currentStreak: 0,
    bestStreak: 0,
    averageReactionTimeMs: 0,
    notesTestedCount: 0,
    noteStats: {},
  };

  public getMetrics(): SightReadingSessionMetrics {
    return { ...this.metrics };
  }

  public reset(): void {
    this.metrics = {
      totalAttempts: 0,
      correctHits: 0,
      wrongHits: 0,
      accuracyPercent: 100,
      currentStreak: 0,
      bestStreak: 0,
      averageReactionTimeMs: 0,
      notesTestedCount: 0,
      noteStats: {},
    };
  }

  public recordAttempt(note: SightReadingNote, isCorrect: boolean, reactionTimeMs: number): void {
    this.metrics.totalAttempts++;
    if (isCorrect) {
      this.metrics.correctHits++;
      this.metrics.currentStreak++;
      if (this.metrics.currentStreak > this.metrics.bestStreak) {
        this.metrics.bestStreak = this.metrics.currentStreak;
      }
    } else {
      this.metrics.wrongHits++;
      this.metrics.currentStreak = 0;
    }

    // Calcula acurácia geral
    this.metrics.accuracyPercent = Math.round((this.metrics.correctHits / this.metrics.totalAttempts) * 100);

    // Atualiza tempo médio de reação
    const prevTotal = this.metrics.averageReactionTimeMs * (this.metrics.totalAttempts - 1);
    this.metrics.averageReactionTimeMs = Math.round((prevTotal + reactionTimeMs) / this.metrics.totalAttempts);

    // Atualiza estatísticas por nota individual (Mapa de Calor)
    const { portuguese, english } = getFormattedNoteName(note.midi, note.accidental);
    const key = `${english} [${note.clef === 'treble' ? '𝄞' : '𝄢'}]`;

    const stat = this.metrics.noteStats[key] || {
      noteKey: key,
      noteNamePt: `${portuguese} (${note.clef === 'treble' ? 'Clave de Sol' : 'Clave de Fá'})`,
      midi: note.midi,
      clef: note.clef,
      attempts: 0,
      errors: 0,
      totalReactionMs: 0,
      avgReactionMs: 0,
      errorRate: 0,
    };

    stat.attempts++;
    if (!isCorrect) stat.errors++;
    stat.totalReactionMs += reactionTimeMs;
    stat.avgReactionMs = Math.round(stat.totalReactionMs / stat.attempts);
    stat.errorRate = Number((stat.errors / stat.attempts).toFixed(2));

    this.metrics.noteStats[key] = stat;
    this.metrics.notesTestedCount = Object.keys(this.metrics.noteStats).length;
  }

  /** Retorna as notas com maior dificuldade pedagógica (maior taxa de erro ou lentidão) */
  public getWeakestNotes(limit: number = 5): NotePerformanceRecord[] {
    const records = Object.values(this.metrics.noteStats);
    if (records.length === 0) return [];

    return records
      .filter((r) => r.attempts >= 1)
      .sort((a, b) => {
        // Prioriza maior taxa de erro; se empatar, maior tempo de reação
        if (b.errorRate !== a.errorRate) {
          return b.errorRate - a.errorRate;
        }
        return b.avgReactionMs - a.avgReactionMs;
      })
      .slice(0, limit);
  }
}

// ─── CONTEÚDO PEDAGÓGICO COMPLETO: TUTORIAL DE PARTITURA (REQUISITO 1) ───────
export interface TutorialTopic {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  keyConcepts: { title: string; detail: string; iconSymbol?: string }[];
  visualExamples: { label: string; midi: number; pitch: string; clef: ClefType; description: string }[];
  practicalTip: string;
}

export const TUTORIAL_TOPICS: TutorialTopic[] = [
  {
    id: 'clefs',
    title: 'Claves Musicais: Sol, Fá e Pauta Dupla',
    category: 'Fundamentos',
    badge: 'Módulo 1',
    summary: 'A clave define a referência de altura de cada linha e espaço da pauta pentagrama.',
    keyConcepts: [
      {
        title: 'Clave de Sol (𝄞)',
        detail: 'Inicia na 2ª linha fixando a nota Sol 4 (G4). Utilizada principalmente para a mão direita e registros médios/agudos.',
        iconSymbol: '𝄞',
      },
      {
        title: 'Clave de Fá (𝄢)',
        detail: 'Possui dois pontos ao redor da 4ª linha fixando o Fá 3 (F3). Utilizada para a mão esquerda e registros graves.',
        iconSymbol: '𝄢',
      },
      {
        title: 'Pauta Dupla (Grand Staff)',
        detail: 'União do sistema de Sol e Fá pelo Dó Central (C4 / Linha Suplementar). Padrão oficial de piano e instrumentos de teclado.',
        iconSymbol: '𝄞+𝄢',
      },
    ],
    visualExamples: [
      { label: 'Sol 4 (2ª Linha)', midi: 67, pitch: 'G4', clef: 'treble', description: 'Referência central da Clave de Sol' },
      { label: 'Fá 3 (4ª Linha)', midi: 53, pitch: 'F3', clef: 'bass', description: 'Referência central da Clave de Fá' },
      { label: 'Dó Central (C4)', midi: 60, pitch: 'C4', clef: 'treble', description: 'Ponte de união entre as duas claves' },
    ],
    practicalTip: 'Ao ler partitura de piano, olhe primeiro para a clave antes de tocar. A mesma posição física tem significados musicais diferentes em Sol e em Fá!',
  },
  {
    id: 'notes_lines_spaces',
    title: 'Pauta: Linhas e Espaços',
    category: 'Leitura Linear',
    badge: 'Módulo 2',
    summary: 'A pauta possui 5 linhas e 4 espaços contados rigorosamente de baixo para cima.',
    keyConcepts: [
      {
        title: 'Linhas na Clave de Sol',
        detail: '1ª: Mi (E4), 2ª: Sol (G4), 3ª: Si (B4), 4ª: Ré (D5), 5ª: Fá (F5). Dica mnemônica: Mi-Sol-Si-Ré-Fá.',
        iconSymbol: '━',
      },
      {
        title: 'Espaços na Clave de Sol',
        detail: '1º: Fá (F4), 2º: Lá (A4), 3º: Dó (C5), 4º: Mi (E5). Dica mnemônica: Fá-Lá-Dó-Mi.',
        iconSymbol: '▭',
      },
      {
        title: 'Linhas na Clave de Fá',
        detail: '1ª: Sol (G2), 2ª: Si (B2), 3ª: Ré (D3), 4ª: Fá (F3), 5ª: Lá (A3).',
        iconSymbol: '━',
      },
      {
        title: 'Espaços na Clave de Fá',
        detail: '1º: Lá (A2), 2º: Dó (C3), 3º: Mi (E3), 4º: Sol (G3).',
        iconSymbol: '▭',
      },
    ],
    visualExamples: [
      { label: 'Mi 4 (1ª Linha Sol)', midi: 64, pitch: 'E4', clef: 'treble', description: 'Linha mais grave da pauta de Sol' },
      { label: 'Dó 5 (3º Espaço Sol)', midi: 72, pitch: 'C5', clef: 'treble', description: 'Espaço central agudo' },
      { label: 'Dó 3 (2º Espaço Fá)', midi: 48, pitch: 'C3', clef: 'bass', description: 'Espaço harmônico fundamental do baixo' },
    ],
    practicalTip: 'Notas vizinhas alternam sempre entre linha e espaço. Se a nota atual está na linha e a próxima no espaço adjacente, você tem um intervalo de 2ª (passo contíguo)!',
  },
  {
    id: 'octaves_central_c',
    title: 'Oitavas e o Dó Central (C4)',
    category: 'Registro & Espaço',
    badge: 'Módulo 3',
    summary: 'Compreenda a localização das 7 oitavas do piano e a posição soberana do Dó Central.',
    keyConcepts: [
      {
        title: 'Dó Central (C4 / MIDI 60)',
        detail: 'Fica exatamente no centro do teclado de 88 teclas. Na clave de Sol, aparece na 1ª linha suplementar inferior. Na clave de Fá, na 1ª suplementar superior.',
        iconSymbol: '⊕',
      },
      {
        title: 'Linhas Suplementares',
        detail: 'Pequenos traços horizontais desenhados acima ou abaixo da pauta para estender a leitura para notas mais agudas ou mais graves que as 5 linhas básicas.',
        iconSymbol: '≍',
      },
    ],
    visualExamples: [
      { label: 'Dó Central em Sol', midi: 60, pitch: 'C4', clef: 'treble', description: '1ª Linha Suplementar Inferior' },
      { label: 'Dó Central em Fá', midi: 60, pitch: 'C4', clef: 'bass', description: '1ª Linha Suplementar Superior' },
      { label: 'Lá 5 (Agudo)', midi: 81, pitch: 'A5', clef: 'treble', description: '1ª Linha Suplementar Superior' },
    ],
    practicalTip: 'Use o Dó Central como sua âncora visual de partida. Tudo acima dele pertence naturalmente à clave de Sol; tudo abaixo, à clave de Fá.',
  },
  {
    id: 'rhythm_figures',
    title: 'Figuras Rítmicas, Duração e Pausas',
    category: 'Ritmo & Tempo',
    badge: 'Módulo 4',
    summary: 'Cada figura musical expressa a proporção exata de tempo que o som ou o silêncio deve durar.',
    keyConcepts: [
      {
        title: 'Semibreve (𝅝) — 4 Tempos',
        detail: 'Cabeça oval vazada sem haste. Em fórmula 4/4, preenche o compasso inteiro. Pausa: retângulo pendurado na 4ª linha.',
        iconSymbol: '𝅝',
      },
      {
        title: 'Mínima (𝅗𝅥) — 2 Tempos',
        detail: 'Cabeça oval vazada com haste vertical. Vale a metade da semibreve. Pausa: retângulo apoiado na 3ª linha.',
        iconSymbol: '𝅗𝅥',
      },
      {
        title: 'Semínima (𝅘𝅥) — 1 Tempo',
        detail: 'Cabeça preenchida com haste. É a unidade de tempo (pulso básico) dos compassos quaternários, ternários e binários.',
        iconSymbol: '𝅘𝅥',
      },
      {
        title: 'Colcheia (𝅘𝅥𝅮) — 0.5 Tempo (1/2)',
        detail: 'Cabeça preenchida com haste e bandeirola (ou colchete). Duas colcheias equivalem a uma semínima.',
        iconSymbol: '𝅘𝅥𝅮',
      },
    ],
    visualExamples: [
      { label: 'Semibreve (4T)', midi: 60, pitch: 'C4', clef: 'treble', description: 'Cabeça vazada sem haste' },
      { label: 'Mínima (2T)', midi: 64, pitch: 'E4', clef: 'treble', description: 'Cabeça vazada com haste' },
      { label: 'Semínima (1T)', midi: 67, pitch: 'G4', clef: 'treble', description: 'Cabeça sólida padrão' },
    ],
    practicalTip: 'Pratique marcando o pé ou o metrônomo: cada clique é 1 semínima. Segure a nota por toda a contagem da figura sem soltar antes do tempo!',
  },
  {
    id: 'time_signatures',
    title: 'Compassos e Contagem (2/4, 3/4, 4/4, 6/8)',
    category: 'Métrica Musical',
    badge: 'Módulo 5',
    summary: 'A fórmula de compasso organiza as pulsações musicais em ciclos regulares de tempo.',
    keyConcepts: [
      {
        title: '4/4 (Quaternário Simples)',
        detail: '4 tempos por compasso, cada tempo vale 1 semínima. Contagem: 1 (Forte), 2 (Fraco), 3 (Meio-Forte), 4 (Fraco).',
        iconSymbol: '4/4',
      },
      {
        title: '3/4 (Ternário / Valsa)',
        detail: '3 tempos por compasso. Contagem: 1 (Forte), 2 (Fraco), 3 (Fraco). Típico de valsas e minuetos.',
        iconSymbol: '3/4',
      },
      {
        title: '2/4 (Binário / Marcha)',
        detail: '2 tempos por compasso. Contagem: 1 (Forte), 2 (Fraco). Típico de marchas, choros e sambas.',
        iconSymbol: '2/4',
      },
      {
        title: '6/8 (Binário Composto)',
        detail: '2 tempos com subdivisão ternária (6 colcheias agrupadas de 3 em 3). Movimento oscilante suave.',
        iconSymbol: '6/8',
      },
    ],
    visualExamples: [
      { label: 'Pulso 1 de 4', midi: 60, pitch: 'C4', clef: 'treble', description: 'Downbeat (Tempo Forte)' },
      { label: 'Pulso 2 de 4', midi: 62, pitch: 'D4', clef: 'treble', description: 'Tempo Fraco' },
      { label: 'Pulso 3 de 4', midi: 64, pitch: 'E4', clef: 'treble', description: 'Tempo Meio-Forte' },
    ],
    practicalTip: 'A barra de compasso vertical delimita cada ciclo. A soma das durações dentro das barras deve bater exatamente com a fórmula de compasso.',
  },
  {
    id: 'accidentals_key_signatures',
    title: 'Acidentes e Armaduras de Clave',
    category: 'Tonalidade',
    badge: 'Módulo 6',
    summary: 'Modificações de meio-tom (semitom) e a tonalidade global da música.',
    keyConcepts: [
      {
        title: 'Sustenido (♯)',
        detail: 'Eleva a nota em 1 semitom (tecla imediatamente à direita).',
        iconSymbol: '♯',
      },
      {
        title: 'Bemol (♭)',
        detail: 'Abaixa a nota em 1 semitom (tecla imediatamente à esquerda).',
        iconSymbol: '♭',
      },
      {
        title: 'Bequadro (♮)',
        detail: 'Anula qualquer sustenido ou bemol, restaurando a nota ao seu estado natural original.',
        iconSymbol: '♮',
      },
      {
        title: 'Armadura de Clave',
        detail: 'Conjunto de sustenidos ou bemóis desenhados logo após a clave. Afeta todas as notas correspondentes da peça, a menos que haja um bequadro.',
        iconSymbol: '𝄞♯',
      },
    ],
    visualExamples: [
      { label: 'Fá Sustenido (F♯4)', midi: 66, pitch: 'F#4', clef: 'treble', description: 'Linha 5 com sustenido em Sol' },
      { label: 'Si Bemol (B♭4)', midi: 70, pitch: 'Bb4', clef: 'treble', description: 'Linha 3 com bemol em Sol' },
      { label: 'Dó Natural (C4)', midi: 60, pitch: 'C4', clef: 'treble', description: 'Nota diatônica pura' },
    ],
    practicalTip: 'Lembre-se da ordem das armaduras: Sustenidos seguem Fá-Dó-Sol-Ré-Lá-Mi-Si. Bemóis seguem a ordem inversa: Si-Mi-Lá-Ré-Sol-Dó-Fá!',
  },
  {
    id: 'chords_polyphony',
    title: 'Leitura de Acordes e Polifonia',
    category: 'Harmonia & Blocos',
    badge: 'Módulo 7',
    summary: 'Notas empilhadas verticalmente são tocadas simultaneamente no mesmo instante de tempo.',
    keyConcepts: [
      {
        title: 'Tríades',
        detail: 'Construídas por sobreposição de terças (ex: Dó Maior = C-E-G). Todas as notas ficam em linhas consecutivas ou espaços consecutivos.',
        iconSymbol: '☰',
      },
      {
        title: 'Inversões',
        detail: 'Mudar a nota mais grave (baixo) do acorde. 1ª Inversão: 3ª no baixo (ex: C/E = E-G-C). 2ª Inversão: 5ª no baixo (ex: C/G = G-C-E).',
        iconSymbol: '↹',
      },
      {
        title: 'Tétrades (7ªs)',
        detail: 'Acordes de 4 notas (Fundamental, 3ª, 5ª e 7ª). Exemplo: Cmaj7 (C-E-G-B), G7 (G-B-D-F).',
        iconSymbol: '𝄪',
      },
      {
        title: 'Execução Polifônica Simultânea',
        detail: 'No piano, os dedos devem baixar juntos. O sistema avalia o bloco completo dentro de uma janela humana (~200ms). Se faltar uma nota, o acorde permanece incompleto.',
        iconSymbol: '🎹',
      },
    ],
    visualExamples: [
      { label: 'Acorde C (Fundamental)', midi: 60, pitch: 'C4+E4+G4', clef: 'treble', description: 'Tríade em linhas consecutivas' },
      { label: 'Acorde C/E (1ª Inversão)', midi: 64, pitch: 'E4+G4+C5', clef: 'treble', description: 'Baixo na 3ª do acorde' },
      { label: 'Cmaj7 (Tétrade)', midi: 60, pitch: 'C4+E4+G4+B4', clef: 'treble', description: '4 notas empilhadas em terças' },
    ],
    practicalTip: 'Visualmente, uma tríade no estado fundamental parece um "boneco de neve": três notas perfeitas em linhas seguidas ou em espaços seguidos!',
  },
];
