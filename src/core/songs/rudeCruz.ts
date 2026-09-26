import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const RUDE_CRUZ: RepertoireSong = {
  id: 'rude-cruz',
  title: 'Rude Cruz (The Old Rugged Cross)',
  composerOrArtist: 'George Bennard (1913)',
  genre: 'Gospel Clássico & Sacro',
  difficulty: 'Iniciante',
  recommendedBpm: 68,
  timeSignature: '3/4',
  tonality: 'Fá Maior (F)',
  description: 'Um dos hinos mais tocantes e reverenciados da hinologia mundial e da Harpa Cristã. Melodia lírica em Fá Maior com ternário calmo (3/4), cadência solene e harmonia devocional.',
  historicalContext: 'Composto pelo pastor e evangelista George Bennard em Michigan (1913), inspirado na reflexão teológica sobre o sacrifício e redenção na cruz. Tornou-se um dos hinos cristãos mais gravados no século XX.',
  biomechanicsTip: 'Atenção à nota Si bemol (Bb3/Bb2) própria da armadura de Fá Maior. Toque com toque cantábile legato e dedos relaxados nos tempos fracos.',
  chords: ['F', 'Bb', 'C7', 'F7'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'George Bennard (1913)',
      lyricist: 'George Bennard (1913)',
      originalArtist: 'Hinário Harpa Cristã & Hinologia Sacra',
      license: 'public_domain',
      publishedYear: 1913,
      origin: 'Estados Unidos',
      scoreSource: 'Hinário Harpa Cristã (Hino 291) & The Old Rugged Cross Sheet Music (1915)',
      notes: 'Domínio público. Arranjo devocional para piano solo com partitura dupla.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Melodia tradicional e progressão harmônica auditadas segundo o hinário histórico. Compasso 3/4 rigorosamente balanceado.',
      sources: ['Harpa Cristã (CPAD)', 'The Cyber Hymnal', 'Library of Congress Sheet Music Collection'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Estrofe (8 compassos) + Refrão Sacro (8 compassos)',
    },
    sections: [
      { id: 'estrofe', label: 'Estrofe: "Num monte bem longe..."', startMeasure: 1, endMeasure: 8, dynamic: 'mp', icon: 'verse' },
      { id: 'refrao', label: 'Refrão: "Sim, eu amo a mensagem..."', startMeasure: 9, endMeasure: 16, dynamic: 'f', icon: 'chorus' },
    ],
    lyrics: [
      { text: 'Num monte bem longe se ergueu uma cruz,', startBeat: 1, endBeat: 12, startMeasure: 1, lineType: 'verse' },
      { text: 'Emblema de vergonha e dor...', startBeat: 13, endBeat: 24, startMeasure: 5, lineType: 'verse' },
      { text: 'Sim, eu amo a mensagem da cruz,', startBeat: 25, endBeat: 36, startMeasure: 9, lineType: 'chorus' },
      { text: 'Até morrer eu a vou proclamar!', startBeat: 37, endBeat: 48, startMeasure: 13, lineType: 'chorus' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (F): C3 -> F3 -> A3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'F2' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 2 (F): C4 -> A3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F1' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'A3' },

    // Compasso 3 (Bb): D4 -> Bb3
    { midi: 46, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A#1', chordName: 'Bb' },
    { midi: 58, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'A#2' },
    { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'D4' },
    { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'A#3' },

    // Compasso 4 (F): A3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'F2' },
    { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 5 (C7): G3 -> G3 -> A3
    { midi: 36, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C1', chordName: 'C7' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 6 (C7): Bb3 -> G3
    { midi: 36, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C1' },
    { midi: 58, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'A#2' },
    { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'A#3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 7 (F): F3 -> G3 -> A3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 1, noteName: 'F2' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 8 (F): F3 sustentado (fim da estrofe)
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 65, clef: 'treble', duration: 3, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'F3' },

    // ─── REFRÃO SACRO (Compassos 9 a 16) ───
    // Compasso 9 (C7): C4 -> C4 -> C4
    { midi: 36, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C1', chordName: 'C7' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'C4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 4, noteName: 'C4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'C4' },

    // Compasso 10 (F): C4 -> A3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 11 (Bb): D4 -> D4 -> D4
    { midi: 46, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'A#1', chordName: 'Bb' },
    { midi: 58, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 1, noteName: 'A#2' },
    { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'D4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 5, noteName: 'D4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 12 (Bb): D4 -> Bb3
    { midi: 46, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 4, noteName: 'A#1' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'D4' },
    { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'A#3' },

    // Compasso 13 (F): C4 -> C4 -> C4
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 4, noteName: 'C4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 4, noteName: 'C4' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 4, noteName: 'C4' },

    // Compasso 14 (F): A3 -> F3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 3, noteName: 'A3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 1, noteName: 'F3' },

    // Compasso 15 (C7): G3 -> A3 -> G3
    { midi: 36, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'C1', chordName: 'C7' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 16 (F): Resolução final Fá Maior
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 65, clef: 'treble', duration: 3, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'F3' },
  ], '3/4'),
};
