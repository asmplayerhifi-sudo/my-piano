/**
 * scrolling/useScorePlayback.ts
 * Hook de controle de estado, loop de áudio e avaliação rítmica de acertos.
 * Regra: Hook puro de lógica (< 140 linhas).
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import type { ScoreNote } from '../../../core/coursesData';
import { EvaluateRhythmStrikeUseCase } from '../../../application/use-cases/EvaluateRhythmStrikeUseCase';
import type { ChordSpan } from './types';

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
  onLessonComplete?: () => void;
  currentMidiPressed?: number | { midi: number } | null;
  currentNoteIndex?: number;
  timeline: PlaybackTimeline;
  pixelsPerBeat: number;
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
  onLessonComplete,
  currentMidiPressed,
  currentNoteIndex,
  timeline,
  pixelsPerBeat,
}: UseScorePlaybackProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;
  const [tempo, setTempo] = useState<number>(bpm);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);

  const scrollOffsetRef = useRef<number>(0);
  const isPausedWaitingRef = useRef<boolean>(false);
  const playedNotesRef = useRef<Set<number>>(new Set());
  const playedBeatsRef = useRef<Set<number>>(new Set());
  const evaluateStrikeUseCase = useRef(new EvaluateRhythmStrikeUseCase()).current;

  const handlePlayToggle = () => {
    const next = !isPlaying;
    setInternalIsPlaying(next);
    onPlayPauseToggle?.(next);
  };

  const handleTempoChange = (val: number) => {
    const clamped = Math.max(30, Math.min(220, val));
    setTempo(clamped);
    onTempoChange?.(clamped);
  };

  const handleRestart = () => {
    scrollOffsetRef.current = 0;
    setCurrentIndex(0);
    playedNotesRef.current.clear();
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
      onNoteHit?.(note, diffMs);
    }

    isPausedWaitingRef.current = false;
    setCurrentIndex(noteIndex + 1);
    if (noteIndex + 1 >= notes.length) onLessonComplete?.();
  }, [notes, isDemoMode, tempo, toleranceMs, evaluateStrikeUseCase, onNoteHit, onLessonComplete]);

  useEffect(() => {
    if (currentNoteIndex !== undefined) setCurrentIndex(currentNoteIndex);
  }, [currentNoteIndex]);

  useEffect(() => {
    if (isDemoMode || currentMidiPressed === null || currentMidiPressed === undefined) return;
    const rawMidi = typeof currentMidiPressed === 'number' ? currentMidiPressed : currentMidiPressed.midi;
    const targetNote = notes[currentIndex];
    if (targetNote && targetNote.midi === rawMidi) {
      const noteOffset = timeline.noteOffsets[currentIndex] ?? 0;
      const currentBeat = scrollOffsetRef.current / pixelsPerBeat;
      const diffMs = (currentBeat - noteOffset) * ((60 / tempo) * 1000);
      processStrike(diffMs, currentIndex);
    }
  }, [currentMidiPressed, currentIndex, notes, timeline, tempo, isDemoMode, processStrike, pixelsPerBeat]);

  return {
    isPlaying,
    tempo,
    currentIndex,
    setCurrentIndex,
    score,
    feedback,
    scrollOffsetRef,
    isPausedWaitingRef,
    playedNotesRef,
    playedBeatsRef,
    handlePlayToggle,
    handleTempoChange,
    handleRestart,
    processStrike,
  };
}
