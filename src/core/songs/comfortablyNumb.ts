import type { RepertoireSong } from '../repertoireData';

export const COMFORTABLY_NUMB: RepertoireSong = {
  id: 'comfortably-numb',
  title: 'Comfortably Numb',
  composerOrArtist: 'Pink Floyd (David Gilmour & Roger Waters)',
  genre: 'Rock Psicodelico & Progressivo',
  difficulty: 'Intermediário',
  recommendedBpm: 65,
  timeSignature: '4/4',
  tonality: 'Si menor (Bm) / Ré Maior (D)',
  description: 'Uma das obras-primas do rock progressivo do álbum The Wall (1979). Alterna a atmosfera reflexiva em Si menor com o refrão luminoso e épico em Ré Maior, com arpejos solenes na mão esquerda e fraseado melódico expressivo na mão direita.',
  historicalContext: 'Composta por David Gilmour (música) e Roger Waters (letra) para o álbum duplo conceitual The Wall (1979). Os solos de guitarra de Gilmour são considerados entre os maiores de todos os tempos.',
  biomechanicsTip: 'Na mão esquerda, mantenha os dedos relaxados para sustentar as fundamentais e quintas. Na mão direita, utilize peso de braço para dar sustentação às notas longas e expressividade cantabile.',
  chords: ['Bm', 'A', 'G', 'Em', 'D', 'C'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 2) — Si menor atmosférico ───
    // Compasso 1 (Bm)
    { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
    { midi: 54, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'F#2' },
    { midi: 59, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F#3' },

    // Compasso 2 (A)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 61, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'C#3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E3' },

    // ─── VERSO 1 (Compassos 3 a 6): "Hello? Is there anybody in there?..." ───
    // Compasso 3 (Bm)
    { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
    { midi: 54, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'F#2' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2.5, measure: 3, fingerRightHand: 4, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3.5, measure: 3, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 4 (A) — "Just nod if you can hear me..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D3' },
    { midi: 61, clef: 'treble', duration: 1.5, beat: 3.5, measure: 4, fingerRightHand: 1, noteName: 'C#3' },

    // Compasso 5 (G) — "Is there anyone at home?..."
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 1, noteName: 'D2' },
    { midi: 59, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 1.5, beat: 2.5, measure: 5, fingerRightHand: 2, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 6 (Em - Bm)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 3, noteName: 'B1', chordName: 'Bm' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'D3' },
    { midi: 59, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'B2' },

    // ─── REFRÃO (Compassos 7 a 10): "There is no pain you are receding..." ───
    // Compasso 7 (D)
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 7, fingerRightHand: 5, noteName: 'A3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 8 (A)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'E3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 9 (D) — "A distant ship smoke on the horizon..."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'A3' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 10 (A)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'E3' },
    { midi: 61, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'C#3' },

    // ─── CLÍMAX DO REFRÃO (Compassos 11 a 12): "I have become comfortably numb" ───
    // Compasso 11 (G - D)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 11, fingerRightHand: 3, noteName: 'E3' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 4, noteName: 'F#3' },

    // Compasso 12 (C - Bm)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 3, noteName: 'C2', chordName: 'C' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 4, noteName: 'B1', chordName: 'Bm' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'E3' },
    { midi: 59, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'B2' },
  ],
  extension: {
    credits: {
      composer: 'David Gilmour & Roger Waters',
      lyricist: 'Roger Waters',
      originalArtist: 'Pink Floyd',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1979,
      origin: 'Reino Unido / Progressive Rock',
      notes: 'Transcrição didática autorizada para teclado e piano acústico com pauta dupla.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Atmosférica', startMeasure: 1, endMeasure: 2, dynamic: 'p' },
      { id: 'verse1', label: 'Verso 1 (Roger Waters)', startMeasure: 3, endMeasure: 6, dynamic: 'mp' },
      { id: 'chorus', label: 'Refrão Épico (David Gilmour)', startMeasure: 7, endMeasure: 10, dynamic: 'f' },
      { id: 'outro', label: 'Resolução & Clímax', startMeasure: 11, endMeasure: 12, dynamic: 'ff' },
    ],
    lyrics: [
      { text: 'Hello? Is there anybody in there?', startBeat: 9, endBeat: 13, startMeasure: 3, lineType: 'verse' },
      { text: 'Just nod if you can hear me...', startBeat: 13, endBeat: 17, startMeasure: 4, lineType: 'verse' },
      { text: 'Is there anyone at home?', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'There is no pain you are receding', startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'chorus' },
      { text: 'A distant ship smoke on the horizon', startBeat: 33, endBeat: 37, startMeasure: 9, lineType: 'chorus' },
      { text: 'I have become comfortably numb', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
