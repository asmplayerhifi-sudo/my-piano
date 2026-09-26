import type { RepertoireSong } from '../repertoireData';

export const BORN_TO_RUN: RepertoireSong = {
  id: 'born-to-run',
  title: 'Born to Run',
  composerOrArtist: 'Bruce Springsteen (E Street Band)',
  genre: 'Pop & Rock Clássico',
  difficulty: 'Intermediário',
  recommendedBpm: 146,
  timeSignature: '4/4',
  tonality: 'Mi Maior (E)',
  description: 'O épico absoluto do rock norte-americano de 1975. Caracterizado pela pulsante e virtuosística introdução de piano de cauda de Roy Bittan e sinos tubulares, sustentada pela linha de baixo em oitavas e acordes em Mi Maior com vigor contagiante.',
  historicalContext: 'Lançada em 1975 na faixa-título do álbum divisor de águas de Bruce Springsteen, a faixa levou mais de seis meses de sessões exaustivas em Nova York para alcançar a perfeição da técnica "Wall of Sound".',
  biomechanicsTip: 'Utilize impulsos ágeis de pulso e antebraço na mão esquerda para manter o pulso enérgico em colcheias. Na mão direita, mantenha os dedos curvos e firmes para clareza no riff sincopado.',
  chords: ['E', 'A', 'B', 'C#m', 'F#m'],
  scoreTrack: [
    // ─── INTRO (Compassos 1 a 4) — O lendário riff de piano de Roy Bittan ───
    // Compasso 1 (E)
    { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 47, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 40, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'E1' },
    { midi: 47, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 2, noteName: 'B1' },
    { midi: 64, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E3' },
    { midi: 68, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 4, noteName: 'B3' },
    { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E4' },

    // Compasso 2 (A)
    { midi: 45, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 52, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 45, clef: 'bass', duration: 1, beat: 3, measure: 2, fingerLeftHand: 5, noteName: 'A1' },
    { midi: 52, clef: 'bass', duration: 1, beat: 4, measure: 2, fingerLeftHand: 2, noteName: 'E2' },
    { midi: 73, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'B3' },
    { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'A3' },

    // Compasso 3 (B)
    { midi: 47, clef: 'bass', duration: 1, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'B1', chordName: 'B' },
    { midi: 54, clef: 'bass', duration: 1, beat: 2, measure: 3, fingerLeftHand: 1, noteName: 'F#2' },
    { midi: 47, clef: 'bass', duration: 1, beat: 3, measure: 3, fingerLeftHand: 4, noteName: 'B1' },
    { midi: 54, clef: 'bass', duration: 1, beat: 4, measure: 3, fingerLeftHand: 1, noteName: 'F#2' },
    { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'B3' },
    { midi: 75, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 4, noteName: 'D#4' },
    { midi: 76, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'E4' },

    // Compasso 4 (E - preparação para o verso)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'E3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 4, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'B3' },

    // ─── VERSO (Compassos 5 a 8): "In the day we sweat it out on the streets..." ───
    // Compasso 5 (E) — "In the day we sweat it out on the streets..."
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 5, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 5, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 5, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 3, measure: 5, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 5, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 6 (A) — "...of a runaway American dream..."
    { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 6, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 69, clef: 'treble', duration: 1, beat: 1, measure: 6, fingerRightHand: 3, noteName: 'A3' },
    { midi: 68, clef: 'treble', duration: 1, beat: 2, measure: 6, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 66, clef: 'treble', duration: 2, beat: 3, measure: 6, fingerRightHand: 1, noteName: 'F#3' },

    // Compasso 7 (C#m - A) — "At night we ride through mansions of glory..."
    { midi: 49, clef: 'bass', duration: 2, beat: 1, measure: 7, fingerLeftHand: 3, noteName: 'C#2', chordName: 'C#m' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 7, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 68, clef: 'treble', duration: 1, beat: 1, measure: 7, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2, measure: 7, fingerRightHand: 4, noteName: 'B3' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 7, fingerRightHand: 5, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 7, fingerRightHand: 4, noteName: 'B3' },

    // Compasso 8 (B) — "...in suicide machines."
    { midi: 47, clef: 'bass', duration: 4, beat: 1, measure: 8, fingerLeftHand: 4, noteName: 'B1', chordName: 'B' },
    { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 8, fingerRightHand: 3, noteName: 'B3' },
    { midi: 68, clef: 'treble', duration: 2, beat: 3, measure: 8, fingerRightHand: 2, noteName: 'G#3' },

    // ─── REFRÃO CLÍMAX (Compassos 9 a 12): "Baby, this town rips the bones from your back..." ───
    // Compasso 9 (E - A) — "Baby, we were born to run!"
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 9, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 9, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 1, measure: 9, fingerRightHand: 5, noteName: 'E4' },
    { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 9, fingerRightHand: 4, noteName: 'D#4' },
    { midi: 73, clef: 'treble', duration: 1, beat: 3, measure: 9, fingerRightHand: 3, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 4, measure: 9, fingerRightHand: 2, noteName: 'B3' },

    // Compasso 10 (E - B)
    { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 10, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 10, fingerLeftHand: 4, noteName: 'B1', chordName: 'B' },
    { midi: 68, clef: 'treble', duration: 2, beat: 1, measure: 10, fingerRightHand: 1, noteName: 'G#3' },
    { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 10, fingerRightHand: 3, noteName: 'B3' },

    // Compasso 11 (A - B) — "Tramps like us, baby, we were born to run..."
    { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 11, fingerLeftHand: 5, noteName: 'A1', chordName: 'A' },
    { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 11, fingerLeftHand: 4, noteName: 'B1', chordName: 'B' },
    { midi: 73, clef: 'treble', duration: 1.5, beat: 1, measure: 11, fingerRightHand: 4, noteName: 'C#4' },
    { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 11, fingerRightHand: 3, noteName: 'B3' },
    { midi: 76, clef: 'treble', duration: 1.5, beat: 3.5, measure: 11, fingerRightHand: 5, noteName: 'E4' },

    // Compasso 12 (E - Resolução Épica)
    { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 12, fingerLeftHand: 5, noteName: 'E1', chordName: 'E' },
    { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 1, noteName: 'E3' },
    { midi: 68, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 2, noteName: 'G#3' },
    { midi: 76, clef: 'treble', duration: 4, beat: 1, measure: 12, fingerRightHand: 5, noteName: 'E4' },
  ],
  extension: {
    credits: {
      composer: 'Bruce Springsteen',
      lyricist: 'Bruce Springsteen',
      originalArtist: 'Bruce Springsteen & The E Street Band',
      arrangementAuthor: 'Harmonia Music Master Series',
      license: 'creative_commons',
      publishedYear: 1975,
      origin: 'EUA / Heartland Rock',
      notes: 'Transcrição didática do famoso tema de piano de Roy Bittan.',
    },
    sections: [
      { id: 'intro', label: 'Introdução Lendária de Piano', startMeasure: 1, endMeasure: 4, dynamic: 'f' },
      { id: 'verse', label: 'Verso Cinematográfico', startMeasure: 5, endMeasure: 8, dynamic: 'mf' },
      { id: 'chorus', label: 'Refrão Triunfal', startMeasure: 9, endMeasure: 12, dynamic: 'ff' },
    ],
    lyrics: [
      { text: 'In the day we sweat it out on the streets', startBeat: 17, endBeat: 21, startMeasure: 5, lineType: 'verse' },
      { text: 'Of a runaway American dream', startBeat: 21, endBeat: 25, startMeasure: 6, lineType: 'verse' },
      { text: 'At night we ride through mansions of glory', startBeat: 25, endBeat: 29, startMeasure: 7, lineType: 'verse' },
      { text: 'In suicide machines', startBeat: 29, endBeat: 33, startMeasure: 8, lineType: 'verse' },
      { text: "'Cause tramps like us, baby, we were born to run", startBeat: 33, endBeat: 44, startMeasure: 9, lineType: 'chorus' },
    ],
  },
};
