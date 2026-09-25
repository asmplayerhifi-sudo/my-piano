import React, { useState, useEffect } from 'react';
import { GlobalHeader } from './components/layout/GlobalHeader';
import type { TabId } from './components/layout/Navigation';
import { KeyboardCourseView } from './components/course/KeyboardCourseView';
import { GuitarCourseView } from './components/course/GuitarCourseView';
import { RhythmLab } from './components/rhythm/RhythmLab';
import { RhythmArranger } from './components/rhythm/RhythmArranger';
import { PianoModule } from './components/piano/PianoModule';
import { GuitarModule } from './components/guitar/GuitarModule';
import { TheoryModule } from './components/theory/TheoryModule';
import { RepertoireView } from './components/score/RepertoireView';
import { ScoreEditor } from './components/score/ScoreEditor';
import { OrientationPromptModal } from './components/layout/OrientationPromptModal';
import { midiManager } from './core/midiManager';

const VALID_TABS: TabId[] = [
  'course-keyboard',
  'course-guitar',
  'theory',
  'repertoire',
  'rhythm',
  'piano',
  'guitar',
  'score-editor',
  'arranger',
];

function getInitialTab(): TabId {
  if (typeof window === 'undefined') return 'course-keyboard';
  const cleanHash = window.location.hash.replace(/^#\/?/, '').trim();
  return (VALID_TABS.find(t => t === cleanHash) as TabId) || 'course-keyboard';
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab);

  // Inicialização única e centralizada do gerenciador MIDI ao montar a aplicação
  useEffect(() => {
    midiManager.initialize();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const current = getInitialTab();
      setActiveTab(current);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    if (window.location.hash !== `#/${tab}`) {
      window.location.hash = `#/${tab}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#080811] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Global Responsivo Dinâmico — Linha Única 52px / Drawer (REQ-UI-GLOBALHEADER-DYNAMIC-01) */}
      <div className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080811]/95 shadow-xl">
        <GlobalHeader activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>

      {/* 2. Área Principal do Conteúdo — Canvas Full-Width (100% Largura Útil) */}
      <main className="flex-1 px-2 sm:px-3 md:px-4 py-2 w-full flex flex-col min-h-0">
        {activeTab === 'course-keyboard' && <KeyboardCourseView />}
        {activeTab === 'course-guitar' && <GuitarCourseView />}
        {activeTab === 'theory' && <TheoryModule />}
        {activeTab === 'repertoire' && <RepertoireView />}
        {activeTab === 'rhythm' && <RhythmLab />}
        {activeTab === 'piano' && <PianoModule />}
        {activeTab === 'guitar' && <GuitarModule />}
        {activeTab === 'score-editor' && <ScoreEditor />}
        {activeTab === 'arranger' && <RhythmArranger />}
      </main>

      {/* 3. Rodapé Compacto Institucional */}
      <footer className="w-full border-t border-white/5 bg-[#05050b] py-2 px-3 text-center text-[10px] text-slate-500 flex flex-wrap items-center justify-center gap-2 sm:gap-4 shrink-0">
        <span className="flex items-center gap-1 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Harmonia — Plataforma Musical Responsiva
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="text-slate-500">Cursos de Teclado, Violão e Teoria</span>
        <span className="hidden sm:inline">•</span>
        <span className="text-slate-500">Layout Horizontal Full-Width</span>
      </footer>

      {/* 4. Bloqueio Orientativo de Tela (Landscape Prompt) e Tela Cheia — Mobile & Tablet (REQ-UI-RESPONSIVE-ORIENTATION-01) */}
      <OrientationPromptModal />
    </div>
  );
};

export default App;

