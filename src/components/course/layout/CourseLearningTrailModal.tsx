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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Expande inicialmente o módulo que contém a aula ativa
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
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, activeLessonId, modules]);

  // Listener para ESC fechar o modal
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

  // Totalizadores
  const totalLessons = useMemo(() => {
    return modules.reduce((acc, m) => acc + m.lessons.length, 0);
  }, [modules]);

  const completedCount = useMemo(() => {
    return completedLessonIds.length;
  }, [completedLessonIds]);

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Filtragem pela busca
  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return modules;

    return modules
      .map((mod) => {
        const matchesModTitle = mod.title.toLowerCase().includes(q) || mod.code.toLowerCase().includes(q);
        const matchingLessons = mod.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            (l.subtitle && l.subtitle.toLowerCase().includes(q)) ||
            (l.level && l.level.toLowerCase().includes(q))
        );

        if (matchesModTitle) return mod;
        if (matchingLessons.length > 0) {
          return { ...mod, lessons: matchingLessons };
        }
        return null;
      })
      .filter((m): m is TrailModuleItem => m !== null);
  }, [modules, searchQuery]);

  if (!isOpen) return null;

  const colorStyles = {
    indigo: {
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      activeItem: 'bg-indigo-600/30 border-indigo-500/50 text-white shadow-md shadow-indigo-600/20',
      activeIcon: 'bg-indigo-500 text-white',
      bar: 'bg-indigo-500',
      headerGlow: 'from-indigo-900/40 via-purple-900/20 to-transparent',
    },
    amber: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeItem: 'bg-amber-600/30 border-amber-500/50 text-white shadow-md shadow-amber-600/20',
      activeIcon: 'bg-amber-500 text-white',
      bar: 'bg-amber-500',
      headerGlow: 'from-amber-900/40 via-orange-900/20 to-transparent',
    },
    cyan: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      activeItem: 'bg-cyan-600/30 border-cyan-500/50 text-white shadow-md shadow-cyan-600/20',
      activeIcon: 'bg-cyan-500 text-white',
      bar: 'bg-cyan-500',
      headerGlow: 'from-cyan-900/40 via-blue-900/20 to-transparent',
    },
    purple: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      activeItem: 'bg-purple-600/30 border-purple-500/50 text-white shadow-md shadow-purple-600/20',
      activeIcon: 'bg-purple-500 text-white',
      bar: 'bg-purple-500',
      headerGlow: 'from-purple-900/40 via-pink-900/20 to-transparent',
    },
  }[accentColor];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-[95vw] sm:w-[90vw] lg:w-[85vw] max-w-5xl h-[90vh] sm:h-[85vh] max-h-[820px] rounded-3xl bg-[#0b0a17] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* 1. Topo do Modal: Título, Fechar e Progresso Geral */}
        <div className={`p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r ${colorStyles.headerGlow} shrink-0`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                <BookOpen className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Trilha de Aprendizado Passo a Passo
                </span>
                <h2 id="trail-modal-title" className="text-base sm:text-lg font-black font-display text-white">
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
                <span className="hidden sm:inline">Fechar</span>
              </button>
            </div>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-3 text-slate-300">
              <span>
                <strong className="text-white">{completedCount}</strong> de <strong className="text-white">{totalLessons}</strong> lições concluídas
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
              <span className="font-bold text-white min-w-[36px] text-right">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* 2. Campo de Busca Instantânea */}
        <div className="p-3 sm:p-4 bg-black/30 border-b border-white/5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Pesquisar lição por nome, assunto ou conceito pedagógico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Lista Sanfonada de Módulos e Lições */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {filteredModules.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">Nenhuma aula encontrada para "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Limpar filtro
              </button>
            </div>
          ) : (
            filteredModules.map((mod) => {
              const isExpanded = searchQuery.trim() !== '' || expandedModules[mod.code] !== false;
              const modCompletedCount = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
              const isModAllCompleted = mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;

              return (
                <div
                  key={mod.code}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all"
                >
                  {/* Cabeçalho do Módulo */}
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
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isModAllCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}
                      >
                        {modCompletedCount} / {mod.lessons.length} Concluído
                      </span>
                    </div>
                  </button>

                  {/* Lista de Lições do Módulo */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-white/5 pt-2">
                      {mod.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        const isDone = completedLessonIds.includes(lesson.id);
                        const isLocked = lesson.isLocked;

                        return (
                          <button
                            key={lesson.id}
                            disabled={isLocked}
                            onClick={() => {
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
                              {/* Status Icon */}
                              <div className="shrink-0">
                                {isDone ? (
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                ) : isActive ? (
                                  <div className={`w-6 h-6 rounded-full ${colorStyles.activeIcon} flex items-center justify-center shadow-md animate-pulse`}>
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                  </div>
                                ) : isLocked ? (
                                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500">
                                    <Lock className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-xs font-mono">
                                    ○
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-bold truncate text-white">
                                    {lesson.title}
                                  </span>
                                  {isActive && (
                                    <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white/20 text-white uppercase">
                                      Aula Atual
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

        {/* 4. Rodapé do Modal com Informações e Dica de Acessibilidade */}
        <div className="p-3 px-5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
          <span>Selecione qualquer aula para carregá-la imediatamente.</span>
          <span className="hidden sm:inline">Pressione [Esc] ou clique fora para fechar</span>
        </div>
      </div>
    </div>
  );
};
