import React, { useState, useEffect } from 'react';
import { RhythmTrackCanvas } from '../rhythm/RhythmTrackCanvas';
import { MetronomeView } from '../rhythm/MetronomeView';
import { metronomeScheduler } from '../../core/metronomeScheduler';
import type { BeatEvent } from '../../core/metronomeScheduler';
import { buildChord } from '../../core/musicTheory';
import { soundEngine } from '../../core/soundEngine';
import { Layers } from 'lucide-react';

interface ProgressionPreset {
  name: string;
  genre: string;
  chords: string[];
}

const PROGRESSION_PRESETS: ProgressionPreset[] = [
  {
    name: 'I - V - vi - IV (Pop de Ouro)',
    genre: 'Pop / Rock',
    chords: ['C', 'G', 'Am', 'F'],
  },
  {
    name: 'ii - V - I (Cadência de Jazz)',
    genre: 'Jazz / Bossa',
    chords: ['Dm', 'G', 'C', 'C'],
  },
  {
    name: 'I - IV - V (Blues / Sertanejo)',
    genre: 'Blues / Folk',
    chords: ['C', 'F', 'G', 'C'],
  },
  {
    name: 'vi - IV - I - V (Balada Emocionante)',
    genre: 'Balada',
    chords: ['Am', 'F', 'C', 'G'],
  },
];

export const HybridRhythmChord: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(metronomeScheduler.getIsPlaying());
  const [bpm, setBpm] = useState<number>(metronomeScheduler.getBpm());
  const [selectedPreset, setSelectedPreset] = useState<ProgressionPreset>(PROGRESSION_PRESETS[0]);
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
  const [instrument, setInstrument] = useState<'piano' | 'guitar'>('piano');

  const currentChordSymbol = selectedPreset.chords[currentChordIndex];

  // Alterna o acorde a cada novo compasso (quando beatNumber === 1)
  useEffect(() => {
    const unsubscribe = metronomeScheduler.subscribe((event: BeatEvent) => {
      if (event.beatNumber === 1) {
        setCurrentChordIndex((prev) => {
          const next = (prev + 1) % selectedPreset.chords.length;
          // Toca o acorde automaticamente no tempo 1 como guia sonoro
          const nextChordSymbol = selectedPreset.chords[next];
          const isMinor = nextChordSymbol.endsWith('m');
          const root = nextChordSymbol.replace('m', '');
          const chordDef = buildChord(root, isMinor ? 'minor' : 'major');
          
          const baseMidi = 60; // C4
          const midiNotes = chordDef.intervals.map(semitones => baseMidi + semitones);
          soundEngine.playChord(midiNotes, instrument, 1.4);

          return next;
        });
      }
    });

    return () => unsubscribe();
  }, [selectedPreset, instrument]);

  return (
    <div className="w-full space-y-6">
      {/* Header do Módulo Híbrido */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Módulo 5 — Conexão Ritmo + Harmonia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Trilha de Acordes em Tempo Real
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-4xl">
            O grande elo perdido do ensino musical: troque os acordes sincronizado com a descida da esteira rítmica na cabeça de cada compasso.
          </p>
        </div>

        {/* Seletor de Instrumento de Apoio */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setInstrument('piano')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              instrument === 'piano'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Piano
          </button>
          <button
            onClick={() => setInstrument('guitar')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              instrument === 'guitar'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Violão
          </button>
        </div>
      </div>

      {/* Seletor de Progressões Harmônicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PROGRESSION_PRESETS.map((preset) => {
          const isSelected = selectedPreset.name === preset.name;
          return (
            <button
              key={preset.name}
              onClick={() => {
                setSelectedPreset(preset);
                setCurrentChordIndex(0);
              }}
              className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'glass-card border-white/5 hover:border-white/15 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                {preset.genre}
              </div>
              <div className="text-sm font-bold text-white font-display">
                {preset.name}
              </div>
              <div className="flex items-center gap-1.5 mt-2 font-mono text-xs font-black text-indigo-300">
                {preset.chords.map((c, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-lg ${
                      isSelected && currentChordIndex === i
                        ? 'bg-cyan-500 text-slate-950 font-black scale-110 shadow-md'
                        : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Principal: Metrônomo + Esteira com Acorde Atual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Metrônomo e Mostrador de Acorde Atual */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Gigante do Acorde Atual da Esteira */}
          <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10" />

            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Acorde do Compasso
            </span>

            <div className="text-6xl font-black font-display text-white my-2 tracking-tight">
              {currentChordSymbol}
            </div>

            <p className="text-xs text-slate-400">
              Prepare a digitação no {instrument === 'piano' ? 'teclado' : 'violão'} para bater no tempo 1!
            </p>
          </div>

          <MetronomeView
            onBpmChange={(newBpm) => setBpm(newBpm)}
            onPlayStateChange={(playing) => setIsPlaying(playing)}
          />
        </div>

        {/* Esteira Rítmica */}
        <div className="lg:col-span-7">
          <RhythmTrackCanvas
            isPlaying={isPlaying}
            bpm={bpm}
            timeSignature="4/4"
            chordName={currentChordSymbol}
          />
        </div>
      </div>
    </div>
  );
};
