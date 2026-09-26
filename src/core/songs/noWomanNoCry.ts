import type { RepertoireSong } from '../repertoireData';

export const NO_WOMAN_NO_CRY: RepertoireSong = {
  id: 'no-woman-no-cry',
  title: 'No Woman No Cry',
  composerOrArtist: 'Bob Marley & The Wailers',
  genre: 'Reggae & Praieiro',
  difficulty: 'Iniciante',
  recommendedBpm: 78,
  timeSignature: '4/4',
  tonality: 'Dó Maior (C)',
  description: 'Uma das canções mais célebres de todos os tempos. Lançada em 1974 no álbum Natty Dread e imortalizada na gravação ao vivo no Lyceum Theatre de Londres em 1975. Destaca-se pela progressão descendente clássica em Dó Maior (C - G/B - Am - F) com sabor gospel, andamento solene e melodia profundamente comovente.',
  historicalContext: 'Composta por Bob Marley em Trenchtown, bairro humilde de Kingston onde cresceu. Os créditos foram creditados por Marley a Vincent Ford ("Tata"), amigo que mantinha uma cozinha comunitária em Trenchtown, garantindo os royalties para a subsistência do projeto social.',
  biomechanicsTip: 'A mão esquerda conduz o baixo com linha descendente suave e expressiva. Na mão direita, toque os acordes no órgão/piano com toque aveludado e relaxado.',
  chords: ['C', 'G', 'Am', 'F'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 4) — A célebre progressão descendente de Trenchtown ───
    // Compasso 1 (C - G/B)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 4, noteName: 'B1', chordName: 'G/B' },
    { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G3' },
    { midi: 59, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G3' },

    // Compasso 2 (Am - F)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A3' },
    { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 3 (C - F)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 4 (C - G)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D3' },

    // ─── REFRÃO (Compassos 5 a 8): "No woman, no cry..." ───
    // Compasso 5 (C - G/B) — "No woman..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 4, noteName: 'B1', chordName: 'G/B' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 6 (Am - F) — "...no cry!"
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 65, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 1.5, beat: 3.5, measure: 6, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 7 (C - F) — "No woman, no cry..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 8 (C - G) — Resolução
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 4, noteName: 'G1', chordName: 'G' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C3' },

    // ─── VERSO (Compassos 9 a 12): "'Cause I remember when we used to sit..." ───
    // Compasso 9 (C - G/B)
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 4, noteName: 'B1', chordName: 'G/B' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 10 (Am - F) — "In the government yard in Trenchtown..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 41, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 60, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'C3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 2.5, measure: 10, fingerRightHand: 1, noteName: 'C3' },
    { midi: 65, clef: 'treble', duration: 1.5, beat: 3.5, measure: 10, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 11 (C - G/B) — "Observing the hypocrites..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 4, noteName: 'B1', chordName: 'G/B' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 12 (Am - F - C) — "...as they would mingle with the good people we meet"
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'C3' },
    { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'C3' },
  ],
  extension: {
    credits: {
      composer: 'Bob Marley & Vincent Ford',
      lyricist: 'Bob Marley',
      originalArtist: 'Bob Marley & The Wailers',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1974,
      origin: 'Jamaica / Roots Reggae & Gospel Soul',
      notes: 'Transcrição didática adaptada para teclado iniciante.',
    },
    sections: [
      { id: 'intro', label: 'Introdução em Dó Maior Descendente', startMeasure: 1, endMeasure: 4, dynamic: 'mp' },
      { id: 'chorus', label: 'Refrão Histórico', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'verse', label: 'Verso Nostálgico', startMeasure: 9, endMeasure: 12, dynamic: 'mf' },
    ],
    lyrics: [
      { text: 'No woman, no cry', startBeat: 17, endBeat: 25, startMeasure: 5, lineType: 'chorus' },
      { text: 'No woman, no cry', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'chorus' },
      { text: "'Cause I remember when we used to sit", startBeat: 33, endBeat: 37, startMeasure: 9, lineType: 'verse' },
      { text: 'In the government yard in Trenchtown', startBeat: 37, endBeat: 41, startMeasure: 10, lineType: 'verse' },
      { text: 'Observing the hypocrites as they would mingle with the good people we meet', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'verse' },
    ],
  },
};
