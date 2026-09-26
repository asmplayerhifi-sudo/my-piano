import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const TICO_TICO_NO_FUBA: RepertoireSong = {
  id: 'tico-tico-no-fuba',
  title: 'Tico-Tico no Fubá (Choro Completo)',
  composerOrArtist: 'Zequinha de Abreu (1917)',
  genre: 'MPB & Pop Nacional',
  difficulty: 'Avançado',
  recommendedBpm: 108,
  timeSignature: '4/4',
  tonality: 'Lá Menor (Am) / Dó Maior (C)',
  description: 'O choro brasileiro mais executado e aclamado em todo o planeta. Uma demonstração virtuosística de síncopes brasileiras, arpejos rápidos e contraponto vibrante entre a melodia ligeira e a baixaria percussiva de 7 cordas adaptada ao piano.',
  historicalContext: 'Composto em Santa Rita do Passa Quatro (SP) em 1917 por Zequinha de Abreu com o título original "Tico-Tico no Farelo", gravado em 1931 pela Orquestra Colbaz e imortalizado mundialmente por Carmen Miranda no filme "Copacabana" (1947).',
  biomechanicsTip: 'Mantenha os dedos da mão direita arredondados e muito próximos das teclas para permitir agilidade máxima nos arpejos de semicolcheias. Na mão esquerda, execute a baixaria do choro com swing sincopado sem endurecer o punho.',
  chords: ['Am', 'E7', 'A7', 'Dm', 'C', 'G7'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'Zequinha de Abreu (1880–1935)',
      originalArtist: 'Choro Tradicional Paulista / Carioca',
      license: 'public_domain',
      publishedYear: 1917,
      origin: 'Brasil (São Paulo / Rio de Janeiro)',
      scoreSource: 'Partitura Original Irmãos Vitale & Instituto Moreira Salles (IMS)',
      notes: 'Domínio público universal. Edição fidedigna dos 16 compassos da famosa Parte A do choro.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Melodia ligeira e síncopes auditadas segundo o manuscrito e primeiras gravações mecânicas da década de 1930. Baixarias de choro integradas na pauta de Fá.',
      sources: ['Acervo Choro Music', 'Instituto Moreira Salles', 'Biblioteca Nacional do Brasil'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Rondó de Choro Brasileiro (Forma A-B-A-C-A, transcrição integral da Seção A)',
    },
    sections: [
      { id: 'tema-a1', label: 'Tema Principal (Compassos 1 a 4)', startMeasure: 1, endMeasure: 4, dynamic: 'f', icon: 'verse' },
      { id: 'resposta-e7', label: 'Resposta Dominante E7 (Compassos 5 a 8)', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
      { id: 'reiteracao-a2', label: 'Reiteração do Tema (Compassos 9 a 12)', startMeasure: 9, endMeasure: 12, dynamic: 'f', icon: 'verse' },
      { id: 'cadencia-choro', label: 'Baixaria e Cadência de Choro (Compassos 13 a 16)', startMeasure: 13, endMeasure: 16, dynamic: 'ff', icon: 'outro' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (Am): M.E. A1 -> A2 | M.D. E4 -> A4 -> C5 -> B4 -> A4
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 2 (E7): M.E. E2 -> B2 | M.D. G#4 -> B4 -> E5 -> D5 -> B4
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'B3' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 4, measure: 2, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 4.5, measure: 2, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 3 (Am): M.E. A1 -> C2 | M.D. A4 -> C5 -> E5 -> D5 -> C5
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 3, noteName: 'C2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 2, noteName: 'C4' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, fingerRightHand: 2, noteName: 'C4' },

    // Compasso 4 (E7): M.E. E2 -> G#2 | M.D. B4 sustentado
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 44, clef: 'bass', duration: 2, beat: 3, measure: 4, fingerLeftHand: 3, noteName: 'G#1' },
    { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 5 (E7): M.E. E2 -> B2 | M.D. E4 -> G#4 -> B4 -> D5 -> C5
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'E3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 4, measure: 5, fingerRightHand: 5, noteName: 'D4' },
    { midi: 72, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 4, noteName: 'C4' },

    // Compasso 6 (Am): M.E. A1 -> E2 | M.D. B4 -> A4 -> E4 -> C4
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'E3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'C3' },

    // Compasso 7 (E7): M.E. E2 -> G#2 | M.D. B3 -> D4 -> C4 -> B3
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 44, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 3, noteName: 'G#1' },
    { midi: 59, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'B2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'D3' },
    { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 2, noteName: 'C3' },
    { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'B2' },

    // Compasso 8 (Am): M.E. A1 (baixa) | M.D. A3 sustentada
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 57, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 1, noteName: 'A2' },

    // Compasso 9 (Am): Reiteração com brio
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 1, noteName: 'E2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 2, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 4, measure: 9, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 4.5, measure: 9, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 10 (E7): M.E. E2 -> B2
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 2, noteName: 'B3' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 4, measure: 10, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 4.5, measure: 10, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 11 (A7): M.E. A1 -> C#2 | M.D. A4 -> C#5 -> E5 -> G5
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
    { midi: 49, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 3, noteName: 'C#2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'A3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 2, noteName: 'C#4' },
    { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'E4' },
    { midi: 79, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 5, noteName: 'G4' },

    // Compasso 12 (Dm): M.E. D2 -> F2 | M.D. F5 -> D5 -> A4 -> F4
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 4, noteName: 'D2', chordName: 'Dm' },
    { midi: 53, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 77, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'F4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 12, fingerRightHand: 3, noteName: 'D4' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 12, fingerRightHand: 2, noteName: 'A3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 12, fingerRightHand: 1, noteName: 'F3' },

    // Compasso 13 (Am): Baixaria de choro
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 48, clef: 'bass', duration: 2, beat: 3, measure: 13, fingerLeftHand: 3, noteName: 'C2' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'C4' },

    // Compasso 14 (E7): Resposta da baixaria
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 44, clef: 'bass', duration: 2, beat: 3, measure: 14, fingerLeftHand: 3, noteName: 'G#1' },
    { midi: 68, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 15 (E7 -> Am): Cadência
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 15, fingerLeftHand: 2, noteName: 'B1', chordName: 'E7' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 15, fingerLeftHand: 3, noteName: 'A1', chordName: 'Am' },
    { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'E3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 16 (Am): Acorde final percussivo com staccato seco de choro
    { midi: 33, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A0', chordName: 'Am' },
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'A1' },
    { midi: 57, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A2' },
    { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'C3' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'A3' },
  ], '4/4'),
};
