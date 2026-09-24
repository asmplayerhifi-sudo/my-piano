/**
 * illustrations/KeyboardDiagrams.tsx
 * Diagramas vetoriais SVG de alta resolução para as lições de Teclado e Piano.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Diagrama de Postura da Mão e Curvatura dos Dedos */
export const HandPostureDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <defs>
      <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Teclas de Fundo */}
    <g transform="translate(40, 110)">
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((x, i) => (
        <rect key={i} x={x} y={0} width={34} height={40} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1} />
      ))}
      {[24, 60, 132, 168, 204, 276, 312].map((x, i) => (
        <rect key={i} x={x} y={-5} width={22} height={28} rx={3} fill="#090d16" stroke="#475569" strokeWidth={1} />
      ))}
    </g>
    {/* Arco da Cúpula da Mão */}
    <path d="M 60,110 C 80,40 180,25 240,45 C 280,60 320,85 340,110" fill="url(#handGrad)" stroke="#818cf8" strokeWidth={3} strokeDasharray="4 2" />
    {/* Esfera / Bola de Tênis imaginária de apoio */}
    <circle cx="180" cy="72" r="32" fill="rgba(34, 211, 238, 0.12)" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="3 3" />
    <text x="180" y="76" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">BOLA IMAGINÁRIA</text>
    {/* Dedos curvados tocando as teclas */}
    {[{ x: 100, f: '1' }, { x: 140, f: '2' }, { x: 180, f: '3' }, { x: 220, f: '4' }, { x: 260, f: '5' }].map((d, i) => (
      <g key={i}>
        <circle cx={d.x} cy={110} r={10} fill="#6366f1" stroke="#ffffff" strokeWidth={1.5} />
        <text x={d.x} y={114} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">{d.f}</text>
      </g>
    ))}
    {/* Rótulo de Alinhamento */}
    <text x="375" y="55" fill="#e0e7ff" fontSize="11" fontWeight="bold">✓ Pulso Alinhado</text>
    <text x="375" y="75" fill="#94a3b8" fontSize="9">Dedos em cúpula natural</text>
    <text x="375" y="90" fill="#22d3ee" fontSize="9">Toque na polpa do dedo</text>
  </svg>
);

/** 2. Diagrama de Numeração Biomecânica dos Dedos (1 a 5) */
export const FingeringHandsDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    {/* Mão Esquerda (ME) */}
    <g transform="translate(30, 15)">
      <rect x={0} y={0} width={180} height={130} rx={12} fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth={1} />
      <text x={90} y={24} textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="black" letterSpacing="1">MÃO ESQUERDA (ME)</text>
      {[{ x: 30, y: 70, f: '5', n: 'Mínimo' }, { x: 60, y: 55, f: '4', n: 'Anelar' }, { x: 90, y: 48, f: '3', n: 'Médio' }, { x: 120, y: 55, f: '2', n: 'Indicador' }, { x: 150, y: 80, f: '1', n: 'Polegar' }].map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={13} fill="#4f46e5" stroke="#ffffff" strokeWidth={1.5} />
          <text x={d.x} y={d.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">{d.f}</text>
          <text x={d.x} y={d.y + 28} textAnchor="middle" fill="#94a3b8" fontSize="8">{d.n}</text>
        </g>
      ))}
      <text x={90} y={120} textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="bold">Grave ➔ Agudo: 5 ➔ 1</text>
    </g>
    {/* Mão Direita (MD) */}
    <g transform="translate(250, 15)">
      <rect x={0} y={0} width={180} height={130} rx={12} fill="rgba(14, 165, 233, 0.08)" stroke="#0284c7" strokeWidth={1} />
      <text x={90} y={24} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="black" letterSpacing="1">MÃO DIREITA (MD)</text>
      {[{ x: 30, y: 80, f: '1', n: 'Polegar' }, { x: 60, y: 55, f: '2', n: 'Indicador' }, { x: 90, y: 48, f: '3', n: 'Médio' }, { x: 120, y: 55, f: '4', n: 'Anelar' }, { x: 150, y: 70, f: '5', n: 'Mínimo' }].map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={13} fill="#0284c7" stroke="#ffffff" strokeWidth={1.5} />
          <text x={d.x} y={d.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">{d.f}</text>
          <text x={d.x} y={d.y + 28} textAnchor="middle" fill="#94a3b8" fontSize="8">{d.n}</text>
        </g>
      ))}
      <text x={90} y={120} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">Grave ➔ Agudo: 1 ➔ 5</text>
    </g>
  </svg>
);

/** 3. Diagrama da Topografia de Teclas (2 e 3 teclas pretas + Dó Central) */
export const BlackKeyGroupsDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    {/* Chaves de agrupamento superior */}
    <g transform="translate(60, 15)">
      {/* Grupo de 2 */}
      <rect x={24} y={5} width={48} height={18} rx={6} fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth={1} />
      <text x={48} y={17} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">GRUPO DE 2</text>
      {/* Grupo de 3 */}
      <rect x={120} y={5} width={72} height={18} rx={6} fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth={1} />
      <text x={156} y={17} textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="bold">GRUPO DE 3</text>
    </g>
    {/* Teclado */}
    <g transform="translate(60, 42)">
      {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'].map((name, i) => (
        <g key={i} transform={`translate(${i * 42}, 0)`}>
          <rect x={0} y={0} width={40} height={85} rx={5} fill={i === 0 || i === 7 ? 'rgba(56, 189, 248, 0.15)' : '#1e293b'} stroke={i === 0 ? '#38bdf8' : '#334155'} strokeWidth={i === 0 ? 2 : 1} />
          <text x={20} y={75} textAnchor="middle" fill={i === 0 ? '#38bdf8' : '#e2e8f0'} fontSize="11" fontWeight="bold">{name}</text>
          {i === 0 && <text x={20} y={45} textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="black">DÓ 4</text>}
        </g>
      ))}
      {/* Teclas Pretas */}
      {[{ x: 28, g: '2' }, { x: 70, g: '2' }, { x: 154, g: '3' }, { x: 196, g: '3' }, { x: 238, g: '3' }].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={0} width={26} height={52} rx={4} fill="#090d16" stroke={b.g === '2' ? '#f59e0b' : '#a855f7'} strokeWidth={1.5} />
        </g>
      ))}
    </g>
    <text x="230" y="146" textAnchor="middle" fill="#94a3b8" fontSize="10">O <strong>Dó</strong> fica sempre imediatamente à esquerda do grupo de <strong>2 teclas pretas</strong></text>
  </svg>
);

/** 4. Diagrama da Tríade Maior (Fundamental + 3M + 5J) */
export const TriadFormulaDiagram: React.FC<{ root?: string }> = ({ root = 'C' }) => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">FÓRMULA DA TRÍADE MAIOR: {root} = 1 + 3M + 5J</text>
    <g transform="translate(60, 40)">
      {/* Bloco 1: Fundamental */}
      <rect x={10} y={15} width={90} height={55} rx={10} fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth={1.5} />
      <text x={55} y={38} textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="black">FUNDAMENTAL</text>
      <text x={55} y={55} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Dó (C)</text>

      {/* Seta + 4 semitons */}
      <path d="M 105,42 L 135,42" stroke="#f59e0b" strokeWidth={2} markerEnd="url(#arrow)" />
      <text x={120} y={35} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">+4 semitons</text>

      {/* Bloco 2: Terça Maior */}
      <rect x={140} y={15} width={90} height={55} rx={10} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth={1.5} />
      <text x={185} y={38} textAnchor="middle" fill="#60a5fa" fontSize="13" fontWeight="black">TERÇA MAIOR</text>
      <text x={185} y={55} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Mi (E)</text>

      {/* Seta + 3 semitons */}
      <path d="M 235,42 L 265,42" stroke="#10b981" strokeWidth={2} />
      <text x={250} y={35} textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">+3 semitons</text>

      {/* Bloco 3: Quinta Justa */}
      <rect x={270} y={15} width={90} height={55} rx={10} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth={1.5} />
      <text x={315} y={38} textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="black">QUINTA JUSTA</text>
      <text x={315} y={55} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Sol (G)</text>
    </g>
    <text x="230" y="130" textAnchor="middle" fill="#cbd5e1" fontSize="10">Dedilhado padrão Mão Direita: <strong>1 (Polegar)</strong> • <strong>3 (Médio)</strong> • <strong>5 (Mínimo)</strong></text>
  </svg>
);

/** 5. Diagrama de Inversões de Acordes */
export const InversionsDiagram: React.FC = () => (
  <svg viewBox="0 0 460 160" className="w-full h-auto max-h-[160px] rounded-xl bg-slate-950/60 p-2 border border-white/10 select-none">
    <text x="230" y="22" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="black">INVERSÕES: LEI DO MENOR ESFORÇO</text>
    <g transform="translate(30, 36)">
      {/* Fundamental C */}
      <rect x={0} y={10} width={120} height={65} rx={10} fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth={1.5} />
      <text x={60} y={30} textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="black">FUNDAMENTAL (C)</text>
      <text x={60} y={52} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">C4 - E4 - G4</text>
      <text x={60} y={67} textAnchor="middle" fill="#94a3b8" fontSize="8.5">Baixo em C</text>

      {/* 1ª Inversão C/E */}
      <rect x={140} y={10} width={120} height={65} rx={10} fill="rgba(14, 165, 233, 0.15)" stroke="#0ea5e9" strokeWidth={1.5} />
      <text x={200} y={30} textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="black">1ª INVERSÃO (C/E)</text>
      <text x={200} y={52} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">E4 - G4 - C5</text>
      <text x={200} y={67} textAnchor="middle" fill="#94a3b8" fontSize="8.5">Baixo na Terça (E)</text>

      {/* 2ª Inversão C/G */}
      <rect x={280} y={10} width={120} height={65} rx={10} fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth={1.5} />
      <text x={340} y={30} textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="black">2ª INVERSÃO (C/G)</text>
      <text x={340} y={52} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">G4 - C5 - E5</text>
      <text x={340} y={67} textAnchor="middle" fill="#94a3b8" fontSize="8.5">Baixo na Quinta (G)</text>
    </g>
    <text x="230" y="132" textAnchor="middle" fill="#94a3b8" fontSize="10">A nota mais grave (baixo) sobe uma oitava, mantendo as mesmas notas na harmonia</text>
  </svg>
);
