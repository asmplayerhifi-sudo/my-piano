import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ScaleDefinition, ComputedScaleNote } from '../../core/scaleData';
import { ROOT_KEYS } from '../../core/scaleData';
import { micPitchDetector, type DetectedPitch } from '../../core/pitchDetector';
import { NoteConfirmationValidator } from '../../core/noteConfirmationValidator';
import { soundEngine } from '../../core/soundEngine';
import { midiManager } from '../../core/midiManager';
import { useAudioInputConfig } from '../../core/audioInputConfigStore';
import { QuickInputSelector } from '../audio/QuickInputSelector';
import {
  Mic,
  MicOff,
  Trophy,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  Sliders,
  Target,
  Flame,
  Music,
} from 'lucide-react';

interface Props {
  scale: ScaleDefinition;
  rootKey: string;
  notes: ComputedScaleNote[];
  onPlayNote?: (midi: number) => void;
  className?: string;
}

type PracticeMode = 'sequence' | 'freeform';

interface EvaluationResult {
  scorePercent: number;
  totalNotes: number;
  correctNotes: number;
  incorrectNotes: number;
  elapsedSeconds: number;
  feedbackText: string;
}

export const ScalePerformanceEvaluator: React.FC<Props> = ({
  scale,
  rootKey,
  notes,
  onPlayNote,
  className = '',
}) => {
  const audioConfig = useAudioInputConfig();

  // Estado do Microfone
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [currentPitch, setCurrentPitch] = useState<DetectedPitch | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [sensitivityPercent, setSensitivityPercent] = useState<number>(() => micPitchDetector.getSensitivityPercent());

  // Modo de Avaliação
  const [mode, setMode] = useState<PracticeMode>('sequence');

  // Estado da Sequência Passo a Passo
  // Sequência completa da escala: notas ascendentes + oitava de fechamento
  const fullSequence = useMemo(() => {
    if (!notes || notes.length === 0) return [];
    const octavedRoot: ComputedScaleNote = {
      ...notes[0],
      midi: notes[0].midi + 12,
      degree: '8ª',
      functionName: 'Oitava (Tônica)',
      intervalSemitones: 12,
    };
    return [...notes, octavedRoot];
  }, [notes]);

  const [currentTargetIndex, setCurrentTargetIndex] = useState<number>(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    detectedNote?: string;
  } | null>(null);

  // Tempo e Resultados
  const [startTime, setStartTime] = useState<number | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Estado do Modo Livre (Improviso)
  const [freeformStats, setFreeformStats] = useState<{
    inScaleCount: number;
    outScaleCount: number;
    lastDetectedNote: string | null;
    isInScale: boolean | null;
  }>({
    inScaleCount: 0,
    outScaleCount: 0,
    lastDetectedNote: null,
    isInScale: null,
  });

  // Conjunto de notas válidas da escala (classes de altura 0..11)
  const scalePitchClasses = useMemo(() => {
    return new Set(notes.map((n) => ((n.midi % 12) + 12) % 12));
  }, [notes]);

  // Alvo Atual na Sequência
  const currentTargetNote = fullSequence[currentTargetIndex] as ComputedScaleNote | undefined;

  // Refs para closures no callback do microfone
  const currentTargetIndexRef = useRef(currentTargetIndex);
  currentTargetIndexRef.current = currentTargetIndex;

  const fullSequenceRef = useRef(fullSequence);
  fullSequenceRef.current = fullSequence;

  const isCompletedRef = useRef(!!evaluationResult);
  isCompletedRef.current = !!evaluationResult;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const scalePitchClassesRef = useRef(scalePitchClasses);
  scalePitchClassesRef.current = scalePitchClasses;

  const startTimeRef = useRef(startTime);
  startTimeRef.current = startTime;

  const mistakeCountRef = useRef(mistakeCount);
  mistakeCountRef.current = mistakeCount;

  const validatorRef = useRef(new NoteConfirmationValidator({ confirmationWindowMs: 280, sustainDecayWindowMs: 650 }));

  // Finaliza a avaliação da escala com cálculo de nota e feedback
  const finishEvaluation = useCallback((totalMistakes: number, startedAt: number | null) => {
    const elapsed = startedAt ? (performance.now() - startedAt) / 1000 : 8;
    const totalSteps = fullSequenceRef.current.length;
    const correctCount = totalSteps;
    // Cálculo de pontuação: 100% base, deduzindo proporcionalmente por erro
    const rawScore = Math.max(30, Math.round(100 - (totalMistakes / (totalSteps + totalMistakes || 1)) * 80));

    let feedback = '';
    if (rawScore >= 95) {
      feedback = 'Execução impecável! Afinação precisa, articulação perfeita e total domínio dos graus da escala.';
    } else if (rawScore >= 80) {
      feedback = 'Muito bom! A escala soou consistente. Continue praticando para acelerar a fluidez entre os intervalos.';
    } else if (rawScore >= 60) {
      feedback = 'Bom progresso! Atenção às notas alteradas (acidentes/blue notes) para fixar a digitação correta no seu instrumento.';
    } else {
      feedback = 'Continue praticando! Toque mais devagar, ouvindo com atenção cada semitom antes de avançar.';
    }

    setEvaluationResult({
      scorePercent: rawScore,
      totalNotes: totalSteps,
      correctNotes: correctCount,
      incorrectNotes: totalMistakes,
      elapsedSeconds: Math.round(elapsed * 10) / 10,
      feedbackText: feedback,
    });

    // Fanfarra suave de celebração via soundEngine
    soundEngine.ensureAudioReady().then(() => {
      const base = fullSequenceRef.current[0]?.midi || 60;
      [base, base + 4, base + 7, base + 12].forEach((m, i) => {
        setTimeout(() => {
          soundEngine.playPianoNote(m, 0.9, undefined, 0.75);
        }, i * 110);
      });
    });
  }, []);

  // Processa ataque de nota do instrumento captado pelo microfone
  const handleNoteAttack = useCallback(
    (detectedMidi: number, noteNameWithOctave: string) => {
      const detectedPitchClass = ((detectedMidi % 12) + 12) % 12;
      const cleanNoteName = noteNameWithOctave.replace(/[0-9]/g, '');

      // Inicia cronômetro na primeira nota tocada
      if (!startTimeRef.current && !isCompletedRef.current) {
        const now = performance.now();
        setStartTime(now);
        startTimeRef.current = now;
      }

      // =========================================================================
      // MODO 1: SEQUÊNCIA PASSO A PASSO DA ESCALA
      // =========================================================================
      if (modeRef.current === 'sequence') {
        if (isCompletedRef.current) return;

        const seq = fullSequenceRef.current;
        const currentIdx = currentTargetIndexRef.current;
        const target = seq[currentIdx];
        if (!target) return;

        const nextTarget = seq[currentIdx + 1];
        const targetPitchClass = ((target.midi % 12) + 12) % 12;
        const nextPitchClass = nextTarget ? ((nextTarget.midi % 12) + 12) % 12 : -1;
        const now = performance.now();

        // 1. ACERTO IMEDIATO (Zero Latência)
        if (detectedPitchClass === targetPitchClass) {
          validatorRef.current.onNoteCompleted(detectedMidi, now);
          const nextIdx = currentIdx + 1;
          setCompletedIndices((prev) => (prev.includes(currentIdx) ? prev : [...prev, currentIdx]));
          setCurrentTargetIndex(nextIdx);

          setLastFeedback({
            type: 'success',
            message: `Correto! ${target.note} (${target.notePt}) executada com sucesso.`,
            detectedNote: noteNameWithOctave,
          });

          // Som sutil de confirmação harmônica
          soundEngine.ensureAudioReady().then(() => {
            soundEngine.playPianoNote(target.midi, 0.35, undefined, 0.5);
          });

          // Se completou todas as notas da sequência
          if (nextIdx >= seq.length) {
            finishEvaluation(mistakeCountRef.current, startTimeRef.current);
          }
          return;
        }

        // 2. Transição antecipada para a próxima nota da sequência
        if (nextPitchClass !== -1 && detectedPitchClass === nextPitchClass) {
          validatorRef.current.onNoteCompleted(detectedMidi, now);
          const nextIdx = currentIdx + 2;
          setCompletedIndices((prev) => [...prev, currentIdx, currentIdx + 1]);
          setCurrentTargetIndex(nextIdx);

          setLastFeedback({
            type: 'success',
            message: `Correto! ${nextTarget.note} (${nextTarget.notePt}) executada.`,
            detectedNote: noteNameWithOctave,
          });

          soundEngine.ensureAudioReady().then(() => {
            soundEngine.playPianoNote(nextTarget.midi, 0.35, undefined, 0.5);
          });

          if (nextIdx >= seq.length) {
            finishEvaluation(mistakeCountRef.current, startTimeRef.current);
          }
          return;
        }

        // 3. Tolerância de Sustain: Decaimento da nota anterior
        if (validatorRef.current.isPreviousSustain(detectedMidi, now)) {
          return;
        }

        // 4. Janela de Confirmação de Erro (Anti-Falsos Erros)
        validatorRef.current.schedulePendingError(detectedMidi, target.midi, () => {
          if (currentTargetIndexRef.current === currentIdx && !isCompletedRef.current) {
            setMistakeCount((prev) => {
              const nextVal = prev + 1;
              mistakeCountRef.current = nextVal;
              return nextVal;
            });

            setLastFeedback({
              type: 'error',
              message: `Nota detectada: ${cleanNoteName} — Esperado: ${target.note} (${target.notePt})`,
              detectedNote: noteNameWithOctave,
            });
          }
        });
        return;
      }

      // =========================================================================
      // MODO 2: RECONHECIMENTO LIVRE / IMPROVISO
      // =========================================================================
      if (modeRef.current === 'freeform') {
        const isInScale = scalePitchClassesRef.current.has(detectedPitchClass);
        setFreeformStats((prev) => ({
          inScaleCount: prev.inScaleCount + (isInScale ? 1 : 0),
          outScaleCount: prev.outScaleCount + (isInScale ? 0 : 1),
          lastDetectedNote: noteNameWithOctave,
          isInScale,
        }));

        setLastFeedback({
          type: isInScale ? 'success' : 'error',
          message: isInScale
            ? `Nota na escala! ${cleanNoteName} pertence à ${scale.name}`
            : `Nota fora da escala: ${cleanNoteName} é nota externa/tensão`,
          detectedNote: noteNameWithOctave,
        });
      }
    },
    [scale.name, finishEvaluation]
  );

  // Controle de ativação do Microfone
  const toggleMicrophone = async () => {
    setMicError(null);
    if (isMicActive) {
      micPitchDetector.stop();
      setIsMicActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
    } else {
      const success = await micPitchDetector.start(
        (pitch) => {
          setCurrentPitch(pitch);
          if (pitch.isNewAttack) {
            handleNoteAttack(pitch.midi, pitch.noteName);
          }
        },
        (rms) => {
          setVolumeLevel(Math.min(100, Math.round(rms * 450)));
        }
      );

      if (success) {
        setIsMicActive(true);
      } else {
        setMicError('Permissão para microfone negada ou dispositivo indisponível.');
      }
    }
  };

  // Ajuste de Sensibilidade
  const handleSensitivityPercentChange = (val: number) => {
    const clamped = Math.max(5, Math.min(100, val));
    setSensitivityPercent(clamped);
    micPitchDetector.setSensitivityPercent(clamped);
  };

  const handleSensitivityPreset = (preset: 'low' | 'normal' | 'high') => {
    let p = 55;
    if (preset === 'low') p = 25;
    if (preset === 'high') p = 85;
    handleSensitivityPercentChange(p);
  };

  // Reinicia a avaliação da escala atual
  const handleReset = () => {
    setCurrentTargetIndex(0);
    setCompletedIndices([]);
    setMistakeCount(0);
    setStartTime(null);
    setEvaluationResult(null);
    setLastFeedback(null);
    setFreeformStats({
      inScaleCount: 0,
      outScaleCount: 0,
      lastDetectedNote: null,
      isInScale: null,
    });
    validatorRef.current.reset();
  };

  // Quando a escala ou tom muda, reseta o progresso
  useEffect(() => {
    handleReset();
  }, [scale.id, rootKey]);

  // Escuta notas de Teclado MIDI Físico (USB / OTG / Bluetooth)
  useEffect(() => {
    const unsub = midiManager.subscribe((event) => {
      if (event.isDown) {
        handleNoteAttack(event.midi, event.noteName);
      }
    });
    return () => unsub();
  }, [handleNoteAttack]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      micPitchDetector.stop();
    };
  }, []);

  // Toca nota alvo para auxílio auditivo do músico
  const playTargetReference = () => {
    if (currentTargetNote) {
      soundEngine.ensureAudioReady().then(() => {
        soundEngine.playPianoNote(currentTargetNote.midi, 0.7, undefined, 0.85);
      });
      if (onPlayNote) onPlayNote(currentTargetNote.midi);
    }
  };

  // Mini visualizador de 1 oitava cromática integrado no avaliador
  const chromaticKeys = useMemo(() => {
    const rootIdx = ROOT_KEYS.findIndex((r) => r.key === rootKey);
    const safeRootIdx = rootIdx >= 0 ? rootIdx : 0;
    const baseMidi = 60 + safeRootIdx;

    const scaleMidisMod = new Set(notes.map((n) => ((n.midi % 12) + 12) % 12));
    const rootMod = ((baseMidi % 12) + 12) % 12;

    const keys = [
      { name: 'C', isBlack: false, semitone: 0 },
      { name: 'C#', isBlack: true, semitone: 1 },
      { name: 'D', isBlack: false, semitone: 2 },
      { name: 'D#', isBlack: true, semitone: 3 },
      { name: 'E', isBlack: false, semitone: 4 },
      { name: 'F', isBlack: false, semitone: 5 },
      { name: 'F#', isBlack: true, semitone: 6 },
      { name: 'G', isBlack: false, semitone: 7 },
      { name: 'G#', isBlack: true, semitone: 8 },
      { name: 'A', isBlack: false, semitone: 9 },
      { name: 'A#', isBlack: true, semitone: 10 },
      { name: 'B', isBlack: false, semitone: 11 },
    ];

    return keys.map((k) => {
      const inScale = scaleMidisMod.has(k.semitone);
      const isTonic = k.semitone === rootMod;
      const isCurrentTarget = currentTargetNote && (((currentTargetNote.midi % 12) + 12) % 12 === k.semitone);
      return {
        ...k,
        inScale,
        isTonic,
        isCurrentTarget,
        midi: 60 + k.semitone,
      };
    });
  }, [rootKey, notes, currentTargetNote]);

  const handleVirtualKeyClick = (midi: number, noteName: string) => {
    soundEngine.playPianoNote(midi, 0.8);
    if (onPlayNote) onPlayNote(midi);
    handleNoteAttack(midi, noteName);
  };

  // Porcentagem de conclusão da sequência
  const progressPercent = Math.round((completedIndices.length / (fullSequence.length || 1)) * 100);

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-black/80 border border-indigo-500/20 shadow-2xl space-y-5 backdrop-blur-md ${className}`}
    >
      {/* 1. Header do Avaliador de Performance com Microfone */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Laboratório de Afinação &amp; Performance</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2.5">
            <span>Avaliar Execução no seu Instrumento</span>
            {isMicActive && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Toque a escala <strong className="text-indigo-300 font-bold">{rootKey} {scale.name}</strong> em seu piano acústico, teclado, violão ou guitarra. O microfone avalia sua afinação e precisão nota a nota.
          </p>
        </div>

        {/* Seletor Rápido de Entrada [ 🎹 MIDI USB ] [ 🎙️ Microfone ] [ 🔌 Cabo Line-In ] [ 🎧 Fones ] + Ações */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <QuickInputSelector compact />

          <button
            onClick={toggleMicrophone}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              isMicActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400/50'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-emerald-500/25 ring-1 ring-emerald-400'
            }`}
          >
            {isMicActive ? (
              <>
                <MicOff className="w-4 h-4 shrink-0" />
                <span>Pausar Escuta</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 shrink-0" />
                <span>Ouvir Instrumento</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            title="Reiniciar Avaliação da Escala"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Erro de Microfone */}
      {micError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* 2. Barra de Status da Captação em Tempo Real (Volume e Pitch) */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full shrink-0 ${
              audioConfig.inputMode === 'midi'
                ? 'bg-indigo-400 shadow-md shadow-indigo-400/50 animate-pulse'
                : isMicActive
                ? volumeLevel > 10
                  ? 'bg-emerald-400 shadow-md shadow-emerald-400/50'
                  : 'bg-emerald-600'
                : 'bg-slate-700'
            }`}
          />
          <div className="text-xs font-mono">
            <span className="text-slate-400">Entrada Ativa: </span>
            <span className={`font-bold ${
              audioConfig.inputMode === 'midi'
                ? 'text-indigo-400'
                : isMicActive
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}>
              {audioConfig.inputMode === 'midi'
                ? '🎹 Teclado MIDI USB: Toque as teclas no seu instrumento físico (Latência Zero)'
                : audioConfig.inputMode === 'line-in'
                ? isMicActive
                  ? '🔌 Cabo Line-In: Captação direta via interface'
                  : '🔌 Cabo Line-In: Clique em "Ouvir Instrumento"'
                : audioConfig.inputMode === 'headset'
                ? isMicActive
                  ? '🎧 Fones / Headset: Captação acústica auricular'
                  : '🎧 Fones / Headset: Clique em "Ouvir Instrumento"'
                : isMicActive
                ? '🎙️ Microfone Acústico: Aguardando ataque'
                : '🎙️ Microfone Desconectado (Clique em Ouvir Instrumento)'}
            </span>
          </div>
        </div>

        {/* Medidor de Volume RMS & Sensibilidade */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Nível:</span>
            <div className="w-20 sm:w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  volumeLevel > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${volumeLevel}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 w-7">{volumeLevel}%</span>
          </div>

          {/* Ajuste de Sensibilidade do Microfone */}
          <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] font-mono font-bold text-slate-300">Sensibilidade:</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
              sensitivityPercent >= 70
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : sensitivityPercent <= 35
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {sensitivityPercent}%
            </span>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={sensitivityPercent}
              onChange={(e) => handleSensitivityPercentChange(Number(e.target.value))}
              className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              title={`Ajuste de sensibilidade: ${sensitivityPercent}%`}
            />
            <div className="flex bg-black/60 p-0.5 rounded-lg border border-white/10 text-[9px] font-bold">
              <button
                onClick={() => handleSensitivityPreset('high')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  sensitivityPercent >= 70 ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Alta Sensibilidade: detecta notas suaves"
              >
                Alta
              </button>
              <button
                onClick={() => handleSensitivityPreset('normal')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  sensitivityPercent > 35 && sensitivityPercent < 70 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Sensibilidade Média / Normal"
              >
                Média
              </button>
              <button
                onClick={() => handleSensitivityPreset('low')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  sensitivityPercent <= 35 ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Baixa Sensibilidade: para locais com ruído"
              >
                Baixa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Seletor de Modo: Sequência da Escala vs Improviso Livre */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl p-1 bg-black/40 border border-white/5">
          <button
            onClick={() => {
              setMode('sequence');
              handleReset();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mode === 'sequence'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Modo Passo a Passo (Sequência da Escala)</span>
          </button>

          <button
            onClick={() => {
              setMode('freeform');
              handleReset();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mode === 'freeform'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modo Improviso Livre (Detector de Notas da Escala)</span>
          </button>
        </div>

        {mode === 'sequence' && (
          <div className="text-xs font-mono text-slate-400">
            Progresso: <strong className="text-white">{completedIndices.length}</strong> de{' '}
            <strong className="text-white">{fullSequence.length}</strong> notas ({progressPercent}%)
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. CONTEÚDO DO MODO 1: SEQUÊNCIA PASSO A PASSO DA ESCALA               */}
      {/* ===================================================================== */}
      {mode === 'sequence' && (
        <div className="space-y-4">
          {/* Card de Conclusão / Relatório de Desempenho */}
          {evaluationResult ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-400/30 text-center space-y-4 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-400/20">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold block mb-1">
                  Avaliação da Escala Concluída!
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  Precisão: {evaluationResult.scorePercent}%
                </h4>
                <p className="text-xs text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
                  {evaluationResult.feedbackText}
                </p>
              </div>

              {/* Grid de Estatísticas do Aluno */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Notas da Escala</span>
                  <span className="text-lg font-bold text-white">{evaluationResult.totalNotes}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Acertos</span>
                  <span className="text-lg font-bold text-emerald-400">{evaluationResult.correctNotes}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Desvios/Erros</span>
                  <span className="text-lg font-bold text-rose-400">{evaluationResult.incorrectNotes}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Tempo Total</span>
                  <span className="text-lg font-bold text-cyan-400">{evaluationResult.elapsedSeconds}s</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir Escala</span>
                </button>
              </div>
            </div>
          ) : (
            /* Painel Ativo de Execução da Sequência */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Coluna Esquerda: Nota Alvo Atual com Destaque Gigante */}
              <div className="lg:col-span-5 p-5 rounded-3xl bg-black/50 border border-white/10 text-center space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Nota Alvo {currentTargetIndex + 1} de {fullSequence.length}</span>
                  </span>
                  <span className="text-slate-400 font-bold">
                    {currentTargetNote?.degree}
                  </span>
                </div>

                <div className="py-2">
                  <div className="text-5xl sm:text-6xl font-black font-display text-white tracking-tight">
                    {currentTargetNote?.note}
                  </div>
                  <div className="text-sm font-bold text-indigo-300 font-mono mt-1">
                    {currentTargetNote?.notePt} — {currentTargetNote?.functionName}
                  </div>
                </div>

                {/* Botão de Auxílio Auditivo */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={playTargetReference}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Ouvir referência de som desta nota"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ouvir Referência</span>
                  </button>
                </div>

                {/* Badge se for Blue Note ou Tônica */}
                {currentTargetNote?.isBlueNote && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-mono">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>Atenção: Blue Note ♭5 Característica!</span>
                  </div>
                )}
              </div>

              {/* Coluna Direita: Trilha Horizontal de Steps da Escala + Feedback ao Vivo */}
              <div className="lg:col-span-7 space-y-3">
                {/* Trilha de Steps da Escala */}
                <div className="p-4 rounded-3xl bg-black/30 border border-white/5 space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                    Sequência da Escala (Ascendente):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {fullSequence.map((stepNote, sIdx) => {
                      const isCompleted = completedIndices.includes(sIdx);
                      const isCurrent = currentTargetIndex === sIdx;

                      return (
                        <div
                          key={sIdx}
                          className={`flex-1 min-w-[52px] p-2 rounded-xl text-center border transition-all ${
                            isCompleted
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : isCurrent
                              ? 'bg-indigo-600 border-indigo-400 text-white font-black shadow-lg shadow-indigo-600/30 scale-105 ring-2 ring-indigo-400'
                              : 'bg-white/[0.03] border-white/5 text-slate-500'
                          }`}
                        >
                          <div className="text-[10px] font-mono">{stepNote.degree}</div>
                          <div className="text-base font-bold">{stepNote.note}</div>
                          <div className="text-[9px] font-mono opacity-80">{stepNote.notePt}</div>
                          {isCompleted && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 mx-auto mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback em Tempo Real de Ataque de Nota */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 min-h-[56px]">
                  <div className="flex items-center gap-2.5">
                    {lastFeedback ? (
                      lastFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )
                    ) : (
                      <Mic className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
                    )}

                    <div className="text-xs">
                      {lastFeedback ? (
                        <span
                          className={`font-mono font-bold ${
                            lastFeedback.type === 'success' ? 'text-emerald-300' : 'text-rose-300'
                          }`}
                        >
                          {lastFeedback.message}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Toque <strong className="text-white">{currentTargetNote?.note}</strong> no seu instrumento acústico ou teclado para começar...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informações Técnicas de Pitch Detectado */}
                  {currentPitch && (
                    <div className="text-right shrink-0 font-mono text-[10px] text-slate-400">
                      <div>{currentPitch.frequency} Hz</div>
                      <div className="text-slate-500">{currentPitch.clarity}% clareza</div>
                    </div>
                  )}
                </div>

                {/* ── Mini Teclado de Piano Integrado ao Bloco de Avaliação ── */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5 text-[10px]">
                      <Music className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Teclado Integrado (Clique ou toque no instrumento)</span>
                    </span>
                    <span className="text-[10px] text-pink-300 font-mono font-bold">
                      {currentTargetNote ? `Alvo: ${currentTargetNote.note}` : 'Teclas da Escala'}
                    </span>
                  </div>

                  <div className="flex items-end justify-center gap-1 h-20 max-w-md mx-auto py-1">
                    {chromaticKeys.map((k) => (
                      <button
                        key={k.semitone}
                        onClick={() => handleVirtualKeyClick(k.midi, k.name)}
                        className={`flex-1 rounded-b-lg font-mono text-[9px] font-bold flex flex-col justify-end items-center pb-1 transition-all cursor-pointer select-none active:scale-95 ${
                          k.isBlack ? 'h-13 -mx-1 z-10' : 'h-20 z-0'
                        } ${
                          k.isCurrentTarget
                            ? 'bg-gradient-to-t from-pink-600 via-rose-500 to-indigo-600 text-white shadow-lg shadow-pink-500/50 scale-105 ring-2 ring-pink-400 z-20 animate-pulse'
                            : k.inScale
                            ? k.isTonic
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                              : 'bg-indigo-600 text-white shadow'
                            : k.isBlack
                            ? 'bg-slate-900 border border-slate-800 text-slate-600 hover:bg-slate-800'
                            : 'bg-slate-800/60 border border-slate-700/50 text-slate-500 hover:bg-slate-700/60'
                        }`}
                        title={`Tocar ${k.name} (MIDI ${k.midi})`}
                      >
                        <span>{k.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. CONTEÚDO DO MODO 2: RECONHECIMENTO LIVRE / IMPROVISO                */}
      {/* ===================================================================== */}
      {mode === 'freeform' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Notas na Escala</span>
              <span className="text-2xl font-black text-emerald-400">{freeformStats.inScaleCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Notas Fora da Escala</span>
              <span className="text-2xl font-black text-rose-400">{freeformStats.outScaleCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Aderência Harmônica</span>
              <span className="text-2xl font-black text-cyan-400">
                {freeformStats.inScaleCount + freeformStats.outScaleCount > 0
                  ? Math.round(
                      (freeformStats.inScaleCount /
                        (freeformStats.inScaleCount + freeformStats.outScaleCount)) *
                        100
                    )
                  : 100}
                %
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center space-y-2">
            <span className="text-xs text-slate-400">
              Improvise livremente no seu instrumento acústico usando as notas da escala{' '}
              <strong className="text-indigo-300 font-bold">{rootKey} {scale.name}</strong>. O sistema identifica se cada frase musical permanece dentro da harmonia modal!
            </span>
            {freeformStats.lastDetectedNote && (
              <div className="pt-2">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full font-mono text-sm font-bold ${
                    freeformStats.isInScale
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  Última nota: {freeformStats.lastDetectedNote} (
                  {freeformStats.isInScale ? 'Pertence à Escala ✓' : 'Nota Externa ✗'}
                  )
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
