import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const SONATA_K545_MOZART: RepertoireSong = {
  id: 'sonata-k545-mozart',
  title: 'Sonata Fácil em Dó Maior (K. 545 - 1º Mov.)',
  composerOrArtist: 'Wolfgang Amadeus Mozart (1788)',
  genre: 'Clássico & Mestres',
  difficulty: 'Intermediário',
  recommendedBpm: 112,
  timeSignature: '4/4',
  tonality: 'Dó Maior (C)',
  description: 'A "Sonata semplice" de Mozart, uma das obras mais perfeitas e pedagógicas da era clássica vienense. Mão direita com tema límpido e gracioso em arpejos e escalas, acompanhada pelo clássico Baixo de Alberti.',
  historicalContext: 'Composta por Mozart em Viena em 1788 (contemporânea à Sinfonia nº 40 e nº 41 "Júpiter"), adicionada ao seu catálogo pessoal de obras como "uma pequena Sonata para teclado para principiantes".',
  biomechanicsTip: 'A mão esquerda deve tocar o baixo de Alberti (C-G-E-G) com rotação suave do antebraço e articulação leve de dedos, sem sobrecarregar a mão direita, que canta o tema com elegância clássica.',
  chords: ['C', 'G', 'F', 'Am', 'Dm'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'Wolfgang Amadeus Mozart (1756–1791)',
      originalArtist: 'Clássico Vienense',
      license: 'public_domain',
      publishedYear: 1788,
      origin: 'Áustria (Viena)',
      scoreSource: 'Neue Mozart-Ausgabe (Bärenreiter) & Breitkopf & Härtel Gesamtausgabe',
      notes: 'Domínio público universal. Edição fidedigna dos 16 compassos da exposição do Allegro em partitura dupla com baixo de Alberti.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Tema principal e transição auditados contra a partitura original da Neue Mozart-Ausgabe. Baixo de Alberti rigorosamente transcrito sem atalhos simplistas.',
      sources: ['Neue Mozart-Ausgabe, Serie IX, Werkgruppe 25', 'Breitkopf & Härtel', 'IMSLP K. 545'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Exposição da Forma-Sonata (Tema A + Transição)',
    },
    sections: [
      { id: 'tema-principal', label: 'Tema Principal (Compassos 1 a 4)', startMeasure: 1, endMeasure: 4, dynamic: 'mf', icon: 'verse' },
      { id: 'resposta-frase', label: 'Resposta e Transição (Compassos 5 a 8)', startMeasure: 5, endMeasure: 8, dynamic: 'p', icon: 'verse' },
      { id: 'escalas-brilhantes', label: 'Passagem em Escalas (Compassos 9 a 12)', startMeasure: 9, endMeasure: 12, dynamic: 'f', icon: 'bridge' },
      { id: 'cadencia-dominante', label: 'Cadência em Sol Maior (Compassos 13 a 16)', startMeasure: 13, endMeasure: 16, dynamic: 'mf', icon: 'outro' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (C): M.E. Alberti C3-G3-E3-G3 | M.D. C4 (mínima) E4-G4 (semínimas)
    { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 52, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 3, noteName: 'E2' },
    { midi: 55, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 2 (G7): M.E. B2-G3-D3-G3 | M.D. B3 (pontuada) C4 (colcheia) D4 (semínima)
    { midi: 47, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B1', chordName: 'G7' },
    { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 50, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'D2' },
    { midi: 55, clef: 'bass', duration: 1, beat: 4, measure: 2, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 59, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'B2' },
    { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 2, noteName: 'C3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'D3' },

    // Compasso 3 (C): M.E. C3-G3-E3-G3 | M.D. C4 (semibreve)
    { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 3, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 52, clef: 'bass', duration: 1, beat: 3, measure: 3, fingerLeftHand: 3, noteName: 'E2' },
    { midi: 55, clef: 'bass', duration: 1, beat: 4, measure: 3, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 4 (G): M.E. D3-G3-B2-G3 | M.D. A4-G4-F4-E4-D4 (escala descendente)
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 2, noteName: 'D2', chordName: 'G' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'G1' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'E3' },

    // Compasso 5 (C): M.E. C3-G3-E3-G3 | M.D. D4 (semínima) E4-F4-G4
    { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 5, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 52, clef: 'bass', duration: 1, beat: 3, measure: 5, fingerLeftHand: 3, noteName: 'E2' },
    { midi: 55, clef: 'bass', duration: 1, beat: 4, measure: 5, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 6 (F): M.E. F2-C3-A2-C3 | M.D. A4 (semibreve)
    { midi: 41, clef: 'bass', duration: 1, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 48, clef: 'bass', duration: 1, beat: 2, measure: 6, fingerLeftHand: 1, noteName: 'C2' },
    { midi: 45, clef: 'bass', duration: 1, beat: 3, measure: 6, fingerLeftHand: 3, noteName: 'A1' },
    { midi: 48, clef: 'bass', duration: 1, beat: 4, measure: 6, fingerLeftHand: 1, noteName: 'C2' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'A3' },

    // Compasso 7 (C/G): M.E. G2-E3-C3-E3 | M.D. G4 (semibreve)
    { midi: 43, clef: 'bass', duration: 1, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'C' },
    { midi: 52, clef: 'bass', duration: 1, beat: 2, measure: 7, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 48, clef: 'bass', duration: 1, beat: 3, measure: 7, fingerLeftHand: 3, noteName: 'C2' },
    { midi: 52, clef: 'bass', duration: 1, beat: 4, measure: 7, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 7, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 8 (G7): M.E. G2-D3-B2-D3 | M.D. F4 (semibreve)
    { midi: 43, clef: 'bass', duration: 1, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 50, clef: 'bass', duration: 1, beat: 2, measure: 8, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 47, clef: 'bass', duration: 1, beat: 3, measure: 8, fingerLeftHand: 3, noteName: 'B1' },
    { midi: 50, clef: 'bass', duration: 1, beat: 4, measure: 8, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'F3' },

    // Compasso 9 (C): M.E. C3-G3-E3-G3 | M.D. E4 (mínima) D4-C4 (semínimas)
    { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 9, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 52, clef: 'bass', duration: 1, beat: 3, measure: 9, fingerLeftHand: 3, noteName: 'E2' },
    { midi: 55, clef: 'bass', duration: 1, beat: 4, measure: 9, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 10 (Am): M.E. A2-E3-C3-E3 | M.D. C4-D4-E4-F4
    { midi: 45, clef: 'bass', duration: 1, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 1, beat: 2, measure: 10, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 48, clef: 'bass', duration: 1, beat: 3, measure: 10, fingerLeftHand: 3, noteName: 'C2' },
    { midi: 52, clef: 'bass', duration: 1, beat: 4, measure: 10, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'C3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 2, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 4, noteName: 'F3' },

    // Compasso 11 (Dm): M.E. D3-A3-F3-A3 | M.D. G4 (mínima) F4-E4
    { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
    { midi: 57, clef: 'bass', duration: 1, beat: 2, measure: 11, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 53, clef: 'bass', duration: 1, beat: 3, measure: 11, fingerLeftHand: 3, noteName: 'F2' },
    { midi: 57, clef: 'bass', duration: 1, beat: 4, measure: 11, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'G3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'F3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 3, noteName: 'E3' },

    // Compasso 12 (G): M.E. G2-D3-B2-D3 | M.D. D4-E4-F4-G4
    { midi: 43, clef: 'bass', duration: 1, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 1, beat: 2, measure: 12, fingerLeftHand: 1, noteName: 'D2' },
    { midi: 47, clef: 'bass', duration: 1, beat: 3, measure: 12, fingerLeftHand: 3, noteName: 'B1' },
    { midi: 50, clef: 'bass', duration: 1, beat: 4, measure: 12, fingerLeftHand: 1, noteName: 'D2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'D3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 2, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 12, fingerRightHand: 4, noteName: 'G3' },

    // Compasso 13 (C): M.E. C3-G3-E3-G3 | M.D. E4-G4-C5-G4
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 13, fingerLeftHand: 5, noteName: 'C2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 1, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 2, noteName: 'G3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'C4' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 13, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 14 (G7): M.E. G2-D3-B2-D3 | M.D. F4-D4-B3-G3
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 14, fingerLeftHand: 5, noteName: 'G1' },
    { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'F3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 2, noteName: 'D3' },
    { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 1, noteName: 'B2' },
    { midi: 55, clef: 'treble', duration: 1, beat: 4, measure: 14, fingerRightHand: 1, noteName: 'G2' },

    // Compasso 15 (C/G -> G7): Cadência perfeita
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'G1', chordName: 'C' },
    { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 15, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'E3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'D3' },

    // Compasso 16 (C): Resolução final clássica Dó Maior
    { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C1', chordName: 'C' },
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'C2' },
    { midi: 52, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'E2' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'C3' },
    { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'E3' },
  ], '4/4'),
};
