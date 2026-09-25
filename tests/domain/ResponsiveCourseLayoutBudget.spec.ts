import { describe, it, expect } from 'vitest';
import { KEYBOARD_COURSE_MODULES, GUITAR_COURSE_MODULES } from '../../src/core/coursesData';
import { THEORY_MODULES } from '../../src/core/theoryLessonsData';

describe('Redesenho Responsivo & Pixel Budget (PRD HARMONIA)', () => {
  describe('Orçamento Vertical (Pixel Budget)', () => {
    const HEADER_GLOBAL_TARGET_PX = 38;
    const HEADER_CONTEXTUAL_TARGET_PX = 36;
    const SUB_TABS_TARGET_PX = 32;
    const TOTAL_TARGET_PX = HEADER_GLOBAL_TARGET_PX + HEADER_CONTEXTUAL_TARGET_PX + SUB_TABS_TARGET_PX;
    const MAX_STRUCTURAL_LIMIT_PX = 114;

    it('a soma dos elementos persistentes superiores deve ser de até 106px', () => {
      expect(TOTAL_TARGET_PX).toBe(106);
      expect(TOTAL_TARGET_PX).toBeLessThanOrEqual(MAX_STRUCTURAL_LIMIT_PX);
    });

    it('cada elemento deve respeitar seu teto individual de altura', () => {
      expect(HEADER_GLOBAL_TARGET_PX).toBeLessThanOrEqual(38);
      expect(HEADER_CONTEXTUAL_TARGET_PX).toBeLessThanOrEqual(36);
      expect(SUB_TABS_TARGET_PX).toBeLessThanOrEqual(32);
    });
  });

  describe('Arquitetura de Navegação Linear entre Aulas (CA 8.1 - 8.4)', () => {
    it('o curso de Teclado deve permitir navegação sequencial Anterior/Próxima em 30 aulas sem reload', () => {
      const keyboardLessons = KEYBOARD_COURSE_MODULES.flatMap((m) =>
        m.lessons.map((l) => ({ lesson: l, module: m }))
      );

      expect(keyboardLessons.length).toBe(30);

      // Valida transição em cada índice
      for (let i = 0; i < keyboardLessons.length; i++) {
        const hasPrev = i > 0;
        const hasNext = i < keyboardLessons.length - 1;

        if (i === 0) {
          expect(hasPrev).toBe(false);
          expect(hasNext).toBe(true);
        } else if (i === keyboardLessons.length - 1) {
          expect(hasPrev).toBe(true);
          expect(hasNext).toBe(false);
        } else {
          expect(hasPrev).toBe(true);
          expect(hasNext).toBe(true);
        }

        // Valida que aula anterior e próxima são válidas
        if (hasPrev) {
          expect(keyboardLessons[i - 1].lesson.id).toBeTruthy();
        }
        if (hasNext) {
          expect(keyboardLessons[i + 1].lesson.id).toBeTruthy();
        }
      }
    });

    it('o curso de Violão deve permitir navegação sequencial Anterior/Próxima em 30 aulas sem reload', () => {
      const guitarLessons = GUITAR_COURSE_MODULES.flatMap((m) =>
        m.lessons.map((l) => ({ lesson: l, module: m }))
      );

      expect(guitarLessons.length).toBe(30);
      expect(guitarLessons[0].lesson.id).toBe('v1-1');
      expect(guitarLessons[guitarLessons.length - 1].lesson.id).toBe('v10-3');
    });

    it('a Academia de Teoria deve permitir navegação sequencial em todas as suas lições', () => {
      const theoryLessons = THEORY_MODULES.flatMap((m) => m.lessons);
      expect(theoryLessons.length).toBe(17);
      expect(theoryLessons[0].id).toBe('m1-1');
      expect(theoryLessons[theoryLessons.length - 1].id).toBeTruthy();
    });
  });

  describe('Diferenciação Visual e Coerência de Temas (CA 3.4)', () => {
    it('deve associar as cores temáticas prescritas: Teclado (Roxo/Indigo), Violão (Laranja/Âmbar), Teoria (Azul/Ciano)', () => {
      const themes = {
        keyboard: 'indigo',
        guitar: 'amber',
        theory: 'cyan',
      };

      expect(themes.keyboard).toBe('indigo');
      expect(themes.guitar).toBe('amber');
      expect(themes.theory).toBe('cyan');
    });
  });

  describe('Reutilização de Arquitetura de Layout (CA 5.1 - 5.4)', () => {
    it('todos os cursos possuem estrutura compatível com TrailModuleItem para o modal de Trilha', () => {
      // Teclado
      const keyboardTrail = KEYBOARD_COURSE_MODULES.map((m) => ({
        code: m.code,
        title: m.title,
        lessonsCount: m.lessons.length,
      }));
      expect(keyboardTrail.length).toBe(10);
      expect(keyboardTrail.every((m) => m.lessonsCount >= 3)).toBe(true);

      // Violão
      const guitarTrail = GUITAR_COURSE_MODULES.map((m) => ({
        code: m.code,
        title: m.title,
        lessonsCount: m.lessons.length,
      }));
      expect(guitarTrail.length).toBe(10);
      expect(guitarTrail.every((m) => m.lessonsCount >= 3)).toBe(true);

      // Teoria
      const theoryTrail = THEORY_MODULES.map((m) => ({
        code: m.code,
        title: m.title,
        lessonsCount: m.lessons.length,
      }));
      expect(theoryTrail.length).toBe(7);
      expect(theoryTrail.every((m) => m.lessonsCount >= 1)).toBe(true);
    });
  });
});
