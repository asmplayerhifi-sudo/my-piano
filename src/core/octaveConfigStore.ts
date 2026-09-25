/**
 * octaveConfigStore.ts
 *
 * Gerenciador reativo centralizado do padrão de nomenclatura de oitavas:
 * - C3 (Brasil / Yamaha / Roland): Dó Central = C3 (MIDI 60), A440 = A3 (MIDI 69)
 * - C4 (Internacional / Scientific Pitch Notation - SPN): Dó Central = C4 (MIDI 60), A440 = A4 (MIDI 69)
 *
 * Regra Soberana:
 * MIDI (60) e Frequência em Hertz (~261.63 Hz) permanecem como referência técnica matemática
 * imutável. Somente a nomenclatura e os rótulos de exibição das oitavas mudam conforme a escolha do usuário.
 */

import { useSyncExternalStore } from 'react';

export type OctaveStandard = 'C3' | 'C4';

const STORAGE_KEY = 'harmonia_octave_standard';

const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const PT_BASE_NAMES: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó♯', 'Db': 'Ré♭',
  'D': 'Ré', 'D#': 'Ré♯', 'Eb': 'Mi♭',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá♯', 'Gb': 'Sol♭',
  'G': 'Sol', 'G#': 'Sol♯', 'Ab': 'Lá♭',
  'A': 'Lá', 'A#': 'Lá♯', 'Bb': 'Si♭',
  'B': 'Si',
};

type Listener = () => void;

class OctaveConfigStore {
  private standard: OctaveStandard = 'C3';
  private listeners = new Set<Listener>();

  constructor() {
    this.standard = this.loadFromStorage();
  }

  private loadFromStorage(): OctaveStandard {
    if (typeof window === 'undefined') return 'C3';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'C3' || saved === 'C4') {
        return saved;
      }
    } catch (e) {
      console.warn('Erro ao carregar padrão de oitava do localStorage:', e);
    }
    return 'C3'; // Padrão inicial Brasil / Yamaha
  }

  private saveToStorage(val: OctaveStandard) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, val);
    } catch (e) {
      console.warn('Erro ao salvar padrão de oitava no localStorage:', e);
    }
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // ── API Pública ──────────────────────────────────────────────────────────

  public getStandard = (): OctaveStandard => {
    return this.standard;
  };

  public setStandard = (standard: OctaveStandard): void => {
    if (this.standard === standard) return;
    this.standard = standard;
    this.saveToStorage(standard);
    this.notify();
  };

  public toggleStandard = (): OctaveStandard => {
    const next: OctaveStandard = this.standard === 'C3' ? 'C4' : 'C3';
    this.setStandard(next);
    return next;
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): OctaveStandard => {
    return this.standard;
  };

  // ── Métodos Utilitários de Nomenclatura e Cálculos ─────────────────────────

  /**
   * Retorna o número da oitava do Dó Central:
   * C3 -> 3
   * C4 -> 4
   */
  public getMiddleCOctave(standard: OctaveStandard = this.standard): number {
    return standard === 'C4' ? 4 : 3;
  }

  /**
   * Deslocamento matemático para conversão a partir de Math.floor(midi / 12):
   * C3 -> -2 (ex: MIDI 60 / 12 = 5; 5 - 2 = 3)
   * C4 -> -1 (ex: MIDI 60 / 12 = 5; 5 - 1 = 4)
   */
  public getOctaveOffset(standard: OctaveStandard = this.standard): number {
    return standard === 'C4' ? -1 : -2;
  }

  /**
   * Delta de exibição em relação ao padrão Brasil (C3):
   * C3 -> 0
   * C4 -> +1
   */
  public getDisplayOctaveDelta(standard: OctaveStandard = this.standard): number {
    return standard === 'C4' ? 1 : 0;
  }

  /**
   * Converte número de nota MIDI para o número da oitava correspondente ao padrão
   */
  public midiToOctave(midi: number, standard: OctaveStandard = this.standard): number {
    return Math.floor(midi / 12) + this.getOctaveOffset(standard);
  }

  /**
   * Converte número MIDI para nome da nota com oitava (ex: MIDI 60 -> 'C3' ou 'C4').
   * Suporta chamar como midiToNoteName(60, 'C4') ou midiToNoteName(60, false, 'C4').
   */
  public midiToNoteName(
    midi: number,
    preferFlatOrStandard: boolean | OctaveStandard = false,
    standardOpt?: OctaveStandard
  ): string {
    const preferFlat = typeof preferFlatOrStandard === 'boolean' ? preferFlatOrStandard : false;
    const standard = typeof preferFlatOrStandard === 'string'
      ? preferFlatOrStandard
      : (standardOpt ?? this.standard);
    const noteIndex = ((midi % 12) + 12) % 12;
    const name = preferFlat ? CHROMATIC_FLAT[noteIndex] : CHROMATIC_SHARP[noteIndex];
    const octave = this.midiToOctave(midi, standard);
    return `${name}${octave}`;
  }

  /**
   * Converte número MIDI para nome em português com oitava (ex: MIDI 60 -> 'Dó 3' ou 'Dó 4').
   * Suporta chamar como midiToPtName(60, 'C4') ou midiToPtName(60, false, 'C4').
   */
  public midiToPtName(
    midi: number,
    preferFlatOrStandard: boolean | OctaveStandard = false,
    standardOpt?: OctaveStandard
  ): string {
    const preferFlat = typeof preferFlatOrStandard === 'boolean' ? preferFlatOrStandard : false;
    const standard = typeof preferFlatOrStandard === 'string'
      ? preferFlatOrStandard
      : (standardOpt ?? this.standard);
    const noteIndex = ((midi % 12) + 12) % 12;
    const name = preferFlat ? CHROMATIC_FLAT[noteIndex] : CHROMATIC_SHARP[noteIndex];
    const ptBase = PT_BASE_NAMES[name] || name;
    const octave = this.midiToOctave(midi, standard);
    return `${ptBase} ${octave}`;
  }

  /**
   * Converte uma string de nota com oitava (ex: 'C3', 'E3', 'G3') de um padrão para outro.
   * Suporta:
   * - convertNoteOctave('C3', 'C3', 'C4') -> 'C4' (de C3 para C4)
   * - convertNoteOctave('C3', 'C4') -> 'C4' (considera source padrão 'C3')
   */
  public convertNoteOctave(
    noteWithOctave: string,
    fromOrToStandard: OctaveStandard = 'C3',
    toStandardOpt?: OctaveStandard
  ): string {
    let source: OctaveStandard;
    let target: OctaveStandard;
    if (toStandardOpt !== undefined) {
      source = fromOrToStandard;
      target = toStandardOpt;
    } else {
      source = 'C3';
      target = fromOrToStandard;
    }

    if (source === target) return noteWithOctave;
    const delta = (target === 'C4' && source === 'C3') ? 1 : (target === 'C3' && source === 'C4') ? -1 : 0;
    return noteWithOctave.replace(/^([A-G][#b♭♯]?)(-?\d+)$/i, (_, letter, oct) => {
      const newOct = parseInt(oct, 10) + delta;
      return `${letter}${newOct}`;
    });
  }

  /**
   * Formata referências textuais a oitavas em textos didáticos e legendas:
   * Por padrão os textos do banco de dados foram redigidos com referência C3 (Brasil).
   * Se o padrão selecionado for C4, este método ajusta consistentemente menções como:
   * - "Dó Central (C3)" -> "Dó Central (C4)"
   * - "(C3)" -> "(C4)"
   * - "C3 a G3" -> "C4 a G4"
   * - "C3–G3" -> "C4–G4"
   * - "Fá2, Dó Central (C3) e Sol3" -> "Fá3, Dó Central (C4) e Sol4"
   * - "A3 a 440 Hz" -> "A4 a 440 Hz"
   * - "Mi3 (1ª L)" -> "Mi4 (1ª L)"
   */
  public formatNoteOctavesInText(text: string, standard: OctaveStandard = this.standard): string {
    if (!text || standard === 'C3') return text;

    let result = text;

    // 1. Intervalos de notas como C3–G3 ou C3 a G3
    result = result.replace(/\b([A-G][#b♭♯]?)([0-8])([–—\-])([A-G][#b♭♯]?)([0-8])\b/g, (_, n1, o1, sep, n2, o2) => {
      return `${n1}${parseInt(o1, 10) + 1}${sep}${n2}${parseInt(o2, 10) + 1}`;
    });
    result = result.replace(/\b([A-G][#b♭♯]?)([0-8])\s+a\s+([A-G][#b♭♯]?)([0-8])\b/g, (_, n1, o1, n2, o2) => {
      return `${n1}${parseInt(o1, 10) + 1} a ${n2}${parseInt(o2, 10) + 1}`;
    });

    // 2. Notas em português com oitava: ex: Fá2, Sol3, Mi3, Lá3, Dó3, Si3, Ré4
    result = result.replace(/\b(Dó|Ré|Mi|Fá|Sol|Lá|Si)([#b♭♯]?)([0-8])\b/g, (_, pt, acc, oct) => {
      return `${pt}${acc}${parseInt(oct, 10) + 1}`;
    });

    // 3. Notas em notação anglo-saxônica com oitava: ex: (C3), C3, E3, G3, A3, F2
    // Evita alterar dedos (D1..D5 com dois pontos ex: "D1: Polegar")
    result = result.replace(/\b([A-G][#b♭♯]?)([0-8])\b(?!\s*:\s*(?:Polegar|Indicador|Médio|Anelar|Mínimo))/g, (_, n, oct) => {
      return `${n}${parseInt(oct, 10) + 1}`;
    });

    return result;
  }
}

export const octaveConfigStore = new OctaveConfigStore();

/**
 * Hook React para obter e reagir ao padrão de oitava ativo ('C3' ou 'C4')
 */
export function useOctaveStandard(): OctaveStandard {
  return useSyncExternalStore(octaveConfigStore.subscribe, octaveConfigStore.getSnapshot);
}
