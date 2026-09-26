/**
 * editor/FormalScoreSheet.tsx
 * Componente visual interativo que renderiza a Partitura Formal Dinâmica com suporte a cliques para inserção e acordes.
 * Regra: Componente visual compacto (< 190 linhas).
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { FormalScoreNote, ScoreSheetRenderOptions, StaffHoverPreview } from './scoreSheetTypes';
import { drawFormalScoreSheet, START_X, getDiatonicY, getPitchFromY } from './drawFormalScoreSheet';
import { Sun, Moon, Type, PlusCircle } from 'lucide-react';

interface FormalScoreSheetProps {
  notes: FormalScoreNote[];
  timeSignature: [number, number];
  playheadBeat: number | null;
  selectedNoteId: string | null;
  onSelectNote: (id: string | null) => void;
  onInsertNote?: (note: { midi: number; noteName: string; clef: 'treble' | 'bass'; duration: 4 | 2 | 1 | 0.5 | 0.25; beat: number; measure: number }) => void;
  onDeleteNote?: (id: string) => void;
  beatsPerMeasure: number;
  totalMeasures: number;
  selectedDuration?: 4 | 2 | 1 | 0.5 | 0.25;
  isChordMode?: boolean;
  activeMeasure?: number;
  cursorBeat?: number;
}

export const FormalScoreSheet: React.FC<FormalScoreSheetProps> = ({
  notes,
  timeSignature,
  playheadBeat,
  selectedNoteId,
  onSelectNote,
  onInsertNote,
  onDeleteNote,
  beatsPerMeasure,
  totalMeasures,
  selectedDuration = 1,
  isChordMode = false,
  activeMeasure,
  cursorBeat,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [hoverPreview, setHoverPreview] = useState<StaffHoverPreview | null>(null);

  const [options, setOptions] = useState<ScoreSheetRenderOptions>({
    theme: 'paper',
    pixelsPerBeat: 72,
    showNoteNames: true,
    showMeasureNumbers: true,
  });

  const totalWidth = useMemo(() => {
    return Math.max(containerWidth, 120 + totalMeasures * beatsPerMeasure * options.pixelsPerBeat + 60);
  }, [containerWidth, totalMeasures, beatsPerMeasure, options.pixelsPerBeat]);

  // Sincroniza scroll com o playhead
  useEffect(() => {
    if (playheadBeat !== null && containerRef.current) {
      const targetX = START_X + playheadBeat * options.pixelsPerBeat - containerWidth / 2;
      containerRef.current.scrollLeft = Math.max(0, targetX);
    }
  }, [playheadBeat, options.pixelsPerBeat, containerWidth]);

  // Observa largura do contêiner
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      if (entries[0]) setContainerWidth(entries[0].contentRect.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Renderiza no canvas sempre que as notas, compasso, hover ou playhead mudarem
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawFormalScoreSheet({
      ctx,
      width: totalWidth,
      height: 300,
      notes,
      timeSignature,
      playheadBeat,
      selectedNoteId,
      options: {
        ...options,
        hoverPreview,
        selectedDuration,
        activeMeasure,
        cursorBeat,
      },
      totalMeasures,
      beatsPerMeasure,
      scrollLeft: 0,
    });
  }, [notes, timeSignature, playheadBeat, selectedNoteId, options, hoverPreview, selectedDuration, activeMeasure, cursorBeat, totalMeasures, beatsPerMeasure, totalWidth]);

  // Movimentação do mouse para preview da figura (Ghost Note)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX < START_X - 10) {
      setHoverPreview(null);
      return;
    }

    const snap = selectedDuration < 1 ? selectedDuration : 1;
    const rawBeat = Math.max(0, (mouseX - START_X) / options.pixelsPerBeat);
    const beat = Math.round(rawBeat / snap) * snap;
    const pitch = getPitchFromY(mouseY);
    const snapX = START_X + beat * options.pixelsPerBeat;
    const snapY = getDiatonicY(pitch.noteName, pitch.clef);

    // Se já existem notas nesse beat, formará acorde!
    const hasNotesAtBeat = notes.some(n => Math.abs(n.beat - beat) < 0.05);

    setHoverPreview({
      beat,
      clef: pitch.clef,
      noteName: pitch.noteName,
      midi: pitch.midi,
      isChord: hasNotesAtBeat || isChordMode,
      x: snapX,
      y: snapY,
    });
  };

  const handleMouseLeave = () => {
    setHoverPreview(null);
  };

  // Clique no canvas: seleciona nota existente ou insere nova figura/acorde
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 1. Verifica se clicou diretamente sobre nota existente (para selecionar ou remover com Alt)
    let clickedNote: FormalScoreNote | null = null;
    for (const n of notes) {
      const nX = START_X + n.beat * options.pixelsPerBeat;
      const nY = getDiatonicY(n.noteName, n.clef);
      const dist = Math.hypot(clickX - nX, clickY - nY);
      if (dist <= 12) {
        clickedNote = n;
        break;
      }
    }

    if (clickedNote) {
      if (e.altKey && onDeleteNote) {
        onDeleteNote(clickedNote.id);
      } else {
        onSelectNote(clickedNote.id);
      }
      return;
    }

    // 2. Clicou na pauta para inserir figura musical / acorde
    if (clickX < START_X - 10) return;
    if (onInsertNote) {
      const snap = selectedDuration < 1 ? selectedDuration : 1;
      const rawBeat = Math.max(0, (clickX - START_X) / options.pixelsPerBeat);
      const beat = Math.round(rawBeat / snap) * snap;
      const measure = Math.floor(beat / beatsPerMeasure);
      const pitch = getPitchFromY(clickY);

      onInsertNote({
        midi: pitch.midi,
        noteName: pitch.noteName,
        clef: pitch.clef,
        duration: selectedDuration,
        beat,
        measure,
      });
    }
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#070712] shadow-xl">
      {/* Barra de Ferramentas da Pauta */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="text-base leading-none">🎼</span>
            Partitura Formal Dinâmica
          </span>
          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-mono">
            Pentagrama Duplo (Sol & Fá)
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <PlusCircle className="w-3 h-3 text-amber-400" />
            Clique na pauta para inserir nota ou empilhar acordes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Nome das Notas */}
          <button
            onClick={() => setOptions(o => ({ ...o, showNoteNames: !o.showNoteNames }))}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              options.showNoteNames
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Alternar nomes das notas na pauta"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="text-[10px]">Notas</span>
          </button>

          {/* Toggle Tema Papel / Noturno */}
          <button
            onClick={() => setOptions(o => ({ ...o, theme: o.theme === 'paper' ? 'dark' : 'paper' }))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            title={`Alternar para tema ${options.theme === 'paper' ? 'noturno' : 'papel clássico'}`}
          >
            {options.theme === 'paper' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Área com Scroll da Pauta */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden bg-[#fcfbf7] select-none"
      >
        <canvas
          ref={canvasRef}
          width={totalWidth}
          height={300}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className="cursor-crosshair block"
        />
      </div>
    </div>
  );
};
