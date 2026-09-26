import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { soundEngine } from '../../core/soundEngine';
import {
  TIMBRES,
  TIMBRE_CATEGORIES,
  type TimbreId,
  type TimbreCategory,
  type TimbreDefinition,
} from '../../core/soundEngineTypes';
import { TimbreIcon } from './TimbreIcons';
import { musicalPlaybackEngine } from '../../core/musicalPlaybackEngine';

interface TimbreSelectorProps {
  /** Posição compacta: exibe apenas o badge com timbre atual + dropdown */
  compact?: boolean;
  className?: string;
  onTimbreChange?: (id: TimbreId) => void;
}

const CATEGORY_COLORS: Record<TimbreCategory, {
  dot: string;
  badge: string;
  ring: string;
  activeBg: string;
  border: string;
  iconBg: string;
  text: string;
}> = {
  pianos: {
    dot: 'bg-indigo-400',
    badge: 'text-indigo-200 bg-indigo-500/20 border-indigo-400/40',
    ring: 'ring-indigo-500/60',
    activeBg: 'bg-indigo-950/70 border-indigo-500/60 shadow-indigo-950/40',
    border: 'border-indigo-500/30',
    iconBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    text: 'text-indigo-300',
  },
  epianos_organs: {
    dot: 'bg-amber-400',
    badge: 'text-amber-200 bg-amber-500/20 border-amber-400/40',
    ring: 'ring-amber-500/60',
    activeBg: 'bg-amber-950/70 border-amber-500/60 shadow-amber-950/40',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    text: 'text-amber-300',
  },
  percussion: {
    dot: 'bg-cyan-400',
    badge: 'text-cyan-200 bg-cyan-500/20 border-cyan-400/40',
    ring: 'ring-cyan-500/60',
    activeBg: 'bg-cyan-950/70 border-cyan-500/60 shadow-cyan-950/40',
    border: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    text: 'text-cyan-300',
  },
  synths_leads: {
    dot: 'bg-purple-400',
    badge: 'text-purple-200 bg-purple-500/20 border-purple-400/40',
    ring: 'ring-purple-500/60',
    activeBg: 'bg-purple-950/70 border-purple-500/60 shadow-purple-950/40',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    text: 'text-purple-300',
  },
  orchestra: {
    dot: 'bg-emerald-400',
    badge: 'text-emerald-200 bg-emerald-500/20 border-emerald-400/40',
    ring: 'ring-emerald-500/60',
    activeBg: 'bg-emerald-950/70 border-emerald-500/60 shadow-emerald-950/40',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-300',
  },
  guitars: {
    dot: 'bg-orange-400',
    badge: 'text-orange-200 bg-orange-500/20 border-orange-400/40',
    ring: 'ring-orange-500/60',
    activeBg: 'bg-orange-950/70 border-orange-500/60 shadow-orange-950/40',
    border: 'border-orange-500/30',
    iconBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    text: 'text-orange-300',
  },
  bass: {
    dot: 'bg-rose-400',
    badge: 'text-rose-200 bg-rose-500/20 border-rose-400/40',
    ring: 'ring-rose-500/60',
    activeBg: 'bg-rose-950/70 border-rose-500/60 shadow-rose-950/40',
    border: 'border-rose-500/30',
    iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    text: 'text-rose-300',
  },
};

export const TimbreSelector: React.FC<TimbreSelectorProps> = ({
  compact = false,
  className = '',
  onTimbreChange,
}) => {
  const [selected, setSelected] = useState<TimbreId>(soundEngine.getTimbre());
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<TimbreId | null>(null);
  const [activeCategory, setActiveCategory] = useState<TimbreCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Posição dinâmica do modal/dropdown
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  /** Calcula onde o modal/dropdown deve aparecer ancorado ao botão ou centralizado */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropW = 620;
    const leftPos = Math.min(rect.left, window.innerWidth - dropW - 16);
    setDropPos({
      top: rect.bottom + 8 + window.scrollY,
      left: Math.max(16, leftPos) + window.scrollX,
    });
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(o => {
      const next = !o;
      if (next) {
        updatePosition();
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      return next;
    });
  }, [updatePosition]);

  // Recalcula posição ao rolar ou redimensionar
  useEffect(() => {
    if (!open) return;
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, updatePosition]);

  // Fecha ao clicar fora ou pressionar ESC
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !triggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const currentTimbre = useMemo(() => {
    return TIMBRES.find(t => t.id === selected) || TIMBRES[0];
  }, [selected]);

  const currentColor = CATEGORY_COLORS[currentTimbre.category];

  // Filtro de instrumentos
  const filteredTimbres = useMemo(() => {
    return TIMBRES.filter(timbre => {
      const matchCategory = activeCategory === 'all' || timbre.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inLabel = timbre.label.toLowerCase().includes(q);
      const inSubtitle = timbre.subtitle.toLowerCase().includes(q);
      const inDesc = timbre.description.toLowerCase().includes(q);
      const inOrigin = (timbre.presetOrigin || '').toLowerCase().includes(q);
      const inTags = timbre.tags.some(tag => tag.toLowerCase().includes(q));

      return inLabel || inSubtitle || inDesc || inOrigin || inTags;
    });
  }, [activeCategory, searchQuery]);

  const handleSelect = (id: TimbreId) => {
    setSelected(id);
    soundEngine.setTimbre(id);
    onTimbreChange?.(id);
    setOpen(false);

    // Toca a nota de confirmação caso o player não esteja tocando
    if (!musicalPlaybackEngine.getIsPlaying()) {
      soundEngine.ensureAudioReady().then(() => {
        soundEngine.playPianoNote(60, 0.7, undefined, 0.85);
      });
    }
  };

  const handleAudition = (e: React.MouseEvent, id: TimbreId) => {
    e.stopPropagation();
    if (preview !== id) {
      setPreview(id);
      const prevSelected = soundEngine.getTimbre();
      soundEngine.setTimbre(id);
      if (!musicalPlaybackEngine.getIsPlaying()) {
        soundEngine.ensureAudioReady().then(() => {
          soundEngine.playPianoNote(60, 0.65, undefined, 0.75);
        });
      }
      setTimeout(() => {
        setPreview(curr => {
          if (curr === id && !open) {
            soundEngine.setTimbre(prevSelected);
          }
          return null;
        });
      }, 700);
    }
  };

  // Dropdown renderizado via Portal para nunca ser cortado por overflow de contêineres pais
  const dropdownPortal = open && dropPos
    ? createPortal(
        <div
          ref={dropdownRef}
          data-timbre-dropdown
          style={{
            position: 'absolute',
            top: dropPos.top,
            left: dropPos.left,
            width: 'min(620px, calc(100vw - 32px))',
            maxHeight: 'min(580px, calc(100vh - 80px))',
            zIndex: 99999,
          }}
          className="bg-[#0b0c1d]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* ── Top Bar / Header do Seletor ─────────────────────────────── */}
          <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <TimbreIcon iconKey="grand_piano" size={18} className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
                    Estúdio de Timbres
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      34 Instrumentos
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Engine Hi-Fi • Multi-Velocity • Round-Robin • Web Audio API &lt;10ms
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Input de Busca Rápida */}
            <div className="relative mb-3">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar timbre (ex: Rhodes, Zezo, Scandalli, Moog, Leslie, Stratocaster)..."
                className="w-full bg-black/40 border border-white/15 rounded-xl px-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400/70 focus:ring-1 focus:ring-indigo-400/50 transition-all"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs p-0.5"
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Chips de Categoria */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  activeCategory === 'all'
                    ? 'bg-white/20 text-white border-white/40 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                Todos ({TIMBRES.length})
              </button>
              {TIMBRE_CATEGORIES.map(cat => {
                const isCatActive = activeCategory === cat.id;
                const catColor = CATEGORY_COLORS[cat.id];
                const count = TIMBRES.filter(t => t.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      isCatActive
                        ? `${catColor.badge} font-bold ring-1 ${catColor.ring}`
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
                    <span>{cat.shortLabel}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Lista de Cards de Instrumentos ─────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[380px] scrollbar-thin scrollbar-thumb-white/20">
            {filteredTimbres.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhum instrumento encontrado para "{searchQuery}".
              </div>
            ) : (
              filteredTimbres.map((timbre: TimbreDefinition) => {
                const isActive = timbre.id === selected;
                const tc = CATEGORY_COLORS[timbre.category];

                return (
                  <div
                    key={timbre.id}
                    id={`timbre-card-${timbre.id}`}
                    onClick={() => handleSelect(timbre.id)}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer select-none text-left ${
                      isActive
                        ? `${tc.activeBg} border-l-4 ${tc.border} ring-1 ${tc.ring}`
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Ícone Vetorial em Outline Customizado do Instrumento */}
                      <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${tc.iconBg}`}>
                        <TimbreIcon
                          iconKey={timbre.iconKey}
                          size={24}
                          className={`w-6 h-6 ${isActive ? 'text-white' : tc.text}`}
                        />
                      </div>

                      {/* Informações Centrais do Timbre */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-sm font-extrabold ${isActive ? 'text-white' : 'text-slate-100 group-hover:text-white'}`}>
                            {timbre.label}
                          </span>

                          {timbre.presetOrigin && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/15">
                              {timbre.presetOrigin}
                            </span>
                          )}

                          {isActive && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border flex items-center gap-1.5 ${tc.badge}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Ativo
                            </span>
                          )}
                        </div>

                        {/* Subtítulo nítido */}
                        <div className="text-xs font-semibold text-slate-200 mb-1">
                          {timbre.subtitle}
                        </div>

                        {/* Descrição em alto contraste para leitura clara */}
                        <p className="text-xs text-slate-300 leading-relaxed font-normal mb-2">
                          {timbre.description}
                        </p>

                        {/* Tags Técnicas de Áudio (Multi-Velocity, Round-Robin, Leslie FX, etc.) */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {timbre.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.08] text-slate-200 border border-white/15 tracking-tight group-hover:border-white/25"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botão de Pré-escuta / Audition */}
                      <button
                        type="button"
                        onClick={(e) => handleAudition(e, timbre.id)}
                        className={`p-2 rounded-xl border shrink-0 transition-all flex items-center justify-center ${
                          preview === timbre.id
                            ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50 scale-110 shadow-lg shadow-emerald-950/50'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/15 hover:text-white hover:border-white/25'
                        }`}
                        title="Pré-ouvir nota teste (C4)"
                      >
                        {preview === timbre.id ? (
                          <span className="text-xs font-bold animate-pulse">🔊</span>
                        ) : (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Rodapé Informativo da Sound Engine ─────────────────────── */}
          <div className="px-5 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Síntese Físico-Harmônica • Convolver Reverb • 32 Vozes Polifônicas</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Latência &lt;10ms</span>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div
      data-timbre-selector
      className={`relative inline-block ${className}`}
    >
      {/* Botão Gatilho com Ícone Vetorial Outline e Estética Premium */}
      <button
        ref={triggerRef}
        id="timbre-selector-trigger"
        onClick={handleOpen}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
          open
            ? `${currentColor.activeBg} ${currentColor.border} ring-1 ${currentColor.ring} shadow-lg`
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }`}
        title={`Timbre Atual: ${currentTimbre.label} (${currentTimbre.subtitle})`}
      >
        <div className={`p-1 rounded-lg border ${currentColor.iconBg}`}>
          <TimbreIcon iconKey={currentTimbre.iconKey} size={16} className={`w-4 h-4 ${currentColor.text}`} />
        </div>

        {!compact && (
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] text-slate-400 leading-none uppercase tracking-wider font-bold">
              Timbre
            </span>
            <span className="text-xs font-bold text-white leading-tight">
              {currentTimbre.label}
            </span>
          </div>
        )}

        {compact && (
          <span className="text-xs font-bold text-white tracking-wide">
            {currentTimbre.label}
          </span>
        )}

        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-white' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown via Portal — sempre acima de tudo */}
      {dropdownPortal}
    </div>
  );
};
