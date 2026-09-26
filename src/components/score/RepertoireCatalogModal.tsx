import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Globe,
  Flame,
  ChevronLeft,
  ChevronRight,
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
  'Internacional & Folk': Globe,
  'Rock Psicodelico & Progressivo': Flame,
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
  const [isExpandedCategories, setIsExpandedCategories] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const el = categoryScrollRef.current;
    if (!el) return;
    // Checagem imediata e com pequeno atraso para renderização do layout
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [isOpen, checkScroll, isExpandedCategories]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const distance = 220;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && !e.shiftKey && !isExpandedCategories) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

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
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center p-0 sm:p-2 md:p-4 lg:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog: Bottom Sheet em mobile (<768px), centralizado em tablet e desktop */}
      <div className="relative w-full md:max-w-5xl h-[94dvh] sm:h-[90vh] md:max-h-[85vh] bg-[#0c0919] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-slide-up md:animate-none">
        {/* Drag handle visível apenas em mobile */}
        <div className="w-12 h-1 rounded-full bg-white/20 mx-auto my-1.5 md:hidden shrink-0" />

        {/* Cabeçalho do Modal */}
        <div className="px-3.5 py-2.5 sm:px-6 sm:py-4 border-b border-white/5 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-950/40 via-[#160d2b]/30 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-lg shrink-0">
              <Music className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-black font-display text-white">
                Catálogo de Repertório &amp; Partituras
              </h3>
              <p className="text-[10px] sm:text-xs text-purple-200/70 hidden sm:block">
                Selecione uma obra clássica, rock internacional, MPB ou cantiga folclórica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Fechar (Esc)"
            aria-label="Fechar catálogo"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Barra de Busca e Filtros Rápidos */}
        <div className="px-3.5 py-2 sm:px-6 sm:py-3.5 border-b border-white/5 space-y-2 sm:space-y-3 bg-black/30 shrink-0">
          {/* Campo de Busca */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por música, compositor, artista ou tonalidade (ex: Beethoven, Roupa Nova, Dó Maior)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Header da Seção de Categorias */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-wider text-slate-300">
                Gêneros ({REPERTOIRE_CATEGORIES.length - 1} Categorias)
              </span>
            </div>

            {/* Alternador de visualização para telas compactas */}
            <button
              type="button"
              onClick={() => setIsExpandedCategories((prev) => !prev)}
              className="md:hidden text-[10px] font-bold text-purple-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 transition-colors cursor-pointer"
            >
              <span>{isExpandedCategories ? 'Linha Única' : 'Ver Todas'}</span>
            </button>
          </div>

          {/* Abas de Categorias: No Desktop (>=md) sempre quebra em linhas organizadas (flex-wrap), no Mobile desliza com botões e expansão */}
          <div className="relative">
            {/* Botão de Rolagem Esquerda (Mobile / Telas menores quando não expandido) */}
            {!isExpandedCategories && canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="md:hidden absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/90 border border-purple-400/50 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
                title="Rolar categorias para esquerda"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
              </button>
            )}

            {/* Máscara de gradiente à esquerda */}
            {!isExpandedCategories && canScrollLeft && (
              <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0c0919] to-transparent z-10" />
            )}

            {/* Lista dos Chips de Categoria */}
            <div
              ref={categoryScrollRef}
              onWheel={handleCategoryWheel}
              className={`flex items-center gap-1.5 sm:gap-2 ${
                isExpandedCategories
                  ? 'flex-wrap'
                  : 'overflow-x-auto no-scrollbar md:flex-wrap'
              } pb-0.5`}
            >
              {REPERTOIRE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = CATEGORY_ICON_MAP[cat.id] || Music;
                const count = cat.id === 'Todos'
                  ? REPERTOIRE_SONGS.length
                  : REPERTOIRE_SONGS.filter((s) => s.genre === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    title={`${cat.label} (${count} obras) — ${cat.description}`}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 sm:gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-lg shadow-purple-950/50 ring-1 ring-purple-400/40'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected ? 'text-amber-300' : 'text-purple-400'}`} />
                    <span>{cat.shortLabel}</span>
                    <span className={`text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-purple-950/80 text-purple-200 border border-purple-400/30' : 'bg-white/10 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Máscara de gradiente à direita */}
            {!isExpandedCategories && canScrollRight && (
              <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0c0919] to-transparent z-10" />
            )}

            {/* Botão de Rolagem Direita (Mobile / Telas menores quando não expandido) */}
            {!isExpandedCategories && canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="md:hidden absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/90 border border-purple-400/50 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
                title="Rolar categorias para direita"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
              </button>
            )}
          </div>
        </div>

        {/* Grade de Músicas com Scroll Suave */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-2.5 sm:px-6 sm:py-5 space-y-3 sm:space-y-4 no-scrollbar overscroll-contain">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-mono pb-0.5">
            <span>{filteredSongs.length} obras encontradas</span>
            <span className="hidden sm:inline">Toque em qualquer card para carregar na partitura</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredSongs.map((song) => {
              const isSelected = selectedSong.id === song.id;

              return (
                <button
                  key={song.id}
                  onClick={() => {
                    onSelectSong(song);
                    onClose();
                  }}
                  className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 sm:gap-3 relative group ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/40'
                      : 'bg-white/[0.02] border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {/* Topo do Card */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[8px] sm:text-[9px] font-bold font-mono uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/20">
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

                    <h4 className="text-xs sm:text-sm font-black font-display text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {song.title}
                    </h4>

                    <p className="text-[10px] sm:text-xs text-purple-300/80 font-medium line-clamp-1">
                      {song.composerOrArtist}
                    </p>
                  </div>

                  {/* Contexto breve */}
                  <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                    {song.historicalContext}
                  </p>

                  {/* Rodapé do Card */}
                  <div className="pt-1.5 sm:pt-2 border-t border-white/5 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span>{song.tonality}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Gauge className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                        <span>{song.recommendedBpm} BPM</span>
                      </span>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-purple-400 font-bold">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Ativa</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredSongs.length === 0 && (
            <div className="py-8 sm:py-12 text-center space-y-2">
              <p className="text-xs sm:text-sm text-slate-400">Nenhuma obra encontrada para essa busca.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-mono cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="px-3.5 py-2 sm:px-6 sm:py-3 border-t border-white/5 bg-black/40 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 shrink-0">
          <span className="truncate mr-2">{REPERTOIRE_SONGS.length} transcrições completas com partitura dupla</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs cursor-pointer transition-all shrink-0"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
