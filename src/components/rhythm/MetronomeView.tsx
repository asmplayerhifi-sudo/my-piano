import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Minus, Plus, EyeOff, Gauge, Zap } from 'lucide-react';
import { metronomeScheduler } from '../../core/metronomeScheduler';
import type { BeatEvent } from '../../core/metronomeScheduler';
import type { TimeSignature } from '../../core/types';

interface Props {
  onBpmChange?: (bpm: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const MetronomeView: React.FC<Props> = ({ onBpmChange, onPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(metronomeScheduler.getIsPlaying());
  const [bpm, setBpm] = useState<number>(metronomeScheduler.getBpm());
  const [timeSignature, setTimeSignature] = useState<TimeSignature>(metronomeScheduler.getTimeSignature());
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [isAudible, setIsAudible] = useState<boolean>(true);
  const [isHiddenMode, setIsHiddenMode] = useState<boolean>(metronomeScheduler.isHiddenModeActive());
  const [isAdaptiveMode, setIsAdaptiveMode] = useState<boolean>(false);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  // Escuta batidas do scheduler
  useEffect(() => {
    const unsubscribe = metronomeScheduler.subscribe((event: BeatEvent) => {
      setCurrentBeat(event.beatNumber);
      setIsAudible(event.isAudible);
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      metronomeScheduler.stop();
      setIsPlaying(false);
      setCurrentBeat(0);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      metronomeScheduler.start();
      setIsPlaying(true);
      if (onPlayStateChange) onPlayStateChange(true);
    }
  };

  const updateBpm = (newBpm: number) => {
    const clamped = Math.max(30, Math.min(240, newBpm));
    setBpm(clamped);
    metronomeScheduler.setBpm(clamped);
    if (onBpmChange) onBpmChange(clamped);
  };

  const handleTimeSignature = (ts: TimeSignature) => {
    setTimeSignature(ts);
    metronomeScheduler.setTimeSignature(ts);
    setCurrentBeat(0);
  };

  const handleToggleHidden = () => {
    const next = !isHiddenMode;
    setIsHiddenMode(next);
    metronomeScheduler.setHiddenMode(next);
  };

  const handleTapTempo = () => {
    const now = performance.now();
    const taps = [...tapTimesRef.current, now].slice(-4);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      updateBpm(calculatedBpm);
    }
  };

  const beatsCount = metronomeScheduler.getBeatsPerMeasure();

  // Termos clássicos de andamento
  const getTempoTerm = (b: number) => {
    if (b < 40) return 'Grave';
    if (b < 60) return 'Largo';
    if (b < 66) return 'Larghetto';
    if (b < 76) return 'Adagio';
    if (b < 108) return 'Andante';
    if (b < 120) return 'Moderato';
    if (b < 168) return 'Allegro';
    if (b < 200) return 'Vivace';
    return 'Presto';
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col justify-between">
      {/* Top: BPM Dial & Info */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
            {getTempoTerm(bpm)}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
              {bpm}
            </span>
            <span className="text-xs text-slate-400 font-mono">BPM</span>
          </div>
        </div>

        {/* Tap Tempo & Compasso */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTapTempo}
            className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
            <span>Tap Tempo</span>
          </button>

          {/* Time Signature Buttons */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            {(['2/4', '3/4', '4/4', '6/8'] as TimeSignature[]).map((ts) => (
              <button
                key={ts}
                onClick={() => handleTimeSignature(ts)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeSignature === ts
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ts}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Beat Indicator Dots */}
      <div className="my-6">
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: beatsCount }).map((_, idx) => {
            const beatNum = idx + 1;
            const isCurrent = currentBeat === beatNum;
            const isFirst = beatNum === 1;

            return (
              <div
                key={idx}
                className={`flex-1 h-12 max-w-[70px] rounded-2xl flex flex-col items-center justify-center transition-all duration-75 ${
                  isCurrent
                    ? isFirst
                      ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow-lg shadow-amber-400/50'
                      : 'bg-indigo-500 text-white font-black scale-105 shadow-md shadow-indigo-500/40'
                    : 'bg-white/5 border border-white/10 text-slate-500 font-bold'
                } ${!isAudible && isCurrent ? 'opacity-40' : 'opacity-100'}`}
              >
                <span className="font-display text-lg">{beatNum}</span>
                {isFirst && <span className="text-[8px] uppercase tracking-tighter">Forte</span>}
              </div>
            );
          })}
        </div>

        {/* Status de Metrônomo Oculto */}
        {isHiddenMode && (
          <div className="mt-2 text-center">
            <span
              className={`text-[11px] font-mono font-bold ${
                isAudible ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
              }`}
            >
              {isAudible ? '🔊 Compasso Sonoro' : '🤫 Compasso Oculto (Mantenha o Pulso!)'}
            </span>
          </div>
        )}
      </div>

      {/* BPM Controls: Slider + Increment Buttons */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateBpm(bpm - 5)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
            title="-5 BPM"
          >
            -5
          </button>
          <button
            onClick={() => updateBpm(bpm - 1)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95"
            title="-1 BPM"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="range"
            min="30"
            max="240"
            value={bpm}
            onChange={(e) => updateBpm(parseInt(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <button
            onClick={() => updateBpm(bpm + 1)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95"
            title="+1 BPM"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateBpm(bpm + 5)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
            title="+5 BPM"
          >
            +5
          </button>
        </div>

        {/* Feature Toggles (Oculto & Adaptativo) */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleToggleHidden}
            className={`px-3 py-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isHiddenMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>Modo Oculto</span>
          </button>

          <button
            onClick={() => setIsAdaptiveMode(!isAdaptiveMode)}
            className={`px-3 py-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isAdaptiveMode
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>BPM Adaptativo</span>
          </button>
        </div>

        {/* Start / Stop Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-full py-4 rounded-2xl font-black font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer select-none active:scale-98 ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/30'
          }`}
        >
          {isPlaying ? (
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
