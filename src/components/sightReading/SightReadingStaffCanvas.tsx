/**
 * components/sightReading/SightReadingStaffCanvas.tsx
 *
 * Palco Gráfico em Canvas Retina de Alta Fidelidade para Treino de Leitura de Partitura.
 * Suporta:
 *  - Clave de Sol (Treble), Clave de Fá (Bass) e Pauta Dupla (Grand Staff).
 *  - Linhas Suplementares superiores e inferiores automáticas.
 *  - Efeitos visuais dinâmicos: Glow na nota alvo, Acerto (Verde Neon) e Erro (Vermelho Pulsante).
 *  - Modos: Nota Única, Intervalos, Sequências Melódicas (com cursor de progresso) e Acordes (empilhamento harmônico).
 *  - Dicas pedagógicas opcionais (Nomes de Notas e posição na pauta).
 */

import React, { useRef, useEffect, useState } from 'react';
import type { SightReadingExercise, SightReadingNote } from '../../core/sightReadingEngine';
import { getFormattedNoteName } from '../../core/sightReadingEngine';

interface SightReadingStaffCanvasProps {
  exercise: SightReadingExercise;
  activeNoteIndex: number; // Para sequências e acordes (índice da nota sendo esperada)
  feedbackState: 'idle' | 'correct' | 'wrong';
  showNoteHints: boolean;
  showStaffPositionHints: boolean;
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
  const canvasHeight = isGrandStaff ? 330 : 230;

  // Coordenadas das 1ªs linhas (linhas inferiores da pauta de 5 linhas)
  const trebleLine1Y = isGrandStaff ? 110 : 135;
  const bassLine1Y = isGrandStaff ? 245 : 135;

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
    bgGradient.addColorStop(0, '#0a0b18');
    bgGradient.addColorStop(1, '#0e0f22');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, containerWidth, canvasHeight);

    // Borda exterior suave
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, containerWidth, canvasHeight);

    // ── 2. Desenho das Pautas (5 Linhas) ───────────────────────────────────
    const staffStartX = 40;
    const staffEndX = containerWidth - 40;

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
    const clefX = staffStartX + 20;

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

    // ── 4. Posicionamento e Renderização das Notas ─────────────────────────
    const notesCount = exercise.notes.length;
    const availableWidth = staffEndX - (clefX + 70);
    const stepX = notesCount > 1 ? availableWidth / (notesCount + 1) : availableWidth / 2;

    exercise.notes.forEach((note, index) => {
      // Se for acorde, todas as notas ficam no mesmo X; se for sequência, distribuem-se
      const isChord = exercise.type === 'chords';
      const noteX = isChord ? clefX + 110 : clefX + 70 + (index + 1) * stepX;
      const noteY = calculateNoteY(note, trebleLine1Y, bassLine1Y);

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
        let glowColor = 'rgba(99, 102, 241, 0.4)';
        if (feedbackState === 'correct') glowColor = 'rgba(16, 185, 129, 0.7)';
        if (feedbackState === 'wrong') glowColor = 'rgba(239, 68, 68, 0.7)';

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
        ctx.fillStyle = isActiveNote ? (feedbackState === 'correct' ? '#34d399' : feedbackState === 'wrong' ? '#f87171' : '#f8fafc') : '#94a3b8';
        ctx.font = 'bold 20px serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const symbol = note.accidental === '#' ? '♯' : '♭';
        ctx.fillText(symbol, noteX - 11, noteY - 1);
        ctx.restore();
      }

      // 4.4 Cabeça da Nota (Oval inclinada padrão musical profissional)
      ctx.save();
      let headColor = '#f8fafc';
      if (isPastNote) headColor = '#10b981'; // Notas já acertadas ficam verdes
      if (isActiveNote) {
        if (feedbackState === 'correct') headColor = '#10b981';
        else if (feedbackState === 'wrong') headColor = '#ef4444';
        else headColor = '#fbbf24'; // Alvo dourado brilhante
      }

      ctx.fillStyle = headColor;
      ctx.beginPath();
      // Elipse inclinada a -25 graus
      ctx.ellipse(noteX, noteY, 8.5, 6, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();

      // 4.5 Haste da Nota (Stem)
      // Se a nota estiver acima da linha média, haste desce pela esquerda; caso contrário, sobe pela direita
      const middleLineY = line1 - 24;
      const isStemUp = noteY >= middleLineY;
      ctx.strokeStyle = headColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      if (isStemUp) {
        ctx.moveTo(noteX + 7, noteY);
        ctx.lineTo(noteX + 7, noteY - 34);
      } else {
        ctx.moveTo(noteX - 7, noteY);
        ctx.lineTo(noteX - 7, noteY + 34);
      }
      ctx.stroke();
      ctx.restore();

      // 4.6 Cursor / Indicador da Nota Atual em Sequências
      if (exercise.type === 'sequences' && isActiveNote) {
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

      // 4.7 Dicas Pedagógicas (Rótulo com Nome da Nota e Posição)
      if (showNoteHints && isActiveNote) {
        const { portuguese, english } = getFormattedNoteName(note.midi, note.accidental);
        const labelText = `${portuguese} (${english})`;

        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const boxW = textMetrics.width + 12;
        const boxH = 18;
        const pillY = isGrandStaff ? bassLine1Y + 22 : (exercise.clef === 'treble' ? trebleLine1Y + 24 : bassLine1Y + 24);

        // Fundo do Pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
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

    // 4.8 Cifra do Acorde (se modo acorde)
    if (exercise.type === 'chords' && exercise.chordSymbol) {
      ctx.save();
      ctx.font = 'black 18px "JetBrains Mono", sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      const chordX = clefX + 110;
      const chordTopY = isGrandStaff ? trebleLine1Y - 60 : (exercise.clef === 'treble' ? trebleLine1Y - 60 : bassLine1Y - 60);
      ctx.fillText(exercise.chordSymbol, chordX, chordTopY);
      ctx.restore();
    }
  }, [exercise, activeNoteIndex, feedbackState, showNoteHints, showStaffPositionHints, containerWidth, canvasHeight, isGrandStaff, trebleLine1Y, bassLine1Y]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative select-none">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${canvasHeight}px`, display: 'block' }}
      />
    </div>
  );
};
