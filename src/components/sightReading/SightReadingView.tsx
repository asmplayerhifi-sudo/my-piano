/**
 * components/sightReading/SightReadingView.tsx
 *
 * Tela de Treino de Leitura de Partitura (Clave de Sol e Clave de Fá).
 * Integrada ao menu PRÁTICA: do ecossistema Harmonia.
 *
 * Arquitetura de 3 Painéis:
 *  1. Painel Superior: Filtros de Clave, Tipo de Exercício, Acidentes e Modo (Livre vs Desafio).
 *  2. Painel Central: Palco de Leitura Gráfico de Alta Definição (Canvas) com feedback em tempo real.
 *  3. Painel Inferior: Teclado Virtual Interativo (MIDI / Mic / Toque) e Dashboard de Métricas com Mapa de Calor.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from 'react';
import type {
  ClefType,
  AccidentalMode,
  ExerciseType,
  TrainingMode,
  SightReadingExercise,
  SightReadingNote,
} from '../../core/sightReadingEngine';
import {
  SightReadingMetricsTracker,
  generateSingleNoteExercise,
  generateIntervalExercise,
  generateSequenceExercise,
  generateChordExercise,
  generateLedgerExercise,
  getFormattedNoteName,
  getNotePool,
} from '../../core/sightReadingEngine';
import { SightReadingStaffCanvas } from './SightReadingStaffCanvas';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { TimbreSelector } from '../audio/TimbreSelector';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { soundEngine } from '../../core/soundEngine';
import { sustainPedalStore } from '../../core/sustainPedalStore';
import { useActiveNotes } from '../../hooks/useActiveNotes';
import { midiManager, type MidiDevice } from '../../core/midiManager';
import {
  Trophy,
  Flame,
  Clock,
  Target,
  Sparkles,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BarChart2,
  Footprints,
} from 'lucide-react';

export const SightReadingView: React.FC = () => {
  // ── Configurações do Exercício ─────────────────────────────────────────────
  const [clef, setClef] = useState<ClefType>('treble');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('single');
  const [accidentalMode, setAccidentalMode] = useState<AccidentalMode>('natural');
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('free');

  // Toggles de Auxílio Pedagógico
  const [showNoteHints, setShowNoteHints] = useState<boolean>(true);
  const [showStaffPositionHints, setShowStaffPositionHints] = useState<boolean>(false);
  const [showWeakNotesModal, setShowWeakNotesModal] = useState<boolean>(false);
  const [onlyWeakNotesMode, setOnlyWeakNotesMode] = useState<boolean>(false);

  // ── Estado do Exercício Atual ──────────────────────────────────────────────
  const [exercise, setExercise] = useState<SightReadingExercise>(() =>
    generateSingleNoteExercise('treble', 'natural')
  );
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Toque a nota indicada na pauta...');
  const [lastWrongMidi, setLastWrongMidi] = useState<number | null>(null);

  // ── Métricas de Performance ────────────────────────────────────────────────
  const metricsTracker = useRef<SightReadingMetricsTracker>(new SightReadingMetricsTracker());
  const [metrics, setMetrics] = useState(metricsTracker.current.getMetrics());
  const noteStartTimeRef = useRef<number>(Date.now());

  // ── Modo Desafio (Speed Run 60s) ───────────────────────────────────────────
  const [challengeTimeLeft, setChallengeTimeLeft] = useState<number>(60);
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);
  const [challengeFinished, setChallengeFinished] = useState<boolean>(false);

  // ── Entradas de Áudio (Microfone / MIDI / Teclado) ─────────────────────────
  const [micActiveMidi, setMicActiveMidi] = useState<number | null>(null);
  const [micAcousticNotes, setMicAcousticNotes] = useState<number[]>([]);
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);

  useEffect(() => {
    const unsubscribe = midiManager.subscribeDevices((devices) => {
      setMidiDevices(devices);
    });
    return unsubscribe;
  }, []);

  const { activeNotes: activeExternalNotes } = useActiveNotes({
    micHearingMidi: micActiveMidi,
    micAcousticNotes,
  });

  const isSustainActive = useSyncExternalStore(sustainPedalStore.subscribe, sustainPedalStore.getSnapshot);

  // ── Gerador do Próximo Exercício ───────────────────────────────────────────
  const nextExercise = useCallback(
    (customPool?: SightReadingNote[]) => {
      let nextEx: SightReadingExercise;
      const lastMidi = exercise.notes[0]?.midi;

      switch (exerciseType) {
        case 'single':
          nextEx = generateSingleNoteExercise(clef, accidentalMode, lastMidi, customPool);
          break;
        case 'intervals':
          nextEx = generateIntervalExercise(clef, accidentalMode);
          break;
        case 'sequences':
          nextEx = generateSequenceExercise(clef);
          break;
        case 'chords':
          nextEx = generateChordExercise(clef);
          break;
        case 'ledger':
          nextEx = generateLedgerExercise(clef, accidentalMode);
          break;
        default:
          nextEx = generateSingleNoteExercise(clef, accidentalMode, lastMidi, customPool);
      }

      setExercise(nextEx);
      setActiveNoteIndex(0);
      setFeedbackState('idle');
      setLastWrongMidi(null);
      setFeedbackMessage('Toque a nota indicada na pauta...');
      noteStartTimeRef.current = Date.now();
    },
    [clef, exerciseType, accidentalMode, exercise]
  );

  // Atualiza exercício ao alterar filtros
  useEffect(() => {
    nextExercise();
  }, [clef, exerciseType, accidentalMode]);

  // ── Cronômetro do Modo Desafio ─────────────────────────────────────────────
  useEffect(() => {
    if (trainingMode !== 'challenge' || !isChallengeActive || challengeFinished) return;

    const timer = setInterval(() => {
      setChallengeTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsChallengeActive(false);
          setChallengeFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [trainingMode, isChallengeActive, challengeFinished]);

  const startChallenge = () => {
    metricsTracker.current.reset();
    setMetrics(metricsTracker.current.getMetrics());
    setChallengeTimeLeft(60);
    setIsChallengeActive(true);
    setChallengeFinished(false);
    nextExercise();
  };

  // ── Validação e Processamento de Toques (MIDI, Virtual, Mic) ───────────────
  const handleNoteTriggered = useCallback(
    (playedMidi: number) => {
      if (feedbackState === 'correct') return; // Evita double-trigger durante transição

      // Toca o áudio Hi-Fi imediatamente
      soundEngine.startPianoNote(playedMidi, 0.85);
      setTimeout(() => soundEngine.stopPianoNote(playedMidi), 400);

      const targetNote = exercise.notes[activeNoteIndex];
      if (!targetNote) return;

      const reactionTime = Math.max(100, Date.now() - noteStartTimeRef.current);
      const isExactMatch = playedMidi === targetNote.midi;

      // Verifica se acertou a classe de tom mas errou a oitava (Dica Pedagógica Avançada)
      const pitchClassTarget = targetNote.midi % 12;
      const pitchClassPlayed = playedMidi % 12;
      const isOctaveError = pitchClassTarget === pitchClassPlayed && !isExactMatch;

      if (isExactMatch) {
        // Acerto Confirmado!
        metricsTracker.current.recordAttempt(targetNote, true, reactionTime);
        setMetrics(metricsTracker.current.getMetrics());
        setFeedbackState('correct');
        setLastWrongMidi(null);

        const { portuguese } = getFormattedNoteName(targetNote.midi, targetNote.accidental);
        setFeedbackMessage(`✨ Perfeito! ${portuguese} em ${reactionTime}ms`);

        // Avança para a próxima nota (se sequência ou acorde) ou próximo exercício
        const isSequenceOrChord = exercise.type === 'sequences' || exercise.type === 'chords';
        const hasMoreNotes = isSequenceOrChord && activeNoteIndex + 1 < exercise.notes.length;

        setTimeout(() => {
          if (hasMoreNotes) {
            setActiveNoteIndex((idx) => idx + 1);
            setFeedbackState('idle');
            noteStartTimeRef.current = Date.now();
          } else {
            nextExercise();
          }
        }, 180);
      } else {
        // Erro Registrado
        metricsTracker.current.recordAttempt(targetNote, false, reactionTime);
        setMetrics(metricsTracker.current.getMetrics());
        setFeedbackState('wrong');
        setLastWrongMidi(playedMidi);

        const expectedInfo = getFormattedNoteName(targetNote.midi, targetNote.accidental);
        const playedInfo = getFormattedNoteName(playedMidi);

        if (isOctaveError) {
          const isHigher = playedMidi > targetNote.midi;
          setFeedbackMessage(
            `⚠️ Nota correta (${playedInfo.portuguese}), mas na oitava errada! Toque mais ${isHigher ? 'grave (à esquerda)' : 'agudo (à direita)'}.`
          );
        } else {
          setFeedbackMessage(`❌ Você tocou ${playedInfo.portuguese}. O correto é ${expectedInfo.portuguese}!`);
        }

        // Remove feedback de erro após breve momento
        setTimeout(() => {
          setFeedbackState('idle');
        }, 800);
      }
    },
    [exercise, activeNoteIndex, feedbackState, nextExercise]
  );

  // Monitora alterações em notas ativas externas (MIDI USB)
  const prevActiveRef = useRef<number[]>([]);
  useEffect(() => {
    const newlyPressed = activeExternalNotes.filter((m) => !prevActiveRef.current.includes(m));
    if (newlyPressed.length > 0) {
      handleNoteTriggered(newlyPressed[0]);
    }
    prevActiveRef.current = [...activeExternalNotes];
  }, [activeExternalNotes, handleNoteTriggered]);

  // Teclas iluminadas para o teclado virtual
  const currentTargetNote = exercise.notes[activeNoteIndex];
  const highlightedKeys = useMemo(() => {
    const list: { midi: number; color?: string; degreeName?: string }[] = [];

    // Se as dicas estiverem ativas ou houve erro recente, orienta o aluno
    if ((showNoteHints || feedbackState === 'wrong') && currentTargetNote) {
      list.push({
        midi: currentTargetNote.midi,
        color: feedbackState === 'wrong' ? '#ef4444' : '#6366f1',
        degreeName: currentTargetNote.pitchLetter,
      });
    }

    if (lastWrongMidi !== null) {
      list.push({
        midi: lastWrongMidi,
        color: '#dc2626',
        degreeName: '✗',
      });
    }

    return list;
  }, [showNoteHints, feedbackState, currentTargetNote, lastWrongMidi]);

  // Oitava inicial do teclado baseada na clave selecionada
  const startOctave = useMemo(() => {
    if (clef === 'bass') return 1;
    if (clef === 'treble') return 3;
    return 2; // Grand staff
  }, [clef]);

  const weakestNotes = useMemo(() => metricsTracker.current.getWeakestNotes(6), [metrics]);

  return (
    <div className="flex-1 flex flex-col gap-3 w-full max-w-none pb-6">
      {/* ── PAINEL SUPERIOR: FILTROS & CONFIGURAÇÃO DO EXERCÍCIO ────────────── */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl space-y-3">
        {/* Linha 1: Título da Tela e Alternador de Modo Livre vs Desafio */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                Treino de Leitura de Partitura
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                  Claves de Sol &amp; Fá
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Fixação visual de pauta, notas diatônicas, acidentes, intervalos e fluência melódica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TimbreSelector compact />

            {/* Alternador Modo Livre vs Desafio */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setTrainingMode('free');
                  setIsChallengeActive(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  trainingMode === 'free'
                    ? 'bg-indigo-600 text-white shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modo Livre</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrainingMode('challenge');
                  if (!isChallengeActive) startChallenge();
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  trainingMode === 'challenge'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Speed Run (60s)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Linha 2: Seletor de Clave, Tipo de Exercício e Acidentes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Seletor de Claves */}
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              1. Seleção de Clave
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setClef('treble')}
                className={`py-2 px-1 rounded-lg border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                  clef === 'treble'
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-base font-serif">𝄞</span>
                <span className="text-[11px]">Clave de Sol</span>
                <span className="text-[9px] opacity-60">Mão Direita</span>
              </button>

              <button
                type="button"
                onClick={() => setClef('bass')}
                className={`py-2 px-1 rounded-lg border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                  clef === 'bass'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-base font-serif">𝄢</span>
                <span className="text-[11px]">Clave de Fá</span>
                <span className="text-[9px] opacity-60">Mão Esquerda</span>
              </button>

              <button
                type="button"
                onClick={() => setClef('grand')}
                className={`py-2 px-1 rounded-lg border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                  clef === 'grand'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-base font-serif">𝄞+𝄢</span>
                <span className="text-[11px]">Pauta Dupla</span>
                <span className="text-[9px] opacity-60">Ambas as Mãos</span>
              </button>
            </div>
          </div>

          {/* Seletor de Tipo de Exercício */}
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              2. Módulo de Fixação
            </span>
            <div className="flex flex-wrap gap-1 text-xs">
              {[
                { id: 'single', label: 'Nota Única', short: 'Flashcard' },
                { id: 'intervals', label: 'Intervalos', short: '2ª a 8ª' },
                { id: 'sequences', label: 'Sequências', short: 'Fluência' },
                { id: 'chords', label: 'Acordes', short: 'Harmonia' },
                { id: 'ledger', label: 'Linhas Supl.', short: 'Extremos' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setExerciseType(m.id as ExerciseType)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center min-w-[75px] ${
                    exerciseType === m.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="leading-tight">{m.label}</div>
                  <div className="text-[9px] font-mono opacity-60 font-normal">{m.short}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Acidentes e Toggles de Dica */}
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                3. Acidentes &amp; Alterações
              </span>
              <div className="grid grid-cols-4 gap-1 mt-1 text-xs font-bold">
                {[
                  { id: 'natural', label: 'Naturais' },
                  { id: 'sharps', label: 'Sust. (♯)' },
                  { id: 'flats', label: 'Bemóis (♭)' },
                  { id: 'all', label: 'Todos' },
                ].map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setAccidentalMode(acc.id as AccidentalMode)}
                    className={`py-1 rounded-lg border text-center transition-all cursor-pointer ${
                      accidentalMode === acc.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dicas Pedagógicas */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showNoteHints}
                    onChange={(e) => setShowNoteHints(e.target.checked)}
                    className="rounded text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dicas</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-400 hover:text-slate-300 cursor-pointer select-none text-[10px]">
                  <input
                    type="checkbox"
                    checked={showStaffPositionHints}
                    onChange={(e) => setShowStaffPositionHints(e.target.checked)}
                    className="rounded text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Linha/Espaço</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => nextExercise()}
                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Pular nota e gerar próximo exercício"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Pular</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAINEL CENTRAL: PALCO DE LEITURA (PAUTA GRÁFICA) ────────────────── */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl relative flex flex-col gap-3">
        {/* Top Header do Palco: Título do Exercício e Timer (se Desafio) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-wider uppercase text-amber-400 font-mono">
              {exercise.title}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-300">{exercise.description}</span>
            {onlyWeakNotesMode && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <span>Foco em Notas Fracas</span>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyWeakNotesMode(false);
                    nextExercise();
                  }}
                  className="hover:text-white underline cursor-pointer ml-1"
                >
                  (Restaurar todas)
                </button>
              </span>
            )}
          </div>

          {/* Cronômetro do Modo Desafio */}
          {trainingMode === 'challenge' && (
            <div className="flex items-center gap-3 bg-black/60 px-3 py-1 rounded-xl border border-amber-500/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-base font-black text-amber-300">{challengeTimeLeft}s</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {metrics.correctHits} acertos
              </span>
            </div>
          )}
        </div>

        {/* Palco do Canvas Retina */}
        <SightReadingStaffCanvas
          exercise={exercise}
          activeNoteIndex={activeNoteIndex}
          feedbackState={feedbackState}
          showNoteHints={showNoteHints}
          showStaffPositionHints={showStaffPositionHints}
        />

        {/* Faixa de Feedback Imediato */}
        <div
          className={`flex items-center justify-between p-2.5 px-4 rounded-xl border transition-all ${
            feedbackState === 'correct'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : feedbackState === 'wrong'
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-black/40 border-white/5 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            {feedbackState === 'correct' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : feedbackState === 'wrong' ? (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
            )}
            <span>{feedbackMessage}</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
            {currentTargetNote && (
              <span>
                Alvo: <strong className="text-white">{currentTargetNote.staffPosition.description}</strong>
              </span>
            )}
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-400">
              Entrada: MIDI USB • Teclado da Tela • Microfone
            </span>
          </div>
        </div>
      </div>

      {/* ── PAINEL INFERIOR: TECLADO INTERATIVO & MÉTRICAS ─────────────────── */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl space-y-4">
        {/* Barra de Métricas da Sessão */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Precisão</span>
              <div className="text-lg font-black font-display text-emerald-400">{metrics.accuracyPercent}%</div>
            </div>
            <Target className="w-5 h-5 text-emerald-500/40" />
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Tempo Médio</span>
              <div className="text-lg font-black font-display text-cyan-400">
                {metrics.averageReactionTimeMs > 0 ? `${(metrics.averageReactionTimeMs / 1000).toFixed(2)}s` : '0.0s'}
              </div>
            </div>
            <Clock className="w-5 h-5 text-cyan-500/40" />
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Streak Atual</span>
              <div className="text-lg font-black font-display text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                {metrics.currentStreak}
                <span className="text-[10px] text-slate-400 font-normal"> (Rec: {metrics.bestStreak})</span>
              </div>
            </div>
            <Flame className="w-5 h-5 text-orange-500/40" />
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Diagnóstico</span>
              <button
                type="button"
                onClick={() => setShowWeakNotesModal(true)}
                className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors mt-0.5"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Notas Fracas ({weakestNotes.length})</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                metricsTracker.current.reset();
                setMetrics(metricsTracker.current.getMetrics());
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zerar estatísticas da sessão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Barra de Entrada de Microfone / Cabo / Teclado Real */}
        <MicrophonePitchBar
          onNoteHold={(midi) => {
            if (midi !== null) handleNoteTriggered(midi);
            setMicActiveMidi(midi);
          }}
          onAcousticChordNotesChange={setMicAcousticNotes}
          expectedMidi={currentTargetNote?.midi}
          expectedNoteName={currentTargetNote ? getFormattedNoteName(currentTargetNote.midi).english : undefined}
          customLabel="Ouvir Piano Real / Microfone para Leitura de Partitura"
        />

        {/* Barra de Ações Rápidas: Pedal de Sustain */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => sustainPedalStore.toggleSustain()}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                isSustainActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-amber-500/25 font-black ring-1 ring-amber-300'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
              }`}
              title="Ativar/Desativar Pedal de Sustain (Atalho: segure ou dê toque na Barra de Espaço)"
            >
              <Footprints className={`w-4 h-4 ${isSustainActive ? 'text-slate-950 animate-bounce' : 'text-amber-400'}`} />
              <span>{isSustainActive ? 'Pedal Sustain: LIGADO' : 'Ativar Pedal Sustain'}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${isSustainActive ? 'bg-black/30 text-slate-950' : 'bg-white/10 text-amber-300'}`}>
                Espaço
              </span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Toque no teclado virtual abaixo ou conecte seu teclado USB/MIDI para resposta instantânea.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                midiDevices.length > 0 ? 'bg-emerald-400 shadow-emerald-400/50 shadow-sm' : 'bg-slate-600'
              }`}
            />
            <span>
              {midiDevices.length > 0
                ? `${midiDevices.length} teclado(s) MIDI conectado(s)`
                : 'Aguardando teclado MIDI USB'}
            </span>
          </div>
        </div>

        {/* Teclado Virtual Interativo */}
        <PianoKeyboard
          startOctave={startOctave}
          allowOctaveControls={true}
          highlightedKeys={highlightedKeys}
          activeExternalNotes={activeExternalNotes}
          onKeyPlay={(midi) => handleNoteTriggered(midi)}
        />
      </div>

      {/* ── MODAL DE NOTAS FRACAS / MAPA DE CALOR ───────────────────────────── */}
      {showWeakNotesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-5 border border-white/15 max-w-lg w-full space-y-4 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Mapa de Calor: Notas Fracas</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWeakNotesModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Identificação inteligente das notas com maior taxa de erro ou hesitação nesta sessão:
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {weakestNotes.length === 0 ? (
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-slate-400">
                  Nenhuma hesitação ou erro registrado até o momento! Continue praticando.
                </div>
              ) : (
                weakestNotes.map((stat) => (
                  <div
                    key={stat.noteKey}
                    className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{stat.noteNamePt}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 font-mono">
                          MIDI {stat.midi}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tentativas: {stat.attempts} • Erros: {stat.errors} • Tempo Médio: {(stat.avgReactionMs / 1000).toFixed(2)}s
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {Math.round(stat.errorRate * 100)}% erro
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              {weakestNotes.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    const weakMidis = weakestNotes.map((n) => n.midi);
                    const pool = getNotePool(clef, accidentalMode, true).filter((n) => weakMidis.includes(n.midi));
                    setOnlyWeakNotesMode(true);
                    setShowWeakNotesModal(false);
                    nextExercise(pool.length > 0 ? pool : undefined);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Praticar Apenas Fracas ({weakestNotes.length})</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setShowWeakNotesModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE CONCLUSÃO DO DESAFIO (SPEED RUN) ───────────────────────── */}
      {challengeFinished && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-amber-500/30 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white">Desafio de 60s Concluído!</h3>
            <p className="text-xs text-slate-300">
              Confira seu rendimento na leitura rápida de partitura:
            </p>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Acertos</span>
                <div className="text-2xl font-black text-emerald-400">{metrics.correctHits}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Precisão</span>
                <div className="text-2xl font-black text-indigo-400">{metrics.accuracyPercent}%</div>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Tempo Médio</span>
                <div className="text-2xl font-black text-cyan-400">
                  {metrics.averageReactionTimeMs > 0 ? `${(metrics.averageReactionTimeMs / 1000).toFixed(2)}s` : '0s'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Maior Streak</span>
                <div className="text-2xl font-black text-orange-400">{metrics.bestStreak} 🔥</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => startChallenge()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
              >
                Jogar Novamente
              </button>
              <button
                type="button"
                onClick={() => {
                  setChallengeFinished(false);
                  setTrainingMode('free');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Modo Livre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
