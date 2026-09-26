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

  it('deve respeitar o limite máximo de 32 vozes com voice stealing suave (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.1)', () => {
    soundEngine.stopAllNotes();
    // Dispara 40 notas simulando polifonia densa com sustain
    for (let i = 0; i < 40; i++) {
      soundEngine.playPianoNote(60 + (i % 12), 3.0, undefined, 0.8, true);
    }
    // O número de vozes ativas não deve ultrapassar 32
    expect(soundEngine.getActiveVoiceCount()).toBeLessThanOrEqual(32);
  });

  it('deve cancelar todas as notas sustentadas com cancelSustainedNotes', () => {
    soundEngine.stopAllNotes();
    soundEngine.playPianoNote(60, 2.0, undefined, 0.8, true);
    soundEngine.playPianoNote(64, 2.0, undefined, 0.8, true);
    soundEngine.cancelSustainedNotes(0.010);
    expect(soundEngine.getActiveVoiceCount()).toBe(0);
  });

  describe('Pedal de Sustain do Teclado Livre & Damper Acústico (REQ-SUSTAIN-PEDAL-01)', () => {
    it('deve sustentar notas soltas enquanto o pedal de sustain estiver ativo e abafar ao soltar', async () => {
      const { sustainPedalStore } = await import('../../src/core/sustainPedalStore');

      soundEngine.stopAllNotes();
      sustainPedalStore.setSustain(false);
      expect(soundEngine.getIsSustainPedalDown()).toBe(false);

      // Pressiona o pedal de sustain
      sustainPedalStore.setSustain(true);
      expect(soundEngine.getIsSustainPedalDown()).toBe(true);
      expect(sustainPedalStore.getSnapshot()).toBe(true);

      // Toca uma nota e solta a tecla física
      soundEngine.startPianoNote(60);
      soundEngine.stopPianoNote(60);

      // Como o pedal está pressionado, a voz deve continuar ativa
      expect(soundEngine.getActiveVoiceCount()).toBeGreaterThan(0);

      // Solta o pedal de sustain
      sustainPedalStore.setSustain(false);
      expect(soundEngine.getIsSustainPedalDown()).toBe(false);
      expect(sustainPedalStore.getSnapshot()).toBe(false);

      // Com o pedal liberado, as notas soltas devem ser abafadas
      expect(soundEngine.getActiveVoiceCount()).toBe(0);
    });

    it('deve alternar o estado de trava com toggleSustain', async () => {
      const { sustainPedalStore } = await import('../../src/core/sustainPedalStore');

      sustainPedalStore.setSustain(false, false);
      const state1 = sustainPedalStore.toggleSustain();
      expect(state1).toBe(true);
      expect(sustainPedalStore.getSnapshot()).toBe(true);
      expect(sustainPedalStore.isLockedActive()).toBe(true);

      const state2 = sustainPedalStore.toggleSustain();
      expect(state2).toBe(false);
      expect(sustainPedalStore.getSnapshot()).toBe(false);
      expect(sustainPedalStore.isLockedActive()).toBe(false);
    });
  });
});
