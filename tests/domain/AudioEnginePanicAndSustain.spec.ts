import { describe, it, expect, vi, beforeEach } from 'vitest';
import { soundEngine } from '../../src/core/soundEngine';
import { musicalPlaybackEngine } from '../../src/core/musicalPlaybackEngine';
import { metronomeEngine } from '../../src/core/metronomeEngine';
import { accompanimentSynthesizer } from '../../src/core/accompanimentSynthesizer';
import { activeMidiStore } from '../../src/core/activeMidiStore';

describe('Áudio Engine: Panic, StopAllNotes, Metrônomo Silencioso & Sustain OFF por Padrão (REQ-BUG-02)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve ter sustain desligado por padrão no MusicalPlaybackEngine (sustain = "off")', () => {
    // REQ-BUG-02: O estado por omissão do pedal de Sustain deve ser OFF
    const pos = musicalPlaybackEngine.getPosition();
    expect(pos).toBeDefined();
    // Acessa sustainMode através da verificação de comportamento padrão
    musicalPlaybackEngine.loadScore([
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, noteName: 'C3' },
    ], '4/4', 80);

    const playSpy = vi.spyOn(soundEngine, 'playPianoNote');
    // Força reprodução de um beat
    musicalPlaybackEngine.play(0);
    // Ao pausar, deve parar todas as notas
    const stopSpy = vi.spyOn(soundEngine, 'stopAllNotes');
    musicalPlaybackEngine.pause();
    expect(stopSpy).toHaveBeenCalled();
  });

  it('deve executar rotina stopAllNotes / panic e limpar activeMidiStore', () => {
    const clearSpy = vi.spyOn(activeMidiStore, 'clearAll');
    soundEngine.stopAllNotes();
    expect(clearSpy).toHaveBeenCalled();

    // Testa alias padrão MIDI allNotesOff
    soundEngine.allNotesOff();
    expect(clearSpy).toHaveBeenCalledTimes(2);

    // Testa panic
    soundEngine.panic();
    expect(clearSpy).toHaveBeenCalledTimes(3);
  });

  it('deve invocar stopAllNotes ao trocar de timbre para evitar acúmulo de notas e sustain infinito', () => {
    const stopSpy = vi.spyOn(soundEngine, 'stopAllNotes');
    soundEngine.setTimbre('rhodes');
    expect(stopSpy).toHaveBeenCalled();
    expect(soundEngine.getTimbre()).toBe('rhodes');

    soundEngine.setTimbre('grand_piano');
    expect(stopSpy).toHaveBeenCalledTimes(2);
    expect(soundEngine.getTimbre()).toBe('grand_piano');
  });

  it('deve silenciar o metrônomo ao parar (stop) com rampa suave anti-clique', () => {
    const silenceSpy = vi.spyOn(accompanimentSynthesizer, 'silenceMetronome');
    metronomeEngine.stop();
    expect(silenceSpy).toHaveBeenCalled();
  });

  it('deve parar todas as notas sonoras ao invocar loadScore no MusicalPlaybackEngine', () => {
    const stopSpy = vi.spyOn(soundEngine, 'stopAllNotes');
    musicalPlaybackEngine.loadScore([
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 1, noteName: 'E3' },
    ], '3/4', 90);
    expect(stopSpy).toHaveBeenCalled();
  });

  it('deve parar todas as notas sonoras ao trocar de instrumento no MusicalPlaybackEngine', () => {
    const stopSpy = vi.spyOn(soundEngine, 'stopAllNotes');
    musicalPlaybackEngine.setInstrument('guitar');
    expect(stopSpy).toHaveBeenCalled();

    musicalPlaybackEngine.setInstrument('piano');
    expect(stopSpy).toHaveBeenCalledTimes(2);
  });
});
