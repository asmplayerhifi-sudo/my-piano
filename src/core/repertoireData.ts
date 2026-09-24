import type { ScoreNote } from './coursesData';

export type SongGenre =
  | 'Clássico & Mestres'
  | 'MPB & Pop Nacional'
  | 'Pop & Rock Clássico'
  | 'Rock Anos 80 & New Wave'
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
    badge: '22 Obras',
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
    label: 'MPB & Pop Nacional (Roupa Nova & Bossa)',
    shortLabel: 'MPB / Nacional',
    iconName: 'Heart',
    badge: '5 Obras',
    description: 'De Roupa Nova a Tom Jobim, Pixinguinha e o Baião imortal de Luiz Gonzaga.',
  },
  {
    id: 'Pop & Rock Clássico',
    label: 'Pop & Rock Clássico (ABBA, Elton John & Beatles)',
    shortLabel: 'Pop/Rock',
    iconName: 'Disc',
    badge: '5 Obras',
    description: 'Os maiores hinos de piano pop e rock internacional de todos os tempos.',
  },
  {
    id: 'Rock Anos 80 & New Wave',
    label: 'Rock Anos 80 & New Wave (a-ha & Eurythmics)',
    shortLabel: 'Anos 80 / New Wave',
    iconName: 'Zap',
    badge: '3 Obras',
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
    description: 'O tema universal da fraternidade da 9ª Sinfonia de Beethoven. Melodia completa em 8 compassos com harmonia de tônica e dominante.',
    historicalContext: 'Composta por Beethoven em 1824 com base no poema de Friedrich Schiller quando o compositor já estava completamente surdo.',
    biomechanicsTip: 'Mantenha os 5 dedos apoiados sobre C4 a G4 com formato curvo de maçã. Firmeza no toque sem rigidez de pulso.',
    chords: ['C', 'G'],
    scoreTrack: [
      // Compasso 1 (E E F G)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 (G F E D)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 3 (C C D E)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 4 (E. D D-)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 5 (E E F G)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 6 (G F E D)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 7 (C C D E)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 8 (D. C C-)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 8, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'C4' },
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
    description: 'A peça para piano mais célebre do repertório clássico. O tema principal em Lá Menor com o toque perlado entre E5 e D#5 e os arpejos da mão esquerda.',
    historicalContext: 'Composta por Beethoven em 27 de abril de 1810 em Viena. O manuscrito foi descoberto apenas em 1867 por Ludwig Nohl.',
    biomechanicsTip: 'Alterne os dedos 5 e 4 em arco flexível no semitom E5 - D#5 com o punho relaxado. Transfira o peso sem tensão nos tendões.',
    chords: ['Am', 'E7'],
    scoreTrack: [
      // Compasso 1 (E5 D#5 E5 D#5 E5 B4)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'B4' },

      // Compasso 2 (D5 C5 A4 com arpejo Am na mão esquerda: A2 - E3 - A3)
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'C5' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 5, noteName: 'A2', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'A4' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 2, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A3' },

      // Compasso 3 (C4 E4 A4 B4 com arpejo E7 na mão esquerda: E2 - E3 - G#3)
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 40, clef: 'bass', duration: 1, beat: 2, measure: 3, fingerLeftHand: 5, noteName: 'E2', chordName: 'E7' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 3, fingerRightHand: 5, noteName: 'B4' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 3, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 56, clef: 'bass', duration: 1, beat: 3, measure: 3, fingerLeftHand: 1, noteName: 'G#3' },

      // Compasso 4 (E4 G#4 B4 C5 com resolução em Am)
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'G#4' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 4, fingerLeftHand: 5, noteName: 'A2', chordName: 'Am' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 2.5, measure: 4, fingerRightHand: 5, noteName: 'C5' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 4, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 4, fingerLeftHand: 1, noteName: 'A3' },

      // Compasso 5 (Retomada do Tema Principal: E5 D#5 E5 D#5 E5 B4)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'E5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'B4' },

      // Compasso 6 (D5 C5 A4)
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 6, fingerRightHand: 3, noteName: 'C5' },
      { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 6, fingerLeftHand: 5, noteName: 'A2', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 6, fingerRightHand: 1, noteName: 'A4' },
      { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 6, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 57, clef: 'bass', duration: 1, beat: 3, measure: 6, fingerLeftHand: 1, noteName: 'A3' },
    ],
  },
  {
    id: 'chopin-nocturne',
    title: 'Noturno Op. 9 No. 2 em Mi Bemol Maior',
    composerOrArtist: 'Frédéric Chopin',
    genre: 'Clássico & Mestres',
    difficulty: 'Avançado',
    recommendedBpm: 60,
    timeSignature: '12/8',
    tonality: 'Mi Bemol Maior (E♭)',
    description: 'A melodia mais poética e famosa de Frédéric Chopin. Fraseado lírico em Bel Canto com acordes arpejados característicos na mão esquerda.',
    historicalContext: 'Composta por Chopin entre 1830 e 1832 aos 20 anos em Paris, dedicada a Marie Pleyel.',
    biomechanicsTip: 'O punho direito deve respirar suavemente acompanhando a curva da melodia, mantendo o legato cantabile.',
    chords: ['Eb', 'Cm', 'Fm', 'Bb7'],
    scoreTrack: [
      // Compasso 1 (Anacruse Bb4 -> G5 G5 F5 G5 Ab5 G5)
      { midi: 39, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'Bb4' },
      { midi: 79, clef: 'treble', duration: 1.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G5' },
      { midi: 79, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G5' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'F5' },
      { midi: 79, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G5' },
      { midi: 80, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 5, noteName: 'Ab5' },

      // Compasso 2 (G5 F5 F5 Eb5 F5 Bb4)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'C3', chordName: 'Cm' },
      { midi: 79, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G5' },
      { midi: 77, clef: 'treble', duration: 1.5, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F5' },
      { midi: 77, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'Eb5' },
      { midi: 77, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'F5' },
      { midi: 70, clef: 'treble', duration: 0.5, beat: 4.5, measure: 2, fingerRightHand: 1, noteName: 'Bb4', chordName: 'Bb7' },

      // Compasso 3 (Eb5 D5 Eb5 F5 Bb4)
      { midi: 44, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'Ab2', chordName: 'Ab' },
      { midi: 75, clef: 'treble', duration: 1.5, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'Eb5' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'D5' },
      { midi: 75, clef: 'treble', duration: 1, beat: 2.5, measure: 3, fingerRightHand: 3, noteName: 'Eb5' },
      { midi: 77, clef: 'treble', duration: 1.5, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'F5' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'Bb4' },

      // Compasso 4 (G5 Eb5)
      { midi: 39, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'G5' },
      { midi: 75, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'Eb5' },
    ],
  },
  {
    id: 'canon-in-d',
    title: 'Canon em Ré (Pachelbel\'s Canon)',
    composerOrArtist: 'Johann Pachelbel',
    genre: 'Clássico & Mestres',
    difficulty: 'Intermediário',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Dó Maior (Adaptação Didática)',
    description: 'A célebre progressão harmônica de Pachelbel com o baixo fundamental contínuo e a melodia em terças e notas descendentes.',
    historicalContext: 'Composta por volta de 1680 na Alemanha Barroca para três violinos e baixo contínuo.',
    biomechanicsTip: 'Toque o baixo com firmeza no tempo 1 e 3 de cada compasso, mantendo a melodia da mão direita expressiva.',
    chords: ['C', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G'],
    scoreTrack: [
      // Compasso 1 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'D5' },

      // Compasso 2 (Am -> Em)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C5' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'B4' },

      // Compasso 3 (F -> C)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'F2', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'A4' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'G4' },

      // Compasso 4 (F -> G)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'F2', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A4' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'B4' },

      // Compasso 5 (Variação em semínimas descendentes: C5 B4 A4 G4)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'C5' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'B4' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'G4' },

      // Compasso 6 (F4 E4 F4 D4)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E4' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'D4' },
    ],
  },
  {
    id: 'minuet-in-g',
    title: 'Minueto em Sol Maior (BWV Anh. 114)',
    composerOrArtist: 'Christian Petzold / J.S. Bach',
    genre: 'Clássico & Mestres',
    difficulty: 'Iniciante',
    recommendedBpm: 100,
    timeSignature: '3/4',
    tonality: 'Sol Maior (G)',
    description: 'A clássica dança barroca em compasso ternário do Caderno de Anna Magdalena Bach. Treino essencial de fraseado e independência das mãos.',
    historicalContext: 'Registrada por Johann Sebastian Bach em 1725, sua autoria foi posteriormente confirmada como sendo do compositor Christian Petzold.',
    biomechanicsTip: 'Dê um apoio firme no tempo 1 do compasso ternário com toques mais leves nos tempos 2 e 3.',
    chords: ['G', 'C', 'Am', 'D'],
    scoreTrack: [
      // Compasso 1 (D5 G4 A4 B4 C5)
      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'G3', chordName: 'G' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'D5' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'C5' },

      // Compasso 2 (D5 G4 G4)
      { midi: 47, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B2' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'D5' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'G4' },

      // Compasso 3 (E5 C5 D5 E5 F#5)
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'C3', chordName: 'C' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'E5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'C5' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 3, noteName: 'D5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'E5' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 5, noteName: 'F#5' },

      // Compasso 4 (G5 G4 G4)
      { midi: 47, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'B2', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'G5' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'G4' },

      // Compasso 5 (C5 D5 C5 B4 A4)
      { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A2', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'C5' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 4, noteName: 'C5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'A4' },

      // Compasso 6 (B4 C5 B4 A4 G4)
      { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'C5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 6, fingerRightHand: 1, noteName: 'G4' },
    ],
  },

  // =========================================================================
  // 2. MPB & POP NACIONAL (Roupa Nova, Tom Jobim, Pixinguinha, Gonzaga)
  // =========================================================================
  {
    id: 'linda-demais',
    title: 'Linda Demais',
    composerOrArtist: 'Roupa Nova (Kiko & Tavinho Paes)',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Intermediário',
    recommendedBpm: 76,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A clássica balada do Roupa Nova. Melodia inconfundível de Cleberson Horsth com condução poética romântica e acordes harmônicos limpos.',
    historicalContext: 'Lançada em 1985 no aclamado álbum do Roupa Nova, tornou-se um dos hinos absolutos do pop romântico nacional.',
    biomechanicsTip: 'Toque as frases melódicas com o punho flexível e legato expressivo, respirando entre cada verso cantado.',
    chords: ['C', 'G/B', 'Am', 'F'],
    scoreTrack: [
      // Compasso 1 ("Lin-da, só...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'G4' },

      // Compasso 2 ("...você me fascina")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B2', chordName: 'G/B' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 4, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'E4' },

      // Compasso 3 ("Te de-se-jo...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'D4' },

      // Compasso 4 ("...muito além do prazer")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 5 ("Vista meu futuro...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 6 ("...em teu corpo")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'B2', chordName: 'G/B' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'D4' },

      // Compasso 7 ("E me ama como eu amo você")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 7, fingerRightHand: 2, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 7, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'D4' },

      // Compasso 8 ("...você.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C4' },
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
    description: 'A canção brasileira mais famosa no mundo. O balanço inconfundível da Bossa Nova com a síncopa suave e as extensões harmônicas de Tom Jobim.',
    historicalContext: 'Composta em 1962 em Ipanema inspirada por Helô Pinheiro, vencedora do Grammy de Gravação do Ano em 1965.',
    biomechanicsTip: 'Toque com leveza flutuante, sem atacar com peso excessivo na tecla para preservar o balanço da Bossa.',
    chords: ['Fmaj7', 'G7', 'Gm7', 'C7'],
    scoreTrack: [
      // Compasso 1 ("Olha que coisa mais linda...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 2 ("...mais cheia de graça...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'C3', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 3 ("...é ela menina que vem...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 4 ("...e que passa...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'D3', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'G4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 5 ("...num doce balanço...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 4, noteName: 'G2', chordName: 'Gm7' },
      { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 5, fingerRightHand: 2, noteName: 'D4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 6 ("...a caminho do mar...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'C3', chordName: 'C7' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'Bb4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'D4' },

      // Compasso 7 ("...Fá Maior final")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'F4' },
    ],
  },
  {
    id: 'aguas-de-marco',
    title: 'Águas de Março',
    composerOrArtist: 'Antônio Carlos Jobim',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Intermediário',
    recommendedBpm: 126,
    timeSignature: '4/4',
    tonality: 'Si Bemol Maior (B♭)',
    description: 'Obra-prima definitiva da música brasileira. Linha de baixo cromático descendente e métrica poética sincopada singular.',
    historicalContext: 'Composta em 1972 no sítio de Poço Fundo em Petrópolis, eternizada no dueto de Elis Regina e Tom Jobim em 1974.',
    biomechanicsTip: 'Acompanhe o balanço sincopado tocando o baixo no tempo 1 e marcando as notas da melodia com clareza nos dedos.',
    chords: ['Bb', 'Bbm/Ab', 'Eb/G', 'Ebm/Gb', 'Bb/F'],
    scoreTrack: [
      // Compasso 1 ("É pau, é pedra...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 2 ("...é o fim do caminho")
      { midi: 44, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'Ab2', chordName: 'Bbm/Ab' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'Bb3' },

      // Compasso 3 ("É um resto de toco...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'G2', chordName: 'Eb/G' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 4 ("...é um pouco sozinho")
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 2, noteName: 'Gb2', chordName: 'Ebm/Gb' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'Bb3' },

      // Compasso 5 ("É um caco de vidro...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 1, noteName: 'F2', chordName: 'Bb/F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 6 ("...é a vida, é o sol")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'E2', chordName: 'Edim' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 1, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'Bb3' },
    ],
  },
  {
    id: 'carinhoso',
    title: 'Carinhoso',
    composerOrArtist: 'Pixinguinha & João de Barro',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Avançado',
    recommendedBpm: 68,
    timeSignature: '2/4',
    tonality: 'Fá Maior (F)',
    description: 'A mais bela página do Choro e da canção romântica brasileira. Fraseado lírico refinado com cromatismos melódicos encantadores.',
    historicalContext: 'Composta por Pixinguinha entre 1916 e 1917, com letra de João de Barro (Braguinha) em 1937, gravada por Orlando Silva.',
    biomechanicsTip: 'Toque com fraseado muito expressivo (cantabile), mantendo o legato suave na mão direita.',
    chords: ['F', 'A7', 'Dm', 'Gm', 'C7'],
    scoreTrack: [
      // Compasso 1 ("Meu coração...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 3, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'E4' },

      // Compasso 2 ("...não sei por que...")
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'A2', chordName: 'A7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
      { midi: 61, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C#4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 3 ("...bate feliz...")
      { midi: 38, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 4 ("...quando te vê...")
      { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'G2', chordName: 'Gm' },
      { midi: 58, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'A3' },
      { midi: 58, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'Bb3' },

      // Compasso 5 ("...e os meus olhos...")
      { midi: 36, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C7' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 3, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 0.5, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 1, noteName: 'A3' },

      // Compasso 6 ("...ficam a...")
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 55, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 1, noteName: 'G3' },
      { midi: 57, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'A3' },

      // Compasso 7 ("...te olhar.")
      { midi: 36, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C7' },
      { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 8 (Fá final)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 53, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'F3' },
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
    description: 'O hino do sertão brasileiro. A melodia folclórica mais tocada do Nordeste com o ritmo pulsante de baião.',
    historicalContext: 'Gravada em 1947 pelo Rei do Baião Luiz Gonzaga, retratando a seca nordestina e a esperança do povo sertanejo.',
    biomechanicsTip: 'Melodia com articulação nítida dos dedos 1, 2, 3 e 5 da mão direita com apoio firme do baixo.',
    chords: ['C', 'F', 'G7'],
    scoreTrack: [
      // Compasso 1 ("Quando olhei a terra ardendo...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 ("...qual a fogueira...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F4' },

      // Compasso 3 ("...de São João...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 4 ("...eu perguntei...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 5 ("...a Deus do céu, ai...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 6 ("...por que tamanha...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'E4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 7 ("...judiação...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'D4' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'B3' },

      // Compasso 8 (Dó final)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C4' },
    ],
  },

  // =========================================================================
  // 3. POP & ROCK CLÁSSICO (ABBA, Elton John, Beatles, Queen, Lennon)
  // =========================================================================
  {
    id: 'dancing-queen',
    title: 'Dancing Queen',
    composerOrArtist: 'ABBA (Benny Andersson & Björn Ulvaeus)',
    genre: 'Pop & Rock Clássico',
    difficulty: 'Intermediário',
    recommendedBpm: 100,
    timeSignature: '4/4',
    tonality: 'Lá Maior (A)',
    description: 'O piano pop mais brilhante e contagiante da era Disco. Refrão inesquecível com condução rítmica precisa e harmonia luminosa.',
    historicalContext: 'Lançada em 1976 no álbum Arrival, chegou ao topo das paradas em 15 países e é a canção assinatura do ABBA.',
    biomechanicsTip: 'Toque com entusiasmo rítmico, mantendo o pulso solto e a articulação leve dos dedos na mão direita.',
    chords: ['A', 'D/A', 'F#m', 'E'],
    scoreTrack: [
      // Compasso 1 ("You can dance, you can jive...")
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'A4' },
      { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 3, noteName: 'D3', chordName: 'D/A' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'D5' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 5, noteName: 'F#5' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'D5' },

      // Compasso 2 ("...having the time of your life...")
      { midi: 42, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F#2', chordName: 'F#m' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'B4' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'A4' },

      // Compasso 3 ("See that girl, watch that scene...")
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 5, noteName: 'E5' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 1, noteName: 'A4' },
      { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 3, noteName: 'D3', chordName: 'D/A' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'D5' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 5, noteName: 'F#5' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 4, noteName: 'D5' },

      // Compasso 4 ("...dig in the Dancing Queen!")
      { midi: 42, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F#2', chordName: 'F#m' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 1, noteName: 'A4' },
      { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'A4' },
    ],
  },
  {
    id: 'your-song',
    title: 'Your Song',
    composerOrArtist: 'Elton John & Bernie Taupin',
    genre: 'Pop & Rock Clássico',
    difficulty: 'Intermediário',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Dó Maior (Adaptação Didática)',
    description: 'A balada de piano definitiva de Elton John. O verso introdutório tocante com arpejos suaves e condução melódica primorosa.',
    historicalContext: 'Lançada em 1970 no álbum homônimo de Elton John, gravada nos lendários estúdios Trident de Londres.',
    biomechanicsTip: 'A mão esquerda estabelece as fundamentais e a mão direita canta os intervalos de terça com doçura e precisão.',
    chords: ['C', 'Fmaj7', 'G/B', 'Em'],
    scoreTrack: [
      // Compasso 1 ("It's a little bit funny, this feeling inside...")
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 2 ("I'm not one of those who can easily hide...")
      { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'B2', chordName: 'G/B' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'D4' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 3 ("I don't have much money, but boy if I did...")
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 4 ("I'd buy a big house where we both could live.")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },
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
    description: 'O riff de piano mais emblemático da história da música pacifista. A icônica alternância entre C, Cmaj7 e F em quatro compassos completos.',
    historicalContext: 'Composta por John Lennon em 1971 gravada no piano de cauda Steinway branco em Tittenhurst Park.',
    biomechanicsTip: 'Mantenha o polegar no Dó e faça o movimento pendular suave nos dedos 3 e 5 da mão direita.',
    chords: ['C', 'Cmaj7', 'F'],
    scoreTrack: [
      // Compasso 1 (C -> Cmaj7)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'E4', chordName: 'Cmaj7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'G4' },

      // Compasso 2 (F com arpejo característico)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'C5' },

      // Compasso 3 (Repetição C -> Cmaj7)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'E4', chordName: 'Cmaj7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'B4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 4, noteName: 'G4' },

      // Compasso 4 (F resolução)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'A4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'A4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 4, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 4, noteName: 'C5' },
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
    description: 'A progressão I - V - vi - IV em sua forma mais sublime. Os acordes de piano de Paul McCartney que revolucionaram a música popular.',
    historicalContext: 'Composta por Paul McCartney em 1968 em meio às tensões finais dos Beatles, inspirada em sua mãe Mary.',
    biomechanicsTip: 'Utilize o dedo âncora ao mudar de C para F para não deslocar desnecessariamente o braço pelo ar.',
    chords: ['C', 'G', 'Am', 'F'],
    scoreTrack: [
      // Compasso 1 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'B3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 (Am -> F)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'F2', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 3 (C -> G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'B3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 4 (F -> C resolução)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'F2', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'A4' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'G4' },
    ],
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Bohemian Rhapsody (Balada Inicial)',
    composerOrArtist: 'Queen / Freddie Mercury',
    genre: 'Pop & Rock Clássico',
    difficulty: 'Avançado',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Si Bemol Maior (B♭)',
    description: 'A introdução de piano operístico mais famosa do rock mundial. Condução dramática das vozes com o baixo profundo em Si Bemol Maior.',
    historicalContext: 'Lançada em 1975 no álbum A Night at the Opera, gravada por Freddie Mercury em um piano Bechstein.',
    biomechanicsTip: 'A mão esquerda estabelece a base com peso controlado enquanto a mão direita canta com expressividade operística.',
    chords: ['Bb', 'Gm', 'Cm', 'F7'],
    scoreTrack: [
      // Compasso 1 ("Mama...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'Bb4' },

      // Compasso 2 ("...just killed a man...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'Eb4' },

      // Compasso 3 ("Put a gun against his head...")
      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'Cm' },
      { midi: 63, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'Eb4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'G4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'C5' },

      // Compasso 4 ("...pulled my trigger, now he's dead.")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F2', chordName: 'F7' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'C5' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'Bb4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'A4' },

      // Compasso 5 (Si Bemol de repouso)
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 4, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'Bb4' },
    ],
  },

  // =========================================================================
  // 4. ROCK ANOS 80 & NEW WAVE (a-ha, Eurythmics, Journey)
  // =========================================================================
  {
    id: 'take-on-me',
    title: 'Take On Me (Riff Sintetizador)',
    composerOrArtist: 'a-ha (Magne Furuholmen)',
    genre: 'Rock Anos 80 & New Wave',
    difficulty: 'Intermediário',
    recommendedBpm: 84,
    timeSignature: '4/4',
    tonality: 'Fá Sustenido Menor (F#m)',
    description: 'O riff de sintetizador mais icônico da New Wave e dos anos 80. Linha sincopada saltitante em semicolcheias com harmonia pulsante de Bm - E - A - D.',
    historicalContext: 'Criada por Magne Furuholmen em 1984 e regravada com a lendária animação gráfica a lápis que conquistou 6 MTV Video Music Awards.',
    biomechanicsTip: 'Ataque com as pontas dos dedos e o antebraço leve para sustentar a velocidade do staccato.',
    chords: ['Bm', 'E', 'A', 'D'],
    scoreTrack: [
      // Compasso 1 (Bm -> E)
      { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 4, noteName: 'B2', chordName: 'Bm' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'D4' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'B3' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'G#4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 4, noteName: 'G#4' },

      // Compasso 2 (A -> D)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 5, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'D3', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'F#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'E4' },

      // Compasso 3 (Bm -> E reprise)
      { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'B2', chordName: 'Bm' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'D4' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 1, noteName: 'B3' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 3, fingerRightHand: 4, noteName: 'G#4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, fingerRightHand: 4, noteName: 'G#4' },

      // Compasso 4 (A -> D resolução)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 5, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'A4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 4, noteName: 'A4' },
      { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 3, noteName: 'D3', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'F#4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 1, noteName: 'D4' },
    ],
  },
  {
    id: 'sweet-dreams',
    title: 'Sweet Dreams (Are Made of This)',
    composerOrArtist: 'Eurythmics (Annie Lennox & Dave Stewart)',
    genre: 'Rock Anos 80 & New Wave',
    difficulty: 'Iniciante',
    recommendedBpm: 125,
    timeSignature: '4/4',
    tonality: 'Dó Menor (Cm)',
    description: 'O riff de sintetizador mais hipnótico do Synth Pop dos anos 80. Padrão contínuo de colcheias em Dó Menor com passagem para Lá Bemol e Sol.',
    historicalContext: 'Lançada em 1983 em Londres, criada no sintetizador analógico Roland SH-101 e gravada em fita de 8 canais.',
    biomechanicsTip: 'O polegar funciona como pivô no C4 enquanto os dedos 3 e 5 atacam as notas agudas com precisão rítmica mecânica.',
    chords: ['Cm', 'Ab', 'G'],
    scoreTrack: [
      // Compasso 1 (Cm)
      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'Cm' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 63, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'Ab4', chordName: 'Ab' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 4, noteName: 'G4', chordName: 'G' },

      // Compasso 2 (Ab -> G)
      { midi: 32, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'Ab1', chordName: 'Ab' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 63, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 31, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'Ab4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 2, fingerRightHand: 4, noteName: 'G4' },

      // Compasso 3 (Repetição Cm)
      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'Cm' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 63, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'Ab4', chordName: 'Ab' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, fingerRightHand: 4, noteName: 'G4', chordName: 'G' },

      // Compasso 4 (Resolução Ab -> G)
      { midi: 32, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'Ab1', chordName: 'Ab' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 63, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 31, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 4, fingerRightHand: 5, noteName: 'Ab4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 4, fingerRightHand: 4, noteName: 'G4' },
    ],
  },
  {
    id: 'dont-stop-believin',
    title: 'Don\'t Stop Believin\'',
    composerOrArtist: 'Journey / Jonathan Cain',
    genre: 'Rock Anos 80 & New Wave',
    difficulty: 'Intermediário',
    recommendedBpm: 118,
    timeSignature: '4/4',
    tonality: 'Mi Maior (E)',
    description: 'O groove de piano staccato mais famoso do rock americano. A progressão clássica de Jonathan Cain em E - B/D# - C#m - A.',
    historicalContext: 'Criada em 1981 por Jonathan Cain e Steve Perry, tornou-se o hino máximo das arenas e do rock melódico.',
    biomechanicsTip: 'Toque com staccato enérgico e dedos firmes, utilizando o antebraço com elasticidade para manter o pulso rítmico.',
    chords: ['E', 'B/D#', 'C#m', 'A'],
    scoreTrack: [
      // Compasso 1 (E -> B/D#)
      { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'G#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'B4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'G#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'B4' },
      { midi: 39, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'D#2', chordName: 'B/D#' },
      { midi: 63, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D#4' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },
      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D#4' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      // Compasso 2 (C#m -> A)
      { midi: 37, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'C#2', chordName: 'C#m' },
      { midi: 61, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G#4' },
      { midi: 61, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'G#4' },
      { midi: 33, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 61, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A4' },
      { midi: 61, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'A4' },
    ],
  },

  // =========================================================================
  // 5. INFANTIS, CIRANDAS & FOLCLORE BRASILEIRO
  // =========================================================================
  {
    id: 'ciranda-cirandinha',
    title: 'Ciranda, Cirandinha',
    composerOrArtist: 'Cantiga Tradicional Brasileira / Ciranda',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 90,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A ciranda mais emblemática da infância brasileira. Melodia límpida e alegre em Dó Maior para treino de leitura fluente e afinação das mãos.',
    historicalContext: 'Cantiga folclórica de roda transmitida por gerações de crianças em todo o território nacional.',
    biomechanicsTip: 'Dedos 1 a 5 apoiados com calma sobre as teclas C4 a G4. Não levante o punho excessivamente.',
    chords: ['C', 'G7'],
    scoreTrack: [
      // Compasso 1 ("Ciranda, cirandinha, vamos todos...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 2 ("...cirandar.")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },

      // Compasso 3 ("Vamos dar a meia volta, volta e meia...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 4 ("...vamos dar.")
      { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 3, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 1, noteName: 'D4' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },
    ],
  },
  {
    id: 'o-cravo-e-a-rosa',
    title: 'O Cravo e a Rosa',
    composerOrArtist: 'Cantiga Folclórica Brasileira',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 96,
    timeSignature: '3/4',
    tonality: 'Dó Maior (C)',
    description: 'Cantiga folclórica tradicional em compasso ternário (3/4). Prática ideal do balanço de valsa com acentuação no primeiro tempo.',
    historicalContext: 'Tema folclórico tradicional brasileiro registrado e harmonizado por Heitor Villa-Lobos em seu Guia Prático.',
    biomechanicsTip: 'Toque o tempo 1 com apoio suave do peso do braço e os tempos 2 e 3 com toques leves.',
    chords: ['C', 'G7'],
    scoreTrack: [
      // Compasso 1 ("O cravo brigou...")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 ("...com a rosa...")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 3 ("...debaixo de uma sacada...")
      { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 4 ("...o cravo saiu ferido...")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 5 ("O cravo saiu ferido...")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 6 ("...e a rosa...")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'E4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 7 ("...despedaçada...")
      { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'F4' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'B3' },

      // Compasso 8 (Dó final)
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 3, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C4' },
    ],
  },
  {
    id: 'peixe-vivo',
    title: 'Peixe Vivo',
    composerOrArtist: 'Cantiga Folclórica Brasileira (Minas Gerais)',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 100,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'Cantiga tradicional mineira e hino afetuoso nacional. Andamento alegre com frases melódicas cantáveis em graus conjuntos.',
    historicalContext: 'Canção folclórica tradicional dos seresteiros de Diamantina (MG), adotada como tema de Juscelino Kubitschek.',
    biomechanicsTip: 'Dedos 5, 4, 3, 2, 1 atacando com as pontas e sem rigidez muscular no polegar.',
    chords: ['C', 'G7'],
    scoreTrack: [
      // Compasso 1 ("Como pode o peixe vivo...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 ("...viver fora da água fria?")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'E4' },

      // Compasso 3 ("Como poderei viver...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 4 ("...sem a tua companhia?")
      { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 4.5, measure: 4, fingerRightHand: 1, noteName: 'D4' },

      // Compasso 5 (Dó final)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C4' },
    ],
  },
  {
    id: 'cai-cai-balao',
    title: 'Cai, Cai, Balão',
    composerOrArtist: 'Cantiga Tradicional Junina & Folclórica',
    genre: 'Infantis, Cirandas & Folclore',
    difficulty: 'Iniciante',
    recommendedBpm: 95,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A cantiga junina mais querida do Brasil. Movimento de terças e graus conjuntos perfeito para fixação das notas no teclado.',
    historicalContext: 'Canção de celebração folclórica do ciclo junino entoada há mais de um século em todas as regiões brasileiras.',
    biomechanicsTip: 'Exercite o salto de terça de Sol para Mi com os dedos 5 e 3 mantendo o punho relaxado.',
    chords: ['C', 'G7'],
    scoreTrack: [
      // Compasso 1 ("Cai, cai, balão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 2 ("...cai, cai, balão...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 3 ("...aqui na minha mão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 5, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'F4' },

      // Compasso 4 ("...não cai não...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 5 ("Não cai não, não cai não, não cai não...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 6 ("...cai na rua do sabão.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'C4' },
    ],
  },
];
