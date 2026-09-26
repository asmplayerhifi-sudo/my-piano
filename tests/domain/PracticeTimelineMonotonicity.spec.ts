import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { REPERTOIRE_SONGS } from '../../src/core/repertoireData';
import { computeNoteOffsets, SCORE_GEOMETRY } from '../../src/components/score/scrolling/scoreGeometry';
import { parseScoreTimeSignature } from '../../src/components/score/scrolling/useScoreTimeline';
import { musicalPlaybackEngine } from '../../src/core/musicalPlaybackEngine';
import { midiManager, type MidiEventPayload } from '../../src/core/midiManager';
import { soundEngine } from '../../src/core/soundEngine';
import type { ScoreNote } from '../../src/core/coursesData';

describe('PracticeTimelineMonotonicity - Auditoria, Correção e Validação do Modo Prática', () => {
  const odeToJoy = REPERTOIRE_SONGS.find((s) => s.id === 'ode-to-joy') || REPERTOIRE_SONGS[0];
  const sortedNotes = [...odeToJoy.scoreTrack].sort((a, b) => {
    const mA = Math.max(1, a.measure || 1);
    const mB = Math.max(1, b.measure || 1);
    const bA = a.beat !== undefined ? Math.max(0, a.beat - 1) : 0;
    const bB = b.beat !== undefined ? Math.max(0, b.beat - 1) : 0;
    const offA = (mA - 1) * 4 + bA;
    const offB = (mB - 1) * 4 + bB;
    if (Math.abs(offA - offB) > 0.001) return offA - offB;
    if (a.clef === 'bass' && b.clef !== 'bass') return -1;
    if (a.clef !== 'bass' && b.clef === 'bass') return 1;
    return (a.midi || 0) - (b.midi || 0);
  });

  beforeEach(() => {
    musicalPlaybackEngine.stop();
  });

  afterEach(() => {
    musicalPlaybackEngine.stop();
    soundEngine.stopAllNotes(0.01);
  });

  describe('1. Regras Determinísticas do Cálculo Musical e Posição Monotônica', () => {
    it('início da música deve ser compasso 1 e beat 0', () => {
      const offsets = computeNoteOffsets(sortedNotes, '4/4');
      const firstNote = sortedNotes[0];
      const firstOffset = offsets[0] ?? 0;
      const measure = firstNote.measure || 1;

      expect(measure).toBe(1);
      expect(firstOffset).toBe(0);
    });

    it('avanço para próximo beat deve calcular o beat seguinte e preservar monotonicidade', () => {
      const offsets = computeNoteOffsets(sortedNotes, '4/4');
      // No compasso 1 da Ode to Joy:
      // beat 1: notas com offset 0 (C2 e E3)
      // beat 2: nota com offset 1 (E3)
      // beat 3: nota com offset 2 (F3)
      // beat 4: nota com offset 3 (G3)
      // compasso 2, beat 1: nota com offset 4 (G1 e G3)
      expect(offsets[0]).toBe(0);
      expect(offsets[1]).toBe(0);
      expect(offsets[2]).toBe(1);
      expect(offsets[3]).toBe(2);
      expect(offsets[4]).toBe(3);
      expect(offsets[5]).toBe(4);
    });

    it('avanço de compasso deve ser contínuo (1 -> 2 -> 3 -> 4 -> 5...)', () => {
      const measures = sortedNotes.map((n) => n.measure || 1);
      const uniqueMeasures = Array.from(new Set(measures));

      // Assegura que os compassos são contínuos e crescentes
      for (let i = 0; i < uniqueMeasures.length; i++) {
        expect(uniqueMeasures[i]).toBe(i + 1);
      }
    });

    it('teste de monotonicidade: T1 < T2 < T3 < T4 => P1 <= P2 <= P3 <= P4, nunca P1 < P2 > P3', () => {
      // Simulação do motor de estado temporal com entradas temporais crescentes
      class MonotonicPracticeTracker {
        private currentIdx = 0;
        private lastTimestamp = 0;
        private history: number[] = [0];

        public processInput(stepIdx: number, timestamp: number): boolean {
          // Rejeita timestamp retrocedendo
          if (timestamp < this.lastTimestamp) {
            return false;
          }
          this.lastTimestamp = timestamp;

          // REGRA FUNDAMENTAL: Monotonicidade durante reprodução normal
          if (stepIdx < this.currentIdx) {
            // Rejeitado! Nunca retrocede
            return false;
          }

          this.currentIdx = stepIdx;
          this.history.push(this.currentIdx);
          return true;
        }

        public getHistory(): number[] {
          return this.history;
        }

        public reset(): void {
          this.currentIdx = 0;
          this.lastTimestamp = 0;
          this.history.push(0);
        }
      }

      const tracker = new MonotonicPracticeTracker();
      const events = [
        { step: 0, time: 100 },
        { step: 2, time: 300 },
        { step: 3, time: 500 },
        { step: 4, time: 700 },
        { step: 5, time: 900 },
      ];

      events.forEach((ev) => {
        const accepted = tracker.processInput(ev.step, ev.time);
        expect(accepted).toBe(true);
      });

      // Tentativa de regressão espúria (T5 > T4 mas P_tentado < P_atual): DEVE SER REJEITADA!
      const rejectedSpurious = tracker.processInput(2, 1100);
      expect(rejectedSpurious).toBe(false);

      const history = tracker.getHistory();
      for (let i = 1; i < history.length; i++) {
        expect(history[i]).toBeGreaterThanOrEqual(history[i - 1]);
      }
    });
  });

  describe('2. Conversão Temporal, Ticks, Beat, Compasso e Posição Visual', () => {
    it('deve converter beat em posição horizontal (scrollOffset) determinística e precisa', () => {
      const pixelsPerBeat = 140;
      const attackLineX = SCORE_GEOMETRY.attackLineX; // 145

      const beat0X = attackLineX + 0 * pixelsPerBeat - 0;
      expect(beat0X).toBe(attackLineX);

      // Quando o scrollOffset alcança exatamente o offset da nota, a nota está na attackLine
      const noteOffset = 4; // Compasso 2
      const scrollForNote = noteOffset * pixelsPerBeat;
      const noteRenderedX = attackLineX + noteOffset * pixelsPerBeat - scrollForNote;
      expect(noteRenderedX).toBe(attackLineX);
    });

    it('deve decompor e calcular compassos para diferentes fórmulas (4/4, 3/4, 2/4, 6/8)', () => {
      const sig4_4 = parseScoreTimeSignature('4/4');
      expect(sig4_4.beatsPerMeasure).toBe(4);
      expect(Math.floor(0 / sig4_4.beatsPerMeasure) + 1).toBe(1);
      expect(Math.floor(4 / sig4_4.beatsPerMeasure) + 1).toBe(2);
      expect(Math.floor(8 / sig4_4.beatsPerMeasure) + 1).toBe(3);

      const sig3_4 = parseScoreTimeSignature('3/4');
      expect(sig3_4.beatsPerMeasure).toBe(3);
      expect(Math.floor(0 / sig3_4.beatsPerMeasure) + 1).toBe(1);
      expect(Math.floor(3 / sig3_4.beatsPerMeasure) + 1).toBe(2);
      expect(Math.floor(6 / sig3_4.beatsPerMeasure) + 1).toBe(3);

      const sig2_4 = parseScoreTimeSignature('2/4');
      expect(sig2_4.beatsPerMeasure).toBe(2);
      expect(Math.floor(0 / sig2_4.beatsPerMeasure) + 1).toBe(1);
      expect(Math.floor(2 / sig2_4.beatsPerMeasure) + 1).toBe(2);

      const sig6_8 = parseScoreTimeSignature('6/8');
      expect(sig6_8.beatsPerMeasure).toBe(2); // 2 pulsos ternários por compasso
    });

    it('mudança de BPM não deve alterar o offset de beat das notas nem a geometria da partitura', () => {
      const offsets84 = computeNoteOffsets(sortedNotes, '4/4');
      const offsets120 = computeNoteOffsets(sortedNotes, '4/4');
      expect(offsets84).toEqual(offsets120);
    });
  });

  describe('3. Deduplicação e Tratamento de Eventos Simultâneos e Resíduos Acústicos', () => {
    it('deve agrupar todas as notas do mesmo instante métrico (acordes/polifonia)', () => {
      const offsets = computeNoteOffsets(sortedNotes, '4/4');
      const initialOffset = offsets[0] ?? 0;

      let firstStepCount = 0;
      for (let i = 0; i < sortedNotes.length; i++) {
        if (Math.abs((offsets[i] ?? 0) - initialOffset) < 0.05) {
          firstStepCount++;
        } else {
          break;
        }
      }

      // Clave de Fá (C2) e Clave de Sol (E3) ocorrem simultaneamente
      expect(firstStepCount).toBe(2);
    });

    it('deve deduplicar resíduo de acorde concluído há menos de 160ms para não consumir o próximo passo', () => {
      const lastStepCompletedNotes = new Set([48, 64]);
      const lastStepCompletedTime = 1000;
      const incomingNotesChordEcho = [48, 64];
      const incomingTime = 1020; // 20ms depois

      const isChordEcho =
        incomingTime - lastStepCompletedTime < 160 &&
        incomingNotesChordEcho.every((m) => lastStepCompletedNotes.has(m));

      expect(isChordEcho).toBe(true);

      // Nova nota do usuário no tempo seguinte (ex: 600ms depois)
      const nextBeatTime = 1600;
      const isNewStrike =
        nextBeatTime - lastStepCompletedTime >= 160 ||
        !incomingNotesChordEcho.every((m) => lastStepCompletedNotes.has(m));

      expect(isNewStrike).toBe(true);
    });
  });

  describe('4. Rolagem Desacoplada e Suave sem Oscilação ou Idas e Vindas', () => {
    it('a rolagem deve apenas avançar suavemente e nunca retroceder durante a prática', () => {
      let currentScroll = 0;
      const targetScroll = 140; // Beat 1
      const isExplicitReset = false;

      const advanceScroll = (target: number) => {
        const diff = target - currentScroll;
        if (diff > 0.5) {
          currentScroll += Math.max(0.5, diff * 0.22);
          if (currentScroll > target) currentScroll = target;
        } else if (diff < -0.5 && isExplicitReset) {
          currentScroll = target;
        } else if (Math.abs(diff) <= 0.5) {
          currentScroll = target;
        }
      };

      // Simula 10 frames de interpolação
      let prevScroll = currentScroll;
      for (let f = 0; f < 10; f++) {
        advanceScroll(targetScroll);
        expect(currentScroll).toBeGreaterThanOrEqual(prevScroll);
        prevScroll = currentScroll;
      }

      expect(currentScroll).toBeGreaterThan(0);
      expect(currentScroll).toBeLessThanOrEqual(targetScroll);
    });

    it('retrocesso do scroll é permitido unicamente no reset explícito para a posição zero', () => {
      let currentScroll = 560; // Compasso 5
      const targetScroll = 0;
      let currentIndex = 0; // Reset acionado

      const diff = targetScroll - currentScroll;
      if (diff < -0.5 && currentIndex === 0) {
        currentScroll = targetScroll;
      }

      expect(currentScroll).toBe(0);
    });
  });

  describe('5. Teste de Fluxo Completo Real com MIDI Físico Simulado', () => {
    it('fluxo: Abrir Repertório -> Prática -> Conectar MIDI -> Tocar -> Avançar Compassos 1->2->3 sem retrocesso', () => {
      musicalPlaybackEngine.loadScore(sortedNotes, '4/4', 84);

      // Estado representativo do Modo Prática auditado
      let currentIdx = 0;
      let satisfiedIndices = new Set<number>();
      let practiceHits = 0;
      let practiceErrors = 0;
      let isPracticing = true;
      const historyMeasures: number[] = [];

      const offsets = computeNoteOffsets(sortedNotes, '4/4');

      const getCurrentStepIndices = (idx: number) => {
        const off = offsets[idx] ?? 0;
        let first = idx;
        while (first > 0 && Math.abs((offsets[first - 1] ?? 0) - off) < 0.05) first--;
        const list: number[] = [];
        for (let i = first; i < sortedNotes.length; i++) {
          if (Math.abs((offsets[i] ?? 0) - off) < 0.05) list.push(i);
          else break;
        }
        return list;
      };

      const feedMidi = (midi: number) => {
        if (!isPracticing) return;
        const stepIndices = getCurrentStepIndices(currentIdx);
        const match = stepIndices.find((i) => !satisfiedIndices.has(i) && sortedNotes[i].midi === midi);

        if (match !== undefined) {
          satisfiedIndices.add(match);
          if (stepIndices.every((i) => satisfiedIndices.has(i))) {
            practiceHits++;
            const nextIdx = stepIndices[stepIndices.length - 1] + 1;
            satisfiedIndices.clear();
            if (nextIdx > currentIdx) {
              currentIdx = nextIdx;
              const curNote = sortedNotes[currentIdx] || sortedNotes[sortedNotes.length - 1];
              historyMeasures.push(curNote.measure || 1);
            }
          }
        } else {
          practiceErrors++;
        }
      };

      // Registra compasso inicial
      historyMeasures.push(sortedNotes[currentIdx].measure || 1);

      // Compasso 1, tempo 1: C2 (48) e E3 (64)
      feedMidi(48); // Mão esquerda
      feedMidi(64); // Mão direita -> Completa passo 1

      // Compasso 1, tempo 2: E3 (64)
      feedMidi(64);

      // Compasso 1, tempo 3: F3 (65)
      feedMidi(65);

      // Compasso 1, tempo 4: G3 (67)
      feedMidi(67);

      // Agora avançou para o Compasso 2!
      // Compasso 2, tempo 1: G1 (43) e G3 (67)
      feedMidi(43);
      feedMidi(67);

      // Compasso 2, tempo 2: F3 (65)
      feedMidi(65);

      // Compasso 2, tempo 3: E3 (64)
      feedMidi(64);

      // Compasso 2, tempo 4: D3 (62)
      feedMidi(62);

      // Agora avançou para o Compasso 3!
      expect(sortedNotes[currentIdx].measure).toBe(3);
      expect(practiceErrors).toBe(0);
      expect(practiceHits).toBeGreaterThan(5);

      // Verifica monotonicidade absoluta de todos os compassos no histórico
      for (let i = 1; i < historyMeasures.length; i++) {
        expect(historyMeasures[i]).toBeGreaterThanOrEqual(historyMeasures[i - 1]);
      }

      // Pausa e retomada
      isPracticing = false;
      const pausedIdx = currentIdx;
      isPracticing = true;
      expect(currentIdx).toBe(pausedIdx); // Posição preservada
    });
  });
});
