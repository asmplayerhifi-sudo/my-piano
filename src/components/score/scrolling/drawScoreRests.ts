/**
 * scrolling/drawScoreRests.ts
 * Renderização de pausas musicais formais (Semibreve, Mínima, Semínima).
 * Regra: Renderização pura (< 60 linhas).
 */

import type { RestItem, ScoreTheme } from './types';
import { SCORE_GEOMETRY } from './scoreGeometry';

interface DrawRestsParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  theme: ScoreTheme;
  restsList: RestItem[];
  attackLineX: number;
  scrollOffset: number;
  pixelsPerBeat: number;
}

export function drawScoreRests({
  ctx,
  width,
  theme,
  restsList,
  attackLineX,
  scrollOffset,
  pixelsPerBeat,
}: DrawRestsParams): void {
  const isTrad = theme === 'traditional';
  const { trebleBaseY, trebleLineStep, bassBaseY, bassLineStep } = SCORE_GEOMETRY;

  restsList.forEach(rest => {
    const restX = attackLineX + rest.beatOffset * pixelsPerBeat - scrollOffset;
    if (restX <= -40 || restX >= width + 40) return;

    ctx.save();
    const restColor = isTrad ? '#09090b' : '#94a3b8';
    const yBase = rest.clef === 'treble' ? (trebleBaseY - 2 * trebleLineStep) : (bassBaseY - 2 * bassLineStep);

    if (rest.duration >= 3) {
      ctx.fillStyle = restColor;
      ctx.fillRect(restX - 8, yBase - trebleLineStep, 16, 7);
    } else if (rest.duration >= 1.8) {
      ctx.fillStyle = restColor;
      ctx.fillRect(restX - 8, yBase - 7, 16, 7);
    } else if (rest.duration >= 0.8) {
      ctx.strokeStyle = restColor;
      ctx.fillStyle = restColor;
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(restX - 3, yBase - 16);
      ctx.lineTo(restX + 4, yBase - 7);
      ctx.lineTo(restX - 4, yBase + 2);
      ctx.lineTo(restX + 3, yBase + 9);
      ctx.arc(restX - 1, yBase + 12, 3, 0, Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    ctx.restore();
  });
}
