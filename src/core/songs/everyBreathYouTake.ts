import type { RepertoireSong } from '../repertoireData';

export const EVERY_BREATH_YOU_TAKE: RepertoireSong = {
    id: 'every-breath-you-take',
    title: 'Every Breath You Take (Riff New Wave)',
    composerOrArtist: 'The Police / Sting',
    genre: 'Rock Anos 80 & New Wave',
    difficulty: 'Intermediário',
    recommendedBpm: 112,
    timeSignature: '4/4',
    tonality: 'Sol Maior (G)',
    description: 'O riff mais famoso dos anos 80, arpejado em colcheias estritas na progressão I - vi - IV - V com baixo pulsante e síncope New Wave.',
    historicalContext: 'Lançada em 1983 no álbum Synchronicity do The Police. Liderou a Billboard por 8 semanas consecutivas e é uma das canções mais executadas da história do rádio.',
    biomechanicsTip: 'Mantenha os dedos da mão direita curvos e precisos nas colcheias arpejadas; mão esquerda deve pulsar com vigor nas notas fundamentais.',
    chords: ['G', 'Em', 'C', 'D'],
    scoreTrack: [
      // Compasso 1 (Riff G)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G2' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 5, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'D3' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'B2' },

      // Compasso 2 (Riff G continuação)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'G2' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 2, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 5, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'G3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D3' },

      // Compasso 3 (Riff Em)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 52, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'E2' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'B2' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 5, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'E3' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 2, noteName: 'B2' },
      { midi: 55, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'G2' },

      // Compasso 4 (Riff Em continuação)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 52, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E2' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'B2' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 5, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'E3' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'B2' },

      // Compasso 5 (Riff C)
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C3' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 5, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 5, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'E3' },

      // Compasso 6 (Riff D)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 1, measure: 6, fingerRightHand: 1, noteName: 'D3' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 6, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 6, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 4, noteName: 'A3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'F#3' },

      // Compasso 7 ("Every breath you take...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 7, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 7, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 8 ("...and every move you make...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 8, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 3.5, measure: 8, fingerRightHand: 3, noteName: 'G3' },

      // Compasso 9 ("Every bond you break...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 10 ("...every step you take...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 11 ("I'll be watching you...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 11, fingerRightHand: 1, noteName: 'D3' },
      { midi: 59, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 1, noteName: 'B2' },

      // Compasso 12 (Ponte: "Oh, can't you see...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 12, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 12, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 13 ("...you belong to me...")
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 2, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 14 ("How my poor heart aches...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 14, fingerRightHand: 2, noteName: 'G3' },
      { midi: 66, clef: 'treble', duration: 1.5, beat: 3.5, measure: 14, fingerRightHand: 1, noteName: 'F#3' },

      // Compasso 15 ("...with every step you take...")
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 16 (Acorde Final Sol Maior G Sustentado)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'G2' },
      { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'B2' },
      { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'D3' },
      { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'G3' },
    ],
  };
