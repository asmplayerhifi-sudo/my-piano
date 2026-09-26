import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { soundEngine, TIMBRES, type TimbreId } from '../../core/soundEngine';
import { musicalPlaybackEngine } from '../../core/musicalPlaybackEngine';

interface TimbreSelectorProps {
  /** Posição compacta: exibe apenas o badge com timbre atual + dropdown */
  compact?: boolean;
  className?: string;
  onTimbreChange?: (id: TimbreId) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  keyboard: 'Teclado',
  strings: 'Cordas',
  wind: 'Sopros',
  synth: 'Síntese',
  pluck: 'Dedilhado',
};

const CATEGORY_COLORS: Record<string, string> = {
  keyboard: 'indigo',
  strings: 'amber',
  wind: 'cyan',
  synth: 'purple',
  pluck: 'orange',
};

const colorClasses: Record<string, { dot: string; badge: string; ring: string; activeBg: string; border: string }> = {
  indigo: {
    dot: 'bg-indigo-400',
    badge: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
    ring: 'ring-indigo-500/60',
    activeBg: 'bg-indigo-500/20 border-indigo-500/60',
    border: 'border-indigo-500/30',
  },
  amber: {
    dot: 'bg-amber-400',
    badge: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    ring: 'ring-amber-500/60',
    activeBg: 'bg-amber-500/20 border-amber-500/60',
    border: 'border-amber-500/30',
  },
  cyan: {
    dot: 'bg-cyan-400',
    badge: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
    ring: 'ring-cyan-500/60',
    activeBg: 'bg-cyan-500/20 border-cyan-500/60',
    border: 'border-cyan-500/30',
  },
  purple: {
    dot: 'bg-purple-400',
    badge: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
    ring: 'ring-purple-500/60',
    activeBg: 'bg-purple-500/20 border-purple-500/60',
    border: 'border-purple-500/30',
  },
  orange: {
    dot: 'bg-orange-400',
    badge: 'text-orange-300 bg-orange-500/15 border-orange-500/30',
    ring: 'ring-orange-500/60',
    activeBg: 'bg-orange-500/20 border-orange-500/60',
    border: 'border-orange-500/30',
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

  // Posição dinâmica do dropdown (calculada a partir do botão)
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /** Calcula onde o dropdown deve aparecer em coordenadas da janela */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropW = 340;
    const leftPos = Math.min(rect.left, window.innerWidth - dropW - 8);
    setDropPos({
      top: rect.bottom + 6 + window.scrollY,
      left: Math.max(8, leftPos) + window.scrollX,
    });
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(o => {
      if (!o) updatePosition();
      return !o;
    });
  }, [updatePosition]);

  // Recalcula posição ao rolar / redimensionar
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

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !triggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const currentTimbre = TIMBRES.find(t => t.id === selected)!;
  const currentColor = colorClasses[CATEGORY_COLORS[currentTimbre.category]];

  const handleSelect = (id: TimbreId) => {
    setSelected(id);
    soundEngine.setTimbre(id);
    onTimbreChange?.(id);
    setOpen(false);
    // Toca a nota de demonstração apenas se o player musical NÃO estiver reproduzindo
    if (!musicalPlaybackEngine.getIsPlaying()) {
      soundEngine.ensureAudioReady().then(() => {
        soundEngine.playPianoNote(60, 0.6);
      });
    }
  };

  const handleHover = (id: TimbreId) => {
    if (preview !== id) {
      setPreview(id);
      soundEngine.setTimbre(id);
      if (!musicalPlaybackEngine.getIsPlaying()) {
        soundEngine.playPianoNote(60, 0.35);
      }
      setTimeout(() => {
        setPreview(prev => {
          if (prev === id) soundEngine.setTimbre(selected);
          return null;
        });
      }, 1000);
    }
  };

  // Agrupa por categoria
  const grouped = TIMBRES.reduce<Record<string, typeof TIMBRES>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  // ── Dropdown renderizado via Portal (fora do stacking context) ─────────────
  const dropdownPortal = open && dropPos
    ? createPortal(
        <div
          ref={dropdownRef}
          data-timbre-dropdown
          style={{
            position: 'absolute',
            top: dropPos.top,
            left: dropPos.left,
            width: 340,
            zIndex: 99999,
          }}
          className="bg-[#0e0d24] border border-white/15 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden"
        >
          {/* Cabeçalho */}
          <div className="px-4 py-3 border-b border-white/8 bg-white/[0.02]">
            <p className="text-xs font-black text-white tracking-wide uppercase">🎹 Seletor de Timbres</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Passe o mouse para pré-ouvir</p>
          </div>

          {/* Lista por Categoria */}
          <div className="max-h-[420px] overflow-y-auto">
            {Object.entries(grouped).map(([category, items]) => {
              const catColor = colorClasses[CATEGORY_COLORS[category]];
              return (
                <div key={category}>
                  {/* Header da Categoria */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.015] sticky top-0 border-b border-white/5">
                    <span className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {CATEGORY_LABELS[category]}
                    </span>
                  </div>

                  {/* Items */}
                  {items.map(timbre => {
                    const isActive = timbre.id === selected;
                    const tc = colorClasses[CATEGORY_COLORS[timbre.category]];
                    return (
                      <button
                        key={timbre.id}
                        id={`timbre-btn-${timbre.id}`}
                        onClick={() => handleSelect(timbre.id)}
                        onMouseEnter={() => handleHover(timbre.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer border-b border-white/[0.03] last:border-0
                          ${isActive
                            ? `${tc.activeBg} border-l-2 ${tc.border}`
                            : 'hover:bg-white/[0.05] border-l-2 border-transparent'
                          }`}
                      >
                        <span className="text-xl">{timbre.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                              {timbre.label}
                            </span>
                            {isActive && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${tc.badge}`}>
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{timbre.description}</p>
                        </div>
                        {isActive && (
                          <div className={`w-1.5 h-1.5 rounded-full ${tc.dot} shrink-0`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Rodapé */}
          <div className="px-4 py-2.5 border-t border-white/8 bg-white/[0.02] flex items-center gap-2">
            <span className="text-[10px] text-slate-500">
              Síntese: Web Audio API • Reverb convoluído • Multi-parcial
            </span>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div
      data-timbre-selector
      className={`relative ${className}`}
    >
      {/* Botão Gatilho */}
      <button
        ref={triggerRef}
        id="timbre-selector-trigger"
        onClick={handleOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer
          ${open
            ? `${currentColor.activeBg} ${currentColor.border} ring-1 ${currentColor.ring}`
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
        title="Selecionar timbre"
      >
        <span className="text-base leading-none">{currentTimbre.emoji}</span>
        {!compact && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-slate-400 leading-none uppercase tracking-wider">Timbre</span>
            <span className="text-xs font-bold text-white leading-tight">{currentTimbre.label}</span>
          </div>
        )}
        {compact && (
          <span className="text-xs font-bold text-white">{currentTimbre.label}</span>
        )}
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
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
