import React, { useState, useEffect, useCallback } from 'react';
import { RHYTHM_EXERCISES } from '../../core/rhythmExercisesData';
import { ScrollingScoreCanvas } from '../score/ScrollingScoreCanvas';
import { soundEngine } from '../../core/soundEngine';
import { latencyManager } from '../../core/latencyManager';
import {
  Volume2,
  Square,
  Sparkles,
  Award,
  Flame,
  Sliders,
  Music,
  CheckCircle2,
  BookOpen,
  Info,
} from 'lucide-react';

interface Props {
  initialInstrument?: 'keyboard' | 'guitar';
  globalBpm?: number;
  onBpmChange?: (bpm: number) => void;
}

export const RhythmicScoreTrainer: React.FC<Props> = ({
  initialInstrument = 'keyboard',
  globalBpm,
  onBpmChange,
}) => {
  // 1. Estado de Instrumento e Exercício
  const [instrument, setInstrument] = useState<'keyboard' | 'guitar'>(initialInstrument);
  const filteredExercises = RHYTHM_EXERCISES.filter(ex => ex.instrument === instrument);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    filteredExercises[0]?.id || 'k-pulse-5fingers'
  );

  const currentExercise = RHYTHM_EXERCISES.find(ex => ex.id === selectedExerciseId) || filteredExercises[0];

  // 2. Estado do Metrônomo / Andamento
  const [bpm, setBpm] = useState<number>(globalBpm || currentExercise.recommendedBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sincroniza BPM ao trocar de exercício
  useEffect(() => {
    if (currentExercise) {
      setBpm(currentExercise.recommendedBpm);
      if (onBpmChange) onBpmChange(currentExercise.recommendedBpm);
    }
  }, [currentExercise, onBpmChange]);

  // Se trocar de instrumento, seleciona o primeiro exercício do instrumento
  const handleSelectInstrument = (inst: 'keyboard' | 'guitar') => {
    setInstrument(inst);
    const list = RHYTHM_EXERCISES.filter(ex => ex.instrument === inst);
    if (list.length > 0) {
      setSelectedExerciseId(list[0].id);
      setBpm(list[0].recommendedBpm);
    }
    stopDemoAudio();
  };

  // 3. Ajuste de Sensibilidade / Tolerância Rítmica (Requisito Explícito do Usuário)
  // Presets: 'relaxed' (±120ms), 'standard' (±70ms), 'strict' (±35ms)
  const [toleranceMs, setToleranceMsState] = useState<number>(latencyManager.getToleranceMs());

  const handleSetTolerance = (ms: number) => {
    setToleranceMsState(ms);
    latencyManager.setToleranceMs(ms);
  };

  // 4. Modo Áudio Demonstrativo ("Ouvir Exemplo")
  const [isAuditionPlaying, setIsAuditionPlaying] = useState<boolean>(false);

  const stopDemoAudio = useCallback(() => {
    setIsAuditionPlaying(false);
    setIsPlaying(false);
  }, []);

  const playDemoAudio = async () => {
    if (isAuditionPlaying) {
      stopDemoAudio();
      return;
    }

    await soundEngine.ensureAudioReady();
    setIsAuditionPlaying(true);
    setIsPlaying(true);
  };

  // 5. Estatísticas de Treino Rítmico
  const [combo, setCombo] = useState<number>(0);
  const [bestCombo, setBestCombo] = useState<number>(0);
  const [recentHits, setRecentHits] = useState<Array<{ label: string; color: string; diffMs: number }>>([]);
  const [simulatedMidiPress, setSimulatedMidiPress] = useState<{ midi: number; timestamp: number } | null>(null);

  const handleNoteHit = useCallback((_note: unknown, diffMs: number) => {
    const absDiff = Math.abs(diffMs);
    const perfectThreshold = Math.max(12, Math.round(toleranceMs * 0.4));
    const goodThreshold = toleranceMs;

    let hitInfo: { label: string; color: string; diffMs: number };
    if (absDiff <= perfectThreshold) {
      hitInfo = { label: `PERFEITO! (±${Math.round(absDiff)}ms)`, color: 'text-emerald-400', diffMs };
      setCombo(c => {
        const next = c + 1;
        setBestCombo(b => Math.max(b, next));
        return next;
      });
    } else if (absDiff <= goodThreshold) {
      hitInfo = {
        label: diffMs < 0 ? `BOM (-${Math.round(absDiff)}ms)` : `BOM (+${Math.round(absDiff)}ms)`,
        color: 'text-cyan-400',
        diffMs,
      };
      setCombo(c => {
        const next = c + 1;
        setBestCombo(b => Math.max(b, next));
        return next;
      });
    } else {
      hitInfo = {
        label: diffMs < 0 ? `ADIANTADO (${Math.round(diffMs)}ms)` : `ATRASADO (+${Math.round(diffMs)}ms)`,
        color: 'text-rose-400',
        diffMs,
      };
      setCombo(0);
    }

    setRecentHits(prev => [hitInfo, ...prev.slice(0, 4)]);
  }, [toleranceMs]);

  // Handler para toque interativo manual no ritmo (Botão ou Barra de Espaço)
  const handleManualTap = useCallback(async () => {
    await soundEngine.ensureAudioReady();
    // Envia midi: -1 indicando toque rítmico (aceita a nota exata da posição atual no exercício)
    setSimulatedMidiPress({ midi: -1, timestamp: Date.now() });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleManualTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualTap]);

  return (
    <div className="w-full space-y-6">
      {/* 1. SELETOR DE INSTRUMENTO & HEADER DO TREINO */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Music className="w-4 h-4" />
            <span>Treinador Rítmico Partiturado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Treino de Ritmo com Pauta &amp; Partitura
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Siga a pauta em tempo real com claves, compassos e figuras rítmicas. Ajuste a sensibilidade conforme seu nível e pratique com feedback milimétrico de precisão.
          </p>
        </div>

        {/* Abas dos Dois Instrumentos */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 self-start lg:self-auto">
          <button
            onClick={() => handleSelectInstrument('keyboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              instrument === 'keyboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎹</span>
            <span>Teclado / Piano (5 Exercícios)</span>
          </button>

          <button
            onClick={() => handleSelectInstrument('guitar')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              instrument === 'guitar'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎸</span>
            <span>Violão (5 Exercícios)</span>
          </button>
        </div>
      </div>

      {/* 2. GRADE DE EXERCÍCIOS CURADOS COM EXEMPLOS PRÁTICOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Exercícios Práticos de {instrument === 'keyboard' ? 'Teclado' : 'Violão'} com Exemplos</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {filteredExercises.length} exercícios disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {filteredExercises.map((ex) => {
            const isSelected = ex.id === selectedExerciseId;
            return (
              <div
                key={ex.id}
                onClick={() => {
                  setSelectedExerciseId(ex.id);
                  stopDemoAudio();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  isSelected
                    ? instrument === 'keyboard'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {ex.timeSignature}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ex.difficulty === 'Iniciante'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ex.difficulty === 'Intermediário'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">{ex.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ex.subtitle}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{ex.recommendedBpm} BPM</span>
                  {ex.strumPattern && (
                    <span className="text-amber-300 font-sans font-bold text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {ex.strumPattern}
                    </span>
                  )}
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 ml-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PAINEL DE CONTROLE DE SENSIBILIDADE / TOLERÂNCIA RÍTMICA */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 bg-slate-900/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Ajuste de Sensibilidade / Tolerância Métrica
            </span>
            <span className="text-xs text-slate-400">
              (Ajuste para maior ou menor rigor temporal)
            </span>
          </div>

          {/* Presets Rápidos */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
            <button
              onClick={() => handleSetTolerance(120)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                toleranceMs >= 100
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🟢 Suave / Iniciante (±120ms)
            </button>
            <button
              onClick={() => handleSetTolerance(70)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                toleranceMs >= 50 && toleranceMs < 100
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🟡 Padrão (±70ms)
            </button>
            <button
              onClick={() => handleSetTolerance(35)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                toleranceMs < 50
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🔴 Pro / Estrito (±35ms)
            </button>
          </div>
        </div>

        {/* Slider e Régua Visual de Tolerância */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono w-24">
              Janela: <strong className="text-white">±{toleranceMs}ms</strong>
            </span>
            <input
              type="range"
              min="20"
              max="160"
              step="5"
              value={toleranceMs}
              onChange={(e) => handleSetTolerance(parseInt(e.target.value, 10))}
              className="flex-1 accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-[11px] text-slate-500 font-mono">
              {toleranceMs <= 40 ? 'Alta Sensibilidade' : toleranceMs >= 100 ? 'Baixa Sensibilidade' : 'Média'}
            </span>
          </div>

          {/* Régua Visual de Zonas de Precisão */}
          <div className="md:col-span-6 bg-black/40 rounded-xl p-2.5 border border-white/5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">
                Perfeito: <strong className="text-emerald-400">±{Math.round(toleranceMs * 0.4)}ms</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">
                Bom: <strong className="text-cyan-400">±{toleranceMs}ms</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">
                Fora: <strong className="text-rose-400">&gt;{toleranceMs}ms</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BARRA DE AÇÃO DO EXERCÍCIO ATIVO: AUDIÇÃO DE EXEMPLO + TREINO */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black font-display text-white">
              {currentExercise.title}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              {currentExercise.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            {currentExercise.description}
          </p>
        </div>

        {/* Botões: Ouvir Exemplo & Praticar */}
        <div className="flex items-center gap-3">
          <button
            onClick={playDemoAudio}
            className={`px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
              isAuditionPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            {isAuditionPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Parar Áudio Demonstrativo</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Ouvir Exemplo (Demonstração Sonora)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. PAUTA MUSICAL DESLIZANTE INTERATIVA (GRAND STAFF COM CLAVES, DÓ CENTRAL E METRÔNOMO) */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl space-y-4">
        {/* HUD do Treino em Tempo Real */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-2 rounded-2xl bg-black/40 border border-white/5 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>Combo:</span>
              <span className="font-mono text-white text-sm">{combo}x</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Melhor: {bestCombo}x</span>
            </div>
          </div>

          {/* Último Feedback de Precisão */}
          {recentHits.length > 0 && (
            <div className={`font-black font-display text-sm tracking-wide ${recentHits[0].color} animate-bounce`}>
              {recentHits[0].label}
            </div>
          )}

          <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
            <span>Sensibilidade: <strong className="text-white">±{toleranceMs}ms</strong></span>
            <span>•</span>
            <span>Andamento: <strong className="text-indigo-400">{bpm} BPM</strong></span>
          </div>
        </div>

        {/* Canvas da Partitura Deslizante com Grand Staff */}
        <div className="w-full">
          <ScrollingScoreCanvas
            key={`${selectedExerciseId}-${isAuditionPlaying ? 'audition' : 'live'}`}
            notes={currentExercise.scoreTrack}
            bpm={bpm}
            timeSignature={currentExercise.timeSignature}
            initialMode="flow"
            instrument={instrument === 'guitar' ? 'guitar' : 'piano'}
            toleranceMs={toleranceMs}
            onNoteHit={handleNoteHit}
            currentMidiPressed={simulatedMidiPress}
            isPlaying={isPlaying || isAuditionPlaying}
            isDemoMode={isAuditionPlaying}
            autoPlayAudio={isAuditionPlaying}
            enableMetronomeSound={true}
            onPlayPauseToggle={(playing) => {
              setIsPlaying(playing);
              if (!playing) setIsAuditionPlaying(false);
            }}
            onTempoChange={(newTempo) => setBpm(newTempo)}
            onLessonComplete={() => {
              setIsAuditionPlaying(false);
              setIsPlaying(false);
            }}
          />
        </div>

        {/* Botão Gigante de Toque Rítmico (Mobile & Desktop) */}
        <button
          onClick={handleManualTap}
          className={`w-full py-4 rounded-3xl font-black font-display text-base uppercase tracking-wider shadow-xl transition-all cursor-pointer select-none no-select active:scale-98 ${
            instrument === 'keyboard'
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/25'
              : 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-amber-500/25'
          }`}
        >
          TOQUE NO RITMO DA PARTITURA (OU BARRA DE ESPAÇO)
        </button>
      </div>

      {/* 6. DICAS TÉCNICAS E PEDAGÓGICAS DO EXERCÍCIO SELECIONADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Foco Pedagógico &amp; Métrica</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentExercise.pedagogicalFocus}
          </p>
          {currentExercise.chordsSummary && (
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Progressão de Acordes:</span>
              <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                {currentExercise.chordsSummary}
              </span>
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Dicas Práticas de Execução</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {currentExercise.techniqueTips.map((tip, idx) => (
              <li key={idx} className="leading-snug">{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
