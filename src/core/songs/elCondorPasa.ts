import type { RepertoireSong } from '../repertoireData';

export const EL_CONDOR_PASA: RepertoireSong = {
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
  };
