import React, { useState, useEffect, useRef, useMemo } from 'react';
import { REPERTOIRE_SONGS } from '../../core/repertoireData';
import type { RepertoireSong } from '../../core/repertoireData';
import type { ScoreNote } from '../../core/coursesData';
import { ScrollingScoreCanvas } from './ScrollingScoreCanvas';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { RepertoireCatalogModal } from './RepertoireCatalogModal';
import { RepertoireAccuracyModal } from './RepertoireAccuracyModal';
import { TimbreSelector } from '../audio/TimbreSelector';
import { soundEngine } from '../../core/soundEngine';
import { accompanimentSynthesizer, type MetronomeSoundType } from '../../core/accompanimentSynthesizer';
import { useOctaveStandard, octaveConfigStore } from '../../core/octaveConfigStore';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Lightbulb,
  Gauge,
  ChevronDown,
  Headphones,
  Expand,
  Shrink,
  ShieldCheck,
  Repeat,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';

function computeNoteOffsets(notes: ScoreNote[], timeSignature = '4/4'): number[] {
  const parts = timeSignature.split('/');
  const num = parseInt(parts[0], 10) || 4;
  const den = parseInt(parts[1], 10) || 4;
  let beatsPerMeasure = num;
  if (den === 8 && num >= 6) {
    beatsPerMeasure = num / 3;
  }

  const noteOffsets: number[] = [];
  if (!notes || notes.length === 0) return noteOffsets;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const m = Math.max(1, note.measure || 1);
    const b = (note.beat !== undefined ? Math.max(0, note.beat - 1) : 0);
    noteOffsets.push((m - 1) * beatsPerMeasure + b);
  }

  return noteOffsets;
}

export const RepertoireView: React.FC = () => {
  const [activeSong, setActiveSong] = useState<RepertoireSong>(REPERTOIRE_SONGS[0]);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(REPERTOIRE_SONGS[0].recommendedBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number>(0);
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);
  const [activeDemoMidi, setActiveDemoMidi] = useState<number[]>([]);
  const [micHearingMidi, setMicHearingMidi] = useState<number | null>(null);
  const [isFullscreenStage, setIsFullscreenStage] = useState<boolean>(false);

  // Modos de Finalização da Reprodução: 'end' (cessa no final real da música) ou 'repeat' (loop contínuo)
  const [playbackEndMode, setPlaybackEndMode] = useState<'end' | 'repeat'>('end');

  // Sustain Musical Real Exclusivo no Modo Reprodução:
  // 'chord' = sustenta notas do acorde até a troca do próximo acorde
  // 'note'  = sustenta notas individuais melódicas com legato de pedal
  // 'off'   = staccato puro sem sustain
  const [sustainOption, setSustainOption] = useState<'note' | 'chord' | 'off'>('chord');

  // Metrônomo Musical com timbre orgânico de instrumento
  const [enableMetronome, setEnableMetronome] = useState<boolean>(false);
  const [metronomeVolume, setMetronomeVolume] = useState<number>(75);
  const [metronomeSound, setMetronomeSound] = useState<MetronomeSoundType>('keyboard-sidestick');

  // Aba ativa nos cartões de contexto didático em telas mobile
  const [mobileContextTab, setMobileContextTab] = useState<'context' | 'tips' | 'chords'>('context');

  const octaveStandard = useOctaveStandard();

  const toggleFullscreenStage = () => {
    if (!isFullscreenStage) {
      setIsFullscreenStage(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    } else {
      setIsFullscreenStage(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenStage) {
        setIsFullscreenStage(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenStage]);

  const playbackTimeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const tempoRef = useRef<number>(tempo);
  const currentNoteIdxRef = useRef<number>(0);
  const playbackEndModeRef = useRef<'end' | 'repeat'>(playbackEndMode);
  const sustainOptionRef = useRef<'note' | 'chord' | 'off'>(sustainOption);
  const enableMetronomeRef = useRef<boolean>(enableMetronome);
  const metronomeVolumeRef = useRef<number>(metronomeVolume);
  const metronomeSoundRef = useRef<MetronomeSoundType>(metronomeSound);

  isPlayingRef.current = isPlaying;
  tempoRef.current = tempo;
  currentNoteIdxRef.current = currentNoteIdx;
  playbackEndModeRef.current = playbackEndMode;
  sustainOptionRef.current = sustainOption;
  enableMetronomeRef.current = enableMetronome;
  metronomeVolumeRef.current = metronomeVolume;
  metronomeSoundRef.current = metronomeSound;

  // Atualiza tempo recomendado ao trocar de música
  const handleSelectSong = (song: RepertoireSong) => {
    // Para qualquer reprodução anterior
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setActiveDemoMidi([]);
    setCurrentNoteIdx(0);
    setActiveSong(song);
    setTempo(song.recommendedBpm);
  };

  const handleNoteInput = (midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  };

  // Garante que o scoreTrack esteja SEMPRE estritamente ordenado por compasso e tempo
  const sortedScoreTrack = useMemo(() => {
    const parts = activeSong.timeSignature.split('/');
    const num = parseInt(parts[0], 10) || 4;
    const den = parseInt(parts[1], 10) || 4;
    let bpm = num;
    if (den === 8 && num >= 6) bpm = num / 3;

    return [...activeSong.scoreTrack].sort((a, b) => {
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
  }, [activeSong]);

  // Pré-computa os tempos métricos exatos das notas para sincronização polifônica precisa
  const noteOffsets = useMemo(() => {
    return computeNoteOffsets(sortedScoreTrack, activeSong.timeSignature);
  }, [sortedScoreTrack, activeSong.timeSignature]);
  const noteOffsetsRef = useRef<number[]>(noteOffsets);
  noteOffsetsRef.current = noteOffsets;

  // Dedo da nota atual em execução na partitura para a tag abaixo do teclado
  const currentSongTargetNote = sortedScoreTrack[currentNoteIdx] || sortedScoreTrack[0];

  // Apontamento de dedos para as teclas do piano com foco apenas na nota atual da música
  const highlightedSongKeys = useMemo(() => {
    if (!currentSongTargetNote) return [];
    return [{
      midi: currentSongTargetNote.midi,
      finger: currentSongTargetNote.fingerRightHand || currentSongTargetNote.fingerLeftHand,
      color: '#6366f1',
    }];
  }, [currentSongTargetNote]);

  const activeFingerPrompt = useMemo(() => {
    if (!currentSongTargetNote) return null;
    const fingerNum = currentSongTargetNote.fingerRightHand || currentSongTargetNote.fingerLeftHand;
    const hand = currentSongTargetNote.clef === 'bass' || currentSongTargetNote.midi < 60 ? 'ME' : 'MD';
    const names = ['', 'Polegar', 'Indicador', 'Médio', 'Anelar', 'Mínimo'];
    const colors = ['', '#f59e0b', '#38bdf8', '#10b981', '#c084fc', '#f43f5e'];
    const f = fingerNum || (hand === 'MD' ? (currentSongTargetNote.midi === 60 ? 1 : 2) : 5);
    return {
      finger: f,
      label: `${f}`,
      fingerName: names[f] || `D${f}`,
      noteName: octaveConfigStore.midiToNoteName(currentSongTargetNote.midi, octaveStandard),
      color: colors[f] || '#38bdf8',
    };
  }, [currentSongTargetNote, octaveStandard]);

  // Motor de Reprodução em Áudio Fiel à Partitura (Polifonia, Baixo e Melodia Sincronizados)
  const playNextNote = (noteIndex: number) => {
    if (!isPlayingRef.current) return;

    const track = sortedScoreTrack;
    const offsets = noteOffsetsRef.current;
    if (noteIndex >= track.length) {
      // Fim da obra: encerra ou reinicia dependendo do modo configurado
      if (playbackEndModeRef.current === 'repeat') {
        playbackTimeoutRef.current = window.setTimeout(() => {
          if (isPlayingRef.current) {
            setCurrentNoteIdx(0);
            playNextNote(0);
          }
        }, 1200);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setActiveDemoMidi([]);
        setCurrentNoteIdx(0);
      }
      return;
    }

    // Toca a nota atual e todas as notas simultâneas (mesmo tempo métrico / acordes e ambas as mãos)
    const currentOffset = offsets[noteIndex] ?? 0;
    let nextIndex = noteIndex;
    const currentNotesMidi: number[] = [];

    // Metrônomo Musical Sincronizado por Batida
    if (enableMetronomeRef.current) {
      const parts = activeSong.timeSignature.split('/');
      const num = parseInt(parts[0], 10) || 4;
      const beatInMeasure = Math.floor(currentOffset % num) + 1;
      const isDownbeat = beatInMeasure === 1;

      accompanimentSynthesizer.playMetronomeSound(
        metronomeSoundRef.current,
        isDownbeat,
        false,
        undefined,
        (metronomeVolumeRef.current / 100) * 0.85
      );
    }

    // Calcula duração do intervalo até o próximo evento musical
    let nextEventOffset: number | null = null;
    {
      let scanIdx = nextIndex;
      while (scanIdx < track.length && Math.abs((offsets[scanIdx] ?? 0) - currentOffset) < 0.05) scanIdx++;
      if (scanIdx < track.length) nextEventOffset = offsets[scanIdx] ?? null;
    }

    // Identifica quando ocorrerá a próxima troca de acorde na partitura (para Sustain Acorde)
    let nextChordChangeOffset: number | null = null;
    const currentChordName = track[nextIndex]?.chordName;
    if (currentChordName) {
      for (let c = nextIndex + 1; c < track.length; c++) {
        if (track[c].chordName && track[c].chordName !== currentChordName) {
          nextChordChangeOffset = offsets[c] ?? null;
          break;
        }
      }
    }

    while (nextIndex < track.length && Math.abs((offsets[nextIndex] ?? 0) - currentOffset) < 0.05) {
      const noteToPlay = track[nextIndex];
      const beatSec = 60 / tempoRef.current;
      const noteDurSec = (noteToPlay.duration || 1) * beatSec;

      let durSec: number;
      if (sustainOptionRef.current === 'chord') {
        // Sustain Acorde: mantém a harmonia sustentada até a entrada do novo acorde
        if (nextChordChangeOffset !== null) {
          durSec = Math.max(noteDurSec, (nextChordChangeOffset - currentOffset) * beatSec + 0.08);
        } else if (nextEventOffset !== null) {
          durSec = Math.max(noteDurSec * 1.4, (nextEventOffset - currentOffset) * beatSec + 0.4);
        } else {
          durSec = Math.max(noteDurSec * 1.5, 2.5);
        }
      } else if (sustainOptionRef.current === 'note') {
        // Sustain Nota: mantém cada nota melódica soando com legato natural de pedal
        const intervalSec = nextEventOffset !== null
          ? Math.max(0.1, (nextEventOffset - currentOffset) * beatSec + 0.08)
          : noteDurSec * 1.35;
        durSec = Math.max(noteDurSec * 1.1, intervalSec);
      } else {
        // Sem Sustain: staccato articulado (~45% da duração rítmica)
        durSec = Math.max(0.12, noteDurSec * 0.45);
      }

      soundEngine.playPianoNote(noteToPlay.midi, durSec);
      currentNotesMidi.push(noteToPlay.midi);
      nextIndex++;
    }

    // Atualiza teclas ativas visualmente no piano durante a demonstração
    setActiveDemoMidi(currentNotesMidi);
    setCurrentNoteIdx(nextIndex);

    // Calcula tempo exato até o próximo evento musical
    if (nextIndex < track.length) {
      const nextOffset = offsets[nextIndex] ?? (currentOffset + 1);
      const deltaBeats = Math.max(0.08, nextOffset - currentOffset);
      const noteDurationMs = (60 / tempoRef.current) * 1000 * deltaBeats;

      playbackTimeoutRef.current = window.setTimeout(() => {
        playNextNote(nextIndex);
      }, noteDurationMs);
    } else {
      // Última nota da partitura:
      // Aguarda rigorosamente a execução e o decaimento real de sustain da última nota
      const lastDur = Math.max(...track.slice(noteIndex).map(n => n.duration || 2));
      const sustainDecayMs = sustainOptionRef.current !== 'off' ? 850 : 200;
      const finalWaitMs = (60 / tempoRef.current) * 1000 * lastDur + sustainDecayMs;

      playbackTimeoutRef.current = window.setTimeout(() => {
        if (isPlayingRef.current) {
          if (playbackEndModeRef.current === 'repeat') {
            // Modo Repetição: Retorna ao início e reinicia
            setCurrentNoteIdx(0);
            playNextNote(0);
          } else {
            // Modo Fim / Normal: Cessa a reprodução exatamente após a última nota
            setIsPlaying(false);
            isPlayingRef.current = false;
            setActiveDemoMidi([]);
            setCurrentNoteIdx(0);
          }
        }
      }, finalWaitMs);
    }
  };

  const handleTogglePlayPause = async () => {
    await soundEngine.ensureAudioReady();
    if (isPlaying) {
      // Pausar
      if (playbackTimeoutRef.current) {
        window.clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
      setIsPlaying(false);
      setActiveDemoMidi([]);
    } else {
      // Iniciar demonstração sonora
      setIsPlaying(true);
      isPlayingRef.current = true;
      playNextNote(currentNoteIdx >= sortedScoreTrack.length ? 0 : currentNoteIdx);
    }
  };

  const handleResetPlayback = () => {
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setActiveDemoMidi([]);
    setCurrentNoteIdx(0);
    currentNoteIdxRef.current = 0;
  };

  const handleTempoChange = (newTempo: number) => {
    const clamped = Math.max(30, Math.min(220, newTempo));
    setTempo(clamped);
  };

  // Limpeza de timers ao desmontar
  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) {
        window.clearTimeout(playbackTimeoutRef.current);
      }
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
          {/* Seletor de Timbre */}
          <TimbreSelector compact />

          {/* Botão Principal PLAY / PAUSE */}
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
                  <span>Tocar Música</span>
                </>
              )}
            </button>

            {/* Alternador de Modo de Fim vs Repetição */}
            <button
              onClick={() => setPlaybackEndMode(m => m === 'end' ? 'repeat' : 'end')}
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
              onClick={() => setSustainOption('note')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'note'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sustain Nota: sustenta as notas melódicas com legato natural de pedal"
            >
              <span>🎹 Nota</span>
            </button>

            <button
              onClick={() => setSustainOption('chord')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'chord'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sustain Acorde: sustenta todas as notas da harmonia até a troca para o próximo acorde"
            >
              <span>🎼 Acorde</span>
            </button>

            <button
              onClick={() => setSustainOption('off')}
              className={`px-2 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sustainOption === 'off'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sem Sustain: execução staccato com corte seco"
            >
              <span>🔇 Desat.</span>
            </button>
          </div>

          {/* Metrônomo Musical Integrado */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setEnableMetronome(m => !m)}
              className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-bold ${
                enableMetronome
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={enableMetronome ? 'Metrônomo Musical Ativo' : 'Ativar Metrônomo Musical'}
            >
              {enableMetronome ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">Metrônomo</span>
            </button>

            {enableMetronome && (
              <>
                <select
                  value={metronomeSound}
                  onChange={(e) => setMetronomeSound(e.target.value as MetronomeSoundType)}
                  className="bg-black/60 text-[10px] text-amber-200 border border-white/10 rounded-lg px-1.5 py-0.5 font-mono cursor-pointer"
                  title="Timbre Musical do Metrônomo"
                >
                  <option value="keyboard-sidestick">Aro Teclado</option>
                  <option value="woodblock">Bloco Madeira</option>
                  <option value="cowbell">Cowbell</option>
                </select>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={metronomeVolume}
                  onChange={(e) => setMetronomeVolume(parseInt(e.target.value, 10))}
                  className="w-12 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  title={`Volume: ${metronomeVolume}%`}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Informações de Contexto & Acordes (Layout Adaptativo: Abas no Mobile, 3 Colunas no Tablet/Desktop) */}
      {/* Visualização para Telas Maiores (Tablet / Computador >= 768px) */}
      <div className="hidden md:grid md:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Contexto Histórico:</span>
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
            {octaveConfigStore.formatNoteOctavesInText(activeSong.historicalContext, octaveStandard)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dica de Biomecânica:</span>
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
            {octaveConfigStore.formatNoteOctavesInText(activeSong.biomechanicsTip, octaveStandard)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Acordes Envolvidos na Obra:
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
      </div>

      {/* Visualização Adaptativa para Celulares (< 768px) com Abas Compactas */}
      <div className="md:hidden space-y-2 text-xs">
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
      </div>

      {/* 3. Palco Total: Partitura Deslizante (Widescreen 100% com Bordas Sutis) */}
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
              • {activeSong.title} ({activeSong.recommendedBpm} BPM)
            </span>
          </div>

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

        {/* Barra de Escuta do Microfone (Acústico) - Pausada durante a demonstração sonora */}
        <MicrophonePitchBar
          disabled={isPlaying}
          disabledMessage="Demonstração em reprodução: escuta do microfone e avaliação de performance desativadas (apenas demonstração sonora da obra)."
          onNoteDetected={(midi) => {
            if (!isPlaying) handleNoteInput(midi);
          }}
          onNoteHold={(midi) => {
            if (!isPlaying) setMicHearingMidi(midi);
          }}
        />

        {/* Partitura Deslizante 60 FPS com Divisão de Compasso em Modo Demonstração */}
        <ScrollingScoreCanvas
          key={activeSong.id}
          notes={sortedScoreTrack}
          timeSignature={activeSong.timeSignature}
          bpm={tempo}
          isPlaying={isPlaying}
          isDemoMode={true}
          autoPlayAudio={false}
          currentNoteIndex={currentNoteIdx}
          onPlayPauseToggle={(playing) => {
            if (playing && !isPlaying) {
              handleTogglePlayPause();
            } else if (!playing && isPlaying) {
              handleTogglePlayPause();
            }
          }}
          onTempoChange={(newBpm) => setTempo(newBpm)}
          currentMidiPressed={isPlaying ? null : lastMidiEvent}
        />

        {/* Teclado Virtual com Rastro Synthesia (100% da Largura, Zero Scroll, Bordas Sutis) */}
        <div className="pt-1">
          <PianoKeyboard
            startOctave={2}
            octaveCount={3}
            allowOctaveControls={true}
            highlightedKeys={highlightedSongKeys}
            activeFingerPrompt={activeFingerPrompt}
            activeExternalNotes={isPlaying ? activeDemoMidi : (micHearingMidi !== null ? [micHearingMidi] : [])}
            onKeyPlay={(midi) => {
              if (!isPlaying) handleNoteInput(midi);
            }}
            onKeyRelease={() => {
              setLastMidiEvent(null);
            }}
          />
        </div>
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
    </div>
  );
};
