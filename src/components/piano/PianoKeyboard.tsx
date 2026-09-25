import React, { useState, useRef, useEffect, useId } from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import { useOctaveStandard } from '../../core/octaveConfigStore';
import { PianoWaterfallCanvas } from './PianoWaterfallCanvas';
import type { TrailColorTheme } from './PianoWaterfallCanvas';
import { ChevronLeft, ChevronRight, Layers, Sparkles, Flame } from 'lucide-react';

export interface ActiveFingerPrompt {
  finger: number;
  label?: string; // 'MD 1', 'D1', etc.
  hand?: 'MD' | 'ME';
  fingerName?: string;
  noteName?: string;
  color?: string;
}

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
  onKeyRelease?: (midi: number) => void;
  allowOctaveControls?: boolean;
  showWaterfall?: boolean;
  activeExternalNotes?: number[];
  errorNotes?: number[];     // Teclas marcadas em vermelho (tocadas incorretamente)
  correctNotes?: number[];   // Teclas marcadas em verde (tocadas corretamente)
  showFingerPointer?: boolean;
  activeFingerPrompt?: ActiveFingerPrompt | null;
}

export const FINGER_INFO: Record<number, { name: string; short: string; color: string; bg: string }> = {
  1: { name: 'Polegar', short: 'D1', color: '#f59e0b', bg: '#78350f' },
  2: { name: 'Indicador', short: 'D2', color: '#06b6d4', bg: '#164e63' },
  3: { name: 'Médio', short: 'D3', color: '#10b981', bg: '#064e3b' },
  4: { name: 'Anelar', short: 'D4', color: '#c084fc', bg: '#581c87' },
  5: { name: 'Mínimo', short: 'D5', color: '#f43f5e', bg: '#881337' },
};

export const PianoKeyboard: React.FC<Props> = ({
  startOctave: initialStartOctave = 2,
  octaveCount: initialOctaveCount = 3,
  highlightedKeys = [],
  onKeyPlay,
  onKeyRelease,
  allowOctaveControls = true,
  showWaterfall = true,
  activeExternalNotes = [],
  errorNotes = [],
  correctNotes = [],
  showFingerPointer = true,
  activeFingerPrompt = null,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);

  const keyboardId = useId().replace(/:/g, '');
  const whiteKeyGradId = `whiteKeyGrad_${keyboardId}`;
  const blackKeyGradId = `blackKeyGrad_${keyboardId}`;

  // Callbacks mantidos em refs estáveis para evitar desmonte de listeners ou liberação indevida ao re-renderizar componentes pais
  const onKeyPlayRef = useRef(onKeyPlay);
  onKeyPlayRef.current = onKeyPlay;

  const onKeyReleaseRef = useRef(onKeyRelease);
  onKeyReleaseRef.current = onKeyRelease;

  const [startOctave, setStartOctave] = useState<number>(initialStartOctave);
  const [octaveCount, setOctaveCount] = useState<number>(initialOctaveCount);
  const userSelectedOctaveCountRef = useRef<boolean>(false);
  const [isWaterfallActive, setIsWaterfallActive] = useState<boolean>(showWaterfall);
  const [showFingerGuide, setShowFingerGuide] = useState<boolean>(showFingerPointer);
  const [trailTheme, setTrailTheme] = useState<TrailColorTheme>('coral');
  const [trailSpeed, setTrailSpeed] = useState<number>(180);
  const [activePressedKeys, setActivePressedKeys] = useState<number[]>([]);

  const octaveStandard = useOctaveStandard();
  const centralNoteName = octaveStandard === 'C4' ? 'C4' : 'C3';
  const displayOctaveOffset = octaveStandard === 'C4' ? 1 : 0;

  // Monitora a largura real disponível para preencher 100% da tela sem scrollbar
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 150) {
          setContainerWidth(measured);
          // Em celulares compactos (< 520px), adapta para 2 oitavas para teclas largas e fáceis de tocar por toque
          if (measured < 520 && !userSelectedOctaveCountRef.current && initialOctaveCount > 2) {
            setOctaveCount(2);
          }
        }
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [initialOctaveCount]);

  // Número total de teclas brancas para a quantidade de oitavas selecionada
  const totalWhiteKeys = octaveCount * 7;

  // Largura calculada dinamicamente: ocupa exatamente 100% do container com margem interna de 6px
  const availableWidth = Math.max(300, containerWidth - 16);
  const whiteKeyWidth = availableWidth / totalWhiteKeys;
  const isUltraCompact = whiteKeyWidth < 25;

  // Altura proporcional para manter proporções de piano de cauda
  const whiteKeyHeight = Math.max(125, Math.min(185, whiteKeyWidth * 4.6));
  const blackKeyWidth = Math.max(10, whiteKeyWidth * 0.62);
  const blackKeyHeight = whiteKeyHeight * 0.64;
  const svgWidth = availableWidth;
  const fingerLaneHeight = showFingerGuide ? 30 : 0;
  const totalSvgHeight = whiteKeyHeight + fingerLaneHeight;

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

  // Rastreamento das teclas ativas seguradas pelo clique ou toque
  const pressedKeysSetRef = useRef<Set<number>>(new Set());
  const activePointersRef = useRef<Map<number, number>>(new Map()); // pointerId -> midi

  const handleKeyDown = (midi: number, pointerId?: number) => {
    if (pointerId !== undefined) {
      activePointersRef.current.set(pointerId, midi);
    }
    if (!pressedKeysSetRef.current.has(midi)) {
      pressedKeysSetRef.current.add(midi);
      setActivePressedKeys(Array.from(pressedKeysSetRef.current));
      soundEngine.startPianoNote(midi);
      if (onKeyPlayRef.current) onKeyPlayRef.current(midi);
    }
  };

  const handleKeyUp = (midi: number, pointerId?: number) => {
    if (pointerId !== undefined) {
      activePointersRef.current.delete(pointerId);
    }
    if (pressedKeysSetRef.current.has(midi)) {
      soundEngine.stopPianoNote(midi);
      pressedKeysSetRef.current.delete(midi);
      setActivePressedKeys(Array.from(pressedKeysSetRef.current));
      if (onKeyReleaseRef.current) onKeyReleaseRef.current(midi);
    }
  };

  const releaseAllKeys = () => {
    if (pressedKeysSetRef.current.size > 0) {
      pressedKeysSetRef.current.forEach((m) => {
        soundEngine.stopPianoNote(m);
        if (onKeyReleaseRef.current) onKeyReleaseRef.current(m);
      });
      pressedKeysSetRef.current.clear();
      activePointersRef.current.clear();
      setActivePressedKeys([]);
    }
  };

  // Garante liberação absoluta de todas as teclas se o cursor for solto dentro ou fora da tecla/janela
  useEffect(() => {
    const handleGlobalPointerUp = (e: PointerEvent) => {
      const midi = activePointersRef.current.get(e.pointerId);
      if (midi !== undefined) {
        handleKeyUp(midi, e.pointerId);
      }
      if (e.pointerType === 'mouse' && e.buttons === 0) {
        releaseAllKeys();
      } else if (activePointersRef.current.size === 0) {
        releaseAllKeys();
      }
    };

    const handleGlobalPointerCancel = (e: PointerEvent) => {
      const midi = activePointersRef.current.get(e.pointerId);
      if (midi !== undefined) {
        handleKeyUp(midi, e.pointerId);
      }
      releaseAllKeys();
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.buttons === 0) {
        releaseAllKeys();
      }
    };

    const handleGlobalBlur = () => {
      releaseAllKeys();
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerCancel);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalPointerUp as any);
    window.addEventListener('touchcancel', handleGlobalPointerCancel as any);
    window.addEventListener('blur', handleGlobalBlur);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerCancel);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalPointerUp as any);
      window.removeEventListener('touchcancel', handleGlobalPointerCancel as any);
      window.removeEventListener('blur', handleGlobalBlur);
      releaseAllKeys();
    };
  }, []); // Monta uma única vez: não destrói o estado das teclas por re-render do pai

  const combinedActiveNotes = Array.from(new Set([...activePressedKeys, ...(activeExternalNotes || [])]));

  const getHighlight = (midi: number) => {
    return highlightedKeys.find(k => k.midi === midi);
  };

  // Cores contextuais para graus harmônicos de acordes e customColor
  const getDegreeColor = (degree?: string, customColor?: string) => {
    if (customColor) return customColor;
    if (!degree) return '#6366f1';
    if (degree === '1' || degree === 'T') return '#f43f5e';           // Tônica: Vermelho/Rosa
    if (/^(3|3M|3m|b3|♭3)$/.test(degree)) return '#06b6d4';         // Terça: Ciano
    if (/^(5|5J|5dim|#5|♯5|b5|♭5)$/.test(degree)) return '#10b981'; // Quinta: Verde
    if (/^(7|7M|7m|b7|♭7|dim7|𝄫7|bb7)$/.test(degree)) return '#a855f7';     // Sétima: Roxo
    return '#6366f1';
  };

  // Identificador do dedo correspondente à tecla (Apontamento de Dedo dinâmico)
  const getKeyFinger = (_midi: number, highlight?: HighlightedKey): number | null => {
    if (highlight && highlight.finger) return highlight.finger;
    if (!showFingerGuide) return null;

    // Se a tecla é uma nota destacada sem dedo explícito, mapeia pelos graus harmônicos
    if (highlight) {
      if (highlight.degreeName === '1' || highlight.degreeName === 'T') return 1;
      if (highlight.degreeName && /^(3|3M|3m|b3|♭3)/.test(highlight.degreeName)) return 3;
      if (highlight.degreeName && /^(5|5J|#5|♯5|b5|♭5)/.test(highlight.degreeName)) return 5;
      if (highlight.degreeName && /^(7|7M|7m|b7|♭7|dim7|𝄫7|bb7)/.test(highlight.degreeName)) return 5;
    }
    return null;
  };

  // Resolvedor inteligente do Dedo a Ser Utilizado exibido na tag abaixo do teclado
  const activeFingerDisplay = activeFingerPrompt ?? (() => {
    // 1. Nota ativa atualmente (reprodução sonora ou toque)
    const currentMidi = combinedActiveNotes[0];
    if (currentMidi) {
      const highlight = getHighlight(currentMidi);
      const finger = getKeyFinger(currentMidi, highlight);
      if (finger && FINGER_INFO[finger]) {
        const info = FINGER_INFO[finger];
        const noteInfo = getNoteInfo(currentMidi);
        const hand = currentMidi < 60 ? 'ME' : 'MD';
        return {
          finger,
          label: `${hand} ${finger}`,
          fingerName: info.name,
          noteName: `${noteInfo.name}${noteInfo.octave}`,
          color: info.color,
        };
      }
    }
    // 2. Se nenhuma tecla está pressionada agora, verifica se há tecla com dedo indicado
    if (highlightedKeys.length > 0) {
      const firstWithFinger = highlightedKeys.find(k => k.finger);
      if (firstWithFinger && firstWithFinger.finger && FINGER_INFO[firstWithFinger.finger]) {
        const info = FINGER_INFO[firstWithFinger.finger];
        const noteInfo = getNoteInfo(firstWithFinger.midi);
        const hand = firstWithFinger.midi < 60 ? 'ME' : 'MD';
        return {
          finger: firstWithFinger.finger,
          label: `${hand} ${firstWithFinger.finger}`,
          fingerName: info.name,
          noteName: `${noteInfo.name}${noteInfo.octave}`,
          color: info.color,
        };
      }
    }
    return null;
  })();

  const handleShiftOctave = (delta: number) => {
    setStartOctave(prev => Math.max(1, Math.min(5, prev + delta)));
  };

  const endOctave = startOctave + octaveCount - 1;
  const labelFontSize = Math.max(7.5, Math.min(11, whiteKeyWidth * 0.28));
  const blackLabelFontSize = Math.max(6.5, Math.min(9.5, blackKeyWidth * 0.38));

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center select-none no-select space-y-2.5">
      {/* Contêiner Unificado do Rastro Synthesia + Teclado SVG — Posicionado no Topo para Máxima Proximidade com a Partitura */}
      <div className="w-full overflow-hidden flex justify-center">
        <div className="w-full p-2 sm:p-3 rounded-2xl glass-panel border border-white/5 shadow-2xl bg-[#090814]/95 space-y-2">
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
              onKeyPointerDown={(midi) => handleKeyDown(midi)}
              onKeyPointerUp={(midi) => handleKeyUp(midi)}
            />
          )}

          {/* 2. Teclado Virtual SVG Responsivo que preenche 100% da largura sem scrollbar */}
          <div className="w-full overflow-hidden">
            <svg
              width="100%"
              height={totalSvgHeight}
              className="block w-full overflow-hidden"
              viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
              preserveAspectRatio="none"
              onPointerLeave={(e) => {
                if (e.buttons === 0) releaseAllKeys();
              }}
              onPointerCancel={() => releaseAllKeys()}
            >
              <defs>
                <linearGradient id={whiteKeyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fdfdfd" />
                  <stop offset="90%" stopColor="#eceef2" />
                  <stop offset="100%" stopColor="#d5d8de" />
                </linearGradient>
                <linearGradient id={blackKeyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2e2d3b" />
                  <stop offset="85%" stopColor="#15141f" />
                  <stop offset="100%" stopColor="#08070d" />
                </linearGradient>
              </defs>

              {/* 1. Camada de Teclas Brancas */}
              {Array.from({ length: octaveCount }).map((_, octIdx) => {
                const currentOctave = startOctave + octIdx;
                const baseMidi = (currentOctave + 2) * 12;

                return naturalOffsets.map((offset, noteIdx) => {
                  const midi = baseMidi + offset;
                  const whiteIndex = octIdx * 7 + noteIdx;
                  const x = whiteIndex * whiteKeyWidth;
                  const noteInfo = getNoteInfo(midi);
                  const highlight = getHighlight(midi);
                  const isMiddleC = (midi === 60);
                  const isPressed = combinedActiveNotes.includes(midi);
                  const isError = errorNotes.includes(midi);
                  const isCorrect = correctNotes.includes(midi);

                  let keyFill = `url(#${whiteKeyGradId})`;
                  if (isError) {
                    keyFill = '#fecaca'; // Fundo vermelho intenso de erro
                  } else if (isCorrect) {
                    keyFill = '#bbf7d0'; // Fundo verde esmeralda de acerto
                  } else if (isPressed) {
                    keyFill = '#ffe4e6'; // Destaque aceso quando pressionada
                  } else if (highlight) {
                    keyFill = getDegreeColor(highlight.degreeName, highlight.color);
                  }

                  return (
                    <g
                      key={`white-${midi}`}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        handleKeyDown(midi, e.pointerId);
                      }}
                      onPointerUp={(e) => {
                        e.preventDefault();
                        handleKeyUp(midi, e.pointerId);
                      }}
                      onPointerEnter={(e) => {
                        if (e.buttons === 1 && !pressedKeysSetRef.current.has(midi)) {
                          handleKeyDown(midi, e.pointerId);
                        }
                      }}
                      onPointerLeave={(e) => {
                        handleKeyUp(midi, e.pointerId);
                      }}
                      onPointerCancel={(e) => {
                        handleKeyUp(midi, e.pointerId);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Tecla Branca Retangular */}
                      <rect
                        x={x + 0.5}
                        y={0}
                        width={Math.max(2, whiteKeyWidth - 1)}
                        height={whiteKeyHeight}
                        rx={Math.min(5, whiteKeyWidth * 0.15)}
                        fill={keyFill}
                        stroke={isError ? '#dc2626' : isCorrect ? '#16a34a' : isPressed ? '#f43f5e' : isMiddleC ? '#0284c7' : '#8e94a0'}
                        strokeWidth={isError || isCorrect ? 2.8 : isPressed || isMiddleC ? 2 : 0.8}
                        className="transition-all duration-100"
                      />

                      {/* Destaque visual inconfundível para o Dó Central (C3) */}
                      {isMiddleC && (
                        <g>
                          <rect
                            x={x + 2}
                            y={4}
                            width={Math.max(12, whiteKeyWidth - 4)}
                            height={18}
                            rx={4}
                            fill="#0284c7"
                          />
                          <text
                            x={x + whiteKeyWidth / 2}
                            y={16.5}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={Math.max(7, Math.min(9.5, whiteKeyWidth * 0.22))}
                            fontWeight="black"
                            fontFamily="Outfit, sans-serif"
                          >
                            {whiteKeyWidth > 38 ? `DÓ CENTRAL (${centralNoteName})` : centralNoteName}
                          </text>
                        </g>
                      )}

                      {/* Indicador de Erro em Vermelho */}
                      {isError && (
                        <g>
                          <rect
                            x={x + 2}
                            y={whiteKeyHeight - 34}
                            width={Math.max(16, whiteKeyWidth - 4)}
                            height={15}
                            rx={3}
                            fill="#dc2626"
                          />
                          <text
                            x={x + whiteKeyWidth / 2}
                            y={whiteKeyHeight - 23}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={Math.max(6.5, Math.min(8.5, whiteKeyWidth * 0.2))}
                            fontWeight="900"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            ✕ ERRO
                          </text>
                        </g>
                      )}

                      {/* Rótulo da Nota no rodapé da tecla */}
                      <text
                        x={x + whiteKeyWidth / 2}
                        y={whiteKeyHeight - 10}
                        textAnchor="middle"
                        fill={isError ? '#dc2626' : isCorrect ? '#16a34a' : isPressed ? '#e11d48' : highlight ? '#ffffff' : isMiddleC ? '#0284c7' : '#334155'}
                        fontSize={isMiddleC ? labelFontSize + 1 : labelFontSize}
                        fontWeight="black"
                        fontFamily="Outfit, sans-serif"
                      >
                        {noteInfo.name}
                        {!isUltraCompact && (
                          <tspan fontSize={Math.max(6, labelFontSize * 0.8)} opacity={0.7}>
                            {noteInfo.octave}
                          </tspan>
                        )}
                      </text>

                      {/* Apontamento de Dedo (Pointer Badge) ABAIXO DA TECLA DO TECLADO */}
                      {showFingerGuide && (() => {
                        const finger = getKeyFinger(midi, highlight);
                        if (!finger || !FINGER_INFO[finger] || isUltraCompact) return null;
                        const info = FINGER_INFO[finger];
                        const badgeW = whiteKeyWidth > 38 ? 32 : 22;
                        const badgeH = 17;
                        const badgeY = whiteKeyHeight + 6;
                        const cx = x + whiteKeyWidth / 2;

                        return (
                          <g className="finger-pointer-badge">
                            {/* Triângulo apontador voltado para CIMA em direção à base da tecla */}
                            <polygon
                              points={`${cx - 3.5},${badgeY} ${cx + 3.5},${badgeY} ${cx},${badgeY - 4.5}`}
                              fill={info.color}
                            />
                            {/* Cápsula com borda de alto contraste posicionada abaixo do teclado */}
                            <rect
                              x={cx - badgeW / 2}
                              y={badgeY}
                              width={badgeW}
                              height={badgeH}
                              rx={4}
                              fill={info.color}
                              stroke="#090814"
                              strokeWidth={1}
                            />
                            {/* Rótulo D1, D2, D3, D4, D5 */}
                            <text
                              x={cx}
                              y={badgeY + 12}
                              textAnchor="middle"
                              fill="#090814"
                              fontSize={Math.max(8, Math.min(10.5, whiteKeyWidth * 0.22))}
                              fontWeight="900"
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {info.short}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                });
              })}

              {/* 2. Camada de Teclas Pretas (Acima das brancas) */}
              {Array.from({ length: octaveCount }).map((_, octIdx) => {
                const currentOctave = startOctave + octIdx;
                const baseMidi = (currentOctave + 2) * 12;

                return accidentalOffsets.map((acc) => {
                  const midi = baseMidi + acc.semitones;
                  const whiteIndex = octIdx * 7 + acc.posAfterWhite;
                  const x = (whiteIndex + 1) * whiteKeyWidth - (blackKeyWidth / 2);
                  const noteInfo = getNoteInfo(midi);
                  const highlight = getHighlight(midi);
                  const isPressed = combinedActiveNotes.includes(midi);
                  const isError = errorNotes.includes(midi);
                  const isCorrect = correctNotes.includes(midi);

                  let keyFill = `url(#${blackKeyGradId})`;
                  if (isError) {
                    keyFill = '#dc2626'; // Tecla preta brilha em vermelho vivo de erro!
                  } else if (isCorrect) {
                    keyFill = '#16a34a'; // Tecla preta brilha em verde de acerto!
                  } else if (isPressed) {
                    keyFill = '#f43f5e'; // Tecla preta brilha em coral neon quando tocada
                  } else if (highlight) {
                    keyFill = getDegreeColor(highlight.degreeName, highlight.color);
                  }

                  return (
                    <g
                      key={`black-${midi}`}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleKeyDown(midi, e.pointerId);
                      }}
                      onPointerUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleKeyUp(midi, e.pointerId);
                      }}
                      onPointerEnter={(e) => {
                        if (e.buttons === 1 && !pressedKeysSetRef.current.has(midi)) {
                          handleKeyDown(midi, e.pointerId);
                        }
                      }}
                      onPointerLeave={(e) => {
                        handleKeyUp(midi, e.pointerId);
                      }}
                      onPointerCancel={(e) => {
                        handleKeyUp(midi, e.pointerId);
                      }}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={x}
                        y={0}
                        width={blackKeyWidth}
                        height={blackKeyHeight}
                        rx={Math.min(4, blackKeyWidth * 0.18)}
                        fill={keyFill}
                        stroke={isError ? '#fca5a5' : isCorrect ? '#86efac' : isPressed ? '#fda4af' : '#0f172a'}
                        strokeWidth={isError || isCorrect ? 2.5 : isPressed ? 1.8 : 1}
                        className="transition-all duration-100"
                      />

                      {/* Indicador de Erro na Tecla Preta */}
                      {isError && (
                        <g>
                          <rect
                            x={x + 1}
                            y={blackKeyHeight - 24}
                            width={blackKeyWidth - 2}
                            height={12}
                            rx={2}
                            fill="#7f1d1d"
                            stroke="#ef4444"
                            strokeWidth={0.8}
                          />
                          <text
                            x={x + blackKeyWidth / 2}
                            y={blackKeyHeight - 15}
                            textAnchor="middle"
                            fill="#fecaca"
                            fontSize={Math.max(6, Math.min(8, blackKeyWidth * 0.28))}
                            fontWeight="900"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            ✕ ERRO
                          </text>
                        </g>
                      )}

                      {/* Nome do sustenido/bemol na ponta */}
                      {!isUltraCompact && (
                        <text
                          x={x + blackKeyWidth / 2}
                          y={blackKeyHeight - 8}
                          textAnchor="middle"
                          fill={isPressed ? '#ffffff' : highlight ? '#ffffff' : '#94a3b8'}
                          fontSize={blackLabelFontSize}
                          fontWeight="bold"
                          fontFamily="Outfit, sans-serif"
                        >
                          {noteInfo.name}
                        </text>
                      )}

                      {/* Apontamento de Dedo da Tecla Preta ABAIXO DO TECLADO */}
                      {showFingerGuide && (() => {
                        const finger = getKeyFinger(midi, highlight);
                        if (!finger || !FINGER_INFO[finger] || isUltraCompact) return null;
                        const info = FINGER_INFO[finger];
                        const badgeW = Math.max(16, blackKeyWidth - 2);
                        const badgeH = 16;
                        const badgeY = whiteKeyHeight + 6;
                        const cx = x + blackKeyWidth / 2;

                        return (
                          <g className="finger-pointer-badge-black">
                            <polygon
                              points={`${cx - 3},${badgeY} ${cx + 3},${badgeY} ${cx},${badgeY - 4}`}
                              fill={info.color}
                            />
                            <rect
                              x={cx - badgeW / 2}
                              y={badgeY}
                              width={badgeW}
                              height={badgeH}
                              rx={3.5}
                              fill={info.color}
                              stroke="#090814"
                              strokeWidth={0.8}
                            />
                            <text
                              x={cx}
                              y={badgeY + 11.5}
                              textAnchor="middle"
                              fill="#090814"
                              fontSize={Math.max(7, Math.min(9.5, blackKeyWidth * 0.32))}
                              fontWeight="900"
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {info.short}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                });
              })}
            </svg>
          </div>

          {/* 3. Tag do Dedo a Ser Utilizado — Posicionada Oficialmente Abaixo do Teclado */}
          <div className="w-full flex items-center justify-center pt-2 pb-1">
            <div className="flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#191030]/90 to-indigo-950/80 border border-indigo-500/30 shadow-xl shadow-indigo-950/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-sm">🖐️</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Dedo a ser utilizado:
                </span>
              </div>

              {activeFingerDisplay ? (
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black font-mono shadow-md text-slate-950 transition-all scale-105"
                    style={{ backgroundColor: activeFingerDisplay.color }}
                  >
                    <span>👆</span>
                    <span>{activeFingerDisplay.label || `D${activeFingerDisplay.finger}`}</span>
                    <span>({activeFingerDisplay.fingerName})</span>
                  </span>
                  {activeFingerDisplay.noteName && (
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-white/10 text-cyan-300 border border-cyan-500/30">
                      Tecla: {activeFingerDisplay.noteName}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-mono text-slate-400 italic">
                  Toque uma tecla ou inicie a partitura para apontamento do dedo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menus e Controles do Teclado Posicionados Abaixo das Teclas */}
      {/* 1. Barra de Controle de Oitavas & Rastro Synthesia (Bordas Sutis) */}
      {allowOctaveControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs backdrop-blur-md">
          {/* Seletor de Quantidade de Oitavas Visíveis */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Oitavas:</span>
            </span>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 font-bold text-[10px]">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    userSelectedOctaveCountRef.current = true;
                    setOctaveCount(count);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    octaveCount === count
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${count} oitava${count > 1 ? 's' : ''}`}
                >
                  {count} {count === 1 ? 'Oitava' : 'Oitavas'}
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
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
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
              Faixa: <strong className="text-white">C{startOctave + displayOctaveOffset} a B{endOctave + displayOctaveOffset}</strong> ({octaveCount * 12} Teclas)
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
                Oitava {startOctave + displayOctaveOffset}
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

      {/* 2. Barra de Dedos da Mão (Apontamento Visual com Rótulos e Cores) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 shadow-lg text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-indigo-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span>🖐️</span>
            <span>Apontamento de Dedos:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              D1: Polegar
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              D2: Indicador
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              D3: Médio
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              D4: Anelar
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              D5: Mínimo
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowFingerGuide(v => !v)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showFingerGuide
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {showFingerGuide ? '🖐️ Dedos na Tecla: ON' : '🖐️ Dedos: OFF'}
        </button>
      </div>

      {/* 3. Legenda de Cores de Graus Harmônicos & Dó Central (Apenas no Modo de Acordes/Harmonia) */}
      {highlightedKeys.some(k => k.degreeName && /^(1|3|5|7|T|b3|♭3|#5|♯5|b7|♭7)/.test(k.degreeName)) && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-0.5">
          <div className="flex items-center gap-1.5 bg-cyan-950/40 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-200 font-bold text-[10px]">{centralNoteName} = Dó Central (Marcador Ciano)</span>
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
      )}
    </div>
  );
};
