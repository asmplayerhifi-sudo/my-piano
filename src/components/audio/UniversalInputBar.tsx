import React, { useState, useEffect, useRef, useMemo } from 'react';
import { micPitchDetector, MicrophonePitchDetector } from '../../core/pitchDetector';
import type { DetectedPitch } from '../../core/pitchDetector';
import { polyphonicChordDetector } from '../../core/chordDetector';
import type { DetectedChord } from '../../core/chordDetector';
import { getNoteInfo, identifyChordFromMidi, type IdentifiedChord } from '../../core/musicTheory';
import { octaveConfigStore, useOctaveStandard } from '../../core/octaveConfigStore';
import {
  audioInputConfigStore,
  useAudioInputConfig,
  type InputModeType,
} from '../../core/audioInputConfigStore';
import {
  midiManager,
  type MidiDevice,
  type MidiEventPayload,
} from '../../core/midiManager';
import {
  Mic,
  MicOff,
  Activity,
  Radio,
  ShieldAlert,
  Cable,
  Sliders,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export interface UniversalInputBarProps {
  onNoteDetected?: (midi: number, noteName: string) => void;
  onNoteHold?: (midi: number | null, noteName?: string) => void;
  onChordDetected?: (chord: IdentifiedChord, midiNotes: number[]) => void;
  onAcousticChordNotesChange?: (notes: number[]) => void;
  onClapDetected?: () => void;
  onOnsetDetected?: (rms: number) => void;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
  expectedMidi?: number | null;
  expectedNoteName?: string;
  expectedChordName?: string;
  expectedChordNotes?: number[];
  isErrorActive?: boolean;
  customLabel?: string;
  // Controles de Compasso e Pauta (ex: Editor de Partitura)
  activeMeasureNumber?: number;
  totalMeasures?: number;
  onSelectMeasure?: (measureIndex: number) => void;
  showMeasureControls?: boolean;
}

export const UniversalInputBar: React.FC<UniversalInputBarProps> = ({
  onNoteDetected,
  onNoteHold,
  onChordDetected,
  onAcousticChordNotesChange,
  onClapDetected,
  onOnsetDetected,
  className = '',
  disabled = false,
  disabledMessage,
  expectedMidi,
  expectedNoteName,
  expectedChordName,
  expectedChordNotes,
  isErrorActive = false,
  customLabel,
  activeMeasureNumber,
  totalMeasures,
  onSelectMeasure,
  showMeasureControls = false,
}) => {
  const octaveStandard = useOctaveStandard();
  const inputConfig = useAudioInputConfig();
  const currentMode = inputConfig.inputMode;

  // ── Estados de Microfone Acústico ──────────────────────────────────────────
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);
  const [currentPitch, setCurrentPitch] = useState<DetectedPitch | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [recentAcousticNotes, setRecentAcousticNotes] = useState<Map<number, number>>(new Map());
  const [polyphonicChord, setPolyphonicChord] = useState<DetectedChord | null>(null);

  // ── Estados de Entrada MIDI ────────────────────────────────────────────────
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [isSearchingMidi, setIsSearchingMidi] = useState<boolean>(false);
  const [lastMidiPayload, setLastMidiPayload] = useState<MidiEventPayload | null>(null);
  const [activeMidiKeys, setActiveMidiKeys] = useState<Set<number>>(new Set());

  // ── Refs de Callbacks ──────────────────────────────────────────────────────
  const onNoteDetectedRef = useRef(onNoteDetected);
  onNoteDetectedRef.current = onNoteDetected;

  const onNoteHoldRef = useRef(onNoteHold);
  onNoteHoldRef.current = onNoteHold;

  const onChordDetectedRef = useRef(onChordDetected);
  onChordDetectedRef.current = onChordDetected;

  const onAcousticChordNotesChangeRef = useRef(onAcousticChordNotesChange);
  onAcousticChordNotesChangeRef.current = onAcousticChordNotesChange;

  const onClapDetectedRef = useRef(onClapDetected);
  onClapDetectedRef.current = onClapDetected;

  const onOnsetDetectedRef = useRef(onOnsetDetected);
  onOnsetDetectedRef.current = onOnsetDetected;

  // ── Inicialização e Subscrição MIDI ────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    if (midiManager.checkSupport()) {
      midiManager.initialize().then(() => {
        if (isMounted) {
          setMidiDevices(midiManager.getDevices());
        }
      });
    }

    const unsubDevices = midiManager.subscribeDevices((devices) => {
      if (isMounted) {
        setMidiDevices(devices);
      }
    });

    const unsubMidi = midiManager.subscribe((payload: MidiEventPayload) => {
      if (!isMounted) return;

      // Respeita filtro de canal MIDI se configurado (0 = OMNI / Todos)
      const currentConfig = audioInputConfigStore.getSnapshot();
      if (
        currentConfig.midiChannel !== 0 &&
        payload.channel !== currentConfig.midiChannel
      ) {
        return;
      }

      if (payload.isDown) {
        setLastMidiPayload(payload);
        setActiveMidiKeys((prev) => {
          const next = new Set(prev);
          next.add(payload.midi);
          return next;
        });

        // Dispara nota detectada para a partitura / avaliador
        onNoteDetectedRef.current?.(payload.midi, payload.noteName);
        onNoteHoldRef.current?.(payload.midi, payload.noteName);
      } else {
        setActiveMidiKeys((prev) => {
          const next = new Set(prev);
          next.delete(payload.midi);
          return next;
        });

        if (activeMidiKeys.size <= 1) {
          onNoteHoldRef.current?.(null);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubDevices();
      unsubMidi();
    };
  }, []);

  // ── Detecção Manual de Dispositivos MIDI ───────────────────────────────────
  const handleDetectMidi = async () => {
    setIsSearchingMidi(true);
    try {
      await midiManager.initialize();
      setMidiDevices(midiManager.getDevices());
    } finally {
      setTimeout(() => setIsSearchingMidi(false), 500);
    }
  };

  // ── Buffer de Notas Acústicas (Microfone) ───────────────────────────────────
  const registerAcousticNote = (midi: number) => {
    setRecentAcousticNotes((prev) => {
      const next = new Map(prev);
      next.set(midi, Date.now() + 900);
      return next;
    });
  };

  useEffect(() => {
    if (!isMicActive) {
      setRecentAcousticNotes(new Map());
      return;
    }
    const timer = setInterval(() => {
      const now = Date.now();
      setRecentAcousticNotes((prev) => {
        let changed = false;
        const next = new Map(prev);
        for (const [m, expiry] of next) {
          if (now >= expiry) {
            next.delete(m);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [isMicActive]);

  const activeAcousticMidis = useMemo(
    () => Array.from(recentAcousticNotes.keys()),
    [recentAcousticNotes]
  );

  useEffect(() => {
    onAcousticChordNotesChangeRef.current?.(activeAcousticMidis);
  }, [activeAcousticMidis]);

  const liveDetectedChord = useMemo(() => {
    if (activeAcousticMidis.length >= 2) {
      return identifyChordFromMidi(activeAcousticMidis, octaveStandard);
    }
    return null;
  }, [activeAcousticMidis, octaveStandard]);

  useEffect(() => {
    if (liveDetectedChord) {
      onChordDetectedRef.current?.(liveDetectedChord, activeAcousticMidis);
    }
  }, [liveDetectedChord, activeAcousticMidis]);

  // Carrega dispositivos de entrada de áudio
  useEffect(() => {
    MicrophonePitchDetector.getAvailableAudioDevices().then((devices) => {
      setAudioDevices(devices);
      if (devices.length > 0 && !audioInputConfigStore.getSnapshot().selectedDeviceId) {
        audioInputConfigStore.setSelectedDeviceId(devices[0].deviceId);
      }
    });
  }, []);

  // ── Alternar Microfone ─────────────────────────────────────────────────────
  const handleToggleMic = async () => {
    setMicErrorMsg(null);
    if (isMicActive) {
      micPitchDetector.stop();
      polyphonicChordDetector.stop();
      setIsMicActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
      setPolyphonicChord(null);
      onNoteHoldRef.current?.(null);
    } else {
      const success = await micPitchDetector.start(
        (pitch) => {
          setCurrentPitch(pitch);
          registerAcousticNote(pitch.midi);
          if (pitch.isNewAttack && onNoteDetectedRef.current) {
            onNoteDetectedRef.current(pitch.midi, pitch.noteName);
          }
        },
        (rms) => {
          setVolumeLevel(Math.min(100, Math.round(rms * 400)));
        },
        (activeMidi, noteName) => {
          if (activeMidi !== null) registerAcousticNote(activeMidi);
          onNoteHoldRef.current?.(activeMidi, noteName || undefined);
        },
        inputConfig.selectedDeviceId || undefined,
        (rms) => {
          onClapDetectedRef.current?.();
          onOnsetDetectedRef.current?.(rms);
        },
        (stream) => {
          polyphonicChordDetector.start(stream, (chord) => {
            setPolyphonicChord(chord);
            if (chord) {
              onAcousticChordNotesChangeRef.current?.(chord.estimatedMidiNotes);
              if (onChordDetectedRef.current) {
                const identified: IdentifiedChord = {
                  symbol: `${chord.rootName}${chord.suffix}`,
                  namePt: `${chord.rootName} ${chord.quality}`,
                  root: chord.rootName,
                  quality: chord.quality as IdentifiedChord['quality'],
                  notesPt: [],
                  isInversion: false,
                };
                onChordDetectedRef.current(identified, chord.estimatedMidiNotes);
              }
            } else {
              onAcousticChordNotesChangeRef.current?.([]);
            }
          });
        }
      );

      if (success) {
        setIsMicActive(true);
        MicrophonePitchDetector.getAvailableAudioDevices().then(setAudioDevices);
      } else {
        setMicErrorMsg(
          'Permissão de áudio não concedida. No Android ou Navegador, autorize o acesso ao microfone/dispositivo USB.'
        );
      }
    }
  };

  // Desativa microfone se a prop disabled for ativada
  useEffect(() => {
    if (disabled && isMicActive) {
      micPitchDetector.stop();
      polyphonicChordDetector.stop();
      setIsMicActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
      setPolyphonicChord(null);
      onNoteHoldRef.current?.(null);
    }
  }, [disabled, isMicActive]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      micPitchDetector.stop();
      polyphonicChordDetector.stop();
      onNoteHoldRef.current?.(null);
    };
  }, []);

  // ── Mudança de Modo de Entrada ─────────────────────────────────────────────
  const handleModeChange = (newMode: InputModeType) => {
    if (newMode !== 'mic' && isMicActive) {
      micPitchDetector.stop();
      polyphonicChordDetector.stop();
      setIsMicActive(false);
      setCurrentPitch(null);
      setVolumeLevel(0);
      setPolyphonicChord(null);
      onNoteHoldRef.current?.(null);
    }
    audioInputConfigStore.setInputMode(newMode);
    if (newMode === 'midi') {
      handleDetectMidi();
    }
  };

  const hasMidiConnected = midiDevices.length > 0;

  return (
    <div className={`p-4 rounded-3xl glass-card border border-white/10 space-y-3 ${className}`}>
      {/* Banner Informativo quando Desativado (ex: durante demonstração sonora) */}
      {disabled && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-purple-950/40 border border-purple-500/25 text-purple-200 text-xs font-mono">
          <MicOff className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{disabledMessage || 'Entrada desativada durante a reprodução da demonstração.'}</span>
        </div>
      )}

      {/* ── LINHA SUPERIOR: Seletor de Modo Universal + Status de Conexão + Parâmetros ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Lado Esquerdo: Abas de Seleção de Entrada (MIDI USB vs Microfone) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => handleModeChange('midi')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer select-none ${
                currentMode === 'midi'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Entrada MIDI via Cabo USB, Adaptador OTG ou Bluetooth MIDI"
            >
              <span>🎹</span>
              <span>Entrada MIDI USB</span>
              {hasMidiConnected ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400/60" />
              )}
            </button>

            <button
              onClick={() => handleModeChange('mic')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer select-none ${
                currentMode === 'mic' || currentMode === 'line-in' || currentMode === 'headset'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Captação Acústica por Microfone do Dispositivo ou Interface de Áudio"
            >
              <span>🎙️</span>
              <span>Microfone (Teclado Real)</span>
              {isMicActive && (
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] animate-ping" />
              )}
            </button>
          </div>

          {/* Indicador de Status Dinâmico */}
          {currentMode === 'midi' ? (
            hasMidiConnected ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold truncate max-w-[200px]">
                  {midiDevices[0]?.name || 'Controlador MIDI Ativo'}
                </span>
                {midiDevices.length > 1 && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    (+{midiDevices.length - 1})
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Nenhum MIDI detectado</span>
              </div>
            )
          ) : (
            /* Botão de Ativação do Microfone quando em modo Mic */
            <button
              onClick={disabled ? undefined : handleToggleMic}
              disabled={disabled}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-white/5 text-slate-500 border border-white/5'
                  : isMicActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse active:scale-95'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 active:scale-95'
              }`}
            >
              {isMicActive ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Desativar Microfone</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>{customLabel || 'Ligar Microfone'}</span>
                </>
              )}
            </button>
          )}

          {isMicActive && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              <span>Escutando instrumento...</span>
            </div>
          )}
        </div>

        {/* Lado Direito: Configurações de Hardware / Dispositivos / Compassos */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          {/* Seletor de Compasso Ativo (quando requisitado pela tela, ex: ScoreEditor) */}
          {showMeasureControls && totalMeasures && totalMeasures > 0 && (
            <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 mr-1">
                Compasso Ativo:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] scrollbar-none py-0.5">
                {Array.from({ length: totalMeasures }, (_, i) => i + 1).map((m) => (
                  <button
                    key={m}
                    onClick={() => onSelectMeasure?.(m - 1)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                      activeMeasureNumber === m
                        ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={`Selecionar Compasso ${m} para inserção/escrita`}
                  >
                    c.{m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Configurações específicas para MIDI */}
          {currentMode === 'midi' && (
            <div className="flex items-center gap-2">
              {/* Seletor de Canal MIDI */}
              <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                <SlidersHorizontal className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="text-[10px] font-mono text-slate-400">Canal:</span>
                <select
                  value={inputConfig.midiChannel}
                  onChange={(e) => audioInputConfigStore.setMidiChannel(parseInt(e.target.value, 10))}
                  className="bg-transparent text-[10px] text-indigo-300 font-mono font-bold focus:outline-none cursor-pointer"
                  title="Canal MIDI (OMNI = todos os canais)"
                >
                  <option value={0} className="bg-slate-900 text-white">OMNI (Todos)</option>
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((ch) => (
                    <option key={ch} value={ch} className="bg-slate-900 text-white">
                      Canal {ch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão de Redetectar MIDI */}
              <button
                onClick={handleDetectMidi}
                disabled={isSearchingMidi}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs"
                title="Escanear e reconectar teclados MIDI USB"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSearchingMidi ? 'animate-spin' : ''}`} />
                <span>{isSearchingMidi ? 'Buscando...' : 'Detectar MIDI'}</span>
              </button>
            </div>
          )}

          {/* Configurações específicas para Microfone */}
          {currentMode === 'mic' && (
            <>
              {audioDevices.length > 1 && (
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
                  <Cable className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <select
                    value={inputConfig.selectedDeviceId}
                    onChange={(e) => {
                      audioInputConfigStore.setSelectedDeviceId(e.target.value);
                      if (isMicActive) {
                        handleToggleMic();
                      }
                    }}
                    className="bg-transparent text-[10px] text-slate-200 font-mono focus:outline-none cursor-pointer"
                    title="Selecione o Microfone, Cabo Auxiliar ou Interface USB"
                  >
                    {audioDevices.map((dev, idx) => (
                      <option key={dev.deviceId || idx} value={dev.deviceId} className="bg-slate-900 text-white">
                        {dev.label
                          ? dev.label.length > 25
                            ? dev.label.substring(0, 25) + '...'
                            : dev.label
                          : `Entrada ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Slider de Sensibilidade */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-[11px] font-mono font-bold whitespace-nowrap">Sensibilidade:</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      inputConfig.sensitivityPercent >= 70
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : inputConfig.sensitivityPercent <= 35
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {inputConfig.sensitivityPercent}%
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={inputConfig.sensitivityPercent}
                  onChange={(e) => audioInputConfigStore.setSensitivityPercent(Number(e.target.value))}
                  className="w-16 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  title={`Ajuste de sensibilidade: ${inputConfig.sensitivityPercent}%`}
                />

                <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/10 text-[9px] font-bold">
                  <button
                    onClick={() => audioInputConfigStore.setPreset('high')}
                    className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                      inputConfig.sensitivityPercent >= 70 ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Alta"
                  >
                    Alta
                  </button>
                  <button
                    onClick={() => audioInputConfigStore.setPreset('normal')}
                    className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                      inputConfig.sensitivityPercent > 35 && inputConfig.sensitivityPercent < 70
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Normal"
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => audioInputConfigStore.setPreset('low')}
                    className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                      inputConfig.sensitivityPercent <= 35 ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Baixa"
                  >
                    Baixa
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── BANNER VISUAL DE TRATAMENTO DE DESCONEXÃO MIDI (Critério de Aceitação 4) ── */}
      {currentMode === 'midi' && !hasMidiConnected && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-[#1e1308]/60 to-[#120803]/60 border border-amber-500/30 text-amber-200 text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-200">
                  Nenhum Teclado ou Controlador MIDI Detectado
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono uppercase font-bold">
                  Desconectado
                </span>
              </div>
              <p className="text-amber-300/70 text-[11px] mt-0.5">
                Conecte seu instrumento com cabo USB/OTG ou Bluetooth MIDI para escrever na partitura.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleDetectMidi}
              disabled={isSearchingMidi}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearchingMidi ? 'animate-spin' : ''}`} />
              <span>{isSearchingMidi ? 'Buscando...' : 'Reconectar MIDI'}</span>
            </button>
            <button
              onClick={() => handleModeChange('mic')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
            >
              Alternar para Microfone
            </button>
          </div>
        </div>
      )}

      {/* ── FEEDBACK DE ENTRADA EM TEMPO REAL: MODO MIDI ── */}
      {currentMode === 'midi' && hasMidiConnected && (
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="font-mono text-[11px]">
              Dispositivo Ativo:{' '}
              <strong className="text-white font-bold">{midiDevices[0]?.name || 'Teclado MIDI USB'}</strong>
            </span>
          </div>

          {lastMidiPayload ? (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-slate-200 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md bg-indigo-500 text-slate-950">
                  ♫ MIDI RECEBIDO
                </span>
                <span className="text-lg font-black font-display text-white">
                  {octaveConfigStore.midiToNoteName(lastMidiPayload.midi, octaveStandard)}
                </span>
                <span className="text-xs text-indigo-300 font-mono">
                  (MIDI {lastMidiPayload.midi})
                </span>
              </div>

              <div className="h-4 w-px bg-white/10" />

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-400">Intensidade:</span>
                <span className="text-cyan-300 font-bold">
                  {Math.round((lastMidiPayload.velocity / 127) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              Pronto: toque teclas no seu controlador MIDI para escrever na pauta...
            </span>
          )}
        </div>
      )}

      {/* ── FEEDBACK DE ENTRADA EM TEMPO REAL: MODO MICROFONE ACÚSTICO ── */}
      {currentMode === 'mic' && isMicActive && (() => {
        const hasTarget = expectedMidi !== undefined && expectedMidi !== null;
        const isMatch = currentPitch && hasTarget && currentPitch.midi === expectedMidi;
        const isChordNote = currentPitch && expectedChordNotes && expectedChordNotes.includes(currentPitch.midi);
        const isWrong = isErrorActive;
        const cents = currentPitch
          ? Math.round((69 + 12 * Math.log2(currentPitch.frequency / 440) - currentPitch.midi) * 100)
          : 0;

        const displayChordSymbol = polyphonicChord
          ? `${polyphonicChord.rootName}${polyphonicChord.suffix}`
          : liveDetectedChord?.symbol ?? null;

        const isChordMatch = displayChordSymbol && expectedChordName && (
          displayChordSymbol.toLowerCase() === expectedChordName.toLowerCase() ||
          polyphonicChord?.rootName.toLowerCase() === expectedChordName.toLowerCase() ||
          liveDetectedChord?.root.toLowerCase() === expectedChordName.toLowerCase()
        );

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

            {/* Painel de Identificação: Acorde ou Nota Ouvida */}
            <div className="flex items-center gap-3 flex-wrap">
              {displayChordSymbol ? (
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all animate-fade-in ${
                    isChordMatch
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-950/50'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-950/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md ${
                        isChordMatch ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {isChordMatch ? '✔ ACORDE CORRETO' : '🎹 ACORDE OUVIDO'}
                    </span>
                    <span className="text-xl font-black font-display text-white">
                      {displayChordSymbol}
                    </span>
                    {polyphonicChord ? (
                      <span className="text-xs text-cyan-300 font-medium">
                        ({polyphonicChord.quality} • {Math.round(polyphonicChord.confidence * 100)}% confiança)
                      </span>
                    ) : liveDetectedChord ? (
                      <span className="text-xs text-amber-300 font-medium">
                        ({liveDetectedChord.namePt})
                      </span>
                    ) : null}
                  </div>

                  <div className="h-4 w-px bg-white/10 hidden sm:block" />

                  {polyphonicChord && (
                    <div className="flex items-end gap-0.5 h-5" title="Vetor Chroma">
                      {Array.from(polyphonicChord.chromaVector).map((v, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-t-sm transition-all"
                          style={{
                            height: `${Math.round(v * 100)}%`,
                            minHeight: '1px',
                            background: v > 0.5 ? 'rgb(52,211,153)' : v > 0.2 ? 'rgb(251,191,36)' : 'rgb(71,85,105)',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {!polyphonicChord && liveDetectedChord && (
                    <div className="text-[10px] font-mono text-slate-300">
                      Notas: <span className="text-white font-bold">{liveDetectedChord.notesPt.join(' • ')}</span>
                    </div>
                  )}
                </div>
              ) : currentPitch ? (
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all animate-fade-in ${
                    isWrong
                      ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 shadow-lg shadow-rose-950/50 animate-pulse'
                      : isMatch || isChordNote
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-950/50'
                      : 'bg-indigo-950/60 border-indigo-500/40 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md ${
                        isWrong
                          ? 'bg-rose-500 text-white'
                          : isMatch
                          ? 'bg-emerald-500 text-slate-950'
                          : isChordNote
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-indigo-500/30 text-indigo-300'
                      }`}
                    >
                      {isWrong
                        ? '✕ NOTA ERRADA'
                        : isMatch
                        ? '✔ NOTA CORRETA'
                        : isChordNote
                        ? '✔ NOTA DO ACORDE'
                        : '♫ AMOSTRADOR'}
                    </span>
                    <span className="text-xl font-black font-display text-white">
                      {octaveConfigStore.midiToNoteName(currentPitch.midi, octaveStandard)}
                    </span>
                  </div>

                  <div className="h-4 w-px bg-white/10 hidden sm:block" />

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-cyan-300 font-bold">{currentPitch.frequency} Hz</span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        Math.abs(cents) <= 8 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {Math.abs(cents) <= 8 ? '● Afinada' : cents > 0 ? `+${cents}ct ♯` : `${cents}ct ♭`}
                    </span>
                  </div>

                  {isWrong &&
                    (expectedMidi !== null && expectedMidi !== undefined
                      ? getNoteInfo(expectedMidi, false, octaveStandard).fullName
                      : expectedNoteName
                      ? octaveConfigStore.convertNoteOctave(expectedNoteName, octaveStandard, 'C3')
                      : null) && (
                      <span className="text-[10px] font-mono font-black text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded-lg border border-rose-500/40">
                        A partitura pede:{' '}
                        {expectedMidi !== null && expectedMidi !== undefined
                          ? getNoteInfo(expectedMidi, false, octaveStandard).fullName
                          : octaveConfigStore.convertNoteOctave(expectedNoteName!, octaveStandard, 'C3')}
                      </span>
                    )}
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  Amostrador ativo: toque notas ou acordes no seu piano acústico ou teclado elétrico...
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {micErrorMsg && (
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{micErrorMsg}</span>
        </div>
      )}
    </div>
  );
};
