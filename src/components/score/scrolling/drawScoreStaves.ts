/**
 * scrolling/drawScoreStaves.ts
 * Renderização dos pentagramas (Claves de Sol e Fá), linhas auxiliares e barras de compasso.
 * Regra: Renderização pura (< 190 linhas).
 */

import type { DisplayOptions, ScoreTheme } from './types';
import { SCORE_GEOMETRY, drawRoundedPill } from './scoreGeometry';
import { octaveConfigStore } from '../../../core/octaveConfigStore';

interface DrawStavesParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  theme: ScoreTheme;
  displayOptions: DisplayOptions;
  measureStartBeats: Map<number, number>;
  maxMeasure: number;
  totalBeats: number;
  beatsPerMeasure: number;
  attackLineX: number;
  scrollOffset: number;
  pixelsPerBeat: number;
  activeMeasure?: number;
}

export function drawScoreStaves({
  ctx,
  width,
  theme,
  displayOptions,
  measureStartBeats,
  maxMeasure: _maxMeasure,
  totalBeats,
  beatsPerMeasure,
  attackLineX,
  scrollOffset,
  pixelsPerBeat,
  activeMeasure,
}: DrawStavesParams): void {
  const isTrad = theme === 'traditional';
  const { trebleBaseY, trebleLineStep, bassBaseY, bassLineStep, middleCY } = SCORE_GEOMETRY;

  // 1. Pauta de Sol (5 Linhas)
  ctx.strokeStyle = isTrad ? '#09090b' : '#475569';
  ctx.lineWidth = isTrad ? 1.5 : 1.2;
  for (let i = 0; i < 5; i++) {
    const y = trebleBaseY - i * trebleLineStep;
    ctx.beginPath();
    ctx.moveTo(24, y);
    ctx.lineTo(width - 24, y);
    ctx.stroke();
  }

  // Clave de Sol
  ctx.fillStyle = isTrad ? '#09090b' : '#818cf8';
  ctx.font = 'bold 50px serif';
  ctx.fillText('𝄞', 32, 122);

  // 2. Linha Pontilhada de Dó Central (C3 = MIDI 60)
  ctx.save();
  ctx.strokeStyle = isTrad ? 'rgba(15, 23, 42, 0.28)' : 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(24, middleCY);
  ctx.lineTo(width - 24, middleCY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Badge Dó Central
  ctx.fillStyle = isTrad ? '#f1f5f9' : 'rgba(14, 165, 233, 0.18)';
  ctx.strokeStyle = isTrad ? '#94a3b8' : 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = 1;
  drawRoundedPill(ctx, 24, middleCY - 9, 94, 18, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = isTrad ? '#0f172a' : '#38bdf8';
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const middleCLabel = `DÓ CENTRAL (${octaveConfigStore.getStandard()})`;
  ctx.fillText(middleCLabel, 71, middleCY);
  ctx.restore();

  // 3. Pauta de Fá (5 Linhas)
  ctx.strokeStyle = isTrad ? '#09090b' : '#475569';
  ctx.lineWidth = isTrad ? 1.5 : 1.2;
  for (let i = 0; i < 5; i++) {
    const y = bassBaseY - i * bassLineStep;
    ctx.beginPath();
    ctx.moveTo(24, y);
    ctx.lineTo(width - 24, y);
    ctx.stroke();
  }

  // Clave de Fá
  ctx.fillStyle = isTrad ? '#09090b' : '#a78bfa';
  ctx.font = 'bold 44px serif';
  ctx.fillText('𝄢', 32, 288);

  // 4. Barras de Compasso e Régua Superior
  if (displayOptions.showBarlines) {
    const currentBeat = scrollOffset / pixelsPerBeat;
    const currentMeasure = activeMeasure !== undefined
      ? activeMeasure
      : Math.floor(currentBeat / beatsPerMeasure) + 1;

    // Desenha todas as barras verticais de início de compasso (c.1, c.2, c.3...) e suas subdivisões
    measureStartBeats.forEach((measureBeat, m) => {
      const barX = attackLineX + (measureBeat * pixelsPerBeat) - scrollOffset;

      if (barX > -40 && barX < width + 40) {
        ctx.save();
        const isCurrentActiveMeasure = m === currentMeasure;

        // Barra de compasso vertical simples
        ctx.strokeStyle = isCurrentActiveMeasure ? (isTrad ? '#2563eb' : '#818cf8') : (isTrad ? '#475569' : '#64748b');
        ctx.lineWidth = isCurrentActiveMeasure ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(barX, 36);
        ctx.lineTo(barX, bassBaseY + 14);
        ctx.stroke();

        // Badge c.1, c.2...
        const badgeW = m > 9 ? 34 : 28;
        ctx.fillStyle = isCurrentActiveMeasure ? (isTrad ? '#dbeafe' : 'rgba(99, 102, 241, 0.35)') : (isTrad ? '#f1f5f9' : 'rgba(30, 41, 59, 0.85)');
        ctx.strokeStyle = isCurrentActiveMeasure ? (isTrad ? '#3b82f6' : '#818cf8') : (isTrad ? '#94a3b8' : '#475569');
        ctx.lineWidth = 1;
        drawRoundedPill(ctx, barX - badgeW / 2, 4, badgeW, 14, 3.5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isCurrentActiveMeasure ? (isTrad ? '#1e40af' : '#e0e7ff') : (isTrad ? '#334155' : '#94a3b8');
        ctx.font = 'bold 8px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`c.${m}`, barX, 11.5);

        // Subdivisões rítmicas internas do compasso
        if (displayOptions.showSubdivisions) {
          for (let b = 1; b < beatsPerMeasure; b++) {
            const beatX = attackLineX + ((measureBeat + b) * pixelsPerBeat) - scrollOffset;
            if (beatX > 0 && beatX < width) {
              ctx.strokeStyle = isTrad ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.3)';
              ctx.lineWidth = 1;
              ctx.setLineDash([3, 3]);
              ctx.beginPath();
              ctx.moveTo(beatX, 36);
              ctx.lineTo(beatX, bassBaseY + 14);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }

        ctx.restore();
      }
    });

    // 5. Barra Final Dupla de Encerramento (FIM) estritamente ao final de todos os compassos da partitura
    const finalBarX = attackLineX + (totalBeats * pixelsPerBeat) - scrollOffset;
    if (finalBarX > -40 && finalBarX < width + 40) {
      ctx.save();
      // Linha fina antes da barra final grossa (padrão formal de notação musical de fim de partitura)
      ctx.strokeStyle = isTrad ? '#09090b' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(finalBarX - 7, 36);
      ctx.lineTo(finalBarX - 7, bassBaseY + 14);
      ctx.stroke();

      // Linha grossa final
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(finalBarX, 36);
      ctx.lineTo(finalBarX, bassBaseY + 14);
      ctx.stroke();

      // Badge FIM
      ctx.fillStyle = isTrad ? '#fee2e2' : 'rgba(244, 63, 94, 0.2)';
      ctx.strokeStyle = isTrad ? '#ef4444' : 'rgba(244, 63, 94, 0.6)';
      ctx.lineWidth = 1;
      drawRoundedPill(ctx, finalBarX - 16, 4, 32, 14, 3.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isTrad ? '#b91c1c' : '#fda4af';
      ctx.font = 'bold 8.5px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FIM', finalBarX, 11.5);
      ctx.restore();
    }
  }
}
