import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../core/soundEngine';
import type { ScoreNote } from '../../core/coursesData';
import { Play, Pause, RotateCcw, Sparkles, Flame, Award } from 'lucide-react';

interface Props {
  notes: ScoreNote[];
  bpm?: number;
  initialMode?: 'wait' | 'flow';
  onNoteHit?: (note: ScoreNote, diffMs: number) => void;
  onLessonComplete?: () => void;
  currentMidiPressed?: number | null;
}

export const ScrollingScoreCanvas: React.FC<Props> = ({
  notes,
  bpm = 75,
  initialMode = 'wait',
  onNoteHit,
  onLessonComplete,
  currentMidiPressed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mode, setMode] = useState<'wait' | 'flow'>(initialMode);
  const [tempo, setTempo] = useState<number>(bpm);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);

  // Offset da partitura em pixels (rolagem da direita para a esquerda)
  const scrollOffsetRef = useRef<number>(0);
  const isPausedWaitingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Mapeamento de notas para posições verticais (Y)
  const trebleBaseY = 90;   // Linha E4
  const trebleLineStep = 10; // Espaçamento entre linhas
  const bassBaseY = 190;    // Linha G2
  const bassLineStep = 10;
  const attackLineX = 140;  // Posição horizontal fixa da barra de ataque
  const pixelsPerBeat = 120; // Espaçamento horizontal por tempo

  const getNoteY = (midi: number): number => {
    if (midi >= 60) {
      const offsetFromE4 = midi - 64;
      return trebleBaseY - (offsetFromE4 * 3.5);
    } else {
      const offsetFromG2 = midi - 43;
      return bassBaseY - (offsetFromG2 * 3.5);
    }
  };

  const triggerNoteHit = useCallback((noteIndex: number, diffMs = 0) => {
    if (noteIndex >= notes.length) return;
    const note = notes[noteIndex];

    soundEngine.playPianoNote(note.midi, 1.2);

    let evaluation = { label: 'PERFEITO!', color: 'text-emerald-400', points: 100 };
    if (Math.abs(diffMs) > 60) {
      evaluation = { label: diffMs > 0 ? 'ATRASADO' : 'ADIANTADO', color: 'text-amber-400', points: 50 };
    } else if (Math.abs(diffMs) > 25) {
      evaluation = { label: 'BOM!', color: 'text-cyan-400', points: 80 };
    }

    setFeedback({ text: evaluation.label, color: evaluation.color });
    setScore(s => s + evaluation.points);
    setStreak(str => {
      const next = str + 1;
      if (next % 5 === 0) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      }
      return next;
    });

    if (onNoteHit) onNoteHit(note, diffMs);

    // Destrava o modo "esperar"
    isPausedWaitingRef.current = false;
    setCurrentIndex(noteIndex + 1);

    if (noteIndex + 1 >= notes.length && onLessonComplete) {
      onLessonComplete();
    }
  }, [notes, onNoteHit, onLessonComplete]);

  // Se o usuário tocou via teclado virtual ou MIDI e for a nota esperada
  useEffect(() => {
    if (currentMidiPressed !== null && isPlaying && currentIndex < notes.length) {
      const target = notes[currentIndex];
      if (currentMidiPressed === target.midi) {
        triggerNoteHit(currentIndex, 0);
      }
    }
  }, [currentMidiPressed, isPlaying, currentIndex, notes, triggerNoteHit]);

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

      // 1. Desenha o Pentagrama de Sol (Treble Staff - 5 Linhas)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        const y = trebleBaseY - i * trebleLineStep;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }

      // Clave de Sol
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 36px serif';
      ctx.fillText('𝄞', 35, trebleBaseY - 10);

      // 2. Desenha o Pentagrama de Fá (Bass Staff - 5 Linhas)
      for (let i = 0; i < 5; i++) {
        const y = bassBaseY - i * bassLineStep;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }

      // Clave de Fá
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 30px serif';
      ctx.fillText('𝄢', 35, bassBaseY - 14);

      // Linha suplementar de Dó Central C4
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(20, 140);
      ctx.lineTo(width - 20, 140);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Barra de Ataque Fixa (Glow Neon Ciano / Violeta)
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

      // 4. Desenha as Notas Musicais Rolando da Direita para a Esquerda
      let cumulativeBeats = 0;

      notes.forEach((note, idx) => {
        const noteX = attackLineX + (cumulativeBeats * pixelsPerBeat) - scrollOffsetRef.current;
        cumulativeBeats += note.duration;

        const noteY = getNoteY(note.midi);
        const isCurrentTarget = (idx === currentIndex);
        const hasPassed = idx < currentIndex;

        if (isPlaying && mode === 'wait' && isCurrentTarget && noteX <= attackLineX) {
          isPausedWaitingRef.current = true;
        }

        if (noteX > -50 && noteX < width + 50) {
          ctx.save();

          if (hasPassed) {
            ctx.fillStyle = '#10b981';
            ctx.strokeStyle = '#10b981';
          } else if (isCurrentTarget) {
            ctx.fillStyle = '#f43f5e';
            ctx.strokeStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 12;
          } else {
            ctx.fillStyle = '#e2e8f0';
            ctx.strokeStyle = '#e2e8f0';
          }

          if (note.midi === 60) {
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(noteX - 12, 140);
            ctx.lineTo(noteX + 12, 140);
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.ellipse(noteX, noteY, 8, 6, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.lineWidth = 1.8;
          ctx.beginPath();
          if (note.clef === 'treble') {
            ctx.moveTo(noteX + 7, noteY);
            ctx.lineTo(noteX + 7, noteY - 26);
          } else {
            ctx.moveTo(noteX - 7, noteY);
            ctx.lineTo(noteX - 7, noteY + 26);
          }
          ctx.stroke();

          ctx.fillStyle = isCurrentTarget ? '#fbbf24' : '#94a3b8';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(note.noteName, noteX, noteY + 20);

          if (note.fingerRightHand) {
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            ctx.fillText(`MD ${note.fingerRightHand}`, noteX, noteY + 32);
          } else if (note.fingerLeftHand) {
            ctx.fillStyle = '#c084fc';
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            ctx.fillText(`ME ${note.fingerLeftHand}`, noteX, noteY + 32);
          }

          if (note.chordName) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 14px Outfit, sans-serif';
            ctx.fillText(note.chordName, noteX, 40);
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
  }, [isPlaying, mode, tempo, currentIndex, notes]);

  const handlePlayPause = () => {
    setIsPlaying(p => !p);
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
    <div className="w-full flex flex-col items-center select-none no-select space-y-4">
      {/* HUD Superior: Modo, Pontuação e Precisão */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
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

        {/* Estatísticas */}
        <div className="flex items-center gap-4 font-mono">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-4 h-4 fill-current" />
            <span>Combo: {streak}x</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Award className="w-4 h-4" />
            <span>Pontos: {score}</span>
          </div>
        </div>
      </div>

      {/* Canvas da Partitura Deslizante */}
      <div className="relative w-full max-w-4xl h-64 rounded-3xl overflow-hidden border border-white/15 shadow-2xl glass-panel">
        <canvas
          ref={canvasRef}
          width={800}
          height={256}
          className="w-full h-full block cursor-pointer"
          onClick={handleTapCurrent}
        />

        {/* Overlay quando pausado */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-xs">
            <Sparkles className="w-8 h-8 text-cyan-400 mb-2" />
            <h4 className="text-base font-bold text-white">Partitura Interativa Deslizante</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              {mode === 'wait'
                ? 'A partitura pausa na barra azul até que você acerte a nota no teclado. Toque "Iniciar" para praticar!'
                : 'A partitura avança continuamente no tempo estipulado. Toque na cabeça do tempo!'}
            </p>
          </div>
        )}
      </div>

      {/* Rótulo da Próxima Tecla & Dedo */}
      {isPlaying && currentTargetNote && (
        <div className="w-full max-w-4xl px-4 py-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Próxima Nota:</span>
            <span className="text-base font-black text-white font-display px-2 py-0.5 rounded-lg bg-indigo-600">
              {currentTargetNote.noteName}
            </span>
            {currentTargetNote.chordName && (
              <span className="text-amber-400 font-bold font-mono">
                Acorde: {currentTargetNote.chordName}
              </span>
            )}
          </div>

          <div className="font-mono text-cyan-300 font-bold">
            {currentTargetNote.fingerRightHand ? `Mão Direita: Dedo ${currentTargetNote.fingerRightHand}` : ''}
            {currentTargetNote.fingerLeftHand ? `Mão Esquerda: Dedo ${currentTargetNote.fingerLeftHand}` : ''}
          </div>
        </div>
      )}

      {/* Controles de Reprodução */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className={`px-5 py-3 rounded-2xl font-black font-display text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
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
                <span>Iniciar Partitura</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Reiniciar do Início"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Andamento (BPM) */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 font-mono">Andamento:</span>
          <span className="text-xs font-bold font-mono text-white">{tempo} BPM</span>
          <input
            type="range"
            min="40"
            max="160"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
