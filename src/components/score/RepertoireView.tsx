import React, { useState, useEffect, useRef } from 'react';
import { REPERTOIRE_SONGS } from '../../core/repertoireData';
import type { RepertoireSong } from '../../core/repertoireData';
import { ScrollingScoreCanvas } from './ScrollingScoreCanvas';
import { PianoKeyboard } from '../piano/PianoKeyboard';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { RepertoireCatalogModal } from './RepertoireCatalogModal';
import { soundEngine } from '../../core/soundEngine';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Lightbulb,
  Gauge,
  ChevronDown,
} from 'lucide-react';

export const RepertoireView: React.FC = () => {
  const [activeSong, setActiveSong] = useState<RepertoireSong>(REPERTOIRE_SONGS[0]);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(REPERTOIRE_SONGS[0].recommendedBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number>(0);
  const [lastMidiEvent, setLastMidiEvent] = useState<{ midi: number; timestamp: number } | null>(null);

  const playbackTimeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const tempoRef = useRef<number>(tempo);
  const currentNoteIdxRef = useRef<number>(0);

  isPlayingRef.current = isPlaying;
  tempoRef.current = tempo;
  currentNoteIdxRef.current = currentNoteIdx;

  // Atualiza tempo recomendado ao trocar de música
  const handleSelectSong = (song: RepertoireSong) => {
    // Para qualquer reprodução anterior
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setCurrentNoteIdx(0);
    setActiveSong(song);
    setTempo(song.recommendedBpm);
  };

  const handleNoteInput = (midi: number) => {
    setLastMidiEvent({ midi, timestamp: performance.now() });
  };

  // Motor de Reprodução em Áudio da Melodia Sincronizada com Partitura e Teclado
  const playNextNote = (noteIndex: number) => {
    if (!isPlayingRef.current) return;

    const track = activeSong.scoreTrack;
    if (noteIndex >= track.length) {
      // Fim da obra: reinicia do começo após uma pausa
      playbackTimeoutRef.current = window.setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentNoteIdx(0);
          playNextNote(0);
        }
      }, 1200);
      return;
    }

    const currentNote = track[noteIndex];

    // Toca a nota no sintetizador de piano
    soundEngine.playPianoNote(currentNote.midi, 1.4);

    // Notifica teclado e rastro Synthesia
    handleNoteInput(currentNote.midi);

    setCurrentNoteIdx(noteIndex + 1);

    // Calcula duração da nota no andamento (BPM) atual
    const duration = currentNote.duration || 1;
    const noteDurationMs = (60 / tempoRef.current) * 1000 * duration;

    playbackTimeoutRef.current = window.setTimeout(() => {
      playNextNote(noteIndex + 1);
    }, noteDurationMs);
  };

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      // Pausar
      if (playbackTimeoutRef.current) {
        window.clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Iniciar
      setIsPlaying(true);
      isPlayingRef.current = true;
      playNextNote(currentNoteIdx);
    }
  };

  const handleResetPlayback = () => {
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    setIsPlaying(false);
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
    <div className="w-full max-w-[1850px] mx-auto space-y-3 select-none no-select">
      {/* 1. Barra de Acesso ao Catálogo e Controle Principal (Bordas Sutis & Widescreen) */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-white/5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-[#130b24]/60 to-[#0a0718]/80 backdrop-blur-md">
        {/* Lado Esquerdo: Identificação da Música e Botão para Abrir o Modal de Catálogo */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Botão que Abre o Modal com as Categorias e Músicas */}
          <button
            onClick={() => setIsCatalogModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-purple-500/30 shadow-lg shadow-purple-900/20 cursor-pointer transition-all active:scale-95 group shrink-0"
          >
            <Music className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span>Catálogo de Músicas</span>
            <ChevronDown className="w-3.5 h-3.5 text-purple-300" />
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

        {/* Lado Direito: Controles Globais de Play / Pause e Ajuste de Andamento (BPM) */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          {/* Botão Principal PLAY / PAUSE */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTogglePlayPause}
              className={`px-5 py-2.5 rounded-2xl font-black font-display text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar Música</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Tocar Música</span>
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

          {/* Ajuste de Andamento (BPM) com Steppers [- 5] e [+ 5] */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Gauge className="w-3 h-3 text-purple-400" />
              <span>BPM:</span>
            </span>

            <button
              onClick={() => handleTempoChange(tempo - 5)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
              title="-5 BPM"
            >
              -
            </button>

            <span className="text-xs font-bold font-mono text-purple-300 w-14 text-center">
              {tempo} BPM
            </span>

            <button
              onClick={() => handleTempoChange(tempo + 5)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
              title="+5 BPM"
            >
              +
            </button>

            <input
              type="range"
              min="40"
              max="180"
              value={tempo}
              onChange={(e) => handleTempoChange(parseInt(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Presets Rápidos de Velocidade */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-[9px] font-bold font-mono">
            {[0.75, 1.0, 1.25, 1.5].map((mult) => {
              const targetBpm = Math.round(activeSong.recommendedBpm * mult);
              const isActive = tempo === targetBpm;

              return (
                <button
                  key={mult}
                  onClick={() => handleTempoChange(targetBpm)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    isActive ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mult}x
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Informações de Contexto & Acordes (Layout Compacto com Bordas Sutis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Contexto Histórico:</span>
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
            {activeSong.historicalContext}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dica de Biomecânica:</span>
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
            {activeSong.biomechanicsTip}
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

      {/* 3. Palco Total: Partitura Deslizante (Widescreen 100% com Bordas Sutis) */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-white/5 space-y-3">
        {/* Barra de Escuta do Microfone (Acústico) */}
        <MicrophonePitchBar
          onNoteDetected={(midi) => handleNoteInput(midi)}
        />

        {/* Partitura Deslizante 60 FPS com Divisão de Compasso */}
        <ScrollingScoreCanvas
          key={activeSong.id}
          notes={activeSong.scoreTrack}
          timeSignature={activeSong.timeSignature}
          bpm={tempo}
          isPlaying={isPlaying}
          onPlayPauseToggle={(playing) => {
            if (playing && !isPlaying) {
              handleTogglePlayPause();
            } else if (!playing && isPlaying) {
              handleTogglePlayPause();
            }
          }}
          onTempoChange={(newBpm) => setTempo(newBpm)}
          currentMidiPressed={lastMidiEvent}
        />

        {/* Teclado Virtual com Rastro Synthesia (100% da Largura, Zero Scroll, Bordas Sutis) */}
        <div className="pt-1">
          <PianoKeyboard
            startOctave={2}
            octaveCount={3}
            allowOctaveControls={true}
            activeExternalNotes={lastMidiEvent ? [lastMidiEvent.midi] : []}
            onKeyPlay={(midi) => handleNoteInput(midi)}
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
    </div>
  );
};
