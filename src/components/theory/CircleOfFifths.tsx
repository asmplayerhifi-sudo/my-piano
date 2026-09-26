import React, { useState } from 'react';
import { buildChord, parseChord } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { Compass, Music, Volume2, Sparkles } from 'lucide-react';

export interface CircleOfFifthsProps {
  selectedKey?: string;
  onKeySelect?: (key: string) => void;
  className?: string;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedKey: externalKey,
  onKeySelect,
  className = '',
}) => {
  const [internalKey, setInternalKey] = useState<string>('C');
  const [isPlayingCadence, setIsPlayingCadence] = useState<boolean>(false);
  const [activeCadenceIdx, setActiveCadenceIdx] = useState<number | null>(null);

  const selectedKey = externalKey ?? internalKey;

  const circleData = [
    { key: 'C', minor: 'Am', sharps: 0, label: '0' },
    { key: 'G', minor: 'Em', sharps: 1, label: '1♯' },
    { key: 'D', minor: 'Bm', sharps: 2, label: '2♯' },
    { key: 'A', minor: 'F#m', sharps: 3, label: '3♯' },
    { key: 'E', minor: 'C#m', sharps: 4, label: '4♯' },
    { key: 'B', minor: 'G#m', sharps: 5, label: '5♯' },
    { key: 'F#', minor: 'D#m', sharps: 6, label: '6♯' },
    { key: 'Db', minor: 'Bbm', sharps: -5, label: '5♭' },
    { key: 'Ab', minor: 'Fm', sharps: -4, label: '4♭' },
    { key: 'Eb', minor: 'Cm', sharps: -3, label: '3♭' },
    { key: 'Bb', minor: 'Gm', sharps: -2, label: '2♭' },
    { key: 'F', minor: 'Dm', sharps: -1, label: '1♭' },
  ];

  const handleKeyClick = (key: string) => {
    setInternalKey(key);
    onKeySelect?.(key);
    // Toca o acorde de referência
    const parsed = parseChord(key);
    if (parsed && parsed.midiNotes.length > 0) {
      soundEngine.playChord(parsed.midiNotes, 'piano', 1.5);
    } else {
      const chord = buildChord(key, 'major');
      const baseMidi = 60;
      const midiNotes = chord.intervals.map(semitones => baseMidi + semitones);
      soundEngine.playChord(midiNotes, 'piano', 1.5);
    }
  };

  const selectedIdx = circleData.findIndex(c => c.key === selectedKey);
  const selectedInfo = circleData[selectedIdx >= 0 ? selectedIdx : 0];

  // Funções harmônicas baseadas no círculo
  // Subdominante IV = 1 passo anti-horário
  const ivIdx = (selectedIdx - 1 + 12) % 12;
  const ivKey = circleData[ivIdx].key;
  // Dominante V = 1 passo horário
  const vIdx = (selectedIdx + 1) % 12;
  const vKey = circleData[vIdx].key;

  // Toca um acorde específico
  const handlePlaySpecificChord = (chordStr: string) => {
    const parsed = parseChord(chordStr);
    if (parsed && parsed.midiNotes.length > 0) {
      soundEngine.playChord(parsed.midiNotes, 'piano', 1.5);
    }
  };

  // Toca progressão I - IV - V - I
  const handlePlayCadence = async () => {
    if (isPlayingCadence) return;
    await soundEngine.ensureAudioReady();
    setIsPlayingCadence(true);

    const chords = [
      { key: selectedKey, label: 'I' },
      { key: ivKey, label: 'IV' },
      { key: vKey, label: 'V' },
      { key: selectedKey, label: 'I' },
    ];

    chords.forEach((item, idx) => {
      setTimeout(() => {
        setActiveCadenceIdx(idx);
        const parsed = parseChord(item.key);
        if (parsed) {
          soundEngine.playChord(parsed.midiNotes, 'piano', 1.2);
        }
        if (idx === chords.length - 1) {
          setTimeout(() => {
            setIsPlayingCadence(false);
            setActiveCadenceIdx(null);
          }, 1100);
        }
      }, idx * 700);
    });
  };

  // Chords data for the 4 primary harmonic functions
  const tonicChord = parseChord(selectedKey);
  const subdomChord = parseChord(ivKey);
  const domChord = parseChord(vKey);
  const relChord = parseChord(selectedInfo.minor);

  // Dimensões do SVG do Círculo
  const size = 380;
  const center = size / 2;
  const outerRadius = 142;
  const innerRadius = 90;

  return (
    <div className={`w-full glass-card rounded-3xl p-5 sm:p-7 border border-white/10 space-y-6 bg-[#0a0c20]/80 backdrop-blur-xl shadow-2xl ${className}`}>
      {/* ── 1. CABEÇALHO DO CÍRCULO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <h3 className="text-lg sm:text-xl font-black font-display text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>Círculo das Quintas Interativo</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Harmonia &amp; Cadências
            </span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            A bússola tonal: relações de quinta justa, campo harmônico maior e acordes relativos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 sm:px-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
            Tonalidade: <strong className="text-white">{selectedKey} Maior</strong>
          </div>
        </div>
      </div>

      {/* ── 2. GRID 2 COLUNAS EQUILIBRADO: CÍRCULO À ESQUERDA + CARDS À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Lado Esquerdo (6 Colunas): Círculo Interativo Ampliado com Glow + Ações Rápidas de Áudio */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible select-none">
              {/* Definições de Glow / Filtros SVG */}
              <defs>
                <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-sky" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Círculo de Fundo e Trilhas Concêntricas */}
              <circle cx={center} cy={center} r={outerRadius + 20} fill="#0b0a1d" stroke="#252445" strokeWidth={2} />
              <circle cx={center} cy={center} r={outerRadius - 22} fill="#100f26" stroke="#1d1c38" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={center} cy={center} r={innerRadius - 16} fill="#070714" stroke="#252445" strokeWidth={1.5} />

              {/* As 12 Fatias e Tons do Círculo */}
              {circleData.map((item, idx) => {
                // 12 posições angulares (0 = 12h = -90 graus)
                const angleDeg = (idx * 30) - 90;
                const angleRad = (angleDeg * Math.PI) / 180;

                const xOuter = center + outerRadius * Math.cos(angleRad);
                const yOuter = center + outerRadius * Math.sin(angleRad);

                const xInner = center + innerRadius * Math.cos(angleRad);
                const yInner = center + innerRadius * Math.sin(angleRad);

                const isTonic = item.key === selectedKey;
                const isSubdom = item.key === ivKey;
                const isDom = item.key === vKey;

                let textColor = '#cbd5e1';
                let ringColor = 'transparent';
                let circleFill = '#1c1b36';
                let strokeColor = '#363459';
                let filterId = '';

                if (isTonic) {
                  textColor = '#ffffff';
                  ringColor = '#f43f5e';
                  circleFill = '#f43f5e';
                  strokeColor = '#fb7185';
                  filterId = 'url(#glow-rose)';
                } else if (isSubdom) {
                  textColor = '#38bdf8';
                  ringColor = '#0284c7';
                  circleFill = '#0284c7';
                  strokeColor = '#38bdf8';
                  filterId = 'url(#glow-sky)';
                } else if (isDom) {
                  textColor = '#fbbf24';
                  ringColor = '#d97706';
                  circleFill = '#d97706';
                  strokeColor = '#fbbf24';
                  filterId = 'url(#glow-amber)';
                }

                return (
                  <g
                    key={item.key}
                    onClick={() => handleKeyClick(item.key)}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                  >
                    {/* Anel Externo Neon para Tons em Destaque */}
                    {ringColor !== 'transparent' && (
                      <circle
                        cx={xOuter}
                        cy={yOuter}
                        r={21}
                        fill={ringColor}
                        opacity={0.35}
                        filter={filterId}
                        className="animate-pulse"
                      />
                    )}

                    {/* Botão Circular do Tom Maior */}
                    <circle
                      cx={xOuter}
                      cy={yOuter}
                      r={17}
                      fill={circleFill}
                      stroke={strokeColor}
                      strokeWidth={isTonic ? 2.5 : 1.5}
                      className="transition-all duration-200 group-hover:scale-115"
                    />

                    {/* Texto do Tom Maior (Anel Externo) */}
                    <text
                      x={xOuter}
                      y={yOuter + 4.5}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={12}
                      fontWeight="900"
                      fontFamily="Outfit, sans-serif"
                    >
                      {item.key}
                    </text>

                    {/* Nome da Relativa Menor (Anel Interno) */}
                    <circle
                      cx={xInner}
                      cy={yInner}
                      r={12}
                      fill={isTonic ? '#8b5cf6' : '#14132b'}
                      stroke={isTonic ? '#a78bfa' : '#29274c'}
                      strokeWidth={1}
                      className="transition-all duration-200 group-hover:scale-110"
                    />
                    <text
                      x={xInner}
                      y={yInner + 3}
                      textAnchor="middle"
                      fill={isTonic ? '#ffffff' : '#94a3b8'}
                      fontSize={8.5}
                      fontWeight={isTonic ? '900' : '600'}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {item.minor}
                    </text>
                  </g>
                );
              })}

              {/* Centro do Círculo com Botão de Reprodução da Tônica */}
              <g
                onClick={() => handlePlaySpecificChord(selectedKey)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
              >
                <title>Tocar acorde da tônica</title>
                <circle
                  cx={center}
                  cy={center}
                  r={38}
                  fill="#0d0c1c"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  className="transition-transform group-hover:scale-105"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={32}
                  fill="#f43f5e"
                  opacity={0.15}
                  className="group-hover:opacity-30 transition-opacity"
                />
                <text
                  x={center}
                  y={center - 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={16}
                  fontWeight="900"
                  fontFamily="Outfit"
                >
                  {selectedKey}
                </text>
                <text
                  x={center}
                  y={center + 12}
                  textAnchor="middle"
                  fill="#f43f5e"
                  fontSize={9}
                  fontWeight="800"
                  fontFamily="JetBrains Mono"
                >
                  TÔNICA (I)
                </text>
                <text
                  x={center}
                  y={center + 24}
                  textAnchor="middle"
                  fill="#fda4af"
                  fontSize={7.5}
                  fontWeight="bold"
                >
                  ▶ Tocar
                </text>
              </g>
            </svg>
          </div>

          {/* Botões Rápidos de Demonstração Sonora ao Centro */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
            <button
              onClick={() => handlePlaySpecificChord(selectedKey)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Tocar o acorde da tônica fundamental"
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Acorde {selectedKey}</span>
            </button>

            <button
              onClick={handlePlayCadence}
              disabled={isPlayingCadence}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border shadow-lg active:scale-95 ${
                isPlayingCadence
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-indigo-400 shadow-indigo-600/30 hover:brightness-110'
              }`}
              title="Tocar a progressão cadencial I - IV - V - I com encadeamento de acordes"
            >
              <Music className="w-3.5 h-3.5" />
              <span>{isPlayingCadence ? 'Tocando Cadência...' : 'Cadência I - IV - V - I'}</span>
            </button>
          </div>
        </div>

        {/* Lado Direito (6 Colunas): Cards Horizontais Modernos das Funções Harmônicas */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Funções Harmônicas do Tom ({selectedKey} Maior):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Tríades Fundamentais</span>
          </div>

          <div className="space-y-2.5">
            {/* Card 1: Grau I (Tônica) */}
            <div
              onClick={() => handleKeyClick(selectedKey)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none group relative ${
                activeCadenceIdx === 0 || activeCadenceIdx === 3
                  ? 'bg-rose-500/30 border-rose-400 ring-2 ring-rose-400/60 shadow-lg shadow-rose-500/25 scale-102'
                  : 'bg-rose-950/20 hover:bg-rose-950/35 border-rose-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-rose-300 font-bold px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/30">
                      Grau I • Tônica
                    </span>
                    <span className="text-[11px] text-slate-400">Repouso &amp; Fundação</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <span>{selectedKey} Maior</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySpecificChord(selectedKey);
                      }}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-300 transition-colors"
                      title="Ouvir acorde"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400">Centro do Círculo</span>
                  <div className="text-[11px] text-rose-300 font-mono font-bold mt-1">
                    Fórmula: 1 - 3M - 5J
                  </div>
                </div>
              </div>

              {/* Notas Componentes */}
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-400 font-mono">Notas:</span>
                {tonicChord?.notes.map((n, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-200 font-mono text-[11px] font-bold"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: Grau IV (Subdominante) */}
            <div
              onClick={() => handleKeyClick(ivKey)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none group relative ${
                activeCadenceIdx === 1
                  ? 'bg-sky-500/30 border-sky-400 ring-2 ring-sky-400/60 shadow-lg shadow-sky-500/25 scale-102'
                  : 'bg-sky-950/20 hover:bg-sky-950/35 border-sky-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-sky-300 font-bold px-1.5 py-0.2 rounded bg-sky-500/20 border border-sky-500/30">
                      Grau IV • Subdominante
                    </span>
                    <span className="text-[11px] text-slate-400">Afastamento &amp; Movimento</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <span>{ivKey} Maior</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySpecificChord(ivKey);
                      }}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-300 transition-colors"
                      title="Ouvir acorde"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400">1 anti-horário (-1 quinta)</span>
                  <div className="text-[11px] text-sky-300 font-mono font-bold mt-1">
                    Fórmula: 1 - 3M - 5J
                  </div>
                </div>
              </div>

              {/* Notas Componentes */}
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-400 font-mono">Notas:</span>
                {subdomChord?.notes.map((n, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-200 font-mono text-[11px] font-bold"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 3: Grau V (Dominante) */}
            <div
              onClick={() => handleKeyClick(vKey)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none group relative ${
                activeCadenceIdx === 2
                  ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/25 scale-102'
                  : 'bg-amber-950/20 hover:bg-amber-950/35 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-amber-300 font-bold px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30">
                      Grau V • Dominante
                    </span>
                    <span className="text-[11px] text-slate-400">Tensão Máxima &amp; Resolução</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <span>{vKey} Maior</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySpecificChord(vKey);
                      }}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors"
                      title="Ouvir acorde"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400">1 horário (+1 quinta)</span>
                  <div className="text-[11px] text-amber-300 font-mono font-bold mt-1">
                    Fórmula: 1 - 3M - 5J
                  </div>
                </div>
              </div>

              {/* Notas Componentes */}
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-400 font-mono">Notas:</span>
                {domChord?.notes.map((n, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-200 font-mono text-[11px] font-bold"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 4: Grau vi (Relativa Menor) */}
            <div
              onClick={() => handleKeyClick(selectedKey)}
              className="p-3.5 rounded-2xl bg-purple-950/20 hover:bg-purple-950/35 border border-purple-500/30 transition-all cursor-pointer select-none group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-purple-300 font-bold px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-500/30">
                      Grau vi • Relativa Menor
                    </span>
                    <span className="text-[11px] text-slate-400">Suavidade &amp; Melancolia</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <span>{selectedInfo.minor}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySpecificChord(selectedInfo.minor);
                      }}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors"
                      title="Ouvir acorde"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400">Anel Interno</span>
                  <div className="text-[11px] text-purple-300 font-mono font-bold mt-1">
                    Fórmula: 1 - 3m - 5J
                  </div>
                </div>
              </div>

              {/* Notas Componentes */}
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-400 font-mono">Notas:</span>
                {relChord?.notes.map((n, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-200 font-mono text-[11px] font-bold"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

