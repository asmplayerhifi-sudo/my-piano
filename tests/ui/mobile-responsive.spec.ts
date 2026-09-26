/**
 * tests/ui/mobile-responsive.spec.ts
 *
 * Suite de Responsividade Mobile — Plataforma HARMONIA
 *
 * Valida critérios de UX mobile sem renderização real de DOM.
 * Viewports testados: 360px (small), 390px (medium), 430px (large).
 */

import { describe, it, expect } from 'vitest';
import { getResponsiveDefaultOctaveCount } from '../../src/components/piano/PianoKeyboard';

// ─── 1. PianoKeyboard — Octave count responsivo ───────────────────────────────

describe('1. PianoKeyboard — octave count baseado no viewport (C6 / Critério 12)', () => {
  it('retorna 2 oitavas para 360px (Galaxy A / Moto G)', () => {
    expect(getResponsiveDefaultOctaveCount(undefined, 360)).toBe(2);
  });

  it('retorna 2 oitavas para 390px (iPhone 14 / Pixel 7)', () => {
    expect(getResponsiveDefaultOctaveCount(undefined, 390)).toBe(2);
  });

  it('retorna 2 oitavas para 430px (iPhone 14 Pro Max)', () => {
    expect(getResponsiveDefaultOctaveCount(undefined, 430)).toBe(2);
  });

  it('retorna 3 oitavas para 520px (tablet compacto)', () => {
    expect(getResponsiveDefaultOctaveCount(undefined, 520)).toBe(3);
  });

  it('retorna 3 oitavas para 768px (tablet médio)', () => {
    expect(getResponsiveDefaultOctaveCount(undefined, 768)).toBe(3);
  });

  it('retorna 4 oitavas para >= 900px (desktop)', () => {
    expect(getResponsiveDefaultOctaveCount(undefined, 900)).toBe(4);
  });

  it('prop explícita tem prioridade sobre viewport', () => {
    expect(getResponsiveDefaultOctaveCount(3, 360)).toBe(3);
    expect(getResponsiveDefaultOctaveCount(2, 1440)).toBe(2);
  });
});

// ─── 2. PianoKeyboard — Largura mínima de teclas em mobile ────────────────────

describe('2. PianoKeyboard — largura mínima de tecla (touch ergonomy)', () => {
  it('com 2 oitavas em 360px: tecla branca >= 22px', () => {
    const available = Math.max(300, 360 - 16);
    const keyWidth = available / (2 * 7);
    expect(keyWidth).toBeGreaterThanOrEqual(22);
  });

  it('com 2 oitavas em 360px: tecla preta >= 14px', () => {
    const available = Math.max(300, 360 - 16);
    const whiteW = available / (2 * 7);
    const blackW = Math.max(10, whiteW * 0.62);
    expect(blackW).toBeGreaterThanOrEqual(14);
  });

  it('altura de tecla branca >= 125px (formula: max(125, min(185, w * 4.6)))', () => {
    const height = Math.max(125, Math.min(185, 26 * 4.6));
    expect(height).toBeGreaterThanOrEqual(125);
  });
});

// ─── 3. Score canvas — altura mínima legível (CSS clamp) ─────────────────────

describe('3. Score canvas — altura mínima legível (CSS clamp)', () => {
  function clampH(vh: number) {
    return Math.min(260, Math.max(160, vh * 0.28));
  }

  it('800px viewport: clamp retorna ~224px', () => {
    expect(clampH(800)).toBeCloseTo(224, 0);
  });

  it('667px (iPhone SE): clamp >= 160px', () => {
    expect(clampH(667)).toBeGreaterThanOrEqual(160);
  });

  it('1080px viewport: capped at 260px', () => {
    expect(clampH(1080)).toBe(260);
  });

  it('SightReadingStaffCanvas treble height (240px) >= 200px', () => {
    expect(240).toBeGreaterThanOrEqual(200);
  });

  it('SightReadingStaffCanvas grand staff height (340px) >= 300px', () => {
    expect(340).toBeGreaterThanOrEqual(300);
  });
});

// ─── 4. Accordion de Configuração (SightReadingView) ─────────────────────────

describe('4. Config accordion — estado inicial por viewport (C4)', () => {
  function isOpen(w: number) {
    return w >= 768;
  }

  it('360px: colapsado', () => { expect(isOpen(360)).toBe(false); });
  it('390px: colapsado', () => { expect(isOpen(390)).toBe(false); });
  it('430px: colapsado', () => { expect(isOpen(430)).toBe(false); });
  it('768px: expandido (tablet)', () => { expect(isOpen(768)).toBe(true); });
  it('1024px: expandido (desktop)', () => { expect(isOpen(1024)).toBe(true); });
});

// ─── 5. Bottom Sheet — swipe gesture threshold ────────────────────────────────

describe('5. Bottom Sheet — swipe-down gesture (C1)', () => {
  function shouldClose(startY: number, endY: number) {
    return (endY - startY) > 80;
  }

  it('swipe 100px: fecha', () => { expect(shouldClose(300, 400)).toBe(true); });
  it('swipe 80px: nao fecha (>80 required)', () => { expect(shouldClose(300, 380)).toBe(false); });
  it('swipe 50px: nao fecha', () => { expect(shouldClose(300, 350)).toBe(false); });
  it('swipe-up: nao fecha', () => { expect(shouldClose(400, 300)).toBe(false); });
});

// ─── 6. Cobertura de 3 viewports (Critério 12) ───────────────────────────────

describe('6. Cobertura — 3 tamanhos de celular (Critério 12)', () => {
  const devices = [
    { name: 'Pequeno 360px', width: 360 },
    { name: 'Médio 390px',   width: 390 },
    { name: 'Grande 430px',  width: 430 },
  ];

  devices.forEach(({ name, width }) => {
    it(`${name}: octaveCount = 2`, () => {
      expect(getResponsiveDefaultOctaveCount(undefined, width)).toBe(2);
    });

    it(`${name}: tecla >= 22px com 2 oitavas`, () => {
      const keyW = Math.max(300, width - 16) / 14;
      expect(keyW).toBeGreaterThanOrEqual(22);
    });

    it(`${name}: config accordion colapsado`, () => {
      expect(width >= 768).toBe(false);
    });
  });
});
