/**
 * scrolling/ScrollingScoreCanvas.tsx
 * Componente orquestrador da esteira de partitura deslizante de alta precisão.
 * Regra: SRP, orquestrador desacoplado (< 160 linhas).
 */

import React, { useRef, useEffect, useState } from 'react';
import { soundEngine } from '../../../core/soundEngine';
import { metronomeEngine, useMetronome } from '../../../core/metronomeEngine';
import { musicalPlaybackEngine } from '../../../core/musicalPlaybackEngine';
import type { ScrollingScoreProps, DisplayOptions, ScoreTheme, ScoreSustainMode } from './types';
import { SCORE_GEOMETRY } from './scoreGeometry';
import { useScoreTimeline } from './useScoreTimeline';
import { useScorePlayback } from './useScorePlayback';
import { drawScoreBackground } from './drawScoreBackground';
import { drawScoreStaves } from './drawScoreStaves';
import { drawScoreChords } from './drawScoreChords';
import { drawScoreNotes } from './drawScoreNotes';
import { drawScoreRests } from './drawScoreRests';
import { drawScoreImpactLine } from './drawScoreImpactLine';
import { ScoreCanvasControls } from './ScoreCanvasControls';

export const ScrollingScoreCanvas: React.FC<ScrollingScoreProps> = ({
  notes,
  bpm = 75,
  timeSignature = '4/4',
  initialTheme = 'traditional',
  onNoteHit,
  onNoteError,
  onTargetNoteChange,
  onLessonComplete,
  currentMidiPressed,
  isPlaying: controlledIsPlaying,
  onPlayPauseToggle,
  onTempoChange,
  instrument = 'piano',
  toleranceMs = 70,
  isDemoMode = false,
  currentNoteIndex,
  autoPlayAudio = true,
  enableMetronomeSound,
  sustainMode: propSustainMode,
  onSustainModeChange,
  enableSustain: initialSustain = false,
  hidePlaybackControls = false,
  onActiveNotesChange,
  onBeatTick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [scoreTheme, setScoreTheme] = useState<ScoreTheme>(initialTheme);
  const [enableAudio, setEnableAudio] = useState<boolean>(autoPlayAudio);
  const metronome = useMetronome();

  const [internalSustainMode, setInternalSustainMode] = useState<ScoreSustainMode>(
    propSustainMode ?? (initialSustain ? 'all' : 'off')
  );
  const activeSustainMode = propSustainMode ?? internalSustainMode;

  const handleSustainModeChange = (mode: ScoreSustainMode) => {
    setInternalSustainMode(mode);
    onSustainModeChange?.(mode);
  };

  const isChordsSustain = activeSustainMode === 'chords' || activeSustainMode === 'all';

  useEffect(() => {
    setEnableAudio(autoPlayAudio);
  }, [autoPlayAudio]);

  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showFingering: true,
    showNoteNames: true,
    showRests: true,
    showBarlines: true,
    showBeatNumbers: true,
    showSubdivisions: true,
    showChords: true,
  });

  const pixelsPerBeat = 140;
  const attackLineX = SCORE_GEOMETRY.attackLineX;
  const { beatsPerMeasure, timeline, restsList } = useScoreTimeline(notes, timeSignature);

  const playback = useScorePlayback({
    notes,
    bpm,
    toleranceMs,
    isDemoMode,
    controlledIsPlaying,
    onPlayPauseToggle,
    onTempoChange,
    onNoteHit,
    onNoteError,
    onTargetNoteChange,
    onLessonComplete,
    currentMidiPressed,
    currentNoteIndex,
    timeline,
    pixelsPerBeat,
    instrument,
    sustainMode: activeSustainMode,
  });

  // Carrega e sincroniza o motor universal com as propriedades musicais
  useEffect(() => {
    musicalPlaybackEngine.loadScore(notes, timeSignature, playback.tempo);
    musicalPlaybackEngine.setSustainMode(activeSustainMode);
    musicalPlaybackEngine.setInstrument(instrument);
    musicalPlaybackEngine.setMetronomeEnabled(Boolean(enableMetronomeSound || metronome.isPlaying));
  }, [notes, timeSignature, activeSustainMode, instrument, enableMetronomeSound, metronome.isPlaying, playback.tempo]);

  // Observa batidas e notas ativas para notificar a UI e componentes pais
  useEffect(() => {
    const unsubNotes = musicalPlaybackEngine.onActiveNotesChange((midis) => {
      onActiveNotesChange?.(midis);
    });
    const unsubBeats = musicalPlaybackEngine.onBeatTick((m, b, isDownbeat) => {
      onBeatTick?.(m, b, isDownbeat);
    });
    return () => {
      unsubNotes();
      unsubBeats();
    };
  }, [onActiveNotesChange, onBeatTick]);

  // Sincroniza estado de reprodução
  useEffect(() => {
    if (playback.isPlaying && !musicalPlaybackEngine.getIsPlaying()) {
      const currentBeat = playback.scrollOffsetRef.current / pixelsPerBeat;
      musicalPlaybackEngine.play(currentBeat);
    } else if (!playback.isPlaying && musicalPlaybackEngine.getIsPlaying()) {
      musicalPlaybackEngine.pause();
    }
  }, [playback.isPlaying, pixelsPerBeat]);

  const handleTogglePlay = async () => {
    await soundEngine.ensureAudioReady();
    playback.handlePlayToggle();
  };

  const handleToggleMetronome = async () => {
    await soundEngine.ensureAudioReady();
    const nextState = !metronome.isPlaying;
    musicalPlaybackEngine.setMetronomeEnabled(nextState);
    metronomeEngine.toggle({ bpm: playback.tempo, timeSignature });
  };

  const handleTempoChange = (newTempo: number) => {
    playback.handleTempoChange(newTempo);
    musicalPlaybackEngine.setBpm(newTempo);
    metronomeEngine.setBpm(newTempo);
    onTempoChange?.(newTempo);
  };

  // Sincroniza metronomeEngine se a prop enableMetronomeSound for explicitamente fornecida
  useEffect(() => {
    if (enableMetronomeSound !== undefined) {
      musicalPlaybackEngine.setMetronomeEnabled(enableMetronomeSound);
      if (enableMetronomeSound && !metronomeEngine.getSnapshot().isPlaying) {
        soundEngine.ensureAudioReady().then(() => {
          metronomeEngine.start({ bpm: playback.tempo, timeSignature });
        });
      } else if (!enableMetronomeSound && metronomeEngine.getSnapshot().isPlaying) {
        metronomeEngine.stop();
      }
    }
  }, [enableMetronomeSound, playback.tempo, timeSignature]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      musicalPlaybackEngine.pause();
      if (metronomeEngine.getSnapshot().isPlaying) {
        metronomeEngine.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      if (entries[0]) setContainerWidth(entries[0].contentRect.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;
    let animId: number;

    const render = () => {
      if (!active) return;

      if (playback.isPlaying && !playback.isPausedWaitingRef.current) {
        // Posição analítica de alta precisão derivada do motor de tempo universal
        const currentBeat = musicalPlaybackEngine.getCurrentBeat();
        playback.scrollOffsetRef.current = currentBeat * pixelsPerBeat;

        // Atualiza nota alvo atual na partitura
        const foundIdx = timeline.noteOffsets.findIndex(b => Math.abs(b - currentBeat) <= 0.15 || b > currentBeat);
        if (foundIdx !== -1 && foundIdx !== playback.currentIndex) {
          playback.setCurrentIndex(foundIdx);
        }
      }

      const h = canvas.height;
      drawScoreBackground(ctx, containerWidth, h, scoreTheme, attackLineX, pixelsPerBeat);
      drawScoreStaves({ ctx, width: containerWidth, theme: scoreTheme, displayOptions, measureStartBeats: timeline.measureStartBeats, maxMeasure: timeline.maxMeasure, totalBeats: timeline.totalBeats, beatsPerMeasure, attackLineX, scrollOffset: playback.scrollOffsetRef.current, pixelsPerBeat });
      if (displayOptions.showChords) {
        drawScoreChords({ ctx, width: containerWidth, theme: scoreTheme, chordSpans: timeline.chordSpans, attackLineX, scrollOffset: playback.scrollOffsetRef.current, pixelsPerBeat, enableSustain: isChordsSustain, sustainMode: activeSustainMode });
      }
      if (displayOptions.showRests) {
        drawScoreRests({ ctx, width: containerWidth, theme: scoreTheme, restsList, attackLineX, scrollOffset: playback.scrollOffsetRef.current, pixelsPerBeat });
      }
      drawScoreNotes({ ctx, width: containerWidth, notes, theme: scoreTheme, displayOptions, noteOffsets: timeline.noteOffsets, currentIndex: playback.currentIndex, attackLineX, scrollOffset: playback.scrollOffsetRef.current, pixelsPerBeat, instrument, isDemoMode, lastError: playback.lastError });
      drawScoreImpactLine(ctx, h, scoreTheme, attackLineX);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [playback, scoreTheme, displayOptions, containerWidth, timeline, restsList, notes, isDemoMode, instrument, beatsPerMeasure, activeSustainMode, isChordsSustain, pixelsPerBeat, attackLineX]);

  return (
    <div ref={containerRef} className="w-full flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#090814]">
      <ScoreCanvasControls
        isPlaying={playback.isPlaying}
        onTogglePlay={handleTogglePlay}
        onRestart={playback.handleRestart}
        tempo={playback.tempo}
        onTempoChange={handleTempoChange}
        theme={scoreTheme}
        onToggleTheme={() => setScoreTheme(t => (t === 'traditional' ? 'dark' : 'traditional'))}
        enableAudio={enableAudio}
        onToggleAudio={() => setEnableAudio(a => !a)}
        showAudioToggle={autoPlayAudio}
        enableMetronome={metronome.isPlaying}
        onToggleMetronome={handleToggleMetronome}
        sustainMode={activeSustainMode}
        onSustainModeChange={handleSustainModeChange}
        enableSustain={activeSustainMode !== 'off'}
        onToggleSustain={() => {
          const nextCycle: Record<ScoreSustainMode, ScoreSustainMode> = {
            off: 'notes',
            notes: 'chords',
            chords: 'all',
            all: 'off',
          };
          handleSustainModeChange(nextCycle[activeSustainMode] ?? 'all');
        }}
        displayOptions={displayOptions}
        onToggleOption={k => setDisplayOptions(o => ({ ...o, [k]: !o[k] }))}
        score={playback.score}
        feedback={playback.feedback}
        hidePlaybackControls={hidePlaybackControls}
      />
      <div className="relative w-full overflow-hidden">
        <canvas ref={canvasRef} width={containerWidth} height={410} className="w-full h-[410px] block" />
      </div>
    </div>
  );
};
