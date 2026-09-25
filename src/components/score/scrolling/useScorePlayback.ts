/**
 * scrolling/useScorePlayback.ts
 * Hook de controle de estado, loop de áudio e avaliação rítmica de acertos.
 * Regra: Hook puro de lógica (< 140 linhas).
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { getNoteInfo, parseChord, CHROMATIC_NOTES_SHARP, CHROMATIC_NOTES_FLAT } from '../../../core/musicTheory';
import { soundEngine } from '../../../core/soundEngine';
import { NoteConfirmationValidator } from '../../../core/noteConfirmationValidator';
import { EvaluateRhythmStrikeUseCase } from '../../../application/use-cases/EvaluateRhythmStrikeUseCase';
import type { ScoreNote } from '../../../core/coursesData';
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

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const validatorRef = useRef(new NoteConfirmationValidator());

  // Adapta parâmetros da janela de confirmação conforme o andamento e o instrumento
  useEffect(() => {
    validatorRef.current.adaptToTempoAndInstrument(tempo, instrument);
  }, [tempo, instrument]);

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
    validatorRef.current.reset();
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

    const nextNote = notes[currentIndex + 1] || null;
    const now = performance.now();

    // Verifica se a nota tocada é compatível com o acorde da nota atual
    let isChordNoteMatch = false;
    if (targetNote.chordName) {
      const parsedChord = parseChord(targetNote.chordName);
      if (parsedChord) {
        const rawPitchClass = ((rawMidi % 12) + 12) % 12;
        isChordNoteMatch = parsedChord.notes.some(n => {
          const idx = CHROMATIC_NOTES_SHARP.indexOf(n);
          return (idx !== -1 ? idx : CHROMATIC_NOTES_FLAT.indexOf(n)) === rawPitchClass;
        });
      }
    }

    // 1. Acerto Imediato (Zero Latência): Toque rítmico genérico (-1), nota correta ou nota do acorde
    if (rawMidi === -1 || targetNote.midi === rawMidi || isChordNoteMatch) {
      validatorRef.current.onNoteCompleted(targetNote.midi, now);
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
      return;
    }

    // Verifica compatibilidade com acorde da próxima nota
    let isNextChordNoteMatch = false;
    if (nextNote?.chordName) {
      const parsedNext = parseChord(nextNote.chordName);
      if (parsedNext) {
        const rawPitchClass = ((rawMidi % 12) + 12) % 12;
        isNextChordNoteMatch = parsedNext.notes.some(n => {
          const idx = CHROMATIC_NOTES_SHARP.indexOf(n);
          return (idx !== -1 ? idx : CHROMATIC_NOTES_FLAT.indexOf(n)) === rawPitchClass;
        });
      }
    }

    // 2. Transição Antecipada: Usuário tocou a próxima nota da partitura ou nota do próximo acorde
    if (nextNote && (nextNote.midi === rawMidi || isNextChordNoteMatch)) {
      validatorRef.current.onNoteCompleted(nextNote.midi, now);
      setLastError(null);
      const nextIdx = currentIndex + 1;
      const noteOffset = timeline.noteOffsets[nextIdx] ?? 0;
      const currentBeat = scrollOffsetRef.current / pixelsPerBeat;
      const diffMs = (currentBeat - noteOffset) * ((60 / tempo) * 1000);
      processStrike(diffMs, nextIdx);

      if (instrument === 'guitar') {
        soundEngine.playGuitarPluck(nextNote.midi, 1.2);
      } else {
        soundEngine.playPianoNote(nextNote.midi, 1.2);
      }
      return;
    }

    // 3. Tolerância de Sustain: Decaimento acústico da nota anterior ainda ressoando
    if (validatorRef.current.isPreviousSustain(rawMidi, now)) {
      // Ignora silenciosamente resíduo acústico da nota anterior
      return;
    }

    // 4. Janela de Confirmação de Erro (Anti-Falsos Erros):
    // Não classifica prematuramente como erro durante transições ou ruídos.
    // Agenda janela de estabilização; se a nota correta for executada antes do estouro, cancela o erro.
    const candidateMidi = rawMidi;
    const expectedMidi = targetNote.midi;

    validatorRef.current.schedulePendingError(candidateMidi, expectedMidi, (errPayload) => {
      // Confirma o erro apenas se o alvo atual ainda for o mesmo (não acertou nem avançou no intervalo)
      const currentTarget = notes[currentIndexRef.current];
      if (currentTarget && currentTarget.midi === errPayload.expectedMidi) {
        const err: ScoreErrorEvent = {
          playedMidi: errPayload.playedMidi,
          expectedMidi: errPayload.expectedMidi,
          timestamp: errPayload.timestamp,
        };
        setLastError(err);
        const playedInfo = getNoteInfo(errPayload.playedMidi);
        const targetInfo = getNoteInfo(errPayload.expectedMidi);
        setFeedback({
          text: `✕ NOTA ERRADA: Tocou ${playedInfo.name}${playedInfo.octave} (Esperada: ${targetInfo.name}${targetInfo.octave})`,
          color: 'text-rose-400',
        });
        onNoteErrorRef.current?.(err);
      }
    });
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
