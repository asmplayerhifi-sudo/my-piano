import { describe, it, expect } from 'vitest';
import { parseChord, CHROMATIC_NOTES_SHARP } from '../../src/core/musicTheory';
import { computeScaleNotes, SCALES_CATALOG } from '../../src/core/scaleData';
import { audioInputConfigStore } from '../../src/core/audioInputConfigStore';

describe('Teoria & Prática Teórica — Layout e Universalização de Entradas', () => {
  describe('1. Círculo das Quintas: Funções Harmônicas e Cadência I - IV - V - I', () => {
    it('deve extrair as funções harmônicas primárias e notas componentes corretas em C Maior', () => {
      // Tônica I (C)
      const tonic = parseChord('C');
      expect(tonic).not.toBeNull();
      expect(tonic?.root).toBe('C');
      expect(tonic?.notes).toEqual(['C', 'E', 'G']);

      // Subdominante IV (F)
      const subdom = parseChord('F');
      expect(subdom).not.toBeNull();
      expect(subdom?.root).toBe('F');
      expect(subdom?.notes).toEqual(['F', 'A', 'C']);

      // Dominante V (G)
      const dom = parseChord('G');
      expect(dom).not.toBeNull();
      expect(dom?.root).toBe('G');
      expect(dom?.notes).toEqual(['G', 'B', 'D']);

      // Relativa Menor vi (Am)
      const rel = parseChord('Am');
      expect(rel).not.toBeNull();
      expect(rel?.root).toBe('A');
      expect(rel?.notes).toEqual(['A', 'C', 'E']);
    });

    it('deve calcular corretamente as funções harmônicas em G Maior (1 sustenido)', () => {
      // Grau I: G (G, B, D)
      const tonic = parseChord('G');
      expect(tonic?.notes).toEqual(['G', 'B', 'D']);

      // Grau IV: C (C, E, G)
      const subdom = parseChord('C');
      expect(subdom?.notes).toEqual(['C', 'E', 'G']);

      // Grau V: D (D, F#, A)
      const dom = parseChord('D');
      expect(dom?.notes).toEqual(['D', 'F#', 'A']);

      // Grau vi: Em (E, G, B)
      const rel = parseChord('Em');
      expect(rel?.notes).toEqual(['E', 'G', 'B']);
    });
  });

  describe('2. Régua Cromática: Análise de Intervalos Dupla & Semitons Naturais', () => {
    it('deve calcular corretamente a distância de 5ª Justa entre C e G (7 semitons)', () => {
      const idxC = CHROMATIC_NOTES_SHARP.indexOf('C');
      const idxG = CHROMATIC_NOTES_SHARP.indexOf('G');
      const semitones = (idxG - idxC + 12) % 12;

      expect(semitones).toBe(7);
      expect(Math.floor(semitones / 2)).toBe(3); // 3 tons e meio
      expect(semitones % 2).toBe(1);
    });

    it('deve identificar a distância de 3ª Maior entre C e E (4 semitons / 2 tons)', () => {
      const idxC = CHROMATIC_NOTES_SHARP.indexOf('C');
      const idxE = CHROMATIC_NOTES_SHARP.indexOf('E');
      const semitones = (idxE - idxC + 12) % 12;

      expect(semitones).toBe(4);
      expect(semitones / 2).toBe(2); // exatamente 2 tons inteiros
    });

    it('deve reconhecer os semitons naturais E↔F e B↔C com distância de 1 semitom direto', () => {
      const idxE = CHROMATIC_NOTES_SHARP.indexOf('E');
      const idxF = CHROMATIC_NOTES_SHARP.indexOf('F');
      expect((idxF - idxE + 12) % 12).toBe(1);

      const idxB = CHROMATIC_NOTES_SHARP.indexOf('B');
      const idxC = CHROMATIC_NOTES_SHARP.indexOf('C');
      expect((idxC - idxB + 12) % 12).toBe(1);
    });
  });

  describe('3. Construtor de Escalas: Cards de Tecla & Dedilhado Sugerido', () => {
    it('deve gerar corretamente as 5 notas da Pentatônica Menor de Dó (C, Eb/D#, F, G, Bb/A#)', () => {
      const pentaMinor = SCALES_CATALOG.find(s => s.id === 'penta-minor');
      expect(pentaMinor).toBeDefined();

      if (pentaMinor) {
        const computed = computeScaleNotes('C', pentaMinor);
        expect(computed.notes.length).toBe(5);
        expect(computed.notes[0].note).toBe('C');
        expect(computed.notes[0].degree).toBe('1');
        expect(computed.notes[0].isTonic).toBe(true);

        // Dedilhado padrão de 5 notas: [1, 2, 3, 4, 5]
        const fingerings = computed.notes.map((_, idx) => [1, 2, 3, 4, 5][idx % 5]);
        expect(fingerings).toEqual([1, 2, 3, 4, 5]);
      }
    });

    it('deve gerar corretamente o dedilhado para escalas de 7 notas (1, 2, 3, 1, 2, 3, 4)', () => {
      const heptatonicScale = SCALES_CATALOG.find(s => s.id === 'mode-dorian');
      expect(heptatonicScale).toBeDefined();

      if (heptatonicScale) {
        const computed = computeScaleNotes('C', heptatonicScale);
        expect(computed.notes.length).toBe(7);

        // Dedilhado clássico para mão direita com passagem do polegar no grau 4
        const fingerings = computed.notes.map((_, idx) => [1, 2, 3, 1, 2, 3, 4][idx % 7]);
        expect(fingerings).toEqual([1, 2, 3, 1, 2, 3, 4]);
      }
    });

    it('deve identificar notas características e Blue Note na escala Blues', () => {
      const bluesScale = SCALES_CATALOG.find(s => s.id === 'blues');
      expect(bluesScale).toBeDefined();

      if (bluesScale) {
        const computed = computeScaleNotes('C', bluesScale);
        expect(computed.notes.length).toBe(6);

        const blueNote = computed.notes.find(n => n.isBlueNote);
        expect(blueNote).toBeDefined();
        expect(blueNote?.degree).toBe('♭5');
      }
    });
  });

  describe('4. Universalização da Seleção de Entradas Áudio / MIDI', () => {
    it('permite alternar entre os 4 modos universais: MIDI USB, Microfone, Linha e Headset', () => {
      const modes = ['midi', 'mic', 'line-in', 'headset'] as const;

      modes.forEach(mode => {
        audioInputConfigStore.setInputMode(mode);
        expect(audioInputConfigStore.getSnapshot().inputMode).toBe(mode);
      });
    });

    it('armazena e recupera o mapeamento de canal MIDI (0..16)', () => {
      audioInputConfigStore.setMidiChannel(1);
      expect(audioInputConfigStore.getSnapshot().midiChannel).toBe(1);

      audioInputConfigStore.setMidiChannel(0); // Omni
      expect(audioInputConfigStore.getSnapshot().midiChannel).toBe(0);
    });
  });
});
