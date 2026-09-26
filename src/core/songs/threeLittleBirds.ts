import type { RepertoireSong } from '../repertoireData';

export const THREE_LITTLE_BIRDS: RepertoireSong = {
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
    extension: {
      credits: {
        composer: 'Bob Marley',
        lyricist: 'Bob Marley',
        originalArtist: 'Bob Marley & The Wailers',
        arrangementAuthor: 'Harmonia Music Master Series',
        license: 'creative_commons',
        publishedYear: 1977,
        origin: 'Jamaica / Reggae & Kingston Roots',
        notes: 'Arranjo com notação dupla didática e piano skank nos tempos 2 e 4.',
      },
      sections: [
        { id: 'intro', label: 'Introdução Skank Reggae', startMeasure: 1, endMeasure: 1, dynamic: 'mf' },
        { id: 'chorus', label: 'Refrão Positivo', startMeasure: 2, endMeasure: 9, dynamic: 'f' },
        { id: 'verse', label: 'Verso dos Três Passarinhos', startMeasure: 10, endMeasure: 16, dynamic: 'mf' },
      ],
      lyrics: [
        { text: "Don't worry about a thing", startBeat: 5, endBeat: 13, startMeasure: 2, lineType: 'chorus' },
        { text: "'Cause every little thing gonna be alright", startBeat: 13, endBeat: 21, startMeasure: 4, lineType: 'chorus' },
        { text: 'Rise up this mornin\', smiled with the risin\' sun', startBeat: 37, endBeat: 45, startMeasure: 10, lineType: 'verse' },
        { text: 'Three little birds pitch by my doorstep', startBeat: 45, endBeat: 53, startMeasure: 12, lineType: 'verse' },
        { text: 'Singin\' sweet songs of melodies pure and true', startBeat: 53, endBeat: 61, startMeasure: 14, lineType: 'verse' },
      ],
    },
  };
