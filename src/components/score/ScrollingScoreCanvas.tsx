import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import type { ScoreNote } from '../../core/coursesData';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export type MidiInputNote = number | { midi: number; timestamp?: number } | null;

export interface ChordSpan {
  chordName: string;
  startBeat: number;
  duration: number;
  measure: number;
}

interface Props {
  notes: ScoreNote[];
  bpm?: number;
  timeSignature?: string;
  initialMode?: 'wait' | 'flow';
  initialTheme?: 'traditional' | 'dark';
  onNoteHit?: (note: ScoreNote, diffMs: number) => void;
  onLessonComplete?: () => void;
  currentMidiPressed?: MidiInputNote;
  isPlaying?: boolean;
  onPlayPauseToggle?: (playing: boolean) => void;
  onTempoChange?: (tempo: number) => void;
  instrument?: 'piano' | 'guitar';
  toleranceMs?: number;
  isDemoMode?: boolean;
  currentNoteIndex?: number;
  autoPlayAudio?: boolean;
  enableMetronomeSound?: boolean;
}

function parseTimeSignature(ts = '4/4') {
  const parts = ts.split('/');
  const num = parseInt(parts[0], 10) || 4;
  const den = parseInt(parts[1], 10) || 4;
  let beatsPerMeasure = num;
  if (den === 8 && num >= 6) {
    beatsPerMeasure = num / 3;
  }
  return { numerator: num, denominator: den, beatsPerMeasure };
}

export const ScrollingScoreCanvas: React.FC<Props> = ({
  notes,
  bpm = 75,
  timeSignature = '4/4',
  initialMode = 'wait',
  initialTheme = 'traditional',
  onNoteHit,
  onLessonComplete,
  currentMidiPressed,
  isPlaying: controlledIsPlaying,
  onPlayPauseToggle,
  onTempoChange,
  instrument = 'piano',
  toleranceMs = 70,
  isDemoMode = false,
  currentNoteIndex,
  autoPlayAudio = false,
  enableMetronomeSound = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const lastProcessedKeyRef = useRef<string>('');
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;

  // Tema da partitura: 'traditional' (P&B Papel de Partitura Clássico - DEFAULT) ou 'dark' (Noturno)
  const [scoreTheme, setScoreTheme] = useState<'traditional' | 'dark'>(initialTheme);

  const mode = isDemoMode ? 'flow' : initialMode;
  const [tempo, setTempo] = useState<number>(bpm);

  const { numerator, denominator, beatsPerMeasure } = useMemo(
    () => parseTimeSignature(timeSignature),
    [timeSignature]
  );

  // Pré-computa linha do tempo com barras de compasso e posições rítmicas exatas
  const timeline = useMemo(() => {
    const measureStartBeats = new Map<number, number>();
    const noteOffsets: number[] = [];

    if (!notes || notes.length === 0) {
      return { noteOffsets, measureStartBeats, maxMeasure: 1, totalBeats: 4, chordSpans: [] as ChordSpan[] };
    }

    let maxMeasure = 1;
    let maxBeat = 0;

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const m = Math.max(1, note.measure || 1);
      const b = (note.beat !== undefined ? Math.max(0, note.beat - 1) : 0);
      const dur = note.duration || 1;

      if (m > maxMeasure) maxMeasure = m;

      // Início exato de cada compasso métrico
      const measureStart = (m - 1) * beatsPerMeasure;
      if (!measureStartBeats.has(m)) {
        measureStartBeats.set(m, measureStart);
      }

      const noteOffset = measureStart + b;
      noteOffsets.push(noteOffset);

      if (noteOffset + dur > maxBeat) {
        maxBeat = noteOffset + dur;
      }
    }

    for (let m = 1; m <= maxMeasure + 1; m++) {
      if (!measureStartBeats.has(m)) {
        measureStartBeats.set(m, (m - 1) * beatsPerMeasure);
      }
    }

    // Identifica e agrupa ocupação no tempo dos acordes para a Pista de Acordes
    const chordSpans: ChordSpan[] = [];
    const rawChords: { chordName: string; startBeat: number; duration: number; measure: number }[] = [];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.chordName && note.chordName.trim()) {
        const m = Math.max(1, note.measure || 1);
        const b = (note.beat !== undefined ? Math.max(0, note.beat - 1) : 0);
        const measureStart = measureStartBeats.get(m) ?? (m - 1) * beatsPerMeasure;
        const startBeat = measureStart + b;
        const dur = note.duration || 1;
        rawChords.push({
          chordName: note.chordName.trim(),
          startBeat,
          duration: dur,
          measure: m,
        });
      }
    }

    // Ordena os acordes pelo tempo de início
    rawChords.sort((a, b) => a.startBeat - b.startBeat);

    // Agrupa acordes contíguos de mesmo nome
    for (const rc of rawChords) {
      if (chordSpans.length === 0) {
        chordSpans.push({ ...rc });
      } else {
        const prev = chordSpans[chordSpans.length - 1];
        if (prev.chordName === rc.chordName && rc.startBeat <= prev.startBeat + prev.duration + 0.05) {
          prev.duration = Math.max(prev.duration, (rc.startBeat - prev.startBeat) + rc.duration);
        } else if (rc.startBeat === prev.startBeat) {
          prev.duration = Math.max(prev.duration, rc.duration);
        } else {
          chordSpans.push({ ...rc });
        }
      }
    }

    // Estende a ocupação no tempo até o próximo acorde ou o fim do compasso
    for (let i = 0; i < chordSpans.length; i++) {
      const curr = chordSpans[i];
      const next = chordSpans[i + 1];
      const measureEndBeat = curr.measure * beatsPerMeasure;

      if (next && next.startBeat > curr.startBeat) {
        const gap = next.startBeat - curr.startBeat;
        if (gap <= beatsPerMeasure * 2) {
          curr.duration = Math.max(curr.duration, gap);
        }
      } else {
        if (measureEndBeat > curr.startBeat) {
          curr.duration = Math.max(curr.duration, measureEndBeat - curr.startBeat);
        }
      }
    }

    return {
      noteOffsets,
      measureStartBeats,
      maxMeasure,
      totalBeats: Math.max(maxMeasure * beatsPerMeasure, maxBeat),
      chordSpans,
    };
  }, [notes, beatsPerMeasure]);

  // Opções ON / OFF para anotações didáticas e símbolos de partitura completa
  const [displayOptions, setDisplayOptions] = useState<{
    showFingering: boolean;
    showNoteNames: boolean;
    showRests: boolean;
    showBarlines: boolean;
    showBeatNumbers: boolean;
    showSubdivisions: boolean;
    showChords: boolean;
  }>({
    showFingering: true,
    showNoteNames: true,
    showRests: true,
    showBarlines: true,
    showBeatNumbers: true,
    showSubdivisions: true,
    showChords: true,
  });

  const toggleOption = (
    key:
      | 'showFingering'
      | 'showNoteNames'
      | 'showRests'
      | 'showBarlines'
      | 'showBeatNumbers'
      | 'showSubdivisions'
      | 'showChords'
  ) => {
    setDisplayOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Identifica pausas e silêncios musicais para notação formal completa
  const restsList = useMemo(() => {
    const list: Array<{ clef: 'treble' | 'bass'; beatOffset: number; duration: number; measure: number }> = [];
    if (!notes || notes.length === 0) return list;

    const measuresMap = new Map<number, { treble: ScoreNote[]; bass: ScoreNote[] }>();
    for (let m = 1; m <= timeline.maxMeasure; m++) {
      measuresMap.set(m, { treble: [], bass: [] });
    }

    notes.forEach((note) => {
      const m = note.measure || 1;
      const entry = measuresMap.get(m);
      if (entry) {
        if (note.clef === 'treble') {
          entry.treble.push(note);
        } else {
          entry.bass.push(note);
        }
      }
    });

    measuresMap.forEach((entry, m) => {
      const measureStartBeat = timeline.measureStartBeats.get(m) ?? (m - 1) * beatsPerMeasure;

      // 1. Silêncio em Clave de Sol
      if (entry.treble.length === 0) {
        list.push({
          clef: 'treble',
          beatOffset: measureStartBeat + (beatsPerMeasure / 2),
          duration: beatsPerMeasure,
          measure: m,
        });
      } else {
        const firstBeat = Math.min(...entry.treble.map(n => n.beat || 1));
        if (firstBeat > 1) {
          list.push({
            clef: 'treble',
            beatOffset: measureStartBeat,
            duration: firstBeat - 1,
            measure: m,
          });
        }
      }

      // 2. Silêncio em Clave de Fá
      if (entry.bass.length === 0) {
        list.push({
          clef: 'bass',
          beatOffset: measureStartBeat + (beatsPerMeasure / 2),
          duration: beatsPerMeasure,
          measure: m,
        });
      } else {
        const firstBeat = Math.min(...entry.bass.map(n => n.beat || 1));
        if (firstBeat > 1) {
          list.push({
            clef: 'bass',
            beatOffset: measureStartBeat,
            duration: firstBeat - 1,
            measure: m,
          });
        }
      }
    });

    return list;
  }, [notes, timeline, beatsPerMeasure]);

  // Monitora a largura real disponível para ocupar 100% da área do teclado
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 200) {
          setContainerWidth(measured);
        }
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    setTempo(bpm);
  }, [bpm]);

  useEffect(() => {
    scrollOffsetRef.current = 0;
    setCurrentIndex(0);
    playedNotesRef.current.clear();
    playedBeatsRef.current.clear();
    isPausedWaitingRef.current = false;
  }, [notes]);

  // Espaçamento horizontal por tempo (ajustável para conforto visual ideal de leitura em movimento)
  const [pixelsPerBeat, setPixelsPerBeat] = useState<number>(115);

  useEffect(() => {
    if (currentNoteIndex === 0) {
      scrollOffsetRef.current = 0;
      playedNotesRef.current.clear();
      playedBeatsRef.current.clear();
      isPausedWaitingRef.current = false;
    } else if (isDemoMode && currentNoteIndex !== undefined && timeline.noteOffsets[currentNoteIndex] !== undefined) {
      const targetOffset = timeline.noteOffsets[currentNoteIndex] * pixelsPerBeat;
      const drift = Math.abs(scrollOffsetRef.current - targetOffset);
      if (drift > 60) {
        scrollOffsetRef.current = targetOffset;
      }
    }
  }, [currentNoteIndex, isDemoMode, timeline, pixelsPerBeat]);

  const setIsPlaying = (playing: boolean) => {
    setInternalIsPlaying(playing);
    if (onPlayPauseToggle) onPlayPauseToggle(playing);
  };

  const handleTempoChange = (newBpm: number) => {
    const clamped = Math.max(30, Math.min(220, newBpm));
    setTempo(clamped);
    if (onTempoChange) onTempoChange(clamped);
  };
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);

  // Offset da partitura em pixels (rolagem da direita para a esquerda)
  const scrollOffsetRef = useRef<number>(0);
  const isPausedWaitingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const playedNotesRef = useRef<Set<number>>(new Set());
  const playedBeatsRef = useRef<Set<number>>(new Set());

  // Sincroniza índice de nota externo se fornecido
  useEffect(() => {
    if (currentNoteIndex !== undefined) {
      setCurrentIndex(currentNoteIndex);
    }
  }, [currentNoteIndex]);

  // =========================================================================
  // GEOMETRIA AMPLIADA DA PARTITURA: Alta Legibilidade e Conforto Visual
  // =========================================================================
  const trebleLineStep = 14; // Espaçamento entre linhas da pauta (14px)
  const trebleBaseY = 126;   // Linha 1 da Clave de Sol (E3 = Y=126, Linha 5 F4 = Y=70)
  const middleCY = trebleBaseY + trebleLineStep; // Y=140: Dó Central exatamente 1 linha (14px) abaixo da Linha 1 da Clave de Sol
  const trebleNoteNameY = 168; // Linha estática contínua para nomes das notas na Clave de Sol
  const trebleFingerY = 198;   // Linha estática contínua para dedilhado (MD) na Clave de Sol

  const bassTopY = 248;      // Linha 5 da Clave de Fá (A2 = Y=248)
  const bassLineStep = 14;   // Espaçamento entre linhas da pauta de Fá (14px)
  const bassBaseY = 304;     // Linha 1 da Clave de Fá (G1 = Y=304: 248 + 4 * 14)
  const bassNoteNameY = 338; // Linha estática contínua para nomes das notas na Clave de Fá
  const bassFingerY = 368;   // Linha estática contínua para dedilhado (ME) na Clave de Fá

  const attackLineX = 145;   // Posição horizontal fixa da barra de ataque

  const getNoteY = (midi: number, clef: 'treble' | 'bass' = 'treble'): number => {
    const SEMITONE_TO_DIATONIC = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
    const semitone = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 2; // Padrão Solfejo Latino / Brasileiro / Yamaha: Dó Central = C3 (MIDI 60)
    const diatonicStep = octave * 7 + SEMITONE_TO_DIATONIC[semitone];

    // Dó Central (C3 = MIDI 60, diatonicStep = 3 * 7 + 0 = 21)
    if (midi === 60) return middleCY;

    if (clef === 'treble' || midi > 60) {
      // E3 tem diatonicStep = 23 e fica em Y = trebleBaseY (Linha 1 do Treble)
      // Cada semitom diatônico é metade do lineStep (14 / 2 = 7)
      return trebleBaseY - (diatonicStep - 23) * 7;
    } else {
      // A2 tem diatonicStep = 19 e fica em Y = bassTopY (Linha 5 do Bass)
      return bassTopY + (19 - diatonicStep) * 7;
    }
  };

  // Helper para desenhar cápsulas arredondadas com compatibilidade total
  const drawRoundedPill = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r);
    c.arcTo(x, y, x + r, y, r);
    c.closePath();
  };

  // Resolvedor inteligente de dedilhado e apontamento visual de dedo
  const getScoreNoteFingering = (note: ScoreNote, instMode: 'piano' | 'guitar') => {
    // 1. Dedo explícito da Mão Direita
    if (note.fingerRightHand) {
      const f = note.fingerRightHand;
      const names = ['', 'Polegar', 'Indicador', 'Médio', 'Anelar', 'Mínimo'];
      const colors = ['', '#d97706', '#2563eb', '#059669', '#7c3aed', '#e11d48'];
      return {
        finger: f,
        hand: 'MD',
        label: `MD ${f}`,
        fingerName: names[f] || `D${f}`,
        color: colors[f] || '#2563eb',
      };
    }

    // 2. Dedo explícito da Mão Esquerda
    if (note.fingerLeftHand) {
      const f = note.fingerLeftHand;
      const names = ['', 'Polegar', 'Indicador', 'Médio', 'Anelar', 'Mínimo'];
      return {
        finger: f,
        hand: 'ME',
        label: `ME ${f}`,
        fingerName: names[f] || `D${f}`,
        color: '#7c3aed',
      };
    }

    // 3. Apontamento específico para Violão
    if (instMode === 'guitar') {
      if (note.clef === 'bass' || note.midi <= 52) {
        return { finger: 'P', hand: 'RH', label: 'P', fingerName: 'Polegar', color: '#d97706' };
      }
      const midi = note.midi;
      if (midi <= 59) return { finger: 'i', hand: 'RH', label: 'i', fingerName: 'Indicador', color: '#2563eb' };
      if (midi <= 62) return { finger: 'm', hand: 'RH', label: 'm', fingerName: 'Médio', color: '#059669' };
      return { finger: 'a', hand: 'RH', label: 'a', fingerName: 'Anelar', color: '#7c3aed' };
    }

    // 4. Mapeamento diatônico para Piano (Posição de 5 Dedos)
    const midi = note.midi;
    if (note.clef === 'treble') {
      if (midi === 60) return { finger: 1, hand: 'MD', label: 'MD 1', fingerName: 'Polegar', color: '#d97706' };
      if (midi === 62) return { finger: 2, hand: 'MD', label: 'MD 2', fingerName: 'Indicador', color: '#2563eb' };
      if (midi === 64) return { finger: 3, hand: 'MD', label: 'MD 3', fingerName: 'Médio', color: '#059669' };
      if (midi === 65) return { finger: 4, hand: 'MD', label: 'MD 4', fingerName: 'Anelar', color: '#7c3aed' };
      if (midi >= 67 && midi <= 68) return { finger: 5, hand: 'MD', label: 'MD 5', fingerName: 'Mínimo', color: '#e11d48' };
      if (midi >= 69) return { finger: 1, hand: 'MD', label: 'MD 1', fingerName: 'Polegar', color: '#d97706' };
      return { finger: 1, hand: 'MD', label: 'MD 1', fingerName: 'Polegar', color: '#d97706' };
    } else {
      if (midi === 48) return { finger: 5, hand: 'ME', label: 'ME 5', fingerName: 'Mínimo', color: '#e11d48' };
      if (midi === 50) return { finger: 4, hand: 'ME', label: 'ME 4', fingerName: 'Anelar', color: '#7c3aed' };
      if (midi === 52) return { finger: 3, hand: 'ME', label: 'ME 3', fingerName: 'Médio', color: '#059669' };
      if (midi === 53) return { finger: 2, hand: 'ME', label: 'ME 2', fingerName: 'Indicador', color: '#2563eb' };
      if (midi === 55) return { finger: 1, hand: 'ME', label: 'ME 1', fingerName: 'Polegar', color: '#d97706' };
      return { finger: 3, hand: 'ME', label: 'ME 3', fingerName: 'Médio', color: '#7c3aed' };
    }
  };

  const triggerNoteHit = useCallback((noteIndex: number, diffMs = 0) => {
    if (noteIndex >= notes.length) return;
    const note = notes[noteIndex];
    const currentOffset = timeline.noteOffsets[noteIndex] ?? 0;

    // Toca a nota principal e quaisquer notas simultâneas no mesmo tempo métrico (polifonia / ambas as mãos)
    for (let k = 0; k < notes.length; k++) {
      if (Math.abs((timeline.noteOffsets[k] ?? 0) - currentOffset) < 0.05) {
        const simNote = notes[k];
        if (instrument === 'guitar') {
          soundEngine.playGuitarPluck(simNote.midi, 1.4);
        } else {
          soundEngine.playPianoNote(simNote.midi, 1.2);
        }
      }
    }

    if (!isDemoMode) {
      const tol = toleranceMs ?? 70;
      const perfectLimit = Math.max(12, Math.round(tol * 0.4));
      const goodLimit = tol;
      const absDiff = Math.abs(diffMs);

      let evaluation = { label: `PERFEITO! (±${Math.round(absDiff)}ms)`, color: 'text-emerald-400', points: 100 };
      if (absDiff > goodLimit) {
        evaluation = { label: diffMs > 0 ? `ATRASADO (+${Math.round(absDiff)}ms)` : `ADIANTADO (-${Math.round(absDiff)}ms)`, color: 'text-amber-400', points: 50 };
      } else if (absDiff > perfectLimit) {
        evaluation = { label: `BOM (±${Math.round(absDiff)}ms)`, color: 'text-cyan-400', points: 80 };
      }

      setFeedback({ text: evaluation.label, color: evaluation.color });
      setScore(s => s + evaluation.points);
      setStreak(str => str + 1);

      if (onNoteHit) onNoteHit(note, diffMs);
    }

    // Destrava o modo "esperar"
    isPausedWaitingRef.current = false;
    setCurrentIndex(noteIndex + 1);

    if (noteIndex + 1 >= notes.length && onLessonComplete) {
      onLessonComplete();
    }
  }, [notes, onNoteHit, onLessonComplete, instrument, toleranceMs, isDemoMode]);

  // Se o usuário tocou via teclado virtual, MIDI ou microfone
  useEffect(() => {
    // Durante a reprodução de demonstração, não avalia performance nem escuta
    if (isDemoMode) return;
    if (currentMidiPressed === null || currentMidiPressed === undefined) return;

    const rawMidi = typeof currentMidiPressed === 'number' ? currentMidiPressed : currentMidiPressed.midi;
    const timestamp = typeof currentMidiPressed === 'number' ? Date.now() : (currentMidiPressed.timestamp ?? Date.now());
    const eventKey = `${rawMidi}_${timestamp}`;

    if (lastProcessedKeyRef.current === eventKey) return;
    lastProcessedKeyRef.current = eventKey;

    if (currentIndex < notes.length) {
      const targetNote = notes[currentIndex];
      const targetOffset = timeline.noteOffsets[currentIndex] ?? 0;
      const targetTimeSec = (targetOffset * 60) / tempo;
      const currentScrollSec = scrollOffsetRef.current / ((tempo / 60) * pixelsPerBeat);
      const diffMs = (currentScrollSec - targetTimeSec) * 1000;

      // Se for toque rítmico genérico (-1) OU coincidir com a nota da partitura:
      if (rawMidi === -1 || targetNote.midi === rawMidi) {
        triggerNoteHit(currentIndex, diffMs);
      } else {
        setStreak(0);
        setFeedback({ text: 'Nota incorreta', color: 'text-rose-400' });
      }
    }
  }, [currentMidiPressed, isPlaying, currentIndex, notes, triggerNoteHit, isDemoMode, timeline, tempo, pixelsPerBeat]);

  // Loop de Renderização no Canvas a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isTrad = (scoreTheme === 'traditional');

    const render = () => {
      const now = performance.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const width = canvas.width;
      const height = canvas.height;

      // Atualiza rolagem se estiver tocando e não estiver travado no modo "esperar"
      if (isPlaying && !isPausedWaitingRef.current) {
        const speedPixelsPerSec = (tempo / 60) * pixelsPerBeat;
        scrollOffsetRef.current += speedPixelsPerSec * deltaSec;

        const currentBeat = scrollOffsetRef.current / pixelsPerBeat;

        // Reprodução sonora sincronizada com a linha de ataque (Modo Demonstração ou Áudio Ativo)
        const shouldPlayNotes = (isDemoMode || autoPlayAudio) && currentNoteIndex === undefined;
        if (shouldPlayNotes) {
          for (let i = 0; i < timeline.noteOffsets.length; i++) {
            const noteBeat = timeline.noteOffsets[i];
            if (noteBeat <= currentBeat + 0.08 && !playedNotesRef.current.has(i)) {
              playedNotesRef.current.add(i);
              const note = notes[i];
              if (note) {
                const noteDur = (note.duration || 1) * (60 / tempo);
                if (instrument === 'guitar') {
                  soundEngine.playGuitarPluck(note.midi, noteDur * 1.4);
                } else {
                  soundEngine.playPianoNote(note.midi, noteDur * 1.2);
                }
                setCurrentIndex(i);
              }
            }
          }
        }

        // Metrônomo sonoro no compasso
        if (enableMetronomeSound) {
          const currentIntBeat = Math.floor(currentBeat);
          if (currentIntBeat >= 0 && currentIntBeat <= timeline.totalBeats && !playedBeatsRef.current.has(currentIntBeat)) {
            playedBeatsRef.current.add(currentIntBeat);
            const isDownbeat = (currentIntBeat % beatsPerMeasure) === 0;
            soundEngine.playMetronomeClick(isDownbeat, false);
          }
        }

        // Se a partitura ultrapassou o fim da obra, reinicia em loop suavemente sem esvaziar a tela
        const maxScroll = (timeline.totalBeats + 1) * pixelsPerBeat;
        if (scrollOffsetRef.current > maxScroll) {
          playedNotesRef.current.clear();
          playedBeatsRef.current.clear();
          if (isDemoMode) {
            scrollOffsetRef.current = 0;
          } else if (onLessonComplete) {
            onLessonComplete();
          }
        }
      }

      // Limpeza do Canvas
      ctx.clearRect(0, 0, width, height);

      // =======================================================================
      // 1. FUNDO DA PARTITURA: Tradicional P&B vs Noturno
      // =======================================================================
      if (isTrad) {
        // Papel de Partitura Tradicional (Branco límpido de alta definição)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Faixa superior discreta de cabeçalho
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, 36);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 36);
        ctx.lineTo(width, 36);
        ctx.stroke();
      } else {
        // Fundo em gradiente noturno de luxo
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#090814');
        bgGrad.addColorStop(1, '#110f22');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // =======================================================================
      // 2. PENTAGRAMA DE SOL (Treble Staff - 5 Linhas: E3 até F4)
      // =======================================================================
      ctx.strokeStyle = isTrad ? '#09090b' : '#475569';
      ctx.lineWidth = isTrad ? 1.5 : 1.2;
      for (let i = 0; i < 5; i++) {
        const y = trebleBaseY - i * trebleLineStep;
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(width - 24, y);
        ctx.stroke();
      }

      // Clave de Sol Impressa (Tamanho Clássico Ampliado)
      ctx.fillStyle = isTrad ? '#09090b' : '#818cf8';
      ctx.font = 'bold 50px serif';
      ctx.fillText('𝄞', 32, 122);

      // =======================================================================
      // 3. LINHA PONTILHADA DE DÓ CENTRAL NA CLAVE DE SOL (C3 = MIDI 60)
      // =======================================================================
      // Espaçamento idêntico às demais linhas da pauta (14px abaixo da Linha 1)
      ctx.save();
      ctx.strokeStyle = isTrad ? 'rgba(15, 23, 42, 0.28)' : 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(24, middleCY);
      ctx.lineTo(width - 24, middleCY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge Formal de Identificação do Dó Central na Pauta
      ctx.fillStyle = isTrad ? '#f1f5f9' : 'rgba(14, 165, 233, 0.18)';
      ctx.strokeStyle = isTrad ? '#94a3b8' : 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1;
      drawRoundedPill(ctx, 24, middleCY - 9, 94, 18, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isTrad ? '#0f172a' : '#38bdf8';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DÓ CENTRAL (C3)', 71, middleCY);
      ctx.restore();

      // =======================================================================
      // 3.1 LINHAS ESTÁTICAS DE NOTA E DEDILHADO DA CLAVE DE SOL (ABAIXO DA PAUTA)
      // =======================================================================
      if (displayOptions.showNoteNames) {
        ctx.save();
        ctx.strokeStyle = isTrad ? '#e2e8f0' : 'rgba(99, 102, 241, 0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(24, trebleNoteNameY);
        ctx.lineTo(width - 24, trebleNoteNameY);
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#f8fafc' : 'rgba(99, 102, 241, 0.15)';
        ctx.strokeStyle = isTrad ? '#cbd5e1' : 'rgba(99, 102, 241, 0.4)';
        drawRoundedPill(ctx, 24, trebleNoteNameY - 8, 48, 16, 3.5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#475569' : '#a5b4fc';
        ctx.font = 'bold 8.5px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NOTA', 48, trebleNoteNameY);
        ctx.restore();
      }

      if (displayOptions.showFingering) {
        ctx.save();
        ctx.strokeStyle = isTrad ? '#e2e8f0' : 'rgba(168, 85, 247, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(24, trebleFingerY);
        ctx.lineTo(width - 24, trebleFingerY);
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#f8fafc' : 'rgba(168, 85, 247, 0.15)';
        ctx.strokeStyle = isTrad ? '#cbd5e1' : 'rgba(168, 85, 247, 0.4)';
        drawRoundedPill(ctx, 24, trebleFingerY - 8, 62, 16, 3.5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#475569' : '#d8b4fe';
        ctx.font = 'bold 8px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DEDO (MD)', 55, trebleFingerY);
        ctx.restore();
      }

      // =======================================================================
      // 4. PENTAGRAMA DE FÁ (Bass Staff - 5 Linhas: G1 até A2)
      // =======================================================================
      ctx.strokeStyle = isTrad ? '#09090b' : '#475569';
      ctx.lineWidth = isTrad ? 1.5 : 1.2;
      for (let i = 0; i < 5; i++) {
        const y = bassBaseY - i * bassLineStep;
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(width - 24, y);
        ctx.stroke();
      }

      // Clave de Fá Impressa (Tamanho Clássico Ampliado)
      ctx.fillStyle = isTrad ? '#09090b' : '#a855f7';
      ctx.font = 'bold 42px serif';
      ctx.fillText('𝄢', 32, 280);

      // =======================================================================
      // 4.1 LINHAS ESTÁTICAS DE NOTA E DEDILHADO DA CLAVE DE FÁ (ABAIXO DA PAUTA)
      // =======================================================================
      if (displayOptions.showNoteNames) {
        ctx.save();
        ctx.strokeStyle = isTrad ? '#e2e8f0' : 'rgba(99, 102, 241, 0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(24, bassNoteNameY);
        ctx.lineTo(width - 24, bassNoteNameY);
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#f8fafc' : 'rgba(99, 102, 241, 0.15)';
        ctx.strokeStyle = isTrad ? '#cbd5e1' : 'rgba(99, 102, 241, 0.4)';
        drawRoundedPill(ctx, 24, bassNoteNameY - 8, 48, 16, 3.5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#475569' : '#a5b4fc';
        ctx.font = 'bold 8.5px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NOTA', 48, bassNoteNameY);
        ctx.restore();
      }

      if (displayOptions.showFingering) {
        ctx.save();
        ctx.strokeStyle = isTrad ? '#e2e8f0' : 'rgba(168, 85, 247, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(24, bassFingerY);
        ctx.lineTo(width - 24, bassFingerY);
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#f8fafc' : 'rgba(168, 85, 247, 0.15)';
        ctx.strokeStyle = isTrad ? '#cbd5e1' : 'rgba(168, 85, 247, 0.4)';
        drawRoundedPill(ctx, 24, bassFingerY - 8, 62, 16, 3.5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTrad ? '#475569' : '#d8b4fe';
        ctx.font = 'bold 8px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DEDO (ME)', 55, bassFingerY);
        ctx.restore();
      }

      // =======================================================================
      // 5. FÓRMULA DE COMPASSO (Time Signature: 4/4, 3/4)
      // =======================================================================
      ctx.save();
      ctx.font = 'bold 22px Outfit, sans-serif';
      ctx.textAlign = 'center';

      // Clave de Sol
      ctx.fillStyle = isTrad ? '#09090b' : '#818cf8';
      ctx.fillText(numerator.toString(), 76, 94);
      ctx.fillText(denominator.toString(), 76, 120);

      // Clave de Fá
      ctx.fillStyle = isTrad ? '#09090b' : '#a855f7';
      ctx.fillText(numerator.toString(), 76, 274);
      ctx.fillText(denominator.toString(), 76, 300);
      ctx.restore();

      // =======================================================================
      // 6. DIVISÃO DE COMPASSOS (Barlines), RÉGUA E TEMPOS (1, 2, 3, 4)
      // =======================================================================
      if (displayOptions.showBarlines) {
        timeline.measureStartBeats.forEach((measureBeat, m) => {
          const barX = attackLineX + (measureBeat * pixelsPerBeat) - scrollOffsetRef.current;
          const isFinalBar = (m > timeline.maxMeasure);
          const nextMeasureBeat = timeline.measureStartBeats.get(m + 1) ?? (measureBeat + beatsPerMeasure);
          const nextBarX = attackLineX + (nextMeasureBeat * pixelsPerBeat) - scrollOffsetRef.current;
          const isCurrentActiveMeasure = (!isFinalBar && attackLineX >= barX && attackLineX < nextBarX);

          // A. Régua Superior do Compasso (Header Ruler Band)
          if (!isFinalBar && barX < width + 100 && nextBarX > -100) {
            const rulerLeft = Math.max(16, barX);
            const rulerRight = Math.min(width - 16, nextBarX);
            const rulerWidth = rulerRight - rulerLeft;

            if (rulerWidth > 24) {
              ctx.save();
              if (isTrad) {
                // Fundo P&B Tradicional
                if (isCurrentActiveMeasure) {
                  ctx.fillStyle = '#eff6ff';
                  ctx.strokeStyle = '#3b82f6';
                  ctx.lineWidth = 1.2;
                  drawRoundedPill(ctx, rulerLeft + 2, 4, rulerWidth - 4, 15, 3.5);
                  ctx.fill();
                  ctx.stroke();

                  ctx.fillStyle = '#2563eb';
                  ctx.beginPath();
                  ctx.arc(rulerLeft + 10, 11.5, 3, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.fillStyle = '#1e3a8a';
                  ctx.font = 'bold 9.5px JetBrains Mono, monospace';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`COMPASSO ${m} • EM ANDAMENTO`, (rulerLeft + rulerRight) / 2, 12);
                } else {
                  ctx.fillStyle = '#f8fafc';
                  ctx.strokeStyle = '#cbd5e1';
                  ctx.lineWidth = 1;
                  drawRoundedPill(ctx, rulerLeft + 2, 4, rulerWidth - 4, 15, 3.5);
                  ctx.fill();
                  ctx.stroke();

                  ctx.fillStyle = '#475569';
                  ctx.font = 'bold 9px JetBrains Mono, monospace';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`COMPASSO ${m}`, (rulerLeft + rulerRight) / 2, 12);
                }
              } else {
                // Fundo Noturno
                if (isCurrentActiveMeasure) {
                  ctx.fillStyle = 'rgba(99, 102, 241, 0.16)';
                  ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
                  ctx.lineWidth = 1.2;
                  drawRoundedPill(ctx, rulerLeft + 2, 4, rulerWidth - 4, 15, 3.5);
                  ctx.fill();
                  ctx.stroke();

                  ctx.fillStyle = '#22d3ee';
                  ctx.beginPath();
                  ctx.arc(rulerLeft + 10, 11.5, 2.5, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.fillStyle = '#e0e7ff';
                  ctx.font = 'bold 9px JetBrains Mono, monospace';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`COMPASSO ${m} • EM ANDAMENTO`, (rulerLeft + rulerRight) / 2, 12);
                } else {
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                  ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
                  ctx.lineWidth = 1;
                  drawRoundedPill(ctx, rulerLeft + 2, 4, rulerWidth - 4, 15, 3.5);
                  ctx.fill();
                  ctx.stroke();

                  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
                  ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`COMPASSO ${m}`, (rulerLeft + rulerRight) / 2, 12);
                }
              }
              ctx.restore();
            }
          }

          // B. Subdivisões Rítmicas dos Tempos ("e" / "+" / Contratempo)
          if (!isFinalBar && displayOptions.showSubdivisions) {
            for (let b = 0; b < beatsPerMeasure; b++) {
              const subBeatX = attackLineX + ((measureBeat + b + 0.5) * pixelsPerBeat) - scrollOffsetRef.current;
              if (subBeatX > -20 && subBeatX < width + 20) {
                const rx = Math.round(subBeatX);
                ctx.save();
                // Marcação fina e discreta apenas na régua superior para não poluir as pautas em movimento
                ctx.strokeStyle = isTrad ? 'rgba(37, 99, 235, 0.4)' : 'rgba(56, 189, 248, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(rx, 22);
                ctx.lineTo(rx, 36);
                ctx.stroke();

                ctx.fillStyle = isTrad ? '#2563eb' : 'rgba(56, 189, 248, 0.75)';
                ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('e', rx, 29);
                ctx.restore();
              }
            }
          }

          // C. Divisão dos Tempos Internos do Compasso (Pulsos 1, 2, 3, 4...)
          if (!isFinalBar) {
            for (let b = 0; b < beatsPerMeasure; b++) {
              const beatX = attackLineX + ((measureBeat + b) * pixelsPerBeat) - scrollOffsetRef.current;
              if (beatX > -30 && beatX < width + 30) {
                const rx = Math.round(beatX);
                if (b === 0) {
                  if (displayOptions.showBeatNumbers) {
                    ctx.save();
                    ctx.fillStyle = isTrad ? '#fef3c7' : 'rgba(245, 158, 11, 0.22)';
                    ctx.strokeStyle = isTrad ? '#f59e0b' : 'rgba(245, 158, 11, 0.65)';
                    ctx.lineWidth = 1;
                    drawRoundedPill(ctx, rx + 2, 21, 52, 13, 3);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = isTrad ? '#92400e' : '#fbbf24';
                    ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('1 [FORTE]', rx + 28, 28);
                    ctx.restore();
                  }
                } else {
                  ctx.save();
                  ctx.setLineDash([2, 5]);
                  ctx.strokeStyle = isTrad ? 'rgba(203, 213, 225, 0.45)' : 'rgba(255, 255, 255, 0.08)';
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(rx, 36);
                  ctx.lineTo(rx, bassBaseY + 14);
                  ctx.stroke();
                  ctx.restore();

                  if (displayOptions.showBeatNumbers) {
                    ctx.save();
                    const isMediumStrong = (b === 2 && beatsPerMeasure === 4);
                    if (isMediumStrong) {
                      ctx.fillStyle = isTrad ? '#1e40af' : '#a5b4fc';
                      ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillText('3 [mF]', rx, 28);
                    } else {
                      ctx.fillStyle = isTrad ? '#64748b' : 'rgba(203, 213, 225, 0.7)';
                      ctx.font = 'bold 9px JetBrains Mono, monospace';
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillText((b + 1).toString(), rx, 28);
                    }
                    ctx.restore();
                  }
                }
              }
            }
          }

          // D. Barra de Compasso Principal (Barline vertical atravessando todo o sistema)
          if (barX > -40 && barX < width + 40) {
            ctx.save();
            if (isFinalBar) {
              // Barra Dupla Final de Conclusão da Obra
              ctx.strokeStyle = isTrad ? '#09090b' : '#94a3b8';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(barX - 7, 36);
              ctx.lineTo(barX - 7, bassBaseY + 14);
              ctx.stroke();

              ctx.lineWidth = 5;
              ctx.strokeStyle = isTrad ? '#09090b' : '#cbd5e1';
              ctx.beginPath();
              ctx.moveTo(barX, 36);
              ctx.lineTo(barX, bassBaseY + 14);
              ctx.stroke();

              // Badge de Fim
              ctx.fillStyle = isTrad ? '#fee2e2' : 'rgba(244, 63, 94, 0.2)';
              ctx.strokeStyle = isTrad ? '#ef4444' : 'rgba(244, 63, 94, 0.6)';
              ctx.lineWidth = 1;
              drawRoundedPill(ctx, barX - 16, 4, 32, 14, 3.5);
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle = isTrad ? '#b91c1c' : '#fda4af';
              ctx.font = 'bold 8.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('FIM', barX, 11.5);
            } else {
              // Barra de Compasso Vertical Padrão
              ctx.strokeStyle = isCurrentActiveMeasure ? (isTrad ? '#2563eb' : '#818cf8') : (isTrad ? '#475569' : '#64748b');
              ctx.lineWidth = isCurrentActiveMeasure ? 2.4 : 1.6;
              ctx.beginPath();
              ctx.moveTo(barX, 36);
              ctx.lineTo(barX, bassBaseY + 14);
              ctx.stroke();

              // Badge com o Número do Compasso (c.1, c.2, c.3...)
              const badgeW = m > 9 ? 34 : 28;
              ctx.fillStyle = isCurrentActiveMeasure ? (isTrad ? '#dbeafe' : 'rgba(99, 102, 241, 0.35)') : (isTrad ? '#f1f5f9' : 'rgba(30, 41, 59, 0.85)');
              ctx.strokeStyle = isCurrentActiveMeasure ? (isTrad ? '#3b82f6' : '#818cf8') : (isTrad ? '#94a3b8' : '#475569');
              ctx.lineWidth = 1;
              drawRoundedPill(ctx, barX - badgeW / 2, 4, badgeW, 14, 3.5);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = isCurrentActiveMeasure ? (isTrad ? '#1e40af' : '#e0e7ff') : (isTrad ? '#334155' : '#94a3b8');
              ctx.font = 'bold 8px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`c.${m}`, barX, 11.5);
            }
            ctx.restore();
          }
        });
      }

      // =======================================================================
      // 6.1 PISTA DE ACORDES COM OCUPAÇÃO NO TEMPO (ACIMA DAS PAUTAS)
      // =======================================================================
      if (displayOptions.showChords && timeline.chordSpans && timeline.chordSpans.length > 0) {
        const currentBeat = scrollOffsetRef.current / pixelsPerBeat;
        const chordY = 40;
        const chordH = 22;

        timeline.chordSpans.forEach((chord) => {
          const chordX = attackLineX + (chord.startBeat * pixelsPerBeat) - scrollOffsetRef.current;
          const chordW = Math.max(38, (chord.duration * pixelsPerBeat) - 6);

          if (chordX + chordW > 10 && chordX < width - 10) {
            ctx.save();
            const isActive = currentBeat >= chord.startBeat && currentBeat < (chord.startBeat + chord.duration);

            // 1. Fundo do Contêiner da Tag de Acorde (Ocupação no Tempo)
            if (isTrad) {
              if (isActive) {
                ctx.fillStyle = '#fef3c7';
                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 1.5;
              } else {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1;
              }
            } else {
              if (isActive) {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
                ctx.lineWidth = 1.4;
                ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
                ctx.shadowBlur = 8;
              } else {
                ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
                ctx.lineWidth = 1;
              }
            }

            drawRoundedPill(ctx, chordX, chordY, chordW, chordH, 5);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;

            // 2. Trilho de Progresso Rítmico de Ocupação no Tempo
            if (isActive) {
              const elapsedBeats = Math.max(0, Math.min(chord.duration, currentBeat - chord.startBeat));
              const progressRatio = elapsedBeats / chord.duration;
              const progressW = Math.max(4, (chordW - 4) * progressRatio);

              ctx.fillStyle = isTrad ? 'rgba(217, 119, 6, 0.22)' : 'rgba(251, 191, 36, 0.28)';
              drawRoundedPill(ctx, chordX + 2, chordY + 2, progressW, chordH - 4, 3.5);
              ctx.fill();
            }

            // 3. Badge com a Letra/Cifra do Acorde (Na esquerda da tag)
            const badgeW = Math.min(chordW - 6, Math.max(28, ctx.measureText(chord.chordName).width + 14));
            if (isTrad) {
              ctx.fillStyle = isActive ? '#d97706' : '#f1f5f9';
              ctx.strokeStyle = isActive ? '#b45309' : '#94a3b8';
            } else {
              ctx.fillStyle = isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)';
              ctx.strokeStyle = isActive ? '#fbbf24' : 'rgba(148, 163, 184, 0.4)';
            }
            ctx.lineWidth = 1;
            drawRoundedPill(ctx, chordX + 2, chordY + 2, badgeW, chordH - 4, 4);
            ctx.fill();
            ctx.stroke();

            // Letra do Acorde
            ctx.fillStyle = isTrad ? (isActive ? '#ffffff' : '#92400e') : (isActive ? '#090814' : '#fbbf24');
            ctx.font = 'bold 12px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(chord.chordName, chordX + 2 + badgeW / 2, chordY + chordH / 2);

            // 4. Indicador de Ocupação no Tempo (Duração em tempos e subdivisões)
            const remainingW = chordW - badgeW - 8;
            if (remainingW > 24) {
              const beatsCount = Math.round(chord.duration);
              const durationLabel = beatsCount > 1 ? `${beatsCount} tempos` : `${chord.duration}t`;

              ctx.fillStyle = isTrad ? (isActive ? '#78350f' : '#64748b') : (isActive ? '#fde68a' : '#94a3b8');
              ctx.font = 'bold 8.5px JetBrains Mono, monospace';
              ctx.textAlign = 'right';
              ctx.textBaseline = 'middle';
              ctx.fillText(durationLabel, chordX + chordW - 6, chordY + chordH / 2);

              // Ticks/marcadores rítmicos intermediários se houver espaço
              if (remainingW > 54 && beatsCount > 1) {
                const tickStartX = chordX + 4 + badgeW + 6;
                const tickEndX = chordX + chordW - 52;
                const tickStep = (tickEndX - tickStartX) / Math.max(1, beatsCount - 1);
                ctx.fillStyle = isTrad ? 'rgba(217, 119, 6, 0.4)' : 'rgba(251, 191, 36, 0.4)';
                for (let b = 0; b < beatsCount; b++) {
                  const tx = tickStartX + b * tickStep;
                  ctx.beginPath();
                  ctx.arc(tx, chordY + chordH / 2, 1.8, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }

            ctx.restore();
          }
        });
      }

      // =======================================================================
      // 7. SILÊNCIOS / PAUSAS FORMAIS (Semibreve, Mínima, Semínima, Colcheia)
      // =======================================================================
      if (displayOptions.showRests) {
        restsList.forEach((rest) => {
          const restX = attackLineX + (rest.beatOffset * pixelsPerBeat) - scrollOffsetRef.current;
          if (restX > -40 && restX < width + 40) {
            ctx.save();
            const restColor = isTrad ? '#09090b' : '#94a3b8';

            if (rest.duration >= 3) {
              // Pausa de Semibreve (retângulo suspenso sob a 4ª linha da pauta)
              const yHang = rest.clef === 'treble' ? (trebleBaseY - 3 * trebleLineStep) : (bassBaseY - 3 * bassLineStep);
              ctx.fillStyle = restColor;
              ctx.fillRect(restX - 8, yHang, 16, 7);

              ctx.fillStyle = isTrad ? '#475569' : 'rgba(148, 163, 184, 0.45)';
              ctx.font = 'bold 9.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('Pausa 4t', restX, yHang - 7);
            } else if (rest.duration >= 1.8) {
              // Pausa de Mínima (retângulo apoiado sobre a 3ª linha da pauta)
              const ySit = rest.clef === 'treble' ? (trebleBaseY - 2 * trebleLineStep) : (bassBaseY - 2 * bassLineStep);
              ctx.fillStyle = restColor;
              ctx.fillRect(restX - 8, ySit - 7, 16, 7);

              ctx.fillStyle = isTrad ? '#475569' : 'rgba(148, 163, 184, 0.45)';
              ctx.font = 'bold 9.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('Pausa 2t', restX, ySit - 13);
            } else if (rest.duration >= 0.8) {
              // Pausa de Semínima (zigue-zague estilizado clássico)
              ctx.strokeStyle = restColor;
              ctx.fillStyle = restColor;
              ctx.lineWidth = 2.4;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              const midY = rest.clef === 'treble' ? (trebleBaseY - 2 * trebleLineStep) : (bassBaseY - 2 * bassLineStep);
              ctx.beginPath();
              ctx.moveTo(restX - 3, midY - 16);
              ctx.lineTo(restX + 4, midY - 7);
              ctx.lineTo(restX - 4, midY + 2);
              ctx.lineTo(restX + 3, midY + 9);
              ctx.arc(restX - 1, midY + 12, 3, 0, Math.PI);
              ctx.stroke();
              ctx.fill();

              ctx.fillStyle = isTrad ? '#475569' : 'rgba(148, 163, 184, 0.45)';
              ctx.font = 'bold 9px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('Pausa 1t', restX, midY - 20);
            } else {
              // Pausa de Colcheia (bandeirola com ponto)
              ctx.strokeStyle = restColor;
              ctx.fillStyle = restColor;
              ctx.lineWidth = 2.2;
              const midY = rest.clef === 'treble' ? (trebleBaseY - 2 * trebleLineStep) : (bassBaseY - 2 * bassLineStep);
              ctx.beginPath();
              ctx.arc(restX - 2, midY - 4, 3.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(restX + 1, midY - 4);
              ctx.quadraticCurveTo(restX + 5, midY + 3, restX - 3, midY + 14);
              ctx.stroke();
            }
            ctx.restore();
          }
        });
      }
      
      // =======================================================================
      // 7.9 CORREDOR DE FOCO ATIVO / ANTECIPAÇÃO VISUAL (Leitura em Movimento)
      // =======================================================================
      const focusWidth = Math.min(width - attackLineX - 20, Math.max(260, pixelsPerBeat * 2.5));
      ctx.save();
      const focusGrad = ctx.createLinearGradient(attackLineX, 0, attackLineX + focusWidth, 0);
      if (isTrad) {
        focusGrad.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
        focusGrad.addColorStop(0.65, 'rgba(37, 99, 235, 0.02)');
        focusGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      } else {
        focusGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        focusGrad.addColorStop(0.65, 'rgba(99, 102, 241, 0.04)');
        focusGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      }
      ctx.fillStyle = focusGrad;
      ctx.fillRect(attackLineX, 36, focusWidth, height - 36);

      // Rótulo discreto no topo
      ctx.fillStyle = isTrad ? 'rgba(29, 78, 216, 0.75)' : 'rgba(56, 189, 248, 0.85)';
      ctx.font = 'bold 8.5px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('ZONA DE LEITURA ➔', attackLineX + 10, 12);
      ctx.restore();

      // =======================================================================
      // 8. BARRA DE ATAQUE FIXA (CURSOR DE LEITURA E EXECUÇÃO)
      // =======================================================================
      ctx.save();
      ctx.strokeStyle = isTrad ? '#2563eb' : '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = isTrad ? 'rgba(37, 99, 235, 0.35)' : '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(attackLineX, 24);
      ctx.lineTo(attackLineX, height - 26);
      ctx.stroke();

      ctx.fillStyle = isTrad ? '#1d4ed8' : '#22d3ee';
      ctx.beginPath();
      ctx.arc(attackLineX, 28, 5.5, 0, Math.PI * 2);
      ctx.arc(attackLineX, height - 30, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // =======================================================================
      // 9. DESENHO DAS NOTAS MUSICAIS: Figuras Clássicas Ampliadas com Desvanecimento
      // =======================================================================
      let fallbackBeats = 0;

      notes.forEach((note, idx) => {
        const noteOffset = timeline.noteOffsets[idx] !== undefined ? timeline.noteOffsets[idx] : fallbackBeats;
        const noteX = attackLineX + (noteOffset * pixelsPerBeat) - scrollOffsetRef.current;
        fallbackBeats += note.duration;

        const noteY = getNoteY(note.midi, note.clef);
        const isCurrentTarget = isDemoMode ? (Math.abs(noteX - attackLineX) < 24) : (idx === currentIndex);
        const hasPassed = isDemoMode ? (noteX < attackLineX - 10) : (idx < currentIndex);
        const isMiddleC = (note.midi === 60);
        const dur = note.duration || 1;

        if (isPlaying && mode === 'wait' && !isDemoMode && isCurrentTarget && noteX <= attackLineX) {
          isPausedWaitingRef.current = true;
        }

        // Se a nota já passou consideravelmente da barra de ataque, desvanece suavemente
        let noteAlpha = 1.0;
        if (noteX < attackLineX) {
          const distPast = attackLineX - noteX;
          // Desvanece completamente antes de colidir com as claves (distância de 75px)
          noteAlpha = Math.max(0, 1 - (distPast / 75)) * 0.35;
        }

        // Pular renderização se a nota estiver totalmente transparente ou fora da tela
        if (noteAlpha > 0.01 && noteX > -40 && noteX < width + 60) {
          const rx = Math.round(noteX);
          const ry = Math.round(noteY);

          ctx.save();
          ctx.globalAlpha = noteAlpha;

          // ===================================================================
          // FAROL / SPOTLIGHT DA NOTA ALVO (Foco Imediato de Leitura)
          // ===================================================================
          if (isCurrentTarget) {
            ctx.save();
            // Halo suave
            ctx.fillStyle = isTrad ? 'rgba(37, 99, 235, 0.14)' : 'rgba(56, 189, 248, 0.22)';
            ctx.beginPath();
            ctx.arc(rx, ry, 16, 0, Math.PI * 2);
            ctx.fill();

            // Anel pulsante
            ctx.strokeStyle = isTrad ? '#2563eb' : '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(rx, ry, 13.5, 0, Math.PI * 2);
            ctx.stroke();

            // Linha guia vertical conectando a cabeça da nota aos badges
            const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
            const targetFingerLineY = isBass ? bassFingerY : trebleFingerY;

            ctx.strokeStyle = isTrad ? 'rgba(37, 99, 235, 0.22)' : 'rgba(56, 189, 248, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(rx, ry + 12);
            ctx.lineTo(rx, targetFingerLineY + 10);
            ctx.stroke();
            ctx.restore();
          }

          // Paleta de Cores da Nota
          let noteColor = isTrad ? '#09090b' : '#e2e8f0';
          if (hasPassed) {
            noteColor = isTrad ? '#64748b' : (isDemoMode ? 'rgba(16, 185, 129, 0.8)' : '#10b981');
          } else if (isCurrentTarget) {
            noteColor = isTrad ? '#2563eb' : (isDemoMode ? '#38bdf8' : '#f43f5e');
            ctx.shadowColor = isTrad ? 'rgba(37, 99, 235, 0.45)' : (isDemoMode ? '#38bdf8' : '#f43f5e');
            ctx.shadowBlur = 8;
          } else if (isMiddleC && !isTrad) {
            noteColor = '#38bdf8';
          }
          ctx.fillStyle = noteColor;
          ctx.strokeStyle = noteColor;

          // A. Linhas Suplementares Formais (Ledger Lines)
          if (isMiddleC) {
            ctx.save();
            ctx.lineWidth = 2.8;
            ctx.strokeStyle = (isCurrentTarget && isTrad) ? '#2563eb' : (isTrad ? '#09090b' : '#38bdf8');
            ctx.beginPath();
            ctx.moveTo(rx - 16, middleCY);
            ctx.lineTo(rx + 16, middleCY);
            ctx.stroke();
            ctx.restore();
          } else if (ry <= (trebleBaseY - 4 * trebleLineStep - 7)) {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = isTrad ? '#09090b' : '#94a3b8';
            for (let ly = trebleBaseY - 4 * trebleLineStep - trebleLineStep; ly >= ry - 1; ly -= trebleLineStep) {
              ctx.beginPath();
              ctx.moveTo(rx - 15, ly);
              ctx.lineTo(rx + 15, ly);
              ctx.stroke();
            }
            ctx.restore();
          } else if (ry >= (bassBaseY + 7)) {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = isTrad ? '#09090b' : '#94a3b8';
            for (let ly = bassBaseY + bassLineStep; ly <= ry + 1; ly += bassLineStep) {
              ctx.beginPath();
              ctx.moveTo(rx - 15, ly);
              ctx.lineTo(rx + 15, ly);
              ctx.stroke();
            }
            ctx.restore();
          }

          // B. Símbolo de Acidente Musical (♯ Sustenido / ♭ Bemol)
          if (note.noteName.includes('#')) {
            ctx.save();
            ctx.font = 'bold 20px serif';
            ctx.textAlign = 'right';
            ctx.fillText('♯', rx - 12, ry + 6);
            ctx.restore();
          } else if (note.noteName.includes('b') || note.noteName.includes('♭')) {
            ctx.save();
            ctx.font = 'bold 20px serif';
            ctx.textAlign = 'right';
            ctx.fillText('♭', rx - 12, ry + 5);
            ctx.restore();
          }

          // C. Máscara de Contraste e Cabeça da Nota (Oval clássica)
          const isWholeNote = dur >= 3.5;
          const isHalfNote = dur >= 1.75 && dur < 3.5;

          // Máscara branca/fundo que evita que linhas da pauta passem por dentro da nota
          ctx.save();
          ctx.fillStyle = isTrad ? '#ffffff' : '#090814';
          ctx.beginPath();
          ctx.ellipse(rx, ry, 12, 8.5, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (isWholeNote) {
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.ellipse(rx, ry, 11, 7.5, -Math.PI / 8, 0, Math.PI * 2);
            if (isTrad) {
              ctx.fillStyle = '#ffffff';
              ctx.fill();
            }
            ctx.stroke();
          } else if (isHalfNote) {
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.ellipse(rx, ry, 10.5, 7, -Math.PI / 8, 0, Math.PI * 2);
            if (isTrad) {
              ctx.fillStyle = '#ffffff';
              ctx.fill();
            }
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.ellipse(rx, ry, 10.5, 7, -Math.PI / 8, 0, Math.PI * 2);
            ctx.fill();
          }

          // D. Haste (Stem) e Bandeirolas (Flags)
          if (!isWholeNote) {
            const middleLineY = note.clef === 'treble' ? (trebleBaseY - 2 * trebleLineStep) : (bassBaseY - 2 * bassLineStep);
            const stemPointsDown = ry <= middleLineY;
            const stemX = stemPointsDown ? rx - 9 : rx + 9;
            const stemStartY = ry;
            const stemLength = 36;
            const stemEndY = stemPointsDown ? ry + stemLength : ry - stemLength;

            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(stemX, stemStartY);
            ctx.lineTo(stemX, stemEndY);
            ctx.stroke();

            if (dur < 0.9 && dur >= 0.4) {
              ctx.lineWidth = 2.4;
              ctx.beginPath();
              if (stemPointsDown) {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 10, stemEndY - 10, stemX + 2, stemEndY - 20);
              } else {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 10, stemEndY + 10, stemX + 2, stemEndY + 20);
              }
              ctx.stroke();
            } else if (dur < 0.4) {
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              if (stemPointsDown) {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 10, stemEndY - 8, stemX + 2, stemEndY - 15);
                ctx.moveTo(stemX, stemEndY - 6);
                ctx.quadraticCurveTo(stemX + 10, stemEndY - 14, stemX + 2, stemEndY - 21);
              } else {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 10, stemEndY + 8, stemX + 2, stemEndY + 15);
                ctx.moveTo(stemX, stemEndY + 6);
                ctx.quadraticCurveTo(stemX + 10, stemEndY + 14, stemX + 2, stemEndY + 21);
              }
              ctx.stroke();
            }
          }

          // E. Ponto de Aumento (Dotted Note)
          const isDotted = Math.abs(dur - 1.5) < 0.05 || Math.abs(dur - 3.0) < 0.05 || Math.abs(dur - 0.75) < 0.05;
          if (isDotted) {
            ctx.beginPath();
            ctx.arc(rx + 15, ry - 1, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // F. Nome da Nota na Linha Estática (Clave de Sol: trebleNoteNameY | Clave de Fá: bassNoteNameY)
          const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
          const targetNoteLineY = isBass ? bassNoteNameY : trebleNoteNameY;
          const targetFingerLineY = isBass ? bassFingerY : trebleFingerY;

          if (displayOptions.showNoteNames) {
            ctx.save();
            const noteInfo = getNoteInfo(note.midi);
            const dynamicName = `${noteInfo.name}${noteInfo.octave}`;
            const labelText = isMiddleC ? `${dynamicName} (Dó Central)` : dynamicName;

            ctx.font = isMiddleC ? 'bold 9.5px JetBrains Mono, monospace' : 'bold 10px JetBrains Mono, monospace';
            const textWidth = ctx.measureText(labelText).width;
            const pillW = Math.max(34, textWidth + 14);
            const pillH = 18;

            if (isTrad) {
              if (isCurrentTarget) {
                ctx.fillStyle = '#dbeafe';
                ctx.strokeStyle = '#2563eb';
                ctx.lineWidth = 1.4;
              } else if (isMiddleC) {
                ctx.fillStyle = '#e0f2fe';
                ctx.strokeStyle = '#0284c7';
                ctx.lineWidth = 1;
              } else {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1;
              }
            } else {
              if (isCurrentTarget) {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.4;
              } else if (isMiddleC) {
                ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1;
              } else {
                ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
                ctx.lineWidth = 1;
              }
            }

            drawRoundedPill(ctx, rx - pillW / 2, targetNoteLineY - pillH / 2, pillW, pillH, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isTrad
              ? (isCurrentTarget ? '#1d4ed8' : (isMiddleC ? '#0369a1' : '#0f172a'))
              : (isCurrentTarget ? '#38bdf8' : (isMiddleC ? '#38bdf8' : '#e2e8f0'));
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, rx, targetNoteLineY);
            ctx.restore();
          }

          // G. Apontamento de Dedo na Linha Estática (Clave de Sol: trebleFingerY | Clave de Fá: bassFingerY)
          if (displayOptions.showFingering) {
            const fingering = getScoreNoteFingering(note, instrument);
            if (fingering) {
              const badgeW = 52;
              const badgeH = 19;
              const cx = rx;
              const badgeY = targetFingerLineY - badgeH / 2;

              ctx.save();
              ctx.fillStyle = fingering.color;
              ctx.beginPath();
              ctx.moveTo(cx - 4, badgeY);
              ctx.lineTo(cx + 4, badgeY);
              ctx.lineTo(cx, badgeY - 4);
              ctx.closePath();
              ctx.fill();

              ctx.shadowColor = isTrad ? 'rgba(0,0,0,0.12)' : fingering.color;
              ctx.shadowBlur = isTrad ? 3 : 6;
              ctx.fillStyle = fingering.color;
              drawRoundedPill(ctx, cx - badgeW / 2, badgeY, badgeW, badgeH, 4.5);
              ctx.fill();
              ctx.shadowBlur = 0;

              ctx.strokeStyle = isTrad ? 'rgba(0,0,0,0.2)' : '#090814';
              ctx.lineWidth = 1;
              ctx.stroke();

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`👆 ${fingering.label}`, cx, targetFingerLineY);
              ctx.restore();
            }
          }

          ctx.restore();
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isPlaying,
    mode,
    tempo,
    timeline,
    notes,
    currentIndex,
    displayOptions,
    restsList,
    numerator,
    denominator,
    beatsPerMeasure,
    instrument,
    isDemoMode,
    autoPlayAudio,
    enableMetronomeSound,
    currentNoteIndex,
    scoreTheme,
    pixelsPerBeat,
    trebleBaseY,
    trebleLineStep,
    middleCY,
    trebleNoteNameY,
    trebleFingerY,
    bassBaseY,
    bassLineStep,
    bassTopY,
    bassNoteNameY,
    bassFingerY,
    attackLineX,
  ]);

  const handlePlayPause = async () => {
    await soundEngine.ensureAudioReady();
    const maxScroll = (timeline.totalBeats + 1) * pixelsPerBeat;
    if (scrollOffsetRef.current >= maxScroll) {
      scrollOffsetRef.current = 0;
      playedNotesRef.current.clear();
      playedBeatsRef.current.clear();
      setCurrentIndex(0);
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (onPlayPauseToggle) onPlayPauseToggle(nextState);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (onPlayPauseToggle) onPlayPauseToggle(false);
    scrollOffsetRef.current = 0;
    playedNotesRef.current.clear();
    playedBeatsRef.current.clear();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    isPausedWaitingRef.current = false;
  };

  const handleTapCurrent = () => {
    if (!isDemoMode && isPlaying && currentIndex < notes.length) {
      triggerNoteHit(currentIndex, 0);
    }
  };

  const currentTargetNote = notes[currentIndex] || null;

  return (
    <div className="w-full space-y-3 select-none no-select">
      {/* 1. Barra de Anotações Didáticas, Símbolos e Seletor de Tema (Tradicional P&B vs Noturno) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold font-display text-slate-300 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Anotações & Símbolos:</span>
          </span>

          {/* Seletor de Tema: Tradicional (P&B Papel) vs Noturno (Escuro) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 shadow-inner">
            <button
              onClick={() => setScoreTheme('traditional')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                scoreTheme === 'traditional'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tema Tradicional de Partitura (Papel Branco e Tinta Preta de Alta Legibilidade)"
            >
              <span>📄 Tradicional (P&B)</span>
            </button>
            <button
              onClick={() => setScoreTheme('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                scoreTheme === 'dark'
                  ? 'bg-purple-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tema Noturno (Fundo Escuro e Iluminação Neon)"
            >
              <span>🌙 Noturno</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          {/* 1. Silêncios / Pausas */}
          <button
            onClick={() => toggleOption('showRests')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showRests
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar pausas e símbolos de silêncio na partitura"
          >
            <span>Silêncios (Pausas):</span>
            <strong className={`font-bold ${displayOptions.showRests ? 'text-amber-200' : 'text-slate-500'}`}>
              {displayOptions.showRests ? 'ON' : 'OFF'}
            </strong>
          </button>

          {/* 2. Posição de Dedo (Dedilhado) */}
          <button
            onClick={() => toggleOption('showFingering')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showFingering
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar indicação de digitação MD e ME"
          >
            <span>Dedilhado (MD/ME):</span>
            <strong className={`font-bold ${displayOptions.showFingering ? 'text-cyan-200' : 'text-slate-500'}`}>
              {displayOptions.showFingering ? 'ON' : 'OFF'}
            </strong>
          </button>

          {/* 3. Nomes das Notas */}
          <button
            onClick={() => toggleOption('showNoteNames')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showNoteNames
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar rótulos das notas C3, E3..."
          >
            <span>Nomes das Notas:</span>
            <strong className={`font-bold ${displayOptions.showNoteNames ? 'text-indigo-200' : 'text-slate-500'}`}>
              {displayOptions.showNoteNames ? 'ON' : 'OFF'}
            </strong>
          </button>

          {/* 4. Divisão de Compassos */}
          <button
            onClick={() => toggleOption('showBarlines')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showBarlines
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar régua superior e barras verticais de divisão do compasso"
          >
            <span>Compassos:</span>
            <strong className={`font-bold ${displayOptions.showBarlines ? 'text-purple-200' : 'text-slate-500'}`}>
              {displayOptions.showBarlines ? 'ON' : 'OFF'}
            </strong>
          </button>

          {/* 5. Marcação de Tempos (1, 2, 3, 4 com Tempo Forte) */}
          <button
            onClick={() => toggleOption('showBeatNumbers')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showBeatNumbers
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar numeração dos tempos (1 Forte, 2 Fraco, 3 Meio-Forte, 4 Fraco)"
          >
            <span>Tempos (1-4):</span>
            <strong className={`font-bold ${displayOptions.showBeatNumbers ? 'text-amber-200' : 'text-slate-500'}`}>
              {displayOptions.showBeatNumbers ? 'ON' : 'OFF'}
            </strong>
          </button>

          {/* 6. Subdivisões Rítmicas ("e" / Contratempos) */}
          <button
            onClick={() => toggleOption('showSubdivisions')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showSubdivisions
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar linhas pontilhadas de subdivisão dos tempos ('e' / contratempos)"
          >
            <span>Subdivisões ("e"):</span>
            <strong className={`font-bold ${displayOptions.showSubdivisions ? 'text-cyan-200' : 'text-slate-500'}`}>
              {displayOptions.showSubdivisions ? 'ON' : 'OFF'}
            </strong>
          </button>

          {/* 7. Cifras / Acordes */}
          <button
            onClick={() => toggleOption('showChords')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              displayOptions.showChords
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs'
                : 'bg-black/30 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
            title="Ativar/desativar símbolos de acordes cifrados"
          >
            <span>Acordes:</span>
            <strong className={`font-bold ${displayOptions.showChords ? 'text-rose-200' : 'text-slate-500'}`}>
              {displayOptions.showChords ? 'ON' : 'OFF'}
            </strong>
          </button>
        </div>
      </div>

      {/* Canvas da Partitura Deslizante (Ocupa Exatamente 100% da Largura, Idêntico ao Teclado) */}
      <div
        ref={containerRef}
        className={`relative w-full h-[420px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
          scoreTheme === 'traditional'
            ? 'border-2 border-slate-300 bg-white shadow-slate-900/10 ring-1 ring-slate-200'
            : 'border border-white/5 bg-[#090814]/95 glass-panel'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={containerWidth}
          height={420}
          className="w-full h-full block cursor-pointer"
          onClick={handleTapCurrent}
        />

        {/* Indicador discreto quando pausado — NÃO ESMAECE A TELA NEM COBRE A PAUTA */}
        {!isPlaying && (
          <div className="absolute top-2.5 right-3 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>PAUSADO — Pauta Pronta</span>
          </div>
        )}
      </div>

      {/* Rótulo da Próxima Tecla & Dedo (100% de Largura com Bordas Sutis — Sempre Visível) */}
      {currentTargetNote && (
        <div className={`w-full px-4 sm:px-5 py-2.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs transition-colors backdrop-blur-md ${
          scoreTheme === 'traditional'
            ? 'bg-white border-slate-300 text-slate-800 shadow-md ring-1 ring-slate-100'
            : 'bg-indigo-950/30 border-indigo-500/20 text-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={scoreTheme === 'traditional' ? 'text-slate-600 font-mono font-bold' : 'text-slate-400 font-mono'}>
              Próxima Nota:
            </span>
            <span className="text-base font-black text-white font-display px-2.5 py-0.5 rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30">
              {currentTargetNote.noteName}
            </span>
            {currentTargetNote.chordName && (
              <span className="text-amber-500 font-bold font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                Acorde: {currentTargetNote.chordName}
              </span>
            )}
          </div>

          {/* Divisão e Posição Rítmica no Compasso */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
              scoreTheme === 'traditional'
                ? 'bg-purple-100 border border-purple-300 text-purple-900'
                : 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
            }`}>
              <span className={scoreTheme === 'traditional' ? 'text-purple-700 font-medium' : 'text-purple-400 font-medium'}>
                Compasso:
              </span>
              <strong className={`text-xs ${scoreTheme === 'traditional' ? 'text-purple-950' : 'text-white'}`}>
                {currentTargetNote.measure || 1}
              </strong>
            </span>
            <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
              scoreTheme === 'traditional'
                ? 'bg-blue-100 border border-blue-300 text-blue-900'
                : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
            }`}>
              <span className={scoreTheme === 'traditional' ? 'text-blue-700 font-medium' : 'text-cyan-400 font-medium'}>
                Tempo:
              </span>
              <strong className={`text-xs ${scoreTheme === 'traditional' ? 'text-blue-950' : 'text-white'}`}>
                {currentTargetNote.beat || 1}
                {currentTargetNote.beat === 1
                  ? ' [Forte]'
                  : currentTargetNote.beat === 3 && beatsPerMeasure === 4
                  ? ' [mForte]'
                  : ' [Fraco]'}
              </strong>
            </span>
            {((currentTargetNote.beat || 1) % 1 !== 0) && (
              <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                scoreTheme === 'traditional'
                  ? 'bg-amber-100 border border-amber-300 text-amber-900'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              }`}>
                <span className={scoreTheme === 'traditional' ? 'text-amber-700 font-medium' : 'text-amber-400 font-medium'}>
                  Subdivisão:
                </span>
                <strong className={`text-xs ${scoreTheme === 'traditional' ? 'text-amber-950' : 'text-amber-200'}`}>
                  Contratempo ("e")
                </strong>
              </span>
            )}

            {feedback && !isDemoMode && (
              <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${feedback.color} ${
                scoreTheme === 'traditional' ? 'bg-slate-100 border border-slate-300' : 'bg-white/10'
              }`}>
                {feedback.text}
              </span>
            )}

            {streak > 1 && !isDemoMode && (
              <span className="px-2.5 py-1 rounded-xl font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                🔥 {streak}x
              </span>
            )}

            {score > 0 && !isDemoMode && (
              <span className={`px-2.5 py-1 rounded-xl font-bold ${
                scoreTheme === 'traditional' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                ⭐ {score} pts
              </span>
            )}
          </div>
        </div>
      )}

      {/* Controles de Reprodução e Andamento (Ocupa 100% de Largura, Idêntico ao Teclado) */}
      <div className={`w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border transition-colors backdrop-blur-md ${
        scoreTheme === 'traditional'
          ? 'bg-white border-slate-300 text-slate-800 shadow-md ring-1 ring-slate-100'
          : 'bg-white/[0.03] border-white/5 text-white'
      }`}>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayPause}
            className={`px-5 py-2.5 rounded-2xl font-black font-display text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Tocar</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className={`p-2.5 rounded-2xl border cursor-pointer transition-colors ${
              scoreTheme === 'traditional'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/5 text-slate-300 hover:text-white'
            }`}
            title="Reiniciar do Início"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Espaçamento / Zoom da Partitura para Leitura Confortável em Movimento */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${
          scoreTheme === 'traditional'
            ? 'bg-slate-100 border-slate-300'
            : 'bg-black/40 border-white/5'
        }`}>
          <span className={`text-[11px] font-mono ${scoreTheme === 'traditional' ? 'text-slate-600 font-bold' : 'text-slate-400'}`}>
            Espaçamento:
          </span>
          <button
            onClick={() => setPixelsPerBeat(p => Math.max(85, p - 10))}
            className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
              scoreTheme === 'traditional'
                ? 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
            title="Mais compassos na tela (visão antecipada ampla)"
          >
            -
          </button>
          <span className={`text-xs font-bold font-mono w-14 text-center ${
            scoreTheme === 'traditional' ? 'text-blue-700' : 'text-cyan-300'
          }`}>
            {pixelsPerBeat}px
          </span>
          <button
            onClick={() => setPixelsPerBeat(p => Math.min(175, p + 10))}
            className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
              scoreTheme === 'traditional'
                ? 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
            title="Mais espaço entre notas"
          >
            +
          </button>
        </div>

        {/* Andamento (BPM) com Steppers [- 5] e [+ 5] */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${
          scoreTheme === 'traditional'
            ? 'bg-slate-100 border-slate-300'
            : 'bg-black/40 border-white/5'
        }`}>
          <span className={`text-[11px] font-mono ${scoreTheme === 'traditional' ? 'text-slate-600 font-bold' : 'text-slate-400'}`}>
            Andamento:
          </span>
          <button
            onClick={() => handleTempoChange(tempo - 5)}
            className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
              scoreTheme === 'traditional'
                ? 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
            title="-5 BPM"
          >
            -
          </button>
          <span className={`text-xs font-bold font-mono w-16 text-center ${
            scoreTheme === 'traditional' ? 'text-blue-700' : 'text-cyan-300'
          }`}>
            {tempo} BPM
          </span>
          <button
            onClick={() => handleTempoChange(tempo + 5)}
            className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
              scoreTheme === 'traditional'
                ? 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
            title="+5 BPM"
          >
            +
          </button>
          <input
            type="range"
            min="40"
            max="180"
            value={tempo}
            onChange={(e) => handleTempoChange(parseInt(e.target.value))}
            className="w-24 sm:w-36 h-1.5 bg-slate-400 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
};