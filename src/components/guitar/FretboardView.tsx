import React, { useState } from 'react';
import { soundEngine } from '../../core/soundEngine';
import { GUITAR_TUNING_MIDI, getGuitarFretNote, CHROMATIC_NOTES_SHARP } from '../../core/musicTheory';
import { calculateHarmonicDegree, type GeneratedChordShape } from '../../core/guitarChordGenerator';
import type { GuitarChordShape } from '../../core/types';
import { Music, Volume2, Sparkles } from 'lucide-react';

export type FretboardMarkerMode = 'fingers' | 'notes' | 'degrees';

interface Props {
  chordShape?: GuitarChordShape | GeneratedChordShape;
  fretCount?: number; // Padrão: 15 casas
  markerMode?: FretboardMarkerMode;
  onMarkerModeChange?: (mode: FretboardMarkerMode) => void;
  showAudioControls?: boolean;
  showNoteNames?: boolean;
}

export const GUITAR_FINGER_INFO: Record<number, { name: string; short: string; color: string; bg: string }> = {
  1: { name: 'Indicador', short: 'D1', color: '#06b6d4', bg: '#164e63' },
  2: { name: 'Médio', short: 'D2', color: '#10b981', bg: '#064e3b' },
  3: { name: 'Anelar', short: 'D3', color: '#f59e0b', bg: '#78350f' },
  4: { name: 'Mínimo', short: 'D4', color: '#f43f5e', bg: '#881337' },
};

export const FretboardView: React.FC<Props> = ({
  chordShape,
  fretCount = 15,
  markerMode: externalMarkerMode,
  onMarkerModeChange,
  showAudioControls = true,
  showNoteNames,
}) => {
  const initialMode: FretboardMarkerMode = externalMarkerMode ?? (showNoteNames ? 'notes' : 'fingers');
  const [internalMode, setInternalMode] = useState<FretboardMarkerMode>(initialMode);
  const activeMode = externalMarkerMode ?? (showNoteNames !== undefined ? (showNoteNames ? 'notes' : 'fingers') : internalMode);

  const handleModeChange = (mode: FretboardMarkerMode) => {
    setInternalMode(mode);
    onMarkerModeChange?.(mode);
  };

  // Trastes onde ficam os inlays de madrepérola
  const singleDotFrets = [3, 5, 7, 9, 15];
  const doubleDotFrets = [12];

  // Afinação das 6 cordas (1 = e aguda até 6 = E grave)
  const strings = [1, 2, 3, 4, 5, 6];

  const handlePluckString = (stringNum: number) => {
    let fret = 0;
    if (chordShape) {
      const f = chordShape.frets[6 - stringNum];
      if (f === -1) return; // Muted
      fret = f;
    }
    const note = getGuitarFretNote(stringNum, fret);
    soundEngine.playGuitarPluck(note.midi, 1.8);
  };

  const handlePlayChord = () => {
    if (!chordShape) return;
    const midiList: number[] = [];
    strings.forEach((strNum) => {
      const fret = chordShape.frets[6 - strNum];
      if (fret >= 0) {
        midiList.push(getGuitarFretNote(strNum, fret).midi);
      }
    });
    soundEngine.playChord(midiList, 'guitar', 2.0);
  };

  const handlePlayArpeggio = () => {
    if (!chordShape) return;
    const midiList: number[] = [];
    // Toca do bordão (grave) para as primas (agudo)
    [6, 5, 4, 3, 2, 1].forEach((strNum) => {
      const fret = chordShape.frets[6 - strNum];
      if (fret >= 0) {
        midiList.push(getGuitarFretNote(strNum, fret).midi);
      }
    });
    soundEngine.playArpeggio(midiList, 'guitar', 55);
  };

  // Dimensões do Braço SVG Widescreen (15 Trastes)
  const nutWidth = 18;
  const fretWidth = 62;
  const stringSpacing = 28;
  const boardHeight = (strings.length - 1) * stringSpacing + 36;
  const totalSvgWidth = nutWidth + fretCount * fretWidth + 30;

  // Root pitch class for harmonic degree calculation
  const rootIndex = chordShape
    ? CHROMATIC_NOTES_SHARP.indexOf(chordShape.rootNote.replace(/b|#/, ''))
    : 0;

  return (
    <div className="w-full flex flex-col select-none no-select">
      {/* Barra de Controles Superiores: Modo de Exibição dos Marcadores + Áudio */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-black/40 border border-white/10">
        {/* Seletor de Modo de Exibição */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exibição no Braço:</span>
          </span>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleModeChange('fingers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'fingers'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🖐️</span>
              <span>Dedos (1 a 4)</span>
            </button>

            <button
              onClick={() => handleModeChange('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'notes'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🎵</span>
              <span>Nomes das Notas</span>
            </button>

            <button
              onClick={() => handleModeChange('degrees')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'degrees'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📐</span>
              <span>Graus Harmônicos</span>
            </button>
          </div>
        </div>

        {/* Botões de Ação de Áudio Compactos */}
        {showAudioControls && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayChord}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 fill-current" />
              <span>Ouvir Bloco</span>
            </button>

            <button
              onClick={handlePlayArpeggio}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Dedilhado</span>
            </button>
          </div>
        )}
      </div>

      {/* Legenda Didática Compacta */}
      <div className="w-full mb-3 px-3.5 py-2 rounded-xl bg-[#0f0b08]/80 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold">Mão Esquerda:</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">D1 Indicador</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">D2 Médio</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">D3 Anelar</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">D4 Mínimo</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            Fundamental (Tônica)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Clique nas cordas para dedilhar</span>
        </div>
      </div>

      {/* Braço de Violão SVG Expandido e Responsivo (Widescreen 15 Trastes) */}
      <div className="w-full overflow-x-auto pb-2 no-scrollbar rounded-2xl bg-[#140e0b] border border-white/10 shadow-2xl p-4">
        <svg
          viewBox={`0 0 ${totalSvgWidth} ${boardHeight + 35}`}
          className="w-full h-auto min-w-[800px] block overflow-visible"
        >
          {/* Madeira do Braço (Rosewood / Ébano Profundo) */}
          <rect
            x={nutWidth}
            y={18}
            width={fretCount * fretWidth}
            height={boardHeight - 20}
            rx={8}
            fill="#23150e"
            stroke="#3a2216"
            strokeWidth={2}
          />

          {/* Pestana de Osso (Nut / Traste 0) */}
          <rect
            x={nutWidth - 10}
            y={16}
            width={10}
            height={boardHeight - 16}
            rx={3}
            fill="#f5f2e9"
            stroke="#cfcbbe"
            strokeWidth={1.5}
          />

          {/* Inlays de Posição (Bolinhas de madrepérola nas casas 3, 5, 7, 9, 12, 15) */}
          {Array.from({ length: fretCount }).map((_, fIdx) => {
            const fretNum = fIdx + 1;
            const xCenter = nutWidth + (fretNum - 0.5) * fretWidth;
            const yCenter = 18 + (boardHeight - 20) / 2;

            if (singleDotFrets.includes(fretNum)) {
              return (
                <circle
                  key={`dot-${fretNum}`}
                  cx={xCenter}
                  cy={yCenter}
                  r={5.5}
                  fill="#e8e5d8"
                  opacity={0.7}
                />
              );
            }
            if (doubleDotFrets.includes(fretNum)) {
              return (
                <g key={`double-dot-${fretNum}`}>
                  <circle cx={xCenter} cy={yCenter - 26} r={5} fill="#e8e5d8" opacity={0.75} />
                  <circle cx={xCenter} cy={yCenter + 26} r={5} fill="#e8e5d8" opacity={0.75} />
                </g>
              );
            }
            return null;
          })}

          {/* Trastes Metálicos Níquel-Prata (Frets 1 a 15) */}
          {Array.from({ length: fretCount }).map((_, fIdx) => {
            const fretNum = fIdx + 1;
            const xPos = nutWidth + fretNum * fretWidth;
            return (
              <g key={`fret-${fretNum}`}>
                <line
                  x1={xPos}
                  y1={18}
                  x2={xPos}
                  y2={boardHeight - 2}
                  stroke="#c5c5c5"
                  strokeWidth={2.8}
                />
                {/* Número do traste abaixo da escala */}
                <text
                  x={xPos - fretWidth / 2}
                  y={boardHeight + 20}
                  textAnchor="middle"
                  fill="#8c827a"
                  fontSize={11}
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {fretNum}
                </text>
              </g>
            );
          })}

          {/* Pestana / Barra de Acorde (Se houver) */}
          {chordShape && chordShape.barreFret && chordShape.barreStrings && (
            <g>
              <rect
                x={nutWidth + (chordShape.barreFret - 0.6) * fretWidth}
                y={18 + (chordShape.barreStrings[0] - 1) * stringSpacing}
                width={14}
                height={(chordShape.barreStrings[1] - chordShape.barreStrings[0]) * stringSpacing}
                rx={7}
                fill="#06b6d4"
                opacity={0.88}
              />
              {activeMode === 'fingers' && (
                <g>
                  <polygon
                    points={`${nutWidth + (chordShape.barreFret - 0.5) * fretWidth - 3},15 ${nutWidth + (chordShape.barreFret - 0.5) * fretWidth + 3},15 ${nutWidth + (chordShape.barreFret - 0.5) * fretWidth},18`}
                    fill="#06b6d4"
                  />
                  <rect
                    x={nutWidth + (chordShape.barreFret - 0.5) * fretWidth - 32}
                    y={0}
                    width={64}
                    height={15}
                    rx={3.5}
                    fill="#06b6d4"
                    stroke="#0c0a09"
                    strokeWidth={0.8}
                  />
                  <text
                    x={nutWidth + (chordShape.barreFret - 0.5) * fretWidth}
                    y={10.5}
                    textAnchor="middle"
                    fill="#0c0a09"
                    fontSize={8.5}
                    fontWeight="900"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    👆 D1 Pestana
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 6 Cordas do Violão (Espessuras graduadas) */}
          {strings.map((strNum, idx) => {
            const yPos = 24 + idx * stringSpacing;
            const thickness = 1.3 + (5 - idx) * 0.5;
            const stringColor = idx < 3 ? '#e0dedb' : '#f59e0b';

            return (
              <g key={`string-${strNum}`} className="group cursor-pointer" onClick={() => handlePluckString(strNum)}>
                {/* Linha da corda */}
                <line
                  x1={nutWidth - 10}
                  y1={yPos}
                  x2={nutWidth + fretCount * fretWidth}
                  y2={yPos}
                  stroke={stringColor}
                  strokeWidth={thickness}
                  className="group-hover:stroke-amber-300 transition-colors"
                />

                {/* Nome da corda solta à esquerda da pestana */}
                <text
                  x={nutWidth - 20}
                  y={yPos + 4}
                  textAnchor="end"
                  fill="#a8a29e"
                  fontSize={11.5}
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {GUITAR_TUNING_MIDI.find(s => s.string === strNum)?.name[0]}
                </text>
              </g>
            );
          })}

          {/* Marcadores de Dedos / Notas / Graus Pressionados no Acorde */}
          {chordShape && strings.map((strNum) => {
            // frets do shape: [E6, A5, D4, G3, B2, e1]
            const fret = chordShape.frets[6 - strNum];
            const finger = chordShape.fingers ? chordShape.fingers[6 - strNum] : 0;
            const yPos = 24 + (strNum - 1) * stringSpacing;

            // Corda abafada (X)
            if (fret === -1) {
              return (
                <g key={`muted-${strNum}`}>
                  <text
                    x={nutWidth - 5}
                    y={yPos + 4.5}
                    textAnchor="middle"
                    fill="#f43f5e"
                    fontSize={13}
                    fontWeight="black"
                  >
                    ✕
                  </text>
                </g>
              );
            }

            // Corda Solta (O)
            if (fret === 0) {
              const noteInfo = getGuitarFretNote(strNum, 0);
              const isRoot = noteInfo.name === chordShape.rootNote;
              const degreeText = calculateHarmonicDegree(noteInfo.midi % 12, rootIndex, 'major');

              let openText = 'O';
              if (activeMode === 'notes') openText = noteInfo.name;
              else if (activeMode === 'degrees') openText = degreeText;

              return (
                <g key={`open-${strNum}`} onClick={() => handlePluckString(strNum)} className="cursor-pointer">
                  <circle
                    cx={nutWidth - 5}
                    cy={yPos}
                    r={6}
                    fill={isRoot ? '#f43f5e' : 'none'}
                    stroke={isRoot ? '#f43f5e' : '#10b981'}
                    strokeWidth={2}
                  />
                  {activeMode !== 'fingers' && (
                    <text
                      x={nutWidth - 5}
                      y={yPos + 3}
                      textAnchor="middle"
                      fill={isRoot ? '#0c0a09' : '#10b981'}
                      fontSize={8}
                      fontWeight="bold"
                    >
                      {openText}
                    </text>
                  )}
                </g>
              );
            }

            // Casa premida (bolinha com conteúdo dinâmico)
            const xPos = nutWidth + (fret - 0.5) * fretWidth;
            const noteInfo = getGuitarFretNote(strNum, fret);
            const isRoot = noteInfo.name === chordShape.rootNote;
            const fingerInfo = GUITAR_FINGER_INFO[finger] || { name: 'Dedo', short: `D${finger}`, color: '#fbbf24' };

            // Determine marker text based on activeMode
            let markerText = '';
            if (activeMode === 'fingers') {
              markerText = finger > 0 ? `D${finger}` : '';
            } else if (activeMode === 'notes') {
              markerText = noteInfo.name;
            } else if (activeMode === 'degrees') {
              // Check if chordShape has precalculated degrees
              if ('degrees' in chordShape && Array.isArray((chordShape as GeneratedChordShape).degrees)) {
                markerText = (chordShape as GeneratedChordShape).degrees[6 - strNum];
              } else {
                markerText = calculateHarmonicDegree(noteInfo.midi % 12, rootIndex, 'major');
              }
            }

            return (
              <g key={`fret-pressed-${strNum}`} onClick={() => handlePluckString(strNum)} className="cursor-pointer">
                {/* Aura luminosa na fundamental */}
                {isRoot && (
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={15}
                    fill="#f43f5e"
                    opacity={0.35}
                    className="animate-ping"
                  />
                )}

                {/* Círculo principal da nota no traste */}
                <circle
                  cx={xPos}
                  cy={yPos}
                  r={12}
                  fill={isRoot ? '#f43f5e' : fingerInfo.color}
                  stroke="#0c0a09"
                  strokeWidth={2}
                />

                {/* Texto do marcador (Dedo / Nota / Grau) */}
                <text
                  x={xPos}
                  y={yPos + 4}
                  textAnchor="middle"
                  fill="#0c0a09"
                  fontSize={10}
                  fontWeight="black"
                  fontFamily="Outfit, sans-serif"
                >
                  {markerText}
                </text>

                {/* Apontador Superior de Dedo quando em modo 'fingers' */}
                {activeMode === 'fingers' && finger > 0 && (
                  <g className="finger-pointer-badge">
                    <polygon
                      points={`${xPos - 3.5},${yPos - 13} ${xPos + 3.5},${yPos - 13} ${xPos},${yPos - 10}`}
                      fill={fingerInfo.color}
                    />
                    <rect
                      x={xPos - 18}
                      y={yPos - 28}
                      width={36}
                      height={15}
                      rx={3.5}
                      fill={fingerInfo.color}
                      stroke="#0c0a09"
                      strokeWidth={0.8}
                    />
                    <text
                      x={xPos}
                      y={yPos - 17.5}
                      textAnchor="middle"
                      fill="#0c0a09"
                      fontSize={8.5}
                      fontWeight="900"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      👆 {fingerInfo.short}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
