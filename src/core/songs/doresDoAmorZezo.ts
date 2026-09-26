import type { RepertoireSong } from '../repertoireData';

export const DORES_DO_AMOR_ZEZO: RepertoireSong = {
  id: 'dores-do-amor-zezo',
  title: 'As Dores do Amor',
  composerOrArtist: 'Zezo Potiguar (Zezo dos Teclados)',
  genre: 'Seresta & Brega (Zezo dos Teclados)',
  difficulty: 'Intermediário',
  recommendedBpm: 100,
  timeSignature: '4/4',
  tonality: 'Lá menor (Am)',
  description: 'Um dos maiores clássicos dos bailes de seresta e da carreira de Zezo Potiguar, o Príncipe dos Teclados. Destaca-se pela introdução inconfundível executada em timbres clássicos de teclado arranjador (sax/synth lead e strings), com harmonia apaixonada em Lá menor (Am - Dm - G - C - F - E7) e andamento envolvente de seresta brega.',
  historicalContext: 'Imortalizada na interpretação dramática e emotiva de Zezo dos Teclados no Rio Grande do Norte e em todo o Nordeste brasileiro, tornou-se presença obrigatória nos shows de seresta, vaquejadas e botecos românticos.',
  biomechanicsTip: 'A mão esquerda sustenta o pulso de seresta/bolero com baixo e acorde sincronizados. Na mão direita, trabalhe a agilidade no fraseado característico da introdução de teclado e sustente com expressividade a melodia cantada.',
  chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O clássico solo de teclado de Zezo ───
    // Compasso 1 (Am)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'C4' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 2 (Dm)
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 3 (E7)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 4 (Am) — Resolução da introdução
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'A3' },

    // ─── VERSO (Compassos 5 a 8): "Eu já sofri demais por esse amor..." ───
    // Compasso 5 (Am) — "Eu já sofri demais..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'C4' },
    { midi: 72, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 6 (Dm) — "...e as dores desse amor não têm perdão..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 7 (E7) — "Por onde andará quem me jurou paixão..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 8 (Am) — "...e só deixou saudade e solidão?"
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'A3' },

    // ─── REFRÃO (Compassos 9 a 12): "Dores do amor, dor que não passa..." ───
    // Compasso 9 (Dm - G) — "Dores do amor..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'Dm' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 10 (C - F) — "...que machuca o coração!"
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 3, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'A3' },

    // Compasso 11 (E7) — "Bebo no bar pra tentar esquecer..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 12 (Am - Resolução Dramática)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'A3' },
  ],
  extension: {
    credits: {
      composer: 'Tradicional Seresta Nordestina',
      lyricist: 'Tradicional Seresta Nordestina',
      originalArtist: 'Zezo Potiguar (Zezo dos Teclados)',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 2002,
      origin: 'Brasil / Seresta, Brega & Teclado Arranjador',
      notes: 'Transcrição didática com clave dupla destacando a condução de teclado seresta.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Teclado Seresta', startMeasure: 1, endMeasure: 4, dynamic: 'f' },
      { id: 'verse', label: 'Verso Apaixonado', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão da Seresta', startMeasure: 9, endMeasure: 12, dynamic: 'ff' },
    ],
    lyrics: [
      { text: 'Eu já sofri demais por esse amor', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'E as dores desse amor não têm perdão', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'Por onde andará quem me jurou paixão', startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'verse' },
      { text: 'E só deixou saudade e solidão?', startBeat: 29, endBeat: 33, startMeasure: 8, lineType: 'verse' },
      { text: 'Dores do amor que machuca o coração, bebo no bar pra tentar esquecer', startBeat: 33, endBeat: 48, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
