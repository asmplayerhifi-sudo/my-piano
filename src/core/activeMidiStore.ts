/**
 * ActiveMidiStore — Singleton reativo de notas MIDI ativas globalmente.
 *
 * Qualquer módulo que toque uma nota chama `activeMidiStore.noteOn(midi, durationMs)`.
 * O PianoKeyboard subscreve via `useSyncExternalStore` e acende as teclas correspondentes.
 *
 * Design: Snapshot em cache estável (referência imutável) — 100% aderente às regras de
 * useSyncExternalStore do React 18/19 para prevenir loops infinitos e estouro de profundidade.
 */

type Listener = () => void;

class ActiveMidiStore {
  /** Notas atualmente "on" e quando expiram (ms epoch) */
  private notes = new Map<number, number>();
  private listeners = new Set<Listener>();
  private sweepTimer: number | null = null;
  /** Cache de snapshot com identidade referencial imutável */
  private cachedSnapshot: readonly number[] = [];

  // ── API Pública ────────────────────────────────────────────────────────────

  /** Acende uma nota por `durationMs` milissegundos. */
  noteOn(midi: number, durationMs = 600): void {
    const expiry = performance.now() + durationMs;
    this.notes.set(midi, expiry);
    this.updateSnapshot();
    this.scheduleSweep(durationMs);
  }

  /** Acende múltiplas notas simultaneamente (acorde). */
  chordOn(midis: number[], durationMs = 1800): void {
    const expiry = performance.now() + durationMs;
    midis.forEach(m => this.notes.set(m, expiry));
    this.updateSnapshot();
    this.scheduleSweep(durationMs);
  }

  /** Apaga uma nota imediatamente. */
  noteOff(midi: number): void {
    if (this.notes.delete(midi)) {
      this.updateSnapshot();
    }
  }

  /** Apaga todas as notas imediatamente. */
  allNotesOff(): void {
    if (this.notes.size > 0) {
      this.notes.clear();
      this.updateSnapshot();
    }
  }

  /**
   * Retorna snapshot imutável em cache das notas ativas.
   * Regra estrita useSyncExternalStore: Pura, sem efeitos colaterais e com referência estável.
   */
  getSnapshot = (): readonly number[] => {
    return this.cachedSnapshot;
  };

  getSnapshotRef = (): readonly number[] => {
    return this.cachedSnapshot;
  };

  // ── useSyncExternalStore API ───────────────────────────────────────────────

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // ── Internos ──────────────────────────────────────────────────────────────

  private updateSnapshot(): void {
    this.cachedSnapshot = Array.from(this.notes.keys());
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  /** Remove notas expiradas e atualiza o snapshot. Chamado apenas pelo timer assíncrono. */
  private sweep(): void {
    const now = performance.now();
    let changed = false;
    for (const [midi, expiry] of this.notes) {
      if (now >= expiry) {
        this.notes.delete(midi);
        changed = true;
      }
    }
    if (changed) {
      this.updateSnapshot();
    }
  }

  /** Agenda um sweep automático quando a nota mais próxima expirar. */
  private scheduleSweep(delayMs: number): void {
    if (this.sweepTimer !== null) return;
    this.sweepTimer = window.setTimeout(() => {
      this.sweepTimer = null;
      this.sweep();
      // Se ainda há notas ativas, agenda o próximo sweep
      if (this.notes.size > 0) {
        const minExpiry = Math.min(...Array.from(this.notes.values()));
        const remaining = Math.max(50, minExpiry - performance.now());
        this.scheduleSweep(remaining);
      }
    }, Math.max(50, delayMs));
  }
}

export const activeMidiStore = new ActiveMidiStore();
