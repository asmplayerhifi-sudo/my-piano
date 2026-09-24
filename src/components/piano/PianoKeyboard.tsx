import React, { useState } from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import { ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface HighlightedKey {
  midi: number;
  degreeName?: string;       // '1', '3', '5', '7M', etc.
  finger?: number;           // 1 = polegar, 5 = mínimo
  color?: string;            // hex ou classe
}

interface Props {
  startOctave?: number;      // Padrão inicial: 2 ou 3
  octaveCount?: number;      // Padrão inicial: 3 ou 4
  highlightedKeys?: HighlightedKey[];
  onKeyPlay?: (midi: number) => void;
  allowOctaveControls?: boolean;
}

export const PianoKeyboard: React.FC<Props> = ({
  startOctave: initialStartOctave = 2,
  octaveCount: initialOctaveCount = 3,
  highlightedKeys = [],
  onKeyPlay,
  allowOctaveControls = true,
}) => {
  const [startOctave, setStartOctave] = useState<number>(initialStartOctave);
  const [octaveCount, setOctaveCount] = useState<number>(initialOctaveCount);

  // Ajusta largura da tecla de acordo com a quantidade de oitavas para caber bem
  const isCompact = octaveCount >= 4;
  const whiteKeyWidth = isCompact ? 36 : 42;
  const whiteKeyHeight = isCompact ? 160 : 170;
  const blackKeyWidth = isCompact ? 22 : 26;
  const blackKeyHeight = isCompact ? 100 : 108;

  // Notas naturais por oitava (C, D, E, F, G, A, B)
  const naturalOffsets = [0, 2, 4, 5, 7, 9, 11];
  // Teclas pretas (C#, D#, F#, G#, A#) e suas posições relativas às brancas
  const accidentalOffsets = [
    { semitones: 1, posAfterWhite: 0 }, // C#
    { semitones: 3, posAfterWhite: 1 }, // D#
    { semitones: 6, posAfterWhite: 3 }, // F#
    { semitones: 8, posAfterWhite: 4 }, // G#
    { semitones: 10, posAfterWhite: 5 }, // A#
  ];

  const totalWhiteKeys = octaveCount * 7;
  const svgWidth = totalWhiteKeys * whiteKeyWidth;

  const handleKeyPress = (midi: number) => {
    soundEngine.playPianoNote(midi);
    if (onKeyPlay) onKeyPlay(midi);
  };

  const getHighlight = (midi: number) => {
    return highlightedKeys.find(k => k.midi === midi);
  };

  // Cores contextuais padrão para graus harmônicos
  const getDegreeColor = (degree?: string) => {
    if (!degree) return '#6366f1';
    if (degree === '1') return '#f43f5e';       // Fundamental: Vermelho/Rosa
    if (degree.includes('3')) return '#06b6d4'; // Terça: Ciano/Azul
    if (degree.includes('5')) return '#10b981'; // Quinta: Verde Esmeralda
    if (degree.includes('7')) return '#a855f7'; // Sétima: Roxo
    return '#f59e0b';
  };

  const handleShiftOctave = (delta: number) => {
    setStartOctave(prev => Math.max(1, Math.min(5, prev + delta)));
  };

  const endOctave = startOctave + octaveCount - 1;

  return (
    <div className="w-full flex flex-col items-center select-none no-select space-y-3">
      {/* Barra de Controle de Oitavas Interativa */}
      {allowOctaveControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
          {/* Seletor de Quantidade de Oitavas Visíveis */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Oitavas Visíveis:</span>
            </span>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 font-bold text-[10px]">
              {[2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => setOctaveCount(count)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    octaveCount === count
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {count} Oitavas
                </button>
              ))}
            </div>
          </div>

          {/* Deslocamento de Oitava (Transpose / Shift) */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Faixa: <strong className="text-white">C{startOctave} a B{endOctave}</strong> ({octaveCount * 12} Teclas)
            </span>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => handleShiftOctave(-1)}
                disabled={startOctave <= 1}
                className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Descer uma oitava mais grave"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-[10px] font-mono font-bold text-indigo-300">
                Oitava {startOctave}
              </span>
              <button
                onClick={() => handleShiftOctave(1)}
                disabled={startOctave >= 5}
                className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Subir uma oitava mais aguda"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legenda de Cores de Graus Harmônicos & Dó Central */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 bg-cyan-950/40 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-200 font-bold text-[10px]">C4 = Dó Central (Marcador Ciano)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          <span className="text-slate-300 text-[11px]">Tônica</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
          <span className="text-slate-300 text-[11px]">3ª</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-300 text-[11px]">5ª Justa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
          <span className="text-slate-300 text-[11px]">7ª</span>
        </div>
      </div>

      {/* Contêiner de Teclado SVG com scroll horizontal fluido */}
      <div className="w-full overflow-x-auto pb-4 no-scrollbar flex justify-center">
        <div className="p-3 rounded-3xl glass-panel border border-white/10 shadow-2xl bg-[#090814]/90 inline-block">
          <svg
            width={svgWidth}
            height={whiteKeyHeight}
            className="block overflow-visible"
            viewBox={`0 0 ${svgWidth} ${whiteKeyHeight}`}
          >
            <defs>
              <linearGradient id="whiteKeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fdfdfd" />
                <stop offset="90%" stopColor="#eceef2" />
                <stop offset="100%" stopColor="#d5d8de" />
              </linearGradient>
              <linearGradient id="blackKeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2e2d3b" />
                <stop offset="85%" stopColor="#15141f" />
                <stop offset="100%" stopColor="#08070d" />
              </linearGradient>
            </defs>

            {/* 1. Camada de Teclas Brancas */}
            {Array.from({ length: octaveCount }).map((_, octIdx) => {
              const currentOctave = startOctave + octIdx;
              const baseMidi = (currentOctave + 1) * 12;

              return naturalOffsets.map((offset, noteIdx) => {
                const midi = baseMidi + offset;
                const whiteIndex = octIdx * 7 + noteIdx;
                const x = whiteIndex * whiteKeyWidth;
                const noteInfo = getNoteInfo(midi);
                const highlight = getHighlight(midi);
                const isMiddleC = (midi === 60);

                return (
                  <g
                    key={`white-${midi}`}
                    onClick={() => handleKeyPress(midi)}
                    className="cursor-pointer group"
                  >
                    {/* Tecla Branca Retangular */}
                    <rect
                      x={x + 1}
                      y={0}
                      width={whiteKeyWidth - 2}
                      height={whiteKeyHeight}
                      rx={6}
                      fill={highlight ? getDegreeColor(highlight.degreeName) : 'url(#whiteKeyGrad)'}
                      stroke={isMiddleC ? '#06b6d4' : '#8e94a0'}
                      strokeWidth={isMiddleC ? 2 : 1}
                      className="transition-all duration-150 group-active:brightness-90"
                    />

                    {/* Destaque visual no topo para o Dó Central (C4) */}
                    {isMiddleC && (
                      <circle
                        cx={x + whiteKeyWidth / 2}
                        cy={16}
                        r={4}
                        fill="#06b6d4"
                      />
                    )}

                    {/* Rótulo da Nota no rodapé da tecla */}
                    <text
                      x={x + whiteKeyWidth / 2}
                      y={whiteKeyHeight - 12}
                      textAnchor="middle"
                      fill={highlight ? '#ffffff' : isMiddleC ? '#0284c7' : '#334155'}
                      fontSize={isCompact ? 9 : 11}
                      fontWeight="bold"
                      fontFamily="Outfit, sans-serif"
                    >
                      {noteInfo.name}
                      <tspan fontSize={isCompact ? 8 : 9} opacity={0.7}>
                        {noteInfo.octave}
                      </tspan>
                    </text>

                    {/* Dedo sugerido (1 a 5) se destacado */}
                    {highlight && highlight.finger && (
                      <circle
                        cx={x + whiteKeyWidth / 2}
                        cy={whiteKeyHeight - 34}
                        r={isCompact ? 9 : 11}
                        fill="#0f172a"
                      />
                    )}
                    {highlight && highlight.finger && (
                      <text
                        x={x + whiteKeyWidth / 2}
                        y={whiteKeyHeight - 30}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isCompact ? 9 : 11}
                        fontWeight="black"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {highlight.finger}
                      </text>
                    )}
                  </g>
                );
              });
            })}

            {/* 2. Camada de Teclas Pretas (Acima das brancas) */}
            {Array.from({ length: octaveCount }).map((_, octIdx) => {
              const currentOctave = startOctave + octIdx;
              const baseMidi = (currentOctave + 1) * 12;

              return accidentalOffsets.map((acc) => {
                const midi = baseMidi + acc.semitones;
                const whiteIndex = octIdx * 7 + acc.posAfterWhite;
                // Centralizado na divisão entre duas teclas brancas
                const x = (whiteIndex + 1) * whiteKeyWidth - (blackKeyWidth / 2);
                const noteInfo = getNoteInfo(midi);
                const highlight = getHighlight(midi);

                return (
                  <g
                    key={`black-${midi}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKeyPress(midi);
                    }}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={x}
                      y={0}
                      width={blackKeyWidth}
                      height={blackKeyHeight}
                      rx={5}
                      fill={highlight ? getDegreeColor(highlight.degreeName) : 'url(#blackKeyGrad)'}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                      className="transition-all duration-150 group-active:brightness-125"
                    />

                    {/* Nome do sustenido/bemol na ponta */}
                    <text
                      x={x + blackKeyWidth / 2}
                      y={blackKeyHeight - 12}
                      textAnchor="middle"
                      fill={highlight ? '#ffffff' : '#94a3b8'}
                      fontSize={isCompact ? 7.5 : 9}
                      fontWeight="bold"
                      fontFamily="Outfit, sans-serif"
                    >
                      {noteInfo.name}
                    </text>

                    {/* Dedo sugerido */}
                    {highlight && highlight.finger && (
                      <circle
                        cx={x + blackKeyWidth / 2}
                        cy={blackKeyHeight - 28}
                        r={isCompact ? 7.5 : 9}
                        fill="#0f172a"
                      />
                    )}
                    {highlight && highlight.finger && (
                      <text
                        x={x + blackKeyWidth / 2}
                        y={blackKeyHeight - 25}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isCompact ? 8 : 10}
                        fontWeight="black"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {highlight.finger}
                      </text>
                    )}
                  </g>
                );
              });
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
