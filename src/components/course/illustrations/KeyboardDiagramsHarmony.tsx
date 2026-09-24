/**
 * illustrations/KeyboardDiagramsHarmony.tsx
 * Diagramas panorâmicos padronizados (960x250) para ritmo, tríades, inversões e progressão pop no teclado.
 * Regra: Componentes vetoriais puros, viewBox padronizado (0 0 960 250), SVG responsivo (< 320 linhas).
 */

import React from 'react';

/** 1. Pirâmide Hierárquica das Figuras Rítmicas (t2-2) */
export const RhythmTreeDivisionDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        PIRÂMIDE HIERÁRQUICA DAS FIGURAS RÍTMICAS
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Subdivisão binária proporcional: cada nível divide a duração exatamente pela metade (÷2)
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* ── NÍVEL 1: SEMIBREVE (4 Tempos) ── */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="890" height="34" rx="8" fill="#312e81" stroke="#818cf8" strokeWidth="1.2" />
        <text x="24" y="22" fill="#ffffff" fontSize="12" fontWeight="black">𝅝 SEMIBREVE (1 Nota = 4 Tempos Inteiros)</text>
        <rect x="760" y="6" width="115" height="22" rx="4" fill="rgba(0,0,0,0.3)" />
        <text x="817" y="21" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">VALOR: 1 (4/4)</text>
      </g>

      {/* ── NÍVEL 2: MÍNIMAS (2 Tempos) ── */}
      <g transform="translate(0, 42)">
        {[
          { x: 0, w: 438 },
          { x: 452, w: 438 },
        ].map((b, i) => (
          <g key={i} transform={`translate(${b.x}, 0)`}>
            <rect x="0" y="0" width={b.w} height="34" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="20" y="22" fill="#ffffff" fontSize="11.5" fontWeight="black">𝅗𝅥 MÍNIMA (2 Tempos)</text>
            <rect x={b.w - 100} y="6" width="85" height="22" rx="4" fill="rgba(0,0,0,0.3)" />
            <text x={b.w - 57} y="21" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="bold">VALOR: 1/2</text>
          </g>
        ))}
      </g>

      {/* ── NÍVEL 3: SEMÍNIMAS (1 Tempo) ── */}
      <g transform="translate(0, 84)">
        {[0, 226, 452, 678].map((x, i) => (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="212" height="34" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="1.2" />
            <text x="14" y="22" fill="#ffffff" fontSize="10.5" fontWeight="black">𝅘𝅥 SEMÍNIMA (1 Tempo)</text>
            <rect x="155" y="6" width="46" height="22" rx="4" fill="rgba(0,0,0,0.3)" />
            <text x="178" y="21" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">1/4</text>
          </g>
        ))}
      </g>

      {/* ── NÍVEL 4: COLCHEIAS (½ Tempo) ── */}
      <g transform="translate(0, 126)">
        {Array.from({ length: 8 }).map((_, i) => {
          const x = i * 113;
          return (
            <g key={i} transform={`translate(${x}, 0)`}>
              <rect x="0" y="0" width="102" height="34" rx="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
              <text x="51" y="21" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="black">𝅘𝅥𝅮 COLCHEIA (½t)</text>
            </g>
          );
        })}
      </g>
    </g>
  </svg>
);

/** 2. Fórmulas de Tríade Maior e Menor no Teclado (t4-1 & t4-2) */
export const TriadFormulaWideDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        FÓRMULA DAS TRÍADES: MAIOR (C) VS MENOR (Cm)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Apenas a terça se move: descer a terça em 1 semitom transforma o acorde de Maior em Menor
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Tríade Maior (Esquerda) */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="435" height="175" rx="12" fill="rgba(99, 102, 241, 0.06)" stroke="#6366f1" strokeWidth="1.2" />
        <text x="18" y="24" fill="#c7d2fe" fontSize="12" fontWeight="black">TRÍADE MAIOR (C): Fundamental + 3M + 5J</text>

        {/* 3 Notas em Pills Elegantes */}
        <g transform="translate(18, 42)">
          {/* Fundamental */}
          <rect x="0" y="0" width="95" height="60" rx="8" fill="#312e81" stroke="#6366f1" />
          <text x="47" y="26" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold">FUNDAMENTAL</text>
          <text x="47" y="48" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="black">Dó (C3)</text>

          {/* Seta +4 st */}
          <line x1="102" y1="30" x2="140" y2="30" stroke="#818cf8" strokeWidth="2" />
          <rect x="106" y="8" width="30" height="16" rx="3" fill="#1e1b4b" />
          <text x="121" y="20" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold">+4 st</text>

          {/* Terça Maior */}
          <rect x="148" y="0" width="95" height="60" rx="8" fill="#312e81" stroke="#6366f1" />
          <text x="195" y="26" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold">TERÇA MAIOR</text>
          <text x="195" y="48" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="black">Mi (E3)</text>

          {/* Seta +3 st */}
          <line x1="250" y1="30" x2="288" y2="30" stroke="#818cf8" strokeWidth="2" />
          <rect x="254" y="8" width="30" height="16" rx="3" fill="#1e1b4b" />
          <text x="269" y="20" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold">+3 st</text>

          {/* Quinta Justa */}
          <rect x="296" y="0" width="95" height="60" rx="8" fill="#312e81" stroke="#6366f1" />
          <text x="343" y="26" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold">QUINTA JUSTA</text>
          <text x="343" y="48" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="black">Sol (G3)</text>
        </g>

        {/* Rodapé Dedilhado */}
        <rect x="18" y="122" width="399" height="34" rx="6" fill="#1e1b4b" />
        <text x="217" y="143" textAnchor="middle" fill="#cbd5e1" fontSize="10">
          Dedilhado MD: <strong className="text-amber-400">1 (Polegar)</strong> • <strong className="text-emerald-400">3 (Médio)</strong> • <strong className="text-rose-400">5 (Mínimo)</strong>
        </text>
      </g>

      {/* Tríade Menor (Direita) */}
      <g transform="translate(455, 0)">
        <rect x="0" y="0" width="435" height="175" rx="12" fill="rgba(244, 63, 94, 0.06)" stroke="#f43f5e" strokeWidth="1.2" />
        <text x="18" y="24" fill="#fecdd3" fontSize="12" fontWeight="black">TRÍADE MENOR (Cm): Fundamental + 3m + 5J</text>

        {/* 3 Notas em Pills Elegantes */}
        <g transform="translate(18, 42)">
          {/* Fundamental */}
          <rect x="0" y="0" width="95" height="60" rx="8" fill="#881337" stroke="#f43f5e" />
          <text x="47" y="26" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold">FUNDAMENTAL</text>
          <text x="47" y="48" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="black">Dó (C3)</text>

          {/* Seta +3 st */}
          <line x1="102" y1="30" x2="140" y2="30" stroke="#fb7185" strokeWidth="2" />
          <rect x="106" y="8" width="30" height="16" rx="3" fill="#4c0519" />
          <text x="121" y="20" textAnchor="middle" fill="#fda4af" fontSize="8.5" fontWeight="bold">+3 st</text>

          {/* Terça Menor */}
          <rect x="148" y="0" width="95" height="60" rx="8" fill="#881337" stroke="#f43f5e" />
          <text x="195" y="26" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold">TERÇA MENOR</text>
          <text x="195" y="48" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="black">Mi♭ (E♭3)</text>

          {/* Seta +4 st */}
          <line x1="250" y1="30" x2="288" y2="30" stroke="#fb7185" strokeWidth="2" />
          <rect x="254" y="8" width="30" height="16" rx="3" fill="#4c0519" />
          <text x="269" y="20" textAnchor="middle" fill="#fda4af" fontSize="8.5" fontWeight="bold">+4 st</text>

          {/* Quinta Justa */}
          <rect x="296" y="0" width="95" height="60" rx="8" fill="#881337" stroke="#f43f5e" />
          <text x="343" y="26" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold">QUINTA JUSTA</text>
          <text x="343" y="48" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="black">Sol (G3)</text>
        </g>

        {/* Rodapé Dedilhado */}
        <rect x="18" y="122" width="399" height="34" rx="6" fill="#4c0519" />
        <text x="217" y="143" textAnchor="middle" fill="#fecdd3" fontSize="10">
          Dedilhado MD: <strong className="text-amber-400">1 (Polegar)</strong> • <strong className="text-emerald-400">3 (Médio)</strong> • <strong className="text-rose-400">5 (Mínimo)</strong>
        </text>
      </g>
    </g>
  </svg>
);

/** 3. Ciclo das 3 Inversões & Voice Leading (t5-1 & t5-2) */
export const ChordInversionsCycleDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">
        CICLO DAS 3 POSIÇÕES (INVERSÕES) &amp; LEI DO MENOR MOVIMENTO
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Ao inverter acordes, a mão praticamente não sai do lugar para transitar entre C, F e G
      </text>
    </g>

    <g transform="translate(35, 52)">
      {[
        {
          title: 'ESTADO FUNDAMENTAL (C)',
          chord: 'C - E - G',
          bass: 'Baixo na Raiz (1)',
          desc: 'Som robusto, firme e conclusivo.',
          c: '#6366f1',
        },
        {
          title: '1ª INVERSÃO (C / E)',
          chord: 'E - G - C',
          bass: 'Baixo na Terça (3)',
          desc: 'Linhas de baixo melódicas e caminhantes.',
          c: '#06b6d4',
        },
        {
          title: '2ª INVERSÃO (C / G)',
          chord: 'G - C - E',
          bass: 'Baixo na Quinta (5)',
          desc: 'Suspensão perfeita para cadências clássicas.',
          c: '#10b981',
        },
      ].map((inv, i) => {
        const x = i * 300;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="280" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke={inv.c} strokeWidth="1.2" />
            <text x="140" y="26" textAnchor="middle" fill={inv.c} fontSize="11" fontWeight="black">{inv.title}</text>
            <rect x="25" y="40" width="230" height="42" rx="8" fill="#0f172a" stroke={inv.c} strokeWidth="1" />
            <text x="140" y="68" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="black" fontFamily="JetBrains Mono, monospace">
              {inv.chord}
            </text>
            <text x="140" y="108" textAnchor="middle" fill={inv.c} fontSize="10.5" fontWeight="bold">{inv.bass}</text>
            <rect x="15" y="125" width="250" height="32" rx="5" fill="rgba(255,255,255,0.04)" />
            <text x="140" y="145" textAnchor="middle" fill="#cbd5e1" fontSize="9">{inv.desc}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 4. A Progressão Pop dos 4 Acordes no Teclado (t4-3 & t5-3) */
export const PopFourChordsProgressionDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        A PROGRESSÃO POP DOS 4 ACORDES NO TECLADO (I - V - vi - IV)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Condução suave de vozes: C ➔ G ➔ Am ➔ F com mínima movimentação física da mão direita
      </text>
    </g>

    <g transform="translate(35, 52)">
      {[
        { chord: 'C (I)', notes: 'G - C - E (2ª Inv)', bass: 'ME: C', c: '#10b981' },
        { chord: 'G (V)', notes: 'G - B - D (Fund)', bass: 'ME: G', c: '#f59e0b' },
        { chord: 'Am (vi)', notes: 'A - C - E (Fund)', bass: 'ME: A', c: '#6366f1' },
        { chord: 'F (IV)', notes: 'A - C - F (1ª Inv)', bass: 'ME: F', c: '#06b6d4' },
      ].map((ch, i) => {
        const x = i * 225;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="210" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke={ch.c} strokeWidth="1.2" />
            <text x="105" y="28" textAnchor="middle" fill={ch.c} fontSize="13" fontWeight="black">{ch.chord}</text>
            <rect x="18" y="42" width="174" height="42" rx="8" fill="#1e1b4b" />
            <text x="105" y="68" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{ch.notes}</text>
            <rect x="18" y="96" width="174" height="30" rx="6" fill="#0f172a" />
            <text x="105" y="116" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="bold">{ch.bass}</text>
            <text x="105" y="152" textAnchor="middle" fill="#94a3b8" fontSize="9">Dedilhado: 1 - 3 - 5</text>
          </g>
        );
      })}
    </g>
  </svg>
);
