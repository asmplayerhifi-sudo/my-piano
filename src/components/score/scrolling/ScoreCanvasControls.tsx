/**
 * scrolling/ScoreCanvasControls.tsx
 * Barra de ferramentas compacta para controle de reprodução, andamento e visualização.
 * Regra: Componente visual limpo (< 180 linhas).
 */

import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sun, Moon, Radio } from 'lucide-react';
import type { DisplayOptions, ScoreTheme } from './types';

interface ScoreControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  tempo: number;
  onTempoChange: (newTempo: number) => void;
  theme: ScoreTheme;
  onToggleTheme: () => void;
  enableAudio: boolean;
  onToggleAudio: () => void;
  showAudioToggle?: boolean;
  enableMetronome: boolean;
  onToggleMetronome: () => void;
  displayOptions: DisplayOptions;
  onToggleOption: (key: keyof DisplayOptions) => void;
  score: number;
  feedback: { text: string; color: string } | null;
}

export const ScoreCanvasControls: React.FC<ScoreControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  tempo,
  onTempoChange,
  theme,
  onToggleTheme,
  enableAudio,
  onToggleAudio,
  showAudioToggle = true,
  enableMetronome,
  onToggleMetronome,
  displayOptions,
  onToggleOption,
  score,
  feedback,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-white/10 text-white select-none">
      {/* 1. Controles Principais de Playback */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Pausar' : 'Tocar'}</span>
        </button>

        <button
          onClick={onRestart}
          title="Reiniciar partitura"
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Andamento (BPM) */}
        <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs">
          <span className="text-slate-400 text-[10px] font-mono">BPM:</span>
          <button
            onClick={() => onTempoChange(tempo - 5)}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 font-bold"
          >
            -
          </button>
          <span className="font-mono font-bold text-amber-400 w-7 text-center">{tempo}</span>
          <button
            onClick={() => onTempoChange(tempo + 5)}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* 2. Feedback Rítmico em Tempo Real */}
      <div className="flex items-center gap-3">
        {feedback && (
          <span className={`text-xs font-black animate-pulse px-2 py-0.5 rounded bg-white/5 ${feedback.color}`}>
            {feedback.text}
          </span>
        )}
        <div className="text-[11px] font-mono text-slate-400">
          Pontos: <strong className="text-white">{score}</strong>
        </div>
      </div>

      {/* 3. Toggles de Áudio, Metrônomo, Tema e Exibição */}
      <div className="flex items-center gap-2">
        {/* Áudio do Instrumento / Notas da Partitura */}
        {showAudioToggle && (
          <button
            onClick={onToggleAudio}
            title={enableAudio ? 'Áudio do instrumento ativo (Clique para silenciar)' : 'Áudio do instrumento mudo (Clique para ativar)'}
            className={`px-2 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
              enableAudio
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
            }`}
          >
            {enableAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[10px] font-bold">Áudio</span>
          </button>
        )}

        {/* Metrônomo Sonoro */}
        <button
          onClick={onToggleMetronome}
          title={enableMetronome ? 'Metrônomo ligado' : 'Metrônomo desligado'}
          className={`px-2 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
            enableMetronome
              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
              : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[10px] font-bold">Metrônomo</span>
        </button>

        {/* Tema Claro / Noturno */}
        <button
          onClick={onToggleTheme}
          title={`Alternar para tema ${theme === 'traditional' ? 'noturno' : 'tradicional'}`}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-all cursor-pointer"
        >
          {theme === 'traditional' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        {/* Opções Didáticas Rápidas */}
        <div className="hidden sm:flex items-center gap-1 text-[10px]">
          <button
            onClick={() => onToggleOption('showNoteNames')}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              displayOptions.showNoteNames ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
            }`}
          >
            Notas
          </button>
          <button
            onClick={() => onToggleOption('showFingering')}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              displayOptions.showFingering ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-500'
            }`}
          >
            Dedos
          </button>
          <button
            onClick={() => onToggleOption('showChords')}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              displayOptions.showChords ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-500'
            }`}
          >
            Acordes
          </button>
        </div>
      </div>
    </div>
  );
};
