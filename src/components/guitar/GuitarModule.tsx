import React, { useState } from 'react';
import { FretboardView } from './FretboardView';
import { CAGEDMapper, CAGED_SHAPES_C_MAJOR } from './CAGEDMapper';
import { BassInversionCard } from './BassInversionCard';
import { MetronomeBar } from '../audio/MetronomeBar';
import type { GuitarChordShape } from '../../core/types';
import { Guitar, Eye } from 'lucide-react';

export const GuitarModule: React.FC = () => {
  const [selectedCaged, setSelectedCaged] = useState<'C' | 'A' | 'G' | 'E' | 'D'>('C');
  const [currentShape, setCurrentShape] = useState<GuitarChordShape>(CAGED_SHAPES_C_MAJOR['C']);
  const [showNoteNames, setShowNoteNames] = useState<boolean>(false);

  const handleSelectCaged = (letter: 'C' | 'A' | 'G' | 'E' | 'D') => {
    setSelectedCaged(letter);
    setCurrentShape(CAGED_SHAPES_C_MAJOR[letter]);
  };

  const handleSelectInversion = (shape: GuitarChordShape) => {
    setCurrentShape(shape);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header do Módulo Violão */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Guitar className="w-4 h-4" />
            <span>Módulo 4 — Mapeamento Matricial &amp; CAGED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Braço do Violão &amp; Sistema CAGED
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-4xl">
            Domine as 15 casas do braço do instrumento através dos 5 formatos do Sistema CAGED, baixos invertidos e a quebra geométrica de afinação na 2ª corda.
          </p>
        </div>

        {/* Toggle Notas vs Dedos */}
        <button
          onClick={() => setShowNoteNames(!showNoteNames)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer self-start md:self-auto ${
            showNoteNames
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{showNoteNames ? 'Exibindo Notas' : 'Exibindo Dedos (1 a 4)'}</span>
        </button>
      </div>

      {/* Braço de Violão Interativo Principal */}
      <div className="glass-card rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
              Shape Ativo no Braço
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black font-display text-white">{currentShape.name}</h3>
              <span className="text-xs text-slate-400">
                (Baixo em {currentShape.bassNote})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Fundamental
            </span>
            <span className="text-sm font-bold font-mono text-rose-400">
              {currentShape.rootNote} (Círculos com aura)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <MetronomeBar
            title="Metrônomo do Violão / Viola"
            initialBpm={90}
            initialTimeSignature="4/4"
          />

          <FretboardView
            chordShape={currentShape}
            fretCount={14}
            showNoteNames={showNoteNames}
          />
        </div>
      </div>

      {/* Grid Inferior: CAGED Mapper + Baixos Invertidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <CAGEDMapper
            selectedCaged={selectedCaged}
            onSelectCaged={handleSelectCaged}
            chordRoot="C"
          />
        </div>

        <div className="lg:col-span-6">
          <BassInversionCard
            onSelectShape={handleSelectInversion}
          />
        </div>
      </div>
    </div>
  );
};
