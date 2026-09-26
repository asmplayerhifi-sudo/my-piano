import type { RepertoireSong } from '../repertoireData';

export const ANOTHER_BRICK_IN_THE_WALL: RepertoireSong = {
  id: 'another-brick-in-the-wall-pt2',
  title: 'Another Brick in the Wall (Part 2)',
  composerOrArtist: 'Pink Floyd (Roger Waters)',
  genre: 'Rock Psicodelico & Progressivo',
  difficulty: 'Intermediário',
  recommendedBpm: 104,
  timeSignature: '4/4',
  tonality: 'Ré menor (Dm)',
  description: 'O maior sucesso comercial do Pink Floyd, com seu groove inconfundível de disco-rock em Ré menor, baixo pulsante, acordes staccato sincopados e o famoso coro infantil contra a opressão escolar.',
  historicalContext: 'Lançada em novembro de 1979 no álbum The Wall e como single que alcançou o 1º lugar no Reino Unido e EUA. Produzida por Bob Ezrin, que sugeriu o andamento de 4-on-the-floor e o coral de crianças da Islington Green School.',
  biomechanicsTip: 'A mão esquerda deve manter o pulso rítmico estalado de Dm. A mão direita executa os acordes em staccato seco com rápido levantamento de pulso.',
  chords: ['Dm', 'G', 'C', 'F'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 2) — Groove Rítmico em Dm ───
    // Compasso 1 (Dm)
    { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 50, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 5, noteName: 'D2' },
    { midi: 53, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 3, noteName: 'F2' },
    { midi: 55, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 57, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'A2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'D3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'F3' },

    // Compasso 2 (Dm)
    { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 50, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 5, noteName: 'D2' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'D3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'F3' },

    // ─── VERSO (Compassos 3 a 6): "We don't need no education..." ───
    // Compasso 3 (Dm)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'F3' },

    // Compasso 4 (Dm) — "We don't need no thought control..."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'F3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 5 (G) — "No dark sarcasm in the classroom..."
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 5, fingerRightHand: 5, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 3.5, measure: 5, fingerRightHand: 5, noteName: 'G3' },

    // Compasso 6 (Dm) — "Teacher, leave them kids alone!"
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'D3' },

    // ─── REFRÃO (Compassos 7 a 10): "All in all it's just another brick in the wall" ───
    // Compasso 7 (F - C)
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
    { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 7, fingerRightHand: 2, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 8 (Dm)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 1, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 9 (F - C) — "All in all you're just another brick in the wall"
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
    { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 2, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 10 (Dm) — Resolução
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'D3' },
  ],
  extension: {
    credits: {
      composer: 'Roger Waters',
      lyricist: 'Roger Waters',
      originalArtist: 'Pink Floyd',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1979,
      origin: 'Reino Unido / Disco Rock',
      notes: 'Transcrição rítmica de concerto para teclado e piano.',
    },
    sections: [
      { id: 'intro', label: 'Groove Dm de Abertura', startMeasure: 1, endMeasure: 2, dynamic: 'mf' },
      { id: 'verse', label: 'Verso Principal', startMeasure: 3, endMeasure: 6, dynamic: 'f' },
      { id: 'chorus', label: 'Refrão & Resolução', startMeasure: 7, endMeasure: 10, dynamic: 'ff' },
    ],
    lyrics: [
      { text: "We don't need no education", startBeat: 9, endBeat: 13, startMeasure: 3, lineType: 'verse' },
      { text: "We don't need no thought control", startBeat: 13, endBeat: 17, startMeasure: 4, lineType: 'verse' },
      { text: 'No dark sarcasm in the classroom', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Teacher, leave them kids alone!', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: "All in all it's just another brick in the wall", startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'chorus' },
      { text: "All in all you're just another brick in the wall", startBeat: 33, endBeat: 40, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
