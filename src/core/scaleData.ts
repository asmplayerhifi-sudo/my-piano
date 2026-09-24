import { CHROMATIC_NOTES_SHARP, CHROMATIC_NOTES_FLAT, NOTE_NAMES_PT } from './musicTheory';

export type ScaleCategory = 'pentatonic' | 'modes' | 'minor' | 'symmetric';

export interface ScaleDegreeInfo {
  degree: string;
  namePt: string;
  isTonic?: boolean;
  isBlueNote?: boolean;
  isCharacteristic?: boolean;
}

export interface ScaleDefinition {
  id: string;
  name: string;
  shortName: string;
  category: ScaleCategory;
  categoryLabel: string;
  formula: string;
  intervals: number[];
  degrees: ScaleDegreeInfo[];
  description: string;
  musicalUse: string;
  famousExamples: string;
  compatibleChords: string[];
}

export const SCALES_CATALOG: ScaleDefinition[] = [
  // =========================================================================
  // 1. PENTATÔNICAS (As Mais Usadas no Mundo da Música)
  // =========================================================================
  {
    id: 'penta-minor',
    name: 'Pentatônica Menor',
    shortName: 'Penta Menor',
    category: 'pentatonic',
    categoryLabel: 'Pentatônicas',
    formula: '1½T - T - T - 1½T - T',
    intervals: [0, 3, 5, 7, 10],
    degrees: [
      { degree: '1', namePt: 'Tônica', isTonic: true },
      { degree: '♭3', namePt: 'Terça Menor' },
      { degree: '4', namePt: 'Quarta Justa' },
      { degree: '5', namePt: 'Quinta Justa' },
      { degree: '♭7', namePt: 'Sétima Menor' },
    ],
    description: 'A escala mais famosa e executada na história do Rock, Blues, Pop, Heavy Metal e MPB. Não possui notas de tensão evitáveis (semitons), funcionando com fluidez absoluta.',
    musicalUse: 'Improvisação universal sobre acordes menores (m, m7, m9) e progressões de Blues de 12 compassos.',
    famousExamples: 'B.B. King, Jimmy Page (Led Zeppelin), David Gilmour (Pink Floyd), Slash (Guns N Roses).',
    compatibleChords: ['Am', 'Am7', 'Am9', 'A7 (Blues)', 'Blues de 12 Compassos'],
  },
  {
    id: 'blues',
    name: 'Escala Blues (Pentablues)',
    shortName: 'Blues (♭5)',
    category: 'pentatonic',
    categoryLabel: 'Pentatônicas',
    formula: '1½T - T - ST - ST - 1½T - T',
    intervals: [0, 3, 5, 6, 7, 10],
    degrees: [
      { degree: '1', namePt: 'Tônica', isTonic: true },
      { degree: '♭3', namePt: 'Terça Menor' },
      { degree: '4', namePt: 'Quarta Justa' },
      { degree: '♭5', namePt: 'Blue Note (5ª Diminuta)', isBlueNote: true },
      { degree: '5', namePt: 'Quinta Justa' },
      { degree: '♭7', namePt: 'Sétima Menor' },
    ],
    description: 'A lendária escala de Blues com a adição da "Blue Note" (quinta diminuta ♭5). Cria uma tensão dramática, chorada e expressiva inconfundível.',
    musicalUse: 'Ataques expressivos, cromatismos 4 -> ♭5 -> 5, bends e frases rasgadas no Blues, Rock, Funk e Jazz.',
    famousExamples: 'Stevie Ray Vaughan, Muddy Waters, Jimi Hendrix, Eric Clapton, Gary Moore.',
    compatibleChords: ['A7', 'Am7', 'D7', 'E7', 'Blues Tradicional'],
  },
  {
    id: 'penta-major',
    name: 'Pentatônica Maior',
    shortName: 'Penta Maior',
    category: 'pentatonic',
    categoryLabel: 'Pentatônicas',
    formula: 'T - T - 1½T - T - 1½T',
    intervals: [0, 2, 4, 7, 9],
    degrees: [
      { degree: '1', namePt: 'Tônica', isTonic: true },
      { degree: '2', namePt: 'Segunda Maior' },
      { degree: '3', namePt: 'Terça Maior' },
      { degree: '5', namePt: 'Quinta Justa' },
      { degree: '6', namePt: 'Sexta Maior' },
    ],
    description: 'Sonoridade aberta, alegre, luminosa e extremamente melódica. Muito usada quando se deseja um solo cantável sem a aspereza do 4º ou 7º graus maiores.',
    musicalUse: 'Solos cantáveis, melodias de violão/piano, Gospel, Country, R&B, Pop e baladas sertanejas e MPB.',
    famousExamples: 'Stevie Wonder, Allman Brothers ("Ramblin Man"), Gilberto Gil, Djavan.',
    compatibleChords: ['C', 'Cmaj7', 'C6', 'Cadd9', 'G7'],
  },
  {
    id: 'penta-dorian',
    name: 'Pentatônica Dórica',
    shortName: 'Penta Dórica',
    category: 'pentatonic',
    categoryLabel: 'Pentatônicas',
    formula: '1½T - T - T - T - 1½T',
    intervals: [0, 3, 5, 7, 9],
    degrees: [
      { degree: '1', namePt: 'Tônica', isTonic: true },
      { degree: '♭3', namePt: 'Terça Menor' },
      { degree: '4', namePt: 'Quarta Justa' },
      { degree: '5', namePt: 'Quinta Justa' },
      { degree: '6M', namePt: 'Sexta Maior (Dórica)', isCharacteristic: true },
    ],
    description: 'Variação sofisticada da pentatônica menor onde a 7ª é substituída pela 6ª Maior, capturando a essência do modo Dórico sem choques harmônicos.',
    musicalUse: 'Fusão entre jazz e rock, solos sobre acordes m6 e m7 com sabor latino e elegante.',
    famousExamples: 'Carlos Santana, Robben Ford, George Benson, Larry Carlton.',
    compatibleChords: ['Dm6', 'Dm7', 'Dm9', 'G7', 'Gm7'],
  },

  // =========================================================================
  // 2. MODOS GREGOS MAIS USADOS NA MÚSICA POPULAR
  // =========================================================================
  {
    id: 'mode-dorian',
    name: 'Modo Dórico (2º Grau)',
    shortName: 'Modo Dórico',
    category: 'modes',
    categoryLabel: 'Modos Gregos',
    formula: 'T - ST - T - T - T - ST - T',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: 'ii', namePt: 'Segunda Maior' },
      { degree: '♭III', namePt: 'Terça Menor' },
      { degree: 'IV', namePt: 'Quarta Justa' },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: 'VI', namePt: 'Sexta Maior (Nota Característica)', isCharacteristic: true },
      { degree: '♭VII', namePt: 'Sétima Menor' },
    ],
    description: 'Escala menor com a Sexta Maior brilhante. É o modo menor mais elegante da história, eliminando o peso sombrio da escala menor comum.',
    musicalUse: 'Base de clássicos do Jazz Modal, Funk, Rock Progressivo, MPB (Clube da Esquina) e música latina.',
    famousExamples: 'Miles Davis ("So What"), Carlos Santana ("Oye Como Va"), Pink Floyd ("Breathe"), Milton Nascimento.',
    compatibleChords: ['Dm7', 'Dm6', 'Dm9', 'G7', 'Em7/D'],
  },
  {
    id: 'mode-mixolydian',
    name: 'Modo Mixolídio (5º Grau)',
    shortName: 'Mixolídio (Nordeste & Rock)',
    category: 'modes',
    categoryLabel: 'Modos Gregos',
    formula: 'T - T - ST - T - T - ST - T',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: 'II', namePt: 'Segunda Maior' },
      { degree: 'III', namePt: 'Terça Maior' },
      { degree: 'IV', namePt: 'Quarta Justa' },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: 'VI', namePt: 'Sexta Maior' },
      { degree: '♭VII', namePt: 'Sétima Menor (Nota Característica)', isCharacteristic: true },
    ],
    description: 'A Escala Maior com a 7ª menor. É o som definitivo da música nordestina brasileira (Baião, Frevo, Forró) e dos maiores hinos do Classic Rock.',
    musicalUse: 'Sobre acordes dominantes (X7), vamps de dois acordes (I - ♭VII), solos de Baião e Southern Rock.',
    famousExamples: 'Luiz Gonzaga ("Asa Branca"), Lynyrd Skynyrd ("Sweet Home Alabama"), Beatles ("Hey Jude"), Guns N Roses.',
    compatibleChords: ['G7', 'F/G', 'G', 'F', 'C/G'],
  },
  {
    id: 'mode-lydian',
    name: 'Modo Lídio (4º Grau)',
    shortName: 'Lídio (Cósmico / Cinema)',
    category: 'modes',
    categoryLabel: 'Modos Gregos',
    formula: 'T - T - T - ST - T - T - ST',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: 'II', namePt: 'Segunda Maior' },
      { degree: 'III', namePt: 'Terça Maior' },
      { degree: '♯IV', namePt: 'Quarta Aumentada (Nota Cósmica)', isCharacteristic: true },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: 'VI', namePt: 'Sexta Maior' },
      { degree: 'VII', namePt: 'Sétima Maior' },
    ],
    description: 'A escala maior mais brilhante que existe, caracterizada pela 4ª aumentada (trítono). Cria uma sensação imediata de vôo, espaço e ficção científica.',
    musicalUse: 'Trilhas sonoras de Hollywood, cinema, aberturas futuristas, solos instrumentais de guitarra e piano moderno.',
    famousExamples: 'John Williams ("E.T. - O Extraterrestre"), Abertura dos "Simpsons", Steve Vai, Joe Satriani.',
    compatibleChords: ['Cmaj7(♯11)', 'Cmaj7', 'D/C', 'Cadd9(♯11)'],
  },
  {
    id: 'mode-phrygian',
    name: 'Modo Frígio (3º Grau)',
    shortName: 'Frígio (Flamenco / Metal)',
    category: 'modes',
    categoryLabel: 'Modos Gregos',
    formula: 'ST - T - T - T - ST - T - T',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: '♭II', namePt: 'Segunda Menor (Nota Espanhola)', isCharacteristic: true },
      { degree: '♭III', namePt: 'Terça Menor' },
      { degree: 'IV', namePt: 'Quarta Justa' },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: '♭VI', namePt: 'Sexta Menor' },
      { degree: '♭VII', namePt: 'Sétima Menor' },
    ],
    description: 'Escala menor com a Segunda Menor (♭2) no primeiro semitom. Carrega forte sabor andaluz, cigano, árabe e agressividade no Heavy Metal.',
    musicalUse: 'Música Flamenca, riffs de Thrash Metal, passagens orientais e climas de tensão e suspense.',
    famousExamples: 'Paco de Lucía, Metallica ("Wherever I May Roam"), Iron Maiden, Megadeth.',
    compatibleChords: ['Em', 'F/E', 'Em7(♭9)', 'Esus4(♭9)'],
  },
  {
    id: 'mode-major-ionian',
    name: 'Escala Maior (Modo Jônio)',
    shortName: 'Maior Natural (Jônio)',
    category: 'modes',
    categoryLabel: 'Modos Gregos',
    formula: 'T - T - ST - T - T - T - ST',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: 'ii', namePt: 'Segunda Maior' },
      { degree: 'iii', namePt: 'Terça Maior' },
      { degree: 'IV', namePt: 'Quarta Justa' },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: 'vi', namePt: 'Sexta Maior' },
      { degree: 'vii°', namePt: 'Sensível (7M)' },
    ],
    description: 'A matriz de toda a harmonia tonal ocidental. Gera o campo harmônico diatônico maior e todas as relações de tônica, subdominante e dominante.',
    musicalUse: 'Baladas, hinos, música clássica, pop, MPB e estruturação teórica fundamental.',
    famousExamples: 'Beethoven ("Ode à Alegria"), Beatles ("Let It Be"), Tom Jobim.',
    compatibleChords: ['C', 'Cmaj7', 'Dm7', 'Em7', 'F', 'G7', 'Am7'],
  },
  {
    id: 'mode-natural-minor',
    name: 'Escala Menor Natural (Modo Eólio)',
    shortName: 'Menor Natural (Eólio)',
    category: 'modes',
    categoryLabel: 'Modos Gregos',
    formula: 'T - ST - T - T - ST - T - T',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degrees: [
      { degree: 'i', namePt: 'Tônica', isTonic: true },
      { degree: 'ii°', namePt: 'Segunda Maior' },
      { degree: 'III', namePt: 'Terça Menor' },
      { degree: 'iv', namePt: 'Quarta Justa' },
      { degree: 'v', namePt: 'Quinta Justa' },
      { degree: 'VI', namePt: 'Sexta Menor' },
      { degree: 'VII', namePt: 'Subtônica (7m)' },
    ],
    description: 'A relativa menor direta da escala maior. Som melancólico, introspectivo e cinematográfico.',
    musicalUse: 'Baladas melancólicas, rock gótico, pop dramático e composições clássicas.',
    famousExamples: 'Gary Moore, Adele, Evanescence, Chopin.',
    compatibleChords: ['Am', 'Am7', 'Dm7', 'Em7', 'F', 'G', 'C'],
  },

  // =========================================================================
  // 3. ESCALAS MENORES CLÁSSICAS & ESPECIAIS
  // =========================================================================
  {
    id: 'harmonic-minor',
    name: 'Escala Menor Harmônica',
    shortName: 'Menor Harmônica',
    category: 'minor',
    categoryLabel: 'Menores & Clássicas',
    formula: 'T - ST - T - T - ST - 1½T - ST',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: 'ii°', namePt: 'Segunda Maior' },
      { degree: '♭III+', namePt: 'Terça Menor' },
      { degree: 'iv', namePt: 'Quarta Justa' },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: '♭VI', namePt: 'Sexta Menor' },
      { degree: 'vii°', namePt: 'Sensível Maior (7M)', isCharacteristic: true },
    ],
    description: 'Criada no período barroco para devolver o acorde dominante maior (V7) à tonalidade menor. Possui o famoso salto de segunda aumentada (1½ tom) entre o 6º e o 7º graus, gerando sonoridade árabe, barroca e neoclássica.',
    musicalUse: 'Passagens barrocas, Metal neoclássico, solos sobre o acorde dominante V7 em tom menor e música judaica/árabe.',
    famousExamples: 'J.S. Bach, Yngwie Malmsteen, Kiko Loureiro (Angra), "Hava Nagila".',
    compatibleChords: ['Am(maj7)', 'E7 (Dominante)', 'Bdim', 'G#dim7'],
  },
  {
    id: 'melodic-minor',
    name: 'Escala Menor Melódica (Jazz Minor)',
    shortName: 'Menor Melódica (Jazz)',
    category: 'minor',
    categoryLabel: 'Menores & Clássicas',
    formula: 'T - ST - T - T - T - T - ST',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    degrees: [
      { degree: 'I', namePt: 'Tônica', isTonic: true },
      { degree: 'ii', namePt: 'Segunda Maior' },
      { degree: '♭III', namePt: 'Terça Menor' },
      { degree: 'IV', namePt: 'Quarta Justa' },
      { degree: 'V', namePt: 'Quinta Justa' },
      { degree: 'VI', namePt: 'Sexta Maior' },
      { degree: 'VII', namePt: 'Sétima Maior' },
    ],
    description: 'Elevou a 6ª e a 7ª para eliminar o salto difícil da Menor Harmônica. Na música moderna e no Jazz, é a escala mais fértil de todas, gerando os modos Alterado, Lídio Dominante e Lídio Aumentado.',
    musicalUse: 'A bíblia da harmonia moderna no Jazz, Bossa Nova refinada e improvisação de alto nível.',
    famousExamples: 'Tom Jobim, John Coltrane, Wayne Shorter, Pat Metheny.',
    compatibleChords: ['Am(maj7)', 'Am6', 'Am9', 'B7alt', 'E7alt'],
  },

  // =========================================================================
  // 4. ESCALAS SIMÉTRICAS & EXÓTICAS
  // =========================================================================
  {
    id: 'whole-tone',
    name: 'Escala Tons Inteiros (Hexafônica)',
    shortName: 'Tons Inteiros (Debussy)',
    category: 'symmetric',
    categoryLabel: 'Simétricas & Especiais',
    formula: 'T - T - T - T - T - T',
    intervals: [0, 2, 4, 6, 8, 10],
    degrees: [
      { degree: '1', namePt: 'Tônica', isTonic: true },
      { degree: '2', namePt: 'Segunda Maior' },
      { degree: '3', namePt: 'Terça Maior' },
      { degree: '♯4', namePt: 'Quarta Aumentada' },
      { degree: '♯5', namePt: 'Quinta Aumentada' },
      { degree: '♭7', namePt: 'Sétima Menor' },
    ],
    description: 'Composta exclusivamente por passos de 1 tom inteiro (sem nenhum semitom). Não possui repouso nem centro tonal rígido, criando uma atmosfera mágica de sonho, água e flutuação.',
    musicalUse: 'Impressionismo musical francês, transições oníricas em filmes, e sobre acordes aumentados (7♯5).',
    famousExamples: 'Claude Debussy ("Voiles"), Thelonious Monk, Stevie Wonder ("You Are the Sunshine of My Life").',
    compatibleChords: ['C7(♯5)', 'Caug', 'C9(♯5)', 'C7(♭5)'],
  },
  {
    id: 'diminished-half-whole',
    name: 'Escala Dom-Dim (Semitom - Tom)',
    shortName: 'Dom-Dim (Jazz & Metal)',
    category: 'symmetric',
    categoryLabel: 'Simétricas & Especiais',
    formula: 'ST - T - ST - T - ST - T - ST - T',
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    degrees: [
      { degree: '1', namePt: 'Tônica', isTonic: true },
      { degree: '♭2', namePt: 'Nona Menor (♭9)' },
      { degree: '♯2', namePt: 'Nona Aumentada (♯9)' },
      { degree: '3', namePt: 'Terça Maior' },
      { degree: '♯4', namePt: 'Décima Primeira Aum. (♯11)' },
      { degree: '5', namePt: 'Quinta Justa' },
      { degree: '6', namePt: 'Décima Terceira (13)' },
      { degree: '♭7', namePt: 'Sétima Menor' },
    ],
    description: 'Escala octatônica (8 notas) que alterna rigorosamente semitons e tons. Contém todas as alterações sonoras (♭9, ♯9, ♯11, 13) sobre um acorde dominante.',
    musicalUse: 'A escala suprema de tensão e resolução sobre acordes dominantes no Jazz Moderno, Fusion e Metal Progressivo.',
    famousExamples: 'Allan Holdsworth, Chick Corea, Dream Theater, Michael Brecker.',
    compatibleChords: ['C7(♭9)', 'C7(♯9)', 'C13(♭9)', 'C7(♯11)'],
  },
];

export const ROOT_KEYS = [
  { key: 'C', label: 'C (Dó)', preferFlat: false },
  { key: 'Db', label: 'D♭ / C♯', preferFlat: true },
  { key: 'D', label: 'D (Ré)', preferFlat: false },
  { key: 'Eb', label: 'E♭ (Mi♭)', preferFlat: true },
  { key: 'E', label: 'E (Mi)', preferFlat: false },
  { key: 'F', label: 'F (Fá)', preferFlat: true },
  { key: 'F#', label: 'F♯ / G♭', preferFlat: false },
  { key: 'G', label: 'G (Sol)', preferFlat: false },
  { key: 'Ab', label: 'A♭ (Lá♭)', preferFlat: true },
  { key: 'A', label: 'A (Lá)', preferFlat: false },
  { key: 'Bb', label: 'B♭ (Si♭)', preferFlat: true },
  { key: 'B', label: 'B (Si)', preferFlat: false },
];

export interface ComputedScaleNote {
  note: string;
  notePt: string;
  midi: number;
  degree: string;
  functionName: string;
  isTonic: boolean;
  isBlueNote: boolean;
  isCharacteristic: boolean;
  intervalSemitones: number;
}

export function computeScaleNotes(
  rootKey: string,
  scaleDef: ScaleDefinition
): {
  rootNote: string;
  notes: ComputedScaleNote[];
  allMidi: number[];
} {
  const rootObj = ROOT_KEYS.find((r) => r.key === rootKey) || ROOT_KEYS[0];
  const preferFlat = rootObj.preferFlat;

  // Encontra o índice da tônica na escala cromática (0 = C)
  let rootIndex = CHROMATIC_NOTES_SHARP.indexOf(rootKey);
  if (rootIndex === -1) {
    rootIndex = CHROMATIC_NOTES_FLAT.indexOf(rootKey);
  }
  if (rootIndex === -1) rootIndex = 0;

  const baseMidi = 60 + rootIndex; // Região de Dó Central C3 (MIDI 60)

  const notes: ComputedScaleNote[] = scaleDef.intervals.map((semitones, idx) => {
    const noteMidi = baseMidi + semitones;
    const chromIdx = (rootIndex + semitones) % 12;

    // Seleção enarmônica refinada
    let noteName = preferFlat ? CHROMATIC_NOTES_FLAT[chromIdx] : CHROMATIC_NOTES_SHARP[chromIdx];

    // Casos especiais conhecidos para Blue Note em Blues
    if (scaleDef.id === 'blues' && semitones === 6) {
      // Blue note: se C blues -> F# ou Gb
      noteName = preferFlat ? 'G♭' : 'F♯';
    } else {
      noteName = noteName.replace('#', '♯').replace('b', '♭');
    }

    const degInfo = scaleDef.degrees[idx] || { degree: `${idx + 1}`, namePt: 'Nota' };
    const rawLetter = noteName[0];
    const ptBase = NOTE_NAMES_PT[rawLetter] || rawLetter;
    const accidentalSymbol = noteName.length > 1 ? noteName.slice(1) : '';
    const notePt = `${ptBase}${accidentalSymbol}`;

    return {
      note: noteName,
      notePt,
      midi: noteMidi,
      degree: degInfo.degree,
      functionName: degInfo.namePt,
      isTonic: !!degInfo.isTonic,
      isBlueNote: !!degInfo.isBlueNote,
      isCharacteristic: !!degInfo.isCharacteristic,
      intervalSemitones: semitones,
    };
  });

  return {
    rootNote: notes[0]?.note || rootKey,
    notes,
    allMidi: notes.map((n) => n.midi),
  };
}
