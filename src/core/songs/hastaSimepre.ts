import type { RepertoireSong } from '../repertoireData';

export const HASTA_SIEMPRE: RepertoireSong = {
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
  };
