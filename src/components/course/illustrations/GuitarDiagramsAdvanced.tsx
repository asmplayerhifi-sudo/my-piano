/**
 * illustrations/GuitarDiagramsAdvanced.tsx
 * Diagramas panorâmicos para pestana, levadas rítmicas e sistema CAGED no violão.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. Mecânica da Pestana (Alavanca de Braço & Polegar Posterior) */
export const PestanaBarreMechanicsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#f43f5e" fontSize="14" fontWeight="black" letterSpacing="1">
        A MECÂNICA DA PESTANA (ALAVANCA SEM DOR)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Não use força de alicate: use o peso do cotovelo e a lateral óssea do indicador
      </text>
    </g>

    <g transform="translate(60, 70)">
      {/* 3 Blocos de Ação */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="260" height="110" rx="10" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" strokeWidth="1.2" />
        <text x="130" y="28" textAnchor="middle" fill="#fda4af" fontSize="12" fontWeight="black">1. BORDA LATERAL</text>
        <text x="130" y="55" textAnchor="middle" fill="#ffffff" fontSize="11">Gire o indicador 15° de lado</text>
        <text x="130" y="75" textAnchor="middle" fill="#94a3b8" fontSize="9">A carne macia absorve som;</text>
        <text x="130" y="90" textAnchor="middle" fill="#94a3b8" fontSize="9">o osso lateral prende a corda firme.</text>
      </g>

      <g transform="translate(290, 0)">
        <rect x="0" y="0" width="260" height="110" rx="10" fill="rgba(6, 182, 212, 0.08)" stroke="#06b6d4" strokeWidth="1.2" />
        <text x="130" y="28" textAnchor="middle" fill="#a5f3fc" fontSize="12" fontWeight="black">2. PIVÔ DO POLEGAR</text>
        <text x="130" y="55" textAnchor="middle" fill="#ffffff" fontSize="11">Polegar na metade do braço</text>
        <text x="130" y="75" textAnchor="middle" fill="#94a3b8" fontSize="9">Nunca abrace o braço por cima;</text>
        <text x="130" y="90" textAnchor="middle" fill="#94a3b8" fontSize="9">funciona como ponto de apoio central.</text>
      </g>

      <g transform="translate(580, 0)">
        <rect x="0" y="0" width="260" height="110" rx="10" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1.2" />
        <text x="130" y="28" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="black">3. PESO DO COTOVELO</text>
        <text x="130" y="55" textAnchor="middle" fill="#ffffff" fontSize="11">Puxe suavemente para trás</text>
        <text x="130" y="75" textAnchor="middle" fill="#94a3b8" fontSize="9">O peso natural do braço prende as</text>
        <text x="130" y="90" textAnchor="middle" fill="#94a3b8" fontSize="9">6 cordas sem cansar a mão.</text>
      </g>
    </g>
  </svg>
);

/** 2. Levada Rítmica & Padrão de Palhetada */
export const StrummingRhythmDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        LEVADA RÍTMICA POP / ROCK (PADRÃO 4/4)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Mantenha o punho como um pêndulo contínuo mesmo quando não atingir as cordas
      </text>
    </g>

    <g transform="translate(60, 75)">
      {[
        { beat: 'Tempo 1', stroke: '↓ DESCIDA', role: 'Bordão Grave (Forte)', color: '#f59e0b' },
        { beat: 'Tempo 2', stroke: '↓ ↑ DESCE / SOBE', role: 'Cordas Médias (Swing)', color: '#38bdf8' },
        { beat: 'Tempo 3', stroke: '↓ DESCIDA', role: 'Ataque Seco (Caixa)', color: '#10b981' },
        { beat: 'Tempo 4', stroke: '↓ ↑ DESCE / SOBE', role: 'Retorno Agudo', color: '#a855f7' },
      ].map((st, i) => {
        const x = i * 215;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="200" height="100" rx="10" fill="rgba(255,255,255,0.04)" stroke={st.color} strokeWidth="1.2" />
            <text x="100" y="26" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{st.beat}</text>
            <rect x="20" y="38" width="160" height="26" rx="6" fill="#1e1b4b" />
            <text x="100" y="55" textAnchor="middle" fill={st.color} fontSize="12" fontWeight="black">
              {st.stroke}
            </text>
            <text x="100" y="86" textAnchor="middle" fill="#94a3b8" fontSize="9">{st.role}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 3. Sistema Panorâmico CAGED ao Longo do Braço */
export const CAGEDSystemPanoramicDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#a855f7" fontSize="14" fontWeight="black" letterSpacing="1">
        SISTEMA CAGED (5 FORMAS DE TOCAR O MESMO ACORDE NO BRAÇO)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Conecte C ➔ A ➔ G ➔ E ➔ D por todo o braço da Casa 0 à Casa 12
      </text>
    </g>

    <g transform="translate(50, 75)">
      {[
        { letter: 'C', casa: 'Casas 0-3', focus: 'Forma Aberta Clássica', color: '#6366f1' },
        { letter: 'A', casa: 'Casas 3-5', focus: 'Pestana na Casa 3 (5ª corda)', color: '#06b6d4' },
        { letter: 'G', casa: 'Casas 5-8', focus: 'Extensão de Dó (6ª corda)', color: '#10b981' },
        { letter: 'E', casa: 'Casas 8-10', focus: 'Pestana na Casa 8 (6ª corda)', color: '#f59e0b' },
        { letter: 'D', casa: 'Casas 10-12', focus: 'Forma Aguda (4ª corda)', color: '#f43f5e' },
      ].map((shape, i) => {
        const x = i * 175;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="160" height="100" rx="10" fill="rgba(255,255,255,0.04)" stroke={shape.color} strokeWidth="1.2" />
            <circle cx="35" cy="30" r="16" fill={shape.color} />
            <text x="35" y="36" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="black">{shape.letter}</text>
            <text x="65" y="32" fill="#ffffff" fontSize="12" fontWeight="bold">Shape {shape.letter}</text>
            <text x="65" y="48" fill={shape.color} fontSize="10">{shape.casa}</text>
            <rect x="10" y="65" width="140" height="24" rx="4" fill="#1e1b4b" />
            <text x="80" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="9">{shape.focus}</text>
          </g>
        );
      })}
    </g>
  </svg>
);
