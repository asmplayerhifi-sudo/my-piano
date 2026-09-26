/**
 * core/scorePracticeEngine.ts
 *
 * Maquina de estados pura da Pratica de Partitura.
 *
 * Responsabilidades:
 *  - Definir os dois modos formais de pratica: Leitura (Wait) e Tempo.
 *  - Gerenciar a sequencia de notas esperadas e o indice ativo.
 *  - Validar entradas contra a nota esperada sem qualquer side effect de UI ou audio.
 *  - Registrar eventos de acerto e erro sem alterar o indice em caso de erro
 *    (Criterio 2 e 4: nota errada NAO avanca, e apenas registrada como erro).
 *  - Calcular a dificuldade progressiva do Modo Tempo.
 *
 * Restricoes:
 *  - Proibido importar React, soundEngine, midiManager ou qualquer modulo externo.
 *    A engine e testavel em ambiente Node puro (vitest).
 *  - Proibido realizar avanco automatico por decurso de tempo no Modo Leitura.
 */

// --- Tipos Publicos ----------------------------------------------------------

export type ScorePracticeMode = 'read' | 'tempo';

export type ReadModeEvalResult =
  | { outcome: 'correct'; advancedToIndex: number; isComplete: boolean }
  | { outcome: 'wrong'; playedMidi: number; expectedMidi: number; staysAtIndex: number }
  | { outcome: 'ignored' };

export type TempoModeEvalResult =
  | { outcome: 'on_time'; diffMs: number; advancedToIndex: number; isComplete: boolean }
  | { outcome: 'off_time'; diffMs: number; grade: 'good' | 'off_time'; advancedToIndex: number; isComplete: boolean }
  | { outcome: 'missed'; expectedMidi: number; staysAtIndex: number }
  | { outcome: 'wrong'; playedMidi: number; expectedMidi: number; staysAtIndex: number }
  | { outcome: 'ignored' };

export interface ScorePracticeError {
  playedMidi: number;
  expectedMidi: number;
  timestamp: number;
}

export interface TempoProgressionConfig {
  startBpm: number;
  maxBpm: number;
  hitsPerStep: number;
  bpmIncrement: number;
  toleranceMs: number;
}

export interface ScorePracticeState {
  mode: ScorePracticeMode;
  isActive: boolean;
  currentIndex: number;
  totalNotes: number;
  currentBpm: number;
  consecutiveHits: number;
  lastError: ScorePracticeError | null;
  isComplete: boolean;
}

// --- Engine ------------------------------------------------------------------

export class ScorePracticeEngine {
  private state: ScorePracticeState;
  private readonly noteMidis: number[];
  private readonly progressionConfig: TempoProgressionConfig;

  constructor(
    noteMidis: number[],
    mode: ScorePracticeMode = 'read',
    progressionConfig: Partial<TempoProgressionConfig> = {}
  ) {
    if (noteMidis.length === 0) {
      throw new Error('ScorePracticeEngine: noteMidis nao pode ser vazio.');
    }

    this.noteMidis = [...noteMidis];
    this.progressionConfig = {
      startBpm: progressionConfig.startBpm ?? 60,
      maxBpm: progressionConfig.maxBpm ?? 120,
      hitsPerStep: progressionConfig.hitsPerStep ?? 4,
      bpmIncrement: progressionConfig.bpmIncrement ?? 5,
      toleranceMs: progressionConfig.toleranceMs ?? 150,
    };

    this.state = {
      mode,
      isActive: false,
      currentIndex: 0,
      totalNotes: noteMidis.length,
      currentBpm: this.progressionConfig.startBpm,
      consecutiveHits: 0,
      lastError: null,
      isComplete: false,
    };
  }

  getState(): Readonly<ScorePracticeState> {
    return { ...this.state };
  }

  getExpectedMidi(): number | null {
    if (this.state.isComplete || this.state.currentIndex >= this.noteMidis.length) {
      return null;
    }
    return this.noteMidis[this.state.currentIndex];
  }

  start(): void {
    if (this.state.isComplete) return;
    this.state = { ...this.state, isActive: true, lastError: null };
  }

  stop(): void {
    this.state = { ...this.state, isActive: false };
  }

  reset(): void {
    this.state = {
      mode: this.state.mode,
      isActive: false,
      currentIndex: 0,
      totalNotes: this.noteMidis.length,
      currentBpm: this.progressionConfig.startBpm,
      consecutiveHits: 0,
      lastError: null,
      isComplete: false,
    };
  }

  setMode(mode: ScorePracticeMode): void {
    this.state = {
      ...this.state,
      mode,
      isActive: false,
      currentIndex: 0,
      currentBpm: this.progressionConfig.startBpm,
      consecutiveHits: 0,
      lastError: null,
      isComplete: false,
    };
  }

  evaluateNoteRead(playedMidi: number): ReadModeEvalResult {
    if (!this.state.isActive || this.state.isComplete) {
      return { outcome: 'ignored' };
    }

    const expectedMidi = this.getExpectedMidi();
    if (expectedMidi === null) return { outcome: 'ignored' };

    if (playedMidi === expectedMidi) {
      const nextIndex = this.state.currentIndex + 1;
      const isComplete = nextIndex >= this.noteMidis.length;
      this.state = {
        ...this.state,
        currentIndex: nextIndex,
        consecutiveHits: this.state.consecutiveHits + 1,
        lastError: null,
        isComplete,
      };
      return { outcome: 'correct', advancedToIndex: nextIndex, isComplete };
    }

    const error: ScorePracticeError = { playedMidi, expectedMidi, timestamp: Date.now() };
    this.state = { ...this.state, consecutiveHits: 0, lastError: error };
    return { outcome: 'wrong', playedMidi, expectedMidi, staysAtIndex: this.state.currentIndex };
  }

  evaluateNoteTempo(
    playedMidi: number,
    actualTimeMs: number,
    expectedTimeMs: number
  ): TempoModeEvalResult {
    if (!this.state.isActive || this.state.isComplete) {
      return { outcome: 'ignored' };
    }

    const expectedMidi = this.getExpectedMidi();
    if (expectedMidi === null) return { outcome: 'ignored' };

    if (playedMidi !== expectedMidi) {
      const error: ScorePracticeError = { playedMidi, expectedMidi, timestamp: Date.now() };
      this.state = { ...this.state, consecutiveHits: 0, lastError: error };
      return { outcome: 'wrong', playedMidi, expectedMidi, staysAtIndex: this.state.currentIndex };
    }

    const diffMs = actualTimeMs - expectedTimeMs;
    const absDiff = Math.abs(diffMs);
    const { toleranceMs } = this.progressionConfig;
    const nextIndex = this.state.currentIndex + 1;
    const isComplete = nextIndex >= this.noteMidis.length;
    const consecutiveHits = this.state.consecutiveHits + 1;
    const newBpm = this.computeNextBpm(consecutiveHits);

    this.state = {
      ...this.state,
      currentIndex: nextIndex,
      consecutiveHits,
      currentBpm: newBpm,
      lastError: null,
      isComplete,
    };

    if (absDiff <= toleranceMs) {
      return { outcome: 'on_time', diffMs, advancedToIndex: nextIndex, isComplete };
    }
    return {
      outcome: 'off_time',
      diffMs,
      grade: absDiff <= toleranceMs * 2.5 ? 'good' : 'off_time',
      advancedToIndex: nextIndex,
      isComplete,
    };
  }

  noteMissed(): TempoModeEvalResult {
    if (!this.state.isActive || this.state.isComplete) {
      return { outcome: 'ignored' };
    }

    const expectedMidi = this.getExpectedMidi();
    if (expectedMidi === null) return { outcome: 'ignored' };

    const error: ScorePracticeError = { playedMidi: -1, expectedMidi, timestamp: Date.now() };
    this.state = { ...this.state, consecutiveHits: 0, lastError: error };
    return { outcome: 'missed', expectedMidi, staysAtIndex: this.state.currentIndex };
  }

  clearError(): void {
    this.state = { ...this.state, lastError: null };
  }

  private computeNextBpm(consecutiveHits: number): number {
    const { startBpm, maxBpm, hitsPerStep, bpmIncrement } = this.progressionConfig;
    const steps = Math.floor(consecutiveHits / hitsPerStep);
    return Math.min(maxBpm, startBpm + steps * bpmIncrement);
  }

  static computeDifficultyScore(midis: number[], durations: number[]): number {
    if (midis.length === 0) return 0;
    const lengthFactor = midis.length;
    let totalInterval = 0;
    for (let i = 1; i < midis.length; i++) {
      totalInterval += Math.abs(midis[i] - midis[i - 1]);
    }
    const avgInterval = midis.length > 1 ? totalInterval / (midis.length - 1) : 0;
    const minDuration = durations.length > 0 ? Math.min(...durations) : 1;
    const rhythmPenalty = minDuration <= 0.5 ? 2.0 : minDuration <= 1 ? 1.0 : 0.5;
    return lengthFactor * (1 + avgInterval / 12) * rhythmPenalty;
  }
}
