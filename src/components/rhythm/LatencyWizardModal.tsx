import React, { useState } from 'react';
import { X, Headphones, Volume2, Bluetooth, CheckCircle2, RotateCcw } from 'lucide-react';
import { latencyManager } from '../../core/latencyManager';
import { soundEngine } from '../../core/soundEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCalibrated?: (newOffset: number) => void;
}

export const LatencyWizardModal: React.FC<Props> = ({ isOpen, onClose, onCalibrated }) => {
  const [deviceType, setDeviceType] = useState<'speaker' | 'wired_headphone' | 'bluetooth'>('bluetooth');
  const [step, setStep] = useState<'intro' | 'calibrating' | 'done'>('intro');
  const [round, setRound] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [recordedDeltas, setRecordedDeltas] = useState<number[]>([]);
  const [calculatedOffset, setCalculatedOffset] = useState<number>(latencyManager.getOffsetMs());
  const [targetTime, setTargetTime] = useState<number>(0);

  if (!isOpen) return null;

  const startTestRound = (nextRound: number) => {
    setRound(nextRound);
    setCurrentBeat(0);
    setStep('calibrating');

    const bpm = 90;
    const intervalSec = 60 / bpm;
    const startAudioTime = soundEngine.getCurrentTime() + 0.3;

    // Agenda os cliques 1, 2, 3 e 4
    for (let i = 0; i < 4; i++) {
      const beatTime = startAudioTime + i * intervalSec;
      const isFourth = (i === 3);

      soundEngine.playMetronomeClick(isFourth, false, beatTime);

      // Sincroniza visual
      const delayMs = (beatTime - soundEngine.getCurrentTime()) * 1000;
      setTimeout(() => {
        setCurrentBeat(i + 1);
        if (isFourth) {
          setTargetTime(performance.now());
        }
      }, delayMs);
    }
  };

  const handleTap = () => {
    if (step !== 'calibrating' || currentBeat < 3) return;

    const tapNow = performance.now();
    const deltaMs = tapNow - targetTime;
    const newAccumulated = [...recordedDeltas, deltaMs];
    setRecordedDeltas(newAccumulated);

    if (round < 3) {
      setTimeout(() => {
        startTestRound(round + 1);
      }, 700);
    } else {
      // Média dos 3 testes
      const avg = Math.round(newAccumulated.reduce((a, b) => a + b, 0) / newAccumulated.length);
      const clampedOffset = Math.max(0, Math.min(400, avg));
      setCalculatedOffset(clampedOffset);
      latencyManager.saveProfile({
        deviceType,
        offsetMs: clampedOffset,
        isCalibrated: true,
      });
      if (onCalibrated) onCalibrated(clampedOffset);
      setStep('done');
    }
  };

  const reset = () => {
    setRecordedDeltas([]);
    setStep('intro');
    setRound(1);
    setCurrentBeat(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 rounded-3xl glass-card border border-indigo-500/30 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bluetooth className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Calibrador de Latência de Áudio</h2>
            <p className="text-xs text-slate-400">Compensação de atraso para fones Bluetooth e alto-falantes</p>
          </div>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Fones sem fio Bluetooth e alto-falantes adicionam um atraso natural entre o som e o seu toque na tela. 
              Este assistente vai disparar <strong className="text-indigo-300">4 cliques</strong>. Toque no botão exatamente no <strong className="text-emerald-300">4º clique</strong>.
            </p>

            <div className="grid grid-cols-3 gap-3 my-4">
              <button
                onClick={() => setDeviceType('speaker')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2 border text-xs font-semibold transition-all ${
                  deviceType === 'speaker'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <span>Alto-falante</span>
              </button>

              <button
                onClick={() => setDeviceType('wired_headphone')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2 border text-xs font-semibold transition-all ${
                  deviceType === 'wired_headphone'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Headphones className="w-5 h-5" />
                <span>Fone com Fio</span>
              </button>

              <button
                onClick={() => setDeviceType('bluetooth')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2 border text-xs font-semibold transition-all ${
                  deviceType === 'bluetooth'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Bluetooth className="w-5 h-5" />
                <span>Bluetooth (~150ms)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
              <p>Offset atual configurado: <strong className="text-white font-mono">{calculatedOffset} ms</strong></p>
            </div>

            <button
              onClick={() => startTestRound(1)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              Iniciar Teste de Calibração (3 Rodadas)
            </button>
          </div>
        )}

        {step === 'calibrating' && (
          <div className="py-6 flex flex-col items-center text-center space-y-6">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-mono">
              Rodada {round} de 3
            </span>

            <div className="flex gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl transition-all duration-100 ${
                    currentBeat === num
                      ? num === 4
                        ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/50'
                        : 'bg-indigo-500 text-white scale-105'
                      : 'bg-white/5 text-slate-500 border border-white/10'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-300">
              Ouça o ritmo 1, 2, 3 e <strong className="text-emerald-400">TOQUE NO 4!</strong>
            </p>

            <button
              onClick={handleTap}
              className="w-full h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-lg uppercase tracking-wider shadow-xl shadow-emerald-500/30 active:scale-95 transition-transform cursor-pointer select-none"
            >
              TOQUE AQUI NO TEMPO 4!
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="py-4 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-display text-white">Calibração Concluída com Sucesso!</h3>
              <p className="text-sm text-slate-400 mt-1">
                Compensação de atraso de hardware calculada:
              </p>
              <div className="text-4xl font-black font-mono text-emerald-400 my-2">
                +{calculatedOffset} ms
              </div>
              <p className="text-xs text-slate-400">
                Este valor será automaticamente descontado na esteira rítmica para garantir pontuação 100% justa.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recalibrar</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Aplicar e Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
