import React, { useState } from 'react';
import { TheoryStudyAcademy } from './TheoryStudyAcademy';
import { ChromaticRuler } from './ChromaticRuler';
import { ScaleBuilder } from './ScaleBuilder';
import { CircleOfFifths } from './CircleOfFifths';
import { GraduationCap, Music, CircleDot, Ruler, LayoutGrid, Compass } from 'lucide-react';

export type TheorySubTab = 'academy' | 'scales' | 'circle' | 'ruler' | 'overview';

export const TheoryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TheorySubTab>('academy');

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 space-y-2">
      {/* Barra de Sub-ferramentas de Teoria Compacta (<= 34px) */}
      <div className="w-full h-[34px] px-3 bg-[#0a0f1d] border border-white/5 rounded-xl flex items-center justify-between gap-2 shrink-0 select-none text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-bold text-white tracking-tight hidden sm:inline text-xs font-display">
            Teoria Musical
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'academy'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academia (7 Módulos)</span>
          </button>

          <button
            onClick={() => setActiveTab('scales')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'scales'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Escalas</span>
          </button>

          <button
            onClick={() => setActiveTab('circle')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'circle'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Círculo das Quintas</span>
          </button>

          <button
            onClick={() => setActiveTab('ruler')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ruler'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Régua Cromática</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Exibir todas as ferramentas em visão contínua"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Panorâmica</span>
          </button>
        </div>
      </div>

      {/* Renderização Dinâmica Full-Width */}
      <div className="flex-1 w-full min-h-0">
        {activeTab === 'academy' && <TheoryStudyAcademy />}
        {activeTab === 'scales' && (
          <div className="w-full rounded-2xl border border-white/5 bg-[#090b15] p-3 sm:p-4 overflow-y-auto">
            <ScaleBuilder />
          </div>
        )}
        {activeTab === 'circle' && (
          <div className="w-full rounded-2xl border border-white/5 bg-[#090b15] p-3 sm:p-4 overflow-y-auto">
            <CircleOfFifths />
          </div>
        )}
        {activeTab === 'ruler' && (
          <div className="w-full rounded-2xl border border-white/5 bg-[#090b15] p-3 sm:p-4 overflow-y-auto">
            <ChromaticRuler />
          </div>
        )}
        {activeTab === 'overview' && (
          <div className="space-y-4 overflow-y-auto">
            <TheoryStudyAcademy />
            <ScaleBuilder />
            <CircleOfFifths />
            <ChromaticRuler />
          </div>
        )}
      </div>
    </div>
  );
};
