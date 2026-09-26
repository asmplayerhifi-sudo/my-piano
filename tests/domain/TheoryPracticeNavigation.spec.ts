import { describe, it, expect, beforeEach } from 'vitest';
import {
  theoryPracticeStore,
  type TheoryPracticeSubTab,
} from '../../src/core/theoryPracticeStore';
import { TABS, type TabId } from '../../src/components/layout/Navigation';

describe('Prática Teórica — Integração no Menu PRÁTICA & Hub Interativo', () => {
  beforeEach(() => {
    // Restaura estado inicial padrão
    theoryPracticeStore.setKey('C');
    theoryPracticeStore.setSubTab('panoramic');
  });

  describe('1. Mapeamento no Menu Superior de Prática', () => {
    it('deve conter a aba "theory-practice" registrada na categoria de prática', () => {
      const practiceTabs = TABS.filter(t => t.category === 'practice');
      const practiceTabIds = practiceTabs.map(t => t.id);

      expect(practiceTabIds).toContain('theory-practice');

      const theoryPracticeTab = practiceTabs.find(t => t.id === 'theory-practice');
      expect(theoryPracticeTab).toBeDefined();
      expect(theoryPracticeTab?.label).toBe('Prática Teórica');
      expect(theoryPracticeTab?.category).toBe('practice');
    });

    it('deve seguir a ordenação requerida no menu PRÁTICA: Repertório -> Lab Rítmico -> Prática Teórica -> Teclado Livre -> Braço Violão', () => {
      const practiceTabs = TABS.filter(t => t.category === 'practice');
      const ids = practiceTabs.map(t => t.id);

      expect(ids).toEqual([
        'repertoire',
        'rhythm',
        'theory-practice',
        'piano',
        'guitar',
      ]);
    });
  });

  describe('2. Navegação Interna da Tela de Prática Teórica', () => {
    it('deve iniciar por padrão no modo Panorâmica (visão geral integrada)', () => {
      const state = theoryPracticeStore.getState();
      expect(state.activeSubTab).toBe('panoramic');
      expect(state.selectedKey).toBe('C');
    });

    it('deve alternar rapidamente entre as 4 ferramentas internas: Escalas, Círculo das Quintas, Régua Cromática e Panorâmica', () => {
      const tabs: TheoryPracticeSubTab[] = ['scales', 'circle', 'ruler', 'panoramic'];

      tabs.forEach(tab => {
        theoryPracticeStore.setSubTab(tab);
        expect(theoryPracticeStore.getState().activeSubTab).toBe(tab);
      });
    });
  });

  describe('3. Persistência de Tonalidade Compartilhada (Requisito Específico)', () => {
    it('se o usuário selecionar Dó Maior (C) no Círculo e mudar para a aba Escalas, a tonalidade deve permanecer Dó Maior (C)', () => {
      // 1. Usuário no Círculo das Quintas seleciona C
      theoryPracticeStore.setSubTab('circle');
      theoryPracticeStore.setKey('C');
      expect(theoryPracticeStore.getState().selectedKey).toBe('C');

      // 2. Muda para Escalas
      theoryPracticeStore.setSubTab('scales');
      expect(theoryPracticeStore.getState().selectedKey).toBe('C');
    });

    it('se o aluno selecionar Sol Maior (G) no Círculo das Quintas, a escala exibida automaticamente será Sol Maior (G)', () => {
      // 1. Seleciona Sol (G) no Círculo
      theoryPracticeStore.setSubTab('circle');
      theoryPracticeStore.setKey('G');
      expect(theoryPracticeStore.getState().selectedKey).toBe('G');

      // 2. Alterna para a aba Escalas
      theoryPracticeStore.setSubTab('scales');
      expect(theoryPracticeStore.getState().selectedKey).toBe('G');

      // 3. Alterna para a Régua Cromática
      theoryPracticeStore.setSubTab('ruler');
      expect(theoryPracticeStore.getState().selectedKey).toBe('G');

      // 4. Alterna para o modo Panorâmico
      theoryPracticeStore.setSubTab('panoramic');
      expect(theoryPracticeStore.getState().selectedKey).toBe('G');
    });

    it('suporta tonalidades bemóis e sustenidos mantendo consistência enarmônica', () => {
      const chromaticRoots = ['Eb', 'F#', 'Bb', 'Ab', 'Db'];

      chromaticRoots.forEach(root => {
        theoryPracticeStore.setKey(root);
        expect(theoryPracticeStore.getState().selectedKey).toBe(root);

        theoryPracticeStore.setSubTab('scales');
        expect(theoryPracticeStore.getState().selectedKey).toBe(root);
      });
    });
  });
});
