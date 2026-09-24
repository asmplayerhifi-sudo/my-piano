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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header Oficial do Módulo de Teoria */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Módulo de Teoria &amp; Harmonia Musical</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Teoria Musical Completa
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Ementa estruturada com 7 módulos teóricos, áudios explicativos, testes de fixação e ferramentas acústicas interativas (construtor de escalas, avaliação de performance e círculo das quintas).
          </p>
        </div>

        {/* 2. Barra de Navegação de Sub-Abas do Módulo Teoria */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/5 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'academy'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-102 ring-1 ring-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Estudos de Teoria (7 Módulos)</span>
          </button>

          <button
            onClick={() => setActiveTab('scales')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scales'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-1 ring-indigo-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Escalas &amp; Avaliação</span>
          </button>

          <button
            onClick={() => setActiveTab('circle')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'circle'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 scale-102 ring-1 ring-pink-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Círculo das Quintas</span>
          </button>

          <button
            onClick={() => setActiveTab('ruler')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ruler'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 scale-102 ring-1 ring-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Régua Cromática</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102 ring-1 ring-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Exibir todas as ferramentas e seções em uma página contínua"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Visão Panorâmica</span>
          </button>
        </div>
      </div>

      {/* 3. Renderização Dinâmica de Acordo com a Sub-Aba Ativa */}
      {activeTab === 'academy' && <TheoryStudyAcademy />}
      {activeTab === 'scales' && <ScaleBuilder />}
      {activeTab === 'circle' && <CircleOfFifths />}
      {activeTab === 'ruler' && <ChromaticRuler />}

      {/* Visão Panorâmica: Exibe tudo empilhado para leitura sequencial */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <TheoryStudyAcademy />
          <ScaleBuilder />
          <CircleOfFifths />
          <ChromaticRuler />
        </div>
      )}
    </div>
  );
};
