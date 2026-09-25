import type { ScoreNote } from './coursesData';
import { EXTENDED_REPERTOIRE_SONGS } from './repertoireDataExtended';

export type SongGenre =
  | 'Clássico & Mestres'
  | 'MPB & Pop Nacional'
  | 'Pop & Rock Clássico'
  | 'Rock Anos 80 & New Wave'
  | 'Reggae & Praieiro'
  | 'Forró, Xote & Baião'
  | 'Seresta & Brega (Zezo dos Teclados)'
  | 'Gospel Clássico & Sacro'
  | 'Infantis, Cirandas & Folclore';

export interface CategoryInfo {
  id: SongGenre | 'Todos';
  label: string;
  shortLabel: string;
  iconName: string;
  badge: string;
  description: string;
}

export const REPERTOIRE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Todos',
    label: 'Todas as Obras',
    shortLabel: 'Todas',
    iconName: 'LayoutGrid',
    badge: '28 Obras',
    description: 'Catálogo completo de partituras autênticas com rolagem interativa e arranjos fiéis.',
  },
  {
    id: 'Clássico & Mestres',
    label: 'Clássico & Grandes Mestres (Beethoven & Chopin)',
    shortLabel: 'Clássico',
    iconName: 'GraduationCap',
    badge: '5 Obras',
    description: 'Obras-primas imortais de Beethoven, Chopin, Bach e Pachelbel com notação fidedigna.',
  },
  {
    id: 'MPB & Pop Nacional',
    label: 'MPB & Roupa Nova (Baladas & Bossa Nova)',
    shortLabel: 'MPB & Roupa Nova',
    iconName: 'Heart',
    badge: '6 Obras',
    description: 'De Roupa Nova (Dona, Linda Demais) a Tom Jobim (Garota de Ipanema, Águas de Março) e Pixinguinha.',
  },
  {
    id: 'Forró, Xote & Baião',
    label: 'Forró, Xote & Baião (Luiz Gonzaga & Mestres)',
    shortLabel: 'Forró & Xote',
    iconName: 'Sun',
    badge: '2 Obras',
    description: 'O pulsar de Asa Branca e O Xote das Meninas com síncopes de sanfona e zabumba.',
  },
  {
    id: 'Seresta & Brega (Zezo dos Teclados)',
    label: 'Seresta & Brega (Zezo dos Teclados & Noites de Seresta)',
    shortLabel: 'Seresta & Brega',
    iconName: 'Radio',
    badge: '1 Obra',
    description: 'O teclado arranjador inconfundível de Zezo dos Teclados com introduções melódicas e seresta romântica.',
  },
  {
    id: 'Gospel Clássico & Sacro',
    label: 'Gospel Clássico & Hinos Sacros (Gaither & Harpa)',
    shortLabel: 'Gospel Clássico',
    iconName: 'Cross',
    badge: '1 Obra',
    description: 'Hinos imortais da fé cristã em arranjos solenes e polifônicos como Porque Ele Vive.',
  },
  {
    id: 'Reggae & Praieiro',
    label: 'Reggae & Praieiro (Bob Marley & Kingston)',
    shortLabel: 'Reggae',
    iconName: 'Waves',
    badge: '1 Obra',
    description: 'A cadência do contratempo do reggae jamaicano e acordes de piano skank de Three Little Birds.',
  },
  {
    id: 'Pop & Rock Clássico',
    label: 'Pop & Rock Clássico (Queen, Elton John & Beatles)',
    shortLabel: 'Pop/Rock',
    iconName: 'Disc',
    badge: '4 Obras',
    description: 'Os maiores hinos de piano pop e rock internacional de todos os tempos.',
  },
  {
    id: 'Rock Anos 80 & New Wave',
    label: 'Rock Anos 80 & New Wave (The Police, a-ha & Eurythmics)',
    shortLabel: 'Anos 80 / New Wave',
    iconName: 'Zap',
    badge: '5 Obras',
    description: 'Riffs lendários de sintetizadores dos anos 80, pulso staccato e New Wave.',
  },
  {
    id: 'Infantis, Cirandas & Folclore',
    label: 'Infantis, Cirandas & Folclore Brasileiro',
    shortLabel: 'Infantis & Cirandas',
    iconName: 'Sparkles',
    badge: '4 Obras',
    description: 'Cirandas, cantigas de roda e temas tradicionais da cultura brasileira.',
  },
];

export interface RepertoireSong {
  id: string;
  title: string;
  composerOrArtist: string;
  genre: SongGenre;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  recommendedBpm: number;
  timeSignature: string;
  tonality: string;
  description: string;
  historicalContext: string;
  biomechanicsTip: string;
  chords: string[];
  scoreTrack: ScoreNote[];
}

export const REPERTOIRE_SONGS: RepertoireSong[] = [
// =========================================================================
  // 1. CLÁSSICO & GRANDES MESTRES (Beethoven, Chopin, Bach, Pachelbel)
  // =========================================================================
  {
    id: 'ode-to-joy',
    title: 'Nona de Beethoven (Ode à Alegria - 9ª Sinfonia)',
    composerOrArtist: 'Ludwig van Beethoven',
    genre: 'Clássico & Mestres',
    difficulty: 'Iniciante',
    recommendedBpm: 84,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A obra completa da Nona Sinfonia na forma classica A - A1 - B - A2 (16 compassos completos) com a melodia cantabile e harmonia completa em ambas as maos.',
    historicalContext: 'Composta por Beethoven em 1824 com base no poema de Friedrich Schiller quando o compositor já estava completamente surdo.',
    biomechanicsTip: 'Mantenha os 5 dedos apoiados sobre C3 a G3 com formato curvo de maçã. Firmeza no toque sem rigidez de pulso.',
    chords: ['C', 'G', 'Dm', 'G7'],
    scoreTrack: [
      // --- PARTE A (Compassos 1 a 4) ---
      // Compasso 1 (E E F G)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 2 (G F E D)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 3 (C C D E)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 4 (E. D D-)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D3' },

      // --- PARTE A' (Compassos 5 a 8) ---
      // Compasso 5 (E E F G)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 6 (G F E D)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 7 (C C D E)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 8 (D. C C-)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 8, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'C3' },

      // --- PARTE B: PONTE CENTRAL (Compassos 9 a 12) ---
      // Compasso 9 (D D E C)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 10 (D E F E C)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 10, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 11 (D E F E D)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2.5, measure: 11, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 12 (C D G dominante preparando a reexposição)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 2, noteName: 'D3' },
      { midi: 55, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'G2' },

      // --- PARTE A'': REEXPOSIÇÃO E CADÊNCIA FINAL TRIUNFAL (Compassos 13 a 16) ---
      // Compasso 13 (E E F G)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 4, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 14 (G F E D)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 15 (C C D E)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 16 (D. C C - Resolução Majestosa)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 16, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 1, noteName: 'C3' },
    ],
  },
  {
    id: 'fur-elise',
    title: 'Für Elise (Para Elise - WoO 59)',
    composerOrArtist: 'Ludwig van Beethoven',
    genre: 'Clássico & Mestres',
    difficulty: 'Intermediário',
    recommendedBpm: 120,
    timeSignature: '3/8',
    tonality: 'Lá Menor (Am)',
    description: 'A obra completa do tema principal (Poco Moto) em 24 compassos com o tema em Lá Menor, a transição lírica em Dó Maior e a reexposição com arpejo final.',
    historicalContext: 'Composta por Beethoven em 27 de abril de 1810 em Viena. O manuscrito foi descoberto apenas em 1867 por Ludwig Nohl.',
    biomechanicsTip: 'Alterne os dedos 5 e 4 em arco flexível no semitom E4 - D#4 com o punho relaxado. Transfira o peso sem tensão nos tendões.',
    chords: ['Am', 'E7', 'C', 'G'],
    scoreTrack: [
      // --- SEÇÃO A: TEMA PRINCIPAL (Compassos 1 a 8) ---
      // Compasso 1 (E4 D#4 E4 D#4 E4 B3)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 2 (D4 C4 A3 com arpejo Am)
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'A3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 2, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A2' },

      // Compasso 3 (C3 E3 A3 B3 com arpejo E7)
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'E3' },
      { midi: 40, clef: 'bass', duration: 1, beat: 2, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 3, fingerRightHand: 5, noteName: 'B3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 3, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 56, clef: 'bass', duration: 1, beat: 3, measure: 3, fingerLeftHand: 1, noteName: 'G#2' },

      // Compasso 4 (E3 G#3 B3 C4)
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'G#3' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'B3' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 2.5, measure: 4, fingerRightHand: 5, noteName: 'C4' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 4, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 4, fingerLeftHand: 1, noteName: 'A2' },

      // Compasso 5 (Retomada: E4 D#4 E4 D#4 E4 B3)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'E4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 6 (D4 C4 A3)
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 6, fingerRightHand: 3, noteName: 'C4' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 6, fingerRightHand: 1, noteName: 'A3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 6, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 6, fingerLeftHand: 1, noteName: 'A2' },

      // Compasso 7 (C3 E3 D4 C4 com cadência de E7)
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 40, clef: 'bass', duration: 1, beat: 2, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 7, fingerRightHand: 3, noteName: 'B3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 7, fingerLeftHand: 3, noteName: 'E2' },

      // Compasso 8 (Resolução perfeita em Lá Menor)
      { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'A3' },

      // --- SEÇÃO B: TRANSIÇÃO LÍRICA EM DÓ MAIOR (Compassos 9 a 16) ---
      // Compasso 9 (B3 C4 D4 E4 - C Maior)
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'B3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 9, fingerRightHand: 2, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'D4' },
      { midi: 76, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 5, noteName: 'E4' },

      // Compasso 10 (G3 F4 E4 D4 - G Maior)
      { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'G3' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 1.5, measure: 10, fingerRightHand: 5, noteName: 'F4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 10, fingerRightHand: 4, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 2.5, measure: 10, fingerRightHand: 3, noteName: 'D4' },

      // Compasso 11 (F3 E4 D4 C4 - Am)
      { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'F3' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1.5, measure: 11, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 11, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 2.5, measure: 11, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 12 (E3 D4 C4 B3 - E7)
      { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'E3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1.5, measure: 12, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 12, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 12, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 13 (Transição Cromática de E4)
      { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 13, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 13, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 13, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'E4' },

      // Compasso 14 (Cascata Descendente)
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1.5, measure: 14, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 14, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 14, fingerRightHand: 2, noteName: 'A3' },

      // Compasso 15 (Preparação do Retorno)
      { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 15, fingerRightHand: 2, noteName: 'E3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 15, fingerRightHand: 4, noteName: 'B3' },

      // Compasso 16 (Pausa de Tensão no Ar)
      { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 1.5, beat: 2.5, measure: 16, fingerRightHand: 4, noteName: 'D#4' },

      // --- SEÇÃO A'': REEXPOSIÇÃO E CONCLUSÃO DEFINITIVA (Compassos 17 a 24) ---
      // Compasso 17 (E4 D#4 E4 D#4 E4 B3)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 17, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 17, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 17, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 17, fingerRightHand: 5, noteName: 'E4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 17, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 18 (D4 C4 A3 com arpejo Am)
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 18, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 18, fingerRightHand: 3, noteName: 'C4' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 18, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 18, fingerRightHand: 1, noteName: 'A3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 18, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 18, fingerLeftHand: 1, noteName: 'A2' },

      // Compasso 19 (C3 E3 A3 B3 com arpejo E7)
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 19, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 19, fingerRightHand: 2, noteName: 'E3' },
      { midi: 40, clef: 'bass', duration: 1, beat: 2, measure: 19, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 19, fingerRightHand: 4, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 19, fingerRightHand: 5, noteName: 'B3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 19, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 56, clef: 'bass', duration: 1, beat: 3, measure: 19, fingerLeftHand: 1, noteName: 'G#2' },

      // Compasso 20 (E3 G#3 B3 C4)
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 20, fingerRightHand: 1, noteName: 'E3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 20, fingerRightHand: 2, noteName: 'G#3' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 20, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 20, fingerRightHand: 4, noteName: 'B3' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 2.5, measure: 20, fingerRightHand: 5, noteName: 'C4' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 20, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 20, fingerLeftHand: 1, noteName: 'A2' },

      // Compasso 21 (E4 D#4 E4 D#4 E4 B3)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 21, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 21, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 21, fingerRightHand: 5, noteName: 'E4' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 21, fingerRightHand: 4, noteName: 'D#4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 21, fingerRightHand: 5, noteName: 'E4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 21, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 22 (D4 C4 A3)
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 22, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 22, fingerRightHand: 3, noteName: 'C4' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 22, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 22, fingerRightHand: 1, noteName: 'A3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 22, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 22, fingerLeftHand: 1, noteName: 'A2' },

      // Compasso 23 (C3 E3 D4 C4 com cadência de E7)
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 23, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 23, fingerRightHand: 2, noteName: 'E3' },
      { midi: 40, clef: 'bass', duration: 1, beat: 2, measure: 23, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 23, fingerRightHand: 4, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 23, fingerRightHand: 3, noteName: 'B3' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 23, fingerLeftHand: 3, noteName: 'E2' },

      // Compasso 24 (Grande Acorde Final de Lá Menor)
      { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 3, beat: 1, measure: 24, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 3, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 24, fingerRightHand: 5, noteName: 'A3' },
    ],
  },
  {
    id: 'canon-in-d',
    title: "Canon em Ré (Pachelbel's Canon)",
    composerOrArtist: 'Johann Pachelbel',
    genre: 'Clássico & Mestres',
    difficulty: 'Intermediário',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Dó Maior (Adaptação Didática)',
    description: 'A obra completa de Pachelbel em 16 compassos: o baixo contínuo obstinado em 8 tempos e as 4 variações polifônicas progressivas (mínimas, semínimas e colcheias).',
    historicalContext: 'Composta por volta de 1680 na Alemanha Barroca para três violinos e baixo contínuo.',
    biomechanicsTip: 'Toque o baixo com firmeza no tempo 1 e 3 de cada compasso, mantendo a melodia da mão direita expressiva.',
    chords: ['C', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G'],
    scoreTrack: [
      // --- VARIAÇÃO 1: TEMA EM MÍNIMAS (Compassos 1 a 4) ---
      // Compasso 1 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E4' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'D4' },

      // Compasso 2 (Am -> Em)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 3 (F -> C)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'A3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'G3' },

      // Compasso 4 (F -> G)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'B3' },

      // --- VARIAÇÃO 2: MELODIA EM SEMÍNIMAS DESCENDENTES (Compassos 5 a 8) ---
      // Compasso 5 (C5 B4 A4 G4)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'B3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'G3' },

      // Compasso 6 (F4 E4 F4 D4)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 7 (E4 G4 C4 B3)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'G3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'C3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 5, noteName: 'B3' },

      // Compasso 8 (A3 G3 F3 G3)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 2, noteName: 'G3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 8, fingerRightHand: 2, noteName: 'G3' },

      // --- VARIAÇÃO 3: FLUXO DE COLCHEIAS EM ARPEJOS (Compassos 9 a 12) ---
      // Compasso 9 (C4 E4 G4 E4 | D4 G4 B4 G4)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 9, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 9, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 2, noteName: 'E3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3, measure: 9, fingerRightHand: 1, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 4, measure: 9, fingerRightHand: 5, noteName: 'B3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 9, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 10 (C4 E4 A4 E4 | B3 E4 G4 E4)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 10, fingerRightHand: 5, noteName: 'A3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'B2' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 10, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4, measure: 10, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 4.5, measure: 10, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 11 (A3 C4 F4 C4 | G3 C4 E4 C4)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'A2' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 11, fingerRightHand: 2, noteName: 'C3' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2, measure: 11, fingerRightHand: 4, noteName: 'F3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 11, fingerRightHand: 2, noteName: 'C3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 55, clef: 'treble', duration: 0.5, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'G2' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 11, fingerRightHand: 2, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 4, measure: 11, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 4.5, measure: 11, fingerRightHand: 2, noteName: 'C3' },

      // Compasso 12 (A3 C4 F4 C4 | B3 D4 G4 D4)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'A2' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 12, fingerRightHand: 2, noteName: 'C3' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2, measure: 12, fingerRightHand: 4, noteName: 'F3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 12, fingerRightHand: 2, noteName: 'C3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 12, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4, measure: 12, fingerRightHand: 4, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 4.5, measure: 12, fingerRightHand: 2, noteName: 'D3' },

      // --- VARIAÇÃO 4: GRANDE CADÊNCIA POLIFÔNICA FINAL (Compassos 13 a 16) ---
      // Compasso 13 (C5 -> B4)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'C4' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 13, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 4, noteName: 'B3' },

      // Compasso 14 (A4 -> G4)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 14, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 3, noteName: 'A3' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 14, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 15 (F4 -> E4)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 15, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'F3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 15, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 16 (Acorde Final Sustentado de Dó Maior)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'E3' },
      { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'C4' },
    ],
  },
  {
    id: 'linda-demais',
    title: 'Linda Demais',
    composerOrArtist: 'Roupa Nova (Kiko & Tavinho Paes)',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Intermediário',
    recommendedBpm: 76,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A canção completa do Roupa Nova: Introdução clássica do teclado, Versos 1 e 2, Pré-Refrão e o emocionante Refrão completo ("Linda demais! Perfeita aos olhos do Pai...").',
    historicalContext: 'Lançada em 1985 no aclamado álbum do Roupa Nova, tornou-se um dos hinos absolutos do pop romântico nacional.',
    biomechanicsTip: 'Toque as frases melódicas com o punho flexível e legato expressivo, respirando entre cada verso cantado.',
    chords: ['C', 'G/B', 'Am', 'F', 'Dm', 'G7'],
    scoreTrack: [
      // --- VERSO 1 (Compassos 1 a 4) ---
      // Compasso 1 ("Lin-da, só...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 2 ("...você me fascina")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B1', chordName: 'G/B' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 3 ("Te de-se-jo...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 4 ("...muito além do prazer")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 1, noteName: 'C3' },

      // --- VERSO 2 (Compassos 5 a 8) ---
      // Compasso 5 ("Vista meu futuro...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 6 ("...em teu corpo")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'B1', chordName: 'G/B' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 7 ("E me ama como eu amo...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 7, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 8 ("...você.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C3' },

      // --- PRÉ-REFRÃO (Compassos 9 a 12) ---
      // Compasso 9 ("Vem que a noite é nossa...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'D2', chordName: 'Dm' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 10 ("...nada vai nos separar")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 11 ("Tudo o que eu guardei...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 12 ("...foi pra te entregar")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 4, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 5, noteName: 'B3' },

      // --- O REFRÃO CLÁSSICO (Compassos 13 a 16) ---
      // Compasso 13 ("Lin-da de-mais!...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 13, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 14 ("...per-fei-ta aos olhos do Pai!")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 14, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1.5, measure: 14, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 3, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 15 ("Quem foi que te fez assim tão linda?")
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 15, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 15, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 4, noteName: 'G3' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 15, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 16 ("...tão linda!")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'C3' },
    ],
  },
  {
    id: 'garota-de-ipanema',
    title: 'Garota de Ipanema (The Girl from Ipanema)',
    composerOrArtist: 'Antônio Carlos Jobim & Vinicius de Moraes',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Intermediário',
    recommendedBpm: 120,
    timeSignature: '4/4',
    tonality: 'Fá Maior (F)',
    description: 'A obra completa de Tom Jobim e Vinicius de Moraes (24 compassos): Parte A, a famosa Ponte modulante ("Ah, por que estou tão sozinho?...") e o Retorno com o clássico balanço da Bossa Nova.',
    historicalContext: 'Composta em 1962 em Ipanema inspirada por Helô Pinheiro, vencedora do Grammy de Gravação do Ano em 1965.',
    biomechanicsTip: 'Toque com leveza flutuante, sem atacar com peso excessivo na tecla para preservar o balanço da Bossa.',
    chords: ['Fmaj7', 'G7', 'Gm7', 'C7', 'Gb7', 'F#m7', 'B7'],
    scoreTrack: [
      // --- PARTE A: O TEMA PRINCIPAL (Compassos 1 a 8) ---
      // Compasso 1 ("Olha que coisa mais linda...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F1', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 2 ("...mais cheia de graça...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'C2', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 3 ("...é ela menina que vem...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'G1', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 4 ("...e que passa...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'D2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 4, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 5 ("...num doce balanço...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 4, noteName: 'G1', chordName: 'Gm7' },
      { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 5, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 6 ("...a caminho do mar...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'Bb3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 7 ("...doce balanço final")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'Fmaj7' },
      { midi: 65, clef: 'treble', duration: 3, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 8 (Transição para a Ponte)
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 3, noteName: 'Bb1', chordName: 'Gb7' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'F3' },

      // --- PARTE B: A PONTE LÍRICA (Compassos 9 a 16) ---
      // Compasso 9 ("Ah, por que estou tão sozinho?...")
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'F#1', chordName: 'F#m7' },
      { midi: 66, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 4, noteName: 'A3' },
      { midi: 73, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 5, noteName: 'C#4' },

      // Compasso 10 ("...ah, por que tudo é tão triste?")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'B1', chordName: 'B7' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'B3' },
      { midi: 68, clef: 'treble', duration: 1.5, beat: 2.5, measure: 10, fingerRightHand: 3, noteName: 'G#3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 2, noteName: 'F#3' },

      // Compasso 11 ("Ah, a beleza que existe...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'G1', chordName: 'Gm7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 2.5, measure: 11, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 5, noteName: 'D4' },

      // Compasso 12 ("...a beleza que não é só minha")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 12, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 12, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 12, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 13 ("...que também passa...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am7' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 14 ("...sozinha.")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 15 ("Preparação...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 4, noteName: 'G1', chordName: 'Gm7' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 16 ("...do retorno")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 70, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'Bb3' },

      // --- RETORNO A: RESOLUÇÃO FINAL (Compassos 17 a 24) ---
      // Compasso 17 ("Ah, se ela soubesse...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'F1', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 17, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 3.5, measure: 17, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 18 ("...que quando ela passa...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 1, noteName: 'C2', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 18, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 18, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 3.5, measure: 18, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 19 ("...o mundo inteirinho...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 4, noteName: 'G1', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 19, fingerRightHand: 5, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 19, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1.5, beat: 3.5, measure: 19, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 20 ("...se enche de graça...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 1, noteName: 'D2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 20, fingerRightHand: 5, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 20, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1.5, beat: 3.5, measure: 20, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 21 ("...e fica mais lindo...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 21, fingerLeftHand: 4, noteName: 'G1', chordName: 'Gm7' },
      { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 21, fingerRightHand: 4, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 21, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1.5, beat: 3.5, measure: 21, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 22 ("...por causa do amor...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 22, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 22, fingerRightHand: 5, noteName: 'Bb3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 22, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 22, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 23 ("...por causa do amor...")
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 23, fingerLeftHand: 3, noteName: 'Gb1', chordName: 'Gb7' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 23, fingerRightHand: 3, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 23, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 24 (Acorde Final Fmaj7)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'F1', chordName: 'Fmaj7' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'F3' },
    ],
  },
  {
    id: 'asa-branca',
    title: 'Asa Branca',
    composerOrArtist: 'Luiz Gonzaga & Humberto Teixeira',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Iniciante',
    recommendedBpm: 92,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A canção folclórica definitiva do sertão nordestino completa em 24 compassos: Estrofe 1 ("Quando olhei a terra ardendo..."), Estrofe 2 ("Que braseiro, que fornaia...") e o Refrão completo ("Até mesmo a asa branca bateu asas do sertão...").',
    historicalContext: 'Gravada em 1947 pelo Rei do Baião Luiz Gonzaga, retratando a seca nordestina e a esperança do povo sertanejo.',
    biomechanicsTip: 'Melodia com articulação nítida dos dedos 1, 2, 3 e 5 da mão direita com apoio firme do baixo.',
    chords: ['C', 'F', 'G7'],
    scoreTrack: [
      // --- ESTROFE 1 (Compassos 1 a 8) ---
      // Compasso 1 ("Quando olhei a terra ardendo...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 2 ("...qual a fogueira...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F3' },

      // Compasso 3 ("...de São João...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 4 ("...eu perguntei...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 5 ("...a Deus do céu, ai...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 6 ("...por que tamanha...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 7 ("...judiação...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'D3' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'B2' },

      // Compasso 8 (Dó final da estrofe 1)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C3' },

      // --- ESTROFE 2: QUE BRASEIRO... (Compassos 9 a 16) ---
      // Compasso 9 ("Que braseiro, que fornaia...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 9, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 10 ("...nenhum pé de prantação...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 4, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'F3' },

      // Compasso 11 ("Por falta d'água perdi meu gado...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 11, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 12 ("...morreu de sede meu alazão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 13 ("Por falta d'água...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 13, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 13, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 14 ("...perdi meu gado...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 15 ("...morreu de sede...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'D3' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 1, noteName: 'B2' },

      // Compasso 16 ("...meu alazão.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'C3' },

      // --- O REFRÃO CONSAGRADO (Compassos 17 a 24) ---
      // Compasso 17 ("Inté mesmo a asa branca...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 17, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 17, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 17, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 17, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 17, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 18 ("...bateu asas do sertão...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 18, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 18, fingerRightHand: 4, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 18, fingerRightHand: 4, noteName: 'F3' },

      // Compasso 19 ("Entonce eu disse adeus Rosinha...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 19, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 19, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 19, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 19, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 19, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 20 ("...guarda contigo meu coração...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 20, fingerRightHand: 3, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 20, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 21 ("Hoje longe muitas léguas...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 21, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 21, fingerRightHand: 1, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 21, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 21, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 21, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 21, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 22 ("...numa triste solidão...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 22, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 22, fingerRightHand: 5, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 22, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 22, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 22, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 23 ("...espero a chuva cair de novo...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 23, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 23, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 23, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 23, fingerRightHand: 2, noteName: 'D3' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 23, fingerRightHand: 1, noteName: 'B2' },

      // Compasso 24 ("...pra mim voltar pro meu sertão!")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 24, fingerRightHand: 1, noteName: 'C3' },
    ],
  },
  {
    id: 'imagine',
    title: 'Imagine',
    composerOrArtist: 'John Lennon',
    genre: 'Pop & Rock Clássico',
    difficulty: 'Iniciante',
    recommendedBpm: 76,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: "A canção completa em 16 compassos: A emblemática introdução de piano com alternância C - Cmaj7 - F, os Versos 1 e 2 completos e o célebre Refrão da paz mundial (You may say I'm a dreamer...).",
    historicalContext: 'Composta por John Lennon em 1971 gravada no piano de cauda Steinway branco em Tittenhurst Park.',
    biomechanicsTip: 'Mantenha o polegar no Dó e faça o movimento pendular suave nos dedos 3 e 5 da mão direita.',
    chords: ['C', 'Cmaj7', 'F', 'G', 'E7', 'Am'],
    scoreTrack: [
      // --- INTRO & VERSO 1 (Compassos 1 a 4) ---
      // Compasso 1 (C -> Cmaj7)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'E3', chordName: 'Cmaj7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 2 (F com arpejo característico)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'B3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'C4' },

      // Compasso 3 ("Imagine there's no heaven...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 4 ("...it's easy if you try")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'D3' },

      // --- VERSO 2 (Compassos 5 a 8) ---
      // Compasso 5 ("No hell below us...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 6 ("...above us only sky")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 7 ("Imagine all the people...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 5, noteName: 'A3' },
      { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 8 ("...living for today...")
      { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 2, noteName: 'E3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'D3' },

      // --- O REFRÃO DA PAZ (Compassos 9 a 16) ---
      // Compasso 9 ("You may say I'm a dreamer...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 9, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'E3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 10 ("...but I'm not the only one")
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 1, noteName: 'C3' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 68, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'G#3' },

      // Compasso 11 ("I hope someday you'll join us...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'C3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 11, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'E3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 12 ("...and the world will be as one")
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 1, noteName: 'C3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 13 (C -> Cmaj7 repetição lírica)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 4, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'B3', chordName: 'Cmaj7' },

      // Compasso 14 (F)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 15 (G)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 5, noteName: 'B3' },

      // Compasso 16 (Acorde Final em Dó Maior Sustentado)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'G3' },
    ],
  },
  {
    id: 'let-it-be',
    title: 'Let It Be',
    composerOrArtist: 'The Beatles / Paul McCartney',
    genre: 'Pop & Rock Clássico',
    difficulty: 'Iniciante',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A obra completa dos Beatles em 16 compassos: Introdução dos acordes, Verso 1 ("When I find myself in times of trouble..."), Verso 2 e o Refrão completo ("Let it be, let it be... whisper words of wisdom, let it be!").',
    historicalContext: 'Composta por Paul McCartney em 1968 em meio às tensões finais dos Beatles, inspirada em sua mãe Mary.',
    biomechanicsTip: 'Utilize o dedo âncora ao mudar de C para F para não deslocar desnecessariamente o braço pelo ar.',
    chords: ['C', 'G', 'Am', 'F'],
    scoreTrack: [
      // --- VERSO 1 (Compassos 1 a 4) ---
      // Compasso 1 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 2 (Am -> F)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A3' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 3 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 4 (F -> C resolução)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'A3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'G3' },

      // --- VERSO 2: AND IN MY HOUR OF DARKNESS (Compassos 5 a 8) ---
      // Compasso 5 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'G3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 6 (Am -> F)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 7 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 1, noteName: 'D3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 8 (F -> C)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 1, noteName: 'C3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'C3' },

      // --- O REFRÃO CLÁSSICO: LET IT BE (Compassos 9 a 16) ---
      // Compasso 9 ("Let it be, let it be...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 10 ("...let it be, let it be")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 11 ("Whisper words of wisdom...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 2, noteName: 'E3' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 12 ("...let it be.")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 13 ("Let it be, let it be...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 13, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 13, fingerRightHand: 3, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 13, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 14 ("...there will be an answer...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 14, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 3.5, measure: 14, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 15 ("...whisper words of wisdom...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 15, fingerLeftHand: 3, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 2, noteName: 'E3' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 15, fingerLeftHand: 1, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'D3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 16 ("...let it be!")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'C3' },
    ],
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Bohemian Rhapsody (Balada Completa)',
    composerOrArtist: 'Queen / Freddie Mercury',
    genre: 'Rock Anos 80 & New Wave',
    difficulty: 'Avançado',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Si Bemol Maior (B♭)',
    description: 'A lendária balada de piano de Freddie Mercury completa em 16 compassos: A icônica introdução com o baixo sincopado, o drama do verso ("Mama, just killed a man..."), o clímax expressivo e a cadência triunfal.',
    historicalContext: 'Lançada em 1975 no álbum A Night at the Opera, é considerada uma das maiores composições da história da música contemporânea.',
    biomechanicsTip: 'Toque o arpejo da mão esquerda como ondas líricas contínuas, mantendo a melodia da mão direita limpa e soberana.',
    chords: ['Bb', 'Gm', 'Cm', 'F', 'Eb'],
    scoreTrack: [
      // Compasso 1 ("Mama, just killed a man...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'A3' },

      // Compasso 2 ("...put a gun against his head...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'A3' },

      // Compasso 3 ("...pulled my trigger, now he's dead...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'C2', chordName: 'Cm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'G3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'C4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'C4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'Bb3' },

      // Compasso 4 ("...now he's dead.")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'F3' },

      // Compasso 5 ("Mama, life had just begun...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'C4' },

      // Compasso 6 ("...but now I've gone and thrown it all away...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'D4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 4, noteName: 'C4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 3, noteName: 'Bb3' },

      // Compasso 7 ("...thrown it all away...")
      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 3, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 2.5, measure: 7, fingerRightHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'F3' },

      // Compasso 8 (Pausa com acorde de Fá)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'A3' },

      // Compasso 9 ("Mama, ooh-ooh-ooh...")
      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 75, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'Eb4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 10 ("...didn't mean to make you cry...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'D4' },

      // Compasso 11 ("If I'm not back again this time tomorrow...")
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'C2', chordName: 'Cm' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'C4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'C4' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 1, noteName: 'A3' },

      // Compasso 12 ("...carry on, carry on...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'G3' },

      // Compasso 13 ("...as if nothing really matters...")
      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 2, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 2, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 1, noteName: 'F3' },
      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 1, noteName: 'Eb3' },

      // Compasso 14 ("...really matters...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'F3' },
      { midi: 63, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 1, noteName: 'Eb3' },

      // Compasso 15 (Cadência do Piano de Freddie)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'F1', chordName: 'F7' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'D3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'F3' },

      // Compasso 16 (Acorde Final Majestoso em Bb)
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 58, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'Bb2' },
      { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'D3' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'F3' },
      { midi: 70, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'Bb3' },
    ],
  },
  {
    id: 'take-on-me',
    title: 'Take On Me (Versão Completa)',
    composerOrArtist: 'A-ha (Magne Furuholmen & Morten Harket)',
    genre: 'Rock Anos 80 & New Wave',
    difficulty: 'Intermediário',
    recommendedBpm: 84,
    timeSignature: '4/4',
    tonality: 'Lá Maior (A)',
    description: 'A música completa do A-ha em 16 compassos: O lendário riff sincopado de sintetizador, o Verso melódico e o Refrão arrebatador ("Take on me! Take me on!").',
    historicalContext: 'Composta em 1984 pelo tecladista Magne Furuholmen, impulsionada pelo icônico videoclipe em rotoscopia de Michael Patterson.',
    biomechanicsTip: 'Mantenha o punho solto e firme para a articulação ágil dos saltos de oitava do sintetizador nos dedos 1 e 5.',
    chords: ['F#m', 'B', 'E', 'C#m', 'A'],
    scoreTrack: [
      // --- O RIFF LENDÁRIO (Compassos 1 a 4) ---
      // Compasso 1 (F#m)
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'A3' },
      { midi: 73, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 2 (B)
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'B1', chordName: 'B' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'B3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 4, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'A3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'F#3' },

      // Compasso 3 (E)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 1, noteName: 'E3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 3, fingerRightHand: 4, noteName: 'B3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'A3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, fingerRightHand: 2, noteName: 'G#3' },

      // Compasso 4 (C#m)
      { midi: 49, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 2, noteName: 'C#2', chordName: 'C#m' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'A3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'G#3' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 4, fingerRightHand: 1, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'F#3' },

      // --- REPETIÇÃO DO RIFF COM BRILHO (Compassos 5 a 8) ---
      // Compasso 5 (F#m)
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'A3' },
      { midi: 73, clef: 'treble', duration: 1.5, beat: 2.5, measure: 5, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 6 (B)
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'B1', chordName: 'B' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'B3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1.5, measure: 6, fingerRightHand: 4, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 6, fingerRightHand: 5, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'B3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'F#3' },

      // Compasso 7 (E)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'E3' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 7, fingerRightHand: 2, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3.5, measure: 7, fingerRightHand: 3, noteName: 'A3' },
      { midi: 68, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 2, noteName: 'G#3' },

      // Compasso 8 (C#m cadência para o verso)
      { midi: 49, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 2, noteName: 'C#2', chordName: 'C#m' },
      { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'E3' },

      // --- VERSO (Compassos 9 a 12) ---
      // Compasso 9 ("Talking away...")
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 10 ("...I don't know what I'm to say")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'B1', chordName: 'B' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 3, noteName: 'G#3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 11 ("I'll say it anyway...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
      { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'G#3' },
      { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'G#3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 12 ("...today's another day to find you")
      { midi: 49, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 2, noteName: 'C#2', chordName: 'C#m' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 3, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 5, noteName: 'B3' },

      // --- O REFRÃO EXPLOSIVO (Compassos 13 a 16) ---
      // Compasso 13 ("Take on me!...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 4, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'E4' },

      // Compasso 14 ("...(Take on me)...")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'B1', chordName: 'B' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'B3' },

      // Compasso 15 ("Take me on!...")
      { midi: 49, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 2, noteName: 'C#2', chordName: 'C#m' },
      { midi: 73, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 5, noteName: 'E4' },

      // Compasso 16 ("I'll be gone in a day or two!")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 73, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 3, noteName: 'C#4' },
    ],
  },
  {
    id: 'ciranda-cirandinha',
    title: 'Ciranda, Cirandinha',
    composerOrArtist: 'Folclore Brasileiro',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 104,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A clássica cantiga de roda brasileira completa em 16 compassos: Estrofe 1 ("Ciranda, cirandinha, vamos todos cirandar..."), Estrofe 2 ("O anel que tu me destes...") e desfecho lírico tradicional.',
    historicalContext: 'Cantiga secular de roda transmitida por gerações em todo o Brasil, patrimônio da cultura popular da infância.',
    biomechanicsTip: 'Melodia leve nos dedos 1 a 5 da mão direita, tocando com fluidez e pulso rítmico alegre.',
    chords: ['C', 'G7', 'F'],
    scoreTrack: [
      // Compasso 1 ("Ci-ran-da, ci-ran-di-nha...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 2 ("...vamos todos cirandar...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 3 ("Vamos dar a meia-volta...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 4 ("...volta e meia vamos dar.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'E3' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 5 ("O anel que tu me destes...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 6 ("...era vidro e se quebrou...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 7 ("O amor que tu me tinhas...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 8 ("...era pouco e se acabou.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 9 ("Por isso dona Chica...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 10 ("...faça o favor de entrar na roda...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 11 ("Diga um verso bem bonito...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 12 ("...diga adeus e vá se embora.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'C3' },

      // Compasso 13 (Repetição triunfal do refrão festivo)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 5, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'E3' },

      // Compasso 14 (Meia-volta final)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 3, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 15 (Volta e meia)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'E3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 4, noteName: 'F3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 16 (Acorde Final Sustentado de C)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'G3' },
    ],
  },
  {
    id: 'peixe-vivo',
    title: 'Peixe Vivo',
    composerOrArtist: 'Folclore Brasileiro (Tradição de Minas Gerais)',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 108,
    timeSignature: '4/4',
    tonality: 'Sol Maior (G)',
    description: 'A canção tradicional mineira imortalizada por Juscelino Kubitschek completa em 16 compassos: Estrofe 1 ("Como pode um peixe vivo viver fora da água fria?"), Estrofe 2 ("Como poderei viver sem a tua companhia?...") e desfecho lírico.',
    historicalContext: 'Música folclórica tradicional que se tornou tema afetivo histórico do presidente Juscelino Kubitschek e de serestas brasileiras.',
    biomechanicsTip: 'Toque com pulso alegre de seresta, mantendo o fraseado legato e articulado.',
    chords: ['G', 'D7', 'C'],
    scoreTrack: [
      // Compasso 1 ("Como pode o peixe vivo...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 2 ("...viver fora da água fria?")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 3 ("Como pode o peixe vivo...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 4 ("...viver fora da água fria?")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 5 ("Como poderei viver...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'C4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 5, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 6 ("...como poderei viver...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'B3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 7 ("Sem a tua, sem a tua...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'A3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 8 ("...sem a tua companhia?")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 9 ("Os pastores desta vila...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 10 ("...já me fazem zombaria...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 11 ("Os pastores desta vila...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 12 ("...já me fazem zombaria...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 13 ("Por me verem assim chorando...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'C4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 13, fingerRightHand: 5, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 14 ("...sem a tua companhia.")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'B3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 14, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 15 ("Sem a tua, sem a tua...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'A3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 16 (Acorde Final em Sol Maior Sustentado)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'G3' },
    ],
  },
  {
    id: 'cai-cai-balao',
    title: 'Cai, Cai, Balão',
    composerOrArtist: 'Folclore Junino Brasileiro',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 104,
    timeSignature: '4/4',
    tonality: 'Fá Maior (F)',
    description: 'A clássica cantiga junina completa em 16 compassos: Estrofe 1 ("Cai, cai, balão, cai, cai, balão, aqui na minha mão..."), Estrofe 2 ("Não vou lá, não vou lá, não vou lá, tenho medo de apanhar!...") e reexposição festiva.',
    historicalContext: 'Música folclórica tradicional das Festas Juninas em todo o Brasil.',
    biomechanicsTip: 'Toque com pulso saltitante e alegre, mantendo as semínimas e mínimas no tempo exato do baião junino.',
    chords: ['F', 'C7', 'Bb'],
    scoreTrack: [
      // Compasso 1 ("Cai, cai, ba-lão...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 2 ("...cai, cai, ba-lão...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 3 ("...aqui na minha mão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 4 ("...não cai, não...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'F3' },

      // Compasso 5 ("Não cai não, não cai não...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 6 ("...não cai na rua do sabão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 7 ("Cai aqui, cai aqui...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 8 ("...na minha mão.")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'F3' },

      // Compasso 9 ("Não vou lá, não vou lá...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 4, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'F3' },

      // Compasso 10 ("...não vou lá, tenho medo de apanhar!")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 11 ("Cai, cai, balão...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'F3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 12 ("...cai na minha mão!")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 4, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 3, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 13 ("Não cai no mato...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'Bb3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 5, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 14 ("...nem no ribeirão...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 3, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 2, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 15 ("Cai aqui na minha mão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 16 (Acorde Final em Fá Maior)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 57, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A2' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'C3' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'F3' },
    ],
  },

{
  "id": "chopin-nocturne",
  "title": "Noturno Op. 9 No. 2 em Mi Bemol Maior",
  "composerOrArtist": "Frédéric Chopin",
  "genre": "Clássico & Mestres",
  "difficulty": "Avançado",
  "recommendedBpm": 66,
  "timeSignature": "4/4",
  "tonality": "Mi Bemol Maior (Eb)",
  "description": "A mais célebre das obras líricas de Chopin, transcrita na forma completa (16 compassos) com a melodia bel canto, baixos de valsa lenta e ornamentações expressivas.",
  "historicalContext": "Composto entre 1830 e 1832 na juventude de Chopin em Paris, dedicado a Marie Pleyel.",
  "biomechanicsTip": "Toque o baixo com firmeza no tempo 1 e alivie o peso nos acordes dos tempos seguintes. Mão direita com rubato natural.",
  "chords": [
    "Eb",
    "Cm",
    "Fm",
    "Bb7",
    "Ab",
    "Gm"
  ],
  "scoreTrack": [
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 55,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 2,
      "noteName": "Bb2"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1.5,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 0.5,
      "beat": 4.5,
      "measure": 1,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 2,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 3,
      "noteName": "Eb3"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "Bb2"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 2,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 2,
      "beat": 3,
      "measure": 3,
      "fingerLeftHand": 4,
      "noteName": "F2",
      "chordName": "Fm"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1.5,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 4.5,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb7"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "Eb3"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "Bb2"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1.5,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 5,
      "noteName": "Bb3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 6,
      "fingerRightHand": 4,
      "noteName": "Ab3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 2,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 4,
      "noteName": "F2",
      "chordName": "Fm"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 2,
      "beat": 3,
      "measure": 7,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb7"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "Ab3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 5,
      "noteName": "Bb3"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 3,
      "noteName": "Eb3"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1.5,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "Ab3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "Ab3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "Gm"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 2,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 4,
      "noteName": "F2",
      "chordName": "Fm7"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 4,
      "noteName": "Ab3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 2,
      "beat": 3,
      "measure": 11,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb7"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "Bb2"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1.5,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "Bb3"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 2,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 2,
      "beat": 3,
      "measure": 14,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb7"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 55,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "Bb2"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 3,
      "noteName": "Eb3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 5,
      "noteName": "G3"
    }
  ]
},

{
  "id": "minuet-in-g",
  "title": "Minueto em Sol Maior (BWV Anh. 114)",
  "composerOrArtist": "Christian Petzold / J.S. Bach",
  "genre": "Clássico & Mestres",
  "difficulty": "Intermediário",
  "recommendedBpm": 92,
  "timeSignature": "3/4",
  "tonality": "Sol Maior (G)",
  "description": "A partitura completa do famoso Minueto do Livro de Anna Magdalena Bach (16 compassos completos), com contraponto límpido e independência de mãos.",
  "historicalContext": "Composto originalmente em 1725 por Christian Petzold e preservado no caderno de estudos musicais de Anna Magdalena Bach.",
  "biomechanicsTip": "Toque leve com dedos articulados em martelinho. O tempo 1 do compasso ternário recebe apoio elegante sem bater.",
  "chords": [
    "G",
    "D",
    "Em",
    "C",
    "Am",
    "D7"
  ],
  "scoreTrack": [
    {
      "midi": 43,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 1,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 1,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "G"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 2,
      "noteName": "C3",
      "chordName": "C"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 3,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "E4"
    },
    {
      "midi": 78,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 3,
      "fingerRightHand": 5,
      "noteName": "F#4"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "G"
    },
    {
      "midi": 79,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 5,
      "noteName": "G4"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 2,
      "noteName": "C3",
      "chordName": "C"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 2,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "A3"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "G"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 6,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "D7"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 5,
      "noteName": "B3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 4,
      "noteName": "A3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 8,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 9,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "G"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 2,
      "noteName": "C3",
      "chordName": "C"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 4,
      "noteName": "E4"
    },
    {
      "midi": 78,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "F#4"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "G"
    },
    {
      "midi": 79,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 5,
      "noteName": "G4"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 2,
      "noteName": "C3",
      "chordName": "C"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 13,
      "fingerRightHand": 1,
      "noteName": "A3"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "G"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 14,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D7"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 4,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 0.5,
      "beat": 3.5,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 3,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 55,
      "clef": "treble",
      "duration": 3,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 59,
      "clef": "treble",
      "duration": 3,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "B2"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 3,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 5,
      "noteName": "G3"
    }
  ]
},

{
  "id": "aguas-de-marco",
  "title": "Águas de Março",
  "composerOrArtist": "Antônio Carlos Jobim",
  "genre": "MPB & Pop Nacional",
  "difficulty": "Intermediário",
  "recommendedBpm": 126,
  "timeSignature": "4/4",
  "tonality": "Si Bemol Maior (Bb)",
  "description": "A obra-prima sincopada da Bossa Nova com a poética completa de 16 compassos, desde a abertura icônica até o clímax \"são as águas de março fechando o verão\".",
  "historicalContext": "Composta em 1972 por Tom Jobim no seu sítio em Poço Fundo (RJ), eleita uma das maiores canções brasileiras de todos os tempos.",
  "biomechanicsTip": "Mantenha o swing sincopado suave. O polegar e indicador da mão direita articulam as colcheias balançadas sem tensão no punho.",
  "chords": [
    "Bb",
    "Bbm6",
    "Cm7",
    "F7",
    "Dm7",
    "G7"
  ],
  "scoreTrack": [
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bbm6"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 3,
      "noteName": "C3",
      "chordName": "Cm7"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F7"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 4,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "Bb2"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bbm6"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "C3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "D3"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 1,
      "noteName": "Bb2"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 3,
      "noteName": "C3",
      "chordName": "Cm7"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F7"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 8,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 8,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bbm6"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 3,
      "noteName": "C3",
      "chordName": "Cm7"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F7"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 12,
      "fingerRightHand": 4,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "Bb3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bbm6"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 3,
      "noteName": "C3",
      "chordName": "Cm7"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 4,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "Bb2"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 4,
      "noteName": "F3"
    }
  ]
},

{
  "id": "carinhoso",
  "title": "Carinhoso",
  "composerOrArtist": "Pixinguinha & João de Barro",
  "genre": "MPB & Pop Nacional",
  "difficulty": "Intermediário",
  "recommendedBpm": 76,
  "timeSignature": "4/4",
  "tonality": "Sol Maior (G)",
  "description": "O choro-canção mais venerado da história da música brasileira, em arranjo integral (16 compassos) cobrindo a Parte A e Parte B com modulações líricas.",
  "historicalContext": "Composto entre 1916 e 1917 por Pixinguinha e letrado posteriormente em 1937 por Braguinha (João de Barro).",
  "biomechanicsTip": "Dê especial atenção à mão esquerda no ritmo de choro sincopado. Mão direita com legato expressivo e fraseado cantante.",
  "chords": [
    "G",
    "D7",
    "Em",
    "B7",
    "E7",
    "Am",
    "C"
  ],
  "scoreTrack": [
    {
      "midi": 43,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 4,
      "noteName": "B3"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 47,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 3,
      "noteName": "B2",
      "chordName": "B7"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "Em"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D7"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "A3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 2,
      "noteName": "B3"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 79,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G4"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E7"
    },
    {
      "midi": 78,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 5,
      "noteName": "F#4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 4,
      "noteName": "E4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "Am"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E7"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 2,
      "noteName": "G#3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "Am"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 1,
      "noteName": "A3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D7"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 12,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "G3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 3,
      "noteName": "C3",
      "chordName": "C"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "E3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "Em"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D7"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 4,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "G2",
      "chordName": "G"
    },
    {
      "midi": 55,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 59,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "B2"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 3,
      "noteName": "D3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 5,
      "noteName": "G3"
    }
  ]
},

{
  "id": "dancing-queen",
  "title": "Dancing Queen",
  "composerOrArtist": "ABBA (Benny Andersson & Björn Ulvaeus)",
  "genre": "Pop & Rock Clássico",
  "difficulty": "Intermediário",
  "recommendedBpm": 100,
  "timeSignature": "4/4",
  "tonality": "Lá Maior (A)",
  "description": "O maior clássico pop de piano da história com arranjo completo (16 compassos), incluindo o lendário glissando e acordes ritmados de piano disco.",
  "historicalContext": "Lançado em 1976 no álbum Arrival, Dancing Queen alcançou o topo das paradas em mais de 15 países simultaneamente.",
  "biomechanicsTip": "Toque os acordes sincopados com punho solto em movimento de mola (wrist bounce). Melodia brilhante e bem projetada.",
  "chords": [
    "A",
    "D",
    "F#m",
    "E",
    "C#m"
  ],
  "scoreTrack": [
    {
      "midi": 45,
      "clef": "bass",
      "duration": 2,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 2,
      "beat": 3,
      "measure": 1,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 42,
      "clef": "bass",
      "duration": 2,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 5,
      "noteName": "F#2",
      "chordName": "F#m"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 2,
      "beat": 3,
      "measure": 2,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1.5,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1.5,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 11,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 42,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 5,
      "noteName": "F#2",
      "chordName": "F#m"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "C#4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "C#4"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 2,
      "noteName": "B3"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 1,
      "noteName": "D3",
      "chordName": "D"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "F#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 45,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 4,
      "noteName": "A2",
      "chordName": "A"
    },
    {
      "midi": 57,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "A2"
    },
    {
      "midi": 61,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "C#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 3,
      "noteName": "E3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 5,
      "noteName": "A3"
    }
  ]
},

{
  "id": "your-song",
  "title": "Your Song",
  "composerOrArtist": "Elton John & Bernie Taupin",
  "genre": "Pop & Rock Clássico",
  "difficulty": "Intermediário",
  "recommendedBpm": 68,
  "timeSignature": "4/4",
  "tonality": "Mi Bemol Maior (Eb)",
  "description": "A balada mais emblemática ao piano de Elton John, estruturada completamente em 16 compassos desde o lendário arpejo de abertura até a conclusão calorosa.",
  "historicalContext": "Composta em 1969 na mesa do café da manhã da mãe de Elton John, consolidou a carreira mundial do artista.",
  "biomechanicsTip": "Toque os arpejos com rotação fluida do antebraço e articulação clara do dedilhado 1-2-3-5. Expressão nobre e terna.",
  "chords": [
    "Eb",
    "Ab",
    "Bb",
    "Cm",
    "Fm7"
  ],
  "scoreTrack": [
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "Eb3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 3,
      "noteName": "Bb3"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "Eb4"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "Ab3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 4,
      "noteName": "Eb4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 2,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb7"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "Bb3"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 77,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 5,
      "noteName": "F4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 5,
      "noteName": "Eb4"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "Bb3"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 4,
      "noteName": "Eb4"
    },
    {
      "midi": 79,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G4"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 77,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 4,
      "noteName": "F4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "Eb4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 6,
      "fingerRightHand": 1,
      "noteName": "C4"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "Bb3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "Eb4"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 77,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 5,
      "noteName": "F4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 8,
      "fingerRightHand": 4,
      "noteName": "Eb4"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "Eb4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 1,
      "noteName": "Bb3"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 1,
      "noteName": "Ab3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "Bb3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "Eb4"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 79,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "G4"
    },
    {
      "midi": 77,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 4,
      "noteName": "F4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "Eb4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "D4"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "D4"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 3,
      "noteName": "Eb4"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "Fm7"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 1,
      "noteName": "Ab3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "Bb3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 2,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 75,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 5,
      "noteName": "Eb4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "C4"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 2,
      "noteName": "Bb3"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 4,
      "noteName": "Ab2",
      "chordName": "Ab"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 4,
      "noteName": "Ab3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "F3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "Eb3"
    },
    {
      "midi": 39,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "Eb2",
      "chordName": "Eb"
    },
    {
      "midi": 55,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 58,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "Bb2"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 3,
      "noteName": "Eb3"
    }
  ]
},

{
  "id": "sweet-dreams",
  "title": "Sweet Dreams (Are Made of This)",
  "composerOrArtist": "Eurythmics (Annie Lennox & Dave Stewart)",
  "genre": "Rock Anos 80 & New Wave",
  "difficulty": "Intermediário",
  "recommendedBpm": 125,
  "timeSignature": "4/4",
  "tonality": "Dó Menor (Cm)",
  "description": "O lendário riff eletrônico de sintetizador analógico dos anos 80, estruturado completamente em 16 compassos com a linha de baixo staccato e melodia marcante.",
  "historicalContext": "Composta em 1982 em Londres num gravador de 8 canais, transformou o Eurythmics em fenômeno global de synth-pop.",
  "biomechanicsTip": "Mantenha o pulso esquerdo em staccato motor e rítmico como um metrônomo. Mão direita precisa e articulada nas síncopas.",
  "chords": [
    "Cm",
    "Ab",
    "G"
  ],
  "scoreTrack": [
    {
      "midi": 36,
      "clef": "bass",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerLeftHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 51,
      "clef": "bass",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerLeftHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerLeftHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 32,
      "clef": "bass",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 5,
      "noteName": "Ab1",
      "chordName": "Ab"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerLeftHand": 1,
      "noteName": "Ab2"
    },
    {
      "midi": 51,
      "clef": "bass",
      "duration": 1,
      "beat": 3,
      "measure": 2,
      "fingerLeftHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 44,
      "clef": "bass",
      "duration": 1,
      "beat": 4,
      "measure": 2,
      "fingerLeftHand": 1,
      "noteName": "Ab2"
    },
    {
      "midi": 31,
      "clef": "bass",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 5,
      "noteName": "G1",
      "chordName": "G"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerLeftHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 50,
      "clef": "bass",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerLeftHand": 2,
      "noteName": "D3"
    },
    {
      "midi": 43,
      "clef": "bass",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerLeftHand": 1,
      "noteName": "G2"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerLeftHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 51,
      "clef": "bass",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerLeftHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 1,
      "beat": 4,
      "measure": 4,
      "fingerLeftHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 32,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 5,
      "noteName": "Ab1",
      "chordName": "Ab"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 31,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 5,
      "noteName": "G1",
      "chordName": "G"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "G3"
    },
    {
      "midi": 32,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 5,
      "noteName": "Ab1",
      "chordName": "Ab"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 31,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 5,
      "noteName": "G1",
      "chordName": "G"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 32,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 5,
      "noteName": "Ab1",
      "chordName": "Ab"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "Ab3"
    },
    {
      "midi": 31,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 5,
      "noteName": "G1",
      "chordName": "G"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "G3"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "F3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "Eb3"
    },
    {
      "midi": 62,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "D3"
    },
    {
      "midi": 36,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "C2",
      "chordName": "Cm"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 3,
      "noteName": "Eb3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 5,
      "noteName": "G3"
    }
  ]
},

{
  "id": "dont-stop-believin",
  "title": "Don't Stop Believin'",
  "composerOrArtist": "Journey (Jonathan Cain, Steve Perry & Neal Schon)",
  "genre": "Rock Anos 80 & New Wave",
  "difficulty": "Intermediário",
  "recommendedBpm": 118,
  "timeSignature": "4/4",
  "tonality": "Mi Maior (E)",
  "description": "A mais famosa introdução e progressão ao piano do Rock clássico dos anos 80, transcrita em 16 compassos completos cobrindo o tema instrumental, verso e refrão com baixo pulsante.",
  "historicalContext": "Lançada em 1981 no álbum Escape, composta ao piano pelo tecladista Jonathan Cain.",
  "biomechanicsTip": "Mantenha a mão esquerda pulsando em oitavas firmes com peso controlado pelo antebraço. Mão direita com clareza nos acentos sincopados.",
  "chords": [
    "E",
    "B",
    "C#m",
    "A"
  ],
  "scoreTrack": [
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 2,
      "noteName": "G#3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 3,
      "noteName": "B3"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 35,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 5,
      "noteName": "B1",
      "chordName": "B"
    },
    {
      "midi": 59,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 1,
      "noteName": "B2"
    },
    {
      "midi": 63,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 2,
      "noteName": "D#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 3,
      "noteName": "F#3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 2,
      "fingerRightHand": 5,
      "noteName": "B3"
    },
    {
      "midi": 37,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 5,
      "noteName": "C#2",
      "chordName": "C#m"
    },
    {
      "midi": 61,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 1,
      "noteName": "C#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 2,
      "noteName": "E3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 73,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerRightHand": 5,
      "noteName": "C#4"
    },
    {
      "midi": 33,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 5,
      "noteName": "A1",
      "chordName": "A"
    },
    {
      "midi": 57,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "A2"
    },
    {
      "midi": 61,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "C#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 3,
      "noteName": "E3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 4,
      "fingerRightHand": 5,
      "noteName": "A3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 35,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 5,
      "noteName": "B1",
      "chordName": "B"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 6,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 37,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 5,
      "noteName": "C#2",
      "chordName": "C#m"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 33,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "A1",
      "chordName": "A"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 8,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 35,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 5,
      "noteName": "B1",
      "chordName": "B"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 10,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 10,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 37,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 5,
      "noteName": "C#2",
      "chordName": "C#m"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 33,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 5,
      "noteName": "A1",
      "chordName": "A"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1.5,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 5,
      "noteName": "B3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 0.5,
      "beat": 2.5,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 35,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 5,
      "noteName": "B1",
      "chordName": "B"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "A3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 14,
      "fingerRightHand": 5,
      "noteName": "B3"
    },
    {
      "midi": 37,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 5,
      "noteName": "C#2",
      "chordName": "C#m"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 66,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "F#3"
    },
    {
      "midi": 40,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "E2",
      "chordName": "E"
    },
    {
      "midi": 52,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 68,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 3,
      "noteName": "G#3"
    },
    {
      "midi": 71,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 5,
      "noteName": "B3"
    }
  ]
},

{
  "id": "o-cravo-e-a-rosa",
  "title": "O Cravo e a Rosa",
  "composerOrArtist": "Folclore & Tradição Popular Brasileira",
  "genre": "Infantis, Cirandas & Folclore",
  "difficulty": "Iniciante",
  "recommendedBpm": 96,
  "timeSignature": "4/4",
  "tonality": "Fá Maior (F)",
  "description": "A mais famosa cantiga infantil do folclore nacional em partitura completa com 16 compassos, contando toda a história lírica em duas mãos e acompanhamento rítmico.",
  "historicalContext": "Cantiga tradicional brasileira de domínio público, cantada há mais de dois séculos em todas as regiões do Brasil.",
  "biomechanicsTip": "Posicione as duas mãos em Fá Maior (ME no baixo F2-C3, MD na região F3-C4). Toque com pulso relaxado e articulação clara.",
  "chords": [
    "F",
    "C7",
    "Bb"
  ],
  "scoreTrack": [
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 1,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 1,
      "fingerRightHand": 1,
      "noteName": "F3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 1,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 1,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 2,
      "fingerLeftHand": 1,
      "noteName": "C3",
      "chordName": "C7"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 2,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 2,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 2,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 3,
      "fingerLeftHand": 3,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 3,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 3,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 3,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 4,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 4,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 4,
      "fingerRightHand": 1,
      "noteName": "F3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 5,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 5,
      "fingerRightHand": 1,
      "noteName": "F3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 5,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 5,
      "fingerRightHand": 5,
      "noteName": "C4"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 6,
      "fingerLeftHand": 1,
      "noteName": "C3",
      "chordName": "C7"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 6,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 6,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 6,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 7,
      "fingerLeftHand": 3,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 7,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 7,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 8,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 8,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 8,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 8,
      "fingerRightHand": 1,
      "noteName": "F3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 9,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 9,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "D4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 9,
      "fingerRightHand": 5,
      "noteName": "E4"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 10,
      "fingerLeftHand": 1,
      "noteName": "C3",
      "chordName": "C7"
    },
    {
      "midi": 77,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 10,
      "fingerRightHand": 5,
      "noteName": "F4"
    },
    {
      "midi": 76,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 10,
      "fingerRightHand": 4,
      "noteName": "E4"
    },
    {
      "midi": 46,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 11,
      "fingerLeftHand": 3,
      "noteName": "Bb2",
      "chordName": "Bb"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 74,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 11,
      "fingerRightHand": 3,
      "noteName": "D4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 11,
      "fingerRightHand": 2,
      "noteName": "C4"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 12,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 12,
      "fingerRightHand": 2,
      "noteName": "Bb3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 12,
      "fingerRightHand": 1,
      "noteName": "A3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 13,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 13,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 70,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 13,
      "fingerRightHand": 4,
      "noteName": "Bb3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 13,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 14,
      "fingerLeftHand": 1,
      "noteName": "C3",
      "chordName": "C7"
    },
    {
      "midi": 72,
      "clef": "treble",
      "duration": 2,
      "beat": 1,
      "measure": 14,
      "fingerRightHand": 4,
      "noteName": "C4"
    },
    {
      "midi": 69,
      "clef": "treble",
      "duration": 2,
      "beat": 3,
      "measure": 14,
      "fingerRightHand": 3,
      "noteName": "A3"
    },
    {
      "midi": 48,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 15,
      "fingerLeftHand": 1,
      "noteName": "C3",
      "chordName": "C7"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 1,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 67,
      "clef": "treble",
      "duration": 1,
      "beat": 2,
      "measure": 15,
      "fingerRightHand": 2,
      "noteName": "G3"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 1,
      "beat": 3,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "C3"
    },
    {
      "midi": 64,
      "clef": "treble",
      "duration": 1,
      "beat": 4,
      "measure": 15,
      "fingerRightHand": 1,
      "noteName": "E3"
    },
    {
      "midi": 41,
      "clef": "bass",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerLeftHand": 5,
      "noteName": "F2",
      "chordName": "F"
    },
    {
      "midi": 57,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 1,
      "noteName": "A2"
    },
    {
      "midi": 60,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 2,
      "noteName": "C3"
    },
    {
      "midi": 65,
      "clef": "treble",
      "duration": 4,
      "beat": 1,
      "measure": 16,
      "fingerRightHand": 4,
      "noteName": "F3"
    }
  ]
},
...EXTENDED_REPERTOIRE_SONGS,
];
