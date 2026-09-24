/**
 * illustrations/TheoryDiagramsAcoustics.tsx
 * Diagramas panorâmicos para propriedades do som, métrica de compasso e escala maior.
 * Regra: Componentes vetoriais puros (< 190 linhas).
 */

import React from 'react';

/** 1. As 4 Propriedades Fundamentais do Som */
export const SoundPropertiesDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#a855f7" fontSize="14" fontWeight="black" letterSpacing="1">
        AS 4 PROPRIEDADES FUNDAMENTAIS DO SOM
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Como o cérebro humano decodifica a vibração mecânica do ar em música
      </text>
    </g>

    <g transform="translate(50, 75)">
      {[
        { title: '1. ALTURA (Hz)', sub: 'Frequência de Vibração', desc: 'Rápida = Agudo / Lenta = Grave', color: '#6366f1' },
        { title: '2. DURAÇÃO (s)', sub: 'Tempo de Sustentação', desc: 'Semibreve, Mínima, Semínima...', color: '#06b6d4' },
        { title: '3. INTENSIDADE (dB)', sub: 'Amplitude da Onda', desc: 'Volume e dinâmica (pp até ff)', color: '#10b981' },
        { title: '4. TIMBRE', sub: 'Harmônicos / Identidade', desc: 'Diferencia Piano de Violão ou Voz', color: '#f59e0b' },
      ].map((p, i) => {
        const x = i * 220;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="200" height="100" rx="10" fill="rgba(255,255,255,0.04)" stroke={p.color} strokeWidth="1.2" />
            <text x="100" y="26" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{p.title}</text>
            <text x="100" y="48" textAnchor="middle" fill={p.color} fontSize="11" fontWeight="bold">{p.sub}</text>
            <rect x="10" y="62" width="180" height="24" rx="4" fill="#1e1b4b" />
            <text x="100" y="77" textAnchor="middle" fill="#cbd5e1" fontSize="9">{p.desc}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 2. Anatomia da Fórmula de Compasso (Numerador / Denominador) */
export const TimeSignatureAnatomyDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        ANATOMIA DA FÓRMULA DE COMPASSO (EX: 4/4)
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        A fração que organiza a pulsação e o tempo da partitura
      </text>
    </g>

    <g transform="translate(60, 70)">
      {/* Símbolo Grande da Fração */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="160" height="110" rx="10" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" strokeWidth="1.5" />
        <text x="80" y="50" textAnchor="middle" fill="#ffffff" fontSize="42" fontWeight="black">4</text>
        <line x1="30" y1="58" x2="130" y2="58" stroke="#38bdf8" strokeWidth="3" />
        <text x="80" y="98" textAnchor="middle" fill="#38bdf8" fontSize="42" fontWeight="black">4</text>
      </g>

      {/* Explicação do Numerador */}
      <g transform="translate(200, 5)">
        <rect x="0" y="0" width="310" height="46" rx="8" fill="rgba(255,255,255,0.04)" stroke="#6366f1" strokeWidth="1" />
        <text x="15" y="22" fill="#c7d2fe" fontSize="11" fontWeight="black">NUMERADOR (Superior): 4 tempos</text>
        <text x="15" y="36" fill="#94a3b8" fontSize="10">Determina quantos tempos cabem em cada compasso</text>
      </g>

      {/* Explicação do Denominador */}
      <g transform="translate(200, 60)">
        <rect x="0" y="0" width="310" height="46" rx="8" fill="rgba(255,255,255,0.04)" stroke="#06b6d4" strokeWidth="1" />
        <text x="15" y="22" fill="#a5f3fc" fontSize="11" fontWeight="black">DENOMINADOR (Inferior): 4 = Semínima</text>
        {/* Ícone Vetorial da Semínima */}
        <g transform="translate(265, 20)">
          <ellipse cx="0" cy="0" rx="4.5" ry="3.2" fill="#38bdf8" transform="rotate(-25)" />
          <line x1="3.5" y1="-1" x2="3.5" y2="-11" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <text x="15" y="36" fill="#94a3b8" fontSize="10">Determina qual figura rítmica vale exatamente 1 tempo</text>
      </g>

      {/* Exemplos Universais */}
      <g transform="translate(540, 5)">
        <rect x="0" y="0" width="320" height="100" rx="10" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1" />
        <text x="20" y="25" fill="#a7f3d0" fontSize="11" fontWeight="black">COMPASSOS MAIS COMUNS:</text>
        <text x="20" y="48" fill="#ffffff" fontSize="10">• 2/4 (Binário): Marchas, Samba, Baião</text>
        <text x="20" y="68" fill="#ffffff" fontSize="10">• 3/4 (Ternário): Valsa, Guarânia, Minueto</text>
        <text x="20" y="88" fill="#ffffff" fontSize="10">• 4/4 (Quaternário): Pop, Rock, Jazz, Louvor</text>
      </g>
    </g>
  </svg>
);

/** 3. Fórmula da Escala Maior (Tom-Tom-Semitom-Tom-Tom-Tom-Semitom) */
export const MajorScaleStepPatternDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#10b981" fontSize="14" fontWeight="black" letterSpacing="1">
        FÓRMULA DA ESCALA MAIOR DIATÔNICA: T - T - s - T - T - T - s
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        A anatomia intervalar que gera todas as melodias e acordes maiores da música ocidental
      </text>
    </g>

    <g transform="translate(50, 75)">
      {[
        { note: 'C', step: 'Tom (+2st)', c: '#6366f1' },
        { note: 'D', step: 'Tom (+2st)', c: '#6366f1' },
        { note: 'E', step: 'Semitom (+1st)', c: '#f43f5e' },
        { note: 'F', step: 'Tom (+2st)', c: '#6366f1' },
        { note: 'G', step: 'Tom (+2st)', c: '#6366f1' },
        { note: 'A', step: 'Tom (+2st)', c: '#6366f1' },
        { note: 'B', step: 'Semitom (+1st)', c: '#f43f5e' },
        { note: 'C', step: 'Oitava', c: '#10b981' },
      ].map((item, i) => {
        const x = i * 110;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <circle cx="45" cy="30" r="22" fill={item.c} stroke="#ffffff" strokeWidth="2" />
            <text x="45" y="37" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="black">{item.note}</text>
            <text x="45" y="75" textAnchor="middle" fill={item.c} fontSize="10" fontWeight="bold">{item.step}</text>
            {i < 7 && (
              <path d="M 75,30 L 100,30" stroke="#475569" strokeWidth="2" />
            )}
          </g>
        );
      })}
    </g>
  </svg>
);
