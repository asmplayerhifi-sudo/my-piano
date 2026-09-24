import React, { useState } from 'react';
import { REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from '../../core/repertoireData';
import type { RepertoireSong, SongGenre } from '../../core/repertoireData';
import { ScrollingScoreCanvas } from './ScrollingScoreCanvas';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import {
  Music,
  BookOpen,
  Play,
  Compass,
  Lightbulb,
  GraduationCap,
  Heart,
  Disc,
  Zap,
  Sparkles,
  LayoutGrid,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'Todos': LayoutGrid,
  'Clássico & Mestres': GraduationCap,
  'MPB & Pop Nacional': Heart,
  'Pop & Rock Clássico': Disc,
  'Rock Anos 80 & New Wave': Zap,
  'Infantis, Cirandas & Folclore': Sparkles,
};

export const RepertoireView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SongGenre | 'Todos'>('Todos');
  const [activeSong, setActiveSong] = useState<RepertoireSong>(REPERTOIRE_SONGS[0]);
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [isWidescreenStage, setIsWidescreenStage] = useState<boolean>(true);

  const handleNoteInput = (midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  };

  const filteredSongs = selectedCategory === 'Todos'
    ? REPERTOIRE_SONGS
    : REPERTOIRE_SONGS.filter(s => s.genre === selectedCategory);

  const handlePlayDemo = () => {
    if (isPlayingDemo) return;
    setIsPlayingDemo(true);
    const speedMs = (60 / activeSong.recommendedBpm) * 1000;
    activeSong.scoreTrack.slice(0, 10).forEach((note, idx) => {
      window.setTimeout(() => {
        handleNoteInput(note.midi);
        if (idx === Math.min(activeSong.scoreTrack.length - 1, 9)) {
          setIsPlayingDemo(false);
        }
      }, idx * speedMs * (note.duration || 1));
    });
  };

  const handleSelectSong = (song: RepertoireSong) => {
    setActiveSong(song);
  };

  return (
    <div className="w-full max-w-[1850px] mx-auto space-y-4">
      {/* Banner Principal de Repertório Musical (Bordas Sutis & Widescreen) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-[#180e2b]/80 to-[#0b0716]/90 border border-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 shrink-0">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/20">
                  Repertório &amp; Rastro Synthesia
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {REPERTOIRE_SONGS.length} Obras Transcritas em Pentagrama Duplo
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Partituras Reais &amp; Rastro de Teclas em Área Total
              </h2>
            </div>
          </div>

          {/* Botão de Alternância de Largura Total do Palco */}
          <button
            onClick={() => setIsWidescreenStage(!isWidescreenStage)}
            className="px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center gap-2 border border-white/5 cursor-pointer transition-all self-start md:self-auto"
          >
            {isWidescreenStage ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Exibir Lista ao Lado</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Modo Palco Total (100% Largura)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEPARADOR DE CATEGORIAS VISUAL (Bordas Sutis) */}
      <div className="glass-card rounded-3xl p-3 sm:p-4 border border-white/5 space-y-2">
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Categorias &amp; Gêneros:</span>
          </span>
          <span className="text-[11px] font-mono text-purple-300">
            {filteredSongs.length} obras
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {REPERTOIRE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = CATEGORY_ICON_MAP[cat.id] || Music;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600/30 border-purple-500/40 text-white shadow-lg shadow-purple-600/20'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-purple-400/20 text-purple-200' : 'bg-white/5 text-slate-400'
                  }`}>
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-xs leading-tight text-white">
                    {cat.shortLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Se estiver no Modo Palco Total, exibe a barra horizontal rápida de músicas */}
      {isWidescreenStage && (
        <div className="glass-card rounded-3xl p-3 border border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-2 shrink-0">
            Música Ativa:
          </span>
          <div className="flex items-center gap-2">
            {filteredSongs.map((song) => {
              const isSelected = activeSong.id === song.id;
              return (
                <button
                  key={song.id}
                  onClick={() => handleSelectSong(song)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600/40 border-purple-400 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{song.title}</span>
                  <span className="text-[10px] text-purple-300 font-normal font-mono">({song.composerOrArtist})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid: Palco e Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Lista Lateral de Músicas (Ocultada quando em Palco Total) */}
        {!isWidescreenStage && (
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card rounded-3xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span>Obras ({selectedCategory === 'Todos' ? 'Todas' : selectedCategory})</span>
                </h3>
              </div>

              <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1 no-scrollbar">
                {(selectedCategory === 'Todos'
                  ? ['Clássico & Mestres', 'MPB & Pop Nacional', 'Pop & Rock Clássico', 'Rock Anos 80 & New Wave', 'Infantis, Cirandas & Folclore'] as const
                  : [selectedCategory] as const
                ).map((categoryName) => {
                  const songsInCategory = REPERTOIRE_SONGS.filter(s => s.genre === categoryName);
                  if (songsInCategory.length === 0) return null;
                  const Icon = CATEGORY_ICON_MAP[categoryName] || Music;

                  return (
                    <div key={categoryName} className="space-y-2">
                      <div className="flex items-center gap-2 px-1 pt-1 text-[11px] font-mono font-bold text-purple-300">
                        <Icon className="w-3.5 h-3.5 text-purple-400" />
                        <span>{categoryName}</span>
                        <span className="text-[9px] text-slate-500 font-normal">({songsInCategory.length})</span>
                      </div>

                      <div className="space-y-1.5">
                        {songsInCategory.map((song) => {
                          const isSelected = activeSong.id === song.id;

                          return (
                            <button
                              key={song.id}
                              onClick={() => handleSelectSong(song)}
                              className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                                isSelected
                                  ? 'bg-purple-600/30 border-purple-500/40 text-white shadow-md'
                                  : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-white truncate">
                                  {song.title}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                                  song.difficulty === 'Iniciante'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : song.difficulty === 'Intermediário'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}>
                                  {song.difficulty}
                                </span>
                              </div>

                              <div className="text-[11px] text-purple-300 font-medium truncate">
                                {song.composerOrArtist}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Coluna 2 / Palco Total: Partitura + Rastro Synthesia + Teclado (Bordas Sutis & Widescreen) */}
        <div className={isWidescreenStage ? 'lg:col-span-12 space-y-4' : 'lg:col-span-8 space-y-4'}>
          <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/5 space-y-4">
            {/* Header da Música Selecionada */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/20">
                    {activeSong.genre}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeSong.tonality} • {activeSong.timeSignature} • {activeSong.recommendedBpm} BPM
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                  {activeSong.title}
                </h3>
                <p className="text-xs text-purple-200/90 font-medium">
                  {activeSong.composerOrArtist}
                </p>
              </div>

              {/* Botões do Topo do Palco */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayDemo}
                  disabled={isPlayingDemo}
                  className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer transition-all self-start sm:self-auto"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isPlayingDemo ? 'animate-pulse' : ''}`} />
                  <span>{isPlayingDemo ? 'Tocando Demo...' : 'Ouvir Frase Demo'}</span>
                </button>
              </div>
            </div>

            {/* Painel Informativo da Música com Bordas Sutis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Contexto Histórico:</span>
                </span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {activeSong.historicalContext}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dica de Biomecânica:</span>
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeSong.biomechanicsTip}
                </p>
              </div>
            </div>

            {/* Acordes Envolvidos */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Acordes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSong.chords.map((chord, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-black"
                  >
                    {chord}
                  </span>
                ))}
              </div>
            </div>

            {/* Motor de Partitura Deslizante 60 FPS com Escuta por Microfone */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              {/* Barra de Captação do Microfone e Reconhecimento Acústico */}
              <MicrophonePitchBar
                onNoteDetected={(midi) => handleNoteInput(midi)}
              />

              <ScrollingScoreCanvas
                key={activeSong.id}
                notes={activeSong.scoreTrack}
                bpm={activeSong.recommendedBpm}
                currentMidiPressed={lastMidiEvent}
              />

              {/* Teclado Virtual Sincronizado com Rastro Synthesia (100% da Largura, Zero Scroll, Bordas Sutis) */}
              <div className="pt-2">
                <PianoKeyboard
                  startOctave={2}
                  octaveCount={3}
                  allowOctaveControls={true}
                  activeExternalNotes={lastMidiEvent ? [lastMidiEvent.midi] : []}
                  onKeyPlay={(midi) => handleNoteInput(midi)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
