import type { RepertoireSong } from '../repertoireData';

export const LIKE_A_ROLLING_STONE: RepertoireSong = {
  id: 'like-a-rolling-stone',
  title: 'Like a Rolling Stone',
  composerOrArtist: 'Bob Dylan',
  genre: 'Pop & Rock Clássico',
  difficulty: 'Intermediário',
  recommendedBpm: 96,
  timeSignature: '4/4',
  tonality: 'Dó Maior (C)',
  description: 'Considerada uma das canções mais influentes da história da música ocidental (1965). Destaca-se pela progressão harmônica ascendente em Dó Maior (C - Dm - Em - F - G), o órgão Hammond de Al Kooper e o piano de Paul Griffin dialogando com a melodia incisiva de Dylan.',
  historicalContext: 'Lançada em julho de 1965 no revolucionário álbum Highway 61 Revisited. Mudou para sempre a estrutura do rádio ao romper o limite de 3 minutos (com mais de 6 minutos de duração) e elevar a composição popular ao status literário.',
  biomechanicsTip: 'A mão esquerda conduz a linha de baixo diatônica ascendente (C - D - E - F - G). A mão direita deve articular os acordes com swing solto e ataques pontuais nos tempos 2 e 4.',
  chords: ['C', 'Dm', 'Em', 'F', 'G'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 2) — Ataque de Caixa e Órgão C ───
    // Compasso 1 (C - F)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 53, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'F2', chordName: 'F' },
    { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 2 (G)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'G3' },

    // ─── VERSO (Compassos 3 a 6): "Once upon a time you dressed so fine..." ───
    // Compasso 3 (C - Dm) — Linha Ascendente
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 4, noteName: 'D2', chordName: 'Dm' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 4 (Em - F) — "...threw the bums a dime in your prime..."
    { midi: 52, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 3, noteName: 'E2', chordName: 'Em' },
    { midi: 53, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 2, noteName: 'F2', chordName: 'F' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 5 (G) — "...didn't you?"
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'G3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 6 (G)
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'D3' },

    // ─── PRÉ-REFRÃO / REFRÃO (Compassos 7 a 10): "How does it feel?..." ───
    // Compasso 7 (C - F)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 53, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'F2', chordName: 'F' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 8 (G) — "How does it feel?"
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 9 (C - F) — "To be without a home, like a complete unknown..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 53, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'F2', chordName: 'F' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 10 (G - C) — "Like a rolling stone!"
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 1, noteName: 'C2', chordName: 'C' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'C3' },
  ],
  extension: {
    credits: {
      composer: 'Bob Dylan',
      lyricist: 'Bob Dylan',
      originalArtist: 'Bob Dylan',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1965,
      origin: 'EUA / Folk Rock & Classic Rock',
      notes: 'Transcrição didática para teclado e piano com harmonização completa.',
    },
    sections: [
      { id: 'intro', label: 'Introdução em Dó Maior', startMeasure: 1, endMeasure: 2, dynamic: 'f' },
      { id: 'verse', label: 'Verso Ascendente', startMeasure: 3, endMeasure: 6, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Histórico', startMeasure: 7, endMeasure: 10, dynamic: 'ff' },
    ],
    lyrics: [
      { text: 'Once upon a time you dressed so fine', startBeat: 9, endBeat: 13, startMeasure: 3, lineType: 'verse' },
      { text: 'Threw the bums a dime in your prime, did you not?', startBeat: 13, endBeat: 21, startMeasure: 4, lineType: 'verse' },
      { text: 'How does it feel?', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'chorus' },
      { text: 'To be on your own, with no direction home', startBeat: 33, endBeat: 37, startMeasure: 9, lineType: 'chorus' },
      { text: 'Like a rolling stone!', startBeat: 37, endBeat: 40, startMeasure: 10, lineType: 'chorus' },
    ],
  },
};
