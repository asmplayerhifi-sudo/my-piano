/**
 * components/sightReading/SightReadingTutorialModal.tsx
 *
 * Modal Pedagógico Interativo de Treino de Partitura (Requisito 1: Aba 📖 Tutorial).
 * Apresenta conteúdo visual e progressivo sobre:
 *  - Claves (Sol, Fá, Pauta Dupla)
 *  - Linhas e espaços
 *  - Oitavas e Dó Central (C4)
 *  - Figuras rítmicas e pausas (Semibreve, Mínima, Semínima, Colcheia)
 *  - Duração e fórmulas de compasso (2/4, 3/4, 4/4, 6/8)
 *  - Acidentes e armaduras de clave
 *  - Leitura de acordes e polifonia
 *
 * Utiliza o mesmo sistema de áudio e conceitos da plataforma Harmonia com visualização Hi-Fi.
 */

import React, { useState } from 'react';
import {
  TUTORIAL_TOPICS,
  type TutorialTopic,
} from '../../core/sightReadingEngine';
import { soundEngine } from '../../core/soundEngine';
import {
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Lightbulb,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

interface SightReadingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopicExercise?: (topicId: string) => void;
}

export const SightReadingTutorialModal: React.FC<SightReadingTutorialModalProps> = ({
  isOpen,
  onClose,
  onSelectTopicExercise,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [activePreviewMidi, setActivePreviewMidi] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentTopic: TutorialTopic = TUTORIAL_TOPICS[selectedTopicIndex] || TUTORIAL_TOPICS[0];

  const handlePlaySound = (midi: number) => {
    setActivePreviewMidi(midi);
    soundEngine.startPianoNote(midi, 0.85);
    setTimeout(() => {
      soundEngine.stopPianoNote(midi);
      setActivePreviewMidi(null);
    }, 500);
  };

  const handlePrev = () => {
    if (selectedTopicIndex > 0) {
      setSelectedTopicIndex((i) => i - 1);
    }
  };

  const handleNext = () => {
    if (selectedTopicIndex < TUTORIAL_TOPICS.length - 1) {
      setSelectedTopicIndex((i) => i + 1);
    }
  };

  return (
    <div className="modal-overlay-responsive select-none">
      <div className="modal-sheet-responsive md:max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[#0c0d1e] text-slate-100 relative">
        {/* Barra de arraste/indicador visual para mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-2 md:hidden shrink-0" />

        {/* ── CABEÇALHO DO MODAL ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Tutorial de Leitura de Partitura
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  Fundamentos Hi-Fi
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Guia progressivo de notação musical, métrica rítmica e harmonia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer active:scale-95 shrink-0"
            title="Fechar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── CORPO: SELETOR DE MÓDULOS + CONTEÚDO ATIVO ───────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navegação Lateral de Tópicos */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-2 sm:p-3 bg-black/30 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1.5 scrollbar-thin">
            {TUTORIAL_TOPICS.map((topic, index) => {
              const isSelected = index === selectedTopicIndex;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicIndex(index)}
                  className={`text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between shrink-0 md:shrink md:w-full border ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500/50 text-white font-bold shadow-md'
                      : 'bg-white/[0.02] hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                      {topic.badge}
                    </span>
                    <span className="truncate max-w-[170px] font-medium text-[11px] sm:text-xs">
                      {topic.title}
                    </span>
                  </div>
                  {isSelected && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 hidden md:block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Área de Conteúdo do Tópico Selecionado */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
            {/* Header do Tópico */}
            <div className="space-y-1.5 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  {currentTopic.badge} • {currentTopic.category}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white">{currentTopic.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentTopic.summary}
              </p>
            </div>

            {/* Conceitos Chave */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Conceitos Chave &amp; Estrutura</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentTopic.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {concept.iconSymbol && (
                        <span className="font-serif text-base text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                          {concept.iconSymbol}
                        </span>
                      )}
                      <span className="text-xs font-bold text-white">{concept.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {concept.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exemplos Práticos Interativos com Áudio */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exemplos Sonoros (Toque para Ouvir)</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentTopic.visualExamples.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePlaySound(ex.midi)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      activePreviewMidi === ex.midi
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md scale-[1.02]'
                        : 'bg-black/40 hover:bg-black/60 border-white/10 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ex.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-indigo-300">
                          {ex.pitch}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {ex.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                      <Volume2 className="w-3 h-3" />
                      <span>{activePreviewMidi === ex.midi ? 'Reproduzindo...' : 'Ouvir Nota'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dica Prática de Mestre */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-300">Dica Prática de Fixação:</span>
                <p className="text-xs text-amber-100/80 leading-relaxed">
                  {currentTopic.practicalTip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RODAPÉ COM CONTROLES DE PROGRESSÃO ───────────────────────────── */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={selectedTopicIndex === 0}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Módulo {selectedTopicIndex + 1} de {TUTORIAL_TOPICS.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={selectedTopicIndex === TUTORIAL_TOPICS.length - 1}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Próximo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onSelectTopicExercise && (
              <button
                type="button"
                onClick={() => {
                  onSelectTopicExercise(currentTopic.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Praticar Este Módulo</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
