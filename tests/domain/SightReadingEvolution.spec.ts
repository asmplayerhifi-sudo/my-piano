/**
 * tests/domain/SightReadingEvolution.spec.ts
 *
 * Suíte de Testes Unitários de Domínio para a Otimização e Evolução do Treino de Partitura:
 *  - Cálculo dinâmico do alcance de leitura (Critério 4: derivado do exercício real)
 *  - Sequências expandidas: escalas diatônicas, pentatônicas e modos gregos (Dórico, Frígio, Lídio, Mixolídio)
 *  - Acordes expandidos: tríades, tétrades, inversões e voicings abertos
 *  - Avaliação polifônica rigorosa: detecção de notas faltantes, notas extras e bloqueio de avanço parcial
 *  - Classificação temporal rítmica: ON TIME, EARLY, LATE com janela simétrica
 *  - Armaduras de clave e fórmulas de compasso
 *  - Tópicos pedagógicos do Tutorial
 */

import { describe, it, expect } from 'vitest';
import {
  calculateExerciseRange,
  evaluatePolyphonicChord,
  evaluateRhythmicTiming,
  KEY_SIGNATURES,
  PRESET_SEQUENCES,
  CHORD_PRESETS,
  TUTORIAL_TOPICS,
  generateSequenceExercise,
  generateChordExercise,
  type SightReadingNote,
} from '../../src/core/sightReadingEngine';

import { octaveConfigStore } from '../../src/core/octaveConfigStore';

describe('Evolução do Treino de Leitura de Partitura (SightReadingEvolution)', () => {
  describe('1. Alcance Dinâmico de Leitura (Requisito 1 & Critério de Aceite 4)', () => {
    it('deve calcular dinamicamente o alcance a partir das notas reais apresentadas no exercício (Padrão C4 / SPN)', () => {
      octaveConfigStore.setStandard('C4');

      // Exercício com C4 (60) a G5 (79)
      const mockNotes: SightReadingNote[] = [
        { id: '1', midi: 60, pitchLetter: 'C', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 1, description: 'C4' }, isLedger: false },
        { id: '2', midi: 67, pitchLetter: 'G', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 2, description: 'G4' }, isLedger: false },
        { id: '3', midi: 79, pitchLetter: 'G', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 5, description: 'G5' }, isLedger: false },
      ];

      const range = calculateExerciseRange(mockNotes, 'treble');
      expect(range.minMidi).toBe(60);
      expect(range.maxMidi).toBe(79);
      expect(range.minFormatted).toBe('C4');
      expect(range.maxFormatted).toBe('G5');
      expect(range.rangeText).toBe('C4 – G5');
    });

    it('deve calcular dinamicamente o alcance respeitando o padrão C3 quando configurado (Brasil / Roland / Yamaha)', () => {
      octaveConfigStore.setStandard('C3');

      // Mesmo exercício com MIDI 60 a 79: no padrão C3 é C3 a G4
      const mockNotes: SightReadingNote[] = [
        { id: '1', midi: 60, pitchLetter: 'C', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 1, description: 'C3' }, isLedger: false },
        { id: '2', midi: 79, pitchLetter: 'G', accidental: '', clef: 'treble', staffPosition: { type: 'space', index: 5, description: 'G4' }, isLedger: false },
      ];

      const range = calculateExerciseRange(mockNotes, 'treble');
      expect(range.minMidi).toBe(60);
      expect(range.maxMidi).toBe(79);
      expect(range.minFormatted).toBe('C3');
      expect(range.maxFormatted).toBe('G4');
      expect(range.rangeText).toBe('C3 – G4');
    });

    it('deve apresentar apenas a nota única quando o exercício possuir uma única altura', () => {
      octaveConfigStore.setStandard('C4');
      const singleNote: SightReadingNote[] = [
        { id: '1', midi: 64, pitchLetter: 'E', accidental: '', clef: 'treble', staffPosition: { type: 'line', index: 1, description: 'E4' }, isLedger: false },
      ];

      const range = calculateExerciseRange(singleNote, 'treble');
      expect(range.minMidi).toBe(64);
      expect(range.maxMidi).toBe(64);
      expect(range.rangeText).toBe('E4');
    });

    it('deve calcular corretamente alcances graves na clave de Fá (ex: G2 a C4 no padrão C4)', () => {
      octaveConfigStore.setStandard('C4');
      const bassNotes: SightReadingNote[] = [
        { id: '1', midi: 43, pitchLetter: 'G', accidental: '', clef: 'bass', staffPosition: { type: 'line', index: 1, description: 'G2' }, isLedger: false },
        { id: '2', midi: 60, pitchLetter: 'C', accidental: '', clef: 'bass', staffPosition: { type: 'ledger-above', index: 1, description: 'C4' }, isLedger: true },
      ];

      const range = calculateExerciseRange(bassNotes, 'bass');
      expect(range.minMidi).toBe(43);
      expect(range.maxMidi).toBe(60);
      expect(range.rangeText).toBe('G2 – C4');
    });
  });

  describe('2. Sequências Expandidas: Escalas, Pentatônicas e Modos Gregos (Requisito 1)', () => {
    it('deve conter escalas diatônicas maiores e menores em PRESET_SEQUENCES', () => {
      const cMajor = PRESET_SEQUENCES.find((s) => s.title.includes('Dó Maior Ascendente'));
      const cMajorDesc = PRESET_SEQUENCES.find((s) => s.title.includes('Dó Maior Descendente'));
      const gMajor = PRESET_SEQUENCES.find((s) => s.title.includes('Sol Maior'));
      const fMajor = PRESET_SEQUENCES.find((s) => s.title.includes('Fá Maior'));
      const aMinor = PRESET_SEQUENCES.find((s) => s.title.includes('Lá Menor'));

      expect(cMajor).toBeDefined();
      expect(cMajorDesc).toBeDefined();
      expect(gMajor).toBeDefined();
      expect(fMajor).toBeDefined();
      expect(aMinor).toBeDefined();

      // Sol Maior deve conter F# (MIDI 78)
      expect(gMajor?.notes.some((n) => n.letter === 'F' && n.accidental === '#' && n.midi === 78)).toBe(true);
      // Fá Maior deve conter Bb (MIDI 70)
      expect(fMajor?.notes.some((n) => n.letter === 'B' && n.accidental === 'b' && n.midi === 70)).toBe(true);
    });

    it('deve contemplar escalas pentatônicas maiores e menores', () => {
      const pentaC = PRESET_SEQUENCES.find((s) => s.title.includes('Pentatônica de Dó'));
      const pentaAm = PRESET_SEQUENCES.find((s) => s.title.includes('Pentatônica de Lá'));

      expect(pentaC).toBeDefined();
      expect(pentaAm).toBeDefined();
      expect(pentaC?.category).toBe('pentatonic');
      // Pentatônica de Dó: C, D, E, G, A, C (6 notas com a oitava)
      expect(pentaC?.notes.map((n) => n.letter)).toEqual(['C', 'D', 'E', 'G', 'A', 'C']);
    });

    it('deve contemplar os modos gregos essenciais (Dórico, Frígio, Lídio, Mixolídio)', () => {
      const dorian = PRESET_SEQUENCES.find((s) => s.title.includes('Modo Dórico'));
      const phrygian = PRESET_SEQUENCES.find((s) => s.title.includes('Modo Frígio'));
      const lydian = PRESET_SEQUENCES.find((s) => s.title.includes('Modo Lídio'));
      const mixolydian = PRESET_SEQUENCES.find((s) => s.title.includes('Modo Mixolídio'));

      expect(dorian).toBeDefined();
      expect(phrygian).toBeDefined();
      expect(lydian).toBeDefined();
      expect(mixolydian).toBeDefined();

      // Dórico em Ré começa em D4 (62) e termina em D5 (74)
      expect(dorian?.notes[0].midi).toBe(62);
      expect(dorian?.notes[dorian.notes.length - 1].midi).toBe(74);

      // Frígio em Mi começa em E4 (64)
      expect(phrygian?.notes[0].midi).toBe(64);
    });

    it('generateSequenceExercise deve gerar exercícios com informação de métrica e duração de figuras', () => {
      const ex = generateSequenceExercise('treble');
      expect(ex.type).toBe('sequences');
      expect(ex.notes.length).toBeGreaterThanOrEqual(4);
      expect(ex.timeSignature).toBeDefined();
      expect(ex.notes[0].durationFigure).toBeDefined();
      expect(ex.notes[0].beats).toBeGreaterThan(0);
    });
  });

  describe('3. Acordes Expandidos: Tríades, Tétrades, Inversões e Voicings (Requisito 1 & 5)', () => {
    it('deve suportar inversões de acordes (1ª e 2ª Inversão)', () => {
      const cFirstInv = CHORD_PRESETS.find((c) => c.symbol === 'C/E');
      const cSecondInv = CHORD_PRESETS.find((c) => c.symbol === 'C/G');

      expect(cFirstInv).toBeDefined();
      expect(cSecondInv).toBeDefined();

      // C/E: baixo em E4 (64), seguido de G4 (67) e C5 (72)
      expect(cFirstInv?.notes[0].midi).toBe(64);
      expect(cFirstInv?.notes[0].letter).toBe('E');

      // C/G: baixo em G3 (55), seguido de C4 (60) e E4 (64)
      expect(cSecondInv?.notes[0].midi).toBe(55);
      expect(cSecondInv?.notes[0].letter).toBe('G');
    });

    it('deve suportar tétrades (acordes com sétima maior, dominante e meio-diminuto)', () => {
      const cmaj7 = CHORD_PRESETS.find((c) => c.symbol === 'Cmaj7');
      const g7 = CHORD_PRESETS.find((c) => c.symbol === 'G7');
      const bm7b5 = CHORD_PRESETS.find((c) => c.symbol === 'Bm7(b5)');

      expect(cmaj7).toBeDefined();
      expect(g7).toBeDefined();
      expect(bm7b5).toBeDefined();

      // Cmaj7 deve conter 4 notas: C, E, G, B
      expect(cmaj7?.notes.length).toBe(4);
      expect(cmaj7?.notes.map((n) => n.letter)).toEqual(['C', 'E', 'G', 'B']);
    });

    it('deve suportar voicings abertos na pauta dupla (Grand Staff: mão esquerda + mão direita)', () => {
      const grandVoicings = CHORD_PRESETS.filter((c) => c.category === 'open_voicing');
      expect(grandVoicings.length).toBeGreaterThanOrEqual(3);

      const cGrand = grandVoicings.find((c) => c.symbol === 'C (Grand)');
      expect(cGrand).toBeDefined();
      // O baixo deve estar na clave de Fá (C3 = 48)
      expect(cGrand?.notes.some((n) => n.clef === 'bass' && n.midi === 48)).toBe(true);
      // As notas agudas na clave de Sol
      expect(cGrand?.notes.some((n) => n.clef === 'treble')).toBe(true);
    });

    it('generateChordExercise deve marcar isPolyphonic = true', () => {
      const ex = generateChordExercise('treble');
      expect(ex.type).toBe('chords');
      expect(ex.isPolyphonic).toBe(true);
      expect(ex.notes.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('4. Avaliação Polifônica de Acordes (Requisito 5 & Critério de Aceite 12)', () => {
    const expectedC = [60, 64, 67]; // C4, E4, G4

    it('deve validar como completo SOMENTE quando todas as notas esperadas forem tocadas sem notas extras', () => {
      const result = evaluatePolyphonicChord([60, 64, 67], expectedC);
      expect(result.isComplete).toBe(true);
      expect(result.missingMidis).toHaveLength(0);
      expect(result.extraMidis).toHaveLength(0);
      expect(result.statusText).toContain('Acorde Completo');
    });

    it('NUNCA deve considerar o acorde completo quando apenas parte das notas for tocada (Incompleto)', () => {
      // Aluno tocou apenas C4 e E4 (falta G4)
      const result = evaluatePolyphonicChord([60, 64], expectedC);
      expect(result.isComplete).toBe(false);
      expect(result.missingMidis).toContain(67);
      expect(result.statusText).toContain('Incompleto: falta');
      expect(result.statusText).toContain('Sol');
    });

    it('deve acusar erro quando notas extras incorretas forem tocadas junto', () => {
      // Aluno tocou C4, E4, G4 + F4 (nota extra incorreta)
      const result = evaluatePolyphonicChord([60, 64, 67, 65], expectedC);
      expect(result.isComplete).toBe(false);
      expect(result.extraMidis).toContain(65);
      expect(result.statusText).toContain('Nota extra incorreta');
    });

    it('não deve se importar com a ordem em que as notas do buffer foram pressionadas', () => {
      const result = evaluatePolyphonicChord([67, 60, 64], expectedC);
      expect(result.isComplete).toBe(true);
    });
  });

  describe('5. Precisão Rítmica e Timing (Requisito 6 & Critério de Aceite 14)', () => {
    it('deve classificar como ON TIME quando executado dentro da janela de tolerância de 140ms', () => {
      const targetTime = 5000;
      // Perfeitamente no tempo
      const onTimeExact = evaluateRhythmicTiming(5000, targetTime, 60, 140);
      expect(onTimeExact.classification).toBe('ON_TIME');
      expect(onTimeExact.deltaMs).toBe(0);

      // Levemente adiantado (-80ms)
      const onTimeEarly = evaluateRhythmicTiming(4920, targetTime, 60, 140);
      expect(onTimeEarly.classification).toBe('ON_TIME');

      // Levemente atrasado (+110ms)
      const onTimeLate = evaluateRhythmicTiming(5110, targetTime, 60, 140);
      expect(onTimeLate.classification).toBe('ON_TIME');
    });

    it('deve classificar como EARLY quando a execução ocorrer antes da janela de tolerância', () => {
      const targetTime = 5000;
      // 200ms adiantado
      const early = evaluateRhythmicTiming(4800, targetTime, 60, 140);
      expect(early.classification).toBe('EARLY');
      expect(early.deltaMs).toBe(-200);
      expect(early.label).toBe('EARLY');
    });

    it('deve classificar como LATE quando a execução ocorrer após a janela de tolerância', () => {
      const targetTime = 5000;
      // 250ms atrasado
      const late = evaluateRhythmicTiming(5250, targetTime, 60, 140);
      expect(late.classification).toBe('LATE');
      expect(late.deltaMs).toBe(250);
      expect(late.label).toBe('LATE');
    });
  });

  describe('6. Armaduras de Clave e Fórmulas de Compasso (Requisito 2 & Critério de Aceite 8)', () => {
    it('deve conter o catálogo de armaduras de clave oficiais em KEY_SIGNATURES', () => {
      expect(KEY_SIGNATURES.length).toBeGreaterThanOrEqual(7);

      const cMaj = KEY_SIGNATURES.find((k) => k.id === 'c_major');
      const gMaj = KEY_SIGNATURES.find((k) => k.id === 'g_major');
      const dMaj = KEY_SIGNATURES.find((k) => k.id === 'd_major');
      const fMaj = KEY_SIGNATURES.find((k) => k.id === 'f_major');

      expect(cMaj?.accidentalsCount).toBe(0);
      expect(gMaj?.accidentalsCount).toBe(1);
      expect(gMaj?.sharpsOrFlats).toContain('F');
      expect(dMaj?.accidentalsCount).toBe(2);
      expect(dMaj?.sharpsOrFlats).toEqual(['F', 'C']);
      expect(fMaj?.accidentalsCount).toBe(1);
      expect(fMaj?.sharpsOrFlats).toContain('B');
    });
  });

  describe('7. Conteúdo do Tutorial Progressivo (Requisito 1 & Critério de Aceite 7)', () => {
    it('deve estruturar os 7 módulos essenciais solicitados na especificação', () => {
      expect(TUTORIAL_TOPICS.length).toBe(7);

      const ids = TUTORIAL_TOPICS.map((t) => t.id);
      expect(ids).toContain('clefs');
      expect(ids).toContain('notes_lines_spaces');
      expect(ids).toContain('octaves_central_c');
      expect(ids).toContain('rhythm_figures');
      expect(ids).toContain('time_signatures');
      expect(ids).toContain('accidentals_key_signatures');
      expect(ids).toContain('chords_polyphony');
    });

    it('cada módulo do tutorial deve conter conceitos chave, exemplos sonoros e dica prática', () => {
      for (const topic of TUTORIAL_TOPICS) {
        expect(topic.title).toBeTruthy();
        expect(topic.summary).toBeTruthy();
        expect(topic.keyConcepts.length).toBeGreaterThanOrEqual(2);
        expect(topic.visualExamples.length).toBeGreaterThanOrEqual(2);
        expect(topic.practicalTip).toBeTruthy();
      }
    });
  });
});
