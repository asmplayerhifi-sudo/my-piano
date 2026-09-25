import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  THEORY_MODULES,
  type TheoryLesson,
  type TheoryModuleData,
  type AudioExample,
} from '../../core/theoryLessonsData';
import { soundEngine } from '../../core/soundEngine';
import { octaveConfigStore, useOctaveStandard } from '../../core/octaveConfigStore';
import { LessonIllustration } from '../course/illustrations/LessonIllustration';
import { IntervalLaboratory } from './IntervalLaboratory';
import { CourseContextualHeader } from '../course/layout/CourseContextualHeader';
import { CourseLearningTrailModal, type TrailModuleItem } from '../course/layout/CourseLearningTrailModal';
import { CourseStatusBar } from '../course/layout/CourseStatusBar';
import {
  CheckCircle2,
  Sparkles,
  Play,
  Volume2,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';

export const TheoryStudyAcademy: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<TheoryModuleData>(THEORY_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<TheoryLesson>(THEORY_MODULES[0].lessons[0]);
  const [academyTab, setAcademyTab] = useState<'all' | 'theory' | 'lab'>('all');
  const [isTrailModalOpen, setIsTrailModalOpen] = useState<boolean>(false);
  const [isTipOpen, setIsTipOpen] = useState<boolean>(false);

  // Progresso do Aluno
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('harmonia_theory_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const octaveStandard = useOctaveStandard();

  // Estado do Quiz da Lição Atual
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);

  // Estado do Reprodutor de Áudio da Lição
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const audioTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAudioTimeouts = () => {
    audioTimeoutsRef.current.forEach((t) => clearTimeout(t));
    audioTimeoutsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
    };
  }, []);

  // RF-01: Atalho global de teclado Ctrl + T / Cmd + T para abrir a Trilha de Aulas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsTrailModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lista linear de todas as lições de teoria
  const allLessons = useMemo(() => {
    return THEORY_MODULES.flatMap((m) => m.lessons);
  }, []);

  const currentLessonIndex = useMemo(() => {
    const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
    return idx !== -1 ? idx : 0;
  }, [allLessons, activeLesson.id]);

  const currentLessonCode = useMemo(() => {
    const match = activeLesson.title.match(/Lição\s+([\d.]+)/i);
    return match ? match[1] : `${currentLessonIndex + 1}`;
  }, [activeLesson.title, currentLessonIndex]);

  const handleSelectLesson = (lesson: TheoryLesson) => {
    clearAudioTimeouts();
    setPlayingAudioIndex(null);
    setActiveLesson(lesson);
    const mod = THEORY_MODULES.find((m) => m.code === lesson.moduleCode);
    if (mod) setSelectedModule(mod);
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
    setAcademyTab('all');
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
        // Ignora erro
      }
      return updated;
    });
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(activeLesson.id);

  // Módulos no formato genérico da Trilha
  const trailModules: TrailModuleItem[] = useMemo(() => {
    return THEORY_MODULES.map((mod) => ({
      code: mod.code,
      title: mod.title,
      phase: mod.phase,
      lessons: mod.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        subtitle: l.subtitle,
        level: l.level,
        readingTimeMinutes: l.readingTimeMinutes,
        moduleCode: l.moduleCode,
      })),
    }));
  }, []);

  // Toca exemplo sonoro de uma lição
  const playLessonAudio = async (example: AudioExample, idx: number) => {
    clearAudioTimeouts();
    await soundEngine.ensureAudioReady();
    setPlayingAudioIndex(idx);

    if (example.chords && example.chords.length > 0) {
      const stepMs = example.tempoMs || 850;
      example.chords.forEach((chord, chordIdx) => {
        const timeout = setTimeout(() => {
          chord.forEach((midi) => {
            soundEngine.playPianoNote(midi, (stepMs / 1000) * 1.35, undefined, 0.75);
          });
          if (chordIdx === example.chords!.length - 1) {
            const finishTimeout = setTimeout(() => setPlayingAudioIndex(null), stepMs + 200);
            audioTimeoutsRef.current.push(finishTimeout);
          }
        }, chordIdx * stepMs);
        audioTimeoutsRef.current.push(timeout);
      });
    } else if (example.type === 'harmonic' && example.notes && example.notes.length > 0) {
      example.notes.forEach((midi) => {
        soundEngine.playPianoNote(midi, 1.6, undefined, 0.75);
      });
      const finishTimeout = setTimeout(() => setPlayingAudioIndex(null), 1400);
      audioTimeoutsRef.current.push(finishTimeout);
    } else if (example.notes && example.notes.length > 0) {
      let currentOffset = 0;
      example.notes.forEach((midi, noteIdx) => {
        const noteDur = example.noteDurationsMs?.[noteIdx] ?? (example.tempoMs || 280);
        const timeout = setTimeout(() => {
          soundEngine.playPianoNote(midi, 0.7, undefined, 0.75);
        }, currentOffset);
        audioTimeoutsRef.current.push(timeout);
        currentOffset += noteDur;
      });
      const finishTimeout = setTimeout(() => setPlayingAudioIndex(null), currentOffset + 400);
      audioTimeoutsRef.current.push(finishTimeout);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-[#060b13] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      {/* HEADER DE CONTEXTO RESPONSIVO E UNIFICADO — Linha Única 44px (REQ-UI-LESSONHEADER-01) */}
      <CourseContextualHeader
        courseTitle={`Teoria & Harmonia • ${selectedModule.code}`}
        courseIcon="🎼"
        currentLessonCode={currentLessonCode}
        totalLessons={allLessons.length}
        completedLessonsCount={completedLessonIds.length}
        lessonTitle={activeLesson.title}
        lessonLevel={activeLesson.level}
        onOpenTrail={() => setIsTrailModalOpen(true)}
        onPrevLesson={handlePrevLesson}
        onNextLesson={handleNextLesson}
        hasPrevLesson={currentLessonIndex > 0}
        hasNextLesson={currentLessonIndex < allLessons.length - 1}
        tabs={[
          {
            id: 'all',
            label: 'Estudo da Lição',
            shortLabel: 'Lição',
            icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
          },
          { id: 'theory', label: 'Teoria & Exercícios', shortLabel: 'Teoria' },
          { id: 'lab', label: 'Laboratório de Intervalos', shortLabel: 'Laboratório' },
        ]}
        activeTabId={academyTab}
        onSelectTab={(id) => setAcademyTab(id as any)}
        isCompleted={isCurrentLessonCompleted}
        onToggleComplete={() => handleToggleCompleteLesson(activeLesson.id)}
        accentColor="cyan"
      />

      {/* 3. CONTEÚDO PRINCIPAL COM SUPORTE A GRID RESPONSIVO (>= 1280px 2 COLUNAS / < 1280px 1 COLUNA) */}
      <div className="flex-1 w-full p-2.5 sm:p-5 overflow-y-auto">
        {/* MODO 1: VISÃO INTEGRADA (TEORIA + LABORATÓRIO) */}
        {academyTab === 'all' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start max-w-[1500px] mx-auto">
            {/* COLUNA ESQUERDA: TEORIA & EXERCÍCIOS (6 colunas no xl) */}
            <div className="xl:col-span-6 space-y-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-black/40 border border-white/10 space-y-4 shadow-xl">
                {/* Cabeçalho do Card Conforme Wireframe */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📖</span>
                    <div>
                      <h3 className="font-black text-sm text-white tracking-wide">
                        TEORIA &amp; EXERCÍCIOS
                      </h3>
                      <span className="text-xs font-mono text-cyan-300">
                        {activeLesson.subtitle || 'Fundamentos Harmônicos'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LIÇÃO {currentLessonCode}</span>
                  </span>
                </div>

                {/* Ideia Central da Lição */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Ideia Central da Lição</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {octaveConfigStore.formatNoteOctavesInText(activeLesson.summary, octaveStandard)}
                  </p>
                  <div className="text-xs text-cyan-300 font-mono pt-1">
                    <strong>💡 Conclusão Rápida:</strong>{' '}
                    {octaveConfigStore.formatNoteOctavesInText(activeLesson.keyTakeaway, octaveStandard)}
                  </div>
                </div>

                {/* Diagrama Ilustrativo */}
                <LessonIllustration
                  lessonId={activeLesson.id}
                  moduleCode={activeLesson.moduleCode}
                  title={activeLesson.title}
                  instrument="theory"
                />

                {/* Seções e Explicações */}
                <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeLesson.sections.map((sec, secIdx) => (
                    <div key={secIdx} className="space-y-2 p-3 rounded-2xl bg-white/[0.015] border border-white/5">
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-cyan-500 rounded-full" />
                        <span>{octaveConfigStore.formatNoteOctavesInText(sec.heading, octaveStandard)}</span>
                      </h4>

                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{octaveConfigStore.formatNoteOctavesInText(p, octaveStandard)}</p>
                      ))}

                      {sec.formulaOrBox && (
                        <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-[11px] sm:text-xs text-cyan-200 overflow-x-auto whitespace-pre leading-relaxed my-2 shadow-inner">
                          {octaveConfigStore.formatNoteOctavesInText(sec.formulaOrBox, octaveStandard)}
                        </div>
                      )}

                      {sec.bulletPoints && (
                        <ul className="space-y-1 pl-2 pt-1">
                          {sec.bulletPoints.map((bp, bpIdx) => (
                            <li key={bpIdx} className="flex items-start gap-2 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              <span>{octaveConfigStore.formatNoteOctavesInText(bp, octaveStandard)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Exemplos Auditivos Interativos */}
                {activeLesson.audioExamples && activeLesson.audioExamples.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-3">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🎧 EXEMPLOS AUDITIVOS</span>
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
                                ? 'bg-cyan-600/30 border-cyan-400 text-white ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-slate-300'
                            }`}
                          >
                            <div className="space-y-1 truncate">
                              <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                                {isPlaying ? (
                                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                                ) : (
                                  <Play className="w-3 h-3 text-cyan-400 shrink-0 fill-current" />
                                )}
                                <span className="truncate">{ex.title}</span>
                              </div>
                              <div className="text-xs text-slate-400 truncate">
                                {ex.description}
                              </div>
                            </div>

                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 shrink-0 font-medium">
                              {ex.type === 'harmonic' ? 'Harmônico' : ex.type === 'cadence' ? 'Cadência' : 'Melodia'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Teste de Fixação (Wireframe: Seletores Radio + [Confirmar Resposta]) */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3.5">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                    <HelpCircle className="w-4 h-4" />
                    <span>❓ TESTE DE FIXAÇÃO</span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white">
                    {activeLesson.quiz.question}
                  </p>

                  <div className="space-y-2">
                    {activeLesson.quiz.options.map((option, optIdx) => {
                      const isSelected = selectedQuizOption === optIdx;
                      const isCorrect = optIdx === activeLesson.quiz.correctIndex;

                      let btnStyles = 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.06]';
                      if (isQuizAnswered) {
                        if (isCorrect) {
                          btnStyles = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyles = 'bg-rose-600/30 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyles = 'bg-cyan-600/20 border-cyan-400 text-white font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isQuizAnswered}
                          onClick={() => {
                            if (!isQuizAnswered) {
                              setSelectedQuizOption(optIdx);
                            }
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyles}`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Radio visual ( ) ou (x) */}
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'border-cyan-400 bg-cyan-500/20'
                                  : 'border-slate-500 bg-transparent'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>

                          {isQuizAnswered && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Botão de Confirmação da Resposta (Wireframe) */}
                  {!isQuizAnswered ? (
                    <button
                      onClick={() => {
                        if (selectedQuizOption !== null) {
                          setIsQuizAnswered(true);
                        }
                      }}
                      disabled={selectedQuizOption === null}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        selectedQuizOption !== null
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 cursor-pointer'
                          : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      <span>[ Confirmar Resposta ]</span>
                    </button>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div
                        className={`p-3 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                          selectedQuizOption === activeLesson.quiz.correctIndex
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          {selectedQuizOption === activeLesson.quiz.correctIndex ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Resposta Correta! Excelente dedução auditiva.</span>
                            </>
                          ) : (
                            <>
                              <span className="text-base">⚠️</span>
                              <span>
                                Opção incorreta. A resposta certa era a Opção{' '}
                                {activeLesson.quiz.correctIndex + 1}.
                              </span>
                            </>
                          )}
                        </div>
                        <div>
                          <strong className="text-white">Explicação: </strong>
                          {activeLesson.quiz.explanation}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedQuizOption(null);
                          setIsQuizAnswered(false);
                        }}
                        className="py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                      >
                        Refazer Pergunta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: LABORATÓRIO DE INTERVALOS / PRÁTICA (6 colunas no xl, max 650px) */}
            <div className="xl:col-span-6 w-full flex flex-col items-center">
              <IntervalLaboratory inTheoryGrid={true} className="w-full max-w-[650px]" />
            </div>
          </div>
        )}

        {/* MODO 2: APENAS TEORIA & EXERCÍCIOS */}
        {academyTab === 'theory' && (
          <div className="max-w-[850px] mx-auto space-y-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-black/40 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📖</span>
                  <div>
                    <h3 className="font-black text-sm text-white tracking-wide">
                      TEORIA &amp; EXERCÍCIOS
                    </h3>
                    <span className="text-xs font-mono text-cyan-300">
                      {activeLesson.subtitle || 'Fundamentos Harmônicos'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LIÇÃO {currentLessonCode}</span>
                </span>
              </div>

              {/* Ideia Central da Lição */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Ideia Central da Lição</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {octaveConfigStore.formatNoteOctavesInText(activeLesson.summary, octaveStandard)}
                </p>
                <div className="text-xs text-cyan-300 font-mono pt-1">
                  <strong>💡 Conclusão Rápida:</strong>{' '}
                  {octaveConfigStore.formatNoteOctavesInText(activeLesson.keyTakeaway, octaveStandard)}
                </div>
              </div>

              {/* Diagrama Ilustrativo */}
              <LessonIllustration
                lessonId={activeLesson.id}
                moduleCode={activeLesson.moduleCode}
                title={activeLesson.title}
                instrument="theory"
              />

              {/* Seções e Explicações */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeLesson.sections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-2 p-3 rounded-2xl bg-white/[0.015] border border-white/5">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-cyan-500 rounded-full" />
                      <span>{octaveConfigStore.formatNoteOctavesInText(sec.heading, octaveStandard)}</span>
                    </h4>

                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{octaveConfigStore.formatNoteOctavesInText(p, octaveStandard)}</p>
                    ))}

                    {sec.bulletPoints && (
                      <ul className="space-y-1 pl-2 pt-1">
                        {sec.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{octaveConfigStore.formatNoteOctavesInText(bp, octaveStandard)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Exemplos Auditivos Interativos */}
              {activeLesson.audioExamples && activeLesson.audioExamples.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-3">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🎧 EXEMPLOS AUDITIVOS</span>
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
                              ? 'bg-cyan-600/30 border-cyan-400 text-white ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-slate-300'
                          }`}
                        >
                          <div className="space-y-1 truncate">
                            <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                              {isPlaying ? (
                                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                              ) : (
                                <Play className="w-3 h-3 text-cyan-400 shrink-0 fill-current" />
                              )}
                              <span className="truncate">{ex.title}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {ex.description}
                            </div>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 shrink-0">
                            {ex.type === 'harmonic' ? 'Harmônico' : ex.type === 'cadence' ? 'Cadência' : 'Melodia'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quiz */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3.5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>❓ TESTE DE FIXAÇÃO</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-white">
                  {activeLesson.quiz.question}
                </p>

                <div className="space-y-2">
                  {activeLesson.quiz.options.map((option, optIdx) => {
                    const isSelected = selectedQuizOption === optIdx;
                    const isCorrect = optIdx === activeLesson.quiz.correctIndex;

                    let btnStyles = 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.06]';
                    if (isQuizAnswered) {
                      if (isCorrect) {
                        btnStyles = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected) {
                        btnStyles = 'bg-rose-600/30 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnStyles = 'bg-cyan-600/20 border-cyan-400 text-white font-medium';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isQuizAnswered}
                        onClick={() => {
                          if (!isQuizAnswered) {
                            setSelectedQuizOption(optIdx);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyles}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-500/20'
                                : 'border-slate-500 bg-transparent'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>

                        {isQuizAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!isQuizAnswered ? (
                  <button
                    onClick={() => {
                      if (selectedQuizOption !== null) {
                        setIsQuizAnswered(true);
                      }
                    }}
                    disabled={selectedQuizOption === null}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      selectedQuizOption !== null
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 cursor-pointer'
                        : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <span>[ Confirmar Resposta ]</span>
                  </button>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div
                      className={`p-3 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                        selectedQuizOption === activeLesson.quiz.correctIndex
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        {selectedQuizOption === activeLesson.quiz.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Resposta Correta! Excelente dedução auditiva.</span>
                          </>
                        ) : (
                          <>
                            <span className="text-base">⚠️</span>
                            <span>
                              Opção incorreta. A resposta certa era a Opção{' '}
                              {activeLesson.quiz.correctIndex + 1}.
                            </span>
                          </>
                        )}
                      </div>
                      <div>
                        <strong className="text-white">Explicação: </strong>
                        {activeLesson.quiz.explanation}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedQuizOption(null);
                        setIsQuizAnswered(false);
                      }}
                      className="py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                    >
                      Refazer Pergunta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODO 3: APENAS LABORATÓRIO DE INTERVALOS */}
        {academyTab === 'lab' && (
          <div className="pt-2">
            <IntervalLaboratory inTheoryGrid={false} className="max-w-[1200px] mx-auto" />
          </div>
        )}
      </div>

      {/* 4. STATUS BAR INFERIOR — até 30px */}
      <CourseStatusBar
        pedagogicalTip={activeLesson.keyTakeaway || activeLesson.subtitle}
        isTipOpen={isTipOpen}
        onToggleTip={() => setIsTipOpen(!isTipOpen)}
        audioRecognitionActive={true}
        midiConnected={false}
        statusText="Pronto"
      />

      {/* 5. MODAL DA TRILHA DE APRENDIZADO (Overlay Flutuante) */}
      <CourseLearningTrailModal
        isOpen={isTrailModalOpen}
        onClose={() => setIsTrailModalOpen(false)}
        courseTitle="Teoria & Harmonia Musical"
        modules={trailModules}
        activeLessonId={activeLesson.id}
        completedLessonIds={completedLessonIds}
        onSelectLesson={(lesson) => {
          const found = allLessons.find((l) => l.id === lesson.id);
          if (found) handleSelectLesson(found);
        }}
        accentColor="cyan"
      />
    </div>
  );
};
