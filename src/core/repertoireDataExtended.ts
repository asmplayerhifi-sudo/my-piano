/**
 * repertoireDataExtended.ts
 * Obras complementares do Repertório:
 * - Reggae (Three Little Birds - Bob Marley)
 * - Forró, Xote & Baião (O Xote das Meninas - Luiz Gonzaga)
 * - Seresta & Brega (Diga Pra Mim - Zezo dos Teclados)
 * - Gospel Clássico (Porque Ele Vive - Bill & Gloria Gaither)
 * - Roupa Nova (Dona - Roupa Nova)
 * - Rock Anos 80 & New Wave (Every Breath You Take - The Police)
 */

import type { RepertoireSong } from './repertoireData';

export const EXTENDED_REPERTOIRE_SONGS: RepertoireSong[] = [
  // =========================================================================
  // 1. REGGAE & PRAIEIRO: Three Little Birds (Bob Marley & The Wailers)
  // =========================================================================
  {
    id: 'three-little-birds',
    title: 'Three Little Birds (Don\'t Worry About a Thing)',
    composerOrArtist: 'Bob Marley & The Wailers',
    genre: 'Reggae & Praieiro',
    difficulty: 'Iniciante',
    recommendedBpm: 74,
    timeSignature: '4/4',
    tonality: 'Lá Maior (A)',
    description: 'O clássico supremo do reggae jamaicano com a batida sincopada no contratempo (skank de piano nos tempos 2 e 4), baixo melódico e melodia leve e alegre.',
    historicalContext: 'Composta por Bob Marley em 1977 e lançada no álbum Exodus. Marley se inspirou em três passarinhos que vinham pousar na soleira de sua janela na 56 Hope Road em Kingston.',
    biomechanicsTip: 'Mão esquerda marca o pulso grave no tempo 1; mão direita solta os acordes nos tempos 2 e 4 com staccato limpo e pulso relaxado.',
    chords: ['A', 'D', 'E'],
    scoreTrack: [
      // Compasso 1 (Intro: Baixo A e Skank A)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 61, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'C#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'A3' },
      { midi: 61, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'C#3' },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'A3' },

      // Compasso 2 ("Don't worry...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 2, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 3 ("...about a thing...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'A3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 4 ("'Cause every little thing...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 5 ("...gonna be alright!")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 5, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 5, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 6 (Singing: "Don't worry...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 7 ("...about a thing...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'A3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'E3' },

      // Compasso 8 ("'Cause every little thing gonna be alright...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'E3' },
      { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 4, noteName: 'A3' },

      // Compasso 9 (Verso: "Rise up this mornin'...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'B3' },
      { midi: 73, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 5, noteName: 'C#4' },

      // Compasso 10 ("...smiled with the risin' sun...")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'E2', chordName: 'E' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 4, noteName: 'B3' },

      // Compasso 11 ("Three little birds...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 11, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 12 ("...pitch by my doorstep...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 3, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 4, noteName: 'B3' },

      // Compasso 13 ("Singin' sweet songs...")
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 4, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'A3' },

      // Compasso 14 ("...of melodies pure and true...")
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 4, noteName: 'E2', chordName: 'E' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 1, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 3, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'B3' },
      { midi: 73, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 5, noteName: 'C#4' },

      // Compasso 15 ("Sayin': this is my message to you-ou-ou...")
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 1, noteName: 'D2', chordName: 'D' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 5, noteName: 'D4' },
      { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 4, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 3, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 2, noteName: 'A3' },

      // Compasso 16 (Acorde Final A Sustentado)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 57, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A2' },
      { midi: 61, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'C#3' },
      { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'E3' },
      { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'A3' },
    ],
  },

  // =========================================================================
  // 2. FORRÓ, XOTE & BAIÃO: O Xote das Meninas (Luiz Gonzaga & Zé Dantas)
  // =========================================================================
  {
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
  },

  // =========================================================================
  // 3. SERESTA & BREGA: Diga Pra Mim (Zezo dos Teclados)
  // =========================================================================
  {
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
  },

  // =========================================================================
  // 4. GOSPEL CLÁSSICO & SACRO: Porque Ele Vive (Because He Lives)
  // =========================================================================
  {
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
  },

  // =========================================================================
  // 5. ROUPA NOVA & MPB: Dona (Sá & Guarabyra / Roupa Nova)
  // =========================================================================
  {
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
  },

  // =========================================================================
  // 6. ROCK ANOS 80 & NEW WAVE: Every Breath You Take (The Police)
  // =========================================================================
  {
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
  },
];
