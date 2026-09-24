/**
 * editor/FormalScoreSheet.tsx
 * Componente visual que renderiza a Partitura Musical Formal Dinâmica em tempo real.
 * Regra: Componente visual compacto (< 180 linhas).
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { FormalScoreNote, ScoreSheetRenderOptions } from './scoreSheetTypes';
import { drawFormalScoreSheet } from './drawFormalScoreSheet';
import { Sun, Moon, Type } from 'lucide-react';

interface FormalScoreSheetProps {
  notes: FormalScoreNote[];
  timeSignature: [number, number];
  playheadBeat: number | null;
  selectedNoteId: string | null;
  onSelectNote: (id: string | null) => void;
  beatsPerMeasure: number;
  totalMeasures: number;
}

export const FormalScoreSheet: React.FC<FormalScoreSheetProps> = ({
  notes,
  timeSignature,
  playheadBeat,
  selectedNoteId,
  onSelectNote,
  beatsPerMeasure,
  totalMeasures,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);

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
      const targetX = 95 + playheadBeat * options.pixelsPerBeat - containerWidth / 2;
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

  // Renderiza no canvas sempre que as notas, compasso ou playhead mudarem
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
      options,
      totalMeasures,
      beatsPerMeasure,
      scrollLeft: 0,
    });
  }, [notes, timeSignature, playheadBeat, selectedNoteId, options, totalMeasures, beatsPerMeasure, totalWidth]);

  // Clique no canvas para selecionar notas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    let foundId: string | null = null;
    for (const n of notes) {
      const noteX = 95 + n.beat * options.pixelsPerBeat;
      if (Math.abs(clickX - noteX) < 18) {
        foundId = n.id;
        break;
      }
    }
    onSelectNote(foundId);
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
          onClick={handleCanvasClick}
          className="cursor-pointer block"
        />
      </div>
    </div>
  );
};
