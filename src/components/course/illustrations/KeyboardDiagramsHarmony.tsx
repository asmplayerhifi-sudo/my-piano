/**
 * illustrations/KeyboardDiagramsHarmony.tsx
 * Diagramas panorâmicos para harmonia, ritmo e inversões no teclado.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Árvore de Divisão Rítmica (Semibreve ➔ Mínima ➔ Semínima) */
export const RhythmTreeDivisionDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">PIRÂMIDE DAS FIGURAS RÍTMICAS</text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">Relação matemática de proporção: cada nível divide a duração por 2</text>
    </g>

    <g transform="translate(60, 65)">
      {/* Nível 1: Semibreve (4 Tempos) */}
      <rect x="0" y="0" width="840" height="34" rx="6" fill="#4338ca" stroke="#818cf8" strokeWidth="1" />
      <text x="420" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">
        𝅝 SEMIBREVE (1 Nota = 4 Tempos)
      </text>

      {/* Nível 2: 2 Mínimas (2 Tempos cada) */}
      <rect x="0" y="42" width="414" height="34" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
      <text x="207" y="64" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
        𝅗𝅥 MÍNIMA (2 Tempos)
      </text>
      <rect x="426" y="42" width="414" height="34" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
      <text x="633" y="64" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
        𝅗𝅥 MÍNIMA (2 Tempos)
      </text>

      {/* Nível 3: 4 Semínimas (1 Tempo cada) */}
      {[0, 213, 426, 639].map((x, i) => (
        <g key={i}>
          <rect x={x} y="84" width="201" height="34" rx="6" fill="#065f46" stroke="#34d399" strokeWidth="1" />
          <text x={x + 100} y="106" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
            ♩ SEMÍNIMA (1 Tempo)
          </text>
        </g>
      ))}
    </g>
  </svg>
);

/** 2. Fórmulas de Tríade Maior e Menor */
export const TriadFormulaWideDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Tríade Maior (Esquerda) */}
    <g transform="translate(40, 20)">
      <rect x="0" y="0" width="420" height="180" rx="14" fill="rgba(99, 102, 241, 0.08)" stroke="#6366f1" strokeWidth="1.2" />
      <text x="20" y="32" fill="#c7d2fe" fontSize="14" fontWeight="black">TRÍADE MAIOR (Alegre, Estável)</text>
      <text x="20" y="52" fill="#818cf8" fontSize="11">Fórmula: Fundamental + 4 semitons (3M) + 3 semitons (5J)</text>

      <g transform="translate(20, 80)">
        <rect x="0" y="0" width="100" height="50" rx="8" fill="#4338ca" />
        <text x="50" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">Dó (C)</text>
        <text x="50" y="42" textAnchor="middle" fill="#a5b4fc" fontSize="9">Fundamental</text>

        <path d="M 105,25 L 135,25" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="120" y="16" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">+4 st</text>

        <rect x="140" y="0" width="100" height="50" rx="8" fill="#4338ca" />
        <text x="190" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">Mi (E)</text>
        <text x="190" y="42" textAnchor="middle" fill="#a5b4fc" fontSize="9">3ª Maior</text>

        <path d="M 245,25 L 275,25" stroke="#818cf8" strokeWidth="2" />
        <text x="260" y="16" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">+3 st</text>

        <rect x="280" y="0" width="100" height="50" rx="8" fill="#4338ca" />
        <text x="330" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">Sol (G)</text>
        <text x="330" y="42" textAnchor="middle" fill="#a5b4fc" fontSize="9">5ª Justa</text>
      </g>
    </g>

    {/* Tríade Menor (Direita) */}
    <g transform="translate(500, 20)">
      <rect x="0" y="0" width="420" height="180" rx="14" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" strokeWidth="1.2" />
      <text x="20" y="32" fill="#fecdd3" fontSize="14" fontWeight="black">TRÍADE MENOR (Nostálgica, Dramática)</text>
      <text x="20" y="52" fill="#fb7185" fontSize="11">Fórmula: Fundamental + 3 semitons (3m) + 4 semitons (5J)</text>

      <g transform="translate(20, 80)">
        <rect x="0" y="0" width="100" height="50" rx="8" fill="#9f1239" />
        <text x="50" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">Dó (C)</text>
        <text x="50" y="42" textAnchor="middle" fill="#fecdd3" fontSize="9">Fundamental</text>

        <path d="M 105,25 L 135,25" stroke="#fb7185" strokeWidth="2" />
        <text x="120" y="16" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">+3 st</text>

        <rect x="140" y="0" width="100" height="50" rx="8" fill="#9f1239" />
        <text x="190" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">Mi♭ (Eb)</text>
        <text x="190" y="42" textAnchor="middle" fill="#fecdd3" fontSize="9">3ª Menor</text>

        <path d="M 245,25 L 275,25" stroke="#fb7185" strokeWidth="2" />
        <text x="260" y="16" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">+4 st</text>

        <rect x="280" y="0" width="100" height="50" rx="8" fill="#9f1239" />
        <text x="330" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">Sol (G)</text>
        <text x="330" y="42" textAnchor="middle" fill="#fecdd3" fontSize="9">5ª Justa</text>
      </g>
    </g>
  </svg>
);

/** 3. Ciclo das Inversões de Acordes */
export const ChordInversionsCycleDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">CICLO DAS 3 POSIÇÕES (INVERSÕES DE TRÍADES)</text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">Desloque a nota mais grave 1 oitava para cima para criar conduções de vozes perfeitas</text>
    </g>

    <g transform="translate(60, 75)">
      {/* Estado Fundamental */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="240" height="100" rx="10" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="1.5" />
        <text x="120" y="26" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="black">ESTADO FUNDAMENTAL</text>
        <text x="120" y="55" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="black">C - E - G</text>
        <text x="120" y="80" textAnchor="middle" fill="#818cf8" fontSize="10">Baixo na Fundamental (1)</text>
      </g>

      <path d="M 255,50 L 290,50" stroke="#a78bfa" strokeWidth="3" />

      {/* 1ª Inversão */}
      <g transform="translate(300, 0)">
        <rect x="0" y="0" width="240" height="100" rx="10" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="1.5" />
        <text x="120" y="26" textAnchor="middle" fill="#a5f3fc" fontSize="12" fontWeight="black">1ª INVERSÃO (C/E)</text>
        <text x="120" y="55" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="black">E - G - C</text>
        <text x="120" y="80" textAnchor="middle" fill="#22d3ee" fontSize="10">Baixo na Terça (3)</text>
      </g>

      <path d="M 555,50 L 590,50" stroke="#a78bfa" strokeWidth="3" />

      {/* 2ª Inversão */}
      <g transform="translate(600, 0)">
        <rect x="0" y="0" width="240" height="100" rx="10" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" />
        <text x="120" y="26" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="black">2ª INVERSÃO (C/G)</text>
        <text x="120" y="55" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="black">G - C - E</text>
        <text x="120" y="80" textAnchor="middle" fill="#34d399" fontSize="10">Baixo na Quinta (5)</text>
      </g>
    </g>
  </svg>
);
