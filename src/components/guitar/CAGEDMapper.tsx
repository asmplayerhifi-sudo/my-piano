import React from 'react';
import type { GuitarChordShape } from '../../core/types';
import { Layers, Sparkles } from 'lucide-react';

interface Props {
  selectedCaged: 'C' | 'A' | 'G' | 'E' | 'D';
  onSelectCaged: (letter: 'C' | 'A' | 'G' | 'E' | 'D') => void;
  chordRoot: string;
}

// Definições dos 5 formatos CAGED para o acorde de C (Dó Maior)
export const CAGED_SHAPES_C_MAJOR: Record<'C' | 'A' | 'G' | 'E' | 'D', GuitarChordShape> = {
  'C': {
    name: 'Dó Maior (Shape de C)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [-1, 3, 2, 0, 1, 0], // E=X, A=3, D=2, G=0, B=1, e=0
    fingers: [0, 3, 2, 0, 1, 0],
    bassNote: 'C',
  },
  'A': {
    name: 'Dó Maior (Shape de A)',
    cagedLetter: 'A',
    rootNote: 'C',
    frets: [-1, 3, 5, 5, 5, 3], // Pestana casa 3
    fingers: [0, 1, 3, 3, 3, 1],
    barreFret: 3,
    barreStrings: [1, 5],
    bassNote: 'C',
  },
  'G': {
    name: 'Dó Maior (Shape de G)',
    cagedLetter: 'G',
    rootNote: 'C',
    frets: [8, 7, 5, 5, 5, 8],
    fingers: [4, 3, 1, 1, 1, 4],
    barreFret: 5,
    barreStrings: [2, 4],
    bassNote: 'C',
  },
  'E': {
    name: 'Dó Maior (Shape de E)',
    cagedLetter: 'E',
    rootNote: 'C',
    frets: [8, 10, 10, 9, 8, 8],
    fingers: [1, 3, 4, 2, 1, 1],
    barreFret: 8,
    barreStrings: [1, 6],
    bassNote: 'C',
  },
  'D': {
    name: 'Dó Maior (Shape de D)',
    cagedLetter: 'D',
    rootNote: 'C',
    frets: [-1, -1, 10, 12, 13, 12],
    fingers: [0, 0, 1, 3, 4, 2],
    bassNote: 'C',
  },
};

export const CAGEDMapper: React.FC<Props> = ({
  selectedCaged,
  onSelectCaged,
}) => {
  const letters: Array<'C' | 'A' | 'G' | 'E' | 'D'> = ['C', 'A', 'G', 'E', 'D'];

  const descriptions: Record<'C' | 'A' | 'G' | 'E' | 'D', { name: string; position: string; feature: string }> = {
    'C': { name: 'Shape de C', position: 'Casas 1 a 3', feature: 'Posição aberta clássica com baixo na 5ª corda' },
    'A': { name: 'Shape de A', position: 'Casas 3 a 5', feature: 'Pestana na casa 3 com fundamentais nas cordas 5 e 3' },
    'G': { name: 'Shape de G', position: 'Casas 5 a 8', feature: 'Fundamental na 6ª corda (casa 8) e 3ª corda' },
    'E': { name: 'Shape de E', position: 'Casas 8 a 10', feature: 'Formato clássico com pestana completa nas 6 cordas' },
    'D': { name: 'Shape de D', position: 'Casas 10 a 13', feature: 'Vozes agudas com fundamental na 4ª corda solta/oitavada' },
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">Mapeador do Sistema CAGED</h4>
            <p className="text-[11px] text-slate-400">O mesmo acorde mapeado nos 5 formatos ao longo do braço</p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          5 Posições
        </span>
      </div>

      {/* Seletor C - A - G - E - D */}
      <div className="grid grid-cols-5 gap-2">
        {letters.map((letter) => {
          const isSelected = selectedCaged === letter;
          const info = descriptions[letter];

          return (
            <button
              key={letter}
              onClick={() => onSelectCaged(letter)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/30 to-orange-600/30 border-amber-500 text-white shadow-lg shadow-amber-500/20 scale-102'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="text-xl font-black font-display text-white">{letter}</div>
              <div className="text-[10px] font-bold text-amber-300 mt-0.5">{info.position}</div>
            </button>
          );
        })}
      </div>

      {/* Descrição Didática do Shape Selecionado */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white/5 text-amber-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span>{descriptions[selectedCaged].name}:</span>
            <span className="text-amber-400">{descriptions[selectedCaged].position}</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {descriptions[selectedCaged].feature}.
          </p>
        </div>
      </div>
    </div>
  );
};
