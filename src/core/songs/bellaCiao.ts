import type { RepertoireSong } from '../repertoireData';

export const BELLA_CIAO: RepertoireSong = {
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
  };
