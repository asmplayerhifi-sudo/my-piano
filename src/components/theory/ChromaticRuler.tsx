import React, { useState } from 'react';
import { CHROMATIC_NOTES_SHARP, NOTE_NAMES_PT, INTERVAL_NAMES_PT } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { AlertCircle, Volume2, Sparkles, ArrowRight, Music2, RotateCcw } from 'lucide-react';

export interface ChromaticRulerProps {
  selectedNote?: string;
  onNoteSelect?: (note: string) => void;
  className?: string;
}

interface DualSelection {
  firstNote: string | null;
  secondNote: string | null;
}

export const ChromaticRuler: React.FC<ChromaticRulerProps> = ({
  selectedNote: externalNote,
  onNoteSelect,
  className = '',
}) => {
  const [internalNote, setInternalNote] = useState<string>('C');
  const [dualSelection, setDualSelection] = useState<DualSelection>({
    firstNote: 'C',
    secondNote: 'G',
  });
  const [isDualMode, setIsDualMode] = useState<boolean>(true);

  // Normalização enarmônica
  const normalizedExternal = externalNote ? (
    externalNote === 'Db' ? 'C#' :
    externalNote === 'Eb' ? 'D#' :
    externalNote === 'Gb' ? 'F#' :
    externalNote === 'Ab' ? 'G#' :
    externalNote === 'Bb' ? 'A#' :
    externalNote
  ) : undefined;

  const activeNote = normalizedExternal ?? internalNote;

  // Semitons naturais: E-F (índices 4 e 5) e B-C (índices 11 e 0)
  const isNaturalSemitonePair = (idx: number) => {
    return idx === 4 || idx === 11; // E e B
  };

  const handleNoteClick = (note: string, idx: number) => {
    setInternalNote(note);
    onNoteSelect?.(note);

    if (isDualMode) {
      if (!dualSelection.firstNote || (dualSelection.firstNote && dualSelection.secondNote)) {
        setDualSelection({ firstNote: note, secondNote: null });
      } else {
        setDualSelection(prev => ({ ...prev, secondNote: note }));
      }
    }

    soundEngine.playPianoNote(60 + idx, 1.2);
  };

  // Cálculo da Análise de Intervalos Dupla
  const intervalAnalysis = (() => {
    if (!dualSelection.firstNote || !dualSelection.secondNote) return null;
    const idx1 = CHROMATIC_NOTES_SHARP.indexOf(dualSelection.firstNote);
    const idx2 = CHROMATIC_NOTES_SHARP.indexOf(dualSelection.secondNote);
    if (idx1 === -1 || idx2 === -1) return null;

    const semitones = (idx2 - idx1 + 12) % 12;
    const wholeTones = Math.floor(semitones / 2);
    const remainingSemitones = semitones % 2;
    const toneText = wholeTones > 0
      ? `${wholeTones} Tom${wholeTones > 1 ? 's' : ''}${remainingSemitones > 0 ? ' e meio (½T)' : ''}`
      : `${remainingSemitones} Semitom (½T)`;

    const intervalInfo = INTERVAL_NAMES_PT[semitones] || {
      name: `${semitones} Semitons`,
      short: `${semitones}st`,
      quality: 'Intervalo Neutro',
    };

    return {
      noteA: dualSelection.firstNote,
      noteB: dualSelection.secondNote,
      idxA: idx1,
      idxB: idx2,
      semitones,
      toneText,
      intervalName: intervalInfo.name,
      intervalShort: intervalInfo.short,
      quality: intervalInfo.quality,
    };
  })();

  const handlePlayMelodic = () => {
    if (!intervalAnalysis) return;
    soundEngine.playPianoNote(60 + intervalAnalysis.idxA, 0.8);
    setTimeout(() => {
      soundEngine.playPianoNote(60 + intervalAnalysis.idxB, 1.2);
    }, 450);
  };

  const handlePlayHarmonic = () => {
    if (!intervalAnalysis) return;
    soundEngine.playChord([60 + intervalAnalysis.idxA, 60 + intervalAnalysis.idxB], 'piano', 1.8);
  };

  const handleResetDual = () => {
    setDualSelection({ firstNote: activeNote, secondNote: null });
  };

  // Intervalo relativo ao passar o mouse ou relativo à nota ativa
  const rootIndex = CHROMATIC_NOTES_SHARP.indexOf(activeNote) >= 0 ? CHROMATIC_NOTES_SHARP.indexOf(activeNote) : 0;

  return (
    <div className={`w-full glass-card rounded-3xl p-5 sm:p-6 border border-white/10 space-y-5 bg-[#090b1c]/80 backdrop-blur-xl shadow-2xl ${className}`}>
      {/* ── 1. CABEÇALHO COM MODOS DE ANÁLISE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <h3 className="text-base sm:text-lg font-black font-display text-white flex items-center gap-2">
            <span>Régua Cromática &amp; Análise de Intervalos</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              12 Semitons
            </span>
          </h3>
          <p className="text-xs text-slate-300">
            A matriz física da música ocidental com medição gráfica em tempo real entre notas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDualMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              isDualMode
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>{isDualMode ? 'Comparação Dupla (Ativa)' : 'Ativar Análise Dupla'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. PAINEL DE ANÁLISE DE INTERVALOS DUPLA ── */}
      {isDualMode && intervalAnalysis && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-cyan-950/50 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/50 flex flex-col items-center justify-center font-black text-white text-sm shadow-md">
                <span>{intervalAnalysis.noteA}</span>
                <span className="text-[9px] text-indigo-200 font-mono leading-none">1ª</span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/50 flex flex-col items-center justify-center font-black text-white text-sm shadow-md">
                <span>{intervalAnalysis.noteB}</span>
                <span className="text-[9px] text-purple-200 font-mono leading-none">2ª</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-white">
                  {intervalAnalysis.intervalName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/15 font-bold">
                  {intervalAnalysis.intervalShort}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {intervalAnalysis.quality}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Distância: <strong className="text-amber-300">{intervalAnalysis.semitones} Semitons</strong> ({intervalAnalysis.toneText})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePlayMelodic}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
              title="Ouvir notas em sequência melódica"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>Ouvir Melódico</span>
            </button>
            <button
              onClick={handlePlayHarmonic}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              title="Ouvir as duas notas juntas como acorde harmônico"
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Ouvir Acorde</span>
            </button>
            <button
              onClick={handleResetDual}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Limpar seleção"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── 3. RÉGUA TÁTIL INTERATIVA DE 12 SEMITONS ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="uppercase font-bold text-slate-300">
            Escala Cromática Temperada:
          </span>
          <span>Passe o cursor para ver os intervalos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
          {CHROMATIC_NOTES_SHARP.map((note, idx) => {
            const isSelected = activeNote === note;
            const isFirstDual = isDualMode && dualSelection.firstNote === note;
            const isSecondDual = isDualMode && dualSelection.secondNote === note;
            const isAccidental = note.includes('#');

            // Intervalo em relação à tônica selecionada
            const relativeSemitones = (idx - rootIndex + 12) % 12;
            const relInfo = INTERVAL_NAMES_PT[relativeSemitones];

            return (
              <div
                key={note}
                onClick={() => handleNoteClick(note, idx)}
                className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer select-none active:scale-95 flex flex-col items-center justify-between min-h-[96px] ${
                  isFirstDual || isSecondDual
                    ? isFirstDual
                      ? 'bg-gradient-to-tr from-indigo-600 to-indigo-800 border-indigo-400 text-white shadow-xl shadow-indigo-500/40 ring-2 ring-indigo-400 scale-102 z-10'
                      : 'bg-gradient-to-tr from-purple-600 to-purple-800 border-purple-400 text-white shadow-xl shadow-purple-500/40 ring-2 ring-purple-400 scale-102 z-10'
                    : isSelected
                    ? 'bg-gradient-to-tr from-cyan-600 to-indigo-700 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 scale-102 z-10'
                    : isAccidental
                    ? 'bg-black/70 border-white/10 text-slate-400 hover:text-white hover:bg-black/90 hover:border-white/25'
                    : 'bg-white/[0.06] border-white/10 text-slate-200 hover:text-white hover:bg-white/15 hover:border-white/25'
                }`}
              >
                {/* Índice de Semitom */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="font-bold opacity-75">{idx} st</span>
                  {isFirstDual && <span className="font-extrabold text-indigo-300">1ª</span>}
                  {isSecondDual && <span className="font-extrabold text-purple-300">2ª</span>}
                </div>

                {/* Nome da Nota em Grande Formato */}
                <div className="text-xl sm:text-2xl font-black font-display tracking-tight text-white my-0.5">
                  {note}
                </div>

                {/* Nome em Português */}
                <div className="text-xs font-bold text-slate-300 font-mono">
                  {NOTE_NAMES_PT[note[0]]}{note.length > 1 ? '♯' : ''}
                </div>

                {/* Intervalo relativo à tônica */}
                <div className="text-[10px] font-mono text-cyan-300/80 truncate w-full mt-1 border-t border-white/5 pt-1">
                  {relInfo?.short || `${relativeSemitones}st`}
                </div>

                {/* Marcador de Semitom Natural (E e B) */}
                {isNaturalSemitonePair(idx) && (
                  <span
                    className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] shadow-sm uppercase"
                    title="Semitom Natural direto (sem tecla preta intermediária)"
                  >
                    Natural
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. LEGENDA FLUIDA DE SEMITONS NATURAIS E TONS INTEIROS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 block">
              Semitons Naturais: Mi ↔ Fá (E-F) &amp; Si ↔ Dó (B-C)
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              São as duas únicas posições da escala diatônica onde a distância entre notas naturais consecutivas é de apenas <strong>1 semitom direto</strong> (sem tecla preta ou casa intermediária no violão).
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-2.5">
          <Music2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-cyan-300 block">
              Tom Inteiro (T): Distância de 2 Semitons (2 Casas)
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Exemplo: de Dó (C) para Ré (D), ou de Fá (F) para Sol (G). Contém uma tecla preta/semitom intermediário no meio do caminho.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
