import React, { useEffect } from 'react';
import { Play, Square, Minus, Plus, EyeOff, Zap, Music } from 'lucide-react';
import {
  useAccompaniment,
  accompanimentStore,
  type MetronomeSubdivision,
} from '../../core/accompanimentStore';
import { soundEngine } from '../../core/soundEngine';
import { accompanimentSynthesizer } from '../../core/accompanimentSynthesizer';
import type { TimeSignature } from '../../core/types';

interface Props {
  onBpmChange?: (bpm: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onOpenStudio?: () => void;
}

export const MetronomeView: React.FC<Props> = ({ onBpmChange, onPlayStateChange, onOpenStudio }) => {
  const accState = useAccompaniment();

  // Notifica componentes pai quando o estado muda
  useEffect(() => {
    if (onBpmChange) onBpmChange(accState.bpm);
  }, [accState.bpm, onBpmChange]);

  useEffect(() => {
    if (onPlayStateChange) onPlayStateChange(accState.isPlaying);
  }, [accState.isPlaying, onPlayStateChange]);

  const handleTogglePlay = async () => {
    await soundEngine.ensureAudioReady();
    accompanimentStore.toggle();
  };

  const handleTapTempo = async () => {
    await soundEngine.ensureAudioReady();
    accompanimentStore.tapTempo();
    accompanimentSynthesizer.playMetronomeSound('digital', false, true, undefined, 0.5);
  };

  const updateBpm = (newBpm: number) => {
    accompanimentStore.setBpm(newBpm);
  };

  const handleOpenStudio = () => {
    if (onOpenStudio) {
      onOpenStudio();
    } else {
      if (window.location.hash !== '#/rhythm') {
        window.location.hash = '#/rhythm';
      }
      window.dispatchEvent(new CustomEvent('nav-rhythm-mode', { detail: 'studio' }));
    }
  };

  const handleTimeSignature = (ts: TimeSignature) => {
    accompanimentStore.setTimeSignature(ts);
  };

  const beatsCount = accompanimentStore.getBeatsPerMeasure();

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col justify-between space-y-6">
      {/* Top: BPM Dial & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
              {accompanimentStore.getTempoTerm()} • {accState.timeSignature}
            </span>
            {accState.accompanimentEnabled && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                Banda Ativa
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
              {accState.bpm}
            </span>
            <span className="text-xs text-slate-400 font-mono">BPM</span>
          </div>
        </div>

        {/* Tap Tempo & Botão de Abrir Estúdio Completo de Acompanhamento */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTapTempo}
            className="px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-500/10"
          >
            <Zap className="w-3.5 h-3.5 inline mr-1 fill-current" />
            <span>Tap Tempo</span>
          </button>

          <button
            onClick={handleOpenStudio}
            className="px-3.5 py-2 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
            title="Abrir Estúdio Completo com Bateria, Baixo e Harmonia"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Estúdio &amp; Banda</span>
          </button>
        </div>
      </div>

      {/* Visual Beat Indicator Dots com Destaque para Forte e Fracos */}
      <div>
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {Array.from({ length: beatsCount }).map((_, idx) => {
            const beatNum = idx + 1;
            const isCurrent = accState.currentBeat === beatNum && accState.isPlaying;
            const isFirst = beatNum === 1;

            let ledClass = 'bg-white/5 border border-white/10 text-slate-500';
            if (isCurrent) {
              if (isFirst) {
                ledClass = accState.muteDownbeat
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 opacity-60'
                  : 'bg-amber-400 text-slate-950 font-black scale-110 shadow-lg shadow-amber-400/50 ring-2 ring-amber-300';
              } else {
                ledClass = accState.muteUpbeats
                  ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 opacity-60'
                  : 'bg-indigo-500 text-white font-black scale-105 shadow-md shadow-indigo-500/40 ring-1 ring-indigo-300';
              }
            }

            return (
              <div
                key={idx}
                className={`flex-1 h-12 max-w-[70px] rounded-2xl flex flex-col items-center justify-center transition-all duration-75 ${ledClass}`}
              >
                <span className="font-display text-lg font-bold">{beatNum}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-80">
                  {isFirst ? 'Forte' : 'Fraco'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status de Metrônomo Oculto */}
        {accState.hiddenMode && (
          <div className="mt-2 text-center">
            <span
              className={`text-[11px] font-mono font-bold ${
                accState.isAudibleMeasure ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
              }`}
            >
              {accState.isAudibleMeasure ? '🔊 Compasso Sonoro' : '🤫 Compasso Oculto (Mantenha o Pulso!)'}
            </span>
          </div>
        )}
      </div>

      {/* BPM Controls: Slider + Increment Buttons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => updateBpm(accState.bpm - 5)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
            title="-5 BPM"
          >
            -5
          </button>
          <button
            onClick={() => updateBpm(accState.bpm - 1)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95"
            title="-1 BPM"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="range"
            min="30"
            max="260"
            value={accState.bpm}
            onChange={(e) => updateBpm(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <button
            onClick={() => updateBpm(accState.bpm + 1)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95"
            title="+1 BPM"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateBpm(accState.bpm + 5)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
            title="+5 BPM"
          >
            +5
          </button>
        </div>

        {/* Fórmulas de Compasso Rápidas */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            {(['2/4', '3/4', '4/4', '6/8'] as TimeSignature[]).map((ts) => (
              <button
                key={ts}
                onClick={() => handleTimeSignature(ts)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  accState.timeSignature === ts
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ts}
              </button>
            ))}
          </div>

          {/* Subdivisões Rápidas */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 text-[11px] font-mono font-bold">
            {(
              [
                { id: 'quarter', label: '1/4' },
                { id: 'eighth', label: '1/8' },
                { id: 'sixteenth', label: '1/16' },
                { id: 'triplet', label: '1/8T' },
              ] as { id: MetronomeSubdivision; label: string }[]
            ).map((sub) => (
              <button
                key={sub.id}
                onClick={() => accompanimentStore.setSubdivision(sub.id)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  accState.subdivision === sub.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matriz de Mute Independente Forte / Fracos */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <button
            onClick={() => accompanimentStore.toggleMuteDownbeat()}
            className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
              accState.muteDownbeat
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Muta apenas o clique do tempo 1"
          >
            <span>{accState.muteDownbeat ? '🔇 Forte Muto' : '🔔 Forte 1'}</span>
          </button>

          <button
            onClick={() => accompanimentStore.toggleMuteUpbeats()}
            className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
              accState.muteUpbeats
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Muta apenas os cliques dos tempos fracos (2, 3, 4)"
          >
            <span>{accState.muteUpbeats ? '🔇 Fracos Mutos' : '🔔 Fracos'}</span>
          </button>

          <button
            onClick={() => accompanimentStore.toggleHiddenMode()}
            className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
              accState.hiddenMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Modo Oculto: 2 compassos sonoros, 2 mudos"
          >
            <EyeOff className="w-3.5 h-3.5 inline mr-1" />
            <span>Oculto</span>
          </button>
        </div>

        {/* Start / Stop Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-full py-4 rounded-2xl font-black font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer select-none active:scale-98 ${
            accState.isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/30'
          }`}
        >
          {accState.isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Pausar Metrônomo</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar Metrônomo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
