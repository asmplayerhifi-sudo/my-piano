import type { RepertoireSong } from '../repertoireData';

export const LIGHT_MY_FIRE: RepertoireSong = {
  id: 'light-my-fire',
  title: 'Light My Fire',
  composerOrArtist: 'The Doors (Jim Morrison & Ray Manzarek)',
  genre: 'Rock Psicodelico & Progressivo',
  difficulty: 'Intermediário',
  recommendedBpm: 126,
  timeSignature: '4/4',
  tonality: 'Lá menor (Am) / Ré Maior (D)',
  description: 'O clássico psicodélico definitivo do The Doors (1967). Apresenta a icônica introdução barroca/jazzística no órgão Vox Continental tocada por Ray Manzarek, alternando com a melodia hipnótica de Jim Morrison em Lá menor.',
  historicalContext: 'Lançada em 1967 no álbum de estreia do The Doors. A introdução de órgão criada por Ray Manzarek foi inspirada na música barroca de Bach (Invenções a 2 vozes) combinada com harmonias de jazz modal.',
  biomechanicsTip: 'A mão direita deve articular a introdução em staccato leve e ágil. Na mão esquerda, mantenha o baixo Fender Rhodes pulsando de maneira estável e rítmica.',
  chords: ['Am', 'F#m', 'G', 'A', 'D', 'E'],
  scoreTrack: [
    // ─── INTRODUÇÃO ICÔNICA (Compassos 1 a 4) ───
    // Compasso 1 (G - D)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'C3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 2 (F - Bb)
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 46, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'A#1', chordName: 'Bb' },
    { midi: 65, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'C3' },
    { midi: 58, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'A#2' },

    // Compasso 3 (Eb - Ab)
    { midi: 39, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'D#1', chordName: 'Eb' },
    { midi: 44, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 3, noteName: 'G#1', chordName: 'Ab' },
    { midi: 63, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'D#3' },
    { midi: 61, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 3, noteName: 'C#3' },
    { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'B2' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'E3' },

    // Compasso 4 (A7)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
    { midi: 61, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'C#3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'E3' },

    // ─── VERSO (Compassos 5 a 8): "You know that it would be untrue..." ───
    // Compasso 5 (Am)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 6 (F#m) — "You know that I would be a liar..."
    { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'E3' },
    { midi: 61, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'C#3' },

    // Compasso 7 (Am) — "If I was to say to you..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 7, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 8 (F#m) — "Girl, we couldn't get much higher..."
    { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 8, fingerRightHand: 3, noteName: 'E3' },
    { midi: 61, clef: 'treble', duration: 1, beat: 4, measure: 8, fingerRightHand: 2, noteName: 'C#3' },

    // ─── REFRÃO (Compassos 9 a 12): "Come on baby, light my fire..." ───
    // Compasso 9 (G - A)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 3, noteName: 'A1', chordName: 'A' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 5, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 10 (D - Bm)
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 4, noteName: 'B1', chordName: 'Bm' },
    { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 11 (G - A) — "Try to set the night on fire!"
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 3, noteName: 'A1', chordName: 'A' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 4, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 5, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'B3' },

    // Compasso 12 (E7)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'E3' },
  ],
  extension: {
    credits: {
      composer: 'The Doors (Robby Krieger, Jim Morrison, Ray Manzarek, John Densmore)',
      originalArtist: 'The Doors',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1967,
      origin: 'EUA / Psychedelic Rock',
      notes: 'Transcrição do arranjo de teclado e órgão original com pauta dupla.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Barroca de Órgão', startMeasure: 1, endMeasure: 4, dynamic: 'f' },
      { id: 'verse', label: 'Verso Modal (Lá menor)', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Triunfante', startMeasure: 9, endMeasure: 12, dynamic: 'ff' },
    ],
    lyrics: [
      { text: 'You know that it would be untrue', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'You know that I would be a liar', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'If I was to say to you', startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'verse' },
      { text: "Girl, we couldn't get much higher", startBeat: 29, endBeat: 33, startMeasure: 8, lineType: 'verse' },
      { text: 'Come on baby, light my fire', startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: 'Try to set the night on fire!', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
