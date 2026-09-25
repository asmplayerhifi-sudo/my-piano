/**
 * scrolling/drawScoreChords.ts
 * Renderização da pista superior de acordes e notação de cifras.
 * Regra: Faixa estritamente superior (Y: 20–42), sem invadir o pentagrama (Pauta começa em Y=70).
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

  // Faixa Superior Exclusiva de Acordes (Totalmente acima da pauta que inicia em Y=70)
  const chordY = 21;
  const chordH = 21;

  chordSpans.forEach((chord) => {
    const chordX = attackLineX + (chord.startBeat * pixelsPerBeat) - scrollOffset;
    const chordW = Math.max(38, chord.duration * pixelsPerBeat - 4);
    const isActive = currentBeat >= chord.startBeat && currentBeat < chord.startBeat + chord.duration;
    const parsed = parseChord(chord.chordName);
    const notesPt = parsed ? parsed.notesFormatted : '';

    // Renderiza apenas se estiver visível no viewport horizontal
    if (chordX + chordW < -20 || chordX > width + 20) return;

    ctx.save();

    // 1. Estilização da Pílula de Duração do Acorde
    if (isTrad) {
      ctx.fillStyle = isActive ? '#fef3c7' : '#ffffff';
      ctx.strokeStyle = isActive ? '#d97706' : '#cbd5e1';
      ctx.lineWidth = isActive ? 1.8 : 1;
      if (isActive) {
        ctx.shadowColor = 'rgba(217, 119, 6, 0.25)';
        ctx.shadowBlur = 6;
      }
    } else {
      ctx.fillStyle = isActive ? 'rgba(245, 158, 11, 0.22)' : 'rgba(30, 41, 59, 0.7)';
      ctx.strokeStyle = isActive ? 'rgba(251, 191, 36, 0.95)' : 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = isActive ? 1.6 : 1;
      if (isActive) {
        ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
        ctx.shadowBlur = 8;
      }
    }

    drawRoundedPill(ctx, chordX, chordY, chordW, chordH, 5);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. Ticks de Pulso Rítmico Internos no Bloco do Acorde
    if (chordW > 60) {
      const beatsCount = Math.floor(chord.duration);
      const tickStep = (chordW - 20) / Math.max(1, beatsCount);
      const tickStartX = chordX + 16;
      ctx.fillStyle = isTrad ? 'rgba(217, 119, 6, 0.3)' : 'rgba(251, 191, 36, 0.3)';
      for (let b = 1; b < beatsCount; b++) {
        const tx = tickStartX + b * tickStep;
        if (tx > chordX + 8 && tx < chordX + chordW - 8) {
          ctx.beginPath();
          ctx.arc(tx, chordY + chordH / 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. Ancoragem Inteligente do Rótulo para Manter Legibilidade Durante a Rolagem
    const visibleLeft = Math.max(chordX, 10);
    const visibleRight = Math.min(chordX + chordW, width - 10);
    const visibleWidth = visibleRight - visibleLeft;

    let labelX: number;
    if (isActive) {
      // Quando ativo, ancora o rótulo suavemente junto à linha de leitura
      labelX = Math.max(chordX + 28, Math.min(attackLineX + 38, chordX + chordW - 28));
    } else {
      labelX = chordX + chordW / 2;
      // Garante que o texto fique dentro da porção visível da tela
      if (visibleWidth > 40) {
        labelX = Math.max(visibleLeft + 24, Math.min(labelX, visibleRight - 24));
      }
    }

    // 4. Formatação do Rótulo Textual (Totalmente contido no interior da pílula)
    let displayLabel = chord.chordName;
    if (isActive) {
      if (visibleWidth > 140 && notesPt) {
        displayLabel = `🎹 ${chord.chordName} [${notesPt}]${enableSustain ? ' • Legato' : ''}`;
      } else if (visibleWidth > 85 && notesPt) {
        displayLabel = `🎹 ${chord.chordName} [${notesPt}]`;
      } else if (visibleWidth > 55) {
        displayLabel = `🎹 ${chord.chordName}`;
      }
    } else {
      if (visibleWidth > 110 && notesPt) {
        displayLabel = `${chord.chordName} (${notesPt})`;
      } else {
        displayLabel = chord.chordName;
      }
    }

    ctx.fillStyle = isTrad ? (isActive ? '#92400e' : '#1e293b') : (isActive ? '#fef08a' : '#f8fafc');
    ctx.font = isActive ? 'bold 10.5px JetBrains Mono, monospace' : 'bold 9.5px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayLabel, labelX, chordY + chordH / 2);

    ctx.restore();
  });
}
