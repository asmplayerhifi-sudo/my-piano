/**
 * scrolling/drawScoreNotes.ts
 * Renderização das notas musicais, hastes, acidentes (#/b) e dedilhado.
 * Regra: Renderização pura (< 160 linhas).
 */

import type { ScoreNote } from '../../../core/coursesData';
import { getNoteInfo } from '../../../core/musicTheory';
import type { DisplayOptions, ScoreTheme, ScoreErrorEvent } from './types';
import { SCORE_GEOMETRY, drawRoundedPill, getNoteY, getScoreNoteFingering } from './scoreGeometry';
import { buildBeamGroups, renderBeamGroup } from '../scoreBeaming';
import type { BeamCandidate } from '../scoreBeaming';

interface DrawNotesParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  notes: ScoreNote[];
  theme: ScoreTheme;
  displayOptions: DisplayOptions;
  noteOffsets: number[];
  currentIndex: number;
  attackLineX: number;
  scrollOffset: number;
  pixelsPerBeat: number;
  instrument: 'piano' | 'guitar';
  isDemoMode: boolean;
  lastError?: ScoreErrorEvent | null;
}

export function drawScoreNotes({
  ctx,
  width,
  notes,
  theme,
  displayOptions,
  noteOffsets,
  currentIndex,
  attackLineX,
  scrollOffset,
  pixelsPerBeat,
  instrument,
  isDemoMode,
  lastError,
}: DrawNotesParams): void {
  const isTrad = theme === 'traditional';
  const { middleCY, trebleBaseY, trebleLineStep, trebleNoteNameY, trebleFingerY, bassTopY, bassBaseY, bassLineStep, bassNoteNameY, bassFingerY } = SCORE_GEOMETRY;
  const beamCandidates: BeamCandidate[] = [];

  notes.forEach((note, idx) => {
    const noteOffset = noteOffsets[idx] ?? 0;
    const noteX = attackLineX + noteOffset * pixelsPerBeat - scrollOffset;
    const noteY = getNoteY(note.midi, note.clef);
    const isCurrentTarget = isDemoMode ? Math.abs(noteX - attackLineX) <= 14 : idx === currentIndex;
    const hasPassed = isDemoMode ? noteX < attackLineX - 11 : idx < currentIndex;
    const isMiddleC = note.midi === 60;
    const dur = note.duration || 1;

    let noteAlpha = 1.0;
    if (noteX < attackLineX - 11) {
      noteAlpha = Math.max(0, 1 - (attackLineX - 11 - noteX) / 70) * 0.45;
    }

    if (noteAlpha <= 0.01 || noteX <= -40 || noteX >= width + 60) return;

    const rx = Math.round(noteX);
    const ry = Math.round(noteY);
    ctx.save();
    ctx.globalAlpha = noteAlpha;

    const isErrorTarget = isCurrentTarget && !!lastError && lastError.expectedMidi === note.midi;

    // Spotlight na nota ativa
    if (isCurrentTarget) {
      if (isErrorTarget) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
        ctx.beginPath();
        ctx.arc(rx, ry, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(rx, ry, 16.5, 0, Math.PI * 2);
        ctx.stroke();

        // Badge ✕ ERRO
        ctx.fillStyle = '#dc2626';
        drawRoundedPill(ctx, rx - 24, ry - 30, 48, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✕ ERRO', rx, ry - 19);
      } else {
        ctx.fillStyle = isTrad ? 'rgba(37, 99, 235, 0.14)' : 'rgba(56, 189, 248, 0.22)';
        ctx.beginPath();
        ctx.arc(rx, ry, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isTrad ? '#2563eb' : '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(rx, ry, 13.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Cores
    let noteColor = isTrad ? '#09090b' : '#e2e8f0';
    if (isErrorTarget) {
      noteColor = '#ef4444'; // Vermelho intenso no alvo quando errada!
    } else if (hasPassed) {
      noteColor = isTrad ? '#64748b' : '#10b981';
    } else if (isCurrentTarget) {
      noteColor = isTrad ? '#2563eb' : '#f43f5e';
    } else if (isMiddleC && !isTrad) {
      noteColor = '#38bdf8';
    }
    ctx.fillStyle = noteColor;
    ctx.strokeStyle = noteColor;

    // Linhas Suplementares Dó Central
    if (isMiddleC) {
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(rx - 16, middleCY);
      ctx.lineTo(rx + 16, middleCY);
      ctx.stroke();
    }

    // Acidentes (# / b)
    if (note.noteName.includes('#')) {
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'right';
      ctx.fillText('♯', rx - 12, ry + 6);
    } else if (note.noteName.includes('b') || note.noteName.includes('♭')) {
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'right';
      ctx.fillText('♭', rx - 12, ry + 5);
    }

    // Cabeça da nota
    const isWhole = dur >= 3.5;
    const isHalf = dur >= 1.75 && dur < 3.5;

    ctx.beginPath();
    ctx.ellipse(rx, ry, 11, 7.5, -Math.PI / 8, 0, Math.PI * 2);
    if (isWhole || isHalf) {
      ctx.lineWidth = 2.8;
      ctx.stroke();
    } else {
      ctx.fill();
    }

    // Ponto de Aumento (Augmentation Dot para notas pontuadas: 1.5, 0.75, 3.0, etc.)
    const isDotted = (dur === 1.5) || (dur === 0.75) || (dur === 3) || (dur === 0.375) || (Math.abs(dur - 1.5) < 0.05) || (Math.abs(dur - 0.75) < 0.05) || (Math.abs(dur - 3.0) < 0.05);
    if (isDotted) {
      const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
      const bY = isBass ? bassBaseY : trebleBaseY;
      const st = isBass ? bassLineStep : trebleLineStep;
      const isOnLine = Math.abs((ry - bY) % st) < 3.5;
      const dotY = isOnLine ? ry - 4 : ry;
      ctx.beginPath();
      ctx.arc(rx + 15, dotY, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Coleta para agrupamento ou desenha haste simples
    const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
    const middleLineMidi = isBass ? 50 : 71; // Linha média: D3 na Clave de Fá, B4 na Clave de Sol
    const isUpStem = note.midi < middleLineMidi; // Abaixo da 3ª linha: haste para cima; na/acima da 3ª linha: para baixo

    if (dur <= 0.75) {
      beamCandidates.push({
        id: `${idx}`,
        x: rx,
        y: ry,
        duration: dur,
        beat: note.beat ?? noteOffset,
        clef: note.clef || (note.midi < 60 ? 'bass' : 'treble'),
        color: noteColor,
        alpha: noteAlpha,
      });
    } else if (!isWhole) {
      const stemX = isUpStem ? rx + 9.5 : rx - 9.5;
      const stemYEnd = isUpStem ? ry - 38 : ry + 38;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(stemX, ry);
      ctx.lineTo(stemX, stemYEnd);
      ctx.stroke();
    }

    // Nome da Nota e Dedilhado
    const isBassClef = note.clef === 'bass' || (!note.clef && note.midi < 60);
    const nameY = isBassClef ? bassNoteNameY : trebleNoteNameY;
    const fingerY = isBassClef ? bassFingerY : trebleFingerY;

    if (displayOptions.showNoteNames) {
      ctx.fillStyle = isTrad ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      const nInfo = getNoteInfo(note.midi);
      ctx.fillText(`${nInfo.name}${nInfo.octave}`, rx, nameY);
    }

    if (displayOptions.showFingering) {
      const fingering = getScoreNoteFingering(note, instrument);
      if (fingering) {
        ctx.fillStyle = fingering.color;
        drawRoundedPill(ctx, rx - 9, fingerY - 8, 18, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fingering.label, rx, fingerY + 3.5);
      }
    }

    ctx.restore();
  });

  // Agrupamento de Figuras Rítmicas (Beaming de Colcheias e Semicolcheias)
  if (beamCandidates.length > 0) {
    const defaultColor = isTrad ? '#09090b' : '#e2e8f0';
    const beamGroups = buildBeamGroups(beamCandidates, {
      getMiddleLineY: (clef) => clef === 'treble'
        ? trebleBaseY - 2 * trebleLineStep
        : bassTopY + 2 * bassLineStep,
      stemOffset: 10,
      minStemLength: 36,
      beamThickness: 4.2,
      beatsPerMeasure: 4,
    });

    beamGroups.forEach(group => {
      renderBeamGroup(ctx, group, defaultColor, 2.0);
    });
  }

  // Projeta a nota tocada incorretamente em vermelho na linha de ataque para o aluno ver o erro
  if (lastError && (performance.now() - lastError.timestamp < 1400)) {
    const playedClef = lastError.playedMidi < 60 ? 'bass' : 'treble';
    const playedY = getNoteY(lastError.playedMidi, playedClef);
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;

    // Cabeça de nota tocada errada destacada em vermelho vivo
    ctx.beginPath();
    ctx.ellipse(attackLineX, playedY, 12, 8, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rótulo da nota errada tocada
    const pInfo = getNoteInfo(lastError.playedMidi);
    ctx.fillStyle = '#dc2626';
    drawRoundedPill(ctx, attackLineX - 44, playedY - (playedClef === 'bass' ? -14 : 28), 88, 17, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`✕ Tocou ${pInfo.name}${pInfo.octave}`, attackLineX, playedY - (playedClef === 'bass' ? -26 : 16));
    ctx.restore();
  }
}
