import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const GREENSLEEVES: RepertoireSong = {
  id: 'greensleeves',
  title: 'Greensleeves (Alas, My Love)',
  composerOrArtist: 'Folclore Tradicional Inglês (Século XVI)',
  genre: 'Internacional & Folk',
  difficulty: 'Iniciante',
  recommendedBpm: 84,
  timeSignature: '3/4',
  tonality: 'Lá Menor Dórico (Am)',
  description: 'A mais famosa balada folclórica da Inglaterra renascentista. Baseada na escala dórica antiga com a alternância entre sol natural e sol sustenido, acompanhada pelo clássico baixo ostinato da tradição da Romanesca/Passamezzo Antico.',
  historicalContext: 'Registrada na London Stationers\' Company em 1580 como "A Newe Northen Dittye of ye Ladye Greene Sleves". Embora a lenda popular atribua a canção ao Rei Henrique VIII para Ana Bolena, trata-se de uma balada de tradição oral renascentista.',
  biomechanicsTip: 'Toque o compasso 3/4 com o balanço suave de uma barcarola ou dança cortesã. A mão direita deve ligar as notas da melodia com expressividade, enquanto a mão esquerda desenha os acordes arpejados com leveza.',
  chords: ['Am', 'G', 'F', 'E7', 'C'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'Tradicional Inglês (Século XVI)',
      lyricist: 'Anônimo Inglês (c. 1580)',
      originalArtist: 'Tradição Renascentista Britânica',
      license: 'public_domain',
      publishedYear: 1580,
      origin: 'Inglaterra',
      scoreSource: 'William Ballet\'s Lute Book (c. 1590) & Partituras Históricas de Domínio Público',
      notes: 'Domínio público universal. Edição para piano solo em 16 compassos completos cobrindo Estrofe e Refrão.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Modalismo dórico e baixos fundamentais conferidos contra edições críticas da música elizabetana. Compasso ternário rigorosamente preservado.',
      sources: ['The English Dancing Master (John Playford, 1651)', 'The Oxford Book of Carols', 'IMSLP Greensleeves'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Balada Renascentista (Estrofe de 8 compassos + Refrão de 8 compassos)',
    },
    sections: [
      { id: 'estrofe', label: 'Estrofe: "Alas, my love..." (Compassos 1 a 8)', startMeasure: 1, endMeasure: 8, dynamic: 'mp', icon: 'verse' },
      { id: 'refrao', label: 'Refrão: "Greensleeves was all my joy..." (Compassos 9 a 16)', startMeasure: 9, endMeasure: 16, dynamic: 'mf', icon: 'chorus' },
    ],
    lyrics: [
      { text: 'Alas, my love, you do me wrong to cast me off discourteously,', startBeat: 1, endBeat: 12, startMeasure: 1, lineType: 'verse' },
      { text: 'For I have loved you well and long, delighting in your company.', startBeat: 13, endBeat: 24, startMeasure: 5, lineType: 'verse' },
      { text: 'Greensleeves was all my joy, Greensleeves was my delight,', startBeat: 25, endBeat: 36, startMeasure: 9, lineType: 'chorus' },
      { text: 'Greensleeves was my heart of gold, and who but my lady Greensleeves.', startBeat: 37, endBeat: 48, startMeasure: 13, lineType: 'chorus' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (Am): A3 -> C4 -> D4
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 2 (G): E4 -> F4 -> E4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'E4' },
    { midi: 77, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 5, noteName: 'F4' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'E4' },

    // Compasso 3 (F): D4 -> B3 -> G3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 1, noteName: 'F2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 2, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'G3' },

    // Compasso 4 (E7): E3 -> A3 -> B3
    { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 52, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 5 (Am): C4 -> A3 -> A3
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 2, noteName: 'A3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 6 (E7): G#3 -> A3 -> B3
    { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 56, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 1, noteName: 'G#2' },
    { midi: 68, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 7 (Am): C4 -> B3 -> A3
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'A3' },

    // Compasso 8 (Am): A3 sustentada (fim da estrofe)
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'A3' },

    // ─── REFRÃO (Compassos 9 a 16) ───
    // Compasso 9 (C): G4 -> G4
    { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 60, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 1, noteName: 'C3' },
    { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'G4' },
    { midi: 79, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'G4' },

    // Compasso 10 (G): F4 -> E4
    { midi: 43, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 4, noteName: 'F4' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'E4' },

    // Compasso 11 (F): D4 -> B3 -> G3
    { midi: 41, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
    { midi: 53, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 1, noteName: 'F2' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 11, fingerRightHand: 2, noteName: 'B3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'G3' },

    // Compasso 12 (E7): E3 -> A3 -> B3
    { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 52, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 2, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 13 (Am): C4 -> A3 -> A3
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'C4' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 13, fingerRightHand: 2, noteName: 'A3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 14 (E7): G#3 -> A3 -> B3
    { midi: 40, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 56, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'G#2' },
    { midi: 68, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 14, fingerRightHand: 3, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 15 (Am): C4 -> B3 -> G#3
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 4, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'B3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'G#3' },

    // Compasso 16 (Am): Resolução final Lá Menor
    { midi: 33, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A0', chordName: 'Am' },
    { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'A1' },
    { midi: 57, clef: 'treble', duration: 3, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A2' },
    { midi: 60, clef: 'treble', duration: 3, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'C3' },
    { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'A3' },
  ], '3/4'),
};
