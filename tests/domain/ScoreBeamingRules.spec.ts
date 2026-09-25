import { describe, it, expect } from 'vitest';
import { buildBeamGroups, type BeamCandidate, type BeamingOptions } from '../../src/components/score/scoreBeaming';

describe('ScoreBeaming - Regras Gramaticais de Beaming e Isolamento de Compasso (REQ-BUG-01)', () => {
  const options: BeamingOptions = {
    getMiddleLineY: (clef) => (clef === 'treble' ? 140 : 260),
    stemOffset: 10,
    minStemLength: 36,
    beamThickness: 4.2,
    beatsPerMeasure: 4,
  };

  it('NUNCA deve unir notas através de linhas de compasso (compassos distintos)', () => {
    // Cenário idêntico ao reportado no bug de Ode à Alegria:
    // C3 em compasso 8 (beat 2.5) e E3/F3 em compasso 10 (beats 2.0 e 2.5)
    const candidates: BeamCandidate[] = [
      { id: '1', x: 200, y: 154, duration: 0.5, beat: 2.5, measure: 8, clef: 'treble' },
      { id: '2', x: 450, y: 147, duration: 0.5, beat: 2.0, measure: 10, clef: 'treble' },
      { id: '3', x: 485, y: 140, duration: 0.5, beat: 2.5, measure: 10, clef: 'treble' },
    ];

    const groups = buildBeamGroups(candidates, options);

    // Deve gerar 2 grupos distintos:
    // Grupo 1: Nota de compasso 8 isolada (isBeamed: false, isolatedFlag presente)
    // Grupo 2: Notas do compasso 10 unidas entre si (isBeamed: true)
    expect(groups.length).toBe(2);

    expect(groups[0].isBeamed).toBe(false);
    expect(groups[0].isolatedFlag).toBeDefined();
    expect(groups[0].stems.length).toBe(1);

    expect(groups[1].isBeamed).toBe(true);
    expect(groups[1].primaryBeam).toBeDefined();
    expect(groups[1].stems.length).toBe(2);
    // As hastes do grupo 2 devem estar nos X de compasso 10
    expect(groups[1].stems[0].x).toBeCloseTo(460, 1);
    expect(groups[1].stems[1].x).toBeCloseTo(495, 1);
  });

  it('deve agrupar corretamente colcheias contíguas dentro do mesmo compasso e tempo', () => {
    const candidates: BeamCandidate[] = [
      { id: '1', x: 100, y: 140, duration: 0.5, beat: 1.0, measure: 1, clef: 'treble' },
      { id: '2', x: 135, y: 133, duration: 0.5, beat: 1.5, measure: 1, clef: 'treble' },
    ];

    const groups = buildBeamGroups(candidates, options);
    expect(groups.length).toBe(1);
    expect(groups[0].isBeamed).toBe(true);
    expect(groups[0].primaryBeam).toBeDefined();
    expect(groups[0].stems.length).toBe(2);
  });

  it('deve respeitar a divisão métrica em 4/4 e não cruzar o meio do compasso (entre tempo 2.5 e 3)', () => {
    // Duas colcheias no tempo 2 (beat 2.0 e 2.5) e duas no tempo 3 (beat 3.0 e 3.5)
    const candidates: BeamCandidate[] = [
      { id: '1', x: 100, y: 140, duration: 0.5, beat: 2.0, measure: 1, clef: 'treble' },
      { id: '2', x: 135, y: 133, duration: 0.5, beat: 2.5, measure: 1, clef: 'treble' },
      { id: '3', x: 170, y: 126, duration: 0.5, beat: 3.0, measure: 1, clef: 'treble' },
      { id: '4', x: 205, y: 119, duration: 0.5, beat: 3.5, measure: 1, clef: 'treble' },
    ];

    const groups = buildBeamGroups(candidates, options);
    // Devem ser divididos em dois grupos de 2 colcheias cada
    expect(groups.length).toBe(2);
    expect(groups[0].isBeamed).toBe(true);
    expect(groups[0].stems.length).toBe(2);
    expect(groups[1].isBeamed).toBe(true);
    expect(groups[1].stems.length).toBe(2);
  });

  it('deve quebrar o grupo se houver intervalo/salto de tempo (notas não contíguas)', () => {
    const candidates: BeamCandidate[] = [
      { id: '1', x: 100, y: 140, duration: 0.5, beat: 1.0, measure: 1, clef: 'treble' },
      // Pausa ou semínima no meio (salto para beat 2.5)
      { id: '2', x: 200, y: 133, duration: 0.5, beat: 2.5, measure: 1, clef: 'treble' },
    ];

    const groups = buildBeamGroups(candidates, options);
    expect(groups.length).toBe(2);
    expect(groups[0].isBeamed).toBe(false);
    expect(groups[1].isBeamed).toBe(false);
  });

  it('deve gerar sub-barras (secondaryBeams) para semicolcheias (dur <= 0.25)', () => {
    const candidates: BeamCandidate[] = [
      { id: '1', x: 100, y: 140, duration: 0.25, beat: 1.0, measure: 1, clef: 'treble' },
      { id: '2', x: 120, y: 133, duration: 0.25, beat: 1.25, measure: 1, clef: 'treble' },
      { id: '3', x: 140, y: 126, duration: 0.25, beat: 1.5, measure: 1, clef: 'treble' },
      { id: '4', x: 160, y: 119, duration: 0.25, beat: 1.75, measure: 1, clef: 'treble' },
    ];

    const groups = buildBeamGroups(candidates, options);
    expect(groups.length).toBe(1);
    expect(groups[0].isBeamed).toBe(true);
    expect(groups[0].primaryBeam).toBeDefined();
    expect(groups[0].secondaryBeams).toBeDefined();
    expect(groups[0].secondaryBeams?.length).toBeGreaterThan(0);
  });
});
