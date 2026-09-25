/**
 * IntervalLaboratory.tsx
 * Laboratório Interativo de Intervalos Musicais e Psicoacústica.
 * Permite explorar auditivamente e visualmente os 13 intervalos da escala cromática,
 * analisando fundamental, nota alvo, frequências Hz, razão harmônica, inversão (Regra do 9)
 * e visualização dinâmica em mini-teclado interativo.
 */

import React, { useState, useMemo, useRef } from 'react';
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
    shortName: 'Trítono',
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
  className?: string;
}

export const IntervalLaboratory: React.FC<Props> = ({
  initialRootMidi = 60, // Dó Central
  initialSemitones = 4, // Terça Maior
  className = '',
}) => {
  const octaveStandard = useOctaveStandard();
  const [rootMidi, setRootMidi] = useState<number>(initialRootMidi);
  const [semitones, setSemitones] = useState<number>(initialSemitones);
  const [direction, setDirection] = useState<'ascending' | 'descending'>('ascending');
  const [instrument, setInstrument] = useState<'piano' | 'guitar'>('piano');
  const [showAccidentals, setShowAccidentals] = useState<boolean>(false);
  const [activeSoundingMidis, setActiveSoundingMidis] = useState<number[]>([]);

  const timeoutRef = useRef<number | null>(null);

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

  // Reprodução sonora acústica
  const playInterval = async (mode: 'melodic' | 'harmonic') => {
    await soundEngine.ensureAudioReady();

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

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

        // Limpa iluminação após 1.1s
        timeoutRef.current = window.setTimeout(() => {
          setActiveSoundingMidis([]);
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
      }, 1300);
    }
  };

  // Inversão rápida do intervalo usando a Regra do 9
  const handleInvertInterval = () => {
    setSemitones(intervalInfo.inversionSemitones);
  };

  // Teclado visual compacto cobrindo a extensão do intervalo selecionado
  const keyboardKeys = useMemo(() => {
    const minMidi = Math.min(rootMidi, targetMidi);
    const maxMidi = Math.max(rootMidi, targetMidi);
    // Margem de pelo menos 1 oitava para visualização limpa
    const startMidi = Math.floor(minMidi / 12) * 12; // Começa no Dó anterior
    const endMidi = Math.ceil((maxMidi + 1) / 12) * 12; // Termina no Si seguinte

    const keys: Array<{
      midi: number;
      isBlack: boolean;
      name: string;
      isRoot: boolean;
      isTarget: boolean;
      isSounding: boolean;
    }> = [];

    const blackPitchClasses = new Set([1, 3, 6, 8, 10]);

    for (let m = startMidi; m <= endMidi; m++) {
      const pc = ((m % 12) + 12) % 12;
      const isBlack = blackPitchClasses.has(pc);
      const isRoot = m === rootMidi;
      const isTarget = m === targetMidi;
      const isSounding = activeSoundingMidis.includes(m);
      const info = getNoteInfo(m, false, octaveStandard);

      keys.push({
        midi: m,
        isBlack,
        name: isBlack ? '' : info.letter,
        isRoot,
        isTarget,
        isSounding,
      });
    }

    return keys;
  }, [rootMidi, targetMidi, activeSoundingMidis, octaveStandard]);

  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl bg-black/60 border border-purple-500/25 space-y-4 shadow-xl backdrop-blur-sm transition-all ${className}`}
    >
      {/* Cabeçalho do Módulo */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black font-display text-white tracking-wide uppercase">
              Laboratório de Intervalos
            </h4>
            <p className="text-[10px] text-slate-400">
              Análise Acústica, Razão Harmônica & Treino Auditivo
            </p>
          </div>
        </div>

        {/* Seletor de Timbre (Piano / Violão) */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setInstrument('piano')}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold transition-colors cursor-pointer ${
              instrument === 'piano'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Timbre de Piano de Cauda"
          >
            Piano
          </button>
          <button
            onClick={() => setInstrument('guitar')}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold transition-colors cursor-pointer ${
              instrument === 'guitar'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Timbre de Violão Nylon Acústico"
          >
            Violão
          </button>
        </div>
      </div>

      {/* Cartão de Destaque do Intervalo Atual */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold">
              {intervalInfo.shortName} • {intervalInfo.name}
            </span>
            <div className="text-xs text-slate-300 font-medium">{intervalInfo.mood}</div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-black text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30">
              {intervalInfo.formula}
            </span>
            <div className="text-[9px] font-mono text-slate-400 mt-0.5">
              Razão: {intervalInfo.acousticRatio}
            </div>
          </div>
        </div>

        {/* Display Visual das Notas: Fundamental ➔ Alvo */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
              activeSoundingMidis.includes(rootMidi)
                ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-102'
                : 'bg-purple-500/15 text-purple-200 border border-purple-500/30'
            }`}
          >
            <span className="text-[9px] uppercase text-purple-400 font-bold">F:</span>
            <span className="font-bold">{rootNoteInfo.namePt}</span>
            <span className="text-[9px] opacity-75">
              ({Math.round(rootNoteInfo.frequency)} Hz)
            </span>
          </div>

          <div className="flex flex-col items-center px-1 text-slate-400">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
              {direction === 'ascending' ? (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+{semitones} st</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>-{semitones} st</span>
                </>
              )}
            </div>
            <span className="text-[8px] uppercase tracking-wider text-slate-500">
              {direction === 'ascending' ? 'Ascendente' : 'Descendente'}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
              activeSoundingMidis.includes(targetMidi)
                ? 'bg-cyan-500 text-slate-900 ring-2 ring-cyan-300 font-black scale-102'
                : 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
            }`}
          >
            <span className="text-[9px] uppercase text-cyan-400 font-bold">2ª:</span>
            <span className="font-bold">{targetNoteInfo.namePt}</span>
            <span className="text-[9px] opacity-75">
              ({Math.round(targetNoteInfo.frequency)} Hz)
            </span>
          </div>
        </div>

        {/* Exemplo Cultural & Inversão (Regra do 9) */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400 pt-0.5">
          <div className="flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate italic">{intervalInfo.example}</span>
          </div>

          <button
            onClick={handleInvertInterval}
            className="flex items-center gap-1 text-indigo-300 hover:text-indigo-100 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded border border-white/5"
            title="Inverter intervalo usando a Regra do 9"
          >
            <RotateCcw className="w-2.5 h-2.5 text-indigo-400" />
            <span className="font-mono text-[9px]">
              Inversão: {intervalInfo.inversionName}
            </span>
          </button>
        </div>
      </div>

      {/* Mini-Teclado Interativo Exibindo a Distância Acústica */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span>Mapa de Teclas:</span>
          <span className="text-purple-300 font-bold">
            {rootNoteInfo.namePt} ➔ {targetNoteInfo.namePt}
          </span>
        </div>

        <div className="relative h-14 bg-slate-950/80 rounded-xl p-1 border border-white/10 flex items-stretch overflow-hidden select-none">
          {keyboardKeys.map((key) => {
            if (key.isBlack) {
              return (
                <div
                  key={key.midi}
                  onClick={() => setRootMidi(key.midi)}
                  title={`${getNoteInfo(key.midi, false, octaveStandard).namePt} (MIDI ${key.midi})`}
                  className={`-mx-1.5 z-10 w-3 sm:w-3.5 h-8 rounded-b transition-all cursor-pointer ${
                    key.isSounding
                      ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-105'
                      : key.isRoot
                      ? 'bg-purple-600 border border-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                      : key.isTarget
                      ? 'bg-cyan-500 border border-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.7)]'
                      : 'bg-slate-900 border border-slate-700 hover:bg-slate-800'
                  }`}
                />
              );
            }

            return (
              <div
                key={key.midi}
                onClick={() => setRootMidi(key.midi)}
                title={`${getNoteInfo(key.midi, false, octaveStandard).namePt} (MIDI ${key.midi})`}
                className={`flex-1 rounded-b transition-all flex flex-col justify-end items-center pb-0.5 cursor-pointer ${
                  key.isSounding
                    ? 'bg-amber-300 text-slate-900 font-black shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-98'
                    : key.isRoot
                    ? 'bg-purple-600 text-white font-black shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                    : key.isTarget
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_8px_rgba(6,182,212,0.7)]'
                    : 'bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border-r border-slate-300 last:border-0'
                }`}
              >
                <span className="text-[7.5px] font-mono leading-none font-bold">
                  {key.isRoot ? 'F' : key.isTarget ? '2ª' : key.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slider Contínuo de Semitons com Controles de Avanço (- / +) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Distância:
            </span>
            <span className="text-xs font-mono font-black text-purple-300">
              {semitones} {semitones === 1 ? 'semitom' : 'semitons'}
            </span>
          </div>

          {/* Alternador de Direção (Ascendente / Descendente) */}
          <button
            onClick={() => setDirection((d) => (d === 'ascending' ? 'descending' : 'ascending'))}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-mono font-bold text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
            title="Alternar sentido melódico do intervalo"
          >
            {direction === 'ascending' ? (
              <>
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span>Ascendente (↑)</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3 h-3 text-amber-400" />
                <span>Descendente (↓)</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSemitones((s) => Math.max(0, s - 1))}
            disabled={semitones <= 0}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
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
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
            title="Aumentar 1 semitom"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chips de Intervalos Comuns Rápidos */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          {[
            { st: 2, label: '2M' },
            { st: 3, label: '3m' },
            { st: 4, label: '3M' },
            { st: 5, label: '4J' },
            { st: 6, label: 'Trít.' },
            { st: 7, label: '5J' },
            { st: 9, label: '6M' },
            { st: 10, label: '7m' },
            { st: 11, label: '7M' },
            { st: 12, label: '8J' },
          ].map((chip) => (
            <button
              key={chip.st}
              onClick={() => setSemitones(chip.st)}
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold transition-all cursor-pointer ${
                semitones === chip.st
                  ? 'bg-purple-600 text-white shadow-sm scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seletor Completo da Nota Fundamental (7 Naturais + Suporte a Acidentes) */}
      <div className="space-y-1.5 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400 uppercase font-bold">Nota Fundamental:</span>
          <button
            onClick={() => setShowAccidentals((prev) => !prev)}
            className="text-[9px] text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
          >
            {showAccidentals ? 'Ocultar Acidentes' : '+ Acidentes (♯/♭)'}
          </button>
        </div>

        {/* 7 Notas Naturais Completas: Dó, Ré, Mi, Fá, Sol, Lá, Si */}
        <div className="grid grid-cols-7 gap-1">
          {NATURAL_ROOTS.map((r) => {
            const isSelected = rootMidi === r.midi;
            return (
              <button
                key={r.midi}
                onClick={() => setRootMidi(r.midi)}
                className={`py-1 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/40 scale-103'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/15'
                }`}
                title={`Fundamental: ${r.label}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* 5 Notas Acidentadas Opcionais */}
        {showAccidentals && (
          <div className="grid grid-cols-5 gap-1 pt-1 animate-fade-in">
            {ACCIDENTAL_ROOTS.map((r) => {
              const isSelected = rootMidi === r.midi;
              return (
                <button
                  key={r.midi}
                  onClick={() => setRootMidi(r.midi)}
                  className={`py-0.5 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/40'
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

      {/* Botões de Ação Sonora de Alta Fidelidade */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => playInterval('melodic')}
          className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/25 active:scale-98 cursor-pointer transition-all"
          title="Tocar uma nota após a outra em sequência melódica"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Ouvir Sucessivo</span>
        </button>

        <button
          onClick={() => playInterval('harmonic')}
          className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 active:scale-98 cursor-pointer transition-all"
          title="Tocar ambas as notas juntas simultaneamente (Acorde / Harmonia)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ouvir Junto (Acorde)</span>
        </button>
      </div>
    </div>
  );
};
