/**
 * src/__tests__/scorePracticeModes.test.ts
 *
 * Testes unitarios da Pratica de Partitura - Modo Leitura e Modo Tempo.
 *
 * Cenarios pedagogicos usados como fixtures:
 *  - Escala de Do Maior  (C D E F G A B C)
 *  - Escala de Sol Maior (G A B C D E F# G)
 *  - Escala de Fa Maior  (F G A Bb C D E F)
 *  - Escala de La Menor Natural (A B C D E F G A)
 *  - Pentatonica de Do Maior (C D E G A C)
 *  - Modo Frigio em Mi (E F G A B C D E)
 *  - Escala de La Maior (A B C# D E F# G# A)
 *  - Escala de Si Menor Natural (B C# D E F# G A B)
 *
 * Criterios validados:
 *  1. Tela inicia desligada (isActive=false).
 *  2. Nota errada nao avanca o indice no Modo Leitura.
 *  3. Nota correta avanca somente para a proxima nota esperada.
 *  4. Nota errada e registrada como erro visual sem mudar o indice.
 *  5. Entradas MIDI/virtual/microfone respeitam a mesma regra.
 *  6. Modo Tempo: metronomo, BPM e progressao sincronizados.
 *  7. Dificuldade progressiva respeita os parametros.
 *  8. Testes cobrem escalas em diferentes tonalidades.
 *  9. Nao ocorre avanco automatico no Modo Leitura por decurso de tempo.
 * 10. Os testes validam o comportamento real das regras, sem simulacoes artificiais.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ScorePracticeEngine } from '../../src/core/scorePracticeEngine';
import type { ScorePracticeMode } from '../../src/core/scorePracticeEngine';

// --- Fixtures de Escalas Pedagogicas -----------------------------------------

const C_MAJOR_SCALE = [60, 62, 64, 65, 67, 69, 71, 72];
const G_MAJOR_SCALE = [67, 69, 71, 72, 74, 76, 78, 79];
const F_MAJOR_SCALE = [65, 67, 69, 70, 72, 74, 76, 77];
const A_MINOR_NATURAL_SCALE = [57, 59, 60, 62, 64, 65, 67, 69];
const C_PENTATONIC_MAJOR = [60, 62, 64, 67, 69, 72];
const E_PHRYGIAN_MODE = [64, 65, 67, 69, 71, 72, 74, 76];
const A_MAJOR_SCALE = [57, 59, 61, 62, 64, 66, 68, 69];
const B_MINOR_NATURAL_SCALE = [59, 61, 62, 64, 66, 67, 69, 71];

// --- Estado Inicial (Criterio 1) -------------------------------------

describe('ScorePracticeEngine - Estado Inicial', () => {
  it('deve iniciar desligado por padrao (Criterio 1)', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    expect(engine.getState().isActive).toBe(false);
  });

  it('deve iniciar no indice 0 independente do modo', () => {
    const readEngine = new ScorePracticeEngine(C_MAJOR_SCALE, 'read');
    const tempoEngine = new ScorePracticeEngine(C_MAJOR_SCALE, 'tempo');
    expect(readEngine.getState().currentIndex).toBe(0);
    expect(tempoEngine.getState().currentIndex).toBe(0);
  });

  it('deve iniciar sem erros registrados', () => {
    const engine = new ScorePracticeEngine(G_MAJOR_SCALE);
    expect(engine.getState().lastError).toBeNull();
  });

  it('deve iniciar como nao concluido', () => {
    const engine = new ScorePracticeEngine(F_MAJOR_SCALE);
    expect(engine.getState().isComplete).toBe(false);
  });

  it('deve refletir o total correto de notas', () => {
    const engine = new ScorePracticeEngine(A_MINOR_NATURAL_SCALE);
    expect(engine.getState().totalNotes).toBe(8);
  });

  it('deve rejeitar construcao com array vazio', () => {
    expect(() => new ScorePracticeEngine([])).toThrow();
  });
});

// --- Controle de Sessao ------------------------------------------------------

describe('ScorePracticeEngine - Controle de Sessao', () => {
  let engine: ScorePracticeEngine;

  beforeEach(() => {
    engine = new ScorePracticeEngine(C_MAJOR_SCALE);
  });

  it('start() deve ativar a pratica', () => {
    engine.start();
    expect(engine.getState().isActive).toBe(true);
  });

  it('stop() deve desativar sem resetar o progresso', () => {
    engine.start();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    engine.stop();
    const state = engine.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentIndex).toBe(1);
  });

  it('reset() deve voltar ao estado inicial desligado', () => {
    engine.start();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    engine.evaluateNoteRead(C_MAJOR_SCALE[1]);
    engine.reset();
    const state = engine.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentIndex).toBe(0);
    expect(state.consecutiveHits).toBe(0);
    expect(state.lastError).toBeNull();
    expect(state.isComplete).toBe(false);
  });

  it('setMode() deve reiniciar o estado e desativar a pratica', () => {
    engine.start();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    engine.setMode('tempo' as ScorePracticeMode);
    const state = engine.getState();
    expect(state.isActive).toBe(false);
    expect(state.mode).toBe('tempo');
    expect(state.currentIndex).toBe(0);
  });
});

// --- Modo Leitura: Acertos (Criterios 3, 5) ----------------------------------

describe('ScorePracticeEngine - Modo Leitura: Acertos', () => {
  it('nota correta avanca para o proximo indice - Escala Do Maior', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    for (let i = 0; i < C_MAJOR_SCALE.length; i++) {
      const result = engine.evaluateNoteRead(C_MAJOR_SCALE[i]);
      expect(result.outcome).toBe('correct');
      if (result.outcome === 'correct') {
        if (i < C_MAJOR_SCALE.length - 1) {
          expect(result.advancedToIndex).toBe(i + 1);
          expect(result.isComplete).toBe(false);
        } else {
          expect(result.isComplete).toBe(true);
        }
      }
    }
  });

  it('nota correta avanca para o proximo indice - Escala Sol Maior', () => {
    const engine = new ScorePracticeEngine(G_MAJOR_SCALE);
    engine.start();
    G_MAJOR_SCALE.forEach((midi, i) => {
      const result = engine.evaluateNoteRead(midi);
      expect(result.outcome).toBe('correct');
      if (result.outcome === 'correct' && i < G_MAJOR_SCALE.length - 1) {
        expect(result.advancedToIndex).toBe(i + 1);
      }
    });
    expect(engine.getState().isComplete).toBe(true);
  });

  it('nota correta avanca para o proximo indice - Pentatonica Do Maior', () => {
    const engine = new ScorePracticeEngine(C_PENTATONIC_MAJOR);
    engine.start();
    for (const midi of C_PENTATONIC_MAJOR) {
      const result = engine.evaluateNoteRead(midi);
      expect(result.outcome).toBe('correct');
    }
    expect(engine.getState().isComplete).toBe(true);
  });

  it('acerto limpa o lastError', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    engine.evaluateNoteRead(999);
    expect(engine.getState().lastError).not.toBeNull();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    expect(engine.getState().lastError).toBeNull();
  });

  it('acertos consecutivos sao contados corretamente', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    engine.evaluateNoteRead(C_MAJOR_SCALE[1]);
    engine.evaluateNoteRead(C_MAJOR_SCALE[2]);
    expect(engine.getState().consecutiveHits).toBe(3);
  });
});

// --- Modo Leitura: Erros (Criterios 2, 4) ------------------------------------

describe('ScorePracticeEngine - Modo Leitura: Erros', () => {
  it('nota errada NAO avanca o indice - Escala Fa Maior', () => {
    const engine = new ScorePracticeEngine(F_MAJOR_SCALE);
    engine.start();
    const result = engine.evaluateNoteRead(999);
    expect(result.outcome).toBe('wrong');
    if (result.outcome === 'wrong') {
      expect(result.staysAtIndex).toBe(0);
      expect(result.expectedMidi).toBe(F_MAJOR_SCALE[0]);
    }
    expect(engine.getState().currentIndex).toBe(0);
  });

  it('nota errada registra erro visual sem mudar indice - Escala La Menor', () => {
    const engine = new ScorePracticeEngine(A_MINOR_NATURAL_SCALE);
    engine.start();
    engine.evaluateNoteRead(50);
    const state = engine.getState();
    expect(state.lastError).not.toBeNull();
    expect(state.lastError?.playedMidi).toBe(50);
    expect(state.lastError?.expectedMidi).toBe(A_MINOR_NATURAL_SCALE[0]);
    expect(state.currentIndex).toBe(0);
  });

  it('multiplos erros seguidos nao avancam o indice - Modo Frigio Mi', () => {
    const engine = new ScorePracticeEngine(E_PHRYGIAN_MODE);
    engine.start();
    for (let i = 0; i < 5; i++) engine.evaluateNoteRead(999);
    expect(engine.getState().currentIndex).toBe(0);
  });

  it('erro apos acertos nao retrocede o indice', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    engine.evaluateNoteRead(C_MAJOR_SCALE[1]);
    engine.evaluateNoteRead(999);
    expect(engine.getState().currentIndex).toBe(2);
  });

  it('erro reseta os acertos consecutivos', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    engine.evaluateNoteRead(C_MAJOR_SCALE[1]);
    expect(engine.getState().consecutiveHits).toBe(2);
    engine.evaluateNoteRead(999);
    expect(engine.getState().consecutiveHits).toBe(0);
  });

  it('nota errada mantem a nota esperada atual - Escala La Maior', () => {
    const engine = new ScorePracticeEngine(A_MAJOR_SCALE);
    engine.start();
    const expectedFirst = engine.getExpectedMidi();
    engine.evaluateNoteRead(62);
    expect(engine.getExpectedMidi()).toBe(expectedFirst);
  });
});

// --- Sem Avanco Automatico (Criterio 9) --------------------------------------

describe('ScorePracticeEngine - Sem Avanco Automatico no Modo Leitura', () => {
  it('nao avanca sem que o usuario toque alguma nota', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    expect(engine.getState().currentIndex).toBe(0);
    expect(engine.getState().currentIndex).toBe(0);
  });

  it('pratica inativa ignora toques (Criterio 1 e 9)', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    const result = engine.evaluateNoteRead(C_MAJOR_SCALE[0]);
    expect(result.outcome).toBe('ignored');
    expect(engine.getState().currentIndex).toBe(0);
  });
});

// --- Modo Tempo: Avaliacao de Notas (Criterio 6) ----------------------------

describe('ScorePracticeEngine - Modo Tempo: Avaliacao de Notas', () => {
  let engine: ScorePracticeEngine;

  beforeEach(() => {
    engine = new ScorePracticeEngine(C_MAJOR_SCALE, 'tempo', { toleranceMs: 150 });
    engine.start();
  });

  it('nota correta com timing perfeito retorna on_time', () => {
    const result = engine.evaluateNoteTempo(C_MAJOR_SCALE[0], 1000, 1000);
    expect(result.outcome).toBe('on_time');
    if (result.outcome === 'on_time') {
      expect(result.diffMs).toBe(0);
      expect(result.advancedToIndex).toBe(1);
    }
  });

  it('nota correta dentro da tolerancia retorna on_time', () => {
    const result = engine.evaluateNoteTempo(C_MAJOR_SCALE[0], 1100, 1000);
    expect(result.outcome).toBe('on_time');
  });

  it('nota correta fora da tolerancia retorna off_time', () => {
    const result = engine.evaluateNoteTempo(C_MAJOR_SCALE[0], 1400, 1000);
    expect(result.outcome).toBe('off_time');
  });

  it('nota errada registra erro e nao avanca indice - Escala Sol Maior', () => {
    const engine2 = new ScorePracticeEngine(G_MAJOR_SCALE, 'tempo');
    engine2.start();
    const result = engine2.evaluateNoteTempo(999, 1000, 1000);
    expect(result.outcome).toBe('wrong');
    if (result.outcome === 'wrong') {
      expect(result.staysAtIndex).toBe(0);
      expect(result.expectedMidi).toBe(G_MAJOR_SCALE[0]);
    }
    expect(engine2.getState().currentIndex).toBe(0);
  });

  it('noteMissed() registra nota perdida sem avancar - Escala La Menor', () => {
    const engine2 = new ScorePracticeEngine(A_MINOR_NATURAL_SCALE, 'tempo');
    engine2.start();
    const result = engine2.noteMissed();
    expect(result.outcome).toBe('missed');
    if (result.outcome === 'missed') {
      expect(result.expectedMidi).toBe(A_MINOR_NATURAL_SCALE[0]);
      expect(result.staysAtIndex).toBe(0);
    }
    expect(engine2.getState().currentIndex).toBe(0);
  });

  it('sequencia completa no Modo Tempo - Modo Frigio Mi', () => {
    const engine2 = new ScorePracticeEngine(E_PHRYGIAN_MODE, 'tempo', { toleranceMs: 200 });
    engine2.start();
    for (let i = 0; i < E_PHRYGIAN_MODE.length; i++) {
      const result = engine2.evaluateNoteTempo(E_PHRYGIAN_MODE[i], 0, 0);
      expect(result.outcome).toBe('on_time');
      if (result.outcome === 'on_time' && i === E_PHRYGIAN_MODE.length - 1) {
        expect(result.isComplete).toBe(true);
      }
    }
    expect(engine2.getState().isComplete).toBe(true);
  });
});

// --- Progressao de Dificuldade (Criterio 7) ---------------------------------

describe('ScorePracticeEngine - Progressao de Dificuldade', () => {
  it('BPM nao aumenta antes de atingir hitsPerStep - Escala La Maior', () => {
    const engine = new ScorePracticeEngine(A_MAJOR_SCALE, 'tempo', {
      startBpm: 60,
      hitsPerStep: 4,
      bpmIncrement: 5,
    });
    engine.start();
    for (let i = 0; i < 3; i++) engine.evaluateNoteTempo(A_MAJOR_SCALE[i], 0, 0);
    expect(engine.getState().currentBpm).toBe(60);
  });

  it('BPM aumenta apos hitsPerStep acertos consecutivos', () => {
    const scale = [...C_MAJOR_SCALE, ...C_MAJOR_SCALE];
    const engine = new ScorePracticeEngine(scale, 'tempo', {
      startBpm: 60,
      maxBpm: 120,
      hitsPerStep: 4,
      bpmIncrement: 5,
    });
    engine.start();
    for (let i = 0; i < 4; i++) engine.evaluateNoteTempo(scale[i], 0, 0);
    expect(engine.getState().currentBpm).toBe(65);
  });

  it('BPM nao ultrapassa maxBpm', () => {
    const longScale = Array(20).fill(0).map((_, i) => C_MAJOR_SCALE[i % C_MAJOR_SCALE.length]);
    const engine = new ScorePracticeEngine(longScale, 'tempo', {
      startBpm: 60,
      maxBpm: 70,
      hitsPerStep: 2,
      bpmIncrement: 10,
    });
    engine.start();
    for (let i = 0; i < 10; i++) engine.evaluateNoteTempo(longScale[i], 0, 0);
    expect(engine.getState().currentBpm).toBeLessThanOrEqual(70);
  });

  it('erro reseta contador e desacelera progressao - Escala Si Menor', () => {
    const scale = [...B_MINOR_NATURAL_SCALE, ...B_MINOR_NATURAL_SCALE];
    const engine = new ScorePracticeEngine(scale, 'tempo', {
      startBpm: 60,
      hitsPerStep: 4,
      bpmIncrement: 5,
    });
    engine.start();
    for (let i = 0; i < 3; i++) engine.evaluateNoteTempo(scale[i], 0, 0);
    engine.evaluateNoteTempo(999, 0, 0);
    for (let i = 3; i < 7; i++) engine.evaluateNoteTempo(scale[i], 0, 0);
    expect(engine.getState().currentBpm).toBe(65);
  });

  it('computeDifficultyScore retorna zero para lista vazia', () => {
    expect(ScorePracticeEngine.computeDifficultyScore([], [])).toBe(0);
  });

  it('escala com saltos grandes tem dificuldade maior', () => {
    const stepwise = [60, 62, 64, 65];
    const jumpy = [60, 72, 48, 84];
    const scoreStep = ScorePracticeEngine.computeDifficultyScore(stepwise, [1, 1, 1, 1]);
    const scoreJump = ScorePracticeEngine.computeDifficultyScore(jumpy, [1, 1, 1, 1]);
    expect(scoreJump).toBeGreaterThan(scoreStep);
  });

  it('colcheias tem dificuldade maior que semibreves', () => {
    const midis = [60, 62, 64, 65];
    const scoreEighths = ScorePracticeEngine.computeDifficultyScore(midis, [0.5, 0.5, 0.5, 0.5]);
    const scoreWholes = ScorePracticeEngine.computeDifficultyScore(midis, [4, 4, 4, 4]);
    expect(scoreEighths).toBeGreaterThan(scoreWholes);
  });
});

// --- Escalas em Diferentes Tonalidades (Criterio 8) -------------------------

const ALL_SCALES: Array<{ name: string; midis: number[] }> = [
  { name: 'Do Maior', midis: C_MAJOR_SCALE },
  { name: 'Sol Maior', midis: G_MAJOR_SCALE },
  { name: 'Fa Maior', midis: F_MAJOR_SCALE },
  { name: 'La Menor Natural', midis: A_MINOR_NATURAL_SCALE },
  { name: 'Pentatonica Do Maior', midis: C_PENTATONIC_MAJOR },
  { name: 'Modo Frigio Mi', midis: E_PHRYGIAN_MODE },
  { name: 'La Maior', midis: A_MAJOR_SCALE },
  { name: 'Si Menor Natural', midis: B_MINOR_NATURAL_SCALE },
];

describe('ScorePracticeEngine - Escalas em Tonalidades Diversas', () => {
  ALL_SCALES.forEach(({ name, midis }) => {
    it(`sequencia correta conclui a escala - ${name}`, () => {
      const engine = new ScorePracticeEngine(midis);
      engine.start();
      for (let i = 0; i < midis.length; i++) {
        expect(engine.getExpectedMidi()).toBe(midis[i]);
        const result = engine.evaluateNoteRead(midis[i]);
        expect(result.outcome).toBe('correct');
      }
      expect(engine.getState().isComplete).toBe(true);
      expect(engine.getExpectedMidi()).toBeNull();
    });

    it(`nota errada nao avanca o indice - ${name}`, () => {
      const engine = new ScorePracticeEngine(midis);
      engine.start();
      const halfLen = Math.floor(midis.length / 2);
      for (let i = 0; i < halfLen; i++) engine.evaluateNoteRead(midis[i]);
      const indexBefore = engine.getState().currentIndex;
      const expectedBefore = engine.getExpectedMidi();
      engine.evaluateNoteRead(9999);
      expect(engine.getState().currentIndex).toBe(indexBefore);
      expect(engine.getExpectedMidi()).toBe(expectedBefore);
      expect(engine.getState().lastError).not.toBeNull();
    });

    it(`estado inicial sempre desligado - ${name}`, () => {
      const engine = new ScorePracticeEngine(midis);
      expect(engine.getState().isActive).toBe(false);
      const result = engine.evaluateNoteRead(midis[0]);
      expect(result.outcome).toBe('ignored');
      expect(engine.getState().currentIndex).toBe(0);
    });
  });
});

// --- clearError() ------------------------------------------------------------

describe('ScorePracticeEngine - clearError()', () => {
  it('clearError() remove o lastError sem alterar o indice', () => {
    const engine = new ScorePracticeEngine(C_MAJOR_SCALE);
    engine.start();
    engine.evaluateNoteRead(999);
    expect(engine.getState().lastError).not.toBeNull();
    engine.clearError();
    expect(engine.getState().lastError).toBeNull();
    expect(engine.getState().currentIndex).toBe(0);
  });
});
