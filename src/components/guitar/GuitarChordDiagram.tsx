import React, { useState } from 'react';
import type { GuitarChordShape } from '../../core/types';
import { generateGuitarChord, type GuitarChordQuality } from '../../core/guitarChordGenerator';
import { parseChord } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { Volume2, Sparkles, Layers } from 'lucide-react';

export const COMMON_GUITAR_SHAPES: Record<string, GuitarChordShape> = {
  'C': {
    name: 'Dó Maior (C)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    bassNote: 'C',
  },
  'G': {
    name: 'Sol Maior (G)',
    cagedLetter: 'G',
    rootNote: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [3, 2, 0, 0, 0, 4],
    bassNote: 'G',
  },
  'Am': {
    name: 'Lá Menor (Am)',
    cagedLetter: 'A',
    rootNote: 'A',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    bassNote: 'A',
  },
  'Em': {
    name: 'Mi Menor (Em)',
    cagedLetter: 'E',
    rootNote: 'E',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    bassNote: 'E',
  },
  'D': {
    name: 'Ré Maior (D)',
    cagedLetter: 'D',
    rootNote: 'D',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    bassNote: 'D',
  },
  'Dm': {
    name: 'Ré Menor (Dm)',
    cagedLetter: 'D',
    rootNote: 'D',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    bassNote: 'D',
  },
  'F': {
    name: 'Fá Maior com Pestana (F)',
    cagedLetter: 'E',
    rootNote: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barreFret: 1,
    barreStrings: [1, 6],
    bassNote: 'F',
  },
  'A': {
    name: 'Lá Maior (A)',
    cagedLetter: 'A',
    rootNote: 'A',
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    bassNote: 'A',
  },
  'E': {
    name: 'Mi Maior (E)',
    cagedLetter: 'E',
    rootNote: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    bassNote: 'E',
  },
  'B7': {
    name: 'Si com Sétima (B7)',
    cagedLetter: 'A',
    rootNote: 'B',
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
    bassNote: 'B',
  },
  'C7': {
    name: 'Dó com Sétima (C7)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0],
    bassNote: 'C',
  },
  'G7': {
    name: 'Sol com Sétima (G7)',
    cagedLetter: 'G',
    rootNote: 'G',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    bassNote: 'G',
  },
  'A7': {
    name: 'Lá com Sétima (A7)',
    cagedLetter: 'A',
    rootNote: 'A',
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 2, 0, 3, 0],
    bassNote: 'A',
  },
  'D7': {
    name: 'Ré com Sétima (D7)',
    cagedLetter: 'D',
    rootNote: 'D',
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3],
    bassNote: 'D',
  },
  'Bm': {
    name: 'Si Menor com Pestana (Bm)',
    cagedLetter: 'A',
    rootNote: 'B',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    barreFret: 2,
    barreStrings: [1, 5],
    bassNote: 'B',
  },
  'F#m': {
    name: 'Fá Sustenido Menor (F#m)',
    cagedLetter: 'E',
    rootNote: 'F#',
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    barreFret: 2,
    barreStrings: [1, 6],
    bassNote: 'F#',
  },
  'Bb': {
    name: 'Si Bemol Maior (Bb)',
    cagedLetter: 'A',
    rootNote: 'Bb',
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [0, 1, 2, 3, 4, 1],
    barreFret: 1,
    barreStrings: [1, 5],
    bassNote: 'Bb',
  },
  'Eb': {
    name: 'Mi Bemol Maior (Eb)',
    cagedLetter: 'A',
    rootNote: 'Eb',
    frets: [-1, 6, 8, 8, 8, 6],
    fingers: [0, 1, 2, 3, 4, 1],
    barreFret: 6,
    barreStrings: [1, 5],
    bassNote: 'Eb',
  },
};

/**
 * Obtém a forma exata do acorde de violão pelo símbolo (ex: 'C', 'G7', 'Am').
 */
export function getGuitarChordShape(chordSymbol: string): GuitarChordShape {
  const clean = (chordSymbol || 'C').trim();
  if (COMMON_GUITAR_SHAPES[clean]) {
    return COMMON_GUITAR_SHAPES[clean];
  }

  // Tenta extrair a tônica e a qualidade pelo parseChord
  const parsed = parseChord(clean);
  if (!parsed) {
    return COMMON_GUITAR_SHAPES['C'];
  }

  // Mapeia qualidade para GuitarChordQuality
  let gQuality: GuitarChordQuality = 'major';
  if (parsed.quality === 'minor') gQuality = 'minor';
  else if (parsed.quality === 'dom7') gQuality = 'dom7';
  else if (parsed.quality === 'maj7') gQuality = 'maj7';
  else if (parsed.quality === 'min7') gQuality = 'min7';
  else if (parsed.quality === 'diminished') gQuality = 'dim';

  try {
    const shape = generateGuitarChord(parsed.root, gQuality, 'E');
    return shape;
  } catch {
    return COMMON_GUITAR_SHAPES['C'];
  }
}

interface GuitarChordDiagramProps {
  chord: string;
  showTab?: boolean;
  onToggleTab?: () => void;
  compact?: boolean;
}

export const GuitarChordDiagram: React.FC<GuitarChordDiagramProps> = ({
  chord,
  showTab = false,
  compact = false,
}) => {
  const [isPlayingStrum, setIsPlayingStrum] = useState<boolean>(false);
  const shape = getGuitarChordShape(chord);

  // Calcula notas audíveis de cada corda
  const tuningPitches = [40, 45, 50, 55, 59, 64]; // E6, A5, D4, G3, B2, e1

  const handlePlayStrum = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await soundEngine.ensureAudioReady();
    setIsPlayingStrum(true);

    const activeMidis: number[] = [];
    shape.frets.forEach((fret, stringIdx) => {
      if (fret >= 0) {
        activeMidis.push(tuningPitches[stringIdx] + fret);
      }
    });

    // Strumming autêntico de violão (efeito arpeggiato de 22ms entre cordas)
    activeMidis.forEach((midi, idx) => {
      setTimeout(() => {
        soundEngine.playPianoNote(midi, 1.8, undefined, 0.75, true);
      }, idx * 22);
    });

    setTimeout(() => {
      setIsPlayingStrum(false);
    }, activeMidis.length * 22 + 400);
  };

  // Coordenadas do Grid SVG
  const width = compact ? 92 : 110;
  const height = compact ? 116 : 138;
  const leftX = compact ? 14 : 18;
  const rightX = compact ? 78 : 94;
  const topY = compact ? 28 : 34;
  const bottomY = compact ? 98 : 118;
  const stringStep = (rightX - leftX) / 5;
  const fretStep = (bottomY - topY) / 4;

  const activeFrets = shape.frets.filter(f => f > 0);
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 1;
  const startFret = minFret > 3 ? minFret : 1;
  const isNut = startFret === 1;

  // Cordas do violão para a tablatura: 1 = e, 2 = B, 3 = G, 4 = D, 5 = A, 6 = E
  const stringNamesTab = ['e', 'B', 'G', 'D', 'A', 'E'];
  const tabFretValues = [...shape.frets].reverse().map(f => (f === -1 ? 'X' : `${f}`));

  return (
    <div
      onClick={handlePlayStrum}
      className={`glass-card rounded-2xl border transition-all cursor-pointer group select-none ${
        compact ? 'p-2' : 'p-3'
      } ${
        isPlayingStrum
          ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
          : 'border-white/10 hover:border-amber-500/40 bg-black/40 hover:bg-black/60'
      }`}
      title={`Acorde ${chord} no Violão (Clique para ouvir batida/strumming)`}
    >
      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-wide">
          {chord}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
            {shape.cagedLetter}
          </span>
          <Volume2 className={`w-3 h-3 transition-colors ${isPlayingStrum ? 'text-amber-300 animate-pulse' : 'text-slate-500 group-hover:text-amber-400'}`} />
        </div>
      </div>

      {showTab ? (
        /* Visualização em Tablatura Adaptada */
        <div className="font-mono text-[10px] leading-tight space-y-0.5 py-1.5 px-2 bg-slate-950/80 rounded-xl border border-white/5">
          {stringNamesTab.map((strName, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-400">
              <span className="text-amber-400 font-bold w-3">{strName}</span>
              <span className="text-slate-600">|</span>
              <span className={`font-bold px-1 ${tabFretValues[idx] === 'X' ? 'text-rose-400' : 'text-emerald-300'}`}>
                {tabFretValues[idx]}
              </span>
              <span className="text-slate-600">|</span>
            </div>
          ))}
        </div>
      ) : (
        /* Diagrama Visual em Pauta/Braço SVG */
        <svg width={width} height={height} className="overflow-visible mx-auto block">
          {/* Fret de Início / Posição (ex: 3ª casa) */}
          {!isNut && (
            <text
              x={leftX - 4}
              y={topY + fretStep * 0.7}
              fill="#fbbf24"
              fontSize={compact ? '8' : '9'}
              fontWeight="bold"
              textAnchor="end"
              fontFamily="monospace"
            >
              {startFret}ª
            </text>
          )}

          {/* 6 Cordas Verticais (E6 até e1) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = leftX + i * stringStep;
            return (
              <line
                key={`string-${i}`}
                x1={x}
                y1={topY}
                x2={x}
                y2={bottomY}
                stroke={i >= 3 ? '#94a3b8' : '#cbd5e1'}
                strokeWidth={i >= 4 ? 1.4 : 1}
              />
            );
          })}

          {/* Trastes Horizontais (5 linhas = 4 trastes) */}
          {Array.from({ length: 5 }).map((_, f) => {
            const y = topY + f * fretStep;
            return (
              <line
                key={`fret-${f}`}
                x1={leftX}
                y1={y}
                x2={rightX}
                y2={y}
                stroke={f === 0 && isNut ? '#fbbf24' : '#475569'}
                strokeWidth={f === 0 && isNut ? 3 : 1}
              />
            );
          })}

          {/* Marcadores de Pestana (Barre) */}
          {shape.barreFret && shape.barreStrings && (
            (() => {
              const relFret = shape.barreFret - startFret + 1;
              if (relFret >= 1 && relFret <= 4) {
                const y = topY + (relFret - 0.5) * fretStep;
                // barreStrings: [1, 5] ou [1, 6] -> 1 = e1 (x = rightX), 6 = E6 (x = leftX)
                const startStr = shape.barreStrings[0];
                const endStr = shape.barreStrings[1];
                const x1 = rightX - (endStr - 1) * stringStep;
                const x2 = rightX - (startStr - 1) * stringStep;
                return (
                  <rect
                    x={x1 - 4}
                    y={y - 4}
                    width={x2 - x1 + 8}
                    height={8}
                    rx={4}
                    fill="#f59e0b"
                    opacity={0.85}
                  />
                );
              }
              return null;
            })()
          )}

          {/* Marcadores de Cordas Soltas (O), Abafadas (X) e Dedos (1, 2, 3, 4) */}
          {shape.frets.map((fret, stringIdx) => {
            const x = leftX + stringIdx * stringStep;
            const finger = shape.fingers[stringIdx];

            // Corda Abafada (✕)
            if (fret === -1) {
              return (
                <text
                  key={`muted-${stringIdx}`}
                  x={x}
                  y={topY - 6}
                  fill="#f43f5e"
                  fontSize={compact ? '9' : '10'}
                  fontWeight="black"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  ✕
                </text>
              );
            }

            // Corda Solta (○)
            if (fret === 0) {
              return (
                <circle
                  key={`open-${stringIdx}`}
                  cx={x}
                  cy={topY - 9}
                  r={compact ? 3 : 3.5}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                />
              );
            }

            // Nota Pressionada no Braço
            const relFret = fret - startFret + 1;
            if (relFret >= 1 && relFret <= 4) {
              const y = topY + (relFret - 0.5) * fretStep;
              return (
                <g key={`dot-${stringIdx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={compact ? 5 : 5.8}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth={1.2}
                    className="group-hover:scale-110 transition-transform origin-center"
                  />
                  {finger > 0 && (
                    <text
                      x={x}
                      y={y + (compact ? 3 : 3.5)}
                      fill="#0f172a"
                      fontSize={compact ? '7' : '8'}
                      fontWeight="black"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {finger}
                    </text>
                  )}
                </g>
              );
            }

            return null;
          })}
        </svg>
      )}
    </div>
  );
};

interface GuitarChordStripProps {
  chords: string[];
  title?: string;
  badge?: string;
  allowTabToggle?: boolean;
}

export const GuitarChordStrip: React.FC<GuitarChordStripProps> = ({
  chords,
  title = 'Diagramas Harmônicos de Violão:',
  badge = '6 Cordas & Pestanas',
  allowTabToggle = true,
}) => {
  const [showTabMode, setShowTabMode] = useState<boolean>(false);

  // Evita duplicatas mantendo a ordem original de aparecimento
  const uniqueChords = Array.from(new Set(chords));

  return (
    <div className="p-3 sm:p-4 rounded-3xl bg-black/40 border border-amber-500/20 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{title}</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
            {badge}
          </span>
        </div>

        {allowTabToggle && (
          <button
            onClick={() => setShowTabMode(!showTabMode)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
              showTabMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Alternar entre Diagrama Gráfico e Tablatura"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{showTabMode ? 'Ver Diagramas' : 'Ver Tablatura'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 items-stretch">
        {uniqueChords.map((chord, i) => (
          <GuitarChordDiagram
            key={`${chord}-${i}`}
            chord={chord}
            showTab={showTabMode}
          />
        ))}
      </div>
    </div>
  );
};
