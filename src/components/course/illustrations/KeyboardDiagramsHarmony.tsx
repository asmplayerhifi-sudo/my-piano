/**
 * illustrations/KeyboardDiagramsHarmony.tsx
 * Diagramas panorâmicos para harmonia, ritmo e inversões no teclado.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Árvore de Divisão Rítmica (Semibreve ➔ Mínima ➔ Semínima ➔ Colcheia) */
export const RhythmTreeDivisionDiagram: React.FC = () => (
  <svg viewBox="0 0 960 300" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <defs>
      <linearGradient id="pyrSemibreve" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3730a3" />
        <stop offset="50%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#3730a3" />
      </linearGradient>
      <linearGradient id="pyrMinima" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0369a1" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="pyrSeminima" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#065f46" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="pyrColcheia" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#854d0e" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    <g transform="translate(30, 18)">
      <text x="0" y="20" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        PIRÂMIDE HIERÁRQUICA DAS FIGURAS RÍTMICAS
      </text>
      <text x="0" y="38" fill="#94a3b8" fontSize="11">
        Subdivisão binária proporcional da pulsação: cada nível divide a duração exatamente pela metade (÷2)
      </text>
    </g>

    {/* ── LINHAS CONECTORAS GUIA (Árvore Genealógica do Ritmo) ── */}
    <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="3,3">
      {/* Nível 1 ➔ Nível 2 */}
      <path d="M 480,102 L 480,114 M 480,114 L 261,114 L 261,124 M 480,114 L 699,114 L 699,124" />
      {/* Nível 2 ➔ Nível 3 */}
      <path d="M 261,162 L 261,172 M 261,172 L 153,172 L 153,182 M 261,172 L 371,172 L 371,182" />
      <path d="M 699,162 L 699,172 M 699,172 L 589,172 L 589,182 M 699,172 L 807,172 L 807,182" />
      {/* Nível 3 ➔ Nível 4 */}
      <path d="M 153,220 L 153,230 M 153,230 L 99,230 L 99,240 M 153,230 L 208,230 L 208,240" />
      <path d="M 371,220 L 371,230 M 371,230 L 317,230 L 317,240 M 371,230 L 426,230 L 426,240" />
      <path d="M 589,220 L 589,230 M 589,230 L 535,230 L 535,240 M 589,230 L 644,230 L 644,240" />
      <path d="M 807,220 L 807,230 M 807,230 L 753,230 L 753,240 M 807,230 L 862,230 L 862,240" />
    </g>

    {/* ── NÍVEL 1: SEMIBREVE (1 Nota = 4 Tempos Inteiros) ── */}
    <g transform="translate(50, 64)">
      <rect x="0" y="0" width="860" height="38" rx="8" fill="url(#pyrSemibreve)" stroke="#818cf8" strokeWidth="1.2" />
      {/* Figura Vetorial: Semibreve */}
      <g transform="translate(30, 19)">
        <ellipse cx="0" cy="0" rx="10" ry="6.5" fill="none" stroke="#ffffff" strokeWidth="2.5" transform="rotate(-20)" />
        <ellipse cx="0" cy="0" rx="4.5" ry="2.2" fill="#3730a3" transform="rotate(-20)" />
      </g>
      <text x="60" y="24" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="Outfit, sans-serif">
        SEMIBREVE
      </text>
      <text x="175" y="24" fill="#c7d2fe" fontSize="11" fontWeight="bold">
        (1 Nota = 4 Tempos Inteiros)
      </text>
      <rect x="710" y="9" width="135" height="20" rx="5" fill="rgba(0,0,0,0.3)" />
      <text x="777" y="23" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
        VALOR: 1 (4/4)
      </text>
    </g>

    {/* ── NÍVEL 2: MÍNIMAS (2 Notas = 2 Tempos cada) ── */}
    <g transform="translate(50, 124)">
      {[
        { x: 0, w: 422 },
        { x: 438, w: 422 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, 0)`}>
          <rect x="0" y="0" width={b.w} height="38" rx="8" fill="url(#pyrMinima)" stroke="#38bdf8" strokeWidth="1.2" />
          {/* Figura Vetorial: Mínima */}
          <g transform="translate(26, 21)">
            <ellipse cx="0" cy="0" rx="7.5" ry="5" fill="none" stroke="#ffffff" strokeWidth="2.2" transform="rotate(-25)" />
            <ellipse cx="0" cy="0" rx="3.5" ry="1.8" fill="#0369a1" transform="rotate(-25)" />
            <line x1="6" y1="-2" x2="6" y2="-15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="48" y="24" fill="#ffffff" fontSize="12" fontWeight="900" fontFamily="Outfit, sans-serif">
            MÍNIMA
          </text>
          <text x="110" y="24" fill="#bae6fd" fontSize="10.5" fontWeight="bold">
            (2 Tempos)
          </text>
          <rect x={b.w - 105} y="9" width="92" height="20" rx="5" fill="rgba(0,0,0,0.3)" />
          <text x={b.w - 59} y="23" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
            VALOR: 1/2
          </text>
        </g>
      ))}
    </g>

    {/* ── NÍVEL 3: SEMÍNIMAS (4 Notas = 1 Tempo cada • Pulso Padrão) ── */}
    <g transform="translate(50, 182)">
      {[
        { x: 0, w: 206 },
        { x: 218, w: 206 },
        { x: 436, w: 206 },
        { x: 654, w: 206 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, 0)`}>
          <rect x="0" y="0" width={b.w} height="38" rx="8" fill="url(#pyrSeminima)" stroke="#34d399" strokeWidth="1.2" />
          {/* Figura Vetorial: Semínima */}
          <g transform="translate(22, 21)">
            <ellipse cx="0" cy="0" rx="7" ry="4.8" fill="#ffffff" transform="rotate(-25)" />
            <line x1="5.5" y1="-2" x2="5.5" y2="-15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="40" y="24" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="Outfit, sans-serif">
            SEMÍNIMA
          </text>
          <text x="105" y="24" fill="#a7f3d0" fontSize="9.5" fontWeight="bold">
            (1 Tempo)
          </text>
          <rect x={b.w - 48} y="9" width="40" height="20" rx="5" fill="rgba(0,0,0,0.3)" />
          <text x={b.w - 28} y="23" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
            1/4
          </text>
        </g>
      ))}
    </g>

    {/* ── NÍVEL 4: COLCHEIAS (8 Notas = 1/2 Tempo cada) ── */}
    <g transform="translate(50, 240)">
      {Array.from({ length: 8 }).map((_, i) => {
        const x = i * 109;
        const w = 98;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width={w} height="38" rx="7" fill="url(#pyrColcheia)" stroke="#fbbf24" strokeWidth="1.1" />
            {/* Figura Vetorial: Colcheia com Haste e Bandeirola */}
            <g transform="translate(18, 22)">
              <ellipse cx="0" cy="0" rx="6" ry="4" fill="#ffffff" transform="rotate(-25)" />
              <line x1="4.8" y1="-2" x2="4.8" y2="-14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 4.8,-14 Q 11,-10 9,-4" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            </g>
            <text x="35" y="20" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily="Outfit, sans-serif">
              COLCHEIA
            </text>
            <text x="35" y="31" fill="#fde68a" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
              ½ Tempo (1/8)
            </text>
          </g>
        );
      })}
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
