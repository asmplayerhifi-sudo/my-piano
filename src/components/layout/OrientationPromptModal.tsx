import React from 'react';
import {
  RotateCcw,
  Maximize2,
  Smartphone,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';
import { useDeviceOrientation, type DeviceType } from '../../hooks/useDeviceOrientation';

export interface OrientationPromptModalProps {
  forceVisible?: boolean;
  forcedDeviceType?: DeviceType;
  onClosePreview?: () => void;
}

export const OrientationPromptModal: React.FC<OrientationPromptModalProps> = ({
  forceVisible,
  forcedDeviceType,
  onClosePreview,
}) => {
  const {
    shouldPrompt,
    deviceType: detectedDeviceType,
    ignoreTabletWarning,
    activateFullscreenAndLandscape,
  } = useDeviceOrientation();

  const isVisible = forceVisible ?? shouldPrompt;
  const activeDeviceType = forcedDeviceType ?? detectedDeviceType;

  if (!isVisible) {
    return null;
  }

  const isTablet = activeDeviceType === 'tablet';

  const handleDismiss = () => {
    if (onClosePreview) {
      onClosePreview();
    } else if (isTablet) {
      ignoreTabletWarning();
    }
  };

  const handleFullscreen = async () => {
    await activateFullscreenAndLandscape();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="orientation-prompt-title"
      className="fixed inset-0 z-50 bg-[#060813]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn"
    >
      <div className="relative max-w-lg w-full rounded-3xl bg-[#0c1021]/90 border border-white/10 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center space-y-6">
        {/* Botão Fechar exclusivo para Tablets ou Modo Preview (RF-02.B) */}
        {isTablet && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar recomendação"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header do Modal Conforme Wireframe */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
            <span id="orientation-prompt-title">Recomendação de Tela Deitada</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            {isTablet ? 'Experiência Ideal na Horizontal' : 'Gire seu Aparelho'}
          </h2>
        </div>

        {/* Animação Gráfica: 📲 ➔ 📱 (Gire o Aparelho) */}
        <div className="py-2 flex items-center justify-center">
          <div className="p-5 rounded-3xl bg-black/40 border border-white/10 shadow-inner flex items-center gap-4 sm:gap-6">
            {/* Aparelho em Pé (Portrait) */}
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="w-10 h-16 rounded-xl border-2 border-slate-500 flex flex-col items-center justify-between p-1 bg-slate-900/50">
                <div className="w-3 h-0.5 rounded-full bg-slate-600"></div>
                <Smartphone className="w-4 h-4 text-slate-400" />
                <div className="w-2 h-2 rounded-full border border-slate-600"></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Em Pé</span>
            </div>

            {/* Seta indicativa animada */}
            <div className="flex flex-col items-center">
              <ArrowRight className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-300 font-mono mt-0.5">Girar 90°</span>
            </div>

            {/* Aparelho Deitado (Landscape) com Glow */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-16 h-10 rounded-xl border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-between p-1 bg-amber-500/10 scale-105 transition-transform">
                <div className="w-0.5 h-3 rounded-full bg-amber-400"></div>
                <div className="flex items-center gap-1 text-amber-300 font-black text-xs">
                  <span>🎹</span>
                  <span>🎼</span>
                </div>
                <div className="w-2 h-2 rounded-full border border-amber-400"></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300">Deitada</span>
            </div>
          </div>
        </div>

        {/* Texto Informativo Conforme Wireframe */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          <p>
            A plataforma <strong className="text-white">HARMONIA</strong> foi desenhada para ser usada com a tela <strong className="text-amber-300">DEITADA (Horizontal)</strong> e em <strong className="text-cyan-300">TELA CHEIA</strong> para melhor visibilidade do teclado de 88/61 teclas, braço de violão e partituras.
          </p>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11.5px] text-slate-400 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Simulador com todas as oitavas visíveis sem corte.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Pauta musical panorâmica de alta resolução.</span>
            </div>
          </div>
        </div>

        {/* Ações: Botão Tela Cheia + Botão Continuar em Pé no Tablet */}
        <div className="space-y-3 pt-2">
          {/* Botão [ ⛶ Ativar Modo Tela Cheia ] (REQ-API-02) */}
          <button
            onClick={handleFullscreen}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 fill-current" />
            <span>Ativar Modo Tela Cheia</span>
          </button>

          {/* Opção para Tablets (RF-02.B / Wireframe): [ Continuar em Pé (Vertical) ] */}
          {isTablet && (
            <div className="pt-1">
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Continuar em Pé (Modo Vertical)
              </button>
            </div>
          )}

          {!isTablet && (
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
              <span>Basta virar o celular para a horizontal para desbloquear.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
