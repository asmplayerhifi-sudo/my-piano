import { describe, it, expect, vi } from 'vitest';
import { MicrophonePitchDetector } from '../../src/core/pitchDetector';
import { EvaluateRhythmStrikeUseCase } from '../../src/application/use-cases/EvaluateRhythmStrikeUseCase';

describe('RhythmAudioInputOutput & Protocolo Cinestésico', () => {
  it('deve validar thresholds de sensibilidade de captação acústica', () => {
    const detector = new MicrophonePitchDetector();
    detector.setSensitivity(0.03);
    expect(detector.getSensitivity()).toBeCloseTo(0.03, 3);

    // Limites de segurança
    detector.setSensitivity(0.001); // abaixo do mínimo
    expect(detector.getSensitivity()).toBeGreaterThanOrEqual(0.005);

    detector.setSensitivity(0.5); // acima do máximo
    expect(detector.getSensitivity()).toBeLessThanOrEqual(0.08);
  });

  it('deve converter corretamente percentual para threshold de sensibilidade e vice-versa', () => {
    const thresh50 = MicrophonePitchDetector.percentToThreshold(50);
    const perc50 = MicrophonePitchDetector.thresholdToPercent(thresh50);
    expect(perc50).toBe(50);
  });

  it('deve avaliar toque rítmico percussivo genérico com sucesso na janela de tolerância', () => {
    const useCase = new EvaluateRhythmStrikeUseCase();
    const evaluation = useCase.execute({
      expectedTimeMs: 500,
      actualTimeMs: 510,
      currentBpm: 90,
      goodWindowMs: 70,
    });

    expect(evaluation.grade).toBe('PERFECT');
    expect(evaluation.scorePoints).toBe(100);
  });

  it('deve registrar toque adiantado ou atrasado quando fora da tolerância estrita', () => {
    const useCase = new EvaluateRhythmStrikeUseCase();
    const earlyEval = useCase.execute({
      expectedTimeMs: 1000,
      actualTimeMs: 920,
      currentBpm: 120,
      goodWindowMs: 50,
    });

    expect(earlyEval.grade).toBe('OFF_TIME');
    expect(earlyEval.isEarly).toBe(true);
  });
});
