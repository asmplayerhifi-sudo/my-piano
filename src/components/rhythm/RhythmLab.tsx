import React, { useState } from 'react';
import { MetronomeView } from './MetronomeView';
import { RhythmTrackCanvas } from './RhythmTrackCanvas';
import { metronomeScheduler } from '../../core/metronomeScheduler';
import { Activity, Mic, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';

export const RhythmLab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(metronomeScheduler.getIsPlaying());
  const [bpm, setBpm] = useState<number>(metronomeScheduler.getBpm());
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(2); // 1 = Vocal, 2 = Palmas, 3 = Instrumento

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header do Módulo com Protocolo Cinestésico */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Módulo 2 — Treinador de Precisão Temporal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Laboratório Rítmico Anti-Déficit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Projetado para eliminar antecipações e atrasos métricos. Treine o pulso interno através de 3 etapas progressivas.
          </p>
        </div>

        {/* 3 Etapas do Protocolo Cinestésico */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 self-start md:self-auto">
          {[
            { step: 1 as const, label: '1. Vocalizar', desc: 'TA-CA-TE-CA', icon: Mic },
            { step: 2 as const, label: '2. Palmas / Toque', desc: 'Na tela', icon: Volume2 },
            { step: 3 as const, label: '3. Instrumento', desc: 'Palhetada/Teclado', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeStep === item.step;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </div>
                <div className="text-[10px] opacity-70 hidden sm:block">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Principal: Metrônomo à esquerda, Esteira Rítmica à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna do Metrônomo (5 colunas no desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <MetronomeView
            onBpmChange={(newBpm) => setBpm(newBpm)}
            onPlayStateChange={(playing) => setIsPlaying(playing)}
          />

          {/* Dicas Pedagógicas Dinâmicas */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Como treinar o pulso interno</span>
            </div>
            <p>
              • <strong className="text-white">Janela de Excelência:</strong> O cérebro humano percebe desvios acima de 50ms como &quot;fora de tempo&quot;. O objetivo é cravar na faixa verde (&lt; 25ms).
            </p>
            <p>
              • <strong className="text-white">Modo Oculto:</strong> Quando os cliques silenciarem por 2 compassos, não acelere! Mantenha a respiração estável e confira se ao som retornar você ainda estava sincronizado.
            </p>
          </div>
        </div>

        {/* Coluna da Esteira Rítmica Canvas (7 colunas no desktop) */}
        <div className="lg:col-span-7">
          <RhythmTrackCanvas
            isPlaying={isPlaying}
            bpm={bpm}
            timeSignature={metronomeScheduler.getTimeSignature()}
          />
        </div>
      </div>
    </div>
  );
};
