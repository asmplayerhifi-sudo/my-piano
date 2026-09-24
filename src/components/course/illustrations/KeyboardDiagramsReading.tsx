/**
 * illustrations/KeyboardDiagramsReading.tsx
 * Diagramas panorâmicos padronizados (960x250) para leitura de partitura (Claves de Sol e Fá, Mãos Juntas).
 * Regra: Componentes vetoriais puros, viewBox padronizado (0 0 960 250), SVG responsivo (< 300 linhas).
 */

import React from 'react';

/** 1. Leitura na Clave de Sol (t2-1: 5 Linhas, 4 Espaços & Dó Central C3) */
export const TrebleStaffReadingDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Clave de Sol e Título */}
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#818cf8" fontSize="14" fontWeight="black" letterSpacing="1">
        𝄞 CLAVE DE SOL (PENTAGRAMA SUPERIOR • MÃO DIREITA)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Mnemônico das 5 Linhas: "Minha Sorte Sempre Rende Frutos" • Partindo do Dó Central (C3)
      </text>
    </g>

    {/* Pentagrama e Notas */}
    <g transform="translate(50, 68)">
      {/* 5 Linhas do Pentagrama */}
      {[24, 50, 76, 102, 128].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="710" y2={y} stroke="#475569" strokeWidth="1.5" />
      ))}

      {/* Símbolo da Clave de Sol */}
      <text x="15" y="118" fill="#a5b4fc" fontSize="84" fontFamily="serif" fontWeight="bold">𝄞</text>

      {/* Dó Central C3 na Linha Suplementar Inferior */}
      <g transform="translate(105, 0)">
        <line x1="-18" y1="154" x2="18" y2="154" stroke="#38bdf8" strokeWidth="2.5" />
        <ellipse cx="0" cy="154" rx="12" ry="8.5" fill="#38bdf8" transform="rotate(-20 0 154)" />
        <text x="0" y="136" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="black">★ C3</text>
        <text x="0" y="174" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">Dó Central</text>
      </g>

      {/* Linhas (Mi3, Sol3, Si3, Ré4, Fá4) */}
      {[
        { x: 210, y: 128, name: 'Mi3 (E3)', l: '1ª Linha', c: '#6366f1' },
        { x: 320, y: 102, name: 'Sol3 (G3)', l: '2ª Linha (Chave)', c: '#38bdf8' },
        { x: 430, y: 76, name: 'Si3 (B3)', l: '3ª Linha', c: '#10b981' },
        { x: 540, y: 50, name: 'Ré4 (D4)', l: '4ª Linha', c: '#f59e0b' },
        { x: 650, y: 24, name: 'Fá4 (F4)', l: '5ª Linha', c: '#f43f5e' },
      ].map((n, i) => (
        <g key={i}>
          <ellipse cx={n.x} cy={n.y} rx="13" ry="9" fill={n.c} transform={`rotate(-20 ${n.x} ${n.y})`} />
          <text x={n.x} y={n.y - 15} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{n.name}</text>
          <text x={n.x} y={154} textAnchor="middle" fill="#94a3b8" fontSize="9.5">{n.l}</text>
        </g>
      ))}

      {/* 4 Espaços destacados à direita */}
      <g transform="translate(730, 10)">
        <rect x="0" y="0" width="145" height="135" rx="10" fill="rgba(99, 102, 241, 0.08)" stroke="#6366f1" strokeWidth="1.2" />
        <text x="72" y="24" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="black">4 ESPAÇOS:</text>
        <text x="18" y="48" fill="#e2e8f0" fontSize="10">• 4º E: Mi4 (E4)</text>
        <text x="18" y="70" fill="#e2e8f0" fontSize="10">• 3º E: Dó4 (C4)</text>
        <text x="18" y="92" fill="#e2e8f0" fontSize="10">• 2º E: Lá3 (A3)</text>
        <text x="18" y="114" fill="#e2e8f0" fontSize="10">• 1º E: Fá3 (F3)</text>
      </g>
    </g>
  </svg>
);

/** 2. Leitura na Clave de Fá (t3-1: 5 Linhas, 4 Espaços & Dó Central C3) */
export const BassStaffReadingDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Clave de Fá e Título */}
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#f59e0b" fontSize="14" fontWeight="black" letterSpacing="1">
        𝄢 CLAVE DE FÁ (PENTAGRAMA INFERIOR • MÃO ESQUERDA)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Os 2 pontos abraçam a 4ª linha (Fá2 / F2) • O Dó Central C3 repousa na linha suplementar superior
      </text>
    </g>

    {/* Pentagrama e Notas */}
    <g transform="translate(50, 68)">
      {/* 5 Linhas do Pentagrama */}
      {[24, 50, 76, 102, 128].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="710" y2={y} stroke={i === 1 ? '#f59e0b' : '#475569'} strokeWidth={i === 1 ? '2.5' : '1.5'} />
      ))}

      {/* Símbolo da Clave de Fá */}
      <text x="15" y="105" fill="#fde68a" fontSize="76" fontFamily="serif" fontWeight="bold">𝄢</text>

      {/* Linhas (Sol1, Si1, Ré2, Fá2, Lá2) */}
      {[
        { x: 130, y: 128, name: 'Sol1 (G1)', l: '1ª Linha', c: '#10b981' },
        { x: 240, y: 102, name: 'Si1 (B1)', l: '2ª Linha', c: '#06b6d4' },
        { x: 350, y: 76, name: 'Ré2 (D2)', l: '3ª Linha', c: '#818cf8' },
        { x: 460, y: 50, name: 'Fá2 (F2)', l: '4ª Linha (Foco)', c: '#f59e0b' },
        { x: 570, y: 24, name: 'Lá2 (A2)', l: '5ª Linha', c: '#f43f5e' },
      ].map((n, i) => (
        <g key={i}>
          <ellipse cx={n.x} cy={n.y} rx="13" ry="9" fill={n.c} transform={`rotate(-20 ${n.x} ${n.y})`} />
          <text x={n.x} y={n.y - 15} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{n.name}</text>
          <text x={n.x} y={154} textAnchor="middle" fill="#94a3b8" fontSize="9.5">{n.l}</text>
        </g>
      ))}

      {/* Dó Central (C3) na Linha Suplementar Superior */}
      <g transform="translate(660, 0)">
        <line x1="-18" y1="-2" x2="18" y2="-2" stroke="#38bdf8" strokeWidth="2.5" />
        <ellipse cx="0" cy="-2" rx="13" ry="9" fill="#38bdf8" transform="rotate(-20 0 -2)" />
        <text x="0" y="-18" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="black">★ C3</text>
        <text x="0" y="154" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="bold">Dó Central</text>
      </g>

      {/* 4 Espaços destacados à direita */}
      <g transform="translate(730, 10)">
        <rect x="0" y="0" width="145" height="135" rx="10" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" strokeWidth="1.2" />
        <text x="72" y="24" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="black">4 ESPAÇOS:</text>
        <text x="18" y="48" fill="#e2e8f0" fontSize="10">• 4º E: Sol2 (G2)</text>
        <text x="18" y="70" fill="#e2e8f0" fontSize="10">• 3º E: Mi2 (E2)</text>
        <text x="18" y="92" fill="#e2e8f0" fontSize="10">• 2º E: Dó2 (C2)</text>
        <text x="18" y="114" fill="#e2e8f0" fontSize="10">• 1º E: Lá1 (A1)</text>
      </g>
    </g>
  </svg>
);

/** 3. Coordenação Motora & Mãos Juntas (t3-3: Hands Together) */
export const BimanualCoordinationDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">
        MÃOS JUNTAS (COORDENAÇÃO BIMANUAL &amp; SINCRONIA VERTICAL)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Sincronize os pontos de ataque no tempo 1 de cada compasso antes de acelerar frases rítmicas
      </text>
    </g>

    <g transform="translate(50, 60)">
      {/* Pauta Superior (Mão Direita - Ciano) */}
      <rect x="0" y="0" width="860" height="58" rx="8" fill="rgba(6, 182, 212, 0.08)" stroke="#06b6d4" strokeWidth="1.2" />
      <text x="24" y="34" fill="#22d3ee" fontSize="12" fontWeight="bold">MÃO DIREITA (MD): Melodia</text>
      {[240, 390, 540, 690].map((x, i) => (
        <circle key={i} cx={x} cy="29" r="11" fill="#06b6d4" />
      ))}

      {/* Linhas Verticais de Sincronia Dotted */}
      {[240, 540].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="29" x2={x} y2="120" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4 4" />
          <rect x={x - 52} y="62" width="104" height="24" rx="5" fill="#581c87" />
          <text x={x} y="78" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="black">JUNTO (TEMPO {i === 0 ? '1' : '3'})</text>
        </g>
      ))}

      {/* Pauta Inferior (Mão Esquerda - Âmbar) */}
      <rect x="0" y="92" width="860" height="58" rx="8" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="24" y="126" fill="#fde68a" fontSize="12" fontWeight="bold">MÃO ESQUERDA (ME): Baixo / Acorde</text>
      {[240, 540].map((x, i) => (
        <circle key={i} cx={x} cy="120" r="14" fill="#f59e0b" />
      ))}
    </g>
  </svg>
);
