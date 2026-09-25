import { describe, it, expect } from 'vitest';
import { INTERVAL_CATALOG } from '../../src/components/theory/IntervalLaboratory';

describe('Interval Catalog & Musical Symmetry', () => {
  it('deve conter exatamente os 13 intervalos da oitava cromática (0 a 12 semitons)', () => {
    expect(INTERVAL_CATALOG).toHaveLength(13);
    INTERVAL_CATALOG.forEach((item, idx) => {
      expect(item.semitones).toBe(idx);
      expect(item.shortName).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.formula).toBeTruthy();
      expect(item.mood).toBeTruthy();
      expect(item.acousticRatio).toBeTruthy();
      expect(item.example).toBeTruthy();
    });
  });

  it('a soma de qualquer intervalo com sua inversão harmônica (Regra do 9) deve totalizar 12 semitons (oitava justa)', () => {
    INTERVAL_CATALOG.forEach((item) => {
      expect(item.semitones + item.inversionSemitones).toBe(12);
    });
  });

  it('as razões acústicas devem respeitar as proporções pitagóricas e justas fundamentais', () => {
    const unissono = INTERVAL_CATALOG[0];
    const quartaJusta = INTERVAL_CATALOG[5];
    const quintaJusta = INTERVAL_CATALOG[7];
    const oitavaJusta = INTERVAL_CATALOG[12];

    expect(unissono.acousticRatio).toBe('1:1');
    expect(quartaJusta.acousticRatio).toBe('4:3');
    expect(quintaJusta.acousticRatio).toBe('3:2');
    expect(oitavaJusta.acousticRatio).toBe('2:1');
  });
});
