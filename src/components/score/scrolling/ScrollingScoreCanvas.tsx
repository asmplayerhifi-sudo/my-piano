/**
 * scrolling/ScrollingScoreCanvas.tsx
 * Componente orquestrador da esteira de partitura deslizante de alta precisão.
 * Regra: SRP, orquestrador desacoplado (< 160 linhas).
 */

import React, { useRef, useEffect, useState } from 'react';
import { soundEngine } from '../../../core/soundEngine';
import { parseChord } from '../../../core/musicTheory';
import { metronomeEngine, useMetronome } from '../../../core/metronomeEngine';
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
  enableSustain: initialSustain = true,
  hidePlaybackControls = false,
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

  const isNotesSustain = activeSustainMode === 'notes' || activeSustainMode === 'all';
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

  const handleTogglePlay = async () => {
    await soundEngine.ensureAudioReady();
    playback.handlePlayToggle();
  };

  const handleToggleMetronome = async () => {
    await soundEngine.ensureAudioReady();
    metronomeEngine.toggle({ bpm: playback.tempo, timeSignature });
  };

  const handleTempoChange = (newTempo: number) => {
    playback.handleTempoChange(newTempo);
    metronomeEngine.setBpm(newTempo);
    onTempoChange?.(newTempo);
  };

  // Sincroniza metronomeEngine se a prop enableMetronomeSound for explicitamente fornecida
  useEffect(() => {
    if (enableMetronomeSound !== undefined) {
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
    let lastTime = performance.now();

    const render = (now: number) => {
      if (!active) return;
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (playback.isPlaying && !playback.isPausedWaitingRef.current) {
        playback.scrollOffsetRef.current += (playback.tempo / 60) * pixelsPerBeat * dt;
        const currentBeat = playback.scrollOffsetRef.current / pixelsPerBeat;

        // Dispara áudio das notas individuais APENAS quando autoPlayAudio e enableAudio estiverem ativos
        // Em modo de reprodução externa gerenciada pelo pai (ex: RepertoireView), autoPlayAudio é falso e não duplica a faixa!
        if (enableAudio && autoPlayAudio) {
          timeline.noteOffsets.forEach((b, i) => {
            if (b <= currentBeat && !playback.playedNotesRef.current.has(i)) {
              playback.playedNotesRef.current.add(i);
              const n = notes[i];
              if (n) {
                const beatSec = 60 / playback.tempo;
                const noteDurSec = (n.duration || 1) * beatSec;
                const soundDuration = isNotesSustain
                  ? Math.max(noteDurSec * 1.6, 2.5)
                  : Math.max(0.18, noteDurSec * 0.85);

                if (instrument === 'guitar') {
                  soundEngine.playGuitarPluck(n.midi, soundDuration, undefined, 0.8, isNotesSustain);
                } else {
                  soundEngine.playPianoNote(n.midi, soundDuration, undefined, 0.8, isNotesSustain);
                }
                playback.setCurrentIndex(i);
              }
            }
          });

          // Reprodução polifônica síncrona dos acordes da partitura ao atingir o beat de início
          if (displayOptions.showChords) {
            timeline.chordSpans.forEach((chord, chordIdx) => {
              if (chord.startBeat <= currentBeat && !playback.playedChordsRef.current.has(chordIdx)) {
                playback.playedChordsRef.current.add(chordIdx);
                const parsed = parseChord(chord.chordName);
                if (parsed && parsed.midiNotes.length > 0) {
                  const beatSec = 60 / playback.tempo;
                  const chordDurationSec = chord.duration * beatSec;
                  // Com sustain: notas ressoam de forma contínua preenchendo o compasso; Sem sustain: staccato curto e seco
                  const soundDuration = isChordsSustain
                    ? Math.max(2.4, chordDurationSec * 1.1)
                    : Math.min(0.35, beatSec * 0.45);
                  soundEngine.playChord(parsed.midiNotes, instrument, soundDuration, isChordsSustain);
                }
              }
            });
          }
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
  }, [playback, scoreTheme, displayOptions, containerWidth, timeline, restsList, notes, enableAudio, autoPlayAudio, isDemoMode, instrument, beatsPerMeasure, activeSustainMode, isNotesSustain, isChordsSustain]);

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
