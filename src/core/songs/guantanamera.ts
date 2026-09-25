import type { RepertoireSong } from '../repertoireData';

export const GUANTANAMERA: RepertoireSong = {
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
  };
