import React, { useState } from 'react';
import { MetronomeView } from './MetronomeView';
import { RhythmTrackCanvas } from './RhythmTrackCanvas';
import { RhythmicScoreTrainer } from './RhythmicScoreTrainer';
import { metronomeScheduler } from '../../core/metronomeScheduler';
import { latencyManager } from '../../core/latencyManager';
import { Activity, Mic, Volume2, ShieldCheck, HelpCircle, Music, Radar, Sliders } from 'lucide-react';

export const RhythmLab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(metronomeScheduler.getIsPlaying());
  const [bpm, setBpm] = useState<number>(metronomeScheduler.getBpm());
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(3); // 1 = Vocal, 2 = Palmas, 3 = Instrumento
  const [trainingMode, setTrainingMode] = useState<'score' | 'radar'>('score'); // Modo Partitura por padrão
  const [radarToleranceMs, setRadarToleranceMs] = useState<number>(latencyManager.getToleranceMs());

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header do Módulo com Seletor de Modo & Protocolo Cinestésico */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Módulo 2 — Treinador de Precisão Temporal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Laboratório Rítmico Anti-Déficit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Elimine antecipações e atrasos métricos. Pratique com partituras reais para Teclado e Violão ou utilize a esteira temporal com ajuste de sensibilidade.
          </p>
        </div>

        {/* Alternador Principal de Modo de Treino */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 shadow-lg">
            <button
              onClick={() => setTrainingMode('score')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                trainingMode === 'score'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>🎼 Treino Partiturado</span>
            </button>

            <button
              onClick={() => setTrainingMode('radar')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                trainingMode === 'radar'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span>🎯 Radar Temporal</span>
            </button>
          </div>

          {/* 3 Etapas do Protocolo Cinestésico */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
            {[
              { step: 1 as const, label: '1. Vocalizar', desc: 'TA-CA-TE-CA', icon: Mic },
              { step: 2 as const, label: '2. Palmas', desc: 'Na tela', icon: Volume2 },
              { step: 3 as const, label: '3. Instrumento', desc: 'Teclado/Violão', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isCurrent = activeStep === item.step;
              return (
                <button
                  key={item.step}
                  onClick={() => {
                    setActiveStep(item.step);
                    if (item.step === 3) setTrainingMode('score');
                  }}
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RENDERIZAÇÃO DO MODO SELECIONADO */}
      {trainingMode === 'score' ? (
        /* MODO 1: TREINO PARTITURADO (PAUTA MUSICAL COM CLAVES, COMPASSOS E EXERCÍCIOS) */
        <RhythmicScoreTrainer
          globalBpm={bpm}
          onBpmChange={(newBpm) => setBpm(newBpm)}
        />
      ) : (
        /* MODO 2: RADAR TEMPORAL (ESTEIRA VERTICAL TRADICIONAL COM METRÔNOMO) */
        <div className="space-y-6">
          {/* Ajuste de Sensibilidade no Radar */}
          <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white uppercase tracking-wider">Sensibilidade do Radar:</span>
              <span className="text-slate-400 font-mono">±{radarToleranceMs}ms</span>
            </div>

            <div className="flex items-center gap-2">
              {[
                { label: '🟢 Suave (±120ms)', val: 120 },
                { label: '🟡 Padrão (±70ms)', val: 70 },
                { label: '🔴 Pro (±35ms)', val: 35 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => {
                    setRadarToleranceMs(p.val);
                    latencyManager.setToleranceMs(p.val);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    radarToleranceMs === p.val
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

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
                  • <strong className="text-white">Janela de Excelência:</strong> O cérebro humano percebe desvios acima de 50ms como &quot;fora de tempo&quot;. A tolerância atual está configurada para <strong className="text-emerald-400">±{radarToleranceMs}ms</strong>.
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
                toleranceMs={radarToleranceMs}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RhythmLab;
