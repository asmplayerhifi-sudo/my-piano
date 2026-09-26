import React, { useState } from 'react';
import { CHROMATIC_NOTES_SHARP, NOTE_NAMES_PT } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { AlertCircle } from 'lucide-react';

export interface ChromaticRulerProps {
  selectedNote?: string;
  onNoteSelect?: (note: string) => void;
  className?: string;
}

export const ChromaticRuler: React.FC<ChromaticRulerProps> = ({
  selectedNote: externalNote,
  onNoteSelect,
  className = '',
}) => {
  const [internalNote, setInternalNote] = useState<string>('C');

  // Normalização enarmônica (Db -> C#, Eb -> D#, Gb -> F#, Ab -> G#, Bb -> A#)
  const normalizedExternal = externalNote ? (
    externalNote === 'Db' ? 'C#' :
    externalNote === 'Eb' ? 'D#' :
    externalNote === 'Gb' ? 'F#' :
    externalNote === 'Ab' ? 'G#' :
    externalNote === 'Bb' ? 'A#' :
    externalNote
  ) : undefined;

  const selectedNote = normalizedExternal ?? internalNote;

  const handleNoteClick = (note: string, idx: number) => {
    setInternalNote(note);
    onNoteSelect?.(note);
    // Toca a nota na oitava 4
    soundEngine.playPianoNote(60 + idx, 1.2);
  };

  // Semitons naturais: E-F (índices 4 e 5) e B-C (índices 11 e 0)
  const isNaturalSemitone = (note: string) => {
    return note === 'E' || note === 'F' || note === 'B' || note === 'C';
  };

  return (
    <div className={`w-full glass-card rounded-3xl p-6 border border-white/10 space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <span>Régua Cromática &amp; Semitons Naturais</span>
          </h3>
          <p className="text-xs text-slate-400">
            A base física da música ocidental dividida em 12 semitons. Toque nas notas para ouvir.
          </p>
        </div>

        {/* Alerta de Semitons Naturais */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Semitons Naturais: Mi ↔ Fá e Si ↔ Dó</span>
        </div>
      </div>

      {/* Régua de 12 Notas */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 pt-2">
        {CHROMATIC_NOTES_SHARP.map((note, idx) => {
          const isSelected = selectedNote === note;
          const isAccidental = note.includes('#');
          const isNaturalST = isNaturalSemitone(note);

          return (
            <button
              key={note}
              onClick={() => handleNoteClick(note, idx)}
              className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105 z-10'
                  : isAccidental
                  ? 'bg-black/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  : 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {/* Marcador de Semitom Natural */}
              {isNaturalST && !isAccidental && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" title="Nota com semitom natural" />
              )}

              <div className="text-base font-black font-display">{note}</div>
              <div className="text-[10px] opacity-75 font-medium">{NOTE_NAMES_PT[note]}</div>
              <div className="text-[9px] font-mono opacity-50 mt-1">{idx} st</div>
            </button>
          );
        })}
      </div>

      {/* Caixa Explicativa da Régua */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1.5">
        <p>
          • <strong className="text-white">Tom Inteiro (T):</strong> Distância de 2 casas/semitons (ex: Dó para Ré, Sol para Lá).
        </p>
        <p>
          • <strong className="text-amber-300">Semitom Natural (ST):</strong> Entre <strong className="text-white">Mi e Fá</strong> e entre <strong className="text-white">Si e Dó</strong> não existe tecla preta nem casa intermediária no violão! A distância é de apenas 1 semitom direto.
        </p>
      </div>
    </div>
  );
};
