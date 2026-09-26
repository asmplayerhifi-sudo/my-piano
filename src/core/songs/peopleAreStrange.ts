import type { RepertoireSong } from '../repertoireData';

export const PEOPLE_ARE_STRANGE: RepertoireSong = {
  id: 'people-are-strange',
  title: 'People Are Strange',
  composerOrArtist: 'The Doors (Jim Morrison & Robby Krieger)',
  genre: 'Rock Psicodelico & Progressivo',
  difficulty: 'Iniciante',
  recommendedBpm: 118,
  timeSignature: '4/4',
  tonality: 'Mi menor (Em)',
  description: 'Clássico do álbum Strange Days (1967) com sua atmosfera teatral de cabaré brechtiano, andamento ragtime/marcha sincopada em Mi menor, acordes secos de piano honky-tonk e melodia inconfundível.',
  historicalContext: 'Composta por Jim Morrison e Robby Krieger durante um momento de melancolia e sensação de alienação no Laurel Canyon em 1967. A música captura a contracultura e a sensação de estranhamento urbano.',
  biomechanicsTip: 'Toque a mão esquerda com pulso firme e staccato no estilo ragtime (fundamental no tempo 1 e 3, acorde no 2 e 4). Mão direita com articulação limpa e expressiva.',
  chords: ['Em', 'Am', 'B7', 'G'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 2) — Cabaret Ragtime ───
    // Compasso 1 (Em)
    { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 47, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'B1' },
    { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'B2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G3' },
    { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'B2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G3' },

    // Compasso 2 (B7)
    { midi: 47, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 2, noteName: 'B1', chordName: 'B7' },
    { midi: 42, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'F#1' },
    { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'B2' },
    { midi: 63, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'D#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'B2' },
    { midi: 63, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'F#3' },

    // ─── VERSO (Compassos 3 a 6): "People are strange when you're a stranger..." ───
    // Compasso 3 (Em)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 4 (Am - Em) — "Faces look ugly when you're alone..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 4, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 4, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 5 (Em) — "Women seem wicked when you're unwanted..."
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 6 (Am - Em) — "Streets are uneven when you're down..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'E3' },

    // ─── REFRÃO (Compassos 7 a 10): "When you're strange..." ───
    // Compasso 7 (B7)
    { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 2, noteName: 'B1', chordName: 'B7' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 8 (G) — "Faces come out of the rain..."
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 8, fingerRightHand: 4, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 8, fingerRightHand: 5, noteName: 'B3' },

    // Compasso 9 (B7) — "When you're strange..."
    { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 2, noteName: 'B1', chordName: 'B7' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 10 (Em) — "No one remembers your name."
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'E3' },
    { midi: 59, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'B2' },
  ],
  extension: {
    credits: {
      composer: 'The Doors (Jim Morrison & Robby Krieger)',
      originalArtist: 'The Doors',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1967,
      origin: 'EUA / Psychedelic Cabaret',
      notes: 'Transcrição didática para piano solo com harmonia de cabaré.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Ragtime', startMeasure: 1, endMeasure: 2, dynamic: 'mf' },
      { id: 'verse', label: 'Verso em Mi menor', startMeasure: 3, endMeasure: 6, dynamic: 'mp' },
      { id: 'chorus', label: 'Refrão Cabaret', startMeasure: 7, endMeasure: 10, dynamic: 'f' },
    ],
    lyrics: [
      { text: "People are strange when you're a stranger", startBeat: 9, endBeat: 13, startMeasure: 3, lineType: 'verse' },
      { text: "Faces look ugly when you're alone", startBeat: 13, endBeat: 17, startMeasure: 4, lineType: 'verse' },
      { text: "Women seem wicked when you're unwanted", startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: "Streets are uneven when you're down", startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: "When you're strange, faces come out of the rain", startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'chorus' },
      { text: "When you're strange, no one remembers your name", startBeat: 33, endBeat: 40, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
