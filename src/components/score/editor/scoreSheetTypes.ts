/**
 * editor/scoreSheetTypes.ts
 * Contratos e tipos para o visualizador de partitura formal no Editor de Partitura.
 * Regra: Tipos puros (< 50 linhas).
 */

export interface FormalScoreNote {
  id: string;
  midi: number;
  noteName: string;
  clef: 'treble' | 'bass';
  duration: number; // 4, 2, 1, 0.5, 0.25
  beat: number;     // beat position desde o início
  measure?: number;
}

export interface StaffHoverPreview {
  beat: number;
  clef: 'treble' | 'bass';
  noteName: string;
  midi: number;
  isChord: boolean;
  x: number;
  y: number;
}

export interface ScoreSheetRenderOptions {
  theme: 'paper' | 'dark';
  pixelsPerBeat: number;
  showNoteNames: boolean;
  showMeasureNumbers: boolean;
  hoverPreview?: StaffHoverPreview | null;
  selectedDuration?: number;
}
