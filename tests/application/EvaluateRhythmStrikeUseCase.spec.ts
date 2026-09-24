import { describe, it, expect } from 'vitest';
import { EvaluateRhythmStrikeUseCase } from '../../src/application/use-cases/EvaluateRhythmStrikeUseCase';

describe('EvaluateRhythmStrikeUseCase', () => {
  const useCase = new EvaluateRhythmStrikeUseCase();

  it('deve classificar como PERFECT e atribuir 100 pontos para toque dentro de 25ms', () => {
    const result = useCase.execute({
      expectedTimeMs: 1000,
      actualTimeMs: 1012, // +12ms
      currentBpm: 60,
    });

    expect(result.grade).toBe('PERFECT');
    expect(result.scorePoints).toBe(100);
    expect(result.isEarly).toBe(false);
    expect(result.isLate).toBe(false);
  });

  it('deve classificar como GOOD e atribuir 70 pontos para toque entre 25ms e 60ms', () => {
    const result = useCase.execute({
      expectedTimeMs: 1000,
      actualTimeMs: 1045, // +45ms
      currentBpm: 60,
    });

    expect(result.grade).toBe('GOOD');
    expect(result.scorePoints).toBe(70);
    expect(result.isLate).toBe(true);
  });

  it('deve classificar como OFF_TIME e marcar isEarly como true para toque adiantado além de 60ms', () => {
    const result = useCase.execute({
      expectedTimeMs: 2000,
      actualTimeMs: 1930, // -70ms
      currentBpm: 80,
    });

    expect(result.grade).toBe('OFF_TIME');
    expect(result.scorePoints).toBe(30);
    expect(result.isEarly).toBe(true);
    expect(result.isLate).toBe(false);
  });
});
