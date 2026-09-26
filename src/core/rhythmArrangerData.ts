// ─────────────────────────────────────────────────────────────────────────────
// Dados de Arranjos e Ritmos Profissionais (v2.0) — Padrão Workstation PSR/Pa
// ─────────────────────────────────────────────────────────────────────────────

import type { DrumKitId } from './drumEngine';

export type SectionId =
  | 'intro'
  | 'mainA'
  | 'fillAA'
  | 'mainB'
  | 'fillBB'
  | 'mainC'
  | 'mainD'
  | 'ending';

export interface DrumStep {
  /** 16 passos booleanos (1 compasso 4/4 em semicolcheias ou 12 em 3/4) */
  steps: boolean[];
  /** Velocidade por passo (0–127) */
  velocity?: number[];
}

export interface DrumPattern {
  kick: DrumStep;
  snare: DrumStep;
  hihatClosed: DrumStep;
  hihatOpen: DrumStep;
  clap: DrumStep;
  tomHigh: DrumStep;
  tomMid: DrumStep;
  tomFloor: DrumStep;
  rimshot: DrumStep;
  cowbell: DrumStep;
  triangle: DrumStep;
  agogo: DrumStep;
  shaker: DrumStep;
  tambourine: DrumStep;
}

export interface BassStepNote {
  step: number;        // 0..15
  semitones: number;   // 0 = Tônica, 7 = 5ª, 4/3 = 3ª, 12 = Oitava
  durationSteps: number;
  velocity?: number;
}

export interface ChordStepHit {
  step: number;        // 0..15
  durationSteps: number;
  velocity?: number;
}

export interface ArrangementSection {
  id: SectionId;
  label: string;
  shortLabel: string;
  pattern: DrumPattern;
  tempoMultiplier: number;
  bars: number;
  bassPattern?: BassStepNote[];
  chordPattern?: ChordStepHit[];
}

export interface RhythmStyle {
  id: string;
  name: string;             // Nome do Groove / Estilo (ex: "70s Piano Rock")
  referenceArtist?: string; // Artista de referência (ex: "Elton John")
  referenceSong?: string;   // Música de referência (ex: "Crocodile Rock")
  genre: string;            // Gênero musical rígido (ex: "Rock", "Forró", "Piseiro")
  category: string;         // Compatibilidade legada com genre
  bpm: number;
  timeSignature: '4/4' | '3/4' | '6/8';
  description: string;
  recommendedKit: DrumKitId;
  sections: Record<SectionId, ArrangementSection>;
}

// ─── Helpers Construtores ───────────────────────────────────────────────────

function emptyStep(): DrumStep {
  return { steps: Array(16).fill(false), velocity: Array(16).fill(80) };
}

function emptyPattern(): DrumPattern {
  return {
    kick: emptyStep(),
    snare: emptyStep(),
    hihatClosed: emptyStep(),
    hihatOpen: emptyStep(),
    clap: emptyStep(),
    tomHigh: emptyStep(),
    tomMid: emptyStep(),
    tomFloor: emptyStep(),
    rimshot: emptyStep(),
    cowbell: emptyStep(),
    triangle: emptyStep(),
    agogo: emptyStep(),
    shaker: emptyStep(),
    tambourine: emptyStep(),
  };
}

export function steps(...positions: number[]): DrumStep {
  const s: boolean[] = Array(16).fill(false);
  const v: number[] = Array(16).fill(85);
  positions.forEach(p => {
    if (p >= 0 && p < 16) {
      s[p] = true;
      v[p] = 90;
    }
  });
  return { steps: s, velocity: v };
}

function stepsVel(data: Array<[number, number]>): DrumStep {
  const s: boolean[] = Array(16).fill(false);
  const v: number[] = Array(16).fill(70);
  data.forEach(([p, vel]) => {
    if (p >= 0 && p < 16) {
      s[p] = true;
      v[p] = vel;
    }
  });
  return { steps: s, velocity: v };
}

function makeSection(
  id: SectionId,
  label: string,
  shortLabel: string,
  pattern: Partial<DrumPattern>,
  bars = 2,
  bassPattern?: BassStepNote[],
  chordPattern?: ChordStepHit[],
  tempoMultiplier = 1.0,
): ArrangementSection {
  return {
    id,
    label,
    shortLabel,
    pattern: { ...emptyPattern(), ...pattern },
    tempoMultiplier,
    bars,
    bassPattern,
    chordPattern,
  };
}

// ─── Padrões Rítmicos Autênticos com Evolução Progressiva ─────────────────────

// FORRÓ TRADICIONAL & BAIÃO & XOTE
const P_FORRO = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [6, 75], [8, 110], [14, 75]]),
    rimshot: stepsVel([[4, 100], [12, 105]]),
    triangle: stepsVel([[0, 70], [2, 95], [4, 70], [6, 95], [8, 70], [10, 95], [12, 70], [14, 95]]),
    hihatClosed: stepsVel([[0, 60], [4, 60], [8, 60], [12, 60]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [8, 110], [12, 100], [14, 105]]),
    snare: stepsVel([[10, 85], [11, 90], [12, 95], [13, 100]]),
    tomMid: stepsVel([[14, 105]]),
    tomFloor: stepsVel([[15, 110]]),
    triangle: stepsVel([[0, 80], [2, 95], [4, 80], [6, 95], [8, 80]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 75], [6, 80], [8, 115], [11, 75], [14, 80]]),
    snare: stepsVel([[4, 100], [12, 105]]),
    rimshot: stepsVel([[2, 70], [4, 95], [10, 70], [12, 95]]),
    triangle: stepsVel([[0, 75], [1, 60], [2, 100], [3, 60], [4, 75], [5, 60], [6, 100], [7, 60], [8, 75], [9, 60], [10, 100], [11, 60], [12, 75], [13, 60], [14, 100], [15, 60]]),
    shaker: stepsVel([[2, 75], [6, 75], [10, 75], [14, 75]]),
    hihatClosed: stepsVel([[0, 80], [4, 80], [8, 80], [12, 80]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [4, 110], [8, 110], [12, 110]]),
    snare: stepsVel([[8, 90], [9, 95], [10, 100], [11, 105], [12, 110], [13, 115], [14, 120]]),
    tomHigh: stepsVel([[14, 105]]),
    tomFloor: stepsVel([[15, 120]]),
    hihatOpen: stepsVel([[15, 110]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [3, 85], [6, 90], [8, 120], [11, 85], [14, 90]]),
    snare: stepsVel([[4, 115], [12, 115]]),
    tambourine: stepsVel([[0, 85], [4, 85], [8, 85], [12, 85]]),
    triangle: stepsVel([[0, 80], [1, 65], [2, 105], [3, 65], [4, 80], [5, 65], [6, 105], [7, 65], [8, 80], [9, 65], [10, 105], [11, 65], [12, 80], [13, 65], [14, 105], [15, 65]]),
    hihatClosed: stepsVel([[0, 90], [2, 70], [4, 90], [6, 70], [8, 90], [10, 70], [12, 90], [14, 70]]),
    hihatOpen: stepsVel([[6, 85], [14, 85]]),
    clap: stepsVel([[4, 90], [12, 90]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [2, 70], [3, 90], [6, 95], [8, 125], [10, 70], [11, 90], [14, 95]]),
    snare: stepsVel([[4, 120], [7, 75], [12, 120], [15, 75]]),
    triangle: stepsVel([[0, 85], [1, 65], [2, 110], [3, 65], [4, 85], [5, 65], [6, 110], [7, 65], [8, 85], [9, 65], [10, 110], [11, 65], [12, 85], [13, 65], [14, 110], [15, 65]]),
    tambourine: stepsVel([[2, 90], [6, 90], [10, 90], [14, 90]]),
    agogo: stepsVel([[0, 95], [3, 85], [8, 95], [11, 85]]),
    hihatOpen: stepsVel([[2, 80], [6, 90], [10, 80], [14, 90]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [8, 115], [12, 110], [14, 110]]),
    snare: stepsVel([[4, 100], [12, 100]]),
    triangle: stepsVel([[0, 90], [2, 100], [4, 90], [6, 100], [8, 90], [10, 100], [12, 90], [14, 100]]),
    hihatOpen: stepsVel([[0, 100]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 120], [8, 120], [12, 125]]),
    snare: stepsVel([[4, 120], [8, 120], [12, 125]]),
    hihatOpen: stepsVel([[12, 120]]),
    tambourine: stepsVel([[0, 110], [4, 110], [8, 110], [12, 120]]),
  }),
};

// PISEIRO / PAREDÃO
const P_PISEIRO = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 120], [8, 125], [12, 120]]),
    clap: stepsVel([[4, 115], [12, 115]]),
    hihatClosed: stepsVel([[0, 80], [2, 95], [4, 80], [6, 95], [8, 80], [10, 95], [12, 80], [14, 95]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 120], [8, 120]]),
    snare: stepsVel([[10, 90], [11, 95], [12, 105], [13, 110], [14, 115], [15, 120]]),
    hihatOpen: stepsVel([[15, 115]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [3, 90], [4, 120], [8, 127], [11, 90], [12, 120]]),
    clap: stepsVel([[4, 120], [12, 120]]),
    rimshot: stepsVel([[2, 75], [6, 75], [10, 75], [14, 75]]),
    hihatClosed: stepsVel([[0, 85], [2, 100], [4, 85], [6, 100], [8, 85], [10, 100], [12, 85], [14, 100]]),
    hihatOpen: stepsVel([[6, 90], [14, 90]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [4, 120], [8, 120], [11, 100], [12, 110]]),
    snare: stepsVel([[8, 95], [9, 100], [10, 105], [11, 110], [12, 115], [13, 115], [14, 120], [15, 125]]),
    tomMid: stepsVel([[13, 110], [14, 115]]),
    tomFloor: stepsVel([[15, 120]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [2, 80], [4, 125], [6, 85], [8, 127], [10, 80], [12, 125], [14, 85]]),
    clap: stepsVel([[4, 125], [6, 85], [12, 125], [14, 85]]),
    snare: stepsVel([[4, 100], [12, 100]]),
    hihatClosed: stepsVel([[0, 90], [2, 105], [4, 90], [6, 105], [8, 90], [10, 105], [12, 90], [14, 105]]),
    hihatOpen: stepsVel([[2, 90], [6, 95], [10, 90], [14, 95]]),
    shaker: stepsVel([[0, 70], [2, 80], [4, 70], [6, 80], [8, 70], [10, 80], [12, 70], [14, 80]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [3, 95], [4, 125], [7, 85], [8, 127], [11, 95], [12, 125], [15, 85]]),
    clap: stepsVel([[4, 125], [12, 125]]),
    snare: stepsVel([[4, 115], [12, 115]]),
    rimshot: stepsVel([[2, 80], [6, 90], [10, 80], [14, 90]]),
    tomHigh: stepsVel([[14, 95]]),
    tomMid: stepsVel([[15, 105]]),
    hihatOpen: stepsVel([[2, 95], [6, 100], [10, 95], [14, 100]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 120], [8, 120], [12, 125]]),
    hihatOpen: stepsVel([[0, 110], [8, 100]]),
    clap: stepsVel([[4, 110], [12, 115]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [4, 125], [8, 125], [12, 127]]),
    clap: stepsVel([[4, 125], [8, 120], [12, 127]]),
    snare: stepsVel([[12, 127]]),
    hihatOpen: stepsVel([[12, 125]]),
  }),
};

// BAIÃO CLÁSSICO
const P_BAIAO = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 80], [8, 115], [11, 80]]),
    snare: stepsVel([[5, 100], [13, 105]]),
    triangle: stepsVel([[0, 75], [2, 100], [4, 75], [6, 100], [8, 75], [10, 100], [12, 75], [14, 100]]),
    rimshot: stepsVel([[3, 80], [7, 85], [11, 80], [15, 85]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 85], [8, 115]]),
    snare: stepsVel([[8, 90], [10, 95], [12, 105], [14, 110]]),
    tomMid: stepsVel([[13, 95], [14, 105]]),
    tomFloor: stepsVel([[15, 115]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [3, 90], [6, 75], [8, 120], [11, 90], [14, 75]]),
    snare: stepsVel([[5, 110], [13, 110]]),
    triangle: stepsVel([[0, 80], [2, 105], [4, 80], [6, 105], [8, 80], [10, 105], [12, 80], [14, 105]]),
    rimshot: stepsVel([[3, 90], [7, 95], [11, 90], [15, 95]]),
    tambourine: stepsVel([[0, 80], [4, 85], [8, 80], [12, 85]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 115], [8, 115]]),
    snare: stepsVel([[8, 95], [9, 100], [10, 105], [11, 110], [12, 115], [13, 120], [14, 125]]),
    hihatOpen: stepsVel([[15, 120]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [3, 95], [6, 85], [8, 125], [11, 95], [14, 85]]),
    snare: stepsVel([[4, 115], [5, 105], [12, 115], [13, 105]]),
    triangle: stepsVel([[0, 85], [2, 110], [4, 85], [6, 110], [8, 85], [10, 110], [12, 85], [14, 110]]),
    tambourine: stepsVel([[2, 90], [6, 95], [10, 90], [14, 95]]),
    agogo: stepsVel([[0, 95], [3, 85], [8, 95], [11, 85]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [2, 80], [3, 100], [6, 90], [8, 127], [10, 80], [11, 100], [14, 90]]),
    snare: stepsVel([[4, 120], [5, 110], [12, 120], [13, 110]]),
    triangle: stepsVel([[0, 90], [2, 115], [4, 90], [6, 115], [8, 90], [10, 115], [12, 90], [14, 115]]),
    tambourine: stepsVel([[0, 90], [4, 90], [8, 90], [12, 90]]),
    hihatOpen: stepsVel([[2, 85], [6, 95], [10, 85], [14, 95]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [8, 115], [11, 90]]),
    triangle: stepsVel([[0, 90], [2, 105], [4, 90], [6, 105], [8, 90], [10, 105], [12, 90], [14, 105]]),
    snare: stepsVel([[12, 110]]),
    hihatOpen: stepsVel([[0, 110]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [4, 120], [8, 120], [12, 127]]),
    snare: stepsVel([[4, 120], [8, 120], [12, 127]]),
    hihatOpen: stepsVel([[12, 125]]),
  }),
};

// XOTE NORDESTINO
const P_XOTE = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 110], [8, 105]]),
    snare: stepsVel([[4, 95], [12, 95]]),
    hihatClosed: stepsVel([[0, 70], [2, 85], [4, 70], [6, 85], [8, 70], [10, 85], [12, 70], [14, 85]]),
    triangle: stepsVel([[0, 75], [2, 95], [4, 75], [6, 95], [8, 75], [10, 95], [12, 75], [14, 95]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 110], [8, 105]]),
    snare: stepsVel([[10, 80], [11, 85], [12, 95], [13, 100]]),
    tomMid: stepsVel([[14, 90]]),
    tomFloor: stepsVel([[15, 100]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [6, 75], [8, 110], [14, 75]]),
    snare: stepsVel([[4, 100], [12, 100]]),
    rimshot: stepsVel([[2, 70], [6, 75], [10, 70], [14, 75]]),
    triangle: stepsVel([[0, 80], [2, 100], [4, 80], [6, 100], [8, 80], [10, 100], [12, 80], [14, 100]]),
    tambourine: stepsVel([[2, 80], [6, 85], [10, 80], [14, 85]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [6, 80], [8, 110]]),
    snare: stepsVel([[8, 85], [9, 90], [10, 95], [11, 100], [12, 105], [13, 110], [14, 115]]),
    hihatOpen: stepsVel([[15, 105]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 75], [6, 80], [8, 115], [11, 75], [14, 80]]),
    snare: stepsVel([[4, 105], [12, 105]]),
    triangle: stepsVel([[0, 85], [2, 105], [4, 85], [6, 105], [8, 85], [10, 105], [12, 85], [14, 105]]),
    tambourine: stepsVel([[0, 75], [4, 80], [8, 75], [12, 80]]),
    hihatOpen: stepsVel([[6, 85], [14, 85]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [3, 85], [6, 85], [8, 120], [11, 85], [14, 85]]),
    snare: stepsVel([[4, 110], [12, 110]]),
    triangle: stepsVel([[0, 90], [2, 110], [4, 90], [6, 110], [8, 90], [10, 110], [12, 90], [14, 110]]),
    tambourine: stepsVel([[2, 90], [6, 95], [10, 90], [14, 95]]),
    agogo: stepsVel([[0, 85], [4, 85], [8, 85], [12, 85]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [8, 110]]),
    triangle: stepsVel([[0, 85], [2, 100], [4, 85], [6, 100], [8, 85], [10, 100], [12, 85], [14, 100]]),
    snare: stepsVel([[12, 100]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [4, 115], [8, 115], [12, 120]]),
    snare: stepsVel([[4, 115], [8, 115], [12, 120]]),
    hihatOpen: stepsVel([[12, 115]]),
  }),
};

// SERESTA / ARROCHA / BREGA
const P_SERESTA = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [3, 75], [8, 110], [11, 75]]),
    snare: stepsVel([[4, 105], [12, 105]]),
    hihatClosed: stepsVel([[0, 80], [2, 70], [4, 80], [6, 70], [8, 80], [10, 70], [12, 80], [14, 70]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [8, 110]]),
    snare: stepsVel([[10, 85], [11, 90], [12, 95]]),
    tomMid: stepsVel([[13, 95], [14, 100]]),
    tomFloor: stepsVel([[15, 110]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 85], [8, 115], [11, 85]]),
    snare: stepsVel([[4, 110], [12, 110]]),
    rimshot: stepsVel([[4, 85], [12, 85]]),
    tambourine: stepsVel([[2, 80], [6, 85], [10, 80], [14, 85]]),
    hihatClosed: stepsVel([[0, 85], [2, 75], [4, 85], [6, 75], [8, 85], [10, 75], [12, 85], [14, 75]]),
    hihatOpen: stepsVel([[7, 85], [15, 85]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [4, 110], [8, 110]]),
    snare: stepsVel([[8, 90], [9, 95], [10, 100], [11, 105], [12, 110]]),
    tomHigh: stepsVel([[13, 105]]),
    tomMid: stepsVel([[14, 110]]),
    tomFloor: stepsVel([[15, 120]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [3, 90], [6, 75], [8, 120], [11, 90], [14, 75]]),
    snare: stepsVel([[4, 115], [12, 115]]),
    clap: stepsVel([[4, 90], [12, 90]]),
    tambourine: stepsVel([[0, 85], [4, 85], [8, 85], [12, 85]]),
    hihatOpen: stepsVel([[2, 80], [6, 90], [10, 80], [14, 90]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [3, 95], [6, 85], [8, 125], [11, 95], [14, 85]]),
    snare: stepsVel([[4, 120], [12, 120]]),
    tomFloor: stepsVel([[7, 80], [15, 85]]),
    tambourine: stepsVel([[2, 90], [6, 95], [10, 90], [14, 95]]),
    hihatOpen: stepsVel([[2, 90], [6, 95], [10, 90], [14, 95]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [8, 115]]),
    snare: stepsVel([[4, 105], [12, 105]]),
    hihatOpen: stepsVel([[0, 110]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 120], [8, 120], [12, 125]]),
    snare: stepsVel([[4, 120], [8, 120], [12, 125]]),
    hihatOpen: stepsVel([[12, 120]]),
  }),
};

// ROCK & BOOGIE WOOGIE
const P_ROCK = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [8, 115]]),
    snare: stepsVel([[4, 110], [12, 110]]),
    hihatClosed: stepsVel([[0, 85], [2, 70], [4, 85], [6, 70], [8, 85], [10, 70], [12, 85], [14, 70]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [8, 110]]),
    snare: stepsVel([[8, 95], [9, 100], [10, 105], [11, 110]]),
    tomMid: stepsVel([[12, 105], [13, 110]]),
    tomFloor: stepsVel([[14, 115], [15, 120]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [6, 85], [8, 120], [14, 85]]),
    snare: stepsVel([[4, 115], [12, 115]]),
    hihatClosed: stepsVel([[0, 90], [2, 75], [4, 90], [6, 75], [8, 90], [10, 75], [12, 90], [14, 75]]),
    hihatOpen: stepsVel([[6, 85], [14, 85]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [4, 120], [8, 120]]),
    snare: stepsVel([[6, 95], [7, 100], [8, 105], [9, 110], [10, 115], [11, 120], [12, 125]]),
    tomHigh: stepsVel([[13, 115]]),
    tomMid: stepsVel([[14, 120]]),
    tomFloor: stepsVel([[15, 125]]),
    hihatOpen: stepsVel([[15, 120]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [3, 90], [6, 85], [8, 125], [11, 90], [14, 85]]),
    snare: stepsVel([[4, 120], [12, 120]]),
    hihatOpen: stepsVel([[0, 90], [4, 90], [8, 90], [12, 90]]),
    hihatClosed: stepsVel([[2, 80], [6, 80], [10, 80], [14, 80]]),
    cowbell: stepsVel([[0, 90], [4, 90], [8, 90], [12, 90]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [2, 85], [6, 95], [8, 127], [10, 85], [14, 95]]),
    snare: stepsVel([[4, 125], [12, 125]]),
    hihatOpen: stepsVel([[0, 100], [2, 90], [4, 100], [6, 90], [8, 100], [10, 90], [12, 100], [14, 90]]),
    tomFloor: stepsVel([[7, 90], [15, 95]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [8, 120]]),
    snare: stepsVel([[4, 115], [12, 115]]),
    hihatOpen: stepsVel([[0, 115]]),
    cowbell: stepsVel([[0, 90], [4, 90], [8, 90], [12, 90]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [4, 125], [8, 125], [12, 127]]),
    snare: stepsVel([[4, 125], [8, 125], [12, 127]]),
    hihatOpen: stepsVel([[12, 125]]),
  }),
};

// REGGAE ROOTS (ONE DROP)
const P_REGGAE = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[8, 120]]),
    snare: stepsVel([[8, 120]]),
    rimshot: stepsVel([[4, 90], [12, 90]]),
    hihatClosed: stepsVel([[0, 75], [4, 75], [8, 75], [12, 75]]),
    hihatOpen: stepsVel([[2, 85], [6, 85], [10, 85], [14, 85]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[8, 120]]),
    snare: stepsVel([[8, 120], [12, 95], [14, 105]]),
    tomMid: stepsVel([[13, 90]]),
    tomFloor: stepsVel([[15, 110]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[8, 125], [14, 80]]),
    snare: stepsVel([[8, 125]]),
    rimshot: stepsVel([[4, 95], [12, 95]]),
    hihatClosed: stepsVel([[0, 80], [4, 80], [8, 80], [12, 80]]),
    hihatOpen: stepsVel([[2, 90], [6, 95], [10, 90], [14, 95]]),
    shaker: stepsVel([[0, 70], [2, 75], [4, 70], [6, 75], [8, 70], [10, 75], [12, 70], [14, 75]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[8, 125]]),
    snare: stepsVel([[8, 125], [10, 95], [11, 100], [12, 105], [13, 110], [14, 115]]),
    tomHigh: stepsVel([[14, 110]]),
    tomFloor: stepsVel([[15, 120]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 90], [8, 127], [14, 85]]),
    snare: stepsVel([[8, 127]]),
    rimshot: stepsVel([[4, 100], [12, 100]]),
    hihatOpen: stepsVel([[2, 95], [6, 100], [10, 95], [14, 100]]),
    shaker: stepsVel([[0, 75], [2, 80], [4, 75], [6, 80], [8, 75], [10, 80], [12, 75], [14, 80]]),
    cowbell: stepsVel([[4, 85], [12, 85]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 95], [4, 80], [8, 127], [12, 80]]),
    snare: stepsVel([[8, 127], [15, 90]]),
    rimshot: stepsVel([[4, 105], [12, 105]]),
    hihatOpen: stepsVel([[2, 100], [6, 105], [10, 100], [14, 105]]),
    tambourine: stepsVel([[4, 90], [12, 90]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[8, 120]]),
    snare: stepsVel([[8, 120]]),
    hihatOpen: stepsVel([[0, 100], [4, 90]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[8, 125], [12, 120]]),
    snare: stepsVel([[8, 125], [12, 125]]),
    hihatOpen: stepsVel([[12, 125]]),
  }),
};

// GUARÂNIA (3/4 OU 6/8)
const P_GUARANIA = {
  mainA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [6, 100]]),
    snare: stepsVel([[4, 95], [10, 95]]),
    hihatClosed: stepsVel([[0, 75], [2, 85], [4, 75], [6, 85], [8, 75], [10, 85]]),
  }),
  fillA: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115]]),
    snare: stepsVel([[6, 90], [8, 95], [10, 105]]),
    tomMid: stepsVel([[10, 100], [11, 105]]),
  }),
  mainB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [6, 105]]),
    snare: stepsVel([[4, 100], [10, 100]]),
    tambourine: stepsVel([[2, 80], [6, 85], [10, 85]]),
    hihatClosed: stepsVel([[0, 80], [2, 90], [4, 80], [6, 90], [8, 80], [10, 90]]),
  }),
  fillB: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [6, 110]]),
    snare: stepsVel([[4, 95], [6, 100], [8, 105], [10, 115]]),
    tomFloor: stepsVel([[11, 115]]),
  }),
  mainC: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [3, 80], [6, 110], [9, 80]]),
    snare: stepsVel([[4, 110], [10, 110]]),
    tambourine: stepsVel([[0, 85], [4, 85], [8, 85]]),
    hihatOpen: stepsVel([[2, 85], [6, 90], [10, 85]]),
  }),
  mainD: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 127], [3, 85], [6, 115], [9, 85]]),
    snare: stepsVel([[4, 115], [10, 115]]),
    tambourine: stepsVel([[2, 90], [6, 95], [10, 95]]),
    agogo: stepsVel([[0, 90], [6, 90]]),
  }),
  intro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [6, 105]]),
    snare: stepsVel([[4, 100], [10, 100]]),
  }),
  ending: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 125], [6, 120]]),
    snare: stepsVel([[4, 115], [6, 120]]),
    hihatOpen: stepsVel([[6, 120]]),
  }),
};

// ─── Construtor Oficial de Estilos com 8 Seções Completas ────────────────────

function makeFullStyle(
  id: string,
  name: string,
  genre: string,
  bpm: number,
  timeSignature: '4/4' | '3/4' | '6/8',
  description: string,
  patterns: {
    mainA: () => Partial<DrumPattern>;
    fillA: () => Partial<DrumPattern>;
    mainB: () => Partial<DrumPattern>;
    fillB: () => Partial<DrumPattern>;
    mainC: () => Partial<DrumPattern>;
    mainD: () => Partial<DrumPattern>;
    intro: () => Partial<DrumPattern>;
    ending: () => Partial<DrumPattern>;
  },
  recommendedKit: DrumKitId = 'acoustic',
  referenceArtist?: string,
  referenceSong?: string,
): RhythmStyle {
  return {
    id,
    name,
    genre,
    category: genre, // compatibilidade
    bpm,
    timeSignature,
    description,
    recommendedKit,
    referenceArtist,
    referenceSong,
    sections: {
      intro:  makeSection('intro',  'Intro',    'IN',  patterns.intro(), 2),
      mainA:  makeSection('mainA',  'Main A',   'A',   patterns.mainA(), 2),
      fillAA: makeSection('fillAA', 'Fill A',   'FA',  patterns.fillA(), 1),
      mainB:  makeSection('mainB',  'Main B',   'B',   patterns.mainB(), 2),
      fillBB: makeSection('fillBB', 'Fill B',   'FB',  patterns.fillB(), 1),
      mainC:  makeSection('mainC',  'Main C',   'C',   patterns.mainC(), 2),
      mainD:  makeSection('mainD',  'Main D',   'D',   patterns.mainD(), 2),
      ending: makeSection('ending', 'Ending',   'END', patterns.ending(), 2),
    },
  };
}

// ─── Catálogo Central de Ritmos e Estilos (v2.0) ──────────────────────────────

export const RHYTHM_STYLES: RhythmStyle[] = [
  // ── FORRÓ ──────────────────────────────────────────────────────────────────
  makeFullStyle(
    'FORRO_MASTRUZ',
    'Forró Tradicional Mastruz',
    'Forró',
    118,
    '4/4',
    'Zabumba sincopada com grave encorpado, triângulo contínuo em 16ths e caixa marcando os contratempos.',
    P_FORRO,
    'regional',
    'Mastruz com Leite',
    'Brasas do Forró',
  ),
  makeFullStyle(
    'FORRO_ROMANTICO',
    'Forró Romântico Sintetizado',
    'Forró',
    114,
    '4/4',
    'Levada aveludada de teclado com chimbal corrido, caixa aveludada e zabumba suave.',
    P_FORRO,
    'acoustic',
    'Bonde do Brasil',
    'Forró Romântico',
  ),
  makeFullStyle(
    'FORRO_BREGADO',
    'Forró Bregado de Paredão',
    'Forró',
    116,
    '4/4',
    'Pisada forte com clap acentuado e chimbal aberto nos contratempos.',
    P_FORRO,
    'piseiro',
    'Bonde do Forró',
    'Vaquejada Dançante',
  ),
  makeFullStyle(
    'FORRO_DAS_ANTIGAS',
    'Forró das Antigas Acordeon',
    'Forró',
    120,
    '4/4',
    'Forró clássico com levada rápida de triângulo e zabumba marcante para acordeon virtuoso.',
    P_FORRO,
    'regional',
    'Mastruz com Leite',
    'Camisa Suada',
  ),
  makeFullStyle(
    'FORRO_NORDESTINO',
    'Forró Autêntico Nordestino',
    'Forró',
    118,
    '4/4',
    'A legítima cadência nordestina com sanfona, zabumba solta e fraseado rítmico elegante.',
    P_FORRO,
    'regional',
    'Flávio José',
    'Espumas ao Vento',
  ),
  makeFullStyle(
    'FORRO_MODERNO',
    'Forró Moderno de Paredão',
    'Forró',
    128,
    '4/4',
    'Batida moderna de alta densidade para paredões eletrônicos com viradas rápidas.',
    P_FORRO,
    'piseiro',
    'Nattan',
    'Paredão Pegada',
  ),
  makeFullStyle(
    'FORRO_PEGADO',
    'Forró Eletrônico Rápido',
    'Forró',
    132,
    '4/4',
    'Pegada acelerada de forró animado com chimbal duplo e caixa estalada.',
    P_FORRO,
    'piseiro',
    'Forró Pegado',
    'Na Balada',
  ),
  makeFullStyle(
    'ARRASTA_PE_FESTIVO',
    'Arrasta-Pé Festivo de São João',
    'Forró',
    124,
    '4/4',
    'Ritmo galopado de quadrilha junina com zabumba dobrada e pandeiro constante.',
    P_FORRO,
    'regional',
    'Quadrilhas Tradicionais',
    'Festa Junina',
  ),

  // ── PISEIRO ────────────────────────────────────────────────────────────────
  makeFullStyle(
    'PISEIRO_BAROES',
    'Piseiro de Teclado & Kick Seco',
    'Piseiro',
    138,
    '4/4',
    'Kick reto e seco, clap no 2 e 4, sintetizador staccato e chimbal rápido.',
    P_PISEIRO,
    'piseiro',
    'Barões da Pisadinha',
    'Recairei',
  ),
  makeFullStyle(
    'PISEIRO_VAQUEJADA',
    'Piseiro Galopado de Vaquejada',
    'Piseiro',
    142,
    '4/4',
    'Levada galopada de arena com bumbo punchy e caixa de ataque rápido.',
    P_PISEIRO,
    'piseiro',
    'João Gomes',
    'Meu Pedaço de Pecado',
  ),
  makeFullStyle(
    'PISADINHA_PAREDAO',
    'Pisadinha Paredão Bate-Fofo',
    'Piseiro',
    138,
    '4/4',
    'Pressão máxima no kick, viradas secas de caixa e chimbal com abertura rápida.',
    P_PISEIRO,
    'piseiro',
    'Tarcísio do Acordeon',
    'Meia Noite',
  ),

  // ── BAIÃO ──────────────────────────────────────────────────────────────────
  makeFullStyle(
    'BAIAO_GONZAGA',
    'Baião Raiz do Gonzaga',
    'Baião',
    112,
    '4/4',
    'Zabumba sincopada com "tum... tá-tum... tum... tá", triângulo metálico e rimshot de madeira.',
    P_BAIAO,
    'regional',
    'Luiz Gonzaga',
    'Asa Branca',
  ),
  makeFullStyle(
    'BAIAO_PE_SERRA',
    'Baião Pé-de-Serra Tradicional',
    'Baião',
    112,
    '4/4',
    'Levada tradicional pernambucana com pandeiro de couro e zabumba solta.',
    P_BAIAO,
    'regional',
    'Trio Nordestino',
    'Procurando Tu',
  ),
  makeFullStyle(
    'ARRASTA_QUADRILHA',
    'Arrasta-Pé de Quadrilha Junina',
    'Baião',
    118,
    '4/4',
    'Galope animado com acentos de triângulo e agogô nas festividades juninas.',
    P_BAIAO,
    'regional',
    'Dominguinhos',
    'Isso Aqui Tá Bom Demais',
  ),

  // ── XOTE ───────────────────────────────────────────────────────────────────
  makeFullStyle(
    'XOTE_DOMINGUINHOS',
    'Xote Pé-de-Serra Cadenciado',
    'Xote',
    84,
    '4/4',
    'Cadência aveludada com triângulo delicado, bumbo suave e pandeiro flutuante.',
    P_XOTE,
    'regional',
    'Dominguinhos',
    'Eu Só Quero um Xodó',
  ),
  makeFullStyle(
    'XOTE_UNIVERSITARIO',
    'Xote Universitário Acústico',
    'Xote',
    84,
    '4/4',
    'Xote suingado com violão batido, zabumba marcante e chimbal leve.',
    P_XOTE,
    'acoustic',
    'Falamansa',
    'Rindo à Toa',
  ),
  makeFullStyle(
    'XOTE_FLAVIO_JOSE',
    'Xote Clássico Sanfonado',
    'Xote',
    86,
    '4/4',
    'Toque dengoso de Flávio José com ênfase na dinâmica suave da zabumba.',
    P_XOTE,
    'regional',
    'Flávio José',
    'Tareco e Mariola',
  ),

  // ── SERESTA / BREGA ────────────────────────────────────────────────────────
  makeFullStyle(
    'SERESTA_ZEZO',
    'Seresta Show Teclado DX7',
    'Seresta',
    106,
    '4/4',
    'Piano elétrico nos contratempos, baixo aveludado e toms melódicos nas viradas.',
    P_SERESTA,
    'acoustic',
    'Zezo dos Teclados',
    'Diga pra Mim',
  ),
  makeFullStyle(
    'BOLERO_SERESTA',
    'Bolero Seresteiro Apaixonado',
    'Seresta',
    106,
    '4/4',
    'Levada emotiva de bolero com pratos abertos e percussão cadenciada.',
    P_SERESTA,
    'acoustic',
    'Zezo dos Teclados',
    'Decida',
  ),
  makeFullStyle(
    'ARROCHA_ZEZO',
    'Arrocha Seresteiro Marcante',
    'Seresta',
    104,
    '4/4',
    'Arrocha romântico nordestino com caixa presente e bumbo marcado.',
    P_SERESTA,
    'acoustic',
    'Pablo do Arrocha',
    'Porque Homem Não Chora',
  ),
  makeFullStyle(
    'BREGA_REGINALDO',
    'Brega Dramático Orquestrado',
    'Seresta',
    98,
    '4/4',
    'O clássico hino da seresta brasileira com toms dramáticos e caixa aveludada.',
    P_SERESTA,
    'acoustic',
    'Reginaldo Rossi',
    'Garçom',
  ),
  makeFullStyle(
    'SERESTA_BARZINHO',
    'Seresta Noturna de Barzinho',
    'Seresta',
    100,
    '4/4',
    'A levada romântica mais tocada nas noites brasileiras para voz e teclado.',
    P_SERESTA,
    'acoustic',
    'Déo Seresteiro',
    'Boate Azul',
  ),

  // ── ROCK ───────────────────────────────────────────────────────────────────
  makeFullStyle(
    'PIANO_ROCK_70S',
    '70s Piano Rock Boogie',
    'Rock',
    150,
    '4/4',
    'Boogie-woogie acelerado no piano Honky-Tonk com cowbell e bumbo pulsante.',
    P_ROCK,
    'power_rock',
    'Elton John',
    'Crocodile Rock',
  ),
  makeFullStyle(
    'CLASSIC_ROCK_80S',
    'Classic Rock 80s Driving Beat',
    'Rock',
    124,
    '4/4',
    'Rock direto 4/4 com bumbo pesado, caixa firme nos tempos 2 e 4 e pratos abertos.',
    P_ROCK,
    'power_rock',
    'Queen',
    'Radio Ga Ga',
  ),
  makeFullStyle(
    'HARD_ROCK_GROOVE',
    'Hard Rock Arena Heavy Groove',
    'Rock',
    124,
    '4/4',
    'Pegada pesada de arena com caixa cortante e condução aberta de pratos.',
    P_ROCK,
    'power_rock',
    'AC/DC',
    'Back in Black',
  ),
  makeFullStyle(
    'PSYCHEDELIC_ORGAN_ROCK',
    'Psychedelic Organ Rock 60s',
    'Rock',
    126,
    '4/4',
    'Bateria latina/jazz com aro de madeira e condução rápida no chimbal.',
    P_ROCK,
    'acoustic',
    'The Doors',
    'Light My Fire',
  ),
  makeFullStyle(
    'ROADHOUSE_BLUES_SHUFFLE',
    'Roadhouse Blues Shuffle',
    'Rock',
    124,
    '4/4',
    'Shuffle cru de blues com chimbal suingado e acentuação no 2 e 4.',
    P_ROCK,
    'acoustic',
    'The Doors',
    'Roadhouse Blues',
  ),

  // ── REGGAE ─────────────────────────────────────────────────────────────────
  makeFullStyle(
    'ONE_DROP_ROOTS',
    'One Drop Roots Jamaican',
    'Reggae',
    76,
    '4/4',
    'Autêntico One Drop jamaicano: bumbo e aro juntos no 3º tempo, chimbal aberto sincopado.',
    P_REGGAE,
    'tr808',
    'Bob Marley',
    'One Love',
  ),
  makeFullStyle(
    'STEPPERS_REGGAE',
    'Steppers Roots Groove',
    'Reggae',
    76,
    '4/4',
    'Bumbo constante em semínimas com skanks sincopados e shaker fluido.',
    P_REGGAE,
    'tr808',
    'Bob Marley',
    'Exodus',
  ),
  makeFullStyle(
    'REGGAE_MARANHAO',
    'Reggae Dançante Maranhense',
    'Reggae',
    76,
    '4/4',
    'O balanço único do reggae de São Luís do Maranhão com percussão solta.',
    P_REGGAE,
    'acoustic',
    'Tribo de Jah',
    'Reggae na Ilha',
  ),

  // ── SERTANEJO ──────────────────────────────────────────────────────────────
  makeFullStyle(
    'GUARANIA_SERTANEJA',
    'Guarânia Clássica Sertaneja',
    'Sertanejo',
    80,
    '3/4',
    'Compasso ternário com bumbo aveludado, caixa suave e pandeiro cadenciado.',
    P_GUARANIA,
    'acoustic',
    'Milionário & José Rico',
    'Estrada da Vida',
  ),
  makeFullStyle(
    'FORRO_SERTANEJO',
    'Forró Sertanejo Pegado',
    'Sertanejo',
    120,
    '4/4',
    'Balanço sertanejo moderno com pisada firme de bateria e acordeon pulsante.',
    P_FORRO,
    'acoustic',
    'Jorge & Mateus',
    'Pode Chorar',
  ),

  // ── POP ────────────────────────────────────────────────────────────────────
  makeFullStyle(
    'POP_PIANO_BALLAD',
    'Acoustic Piano Pop Ballad',
    'Pop',
    72,
    '4/4',
    'Balada emotiva de piano com bumbo suave, caixa aveludada e pratos crescentes.',
    P_ROCK,
    'acoustic',
    'Elton John',
    'Your Song',
  ),
  makeFullStyle(
    'POP_ROCK_POWER',
    'Pop Rock Power Ballad',
    'Pop',
    95,
    '4/4',
    'Balada com dinâmica progressiva do piano acústico até a entrada explosiva da bateria.',
    P_ROCK,
    'power_rock',
    'Bon Jovi',
    'Always',
  ),

  // ── REGIONAL ───────────────────────────────────────────────────────────────
  makeFullStyle(
    'BANDINHA_BAILE',
    'Bandinha de Baile Tradicional',
    'Regional',
    118,
    '4/4',
    'Ritmo animado de bailão sulista com bumbo reto e cowbell festivo.',
    P_ROCK,
    'acoustic',
    'Os Atuais',
    'Barco do Amor',
  ),
  makeFullStyle(
    'CHAMAME_FRONTEIRA',
    'Chamamé da Fronteira Gaúcha',
    'Regional',
    96,
    '6/8',
    'Balanço 6/8 característico do Rio Grande do Sul e fronteira missioneira.',
    P_GUARANIA,
    'acoustic',
    'Luiz Carlos Borges',
    'Chamamé Gaúcho',
  ),
  makeFullStyle(
    'TOADA_BOI_BUMBA',
    'Toada de Arena Festival Folclórico',
    'Regional',
    112,
    '4/4',
    'Toada amazônica com tambores tribais, chocalho forte e palmas de arena.',
    P_BAIAO,
    'regional',
    'Boi Garantido',
    'Vermelho',
  ),
];

// ─── Gêneros Oficiais Rígidos (Tier 1) ───────────────────────────────────────

export interface GenreCategory {
  id: string;
  label: string;
  color: string;
}

export const RHYTHM_GENRES: GenreCategory[] = [
  { id: 'Todos',     label: 'Todos',     color: 'slate' },
  { id: 'Forró',     label: 'Forró',     color: 'orange' },
  { id: 'Piseiro',   label: 'Piseiro',   color: 'red' },
  { id: 'Baião',     label: 'Baião',     color: 'yellow' },
  { id: 'Xote',      label: 'Xote',      color: 'lime' },
  { id: 'Seresta',   label: 'Seresta',   color: 'pink' },
  { id: 'Sertanejo', label: 'Sertanejo', color: 'amber' },
  { id: 'Rock',      label: 'Rock',      color: 'red' },
  { id: 'Reggae',    label: 'Reggae',    color: 'emerald' },
  { id: 'Pop',       label: 'Pop',       color: 'cyan' },
  { id: 'Regional',  label: 'Regional',  color: 'violet' },
];

// Compatibilidade legada com componentes que importavam RHYTHM_CATEGORIES
export const RHYTHM_CATEGORIES = RHYTHM_GENRES.filter(g => g.id !== 'Todos');

// ─── Definição de Pads de Bateria em Padrão Controlador de Estúdio ─────────

export interface DrumPadDef {
  key: keyof DrumPattern;
  label: string;
  shortLabel: string;
  shortcut: string;
  group: 'primary' | 'cymbals' | 'percussion';
  color: string;
  midi: number;
}

export const DRUM_PADS: DrumPadDef[] = [
  // Linha 1: Metais e Pratos (Tons Amarelos/Laranjas)
  { key: 'hihatClosed', label: 'Chimbal Fechado', shortLabel: 'HH CLOSED', shortcut: '1', group: 'cymbals',    color: 'yellow', midi: 42 },
  { key: 'hihatOpen',   label: 'Chimbal Aberto',  shortLabel: 'HH OPEN',   shortcut: '2', group: 'cymbals',    color: 'amber',  midi: 46 },
  { key: 'cowbell',     label: 'Cowbell 808',     shortLabel: 'COWBELL',   shortcut: '3', group: 'cymbals',    color: 'orange', midi: 56 },
  { key: 'rimshot',     label: 'Rimshot / Aro',   shortLabel: 'RIMSHOT',   shortcut: '4', group: 'primary',    color: 'rose',   midi: 37 },

  // Linha 2: Ritmo Primário (Tons Quentes: Vermelho / Rosa / Coral)
  { key: 'kick',        label: 'Bumbo / Kick',    shortLabel: 'KICK',      shortcut: 'Q', group: 'primary',    color: 'red',    midi: 36 },
  { key: 'snare',       label: 'Caixa / Snare',   shortLabel: 'SNARE',     shortcut: 'W', group: 'primary',    color: 'rose',   midi: 38 },
  { key: 'clap',        label: 'Palmas / Clap',   shortLabel: 'CLAP',      shortcut: 'E', group: 'percussion', color: 'purple', midi: 39 },
  { key: 'tomHigh',     label: 'Tom Alto',        shortLabel: 'TOM HI',    shortcut: 'R', group: 'primary',    color: 'indigo', midi: 50 },

  // Linha 3: Percussão Complementar (Tons Roxo / Azul / Verde / Ciano)
  { key: 'tomMid',      label: 'Tom Médio',       shortLabel: 'TOM MID',   shortcut: 'A', group: 'primary',    color: 'indigo', midi: 48 },
  { key: 'tomFloor',    label: 'Tom de Chão',     shortLabel: 'TOM LOW',   shortcut: 'S', group: 'primary',    color: 'violet', midi: 45 },
  { key: 'triangle',    label: 'Triângulo',       shortLabel: 'TRIÂNGULO', shortcut: 'D', group: 'percussion', color: 'teal',   midi: 81 },
  { key: 'tambourine',  label: 'Pandeiro',        shortLabel: 'PANDEIRO',  shortcut: 'F', group: 'percussion', color: 'cyan',   midi: 54 },
  { key: 'agogo',       label: 'Agogô Duplo',     shortLabel: 'AGOGÔ',     shortcut: 'Z', group: 'percussion', color: 'emerald',midi: 67 },
  { key: 'shaker',      label: 'Shaker / Ganzá',  shortLabel: 'SHAKER',    shortcut: 'X', group: 'percussion', color: 'green',  midi: 70 },
];
