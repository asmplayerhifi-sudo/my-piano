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

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
      if (volumeMenuRef.current && !volumeMenuRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const isMoreToolActive = [
    'repertoire',
    'piano',
    'guitar',
    'score-editor',
    'arranger',
  ].includes(activeTab);

  const getMoreToolLabel = () => {
    switch (activeTab) {
      case 'repertoire':
        return '📚 Repertório';
      case 'piano':
        return '🎹 Piano Livre';
      case 'guitar':
        return '🎸 Violão Livre';
      case 'score-editor':
        return '🎼 Editor';
      case 'arranger':
        return '🥁 Arranger';
      default:
        return 'Mais Ferramentas';
    }
  };

  return (
    <>
      <header
        className="w-full h-[38px] max-h-[38px] min-h-[38px] px-2 sm:px-4 bg-[#080811] border-b border-white/10 flex items-center justify-between gap-2 select-none z-50 text-xs relative"
        role="banner"
      >
        {/* 1. Logotipo e Marca HARMONIA (Esquerda) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('course-keyboard')}
            className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
            title="HARMONIA — Plataforma Musical"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <span className="font-black text-xs font-display">H</span>
            </div>
            <span className="font-black font-display tracking-tight text-white text-xs sm:text-sm group-hover:text-indigo-300 transition-colors">
              HARMONIA
            </span>
          </button>
        </div>

        {/* 2. Barra Central de Navegação Rápida (Abas Principais de Cursos & Ferramentas) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Aba Teclado */}
          <button
            onClick={() => onSelectTab('course-keyboard')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'course-keyboard'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🎹</span>
            <span className="hidden md:inline">Teclado</span>
          </button>

          {/* Aba Violão */}
          <button
            onClick={() => onSelectTab('course-guitar')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'course-guitar'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🎸</span>
            <span className="hidden md:inline">Violão</span>
          </button>

          {/* Aba Teoria */}
          <button
            onClick={() => onSelectTab('theory')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'theory'
                ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🎼</span>
            <span className="hidden md:inline">Teoria</span>
          </button>

          {/* Aba Metrônomo */}
          <button
            onClick={() => onSelectTab('rhythm')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'rhythm'
                ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>⏱️</span>
            <span className="hidden md:inline">Metrônomo</span>
            {accState.isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          {/* Dropdown de Mais Ferramentas */}
          <div ref={moreMenuRef} className="relative shrink-0">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                isMoreToolActive
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title="Acessar outras ferramentas musicais"
            >
              <span className="truncate max-w-[90px] sm:max-w-none">
                {isMoreToolActive ? getMoreToolLabel() : 'Mais'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1 w-48 rounded-xl bg-[#100f21] border border-white/10 shadow-2xl py-1.5 z-50 animate-fadeIn">
                <button
                  onClick={() => {
                    onSelectTab('repertoire');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${
                    activeTab === 'repertoire'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Repertório &amp; Obras</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('arranger');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${
                    activeTab === 'arranger'
                      ? 'bg-purple-600/20 text-purple-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Drum className="w-3.5 h-3.5 text-purple-400" />
                  <span>Arranger &amp; Bateria</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('score-editor');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${
                    activeTab === 'score-editor'
                      ? 'bg-cyan-600/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Editor de Partituras</span>
                </button>

                <div className="my-1 border-t border-white/5" />

                <button
                  onClick={() => {
                    onSelectTab('piano');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${
                    activeTab === 'piano'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>🎹</span>
                  <span>Piano Livre</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('guitar');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${
                    activeTab === 'guitar'
                      ? 'bg-amber-600/20 text-amber-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>🎸</span>
                  <span>Violão Livre</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 3. Ações Globais: Dó Central, Volume e Tela Cheia (Direita) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Botão Nomenclatura Dó Central */}
          <button
            onClick={() => setShowOctaveModal(true)}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] sm:text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Padrão do Dó Central (C3 Brasil / C4 Internacional)"
          >
            <span>{octaveStandard === 'C3' ? '🇧🇷 C3' : '🌐 C4'}</span>
          </button>

          {/* Botão Latência */}
          <button
            onClick={() => setShowLatencyModal(true)}
            className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Calibrar latência para fone Bluetooth ou alto-falante"
          >
            <Sliders className="w-3 h-3 text-indigo-400" />
            <span>{currentOffset > 0 ? `+${currentOffset}ms` : '0ms'}</span>
          </button>

          {/* Controle de Volume Compacto */}
          <div ref={volumeMenuRef} className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              title={isMuted ? 'Áudio Mutado (Clique para ajustar)' : `Volume: ${Math.round(volume * 100)}%`}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 top-full mt-1 p-2 rounded-xl bg-[#100f21] border border-white/10 shadow-2xl flex items-center gap-2 z-50">
                <button
                  onClick={handleToggleMute}
                  className="text-slate-400 hover:text-white"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Botão [⛶ Tela Cheia] */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
            title={isFullscreen ? 'Sair da Tela Cheia (Esc)' : 'Ativar Modo Tela Cheia (F11)'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Sair</span>
              </>
            ) : (
              <>
                <Maximize className="w-3 h-3 text-indigo-400" />
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
