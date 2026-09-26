import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Headphones, Volume2, Bluetooth, CheckCircle2, RotateCcw, Sliders, Play, Plus, Minus } from 'lucide-react';
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
  const [isWaitingNextRound, setIsWaitingNextRound] = useState<boolean>(false);
  const [lastRoundFeedback, setLastRoundFeedback] = useState<string | null>(null);

  const timeoutIdsRef = useRef<number[]>([]);

  const clearPendingTimeouts = () => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, []);

  // Fechar com tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearPendingTimeouts();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectDevice = (type: 'speaker' | 'wired_headphone' | 'bluetooth') => {
    setDeviceType(type);
    const preset = type === 'bluetooth' ? 150 : 0;
    setCalculatedOffset(preset);
  };

  const handleManualOffsetChange = (newVal: number) => {
    const clamped = Math.max(0, Math.min(400, newVal));
    setCalculatedOffset(clamped);
  };

  const handleQuickApply = () => {
    latencyManager.saveProfile({
      deviceType,
      offsetMs: calculatedOffset,
      isCalibrated: true,
    });
    onCalibrated?.(calculatedOffset);
    onClose();
  };

  const startTestRound = async (nextRound: number) => {
    await soundEngine.ensureAudioReady();
    clearPendingTimeouts();
    setRound(nextRound);
    setCurrentBeat(0);
    setIsWaitingNextRound(false);
    setLastRoundFeedback(null);
    setStep('calibrating');

    const bpm = 90;
    const intervalSec = 60 / bpm;
    const audioNow = soundEngine.getCurrentTime();
    const perfNow = performance.now();
    const startAudioTime = audioNow + 0.35;

    // Tempo exato da 4ª batida (alvo cinestésico de alta precisão)
    const targetAudioTime = startAudioTime + 3 * intervalSec;
    const expectedPerfTime = perfNow + (targetAudioTime - audioNow) * 1000;
    setTargetTime(expectedPerfTime);

    // Agenda os 4 cliques no Web Audio e as viradas visuais sincronizadas
    for (let i = 0; i < 4; i++) {
      const beatAudioTime = startAudioTime + i * intervalSec;
      const isFourth = i === 3;

      soundEngine.playMetronomeClick(isFourth, false, beatAudioTime);

      const delayMs = Math.max(0, (beatAudioTime - audioNow) * 1000);
      const tId = window.setTimeout(() => {
        setCurrentBeat(i + 1);
      }, delayMs);
      timeoutIdsRef.current.push(tId);
    }
  };

  const handleTap = () => {
    if (step !== 'calibrating' || isWaitingNextRound || currentBeat < 3) return;
    setIsWaitingNextRound(true);

    const tapNow = performance.now();
    const deltaMs = Math.round(tapNow - targetTime);
    const newAccumulated = [...recordedDeltas, deltaMs];
    setRecordedDeltas(newAccumulated);
    setLastRoundFeedback(`Rodada ${round}: ${deltaMs > 0 ? `+${deltaMs}` : deltaMs}ms`);

    if (round < 3) {
      const tId = window.setTimeout(() => {
        startTestRound(round + 1);
      }, 700);
      timeoutIdsRef.current.push(tId);
    } else {
      // Média aritmética das 3 rodadas
      const avg = Math.round(newAccumulated.reduce((a, b) => a + b, 0) / newAccumulated.length);
      const clampedOffset = Math.max(0, Math.min(400, avg));
      setCalculatedOffset(clampedOffset);
      latencyManager.saveProfile({
        deviceType,
        offsetMs: clampedOffset,
        isCalibrated: true,
      });
      onCalibrated?.(clampedOffset);
      setStep('done');
    }
  };

  const reset = () => {
    clearPendingTimeouts();
    setRecordedDeltas([]);
    setStep('intro');
    setRound(1);
    setCurrentBeat(0);
    setIsWaitingNextRound(false);
    setLastRoundFeedback(null);
  };

  const modalContent = (
    <div
      className="modal-overlay-responsive z-[9999] select-none"
      onClick={() => {
        clearPendingTimeouts();
        onClose();
      }}
    >
      <div
        className="modal-sheet-responsive md:max-w-lg max-h-[90vh] md:max-h-[85vh] overflow-y-auto p-5 sm:p-7 bg-[#0e0d22] border border-indigo-500/40 text-slate-100 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de arraste/indicador visual para mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-2 mb-2 md:hidden shrink-0" />

        {/* Botão Fechar */}
        <button
          onClick={() => {
            clearPendingTimeouts();
            onClose();
          }}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center active:scale-95"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 pr-10">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bluetooth className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Calibrador de Latência de Áudio</h2>
            <p className="text-xs text-slate-400">Compensação de atraso para fones Bluetooth e alto-falantes</p>
          </div>
        </div>

        {/* 1. Modo Intro / Configuração */}
        {step === 'intro' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fones sem fio Bluetooth e caixas de som adicionam um atraso natural entre a reprodução sonora e o toque na tela. 
              Escolha seu dispositivo ou inicie o teste cinestésico de precisão:
            </p>

            {/* Presets Rápidos por Dispositivo */}
            <div className="grid grid-cols-3 gap-2.5 my-3">
              <button
                onClick={() => handleSelectDevice('speaker')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-semibold transition-all cursor-pointer ${
                  deviceType === 'speaker'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Volume2 className="w-5 h-5 text-indigo-400" />
                <span>Alto-falante</span>
                <span className="text-[10px] font-mono text-slate-400">0 ms</span>
              </button>

              <button
                onClick={() => handleSelectDevice('wired_headphone')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-semibold transition-all cursor-pointer ${
                  deviceType === 'wired_headphone'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Headphones className="w-5 h-5 text-indigo-400" />
                <span>Fone com Fio</span>
                <span className="text-[10px] font-mono text-slate-400">0 ms</span>
              </button>

              <button
                onClick={() => handleSelectDevice('bluetooth')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-semibold transition-all cursor-pointer ${
                  deviceType === 'bluetooth'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Bluetooth className="w-5 h-5 text-indigo-400" />
                <span>Bluetooth</span>
                <span className="text-[10px] font-mono text-indigo-300">~150 ms</span>
              </button>
            </div>

            {/* Ajuste Fino Manual */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ajuste Manual do Offset:</span>
                </span>
                <span className="text-white font-mono font-bold text-sm bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                  {calculatedOffset} ms
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleManualOffsetChange(calculatedOffset - 10)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="-10ms"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0"
                  max="350"
                  step="5"
                  value={calculatedOffset}
                  onChange={(e) => handleManualOffsetChange(parseInt(e.target.value, 10))}
                  className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <button
                  onClick={() => handleManualOffsetChange(calculatedOffset + 10)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="+10ms"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ações: Teste de Calibração ou Aplicação Direta */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={() => startTestRound(1)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Teste (3 Rodadas)</span>
              </button>

              <button
                onClick={handleQuickApply}
                className="py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                Salvar ({calculatedOffset}ms)
              </button>
            </div>
          </div>
        )}

        {/* 2. Modo Calibração Interativa (3 Rodadas) */}
        {step === 'calibrating' && (
          <div className="py-4 flex flex-col items-center text-center space-y-5">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-mono font-bold">
                Rodada {round} de 3
              </span>
              {lastRoundFeedback && (
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                  {lastRoundFeedback}
                </span>
              )}
            </div>

            {/* Contagem Visual 1, 2, 3, 4 */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl transition-all duration-100 ${
                    currentBeat === num
                      ? num === 4
                        ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-300'
                        : 'bg-indigo-500 text-white scale-105 shadow-md shadow-indigo-500/40'
                      : 'bg-white/5 text-slate-500 border border-white/10'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Ouça o ritmo 1, 2, 3 e <strong className="text-emerald-400 uppercase">toque exatamente no 4!</strong>
            </p>

            {/* Botão de Toque Gigante e Cinestésico */}
            <button
              onClick={handleTap}
              disabled={isWaitingNextRound}
              className={`w-full h-24 sm:h-28 rounded-3xl font-black text-base sm:text-lg uppercase tracking-wider shadow-xl transition-all cursor-pointer select-none flex items-center justify-center gap-2 ${
                isWaitingNextRound
                  ? 'bg-emerald-600 text-white opacity-80'
                  : currentBeat >= 3
                  ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/40 active:scale-95 animate-pulse'
                  : 'bg-white/10 text-slate-400 border border-white/10 hover:bg-white/15'
              }`}
            >
              {isWaitingNextRound ? 'Processando Toque...' : 'TOQUE AQUI NO TEMPO 4!'}
            </button>
          </div>
        )}

        {/* 3. Modo Concluído */}
        {step === 'done' && (
          <div className="py-3 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">Calibração Concluída!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Compensação de atraso de hardware calculada:
              </p>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 my-2">
                +{calculatedOffset} ms
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Este valor foi gravado no perfil do dispositivo e será automaticamente compensado na esteira rítmica e partituras para pontuação 100% precisa.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recalibrar</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-lg shadow-emerald-500/20"
              >
                Aplicar e Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
