import React, { useState, useEffect, useRef } from 'react';
import { micPitchDetector, MicrophonePitchDetector } from '../../core/pitchDetector';
import type { DetectedPitch } from '../../core/pitchDetector';
import { Mic, MicOff, Activity, Radio, ShieldAlert, Cable, Sliders } from 'lucide-react';

interface Props {
  onNoteDetected?: (midi: number, noteName: string) => void;
  onNoteHold?: (midi: number | null, noteName?: string) => void;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
  expectedMidi?: number | null;
  expectedNoteName?: string;
  isErrorActive?: boolean;
}

export const MicrophonePitchBar: React.FC<Props> = ({
  onNoteDetected,
  onNoteHold,
  className = '',
  disabled = false,
  disabledMessage,
  expectedMidi,
  expectedNoteName,
  isErrorActive = false,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPitch, setCurrentPitch] = useState<DetectedPitch | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [sensitivityPercent, setSensitivityPercent] = useState<number>(() => micPitchDetector.getSensitivityPercent());
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const onNoteDetectedRef = useRef(onNoteDetected);
  onNoteDetectedRef.current = onNoteDetected;

  const onNoteHoldRef = useRef(onNoteHold);
  onNoteHoldRef.current = onNoteHold;

  // Carrega dispositivos de entrada de áudio (microfone integrado, cabo auxiliar ou interface USB)
  useEffect(() => {
    MicrophonePitchDetector.getAvailableAudioDevices().then((devices) => {
      setAudioDevices(devices);
      if (devices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(devices[0].deviceId);
      }
    });
  }, []);

  const handleToggleMic = async () => {
    setErrorMsg(null);
    if (isActive) {
      micPitchDetector.stop();
      setIsActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
      if (onNoteHoldRef.current) {
        onNoteHoldRef.current(null);
      }
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
        },
        (activeMidi, noteName) => {
          if (onNoteHoldRef.current) {
            onNoteHoldRef.current(activeMidi, noteName || undefined);
          }
        },
        selectedDeviceId || undefined
      );

      if (success) {
        setIsActive(true);
        // Recarrega lista com nomes reais autorizados pelo navegador
        MicrophonePitchDetector.getAvailableAudioDevices().then(setAudioDevices);
      } else {
        setErrorMsg('Permissão de áudio não concedida. No Android ou Navegador, autorize o acesso ao microfone/dispositivo USB.');
      }
    }
  };

  const handleSensitivityPercentChange = (val: number) => {
    const clamped = Math.max(5, Math.min(100, val));
    setSensitivityPercent(clamped);
    micPitchDetector.setSensitivityPercent(clamped);
  };

  const handleSensitivityPreset = (preset: 'low' | 'normal' | 'high') => {
    let p = 55;
    if (preset === 'low') p = 25;
    if (preset === 'high') p = 85;
    handleSensitivityPercentChange(p);
  };

  useEffect(() => {
    if (disabled && isActive) {
      micPitchDetector.stop();
      setIsActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
      if (onNoteHoldRef.current) {
        onNoteHoldRef.current(null);
      }
    }
  }, [disabled, isActive]);

  useEffect(() => {
    return () => {
      micPitchDetector.stop();
      if (onNoteHoldRef.current) {
        onNoteHoldRef.current(null);
      }
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

        {/* Lado Direito: Seletor de Dispositivo (USB/Cabo/Mic) + Filtro de Sensibilidade */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {audioDevices.length > 1 && (
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
              <Cable className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={selectedDeviceId}
                onChange={(e) => {
                  setSelectedDeviceId(e.target.value);
                  if (isActive) {
                    handleToggleMic();
                  }
                }}
                className="bg-transparent text-[10px] text-slate-200 font-mono focus:outline-none cursor-pointer"
                title="Selecione o Microfone, Cabo Auxiliar ou Interface USB"
              >
                {audioDevices.map((dev, idx) => (
                  <option key={dev.deviceId || idx} value={dev.deviceId} className="bg-slate-900 text-white">
                    {dev.label ? (dev.label.length > 25 ? dev.label.substring(0, 25) + '...' : dev.label) : `Entrada ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ajuste de Sensibilidade do Microfone */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] font-mono font-bold whitespace-nowrap">Sensibilidade:</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                sensitivityPercent >= 70
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : sensitivityPercent <= 35
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {sensitivityPercent}%
              </span>
            </div>

            {/* Slider de Sensibilidade */}
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={sensitivityPercent}
              onChange={(e) => handleSensitivityPercentChange(Number(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              title={`Ajuste de sensibilidade: ${sensitivityPercent}%`}
            />

            {/* Presets Rápidos */}
            <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/10 text-[9px] font-bold">
              <button
                onClick={() => handleSensitivityPreset('high')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  sensitivityPercent >= 70 ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Alta Sensibilidade: detecta sons suaves e toques delicados"
              >
                Alta
              </button>
              <button
                onClick={() => handleSensitivityPreset('normal')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  sensitivityPercent > 35 && sensitivityPercent < 70 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Sensibilidade Normal: uso recomendado"
              >
                Normal
              </button>
              <button
                onClick={() => handleSensitivityPreset('low')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  sensitivityPercent <= 35 ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Baixa Sensibilidade: para ambientes barulhentos"
              >
                Baixa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Status e Feedback de Nota em Tempo Real */}
      {isActive && (() => {
        const hasTarget = expectedMidi !== undefined && expectedMidi !== null;
        const isMatch = currentPitch && hasTarget && currentPitch.midi === expectedMidi;
        const isWrong = (currentPitch && hasTarget && currentPitch.midi !== expectedMidi) || isErrorActive;
        const cents = currentPitch
          ? Math.round((69 + 12 * Math.log2(currentPitch.frequency / 440) - currentPitch.midi) * 100)
          : 0;

        return (
          <div className="pt-2 border-t border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
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

            {/* Amostrador de Alta Resolução de Nota Ouvida */}
            {currentPitch ? (
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all animate-fade-in ${
                  isWrong
                    ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 shadow-lg shadow-rose-950/50 animate-pulse'
                    : isMatch
                    ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-950/50'
                    : 'bg-indigo-950/60 border-indigo-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md ${
                    isWrong
                      ? 'bg-rose-500 text-white'
                      : isMatch
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-indigo-500/30 text-indigo-300'
                  }`}>
                    {isWrong ? '✕ NOTA ERRADA' : isMatch ? '✔ NOTA CORRETA' : '♫ AMOSTRADOR'}
                  </span>
                  <span className="text-xl font-black font-display text-white">
                    {currentPitch.noteName}
                  </span>
                </div>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-cyan-300 font-bold">{currentPitch.frequency} Hz</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    Math.abs(cents) <= 8
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {Math.abs(cents) <= 8 ? '● Afinada' : cents > 0 ? `+${cents}ct ♯` : `${cents}ct ♭`}
                  </span>
                </div>

                {isWrong && expectedNoteName && (
                  <span className="text-[10px] font-mono font-black text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded-lg border border-rose-500/40">
                    A partitura pede: {expectedNoteName}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Amostrador ativo: toque qualquer tecla no seu piano acústico ou teclado elétrico...
              </span>
            )}
          </div>
        );
      })()}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
