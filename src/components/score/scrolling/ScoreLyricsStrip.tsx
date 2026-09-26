/**
 * ScoreLyricsStrip.tsx
 *
 * Faixa de letra integrada imediatamente acima da partitura deslizante.
 *
 * Modos de renderização (baseados no syncLevel do EnrichedLyricLine):
 *
 * 1. 'synchronized' (≥ 90% das sílabas associadas a notas):
 *    - Cada sílaba é posicionada diretamente na X da sua nota (beatToCanvasX)
 *    - Hifenização visual entre sílabas de begin/middle/end
 *    - Linha de melisma (___) quando hasMelisma = true
 *    - Destaque amarelo na sílaba exatamente ativa (isSyllableActive)
 *    - Sílabas 'unresolved'/'pending_validation' em cor laranja/âmbar
 *
 * 2. 'partial' (50–89%):
 *    - Palavras posicionadas pelo beat da primeira sílaba
 *    - Sílabas unresolved renderizadas em cor diferente
 *    - Destaque por palavra (não por sílaba individual)
 *
 * 3. 'text_only' (< 50%):
 *    - Comportamento equivalente ao ScoreLyricsStrip original
 *    - Texto completo por linha, sem granularidade silábica
 *
 * Sincronização: lê scrollOffsetRef e currentBeatRef a cada RAF — sem timer
 * independente, garantindo zero drift em playback, pausa, seek e Modo Prática.
 *
 * Compatibilidade: aceita tanto EnrichedLyricLine[] quanto LyricLine[] (legado).
 */

import React, { useRef, useEffect, useCallback } from 'react';
import type { LyricLine } from '../../../core/repertoireTypes';
import type { EnrichedLyricLine } from '../../../core/lyricSyllableTypes';
import { findActiveSyllable } from '../../../core/lyricSyllableTypes';

// ─── Tipos Públicos ────────────────────────────────────────────────────────────

export interface ScoreLyricsStripProps {
  /**
   * Linhas de letra enriquecidas (preferencial) ou legadas.
   * Aceita ambos os formatos — o componente detecta automaticamente o tipo.
   */
  lyrics: LyricLine[] | EnrichedLyricLine[];
  /** Ref compartilhada ao offset de rolagem do canvas (px). Lida a cada RAF. */
  scrollOffsetRef: React.MutableRefObject<number>;
  /** Pixels por beat — mesmo valor de ScrollingScoreCanvas (140). */
  pixelsPerBeat: number;
  /** Batidas por compasso derivadas de useScoreTimeline. */
  beatsPerMeasure: number;
  /** X da linha de ataque — mesmo que SCORE_GEOMETRY.attackLineX (145). */
  attackLineX: number;
  /** Beat absoluto atual (1-indexed). Lido a cada RAF via ref. */
  currentBeatRef: React.MutableRefObject<number>;
  /** Indica se a reprodução ou prática está ativa (controla opacidade / linha de ataque). */
  isActive: boolean;
  /** Largura do container em CSS px — observada pelo ResizeObserver do pai. */
  containerWidth: number;
}

// ─── Type Guard ───────────────────────────────────────────────────────────────

function isEnrichedLine(line: LyricLine | EnrichedLyricLine): line is EnrichedLyricLine {
  return 'syllables' in line && Array.isArray((line as EnrichedLyricLine).syllables);
}

// ─── Paleta ───────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  chorus:       '#a78bfa',
  verse:        '#7dd3fc',
  bridge:       '#6ee7b7',
  intro:        '#94a3b8',
  outro:        '#94a3b8',
  instrumental: '#475569',
};

const COLOR_DEFAULT        = '#cbd5e1';
const COLOR_ACTIVE_LINE    = '#ffffff';
const COLOR_ACTIVE_SYLLABLE = '#fde68a';   // Amarelo — sílaba ativa (nota exata)
const COLOR_ACTIVE_WORD    = '#fbbf24';    // Âmbar — palavra ativa (modo partial)
const COLOR_UNRESOLVED     = '#fb923c';    // Laranja — sílaba sem associação musical
const COLOR_PENDING        = '#f59e0b';    // Âmbar-escuro — pending validation
const COLOR_MELISMA        = '#818cf8';    // Índigo suave — linha de melisma
const STRIP_HEIGHT_CSS     = 42;
const FADE_WIDTH           = 52;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function beatToCanvasX(startBeat: number, pixelsPerBeat: number, attackLineX: number): number {
  return attackLineX + (startBeat - 1) * pixelsPerBeat;
}

function slotWidthPx(
  line: LyricLine,
  nextLine: LyricLine | undefined,
  pixelsPerBeat: number,
  beatsPerMeasure: number
): number {
  const end = nextLine ? nextLine.startBeat : (line.endBeat || line.startBeat + beatsPerMeasure);
  return Math.max(1, end - line.startBeat) * pixelsPerBeat;
}

/** Desenha um hífen musical entre sílabas no canvas */
function drawHyphen(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.60;
  ctx.font = 'bold 10px Inter, system-ui';
  ctx.textBaseline = 'middle';
  ctx.fillText('-', x, y);
  ctx.globalAlpha = 1;
  ctx.restore();
}

/** Desenha uma linha de melisma (___) de startX até endX */
function drawMelismaLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  endX: number,
  y: number
): void {
  if (endX <= startX + 4) return;
  ctx.save();
  ctx.strokeStyle = COLOR_MELISMA;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(startX + 2, y + 3);
  ctx.lineTo(endX - 2, y + 3);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── Renderização Modo SYNCHRONIZED ──────────────────────────────────────────

function drawSynchronizedLine(
  ctx: CanvasRenderingContext2D,
  dpr: number,
  line: EnrichedLyricLine,
  scrollOff: number,
  beatNow: number,
  pixelsPerBeat: number,
  attackLineX: number,
  cssW: number,
  midY: number
): void {
  const activeSyllable = findActiveSyllable(line.syllables, beatNow);

  for (let si = 0; si < line.syllables.length; si++) {
    const syl = line.syllables[si];
    if (!syl.noteRef.absoluteBeat) continue;

    const xWorld  = beatToCanvasX(syl.noteRef.absoluteBeat, pixelsPerBeat, attackLineX);
    const xScreen = xWorld - scrollOff;

    // Descarte fora do viewport
    if (xScreen < -80 || xScreen > cssW + 20) continue;

    const isThisSylActive = activeSyllable?.id === syl.id;
    const fsize = 12;

    // ── Cor por estado ──────────────────────────────────────────────────────
    let color: string;
    let alpha: number;
    let fontWeight: string;

    if (isThisSylActive) {
      color = COLOR_ACTIVE_SYLLABLE;
      alpha = 1;
      fontWeight = '700';
    } else if (syl.state === 'unresolved') {
      color = COLOR_UNRESOLVED;
      alpha = 0.70;
      fontWeight = '400';
    } else if (syl.state === 'pending_validation') {
      color = COLOR_PENDING;
      alpha = 0.75;
      fontWeight = '400';
    } else {
      // confirmed ou inferred
      color = line.lineType ? (TYPE_COLORS[line.lineType] ?? COLOR_DEFAULT) : COLOR_DEFAULT;
      alpha = 0.55;
      fontWeight = '400';
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.font = `${fontWeight} ${fsize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.textBaseline = 'middle';
    ctx.fillText(syl.text, xScreen, midY);

    const textW = ctx.measureText(syl.text).width;
    ctx.globalAlpha = 1;
    ctx.restore();

    // ── Hífen entre sílabas da mesma palavra ───────────────────────────────
    if ((syl.syllabic === 'begin' || syl.syllabic === 'middle') && si < line.syllables.length - 1) {
      const nextSyl = line.syllables[si + 1];
      if (nextSyl.wordId === syl.wordId && nextSyl.noteRef.absoluteBeat) {
        const nextX = beatToCanvasX(nextSyl.noteRef.absoluteBeat, pixelsPerBeat, attackLineX) - scrollOff;
        const hyphenX = xScreen + textW + 1;
        // Só desenha o hífen se houver espaço entre as sílabas
        if (nextX - xScreen - textW > 8) {
          ctx.save();
          ctx.scale(dpr, dpr);
          drawHyphen(ctx, hyphenX, midY, color);
          ctx.restore();
        }
      }
    }

    // ── Linha de melisma ────────────────────────────────────────────────────
    if (syl.hasMelisma && syl.melismaEndBeat) {
      const melismaEndX = beatToCanvasX(syl.melismaEndBeat, pixelsPerBeat, attackLineX) - scrollOff;
      ctx.save();
      ctx.scale(dpr, dpr);
      drawMelismaLine(ctx, xScreen + textW, melismaEndX, midY);
      ctx.restore();
    }
  }
}

// ─── Renderização Modo PARTIAL ────────────────────────────────────────────────

function drawPartialLine(
  ctx: CanvasRenderingContext2D,
  dpr: number,
  line: EnrichedLyricLine,
  scrollOff: number,
  beatNow: number,
  pixelsPerBeat: number,
  attackLineX: number,
  cssW: number,
  midY: number
): void {
  let accumX: number | null = null;

  for (const word of line.structuredWords) {
    const xWorld  = beatToCanvasX(word.startBeat, pixelsPerBeat, attackLineX);
    const xScreen: number = word.startBeat ? xWorld - scrollOff : (accumX ?? 8);

    if (xScreen < -120 || xScreen > cssW + 20) {
      accumX = xScreen;
      continue;
    }

    const isActiveWord = beatNow >= word.startBeat && beatNow < word.endBeat;
    const fsize = 12;

    const color = isActiveWord
      ? COLOR_ACTIVE_WORD
      : (line.lineType ? (TYPE_COLORS[line.lineType] ?? COLOR_DEFAULT) : COLOR_DEFAULT);
    const alpha = isActiveWord ? 1 : 0.52;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.font = `${isActiveWord ? 700 : 400} ${fsize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.textBaseline = 'middle';
    ctx.fillText(word.fullText, xScreen, midY);
    const textW = ctx.measureText(word.fullText).width;
    ctx.globalAlpha = 1;
    ctx.restore();

    accumX = xScreen + textW + 6;
  }
}

// ─── Renderização Modo TEXT_ONLY (legacy) ─────────────────────────────────────

function drawTextOnlyLine(
  ctx: CanvasRenderingContext2D,
  dpr: number,
  line: LyricLine,
  nextLine: LyricLine | undefined,
  scrollOff: number,
  beatNow: number,
  pixelsPerBeat: number,
  beatsPerMeasure: number,
  attackLineX: number,
  cssW: number,
  midY: number,
  cssH: number
): void {
  const xWorld  = beatToCanvasX(line.startBeat, pixelsPerBeat, attackLineX);
  const xScreen = xWorld - scrollOff;
  const slotW   = slotWidthPx(line, nextLine, pixelsPerBeat, beatsPerMeasure);

  if (xScreen + slotW < 0 || xScreen > cssW) return;

  const effectiveEnd = nextLine ? nextLine.startBeat : (line.endBeat || line.startBeat + beatsPerMeasure);
  const isActiveLine = beatNow >= line.startBeat && beatNow < effectiveEnd;
  const typeColor    = line.lineType ? TYPE_COLORS[line.lineType] : undefined;
  const baseColor    = isActiveLine ? COLOR_ACTIVE_LINE : (typeColor || COLOR_DEFAULT);

  // Fundo da linha ativa
  if (isActiveLine) {
    ctx.save();
    ctx.scale(dpr, dpr);
    const grad = ctx.createLinearGradient(xScreen, 0, xScreen + slotW, 0);
    grad.addColorStop(0,   'rgba(99, 102, 241, 0.24)');
    grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.20)');
    grad.addColorStop(1,   'rgba(99, 102, 241, 0.06)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(xScreen + 1, 2, slotW - 2, cssH - 4, 5);
    ctx.fill();
    ctx.restore();
  }

  // Clip
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.beginPath();
  ctx.rect(Math.max(0, xScreen), 0, slotW + Math.min(0, xScreen), cssH);
  ctx.clip();

  if (line.words && line.words.length > 0) {
    const totalSpan = Math.max(1, effectiveEnd - line.startBeat);
    let accumX = xScreen + 8;

    for (let wi = 0; wi < line.words.length; wi++) {
      const word     = line.words[wi];
      const nextWord = line.words[wi + 1];
      const wStart   = word.startBeat ?? (line.startBeat + (wi / line.words.length) * totalSpan);
      const wEnd     = word.endBeat ?? (nextWord?.startBeat ?? effectiveEnd);
      const isActiveWd = isActiveLine && beatNow >= wStart && beatNow < wEnd;

      const renderX = word.startBeat !== undefined
        ? (beatToCanvasX(wStart, pixelsPerBeat, attackLineX) - scrollOff)
        : accumX;

      const fsize = cssH > 38 ? 13 : 11;
      ctx.font        = `${isActiveWd ? 700 : 500} ${fsize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle   = isActiveWd ? COLOR_ACTIVE_WORD : baseColor;
      ctx.globalAlpha = isActiveWd ? 1 : (isActiveLine ? 0.90 : 0.50);
      ctx.textBaseline = 'middle';
      ctx.fillText(word.text, renderX, midY);
      ctx.globalAlpha = 1;

      if (word.startBeat === undefined) {
        accumX += ctx.measureText(word.text).width + 5;
      }
    }
  } else {
    const fsize = cssH > 38 ? 13 : 11;
    ctx.font        = `${isActiveLine ? 600 : 400} ${fsize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle   = baseColor;
    ctx.globalAlpha = isActiveLine ? 1 : 0.46;
    ctx.textBaseline = 'middle';

    const pad = 10;
    let txt   = line.text;
    const maxW = slotW - pad * 2;
    if (maxW > 20 && ctx.measureText(txt).width > maxW) {
      while (txt.length > 1 && ctx.measureText(txt + '\u2026').width > maxW) {
        txt = txt.slice(0, -1);
      }
      txt += '\u2026';
    }
    ctx.fillText(txt, xScreen + pad, midY);
  }
  ctx.restore();

  // Divisor de linha
  if (!isActiveLine && xScreen > FADE_WIDTH && xScreen < cssW - FADE_WIDTH) {
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(xScreen, cssH * 0.25);
    ctx.lineTo(xScreen, cssH * 0.80);
    ctx.stroke();
    ctx.restore();
  }
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export const ScoreLyricsStrip: React.FC<ScoreLyricsStripProps> = ({
  lyrics,
  scrollOffsetRef,
  pixelsPerBeat,
  beatsPerMeasure,
  attackLineX,
  currentBeatRef,
  isActive,
  containerWidth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef    = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !lyrics || lyrics.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr  = window.devicePixelRatio || 1;
    const cw   = canvas.width;
    const ch   = canvas.height;
    const cssW = cw / dpr;
    const cssH = ch / dpr;
    const midY = cssH * 0.58;

    ctx.clearRect(0, 0, cw, ch);

    // ── Fundo ────────────────────────────────────────────────────────────────
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = 'rgba(9, 8, 20, 0.62)';
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.22)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(cssW, 0.5);
    ctx.stroke();
    ctx.restore();

    const scrollOff = scrollOffsetRef.current;
    const beatNow   = currentBeatRef.current;

    // ── Renderiza cada linha conforme seu tipo ───────────────────────────────
    for (let i = 0; i < lyrics.length; i++) {
      const rawLine = lyrics[i];

      if (isEnrichedLine(rawLine)) {
        const enriched = rawLine as EnrichedLyricLine;

        // Fundo de linha ativa para modos synchronized/partial
        const nextEnriched = lyrics[i + 1] as EnrichedLyricLine | undefined;
        const effectiveEnd = nextEnriched ? nextEnriched.startBeat : enriched.endBeat;
        const isActiveLine = beatNow >= enriched.startBeat && beatNow < effectiveEnd;

        if (isActiveLine) {
          const xWorld  = beatToCanvasX(enriched.startBeat, pixelsPerBeat, attackLineX);
          const xScreen = xWorld - scrollOff;
          const slotW   = Math.max(1, effectiveEnd - enriched.startBeat) * pixelsPerBeat;

          ctx.save();
          ctx.scale(dpr, dpr);
          const grad = ctx.createLinearGradient(xScreen, 0, xScreen + slotW, 0);
          grad.addColorStop(0,   'rgba(99, 102, 241, 0.18)');
          grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.14)');
          grad.addColorStop(1,   'rgba(99, 102, 241, 0.04)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(xScreen + 1, 2, slotW - 2, cssH - 4, 5);
          ctx.fill();
          ctx.restore();
        }

        // Escolhe o modo de renderização pelo syncLevel da linha
        const syncLevel = enriched.enrichmentState;

        if (syncLevel === 'complete' || syncLevel === 'partial') {
          if (enriched.syncConfidence >= 90) {
            drawSynchronizedLine(ctx, dpr, enriched, scrollOff, beatNow, pixelsPerBeat, attackLineX, cssW, midY);
          } else {
            drawPartialLine(ctx, dpr, enriched, scrollOff, beatNow, pixelsPerBeat, attackLineX, cssW, midY);
          }
        } else {
          // 'text_only' ou 'unresolved' — renderiza como texto simples
          const legacyLine: LyricLine = {
            text: enriched.text,
            startBeat: enriched.startBeat,
            endBeat: enriched.endBeat,
            startMeasure: enriched.startMeasure,
            lineType: enriched.lineType,
            words: enriched.structuredWords.map(w => ({
              text: w.fullText,
              startBeat: w.startBeat,
              endBeat: w.endBeat,
            })),
          };
          const nextLegacy = nextEnriched ? {
            text: nextEnriched.text,
            startBeat: nextEnriched.startBeat,
            endBeat: nextEnriched.endBeat,
            startMeasure: nextEnriched.startMeasure,
          } as LyricLine : undefined;
          drawTextOnlyLine(ctx, dpr, legacyLine, nextLegacy, scrollOff, beatNow, pixelsPerBeat, beatsPerMeasure, attackLineX, cssW, midY, cssH);
        }
      } else {
        // ── Modo legado: LyricLine[] sem enriquecimento ─────────────────────
        const legacyLine = rawLine as LyricLine;
        const nextLegacy = lyrics[i + 1] as LyricLine | undefined;
        drawTextOnlyLine(ctx, dpr, legacyLine, nextLegacy, scrollOff, beatNow, pixelsPerBeat, beatsPerMeasure, attackLineX, cssW, midY, cssH);
      }
    }

    // ── Linha de ataque ──────────────────────────────────────────────────────
    if (isActive) {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.50)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(attackLineX, 3);
      ctx.lineTo(attackLineX, cssH - 3);
      ctx.stroke();
      ctx.restore();
    }

    // ── Fade lateral ─────────────────────────────────────────────────────────
    ctx.save();
    ctx.scale(dpr, dpr);
    const gradL = ctx.createLinearGradient(0, 0, FADE_WIDTH, 0);
    gradL.addColorStop(0, 'rgba(9, 8, 20, 0.94)');
    gradL.addColorStop(1, 'rgba(9, 8, 20, 0)');
    ctx.fillStyle = gradL;
    ctx.fillRect(0, 0, FADE_WIDTH, cssH);

    const gradR = ctx.createLinearGradient(cssW - FADE_WIDTH, 0, cssW, 0);
    gradR.addColorStop(0, 'rgba(9, 8, 20, 0)');
    gradR.addColorStop(1, 'rgba(9, 8, 20, 0.94)');
    ctx.fillStyle = gradR;
    ctx.fillRect(cssW - FADE_WIDTH, 0, FADE_WIDTH, cssH);
    ctx.restore();
  }, [lyrics, scrollOffsetRef, pixelsPerBeat, beatsPerMeasure, attackLineX, currentBeatRef, isActive]);

  // ── Loop RAF ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    let active = true;
    const loop = () => {
      if (!active) return;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // ── Ajuste DPR ao redimensionar ───────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width        = Math.round(containerWidth * dpr);
    canvas.height       = Math.round(STRIP_HEIGHT_CSS * dpr);
    canvas.style.width  = `${containerWidth}px`;
    canvas.style.height = `${STRIP_HEIGHT_CSS}px`;
  }, [containerWidth]);

  if (!lyrics || lyrics.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-label="Letra sincronizada com a partitura — sílabas associadas às notas"
      className="block w-full"
      style={{ height: STRIP_HEIGHT_CSS }}
    />
  );
};
