import React, { useState, useMemo, useEffect } from 'react';
import {
  THEORY_MODULES,
  type TheoryLesson,
  type TheoryModuleData,
  type AudioExample,
} from '../../core/theoryLessonsData';
import { soundEngine } from '../../core/soundEngine';
import {
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Volume2,
  Sliders,
  Layers,
  Search,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
} from 'lucide-react';

export const TheoryStudyAcademy: React.FC = () => {
  // Estado da Lição Ativa
  const [selectedModule, setSelectedModule] = useState<TheoryModuleData>(THEORY_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<TheoryLesson>(THEORY_MODULES[0].lessons[0]);

  // Progresso do Aluno
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('harmonia_theory_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filtros e Busca
  const [levelFilter, setLevelFilter] = useState<'all' | 'Iniciante' | 'Intermediário' | 'Avançado'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Estado do Quiz da Lição Atual
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);

  // Estado do Reprodutor de Áudio da Lição
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);

  // Estados de Expansão e Tela Cheia dos Cards
  const [isCurriculumExpanded, setIsCurriculumExpanded] = useState<boolean>(false);
  const [isLessonExpanded, setIsLessonExpanded] = useState<boolean>(false);
  const [isFullscreenCurriculum, setIsFullscreenCurriculum] = useState<boolean>(false);
  const [isFullscreenLesson, setIsFullscreenLesson] = useState<boolean>(false);

  const toggleCurriculumExpand = () => {
    setIsCurriculumExpanded((prev) => !prev);
    if (!isCurriculumExpanded) setIsLessonExpanded(false);
  };

  const toggleLessonExpand = () => {
    setIsLessonExpanded((prev) => !prev);
    if (!isLessonExpanded) setIsCurriculumExpanded(false);
  };

  const toggleFullscreenLesson = () => {
    if (!isFullscreenLesson) {
      setIsFullscreenLesson(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    } else {
      setIsFullscreenLesson(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  const toggleFullscreenCurriculum = () => {
    if (!isFullscreenCurriculum) {
      setIsFullscreenCurriculum(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    } else {
      setIsFullscreenCurriculum(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreenLesson) setIsFullscreenLesson(false);
        if (isFullscreenCurriculum) setIsFullscreenCurriculum(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenLesson, isFullscreenCurriculum]);

  // =========================================================================
  // LABORATÓRIO DE INTERVALOS INTERATIVO
  // =========================================================================
  const [intervalRoot, setIntervalRoot] = useState<number>(60); // Dó Central (MIDI 60)
  const [intervalSemitones, setIntervalSemitones] = useState<number>(4); // Terça Maior

  const INTERVAL_NAMES = [
    { semitones: 0, name: 'Uníssono Justo (1J)', formula: '0 semitons', mood: 'Identidade total' },
    { semitones: 1, name: 'Segunda Menor (2m)', formula: '1 semitom', mood: 'Tensão dramática aguda (Tubarão)' },
    { semitones: 2, name: 'Segunda Maior (2M)', formula: '2 semitons (1 tom)', mood: 'Passo melódico natural' },
    { semitones: 3, name: 'Terça Menor (3m)', formula: '3 semitons (1½ tom)', mood: 'Tristeza, introspecção, blues' },
    { semitones: 4, name: 'Terça Maior (3M)', formula: '4 semitons (2 tons)', mood: 'Alegria, brilho, solene' },
    { semitones: 5, name: 'Quarta Justa (4J)', formula: '5 semitons (2½ tons)', mood: 'Neutro, consonância aberta' },
    { semitones: 6, name: 'Trítono (4ª Aum / 5ª Dim)', formula: '6 semitons (3 tons)', mood: 'Tensão máxima magnética' },
    { semitones: 7, name: 'Quinta Justa (5J)', formula: '7 semitons (3½ tons)', mood: 'Consonância perfeita, poder' },
    { semitones: 8, name: 'Sexta Menor (6m)', formula: '8 semitons (4 tons)', mood: 'Nostalgia romântica' },
    { semitones: 9, name: 'Sexta Maior (6M)', formula: '9 semitons (4½ tons)', mood: 'Elegância e luz (Jazz/Bossa)' },
    { semitones: 10, name: 'Sétima Menor (7m)', formula: '10 semitons (5 tons)', mood: 'Tensão dominante resolutiva' },
    { semitones: 11, name: 'Sétima Maior (7M)', formula: '11 semitons (5½ tons)', mood: 'Aveludado, sonhador' },
    { semitones: 12, name: 'Oitava Justa (8J)', formula: '12 semitons (6 tons)', mood: 'Consonância pura oitavada' },
  ];

  const currentIntervalInfo = INTERVAL_NAMES[intervalSemitones] || INTERVAL_NAMES[4];

  const playIntervalAudio = async (mode: 'melodic' | 'harmonic') => {
    await soundEngine.ensureAudioReady();
    const note1 = intervalRoot;
    const note2 = intervalRoot + intervalSemitones;

    if (mode === 'melodic') {
      soundEngine.playPianoNote(note1, 0.7);
      setTimeout(() => {
        soundEngine.playPianoNote(note2, 0.9);
      }, 400);
    } else {
      soundEngine.playPianoNote(note1, 1.2, undefined, 0.75);
      soundEngine.playPianoNote(note2, 1.2, undefined, 0.75);
    }
  };

  // =========================================================================
  // NAVEGAÇÃO ENTRE LIÇÕES
  // =========================================================================
  const allLessons = useMemo(() => {
    return THEORY_MODULES.flatMap((m) => m.lessons);
  }, []);

  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchLevel = levelFilter === 'all' || lesson.level === levelFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [allLessons, levelFilter, searchQuery]);

  const currentLessonIndex = useMemo(() => {
    return allLessons.findIndex((l) => l.id === activeLesson.id);
  }, [allLessons, activeLesson.id]);

  const handleSelectLesson = (lesson: TheoryLesson) => {
    setActiveLesson(lesson);
    const mod = THEORY_MODULES.find((m) => m.code === lesson.moduleCode);
    if (mod) setSelectedModule(mod);
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      handleSelectLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      handleSelectLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem('harmonia_theory_completed_lessons', JSON.stringify(updated));
      } catch {
        // Ignora erro de cota
      }
      return updated;
    });
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(activeLesson.id);
  const progressPercent = Math.round((completedLessonIds.length / (allLessons.length || 1)) * 100);

  // Toca exemplo sonoro de uma lição
  const playLessonAudio = async (example: AudioExample, idx: number) => {
    await soundEngine.ensureAudioReady();
    setPlayingAudioIndex(idx);

    if (example.type === 'melodic') {
      example.notes.forEach((midi, noteIdx) => {
        setTimeout(() => {
          soundEngine.playPianoNote(midi, 0.6);
          if (noteIdx === example.notes.length - 1) {
            setTimeout(() => setPlayingAudioIndex(null), 300);
          }
        }, noteIdx * 250);
      });
    } else if (example.type === 'harmonic') {
      example.notes.forEach((midi) => {
        soundEngine.playPianoNote(midi, 1.4, undefined, 0.7);
      });
      setTimeout(() => setPlayingAudioIndex(null), 1200);
    } else {
      // Cadência / encadeamento de acordes
      // Toca em blocos de 4 notas a cada 600ms
      const chunkSize = 4;
      const chunks: number[][] = [];
      for (let i = 0; i < example.notes.length; i += chunkSize) {
        chunks.push(example.notes.slice(i, i + chunkSize));
      }
      chunks.forEach((chunk, chunkIdx) => {
        setTimeout(() => {
          chunk.forEach((midi) => soundEngine.playPianoNote(midi, 1.0, undefined, 0.75));
          if (chunkIdx === chunks.length - 1) {
            setTimeout(() => setPlayingAudioIndex(null), 1000);
          }
        }, chunkIdx * 650);
      });
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* 1. Header Hero da Academia de Estudos */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/20 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                Ementa Completa • 7 Módulos Oficiais
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {completedLessonIds.length} de {allLessons.length} lições concluídas ({progressPercent}%)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Academia de Teoria &amp; Harmonia Musical
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
              Do mistério dos semitons e notação tradicional às progressões funcionais, cadências históricas e modos gregos aplicados na composição e improvisação.
            </p>
          </div>

          {/* Progresso do Aluno */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shrink-0 min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Domínio da Teoria</span>
              <span className="text-purple-300 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 text-center font-mono">
              Certificado de Conclusão ao atingir 100%
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtro de Nível & Busca Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold mr-1">
            Nível:
          </span>
          {(['all', 'Iniciante', 'Intermediário', 'Avançado'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {lvl === 'all' ? 'Todas as Lições' : lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar conceito, trítono, modo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
        </div>
      </div>

      {/* 3. Grid Principal: Grade de Módulos (Esquerda) e Leitor da Lição (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* COLUNA ESQUERDA (4 cols): Menu de Módulos e Lições */}
        {!isLessonExpanded && (
          <div
            className={`${
              isCurriculumExpanded ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-4 xl:col-span-3 2xl:col-span-3'
            } h-full flex flex-col space-y-3 transition-all`}
          >
            <div
              className={`p-4 rounded-3xl glass-card border border-white/5 space-y-3 flex flex-col flex-1 min-h-0 transition-all ${
                isFullscreenCurriculum
                  ? 'fixed inset-0 z-50 bg-[#080811] p-4 sm:p-8 overflow-y-auto m-0 rounded-none border-none shadow-2xl'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-white/5 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                  Grade Curricular ({filteredLessons.length} Lições Disponíveis):
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Botão Expansão da Grade */}
                  <button
                    onClick={toggleCurriculumExpand}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isCurriculumExpanded
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isCurriculumExpanded ? 'Reduzir largura da grade' : 'Expandir largura da grade'}
                  >
                    {isCurriculumExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Botão Tela Cheia da Grade */}
                  <button
                    onClick={toggleFullscreenCurriculum}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isFullscreenCurriculum
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isFullscreenCurriculum ? 'Sair da Tela Cheia (Esc)' : 'Tela Cheia na Grade Curricular'}
                  >
                    {isFullscreenCurriculum ? <Shrink className="w-3.5 h-3.5 text-rose-400" /> : <Expand className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                {THEORY_MODULES.map((mod) => {
                  const modLessons = mod.lessons.filter(
                    (l) => filteredLessons.some((fl) => fl.id === l.id)
                  );
                  if (modLessons.length === 0) return null;

                  const isSelectedMod = selectedModule.code === mod.code;

                  return (
                    <div
                      key={mod.code}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isSelectedMod
                          ? 'border-purple-500/40 bg-purple-950/20'
                          : 'border-white/5 bg-white/[0.02]'
                      }`}
                    >
                      <div
                        onClick={() => setSelectedModule(mod)}
                        className="p-3 cursor-pointer flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 font-bold uppercase">
                            <span>{mod.code}</span>
                            <span>•</span>
                            <span>{mod.phase}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-0.5">
                            {mod.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {modLessons.length} aulas
                        </span>
                      </div>

                      {/* Lista de Lições do Módulo */}
                      <div className="p-2 pt-0 space-y-1">
                        {modLessons.map((lesson) => {
                          const isActive = activeLesson.id === lesson.id;
                          const isDone = completedLessonIds.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                isActive
                                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30 scale-101'
                                  : 'hover:bg-white/5 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              <span className="text-[9px] font-mono opacity-70 shrink-0">
                                {lesson.readingTimeMinutes} min
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Mini Laboratório Interativo de Intervalos Acústicos */}
            <div className="p-4 rounded-3xl bg-black/50 border border-purple-500/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
                <Sliders className="w-3.5 h-3.5" />
                <span>Laboratório de Intervalos</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{currentIntervalInfo.name}</span>
                  <span className="text-indigo-300 font-mono text-[11px]">{currentIntervalInfo.formula}</span>
                </div>
                <p className="text-[11px] text-slate-400">{currentIntervalInfo.mood}</p>
              </div>

              {/* Slider de Semitons */}
              <input
                type="range"
                min={0}
                max={12}
                value={intervalSemitones}
                onChange={(e) => setIntervalSemitones(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />

              {/* Seletor de Nota Fundamental */}
              <div className="flex items-center gap-1 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Fundamental:</span>
                {[
                  { name: 'Dó (C)', midi: 60 },
                  { name: 'Ré (D)', midi: 62 },
                  { name: 'Mi (E)', midi: 64 },
                  { name: 'Fá (F)', midi: 65 },
                  { name: 'Sol (G)', midi: 67 },
                  { name: 'Lá (A)', midi: 69 },
                ].map((r) => (
                  <button
                    key={r.midi}
                    onClick={() => setIntervalRoot(r.midi)}
                    className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                      intervalRoot === r.midi
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    {r.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => playIntervalAudio('melodic')}
                  className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Ouvir Sucessivo</span>
                </button>

                <button
                  onClick={() => playIntervalAudio('harmonic')}
                  className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Layers className="w-3 h-3" />
                  <span>Ouvir Junto (Acorde)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COLUNA DIREITA (8 cols): Leitor Completo da Lição */}
        <div
          className={`${
            isLessonExpanded
              ? 'lg:col-span-12'
              : isCurriculumExpanded
              ? 'lg:col-span-6 xl:col-span-7'
              : 'lg:col-span-8 xl:col-span-9 2xl:col-span-9'
          } space-y-5 transition-all`}
        >
          <div
            className={`p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6 shadow-2xl relative transition-all ${
              isFullscreenLesson
                ? 'fixed inset-0 z-50 bg-[#080811] p-4 sm:p-8 overflow-y-auto m-0 rounded-none border-none shadow-2xl'
                : ''
            }`}
          >
            {/* Header da Aula */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {activeLesson.moduleCode} • {activeLesson.moduleTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5">
                    Nível: {activeLesson.level}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {activeLesson.readingTimeMinutes} min de leitura
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  {activeLesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {activeLesson.subtitle}
                </p>
              </div>

              {/* Botões de Ação no Topo da Lição */}
              <div className="flex items-center gap-2 shrink-0 self-start">
                {/* Botão Expansão da Lição */}
                <button
                  onClick={toggleLessonExpand}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isLessonExpanded
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                  }`}
                  title={isLessonExpanded ? 'Reduzir para tamanho normal' : 'Modo Palco Estendido (100% de largura)'}
                >
                  {isLessonExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Botão Tela Cheia da Lição */}
                <button
                  onClick={toggleFullscreenLesson}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isFullscreenLesson
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                  }`}
                  title={isFullscreenLesson ? 'Sair da Tela Cheia (Esc)' : 'Tela Cheia Imersiva na Lição'}
                >
                  {isFullscreenLesson ? <Shrink className="w-4 h-4 text-rose-400" /> : <Expand className="w-4 h-4 text-purple-400" />}
                </button>

                {/* Botão Concluir Lição */}
                <button
                  onClick={() => handleToggleCompleteLesson(activeLesson.id)}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isCurrentLessonCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isCurrentLessonCompleted ? 'Lição Concluída ✓' : 'Marcar como Concluída'}</span>
                </button>
              </div>
            </div>

            {/* Resumo Executivo / Conceito Chave */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
                <Lightbulb className="w-4 h-4" />
                <span>Ideia Central da Lição</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {activeLesson.summary}
              </p>
              <div className="text-[11px] text-indigo-300 font-mono pt-1">
                <strong>💡 Conclusão Rápida:</strong> {activeLesson.keyTakeaway}
              </div>
            </div>

            {/* Seções e Explicações Detalhadas */}
            <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeLesson.sections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
                    <span>{sec.heading}</span>
                  </h4>

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}

                  {sec.bulletPoints && (
                    <ul className="space-y-2 pl-2">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Exemplos Sonoros Interativos da Lição */}
            {activeLesson.audioExamples && activeLesson.audioExamples.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <span className="text-[11px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Exemplos Auditivos Desta Lição (Clique para Ouvir):</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeLesson.audioExamples.map((ex, exIdx) => {
                    const isPlaying = playingAudioIndex === exIdx;
                    return (
                      <button
                        key={exIdx}
                        onClick={() => playLessonAudio(ex, exIdx)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isPlaying
                            ? 'bg-purple-600/30 border-purple-400 text-white ring-1 ring-purple-400'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white">{ex.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">
                            {ex.description}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regra de Ouro (Axioma Musical) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block mb-0.5">
                  Regra de Ouro para Memorizar
                </span>
                <p className="text-xs sm:text-sm font-bold text-amber-100">
                  {activeLesson.goldenRule}
                </p>
              </div>
            </div>

            {/* Quiz de Fixação Imediata */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Desafio de Fixação Rápida</span>
              </div>

              <h5 className="text-xs sm:text-sm font-bold text-white">
                {activeLesson.quiz.question}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeLesson.quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizOption === optIdx;
                  const isCorrect = optIdx === activeLesson.quiz.correctIndex;

                  let style = 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5';
                  if (isQuizAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-500/20 text-rose-200 border-rose-500/50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSelectedQuizOption(optIdx);
                        setIsQuizAnswered(true);
                        if (isCorrect) {
                          handleToggleCompleteLesson(activeLesson.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isQuizAnswered && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono animate-fade-in ${
                    selectedQuizOption === activeLesson.quiz.correctIndex
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <strong>
                    {selectedQuizOption === activeLesson.quiz.correctIndex ? '✓ Correto!' : '✗ Incorreto:'}
                  </strong>{' '}
                  {activeLesson.quiz.explanation}
                </div>
              )}
            </div>

            {/* Navegação Entre Lições */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Lição Anterior</span>
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer shadow-lg transition-colors"
              >
                <span>Próxima Lição</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
