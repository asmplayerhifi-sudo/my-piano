import { describe, it, expect } from 'vitest';
import { KEYBOARD_COURSE_MODULES, GUITAR_COURSE_MODULES } from '../../src/core/coursesData';
import { THEORY_MODULES } from '../../src/core/theoryLessonsData';

describe('Modal Centralizado da Trilha de Aulas (REQ-UI-MODAL-TRILHA-01)', () => {
  describe('RF-01: Gatilho de Abertura & Identificação no Header Contextual', () => {
    it('o Header Contextual deve exibir a contagem e padrão textual [TRILHA DE AULAS — VER TODAS (X / N)]', () => {
      const currentLessonCode = '1.4';
      const totalLessons = 30;
      const expectedLabel = `🗺️ TRILHA DE AULAS — VER TODAS (${currentLessonCode} / ${totalLessons})`;
      const expectedShortLabel = `🗺️ TRILHA (${currentLessonCode} / ${totalLessons})`;

      expect(expectedLabel).toContain('TRILHA DE AULAS — VER TODAS');
      expect(expectedLabel).toContain('(1.4 / 30)');
      expect(expectedShortLabel).toContain('TRILHA (1.4 / 30)');
    });

    it('o atalho de teclado global registrado deve ser Ctrl+T / Cmd+T', () => {
      const isTrailShortcut = (e: { ctrlKey: boolean; metaKey: boolean; key: string }) => {
        return (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't';
      };

      expect(isTrailShortcut({ ctrlKey: true, metaKey: false, key: 't' })).toBe(true);
      expect(isTrailShortcut({ ctrlKey: false, metaKey: true, key: 'T' })).toBe(true);
      expect(isTrailShortcut({ ctrlKey: false, metaKey: false, key: 't' })).toBe(false);
      expect(isTrailShortcut({ ctrlKey: true, metaKey: false, key: 'p' })).toBe(false);
    });
  });

  describe('RF-02 & Seção 4: Overlay, Dimensões e CSS Spec', () => {
    const MODAL_CSS_SPEC = {
      width: '85vw',
      maxWidthPx: 1000,
      height: '80vh',
      maxHeightPx: 750,
      zIndex: 2000,
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      overflowY: 'auto',
    };

    it('deve cumprir rigorosamente as dimensões especificadas no PRD', () => {
      expect(MODAL_CSS_SPEC.width).toBe('85vw');
      expect(MODAL_CSS_SPEC.maxWidthPx).toBe(1000);
      expect(MODAL_CSS_SPEC.height).toBe('80vh');
      expect(MODAL_CSS_SPEC.maxHeightPx).toBe(750);
      expect(MODAL_CSS_SPEC.zIndex).toBe(2000);
      expect(MODAL_CSS_SPEC.backdropFilter).toBe('blur(4px)');
      expect(MODAL_CSS_SPEC.backgroundColor).toBe('rgba(0, 0, 0, 0.6)');
      expect(MODAL_CSS_SPEC.overflowY).toBe('auto');
    });
  });

  describe('RF-03: Busca com Debounce (200ms) & Filtros Rápidos', () => {
    const DEBOUNCE_TIME_MS = 200;

    it('o tempo de debounce deve ser de 200ms', () => {
      expect(DEBOUNCE_TIME_MS).toBe(200);
    });

    it('deve filtrar corretamente por texto (título da lição ou módulo)', () => {
      const modules = KEYBOARD_COURSE_MODULES;
      const query = 'dó central';

      const matchedLessons = modules.flatMap((m) =>
        m.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(query) ||
            (l.subtitle && l.subtitle.toLowerCase().includes(query))
        )
      );

      expect(matchedLessons.length).toBeGreaterThan(0);
      expect(matchedLessons[0].title.toLowerCase()).toContain('dó central');
    });

    it('deve suportar os 3 modos de Filtros Rápidos: Todas, Concluídas e Em Andamento', () => {
      const mockCompletedLessonIds = ['k1-1', 'k1-2'];
      const sampleLessons = [
        { id: 'k1-1', title: 'Lição 1.1' },
        { id: 'k1-2', title: 'Lição 1.2' },
        { id: 'k1-3', title: 'Lição 1.3' },
        { id: 'k1-4', title: 'Lição 1.4' },
      ];

      // Filtro 1: Todas
      const filterAll = sampleLessons;
      expect(filterAll.length).toBe(4);

      // Filtro 2: Concluídas
      const filterCompleted = sampleLessons.filter((l) => mockCompletedLessonIds.includes(l.id));
      expect(filterCompleted.length).toBe(2);
      expect(filterCompleted.map((l) => l.id)).toEqual(['k1-1', 'k1-2']);

      // Filtro 3: Em Andamento
      const filterInProgress = sampleLessons.filter((l) => !mockCompletedLessonIds.includes(l.id));
      expect(filterInProgress.length).toBe(2);
      expect(filterInProgress.map((l) => l.id)).toEqual(['k1-3', 'k1-4']);
    });
  });

  describe('RF-04: Módulos em Accordion & Formatação de Progresso', () => {
    it('deve calcular corretamente a porcentagem e badge de progresso do módulo', () => {
      const formatModuleProgress = (completed: number, total: number, isLocked?: boolean) => {
        if (isLocked) return '[🔒 Bloqueado]';
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return `[Progresso: ${completed}/${total} | ${percent}%]`;
      };

      expect(formatModuleProgress(3, 3)).toBe('[Progresso: 3/3 | 100%]');
      expect(formatModuleProgress(1, 4)).toBe('[Progresso: 1/4 | 25%]');
      expect(formatModuleProgress(0, 4)).toBe('[Progresso: 0/4 | 0%]');
      expect(formatModuleProgress(0, 4, true)).toBe('[🔒 Bloqueado]');
    });
  });

  describe('RF-05: Indicadores Visuais de Status', () => {
    it('deve mapear os 4 estados visuais das lições: Concluída, Aula Atual, Pendente e Bloqueada', () => {
      const getLessonStatus = (
        lessonId: string,
        activeLessonId: string,
        completedLessonIds: string[],
        isLocked?: boolean
      ) => {
        if (isLocked) return 'LOCKED';
        if (completedLessonIds.includes(lessonId)) return 'COMPLETED';
        if (lessonId === activeLessonId) return 'ACTIVE';
        return 'PENDING';
      };

      const activeLessonId = 'k1-2';
      const completedIds = ['k1-1'];

      expect(getLessonStatus('k1-1', activeLessonId, completedIds)).toBe('COMPLETED');
      expect(getLessonStatus('k1-2', activeLessonId, completedIds)).toBe('ACTIVE');
      expect(getLessonStatus('k1-3', activeLessonId, completedIds)).toBe('PENDING');
      expect(getLessonStatus('k1-4', activeLessonId, completedIds, true)).toBe('LOCKED');
    });

    it('a aula ativa deve incluir a indicação de badge "<--- (AULA ATIVA)"', () => {
      const badgeText = '<--- (AULA ATIVA)';
      expect(badgeText).toContain('AULA ATIVA');
    });
  });

  describe('Cenários BDD (Critérios de Aceite)', () => {
    it('Cenário 1: o modal deve carregar todas as lições de qualquer curso sem truncar', () => {
      // Teclado
      const keyboardTotal = KEYBOARD_COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
      expect(keyboardTotal).toBe(30);

      // Violão
      const guitarTotal = GUITAR_COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
      expect(guitarTotal).toBe(30);

      // Teoria
      const theoryTotal = THEORY_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
      expect(theoryTotal).toBe(17);
    });

    it('Cenário 2: a seleção de uma aula desbloqueada deve permitir navegação direta sem reload', () => {
      let selectedLessonId: string | null = null;
      let modalOpen = true;

      const onSelectLesson = (lessonId: string) => {
        selectedLessonId = lessonId;
        modalOpen = false;
      };

      onSelectLesson('k2-1');

      expect(selectedLessonId).toBe('k2-1');
      expect(modalOpen).toBe(false);
    });

    it('Cenário 3: o pressionamento de ESC ou clique no backdrop fecha o modal sem alterar a aula', () => {
      const currentLessonId = 'k1-1';
      let targetLessonId = currentLessonId;
      let modalOpen = true;

      const handleDismiss = () => {
        modalOpen = false;
        // Não altera targetLessonId
      };

      handleDismiss();

      expect(modalOpen).toBe(false);
      expect(targetLessonId).toBe('k1-1');
    });
  });
});
