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
  clef: 'treble' | 'bass';
  notes: { letter: string; accidental: '' | '#' | 'b'; midi: number }[];
}

export const PRESET_SEQUENCES: SequencePreset[] = [
  {
    title: 'Escala de Dó Maior Ascendente',
    clef: 'treble',
    notes: [
      { letter: 'C', accidental: '', midi: 60 },
      { letter: 'D', accidental: '', midi: 62 },
      { letter: 'E', accidental: '', midi: 64 },
      { letter: 'F', accidental: '', midi: 65 },
      { letter: 'G', accidental: '', midi: 67 },
      { letter: 'A', accidental: '', midi: 69 },
      { letter: 'B', accidental: '', midi: 71 },
      { letter: 'C', accidental: '', midi: 72 },
    ],
  },
  {
    title: 'Arpejo Maior Triádico (Dó - Mi - Sol)',
    clef: 'treble',
    notes: [
      { letter: 'C', accidental: '', midi: 60 },
      { letter: 'E', accidental: '', midi: 64 },
      { letter: 'G', accidental: '', midi: 67 },
      { letter: 'C', accidental: '', midi: 72 },
      { letter: 'G', accidental: '', midi: 67 },
      { letter: 'E', accidental: '', midi: 64 },
      { letter: 'C', accidental: '', midi: 60 },
    ],
  },
  {
    title: 'Frase Clássica: Ode à Alegria (Beethoven)',
    clef: 'treble',
    notes: [
      { letter: 'E', accidental: '', midi: 64 },
      { letter: 'E', accidental: '', midi: 64 },
      { letter: 'F', accidental: '', midi: 65 },
      { letter: 'G', accidental: '', midi: 67 },
      { letter: 'G', accidental: '', midi: 67 },
      { letter: 'F', accidental: '', midi: 65 },
      { letter: 'E', accidental: '', midi: 64 },
      { letter: 'D', accidental: '', midi: 62 },
    ],
  },
  {
    title: 'Baixo Fundamental em Clave de Fá (C - G - Am - F)',
    clef: 'bass',
    notes: [
      { letter: 'C', accidental: '', midi: 48 },
      { letter: 'G', accidental: '', midi: 43 },
      { letter: 'A', accidental: '', midi: 45 },
      { letter: 'F', accidental: '', midi: 41 },
    ],
  },
  {
    title: 'Arpejo Grave em Clave de Fá (Dó - Mi - Sol - Dó)',
    clef: 'bass',
    notes: [
      { letter: 'C', accidental: '', midi: 36 },
      { letter: 'E', accidental: '', midi: 40 },
      { letter: 'G', accidental: '', midi: 43 },
      { letter: 'C', accidental: '', midi: 48 },
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
    clef: preset.clef,
    staffPosition: { type: 'space', index: 2, description: `Nota ${idx + 1}` },
    isLedger: n.midi <= 60 && preset.clef === 'treble',
  }));

  return {
    id: `ex_seq_${Date.now()}`,
    type: 'sequences',
    clef: preset.clef,
    title: preset.title,
    description: `Toque cada nota em sequência no seu ritmo (Wait Mode ativo)`,
    notes,
    expectedMidis: notes.map((n) => n.midi),
  };
}

/** 4. Leitura de Acordes (Harmonia) */
export interface ChordReadingPreset {
  symbol: string;
  namePt: string;
  clef: 'treble' | 'bass' | 'grand';
  notes: { midi: number; letter: string; accidental: '' | '#' | 'b'; clef: 'treble' | 'bass' }[];
}

export const CHORD_PRESETS: ChordReadingPreset[] = [
  {
    symbol: 'C',
    namePt: 'Dó Maior',
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
    clef: 'treble',
    notes: [
      { midi: 69, letter: 'A', accidental: '', clef: 'treble' },
      { midi: 72, letter: 'C', accidental: '', clef: 'treble' },
      { midi: 76, letter: 'E', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'G7',
    namePt: 'Sol com Sétima',
    clef: 'treble',
    notes: [
      { midi: 67, letter: 'G', accidental: '', clef: 'treble' },
      { midi: 71, letter: 'B', accidental: '', clef: 'treble' },
      { midi: 74, letter: 'D', accidental: '', clef: 'treble' },
      { midi: 77, letter: 'F', accidental: '', clef: 'treble' },
    ],
  },
  {
    symbol: 'C (Baixo)',
    namePt: 'Dó Maior no Baixo',
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
    isLedger: n.midi <= 60 && n.clef === 'treble',
  }));

  return {
    id: `ex_chord_${Date.now()}`,
    type: 'chords',
    clef: preset.clef,
    title: `Acorde: ${preset.symbol} (${preset.namePt})`,
    description: `Leia e toque todas as notas do acorde simultaneamente ou individualmente`,
    notes,
    expectedMidis: notes.map((n) => n.midi),
    chordSymbol: preset.symbol,
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
