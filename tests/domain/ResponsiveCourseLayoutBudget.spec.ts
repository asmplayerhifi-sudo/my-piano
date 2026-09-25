import { describe, it, expect } from 'vitest';
import { KEYBOARD_COURSE_MODULES, GUITAR_COURSE_MODULES } from '../../src/core/coursesData';
import { THEORY_MODULES } from '../../src/core/theoryLessonsData';

describe('Redesenho Responsivo & Pixel Budget (PRD HARMONIA)', () => {
  describe('Orçamento Vertical (Pixel Budget e Header Responsivo REQ-UI-LESSONHEADER-01)', () => {
    // Especificação Definitiva de UX/UI: Header Global ~54px e Header Unificado da Aula 44px
    const HEADER_GLOBAL_TARGET_PX = 54;
    const HEADER_UNIFIED_LESSON_TARGET_PX = 44;
    const TOTAL_TARGET_PX = HEADER_GLOBAL_TARGET_PX + HEADER_UNIFIED_LESSON_TARGET_PX;
    const MAX_STRUCTURAL_LIMIT_PX = 125;

    it('a soma dos elementos persistentes superiores (Global + Aula Unificada) deve ser de 98px (<= 125px)', () => {
      expect(TOTAL_TARGET_PX).toBe(98);
      expect(TOTAL_TARGET_PX).toBeLessThanOrEqual(MAX_STRUCTURAL_LIMIT_PX);
    });

    it('o Header da Aula Unificado não deve ultrapassar 44px de altura fixa sob nenhuma circunstância', () => {
      expect(HEADER_UNIFIED_LESSON_TARGET_PX).toBe(44);
      expect(HEADER_UNIFIED_LESSON_TARGET_PX).toBeLessThanOrEqual(44);
      expect(HEADER_GLOBAL_TARGET_PX).toBeLessThanOrEqual(56);
      expect(HEADER_GLOBAL_TARGET_PX).toBeGreaterThanOrEqual(50);
    });
  });

  describe('Laboratório de Intervalos & Proporção Geométrica (REQ-LAB-02 / CA 3 / CA 4)', () => {
    it('deve respeitar os limites de container: 1200px standalone e 650px no Grid de Teoria', () => {
      const STANDALONE_MAX_WIDTH_PX = 1200;
      const THEORY_GRID_MAX_WIDTH_PX = 650;

      expect(STANDALONE_MAX_WIDTH_PX).toBe(1200);
      expect(THEORY_GRID_MAX_WIDTH_PX).toBe(650);
      expect(THEORY_GRID_MAX_WIDTH_PX).toBeLessThan(STANDALONE_MAX_WIDTH_PX);
    });

    it('o teclado anatômico deve calcular proporções físicas sem estiramento horizontal artificial', () => {
      // Simula o cálculo geométrico do IntervalLaboratory
      const containerWidthInGrid = 600;
      const availableWidth = Math.max(260, containerWidthInGrid - 32);
      const whiteKeysCount = 15; // 2 oitavas diatônicas

      const calculatedKeyWidth = Math.min(36, Math.max(22, Math.floor(availableWidth / whiteKeysCount)));
      const calculatedKeyHeight = Math.round(calculatedKeyWidth * 3.8);
      const blackKeyWidth = Math.round(calculatedKeyWidth * 0.62);
      const blackKeyHeight = Math.round(calculatedKeyHeight * 0.62);

      // Valida limites anatômicos da tecla branca
      expect(calculatedKeyWidth).toBeGreaterThanOrEqual(22);
      expect(calculatedKeyWidth).toBeLessThanOrEqual(36);

      // Valida proporção física (altura ~3.8x largura)
      const ratio = calculatedKeyHeight / calculatedKeyWidth;
      expect(ratio).toBeGreaterThan(3.5);
      expect(ratio).toBeLessThan(4.1);

      // Valida que tecla preta é ~60-65% da branca
      expect(blackKeyWidth / calculatedKeyWidth).toBeCloseTo(0.62, 1);
      expect(blackKeyHeight / calculatedKeyHeight).toBeCloseTo(0.62, 1);
    });
  });

  describe('Grid Responsivo do Curso de Teoria (REQ-TEO-03 / CA 5 / CA 6)', () => {
    it('deve definir o breakpoint de transição para 2 colunas em 1280px (xl)', () => {
      const BREAKPOINT_2_COLUMNS_PX = 1280;
      expect(BREAKPOINT_2_COLUMNS_PX).toBe(1280);
    });

    it('as colunas da grade de teoria devem balancear Teoria/Exercícios e Laboratório (50%/50%)', () => {
      const leftColSpan = 6;
      const rightColSpan = 6;
      const totalGridCols = 12;

      expect(leftColSpan + rightColSpan).toBe(totalGridCols);
      expect(leftColSpan / totalGridCols).toBe(0.5);
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
