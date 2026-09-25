import { describe, it, expect } from 'vitest';
import { identifyChordFromMidi } from '../../src/core/musicTheory';

describe('Real-Time Chord Identification from MIDI notes', () => {
  it('identifica nota única individual', () => {
    const singleC = identifyChordFromMidi([60], 'C3');
    expect(singleC).not.toBeNull();
    expect(singleC?.symbol).toBe('C3');
    expect(singleC?.namePt).toBe('Nota Dó3');
  });

  it('identifica tríades fundamentais (C, Dm, G)', () => {
    // C Maior: C3 (60), E3 (64), G3 (67)
    const cMajor = identifyChordFromMidi([60, 64, 67]);
    expect(cMajor).not.toBeNull();
    expect(cMajor?.symbol).toBe('C');
    expect(cMajor?.namePt).toBe('Dó Maior');
    expect(cMajor?.quality).toBe('major');
    expect(cMajor?.isInversion).toBe(false);

    // D Menor: D3 (62), F3 (65), A3 (69)
    const dMinor = identifyChordFromMidi([62, 65, 69]);
    expect(dMinor).not.toBeNull();
    expect(dMinor?.symbol).toBe('Dm');
    expect(dMinor?.namePt).toBe('Ré Menor');
    expect(dMinor?.quality).toBe('minor');

    // G Maior: G3 (67), B3 (71), D4 (74)
    const gMajor = identifyChordFromMidi([67, 71, 74]);
    expect(gMajor).not.toBeNull();
    expect(gMajor?.symbol).toBe('G');
    expect(gMajor?.namePt).toBe('Sol Maior');
  });

  it('identifica inversões de acordes (Slash Chords C/E, C/G, G/B)', () => {
    // C/E (1ª Inversão): E3 (64), G3 (67), C4 (72)
    const cOverE = identifyChordFromMidi([64, 67, 72]);
    expect(cOverE).not.toBeNull();
    expect(cOverE?.symbol).toBe('C/E');
    expect(cOverE?.namePt).toBe('Dó Maior com baixo em Mi');
    expect(cOverE?.isInversion).toBe(true);
    expect(cOverE?.bass).toBe('E');

    // G/B (1ª Inversão): B2 (59), D3 (62), G3 (67)
    const gOverB = identifyChordFromMidi([59, 62, 67]);
    expect(gOverB).not.toBeNull();
    expect(gOverB?.symbol).toBe('G/B');
    expect(gOverB?.namePt).toBe('Sol Maior com baixo em Si');
    expect(gOverB?.isInversion).toBe(true);
  });

  it('identifica tétrades com sétima (G7, Am7, Cmaj7)', () => {
    // G7: G3 (67), B3 (71), D4 (74), F4 (77)
    const g7 = identifyChordFromMidi([67, 71, 74, 77]);
    expect(g7).not.toBeNull();
    expect(g7?.symbol).toBe('G7');
    expect(g7?.namePt).toBe('Sol com Sétima');
    expect(g7?.quality).toBe('dom7');

    // Am7: A3 (69), C4 (72), E4 (76), G4 (79)
    const am7 = identifyChordFromMidi([69, 72, 76, 79]);
    expect(am7).not.toBeNull();
    expect(am7?.symbol).toBe('Am7');
    expect(am7?.namePt).toBe('Lá Menor com Sétima');
    expect(am7?.quality).toBe('min7');

    // Cmaj7: C3 (60), E3 (64), G3 (67), B3 (71)
    const cmaj7 = identifyChordFromMidi([60, 64, 67, 71]);
    expect(cmaj7).not.toBeNull();
    expect(cmaj7?.symbol).toBe('Cmaj7');
    expect(cmaj7?.namePt).toBe('Dó Maior com Sétima Maior');
    expect(cmaj7?.quality).toBe('maj7');
  });

  it('identifica díades / intervalos quando apenas duas notas são tocadas', () => {
    // C3 (60) e G3 (67) -> Quinta Justa
    const fifth = identifyChordFromMidi([60, 67]);
    expect(fifth).not.toBeNull();
    expect(fifth?.namePt).toContain('Quinta Justa');
  });
});
