import React, { useState, useEffect, useMemo, useCallback, useRef, useSyncExternalStore } from 'react';
import { KEYBOARD_COURSE_MODULES } from '../../core/coursesData';
import type { CourseLesson, CourseModule, ScoreNote, CourseExercise } from '../../core/coursesData';
import { getNoteInfo, identifyChordFromMidi } from '../../core/musicTheory';
import { octaveConfigStore, useOctaveStandard } from '../../core/octaveConfigStore';
import { midiManager } from '../../core/midiManager';
import { activeMidiStore } from '../../core/activeMidiStore';
import { ScrollingScoreCanvas } from '../score/ScrollingScoreCanvas';
import { FastChordTrainer } from '../piano/FastChordTrainer';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { LessonIllustration } from './illustrations/LessonIllustration';
import { accompanimentStore } from '../../core/accompanimentStore';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  Target,
  Award,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertCircle,
  Radio,
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
  const [practiceTab, setPracticeTab] = useState<'all' | 'theory' | 'score' | 'chords'>('all');
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);
  const [micHearingMidi, setMicHearingMidi] = useState<number | null>(null);
  const [targetScoreNote, setTargetScoreNote] = useState<ScoreNote | null>(null);
  const octaveStandard = useOctaveStandard();
  const [errorMidiNotes, setErrorMidiNotes] = useState<number[]>([]);
  const [correctMidiNotes, setCorrectMidiNotes] = useState<number[]>([]);
  const [isWidescreenStage, setIsWidescreenStage] = useState<boolean>(false);
  const [isTrailExpanded, setIsTrailExpanded] = useState<boolean>(false);
  const [isFullscreenLesson, setIsFullscreenLesson] = useState<boolean>(false);
  const [isFullscreenTrail, setIsFullscreenTrail] = useState<boolean>(false);
  const [mobileCourseTab, setMobileCourseTab] = useState<'stage' | 'trail'>('stage');

  // Parâmetros de Treino: Andamento customizável, metrônomo e acompanhamento
  const [customBpm, setCustomBpm] = useState<number | null>(null);
  const [enableMetronomeSound, setEnableMetronomeSound] = useState<boolean>(true);
  const [isAccompanimentPlaying, setIsAccompanimentPlaying] = useState<boolean>(false);
  const [scoreResetKey, setScoreResetKey] = useState<number>(0);

  // Relatório de Desempenho e Feedback da Execução Real
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);

  // Rastreamento estrito de notas, ritmo (diffMs) e desvio de afinação (cents)
  const sessionHitsRef = useRef<number>(0);
  const sessionErrorsRef = useRef<number>(0);
  const sessionTimingDeltasRef = useRef<number[]>([]);
  const sessionCentsRef = useRef<number[]>([]);

  // Carrega exercícios da lição atual (ou gera fallback se ausente)
  const exercises = useMemo<CourseExercise[]>(() => {
    if (activeLesson.exercises && activeLesson.exercises.length > 0) {
      return activeLesson.exercises;
    }
    return [{
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
    }];
  }, [activeLesson]);

  const currentExercise = exercises[selectedExerciseIndex] || exercises[0];
  const activeBpm = customBpm ?? currentExercise.bpm;
  const activeScoreTrack = currentExercise.scoreTrack || activeLesson.scoreTrack;

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

  const toggleFullscreenTrail = () => {
    if (!isFullscreenTrail) {
      setIsFullscreenTrail(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    } else {
      setIsFullscreenTrail(false);
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
        if (isFullscreenTrail) setIsFullscreenTrail(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenLesson, isFullscreenTrail]);

  // Para acompanhamento ao desmontar componente
  useEffect(() => {
    return () => {
      accompanimentStore.stop();
    };
  }, []);

  const handleNoteInput = useCallback((midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  }, []);

  // Escuta entradas MIDI de teclado físico externo (USB / OTG / Bluetooth)
  useEffect(() => {
    midiManager.initialize();
    const unsub = midiManager.subscribe((payload) => {
      if (payload.isDown) {
        handleNoteInput(payload.midi);
      }
    });
    return unsub;
  }, [handleNoteInput]);

  // Subscreve ao store global de notas MIDI ativas
  const globalActiveMidi = useSyncExternalStore(
    activeMidiStore.subscribe,
    activeMidiStore.getSnapshot,
  );

  // Notas ouvidas via microfone acumuladas para identificação de acordes acústicos
  const [micAcousticNotes, setMicAcousticNotes] = useState<number[]>([]);

  // Combina todas as notas externas ativas (microfone + teclado MIDI)
  const activeExternalNotes = useMemo(() => {
    const set = new Set<number>();
    globalActiveMidi.forEach(m => set.add(m));
    micAcousticNotes.forEach(m => set.add(m));
    if (micHearingMidi !== null) set.add(micHearingMidi);
    return Array.from(set);
  }, [globalActiveMidi, micAcousticNotes, micHearingMidi]);

  // Identificação em tempo real do acorde ou nota externa executada
  const liveIdentifiedChord = useMemo(() => {
    return identifyChordFromMidi(activeExternalNotes, octaveStandard);
  }, [activeExternalNotes, octaveStandard]);

  const handleTargetNoteChange = useCallback((note: ScoreNote | null) => {
    setTargetScoreNote(prev => {
      if (prev === note) return prev;
      if (prev?.midi === note?.midi && prev?.duration === note?.duration) return prev;
      return note;
    });
  }, []);

  const handleNoteHit = useCallback((note: ScoreNote, diffMs?: number) => {
    sessionHitsRef.current += 1;
    if (diffMs !== undefined && !isNaN(diffMs)) {
      sessionTimingDeltasRef.current.push(Math.abs(diffMs));
    }
    setCorrectMidiNotes([note.midi]);
    setErrorMidiNotes([]);
    setTimeout(() => setCorrectMidiNotes([]), 600);
  }, []);

  const handleNoteError = useCallback((err: { playedMidi: number }) => {
    sessionErrorsRef.current += 1;
    setErrorMidiNotes([err.playedMidi]);
    setTimeout(() => setErrorMidiNotes([]), 1400);
  }, []);

  const handleMicNoteHold = useCallback((midi: number | null, cents?: number) => {
    setMicHearingMidi(midi);
    if (cents !== undefined && !isNaN(cents)) {
      sessionCentsRef.current.push(Math.abs(cents));
    }
  }, []);

  const resetSessionStats = useCallback(() => {
    sessionHitsRef.current = 0;
    sessionErrorsRef.current = 0;
    sessionTimingDeltasRef.current = [];
    sessionCentsRef.current = [];
    setPerformanceReport(null);
    setScoreResetKey(k => k + 1);
  }, []);

  const handleSelectLesson = (lesson: CourseLesson, mod: CourseModule) => {
    setSelectedModule(mod);
    setActiveLesson(lesson);
    setSelectedExerciseIndex(0);
    setCustomBpm(null);
    resetSessionStats();
    if (isAccompanimentPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    }
    setPracticeTab('all');
    setMobileCourseTab('stage');
  };

  const handleSelectExercise = (idx: number) => {
    setSelectedExerciseIndex(idx);
    setCustomBpm(null);
    resetSessionStats();
    if (isAccompanimentPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    }
  };

  const handleLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessonIds(prev => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
  }, []);

  // Avaliação rigorosa da execução prática ao término do exercício
  const handleExerciseComplete = useCallback(() => {
    const totalNotes = currentExercise.scoreTrack?.length || 1;
    const hits = sessionHitsRef.current;
    const errors = sessionErrorsRef.current;
    const accuracyPercent = Math.min(100, Math.round((hits / totalNotes) * 100));

    const jitters = sessionTimingDeltasRef.current;
    const avgJitter = jitters.length > 0
      ? Math.round(jitters.reduce((a, b) => a + b, 0) / jitters.length)
      : 0;

    const centsArr = sessionCentsRef.current;
    const avgCents = centsArr.length > 0
      ? Math.round(centsArr.reduce((a, b) => a + b, 0) / centsArr.length)
      : 0;

    const passed = accuracyPercent >= currentExercise.evaluationCriteria.minAccuracyPercent;

    let feedbackMessage = '';
    let pedagogicalTip = '';

    if (passed && accuracyPercent >= 90 && avgJitter <= 80) {
      feedbackMessage = 'Execução Primorosa! Pulso rítmico estável e firmeza mecânica exemplar.';
      pedagogicalTip = 'Você dominou o padrão deste exercício. Sinta-se à vontade para avançar ao próximo nível ou subir o andamento em +5 BPM.';
    } else if (passed) {
      feedbackMessage = 'Exercício Aprovado! Meta de acertos e tempo atingida com sucesso.';
      pedagogicalTip = avgJitter > 100
        ? 'Dica de Ritmo: mantenha a contagem mental "1, 2, 3, 4" sincronizada com o clique do metrônomo para diminuir a oscilação.'
        : 'Boa estabilidade! Lembre-se de manter os ombros e punhos livres de tensão.';
    } else {
      feedbackMessage = 'Abaixo da meta de precisão. Pratique novamente com andamento calmo!';
      pedagogicalTip = hits < totalNotes * 0.7
        ? 'Dica do Método: reduza o BPM em 10 ou 15 pontos e toque observando atentamente a numeração dos dedos recomendada.'
        : 'Atenção aos tempos fracos: respire e prepare o próximo dedo antes do ataque na tecla.';
    }

    setPerformanceReport({
      exerciseId: currentExercise.id,
      exerciseTitle: currentExercise.title,
      hits,
      errors,
      totalNotes,
      accuracyPercent,
      averageJitterMs: avgJitter,
      averageCents: avgCents,
      passed,
      feedbackMessage,
      pedagogicalTip,
    });

    if (passed) {
      setCompletedExerciseIds(prev => (prev.includes(currentExercise.id) ? prev : [...prev, currentExercise.id]));

      // Verifica se todos os exercícios da lição foram concluídos
      const allDone = exercises.every(ex => ex.id === currentExercise.id || completedExerciseIds.includes(ex.id));
      if (allDone) {
        handleLessonComplete(activeLesson.id);
      }
    }
  }, [currentExercise, exercises, completedExerciseIds, activeLesson.id, handleLessonComplete]);

  // Alterna acompanhamento com auto-arranjador
  const toggleAccompaniment = () => {
    if (isAccompanimentPlaying) {
      accompanimentStore.stop();
      setIsAccompanimentPlaying(false);
    } else {
      const styleId = (currentExercise.accompanimentStyleId as any) || 'pop-ballad';
      accompanimentStore.setStyle(styleId);
      accompanimentStore.setBpm(activeBpm);
      accompanimentStore.setTimeSignature((currentExercise.timeSignature as any) || '4/4');
      accompanimentStore.start();
      setIsAccompanimentPlaying(true);
    }
  };

  // Teclas ativas com erro (vermelho vivo no teclado virtual e partitura)
  const activeErrors = useMemo(() => {
    const list = [...errorMidiNotes];
    if (micHearingMidi !== null && targetScoreNote && micHearingMidi !== targetScoreNote.midi) {
      if (!list.includes(micHearingMidi)) list.push(micHearingMidi);
    }
    return list;
  }, [errorMidiNotes, micHearingMidi, targetScoreNote]);

  // Teclas ativas com acerto (verde esmeralda no teclado virtual e partitura)
  const activeCorrect = useMemo(() => {
    const list = [...correctMidiNotes];
    if (micHearingMidi !== null && targetScoreNote && micHearingMidi === targetScoreNote.midi) {
      if (!list.includes(micHearingMidi)) list.push(micHearingMidi);
    }
    return list;
  }, [correctMidiNotes, micHearingMidi, targetScoreNote]);

  // Teclas destacadas e dedilhado orientativo para a lição ativa (foco apenas na nota alvo atual)
  const highlightedLessonKeys = useMemo(() => {
    const curNote = targetScoreNote || (activeScoreTrack && activeScoreTrack.length > 0 ? activeScoreTrack[0] : null);
    if (curNote) {
      return [{
        midi: curNote.midi,
        finger: curNote.fingerRightHand || curNote.fingerLeftHand,
        color: '#6366f1',
      }];
    }
    return [];
  }, [targetScoreNote, activeScoreTrack]);

  const activeFingerPrompt = useMemo(() => {
    const curNote = targetScoreNote || (activeScoreTrack && activeScoreTrack.length > 0 ? activeScoreTrack[0] : null);
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
    <div className="w-full space-y-4">
      {/* Banner Principal do Curso de Teclado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-[#140e2b]/80 to-[#0a0718]/90 border border-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                  Do Zero ao Avançado
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {completedLessonIds.length} lições • {completedExerciseIds.length} exercícios concluídos
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Curso Interativo de Teclado &amp; Piano
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsWidescreenStage(!isWidescreenStage)}
            className="px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center gap-2 border border-white/5 cursor-pointer transition-all self-start md:self-auto"
          >
            {isWidescreenStage ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Exibir Módulos</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Modo Palco Total (100% Largura)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seletor Adaptativo para Celulares e Tablets (< 1024px) */}
      <div className="lg:hidden flex items-center bg-black/40 p-1 rounded-2xl border border-white/5">
        <button
          onClick={() => setMobileCourseTab('stage')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileCourseTab === 'stage'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Lição &amp; Prática</span>
        </button>

        <button
          onClick={() => setMobileCourseTab('trail')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileCourseTab === 'trail'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Trilha ({completedLessonIds.length}/{KEYBOARD_COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0)})</span>
        </button>
      </div>

      {/* Grid: Grade de Módulos (Esquerda) e Painel de Aula Interativa (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Coluna 1: Grade de Lições e Módulos */}
        {!isWidescreenStage && (
          <div className={`${isTrailExpanded ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-4 xl:col-span-3 2xl:col-span-3'} ${mobileCourseTab === 'trail' ? 'flex' : 'hidden lg:flex'} h-full flex-col`}>
            <div
              className={`glass-card rounded-3xl p-4 border border-white/5 space-y-3 flex flex-col flex-1 h-full transition-all ${
                isFullscreenTrail
                  ? 'fixed inset-0 z-50 bg-[#080811] p-4 sm:p-8 overflow-y-auto m-0 rounded-none border-none shadow-2xl'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5 shrink-0">
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Trilha de Aprendizado</span>
                </h3>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold mr-1">
                    {KEYBOARD_COURSE_MODULES.length} Módulos
                  </span>

                  <button
                    onClick={() => setIsTrailExpanded(!isTrailExpanded)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isTrailExpanded
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isTrailExpanded ? 'Reduzir largura da trilha' : 'Expandir largura da trilha'}
                  >
                    {isTrailExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={toggleFullscreenTrail}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isFullscreenTrail
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isFullscreenTrail ? 'Sair da Tela Cheia (Esc)' : 'Tela Cheia na Trilha de Aprendizado'}
                  >
                    {isFullscreenTrail ? <Shrink className="w-3.5 h-3.5 text-rose-400" /> : <Expand className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar">
                {KEYBOARD_COURSE_MODULES.map((mod) => (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-300 px-2">
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
                            className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-indigo-600/30 border-indigo-500/40 text-white shadow-md'
                                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                isDone ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'
                              }`} />
                              <div className="truncate">
                                <div className="text-xs font-bold truncate text-white">
                                  {lesson.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {lesson.subtitle}
                                </div>
                              </div>
                            </div>

                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Coluna 2 / Palco Total: Painel da Lição */}
        <div
          className={`${
            isWidescreenStage
              ? 'lg:col-span-12'
              : isTrailExpanded
              ? 'lg:col-span-6 xl:col-span-7'
              : 'lg:col-span-8 xl:col-span-9 2xl:col-span-9'
          } ${mobileCourseTab === 'stage' ? 'flex' : 'hidden lg:flex'} h-full flex-col space-y-4`}
        >
          <div
            className={`glass-card rounded-3xl p-4 sm:p-6 border border-white/5 space-y-4 flex-1 flex flex-col transition-all ${
              isFullscreenLesson
                ? 'fixed inset-0 z-50 bg-[#080811] p-4 sm:p-8 overflow-y-auto m-0 rounded-none border-none shadow-2xl'
                : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                  {selectedModule.code} • {activeLesson.level} • {activeLesson.durationMinutes} min • {exercises.length} Exercícios Práticos
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  {activeLesson.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {activeLesson.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {/* Seletor de Modo da Lição */}
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 text-xs font-bold">
                  <button
                    onClick={() => setPracticeTab('all')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      practiceTab === 'all'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Aula Completa (Tudo)</span>
                  </button>

                  <button
                    onClick={() => setPracticeTab('theory')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      practiceTab === 'theory' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Teoria &amp; Postura
                  </button>

                  {activeScoreTrack && (
                    <button
                      onClick={() => setPracticeTab('score')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        practiceTab === 'score' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Exercícios na Partitura
                    </button>
                  )}

                  {activeLesson.targetChords && (
                    <button
                      onClick={() => setPracticeTab('chords')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        practiceTab === 'chords' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Treinador de Acordes
                    </button>
                  )}
                </div>

                {/* Controles de Janela do Card */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setIsWidescreenStage(!isWidescreenStage)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isWidescreenStage
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isWidescreenStage ? 'Restaurar layout padrão' : 'Expandir para 100% da largura'}
                  >
                    {isWidescreenStage ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleFullscreenLesson}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isFullscreenLesson
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-400'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isFullscreenLesson ? 'Sair da Tela Cheia' : 'Tela Cheia Imersiva'}
                  >
                    {isFullscreenLesson ? <Shrink className="w-4 h-4 text-rose-400" /> : <Expand className="w-4 h-4 text-indigo-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bloco 1: Teoria Didática, Biomecânica & Postura */}
            {(practiceTab === 'all' || practiceTab === 'theory') && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <LessonIllustration
                  lessonId={activeLesson.id}
                  moduleCode={selectedModule.code}
                  title={activeLesson.title}
                  instrument="keyboard"
                  targetNotes={activeScoreTrack?.map(n => getNoteInfo(n.midi, false, octaveStandard).fullName)}
                  fingeringTip={octaveConfigStore.formatNoteOctavesInText(activeLesson.instructions.fingeringTip || '', octaveStandard)}
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

            {/* Bloco 2: Múltiplos Exercícios Práticos & Partitura Deslizante com Escuta Real */}
            {(practiceTab === 'all' || practiceTab === 'score') && activeScoreTrack && (
              <div className="space-y-3 pt-3 border-t border-white/5 animate-fade-in">
                {/* Seletor de Exercícios da Lição (Tabs) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>Exercícios Práticos do Módulo</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Exercício {selectedExerciseIndex + 1} de {exercises.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {exercises.map((ex, idx) => {
                      const isSel = idx === selectedExerciseIndex;
                      const isDone = completedExerciseIds.includes(ex.id);
                      return (
                        <button
                          key={ex.id}
                          onClick={() => handleSelectExercise(idx)}
                          className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                            isSel
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-md'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border-white/5'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                          <span>{ex.title}</span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Banner de Metas & Recursos de Treino (Metrônomo + Acompanhamento Musical) */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {currentExercise.type.toUpperCase()}
                      </span>
                      <strong className="text-white">{currentExercise.title}</strong>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      🎯 <strong>Objetivo:</strong> {octaveConfigStore.formatNoteOctavesInText(currentExercise.goal, octaveStandard)}
                    </p>
                    <p className="text-slate-400 text-[10px] font-mono">
                      Critério: Meta &ge; {currentExercise.evaluationCriteria.minAccuracyPercent}% • Precisão alvo &plusmn;{currentExercise.evaluationCriteria.targetPrecisionMs}ms
                    </p>
                  </div>

                  {/* Controles de Metrônomo & Acompanhamento */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
                    {/* Controle de BPM */}
                    <div className="flex items-center bg-black/40 rounded-xl border border-white/5 p-1 font-mono text-xs">
                      <button
                        onClick={() => setCustomBpm(Math.max(40, activeBpm - 5))}
                        className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold"
                        title="Diminuir andamento (-5 BPM)"
                      >
                        -
                      </button>
                      <span className="px-2 text-white font-bold">{activeBpm} BPM</span>
                      <button
                        onClick={() => setCustomBpm(Math.min(180, activeBpm + 5))}
                        className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold"
                        title="Aumentar andamento (+5 BPM)"
                      >
                        +
                      </button>
                    </div>

                    {/* Metrônomo Sonoro */}
                    <button
                      onClick={() => setEnableMetronomeSound(!enableMetronomeSound)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        enableMetronomeSound
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
                      }`}
                      title={enableMetronomeSound ? 'Metrônomo Sonoro Ativo' : 'Metrônomo Sonoro Desativado'}
                    >
                      {enableMetronomeSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>Metrônomo</span>
                    </button>

                    {/* Acompanhamento Estilo Musical */}
                    {currentExercise.accompanimentStyleId && (
                      <button
                        onClick={toggleAccompaniment}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAccompanimentPlaying
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                            : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
                        }`}
                        title="Tocar com banda/estilo rítmico automático de acompanhamento"
                      >
                        {isAccompanimentPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>Acompanhamento</span>
                      </button>
                    )}

                    {/* Reiniciar Exercício */}
                    <button
                      onClick={resetSessionStats}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 cursor-pointer"
                      title="Reiniciar estatísticas e partitura"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card de Avaliação / Relatório de Desempenho Real (sem simulação) */}
                {performanceReport && (
                  <div className={`p-4 rounded-2xl border animate-fade-in ${
                    performanceReport.passed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <Award className={`w-5 h-5 ${performanceReport.passed ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <div>
                          <div className="font-bold text-sm text-white">
                            {performanceReport.passed ? '🎉 Exercício Aprovado!' : '⚠️ Necessita Praticar Mais'}
                          </div>
                          <div className="text-xs text-slate-300">
                            {performanceReport.feedbackMessage}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={resetSessionStats}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Repetir Exercício
                        </button>
                        {selectedExerciseIndex + 1 < exercises.length && performanceReport.passed && (
                          <button
                            onClick={() => handleSelectExercise(selectedExerciseIndex + 1)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md"
                          >
                            Próximo Exercício &rarr;
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Estatísticas Detalhadas da Execução Real */}
                    <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Acerto de Notas</span>
                        <span className="text-base font-black text-white">
                          {performanceReport.accuracyPercent}%
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {performanceReport.hits} de {performanceReport.totalNotes} notas
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Precisão de Ritmo</span>
                        <span className="text-base font-black text-cyan-300 font-mono">
                          &plusmn;{performanceReport.averageJitterMs} ms
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {performanceReport.averageJitterMs <= 80 ? 'Excelente timing' : 'Oscilação moderada'}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Afinação / Áudio</span>
                        <span className="text-base font-black text-amber-300 font-mono">
                          {performanceReport.averageCents > 0 ? `±${performanceReport.averageCents}¢` : 'Direto (MIDI)'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {performanceReport.averageCents > 0 ? 'Microfone ativo' : 'Precisão tonal 100%'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-300 pt-2 border-t border-white/5 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{performanceReport.pedagogicalTip}</span>
                    </div>
                  </div>
                )}

                {/* Escuta Acústica (Microfone / Cabo Aux / USB) posicionada acima da partitura */}
                <MicrophonePitchBar
                  onNoteDetected={(midi) => handleNoteInput(midi)}
                  onNoteHold={(midi) => handleMicNoteHold(midi)}
                  onAcousticChordNotesChange={(notes) => setMicAcousticNotes(notes)}
                  expectedMidi={targetScoreNote?.midi ?? null}
                  expectedNoteName={targetScoreNote ? getNoteInfo(targetScoreNote.midi, false, octaveStandard).fullName : undefined}
                  expectedChordName={targetScoreNote?.chordName}
                  isErrorActive={activeErrors.length > 0}
                />

                <ScrollingScoreCanvas
                  key={`${currentExercise.id}-${scoreResetKey}`}
                  notes={activeScoreTrack}
                  timeSignature={currentExercise.timeSignature}
                  bpm={activeBpm}
                  autoPlayAudio={true}
                  enableMetronomeSound={enableMetronomeSound}
                  currentMidiPressed={lastMidiEvent}
                  onTargetNoteChange={handleTargetNoteChange}
                  onNoteHit={handleNoteHit}
                  onNoteError={handleNoteError}
                  onLessonComplete={handleExerciseComplete}
                />
              </div>
            )}

            {/* Bloco 3: Teclado Virtual colado imediatamente abaixo da Partitura */}
            {(practiceTab === 'all' || practiceTab === 'theory' || practiceTab === 'score') && (
              <div className={activeScoreTrack && (practiceTab === 'all' || practiceTab === 'score') ? 'pt-1.5 animate-fade-in' : 'pt-3 space-y-3 border-t border-white/5 animate-fade-in'}>
                {(!activeScoreTrack || practiceTab === 'theory') && (
                  <>
                    <MicrophonePitchBar
                      onNoteDetected={(midi) => handleNoteInput(midi)}
                      onNoteHold={(midi) => handleMicNoteHold(midi)}
                      onAcousticChordNotesChange={(notes) => setMicAcousticNotes(notes)}
                      expectedMidi={targetScoreNote?.midi ?? null}
                      expectedNoteName={targetScoreNote?.noteName}
                      expectedChordName={targetScoreNote?.chordName}
                      isErrorActive={activeErrors.length > 0}
                    />
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                      Pratique as Teclas e Dedilhado no Teclado Virtual ou no seu Piano Real:
                    </span>
                  </>
                )}

                {/* Painel de Reconhecimento em Tempo Real de Acorde / Nota Escutada */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 mb-2">
                  <div className="flex items-center gap-2">
                    <Radio className={`w-3.5 h-3.5 ${liveIdentifiedChord ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                    <span className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                      Escutado no Instrumento:
                    </span>
                    {liveIdentifiedChord ? (
                      <span className="flex items-baseline gap-2">
                        <span className="text-base font-black font-display text-amber-400">
                          {liveIdentifiedChord.symbol}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          ({liveIdentifiedChord.namePt})
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                          [{liveIdentifiedChord.notesPt.join(' • ')}]
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Toque no piano/teclado para identificar notas e acordes em tempo real...
                      </span>
                    )}
                  </div>

                  {targetScoreNote?.chordName && (
                    <div className="text-[11px] font-mono text-indigo-300">
                      Acorde da partitura: <span className="font-bold text-white">{targetScoreNote.chordName}</span>
                    </div>
                  )}
                </div>

                <PianoKeyboard
                  startOctave={2}
                  octaveCount={3}
                  allowOctaveControls={true}
                  highlightedKeys={highlightedLessonKeys}
                  activeFingerPrompt={activeFingerPrompt}
                  activeExternalNotes={activeExternalNotes}
                  errorNotes={activeErrors}
                  correctNotes={activeCorrect}
                  onKeyPlay={(midi) => handleNoteInput(midi)}
                  onKeyRelease={() => setLastMidiEvent(null)}
                />
              </div>
            )}

            {/* Bloco 4: Acelerador de Acordes & Inversões */}
            {(practiceTab === 'all' || practiceTab === 'chords') && activeLesson.targetChords && (
              <div className="pt-3 border-t border-white/5 animate-fade-in">
                <FastChordTrainer />
              </div>
            )}

            {/* Rodapé da Aula: Botão Concluir Lição */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {isCurrentCompleted ? '✅ Lição Concluída!' : 'Conclua os exercícios da aula para registrar o avanço'}
              </span>

              <button
                onClick={() => handleLessonComplete(activeLesson.id)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isCurrentCompleted ? 'Concluída' : 'Marcar Lição como Concluída'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
