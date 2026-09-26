import type { RepertoireSong } from '../repertoireData';

export const RIDERS_ON_THE_STORM: RepertoireSong = {
  id: 'riders-on-the-storm',
  title: 'Riders on the Storm',
  composerOrArtist: 'The Doors (Jim Morrison & Ray Manzarek)',
  genre: 'Rock Psicodelico & Progressivo',
  difficulty: 'Intermediário',
  recommendedBpm: 104,
  timeSignature: '4/4',
  tonality: 'Mi menor (Em)',
  description: 'A última gravação clássica de Jim Morrison com o The Doors (1971). Apresenta a lendária levada de piano elétrico Rhodes com arpejos em cascata simulando gotas de chuva e uma envolvente linha de baixo jazz/blues em Mi menor.',
  historicalContext: 'Lançada no álbum L.A. Woman (1971), gravada pouco antes da morte de Jim Morrison em Paris. O som real de chuva e trovões foi sobreposto aos solos de piano elétrico Fender Rhodes de Ray Manzarek.',
  biomechanicsTip: 'Na mão direita, mantenha os dedos ágeis e suaves para criar o efeito contínuo de gotas de chuva em staccato aveludado. A mão esquerda caminha com swing relaxado.',
  chords: ['Em', 'A', 'Am', 'C', 'D'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 4) — Chuva e Rhodes Jazz Motif ───
    // Compasso 1 (Em)
    { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 47, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 1, noteName: 'B1' },
    { midi: 45, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'A1' },
    { midi: 43, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 3, noteName: 'G1' },
    { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'G3' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 2 (A / Em)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'A1', chordName: 'A' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'E3' },
    { midi: 66, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 3 (Em) — Motivo das gotas de chuva
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 1, noteName: 'B1' },
    { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 2, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 4 (Em)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E3' },

    // ─── VERSO (Compassos 5 a 8): "Riders on the storm..." ───
    // Compasso 5 (Em)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 5, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 5, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 6 (Em) — "Riders on the storm..."
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 7 (Am) — "Into this house we're born..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 7, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 8 (Em) — "Into this world we're thrown..."
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 8, fingerRightHand: 1, noteName: 'D3' },
    { midi: 59, clef: 'treble', duration: 1.5, beat: 3.5, measure: 8, fingerRightHand: 1, noteName: 'B2' },

    // ─── SEÇÃO B (Compassos 9 a 12): "Like a dog without a bone..." ───
    // Compasso 9 (D)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 10 (C) — "An actor out on loan..."
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 5, noteName: 'G3' },

    // Compasso 11 (Em) — "Riders on the storm"
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 11, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 12 (Em) — Desfecho
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'B2' },
    { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'E3' },
  ],
  extension: {
    credits: {
      composer: 'The Doors (Jim Morrison, Ray Manzarek, Robby Krieger, John Densmore)',
      originalArtist: 'The Doors',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1971,
      origin: 'EUA / Jazz Rock & Psychedelic',
      notes: 'Transcrição do arranjo de piano elétrico Rhodes com clave dupla.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Rhodes & Chuva', startMeasure: 1, endMeasure: 4, dynamic: 'p' },
      { id: 'verse', label: 'Verso Modal', startMeasure: 5, endMeasure: 8, dynamic: 'mp' },
      { id: 'chorus', label: 'Reflexão & Clímax', startMeasure: 9, endMeasure: 12, dynamic: 'mf' },
    ],
    lyrics: [
      { text: 'Riders on the storm', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Riders on the storm', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: "Into this house we're born", startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'verse' },
      { text: "Into this world we're thrown", startBeat: 29, endBeat: 33, startMeasure: 8, lineType: 'verse' },
      { text: 'Like a dog without a bone', startBeat: 33, endBeat: 37, startMeasure: 9, lineType: 'chorus' },
      { text: 'An actor out on loan', startBeat: 37, endBeat: 41, startMeasure: 10, lineType: 'chorus' },
      { text: 'Riders on the storm', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
