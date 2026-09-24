import React from 'react';
import { ChromaticRuler } from './ChromaticRuler';
import { ScaleBuilder } from './ScaleBuilder';
import { CircleOfFifths } from './CircleOfFifths';
import { Compass } from 'lucide-react';

export const TheoryModule: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header do Módulo Teoria */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Módulo 1 — Mapas Mentais &amp; Relações Tonais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Teoria Musical Interativa
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Compreenda a física dos semitons naturais, a formação de escalas com rigor enarmônico e a geometria circular das funções harmônicas.
          </p>
        </div>
      </div>

      {/* 1. Régua Cromática */}
      <ChromaticRuler />

      {/* 2. Construtor da Escala Maior */}
      <ScaleBuilder />

      {/* 3. Círculo das Quintas */}
      <CircleOfFifths />
    </div>
  );
};
