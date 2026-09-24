import React, { useState } from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import { PianoWaterfallCanvas } from './PianoWaterfallCanvas';
import type { TrailColorTheme } from './PianoWaterfallCanvas';
import { ChevronLeft, ChevronRight, Layers, Sparkles, Flame } from 'lucide-react';

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
  showWaterfall?: boolean;
  activeExternalNotes?: number[];
}

export const PianoKeyboard: React.FC<Props> = ({
  startOctave: initialStartOctave = 2,
  octaveCount: initialOctaveCount = 3,
  highlightedKeys = [],
  onKeyPlay,
  allowOctaveControls = true,
  showWaterfall = true,
  activeExternalNotes = [],
}) => {
  const [startOctave, setStartOctave] = useState<number>(initialStartOctave);
  const [octaveCount, setOctaveCount] = useState<number>(initialOctaveCount);
  const [isWaterfallActive, setIsWaterfallActive] = useState<boolean>(showWaterfall);
  const [trailTheme, setTrailTheme] = useState<TrailColorTheme>('coral');
  const [trailSpeed, setTrailSpeed] = useState<number>(180);
  const [activePressedKeys, setActivePressedKeys] = useState<number[]>([]);

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

  const handleKeyDown = (midi: number) => {
    setActivePressedKeys(prev => (prev.includes(midi) ? prev : [...prev, midi]));
    soundEngine.playPianoNote(midi);
    if (onKeyPlay) onKeyPlay(midi);
  };

  const handleKeyUp = (midi: number) => {
    // Pequeno delay de 180ms para que toques rápidos criem um rastro nítido no canvas
    window.setTimeout(() => {
      setActivePressedKeys(prev => prev.filter(m => m !== midi));
    }, 180);
  };

  const combinedActiveNotes = Array.from(new Set([...activePressedKeys, ...(activeExternalNotes || [])]));

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
      {/* Barra de Controle de Oitavas & Rastro Synthesia */}
      {allowOctaveControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
          {/* Seletor de Quantidade de Oitavas Visíveis */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Oitavas:</span>
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

          {/* Botão de Toggle do Rastro Synthesia (Waterfall) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWaterfallActive(!isWaterfallActive)}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isWaterfallActive
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isWaterfallActive ? 'fill-current animate-pulse' : ''}`} />
              <span>{isWaterfallActive ? 'Rastro Synthesia: LIGADO' : 'Ativar Rastro Synthesia'}</span>
            </button>

            {/* Tema de Cores e Velocidade do Rastro */}
            {isWaterfallActive && (
              <div className="flex items-center gap-1.5">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-[9px] font-bold">
                  <button
                    onClick={() => setTrailTheme('coral')}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      trailTheme === 'coral' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Estilo Milo Andreo / Synthesia Original"
                  >
                    Coral
                  </button>
                  <button
                    onClick={() => setTrailTheme('cyan')}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      trailTheme === 'cyan' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ciano
                  </button>
                  <button
                    onClick={() => setTrailTheme('harmonic')}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      trailTheme === 'harmonic' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Cores por Graus Harmônicos"
                  >
                    Graus
                  </button>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-[9px] font-bold">
                  {[120, 180, 240].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setTrailSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                        trailSpeed === spd ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title={`Velocidade ${spd} px/s`}
                    >
                      {spd === 120 ? '1x' : spd === 180 ? '1.5x' : '2x'}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

      {/* Contêiner Unificado do Rastro Synthesia + Teclado SVG com scroll horizontal fluido */}
      <div className="w-full overflow-x-auto pb-4 no-scrollbar flex justify-center">
        <div className="p-3 rounded-3xl glass-panel border border-white/10 shadow-2xl bg-[#090814]/90 inline-block space-y-2">
          {/* 1. Rastro Synthesia / Waterfall Canvas alinhado aos pixels das teclas */}
          {isWaterfallActive && (
            <PianoWaterfallCanvas
              startOctave={startOctave}
              octaveCount={octaveCount}
              whiteKeyWidth={whiteKeyWidth}
              blackKeyWidth={blackKeyWidth}
              activeMidiNotes={combinedActiveNotes}
              height={230}
              theme={trailTheme}
              speed={trailSpeed}
              onKeyClick={handleKeyDown}
            />
          )}

          {/* 2. Teclado Virtual SVG */}
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
                const isPressed = combinedActiveNotes.includes(midi);

                let keyFill = 'url(#whiteKeyGrad)';
                if (isPressed) {
                  keyFill = '#ffe4e6'; // Destaque aceso quando pressionada
                } else if (highlight) {
                  keyFill = getDegreeColor(highlight.degreeName);
                }

                return (
                  <g
                    key={`white-${midi}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleKeyDown(midi);
                    }}
                    onPointerUp={() => handleKeyUp(midi)}
                    onPointerLeave={() => handleKeyUp(midi)}
                    className="cursor-pointer group"
                  >
                    {/* Tecla Branca Retangular */}
                    <rect
                      x={x + 1}
                      y={0}
                      width={whiteKeyWidth - 2}
                      height={whiteKeyHeight}
                      rx={6}
                      fill={keyFill}
                      stroke={isPressed ? '#f43f5e' : isMiddleC ? '#06b6d4' : '#8e94a0'}
                      strokeWidth={isPressed ? 2.5 : isMiddleC ? 2 : 1}
                      className="transition-all duration-100"
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
                      fill={isPressed ? '#e11d48' : highlight ? '#ffffff' : isMiddleC ? '#0284c7' : '#334155'}
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
                const x = (whiteIndex + 1) * whiteKeyWidth - (blackKeyWidth / 2);
                const noteInfo = getNoteInfo(midi);
                const highlight = getHighlight(midi);
                const isPressed = combinedActiveNotes.includes(midi);

                let keyFill = 'url(#blackKeyGrad)';
                if (isPressed) {
                  keyFill = '#f43f5e'; // Tecla preta brilha em coral neon quando tocada
                } else if (highlight) {
                  keyFill = getDegreeColor(highlight.degreeName);
                }

                return (
                  <g
                    key={`black-${midi}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleKeyDown(midi);
                    }}
                    onPointerUp={() => handleKeyUp(midi)}
                    onPointerLeave={() => handleKeyUp(midi)}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={x}
                      y={0}
                      width={blackKeyWidth}
                      height={blackKeyHeight}
                      rx={5}
                      fill={keyFill}
                      stroke={isPressed ? '#fda4af' : '#0f172a'}
                      strokeWidth={isPressed ? 2 : 1.5}
                      className="transition-all duration-100"
                    />

                    {/* Nome do sustenido/bemol na ponta */}
                    <text
                      x={x + blackKeyWidth / 2}
                      y={blackKeyHeight - 12}
                      textAnchor="middle"
                      fill={isPressed ? '#ffffff' : highlight ? '#ffffff' : '#94a3b8'}
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
