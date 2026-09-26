/**
 * phrasingEngine.ts
 *
 * Motor determinístico do Editor de Fraseados:
 * - Algoritmo Text-to-Melody (conversão de sílabas/letras em melodias estruturadas)
 * - Detecção automática de solfejo ("dó ré mi" / "C D E")
 * - Transposição tonal instantânea em 12 tons
 * - Cálculo de dedilhado ergonômico pianístico (1 a 5)
 */

import type { PhrasingNote, TextToMelodyOptions } from './phrasingTypes';
import { getNoteInfo } from './musicTheory';
import { octaveConfigStore } from './octaveConfigStore';

const SOLFEGE_MAP: Record<string, number> = {
  // Solfejo em Português
  'do': 0, 'dó': 0,
  'do#': 1, 'dó#': 1, 'reb': 1, 'réb': 1,
  're': 2, 'ré': 2,
  're#': 3, 'ré#': 3, 'mib': 3,
  'mi': 4,
  'fa': 5, 'fá': 5,
  'fa#': 6, 'fá#': 6, 'solb': 6,
  'sol': 7,
  'sol#': 8, 'lab': 8, 'láb': 8,
  'la': 9, 'lá': 9,
  'la#': 10, 'lá#': 10, 'sib': 10,
  'si': 11, 'ti': 11,
  // Cifras em Letras
  'c': 0, 'c#': 1, 'db': 1,
  'd': 2, 'd#': 3, 'eb': 3,
  'e': 4,
  'f': 5, 'f#': 6, 'gb': 6,
  'g': 7, 'g#': 8, 'ab': 8,
  'a': 9, 'a#': 10, 'bb': 10,
  'b': 11,
};

// Escalas para geração melódica de texto lírico
const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  pentatonic: [0, 2, 4, 7, 9, 12, 14],
  blues: [0, 3, 5, 6, 7, 10, 12],
  bossa: [0, 2, 4, 6, 7, 9, 11, 12],
};

/**
 * Divide texto em sílabas fonéticas aproximadas para língua portuguesa/espanhola/inglesa.
 */
export function syllabifyText(text: string): string[] {
  const clean = text.trim();
  if (!clean) return [];

  // Se o usuário usou hífens explícitos (ex: "Pa-ra-béns pra vo-cê")
  if (clean.includes('-')) {
    return clean
      .split(/[\s-]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Divide por palavras
  const words = clean.split(/\s+/);
  const syllables: string[] = [];

  for (const word of words) {
    const w = word.replace(/[.,!?;:()]/g, '');
    if (!w) continue;

    // Regra heurística de separação silábica aproximada
    const parts = w.match(/[^aeiouáéíóúâêîôûãõày]*[aeiouáéíóúâêîôûãõày]+(?:[^aeiouáéíóúâêîôûãõày](?=[^aeiouáéíóúâêîôûãõày]|$))?/gi);
    if (parts && parts.length > 0) {
      syllables.push(...parts);
    } else {
      syllables.push(w);
    }
  }

  return syllables.length > 0 ? syllables : [clean];
}

/**
 * Verifica se uma palavra é um nome de nota ou solfejo
 */
export function parseSolfegeToken(token: string): { pitchOffset: number; octaveShift: number } | null {
  const clean = token.toLowerCase().replace(/[^a-záéíóú#0-9]/g, '');
  if (!clean) return null;

  // Verifica se tem número de oitava (ex: C4, Mi3, Sol4)
  const match = clean.match(/^([a-záéíóú#]+)(\d)?$/);
  if (!match) return null;

  const baseName = match[1];
  const octaveNum = match[2] ? parseInt(match[2], 10) : null;

  if (baseName in SOLFEGE_MAP) {
    const pitchOffset = SOLFEGE_MAP[baseName];
    // Se tiver oitava explícita
    const octaveShift = octaveNum !== null ? (octaveNum - 4) * 12 : 0;
    return { pitchOffset, octaveShift };
  }

  return null;
}

/**
 * Converte texto livre ou solfejo em sequência melódica de PhrasingNote[]
 */
export function convertTextToMelody(text: string, options: TextToMelodyOptions = {}): PhrasingNote[] {
  const {
    rootMidi = 60, // C4 (MIDI 60)
    scaleType = 'pentatonic',
    defaultDuration = 0.5, // Colcheia (meio tempo)
  } = options;

  const syllables = syllabifyText(text);
  if (syllables.length === 0) return [];

  // 1. Testa se todas ou maioria das sílabas são solfejo direto (ex: "Do re mi fa sol la si")
  let solfegeCount = 0;
  const solfegeParsed = syllables.map(s => {
    const parsed = parseSolfegeToken(s);
    if (parsed) solfegeCount++;
    return parsed;
  });

  const isPureSolfege = solfegeCount >= Math.ceil(syllables.length * 0.6);

  const notes: PhrasingNote[] = [];
  const scale = SCALE_INTERVALS[scaleType] || SCALE_INTERVALS.pentatonic;

  // Contorno melódico lírico natural: sobe no meio da frase e descansa na tônica no final
  const melodicContourIndices = [0, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 1, 0];

  let currentBeat = 0;

  for (let i = 0; i < syllables.length; i++) {
    const syl = syllables[i];
    let midi = rootMidi;

    if (isPureSolfege && solfegeParsed[i]) {
      // Usa o tom exato do solfejo
      const parsed = solfegeParsed[i]!;
      midi = rootMidi + parsed.pitchOffset + parsed.octaveShift;
    } else {
      // Geração melódica cantável adaptada à métrica lírica
      if (i === syllables.length - 1) {
        // Última sílaba: repouso cadencial na tônica (0) ou oitava
        midi = rootMidi + scale[0];
      } else {
        const contourIdx = melodicContourIndices[i % melodicContourIndices.length];
        const scaleStep = scale[contourIdx % scale.length];
        midi = rootMidi + scaleStep;
      }
    }

    // Ajuste de duração: última sílaba de uma palavra longa ou da frase dura o dobro
    const isPhraseEnd = i === syllables.length - 1;
    const duration = isPhraseEnd ? Math.max(1, defaultDuration * 2) : defaultDuration;

    const info = getNoteInfo(midi, false, octaveConfigStore.getStandard());

    notes.push({
      id: `pnote-${i}-${Date.now()}`,
      midi,
      noteName: info.fullName,
      duration,
      syllable: syl,
      beat: currentBeat,
      articulation: 'normal',
    });

    currentBeat += duration;
  }

  // Calcula dedilhado ergonômico automático
  const fingerings = calculateErgonomicFingering(notes);
  notes.forEach((n, idx) => {
    n.fingering = fingerings[idx];
  });

  return notes;
}

/**
 * Transpõe uma frase completa em N semitones preservando durações, sílabas e articulações
 */
export function transposePhrase(notes: PhrasingNote[], semitones: number): PhrasingNote[] {
  if (semitones === 0) return notes;

  return notes.map(n => {
    const newMidi = Math.max(21, Math.min(108, n.midi + semitones));
    const info = getNoteInfo(newMidi, false, octaveConfigStore.getStandard());
    return {
      ...n,
      midi: newMidi,
      noteName: info.fullName,
    };
  });
}

/**
 * Calcula dedilhado ergonômico natural de piano (1=Polegar a 5=Mínimo)
 * baseado na direção e intervalos da melodia.
 */
export function calculateErgonomicFingering(notes: PhrasingNote[]): number[] {
  if (notes.length === 0) return [];
  if (notes.length === 1) return [1];

  const fingerings: number[] = [1];
  let currentFinger = 1;

  for (let i = 1; i < notes.length; i++) {
    const prev = notes[i - 1].midi;
    const curr = notes[i].midi;
    const diff = curr - prev;

    if (diff === 0) {
      // Mesma nota: mantém o mesmo dedo
      fingerings.push(currentFinger);
    } else if (diff > 0) {
      // Subindo
      if (diff <= 2) {
        currentFinger = Math.min(5, currentFinger + 1);
      } else if (diff <= 4) {
        currentFinger = Math.min(5, currentFinger + 2);
      } else {
        // Salto maior: recomeça ou usa 5
        currentFinger = currentFinger <= 2 ? 5 : 1;
      }
      fingerings.push(currentFinger);
    } else {
      // Descendo
      if (diff >= -2) {
        currentFinger = Math.max(1, currentFinger - 1);
      } else if (diff >= -4) {
        currentFinger = Math.max(1, currentFinger - 2);
      } else {
        currentFinger = currentFinger >= 4 ? 1 : 5;
      }
      fingerings.push(currentFinger);
    }
  }

  return fingerings;
}
