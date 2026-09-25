import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Minus,
  Plus,
  Zap,
  Music,
  Radio,
  Sliders,
  Sparkles,
  EyeOff,
  Disc3,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  useAccompaniment,
  accompanimentStore,
  type MetronomeSubdivision,
} from '../../core/accompanimentStore';
import {
  ACCOMPANIMENT_STYLES,
} from '../../core/accompanimentStyles';
import {
  PROGRESSIONS,
  TONALITY_ROOTS,
} from '../../core/harmonicProgressions';
import type { TimeSignature } from '../../core/types';
import type { MetronomeSoundType } from '../../core/accompanimentSynthesizer';
import { soundEngine } from '../../core/soundEngine';

export type StudioTabType = 'metronome' | 'accompaniment' | 'mixer';

interface Props {
  initialTab?: StudioTabType;
  onNavigateToRadar?: () => void;
  onNavigateToScore?: () => void;
  className?: string;
}

export const MetronomeAccompanimentStudio: React.FC<Props> = ({
  initialTab = 'metronome',
  onNavigateToRadar,
  onNavigateToScore,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<StudioTabType>(initialTab);
  const accState = useAccompaniment();

  // Suporte a atalho de teclado global (Espaço para Iniciar/Pausar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        soundEngine.ensureAudioReady();
        accompanimentStore.toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const beatsCount = accompanimentStore.getBeatsPerMeasure();
  const currentChords = accompanimentStore.getCurrentChordsList();
  const currentChord = currentChords[accState.currentChordIndex] || currentChords[0];
  const activeStyle =
    ACCOMPANIMENT_STYLES.find((s) => s.id === accState.styleId) || ACCOMPANIMENT_STYLES[0];

  const handleTogglePlay = async () => {
    await soundEngine.ensureAudioReady();
    accompanimentStore.toggle();
  };

  const handleTapTempo = async () => {
    await soundEngine.ensureAudioReady();
    accompanimentStore.tapTempo();
  };

  return (
    <div
      className={`w-full glass-card rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-[#0d121f] to-[#080b13] shadow-2xl overflow-hidden flex flex-col ${className}`}
    >
      {/* 1. Header do Estúdio (Direto na Tela, Sem Backdrop/Modal) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 border-b border-white/10 bg-slate-950/60">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/10">
            <Radio className={`w-6 h-6 ${accState.isPlaying ? 'animate-pulse text-emerald-400' : 'text-indigo-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                Metrônomo &amp; Estúdio de Acompanhamento
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                Zero-Drift Web Audio
              </span>
              {accState.accompanimentEnabled && (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                  <Disc3 className="w-3 h-3 animate-spin" />
                  Banda Ativa
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Controle métrico, bateria acústica, contrabaixo, acordes e mesa de mixagem na mesma tela.
            </p>
          </div>
        </div>

        {/* Abas Superiores do Estúdio */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('metronome')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'metronome'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Metrônomo</span>
          </button>

          <button
            onClick={() => setActiveTab('accompaniment')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'accompaniment'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Banda &amp; Estilos</span>
          </button>

          <button
            onClick={() => setActiveTab('mixer')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mixer'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Mixer &amp; Pistas</span>
          </button>
        </div>
      </div>

      {/* 2. Área Central de Conteúdo por Aba */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* ================================================================= */}
        {/* ABA 1: METRÔNOMO DE PRECISÃO                                      */}
        {/* ================================================================= */}
        {activeTab === 'metronome' && (
          <div className="space-y-6">
            {/* Card Principal: BPM, Termo de Andamento e Visualizador */}
            <div className="glass-card rounded-3xl p-5 sm:p-7 border border-white/10 bg-slate-900/60 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                      {accompanimentStore.getTempoTerm()} • {accState.timeSignature}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      (Intervalo: {Math.round(60000 / accState.bpm)}ms)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-5xl sm:text-7xl font-black font-display text-white tracking-tight">
                      {accState.bpm}
                    </span>
                    <span className="text-sm font-mono text-slate-400 font-bold uppercase">BPM</span>
                  </div>
                </div>

                {/* Tap Tempo & Tipos de Som do Clique */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleTapTempo}
                    className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-amber-500/10"
                    title="Clique no pulso da música para calibrar o BPM automaticamente"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Tap Tempo</span>
                  </button>

                  <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-2xl border border-white/10 text-xs">
                    {(
                      [
                        { id: 'digital', label: 'Digital' },
                        { id: 'woodblock', label: 'Bloco' },
                        { id: 'mechanical', label: 'Mecânico' },
                        { id: 'cowbell', label: 'Cowbell' },
                      ] as { id: MetronomeSoundType; label: string }[]
                    ).map((snd) => (
                      <button
                        key={snd.id}
                        onClick={() => accompanimentStore.setMetronomeSound(snd.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          accState.metronomeSound === snd.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {snd.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Régua de Batidas / LEDs com Destaque Forte e Fracos */}
              <div className="py-2">
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {Array.from({ length: beatsCount }).map((_, idx) => {
                    const beatNum = idx + 1;
                    const isCurrent = accState.currentBeat === beatNum;
                    const isFirst = beatNum === 1;

                    let ledStyle = 'bg-white/5 border border-white/10 text-slate-500';
                    if (isCurrent && accState.isPlaying) {
                      if (isFirst) {
                        ledStyle = accState.muteDownbeat
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-400 line-through opacity-70'
                          : 'bg-amber-400 text-slate-950 font-black scale-110 shadow-lg shadow-amber-400/50 ring-2 ring-amber-300';
                      } else {
                        ledStyle = accState.muteUpbeats
                          ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-400 line-through opacity-70'
                          : 'bg-indigo-500 text-white font-black scale-105 shadow-md shadow-indigo-500/40 ring-1 ring-indigo-300';
                      }
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex-1 min-w-[55px] max-w-[90px] h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-75 ${ledStyle}`}
                      >
                        <span className="font-display text-xl font-bold">{beatNum}</span>
                        <span className="text-[9px] uppercase tracking-tighter opacity-80">
                          {isFirst ? 'Forte' : 'Fraco'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {accState.hiddenMode && (
                  <div className="mt-3 text-center text-xs font-mono font-bold">
                    {accState.isAudibleMeasure ? (
                      <span className="text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/30">
                        🔊 Compasso com Áudio
                      </span>
                    ) : (
                      <span className="text-amber-400 animate-pulse bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
                        🤫 Compasso Oculto (Mantenha o Pulso Interno!)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Slider de BPM e Botões de Ajuste */}
              <div className="flex items-center gap-2 sm:gap-4 pt-1">
                <button
                  onClick={() => accompanimentStore.setBpm(accState.bpm - 5)}
                  className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
                  title="-5 BPM"
                >
                  -5
                </button>
                <button
                  onClick={() => accompanimentStore.setBpm(accState.bpm - 1)}
                  className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95"
                  title="-1 BPM"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="30"
                  max="260"
                  value={accState.bpm}
                  onChange={(e) => accompanimentStore.setBpm(parseInt(e.target.value, 10))}
                  className="flex-1 h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <button
                  onClick={() => accompanimentStore.setBpm(accState.bpm + 1)}
                  className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95"
                  title="+1 BPM"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => accompanimentStore.setBpm(accState.bpm + 5)}
                  className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
                  title="+5 BPM"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Controles de Compasso, Subdivisões e Matriz de Mute */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Coluna 1: Compasso e Subdivisão */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <span className="text-xs font-mono uppercase font-bold text-slate-300 block">
                  Fórmula de Compasso &amp; Métrica:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['2/4', '3/4', '4/4', '5/4', '6/8'] as TimeSignature[]).map((ts) => (
                    <button
                      key={ts}
                      onClick={() => accompanimentStore.setTimeSignature(ts)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        accState.timeSignature === ts
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono uppercase font-bold text-slate-300 block pt-2">
                  Subdivisão Rítmica por Batida:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'quarter', label: '1/4', sub: 'Semínima' },
                      { id: 'eighth', label: '1/8', sub: 'Colcheia' },
                      { id: 'sixteenth', label: '1/16', sub: 'Semicolcheia' },
                      { id: 'triplet', label: '1/8T', sub: 'Tercina' },
                    ] as { id: MetronomeSubdivision; label: string; sub: string }[]
                  ).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => accompanimentStore.setSubdivision(sub.id)}
                      className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                        accState.subdivision === sub.id
                          ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-200 ring-1 ring-indigo-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-mono font-bold text-sm">{sub.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sub.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coluna 2: Matriz de Mute Independente de Tiques */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-slate-300">
                    Matriz de Mute dos Tiques:
                  </span>
                  <button
                    onClick={() => accompanimentStore.toggleMuteMetronomeMaster()}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                      accState.muteMetronomeMaster
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {accState.muteMetronomeMaster ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Clique Mudo</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Clique Ativo</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Silencie o tempo forte ou os fracos de forma independente. Ideal para exercitar o compasso interno sem perder a sincronia da banda!
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {/* Mute Tempo Forte */}
                  <button
                    onClick={() => accompanimentStore.toggleMuteDownbeat()}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      accState.muteDownbeat
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20'
                    }`}
                  >
                    <div className="text-xs font-bold">Tempo 1 (Forte)</div>
                    <div className="text-[10px] font-mono mt-1">
                      {accState.muteDownbeat ? '🔇 Mutado' : '🔊 Audível'}
                    </div>
                  </button>

                  {/* Mute Tempos Fracos */}
                  <button
                    onClick={() => accompanimentStore.toggleMuteUpbeats()}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      accState.muteUpbeats
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/20'
                    }`}
                  >
                    <div className="text-xs font-bold">Tempos Fracos</div>
                    <div className="text-[10px] font-mono mt-1">
                      {accState.muteUpbeats ? '🔇 Mutado' : '🔊 Audível'}
                    </div>
                  </button>

                  {/* Mute Subdivisões */}
                  <button
                    onClick={() => accompanimentStore.toggleMuteSubdivisions()}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      accState.muteSubdivisions
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/20'
                    }`}
                  >
                    <div className="text-xs font-bold">Subdivisões</div>
                    <div className="text-[10px] font-mono mt-1">
                      {accState.muteSubdivisions ? '🔇 Mutado' : '🔊 Audível'}
                    </div>
                  </button>
                </div>

                {/* Modo Oculto */}
                <div className="pt-2">
                  <button
                    onClick={() => accompanimentStore.toggleHiddenMode()}
                    className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      accState.hiddenMode
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Modo Oculto (2 Compassos com Som / 2 Compassos Silenciosos)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ABA 2: ACOMPANHAMENTO MUSICAL & ESTILOS                           */}
        {/* ================================================================= */}
        {activeTab === 'accompaniment' && (
          <div className="space-y-6">
            {/* Card de Ativação do Acompanhamento & Acorde Atual */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black/50 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => accompanimentStore.toggleAccompaniment()}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
                    accState.accompanimentEnabled
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 ring-2 ring-purple-400'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Disc3 className={`w-4 h-4 ${accState.accompanimentEnabled ? 'animate-spin' : ''}`} />
                  <span>{accState.accompanimentEnabled ? 'Banda Ativa' : 'Ativar Banda'}</span>
                </button>

                <div className="text-xs">
                  <span className="text-slate-400">Estilo selecionado: </span>
                  <strong className="text-white font-mono text-sm">{activeStyle.name}</strong>
                  <div className="text-[11px] text-purple-300">{activeStyle.description}</div>
                </div>
              </div>

              {/* Exibição do Acorde e Compasso Atuais */}
              <div className="flex items-center gap-4 bg-black/60 px-5 py-2.5 rounded-2xl border border-white/10">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold">
                    Compasso {accState.currentMeasure}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Tempo {accState.currentBeat} de {beatsCount}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex flex-col items-center justify-center shadow-lg shadow-purple-600/20">
                  <span className="font-display font-black text-white text-xl leading-none">
                    {currentChord?.symbol || 'C'}
                  </span>
                  <span className="text-[8px] text-purple-300 font-mono uppercase mt-0.5">Acorde</span>
                </div>
              </div>
            </div>

            {/* 1. Seleção de Tonalidade & Progressão Harmônica */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Tonalidade &amp; Progressão Harmônica</span>
                </div>

                {/* Modo Maior / Menor */}
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs">
                  <button
                    onClick={() => accompanimentStore.setScaleMode('major')}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      accState.scaleMode === 'major'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Maior (Alegre)
                  </button>
                  <button
                    onClick={() => accompanimentStore.setScaleMode('minor')}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      accState.scaleMode === 'minor'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Menor (Introspectivo)
                  </button>
                </div>
              </div>

              {/* Seletor de Fundamental (Tom) */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-2">
                  Tom da Música (Tônica):
                </span>
                <div className="flex flex-wrap gap-2">
                  {TONALITY_ROOTS.map((r) => (
                    <button
                      key={r.note}
                      onClick={() => accompanimentStore.setRootKey(r.note)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        accState.rootKey === r.note
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-300'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor de Progressões */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-2">
                  Progressão Harmônica:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROGRESSIONS.map((prog) => {
                    const isSelected = accState.progressionId === prog.id;
                    return (
                      <button
                        key={prog.id}
                        onClick={() => accompanimentStore.setProgression(prog.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500/60 ring-2 ring-purple-400 text-white shadow-lg shadow-purple-600/10'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{prog.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="font-mono text-xs font-black text-amber-300 mt-1.5">
                          {prog.romanNumerals}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {prog.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sequência Atual de Acordes Calculados */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                  Acordes em Execução ({accState.rootKey} {accState.scaleMode === 'major' ? 'Maior' : 'Menor'}):
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {currentChords.map((chord, cIdx) => {
                    const isNow = accState.currentChordIndex === cIdx && accState.isPlaying;
                    return (
                      <div
                        key={cIdx}
                        className={`px-4 py-2 rounded-xl border text-center transition-all ${
                          isNow
                            ? 'bg-amber-400 text-slate-950 font-black border-amber-300 scale-105 shadow-lg shadow-amber-400/40 ring-2 ring-amber-200'
                            : 'bg-white/5 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="text-sm font-mono font-bold">{chord.symbol}</div>
                        <div className="text-[9px] opacity-75">{chord.namePt}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Catálogo de Estilos Rítmicos */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase font-bold text-slate-300 block">
                Escolha o Estilo Rítmico / Padrão de Banda:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {ACCOMPANIMENT_STYLES.map((style) => {
                  const isSelected = accState.styleId === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => accompanimentStore.setStyle(style.id)}
                      className={`p-5 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/60 border-indigo-400/60 ring-2 ring-indigo-400 shadow-xl shadow-indigo-600/20'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300 mb-1">
                          <span className="uppercase font-bold">{style.timeSignature}</span>
                          <span>{style.recommendedBpm} BPM</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{style.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-snug">
                          {style.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Inst: {style.chordInstrument}</span>
                        {isSelected && <span className="text-indigo-400 font-bold">Ativo ✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ABA 3: MIXER DE 4 PISTAS & BALANÇO                                */}
        {/* ================================================================= */}
        {activeTab === 'mixer' && (
          <div className="space-y-6">
            {/* Mixer de 4 Canais Individuais */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Mesa de Som: Canais do Acompanhamento</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controle de volume individual, mute e solo por instrumento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(
                  [
                    { id: 'drums', label: 'Bateria & Percussão', icon: '🥁', color: 'text-amber-400' },
                    { id: 'bass', label: 'Baixo Elétrico', icon: '🎸', color: 'text-indigo-400' },
                    { id: 'chords', label: 'Acordes / Harmonia', icon: '🎹', color: 'text-purple-400' },
                    { id: 'arpeggio', label: 'Arpejador', icon: '✨', color: 'text-cyan-400' },
                  ] as const
                ).map((ch) => {
                  const channel = accState[ch.id];
                  return (
                    <div
                      key={ch.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        channel.muted
                          ? 'bg-rose-950/20 border-rose-500/30 opacity-70'
                          : channel.solo
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/20'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg">{ch.icon}</span>
                        <div className="flex items-center gap-1.5">
                          {/* Botão Mute */}
                          <button
                            onClick={() => accompanimentStore.toggleChannelMute(ch.id)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              channel.muted
                                ? 'bg-rose-600 text-white'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                            title={`Mutar ${ch.label}`}
                          >
                            M
                          </button>

                          {/* Botão Solo */}
                          <button
                            onClick={() => accompanimentStore.toggleChannelSolo(ch.id)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              channel.solo
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                            title={`Solo ${ch.label}`}
                          >
                            S
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-white mb-2">{ch.label}</div>

                      {/* Slider de Volume */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>Volume</span>
                          <span className="text-white font-bold">{channel.volume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={channel.volume}
                          onChange={(e) =>
                            accompanimentStore.setChannelVolume(ch.id, parseInt(e.target.value, 10))
                          }
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seção Master & Metrônomo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Master Metrônomo */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">Volume do Metrônomo (Cliques)</span>
                    <span className="font-mono text-xs text-white">{accState.metronomeVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={accState.metronomeVolume}
                    onChange={(e) => accompanimentStore.setMetronomeVolume(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Master Acompanhamento */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Volume Master do Acompanhamento</span>
                    <span className="font-mono text-xs text-white">{accState.accompanimentVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={accState.accompanimentVolume}
                    onChange={(e) => accompanimentStore.setAccompanimentVolume(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>

              {/* Presets Rápidos de Foco de Treino */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="text-[11px] font-mono text-slate-400 self-center mr-1">Modos Rápidos:</span>
                <button
                  onClick={() => {
                    if (accState.muteMetronomeMaster) accompanimentStore.toggleMuteMetronomeMaster();
                    if (accState.accompanimentEnabled) accompanimentStore.toggleAccompaniment();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                >
                  🎯 Só Metrônomo
                </button>
                <button
                  onClick={() => {
                    if (!accState.muteMetronomeMaster) accompanimentStore.toggleMuteMetronomeMaster();
                    if (!accState.accompanimentEnabled) accompanimentStore.toggleAccompaniment();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                >
                  🎸 Só Banda / Acompanhamento
                </button>
                <button
                  onClick={() => {
                    if (accState.muteMetronomeMaster) accompanimentStore.toggleMuteMetronomeMaster();
                    if (!accState.accompanimentEnabled) accompanimentStore.toggleAccompaniment();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-xs font-mono text-indigo-200 border border-indigo-500/40 transition-colors cursor-pointer"
                >
                  ⚡ Metrônomo + Banda Juntos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Rodapé Integrado do Estúdio (Com Botão Iniciar / Pausar em Destaque) */}
      <div className="p-5 sm:p-6 border-t border-white/10 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-4 h-4 rounded-full ${
              accState.isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'
            }`}
          />
          <div className="text-xs font-mono text-slate-400">
            {accState.isPlaying ? (
              <span>
                Tocando a <strong className="text-white text-sm">{accState.bpm} BPM</strong> • Compasso {accState.currentMeasure} • Tempo {accState.currentBeat} de {beatsCount}
              </span>
            ) : (
              <span>Metrônomo Parado (Ajuste os parâmetros e clique em Iniciar ou pressione Barra de Espaço)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToRadar && (
            <button
              onClick={onNavigateToRadar}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Ir para Radar Temporal ➔
            </button>
          )}

          <button
            onClick={handleTogglePlay}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer select-none active:scale-95 ${
              accState.isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400/50'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-emerald-500/30 ring-1 ring-emerald-400'
            }`}
          >
            {accState.isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar (Espaço)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
