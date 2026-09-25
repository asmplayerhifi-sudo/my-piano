import type { GuitarChordShape } from './types';
import { getNoteInfo, NOTE_NAMES_PT } from './musicTheory';

export type GuitarChordQuality = 'major' | 'minor' | 'maj7' | 'min7' | 'dom7' | 'dim' | 'sus4' | 'add9';

export interface GuitarRootNote {
  symbol: string;
  namePt: string;
  pitchClass: number; // 0 = C, 1 = C#, ... 11 = B
}

export const GUITAR_ROOT_NOTES: GuitarRootNote[] = [
  { symbol: 'C', namePt: 'Dó', pitchClass: 0 },
  { symbol: 'C#', namePt: 'Dó♯', pitchClass: 1 },
  { symbol: 'D', namePt: 'Ré', pitchClass: 2 },
  { symbol: 'D#', namePt: 'Ré♯', pitchClass: 3 },
  { symbol: 'E', namePt: 'Mi', pitchClass: 4 },
  { symbol: 'F', namePt: 'Fá', pitchClass: 5 },
  { symbol: 'F#', namePt: 'Fá♯', pitchClass: 6 },
  { symbol: 'G', namePt: 'Sol', pitchClass: 7 },
  { symbol: 'G#', namePt: 'Sol♯', pitchClass: 8 },
  { symbol: 'A', namePt: 'Lá', pitchClass: 9 },
  { symbol: 'A#', namePt: 'Lá♯', pitchClass: 10 },
  { symbol: 'B', namePt: 'Si', pitchClass: 11 },
];

export interface GuitarQualityOption {
  id: GuitarChordQuality;
  label: string;
  namePt: string;
  intervals: number[];
  formula: string;
}

export const GUITAR_QUALITIES: GuitarQualityOption[] = [
  { id: 'major', label: 'Maior', namePt: 'Maior', intervals: [0, 4, 7], formula: '1 - 3M - 5J' },
  { id: 'minor', label: 'Menor', namePt: 'Menor', intervals: [0, 3, 7], formula: '1 - 3m - 5J' },
  { id: 'maj7', label: '7M', namePt: 'com Sétima Maior', intervals: [0, 4, 7, 11], formula: '1 - 3M - 5J - 7M' },
  { id: 'min7', label: 'm7', namePt: 'Menor com Sétima', intervals: [0, 3, 7, 10], formula: '1 - 3m - 5J - 7m' },
  { id: 'dom7', label: '7', namePt: 'com Sétima Dominante', intervals: [0, 4, 7, 10], formula: '1 - 3M - 5J - 7m' },
  { id: 'dim', label: 'dim', namePt: 'Diminuto', intervals: [0, 3, 6], formula: '1 - 3m - 5d' },
  { id: 'sus4', label: 'sus4', namePt: 'com Quarta Suspensa', intervals: [0, 5, 7], formula: '1 - 4J - 5J' },
  { id: 'add9', label: 'add9', namePt: 'com Nona Adicionada', intervals: [0, 4, 7, 14], formula: '1 - 3M - 5J - 9M' },
];

export type CAGEDLetter = 'C' | 'A' | 'G' | 'E' | 'D';

// Base root pitch class for open CAGED forms
export const CAGED_BASE_ROOTS: Record<CAGEDLetter, number> = {
  'C': 0, // C
  'A': 9, // A
  'G': 7, // G
  'E': 4, // E
  'D': 2, // D
};

interface BaseShapeTemplate {
  frets: number[];       // [E6, A5, D4, G3, B2, e1]
  fingers: number[];     // default fingers
  barre?: { fret: number; strings: [number, number] };
  rootStrings: number[]; // which strings have the root note (1 = e, 6 = E)
}

// Templates for the 5 CAGED shapes across the 8 qualities
const SHAPE_TEMPLATES: Record<GuitarChordQuality, Record<CAGEDLetter, BaseShapeTemplate>> = {
  major: {
    'C': { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], rootStrings: [5, 2] },
    'A': { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], rootStrings: [5, 3] },
    'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], rootStrings: [6, 1, 3] },
    'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], rootStrings: [6, 4, 1] },
    'D': { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], rootStrings: [4, 2] },
  },
  minor: {
    'C': { frets: [-1, 3, 1, 0, 1, -1], fingers: [0, 4, 2, 0, 1, 0], rootStrings: [5, 2] },
    'A': { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], rootStrings: [5, 3] },
    'G': { frets: [3, 1, 0, 0, -1, 3], fingers: [3, 1, 0, 0, 0, 4], rootStrings: [6, 1] },
    'E': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], rootStrings: [6, 4, 1] },
    'D': { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 4, 1], rootStrings: [4, 2] },
  },
  maj7: {
    'C': { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], rootStrings: [5] },
    'A': { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], rootStrings: [5] },
    'G': { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 1], rootStrings: [6] },
    'E': { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], rootStrings: [6, 1] },
    'D': { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3], rootStrings: [4] },
  },
  min7: {
    'C': { frets: [-1, 3, 1, 3, 1, -1], fingers: [0, 3, 1, 4, 2, 0], rootStrings: [5] },
    'A': { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], rootStrings: [5] },
    'G': { frets: [3, 1, 0, 0, 3, 1], fingers: [3, 1, 0, 0, 4, 2], rootStrings: [6] },
    'E': { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], rootStrings: [6, 4, 1] },
    'D': { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], rootStrings: [4] },
  },
  dom7: {
    'C': { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], rootStrings: [5] },
    'A': { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], rootStrings: [5] },
    'G': { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], rootStrings: [6] },
    'E': { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], rootStrings: [6, 1] },
    'D': { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], rootStrings: [4] },
  },
  dim: {
    'C': { frets: [-1, 3, 4, 2, 4, -1], fingers: [0, 2, 3, 1, 4, 0], rootStrings: [5] },
    'A': { frets: [-1, 0, 1, 2, 1, -1], fingers: [0, 0, 1, 3, 2, 0], rootStrings: [5] },
    'G': { frets: [3, -1, 2, 3, 2, -1], fingers: [2, 0, 1, 3, 1, 0], rootStrings: [6] },
    'E': { frets: [0, 1, 2, 0, -1, -1], fingers: [0, 1, 2, 0, 0, 0], rootStrings: [6] },
    'D': { frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2], rootStrings: [4] },
  },
  sus4: {
    'C': { frets: [-1, 3, 3, 0, 1, 1], fingers: [0, 3, 4, 0, 1, 1], rootStrings: [5] },
    'A': { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 4, 0], rootStrings: [5] },
    'G': { frets: [3, 3, 0, 0, 1, 3], fingers: [3, 4, 0, 0, 1, 2], rootStrings: [6, 1] },
    'E': { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0], rootStrings: [6, 1] },
    'D': { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3], rootStrings: [4] },
  },
  add9: {
    'C': { frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 4, 0], rootStrings: [5] },
    'A': { frets: [-1, 0, 2, 4, 2, 0], fingers: [0, 0, 1, 4, 2, 0], rootStrings: [5] },
    'G': { frets: [3, 2, 0, 2, 0, 3], fingers: [3, 2, 0, 1, 0, 4], rootStrings: [6, 1] },
    'E': { frets: [0, 2, 2, 1, 0, 2], fingers: [0, 2, 3, 1, 0, 4], rootStrings: [6] },
    'D': { frets: [-1, -1, 0, 2, 5, 2], fingers: [0, 0, 0, 1, 4, 2], rootStrings: [4] },
  },
};

export interface InversionOption {
  id: 'root' | 'first' | 'second';
  label: string;
  bassNote: string;
  bassNotePt: string;
  symbol: string;
}

export interface GeneratedChordShape extends GuitarChordShape {
  fretRange: { min: number; max: number; label: string };
  degrees: string[]; // 6 strings from E6 to e1
  postureTip: string;
  availableInversions: InversionOption[];
  currentInversion: 'root' | 'first' | 'second';
}

/**
 * Calculates harmonic degree for a note relative to root
 */
export function calculateHarmonicDegree(notePitchClass: number, rootPitchClass: number, quality: GuitarChordQuality): string {
  const semitones = (notePitchClass - rootPitchClass + 12) % 12;
  switch (semitones) {
    case 0: return '1';
    case 1: return '2m';
    case 2: return quality === 'add9' ? '9M' : '2M';
    case 3: return '3m';
    case 4: return '3M';
    case 5: return quality === 'sus4' ? '4J' : '11';
    case 6: return quality === 'dim' ? '5d' : 'b5';
    case 7: return '5J';
    case 8: return '5a';
    case 9: return '6M';
    case 10: return quality === 'dom7' || quality === 'min7' ? '7m' : 'b7';
    case 11: return '7M';
    default: return `${semitones}`;
  }
}

/**
 * Generates dynamic GuitarChordShape for any Root, Quality, CAGED Shape and Bass Inversion
 */
export function generateGuitarChord(
  rootSymbol: string,
  quality: GuitarChordQuality = 'major',
  cagedLetter: CAGEDLetter = 'C',
  inversion: 'root' | 'first' | 'second' = 'root'
): GeneratedChordShape {
  const rootObj = GUITAR_ROOT_NOTES.find(r => r.symbol === rootSymbol) || GUITAR_ROOT_NOTES[0];
  const qualityObj = GUITAR_QUALITIES.find(q => q.id === quality) || GUITAR_QUALITIES[0];
  const basePitch = CAGED_BASE_ROOTS[cagedLetter];

  // Shift semitones from base open position
  let shift = (rootObj.pitchClass - basePitch + 12) % 12;

  // Retrieve base template
  const template = SHAPE_TEMPLATES[quality][cagedLetter];
  let frets = [...template.frets];
  let fingers = [...template.fingers];
  let barreFret: number | undefined;
  let barreStrings: [number, number] | undefined;

  // If shifted, transpose active frets
  if (shift > 0) {
    frets = frets.map(f => (f >= 0 ? f + shift : -1));

    // Determine barre: if open strings in template become fretted at `shift`
    const openStringsInTemplate = template.frets
      .map((f, idx) => ({ stringNum: 6 - idx, fret: f }))
      .filter(item => item.fret === 0);

    if (openStringsInTemplate.length >= 2) {
      barreFret = shift;
      const minStr = Math.min(...openStringsInTemplate.map(s => s.stringNum));
      const maxStr = Math.max(...openStringsInTemplate.map(s => s.stringNum));
      barreStrings = [minStr, maxStr];

      // Finger 1 handles the barre
      fingers = frets.map((f, idx) => {
        if (f === shift) return 1;
        if (f < 0) return 0;
        // Bump other fingers up by 1 if finger was 1 in base
        const origFinger = template.fingers[idx];
        if (origFinger === 1) return 2;
        if (origFinger === 2) return 3;
        if (origFinger === 3) return 4;
        return origFinger;
      });
    }
  }

  // Check if frets exceed 15 (fretboard limit), wrap down by 12 if possible
  const activeFrets = frets.filter(f => f >= 0);
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 0;
  if (maxFret > 15) {
    const wrapped = frets.map(f => (f >= 0 ? f - 12 : -1));
    if (wrapped.every(f => f >= -1 && (f === -1 || f >= 0))) {
      frets = wrapped;
      if (barreFret !== undefined && barreFret > 12) {
        barreFret -= 12;
      }
    }
  }

  // Calculate notes and degrees for all 6 strings [E6, A5, D4, G3, B2, e1]
  const tuningPitches = [40, 45, 50, 55, 59, 64]; // E6, A5, D4, G3, B2, e1
  const degrees: string[] = [];
  const stringNotes: string[] = [];

  for (let i = 0; i < 6; i++) {
    const f = frets[i];
    if (f === -1) {
      degrees.push('X');
      stringNotes.push('X');
    } else {
      const midi = tuningPitches[i] + f;
      const notePitchClass = midi % 12;
      const noteInfo = getNoteInfo(midi);
      stringNotes.push(noteInfo.name);
      degrees.push(calculateHarmonicDegree(notePitchClass, rootObj.pitchClass, quality));
    }
  }

  // Determine chord intervals for inversions
  // 3rd note and 5th note pitch classes
  const thirdInterval = quality === 'minor' || quality === 'min7' || quality === 'dim' ? 3 : 4;
  const fifthInterval = quality === 'dim' ? 6 : 7;
  const thirdPitch = (rootObj.pitchClass + thirdInterval) % 12;
  const fifthPitch = (rootObj.pitchClass + fifthInterval) % 12;

  const thirdNoteInfo = getNoteInfo(60 + thirdPitch);
  const fifthNoteInfo = getNoteInfo(60 + fifthPitch);

  const availableInversions: InversionOption[] = [
    {
      id: 'root',
      label: `${rootObj.symbol} (Fundamental)`,
      bassNote: rootObj.symbol,
      bassNotePt: rootObj.namePt,
      symbol: rootObj.symbol,
    },
    {
      id: 'first',
      label: `${rootObj.symbol}/${thirdNoteInfo.name} (1ª Inversão - Terça)`,
      bassNote: thirdNoteInfo.name,
      bassNotePt: NOTE_NAMES_PT[thirdNoteInfo.name] || thirdNoteInfo.name,
      symbol: `${rootObj.symbol}/${thirdNoteInfo.name}`,
    },
    {
      id: 'second',
      label: `${rootObj.symbol}/${fifthNoteInfo.name} (2ª Inversão - Quinta)`,
      bassNote: fifthNoteInfo.name,
      bassNotePt: NOTE_NAMES_PT[fifthNoteInfo.name] || fifthNoteInfo.name,
      symbol: `${rootObj.symbol}/${fifthNoteInfo.name}`,
    },
  ];

  let currentBass = rootObj.symbol;

  // Apply bass inversion modifications
  if (inversion === 'first') {
    currentBass = thirdNoteInfo.name;
    // Find closest string for the third in low strings (E6 or A5)
    // E6 tuning is pitch 40 (E). Check if third note can be fretted on E6
    const e6Pitch = 40 % 12; // 4 (E)
    const fretOnE6 = (thirdPitch - e6Pitch + 12) % 12;
    if (fretOnE6 <= 7) {
      frets[0] = fretOnE6; // E6 string
      fingers[0] = fretOnE6 === 0 ? 0 : 1;
    } else {
      const a5Pitch = 45 % 12; // 9 (A)
      const fretOnA5 = (thirdPitch - a5Pitch + 12) % 12;
      frets[0] = -1; // Mute E6
      frets[1] = fretOnA5;
      fingers[1] = fretOnA5 === 0 ? 0 : 2;
    }
  } else if (inversion === 'second') {
    currentBass = fifthNoteInfo.name;
    const e6Pitch = 40 % 12; // 4 (E)
    const fretOnE6 = (fifthPitch - e6Pitch + 12) % 12;
    if (fretOnE6 <= 7) {
      frets[0] = fretOnE6;
      fingers[0] = fretOnE6 === 0 ? 0 : 3;
    } else {
      const a5Pitch = 45 % 12; // 9 (A)
      const fretOnA5 = (fifthPitch - a5Pitch + 12) % 12;
      frets[0] = -1;
      frets[1] = fretOnA5;
      fingers[1] = fretOnA5 === 0 ? 0 : 1;
    }
  }

  // Recalculate fret range
  const validFrets = frets.filter(f => f > 0);
  const minActive = validFrets.length > 0 ? Math.min(...validFrets) : 0;
  const maxActive = validFrets.length > 0 ? Math.max(...validFrets) : 0;
  const fretRangeLabel = minActive === 0 && maxActive === 0
    ? 'Casas Abertas (0)'
    : minActive === maxActive
      ? `Casa ${minActive}`
      : `Casas ${minActive} a ${maxActive}`;

  // Build posture and biomechanics tip
  let postureTip = '';
  if (barreFret !== undefined && barreFret > 0) {
    postureTip = `Pestana no Traste ${barreFret} com o Dedo 1 (Indicador). Mantenha a falange lateral firme contra o braço e o polegar alinhado atrás do traste central para suporte de alavanca.`;
  } else if (inversion !== 'root') {
    postureTip = `Baixo invertido em ${currentBass}: destaque a palhetada na corda mais grave executada pelo polegar e certifique-se de abafar suavemente cordas não pertencentes ao acorde.`;
  } else if (cagedLetter === 'C') {
    postureTip = `Shape C: Mantenha os dedos arqueados na ponta para não esbarrar nas cordas adjacentes. Fundamental clara na 5ª corda.`;
  } else if (cagedLetter === 'A') {
    postureTip = `Shape A: O bloco de 3 notas nas cordas D, G e B pode ser feito com dedos 1-2-3 ou mini-pestana do Dedo 3 (Anelar).`;
  } else if (cagedLetter === 'G') {
    postureTip = `Shape G: Posição aberta estendida com baixo na 6ª corda. Apoie o punho relaxado sem tensão no tendão flexor.`;
  } else if (cagedLetter === 'E') {
    postureTip = `Shape E: Formato clássico e sonoro. Garanta que a 1ª e a 6ª cordas soem limpas e sem chiados.`;
  } else {
    postureTip = `Shape D: Foco nas cordas agudas. O polegar da mão esquerda pode apoiar a parte superior do braço para estabilidade.`;
  }

  // Chord display title
  const qualitySuffix = qualityObj.namePt ? ` ${qualityObj.namePt}` : '';
  const chordName = `${rootObj.namePt}${qualitySuffix} (Shape ${cagedLetter})`;

  return {
    name: chordName,
    cagedLetter,
    rootNote: rootObj.symbol,
    frets,
    fingers,
    barreFret,
    barreStrings,
    bassNote: currentBass,
    fretRange: {
      min: minActive,
      max: maxActive,
      label: fretRangeLabel,
    },
    degrees,
    postureTip,
    availableInversions,
    currentInversion: inversion,
  };
}

/**
 * Returns dynamic fret range descriptions for all 5 CAGED letters for the given root and quality
 */
export function getCAGEDPositionsSummary(rootSymbol: string, quality: GuitarChordQuality = 'major'): Record<CAGEDLetter, string> {
  const letters: CAGEDLetter[] = ['C', 'A', 'G', 'E', 'D'];
  const summary: Partial<Record<CAGEDLetter, string>> = {};

  letters.forEach(letter => {
    const shape = generateGuitarChord(rootSymbol, quality, letter, 'root');
    summary[letter] = shape.fretRange.label;
  });

  return summary as Record<CAGEDLetter, string>;
}
