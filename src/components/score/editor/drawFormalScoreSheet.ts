/**
 * editor/drawFormalScoreSheet.ts
 * Renderizador de Partitura Formal Clássica (Grand Staff) para o Editor de Partituras.
 * Regra: Função pura de renderização Canvas (< 190 linhas).
 */

import type { FormalScoreNote, ScoreSheetRenderOptions } from './scoreSheetTypes';

interface DrawSheetParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  notes: FormalScoreNote[];
  timeSignature: [number, number];
  playheadBeat: number | null;
  selectedNoteId: string | null;
  options: ScoreSheetRenderOptions;
  totalMeasures: number;
  beatsPerMeasure: number;
  scrollLeft: number;
}

const START_X = 95;
const MIDDLE_C_Y = 138;
const NOTE_STEP = 6; // metade do espaçamento de linha (12px)

function getDiatonicY(noteName: string): number {
  const match = noteName.match(/^([A-G])([#b♭♯]?)(\d+)$/i);
  if (!match) return MIDDLE_C_Y;
  const letter = match[1].toUpperCase();
  const octave = parseInt(match[3], 10);
  const letterSteps: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const diatonicIndex = (octave - 4) * 7 + (letterSteps[letter] ?? 0);
  return MIDDLE_C_Y - diatonicIndex * NOTE_STEP;
}

export function drawFormalScoreSheet({
  ctx,
  width,
  height,
  notes,
  timeSignature,
  playheadBeat,
  selectedNoteId,
  options,
  totalMeasures,
  beatsPerMeasure,
  scrollLeft,
}: DrawSheetParams): void {
  const isPaper = options.theme === 'paper';
  const { pixelsPerBeat } = options;

  // 1. Fundo
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = isPaper ? '#fcfbf7' : '#0a0a1a';
  ctx.fillRect(0, 0, width, height);

  // 2. Pentagrama Superior (Clave de Sol) e Inferior (Clave de Fá)
  const trebleLinesY = [78, 90, 102, 114, 126];
  const bassLinesY = [150, 162, 174, 186, 198];
  const staffColor = isPaper ? '#18181b' : '#475569';

  ctx.strokeStyle = staffColor;
  ctx.lineWidth = 1.2;

  // Linhas horizontais do pentagrama
  [...trebleLinesY, ...bassLinesY].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
  });

  // Linha grossa e chave esquerda conectando ambos os pentagramas
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, trebleLinesY[0]);
  ctx.lineTo(20, bassLinesY[bassLinesY.length - 1]);
  ctx.stroke();

  // Símbolos de Clave fixos na margem esquerda
  ctx.fillStyle = isPaper ? '#09090b' : '#818cf8';
  ctx.font = 'bold 38px serif';
  ctx.fillText('𝄞', 30, 122);

  ctx.fillStyle = isPaper ? '#09090b' : '#a78bfa';
  ctx.font = 'bold 32px serif';
  ctx.fillText('𝄢', 32, 180);

  // Fórmula de Compasso (ex: 4/4)
  const [num, den] = timeSignature;
  ctx.fillStyle = isPaper ? '#1e293b' : '#e2e8f0';
  ctx.font = 'bold 20px "JetBrains Mono", serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${num}`, 72, 100);
  ctx.fillText(`${den}`, 72, 122);
  ctx.fillText(`${num}`, 72, 172);
  ctx.fillText(`${den}`, 72, 194);

  // 3. Barras de Compasso e Numeração
  for (let m = 0; m <= totalMeasures; m++) {
    const barX = START_X + m * beatsPerMeasure * pixelsPerBeat - scrollLeft;
    if (barX < 20 || barX > width + 40) continue;

    ctx.strokeStyle = isPaper ? '#64748b' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(barX, trebleLinesY[0]);
    ctx.lineTo(barX, bassLinesY[bassLinesY.length - 1]);
    ctx.stroke();

    if (m < totalMeasures && options.showMeasureNumbers) {
      ctx.fillStyle = isPaper ? '#475569' : '#94a3b8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`c.${m + 1}`, barX + 6, 68);
    }
  }

  // 4. Desenho das Notas Musicais
  notes.forEach(note => {
    const noteX = START_X + note.beat * pixelsPerBeat - scrollLeft;
    if (noteX < -30 || noteX > width + 40) return;

    const noteY = getDiatonicY(note.noteName);
    const isSelected = note.id === selectedNoteId;
    const dur = note.duration;
    const isWhole = dur >= 3.5;
    const isHalf = dur >= 1.75 && dur < 3.5;

    ctx.save();

    // Spotlight / Destaque de Nota Selecionada
    if (isSelected) {
      ctx.fillStyle = isPaper ? 'rgba(99, 102, 241, 0.25)' : 'rgba(129, 140, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(noteX, noteY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Linhas Suplementares (Ledger lines)
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = staffColor;
    if (Math.abs(noteY - MIDDLE_C_Y) < 3) {
      // Dó Central (C4)
      ctx.beginPath();
      ctx.moveTo(noteX - 12, MIDDLE_C_Y);
      ctx.lineTo(noteX + 12, MIDDLE_C_Y);
      ctx.stroke();
    } else if (noteY < trebleLinesY[0]) {
      // Acima da Clave de Sol
      for (let ly = trebleLinesY[0] - 12; ly >= noteY - 1; ly -= 12) {
        ctx.beginPath();
        ctx.moveTo(noteX - 12, ly);
        ctx.lineTo(noteX + 12, ly);
        ctx.stroke();
      }
    } else if (noteY > bassLinesY[bassLinesY.length - 1]) {
      // Abaixo da Clave de Fá
      for (let ly = bassLinesY[bassLinesY.length - 1] + 12; ly <= noteY + 1; ly += 12) {
        ctx.beginPath();
        ctx.moveTo(noteX - 12, ly);
        ctx.lineTo(noteX + 12, ly);
        ctx.stroke();
      }
    }

    // Acidente musical (♯ ou ♭)
    if (note.noteName.includes('#') || note.noteName.includes('♯')) {
      ctx.fillStyle = isPaper ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 16px serif';
      ctx.textAlign = 'right';
      ctx.fillText('♯', noteX - 8, noteY + 5);
    } else if (note.noteName.includes('b') || note.noteName.includes('♭')) {
      ctx.fillStyle = isPaper ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 16px serif';
      ctx.textAlign = 'right';
      ctx.fillText('♭', noteX - 8, noteY + 4);
    }

    // Cabeça da Nota
    const noteColor = isSelected ? '#6366f1' : isPaper ? '#09090b' : '#e2e8f0';
    ctx.fillStyle = noteColor;
    ctx.strokeStyle = noteColor;

    ctx.beginPath();
    ctx.ellipse(noteX, noteY, 8, 5.5, -Math.PI / 8, 0, Math.PI * 2);
    if (isWhole || isHalf) {
      ctx.lineWidth = 2.2;
      ctx.stroke();
    } else {
      ctx.fill();
    }

    // Haste (Stem) se não for semibreve
    if (!isWhole) {
      const isUp = noteY > 114;
      const stemX = isUp ? noteX + 7 : noteX - 7;
      const stemY = isUp ? noteY - 30 : noteY + 30;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(stemX, noteY);
      ctx.lineTo(stemX, stemY);
      ctx.stroke();

      // Bandeirola para colcheias / semicolcheias
      if (dur <= 0.5) {
        ctx.beginPath();
        ctx.moveTo(stemX, stemY);
        ctx.quadraticCurveTo(stemX + 8, stemY + 10, stemX + 2, stemY + 18);
        ctx.stroke();
      }
    }

    // Rótulo da Nota (opcional)
    if (options.showNoteNames) {
      ctx.fillStyle = isPaper ? '#475569' : '#94a3b8';
      ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(note.noteName, noteX, noteY > 138 ? noteY + 18 : noteY - 14);
    }

    ctx.restore();
  });

  // 5. Cursor de Reprodução (Playhead)
  if (playheadBeat !== null) {
    const playheadX = START_X + playheadBeat * pixelsPerBeat - scrollLeft;
    ctx.save();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(playheadX, 50);
    ctx.lineTo(playheadX, 220);
    ctx.stroke();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(playheadX, 50, 4.5, 0, Math.PI * 2);
    ctx.arc(playheadX, 220, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
