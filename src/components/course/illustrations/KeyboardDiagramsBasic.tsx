/**
 * illustrations/KeyboardDiagramsBasic.tsx
 * Diagramas panorâmicos de alta legibilidade para geografia e biomecânica do teclado.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Geografia das Teclas Pretas e Localização do Dó Central */
export const BlackKeyGeographyDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <defs>
      <linearGradient id="cKeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>

    {/* Título Interno & Guia de Orientação */}
    <rect x="20" y="15" width="220" height="34" rx="8" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="1" />
    <text x="32" y="36" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="sans-serif">GRUPOS DE 2 E 3 PRETAS</text>

    {/* Tag Dó à esquerda de 2 pretas */}
    <rect x="260" y="15" width="310" height="34" rx="8" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1" />
    <text x="272" y="36" fill="#a7f3d0" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Dó (C) = sempre à esquerda das 2 Pretas</text>

    {/* Tag Fá à esquerda de 3 pretas */}
    <rect x="590" y="15" width="350" height="34" rx="8" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="1" />
    <text x="602" y="36" fill="#fde68a" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Fá (F) = sempre à esquerda das 3 Pretas</text>

    {/* Representação das Teclas Brancas (2 Oitavas) */}
    <g transform="translate(60, 65)">
      {[0, 58, 116, 174, 232, 290, 348, 406, 464, 522, 580, 638, 696, 754].map((x, i) => {
        const isC = i === 0 || i === 7;
        const isMiddleC = i === 7;
        return (
          <g key={i}>
            <rect
              x={x}
              y={0}
              width={54}
              height={135}
              rx={6}
              fill={isMiddleC ? 'url(#cKeyGrad)' : '#1e293b'}
              stroke={isMiddleC ? '#818cf8' : '#334155'}
              strokeWidth={isMiddleC ? 2 : 1}
            />
            {isC && (
              <text x={x + 27} y={122} textAnchor="middle" fill={isMiddleC ? '#38bdf8' : '#e2e8f0'} fontSize="14" fontWeight="black">
                {isMiddleC ? 'C4' : 'C3'}
              </text>
            )}
          </g>
        );
      })}

      {/* Teclas Pretas com Destaque de Grupos */}
      {/* Grupo 1: 2 Pretas (Ciano) */}
      <rect x="38" y="-4" width="36" height="84" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="96" y="-4" width="36" height="84" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

      {/* Grupo 2: 3 Pretas (Roxo) */}
      <rect x="212" y="-4" width="36" height="84" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="270" y="-4" width="36" height="84" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="328" y="-4" width="36" height="84" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />

      {/* Grupo 3: 2 Pretas (Ciano - Dó Central) */}
      <rect x="444" y="-4" width="36" height="84" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="502" y="-4" width="36" height="84" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

      {/* Grupo 4: 3 Pretas (Roxo) */}
      <rect x="618" y="-4" width="36" height="84" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="676" y="-4" width="36" height="84" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="734" y="-4" width="36" height="84" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />

      {/* Indicador Flutuante do Dó Central */}
      <g transform="translate(433, 100)">
        <polygon points="0,-16 6,-26 -6,-26" fill="#38bdf8" />
        <rect x="-65" y="-55" width="130" height="26" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="0" y="-38" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">★ DÓ CENTRAL (C4)</text>
      </g>
    </g>
  </svg>
);

/** 2. Postura da Mão Curvada (Maçã Invisível & Alinhamento de Pulso) */
export const HandPostureBiomechanicsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Painel Esquerdo: Arco da Mão & Maçã Invisível */}
    <g transform="translate(40, 20)">
      <rect x="0" y="0" width="500" height="180" rx="14" fill="rgba(99, 102, 241, 0.06)" stroke="#4338ca" strokeWidth="1" />
      <text x="20" y="30" fill="#a5b4fc" fontSize="13" fontWeight="bold">CÚPULA NATURAL ("A MAÇÃ INVISÍVEL")</text>

      {/* Teclas no fundo */}
      {[50, 110, 170, 230, 290, 350, 410].map((x, i) => (
        <rect key={i} x={x} y="130" width="50" height="40" rx="4" fill="#1e293b" stroke="#334155" />
      ))}

      {/* Curvatura em Arco Suave */}
      <path d="M 60,135 C 100,45 280,30 390,70 C 420,85 440,110 445,135" fill="none" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />

      {/* Maçã ou Esfera Imaginária de Suporte */}
      <circle cx="250" cy="85" r="42" fill="rgba(34, 211, 238, 0.14)" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 4" />
      <text x="250" y="82" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="bold">ESFERA DE APOIO</text>
      <text x="250" y="98" textAnchor="middle" fill="#94a3b8" fontSize="9">Articulações firmes e arqueadas</text>

      {/* 5 Dedos posicionados na ponta */}
      {[{ x: 95, f: '1' }, { x: 170, f: '2' }, { x: 250, f: '3' }, { x: 330, f: '4' }, { x: 410, f: '5' }].map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy="135" r="14" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
          <text x={d.x} y="139" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{d.f}</text>
        </g>
      ))}
    </g>

    {/* Painel Direito: Checklist de Postura & Erros Comuns */}
    <g transform="translate(560, 20)">
      <rect x="0" y="0" width="360" height="180" rx="14" fill="rgba(16, 185, 129, 0.05)" stroke="#059669" strokeWidth="1" />
      <text x="20" y="30" fill="#34d399" fontSize="13" fontWeight="bold">CHECKLIST BIOMECÂNICO</text>

      <g transform="translate(20, 55)" className="space-y-4">
        <text x="0" y="0" fill="#f8fafc" fontSize="11" fontWeight="bold">✓ Antebraço nivelado:</text>
        <text x="0" y="16" fill="#94a3b8" fontSize="10">Linha reta suave do cotovelo ao dorso da mão.</text>

        <text x="0" y="44" fill="#f8fafc" fontSize="11" fontWeight="bold">✓ Toque na polpa carnuda:</text>
        <text x="0" y="60" fill="#94a3b8" fontSize="10">Dedos 2 a 5 em arco; polegar toca com a borda lateral.</text>

        <text x="0" y="88" fill="#f8fafc" fontSize="11" fontWeight="bold">✓ Peso solto (Gravidade):</text>
        <text x="0" y="104" fill="#94a3b8" fontSize="10">Nunca aperte com força bruta; solte o peso do braço.</text>
      </g>
    </g>
  </svg>
);

/** 3. Numeração dos Dedos (1 a 5) em Ambas as Mãos */
export const FingeringNumberingDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    {/* Mão Esquerda (ME) - 5 a 1 */}
    <g transform="translate(40, 20)">
      <rect x="0" y="0" width="420" height="180" rx="14" fill="rgba(99, 102, 241, 0.07)" stroke="#6366f1" strokeWidth="1.2" />
      <text x="210" y="32" textAnchor="middle" fill="#c7d2fe" fontSize="14" fontWeight="black" letterSpacing="1">MÃO ESQUERDA (ME)</text>
      <text x="210" y="52" textAnchor="middle" fill="#818cf8" fontSize="11">Grave ➔ Agudo (5 ➔ 1)</text>

      {[{ x: 60, y: 110, f: '5', n: 'Mínimo', c: '#f43f5e' }, { x: 130, y: 90, f: '4', n: 'Anelar', c: '#c084fc' }, { x: 210, y: 80, f: '3', n: 'Médio', c: '#10b981' }, { x: 290, y: 90, f: '2', n: 'Indicador', c: '#06b6d4' }, { x: 360, y: 120, f: '1', n: 'Polegar', c: '#f59e0b' }].map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="18" fill={d.c} stroke="#ffffff" strokeWidth="2.5" />
          <text x={d.x} y={d.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">{d.f}</text>
          <text x={d.x} y={d.y + 36} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">{d.n}</text>
        </g>
      ))}
    </g>

    {/* Mão Direita (MD) - 1 a 5 */}
    <g transform="translate(500, 20)">
      <rect x="0" y="0" width="420" height="180" rx="14" fill="rgba(6, 182, 212, 0.07)" stroke="#06b6d4" strokeWidth="1.2" />
      <text x="210" y="32" textAnchor="middle" fill="#a5f3fc" fontSize="14" fontWeight="black" letterSpacing="1">MÃO DIREITA (MD)</text>
      <text x="210" y="52" textAnchor="middle" fill="#22d3ee" fontSize="11">Grave ➔ Agudo (1 ➔ 5)</text>

      {[{ x: 60, y: 120, f: '1', n: 'Polegar', c: '#f59e0b' }, { x: 130, y: 90, f: '2', n: 'Indicador', c: '#06b6d4' }, { x: 210, y: 80, f: '3', n: 'Médio', c: '#10b981' }, { x: 290, y: 90, f: '4', n: 'Anelar', c: '#c084fc' }, { x: 360, y: 110, f: '5', n: 'Mínimo', c: '#f43f5e' }].map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="18" fill={d.c} stroke="#ffffff" strokeWidth="2.5" />
          <text x={d.x} y={d.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">{d.f}</text>
          <text x={d.x} y={d.y + 36} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">{d.n}</text>
        </g>
      ))}
    </g>
  </svg>
);
