import type { ChordDefinition, ChordQuality, NoteInfo } from './types';

// Linha cromática de referência (12 semitons)
export const CHROMATIC_NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CHROMATIC_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const NOTE_NAMES_PT: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó♯', 'Db': 'Ré♭',
  'D': 'Ré', 'D#': 'Ré♯', 'Eb': 'Mi♭',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá♯', 'Gb': 'Sol♭',
  'G': 'Sol', 'G#': 'Sol♯', 'Ab': 'Lá♭',
  'A': 'Lá', 'A#': 'Lá♯', 'Bb': 'Si♭',
  'B': 'Si'
};

// Cálculo de frequência para qualquer nota MIDI (A4 = 440 Hz = MIDI 69)
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Constrói objeto NoteInfo completo (Padrão Internacional SPN / MIDI Standard: Dó Central = C4 / MIDI 60)
export function getNoteInfo(midi: number, preferFlat = false): NoteInfo {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = ((midi % 12) + 12) % 12;
  const name = preferFlat ? CHROMATIC_NOTES_FLAT[noteIndex] : CHROMATIC_NOTES_SHARP[noteIndex];
  const letter = name[0];
  const accidental = name.length > 1 ? (name[1] as '#' | 'b') : '';

  return {
    name,
    letter,
    accidental,
    midi,
    octave,
    frequency: midiToFrequency(midi),
  };
}

// Escalas Maiores com Armaduras e Enarmonia Rigorosa
export interface KeyScaleData {
  key: string;
  namePt: string;
  sharpsOrFlats: number;     // positivo = sustenidos, negativo = bemóis
  accidentalsSummary: string;
  notes: string[];
  relativeMinor: string;
}

export const MAJOR_SCALES_DATA: Record<string, KeyScaleData> = {
  'C': {
    key: 'C',
    namePt: 'Dó Maior',
    sharpsOrFlats: 0,
    accidentalsSummary: 'Nenhum acidente',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    relativeMinor: 'Am'
  },
  'G': {
    key: 'G',
    namePt: 'Sol Maior',
    sharpsOrFlats: 1,
    accidentalsSummary: '1 sustenido (F♯)',
    notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    relativeMinor: 'Em'
  },
  'D': {
    key: 'D',
    namePt: 'Ré Maior',
    sharpsOrFlats: 2,
    accidentalsSummary: '2 sustenidos (F♯, C♯)',
    notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    relativeMinor: 'Bm'
  },
  'A': {
    key: 'A',
    namePt: 'Lá Maior',
    sharpsOrFlats: 3,
    accidentalsSummary: '3 sustenidos (F♯, C♯, G♯)',
    notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    relativeMinor: 'F#m'
  },
  'E': {
    key: 'E',
    namePt: 'Mi Maior',
    sharpsOrFlats: 4,
    accidentalsSummary: '4 sustenidos (F♯, C♯, G♯, D♯)',
    notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    relativeMinor: 'C#m'
  },
  'B': {
    key: 'B',
    namePt: 'Si Maior',
    sharpsOrFlats: 5,
    accidentalsSummary: '5 sustenidos (F♯, C♯, G♯, D♯, A♯)',
    notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    relativeMinor: 'G#m'
  },
  'F#': {
    key: 'F#',
    namePt: 'Fá♯ Maior',
    sharpsOrFlats: 6,
    accidentalsSummary: '6 sustenidos (F♯, C♯, G♯, D♯, A♯, E♯)',
    notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    relativeMinor: 'D#m'
  },
  'F': {
    key: 'F',
    namePt: 'Fá Maior',
    sharpsOrFlats: -1,
    accidentalsSummary: '1 bemol (B♭)',
    notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    relativeMinor: 'Dm'
  },
  'Bb': {
    key: 'Bb',
    namePt: 'Si♭ Maior',
    sharpsOrFlats: -2,
    accidentalsSummary: '2 bemóis (B♭, E♭)',
    notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    relativeMinor: 'Gm'
  },
  'Eb': {
    key: 'Eb',
    namePt: 'Mi♭ Maior',
    sharpsOrFlats: -3,
    accidentalsSummary: '3 bemóis (B♭, E♭, A♭)',
    notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    relativeMinor: 'Cm'
  },
  'Ab': {
    key: 'Ab',
    namePt: 'Lá♭ Maior',
    sharpsOrFlats: -4,
    accidentalsSummary: '4 bemóis (B♭, E♭, A♭, D♭)',
    notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    relativeMinor: 'Fm'
  },
  'Db': {
    key: 'Db',
    namePt: 'Ré♭ Maior',
    sharpsOrFlats: -5,
    accidentalsSummary: '5 bemóis (B♭, E♭, A♭, D♭, G♭)',
    notes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    relativeMinor: 'Bbm'
  }
};

// Círculo das Quintas ordenado no sentido horário (C -> G -> D -> A...)
export const CIRCLE_OF_FIFTHS_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

// Qualidades de acordes e intervalos
export const CHORD_QUALITIES: Record<ChordQuality, { name: string; suffix: string; intervals: number[]; degrees: string[] }> = {
  major: { name: 'Maior', suffix: '', intervals: [0, 4, 7], degrees: ['1', '3', '5'] },
  minor: { name: 'Menor', suffix: 'm', intervals: [0, 3, 7], degrees: ['1', '♭3', '5'] },
  dom7: { name: 'Com Sétima', suffix: '7', intervals: [0, 4, 7, 10], degrees: ['1', '3', '5', '♭7'] },
  maj7: { name: 'Com Sétima Maior', suffix: 'maj7', intervals: [0, 4, 7, 11], degrees: ['1', '3', '5', '7M'] },
  min7: { name: 'Menor com Sétima', suffix: 'm7', intervals: [0, 3, 7, 10], degrees: ['1', '♭3', '5', '♭7'] },
  m7b5: { name: 'Meio-Diminuto', suffix: 'm7(♭5)', intervals: [0, 3, 6, 10], degrees: ['1', '♭3', '♭5', '♭7'] },
  diminished: { name: 'Diminuto', suffix: 'dim', intervals: [0, 3, 6, 9], degrees: ['1', '♭3', '♭5', '𝄫7'] },
  augmented: { name: 'Aumentado', suffix: 'aug', intervals: [0, 4, 8], degrees: ['1', '3', '♯5'] },
};

// Gera objeto completo de acorde
export function buildChord(root: string, quality: ChordQuality, bassNote?: string): ChordDefinition {
  const rootIndex = CHROMATIC_NOTES_SHARP.indexOf(root) !== -1 
    ? CHROMATIC_NOTES_SHARP.indexOf(root) 
    : CHROMATIC_NOTES_FLAT.indexOf(root);
  
  const safeRootIndex = rootIndex >= 0 ? rootIndex : 0;
  const config = CHORD_QUALITIES[quality];
  const notes = config.intervals.map(semitones => {
    const idx = (safeRootIndex + semitones) % 12;
    return CHROMATIC_NOTES_SHARP[idx];
  });

  const rootPt = NOTE_NAMES_PT[root] || root;
  const symbol = `${root}${config.suffix}${bassNote ? `/${bassNote}` : ''}`;
  const name = `${rootPt} ${config.name}${bassNote ? ` com Baixo em ${NOTE_NAMES_PT[bassNote] || bassNote}` : ''}`;

  return {
    root,
    quality,
    symbol,
    name,
    intervals: config.intervals,
    notes,
    degrees: config.degrees,
    bassNote,
  };
}

// Inversões de Tríades para o Teclado
export function getKeyboardInversions(root: string, isMinor = false): {
  fundamental: { notes: string[]; midi: number[]; fingeringRH: number[] };
  firstInversion: { notes: string[]; midi: number[]; fingeringRH: number[] };
  secondInversion: { notes: string[]; midi: number[]; fingeringRH: number[] };
} {
  const rootIdx = CHROMATIC_NOTES_SHARP.indexOf(root) !== -1 
    ? CHROMATIC_NOTES_SHARP.indexOf(root) 
    : CHROMATIC_NOTES_FLAT.indexOf(root);
  const baseMidi = 60 + (rootIdx >= 0 ? rootIdx : 0); // Região do Dó Central C3 (MIDI 60)
  const thirdInterval = isMinor ? 3 : 4;
  const fifthInterval = 7;

  // Fundamental: 1 - 3 - 5 (Dedos 1 - 3 - 5)
  const fundMidi = [baseMidi, baseMidi + thirdInterval, baseMidi + fifthInterval];
  // 1ª Inversão: 3 - 5 - 1 (+1 oitava na raiz) (Dedos 1 - 2 - 5)
  const inv1Midi = [baseMidi + thirdInterval, baseMidi + fifthInterval, baseMidi + 12];
  // 2ª Inversão: 5 - 1 - 3 (+1 oitava na raiz e terça) (Dedos 1 - 3 - 5 ou 1 - 2 - 4)
  const inv2Midi = [baseMidi + fifthInterval, baseMidi + 12, baseMidi + 12 + thirdInterval];

  return {
    fundamental: {
      notes: fundMidi.map(m => getNoteInfo(m).name),
      midi: fundMidi,
      fingeringRH: [1, 3, 5],
    },
    firstInversion: {
      notes: inv1Midi.map(m => getNoteInfo(m).name),
      midi: inv1Midi,
      fingeringRH: [1, 2, 5],
    },
    secondInversion: {
      notes: inv2Midi.map(m => getNoteInfo(m).name),
      midi: inv2Midi,
      fingeringRH: [1, 3, 5],
    }
  };
}

// Afinação padrão do violão: E1, A1, D2, G2, B2, E3 (Padrão Solfejo Latino / Yamaha)
export const GUITAR_TUNING_MIDI = [
  { string: 6, name: 'E1', midi: 40 }, // E grave
  { string: 5, name: 'A1', midi: 45 }, // A
  { string: 4, name: 'D2', midi: 50 }, // D
  { string: 3, name: 'G2', midi: 55 }, // G
  { string: 2, name: 'B2', midi: 59 }, // B (Salto de 3ª Maior!)
  { string: 1, name: 'E3', midi: 64 }, // E agudo
];

// Retorna nota no braço do violão dada a corda (1-6) e casa (0-15)
export function getGuitarFretNote(stringNum: number, fret: number): NoteInfo {
  const openString = GUITAR_TUNING_MIDI.find(s => s.string === stringNum) || GUITAR_TUNING_MIDI[0];
  const midi = openString.midi + fret;
  return getNoteInfo(midi);
}
