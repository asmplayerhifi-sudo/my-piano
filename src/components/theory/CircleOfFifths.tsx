import React, { useState } from 'react';
import { buildChord } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { Compass } from 'lucide-react';

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
    const chord = buildChord(key, 'major');
    const baseMidi = 60;
    const midiNotes = chord.intervals.map(semitones => baseMidi + semitones);
    soundEngine.playChord(midiNotes, 'piano', 1.5);
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

  // Dimensões do SVG do Círculo
  const size = 320;
  const center = size / 2;
  const outerRadius = 120;
  const innerRadius = 78;

  return (
    <div className={`w-full glass-card rounded-3xl p-6 border border-white/10 space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>Círculo das Quintas Interativo</span>
          </h3>
          <p className="text-xs text-slate-400">
            A bússola tonal da harmonia: relações de quinta justa, armaduras e o campo harmônico básico (I, IV, V).
          </p>
        </div>

        <div className="p-2 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold self-start sm:self-auto">
          Tonalidade: {selectedKey} Maior
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Gráfico Circular SVG Interativo (Totalmente Escalável em Qualquer Tela) */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] aspect-square overflow-visible">
            {/* Círculo de Fundo */}
            <circle cx={center} cy={center} r={outerRadius + 16} fill="#0d0c1c" stroke="#252440" strokeWidth={2} />
            <circle cx={center} cy={center} r={innerRadius - 20} fill="#141226" />

            {/* As 12 Fatias do Círculo */}
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

              if (isTonic) {
                textColor = '#ffffff';
                ringColor = '#f43f5e';
              } else if (isSubdom) {
                textColor = '#38bdf8';
                ringColor = '#0284c7';
              } else if (isDom) {
                textColor = '#fbbf24';
                ringColor = '#d97706';
              }

              return (
                <g key={item.key} onClick={() => handleKeyClick(item.key)} className="cursor-pointer group">
                  {/* Círculo do Tom Maior (Anel Externo) */}
                  {ringColor !== 'transparent' && (
                    <circle cx={xOuter} cy={yOuter} r={18} fill={ringColor} opacity={0.3} className="animate-pulse" />
                  )}

                  <circle
                    cx={xOuter}
                    cy={yOuter}
                    r={15}
                    fill={isTonic ? '#f43f5e' : isSubdom ? '#0284c7' : isDom ? '#d97706' : '#1e1c36'}
                    stroke={ringColor !== 'transparent' ? ringColor : '#363459'}
                    strokeWidth={1.5}
                    className="transition-transform group-hover:scale-115"
                  />

                  <text
                    x={xOuter}
                    y={yOuter + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={11}
                    fontWeight="black"
                    fontFamily="Outfit, sans-serif"
                  >
                    {item.key}
                  </text>

                  {/* Nome da Relativa Menor (Anel Interno) */}
                  <text
                    x={xInner}
                    y={yInner + 3}
                    textAnchor="middle"
                    fill={isTonic ? '#f43f5e' : '#94a3b8'}
                    fontSize={9}
                    fontWeight={isTonic ? 'bold' : 'normal'}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {item.minor}
                  </text>
                </g>
              );
            })}

            {/* Centro do Círculo com Informação da Tônica */}
            <circle cx={center} cy={center} r={32} fill="#0d0c1c" stroke="#f43f5e" strokeWidth={2} />
            <text x={center} y={center - 4} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight="black" fontFamily="Outfit">
              {selectedKey}
            </text>
            <text x={center} y={center + 12} textAnchor="middle" fill="#f43f5e" fontSize={9} fontWeight="bold" fontFamily="JetBrains Mono">
              TÔNICA
            </text>
          </svg>
        </div>

        {/* Funções Harmônicas Principais da Tonalidade (I - IV - V) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Funções Harmônicas Primárias
          </span>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-300 font-bold">Grau I (Tônica - Repouso)</span>
                <div className="text-lg font-black text-white">{selectedKey} Maior</div>
              </div>
              <span className="text-xs font-mono text-slate-300">Casa</span>
            </div>

            <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-300 font-bold">Grau IV (Subdominante - Afastamento)</span>
                <div className="text-lg font-black text-white">{ivKey} Maior</div>
              </div>
              <span className="text-xs font-mono text-slate-300">1 anti-horário</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">Grau V (Dominante - Tensão Máxima)</span>
                <div className="text-lg font-black text-white">{vKey} Maior</div>
              </div>
              <span className="text-xs font-mono text-slate-300">1 horário</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">Grau vi (Relativa Menor)</span>
                <div className="text-lg font-black text-white">{selectedInfo.minor}</div>
              </div>
              <span className="text-xs font-mono text-slate-300">Anel interno</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
