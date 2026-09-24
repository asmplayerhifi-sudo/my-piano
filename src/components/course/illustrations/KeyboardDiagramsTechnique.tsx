/**
 * illustrations/KeyboardDiagramsTechnique.tsx
 * Diagramas panorâmicos padronizados (960x250) para técnicas avançadas de teclado:
 * Arpejos 1-5-8, Passagem do Polegar (Thumb-Under), Hanon, Acordes Worship, Blues/Boogie e Pedal de Sustain.
 * Regra: Componentes vetoriais puros, viewBox padronizado (0 0 960 250), SVG responsivo (< 380 linhas).
 */

import React from 'react';

/** 1. O Arpejo Aberto 1-5-8 e Textura de Balada (t6-1 & t6-2) */
export const ArpeggioOpenTextureDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        O ARPEJO ABERTO 1 - 5 - 8 (TRILHAS SONORAS &amp; BALADAS POP)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A textura mais cinematográfica do piano: preenche todo o espectro sonoro sem embolar nos graves
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Visualização das Ondas de Ataque */}
      {[
        { step: '1. FUNDAMENTAL (GRAVE)', note: 'C2 (Dó)', hand: 'ME • Dedo 5', c: '#6366f1' },
        { step: '2. QUINTA JUSTA', note: 'G2 (Sol)', hand: 'ME • Dedo 2 ou 1', c: '#06b6d4' },
        { step: '3. OITAVA SUPERIOR', note: 'C3 (Dó)', hand: 'ME • Dedo 1', c: '#10b981' },
        { step: '4. DÉCIMA (TERÇA ABERTA)', note: 'E3 (Mi)', hand: 'MD • Dedo 3', c: '#f59e0b' },
      ].map((arp, i) => {
        const x = i * 225;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="210" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke={arp.c} strokeWidth="1.2" />
            <text x="105" y="26" textAnchor="middle" fill={arp.c} fontSize="10.5" fontWeight="black">{arp.step}</text>
            <circle cx="105" cy="72" r="32" fill="#1e1b4b" stroke={arp.c} strokeWidth="2" />
            <text x="105" y="78" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="black">{arp.note}</text>
            <rect x="18" y="122" width="174" height="34" rx="6" fill="#0f172a" />
            <text x="105" y="143" textAnchor="middle" fill="#a5b4fc" fontSize="10.5" fontWeight="bold">{arp.hand}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 2. A Passagem Secreta do Polegar / Thumb-Under na Escala Maior (t7-1 & t7-2) */
export const ThumbUnderScaleTechniqueDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#10b981" fontSize="14" fontWeight="black" letterSpacing="1">
        A PASSAGEM DO POLEGAR (THUMB-UNDER) NA ESCALA MAIOR: 1 - 2 - 3 ➔ 1 - 2 - 3 - 4 - 5
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        O polegar passa suavemente por debaixo da palma da mão na nota Fá, permitindo tocar infinitas oitavas sem solavancos
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* 8 Notas da Escala de Dó Maior */}
      {[
        { note: 'C3', f: '1', n: 'Dó', c: '#6366f1' },
        { note: 'D3', f: '2', n: 'Ré', c: '#6366f1' },
        { note: 'E3', f: '3', n: 'Mi', c: '#f43f5e' },
        { note: 'F3', f: '★ 1', n: 'Fá (Thumb-Under)', c: '#10b981' },
        { note: 'G3', f: '2', n: 'Sol', c: '#38bdf8' },
        { note: 'A3', f: '3', n: 'Lá', c: '#38bdf8' },
        { note: 'B3', f: '4', n: 'Si', c: '#38bdf8' },
        { note: 'C4', f: '5', n: 'Dó', c: '#a855f7' },
      ].map((item, idx) => {
        const x = idx * 112;
        return (
          <g key={idx} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="102" height="175" rx="8" fill="rgba(255,255,255,0.03)" stroke={item.c} strokeWidth={idx === 3 ? 2 : 1} />
            <text x="51" y="26" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">{item.note}</text>
            <circle cx="51" cy="70" r="24" fill={idx === 3 ? '#059669' : '#1e1b4b'} stroke={item.c} strokeWidth="1.5" />
            <text x="51" y="76" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">{item.f}</text>
            <rect x="8" y="112" width="86" height="48" rx="5" fill="rgba(255,255,255,0.05)" />
            <text x="51" y="132" textAnchor="middle" fill="#cbd5e1" fontSize="9">{item.n}</text>
            <text x="51" y="148" textAnchor="middle" fill={item.c} fontSize="8.5" fontWeight="bold">
              {idx === 3 ? 'PASSAGEM!' : `Dedo ${item.f}`}
            </text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 3. Hanon: Independência do 4º e 5º Dedos (t7-3) */
export const HanonIndependenceDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#f59e0b" fontSize="14" fontWeight="black" letterSpacing="1">
        HANON ESSENCIAL: INDEPENDÊNCIA E FORÇA DOS DEDOS 4 (ANELAR) E 5 (MÍNIMO)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        O tendão do 4º dedo é anatomicamente conectado ao 3º e 5º dedos: o treino lento vence essa barreira física
      </text>
    </g>

    <g transform="translate(35, 52)">
      {[
        {
          d: 'DEDO 1 & 2 (PILAR FORTE)',
          desc: 'Polegar e Indicador possuem músculos próprios e naturalmente fortes.',
          status: 'Força Alta',
          c: '#10b981',
        },
        {
          d: 'DEDO 3 (CENTRO DE EQUILÍBRIO)',
          desc: 'O mais longo; atua como eixo de gravidade para a rotação do antebraço.',
          status: 'Eixo Neutro',
          c: '#38bdf8',
        },
        {
          d: 'DEDO 4 & 5 (DESAFIO HANON)',
          desc: 'Compartilham bainha tendínea. Exigem articulação alta e toque lento articulado.',
          status: 'Foco de Isolamento',
          c: '#f43f5e',
        },
      ].map((card, i) => {
        const x = i * 300;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="280" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke={card.c} strokeWidth="1.2" />
            <text x="140" y="28" textAnchor="middle" fill={card.c} fontSize="11" fontWeight="black">{card.d}</text>
            <rect x="20" y="44" width="240" height="60" rx="6" fill="#1e1b4b" />
            <text x="140" y="68" textAnchor="middle" fill="#cbd5e1" fontSize="10">{card.desc.slice(0, 36)}</text>
            <text x="140" y="86" textAnchor="middle" fill="#cbd5e1" fontSize="10">{card.desc.slice(36)}</text>
            <rect x="20" y="118" width="240" height="38" rx="6" fill="rgba(255,255,255,0.05)" />
            <text x="140" y="142" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">{card.status}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 4. Acordes Sus2, Sus4, Add9 & A Textura Worship no Teclado (t8-1 & t8-2) */
export const ModernChordsWorshipDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#a78bfa" fontSize="14" fontWeight="black" letterSpacing="1">
        HARMONIA MODERNA: ACORDES SUS2, SUS4 &amp; ADD9 (A TEXTURA WORSHIP)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Substituir ou somar a terça cria uma sonoridade aberta, flutuante, celestial e moderna
      </text>
    </g>

    <g transform="translate(35, 52)">
      {[
        {
          name: 'Csus2 (SUSPENSO EM 2ª)',
          notes: 'C - D - G',
          formula: '1 + 2M + 5J',
          feel: 'Aberto, esperançoso, límpido',
          c: '#38bdf8',
        },
        {
          name: 'Csus4 (SUSPENSO EM 4ª)',
          notes: 'C - F - G',
          formula: '1 + 4J + 5J',
          feel: 'Tensão solene que pede resolução em C',
          c: '#f59e0b',
        },
        {
          name: 'Cadd9 (ADIÇÃO DE 9ª)',
          notes: 'C - E - G - D',
          formula: '1 + 3M + 5J + 9M',
          feel: 'O som acústico moderno por excelência',
          c: '#10b981',
        },
      ].map((w, i) => {
        const x = i * 300;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="280" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke={w.c} strokeWidth="1.2" />
            <text x="140" y="28" textAnchor="middle" fill={w.c} fontSize="11" fontWeight="black">{w.name}</text>
            <rect x="25" y="42" width="230" height="42" rx="8" fill="#1e1b4b" />
            <text x="140" y="68" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="black" fontFamily="JetBrains Mono, monospace">
              {w.notes}
            </text>
            <text x="140" y="110" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">{w.formula}</text>
            <rect x="15" y="126" width="250" height="32" rx="5" fill="rgba(255,255,255,0.04)" />
            <text x="140" y="146" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">{w.feel}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 5. Escala de Blues, Blue Notes & Baixo Boogie-Woogie (t9-1 & t9-2) */
export const BluesScaleAndShuffleDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        A ESCALA DE BLUES EM DÓ &amp; O BAIXO OSTINATO SHUFFLE (BOOGIE-WOOGIE)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A "Blue Note" (Fá♯ / Sol♭) gera a alma, o lamento e o balanço inconfundível do Blues e Rock 'n' Roll
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* 6 Notas da Escala de Blues */}
      {[
        { note: 'C', deg: '1 (Raiz)', c: '#6366f1' },
        { note: 'E♭', deg: '♭3 (Blue Note 1)', c: '#38bdf8' },
        { note: 'F', deg: '4 (4ª Justa)', c: '#6366f1' },
        { note: 'F♯ / G♭', deg: '★ ♭5 (BLUE NOTE MESTRA)', c: '#f43f5e' },
        { note: 'G', deg: '5 (5ª Justa)', c: '#6366f1' },
        { note: 'B♭', deg: '♭7 (7ª Menor)', c: '#f59e0b' },
      ].map((bn, i) => {
        const x = i * 148;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="138" height="175" rx="8" fill="rgba(255,255,255,0.03)" stroke={bn.c} strokeWidth={i === 3 ? 2 : 1.2} />
            <text x="69" y="28" textAnchor="middle" fill={bn.c} fontSize="11" fontWeight="black">GRAU {i + 1}</text>
            <circle cx="69" cy="75" r="30" fill={i === 3 ? '#881337' : '#1e1b4b'} stroke={bn.c} strokeWidth="1.5" />
            <text x="69" y="82" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="black">{bn.note}</text>
            <rect x="10" y="122" width="118" height="38" rx="5" fill="rgba(255,255,255,0.05)" />
            <text x="69" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontWeight="bold">{bn.deg}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 6. Timing do Pedal de Sustain & Dinâmica Musical (t10-1 & t10-2) */
export const SustainPedalAndDynamicsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#10b981" fontSize="14" fontWeight="black" letterSpacing="1">
        O TIMING DO PEDAL DE SUSTAIN (TROCA SINCRONIZADA) &amp; RÉGUA DE DINÂMICA
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Regra de ouro: o pedal sobe e desce IMEDIATAMENTE APÓS as novas teclas serem tocadas, limpando a harmonia anterior
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Bloco 1: O Ciclo do Pedal */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="435" height="175" rx="10" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" strokeWidth="1.2" />
        <text x="18" y="24" fill="#34d399" fontSize="11.5" fontWeight="black">1. TIMING SINCOPAD O DO PEDAL DE SUSTAIN:</text>

        <g transform="translate(20, 48)">
          <rect x="0" y="0" width="395" height="42" rx="6" fill="#064e3b" />
          <text x="197" y="26" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
            1. Toca o Acorde ➔ 2. Solta o Pedal ➔ 3. Pisa de Novo
          </text>
        </g>

        <rect x="20" y="105" width="395" height="52" rx="6" fill="#022c22" />
        <text x="197" y="126" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
          ★ NUNCA pise junto com a mão!
        </text>
        <text x="197" y="144" textAnchor="middle" fill="#cbd5e1" fontSize="9">
          Pisar antes ou exatamente junto mistura resíduos sonoros e "embola" o som.
        </text>
      </g>

      {/* Bloco 2: Escala de Dinâmica */}
      <g transform="translate(455, 0)">
        <rect x="0" y="0" width="435" height="175" rx="10" fill="rgba(56, 189, 248, 0.05)" stroke="#38bdf8" strokeWidth="1.2" />
        <text x="18" y="24" fill="#38bdf8" fontSize="11.5" fontWeight="black">2. ESCALA DE DINÂMICA MUSICAL (PIANÍSSIMO AO FORTÍSSIMO):</text>

        <g transform="translate(15, 45)">
          {[
            { s: 'pp', n: 'Pianíssimo', c: '#6366f1' },
            { s: 'p', n: 'Piano', c: '#38bdf8' },
            { s: 'mp', n: 'Mezzo-P.', c: '#06b6d4' },
            { s: 'mf', n: 'Mezzo-F.', c: '#10b981' },
            { s: 'f', n: 'Forte', c: '#f59e0b' },
            { s: 'ff', n: 'Fortíssimo', c: '#f43f5e' },
          ].map((dyn, i) => (
            <g key={i} transform={`translate(${i * 68}, 0)`}>
              <rect x="0" y="0" width="62" height="60" rx="6" fill="#1e1b4b" stroke={dyn.c} strokeWidth="1" />
              <text x="31" y="28" textAnchor="middle" fill={dyn.c} fontSize="16" fontWeight="black" fontFamily="serif">{dyn.s}</text>
              <text x="31" y="48" textAnchor="middle" fill="#cbd5e1" fontSize="7.5">{dyn.n}</text>
            </g>
          ))}
        </g>

        <rect x="15" y="118" width="405" height="40" rx="5" fill="#082f49" />
        <text x="202" y="142" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontWeight="bold">
          A dinâmica transmite a alma e o sentimento humano da interpretação.
        </text>
      </g>
    </g>
  </svg>
);
