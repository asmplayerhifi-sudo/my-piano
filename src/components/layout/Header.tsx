import React, { useState } from 'react';
import { Volume2, VolumeX, Sliders, Smartphone, Globe, Sparkles, Radio } from 'lucide-react';
import { soundEngine } from '../../core/soundEngine';
import { latencyManager } from '../../core/latencyManager';
import { LatencyWizardModal } from '../rhythm/LatencyWizardModal';

import { useOctaveStandard } from '../../core/octaveConfigStore';
import { OctaveStandardModal } from './OctaveStandardModal';
import { useAccompaniment } from '../../core/accompanimentStore';

export const Header: React.FC = () => {
  const [volume, setVolume] = useState<number>(soundEngine.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isSoundMuted());
  const [showLatencyModal, setShowLatencyModal] = useState<boolean>(false);
  const [showOctaveModal, setShowOctaveModal] = useState<boolean>(false);
  const [currentOffset, setCurrentOffset] = useState<number>(latencyManager.getOffsetMs());
  const octaveStandard = useOctaveStandard();
  const accState = useAccompaniment();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
    if (isMuted) setIsMuted(false);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-display tracking-tight text-white flex items-center gap-1.5">
                <span>HARMONIA</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Globe className="w-3 h-3" /> Web &amp; Android
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Plataforma Interativa de Educação Musical &amp; Ritmo</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Seletor de Nomenclatura do Dó Central (C3 Brasil / C4 Internacional) */}
          <button
            onClick={() => setShowOctaveModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group"
            title="Escolha entre o padrão C3 (Brasil / Roland / Yamaha) ou C4 (Internacional / SPN) para o Dó Central"
          >
            <span className="text-sm">{octaveStandard === 'C3' ? '🇧🇷' : '🌐'}</span>
            <span className="hidden sm:inline text-slate-300">Dó Central:</span>
            <span className={`font-mono font-bold px-1.5 py-0.2 rounded-md ${
              octaveStandard === 'C3'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              {octaveStandard === 'C3' ? 'C3 (Brasil)' : 'C4 (Intl)'}
            </span>
          </button>

          {/* Botão de Acesso Rápido ao Metrônomo & Acompanhamento Musical */}
          <button
            onClick={() => {
              if (window.location.hash !== '#/rhythm') {
                window.location.hash = '#/rhythm';
              }
              window.dispatchEvent(new CustomEvent('nav-rhythm-mode', { detail: 'studio' }));
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              accState.isPlaying
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-400'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
            }`}
            title="Ir para o Estúdio de Metrônomo & Acompanhamento na Tela"
          >
            <Radio className={`w-3.5 h-3.5 ${accState.isPlaying ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">Metrônomo:</span>
            <span className="font-mono font-bold text-white">{accState.bpm} BPM</span>
            <span className="text-[10px] font-mono text-indigo-300">{accState.timeSignature}</span>
            {accState.accompanimentEnabled && (
              <span className="hidden md:inline text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                + Banda
              </span>
            )}
          </button>

          {/* Latency Calibration Button */}
          <button
            onClick={() => setShowLatencyModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            title="Calibrar latência para fone Bluetooth ou alto-falante"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Latência:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {currentOffset > 0 ? `+${currentOffset}ms` : '0ms'}
            </span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <button
              onClick={handleToggleMute}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Desmutar' : 'Mutar áudio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              title="Volume Geral"
            />
          </div>

          {/* Android Mode Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Capacitor Ready</span>
          </div>
        </div>
      </header>

      {/* Latency Modal */}
      <LatencyWizardModal
        isOpen={showLatencyModal}
        onClose={() => setShowLatencyModal(false)}
        onCalibrated={(newOffset) => setCurrentOffset(newOffset)}
      />

      {/* Octave Standard Modal */}
      <OctaveStandardModal
        isOpen={showOctaveModal}
        onClose={() => setShowOctaveModal(false)}
      />
    </>
  );
};
