import { describe, it, expect, beforeEach } from 'vitest';
import {
  determineDeviceType,
  shouldDisplayOrientationPrompt,
  SESSION_STORAGE_KEY_IGNORE_PORTRAIT,
} from '../../src/hooks/useDeviceOrientation';

describe('Bloqueio Orientativo de Tela & Suporte Adaptativo (REQ-UI-RESPONSIVE-ORIENTATION-01)', () => {
  beforeEach(() => {
    try {
      sessionStorage.clear();
    } catch {
      // Ignore if not present
    }
  });

  describe('RF-01: Detecção Automática de Tipo de Dispositivo', () => {
    it('deve classificar como "mobile" smartphones com largura < 768px em modo portrait', () => {
      // iPhone 14 / Galaxy S23 / Pixel
      expect(determineDeviceType(390, 844, true)).toBe('mobile');
      expect(determineDeviceType(412, 915, true)).toBe('mobile');
      expect(determineDeviceType(360, 800, true)).toBe('mobile');
      expect(determineDeviceType(767, 1000, true)).toBe('mobile');
    });

    it('deve classificar como "tablet" dispositivos entre 768px e 1024px em modo portrait', () => {
      // iPad Mini (768px), iPad Air (820px), Galaxy Tab (800px)
      expect(determineDeviceType(768, 1024, true)).toBe('tablet');
      expect(determineDeviceType(820, 1180, true)).toBe('tablet');
      expect(determineDeviceType(800, 1280, true)).toBe('tablet');
      expect(determineDeviceType(1024, 1366, true)).toBe('tablet');
    });

    it('deve classificar como "desktop" telas maiores que 1024px de largura mínima', () => {
      expect(determineDeviceType(1280, 800, false)).toBe('desktop');
      expect(determineDeviceType(1440, 900, false)).toBe('desktop');
      expect(determineDeviceType(1920, 1080, false)).toBe('desktop');
    });
  });

  describe('RF-02: Regras de Bloqueio por Tipo de Dispositivo', () => {
    it('Cenário 1: Smartphones em Portrait devem acionar o bloqueio orientativo (shouldPrompt = true)', () => {
      const isPortrait = true;
      const deviceType = 'mobile';
      const isTabletIgnored = false;

      const shouldPrompt = shouldDisplayOrientationPrompt(isPortrait, deviceType, isTabletIgnored);
      expect(shouldPrompt).toBe(true);
    });

    it('Cenário 1.1: Ao girar smartphone para Landscape, o bloqueio deve desaparecer imediatamente (shouldPrompt = false)', () => {
      const isPortrait = false; // Landscape
      const deviceType = 'mobile';
      const isTabletIgnored = false;

      const shouldPrompt = shouldDisplayOrientationPrompt(isPortrait, deviceType, isTabletIgnored);
      expect(shouldPrompt).toBe(false);
    });

    it('Cenário 2: Tablets em Portrait devem exibir o aviso inicial (shouldPrompt = true)', () => {
      const isPortrait = true;
      const deviceType = 'tablet';
      const isTabletIgnored = false;

      const shouldPrompt = shouldDisplayOrientationPrompt(isPortrait, deviceType, isTabletIgnored);
      expect(shouldPrompt).toBe(true);
    });

    it('Cenário 2.1: Se usuário do Tablet optar por continuar na vertical, o modal não deve mais bloquear (shouldPrompt = false)', () => {
      const isPortrait = true;
      const deviceType = 'tablet';
      const isTabletIgnored = true; // Usuário clicou em [ Continuar em Pé ]

      const shouldPrompt = shouldDisplayOrientationPrompt(isPortrait, deviceType, isTabletIgnored);
      expect(shouldPrompt).toBe(false);
    });

    it('Cenário 2.2: Chave de persistência de sessão para o tablet deve ser "ignore_portrait_warning"', () => {
      expect(SESSION_STORAGE_KEY_IGNORE_PORTRAIT).toBe('ignore_portrait_warning');
    });

    it('Cenário 3: Computadores Desktop nunca devem sofrer bloqueio de orientação', () => {
      expect(shouldDisplayOrientationPrompt(false, 'desktop', false)).toBe(false);
      expect(shouldDisplayOrientationPrompt(true, 'desktop', false)).toBe(false);
    });
  });
});
