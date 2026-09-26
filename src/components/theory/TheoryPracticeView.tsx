import React from 'react';
import {
  useTheoryPracticeStore,
  theoryPracticeStore,
  type TheoryPracticeSubTab,
} from '../../core/theoryPracticeStore';
import { ScaleBuilder } from './ScaleBuilder';
import { CircleOfFifths } from './CircleOfFifths';
import { ChromaticRuler } from './ChromaticRuler';
import { buildChord, NOTE_NAMES_PT } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import {
  Compass,
  Music,
  CircleDot,
  Ruler,
  LayoutGrid,
  Volume2,
  Sparkles,
  Info,
} from 'lucide-react';

export const TheoryPracticeView: React.FC = () => {
  const { selectedKey, activeSubTab } = useTheoryPracticeStore();

  const handleSubTabChange = (tab: TheoryPracticeSubTab) => {
    theoryPracticeStore.setSubTab(tab);
  };

  const handleKeyChange = (key: string) => {
    theoryPracticeStore.setKey(key);
  };

  // Toca o acorde fundamental da tonalidade ativa
  const handlePlayTonicChord = () => {
    try {
      const chord = buildChord(selectedKey, 'major');
      const baseMidi = 60;
      const midiNotes = chord.intervals.map(semitones => baseMidi + semitones);
      soundEngine.playChord(midiNotes, 'piano', 1.8);
    } catch {
      soundEngine.playPianoNote(60, 1.5);
    }
  };

  const keyPt = NOTE_NAMES_PT[selectedKey[0]] || selectedKey[0];
  const accidental = selectedKey.length > 1 ? selectedKey.slice(1).replace('#', '♯').replace('b', '♭') : '';
  const fullKeyName = `${keyPt}${accidental} Maior (${selectedKey})`;

  // Lista de 12 tonalidades comuns para seleção rápida
  const quickKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 space-y-3">
      {/* ── BARRA SUPERIOR DA PRÁTICA TEÓRICA: Abas + Seletor de Tonalidade Persistente ── */}
      <div className="w-full min-h-[46px] py-1.5 px-3 sm:px-4 bg-[#0a0d1d]/90 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 shadow-xl select-none text-xs">
        {/* Lado Esquerdo: Identificação e Abas Principais */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 pr-2 border-r border-white/10 shrink-0">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-white text-xs tracking-tight flex items-center gap-1.5">
                Prática Teórica
              </span>
              <span className="text-[10px] text-cyan-300 font-mono block leading-none">
                Hub Interativo
              </span>
            </div>
          </div>

          {/* Abas Internas da Prática: [ 🎵 Escalas ] [ ⊙ Círculo das Quintas ] [ 📏 Régua Cromática ] [ 㗊 Panorâmica ] */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {/* 1. Escalas */}
            <button
              onClick={() => handleSubTabChange('scales')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                activeSubTab === 'scales'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-indigo-300" />
              <span>Escalas</span>
            </button>

            {/* 2. Círculo das Quintas */}
            <button
              onClick={() => handleSubTabChange('circle')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                activeSubTab === 'circle'
                  ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-600/30 ring-1 ring-pink-400/50'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5 text-pink-300" />
              <span>Círculo das Quintas</span>
            </button>

            {/* 3. Régua Cromática */}
            <button
              onClick={() => handleSubTabChange('ruler')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                activeSubTab === 'ruler'
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400/50'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-cyan-300" />
              <span>Régua Cromática</span>
            </button>

            {/* 4. Panorâmica (Dashboard Integrado) */}
            <button
              onClick={() => handleSubTabChange('panoramic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                activeSubTab === 'panoramic'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title="Dashboard Panorâmico com todas as ferramentas integradas em tempo real"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-300" />
              <span>Panorâmica</span>
            </button>
          </nav>
        </div>

        {/* Lado Direito: Persistência de Tonalidade Compartilhada */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Tom:</span>
            <span className="text-xs font-black text-amber-300 font-display">
              {fullKeyName}
            </span>
            <button
              onClick={handlePlayTonicChord}
              className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer"
              title="Tocar acorde de referência da tonalidade ativa"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Tonality Picker */}
          <div className="hidden 2xl:flex items-center gap-1">
            {quickKeys.slice(0, 7).map(k => (
              <button
                key={k}
                onClick={() => handleKeyChange(k)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all border ${
                  selectedKey === k
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ÁREA DE CONTEÚDO ATIVO OU MODO PANORÂMICO/DASHBOARD INTEGRADO ── */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto">
        {/* Aba 1: Escalas */}
        {activeSubTab === 'scales' && (
          <div className="w-full">
            <ScaleBuilder
              rootKey={selectedKey}
              onRootKeyChange={handleKeyChange}
            />
          </div>
        )}

        {/* Aba 2: Círculo das Quintas */}
        {activeSubTab === 'circle' && (
          <div className="w-full">
            <CircleOfFifths
              selectedKey={selectedKey}
              onKeySelect={handleKeyChange}
            />
          </div>
        )}

        {/* Aba 3: Régua Cromática */}
        {activeSubTab === 'ruler' && (
          <div className="w-full">
            <ChromaticRuler
              selectedNote={selectedKey}
              onNoteSelect={handleKeyChange}
            />
          </div>
        )}

        {/* Aba 4: Panorâmica (Dashboard Integrado de Estudo) */}
        {activeSubTab === 'panoramic' && (
          <div className="w-full space-y-4">
            {/* Banner Informativo do Dashboard Panorâmico */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Modo Panorâmico Ativo:</strong> Toque em qualquer nota ou grau do Círculo ou da Régua para sincronizar instantaneamente todas as ferramentas no tom de <span className="font-bold text-cyan-300">{fullKeyName}</span>.
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                SINCRONIA TOTAL
              </span>
            </div>

            {/* Grid Superior: Círculo das Quintas + Régua Cromática (1 coluna em tablet/notebook, 12 cols em desktop grande) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-7">
                <CircleOfFifths
                  selectedKey={selectedKey}
                  onKeySelect={handleKeyChange}
                />
              </div>
              <div className="xl:col-span-5 flex flex-col gap-4">
                <ChromaticRuler
                  selectedNote={selectedKey}
                  onNoteSelect={handleKeyChange}
                />

                {/* Card Didático de Tonalidade e Relações Harmônicas */}
                <div className="flex-1 glass-card rounded-3xl p-5 border border-white/10 space-y-3 bg-[#0a0d1f]/60">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400" />
                    <span>Relações do Tom ({selectedKey})</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Grau I (Tônica)</span>
                      <span className="text-sm font-bold text-emerald-400">{selectedKey} Maior</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Grau vi (Relativa)</span>
                      <span className="text-sm font-bold text-purple-400">{selectedKey} Menor Relativa</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Grau IV (Subdominante)</span>
                      <span className="text-sm font-bold text-cyan-400">Afastamento</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Grau V (Dominante)</span>
                      <span className="text-sm font-bold text-amber-400">Tensão / Resolução</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel Inferior: Construtor e Demonstração de Escalas */}
            <div className="w-full">
              <ScaleBuilder
                rootKey={selectedKey}
                onRootKeyChange={handleKeyChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
