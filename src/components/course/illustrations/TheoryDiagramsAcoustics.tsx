/**
 * illustrations/TheoryDiagramsAcoustics.tsx
 * Diagramas panorâmicos de alta definição para Acústica, Notação na Pauta Dupla, Ritmo e Intervalos Básicos.
 * Regra: Componentes vetoriais puros, SVG responsivo (< 300 linhas).
 */

import React from 'react';

/** 1. As 4 Propriedades Fundamentais do Som (m1-1) */
export const SoundPropertiesDiagram: React.FC = () => (
  <svg viewBox="0 0 960 220" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 20)">
      <text x="0" y="24" fill="#a855f7" fontSize="14" fontWeight="black" letterSpacing="1">
        AS 4 PROPRIEDADES FUNDAMENTAIS DO SOM
      </text>
      <text x="0" y="44" fill="#94a3b8" fontSize="11">
        Como o cérebro decodifica a vibração mecânica do ar em experiência musical
      </text>
    </g>

    <g transform="translate(40, 75)">
      {[
        { title: '1. ALTURA (Hz)', sub: 'Frequência de Vibração', desc: 'Rápida = Agudo / Lenta = Grave', color: '#6366f1', icon: '∿' },
        { title: '2. DURAÇÃO (s)', sub: 'Tempo de Sustentação', desc: 'Semibreve, Mínima, Semínima...', color: '#06b6d4', icon: '⏱' },
        { title: '3. INTENSIDADE (dB)', sub: 'Amplitude da Onda', desc: 'Volume e dinâmica (pp até ff)', color: '#10b981', icon: '▲' },
        { title: '4. TIMBRE', sub: 'Harmônicos / Identidade', desc: 'Diferencia Piano de Violão ou Voz', color: '#f59e0b', icon: '✦' },
      ].map((p, i) => {
        const x = i * 220;
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="0" y="0" width="205" height="105" rx="10" fill="rgba(255,255,255,0.03)" stroke={p.color} strokeWidth="1.2" />
            <text x="102" y="28" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="black">{p.title}</text>
            <text x="102" y="50" textAnchor="middle" fill={p.color} fontSize="11" fontWeight="bold">{p.sub}</text>
            <rect x="10" y="65" width="185" height="26" rx="5" fill="#1e1b4b" />
            <text x="102" y="82" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">{p.desc}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

/** 2. O Grande Pentagrama / Grand Staff (m1-2: Pauta, Claves de Sol e Fá e Dó Central C3) */
export const GrandStaffCompleteDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#38bdf8" fontSize="14" fontWeight="black" letterSpacing="1">
        O GRANDE PENTAGRAMA (GRAND STAFF) &amp; DÓ CENTRAL (C3)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A união da Clave de Sol (agudos) e Clave de Fá (graves) com o Dó Central C3 na linha suplementar divisória
      </text>
    </g>

    <g transform="translate(40, 52)">
      {/* Chave de Ligação Esquerda (Chave Acoplada) */}
      <path d="M 45,10 C 25,45 25,75 10,95 C 25,115 25,145 45,180" fill="none" stroke="#6366f1" strokeWidth="2.5" />
      <line x1="45" y1="10" x2="45" y2="180" stroke="#475569" strokeWidth="2" />

      {/* Pentagrama Superior (Clave de Sol) - 5 Linhas */}
      {[10, 26, 42, 58, 74].map((y, i) => (
        <line key={`treble-${i}`} x1="45" y1={y} x2="880" y2={y} stroke="#475569" strokeWidth="1.2" />
      ))}
      <text x="55" y="65" fill="#a5b4fc" fontSize="56" fontFamily="serif" fontWeight="bold">𝄞</text>
      <text x="100" y="24" fill="#a5b4fc" fontSize="10" fontWeight="bold">CLAVE DE SOL (Mão Direita • Agudos)</text>

      {/* Linha Suplementar Central do Dó Central (C3) */}
      <g transform="translate(440, 95)">
        <line x1="-35" y1="0" x2="35" y2="0" stroke="#38bdf8" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="13" ry="8.5" fill="#38bdf8" transform="rotate(-20)" />
        <rect x="-65" y="-30" width="130" height="20" rx="5" fill="#0284c7" />
        <text x="0" y="-16" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="black" fontFamily="JetBrains Mono, monospace">
          ★ DÓ CENTRAL (C3)
        </text>
        <text x="0" y="22" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="bold">
          MIDI 60 • Ponto de Encontro
        </text>
      </g>

      {/* Pentagrama Inferior (Clave de Fá) - 5 Linhas */}
      {[116, 132, 148, 164, 180].map((y, i) => (
        <line key={`bass-${i}`} x1="45" y1={y} x2="880" y2={y} stroke="#475569" strokeWidth="1.2" />
      ))}
      <text x="55" y="160" fill="#fde68a" fontSize="50" fontFamily="serif" fontWeight="bold">𝄢</text>
      <text x="100" y="174" fill="#fde68a" fontSize="10" fontWeight="bold">CLAVE DE FÁ (Mão Esquerda • Graves)</text>

      {/* Notas Orientativas Rápidas */}
      <g transform="translate(180, 0)">
        {/* Mi3 na 1ª linha da Clave de Sol */}
        <ellipse cx="60" cy="74" rx="8" ry="5.5" fill="#6366f1" transform="rotate(-20 60 74)" />
        <text x="60" y="90" textAnchor="middle" fill="#c7d2fe" fontSize="9" fontWeight="bold">Mi3 (1ª L)</text>

        {/* Sol3 na 2ª linha da Clave de Sol */}
        <ellipse cx="140" cy="58" rx="8" ry="5.5" fill="#38bdf8" transform="rotate(-20 140 58)" />
        <text x="140" y="44" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">Sol3 (2ª L)</text>
      </g>

      <g transform="translate(560, 0)">
        {/* Fá2 na 4ª linha da Clave de Fá */}
        <ellipse cx="60" cy="132" rx="8" ry="5.5" fill="#f59e0b" transform="rotate(-20 60 132)" />
        <text x="60" y="122" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">Fá2 (4ª L)</text>

        {/* Lá2 na 5ª linha da Clave de Fá */}
        <ellipse cx="140" cy="116" rx="8" ry="5.5" fill="#f43f5e" transform="rotate(-20 140 116)" />
        <text x="140" y="106" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold">Lá2 (5ª L)</text>
      </g>
    </g>
  </svg>
);

/** 3. Figuras Rítmicas & Fórmulas de Compasso (m1-3) */
export const RhythmAndMeterComboDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#10b981" fontSize="14" fontWeight="black" letterSpacing="1">
        HIERARQUIA RÍTMICA &amp; ANATOMIA DO COMPASSO (4/4, 3/4, 2/4)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        A proporção matemática das durações e como o numerador e denominador organizam os pulsos
      </text>
    </g>

    <g transform="translate(35, 52)">
      {/* Coluna Esquerda: Pirâmide Proporcional de Durações */}
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="530" height="175" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
        <text x="18" y="24" fill="#34d399" fontSize="11" fontWeight="black">DIVISÃO PROPORCIONAL DAS NOTAS (÷2):</text>

        {/* Semibreve */}
        <g transform="translate(18, 36)">
          <rect x="0" y="0" width="494" height="26" rx="5" fill="#312e81" stroke="#6366f1" strokeWidth="1" />
          <text x="12" y="17" fill="#ffffff" fontSize="10.5" fontWeight="bold">𝅝 SEMIBREVE (1 nota inteira = 4 tempos no 4/4)</text>
          <text x="475" y="17" textAnchor="end" fill="#c7d2fe" fontSize="10" fontWeight="mono">Valor 1</text>
        </g>

        {/* Mínima */}
        <g transform="translate(18, 68)">
          <rect x="0" y="0" width="242" height="26" rx="5" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
          <text x="10" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">𝅗𝅥 MÍNIMA (2 tempos)</text>
          <rect x="252" y="0" width="242" height="26" rx="5" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
          <text x="262" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">𝅗𝅥 MÍNIMA (2 tempos)</text>
        </g>

        {/* Semínima */}
        <g transform="translate(18, 100)">
          {[0, 126, 252, 378].map((x, i) => (
            <g key={i} transform={`translate(${x}, 0)`}>
              <rect x="0" y="0" width="116" height="26" rx="5" fill="#065f46" stroke="#10b981" strokeWidth="1" />
              <text x="8" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">𝅘𝅥 SEMÍNIMA (1t)</text>
            </g>
          ))}
        </g>

        {/* Colcheia */}
        <g transform="translate(18, 132)">
          {[0, 63, 126, 189, 252, 315, 378, 441].map((x, i) => (
            <g key={i} transform={`translate(${x}, 0)`}>
              <rect x="0" y="0" width="53" height="26" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="0.8" />
              <text x="26" y="17" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">𝅘𝅥𝅮 (½t)</text>
            </g>
          ))}
        </g>
      </g>

      {/* Coluna Direita: Fórmula de Compasso */}
      <g transform="translate(545, 0)">
        <rect x="0" y="0" width="345" height="175" rx="10" fill="rgba(6, 182, 212, 0.05)" stroke="#06b6d4" strokeWidth="1.2" />

        {/* Símbolo 4/4 */}
        <g transform="translate(25, 25)">
          <rect x="0" y="0" width="80" height="125" rx="8" fill="#083344" stroke="#0891b2" />
          <text x="40" y="55" textAnchor="middle" fill="#ffffff" fontSize="44" fontWeight="black">4</text>
          <line x1="15" y1="65" x2="65" y2="65" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="40" y="110" textAnchor="middle" fill="#38bdf8" fontSize="44" fontWeight="black">4</text>
        </g>

        {/* Explicações da Fração */}
        <g transform="translate(120, 20)">
          <text x="0" y="16" fill="#a5f3fc" fontSize="10.5" fontWeight="black">NUMERADOR (4):</text>
          <text x="0" y="32" fill="#cbd5e1" fontSize="9.5">Quantidade de tempos por compasso</text>

          <text x="0" y="66" fill="#67e8f9" fontSize="10.5" fontWeight="black">DENOMINADOR (4):</text>
          <text x="0" y="82" fill="#cbd5e1" fontSize="9.5">Figura que vale 1 tempo (4 = Semínima)</text>

          <rect x="0" y="102" width="210" height="42" rx="6" fill="#164e63" />
          <text x="10" y="120" fill="#ffffff" fontSize="9.5" fontWeight="bold">Padrões Universais:</text>
          <text x="10" y="134" fill="#a5f3fc" fontSize="8.5">• 2/4 (Binário) • 3/4 (Valsa) • 4/4 (Pop)</text>
        </g>
      </g>
    </g>
  </svg>
);

/** 4. Tons, Semitons Naturais & Enarmonia (m2-1) */
export const TonesSemitonesEnharmonicsDiagram: React.FC = () => (
  <svg viewBox="0 0 960 250" className="w-full h-auto rounded-2xl bg-[#070714] border border-white/10 select-none shadow-xl">
    <g transform="translate(30, 16)">
      <text x="0" y="18" fill="#fbbf24" fontSize="14" fontWeight="black" letterSpacing="1">
        TONS, SEMITONS NATURAIS &amp; ENARMONIA (C♯ = D♭)
      </text>
      <text x="0" y="34" fill="#94a3b8" fontSize="11">
        Distância física entre as teclas: 1 casa/tecla = Semitom (ST) | 2 casas/teclas = Tom Inteiro (T)
      </text>
    </g>

    <g transform="translate(40, 52)">
      {/* Mini Teclado Ilustrativo para Visualizar Semitons e Enarmonias */}
      <g transform="translate(0, 0)">
        {/* 7 Teclas Brancas */}
        {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note, i) => (
          <g key={i} transform={`translate(${i * 65}, 0)`}>
            <rect x="0" y="0" width="60" height="110" rx="5" fill="#f8fafc" stroke="#94a3b8" />
            <text x="30" y="98" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="black">{note}</text>
          </g>
        ))}

        {/* Teclas Pretas com Enarmonia */}
        {[
          { x: 42, label1: 'C♯', label2: 'D♭' },
          { x: 107, label1: 'D♯', label2: 'E♭' },
          { x: 237, label1: 'F♯', label2: 'G♭' },
          { x: 302, label1: 'G♯', label2: 'A♭' },
          { x: 367, label1: 'A♯', label2: 'B♭' },
        ].map((k, i) => (
          <g key={i} transform={`translate(${k.x}, 0)`}>
            <rect x="0" y="0" width="38" height="68" rx="4" fill="#09090b" stroke="#6366f1" strokeWidth="1.2" />
            <text x="19" y="30" textAnchor="middle" fill="#a5b4fc" fontSize="9.5" fontWeight="bold">{k.label1}</text>
            <text x="19" y="44" textAnchor="middle" fill="#cbd5e1" fontSize="7">=</text>
            <text x="19" y="56" textAnchor="middle" fill="#f43f5e" fontSize="9.5" fontWeight="bold">{k.label2}</text>
          </g>
        ))}

        {/* Destaque dos Semitons Naturais (E-F e B-C sem tecla preta) */}
        <path d="M 162,115 L 162,130 L 227,130 L 227,115" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
        <rect x="155" y="135" width="80" height="22" rx="4" fill="#881337" />
        <text x="195" y="150" textAnchor="middle" fill="#fecdd3" fontSize="8.5" fontWeight="bold">
          E-F (Semitom)
        </text>
      </g>

      {/* Painel Explicativo à Direita */}
      <g transform="translate(480, 0)">
        <rect x="0" y="0" width="400" height="175" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />

        <g transform="translate(20, 20)">
          <text x="0" y="14" fill="#f59e0b" fontSize="12" fontWeight="black">1. O QUE É ENARMONIA?</text>
          <text x="0" y="32" fill="#cbd5e1" fontSize="10">Dois nomes diferentes para o MESMO som e tecla física.</text>
          <text x="0" y="48" fill="#94a3b8" fontSize="9.5">• Exemplo: C♯ (Dó sustenido) soa idêntico a D♭ (Ré bemol).</text>

          <text x="0" y="78" fill="#38bdf8" fontSize="12" fontWeight="black">2. OS 2 SEMITONS NATURAIS:</text>
          <text x="0" y="96" fill="#cbd5e1" fontSize="10">Entre MI-FÁ e SI-DÓ não existem teclas pretas!</text>
          <text x="0" y="112" fill="#94a3b8" fontSize="9.5">• A distância direta entre essas notas brancas já é de 1 semitom.</text>

          <rect x="0" y="125" width="360" height="30" rx="5" fill="#1e1b4b" />
          <text x="180" y="144" textAnchor="middle" fill="#a5b4fc" fontSize="9.5" fontWeight="bold">
            Tom Inteiro = 2 Semitons (Ex: C ➔ D pula a tecla preta C♯)
          </text>
        </g>
      </g>
    </g>
  </svg>
);
