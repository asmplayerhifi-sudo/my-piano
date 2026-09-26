import React, { useState, useMemo } from 'react';
import {
  SCALES_CATALOG,
  ROOT_KEYS,
  computeScaleNotes,
  type ScaleCategory,
} from '../../core/scaleData';
import { soundEngine } from '../../core/soundEngine';
import { ScalePerformanceEvaluator } from './ScalePerformanceEvaluator';
import { Play, Sparkles, Music, Volume2, Info, Compass, Flame, Mic, Expand, Shrink } from 'lucide-react';
import { useFullscreen } from '../../hooks/useFullscreen';

export interface ScaleBuilderProps {
  rootKey?: string;
  onRootKeyChange?: (key: string) => void;
  className?: string;
}

export const ScaleBuilder: React.FC<ScaleBuilderProps> = ({
  rootKey: externalRootKey,
  onRootKeyChange,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ScaleCategory>('pentatonic');
  const [selectedScaleId, setSelectedScaleId] = useState<string>('penta-minor');
  const [internalRootKey, setInternalRootKey] = useState<string>('C');
  const selectedRootKey = externalRootKey ?? internalRootKey;

  const handleSelectRootKey = (key: string) => {
    setInternalRootKey(key);
    onRootKeyChange?.(key);
  };

  const [isPlayingScale, setIsPlayingScale] = useState<boolean>(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [showEvaluator, setShowEvaluator] = useState<boolean>(true);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Escalas da categoria selecionada
  const categoryScales = useMemo(() => {
    return SCALES_CATALOG.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Escala ativa
  const currentScale = useMemo(() => {
    return (
      SCALES_CATALOG.find((s) => s.id === selectedScaleId) ||
      categoryScales[0] ||
      SCALES_CATALOG[0]
    );
  }, [selectedScaleId, categoryScales]);

  // Se trocar de categoria e a escala atual não pertencer a ela, seleciona a primeira da categoria
  const handleSelectCategory = (cat: ScaleCategory) => {
    setSelectedCategory(cat);
    const firstOfCat = SCALES_CATALOG.find((s) => s.category === cat);
    if (firstOfCat) {
      setSelectedScaleId(firstOfCat.id);
    }
  };

  // Notas calculadas com rigor enarmônico
  const computed = useMemo(() => {
    return computeScaleNotes(selectedRootKey, currentScale);
  }, [selectedRootKey, currentScale]);

  // Toca a escala completa em sequência ascendente com oitava final
  const handlePlayScale = async () => {
    if (isPlayingScale) return;
    await soundEngine.ensureAudioReady();
    setIsPlayingScale(true);

    const octavedRoot = {
      ...computed.notes[0],
      midi: computed.notes[0].midi + 12,
      degree: '8ª',
      functionName: 'Oitava',
    };
    const notesToPlay = [...computed.notes, octavedRoot];

    notesToPlay.forEach((item, idx) => {
      setTimeout(() => {
        setActiveNoteIndex(idx < computed.notes.length ? idx : 0);
        soundEngine.playPianoNote(item.midi, 0.7);

        if (idx === notesToPlay.length - 1) {
          setTimeout(() => {
            setActiveNoteIndex(null);
            setIsPlayingScale(false);
          }, 350);
        }
      }, idx * 260);
    });
  };

  // Toca nota individual ao clicar no card
  const handlePlaySingleNote = async (midi: number, idx: number) => {
    await soundEngine.ensureAudioReady();
    setActiveNoteIndex(idx);
    soundEngine.playPianoNote(midi, 0.8);
    setTimeout(() => {
      setActiveNoteIndex((cur) => (cur === idx ? null : cur));
    }, 350);
  };

  // Mini visualizador de 1 oitava cromática para as teclas da escala
  const chromaticKeys = useMemo(() => {
    // 12 teclas a partir de C
    const rootIdx = ROOT_KEYS.findIndex((r) => r.key === selectedRootKey);
    const safeRootIdx = rootIdx >= 0 ? rootIdx : 0;
    const baseMidi = 60 + safeRootIdx;

    const scaleMidisMod = new Set(computed.allMidi.map((m) => m % 12));
    const rootMod = baseMidi % 12;

    const keys = [
      { name: 'C', isBlack: false, semitone: 0 },
      { name: 'C#', isBlack: true, semitone: 1 },
      { name: 'D', isBlack: false, semitone: 2 },
      { name: 'D#', isBlack: true, semitone: 3 },
      { name: 'E', isBlack: false, semitone: 4 },
      { name: 'F', isBlack: false, semitone: 5 },
      { name: 'F#', isBlack: true, semitone: 6 },
      { name: 'G', isBlack: false, semitone: 7 },
      { name: 'G#', isBlack: true, semitone: 8 },
      { name: 'A', isBlack: false, semitone: 9 },
      { name: 'A#', isBlack: true, semitone: 10 },
      { name: 'B', isBlack: false, semitone: 11 },
    ];

    return keys.map((k) => {
      const inScale = scaleMidisMod.has(k.semitone);
      const isTonic = k.semitone === rootMod;
      return {
        ...k,
        inScale,
        isTonic,
        midi: 60 + k.semitone,
      };
    });
  }, [selectedRootKey, computed]);

  return (
    <div
      className={`w-full glass-card rounded-3xl p-5 sm:p-7 border border-white/10 space-y-6 shadow-2xl transition-all ${className} ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#080811] p-5 sm:p-8 overflow-y-auto m-0 rounded-none border-none shadow-2xl'
          : ''
      }`}
    >
      {/* 1. Header do Construtor de Escalas com Título e Botão Tocar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Enciclopédia &amp; Construtor de Escalas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            {currentScale.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Fórmula intervalar: <span className="font-mono text-indigo-300 font-bold">{currentScale.formula}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handlePlayScale}
            disabled={isPlayingScale}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
            title="Ouvir demonstração sonora da escala com piano virtual"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isPlayingScale ? 'Ouvindo Escala...' : 'Ouvir Demonstração'}</span>
          </button>

          <button
            onClick={() => setShowEvaluator((prev) => !prev)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 border ${
              showEvaluator
                ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30 ring-2 ring-rose-400/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Ativar/ocultar laboratório de escuta do seu instrumento real via microfone"
          >
            <Mic className="w-4 h-4" />
            <span>{showEvaluator ? 'Ouvir Instrumento (Ativo)' : 'Avaliar no meu Instrumento'}</span>
          </button>

          {/* Botão Tela Cheia */}
          <button
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
            }`}
            title={isFullscreen ? 'Sair da Tela Cheia (Esc)' : 'Tela Cheia no Construtor de Escalas'}
          >
            {isFullscreen ? <Shrink className="w-4 h-4 text-rose-400" /> : <Expand className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* 2. Seletor de Categorias das Escalas (Pills de Alto Nível) */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
          Categorias de Escalas:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectCategory('pentatonic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'pentatonic'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-1 ring-amber-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <span>⭐</span>
            <span>Pentatônicas &amp; Blues (4)</span>
          </button>

          <button
            onClick={() => handleSelectCategory('modes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'modes'
                ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <span>🏛️</span>
            <span>Modos Gregos (6)</span>
          </button>

          <button
            onClick={() => handleSelectCategory('minor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'minor'
                ? 'bg-purple-600 text-white font-black shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <span>🎻</span>
            <span>Menores &amp; Clássicas (2)</span>
          </button>

          <button
            onClick={() => handleSelectCategory('symmetric')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'symmetric'
                ? 'bg-cyan-600 text-white font-black shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <span>🌌</span>
            <span>Simétricas &amp; Jazz (2)</span>
          </button>
        </div>
      </div>

      {/* 3. Seletor Específico de Escala Dentro da Categoria */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
          Selecione a Escala:
        </span>
        <div className="flex flex-wrap gap-2">
          {categoryScales.map((scale) => {
            const isCurrent = scale.id === currentScale.id;
            return (
              <button
                key={scale.id}
                onClick={() => setSelectedScaleId(scale.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isCurrent
                    ? 'bg-white text-slate-950 border-white shadow-md shadow-white/10 scale-102'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                }`}
              >
                <span>{scale.name}</span>
                {scale.id === 'blues' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                    ♭5
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Seletor de Tônica (Root Key - 12 Notas Cromáticas) */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
          Tônica da Escala (Tom Fundamental):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ROOT_KEYS.map((k) => {
            const isSelected = selectedRootKey === k.key;
            return (
              <button
                key={k.key}
                onClick={() => handleSelectRootKey(k.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/30 scale-105 ring-1 ring-rose-400'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {k.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Display das Notas da Escala com Graus e Funções Interativas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
            Notas da Escala em {computed.rootNote} (Toque em Qualquer Nota para Ouvir):
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {computed.notes.length} notas na escala
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {computed.notes.map((noteItem, idx) => {
            const isActive = activeNoteIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => handlePlaySingleNote(noteItem.midi, idx)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer select-none active:scale-95 group relative ${
                  isActive
                    ? 'bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20 scale-105'
                    : noteItem.isTonic
                    ? 'bg-rose-500/15 border-rose-500/40 text-white hover:bg-rose-500/25'
                    : noteItem.isBlueNote
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 hover:bg-amber-500/30'
                    : noteItem.isCharacteristic
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/30'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Clique para ouvir esta nota"
              >
                {/* Grau da Escala */}
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                  <span
                    className={
                      noteItem.isTonic
                        ? 'text-rose-400'
                        : noteItem.isBlueNote
                        ? 'text-amber-400'
                        : noteItem.isCharacteristic
                        ? 'text-cyan-400'
                        : 'text-indigo-400'
                    }
                  >
                    {noteItem.degree}
                  </span>
                  <Volume2 className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                {/* Nome Universal da Nota */}
                <div className="text-2xl font-black font-display tracking-tight text-white my-1">
                  {noteItem.note}
                </div>

                {/* Nome em Português */}
                <div className="text-xs font-bold text-slate-300 font-mono">
                  {noteItem.notePt}
                </div>

                {/* Função Harmônica */}
                <div className="text-[10px] text-slate-400 truncate mt-1">
                  {noteItem.functionName}
                </div>

                {/* Badge Visual de Destaque */}
                {noteItem.isBlueNote && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow-sm flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 fill-current" />
                    Blue
                  </span>
                )}
                {noteItem.isTonic && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] shadow-sm">
                    Tônica
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Laboratório de Avaliação de Performance no Instrumento Real (Microfone) */}
      {showEvaluator && (
        <ScalePerformanceEvaluator
          scale={currentScale}
          rootKey={selectedRootKey}
          notes={computed.notes}
          onPlayNote={(m) => handlePlaySingleNote(m, 0)}
        />
      )}

      {/* 7. Mini Visualizador de Teclas do Piano para a Escala */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            <span>Visualização Cromática no Piano (12 Semitons)</span>
          </span>
          <span className="text-[11px] text-slate-500">
            Teclas coloridas pertencem à escala
          </span>
        </div>

        <div className="flex items-end justify-center gap-1 h-24 max-w-xl mx-auto py-1">
          {chromaticKeys.map((k) => (
            <button
              key={k.semitone}
              onClick={() => handlePlaySingleNote(k.midi, 0)}
              className={`flex-1 rounded-b-lg font-mono text-[10px] font-bold flex flex-col justify-end items-center pb-1.5 transition-all cursor-pointer ${
                k.isBlack ? 'h-16 -mx-1 z-10' : 'h-24 z-0'
              } ${
                k.inScale
                  ? k.isTonic
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-indigo-600 text-white shadow-md'
                  : k.isBlack
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 hover:bg-slate-800'
                  : 'bg-slate-800/60 border border-slate-700/50 text-slate-500 hover:bg-slate-700/60'
              }`}
              title={`Tocar ${k.name}`}
            >
              <span>{k.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 8. Dicas Musicais, Aplicação Prática e Exemplos Famosos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Sonoridade &amp; Caráter</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentScale.description}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Onde Aplicar &amp; Acordes</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentScale.musicalUse}
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {currentScale.compatibleChords.map((chord, cIdx) => (
              <span
                key={cIdx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-mono font-bold"
              >
                {chord}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5" />
            <span>Músicos &amp; Referências</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentScale.famousExamples}
          </p>
        </div>
      </div>
    </div>
  );
};
