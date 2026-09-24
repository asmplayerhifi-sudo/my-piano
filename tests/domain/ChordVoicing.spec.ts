import { describe, it, expect } from 'vitest';
import { Chord } from '../../src/domain/entities/Chord';
import type { Note } from '../../src/domain/entities/Note';

describe('Chord Domain Entity & Inversions', () => {
  it('deve construir a tríade de Dó Maior (C) na posição fundamental corretamente', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 3 });

    expect(cMajor.symbol).toBe('C');
    expect(cMajor.notes.map((n: Note) => n.fullName)).toEqual(['C3', 'E3', 'G3']);
    expect(cMajor.bassNote.fullName).toBe('C3');
  });

  it('deve calcular a 1ª Inversão (C/E) com baixo na terça Mi', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 3 });
    const firstInversion = cMajor.toInversion(1);

    expect(firstInversion.symbol).toBe('C/E');
    expect(firstInversion.notes.map((n: Note) => n.fullName)).toEqual(['E3', 'G3', 'C4']);
    expect(firstInversion.bassNote.fullName).toBe('E3');
  });

  it('deve calcular a 2ª Inversão (C/G) com baixo na quinta Sol', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 3 });
    const secondInversion = cMajor.toInversion(2);

    expect(secondInversion.symbol).toBe('C/G');
    expect(secondInversion.notes.map((n: Note) => n.fullName)).toEqual(['G3', 'C4', 'E4']);
    expect(secondInversion.bassNote.fullName).toBe('G3');
  });

  it('deve validar se um conjunto de notas tocadas corresponde à tríade esperada independente da ordem', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 3 });
    const playedKeys = ['G3', 'C3', 'E3'];

    const isMatch = cMajor.matchesVoicing(playedKeys);
    expect(isMatch).toBe(true);
  });
});
