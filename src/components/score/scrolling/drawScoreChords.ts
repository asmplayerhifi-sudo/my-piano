/**
 * scrolling/drawScoreChords.ts
 * Renderização da pista superior de acordes com ocupação métrica.
 * Regra: Renderização pura (< 100 linhas).
 */

import type { ChordSpan, ScoreTheme } from './types';
import { drawRoundedPill } from './scoreGeometry';

interface DrawChordsParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  theme: ScoreTheme;
  chordSpans: ChordSpan[];
  attackLineX: number;
  scrollOffset: number;
  pixelsPerBeat: number;
}

export function drawScoreChords({
  ctx,
  width,
  theme,
  chordSpans,
  attackLineX,
  scrollOffset,
  pixelsPerBeat,
}: DrawChordsParams): void {
  if (!chordSpans || chordSpans.length === 0) return;

  const isTrad = theme === 'traditional';
  const currentBeat = scrollOffset / pixelsPerBeat;
  const chordY = 40;
  const chordH = 22;

  chordSpans.forEach(chord => {
    const chordX = attackLineX + (chord.startBeat * pixelsPerBeat) - scrollOffset;
    const chordW = Math.max(38, chord.duration * pixelsPerBeat - 6);

    if (chordX + chordW > 10 && chordX < width - 10) {
      ctx.save();
      const isActive = currentBeat >= chord.startBeat && currentBeat < chord.startBeat + chord.duration;

      if (isTrad) {
        if (isActive) {
          ctx.fillStyle = '#fef3c7';
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.5;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
        }
      } else {
        if (isActive) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.lineWidth = 1.4;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.lineWidth = 1;
        }
      }

      drawRoundedPill(ctx, chordX, chordY, chordW, chordH, 5);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Texto do Acorde
      ctx.fillStyle = isTrad ? (isActive ? '#b45309' : '#1e293b') : (isActive ? '#fbbf24' : '#f8fafc');
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(chord.chordName, chordX + Math.min(24, chordW / 2), chordY + chordH / 2);

      // Ticks rítmicos dentro do acorde se houver espaço
      if (chordW > 60) {
        const beatsCount = Math.floor(chord.duration);
        const tickStep = (chordW - 38) / Math.max(1, beatsCount);
        const tickStartX = chordX + 36;
        ctx.fillStyle = isTrad ? 'rgba(217, 119, 6, 0.4)' : 'rgba(251, 191, 36, 0.4)';
        for (let b = 0; b < beatsCount; b++) {
          const tx = tickStartX + b * tickStep;
          ctx.beginPath();
          ctx.arc(tx, chordY + chordH / 2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
  });
}
