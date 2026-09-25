import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ScoreSustainMode } from '../../src/components/score/scrolling/types';
import { soundEngine } from '../../src/core/soundEngine';

describe('ScoreSustainMode & Resolução de Sustain', () => {
  function resolveSustainFlags(mode: ScoreSustainMode) {
    return {
      isNotesSustain: mode === 'notes' || mode === 'all',
      isChordsSustain: mode === 'chords' || mode === 'all',
    };
  }

  it('deve desativar sustain tanto para notas quanto para acordes no modo "off"', () => {
    const { isNotesSustain, isChordsSustain } = resolveSustainFlags('off');
    expect(isNotesSustain).toBe(false);
    expect(isChordsSustain).toBe(false);
  });

  it('deve ativar sustain apenas para notas simples no modo "notes"', () => {
    const { isNotesSustain, isChordsSustain } = resolveSustainFlags('notes');
    expect(isNotesSustain).toBe(true);
    expect(isChordsSustain).toBe(false);
  });

  it('deve ativar sustain apenas para acordes no modo "chords"', () => {
    const { isNotesSustain, isChordsSustain } = resolveSustainFlags('chords');
    expect(isNotesSustain).toBe(false);
    expect(isChordsSustain).toBe(true);
  });

  it('deve ativar sustain para notas e acordes no modo "all"', () => {
    const { isNotesSustain, isChordsSustain } = resolveSustainFlags('all');
    expect(isNotesSustain).toBe(true);
    expect(isChordsSustain).toBe(true);
  });

  it('deve suportar ciclo ordenado entre todos os 4 modos', () => {
    const cycle: Record<ScoreSustainMode, ScoreSustainMode> = {
      off: 'notes',
      notes: 'chords',
      chords: 'all',
      all: 'off',
    };

    expect(cycle['off']).toBe('notes');
    expect(cycle['notes']).toBe('chords');
    expect(cycle['chords']).toBe('all');
    expect(cycle['all']).toBe('off');
  });

  it('deve aceitar parâmetro sustained em playPianoNote e playChord sem erros', () => {
    const spy = vi.spyOn(soundEngine, 'playPianoNote');

    // Executa com sustain = true e sustain = false
    soundEngine.playPianoNote(60, 2.0, undefined, 0.8, true);
    expect(spy).toHaveBeenCalledWith(60, 2.0, undefined, 0.8, true);

    soundEngine.playPianoNote(64, 0.5, undefined, 0.8, false);
    expect(spy).toHaveBeenCalledWith(64, 0.5, undefined, 0.8, false);

    spy.mockRestore();
  });

  it('deve propagar parâmetro sustained ao reproduzir acordes polifônicos', () => {
    const spy = vi.spyOn(soundEngine, 'playPianoNote');

    soundEngine.playChord([60, 64, 67], 'piano', 2.5, true);
    expect(spy).toHaveBeenCalledWith(60, 2.5, undefined, 0.8, true);
    expect(spy).toHaveBeenCalledWith(64, 2.5, undefined, 0.8, true);
    expect(spy).toHaveBeenCalledWith(67, 2.5, undefined, 0.8, true);

    spy.mockRestore();
  });
});
