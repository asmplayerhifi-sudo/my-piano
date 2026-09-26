import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  Sparkles,
  Repeat,
  Music,
  Plus,
  Radio,
  Wand2,
  ChevronRight,
  BookOpen,
  FolderOpen,
  Save,
} from 'lucide-react';
import { StudioFolderBar } from '../common/StudioFolderBar';
import { StudioProjectModal } from '../common/StudioProjectModal';
import { StudioImportExportBar } from '../common/StudioImportExportBar';
import { useStudioStorage } from '../../core/studio/useStudioStorage';
import type { StudioProjectEnvelope } from '../../core/studio/studioStorageTypes';
import type { ExportFormat } from '../../core/studio/studioImportExportService';
import { soundEngine } from '../../core/soundEngine';
import { useOctaveStandard } from '../../core/octaveConfigStore';
import { getNoteInfo } from '../../core/musicTheory';
import { TimbreSelector } from '../audio/TimbreSelector';
import type { PhrasingNote, PhrasingLick, PhrasingGenre, PhrasingArticulation } from '../../core/phrasingTypes';
import { PHRASING_LICKS } from '../../core/phrasingLicksData';
import {
  convertTextToMelody,
  transposePhrase,
  calculateErgonomicFingering,
} from '../../core/phrasingEngine';

const TONALITIES = [
  { label: 'C (Dó)', semitones: 0 },
  { label: 'C# / Db', semitones: 1 },
  { label: 'D (Ré)', semitones: 2 },
  { label: 'Eb (Mib)', semitones: 3 },
  { label: 'E (Mi)', semitones: 4 },
  { label: 'F (Fá)', semitones: 5 },
  { label: 'F# / Gb', semitones: 6 },
  { label: 'G (Sol)', semitones: 7 },
  { label: 'Ab (Láb)', semitones: 8 },
  { label: 'A (Lá)', semitones: 9 },
  { label: 'Bb (Sib)', semitones: 10 },
  { label: 'B (Si)', semitones: 11 },
];

export const PhraseEditorView: React.FC = () => {
  const octaveStandard = useOctaveStandard();

  // Estado da Frase Ativa
  const [currentLickTitle, setCurrentLickTitle] = useState<string>('Minha Frase Melódica');
  const [notes, setNotes] = useState<PhrasingNote[]>(() => PHRASING_LICKS[0].notes);
  const [bpm, setBpm] = useState<number>(90);
  const [selectedTonalityOffset, setSelectedTonalityOffset] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);

  // Conversor Text-to-Melody
  const [inputText, setInputText] = useState<string>('Pa-ra-béns pra vo-cê');
  const [scaleMode, setScaleMode] = useState<'major' | 'pentatonic' | 'blues' | 'bossa'>('pentatonic');

  // Filtro da Biblioteca de Licks
  const [selectedGenre, setSelectedGenre] = useState<PhrasingGenre | 'all'>('all');

  // ── Armazenamento Soberano Local do Estúdio ──
  const studioStorage = useStudioStorage();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [storageFeedback, setStorageFeedback] = useState<string | null>(null);

  const handleSavePhrase = useCallback(async () => {
    if (!studioStorage.folderInfo?.isAvailable) {
      setIsProjectModalOpen(true);
      return;
    }

    try {
      if (currentProjectId) {
        await studioStorage.saveProject({
          id: currentProjectId,
          module: 'phrase',
          title: currentLickTitle,
          data: {
            notes,
            bpm,
            tonalityOffset: selectedTonalityOffset,
          },
          metadata: {
            bpm,
            notesCount: notes.length,
            genre: selectedGenre === 'all' ? 'Lick' : selectedGenre,
          },
        });
        setStorageFeedback('Frase salva com sucesso no disco!');
        setTimeout(() => setStorageFeedback(null), 3000);
      } else {
        const res = await studioStorage.createProject({
          module: 'phrase',
          title: currentLickTitle,
          category: selectedGenre === 'all' ? 'Lick' : selectedGenre,
          data: {
            notes,
            bpm,
            tonalityOffset: selectedTonalityOffset,
          },
          metadata: {
            bpm,
            notesCount: notes.length,
            genre: selectedGenre === 'all' ? 'Lick' : selectedGenre,
          },
        });
        setCurrentProjectId(res.item.id);
        setStorageFeedback(`Frase salva: ${res.item.relativePath}`);
        setTimeout(() => setStorageFeedback(null), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStorageFeedback(`Erro ao salvar frase: ${msg}`);
      setTimeout(() => setStorageFeedback(null), 4000);
    }
  }, [studioStorage, currentProjectId, currentLickTitle, notes, bpm, selectedTonalityOffset, selectedGenre]);

  const handleOpenPhrase = useCallback((_path: string, envelope: StudioProjectEnvelope<any>) => {
    const data = envelope.data;
    if (data && Array.isArray(data.notes)) {
      setNotes(data.notes);
      if (data.bpm) setBpm(data.bpm);
      if (data.tonalityOffset !== undefined) setSelectedTonalityOffset(data.tonalityOffset);
      setCurrentLickTitle(envelope.title);
      setCurrentProjectId(envelope.id);
      setStorageFeedback(`Frase "${envelope.title}" carregada.`);
      setTimeout(() => setStorageFeedback(null), 3000);
    }
  }, []);

  const handleCreateNewPhrase = useCallback(async (title: string) => {
    const blankNotes = PHRASING_LICKS[0].notes;
    setCurrentLickTitle(title);
    setNotes(blankNotes);
    if (studioStorage.folderInfo?.isAvailable) {
      try {
        const res = await studioStorage.createProject({
          module: 'phrase',
          title,
          data: {
            notes: blankNotes,
            bpm,
            tonalityOffset: 0,
          },
          metadata: {
            bpm,
            notesCount: blankNotes.length,
          },
        });
        setCurrentProjectId(res.item.id);
      } catch (err) {
        console.warn('Falha ao registrar nova frase:', err);
      }
    }
    setStorageFeedback(`Nova frase criada: ${title}`);
    setTimeout(() => setStorageFeedback(null), 3000);
  }, [studioStorage, bpm]);

  const handleSavePhraseAs = useCallback(async (newTitle: string) => {
    if (!studioStorage.folderInfo?.isAvailable) {
      setIsProjectModalOpen(true);
      return;
    }
    try {
      const res = await studioStorage.saveProjectAs({
        originalId: currentProjectId || 'temp',
        module: 'phrase',
        newTitle,
        data: {
          notes,
          bpm,
          tonalityOffset: selectedTonalityOffset,
        },
        metadata: {
          bpm,
          notesCount: notes.length,
        },
      });
      setCurrentProjectId(res.item.id);
      setCurrentLickTitle(newTitle);
      setStorageFeedback(`Cópia salva como "${newTitle}"`);
      setTimeout(() => setStorageFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStorageFeedback(`Erro ao salvar como: ${msg}`);
      setTimeout(() => setStorageFeedback(null), 4000);
    }
  }, [studioStorage, currentProjectId, notes, bpm, selectedTonalityOffset]);

  // ── Envelope atual do projeto para o StudioImportExportBar ──────────────────

  const currentEnvelope = useMemo((): StudioProjectEnvelope<unknown> => ({
    id: currentProjectId ?? `local_${Date.now()}`,
    title: currentLickTitle,
    module: 'phrase',
    category: selectedGenre === 'all' ? 'Lick' : selectedGenre,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: { bpm, notesCount: notes.length, tonalityOffset: selectedTonalityOffset },
    data: { notes, bpm, tonalityOffset: selectedTonalityOffset },
  }), [currentProjectId, currentLickTitle, selectedGenre, bpm, notes, selectedTonalityOffset]);

  /** Reconstrói a frase no editor a partir de um envelope importado. */
  const handleImportPhrase = useCallback((envelope: StudioProjectEnvelope<unknown>, _format: ExportFormat) => {
    const data = envelope.data as { notes?: PhrasingNote[]; bpm?: number; tonalityOffset?: number };
    if (Array.isArray(data?.notes)) {
      setNotes(data.notes);
      if (data.bpm) setBpm(data.bpm);
      if (data.tonalityOffset !== undefined) setSelectedTonalityOffset(data.tonalityOffset);
      setCurrentLickTitle(envelope.title);
      setCurrentProjectId(envelope.id);
    }
  }, []);

  // Timers de Playback
  const playbackTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const loopIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPlaybackTimers = () => {
    playbackTimeoutsRef.current.forEach(t => clearTimeout(t));
    playbackTimeoutsRef.current = [];
    if (loopIntervalRef.current) {
      clearTimeout(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPlaybackTimers();
      soundEngine.stopAllNotes();
    };
  }, []);

  // Executa uma única vez a sequência de notas
  const playSequence = (notesToPlay: PhrasingNote[], onFinish?: () => void) => {
    clearPlaybackTimers();
    soundEngine.stopAllNotes();

    const beatDurationMs = (60 / bpm) * 1000;
    let accumulatedMs = 0;

    notesToPlay.forEach((note, idx) => {
      const startMs = accumulatedMs;
      const durationMs = note.duration * beatDurationMs;

      // Fator de corte da articulação: staccato (50%), tenuto (100%), legato (105%), normal (85%)
      let articulationFactor = 0.85;
      if (note.articulation === 'staccato') articulationFactor = 0.45;
      if (note.articulation === 'legato') articulationFactor = 1.05;
      if (note.articulation === 'tenuto') articulationFactor = 0.98;

      const soundingDurationMs = durationMs * articulationFactor;
      const velocity = note.articulation === 'accent' ? 0.95 : 0.75;

      const startTimeout = setTimeout(() => {
        setActiveNoteIndex(idx);
        soundEngine.playPianoNote(note.midi, velocity, undefined, soundingDurationMs / 1000);
      }, startMs);

      playbackTimeoutsRef.current.push(startTimeout);
      accumulatedMs += durationMs;
    });

    const finishTimeout = setTimeout(() => {
      setActiveNoteIndex(null);
      onFinish?.();
    }, accumulatedMs + 100);

    playbackTimeoutsRef.current.push(finishTimeout);
  };

  // Inicia ou Para a reprodução
  const handleTogglePlay = () => {
    if (isPlaying) {
      clearPlaybackTimers();
      soundEngine.stopAllNotes();
      setIsPlaying(false);
      setActiveNoteIndex(null);
    } else {
      setIsPlaying(true);
      const loopStep = () => {
        playSequence(notes, () => {
          if (isLooping) {
            loopIntervalRef.current = setTimeout(loopStep, 400); // 400ms de respiro entre loops
          } else {
            setIsPlaying(false);
            setActiveNoteIndex(null);
          }
        });
      };
      loopStep();
    }
  };

  // Transposição Tonal Instantânea
  const handleSelectTonality = (semitones: number) => {
    const diff = semitones - selectedTonalityOffset;
    setSelectedTonalityOffset(semitones);
    const transposed = transposePhrase(notes, diff);
    setNotes(transposed);

    if (isPlaying) {
      clearPlaybackTimers();
      playSequence(transposed);
    }
  };

  // Conversão Text-to-Melody a partir do input do usuário
  const handleConvertText = (overrideText?: string) => {
    const textToProcess = overrideText || inputText;
    if (!textToProcess.trim()) return;

    clearPlaybackTimers();
    soundEngine.stopAllNotes();
    setIsPlaying(false);
    setActiveNoteIndex(null);

    const generatedNotes = convertTextToMelody(textToProcess, {
      rootMidi: 60 + selectedTonalityOffset,
      scaleType: scaleMode,
      defaultDuration: 0.5,
    });

    if (generatedNotes.length > 0) {
      setNotes(generatedNotes);
      setCurrentLickTitle(`Frase: "${textToProcess.substring(0, 24)}"`);
      // Dá uma prévia sonora imediata
      playSequence(generatedNotes);
    }
  };

  // Carrega um Lick da biblioteca curada
  const handleLoadLick = (lick: PhrasingLick) => {
    clearPlaybackTimers();
    soundEngine.stopAllNotes();
    setIsPlaying(false);
    setActiveNoteIndex(null);

    setCurrentLickTitle(lick.title);
    setBpm(lick.bpm);
    setSelectedTonalityOffset(0);

    // Ajusta o dedilhado e notas
    const updatedNotes = lick.notes.map(n => ({ ...n }));
    setNotes(updatedNotes);

    // Reproduz automaticamente para o usuário ouvir
    playSequence(updatedNotes);
  };

  // Edição manual de nota
  const handlePitchChange = (noteId: string, delta: number) => {
    setNotes(prev => {
      const updated = prev.map(n => {
        if (n.id === noteId) {
          const newMidi = Math.max(36, Math.min(96, n.midi + delta));
          const info = getNoteInfo(newMidi, false, octaveStandard);
          return { ...n, midi: newMidi, noteName: info.fullName };
        }
        return n;
      });
      // Atualiza dedilhado
      const fingerings = calculateErgonomicFingering(updated);
      return updated.map((n, idx) => ({ ...n, fingering: fingerings[idx] }));
    });
  };

  const handleSyllableChange = (noteId: string, syllable: string) => {
    setNotes(prev => prev.map(n => (n.id === noteId ? { ...n, syllable } : n)));
  };

  const handleArticulationChange = (noteId: string, articulation: PhrasingArticulation) => {
    setNotes(prev => prev.map(n => (n.id === noteId ? { ...n, articulation } : n)));
  };

  const handleDeleteNote = (noteId: string) => {
    if (notes.length <= 1) return;
    setNotes(prev => {
      const filtered = prev.filter(n => n.id !== noteId);
      const fingerings = calculateErgonomicFingering(filtered);
      return filtered.map((n, idx) => ({ ...n, fingering: fingerings[idx] }));
    });
  };

  const handleAddNote = () => {
    const last = notes[notes.length - 1];
    const newMidi = last ? last.midi : 60;
    const newBeat = last ? last.beat + last.duration : 0;
    const info = getNoteInfo(newMidi, false, octaveStandard);

    const newNote: PhrasingNote = {
      id: `pnote-new-${Date.now()}`,
      midi: newMidi,
      noteName: info.fullName,
      duration: 0.5,
      syllable: 'Lá',
      beat: newBeat,
      articulation: 'normal',
    };

    setNotes(prev => {
      const updated = [...prev, newNote];
      const fingerings = calculateErgonomicFingering(updated);
      return updated.map((n, idx) => ({ ...n, fingering: fingerings[idx] }));
    });
  };

  // Filtragem de licks
  const filteredLicks = useMemo(() => {
    if (selectedGenre === 'all') return PHRASING_LICKS;
    return PHRASING_LICKS.filter(l => l.genre === selectedGenre);
  }, [selectedGenre]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 space-y-3">
      {/* ── 0. Barra Soberana da Pasta do Usuário ── */}
      <StudioFolderBar onOpenCatalog={() => setIsProjectModalOpen(true)} />

      {/* Toast de Feedback */}
      {storageFeedback && (
        <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{storageFeedback}</span>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col min-h-0 bg-[#070b16] rounded-2xl border border-white/5 shadow-2xl overflow-hidden text-slate-100 select-none">
        {/* ── 1. CABEÇALHO CONTEXTUAL DA FERRAMENTA (Linha Única 52px) ── */}
        <div className="h-[52px] px-4 bg-[#0a1024] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black font-display text-white tracking-wide truncate">
                  Editor de Fraseados &amp; Text-to-Melody
                </h2>
                <span className="hidden md:inline px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                  ESTÚDIO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate">
                {currentLickTitle} • {notes.length} notas
              </p>
            </div>
          </div>

          {/* Controles de Transporte e Áudio */}
          <div className="flex items-center gap-2">
            {/* Ações Soberanas do Estúdio */}
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="h-8 px-2.5 rounded-xl border border-purple-500/40 bg-purple-600/20 text-purple-200 hover:bg-purple-600/35 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-600/20"
              title="Abrir Catálogo de Frases na Pasta Soberana"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Catálogo</span>
            </button>

            <button
              type="button"
              onClick={handleSavePhrase}
              className="h-8 px-2.5 rounded-xl border border-emerald-500/40 bg-emerald-600/20 text-emerald-200 hover:bg-emerald-600/35 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Salvar Frase no Disco"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salvar</span>
            </button>

            {/* Importar / Exportar */}
            <StudioImportExportBar
              module="phrase"
              projectTitle={currentLickTitle}
              envelope={currentEnvelope}
              existingManifestItems={studioStorage.manifest?.modules.phrases ?? []}
              onImport={handleImportPhrase}
            />

            {/* Seletor de Timbre */}
            <div className="hidden lg:block">
              <TimbreSelector />
            </div>

          {/* Controle de BPM */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <input
              type="number"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(Math.max(40, Math.min(240, Number(e.target.value))))}
              className="w-12 bg-transparent text-center font-bold text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">BPM</span>
          </div>

          {/* Botão de Loop Contínuo */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`h-8 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isLooping
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 ring-1 ring-purple-400 shadow-sm shadow-purple-500/30'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isLooping ? 'Loop Ativo: repete continuamente' : 'Loop Desativado'}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Loop</span>
          </button>

          {/* Botão Play / Pause Principal */}
          <button
            onClick={handleTogglePlay}
            className={`h-8 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Ouvir Frase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 2. SELETOR DE TRANSPOSIÇÃO TONAL (12 TONS) ── */}
      <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono font-bold text-purple-300 flex items-center gap-1 shrink-0">
          <span>Transposição:</span>
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {TONALITIES.map((ton) => (
            <button
              key={ton.semitones}
              onClick={() => handleSelectTonality(ton.semitones)}
              className={`px-2 py-0.8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedTonalityOffset === ton.semitones
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-300'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {ton.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. ÁREA DE CONTEÚDO PRINCIPAL (SCROLL FULL-WIDTH) ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* ── SEÇÃO A: CONVERSOR TEXT-TO-MELODY (SÍLABAS EM NOTAS) ── */}
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black/40 border border-purple-500/25 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span>Conversor de Sílabas &amp; Solfejo em Melodia (Text-to-Melody)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Digite uma frase, letra de música ou solfejo (Dó, Ré, Mi...) para gerar o fraseado automaticamente.
              </p>
            </div>

            {/* Seletor de Modo Melódico */}
            <div className="flex items-center bg-black/60 p-0.5 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setScaleMode('pentatonic')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  scaleMode === 'pentatonic' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pentatônica
              </button>
              <button
                onClick={() => setScaleMode('blues')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  scaleMode === 'blues' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Blues
              </button>
              <button
                onClick={() => setScaleMode('bossa')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  scaleMode === 'bossa' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bossa
              </button>
              <button
                onClick={() => setScaleMode('major')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  scaleMode === 'major' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Maior
              </button>
            </div>
          </div>

          {/* Campo de Entrada de Texto + Botão de Ação */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConvertText();
              }}
              placeholder="Digite a frase com ou sem hífens (ex: Eu sei que vou te a-mar / do re mi fa sol la si do)"
              className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />

            <button
              onClick={() => handleConvertText()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Fraseado</span>
            </button>
          </div>

          {/* Presets Rápidos de Frases Populares */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 font-mono">Exemplos rápidos:</span>
            {[
              { label: 'Dó Ré Mi Fá Sol Lá Si', text: 'do re mi fa sol la si do' },
              { label: 'Parabéns pra você', text: 'Pa-ra-béns pra vo-cê nes-ta da-ta' },
              { label: 'Eu sei que vou te amar', text: 'Eu sei que vou te a-mar por to-da a mi-nha vi-da' },
              { label: 'Garota de Ipanema', text: 'O-lha que coi-sa mais lin-da mais chei-a de gra-ça' },
              { label: 'Aleluia', text: 'A-le-lu-ia a-le-lu-ia' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p.text);
                  handleConvertText(p.text);
                }}
                className="px-2.5 py-0.8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── SEÇÃO B: EDITOR VISUAL DE NOTAS, SÍLABAS & DEDILHADO ── */}
        <section className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Pauta de Fraseado Melódico
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                (Dedilhado • Altura • Articulação • Sílaba)
              </span>
            </div>

            <button
              onClick={handleAddNote}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Nota</span>
            </button>
          </div>

          {/* Cards Interativos de Cada Nota da Frase */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 pt-2">
            {notes.map((note, idx) => {
              const isCurrent = activeNoteIndex === idx;
              return (
                <div
                  key={note.id}
                  className={`w-28 sm:w-32 p-3 rounded-2xl border transition-all flex flex-col justify-between shrink-0 ${
                    isCurrent
                      ? 'bg-purple-900/40 border-purple-400 ring-2 ring-purple-400 shadow-xl scale-105'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top: Dedilhado Recomendado (1 a 5) */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Dedo:</span>
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center">
                      {note.fingering || 1}
                    </span>
                  </div>

                  {/* Centro: Nome da Nota + Ajuste de Altura */}
                  <div className="my-2 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handlePitchChange(note.id, -1)}
                        className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                        title="Descer 1 semitom"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-lg text-white">
                        {note.noteName}
                      </span>
                      <button
                        onClick={() => handlePitchChange(note.id, 1)}
                        className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                        title="Subir 1 semitom"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      {note.duration === 1 ? '1 tempo' : note.duration === 0.5 ? '½ tempo' : `${note.duration}t`}
                    </div>
                  </div>

                  {/* Articulação (Legato, Staccato, Acento, Normal) */}
                  <div className="space-y-1.5 pt-1 border-t border-white/5">
                    <select
                      value={note.articulation || 'normal'}
                      onChange={(e) => handleArticulationChange(note.id, e.target.value as PhrasingArticulation)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-1.5 py-0.8 text-[10px] font-mono text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="normal">Normal</option>
                      <option value="legato">⌒ Legato</option>
                      <option value="staccato">• Staccato</option>
                      <option value="accent">&gt; Acento</option>
                      <option value="tenuto">- Tenuto</option>
                    </select>

                    {/* Sílaba Editável */}
                    <input
                      type="text"
                      value={note.syllable || ''}
                      onChange={(e) => handleSyllableChange(note.id, e.target.value)}
                      placeholder="Sílaba"
                      className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-2 py-1 text-center text-xs font-bold text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                    />

                    {/* Botão Excluir Nota */}
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="w-full py-0.5 text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer text-center"
                      title="Excluir nota"
                    >
                      remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SEÇÃO C: BIBLIOTECA DE LICKS CURADOS POR GÊNERO ── */}
        <section className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Biblioteca de Licks &amp; Clichês Musicais por Gênero</span>
              </h3>
              <p className="text-xs text-slate-400">
                Frases autênticas gravadas na história do Blues, Jazz, Bossa Nova, Pop e Clássico.
              </p>
            </div>

            {/* Filtros de Gênero */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'blues', label: 'Blues & Rock' },
                { id: 'jazz', label: 'Jazz & Bebop' },
                { id: 'bossa', label: 'Bossa Nova' },
                { id: 'pop', label: 'Pop & R&B' },
                { id: 'classical', label: 'Clássico' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedGenre === g.id
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cards de Licks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLicks.map((lick) => (
              <div
                key={lick.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {lick.genreLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tom: {lick.key} • {lick.bpm} BPM
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white">{lick.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lick.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {lick.notes.length} notas • {lick.difficulty}
                  </span>

                  <button
                    onClick={() => handleLoadLick(lick)}
                    className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                  >
                    <span>Carregar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

      {/* ── Modal Soberano de Projetos ── */}
      <StudioProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        activeModule="phrase"
        currentProjectId={currentProjectId}
        onOpenProject={handleOpenPhrase}
        onCreateNewProject={handleCreateNewPhrase}
        onSaveCurrentAs={handleSavePhraseAs}
      />
    </div>
  );
};
