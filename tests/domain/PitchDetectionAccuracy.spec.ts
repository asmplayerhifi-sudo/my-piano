import { describe, it, expect } from 'vitest';
import { detectPitchFromBuffer, frequencyToMidi, midiToNoteName } from '../../src/core/pitchDetector';
import { octaveConfigStore } from '../../src/core/octaveConfigStore';

describe('Pitch Detection Accuracy & Octave Standards', () => {
  const sampleRate = 44100;

  function generateToneBuffer(freq: number, numSamples = 2048): Float32Array {
    const buf = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Fundamental f0
      let val = Math.sin(2 * Math.PI * freq * t);
      // Harmônicos naturais do instrumento acústico (2*f0, 3*f0, 4*f0)
      val += 0.6 * Math.sin(2 * Math.PI * (freq * 2) * t);
      val += 0.4 * Math.sin(2 * Math.PI * (freq * 3) * t);
      val += 0.2 * Math.sin(2 * Math.PI * (freq * 4) * t);
      buf[i] = val * 0.25;
    }
    return buf;
  }

  it('deve detectar Dó 3 (261.63 Hz, MIDI 60) como MIDI 60 e Dó 3 no padrão C3 Brasil', () => {
    octaveConfigStore.setStandard('C3');
    const buf = generateToneBuffer(261.63, 2048);
    const result = detectPitchFromBuffer(buf, sampleRate, 0.01);

    expect(result).not.toBeNull();
    if (result) {
      const midi = frequencyToMidi(result.freq);
      expect(midi).toBe(60);
      const noteName = midiToNoteName(midi, 'C3');
      expect(noteName).toBe('C3');
    }
  });

  it('deve detectar Dó 4 (261.63 Hz, MIDI 60) como MIDI 60 e C4 no padrão C4 Internacional', () => {
    octaveConfigStore.setStandard('C4');
    const buf = generateToneBuffer(261.63, 2048);
    const result = detectPitchFromBuffer(buf, sampleRate, 0.01);

    expect(result).not.toBeNull();
    if (result) {
      const midi = frequencyToMidi(result.freq);
      expect(midi).toBe(60);
      const noteName = midiToNoteName(midi, 'C4');
      expect(noteName).toBe('C4');
    }
  });

  it('deve detectar Dó 2 (130.81 Hz, MIDI 48) com precisão sem pular para Dó 1 (65 Hz)', () => {
    octaveConfigStore.setStandard('C3');
    const buf = generateToneBuffer(130.81, 2048);
    const result = detectPitchFromBuffer(buf, sampleRate, 0.01);

    expect(result).not.toBeNull();
    if (result) {
      const midi = frequencyToMidi(result.freq);
      expect(midi).toBe(48);
      const noteName = midiToNoteName(midi, 'C3');
      expect(noteName).toBe('C2');
    }
  });

  it('deve detectar Lá 440 Hz (MIDI 69) como Lá 3 no padrão C3 Brasil e Lá 4 no padrão C4 Internacional', () => {
    const buf = generateToneBuffer(440, 2048, false);
    const result = detectPitchFromBuffer(buf, sampleRate, 0.01);

    expect(result).not.toBeNull();
    if (result) {
      const midi = frequencyToMidi(result.freq);
      expect(midi).toBe(69);
      expect(midiToNoteName(midi, 'C3')).toBe('A3');
      expect(midiToNoteName(midi, 'C4')).toBe('A4');
    }
  });
});
