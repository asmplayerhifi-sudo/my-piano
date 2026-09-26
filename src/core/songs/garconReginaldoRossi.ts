import type { RepertoireSong } from '../repertoireData';

export const GARCON_REGINALDO_ROSSI: RepertoireSong = {
  id: 'garcon-reginaldo-rossi',
  title: 'Garçon',
  composerOrArtist: 'Reginaldo Rossi (O Rei do Brega)',
  genre: 'Seresta & Brega (Zezo dos Teclados)',
  difficulty: 'Intermediário',
  recommendedBpm: 98,
  timeSignature: '4/4',
  tonality: 'Ré menor (Dm)',
  description: 'O hino máximo da música brega e da seresta brasileira, composto e gravado em 1987 por Reginaldo Rossi. A obra combina a atmosfera intimista de um desabafo na mesa de bar com acordes dramáticos de piano e órgão em Ré menor (Dm - Gm - A7 - C - F - Bb) e um refrão apoteótico cantado em uníssono em todo o país.',
  historicalContext: 'Lançada em 1987 no álbum "Teu Melhor Amigo", a canção tornou-se um fenômeno cultural nacional definitivo, transformando Reginaldo Rossi no eterno "Rei do Brega" e sendo regravada em ritmo de seresta por Zezo e dezenas de intérpretes.',
  biomechanicsTip: 'A mão esquerda deve tocar com peso e solenidade, dando o chão harmônico da canção com fundamentais e quintas bem marcadas. A mão direita precisa alternar entre o estilo falado-cantado (rubato expressivo) nos versos e acordes cheios e firmes no refrão.',
  chords: ['Dm', 'Gm', 'A7', 'C', 'F', 'Bb'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O clima de bar e piano dramático ───
    // Compasso 1 (Dm)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'D3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'F3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 2 (Gm)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
    { midi: 58, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'Bb2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'G3' },
    { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'Bb3' },

    // Compasso 3 (A7)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A1', chordName: 'A7' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 4 (Dm) — Resolução
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'D3' },

    // ─── VERSO (Compassos 5 a 8): "Garçon, aqui nessa mesa de bar..." ───
    // Compasso 5 (Dm) — "Garçon, aqui nessa mesa de bar..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'D3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'F3' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'A3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 6 (Gm) — "...você já sabe que eu venho pra beber..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'Bb3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 7 (A7) — "Garçon, traz mais uma garrafa..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 4, noteName: 'A1', chordName: 'A7' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'A3' },
    { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'Bb3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 8 (Dm) — "...que hoje eu quero esquecer."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'F3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'D3' },

    // ─── REFRÃO (Compassos 9 a 12): "Garçon, olhe pelo espelho..." ───
    // Compasso 9 (Gm - C) — "Garçon! Olhe pelo espelho..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'C2', chordName: 'C' },
    { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'Bb3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 5, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 10 (F - Bb) — "...a mulher que eu amo..."
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 46, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 3, noteName: 'Bb1', chordName: 'Bb' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'A3' },
    { midi: 65, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 1, noteName: 'F3' },

    // Compasso 11 (A7) — "...está com outro ali!"
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'A1', chordName: 'A7' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 4, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 12 (Dm - Resolução Trágica)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'D3' },
  ],
  extension: {
    credits: {
      composer: 'Reginaldo Rossi',
      lyricist: 'Reginaldo Rossi',
      originalArtist: 'Reginaldo Rossi',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1987,
      origin: 'Brasil / Brega Romântico & Seresta',
      notes: 'Transcrição didática com clave dupla para piano e teclado.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Melodramática de Bar', startMeasure: 1, endMeasure: 4, dynamic: 'mp' },
      { id: 'verse', label: 'Verso Desabafo', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Apoteótico', startMeasure: 9, endMeasure: 12, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'Garçon, aqui nessa mesa de bar', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Você já sabe que eu venho pra beber', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'Garçon, traz mais uma garrafa que hoje eu quero esquecer', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: 'Garçon! Olhe pelo espelho a mulher que eu amo', startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: 'Está com outro ali!', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
