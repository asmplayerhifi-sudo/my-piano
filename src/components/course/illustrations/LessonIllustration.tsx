/**
 * illustrations/LessonIllustration.tsx
 * Componente orquestrador da Figura Explicativa / Diagrama Vetorial da Tríade Didática.
 * Mapeia 100% das lições de Teoria Musical, Teclado e Violão para diagramas vetoriais dedicados,
 * todos com proporção padrão widescreen de alta definição (960x250).
 * Regra: Orquestrador limpo (< 260 linhas).
 */

import React from 'react';
import type { LessonDiagramProps } from './types';
import {
  BlackKeyGeographyDiagram,
  HandPostureBiomechanicsDiagram,
  ArmWeightRelaxationDiagram,
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
  PopFourChordsProgressionDiagram,
} from './KeyboardDiagramsHarmony';
import {
  ArpeggioOpenTextureDiagram,
  ThumbUnderScaleTechniqueDiagram,
  HanonIndependenceDiagram,
  ModernChordsWorshipDiagram,
  BluesScaleAndShuffleDiagram,
  SustainPedalAndDynamicsDiagram,
} from './KeyboardDiagramsTechnique';
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
    // ── 1. MAPA DEDICADO DO CURSO DE TECLADO & PIANO (t1-1 a t10-3) ──
    if (instrument === 'keyboard') {
      // Módulo 1: Primeiros Passos & Postura ao Piano
      if (normId === 't1-1' || query.includes('geografia') || query.includes('preta') || query.includes('dó central')) {
        return <BlackKeyGeographyDiagram />;
      }
      if (normId === 't1-2' || query.includes('postura') || query.includes('biomecânica') || query.includes('maçã') || query.includes('cúpula')) {
        return <HandPostureBiomechanicsDiagram />;
      }
      if (normId === 't1-3' || query.includes('peso do braço') || query.includes('respiração musical')) {
        return <ArmWeightRelaxationDiagram />;
      }

      // Módulo 2: O Despertar da Leitura Musical
      if (normId === 't2-1' || query.includes('clave de sol') || query.includes('linhas e espaços')) {
        return <TrebleStaffReadingDiagram />;
      }
      if (normId === 't2-2' || query.includes('pulso rítmico') || query.includes('semínima e mínima')) {
        return <RhythmTreeDivisionDiagram />;
      }
      if (normId === 't2-3' || query.includes('ode') || query.includes('numeração') || query.includes('dedilhado')) {
        return <FingeringNumberingDiagram />;
      }

      // Módulo 3: O Alicerce da Mão Esquerda
      if (normId === 't3-1' || query.includes('clave de fá') || query.includes('bass clef')) {
        return <BassStaffReadingDiagram />;
      }
      if (normId === 't3-2' || query.includes('alicerce') || query.includes('baixos sustentados')) {
        return <BassStaffReadingDiagram />;
      }
      if (normId === 't3-3' || query.includes('mãos juntas') || query.includes('coordenação') || query.includes('hands together')) {
        return <BimanualCoordinationDiagram />;
      }

      // Módulo 4: A Fábrica de Acordes
      if (normId === 't4-1' || normId === 't4-2' || query.includes('tríade') || query.includes('tríades')) {
        return <TriadFormulaWideDiagram />;
      }
      if (normId === 't4-3' || query.includes('progressão pop')) {
        return <PopFourChordsProgressionDiagram />;
      }

      // Módulo 5: Inversões & Condução Suave de Vozes
      if (normId === 't5-1' || normId === 't5-2' || query.includes('inversão') || query.includes('inversões') || query.includes('voice leading')) {
        return <ChordInversionsCycleDiagram />;
      }
      if (normId === 't5-3' || query.includes('let it be')) {
        return <PopFourChordsProgressionDiagram />;
      }

      // Módulo 6: Padrões de Acompanhamento & Texturas
      if (normId === 't6-1' || normId === 't6-2' || query.includes('arpejo') || query.includes('balada')) {
        return <ArpeggioOpenTextureDiagram />;
      }
      if (normId === 't6-3' || query.includes('valsa')) {
        return <RhythmTreeDivisionDiagram />;
      }

      // Módulo 7: Agilidade, Escalas & Passagem do Polegar
      if (normId === 't7-1' || normId === 't7-2' || query.includes('polegar') || query.includes('thumb') || query.includes('escala de sol')) {
        return <ThumbUnderScaleTechniqueDiagram />;
      }
      if (normId === 't7-3' || query.includes('hanon') || query.includes('independência')) {
        return <HanonIndependenceDiagram />;
      }

      // Módulo 8: Harmonia Moderna: Sétimas & Acordes Worship
      if (normId === 't8-1' || normId === 't8-2' || query.includes('worship') || query.includes('sus4') || query.includes('sus2') || query.includes('add9')) {
        return <ModernChordsWorshipDiagram />;
      }
      if (normId === 't8-3' || query.includes('ii - v - i')) {
        return <ChordInversionsCycleDiagram />;
      }

      // Módulo 9: Estilos Populares: Blues, Boogie-Woogie & Bossa
      if (normId === 't9-1' || normId === 't9-2' || query.includes('blues') || query.includes('boogie') || query.includes('shuffle')) {
        return <BluesScaleAndShuffleDiagram />;
      }
      if (normId === 't9-3' || query.includes('garota de ipanema') || query.includes('bossa')) {
        return <ModernChordsWorshipDiagram />;
      }

      // Módulo 10: Expressão Artística: Dinâmica & Pedal de Sustain
      if (normId === 't10-1' || normId === 't10-2' || query.includes('sustain') || query.includes('pedal') || query.includes('dinâmica')) {
        return <SustainPedalAndDynamicsDiagram />;
      }
      if (normId === 't10-3' || query.includes('elise')) {
        return <ArmWeightRelaxationDiagram />;
      }

      return <BlackKeyGeographyDiagram />;
    }

    // ── 2. MAPA DEDICADO DAS 17 LIÇÕES DE TEORIA MUSICAL (M1 a M7) ──
    if (instrument === 'theory') {
      if (normId === 'm1-1' || query.includes('propriedades') || query.includes('física da música')) {
        return <SoundPropertiesDiagram />;
      }
      if (normId === 'm1-2' || query.includes('pauta') || query.includes('pentagrama') || query.includes('linhas suplementares')) {
        return <GrandStaffCompleteDiagram />;
      }
      if (normId === 'm1-3' || query.includes('figuras rítmicas') || query.includes('proporções de duração') || query.includes('fórmulas de compasso')) {
        return <RhythmAndMeterComboDiagram />;
      }
      if (normId === 'm2-1' || query.includes('semitons naturais') || query.includes('enarmonia')) {
        return <TonesSemitonesEnharmonicsDiagram />;
      }
      if (normId === 'm2-2' || query.includes('classificação completa dos intervalos') || query.includes('régua intervalar')) {
        return <IntervalRulerWideDiagram />;
      }
      if (normId === 'm2-3' || query.includes('trítono') || query.includes('regra do 9') || query.includes('inversão de intervalos')) {
        return <TritoneAndRuleOfNineDiagram />;
      }
      if (normId === 'm3-1' || query.includes('escala maior natural') || query.includes('t-t-st')) {
        return <MajorScaleStepPatternDiagram />;
      }
      if (normId === 'm3-2' || query.includes('armaduras') || query.includes('sustenidos e bemóis') || query.includes('ordem dos sustenidos')) {
        return <KeySignaturesAndFifthsDiagram />;
      }
      if (normId === 'm3-3' || query.includes('três escalas menores') || query.includes('harmônica e melódica') || query.includes('menor natural')) {
        return <ThreeMinorScalesDiagram />;
      }
      if (normId === 'm4-1' || query.includes('4 tríades') || query.includes('diminuta e aumentada') || query.includes('tríades fundamentais')) {
        return <FourTriadsFamilyDiagram />;
      }
      if (normId === 'm4-2' || query.includes('inversões de acordes') || query.includes('slash chords') || query.includes('notação de baixo')) {
        return <ChordInversionsSlashChordsDiagram />;
      }
      if (normId === 'm4-3' || query.includes('tétrades') || query.includes('5 famílias') || query.includes('acordes com sétima')) {
        return <FiveTetradsFamiliesDiagram />;
      }
      if (normId === 'm5-1' || query.includes('campo harmônico maior') || query.includes('tríades e tétrades')) {
        return <DiatonicHarmonicFieldDiagram />;
      }
      if (normId === 'm5-2' || query.includes('funções harmônicas') || query.includes('tônica, subdominante')) {
        return <HarmonicPillarsDiagram />;
      }
      if (normId === 'm5-3' || query.includes('cadências históricas') || query.includes('ii - v - i') || query.includes('progressão pop')) {
        return <CadencesAndPopProgressionDiagram />;
      }
      if (normId === 'm6-1' || query.includes('modos gregos') || query.includes('jônio') || query.includes('dórico') || query.includes('lídio')) {
        return <GreekModesPanoramicDiagram />;
      }
      if (normId === 'm7-1' || query.includes('dominantes secundários') || query.includes('empréstimo modal') || query.includes('aem')) {
        return <SecondaryDominantsAndModalInterchangeDiagram />;
      }

      return <IntervalRulerWideDiagram />;
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
          Infográfico Panorâmico Padronizado (Alta Resolução)
        </span>
      </div>
      <div className="w-full overflow-hidden transition-all">
        {renderDiagram()}
      </div>
    </div>
  );
};
