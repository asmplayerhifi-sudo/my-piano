import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Play,
  Lock,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Filter,
} from 'lucide-react';
import type { CourseThemeColor } from './CourseContextualHeader';

export interface TrailLessonItem {
  id: string;
  title: string;
  subtitle?: string;
  level?: string;
  durationMinutes?: number;
  readingTimeMinutes?: number;
  moduleCode?: string;
  isLocked?: boolean;
}

export interface TrailModuleItem {
  id?: string;
  code: string;
  title: string;
  phase?: string;
  isLocked?: boolean;
  lessons: TrailLessonItem[];
}

export interface CourseLearningTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  modules: TrailModuleItem[];
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lesson: TrailLessonItem, module: TrailModuleItem) => void;
  accentColor?: CourseThemeColor;
}

export const CourseLearningTrailModal: React.FC<CourseLearningTrailModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  modules,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  accentColor = 'indigo',
}) => {
  // RF-03: Busca com debounce de 200ms
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  // RF-04: Módulos expansíveis/retráteis
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Debounce de 200ms para busca fluida
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Ao abrir o modal, foca o campo de busca e expande o módulo que contém a aula ativa
  useEffect(() => {
    if (isOpen) {
      const activeModule = modules.find((m) =>
        m.lessons.some((l) => l.id === activeLessonId)
      );
      if (activeModule) {
        setExpandedModules((prev) => ({ ...prev, [activeModule.code]: true }));
      } else if (modules[0]) {
        setExpandedModules((prev) => ({ ...prev, [modules[0].code]: true }));
      }
      const focusTimer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen, activeLessonId, modules]);

  // Cenário 3 / BDD: Listener para ESC fechar o modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleModule = (code: string) => {
    setExpandedModules((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Totalizadores globais
  const totalLessons = useMemo(() => {
    return modules.reduce((acc, m) => acc + m.lessons.length, 0);
  }, [modules]);

  const completedCount = useMemo(() => {
    return completedLessonIds.length;
  }, [completedLessonIds]);

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Filtragem composta: Busca (200ms) + Filtros Rápidos (Todas / Concluídas / Em Andamento)
  const filteredModules = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    return modules
      .map((mod) => {
        const matchingLessons = mod.lessons.filter((l) => {
          const isDone = completedLessonIds.includes(l.id);

          // 1. Filtros Rápidos
          if (quickFilter === 'completed' && !isDone) return false;
          if (quickFilter === 'in_progress' && isDone) return false;

          // 2. Busca textual
          if (!q) return true;
          return (
            l.title.toLowerCase().includes(q) ||
            (l.subtitle && l.subtitle.toLowerCase().includes(q)) ||
            (l.level && l.level.toLowerCase().includes(q)) ||
            mod.title.toLowerCase().includes(q) ||
            mod.code.toLowerCase().includes(q)
          );
        });

        const matchesModTitle =
          !q || mod.title.toLowerCase().includes(q) || mod.code.toLowerCase().includes(q);

        if (matchingLessons.length > 0) {
          return { ...mod, lessons: matchingLessons };
        }
        if (matchesModTitle && quickFilter === 'all' && q !== '') {
          return mod;
        }
        return null;
      })
      .filter((m): m is TrailModuleItem => m !== null);
  }, [modules, debouncedQuery, quickFilter, completedLessonIds]);

  if (!isOpen) return null;

  const colorStyles = {
    indigo: {
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      activeItem:
        'bg-indigo-600/30 border-indigo-500/60 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-400',
      activeBadge: 'bg-indigo-500 text-white font-mono',
      activeIcon: 'bg-indigo-500 text-white',
      bar: 'bg-indigo-500',
      headerGlow: 'from-indigo-950/60 via-purple-950/30 to-transparent',
      quickFilterActive:
        'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-bold shadow-sm',
    },
    amber: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeItem:
        'bg-amber-600/30 border-amber-500/60 text-white shadow-lg shadow-amber-600/25 ring-1 ring-amber-400',
      activeBadge: 'bg-amber-500 text-slate-950 font-mono',
      activeIcon: 'bg-amber-500 text-slate-950',
      bar: 'bg-amber-500',
      headerGlow: 'from-amber-950/60 via-orange-950/30 to-transparent',
      quickFilterActive:
        'bg-amber-600/30 border-amber-400 text-amber-200 font-bold shadow-sm',
    },
    cyan: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      activeItem:
        'bg-cyan-600/30 border-cyan-500/60 text-white shadow-lg shadow-cyan-600/25 ring-1 ring-cyan-400',
      activeBadge: 'bg-cyan-500 text-slate-950 font-mono',
      activeIcon: 'bg-cyan-500 text-slate-950',
      bar: 'bg-cyan-500',
      headerGlow: 'from-cyan-950/60 via-blue-950/30 to-transparent',
      quickFilterActive:
        'bg-cyan-600/30 border-cyan-400 text-cyan-200 font-bold shadow-sm',
    },
    purple: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      activeItem:
        'bg-purple-600/30 border-purple-500/60 text-white shadow-lg shadow-purple-600/25 ring-1 ring-purple-400',
      activeBadge: 'bg-purple-500 text-white font-mono',
      activeIcon: 'bg-purple-500 text-white',
      bar: 'bg-purple-500',
      headerGlow: 'from-purple-950/60 via-pink-950/30 to-transparent',
      quickFilterActive:
        'bg-purple-600/30 border-purple-400 text-purple-200 font-bold shadow-sm',
    },
  }[accentColor];

  return (
    /* RF-02 & Seção 4: Overlay com backdrop-filter blur 4px, background rgba(0,0,0,0.6), z-index 2000 */
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn"
      style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trail-modal-title"
      onClick={(e) => {
        // Cenário 3 / BDD: Clique fora do modal fecha sem alterar
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Seção 4: Dimensões width: 85vw; max-width: 1000px; height: 80vh; max-height: 750px; */}
      <div
        ref={modalRef}
        className="w-[85vw] max-w-[1000px] h-[80vh] max-h-[750px] rounded-3xl bg-[#0b0a17] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* 1. TOPO DO MODAL (Wireframe: [H] 🗺️ TRILHA DE APRENDIZADO — CURSO ... [ X Fechar ]) */}
        <div
          className={`p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r ${colorStyles.headerGlow} shrink-0`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                <BookOpen className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Visão Geral &amp; Navegação da Trilha
                </span>
                <h2
                  id="trail-modal-title"
                  className="text-sm sm:text-base md:text-lg font-black font-display text-white tracking-tight"
                >
                  🗺️ TRILHA DE APRENDIZADO — {courseTitle.toUpperCase()}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                title="Fechar modal (Esc)"
              >
                <X className="w-4 h-4" />
                <span>[ X Fechar ]</span>
              </button>
            </div>
          </div>

          {/* Barra de Progresso do Curso */}
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-3 text-slate-300">
              <span>
                <strong className="text-white">{completedCount}</strong> de{' '}
                <strong className="text-white">{totalLessons}</strong> aulas concluídas
              </span>
              <span>•</span>
              <span className="text-slate-400">{modules.length} Módulos</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-64">
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full ${colorStyles.bar} transition-all duration-300`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-white min-w-[36px] text-right">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. ÁREA DE BUSCA (RF-03) & FILTROS RÁPIDOS (Wireframe) */}
        <div className="p-3 sm:p-4 bg-black/40 border-b border-white/5 shrink-0 space-y-3">
          {/* Input de Busca com autoFocus e botão [ Limpar ] */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="🔍 Pesquisar aula: Ex: Dó Central, Acordes, Clave de Sol..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setDebouncedQuery('');
                  searchInputRef.current?.focus();
                }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Limpar busca"
              >
                [ Limpar ]
              </button>
            )}
          </div>

          {/* Filtros Rápidos conforme Wireframe: [ (x) Todas as Aulas ] [ ( ) Concluídas ] [ ( ) Em Andamento ] */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs text-slate-300">
            <span className="font-bold text-slate-400 text-[11px] uppercase font-mono flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Filtros Rápidos:</span>
            </span>

            <button
              onClick={() => setQuickFilter('all')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                quickFilter === 'all'
                  ? colorStyles.quickFilterActive
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-mono">{quickFilter === 'all' ? '(x)' : '( )'}</span>
              <span>Todas as Aulas</span>
            </button>

            <button
              onClick={() => setQuickFilter('completed')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                quickFilter === 'completed'
                  ? colorStyles.quickFilterActive
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-mono">{quickFilter === 'completed' ? '(x)' : '( )'}</span>
              <span>Concluídas</span>
            </button>

            <button
              onClick={() => setQuickFilter('in_progress')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                quickFilter === 'in_progress'
                  ? colorStyles.quickFilterActive
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-mono">{quickFilter === 'in_progress' ? '(x)' : '( )'}</span>
              <span>Em Andamento</span>
            </button>
          </div>
        </div>

        {/* 3. LISTA SANFONADA (RF-04: Módulos em Accordion) & INDICADORES DE STATUS (RF-05) */}
        {/* Seção 4: overflow-y: auto para rolagem suave */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {filteredModules.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">
                Nenhuma aula encontrada para "{debouncedQuery || quickFilter}".
              </p>
              <button
                onClick={() => {
                  setSearchInput('');
                  setDebouncedQuery('');
                  setQuickFilter('all');
                }}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            filteredModules.map((mod) => {
              const isExpanded =
                debouncedQuery.trim() !== '' || expandedModules[mod.code] !== false;
              const modCompletedCount = mod.lessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              const isModAllCompleted =
                mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;
              const modPercent =
                mod.lessons.length > 0
                  ? Math.round((modCompletedCount / mod.lessons.length) * 100)
                  : 0;
              const isModLocked =
                mod.isLocked ||
                (mod.lessons.length > 0 && mod.lessons.every((l) => l.isLocked));

              return (
                <div
                  key={mod.code}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all"
                >
                  {/* Cabeçalho do Módulo (Accordion) com seta ▼ ou ▶ */}
                  <button
                    onClick={() => toggleModule(mod.code)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-300">
                            {mod.code}
                          </span>
                          <span className="text-sm font-bold text-white truncate">
                            {mod.title}
                          </span>
                        </div>
                        {mod.phase && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {mod.phase}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 ml-2">
                      {isModLocked ? (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-white/10 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>[🔒 Bloqueado]</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                            isModAllCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                              : 'bg-white/5 text-slate-400 border-white/10'
                          }`}
                        >
                          [Progresso: {modCompletedCount}/{mod.lessons.length} | {modPercent}%]
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Lista de Lições do Módulo */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-white/5 pt-2">
                      {mod.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        const isDone = completedLessonIds.includes(lesson.id);
                        const isLocked = lesson.isLocked || isModLocked;

                        return (
                          <button
                            key={lesson.id}
                            disabled={isLocked}
                            onClick={() => {
                              // RF-06: Navegação Direta e Fechamento Instantâneo
                              onSelectLesson(lesson, mod);
                              onClose();
                            }}
                            className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                              isLocked
                                ? 'opacity-50 cursor-not-allowed bg-black/20 border-white/5 text-slate-500'
                                : isActive
                                ? `${colorStyles.activeItem} cursor-pointer`
                                : 'bg-white/[0.01] hover:bg-white/[0.05] border-white/5 text-slate-300 hover:text-white cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Status Icon (RF-05) */}
                              <div className="shrink-0">
                                {isDone ? (
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                ) : isActive ? (
                                  <div
                                    className={`w-6 h-6 rounded-full ${colorStyles.activeIcon} flex items-center justify-center shadow-md animate-pulse`}
                                  >
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                  </div>
                                ) : isLocked ? (
                                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500">
                                    <Lock className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-xs font-mono">
                                    <Play className="w-2.5 h-2.5 text-slate-400" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs sm:text-sm font-bold truncate text-white">
                                    {lesson.title}
                                  </span>

                                  {/* Badge da Aula Ativa Conforme Wireframe: <--- (AULA ATIVA) */}
                                  {isActive && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/20 text-white uppercase tracking-wider">
                                      <span>&lt;--- (AULA ATIVA)</span>
                                    </span>
                                  )}
                                </div>
                                {lesson.subtitle && (
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                    {lesson.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono text-slate-400">
                              {lesson.level && (
                                <span className="hidden md:inline px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                                  {lesson.level}
                                </span>
                              )}
                              {(lesson.durationMinutes || lesson.readingTimeMinutes) && (
                                <span className="text-slate-500">
                                  {lesson.durationMinutes || lesson.readingTimeMinutes} min
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 4. RODAPÉ DO MODAL (Dica de Acessibilidade e Teclas) */}
        <div className="p-3 px-5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
          <span>Selecione qualquer aula para carregá-la imediatamente no Canvas.</span>
          <span className="hidden sm:inline">Pressione [Esc] ou clique fora para fechar</span>
        </div>
      </div>
    </div>
  );
};
