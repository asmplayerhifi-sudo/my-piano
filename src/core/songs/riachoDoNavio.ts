import type { RepertoireSong } from '../repertoireData';

export const RIACHO_DO_NAVIO: RepertoireSong = {
  id: 'riacho-do-navio',
  title: 'Riacho do Navio',
  composerOrArtist: 'Luiz Gonzaga & Zé Dantas',
  genre: 'Forró, Xote & Baião',
  difficulty: 'Intermediário',
  recommendedBpm: 108,
  timeSignature: '4/4',
  tonality: 'Ré Maior (D)',
  description: 'Um dos baiões mais rápidos, animados e poéticos de Luiz Gonzaga e Zé Dantas, lançado em 1955. Descreve geograficamente o curso das águas do sertão pernambucano: do Riacho do Navio ao Rio Pajeú, desaguando no Velho Chico até encontrar o mar, com o desejo de ser peixe para navegar livre.',
  historicalContext: 'Composta em 1955 pela lendária dupla Gonzaga & Zé Dantas, a música retrata o rio que banha a cidade de Floresta (PE) e homenageia a geografia sagrada das águas nordestinas.',
  biomechanicsTip: 'A mão esquerda deve manter o pulso percussivo e constante de colcheias no baixo com apoio nos tempos fortes. A mão direita executa as notas rápidas em Ré Maior com clareza rítmica e ponta de dedos articulada.',
  chords: ['D', 'A7', 'G'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O ritmo ligeiro e alegre da sanfona ───
    // Compasso 1 (D)
    { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 50, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'D2' },
    { midi: 57, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'A3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'D4' },

    // Compasso 2 (A7)
    { midi: 45, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
    { midi: 52, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 45, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'A1' },
    { midi: 52, clef: 'bass', duration: 1, beat: 4, measure: 2, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 3 (G - A7)
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 4, noteName: 'A1', chordName: 'A7' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 4 (D) — Resolução da introdução
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'D3' },

    // ─── TEMA / VERSO (Compassos 5 a 8): "Riacho do Navio corre pro Pajeú..." ───
    // Compasso 5 (D) — "Riacho do Navio corre pro Pajeú..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'D3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 3, noteName: 'A3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 3, noteName: 'A3' },

    // Compasso 6 (A7) — "...o rio Pajeú vai despejar no São Francisco..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 1, noteName: 'F#3' },

    // Compasso 7 (A7) — "O rio São Francisco vai bater no meio do mar..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'G3' },
    { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 8 (D) — "...vai bater no meio do mar"
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 66, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'F#3' },
    { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'D3' },

    // ─── REFRÃO (Compassos 9 a 12): "Ah, se eu fosse um peixe..." ───
    // Compasso 9 (G) — "Ah! Se eu fosse um peixe..."
    { midi: 43, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
    { midi: 50, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'D2' },
    { midi: 71, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'G3' },

    // Compasso 10 (D) — "...ao contrário do rio..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'A2' },
    { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'A3' },
    { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'F#3' },

    // Compasso 11 (A7) — "Nadava contra as águas..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'E3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 2, noteName: 'G3' },
    { midi: 66, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'F#3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 1, noteName: 'E3' },

    // Compasso 12 (D - Resolução) — "...pra matar o meu desejo."
    { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
    { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'D3' },
  ],
  extension: {
    credits: {
      composer: 'Luiz Gonzaga & Zé Dantas',
      lyricist: 'Luiz Gonzaga & Zé Dantas',
      originalArtist: 'Luiz Gonzaga',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1955,
      origin: 'Brasil / Baião Vibrante & Folclore Pernambucano',
      notes: 'Transcrição fiel com clave dupla contendo condução rítmica de baião e síncope.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Baião Acelerado', startMeasure: 1, endMeasure: 4, dynamic: 'f' },
      { id: 'verse', label: 'Verso do Percurso das Águas', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão do Peixe no Sertão', startMeasure: 9, endMeasure: 12, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'Riacho do Navio corre pro Pajeú', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'O rio Pajeú vai despejar no São Francisco', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'O rio São Francisco vai bater no meio do mar', startBeat: 25, endBeat: 33, startMeasure: 7, lineType: 'verse' },
      { text: 'Ah! Se eu fosse um peixe ao contrário do rio', startBeat: 33, endBeat: 41, startMeasure: 9, lineType: 'chorus' },
      { text: 'Nadava contra as águas pra matar o meu desejo', startBeat: 41, endBeat: 48, startMeasure: 11, lineType: 'chorus' },
    ],
  },
};
