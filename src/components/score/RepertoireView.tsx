import React, { useState } from 'react';
import { REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from '../../core/repertoireData';
import type { RepertoireSong, SongGenre } from '../../core/repertoireData';
import { ScrollingScoreCanvas } from './ScrollingScoreCanvas';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { soundEngine } from '../../core/soundEngine';
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
        soundEngine.playPianoNote(note.midi, 1.4);
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Banner Principal de Repertório Musical */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#1e1035] to-[#0d071a] border-2 border-purple-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/40 shrink-0">
              <Music className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-300 border border-purple-500/30">
                  Repertório Interativo
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {REPERTOIRE_SONGS.length} Obras Transcritas em Pentagrama Duplo
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Partituras Reais com Rolagem Contínua
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
                Pratique grandes mestres da música clássica, clássicos do rock internacional, baladas do Roupa Nova, MPB e cantigas do folclore brasileiro.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEPARADOR DE CATEGORIAS VISUAL (Interactive Category Separator) */}
      <div className="glass-card rounded-3xl p-4 border border-white/10 space-y-2">
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Separador de Categorias &amp; Gêneros:</span>
          </span>
          <span className="text-[11px] font-mono text-purple-300">
            {filteredSongs.length} obras exibidas
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
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-600/20 scale-[1.02]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400'}`}>
                    <Icon className="w-4 h-4" />
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
                  <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                    {cat.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Lista de Músicas com Separadores (Esquerda) e Palco da Partitura (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Lista de Músicas com Agrupamentos */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Obras ({selectedCategory === 'Todos' ? 'Todas as Categorias' : selectedCategory})</span>
              </h3>
            </div>

            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1 no-scrollbar">
              {/* Se "Todos" estiver selecionado, agrupa visualmente com divisórias */}
              {(selectedCategory === 'Todos'
                ? ['Clássico & Mestres', 'MPB & Pop Nacional', 'Pop & Rock Clássico', 'Rock Anos 80 & New Wave', 'Infantis, Cirandas & Folclore'] as const
                : [selectedCategory] as const
              ).map((categoryName) => {
                const songsInCategory = REPERTOIRE_SONGS.filter(s => s.genre === categoryName);
                if (songsInCategory.length === 0) return null;
                const Icon = CATEGORY_ICON_MAP[categoryName] || Music;

                return (
                  <div key={categoryName} className="space-y-2">
                    {/* Linha Divisória de Categoria */}
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
                            className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                              isSelected
                                ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
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

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                              <span>{song.tonality}</span>
                              <span>•</span>
                              <span>{song.timeSignature}</span>
                              <span>•</span>
                              <span>{song.recommendedBpm} BPM</span>
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

        {/* Coluna 2: Palco da Partitura Deslizante e Instrumento */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
            {/* Header da Música Selecionada */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
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

              {/* Botão de Demonstração em Áudio */}
              <button
                onClick={handlePlayDemo}
                disabled={isPlayingDemo}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer transition-all self-start sm:self-auto"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isPlayingDemo ? 'animate-pulse' : ''}`} />
                <span>{isPlayingDemo ? 'Tocando Demo...' : 'Ouvir Frase Demo'}</span>
              </button>
            </div>

            {/* Painel Informativo da Música */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Contexto Histórico:</span>
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {activeSong.historicalContext}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dica de Biomecânica:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeSong.biomechanicsTip}
                </p>
              </div>
            </div>

            {/* Acordes Envolvidos */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Acordes da Obra:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSong.chords.map((chord, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-black"
                  >
                    {chord}
                  </span>
                ))}
              </div>
            </div>

            {/* Motor de Partitura Deslizante 60 FPS com Escuta por Microfone */}
            <div className="pt-2 border-t border-white/5 space-y-4">
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

              {/* Teclado Virtual Sincronizado para Prática Direta */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  Toque no Teclado Virtual, via USB-MIDI ou no seu Piano Real (Microfone Ativo):
                </span>
                <PianoKeyboard
                  startOctave={2}
                  octaveCount={3}
                  allowOctaveControls={true}
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
