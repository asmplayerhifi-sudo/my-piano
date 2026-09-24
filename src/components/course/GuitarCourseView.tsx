import React, { useState } from 'react';
import { GUITAR_COURSE_MODULES } from '../../core/coursesData';
import type { CourseLesson, CourseModule } from '../../core/coursesData';
import { FretboardView } from '../guitar/FretboardView';
import { CAGED_SHAPES_C_MAJOR } from '../guitar/CAGEDMapper';
import type { GuitarChordShape } from '../../core/types';
import {
  Guitar,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Layers,
  Zap,
} from 'lucide-react';

const COMMON_OPEN_CHORDS: Record<string, GuitarChordShape> = {
  'C': {
    name: 'Dó Maior (C)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    bassNote: 'C',
  },
  'Am': {
    name: 'Lá Menor (Am)',
    cagedLetter: 'A',
    rootNote: 'A',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    bassNote: 'A',
  },
  'Em': {
    name: 'Mi Menor (Em)',
    cagedLetter: 'E',
    rootNote: 'E',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    bassNote: 'E',
  },
  'G': {
    name: 'Sol Maior (G)',
    cagedLetter: 'G',
    rootNote: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    bassNote: 'G',
  },
  'D': {
    name: 'Ré Maior (D)',
    cagedLetter: 'D',
    rootNote: 'D',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    bassNote: 'D',
  },
  'F': {
    name: 'Fá Maior com Pestana (F)',
    cagedLetter: 'E',
    rootNote: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barreFret: 1,
    barreStrings: [1, 6],
    bassNote: 'F',
  },
};

export const GuitarCourseView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(GUITAR_COURSE_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(GUITAR_COURSE_MODULES[0].lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'theory' | 'fretboard' | 'transitions'>('theory');
  const [selectedChordKey, setSelectedChordKey] = useState<string>('C');
  const [selectedCagedLetter, setSelectedCagedLetter] = useState<'C' | 'A' | 'G' | 'E' | 'D'>('C');

  const handleSelectLesson = (lesson: CourseLesson, mod: CourseModule) => {
    setSelectedModule(mod);
    setActiveLesson(lesson);
    if (mod.code === 'V3' || mod.code === 'V4') {
      setActiveTab('fretboard');
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  const activeChordShape: GuitarChordShape =
    selectedModule.code === 'V3'
      ? CAGED_SHAPES_C_MAJOR[selectedCagedLetter]
      : COMMON_OPEN_CHORDS[selectedChordKey] || COMMON_OPEN_CHORDS['C'];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Banner Principal do Curso de Violão */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-[#26150b] to-[#120a05] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/40 shrink-0">
              <Guitar className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/30 text-amber-300 border border-amber-500/30">
                  Do Zero ao Avançado
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {completedLessonIds.length} lições concluídas
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Curso Interativo de Violão &amp; Guitarra
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
                Aprenda a tocar com som limpo sem zumbidos, domine a pestana sem dor, troque acordes com o dedo âncora e decodifique o braço com o Sistema CAGED.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Grade de Módulos (Esquerda) e Painel de Aula (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Grade de Lições e Módulos */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Trilha do Violão</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {GUITAR_COURSE_MODULES.length} Módulos
              </span>
            </div>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 no-scrollbar">
              {GUITAR_COURSE_MODULES.map((mod) => (
                <div key={mod.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-300 px-2">
                    <span>{mod.code}: {mod.title}</span>
                  </div>

                  <div className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isSelected = activeLesson.id === lesson.id;
                      const isDone = completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson, mod)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-600/30 border-amber-500 text-white shadow-md'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-white truncate">
                              {lesson.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {lesson.subtitle}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Palco da Lição Ativa */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  {selectedModule.code} • {activeLesson.level} • {activeLesson.durationMinutes} min
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  {activeLesson.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {activeLesson.subtitle}
                </p>
              </div>

              {/* Botões de Alternância de Abas */}
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 self-start sm:self-auto text-xs font-bold">
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'theory' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Teoria &amp; Postura
                </button>
                <button
                  onClick={() => setActiveTab('fretboard')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'fretboard' ? 'bg-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Braço &amp; Shapes
                </button>
                <button
                  onClick={() => setActiveTab('transitions')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'transitions' ? 'bg-cyan-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dedo Âncora
                </button>
              </div>
            </div>

            {/* Conteúdo 1: Teoria Didática da Lição */}
            {activeTab === 'theory' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{activeLesson.instructions.heading}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLesson.instructions.text}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 pt-1">
                    {activeLesson.instructions.bulletPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeLesson.instructions.fingeringTip && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    <strong className="text-amber-300">Dica de Digitação:</strong> {activeLesson.instructions.fingeringTip}
                  </div>
                )}

                {activeLesson.instructions.postureAlert && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300">Alerta de Postura:</strong> {activeLesson.instructions.postureAlert}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo 2: Braço & Mapeamento de Shapes */}
            {activeTab === 'fretboard' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                {/* Seletor de Shapes / CAGED */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{selectedModule.code === 'V3' ? 'Shapes do Sistema CAGED:' : 'Acordes Abertos Comuns:'}</span>
                  </span>

                  {selectedModule.code === 'V3' ? (
                    <div className="flex items-center gap-1.5">
                      {(['C', 'A', 'G', 'E', 'D'] as const).map((letter) => (
                        <button
                          key={letter}
                          onClick={() => setSelectedCagedLetter(letter)}
                          className={`w-8 h-8 rounded-xl font-black font-display text-xs cursor-pointer transition-all ${
                            selectedCagedLetter === letter
                              ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {Object.keys(COMMON_OPEN_CHORDS).map((chordKey) => (
                        <button
                          key={chordKey}
                          onClick={() => setSelectedChordKey(chordKey)}
                          className={`px-3 py-1 rounded-xl font-bold font-display text-xs cursor-pointer transition-all ${
                            selectedChordKey === chordKey
                              ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {chordKey}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Braço de Violão Interativo para Prática */}
                <div className="pt-2">
                  <FretboardView
                    chordShape={activeChordShape}
                    fretCount={14}
                    showNoteNames={false}
                  />
                </div>
              </div>
            )}

            {/* Conteúdo 3: Treino de Trocas com Dedo Âncora */}
            {activeTab === 'transitions' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Princípio do Dedo Âncora no Violão</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Quando dois acordes compartilham cordas e casas idênticas, não retire a mão inteira do braço!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                      <strong className="text-cyan-300 block mb-1">Transição C ➔ Am:</strong>
                      <p className="text-slate-300">
                        O Dedo 1 (2ª corda casa 1) e o Dedo 2 (4ª corda casa 2) são <strong>âncoras fixas</strong>. Apenas mova o Dedo 3 da 5ª corda para a 3ª corda casa 2!
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                      <strong className="text-amber-300 block mb-1">Transição G ➔ D:</strong>
                      <p className="text-slate-300">
                        Mantenha o Dedo 3 pousado na 2ª corda casa 3 como <strong>eixo pivô</strong> enquanto os outros dedos trocam de posição!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <FretboardView
                    chordShape={COMMON_OPEN_CHORDS['C']}
                    fretCount={14}
                    showNoteNames={false}
                  />
                </div>
              </div>
            )}

            {/* Rodapé da Aula: Botão Concluir Lição */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {isCurrentCompleted ? '✅ Lição Concluída!' : 'Pratique a digitação no instrumento'}
              </span>

              <button
                onClick={() => handleLessonComplete(activeLesson.id)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-600/30'
                }`}
              >
                {isCurrentCompleted ? 'Concluída' : 'Marcar como Concluída'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

