/**
 * scrolling/scoreGeometry.ts
 * Geometria vetorial, mapeamento de coordenadas Y, cálculo de offsets de beat e auxiliares Canvas.
 * Regra: Métodos determinísticos, sem efeitos colaterais.
 */

import type { ScoreNote } from '../../../core/coursesData';

export const SCORE_GEOMETRY = {
  trebleLineStep: 14,
  trebleBaseY: 126,
  middleCY: 140,
  trebleNoteNameY: 168,
  trebleFingerY: 198,
  bassTopY: 248,
  bassLineStep: 14,
  bassBaseY: 304,
  bassNoteNameY: 338,
  bassFingerY: 368,
  attackLineX: 145,
} as const;

export function getNoteY(midi: number, clef: 'treble' | 'bass' = 'treble'): number {
  const SEMITONE_TO_DIATONIC = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
  const semitone = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 2;
  const diatonicStep = octave * 7 + SEMITONE_TO_DIATONIC[semitone];

  if (midi === 60) return SCORE_GEOMETRY.middleCY;

  if (clef === 'treble' || midi > 60) {
    return SCORE_GEOMETRY.trebleBaseY - (diatonicStep - 23) * 7;
  } else {
    return SCORE_GEOMETRY.bassTopY + (19 - diatonicStep) * 7;
  }
}

export function drawRoundedPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export interface NoteFingeringInfo {
  finger: number;
  hand: 'MD' | 'ME';
  label: string;
  fingerName: string;
  color: string;
}

export function getScoreNoteFingering(
  note: ScoreNote,
  instrument: 'piano' | 'guitar'
): NoteFingeringInfo | null {
  const names = ['', 'Polegar', 'Indicador', 'Médio', 'Anelar', 'Mínimo'];
  const colors = ['', '#d97706', '#2563eb', '#059669', '#7c3aed', '#e11d48'];

  if (note.fingerRightHand) {
    const f = note.fingerRightHand;
    return {
      finger: f,
      hand: 'MD',
      label: `${f}`,
      fingerName: names[f] || `D${f}`,
      color: colors[f] || '#2563eb',
    };
  }

  if (note.fingerLeftHand) {
    const f = note.fingerLeftHand;
    return {
      finger: f,
      hand: 'ME',
      label: `${f}`,
      fingerName: names[f] || `D${f}`,
      color: colors[f] || '#7c3aed',
    };
  }

  const legacyFinger = (note as unknown as { finger?: number }).finger;
  if (legacyFinger) {
    const f = legacyFinger;
    const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
    const hand = isBass ? 'ME' : 'MD';
    return {
      finger: f,
      hand,
      label: `${f}`,
      fingerName: names[f] || `D${f}`,
      color: isBass ? (colors[f] || '#7c3aed') : (colors[f] || '#2563eb'),
    };
  }

  if (instrument === 'piano') {
    const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
    const f = isBass ? 5 : 1;
    return {
      finger: f,
      hand: isBass ? 'ME' : 'MD',
      label: `${f}`,
      fingerName: names[f],
      color: isBass ? colors[5] : colors[1],
    };
  }

  return null;
}

/**
 * Converte as notas de uma partitura em offsets de beat (desde o início da obra).
 * Centralizado aqui para evitar duplicação em consumidores como RepertoireView.
 *
 * @param notes       Lista de notas da partitura.
 * @param timeSignature Fórmula de compasso no formato "numerador/denominador".
 * @returns Array de offsets em beats, indexado 1:1 com `notes`.
 */
export function computeNoteOffsets(notes: ScoreNote[], timeSignature = '4/4'): number[] {
  const parts = timeSignature.split('/');
  const num = parseInt(parts[0], 10) || 4;
  const den = parseInt(parts[1], 10) || 4;
  let beatsPerMeasure = num;
  if (den === 8 && num >= 6) {
    beatsPerMeasure = num / 3;
  }

  if (!notes || notes.length === 0) return [];

  return notes.map((note) => {
    const m = Math.max(1, note.measure || 1);
    const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
    return (m - 1) * beatsPerMeasure + b;
  });
}

