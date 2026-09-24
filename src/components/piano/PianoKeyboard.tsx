import React from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';

interface HighlightedKey {
  midi: number;
  degreeName?: string;       // '1', '3', '5', '7M', etc.
  finger?: number;           // 1 = polegar, 5 = mínimo
  color?: string;            // hex ou classe
}

interface Props {
  startOctave?: number;      // Padrão: 3 (C3 a B4 = 2 oitavas = 24 teclas)
  octaveCount?: number;      // Padrão: 2
  highlightedKeys?: HighlightedKey[];
  onKeyPlay?: (midi: number) => void;
}

export const PianoKeyboard: React.FC<Props> = ({
  startOctave = 3,
  octaveCount = 2,
  highlightedKeys = [],
  onKeyPlay,
}) => {
  const whiteKeyWidth = 44;
  const whiteKeyHeight = 170;
  const blackKeyWidth = 26;
  const blackKeyHeight = 108;

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

  return (
    <div className="w-full flex flex-col items-center select-none no-select">
      {/* Legenda de Cores de Graus Harmônicos */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
          <span className="text-slate-300">Tônica / 1º</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm" />
          <span className="text-slate-300">3ª (Maior/Menor)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-300">5ª Justa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
          <span className="text-slate-300">7ª (Maior/Menor)</span>
        </div>
      </div>

      {/* Contêiner de Teclado SVG com scroll horizontal no celular */}
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
                      stroke="#8e94a0"
                      strokeWidth={1}
                      className="transition-all duration-150 group-active:brightness-90"
                    />

                    {/* Rótulo da Nota no rodapé da tecla */}
                    <text
                      x={x + whiteKeyWidth / 2}
                      y={whiteKeyHeight - 12}
                      textAnchor="middle"
                      fill={highlight ? '#ffffff' : '#334155'}
                      fontSize={11}
                      fontWeight="bold"
                      fontFamily="Outfit, sans-serif"
                    >
                      {noteInfo.name}
                      <tspan fontSize={9} opacity={0.7}>
                        {noteInfo.octave}
                      </tspan>
                    </text>

                    {/* Dedo sugerido (1 a 5) se destacado */}
                    {highlight && highlight.finger && (
                      <circle
                        cx={x + whiteKeyWidth / 2}
                        cy={whiteKeyHeight - 34}
                        r={11}
                        fill="#0f172a"
                      />
                    )}
                    {highlight && highlight.finger && (
                      <text
                        x={x + whiteKeyWidth / 2}
                        y={whiteKeyHeight - 30}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={11}
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
                      fontSize={9}
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
                        r={9}
                        fill="#0f172a"
                      />
                    )}
                    {highlight && highlight.finger && (
                      <text
                        x={x + blackKeyWidth / 2}
                        y={blackKeyHeight - 25}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={9}
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
