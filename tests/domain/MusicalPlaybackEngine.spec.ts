import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MusicalPlaybackEngine } from '../../src/core/musicalPlaybackEngine';
import { metronomeEngine } from '../../src/core/metronomeEngine';
import type { ScoreNote } from '../../src/core/coursesData';

describe('MusicalPlaybackEngine - Single Source of Time & Sync', () => {
  let engine: MusicalPlaybackEngine;

  const mockNotes: ScoreNote[] = [
    { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, noteName: 'E3' },
    { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, noteName: 'E3' },
    { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'F3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'G3' },
    { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, noteName: 'G3' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    engine = new MusicalPlaybackEngine();
    engine.loadScore(mockNotes, '4/4', 60); // 60 BPM = 1 beat per second
  });

  afterEach(() => {
    engine.stop();
    vi.useRealTimers();
  });

  it('determines measure, beat and subdivision precisely from musical beat', () => {
    // 60 BPM -> 1 beat = 1000ms
    const pos0 = engine.getPositionForBeat(0);
    expect(pos0.currentMeasure).toBe(1);
    expect(pos0.beatInMeasure).toBe(1);

    const pos2 = engine.getPositionForBeat(2.5);
    expect(pos2.currentMeasure).toBe(1);
    expect(pos2.beatInMeasure).toBe(3.5);

    const pos4 = engine.getPositionForBeat(4.0);
    expect(pos4.currentMeasure).toBe(2);
    expect(pos4.beatInMeasure).toBe(1.0);

    const pos7 = engine.getPositionForBeat(7.25);
    expect(pos7.currentMeasure).toBe(2);
    expect(pos7.beatInMeasure).toBe(4.25);
  });

  it('maintains zero phase drift when changing BPM mid-playback', () => {
    engine.play();
    // Advance 2 seconds at 60 BPM = 2 beats
    vi.advanceTimersByTime(2000);
    const beatBefore = engine.getCurrentBeat();
    expect(Math.round(beatBefore)).toBe(2);

    // Change to 120 BPM (2 beats per second)
    engine.setBpm(120);
    expect(Math.round(engine.getCurrentBeat())).toBe(2);

    // Advance 1 second at 120 BPM = +2 beats => total 4 beats
    vi.advanceTimersByTime(1000);
    const beatAfter = engine.getCurrentBeat();
    expect(Math.round(beatAfter)).toBe(4);
    expect(engine.getPosition().currentMeasure).toBe(2);
    expect(Math.round(engine.getPosition().beatInMeasure)).toBe(1);
  });

  it('locks metronome phase to current measure when enabled mid-playback', () => {
    engine.play();
    // Advance to Measure 1, Beat 2.5 (1500ms at 60 BPM)
    vi.advanceTimersByTime(1500);
    expect(engine.getCurrentBeat()).toBeCloseTo(1.5, 1);

    const metronomePlan = engine.calculateNextMetronomeTick();
    // Next tick should be beat 2.0 (relative to 0, which is beat 3 of measure 1)
    expect(metronomePlan.targetBeat).toBe(2);
    expect(metronomePlan.targetMeasure).toBe(1);
    expect(metronomePlan.targetBeatInMeasure).toBe(3);
    expect(metronomePlan.isDownbeat).toBe(false); // Beat 3 is regular click

    // The downbeat must be beat 4.0 (relative to 0, which is beat 1 of measure 2)
    const downbeatPlan = engine.calculateNextDownbeatTick();
    expect(downbeatPlan.targetBeat).toBe(4);
    expect(downbeatPlan.targetMeasure).toBe(2);
    expect(downbeatPlan.targetBeatInMeasure).toBe(1);
    expect(downbeatPlan.isDownbeat).toBe(true);
  });

  it('supports ternary 3/4 and compound 6/8 time signatures properly', () => {
    // 3/4: 3 beats per measure
    engine.loadScore(mockNotes, '3/4', 90);
    expect(engine.getBeatsPerMeasure()).toBe(3);

    const posMeasure2 = engine.getPositionForBeat(3.0);
    expect(posMeasure2.currentMeasure).toBe(2);
    expect(posMeasure2.beatInMeasure).toBe(1.0);

    // 6/8: 2 dotted-quarter beats per measure
    engine.loadScore(mockNotes, '6/8', 60);
    expect(engine.getBeatsPerMeasure()).toBe(2);

    const pos68 = engine.getPositionForBeat(2.0);
    expect(pos68.currentMeasure).toBe(2);
    expect(pos68.beatInMeasure).toBe(1.0);
  });

  it('preserves synchronization on seekToMeasure and seekToBeat', () => {
    engine.seekToMeasure(3); // Measure 3 at 4/4 starts at beat 8
    expect(engine.getCurrentBeat()).toBe(8);
    const pos = engine.getPosition();
    expect(pos.currentMeasure).toBe(3);
    expect(pos.beatInMeasure).toBe(1.0);

    engine.seekToBeat(5.5);
    const posHalf = engine.getPosition();
    expect(posHalf.currentMeasure).toBe(2);
    expect(posHalf.beatInMeasure).toBe(2.5);
  });

  it('coordinates with metronomeEngine as single source of time without dual clocks', () => {
    // When score metronome is enabled and playback starts
    engine.setMetronomeEnabled(true);
    engine.play(0);

    // metronomeEngine must be in playback-driven mode
    expect(metronomeEngine.getIsPlaybackDriven()).toBe(true);

    // Calling metronomeEngine.start() in playback-driven mode must not launch independent setInterval timer
    metronomeEngine.start({ bpm: 60, timeSignature: '4/4' });
    expect(metronomeEngine.getIsPlaybackDriven()).toBe(true);

    // Advance 1 second = 1 beat
    vi.advanceTimersByTime(1000);
    expect(engine.getCurrentBeat()).toBeCloseTo(1, 0);

    // Pausing resets playback-driven mode
    engine.pause();
    expect(metronomeEngine.getIsPlaybackDriven()).toBe(false);
  });

  it('notifica onTrackEnded e reseta estado ao atingir o fim da partitura no modo end (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.2)', () => {
    const trackEndedSpy = vi.fn();
    const stateSpy = vi.fn();
    engine.onTrackEnded(trackEndedSpy);
    engine.onStateChange(stateSpy);
    engine.setLoopMode('end');

    engine.play(0);
    expect(engine.getIsPlaying()).toBe(true);

    // mockNotes: 5 notas com durações de 1 beat em 4/4 => totalScoreBeats = 5 beats
    // A 60 BPM, 1 beat = 1000ms. 5.5 beats = 5500ms
    vi.advanceTimersByTime(5600);

    expect(trackEndedSpy).toHaveBeenCalled();
    expect(engine.getIsPlaying()).toBe(false);
    expect(engine.getPosition().currentBeat).toBe(0);
    expect(engine.getPosition().currentMeasure).toBe(1);
    expect(engine.getPosition().beatInMeasure).toBe(1);

    // Valida Cenário 3 (BDD): Replay Consecutivo com 1 Clique do Início
    engine.play(0);
    expect(engine.getIsPlaying()).toBe(true);
    expect(engine.getPosition().currentBeat).toBe(0);
  });

  it('preserva o playback ativo de forma transparente e contínua ao alterar opções da barra de ferramentas (REQ-BUG-TOOLBAR-AUDIO-PLAYBACK)', () => {
    engine.play(0);
    expect(engine.getIsPlaying()).toBe(true);

    // Avança 1 segundo (1 beat a 60 BPM)
    vi.advanceTimersByTime(1000);
    const beatBefore = engine.getCurrentBeat();
    expect(Math.round(beatBefore)).toBe(1);

    // 1. Altera sustain mid-playback
    engine.setSustainMode('chords');
    expect(engine.getIsPlaying()).toBe(true);

    // 2. Altera instrumento mid-playback
    engine.setInstrument('guitar');
    expect(engine.getIsPlaying()).toBe(true);

    // 3. Altera metrônomo mid-playback
    engine.setMetronomeEnabled(true);
    expect(engine.getIsPlaying()).toBe(true);

    // 4. Altera modo de repetição/fim mid-playback
    engine.setLoopMode('repeat');
    expect(engine.getIsPlaying()).toBe(true);

    // 5. Re-execução de loadScore com a mesma partitura (ex: re-render de componente pai)
    engine.loadScore(mockNotes, '4/4', 80);
    expect(engine.getIsPlaying()).toBe(true);
    expect(engine.getBpm()).toBe(80);
    expect(Math.round(engine.getCurrentBeat())).toBe(1);
  });
});
