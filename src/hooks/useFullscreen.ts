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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback silencioso: navegadores sem suporte a Fullscreen API
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback silencioso
      }
    }
  }, [isFullscreen]);

  // Fecha a tela cheia ao pressionar Escape
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return { isFullscreen, toggleFullscreen };
}
