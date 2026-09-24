/**
 * illustrations/types.ts
 * Contratos e propriedades para os diagramas vetoriais educativos de lições.
 * Regra: Tipos puros (< 40 linhas).
 */

export interface LessonDiagramProps {
  lessonId: string;
  moduleCode: string;
  title: string;
  instrument: 'keyboard' | 'guitar' | 'theory';
  className?: string;
  targetNotes?: string[];
  fingeringTip?: string;
  diagramType?: string;
}
