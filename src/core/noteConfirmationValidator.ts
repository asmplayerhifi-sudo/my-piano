/**
 * Motor Centralizado de Validação e Janela de Confirmação de Notas (Anti-Falsos Erros)
 *
 * Resolve definitivamente:
 * 1. Sustain/decaimento de notas anteriores causando erros prematuros na nota seguinte.
 * 2. Transientes rápidos de transição de dedos/palhetada.
 * 3. Ruídos e pequenas oscilações acústicas no microfone.
 * 4. Latência de buffer de áudio.
 * 5. Ciclo de vida completo do evento musical: nota/acorde, intensidade, duração e timing.
 *
 * Regra: Acerto imediato (0ms de latência), tolerância para sustain anterior,
 * e confirmação de erro apenas após janela de tolerância/estabilização sem que a nota esperada seja executada.
 * Trata cada execução como um evento musical completo (acompanhamento contínuo até a próxima nota/evento).
 */

import type { ScoreNote } from './coursesData';
import { MusicalEventEvaluator } from './musicalEventEvaluator';
import type { MusicalEvent } from '../domain/entities/MusicalEvent';

export interface NoteConfirmationConfig {
  /** Janela mínima de estabilização para confirmar que uma nota é realmente um erro (ms) */
  confirmationWindowMs: number;
  /** Janela de tolerância para o decaimento/sustain da nota anterior (ms) */
  sustainDecayWindowMs: number;
  /** Mínimo de frames consecutivos de detecção da nota divergente para áudio contínuo */
  minStableFrames: number;
}

export const DEFAULT_CONFIRMATION_CONFIG: NoteConfirmationConfig = {
  confirmationWindowMs: 260,   // ~260ms de estabilização
  sustainDecayWindowMs: 650,   // ~650ms para decaimento acústico da nota anterior
  minStableFrames: 2,          // Pelo menos 2 frames consistentes
};

export type NoteValidationAction =
  | { action: 'hit'; note: ScoreNote; musicalEvent?: MusicalEvent }
  | { action: 'hit_next'; note: ScoreNote; musicalEvent?: MusicalEvent }
  | { action: 'ignore_sustain'; previousMidi: number; elapsedMs: number }
  | { action: 'pending_confirmation'; candidateMidi: number; elapsedMs: number }
  | { action: 'confirmed_error'; playedMidi: number; expectedMidi: number; timestamp: number; musicalEvent?: MusicalEvent };

export class NoteConfirmationValidator {
  private config: NoteConfirmationConfig;
  private lastCompletedMidi: number | null = null;
  private lastCompletedTimestamp = 0;

  private pendingErrorMidi: number | null = null;
  private pendingErrorStart = 0;
  private pendingErrorCount = 0;

  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private eventEvaluator: MusicalEventEvaluator;

  constructor(customConfig?: Partial<NoteConfirmationConfig>) {
    this.config = { ...DEFAULT_CONFIRMATION_CONFIG, ...customConfig };
    this.eventEvaluator = new MusicalEventEvaluator({
      sustainDecayWindowMs: this.config.sustainDecayWindowMs,
      silenceReleaseThresholdMs: 240,
    });
  }

  public getConfig(): Readonly<NoteConfirmationConfig> {
    return this.config;
  }

  public setConfig(customConfig: Partial<NoteConfirmationConfig>) {
    this.config = { ...this.config, ...customConfig };
    this.eventEvaluator.setConfig({
      sustainDecayWindowMs: this.config.sustainDecayWindowMs,
    });
  }

  public getEvaluator(): MusicalEventEvaluator {
    return this.eventEvaluator;
  }

  /**
   * Adapta a tolerância e o tempo de sustain dinamicamente ao andamento (BPM) e ao instrumento
   */
  public adaptToTempoAndInstrument(bpm: number, instrument: 'piano' | 'guitar' = 'piano') {
    const safeBpm = Math.max(30, Math.min(240, bpm));
    const beatMs = (60 / safeBpm) * 1000;

    // Janela de confirmação: ~35% de um tempo (entre 180ms e 320ms)
    const confirmationWindowMs = Math.max(180, Math.min(320, Math.round(beatMs * 0.35)));

    // Decaimento de sustain: piano sustenta mais que violão acústico
    const sustainMultiplier = instrument === 'guitar' ? 0.75 : 1.1;
    const sustainDecayWindowMs = Math.max(350, Math.min(850, Math.round(beatMs * sustainMultiplier)));

    this.config = {
      ...this.config,
      confirmationWindowMs,
      sustainDecayWindowMs,
    };

    this.eventEvaluator.setConfig({
      sustainDecayWindowMs,
      perfectWindowMs: Math.round(beatMs * 0.1),
      goodWindowMs: Math.round(beatMs * 0.22),
    });
  }

  public reset() {
    this.cancelPendingError();
    this.lastCompletedMidi = null;
    this.lastCompletedTimestamp = 0;
    this.pendingErrorMidi = null;
    this.pendingErrorStart = 0;
    this.pendingErrorCount = 0;
    this.eventEvaluator.reset();
  }

  public onNoteCompleted(midi: number, timestamp = performance.now()) {
    this.cancelPendingError();
    this.lastCompletedMidi = midi;
    this.lastCompletedTimestamp = timestamp;
    this.pendingErrorMidi = null;
    this.pendingErrorStart = 0;
    this.pendingErrorCount = 0;
  }

  /**
   * Verifica se a nota detectada é simplesmente o eco / sustain da nota anterior que acabou de ser tocada
   */
  public isPreviousSustain(midi: number, now = performance.now()): boolean {
    if (this.lastCompletedMidi === null) return false;
    if (this.lastCompletedMidi !== midi) return false;
    const elapsed = now - this.lastCompletedTimestamp;
    return elapsed < this.config.sustainDecayWindowMs;
  }

  /**
   * Agenda a confirmação de um erro. Se a nota esperada for tocada antes de estourar a janela,
   * o erro é cancelado sem penalidade.
   */
  public schedulePendingError(
    playedMidi: number,
    expectedMidi: number,
    onConfirm: (err: { playedMidi: number; expectedMidi: number; timestamp: number }) => void
  ) {
    this.cancelPendingError();
    this.pendingTimer = setTimeout(() => {
      this.pendingTimer = null;
      onConfirm({
        playedMidi,
        expectedMidi,
        timestamp: performance.now(),
      });
    }, this.config.confirmationWindowMs);
  }

  public cancelPendingError() {
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }

  public hasPendingError(): boolean {
    return this.pendingTimer !== null;
  }

  /**
   * Avalia a nota detectada contra o alvo esperado e a sequência musical.
   */
  public evaluate(
    playedMidi: number,
    targetNote: ScoreNote | null,
    nextNote?: ScoreNote | null,
    now = performance.now(),
    intensity = 0.7
  ): NoteValidationAction {
    if (!targetNote) {
      return { action: 'pending_confirmation', candidateMidi: playedMidi, elapsedMs: 0 };
    }

    // Configura o alvo no motor de eventos musicais
    this.eventEvaluator.setTarget({
      midi: targetNote.midi,
      chordName: targetNote.chordName,
      expectedTimeMs: now,
    });

    // Alimenta o motor de eventos com a nota e intensidade
    const { finalizedPrevious } = this.eventEvaluator.feedNote(playedMidi, intensity, now);

    // 1. ACERTO IMEDIATO (Zero Latência): A nota tocada é a nota alvo esperada!
    if (playedMidi === -1 || playedMidi === targetNote.midi) {
      this.onNoteCompleted(targetNote.midi, now);
      return { action: 'hit', note: targetNote, musicalEvent: finalizedPrevious };
    }

    // 2. TRANSIÇÃO ANTECIPADA: Usuário tocou a próxima nota da sequência
    if (nextNote && playedMidi === nextNote.midi) {
      this.onNoteCompleted(nextNote.midi, now);
      return { action: 'hit_next', note: nextNote, musicalEvent: finalizedPrevious };
    }

    // 3. TOLERÂNCIA DE SUSTAIN: A nota tocada é o resíduo/decaimento da nota anterior
    if (this.isPreviousSustain(playedMidi, now)) {
      const elapsedSinceCompletion = now - this.lastCompletedTimestamp;
      return {
        action: 'ignore_sustain',
        previousMidi: this.lastCompletedMidi!,
        elapsedMs: elapsedSinceCompletion,
      };
    }

    // 4. JANELA DE CONFIRMAÇÃO DE ERRO:
    // A nota é diferente do alvo e não é o sustain da anterior.
    if (this.pendingErrorMidi !== playedMidi) {
      // Inicia contagem para a nova nota candidata a erro
      this.pendingErrorMidi = playedMidi;
      this.pendingErrorStart = now;
      this.pendingErrorCount = 1;
      return {
        action: 'pending_confirmation',
        candidateMidi: playedMidi,
        elapsedMs: 0,
      };
    }

    // A mesma nota divergente continua sendo detectada
    this.pendingErrorCount++;
    const elapsed = now - this.pendingErrorStart;

    // Se persistir além da janela de confirmação E com frames estáveis, confirma o erro real!
    if (elapsed >= this.config.confirmationWindowMs && this.pendingErrorCount >= this.config.minStableFrames) {
      const confirmedMidi = this.pendingErrorMidi;
      this.pendingErrorMidi = null;
      this.pendingErrorStart = 0;
      this.pendingErrorCount = 0;

      const finalizedEv = this.eventEvaluator.finalizeCurrentEvent(now, 'manual');

      return {
        action: 'confirmed_error',
        playedMidi: confirmedMidi,
        expectedMidi: targetNote.midi,
        timestamp: now,
        musicalEvent: finalizedEv ?? undefined,
      };
    }

    return {
      action: 'pending_confirmation',
      candidateMidi: playedMidi,
      elapsedMs: elapsed,
    };
  }
}
