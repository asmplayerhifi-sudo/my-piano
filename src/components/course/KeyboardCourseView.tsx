import React, { useState, useEffect } from 'react';
import { KEYBOARD_COURSE_MODULES } from '../../core/coursesData';
import type { CourseLesson, CourseModule } from '../../core/coursesData';
import { ScrollingScoreCanvas } from '../score/ScrollingScoreCanvas';
import { FastChordTrainer } from '../piano/FastChordTrainer';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
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
} from 'lucide-react';

export const KeyboardCourseView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(KEYBOARD_COURSE_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(KEYBOARD_COURSE_MODULES[0].lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [practiceTab, setPracticeTab] = useState<'theory' | 'score' | 'chords'>('theory');
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);
  const [micHearingMidi, setMicHearingMidi] = useState<number | null>(null);
  const [isWidescreenStage, setIsWidescreenStage] = useState<boolean>(false);
  const [isTrailExpanded, setIsTrailExpanded] = useState<boolean>(false);
  const [isFullscreenLesson, setIsFullscreenLesson] = useState<boolean>(false);
  const [isFullscreenTrail, setIsFullscreenTrail] = useState<boolean>(false);

  const toggleFullscreenLesson = () => {
    if (!isFullscreenLesson) {
      setIsFullscreenLesson(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback CSS
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
        // Fallback CSS
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

  const handleNoteInput = (midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  };

  const handleSelectLesson = (lesson: CourseLesson, mod: CourseModule) => {
    setSelectedModule(mod);
    setActiveLesson(lesson);
    if (lesson.scoreTrack) {
      setPracticeTab('score');
    } else if (lesson.targetChords) {
      setPracticeTab('chords');
    } else {
      setPracticeTab('theory');
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  return (
    <div className="w-full space-y-4">
      {/* Banner Principal do Curso de Teclado (Bordas Sutis & Widescreen) */}
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
                  {completedLessonIds.length} lições concluídas
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

      {/* Grid: Grade de Módulos (Esquerda) e Painel de Aula Interativa (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Coluna 1: Grade de Lições e Módulos */}
        {!isWidescreenStage && (
          <div className={`${isTrailExpanded ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-4 xl:col-span-3 2xl:col-span-3'} h-full flex flex-col`}>
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

                  {/* Botão Expansão da Trilha */}
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

                  {/* Botão Tela Cheia da Trilha */}
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
          } h-full flex flex-col space-y-4`}
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
                  {selectedModule.code} • {activeLesson.level} • {activeLesson.durationMinutes} min
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
                    onClick={() => setPracticeTab('theory')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      practiceTab === 'theory' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Teoria &amp; Postura
                  </button>

                  {activeLesson.scoreTrack && (
                    <button
                      onClick={() => setPracticeTab('score')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        practiceTab === 'score' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Partitura Deslizante
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

                {/* Controles de Janela do Card: Expansão (Modo Palco) e Tela Cheia (Fullscreen) */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setIsWidescreenStage(!isWidescreenStage)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isWidescreenStage
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isWidescreenStage ? 'Restaurar layout padrão (2 colunas)' : 'Expandir card para 100% da largura (Modo Palco)'}
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
                    title={isFullscreenLesson ? 'Sair da Tela Cheia (Esc)' : 'Tela Cheia Imersiva no Card da Lição'}
                  >
                    {isFullscreenLesson ? <Shrink className="w-4 h-4 text-rose-400" /> : <Expand className="w-4 h-4 text-indigo-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo 1: Teoria & Biomecânica da Mão */}
            {practiceTab === 'theory' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>{activeLesson.instructions.heading}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLesson.instructions.text}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 pt-1">
                    {activeLesson.instructions.bulletPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeLesson.instructions.fingeringTip && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
                    <strong className="text-cyan-300">Dica de Digitação:</strong> {activeLesson.instructions.fingeringTip}
                  </div>
                )}

                {activeLesson.instructions.postureAlert && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300">Alerta de Postura:</strong> {activeLesson.instructions.postureAlert}
                    </div>
                  </div>
                )}

                {/* Teclado com Rastro Synthesia (100% da Largura, Zero Scroll) */}
                <div className="pt-2 space-y-3">
                  <MicrophonePitchBar
                    onNoteDetected={(midi) => handleNoteInput(midi)}
                    onNoteHold={(midi) => setMicHearingMidi(midi)}
                  />

                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                      Pratique as Teclas e Dedilhado no Teclado Virtual ou no seu Piano Real:
                    </span>
                    <PianoKeyboard
                      startOctave={2}
                      octaveCount={3}
                      allowOctaveControls={true}
                      activeExternalNotes={micHearingMidi !== null ? [micHearingMidi] : (lastMidiEvent ? [lastMidiEvent.midi] : [])}
                      onKeyPlay={(midi) => handleNoteInput(midi)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo 2: Motor de Partitura Deslizante */}
            {practiceTab === 'score' && activeLesson.scoreTrack && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <MicrophonePitchBar
                  onNoteDetected={(midi) => handleNoteInput(midi)}
                  onNoteHold={(midi) => setMicHearingMidi(midi)}
                />

                <ScrollingScoreCanvas
                  notes={activeLesson.scoreTrack}
                  timeSignature="4/4"
                  bpm={75}
                  currentMidiPressed={lastMidiEvent}
                  onLessonComplete={() => handleLessonComplete(activeLesson.id)}
                />

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                    Toque no Teclado Virtual, via USB-MIDI ou no seu Piano Real (Microfone Ativo):
                  </span>
                  <PianoKeyboard
                    startOctave={2}
                    octaveCount={3}
                    allowOctaveControls={true}
                    activeExternalNotes={micHearingMidi !== null ? [micHearingMidi] : (lastMidiEvent ? [lastMidiEvent.midi] : [])}
                    onKeyPlay={(midi) => handleNoteInput(midi)}
                  />
                </div>
              </div>
            )}

            {/* Conteúdo 3: Acelerador de Acordes & Inversões */}
            {practiceTab === 'chords' && (
              <div className="pt-2 border-t border-white/5 animate-fade-in">
                <FastChordTrainer />
              </div>
            )}

            {/* Rodapé da Aula: Botão Concluir Lição */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {isCurrentCompleted ? '✅ Lição Concluída!' : 'Pratique até fixar os movimentos'}
              </span>

              <button
                onClick={() => handleLessonComplete(activeLesson.id)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
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
