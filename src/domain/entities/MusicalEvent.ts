/**
 * Entidade de Domínio: MusicalEvent
 * Modela o ciclo de vida completo de uma execução musical (nota individual ou acorde).
 *
 * Avalia de forma integrada:
 * 1. Nota(s) / Altura ou Cifra Harmônica;
 * 2. Intensidade / Velocidade (RMS acústico ou MIDI velocity);
 * 3. Duração (tempo sustentado desde o onset até o offset/próxima nota);
 * 4. Timing rítmico (desvio em ms em relação ao tempo esperado na partitura).
 *
 * Regra: Domínio puro, imutável e sem dependências de frameworks.
 */

import type { IdentifiedChord } from '../../core/musicTheory';

export type MusicalEventType = 'single_note' | 'chord';
export type MusicalEventPhase = 'tracking' | 'evaluating' | 'finalized';
export type MusicalGrade = 'PERFECT' | 'GOOD' | 'OFF_TIME' | 'WRONG_NOTE' | 'WRONG_CHORD' | 'MISSED';

export interface MusicalEventInput {
  readonly id: string;
  readonly type: MusicalEventType;
  readonly phase: MusicalEventPhase;
  readonly startTimeMs: number;
  readonly endTimeMs: number;
  readonly durationMs: number;
  readonly expectedTimeMs?: number;
  readonly expectedDurationMs?: number;
  readonly timeDeltaMs?: number;
  readonly playedMidis: readonly number[];
  readonly primaryMidi: number;
  readonly expectedMidi?: number;
  readonly expectedChordName?: string;
  readonly identifiedChord?: IdentifiedChord | null;
  readonly peakIntensity: number;
  readonly averageIntensity: number;
  readonly isPitchOrChordMatch: boolean;
  readonly grade: MusicalGrade;
  readonly scorePoints: number;
  readonly feedbackMessage: string;
}

export class MusicalEvent {
  public readonly id: string;
  public readonly type: MusicalEventType;
  public readonly phase: MusicalEventPhase;
  public readonly startTimeMs: number;
  public readonly endTimeMs: number;
  public readonly durationMs: number;
  public readonly expectedTimeMs?: number;
  public readonly expectedDurationMs?: number;
  public readonly timeDeltaMs?: number;
  public readonly playedMidis: readonly number[];
  public readonly primaryMidi: number;
  public readonly expectedMidi?: number;
  public readonly expectedChordName?: string;
  public readonly identifiedChord?: IdentifiedChord | null;
  public readonly peakIntensity: number;
  public readonly averageIntensity: number;
  public readonly isPitchOrChordMatch: boolean;
  public readonly grade: MusicalGrade;
  public readonly scorePoints: number;
  public readonly feedbackMessage: string;

  constructor(input: MusicalEventInput) {
    this.id = input.id;
    this.type = input.type;
    this.phase = input.phase;
    this.startTimeMs = input.startTimeMs;
    this.endTimeMs = input.endTimeMs;
    this.durationMs = Math.max(0, input.durationMs);
    this.expectedTimeMs = input.expectedTimeMs;
    this.expectedDurationMs = input.expectedDurationMs;
    this.timeDeltaMs = input.timeDeltaMs;
    this.playedMidis = Object.freeze([...input.playedMidis]);
    this.primaryMidi = input.primaryMidi;
    this.expectedMidi = input.expectedMidi;
    this.expectedChordName = input.expectedChordName;
    this.identifiedChord = input.identifiedChord ?? null;
    this.peakIntensity = input.peakIntensity;
    this.averageIntensity = input.averageIntensity;
    this.isPitchOrChordMatch = input.isPitchOrChordMatch;
    this.grade = input.grade;
    this.scorePoints = input.scorePoints;
    this.feedbackMessage = input.feedbackMessage;
  }

  /**
   * Calcula a proporção entre a duração sustentada e a duração esperada na partitura.
   */
  public get durationRatio(): number | null {
    if (!this.expectedDurationMs || this.expectedDurationMs <= 0) return null;
    return this.durationMs / this.expectedDurationMs;
  }
}
