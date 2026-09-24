import React, { useState } from 'react';
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
} from 'lucide-react';

export const KeyboardCourseView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(KEYBOARD_COURSE_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(KEYBOARD_COURSE_MODULES[0].lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [practiceTab, setPracticeTab] = useState<'theory' | 'score' | 'chords'>('theory');
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);

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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Banner Principal do Curso de Teclado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-[#181033] to-[#0c081e] border-2 border-indigo-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                  Do Zero ao Avançado
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {completedLessonIds.length} lições concluídas
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Curso Interativo de Teclado &amp; Piano
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-2xl">
                Aprenda a tocar com postura correta, leitura de partitura dinâmica, montagem rápida de acordes e condução elegante de inversões (Voice Leading).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Grade de Módulos (Esquerda) e Painel de Aula Interativa (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Grade de Lições e Módulos (4 Colunas) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Trilha de Aprendizado</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {KEYBOARD_COURSE_MODULES.length} Módulos
              </span>
            </div>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 no-scrollbar">
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
                          className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
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
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
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

        {/* Coluna 2: Palco Interativo da Lição Atual (8 Colunas) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Cabeçalho da Lição Ativa */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
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

              {/* Seletor de Modo da Lição */}
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 self-start sm:self-auto text-xs font-bold">
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
                      practiceTab === 'chords' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Treino de Acordes
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo 1: Teoria & Biomecânica da Mão */}
            {practiceTab === 'theory' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
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
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                    <strong className="text-cyan-300">Dica de Digitação:</strong> {activeLesson.instructions.fingeringTip}
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

                {/* Teclado para Prática Livre da Lição */}
                <div className="pt-2 space-y-3">
                  <MicrophonePitchBar
                    onNoteDetected={(midi) => handleNoteInput(midi)}
                  />

                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                      Pratique as Teclas e Dedilhado no Teclado Virtual ou no seu Piano Real:
                    </span>
                    <PianoKeyboard
                      startOctave={2}
                      octaveCount={3}
                      allowOctaveControls={true}
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
                />

                <ScrollingScoreCanvas
                  notes={activeLesson.scoreTrack}
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
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
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
