import React, { useState, useEffect } from 'react';
import { REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from '../../core/repertoireData';
import type { RepertoireSong, SongGenre } from '../../core/repertoireData';
import {
  X,
  Search,
  Music,
  GraduationCap,
  Heart,
  Disc,
  Zap,
  Sparkles,
  LayoutGrid,
  Check,
  Gauge,
  Sun,
  Radio,
  BookOpen,
  Waves,
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'Todos': LayoutGrid,
  'Clássico & Mestres': GraduationCap,
  'MPB & Pop Nacional': Heart,
  'Pop & Rock Clássico': Disc,
  'Rock Anos 80 & New Wave': Zap,
  'Reggae & Praieiro': Waves,
  'Forró, Xote & Baião': Sun,
  'Seresta & Brega (Zezo dos Teclados)': Radio,
  'Gospel Clássico & Sacro': BookOpen,
  'Infantis, Cirandas & Folclore': Sparkles,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedSong: RepertoireSong;
  onSelectSong: (song: RepertoireSong) => void;
}

export const RepertoireCatalogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedSong,
  onSelectSong,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SongGenre | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fecha com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtragem por categoria e busca textual
  const filteredSongs = REPERTOIRE_SONGS.filter((song) => {
    const matchesCategory = selectedCategory === 'Todos' || song.genre === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      song.title.toLowerCase().includes(query) ||
      song.composerOrArtist.toLowerCase().includes(query) ||
      song.tonality.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog com Bordas Sutis */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0c0919] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Cabeçalho do Modal */}
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-[#160d2b]/30 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-lg">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-display text-white">
                Catálogo de Repertório &amp; Partituras
              </h3>
              <p className="text-xs text-purple-200/70">
                Selecione uma obra clássica, rock internacional, MPB ou cantiga folclórica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Busca e Filtros Rápidos */}
        <div className="p-4 sm:p-5 border-b border-white/5 space-y-3 bg-black/30">
          {/* Campo de Busca */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por música, compositor, artista ou tonalidade (ex: Beethoven, Roupa Nova, Dó Maior)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Abas de Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {REPERTOIRE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = CATEGORY_ICON_MAP[cat.id] || Music;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600/40 border-purple-500 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.shortLabel}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-purple-500/40 text-purple-200' : 'bg-white/5 text-slate-500'
                  }`}>
                    {cat.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade de Músicas com Scroll Suave */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1">
            <span>{filteredSongs.length} obras encontradas</span>
            <span>Toque em qualquer card para carregar na partitura</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSongs.map((song) => {
              const isSelected = selectedSong.id === song.id;

              return (
                <button
                  key={song.id}
                  onClick={() => {
                    onSelectSong(song);
                    onClose();
                  }}
                  className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/40'
                      : 'bg-white/[0.02] border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {/* Topo do Card */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/20">
                        {song.genre}
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

                    <h4 className="text-sm font-black font-display text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {song.title}
                    </h4>

                    <p className="text-xs text-purple-300/80 font-medium line-clamp-1">
                      {song.composerOrArtist}
                    </p>
                  </div>

                  {/* Contexto breve */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {song.historicalContext}
                  </p>

                  {/* Rodapé do Card */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>{song.tonality}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-purple-400" />
                        <span>{song.recommendedBpm} BPM</span>
                      </span>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-purple-400 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Ativa</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredSongs.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm text-slate-400">Nenhuma obra encontrada para essa busca.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-mono"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-white/5 bg-black/40 flex items-center justify-between text-xs text-slate-500">
          <span>{REPERTOIRE_SONGS.length} transcrições completas com partitura dupla</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs cursor-pointer transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
