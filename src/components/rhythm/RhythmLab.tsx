import React, { useState, useEffect, useCallback } from 'react';
import { MetronomeView } from './MetronomeView';
import { MetronomeAccompanimentStudio } from './MetronomeAccompanimentStudio';
import { RhythmTrackCanvas, type ExternalRhythmTrigger } from './RhythmTrackCanvas';
import { RhythmicScoreTrainer } from './RhythmicScoreTrainer';
import { HybridRhythmChord } from '../hybrid/HybridRhythmChord';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { metronomeScheduler } from '../../core/metronomeScheduler';
import { latencyManager } from '../../core/latencyManager';
import { midiManager } from '../../core/midiManager';
import { soundEngine } from '../../core/soundEngine';
import { Activity, Mic, Volume2, ShieldCheck, HelpCircle, Music, Radar, Sliders, Layers, Radio } from 'lucide-react';

export type RhythmTrainingMode = 'studio' | 'radar' | 'score' | 'hybrid';

export const RhythmLab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(metronomeScheduler.getIsPlaying());
  const [bpm, setBpm] = useState<number>(metronomeScheduler.getBpm());
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(2); // 1 = Vocal, 2 = Palmas, 3 = Instrumento
  const [trainingMode, setTrainingMode] = useState<RhythmTrainingMode>('studio');
  const [radarToleranceMs, setRadarToleranceMs] = useState<number>(latencyManager.getToleranceMs());
  const [externalTrigger, setExternalTrigger] = useState<ExternalRhythmTrigger | null>(null);

  // Permite que botões globais (como no Header) mudem o modo para o estúdio na tela
  useEffect(() => {
    const handleNavMode = (e: Event) => {
      const customEvent = e as CustomEvent<RhythmTrainingMode>;
      if (customEvent.detail) {
        setTrainingMode(customEvent.detail);
      }
    };
    window.addEventListener('nav-rhythm-mode', handleNavMode);
    return () => window.removeEventListener('nav-rhythm-mode', handleNavMode);
  }, []);

  // Escuta entradas MIDI de teclados externos USB/Bluetooth
  useEffect(() => {
    const unsub = midiManager.subscribe((payload) => {
      if (payload.isDown) {
        soundEngine.ensureAudioReady();
        setExternalTrigger({ timestamp: Date.now(), midi: payload.midi, type: 'midi' });
      }
    });
    return () => unsub();
  }, []);

  const handleMicNote = useCallback((midi: number) => {
    soundEngine.ensureAudioReady();
    setExternalTrigger({ timestamp: Date.now(), midi, type: 'midi' });
  }, []);

  const handleMicClap = useCallback(() => {
    soundEngine.ensureAudioReady();
    setExternalTrigger({ timestamp: Date.now(), type: 'clap' });
  }, []);

  const handleMicAttack = useCallback((_rms: number) => {
    soundEngine.ensureAudioReady();
    if (activeStep === 1) {
      setExternalTrigger({ timestamp: Date.now(), type: 'voice' });
    } else if (activeStep === 2) {
      setExternalTrigger({ timestamp: Date.now(), type: 'clap' });
    }
  }, [activeStep]);

  return (
    <div className="w-full space-y-6">
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
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-4xl">
            Elimine antecipações e atrasos métricos. Pratique com partituras reais para Teclado e Violão, esteira temporal com radar ou trocas de acordes no compasso.
          </p>
        </div>

        {/* Alternador Principal de Modo de Treino */}
        <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar scroll-indicator-x touch-pan-x max-w-full">
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 shadow-lg shrink-0">
            <button
              onClick={() => setTrainingMode('studio')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                trainingMode === 'studio'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>🎛️ Metrônomo &amp; Banda</span>
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
              onClick={() => setTrainingMode('hybrid')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                trainingMode === 'hybrid'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>⚡ Ritmo + Harmonia</span>
            </button>
          </div>

          {/* 3 Etapas do Protocolo Cinestésico */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
            {[
              { step: 1 as const, label: '1. Vocalizar', desc: 'Voz / Sílabas', icon: Mic },
              { step: 2 as const, label: '2. Palmas', desc: 'Palmas / Tela', icon: Volume2 },
              { step: 3 as const, label: '3. Instrumento', desc: 'Piano / Violão', icon: ShieldCheck },
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RENDERIZAÇÃO DO MODO SELECIONADO */}
      {trainingMode === 'studio' ? (
        /* MODO 0: ESTÚDIO COMPLETO DE METRÔNOMO & ACOMPANHAMENTO (DIRETO NA TELA) */
        <div className="space-y-6">
          {/* Barra de Microfone Acústico / Palmas / Voz / Teclado Real */}
          <MicrophonePitchBar
            onNoteDetected={handleMicNote}
            onClapDetected={handleMicClap}
            onOnsetDetected={handleMicAttack}
            customLabel="Ouvir Meu Teclado / Violão (Microfone ou USB) com o Metrônomo"
          />

          <MetronomeAccompanimentStudio
            onNavigateToRadar={() => setTrainingMode('radar')}
            onNavigateToScore={() => setTrainingMode('score')}
          />
        </div>
      ) : trainingMode === 'score' ? (
        /* MODO 1: TREINO PARTITURADO (PAUTA MUSICAL COM CLAVES, COMPASSOS E EXERCÍCIOS) */
        <RhythmicScoreTrainer
          globalBpm={bpm}
          onBpmChange={(newBpm) => setBpm(newBpm)}
        />
      ) : trainingMode === 'radar' ? (
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

          {/* Barra de Microfone Acústico / Palmas / Voz / Teclado Real */}
          <MicrophonePitchBar
            onNoteDetected={handleMicNote}
            onClapDetected={handleMicClap}
            onOnsetDetected={handleMicAttack}
            customLabel={
              activeStep === 1
                ? 'Ouvir Voz no Microfone (Vocalizar TA-CA-TE-CA)'
                : activeStep === 2
                ? 'Ouvir Palmas no Microfone (Ataque Acústico)'
                : 'Ouvir Meu Teclado / Violão (Microfone ou USB)'
            }
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Coluna do Metrônomo (5 colunas no desktop) */}
            <div className="xl:col-span-5 space-y-4">
              <MetronomeView
                onBpmChange={(newBpm) => setBpm(newBpm)}
                onPlayStateChange={(playing) => setIsPlaying(playing)}
                onOpenStudio={() => setTrainingMode('studio')}
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
            <div className="xl:col-span-7">
              <RhythmTrackCanvas
                isPlaying={isPlaying}
                bpm={bpm}
                timeSignature={metronomeScheduler.getTimeSignature()}
                toleranceMs={radarToleranceMs}
                inputMode={activeStep === 1 ? 'vocal' : activeStep === 2 ? 'claps' : 'instrument'}
                externalTrigger={externalTrigger}
                soundFeedback={true}
              />
            </div>
          </div>
        </div>
      ) : (
        /* MODO 3: RITMO + HARMONIA (PRÁTICA DE ACORDES NO COMPASSO) */
        <HybridRhythmChord embedded={true} />
      )}
    </div>
  );
};
export default RhythmLab;
