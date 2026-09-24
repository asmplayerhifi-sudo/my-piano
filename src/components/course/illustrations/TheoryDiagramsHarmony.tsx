/**
 * illustrations/TheoryDiagramsHarmony.tsx
 * Diagramas panorâmicos para Intervalos, Trítono, Escalas Maiores, Menores e Ciclo das Quintas.
 * Regra: Componentes vetoriais puros (< 320 linhas).
 */

import React from 'react';

/** 1. Régua Acústica Completa dos 12 Intervalos (m2-2) */
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

/** 2. O Trítono & Regra do 9 de Inversão de Intervalos (m2-3) */
export const TritoneAndRuleOfNineDiagram: React.FC = () => (
  <svg viewBox="0 0 960 230" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#f43f5e" fontSize="14" fontWeight="black" letterSpacing="1">
        O TRÍTONO (3 TONS) &amp; A REGRA DO 9 DE INVERSÃO
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A tensão máxima da harmonia tonal e o cálculo matemático perfeito de inversão intervalar
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Coluna 1: O Trítono (Tensão e Resolução Fá-Si) */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="430" height="155" rx="10" fill="rgba(244, 63, 94, 0.06)" stroke="#f43f5e" strokeWidth="1.2" />
        <text x="20" y="24" fill="#fda4af" fontSize="11.5" fontWeight="black">1. ANATOMIA DO TRÍTONO (6 SEMITONS / 3 TONS):</text>

        <g transform="translate(20, 36)">
          <rect x="0" y="0" width="390" height="42" rx="6" fill="#881337" />
          <text x="20" y="26" fill="#ffffff" fontSize="14" fontWeight="black">Fá (F) ➔ Si (B)</text>
          <text x="170" y="26" fill="#fecdd3" fontSize="11" fontWeight="bold">= 3 Tons Inteiros Exatos (6 ST)</text>
        </g>

        <g transform="translate(20, 88)">
          <text x="0" y="14" fill="#cbd5e1" fontSize="10">• Divide a oitava exatamente ao meio (12 st ÷ 2 = 6 st).</text>
          <text x="0" y="28" fill="#cbd5e1" fontSize="10">• Gera a tensão do acorde dominante (G7), que exige resolução no lar (C).</text>
          <text x="0" y="44" fill="#f43f5e" fontSize="10" fontWeight="bold">➔ Resolução: O Fá desce para Mi e o Si sobe para Dó!</text>
        </g>
      </g>

      {/* Coluna 2: A Regra do 9 na Inversão */}
      <g transform="translate(450, 0)">
        <rect x="0" y="0" width="445" height="155" rx="10" fill="rgba(99, 102, 241, 0.06)" stroke="#6366f1" strokeWidth="1.2" />
        <text x="20" y="24" fill="#c7d2fe" fontSize="11.5" fontWeight="black">2. A REGRA DO 9 (INVERTER INTERVALOS):</text>

        <g transform="translate(20, 36)">
          <rect x="0" y="0" width="405" height="32" rx="6" fill="#1e1b4b" stroke="#4338ca" />
          <text x="20" y="21" fill="#ffffff" fontSize="11" fontWeight="black">
            Fórmula Numérica: 9 - Intervalo Original = Intervalo Invertido
          </text>
        </g>

        {/* Tabela de Inversões */}
        <g transform="translate(20, 78)">
          <text x="0" y="14" fill="#a5b4fc" fontSize="10">• 2ª Maior (C-D) invertida vira 7ª Menor (D-C) [9 - 2 = 7]</text>
          <text x="0" y="28" fill="#a5b4fc" fontSize="10">• 3ª Maior (C-E) invertida vira 6ª Menor (E-C) [9 - 3 = 6]</text>
          <text x="0" y="42" fill="#a5b4fc" fontSize="10">• 4ª Justa (C-F) invertida vira 5ª Justa (F-C) [9 - 4 = 5]</text>
          <text x="0" y="58" fill="#38bdf8" fontSize="10" fontWeight="bold">
            Regra Qualitativa: Maior ➔ Menor | Justo ➔ Continua Justo!
          </text>
        </g>
      </g>
    </g>
  </svg>
);

/** 3. Fórmula da Escala Maior Natural (m3-1) */
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

/** 4. Armaduras de Clave & O Ciclo das Quintas e Quartas (m3-2) */
export const KeySignaturesAndFifthsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 240" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        ARMADURAS DE CLAVE &amp; ORDEM OFICIAL DE SUSTENIDOS E BEMÓIS
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        O segredo para ler armaduras instantaneamente sem memorizar tabelas soltas
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Bloco 1: Ordem dos Sustenidos (Fá - Dó - Sol - Ré - Lá - Mi - Si) */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="435" height="165" rx="10" fill="rgba(56, 189, 248, 0.05)" stroke="#38bdf8" strokeWidth="1.2" />
        <text x="18" y="24" fill="#38bdf8" fontSize="11.5" fontWeight="black">1. ORDEM DOS SUSTENIDOS (♯):</text>
        <text x="18" y="40" fill="#cbd5e1" fontSize="10">Adiciona-se em quintas ascendentes (+5J):</text>

        <g transform="translate(18, 50)">
          {['Fá♯', 'Dó♯', 'Sol♯', 'Ré♯', 'Lá♯', 'Mi♯', 'Si♯'].map((sh, idx) => (
            <g key={idx} transform={`translate(${idx * 56}, 0)`}>
              <rect x="0" y="0" width="48" height="42" rx="6" fill="#0369a1" />
              <text x="24" y="26" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{sh}</text>
              <text x="24" y="55" textAnchor="middle" fill="#7dd3fc" fontSize="9">Nº {idx + 1}</text>
            </g>
          ))}
        </g>

        <rect x="18" y="118" width="400" height="32" rx="5" fill="#082f49" />
        <text x="28" y="138" fill="#e0f2fe" fontSize="9.5" fontWeight="bold">
          ★ Truque: A tonalidade maior fica 1 semitom acima do ÚLTIMO sustenido!
        </text>
      </g>

      {/* Bloco 2: Ordem dos Bemóis (Si - Mi - Lá - Ré - Sol - Dó - Fá) */}
      <g transform="translate(455, 0)">
        <rect x="0" y="0" width="435" height="165" rx="10" fill="rgba(245, 158, 11, 0.05)" stroke="#f59e0b" strokeWidth="1.2" />
        <text x="18" y="24" fill="#fbbf24" fontSize="11.5" fontWeight="black">2. ORDEM DOS BEMÓIS (♭):</text>
        <text x="18" y="40" fill="#cbd5e1" fontSize="10">É exatamente o inverso dos sustenidos (quartas ascendentes):</text>

        <g transform="translate(18, 50)">
          {['Si♭', 'Mi♭', 'Lá♭', 'Ré♭', 'Sol♭', 'Dó♭', 'Fá♭'].map((fl, idx) => (
            <g key={idx} transform={`translate(${idx * 56}, 0)`}>
              <rect x="0" y="0" width="48" height="42" rx="6" fill="#78350f" />
              <text x="24" y="26" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{fl}</text>
              <text x="24" y="55" textAnchor="middle" fill="#fde68a" fontSize="9">Nº {idx + 1}</text>
            </g>
          ))}
        </g>

        <rect x="18" y="118" width="400" height="32" rx="5" fill="#451a03" />
        <text x="28" y="138" fill="#fef3c7" fontSize="9.5" fontWeight="bold">
          ★ Truque: O PENÚLTIMO bemol da armadura já dá o nome do tom maior!
        </text>
      </g>
    </g>
  </svg>
);

/** 5. As 3 Escalas Menores: Natural, Harmônica e Melódica (m3-3) */
export const ThreeMinorScalesDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">
        AS 3 ESCALAS MENORES: NATURAL, HARMÔNICA &amp; MELÓDICA
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Comparativo em Lá Menor (Am): como a alteração do 6º e 7º graus constrói a sensível e a harmonia
      </text>
    </g>

    <g transform="translate(35, 52)">
      {[
        {
          title: '1. ESCALA MENOR NATURAL (EÓLIO)',
          formula: 'A - B - C - D - E - F - G - A',
          desc: '7ª Menor (G natural). Sem sensível forte. Sonoridade pura e melancólica.',
          color: '#6366f1',
          highlight: '7m (G)',
        },
        {
          title: '2. ESCALA MENOR HARMÔNICA (COM SENSÍVEL #7)',
          formula: 'A - B - C - D - E - F - G♯ - A',
          desc: 'G♯ (7ª Maior) cria a sensível que atrai para Lá, gerando o acorde dominante E7.',
          color: '#f59e0b',
          highlight: '7M (G♯) • Salto de 1.5 tom (F ➔ G♯)',
        },
        {
          title: '3. ESCALA MENOR MELÓDICA (BACHIANA)',
          formula: 'A - B - C - D - E - F♯ - G♯ - A',
          desc: 'Eleva tanto o 6º (F♯) quanto o 7º (G♯) graus na subida para suavizar o salto melódico.',
          color: '#10b981',
          highlight: '6M (F♯) e 7M (G♯) na subida',
        },
      ].map((sc, i) => (
        <g key={i} transform={`translate(0, ${i * 60})`}>
          <rect x="0" y="0" width="890" height="52" rx="8" fill="rgba(255,255,255,0.03)" stroke={sc.color} strokeWidth="1.2" />
          <text x="18" y="20" fill={sc.color} fontSize="11" fontWeight="black">{sc.title}</text>
          <text x="18" y="38" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
            {sc.formula}
          </text>
          <text x="320" y="20" fill="#cbd5e1" fontSize="10">{sc.desc}</text>
          <rect x="700" y="10" width="175" height="32" rx="5" fill="#1e1b4b" />
          <text x="787" y="30" textAnchor="middle" fill="#c7d2fe" fontSize="9.5" fontWeight="bold">
            {sc.highlight}
          </text>
        </g>
      ))}
    </g>
  </svg>
);

/** 6. Os 3 Pilares da Harmonia Funcional (m5-2: Tônica, Subdominante, Dominante) */
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
