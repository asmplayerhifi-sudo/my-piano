/**
 * illustrations/KeyboardDiagramsReading.tsx
 * Diagramas panorâmicos para leitura de partitura (Claves de Sol e Fá, Mãos Juntas).
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Leitura na Clave de Sol (5 Linhas & 4 Espaços) */
export const TrebleStaffReadingDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Clave de Sol e Título */}
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#818cf8" fontSize="14" fontWeight="black" letterSpacing="1">𝄞 CLAVE DE SOL (PENTAGRAMA SUPERIOR)</text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">Mnemônico das 5 Linhas: "Minha Sorte Sempre Rende Frutos"</text>
    </g>

    {/* Pentagrama e Notas */}
    <g transform="translate(60, 60)">
      {/* 5 Linhas do Pentagrama */}
      {[20, 42, 64, 86, 108].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="840" y2={y} stroke="#475569" strokeWidth="1.5" />
      ))}

      {/* Símbolo da Clave de Sol */}
      <text x="20" y="100" fill="#a5b4fc" fontSize="76" fontFamily="serif" fontWeight="bold">𝄞</text>

      {/* Linhas (Mi, Sol, Si, Ré, Fá) */}
      {[
        { x: 140, y: 108, name: 'Mi3 (E3)', l: '1ª Linha', c: '#6366f1' },
        { x: 260, y: 86, name: 'Sol3 (G3)', l: '2ª Linha (Chave)', c: '#38bdf8' },
        { x: 380, y: 64, name: 'Si3 (B3)', l: '3ª Linha', c: '#10b981' },
        { x: 500, y: 42, name: 'Ré4 (D4)', l: '4ª Linha', c: '#f59e0b' },
        { x: 620, y: 20, name: 'Fá4 (F4)', l: '5ª Linha', c: '#f43f5e' },
      ].map((n, i) => (
        <g key={i}>
          <ellipse cx={n.x} cy={n.y} rx="12" ry="8" fill={n.c} transform={`rotate(-20 ${n.x} ${n.y})`} />
          <text x={n.x} y={n.y - 16} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{n.name}</text>
          <text x={n.x} y={130} textAnchor="middle" fill="#94a3b8" fontSize="9">{n.l}</text>
        </g>
      ))}

      {/* Espaços destacados à direita */}
      <rect x="710" y="10" width="130" height="110" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" strokeWidth="1" />
      <text x="775" y="32" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="bold">4 ESPAÇOS:</text>
      <text x="775" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="10">4º Espaço: Mi4 (E4)</text>
      <text x="775" y="68" textAnchor="middle" fill="#cbd5e1" fontSize="10">3º Espaço: Dó4 (C4)</text>
      <text x="775" y="84" textAnchor="middle" fill="#cbd5e1" fontSize="10">2º Espaço: Lá3 (A3)</text>
      <text x="775" y="100" textAnchor="middle" fill="#cbd5e1" fontSize="10">1º Espaço: Fá3 (F3)</text>
    </g>
  </svg>
);

/** 2. Leitura na Clave de Fá (Bass Clef) */
export const BassStaffReadingDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Clave de Fá e Título */}
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#f59e0b" fontSize="14" fontWeight="black" letterSpacing="1">𝄢 CLAVE DE FÁ (UNIVERSO DOS GRAVES)</text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">Os 2 pontos abraçam a 4ª linha, definindo a nota Fá2 (F2)</text>
    </g>

    {/* Pentagrama e Notas */}
    <g transform="translate(60, 60)">
      {/* 5 Linhas do Pentagrama */}
      {[20, 42, 64, 86, 108].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="840" y2={y} stroke={i === 1 ? '#f59e0b' : '#475569'} strokeWidth={i === 1 ? '2.5' : '1.5'} />
      ))}

      {/* Símbolo da Clave de Fá */}
      <text x="20" y="90" fill="#fde68a" fontSize="68" fontFamily="serif" fontWeight="bold">𝄢</text>

      {/* Linhas (Sol, Si, Ré, Fá, Lá) */}
      {[
        { x: 140, y: 108, name: 'Sol1 (G1)', l: '1ª Linha', c: '#10b981' },
        { x: 260, y: 86, name: 'Si1 (B1)', l: '2ª Linha', c: '#06b6d4' },
        { x: 380, y: 64, name: 'Ré2 (D2)', l: '3ª Linha', c: '#818cf8' },
        { x: 500, y: 42, name: 'Fá2 (F2)', l: '4ª Linha (Foco)', c: '#f59e0b' },
        { x: 620, y: 20, name: 'Lá2 (A2)', l: '5ª Linha', c: '#f43f5e' },
      ].map((n, i) => (
        <g key={i}>
          <ellipse cx={n.x} cy={n.y} rx="12" ry="8" fill={n.c} transform={`rotate(-20 ${n.x} ${n.y})`} />
          <text x={n.x} y={n.y - 16} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{n.name}</text>
          <text x={n.x} y={130} textAnchor="middle" fill="#94a3b8" fontSize="9">{n.l}</text>
        </g>
      ))}

      {/* Dó Central (Linha Suplementar Superior) */}
      <g transform="translate(740, 0)">
        <line x1="-15" y1="0" x2="35" y2="0" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="10" cy="0" rx="12" ry="8" fill="#38bdf8" transform="rotate(-20 10 0)" />
        <text x="10" y="-14" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="black">★ Dó Central (C3)</text>
        <text x="10" y="30" textAnchor="middle" fill="#94a3b8" fontSize="9">Linha Suplementar</text>
      </g>
    </g>
  </svg>
);

/** 3. Coordenação Motora & Mãos Juntas (Hands Together) */
export const BimanualCoordinationDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">MÃOS JUNTAS (COORDENAÇÃO VERTICAL)</text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">Sincronize os pontos de ataque no tempo 1 antes de acelerar frases</text>
    </g>

    <g transform="translate(60, 70)">
      {/* Pauta Superior (Mão Direita - Ciano) */}
      <rect x="0" y="0" width="840" height="50" rx="8" fill="rgba(6, 182, 212, 0.08)" stroke="#06b6d4" strokeWidth="1" />
      <text x="20" y="30" fill="#22d3ee" fontSize="12" fontWeight="bold">MÃO DIREITA (MD): Melodia</text>
      {[220, 360, 500, 640].map((x, i) => (
        <circle key={i} cx={x} cy="25" r="10" fill="#06b6d4" />
      ))}

      {/* Linhas Verticais de Sincronia Dotted */}
      {[220, 500].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="25" x2={x} y2="95" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4 4" />
          <rect x={x - 45} y="48" width="90" height="20" rx="4" fill="#581c87" />
          <text x={x} y="62" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black">JUNTO (1)</text>
        </g>
      ))}

      {/* Pauta Inferior (Mão Esquerda - Âmbar) */}
      <rect x="0" y="70" width="840" height="50" rx="8" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" strokeWidth="1" />
      <text x="20" y="100" fill="#fde68a" fontSize="12" fontWeight="bold">MÃO ESQUERDA (ME): Baixo</text>
      {[220, 500].map((x, i) => (
        <circle key={i} cx={x} cy="95" r="14" fill="#f59e0b" />
      ))}
    </g>
  </svg>
);
