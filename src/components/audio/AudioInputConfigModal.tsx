import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mic,
  MicOff,
  Cable,
  Sliders,
  AlertCircle,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  Music2,
  Activity,
} from 'lucide-react';
import { MicrophonePitchDetector, micPitchDetector } from '../../core/pitchDetector';
import { audioInputConfigStore, useAudioInputConfig } from '../../core/audioInputConfigStore';
import { midiManager, type MidiDevice, type MidiEventPayload } from '../../core/midiManager';
import { latencyManager } from '../../core/latencyManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenLatencyWizard?: () => void;
}

type TabType = 'audio' | 'midi' | 'latency';

export const AudioInputConfigModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenLatencyWizard,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('audio');
  const config = useAudioInputConfig();

  // Dispositivos de Áudio
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [testRms, setTestRms] = useState(0);
  const [detectedPitch, setDetectedPitch] = useState<{ note: string; freq: number } | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Dispositivos MIDI
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [hasMidiSupport, setHasMidiSupport] = useState<boolean>(true);
  const [lastMidiEvent, setLastMidiEvent] = useState<MidiEventPayload | null>(null);

  // Latência
  const [currentOffset, setCurrentOffset] = useState<number>(latencyManager.getOffsetMs());

  // Carrega dispositivos de áudio quando o modal abre
  useEffect(() => {
    if (!isOpen) return;

    MicrophonePitchDetector.getAvailableAudioDevices()
      .then((devs) => {
        setAudioDevices(devs);
        if (devs.length > 0 && !audioInputConfigStore.getSnapshot().selectedDeviceId) {
          audioInputConfigStore.setSelectedDeviceId(devs[0].deviceId);
        }
      })
      .catch((err) => {
        console.warn('Erro ao listar dispositivos de áudio:', err);
      });

    // Inicializa MIDI
    const supported = midiManager.checkSupport();
    setHasMidiSupport(supported);
    if (supported) {
      midiManager.initialize().then(() => {
        setMidiDevices(midiManager.getDevices());
      });
    }

    const unsubMidiDevices = midiManager.subscribeDevices((devs: MidiDevice[]) => {
      setMidiDevices(devs);
    });

    const unsubMidiEvents = midiManager.subscribe((event) => {
      if (event.isDown) {
        setLastMidiEvent(event);
      }
    });

    return () => {
      unsubMidiDevices();
      unsubMidiEvents();
      if (isTestingAudio) {
        micPitchDetector.stop();
        setIsTestingAudio(false);
      }
    };
  }, [isOpen]);

  // Limpa teste ao fechar
  const handleClose = () => {
    if (isTestingAudio) {
      micPitchDetector.stop();
      setIsTestingAudio(false);
      setTestRms(0);
      setDetectedPitch(null);
    }
    onClose();
  };

  // Alterna teste de áudio
  const handleToggleAudioTest = async () => {
    setPermissionError(null);
    if (isTestingAudio) {
      micPitchDetector.stop();
      setIsTestingAudio(false);
      setTestRms(0);
      setDetectedPitch(null);
    } else {
      const ok = await micPitchDetector.start(
        (pitch) => {
          setDetectedPitch({ note: pitch.noteName, freq: Math.round(pitch.frequency * 10) / 10 });
        },
        (rms) => {
          const normalized = Math.min(100, Math.round((rms / 0.15) * 100));
          setTestRms(normalized);
        },
        undefined,
        config.selectedDeviceId || undefined
      );

      if (ok) {
        setIsTestingAudio(true);
      } else {
        setPermissionError(
          'Permissão de microfone/áudio negada ou dispositivo indisponível. Verifique as permissões do navegador.'
        );
      }
    }
  };

  const handleDeviceSelect = async (deviceId: string) => {
    audioInputConfigStore.setSelectedDeviceId(deviceId);
    if (isTestingAudio) {
      micPitchDetector.stop();
      setIsTestingAudio(false);
      setTestRms(0);
      setDetectedPitch(null);
    }
  };

  const handleLatencyQuickSelect = (offset: number) => {
    latencyManager.setOffsetMs(offset);
    setCurrentOffset(offset);
  };

  if (!isOpen) return null;

  return typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed inset-0 z-[10000] flex flex-col justify-end md:justify-center items-center bg-black/80 backdrop-blur-md p-0 md:p-4 animate-fade-in select-none"
          onClick={handleClose}
        >
          <div
            className="bg-[#0e0d1e] border-t md:border border-white/15 w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh] md:max-h-[90vh] animate-slide-up md:animate-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle para Mobile */}
            <div className="w-12 h-1 rounded-full bg-white/20 mx-auto my-2 md:hidden shrink-0" />

            {/* ── CABEÇALHO DO MODAL ── */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <Cable className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    Configuração de Entradas &amp; Dispositivos
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    Microfone acústico, cabo USB/auxiliar, teclado MIDI e calibração de latência
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="min-w-[44px] min-h-[44px] rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Fechar (Esc)"
                aria-label="Fechar configurações de entrada"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── SELETOR DE MODO DE ENTRADA UNIVERSAL (4 Modos Suportados) ── */}
            <div className="px-6 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                Tipo de Entrada:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => {
                    audioInputConfigStore.setInputMode('midi');
                    setActiveTab('midi');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border select-none ${
                    config.inputMode === 'midi'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>🎹</span>
                  <span>MIDI USB / Bluetooth</span>
                </button>

                <button
                  onClick={() => {
                    audioInputConfigStore.setInputMode('mic');
                    setActiveTab('audio');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border select-none ${
                    config.inputMode === 'mic'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>🎙️</span>
                  <span>Microfone Embutido</span>
                </button>

                <button
                  onClick={() => {
                    audioInputConfigStore.setInputMode('line-in');
                    setActiveTab('audio');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border select-none ${
                    config.inputMode === 'line-in'
                      ? 'bg-amber-600 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-600/30 ring-1 ring-amber-400'
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>🔌</span>
                  <span>Cabo Line-In / Interface</span>
                </button>

                <button
                  onClick={() => {
                    audioInputConfigStore.setInputMode('headset');
                    setActiveTab('audio');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border select-none ${
                    config.inputMode === 'headset'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>🎧</span>
                  <span>Fones / Headset</span>
                </button>
              </div>
            </div>

            {/* ── ABAS DE NAVEGAÇÃO ── */}
            <div className="flex border-b border-white/10 bg-black/30 px-6 pt-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-t border-x ${
                  activeTab === 'audio'
                    ? 'bg-[#0e0d1e] text-cyan-300 border-white/15 border-b-transparent shadow-md'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Microfone / Áudio USB</span>
              </button>

              <button
                onClick={() => setActiveTab('midi')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-t border-x ${
                  activeTab === 'midi'
                    ? 'bg-[#0e0d1e] text-emerald-300 border-white/15 border-b-transparent shadow-md'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Music2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Teclado MIDI (USB / OTG)</span>
                {midiDevices.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('latency')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-t border-x ${
                  activeTab === 'latency'
                    ? 'bg-[#0e0d1e] text-indigo-300 border-white/15 border-b-transparent shadow-md'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Latência &amp; Sincronia</span>
                {currentOffset > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                    +{currentOffset}ms
                  </span>
                )}
              </button>
            </div>

            {/* ── CONTEÚDO DA ABA ── */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* 🎙️ ABA 1: ENTRADA DE ÁUDIO */}
              {activeTab === 'audio' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Seletor do Dispositivo Físico */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Cable className="w-4 h-4 text-cyan-400" />
                        Dispositivo de Entrada de Áudio:
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {audioDevices.length} dispositivo(s) detectado(s)
                      </span>
                    </label>

                    <select
                      value={config.selectedDeviceId}
                      onChange={(e) => handleDeviceSelect(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      {audioDevices.length > 0 ? (
                        audioDevices.map((dev, idx) => (
                          <option key={dev.deviceId || idx} value={dev.deviceId} className="bg-slate-900 text-white">
                            {dev.label || `Entrada de Áudio ${idx + 1}`}
                          </option>
                        ))
                      ) : (
                        <option value="" className="bg-slate-900 text-white">
                          Microfone Padrão do Sistema
                        </option>
                      )}
                    </select>

                    <p className="text-[11px] text-slate-400">
                      Compatível com microfone embutido, fone com microfone (P3/P2), interface de áudio USB ou cabo direto instrumento-computador.
                    </p>
                  </div>

                  {/* Teste de Sinal e Medidor VU em Tempo Real */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span>Teste de Captação em Tempo Real:</span>
                      </div>

                      <button
                        onClick={handleToggleAudioTest}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isTestingAudio
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                        }`}
                      >
                        {isTestingAudio ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>Parar Teste</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" />
                            <span>Iniciar Teste</span>
                          </>
                        )}
                      </button>
                    </div>

                    {permissionError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{permissionError}</span>
                      </div>
                    )}

                    {/* Barra de Volume / VU Meter */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Nível do Sinal (VU Meter)</span>
                        <span className="font-bold text-white">{testRms}%</span>
                      </div>
                      <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-75"
                          style={{
                            width: `${testRms}%`,
                            background:
                              testRms > 85
                                ? 'linear-gradient(90deg, #10b981 0%, #f59e0b 70%, #ef4444 100%)'
                                : testRms > 50
                                ? 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)'
                                : '#10b981',
                          }}
                        />
                      </div>
                    </div>

                    {/* Detecção da Nota em Tempo Real */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400">Nota Musical Detectada:</span>
                      {detectedPitch ? (
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-base font-black text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                            {detectedPitch.note}
                          </span>
                          <span className="text-xs text-slate-400">({detectedPitch.freq} Hz)</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-slate-500 italic">
                          {isTestingAudio ? 'Toque uma nota ou cante no microfone...' : 'Clique em "Iniciar Teste"'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sensibilidade do Microfone */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <span>Sensibilidade de Detecção:</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                        {config.sensitivityPercent}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={config.sensitivityPercent}
                      onChange={(e) => audioInputConfigStore.setSensitivityPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />

                    {/* Presets Rápidos */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => audioInputConfigStore.setPreset('low')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          config.sensitivityPercent <= 35
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        Baixa (25%)
                        <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Ambiente barulhento</span>
                      </button>

                      <button
                        onClick={() => audioInputConfigStore.setPreset('normal')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          config.sensitivityPercent > 35 && config.sensitivityPercent < 70
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        Normal (50%)
                        <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Padrão recomendado</span>
                      </button>

                      <button
                        onClick={() => audioInputConfigStore.setPreset('high')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          config.sensitivityPercent >= 70
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        Alta (75%)
                        <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Toques suaves / violão</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 🎹 ABA 2: ENTRADA MIDI */}
              {activeTab === 'midi' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Status Geral do Suporte Web MIDI */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          hasMidiSupport ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Status da API Web MIDI</h4>
                        <p className="text-[11px] text-slate-400">
                          {hasMidiSupport
                            ? 'Navegador com suporte nativo a instrumentos USB e MIDI'
                            : 'Este navegador não suporta a Web MIDI API'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        hasMidiSupport
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {hasMidiSupport ? 'Suporte Ativo' : 'Indisponível'}
                    </span>
                  </div>

                  {/* Lista de Teclados / Controladores Conectados */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Cable className="w-4 h-4 text-emerald-400" />
                        Teclados MIDI Físicos Conectados:
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {midiDevices.length} conectado(s)
                      </span>
                    </div>

                    {midiDevices.length > 0 ? (
                      <div className="space-y-2">
                        {midiDevices.map((device) => (
                          <div
                            key={device.id}
                            className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <div>
                                <div className="text-xs font-bold text-white">{device.name}</div>
                                <div className="text-[10px] text-slate-400">
                                  {device.manufacturer || 'Dispositivo USB MIDI PnP'} • ID: {device.id.substring(0, 12)}...
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Pronto para Tocar
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                          <Cable className="w-5 h-5" />
                        </div>
                        <p className="text-xs text-slate-300 font-bold">Nenhum Teclado MIDI detectado no momento</p>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                          Conecte seu teclado ou piano digital via cabo USB, adaptador OTG (em celulares/tablets) ou Bluetooth MIDI. O reconhecimento é 100% automático (Plug &amp; Play).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mapeamento Automático de Canais MIDI (1–16) */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-emerald-400" />
                        <span>Mapeamento de Canais MIDI:</span>
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        {config.midiChannel === 0 ? 'Omni (Todos os Canais 1–16)' : `Canal ${config.midiChannel}`}
                      </span>
                    </div>

                    <select
                      value={config.midiChannel}
                      onChange={(e) => audioInputConfigStore.setMidiChannel(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none cursor-pointer"
                    >
                      <option value={0} className="bg-slate-900 text-white">
                        Omni — Responder a todos os canais (1 a 16)
                      </option>
                      {Array.from({ length: 16 }, (_, i) => i + 1).map((ch) => (
                        <option key={ch} value={ch} className="bg-slate-900 text-white">
                          Canal MIDI {ch} {ch === 1 ? '(Padrão Teclado Principal)' : ''}
                        </option>
                      ))}
                    </select>

                    <p className="text-[11px] text-slate-400">
                      Mapeamento automático de canais: selecione o canal do seu teclado controlador ou deixe em Omni para responder em qualquer canal.
                    </p>
                  </div>

                  {/* Monitor de Notas MIDI Tocadas em Tempo Real */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Music2 className="w-4 h-4 text-emerald-400" />
                      Monitor de Teclas MIDI Recebidas:
                    </h4>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Última tecla física tocada:</span>
                      {lastMidiEvent ? (
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-xs font-black text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                            {lastMidiEvent.noteName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            (MIDI #{lastMidiEvent.midi} • Vel: {lastMidiEvent.velocity})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-slate-500 italic">
                          Toque qualquer tecla no seu teclado físico para testar...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ⚡ ABA 3: LATÊNCIA & SINCRONIZAÇÃO */}
              {activeTab === 'latency' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        Compensação de Latência Atual:
                      </h4>
                      <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                        {currentOffset > 0 ? `+${currentOffset}ms` : '0ms (Direto)'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Compensa o atraso natural de áudio entre o clique visual e a saída sonora nos alto-falantes ou fones Bluetooth.
                    </p>

                    {/* Perfis Rápidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => handleLatencyQuickSelect(0)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentOffset === 0
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Alto-falante / Fone Cabo</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Offset: 0ms</div>
                      </button>

                      <button
                        onClick={() => handleLatencyQuickSelect(80)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentOffset === 80
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Bluetooth Baixa Latência</div>
                        <div className="text-[10px] text-indigo-300 font-mono mt-0.5">Offset: +80ms</div>
                      </button>

                      <button
                        onClick={() => handleLatencyQuickSelect(150)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentOffset === 150
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Fone Bluetooth Padrão</div>
                        <div className="text-[10px] text-indigo-300 font-mono mt-0.5">Offset: +150ms</div>
                      </button>
                    </div>
                  </div>

                  {/* Assistente Completo de Calibração */}
                  {onOpenLatencyWizard && (
                    <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          Assistente de Calibração com Toque
                        </h4>
                        <p className="text-[11px] text-indigo-300/80">
                          Calibre a latência exata do seu dispositivo dando toques no ritmo da batida.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          handleClose();
                          onOpenLatencyWizard();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Calibrar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RODAPÉ COM BOTÃO CONCLUIR ── */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Configurações ativas são salvas automaticamente.
              </span>

              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-600/20"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};
