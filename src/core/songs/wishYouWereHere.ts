import type { RepertoireSong } from '../repertoireData';

export const WISH_YOU_WERE_HERE: RepertoireSong = {
  id: 'wish-you-were-here',
  title: 'Wish You Were Here',
  composerOrArtist: 'Pink Floyd (David Gilmour & Roger Waters)',
  genre: 'Rock Psicodelico & Progressivo',
  difficulty: 'Iniciante',
  recommendedBpm: 62,
  timeSignature: '4/4',
  tonality: 'Sol Maior (G)',
  description: 'A balada mais comovente do Pink Floyd, do álbum homônimo de 1975. Dedicada a Syd Barrett, possui a inconfundível introdução acústica adaptada para as duas mãos do piano, com acordes abertos em Sol Maior e Mi menor.',
  historicalContext: 'Composta em 1975 durante as sessões no Abbey Road Studios, em homenagem ao membro fundador Syd Barrett, cuja fragilidade mental inspirou a temática da ausência no álbum.',
  biomechanicsTip: 'Toque o tema com toque aveludado e dinâmicas sutis. O pulso deve conduzir os arpejos da mão direita com flexibilidade constante.',
  chords: ['G', 'Em', 'A7', 'C', 'D', 'Am'],
  scoreTrack: [
    // ─── TEMA DA INTRODUÇÃO (Compassos 1 a 4) ───
    // Compasso 1 (Em7 - G)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'B1' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G3' },

    // Compasso 2 (G)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D3' },
    { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 3 (Em7 - A7sus4)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 3, noteName: 'A1', chordName: 'A7' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 3, fingerRightHand: 5, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 3, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 4 (G)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'D3' },

    // ─── VERSO 1 (Compassos 5 a 8): "So, so you think you can tell..." ───
    // Compasso 5 (C)
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 6 (D) — "Heaven from hell..."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 7 (Am) — "Blue skies from pain..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 60, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 7, fingerRightHand: 3, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 8 (G)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 59, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'B2' },
    { midi: 55, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'G2' },

    // ─── REFRÃO (Compassos 9 a 12): "How I wish, how I wish you were here..." ───
    // Compasso 9 (C)
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 5, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 10 (D) — "We're just two lost souls swimming in a fish bowl..."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 5, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 11 (Am - G) — "Year after year..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 12 (G) — "Wish you were here."
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'B2' },
    { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'G3' },
  ],
  extension: {
    credits: {
      composer: 'David Gilmour & Roger Waters',
      lyricist: 'Roger Waters',
      originalArtist: 'Pink Floyd',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1975,
      origin: 'Reino Unido / Classic Rock',
      notes: 'Arranjo fiel para piano acústico solo.',
    },
    sections: [
      { id: 'intro', label: 'Tema Acústico de Abertura', startMeasure: 1, endMeasure: 4, dynamic: 'mp' },
      { id: 'verse1', label: 'Verso 1', startMeasure: 5, endMeasure: 8, dynamic: 'p' },
      { id: 'chorus', label: 'Refrão Emotivo', startMeasure: 9, endMeasure: 12, dynamic: 'mf' },
    ],
    lyrics: [
      { text: 'So, so you think you can tell', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Heaven from hell, blue skies from pain', startBeat: 21, endBeat: 29, startMeasure: 6, lineType: 'verse' },
      { text: 'How I wish, how I wish you were here', startBeat: 33, endBeat: 37, startMeasure: 9, lineType: 'chorus' },
      { text: "We're just two lost souls swimming in a fish bowl", startBeat: 37, endBeat: 41, startMeasure: 10, lineType: 'chorus' },
      { text: 'Wish you were here', startBeat: 45, endBeat: 48, startMeasure: 12, lineType: 'chorus' },
    ],
  },
};
