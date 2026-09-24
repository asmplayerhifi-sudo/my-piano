/**
 * illustrations/GuitarDiagramsBasic.tsx
 * Diagramas panorâmicos para afinação, anatomia do violão e mecânica do traste.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Posição Correta no Traste vs Erro do Zumbido */
export const FretProximityDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Painel Esquerdo: Correto */}
    <g transform="translate(40, 20)">
      <rect x="0" y="0" width="420" height="180" rx="14" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1.2" />
      <text x="20" y="32" fill="#34d399" fontSize="14" fontWeight="black">✓ POSIÇÃO IDEAL: JUNTO AO TRASTE</text>
      <text x="20" y="52" fill="#94a3b8" fontSize="11">Som cristalino com pressão leve (sem calos dolorosos)</text>

      {/* Escala com traste metálico */}
      <g transform="translate(20, 75)">
        <rect x="0" y="30" width="380" height="40" rx="4" fill="#332211" stroke="#5c4033" />
        <line x1="0" y1="50" x2="380" y2="50" stroke="#cbd5e1" strokeWidth="3" />

        {/* Trastes de Metal */}
        <line x1="120" y1="20" x2="120" y2="80" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
        <line x1="280" y1="20" x2="280" y2="80" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />

        {/* Dedo posicionado colado ao traste da direita */}
        <ellipse cx="255" cy="50" rx="16" ry="14" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        <text x="255" y="55" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">D1</text>
        <text x="255" y="98" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">Encostado no traste</text>
      </g>
    </g>

    {/* Painel Direito: Errado */}
    <g transform="translate(500, 20)">
      <rect x="0" y="0" width="420" height="180" rx="14" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" strokeWidth="1.2" />
      <text x="20" y="32" fill="#fb7185" fontSize="14" fontWeight="black">✗ ERRO: DEDO NO MEIO DA CASA</text>
      <text x="20" y="52" fill="#fda4af" fontSize="11">Causa zumbido metálico (fret buzz) e exige força excessiva</text>

      <g transform="translate(20, 75)">
        <rect x="0" y="30" width="380" height="40" rx="4" fill="#332211" stroke="#5c4033" />
        <line x1="0" y1="50" x2="380" y2="50" stroke="#cbd5e1" strokeWidth="3" />

        <line x1="120" y1="20" x2="120" y2="80" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
        <line x1="280" y1="20" x2="280" y2="80" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />

        {/* Dedo longe no meio */}
        <ellipse cx="190" cy="50" rx="16" ry="14" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
        <text x="190" y="55" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">D1</text>
        <text x="190" y="98" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">Longe demais ➔ ZUMBIDO!</text>
      </g>
    </g>
  </svg>
);

/** 2. Afinação das 6 Cordas & Atribuição de Dedos (P-I-M-A) */
export const GuitarTuningStringsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#f59e0b" fontSize="14" fontWeight="black" letterSpacing="1">
        AFINAÇÃO PADRÃO (E-A-D-G-B-E) & MAPA DA MÃO DIREITA (P-I-M-A)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Calibres proporcionais: do bordão mais grave (6ª) até a prima mais aguda (1ª)
      </text>
    </g>

    <g transform="translate(60, 65)">
      {[
        { n: '6ª Corda: Mi (E2)', role: 'Polegar (P) - Baixo Grave', w: 4.5, c: '#eab308' },
        { n: '5ª Corda: Lá (A2)', role: 'Polegar (P) - Baixo', w: 3.8, c: '#ca8a04' },
        { n: '4ª Corda: Ré (D3)', role: 'Polegar (P) - Baixo', w: 3.0, c: '#a16207' },
        { n: '3ª Corda: Sol (G3)', role: 'Indicador (I) - Agudos', w: 2.2, c: '#06b6d4' },
        { n: '2ª Corda: Si (B3)', role: 'Médio (M) - Agudos', w: 1.6, c: '#10b981' },
        { n: '1ª Corda: Mi (E4)', role: 'Anelar (A) - Prima Solo', w: 1.0, c: '#a855f7' },
      ].map((s, i) => {
        const y = i * 22 + 10;
        return (
          <g key={i}>
            <text x="0" y={y + 4} fill="#cbd5e1" fontSize="11" fontWeight="bold">{s.n}</text>
            <line x1="170" y1={y} x2="620" y2={y} stroke={s.c} strokeWidth={s.w} strokeLinecap="round" />
            <rect x="640" y={y - 8} width="220" height="18" rx="4" fill="rgba(255,255,255,0.06)" />
            <text x="650" y={y + 5} fill="#94a3b8" fontSize="10">{s.role}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 3. Acordes Abertos Essenciais (C, G, D, Em, Am) */
export const OpenChordsShapesDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        ACORDES ABERTOS ESSENCIAIS (SHAPES DA PRIMEIRA POSIÇÃO)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Memorize as formas primárias que destravam centenas de canções populares
      </text>
    </g>

    <g transform="translate(50, 70)">
      {[
        { name: 'Dó Maior (C)', notes: 'X 3 2 0 1 0', color: '#6366f1' },
        { name: 'Sol Maior (G)', notes: '3 2 0 0 0 3', color: '#10b981' },
        { name: 'Ré Maior (D)', notes: 'X X 0 2 3 2', color: '#06b6d4' },
        { name: 'Mi Menor (Em)', notes: '0 2 2 0 0 0', color: '#f59e0b' },
        { name: 'Lá Menor (Am)', notes: 'X 0 2 2 1 0', color: '#a855f7' },
      ].map((ch, i) => {
        const x = i * 175;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="160" height="110" rx="10" fill="rgba(255,255,255,0.04)" stroke={ch.color} strokeWidth="1.2" />
            <text x="80" y="28" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{ch.name}</text>
            <rect x="20" y="42" width="120" height="26" rx="6" fill="#1e1b4b" />
            <text x="80" y="59" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="mono" letterSpacing="2">
              {ch.notes}
            </text>
            <text x="80" y="92" textAnchor="middle" fill="#94a3b8" fontSize="9">
              {i < 3 ? 'Tríade Maior Aberta' : 'Tríade Menor Natural'}
            </text>
          </g>
        );
      })}
    </g>
  </svg>
);
