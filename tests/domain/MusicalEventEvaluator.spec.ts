import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MusicalEventEvaluator } from '../../src/core/musicalEventEvaluator';
import { MusicalEvent } from '../../src/domain/entities/MusicalEvent';

describe('MusicalEventEvaluator - Ciclo de Vida do Evento Musical Completo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve iniciar acompanhamento de uma nota sem emitir erro prematuro', () => {
    const evaluator = new MusicalEventEvaluator();
    evaluator.setTarget({ midi: 60, expectedTimeMs: 1000 });

    // Usuário ataca C3 (MIDI 60) no tempo t = 1000ms
    const onFinalized = vi.fn();
    evaluator.onEventFinalized = onFinalized;

    const res = evaluator.feedNote(60, 0.8, 1000);

    expect(res.isNewEvent).toBe(true);
    expect(res.event.primaryMidi).toBe(60);
    expect(res.event.playedMidis.has(60)).toBe(true);
    // Ainda está em tracking, não finalizou nem emitiu erro
    expect(onFinalized).not.toHaveBeenCalled();
    expect(evaluator.getActiveEvent()).not.toBeNull();
  });

  it('deve agrupar notas de um acorde na janela de detecção harmônica', () => {
    const evaluator = new MusicalEventEvaluator({ chordWindowMs: 300 });
    evaluator.setTarget({ chordName: 'C' });

    // Usuário toca as 3 notas de Dó Maior (C=60, E=64, G=67) com ligeiro arpejo natural
    evaluator.feedNote(60, 0.7, 1000); // C3 em t=1000
    evaluator.feedNote(64, 0.75, 1080); // E3 em t=1080 (80ms depois)
    evaluator.feedNote(67, 0.8, 1160); // G3 em t=1160 (160ms depois)

    const active = evaluator.getActiveEvent();
    expect(active).not.toBeNull();
    expect(active?.playedMidis.size).toBe(3);
    expect(active?.playedMidis.has(60)).toBe(true);
    expect(active?.playedMidis.has(64)).toBe(true);
    expect(active?.playedMidis.has(67)).toBe(true);
    expect(active?.identifiedChord?.symbol).toBe('C');
  });

  it('deve acompanhar duração e intensidade durante o sustain da nota', () => {
    const evaluator = new MusicalEventEvaluator();
    evaluator.setTarget({ midi: 60 });

    // Ataque inicial
    evaluator.feedNote(60, 0.6, 1000, true);

    // Quadros subsequentes de sustain (mesma nota mantida com pequenas variações de intensidade)
    evaluator.feedNote(60, 0.65, 1050, false);
    evaluator.feedNote(60, 0.7, 1100, false);
    evaluator.feedNote(60, 0.58, 1200, false);

    const active = evaluator.getActiveEvent();
    expect(active?.playedMidis.size).toBe(1);
    expect(active?.intensities.length).toBe(4);
    expect(active?.lastUpdateMs).toBe(1200);
  });

  it('deve finalizar a avaliação de C3 ao detectar o ataque da próxima nota D3', () => {
    const evaluator = new MusicalEventEvaluator({ chordWindowMs: 200 });
    evaluator.setTarget({ midi: 60, expectedTimeMs: 1000 });

    const onFinalized = vi.fn();
    evaluator.onEventFinalized = onFinalized;

    // 1. Toca C3 em t = 1000ms com duração sustentada até t = 1500ms
    evaluator.feedNote(60, 0.75, 1000, true);
    evaluator.feedNote(60, 0.7, 1300, false);

    // 2. Alvo passa para D3 e usuário ataca D3 em t = 1500ms
    evaluator.setTarget({ midi: 62, expectedTimeMs: 1500 });
    const resNext = evaluator.feedNote(62, 0.85, 1500, true);

    // O evento de D3 é iniciado
    expect(resNext.isNewEvent).toBe(true);
    expect(resNext.event.primaryMidi).toBe(62);

    // O evento anterior (C3) foi devidamente finalizado e avaliado!
    expect(onFinalized).toHaveBeenCalledTimes(1);
    const finalizedC: MusicalEvent = onFinalized.mock.calls[0][0];
    expect(finalizedC.primaryMidi).toBe(60);
    expect(finalizedC.durationMs).toBe(500); // 1500 - 1000 = 500ms
    expect(finalizedC.isPitchOrChordMatch).toBe(true);
    expect(finalizedC.grade).toBe('PERFECT');
    expect(finalizedC.peakIntensity).toBe(0.75);
  });

  it('deve finalizar o evento por soltura após janela de silêncio inequívoco', () => {
    const evaluator = new MusicalEventEvaluator({ silenceReleaseThresholdMs: 200 });
    evaluator.setTarget({ midi: 60 });

    const onFinalized = vi.fn();
    evaluator.onEventFinalized = onFinalized;

    // Toca nota em t = 1000
    evaluator.feedNote(60, 0.8, 1000);

    // Silêncio detectado em t = 1300
    evaluator.feedSilence(1300);

    // Avança 100ms (ainda não atinge threshold de 200ms)
    vi.advanceTimersByTime(100);
    expect(onFinalized).not.toHaveBeenCalled();

    // Avança mais 150ms (> 200ms de silêncio consolidado)
    vi.advanceTimersByTime(150);
    expect(onFinalized).toHaveBeenCalledTimes(1);

    const finalized: MusicalEvent = onFinalized.mock.calls[0][0];
    expect(finalized.primaryMidi).toBe(60);
    expect(finalized.phase).toBe('finalized');
  });

  it('deve avaliar acordes divergentes com feedback claro sem falso erro prematuro', () => {
    const evaluator = new MusicalEventEvaluator({ chordWindowMs: 250 });
    evaluator.setTarget({ chordName: 'C' }); // Espera Dó Maior (C, E, G)

    const onFinalized = vi.fn();
    evaluator.onEventFinalized = onFinalized;

    // Usuário toca Lá Menor (Am: A=69, C=60, E=64)
    evaluator.feedNote(69, 0.7, 1000);
    evaluator.feedNote(60, 0.7, 1050);
    evaluator.feedNote(64, 0.7, 1100);

    // Finaliza manualmente ou por transição
    const finalized = evaluator.finalizeCurrentEvent(1400);

    expect(finalized).not.toBeNull();
    expect(finalized?.type).toBe('chord');
    expect(finalized?.identifiedChord?.symbol).toContain('Am');
    expect(finalized?.isPitchOrChordMatch).toBe(false);
    expect(finalized?.grade).toBe('WRONG_CHORD');
    expect(finalized?.feedbackMessage).toContain('Am');
  });
});
