/**
 * Rock Psicodelico, Progressivo & Atmosferico — Composicoes Originais
 *
 * Cinco composicoes originais inspiradas nas caracteristicas musicais do
 * rock das decadas de 1960/1970, sem reproducao de arranjos protegidos.
 *
 * Licenca: Composicoes originais da Harmonia App — uso livre educativo.
 */

import type { RepertoireSong } from './repertoireData';

export const PSYCHEDELIC_ROCK_SONGS: RepertoireSong[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. ETHEREAL DRIFT — Rock Psicodelico Atmosferico (Em | 4/4 | 72 BPM)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ethereal-drift',
    title: 'Ethereal Drift',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Intermediario',
    recommendedBpm: 72,
    timeSignature: '4/4',
    tonality: 'Mi Menor (Em)',
    description: 'Jornada atmosferica em Mi Menor com arpejo pentatonico ascendente, drone de baixo sustentado e progressao Em-Cmaj7-G-D. Introducao eterica, verso denso e interludio contemplativo.',
    historicalContext: 'Composicao original inspirada no rock psicodelico britanico dos anos 60-70: baixo sustentado como pedal tonal, arpejos de guitarra sobre progressoes modais e dinamica gradual de ppp a fff.',
    biomechanicsTip: 'Arpejo em Mi Menor: posicione os dedos em E-G-B antes de tocar. Mantenha o movimento circular suave, sem tensao no pulso. O baixo sustentado (drone) deve ser tocado com toque firme e uniforme.',
    chords: ['Em', 'Cmaj7', 'G', 'D', 'Am', 'Bm'],
    scoreTrack: [
      // Introducao (C 1-4)
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'B3' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 5, noteName: 'E4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'B3' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 5, noteName: 'E4' },

      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C1', chordName: 'Cmaj7' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 2, noteName: 'G3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 5, noteName: 'E4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 2, noteName: 'B3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 4, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 4.5, measure: 2, fingerRightHand: 5, noteName: 'E4' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, fingerRightHand: 2, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 3, fingerRightHand: 3, noteName: 'D4' },
      { midi: 79, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, fingerRightHand: 2, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'D4' },
      { midi: 79, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 66, clef: 'treble', duration: 0.5, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 69, clef: 'treble', duration: 0.5, beat: 1.5, measure: 4, fingerRightHand: 2, noteName: 'A3' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'D4' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 4, fingerRightHand: 2, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 4, noteName: 'D4' },

      // Verso (C 5-12)
      { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 3, noteName: 'E2' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'B3' },

      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C1', chordName: 'Cmaj7' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'C4' },
      { midi: 71, clef: 'treble', duration: 0.5, beat: 2.5, measure: 6, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'A3' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 2, noteName: 'D4' },

      { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 8, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 8, fingerRightHand: 2, noteName: 'B3' },
      { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 8, fingerRightHand: 1, noteName: 'A3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'B3' },

      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 88, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'E5' },
      { midi: 86, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'D5' },
      { midi: 83, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 2, noteName: 'B4' },

      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C1', chordName: 'Cmaj7' },
      { midi: 84, clef: 'treble', duration: 1.5, beat: 1, measure: 10, fingerRightHand: 3, noteName: 'C5' },
      { midi: 83, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 2, noteName: 'B4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 1, noteName: 'A4' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 91, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'G5' },
      { midi: 88, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'E5' },

      { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 40, clef: 'bass', duration: 2, beat: 3, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 86, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'D5' },
      { midi: 83, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'B4' },

      // Interludio (C 13-16)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 13, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 2, measure: 13, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'E4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 14, fingerRightHand: 1, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 14, fingerRightHand: 3, noteName: 'D4' },
      { midi: 78, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 5, noteName: 'F#4' },

      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 15, fingerRightHand: 4, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 15, fingerRightHand: 2, noteName: 'B3' },

      { midi: 36, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'C1', chordName: 'Cmaj7' },
      { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 4, noteName: 'C4' },

      // Encerramento (C 17-20)
      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 3, noteName: 'E4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 18, fingerRightHand: 4, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 18, fingerRightHand: 2, noteName: 'B3' },

      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 19, fingerRightHand: 2, noteName: 'G3' },
      { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 19, fingerRightHand: 1, noteName: 'E3' },

      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'E1', chordName: 'Em' },
      { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 1, noteName: 'E3' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 2, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 20, fingerRightHand: 3, noteName: 'B3' },
    ],
    extension: {
      credits: {
        composer: 'Harmonia App',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Composicao original',
        license: 'original',
        origin: 'Brasil',
      },
      sections: [
        { id: 'intro', label: 'Drift (Intro)', startMeasure: 1, endMeasure: 4, dynamic: 'pp', tempo: 72, icon: 'intro' },
        { id: 'verse1', label: 'Verso I', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'verse2', label: 'Verso II', startMeasure: 9, endMeasure: 12, dynamic: 'f', icon: 'verse' },
        { id: 'interlude', label: 'Interludio', startMeasure: 13, endMeasure: 16, dynamic: 'mp', icon: 'interlude' },
        { id: 'outro', label: 'Dissolve', startMeasure: 17, endMeasure: 20, dynamic: 'p', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'full-psychedelic',
          label: 'Psicodelico Completo',
          description: 'Bateria progressiva + baixo sustentado + acordes + arpejos',
          defaultBpm: 72,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'rhodes',
          icon: '🌌',
        },
        {
          id: 'ambient-keys',
          label: 'Teclado Ambiente',
          description: 'Apenas piano Rhodes com arpejo atmosferico',
          defaultBpm: 60,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: true },
          melodicTimbre: 'synth_pad',
          icon: '🎹',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Em', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'Cmaj7', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'G', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'D', durationBeats: 4 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. STONE MANDALA — Rock Progressivo (Dm | 4/4 | 88 BPM)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'stone-mandala',
    title: 'Stone Mandala',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Intermediario',
    recommendedBpm: 88,
    timeSignature: '4/4',
    tonality: 'Re Menor (Dm)',
    description: 'Groove de rock progressivo em Re Menor com linha de baixo marcante em oitavas, progressao modal Dm-C-Bb-A7 e secao de solo melodico no interludio.',
    historicalContext: 'Inspirado no rock progressivo britanico dos anos 70: progressoes modais, baixo melodico e contraponto entre guitarra e teclado.',
    biomechanicsTip: 'Baixo em oitavas: polegar no D grave e indicador na oitava superior. Mantenha o cotovelo baixo para facilitar o salto de oitava sem tensao.',
    chords: ['Dm', 'C', 'Bb', 'A7', 'Gm', 'F'],
    scoreTrack: [
      // Groove (C 1-8)
      { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 50, clef: 'bass', duration: 0.5, beat: 2, measure: 1, fingerLeftHand: 5, noteName: 'D2' },
      { midi: 62, clef: 'bass', duration: 0.5, beat: 2.5, measure: 1, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 50, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'D2' },
      { midi: 62, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'D4' },

      { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 2, noteName: 'C3' },
      { midi: 72, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'C4' },

      { midi: 46, clef: 'bass', duration: 2, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 58, clef: 'bass', duration: 2, beat: 3, measure: 3, fingerLeftHand: 2, noteName: 'Bb2' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'D4' },

      { midi: 57, clef: 'bass', duration: 2, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 57, clef: 'bass', duration: 0.5, beat: 3, measure: 4, fingerLeftHand: 5, noteName: 'A1' },
      { midi: 69, clef: 'bass', duration: 1.5, beat: 3.5, measure: 4, fingerLeftHand: 2, noteName: 'A2' },
      { midi: 73, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'E4' },

      { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'bass', duration: 2, beat: 3, measure: 5, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 77, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'F4' },
      { midi: 79, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 2, noteName: 'D4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 3, noteName: 'D4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 3, measure: 6, fingerRightHand: 4, noteName: 'E4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 4, measure: 6, fingerRightHand: 5, noteName: 'F4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 4, noteName: 'F4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'D4' },

      // Solo (C 9-16)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'F4' },
      { midi: 79, clef: 'treble', duration: 0.5, beat: 1.5, measure: 9, fingerRightHand: 5, noteName: 'G4' },
      { midi: 81, clef: 'treble', duration: 0.5, beat: 2, measure: 9, fingerRightHand: 5, noteName: 'A4' },
      { midi: 79, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 5, noteName: 'G4' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 3, measure: 9, fingerRightHand: 4, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3.5, measure: 9, fingerRightHand: 3, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 4, measure: 9, fingerRightHand: 2, noteName: 'C4' },
      { midi: 70, clef: 'treble', duration: 0.5, beat: 4.5, measure: 9, fingerRightHand: 1, noteName: 'Bb3' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2, measure: 10, fingerRightHand: 3, noteName: 'C4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 2.5, measure: 10, fingerRightHand: 4, noteName: 'D4' },
      { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 10, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 0.5, beat: 3.5, measure: 10, fingerRightHand: 4, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 10, fingerRightHand: 3, noteName: 'C4' },

      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 11, fingerRightHand: 4, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 11, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'D4' },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 11, fingerRightHand: 2, noteName: 'C4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 73, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 3, noteName: 'C#4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 5, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 4, noteName: 'E4' },

      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 77, clef: 'treble', duration: 4, beat: 1, measure: 15, fingerRightHand: 5, noteName: 'F4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 3, noteName: 'D4' },

      // Refrao Final (C 17-24)
      { midi: 50, clef: 'bass', duration: 1, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 62, clef: 'bass', duration: 1, beat: 2, measure: 17, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 50, clef: 'bass', duration: 1, beat: 3, measure: 17, fingerLeftHand: 5, noteName: 'D2' },
      { midi: 62, clef: 'bass', duration: 1, beat: 4, measure: 17, fingerLeftHand: 2, noteName: 'D3' },
      { midi: 81, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'A4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 3, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 18, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 18, fingerRightHand: 3, noteName: 'E4' },

      { midi: 46, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 19, fingerRightHand: 5, noteName: 'F4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 19, fingerRightHand: 3, noteName: 'D4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 76, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 5, noteName: 'E4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 2, measure: 20, fingerRightHand: 3, noteName: 'D4' },
      { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 20, fingerRightHand: 2, noteName: 'C#4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 20, fingerRightHand: 3, noteName: 'D4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 21, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 21, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 21, fingerRightHand: 5, noteName: 'F4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 22, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 22, fingerRightHand: 4, noteName: 'F4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 22, fingerRightHand: 3, noteName: 'E4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 23, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 23, fingerRightHand: 3, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 23, fingerRightHand: 1, noteName: 'Bb3' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'A1', chordName: 'A7' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 1, noteName: 'A3' },
      { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'C#4' },
      { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 24, fingerRightHand: 5, noteName: 'E4' },
    ],
    extension: {
      credits: {
        composer: 'Harmonia App',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Composicao original',
        license: 'original',
        origin: 'Brasil',
      },
      sections: [
        { id: 'groove', label: 'Groove I', startMeasure: 1, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'solo', label: 'Solo / Interludio', startMeasure: 9, endMeasure: 16, dynamic: 'f', icon: 'solo' },
        { id: 'chorus', label: 'Refrao Final', startMeasure: 17, endMeasure: 24, dynamic: 'ff', icon: 'chorus' },
      ],
      arrangements: [
        {
          id: 'prog-full',
          label: 'Rock Progressivo Completo',
          description: 'Bateria com fills + baixo em oitavas + acordes + solo',
          defaultBpm: 88,
          styleId: 'pop_rock',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'organ',
          icon: '🎸',
        },
        {
          id: 'bass-heavy',
          label: 'Baixo em Destaque',
          description: 'Bateria + baixo em oitavas',
          defaultBpm: 88,
          styleId: 'pop_rock',
          enabledChannels: { drums: true, bass: true, chords: false, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎚️',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'C', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'Bb', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'A7', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'Gm', durationBeats: 4 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. THE QUIET STORM — Space Rock / Drone (Am | 4/4 | 60 BPM)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'the-quiet-storm',
    title: 'The Quiet Storm',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Intermediario',
    recommendedBpm: 60,
    timeSignature: '4/4',
    tonality: 'La Menor (Am)',
    description: 'Space rock contemplativo em La Menor com modo Eolico puro, drone de Am no baixo e crescimento gradual de pp a ff. Excelente para explorar a escala menor natural.',
    historicalContext: 'Inspirado no space rock e no krautrock dos anos 70: minimalismo ritmico, pedal point no baixo e crescimento gradual de tensao e dinamica.',
    biomechanicsTip: 'Peca lenta: use o peso do braco, nao a forca dos dedos. Cada nota deve soar cheia e sustentada.',
    chords: ['Am', 'G', 'F', 'E7', 'Dm', 'C'],
    scoreTrack: [
      // Abertura (C 1-4)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'A3' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'E4' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'F4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 4, noteName: 'E4' },

      // Crescendo (C 5-8)
      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'A1', chordName: 'E7' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 4, noteName: 'E4' },
      { midi: 73, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'C#4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 2, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 4, noteName: 'E4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 5, noteName: 'A4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 81, clef: 'treble', duration: 2, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'A4' },
      { midi: 77, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 3, noteName: 'F4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'C2', chordName: 'C' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 4, noteName: 'E4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'C4' },

      // Pico ff (C 9-12)
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 3, noteName: 'A2' },
      { midi: 81, clef: 'treble', duration: 1, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'A4' },
      { midi: 84, clef: 'treble', duration: 1, beat: 2, measure: 9, fingerRightHand: 5, noteName: 'C5' },
      { midi: 88, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'E5' },

      { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 91, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'G5' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 89, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'F5' },
      { midi: 88, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 4, noteName: 'E5' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'A1', chordName: 'E7' },
      { midi: 88, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 4, noteName: 'E5' },
      { midi: 85, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 2, noteName: 'C#5' },

      // Dissolve (C 13-16)
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 81, clef: 'treble', duration: 4, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'A4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 14, fingerRightHand: 4, noteName: 'E4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'C4' },

      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'A1', chordName: 'Am' },
      { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A3' },
      { midi: 72, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'C4' },
      { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'E4' },
    ],
    extension: {
      credits: {
        composer: 'Harmonia App',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Composicao original',
        license: 'original',
        origin: 'Brasil',
      },
      sections: [
        { id: 'drone', label: 'Drone', startMeasure: 1, endMeasure: 4, dynamic: 'pp', tempo: 60, icon: 'intro' },
        { id: 'build1', label: 'Crescendo', startMeasure: 5, endMeasure: 8, dynamic: 'mp', icon: 'verse' },
        { id: 'peak', label: 'Pico (ff)', startMeasure: 9, endMeasure: 12, dynamic: 'ff', icon: 'chorus' },
        { id: 'dissolve', label: 'Dissolve', startMeasure: 13, endMeasure: 16, dynamic: 'pp', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'space-full',
          label: 'Space Rock',
          description: 'Bateria lenta + drone de baixo + acordes longos',
          defaultBpm: 60,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'synth_pad',
          icon: '🌠',
        },
        {
          id: 'piano-meditation',
          label: 'Meditacao',
          description: 'Piano solo sem acompanhamento',
          defaultBpm: 52,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🕯️',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Am', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'G', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'E7', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'C', durationBeats: 4 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CRIMSON TIDE RISING — Rock Progressivo (Bm | 4/4 | 104 BPM)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'crimson-tide-rising',
    title: 'Crimson Tide Rising',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Avancado',
    recommendedBpm: 104,
    timeSignature: '4/4',
    tonality: 'Si Menor (Bm)',
    description: 'Rock progressivo intenso em Si Menor com linha de baixo melodica, progressao Bm-A-G-F#7 e acordes estendidos. Nivel avancado com mudancas de posicao e dinamica exigente.',
    historicalContext: 'Inspirado na escola do rock progressivo britanico: complexidade com acordes de setima e nona, baixo melodico contrapuntistico.',
    biomechanicsTip: 'Secoces avancadas exigem pratica por partes. Mantenha o punho abaixado para facilitar extensoes.',
    chords: ['Bm', 'A', 'G', 'F#7', 'Em', 'D'],
    scoreTrack: [
      // Abertura (C 1-4)
      { midi: 47, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 59, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 2, noteName: 'B2' },
      { midi: 47, clef: 'bass', duration: 0.5, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'B1' },
      { midi: 54, clef: 'bass', duration: 0.5, beat: 3.5, measure: 1, fingerLeftHand: 3, noteName: 'F#2' },
      { midi: 59, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 2, noteName: 'B2' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'D4' },
      { midi: 78, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 83, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 81, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },
      { midi: 78, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'E4' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 4, noteName: 'F4' },
      { midi: 75, clef: 'treble', duration: 1, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'Eb4' },
      { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 4, fingerRightHand: 2, noteName: 'D4' },

      // Desenvolvimento (C 5-16)
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 83, clef: 'treble', duration: 2, beat: 1, measure: 5, fingerRightHand: 5, noteName: 'B4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 4, noteName: 'A4' },

      { midi: 52, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 76, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'E4' },
      { midi: 79, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 5, noteName: 'G4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'D2', chordName: 'D' },
      { midi: 81, clef: 'treble', duration: 4, beat: 1, measure: 7, fingerRightHand: 5, noteName: 'A4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 3, noteName: 'E4' },

      { midi: 47, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 59, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'B2' },
      { midi: 86, clef: 'treble', duration: 4, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'D5' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 88, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'E5' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 89, clef: 'treble', duration: 4, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'F5' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 90, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'F#5' },
      { midi: 89, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 4, noteName: 'F5' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 88, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 5, noteName: 'E5' },
      { midi: 86, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 3, noteName: 'D5' },

      { midi: 52, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 83, clef: 'treble', duration: 4, beat: 1, measure: 14, fingerRightHand: 2, noteName: 'B4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 81, clef: 'treble', duration: 2, beat: 1, measure: 15, fingerRightHand: 3, noteName: 'A4' },
      { midi: 78, clef: 'treble', duration: 2, beat: 3, measure: 15, fingerRightHand: 1, noteName: 'F#4' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'D4' },
      { midi: 78, clef: 'treble', duration: 1, beat: 1, measure: 16, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 83, clef: 'treble', duration: 4, beat: 1, measure: 16, fingerRightHand: 5, noteName: 'B4' },

      // Coda (C 17-28)
      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 83, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 5, noteName: 'B4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 4, noteName: 'A4' },

      { midi: 57, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 18, fingerRightHand: 3, noteName: 'F#4' },
      { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 18, fingerRightHand: 2, noteName: 'E4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 19, fingerRightHand: 1, noteName: 'D4' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 20, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 75, clef: 'treble', duration: 2, beat: 3, measure: 20, fingerRightHand: 2, noteName: 'Eb4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 21, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 21, fingerRightHand: 2, noteName: 'D4' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 21, fingerRightHand: 1, noteName: 'B3' },

      { midi: 52, clef: 'bass', duration: 4, beat: 1, measure: 22, fingerLeftHand: 5, noteName: 'E2', chordName: 'Em' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 22, fingerRightHand: 1, noteName: 'B3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 23, fingerLeftHand: 5, noteName: 'G1', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 23, fingerRightHand: 1, noteName: 'G3' },
      { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 23, fingerRightHand: 2, noteName: 'B3' },

      { midi: 54, clef: 'bass', duration: 4, beat: 1, measure: 24, fingerLeftHand: 5, noteName: 'F#1', chordName: 'F#7' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 1, noteName: 'F#3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'A#3' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 24, fingerRightHand: 3, noteName: 'B3' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 25, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 25, fingerRightHand: 1, noteName: 'B3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 25, fingerRightHand: 3, noteName: 'D4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 26, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 26, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 26, fingerRightHand: 3, noteName: 'D4' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 27, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 27, fingerRightHand: 2, noteName: 'B3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 27, fingerRightHand: 1, noteName: 'G3' },

      { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 28, fingerLeftHand: 5, noteName: 'B1', chordName: 'Bm' },
      { midi: 59, clef: 'treble', duration: 1, beat: 1, measure: 28, fingerRightHand: 1, noteName: 'B2' },
      { midi: 66, clef: 'treble', duration: 1, beat: 1, measure: 28, fingerRightHand: 3, noteName: 'F#3' },
      { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 28, fingerRightHand: 5, noteName: 'B3' },
    ],
    extension: {
      credits: {
        composer: 'Harmonia App',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Composicao original',
        license: 'original',
        origin: 'Brasil',
      },
      sections: [
        { id: 'opening', label: 'Abertura', startMeasure: 1, endMeasure: 4, dynamic: 'f', icon: 'intro' },
        { id: 'dev1', label: 'Desenvolvimento', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'build', label: 'Construcao', startMeasure: 9, endMeasure: 12, dynamic: 'ff', icon: 'chorus' },
        { id: 'release', label: 'Dissolucao', startMeasure: 13, endMeasure: 16, dynamic: 'f', icon: 'bridge' },
        { id: 'coda', label: 'Coda Final', startMeasure: 17, endMeasure: 28, dynamic: 'mf', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'prog-rock-full',
          label: 'Progressivo Completo',
          description: 'Bateria com fills complexos + baixo melodico + acordes estendidos',
          defaultBpm: 104,
          styleId: 'pop_rock',
          enabledChannels: { drums: true, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'organ',
          icon: '🎸',
        },
        {
          id: 'reduced',
          label: 'Reduzido para Estudo',
          description: 'Piano + baixo sem bateria',
          defaultBpm: 88,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: false },
          melodicTimbre: 'grand_piano',
          icon: '🎹',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Bm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'A', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'G', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'F#7', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'Bm', durationBeats: 4 },
        { measure: 6, beat: 1, chord: 'Em', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'D', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'A', durationBeats: 4 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. STELLAR REQUIEM — Atmosferico / Folk-Progressivo (Gm | 4/4 | 68 BPM)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'stellar-requiem',
    title: 'Stellar Requiem',
    composerOrArtist: 'Harmonia App (Composicao Original)',
    genre: 'Rock Psicodelico & Progressivo',
    difficulty: 'Avancado',
    recommendedBpm: 68,
    timeSignature: '4/4',
    tonality: 'Sol Menor (Gm)',
    description: 'Requiem atmosferico em Sol Menor com acordes de nona e setima menor, progressao modal Gm-Eb-Bb-F-Dm-C e estrutura em arco com pico no compasso 10.',
    historicalContext: 'Fusao de folk celta e progressivo sinfonico: acordes de quatro vozes e progressoes modais que evitam cadencias tradicionais.',
    biomechanicsTip: 'Acordes de nona exigem extensao. Pratique separado por mao antes de unir. Mantenha o punho abaixado.',
    chords: ['Gm', 'Eb', 'Bb', 'F', 'Dm', 'Cm', 'D7'],
    scoreTrack: [
      // Prelude (C 1-4)
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'D4' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 75, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'Eb4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'C4' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'D4' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 77, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'F4' },
      { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'C4' },

      // Canto (C 5-8)
      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'D2', chordName: 'Dm' },
      { midi: 74, clef: 'treble', duration: 1.5, beat: 1, measure: 5, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 0.5, beat: 2.5, measure: 5, fingerRightHand: 5, noteName: 'F4' },
      { midi: 81, clef: 'treble', duration: 2, beat: 3, measure: 5, fingerRightHand: 5, noteName: 'A4' },

      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'C2', chordName: 'Cm' },
      { midi: 79, clef: 'treble', duration: 2, beat: 1, measure: 6, fingerRightHand: 5, noteName: 'G4' },
      { midi: 75, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 3, noteName: 'Eb4' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 7, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 3, noteName: 'D4' },
      { midi: 77, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'F4' },
      { midi: 82, clef: 'treble', duration: 2, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'A#4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 5, noteName: 'D2', chordName: 'D7' },
      { midi: 81, clef: 'treble', duration: 1.5, beat: 1, measure: 8, fingerRightHand: 5, noteName: 'A4' },
      { midi: 78, clef: 'treble', duration: 0.5, beat: 2.5, measure: 8, fingerRightHand: 4, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'D4' },

      // Climax ff (C 9-12)
      { midi: 55, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 2, noteName: 'G2' },
      { midi: 82, clef: 'treble', duration: 2, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'A#4' },
      { midi: 86, clef: 'treble', duration: 2, beat: 3, measure: 9, fingerRightHand: 5, noteName: 'D5' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 10, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 87, clef: 'treble', duration: 4, beat: 1, measure: 10, fingerRightHand: 5, noteName: 'Eb5' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 86, clef: 'treble', duration: 2, beat: 1, measure: 11, fingerRightHand: 5, noteName: 'D5' },
      { midi: 82, clef: 'treble', duration: 2, beat: 3, measure: 11, fingerRightHand: 3, noteName: 'A#4' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'D2', chordName: 'D7' },
      { midi: 78, clef: 'treble', duration: 2, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'F#4' },
      { midi: 74, clef: 'treble', duration: 2, beat: 3, measure: 12, fingerRightHand: 3, noteName: 'D4' },

      // Encerramento (C 13-20)
      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 13, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 74, clef: 'treble', duration: 2, beat: 1, measure: 13, fingerRightHand: 3, noteName: 'D4' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 13, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 51, clef: 'bass', duration: 4, beat: 1, measure: 14, fingerLeftHand: 4, noteName: 'Eb2', chordName: 'Eb' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 14, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 14, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 58, clef: 'bass', duration: 4, beat: 1, measure: 15, fingerLeftHand: 5, noteName: 'Bb1', chordName: 'Bb' },
      { midi: 70, clef: 'treble', duration: 4, beat: 1, measure: 15, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 53, clef: 'bass', duration: 4, beat: 1, measure: 16, fingerLeftHand: 5, noteName: 'F1', chordName: 'F' },
      { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 16, fingerRightHand: 1, noteName: 'A3' },
      { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 16, fingerRightHand: 1, noteName: 'G3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 17, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 17, fingerRightHand: 1, noteName: 'G3' },
      { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 17, fingerRightHand: 1, noteName: 'F3' },

      { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 18, fingerLeftHand: 5, noteName: 'D2', chordName: 'D7' },
      { midi: 66, clef: 'treble', duration: 4, beat: 1, measure: 18, fingerRightHand: 1, noteName: 'F#3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 19, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 19, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 2, beat: 3, measure: 19, fingerRightHand: 2, noteName: 'Bb3' },

      { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 20, fingerLeftHand: 5, noteName: 'G1', chordName: 'Gm' },
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 1, noteName: 'G3' },
      { midi: 70, clef: 'treble', duration: 1, beat: 1, measure: 20, fingerRightHand: 2, noteName: 'Bb3' },
      { midi: 74, clef: 'treble', duration: 4, beat: 1, measure: 20, fingerRightHand: 4, noteName: 'D4' },
    ],
    extension: {
      credits: {
        composer: 'Harmonia App',
        arrangementAuthor: 'Harmonia App',
        arrangementVersion: '1.0',
        scoreSource: 'Composicao original',
        license: 'original',
        origin: 'Brasil',
      },
      sections: [
        { id: 'prelude', label: 'Prelude', startMeasure: 1, endMeasure: 4, dynamic: 'mp', icon: 'intro' },
        { id: 'canto', label: 'Canto Principal', startMeasure: 5, endMeasure: 8, dynamic: 'mf', icon: 'verse' },
        { id: 'climax', label: 'Climax', startMeasure: 9, endMeasure: 12, dynamic: 'ff', icon: 'chorus' },
        { id: 'outro', label: 'Requiem Final', startMeasure: 13, endMeasure: 20, dynamic: 'p', icon: 'outro' },
      ],
      arrangements: [
        {
          id: 'orchestral',
          label: 'Orquestral',
          description: 'Cordas + orgao + baixo lento — sem bateria',
          defaultBpm: 68,
          styleId: 'ballad_6_8',
          enabledChannels: { drums: false, bass: true, chords: true, arpeggio: true },
          melodicTimbre: 'strings',
          icon: '🎻',
        },
        {
          id: 'piano-full',
          label: 'Piano Classico',
          description: 'Piano de cauda com arpejo sustentado',
          defaultBpm: 60,
          styleId: 'ballad_4_4',
          enabledChannels: { drums: false, bass: false, chords: false, arpeggio: true },
          melodicTimbre: 'grand_piano',
          icon: '🎹',
        },
      ],
      chordProgression: [
        { measure: 1, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 2, beat: 1, chord: 'Eb', durationBeats: 4 },
        { measure: 3, beat: 1, chord: 'Bb', durationBeats: 4 },
        { measure: 4, beat: 1, chord: 'F', durationBeats: 4 },
        { measure: 5, beat: 1, chord: 'Dm', durationBeats: 4 },
        { measure: 6, beat: 1, chord: 'Cm', durationBeats: 4 },
        { measure: 7, beat: 1, chord: 'Gm', durationBeats: 4 },
        { measure: 8, beat: 1, chord: 'D7', durationBeats: 4 },
      ],
    },
  },
];
