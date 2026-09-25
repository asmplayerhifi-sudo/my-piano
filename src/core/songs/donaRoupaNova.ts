import type { RepertoireSong } from '../repertoireData';

export const DONA_ROUPA_NOVA: RepertoireSong = {
    id: 'dona-roupa-nova',
    title: 'Dona (Dona Desses Olhos Incandescentes)',
    composerOrArtist: 'Sá & Guarabyra / Roupa Nova',
    genre: 'MPB & Pop Nacional',
    difficulty: 'Intermediário',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Sol Maior (G)',
    description: 'A emblemática balada do Roupa Nova com sua inconfundível introdução lírica de piano elétrico, acordes arpejados e melodia apaixonada.',
    historicalContext: 'Lançada em 1985 pelo grupo Roupa Nova, escrita por Sá & Guarabyra. Tornou-se um marco da teledramaturgia brasileira como tema da Viúva Porcina em Roque Santeiro.',
    biomechanicsTip: 'Toque as notas da mão esquerda sustentadas no pedal de acorde; mão direita deve dedilhar os arpejos com relaxamento total do punho.',
    chords: ['G', 'Em', 'C', 'D', 'Am'],
    scoreTrack: [
      // Compasso 1 (Intro de Piano: Sol Maior G)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G2' },
      { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G3' },

      // Compasso 2 (Intro: Mi Menor Em)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 55, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'G2' },
      { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'B2' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'E3' },

      // Compasso 3 (Dó Maior C)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 55, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'G2' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'E3' },

      // Compasso 4 (Ré Maior D)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 57, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'A2' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'D3' },
      { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'F#3' },

      // Compasso 5 ("Dona...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 6 ("...desses olhos incandescentes...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 1, noteName: 'D3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 7 ("...dona desse riso espantoso...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 4, noteName: 'G3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 2.5, measure: 7, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 7, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 8 ("...e desse cheiro de flor...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'D3' },
      { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 4, noteName: 'F#3' },

      // Compasso 9 ("Dona dos meus pensamentos...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 5, noteName: 'B3' },

      // Compasso 10 ("...meus anseios e meus medos...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 11 ("...dona de tudo que sou...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'G3' },

      // Compasso 12 ("...dona do meu grande amor...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 13 (Refrão: "Não se esqueça...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 14 ("...de que um dia...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 15 ("...tudo isso foi por você...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 16 (Acorde Final Sol Maior G com Sustain Aveludado)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'G2' },
      { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'G3' },
    ],
  };
