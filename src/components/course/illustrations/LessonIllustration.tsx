/**
 * illustrations/LessonIllustration.tsx
 * Componente orquestrador da Figura Explicativa / Diagrama Vetorial da Tríade Didática.
 * Regra: Orquestrador limpo (< 180 linhas).
 */

import React from 'react';
import type { LessonDiagramProps } from './types';
import {
  HandPostureDiagram,
  FingeringHandsDiagram,
  BlackKeyGroupsDiagram,
  TriadFormulaDiagram,
  InversionsDiagram,
} from './KeyboardDiagrams';
import {
  GuitarStringsDiagram,
  CAGEDShapesDiagram,
  PestanaBarreDiagram,
  StrummingPatternDiagram,
} from './GuitarDiagrams';
import {
  IntervalRulerDiagram,
  HarmonicDegreesDiagram,
  TetradFormulaDiagram,
} from './TheoryDiagrams';
import { Eye } from 'lucide-react';

export const LessonIllustration: React.FC<LessonDiagramProps> = ({
  lessonId,
  moduleCode,
  title,
  instrument,
  className = '',
  targetNotes,
}) => {
  const normalizedTitle = (lessonId + ' ' + title + ' ' + moduleCode).toLowerCase();

  const renderDiagram = () => {
    // ── 1. Instrumento: TECLADO / PIANO ──
    if (instrument === 'keyboard') {
      if (normalizedTitle.includes('postura') || normalizedTitle.includes('biomecânica') || normalizedTitle.includes('cúpula')) {
        return <HandPostureDiagram />;
      }
      if (normalizedTitle.includes('dedo') || normalizedTitle.includes('dedilhado') || normalizedTitle.includes('t1')) {
        return <FingeringHandsDiagram />;
      }
      if (normalizedTitle.includes('topografia') || normalizedTitle.includes('tecla preta') || normalizedTitle.includes('dó central')) {
        return <BlackKeyGroupsDiagram />;
      }
      if (normalizedTitle.includes('inversão') || normalizedTitle.includes('inversões')) {
        return <InversionsDiagram />;
      }
      if (normalizedTitle.includes('tríade') || normalizedTitle.includes('maior') || normalizedTitle.includes('acorde')) {
        return <TriadFormulaDiagram root={targetNotes?.[0] || 'C'} />;
      }
      // Padrão Teclado
      return <BlackKeyGroupsDiagram />;
    }

    // ── 2. Instrumento: VIOLÃO ──
    if (instrument === 'guitar') {
      if (normalizedTitle.includes('corda') || normalizedTitle.includes('afinação') || normalizedTitle.includes('v1')) {
        return <GuitarStringsDiagram />;
      }
      if (normalizedTitle.includes('pestana') || normalizedTitle.includes('barre') || normalizedTitle.includes('fá menor')) {
        return <PestanaBarreDiagram />;
      }
      if (normalizedTitle.includes('batida') || normalizedTitle.includes('ritmo') || normalizedTitle.includes('levada') || normalizedTitle.includes('palheta')) {
        return <StrummingPatternDiagram />;
      }
      if (normalizedTitle.includes('caged') || normalizedTitle.includes('shape') || normalizedTitle.includes('braço')) {
        return <CAGEDShapesDiagram />;
      }
      // Padrão Violão
      return <CAGEDShapesDiagram />;
    }

    // ── 3. TEORIA MUSICAL ──
    if (normalizedTitle.includes('campo') || normalizedTitle.includes('grau') || normalizedTitle.includes('funç')) {
      return <HarmonicDegreesDiagram />;
    }
    if (normalizedTitle.includes('tétrade') || normalizedTitle.includes('sétima') || normalizedTitle.includes('7m') || normalizedTitle.includes('7M')) {
      return <TetradFormulaDiagram />;
    }
    // Padrão Teoria: Régua Intervalar
    return <IntervalRulerDiagram />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-bold flex items-center gap-1.5 text-indigo-300">
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>Figura Didática Explicativa (Tríade Pedagógica)</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono uppercase">
          Infográfico Vetorial
        </span>
      </div>
      <div className="w-full overflow-hidden">
        {renderDiagram()}
      </div>
    </div>
  );
};
