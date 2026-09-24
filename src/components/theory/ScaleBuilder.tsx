import React, { useState } from 'react';
import { MAJOR_SCALES_DATA, CHROMATIC_NOTES_SHARP } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { Play } from 'lucide-react';

export const ScaleBuilder: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [isPlayingScale, setIsPlayingScale] = useState<boolean>(false);

  const scaleData = MAJOR_SCALES_DATA[selectedKey] || MAJOR_SCALES_DATA['C'];

  // Graus e funções na escala maior
  const degreesInfo = [
    { degree: 'I', function: 'Tônica' },
    { degree: 'ii', function: 'Sobretônica (m)' },
    { degree: 'iii', function: 'Mediante (m)' },
    { degree: 'IV', function: 'Subdominante' },
    { degree: 'V', function: 'Dominante' },
    { degree: 'vi', function: 'Relativa Menor' },
    { degree: 'vii°', function: 'Sensível (dim)' },
  ];

  // Toca a escala completa em sequência
  const handlePlayScale = () => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);

    const rootIdx = CHROMATIC_NOTES_SHARP.indexOf(scaleData.notes[0]);
    const baseMidi = 60 + (rootIdx >= 0 ? rootIdx : 0);

    // Intervalos da maior: [0, 2, 4, 5, 7, 9, 11, 12]
    const majorIntervals = [0, 2, 4, 5, 7, 9, 11, 12];
    const notesToPlay = majorIntervals.map(interval => baseMidi + interval);

    notesToPlay.forEach((midi, idx) => {
      setTimeout(() => {
        soundEngine.playPianoNote(midi, 0.7);
        if (idx === notesToPlay.length - 1) {
          setIsPlayingScale(false);
        }
      }, idx * 280);
    });
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Construtor da Escala Maior (Fórmula T - T - ST - T - T - T - ST)
          </h3>
          <p className="text-xs text-slate-400">
            Selecione a tônica para calcular os acidentes rigorosos e ouvir a sonoridade.
          </p>
        </div>

        <button
          onClick={handlePlayScale}
          disabled={isPlayingScale}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isPlayingScale ? 'Reproduzindo...' : 'Ouvir Escala'}</span>
        </button>
      </div>

      {/* Seletor de Tonalidades */}
      <div className="flex flex-wrap gap-1.5">
        {Object.keys(MAJOR_SCALES_DATA).map((k) => (
          <button
            key={k}
            onClick={() => setSelectedKey(k)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              selectedKey === k
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Display das 7 Notas com Graus Harmônicos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {scaleData.notes.map((note, idx) => {
          const deg = degreesInfo[idx];
          const isTonic = idx === 0;

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isTonic
                  ? 'bg-rose-500/20 border-rose-500/50 text-white'
                  : 'bg-white/5 border-white/5 text-slate-300'
              }`}
            >
              <div className="text-[10px] font-mono text-indigo-400 font-bold">{deg.degree}</div>
              <div className="text-xl font-black font-display my-1">{note}</div>
              <div className="text-[10px] text-slate-400">{deg.function}</div>
            </div>
          );
        })}
      </div>

      {/* Resumo da Armadura e Relativa Menor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Armadura de Clave
          </span>
          <div className="font-bold text-white text-sm">
            {scaleData.accidentalsSummary}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Relativa Menor
          </span>
          <div className="font-bold text-cyan-300 text-sm">
            {scaleData.relativeMinor} (mesmas notas e armadura)
          </div>
        </div>
      </div>
    </div>
  );
};
