import React from 'react';
import { BookOpen, Headphones, Info } from 'lucide-react';

export interface CourseStatusBarProps {
  pedagogicalTip?: string;
  isTipOpen?: boolean;
  onToggleTip?: () => void;
  audioRecognitionActive?: boolean;
  hearingNoteName?: string | null;
  midiConnected?: boolean;
  statusText?: string;
}

export const CourseStatusBar: React.FC<CourseStatusBarProps> = ({
  pedagogicalTip,
  isTipOpen,
  onToggleTip,
  audioRecognitionActive = true,
  hearingNoteName,
  midiConnected = false,
  statusText = 'Pronto',
}) => {
  return (
    <div
      className="w-full h-[28px] sm:h-[30px] px-3 sm:px-4 flex items-center justify-between gap-2 bg-[#06060e] border-t border-white/5 text-[10px] sm:text-[11px] text-slate-400 select-none"
      role="status"
      aria-label="Barra de status da aula"
    >
      {/* 1. Dicas de Posição & Execução (Esquerda) */}
      <div className="flex items-center gap-2 min-w-0">
        {pedagogicalTip ? (
          <button
            onClick={onToggleTip}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all cursor-pointer truncate ${
              isTipOpen
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                : 'hover:text-white hover:bg-white/5'
            }`}
            title="Clique para alternar detalhes da orientação pedagógica"
          >
            <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              📘 Dicas: {pedagogicalTip}
            </span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-slate-500">
            <Info className="w-3 h-3" />
            <span>Mantenha as mãos relaxadas e coluna ereta</span>
          </span>
        )}
      </div>

      {/* 2. Reconhecimento de Áudio & Afinação Acústica (Centro) */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 font-mono text-[10px]">
          <Headphones className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline text-slate-400">Reconhecimento de Áudio:</span>
          {hearingNoteName ? (
            <span className="text-emerald-300 font-bold animate-pulse">
              Ouvindo {hearingNoteName}
            </span>
          ) : audioRecognitionActive ? (
            <span className="text-emerald-400">Ativo</span>
          ) : (
            <span className="text-slate-500">Aguardando</span>
          )}
        </div>
      </div>

      {/* 3. Status Geral & MIDI (Direita) */}
      <div className="flex items-center gap-2 shrink-0">
        {midiConnected && (
          <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[9px]">
            🎹 MIDI Conectado
          </span>
        )}
        <span className="flex items-center gap-1 text-slate-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span>[Status: {statusText}]</span>
        </span>
      </div>
    </div>
  );
};
