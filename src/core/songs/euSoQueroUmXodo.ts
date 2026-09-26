import type { RepertoireSong } from '../repertoireData';

export const EU_SO_QUERO_UM_XODO: RepertoireSong = {
  id: 'eu-so-quero-um-xodo',
  title: 'Eu Só Quero um Xodó',
  composerOrArtist: 'Dominguinhos & Anastácia',
  genre: 'Forró, Xote & Baião',
  difficulty: 'Intermediário',
  recommendedBpm: 84,
  timeSignature: '4/4',
  tonality: 'Lá Maior (A)',
  description: 'O hino supremo do xote brasileiro, composto em 1973 pelo mestre Dominguinhos e pela cantora Anastácia. Famoso pela batida cadenciada e dançante de zabumba e triângulo, contracantos inconfundíveis de sanfona e uma melodia romântica que atravessou gerações na voz de Gilberto Gil.',
  historicalContext: 'Lançada em 1973, a música consagrou Dominguinhos como o herdeiro musical de Luiz Gonzaga e foi gravada por mais de 50 artistas nacionais e internacionais.',
  biomechanicsTip: 'A mão esquerda sustenta o balanço leve e contagiante do xote com alternância de baixo e acorde. Na mão direita, mantenha articulação solta e flexível nos dedos 2, 3 e 4 para garantir o swing nordestino.',
  chords: ['A', 'E7', 'D', 'Bm'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O balanço contagiante do xote de Dominguinhos ───
    // Compasso 1 (A)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'A3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 2 (E7)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 3 (D - E7)
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 4 (A) — Resolução da introdução
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A3' },

    // ─── TEMA / ESTROFE (Compassos 5 a 8): "Que falta eu sinto de um bem..." ───
    // Compasso 5 (A) — "Que falta eu sinto de um bem..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'B3' },
    { midi: 73, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 73, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 4, noteName: 'C#4' },

    // Compasso 6 (E7) — "...que falta me faz um xodó..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 7 (D - E7) — "Mas como eu não tenho ninguém..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 8 (A) — "...eu vivo sozinho no mundo..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'A3' },

    // ─── REFRÃO (Compassos 9 a 12): "Eu só quero um amor..." ───
    // Compasso 9 (D) — "Eu só quero um amor..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 10 (A) — "...que acabe com o meu sofrer..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 1, noteName: 'A3' },

    // Compasso 11 (E7) — "Um xodó pra mim..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'C#4' },

    // Compasso 12 (A - Resolução) — "...do meu coração."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'A3' },
  ],
  extension: {
    credits: {
      composer: 'Dominguinhos & Anastácia',
      lyricist: 'Anastácia',
      originalArtist: 'Dominguinhos / Gilberto Gil',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1973,
      origin: 'Brasil / Xote Tradicional & MPB',
      notes: 'Transcrição didática adaptada para teclado e piano com swing de xote.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Balanço do Xote', startMeasure: 1, endMeasure: 4, dynamic: 'mf' },
      { id: 'verse', label: 'Verso Romântico do Sertão', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão do Xodó', startMeasure: 9, endMeasure: 12, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'Que falta eu sinto de um bem', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Que falta me faz um xodó', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'Mas como eu não tenho ninguém', startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'verse' },
      { text: 'Eu vivo sozinho no mundo', startBeat: 29, endBeat: 33, startMeasure: 8, lineType: 'verse' },
      { text: 'Eu só quero um amor que acabe com o meu sofrer, um xodó pra mim', startBeat: 33, endBeat: 48, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
