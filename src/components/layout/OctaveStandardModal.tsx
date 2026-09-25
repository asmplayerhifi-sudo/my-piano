import React from 'react';
import { X, Check, Globe, Sparkles, Music2, ShieldCheck } from 'lucide-react';
import { octaveConfigStore, useOctaveStandard, type OctaveStandard } from '../../core/octaveConfigStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OctaveStandardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentStandard = useOctaveStandard();

  if (!isOpen) return null;

  const handleSelect = (std: OctaveStandard) => {
    octaveConfigStore.setStandard(std);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#0b0a17] border border-white/10 shadow-2xl p-5 sm:p-7 space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de Fundo Decorativo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display flex items-center gap-2">
                <span>Nomenclatura do Dó Central</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MIDI 60
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecione o padrão de referência para a exibição de oitavas na plataforma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Garantia Técnica */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            <strong>Rigor Técnico:</strong> O valor MIDI (60) e a frequência em Hertz (261.63 Hz) permanecem 100% inalterados. Apenas os rótulos de oitava são adaptados.
          </span>
        </div>

        {/* Cartões de Seleção */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
          {/* Opção 1: Padrão C3 (Brasil / Yamaha / Roland) */}
          <div
            onClick={() => handleSelect('C3')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
              currentStandard === 'C3'
                ? 'bg-gradient-to-b from-indigo-950/70 to-indigo-900/30 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇧🇷</span>
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Padrão C3</span>
                  <span className="text-[10px] text-indigo-300 font-mono font-normal">(Brasil)</span>
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  currentStandard === 'C3'
                    ? 'bg-indigo-500 text-white'
                    : 'border border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {currentStandard === 'C3' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between font-mono text-[11px] pb-1 border-b border-white/5">
                <span className="text-slate-400">Dó Central:</span>
                <strong className="text-indigo-300">C3 / Dó3</strong>
              </div>
              <div className="flex justify-between font-mono text-[11px] pb-1 border-b border-white/5">
                <span className="text-slate-400">Lá de Afinação:</span>
                <strong className="text-slate-200">A3 (440 Hz)</strong>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                Utilizado amplamente no Brasil, teclados e sintetizadores Roland/Yamaha e escolas de música tradicionais.
              </p>
            </div>
          </div>

          {/* Opção 2: Padrão C4 (Internacional / SPN) */}
          <div
            onClick={() => handleSelect('C4')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
              currentStandard === 'C4'
                ? 'bg-gradient-to-b from-purple-950/70 to-purple-900/30 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Padrão C4</span>
                  <span className="text-[10px] text-purple-300 font-mono font-normal">(Internacional)</span>
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  currentStandard === 'C4'
                    ? 'bg-purple-500 text-white'
                    : 'border border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {currentStandard === 'C4' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between font-mono text-[11px] pb-1 border-b border-white/5">
                <span className="text-slate-400">Dó Central:</span>
                <strong className="text-purple-300">C4 / Dó4</strong>
              </div>
              <div className="flex justify-between font-mono text-[11px] pb-1 border-b border-white/5">
                <span className="text-slate-400">Lá de Afinação:</span>
                <strong className="text-slate-200">A4 (440 Hz)</strong>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                Scientific Pitch Notation (SPN). Padrão oficial da Acoustical Society of America e softwares internacionais.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Atualização instantânea em todas as telas</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
