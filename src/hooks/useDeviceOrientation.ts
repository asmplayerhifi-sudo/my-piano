import { useState, useEffect, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ScreenOrientationType = 'portrait' | 'landscape';

export interface DeviceOrientationState {
  isPortrait: boolean;
  isLandscape: boolean;
  deviceType: DeviceType;
  shouldPrompt: boolean;
  isTabletIgnored: boolean;
  width: number;
  height: number;
}

export const SESSION_STORAGE_KEY_IGNORE_PORTRAIT = 'ignore_portrait_warning';

/**
 * Determines device type based on width in portrait orientation
 * - Mobile: width < 768px
 * - Tablet: 768px <= width <= 1024px
 * - Desktop: width > 1024px
 */
export function determineDeviceType(width: number, height: number, isPortrait: boolean): DeviceType {
  if (isPortrait) {
    if (width < 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  // Em Landscape:
  if (height < 500 || width < 768) {
    return 'mobile';
  }
  if (width <= 1024) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Evaluates whether orientation prompt should be displayed
 */
export function shouldDisplayOrientationPrompt(
  isPortrait: boolean,
  deviceType: DeviceType,
  isTabletIgnored: boolean
): boolean {
  if (!isPortrait) return false;
  if (deviceType === 'mobile') return true;
  if (deviceType === 'tablet') return !isTabletIgnored;
  return false;
}

export function useDeviceOrientation() {
  const getIsTabletIgnored = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(SESSION_STORAGE_KEY_IGNORE_PORTRAIT) === 'true';
    } catch {
      return false;
    }
  };

  const checkOrientationState = useCallback((): DeviceOrientationState => {
    if (typeof window === 'undefined') {
      return {
        isPortrait: false,
        isLandscape: true,
        deviceType: 'desktop',
        shouldPrompt: false,
        isTabletIgnored: false,
        width: 1280,
        height: 800,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const portraitMedia = window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : false;
    const isPortrait = portraitMedia || height > width;
    const isLandscape = !isPortrait;

    const deviceType = determineDeviceType(width, height, isPortrait);
    const isTabletIgnored = getIsTabletIgnored();
    const shouldPrompt = shouldDisplayOrientationPrompt(isPortrait, deviceType, isTabletIgnored);

    return {
      isPortrait,
      isLandscape,
      deviceType,
      shouldPrompt,
      isTabletIgnored,
      width,
      height,
    };
  }, []);

  const [state, setState] = useState<DeviceOrientationState>(checkOrientationState);

  useEffect(() => {
    const handleUpdate = () => {
      setState(checkOrientationState());
    };

    // Initial check
    handleUpdate();

    // Listeners for resize, orientationchange, and media query changes (RF-01.2)
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('orientationchange', handleUpdate);

    let mediaQuery: MediaQueryList | null = null;
    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(orientation: portrait)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleUpdate);
      } else if ('addListener' in mediaQuery) {
        // Fallback for older browsers
        (mediaQuery as any).addListener(handleUpdate);
      }
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('orientationchange', handleUpdate);
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleUpdate);
        } else if ('removeListener' in mediaQuery) {
          (mediaQuery as any).removeListener(handleUpdate);
        }
      }
    };
  }, [checkOrientationState]);

  // Continuar no modo vertical no tablet (REQ-API-03)
  const ignoreTabletWarning = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY_IGNORE_PORTRAIT, 'true');
    } catch {
      // Ignore storage error
    }
    setState(prev => ({
      ...prev,
      isTabletIgnored: true,
      shouldPrompt: false,
    }));
  }, []);

  // Ativar modo tela cheia e tentar travar em landscape (REQ-API-01 & REQ-API-02)
  const activateFullscreenAndLandscape = useCallback(async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Ignore fullscreen error
    }

    // Attempt Screen Orientation lock if available (Chrome Android)
    try {
      const orientationObj = window.screen?.orientation as any;
      if (orientationObj && typeof orientationObj.lock === 'function') {
        await orientationObj.lock('landscape').catch(() => {});
      }
    } catch {
      // Ignore orientation lock error
    }
  }, []);

  return {
    ...state,
    ignoreTabletWarning,
    activateFullscreenAndLandscape,
    checkOrientationState,
  };
}
