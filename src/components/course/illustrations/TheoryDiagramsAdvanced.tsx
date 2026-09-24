/**
 * illustrations/TheoryDiagramsAdvanced.tsx
 * Diagramas panorâmicos para Tríades, Tétrades, Inversões, Campo Harmônico, Cadências, Modos Gregos e Dominantes Secundários.
 * Regra: Componentes vetoriais puros, SVG responsivo (< 380 linhas).
 */

import React from 'react';

/** 1. As 4 Tríades Fundamentais (m4-1: Maior, Menor, Diminuta, Aumentada) */
export const FourTriadsFamilyDiagram: React.FC = () => (
  <svg viewBox="0 0 960 240" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        AS 4 TRÍADES FUNDAMENTAIS DA HARMONIA
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A sobreposição de terças constrói as 4 qualidades básicas de acordes de 3 notas
      </text>
    </g>

    <g transform="translate(30, 52)">
      {[
        {
          name: 'TRÍADE MAIOR',
          formula: '1 - 3M - 5J',
          ex: 'C (C - E - G)',
          intervals: '+4st (3M) ➔ +3st (5J)',
          c: '#6366f1',
          feel: 'Estável, Clara, Brilhante',
        },
        {
          name: 'TRÍADE MENOR',
          formula: '1 - 3m - 5J',
          ex: 'Cm (C - E♭ - G)',
          intervals: '+3st (3m) ➔ +4st (5J)',
          c: '#06b6d4',
          feel: 'Nostálgica, Dramática',
        },
        {
          name: 'TRÍADE DIMINUTA',
          formula: '1 - 3m - 5dim',
          ex: 'C° (C - E♭ - G♭)',
          intervals: '+3st (3m) ➔ +3st (5dim)',
          c: '#f43f5e',
          feel: 'Tensa, Suspensa, Fechada',
        },
        {
          name: 'TRÍADE AUMENTADA',
          formula: '1 - 3M - 5aum',
          ex: 'C+ (C - E - G♯)',
          intervals: '+4st (3M) ➔ +4st (5aum)',
          c: '#f59e0b',
          feel: 'Etérea, Misteriosa, Aberta',
        },
      ].map((tr, i) => {
        const x = i * 228;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="215" height="165" rx="10" fill="rgba(255,255,255,0.03)" stroke={tr.c} strokeWidth="1.2" />
            <text x="107" y="26" textAnchor="middle" fill={tr.c} fontSize="12" fontWeight="black">{tr.name}</text>
            <rect x="20" y="38" width="175" height="30" rx="6" fill="#1e1b4b" />
            <text x="107" y="58" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
              {tr.ex}
            </text>
            <text x="107" y="90" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontWeight="bold">{tr.formula}</text>
            <text x="107" y="112" textAnchor="middle" fill="#94a3b8" fontSize="9.5">{tr.intervals}</text>
            <rect x="15" y="128" width="185" height="24" rx="4" fill="rgba(255,255,255,0.05)" />
            <text x="107" y="144" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">{tr.feel}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 2. Inversões de Acordes & Notação de Baixo Slash Chords (m4-2) */
export const ChordInversionsSlashChordsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 240" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">
        INVERSÕES DE ACORDES &amp; NOTAÇÃO DE BAIXO (SLASH CHORDS)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A cifra antes da barra indica o acorde; a letra depois da barra indica a nota que o baixo toca
      </text>
    </g>

    <g transform="translate(40, 52)">
      {[
        {
          pos: 'ESTADO FUNDAMENTAL',
          chord: 'C',
          bass: 'Baixo em Dó (1)',
          notes: 'C - E - G',
          desc: 'Som robusto, firme e conclusivo.',
          color: '#6366f1',
        },
        {
          pos: '1ª INVERSÃO',
          chord: 'C / E',
          bass: 'Baixo na Terça (3)',
          notes: 'E - G - C',
          desc: 'Aterrisagem suave, ideal para baixos caminhantes.',
          color: '#06b6d4',
        },
        {
          pos: '2ª INVERSÃO',
          chord: 'C / G',
          bass: 'Baixo na Quinta (5)',
          notes: 'G - C - E',
          desc: 'Mais instável, clássica para cadências (I 6/4).',
          color: '#10b981',
        },
      ].map((inv, idx) => {
        const x = idx * 300;
        return (
          <g key={idx} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="280" height="165" rx="10" fill="rgba(255,255,255,0.03)" stroke={inv.color} strokeWidth="1.2" />
            <text x="140" y="26" textAnchor="middle" fill={inv.color} fontSize="11" fontWeight="black">{inv.pos}</text>
            <rect x="25" y="38" width="230" height="42" rx="8" fill="#0f172a" stroke={inv.color} strokeWidth="1" />
            <text x="140" y="66" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="black" fontFamily="JetBrains Mono, monospace">
              {inv.chord}
            </text>
            <text x="140" y="104" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">{inv.notes}</text>
            <text x="140" y="122" textAnchor="middle" fill={inv.color} fontSize="10.5" fontWeight="bold">{inv.bass}</text>
            <text x="140" y="146" textAnchor="middle" fill="#94a3b8" fontSize="9">{inv.desc}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 3. Tétrades: As 5 Famílias de Acordes com Sétima (m4-3) */
export const FiveTetradsFamiliesDiagram: React.FC = () => (
  <svg viewBox="0 0 960 240" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        AS 5 FAMÍLIAS DE TÉTRADES (ACORDES COM SÉTIMA)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Acordes de 4 notas que dão sofisticação harmônica ao Jazz, Bossa Nova, MPB e Soul
      </text>
    </g>

    <g transform="translate(30, 52)">
      {[
        { c: '#6366f1', name: '7M (MAIOR)', chord: 'Cmaj7', form: '1 - 3M - 5J - 7M', use: 'Graus I e IV' },
        { c: '#f59e0b', name: '7 (DOMINANTE)', chord: 'C7', form: '1 - 3M - 5J - 7m', use: 'Grau V (Tensão)' },
        { c: '#06b6d4', name: 'm7 (MENOR)', chord: 'Cm7', form: '1 - 3m - 5J - 7m', use: 'Graus II, III, VI' },
        { c: '#f43f5e', name: 'm7(♭5) MEIO-DIM', chord: 'Cm7(♭5)', form: '1 - 3m - 5dim - 7m', use: 'Grau VII (ou II menor)' },
        { c: '#a855f7', name: '°7 (DIMINUTO)', chord: 'C°7', form: '1 - 3m - 5dim - 7dim', use: 'Tensão Simétrica' },
      ].map((tet, i) => {
        const x = i * 182;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="172" height="165" rx="8" fill="rgba(255,255,255,0.03)" stroke={tet.c} strokeWidth="1.2" />
            <text x="86" y="24" textAnchor="middle" fill={tet.c} fontSize="10.5" fontWeight="black">{tet.name}</text>
            <rect x="15" y="34" width="142" height="34" rx="6" fill="#1e1b4b" />
            <text x="86" y="58" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="black" fontFamily="JetBrains Mono, monospace">
              {tet.chord}
            </text>
            <text x="86" y="92" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontWeight="bold">{tet.form}</text>
            <rect x="12" y="112" width="148" height="38" rx="5" fill="rgba(255,255,255,0.05)" />
            <text x="86" y="128" textAnchor="middle" fill="#e2e8f0" fontSize="9">Função no Campo:</text>
            <text x="86" y="142" textAnchor="middle" fill={tet.c} fontSize="9.5" fontWeight="bold">{tet.use}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 4. O Campo Harmônico Maior Completo (m5-1) */
export const DiatonicHarmonicFieldDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#10b981" fontSize="14" fontWeight="black" letterSpacing="1">
        O CAMPO HARMÔNICO MAIOR (7 GRAUS EM TRÍADES E TÉTRADES)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A família completa de acordes gerada pela Escala de Dó Maior (C D E F G A B)
      </text>
    </g>

    <g transform="translate(30, 52)">
      {[
        { degree: 'I', triad: 'C', tetrad: 'Cmaj7', func: 'Tônica', c: '#10b981' },
        { degree: 'ii', triad: 'Dm', tetrad: 'Dm7', func: 'Subdominante', c: '#06b6d4' },
        { degree: 'iii', triad: 'Em', tetrad: 'Em7', func: 'Tônica', c: '#10b981' },
        { degree: 'IV', triad: 'F', tetrad: 'Fmaj7', func: 'Subdominante', c: '#06b6d4' },
        { degree: 'V', triad: 'G', tetrad: 'G7', func: 'Dominante', c: '#f43f5e' },
        { degree: 'vi', triad: 'Am', tetrad: 'Am7', func: 'Tônica', c: '#10b981' },
        { degree: 'vii°', triad: 'Bdim', tetrad: 'Bm7(♭5)', func: 'Dominante', c: '#f43f5e' },
      ].map((gr, idx) => {
        const x = idx * 129;
        return (
          <g key={idx} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="120" height="175" rx="8" fill="rgba(255,255,255,0.03)" stroke={gr.c} strokeWidth="1.2" />
            <text x="60" y="24" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">{gr.degree}</text>
            <rect x="12" y="34" width="96" height="30" rx="5" fill="#1e1b4b" />
            <text x="60" y="54" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">{gr.triad}</text>
            <text x="60" y="80" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="black">{gr.tetrad}</text>
            <rect x="8" y="112" width="104" height="48" rx="5" fill="rgba(255,255,255,0.05)" />
            <text x="60" y="130" textAnchor="middle" fill="#94a3b8" fontSize="8.5">Função:</text>
            <text x="60" y="146" textAnchor="middle" fill={gr.c} fontSize="9" fontWeight="bold">{gr.func}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 5. Cadências Históricas: II - V - I & Progressão Pop dos 4 Acordes (m5-3) */
export const CadencesAndPopProgressionDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        CADÊNCIAS FUNDAMENTAIS: II - V - I &amp; PROGRESSÃO POP (I - V - vi - IV)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        As sequências de acordes mais famosas da história da música clássica, jazz e sucessos globais
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Cadência Jazz / Bossa: II - V - I */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="435" height="175" rx="10" fill="rgba(6, 182, 212, 0.05)" stroke="#06b6d4" strokeWidth="1.2" />
        <text x="18" y="24" fill="#22d3ee" fontSize="12" fontWeight="black">1. A CADÊNCIA MESTRA: II ➔ V ➔ I (JAZZ / MPB)</text>
        <text x="18" y="40" fill="#94a3b8" fontSize="10">Subdominante (Dm7) ➔ Dominante (G7) ➔ Tônica (Cmaj7):</text>

        <g transform="translate(20, 55)">
          <rect x="0" y="0" width="105" height="50" rx="8" fill="#164e63" />
          <text x="52" y="28" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">Dm7 (II)</text>
          <text x="52" y="42" textAnchor="middle" fill="#a5f3fc" fontSize="9">Movimento</text>

          <text x="120" y="30" fill="#38bdf8" fontSize="18" fontWeight="bold">➔</text>

          <rect x="135" y="0" width="105" height="50" rx="8" fill="#881337" />
          <text x="187" y="28" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">G7 (V)</text>
          <text x="187" y="42" textAnchor="middle" fill="#fecdd3" fontSize="9">Tensão Máxima</text>

          <text x="255" y="30" fill="#38bdf8" fontSize="18" fontWeight="bold">➔</text>

          <rect x="270" y="0" width="105" height="50" rx="8" fill="#064e3b" />
          <text x="322" y="28" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">Cmaj7 (I)</text>
          <text x="322" y="42" textAnchor="middle" fill="#a7f3d0" fontSize="9">Repouso no Lar</text>
        </g>

        <rect x="20" y="125" width="395" height="34" rx="5" fill="#0e7490" />
        <text x="217" y="146" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontWeight="bold">
          A espinha dorsal de Garota de Ipanema, Autumn Leaves e standards
        </text>
      </g>

      {/* Progressão Pop: I - V - vi - IV */}
      <g transform="translate(455, 0)">
        <rect x="0" y="0" width="435" height="175" rx="10" fill="rgba(168, 85, 247, 0.05)" stroke="#a855f7" strokeWidth="1.2" />
        <text x="18" y="24" fill="#c084fc" fontSize="12" fontWeight="black">2. A PROGRESSÃO POP DOS 4 ACORDES (I - V - vi - IV)</text>
        <text x="18" y="40" fill="#94a3b8" fontSize="10">Mais de 10.000 hits mundiais usam este mesmo ciclo infinito:</text>

        <g transform="translate(15, 55)">
          {[
            { ch: 'C (I)', f: 'Tônica' },
            { ch: 'G (V)', f: 'Dominante' },
            { ch: 'Am (vi)', f: 'Relativa' },
            { ch: 'F (IV)', f: 'Subdom.' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 102}, 0)`}>
              <rect x="0" y="0" width="94" height="50" rx="8" fill="#3b0764" stroke="#a855f7" strokeWidth="1" />
              <text x="47" y="28" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">{item.ch}</text>
              <text x="47" y="42" textAnchor="middle" fill="#e9d5ff" fontSize="9">{item.f}</text>
            </g>
          ))}
        </g>

        <rect x="15" y="125" width="405" height="34" rx="5" fill="#581c87" />
        <text x="217" y="146" textAnchor="middle" fill="#f3e8ff" fontSize="9.5" fontWeight="bold">
          Let It Be, Someone Like You, Don't Stop Believin', Despacito...
        </text>
      </g>
    </g>
  </svg>
);

/** 6. O Segredo dos Modos Gregos (m6-1: 7 Cores da Mesma Escala) */
export const GreekModesPanoramicDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        OS 7 MODOS GREGOS: DO MAIS BRILHANTE AO MAIS ESCURO
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A mesma coleção de notas de Dó Maior (C-D-E-F-G-A-B) assumindo centros e emoções completamente distintas
      </text>
    </g>

    <g transform="translate(30, 52)">
      {[
        { name: '1. LÍDIO', note: 'Fá (IV)', mood: 'Mágico, Futurista', char: '#4 (4ª Aum)', c: '#38bdf8' },
        { name: '2. JÔNIO', note: 'Dó (I)', mood: 'Alegre, Estável (Maior)', char: 'Escala Maior', c: '#10b981' },
        { name: '3. MIXOLÍDIO', note: 'Sol (V)', mood: 'Blues, Baião, Rock', char: '♭7 (7ª Menor)', c: '#f59e0b' },
        { name: '4. DÓRICO', note: 'Ré (II)', mood: 'Nostálgico, Jazzístico', char: '6M (6ª Maior)', c: '#6366f1' },
        { name: '5. EÓLIO', note: 'Lá (VI)', mood: 'Melancólico (Menor)', char: 'Escala Menor', c: '#818cf8' },
        { name: '6. FRÍGIO', note: 'Mi (III)', mood: 'Flamenco, Espanhol', char: '♭2 (2ª Menor)', c: '#f43f5e' },
        { name: '7. LÓCRIO', note: 'Si (VII)', mood: 'Tenso, Instável, Obscuro', char: '♭5 (5ª Diminuta)', c: '#a855f7' },
      ].map((mode, i) => {
        const x = i * 128;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="120" height="175" rx="8" fill="rgba(255,255,255,0.03)" stroke={mode.c} strokeWidth="1.2" />
            <text x="60" y="24" textAnchor="middle" fill={mode.c} fontSize="11" fontWeight="black">{mode.name}</text>
            <rect x="12" y="32" width="96" height="30" rx="5" fill="#1e1b4b" />
            <text x="60" y="52" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{mode.note}</text>
            <rect x="8" y="74" width="104" height="42" rx="4" fill="rgba(255,255,255,0.05)" />
            <text x="60" y="90" textAnchor="middle" fill="#cbd5e1" fontSize="8.5">Clima / Cor:</text>
            <text x="60" y="104" textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontWeight="bold">{mode.mood}</text>
            <rect x="8" y="124" width="104" height="38" rx="4" fill="#0f172a" stroke={mode.c} strokeWidth="0.8" />
            <text x="60" y="139" textAnchor="middle" fill="#94a3b8" fontSize="8">Nota Alvo:</text>
            <text x="60" y="152" textAnchor="middle" fill={mode.c} fontSize="9" fontWeight="black">{mode.char}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 7. Dominantes Secundários & Empréstimo Modal (m7-1) */
export const SecondaryDominantsAndModalInterchangeDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#ec4899" fontSize="14" fontWeight="black" letterSpacing="1">
        DOMINANTES SECUNDÁRIOS &amp; EMPRÉSTIMO MODAL (AEM)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Como introduzir notas de fora da escala para criar momentos de profunda emoção harmônica
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Bloco 1: Dominantes Secundários */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="435" height="175" rx="10" fill="rgba(236, 72, 153, 0.05)" stroke="#ec4899" strokeWidth="1.2" />
        <text x="18" y="24" fill="#f472b6" fontSize="11.5" fontWeight="black">1. DOMINANTES SECUNDÁRIOS (V7 / X):</text>
        <text x="18" y="40" fill="#94a3b8" fontSize="10">Preparam qualquer acorde diatônico com um acorde maior com 7ª:</text>

        <g transform="translate(20, 55)">
          <rect x="0" y="0" width="115" height="50" rx="8" fill="#831843" />
          <text x="57" y="26" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">A7 (V7 / ii)</text>
          <text x="57" y="42" textAnchor="middle" fill="#fbcfe8" fontSize="9">Prepara o Dm</text>

          <text x="135" y="30" fill="#ec4899" fontSize="18" fontWeight="bold">➔</text>

          <rect x="155" y="0" width="115" height="50" rx="8" fill="#831843" />
          <text x="212" y="26" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">D7 (V7 / V)</text>
          <text x="212" y="42" textAnchor="middle" fill="#fbcfe8" fontSize="9">Prepara o Sol</text>

          <text x="290" y="30" fill="#ec4899" fontSize="18" fontWeight="bold">➔</text>

          <rect x="310" y="0" width="85" height="50" rx="8" fill="#064e3b" />
          <text x="352" y="26" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">G (V)</text>
          <text x="352" y="42" textAnchor="middle" fill="#a7f3d0" fontSize="9">Destino</text>
        </g>

        <rect x="20" y="125" width="395" height="34" rx="5" fill="#500724" />
        <text x="217" y="146" textAnchor="middle" fill="#fce7f3" fontSize="9.5" fontWeight="bold">
          Dica: Todo acorde diatônico pode ser precedido por seu próprio V7!
        </text>
      </g>

      {/* Bloco 2: Acordes de Empréstimo Modal (AEM) */}
      <g transform="translate(455, 0)">
        <rect x="0" y="0" width="435" height="175" rx="10" fill="rgba(168, 85, 247, 0.05)" stroke="#a855f7" strokeWidth="1.2" />
        <text x="18" y="24" fill="#c084fc" fontSize="11.5" fontWeight="black">2. EMPRÉSTIMO MODAL (PEDIR EMPRESTADO AO MENOR):</text>
        <text x="18" y="40" fill="#94a3b8" fontSize="10">Em Tom Maior (C), importar acordes do homônimo menor (Cm):</text>

        <g transform="translate(15, 55)">
          {[
            { ch: 'Fm (iv)', sub: 'Subdominante Menor (Dramático)', c: '#3b0764' },
            { ch: 'A♭ (♭VI)', sub: 'Cromático Heroico (Cinema)', c: '#3b0764' },
            { ch: 'B♭ (♭VII)', sub: 'Subtônica Rock / Soul', c: '#3b0764' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 135}, 0)`}>
              <rect x="0" y="0" width="128" height="50" rx="8" fill={item.c} stroke="#a855f7" strokeWidth="1" />
              <text x="64" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{item.ch}</text>
              <text x="64" y="40" textAnchor="middle" fill="#e9d5ff" fontSize="8">{item.sub}</text>
            </g>
          ))}
        </g>

        <rect x="15" y="125" width="405" height="34" rx="5" fill="#3b0764" />
        <text x="217" y="146" textAnchor="middle" fill="#f3e8ff" fontSize="9.5" fontWeight="bold">
          O acorde IVm (Fm em C) gera o famoso "toque de lágrimas" dos Beatles!
        </text>
      </g>
    </g>
  </svg>
);
