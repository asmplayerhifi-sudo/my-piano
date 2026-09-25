import type { RepertoireSong } from '../repertoireData';

export const THE_QUIET_STORM: RepertoireSong = {
    id: 'the-quiet-storm',
    title: 'The Quiet Storm',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Intermediario',
    recommendedBpm: 60,
    timeSignature: '4/4',
    tonality: 'La Menor (Am)',
    description: 'Space rock contemplativo em La Menor com modo Eolico puro, drone de Am no baixo e crescimento gradual de pp a ff. Excelente para explorar a escala menor natural.',
    historicalContext: 'Inspirado no space rock e no krautrock dos anos 70: minimalismo ritmico, pedal point no baixo e crescimento gradual de tensao e dinamica.',
    biomechanicsTip: 'Peca lenta: use o peso do braco, nao a forca dos dedos. Cada nota deve soar cheia e sustentada.',
    chords: ['Am', 'G', 'F', 'E7', 'Dm', 'C'],
    scoreTrack: [
      // Abertura (C 1-4)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A3' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'E4' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'F4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'E4' },

      // Crescendo (C 5-8)
      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'E7' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'E4' },
      { midi: 73, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'C#4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'E4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 5, noteName: 'A4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 81, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'A4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'E4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'C4' },

      // Pico ff (C 9-12)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 3, noteName: 'A2' },
      { midi: 81, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'A4' },
      { midi: 84, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 5, noteName: 'C5' },
      { midi: 88, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'E5' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 91, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'G5' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 89, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'F5' },
      { midi: 88, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'E5' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'E7' },
      { midi: 88, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 4, noteName: 'E5' },
      { midi: 85, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 2, noteName: 'C#5' },

      // Dissolve (C 13-16)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 81, clef: 'treble', duration: 4, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'A4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'E4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'C4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'E4' },
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
        { id: 'drone', label: 'Drone', startMeasure: 1, endMeasure: 4, dynamic: 'pp', tempo: 60, icon: 'intro' },
        { id: 'build1', label: 'Crescendo', startMeasure: 5, endMeasure: 8, dynamic: 'mp', icon: 'verse' },
        { id: 'peak', label: 'Pico (ff)', startMeasure: 9, endMeasure: 12, dynamic: 'ff', icon: 'chorus' },
        { id: 'dissolve', label: 'Dissolve', startMeasure: 13, endMeasure: 16, dynamic: 'pp', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'space-full',
          label: 'Space Rock',
          description: 'Bateria lenta + drone de baixo + acordes longos',
          defaultBpm: 60,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'synth_pad',
          icon: '🌠',
        },
        {
          id: 'piano-meditation',
          label: 'Meditacao',
          description: 'Piano solo sem acompanhamento',
          defaultBpm: 52,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🕯️',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Am', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'G', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'E7', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'C', durationBeats: 4 },
      ],
    },
  };
