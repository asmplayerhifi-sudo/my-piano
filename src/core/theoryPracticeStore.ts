/**
 * theoryPracticeStore.ts
 *
 * Gerenciador reativo centralizado de tonalidade e estado da Prática Teórica (Harmonia).
 * Garante a persistência de tonalidade (ex: C / Dó Maior) entre Círculo das Quintas,
 * Escalas, Régua Cromática e Modo Panorâmico sem perda de contexto ou recarregamento.
 */

import { useSyncExternalStore } from 'react';
import type { ScaleCategory } from './scaleData';

export type TheoryPracticeSubTab = 'scales' | 'circle' | 'ruler' | 'panoramic';

export interface TheoryPracticeState {
  selectedKey: string;
  selectedScaleCategory: ScaleCategory;
  selectedScaleId: string;
  activeSubTab: TheoryPracticeSubTab;
}

type Listener = () => void;

class TheoryPracticeStore {
  private state: TheoryPracticeState = {
    selectedKey: 'C',
    selectedScaleCategory: 'pentatonic',
    selectedScaleId: 'penta-minor',
    activeSubTab: 'panoramic',
  };

  private listeners = new Set<Listener>();

  public getState(): TheoryPracticeState {
    return this.state;
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public setKey(key: string) {
    const cleanKey = key.trim();
    if (this.state.selectedKey !== cleanKey) {
      this.state = {
        ...this.state,
        selectedKey: cleanKey,
      };
      this.notify();
    }
  }

  public setScale(category: ScaleCategory, scaleId: string) {
    if (
      this.state.selectedScaleCategory !== category ||
      this.state.selectedScaleId !== scaleId
    ) {
      this.state = {
        ...this.state,
        selectedScaleCategory: category,
        selectedScaleId: scaleId,
      };
      this.notify();
    }
  }

  public setSubTab(subTab: TheoryPracticeSubTab) {
    if (this.state.activeSubTab !== subTab) {
      this.state = {
        ...this.state,
        activeSubTab: subTab,
      };
      this.notify();
    }
  }
}

export const theoryPracticeStore = new TheoryPracticeStore();

export function useTheoryPracticeStore(): TheoryPracticeState {
  return useSyncExternalStore(
    theoryPracticeStore.subscribe,
    () => theoryPracticeStore.getState(),
    () => theoryPracticeStore.getState()
  );
}
