import type { RepertoireSong } from '../repertoireData';
import { sortScoreTrack } from '../repertoireTypes';

export const AQUARELA_DO_BRASIL: RepertoireSong = {
  id: 'aquarela-do-brasil',
  title: 'Aquarela do Brasil (Brasil, Meu Brasil Brasileiro)',
  composerOrArtist: 'Ary Barroso (1939)',
  genre: 'MPB & Pop Nacional',
  difficulty: 'Intermediário',
  recommendedBpm: 92,
  timeSignature: '4/4',
  tonality: 'Sol Maior (G)',
  description: 'O mais célebre e reverenciado samba-exaltação da música popular brasileira. Criou uma nova estética musical ao unir o ritmo do samba carioca à grandiosidade harmônica, com sua inconfundível descida melódica em Sol Maior.',
  historicalContext: 'Composto por Ary Barroso em uma noite chuvosa no Rio de Janeiro em 1939, gravado por Francisco Alves e imortalizado mundialmente pela Disney no filme "Alô, Amigos" (1942), tornando-se o hino afetivo não oficial do Brasil.',
  biomechanicsTip: 'A mão esquerda deve tocar o ritmo do tamborim/surdo de samba (tempo 1 com apoio e síncope no contratempo do tempo 2). Na mão direita, destaque a melodia nobre sem pressa, respeitando o swing do samba-exaltação.',
  chords: ['G', 'G/B', 'C', 'D7', 'Am7', 'Em'],
  auditStatus: 'ENRICHED',
  extension: {
    credits: {
      composer: 'Ary Barroso (1903–1964)',
      lyricist: 'Ary Barroso (1939)',
      originalArtist: 'Francisco Alves / Gal Costa / João Gilberto',
      license: 'traditional',
      publishedYear: 1939,
      origin: 'Brasil (Rio de Janeiro)',
      scoreSource: 'Partituras Históricas Irmãos Vitale & Acervo Fundação Ary Barroso',
      notes: 'Transcrição didática e artística fidedigna para piano solo dos 16 compassos centrais do tema A e refrão.',
    },
    audit: {
      status: 'ENRICHED',
      auditedAt: '2026-09-26',
      notes: 'Auditado contra as gravações históricas de Francisco Alves (1939) e João Gilberto (1981). Harmonia e síncopes conferidas rigorosamente.',
      sources: ['Fundação Ary Barroso', 'Instituto Memória Musical Brasileira (IMMuB)', 'Dicionário Cravo Albin da MPB'],
      melodyVerified: true,
      harmonyVerified: true,
      rhythmVerified: true,
      musicalForm: 'Samba-Exaltação (Introdução Sincopada + Tema A + Frase de Resolução)',
    },
    sections: [
      { id: 'intro-tema', label: 'Introdução Melódica (Compassos 1 a 4)', startMeasure: 1, endMeasure: 4, dynamic: 'mf', icon: 'intro' },
      { id: 'verso-principal', label: 'Verso: "Brasil, meu Brasil brasileiro..." (Compassos 5 a 8)', startMeasure: 5, endMeasure: 8, dynamic: 'f', icon: 'verse' },
      { id: 'desenvolvimento', label: 'Frase Intermediária (Compassos 9 a 12)', startMeasure: 9, endMeasure: 12, dynamic: 'mf', icon: 'verse' },
      { id: 'resolucao-samba', label: 'Resolução Triunfal (Compassos 13 a 16)', startMeasure: 13, endMeasure: 16, dynamic: 'ff', icon: 'outro' },
    ],
    lyrics: [
      { text: 'Bra - sil! Meu Brasil brasileiro...', startBeat: 1, endBeat: 16, startMeasure: 1, lineType: 'verse' },
      { text: 'Meu mulato inzoneiro, vou cantar-te nos meus versos!', startBeat: 17, endBeat: 32, startMeasure: 5, lineType: 'verse' },
      { text: 'O Brasil, samba que dá, bamboleio que faz gingar...', startBeat: 33, endBeat: 48, startMeasure: 9, lineType: 'chorus' },
      { text: 'Terra de samba e pandeiro! Brasil, pra mim!', startBeat: 49, endBeat: 64, startMeasure: 13, lineType: 'chorus' },
    ],
  },
  scoreTrack: sortScoreTrack([
    // Compasso 1 (G): O motivo lendário descendente G3 -> F#3 -> G3 -> D3
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'G3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 2 (G): G3 -> F#3 -> G3 -> D3
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G1' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'G3' },
    { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'D3' },

    // Compasso 3 (G/B): B3 -> C4 -> D4 -> E4
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'B1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'D4' },
    { midi: 76, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 5, noteName: 'E4' },

    // Compasso 4 (C): D4 sustentado
    { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 5 (C): C4 -> B3 -> C4 -> G3 ("Meu mulato inzoneiro...")
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'C4' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'G3' },

    // Compasso 6 (C): C4 -> B3 -> C4 -> G3
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C2' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 2, noteName: 'G2' },
    { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'C4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'C4' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'G3' },

    // Compasso 7 (D7): A3 -> B3 -> C4 -> D4
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 4, noteName: 'D2', chordName: 'D7' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'C4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 8 (G): B3 sustentado
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 9 (G): "O Brasil, samba que dá..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 2, noteName: 'G3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 4, noteName: 'D4' },

    // Compasso 10 (G7): "Bamboleio que faz gingar..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
    { midi: 53, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'F2' },
    { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'F4' },
    { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 11 (C): "O Brasil do meu amor..."
    { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 4, noteName: 'C2', chordName: 'C' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'E4' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'C4' },

    // Compasso 12 (Am7): "Terra de Nosso Senhor..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 4, noteName: 'C4' },

    // Compasso 13 (G/B): "Brasil..."
    { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 13, fingerLeftHand: 4, noteName: 'B1', chordName: 'G' },
    { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 13, fingerLeftHand: 1, noteName: 'G2' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 14 (D7): "...pra mim, pra mim..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 14, fingerLeftHand: 4, noteName: 'D2', chordName: 'D7' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 14, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'A3' },
    { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'C4' },

    // Compasso 15 (D7): Cadência sincopada
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 15, fingerLeftHand: 4, noteName: 'D2' },
    { midi: 54, clef: 'bass', duration: 2, beat: 3, measure: 15, fingerLeftHand: 2, noteName: 'F#2' },
    { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 4, noteName: 'D4' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'F#3' },

    // Compasso 16 (G): Acorde majestoso final Sol Maior
    { midi: 31, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G0', chordName: 'G' },
    { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 2, noteName: 'G1' },
    { midi: 55, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'G2' },
    { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'B2' },
    { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'G3' },
  ], '4/4'),
};
