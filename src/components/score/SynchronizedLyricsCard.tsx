/**
 * SynchronizedLyricsCard.tsx
 *
 * Card de Letras Sincronizadas no Repertório (Karaokê / Teleprompter Pedagógico).
 * Posicionado estritamente entre a Partitura e o Teclado Virtual sem sobrepor nenhum dos dois.
 *
 * Características:
 * - Painel compacto e responsivo com glassmorphism e bordas discretas;
 * - Totalmente sincronizado com a partitura e reprodução em tempo real;
 * - Suporte a modo Reprodução contínuo e Modo Prática / Espera (Wait Mode);
 * - Destaque visual da linha ativa, palavras/sílabas e linhas de contexto;
 * - Badges discretos para título, artista, seção musical e compasso;
 * - Botão discreto para ocultar/minimizar o card;
 * - Estado vazio elegante para obras instrumentais.
 */

import React, { useRef, useEffect } from 'react';
import type { LyricLine, SongSection } from '../../core/repertoireTypes';
import { useLyricsSync } from './useLyricsSync';
import {
  Mic2,
  ChevronUp,
  Pause,
  Target,
  Music,
} from 'lucide-react';

export interface SynchronizedLyricsCardProps {
  /** Linhas de letra sincronizadas */
  lyrics?: LyricLine[];
  /** Seções musicais da obra */
  sections?: SongSection[];
  /** Beat absoluto atual da música (1-indexed) */
  currentBeat: number;
  /** Compasso musical atual (1-indexed) */
  currentMeasure: number;
  /** Se o áudio está em reprodução ativa */
  isPlaying: boolean;
  /** Se está no modo de prática por espera (Wait Mode) */
  isWaitMode: boolean;
  /** Título da obra musical */
  songTitle: string;
  /** Compositor ou artista */
  artist?: string;
  /** Callback para ocultar o card de letras */
  onClose?: () => void;
}

export const SynchronizedLyricsCard: React.FC<SynchronizedLyricsCardProps> = ({
  lyrics,
  sections,
  currentBeat,
  currentMeasure,
  isPlaying,
  isWaitMode,
  songTitle,
  artist,
  onClose,
}) => {
  const syncState = useLyricsSync({
    lyrics,
    sections,
    currentBeat,
    currentMeasure,
    isPlaying,
    isWaitMode,
  });

  const activeLineContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll suave para manter a linha ativa sempre no centro focal sem travar o thread de áudio
  useEffect(() => {
    if (activeLineContainerRef.current) {
      activeLineContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [syncState.activeLineIndex, syncState.isIntro]);

  // Se a obra for puramente instrumental (sem letra estruturada)
  if (!syncState.hasLyrics) {
    return (
      <div
        className="w-full rounded-2xl bg-[#0a0f1d]/85 backdrop-blur-md border border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 shadow-md animate-in fade-in duration-200"
        role="region"
        aria-label="Informação de letra instrumental"
      >
        <div className="flex items-center gap-2">
          <Music className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="font-mono text-[11px] text-slate-300">
            Obra Instrumental • Sem letra cadastrada para esta obra
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Ocultar painel"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Estilo contextual da Seção Musical
  const getSectionBadgeClass = () => {
    const type = syncState.activeLine?.lineType;
    if (type === 'chorus') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
    if (type === 'bridge' || type === 'intro' || syncState.isIntro) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    }
    if (type === 'outro') {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
    return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  };

  return (
    <section
      className="w-full rounded-2xl bg-[#0a0f1e]/90 backdrop-blur-md border border-purple-500/25 shadow-xl p-2.5 sm:p-3 space-y-2 relative overflow-hidden transition-all duration-300"
      aria-label="Card de Letras Sincronizadas e Karaokê Pedagógico"
    >
      {/* ─── Linha Superior: Metadados, Seção e Status ─────────────────────── */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5 text-[11px]">
        {/* Lado Esquerdo: Tag de Karaokê + Seção Musical + Título */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 shrink-0">
            <Mic2 className="w-3 h-3 text-purple-400" />
            <span className="hidden xs:inline">Letra</span>
          </span>

          {syncState.sectionLabel && (
            <span
              className={`px-2 py-0.5 rounded-lg border font-mono font-semibold text-[10px] tracking-wide shrink-0 ${getSectionBadgeClass()}`}
            >
              [{syncState.sectionLabel}]
            </span>
          )}

          <div className="hidden sm:flex items-center gap-1.5 truncate text-slate-400 font-mono text-[11px]">
            <span className="text-white font-medium truncate">{songTitle}</span>
            {artist && (
              <>
                <span>•</span>
                <span className="text-slate-400 truncate">{artist}</span>
              </>
            )}
          </div>
        </div>

        {/* Lado Direito: Status de Execução + Compasso + Botão Ocultar */}
        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
          {/* Status Contextual */}
          {isWaitMode ? (
            <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1 animate-pulse">
              <Target className="w-3 h-3 text-sky-400" />
              <span>Aguardando Nota</span>
            </span>
          ) : isPlaying ? (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Ao Vivo</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 flex items-center gap-1">
              <Pause className="w-3 h-3 text-amber-400" />
              <span>Pausado</span>
            </span>
          )}

          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-bold">
            Comp. {currentMeasure}
          </span>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Ocultar Letra Sincronizada"
              aria-label="Ocultar Letra"
            >
              <ChevronUp className="w-3 h-3" />
              <span className="hidden md:inline text-[9px] uppercase tracking-wider font-bold">
                Ocultar
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Área Central de Leitura: Teleprompter de 3 Linhas ─────────────── */}
      <div className="flex flex-col items-center justify-center text-center py-1 sm:py-1.5 space-y-1 relative min-h-[58px] sm:min-h-[68px]">
        {/* Linha Anterior (Contexto Faded) */}
        <div className="h-4 flex items-center justify-center overflow-hidden w-full px-2">
          {syncState.previousLine ? (
            <p className="text-[11px] sm:text-xs text-slate-500/70 font-display font-medium truncate select-none transition-opacity duration-300">
              {syncState.previousLine.text}
            </p>
          ) : (
            <div className="h-1 w-8 rounded-full bg-white/5" />
          )}
        </div>

        {/* Linha Ativa (Foco Máximo / Karaoke / Palavras) */}
        <div
          ref={activeLineContainerRef}
          className="w-full px-2 py-0.5 flex flex-col items-center justify-center"
        >
          {syncState.isIntro ? (
            <p className="text-xs sm:text-sm md:text-base font-display font-semibold italic text-cyan-300/90 tracking-wide drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-pulse">
              ♫ [Introdução Instrumental — Prepare-se para cantar/tocar] ♫
            </p>
          ) : syncState.activeLine ? (
            <div className="text-sm sm:text-base md:text-lg font-display font-bold tracking-wide select-none leading-tight">
              {syncState.activeLine.words && syncState.activeLine.words.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
                  {syncState.activeLine.words.map((w, wIdx) => {
                    const isWordActive = wIdx === syncState.activeWordIndex;
                    const isWordPast = syncState.activeWordIndex > wIdx;

                    return (
                      <span
                        key={`${wIdx}-${w.text}`}
                        className={`transition-all duration-150 ${
                          isWordActive
                            ? 'text-amber-300 scale-105 font-black drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                            : isWordPast
                            ? 'text-white/95 font-bold'
                            : 'text-slate-400/80 font-medium'
                        }`}
                      >
                        {w.text}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]">
                  {syncState.activeLine.text}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">♫ [Instrumental] ♫</p>
          )}

          {/* Micro Barra de Progresso da Linha Ativa */}
          {syncState.activeLine && !syncState.isIntro && (
            <div className="w-32 sm:w-48 h-0.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-cyan-400 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${Math.round(syncState.lineProgress * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Próxima Linha (Antecipação Faded) */}
        <div className="h-4 flex items-center justify-center overflow-hidden w-full px-2">
          {syncState.nextLine ? (
            <p className="text-[11px] sm:text-xs text-slate-500/70 font-display font-medium truncate select-none transition-opacity duration-300">
              {syncState.nextLine.text}
            </p>
          ) : (
            <div className="h-1 w-8 rounded-full bg-white/5" />
          )}
        </div>
      </div>
    </section>
  );
};
