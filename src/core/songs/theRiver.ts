import type { RepertoireSong } from '../repertoireData';

export const THE_RIVER: RepertoireSong = {
  id: 'the-river',
  title: 'The River',
  composerOrArtist: 'Bruce Springsteen',
  genre: 'Pop & Rock Clássico',
  difficulty: 'Intermediário',
  recommendedBpm: 70,
  timeSignature: '4/4',
  tonality: 'Mi menor (Em) / Sol Maior (G)',
  description: 'Uma das baladas narrativas mais pungentes e aclamadas de Springsteen, lançada em 1980 no álbum duplo The River. A obra é introduzida pelo tema melancólico e inesquecível em Mi menor e se desenvolve numa comovente história de juventude, perda de sonhos e memória.',
  historicalContext: 'Inspirada na vida real da irmã de Springsteen, Ginny, e seu marido, que enfrentaram o desemprego na crise econômica do final dos anos 70. O tema da harmônica e piano é considerado um dos momentos mais profundos do cancioneiro americano.',
  biomechanicsTip: 'Toque a introdução com toque cantabile delicado na mão direita. Na mão esquerda, os arpejos de Mi menor e Sol Maior devem soar aveludados e contínuos, amparados por pedal de sustentação discreto.',
  chords: ['Em', 'G', 'D', 'C', 'Am'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 4) — O tema melancólico de gaita/piano em Mi menor ───
    // Compasso 1 (Em)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'G3' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 2 (G)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 3.5, measure: 2, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 3 (D)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'A1' },
    { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 4 (C - Em)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'C2', chordName: 'C' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'E3' },

    // ─── VERSO (Compassos 5 a 8): "I come from down in the valley..." ───
    // Compasso 5 (Em - G)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'G3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 6 (D - C) — "Where, mister, when you're young..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 4, noteName: 'D2', chordName: 'D' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 7 (Em - G) — "They bring you up to do just like your daddy done..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'G3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 8 (C - D)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 4, noteName: 'D2', chordName: 'D' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'F#3' },

    // ─── REFRÃO (Compassos 9 a 12): "We'd go down to the river..." ───
    // Compasso 9 (G - D) — "'Cause we'd go down to the river..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 2, measure: 9, fingerRightHand: 5, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 10 (Em - C) — "...and into the river we'd dive..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 1, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 11 (G - D) — "Oh, down to the river we'd ride..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 2, measure: 11, fingerRightHand: 5, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 12 (Em) — Resolução
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'E3' },
  ],
  extension: {
    credits: {
      composer: 'Bruce Springsteen',
      lyricist: 'Bruce Springsteen',
      originalArtist: 'Bruce Springsteen',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1980,
      origin: 'EUA / Folk Rock & Heartland Ballad',
      notes: 'Transcrição didática com clave dupla para piano/teclado.',
    },
    sections: [
      { id: 'intro', label: 'Tema Melancólico da Gaita e Piano', startMeasure: 1, endMeasure: 4, dynamic: 'p' },
      { id: 'verse', label: 'Verso Narrativo', startMeasure: 5, endMeasure: 8, dynamic: 'mp' },
      { id: 'chorus', label: 'Refrão Solene', startMeasure: 9, endMeasure: 12, dynamic: 'mf' },
    ],
    lyrics: [
      { text: 'I come from down in the valley', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: "Where, mister, when you're young", startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'They bring you up to do just like your daddy done', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: "We'd go down to the river, and into the river we'd dive", startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: "Oh, down to the river we'd ride", startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
