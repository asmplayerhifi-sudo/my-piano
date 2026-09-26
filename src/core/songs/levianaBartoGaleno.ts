import type { RepertoireSong } from '../repertoireData';

export const LEVIANA_BARTO_GALENO: RepertoireSong = {
  id: 'leviana-barto-galeno',
  title: 'Leviana',
  composerOrArtist: 'Bartô Galeno / Reginaldo Rossi',
  genre: 'Seresta & Brega (Zezo dos Teclados)',
  difficulty: 'Intermediário',
  recommendedBpm: 96,
  timeSignature: '4/4',
  tonality: 'Lá menor (Am)',
  description: 'Um dos maiores clássicos confessionais da música romântica brega e da seresta brasileira, imortalizada na voz pungente do paraibano Bartô Galeno e regravada com brilhantismo por Reginaldo Rossi e Zezo dos Teclados. Destaca-se pelo lamento melódico em Lá menor (Am - Dm - E7 - G - C), ritmo cadenciado de seresta e refrão comovente de desilusão amorosa.',
  historicalContext: 'Lançada em 1980 no LP "No Toca-Fita do Meu Carro", consagrou Bartô Galeno em todo o território nacional como um dos grandes compositores e trovadores da dor-de-cotovelo do cancioneiro popular.',
  biomechanicsTip: 'A mão esquerda sustenta o pulso de seresta/bolero com notas graves firmes nos tempos 1 e 3. Na mão direita, trabalhe o fraseado expressivo (rubato sutil) nos dedos 1 a 4 para transmitir toda a carga emocional da interpretação.',
  chords: ['Am', 'Dm', 'E7', 'G', 'C', 'F'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O tema nostálgico e melancólico de seresta ───
    // Compasso 1 (Am)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'C4' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 3.5, measure: 1, fingerRightHand: 5, noteName: 'E4' },

    // Compasso 2 (Dm)
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 2, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 3 (E7)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 4 (Am) — Resolução da introdução
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'A3' },

    // ─── VERSO (Compassos 5 a 8): "Você foi a mulher mais amada..." ───
    // Compasso 5 (Am) — "Você foi a mulher mais amada..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'C4' },
    { midi: 72, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 6 (Dm) — "...que este mundo já conheceu..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 7 (E7) — "Mas você não valia nada..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 8 (Am) — "...e me esqueceu."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'A3' },

    // ─── REFRÃO (Compassos 9 a 12): "Leviana, você me enganou..." ───
    // Compasso 9 (Dm - G) — "Leviana! Você me enganou..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 10 (C - F) — "...brincou com os meus sentimentos..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 3, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'A3' },

    // Compasso 11 (E7) — "E hoje eu choro de dor..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 12 (Am - Resolução Sentimental) — "...neste triste momento."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'A3' },
  ],
  extension: {
    credits: {
      composer: 'Bartô Galeno',
      lyricist: 'Bartô Galeno',
      originalArtist: 'Bartô Galeno / Reginaldo Rossi / Zezo',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1980,
      origin: 'Brasil / Brega Romântico, Canção de Seresta & Nordeste',
      notes: 'Transcrição didática adaptada para teclado e piano com clave dupla.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Melancólica de Seresta', startMeasure: 1, endMeasure: 4, dynamic: 'mp' },
      { id: 'verse', label: 'Verso Desabafo de Amor', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão da Leviana', startMeasure: 9, endMeasure: 12, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'Você foi a mulher mais amada que este mundo já conheceu', startBeat: 17, endBeat: 25, startMeasure: 5, lineType: 'verse' },
      { text: 'Mas você não valia nada e me esqueceu', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: 'Leviana! Você me enganou, brincou com os meus sentimentos', startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: 'E hoje eu choro de dor neste triste momento', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
