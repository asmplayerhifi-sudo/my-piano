import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import type { ScoreNote } from '../../core/coursesData';
import { Play, Pause, RotateCcw, Sparkles, Flame, Award, Clock, Headphones } from 'lucide-react';

export type MidiInputNote = number | { midi: number; timestamp?: number } | null;

interface Props {
  notes: ScoreNote[];
  bpm?: number;
  timeSignature?: string;
  initialMode?: 'wait' | 'flow';
  onNoteHit?: (note: ScoreNote, diffMs: number) => void;
  onLessonComplete?: () => void;
  currentMidiPressed?: MidiInputNote;
  isPlaying?: boolean;
  onPlayPauseToggle?: (playing: boolean) => void;
  onTempoChange?: (tempo: number) => void;
  instrument?: 'piano' | 'guitar';
  toleranceMs?: number;
  isDemoMode?: boolean;
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
  onNoteHit,
  onLessonComplete,
  currentMidiPressed,
  isPlaying: controlledIsPlaying,
  onPlayPauseToggle,
  onTempoChange,
  instrument = 'piano',
  toleranceMs = 70,
  isDemoMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const lastProcessedKeyRef = useRef<string>('');
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;

  const [mode, setMode] = useState<'wait' | 'flow'>(isDemoMode ? 'flow' : initialMode);
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
      return { noteOffsets, measureStartBeats, maxMeasure: 1, totalBeats: 0 };
    }

    let currentMeasure = notes[0]?.measure || 1;
    let currentMeasureStart = 0;
    measureStartBeats.set(currentMeasure, 0);

    let maxBeatInCurrentMeasure = 0;
    let prevNoteMeasure = currentMeasure;

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const m = note.measure || 1;
      const b = (note.beat !== undefined ? Math.max(0, note.beat - 1) : 0);

      if (m !== prevNoteMeasure) {
        currentMeasureStart += Math.max(beatsPerMeasure, maxBeatInCurrentMeasure);
        measureStartBeats.set(m, currentMeasureStart);
        maxBeatInCurrentMeasure = 0;
        prevNoteMeasure = m;
      }

      const noteOffset = currentMeasureStart + b;
      noteOffsets.push(noteOffset);

      const noteEnd = b + (note.duration || 1);
      if (noteEnd > maxBeatInCurrentMeasure) {
        maxBeatInCurrentMeasure = noteEnd;
      }
    }

    const finalMeasure = prevNoteMeasure + 1;
    const finalStart = currentMeasureStart + Math.max(beatsPerMeasure, maxBeatInCurrentMeasure);
    measureStartBeats.set(finalMeasure, finalStart);

    return {
      noteOffsets,
      measureStartBeats,
      maxMeasure: prevNoteMeasure,
      totalBeats: finalStart,
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

  // Mapeamento diatônico preciso para posições verticais (Y) com separação ampla entre pautas
  const trebleBaseY = 94;    // Linha 1 da Clave de Sol (E3), Linha 5 (F4) em Y = 54
  const trebleLineStep = 10; // Espaçamento entre linhas da pauta
  const middleCY = 154;      // Linha suplementar de Dó Central (C3 = MIDI 60)
  const bassBaseY = 230;     // Linha 1 da Clave de Fá (G1)
  const bassLineStep = 10;
  const bassTopY = 190;      // Linha 5 da Clave de Fá (A2)
  const attackLineX = 140;   // Posição horizontal fixa da barra de ataque
  const pixelsPerBeat = 120; // Espaçamento horizontal por tempo

  const getNoteY = (midi: number, clef: 'treble' | 'bass' = 'treble'): number => {
    const SEMITONE_TO_DIATONIC = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
    const semitone = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 2; // Padrão Solfejo Latino / Brasileiro / Yamaha: Dó Central = C3 (MIDI 60)
    const diatonicStep = octave * 7 + SEMITONE_TO_DIATONIC[semitone];

    // Dó Central (C3 = MIDI 60, diatonicStep = 3 * 7 + 0 = 21)
    if (midi === 60) return middleCY;

    if (clef === 'treble' || midi > 60) {
      // E3 tem diatonicStep = 23 e fica exatamente em Y = trebleBaseY (Linha 1 do Treble)
      return trebleBaseY - (diatonicStep - 23) * 5;
    } else {
      // A2 tem diatonicStep = 19 e fica exatamente em Y = bassTopY (Linha 5 do Bass)
      return bassTopY + (19 - diatonicStep) * 5;
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
      const colors = ['', '#f59e0b', '#38bdf8', '#10b981', '#c084fc', '#f43f5e'];
      return {
        finger: f,
        hand: 'MD',
        label: `MD ${f}`,
        fingerName: names[f] || `D${f}`,
        color: colors[f] || '#38bdf8',
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
        color: '#c084fc',
      };
    }

    // 3. Apontamento específico para Violão
    if (instMode === 'guitar') {
      if (note.clef === 'bass' || note.midi <= 52) {
        return { finger: 'P', hand: 'RH', label: 'P', fingerName: 'Polegar', color: '#f59e0b' };
      }
      const midi = note.midi;
      if (midi <= 59) return { finger: 'i', hand: 'RH', label: 'i', fingerName: 'Indicador', color: '#38bdf8' };
      if (midi <= 62) return { finger: 'm', hand: 'RH', label: 'm', fingerName: 'Médio', color: '#10b981' };
      return { finger: 'a', hand: 'RH', label: 'a', fingerName: 'Anelar', color: '#c084fc' };
    }

    // 4. Mapeamento diatônico para Piano (Posição de 5 Dedos)
    const midi = note.midi;
    if (note.clef === 'treble') {
      if (midi === 60) return { finger: 1, hand: 'MD', label: 'MD 1', fingerName: 'Polegar', color: '#f59e0b' };
      if (midi === 62) return { finger: 2, hand: 'MD', label: 'MD 2', fingerName: 'Indicador', color: '#38bdf8' };
      if (midi === 64) return { finger: 3, hand: 'MD', label: 'MD 3', fingerName: 'Médio', color: '#10b981' };
      if (midi === 65) return { finger: 4, hand: 'MD', label: 'MD 4', fingerName: 'Anelar', color: '#c084fc' };
      if (midi >= 67 && midi <= 68) return { finger: 5, hand: 'MD', label: 'MD 5', fingerName: 'Mínimo', color: '#f43f5e' };
      if (midi >= 69) return { finger: 1, hand: 'MD', label: 'MD 1', fingerName: 'Polegar', color: '#f59e0b' };
      return { finger: 1, hand: 'MD', label: 'MD 1', fingerName: 'Polegar', color: '#f59e0b' };
    } else {
      if (midi === 48) return { finger: 5, hand: 'ME', label: 'ME 5', fingerName: 'Mínimo', color: '#f43f5e' };
      if (midi === 50) return { finger: 4, hand: 'ME', label: 'ME 4', fingerName: 'Anelar', color: '#c084fc' };
      if (midi === 52) return { finger: 3, hand: 'ME', label: 'ME 3', fingerName: 'Médio', color: '#10b981' };
      if (midi === 53) return { finger: 2, hand: 'ME', label: 'ME 2', fingerName: 'Indicador', color: '#38bdf8' };
      if (midi === 55) return { finger: 1, hand: 'ME', label: 'ME 1', fingerName: 'Polegar', color: '#f59e0b' };
      return { finger: 3, hand: 'ME', label: 'ME 3', fingerName: 'Médio', color: '#c084fc' };
    }
  };

  const triggerNoteHit = useCallback((noteIndex: number, diffMs = 0) => {
    if (isDemoMode) return;
    if (noteIndex >= notes.length) return;
    const note = notes[noteIndex];

    if (instrument === 'guitar') {
      soundEngine.playGuitarPluck(note.midi, 1.4);
    } else {
      soundEngine.playPianoNote(note.midi, 1.2);
    }

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

    const midi = typeof currentMidiPressed === 'number' ? currentMidiPressed : currentMidiPressed.midi;
    const timestamp = typeof currentMidiPressed === 'number' ? Date.now() : (currentMidiPressed.timestamp ?? Date.now());
    const eventKey = `${midi}_${timestamp}`;

    if (lastProcessedKeyRef.current === eventKey) return;
    lastProcessedKeyRef.current = eventKey;

    // Se o score estava pausado, o primeiro toque pode acordar a partitura
    if (!isPlaying) {
      setIsPlaying(true);
    }

    if (currentIndex < notes.length) {
      const target = notes[currentIndex];
      if (midi === target.midi) {
        triggerNoteHit(currentIndex, 0);
      } else {
        setFeedback({ text: 'Tente novamente', color: 'text-rose-400' });
      }
    }
  }, [currentMidiPressed, isPlaying, currentIndex, notes, triggerNoteHit, isDemoMode]);

  // Loop de Renderização no Canvas a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      }

      // Limpeza do Canvas
      ctx.clearRect(0, 0, width, height);

      // Fundo em gradiente noturno de luxo
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090814');
      bgGrad.addColorStop(1, '#110f22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Desenha o Pentagrama de Sol (Treble Staff - 5 Linhas: 50, 60, 70, 80, 90)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        const y = trebleBaseY - i * trebleLineStep;
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(width - 24, y);
        ctx.stroke();
      }

      // Clave de Sol
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 38px serif';
      ctx.fillText('𝄞', 35, 88);

      // 2. Linha com Destaque Formal para o Dó Central (C4 a Y = 105)
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(24, middleCY);
      ctx.lineTo(width - 24, middleCY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge Formal de Identificação do Dó Central na Pauta
      ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(96, middleCY - 8, 86, 16, 4);
      } else {
        ctx.rect(96, middleCY - 8, 86, 16);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 8.5px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DÓ CENTRAL (C3)', 139, middleCY + 3.5);
      ctx.restore();

      // 3. Desenha o Pentagrama de Fá (Bass Staff - 5 Linhas: 160, 150, 140, 130, 120)
      for (let i = 0; i < 5; i++) {
        const y = bassBaseY - i * bassLineStep;
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(width - 24, y);
        ctx.stroke();
      }

      // Clave de Fá
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 30px serif';
      ctx.fillText('𝄢', 35, 212);

      // Fórmula de Compasso (Time Signature) na Cabeça da Pauta (X = 76)
      ctx.save();
      ctx.font = 'bold 18px Outfit, sans-serif';
      ctx.textAlign = 'center';

      // Treble Staff (Clave de Sol)
      ctx.fillStyle = '#818cf8';
      ctx.fillText(numerator.toString(), 76, 70);
      ctx.fillText(denominator.toString(), 76, 90);

      // Bass Staff (Clave de Fá)
      ctx.fillStyle = '#a855f7';
      ctx.fillText(numerator.toString(), 76, 206);
      ctx.fillText(denominator.toString(), 76, 226);
      ctx.restore();

      // 4. Divisão de Compassos (Barlines), Tempos (1, 2, 3, 4) e Subdivisões ("e")
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
              // Fundo do Compasso Ativo ou Inativo
              if (isCurrentActiveMeasure) {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.16)';
                ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
                ctx.lineWidth = 1.2;
                drawRoundedPill(ctx, rulerLeft + 2, 6, rulerWidth - 4, 18, 4);
                ctx.fill();
                ctx.stroke();

                // Ponto luminoso de compasso em andamento
                ctx.fillStyle = '#22d3ee';
                ctx.beginPath();
                ctx.arc(rulerLeft + 12, 15, 3, 0, Math.PI * 2);
                ctx.fill();

                // Rótulo do Compasso Ativo
                ctx.fillStyle = '#e0e7ff';
                ctx.font = 'bold 9.5px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`COMPASSO ${m} • EM ANDAMENTO`, (rulerLeft + rulerRight) / 2, 18.5);
              } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
                ctx.lineWidth = 1;
                drawRoundedPill(ctx, rulerLeft + 2, 6, rulerWidth - 4, 18, 4);
                ctx.fill();
                ctx.stroke();

                // Rótulo discreto do compasso
                ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
                ctx.font = 'bold 9px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`COMPASSO ${m}`, (rulerLeft + rulerRight) / 2, 18.5);
              }
              ctx.restore();
            }
          }

          // B. Subdivisões Rítmicas dos Tempos ("e" / "+" / Meio-Tempo)
          if (!isFinalBar && displayOptions.showSubdivisions) {
            for (let b = 0; b < beatsPerMeasure; b++) {
              const subBeatX = attackLineX + ((measureBeat + b + 0.5) * pixelsPerBeat) - scrollOffsetRef.current;
              if (subBeatX > -20 && subBeatX < width + 20) {
                ctx.save();
                ctx.setLineDash([1.5, 4]);
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(subBeatX, 46);
                ctx.lineTo(subBeatX, bassBaseY + 8);
                ctx.stroke();

                // Marcador da subdivisão "e" (contratempo colcheia)
                ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
                ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText('e', subBeatX, 42);
                ctx.restore();
              }
            }
          }

          // C. Divisão dos Tempos Internos do Compasso (Pulsos 1, 2, 3, 4...)
          if (!isFinalBar) {
            for (let b = 0; b < beatsPerMeasure; b++) {
              const beatX = attackLineX + ((measureBeat + b) * pixelsPerBeat) - scrollOffsetRef.current;
              if (beatX > -30 && beatX < width + 30) {
                // Tempo 1 é a Cabeça do Compasso (Tempo Forte)
                if (b === 0) {
                  if (displayOptions.showBeatNumbers) {
                    ctx.save();
                    // Badge destacado de Tempo Forte
                    ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
                    ctx.lineWidth = 1;
                    drawRoundedPill(ctx, beatX + 4, 31, 52, 15, 3.5);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#fbbf24';
                    ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('1 [FORTE]', beatX + 30, 42);
                    ctx.restore();
                  }
                } else {
                  // Pulsos 2, 3, 4... Linhas verticais tracejadas
                  ctx.save();
                  ctx.setLineDash([3, 4]);
                  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
                  ctx.lineWidth = 1.2;
                  ctx.beginPath();
                  ctx.moveTo(beatX, 48);
                  ctx.lineTo(beatX, bassBaseY + 8);
                  ctx.stroke();
                  ctx.restore();

                  // Rótulo numérico do tempo (com indicação meio-forte no pulso 3 de 4/4)
                  if (displayOptions.showBeatNumbers) {
                    ctx.save();
                    const isMediumStrong = (b === 2 && beatsPerMeasure === 4);
                    if (isMediumStrong) {
                      ctx.fillStyle = '#a5b4fc';
                      ctx.font = 'bold 8.5px JetBrains Mono, monospace';
                      ctx.textAlign = 'center';
                      ctx.fillText('3 [mF]', beatX, 42);
                    } else {
                      ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
                      ctx.font = 'bold 9px JetBrains Mono, monospace';
                      ctx.textAlign = 'center';
                      ctx.fillText((b + 1).toString(), beatX, 42);
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
              ctx.strokeStyle = '#94a3b8';
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(barX - 6, 26);
              ctx.lineTo(barX - 6, bassBaseY + 8);
              ctx.stroke();

              ctx.lineWidth = 4.5;
              ctx.strokeStyle = '#cbd5e1';
              ctx.beginPath();
              ctx.moveTo(barX, 26);
              ctx.lineTo(barX, bassBaseY + 8);
              ctx.stroke();

              // Badge de Fim
              ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
              ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
              ctx.lineWidth = 1;
              drawRoundedPill(ctx, barX - 16, 28, 32, 16, 4);
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle = '#fda4af';
              ctx.font = 'bold 8.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('FIM', barX, 39.5);
            } else {
              // Barra de Compasso Vertical Padrão (Sólida e Nítida)
              ctx.strokeStyle = isCurrentActiveMeasure ? '#818cf8' : '#64748b';
              ctx.lineWidth = isCurrentActiveMeasure ? 2.2 : 1.8;
              ctx.beginPath();
              ctx.moveTo(barX, 26);
              ctx.lineTo(barX, bassBaseY + 8);
              ctx.stroke();

              // Badge estilizado com o Número do Compasso (c.1, c.2, c.3...)
              const badgeW = m > 9 ? 34 : 28;
              ctx.fillStyle = isCurrentActiveMeasure ? 'rgba(99, 102, 241, 0.35)' : 'rgba(30, 41, 59, 0.85)';
              ctx.strokeStyle = isCurrentActiveMeasure ? 'rgba(129, 140, 248, 0.8)' : 'rgba(148, 163, 184, 0.4)';
              ctx.lineWidth = 1;
              drawRoundedPill(ctx, barX - badgeW / 2, 25, badgeW, 16, 4);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = isCurrentActiveMeasure ? '#ffffff' : '#c7d2fe';
              ctx.font = 'bold 9.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText(`c.${m}`, barX, 36.5);
            }
            ctx.restore();
          }
        });
      }

      // 5. Desenha os Silêncios / Pausas Musicais Formais (Semibreve, Mínima, Semínima, Colcheia)
      if (displayOptions.showRests) {
        restsList.forEach((rest) => {
          const restX = attackLineX + (rest.beatOffset * pixelsPerBeat) - scrollOffsetRef.current;
          if (restX > -40 && restX < width + 40) {
            ctx.save();

            if (rest.duration >= 3) {
              // Pausa de Semibreve (retângulo suspenso sob a 4ª linha da pauta)
              const yHang = rest.clef === 'treble' ? 64 : 200;
              ctx.fillStyle = '#94a3b8';
              ctx.fillRect(restX - 7, yHang, 14, 5.5);

              ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
              ctx.font = 'bold 9px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('Pausa 4t', restX, yHang - 6);
            } else if (rest.duration >= 1.8) {
              // Pausa de Mínima (retângulo apoiado sobre a 3ª linha da pauta)
              const ySit = rest.clef === 'treble' ? 74 : 210;
              ctx.fillStyle = '#94a3b8';
              ctx.fillRect(restX - 7, ySit - 5.5, 14, 5.5);

              ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
              ctx.font = 'bold 9px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('Pausa 2t', restX, ySit - 12);
            } else if (rest.duration >= 0.8) {
              // Pausa de Semínima (zigue-zague estilizado clássico)
              ctx.strokeStyle = '#94a3b8';
              ctx.fillStyle = '#94a3b8';
              ctx.lineWidth = 2.2;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              const midY = rest.clef === 'treble' ? 74 : 210;
              ctx.beginPath();
              ctx.moveTo(restX - 3, midY - 14);
              ctx.lineTo(restX + 3, midY - 6);
              ctx.lineTo(restX - 4, midY + 2);
              ctx.lineTo(restX + 2, midY + 8);
              ctx.arc(restX - 1, midY + 11, 2.5, 0, Math.PI);
              ctx.stroke();
              ctx.fill();

              ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
              ctx.font = 'bold 8.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('Pausa 1t', restX, midY - 18);
            } else {
              // Pausa de Colcheia (bandeirola com ponto)
              ctx.strokeStyle = '#94a3b8';
              ctx.fillStyle = '#94a3b8';
              ctx.lineWidth = 2;
              const midY = rest.clef === 'treble' ? 74 : 210;
              ctx.beginPath();
              ctx.arc(restX - 2, midY - 4, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(restX + 1, midY - 4);
              ctx.quadraticCurveTo(restX + 4, midY + 2, restX - 3, midY + 12);
              ctx.stroke();
            }
            ctx.restore();
          }
        });
      }

      // 6. Barra de Ataque Fixa (Glow Neon Ciano / Violeta)
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(attackLineX, 20);
      ctx.lineTo(attackLineX, height - 30);
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(attackLineX, 24, 5, 0, Math.PI * 2);
      ctx.arc(attackLineX, height - 34, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Desenha as Notas Musicais com Notação Completa e Dó Central Marcado
      let fallbackBeats = 0;

      notes.forEach((note, idx) => {
        const noteOffset = timeline.noteOffsets[idx] !== undefined ? timeline.noteOffsets[idx] : fallbackBeats;
        const noteX = attackLineX + (noteOffset * pixelsPerBeat) - scrollOffsetRef.current;
        fallbackBeats += note.duration;

        const noteY = getNoteY(note.midi, note.clef);
        const isCurrentTarget = isDemoMode ? (Math.abs(noteX - attackLineX) < 22) : (idx === currentIndex);
        const hasPassed = isDemoMode ? (noteX < attackLineX - 10) : (idx < currentIndex);
        const isMiddleC = (note.midi === 60);
        const dur = note.duration || 1;

        if (isPlaying && mode === 'wait' && !isDemoMode && isCurrentTarget && noteX <= attackLineX) {
          isPausedWaitingRef.current = true;
        }

        if (noteX > -50 && noteX < width + 50) {
          ctx.save();

          // Define Paleta de Cores da Nota (Harmônica no Modo Demonstração)
          let noteColor = '#e2e8f0';
          if (hasPassed) {
            noteColor = isDemoMode ? 'rgba(16, 185, 129, 0.8)' : '#10b981';
          } else if (isCurrentTarget) {
            noteColor = isDemoMode ? '#38bdf8' : '#f43f5e';
            ctx.shadowColor = isDemoMode ? '#38bdf8' : '#f43f5e';
            ctx.shadowBlur = 14;
          } else if (isMiddleC) {
            noteColor = '#38bdf8'; // Ciano radiante para Dó Central
          }
          ctx.fillStyle = noteColor;
          ctx.strokeStyle = noteColor;

          // A. Linhas Suplementares Formais (Ledger Lines)
          if (isMiddleC) {
            ctx.save();
            ctx.lineWidth = 2.4;
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(noteX - 14, middleCY);
            ctx.lineTo(noteX + 14, middleCY);
            ctx.stroke();
            ctx.restore();
          } else if (noteY <= trebleBaseY - 40 - 5) {
            // Linhas suplementares acima da pauta de Sol
            ctx.save();
            ctx.lineWidth = 1.6;
            ctx.strokeStyle = '#94a3b8';
            for (let ly = trebleBaseY - 40 - 10; ly >= noteY - 1; ly -= 10) {
              ctx.beginPath();
              ctx.moveTo(noteX - 12, ly);
              ctx.lineTo(noteX + 12, ly);
              ctx.stroke();
            }
            ctx.restore();
          } else if (noteY >= bassBaseY + 5) {
            // Linhas suplementares abaixo da pauta de Fá
            ctx.save();
            ctx.lineWidth = 1.6;
            ctx.strokeStyle = '#94a3b8';
            for (let ly = bassBaseY + 10; ly <= noteY + 1; ly += 10) {
              ctx.beginPath();
              ctx.moveTo(noteX - 12, ly);
              ctx.lineTo(noteX + 12, ly);
              ctx.stroke();
            }
            ctx.restore();
          }

          // B. Símbolo de Acidente Musical (♯ Sustenido / ♭ Bemol)
          if (note.noteName.includes('#')) {
            ctx.save();
            ctx.font = 'bold 16px serif';
            ctx.textAlign = 'right';
            ctx.fillText('♯', noteX - 10, noteY + 5);
            ctx.restore();
          } else if (note.noteName.includes('b') || note.noteName.includes('♭')) {
            ctx.save();
            ctx.font = 'bold 16px serif';
            ctx.textAlign = 'right';
            ctx.fillText('♭', noteX - 10, noteY + 4);
            ctx.restore();
          }

          // C. Cabeça da Nota Autêntica (Aberta / Vazada para Semibreve e Mínima, Sólida para Semínima/Colcheia)
          const isWholeNote = dur >= 3.5;
          const isHalfNote = dur >= 1.75 && dur < 3.5;

          if (isWholeNote) {
            // Semibreve: oval vazada sem haste
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.ellipse(noteX, noteY, 8.5, 6, -Math.PI / 8, 0, Math.PI * 2);
            ctx.stroke();
          } else if (isHalfNote) {
            // Mínima: oval vazada com haste
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.ellipse(noteX, noteY, 8, 5.5, -Math.PI / 8, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Semínima, Colcheia, Semicolcheia: oval preenchida sólida
            ctx.beginPath();
            ctx.ellipse(noteX, noteY, 8, 5.5, -Math.PI / 8, 0, Math.PI * 2);
            ctx.fill();
          }

          // D. Haste (Stem) e Bandeirolas (Flags) da Notação Completa
          if (!isWholeNote) {
            // Regra formal: notas na 3ª linha ou acima têm haste para baixo; abaixo têm haste para cima
            const middleLineY = note.clef === 'treble' ? 74 : 210;
            const stemPointsDown = noteY <= middleLineY;
            const stemX = stemPointsDown ? noteX - 7 : noteX + 7;
            const stemStartY = noteY;
            const stemLength = 28;
            const stemEndY = stemPointsDown ? noteY + stemLength : noteY - stemLength;

            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(stemX, stemStartY);
            ctx.lineTo(stemX, stemEndY);
            ctx.stroke();

            // Bandeirola de Colcheia (dur < 0.9 e dur >= 0.4)
            if (dur < 0.9 && dur >= 0.4) {
              ctx.lineWidth = 2;
              ctx.beginPath();
              if (stemPointsDown) {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 8, stemEndY - 8, stemX + 2, stemEndY - 16);
              } else {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 8, stemEndY + 8, stemX + 2, stemEndY + 16);
              }
              ctx.stroke();
            }
            // Duas Bandeirolas de Semicolcheia (dur < 0.4)
            else if (dur < 0.4) {
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              if (stemPointsDown) {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 8, stemEndY - 6, stemX + 2, stemEndY - 12);
                ctx.moveTo(stemX, stemEndY - 5);
                ctx.quadraticCurveTo(stemX + 8, stemEndY - 11, stemX + 2, stemEndY - 17);
              } else {
                ctx.moveTo(stemX, stemEndY);
                ctx.quadraticCurveTo(stemX + 8, stemEndY + 6, stemX + 2, stemEndY + 12);
                ctx.moveTo(stemX, stemEndY + 5);
                ctx.quadraticCurveTo(stemX + 8, stemEndY + 11, stemX + 2, stemEndY + 17);
              }
              ctx.stroke();
            }
          }

          // E. Ponto de Aumento (Dotted Note)
          const isDotted = Math.abs(dur - 1.5) < 0.05 || Math.abs(dur - 3.0) < 0.05 || Math.abs(dur - 0.75) < 0.05;
          if (isDotted) {
            ctx.beginPath();
            ctx.arc(noteX + 12, noteY - 1, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // F. Destaque Especial e Nome da Nota
          const isBass = note.clef === 'bass' || (!note.clef && note.midi < 60);
          if (displayOptions.showNoteNames) {
            ctx.fillStyle = isCurrentTarget ? '#fbbf24' : isMiddleC ? '#38bdf8' : '#94a3b8';
            ctx.font = isMiddleC ? 'bold 11px Outfit, sans-serif' : 'bold 10.5px Outfit, sans-serif';
            ctx.textAlign = 'center';
            const noteInfo = getNoteInfo(note.midi);
            const dynamicName = `${noteInfo.name}${noteInfo.octave}`;
            const labelText = isMiddleC ? `${dynamicName} (Dó Central)` : dynamicName;
            const nameY = isMiddleC
              ? middleCY + 18
              : isBass
              ? Math.max(bassBaseY + 14, noteY + 18)
              : Math.max(trebleBaseY + 14, noteY + 18);
            ctx.fillText(labelText, noteX, nameY);
          }

          // G. Apontamento de Dedo na Partitura (MD / ME / Violão) - ABAIXO DA PAUTA
          if (displayOptions.showFingering) {
            const fingering = getScoreNoteFingering(note, instrument);
            if (fingering) {
              // Os dedos NÃO ficam em cima do desenho musical, e sim posicionados abaixo da pauta com apontador UP
              const badgeY = isMiddleC
                ? middleCY + 26
                : isBass
                ? Math.max(bassBaseY + 30, noteY + 28)
                : Math.max(trebleBaseY + 30, noteY + 28);
              const badgeW = 46;
              const badgeH = 17;
              const cx = noteX;

              ctx.save();
              // Triângulo apontador voltado para CIMA (em direção à nota/pauta)
              ctx.fillStyle = fingering.color;
              ctx.beginPath();
              ctx.moveTo(cx - 4, badgeY);
              ctx.lineTo(cx + 4, badgeY);
              ctx.lineTo(cx, badgeY - 5);
              ctx.closePath();
              ctx.fill();

              // Cápsula com borda de alto contraste e sombra suave
              ctx.shadowColor = fingering.color;
              ctx.shadowBlur = 6;
              ctx.fillStyle = fingering.color;
              drawRoundedPill(ctx, cx - badgeW / 2, badgeY, badgeW, badgeH, 4.5);
              ctx.fill();
              ctx.shadowBlur = 0;

              ctx.strokeStyle = '#090814';
              ctx.lineWidth = 1.2;
              ctx.stroke();

              // Texto do Dedo com indicação explícita
              ctx.fillStyle = '#090814';
              ctx.font = 'bold 9.5px JetBrains Mono, monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`👆 ${fingering.label}`, cx, badgeY + badgeH / 2);
              ctx.restore();
            }
          }

          // H. Cifras de Acordes
          if (displayOptions.showChords && note.chordName) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 14px Outfit, sans-serif';
            ctx.fillText(note.chordName, noteX, 36);
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
  }, [isPlaying, mode, tempo, currentIndex, notes, containerWidth, timeline, numerator, denominator, beatsPerMeasure, displayOptions, restsList]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    scrollOffsetRef.current = 0;
    isPausedWaitingRef.current = false;
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
  };

  const handleTapCurrent = () => {
    if (!isPlaying) return;
    if (currentIndex < notes.length) {
      triggerNoteHit(currentIndex, 0);
    }
  };

  const currentTargetNote = notes[currentIndex] || notes[0];

  return (
    <div className="w-full flex flex-col items-stretch select-none no-select space-y-3">
      {/* HUD Superior: Modo, Pontuação e Precisão (100% de Largura) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs backdrop-blur-md">
        {isDemoMode ? (
          <>
            {/* Modo Demonstração Sonora: Apenas Audição e Acompanhamento */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 font-bold text-xs">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>Modo Demonstração Sonora</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                Apenas audição e acompanhamento visual • Escuta e avaliação desativadas
              </span>
            </div>

            {/* Compasso & Andamento */}
            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Fórmula: {timeSignature}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {/* Seletor de Modo */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setMode('wait')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    mode === 'wait'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Esperar Pela Nota
                </button>
                <button
                  onClick={() => setMode('flow')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    mode === 'flow'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fluxo Contínuo
                </button>
              </div>

              {/* Feedback Animado */}
              {feedback && (
                <span className={`font-black font-display text-sm tracking-wide ${feedback.color} animate-bounce`}>
                  {feedback.text}
                </span>
              )}
            </div>

            {/* Compasso & Estatísticas */}
            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Fórmula: {timeSignature}</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Flame className="w-4 h-4 fill-current" />
                <span>Combo: {streak}x</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Award className="w-4 h-4" />
                <span>Pontos: {score}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Barra de Filtros de Notação: Opções ON / OFF de Símbolos, Silêncios, Dedilhado e Compassos */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 sm:px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs backdrop-blur-md">
        <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Anotações &amp; Símbolos:</span>
        </span>

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
            title="Ativar/desativar rótulos das notas C4, E4..."
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
        className="relative w-full h-[340px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl glass-panel bg-[#090814]/95"
      >
        <canvas
          ref={canvasRef}
          width={containerWidth}
          height={340}
          className="w-full h-full block cursor-pointer"
          onClick={handleTapCurrent}
        />

        {/* Overlay quando pausado */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-xs">
            <Sparkles className="w-8 h-8 text-cyan-400 mb-2" />
            <h4 className="text-base font-bold text-white font-display">Partitura Interativa Deslizante</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              {mode === 'wait'
                ? 'A partitura pausa na barra azul até que você acerte a nota no teclado. Toque "Iniciar" para praticar!'
                : 'A partitura avança continuamente no tempo estipulado. Toque na cabeça do tempo!'}
            </p>
          </div>
        )}
      </div>

      {/* Rótulo da Próxima Tecla & Dedo (100% de Largura com Bordas Sutis) */}
      {isPlaying && currentTargetNote && (
        <div className="w-full px-4 sm:px-5 py-2.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 font-mono">Próxima Nota:</span>
            <span className="text-base font-black text-white font-display px-2.5 py-0.5 rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30">
              {currentTargetNote.noteName}
            </span>
            {currentTargetNote.chordName && (
              <span className="text-amber-400 font-bold font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                Acorde: {currentTargetNote.chordName}
              </span>
            )}
          </div>

          {/* Divisão e Posição Rítmica no Compasso */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1.5">
              <span className="text-purple-400 font-medium">Compasso:</span>
              <strong className="text-white text-xs">{currentTargetNote.measure || 1}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5">
              <span className="text-cyan-400 font-medium">Tempo:</span>
              <strong className="text-white text-xs">
                {currentTargetNote.beat || 1}
                {currentTargetNote.beat === 1
                  ? ' [Forte]'
                  : currentTargetNote.beat === 3 && beatsPerMeasure === 4
                  ? ' [mForte]'
                  : ' [Fraco]'}
              </strong>
            </span>
            {((currentTargetNote.beat || 1) % 1 !== 0) && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
                <span className="text-amber-400 font-medium">Subdivisão:</span>
                <strong className="text-amber-200 text-xs">Contratempo ("e")</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Controles de Reprodução e Andamento (Ocupa 100% de Largura, Idêntico ao Teclado) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
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
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Reiniciar do Início"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Andamento (BPM) com Steppers [- 5] e [+ 5] */}
        <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-slate-400 font-mono">Andamento:</span>
          <button
            onClick={() => handleTempoChange(tempo - 5)}
            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
            title="-5 BPM"
          >
            -
          </button>
          <span className="text-xs font-bold font-mono text-cyan-300 w-16 text-center">{tempo} BPM</span>
          <button
            onClick={() => handleTempoChange(tempo + 5)}
            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
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
            className="w-24 sm:w-36 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};
