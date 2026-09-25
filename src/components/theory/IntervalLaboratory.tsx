/**
 * IntervalLaboratory.tsx
 * Laboratório Interativo de Intervalos Musicais e Psicoacústica.
 * Atende aos requisitos REQ-LAB-02 e CA 3 / CA 4 (Especificação Definitiva HARMONIA).
 *
 * Características:
 * 1. Container com max-width controlado (1200px isolado, 650px no Grid de Teoria) e centralizado.
 * 2. Teclado proporcional calculado geometricamente (sem estiramento horizontal artificial).
 * 3. Proporção física e visual de teclas brancas e pretas preservada em qualquer viewport.
 * 4. Chips de seleção direta de todos os 12 intervalos da escala cromática.
 * 5. Reprodução de áudio Melódico (sucessivo) e Harmônico (junto).
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sliders,
  Play,
  Layers,
  Minus,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import { useOctaveStandard } from '../../core/octaveConfigStore';

export interface IntervalInfo {
  semitones: number;
  shortName: string;
  name: string;
  formula: string;
  mood: string;
  acousticRatio: string;
  inversionName: string;
  inversionSemitones: number;
  example: string;
}

export const INTERVAL_CATALOG: IntervalInfo[] = [
  {
    semitones: 0,
    shortName: '1J',
    name: 'Uníssono Justo',
    formula: '0 semitons (mesma nota)',
    mood: 'Identidade acústica absoluta',
    acousticRatio: '1:1',
    inversionName: 'Oitava Justa (8J)',
    inversionSemitones: 12,
    example: 'Mesma nota tocada em conjunto',
  },
  {
    semitones: 1,
    shortName: '2m',
    name: 'Segunda Menor',
    formula: '1 semitom (meio tom)',
    mood: 'Tensão dramática aguda, atrito dissonante',
    acousticRatio: '16:15',
    inversionName: 'Sétima Maior (7M)',
    inversionSemitones: 11,
    example: 'Tema do filme "Tubarão" (Jaws)',
  },
  {
    semitones: 2,
    shortName: '2M',
    name: 'Segunda Maior',
    formula: '2 semitons (1 tom)',
    mood: 'Passo melódico natural, equilíbrio modal',
    acousticRatio: '9:8',
    inversionName: 'Sétima Menor (7m)',
    inversionSemitones: 10,
    example: 'Início de "Parabéns pra Você"',
  },
  {
    semitones: 3,
    shortName: '3m',
    name: 'Terça Menor',
    formula: '3 semitons (1½ tom)',
    mood: 'Melancolia, introspecção, emoção blues',
    acousticRatio: '6:5',
    inversionName: 'Sexta Maior (6M)',
    inversionSemitones: 9,
    example: 'Abertura de "Greensleeves" e Acorde Menor',
  },
  {
    semitones: 4,
    shortName: '3M',
    name: 'Terça Maior',
    formula: '4 semitons (2 tons)',
    mood: 'Luminosidade, alegria, estabilidade afirmativa',
    acousticRatio: '5:4',
    inversionName: 'Sexta Menor (6m)',
    inversionSemitones: 8,
    example: 'Início de "Oh When The Saints" e Acorde Maior',
  },
  {
    semitones: 5,
    shortName: '4J',
    name: 'Quarta Justa',
    formula: '5 semitons (2½ tons)',
    mood: 'Solenidade, nobreza, sensação de hino',
    acousticRatio: '4:3',
    inversionName: 'Quinta Justa (5J)',
    inversionSemitones: 7,
    example: 'Marcha Nupcial / Hino Nacional',
  },
  {
    semitones: 6,
    shortName: 'Trít',
    name: 'Trítono (4ª Aum / 5ª Dim)',
    formula: '6 semitons (3 tons)',
    mood: 'Tensão máxima instável magnética ("Diabolus in Musica")',
    acousticRatio: '45:32',
    inversionName: 'Trítono (6 semitons)',
    inversionSemitones: 6,
    example: 'Tema de abertura de "Os Simpsons"',
  },
  {
    semitones: 7,
    shortName: '5J',
    name: 'Quinta Justa',
    formula: '7 semitons (3½ tons)',
    mood: 'Poder, perfeição consonante, pureza estelar',
    acousticRatio: '3:2',
    inversionName: 'Quarta Justa (4J)',
    inversionSemitones: 5,
    example: 'Tema de abertura de "Star Wars"',
  },
  {
    semitones: 8,
    shortName: '6m',
    name: 'Sexta Menor',
    formula: '8 semitons (4 tons)',
    mood: 'Nostalgia romântica, anseio expressivo',
    acousticRatio: '8:5',
    inversionName: 'Terça Maior (3M)',
    inversionSemitones: 4,
    example: 'Tema clássico de "Love Story"',
  },
  {
    semitones: 9,
    shortName: '6M',
    name: 'Sexta Maior',
    formula: '9 semitons (4½ tons)',
    mood: 'Elegância e luz calorosa (Jazz, Bossa Nova e MPB)',
    acousticRatio: '5:3',
    inversionName: 'Terça Menor (3m)',
    inversionSemitones: 3,
    example: '"Asa Branca" / "Garota de Ipanema"',
  },
  {
    semitones: 10,
    shortName: '7m',
    name: 'Sétima Menor',
    formula: '10 semitons (5 tons)',
    mood: 'Tensão dominante resolutiva, essência do Blues',
    acousticRatio: '9:5',
    inversionName: 'Segunda Maior (2M)',
    inversionSemitones: 2,
    example: 'Acorde com Sétima Dominante (V7)',
  },
  {
    semitones: 11,
    shortName: '7M',
    name: 'Sétima Maior',
    formula: '11 semitons (5½ tons)',
    mood: 'Aveludado, sonhador, etéreo e contemplativo',
    acousticRatio: '15:8',
    inversionName: 'Segunda Menor (2m)',
    inversionSemitones: 1,
    example: 'Harmonia suave em "Wave" de Tom Jobim',
  },
  {
    semitones: 12,
    shortName: '8J',
    name: 'Oitava Justa',
    formula: '12 semitons (6 tons)',
    mood: 'Consonância pura oitavada, plenitude espacial',
    acousticRatio: '2:1',
    inversionName: 'Uníssono Justo (1J)',
    inversionSemitones: 0,
    example: 'Salto inicial em "Somewhere Over The Rainbow"',
  },
];

// As 7 notas diatônicas naturais (Dó, Ré, Mi, Fá, Sol, Lá, Si)
const NATURAL_ROOTS = [
  { label: 'Dó', pitch: 'C', midi: 60 },
  { label: 'Ré', pitch: 'D', midi: 62 },
  { label: 'Mi', pitch: 'E', midi: 64 },
  { label: 'Fá', pitch: 'F', midi: 65 },
  { label: 'Sol', pitch: 'G', midi: 67 },
  { label: 'Lá', pitch: 'A', midi: 69 },
  { label: 'Si', pitch: 'B', midi: 71 },
];

// As 5 notas cromáticas com alterações (sustenidos / bemóis)
const ACCIDENTAL_ROOTS = [
  { label: 'Dó♯ / Ré♭', pitch: 'C#', midi: 61 },
  { label: 'Ré♯ / Mi♭', pitch: 'D#', midi: 63 },
  { label: 'Fá♯ / Sol♭', pitch: 'F#', midi: 66 },
  { label: 'Sol♯ / Lá♭', pitch: 'G#', midi: 68 },
  { label: 'Lá♯ / Si♭', pitch: 'A#', midi: 70 },
];

interface Props {
  initialRootMidi?: number;
  initialSemitones?: number;
  inTheoryGrid?: boolean;
  className?: string;
}

export const IntervalLaboratory: React.FC<Props> = ({
  initialRootMidi = 60, // Dó Central (C3 / C4)
  initialSemitones = 4, // Terça Maior (3M)
  inTheoryGrid = false,
  className = '',
}) => {
  const octaveStandard = useOctaveStandard();
  const [rootMidi, setRootMidi] = useState<number>(initialRootMidi);
  const [semitones, setSemitones] = useState<number>(initialSemitones);
  const [direction, setDirection] = useState<'ascending' | 'descending'>('ascending');
  const [instrument, setInstrument] = useState<'piano' | 'guitar'>('piano');
  const [showAccidentals, setShowAccidentals] = useState<boolean>(false);
  const [activeSoundingMidis, setActiveSoundingMidis] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(550);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Monitora a largura disponível do container para calcular a geometria proporcional das teclas
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 100) setContainerWidth(w);
      }
    };
    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) resizeObserver.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      soundEngine.stopAllNotes(0.01);
    };
  }, []);

  // Intervalo ativo do catálogo
  const intervalInfo = useMemo(() => {
    return INTERVAL_CATALOG[semitones] || INTERVAL_CATALOG[4];
  }, [semitones]);

  // Cálculo da nota alvo dependendo da direção
  const targetMidi = useMemo(() => {
    return direction === 'ascending' ? rootMidi + semitones : rootMidi - semitones;
  }, [rootMidi, semitones, direction]);

  // Informações completas de ambas as notas
  const rootNoteInfo = useMemo(() => {
    return getNoteInfo(rootMidi, false, octaveStandard);
  }, [rootMidi, octaveStandard]);

  const targetNoteInfo = useMemo(() => {
    return getNoteInfo(targetMidi, false, octaveStandard);
  }, [targetMidi, octaveStandard]);

  // Reprodução sonora acústica com controle estrito de sustain (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.3)
  const playInterval = async (mode: 'melodic' | 'harmonic') => {
    await soundEngine.ensureAudioReady();

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    soundEngine.stopAllNotes(0.01);

    if (mode === 'melodic') {
      // 1. Toca nota fundamental
      setActiveSoundingMidis([rootMidi]);
      if (instrument === 'guitar') {
        soundEngine.playGuitarPluck(rootMidi, 1.1);
      } else {
        soundEngine.playPianoNote(rootMidi, 0.9);
      }

      // 2. Toca nota alvo após 450ms
      timeoutRef.current = window.setTimeout(() => {
        setActiveSoundingMidis([targetMidi]);
        if (instrument === 'guitar') {
          soundEngine.playGuitarPluck(targetMidi, 1.2);
        } else {
          soundEngine.playPianoNote(targetMidi, 1.1);
        }

        // Limpa iluminação e cessa sustain/pedal após a nota final
        timeoutRef.current = window.setTimeout(() => {
          setActiveSoundingMidis([]);
          soundEngine.stopAllNotes(0.05);
        }, 1100);
      }, 450);
    } else {
      // Toca harmônico (ambas simultaneamente)
      setActiveSoundingMidis([rootMidi, targetMidi]);
      if (instrument === 'guitar') {
        soundEngine.playGuitarPluck(rootMidi, 1.2);
        soundEngine.playGuitarPluck(targetMidi, 1.2);
      } else {
        soundEngine.playPianoNote(rootMidi, 1.4, undefined, 0.75);
        soundEngine.playPianoNote(targetMidi, 1.4, undefined, 0.75);
      }

      timeoutRef.current = window.setTimeout(() => {
        setActiveSoundingMidis([]);
        soundEngine.stopAllNotes(0.05);
      }, 1300);
    }
  };

  // Inversão rápida do intervalo usando a Regra do 9
  const handleInvertInterval = () => {
    setSemitones(intervalInfo.inversionSemitones);
  };

  // =========================================================================
  // CÁLCULO GEOMÉTRICO DO TECLADO PROPORCIONAL (REQ-LAB-02 / CA 4)
  // Preserva proporções físicas e musicais exatas, evitando estiramento artificial
  // =========================================================================
  const { whiteKeys, blackKeys, keyWidth, keyHeight, blackKeyWidth, blackKeyHeight, totalKeyboardWidth } = useMemo(() => {
    const minMidi = Math.min(rootMidi, targetMidi);
    const maxMidi = Math.max(rootMidi, targetMidi);

    // Margem de pelo menos 1 oitava (Dó a Si ou Dó seguinte)
    const startMidi = Math.floor(minMidi / 12) * 12; // Começa no Dó da oitava
    const endMidi = Math.max(startMidi + 12, Math.ceil((maxMidi + 1) / 12) * 12); // Pelo menos 1 oitava completa

    const wKeys: Array<{
      midi: number;
      name: string;
      isRoot: boolean;
      isTarget: boolean;
      isSounding: boolean;
      whiteIndex: number;
    }> = [];

    const bKeys: Array<{
      midi: number;
      name: string;
      isRoot: boolean;
      isTarget: boolean;
      isSounding: boolean;
      whiteIndexLeft: number;
    }> = [];

    const blackPitchClasses = new Set([1, 3, 6, 8, 10]);
    let currentWhiteIndex = 0;

    for (let m = startMidi; m <= endMidi; m++) {
      const pc = ((m % 12) + 12) % 12;
      const isBlack = blackPitchClasses.has(pc);
      const isRoot = m === rootMidi;
      const isTarget = m === targetMidi;
      const isSounding = activeSoundingMidis.includes(m);
      const info = getNoteInfo(m, false, octaveStandard);

      if (!isBlack) {
        wKeys.push({
          midi: m,
          name: `${info.namePt}${info.octave}`,
          isRoot,
          isTarget,
          isSounding,
          whiteIndex: currentWhiteIndex,
        });
        currentWhiteIndex++;
      } else {
        // Tecla preta fica sobre a divisória entre a tecla branca anterior e a próxima
        bKeys.push({
          midi: m,
          name: `${info.namePt}`,
          isRoot,
          isTarget,
          isSounding,
          whiteIndexLeft: currentWhiteIndex - 1,
        });
      }
    }

    // Geometria proporcional (largura da tecla branca calculada para o container sem esticar além do limite físico)
    const availableWidth = Math.max(260, containerWidth - 32);
    // Limites anatômicos da tecla branca: min 24px, max 36px (evita teclas excessivamente esticadas)
    const calculatedKeyWidth = Math.min(36, Math.max(22, Math.floor(availableWidth / Math.max(1, wKeys.length))));
    // Proporção física tradicional de piano: altura ~3.8x a largura
    const calculatedKeyHeight = Math.round(calculatedKeyWidth * 3.8);

    // Tecla preta proporcional: ~60% da largura da branca e ~62% da altura
    const bWidth = Math.round(calculatedKeyWidth * 0.62);
    const bHeight = Math.round(calculatedKeyHeight * 0.62);
    const totalW = wKeys.length * calculatedKeyWidth;

    return {
      whiteKeys: wKeys,
      blackKeys: bKeys,
      keyWidth: calculatedKeyWidth,
      keyHeight: calculatedKeyHeight,
      blackKeyWidth: bWidth,
      blackKeyHeight: bHeight,
      totalKeyboardWidth: totalW,
    };
  }, [rootMidi, targetMidi, activeSoundingMidis, octaveStandard, containerWidth]);

  // Container width limit: 650px when inside Theory Grid, 1200px when standalone
  const containerConstraintClass = inTheoryGrid
    ? 'max-w-[650px] mx-auto'
    : 'max-w-[1200px] mx-auto';

  return (
    <div
      ref={containerRef}
      className={`w-full ${containerConstraintClass} p-3.5 sm:p-5 rounded-3xl bg-black/60 border border-purple-500/25 space-y-4 shadow-2xl backdrop-blur-md transition-all ${className}`}
    >
      {/* 1. Cabeçalho do Módulo */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black font-display text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>🧪</span>
              <span>Laboratório de Intervalos</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Análise Acústica, Razão Harmônica &amp; Treino Auditivo
            </p>
          </div>
        </div>

        {/* Seletor de Timbre (Piano / Violão) */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setInstrument('piano')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              instrument === 'piano'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Timbre de Piano de Cauda"
          >
            🎹 Piano
          </button>
          <button
            onClick={() => setInstrument('guitar')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              instrument === 'guitar'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Timbre de Violão Nylon Acústico"
          >
            🎸 Violão
          </button>
        </div>
      </div>

      {/* 2. Cartão de Destaque do Intervalo Atual (conforme wireframe) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-purple-300 font-black flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/25 border border-purple-500/30 text-white">
                {intervalInfo.shortName}
              </span>
              <span>•</span>
              <span>{intervalInfo.name}</span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">
              {intervalInfo.mood}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] font-mono font-black text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30">
              Razão {intervalInfo.acousticRatio} | {intervalInfo.formula}
            </span>
          </div>
        </div>

        {/* Display Visual das Notas: Nota Raiz ➔ Nota Intervalo */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs">
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
              activeSoundingMidis.includes(rootMidi)
                ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-102 shadow-lg shadow-purple-600/40'
                : 'bg-purple-500/15 text-purple-200 border border-purple-500/30'
            }`}
          >
            <span className="text-[10px] uppercase text-purple-400 font-bold">Nota Raiz:</span>
            <span className="font-bold text-sm">{rootNoteInfo.namePt}</span>
            <span className="text-[10px] opacity-75">
              ({Math.round(rootNoteInfo.frequency)} Hz)
            </span>
          </div>

          <div className="flex flex-col items-center px-1 text-slate-400">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
              {direction === 'ascending' ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <span>+{semitones} st</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-amber-400" />
                  <span>-{semitones} st</span>
                </>
              )}
            </div>
            <span className="text-[8px] uppercase tracking-wider text-slate-500">
              {direction === 'ascending' ? 'Ascendente' : 'Descendente'}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
              activeSoundingMidis.includes(targetMidi)
                ? 'bg-cyan-500 text-slate-900 ring-2 ring-cyan-300 font-black scale-102 shadow-lg shadow-cyan-500/40'
                : 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
            }`}
          >
            <span className="text-[10px] uppercase text-cyan-400 font-bold">Nota Intervalo:</span>
            <span className="font-bold text-sm">{targetNoteInfo.namePt}</span>
            <span className="text-[10px] opacity-75">
              ({Math.round(targetNoteInfo.frequency)} Hz)
            </span>
          </div>
        </div>

        {/* Exemplo Cultural & Inversão (Regra do 9) */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate italic">{intervalInfo.example}</span>
          </div>

          <button
            onClick={handleInvertInterval}
            className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-100 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/10"
            title="Inverter intervalo usando a Regra do 9"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400" />
            <span className="font-mono text-[10px]">
              Inversão: {intervalInfo.inversionName}
            </span>
          </button>
        </div>
      </div>

      {/* 3. TECLADO PROPORCIONAL ANATÔMICO (REQ-LAB-02 / CA 4 / Wireframe) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="uppercase font-bold tracking-wider text-[10px]">
            Teclado Proporcional Anatômico:
          </span>
          <span className="text-purple-300 font-bold">
            {rootNoteInfo.namePt} ({rootNoteInfo.letter}{rootNoteInfo.octave}) ➔ {targetNoteInfo.namePt} ({targetNoteInfo.letter}{targetNoteInfo.octave})
          </span>
        </div>

        {/* Container Centralizado com Largura Proporcional Estrita (Sem Esticar Deformado) */}
        <div className="w-full flex justify-center items-center py-1">
          <div
            className="relative rounded-2xl p-1 bg-[#070710] border border-white/10 shadow-2xl overflow-hidden select-none"
            style={{ width: totalKeyboardWidth + 10, height: keyHeight + 8 }}
          >
            {/* Teclas Brancas Proporcionais */}
            <div className="flex h-full relative">
              {whiteKeys.map((k) => (
                <button
                  key={k.midi}
                  onClick={() => {
                    soundEngine.playPianoNote(k.midi, 0.9);
                    setRootMidi(k.midi);
                  }}
                  title={`${getNoteInfo(k.midi, false, octaveStandard).namePt} (MIDI ${k.midi})`}
                  style={{ width: keyWidth, height: keyHeight }}
                  className={`relative rounded-b-md border-r border-slate-400/40 last:border-r-0 transition-all flex flex-col justify-end items-center pb-1 cursor-pointer active:scale-98 ${
                    k.isSounding
                      ? 'bg-amber-300 text-slate-900 font-black shadow-[0_0_12px_rgba(251,191,36,0.9)] z-10'
                      : k.isRoot
                      ? 'bg-purple-600 text-white font-black shadow-[0_0_10px_rgba(168,85,247,0.8)] z-10'
                      : k.isTarget
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10'
                      : 'bg-gradient-to-b from-white to-slate-200 text-slate-800 hover:from-white hover:to-white'
                  }`}
                >
                  <span className="text-[9px] font-mono leading-none font-bold">
                    {k.isRoot ? 'F' : k.isTarget ? '2ª' : k.name}
                  </span>
                </button>
              ))}

              {/* Teclas Pretas Proporcionais com Posição Exata sobre as Divisórias */}
              {blackKeys.map((bk) => {
                const leftPos = (bk.whiteIndexLeft + 1) * keyWidth - blackKeyWidth / 2;
                return (
                  <button
                    key={bk.midi}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playPianoNote(bk.midi, 0.9);
                      setRootMidi(bk.midi);
                    }}
                    title={`${getNoteInfo(bk.midi, false, octaveStandard).namePt} (MIDI ${bk.midi})`}
                    style={{
                      position: 'absolute',
                      left: `${leftPos}px`,
                      width: `${blackKeyWidth}px`,
                      height: `${blackKeyHeight}px`,
                      top: 0,
                    }}
                    className={`z-20 rounded-b-md transition-all cursor-pointer flex flex-col justify-end items-center pb-1 active:scale-98 shadow-md ${
                      bk.isSounding
                        ? 'bg-amber-400 text-slate-900 font-black shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-102'
                        : bk.isRoot
                        ? 'bg-purple-600 text-white font-black border border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                        : bk.isTarget
                        ? 'bg-cyan-500 text-slate-950 font-black border border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                        : 'bg-gradient-to-b from-slate-950 via-slate-900 to-black border-x border-b border-white/10 hover:from-slate-900 hover:to-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[8px] font-mono leading-none font-bold">
                      {bk.isRoot ? 'F' : bk.isTarget ? '2ª' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Selecione o Intervalo (12 Chips conforme wireframe) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
            Selecione o Intervalo:
          </span>
          <span className="text-xs font-mono font-black text-purple-300">
            {semitones} {semitones === 1 ? 'semitom' : 'semitons'}
          </span>
        </div>

        {/* Grade com os 12 Intervalos Cromáticos */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {INTERVAL_CATALOG.filter((i) => i.semitones > 0).map((chip) => {
            const isSelected = semitones === chip.semitones;
            return (
              <button
                key={chip.semitones}
                onClick={() => setSemitones(chip.semitones)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/40 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/15'
                }`}
                title={`${chip.name} (${chip.formula})`}
              >
                {chip.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Slider de Distância & Sentido Melódico */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <button
          onClick={() => setSemitones((s) => Math.max(0, s - 1))}
          disabled={semitones <= 0}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
          title="Diminuir 1 semitom"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min={0}
          max={12}
          step={1}
          value={semitones}
          onChange={(e) => setSemitones(parseInt(e.target.value, 10))}
          className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
        />

        <button
          onClick={() => setSemitones((s) => Math.min(12, s + 1))}
          disabled={semitones >= 12}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
          title="Aumentar 1 semitom"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Alternador de Direção (Ascendente / Descendente) */}
        <button
          onClick={() => setDirection((d) => (d === 'ascending' ? 'descending' : 'ascending'))}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0"
          title="Alternar sentido melódico do intervalo"
        >
          {direction === 'ascending' ? (
            <>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ascendente (↑)</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Descendente (↓)</span>
            </>
          )}
        </button>
      </div>

      {/* 6. Seletor Completo da Nota Fundamental */}
      <div className="space-y-1.5 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400 uppercase font-bold">Alterar Nota Fundamental:</span>
          <button
            onClick={() => setShowAccidentals((prev) => !prev)}
            className="text-[10px] text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer font-bold"
          >
            {showAccidentals ? 'Ocultar Acidentes' : '+ Acidentes (♯/♭)'}
          </button>
        </div>

        {/* 7 Notas Naturais */}
        <div className="grid grid-cols-7 gap-1">
          {NATURAL_ROOTS.map((r) => {
            const isSelected = rootMidi === r.midi;
            return (
              <button
                key={r.midi}
                onClick={() => setRootMidi(r.midi)}
                className={`py-1 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/40 scale-102'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                }`}
                title={`Fundamental: ${r.label}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* 5 Notas Acidentadas */}
        {showAccidentals && (
          <div className="grid grid-cols-5 gap-1 pt-1 animate-fadeIn">
            {ACCIDENTAL_ROOTS.map((r) => {
              const isSelected = rootMidi === r.midi;
              return (
                <button
                  key={r.midi}
                  onClick={() => setRootMidi(r.midi)}
                  className={`py-0.5 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border-white/5'
                  }`}
                  title={`Fundamental: ${r.label}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Botões de Ação Sonora de Alta Fidelidade (conforme wireframe) */}
      <div className="flex gap-2.5 pt-1">
        <button
          onClick={() => playInterval('melodic')}
          className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-98 cursor-pointer transition-all"
          title="Tocar uma nota após a outra em sequência melódica"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>▶ Ouvir Sucessivo</span>
        </button>

        <button
          onClick={() => playInterval('harmonic')}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 cursor-pointer transition-all"
          title="Tocar ambas as notas juntas simultaneamente (Acorde / Harmonia)"
        >
          <Layers className="w-4 h-4" />
          <span>🎼 Ouvir Junto</span>
        </button>
      </div>
    </div>
  );
};
