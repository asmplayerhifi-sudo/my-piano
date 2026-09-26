import React, { useState, useMemo } from 'react';
import { FretboardView, type FretboardMarkerMode } from './FretboardView';
import {
  GUITAR_ROOT_NOTES,
  GUITAR_QUALITIES,
  generateGuitarChord,
  getCAGEDPositionsSummary,
  type GuitarChordQuality,
  type CAGEDLetter,
} from '../../core/guitarChordGenerator';
import { Guitar, Sparkles, Layers, ShieldAlert, Info, HelpCircle } from 'lucide-react';

export const GuitarModule: React.FC = () => {
  // Estado do Montador Dinâmico de Acordes
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedQuality, setSelectedQuality] = useState<GuitarChordQuality>('major');
  const [selectedCaged, setSelectedCaged] = useState<CAGEDLetter>('C');
  const [selectedInversion, setSelectedInversion] = useState<'root' | 'first' | 'second'>('root');
  const [markerMode, setMarkerMode] = useState<FretboardMarkerMode>('fingers');
  const [infoTab, setInfoTab] = useState<'posture' | 'tuning_shift'>('posture');

  // Geração reativa do acorde e posições CAGED dinâmicas
  const currentShape = useMemo(() => {
    return generateGuitarChord(selectedRoot, selectedQuality, selectedCaged, selectedInversion);
  }, [selectedRoot, selectedQuality, selectedCaged, selectedInversion]);

  const cagedPositions = useMemo(() => {
    return getCAGEDPositionsSummary(selectedRoot, selectedQuality);
  }, [selectedRoot, selectedQuality]);

  const cagedLetters: CAGEDLetter[] = ['C', 'A', 'G', 'E', 'D'];

  const handleSelectRoot = (root: string) => {
    setSelectedRoot(root);
    setSelectedInversion('root');
  };

  const handleSelectQuality = (quality: GuitarChordQuality) => {
    setSelectedQuality(quality);
    setSelectedInversion('root');
  };

  const handleSelectCaged = (letter: CAGEDLetter) => {
    setSelectedCaged(letter);
    setSelectedInversion('root');
  };

  return (
    <div className="w-full space-y-5">
      {/* Header Compacto do Módulo */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
            <Guitar className="w-4 h-4" />
            <span>Módulo 4 — Mapeamento Matricial &amp; CAGED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Braço do Violão &amp; Sistema CAGED
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
            Domine as 15 casas do braço com montador matricial livre, posições CAGED dinâmicas e condução de baixos invertidos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grid Integrado 15 Trastes</span>
          </span>
        </div>
      </div>

      {/* Grid Principal: Stack em mobile/tablet e 2 Colunas (Esquerda 30% Montador / Direita 70% Braço) em telas grandes >= 1280px */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* =========================================================================
            COLUNA ESQUERDA (Painel de Controle e Montador de Acordes)
           ========================================================================= */}
        <div className="xl:col-span-4 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 shadow-xl">
            {/* Título do Card */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black font-display text-white uppercase tracking-wider">
                  Montador de Acordes &amp; CAGED
                </h3>
                <p className="text-[11px] text-slate-400">Personalize o acorde e a forma no braço</p>
              </div>
            </div>

            {/* 1. Seleção de Tônica (Raiz) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                1. Nota Raiz (Tônica):
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {GUITAR_ROOT_NOTES.map((root) => {
                  const isSelected = selectedRoot === root.symbol;
                  return (
                    <button
                      key={root.symbol}
                      onClick={() => handleSelectRoot(root.symbol)}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/30 border border-amber-300 scale-102'
                          : 'bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-black font-display leading-none">{root.symbol}</span>
                      <span className={`text-[9px] mt-0.5 leading-none ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                        {root.namePt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Qualidade do Acorde */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                2. Tipo / Qualidade:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {GUITAR_QUALITIES.map((q) => {
                  const isSelected = selectedQuality === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuality(q.id)}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 border border-amber-300'
                          : 'bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold leading-none">{q.label}</span>
                      <span className={`text-[8.5px] mt-0.5 leading-none font-mono ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {q.formula}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Formato CAGED (Shape) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  3. Formato CAGED (Shape):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentShape.fretRange.label}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {cagedLetters.map((letter) => {
                  const isSelected = selectedCaged === letter;
                  const rangeText = cagedPositions[letter];

                  return (
                    <button
                      key={letter}
                      onClick={() => handleSelectCaged(letter)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-500/30 to-orange-600/30 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-102'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base font-black font-display">{letter}</span>
                      <span className="text-[8.5px] font-bold text-amber-300 mt-0.5 leading-tight text-center">
                        {rangeText.replace('Casas ', 'C. ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Baixos Invertidos */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                4. Baixos Invertidos:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {currentShape.availableInversions.map((inv) => {
                  const isSelected = selectedInversion === inv.id;
                  return (
                    <button
                      key={inv.id}
                      onClick={() => setSelectedInversion(inv.id)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold text-xs text-white leading-tight">
                        {inv.symbol}
                      </div>
                      <div className="text-[9px] text-amber-300 font-mono mt-0.5">
                        {inv.id === 'root' ? 'Padrão' : `Baixo ${inv.bassNote}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Afinação */}
            <div className="space-y-1.5 pt-1 border-t border-white/5">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                5. Afinação do Instrumento:
              </label>
              <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-300 font-bold">
                  E Standard (E-A-D-G-B-E)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Padrão 6 Cordas</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUNA DIREITA (Braço Expandido e Controles Virtuais)
           ========================================================================= */}
        <div className="xl:col-span-8 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 shadow-xl">
            {/* Header do Braço: Título e Status do Acorde Ativo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
                  Violão Virtual (15 Trastes)
                </span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                    {currentShape.name}
                  </h3>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    (Baixo em {currentShape.bassNote})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Fundamental:</span>
                  <span className="font-bold text-rose-400 font-mono flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
                    {currentShape.rootNote}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                  <span>Extensão: </span>
                  <strong className="text-amber-300">{currentShape.fretRange.label}</strong>
                </div>
              </div>
            </div>

            {/* Braço Expandido com 15 Trastes, 3 Modos de Marcadores e Áudio */}
            <FretboardView
              chordShape={currentShape}
              fretCount={15}
              markerMode={markerMode}
              onMarkerModeChange={setMarkerMode}
              showAudioControls={true}
            />

            {/* Painel Inferior de Dica de Execução & Postura Biomecânica / Salto da 2ª Corda */}
            <div className="pt-2">
              <div className="flex border-b border-white/10 mb-3 gap-2">
                <button
                  onClick={() => setInfoTab('posture')}
                  className={`pb-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    infoTab === 'posture'
                      ? 'border-amber-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>💡 Dica de Execução &amp; Postura</span>
                </button>

                <button
                  onClick={() => setInfoTab('tuning_shift')}
                  className={`pb-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    infoTab === 'tuning_shift'
                      ? 'border-indigo-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>⚡ O Salto da 2ª Corda (Si)</span>
                </button>
              </div>

              {/* Aba 1: Dica de Execução & Postura Biomecânica */}
              {infoTab === 'posture' && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-amber-300">
                      Biomecânica &amp; Postura Recomendada:
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11.5px]">
                      {currentShape.postureTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Aba 2: Explicador Didático da Quebra de Afinação na 2ª Corda */}
              {infoTab === 'tuning_shift' && (
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 space-y-2.5">
                  <div className="font-bold text-indigo-300 flex items-center gap-2">
                    <span>A quebra geométrica de afinação na 2ª corda:</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-slate-300">
                    O violão é afinado em <strong>quartas justas (5 semitons)</strong> entre todas as cordas, exceto entre a 3ª (Sol) e a 2ª (Si), que é uma <strong>terça maior (4 semitons)</strong>.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] flex justify-between items-center text-slate-400">
                    <span>Cordas 6-5-4-3: Intervalo 4ª Justa (5 semitons)</span>
                    <span className="text-rose-400 font-bold">Corda 3 ➔ 2: 3ª Maior (4 semitons - perde 1 semitom!)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Por isso, qualquer desenho ou escala que cruze a 2ª corda precisa avançar <strong className="text-amber-300">1 traste à frente</strong> para compensar essa perda!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
