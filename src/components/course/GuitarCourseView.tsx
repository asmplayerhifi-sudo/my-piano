import React, { useState } from 'react';
import { GUITAR_COURSE_MODULES } from '../../core/coursesData';
import type { CourseLesson, CourseModule } from '../../core/coursesData';
import { FretboardView } from '../guitar/FretboardView';
import { CAGED_SHAPES_C_MAJOR } from '../guitar/CAGEDMapper';
import { ScrollingScoreCanvas } from '../score/ScrollingScoreCanvas';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
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
  Maximize2,
  Minimize2,
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
  'A': {
    name: 'Lá Maior (A)',
    cagedLetter: 'A',
    rootNote: 'A',
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    bassNote: 'A',
  },
  'E': {
    name: 'Mi Maior (E)',
    cagedLetter: 'E',
    rootNote: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    bassNote: 'E',
  },
  'Dm': {
    name: 'Ré Menor (Dm)',
    cagedLetter: 'D',
    rootNote: 'D',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    bassNote: 'D',
  },
  'Bm': {
    name: 'Si Menor com Pestana (Bm)',
    cagedLetter: 'A',
    rootNote: 'B',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    barreFret: 2,
    barreStrings: [1, 5],
    bassNote: 'B',
  },
  'B7': {
    name: 'Si com Sétima (B7)',
    cagedLetter: 'A',
    rootNote: 'B',
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
    bassNote: 'B',
  },
  'C7': {
    name: 'Dó com Sétima (C7)',
    cagedLetter: 'C',
    rootNote: 'C',
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0],
    bassNote: 'C',
  },
};

export const GuitarCourseView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(GUITAR_COURSE_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(GUITAR_COURSE_MODULES[0].lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'theory' | 'score' | 'fretboard' | 'transitions'>('theory');
  const [selectedChordKey, setSelectedChordKey] = useState<string>('C');
  const [selectedCagedLetter, setSelectedCagedLetter] = useState<'C' | 'A' | 'G' | 'E' | 'D'>('C');
  const [isWidescreenStage, setIsWidescreenStage] = useState<boolean>(false);
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);

  const handleNoteInput = (midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  };

  const handleSelectLesson = (lesson: CourseLesson, mod: CourseModule) => {
    setSelectedModule(mod);
    setActiveLesson(lesson);
    if (lesson.scoreTrack) {
      setActiveTab('score');
    } else if (mod.code === 'V4' || mod.code === 'V5') {
      setActiveTab('fretboard');
    } else {
      setActiveTab('theory');
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  const activeChordShape: GuitarChordShape =
    selectedModule.code === 'V5'
      ? CAGED_SHAPES_C_MAJOR[selectedCagedLetter]
      : COMMON_OPEN_CHORDS[selectedChordKey] || COMMON_OPEN_CHORDS['C'];

  return (
    <div className="w-full max-w-[1850px] mx-auto space-y-4">
      {/* Banner Principal do Curso de Violão (Bordas Sutis & Widescreen) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#22130a]/80 to-[#100804]/90 border border-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 shrink-0">
              <Guitar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/20">
                  Do Zero ao Avançado
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {completedLessonIds.length} lições concluídas
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Curso Interativo de Violão &amp; Guitarra
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsWidescreenStage(!isWidescreenStage)}
            className="px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center gap-2 border border-white/5 cursor-pointer transition-all self-start md:self-auto"
          >
            {isWidescreenStage ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Exibir Módulos</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Palco Total (100% Largura)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Grade de Módulos (Esquerda) e Painel de Aula (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Coluna 1: Grade de Lições e Módulos */}
        {!isWidescreenStage && (
          <div className="lg:col-span-4 h-full flex flex-col">
            <div className="glass-card rounded-3xl p-4 border border-white/5 space-y-3 flex flex-col flex-1 h-full">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 shrink-0">
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Trilha do Violão</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  {GUITAR_COURSE_MODULES.length} Módulos
                </span>
              </div>

              <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar">
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
                            className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-amber-600/30 border-amber-500/40 text-white shadow-md'
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

        {/* Coluna 2 / Palco Total: Painel da Lição Ativa */}
        <div className={isWidescreenStage ? 'lg:col-span-12 space-y-4' : 'lg:col-span-8 space-y-4'}>
          <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/5 space-y-4">
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

                {activeLesson.scoreTrack && (
                  <button
                    onClick={() => setActiveTab('score')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'score' ? 'bg-cyan-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Partitura &amp; Tab
                  </button>
                )}

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
                    activeTab === 'transitions' ? 'bg-purple-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dedo Âncora
                </button>
              </div>
            </div>

            {/* Conteúdo 1: Teoria Didática da Lição */}
            {activeTab === 'theory' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
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
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200">
                    <strong className="text-amber-300">Dica de Digitação:</strong> {activeLesson.instructions.fingeringTip}
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

                {/* Braço interativo demonstrativo */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                    Visualização no Braço do Violão:
                  </span>
                  <FretboardView
                    chordShape={activeChordShape}
                    fretCount={14}
                    showNoteNames={true}
                  />
                </div>
              </div>
            )}

            {/* Conteúdo 2: Motor de Partitura & Tablatura com Detecção por Microfone */}
            {activeTab === 'score' && activeLesson.scoreTrack && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <MicrophonePitchBar
                  onNoteDetected={(midi) => handleNoteInput(midi)}
                />

                <ScrollingScoreCanvas
                  notes={activeLesson.scoreTrack}
                  timeSignature="4/4"
                  bpm={75}
                  instrument="guitar"
                  currentMidiPressed={lastMidiEvent}
                  onLessonComplete={() => handleLessonComplete(activeLesson.id)}
                />

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                    Posição das Notas e Acordes no Braço:
                  </span>
                  <FretboardView
                    chordShape={activeChordShape}
                    fretCount={14}
                    showNoteNames={true}
                  />
                </div>
              </div>
            )}

            {/* Conteúdo 3: Braço & Mapeamento de Shapes */}
            {activeTab === 'fretboard' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                {/* Seletor de Shapes / CAGED */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{selectedModule.code === 'V5' ? 'Shapes do Sistema CAGED:' : 'Acordes Mais Usados:'}</span>
                  </span>

                  {selectedModule.code === 'V5' ? (
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
                    <div className="flex flex-wrap items-center gap-1.5">
                      {Object.keys(COMMON_OPEN_CHORDS).map((chordKey) => (
                        <button
                          key={chordKey}
                          onClick={() => setSelectedChordKey(chordKey)}
                          className={`px-2.5 py-1 rounded-xl font-bold font-display text-xs cursor-pointer transition-all ${
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
                    showNoteNames={true}
                  />
                </div>
              </div>
            )}

            {/* Conteúdo 4: Treino de Trocas com Dedo Âncora */}
            {activeTab === 'transitions' && (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Princípio do Dedo Âncora no Violão</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Quando dois acordes compartilham cordas e casas idênticas, não retire a mão inteira do braço!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                      <strong className="text-cyan-300 block mb-1">Transição C ➔ Am:</strong>
                      <p className="text-slate-300">
                        O Dedo 1 (2ª corda casa 1) e o Dedo 2 (4ª corda casa 2) são <strong>âncoras fixas</strong>. Apenas mova o Dedo 3 da 5ª corda para a 3ª corda casa 2!
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
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
                    showNoteNames={true}
                  />
                </div>
              </div>
            )}

            {/* Rodapé da Aula: Botão Concluir Lição */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {isCurrentCompleted ? '✅ Lição Concluída!' : 'Pratique a digitação no violão'}
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
