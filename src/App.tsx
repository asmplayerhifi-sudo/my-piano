import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
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

  // Inicialização única e centralizada do gerenciador MIDI ao montar a aplicação.
  // Evita múltiplas chamadas de requestMIDIAccess() que foram removidas dos módulos individuais.
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
    <div className="min-h-screen bg-[#080811] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* 1 e 2. Cabeçalho e Barra de Navegação Unificados e Fixos (Sem sobreposição em telas móveis) */}
      <div className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080811]/90 border-b border-white/5 shadow-xl">
        <Header />
        <Navigation activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>

      {/* 3. Área Principal do Conteúdo (Totalmente Fluida e Responsiva para Todos os Monitores) */}
      <main className="flex-1 px-2 sm:px-4 md:px-6 2xl:px-8 py-3 sm:py-4 w-full">
        {activeTab === 'course-keyboard' && <KeyboardCourseView />}
        {activeTab === 'course-guitar' && <GuitarCourseView />}
        {activeTab === 'repertoire' && <RepertoireView />}
        {activeTab === 'rhythm' && <RhythmLab />}
        {activeTab === 'piano' && <PianoModule />}
        {activeTab === 'guitar' && <GuitarModule />}
        {activeTab === 'theory' && <TheoryModule />}
        {activeTab === 'score-editor' && <ScoreEditor />}
        {activeTab === 'arranger' && <RhythmArranger />}
      </main>

      {/* 4. Rodapé Institucional e Tecnológico */}
      <footer className="w-full border-t border-white/5 bg-[#05050b] py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Motor de Partitura Deslizante Interativa (Grand Staff)
          </span>
          <span>•</span>
          <span>Acelerador de Montagem de Acordes &amp; Dedo Âncora</span>
          <span>•</span>
          <span>Cursos de Teclado e Violão do Zero ao Avançado</span>
          <span>•</span>
          <span>Web &amp; Android Ready</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Harmonia — Plataforma Interativa de Educação Musical &amp; Ritmo. Desenvolvido para transformar alunos em músicos completos.
        </p>
      </footer>
    </div>
  );
};

export default App;
