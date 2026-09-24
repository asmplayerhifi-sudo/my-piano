/**
 * scrolling/drawScoreImpactLine.ts
 * Renderização da barra de ataque vertical fixa com brilho e círculos terminais.
 * Regra: Renderização pura (< 50 linhas).
 */

import type { ScoreTheme } from './types';

export function drawScoreImpactLine(
  ctx: CanvasRenderingContext2D,
  height: number,
  theme: ScoreTheme,
  attackLineX: number
): void {
  const isTrad = theme === 'traditional';

  ctx.save();
  ctx.strokeStyle = isTrad ? '#2563eb' : '#06b6d4';
  ctx.lineWidth = 3;
  ctx.shadowColor = isTrad ? 'rgba(37, 99, 235, 0.35)' : '#06b6d4';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(attackLineX, 24);
  ctx.lineTo(attackLineX, height - 26);
  ctx.stroke();

  ctx.fillStyle = isTrad ? '#1d4ed8' : '#22d3ee';
  ctx.beginPath();
  ctx.arc(attackLineX, 28, 5.5, 0, Math.PI * 2);
  ctx.arc(attackLineX, height - 30, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
