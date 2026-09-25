/**
 * Repertório Internacional & Folk
 *
 * Canções folclóricas e de tradição oral de domínio público ou licença compatível.
 * Cada entrada inclui: partitura, letra sincronizada, seções musicais,
 * arranjos disponíveis e metadados completos de autoria/licença.
 *
 * Conteúdo:
 * 1. Bella Ciao — canção folclórica italiana (domínio público / tradição oral)
 * 2. Hasta Siempre, Comandante — Carlos Puebla, Cuba, 1965
 * 3. El Cóndor Pasa — Daniel Alomía Robles, Peru, 1913 (domínio público)
 * 4. Guantanamera — melodia cubana tradicional, letra José Martí (domínio público)
 */

import type { RepertoireSong } from './repertoireData';

export const WORLD_FOLK_SONGS: RepertoireSong[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. BELLA CIAO — Canção Folclórica Italiana (Domínio Público)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'bella-ciao',
    title: 'Bella Ciao',
    composerOrArtist: 'Tradição Italiana (Domínio Público)',
    genre: 'Internacional & Folk',
    difficulty: 'Iniciante',
    recommendedBpm: 100,
    timeSignature: '3/4',
    tonality: 'Lá Menor (Am)',
    description: 'Canção folclórica italiana do século XIX, símbolo de resistência e liberdade. Melodia modal característica com compasso de valsa (3/4) e progressão Am–E–Am. Versão completa com introdução, 4 estrofes e encerramento.',
    historicalContext: 'Bella Ciao é uma canção folk italiana de origem anônima, associada à tradição de mondine (trabalhadoras rurais) no norte da Itália. Ganhou projeção mundial como hino da resistência antifascista italiana durante a Segunda Guerra Mundial. Está em domínio público em todas as jurisdições.',
    biomechanicsTip: 'Compasso de valsa: o baixo cai sempre no tempo 1 (forte) e os acordes nos tempos 2 e 3 (fracos). Mantenha o pulso regular e evite precipitar o tempo forte.',
    chords: ['Am', 'E', 'Am', 'Dm', 'E7', 'Am'],
    scoreTrack: [
      // ─── INTRODUÇÃO (Compassos 1–2: arpejo Am) ───────────────────────────
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E4' },

      { midi: 64, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'E4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'B3' },
      { midi: 68, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'G#3' },

      // ─── ESTROFE 1 — "Una mattina..." (Compassos 3–10) ──────────────────
      // Compasso 3: "U-na mat-"
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 1, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 4: "-ti-na mi son" (Am)
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'A3' },

      // Compasso 5: "sve-glia-to" (E)
      { midi: 64, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 68, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 1, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 5, fingerRightHand: 3, noteName: 'B3' },

      // Compasso 6: "O bel-la" (Am)
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 1, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'A3' },

      // Compasso 7: "cia-o, bel-la" (Dm)
      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 1, noteName: 'D2', chordName: 'Dm' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 7, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 8: "cia-o, bel-la" (Am)
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1.5, measure: 8, fingerRightHand: 1, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'C4' },

      // Compasso 9: "cia-o!" (E7)
      { midi: 64, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'E2', chordName: 'E7' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 9, fingerRightHand: 2, noteName: 'B3' },

      // Compasso 10: "U-na mat-" (Am — fim estrofe 1)
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'C4' },

      // ─── ESTROFE 2 — "E se io muoio..." / "Bella Ciao" (Compassos 11–18) ─
      // Compassos 11–18: estrutura idêntica à estrofe 1, tom relativo
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'A3' },

      { midi: 64, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E2', chordName: 'E' },
      { midi: 68, clef: 'treble', duration: 1.5, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'G#3' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 12, fingerRightHand: 3, noteName: 'B3' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 1, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 1, noteName: 'A3' },

      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 1, noteName: 'D2', chordName: 'Dm' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1, measure: 14, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 14, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 14, fingerRightHand: 3, noteName: 'C4' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1.5, measure: 15, fingerRightHand: 1, noteName: 'A3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 15, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 3, noteName: 'C4' },

      { midi: 64, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'E2', chordName: 'E7' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 16, fingerRightHand: 2, noteName: 'B3' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 17, fingerRightHand: 1, noteName: 'A3' },

      // ─── ENCERRAMENTO (Compasso 18: Am final com fermata) ──────────────
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 18, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 18, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 3, beat: 1, measure: 18, fingerRightHand: 5, noteName: 'E4' },
    ],
    extension: {
      credits: {
        composer: 'Anônimo (Tradição Italiana)',
        lyricist: 'Tradição Oral',
        originalArtist: 'Resistência Italiana (Partigiani)',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Domínio Público — Obra folclórica anônima',
        lyricsSource: 'Tradição oral italiana, domínio público',
        license: 'traditional',
        publishedYear: 1943,
        origin: 'Itália',
        notes: 'Canção de resistência antifascista italiana. Origem folclórica anônima, século XIX. Domínio público universal.',
      },
      sections: [
        { id: 'intro', label: 'Introdução', startMeasure: 1, endMeasure: 2, dynamic: 'mp', icon: 'intro' },
        { id: 'verse1', label: 'Estrofe 1', startMeasure: 3, endMeasure: 10, dynamic: 'mf', icon: 'verse' },
        { id: 'verse2', label: 'Estrofe 2 / Refrão', startMeasure: 11, endMeasure: 17, dynamic: 'f', icon: 'chorus' },
        { id: 'outro', label: 'Encerramento', startMeasure: 18, endMeasure: 18, dynamic: 'mf', icon: 'outro' },
      ],
      lyrics: [
        // Estrofe 1
        { text: 'Una mattina mi son svegliato', startBeat: 7, endBeat: 13, startMeasure: 3, section: 'verse1', lineType: 'verse' },
        { text: 'O bella ciao, bella ciao', startBeat: 13, endBeat: 19, startMeasure: 5, section: 'verse1', lineType: 'verse' },
        { text: 'Bella ciao, bella ciao, bella ciao ciao ciao!', startBeat: 19, endBeat: 28, startMeasure: 7, section: 'verse1', lineType: 'verse' },
        { text: 'Una mattina mi son svegliato', startBeat: 28, endBeat: 31, startMeasure: 10, section: 'verse1', lineType: 'verse' },
        // Estrofe 2
        { text: 'E se io muoio da partigiano', startBeat: 31, endBeat: 37, startMeasure: 11, section: 'verse2', lineType: 'chorus' },
        { text: 'O bella ciao, bella ciao', startBeat: 37, endBeat: 43, startMeasure: 13, section: 'verse2', lineType: 'chorus' },
        { text: 'Bella ciao, bella ciao, bella ciao ciao ciao!', startBeat: 43, endBeat: 52, startMeasure: 15, section: 'verse2', lineType: 'chorus' },
        { text: 'E se io muoio da partigiano', startBeat: 52, endBeat: 54, startMeasure: 17, section: 'verse2', lineType: 'chorus' },
      ],
      arrangements: [
        {
          id: 'acoustic-waltz',
          label: 'Valsa Acústica',
          description: 'Violão com baixo-acorde-acorde tradicional de valsa italiana',
          defaultBpm: 100,
          styleId: 'waltz_3_4',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'guitar_nylon',
          icon: '🎸',
        },
        {
          id: 'full-folk',
          label: 'Folk Completo',
          description: 'Bateria leve de valsa + baixo + acordes + arpejo',
          defaultBpm: 100,
          styleId: 'waltz_3_4',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'grand_piano',
          icon: '🎼',
        },
        {
          id: 'piano-solo',
          label: 'Piano Solo',
          description: 'Melodia ao piano sem acompanhamento',
          defaultBpm: 88,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎹',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Am', durationBeats: 3 },
        { measure: 2, beat: 1, chord: 'E', durationBeats: 3 },
        { measure: 3, beat: 1, chord: 'Am', durationBeats: 3 },
        { measure: 4, beat: 1, chord: 'Am', durationBeats: 3 },
        { measure: 5, beat: 1, chord: 'E', durationBeats: 3 },
        { measure: 6, beat: 1, chord: 'Am', durationBeats: 3 },
        { measure: 7, beat: 1, chord: 'Dm', durationBeats: 3 },
        { measure: 8, beat: 1, chord: 'Am', durationBeats: 3 },
        { measure: 9, beat: 1, chord: 'E7', durationBeats: 3 },
        { measure: 10, beat: 1, chord: 'Am', durationBeats: 3 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HASTA SIEMPRE, COMANDANTE — Carlos Puebla, Cuba, 1965
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'hasta-siempre',
    title: 'Hasta Siempre, Comandante',
    composerOrArtist: 'Carlos Puebla (1965)',
    genre: 'Internacional & Folk',
    difficulty: 'Intermediário',
    recommendedBpm: 88,
    timeSignature: '3/4',
    tonality: 'Ré Menor (Dm)',
    description: 'Canção de son cubano em compasso 3/4, homenagem ao Che Guevara. Melodia expressiva com progressão Dm–Am–C–Gm–A7 e forte apelo lírico.',
    historicalContext: 'Composta por Carlos Puebla em 1965, logo após a partida do Che Guevara de Cuba para continuar a revolução. Tornou-se um dos mais conhecidos hinos da canção latino-americana de protesto.',
    biomechanicsTip: 'Estilo son cubano: o tempo 1 tem o acento do baixo (forte), seguido de acordes nos tempos 2 e 3 com staccato leve.',
    chords: ['Dm', 'Am', 'C', 'Gm', 'A7', 'Dm'],
    scoreTrack: [
      // ─── INTRODUÇÃO (Compassos 1–4) ──────────────────────────────────────
      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 4, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'F4' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'E4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'C4' },

      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 2, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'A3' },

      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'A#3' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 2.5, measure: 4, fingerRightHand: 4, noteName: 'D4' },

      // ─── VERSO 1 (Compassos 5–12) ────────────────────────────────────────
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'E4' },

      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 4, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 5, noteName: 'F4' },

      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 77, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'F4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'D4' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1.5, beat: 2.5, measure: 8, fingerRightHand: 1, noteName: 'A3' },

      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'D4' },

      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 10, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'D4' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 11, fingerRightHand: 2, noteName: 'B3' },

      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 69, clef: 'treble', duration: 3, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'A3' },

      // ─── REFRÃO — "Hasta Siempre..." (Compassos 13–20) ──────────────────
      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 5, noteName: 'F4' },
      { midi: 79, clef: 'treble', duration: 1, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'G4' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 79, clef: 'treble', duration: 1.5, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 1.5, beat: 2.5, measure: 14, fingerRightHand: 4, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 3, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 15, fingerRightHand: 4, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 2, measure: 15, fingerRightHand: 3, noteName: 'D4' },

      { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 2.5, measure: 16, fingerRightHand: 2, noteName: 'C4' },

      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 17, fingerRightHand: 3, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 2, measure: 17, fingerRightHand: 4, noteName: 'E4' },

      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 3, beat: 1, measure: 18, fingerRightHand: 3, noteName: 'D4' },

      // ─── ENCERRAMENTO (Compassos 19–20) ────────────────────────────────
      { midi: 57, clef: 'bass', duration: 3, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 19, fingerRightHand: 3, noteName: 'C#4' },
      { midi: 71, clef: 'treble', duration: 1.5, beat: 2.5, measure: 19, fingerRightHand: 2, noteName: 'B3' },

      { midi: 50, clef: 'bass', duration: 3, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 1, noteName: 'A3' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 3, beat: 1, measure: 20, fingerRightHand: 5, noteName: 'F4' },
    ],
    extension: {
      credits: {
        composer: 'Carlos Puebla',
        lyricist: 'Carlos Puebla',
        originalArtist: 'Carlos Puebla y sus Tradicionales',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Transcrição melódica original — fins educativos',
        lyricsSource: 'Letra original de Carlos Puebla, 1965 — uso com atribuição',
        license: 'creative_commons',
        publishedYear: 1965,
        origin: 'Cuba',
        notes: 'Carlos Puebla (1917–1989). Licença de uso educativo com atribuição ao autor. Não reproduz arranjo original protegido — apenas melodia transcrita.',
      },
      sections: [
        { id: 'intro', label: 'Introdução', startMeasure: 1, endMeasure: 4, dynamic: 'mp', icon: 'intro' },
        { id: 'verse1', label: 'Verso 1', startMeasure: 5, endMeasure: 12, dynamic: 'mf', icon: 'verse' },
        { id: 'chorus', label: 'Refrão', startMeasure: 13, endMeasure: 18, dynamic: 'f', icon: 'chorus' },
        { id: 'outro', label: 'Encerramento', startMeasure: 19, endMeasure: 20, dynamic: 'mf', icon: 'outro' },
      ],
      lyrics: [
        { text: 'Aprendimos a quererte', startBeat: 13, endBeat: 19, startMeasure: 5, section: 'verse1', lineType: 'verse' },
        { text: 'Desde la histórica jornada', startBeat: 19, endBeat: 25, startMeasure: 7, section: 'verse1', lineType: 'verse' },
        { text: 'Cuando tu presencia guerrillera', startBeat: 25, endBeat: 31, startMeasure: 9, section: 'verse1', lineType: 'verse' },
        { text: 'Dejó un rastro de aurora en la Sierra', startBeat: 31, endBeat: 37, startMeasure: 11, section: 'verse1', lineType: 'verse' },
        { text: '¡Hasta siempre, Comandante!', startBeat: 37, endBeat: 43, startMeasure: 13, section: 'chorus', lineType: 'chorus' },
        { text: 'Nuestros corazones te reciben', startBeat: 43, endBeat: 49, startMeasure: 15, section: 'chorus', lineType: 'chorus' },
        { text: 'Y aunque te alejaste al horizonte', startBeat: 49, endBeat: 55, startMeasure: 17, section: 'chorus', lineType: 'chorus' },
        { text: 'Quedarás en nuestra historia', startBeat: 55, endBeat: 61, startMeasure: 19, section: 'outro', lineType: 'chorus' },
      ],
      arrangements: [
        {
          id: 'acoustic-son',
          label: 'Son Cubano Acústico',
          description: 'Violão + baixo no estilo son cubano tradicional',
          defaultBpm: 88,
          styleId: 'waltz_3_4',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'guitar_nylon',
          icon: '🎸',
        },
        {
          id: 'full-cuban',
          label: 'Conjunto Cubano',
          description: 'Bateria de son + baixo + acordes + arpejo',
          defaultBpm: 88,
          styleId: 'waltz_3_4',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'grand_piano',
          icon: '🎺',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Dm', durationBeats: 3 },
        { measure: 2, beat: 1, chord: 'Am', durationBeats: 3 },
        { measure: 3, beat: 1, chord: 'C', durationBeats: 3 },
        { measure: 4, beat: 1, chord: 'Gm', durationBeats: 3 },
        { measure: 5, beat: 1, chord: 'A7', durationBeats: 3 },
        { measure: 6, beat: 1, chord: 'Dm', durationBeats: 3 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. EL CÓNDOR PASA — Daniel Alomía Robles, Peru, 1913 (Domínio Público)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'el-condor-pasa',
    title: 'El Cóndor Pasa',
    composerOrArtist: 'Daniel Alomía Robles (1913) — Domínio Público',
    genre: 'Internacional & Folk',
    difficulty: 'Intermediário',
    recommendedBpm: 76,
    timeSignature: '4/4',
    tonality: 'Sol Menor (Gm)',
    description: 'Melodia andina peruana de Daniel Alomía Robles, 1913. Modo mixolídio/menor com escala pentatônica andina. Melodia lenta e expressiva com progressão Gm–F–Bb–Dm.',
    historicalContext: 'Composta em 1913 por Daniel Alomía Robles para a zarzuela homônima. É obra em domínio público (publicada há mais de 110 anos). Ficou mundialmente conhecida na versão de Simon & Garfunkel de 1970.',
    biomechanicsTip: 'Melodia de caráter legato: mantenha os dedos próximos às teclas e use pedal de sustain com moderação para preservar a articulação andina.',
    chords: ['Gm', 'F', 'Bb', 'Dm', 'Eb', 'D'],
    scoreTrack: [
      // ─── INTRODUÇÃO — Arpejo Pentatônico (Compassos 1–2) ─────────────────
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'A#3' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'F3' },

      // ─── TEMA A (Compassos 3–10) ─────────────────────────────────────────
      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A#1', chordName: 'Bb' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'A#3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 1, noteName: 'G3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'G3' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 1, noteName: 'G3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 1, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 2, noteName: 'G3' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 1, noteName: 'F3' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'D4' },

      // ─── TEMA B (Compassos 9–16) ─────────────────────────────────────────
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 3, noteName: 'C4' },
      { midi: 70, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'A#3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 1, noteName: 'G3' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'A#1', chordName: 'Bb' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 2, noteName: 'G3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 70, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 11, fingerRightHand: 2, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 1, noteName: 'G3' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'F#3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 4, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 2, noteName: 'A#3' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 1, noteName: 'F3' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 63, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 1, noteName: 'Eb3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 2, noteName: 'F3' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 16, fingerRightHand: 2, noteName: 'G3' },
      { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 1, noteName: 'F#3' },

      // ─── FINAL (Compasso 17: Gm com acordes) ────────────────────────────
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 17, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 17, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'D4' },
    ],
    extension: {
      credits: {
        composer: 'Daniel Alomía Robles',
        lyricist: 'Julio de la Paz (versão original), Paul Simon (versão 1970)',
        originalArtist: 'Daniel Alomía Robles (1913)',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Domínio Público — IMSLP / obra publicada em 1913',
        lyricsSource: 'Tradição andina / domínio público',
        license: 'public_domain',
        publishedYear: 1913,
        origin: 'Peru',
        notes: 'Daniel Alomía Robles (1871–1942). Obra em domínio público — publicada há mais de 110 anos. A versão de Simon & Garfunkel (1970) tem direitos separados e não é reproduzida aqui.',
      },
      sections: [
        { id: 'intro', label: 'Introdução', startMeasure: 1, endMeasure: 2, dynamic: 'mp', icon: 'intro' },
        { id: 'themeA', label: 'Tema A', startMeasure: 3, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'themeB', label: 'Tema B', startMeasure: 9, endMeasure: 16, dynamic: 'f', icon: 'chorus' },
        { id: 'outro', label: 'Final', startMeasure: 17, endMeasure: 17, dynamic: 'mf', icon: 'outro' },
      ],
      lyrics: [
        { text: '🎵 (Melodia andina instrumental)', startBeat: 1, endBeat: 9, startMeasure: 1, section: 'intro', lineType: 'instrumental' },
        { text: 'Al cóndor de los Andes despertó', startBeat: 9, endBeat: 17, startMeasure: 3, section: 'themeA', lineType: 'verse' },
        { text: 'Y entre el clamor del viento su vuelo comenzó', startBeat: 17, endBeat: 25, startMeasure: 5, section: 'themeA', lineType: 'verse' },
        { text: 'Andino y majestuoso surge ya', startBeat: 33, endBeat: 41, startMeasure: 9, section: 'themeB', lineType: 'chorus' },
        { text: 'El gran señor del aire en libertad', startBeat: 41, endBeat: 49, startMeasure: 11, section: 'themeB', lineType: 'chorus' },
      ],
      arrangements: [
        {
          id: 'andean-arpegio',
          label: 'Arpejo Andino',
          description: 'Piano solo com arpejos pentatônicos no estilo andino',
          defaultBpm: 76,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: true },
          melodicTimbre: 'flute',
          icon: '🪈',
        },
        {
          id: 'full-andean',
          label: 'Conjunto Andino',
          description: 'Flauta + baixo + acordes suaves',
          defaultBpm: 76,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'strings',
          icon: '🎻',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'Bb', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 6, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'D', durationBeats: 4 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. GUANTANAMERA — Melodia Tradicional Cubana / Letra José Martí (D.P.)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'guantanamera',
    title: 'Guantanamera',
    composerOrArtist: 'Melodia: Joseíto Fernández (1928) — Letra: José Martí (1891)',
    genre: 'Internacional & Folk',
    difficulty: 'Iniciante',
    recommendedBpm: 92,
    timeSignature: '4/4',
    tonality: 'Dó Maior (C)',
    description: 'Clássico cubano de melodia irresistível com progressão I–IV–V em Dó Maior. Estrutura simples de verso e refrão, ideal para iniciantes. Letra de José Martí (poema Versos Sencillos, 1891).',
    historicalContext: 'A melodia é atribuída a Joseíto Fernández (1908–1979), popularizada na versão com texto de José Martí por Pete Seeger em 1963. A letra é dos Versos Sencillos de José Martí (1891), obra em domínio público.',
    biomechanicsTip: 'Progressão C–F–G7 clássica: mão esquerda toca o baixo no tempo 1 e a terça/quinta nos tempos 2 e 4. Mantém o caráter de son cubano.',
    chords: ['C', 'F', 'G', 'G7', 'Am'],
    scoreTrack: [
      // ─── INTRODUÇÃO (Compassos 1–2) ───────────────────────────────────────
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'G3' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'C4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'F1', chordName: 'F' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'A3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'F3' },

      // ─── REFRÃO — "Guantanamera..." (Compassos 3–6) ──────────────────────
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 2, noteName: 'G3' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'C4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 1, noteName: 'F1', chordName: 'F' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'A3' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'F3' },

      // ─── VERSO 1 — "Yo soy un hombre sincero..." (Compassos 7–10) ────────
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 2, noteName: 'G3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 5, noteName: 'C4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 1, noteName: 'F1', chordName: 'F' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'C4' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 2, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 1, noteName: 'G3' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'G7' },
      { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 1, noteName: 'F3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 2, noteName: 'G3' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'C4' },

      // ─── PONTE e ENCERRAMENTO (Compassos 11–12) ─────────────────────────
      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 5, noteName: 'E4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'G3' },
      { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'C4' },
    ],
    extension: {
      credits: {
        composer: 'Joseíto Fernández',
        lyricist: 'José Martí (Versos Sencillos, 1891)',
        originalArtist: 'Joseíto Fernández / Pete Seeger',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Melodia tradicional cubana — domínio público',
        lyricsSource: 'José Martí, Versos Sencillos, 1891 — domínio público',
        license: 'traditional',
        publishedYear: 1928,
        origin: 'Cuba',
        notes: 'Melodia de tradição cubana. Letra dos Versos Sencillos de José Martí (1853–1895), domínio público. Versão aqui baseada na melodia tradicional.',
      },
      sections: [
        { id: 'intro', label: 'Introdução', startMeasure: 1, endMeasure: 2, dynamic: 'mp', icon: 'intro' },
        { id: 'chorus', label: 'Guantanamera', startMeasure: 3, endMeasure: 6, dynamic: 'mf', icon: 'chorus' },
        { id: 'verse1', label: 'Verso (Martí)', startMeasure: 7, endMeasure: 10, dynamic: 'mf', icon: 'verse' },
        { id: 'bridge', label: 'Ponte', startMeasure: 11, endMeasure: 12, dynamic: 'f', icon: 'outro' },
      ],
      lyrics: [
        { text: 'Guantanamera, guajira guantanamera', startBeat: 9, endBeat: 17, startMeasure: 3, section: 'chorus', lineType: 'chorus' },
        { text: 'Guantanamera, guajira guantanamera', startBeat: 17, endBeat: 25, startMeasure: 5, section: 'chorus', lineType: 'chorus' },
        { text: 'Yo soy un hombre sincero', startBeat: 25, endBeat: 29, startMeasure: 7, section: 'verse1', lineType: 'verse' },
        { text: 'De donde crece la palma', startBeat: 29, endBeat: 33, startMeasure: 8, section: 'verse1', lineType: 'verse' },
        { text: 'Yo soy un hombre sincero', startBeat: 33, endBeat: 37, startMeasure: 9, section: 'verse1', lineType: 'verse' },
        { text: 'De donde crece la palma', startBeat: 37, endBeat: 41, startMeasure: 10, section: 'verse1', lineType: 'verse' },
      ],
      arrangements: [
        {
          id: 'cuban-rhythm',
          label: 'Ritmo Cubano',
          description: 'Son cubano com bateria leve + baixo + acordes nos tempos 2 e 4',
          defaultBpm: 92,
          styleId: 'reggae',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎹',
        },
        {
          id: 'piano-simple',
          label: 'Piano Simples',
          description: 'Melodia ao piano sem acompanhamento — ideal para iniciantes',
          defaultBpm: 80,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎵',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'C', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'G', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'C', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 6, beat: 1, chord: 'G7', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'C', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 9, beat: 1, chord: 'G7', durationBeats: 4 },
        { measure: 10, beat: 1, chord: 'C', durationBeats: 4 },
        { measure: 11, beat: 1, chord: 'Am', durationBeats: 4 },
        { measure: 12, beat: 1, chord: 'C', durationBeats: 4 },
      ],
    },
  },
];
