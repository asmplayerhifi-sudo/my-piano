import { describe, it, expect, beforeEach } from 'vitest';
import { octaveConfigStore } from '../../src/core/octaveConfigStore';
import { getNoteInfo } from '../../src/core/musicTheory';
import { Note } from '../../src/domain/entities/Note';

describe('Padronização da Nomenclatura das Notas: Padrões C3 (Brasil) e C4 (Internacional)', () => {
  beforeEach(() => {
    octaveConfigStore.setStandard('C3');
  });

  describe('1. Comportamento do octaveConfigStore', () => {
    it('deve ter C3 como padrão inicial (Brasil / Roland / Yamaha)', () => {
      expect(octaveConfigStore.getStandard()).toBe('C3');
      expect(octaveConfigStore.getMiddleCOctave()).toBe(3);
      expect(octaveConfigStore.getOctaveOffset()).toBe(-2);
      expect(octaveConfigStore.getDisplayOctaveDelta()).toBe(0);
    });

    it('deve alternar para C4 (Internacional / SPN) e refletir no offset', () => {
      octaveConfigStore.setStandard('C4');
      expect(octaveConfigStore.getStandard()).toBe('C4');
      expect(octaveConfigStore.getMiddleCOctave()).toBe(4);
      expect(octaveConfigStore.getOctaveOffset()).toBe(-1);
      expect(octaveConfigStore.getDisplayOctaveDelta()).toBe(1);
    });

    it('deve formatar MIDI 60 como C3 no padrão Brasil e C4 no padrão Internacional', () => {
      octaveConfigStore.setStandard('C3');
      expect(octaveConfigStore.midiToNoteName(60)).toBe('C3');
      expect(octaveConfigStore.midiToPtName(60)).toBe('Dó 3');

      octaveConfigStore.setStandard('C4');
      expect(octaveConfigStore.midiToNoteName(60)).toBe('C4');
      expect(octaveConfigStore.midiToPtName(60)).toBe('Dó 4');
    });

    it('deve formatar A440 (MIDI 69) como A3 no padrão C3 e A4 no padrão C4', () => {
      expect(octaveConfigStore.midiToNoteName(69, 'C3')).toBe('A3');
      expect(octaveConfigStore.midiToNoteName(69, 'C4')).toBe('A4');
    });

    it('deve converter nomes de notas entre padrões com convertNoteOctave', () => {
      expect(octaveConfigStore.convertNoteOctave('C3', 'C3', 'C4')).toBe('C4');
      expect(octaveConfigStore.convertNoteOctave('F#2', 'C3', 'C4')).toBe('F#3');
      expect(octaveConfigStore.convertNoteOctave('Bb3', 'C3', 'C4')).toBe('Bb4');
      expect(octaveConfigStore.convertNoteOctave('C4', 'C4', 'C3')).toBe('C3');
    });

    it('deve adaptar textos didáticos em português ao padrão C4 mantendo o padrão C3 inalterado', () => {
      const textoOriginal = 'O Dó Central (C3) vibra por volta de 261.6 Hz, conectando Fá2, Dó Central (C3) e Sol3.';
      
      const textoC3 = octaveConfigStore.formatNoteOctavesInText(textoOriginal, 'C3');
      expect(textoC3).toBe(textoOriginal);

      const textoC4 = octaveConfigStore.formatNoteOctavesInText(textoOriginal, 'C4');
      expect(textoC4).toBe('O Dó Central (C4) vibra por volta de 261.6 Hz, conectando Fá3, Dó Central (C4) e Sol4.');
    });
  });

  describe('2. Invariância Absoluta de Frequência e MIDI (Regra Fundamental)', () => {
    it('o Dó Central deve possuir rigorosamente MIDI 60 e mesma frequência (~261.63 Hz) em ambos os padrões', () => {
      const noteInfoC3 = getNoteInfo(60, false, 'C3');
      const noteInfoC4 = getNoteInfo(60, false, 'C4');

      // MIDI é o mesmo
      expect(noteInfoC3.midi).toBe(60);
      expect(noteInfoC4.midi).toBe(60);

      // Frequência física em Hertz é idêntica
      expect(noteInfoC3.frequency).toBeCloseTo(261.625565, 3);
      expect(noteInfoC4.frequency).toBeCloseTo(261.625565, 3);
      expect(noteInfoC3.frequency).toBe(noteInfoC4.frequency);

      // Apenas a nomenclatura da oitava difere
      expect(noteInfoC3.octave).toBe(3);
      expect(noteInfoC4.octave).toBe(4);
      expect(noteInfoC3.fullName).toBe('C3');
      expect(noteInfoC4.fullName).toBe('C4');
    });

    it('a nota A440 (Lá 440 Hz) deve possuir MIDI 69 e 440 Hz em ambos os padrões', () => {
      const noteInfoC3 = getNoteInfo(69, false, 'C3');
      const noteInfoC4 = getNoteInfo(69, false, 'C4');

      expect(noteInfoC3.midi).toBe(69);
      expect(noteInfoC4.midi).toBe(69);
      expect(noteInfoC3.frequency).toBeCloseTo(440.0, 3);
      expect(noteInfoC4.frequency).toBeCloseTo(440.0, 3);

      expect(noteInfoC3.fullName).toBe('A3');
      expect(noteInfoC4.fullName).toBe('A4');
    });
  });

  describe('3. Entidade de Domínio Note', () => {
    it('Note.fromName deve instanciar MIDI 60 a partir de C3 (no padrão C3) e C4 (no padrão C4)', () => {
      const noteBrasil = Note.fromName('C', 3, 'C3');
      const noteIntl = Note.fromName('C', 4, 'C4');

      expect(noteBrasil.midi).toBe(60);
      expect(noteIntl.midi).toBe(60);
      expect(noteBrasil.frequency).toBeCloseTo(noteIntl.frequency, 4);

      expect(noteBrasil.fullName).toBe('C3');
      expect(noteIntl.fullName).toBe('C4');
    });

    it('Note.fromMidi deve gerar o nome correto conforme o padrão configurado', () => {
      const nC3 = Note.fromMidi(60, 'C3');
      const nC4 = Note.fromMidi(60, 'C4');

      expect(nC3.fullName).toBe('C3');
      expect(nC3.octave).toBe(3);

      expect(nC4.fullName).toBe('C4');
      expect(nC4.octave).toBe(4);

      expect(nC3.midi).toBe(nC4.midi);
      expect(nC3.frequency).toBe(nC4.frequency);
    });
  });
});
