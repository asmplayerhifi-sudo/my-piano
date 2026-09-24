import React, { useState, useEffect, useRef } from 'react';
import { micPitchDetector } from '../../core/pitchDetector';
import type { DetectedPitch } from '../../core/pitchDetector';
import { Mic, MicOff, Activity, Radio, Volume2, ShieldAlert } from 'lucide-react';

interface Props {
  onNoteDetected?: (midi: number, noteName: string) => void;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
}

export const MicrophonePitchBar: React.FC<Props> = ({
  onNoteDetected,
  className = '',
  disabled = false,
  disabledMessage,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPitch, setCurrentPitch] = useState<DetectedPitch | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [sensitivity, setSensitivity] = useState<'high' | 'normal' | 'low'>('normal');

  const onNoteDetectedRef = useRef(onNoteDetected);
  onNoteDetectedRef.current = onNoteDetected;

  const handleToggleMic = async () => {
    setErrorMsg(null);
    if (isActive) {
      micPitchDetector.stop();
      setIsActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
    } else {
      const success = await micPitchDetector.start(
        (pitch) => {
          setCurrentPitch(pitch);
          if (pitch.isNewAttack && onNoteDetectedRef.current) {
            onNoteDetectedRef.current(pitch.midi, pitch.noteName);
          }
        },
        (rms) => {
          // Normaliza RMS (0 a 0.25 para barra de 0 a 100%)
          setVolumeLevel(Math.min(100, Math.round(rms * 400)));
        }
      );

      if (success) {
        setIsActive(true);
      } else {
        setErrorMsg('Permissão do microfone negada ou dispositivo indisponível.');
      }
    }
  };

  const handleSensitivityChange = (level: 'high' | 'normal' | 'low') => {
    setSensitivity(level);
    if (level === 'high') {
      micPitchDetector.setSensitivity(0.010);
    } else if (level === 'normal') {
      micPitchDetector.setSensitivity(0.018);
    } else {
      micPitchDetector.setSensitivity(0.035);
    }
  };

  useEffect(() => {
    if (disabled && isActive) {
      micPitchDetector.stop();
      setIsActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
    }
  }, [disabled, isActive]);

  useEffect(() => {
    return () => {
      micPitchDetector.stop();
    };
  }, []);

  return (
    <div className={`p-4 rounded-3xl glass-card border border-white/10 space-y-3 ${className}`}>
      {/* Banner Informativo quando Desativado (ex: durante demonstração sonora) */}
      {disabled && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-950/40 border border-purple-500/25 text-purple-200 text-xs font-mono">
          <MicOff className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{disabledMessage || 'Escuta do microfone desativada durante a reprodução da demonstração.'}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Lado Esquerdo: Botão de Ativação do Microfone */}
        <div className="flex items-center gap-3">
          <button
            onClick={disabled ? undefined : handleToggleMic}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all ${
              disabled
                ? 'opacity-40 cursor-not-allowed bg-white/5 text-slate-500 border border-white/5'
                : isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse cursor-pointer shadow-lg active:scale-95'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black shadow-emerald-500/20 cursor-pointer shadow-lg active:scale-95'
            }`}
          >
            {isActive ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Desativar Microfone</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Ouvir Meu Teclado Real (Microfone)</span>
              </>
            )}
          </button>

          {isActive && (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              <span>Escutando instrumento ao vivo...</span>
            </div>
          )}
        </div>

        {/* Lado Direito: Seletor de Sensibilidade de Captação */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Filtro de Ruído:</span>
          </span>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-[10px] font-bold">
            <button
              onClick={() => handleSensitivityChange('high')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                sensitivity === 'high' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sensível
            </button>
            <button
              onClick={() => handleSensitivityChange('normal')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                sensitivity === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleSensitivityChange('low')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                sensitivity === 'low' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ambiente Barulhento
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Status e Feedback de Nota em Tempo Real */}
      {isActive && (
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* VU Meter de Volume */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-75 rounded-full ${
                  volumeLevel > 70 ? 'bg-rose-500' : volumeLevel > 25 ? 'bg-emerald-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, volumeLevel)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 w-8">{volumeLevel}%</span>
          </div>

          {/* Destaque da Nota Detectada */}
          {currentPitch ? (
            <div className="flex items-center gap-3 bg-indigo-950/60 border border-indigo-500/40 px-3.5 py-1.5 rounded-2xl animate-pulse">
              <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold">Nota Ouvida:</span>
              <span className="text-base font-black font-display text-white">
                {currentPitch.noteName}
              </span>
              <span className="text-[10px] font-mono text-cyan-300">
                {currentPitch.frequency} Hz
              </span>
              <span className="text-[9px] font-mono bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded-md">
                {currentPitch.clarity}% clareza
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              Toque qualquer tecla no seu piano acústico ou teclado elétrico para o app reconhecer...
            </span>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
