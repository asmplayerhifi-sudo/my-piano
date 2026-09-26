import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { REPERTOIRE_SONGS } from '../../core/repertoireData';
import type { RepertoireSong } from '../../core/repertoireData';
import { ScrollingScoreCanvas } from './ScrollingScoreCanvas';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { RepertoireCatalogModal } from './RepertoireCatalogModal';
import { RepertoireAccuracyModal } from './RepertoireAccuracyModal';
import { TimbreSelector } from '../audio/TimbreSelector';
import { soundEngine } from '../../core/soundEngine';
import { METRONOME_SOUND_OPTIONS, type MetronomeSoundType } from '../../core/accompanimentSynthesizer';
import { metronomeEngine, useMetronome } from '../../core/metronomeEngine';
import { musicalPlaybackEngine } from '../../core/musicalPlaybackEngine';
import { useOctaveStandard, octaveConfigStore } from '../../core/octaveConfigStore';
import { computeNoteOffsets } from './scrolling/scoreGeometry';
import { useFullscreen } from '../../hooks/useFullscreen';
import type { ScoreSustainMode, DetailedMidiInput } from './scrolling/types';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Lightbulb,
  Gauge,
  ChevronDown,
  Expand,
  Shrink,
  ShieldCheck,
  Repeat,
  Square,
  Volume2,
  VolumeX,
  Sparkles,
  Guitar,
  Layers,
  CheckCircle2,
  Target,
  AlertCircle,
  Trophy,
  Mic2,
} from 'lucide-react';

import {
  generateGuitarArrangementForKeyboard,
  getGuitarArrangementInfo,
  getRecommendedGuitarTimbre,
} from '../../core/guitarArrangementEngine';
import { GuitarChordStrip } from '../guitar/GuitarChordDiagram';
import { getCachedEnrichment } from '../../core/repertoireLyricEnricher';

export const RepertoireView: React.FC = () => {
  const [activeSong, setActiveSong] = useState<RepertoireSong>(REPERTOIRE_SONGS[0]);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(REPERTOIRE_SONGS[0].recommendedBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number>(0);
  const [lastMidiEvent, setLastMidiEvent] = useState<DetailedMidiInput | null>(null);
  const [activeDemoMidi, setActiveDemoMidi] = useState<number[]>([]);
  const [micHearingMidi, setMicHearingMidi] = useState<number | null>(null);
  const { isFullscreen: isFullscreenStage, toggleFullscreen: toggleFullscreenStage } = useFullscreen();

  // Modo de Execução: 'playback' (Ouvir Demonstração Sonora) vs 'practice' (Modo Prática Interativo)
  const [viewMode, setViewMode] = useState<'playback' | 'practice'>('playback');
  const [practiceType, setPracticeType] = useState<'wait' | 'flow'>('wait');
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [practiceHits, setPracticeHits] = useState<number>(0);
  const [practiceErrors, setPracticeErrors] = useState<number>(0);
  const [practiceScore, setPracticeScore] = useState<number>(0);
  const [practiceLastErrorMidi, setPracticeLastErrorMidi] = useState<number | null>(null);
  const [enableGuideAudio, setEnableGuideAudio] = useState<boolean>(true);
  const [activeMidiKeys, setActiveMidiKeys] = useState<Set<number>>(new Set());
  const [micAcousticNotes, setMicAcousticNotes] = useState<number[]>([]);
  const [_currentStepIndices, setCurrentStepIndices] = useState<number[]>([]);
  const [satisfiedStepIndices, setSatisfiedStepIndices] = useState<Set<number>>(new Set());
  const [practiceResetKey, setPracticeResetKey] = useState<number>(0);
  const [showPracticeCompletionModal, setShowPracticeCompletionModal] = useState<boolean>(false);

  // Modo de Arranjo: 'piano' (Pianístico Tradicional) vs 'guitar' (Violão no Teclado)
  const [arrangementMode, setArrangementMode] = useState<'piano' | 'guitar'>('piano');
  const [showGuitarDiagrams, setShowGuitarDiagrams] = useState<boolean>(true);
  const [showGuitarToast, setShowGuitarToast] = useState<boolean>(false);

  // Estado de visibilidade e persistência do Card de Letras Sincronizadas
  const [showLyrics, setShowLyrics] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('harmonia_repertoire_show_lyrics');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleShowLyrics = useCallback(() => {
    setShowLyrics((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('harmonia_repertoire_show_lyrics', String(next));
      } catch {
        // Ignora erros de localStorage
      }
      return next;
    });
  }, []);

  // Monitoramento contínuo em tempo real do beat musical para sincronização da letra
  const [playbackBeat, setPlaybackBeat] = useState<number>(1);
  const [playbackMeasure, setPlaybackMeasure] = useState<number>(1);

  useEffect(() => {
    const unsub = musicalPlaybackEngine.onPositionTick((pos) => {
      setPlaybackBeat(pos.currentBeat + 1);
      setPlaybackMeasure(pos.currentMeasure);
    });
    return unsub;
  }, []);

  // Modos de Finalização da Reprodução: 'end' (cessa no final real da música) ou 'repeat' (loop contínuo)
  const [playbackEndMode, setPlaybackEndMode] = useState<'end' | 'repeat'>('end');

  // Sustain Musical Real Exclusivo no Modo Reprodução:
  // 'off'    = staccato puro sem sustain (padrão oficial)
  // 'notes'  = sustenta apenas notas individuais melódicas com legato de pedal
  // 'chords' = sustenta apenas notas da harmonia/acordes até a troca de acorde
  // 'all'    = sustenta notas melódicas e acordes simultaneamente (pedal pleno)
  const [sustainOption, setSustainOption] = useState<ScoreSustainMode>('off');

  // Metrônomo Musical Conectado ao Engine Global
  const metronome = useMetronome();
  const [mobileContextTab, setMobileContextTab] = useState<'context' | 'tips' | 'chords' | 'guitar'>('context');

  const octaveStandard = useOctaveStandard();

  const [showCompletionBanner, setShowCompletionBanner] = useState<boolean>(false);

  // Metadados do arranjo de violão
  const guitarInfo = useMemo(() => {
    return getGuitarArrangementInfo(activeSong);
  }, [activeSong]);

  // Faixa de notas ativas: pianística original ou transcrição idiomática de violão
  const rawScoreTrack = useMemo(() => {
    if (arrangementMode === 'guitar') {
      return generateGuitarArrangementForKeyboard(activeSong);
    }
    return activeSong.scoreTrack;
  }, [activeSong, arrangementMode]);

  // Sincroniza sustain com o motor musical unificado
  const handleSustainOptionChange = (mode: ScoreSustainMode) => {
    setSustainOption(mode);
    musicalPlaybackEngine.setSustainMode(mode);
  };

  // Sincroniza modo de finalização (fim/repetição) em tempo real sem interromper playback
  useEffect(() => {
    musicalPlaybackEngine.setLoopMode(playbackEndMode);
  }, [playbackEndMode]);

  // Atualiza tempo recomendado ao trocar de música
  const handleSelectSong = (song: RepertoireSong) => {
    setShowCompletionBanner(false);
    setShowPracticeCompletionModal(false);
    soundEngine.stopAllNotes(0.025);
    musicalPlaybackEngine.stop();
    setIsPlaying(false);
    setIsPracticing(false);
    setActiveDemoMidi([]);
    setCurrentNoteIdx(0);
    setSatisfiedStepIndices(new Set());
    setPracticeHits(0);
    setPracticeErrors(0);
    setPracticeScore(0);
    setActiveSong(song);
    setTempo(song.recommendedBpm);
    metronomeEngine.setBpm(song.recommendedBpm);
    metronomeEngine.setTimeSignature(song.timeSignature);

    if (arrangementMode === 'guitar') {
      const recTimbre = getRecommendedGuitarTimbre(song.genre);
      soundEngine.setTimbre(recTimbre);
    }

    const activeTrack = arrangementMode === 'guitar'
      ? generateGuitarArrangementForKeyboard(song)
      : song.scoreTrack;
    musicalPlaybackEngine.loadScore(activeTrack, song.timeSignature, song.recommendedBpm);
  };

  // Alternador de Modo de Arranjo: Teclado/Piano vs Violão no Teclado
  const handleArrangementModeToggle = async (mode: 'piano' | 'guitar') => {
    if (mode === arrangementMode) return;
    await soundEngine.ensureAudioReady();
    soundEngine.stopAllNotes(0.025);
    musicalPlaybackEngine.stop();
    setIsPlaying(false);
    setIsPracticing(false);
    setActiveDemoMidi([]);
    setCurrentNoteIdx(0);
    setSatisfiedStepIndices(new Set());
    setArrangementMode(mode);

    if (mode === 'guitar') {
      const recTimbre = getRecommendedGuitarTimbre(activeSong.genre);
      soundEngine.setTimbre(recTimbre);
      setShowGuitarToast(true);
      setTimeout(() => setShowGuitarToast(false), 5000);
    } else {
      soundEngine.setTimbre('grand_piano');
      setShowGuitarToast(false);
    }

    const nextTrack = mode === 'guitar'
      ? generateGuitarArrangementForKeyboard(activeSong)
      : activeSong.scoreTrack;
    musicalPlaybackEngine.loadScore(nextTrack, activeSong.timeSignature, tempo);
  };

  const handleSwitchViewMode = async (mode: 'playback' | 'practice') => {
    if (mode === viewMode) return;
    await soundEngine.ensureAudioReady();
    soundEngine.stopAllNotes(0.025);
    musicalPlaybackEngine.stop();
    setIsPlaying(false);
    setIsPracticing(false);
    setActiveDemoMidi([]);
    setCurrentNoteIdx(0);
    setSatisfiedStepIndices(new Set());
    setPracticeHits(0);
    setPracticeErrors(0);
    setPracticeScore(0);
    setPracticeLastErrorMidi(null);
    setViewMode(mode);
  };

  const handleTogglePractice = async () => {
    await soundEngine.ensureAudioReady();
    if (isPracticing) {
      setIsPracticing(false);
      musicalPlaybackEngine.pause();
    } else {
      setShowPracticeCompletionModal(false);
      const startIdx = currentNoteIdx >= sortedScoreTrack.length ? 0 : currentNoteIdx;
      if (startIdx !== currentNoteIdx) {
        setCurrentNoteIdx(0);
      }
      setIsPracticing(true);
      if (practiceType === 'flow') {
        musicalPlaybackEngine.loadScore(sortedScoreTrack, activeSong.timeSignature, tempo);
        musicalPlaybackEngine.setSustainMode(sustainOption);
        musicalPlaybackEngine.setMetronomeEnabled(metronome.isPlaying);
        musicalPlaybackEngine.setAudioEnabled(enableGuideAudio);
        musicalPlaybackEngine.setLoopMode(playbackEndMode);
        const startBeat = noteOffsets[startIdx] ?? 0;
        musicalPlaybackEngine.play(startBeat);
      } else {
        musicalPlaybackEngine.pause();
      }
    }
  };

  const handleSelectPracticeType = (type: 'wait' | 'flow') => {
    if (type === practiceType) return;
    setPracticeType(type);
    setSatisfiedStepIndices(new Set());

    if (isPracticing) {
      if (type === 'wait') {
        musicalPlaybackEngine.pause();
      } else {
        musicalPlaybackEngine.loadScore(sortedScoreTrack, activeSong.timeSignature, tempo);
        musicalPlaybackEngine.setSustainMode(sustainOption);
        musicalPlaybackEngine.setMetronomeEnabled(metronome.isPlaying);
        musicalPlaybackEngine.setAudioEnabled(enableGuideAudio);
        musicalPlaybackEngine.setLoopMode(playbackEndMode);
        const startIdx = currentNoteIdx >= sortedScoreTrack.length ? 0 : currentNoteIdx;
        const startBeat = noteOffsets[startIdx] ?? 0;
        musicalPlaybackEngine.play(startBeat);
      }
    }
  };

  const handleResetPractice = () => {
    setShowPracticeCompletionModal(false);
    setIsPracticing(false);
    musicalPlaybackEngine.stop();
    setCurrentNoteIdx(0);
    setSatisfiedStepIndices(new Set());
    setPracticeHits(0);
    setPracticeErrors(0);
    setPracticeScore(0);
    setPracticeLastErrorMidi(null);
    setPracticeResetKey((k) => k + 1);
  };

  useEffect(() => {
    if (practiceLastErrorMidi === null) return;
    const timer = setTimeout(() => {
      setPracticeLastErrorMidi(null);
    }, 1200);
    return () => clearTimeout(timer);
  }, [practiceLastErrorMidi]);

  const handleNoteInput = useCallback((midi: number, midis?: number[], chordName?: string) => {
    setLastMidiEvent({
      midi,
      midis: midis || [midi],
      chordName,
      timestamp: performance.now(),
    });
  }, []);

  // Garante que o scoreTrack esteja SEMPRE estritamente ordenado por compasso e tempo
  const sortedScoreTrack = useMemo(() => {
    const parts = activeSong.timeSignature.split('/');
    const num = parseInt(parts[0], 10) || 4;
    const den = parseInt(parts[1], 10) || 4;
    let bpm = num;
    if (den === 8 && num >= 6) bpm = num / 3;

    return [...rawScoreTrack].sort((a, b) => {
      const mA = Math.max(1, a.measure || 1);
      const mB = Math.max(1, b.measure || 1);
      const bA = (a.beat !== undefined ? Math.max(0, a.beat - 1) : 0);
      const bB = (b.beat !== undefined ? Math.max(0, b.beat - 1) : 0);
      const offA = (mA - 1) * bpm + bA;
      const offB = (mB - 1) * bpm + bB;

      if (Math.abs(offA - offB) > 0.001) {
        return offA - offB;
      }
      if (a.clef === 'bass' && b.clef !== 'bass') return -1;
      if (a.clef !== 'bass' && b.clef === 'bass') return 1;
      return (a.midi || 0) - (b.midi || 0);
    });
  }, [rawScoreTrack, activeSong.timeSignature]);

  // Pré-computa os tempos métricos exatos das notas para sincronização polifônica precisa
  const noteOffsets = useMemo(() => {
    return computeNoteOffsets(sortedScoreTrack, activeSong.timeSignature);
  }, [sortedScoreTrack, activeSong.timeSignature]);

  /**
   * Enriquecimento de letra: converte o modelo legado (LyricLine[]) para o modelo
   * estruturado (EnrichedLyricLine[]) com sílabas associadas a notas.
   * Recalcula apenas quando a música ativa muda.
   * Usa cache de sessão para evitar reprocessamento.
   */
  const activeSongEnrichedLyrics = useMemo(() => {
    const result = getCachedEnrichment(activeSong);
    if (result.syncLevel === 'unavailable') return undefined;
    if (result.enrichedLines.length === 0) return undefined;
    return result.enrichedLines;
  }, [activeSong]);

  /** Há letra disponível (enriquecida ou legado)? */
  const hasAnyLyrics = Boolean(
    (activeSongEnrichedLyrics && activeSongEnrichedLyrics.length > 0) ||
    (activeSong.extension?.lyrics && activeSong.extension.lyrics.length > 0)
  );

  // Dedo da nota atual em execução na partitura para a tag abaixo do teclado
  const currentSongTargetNote = sortedScoreTrack[currentNoteIdx] || sortedScoreTrack[0];

  // Compasso atual e offset métrico unificado da partitura
  const currentMeasure = currentSongTargetNote?.measure || 1;
  const currentTargetOffset = noteOffsets[currentNoteIdx] ?? 0;

  // Posição temporal precisa unificada para o Card de Letras:
  // Em playback contínuo: usa o beat analítico 60 FPS do motor musical (zero drift).
  // Em pausa ou modo prática (wait): usa o offset exato da nota/acorde aguardado (imutável até acerto).
  const isPlaybackActive = viewMode === 'playback' && isPlaying;
  const currentAbsoluteBeat = isPlaybackActive ? playbackBeat : (currentTargetOffset + 1);
  const effectiveMeasure = isPlaybackActive ? playbackMeasure : currentMeasure;

  // Passo ativo: identifica todas as notas do mesmo instante métrico (acordes e multi-mãos)
  const currentStepNotes = useMemo(() => {
    return sortedScoreTrack.filter(
      (_note, idx) => Math.abs((noteOffsets[idx] ?? 0) - currentTargetOffset) < 0.05
    );
  }, [sortedScoreTrack, noteOffsets, currentTargetOffset]);

  // Apontamento de dedos para as teclas do piano com foco em todas as notas ativas do passo
  const highlightedSongKeys = useMemo(() => {
    if (!currentStepNotes || currentStepNotes.length === 0) return [];

    return currentStepNotes.map((note) => {
      const idx = sortedScoreTrack.indexOf(note);
      const isSatisfied = satisfiedStepIndices.has(idx);
      const isBass = note.clef === 'bass' || note.midi < 60;
      const finger = note.fingerRightHand || note.fingerLeftHand || (isBass ? 5 : (note.midi === 60 ? 1 : 2));

      let keyColor = isBass ? '#38bdf8' : '#6366f1';
      if (arrangementMode === 'guitar') {
        keyColor = '#f59e0b';
      } else if (isSatisfied) {
        keyColor = '#10b981';
      } else if (!isBass) {
        keyColor = '#a855f7';
      }

      return {
        midi: note.midi,
        finger,
        color: keyColor,
      };
    });
  }, [currentStepNotes, sortedScoreTrack, satisfiedStepIndices, arrangementMode]);

  const activeFingerPrompt = useMemo(() => {
    if (!currentStepNotes || currentStepNotes.length === 0) return null;
    const names = ['', 'Polegar', 'Indicador', 'Médio', 'Anelar', 'Mínimo'];
    const colors = ['', '#f59e0b', '#38bdf8', '#10b981', '#c084fc', '#f43f5e'];

    if (currentStepNotes.length > 1) {
      const parts = currentStepNotes.map((n) => {
        const isBass = n.clef === 'bass' || n.midi < 60;
        const hand = isBass ? 'M.E.' : 'M.D.';
        const f = n.fingerRightHand || n.fingerLeftHand || (isBass ? 5 : (n.midi === 60 ? 1 : 2));
        const ptName = octaveConfigStore.midiToPtName(n.midi, octaveStandard);
        return `${hand}: Dedo ${f} (${ptName})`;
      });

      return {
        finger: 0,
        label: 'Acorde',
        fingerName: parts.join(' + '),
        noteName: currentStepNotes.map((n) => octaveConfigStore.midiToPtName(n.midi, octaveStandard)).join(' + '),
        color: '#f59e0b',
      };
    }

    const singleNote = currentStepNotes[0] || currentSongTargetNote;
    const fingerNum = singleNote.fingerRightHand || singleNote.fingerLeftHand;
    const hand = singleNote.clef === 'bass' || singleNote.midi < 60 ? 'ME' : 'MD';
    const f = fingerNum || (hand === 'MD' ? (singleNote.midi === 60 ? 1 : 2) : 5);

    let pimaLabel = '';
    if (arrangementMode === 'guitar') {
      if (singleNote.clef === 'bass') {
        pimaLabel = 'P (Polegar - Baixo)';
      } else if (f === 2) {
        pimaLabel = 'I (Indicador)';
      } else if (f === 3) {
        pimaLabel = 'M (Médio)';
      } else if (f === 4) {
        pimaLabel = 'A (Anelar)';
      } else if (f === 1) {
        pimaLabel = 'P (Polegar)';
      }
    }

    return {
      finger: f,
      label: `${f}`,
      fingerName: pimaLabel || (names[f] ? `Dedo ${f} (${names[f]})` : `Dedo ${f}`),
      noteName: octaveConfigStore.midiToPtName(singleNote.midi, octaveStandard),
      color: arrangementMode === 'guitar' ? '#f59e0b' : (colors[f] || '#38bdf8'),
    };
  }, [currentStepNotes, currentSongTargetNote, octaveStandard, arrangementMode]);

  const activeInputMidis = useMemo(() => {
    if (viewMode === 'playback' && isPlaying) {
      return activeDemoMidi;
    }
    return Array.from(
      new Set([
        ...Array.from(activeMidiKeys),
        ...(micHearingMidi !== null ? [micHearingMidi] : []),
        ...micAcousticNotes,
      ])
    );
  }, [viewMode, isPlaying, activeDemoMidi, activeMidiKeys, micHearingMidi, micAcousticNotes]);

  const correctKeyMidis = useMemo(() => {
    return currentStepNotes
      .filter((note) => satisfiedStepIndices.has(sortedScoreTrack.indexOf(note)))
      .map((note) => note.midi);
  }, [currentStepNotes, satisfiedStepIndices, sortedScoreTrack]);

  const errorKeyMidis = useMemo(() => {
    return practiceLastErrorMidi !== null ? [practiceLastErrorMidi] : [];
  }, [practiceLastErrorMidi]);

  const totalEvaluated = practiceHits + practiceErrors;
  const practiceAccuracy = totalEvaluated > 0 ? Math.round((practiceHits / totalEvaluated) * 100) : 100;

  // Controles de Reprodução Unificados pelo Motor Central (Single Source of Time)
  const handleTogglePlayPause = async () => {
    await soundEngine.ensureAudioReady();
    if (isPlaying) {
      musicalPlaybackEngine.pause();
      setIsPlaying(false);
      setActiveDemoMidi([]);
    } else {
      setShowCompletionBanner(false);
      musicalPlaybackEngine.loadScore(sortedScoreTrack, activeSong.timeSignature, tempo);
      musicalPlaybackEngine.setSustainMode(sustainOption);
      musicalPlaybackEngine.setMetronomeEnabled(metronome.isPlaying);
      musicalPlaybackEngine.setLoopMode(playbackEndMode);
      // Se a música atingiu o final, reinicia do primeiro compasso (Compasso 1, time 0.0s) com 1 clique (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.2)
      const startIdx = currentNoteIdx >= sortedScoreTrack.length ? 0 : currentNoteIdx;
      const startBeat = noteOffsets[startIdx] ?? 0;
      musicalPlaybackEngine.play(startBeat);
      setIsPlaying(true);
    }
  };

  const handleResetPlayback = () => {
    setShowCompletionBanner(false);
    musicalPlaybackEngine.stop();
    setIsPlaying(false);
    setActiveDemoMidi([]);
    setCurrentNoteIdx(0);
  };

  const handleTempoChange = (newTempo: number) => {
    const clamped = Math.max(30, Math.min(240, newTempo));
    setTempo(clamped);
    musicalPlaybackEngine.setBpm(clamped);
    metronomeEngine.setBpm(clamped);
  };

  const handleToggleMetronome = () => {
    const nextState = !metronome.isPlaying;
    musicalPlaybackEngine.setMetronomeEnabled(nextState);
    if (isPlaying) {
      if (nextState) {
        metronomeEngine.setPlaybackDriven(true);
        metronomeEngine.start({ bpm: tempo, timeSignature: activeSong.timeSignature });
      } else {
        metronomeEngine.setPlaybackDriven(false);
        metronomeEngine.stop();
      }
    } else {
      metronomeEngine.setPlaybackDriven(false);
      metronomeEngine.toggle({
        bpm: tempo,
        timeSignature: activeSong.timeSignature,
      });
    }
  };

  const viewModeRef = useRef(viewMode);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  // Sincronização estrita de ciclo de vida do player e evento de conclusão da obra (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.2)
  useEffect(() => {
    const unsubState = musicalPlaybackEngine.onStateChange((playing) => {
      setIsPlaying(playing);
      if (!playing) {
        setActiveDemoMidi([]);
      }
    });

    const unsubEnded = musicalPlaybackEngine.onTrackEnded(() => {
      setIsPlaying(false);
      setActiveDemoMidi([]);
      if (viewModeRef.current === 'practice') {
        setIsPracticing(false);
        setShowPracticeCompletionModal(true);
      } else {
        setCurrentNoteIdx(0);
        setShowCompletionBanner(true);
      }
    });

    return () => {
      unsubState();
      unsubEnded();
      musicalPlaybackEngine.stop();
      metronomeEngine.stop();
    };
  }, []);

  return (
    <div className="w-full space-y-3 select-none no-select">
      {/* 1. Barra de Acesso ao Catálogo e Controle Principal (Totalmente Fluida & Widescreen) */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-white/5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-[#130b24]/60 to-[#0a0718]/80 backdrop-blur-md">
        {/* Lado Esquerdo: Identificação da Música, Botão Catálogo e Botão Validador de Acurácia */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Botão que Abre o Modal com as Categorias e Músicas */}
          <button
            onClick={() => setIsCatalogModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-purple-500/30 shadow-lg shadow-purple-900/20 cursor-pointer transition-all active:scale-95 group shrink-0"
          >
            <Music className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span>Catálogo</span>
            <ChevronDown className="w-3.5 h-3.5 text-purple-300" />
          </button>

          {/* Botão do Validador de Acurácia Musical */}
          <button
            onClick={() => setIsAccuracyModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30 shadow-lg shadow-emerald-900/10 cursor-pointer transition-all active:scale-95 group shrink-0"
            title="Abrir Validador de Acurácia Musical da Partitura"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Acurácia</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 font-mono font-bold">100% OK</span>
          </button>

          {/* Nome e Dados da Música Ativa */}
          <div className="pl-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.2 rounded-md text-[9px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/20">
                {activeSong.genre}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeSong.tonality} • {activeSong.timeSignature}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-display text-white truncate max-w-lg">
              {activeSong.title}
            </h2>
            <p className="text-xs text-purple-300/80 font-medium truncate">
              {activeSong.composerOrArtist}
            </p>
          </div>
        </div>

        {/* Lado Direito: Controles Globais de Play / Pause, Timbre, Modo Fim/Loop, Sustain e Metrônomo */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Seletor de Modo de Arranjo: Teclado vs Violão no Teclado */}
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 shadow-lg shrink-0">
            <button
              onClick={() => handleArrangementModeToggle('piano')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                arrangementMode === 'piano'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Arranjo Pianístico / Teclado Tradicional"
            >
              <span>🎹 Arranjo Teclado</span>
            </button>
            <button
              onClick={() => handleArrangementModeToggle('guitar')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                arrangementMode === 'guitar'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-900/40 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
              title="Modo Arranjo de Violão no Teclado: Dedilhados (P-I-M-A), Baixarias de 7 Cordas e Batidas Rítmicas"
            >
              <Guitar className="w-3.5 h-3.5" />
              <span>🎸 Arranjo Violão no Teclado</span>
            </button>
          </div>

          {/* Seletor de Modo: Ouvir Demonstração vs Modo Prática Interativo */}
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 shadow-lg shrink-0">
            <button
              onClick={() => handleSwitchViewMode('playback')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'playback'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Demonstração Sonora: ouvir a obra musical com reprodução automática"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>🎧 Reproduzir</span>
            </button>
            <button
              onClick={() => handleSwitchViewMode('practice')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'practice'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
              title="Modo Prática Interativo: toque você mesmo as notas e acordes no teclado MIDI ou instrumento acústico"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>🎯 Modo Prática</span>
            </button>
          </div>

          {/* Seletor de Timbre */}
          <TimbreSelector compact />

          {/* Controles de Ação Conforme o Modo Ativo */}
          {viewMode === 'playback' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTogglePlayPause}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl font-black font-display text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                  isPlaying
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black shadow-emerald-500/20'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Reproduzir</span>
                  </>
                )}
              </button>

              {/* Alternador de Modo de Fim vs Repetição */}
              <button
                onClick={() => {
                  const nextMode = playbackEndMode === 'end' ? 'repeat' : 'end';
                  setPlaybackEndMode(nextMode);
                  musicalPlaybackEngine.setLoopMode(nextMode);
                }}
                className={`px-3 py-2 rounded-2xl border text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  playbackEndMode === 'repeat'
                    ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
                title={playbackEndMode === 'repeat' ? 'Modo Repetição (Loop contínuo após o fim)' : 'Modo Fim (Cessa após a última nota)'}
              >
                {playbackEndMode === 'repeat' ? (
                  <>
                    <Repeat className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden xl:inline">Repetição</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden xl:inline">Modo Fim</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetPlayback}
                className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5 cursor-pointer transition-colors"
                title="Reiniciar música do início"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Seletor de Tipo de Prática: Modo Espera vs Modo Fluido */}
              <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 text-xs shrink-0">
                <button
                  onClick={() => handleSelectPracticeType('wait')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    practiceType === 'wait'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo Espera: a partitura aguarda você tocar as notas e acordes corretos para avançar"
                >
                  Modo Espera
                </button>
                <button
                  onClick={() => handleSelectPracticeType('flow')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    practiceType === 'flow'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo Fluido: a partitura rola no andamento (BPM) e avalia sua precisão rítmica"
                >
                  Modo Fluido
                </button>
              </div>

              {/* Iniciar / Pausar Prática */}
              <button
                onClick={handleTogglePractice}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl font-black font-display text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                  isPracticing
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black shadow-purple-500/20'
                }`}
              >
                {isPracticing ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Praticar</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetPractice}
                className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5 cursor-pointer transition-colors"
                title="Reiniciar prática do início (Compasso 1)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Alternador de Áudio Guia da Partitura na Prática */}
              <button
                onClick={() => {
                  const next = !enableGuideAudio;
                  setEnableGuideAudio(next);
                  musicalPlaybackEngine.setAudioEnabled(next);
                }}
                className={`px-3 py-2 rounded-2xl border text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  enableGuideAudio
                    ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={enableGuideAudio ? 'Áudio Guia Ativo: a partitura soa no andamento para você tocar junto' : 'Áudio Guia Silenciado: apenas o som do seu instrumento e metrônomo'}
              >
                {enableGuideAudio ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden xl:inline">Áudio Guia</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden xl:inline">Mudo</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Ajuste de Andamento (BPM) */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Gauge className="w-3 h-3 text-purple-400" />
              <span>BPM:</span>
            </span>

            <button
              onClick={() => handleTempoChange(tempo - 5)}
              className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center cursor-pointer"
              title="-5 BPM"
            >
              -
            </button>

            <span className="text-xs font-bold font-mono text-purple-300 w-12 text-center">
              {tempo}
            </span>

            <button
              onClick={() => handleTempoChange(tempo + 5)}
              className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center cursor-pointer"
              title="+5 BPM"
            >
              +
            </button>
          </div>

          {/* Controle Real de Sustain (Exclusivo na Tela de Repertório / Modo Reprodução) */}
          <div className="flex items-center bg-black/50 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => handleSustainOptionChange('all')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sustain Pleno (Ambos): sustenta tanto as notas melódicas quanto os acordes da harmonia"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ Ambos</span>
            </button>

            <button
              onClick={() => handleSustainOptionChange('notes')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'notes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sustain Notas: sustenta as notas melódicas com legato natural de pedal"
            >
              <span>🎹 Notas</span>
            </button>

            <button
              onClick={() => handleSustainOptionChange('chords')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'chords'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sustain Acordes: sustenta todas as notas da harmonia até a troca para o próximo acorde"
            >
              <span>🎼 Acordes</span>
            </button>

            <button
              onClick={() => handleSustainOptionChange('off')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'off'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sem Sustain: execução staccato com corte seco"
            >
              <span>🔇 Desat.</span>
            </button>
          </div>

          {/* Metrônomo Musical Integrado com Visualizador de Pulsos */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={handleToggleMetronome}
              className={`p-1.5 px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                metronome.isPlaying
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-300'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
              title={metronome.isPlaying ? 'Metrônomo Ativo (Clique para Desligar)' : 'Ligar Metrônomo Sonoro'}
            >
              {metronome.isPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{metronome.isPlaying ? 'Metrônomo ON' : 'Metrônomo'}</span>
            </button>

            {/* LEDs de Batidas */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: metronome.beatsPerMeasure }, (_, i) => i + 1).map((b) => {
                const isCurrent = metronome.isPlaying && metronome.currentBeat === b;
                const isDown = b === 1;
                return (
                  <span
                    key={b}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold transition-all duration-75 ${
                      isCurrent
                        ? isDown
                          ? 'bg-amber-400 text-slate-950 scale-125 shadow-[0_0_10px_#fbbf24]'
                          : 'bg-indigo-400 text-slate-950 scale-110 shadow-[0_0_8px_#818cf8]'
                        : 'bg-white/10 text-slate-500'
                    }`}
                  >
                    {b}
                  </span>
                );
              })}
            </div>

            {metronome.isPlaying && (
              <>
                <select
                  value={metronome.soundType}
                  onChange={(e) => metronomeEngine.setSoundType(e.target.value as MetronomeSoundType)}
                  className="bg-black/60 text-[10px] text-amber-200 border border-white/10 rounded-lg px-1.5 py-0.5 font-mono cursor-pointer outline-none"
                  title="Timbre Musical do Metrônomo"
                >
                  {METRONOME_SOUND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metronome.volume}
                  onChange={(e) => metronomeEngine.setVolume(parseInt(e.target.value, 10))}
                  className="w-12 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  title={`Volume: ${metronome.volume}%`}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notificação Visual de Fim da Música (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.2) */}
      {showCompletionBanner && (
        <div className="p-3.5 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0a2318]/95 to-[#06150e]/90 border border-emerald-500/40 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-200">
                Música concluída! Precisão: 100%
              </span>
              <span className="text-emerald-400/80 ml-1.5 hidden md:inline">
                | Clique em <strong className="text-white font-bold">[▶ Reproduzir]</strong> para ouvir novamente.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => {
                setShowCompletionBanner(false);
                handleTogglePlayPause();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Reproduzir Novamente</span>
            </button>
            <button
              onClick={() => setShowCompletionBanner(false)}
              className="p-1.5 rounded-xl text-emerald-400/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Fechar notificação"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Toast Informativo do Modo Violão no Teclado */}
      {showGuitarToast && (
        <div className="p-3.5 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-[#261608]/95 to-[#120803]/90 border border-amber-500/40 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Guitar className="w-4 h-4 text-amber-400 animate-bounce" />
            </span>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-200">
                  Modo Arranjo de Violão no Teclado Ativado
                </span>
                <span className="px-2 py-0.2 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  {guitarInfo.styleBadge}
                </span>
              </div>
              <p className="text-amber-300/80 text-[11px] mt-0.5">
                Partitura adaptada com {guitarInfo.styleLabel}. Timbre selecionado:{' '}
                <strong className="text-white font-bold">{guitarInfo.recommendedTimbreName}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGuitarToast(false)}
            className="p-1.5 rounded-xl text-amber-400/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer self-end sm:self-auto"
            title="Fechar notificação"
          >
            ✕
          </button>
        </div>
      )}

      {/* Banner Persistente de Estilo e Técnica de Violão quando em Modo Violão */}
      {arrangementMode === 'guitar' && (
        <div className="p-3 px-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1a0f05]/60 to-[#0d0703]/80 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Guitar className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <div className="text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-amber-300">
                  {guitarInfo.styleLabel}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                  {guitarInfo.styleBadge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
                  • {guitarInfo.description}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {guitarInfo.techniqueSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={() => setShowGuitarDiagrams(!showGuitarDiagrams)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showGuitarDiagrams
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Exibir ou ocultar diagramas e tablaturas de acordes de violão"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{showGuitarDiagrams ? 'Ocultar Diagramas' : 'Ver Diagramas de Acordes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Palco Total: Partitura Deslizante (Widescreen 100% com Bordas Sutis) */}
      <div
        className={`glass-card rounded-3xl p-4 sm:p-5 border border-white/5 space-y-3 transition-all ${
          isFullscreenStage
            ? 'fixed inset-0 z-50 bg-[#080811] p-4 sm:p-8 overflow-y-auto m-0 rounded-none border-none shadow-2xl'
            : ''
        }`}
      >
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-purple-400">
              Palco de Execução &amp; Partitura
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              • {activeSong.title} ({activeSong.recommendedBpm} BPM) {arrangementMode === 'guitar' ? '• [🎸 Arranjo de Violão no Teclado]' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão Discreto: Exibir/Ocultar Letra Sincronizada */}
            {hasAnyLyrics && (
              <button
                onClick={toggleShowLyrics}
                className={`p-1.5 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showLyrics
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-1 ring-purple-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                }`}
                title={showLyrics ? 'Ocultar Letra Sincronizada' : 'Exibir Letra Sincronizada'}
              >
                <Mic2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{showLyrics ? 'Ocultar Letra' : 'Exibir Letra'}</span>
              </button>
            )}

            <button
              onClick={toggleFullscreenStage}
              className={`p-1.5 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isFullscreenStage
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
              }`}
              title={isFullscreenStage ? 'Sair da Tela Cheia (Esc)' : 'Tela Cheia no Palco de Execução'}
            >
              {isFullscreenStage ? (
                <>
                  <Shrink className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sair Tela Cheia (Esc)</span>
                </>
              ) : (
                <>
                  <Expand className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tela Cheia</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Painel Unificado do Modo Prática Interativo */}
        {viewMode === 'practice' && (
          <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-950/70 border border-purple-500/30 space-y-2.5 shadow-xl backdrop-blur-md animate-in fade-in duration-300">
            {/* Linha Superior: Identificação do Modo, Compasso e Métricas em Tempo Real */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-purple-300" />
                </span>
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>Modo Prática Ativo</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold">
                    {practiceType === 'wait' ? 'Modo Espera (Wait)' : 'Modo Fluido (Flow)'}
                  </span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-mono font-bold">
                  Compasso {currentMeasure}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden xl:inline">
                  • Multi-Mãos &amp; Acordes Sincronizados
                </span>
              </div>

              {/* Métricas em Tempo Real: Acurácia, Acertos, Erros, Pontos */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono text-slate-400">Acurácia:</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      practiceAccuracy >= 90
                        ? 'text-emerald-400'
                        : practiceAccuracy >= 70
                        ? 'text-cyan-300'
                        : 'text-amber-400'
                    }`}
                  >
                    {practiceAccuracy}%
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono text-slate-400">Acertos:</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">{practiceHits}</span>
                </div>

                <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-mono text-slate-400">Erros:</span>
                  <span className="text-xs font-mono font-bold text-rose-300">{practiceErrors}</span>
                </div>

                <div className="flex items-center gap-1 bg-purple-500/10 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono text-purple-300">Pontos:</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{practiceScore}</span>
                </div>
              </div>
            </div>

            {/* Linha Inferior: Toque no Passo Atual + Teclas Ouvidas */}
            {currentStepNotes.length > 0 && (
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Toque no Passo Atual:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentStepNotes.map((note) => {
                      const idx = sortedScoreTrack.indexOf(note);
                      const isSatisfied = satisfiedStepIndices.has(idx);
                      const isBass = note.clef === 'bass' || note.midi < 60;
                      const hand = isBass ? 'M.E.' : 'M.D.';
                      const finger = note.fingerRightHand || note.fingerLeftHand || (isBass ? 5 : (note.midi === 60 ? 1 : 2));
                      const ptName = octaveConfigStore.midiToPtName(note.midi, octaveStandard);

                      return (
                        <span
                          key={`${idx}-${note.midi}`}
                          className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 transition-all ${
                            isSatisfied
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 line-through decoration-emerald-400'
                              : isBass
                              ? 'bg-sky-500/20 border-sky-500/40 text-sky-200 animate-pulse'
                              : 'bg-purple-500/20 border-purple-500/40 text-purple-200 animate-pulse'
                          }`}
                        >
                          {isSatisfied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : null}
                          <span>
                            {hand} Dedo {finger} ({ptName})
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Teclas ouvidas agora em tempo real */}
                {activeInputMidis.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Ouvindo: {activeInputMidis.map((m) => octaveConfigStore.midiToPtName(m, octaveStandard)).join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Barra de Escuta Unificada (MIDI USB & Microfone Acústico) */}
        <MicrophonePitchBar
          disabled={viewMode === 'playback' && isPlaying}
          disabledMessage="Demonstração em reprodução: escuta do microfone e avaliação de performance desativadas (apenas demonstração sonora da obra)."
          onNoteDetected={(midi, noteName) => {
            handleNoteInput(midi, [midi], noteName);
          }}
          onNoteHold={(midi) => {
            setMicHearingMidi(midi);
          }}
          onChordDetected={(chord, midis) => {
            handleNoteInput(midis[0], midis, chord.symbol);
          }}
          onAcousticChordNotesChange={(notes) => {
            setMicAcousticNotes(notes);
          }}
          onActiveNotesChange={(notes) => {
            setActiveMidiKeys(new Set(notes));
            setMicAcousticNotes(notes);
            if (notes.length === 0) {
              setLastMidiEvent(null);
            }
          }}
        />

        {/* Partitura Deslizante 60 FPS com Suporte Completo a Reprodução e Prática */}
        <ScrollingScoreCanvas
          key={`${activeSong.id}-${arrangementMode}-${viewMode}-${practiceResetKey}`}
          notes={sortedScoreTrack}
          timeSignature={activeSong.timeSignature}
          bpm={tempo}
          isPlaying={viewMode === 'playback' ? isPlaying : isPracticing}
          isDemoMode={viewMode === 'playback'}
          mode={practiceType}
          autoPlayAudio={viewMode === 'playback' ? true : enableGuideAudio}
          instrument={arrangementMode === 'guitar' ? 'guitar' : 'piano'}
          enableMetronomeSound={metronome.isPlaying}
          hidePlaybackControls={true}
          currentNoteIndex={currentNoteIdx}
          sustainMode={sustainOption}
          onSustainModeChange={handleSustainOptionChange}
          onActiveNotesChange={(midis) => {
            setActiveDemoMidi(midis);
          }}
          onTargetNoteChange={(_target, idx) => {
            setCurrentNoteIdx(idx);
          }}
          onStepChange={(stepIndices, satisfiedIndices) => {
            setCurrentStepIndices(stepIndices);
            setSatisfiedStepIndices(new Set(satisfiedIndices));
          }}
          onNoteHit={(_note, diffMs) => {
            setPracticeHits((h) => h + 1);
            const pts = Math.abs(diffMs) < 60 ? 100 : Math.abs(diffMs) < 120 ? 70 : 40;
            setPracticeScore((s) => s + pts);
          }}
          onNoteError={(_err) => {
            setPracticeErrors((e) => e + 1);
            if (_err.playedMidi > 0) {
              setPracticeLastErrorMidi(_err.playedMidi);
            }
          }}
          onLessonComplete={() => {
            if (viewMode === 'practice') {
              setIsPracticing(false);
              setShowPracticeCompletionModal(true);
            } else {
              setShowCompletionBanner(true);
            }
          }}
          onPlayPauseToggle={(playing) => {
            if (viewMode === 'playback') {
              if (playing && !isPlaying) handleTogglePlayPause();
              else if (!playing && isPlaying) handleTogglePlayPause();
            } else {
              setIsPracticing(playing);
            }
          }}
          onTempoChange={(newBpm) => handleTempoChange(newBpm)}
          currentMidiPressed={viewMode === 'practice' && isPracticing ? lastMidiEvent : null}
          lyrics={showLyrics ? (activeSongEnrichedLyrics ?? activeSong.extension?.lyrics) : undefined}
        />

        {/* Teclado Virtual com Rastro Synthesia (100% da Largura, Zero Scroll, Bordas Sutis) */}
        <div className="pt-1">
          <PianoKeyboard
            startOctave={2}
            allowOctaveControls={true}
            highlightedKeys={highlightedSongKeys}
            correctNotes={correctKeyMidis}
            errorNotes={errorKeyMidis}
            activeFingerPrompt={activeFingerPrompt}
            activeExternalNotes={activeInputMidis}
            onKeyPlay={(midi) => {
              handleNoteInput(midi, [midi]);
            }}
            onKeyRelease={() => {
              setLastMidiEvent(null);
            }}
          />
        </div>
      </div>

      {/* 3. Informações Pedagógicas, Contexto Histórico & Acordes (Posicionado no Final da Página) */}
      {/* Visualização para Telas Maiores (Tablet / Computador >= 768px) */}
      <div className="hidden md:grid md:grid-cols-3 gap-2.5 text-xs pt-1">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 backdrop-blur-sm shadow-sm">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Contexto Histórico:</span>
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
            {octaveConfigStore.formatNoteOctavesInText(activeSong.historicalContext, octaveStandard)}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1 backdrop-blur-sm shadow-sm">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dica de Biomecânica:</span>
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
            {octaveConfigStore.formatNoteOctavesInText(activeSong.biomechanicsTip, octaveStandard)}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Acordes Envolvidos na Obra:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeSong.chords.map((chord, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-black"
              >
                {chord}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Faixa de Diagramas de Acordes de Violão (Widescreen / Desktop) */}
      {arrangementMode === 'guitar' && showGuitarDiagrams && (
        <div className="hidden md:block animate-in fade-in duration-300 pt-1">
          <GuitarChordStrip
            chords={activeSong.chords}
            title={`Diagramas de Acordes de Violão (${guitarInfo.styleBadge}) — "${activeSong.title}":`}
            badge="6 Cordas & Pestanas"
          />
        </div>
      )}

      {/* Visualização Adaptativa para Celulares (< 768px) com Abas Compactas */}
      <div className="md:hidden space-y-2 text-xs pt-1">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setMobileContextTab('context')}
            className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileContextTab === 'context'
                ? 'bg-purple-600/40 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Contexto</span>
          </button>

          <button
            onClick={() => setMobileContextTab('tips')}
            className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileContextTab === 'tips'
                ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dica</span>
          </button>

          <button
            onClick={() => setMobileContextTab('chords')}
            className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileContextTab === 'chords'
                ? 'bg-amber-600/40 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Acordes ({activeSong.chords.length})</span>
          </button>

          {arrangementMode === 'guitar' && (
            <button
              onClick={() => setMobileContextTab('guitar')}
              className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileContextTab === 'guitar'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 font-black'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Guitar className="w-3.5 h-3.5 text-amber-400" />
              <span>Violão</span>
            </button>
          )}
        </div>

        {mobileContextTab === 'context' && (
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-slate-400 text-xs leading-relaxed">
              {octaveConfigStore.formatNoteOctavesInText(activeSong.historicalContext, octaveStandard)}
            </p>
          </div>
        )}

        {mobileContextTab === 'tips' && (
          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
            <p className="text-slate-300 text-xs leading-relaxed">
              {octaveConfigStore.formatNoteOctavesInText(activeSong.biomechanicsTip, octaveStandard)}
            </p>
          </div>
        )}

        {mobileContextTab === 'chords' && (
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
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
        )}

        {mobileContextTab === 'guitar' && (
          <div className="animate-in fade-in duration-200">
            <GuitarChordStrip
              chords={activeSong.chords}
              title={`Acordes de Violão — ${activeSong.title}`}
              badge={guitarInfo.styleBadge}
            />
          </div>
        )}
      </div>

      {/* 4. Modal de Catálogo Completo de Repertório */}
      <RepertoireCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        selectedSong={activeSong}
        onSelectSong={(song) => handleSelectSong(song)}
      />

      {/* 5. Modal do Validador de Acurácia Musical */}
      <RepertoireAccuracyModal
        isOpen={isAccuracyModalOpen}
        onClose={() => setIsAccuracyModalOpen(false)}
        currentSong={activeSong}
        onSelectSong={(song) => handleSelectSong(song)}
      />

      {/* 6. Modal de Conclusão da Prática Interativa */}
      {showPracticeCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-gradient-to-b from-[#18142a] via-[#100d1e] to-[#08070f] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 mx-auto shadow-xl shadow-purple-500/20">
              <div className="w-full h-full bg-[#120f22] rounded-[14px] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-purple-500/30">
                Prática Finalizada com Sucesso!
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-2">
                {activeSong.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeSong.composerOrArtist} • {activeSong.genre}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Acurácia</span>
                <p
                  className={`text-xl font-mono font-black ${
                    practiceAccuracy >= 90
                      ? 'text-emerald-400'
                      : practiceAccuracy >= 70
                      ? 'text-cyan-300'
                      : 'text-amber-400'
                  }`}
                >
                  {practiceAccuracy}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Acertos</span>
                <p className="text-xl font-mono font-black text-emerald-300">
                  {practiceHits}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Pontos</span>
                <p className="text-xl font-mono font-black text-amber-300">
                  {practiceScore}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={handleResetPractice}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Praticar Novamente</span>
              </button>
              <button
                onClick={() => {
                  setShowPracticeCompletionModal(false);
                  handleSwitchViewMode('playback');
                  setTimeout(() => handleTogglePlayPause(), 300);
                }}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-4 h-4" />
                <span>Ouvir Obra</span>
              </button>
            </div>

            <button
              onClick={() => setShowPracticeCompletionModal(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Fechar resumo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
