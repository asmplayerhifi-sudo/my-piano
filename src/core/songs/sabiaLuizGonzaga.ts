import type { RepertoireSong } from '../repertoireData';

export const SABIA_LUIZ_GONZAGA: RepertoireSong = {
  id: 'sabia-luiz-gonzaga',
  title: 'Sabiá',
  composerOrArtist: 'Luiz Gonzaga & Zé Dantas',
  genre: 'Forró, Xote & Baião',
  difficulty: 'Intermediário',
  recommendedBpm: 90,
  timeSignature: '4/4',
  tonality: 'Lá Maior (A)',
  description: 'Uma das obras mais líricas e comoventes do cancioneiro nordestino, gravada em 1951 por Luiz Gonzaga. Composta em parceria com Zé Dantas, retrata o canto nostálgico do sabiá no sertão com a cadência sincopada do baião, melodias expressivas de sanfona e ricas harmonias em Lá Maior.',
  historicalContext: 'Composta em 1951, celebra a ave símbolo da fauna brasileira e a saudade do sertanejo longe de sua terra natal. Tornou-se um clássico gravado por nomes como Gilberto Gil, Elba Ramalho e Dominguinhos.',
  biomechanicsTip: 'Na mão esquerda, articule a síncope característica do baião (tempo 1 forte, contratempo do 2 leve). Na mão direita, utilize ornamentos sutis (mordentes) para emular o fraseado da sanfona nordestina.',
  chords: ['A', 'D', 'E7', 'F#m', 'Bm'],
  scoreTrack: [
    // ─── INTRODUÇÃO (Compassos 1 a 4) — O fraseado típico de sanfona do Rei do Baião ───
    // Compasso 1 (A)
    { midi: 45, clef: 'bass', duration: 1.5, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 1, beat: 2.5, measure: 1, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 45, clef: 'bass', duration: 1.5, beat: 3.5, measure: 1, fingerLeftHand: 5, noteName: 'A1' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'A3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E4' },

    // Compasso 2 (D)
    { midi: 50, clef: 'bass', duration: 1.5, beat: 1, measure: 2, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 1, beat: 2.5, measure: 2, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 50, clef: 'bass', duration: 1.5, beat: 3.5, measure: 2, fingerLeftHand: 3, noteName: 'D2' },
    { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 3 (E7)
    { midi: 40, clef: 'bass', duration: 1.5, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 1, beat: 2.5, measure: 3, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 40, clef: 'bass', duration: 1.5, beat: 3.5, measure: 3, fingerLeftHand: 5, noteName: 'E1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'C#4' },

    // Compasso 4 (A) — Resolução da introdução
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A3' },

    // ─── ESTROFE 1 (Compassos 5 a 8): "A todo mundo eu dou bom dia..." ───
    // Compasso 5 (A) — "A todo mundo eu dou bom dia..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'A3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 3, noteName: 'B3' },
    { midi: 73, clef: 'treble', duration: 1.5, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 73, clef: 'treble', duration: 0.5, beat: 4.5, measure: 5, fingerRightHand: 4, noteName: 'C#4' },

    // Compasso 6 (F#m - Bm) — "...mas o sabiá não me responde..."
    { midi: 42, clef: 'bass', duration: 2, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#m' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 6, fingerLeftHand: 3, noteName: 'B1', chordName: 'Bm' },
    { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 7 (E7) — "Cantando lá no pé da serra..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'B3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 74, clef: 'treble', duration: 1.5, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'D4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 4.5, measure: 7, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 8 (A) — "...que tristeza me consome"
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 73, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'A3' },

    // ─── REFRÃO (Compassos 9 a 12): "Sabiá, sabiá, canta mais..." ───
    // Compasso 9 (D) — "Sabiá, cantador do sertão..."
    { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 3, noteName: 'D2', chordName: 'D' },
    { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 1, noteName: 'A2' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'E4' },
    { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'C#4' },

    // Compasso 10 (A)
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'A3' },

    // Compasso 11 (E7) — "Vem cantar no meu sertão..."
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'E1', chordName: 'E7' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 2, noteName: 'B3' },
    { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 4, noteName: 'D4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 12 (A - Resolução)
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'A3' },
  ],
  extension: {
    credits: {
      composer: 'Luiz Gonzaga & Zé Dantas',
      lyricist: 'Luiz Gonzaga & Zé Dantas',
      originalArtist: 'Luiz Gonzaga (O Rei do Baião)',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1951,
      origin: 'Brasil / Baião Tradicional & Cultura Nordestina',
      notes: 'Transcrição didática adaptada para teclado e piano com síncopes de baião.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Típica de Sanfona', startMeasure: 1, endMeasure: 4, dynamic: 'mf' },
      { id: 'verse', label: 'Estrofe Sertaneja', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão do Sabiá', startMeasure: 9, endMeasure: 12, dynamic: 'f' },
    ],
    lyrics: [
      { text: 'A todo mundo eu dou bom dia', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Mas o sabiá não me responde', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'Cantando lá no pé da serra', startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'verse' },
      { text: 'Que tristeza me consome', startBeat: 29, endBeat: 33, startMeasure: 8, lineType: 'verse' },
      { text: 'Sabiá, cantador do sertão, vem cantar no meu sertão', startBeat: 33, endBeat: 48, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
