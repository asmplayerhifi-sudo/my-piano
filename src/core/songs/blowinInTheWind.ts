import type { RepertoireSong } from '../repertoireData';

export const BLOWIN_IN_THE_WIND: RepertoireSong = {
  id: 'blowin-in-the-wind',
  title: "Blowin' in the Wind",
  composerOrArtist: 'Bob Dylan',
  genre: 'Pop & Rock Clássico',
  difficulty: 'Iniciante',
  recommendedBpm: 76,
  timeSignature: '4/4',
  tonality: 'Ré Maior (D)',
  description: 'O maior manifesto poético pacifista do século XX. Gravada em 1962 no The Freewheelin\' Bob Dylan, a obra apresenta uma harmonia folclórica límpida em Ré Maior (D - G - A) com melodia contemplativa e acessível ao estudante iniciante.',
  historicalContext: 'Composta por Bob Dylan em abril de 1962 em Nova York, baseada na melodia do spiritual "No More Auction Block". Tornou-se o hino mundial dos direitos civis e dos movimentos antiguerra.',
  biomechanicsTip: 'Toque a mão esquerda com peso relaxado nos tempos 1 e 3. Na mão direita, articule os dedos 1 a 4 com legato natural imitando a respiração vocal.',
  chords: ['D', 'G', 'A', 'D'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 2) ───
    // Compasso 1 (D)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 2 (G - A)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A3' },

    // ─── VERSO 1 (Compassos 3 a 6): "How many roads must a man walk down..." ───
    // Compasso 3 (D - G) — "How many roads..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 4 (D) — "...before you call him a man?"
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 3, beat: 2, measure: 4, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 5 (D - G) — "Yes, and how many seas..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 6 (A) — "...before she sleeps in the sand?"
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'E3' },

    // ─── REFRÃO (Compassos 7 a 10): "The answer, my friend, is blowin' in the wind..." ───
    // Compasso 7 (G - A) — "The answer, my friend..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 5, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 8 (D - G) — "...is blowin' in the wind..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1.5, beat: 2.5, measure: 8, fingerRightHand: 1, noteName: 'D3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 8, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 9 (G - A) — "The answer is blowin'..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 4, noteName: 'A1', chordName: 'A' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 10 (D) — "...in the wind."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'D3' },
  ],
  extension: {
    credits: {
      composer: 'Bob Dylan',
      lyricist: 'Bob Dylan',
      originalArtist: 'Bob Dylan',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1963,
      origin: 'EUA / Folk & Classic Protest Song',
      notes: 'Arranjo com notação dupla didática para piano/teclado iniciante.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Folk', startMeasure: 1, endMeasure: 2, dynamic: 'mp' },
      { id: 'verse', label: 'Verso Poético', startMeasure: 3, endMeasure: 6, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Histórico', startMeasure: 7, endMeasure: 10, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'How many roads must a man walk down', startBeat: 9, endBeat: 13, startMeasure: 3, lineType: 'verse' },
      { text: 'Before you call him a man?', startBeat: 13, endBeat: 17, startMeasure: 4, lineType: 'verse' },
      { text: 'Yes, and how many seas must a white dove sail', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Before she sleeps in the sand?', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: "The answer, my friend, is blowin' in the wind", startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'chorus' },
      { text: "The answer is blowin' in the wind", startBeat: 33, endBeat: 40, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
