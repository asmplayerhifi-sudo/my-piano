/**
 * illustrations/LessonIllustration.tsx
 * Componente orquestrador da Figura Explicativa / Diagrama Vetorial da Tríade Didática.
 * Regra: Orquestrador limpo (< 180 linhas).
 */

import React from 'react';
import type { LessonDiagramProps } from './types';
import {
  BlackKeyGeographyDiagram,
  HandPostureBiomechanicsDiagram,
  FingeringNumberingDiagram,
} from './KeyboardDiagramsBasic';
import {
  TrebleStaffReadingDiagram,
  BassStaffReadingDiagram,
  BimanualCoordinationDiagram,
} from './KeyboardDiagramsReading';
import {
  RhythmTreeDivisionDiagram,
  TriadFormulaWideDiagram,
  ChordInversionsCycleDiagram,
} from './KeyboardDiagramsHarmony';
import {
  FretProximityDiagram,
  GuitarTuningStringsDiagram,
  OpenChordsShapesDiagram,
} from './GuitarDiagramsBasic';
import {
  PestanaBarreMechanicsDiagram,
  StrummingRhythmDiagram,
  CAGEDSystemPanoramicDiagram,
} from './GuitarDiagramsAdvanced';
import {
  SoundPropertiesDiagram,
  TimeSignatureAnatomyDiagram,
  MajorScaleStepPatternDiagram,
} from './TheoryDiagramsAcoustics';
import {
  IntervalRulerWideDiagram,
  HarmonicPillarsDiagram,
  CircleOfFifthsClockDiagram,
} from './TheoryDiagramsHarmony';
import { Eye } from 'lucide-react';

export const LessonIllustration: React.FC<LessonDiagramProps> = ({
  lessonId,
  moduleCode,
  title,
  instrument,
  className = '',
}) => {
  const query = (lessonId + ' ' + title + ' ' + moduleCode).toLowerCase();

  const renderDiagram = () => {
    // ── 1. Instrumento: TECLADO / PIANO ──
    if (instrument === 'keyboard') {
      if (query.includes('geografia') || query.includes('preta') || query.includes('t1-1') || query.includes('dó central')) {
        return <BlackKeyGeographyDiagram />;
      }
      if (query.includes('postura') || query.includes('biomecânica') || query.includes('maçã') || query.includes('cúpula') || query.includes('t1-2') || query.includes('t1-3')) {
        return <HandPostureBiomechanicsDiagram />;
      }
      if (query.includes('clave de sol') || query.includes('linhas') || query.includes('espaços') || query.includes('t2-1')) {
        return <TrebleStaffReadingDiagram />;
      }
      if (query.includes('pulso') || query.includes('rítmico') || query.includes('4/4') || query.includes('3/4') || query.includes('divisão') || query.includes('t2-2')) {
        return <RhythmTreeDivisionDiagram />;
      }
      if (query.includes('clave de fá') || query.includes('bass') || query.includes('graves') || query.includes('t3-1') || query.includes('t3-2')) {
        return <BassStaffReadingDiagram />;
      }
      if (query.includes('mãos juntas') || query.includes('coordenação') || query.includes('hands together') || query.includes('t3-3')) {
        return <BimanualCoordinationDiagram />;
      }
      if (query.includes('inversão') || query.includes('inversões') || query.includes('posições')) {
        return <ChordInversionsCycleDiagram />;
      }
      if (query.includes('tríade') || query.includes('maior') || query.includes('menor') || query.includes('acorde')) {
        return <TriadFormulaWideDiagram />;
      }
      if (query.includes('dedo') || query.includes('digitação') || query.includes('ode') || query.includes('t2-3')) {
        return <FingeringNumberingDiagram />;
      }
      return <BlackKeyGeographyDiagram />;
    }

    // ── 2. Instrumento: VIOLÃO ──
    if (instrument === 'guitar') {
      if (query.includes('traste') || query.includes('mecânica') || query.includes('zumbido') || query.includes('buzz') || query.includes('v1-1')) {
        return <FretProximityDiagram />;
      }
      if (query.includes('afinação') || query.includes('calibre') || query.includes('p-i-m-a') || query.includes('v1-2')) {
        return <GuitarTuningStringsDiagram />;
      }
      if (query.includes('pestana') || query.includes('barre') || query.includes('alavanca')) {
        return <PestanaBarreMechanicsDiagram />;
      }
      if (query.includes('levada') || query.includes('batida') || query.includes('ritmo') || query.includes('palheta')) {
        return <StrummingRhythmDiagram />;
      }
      if (query.includes('caged') || query.includes('braço')) {
        return <CAGEDSystemPanoramicDiagram />;
      }
      return <OpenChordsShapesDiagram />;
    }

    // ── 3. TEORIA MUSICAL ──
    if (query.includes('propriedades') || query.includes('física') || query.includes('altura') || query.includes('timbre') || query.includes('m1-1')) {
      return <SoundPropertiesDiagram />;
    }
    if (query.includes('compasso') || query.includes('métrica') || query.includes('fórmula') || query.includes('m1-3') || query.includes('m1-4')) {
      return <TimeSignatureAnatomyDiagram />;
    }
    if (query.includes('escala') || query.includes('diatônica') || query.includes('tom') || query.includes('m2-1')) {
      return <MajorScaleStepPatternDiagram />;
    }
    if (query.includes('quintas') || query.includes('ciclo') || query.includes('armadura')) {
      return <CircleOfFifthsClockDiagram />;
    }
    if (query.includes('campo') || query.includes('grau') || query.includes('funç') || query.includes('tônica') || query.includes('pilar')) {
      return <HarmonicPillarsDiagram />;
    }
    return <IntervalRulerWideDiagram />;
  };

  return (
    <div className={`w-full space-y-2.5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span className="font-bold flex items-center gap-1.5 text-indigo-300">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span>Figura Didática Explicativa (Tríade Pedagógica)</span>
        </span>
        <span className="text-[10px] text-indigo-300/80 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
          Infográfico Panorâmico de Alta Resolução
        </span>
      </div>
      <div className="w-full overflow-hidden transition-all">
        {renderDiagram()}
      </div>
    </div>
  );
};
