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
    badge: '21 Obras',
    description: 'Catálogo completo de partituras com rolagem interativa.',
  },
  {
    id: 'Clássico & Mestres',
    label: 'Clássico & Grandes Mestres (Beethoven & Chopin)',
    shortLabel: 'Clássico',
    iconName: 'GraduationCap',
    badge: '5 Obras',
    description: 'Obras-primas imortais de Beethoven, Chopin, Bach e Pachelbel.',
  },
  {
    id: 'MPB & Pop Nacional',
    label: 'MPB & Pop Nacional (Roupa Nova & Bossa)',
    shortLabel: 'MPB / Nacional',
    iconName: 'Heart',
    badge: '5 Obras',
    description: 'De Roupa Nova a Tom Jobim, Pixinguinha e o Choro brasileiro.',
  },
  {
    id: 'Pop & Rock Clássico',
    label: 'Pop & Rock Clássico (ABBA, Elton John & Beatles)',
    shortLabel: 'Pop/Rock',
    iconName: 'Disc',
    badge: '5 Obras',
    description: 'Os maiores hinos de piano pop e rock de todos os tempos.',
  },
  {
    id: 'Rock Anos 80 & New Wave',
    label: 'Rock Anos 80 & New Wave (a-ha & Eurythmics)',
    shortLabel: 'Anos 80 / New Wave',
    iconName: 'Zap',
    badge: '3 Obras',
    description: 'Riffs lendários de sintetizadores, pulso staccato e New Wave.',
  },
  {
    id: 'Infantis, Cirandas & Folclore',
    label: 'Infantis, Cirandas & Folclore Brasileiro',
    shortLabel: 'Infantis & Cirandas',
    iconName: 'Sparkles',
    badge: '4 Obras',
    description: 'Cirandas, cantigas de roda e melodias pedagógicas do folclore.',
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
    description: 'O hino universal da fraternidade da 9ª Sinfonia de Beethoven. Posição básica de 5 dedos (Dó a Sol) ideal para independência das mãos.',
    historicalContext: 'Composta por Beethoven em 1824 quando o mestre já estava totalmente surdo, tornou-se o Hino Oficial da União Europeia.',
    biomechanicsTip: 'Mantenha os 5 dedos apoiados sobre as teclas C4 a G4 com formato curvo de "maçã imaginária".',
    chords: ['C', 'G', 'Am', 'F'],
    scoreTrack: [
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'E4' },

      { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E4', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D4' },
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
    description: 'A melodia mais poética e famosa de Chopin. Toque cantabile com arpejos amplos e elegantes na mão esquerda.',
    historicalContext: 'Composta por Chopin entre 1830 e 1832 aos vinte anos de idade, dedicada a Marie Pleyel.',
    biomechanicsTip: 'O punho da mão direita deve "respirar" como um cantor de ópera (bel canto), mantendo o legato.',
    chords: ['Eb', 'Cm', 'Fm', 'Bb7'],
    scoreTrack: [
      { midi: 39, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'Bb4' },
      { midi: 79, clef: 'treble', duration: 1.5, beat: 2.5, measure: 1, fingerRightHand: 5, noteName: 'G5' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'F5' },
      { midi: 75, clef: 'treble', duration: 1, beat: 4.5, measure: 1, fingerRightHand: 3, noteName: 'Eb5' },

      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'C3', chordName: 'Cm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D5' },
      { midi: 75, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'Eb5' },
      { midi: 77, clef: 'treble', duration: 1.5, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F5' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 4.5, measure: 2, fingerRightHand: 1, noteName: 'Bb4', chordName: 'Bb7' },
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
    description: 'A peça de piano mais famosa de todos os tempos. Treine o toque perolado nos dedos 5 e 4 com arpejos suaves na mão esquerda.',
    historicalContext: 'Composta por Beethoven em 1810, dedicada a Therese Malfatti (o manuscrito ilegível foi transcrito erroneamente como Elise).',
    biomechanicsTip: 'Alterne os dedos 5 e 4 no semitom E5 e D#5 com o punho relaxado e dedos em arco. Não bata com força bruta.',
    chords: ['Am', 'E7', 'C', 'G'],
    scoreTrack: [
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'B4' },

      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'C5' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'A4', chordName: 'Am' },
      { midi: 45, clef: 'bass', duration: 0.5, beat: 2, measure: 2, fingerLeftHand: 5, noteName: 'A2' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 2.5, measure: 2, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 57, clef: 'bass', duration: 0.5, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A3' },
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
    description: 'A progressão harmônica mais influente da história ocidental. Conexão límpida de voz melódica sobre baixo contínuo.',
    historicalContext: 'Composta por volta de 1680 para três violinos e baixo contínuo, tornou-se a base estrutural de 80% das canções pop modernas.',
    biomechanicsTip: 'Distribua o peso da mão esquerda com firmeza na nota fundamental do baixo a cada início de compasso.',
    chords: ['C', 'G', 'Am', 'Em', 'F', 'C'],
    scoreTrack: [
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'D5', chordName: 'G' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2' },

      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C5', chordName: 'Am' },
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'B4', chordName: 'Em' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2' },
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
    description: 'Peça do Caderno de Anna Magdalena Bach. Treino clássico de dança barroca ternária e independência entre mãos.',
    historicalContext: 'Registrada no caderno de música da esposa de Bach em 1725, foi atribuída a Petzold e permanece um pilar da pedagogia pianística mundial.',
    biomechanicsTip: 'Destaque suave no tempo 1 do compasso e leveza nos tempos 2 e 3.',
    chords: ['G', 'D', 'Em', 'C'],
    scoreTrack: [
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'D5', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'C5' },

      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'D5' },
      { midi: 47, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B2' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'G4' },
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
    tonality: 'Lá Maior (A)',
    description: 'A balada mais emblemática do Roupa Nova e dos anos 80 no Brasil. Riff suave de piano com condução melódica inconfundível.',
    historicalContext: 'Lançada em 1985 no álbum Roupa Nova, tornou-se um dos maiores clássicos românticos da música brasileira.',
    biomechanicsTip: 'Toque com pulso flexível e transferindo o peso dos dedos com toque aveludado e expressivo.',
    chords: ['A', 'C#m7', 'D', 'E7'],
    scoreTrack: [
      // Compasso 1 ("Linda demais...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'D5' },
      { midi: 76, clef: 'treble', duration: 1.5, beat: 2.5, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 76, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'E5' },

      // Compasso 2 ("...perfeita aos olhos do Pai...")
      { midi: 49, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'C#3', chordName: 'C#m7' },
      { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'F#5' },
      { midi: 76, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'E5' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'D5' },
      { midi: 73, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'C#5' },

      // Compasso 3 ("...alguém igual a você...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'D3', chordName: 'D' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'D5' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'D5' },
      { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'C#5' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'B4' },

      // Compasso 4 ("...não vi jamais.")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'E2', chordName: 'E7' },
      { midi: 73, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'A4', chordName: 'A' },
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
    description: 'A canção brasileira mais executada no planeta. A síncopa suave da Bossa Nova com acordes enriquecidos de 7ª Maior e 9ª.',
    historicalContext: 'Composta em 1962 no bar Veloso em Ipanema inspirada por Helô Pinheiro, conquistou o Grammy de Gravação do Ano em 1965.',
    biomechanicsTip: 'Toque a melodia com leveza flutuante, sem atacar com peso excessivo na tecla.',
    chords: ['Fmaj7', 'G7', 'Gm7', 'C7'],
    scoreTrack: [
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },
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
    description: 'Considerada por muitos a obra-prima definitiva da música brasileira. Linha de baixo cromático descendente e métrica poética única.',
    historicalContext: 'Composta em 1972 no sítio de Poço Fundo em Petrópolis, imortalizada no dueto de Elis Regina e Tom Jobim em 1974.',
    biomechanicsTip: 'Acompanhe o balanço sincopado tocando o baixo no tempo 1 e antecipando as notas da melodia.',
    chords: ['Bb', 'Bbm/Ab', 'Eb/G', 'Ebm/Gb', 'Bb/F'],
    scoreTrack: [
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      { midi: 44, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'Ab2', chordName: 'Bbm/Ab' },
      { midi: 60, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 2.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'Bb3' },
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
    description: 'A mais bela página do Choro e da canção romântica brasileira. Condução lírica refinada com cromatismos melódicos encantadores.',
    historicalContext: 'Composta por Pixinguinha entre 1916 e 1917, recebeu a célebre letra de João de Barro (Braguinha) em 1937, eternizada por Orlando Silva.',
    biomechanicsTip: 'Toque com fraseado muito expressivo (cantabile), mantendo o legato na mão direita.',
    chords: ['F', 'Dm', 'Gm', 'C7', 'A7'],
    scoreTrack: [
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 3, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'E4' },

      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'A2', chordName: 'A7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
      { midi: 61, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C#4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 2, noteName: 'D4' },
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
    description: 'O segundo hino nacional brasileiro. A clássica melodia do sertão nordestino com ritmo contagiante de baião.',
    historicalContext: 'Gravada em 1947 pelo Rei do Baião Luiz Gonzaga, descreve a seca no sertão nordestino e a migração de retirantes.',
    biomechanicsTip: 'Melodia ideal para treinar a articulação clara dos dedos 1, 2, 3 e 5 da mão direita.',
    chords: ['C', 'F', 'G7', 'C'],
    scoreTrack: [
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F4' },
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
    description: 'O piano pop mais brilhante e icônico da era Disco. Riff sincopado com glissando e batida dançante contagiante.',
    historicalContext: 'Lançada em 1976 no álbum Arrival, chegou ao topo das paradas em mais de 15 países e é a canção assinatura do ABBA.',
    biomechanicsTip: 'Toque com entusiasmo rítmico, mantendo o pulso solto para os arpejos da mão direita.',
    chords: ['A', 'D/A', 'F#m7', 'E'],
    scoreTrack: [
      // Compasso 1 ("You can dance, you can jive...")
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 73, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'A4' },

      { midi: 38, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 4, noteName: 'D2', chordName: 'D/A' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'D5' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 5, noteName: 'F#5' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'D5' },

      // Compasso 2 ("...having the time of your life!")
      { midi: 42, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F#2', chordName: 'F#m7' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C#5' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'B4' },

      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'A4' },
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
    description: 'A balada de piano pop definitiva de Elton John. Arpejos límpidos e condução harmônica que todo pianista deve dominar.',
    historicalContext: 'Lançada em 1970 no álbum homônimo de Elton John, gravada no lendário estúdio Trident de Londres.',
    biomechanicsTip: 'Mão esquerda faz a fundamental e quinta enquanto a mão direita arpeja suavemente em semínimas.',
    chords: ['C', 'Fmaj7', 'G/B', 'Em'],
    scoreTrack: [
      // Compasso 1 ("It's a little bit funny...")
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 2 ("...this feeling inside...")
      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 3 ("I'm not one of those who can easily hide...")
      { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'B2', chordName: 'G/B' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },
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
    description: 'O riff de piano mais emblemático da história do rock. Treine o balanço quaternário e a passagem de C para Cmaj7 e F.',
    historicalContext: 'Lançada em 1971 no álbum homônimo, gravada no piano de cauda branco Steinway na mansão de Tittenhurst Park.',
    biomechanicsTip: 'Mantenha o polegar da mão direita no Dó enquanto os outros dedos abrem o intervalo de terça e quinta.',
    chords: ['C', 'Cmaj7', 'F'],
    scoreTrack: [
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4', chordName: 'Cmaj7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A4' },

      { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'C5' },
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
    description: 'A progressão I - V - vi - IV em sua forma mais pura. Toque os acordes em blocos sólidos com condução de voz equilibrada.',
    historicalContext: 'Composta por Paul McCartney em 1968 após sonhar com sua mãe Mary ("Mother Mary comes to me"), faixa-título do último álbum dos Beatles.',
    biomechanicsTip: 'Utilize o Dedo Âncora ao mudar de C para F para não deslocar a mão pelo ar.',
    chords: ['C', 'G', 'Am', 'F'],
    scoreTrack: [
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'B3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },

      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'F2', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A4' },
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
    description: 'A introdução de piano de rock operístico mais famosa do mundo. Arpejos fluidos com dedilhado de concertista.',
    historicalContext: 'Lançada em 1975 no álbum A Night at the Opera. Freddie Mercury tocou em um piano de cauda Bechstein.',
    biomechanicsTip: 'Mão esquerda cruza em oitavas graves com pulso leve e pedal de sustain sincopado.',
    chords: ['Bb', 'Gm', 'Cm', 'F7'],
    scoreTrack: [
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'Bb4' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'Eb4' },
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
    description: 'O riff de sintetizador mais icônico da New Wave e dos anos 80. Linha rítmica saltitante que exige agilidade na mão direita.',
    historicalContext: 'Composta por Magne Furuholmen e Morten Harket em 1984, imortalizada pelo clipe de animação rotoscópica premiado mundialmente.',
    biomechanicsTip: 'Ataque com pontas dos dedos e antebraço elástico para manter o andamento New Wave.',
    chords: ['Bm', 'E', 'A', 'D'],
    scoreTrack: [
      // Compasso 1 (Riff lendário parte 1)
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

      // Compasso 2 (Riff parte 2: subida para A e B)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A2', chordName: 'A' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 5, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'A4' },

      { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'D3', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'F#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'E4' },
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
    description: 'O riff mais hipnótico do Synth Pop dos anos 80. Padrão contínuo de colcheias em Dó Menor com passagem para Lá Bemol e Sol.',
    historicalContext: 'Composta em 1983 em Londres com sintetizadores analógicos Roland SH-101 e Movement Systems Drum Computer.',
    biomechanicsTip: 'Toque com o polegar servindo de pivô no C4 enquanto os dedos 3 e 5 atacam as notas agudas.',
    chords: ['Cm', 'Ab', 'G'],
    scoreTrack: [
      { midi: 36, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'Cm' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 63, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 1, noteName: 'C4' },

      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'Ab4', chordName: 'Ab' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 4, noteName: 'G4', chordName: 'G' },
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
    description: 'O groove de piano staccato mais cativante dos anos 80. Ataque rítmico preciso com mão esquerda em oitavas sincopadas.',
    historicalContext: 'Criada em 1981 por Jonathan Cain e Steve Perry, tornou-se o maior hino de arenas esportivas e do rock melódico.',
    biomechanicsTip: 'Toque staccato com os dedos firmes e o antebraço saltando suavemente para dar propulsão rítmica.',
    chords: ['E', 'B/D#', 'C#m', 'A'],
    scoreTrack: [
      { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'G#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      { midi: 39, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'D#2', chordName: 'B/D#' },
      { midi: 63, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D#4' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F#4' },

      { midi: 37, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'C#2', chordName: 'C#m' },
      { midi: 61, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },

      { midi: 33, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 61, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'E4' },
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
    description: 'A ciranda mais amada do cancioneiro infantil brasileiro. Perfeita para os primeiros passos na leitura de partitura fluida.',
    historicalContext: 'Cantiga de roda de domínio público transmitida oralmente por gerações de crianças em todo o Brasil.',
    biomechanicsTip: 'Dedos 1, 2, 3, 4 e 5 descansando sobre C4, D4, E4, F4, G4. Não levante o punho.',
    chords: ['C', 'G7', 'C'],
    scoreTrack: [
      // Compasso 1 ("Ciranda, cirandinha...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 2 ("...vamos todos cirandar...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },
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
    description: 'Cantiga tradicional em compasso ternário (3/4). Pratique a acentuação do primeiro tempo da valsa infantil.',
    historicalContext: 'Tema folclórico tradicional de roda, adaptado por mestres da música brasileira como Heitor Villa-Lobos em seu Guia Prático.',
    biomechanicsTip: 'Toque o tempo 1 com apoio suave do peso do braço e os tempos 2 e 3 com toques leves.',
    chords: ['C', 'G7', 'C'],
    scoreTrack: [
      // Compasso 1 ("O cravo brigou...")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 ("...com a rosa...")
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 3 ("...debaixo de uma sacada...")
      { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'A4' },

      // Compasso 4 ("...o cravo saiu ferido.")
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'G4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },
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
    description: 'Cantiga folclórica de Minas Gerais e canção símbolo do presidente Juscelino Kubitschek. Ritmo alegre e melodia acolhedora.',
    historicalContext: 'Canção tradicional dos seresteiros de Diamantina (MG), adotada como hino afetivo nacional.',
    biomechanicsTip: 'Dedos 5, 4, 3, 2, 1 atacando com as pontas e sem tensão no polegar.',
    chords: ['C', 'G7', 'C'],
    scoreTrack: [
      // Compasso 1 ("Como pode um peixe vivo...")
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
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'E4', chordName: 'C' },
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
    description: 'A mais tradicional cantiga de festa junina e infância brasileira. Movimento de terças e graus conjuntos perfeito para fixação das notas.',
    historicalContext: 'Cantiga folclórica de celebração do ciclo junino (Santo Antônio, São João e São Pedro) entoada em todo o território nacional.',
    biomechanicsTip: 'Exercite o salto de terça de Sol para Mi com os dedos 5 e 3.',
    chords: ['C', 'G7', 'C'],
    scoreTrack: [
      // Compasso 1 ("Cai, cai, balão, cai, cai, balão...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 2 ("...aqui na minha mão...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 3 ("Não cai não, não cai não, não cai não...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 4 ("...cai na rua do sabão.")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
    ],
  },
];
