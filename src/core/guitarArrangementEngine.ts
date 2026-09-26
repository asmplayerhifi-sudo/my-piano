/**
 * guitarArrangementEngine.ts
 *
 * Motor Músico-Pedagógico para o "Modo Arranjo de Violão no Teclado".
 * Transcreve e adapta a linguagem idiomática do violão acústico e violão de 7 cordas
 * para execução autêntica em pauta dupla no teclado/piano.
 *
 * Idiomas Suportados:
 * 1. Dedilhado Arpejado Clássico (P-I-M-A): Polegar na clave de Fá, I-M-A na clave de Sol.
 * 2. Levada Bossa Nova & Samba: Síncope de João Gilberto, acordes pinçados e contrapontos.
 * 3. Baixarias de Violão de 7 Cordas / Regional: Linhas melódicas graves para Seresta, Choro e Forró.
 * 4. Reggae Skank: Contratempo jamaicano em blocos staccato e baixo roots marcado.
 * 5. Batida Folk/Rock (Strumming): Condução rítmica com abertura de cordas soltas.
 */

import type { ScoreNote } from './coursesData';
import type { RepertoireSong, SongGenre } from './repertoireData';
import type { TimbreId } from './soundEngineTypes';
import { parseChord } from './musicTheory';
import { octaveConfigStore } from './octaveConfigStore';

export type GuitarArrangementStyle =
  | 'pima_fingerpicking'
  | 'bossa_samba'
  | 'seven_string_baixaria'
  | 'reggae_skank'
  | 'acoustic_strumming';

export interface GuitarArrangementInfo {
  style: GuitarArrangementStyle;
  styleLabel: string;
  styleBadge: string;
  description: string;
  recommendedTimbre: TimbreId;
  recommendedTimbreName: string;
  techniqueSummary: string;
}

export interface GuitarVoicing {
  root: string;
  bassMidi: number;
  alternateBassMidi: number;
  upperMidi: number[];
  bassNoteName: string;
  baixariaNotes: number[];
}

/**
 * Mapeia o gênero musical para o estilo de arranjo idiomático de violão.
 */
export function getGuitarArrangementStyle(genre: SongGenre): GuitarArrangementStyle {
  switch (genre) {
    case 'Seresta & Brega (Zezo dos Teclados)':
    case 'Forró, Xote & Baião':
      return 'seven_string_baixaria';

    case 'MPB & Pop Nacional':
      return 'bossa_samba';

    case 'Reggae & Praieiro':
      return 'reggae_skank';

    case 'Pop & Rock Clássico':
    case 'Rock Anos 80 & New Wave':
    case 'Rock Psicodelico & Progressivo':
      return 'acoustic_strumming';

    case 'Clássico & Mestres':
    case 'Internacional & Folk':
    case 'Gospel Clássico & Sacro':
    case 'Infantis, Cirandas & Folclore':
    default:
      return 'pima_fingerpicking';
  }
}

/**
 * Retorna o timbre de violão/guitarra de alta fidelidade recomendado para o gênero.
 */
export function getRecommendedGuitarTimbre(genre: SongGenre): TimbreId {
  switch (genre) {
    case 'Seresta & Brega (Zezo dos Teclados)':
    case 'Forró, Xote & Baião':
      return 'guitar_7strings'; // Violão de 7 cordas para baixarias regionais

    case 'Reggae & Praieiro':
      return 'guitar_reggae_muted'; // Guitarra com abafamento e corte seco (skank)

    case 'Pop & Rock Clássico':
    case 'Rock Anos 80 & New Wave':
    case 'Rock Psicodelico & Progressivo':
      return 'guitar_strat_clean'; // Guitarra/Violão de Aço brilhante com single-coil

    case 'Clássico & Mestres':
    case 'MPB & Pop Nacional':
    case 'Internacional & Folk':
    case 'Gospel Clássico & Sacro':
    case 'Infantis, Cirandas & Folclore':
    default:
      return 'guitar_nylon'; // Violão acústico clássico em cordas de nylon
  }
}

/**
 * Rótulo amigável em português do timbre de violão recomendado.
 */
export function getRecommendedGuitarTimbreName(timbreId: TimbreId): string {
  switch (timbreId) {
    case 'guitar_7strings':
      return 'Violão de 7 Cordas (Baixarias Regional & Choro)';
    case 'guitar_reggae_muted':
      return 'Rhythm Guitar Reggae (Skank Abafado)';
    case 'guitar_strat_clean':
      return 'Stratocaster Clean / Aço (Rock & Pop)';
    case 'guitar_nylon':
    default:
      return 'Violão Nylon Nordestino / Clássico';
  }
}

/**
 * Retorna metadados completos de execução do modo violão para a música ativa.
 */
export function getGuitarArrangementInfo(song: RepertoireSong): GuitarArrangementInfo {
  const style = getGuitarArrangementStyle(song.genre);
  const recommendedTimbre = getRecommendedGuitarTimbre(song.genre);
  const recommendedTimbreName = getRecommendedGuitarTimbreName(recommendedTimbre);

  switch (style) {
    case 'seven_string_baixaria':
      return {
        style,
        styleLabel: 'Violão de 7 Cordas & Baixarias',
        styleBadge: '7 Cordas Regional',
        description: 'Baixarias na Clave de Fá descendo até a 7ª corda grave com acordes sincopados percussivos na mão direita.',
        recommendedTimbre,
        recommendedTimbreName,
        techniqueSummary: 'Mão Esquerda (P): Baixarias diatônicas e cromáticas de contraponto. Mão Direita: Batida sincopada.',
      };

    case 'bossa_samba':
      return {
        style,
        styleLabel: 'Levada Bossa Nova & Samba',
        styleBadge: 'Síncope Bossa',
        description: 'Batida rítmica inspirada em João Gilberto com acordes pinçados em contratempos e síncopes refinadas.',
        recommendedTimbre,
        recommendedTimbreName,
        techniqueSummary: 'Mão Esquerda (P): Bordões alternando tônica e quinta. Mão Direita (I-M-A): Acordes pinçados e ghost notes.',
      };

    case 'reggae_skank':
      return {
        style,
        styleLabel: 'Reggae Roots & Skank Muted',
        styleBadge: 'Skank Jamaicano',
        description: 'Contratempo rítmico percussivo nos tempos 2 e 4 com corte staccato macio e condução de baixo roots.',
        recommendedTimbre,
        recommendedTimbreName,
        techniqueSummary: 'Mão Esquerda: Baixo melódico pesado. Mão Direita: Acordes secos nos contratempos (chop).',
      };

    case 'acoustic_strumming':
      return {
        style,
        styleLabel: 'Batida Acústica & Strumming',
        styleBadge: 'Violão de Aço Folk',
        description: 'Levada com acordes abertos completos, alternância de bordões no baixo e batidas descendentes e ascendentes.',
        recommendedTimbre,
        recommendedTimbreName,
        techniqueSummary: 'Mão Esquerda: Bordão no tempo 1 e 3. Mão Direita: Batidas percussivas com cordas soltas ressoando.',
      };

    case 'pima_fingerpicking':
    default:
      return {
        style: 'pima_fingerpicking',
        styleLabel: 'Dedilhado Clássico (P-I-M-A)',
        styleBadge: 'Arpejo P-I-M-A',
        description: 'Arpejo fluido clássico adaptado para pauta dupla: polegar (P) no baixo e primas (I-M-A) na clave de Sol.',
        recommendedTimbre,
        recommendedTimbreName,
        techniqueSummary: 'Mão Esquerda (P): Bordões no tempo forte. Mão Direita (I-M-A): Dedilhado contínuo nas primas.',
      };
  }
}

/**
 * Tabela de voicings idiomáticos de violão acústico e 7 cordas.
 * Mapeia cada acorde para o bordão exato, quinta alternada, primas e baixarias.
 */
const GUITAR_VOICING_TABLE: Record<string, GuitarVoicing> = {
  'C': {
    root: 'C',
    bassMidi: 48, // C3 (Yamaha C2) - 5ª corda
    alternateBassMidi: 43, // G2 - 6ª corda
    upperMidi: [52, 55, 60, 64], // E3, G3, C4, E4
    bassNoteName: 'C2',
    baixariaNotes: [48, 47, 46, 45], // C -> B -> Bb -> A
  },
  'G': {
    root: 'G',
    bassMidi: 43, // G2 - 6ª corda
    alternateBassMidi: 50, // D3 - 4ª corda
    upperMidi: [50, 55, 59, 67], // D3, G3, B3, G4
    bassNoteName: 'G1',
    baixariaNotes: [43, 45, 47, 48], // G -> A -> B -> C
  },
  'D': {
    root: 'D',
    bassMidi: 50, // D3 - 4ª corda
    alternateBassMidi: 45, // A2 - 5ª corda
    upperMidi: [57, 62, 66], // A3, D4, F#4
    bassNoteName: 'D2',
    baixariaNotes: [50, 48, 47, 45], // D -> C -> B -> A
  },
  'Am': {
    root: 'A',
    bassMidi: 45, // A2 - 5ª corda
    alternateBassMidi: 40, // E2 - 6ª corda
    upperMidi: [52, 57, 60, 64], // E3, A3, C4, E4
    bassNoteName: 'A1',
    baixariaNotes: [45, 43, 42, 40], // A -> G -> F# -> E
  },
  'Em': {
    root: 'E',
    bassMidi: 40, // E2 - 6ª corda
    alternateBassMidi: 47, // B2 - 5ª corda
    upperMidi: [52, 55, 59, 64], // E3, G3, B3, E4
    bassNoteName: 'E1',
    baixariaNotes: [40, 42, 43, 45], // E -> F# -> G -> A
  },
  'F': {
    root: 'F',
    bassMidi: 41, // F2 - 6ª corda (pestana)
    alternateBassMidi: 48, // C3 - 5ª corda
    upperMidi: [53, 57, 60, 65], // F3, A3, C4, F4
    bassNoteName: 'F1',
    baixariaNotes: [41, 40, 38, 43], // F -> E -> D -> G
  },
  'Dm': {
    root: 'D',
    bassMidi: 50, // D3 - 4ª corda
    alternateBassMidi: 45, // A2 - 5ª corda
    upperMidi: [57, 62, 65], // A3, D4, F4
    bassNoteName: 'D2',
    baixariaNotes: [50, 48, 45, 43], // D -> C -> A -> G
  },
  'A': {
    root: 'A',
    bassMidi: 45, // A2 - 5ª corda
    alternateBassMidi: 40, // E2 - 6ª corda
    upperMidi: [52, 57, 61, 64], // E3, A3, C#4, E4
    bassNoteName: 'A1',
    baixariaNotes: [45, 47, 49, 50], // A -> B -> C# -> D
  },
  'E': {
    root: 'E',
    bassMidi: 40, // E2 - 6ª corda
    alternateBassMidi: 47, // B2 - 5ª corda
    upperMidi: [52, 56, 59, 64], // E3, G#3, B3, E4
    bassNoteName: 'E1',
    baixariaNotes: [40, 44, 45, 47], // E -> G# -> A -> B
  },
  'B7': {
    root: 'B',
    bassMidi: 47, // B2 - 5ª corda
    alternateBassMidi: 42, // F#2 - 6ª corda
    upperMidi: [51, 57, 59, 66], // D#3, A3, B3, F#4
    bassNoteName: 'B1',
    baixariaNotes: [47, 45, 43, 40], // B -> A -> G -> E
  },
  'C7': {
    root: 'C',
    bassMidi: 48, // C3
    alternateBassMidi: 43, // G2
    upperMidi: [52, 58, 60, 64], // E3, Bb3, C4, E4
    bassNoteName: 'C2',
    baixariaNotes: [48, 46, 45, 41], // C -> Bb -> A -> F
  },
  'G7': {
    root: 'G',
    bassMidi: 43, // G2
    alternateBassMidi: 50, // D3
    upperMidi: [50, 55, 59, 65], // D3, G3, B3, F4
    bassNoteName: 'G1',
    baixariaNotes: [43, 45, 47, 48], // G -> A -> B -> C
  },
  'A7': {
    root: 'A',
    bassMidi: 45, // A2
    alternateBassMidi: 40, // E2
    upperMidi: [52, 55, 61, 64], // E3, G3, C#4, E4
    bassNoteName: 'A1',
    baixariaNotes: [45, 47, 49, 50], // A -> B -> C# -> D
  },
  'D7': {
    root: 'D',
    bassMidi: 50, // D3
    alternateBassMidi: 45, // A2
    upperMidi: [54, 57, 60, 66], // F#3, A3, C4, F#4
    bassNoteName: 'D2',
    baixariaNotes: [50, 48, 47, 43], // D -> C -> B -> G
  },
  'E7': {
    root: 'E',
    bassMidi: 40, // E2
    alternateBassMidi: 47, // B2
    upperMidi: [52, 56, 59, 62], // E3, G#3, B3, D4
    bassNoteName: 'E1',
    baixariaNotes: [40, 42, 44, 45], // E -> F# -> G# -> A
  },
  'Bm': {
    root: 'B',
    bassMidi: 47, // B2
    alternateBassMidi: 42, // F#2
    upperMidi: [54, 59, 62, 66], // F#3, B3, D4, F#4
    bassNoteName: 'B1',
    baixariaNotes: [47, 45, 43, 42], // B -> A -> G -> F#
  },
  'F#m': {
    root: 'F#',
    bassMidi: 42, // F#2
    alternateBassMidi: 49, // C#3
    upperMidi: [54, 57, 61, 66], // F#3, A3, C#4, F#4
    bassNoteName: 'F#1',
    baixariaNotes: [42, 44, 45, 47], // F# -> G# -> A -> B
  },
  'Bb': {
    root: 'Bb',
    bassMidi: 46, // Bb2
    alternateBassMidi: 53, // F3
    upperMidi: [53, 58, 62, 65], // F3, Bb3, D4, F4
    bassNoteName: 'Bb1',
    baixariaNotes: [46, 45, 43, 41], // Bb -> A -> G -> F
  },
  'Eb': {
    root: 'Eb',
    bassMidi: 51, // Eb3
    alternateBassMidi: 46, // Bb2
    upperMidi: [55, 58, 63, 67], // G3, Bb3, Eb4, G4
    bassNoteName: 'Eb2',
    baixariaNotes: [51, 49, 48, 46], // Eb -> Db -> C -> Bb
  },
};

/**
 * Resolve o voicing de violão para qualquer símbolo de acorde.
 */
export function resolveGuitarVoicing(chordName: string): GuitarVoicing {
  const clean = (chordName || 'C').trim();
  if (GUITAR_VOICING_TABLE[clean]) {
    return GUITAR_VOICING_TABLE[clean];
  }

  // Se não estiver na tabela estática, decompõe via parseChord
  const parsed = parseChord(clean);
  if (!parsed) {
    return GUITAR_VOICING_TABLE['C'];
  }

  const rootPitch = parsed.root;
  // Fallback baseado na tônica
  const baseVoicing = GUITAR_VOICING_TABLE[rootPitch] || GUITAR_VOICING_TABLE['C'];

  // Ajusta notas superiores a partir dos intervalos do acorde
  const bassMidi = baseVoicing.bassMidi;
  const alternateBassMidi = baseVoicing.alternateBassMidi;
  const upperMidi = parsed.midiNotes.filter(m => m > bassMidi).slice(0, 4);

  return {
    root: parsed.root,
    bassMidi,
    alternateBassMidi,
    upperMidi: upperMidi.length >= 3 ? upperMidi : baseVoicing.upperMidi,
    bassNoteName: octaveConfigStore.midiToNoteName(bassMidi, 'C3'),
    baixariaNotes: baseVoicing.baixariaNotes,
  };
}

/**
 * Extrai a lista ordenada de compassos e acordes associados a partir da partitura original.
 */
interface MeasureHarmonicMap {
  measure: number;
  chordName: string;
}

function extractMeasureChords(song: RepertoireSong): MeasureHarmonicMap[] {
  const map: Map<number, string> = new Map();
  let maxMeasure = 1;

  // 1. Coleta os acordes explícitos anotados nas notas
  for (const n of song.scoreTrack) {
    const m = n.measure || 1;
    if (m > maxMeasure) maxMeasure = m;
    if (n.chordName && !map.has(m)) {
      map.set(m, n.chordName);
    }
  }

  // 2. Preenche compassos sem acorde explícito usando a harmonia sequencial da obra
  const result: MeasureHarmonicMap[] = [];
  let currentChord = song.chords[0] || 'C';
  let chordIndex = 0;

  for (let m = 1; m <= maxMeasure; m++) {
    if (map.has(m)) {
      currentChord = map.get(m)!;
    } else {
      if (song.chords.length > 0) {
        currentChord = song.chords[chordIndex % song.chords.length];
        chordIndex++;
      }
    }
    result.push({ measure: m, chordName: currentChord });
  }

  return result;
}

/**
 * Gera a transcrição idiomática de violão adaptada para leitura e execução no teclado.
 * Se a música possuir um `guitarScoreTrack` explícito de autor, utiliza-o prioritariamente.
 */
export function generateGuitarArrangementForKeyboard(song: RepertoireSong): ScoreNote[] {
  if (song.guitarScoreTrack && song.guitarScoreTrack.length > 0) {
    return song.guitarScoreTrack;
  }

  const style = getGuitarArrangementStyle(song.genre);
  const measureChords = extractMeasureChords(song);
  const timeSigParts = song.timeSignature.split('/');
  const beatsPerMeasure = parseInt(timeSigParts[0], 10) || 4;

  const resultNotes: ScoreNote[] = [];

  measureChords.forEach(({ measure, chordName }, idx) => {
    const nextChordName = measureChords[idx + 1]?.chordName || chordName;
    const voicing = resolveGuitarVoicing(chordName);
    const nextVoicing = resolveGuitarVoicing(nextChordName);

    switch (style) {
      // ────────────────────────────────────────────────────────────────────────
      // 1. DEDILHADO ARPEJADO CLÁSSICO (P-I-M-A)
      // ────────────────────────────────────────────────────────────────────────
      case 'pima_fingerpicking': {
        const u = voicing.upperMidi;
        const prima1 = u[0] || (voicing.bassMidi + 7);
        const prima2 = u[1] || (voicing.bassMidi + 12);
        const prima3 = u[2] || (voicing.bassMidi + 16);

        // Tempo 1: Polegar (P) no bordão principal (Clave de Fá)
        resultNotes.push({
          midi: voicing.bassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 1.0,
          measure,
          fingerLeftHand: 5,
          noteName: octaveConfigStore.midiToNoteName(voicing.bassMidi, 'C3'),
          chordName,
        });

        // Tempos 1.5, 2.0, 2.5: Primas I, M, A (Clave de Sol)
        resultNotes.push({
          midi: prima1,
          clef: 'treble',
          duration: 0.5,
          beat: 1.5,
          measure,
          fingerRightHand: 2, // Indicador
          noteName: octaveConfigStore.midiToNoteName(prima1, 'C3'),
        });
        resultNotes.push({
          midi: prima2,
          clef: 'treble',
          duration: 0.5,
          beat: 2.0,
          measure,
          fingerRightHand: 3, // Médio
          noteName: octaveConfigStore.midiToNoteName(prima2, 'C3'),
        });
        resultNotes.push({
          midi: prima3,
          clef: 'treble',
          duration: 0.5,
          beat: 2.5,
          measure,
          fingerRightHand: 4, // Anelar
          noteName: octaveConfigStore.midiToNoteName(prima3, 'C3'),
        });

        if (beatsPerMeasure >= 4) {
          // Tempo 3: Polegar no bordão alternado (quinta do acorde)
          resultNotes.push({
            midi: voicing.alternateBassMidi,
            clef: 'bass',
            duration: 1.0,
            beat: 3.0,
            measure,
            fingerLeftHand: 1,
            noteName: octaveConfigStore.midiToNoteName(voicing.alternateBassMidi, 'C3'),
          });

          // Tempos 3.5, 4.0, 4.5: Retorno arpejado I-M-A
          resultNotes.push({
            midi: prima3,
            clef: 'treble',
            duration: 0.5,
            beat: 3.5,
            measure,
            fingerRightHand: 4,
            noteName: octaveConfigStore.midiToNoteName(prima3, 'C3'),
          });
          resultNotes.push({
            midi: prima2,
            clef: 'treble',
            duration: 0.5,
            beat: 4.0,
            measure,
            fingerRightHand: 3,
            noteName: octaveConfigStore.midiToNoteName(prima2, 'C3'),
          });
          resultNotes.push({
            midi: prima1,
            clef: 'treble',
            duration: 0.5,
            beat: 4.5,
            measure,
            fingerRightHand: 2,
            noteName: octaveConfigStore.midiToNoteName(prima1, 'C3'),
          });
        } else if (beatsPerMeasure === 3) {
          // Para compasso ternário 3/4
          resultNotes.push({
            midi: prima2,
            clef: 'treble',
            duration: 0.5,
            beat: 3.0,
            measure,
            fingerRightHand: 3,
            noteName: octaveConfigStore.midiToNoteName(prima2, 'C3'),
          });
          resultNotes.push({
            midi: prima1,
            clef: 'treble',
            duration: 0.5,
            beat: 3.5,
            measure,
            fingerRightHand: 2,
            noteName: octaveConfigStore.midiToNoteName(prima1, 'C3'),
          });
        }
        break;
      }

      // ────────────────────────────────────────────────────────────────────────
      // 2. LEVADA BOSSA NOVA & SAMBA (Síncope João Gilberto)
      // ────────────────────────────────────────────────────────────────────────
      case 'bossa_samba': {
        const u = voicing.upperMidi;
        const mainChordNotes = u.slice(0, 3);

        // Tempo 1: Baixo (P) + Acorde pinçado simultâneo (I-M-A)
        resultNotes.push({
          midi: voicing.bassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 1.0,
          measure,
          fingerLeftHand: 5,
          noteName: octaveConfigStore.midiToNoteName(voicing.bassMidi, 'C3'),
          chordName,
        });

        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 1.0,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });

        // Tempo 2.0: Acorde pinçado na Clave de Sol
        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 2.0,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });

        // Tempo 2.5: Síncope antecipada de bossa
        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 2.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });

        // Tempo 3.0: Baixo na quinta
        resultNotes.push({
          midi: voicing.alternateBassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 3.0,
          measure,
          fingerLeftHand: 1,
          noteName: octaveConfigStore.midiToNoteName(voicing.alternateBassMidi, 'C3'),
        });

        // Tempo 3.5: Acorde sincopado final
        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 3.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });
        break;
      }

      // ────────────────────────────────────────────────────────────────────────
      // 3. VIOLÃO DE 7 CORDAS & BAIXARIAS REGIONAIS (Seresta, Choro, Forró)
      // ────────────────────────────────────────────────────────────────────────
      case 'seven_string_baixaria': {
        const u = voicing.upperMidi;
        const mainChordNotes = u.slice(0, 3);

        // Tempo 1: Baixo fundamental (Clave de Fá)
        resultNotes.push({
          midi: voicing.bassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 1.0,
          measure,
          fingerLeftHand: 5,
          noteName: octaveConfigStore.midiToNoteName(voicing.bassMidi, 'C3'),
          chordName,
        });

        // Contratempos de Xote/Seresta na mão direita (Clave de Sol)
        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 1.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 2.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });

        // Se estiver no final da frase ou a cada 2 compassos: insere a lendária baixaria de 7 cordas!
        if (measure % 2 === 0) {
          // Baixaria diatônica/cromática descendo até o próximo acorde
          const run = voicing.baixariaNotes;
          resultNotes.push({
            midi: run[0] || voicing.bassMidi,
            clef: 'bass',
            duration: 0.5,
            beat: 3.0,
            measure,
            fingerLeftHand: 4,
            noteName: octaveConfigStore.midiToNoteName(run[0] || voicing.bassMidi, 'C3'),
          });
          resultNotes.push({
            midi: run[1] || (voicing.bassMidi - 2),
            clef: 'bass',
            duration: 0.5,
            beat: 3.5,
            measure,
            fingerLeftHand: 3,
            noteName: octaveConfigStore.midiToNoteName(run[1] || (voicing.bassMidi - 2), 'C3'),
          });
          resultNotes.push({
            midi: run[2] || (voicing.bassMidi - 4),
            clef: 'bass',
            duration: 0.5,
            beat: 4.0,
            measure,
            fingerLeftHand: 2,
            noteName: octaveConfigStore.midiToNoteName(run[2] || (voicing.bassMidi - 4), 'C3'),
          });
          resultNotes.push({
            midi: nextVoicing.bassMidi,
            clef: 'bass',
            duration: 0.5,
            beat: 4.5,
            measure,
            fingerLeftHand: 1,
            noteName: octaveConfigStore.midiToNoteName(nextVoicing.bassMidi, 'C3'),
          });
        } else {
          // Compasso ímpar: Quinta no tempo 3 e contratempos
          resultNotes.push({
            midi: voicing.alternateBassMidi,
            clef: 'bass',
            duration: 1.0,
            beat: 3.0,
            measure,
            fingerLeftHand: 1,
            noteName: octaveConfigStore.midiToNoteName(voicing.alternateBassMidi, 'C3'),
          });
          mainChordNotes.forEach((m, fIdx) => {
            resultNotes.push({
              midi: m,
              clef: 'treble',
              duration: 0.5,
              beat: 3.5,
              measure,
              fingerRightHand: fIdx + 2,
              noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
            });
            resultNotes.push({
              midi: m,
              clef: 'treble',
              duration: 0.5,
              beat: 4.5,
              measure,
              fingerRightHand: fIdx + 2,
              noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
            });
          });
        }
        break;
      }

      // ────────────────────────────────────────────────────────────────────────
      // 4. REGGAE SKANK MUTED (Roots Jamaicano)
      // ────────────────────────────────────────────────────────────────────────
      case 'reggae_skank': {
        const u = voicing.upperMidi;
        const mainChordNotes = u.slice(0, 3);

        // Baixo Roots pesado no tempo 1
        resultNotes.push({
          midi: voicing.bassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 1.0,
          measure,
          fingerLeftHand: 5,
          noteName: octaveConfigStore.midiToNoteName(voicing.bassMidi, 'C3'),
          chordName,
        });

        // Contratempo Skank Chop nos tempos 2 e 4 (o corte icônico de Bob Marley)
        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 2.0,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 4.0,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });

        // Baixo melódico no tempo 3
        resultNotes.push({
          midi: voicing.alternateBassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 3.0,
          measure,
          fingerLeftHand: 1,
          noteName: octaveConfigStore.midiToNoteName(voicing.alternateBassMidi, 'C3'),
        });
        break;
      }

      // ────────────────────────────────────────────────────────────────────────
      // 5. BATIDA ACÚSTICA & STRUMMING (Rock Clássico, Pop & Folk)
      // ────────────────────────────────────────────────────────────────────────
      case 'acoustic_strumming':
      default: {
        const u = voicing.upperMidi;
        const mainChordNotes = u.slice(0, 3);

        // Tempo 1: Baixo + Batida descendente cheia
        resultNotes.push({
          midi: voicing.bassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 1.0,
          measure,
          fingerLeftHand: 5,
          noteName: octaveConfigStore.midiToNoteName(voicing.bassMidi, 'C3'),
          chordName,
        });

        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 1.0,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
          // Batida ascendente no tempo 2.0 e 2.5
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 2.0,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 2.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });

        // Tempo 3: Baixo alternado
        resultNotes.push({
          midi: voicing.alternateBassMidi,
          clef: 'bass',
          duration: 1.0,
          beat: 3.0,
          measure,
          fingerLeftHand: 1,
          noteName: octaveConfigStore.midiToNoteName(voicing.alternateBassMidi, 'C3'),
        });

        // Batidas no tempo 3.5 e 4.5
        mainChordNotes.forEach((m, fIdx) => {
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 3.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
          resultNotes.push({
            midi: m,
            clef: 'treble',
            duration: 0.5,
            beat: 4.5,
            measure,
            fingerRightHand: fIdx + 2,
            noteName: octaveConfigStore.midiToNoteName(m, 'C3'),
          });
        });
        break;
      }
    }
  });

  return resultNotes;
}
