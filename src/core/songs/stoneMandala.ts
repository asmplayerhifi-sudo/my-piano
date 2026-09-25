import type { RepertoireSong } from '../repertoireData';

export const STONE_MANDALA: RepertoireSong = {
    id: 'stone-mandala',
    title: 'Stone Mandala',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Intermediario',
    recommendedBpm: 88,
    timeSignature: '4/4',
    tonality: 'Re Menor (Dm)',
    description: 'Groove de rock progressivo em Re Menor com linha de baixo marcante em oitavas, progressao modal Dm-C-Bb-A7 e secao de solo melodico no interludio.',
    historicalContext: 'Inspirado no rock progressivo britanico dos anos 70: progressoes modais, baixo melodico e contraponto entre guitarra e teclado.',
    biomechanicsTip: 'Baixo em oitavas: polegar no D grave e indicador na oitava superior. Mantenha o cotovelo baixo para facilitar o salto de oitava sem tensao.',
    chords: ['Dm', 'C', 'Bb', 'A7', 'Gm', 'F'],
    scoreTrack: [
      // Groove (C 1-8)
      { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 50, clef: 'bass', duration: 0.5, beat: 2, measure: 1, fingerLeftHand: 5, noteName: 'D2' },
      { midi: 62, clef: 'bass', duration: 0.5, beat: 2.5, measure: 1, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 50, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'D2' },
      { midi: 62, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'D4' },

      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'C3' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'C4' },

      { midi: 46, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 58, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'Bb2' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'D4' },

      { midi: 57, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 57, clef: 'bass', duration: 0.5, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'A1' },
      { midi: 69, clef: 'bass', duration: 1.5, beat: 3.5, measure: 4, fingerLeftHand: 2, noteName: 'A2' },
      { midi: 73, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'E4' },

      { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 77, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'F4' },
      { midi: 79, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'D4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'D4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 4, noteName: 'E4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 5, noteName: 'F4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'F4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'D4' },

      // Solo (C 9-16)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'F4' },
      { midi: 79, clef: 'treble', duration: 0.5, beat: 1.5, measure: 9, fingerRightHand: 5, noteName: 'G4' },
      { midi: 81, clef: 'treble', duration: 0.5, beat: 2, measure: 9, fingerRightHand: 5, noteName: 'A4' },
      { midi: 79, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3.5, measure: 9, fingerRightHand: 3, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 4, measure: 9, fingerRightHand: 2, noteName: 'C4' },
      { midi: 70, clef: 'treble', duration: 0.5, beat: 4.5, measure: 9, fingerRightHand: 1, noteName: 'Bb3' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 10, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 4, noteName: 'D4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 10, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3.5, measure: 10, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 3, noteName: 'C4' },

      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 4, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 2, noteName: 'C4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'C#4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'E4' },

      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 77, clef: 'treble', duration: 4, beat: 1, measure: 15, fingerRightHand: 5, noteName: 'F4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 3, noteName: 'D4' },

      // Refrao Final (C 17-24)
      { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'bass', duration: 1, beat: 2, measure: 17, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 50, clef: 'bass', duration: 1, beat: 3, measure: 17, fingerLeftHand: 5, noteName: 'D2' },
      { midi: 62, clef: 'bass', duration: 1, beat: 4, measure: 17, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 81, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'A4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 3, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 18, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 18, fingerRightHand: 3, noteName: 'E4' },

      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 19, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 19, fingerRightHand: 3, noteName: 'D4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 20, fingerRightHand: 3, noteName: 'D4' },
      { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 20, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 20, fingerRightHand: 3, noteName: 'D4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 21, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 21, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 21, fingerRightHand: 5, noteName: 'F4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 22, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 22, fingerRightHand: 4, noteName: 'F4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 22, fingerRightHand: 3, noteName: 'E4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 23, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 23, fingerRightHand: 3, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 23, fingerRightHand: 1, noteName: 'Bb3' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 1, noteName: 'A3' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 24, fingerRightHand: 5, noteName: 'E4' },
    ],
    extension: {
      credits: {
        composer: 'Harmonia App',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Composicao original',
        license: 'original',
        origin: 'Brasil',
      },
      sections: [
        { id: 'groove', label: 'Groove I', startMeasure: 1, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'solo', label: 'Solo / Interludio', startMeasure: 9, endMeasure: 16, dynamic: 'f', icon: 'solo' },
        { id: 'chorus', label: 'Refrao Final', startMeasure: 17, endMeasure: 24, dynamic: 'ff', icon: 'chorus' },
      ],
      arrangements: [
        {
          id: 'prog-full',
          label: 'Rock Progressivo Completo',
          description: 'Bateria com fills + baixo em oitavas + acordes + solo',
          defaultBpm: 88,
          styleId: 'pop_rock',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'organ',
          icon: '🎸',
        },
        {
          id: 'bass-heavy',
          label: 'Baixo em Destaque',
          description: 'Bateria + baixo em oitavas',
          defaultBpm: 88,
          styleId: 'pop_rock',
          enabledChannels: { drums: true, bass: true, chords: false, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎚️',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'C', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'Bb', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'A7', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'Gm', durationBeats: 4 },
      ],
    },
  };
