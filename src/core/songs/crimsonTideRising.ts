import type { RepertoireSong } from '../repertoireData';

export const CRIMSON_TIDE_RISING: RepertoireSong = {
    id: 'crimson-tide-rising',
    title: 'Crimson Tide Rising',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Avançado',
    recommendedBpm: 104,
    timeSignature: '4/4',
    tonality: 'Si Menor (Bm)',
    description: 'Rock progressivo intenso em Si Menor com linha de baixo melodica, progressao Bm-A-G-F#7 e acordes estendidos. Nivel avancado com mudancas de posicao e dinamica exigente.',
    historicalContext: 'Inspirado na escola do rock progressivo britanico: complexidade com acordes de setima e nona, baixo melodico contrapuntistico.',
    biomechanicsTip: 'Secoces avancadas exigem pratica por partes. Mantenha o punho abaixado para facilitar extensoes.',
    chords: ['Bm', 'A', 'G', 'F#7', 'Em', 'D'],
    scoreTrack: [
      // Abertura (C 1-4)
      { midi: 47, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 59, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 2, noteName: 'B2' },
      { midi: 47, clef: 'bass', duration: 0.5, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'B1' },
      { midi: 54, clef: 'bass', duration: 0.5, beat: 3.5, measure: 1, fingerLeftHand: 3, noteName: 'F#2' },
      { midi: 59, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 2, noteName: 'B2' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 78, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 83, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 81, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },
      { midi: 78, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'E4' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'F4' },
      { midi: 75, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'D4' },

      // Desenvolvimento (C 5-16)
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 83, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'B4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'A4' },

      { midi: 52, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'E4' },
      { midi: 79, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 5, noteName: 'G4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 81, clef: 'treble', duration: 4, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'A4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'E4' },

      { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 59, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'B2' },
      { midi: 86, clef: 'treble', duration: 4, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'D5' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 88, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'E5' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 89, clef: 'treble', duration: 4, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'F5' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 90, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'F#5' },
      { midi: 89, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 4, noteName: 'F5' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 88, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'E5' },
      { midi: 86, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'D5' },

      { midi: 52, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 83, clef: 'treble', duration: 4, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'B4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 81, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'A4' },
      { midi: 78, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'F#4' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'D4' },
      { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 83, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'B4' },

      // Coda (C 17-28)
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 83, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'B4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 4, noteName: 'A4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 18, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 18, fingerRightHand: 2, noteName: 'E4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 19, fingerRightHand: 1, noteName: 'D4' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 20, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 75, clef: 'treble', duration: 2, beat: 3, measure: 20, fingerRightHand: 2, noteName: 'Eb4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 21, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 21, fingerRightHand: 2, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 21, fingerRightHand: 1, noteName: 'B3' },

      { midi: 52, clef: 'bass', duration: 4, beat: 1, measure: 22, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 22, fingerRightHand: 1, noteName: 'B3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 23, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 23, fingerRightHand: 1, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 23, fingerRightHand: 2, noteName: 'B3' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'B3' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 25, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 25, fingerRightHand: 1, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 25, fingerRightHand: 3, noteName: 'D4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 26, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 26, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 26, fingerRightHand: 3, noteName: 'D4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 27, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 27, fingerRightHand: 2, noteName: 'B3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 27, fingerRightHand: 1, noteName: 'G3' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 28, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 59, clef: 'treble', duration: 1, beat: 1, measure: 28, fingerRightHand: 1, noteName: 'B2' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 28, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 28, fingerRightHand: 5, noteName: 'B3' },
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
        { id: 'opening', label: 'Abertura', startMeasure: 1, endMeasure: 4, dynamic: 'f', icon: 'intro' },
        { id: 'dev1', label: 'Desenvolvimento', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'build', label: 'Construcao', startMeasure: 9, endMeasure: 12, dynamic: 'ff', icon: 'chorus' },
        { id: 'release', label: 'Dissolucao', startMeasure: 13, endMeasure: 16, dynamic: 'f', icon: 'bridge' },
        { id: 'coda', label: 'Coda Final', startMeasure: 17, endMeasure: 28, dynamic: 'mf', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'prog-rock-full',
          label: 'Progressivo Completo',
          description: 'Bateria com fills complexos + baixo melodico + acordes estendidos',
          defaultBpm: 104,
          styleId: 'pop_rock',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'organ',
          icon: '🎸',
        },
        {
          id: 'reduced',
          label: 'Reduzido para Estudo',
          description: 'Piano + baixo sem bateria',
          defaultBpm: 88,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎹',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Bm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'A', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'G', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'F#7', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'Bm', durationBeats: 4 },
        { measure: 6, beat: 1, chord: 'Em', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'D', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'A', durationBeats: 4 },
      ],
    },
  };
