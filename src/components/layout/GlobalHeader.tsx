import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  ChevronDown,
  BookOpen,
  Sliders,
  PenTool,
  Drum,
} from 'lucide-react';
import type { TabId } from './Navigation';
import { soundEngine } from '../../core/soundEngine';
import { useOctaveStandard } from '../../core/octaveConfigStore';
import { OctaveStandardModal } from './OctaveStandardModal';
import { LatencyWizardModal } from '../rhythm/LatencyWizardModal';
import { useAccompaniment } from '../../core/accompanimentStore';
import { useFullscreen } from '../../hooks/useFullscreen';
import { latencyManager } from '../../core/latencyManager';

interface GlobalHeaderProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ activeTab, onSelectTab }) => {
  const [showOctaveModal, setShowOctaveModal] = useState<boolean>(false);
  const [showLatencyModal, setShowLatencyModal] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(soundEngine.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isSoundMuted());
  const [currentOffset, setCurrentOffset] = useState<number>(latencyManager.getOffsetMs());

  const octaveStandard = useOctaveStandard();
  const accState = useAccompaniment();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const volumeMenuRef = useRef<HTMLDivElement>(null);

  // Fecha menus ao clicar fora ou pressionar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
      if (volumeMenuRef.current && !volumeMenuRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMoreMenu(false);
        setShowVolumeSlider(false);
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

  // Módulos complementares agrupados no dropdown quando em telas menores
  const isMoreToolActive = [
    'arranger',
    'piano',
    'guitar',
    'repertoire',
    'score-editor',
  ].includes(activeTab);

  const getMoreToolLabel = () => {
    switch (activeTab) {
      case 'arranger':
        return '🧪 Lab Rítmico';
      case 'piano':
        return '🎹 Teclado Livre';
      case 'guitar':
        return '🎸 Braço Violão';
      case 'repertoire':
        return '🎙️ Estúdio';
      case 'score-editor':
        return '🎼 Editor';
      default:
        return 'Mais';
    }
  };

  return (
    <>
      <header
        className="w-full h-[54px] min-h-[54px] max-h-[54px] px-3 sm:px-5 bg-[#080811]/95 border-b border-white/10 flex items-center justify-between gap-3 select-none z-50 text-xs relative backdrop-blur-md"
        role="banner"
      >
        {/* 1. Logotipo e Marca HARMONIA (Esquerda) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectTab('course-keyboard')}
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
            title="HARMONIA — Plataforma Musical Responsiva"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <span className="font-black text-sm font-display">H</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black font-display tracking-tight text-white text-xs sm:text-sm leading-none group-hover:text-indigo-300 transition-colors">
                HARMONIA
              </span>
              <span className="text-[9px] font-mono text-slate-400 leading-tight hidden sm:inline">
                Plataforma Musical
              </span>
            </div>
          </button>
        </div>

        {/* 2. Barra Central de Navegação Rápida (Abas Principais de Cursos & Ferramentas) */}
        <nav
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1"
          aria-label="Navegação Principal"
        >
          {/* Aba 1: 🎹 Teclado */}
          <button
            onClick={() => onSelectTab('course-keyboard')}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'course-keyboard'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-400/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🎹</span>
            <span className="hidden md:inline">Teclado</span>
          </button>

          {/* Aba 2: 🎸 Violão */}
          <button
            onClick={() => onSelectTab('course-guitar')}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'course-guitar'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/25 ring-1 ring-amber-400/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🎸</span>
            <span className="hidden md:inline">Violão</span>
          </button>

          {/* Aba 3: 🎼 Teoria */}
          <button
            onClick={() => onSelectTab('theory')}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'theory'
                ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-400/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🎼</span>
            <span className="hidden md:inline">Teoria</span>
          </button>

          {/* Aba 4: ⏱️ Metrônomo */}
          <button
            onClick={() => onSelectTab('rhythm')}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'rhythm'
                ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50 shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>⏱️</span>
            <span className="hidden md:inline">Metrônomo</span>
            {accState.isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          {/* Abas 5 a 8: Diretamente visíveis em telas >= 1280px (xl) */}
          <div className="hidden xl:flex items-center gap-1 sm:gap-1.5">
            {/* Aba 5: 🧪 Lab Rítmico */}
            <button
              onClick={() => onSelectTab('arranger')}
              className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'arranger'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-sm shadow-purple-500/25 ring-1 ring-purple-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>🧪</span>
              <span>Lab Rítmico</span>
            </button>

            {/* Aba 6: 🎹 Teclado Livre */}
            <button
              onClick={() => onSelectTab('piano')}
              className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'piano'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>🎹</span>
              <span>Teclado Livre</span>
            </button>

            {/* Aba 7: 🎸 Braço Violão */}
            <button
              onClick={() => onSelectTab('guitar')}
              className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'guitar'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/25 ring-1 ring-amber-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>🎸</span>
              <span>Braço Violão</span>
            </button>

            {/* Aba 8: 🎙️ Estúdio */}
            <button
              onClick={() => onSelectTab('repertoire')}
              className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'repertoire'
                  ? 'bg-pink-600/30 text-pink-200 border border-pink-500/50 shadow-sm shadow-pink-500/25 ring-1 ring-pink-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>🎙️</span>
              <span>Estúdio</span>
            </button>
          </div>

          {/* Dropdown de Overflow Responsivo (< 1280px ou espaço reduzido) */}
          <div ref={moreMenuRef} className="relative shrink-0 xl:hidden">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`h-8 sm:h-9 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                isMoreToolActive
                  ? 'bg-purple-600/30 text-purple-200 border-purple-500/50 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-white/5'
              }`}
              title="Acessar outros módulos e ferramentas"
            >
              <span className="truncate max-w-[85px] sm:max-w-none">
                {isMoreToolActive ? getMoreToolLabel() : 'Mais'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-52 rounded-2xl bg-[#100f21] border border-white/10 shadow-2xl py-2 z-50 animate-fadeIn">
                <button
                  onClick={() => {
                    onSelectTab('arranger');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'arranger'
                      ? 'bg-purple-600/20 text-purple-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Drum className="w-4 h-4 text-purple-400" />
                  <span>🧪 Lab Rítmico</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('piano');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'piano'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🎹</span>
                  <span>Teclado Livre</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('guitar');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'guitar'
                      ? 'bg-amber-600/20 text-amber-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🎸</span>
                  <span>Braço Violão</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('repertoire');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'repertoire'
                      ? 'bg-pink-600/20 text-pink-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-pink-400" />
                  <span>🎙️ Estúdio & Repertório</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('score-editor');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'score-editor'
                      ? 'bg-cyan-600/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <PenTool className="w-4 h-4 text-cyan-400" />
                  <span>🎼 Editor de Partituras</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 3. Ações Globais: Dó Central, Áudio/Latência e Tela Cheia (Direita) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Botão Nomenclatura Dó Central */}
          <button
            onClick={() => setShowOctaveModal(true)}
            className="h-8 sm:h-9 flex items-center gap-1 px-2 sm:px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Padrão do Dó Central (C3 Teclado Brasileiro / C4 Internacional)"
          >
            <span>{octaveStandard === 'C3' ? '🇧🇷 Dó Central: C3' : '🌐 Dó Central: C4'}</span>
          </button>

          {/* Botão Latência & Áudio */}
          <button
            onClick={() => setShowLatencyModal(true)}
            className="hidden md:flex h-8 sm:h-9 items-center gap-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Calibrar latência para fone Bluetooth ou alto-falante"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Áudio {currentOffset > 0 ? `+${currentOffset}ms` : '0ms'}</span>
          </button>

          {/* Controle de Volume com Slider Popover */}
          <div ref={volumeMenuRef} className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="h-8 sm:h-9 w-8 sm:w-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
              title={isMuted ? 'Áudio Mutado (Clique para ajustar)' : `Volume: ${Math.round(volume * 100)}%`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 top-full mt-1.5 p-3 rounded-2xl bg-[#100f21] border border-white/10 shadow-2xl flex items-center gap-2.5 z-50 animate-fadeIn">
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
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            )}
          </div>

          {/* Botão [⛶ Tela Cheia] */}
          <button
            onClick={toggleFullscreen}
            className={`h-8 sm:h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
            title={isFullscreen ? 'Sair da Tela Cheia (Esc)' : 'Ativar Modo Tela Cheia (F11)'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sair</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Tela Cheia</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Modais Globais do Header */}
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
