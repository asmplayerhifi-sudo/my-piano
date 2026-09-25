import type { RepertoireSong } from '../repertoireData';

export const XOTE_DAS_MENINAS: RepertoireSong = {
    id: 'xote-das-meninas',
    title: 'O Xote das Meninas (Mandacaru Quando Fulora)',
    composerOrArtist: 'Luiz Gonzaga & Zé Dantas',
    genre: 'Forró, Xote & Baião',
    difficulty: 'Intermediário',
    recommendedBpm: 90,
    timeSignature: '4/4',
    tonality: 'Ré Menor (Dm) / Fá Maior (F)',
    description: 'Um dos maiores clássicos do forró pé-de-serra brasileiro, com a melodia de sanfona adaptada para piano com síncopes nordestinas e baixo característico.',
    historicalContext: 'Composta em 1953 pela genial parceria entre o Rei do Baião Luiz Gonzaga e Zé Dantas. Retrata a poesia da transformação da menina sertaneja ao som do xote.',
    biomechanicsTip: 'Mão esquerda executa o balanço de xote alternando o baixo no tempo 1 e 3; mão direita faz as frases sincopadas com agilidade.',
    chords: ['Dm', 'A7', 'Gm', 'C7', 'F'],
    scoreTrack: [
      // Compasso 1 (Intro de Xote Dm)
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'A3' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'D4' },

      // Compasso 2 ("Mandacaru...")
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 3 ("...quando fulora na seca...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'A1', chordName: 'A7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'A3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'G3' },

      // Compasso 4 ("...é o sinal que a chuva chega no sertão...")
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'E3' },
      { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'D3' },

      // Compasso 5 ("Toda menina que enjoa da boneca...")
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'A3' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 3.5, measure: 5, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 6 ("...é sinal que o amor já chegou no coração...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'A1', chordName: 'A7' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'A3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'F3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 7 ("Meia comprida não quer mais sapato baixo...")
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'D3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 8 ("...vestido bem cintado, não quer mais vestir timão...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 1, noteName: 'A1', chordName: 'A7' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 8, fingerRightHand: 1, noteName: 'F3' },

      // Compasso 9 ("Ela só quer, só pensa em namorar...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 5, noteName: 'C4' },

      // Compasso 10 ("...ela só quer, só pensa em namorar...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 1, noteName: 'F3' },

      // Compasso 11 ("De manhã cedo já tá pintada...")
      { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'F1', chordName: 'F' },
      { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'C4' },

      // Compasso 12 ("...só pensa em namorar...")
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'C2', chordName: 'C7' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 2, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'F3' },

      // Compasso 13 (Transição para o Dm)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 3, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'D4' },

      // Compasso 14 ("Mas o pai dela não quer deixar...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 4, noteName: 'Bb3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 15 (Cadência Final Dm)
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'D3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 2, noteName: 'F3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 16 (Acorde Final Ré Menor Sustentado)
      { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 57, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A2' },
      { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'D3' },
      { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'F3' },
    ],
  };
