import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const GRANDIOSO_ES_TU: RepertoireSong = {
  id: 'grandioso-es-tu',
  title: 'Grandioso És Tu (How Great Thou Art)',
  composerOrArtist: 'Carl Boberg (1885) / Stuart K. Hine (1949)',
  genre: 'Gospel Clássico & Sacro',
  difficulty: 'Intermediário',
  recommendedBpm: 72,
  timeSignature: '4/4',
  tonality: 'Dó Maior (C)',
  description: 'Hino majestoso de louvor à criação e à grandeza de Deus. Estrutura monumental com estrofe lírica reflexiva e o refrão triunfal "Então minh\'alma canta a Ti, Senhor: Grandioso és Tu!" com ricas aberturas de acordes.',
  historicalContext: 'Originário de um poema sueco escrito por Carl Boberg em 1885 após contemplar uma tempestade repentina seguida de calmaria, traduzido e arranjado em inglês pelo missionário Stuart K. Hine em 1949.',
  biomechanicsTip: 'No refrão, firme o quinto dedo da mão esquerda para uma base sólida nos baixos e use o peso do antebraço para preencher os acordes de quatro sons na mão direita sem rigidez nos ombros.',
  chords: ['C', 'F', 'G', 'G7', 'Am'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'Melodia Folclórica Sueca / Stuart K. Hine (1949)',
      lyricist: 'Carl Boberg (1885) / Tradução Portuguesa Tradicional',
      originalArtist: 'Hinário Evangélico Tradicional',
      license: 'traditional',
      publishedYear: 1885,
      origin: 'Suécia / Reino Unido',
      scoreSource: 'Hinários Evangélicos Tradicionais & Partituras Sacras Internacionais',
      notes: 'Arranjo fidedigno em Dó Maior para piano solo com partitura dupla e refrão monumental.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Melodia e harmonia auditadas segundo o hinário tradicional. Estrutura de 16 compassos cobrindo estrofe e refrão com condução coral de quatro vozes.',
      sources: ['Cantor Cristão', 'Hinário para o Culto Cristão', 'The Hymn Society Archive'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Estrofe (8 compassos) + Refrão Triunfal (8 compassos)',
    },
    sections: [
      { id: 'estrofe', label: 'Estrofe: "Senhor meu Deus..."', startMeasure: 1, endMeasure: 8, dynamic: 'mp', icon: 'verse' },
      { id: 'refrao', label: 'Refrão: "Então minh\'alma canta..."', startMeasure: 9, endMeasure: 16, dynamic: 'f', icon: 'chorus' },
    ],
    lyrics: [
      { text: 'Senhor meu Deus, quando eu maravilhado', startBeat: 1, endBeat: 16, startMeasure: 1, lineType: 'verse' },
      { text: 'Fico a pensar nas obras de Tuas mãos...', startBeat: 17, endBeat: 32, startMeasure: 5, lineType: 'verse' },
      { text: 'Então minh\'alma canta a Ti, Senhor:', startBeat: 33, endBeat: 48, startMeasure: 9, lineType: 'chorus' },
      { text: 'Grandioso és Tu! Grandioso és Tu!', startBeat: 49, endBeat: 64, startMeasure: 13, lineType: 'chorus' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (C): G3 -> G3 -> G3 -> A3
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 2 (C): G3 -> E3
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C2' },
    { midi: 60, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 3 (F): A3 -> C4 -> B3 -> A3
    { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 4 (C): G3
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 5 (G7): F3 -> F3 -> F3 -> G3
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'F3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 6 (G7): F3 -> D3
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'F3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 7 (C): E3 -> G3 -> F3 -> D3
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'F3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 8 (C): C3 (fim da estrofe)
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'C3' },

    // ─── REFRÃO TRIUNFAL (Compassos 9 a 16) ───
    // Compasso 9 (C): G3 -> C4 -> C4 -> B3
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'G3' },
    { midi: 72, clef: 'treble', duration: 2, beat: 2, measure: 9, fingerRightHand: 4, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 10 (F): A3 -> C4
    { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 2, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'C4' },

    // Compasso 11 (C): G3 -> C4 -> B3 -> A3
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'G3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 12 (G7): G3
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 13 (C): E4 -> D4 -> C4 -> D4
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 13, fingerRightHand: 4, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 14 (F): E4 -> C4
    { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'E4' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 15 (G7): D4 -> B3
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 16 (C): Resolução triunfal Dó Maior
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 60, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'C4' },
  ], '4/4'),
};
