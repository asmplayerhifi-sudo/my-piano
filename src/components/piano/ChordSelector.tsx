import React from 'react';
import { CHROMATIC_NOTES_SHARP, CHORD_QUALITIES, NOTE_NAMES_PT } from '../../core/musicTheory';
import type { ChordQuality } from '../../core/types';
import { Play, Music } from 'lucide-react';
import { soundEngine } from '../../core/soundEngine';

interface Props {
  selectedRoot: string;
  selectedQuality: ChordQuality;
  selectedInversion: 0 | 1 | 2;
  onSelectRoot: (root: string) => void;
  onSelectQuality: (quality: ChordQuality) => void;
  onSelectInversion: (inv: 0 | 1 | 2) => void;
  activeMidiNotes: number[];
}

export const ChordSelector: React.FC<Props> = ({
  selectedRoot,
  selectedQuality,
  selectedInversion,
  onSelectRoot,
  onSelectQuality,
  onSelectInversion,
  activeMidiNotes,
}) => {
  const handlePlayChord = () => {
    soundEngine.playChord(activeMidiNotes, 'piano', 1.8);
  };

  const handlePlayArpeggio = () => {
    soundEngine.playArpeggio(activeMidiNotes, 'piano', 75);
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 border border-white/10 space-y-4">
      {/* 1. Seletor de Tônica (12 Notas Cromáticas) */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
          1. Escolha a Nota Fundamental (Tônica)
        </label>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {CHROMATIC_NOTES_SHARP.map((note) => {
            const isSelected = selectedRoot === note;
            return (
              <button
                key={note}
                onClick={() => onSelectRoot(note)}
                className={`py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <div>{note}</div>
                <div className="text-[9px] opacity-75">{NOTE_NAMES_PT[note]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Seletor de Tipo / Qualidade do Acorde */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
          2. Tipo de Acorde (Tríades e Tétrades)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(CHORD_QUALITIES) as ChordQuality[]).map((q) => {
            const config = CHORD_QUALITIES[q];
            const isSelected = selectedQuality === q;
            return (
              <button
                key={q}
                onClick={() => onSelectQuality(q)}
                className={`px-3 py-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                }`}
              >
                <div className="font-bold font-display text-sm text-white">
                  {selectedRoot}{config.suffix}
                </div>
                <div className="text-[10px] text-indigo-300 font-medium">{config.name}</div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  [{config.degrees.join(' - ')}]
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Seletor de Inversões (Voice Leading) */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
          3. Inversão do Acorde
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 0 as const, label: 'Fundamental', desc: '1 - 3 - 5' },
            { id: 1 as const, label: '1ª Inversão', desc: '3 - 5 - 1' },
            { id: 2 as const, label: '2ª Inversão', desc: '5 - 1 - 3' },
          ].map((inv) => (
            <button
              key={inv.id}
              onClick={() => onSelectInversion(inv.id)}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedInversion === inv.id
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-white">{inv.label}</div>
              <div className="text-[10px] font-mono text-purple-300">{inv.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Botões de Ação Sonora */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handlePlayChord}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-98 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Tocar Acorde</span>
        </button>

        <button
          onClick={handlePlayArpeggio}
          className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
        >
          <Music className="w-4 h-4 text-cyan-400" />
          <span>Ouvir Arpejo</span>
        </button>
      </div>
    </div>
  );
};
