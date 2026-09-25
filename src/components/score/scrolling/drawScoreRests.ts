/**
 * scrolling/drawScoreRests.ts
 * Renderização fidedigna das pausas musicais formais (Behind Bars / Gardner Read):
 * Semibreve, Mínima, Semínima, Colcheia e Semicolcheia.
 * Regra: Renderização pura, geométrica e proporcional à pauta.
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

  restsList.forEach((rest) => {
    const restX = attackLineX + rest.beatOffset * pixelsPerBeat - scrollOffset;
    if (restX <= -40 || restX >= width + 40) return;

    ctx.save();
    const restColor = isTrad ? '#09090b' : '#94a3b8';
    ctx.fillStyle = restColor;
    ctx.strokeStyle = restColor;

    const isTreble = rest.clef === 'treble';
    const baseY = isTreble ? trebleBaseY : bassBaseY;
    const step = isTreble ? trebleLineStep : bassLineStep;

    const line3Y = baseY - 2 * step; // 3ª linha (Linha média da pauta)
    const line4Y = baseY - 3 * step; // 4ª linha da pauta

    const dur = rest.duration;

    if (dur >= 3.5) {
      // 1. Pausa de Semibreve: retângulo suspenso rigorosamente sob a 4ª linha (ocupa a metade superior do 3º espaço)
      ctx.fillRect(restX - 7, line4Y, 14, 6);
    } else if (dur >= 1.75) {
      // 2. Pausa de Mínima: retângulo pousado rigorosamente sobre a 3ª linha (ocupa a metade inferior do 3º espaço)
      ctx.fillRect(restX - 7, line3Y - 6, 14, 6);
    } else if (dur >= 0.75) {
      // 3. Pausa de Semínima: glifo clássico em raio/zigue-zague com curva inferior
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'miter';
      ctx.beginPath();
      ctx.moveTo(restX - 3, line3Y - 14);
      ctx.lineTo(restX + 4, line3Y - 6);
      ctx.lineTo(restX - 4, line3Y + 2);
      ctx.lineTo(restX + 3, line3Y + 9);
      ctx.arc(restX - 1, line3Y + 12, 3, 0, Math.PI);
      ctx.stroke();
      ctx.fill();
    } else if (dur >= 0.35) {
      // 4. Pausa de Colcheia (𝄾): haste inclinada com gancho curvado e ponto circular no 3º espaço
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(restX - 4, line3Y - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(restX - 4, line3Y - 4);
      ctx.quadraticCurveTo(restX + 3, line3Y - 7, restX + 2, line3Y - 12);
      ctx.lineTo(restX - 3, line3Y + 12);
      ctx.stroke();
    } else {
      // 5. Pausa de Semicolcheia (𝄿): haste inclinada com dois ganchos paralelos
      ctx.lineWidth = 1.8;
      // Gancho 1
      ctx.beginPath();
      ctx.arc(restX - 4, line3Y - 7, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(restX - 4, line3Y - 7);
      ctx.quadraticCurveTo(restX + 3, line3Y - 9, restX + 2, line3Y - 13);
      ctx.stroke();
      // Gancho 2
      ctx.beginPath();
      ctx.arc(restX - 5, line3Y + 1, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(restX - 5, line3Y + 1);
      ctx.quadraticCurveTo(restX + 2, line3Y - 1, restX + 1, line3Y - 5);
      ctx.stroke();
      // Haste principal
      ctx.beginPath();
      ctx.moveTo(restX + 2, line3Y - 13);
      ctx.lineTo(restX - 4, line3Y + 14);
      ctx.stroke();
    }

    ctx.restore();
  });
}
