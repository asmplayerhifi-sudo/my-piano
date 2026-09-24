/**
 * illustrations/LessonIllustration.tsx
 * Componente orquestrador da Figura Explicativa / Diagrama Vetorial da Tríade Didática.
 * Mapeia 100% das lições de Teoria Musical, Teclado e Violão para diagramas vetoriais dedicados e exclusivos.
 * Regra: Orquestrador limpo (< 220 linhas).
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
  GrandStaffCompleteDiagram,
  RhythmAndMeterComboDiagram,
  TonesSemitonesEnharmonicsDiagram,
} from './TheoryDiagramsAcoustics';
import {
  IntervalRulerWideDiagram,
  TritoneAndRuleOfNineDiagram,
  MajorScaleStepPatternDiagram,
  KeySignaturesAndFifthsDiagram,
  ThreeMinorScalesDiagram,
  HarmonicPillarsDiagram,
} from './TheoryDiagramsHarmony';
import {
  FourTriadsFamilyDiagram,
  ChordInversionsSlashChordsDiagram,
  FiveTetradsFamiliesDiagram,
  DiatonicHarmonicFieldDiagram,
  CadencesAndPopProgressionDiagram,
  GreekModesPanoramicDiagram,
  SecondaryDominantsAndModalInterchangeDiagram,
} from './TheoryDiagramsAdvanced';
import { Eye } from 'lucide-react';

export const LessonIllustration: React.FC<LessonDiagramProps> = ({
  lessonId,
  moduleCode,
  title,
  instrument,
  className = '',
}) => {
  const normId = (lessonId || '').toLowerCase().trim();
  const query = (normId + ' ' + title + ' ' + moduleCode).toLowerCase();

  const renderDiagram = () => {
    // ── 1. MAPA DEDICADO DAS 17 LIÇÕES DO CURSO DE TEORIA MUSICAL (M1 a M7) ──
    if (instrument === 'theory') {
      // Módulo 1: Fundamentos do Som, Notação & Pentagrama
      if (normId === 'm1-1' || query.includes('propriedades') || query.includes('física da música')) {
        return <SoundPropertiesDiagram />;
      }
      if (normId === 'm1-2' || query.includes('pauta') || query.includes('pentagrama') || query.includes('linhas suplementares')) {
        return <GrandStaffCompleteDiagram />;
      }
      if (normId === 'm1-3' || query.includes('figuras rítmicas') || query.includes('proporções de duração') || query.includes('fórmulas de compasso')) {
        return <RhythmAndMeterComboDiagram />;
      }

      // Módulo 2: Intervalos, Semitons & Enarmonia
      if (normId === 'm2-1' || query.includes('semitons naturais') || query.includes('enarmonia')) {
        return <TonesSemitonesEnharmonicsDiagram />;
      }
      if (normId === 'm2-2' || query.includes('classificação completa dos intervalos') || query.includes('régua intervalar')) {
        return <IntervalRulerWideDiagram />;
      }
      if (normId === 'm2-3' || query.includes('trítono') || query.includes('regra do 9') || query.includes('inversão de intervalos')) {
        return <TritoneAndRuleOfNineDiagram />;
      }

      // Módulo 3: Escalas Maiores, Menores & Armaduras
      if (normId === 'm3-1' || query.includes('escala maior natural') || query.includes('t-t-st')) {
        return <MajorScaleStepPatternDiagram />;
      }
      if (normId === 'm3-2' || query.includes('armaduras') || query.includes('sustenidos e bemóis') || query.includes('ordem dos sustenidos')) {
        return <KeySignaturesAndFifthsDiagram />;
      }
      if (normId === 'm3-3' || query.includes('três escalas menores') || query.includes('harmônica e melódica') || query.includes('menor natural')) {
        return <ThreeMinorScalesDiagram />;
      }

      // Módulo 4: Tríades, Inversões & Tétrades
      if (normId === 'm4-1' || query.includes('4 tríades') || query.includes('diminuta e aumentada') || query.includes('tríades fundamentais')) {
        return <FourTriadsFamilyDiagram />;
      }
      if (normId === 'm4-2' || query.includes('inversões de acordes') || query.includes('slash chords') || query.includes('notação de baixo')) {
        return <ChordInversionsSlashChordsDiagram />;
      }
      if (normId === 'm4-3' || query.includes('tétrades') || query.includes('5 famílias') || query.includes('acordes com sétima')) {
        return <FiveTetradsFamiliesDiagram />;
      }

      // Módulo 5: Campo Harmônico, Funções & Cadências
      if (normId === 'm5-1' || query.includes('campo harmônico maior') || query.includes('tríades e tétrades')) {
        return <DiatonicHarmonicFieldDiagram />;
      }
      if (normId === 'm5-2' || query.includes('funções harmônicas') || query.includes('tônica, subdominante')) {
        return <HarmonicPillarsDiagram />;
      }
      if (normId === 'm5-3' || query.includes('cadências históricas') || query.includes('ii - v - i') || query.includes('progressão pop')) {
        return <CadencesAndPopProgressionDiagram />;
      }

      // Módulo 6: Modos Gregos
      if (normId === 'm6-1' || query.includes('modos gregos') || query.includes('jônio') || query.includes('dórico') || query.includes('lídio')) {
        return <GreekModesPanoramicDiagram />;
      }

      // Módulo 7: Harmonia Funcional Avançada
      if (normId === 'm7-1' || query.includes('dominantes secundários') || query.includes('empréstimo modal') || query.includes('aem')) {
        return <SecondaryDominantsAndModalInterchangeDiagram />;
      }

      return <IntervalRulerWideDiagram />;
    }

    // ── 2. INSTRUMENTO: TECLADO / PIANO ──
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

    // ── 3. INSTRUMENTO: VIOLÃO ──
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
