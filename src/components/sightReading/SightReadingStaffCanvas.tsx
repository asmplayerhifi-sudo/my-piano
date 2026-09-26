/**
 * components/sightReading/SightReadingStaffCanvas.tsx
 *
 * Palco Gráfico em Canvas Retina de Alta Fidelidade para Treino de Leitura de Partitura.
 * Suporta:
 *  - Clave de Sol (Treble), Clave de Fá (Bass) e Pauta Dupla (Grand Staff).
 *  - Armaduras de Clave (Sustenidos e Bemóis nas linhas/espaços correspondentes).
 *  - Fórmulas de Compasso (2/4, 3/4, 4/4, 6/8).
 *  - Figuras Rítmicas (Semibreve, Mínima, Semínima, Colcheia com bandeirola).
 *  - Contagem Temporal sob a pauta (1, 2, 3, 4).
 *  - Cursor de Leitura / Linha Temporal Determinística (Requisito 3).
 *  - Linhas Suplementares superiores e inferiores automáticas.
 *  - Efeitos visuais dinâmicos: Glow na nota alvo, Acerto (Verde Neon) e Erro (Vermelho Pulsante).
 *  - Modos: Nota Única, Intervalos, Sequências Melódicas e Acordes Polifônicos.
 *  - Dicas pedagógicas opcionais (Nomes de Notas e posição na pauta).
 */

import React, { useRef, useEffect, useState } from 'react';
import type { SightReadingExercise, SightReadingNote } from '../../core/sightReadingEngine';
import { getFormattedNoteName } from '../../core/sightReadingEngine';

export interface SightReadingStaffCanvasProps {
  exercise: SightReadingExercise;
  activeNoteIndex: number; // Para sequências e acordes (índice da nota sendo esperada)
  feedbackState: 'idle' | 'correct' | 'wrong';
  showNoteHints: boolean;
  showStaffPositionHints: boolean;
  showBeatCount?: boolean;
  cursorProgress?: number; // 0.0 a 1.0 (posição temporal contínua e determinística)
  isTemporalActive?: boolean;
}

const STEP_Y = 6; // 6px por semitono/passo diatônico (12px entre linhas da pauta)

/** Mapeamento de passos diatônicos em relação à 1ª linha */
const LETTER_STEPS: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/** Calcula a posição Y da nota baseada na clave e altura */
function calculateNoteY(
  note: SightReadingNote,
  trebleLine1Y: number,
  bassLine1Y: number
): number {
  const letterIndex = LETTER_STEPS[note.pitchLetter] ?? 0;
  // Extrai oitava aproximada a partir do MIDI
  const approxOctave = Math.floor(note.midi / 12) - 1; // MIDI 60 = 4 (C4)

  if (note.clef === 'treble') {
    // 1ª Linha da Clave de Sol = E4
    const diatonicDiff = (approxOctave - 4) * 7 + letterIndex - 2;
    return trebleLine1Y - diatonicDiff * STEP_Y;
  } else {
    // 1ª Linha da Clave de Fá = G2
    const diatonicDiff = (approxOctave - 2) * 7 + letterIndex - 4;
    return bassLine1Y - diatonicDiff * STEP_Y;
  }
}

export const SightReadingStaffCanvas: React.FC<SightReadingStaffCanvasProps> = ({
  exercise,
  activeNoteIndex,
  feedbackState,
  showNoteHints,
  showStaffPositionHints,
  showBeatCount = true,
  cursorProgress,
  isTemporalActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Observa largura do contêiner para responsividade plena
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(Math.floor(entries[0].contentRect.width));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isGrandStaff = exercise.clef === 'grand';
  const canvasHeight = isGrandStaff ? 340 : 240;

  // Coordenadas das 1ªs linhas (linhas inferiores da pauta de 5 linhas)
  const trebleLine1Y = isGrandStaff ? 115 : 140;
  const bassLine1Y = isGrandStaff ? 255 : 140;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // ── 1. Fundo do Palco ──────────────────────────────────────────────────
    ctx.clearRect(0, 0, containerWidth, canvasHeight);

    // Gradiente sutil Dark Hi-Fi
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGradient.addColorStop(0, '#090a16');
    bgGradient.addColorStop(1, '#0e0f22');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, containerWidth, canvasHeight);

    // Borda exterior suave
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, containerWidth, canvasHeight);

    // ── 2. Desenho das Pautas (5 Linhas) ───────────────────────────────────
    const staffStartX = 36;
    const staffEndX = containerWidth - 36;

    const drawStaffLines = (line1Y: number) => {
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)'; // Linhas em cinza claro translúcido nítido
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 5; i++) {
        const y = line1Y - i * (STEP_Y * 2);
        ctx.beginPath();
        ctx.moveTo(staffStartX, y);
        ctx.lineTo(staffEndX, y);
        ctx.stroke();
      }
    };

    if (isGrandStaff) {
      drawStaffLines(trebleLine1Y);
      drawStaffLines(bassLine1Y);

      // Chave / Chave do Grand Staff na lateral esquerda
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(staffStartX, trebleLine1Y - 48);
      ctx.lineTo(staffStartX, bassLine1Y);
      ctx.stroke();

      // Símbolo de chave decorativa
      ctx.font = '28px serif';
      ctx.fillStyle = '#818cf8';
      ctx.fillText('{', staffStartX - 22, (trebleLine1Y + bassLine1Y) / 2 + 10);
    } else if (exercise.clef === 'treble') {
      drawStaffLines(trebleLine1Y);
    } else {
      drawStaffLines(bassLine1Y);
    }

    // ── 3. Claves Musicais Oficiais (Unicode Alta Definição) ────────────────
    const clefX = staffStartX + 16;

    if (isGrandStaff || exercise.clef === 'treble') {
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 50px serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      // Clave de Sol 𝄞 centrada na 2ª linha
      ctx.fillText('𝄞', clefX, trebleLine1Y - 14);
    }

    if (isGrandStaff || exercise.clef === 'bass') {
      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 42px serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      // Clave de Fá 𝄢 centrada na 4ª linha
      ctx.fillText('𝄢', clefX, bassLine1Y - 34);
    }

    // Barra inicial da pauta
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(staffStartX, isGrandStaff ? trebleLine1Y - 48 : (exercise.clef === 'treble' ? trebleLine1Y - 48 : bassLine1Y - 48));
    ctx.lineTo(staffStartX, isGrandStaff ? bassLine1Y : (exercise.clef === 'treble' ? trebleLine1Y : bassLine1Y));
    ctx.stroke();

    // ── 3.1 Armadura de Clave (Requisito 2) ─────────────────────────────────
    let currentX = clefX + 38;
    const keySig = exercise.keySignature;

    if (keySig && keySig.accidentalsCount > 0) {
      const isSharp = keySig.type === 'sharp';
      const symbol = isSharp ? '♯' : '♭';
      ctx.font = 'bold 18px serif';
      ctx.fillStyle = isSharp ? '#fbbf24' : '#38bdf8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Posições verticais canônicas para sustenidos e bemóis na pauta
      // Treble: F5 (line 5: -48), C5 (space 3: -36), G5 (space above: -54), D5 (line 4: -42)
      // Bass: F3 (line 4: -36), C3 (space 2: -24), G3 (space 4: -42), D3 (line 3: -30)
      const trebleSharpOffsets = [-48, -36, -54, -42];
      const bassSharpOffsets = [-36, -24, -42, -30];
      // Treble flats: B4 (line 3: -24), E5 (space 4: -42), A4 (space 2: -18)
      // Bass flats: B2 (line 2: -12), E3 (space 3: -30), A2 (space 1: -6)
      const trebleFlatOffsets = [-24, -42, -18];
      const bassFlatOffsets = [-12, -30, -6];

      for (let i = 0; i < Math.min(keySig.accidentalsCount, 4); i++) {
        const accidentalX = currentX + i * 11;
        if (isGrandStaff || exercise.clef === 'treble') {
          const dy = isSharp ? trebleSharpOffsets[i] ?? -48 : trebleFlatOffsets[i] ?? -24;
          ctx.fillText(symbol, accidentalX, trebleLine1Y + dy);
        }
        if (isGrandStaff || exercise.clef === 'bass') {
          const dy = isSharp ? bassSharpOffsets[i] ?? -36 : bassFlatOffsets[i] ?? -12;
          ctx.fillText(symbol, accidentalX, bassLine1Y + dy);
        }
      }

      currentX += keySig.accidentalsCount * 11 + 6;
    }

    // ── 3.2 Fórmula de Compasso (Requisito 2) ──────────────────────────────
    if (exercise.timeSignature) {
      const parts = exercise.timeSignature.split('/');
      const topNum = parts[0] || '4';
      const botNum = parts[1] || '4';

      const drawTimeSig = (line1Y: number) => {
        ctx.save();
        ctx.font = 'bold 20px "JetBrains Mono", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e2e8f0';
        // Número superior entre as linhas 3 e 5
        ctx.fillText(topNum, currentX + 8, line1Y - 36);
        // Número inferior entre as linhas 1 e 3
        ctx.fillText(botNum, currentX + 8, line1Y - 12);
        ctx.restore();
      };

      if (isGrandStaff || exercise.clef === 'treble') {
        drawTimeSig(trebleLine1Y);
      }
      if (isGrandStaff || exercise.clef === 'bass') {
        drawTimeSig(bassLine1Y);
      }

      currentX += 26;
    }

    // ── 4. Posicionamento e Renderização das Notas ─────────────────────────
    const notesCount = exercise.notes.length;
    const notesStartX = currentX + 22;
    const availableWidth = staffEndX - notesStartX - 20;
    const stepX = notesCount > 1 ? availableWidth / (notesCount + 1) : availableWidth / 2;

    // Guarda as posições calculadas para o cursor e notas
    const notePositions: { x: number; y: number }[] = [];

    exercise.notes.forEach((note, index) => {
      // Se for acorde, todas as notas ficam no mesmo X; se for sequência, distribuem-se
      const isChord = exercise.type === 'chords';
      const noteX = isChord ? notesStartX + 50 : notesStartX + (index + 0.8) * stepX;
      const noteY = calculateNoteY(note, trebleLine1Y, bassLine1Y);

      notePositions.push({ x: noteX, y: noteY });

      const isActiveNote = index === activeNoteIndex || isChord;
      const isPastNote = index < activeNoteIndex && !isChord;

      // 4.1 Linhas Suplementares (Ledger Lines)
      const line1 = note.clef === 'treble' ? trebleLine1Y : bassLine1Y;
      const line5 = line1 - 48;
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1.8;

      if (noteY > line1) {
        // Linhas suplementares inferiores
        for (let ly = line1 + 12; ly <= noteY + 2; ly += 12) {
          ctx.beginPath();
          ctx.moveTo(noteX - 14, ly);
          ctx.lineTo(noteX + 14, ly);
          ctx.stroke();
        }
      } else if (noteY < line5) {
        // Linhas suplementares superiores
        for (let ly = line5 - 12; ly >= noteY - 2; ly -= 12) {
          ctx.beginPath();
          ctx.moveTo(noteX - 14, ly);
          ctx.lineTo(noteX + 14, ly);
          ctx.stroke();
        }
      }

      // 4.2 Feedback Glow na Nota Ativa
      if (isActiveNote) {
        let glowColor = 'rgba(99, 102, 241, 0.35)';
        if (feedbackState === 'correct') glowColor = 'rgba(16, 185, 129, 0.65)';
        if (feedbackState === 'wrong') glowColor = 'rgba(239, 68, 68, 0.65)';

        ctx.save();
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(noteX, noteY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4.3 Acidente Musical (# ou b)
      if (note.accidental) {
        ctx.save();
        ctx.fillStyle = isActiveNote
          ? feedbackState === 'correct'
            ? '#34d399'
            : feedbackState === 'wrong'
            ? '#f87171'
            : '#f8fafc'
          : '#94a3b8';
        ctx.font = 'bold 20px serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const symbol = note.accidental === '#' ? '♯' : '♭';
        ctx.fillText(symbol, noteX - 11, noteY - 1);
        ctx.restore();
      }

      // 4.4 Cabeça da Nota & Figura Rítmica (Requisito 4)
      ctx.save();
      let headColor = '#f8fafc';
      if (isPastNote) headColor = '#10b981'; // Notas já acertadas ficam verdes
      if (isActiveNote) {
        if (feedbackState === 'correct') headColor = '#10b981';
        else if (feedbackState === 'wrong') headColor = '#ef4444';
        else headColor = '#fbbf24'; // Alvo dourado brilhante
      }

      const durationFigure = note.durationFigure || (exercise.type === 'chords' ? 'whole' : 'quarter');
      const isHollow = durationFigure === 'whole' || durationFigure === 'half';
      const hasStem = durationFigure !== 'whole';
      const hasFlag = durationFigure === 'eighth';

      ctx.fillStyle = headColor;
      ctx.strokeStyle = headColor;
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      // Elipse inclinada a -25 graus
      ctx.ellipse(noteX, noteY, 8.5, 6, -Math.PI / 8, 0, Math.PI * 2);

      if (isHollow) {
        ctx.stroke(); // Cabeça vazada para semibreve e mínima
      } else {
        ctx.fill(); // Cabeça preenchida para semínima e colcheia
      }

      // 4.5 Haste da Nota (Stem)
      const middleLineY = line1 - 24;
      const isStemUp = noteY >= middleLineY;

      if (hasStem) {
        ctx.beginPath();
        const stemX = isStemUp ? noteX + 7 : noteX - 7;
        const stemEndY = isStemUp ? noteY - 34 : noteY + 34;

        ctx.moveTo(stemX, noteY);
        ctx.lineTo(stemX, stemEndY);
        ctx.stroke();

        // 4.5.1 Bandeirola da Colcheia (Flag)
        if (hasFlag) {
          ctx.beginPath();
          ctx.moveTo(stemX, stemEndY);
          if (isStemUp) {
            ctx.bezierCurveTo(stemX + 10, stemEndY + 6, stemX + 11, stemEndY + 18, stemX + 2, stemEndY + 22);
          } else {
            ctx.bezierCurveTo(stemX + 10, stemEndY - 6, stemX + 11, stemEndY - 18, stemX + 2, stemEndY - 22);
          }
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      ctx.restore();

      // 4.6 Cursor / Indicador da Nota Atual em Sequências
      if (exercise.type === 'sequences' && isActiveNote && !isTemporalActive) {
        ctx.save();
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        // Triângulo indicador acima da nota
        const arrowY = isStemUp ? noteY - 44 : noteY - 18;
        ctx.moveTo(noteX, arrowY);
        ctx.lineTo(noteX - 5, arrowY - 8);
        ctx.lineTo(noteX + 5, arrowY - 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 4.7 Contagem Temporal sob a pauta (Requisito 4)
      if (showBeatCount && (exercise.type === 'sequences' || exercise.timeSignature)) {
        const beatNum = note.beatOffset !== undefined ? (note.beatOffset % 4) + 1 : (index % 4) + 1;
        const countY = isGrandStaff ? bassLine1Y + 36 : (exercise.clef === 'treble' ? trebleLine1Y + 36 : bassLine1Y + 36);

        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isActiveNote ? '#38bdf8' : 'rgba(148, 163, 184, 0.6)';
        ctx.fillText(String(beatNum), noteX, countY);
        ctx.restore();
      }

      // 4.8 Dicas Pedagógicas (Rótulo com Nome da Nota e Posição)
      if (showNoteHints && isActiveNote) {
        const { portuguese, english } = getFormattedNoteName(note.midi, note.accidental);
        const labelText = `${portuguese} (${english})`;

        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const boxW = textMetrics.width + 12;
        const boxH = 18;
        const pillY = isGrandStaff ? bassLine1Y + 18 : (exercise.clef === 'treble' ? trebleLine1Y + 18 : bassLine1Y + 18);

        // Fundo do Pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(noteX - boxW / 2, pillY - 12, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        // Texto do Nome da Nota
        ctx.fillStyle = '#c7d2fe';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, noteX, pillY - 3);

        if (showStaffPositionHints) {
          ctx.font = '9px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(note.staffPosition.description, noteX, pillY + 14);
        }
        ctx.restore();
      }
    });

    // ── 5. Cursor de Leitura / Linha Temporal Determinística (Requisito 3) ──
    if (isTemporalActive && cursorProgress !== undefined && cursorProgress >= 0) {
      const minX = notesStartX + 10;
      const maxX = staffEndX - 30;
      const clampedProgress = Math.max(0, Math.min(1, cursorProgress));
      const cursorX = minX + clampedProgress * (maxX - minX);

      const topY = isGrandStaff ? trebleLine1Y - 60 : (exercise.clef === 'treble' ? trebleLine1Y - 60 : bassLine1Y - 60);
      const botY = isGrandStaff ? bassLine1Y + 24 : (exercise.clef === 'treble' ? trebleLine1Y + 24 : bassLine1Y + 24);

      ctx.save();

      // Brilho difuso da linha do cursor
      const glowGrad = ctx.createLinearGradient(0, topY, 0, botY);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      glowGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.4)');
      glowGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.4)');
      glowGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

      ctx.fillStyle = glowGrad;
      ctx.fillRect(cursorX - 4, topY, 8, botY - topY);

      // Linha central nítida do cursor
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cursorX, topY);
      ctx.lineTo(cursorX, botY);
      ctx.stroke();

      // Indicador em losango no topo do cursor
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(cursorX, topY - 2);
      ctx.lineTo(cursorX + 5, topY - 9);
      ctx.lineTo(cursorX, topY - 16);
      ctx.lineTo(cursorX - 5, topY - 9);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // ── 6. Cifra do Acorde (se modo acorde) ─────────────────────────────────
    if (exercise.type === 'chords' && exercise.chordSymbol) {
      ctx.save();
      ctx.font = 'black 18px "JetBrains Mono", sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      const chordX = notesStartX + 50;
      const chordTopY = isGrandStaff ? trebleLine1Y - 64 : (exercise.clef === 'treble' ? trebleLine1Y - 64 : bassLine1Y - 64);
      ctx.fillText(exercise.chordSymbol, chordX, chordTopY);
      ctx.restore();
    }
  }, [
    exercise,
    activeNoteIndex,
    feedbackState,
    showNoteHints,
    showStaffPositionHints,
    showBeatCount,
    cursorProgress,
    isTemporalActive,
    containerWidth,
    canvasHeight,
    isGrandStaff,
    trebleLine1Y,
    bassLine1Y,
  ]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative select-none">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${canvasHeight}px`, display: 'block' }}
      />
    </div>
  );
};
