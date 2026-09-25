/**
 * Catálogo e Cálculo de Progressões Harmônicas e Tonalidades para Acompanhamento Musical.
 */

export interface HarmonicChord {
  symbol: string;         // ex: 'C', 'Am', 'G7', 'F#m7'
  namePt: string;         // ex: 'Dó Maior', 'Lá Menor'
  rootMidi: number;       // Fundamental em oitava grave para o baixo (ex: 36 = C1 / C2)
  fifthMidi: number;      // Quinta para linhas de baixo (ex: 43 = G)
  voicingMidi: number[];  // Notas intermediárias para acordes de teclado/violão
  arpeggioMidi: number[]; // Notas para o arpejador
}

export interface ProgressionDefinition {
  id: string;
  name: string;
  romanNumerals: string;
  description: string;
  mode: 'major' | 'minor' | 'both';
  chordsSteps: { degree: number; quality: 'maj' | 'min' | 'dom7' | 'min7' | 'maj7' | 'dim' }[];
}

export const TONALITY_ROOTS = [
  { note: 'C', label: 'Dó (C)' },
  { note: 'C#', label: 'Dó# (C#)' },
  { note: 'D', label: 'Ré (D)' },
  { note: 'Eb', label: 'Mi♭ (Eb)' },
  { note: 'E', label: 'Mi (E)' },
  { note: 'F', label: 'Fá (F)' },
  { note: 'F#', label: 'Fá# (F#)' },
  { note: 'G', label: 'Sol (G)' },
  { note: 'Ab', label: 'Lá♭ (Ab)' },
  { note: 'A', label: 'Lá (A)' },
  { note: 'Bb', label: 'Si♭ (Bb)' },
  { note: 'B', label: 'Si (B)' },
];

export const PROGRESSIONS: ProgressionDefinition[] = [
  {
    id: 'pop_4chords',
    name: '4 Acordes Pop (Eixo Hit)',
    romanNumerals: 'I – V – vi – IV',
    description: 'A progressão mais famosa da música pop internacional e brasileira (Let It Be, Someone Like You, Pais e Filhos).',
    mode: 'major',
    chordsSteps: [
      { degree: 0, quality: 'maj' },  // I
      { degree: 7, quality: 'maj' },  // V
      { degree: 9, quality: 'min' },  // vi
      { degree: 5, quality: 'maj' },  // IV
    ],
  },
  {
    id: 'cadence_basic',
    name: 'Cadência Perfeita Clássica',
    romanNumerals: 'I – IV – V – I',
    description: 'O pilar da harmonia tonal tradicional. Excelente para fixação auditiva de resolução harmônica.',
    mode: 'major',
    chordsSteps: [
      { degree: 0, quality: 'maj' },  // I
      { degree: 5, quality: 'maj' },  // IV
      { degree: 7, quality: 'maj' },  // V
      { degree: 0, quality: 'maj' },  // I
    ],
  },
  {
    id: 'jazz_ii_v_i',
    name: 'Jazz & Bossa Cadence',
    romanNumerals: 'ii7 – V7 – I7M – I7M',
    description: 'Progressão obrigatória do Jazz e da Bossa Nova com tétrades ricas (Garota de Ipanema, Autumn Leaves).',
    mode: 'major',
    chordsSteps: [
      { degree: 2, quality: 'min7' },  // ii7
      { degree: 7, quality: 'dom7' },  // V7
      { degree: 0, quality: 'maj7' },  // I7M
      { degree: 0, quality: 'maj7' },  // I7M
    ],
  },
  {
    id: 'ballad_50s',
    name: 'Doo-Wop / Balada Anos 50',
    romanNumerals: 'I – vi – IV – V',
    description: 'Nostalgia pura das grandes baladas e canções românticas (Stand By Me, Diana).',
    mode: 'major',
    chordsSteps: [
      { degree: 0, quality: 'maj' },  // I
      { degree: 9, quality: 'min' },  // vi
      { degree: 5, quality: 'maj' },  // IV
      { degree: 7, quality: 'maj' },  // V
    ],
  },
  {
    id: 'minor_epic',
    name: 'Menor Épico / Trilha Sonora',
    romanNumerals: 'i – VI – III – VII',
    description: 'Sonoridade poderosa, mística e cinematográfica muito usada no Rock e trilhas de jogos e filmes.',
    mode: 'minor',
    chordsSteps: [
      { degree: 0, quality: 'min' },   // i
      { degree: 8, quality: 'maj' },   // VI
      { degree: 3, quality: 'maj' },   // III
      { degree: 10, quality: 'maj' },  // VII
    ],
  },
  {
    id: 'bossa_turnaround',
    name: 'Turnaround Bossa Nova',
    romanNumerals: 'I7M – VI7(♭9) – ii7 – V7',
    description: 'Harmonia sincopada brasileira com acordes de passagem elegantes e modulantes.',
    mode: 'major',
    chordsSteps: [
      { degree: 0, quality: 'maj7' },  // I7M
      { degree: 9, quality: 'dom7' },  // VI7
      { degree: 2, quality: 'min7' },  // ii7
      { degree: 7, quality: 'dom7' },  // V7
    ],
  },
  {
    id: 'single_chord',
    name: 'Acorde Fixo (Estudo de Escalas & Solo)',
    romanNumerals: 'I (Contínuo)',
    description: 'Mantém o acorde fundamental fixo para você praticar escalas, improviso, afinação e digitação sem mudanças harmônicas.',
    mode: 'both',
    chordsSteps: [
      { degree: 0, quality: 'maj' },
    ],
  },
];

const ROOT_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'Eb': 3, 'D#': 3, 'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'Ab': 8, 'G#': 8, 'A': 9,
  'Bb': 10, 'A#': 10, 'B': 11,
};

const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_PT = ['Dó', 'Dó#', 'Ré', 'Mi♭', 'Mi', 'Fá', 'Fá#', 'Sol', 'Lá♭', 'Lá', 'Si♭', 'Si'];

/**
 * Constrói a lista de acordes calculados da progressão para a tonalidade selecionada
 */
export function buildProgressionChords(
  rootKey: string,
  mode: 'major' | 'minor' = 'major',
  progressionId = 'pop_4chords'
): HarmonicChord[] {
  const rootSemi = ROOT_SEMITONES[rootKey] ?? 0;
  const progression = PROGRESSIONS.find(p => p.id === progressionId) || PROGRESSIONS[0];

  return progression.chordsSteps.map((step) => {
    // Para modo menor se for single_chord
    const effectiveQuality = (progression.id === 'single_chord' && mode === 'minor') ? 'min' : step.quality;
    const chordRootSemi = (rootSemi + step.degree) % 12;

    const rootName = NOTE_NAMES_SHARP[chordRootSemi];
    const rootNamePt = NOTE_NAMES_PT[chordRootSemi];

    // Nome e Cifra
    let symbol = rootName;
    let namePt = `${rootNamePt} Maior`;

    if (effectiveQuality === 'min') {
      symbol += 'm';
      namePt = `${rootNamePt} Menor`;
    } else if (effectiveQuality === 'min7') {
      symbol += 'm7';
      namePt = `${rootNamePt} Menor com 7ª`;
    } else if (effectiveQuality === 'maj7') {
      symbol += '7M';
      namePt = `${rootNamePt} com 7ª Maior`;
    } else if (effectiveQuality === 'dom7') {
      symbol += '7';
      namePt = `${rootNamePt} com 7ª Dominante`;
    } else if (effectiveQuality === 'dim') {
      symbol += '°';
      namePt = `${rootNamePt} Diminuto`;
    }

    // Intervalos para formação do acorde
    let intervals: number[] = [0, 4, 7]; // Triade maior
    if (effectiveQuality === 'min') intervals = [0, 3, 7];
    else if (effectiveQuality === 'min7') intervals = [0, 3, 7, 10];
    else if (effectiveQuality === 'maj7') intervals = [0, 4, 7, 11];
    else if (effectiveQuality === 'dom7') intervals = [0, 4, 7, 10];
    else if (effectiveQuality === 'dim') intervals = [0, 3, 6];

    // Fundamental de Baixo: Região de C1 a B1 / C2 (MIDI 36 a 47)
    const baseBassMidi = 36 + chordRootSemi;
    const fifthMidi = baseBassMidi + (effectiveQuality === 'dim' ? 6 : 7);

    // Voicing de Harmonia: Região central de piano / violão (MIDI 52 a 72)
    // Mantém as notas do acorde dentro de uma oitava confortável com voice-leading agradável
    const baseChordMidi = 48 + chordRootSemi;
    const voicingMidi = intervals.map(semitone => {
      let m = baseChordMidi + semitone;
      // Garante que o acorde soe entre MIDI 52 (E3) e 76 (E5)
      while (m < 52) m += 12;
      while (m > 74) m -= 12;
      return m;
    }).sort((a, b) => a - b);

    // Arpeggio: fundamental, terça, quinta e oitava
    const arpeggioMidi = [
      baseChordMidi,
      baseChordMidi + intervals[1],
      baseChordMidi + intervals[2],
      baseChordMidi + 12,
    ];

    return {
      symbol,
      namePt,
      rootMidi: baseBassMidi,
      fifthMidi,
      voicingMidi,
      arpeggioMidi,
    };
  });
}
