import React, { useState, useMemo, useEffect } from 'react';
import { GUITAR_COURSE_MODULES } from '../../core/coursesData';
import type { CourseLesson, CourseModule } from '../../core/coursesData';
import { FretboardView } from '../guitar/FretboardView';
import { CAGED_SHAPES_C_MAJOR } from '../guitar/CAGEDMapper';
import { ScrollingScoreCanvas } from '../score/ScrollingScoreCanvas';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { LessonIllustration } from './illustrations/LessonIllustration';
import type { GuitarChordShape } from '../../core/types';
import { soundEngine } from '../../core/soundEngine';
import { CourseContextualHeader } from './layout/CourseContextualHeader';
import { CourseSubTabs } from './layout/CourseSubTabs';
import { CourseLearningTrailModal } from './layout/CourseLearningTrailModal';
import { CourseStatusBar } from './layout/CourseStatusBar';
import {
  Sparkles,
  CheckCircle2,
  Layers,
  Zap,
  ShieldAlert,
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
  const [activeTab, setActiveTab] = useState<'all' | 'theory' | 'score' | 'fretboard' | 'transitions'>('all');
  const [selectedChordKey, setSelectedChordKey] = useState<string>('C');
  const [selectedCagedLetter, setSelectedCagedLetter] = useState<'C' | 'A' | 'G' | 'E' | 'D'>('C');
  const [isTrailModalOpen, setIsTrailModalOpen] = useState<boolean>(false);
  const [isTipOpen, setIsTipOpen] = useState<boolean>(false);
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);

  // Limpeza de áudio em transições de lição e desmontagem
  useEffect(() => {
    soundEngine.stopAllNotes();
    return () => {
      soundEngine.stopAllNotes();
    };
  }, [activeLesson.id]);

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

  // Lista linear de todas as lições do curso para navegação Anterior / Próxima sem recarregar
  const allLessons = useMemo(() => {
    return GUITAR_COURSE_MODULES.flatMap((mod) =>
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
      setActiveTab('all');
    }
  };

  const handleNextLesson = () => {
    if (currentLinearIndex < allLessons.length - 1) {
      const next = allLessons[currentLinearIndex + 1];
      setActiveLesson(next.lesson);
      setSelectedModule(next.module);
      setActiveTab('all');
    }
  };

  const handleNoteInput = (midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  };

  const handleSelectLesson = (lesson: CourseLesson, mod: CourseModule) => {
    setSelectedModule(mod);
    setActiveLesson(lesson);
    setActiveTab('all');
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
    }
  };

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  const activeChordShape: GuitarChordShape =
    selectedModule.code === 'V5'
      ? CAGED_SHAPES_C_MAJOR[selectedCagedLetter]
      : COMMON_OPEN_CHORDS[selectedChordKey] || COMMON_OPEN_CHORDS['C'];

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-[#0c0906] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      {/* 1. HEADER CONTEXTUAL — até 36px */}
      <CourseContextualHeader
        courseTitle="Curso de Violão & Guitarra"
        courseIcon="🎸"
        currentLessonCode={currentLessonCode}
        totalLessons={allLessons.length}
        completedLessonsCount={completedLessonIds.length}
        onOpenTrail={() => setIsTrailModalOpen(true)}
        onPrevLesson={handlePrevLesson}
        onNextLesson={handleNextLesson}
        hasPrevLesson={currentLinearIndex > 0}
        hasNextLesson={currentLinearIndex < allLessons.length - 1}
        accentColor="amber"
      />

      {/* 2. SUB-TABS — até 32px */}
      <CourseSubTabs
        lessonTitle={activeLesson.title}
        lessonLevel={activeLesson.level}
        tabs={[
          {
            id: 'all',
            label: 'Prática Completa',
            shortLabel: 'Completo',
            icon: <Sparkles className="w-3 h-3 text-amber-400" />,
          },
          { id: 'fretboard', label: 'Braço & Shapes', shortLabel: 'Braço' },
          ...(activeLesson.scoreTrack
            ? [{ id: 'score', label: 'Partitura & Tablatura', shortLabel: 'Tab' }]
            : []),
          { id: 'transitions', label: 'Dedo Âncora', shortLabel: 'Âncora' },
          { id: 'theory', label: 'Teoria & Postura', shortLabel: 'Teoria' },
        ]}
        activeTabId={activeTab}
        onSelectTab={(id) => setActiveTab(id as any)}
        accentColor="amber"
        rightSlot={
          <button
            onClick={() => handleLessonComplete(activeLesson.id)}
            className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              isCurrentCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-sm'
            }`}
            title="Marcar lição como concluída"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span className="hidden sm:inline">{isCurrentCompleted ? 'Concluída' : 'Concluir'}</span>
          </button>
        }
      />

      {/* 3. SIMULADOR & ÁREA FULL-WIDTH (100% da Largura Útil sem Sidebar Fixa) */}
      <div className="flex-1 w-full p-2 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
        {/* Bloco 1: Teoria Didática da Lição */}
        {(activeTab === 'all' || activeTab === 'theory') && (
          <div className="space-y-3">
            {activeTab === 'all' && (
              <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{activeLesson.instructions.heading}</span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed max-w-4xl">
                    {activeLesson.instructions.text}
                  </p>
                </div>
                {activeLesson.instructions.fingeringTip && (
                  <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 shrink-0 max-w-md">
                    <strong className="text-amber-300">Dica:</strong> {activeLesson.instructions.fingeringTip}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'theory' && (
              <div className="space-y-4 animate-fadeIn">
                <LessonIllustration
                  lessonId={activeLesson.id}
                  moduleCode={selectedModule.code}
                  title={activeLesson.title}
                  instrument="guitar"
                />

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

                {(activeLesson.instructions.fingeringTip || activeLesson.instructions.postureAlert) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bloco 2: Partitura & Tablatura com Detecção Acústica */}
        {(activeTab === 'all' || activeTab === 'score') && activeLesson.scoreTrack && (
          <div className="space-y-3">
            <MicrophonePitchBar onNoteDetected={(midi) => handleNoteInput(midi)} />

            <ScrollingScoreCanvas
              notes={activeLesson.scoreTrack}
              timeSignature="4/4"
              bpm={75}
              autoPlayAudio={true}
              instrument="guitar"
              currentMidiPressed={lastMidiEvent}
              onLessonComplete={() => handleLessonComplete(activeLesson.id)}
            />
          </div>
        )}

        {/* Bloco 3: Braço do Violão Full-Width & Mapeamento de Shapes */}
        {(activeTab === 'all' || activeTab === 'fretboard' || activeTab === 'theory') && (
          <div className="space-y-3">
            {/* Seletor de Shapes / CAGED */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 px-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>{selectedModule.code === 'V5' ? 'Shapes do Sistema CAGED:' : 'Acordes Mais Usados:'}</span>
              </span>

              {selectedModule.code === 'V5' ? (
                <div className="flex items-center gap-1.5">
                  {(['C', 'A', 'G', 'E', 'D'] as const).map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setSelectedCagedLetter(letter)}
                      className={`w-7 h-7 rounded-lg font-black font-display text-xs cursor-pointer transition-all ${
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
                <div className="flex flex-wrap items-center gap-1">
                  {Object.keys(COMMON_OPEN_CHORDS).map((chordKey) => (
                    <button
                      key={chordKey}
                      onClick={() => setSelectedChordKey(chordKey)}
                      className={`px-2 py-0.5 rounded-lg font-bold font-display text-xs cursor-pointer transition-all ${
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

            {/* Braço do Violão Interativo Full-Width */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#120d09] p-1 sm:p-2">
              <FretboardView
                chordShape={activeChordShape}
                fretCount={14}
                showNoteNames={true}
              />
            </div>
          </div>
        )}

        {/* Bloco 4: Dedo Âncora & Trocas de Acordes */}
        {(activeTab === 'transitions' ||
          (activeTab === 'all' && (selectedModule.code === 'V4' || activeLesson.id.includes('v4')))) && (
          <div className="p-3 sm:p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
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
        midiConnected={false}
        statusText="Pronto"
      />

      {/* 5. MODAL DA TRILHA DE APRENDIZADO (Overlay Flutuante) */}
      <CourseLearningTrailModal
        isOpen={isTrailModalOpen}
        onClose={() => setIsTrailModalOpen(false)}
        courseTitle="Curso de Violão & Guitarra"
        modules={GUITAR_COURSE_MODULES}
        activeLessonId={activeLesson.id}
        completedLessonIds={completedLessonIds}
        onSelectLesson={(lesson, mod) => handleSelectLesson(lesson as CourseLesson, mod as CourseModule)}
        accentColor="amber"
      />
    </div>
  );
};
