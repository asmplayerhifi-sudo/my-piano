/**
 * scrolling/useScorePlayback.ts
 * Hook de controle de estado, loop de áudio e avaliação rítmica de acertos.
 * Regra: Hook puro de lógica (< 140 linhas).
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import type { ScoreNote } from '../../../core/coursesData';
import { getNoteInfo } from '../../../core/musicTheory';
import { soundEngine } from '../../../core/soundEngine';
import { EvaluateRhythmStrikeUseCase } from '../../../application/use-cases/EvaluateRhythmStrikeUseCase';
import type { ChordSpan, ScoreErrorEvent } from './types';

interface PlaybackTimeline {
  noteOffsets: number[];
  chordSpans: ChordSpan[];
  totalBeats: number;
}

interface UseScorePlaybackProps {
  notes: ScoreNote[];
  bpm: number;
  toleranceMs: number;
  isDemoMode: boolean;
  controlledIsPlaying?: boolean;
  onPlayPauseToggle?: (playing: boolean) => void;
  onTempoChange?: (tempo: number) => void;
  onNoteHit?: (note: ScoreNote, diffMs: number) => void;
  onNoteError?: (error: ScoreErrorEvent) => void;
  onTargetNoteChange?: (note: ScoreNote | null, index: number) => void;
  onLessonComplete?: () => void;
  currentMidiPressed?: number | { midi: number } | null;
  currentNoteIndex?: number;
  timeline: PlaybackTimeline;
  pixelsPerBeat: number;
  instrument?: 'piano' | 'guitar';
}

export function useScorePlayback({
  notes,
  bpm,
  toleranceMs,
  isDemoMode,
  controlledIsPlaying,
  onPlayPauseToggle,
  onTempoChange,
  onNoteHit,
  onNoteError,
  onTargetNoteChange,
  onLessonComplete,
  currentMidiPressed,
  currentNoteIndex,
  timeline,
  pixelsPerBeat,
  instrument = 'piano',
}: UseScorePlaybackProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;
  const [tempo, setTempo] = useState<number>(bpm);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [lastError, setLastError] = useState<ScoreErrorEvent | null>(null);

  const scrollOffsetRef = useRef<number>(0);
  const isPausedWaitingRef = useRef<boolean>(false);
  const playedNotesRef = useRef<Set<number>>(new Set());
  const playedChordsRef = useRef<Set<number>>(new Set());
  const playedBeatsRef = useRef<Set<number>>(new Set());
  const evaluateStrikeUseCase = useRef(new EvaluateRhythmStrikeUseCase()).current;

  // Refs para manter callbacks estáveis e blindados contra loops infinitos de renderização (React Error #185)
  const onTargetNoteChangeRef = useRef(onTargetNoteChange);
  onTargetNoteChangeRef.current = onTargetNoteChange;

  const onNoteHitRef = useRef(onNoteHit);
  onNoteHitRef.current = onNoteHit;

  const onNoteErrorRef = useRef(onNoteError);
  onNoteErrorRef.current = onNoteError;

  const onLessonCompleteRef = useRef(onLessonComplete);
  onLessonCompleteRef.current = onLessonComplete;

  const onPlayPauseToggleRef = useRef(onPlayPauseToggle);
  onPlayPauseToggleRef.current = onPlayPauseToggle;

  const onTempoChangeRef = useRef(onTempoChange);
  onTempoChangeRef.current = onTempoChange;

  // Notifica o componente pai sobre a nota alvo atual da partitura APENAS quando o alvo realmente mudar
  const lastTargetMidiRef = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    const target = notes[currentIndex] || null;
    const targetMidi = target ? target.midi : null;
    if (lastTargetMidiRef.current !== targetMidi) {
      lastTargetMidiRef.current = targetMidi;
      onTargetNoteChangeRef.current?.(target, currentIndex);
    }
  }, [currentIndex, notes]);

  // Limpa o estado visual de erro após 1.4s de inatividade
  useEffect(() => {
    if (!lastError) return;
    const timer = setTimeout(() => {
      setLastError(null);
    }, 1400);
    return () => clearTimeout(timer);
  }, [lastError]);

  const handlePlayToggle = () => {
    const next = !isPlaying;
    setInternalIsPlaying(next);
    onPlayPauseToggleRef.current?.(next);
  };

  const handleTempoChange = (val: number) => {
    const clamped = Math.max(30, Math.min(220, val));
    setTempo(clamped);
    onTempoChangeRef.current?.(clamped);
  };

  const handleRestart = () => {
    scrollOffsetRef.current = 0;
    setCurrentIndex(0);
    setLastError(null);
    lastTargetMidiRef.current = undefined;
    playedNotesRef.current.clear();
    playedChordsRef.current.clear();
    playedBeatsRef.current.clear();
    isPausedWaitingRef.current = false;
  };

  const processStrike = useCallback((diffMs: number, noteIndex: number) => {
    const note = notes[noteIndex];
    if (!note) return;

    if (!isDemoMode) {
      const evaluation = evaluateStrikeUseCase.execute({
        expectedTimeMs: 0,
        actualTimeMs: diffMs,
        currentBpm: tempo,
        goodWindowMs: toleranceMs,
      });

      const colorMap = {
        PERFECT: 'text-emerald-400',
        GOOD: 'text-cyan-400',
        OFF_TIME: 'text-amber-400',
        MISSED: 'text-rose-400',
      };
      setFeedback({ text: `${evaluation.grade}! (±${Math.round(Math.abs(diffMs))}ms)`, color: colorMap[evaluation.grade] });
      setScore(s => s + evaluation.scorePoints);
      onNoteHitRef.current?.(note, diffMs);
    }

    setLastError(null);
    isPausedWaitingRef.current = false;
    setCurrentIndex(noteIndex + 1);
    if (noteIndex + 1 >= notes.length) onLessonCompleteRef.current?.();
  }, [notes, isDemoMode, tempo, toleranceMs, evaluateStrikeUseCase]);

  useEffect(() => {
    if (currentNoteIndex !== undefined) setCurrentIndex(currentNoteIndex);
  }, [currentNoteIndex]);

  useEffect(() => {
    if (isDemoMode || currentMidiPressed === null || currentMidiPressed === undefined) return;
    const rawMidi = typeof currentMidiPressed === 'number' ? currentMidiPressed : currentMidiPressed.midi;
    const targetNote = notes[currentIndex];
    if (!targetNote) return;

    // Se for toque rítmico genérico (-1) ou a nota correta
    if (rawMidi === -1 || targetNote.midi === rawMidi) {
      setLastError(null);
      const noteOffset = timeline.noteOffsets[currentIndex] ?? 0;
      const currentBeat = scrollOffsetRef.current / pixelsPerBeat;
      const diffMs = (currentBeat - noteOffset) * ((60 / tempo) * 1000);
      processStrike(diffMs, currentIndex);

      // Emite o som da nota acertada
      if (instrument === 'guitar') {
        soundEngine.playGuitarPluck(targetNote.midi, 1.2);
      } else {
        soundEngine.playPianoNote(targetNote.midi, 1.2);
      }
    } else {
      // ✕ Nota tocada incorreta: registra o erro, marca em vermelho e notifica
      const err: ScoreErrorEvent = {
        playedMidi: rawMidi,
        expectedMidi: targetNote.midi,
        timestamp: performance.now(),
      };
      setLastError(err);
      const playedInfo = getNoteInfo(rawMidi);
      const targetInfo = getNoteInfo(targetNote.midi);
      setFeedback({
        text: `✕ NOTA ERRADA: Tocou ${playedInfo.name}${playedInfo.octave} (Esperada: ${targetInfo.name}${targetInfo.octave})`,
        color: 'text-rose-400',
      });
      onNoteErrorRef.current?.(err);
    }
  }, [currentMidiPressed, currentIndex, notes, timeline, tempo, isDemoMode, processStrike, pixelsPerBeat, instrument]);

  return {
    isPlaying,
    tempo,
    currentIndex,
    setCurrentIndex,
    score,
    feedback,
    lastError,
    scrollOffsetRef,
    isPausedWaitingRef,
    playedNotesRef,
    playedChordsRef,
    playedBeatsRef,
    handlePlayToggle,
    handleTempoChange,
    handleRestart,
    processStrike,
  };
}
