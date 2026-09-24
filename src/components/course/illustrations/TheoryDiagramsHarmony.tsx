/**
 * illustrations/TheoryDiagramsHarmony.tsx
 * Diagramas panorâmicos para régua intervalar, funções harmônicas e ciclo das quintas.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Régua Acústica Completa de 12 Semitons */
export const IntervalRulerWideDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#a855f7" fontSize="14" fontWeight="black" letterSpacing="1">
        RÉGUA ACÚSTICA DOS 12 INTERVALOS (DISTÂNCIA EM SEMITONS)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Cada casa ou tecla cromática equivale a 1 semitom de distância física e harmônica
      </text>
    </g>

    <g transform="translate(30, 75)">
      {/* Régua Graduada */}
      <rect x="0" y="30" width="900" height="30" rx="6" fill="#1e1b4b" stroke="#4338ca" />

      {[
        { st: 0, name: '1J', label: 'Uníssono', c: '#a855f7' },
        { st: 1, name: '2m', label: '2ª Menor', c: '#f43f5e' },
        { st: 2, name: '2M', label: '2ª Maior', c: '#6366f1' },
        { st: 3, name: '3m', label: '3ª Menor', c: '#f43f5e' },
        { st: 4, name: '3M', label: '3ª Maior', c: '#10b981' },
        { st: 5, name: '4J', label: '4ª Justa', c: '#06b6d4' },
        { st: 6, name: 'TT', label: 'Trítono', c: '#e11d48' },
        { st: 7, name: '5J', label: '5ª Justa', c: '#10b981' },
        { st: 8, name: '6m', label: '6ª Menor', c: '#f43f5e' },
        { st: 9, name: '6M', label: '6ª Maior', c: '#6366f1' },
        { st: 10, name: '7m', label: '7ª Menor', c: '#f59e0b' },
        { st: 11, name: '7M', label: '7ª Maior', c: '#38bdf8' },
        { st: 12, name: '8J', label: 'Oitava', c: '#a855f7' },
      ].map((it, i) => {
        const x = i * 75;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <line x1="37" y1="20" x2="37" y2="70" stroke={it.c} strokeWidth={i === 6 ? '3' : '1.5'} />
            <circle cx="37" cy="45" r="14" fill={it.c} />
            <text x="37" y="50" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="black">{it.name}</text>
            <text x="37" y="15" textAnchor="middle" fill={it.c} fontSize="10" fontWeight="bold">{it.st} st</text>
            <text x="37" y="88" textAnchor="middle" fill="#94a3b8" fontSize="8">{it.label}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 2. Os 3 Pilares da Harmonia Funcional (Tônica, Subdominante, Dominante) */
export const HarmonicPillarsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        OS 3 PILARES DA HARMONIA FUNCIONAL (MAPA DAS SENSAÇÕES)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        A música se movimenta pelo ciclo contínuo: Repouso ➔ Afastamento ➔ Tensão ➔ Resolução
      </text>
    </g>

    <g transform="translate(50, 75)">
      {/* 1. Tônica */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="270" height="100" rx="12" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="black">1. TÔNICA (REPOUSO / LAR)</text>
        <text x="135" y="52" textAnchor="middle" fill="#ffffff" fontSize="12">Graus I, iii, vi (ex: C, Em, Am)</text>
        <rect x="15" y="65" width="240" height="22" rx="4" fill="#064e3b" />
        <text x="135" y="80" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">Sensação: Paz, Conclusão, Ponto Final</text>
      </g>

      {/* 2. Subdominante */}
      <g transform="translate(295, 0)">
        <rect x="0" y="0" width="270" height="100" rx="12" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" fill="#22d3ee" fontSize="13" fontWeight="black">2. SUBDOMINANTE (MOVIMENTO)</text>
        <text x="135" y="52" textAnchor="middle" fill="#ffffff" fontSize="12">Graus IV, ii (ex: F, Dm)</text>
        <rect x="15" y="65" width="240" height="22" rx="4" fill="#164e63" />
        <text x="135" y="80" textAnchor="middle" fill="#a5f3fc" fontSize="9" fontWeight="bold">Sensação: Caminhada, Esperança, Saída</text>
      </g>

      {/* 3. Dominante */}
      <g transform="translate(590, 0)">
        <rect x="0" y="0" width="270" height="100" rx="12" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" fill="#fb7185" fontSize="13" fontWeight="black">3. DOMINANTE (TENSÃO MÁXIMA)</text>
        <text x="135" y="52" textAnchor="middle" fill="#ffffff" fontSize="12">Graus V, vii° (ex: G7, Bdim)</text>
        <rect x="15" y="65" width="240" height="22" rx="4" fill="#881337" />
        <text x="135" y="80" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold">Sensação: Urgência, Trítono pedindo volta ao Lar</text>
      </g>
    </g>
  </svg>
);

/** 3. O Ciclo das Quintas e Quartas (Tonalidades & Armaduras) */
export const CircleOfFifthsClockDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        O CICLO DAS QUINTAS & QUARTAS (MAPA DAS TONALIDADES)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Para a direita: Quintas (+1 Sustenido ♯) | Para a esquerda: Quartas (+1 Bemol ♭)
      </text>
    </g>

    <g transform="translate(60, 75)">
      {[
        { k: 'C', a: '0 Acidentes', c: '#ffffff', d: 'Centro Neutro' },
        { k: 'G', a: '1♯ (Fá♯)', c: '#38bdf8', d: '5ª Justa Acima' },
        { k: 'D', a: '2♯ (Fá♯, Dó♯)', c: '#38bdf8', d: '2ª Quinta' },
        { k: 'A', a: '3♯', c: '#818cf8', d: '3ª Quinta' },
        { k: 'E', a: '4♯', c: '#a855f7', d: '4ª Quinta' },
        { k: 'F', a: '1♭ (Si♭)', c: '#f59e0b', d: '4ª Justa (Ciclo ♭)' },
        { k: 'B♭', a: '2♭ (Si♭, Mi♭)', c: '#f43f5e', d: '2ª Quarta' },
      ].map((ton, i) => {
        const x = i * 120;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="110" height="100" rx="10" fill="rgba(255,255,255,0.04)" stroke={ton.c} strokeWidth="1.2" />
            <circle cx="55" cy="30" r="16" fill={ton.c} />
            <text x="55" y="36" textAnchor="middle" fill="#09090b" fontSize="14" fontWeight="black">{ton.k}</text>
            <text x="55" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">{ton.a}</text>
            <text x="55" y="85" textAnchor="middle" fill="#94a3b8" fontSize="8">{ton.d}</text>
          </g>
        );
      })}
    </g>
  </svg>
);
