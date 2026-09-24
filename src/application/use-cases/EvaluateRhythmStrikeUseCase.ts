/**
 * Caso de Uso: EvaluateRhythmStrikeUseCase
 * Avalia a precisão temporal do toque em milissegundos segundo a janela de tolerância rítmica.
 * Regra: SRP, isolamento de domínio (< 75 linhas).
 */

import type { PerformanceGrade, PerformanceEvaluation } from '../../domain/entities/MetricMeasure';

export interface RhythmStrikeInput {
  readonly expectedTimeMs: number;
  readonly actualTimeMs: number;
  readonly currentBpm: number;
  readonly perfectWindowMs?: number;
  readonly goodWindowMs?: number;
}

export class EvaluateRhythmStrikeUseCase {
  private readonly DEFAULT_PERFECT_WINDOW_MS = 25.0;
  private readonly DEFAULT_GOOD_WINDOW_MS = 60.0;

  public execute(input: RhythmStrikeInput): PerformanceEvaluation {
    const deltaMs = input.actualTimeMs - input.expectedTimeMs;
    const absDelta = Math.abs(deltaMs);
    const perfectWindow = input.perfectWindowMs ?? this.DEFAULT_PERFECT_WINDOW_MS;
    const goodWindow = input.goodWindowMs ?? this.DEFAULT_GOOD_WINDOW_MS;

    let grade: PerformanceGrade = 'MISSED';
    let points = 0;

    if (absDelta <= perfectWindow) {
      grade = 'PERFECT';
      points = 100;
    } else if (absDelta <= goodWindow) {
      grade = 'GOOD';
      points = 70;
    } else if (absDelta <= 120.0) {
      grade = 'OFF_TIME';
      points = 30;
    }

    return {
      timeDeltaMs: deltaMs,
      grade,
      scorePoints: points,
      isEarly: deltaMs < -perfectWindow,
      isLate: deltaMs > perfectWindow,
    };
  }
}
