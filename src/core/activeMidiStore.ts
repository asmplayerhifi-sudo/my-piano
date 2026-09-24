/**
 * ActiveMidiStore — Singleton reativo de notas MIDI ativas globalmente.
 *
 * Qualquer módulo que toque uma nota chama `activeMidiStore.noteOn(midi, durationMs)`.
 * O PianoKeyboard subscreve via `useActiveMidi()` e acende as teclas correspondentes.
 *
 * Design: pub/sub mínimo sem dependência externa — compatível com React 18 useSyncExternalStore.
 */

type Listener = () => void;

class ActiveMidiStore {
  /** Notas atualmente "on" e quando expiram (ms epoch) */
  private notes = new Map<number, number>();
  private listeners = new Set<Listener>();
  private sweepTimer: number | null = null;

  // ── API Pública ────────────────────────────────────────────────────────────

  /** Acende uma nota por `durationMs` milissegundos. */
  noteOn(midi: number, durationMs = 600): void {
    const expiry = performance.now() + durationMs;
    this.notes.set(midi, expiry);
    this.notify();
    this.scheduleSweep(durationMs);
  }

  /** Acende múltiplas notas simultaneamente (acorde). */
  chordOn(midis: number[], durationMs = 1800): void {
    const expiry = performance.now() + durationMs;
    midis.forEach(m => this.notes.set(m, expiry));
    this.notify();
    this.scheduleSweep(durationMs);
  }

  /** Apaga uma nota imediatamente. */
  noteOff(midi: number): void {
    if (this.notes.has(midi)) {
      this.notes.delete(midi);
      this.notify();
    }
  }

  /** Apaga todas as notas imediatamente. */
  allNotesOff(): void {
    if (this.notes.size > 0) {
      this.notes.clear();
      this.notify();
    }
  }

  /** Retorna snapshot imutável das notas ativas agora. */
  getSnapshot(): readonly number[] {
    this.sweep();
    return Array.from(this.notes.keys());
  }

  // ── useSyncExternalStore API ───────────────────────────────────────────────

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshotRef = (): readonly number[] => this.getSnapshot();

  // ── Internos ──────────────────────────────────────────────────────────────

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  /** Remove notas cujo tempo de expiração já passou. */
  private sweep(): void {
    const now = performance.now();
    let changed = false;
    for (const [midi, expiry] of this.notes) {
      if (now >= expiry) {
        this.notes.delete(midi);
        changed = true;
      }
    }
    if (changed) this.notify();
  }

  /** Agenda um sweep automático quando a nota mais próxima expirar. */
  private scheduleSweep(delayMs: number): void {
    if (this.sweepTimer !== null) return;
    this.sweepTimer = window.setTimeout(() => {
      this.sweepTimer = null;
      this.sweep();
      // Se ainda há notas ativas, agenda mais um sweep
      if (this.notes.size > 0) {
        const minExpiry = Math.min(...Array.from(this.notes.values()));
        const remaining = Math.max(50, minExpiry - performance.now());
        this.scheduleSweep(remaining);
      }
    }, Math.max(50, delayMs));
  }
}

export const activeMidiStore = new ActiveMidiStore();
