/**
 * Entidade de Domínio: MetricMeasure
 * Modelagem imutável de precisão rítmica e subdivisões temporais.
 * Regra: Domínio puro, sem dependências de frameworks (< 80 linhas).
 */

export type PerformanceGrade = 'PERFECT' | 'GOOD' | 'OFF_TIME' | 'MISSED';

export interface PerformanceEvaluation {
  readonly timeDeltaMs: number;
  readonly grade: PerformanceGrade;
  readonly scorePoints: number;
  readonly isEarly: boolean;
  readonly isLate: boolean;
}

export interface MetricTimeSignature {
  readonly numerator: number;
  readonly denominator: number;
  readonly beatsPerMeasure: number;
}

export class MetricMeasure {
  public static parseTimeSignature(timeSignature = '4/4'): MetricTimeSignature {
    const parts = timeSignature.split('/');
    const numerator = parseInt(parts[0], 10) || 4;
    const denominator = parseInt(parts[1], 10) || 4;
    let beatsPerMeasure = numerator;

    if (denominator === 8 && numerator >= 6) {
      beatsPerMeasure = numerator / 3;
    }

    return { numerator, denominator, beatsPerMeasure };
  }

  public static calculateBeatDurationMs(bpm: number): number {
    if (bpm <= 0) return 1000;
    return (60 / bpm) * 1000;
  }
}
