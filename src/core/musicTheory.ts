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

import { octaveConfigStore, type OctaveStandard } from './octaveConfigStore';

// Constrói objeto NoteInfo completo (Padrão C3 Brasil ou C4 Internacional)
export function getNoteInfo(midi: number, preferFlat = false, standard?: OctaveStandard): NoteInfo {
  const std = standard ?? octaveConfigStore.getStandard();
  const octave = Math.floor(midi / 12) + (std === 'C4' ? -1 : -2);
  const noteIndex = ((midi % 12) + 12) % 12;
  const name = preferFlat ? CHROMATIC_NOTES_FLAT[noteIndex] : CHROMATIC_NOTES_SHARP[noteIndex];
  const letter = name[0];
  const accidental = name.length > 1 ? (name[1] as '#' | 'b') : '';
  const fullName = `${name}${octave}`;
  const ptBase = NOTE_NAMES_PT[name] || name;
  const namePt = `${ptBase}${octave}`;

  return {
    name,
    letter,
    accidental,
    midi,
    octave,
    frequency: midiToFrequency(midi),
    fullName,
    namePt,
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

export interface ParsedChord {
  symbol: string;
  root: string;
  quality: ChordQuality;
  bassNote?: string;
  notes: string[];
  notesPt: string[];
  notesFormatted: string;
  midiNotes: number[];
}

/** Converte símbolo de cifra (ex: 'C', 'G/B', 'Am7') em notas musicais e voicings MIDI */
export function parseChord(chordStr: string): ParsedChord | null {
  if (!chordStr || typeof chordStr !== 'string') return null;
  const raw = chordStr.trim();
  if (!raw) return null;

  let symbolPart = raw;
  let bassPart: string | undefined;

  if (raw.includes('/')) {
    const parts = raw.split('/');
    symbolPart = parts[0].trim();
    bassPart = parts[1].trim();
  }

  // Identifica a tônica (Root): notas com acidente ou simples
  let root = '';
  let suffix = '';

  if (symbolPart.length >= 2 && (symbolPart[1] === '#' || symbolPart[1] === 'b')) {
    root = symbolPart.slice(0, 2);
    suffix = symbolPart.slice(2).trim();
  } else {
    root = symbolPart.slice(0, 1);
    suffix = symbolPart.slice(1).trim();
  }

  // Normalização e validação da tônica
  const rootUpper = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase().replace('♯', '#').replace('♭', 'b');
  const validRoot = CHROMATIC_NOTES_SHARP.find(n => n.toUpperCase() === rootUpper.toUpperCase()) ||
                    CHROMATIC_NOTES_FLAT.find(n => n.toUpperCase() === rootUpper.toUpperCase());
  if (!validRoot) return null;

  let validBass: string | undefined;
  if (bassPart) {
    const bassUpper = bassPart.charAt(0).toUpperCase() + bassPart.slice(1).toLowerCase().replace('♯', '#').replace('♭', 'b');
    validBass = CHROMATIC_NOTES_SHARP.find(n => n.toUpperCase() === bassUpper.toUpperCase()) ||
                CHROMATIC_NOTES_FLAT.find(n => n.toUpperCase() === bassUpper.toUpperCase()) || bassPart;
  }

  // Identificação da qualidade harmônica
  let quality: ChordQuality = 'major';
  const s = suffix.toLowerCase();

  if (s === 'm7b5' || s === 'm7(b5)' || s === 'ø' || s === 'm7(♭5)') {
    quality = 'm7b5';
  } else if (s === 'maj7' || s === '7m' || s === 'Δ' || s === '7+' || s === 'm7+') {
    quality = 'maj7';
  } else if (s === 'm7' || s === 'min7' || s === '-7') {
    quality = 'min7';
  } else if (s === 'dim' || s === '°' || s === 'dim7') {
    quality = 'diminished';
  } else if (s === 'aug' || s === '+' || s === 'aug7') {
    quality = 'augmented';
  } else if (s === 'm' || s === 'min' || s === '-') {
    quality = 'minor';
  } else if (s === '7' || s === 'dom7') {
    quality = 'dom7';
  } else {
    quality = 'major';
  }

  const chordDef = buildChord(validRoot, quality, validBass);
  const notesPt = chordDef.notes.map(n => NOTE_NAMES_PT[n] || n);
  const notesFormatted = notesPt.join(' • ');

  // Montagem das notas MIDI para execução polifônica realista no teclado:
  // Dó Central (C3) = MIDI 60.
  const rootIndex = CHROMATIC_NOTES_SHARP.indexOf(validRoot) !== -1
    ? CHROMATIC_NOTES_SHARP.indexOf(validRoot)
    : CHROMATIC_NOTES_FLAT.indexOf(validRoot);
  const safeRootIndex = rootIndex >= 0 ? rootIndex : 0;

  // Baixo (mão esquerda): fundamental ou nota do baixo especificada
  let bassMidi = 36 + safeRootIndex;
  if (validBass) {
    const bassIdx = CHROMATIC_NOTES_SHARP.indexOf(validBass) !== -1
      ? CHROMATIC_NOTES_SHARP.indexOf(validBass)
      : CHROMATIC_NOTES_FLAT.indexOf(validBass);
    if (bassIdx >= 0) bassMidi = 36 + bassIdx;
  }

  // Harmonia (mão direita/tríade): registro 48..72
  const config = CHORD_QUALITIES[quality];
  const harmonyBaseMidi = safeRootIndex <= 4 ? 60 + safeRootIndex : 48 + safeRootIndex;
  const harmonyMidi = config.intervals.map(semitones => harmonyBaseMidi + semitones);

  const midiNotes = Array.from(new Set([bassMidi, ...harmonyMidi])).sort((a, b) => a - b);

  return {
    symbol: chordDef.symbol,
    root: validRoot,
    quality,
    bassNote: validBass,
    notes: chordDef.notes,
    notesPt,
    notesFormatted,
    midiNotes,
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

export interface IdentifiedChord {
  symbol: string;        // ex: 'C', 'Am', 'G/B', 'Cmaj7', 'G7'
  namePt: string;        // ex: 'Dó Maior', 'Lá Menor', 'Sol Maior com baixo em Si'
  root: string;          // ex: 'C'
  quality: ChordQuality | 'sus4' | 'sus2' | 'add9' | 'dim7';
  bass?: string;         // ex: 'B'
  bassPt?: string;       // ex: 'Si'
  notesPt: string[];     // ['Dó', 'Mi', 'Sol']
  isInversion: boolean;
}

/**
 * Identifica acorde em tempo real a partir de conjunto de notas MIDI tocadas ou detectadas pelo microfone/áudio.
 * Reconhece Tríades, Tétrades, Inversões (Slash Chords) e Díades de intervalo.
 */
export function identifyChordFromMidi(midiNotes: number[], octaveStandard?: OctaveStandard): IdentifiedChord | null {
  if (!midiNotes || midiNotes.length === 0) return null;

  // Ordena notas do grave para o agudo
  const sortedMidi = [...midiNotes].sort((a, b) => a - b);
  const lowestMidi = sortedMidi[0];
  const lowestInfo = getNoteInfo(lowestMidi, false, octaveStandard);
  const bassPitchClass = ((lowestMidi % 12) + 12) % 12;

  // Extrai classes de altura únicas (0 a 11)
  const pitchClasses = Array.from(new Set(sortedMidi.map(m => ((m % 12) + 12) % 12)));

  // Se apenas 1 nota
  if (pitchClasses.length === 1) {
    const ptName = lowestInfo.namePt || lowestInfo.fullName;
    return {
      symbol: lowestInfo.fullName,
      namePt: `Nota ${ptName}`,
      root: lowestInfo.name,
      quality: 'major',
      notesPt: [ptName],
      isInversion: false,
    };
  }

  // Tabela de assinaturas intervalares a testar
  const patterns: Array<{
    intervals: number[];
    quality: ChordQuality | 'sus4' | 'sus2' | 'add9' | 'dim7';
    suffix: string;
    nameSuffixPt: string;
  }> = [
    // Tétrades (4 notas)
    { intervals: [0, 4, 7, 11], quality: 'maj7', suffix: 'maj7', nameSuffixPt: 'Maior com Sétima Maior' },
    { intervals: [0, 4, 7, 10], quality: 'dom7', suffix: '7', nameSuffixPt: 'com Sétima' },
    { intervals: [0, 3, 7, 10], quality: 'min7', suffix: 'm7', nameSuffixPt: 'Menor com Sétima' },
    { intervals: [0, 3, 6, 10], quality: 'm7b5', suffix: 'm7(b5)', nameSuffixPt: 'Meio-Diminuto' },
    { intervals: [0, 3, 6, 9], quality: 'dim7', suffix: 'dim7', nameSuffixPt: 'Diminuto com Sétima' },
    { intervals: [0, 2, 4, 7], quality: 'add9', suffix: 'add9', nameSuffixPt: 'Maior com Nona Adicionada' },
    // Tríades (3 notas)
    { intervals: [0, 4, 7], quality: 'major', suffix: '', nameSuffixPt: 'Maior' },
    { intervals: [0, 3, 7], quality: 'minor', suffix: 'm', nameSuffixPt: 'Menor' },
    { intervals: [0, 3, 6], quality: 'diminished', suffix: 'dim', nameSuffixPt: 'Diminuto' },
    { intervals: [0, 4, 8], quality: 'augmented', suffix: 'aug', nameSuffixPt: 'Aumentado' },
    { intervals: [0, 5, 7], quality: 'sus4', suffix: 'sus4', nameSuffixPt: 'Suspenso 4' },
    { intervals: [0, 2, 7], quality: 'sus2', suffix: 'sus2', nameSuffixPt: 'Suspenso 2' },
  ];

  // Testa cada pitch class presente como raiz potencial
  for (const rootPc of pitchClasses) {
    // Normaliza os intervalos relativos à raiz candidata
    const relIntervals = pitchClasses.map(pc => (pc - rootPc + 12) % 12).sort((a, b) => a - b);

    for (const pat of patterns) {
      if (pat.intervals.length === relIntervals.length &&
          pat.intervals.every((v, i) => v === relIntervals[i])) {
        const rootName = CHROMATIC_NOTES_SHARP[rootPc];
        const rootPt = NOTE_NAMES_PT[rootName] || rootName;
        const isInversion = bassPitchClass !== rootPc;
        const bassName = isInversion ? CHROMATIC_NOTES_SHARP[bassPitchClass] : undefined;
        const bassPt = bassName ? (NOTE_NAMES_PT[bassName] || bassName) : undefined;

        const symbol = `${rootName}${pat.suffix}${isInversion ? `/${bassName}` : ''}`;
        const namePt = `${rootPt} ${pat.nameSuffixPt}${isInversion ? ` com baixo em ${bassPt}` : ''}`;

        const notesPt = relIntervals.map(interval => {
          const notePc = (rootPc + interval) % 12;
          const nName = CHROMATIC_NOTES_SHARP[notePc];
          return NOTE_NAMES_PT[nName] || nName;
        });

        return {
          symbol,
          namePt,
          root: rootName,
          quality: pat.quality,
          bass: bassName,
          bassPt,
          notesPt,
          isInversion,
        };
      }
    }
  }

  // Se não bater com padrão exato de 3 ou 4 notas, mas tiver 2 notas (díade/intervalo)
  if (pitchClasses.length === 2) {
    const semitones = ((pitchClasses[1] - pitchClasses[0] + 12) % 12);
    const intervalNames: Record<number, string> = {
      1: 'Segunda Menor', 2: 'Segunda Maior',
      3: 'Terça Menor', 4: 'Terça Maior',
      5: 'Quarta Justa', 6: 'Trítono',
      7: 'Quinta Justa', 8: 'Sexta Menor',
      9: 'Sexta Maior', 10: 'Sétima Menor',
      11: 'Sétima Maior',
    };
    const rootName = CHROMATIC_NOTES_SHARP[pitchClasses[0]];
    const otherName = CHROMATIC_NOTES_SHARP[pitchClasses[1]];
    const intName = intervalNames[semitones] || `${semitones} semitons`;
    return {
      symbol: `${rootName}-${otherName}`,
      namePt: `Intervalo de ${intName} (${NOTE_NAMES_PT[rootName]} - ${NOTE_NAMES_PT[otherName]})`,
      root: rootName,
      quality: 'major',
      notesPt: [NOTE_NAMES_PT[rootName] || rootName, NOTE_NAMES_PT[otherName] || otherName],
      isInversion: false,
    };
  }

  return null;
}

