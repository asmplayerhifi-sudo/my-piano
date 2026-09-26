import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Settings,
  CheckCircle2,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export type CourseThemeColor = 'indigo' | 'amber' | 'cyan' | 'purple';

export interface CourseSubTabItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
}

export interface CourseContextualHeaderProps {
  courseTitle: string;
  courseShortTitle?: string;
  courseIcon?: React.ReactNode;
  currentLessonCode: string;
  totalLessons: number;
  completedLessonsCount: number;
  lessonTitle: string;
  lessonLevel?: string;
  onOpenTrail: () => void;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  tabs?: CourseSubTabItem[];
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  accentColor?: CourseThemeColor;
  rightSlot?: React.ReactNode;
}

export const CourseContextualHeader: React.FC<CourseContextualHeaderProps> = ({
  courseTitle,
  courseShortTitle,
  courseIcon = '🎓',
  currentLessonCode,
  totalLessons,
  completedLessonsCount,
  lessonTitle,
  lessonLevel,
  onOpenTrail,
  onPrevLesson,
  onNextLesson,
  hasPrevLesson,
  hasNextLesson,
  tabs = [],
  activeTabId,
  onSelectTab,
  isCompleted = false,
  onToggleComplete,
  accentColor = 'indigo',
  rightSlot,
}) => {
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  // Fecha o modal de opções com a tecla Escape
  useEffect(() => {
    if (!isOptionsModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOptionsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOptionsModalOpen]);

  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const shortTitle = courseShortTitle || courseTitle.replace(/^Curso (de )?/, '');

  const colorStyles = {
    indigo: {
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30',
      bar: 'bg-indigo-500',
      activeTab: 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30',
      activeBtn: 'text-indigo-200 hover:text-white hover:bg-indigo-600/30 border-indigo-500/40',
      btnConclude: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      accentText: 'text-indigo-400',
    },
    amber: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
      bar: 'bg-amber-500',
      activeTab: 'bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-600/30',
      activeBtn: 'text-amber-200 hover:text-white hover:bg-amber-600/30 border-amber-500/40',
      btnConclude: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black',
      accentText: 'text-amber-400',
    },
    cyan: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30',
      bar: 'bg-cyan-500',
      activeTab: 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30',
      activeBtn: 'text-cyan-200 hover:text-white hover:bg-cyan-600/30 border-cyan-500/40',
      btnConclude: 'bg-cyan-600 hover:bg-cyan-500 text-white',
      accentText: 'text-cyan-400',
    },
    purple: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
      bar: 'bg-purple-500',
      activeTab: 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30',
      activeBtn: 'text-purple-200 hover:text-white hover:bg-purple-600/30 border-purple-500/40',
      btnConclude: 'bg-purple-600 hover:bg-purple-500 text-white',
      accentText: 'text-purple-400',
    },
  }[accentColor];

  // ── Renderização das Abas de Estudo ──────────────────────────────────────────
  const renderStudyTabs = (isCompact = false) => {
    if (!tabs || tabs.length === 0) return null;

    return (
      <div className="flex items-center bg-black/50 p-0.5 rounded-xl border border-white/10 shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectTab?.(tab.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? colorStyles.activeTab
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span className={isCompact ? 'inline' : 'hidden md:inline'}>
                {isCompact ? tab.shortLabel || tab.label : tab.label}
              </span>
              {!isCompact && (
                <span className="inline md:hidden">
                  {tab.shortLabel || tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        className="w-full h-[44px] min-h-[44px] max-h-[44px] px-3 sm:px-4 flex items-center justify-between gap-2.5 bg-[#0c0b18] border-b border-white/10 select-none text-xs z-30"
        role="region"
        aria-label="Barra unificada de contexto e navegação do curso"
      >
        {/* ── 1. LADO ESQUERDO: Identificação do Curso & Lição Ativa ───────── */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
          {/* Nome do Curso com Ícone */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-base leading-none">{courseIcon}</span>
            <span className="font-display font-bold text-white text-xs sm:text-sm tracking-tight hidden lg:inline">
              {courseTitle}
            </span>
            <span className="font-display font-bold text-white text-xs tracking-tight lg:hidden inline">
              {shortTitle}
            </span>
          </div>

          {/* Divisor Visual */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Badge do Nível (Verde / Destaque) */}
          {lessonLevel && (
            <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lessonLevel}</span>
            </span>
          )}

          {/* Título da Lição Ativa */}
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-mono font-bold text-white text-xs sm:text-sm shrink-0">
              Lição {currentLessonCode}:
            </span>
            <h3
              className="font-semibold text-slate-200 text-xs sm:text-sm truncate max-w-[140px] sm:max-w-xs xl:max-w-md"
              title={lessonTitle}
            >
              {lessonTitle}
            </h3>
          </div>
        </div>

        {/* ── 2. CENTRO E DIREITA: Trilha, Abas de Conteúdo e Ações ────────── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Botão de Trilha & Progresso */}
          <button
            onClick={onOpenTrail}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer shadow-sm ${colorStyles.badge}`}
            title="Abrir Trilha Completa de Aulas (Modal) [Ctrl+T / Cmd+T]"
            aria-haspopup="dialog"
          >
            <Compass className="w-3.5 h-3.5 animate-spin-slow shrink-0" />
            <span className="hidden 2xl:inline">
              TRILHA ({currentLessonCode}/{totalLessons}) {progressPercent}%
            </span>
            <span className="2xl:hidden hidden md:inline">
              TRILHA ({currentLessonCode}/{totalLessons})
            </span>
            <span className="md:hidden inline font-bold">
              {currentLessonCode}/{totalLessons}
            </span>
          </button>

          {/* Divisor Visual (apenas telas grandes) */}
          <div className="hidden lg:block w-px h-5 bg-white/10 shrink-0" />

          {/* Abas de Estudo em Desktop / Telas Médias (>= 1024px) */}
          <div className="hidden lg:flex items-center">
            {renderStudyTabs(false)}
          </div>

          {/* Divisor Visual (apenas telas grandes) */}
          <div className="hidden lg:block w-px h-5 bg-white/10 shrink-0" />

          {/* Slot Customizado (se fornecido) */}
          {rightSlot && <div className="hidden xl:flex items-center shrink-0">{rightSlot}</div>}

          {/* Botão Concluir Lição (visível diretamente em telas >= 1024px) */}
          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : `${colorStyles.btnConclude} shadow-sm`
              }`}
              title={isCompleted ? 'Lição concluída! Clique para desmarcar' : 'Marcar lição como concluída'}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Concluída' : 'Concluir'}</span>
            </button>
          )}

          {/* Botão [⚙️ Opções & Modos] (visível em telas < 1024px para abrir Drawer/Modal) */}
          <button
            onClick={() => setIsOptionsModalOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all cursor-pointer shrink-0"
            title="Abrir Modos e Opções da Aula"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Opções &amp; Modos</span>
            <span className="sm:hidden inline">Opções</span>
          </button>

          {/* Divisor Visual de Navegação */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Controles de Navegação Anterior / Próxima */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onPrevLesson}
              disabled={!hasPrevLesson}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                hasPrevLesson
                  ? 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer active:scale-95'
                  : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
              }`}
              title={hasPrevLesson ? 'Ir para a lição anterior' : 'Primeira lição'}
              aria-label="Lição Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xl:inline">Anterior</span>
            </button>

            <button
              onClick={onNextLesson}
              disabled={!hasNextLesson}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                hasNextLesson
                  ? `${colorStyles.activeBtn} bg-white/5 border-white/10 cursor-pointer active:scale-95`
                  : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
              }`}
              title={hasNextLesson ? 'Ir para a próxima lição' : 'Última lição'}
              aria-label="Próxima Lição"
            >
              <span className="hidden xl:inline">Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. MODAL OVERLAY: Opções & Modos da Aula (Telas < 1024px) ───────── */}
      {isOptionsModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="modal-overlay-responsive z-[9999] select-none"
            onClick={() => setIsOptionsModalOpen(false)}
          >
            <div
              className="modal-sheet-responsive md:max-w-lg bg-[#0e0d22] text-slate-100 p-5 sm:p-6 space-y-4 max-h-[90vh] md:max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra de arraste/indicador visual para mobile */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 mb-2 md:hidden shrink-0" />

              {/* Cabeçalho do Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white">
                      Navegação e Modos da Aula
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configurações de estudo e atalhos rápidos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOptionsModalOpen(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer active:scale-95"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Seção 1: Curso Ativo & Lição */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Curso Ativo:</span>
                </span>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{courseIcon}</span>
                  <span>{courseTitle}</span>
                  {lessonLevel && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {lessonLevel}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-300 font-medium pt-1">
                  <strong>Lição {currentLessonCode}:</strong> {lessonTitle}
                </p>
              </div>

              {/* Seção 2: Trilha de Aprendizado */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Trilha de Aprendizado:</span>
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => {
                      setIsOptionsModalOpen(false);
                      onOpenTrail();
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${colorStyles.badge}`}
                  >
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    <span>Ver Trilha Completa ({currentLessonCode} / {totalLessons})</span>
                  </button>
                  <div className="flex items-center justify-between sm:justify-start gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5 text-xs font-mono">
                    <span className="text-slate-400">Progresso:</span>
                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${colorStyles.bar} rounded-full transition-all duration-300`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <strong className="text-white">{progressPercent}%</strong>
                  </div>
                </div>
              </div>

              {/* Seção 3: Modos de Estudo (Sub-Abas) */}
              {tabs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Modos de Estudo Visíveis:</span>
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {tabs.map((tab) => {
                      const isActive = tab.id === activeTabId;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            onSelectTab?.(tab.id);
                            setIsOptionsModalOpen(false);
                          }}
                          className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? `${colorStyles.activeTab} border-white/20`
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {tab.icon && <span>{tab.icon}</span>}
                            <span>{tab.label}</span>
                          </div>
                          {isActive && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seção 4: Navegação Entre Lições */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Navegação Entre Lições:</span>
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      onPrevLesson();
                      setIsOptionsModalOpen(false);
                    }}
                    disabled={!hasPrevLesson}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      hasPrevLesson
                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer'
                        : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Lição Anterior</span>
                  </button>

                  <button
                    onClick={() => {
                      onNextLesson();
                      setIsOptionsModalOpen(false);
                    }}
                    disabled={!hasNextLesson}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      hasNextLesson
                        ? `${colorStyles.btnConclude} cursor-pointer`
                        : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>Próxima Lição</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Seção 5: Status de Conclusão */}
              {onToggleComplete && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      onToggleComplete();
                      setIsOptionsModalOpen(false);
                    }}
                    className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : `${colorStyles.btnConclude} shadow-lg shadow-indigo-600/25`
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? 'Lição Concluída (Clique para reabrir)' : 'Marcar Lição como Concluída'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
