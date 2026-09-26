import type { RepertoireSong } from '../repertoireData';

export const IS_THIS_LOVE: RepertoireSong = {
  id: 'is-this-love',
  title: 'Is This Love',
  composerOrArtist: 'Bob Marley & The Wailers',
  genre: 'Reggae & Praieiro',
  difficulty: 'Intermediário',
  recommendedBpm: 76,
  timeSignature: '4/4',
  tonality: 'Fá# menor (F#m) / Lá Maior (A)',
  description: 'Um dos maiores clássicos do reggae e da música romântica internacional, lançado em 1978 no histórico álbum Kaya. Destaca-se pelo lendário riff melódico de contrabaixo de Aston "Family Man" Barrett, pelos acordes sincopados de teclado nos tempos 2 e 4 (skank) e pela melodia envolvente e afetuosa.',
  historicalContext: 'Lançada em 1978 em Londres durante o exílio de Bob Marley, a canção alcançou o Top 10 britânico e seu videoclipe gravado na Keskidee Arts Centre contou com a primeira aparição de uma jovem Naomi Campbell de 7 anos.',
  biomechanicsTip: 'A mão esquerda deve tocar com articulação percussiva e sustentação elástica imitando o baixo de reggae. Na mão direita, solte os acordes exatamente nos tempos 2 e 4 com staccato rápido de pulso.',
  chords: ['F#m', 'D', 'A', 'E', 'C#m', 'Bm'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 4) — O célebre riff melódico de baixo e teclado ───
    // Compasso 1 (F#m)
    { midi: 42, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 3, noteName: 'A1' },
    { midi: 49, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'C#2' },
    { midi: 45, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 3, noteName: 'A1' },
    { midi: 61, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'C#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'A3' },
    { midi: 61, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'C#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 2 (F#m)
    { midi: 42, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 45, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 3, noteName: 'A1' },
    { midi: 49, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'C#2' },
    { midi: 47, clef: 'bass', duration: 1, beat: 4, measure: 2, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 61, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 5, noteName: 'A3' },
    { midi: 61, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'C#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 3 (D)
    { midi: 38, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'D1', chordName: 'D' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'A1' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 5, noteName: 'A3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 4 (A - E)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'A3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'E3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 3, noteName: 'G#3' },

    // ─── VERSO (Compassos 5 a 8): "I wanna love you and treat you right..." ───
    // Compasso 5 (F#m) — "I wanna love you..."
    { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'A3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'A3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'F#3' },

    // Compasso 6 (F#m) — "...and treat you right"
    { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'A3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 7 (D) — "I wanna love you every day and every night..."
    { midi: 38, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D1', chordName: 'D' },
    { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 8 (A - C#m) — "...we'll be together"
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 49, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 2, noteName: 'C#2', chordName: 'C#m' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'A3' },
    { midi: 68, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'G#3' },

    // ─── REFRÃO (Compassos 9 a 12): "Is this love, is this love that I'm feelin'?" ───
    // Compasso 9 (Bm - F#m) — "Is this love, is this love..."
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 4, noteName: 'B1', chordName: 'Bm' },
    { midi: 42, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 2, noteName: 'A3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 1, noteName: 'F#3' },

    // Compasso 10 (D - A) — "...that I'm feelin'?"
    { midi: 38, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'D1', chordName: 'D' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 4, noteName: 'B3' },
    { midi: 73, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 5, noteName: 'C#4' },

    // Compasso 11 (Bm - F#m) — "Is this love, is this love..."
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'B1', chordName: 'Bm' },
    { midi: 42, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 11, fingerRightHand: 2, noteName: 'A3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'F#3' },

    // Compasso 12 (A - Resolução)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'A3' },
  ],
  extension: {
    credits: {
      composer: 'Bob Marley',
      lyricist: 'Bob Marley',
      originalArtist: 'Bob Marley & The Wailers',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1978,
      origin: 'Jamaica / Roots Reggae & Lovers Rock',
      notes: 'Transcrição fiel com clave dupla contendo linha melódica de baixo e skank de teclado.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Roots & Skank', startMeasure: 1, endMeasure: 4, dynamic: 'mf' },
      { id: 'verse', label: 'Verso Romântico', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Inesquecível', startMeasure: 9, endMeasure: 12, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'I wanna love you and treat you right', startBeat: 17, endBeat: 25, startMeasure: 5, lineType: 'verse' },
      { text: 'I wanna love you every day and every night', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: "Is this love, is this love that I'm feelin'?", startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: "Is this love, is this love that I'm feelin'?", startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
