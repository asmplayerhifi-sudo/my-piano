/**
 * Motor Centralizado de Rastreamento e Avaliação de Eventos Musicais
 *
 * Implementa o fluxo de ciclo de vida completo:
 * 1. Detecção do Ataque (Onset) -> Inicia acompanhamento sem emitir erro prematuro;
 * 2. Sustentação (Tracking) -> Acompanha nota(s), intensidade/dinâmica e duração em tempo real;
 * 3. Transição / Término -> Ao detectar a próxima nota ou término inequívoco (silêncio),
 *    finaliza a avaliação do evento anterior com nota, intensidade, duração e timing.
 * 4. Acordes -> Agrupa notas emitidas simultâneas ou semi-arpejadas na janela harmônica.
 */

import { MusicalEvent, type MusicalEventType, type MusicalGrade } from '../domain/entities/MusicalEvent';
import { identifyChordFromMidi, parseChord, getNoteInfo, CHROMATIC_NOTES_SHARP, CHROMATIC_NOTES_FLAT, type IdentifiedChord } from './musicTheory';

export interface MusicalTarget {
  midi?: number;
  noteName?: string;
  chordName?: string;
  expectedTimeMs?: number;
  expectedDurationMs?: number;
}

export interface MusicalEventEvaluatorConfig {
  /** Janela para agrupar notas de um acorde tocado simultaneamente ou arpejado (ms) */
  chordWindowMs: number;
  /** Silêncio consecutivo necessário para confirmar o encerramento da nota por soltura (ms) */
  silenceReleaseThresholdMs: number;
  /** Janela de tolerância de sustain para evitar que resíduos da nota anterior contem como nova nota */
  sustainDecayWindowMs: number;
  /** Tolerância rítmica para nota perfeita (ms) */
  perfectWindowMs: number;
  /** Tolerância rítmica para nota boa (ms) */
  goodWindowMs: number;
}

export const DEFAULT_EVALUATOR_CONFIG: MusicalEventEvaluatorConfig = {
  chordWindowMs: 320,
  silenceReleaseThresholdMs: 240,
  sustainDecayWindowMs: 650,
  perfectWindowMs: 40,
  goodWindowMs: 90,
};

interface ActiveEventState {
  id: string;
  startTimeMs: number;
  lastUpdateMs: number;
  playedMidis: Set<number>;
  primaryMidi: number;
  intensities: number[];
  target: MusicalTarget | null;
  identifiedChord: IdentifiedChord | null;
  isHitEmitted: boolean;
}

export class MusicalEventEvaluator {
  private config: MusicalEventEvaluatorConfig;
  private currentEvent: ActiveEventState | null = null;
  private lastFinalizedEvent: MusicalEvent | null = null;
  private currentTarget: MusicalTarget | null = null;

  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  public onEventStarted?: (event: ActiveEventState) => void;
  public onEventUpdated?: (event: ActiveEventState) => void;
  public onEventFinalized?: (finalized: MusicalEvent) => void;

  constructor(customConfig?: Partial<MusicalEventEvaluatorConfig>) {
    this.config = { ...DEFAULT_EVALUATOR_CONFIG, ...customConfig };
  }

  public setConfig(customConfig: Partial<MusicalEventEvaluatorConfig>) {
    this.config = { ...this.config, ...customConfig };
  }

  public getConfig(): Readonly<MusicalEventEvaluatorConfig> {
    return this.config;
  }

  public setTarget(target: MusicalTarget | null) {
    this.currentTarget = target ? { ...target } : null;
    if (this.currentEvent && !this.currentEvent.target && target) {
      this.currentEvent.target = { ...target };
    }
  }

  public getActiveEvent(): Readonly<ActiveEventState> | null {
    return this.currentEvent;
  }

  public getLastFinalizedEvent(): MusicalEvent | null {
    return this.lastFinalizedEvent;
  }

  public reset() {
    this.cancelSilenceTimer();
    this.currentEvent = null;
    this.lastFinalizedEvent = null;
  }

  /**
   * Processa o ataque de uma nota recebida (via microfone ou teclado MIDI).
   * Segue a regra estrita: NUNCA emite erro prematuro no ataque da nota!
   */
  public feedNote(
    midi: number,
    intensity = 0.7,
    timestamp = performance.now(),
    isNewAttack = true
  ): { isNewEvent: boolean; event: ActiveEventState; finalizedPrevious?: MusicalEvent } {
    this.cancelSilenceTimer();

    // 1. Se já existe um evento ativo
    if (this.currentEvent) {
      const elapsedSinceStart = timestamp - this.currentEvent.startTimeMs;

      // 1.1 Se o evento ativo é recente e está na janela de agrupamento de acorde
      const isTargetAChord = !!(this.currentTarget?.chordName || this.currentEvent.target?.chordName);
      if (
        (elapsedSinceStart <= this.config.chordWindowMs || isTargetAChord) &&
        !this.currentEvent.playedMidis.has(midi)
      ) {
        // Agrupa como nota participante do mesmo acorde
        this.currentEvent.playedMidis.add(midi);
        this.currentEvent.intensities.push(intensity);
        this.currentEvent.lastUpdateMs = timestamp;

        // Atualiza identificação harmônica
        const midis = Array.from(this.currentEvent.playedMidis);
        this.currentEvent.identifiedChord = identifyChordFromMidi(midis);

        this.onEventUpdated?.(this.currentEvent);
        return { isNewEvent: false, event: this.currentEvent };
      }

      // 1.2 Se for a mesma nota sendo sustentada / vibrato contínuo
      if (this.currentEvent.playedMidis.has(midi) && !isNewAttack) {
        this.currentEvent.lastUpdateMs = timestamp;
        this.currentEvent.intensities.push(intensity);
        this.onEventUpdated?.(this.currentEvent);
        return { isNewEvent: false, event: this.currentEvent };
      }

      // 1.3 Se for uma NOVA nota/ataque subsequente (usuário passou para a próxima nota!)
      // Fecha e avalia com precisão o evento anterior ANTES de iniciar o novo
      const finalized = this.finalizeCurrentEvent(timestamp, 'next_event');

      // Inicia novo evento para a nova nota
      const newEvent = this.startNewEvent(midi, intensity, timestamp);
      return { isNewEvent: true, event: newEvent, finalizedPrevious: finalized ?? undefined };
    }

    // 2. Não havia evento ativo: inicia o acompanhamento
    const newEv = this.startNewEvent(midi, intensity, timestamp);
    return { isNewEvent: true, event: newEv };
  }

  /**
   * Notifica momento de silêncio ou soltura de tecla no microfone / MIDI.
   */
  public feedSilence(_timestamp = performance.now()) {
    if (!this.currentEvent || this.silenceTimer) return;

    this.silenceTimer = setTimeout(() => {
      this.silenceTimer = null;
      if (this.currentEvent) {
        this.finalizeCurrentEvent(performance.now(), 'silence_release');
      }
    }, this.config.silenceReleaseThresholdMs);
  }

  private startNewEvent(midi: number, intensity: number, timestamp: number): ActiveEventState {
    const id = `ev_${timestamp.toFixed(0)}_${midi}_${Math.random().toString(36).substring(2, 6)}`;
    const eventState: ActiveEventState = {
      id,
      startTimeMs: timestamp,
      lastUpdateMs: timestamp,
      playedMidis: new Set<number>([midi]),
      primaryMidi: midi,
      intensities: [intensity],
      target: this.currentTarget ? { ...this.currentTarget } : null,
      identifiedChord: null,
      isHitEmitted: false,
    };

    this.currentEvent = eventState;
    this.onEventStarted?.(eventState);
    return eventState;
  }

  /**
   * Finaliza e avalia o evento musical corrente com todos os 4 pilares:
   * 1. Nota / Acorde (precisão harmônica)
   * 2. Intensidade / Dinâmica
   * 3. Duração (tempo sustentado)
   * 4. Timing (desvio rítmico)
   */
  public finalizeCurrentEvent(
    timestamp = performance.now(),
    _reason: 'next_event' | 'silence_release' | 'manual' = 'manual'
  ): MusicalEvent | null {
    if (!this.currentEvent) return null;

    const event = this.currentEvent;
    this.currentEvent = null;
    this.cancelSilenceTimer();

    const playedMidis = Array.from(event.playedMidis);
    const durationMs = Math.max(10, timestamp - event.startTimeMs);
    const peakIntensity = event.intensities.length > 0 ? Math.max(...event.intensities) : 0.7;
    const avgIntensity =
      event.intensities.length > 0
        ? event.intensities.reduce((a, b) => a + b, 0) / event.intensities.length
        : 0.7;

    const target = event.target || this.currentTarget;
    const isChordEvent = playedMidis.length >= 2 || !!target?.chordName;
    const type: MusicalEventType = isChordEvent ? 'chord' : 'single_note';

    // 1. AVALIAÇÃO DE NOTA / ACORDE
    let isPitchOrChordMatch = false;
    let identifiedChord = event.identifiedChord;
    if (playedMidis.length >= 2 && !identifiedChord) {
      identifiedChord = identifyChordFromMidi(playedMidis);
    }

    if (target) {
      if (target.chordName) {
        // Comparação de Acorde
        const expectedChord = parseChord(target.chordName);
        if (identifiedChord && expectedChord) {
          // Se identificou um acorde completo, compara a raiz e a qualidade básica (desconsiderando baixo de inversão)
          const baseSymbol = identifiedChord.symbol.replace(/\/.+$/, '').trim().toUpperCase();
          const targetBase = target.chordName.replace(/\/.+$/, '').trim().toUpperCase();
          const rootMatches = identifiedChord.root.trim().toUpperCase() === expectedChord.root.trim().toUpperCase();
          isPitchOrChordMatch = rootMatches && baseSymbol === targetBase;
        } else if (expectedChord) {
          // Fallback para conjunto de notas dispersas
          const playedPitchClasses = new Set(playedMidis.map(m => ((m % 12) + 12) % 12));
          const expectedPitchClasses = expectedChord.notes.map(n => {
            const idx = CHROMATIC_NOTES_SHARP.indexOf(n);
            return idx !== -1 ? idx : CHROMATIC_NOTES_FLAT.indexOf(n);
          });
          const rootIdx = CHROMATIC_NOTES_SHARP.indexOf(expectedChord.root) !== -1
            ? CHROMATIC_NOTES_SHARP.indexOf(expectedChord.root)
            : CHROMATIC_NOTES_FLAT.indexOf(expectedChord.root);

          const hasRoot = playedPitchClasses.has(rootIdx);
          const matchCount = expectedPitchClasses.filter(pc => playedPitchClasses.has(pc)).length;
          isPitchOrChordMatch = hasRoot && matchCount >= expectedPitchClasses.length;
        }
      } else if (target.midi !== undefined) {
        // Comparação de Nota Única
        if (target.midi === -1) {
          isPitchOrChordMatch = true; // Nota genérica de ritmo
        } else {
          const targetPitchClass = ((target.midi % 12) + 12) % 12;
          isPitchOrChordMatch = playedMidis.some(m => ((m % 12) + 12) % 12 === targetPitchClass);
        }
      }
    } else {
      isPitchOrChordMatch = true;
    }

    // 2. AVALIAÇÃO DE TIMING RÍTMICO
    let timeDeltaMs: number | undefined;
    if (target?.expectedTimeMs !== undefined) {
      timeDeltaMs = event.startTimeMs - target.expectedTimeMs;
    }

    // 3. CLASSIFICAÇÃO DE GRADE E PONTOS
    let grade: MusicalGrade = 'PERFECT';
    let scorePoints = 100;
    let feedbackMessage = '';

    if (!isPitchOrChordMatch) {
      grade = isChordEvent ? 'WRONG_CHORD' : 'WRONG_NOTE';
      scorePoints = 0;
      const playedDesc = isChordEvent && identifiedChord
        ? identifiedChord.symbol
        : getNoteInfo(event.primaryMidi).fullName;
      const expectedDesc = target?.chordName || (target?.midi !== undefined ? getNoteInfo(target.midi).fullName : '?');
      feedbackMessage = isChordEvent
        ? `Acorde divergente: ouviu ${playedDesc} (Esperava: ${expectedDesc})`
        : `Nota divergente: tocou ${playedDesc} (Esperava: ${expectedDesc})`;
    } else {
      // Se acertou a nota/acorde, avalia precisão temporal
      if (timeDeltaMs !== undefined) {
        const absDelta = Math.abs(timeDeltaMs);
        if (absDelta <= this.config.perfectWindowMs) {
          grade = 'PERFECT';
          scorePoints = 100;
          feedbackMessage = 'Execução Perfeita!';
        } else if (absDelta <= this.config.goodWindowMs) {
          grade = 'GOOD';
          scorePoints = 75;
          feedbackMessage = timeDeltaMs < 0 ? 'Bom! Ligeiramente adiantado' : 'Bom! Ligeiramente atrasado';
        } else {
          grade = 'OFF_TIME';
          scorePoints = 40;
          feedbackMessage = 'Fora do tempo da batida';
        }
      } else {
        grade = 'PERFECT';
        scorePoints = 100;
        feedbackMessage = isChordEvent ? 'Acorde correto!' : 'Nota correta!';
      }
    }

    const finalized = new MusicalEvent({
      id: event.id,
      type,
      phase: 'finalized',
      startTimeMs: event.startTimeMs,
      endTimeMs: timestamp,
      durationMs,
      expectedTimeMs: target?.expectedTimeMs,
      expectedDurationMs: target?.expectedDurationMs,
      timeDeltaMs,
      playedMidis,
      primaryMidi: event.primaryMidi,
      expectedMidi: target?.midi,
      expectedChordName: target?.chordName,
      identifiedChord,
      peakIntensity,
      averageIntensity: avgIntensity,
      isPitchOrChordMatch,
      grade,
      scorePoints,
      feedbackMessage,
    });

    this.lastFinalizedEvent = finalized;
    this.onEventFinalized?.(finalized);
    return finalized;
  }

  private cancelSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }
}
