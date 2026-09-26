import React, { useState, useEffect } from 'react';
import {
  audioInputConfigStore,
  useAudioInputConfig,
  type InputModeType,
} from '../../core/audioInputConfigStore';
import { midiManager } from '../../core/midiManager';
import { Settings } from 'lucide-react';

interface QuickInputSelectorProps {
  compact?: boolean;
  onOpenConfig?: () => void;
  className?: string;
}

export const QuickInputSelector: React.FC<QuickInputSelectorProps> = ({
  compact = false,
  onOpenConfig,
  className = '',
}) => {
  const config = useAudioInputConfig();
  const [hasMidi, setHasMidi] = useState(false);

  useEffect(() => {
    if (midiManager.checkSupport()) {
      midiManager.initialize().then(() => {
        setHasMidi(midiManager.getDevices().length > 0);
      });
    }
    const unsub = midiManager.subscribeDevices((devs) => {
      setHasMidi(devs.length > 0);
    });
    return () => unsub();
  }, []);

  const modes: { id: InputModeType; label: string; icon: string; color: string; desc: string }[] = [
    {
      id: 'midi',
      label: 'MIDI USB',
      icon: '🎹',
      color: 'indigo',
      desc: 'Teclado Controlador ou Interface USB',
    },
    {
      id: 'mic',
      label: 'Microfone',
      icon: '🎙️',
      color: 'emerald',
      desc: 'Captação Acústica por Microfone',
    },
    {
      id: 'line-in',
      label: 'Cabo Line-In',
      icon: '🔌',
      color: 'amber',
      desc: 'Entrada Direta P2/P10 ou Placa de Áudio',
    },
    {
      id: 'headset',
      label: 'Fones',
      icon: '🎧',
      color: 'purple',
      desc: 'Fones de Ouvido com Microfone',
    },
  ];

  return (
    <div
      data-quick-input-selector
      className={`flex items-center gap-1.5 flex-wrap ${className}`}
    >
      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 mr-1 hidden sm:inline">
        Entrada:
      </span>

      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
        {modes.map((m) => {
          const isActive = config.inputMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => audioInputConfigStore.setInputMode(m.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border select-none ${
                isActive
                  ? m.id === 'midi'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : m.id === 'mic'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : m.id === 'line-in'
                    ? 'bg-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-600/30 ring-1 ring-amber-400'
                    : 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={m.desc}
            >
              <span>{m.icon}</span>
              <span className={compact ? 'hidden md:inline' : 'inline'}>{m.label}</span>
              {m.id === 'midi' && hasMidi && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="MIDI conectado" />
              )}
            </button>
          );
        })}
      </div>

      {onOpenConfig && (
        <button
          onClick={onOpenConfig}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Configurações Avançadas de Áudio e MIDI"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      )}
    </div>
  );
};
