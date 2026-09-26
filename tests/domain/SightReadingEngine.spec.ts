import { describe, it, expect } from 'vitest';
import {
  TREBLE_STAFF_NOTES,
  TREBLE_LEDGER_NOTES,
  BASS_STAFF_NOTES,
  BASS_LEDGER_NOTES,
  getNotePool,
  generateSingleNoteExercise,
  generateIntervalExercise,
  generateSequenceExercise,
  generateChordExercise,
  generateLedgerExercise,
  SightReadingMetricsTracker,
  getFormattedNoteName,
} from '../../src/core/sightReadingEngine';
import { TABS } from '../../src/components/layout/Navigation';

describe('Motor Pedagógico de Treino de Leitura de Partitura (SightReadingEngine)', () => {
  describe('Catálogo de Notas e Pautas (Claves de Sol e Fá)', () => {
    it('deve conter as notas diatônicas fundamentais da Clave de Sol (E4 a F5 + limites imediatos)', () => {
      expect(TREBLE_STAFF_NOTES.length).toBeGreaterThanOrEqual(10);
      const midis = TREBLE_STAFF_NOTES.map((n) => n.midi);
      // E4 = 64, G4 = 67, B4 = 71, D5 = 74, F5 = 77
      expect(midis).toContain(64);
      expect(midis).toContain(67);
      expect(midis).toContain(71);
      expect(midis).toContain(74);
      expect(midis).toContain(77);
      expect(TREBLE_STAFF_NOTES.every((n) => n.clef === 'treble')).toBe(true);
    });

    it('deve conter as notas diatônicas fundamentais da Clave de Fá (G2 a A3 + limites imediatos)', () => {
      expect(BASS_STAFF_NOTES.length).toBeGreaterThanOrEqual(10);
      const midis = BASS_STAFF_NOTES.map((n) => n.midi);
      // G2 = 43, B2 = 47, D3 = 50, F3 = 53, A3 = 57
      expect(midis).toContain(43);
      expect(midis).toContain(47);
      expect(midis).toContain(50);
      expect(midis).toContain(53);
      expect(midis).toContain(57);
      expect(BASS_STAFF_NOTES.every((n) => n.clef === 'bass')).toBe(true);
    });

    it('deve incluir o Dó Central (MIDI 60) como linha suplementar em ambas as claves', () => {
      const trebleC4 = TREBLE_LEDGER_NOTES.find((n) => n.midi === 60);
      const bassC4 = BASS_LEDGER_NOTES.find((n) => n.midi === 60);

      expect(trebleC4).toBeDefined();
      expect(trebleC4?.staffPosition.type).toBe('ledger-below');

      expect(bassC4).toBeDefined();
      expect(bassC4?.staffPosition.type).toBe('ledger-above');
    });

    it('deve filtrar pools corretamente por Clave, Acidentes e Linhas Suplementares', () => {
      const naturalTreble = getNotePool('treble', 'natural', false);
      expect(naturalTreble.every((n) => n.accidental === '' && !n.isLedger)).toBe(true);

      const chromaticTreble = getNotePool('treble', 'all', true);
      const hasSharps = chromaticTreble.some((n) => n.accidental === '#');
      const hasFlats = chromaticTreble.some((n) => n.accidental === 'b');
      expect(hasSharps).toBe(true);
      expect(hasFlats).toBe(true);
      expect(chromaticTreble.length).toBeGreaterThan(naturalTreble.length);

      const grandPool = getNotePool('grand', 'natural', true);
      const hasTreble = grandPool.some((n) => n.clef === 'treble');
      const hasBass = grandPool.some((n) => n.clef === 'bass');
      expect(hasTreble).toBe(true);
      expect(hasBass).toBe(true);
    });
  });

  describe('Geradores de Exercícios Dinâmicos', () => {
    it('1. Flashcard de Nota Única: deve gerar exercício com nota e expectedMidi consistentes', () => {
      const ex = generateSingleNoteExercise('treble', 'natural');
      expect(ex.type).toBe('single');
      expect(ex.notes.length).toBe(1);
      expect(ex.expectedMidis.length).toBe(1);
      expect(ex.expectedMidis[0]).toBe(ex.notes[0].midi);
      expect(ex.notes[0].clef).toBe('treble');
    });

    it('2. Intervalos & Distâncias: deve gerar 2 notas no intervalo musical correto', () => {
      const ex = generateIntervalExercise('treble', 'natural');
      expect(ex.type).toBe('intervals');
      expect(ex.notes.length).toBe(2);
      expect(ex.expectedMidis.length).toBe(2);
      expect(ex.intervalName).toBeDefined();
      const semitones = ex.expectedMidis[1] - ex.expectedMidis[0];
      expect(semitones).toBeGreaterThan(0);
      expect(semitones).toBeLessThanOrEqual(12);
    });

    it('3. Sequências Melódicas: deve carregar frase contínua com múltiplas notas para Wait Mode', () => {
      const ex = generateSequenceExercise('treble');
      expect(ex.type).toBe('sequences');
      expect(ex.notes.length).toBeGreaterThanOrEqual(4);
      expect(ex.expectedMidis.length).toBe(ex.notes.length);
      for (let i = 0; i < ex.notes.length; i++) {
        expect(ex.expectedMidis[i]).toBe(ex.notes[i].midi);
      }
    });

    it('4. Leitura de Acordes: deve empilhar notas harmônicas com símbolo de cifra', () => {
      const ex = generateChordExercise('treble');
      expect(ex.type).toBe('chords');
      expect(ex.notes.length).toBeGreaterThanOrEqual(3);
      expect(ex.chordSymbol).toBeDefined();
      expect(ex.expectedMidis.length).toBe(ex.notes.length);
    });

    it('5. Linhas Suplementares: deve gerar somente notas com isLedger = true', () => {
      const ex = generateLedgerExercise('treble', 'natural');
      expect(ex.notes[0].isLedger).toBe(true);
      expect(['ledger-below', 'ledger-above']).toContain(ex.notes[0].staffPosition.type);
    });
  });

  describe('Dashboard de Métricas, Streaks e Mapa de Calor (Notas Fracas)', () => {
    it('deve registrar acertos, calcular acurácia e streaks com precisão matemática', () => {
      const tracker = new SightReadingMetricsTracker();
      const noteA = TREBLE_STAFF_NOTES[0];
      const noteB = TREBLE_STAFF_NOTES[1];

      // 1 acerto (100% acurácia, streak 1)
      tracker.recordAttempt(noteA, true, 800);
      let metrics = tracker.getMetrics();
      expect(metrics.totalAttempts).toBe(1);
      expect(metrics.correctHits).toBe(1);
      expect(metrics.wrongHits).toBe(0);
      expect(metrics.accuracyPercent).toBe(100);
      expect(metrics.currentStreak).toBe(1);
      expect(metrics.bestStreak).toBe(1);
      expect(metrics.averageReactionTimeMs).toBe(800);

      // 1 erro (50% acurácia, streak zera)
      tracker.recordAttempt(noteB, false, 1200);
      metrics = tracker.getMetrics();
      expect(metrics.totalAttempts).toBe(2);
      expect(metrics.correctHits).toBe(1);
      expect(metrics.wrongHits).toBe(1);
      expect(metrics.accuracyPercent).toBe(50);
      expect(metrics.currentStreak).toBe(0);
      expect(metrics.bestStreak).toBe(1);
      expect(metrics.averageReactionTimeMs).toBe(1000);

      // 2 acertos seguidos (streak 2, bestStreak 2)
      tracker.recordAttempt(noteA, true, 600);
      tracker.recordAttempt(noteA, true, 400);
      metrics = tracker.getMetrics();
      expect(metrics.currentStreak).toBe(2);
      expect(metrics.bestStreak).toBe(2);
      expect(metrics.accuracyPercent).toBe(75);
    });

    it('deve identificar notas fracas no mapa de calor ranqueando por taxa de erro', () => {
      const tracker = new SightReadingMetricsTracker();
      const easyNote = TREBLE_STAFF_NOTES[0];
      const hardNote = BASS_STAFF_NOTES[0];

      // Nota fácil: 3 tentativas, 3 acertos (0% erro)
      tracker.recordAttempt(easyNote, true, 500);
      tracker.recordAttempt(easyNote, true, 500);
      tracker.recordAttempt(easyNote, true, 500);

      // Nota difícil: 3 tentativas, 2 erros (67% erro)
      tracker.recordAttempt(hardNote, false, 1500);
      tracker.recordAttempt(hardNote, false, 1600);
      tracker.recordAttempt(hardNote, true, 1400);

      const weakest = tracker.getWeakestNotes(3);
      expect(weakest.length).toBe(2);
      expect(weakest[0].midi).toBe(hardNote.midi);
      expect(weakest[0].errorRate).toBeGreaterThan(0.5);
    });
  });

  describe('Navegação e Integração ao Harmonia', () => {
    it('deve conter a aba sight-reading registrada sob a categoria practice (PRÁTICA)', () => {
      const tab = TABS.find((t) => t.id === 'sight-reading');
      expect(tab).toBeDefined();
      expect(tab?.category).toBe('practice');
      expect(tab?.label).toBe('Treino Partitura');
      expect(tab?.fullName).toContain('Treino de Leitura de Partitura');
    });
  });
});
