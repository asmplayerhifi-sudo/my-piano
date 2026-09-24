import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import type { GuitarChordShape } from '../../core/types';

interface Props {
  onSelectShape: (shape: GuitarChordShape) => void;
}

export const INVERTED_BASS_SHAPES: GuitarChordShape[] = [
  {
    name: 'C/E (Dó com Baixo em Mi)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [0, 3, 2, 0, 1, 0], // E6 solta!
    fingers: [0, 3, 2, 0, 1, 0],
    bassNote: 'E',
  },
  {
    name: 'C/G (Dó com Baixo em Sol)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [3, 3, 2, 0, 1, 0], // Dedo 4 no Sol da 6ª corda
    fingers: [3, 4, 2, 0, 1, 0],
    bassNote: 'G',
  },
  {
    name: 'D/F# (Ré com Baixo em Fá♯)',
    cagedLetter: 'D',
    rootNote: 'D',
    frets: [2, -1, 0, 2, 3, 2], // Polegar na 6ª corda casa 2
    fingers: [1, 0, 0, 2, 4, 3],
    bassNote: 'F#',
  },
];

export const BassInversionCard: React.FC<Props> = ({ onSelectShape }) => {
  const [activeTab, setActiveTab] = useState<'basses' | 'second_string'>('basses');

  return (
    <div className="w-full glass-card rounded-3xl p-5 border border-white/10 space-y-4">
      {/* Abas Superiores */}
      <div className="flex border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('basses')}
          className={`flex-1 py-2 text-xs font-bold font-display text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'basses'
              ? 'border-amber-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Baixos Invertidos (C/E, C/G, D/F♯)
        </button>

        <button
          onClick={() => setActiveTab('second_string')}
          className={`flex-1 py-2 text-xs font-bold font-display text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'second_string'
              ? 'border-indigo-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          O Salto da 2ª Corda (Si)
        </button>
      </div>

      {/* Conteúdo 1: Baixos Invertidos */}
      {activeTab === 'basses' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Acordes invertidos mudam a nota mais grave executada pelo polegar, criando conduções de baixo lineares e melodiosas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {INVERTED_BASS_SHAPES.map((shape) => (
              <button
                key={shape.name}
                onClick={() => onSelectShape(shape)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">
                  {shape.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Baixo: <strong className="text-amber-300">{shape.bassNote}</strong>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Atenção Postural:</strong> No acorde de <strong className="text-white">D/F♯</strong>, a 5ª corda (Lá) deve ser suavemente abafada com a barriga do dedo que toca o baixo, ou tocada com o polegar envolvendo o braço por cima.
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 2: Explicador do Salto da 2ª Corda (RF04.4) */}
      {activeTab === 'second_string' && (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            Por que desenhos e escalas que parecem retas sofrem uma &quot;quebra de 1 casa para frente&quot; quando atingem a 2ª corda (Si)?
          </p>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between items-center text-slate-400">
              <span>Corda 6 ➔ 5 (Mi para Lá)</span>
              <span className="text-emerald-400 font-bold">4ª Justa (5 semitons)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Corda 5 ➔ 4 (Lá para Ré)</span>
              <span className="text-emerald-400 font-bold">4ª Justa (5 semitons)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Corda 4 ➔ 3 (Ré para Sol)</span>
              <span className="text-emerald-400 font-bold">4ª Justa (5 semitons)</span>
            </div>
            <div className="flex justify-between items-center text-rose-300 bg-rose-950/30 p-1.5 rounded-xl border border-rose-500/20">
              <span className="font-bold">Corda 3 ➔ 2 (Sol para Si)</span>
              <span className="font-black text-rose-400">3ª Maior (4 semitons!) ⚠️</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Corda 2 ➔ 1 (Si para Mi)</span>
              <span className="text-emerald-400 font-bold">4ª Justa (5 semitons)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Como a afinação entre as cordas Sol e Si perde <strong className="text-white">1 semitom</strong> em relação às demais, qualquer forma geométrica precisa ser deslocada <strong className="text-amber-300 font-bold">1 casa para a frente</strong> (em direção ao corpo do violão) ao cruzar essa fronteira!
          </p>
        </div>
      )}
    </div>
  );
};
