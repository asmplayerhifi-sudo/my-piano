import { describe, it, expect } from 'vitest';
import { Chord } from '../../src/domain/entities/Chord';
import type { Note } from '../../src/domain/entities/Note';

describe('Chord Domain Entity & Inversions', () => {
  it('deve construir a tríade de Dó Maior (C) na posição fundamental corretamente', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });

    expect(cMajor.symbol).toBe('C');
    expect(cMajor.notes.map((n: Note) => n.fullName)).toEqual(['C4', 'E4', 'G4']);
    expect(cMajor.bassNote.fullName).toBe('C4');
  });

  it('deve calcular a 1ª Inversão (C/E) com baixo na terça Mi', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    const firstInversion = cMajor.toInversion(1);

    expect(firstInversion.symbol).toBe('C/E');
    expect(firstInversion.notes.map((n: Note) => n.fullName)).toEqual(['E4', 'G4', 'C5']);
    expect(firstInversion.bassNote.fullName).toBe('E4');
  });

  it('deve calcular a 2ª Inversão (C/G) com baixo na quinta Sol', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    const secondInversion = cMajor.toInversion(2);

    expect(secondInversion.symbol).toBe('C/G');
    expect(secondInversion.notes.map((n: Note) => n.fullName)).toEqual(['G4', 'C5', 'E5']);
    expect(secondInversion.bassNote.fullName).toBe('G4');
  });

  it('deve validar se um conjunto de notas tocadas corresponde à tríade esperada independente da ordem', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    const playedKeys = ['G4', 'C4', 'E4'];

    const isMatch = cMajor.matchesVoicing(playedKeys);
    expect(isMatch).toBe(true);
  });
});
