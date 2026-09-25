import type { RepertoireSong } from '../repertoireData';

export const STELLAR_REQUIEM: RepertoireSong = {
    id: 'stellar-requiem',
    title: 'Stellar Requiem',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Avancado',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Sol Menor (Gm)',
    description: 'Requiem atmosferico em Sol Menor com acordes de nona e setima menor, progressao modal Gm-Eb-Bb-F-Dm-C e estrutura em arco com pico no compasso 10.',
    historicalContext: 'Fusao de folk celta e progressivo sinfonico: acordes de quatro vozes e progressoes modais que evitam cadencias tradicionais.',
    biomechanicsTip: 'Acordes de nona exigem extensao. Pratique separado por mao antes de unir. Mantenha o punho abaixado.',
    chords: ['Gm', 'Eb', 'Bb', 'F', 'Dm', 'Cm', 'D7'],
    scoreTrack: [
      // Prelude (C 1-4)
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'D4' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 75, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'Eb4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'C4' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'D4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'F4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'C4' },

      // Canto (C 5-8)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 5, noteName: 'F4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'A4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C2', chordName: 'Cm' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G4' },
      { midi: 75, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'Eb4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'F4' },
      { midi: 82, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'A#4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'D7' },
      { midi: 81, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'A4' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 2.5, measure: 8, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'D4' },

      // Climax ff (C 9-12)
      { midi: 55, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'G2' },
      { midi: 82, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'A#4' },
      { midi: 86, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'D5' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 87, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'Eb5' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 86, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'D5' },
      { midi: 82, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'A#4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'D7' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'D4' },

      // Encerramento (C 13-20)
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 4, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 1, noteName: 'G3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 1, noteName: 'F3' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'D2', chordName: 'D7' },
      { midi: 66, clef: 'treble', duration: 4, beat: 1, measure: 18, fingerRightHand: 1, noteName: 'F#3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 19, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 19, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 20, fingerRightHand: 4, noteName: 'D4' },
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
        { id: 'prelude', label: 'Prelude', startMeasure: 1, endMeasure: 4, dynamic: 'mp', icon: 'intro' },
        { id: 'canto', label: 'Canto Principal', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'climax', label: 'Climax', startMeasure: 9, endMeasure: 12, dynamic: 'ff', icon: 'chorus' },
        { id: 'outro', label: 'Requiem Final', startMeasure: 13, endMeasure: 20, dynamic: 'p', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'orchestral',
          label: 'Orquestral',
          description: 'Cordas + orgao + baixo lento — sem bateria',
          defaultBpm: 68,
          styleId: 'ballad_6_8',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'strings',
          icon: '🎻',
        },
        {
          id: 'piano-full',
          label: 'Piano Classico',
          description: 'Piano de cauda com arpejo sustentado',
          defaultBpm: 60,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: true },
          melodicTimbre: 'grand_piano',
          icon: '🎹',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'Eb', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'Bb', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 6, beat: 1, chord: 'Cm', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'D7', durationBeats: 4 },
      ],
    },
  };
