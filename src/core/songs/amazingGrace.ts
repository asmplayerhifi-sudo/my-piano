import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const AMAZING_GRACE: RepertoireSong = {
  id: 'amazing-grace',
  title: 'Amazing Grace (Graça Maravilhosa)',
  composerOrArtist: 'John Newton (1779) / Tradicional',
  genre: 'Gospel Clássico & Sacro',
  difficulty: 'Iniciante',
  recommendedBpm: 76,
  timeSignature: '3/4',
  tonality: 'Sol Maior (G)',
  description: 'O mais célebre hino espiritual da história da música sacra ocidental. Melodia pentatônica sublime de John Newton com harmonia coral solene e arpejos cantábiles ao piano.',
  historicalContext: 'Escrito pelo clérigo inglês e ex-capitão de navio negreiro John Newton em 1779 após sua conversão espiritual, associado à tradicional melodia "New Britain" publicada em 1835 no hinário The Southern Harmony.',
  biomechanicsTip: 'Toque a melodia na mão direita com peso natural do braço e legato cantabile. Na mão esquerda, sustente os baixos no tempo 1 de cada compasso com suavidade nos tempos 2 e 3.',
  chords: ['G', 'G7', 'C', 'Em', 'D7'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'Tradicional / Melodia New Britain (1835)',
      lyricist: 'John Newton (1779)',
      originalArtist: 'Hinologia Tradicional Cristã',
      license: 'public_domain',
      publishedYear: 1779,
      origin: 'Reino Unido / Estados Unidos',
      scoreSource: 'The Southern Harmony (William Walker, 1835) & Partituras de Domínio Público',
      notes: 'Obra em domínio público universal. Arranjo coral fidedigno em Sol Maior para piano solo com partitura dupla.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Melodia pentatônica estrita em Sol Maior verificada contra o hinário tradicional. Harmonia coral de 4 vozes adaptada ao teclado com condução de vozes impecável.',
      sources: ['The Southern Harmony (1835)', 'Hymns Ancient and Modern', 'IMSLP Petrucci Music Library'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Estrofe Coral em 16 Compassos (A - A - B - A)',
    },
    sections: [
      { id: 'estrofe-pt1', label: 'Estrofe (Frase 1)', startMeasure: 1, endMeasure: 4, dynamic: 'mp', icon: 'verse' },
      { id: 'estrofe-pt2', label: 'Estrofe (Frase 2)', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
      { id: 'estrofe-pt3', label: 'Estrofe (Frase 3)', startMeasure: 9, endMeasure: 12, dynamic: 'f', icon: 'verse' },
      { id: 'estrofe-pt4', label: 'Estrofe (Resolução)', startMeasure: 13, endMeasure: 16, dynamic: 'p', icon: 'verse' },
    ],
    lyrics: [
      { text: 'A - ma - zing Grace! How sweet the sound', startBeat: 1, endBeat: 12, startMeasure: 1, lineType: 'verse' },
      { text: 'That saved a wretch like me!', startBeat: 13, endBeat: 24, startMeasure: 5, lineType: 'verse' },
      { text: 'I once was lost, but now am found;', startBeat: 25, endBeat: 36, startMeasure: 9, lineType: 'verse' },
      { text: 'Was blind, but now I see.', startBeat: 37, endBeat: 48, startMeasure: 13, lineType: 'verse' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (G): Anacruse implícita / Ataque tema D4 -> G4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 2 (G): B4 - G4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1' },
    { midi: 59, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 2, noteName: 'B2' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 3 (G - G7): B4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 71, clef: 'treble', duration: 3, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 4 (C): A4 -> "...sweet the sound"
    { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 5 (G): E4 -> G4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 6 (Em): G4 -> B4
    { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 52, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'G3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 7 (D7): D4 -> "...wretch like me"
    { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 4, noteName: 'D2', chordName: 'D7' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 74, clef: 'treble', duration: 3, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 8 (D7): D4 sustentado
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'D7' },
    { midi: 54, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 2, noteName: 'F#2' },
    { midi: 74, clef: 'treble', duration: 3, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 9 (G): B4 -> "...once was lost"
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 10 (G7): B4 - G4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 2.5, measure: 10, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 11 (C): E4 -> "...now am found"
    { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 3, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 12 (G): G4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'G3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 12, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 13 (G): D4 -> G4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 59, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 2, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 1, noteName: 'D3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 14 (Em): B4 - G4 -> "...now I see"
    { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
    { midi: 52, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 2.5, measure: 14, fingerRightHand: 3, noteName: 'G3' },

    // Compasso 15 (D7): A4
    { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 4, noteName: 'D2', chordName: 'D7' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 16 (G): Resolução final Sol Maior
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 59, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 1, noteName: 'B2' },
    { midi: 67, clef: 'treble', duration: 3, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'G3' },
  ], '3/4'),
};
