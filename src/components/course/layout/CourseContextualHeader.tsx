import React from 'react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

export type CourseThemeColor = 'indigo' | 'amber' | 'cyan' | 'purple';

export interface CourseContextualHeaderProps {
  courseTitle: string;
  courseIcon?: React.ReactNode;
  currentLessonCode: string;
  totalLessons: number;
  completedLessonsCount: number;
  onOpenTrail: () => void;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  accentColor?: CourseThemeColor;
}

export const CourseContextualHeader: React.FC<CourseContextualHeaderProps> = ({
  courseTitle,
  courseIcon,
  currentLessonCode,
  totalLessons,
  completedLessonsCount,
  onOpenTrail,
  onPrevLesson,
  onNextLesson,
  hasPrevLesson,
  hasNextLesson,
  accentColor = 'indigo',
}) => {
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const colorStyles = {
    indigo: {
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30',
      bar: 'bg-indigo-500',
      accentText: 'text-indigo-400',
      activeBtn: 'text-indigo-200 hover:text-white hover:bg-indigo-600/30 border-indigo-500/30',
    },
    amber: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30',
      bar: 'bg-amber-500',
      accentText: 'text-amber-400',
      activeBtn: 'text-amber-200 hover:text-white hover:bg-amber-600/30 border-amber-500/30',
    },
    cyan: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30',
      bar: 'bg-cyan-500',
      accentText: 'text-cyan-400',
      activeBtn: 'text-cyan-200 hover:text-white hover:bg-cyan-600/30 border-cyan-500/30',
    },
    purple: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30',
      bar: 'bg-purple-500',
      accentText: 'text-purple-400',
      activeBtn: 'text-purple-200 hover:text-white hover:bg-purple-600/30 border-purple-500/30',
    },
  }[accentColor];

  return (
    <div
      className="w-full h-[36px] max-h-[36px] px-3 sm:px-4 flex items-center justify-between gap-2 bg-[#0c0b18] border-b border-white/5 select-none text-xs"
      role="region"
      aria-label="Navegação contextual do curso"
    >
      {/* 1. Identificação do Curso (Esquerda) */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm shrink-0 flex items-center">{courseIcon}</span>
        <h2 className="font-display font-bold text-white tracking-tight truncate text-[11px] sm:text-xs">
          {courseTitle}
        </h2>
      </div>

      {/* 2. Botão de Acesso à Trilha & Barra de Progresso (Centro) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onOpenTrail}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shadow-sm ${colorStyles.badge}`}
          title="Abrir mapa completo da Trilha de Aprendizado (Modal)"
          aria-haspopup="dialog"
        >
          <Compass className="w-3 h-3 animate-spin-slow shrink-0" />
          <span>TRILHA ({currentLessonCode} / {totalLessons})</span>
        </button>

        {/* Barra de Progresso Compacta */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="hidden lg:inline">Progresso:</span>
          <div className="w-16 xl:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full ${colorStyles.bar} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-slate-300">{progressPercent}%</span>
        </div>
      </div>

      {/* 3. Navegação entre Aulas: Anterior / Próxima (Direita) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onPrevLesson}
          disabled={!hasPrevLesson}
          className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-medium transition-all ${
            hasPrevLesson
              ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer'
              : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
          }`}
          title={hasPrevLesson ? 'Ir para a aula anterior' : 'Você está na primeira lição'}
        >
          <ChevronLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <button
          onClick={onNextLesson}
          disabled={!hasNextLesson}
          className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-bold transition-all ${
            hasNextLesson
              ? `${colorStyles.activeBtn} bg-white/5 border-white/10 cursor-pointer`
              : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
          }`}
          title={hasNextLesson ? 'Ir para a próxima aula' : 'Você concluiu a última aula do curso'}
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
