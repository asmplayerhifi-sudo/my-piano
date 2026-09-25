import type { RepertoireSong } from '../repertoireData';

export const DIGA_PRA_MIM_ZEZO: RepertoireSong = {
    id: 'diga-pra-mim-zezo',
    title: 'Diga Pra Mim (Seresta & Teclado do Zezo)',
    composerOrArtist: 'Zezo dos Teclados / Seresta & Brega Clássico',
    genre: 'Seresta & Brega (Zezo dos Teclados)',
    difficulty: 'Iniciante',
    recommendedBpm: 86,
    timeSignature: '4/4',
    tonality: 'Lá Menor (Am) / Dó Maior (C)',
    description: 'Arranjo com o solo característico de introdução em teclado arranjador brega, pulso dançante de seresta romântica e harmonia envolvente.',
    historicalContext: 'Zezo dos Teclados (O Príncipe dos Teclados) construiu um império da seresta no Nordeste e em todo o Brasil com versões apaixonadas de sucessos românticos.',
    biomechanicsTip: 'Toque o solo melódico da mão direita com expressividade e legato; mantenha o baixo da mão esquerda firme nos tempos 1 e 3 da seresta.',
    chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7'],
    scoreTrack: [
      // Compasso 1 (Intro Melódica do Teclado Am)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E4' },

      // Compasso 2 (Fraseio de seresta)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 3 (Passagem para Dm)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'D2', chordName: 'Dm' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'A3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'D4' },

      // Compasso 4 (Resposta melódica Dm)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'C4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'Bb3' },

      // Compasso 5 (Harmonia em Sol Maior G)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'D4' },

      // Compasso 6 (Resolução em Dó Maior C)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'A3' },

      // Compasso 7 (Acorde Fá Maior F)
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'F3' },

      // Compasso 8 (Dominante E7 com sensível G#)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'E3' },
      { midi: 68, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'G#3' },

      // Compasso 9 (Início do Canto: "Diga pra mim...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 4, noteName: 'C4' },

      // Compasso 10 ("...onde foi que eu errei...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 11 ("...se o amor que te dei...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 11, fingerRightHand: 3, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 4, noteName: 'D4' },

      // Compasso 12 ("...não foi suficiente...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 13 ("...pra você me amar...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 14 ("...e querer ficar...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
      { midi: 68, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'B3' },

      // Compasso 15 (Preparação apaixonada para o final)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 4, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 5, noteName: 'E4' },

      // Compasso 16 (Acorde Final Lá Menor Am Sustentado)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 57, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A2' },
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'A3' },
    ],
  };
