import React from 'react';
import { soundEngine } from '../../core/soundEngine';
import { GUITAR_TUNING_MIDI, getGuitarFretNote } from '../../core/musicTheory';
import type { GuitarChordShape } from '../../core/types';
import { Play, Music } from 'lucide-react';

interface Props {
  chordShape?: GuitarChordShape;
  fretCount?: number;        // Padrão: 12 a 15 casas
  showNoteNames?: boolean;
}

export const FretboardView: React.FC<Props> = ({
  chordShape,
  fretCount = 14,
  showNoteNames = false,
}) => {
  // Trastes onde ficam os marcadores de posição (inlays de madrepérola)
  const singleDotFrets = [3, 5, 7, 9, 15];
  const doubleDotFrets = [12];

  // Afinação das 6 cordas (1 = E aguda até 6 = E grave)
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

  // Dimensões do Braço SVG
  const nutWidth = 14;
  const fretWidth = 48;
  const stringSpacing = 24;
  const boardHeight = (strings.length - 1) * stringSpacing + 36;
  const totalSvgWidth = nutWidth + fretCount * fretWidth + 30;

  return (
    <div className="w-full flex flex-col items-center select-none no-select">
      {/* Botões de Ação Sonora */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handlePlayChord}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Palhetar Acorde</span>
        </button>

        <button
          onClick={handlePlayArpeggio}
          className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Music className="w-4 h-4 text-amber-400" />
          <span>Dedilhado Lento</span>
        </button>
      </div>

      {/* Braço de Violão SVG Responsivo com Scroll Horizontal */}
      <div className="w-full overflow-x-auto pb-4 no-scrollbar flex justify-center">
        <div className="p-4 rounded-3xl glass-panel border border-white/10 shadow-2xl bg-[#140e0b]/90 inline-block">
          <svg
            width={totalSvgWidth}
            height={boardHeight + 35}
            viewBox={`0 0 ${totalSvgWidth} ${boardHeight + 35}`}
            className="block overflow-visible"
          >
            {/* Madeira do Braço (Rosewood / Pau-Ferro) */}
            <rect
              x={nutWidth}
              y={18}
              width={fretCount * fretWidth}
              height={boardHeight - 20}
              rx={6}
              fill="#261710"
              stroke="#3d261b"
              strokeWidth={2}
            />

            {/* Pestana de Osso (Nut / Traste 0) */}
            <rect
              x={nutWidth - 8}
              y={16}
              width={8}
              height={boardHeight - 16}
              rx={3}
              fill="#f1efe7"
              stroke="#c7c3b2"
              strokeWidth={1}
            />

            {/* Inlays de Posição (Bolinhas no braço) */}
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
                    r={5}
                    fill="#e2dfd2"
                    opacity={0.65}
                  />
                );
              }
              if (doubleDotFrets.includes(fretNum)) {
                return (
                  <g key={`double-dot-${fretNum}`}>
                    <circle cx={xCenter} cy={yCenter - 22} r={4.5} fill="#e2dfd2" opacity={0.7} />
                    <circle cx={xCenter} cy={yCenter + 22} r={4.5} fill="#e2dfd2" opacity={0.7} />
                  </g>
                );
              }
              return null;
            })}

            {/* Trastes Metálicos (Frets) */}
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
                    stroke="#c0c0c0"
                    strokeWidth={2.5}
                  />
                  {/* Número do traste abaixo do braço */}
                  <text
                    x={xPos - fretWidth / 2}
                    y={boardHeight + 20}
                    textAnchor="middle"
                    fill="#78716c"
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
              <rect
                x={nutWidth + (chordShape.barreFret - 0.6) * fretWidth}
                y={18 + (chordShape.barreStrings[0] - 1) * stringSpacing}
                width={12}
                height={(chordShape.barreStrings[1] - chordShape.barreStrings[0]) * stringSpacing}
                rx={6}
                fill="#fbbf24"
                opacity={0.85}
              />
            )}

            {/* 6 Cordas do Violão (Espessuras variadas do bordão às primas) */}
            {strings.map((strNum, idx) => {
              const yPos = 24 + idx * stringSpacing;
              // Corda 6 (E grave) é mais grossa (3.5px), Corda 1 (E aguda) é mais fina (1.2px)
              const thickness = 1.2 + (5 - idx) * 0.45;
              const stringColor = idx < 3 ? '#d6d3d1' : '#f59e0b'; // Primas de nylon prata / Bordões bronze

              return (
                <g key={`string-${strNum}`} className="group cursor-pointer" onClick={() => handlePluckString(strNum)}>
                  {/* Linha da corda */}
                  <line
                    x1={nutWidth - 8}
                    y1={yPos}
                    x2={nutWidth + fretCount * fretWidth}
                    y2={yPos}
                    stroke={stringColor}
                    strokeWidth={thickness}
                    className="group-hover:stroke-amber-300 transition-colors"
                  />

                  {/* Nome da corda solta à esquerda da pestana */}
                  <text
                    x={nutWidth - 18}
                    y={yPos + 4}
                    textAnchor="end"
                    fill="#a8a29e"
                    fontSize={11}
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {GUITAR_TUNING_MIDI.find(s => s.string === strNum)?.name[0]}
                  </text>
                </g>
              );
            })}

            {/* Marcadores de Dedos / Notas Pressionadas no Acorde */}
            {chordShape && strings.map((strNum) => {
              // frets do shape: [E6, A5, D4, G3, B2, e1]
              const fret = chordShape.frets[6 - strNum];
              const finger = chordShape.fingers[6 - strNum];
              const yPos = 24 + (strNum - 1) * stringSpacing;

              // Corda abafada (X)
              if (fret === -1) {
                return (
                  <text
                    key={`muted-${strNum}`}
                    x={nutWidth - 4}
                    y={yPos + 4}
                    textAnchor="middle"
                    fill="#f43f5e"
                    fontSize={13}
                    fontWeight="black"
                  >
                    ✕
                  </text>
                );
              }

              // Corda Solta (O)
              if (fret === 0) {
                return (
                  <circle
                    key={`open-${strNum}`}
                    cx={nutWidth - 4}
                    cy={yPos}
                    r={4}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                );
              }

              // Casa premida (bolinha de dedo)
              const xPos = nutWidth + (fret - 0.5) * fretWidth;
              const noteInfo = getGuitarFretNote(strNum, fret);
              const isRoot = noteInfo.name === chordShape.rootNote;

              return (
                <g key={`fret-pressed-${strNum}`} onClick={() => handlePluckString(strNum)} className="cursor-pointer">
                  {/* Aura luminosa na fundamental */}
                  {isRoot && (
                    <circle
                      cx={xPos}
                      cy={yPos}
                      r={14}
                      fill="#f43f5e"
                      opacity={0.3}
                      className="animate-ping"
                    />
                  )}

                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={11}
                    fill={isRoot ? '#f43f5e' : '#fbbf24'}
                    stroke="#0c0a09"
                    strokeWidth={2}
                  />

                  {/* Número do dedo ou nome da nota */}
                  <text
                    x={xPos}
                    y={yPos + 4}
                    textAnchor="middle"
                    fill="#0c0a09"
                    fontSize={10}
                    fontWeight="black"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {showNoteNames ? noteInfo.name : finger > 0 ? finger : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
