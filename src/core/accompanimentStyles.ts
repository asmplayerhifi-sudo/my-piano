/**
 * Estilos Rítmicos e Padrões de Acompanhamento Musical.
 * Cada estilo contém a definição passo a passo de:
 * - Bateria (Kick, Snare, Hi-hat, Rimshot, Shaker, Surdo, Ride, Clap);
 * - Baixo (Fundamental, Quinta, Terça, Oitava, Abordagem cromática);
 * - Harmonia / Acordes (Ataques, Duração, Dinâmica);
 * - Arpejo (Notas do acorde sequenciadas no tempo).
 */

import type { TimeSignature } from './types';

export type AccompanimentStyleId =
  | 'pop_rock'
  | 'ballad_4_4'
  | 'ballad_6_8'
  | 'bossa_nova'
  | 'waltz_3_4'
  | 'jazz_swing'
  | 'funk_groove'
  | 'reggae';

export interface DrumStep {
  step: number; // 0-based index no compasso
  kick?: boolean;
  snare?: boolean;
  hihat?: 'closed' | 'open';
  rimshot?: boolean;
  shaker?: boolean;
  surdo?: boolean;
  ride?: boolean;
  clap?: boolean;
  velocity?: number;
}

export interface BassStep {
  step: number;
  type: 'root' | 'fifth' | 'third' | 'octave' | 'approach';
  durationBeats: number;
  velocity?: number;
}

export interface ChordStep {
  step: number;
  durationBeats: number;
  velocity?: number;
}

export interface ArpeggioStep {
  step: number;
  noteIndex: number; // 0=Root, 1=3rd, 2=5th, 3=8th, etc.
  durationBeats: number;
  velocity?: number;
}

export interface AccompanimentStyleDefinition {
  id: AccompanimentStyleId;
  name: string;
  genreCategory: 'pop' | 'brazilian' | 'jazz' | 'rock' | 'ballad';
  timeSignature: TimeSignature;
  recommendedBpm: number;
  description: string;
  stepsPerMeasure: number; // Ex: 8 para colcheias em 4/4, 16 para semicolcheias, 6 para 6/8
  drumPattern: DrumStep[];
  bassPattern: BassStep[];
  chordPattern: ChordStep[];
  arpeggioPattern: ArpeggioStep[];
  chordInstrument: 'piano' | 'rhodes' | 'guitar_nylon' | 'synth_pad';
}

export const ACCOMPANIMENT_STYLES: AccompanimentStyleDefinition[] = [
  // ── 1. POP / ROCK (4/4) ───────────────────────────────────────────────────
  {
    id: 'pop_rock',
    name: 'Pop / Rock Clássico',
    genreCategory: 'pop',
    timeSignature: '4/4',
    recommendedBpm: 110,
    description: 'Bateria sólida com caixa nos tempos 2 e 4, baixo pulsante e harmonia firme com arpejo rítmico.',
    stepsPerMeasure: 8, // 8 colcheias
    chordInstrument: 'piano',
    drumPattern: [
      { step: 0, kick: true, hihat: 'closed', velocity: 0.95 },
      { step: 1, hihat: 'closed', velocity: 0.65 },
      { step: 2, snare: true, hihat: 'closed', velocity: 0.9 },
      { step: 3, hihat: 'closed', velocity: 0.65 },
      { step: 4, kick: true, hihat: 'closed', velocity: 0.9 },
      { step: 5, kick: true, hihat: 'closed', velocity: 0.75 },
      { step: 6, snare: true, hihat: 'closed', velocity: 0.95 },
      { step: 7, hihat: 'open', velocity: 0.7 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 0.8, velocity: 0.9 },
      { step: 2, type: 'root', durationBeats: 0.8, velocity: 0.75 },
      { step: 4, type: 'root', durationBeats: 0.8, velocity: 0.9 },
      { step: 6, type: 'fifth', durationBeats: 0.8, velocity: 0.85 },
    ],
    chordPattern: [
      { step: 0, durationBeats: 1.8, velocity: 0.8 },
      { step: 4, durationBeats: 1.8, velocity: 0.85 },
    ],
    arpeggioPattern: [
      { step: 0, noteIndex: 0, durationBeats: 0.45, velocity: 0.75 },
      { step: 1, noteIndex: 1, durationBeats: 0.45, velocity: 0.7 },
      { step: 2, noteIndex: 2, durationBeats: 0.45, velocity: 0.75 },
      { step: 3, noteIndex: 3, durationBeats: 0.45, velocity: 0.8 },
      { step: 4, noteIndex: 2, durationBeats: 0.45, velocity: 0.75 },
      { step: 5, noteIndex: 1, durationBeats: 0.45, velocity: 0.7 },
      { step: 6, noteIndex: 2, durationBeats: 0.45, velocity: 0.75 },
      { step: 7, noteIndex: 3, durationBeats: 0.45, velocity: 0.8 },
    ],
  },

  // ── 2. BALADA POP / RHODES (4/4) ──────────────────────────────────────────
  {
    id: 'ballad_4_4',
    name: 'Balada Pop Romântica',
    genreCategory: 'ballad',
    timeSignature: '4/4',
    recommendedBpm: 75,
    description: 'Levada intimista com piano elétrico Rhodes, rimshot suave e arpejo dedilhado envolvente.',
    stepsPerMeasure: 8,
    chordInstrument: 'rhodes',
    drumPattern: [
      { step: 0, kick: true, shaker: true, velocity: 0.75 },
      { step: 1, shaker: true, velocity: 0.5 },
      { step: 2, rimshot: true, shaker: true, velocity: 0.8 },
      { step: 3, shaker: true, velocity: 0.5 },
      { step: 4, kick: true, shaker: true, velocity: 0.7 },
      { step: 5, shaker: true, velocity: 0.55 },
      { step: 6, rimshot: true, shaker: true, velocity: 0.85 },
      { step: 7, hihat: 'open', velocity: 0.6 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 1.8, velocity: 0.8 },
      { step: 4, type: 'fifth', durationBeats: 1.6, velocity: 0.75 },
    ],
    chordPattern: [
      { step: 0, durationBeats: 3.8, velocity: 0.7 },
    ],
    arpeggioPattern: [
      { step: 0, noteIndex: 0, durationBeats: 0.9, velocity: 0.7 },
      { step: 2, noteIndex: 1, durationBeats: 0.9, velocity: 0.65 },
      { step: 4, noteIndex: 2, durationBeats: 0.9, velocity: 0.75 },
      { step: 6, noteIndex: 3, durationBeats: 0.9, velocity: 0.8 },
    ],
  },

  // ── 3. BALADA 6/8 (COMPASSO COMPOSTO) ─────────────────────────────────────
  {
    id: 'ballad_6_8',
    name: 'Balada 6/8 (Soul / Blues)',
    genreCategory: 'ballad',
    timeSignature: '6/8',
    recommendedBpm: 68,
    description: 'Compasso composto em 6 pulsações ternárias com arpejo ondulante de 6 notas e caixa no pulso 4.',
    stepsPerMeasure: 6, // 6 colcheias por compasso
    chordInstrument: 'piano',
    drumPattern: [
      { step: 0, kick: true, hihat: 'closed', velocity: 0.9 },
      { step: 1, hihat: 'closed', velocity: 0.55 },
      { step: 2, hihat: 'closed', velocity: 0.6 },
      { step: 3, snare: true, hihat: 'closed', velocity: 0.85 },
      { step: 4, hihat: 'closed', velocity: 0.55 },
      { step: 5, hihat: 'closed', velocity: 0.65 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 2.8, velocity: 0.85 },
      { step: 3, type: 'fifth', durationBeats: 2.8, velocity: 0.8 },
    ],
    chordPattern: [
      { step: 0, durationBeats: 2.9, velocity: 0.75 },
      { step: 3, durationBeats: 2.9, velocity: 0.75 },
    ],
    arpeggioPattern: [
      { step: 0, noteIndex: 0, durationBeats: 0.9, velocity: 0.8 },
      { step: 1, noteIndex: 1, durationBeats: 0.9, velocity: 0.7 },
      { step: 2, noteIndex: 2, durationBeats: 0.9, velocity: 0.75 },
      { step: 3, noteIndex: 3, durationBeats: 0.9, velocity: 0.8 },
      { step: 4, noteIndex: 2, durationBeats: 0.9, velocity: 0.7 },
      { step: 5, noteIndex: 1, durationBeats: 0.9, velocity: 0.65 },
    ],
  },

  // ── 4. BOSSA NOVA & SAMBA (2/4) ───────────────────────────────────────────
  {
    id: 'bossa_nova',
    name: 'Bossa Nova & Samba (2/4)',
    genreCategory: 'brazilian',
    timeSignature: '2/4',
    recommendedBpm: 84,
    description: 'Levada brasileira clássica com clave sincopada no aro (rimshot), surdo marcado e batida de violão João Gilberto.',
    stepsPerMeasure: 8, // 8 semicolcheias no compasso 2/4
    chordInstrument: 'guitar_nylon',
    drumPattern: [
      { step: 0, surdo: true, shaker: true, velocity: 0.75 },
      { step: 1, shaker: true, velocity: 0.5 },
      { step: 2, rimshot: true, shaker: true, velocity: 0.9 }, // Síncope Bossa
      { step: 3, shaker: true, velocity: 0.5 },
      { step: 4, surdo: true, shaker: true, velocity: 0.95 },  // Tempo 2 forte do samba
      { step: 5, rimshot: true, shaker: true, velocity: 0.85 }, // Síncope
      { step: 6, shaker: true, velocity: 0.5 },
      { step: 7, rimshot: true, shaker: true, velocity: 0.75 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 0.6, velocity: 0.85 },
      { step: 3, type: 'fifth', durationBeats: 0.4, velocity: 0.8 }, // Antecipação da síncope
      { step: 4, type: 'root', durationBeats: 0.8, velocity: 0.9 },
    ],
    chordPattern: [
      { step: 0, durationBeats: 0.45, velocity: 0.85 },
      { step: 2, durationBeats: 0.45, velocity: 0.8 },
      { step: 5, durationBeats: 0.45, velocity: 0.85 },
      { step: 7, durationBeats: 0.45, velocity: 0.8 },
    ],
    arpeggioPattern: [
      { step: 0, noteIndex: 0, durationBeats: 0.25, velocity: 0.75 },
      { step: 2, noteIndex: 1, durationBeats: 0.25, velocity: 0.7 },
      { step: 4, noteIndex: 2, durationBeats: 0.25, velocity: 0.8 },
      { step: 6, noteIndex: 3, durationBeats: 0.25, velocity: 0.75 },
    ],
  },

  // ── 5. VALSA CLÁSSICA (3/4) ───────────────────────────────────────────────
  {
    id: 'waltz_3_4',
    name: 'Valsa Clássica (3/4)',
    genreCategory: 'ballad',
    timeSignature: '3/4',
    recommendedBpm: 128,
    description: 'Padrão tradicional 3/4 (tum-tá-tá) com baixo no tempo 1 e acordes nos tempos 2 e 3.',
    stepsPerMeasure: 6, // 6 colcheias no compasso 3/4
    chordInstrument: 'piano',
    drumPattern: [
      { step: 0, kick: true, hihat: 'closed', velocity: 0.85 },
      { step: 2, snare: true, hihat: 'closed', velocity: 0.65 },
      { step: 4, snare: true, hihat: 'closed', velocity: 0.65 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 1.8, velocity: 0.9 },
    ],
    chordPattern: [
      { step: 2, durationBeats: 0.8, velocity: 0.75 },
      { step: 4, durationBeats: 0.8, velocity: 0.75 },
    ],
    arpeggioPattern: [
      { step: 0, noteIndex: 0, durationBeats: 0.9, velocity: 0.8 },
      { step: 2, noteIndex: 1, durationBeats: 0.9, velocity: 0.7 },
      { step: 4, noteIndex: 2, durationBeats: 0.9, velocity: 0.75 },
    ],
  },

  // ── 6. JAZZ SWING (4/4) ───────────────────────────────────────────────────
  {
    id: 'jazz_swing',
    name: 'Jazz Swing & Walking Bass',
    genreCategory: 'jazz',
    timeSignature: '4/4',
    recommendedBpm: 120,
    description: 'Prato ride swingado, chimbal com pé no 2 e 4, walking bass de 4 notas por compasso e acordes sincopados.',
    stepsPerMeasure: 8,
    chordInstrument: 'rhodes',
    drumPattern: [
      { step: 0, ride: true, velocity: 0.85 },
      { step: 2, ride: true, hihat: 'closed', velocity: 0.9 }, // Chick no 2
      { step: 3, ride: true, velocity: 0.65 },
      { step: 4, ride: true, velocity: 0.8 },
      { step: 6, ride: true, hihat: 'closed', velocity: 0.9 }, // Chick no 4
      { step: 7, ride: true, velocity: 0.65 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 0.9, velocity: 0.9 },
      { step: 2, type: 'third', durationBeats: 0.9, velocity: 0.85 },
      { step: 4, type: 'fifth', durationBeats: 0.9, velocity: 0.85 },
      { step: 6, type: 'approach', durationBeats: 0.9, velocity: 0.8 },
    ],
    chordPattern: [
      { step: 0, durationBeats: 0.45, velocity: 0.8 },
      { step: 3, durationBeats: 0.45, velocity: 0.85 }, // Charlestone sincopado
      { step: 6, durationBeats: 0.45, velocity: 0.75 },
    ],
    arpeggioPattern: [
      { step: 0, noteIndex: 0, durationBeats: 0.4, velocity: 0.75 },
      { step: 2, noteIndex: 1, durationBeats: 0.4, velocity: 0.7 },
      { step: 4, noteIndex: 2, durationBeats: 0.4, velocity: 0.8 },
      { step: 6, noteIndex: 3, durationBeats: 0.4, velocity: 0.75 },
    ],
  },

  // ── 7. FUNK / GROOVE (4/4) ────────────────────────────────────────────────
  {
    id: 'funk_groove',
    name: 'Funk & Soul Groove',
    genreCategory: 'rock',
    timeSignature: '4/4',
    recommendedBpm: 104,
    description: 'Groove altamente dançante com bumbo sincopado, contratempos marcados e acordes staccato tipo James Brown.',
    stepsPerMeasure: 8,
    chordInstrument: 'rhodes',
    drumPattern: [
      { step: 0, kick: true, hihat: 'closed', velocity: 0.95 },
      { step: 1, hihat: 'closed', velocity: 0.7 },
      { step: 2, snare: true, hihat: 'closed', velocity: 0.95 },
      { step: 3, kick: true, hihat: 'open', velocity: 0.85 },
      { step: 4, hihat: 'closed', velocity: 0.7 },
      { step: 5, kick: true, hihat: 'closed', velocity: 0.9 },
      { step: 6, snare: true, hihat: 'closed', velocity: 0.95 },
      { step: 7, hihat: 'open', velocity: 0.8 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 0.4, velocity: 0.95 },
      { step: 3, type: 'octave', durationBeats: 0.35, velocity: 0.85 },
      { step: 5, type: 'fifth', durationBeats: 0.4, velocity: 0.9 },
      { step: 7, type: 'root', durationBeats: 0.35, velocity: 0.85 },
    ],
    chordPattern: [
      { step: 1, durationBeats: 0.3, velocity: 0.85 },
      { step: 4, durationBeats: 0.3, velocity: 0.85 },
      { step: 7, durationBeats: 0.3, velocity: 0.8 },
    ],
    arpeggioPattern: [
      { step: 1, noteIndex: 3, durationBeats: 0.3, velocity: 0.8 },
      { step: 3, noteIndex: 2, durationBeats: 0.3, velocity: 0.75 },
      { step: 5, noteIndex: 1, durationBeats: 0.3, velocity: 0.8 },
      { step: 7, noteIndex: 0, durationBeats: 0.3, velocity: 0.85 },
    ],
  },

  // ── 8. REGGAE & SKA (4/4) ─────────────────────────────────────────────────
  {
    id: 'reggae',
    name: 'Reggae One-Drop',
    genreCategory: 'brazilian',
    timeSignature: '4/4',
    recommendedBpm: 76,
    description: 'Autêntico One-Drop com bumbo e aro no tempo 3, acordes com skank no contratempo e linha de baixo dub encorpada.',
    stepsPerMeasure: 8,
    chordInstrument: 'guitar_nylon',
    drumPattern: [
      { step: 0, hihat: 'closed', velocity: 0.7 },
      { step: 1, hihat: 'closed', velocity: 0.65 },
      { step: 2, hihat: 'closed', velocity: 0.7 },
      { step: 3, hihat: 'closed', velocity: 0.65 },
      { step: 4, kick: true, rimshot: true, hihat: 'open', velocity: 0.95 }, // One drop no 3!
      { step: 5, hihat: 'closed', velocity: 0.65 },
      { step: 6, hihat: 'closed', velocity: 0.7 },
      { step: 7, hihat: 'open', velocity: 0.75 },
    ],
    bassPattern: [
      { step: 0, type: 'root', durationBeats: 0.8, velocity: 0.9 },
      { step: 2, type: 'third', durationBeats: 0.8, velocity: 0.85 },
      { step: 4, type: 'fifth', durationBeats: 1.6, velocity: 0.9 },
    ],
    chordPattern: [
      { step: 1, durationBeats: 0.35, velocity: 0.85 }, // Skank no "e" do 1
      { step: 3, durationBeats: 0.35, velocity: 0.85 }, // Skank no "e" do 2
      { step: 5, durationBeats: 0.35, velocity: 0.85 }, // Skank no "e" do 3
      { step: 7, durationBeats: 0.35, velocity: 0.85 }, // Skank no "e" do 4
    ],
    arpeggioPattern: [
      { step: 1, noteIndex: 2, durationBeats: 0.35, velocity: 0.75 },
      { step: 3, noteIndex: 1, durationBeats: 0.35, velocity: 0.75 },
      { step: 5, noteIndex: 3, durationBeats: 0.35, velocity: 0.8 },
      { step: 7, noteIndex: 0, durationBeats: 0.35, velocity: 0.8 },
    ],
  },
];
