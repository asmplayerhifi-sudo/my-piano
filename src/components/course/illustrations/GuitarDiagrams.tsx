/**
 * illustrations/GuitarDiagrams.tsx
 * Diagramas vetoriais SVG de alta resolução para as lições de Violão.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Diagrama das 6 Cordas do Violão e Afinação Padrão */
export const GuitarStringsDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">AS 6 CORDAS DO VIOLÃO (GRAVE ➔ AGUDO)</text>
    <g transform="translate(45, 38)">
      {[
        { num: '6ª', name: 'Mi (E)', note: 'E2', gauge: 4.5, color: '#f59e0b', desc: 'Bordão mais grave' },
        { num: '5ª', name: 'Lá (A)', note: 'A2', gauge: 3.8, color: '#f59e0b', desc: 'Bordão médio' },
        { num: '4ª', name: 'Ré (D)', note: 'D3', gauge: 3.0, color: '#f59e0b', desc: 'Bordão agudo' },
        { num: '3ª', name: 'Sol (G)', note: 'G3', gauge: 2.2, color: '#38bdf8', desc: 'Prima grave' },
        { num: '2ª', name: 'Si (B)', note: 'B3', gauge: 1.6, color: '#38bdf8', desc: 'Prima média' },
        { num: '1ª', name: 'Mi (E)', note: 'E4', gauge: 1.0, color: '#38bdf8', desc: 'Mizinha mais aguda' },
      ].map((str, i) => {
        const y = i * 16 + 10;
        return (
          <g key={i}>
            <text x={0} y={y + 4} fill="#a5b4fc" fontSize="10" fontWeight="black">{str.num}</text>
            <line x1={30} y1={y} x2={270} y2={y} stroke={str.color} strokeWidth={str.gauge} strokeLinecap="round" />
            <text x={285} y={y + 4} fill="#ffffff" fontSize="10" fontWeight="bold">{str.name}</text>
            <text x={345} y={y + 4} fill="#94a3b8" fontSize="8.5">{str.desc}</text>
          </g>
        );
      })}
    </g>
    <text x="230" y="146" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Polegar dedilha as cordas 6, 5 e 4 • Dedos I-M-A dedilham as cordas 3, 2 e 1</text>
  </svg>
);

/** 2. Diagrama do Sistema CAGED ao Longo do Braço */
export const CAGEDShapesDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="20" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="black">O SISTEMA CAGED: 5 FORMAS INTERLIGADAS DO MESMO ACORDE</text>
    <g transform="translate(25, 36)">
      {[
        { letter: 'C', shape: 'Shape de Dó', fret: 'Casa 0-3', color: '#ef4444' },
        { letter: 'A', shape: 'Shape de Lá', fret: 'Casa 2-5', color: '#f59e0b' },
        { letter: 'G', shape: 'Shape de Sol', fret: 'Casa 4-7', color: '#10b981' },
        { letter: 'E', shape: 'Shape de Mi', fret: 'Casa 7-9', color: '#0ea5e9' },
        { letter: 'D', shape: 'Shape de Ré', fret: 'Casa 9-12', color: '#a855f7' },
      ].map((c, i) => (
        <g key={i} transform={`translate(${i * 82}, 0)`}>
          <rect x={0} y={10} width={74} height={68} rx={10} fill="rgba(255,255,255,0.03)" stroke={c.color} strokeWidth={1.5} />
          <circle cx={37} cy={28} r={14} fill={c.color} />
          <text x={37} y={33} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">{c.letter}</text>
          <text x={37} y={56} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">{c.shape}</text>
          <text x={37} y={70} textAnchor="middle" fill="#94a3b8" fontSize="8">{c.fret}</text>
          {i < 4 && (
            <path d={`M 74,44 L 82,44`} stroke="#64748b" strokeWidth={1.5} strokeDasharray="2 2" />
          )}
        </g>
      ))}
    </g>
    <text x="230" y="136" textAnchor="middle" fill="#e2e8f0" fontSize="10">A mesma nota/acorde se conecta ciclicamente: C ➔ A ➔ G ➔ E ➔ D ➔ C</text>
  </svg>
);

/** 3. Diagrama da Técnica da Pestana (Barre) */
export const PestanaBarreDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">MECÂNICA DA PESTANA PERFEITA (SEM FORÇAR A MÃO)</text>
    <g transform="translate(60, 42)">
      {/* Braço do Violão */}
      <rect x={0} y={0} width={200} height={70} rx={4} fill="#1e1b2e" stroke="#475569" strokeWidth={1} />
      {/* Trastes */}
      <line x1={50} y1={0} x2={50} y2={70} stroke="#94a3b8" strokeWidth={2.5} />
      <line x1={110} y1={0} x2={110} y2={70} stroke="#94a3b8" strokeWidth={2.5} />
      <line x1={170} y1={0} x2={170} y2={70} stroke="#94a3b8" strokeWidth={2.5} />
      {/* Cordas */}
      {[10, 22, 34, 46, 58, 70].map((y, i) => (
        <line key={i} x1={0} y1={y} x2={200} y2={y} stroke="#f59e0b" strokeWidth={1 + i * 0.4} />
      ))}
      {/* Pestana (Dedo 1 retificado colado ao traste) */}
      <rect x={40} y={4} width={8} height={64} rx={4} fill="#6366f1" stroke="#ffffff" strokeWidth={1.5} />
      <text x={44} y={38} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black">1</text>
    </g>
    {/* Dicas laterais com checkmarks */}
    <g transform="translate(285, 45)">
      <text x={0} y={15} fill="#34d399" fontSize="10" fontWeight="bold">✓ Dedo 1 colado ao traste metálico</text>
      <text x={0} y={32} fill="#34d399" fontSize="10" fontWeight="bold">✓ Leve rotação lateral do indicador</text>
      <text x={0} y={49} fill="#34d399" fontSize="10" fontWeight="bold">✓ Alavanca do braço, não pinça do polegar</text>
      <text x={0} y={66} fill="#fbbf24" fontSize="9">Polegar relaxado atrás na meia altura</text>
    </g>
  </svg>
);

/** 4. Diagrama de Batidas e Ritmo (Flechas de Palhetada / Levada) */
export const StrummingPatternDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">PADRÃO DE BATIDA: PULSO CONTÍNUO (BAIXO &amp; CIMA)</text>
    <g transform="translate(40, 42)">
      {[
        { beat: '1', sub: 'e', d1: '↓ BAIXO', d2: '↑ CIMA', active1: true, active2: true },
        { beat: '2', sub: 'e', d1: '↓ BAIXO', d2: '↑ CIMA', active1: true, active2: false },
        { beat: '3', sub: 'e', d1: '↓ BAIXO', d2: '↑ CIMA', active1: true, active2: true },
        { beat: '4', sub: 'e', d1: '↓ BAIXO', d2: '↑ CIMA', active1: true, active2: false },
      ].map((b, i) => (
        <g key={i} transform={`translate(${i * 95}, 0)`}>
          <rect x={0} y={0} width={85} height={70} rx={8} fill="rgba(255,255,255,0.02)" stroke="#334155" strokeWidth={1} />
          {/* Tempo Principal (Batida para Baixo) */}
          <rect x={6} y={8} width={34} height={40} rx={5} fill={b.active1 ? 'rgba(56, 189, 248, 0.25)' : 'transparent'} stroke={b.active1 ? '#38bdf8' : '#475569'} strokeWidth={1} />
          <text x={23} y={24} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{b.beat}</text>
          <text x={23} y={40} textAnchor="middle" fill={b.active1 ? '#38bdf8' : '#64748b'} fontSize="14" fontWeight="black">↓</text>
          {/* Contratempo (Batida para Cima) */}
          <rect x={45} y={8} width={34} height={40} rx={5} fill={b.active2 ? 'rgba(245, 158, 11, 0.25)' : 'transparent'} stroke={b.active2 ? '#f59e0b' : '#475569'} strokeWidth={1} />
          <text x={62} y={24} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">{b.sub}</text>
          <text x={62} y={40} textAnchor="middle" fill={b.active2 ? '#f59e0b' : '#64748b'} fontSize="14" fontWeight="black">↑</text>
          <text x={42} y={62} textAnchor="middle" fill="#64748b" fontSize="8.5">Tempo {b.beat}</text>
        </g>
      ))}
    </g>
    <text x="230" y="136" textAnchor="middle" fill="#cbd5e1" fontSize="10">Mantenha a mão direita em pêndulo constante como um metrônomo invisível</text>
  </svg>
);
