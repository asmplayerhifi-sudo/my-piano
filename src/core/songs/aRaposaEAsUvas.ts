import type { RepertoireSong } from '../repertoireData';

export const A_RAPOSA_E_AS_UVAS: RepertoireSong = {
  id: 'a-raposa-e-as-uvas',
  title: 'A Raposa e as Uvas',
  composerOrArtist: 'Reginaldo Rossi',
  genre: 'Seresta & Brega (Zezo dos Teclados)',
  difficulty: 'Intermediário',
  recommendedBpm: 104,
  timeSignature: '4/4',
  tonality: 'Dó Maior (C)',
  description: 'Um dos maiores clássicos dançantes e bem-humorados de Reginaldo Rossi, lançado em 1982. A música adapta a famosa fábula de Esopo ao romantismo brega pernambucano, conduzida por um ritmo vibrante e contagiante de teclado em Dó Maior (C - G7 - F - Am - Dm) com metais sincopados e refrão irresistível.',
  historicalContext: 'Lançada no álbum "A Raposa e as Uvas" de 1982, tornou-se faixa obrigatória em todas as noites de dança do Norte e Nordeste, frequentemente interpretada por bandas de seresta, forró das antigas e tecladistas de bailes populares.',
  biomechanicsTip: 'Mantenha o pulso leve e ágil na mão esquerda para conduzir o balanço dançante. Na mão direita, destaque os ataques staccato nos metais e a clareza rítmica da melodia vocal.',
  chords: ['C', 'G7', 'F', 'Am', 'Dm'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O tema contagiante de metais e teclado ───
    // Compasso 1 (C)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'G3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'C4' },

    // Compasso 2 (G7)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 3 (F - G7)
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 4, noteName: 'G1', chordName: 'G7' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 4 (C) — Resolução da introdução
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C3' },

    // ─── VERSO (Compassos 5 a 8): "Meu amor, olha só..." ───
    // Compasso 5 (C) — "Meu amor, olha só..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 6 (G7) — "...veja você como é que são as coisas..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'F3' },

    // Compasso 7 (F - G7) — "A raposa olhou pro pé de uva..."
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 4, noteName: 'G1', chordName: 'G7' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 8 (C) — "...e não conseguiu alcançar."
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'C3' },

    // ─── REFRÃO (Compassos 9 a 12): "Estão verdes, disse ela..." ───
    // Compasso 9 (F) — "Estão verdes! Disse a raposa..."
    { midi: 41, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'C2' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'F3' },

    // Compasso 10 (C) — "...pois não podia comer..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 11 (G7) — "E assim é o amor que se perde..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 5, noteName: 'B3' },

    // Compasso 12 (C - Resolução Festiva) — "...quando não se quer reconhecer."
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'C4' },
  ],
  extension: {
    credits: {
      composer: 'Reginaldo Rossi',
      lyricist: 'Reginaldo Rossi',
      originalArtist: 'Reginaldo Rossi',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1982,
      origin: 'Brasil / Brega Pop, Seresta & Ritmos do Nordeste',
      notes: 'Transcrição didática adaptada para teclado arranjador e piano.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Dançante de Metais', startMeasure: 1, endMeasure: 4, dynamic: 'f' },
      { id: 'verse', label: 'Verso Fábula de Esopo', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão da Raposa', startMeasure: 9, endMeasure: 12, dynamic: 'ff' },
    ],
    lyrics: [
      { text: 'Meu amor, olha só, veja você como é que são as coisas', startBeat: 17, endBeat: 25, startMeasure: 5, lineType: 'verse' },
      { text: 'A raposa olhou pro pé de uva e não conseguiu alcançar', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: 'Estão verdes! Disse a raposa, pois não podia comer', startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: 'E assim é o amor que se perde quando não se quer reconhecer', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
