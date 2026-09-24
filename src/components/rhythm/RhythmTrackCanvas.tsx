import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { latencyManager } from '../../core/latencyManager';
import type { RhythmTarget } from '../../core/types';
import { Sparkles, Trophy, Flame } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  bpm: number;
  timeSignature: string;
  onBeatHit?: (diffMs: number, result: string) => void;
  chordName?: string;
}

export const RhythmTrackCanvas: React.FC<Props> = ({
  isPlaying,
  bpm,
  onBeatHit,
  chordName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetsRef = useRef<RhythmTarget[]>([]);
  const lastTargetTimeRef = useRef<number>(0);
  const nextTargetIdRef = useRef<number>(1);
  const animationFrameRef = useRef<number | null>(null);

  // Estatísticas de performance
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{
    text: string;
    color: string;
    diff: number;
  } | null>(null);
  const [stats, setStats] = useState({ perfect: 0, good: 0, off: 0 });

  const speedPixelsPerSec = 280; // Velocidade de descida dos marcadores

  // Limpa os alvos ao reiniciar
  useEffect(() => {
    targetsRef.current = [];
    lastTargetTimeRef.current = performance.now();
  }, [isPlaying, bpm]);

  // Handler de toque / teclado
  const handleUserTap = useCallback(() => {
    if (!isPlaying) return;

    const now = performance.now();
    const targets = targetsRef.current;
    if (targets.length === 0) return;

    // Encontra o alvo não atingido mais próximo
    let closestIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < targets.length; i++) {
      if (!targets[i].hitResult) {
        const diff = Math.abs(now - targets[i].targetTimeMs);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }
    }

    if (closestIndex !== -1 && minDiff < 300) {
      const target = targets[closestIndex];
      const evaluation = latencyManager.evaluateTap(target.targetTimeMs, now);

      target.hitResult = evaluation.result;
      target.hitDiffMs = evaluation.diffMs;

      setLastFeedback({
        text: evaluation.label,
        color: evaluation.color,
        diff: evaluation.diffMs,
      });

      if (evaluation.result === 'perfect') {
        setStreak(s => {
          const next = s + 1;
          if (next > bestStreak) setBestStreak(next);
          if (next % 5 === 0) {
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
          }
          return next;
        });
        setStats(prev => ({ ...prev, perfect: prev.perfect + 1 }));
      } else if (evaluation.result === 'good') {
        setStreak(s => {
          const next = s + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });
        setStats(prev => ({ ...prev, good: prev.good + 1 }));
      } else {
        setStreak(0);
        setStats(prev => ({ ...prev, off: prev.off + 1 }));
      }

      if (onBeatHit) {
        onBeatHit(evaluation.diffMs, evaluation.result);
      }
    }
  }, [isPlaying, bestStreak, onBeatHit]);

  // Listener para barra de espaço
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleUserTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUserTap]);

  // Loop de renderização Canvas a 60fps
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let beatCounter = 1;

    const render = () => {
      const now = performance.now();
      const width = canvas.width;
      const height = canvas.height;
      const hitLineY = height - 60; // Linha de impacto

      // Gerador de novos marcadores no tempo correto
      if (isPlaying) {
        const intervalMs = (60 / bpm) * 1000;
        if (now - lastTargetTimeRef.current >= intervalMs) {
          lastTargetTimeRef.current = now;
          const targetArrivalTime = now + (hitLineY / speedPixelsPerSec) * 1000;

          targetsRef.current.push({
            id: `target-${nextTargetIdRef.current++}`,
            targetTimeMs: targetArrivalTime,
            beatIndex: beatCounter,
            isDownbeat: beatCounter === 1,
            chord: chordName,
          });

          beatCounter = beatCounter >= 4 ? 1 : beatCounter + 1;
        }
      }

      // Limpeza do Canvas
      ctx.clearRect(0, 0, width, height);

      // Fundo com gradiente suave
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0a14');
      bgGrad.addColorStop(1, '#110f24');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Linhas guias verticais (pista)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Linha de Impacto (Hit Line)
      ctx.save();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(20, hitLineY);
      ctx.lineTo(width - 20, hitLineY);
      ctx.stroke();

      // Marcador central na linha de impacto
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(width / 2, hitLineY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Atualiza e desenha marcadores rítmicos que estão caindo
      const currentTargets = targetsRef.current;
      const survivingTargets: RhythmTarget[] = [];

      for (let i = 0; i < currentTargets.length; i++) {
        const t = currentTargets[i];
        // Tempo restante até a linha de impacto
        const timeRemainingSec = (t.targetTimeMs - now) / 1000;
        const y = hitLineY - (timeRemainingSec * speedPixelsPerSec);

        // Se já passou muito da linha de impacto (150ms depois) e não foi tocado -> MISS
        if (now - t.targetTimeMs > 200 && !t.hitResult) {
          t.hitResult = 'miss';
          setStreak(0);
          setStats(prev => ({ ...prev, off: prev.off + 1 }));
          setLastFeedback({
            text: 'PERDIDO!',
            color: 'text-rose-500',
            diff: 0,
          });
        }

        // Se ainda está na tela, desenha
        if (y < height + 40 && y > -40) {
          survivingTargets.push(t);

          ctx.save();
          // Cor do marcador baseada no tempo forte ou resultado
          if (t.hitResult === 'perfect') {
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 16;
          } else if (t.hitResult === 'good') {
            ctx.fillStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 12;
          } else if (t.hitResult === 'early' || t.hitResult === 'late' || t.hitResult === 'miss') {
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 10;
          } else if (t.isDownbeat) {
            ctx.fillStyle = '#f59e0b'; // Dourado no tempo 1
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 14;
          } else {
            ctx.fillStyle = '#818cf8';
            ctx.shadowColor = '#818cf8';
            ctx.shadowBlur = 8;
          }

          // Desenha cápsula do marcador rítmico
          const radius = t.isDownbeat ? 22 : 17;
          ctx.beginPath();
          ctx.arc(width / 2, y, radius, 0, Math.PI * 2);
          ctx.fill();

          // Texto do número do tempo dentro do marcador
          ctx.fillStyle = '#0a0a14';
          ctx.font = `bold ${t.isDownbeat ? '15px' : '13px'} Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.chord ? t.chord : `${t.beatIndex}`, width / 2, y);

          ctx.restore();
        }
      }

      targetsRef.current = survivingTargets;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, bpm, chordName]);

  const totalHits = stats.perfect + stats.good + stats.off;
  const accuracy = totalHits > 0 
    ? Math.round(((stats.perfect + stats.good * 0.7) / totalHits) * 100) 
    : 100;

  return (
    <div className="flex flex-col items-center w-full">
      {/* HUD de Precisão e Sequência */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 mb-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>Combo:</span>
            <span className="font-mono text-white text-sm">{streak}x</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            <span>Melhor: {bestStreak}x</span>
          </div>
        </div>

        {/* Feedback flutuante em tempo real */}
        {lastFeedback && (
          <div className={`font-black font-display text-sm tracking-wide ${lastFeedback.color} animate-bounce`}>
            {lastFeedback.text}
          </div>
        )}

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400">Precisão:</span>
          <span className={`font-bold ${accuracy >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {accuracy}%
          </span>
        </div>
      </div>

      {/* Canvas da Esteira */}
      <div className="relative w-full max-w-md h-80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-panel">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          className="w-full h-full block cursor-pointer"
          onClick={handleUserTap}
        />

        {/* Instrução overlay no canvas */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-xs">
            <Sparkles className="w-10 h-10 text-indigo-400 mb-2" />
            <h4 className="text-base font-bold text-white">Esteira Rítmica Anti-Déficit</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Inicie o metrônomo para ver os marcadores descerem. Pressione a <strong className="text-indigo-400">Barra de Espaço</strong> ou toque no botão no momento exato!
            </p>
          </div>
        )}
      </div>

      {/* Botão Gigante de Toque (Mobile / Touch Friendly) */}
      <button
        onClick={handleUserTap}
        disabled={!isPlaying}
        className={`w-full max-w-md mt-3 py-4 rounded-3xl font-black font-display text-base uppercase tracking-wider shadow-xl transition-all cursor-pointer select-none no-select active:scale-95 ${
          isPlaying
            ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-indigo-500/30'
            : 'bg-white/10 text-slate-500 border border-white/5 cursor-not-allowed'
        }`}
      >
        TOQUE NO RITMO (OU ESPAÇO)
      </button>
    </div>
  );
};
