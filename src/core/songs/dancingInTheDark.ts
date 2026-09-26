import type { RepertoireSong } from '../repertoireData';

export const DANCING_IN_THE_DARK: RepertoireSong = {
  id: 'dancing-in-the-dark',
  title: 'Dancing in the Dark',
  composerOrArtist: 'Bruce Springsteen',
  genre: 'Rock Anos 80 & New Wave',
  difficulty: 'Intermediário',
  recommendedBpm: 148,
  timeSignature: '4/4',
  tonality: 'Si Maior (B)',
  description: 'O maior sucesso comercial de Bruce Springsteen, lançado em 1984 no álbum Born in the U.S.A. A música é sustentada pelo icônico riff de sintetizador em Si Maior (B - G#m - E - F#) que redefiniu o som do rock de arena dos anos 80.',
  historicalContext: 'Escrita em uma única noite num quarto de hotel após uma discussão entre Springsteen e seu produtor Jon Landau, que exigia um single irresistível para as rádios. O videoclipe lendário contou com a participação de Courteney Cox.',
  biomechanicsTip: 'Mantenha a mão esquerda com pulso firme e estável nas síncopes em Si e Sol#. Na mão direita, destaque os acordes staccato do sintetizador com toques secos de ponta de dedo.',
  chords: ['B', 'G#m', 'E', 'F#'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 4) — O célebre riff de sintetizador/teclado dos anos 80 ───
    // Compasso 1 (B)
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'B1', chordName: 'B' },
    { midi: 54, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'F#2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'B3' },
    { midi: 75, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'D#4' },
    { midi: 78, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'F#4' },
    { midi: 75, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'D#4' },

    // Compasso 2 (G#m)
    { midi: 44, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G#1', chordName: 'G#m' },
    { midi: 51, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'D#2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'B3' },
    { midi: 75, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'D#4' },
    { midi: 78, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'F#4' },
    { midi: 75, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 3, noteName: 'D#4' },

    // Compasso 3 (E)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'B3' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'E4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 4 (F#)
    { midi: 42, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'F#1', chordName: 'F#' },
    { midi: 49, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 1, noteName: 'C#2' },
    { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A#3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 78, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'F#4' },

    // ─── VERSO (Compassos 5 a 8): "I get up in the evening..." ───
    // Compasso 5 (B) — "I get up in the evening..."
    { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'B1', chordName: 'B' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'B3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'B3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'B3' },
    { midi: 75, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'D#4' },

    // Compasso 6 (G#m) — "...and I ain't got nothin' to say..."
    { midi: 44, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G#1', chordName: 'G#m' },
    { midi: 75, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D#4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 7 (E) — "I come home in the mornin'..."
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 75, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 4, noteName: 'D#4' },

    // Compasso 8 (F#) — "...I go to bed feelin' the same way."
    { midi: 42, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 4, noteName: 'F#1', chordName: 'F#' },
    { midi: 75, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'D#4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2.5, measure: 8, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 70, clef: 'treble', duration: 1.5, beat: 3.5, measure: 8, fingerRightHand: 1, noteName: 'A#3' },

    // ─── REFRÃO (Compassos 9 a 12): "You can't start a fire sittin' 'round cryin'..." ───
    // Compasso 9 (B - G#m) — "You can't start a fire..."
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'B1', chordName: 'B' },
    { midi: 44, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 5, noteName: 'G#1', chordName: 'G#m' },
    { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'F#4' },
    { midi: 75, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'D#4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 1, noteName: 'B3' },

    // Compasso 10 (E - F#) — "...without a spark!"
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 42, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 4, noteName: 'F#1', chordName: 'F#' },
    { midi: 75, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'D#4' },
    { midi: 73, clef: 'treble', duration: 2.5, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'C#4' },

    // Compasso 11 (B - G#m) — "This gun's for hire..."
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'B1', chordName: 'B' },
    { midi: 44, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 5, noteName: 'G#1', chordName: 'G#m' },
    { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'F#4' },
    { midi: 75, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'D#4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 2, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 1, noteName: 'B3' },

    // Compasso 12 (E - B) — "...even if we're just dancin' in the dark!"
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 2, noteName: 'B1', chordName: 'B' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'B3' },
    { midi: 75, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'D#4' },
  ],
  extension: {
    credits: {
      composer: 'Bruce Springsteen',
      lyricist: 'Bruce Springsteen',
      originalArtist: 'Bruce Springsteen',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1984,
      origin: 'EUA / Synth Rock & New Wave',
      notes: 'Transcrição didática adaptada para teclado e sintetizador.',
    },
    sections: [
      { id: 'intro', label: 'Riff Sintetizador Anos 80', startMeasure: 1, endMeasure: 4, dynamic: 'f' },
      { id: 'verse', label: 'Verso Pulsante', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Dançante', startMeasure: 9, endMeasure: 12, dynamic: 'ff' },
    ],
    lyrics: [
      { text: "I get up in the evening and I ain't got nothin' to say", startBeat: 17, endBeat: 25, startMeasure: 5, lineType: 'verse' },
      { text: "I come home in the mornin', I go to bed feelin' the same way", startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: "You can't start a fire sittin' 'round cryin' over a broken heart", startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: "This gun's for hire, even if we're just dancin' in the dark", startBeat: 41, endBeat: 49, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
