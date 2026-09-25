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
import { CourseSubTabs } from '../course/layout/CourseSubTabs';
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
  const [academyTab, setAcademyTab] = useState<'all' | 'audio' | 'quiz' | 'lab'>('all');
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
      {/* 1. HEADER CONTEXTUAL — até 36px */}
      <CourseContextualHeader
        courseTitle={`Teoria & Harmonia • ${selectedModule.code}`}
        courseIcon="🎼"
        currentLessonCode={currentLessonCode}
        totalLessons={allLessons.length}
        completedLessonsCount={completedLessonIds.length}
        onOpenTrail={() => setIsTrailModalOpen(true)}
        onPrevLesson={handlePrevLesson}
        onNextLesson={handleNextLesson}
        hasPrevLesson={currentLessonIndex > 0}
        hasNextLesson={currentLessonIndex < allLessons.length - 1}
        accentColor="cyan"
      />

      {/* 2. SUB-TABS — até 32px */}
      <CourseSubTabs
        lessonTitle={activeLesson.title}
        lessonLevel={activeLesson.level}
        tabs={[
          {
            id: 'all',
            label: 'Estudo da Lição',
            shortLabel: 'Lição',
            icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
          },
          ...(activeLesson.audioExamples && activeLesson.audioExamples.length > 0
            ? [{ id: 'audio', label: 'Exemplos de Áudio', shortLabel: 'Áudios' }]
            : []),
          { id: 'quiz', label: 'Quiz de Fixação', shortLabel: 'Quiz' },
          { id: 'lab', label: 'Laboratório de Intervalos', shortLabel: 'Intervalos' },
        ]}
        activeTabId={academyTab}
        onSelectTab={(id) => setAcademyTab(id as any)}
        accentColor="cyan"
        rightSlot={
          <button
            onClick={() => handleToggleCompleteLesson(activeLesson.id)}
            className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              isCurrentLessonCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
            }`}
            title="Marcar lição como concluída"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span className="hidden sm:inline">
              {isCurrentLessonCompleted ? 'Concluída' : 'Concluir'}
            </span>
          </button>
        }
      />

      {/* 3. CONTEÚDO FULL-WIDTH (100% da Largura Útil sem Sidebar Fixa) */}
      <div className="flex-1 w-full p-2 sm:p-4 space-y-4 overflow-y-auto">
        {/* Aba Estudo Completo */}
        {(academyTab === 'all' || academyTab === 'audio') && (
          <div className="space-y-4">
            {/* Ideia Central da Lição */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <Lightbulb className="w-4 h-4" />
                <span>Ideia Central da Lição</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {octaveConfigStore.formatNoteOctavesInText(activeLesson.summary, octaveStandard)}
              </p>
              <div className="text-[11px] text-cyan-300 font-mono pt-1">
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
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeLesson.sections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-2.5 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-cyan-500 rounded-full" />
                    <span>{octaveConfigStore.formatNoteOctavesInText(sec.heading, octaveStandard)}</span>
                  </h4>

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{octaveConfigStore.formatNoteOctavesInText(p, octaveStandard)}</p>
                  ))}

                  {sec.bulletPoints && (
                    <ul className="space-y-1.5 pl-2 pt-1">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2">
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
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
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
          </div>
        )}

        {/* Aba Quiz de Fixação */}
        {(academyTab === 'all' || academyTab === 'quiz') && (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>Teste de Fixação da Lição</span>
            </div>

            <p className="text-sm font-bold text-white">
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
                  btnStyles = 'bg-cyan-600/30 border-cyan-400 text-white';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (!isQuizAnswered) {
                        setSelectedQuizOption(optIdx);
                        setIsQuizAnswered(true);
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyles}`}
                  >
                    <span>{option}</span>
                    {isQuizAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isQuizAnswered && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 animate-fadeIn">
                <strong className="text-white block mb-0.5">Explicação:</strong>
                {activeLesson.quiz.explanation}
              </div>
            )}
          </div>
        )}

        {/* Aba Laboratório de Intervalos */}
        {(academyTab === 'all' || academyTab === 'lab') && (
          <div className="pt-2">
            <IntervalLaboratory />
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
