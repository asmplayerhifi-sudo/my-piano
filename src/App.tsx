import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import type { TabId } from './components/layout/Navigation';
import { KeyboardCourseView } from './components/course/KeyboardCourseView';
import { GuitarCourseView } from './components/course/GuitarCourseView';
import { RhythmLab } from './components/rhythm/RhythmLab';
import { PianoModule } from './components/piano/PianoModule';
import { GuitarModule } from './components/guitar/GuitarModule';
import { HybridRhythmChord } from './components/hybrid/HybridRhythmChord';
import { TheoryModule } from './components/theory/TheoryModule';
import { RepertoireView } from './components/score/RepertoireView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('course-keyboard');

  return (
    <div className="min-h-screen bg-[#080811] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* 1. Cabeçalho Fixo */}
      <Header />

      {/* 2. Barra de Navegação dos Módulos e Cursos */}
      <Navigation activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* 3. Área Principal do Conteúdo (Widescreen com Área Total e Bordas Sutis) */}
      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 w-full max-w-[1920px] mx-auto">
        {activeTab === 'course-keyboard' && <KeyboardCourseView />}
        {activeTab === 'course-guitar' && <GuitarCourseView />}
        {activeTab === 'repertoire' && <RepertoireView />}
        {activeTab === 'rhythm' && <RhythmLab />}
        {activeTab === 'piano' && <PianoModule />}
        {activeTab === 'guitar' && <GuitarModule />}
        {activeTab === 'hybrid' && <HybridRhythmChord />}
        {activeTab === 'theory' && <TheoryModule />}
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
