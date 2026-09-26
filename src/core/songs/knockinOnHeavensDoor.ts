import type { RepertoireSong } from '../repertoireData';

export const KNOCKIN_ON_HEAVENS_DOOR: RepertoireSong = {
  id: 'knockin-on-heavens-door',
  title: "Knockin' on Heaven's Door",
  composerOrArtist: 'Bob Dylan',
  genre: 'Pop & Rock Clássico',
  difficulty: 'Iniciante',
  recommendedBpm: 68,
  timeSignature: '4/4',
  tonality: 'Sol Maior (G)',
  description: 'Um dos hinos mais tocados e regravados do cancioneiro mundial. Composta para o filme Pat Garrett and Billy the Kid (1973), apresenta a comovente alternância harmônica em Sol Maior (G - D - Am7 / G - D - C) em andamento lento e solene.',
  historicalContext: 'Composta em 1973 por Bob Dylan para a trilha sonora do faroeste dirigido por Sam Peckinpah. O tema retrata a morte de um xerife idoso que se despede de sua esposa em frente ao pôr do sol.',
  biomechanicsTip: 'Mantenha os movimentos de pulso amplos e suaves. Os acordes de mão esquerda devem soar homogêneos e sustentados com pedal de sustain.',
  chords: ['G', 'D', 'Am', 'C'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 2) ───
    // Compasso 1 (G - D)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 59, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F#3' },

    // Compasso 2 (Am)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
    { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E3' },

    // ─── VERSO (Compassos 3 a 6): "Mama, take this badge off of me..." ───
    // Compasso 3 (G - D)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 4 (Am) — "I can't use it anymore..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 1.5, beat: 3.5, measure: 4, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 5 (G - D) — "It's gettin' dark, too dark to see..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'D3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 6 (C) — "Feel I'm knockin' on heaven's door..."
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 3, noteName: 'C2', chordName: 'C' },
    { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 1, noteName: 'C3' },

    // ─── REFRÃO (Compassos 7 a 10): "Knock, knock, knockin' on heaven's door..." ───
    // Compasso 7 (G - D)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 3.5, measure: 7, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 8 (Am)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 4, noteName: 'A1', chordName: 'Am' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 9 (G - D)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'D2', chordName: 'D' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2.5, measure: 9, fingerRightHand: 4, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1.5, beat: 3.5, measure: 9, fingerRightHand: 3, noteName: 'F#3' },

    // Compasso 10 (C) — Resolução
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 3, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'C3' },
  ],
  extension: {
    credits: {
      composer: 'Bob Dylan',
      lyricist: 'Bob Dylan',
      originalArtist: 'Bob Dylan',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1973,
      origin: 'EUA / Soundtrack & Classic Rock',
      notes: 'Transcrição didática simplificada e fiel para teclado iniciante.',
    },
    sections: [
      { id: 'intro', label: 'Introdução em Sol Maior', startMeasure: 1, endMeasure: 2, dynamic: 'mp' },
      { id: 'verse', label: 'Verso Emotivo', startMeasure: 3, endMeasure: 6, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Coral', startMeasure: 7, endMeasure: 10, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'Mama, take this badge off of me', startBeat: 9, endBeat: 13, startMeasure: 3, lineType: 'verse' },
      { text: "I can't use it anymore", startBeat: 13, endBeat: 17, startMeasure: 4, lineType: 'verse' },
      { text: "It's gettin' dark, too dark to see", startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: "Feel I'm knockin' on heaven's door", startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: "Knock, knock, knockin' on heaven's door", startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'chorus' },
      { text: "Knock, knock, knockin' on heaven's door", startBeat: 33, endBeat: 40, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
