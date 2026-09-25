import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NoteConfirmationValidator,
  DEFAULT_CONFIRMATION_CONFIG,
} from '../../src/core/noteConfirmationValidator';
import type { ScoreNote } from '../../src/core/coursesData';

describe('NoteConfirmationValidator - Estratégia de Janela de Confirmação', () => {
  const targetNoteC4: ScoreNote = {
    note: 'C4',
    midi: 60,
    duration: '4n',
    finger: 1,
    hand: 'right',
  };

  const nextNoteD4: ScoreNote = {
    note: 'D4',
    midi: 62,
    duration: '4n',
    finger: 2,
    hand: 'right',
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve registrar acerto imediato (0ms de latência) quando a nota tocada corresponde ao alvo', () => {
    const validator = new NoteConfirmationValidator();
    const result = validator.evaluate(60, targetNoteC4, nextNoteD4, 1000);

    expect(result.action).toBe('hit');
    if (result.action === 'hit') {
      expect(result.note.midi).toBe(60);
    }
  });

  it('deve aceitar transição antecipada para a próxima nota da sequência sem registrar erro', () => {
    const validator = new NoteConfirmationValidator();
    const result = validator.evaluate(62, targetNoteC4, nextNoteD4, 1000);

    expect(result.action).toBe('hit_next');
    if (result.action === 'hit_next') {
      expect(result.note.midi).toBe(62);
    }
  });

  it('deve tolerar o sustain/decaimento acústico da nota anterior sem classificar como erro na nota seguinte', () => {
    const validator = new NoteConfirmationValidator();

    // 1. Usuário toca Note 1 (C4, MIDI 60) no tempo t = 1000ms
    validator.onNoteCompleted(60, 1000);

    // 2. Agora o alvo é Note 2 (D4, MIDI 62).
    // O microfone ainda ouve o sustain residual de C4 em t = 1200ms (200ms após o término)
    const result = validator.evaluate(60, nextNoteD4, null, 1200);

    expect(result.action).toBe('ignore_sustain');
    if (result.action === 'ignore_sustain') {
      expect(result.previousMidi).toBe(60);
      expect(result.elapsedMs).toBe(200);
    }
  });

  it('não deve disparar erro imediatamente ao receber nota divergente (aguarda janela de estabilização)', () => {
    const validator = new NoteConfirmationValidator({
      confirmationWindowMs: 260,
      minStableFrames: 2,
    });

    // Usuário toca uma nota errada (E4, MIDI 64) em t = 1000ms (Frame 1)
    const frame1 = validator.evaluate(64, targetNoteC4, nextNoteD4, 1000);
    expect(frame1.action).toBe('pending_confirmation');

    // Em t = 1100ms (100ms depois, Frame 2, ainda dentro da janela de 260ms)
    const frame2 = validator.evaluate(64, targetNoteC4, nextNoteD4, 1100);
    expect(frame2.action).toBe('pending_confirmation');

    // Se o usuário corrige para a nota certa (C4) em t = 1150ms:
    const frameCorrected = validator.evaluate(60, targetNoteC4, nextNoteD4, 1150);
    expect(frameCorrected.action).toBe('hit');
  });

  it('deve confirmar erro somente quando a nota divergente persiste além da janela de tolerância', () => {
    const validator = new NoteConfirmationValidator({
      confirmationWindowMs: 260,
      minStableFrames: 2,
    });

    // Início da nota errada em t = 1000ms
    validator.evaluate(64, targetNoteC4, nextNoteD4, 1000);

    // Persistência em t = 1300ms (> 260ms decorridos e >= 2 frames)
    const confirmed = validator.evaluate(64, targetNoteC4, nextNoteD4, 1300);

    expect(confirmed.action).toBe('confirmed_error');
    if (confirmed.action === 'confirmed_error') {
      expect(confirmed.playedMidi).toBe(64);
      expect(confirmed.expectedMidi).toBe(60);
    }
  });

  it('deve permitir agendamento de erro com cancelamento caso a nota esperada chegue a tempo', () => {
    const validator = new NoteConfirmationValidator({ confirmationWindowMs: 250 });
    const onConfirm = vi.fn();

    // Agenda erro candidato
    validator.schedulePendingError(64, 60, onConfirm);
    expect(validator.hasPendingError()).toBe(true);

    // Avança 100ms (ainda não deve ter disparado)
    vi.advanceTimersByTime(100);
    expect(onConfirm).not.toHaveBeenCalled();

    // Usuário acerta a nota -> cancela erro
    validator.cancelPendingError();
    expect(validator.hasPendingError()).toBe(false);

    // Avança além da janela
    vi.advanceTimersByTime(200);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('deve disparar erro agendado se a janela estourar sem cancelamento', () => {
    const validator = new NoteConfirmationValidator({ confirmationWindowMs: 250 });
    const onConfirm = vi.fn();

    validator.schedulePendingError(64, 60, onConfirm);
    expect(validator.hasPendingError()).toBe(true);

    vi.advanceTimersByTime(251);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(validator.hasPendingError()).toBe(false);
  });

  it('deve adaptar janelas dinamicamente ao andamento (BPM) e instrumento (piano vs violão)', () => {
    const validator = new NoteConfirmationValidator();

    // Piano a 60 BPM (batida lenta = 1000ms)
    validator.adaptToTempoAndInstrument(60, 'piano');
    const slowPianoConfig = validator.getConfig();
    expect(slowPianoConfig.confirmationWindowMs).toBe(320); // clamped at max 320ms
    expect(slowPianoConfig.sustainDecayWindowMs).toBe(850);  // piano sustain longo

    // Violão a 140 BPM (batida rápida = 428ms)
    validator.adaptToTempoAndInstrument(140, 'guitar');
    const fastGuitarConfig = validator.getConfig();
    expect(fastGuitarConfig.confirmationWindowMs).toBeLessThan(slowPianoConfig.confirmationWindowMs);
    expect(fastGuitarConfig.sustainDecayWindowMs).toBeLessThan(slowPianoConfig.sustainDecayWindowMs);
  });

  it('deve reiniciar todos os estados e timers ao executar reset()', () => {
    const validator = new NoteConfirmationValidator();
    const onConfirm = vi.fn();

    validator.onNoteCompleted(60, 1000);
    validator.schedulePendingError(64, 60, onConfirm);

    validator.reset();

    expect(validator.hasPendingError()).toBe(false);
    expect(validator.isPreviousSustain(60, 1050)).toBe(false);

    vi.advanceTimersByTime(500);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
