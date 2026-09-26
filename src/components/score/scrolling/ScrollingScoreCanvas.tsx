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
  mode = 'wait',
  onStepChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [scoreTheme, setScoreTheme] = useState<ScoreTheme>(initialTheme);
  const [enableAudio, setEnableAudio] = useState<boolean>(autoPlayAudio);
  const metronome = useMetronome();
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(
    Boolean(enableMetronomeSound || metronome.isPlaying)
  );

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
    mode,
    onStepChange,
  });

  // 1. Carrega e prepara a partitura apenas quando as notas ou o compasso realmente mudarem
  useEffect(() => {
    musicalPlaybackEngine.loadScore(notes, timeSignature, playback.tempo);
  }, [notes, timeSignature]);

  // 2. Sincroniza andamento (BPM) de forma contínua sem resetar o relógio de reprodução
  useEffect(() => {
    musicalPlaybackEngine.setBpm(playback.tempo);
  }, [playback.tempo]);

  // 3. Sincroniza modo de sustain em tempo real sem interrupção de áudio
  useEffect(() => {
    musicalPlaybackEngine.setSustainMode(activeSustainMode);
  }, [activeSustainMode]);

  // 4. Sincroniza instrumento em tempo real sem interrupção de áudio
  useEffect(() => {
    musicalPlaybackEngine.setInstrument(instrument);
  }, [instrument]);

  // 5. Sincroniza estado sonoro do metrônomo em tempo real
  useEffect(() => {
    musicalPlaybackEngine.setMetronomeEnabled(isMetronomeActive);
  }, [isMetronomeActive]);

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

  // Sincroniza estado de reprodução (single source of time)
  useEffect(() => {
    const isFlowing = isDemoMode || mode === 'flow';
    if (isFlowing) {
      if (playback.isPlaying && !musicalPlaybackEngine.getIsPlaying()) {
        const currentBeat = playback.scrollOffsetRef.current / pixelsPerBeat;
        if (isMetronomeActive) {
          metronomeEngine.setPlaybackDriven(true);
          musicalPlaybackEngine.setMetronomeEnabled(true);
        }
        musicalPlaybackEngine.play(currentBeat);
      } else if (!playback.isPlaying && musicalPlaybackEngine.getIsPlaying()) {
        musicalPlaybackEngine.pause();
        if (metronomeEngine.getSnapshot().isPlaying) {
          metronomeEngine.stop();
        }
      }
    } else {
      // No Modo Espera (Wait), o motor de reprodução autônoma DEVE estar pausado!
      if (musicalPlaybackEngine.getIsPlaying()) {
        musicalPlaybackEngine.pause();
      }
    }
  }, [playback.isPlaying, pixelsPerBeat, mode, isDemoMode, isMetronomeActive]);

  const handleTogglePlay = async () => {
    await soundEngine.ensureAudioReady();
    playback.handlePlayToggle();
  };

  const handleToggleMetronome = async () => {
    await soundEngine.ensureAudioReady();
    const nextState = !isMetronomeActive;
    setIsMetronomeActive(nextState);
    musicalPlaybackEngine.setMetronomeEnabled(nextState);

    if (playback.isPlaying) {
      // Se a partitura já está tocando, musicalPlaybackEngine é a única fonte sonora do metrônomo!
      if (nextState) {
        metronomeEngine.setPlaybackDriven(true);
        metronomeEngine.start({ bpm: playback.tempo, timeSignature });
      } else {
        metronomeEngine.setPlaybackDriven(false);
        metronomeEngine.stop();
      }
    } else {
      // Se a partitura estiver parada, liga/desliga o metrônomo isolado para treino
      if (nextState) {
        metronomeEngine.setPlaybackDriven(false);
        metronomeEngine.start({ bpm: playback.tempo, timeSignature });
      } else {
        metronomeEngine.stop();
      }
    }
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
      setIsMetronomeActive(enableMetronomeSound);
      musicalPlaybackEngine.setMetronomeEnabled(enableMetronomeSound);
      if (!enableMetronomeSound && metronomeEngine.getSnapshot().isPlaying) {
        metronomeEngine.stop();
      }
    }
  }, [enableMetronomeSound]);

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

      const isFlowing = isDemoMode || mode === 'flow';
      if (isFlowing && playback.isPlaying && !playback.isPausedWaitingRef.current) {
        // Posição analítica de alta precisão derivada do motor de tempo universal (Modo Fluido / Demonstração)
        const currentBeat = musicalPlaybackEngine.getCurrentBeat();
        playback.scrollOffsetRef.current = currentBeat * pixelsPerBeat;

        // Identifica o passo atual baseado no tempo musical exato (lookahead de 0.15 beats)
        let stepStartIdx = 0;
        for (let i = 0; i < timeline.noteOffsets.length; i++) {
          const noteOffset = timeline.noteOffsets[i] ?? 0;
          if (noteOffset <= currentBeat + 0.15) {
            const prevOffset = timeline.noteOffsets[stepStartIdx] ?? 0;
            if (noteOffset > prevOffset + 0.05) {
              stepStartIdx = i;
            }
          } else {
            break;
          }
        }

        if (stepStartIdx !== playback.currentIndex) {
          if (!isDemoMode && stepStartIdx > playback.currentIndex) {
            for (let missed = playback.currentIndex; missed < stepStartIdx; missed++) {
              playback.handleStepMissed?.(missed);
            }
          }
          playback.setCurrentIndex(stepStartIdx);
        }
      } else if (!isFlowing) {
        // MODO ESPERA: a partitura se alinha suavemente com a nota/acorde atual e aguarda a execução
        const targetOffset = timeline.noteOffsets[playback.currentIndex] ?? 0;
        const targetScroll = targetOffset * pixelsPerBeat;
        const diff = targetScroll - playback.scrollOffsetRef.current;
        if (Math.abs(diff) > 0.5) {
          playback.scrollOffsetRef.current += diff * 0.2;
        } else {
          playback.scrollOffsetRef.current = targetScroll;
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
      drawScoreNotes({ ctx, width: containerWidth, notes, theme: scoreTheme, displayOptions, noteOffsets: timeline.noteOffsets, currentIndex: playback.currentIndex, attackLineX, scrollOffset: playback.scrollOffsetRef.current, pixelsPerBeat, instrument, isDemoMode, lastError: playback.lastError, satisfiedIndices: playback.satisfiedIndices });
      drawScoreImpactLine(ctx, h, scoreTheme, attackLineX);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [playback, scoreTheme, displayOptions, containerWidth, timeline, restsList, notes, isDemoMode, instrument, beatsPerMeasure, activeSustainMode, isChordsSustain, pixelsPerBeat, attackLineX, mode]);

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
        enableMetronome={isMetronomeActive}
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
