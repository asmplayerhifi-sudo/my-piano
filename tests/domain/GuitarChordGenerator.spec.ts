import { describe, it, expect } from 'vitest';
import {
  generateGuitarChord,
  getCAGEDPositionsSummary,
  calculateHarmonicDegree,
  GUITAR_ROOT_NOTES,
  GUITAR_QUALITIES,
  CAGED_BASE_ROOTS,
} from '../../src/core/guitarChordGenerator';

describe('Guitar Chord Generator & CAGED Engine (REQ-UI-GUITAR-BUILDER-INTEGRATED-01)', () => {
  describe('C Major in all 5 CAGED Shapes', () => {
    it('generates standard open Shape C for C Major', () => {
      const chord = generateGuitarChord('C', 'major', 'C', 'root');
      expect(chord.rootNote).toBe('C');
      expect(chord.bassNote).toBe('C');
      expect(chord.cagedLetter).toBe('C');
      expect(chord.frets).toEqual([-1, 3, 2, 0, 1, 0]);
      expect(chord.fretRange.label).toContain('1 a 3');
      expect(chord.degrees).toContain('1');
    });

    it('generates barre Shape A for C Major at fret 3', () => {
      const chord = generateGuitarChord('C', 'major', 'A', 'root');
      expect(chord.rootNote).toBe('C');
      expect(chord.bassNote).toBe('C');
      expect(chord.cagedLetter).toBe('A');
      expect(chord.frets).toEqual([-1, 3, 5, 5, 5, 3]);
      expect(chord.barreFret).toBe(3);
    });

    it('generates Shape G for C Major at frets 5-8', () => {
      const chord = generateGuitarChord('C', 'major', 'G', 'root');
      expect(chord.rootNote).toBe('C');
      expect(chord.frets[0]).toBe(8); // C on 6th string
      expect(chord.frets[5]).toBe(8); // C on 1st string
    });

    it('generates Shape E for C Major at frets 8-10', () => {
      const chord = generateGuitarChord('C', 'major', 'E', 'root');
      expect(chord.rootNote).toBe('C');
      expect(chord.frets).toEqual([8, 10, 10, 9, 8, 8]);
      expect(chord.barreFret).toBe(8);
    });

    it('generates Shape D for C Major at frets 10-13', () => {
      const chord = generateGuitarChord('C', 'major', 'D', 'root');
      expect(chord.rootNote).toBe('C');
      expect(chord.frets).toEqual([-1, -1, 10, 12, 13, 12]);
    });
  });

  describe('Transposition across 12 chromatic roots', () => {
    it('supports all 12 root notes defined in GUITAR_ROOT_NOTES', () => {
      expect(GUITAR_ROOT_NOTES).toHaveLength(12);
      GUITAR_ROOT_NOTES.forEach((root) => {
        const chord = generateGuitarChord(root.symbol, 'major', 'E', 'root');
        expect(chord.rootNote).toBe(root.symbol);
        // All active frets must be >= 0 and <= 15
        chord.frets.forEach(f => {
          if (f !== -1) {
            expect(f).toBeGreaterThanOrEqual(0);
            expect(f).toBeLessThanOrEqual(15);
          }
        });
      });
    });

    it('supports all 8 chord qualities', () => {
      expect(GUITAR_QUALITIES).toHaveLength(8);
      const qualityIds = GUITAR_QUALITIES.map(q => q.id);
      expect(qualityIds).toContain('major');
      expect(qualityIds).toContain('minor');
      expect(qualityIds).toContain('maj7');
      expect(qualityIds).toContain('min7');
      expect(qualityIds).toContain('dom7');
      expect(qualityIds).toContain('dim');
      expect(qualityIds).toContain('sus4');
      expect(qualityIds).toContain('add9');

      qualityIds.forEach((qId) => {
        const chord = generateGuitarChord('A', qId, 'A', 'root');
        expect(chord.rootNote).toBe('A');
        expect(chord.frets).toHaveLength(6);
      });
    });
  });

  describe('Harmonic Degree Calculation', () => {
    it('calculates 1, 3M, and 5J for major triads', () => {
      expect(calculateHarmonicDegree(0, 0, 'major')).toBe('1');
      expect(calculateHarmonicDegree(4, 0, 'major')).toBe('3M');
      expect(calculateHarmonicDegree(7, 0, 'major')).toBe('5J');
    });

    it('calculates 3m for minor triads', () => {
      expect(calculateHarmonicDegree(3, 0, 'minor')).toBe('3m');
    });

    it('calculates 7M and 7m for tetrads', () => {
      expect(calculateHarmonicDegree(11, 0, 'maj7')).toBe('7M');
      expect(calculateHarmonicDegree(10, 0, 'dom7')).toBe('7m');
      expect(calculateHarmonicDegree(10, 0, 'min7')).toBe('7m');
    });

    it('calculates 4J for sus4 and 9M for add9', () => {
      expect(calculateHarmonicDegree(5, 0, 'sus4')).toBe('4J');
      expect(calculateHarmonicDegree(2, 0, 'add9')).toBe('9M');
    });
  });

  describe('Bass Inversions', () => {
    it('generates 1st inversion with 3rd in bass (C/E)', () => {
      const chord = generateGuitarChord('C', 'major', 'C', 'first');
      expect(chord.bassNote).toBe('E');
      expect(chord.name).toContain('Dó');
      expect(chord.frets[0]).toBe(0); // 6th string E open!
    });

    it('generates 2nd inversion with 5th in bass (C/G)', () => {
      const chord = generateGuitarChord('C', 'major', 'C', 'second');
      expect(chord.bassNote).toBe('G');
      expect(chord.frets[0]).toBe(3); // 6th string fret 3 is G
    });
  });

  describe('Dynamic CAGED Positions Summary', () => {
    it('computes dynamic fret ranges for all 5 shapes', () => {
      const summary = getCAGEDPositionsSummary('C', 'major');
      expect(summary.C).toBeDefined();
      expect(summary.A).toBeDefined();
      expect(summary.G).toBeDefined();
      expect(summary.E).toBeDefined();
      expect(summary.D).toBeDefined();
      expect(summary.C).toContain('1 a 3');
      expect(summary.E).toContain('8 a 10');
    });

    it('computes correct dynamic positions when root changes to G', () => {
      const summary = getCAGEDPositionsSummary('G', 'major');
      expect(summary.G).toContain('2 a 3'); // Open G pressed frets are 2 and 3
    });
  });

  describe('Biomechanical Posture Tips', () => {
    it('produces specific posture guidance for each shape and barre', () => {
      const shapeC = generateGuitarChord('C', 'major', 'C');
      expect(shapeC.postureTip).toContain('Shape C');

      const barreChord = generateGuitarChord('F', 'major', 'E');
      expect(barreChord.postureTip).toContain('Pestana');
    });
  });
});
