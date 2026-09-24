/**
 * illustrations/TheoryDiagrams.tsx
 * Diagramas vetoriais SVG de alta resolução para as lições de Teoria Musical.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Diagrama da Régua Intervalar Graduada (12 Semitons) */
export const IntervalRulerDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">A RÉGUA INTERVALAR (DISTÂNCIA EM SEMITONS)</text>
    <g transform="translate(25, 45)">
      {/* Régua horizontal */}
      <rect x={0} y={15} width={410} height={20} rx={4} fill="#1e293b" stroke="#475569" strokeWidth={1} />
      {[
        { st: 0, name: '1J', label: 'Uníssono' },
        { st: 1, name: '2m', label: 'Segunda m' },
        { st: 2, name: '2M', label: 'Segunda M' },
        { st: 3, name: '3m', label: 'Terça m' },
        { st: 4, name: '3M', label: 'Terça M' },
        { st: 5, name: '4J', label: 'Quarta J' },
        { st: 6, name: 'Trít', label: 'Trítono' },
        { st: 7, name: '5J', label: 'Quinta J' },
        { st: 8, name: '6m', label: 'Sexta m' },
        { st: 9, name: '6M', label: 'Sexta M' },
        { st: 10, name: '7m', label: 'Sétima m' },
        { st: 11, name: '7M', label: 'Sétima M' },
        { st: 12, name: '8J', label: 'Oitava' },
      ].map((int, i) => {
        const x = i * (410 / 12);
        const isCore = int.st === 0 || int.st === 4 || int.st === 7 || int.st === 12;
        return (
          <g key={i}>
            <line x1={x} y1={10} x2={x} y2={40} stroke={isCore ? '#38bdf8' : '#64748b'} strokeWidth={isCore ? 2 : 1} />
            <circle cx={x} cy={25} r={isCore ? 7 : 5} fill={isCore ? '#0284c7' : '#334155'} stroke="#ffffff" strokeWidth={1} />
            <text x={x} y={28} textAnchor="middle" fill="#ffffff" fontSize={isCore ? '8.5' : '7.5'} fontWeight="bold">{int.st}</text>
            <text x={x} y={54} textAnchor="middle" fill={isCore ? '#38bdf8' : '#94a3b8'} fontSize="8" fontWeight="bold">{int.name}</text>
          </g>
        );
      })}
    </g>
    <text x="230" y="136" textAnchor="middle" fill="#cbd5e1" fontSize="10">Cada traste do violão ou tecla adjacente no piano = <strong>1 semitom exato</strong></text>
  </svg>
);

/** 2. Diagrama dos Graus Harmônicos e Funções (Tônica, Subdominante, Dominante) */
export const HarmonicDegreesDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">CAMPO HARMÔNICO MAIOR: AS 3 GRANDES FAMÍLIAS</text>
    <g transform="translate(35, 40)">
      {/* Família Tônica (Repouso) */}
      <rect x={0} y={10} width={120} height={70} rx={10} fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth={1.5} />
      <text x={60} y={28} textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="black">TÔNICA (REPOUSO)</text>
      <text x={60} y={50} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">I • iii • vi</text>
      <text x={60} y={68} textAnchor="middle" fill="#94a3b8" fontSize="8.5">C • Em • Am</text>

      {/* Família Subdominante (Movimento) */}
      <rect x={135} y={10} width={120} height={70} rx={10} fill="rgba(14, 165, 233, 0.15)" stroke="#0ea5e9" strokeWidth={1.5} />
      <text x={195} y={28} textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="black">SUBDOMINANTE</text>
      <text x={195} y={50} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">IV • ii</text>
      <text x={195} y={68} textAnchor="middle" fill="#94a3b8" fontSize="8.5">F • Dm</text>

      {/* Família Dominante (Tensão / Resolução) */}
      <rect x={270} y={10} width={120} height={70} rx={10} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={330} y={28} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="black">DOMINANTE (TENSÃO)</text>
      <text x={330} y={50} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">V • vii°</text>
      <text x={330} y={68} textAnchor="middle" fill="#94a3b8" fontSize="8.5">G7 • Bdim</text>
    </g>
    <text x="230" y="138" textAnchor="middle" fill="#e2e8f0" fontSize="10">O fluxo natural da música ocidental: <strong>Repouso (I) ➔ Afastamento (IV) ➔ Tensão (V) ➔ Resolução (I)</strong></text>
  </svg>
);

/** 3. Diagrama da Construção de Tétrades (7ª Maior e 7ª Menor) */
export const TetradFormulaDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="20" textAnchor="middle" fill="#a855f7" fontSize="12" fontWeight="black">TÉTRADES: EMPILHAMENTO DE 3 TERÇAS SUCESSIVAS</text>
    <g transform="translate(50, 42)">
      {[
        { label: 'Fundamental (1)', note: 'C', color: '#ef4444', desc: 'Raiz tonal' },
        { label: 'Terça (3ª)', note: 'E', color: '#3b82f6', desc: 'Define Maior/Menor' },
        { label: 'Quinta (5ª)', note: 'G', color: '#10b981', desc: 'Estabilidade' },
        { label: 'Sétima (7ª)', note: 'B', color: '#a855f7', desc: 'Cor & Sofisticação' },
      ].map((step, i) => (
        <g key={i} transform={`translate(${i * 92}, 0)`}>
          <rect x={0} y={0} width={82} height={65} rx={8} fill="rgba(255,255,255,0.03)" stroke={step.color} strokeWidth={1.5} />
          <circle cx={41} cy={22} r={14} fill={step.color} />
          <text x={41} y={27} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{step.note}</text>
          <text x={41} y={48} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">{step.label}</text>
          <text x={41} y={58} textAnchor="middle" fill="#94a3b8" fontSize="7.5">{step.desc}</text>
        </g>
      ))}
    </g>
    <text x="230" y="136" textAnchor="middle" fill="#cbd5e1" fontSize="10">Exemplo: C7M (Dó com Sétima Maior) = C + E + G + B</text>
  </svg>
);
