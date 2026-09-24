/**
 * illustrations/KeyboardDiagramsBasic.tsx
 * Diagramas panorâmicos padronizados (960x250) para geografia do teclado, biomecânica e dedilhado.
 * Regra: Componentes vetoriais puros, viewBox padronizado (0 0 960 250), SVG responsivo (< 300 linhas).
 */

import React from 'react';

/** 1. Geografia das Teclas Pretas e Localização do Dó Central (t1-1) */
export const BlackKeyGeographyDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <defs>
      <linearGradient id="cKeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>

    {/* Título Interno & Guia de Orientação */}
    <g transform="translate(30, 16)">
      <rect x="0" y="0" width="220" height="32" rx="8" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="1" />
      <text x="110" y="21" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="bold">GRUPOS DE 2 E 3 PRETAS</text>

      {/* Tag Dó à esquerda de 2 pretas */}
      <rect x="235" y="0" width="310" height="32" rx="8" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1" />
      <text x="390" y="21" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">Dó (C) = sempre à esquerda das 2 Pretas</text>

      {/* Tag Fá à esquerda de 3 pretas */}
      <rect x="560" y="0" width="340" height="32" rx="8" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="1" />
      <text x="730" y="21" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold">Fá (F) = sempre à esquerda das 3 Pretas</text>
    </g>

    {/* Representação das Teclas Brancas (2 Oitavas: C2 a B3) */}
    <g transform="translate(60, 68)">
      {[0, 58, 116, 174, 232, 290, 348, 406, 464, 522, 580, 638, 696, 754].map((x, i) => {
        const isC = i === 0 || i === 7;
        const isMiddleC = i === 7;
        return (
          <g key={i}>
            <rect
              x={x}
              y={0}
              width={54}
              height={145}
              rx={6}
              fill={isMiddleC ? 'url(#cKeyGrad)' : '#1e293b'}
              stroke={isMiddleC ? '#38bdf8' : '#334155'}
              strokeWidth={isMiddleC ? 2 : 1}
            />
            {isC && (
              <text x={x + 27} y={132} textAnchor="middle" fill={isMiddleC ? '#38bdf8' : '#e2e8f0'} fontSize="14" fontWeight="black">
                {isMiddleC ? 'C3' : 'C2'}
              </text>
            )}
          </g>
        );
      })}

      {/* Teclas Pretas com Destaque de Grupos */}
      {/* Grupo 1: 2 Pretas (Ciano) */}
      <rect x="38" y="-4" width="36" height="92" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="96" y="-4" width="36" height="92" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

      {/* Grupo 2: 3 Pretas (Roxo) */}
      <rect x="212" y="-4" width="36" height="92" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="270" y="-4" width="36" height="92" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="328" y="-4" width="36" height="92" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />

      {/* Grupo 3: 2 Pretas (Ciano - Dó Central C3) */}
      <rect x="444" y="-4" width="36" height="92" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="502" y="-4" width="36" height="92" rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

      {/* Grupo 4: 3 Pretas (Roxo) */}
      <rect x="618" y="-4" width="36" height="92" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="676" y="-4" width="36" height="92" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="734" y="-4" width="36" height="92" rx={5} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />

      {/* Indicador Flutuante do Dó Central C3 */}
      <g transform="translate(433, 110)">
        <polygon points="0,-16 6,-26 -6,-26" fill="#38bdf8" />
        <rect x="-65" y="-55" width="130" height="26" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="0" y="-38" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">★ DÓ CENTRAL (C3)</text>
      </g>
    </g>
  </svg>
);

/** 2. Postura da Mão Curvada (Maçã Invisível & Cúpula de Suporte) (t1-2) */
export const HandPostureBiomechanicsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#818cf8" fontSize="14" fontWeight="black" letterSpacing="1">
        BIOMECÂNICA DAS MÃOS &amp; A CÚPULA NATURAL ("A MAÇÃ INVISÍVEL")
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A curvatura natural dos dedos protege tendões e permite tocar com agilidade, peso livre e sem tensão
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Painel Esquerdo: Arco da Mão & Maçã Invisível */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="510" height="175" rx="12" fill="rgba(99, 102, 241, 0.05)" stroke="#4338ca" strokeWidth="1" />
        <text x="20" y="26" fill="#a5b4fc" fontSize="12" fontWeight="bold">ARCO DE SUSTENTAÇÃO NATURAL</text>

        {/* Teclas no fundo */}
        {[30, 95, 160, 225, 290, 355, 420].map((x, i) => (
          <rect key={i} x={x} y="115" width="55" height="48" rx="4" fill="#1e293b" stroke="#334155" />
        ))}

        {/* Curvatura em Arco Suave */}
        <path d="M 55,120 C 95,35 285,25 400,60 C 430,75 450,100 455,120" fill="none" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />

        {/* Maçã ou Esfera Imaginária de Suporte */}
        <circle cx="260" cy="72" r="42" fill="rgba(34, 211, 238, 0.12)" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 4" />
        <text x="260" y="70" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="bold">ESFERA DE APOIO</text>
        <text x="260" y="86" textAnchor="middle" fill="#94a3b8" fontSize="9">Articulações firmes</text>

        {/* 5 Dedos posicionados na ponta */}
        {[{ x: 60, f: '1' }, { x: 145, f: '2' }, { x: 235, f: '3' }, { x: 330, f: '4' }, { x: 420, f: '5' }].map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy="120" r="14" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
            <text x={d.x} y="124" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{d.f}</text>
          </g>
        ))}
      </g>

      {/* Painel Direito: Checklist Biomecânico */}
      <g transform="translate(530, 0)">
        <rect x="0" y="0" width="365" height="175" rx="12" fill="rgba(16, 185, 129, 0.05)" stroke="#059669" strokeWidth="1" />
        <text x="20" y="26" fill="#34d399" fontSize="12" fontWeight="bold">CHECKLIST DE POSTURA ESSENCIAL</text>

        <g transform="translate(20, 48)">
          <text x="0" y="10" fill="#f8fafc" fontSize="11" fontWeight="bold">✓ Antebraço nivelado:</text>
          <text x="0" y="26" fill="#cbd5e1" fontSize="10">Linha reta suave do cotovelo ao dorso da mão.</text>

          <text x="0" y="52" fill="#f8fafc" fontSize="11" fontWeight="bold">✓ Toque na polpa carnuda:</text>
          <text x="0" y="68" fill="#cbd5e1" fontSize="10">Dedos 2 a 5 em arco; polegar toca com a lateral.</text>

          <text x="0" y="94" fill="#f8fafc" fontSize="11" fontWeight="bold">✓ Gravidade livre (Sem Força Bruta):</text>
          <text x="0" y="110" fill="#cbd5e1" fontSize="10">O som é produzido pelo peso do braço, não por rigidez.</text>
        </g>
      </g>
    </g>
  </svg>
);

/** 3. O Peso do Braço & Respiração Musical (t1-3) */
export const ArmWeightRelaxationDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        O PESO DO BRAÇO &amp; A RESPIRAÇÃO ENTRE FRASES MUSICAIS
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Como a física da gravidade substitui a força muscular para gerar um som aveludado e rico
      </text>
    </g>

    <g transform="translate(35, 52)">
      {[
        {
          step: '1. PREPARAÇÃO (QUEDA LIVRE)',
          desc: 'Ombros soltos, braço relaxado suspenso acima do teclado pela gravidade natural.',
          action: 'Solte a tensão dos ombros',
          c: '#6366f1',
        },
        {
          step: '2. CONTATO & TRANSFERÊNCIA',
          desc: 'A ponta do dedo amortece a descida transferindo o peso do braço diretamente para a tecla.',
          action: 'Dedo firme como pilar de ponte',
          c: '#06b6d4',
        },
        {
          step: '3. RESPIRAÇÃO (ELEVAÇÃO DO PULSO)',
          desc: 'Ao final da frase, o pulso sobe suavemente levando a mão para respirar antes do próximo ataque.',
          action: 'Pulso flexível como mola',
          c: '#10b981',
        },
      ].map((st, i) => {
        const x = i * 300;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="280" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke={st.c} strokeWidth="1.2" />
            <text x="140" y="28" textAnchor="middle" fill={st.c} fontSize="11" fontWeight="black">{st.step}</text>
            <rect x="20" y="44" width="240" height="60" rx="6" fill="#1e1b4b" />
            <text x="140" y="68" textAnchor="middle" fill="#cbd5e1" fontSize="10">{st.desc.slice(0, 36)}</text>
            <text x="140" y="86" textAnchor="middle" fill="#cbd5e1" fontSize="10">{st.desc.slice(36)}</text>
            <rect x="20" y="118" width="240" height="38" rx="6" fill="rgba(255,255,255,0.05)" />
            <text x="140" y="142" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold">{st.action}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 4. Numeração dos Dedos (1 a 5) em Ambas as Mãos (t2-3) */
export const FingeringNumberingDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        NUMERAÇÃO UNIVERSAL DOS DEDOS (1 A 5) PARA PIANO
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        O polegar é sempre o dedo 1; os dedos se espelham simetricamente em direção aos mínimos (dedo 5)
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Mão Esquerda (ME) - 5 a 1 */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="435" height="175" rx="12" fill="rgba(99, 102, 241, 0.06)" stroke="#6366f1" strokeWidth="1.2" />
        <text x="217" y="28" textAnchor="middle" fill="#c7d2fe" fontSize="13" fontWeight="black" letterSpacing="1">MÃO ESQUERDA (ME) • GRAVES</text>
        <text x="217" y="46" textAnchor="middle" fill="#818cf8" fontSize="10.5">Grave ➔ Agudo (5 ➔ 1)</text>

        {[{ x: 60, y: 105, f: '5', n: 'Mínimo', c: '#f43f5e' }, { x: 135, y: 88, f: '4', n: 'Anelar', c: '#c084fc' }, { x: 217, y: 80, f: '3', n: 'Médio', c: '#10b981' }, { x: 300, y: 88, f: '2', n: 'Indicador', c: '#06b6d4' }, { x: 375, y: 115, f: '1', n: 'Polegar', c: '#f59e0b' }].map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r="18" fill={d.c} stroke="#ffffff" strokeWidth="2.5" />
            <text x={d.x} y={d.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">{d.f}</text>
            <text x={d.x} y={d.y + 36} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">{d.n}</text>
          </g>
        ))}
      </g>

      {/* Mão Direita (MD) - 1 a 5 */}
      <g transform="translate(455, 0)">
        <rect x="0" y="0" width="435" height="175" rx="12" fill="rgba(6, 182, 212, 0.06)" stroke="#06b6d4" strokeWidth="1.2" />
        <text x="217" y="28" textAnchor="middle" fill="#a5f3fc" fontSize="13" fontWeight="black" letterSpacing="1">MÃO DIREITA (MD) • AGUDOS</text>
        <text x="217" y="46" textAnchor="middle" fill="#22d3ee" fontSize="10.5">Grave ➔ Agudo (1 ➔ 5)</text>

        {[{ x: 60, y: 115, f: '1', n: 'Polegar', c: '#f59e0b' }, { x: 135, y: 88, f: '2', n: 'Indicador', c: '#06b6d4' }, { x: 217, y: 80, f: '3', n: 'Médio', c: '#10b981' }, { x: 300, y: 88, f: '4', n: 'Anelar', c: '#c084fc' }, { x: 375, y: 105, f: '5', n: 'Mínimo', c: '#f43f5e' }].map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r="18" fill={d.c} stroke="#ffffff" strokeWidth="2.5" />
            <text x={d.x} y={d.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">{d.f}</text>
            <text x={d.x} y={d.y + 36} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">{d.n}</text>
          </g>
        ))}
      </g>
    </g>
  </svg>
);
