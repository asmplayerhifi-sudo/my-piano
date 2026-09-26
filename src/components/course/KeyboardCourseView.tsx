import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { KEYBOARD_COURSE_MODULES } from '../../core/coursesData';
import type { CourseLesson, CourseModule, ScoreNote, CourseExercise } from '../../core/coursesData';
import { getNoteInfo } from '../../core/musicTheory';
import { midiManager } from '../../core/midiManager';
import { octaveConfigStore, useOctaveStandard } from '../../core/octaveConfigStore';
import { ScrollingScoreCanvas } from '../score/ScrollingScoreCanvas';
import type { ScoreErrorEvent } from '../score/scrolling/types';
import { FastChordTrainer } from '../piano/FastChordTrainer';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { LessonIllustration } from './illustrations/LessonIllustration';
import { accompanimentStore } from '../../core/accompanimentStore';
import { useActiveNotes } from '../../hooks/useActiveNotes';
import { soundEngine } from '../../core/soundEngine';
import { CourseContextualHeader } from './layout/CourseContextualHeader';
import { CourseLearningTrailModal } from './layout/CourseLearningTrailModal';
import { CourseStatusBar } from './layout/CourseStatusBar';
import {
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  Target,
  Award,
  Radio,
  ShieldAlert,
} from 'lucide-react';

interface PerformanceReport {
  exerciseId: string;
  exerciseTitle: string;
  hits: number;
  errors: number;
  totalNotes: number;
  accuracyPercent: number;
  averageJitterMs: number;
  averageCents: number;
  passed: boolean;
  feedbackMessage: string;
  pedagogicalTip: string;
}

export const KeyboardCourseView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(KEYBOARD_COURSE_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(KEYBOARD_COURSE_MODULES[0].lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const [practiceTab, setPracticeTab] = useState<'theory' | 'all' | 'score' | 'chords'>('theory');
  const [isTrailModalOpen, setIsTrailModalOpen] = useState<boolean>(false);
  const [isTipOpen, setIsTipOpen] = useState<boolean>(false);

  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);
  const [micHearingMidi, setMicHearingMidi] = useState<number | null>(null);
  const [targetScoreNote, setTargetScoreNote] = useState<ScoreNote | null>(null);
  const octaveStandard = useOctaveStandard();
  const [errorMidiNotes, setErrorMidiNotes] = useState<number[]>([]);
  const [correctMidiNotes, setCorrectMidiNotes] = useState<number[]>([]);

  // Parâmetros de Treino: Andamento customizável e acompanhamento musical
  const [customBpm, setCustomBpm] = useState<number | null>(null);
  const [isAccompanimentPlaying, setIsAccompanimentPlaying] = useState<boolean>(false);
  const [scoreResetKey, setScoreResetKey] = useState<number>(0);

  // Relatório de Desempenho e Feedback da Execução Real
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);

  // Rastreamento estrito de notas, ritmo (diffMs) e desvio de afinação (cents)
  const sessionHitsRef = useRef<number>(0);
  const sessionErrorsRef = useRef<number>(0);
  const sessionTimingDeltasRef = useRef<number[]>([]);
  const sessionCentsRef = useRef<number[]>([]);

  // Lista linear de todas as lições do curso para navegação Anterior / Próxima sem recarregar
  const allLessons = useMemo(() => {
    return KEYBOARD_COURSE_MODULES.flatMap((mod) =>
      mod.lessons.map((lesson) => ({ lesson, module: mod }))
    );
  }, []);

  const currentLinearIndex = useMemo(() => {
    const idx = allLessons.findIndex((item) => item.lesson.id === activeLesson.id);
    return idx !== -1 ? idx : 0;
  }, [allLessons, activeLesson.id]);

  const currentLessonCode = useMemo(() => {
    const match = activeLesson.title.match(/Lição\s+([\d.]+)/i);
    return match ? match[1] : `${currentLinearIndex + 1}`;
  }, [activeLesson.title, currentLinearIndex]);

  const handlePrevLesson = () => {
    if (currentLinearIndex > 0) {
      const prev = allLessons[currentLinearIndex - 1];
      setActiveLesson(prev.lesson);
      setSelectedModule(prev.module);
      setSelectedExerciseIndex(0);
      setCustomBpm(null);
      setPerformanceReport(null);
      setPracticeTab('theory');
    }
  };

  const handleNextLesson = () => {
    if (currentLinearIndex < allLessons.length - 1) {
      const next = allLessons[currentLinearIndex + 1];
      setActiveLesson(next.lesson);
      setSelectedModule(next.module);
      setSelectedExerciseIndex(0);
      setCustomBpm(null);
      setPerformanceReport(null);
      setPracticeTab('theory');
    }
  };

  // Carrega exercícios da lição atual (ou gera fallback se ausente)
  const exercises = useMemo<CourseExercise[]>(() => {
    if (activeLesson.exercises && activeLesson.exercises.length > 0) {
      return activeLesson.exercises;
    }
    return [
      {
        id: `${activeLesson.id}-ex1`,
        title: 'Exercício 1: Execução da Lição',
        goal: 'Executar as notas da partitura com precisão e fluidez.',
        type: 'phrase',
        bpm: 75,
        timeSignature: '4/4',
        scoreTrack: activeLesson.scoreTrack,
        targetChords: activeLesson.targetChords,
        evaluationCriteria: {
          minAccuracyPercent: 80,
          targetPrecisionMs: 150,
          description: 'Acertar ao menos 80% das notas com precisão temporal adequada.',
        },
      },
    ];
  }, [activeLesson]);

  const currentExercise = exercises[selectedExerciseIndex] || exercises[0];
  const activeBpm = customBpm ?? currentExercise.bpm;
  const activeScoreTrack = currentExercise.scoreTrack || activeLesson.scoreTrack;

  // Para acompanhamento ao desmontar componente
  useEffect(() => {
    return () => {
      accompanimentStore.stop();
      soundEngine.stopAllNotes();
    };
  }, []);

  // Limpeza de áudio em transições de lição ou exercício
  useEffect(() => {
    soundEngine.stopAllNotes();
  }, [activeLesson.id, selectedExerciseIndex]);

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

  const handleNoteInput = useCallback((midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  }, []);

  // Notas ouvidas via microfone acumuladas para identificação de acordes acústicos
  const [micAcousticNotes, setMicAcousticNotes] = useState<number[]>([]);

  // Fusão de todas as fontes ativas e identificação do acorde em tempo real
  const { activeNotes: activeExternalNotes, liveChord: liveIdentifiedChord } = useActiveNotes({
    micHearingMidi,
    micAcousticNotes,
  });

  // Escuta entradas MIDI de teclado físico externo (USB / OTG / Bluetooth)
  useEffect(() => {
    const unsub = midiManager.subscribe((payload) => {
      if (payload.isDown) {
        handleNoteInput(payload.midi);
      }
    });
    return unsub;
  }, [handleNoteInput]);

  const handleTargetNoteChange = useCallback((note: ScoreNote | null) => {
    setTargetScoreNote((prev) => {
      if (prev === note) return prev;
      return note;
    });
  }, []);

  const handleMicNoteHold = useCallback(
    (midi: number | null) => {
      setMicHearingMidi(midi);
      if (midi !== null) {
        handleNoteInput(midi);
      }
    },
    [handleNoteInput]
  );

  const resetSessionStats = () => {
    sessionHitsRef.current = 0;
    sessionErrorsRef.current = 0;
    sessionTimingDeltasRef.current = [];
    sessionCentsRef.current = [];
    setPerformanceReport(null);
    setErrorMidiNotes([]);
    setCorrectMidiNotes([]);
    setScoreResetKey((prev) => prev + 1);
  };

  const handleSelectExercise = (idx: number) => {
    setSelectedExerciseIndex(idx);
    setCustomBpm(null);
    resetSessionStats();
    if (accompanimentStore.getSnapshot().isPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    }
  };

  const handleNoteHit = useCallback((note: ScoreNote, diffMs: number) => {
    sessionHitsRef.current += 1;
    sessionTimingDeltasRef.current.push(Math.abs(diffMs));
    setCorrectMidiNotes([note.midi]);
    setTimeout(() => setCorrectMidiNotes([]), 350);
  }, []);

  const handleNoteError = useCallback((errorEvent: ScoreErrorEvent) => {
    sessionErrorsRef.current += 1;
    setErrorMidiNotes([errorEvent.playedMidi]);
    setTimeout(() => setErrorMidiNotes([]), 500);
  }, []);

  const handleExerciseComplete = useCallback(() => {
    const hits = sessionHitsRef.current;
    const errors = sessionErrorsRef.current;
    const totalEvaluated = hits + errors;
    const accuracyPercent = totalEvaluated > 0 ? Math.round((hits / totalEvaluated) * 100) : 0;

    const deltas = sessionTimingDeltasRef.current;
    const averageJitterMs =
      deltas.length > 0 ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : 0;

    const cents = sessionCentsRef.current;
    const averageCents =
      cents.length > 0 ? Math.round(cents.reduce((a, b) => a + b, 0) / cents.length) : 0;

    const minAcc = currentExercise.evaluationCriteria.minAccuracyPercent;
    const passed = accuracyPercent >= minAcc;

    let feedback = '';
    let pedagogicalTip = '';

    if (passed) {
      if (accuracyPercent >= 95 && averageJitterMs <= 60) {
        feedback = 'Execução Impecável! Fluidez e precisão rítmica de nível profissional.';
        pedagogicalTip = 'Você dominou o padrão visual e a articulação biomecânica desta lição!';
      } else {
        feedback = 'Exercício Concluído com Sucesso! Critério de precisão atingido.';
        pedagogicalTip = 'Continue praticando com metrônomo para aperfeiçoar a sincronia dos dedos.';
      }

      if (!completedExerciseIds.includes(currentExercise.id)) {
        setCompletedExerciseIds((prev) => [...prev, currentExercise.id]);
      }
    } else {
      feedback = `Acurácia de ${accuracyPercent}% (Meta: ${minAcc}%). Exercício requer maior fixação.`;
      pedagogicalTip = 'Experimente reduzir o andamento (BPM) e focar na mão relaxada.';
    }

    setPerformanceReport({
      exerciseId: currentExercise.id,
      exerciseTitle: currentExercise.title,
      hits,
      errors,
      totalNotes: totalEvaluated || 1,
      accuracyPercent,
      averageJitterMs,
      averageCents,
      passed,
      feedbackMessage: feedback,
      pedagogicalTip,
    });

    soundEngine.stopAllNotes(0.01);
    if (accompanimentStore.getSnapshot().isPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    }
  }, [currentExercise, completedExerciseIds]);

  const toggleAccompaniment = async () => {
    if (!currentExercise.accompanimentStyleId) return;

    if (isAccompanimentPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    } else {
      accompanimentStore.setBpm(activeBpm);
      accompanimentStore.setTimeSignature(currentExercise.timeSignature as any);
      accompanimentStore.setStyle(currentExercise.accompanimentStyleId as any);
      if (!accompanimentStore.getSnapshot().accompanimentEnabled) {
        accompanimentStore.toggleAccompaniment();
      }
      await accompanimentStore.start();
      setIsAccompanimentPlaying(true);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
    }
  };

  const handleSelectLesson = (lesson: CourseLesson, mod: CourseModule) => {
    setActiveLesson(lesson);
    setSelectedModule(mod);
    setSelectedExerciseIndex(0);
    setCustomBpm(null);
    setPerformanceReport(null);
    setPracticeTab('theory');
    if (accompanimentStore.getSnapshot().isPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    }
  };

  // Teclas destacadas e dedilhado orientativo para a lição ativa (foco apenas na nota alvo atual)
  const highlightedLessonKeys = useMemo(() => {
    const curNote =
      targetScoreNote || (activeScoreTrack && activeScoreTrack.length > 0 ? activeScoreTrack[0] : null);
    if (curNote) {
      return [
        {
          midi: curNote.midi,
          finger: curNote.fingerRightHand || curNote.fingerLeftHand,
          color: '#6366f1',
        },
      ];
    }
    return [];
  }, [targetScoreNote, activeScoreTrack]);

  const activeFingerPrompt = useMemo(() => {
    const curNote =
      targetScoreNote || (activeScoreTrack && activeScoreTrack.length > 0 ? activeScoreTrack[0] : null);
    if (curNote) {
      const fingerNum = curNote.fingerRightHand || curNote.fingerLeftHand;
      const hand = curNote.clef === 'bass' || curNote.midi < 60 ? 'ME' : 'MD';
      const names = ['', 'Polegar', 'Indicador', 'Médio', 'Anelar', 'Mínimo'];
      const colors = ['', '#f59e0b', '#38bdf8', '#10b981', '#c084fc', '#f43f5e'];
      const f = fingerNum || (hand === 'MD' ? (curNote.midi === 60 ? 1 : 2) : 5);
      const nInfo = getNoteInfo(curNote.midi, false, octaveStandard);
      return {
        finger: f,
        label: `${f}`,
        fingerName: names[f] || `D${f}`,
        noteName: `${nInfo.name}${nInfo.octave}`,
        color: colors[f] || '#38bdf8',
      };
    }
    return null;
  }, [targetScoreNote, activeScoreTrack, octaveStandard]);

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-[#070611] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      {/* HEADER DE CONTEXTO RESPONSIVO E UNIFICADO — Linha Única 44px (REQ-UI-LESSONHEADER-01) */}
      <CourseContextualHeader
        courseTitle="Curso de Teclado & Piano"
        courseIcon="🎹"
        currentLessonCode={currentLessonCode}
        totalLessons={allLessons.length}
        completedLessonsCount={completedLessonIds.length}
        lessonTitle={activeLesson.title}
        lessonLevel={activeLesson.level}
        onOpenTrail={() => setIsTrailModalOpen(true)}
        onPrevLesson={handlePrevLesson}
        onNextLesson={handleNextLesson}
        hasPrevLesson={currentLinearIndex > 0}
        hasNextLesson={currentLinearIndex < allLessons.length - 1}
        tabs={[
          {
            id: 'theory',
            label: 'Teoria & Postura',
            shortLabel: 'Teoria',
          },
          {
            id: 'all',
            label: 'Prática Completa',
            shortLabel: 'Prática',
            icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
          },
          //{ id: 'score', label: 'Partitura Completa', shortLabel: 'Partitura' },
          ...(activeLesson.targetChords
            ? [{ id: 'chords', label: 'Treinador de Acordes', shortLabel: 'Acordes' }]
            : []),
        ]}
        activeTabId={practiceTab}
        onSelectTab={(id) => setPracticeTab(id as any)}
        isCompleted={isCurrentCompleted}
        onToggleComplete={() => handleLessonComplete(activeLesson.id)}
        accentColor="indigo"
      />

      {/* 3. SIMULADOR & ÁREA FULL-WIDTH (100% da Largura Útil sem Sidebar Fixa) */}
      <div className="flex-1 w-full p-2 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
        {/* Bloco Teoria & Biomecânica quando em aba Teoria ou Prática Completa */}
        {(practiceTab === 'all' || practiceTab === 'theory') && (
          <div className="space-y-3">
            {practiceTab === 'all' && (
              <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>{octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.heading, octaveStandard)}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-4xl">
                    {octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.text, octaveStandard)}
                  </p>
                </div>
                {activeLesson.instructions.fingeringTip && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 shrink-0 max-w-md">
                    <strong className="text-indigo-300 font-bold">Dica de Digitação:</strong> {octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.fingeringTip, octaveStandard)}
                  </div>
                )}
              </div>
            )}

            {practiceTab === 'theory' && (
              <div className="space-y-4 animate-fadeIn">
                <LessonIllustration
                  lessonId={activeLesson.id}
                  moduleCode={selectedModule.code}
                  title={activeLesson.title}
                  instrument="keyboard"
                  targetNotes={activeScoreTrack?.map((n) =>
                    getNoteInfo(n.midi, false, octaveStandard).fullName
                  )}
                  fingeringTip={octaveConfigStore.formatNoteOctavesInText(
                    activeLesson.instructions.fingeringTip || '',
                    octaveStandard
                  )}
                />

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>{octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.heading, octaveStandard)}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.text, octaveStandard)}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 pt-1">
                    {activeLesson.instructions.bulletPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{octaveConfigStore.formatNoteOctavesInText(pt, octaveStandard)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {(activeLesson.instructions.fingeringTip || activeLesson.instructions.postureAlert) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.instructions.fingeringTip && (
                      <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
                        <strong className="text-cyan-300">Dica de Digitação:</strong> {octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.fingeringTip, octaveStandard)}
                      </div>
                    )}

                    {activeLesson.instructions.postureAlert && (
                      <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-rose-300">Alerta de Postura:</strong> {octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.postureAlert, octaveStandard)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bloco Partitura Deslizante & Exercícios Práticos */}
        {(practiceTab === 'all' || practiceTab === 'score') && activeScoreTrack && (
          <div className="space-y-3">
            {/* Seletor Horizontal de Exercícios */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-1.5 shrink-0">
                  <Target className="w-4 h-4" />
                  <span>Exercícios:</span>
                </span>
                {exercises.map((ex, idx) => {
                  const isSel = idx === selectedExerciseIndex;
                  const isDone = completedExerciseIds.includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExercise(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${isSel
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white border-white/5'
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{ex.title}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Botão de Acompanhamento / Banda */}
              {currentExercise.accompanimentStyleId && (
                <button
                  onClick={toggleAccompaniment}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${isAccompanimentPlaying
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : 'bg-white/5 text-slate-300 hover:text-white border-white/5'
                    }`}
                  title="Tocar com estilo rítmico automático de acompanhamento"
                >
                  {isAccompanimentPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>Acompanhamento</span>
                </button>
              )}
            </div>

            {/* Relatório de Desempenho (se avaliado) */}
            {performanceReport && (
              <div
                className={`p-3.5 rounded-2xl border ${performanceReport.passed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <Award className={`w-4 h-4 ${performanceReport.passed ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span className="font-bold text-white">
                      {performanceReport.passed ? '🎉 Exercício Aprovado!' : '⚠️ Necessita Praticar Mais'} — {performanceReport.feedbackMessage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetSessionStats}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Repetir
                    </button>
                    {selectedExerciseIndex + 1 < exercises.length && performanceReport.passed && (
                      <button
                        onClick={() => handleSelectExercise(selectedExerciseIndex + 1)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold cursor-pointer shadow-md"
                      >
                        Próximo Exercício &rarr;
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Acertos</span>
                    <span className="text-sm font-black text-white">{performanceReport.accuracyPercent}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Precisão Ritmo</span>
                    <span className="text-sm font-black text-cyan-300 font-mono">&plusmn;{performanceReport.averageJitterMs} ms</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Afinação</span>
                    <span className="text-sm font-black text-amber-300 font-mono">
                      {performanceReport.averageCents > 0 ? `±${performanceReport.averageCents}¢` : 'MIDI 100%'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Escuta Acústica (Microfone) */}
            <MicrophonePitchBar
              onNoteDetected={(midi) => handleNoteInput(midi)}
              onNoteHold={(midi) => handleMicNoteHold(midi)}
              onAcousticChordNotesChange={(notes) => setMicAcousticNotes(notes)}
              expectedMidi={targetScoreNote?.midi ?? null}
              expectedNoteName={
                targetScoreNote ? getNoteInfo(targetScoreNote.midi, false, octaveStandard).fullName : undefined
              }
              expectedChordName={targetScoreNote?.chordName}
              isErrorActive={errorMidiNotes.length > 0}
            />

            {/* Partitura Deslizante Full-Width */}
            <ScrollingScoreCanvas
              key={`${currentExercise.id}-${scoreResetKey}`}
              notes={activeScoreTrack}
              timeSignature={currentExercise.timeSignature}
              bpm={activeBpm}
              onTempoChange={(newBpm) => setCustomBpm(newBpm)}
              autoPlayAudio={true}
              currentMidiPressed={lastMidiEvent}
              onTargetNoteChange={handleTargetNoteChange}
              onNoteHit={handleNoteHit}
              onNoteError={handleNoteError}
              onLessonComplete={handleExerciseComplete}
            />
          </div>
        )}

        {/* Bloco Teclado Virtual Full-Width */}
        {(practiceTab === 'all' || practiceTab === 'score' || practiceTab === 'theory') && (
          <div className="space-y-2">
            {/* Monitor Acústico de Acorde / Nota Escutada */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 px-3 rounded-xl bg-black/40 border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${liveIdentifiedChord ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">
                  Instrumento:
                </span>
                {liveIdentifiedChord ? (
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black font-display text-amber-400">
                      {liveIdentifiedChord.symbol}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      ({liveIdentifiedChord.namePt})
                    </span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    Toque no piano ou fale ao microfone para reconhecer em tempo real...
                  </span>
                )}
              </div>

              {targetScoreNote?.chordName && (
                <div className="text-[10px] font-mono text-indigo-300">
                  Alvo: <span className="font-bold text-white">{targetScoreNote.chordName}</span>
                </div>
              )}
            </div>

            {/* Teclado Virtual */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#090814] p-1 sm:p-2">
              <PianoKeyboard
                startOctave={2}
                allowOctaveControls={true}
                highlightedKeys={highlightedLessonKeys}
                activeFingerPrompt={activeFingerPrompt}
                activeExternalNotes={activeExternalNotes}
                errorNotes={errorMidiNotes}
                correctNotes={correctMidiNotes}
                onKeyPlay={(midi) => handleNoteInput(midi)}
                onKeyRelease={() => setLastMidiEvent(null)}
              />
            </div>
          </div>
        )}

        {/* Bloco Treinador de Acordes */}
        {(practiceTab === 'all' || practiceTab === 'chords') && activeLesson.targetChords && (
          <div className="pt-2">
            <FastChordTrainer />
          </div>
        )}
      </div>

      {/* 4. STATUS BAR INFERIOR — até 30px */}
      <CourseStatusBar
        pedagogicalTip={
          activeLesson.instructions.fingeringTip ||
          activeLesson.instructions.postureAlert ||
          activeLesson.subtitle
        }
        isTipOpen={isTipOpen}
        onToggleTip={() => setIsTipOpen(!isTipOpen)}
        audioRecognitionActive={true}
        hearingNoteName={micHearingMidi ? getNoteInfo(micHearingMidi, false, octaveStandard).name : null}
        midiConnected={true}
        statusText="Pronto"
      />

      {/* 5. MODAL DA TRILHA DE APRENDIZADO (Overlay Flutuante) */}
      <CourseLearningTrailModal
        isOpen={isTrailModalOpen}
        onClose={() => setIsTrailModalOpen(false)}
        courseTitle="Curso de Teclado & Piano"
        modules={KEYBOARD_COURSE_MODULES}
        activeLessonId={activeLesson.id}
        completedLessonIds={completedLessonIds}
        onSelectLesson={(lesson, mod) => handleSelectLesson(lesson as CourseLesson, mod as CourseModule)}
        accentColor="indigo"
      />
    </div>
  );
};
