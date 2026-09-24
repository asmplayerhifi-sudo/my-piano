/**
 * ScrollingScoreCanvas.tsx
 * Ponto de entrada oficial para a Esteira de Partitura Deslizante.
 * Reexporta a implementação modular de Clean Architecture mantendo 100% de retrocompatibilidade.
 * Regra: SRP / Barrel facade (< 30 linhas).
 */

import { ScrollingScoreCanvas } from './scrolling/ScrollingScoreCanvas';

export type { MidiInputNote, ChordSpan, ScrollingScoreProps, DisplayOptions, ScoreTheme } from './scrolling/types';
export { ScrollingScoreCanvas };
export default ScrollingScoreCanvas;