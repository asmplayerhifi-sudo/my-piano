import React, { useState, useRef, useEffect } from 'react';
import { metronomeEngine, useMetronome } from '../../core/metronomeEngine';
import { METRONOME_SOUND_OPTIONS, accompanimentSynthesizer, type MetronomeSoundType } from '../../core/accompanimentSynthesizer';
import {
  Play,
  Square,
  Minus,
  Plus,
  Volume2,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

interface MetronomeBarProps {
  initialBpm?: number;
  initialTimeSignature?: string;
  onBpmChange?: (newBpm: number) => void;
  compact?: boolean;
  className?: string;
  title?: string;
}

export const MetronomeBar: React.FC<MetronomeBarProps> = ({
  initialBpm,
  initialTimeSignature,
  onBpmChange,
  compact = false,
  className = '',
  title = 'Metrônomo Musical',
}) => {
  const metronome = useMetronome();
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Histórico de cliques para Tap Tempo
  const tapTimesRef = useRef<number[]>([]);

  // Sincroniza BPM inicial caso fornecido pelo pai (ex: partitura ou música selecionada)
  useEffect(() => {
    if (initialBpm && initialBpm > 0 && Math.abs(initialBpm - metronome.bpm) > 0.5) {
      metronomeEngine.setBpm(initialBpm);
    }
  }, [initialBpm]);

  // Sincroniza Fórmula de Compasso inicial
  useEffect(() => {
    if (initialTimeSignature && initialTimeSignature !== metronome.timeSignature) {
      metronomeEngine.setTimeSignature(initialTimeSignature);
    }
  }, [initialTimeSignature]);

  const handleToggle = () => {
    metronomeEngine.toggle({
      bpm: initialBpm,
      timeSignature: initialTimeSignature,
    });
  };

  const handleBpmChange = (newVal: number) => {
    const clamped = Math.max(30, Math.min(260, Math.round(newVal)));
    metronomeEngine.setBpm(clamped);
    onBpmChange?.(clamped);
  };

  const handleTapTempo = () => {
    accompanimentSynthesizer.playMetronomeSound(metronome.soundType, false, true, undefined, 0.6);
    const now = performance.now();
    const taps = tapTimesRef.current;

    // Se o último tap foi há mais de 2.5 segundos, reinicia a contagem
    if (taps.length > 0 && now - taps[taps.length - 1] > 2500) {
      tapTimesRef.current = [now];
      return;
    }

    taps.push(now);
    if (taps.length > 5) taps.shift();

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 150) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        handleBpmChange(calculatedBpm);
      }
    }
  };

  const beats = Array.from({ length: metronome.beatsPerMeasure }, (_, i) => i + 1);

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10 text-xs backdrop-blur-md shadow-lg ${className}`}>
        {/* Botão ON / OFF Principal */}
        <button
          onClick={handleToggle}
          title={metronome.isPlaying ? 'Desligar Metrônomo' : 'Ligar Metrônomo'}
          className={`px-3 py-1 rounded-xl font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
            metronome.isPlaying
              ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-300'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          {metronome.isPlaying ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>PARAR</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>METRÔNOMO</span>
            </>
          )}
        </button>

        {/* Indicadores Visuais de Pulso / Batidas */}
        <div className="flex items-center gap-1 px-1">
          {beats.map((b) => {
            const isCurrent = metronome.isPlaying && metronome.currentBeat === b;
            const isDown = b === 1;
            return (
              <span
                key={b}
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold transition-all duration-75 ${
                  isCurrent
                    ? isDown
                      ? 'bg-amber-400 text-slate-950 scale-125 shadow-[0_0_10px_#fbbf24]'
                      : 'bg-indigo-400 text-slate-950 scale-110 shadow-[0_0_8px_#818cf8]'
                    : 'bg-white/10 text-slate-500'
                }`}
              >
                {b}
              </span>
            );
          })}
        </div>

        {/* Ajuste de Andamento (BPM) */}
        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-xl border border-white/5">
          <button
            onClick={() => handleBpmChange(metronome.bpm - 5)}
            className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
            title="Diminuir 5 BPM"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-mono font-bold text-white text-xs w-12 text-center">
            {metronome.bpm} <span className="text-[9px] text-slate-400">BPM</span>
          </span>
          <button
            onClick={() => handleBpmChange(metronome.bpm + 5)}
            className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
            title="Aumentar 5 BPM"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Fórmulas de Compasso */}
        <select
          value={metronome.timeSignature}
          onChange={(e) => metronomeEngine.setTimeSignature(e.target.value)}
          className="bg-black/60 text-slate-300 text-[10px] font-mono font-bold border border-white/10 rounded-lg px-2 py-1 cursor-pointer outline-none"
          title="Fórmula de Compasso"
        >
          <option value="2/4">2/4</option>
          <option value="3/4">3/4</option>
          <option value="4/4">4/4</option>
          <option value="6/8">6/8</option>
        </select>

        {/* Toggle Ajustes Extras */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            showSettings
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Configurações de Timbre e Volume"
        >
          <SlidersHorizontal className="w-3 h-3" />
        </button>

        {showSettings && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10 animate-fade-in">
            <select
              value={metronome.soundType}
              onChange={(e) => metronomeEngine.setSoundType(e.target.value as MetronomeSoundType)}
              className="bg-black/60 text-amber-300 text-[10px] font-mono border border-white/10 rounded-lg px-1.5 py-0.5 cursor-pointer outline-none"
              title="Timbre Sonoro"
            >
              {METRONOME_SOUND_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            <input
              type="range"
              min="0"
              max="100"
              value={metronome.volume}
              onChange={(e) => metronomeEngine.setVolume(parseInt(e.target.value, 10))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              title={`Volume do Metrônomo: ${metronome.volume}%`}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3.5 shadow-xl ${className}`}>
      {/* Linha Superior: Título, Status e Botão ON / OFF Principal */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            metronome.isPlaying
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
              : 'bg-white/5 text-slate-400 border border-white/10'
          }`}>
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              {title}
            </span>
            <span className="text-[10px] text-slate-400">
              {metronome.isPlaying ? 'Metrônomo Ativo e Soando' : 'Clique para Iniciar a Pulsação'}
            </span>
          </div>
        </div>

        {/* Botão Principal de Ativação / Desativação */}
        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
            metronome.isPlaying
              ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-amber-300'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
          }`}
        >
          {metronome.isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>PARAR METRÔNOMO</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>LIGAR METRÔNOMO</span>
            </>
          )}
        </button>
      </div>

      {/* Linha Central: Display de LEDs de Batida + Controle de Andamento */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Indicador Visual Rítmico de Batidas (Compasso) */}
        <div className="sm:col-span-4 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-around">
          {beats.map((b) => {
            const isCurrent = metronome.isPlaying && metronome.currentBeat === b;
            const isDown = b === 1;
            return (
              <div key={b} className="flex flex-col items-center gap-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-75 ${
                    isCurrent
                      ? isDown
                        ? 'bg-amber-400 text-slate-950 scale-125 shadow-[0_0_14px_#fbbf24] ring-2 ring-white'
                        : 'bg-indigo-400 text-slate-950 scale-115 shadow-[0_0_10px_#818cf8]'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {b}
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {isDown ? 'Forte' : 'Fraco'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Controles de BPM com Steppers e Tap Tempo */}
        <div className="sm:col-span-8 flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleBpmChange(metronome.bpm - 5)}
              className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold border border-white/5 cursor-pointer"
              title="Menos 5 BPM"
            >
              -5
            </button>
            <button
              onClick={() => handleBpmChange(metronome.bpm - 1)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 cursor-pointer"
              title="Menos 1 BPM"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="text-center px-2">
              <span className="text-xl font-black font-mono text-white block leading-none">
                {metronome.bpm}
              </span>
              <span className="text-[9px] font-mono text-amber-300 uppercase">
                BPM
              </span>
            </div>

            <button
              onClick={() => handleBpmChange(metronome.bpm + 1)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 cursor-pointer"
              title="Mais 1 BPM"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleBpmChange(metronome.bpm + 5)}
              className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold border border-white/5 cursor-pointer"
              title="Mais 5 BPM"
            >
              +5
            </button>
          </div>

          {/* Slider de BPM */}
          <div className="flex-1 min-w-[120px] px-2">
            <input
              type="range"
              min="30"
              max="240"
              value={metronome.bpm}
              onChange={(e) => handleBpmChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              title={`Andamento: ${metronome.bpm} BPM`}
            />
          </div>

          {/* Tap Tempo */}
          <button
            onClick={handleTapTempo}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 font-mono text-xs font-bold transition-all cursor-pointer"
            title="Toque repetidamente no ritmo desejado para calcular o BPM automaticamente"
          >
            TAP TEMPO
          </button>
        </div>
      </div>

      {/* Linha Inferior: Fórmula de Compasso, Timbre do Clique e Volume */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Compasso:</span>
          {(['2/4', '3/4', '4/4', '6/8'] as const).map((ts) => (
            <button
              key={ts}
              onClick={() => metronomeEngine.setTimeSignature(ts)}
              className={`px-2 py-0.5 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                metronome.timeSignature === ts
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {ts}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Timbre:</span>
            <select
              value={metronome.soundType}
              onChange={(e) => metronomeEngine.setSoundType(e.target.value as MetronomeSoundType)}
              className="bg-black/60 text-slate-200 text-xs font-mono border border-white/10 rounded-lg px-2 py-0.5 cursor-pointer outline-none"
            >
              {METRONOME_SOUND_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={metronome.volume}
              onChange={(e) => metronomeEngine.setVolume(parseInt(e.target.value, 10))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              title={`Volume do Metrônomo: ${metronome.volume}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
