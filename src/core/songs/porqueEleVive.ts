import type { RepertoireSong } from '../repertoireData';

export const PORQUE_ELE_VIVE: RepertoireSong = {
    id: 'porque-ele-vive',
    title: 'Porque Ele Vive (Because He Lives)',
    composerOrArtist: 'Bill & Gloria Gaither',
    genre: 'Gospel Clássico & Sacro',
    difficulty: 'Intermediário',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Sol Maior (G)',
    description: 'Hino solene e imortal da música cristã sacra mundial, transcrito em arranjo coral polifônico de teclado com baixos nobres e melodia reverente.',
    historicalContext: 'Composto em 1971 pelo casal Bill e Gloria Gaither nos Estados Unidos. Tornou-se um dos hinos mais cantados em todas as denominações cristãs do planeta.',
    biomechanicsTip: 'Utilize o modo de sustain de acordes para manter as notas da harmonia vivas enquanto a mão direita projeta o soprano com doçura e autoridade.',
    chords: ['G', 'C', 'D7', 'Em', 'Am7', 'B7'],
    scoreTrack: [
      // Compasso 1 ("Deus enviou...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G2' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'D3' },

      // Compasso 2 ("...Seu Filho amado...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'G3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'F#3' },

      // Compasso 3 ("...pra perdoar...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 4 ("...pra me salvar...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 3, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'D3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 5 ("Na cruz morreu...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 6 ("...por meus pecados...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'G3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 7 ("Mas ressurgiu...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am7' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'F#3' },

      // Compasso 8 ("...e vivo com o Pai está!")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 9 (Refrão Glorioso: "Porque Ele vive...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 10 ("...posso crer no amanhã...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 11 ("Porque Ele vive...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 12 ("...temor não há!")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 62, clef: 'treble', duration: 3, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 12, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 13 ("Mas eu bem sei...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 14 ("...eu sei que a minha vida...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'B3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 14, fingerRightHand: 5, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'B3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 15 ("...está nas mãos do meu Jesus, que vivo está!")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 1, noteName: 'D2', chordName: 'D7' },
      { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 2, noteName: 'F#3' },

      // Compasso 16 (Acorde Pleno de Sol Maior G Sustentado)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'G2' },
      { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'G3' },
    ],
  };
