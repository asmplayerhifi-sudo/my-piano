import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Music,
  Activity,
  Volume2,
  VolumeX,
  Radio,
  Maximize,
  Minimize,
  Settings,
} from 'lucide-react';
import type { TabId } from './Navigation';
import { soundEngine } from '../../core/soundEngine';
import { useOctaveStandard } from '../../core/octaveConfigStore';
import { OctaveStandardModal } from './OctaveStandardModal';
import { LatencyWizardModal } from '../rhythm/LatencyWizardModal';
import { useAccompaniment } from '../../core/accompanimentStore';
import { useFullscreen } from '../../hooks/useFullscreen';
import { latencyManager } from '../../core/latencyManager';

export interface GlobalHeaderProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ activeTab, onSelectTab }) => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showOctaveModal, setShowOctaveModal] = useState<boolean>(false);
  const [showLatencyModal, setShowLatencyModal] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(soundEngine.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isSoundMuted());
  const [currentOffset, setCurrentOffset] = useState<number>(latencyManager.getOffsetMs());

  const octaveStandard = useOctaveStandard();
  const accState = useAccompaniment();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const volumeMenuRef = useRef<HTMLDivElement>(null);

  // Fecha popovers ao clicar fora ou ao pressionar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumeMenuRef.current && !volumeMenuRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVolumeSlider(false);
        setShowDrawer(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
    if (isMuted) setIsMuted(false);
  };

  const handleTabClick = (tab: TabId) => {
    onSelectTab(tab);
    setShowDrawer(false);
  };

  return (
    <>
      {/* ── HEADER PRINCIPAL UNIFICADO: Linha Única 52px (>=1024px) / 48px (<1024px) ── */}
      <header
        className="w-full h-[48px] lg:h-[52px] min-h-[48px] lg:min-h-[52px] max-h-[48px] lg:max-h-[52px] px-2.5 sm:px-4 lg:px-6 bg-[#080811]/95 border-b border-white/10 flex items-center justify-between gap-2 sm:gap-3 select-none z-40 relative backdrop-blur-md whitespace-nowrap overflow-x-hidden text-xs"
        role="banner"
        aria-label="Barra Principal de Navegação e Utilitários"
      >
        {/* ── 1. ESQUERDA: Botão Menu (Mobile <1024px) + Marca HARMONIA ── */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Botão [ ☰ Menu ] (Wireframe 3: Telas Pequenas < 1024px) */}
          <button
            onClick={() => setShowDrawer(true)}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
            title="Abrir Menu Principal de Navegação"
            aria-label="Abrir Menu de Navegação"
            aria-expanded={showDrawer}
          >
            <Menu className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline font-bold">Menu</span>
          </button>

          {/* Logotipo e Marca HARMONIA */}
          <button
            onClick={() => handleTabClick('course-keyboard')}
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
            title="HARMONIA — Plataforma Musical Responsiva"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black font-display tracking-tight text-white text-xs sm:text-sm leading-none group-hover:text-indigo-300 transition-colors">
                HARMONIA
              </span>
            </div>
          </button>
        </div>

        {/* ── 2. CENTRO: Cursos, Prática e Estúdio (Wireframe 1 & 2: Telas >= 1024px) ── */}
        <nav
          className="hidden lg:flex items-center gap-2 xl:gap-2.5 overflow-x-auto no-scrollbar py-1"
          aria-label="Navegação Principal de Módulos"
        >
          {/* Divisor Visual */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* 🎓 GRUPO 1: CURSOS */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/40 p-0.5 rounded-xl border border-white/5 shrink-0">
            <span className="text-xs font-mono font-bold uppercase text-indigo-400 px-1.5 hidden 2xl:inline">
              🎓 CURSOS:
            </span>
            <span className="text-xs font-mono font-bold text-indigo-400 px-1 2xl:hidden hidden xl:inline">
              🎓
            </span>

            {/* Teclado */}
            <button
              onClick={() => handleTabClick('course-keyboard')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'course-keyboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Curso de Teclado & Piano"
            >
              <span>🎹</span>
              <span className="hidden xl:inline">Teclado</span>
            </button>

            {/* Violão */}
            <button
              onClick={() => handleTabClick('course-guitar')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'course-guitar'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Curso de Violão & Guitarra"
            >
              <span>🎸</span>
              <span className="hidden xl:inline">Violão</span>
            </button>

            {/* Teoria */}
            <button
              onClick={() => handleTabClick('theory')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'theory'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Curso de Teoria Musical & Harmonia"
            >
              <span>🎼</span>
              <span className="hidden xl:inline">Teoria</span>
            </button>
          </div>

          {/* Divisor Visual */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* 🎵 GRUPO 2: PRÁTICA */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/40 p-0.5 rounded-xl border border-white/5 shrink-0">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 px-1.5 hidden 2xl:inline">
              🎵 PRÁTICA:
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 px-1 2xl:hidden hidden xl:inline">
              🎵
            </span>

            {/* Repertório */}
            <button
              onClick={() => handleTabClick('repertoire')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'repertoire'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Repertório Completo (28 Obras)"
            >
              <span>🎶</span>
              <span className="hidden xl:inline">Repertório</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/15 text-white font-bold">
                28
              </span>
            </button>

            {/* Lab Rítmico */}
            <button
              onClick={() => handleTabClick('rhythm')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'rhythm'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Laboratório Rítmico & Metrônomo Interativo"
            >
              <span>🧪</span>
              <span className="hidden xl:inline">Lab Rítmico</span>
            </button>

            {/* Teclado Livre */}
            <button
              onClick={() => handleTabClick('piano')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'piano'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Teclado Virtual Livre"
            >
              <span>🎹</span>
              <span className="hidden xl:inline">Teclado Livre</span>
            </button>

            {/* Braço Violão */}
            <button
              onClick={() => handleTabClick('guitar')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'guitar'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Braço de Violão & Escalas"
            >
              <span>🎸</span>
              <span className="hidden xl:inline">Braço Violão</span>
            </button>
          </div>

          {/* Divisor Visual */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* 🎙️ GRUPO 3: ESTÚDIO */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/40 p-0.5 rounded-xl border border-white/5 shrink-0">
            <span className="text-xs font-mono font-bold uppercase text-purple-400 px-1.5 hidden 2xl:inline">
              🎙️ ESTÚDIO:
            </span>
            <span className="text-xs font-mono font-bold text-purple-400 px-1 2xl:hidden hidden xl:inline">
              🎙️
            </span>

            {/* Editor Partitura */}
            <button
              onClick={() => handleTabClick('score-editor')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'score-editor'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Editor de Partituras MIDI"
            >
              <span>✏️</span>
              <span className="hidden xl:inline">Partitura</span>
            </button>

            {/* Arranjador PSR */}
            <button
              onClick={() => handleTabClick('arranger')}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'arranger'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Arranjador Rítmico PSR"
            >
              <span>🥁</span>
              <span className="hidden xl:inline">Arranjador</span>
            </button>
          </div>

          {/* Botão [⚙️ Mais...] (Wireframe 2: Telas Médias 1024px <= width < 1280px para abrir Drawer de Navegação) */}
          <button
            onClick={() => setShowDrawer(true)}
            className="xl:hidden flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer shrink-0"
            title="Mais opções e detalhes de navegação"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mais...</span>
          </button>
        </nav>

        {/* ── 3. DIREITA: Configurações de Áudio e Utilitários ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Seletor de Nomenclatura do Dó Central: (C3) / (C4) */}
          <button
            onClick={() => setShowOctaveModal(true)}
            className="h-7.5 sm:h-8 flex items-center gap-1 px-2 sm:px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
            title="Padrão do Dó Central (C3 Teclado Brasileiro / C4 Internacional)"
          >
            <span>🎹</span>
            <span className="font-bold text-indigo-300">({octaveStandard})</span>
          </button>

          {/* Botão de Metrônomo Global: [⏱️ 97 BPM] */}
          <button
            onClick={() => {
              if (window.location.hash !== '#/rhythm') {
                window.location.hash = '#/rhythm';
              }
              window.dispatchEvent(new CustomEvent('nav-rhythm-mode', { detail: 'studio' }));
            }}
            className={`h-7.5 sm:h-8 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
              accState.isPlaying
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-400 shadow-sm shadow-emerald-500/30'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
            }`}
            title="Ir para o Estúdio de Metrônomo & Acompanhamento"
          >
            <Radio className={`w-3.5 h-3.5 ${accState.isPlaying ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
            <span>{accState.bpm} BPM</span>
            {accState.accompanimentEnabled && (
              <span className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                +Banda
              </span>
            )}
          </button>

          {/* Controle de Volume com Slider Popover: [🔊] */}
          <div ref={volumeMenuRef} className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="h-7.5 sm:h-8 w-7.5 sm:w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
              title={isMuted ? 'Áudio Mutado (Clique para ajustar)' : `Volume: ${Math.round(volume * 100)}%`}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 top-full mt-2 p-3 rounded-2xl bg-[#100f21] border border-white/15 shadow-2xl flex items-center gap-2.5 z-50 animate-fadeIn">
                <button
                  onClick={handleToggleMute}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-xs font-mono text-slate-400 w-8 text-right font-bold">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            )}
          </div>

          {/* Botão [⛶ Tela Cheia] */}
          <button
            onClick={toggleFullscreen}
            className={`h-7.5 sm:h-8 w-7.5 sm:w-8 flex items-center justify-center rounded-xl border text-xs transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
            title={isFullscreen ? 'Sair da Tela Cheia (Esc)' : 'Ativar Modo Tela Cheia (F11)'}
          >
            {isFullscreen ? (
              <Minimize className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Maximize className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>
        </div>
      </header>

      {/* ── 4. DRAWER / MODAL LATERAL DE NAVEGAÇÃO PRINCIPAL (Telas < 1024px ou via [⚙️ Mais...]) ── */}
      {showDrawer &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex justify-start bg-black/80 backdrop-blur-md animate-fade-in select-none"
            onClick={() => setShowDrawer(false)}
          >
            <div
              className="bg-[#0c0b1a] border-r border-white/15 w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto text-slate-100 p-5 sm:p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabeçalho do Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white">
                      HARMONIA
                    </h3>
                    <p className="text-xs text-slate-400">
                      Navegação Principal da Plataforma
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Fechar Menu [Esc]"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">Fechar</span>
                </button>
              </div>

              {/* Conteúdo com Categorias Organizadas */}
              <div className="flex-1 space-y-5 overflow-y-auto pr-1">
                {/* 🎓 SEÇÃO 1: CURSOS DISPONÍVEIS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    <span>CURSOS DISPONÍVEIS</span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {/* Teclado */}
                    <button
                      onClick={() => handleTabClick('course-keyboard')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'course-keyboard'
                          ? 'bg-indigo-600/30 border-indigo-500/50 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎹</span>
                        <div>
                          <p className="font-bold text-white text-xs">Curso Teclado &amp; Piano</p>
                          <p className="text-[11px] text-slate-400 font-normal">Do Zero ao Avançado com Partituras</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {activeTab === 'course-keyboard' ? 'CURSO ATIVO' : 'CURSO'}
                      </span>
                    </button>

                    {/* Violão */}
                    <button
                      onClick={() => handleTabClick('course-guitar')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'course-guitar'
                          ? 'bg-amber-600/30 border-amber-500/50 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎸</span>
                        <div>
                          <p className="font-bold text-white text-xs">Curso Violão &amp; Guitarra</p>
                          <p className="text-[11px] text-slate-400 font-normal">Pestana, CAGED, Dedo Âncora e Levadas</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {activeTab === 'course-guitar' ? 'CURSO ATIVO' : 'CURSO'}
                      </span>
                    </button>

                    {/* Teoria */}
                    <button
                      onClick={() => handleTabClick('theory')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'theory'
                          ? 'bg-cyan-600/30 border-cyan-500/50 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎼</span>
                        <div>
                          <p className="font-bold text-white text-xs">Curso Teoria Musical</p>
                          <p className="text-[11px] text-slate-400 font-normal">Intervalos, Escalas e Harmonia</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {activeTab === 'theory' ? 'CURSO ATIVO' : 'CURSO'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 🎵 SEÇÃO 2: FERRAMENTAS DE PRÁTICA */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                    <Activity className="w-4 h-4" />
                    <span>FERRAMENTAS DE PRÁTICA</span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {/* Repertório */}
                    <button
                      onClick={() => handleTabClick('repertoire')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'repertoire'
                          ? 'bg-purple-600/30 border-purple-500/50 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎶</span>
                        <div>
                          <p className="font-bold text-white text-xs">Repertório de Músicas</p>
                          <p className="text-[11px] text-slate-400 font-normal">Partituras com Solfejo e Áudio</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        28 OBRAS
                      </span>
                    </button>

                    {/* Lab Rítmico */}
                    <button
                      onClick={() => handleTabClick('rhythm')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'rhythm'
                          ? 'bg-emerald-600/30 border-emerald-500/50 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🧪</span>
                        <div>
                          <p className="font-bold text-white text-xs">Lab Rítmico</p>
                          <p className="text-[11px] text-slate-400 font-normal">Treino Rítmico com Metrônomo</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        METRÔNOMO
                      </span>
                    </button>

                    {/* Teclado Livre */}
                    <button
                      onClick={() => handleTabClick('piano')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'piano'
                          ? 'bg-indigo-600/30 border-indigo-500/50 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎹</span>
                        <div>
                          <p className="font-bold text-white text-xs">Teclado Livre Interativo</p>
                          <p className="text-[11px] text-slate-400 font-normal">Instrumento Virtual com Gravação</p>
                        </div>
                      </div>
                    </button>

                    {/* Braço Violão */}
                    <button
                      onClick={() => handleTabClick('guitar')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'guitar'
                          ? 'bg-amber-600/30 border-amber-500/50 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎸</span>
                        <div>
                          <p className="font-bold text-white text-xs">Braço de Violão &amp; Escalas</p>
                          <p className="text-[11px] text-slate-400 font-normal">Shapes, Intervalos e Afinação</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 🎙️ SEÇÃO 3: ESTÚDIO & CRIAÇÃO */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-purple-400 tracking-wider">
                    <Music className="w-4 h-4" />
                    <span>ESTÚDIO &amp; CRIAÇÃO</span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {/* Editor Partitura */}
                    <button
                      onClick={() => handleTabClick('score-editor')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'score-editor'
                          ? 'bg-cyan-600/30 border-cyan-500/50 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">✏️</span>
                        <div>
                          <p className="font-bold text-white text-xs">Editor de Partitura MIDI</p>
                          <p className="text-[11px] text-slate-400 font-normal">Crie e edite partituras personalizadas</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        MIDI
                      </span>
                    </button>

                    {/* Arranjador PSR */}
                    <button
                      onClick={() => handleTabClick('arranger')}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'arranger'
                          ? 'bg-purple-600/30 border-purple-500/50 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🥁</span>
                        <div>
                          <p className="font-bold text-white text-xs">Arranjador Rítmico PSR</p>
                          <p className="text-[11px] text-slate-400 font-normal">Estilos e levadas para prática</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        PSR
                      </span>
                    </button>
                  </div>
                </div>

                {/* ⚙️ SEÇÃO 4: CONFIGURAÇÕES DE ÁUDIO & SISTEMA */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    <Settings className="w-4 h-4" />
                    <span>CONFIGURAÇÕES DE ÁUDIO</span>
                  </div>

                  <div className="space-y-2 pl-1">
                    {/* Dó Central */}
                    <button
                      onClick={() => {
                        setShowDrawer(false);
                        setShowOctaveModal(true);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="text-slate-300">Afinação Central:</span>
                      <span className="font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                        Dó Central [ {octaveStandard === 'C3' ? 'C3 (Brasil)' : 'C4 (Internacional)'} ]
                      </span>
                    </button>

                    {/* Metrônomo Global */}
                    <button
                      onClick={() => {
                        setShowDrawer(false);
                        handleTabClick('rhythm');
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="text-slate-300">Metrônomo Global:</span>
                      <span className="font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        {accState.bpm} BPM {accState.timeSignature}
                      </span>
                    </button>

                    {/* Latência & Sistema */}
                    <button
                      onClick={() => {
                        setShowDrawer(false);
                        setShowLatencyModal(true);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="text-slate-300">Status do Sistema:</span>
                      <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Latência {currentOffset}ms (Capacitor Ready)
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── Modais Auxiliares Globais ── */}
      <OctaveStandardModal
        isOpen={showOctaveModal}
        onClose={() => setShowOctaveModal(false)}
      />

      <LatencyWizardModal
        isOpen={showLatencyModal}
        onClose={() => setShowLatencyModal(false)}
        onCalibrated={(newOffset) => setCurrentOffset(newOffset)}
      />
    </>
  );
};
