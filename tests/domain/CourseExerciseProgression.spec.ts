import { describe, it, expect } from 'vitest';
import { KEYBOARD_COURSE_MODULES } from '../../src/core/coursesData';

describe('Course & Exercise Progression Pedagogy', () => {
  it('deve conter 10 módulos pedagógicos estruturados para Teclado & Piano', () => {
    expect(KEYBOARD_COURSE_MODULES).toHaveLength(10);
    const codes = KEYBOARD_COURSE_MODULES.map(m => m.code);
    expect(codes).toEqual(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10']);
  });

  it('cada uma das 30 lições deve disponibilizar múltiplos exercícios práticos com objetivos claros', () => {
    let totalExercises = 0;
    for (const mod of KEYBOARD_COURSE_MODULES) {
      expect(mod.lessons.length).toBeGreaterThanOrEqual(3);
      for (const lesson of mod.lessons) {
        expect(lesson.exercises).toBeDefined();
        expect(lesson.exercises!.length).toBeGreaterThanOrEqual(3);
        totalExercises += lesson.exercises!.length;

        // Valida estrutura de cada exercício
        for (const ex of lesson.exercises!) {
          expect(ex.id).toBeTruthy();
          expect(ex.title).toBeTruthy();
          expect(ex.goal).toBeTruthy();
          expect(ex.bpm).toBeGreaterThan(0);
          expect(['4/4', '3/4', '2/4']).toContain(ex.timeSignature);
          expect(ex.evaluationCriteria).toBeDefined();
          expect(ex.evaluationCriteria.minAccuracyPercent).toBeGreaterThanOrEqual(70);
          expect(ex.evaluationCriteria.targetPrecisionMs).toBeGreaterThan(0);

          if (ex.scoreTrack) {
            expect(ex.scoreTrack.length).toBeGreaterThan(0);
            for (const note of ex.scoreTrack) {
              expect(note.midi).toBeGreaterThanOrEqual(21);
              expect(note.midi).toBeLessThanOrEqual(108);
              expect(note.duration).toBeGreaterThan(0);
              expect(note.beat).toBeGreaterThanOrEqual(1);
            }
          }
        }
      }
    }

    // Deve haver pelo menos 90 exercícios distribuídos nas 30 aulas (média 3 a 4 por aula)
    expect(totalExercises).toBeGreaterThanOrEqual(90);
  });

  it('deve contemplar tipos de exercícios progressivos (notes, rhythm, phrase)', () => {
    const allTypes = new Set<string>();
    for (const mod of KEYBOARD_COURSE_MODULES) {
      for (const lesson of mod.lessons) {
        for (const ex of lesson.exercises || []) {
          allTypes.add(ex.type);
        }
      }
    }

    expect(allTypes.has('notes')).toBe(true);
    expect(allTypes.has('rhythm')).toBe(true);
    expect(allTypes.has('phrase')).toBe(true);
  });
});
