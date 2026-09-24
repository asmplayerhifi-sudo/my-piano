/**
 * scrolling/drawScoreBackground.ts
 * Renderização dos fundos Tradicional (P&B) e Noturno, além do corredor de foco.
 * Regra: Renderização pura (< 70 linhas).
 */

import type { ScoreTheme } from './types';

export function drawScoreBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ScoreTheme,
  attackLineX: number,
  pixelsPerBeat: number
): void {
  const isTrad = theme === 'traditional';

  ctx.clearRect(0, 0, width, height);

  if (isTrad) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, 36);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.lineTo(width, 36);
    ctx.stroke();
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#090814');
    bgGrad.addColorStop(1, '#110f22');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Corredor de foco ativo / antecipação visual
  const focusWidth = Math.min(width - attackLineX - 20, Math.max(260, pixelsPerBeat * 2.5));
  ctx.save();
  const focusGrad = ctx.createLinearGradient(attackLineX, 0, attackLineX + focusWidth, 0);
  if (isTrad) {
    focusGrad.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
    focusGrad.addColorStop(0.65, 'rgba(37, 99, 235, 0.02)');
    focusGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
  } else {
    focusGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
    focusGrad.addColorStop(0.65, 'rgba(99, 102, 241, 0.04)');
    focusGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  }
  ctx.fillStyle = focusGrad;
  ctx.fillRect(attackLineX, 36, focusWidth, height - 36);

  ctx.fillStyle = isTrad ? 'rgba(29, 78, 216, 0.75)' : 'rgba(56, 189, 248, 0.85)';
  ctx.font = 'bold 8.5px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZONA DE LEITURA ➔', attackLineX + 10, 12);
  ctx.restore();
}
