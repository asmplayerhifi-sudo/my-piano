/**
 * scrolling/drawScoreNotes.ts
 * Renderização das notas musicais, hastes, acidentes (#/b) e dedilhado.
 * Regra: Renderização pura (< 160 linhas).
 */

import type { ScoreNote } from '../../../core/coursesData';
import type { DisplayOptions, ScoreTheme } from './types';
import { SCORE_GEOMETRY, drawRoundedPill, getNoteY, getScoreNoteFingering } from './scoreGeometry';

interface DrawNotesParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  notes: ScoreNote[];
  theme: ScoreTheme;
  displayOptions: DisplayOptions;
  noteOffsets: number[];
  currentIndex: number;
  attackLineX: number;
  scrollOffset: number;
  pixelsPerBeat: number;
  instrument: 'piano' | 'guitar';
  isDemoMode: boolean;
}

export function drawScoreNotes({
  ctx,
  width,
  notes,
  theme,
  displayOptions,
  noteOffsets,
  currentIndex,
  attackLineX,
  scrollOffset,
  pixelsPerBeat,
  instrument,
  isDemoMode,
}: DrawNotesParams): void {
  const isTrad = theme === 'traditional';
  const { middleCY, trebleBaseY, trebleLineStep, trebleNoteNameY, trebleFingerY, bassNoteNameY, bassFingerY } = SCORE_GEOMETRY;

  notes.forEach((note, idx) => {
    const noteOffset = noteOffsets[idx] ?? 0;
    const noteX = attackLineX + noteOffset * pixelsPerBeat - scrollOffset;
    const noteY = getNoteY(note.midi, note.clef);
    const isCurrentTarget = isDemoMode ? Math.abs(noteX - attackLineX) < 24 : idx === currentIndex;
    const hasPassed = isDemoMode ? noteX < attackLineX - 10 : idx < currentIndex;
    const isMiddleC = note.midi === 60;
    const dur = note.duration || 1;

    let noteAlpha = 1.0;
    if (noteX < attackLineX) {
      noteAlpha = Math.max(0, 1 - (attackLineX - noteX) / 75) * 0.35;
    }

    if (noteAlpha <= 0.01 || noteX <= -40 || noteX >= width + 60) return;

    const rx = Math.round(noteX);
    const ry = Math.round(noteY);
    ctx.save();
    ctx.globalAlpha = noteAlpha;

    // Spotlight na nota ativa
    if (isCurrentTarget) {
      ctx.fillStyle = isTrad ? 'rgba(37, 99, 235, 0.14)' : 'rgba(56, 189, 248, 0.22)';
      ctx.beginPath();
      ctx.arc(rx, ry, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isTrad ? '#2563eb' : '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(rx, ry, 13.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Cores
    let noteColor = isTrad ? '#09090b' : '#e2e8f0';
    if (hasPassed) {
      noteColor = isTrad ? '#64748b' : '#10b981';
    } else if (isCurrentTarget) {
      noteColor = isTrad ? '#2563eb' : '#f43f5e';
    } else if (isMiddleC && !isTrad) {
      noteColor = '#38bdf8';
    }
    ctx.fillStyle = noteColor;
    ctx.strokeStyle = noteColor;

    // Linhas Suplementares Dó Central
    if (isMiddleC) {
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(rx - 16, middleCY);
      ctx.lineTo(rx + 16, middleCY);
      ctx.stroke();
    }

    // Acidentes (# / b)
    if (note.noteName.includes('#')) {
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'right';
      ctx.fillText('♯', rx - 12, ry + 6);
    } else if (note.noteName.includes('b') || note.noteName.includes('♭')) {
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'right';
      ctx.fillText('♭', rx - 12, ry + 5);
    }

    // Cabeça da nota
    const isWhole = dur >= 3.5;
    const isHalf = dur >= 1.75 && dur < 3.5;

    ctx.beginPath();
    ctx.ellipse(rx, ry, 11, 7.5, -Math.PI / 8, 0, Math.PI * 2);
    if (isWhole || isHalf) {
      ctx.lineWidth = 2.8;
      ctx.stroke();
    } else {
      ctx.fill();
    }

    // Haste (Stem)
    if (!isWhole) {
      const isUpStem = ry > (trebleBaseY - 2 * trebleLineStep);
      const stemX = isUpStem ? rx + 10 : rx - 10;
      const stemYEnd = isUpStem ? ry - 38 : ry + 38;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(stemX, ry);
      ctx.lineTo(stemX, stemYEnd);
      ctx.stroke();

      if (dur <= 0.75) {
        ctx.beginPath();
        ctx.moveTo(stemX, stemYEnd);
        ctx.quadraticCurveTo(stemX + 12, stemYEnd + 14, stemX + 2, stemYEnd + 24);
        ctx.stroke();
      }
    }

    // Nome da Nota e Dedilhado
    const isBassClef = note.clef === 'bass' || (!note.clef && note.midi < 60);
    const nameY = isBassClef ? bassNoteNameY : trebleNoteNameY;
    const fingerY = isBassClef ? bassFingerY : trebleFingerY;

    if (displayOptions.showNoteNames) {
      ctx.fillStyle = isTrad ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(note.noteName, rx, nameY);
    }

    if (displayOptions.showFingering) {
      const fingering = getScoreNoteFingering(note, instrument);
      if (fingering) {
        ctx.fillStyle = fingering.color;
        drawRoundedPill(ctx, rx - 9, fingerY - 8, 18, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fingering.label, rx, fingerY + 3.5);
      }
    }

    ctx.restore();
  });
}
