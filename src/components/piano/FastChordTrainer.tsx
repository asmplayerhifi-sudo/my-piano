import React, { useState, useEffect } from 'react';
import { PianoKeyboard } from './PianoKeyboard';
import { getKeyboardInversions } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { Zap, CheckCircle2, Clock, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChordChallenge {
  id: string;
  symbol: string;
  root: string;
  quality: 'major' | 'minor' | 'maj7' | 'dom7';
  inversion: 0 | 1 | 2;
  instruction: string;
  pivotHint?: string;
  timeLimitSec: number;
}

const CHORD_CHALLENGES: ChordChallenge[] = [
  {
    id: 'c-fund',
    symbol: 'C (Fundamental)',
    root: 'C',
    quality: 'major',
    inversion: 0,
    instruction: 'Monte Dó Maior em Posição Fundamental (Dedo 1 no C4, 3 no E4, 5 no G4)',
    timeLimitSec: 5,
  },
  {
    id: 'f-2inv',
    symbol: 'F/A (2ª Inversão)',
    root: 'F',
    quality: 'major',
    inversion: 2,
    instruction: 'Troque de C para F sem pular a mão! Mantenha o Dedo 1 no Dó (Dedo Âncora).',
    pivotHint: '⚓ Dedo Âncora: Polegar permanece firme no Dó (C3)!',
    timeLimitSec: 4,
  },
  {
    id: 'g-1inv',
    symbol: 'G/B (1ª Inversão)',
    root: 'G',
    quality: 'major',
    inversion: 1,
    instruction: 'Conecte suavemente para Sol Maior em 1ª Inversão (B2 - D3 - G3).',
    pivotHint: '⚓ Dedo Âncora: O Mínimo (5) já está no Sol!',
    timeLimitSec: 4,
  },
  {
    id: 'am-fund',
    symbol: 'Am (Lá Menor)',
    root: 'A',
    quality: 'minor',
    inversion: 0,
    instruction: 'Monte Lá Menor (A2 - C3 - E3). Repare que C e E são notas do acorde de C!',
    pivotHint: '⚓ Dupla Âncora: O Dó e o Mi já estão sob os seus dedos!',
    timeLimitSec: 4,
  },
  {
    id: 'c-1inv',
    symbol: 'C/E (1ª Inversão)',
    root: 'C',
    quality: 'major',
    inversion: 1,
    instruction: 'Dó Maior com o Mi no baixo (E3 - G3 - C4). Dedos 1 - 2 - 5.',
    timeLimitSec: 3,
  },
];

export const FastChordTrainer: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(CHORD_CHALLENGES[0].timeLimitSec);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentChallenge = CHORD_CHALLENGES[challengeIndex];

  // Inversão do acorde atual para o teclado
  const inversions = getKeyboardInversions(currentChallenge.root, currentChallenge.quality === 'minor');
  const targetVoicing = currentChallenge.inversion === 1
    ? inversions.firstInversion
    : currentChallenge.inversion === 2
    ? inversions.secondInversion
    : inversions.fundamental;

  const highlightedKeys = targetVoicing.midi.map((midi, idx) => ({
    midi,
    degreeName: idx === 0 ? '1' : idx === 1 ? '3' : '5',
    finger: targetVoicing.fingeringRH[idx],
  }));

  // Temporizador regressivo
  useEffect(() => {
    let timer: number | null = null;
    if (isActive && timeLeft > 0 && !isSuccess) {
      timer = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSuccess) {
      setIsActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, isSuccess]);

  const handleStart = () => {
    setIsActive(true);
    setIsSuccess(false);
    setTimeLeft(currentChallenge.timeLimitSec);
  };

  const handleConfirmFingering = () => {
    soundEngine.playChord(targetVoicing.midi, 'piano', 1.8);
    setIsSuccess(true);
    setIsActive(false);
    setScore(s => s + 100);
    confetti({ particleCount: 30, spread: 60 });
  };

  const handleNextChallenge = () => {
    const nextIdx = (challengeIndex + 1) % CHORD_CHALLENGES.length;
    setChallengeIndex(nextIdx);
    setIsSuccess(false);
    setIsActive(false);
    setTimeLeft(CHORD_CHALLENGES[nextIdx].timeLimitSec);
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 border border-white/10 space-y-6">
      {/* Header do Treinador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Acelerador de Montagem &amp; Voice Leading</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            Treinador de Troca Rápida com Dedo Âncora
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Fixação neuromuscular: monte o acorde antes do tempo zerar sem deslocar a mão desnecessariamente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            <Trophy className="w-4 h-4" />
            <span>Pontos: {score}</span>
          </div>
        </div>
      </div>

      {/* Cartão do Desafio Atual */}
      <div className="p-5 rounded-3xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Desafio {challengeIndex + 1} de {CHORD_CHALLENGES.length}
          </span>
          <div className="text-2xl font-black font-display text-white flex items-center gap-3">
            <span>{currentChallenge.symbol}</span>
            {isSuccess && <CheckCircle2 className="w-6 h-6 text-emerald-400 inline" />}
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            {currentChallenge.instruction}
          </p>
          {currentChallenge.pivotHint && (
            <div className="text-xs font-bold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-xl border border-cyan-500/30 inline-block mt-1">
              {currentChallenge.pivotHint}
            </div>
          )}
        </div>

        {/* Cronômetro e Botão de Ação */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <Clock className={`w-4 h-4 ${timeLeft <= 2 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-xl font-black font-mono ${timeLeft <= 2 ? 'text-rose-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>

          {!isActive && !isSuccess && (
            <button
              onClick={handleStart}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 cursor-pointer transition-all active:scale-95"
            >
              Iniciar Tempo
            </button>
          )}

          {isActive && !isSuccess && (
            <button
              onClick={handleConfirmFingering}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 cursor-pointer transition-all active:scale-95"
            >
              Armei! (Tocar)
            </button>
          )}

          {isSuccess && (
            <button
              onClick={handleNextChallenge}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all active:scale-95"
            >
              Próximo Acorde ➔
            </button>
          )}
        </div>
      </div>

      {/* Teclado Virtual com o Acorde e Dedilhado Mapeado */}
      <div className="pt-2">
        <PianoKeyboard
          startOctave={2}
          octaveCount={3}
          allowOctaveControls={true}
          highlightedKeys={highlightedKeys}
          onKeyPlay={() => {
            if (isActive && !isSuccess) {
              handleConfirmFingering();
            }
          }}
        />
      </div>
    </div>
  );
};
