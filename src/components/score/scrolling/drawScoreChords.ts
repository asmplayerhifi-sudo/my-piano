/**
 * scrolling/drawScoreChords.ts
 * Renderização da pista superior de acordes e notação de cifras sobre o pentagrama.
 * Regra: Renderização pura (< 130 linhas).
 */

import type { ChordSpan, ScoreTheme } from './types';
import { drawRoundedPill } from './scoreGeometry';
import { parseChord } from '../../../core/musicTheory';

interface DrawChordsParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  theme: ScoreTheme;
  chordSpans: ChordSpan[];
  attackLineX: number;
  scrollOffset: number;
  pixelsPerBeat: number;
  enableSustain?: boolean;
}

export function drawScoreChords({
  ctx,
  width,
  theme,
  chordSpans,
  attackLineX,
  scrollOffset,
  pixelsPerBeat,
  enableSustain = true,
}: DrawChordsParams): void {
  if (!chordSpans || chordSpans.length === 0) return;

  const isTrad = theme === 'traditional';
  const currentBeat = scrollOffset / pixelsPerBeat;
  const chordY = 38;
  const chordH = 24;

  chordSpans.forEach(chord => {
    const chordX = attackLineX + (chord.startBeat * pixelsPerBeat) - scrollOffset;
    const chordW = Math.max(42, chord.duration * pixelsPerBeat - 6);
    const isActive = currentBeat >= chord.startBeat && currentBeat < chord.startBeat + chord.duration;
    const parsed = parseChord(chord.chordName);
    const notesPt = parsed ? parsed.notesFormatted : '';

    // 1. Notação Tradicional de Cifra Diretamente sobre o Pentagrama (y = 82)
    if (chordX > -60 && chordX < width + 60) {
      ctx.save();
      ctx.fillStyle = isTrad ? (isActive ? '#b45309' : '#1e293b') : (isActive ? '#fbbf24' : '#cbd5e1');
      ctx.font = isActive ? 'bold 15px JetBrains Mono, sans-serif' : 'bold 13px JetBrains Mono, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(chord.chordName, chordX + 4, 82);
      ctx.restore();
    }

    // 2. Pista Superior de Duração e Ocupação Harmônica
    if (chordX + chordW > 10 && chordX < width - 10) {
      ctx.save();

      if (isTrad) {
        ctx.fillStyle = isActive ? '#fef3c7' : '#ffffff';
        ctx.strokeStyle = isActive ? '#d97706' : '#cbd5e1';
        ctx.lineWidth = isActive ? 1.8 : 1;
      } else {
        ctx.fillStyle = isActive ? 'rgba(245, 158, 11, 0.28)' : 'rgba(30, 41, 59, 0.7)';
        ctx.strokeStyle = isActive ? 'rgba(251, 191, 36, 0.95)' : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = isActive ? 1.6 : 1;
        if (isActive) {
          ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
          ctx.shadowBlur = 10;
        }
      }

      drawRoundedPill(ctx, chordX, chordY, chordW, chordH, 6);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ancoragem inteligente do rótulo para nunca sumir durante o rolamento do compasso
      const visibleLeft = Math.max(chordX, 14);
      const visibleRight = Math.min(chordX + chordW, width - 14);
      let labelX: number;

      if (isActive) {
        labelX = Math.max(chordX + 32, Math.min(attackLineX + 50, chordX + chordW - 32));
      } else {
        labelX = chordX + Math.min(32, chordW / 2);
        if (labelX < visibleLeft + 24) {
          labelX = Math.min(visibleLeft + 32, visibleRight - 24);
        }
      }

      // Rótulo completo do acorde com notas didáticas
      const displayLabel = isActive && notesPt
        ? `${chord.chordName} [${notesPt}]`
        : (chordW > 90 && notesPt ? `${chord.chordName} (${notesPt})` : chord.chordName);

      ctx.fillStyle = isTrad ? (isActive ? '#92400e' : '#1e293b') : (isActive ? '#fef08a' : '#f8fafc');
      ctx.font = isActive ? 'bold 11px JetBrains Mono, monospace' : 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayLabel, labelX, chordY + chordH / 2);

      // Ticks rítmicos dos tempos no interior da barra
      if (chordW > 70) {
        const beatsCount = Math.floor(chord.duration);
        const tickStep = (chordW - 38) / Math.max(1, beatsCount);
        const tickStartX = chordX + 36;
        ctx.fillStyle = isTrad ? 'rgba(217, 119, 6, 0.35)' : 'rgba(251, 191, 36, 0.35)';
        for (let b = 0; b < beatsCount; b++) {
          const tx = tickStartX + b * tickStep;
          if (tx > chordX + 10 && tx < chordX + chordW - 10) {
            ctx.beginPath();
            ctx.arc(tx, chordY + chordH / 2, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    }

    // 3. Emblema de Acorde Ativo na Linha de Leitura
    if (isActive) {
      ctx.save();
      const badgeX = attackLineX + 14;
      const badgeY = 60;
      const badgeText = `🎹 ${chord.chordName}${notesPt ? ` • ${notesPt}` : ''} (${enableSustain ? 'Sustain ON' : 'Staccato'})`;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      const textW = ctx.measureText(badgeText).width;

      ctx.fillStyle = isTrad ? 'rgba(254, 243, 199, 0.95)' : 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = isTrad ? '#d97706' : '#f59e0b';
      ctx.lineWidth = 1.4;
      drawRoundedPill(ctx, badgeX, badgeY, textW + 16, 20, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isTrad ? '#92400e' : '#fbbf24';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, badgeX + 8, badgeY + 10);
      ctx.restore();
    }
  });
}
