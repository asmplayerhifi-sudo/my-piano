import type { ScoreNote } from './coursesData';

export type SongGenre = 'Clássico' | 'Rock Clássico' | 'MPB & Bossa Nova';

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
  // 1. MÚSICA CLÁSSICA
  // =========================================================================
  {
    id: 'fur-elise',
    title: 'Für Elise (Para Elise - WoO 59)',
    composerOrArtist: 'Ludwig van Beethoven',
    genre: 'Clássico',
    difficulty: 'Intermediário',
    recommendedBpm: 120,
    timeSignature: '3/8',
    tonality: 'Lá Menor (Am)',
    description: 'A peça de piano mais famosa de todos os tempos. Treine o toque perolado nos dedos 5 e 4 com arpejos suaves na mão esquerda.',
    historicalContext: 'Composta por Beethoven em 1810, dedicada a Therese Malfatti (o manuscrito ilegível foi transcrito erroneamente como Elise).',
    biomechanicsTip: 'Alterne os dedos 5 e 4 no semitom E5 e D#5 com o punho relaxado e dedos em arco. Não bata com força bruta.',
    chords: ['Am', 'E7', 'C', 'G'],
    scoreTrack: [
      // Compasso 1 (Anacruse / Início do tema)
      { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'B4' },

      // Compasso 2
      { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'C5' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'A4', chordName: 'Am' },
      { midi: 45, clef: 'bass', duration: 0.5, beat: 2, measure: 2, fingerLeftHand: 5, noteName: 'A2' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 2.5, measure: 2, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 57, clef: 'bass', duration: 0.5, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A3' },

      // Compasso 3
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 3, fingerRightHand: 5, noteName: 'B4', chordName: 'E7' },
      { midi: 40, clef: 'bass', duration: 0.5, beat: 2.5, measure: 3, fingerLeftHand: 5, noteName: 'E2' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 3, measure: 3, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 56, clef: 'bass', duration: 0.5, beat: 3.5, measure: 3, fingerLeftHand: 1, noteName: 'G#3' },

      // Compasso 4
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 3, noteName: 'G#4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 2.5, measure: 4, fingerRightHand: 5, noteName: 'C5', chordName: 'Am' },
      { midi: 45, clef: 'bass', duration: 0.5, beat: 2.5, measure: 4, fingerLeftHand: 5, noteName: 'A2' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 3, measure: 4, fingerLeftHand: 3, noteName: 'E3' },
      { midi: 57, clef: 'bass', duration: 0.5, beat: 3.5, measure: 4, fingerLeftHand: 1, noteName: 'A3' },
    ],
  },
  {
    id: 'ode-to-joy',
    title: 'Ode à Alegria (9ª Sinfonia)',
    composerOrArtist: 'Ludwig van Beethoven',
    genre: 'Clássico',
    difficulty: 'Iniciante',
    recommendedBpm: 84,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'O hino universal da fraternidade. Posição de 5 dedos fixa para desenvolver toque legato contínuo e sincronia com baixos fundamentais.',
    historicalContext: 'Movimento final da monumental 9ª Sinfonia de Beethoven (1824), composta quando o mestre já estava completamente surdo.',
    biomechanicsTip: 'Mantenha os 5 dedos apoiados sobre as teclas C4 a G4 sem levantar a palma da mão.',
    chords: ['C', 'G', 'Am', 'F'],
    scoreTrack: [
      // Compasso 1
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 3
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'E4' },

      // Compasso 4
      { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E4', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D4' },
    ],
  },
  {
    id: 'canon-in-d',
    title: 'Canon em Ré (Pachelbel\'s Canon)',
    composerOrArtist: 'Johann Pachelbel',
    genre: 'Clássico',
    difficulty: 'Intermediário',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Dó Maior (Adaptação Didática)',
    description: 'A progressão harmônica mais influente da história ocidental. Conexão límpida de voz melódica sobre baixo contínuo.',
    historicalContext: 'Composta por volta de 1680 para três violinos e baixo contínuo, tornou-se a base estrutural de 80% das canções pop modernas.',
    biomechanicsTip: 'Distribua o peso da mão esquerda com firmeza na nota fundamental do baixo a cada início de compasso.',
    chords: ['C', 'G', 'Am', 'Em', 'F', 'C'],
    scoreTrack: [
      // Compasso 1 (C e G)
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'D5', chordName: 'G' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2' },

      // Compasso 2 (Am e Em)
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C5', chordName: 'Am' },
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'B4', chordName: 'Em' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E2' },

      // Compasso 3 (F e C)
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'A4', chordName: 'F' },
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'F2' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'G4', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'C3' },

      // Compasso 4 (F e G)
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A4', chordName: 'F' },
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'F2' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'B4', chordName: 'G' },
      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 1, noteName: 'G2' },
    ],
  },
  {
    id: 'minuet-in-g',
    title: 'Minueto em Sol Maior (BWV Anh. 114)',
    composerOrArtist: 'Christian Petzold / J.S. Bach',
    genre: 'Clássico',
    difficulty: 'Iniciante',
    recommendedBpm: 100,
    timeSignature: '3/4',
    tonality: 'Sol Maior (G)',
    description: 'Peça do Caderno de Anna Magdalena Bach. Treino clássico de dança barroca ternária e independência entre mãos.',
    historicalContext: 'Registrada no caderno de música da esposa de Bach em 1725, foi atribuída a Petzold e permanece um pilar da pedagogia pianística mundial.',
    biomechanicsTip: 'Destaque suave no tempo 1 do compasso e leveza nos tempos 2 e 3.',
    chords: ['G', 'D', 'Em', 'C'],
    scoreTrack: [
      // Compasso 1
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'D5', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'G4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'C5' },

      // Compasso 2
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'D5' },
      { midi: 47, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B2' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'G4' },

      // Compasso 3
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'C5', chordName: 'C' },
      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'C3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 5, noteName: 'D5' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 4, noteName: 'C5' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'B4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 2, noteName: 'A4' },

      // Compasso 4
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'B4', chordName: 'G' },
      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'G4' },
    ],
  },

  // =========================================================================
  // 2. ROCK CLÁSSICO
  // =========================================================================
  {
    id: 'imagine',
    title: 'Imagine',
    composerOrArtist: 'John Lennon',
    genre: 'Rock Clássico',
    difficulty: 'Iniciante',
    recommendedBpm: 76,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'O riff de piano mais emblemático da história do rock. Treine o balanço quaternário e a passagem de C para Cmaj7 e F.',
    historicalContext: 'Lançada em 1971 no álbum homônimo, gravada no piano de cauda branco Steinway na mansão de Tittenhurst Park.',
    biomechanicsTip: 'Mantenha o polegar da mão direita no Dó enquanto os outros dedos abrem o intervalo de terça e quinta.',
    chords: ['C', 'Cmaj7', 'F'],
    scoreTrack: [
      // Compasso 1 (C para Cmaj7)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4', chordName: 'Cmaj7' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 (F e riff melódico)
      { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A4' },

      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A4' },

      // Riffzinho clássico de passagem no tempo 3 e 4
      { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'A4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'B4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'C5' },
    ],
  },
  {
    id: 'let-it-be',
    title: 'Let It Be',
    composerOrArtist: 'The Beatles / Paul McCartney',
    genre: 'Rock Clássico',
    difficulty: 'Iniciante',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'A progressão I - V - vi - IV em sua forma mais pura. Toque os acordes em blocos sólidos com condução de voz equilibrada.',
    historicalContext: 'Composta por Paul McCartney em 1968 após sonhar com sua mãe Mary ("Mother Mary comes to me"), faixa-título do último álbum dos Beatles.',
    biomechanicsTip: 'Utilize o Dedo Âncora ao mudar de C para F para não deslocar a mão pelo ar.',
    chords: ['C', 'G', 'Am', 'F'],
    scoreTrack: [
      // Compasso 1 (C e G)
      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'B3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'B3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 (Am e F)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },

      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'A4' },

      { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'F2', chordName: 'F' },
      { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A4' },

      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 3, noteName: 'F4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'A4' },
    ],
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Bohemian Rhapsody (Balada Inicial)',
    composerOrArtist: 'Queen / Freddie Mercury',
    genre: 'Rock Clássico',
    difficulty: 'Avançado',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Si Bemol Maior (B♭)',
    description: 'A introdução de piano de rock operístico mais famosa do mundo. Arpejos fluidos com dedilhado de concertista.',
    historicalContext: 'Lançada em 1975 no álbum A Night at the Opera. Freddie Mercury tocou em um piano de cauda Bechstein.',
    biomechanicsTip: 'Mão esquerda cruza em oitavas graves com pulso leve e pedal de sustain sincopado.',
    chords: ['Bb', 'Gm', 'Cm', 'F7'],
    scoreTrack: [
      // Compasso 1 (Bb)
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'Bb4' },

      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'Bb4' },

      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'F4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'Bb4' },

      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'F4' },

      // Compasso 2 (Melodia da voz: "Mama, just killed a man...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'F4' },
      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'Eb4' },
    ],
  },
  {
    id: 'dont-stop-believin',
    title: 'Don\'t Stop Believin\'',
    composerOrArtist: 'Journey / Jonathan Cain',
    genre: 'Rock Clássico',
    difficulty: 'Intermediário',
    recommendedBpm: 118,
    timeSignature: '4/4',
    tonality: 'Mi Maior (E)',
    description: 'O groove de piano staccato mais cativante dos anos 80. Ataque rítmico preciso com mão esquerda em oitavas sincopadas.',
    historicalContext: 'Criada em 1981 por Jonathan Cain e Steve Perry, tornou-se o maior hino de arenas esportivas e do rock melódico.',
    biomechanicsTip: 'Toque staccato com os dedos firmes e o antebraço saltando suavemente para dar propulsão rítmica.',
    chords: ['E', 'B/D#', 'C#m', 'A'],
    scoreTrack: [
      // Compasso 1 (E e B)
      { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'G#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'G#4' },

      { midi: 39, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'D#2', chordName: 'B/D#' },
      { midi: 63, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D#4' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F#4' },

      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D#4' },

      // Compasso 2 (C#m e A)
      { midi: 37, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'C#2', chordName: 'C#m' },
      { midi: 61, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G#4' },

      { midi: 33, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 61, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'E4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A4' },
    ],
  },

  // =========================================================================
  // 3. MPB & BOSSA NOVA
  // =========================================================================
  {
    id: 'garota-de-ipanema',
    title: 'Garota de Ipanema (The Girl from Ipanema)',
    composerOrArtist: 'Antônio Carlos Jobim & Vinicius de Moraes',
    genre: 'MPB & Bossa Nova',
    difficulty: 'Intermediário',
    recommendedBpm: 120,
    timeSignature: '4/4',
    tonality: 'Fá Maior (F)',
    description: 'A canção brasileira mais executada no planeta. A síncopa suave da Bossa Nova com acordes enriquecidos de 7ª Maior e 9ª.',
    historicalContext: 'Composta em 1962 no bar Veloso em Ipanema inspirada por Helô Pinheiro, conquistou o Grammy de Gravação do Ano em 1965.',
    biomechanicsTip: 'Toque a melodia com leveza flutuante, sem atacar com peso excessivo na tecla.',
    chords: ['Fmaj7', 'G7', 'Gm7', 'C7'],
    scoreTrack: [
      // Compasso 1 ("Olha que coisa mais linda...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 2 ("...mais cheia de graça...")
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 3 ("...é ela menina que vem e que passa...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'G2', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'C4' },

      // Compasso 4 ("...num doce balanço a caminho do mar.")
      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C7' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'D4' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'F4' },
    ],
  },
  {
    id: 'aguas-de-marco',
    title: 'Águas de Março',
    composerOrArtist: 'Antônio Carlos Jobim',
    genre: 'MPB & Bossa Nova',
    difficulty: 'Intermediário',
    recommendedBpm: 126,
    timeSignature: '4/4',
    tonality: 'Si Bemol Maior (B♭)',
    description: 'Considerada por muitos a obra-prima definitiva da música brasileira. Linha de baixo cromático descendente e métrica poética única.',
    historicalContext: 'Composta em 1972 no sítio de Poço Fundo em Petrópolis, imortalizada no dueto de Elis Regina e Tom Jobim em 1974.',
    biomechanicsTip: 'Acompanhe o balanço sincopado tocando o baixo no tempo 1 e antecipando as notas da melodia.',
    chords: ['Bb', 'Bbm/Ab', 'Eb/G', 'Ebm/Gb', 'Bb/F'],
    scoreTrack: [
      // Compasso 1 ("É pau, é pedra...")
      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'Bb2', chordName: 'Bb' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

      // Compasso 2 ("...é o fim do caminho...")
      { midi: 44, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'Ab2', chordName: 'Bbm/Ab' },
      { midi: 60, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 2.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'Bb3' },

      // Compasso 3 ("...é um resto de toco...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'G2', chordName: 'Eb/G' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'F4' },
      { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'Eb4' },

      // Compasso 4 ("...é um pouco sozinho.")
      { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 2, noteName: 'Gb2', chordName: 'Ebm/Gb' },
      { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
      { midi: 58, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'Bb3' },
    ],
  },
  {
    id: 'asa-branca',
    title: 'Asa Branca',
    composerOrArtist: 'Luiz Gonzaga & Humberto Teixeira',
    genre: 'MPB & Bossa Nova',
    difficulty: 'Iniciante',
    recommendedBpm: 92,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'O segundo hino nacional brasileiro. A clássica melodia do sertão nordestino com ritmo contagiante de baião.',
    historicalContext: 'Gravada em 1947 pelo Rei do Baião Luiz Gonzaga, descreve a seca no sertão nordestino e a migração de retirantes.',
    biomechanicsTip: 'Melodia ideal para treinar a articulação clara dos dedos 1, 2, 3 e 5 da mão direita.',
    chords: ['C', 'F', 'G7', 'C'],
    scoreTrack: [
      // Compasso 1 ("Quando olhei a terra ardendo...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 2 ("...qual fogueira de São João...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F4' },

      // Compasso 3 ("...eu perguntei a Deus do céu, ai...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'D4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      // Compasso 4 ("...por que tamanha judiação.")
      { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'G2', chordName: 'G7' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'F4' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'E4' },
      { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },
    ],
  },
  {
    id: 'carinhoso',
    title: 'Carinhoso',
    composerOrArtist: 'Pixinguinha & João de Barro',
    genre: 'MPB & Bossa Nova',
    difficulty: 'Avançado',
    recommendedBpm: 68,
    timeSignature: '2/4',
    tonality: 'Fá Maior (F)',
    description: 'A mais bela página do Choro e da canção romântica brasileira. Condução lírica refinada com cromatismos melódicos encantadores.',
    historicalContext: 'Composta por Pixinguinha entre 1916 e 1917, recebeu a célebre letra de João de Barro (Braguinha) em 1937, eternizada por Orlando Silva.',
    biomechanicsTip: 'Toque com fraseado muito expressivo (cantabile), mantendo o legato na mão direita.',
    chords: ['F', 'Dm', 'Gm', 'C7', 'A7'],
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
      { midi: 46, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'Bb2', chordName: 'Gm' },
      { midi: 70, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'Bb4' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 4, noteName: 'A4' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'G4' },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 2, noteName: 'F4' },

      // Compasso 4 ("...quando te vê.")
      { midi: 36, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C7' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E4' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'F4' },
    ],
  },
];
