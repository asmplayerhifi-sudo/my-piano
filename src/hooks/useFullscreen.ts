/**
 * useFullscreen.ts
 * Hook centralizado de tela cheia (Fullscreen API).
 *
 * Elimina a duplicação de lógica idêntica que existia em 5 componentes:
 * KeyboardCourseView, GuitarCourseView, TheoryStudyAcademy, ScaleBuilder e RepertoireView.
 *
 * Responsabilidades:
 *  - Controlar o estado `isFullscreen` de forma reativa.
 *  - Alternar tela cheia via `document.documentElement.requestFullscreen` / `document.exitFullscreen`.
 *  - Registrar o listener de `Escape` para fechar a tela cheia via teclado.
 *  - Fazer cleanup automático ao desmontar o componente.
 *
 * Uso:
 *   const { isFullscreen, toggleFullscreen } = useFullscreen();
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseFullscreenReturn {
  /** Indica se a tela cheia está ativa. */
  isFullscreen: boolean;
  /** Alterna entre modo tela cheia e modo normal. */
  toggleFullscreen: () => void;
}

export function useFullscreen(): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false;
  });

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => {
            // Em caso de bloqueio por iframe ou permissão, atualiza estado local
            setIsFullscreen(true);
          });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(() => {
            setIsFullscreen(false);
          });
      } else {
        setIsFullscreen(false);
      }
    }
  }, []);

  // Sincroniza com alterações de tela cheia (F11, tecla Esc nativa, botão do browser)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return { isFullscreen, toggleFullscreen };
}

