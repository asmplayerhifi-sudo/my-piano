/**
 * scrolling/useScorePlayback.ts
 * Hook de controle de estado, loop de áudio e avaliação rítmica de acertos.
 * Regra: Hook puro de lógica (< 140 linhas).
 */

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { getNoteInfo, parseChord, CHROMATIC_NOTES_SHARP, CHROMATIC_NOTES_FLAT } from '../../../core/musicTheory';
import { soundEngine } from '../../../core/soundEngine';
import { NoteConfirmationValidator } from '../../../core/noteConfirmationValidator';
import { EvaluateRhythmStrikeUseCase } from '../../../application/use-cases/EvaluateRhythmStrikeUseCase';
import type { ScoreNote } from '../../../core/coursesData';
import type { ChordSpan, ScoreErrorEvent, ScoreSustainMode, MidiInputNote } from './types';

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
  mode?: 'wait' | 'flow';
  controlledIsPlaying?: boolean;
  onPlayPauseToggle?: (playing: boolean) => void;
  onTempoChange?: (tempo: number) => void;
  onNoteHit?: (note: ScoreNote, diffMs: number) => void;
  onNoteError?: (error: ScoreErrorEvent) => void;
  onTargetNoteChange?: (note: ScoreNote | null, index: number) => void;
  onLessonComplete?: () => void;
  currentMidiPressed?: MidiInputNote;
  currentNoteIndex?: number;
  timeline: PlaybackTimeline;
  pixelsPerBeat: number;
  instrument?: 'piano' | 'guitar';
  sustainMode?: ScoreSustainMode;
  onStepChange?: (stepIndices: number[], satisfiedIndices: Set<number>) => void;
}

export function useScorePlayback({
  notes,
  bpm,
  toleranceMs,
  isDemoMode,
  mode = 'wait',
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
  sustainMode = 'off',
  onStepChange,
}: UseScorePlaybackProps) {
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;
  const [tempo, setTempo] = useState<number>(bpm);

  // Sincroniza andamento quando a prop bpm externa mudar (ex: troca de exercício)
  useEffect(() => {
    setTempo(bpm);
  }, [bpm]);
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
    if (target) {
      const noteOffset = timeline.noteOffsets[currentIndex] ?? 0;
      const expectedTimeMs = noteOffset * ((60 / tempo) * 1000);
      const expectedDurationMs = (target.duration || 1) * ((60 / tempo) * 1000);
      validatorRef.current.getEvaluator().setTarget({
        midi: target.midi,
        chordName: target.chordName,
        expectedTimeMs,
        expectedDurationMs,
      });
    } else {
      validatorRef.current.getEvaluator().setTarget(null);
    }

    if (lastTargetMidiRef.current !== targetMidi) {
      lastTargetMidiRef.current = targetMidi;
      onTargetNoteChangeRef.current?.(target, currentIndex);
    }
  }, [currentIndex, notes, timeline.noteOffsets, tempo]);

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

  const [satisfiedIndices, setSatisfiedIndices] = useState<Set<number>>(new Set());
  const satisfiedIndicesRef = useRef<Set<number>>(new Set());

  const currentStepIndices = useMemo(() => {
    if (!notes || notes.length === 0 || currentIndex >= notes.length) return [];
    const off = timeline.noteOffsets[currentIndex] ?? 0;
    const indices: number[] = [];
    for (let i = currentIndex; i < notes.length; i++) {
      const o = timeline.noteOffsets[i] ?? 0;
      if (Math.abs(o - off) < 0.05) {
        indices.push(i);
      } else {
        break;
      }
    }
    return indices.length > 0 ? indices : [currentIndex];
  }, [currentIndex, notes, timeline.noteOffsets]);

  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  useEffect(() => {
    onStepChangeRef.current?.(currentStepIndices, satisfiedIndices);
  }, [currentStepIndices, satisfiedIndices]);

  const prevIndexRef = useRef(currentIndex);
  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      satisfiedIndicesRef.current.clear();
      setSatisfiedIndices(new Set());
    }
  }, [currentIndex]);

  const playSoundForNote = useCallback(
    (targetNote: ScoreNote) => {
      const beatSec = 60 / tempo;
      const isNotesSustain = sustainMode === 'notes' || sustainMode === 'all';
      const targetDurSec = (targetNote.duration || 1) * beatSec;
      const targetSoundDuration = isNotesSustain
        ? Math.max(targetDurSec * 1.6, 2.5)
        : Math.max(0.18, targetDurSec * 0.85);

      if (instrument === 'guitar') {
        soundEngine.playGuitarPluck(targetNote.midi, targetSoundDuration, undefined, 0.8, isNotesSustain);
      } else {
        soundEngine.playPianoNote(targetNote.midi, targetSoundDuration, undefined, 0.8, isNotesSustain);
      }
    },
    [tempo, sustainMode, instrument]
  );

  const handleRestart = () => {
    scrollOffsetRef.current = 0;
    setCurrentIndex(0);
    setLastError(null);
    lastTargetMidiRef.current = undefined;
    playedNotesRef.current.clear();
    playedChordsRef.current.clear();
    playedBeatsRef.current.clear();
    satisfiedIndicesRef.current.clear();
    setSatisfiedIndices(new Set());
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
    if (currentNoteIndex !== undefined) {
      setCurrentIndex(currentNoteIndex);
      if (currentNoteIndex === 0) {
        scrollOffsetRef.current = 0;
        playedNotesRef.current.clear();
        playedChordsRef.current.clear();
        playedBeatsRef.current.clear();
        satisfiedIndicesRef.current.clear();
        setSatisfiedIndices(new Set());
        isPausedWaitingRef.current = false;
        validatorRef.current.reset();
      } else {
        const targetOffset = timeline.noteOffsets[currentNoteIndex] ?? 0;
        const targetScroll = targetOffset * pixelsPerBeat;
        const diff = Math.abs(scrollOffsetRef.current - targetScroll);
        if (diff > 8) {
          scrollOffsetRef.current = targetScroll;
        }
        for (let i = 0; i < currentNoteIndex; i++) {
          playedNotesRef.current.add(i);
        }
        for (let i = currentNoteIndex; i < notes.length; i++) {
          playedNotesRef.current.delete(i);
        }
      }
    }
  }, [currentNoteIndex, notes.length, pixelsPerBeat, timeline.noteOffsets]);

  useEffect(() => {
    if (isDemoMode || currentMidiPressed === null || currentMidiPressed === undefined) return;
    const playedMidis: number[] = [];
    let velocity = 80;
    let explicitChordName: string | undefined = undefined;

    if (typeof currentMidiPressed === 'number') {
      playedMidis.push(currentMidiPressed);
    } else if (Array.isArray(currentMidiPressed)) {
      playedMidis.push(...currentMidiPressed);
    } else if (typeof currentMidiPressed === 'object' && currentMidiPressed !== null) {
      if ('velocity' in currentMidiPressed && typeof (currentMidiPressed as { velocity?: number }).velocity === 'number') {
        velocity = (currentMidiPressed as { velocity?: number }).velocity ?? 80;
      }
      if ('chordName' in currentMidiPressed && typeof (currentMidiPressed as { chordName?: string }).chordName === 'string') {
        explicitChordName = (currentMidiPressed as { chordName?: string }).chordName;
      }
      if ('midis' in currentMidiPressed && Array.isArray((currentMidiPressed as { midis?: number[] }).midis)) {
        playedMidis.push(...((currentMidiPressed as { midis?: number[] }).midis ?? []));
      }
      if ('midi' in currentMidiPressed && typeof (currentMidiPressed as { midi?: number }).midi === 'number') {
        const m = (currentMidiPressed as { midi: number }).midi;
        if (!playedMidis.includes(m)) {
          playedMidis.push(m);
        }
      }
    }

    if (playedMidis.length === 0) return;

    const targetNote = notes[currentIndex];
    if (!targetNote) return;

    const now = performance.now();
    const intensity = velocity / 127;
    let matchedAny = false;

    // Processa cada nota executada (MIDI ou Acústica) contra as notas do passo atual
    playedMidis.forEach((rawMidi) => {
      validatorRef.current.getEvaluator().feedNote(rawMidi, intensity, now);

      // 1. Acerto direto de nota do passo (Clave de Fá ou Clave de Sol)
      const matchIdx = currentStepIndices.find(
        (idx: number) => !satisfiedIndicesRef.current.has(idx) && (rawMidi === -1 || notes[idx].midi === rawMidi)
      );

      if (matchIdx !== undefined) {
        satisfiedIndicesRef.current.add(matchIdx);
        validatorRef.current.onNoteCompleted(notes[matchIdx].midi, now);
        playSoundForNote(notes[matchIdx]);
        matchedAny = true;
        return;
      }

      // 2. Acerto por harmonia/acorde no passo atual
      const stepChord = notes.find((_n, i) => currentStepIndices.includes(i) && _n.chordName)?.chordName || explicitChordName;
      if (stepChord) {
        const parsedChord = parseChord(stepChord);
        if (parsedChord) {
          const rawPitchClass = ((rawMidi % 12) + 12) % 12;
          const isChordNote = parsedChord.notes.some((n) => {
            const idx = CHROMATIC_NOTES_SHARP.indexOf(n);
            return (idx !== -1 ? idx : CHROMATIC_NOTES_FLAT.indexOf(n)) === rawPitchClass;
          });
          if (isChordNote) {
            const unfulfilledIdx = currentStepIndices.find((idx: number) => !satisfiedIndicesRef.current.has(idx));
            if (unfulfilledIdx !== undefined) {
              satisfiedIndicesRef.current.add(unfulfilledIdx);
              validatorRef.current.onNoteCompleted(notes[unfulfilledIdx].midi, now);
              playSoundForNote(notes[unfulfilledIdx]);
              matchedAny = true;
              return;
            }
          }
        }
      }
    });

    // 3. Verifica se todas as notas do passo foram satisfeitas
    const allSatisfied = currentStepIndices.every((idx: number) => satisfiedIndicesRef.current.has(idx));

    if (allSatisfied) {
      setLastError(null);
      isPausedWaitingRef.current = false;
      const lastIdx = currentStepIndices[currentStepIndices.length - 1];
      const nextIdx = lastIdx + 1;
      const noteOffset = timeline.noteOffsets[currentIndex] ?? 0;
      const currentBeat = scrollOffsetRef.current / pixelsPerBeat;
      const diffMs = (currentBeat - noteOffset) * ((60 / tempo) * 1000);

      processStrike(diffMs, lastIdx);

      satisfiedIndicesRef.current.clear();
      setSatisfiedIndices(new Set());
      setCurrentIndex(nextIdx);

      if (nextIdx < notes.length) {
        const nextOffset = timeline.noteOffsets[nextIdx] ?? 0;
        scrollOffsetRef.current = nextOffset * pixelsPerBeat;
      } else {
        onLessonCompleteRef.current?.();
      }
      return;
    }

    if (matchedAny) {
      // Passo parcialmente satisfeito (ex: tocou primeiro a mão esquerda ou nota do acorde)
      setSatisfiedIndices(new Set(satisfiedIndicesRef.current));
      setLastError(null);
      return;
    }

    // 4. Tratamento de notas que não coincidiram
    const primaryPlayed = playedMidis[0];

    // Ignora se for tecla repetida já satisfeita no passo atual
    const isAlreadySatisfiedInStep = currentStepIndices.some(
      (idx: number) => satisfiedIndicesRef.current.has(idx) && notes[idx].midi === primaryPlayed
    );
    if (isAlreadySatisfiedInStep) return;

    // Ignora resíduo acústico da nota anterior
    if (validatorRef.current.isPreviousSustain(primaryPlayed, now)) return;

    // 5. Transição Antecipada para o próximo passo se o usuário já tocou a próxima nota
    const lastCurrentIdx = currentStepIndices[currentStepIndices.length - 1];
    const nextStepStartIdx = lastCurrentIdx + 1;
    if (nextStepStartIdx < notes.length) {
      const nextOffset = timeline.noteOffsets[nextStepStartIdx] ?? 0;
      const nextStepIndices: number[] = [];
      for (let i = nextStepStartIdx; i < notes.length; i++) {
        if (Math.abs((timeline.noteOffsets[i] ?? 0) - nextOffset) < 0.05) {
          nextStepIndices.push(i);
        } else {
          break;
        }
      }
      const matchesNextStep = nextStepIndices.some((idx: number) => notes[idx].midi === primaryPlayed);
      if (matchesNextStep) {
        const noteOffset = timeline.noteOffsets[currentIndex] ?? 0;
        const currentBeat = scrollOffsetRef.current / pixelsPerBeat;
        const diffMs = (currentBeat - noteOffset) * ((60 / tempo) * 1000);

        processStrike(diffMs, lastCurrentIdx);

        satisfiedIndicesRef.current.clear();
        const nextMatch = nextStepIndices.find((idx: number) => notes[idx].midi === primaryPlayed);
        if (nextMatch !== undefined) {
          satisfiedIndicesRef.current.add(nextMatch);
          playSoundForNote(notes[nextMatch]);
        }
        setSatisfiedIndices(new Set(satisfiedIndicesRef.current));
        setCurrentIndex(nextStepStartIdx);
        scrollOffsetRef.current = nextOffset * pixelsPerBeat;
        return;
      }
    }

    // 6. Janela de Confirmação de Erro (Anti-Falsos Erros)
    const expectedMidi = targetNote.midi;
    validatorRef.current.schedulePendingError(primaryPlayed, expectedMidi, (errPayload) => {
      const currentTarget = notes[currentIndexRef.current];
      if (currentTarget && currentTarget.midi === errPayload.expectedMidi) {
        const err: ScoreErrorEvent = {
          playedMidi: errPayload.playedMidi,
          expectedMidi: errPayload.expectedMidi,
          timestamp: errPayload.timestamp,
        };
        setLastError(err);
        const playedInfo = getNoteInfo(errPayload.playedMidi);
        const unfulfilledNotes = currentStepIndices
          .filter((i: number) => !satisfiedIndicesRef.current.has(i))
          .map((i: number) => {
            const inf = getNoteInfo(notes[i].midi);
            return `${inf.name}${inf.octave}`;
          });
        const expectedDisplay = unfulfilledNotes.length > 0 ? unfulfilledNotes.join(' + ') : `${getNoteInfo(errPayload.expectedMidi).name}`;
        setFeedback({
          text: `✕ NOTA ERRADA: Tocou ${playedInfo.name}${playedInfo.octave} (Esperada: ${expectedDisplay})`,
          color: 'text-rose-400',
        });
        onNoteErrorRef.current?.(err);
      }
    });
  }, [
    currentMidiPressed,
    currentIndex,
    notes,
    timeline,
    tempo,
    isDemoMode,
    processStrike,
    pixelsPerBeat,
    instrument,
    currentStepIndices,
    playSoundForNote,
  ]);

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
    satisfiedIndices,
    currentStepIndices,
    handlePlayToggle,
    handleTempoChange,
    handleRestart,
    processStrike,
  };
}
