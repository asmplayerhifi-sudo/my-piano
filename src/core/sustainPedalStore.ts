/**
 * sustainPedalStore.ts
 *
 * Gerenciador reativo centralizado do estado do Pedal de Sustain (Damper Pedal).
 * Unifica e sincroniza:
 * - Botões na UI (Teclado Livre / PianoKeyboard)
 * - Atalho de teclado (Barra de Espaço para pisar / soltar ou alternar)
 * - Entrada de pedal físico MIDI USB / Bluetooth (CC 64)
 * - Engine de Áudio (soundEngine.setSustainPedal)
 */

import { soundEngine } from './soundEngine';

type Listener = () => void;

class SustainPedalStore {
  private isSustainActive = false;
  private isLocked = false;
  private listeners = new Set<Listener>();

  constructor() {
    this.initKeyboardListeners();
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): boolean => {
    return this.isSustainActive;
  };

  public isLockedActive = (): boolean => {
    return this.isLocked;
  };

  /**
   * Define o estado de sustain.
   * @param active Estado booleano do pedal (pressionado/ativo ou solto/desativado)
   * @param lockState Opcional: define se o estado foi travado via clique de botão na interface
   */
  public setSustain(active: boolean, lockState?: boolean): void {
    if (lockState !== undefined) {
      this.isLocked = lockState;
    }
    if (this.isSustainActive !== active) {
      this.isSustainActive = active;
      soundEngine.setSustainPedal(active);
      this.notify();
    }
  }

  /**
   * Alterna o estado de trava do sustain pelo botão da interface
   */
  public toggleSustain(): boolean {
    const next = !this.isSustainActive;
    this.setSustain(next, next);
    return next;
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private initKeyboardListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ignora atalho caso o foco esteja em campo de entrada de texto
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        // Se já estava travado, um toque na barra de espaço destrava e solta o pedal
        if (this.isLocked) {
          this.setSustain(false, false);
        } else {
          // Pressiona o pedal (momentâneo enquanto mantiver segurado)
          this.setSustain(true, false);
        }
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        // Solta o pedal se não estiver no modo trava fixa por botão
        if (!this.isLocked) {
          this.setSustain(false, false);
        }
      }
    });
  }
}

export const sustainPedalStore = new SustainPedalStore();
