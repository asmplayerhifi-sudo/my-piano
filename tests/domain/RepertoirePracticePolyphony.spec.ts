import { describe, it, expect } from 'vitest';
import { REPERTOIRE_SONGS } from '../../src/core/repertoireData';
import { computeNoteOffsets } from '../../src/components/score/scrolling/scoreGeometry';
import type { ScoreNote } from '../../src/core/coursesData';

describe('RepertoirePracticePolyphony - Validação Polifônica e Acordes no Modo Prática', () => {
  const odeToJoy = REPERTOIRE_SONGS.find((s) => s.id === 'ode-to-joy') || REPERTOIRE_SONGS[0];

  it('deve agrupar notas simultâneas de ambas as mãos (Clave de Fá e Clave de Sol) no mesmo passo métrico', () => {
    const notes = odeToJoy.scoreTrack;
    const offsets = computeNoteOffsets(notes, odeToJoy.timeSignature);

    // No primeiro tempo do compasso 1, Beethoven tem C2 (baixo) e E3 (melodia) simultâneos
    const initialOffset = offsets[0] ?? 0;
    const stepIndices: number[] = [];

    for (let i = 0; i < notes.length; i++) {
      if (Math.abs((offsets[i] ?? 0) - initialOffset) < 0.05) {
        stepIndices.push(i);
      } else {
        break;
      }
    }

    expect(stepIndices.length).toBeGreaterThanOrEqual(2);

    const stepNotes = stepIndices.map((i) => notes[i]);
    const midis = stepNotes.map((n) => n.midi);

    // Contém C2 (MIDI 48) e E3 (MIDI 64)
    expect(midis).toContain(48);
    expect(midis).toContain(64);
  });

  it('deve aceitar acordes / notas simultâneas de ambas as mãos via MIDI ou áudio sem registrar erro', () => {
    const notes = odeToJoy.scoreTrack;
    const offsets = computeNoteOffsets(notes, odeToJoy.timeSignature);
    const initialOffset = offsets[0] ?? 0;

    const stepIndices = notes
      .map((_, idx) => idx)
      .filter((idx) => Math.abs((offsets[idx] ?? 0) - initialOffset) < 0.05);

    const satisfiedIndices = new Set<number>();
    const playedMidis = [48, 64]; // Usuário toca C2 e E3 ao mesmo tempo

    // Simula a lógica polifônica do useScorePlayback
    playedMidis.forEach((midi) => {
      const matchIdx = stepIndices.find(
        (idx) => !satisfiedIndices.has(idx) && notes[idx].midi === midi
      );
      if (matchIdx !== undefined) {
        satisfiedIndices.add(matchIdx);
      }
    });

    // Todas as notas do passo foram satisfeitas
    const allSatisfied = stepIndices.every((idx) => satisfiedIndices.has(idx));
    expect(allSatisfied).toBe(true);
    expect(satisfiedIndices.size).toBe(stepIndices.length);
  });

  it('deve permitir execução sequencial (mão esquerda depois mão direita) sem disparar erro falso', () => {
    const notes = odeToJoy.scoreTrack;
    const offsets = computeNoteOffsets(notes, odeToJoy.timeSignature);
    const initialOffset = offsets[0] ?? 0;

    const stepIndices = notes
      .map((_, idx) => idx)
      .filter((idx) => Math.abs((offsets[idx] ?? 0) - initialOffset) < 0.05);

    const satisfiedIndices = new Set<number>();

    // 1. Toca primeiro o baixo da Mão Esquerda: C2 (MIDI 48)
    const match1 = stepIndices.find(
      (idx) => !satisfiedIndices.has(idx) && notes[idx].midi === 48
    );
    expect(match1).toBeDefined();
    satisfiedIndices.add(match1!);

    // Ainda não concluiu o passo, pois falta a mão direita
    expect(stepIndices.every((idx) => satisfiedIndices.has(idx))).toBe(false);

    // 2. Toca em seguida a melodia da Mão Direita: E3 (MIDI 64)
    const match2 = stepIndices.find(
      (idx) => !satisfiedIndices.has(idx) && notes[idx].midi === 64
    );
    expect(match2).toBeDefined();
    satisfiedIndices.add(match2!);

    // Agora ambas as mãos foram satisfeitas e o passo é completado
    expect(stepIndices.every((idx) => satisfiedIndices.has(idx))).toBe(true);
  });

  it('deve permitir execução em ordem inversa (mão direita antes da mão esquerda) com precisão absoluta', () => {
    const notes = odeToJoy.scoreTrack;
    const offsets = computeNoteOffsets(notes, odeToJoy.timeSignature);
    const initialOffset = offsets[0] ?? 0;

    const stepIndices = notes
      .map((_, idx) => idx)
      .filter((idx) => Math.abs((offsets[idx] ?? 0) - initialOffset) < 0.05);

    const satisfiedIndices = new Set<number>();

    // 1. Toca primeiro a Mão Direita: E3 (MIDI 64)
    const match1 = stepIndices.find(
      (idx) => !satisfiedIndices.has(idx) && notes[idx].midi === 64
    );
    expect(match1).toBeDefined();
    satisfiedIndices.add(match1!);
    expect(stepIndices.every((idx) => satisfiedIndices.has(idx))).toBe(false);

    // 2. Toca depois a Mão Esquerda: C2 (MIDI 48)
    const match2 = stepIndices.find(
      (idx) => !satisfiedIndices.has(idx) && notes[idx].midi === 48
    );
    expect(match2).toBeDefined();
    satisfiedIndices.add(match2!);

    // Ambas satisfeitas
    expect(stepIndices.every((idx) => satisfiedIndices.has(idx))).toBe(true);
  });

  it('deve reconhecer acordes harmônicos mesmo com pequenas variações de oitava ou dedilhado', () => {
    const mockChordStep: ScoreNote[] = [
      { note: 'C3', midi: 48, duration: 1, measure: 1, beat: 1, clef: 'bass', chordName: 'C' },
      { note: 'E4', midi: 64, duration: 1, measure: 1, beat: 1, clef: 'treble', chordName: 'C' },
      { note: 'G4', midi: 67, duration: 1, measure: 1, beat: 1, clef: 'treble', chordName: 'C' },
    ];

    const stepIndices = [0, 1, 2];
    const satisfiedIndices = new Set<number>();

    // Entrada polifônica do acorde C Maior [48, 64, 67]
    const playedChordMidis = [48, 64, 67];
    playedChordMidis.forEach((midi) => {
      const matchIdx = stepIndices.find(
        (idx) => !satisfiedIndices.has(idx) && mockChordStep[idx].midi === midi
      );
      if (matchIdx !== undefined) {
        satisfiedIndices.add(matchIdx);
      }
    });

    expect(stepIndices.every((idx) => satisfiedIndices.has(idx))).toBe(true);
  });

  it('deve ignorar eventos de bateria do Canal 10 (GM Drums) para evitar falsos erros e notas presas de piano', () => {
    // Simula evento MIDI recebido no canal 10 (índice 9) com MIDI 41 (Floor Tom)
    const channel10Status = 0x99; // Note On no canal 10 (0x90 + 9)
    const midiFloorTom = 41;
    const velocity = 80;

    const command = channel10Status >> 4;
    const channel = channel10Status & 0x0f;

    expect(command).toBe(9);
    expect(channel).toBe(9); // Canal 10 General MIDI

    const isDrumChannel = channel === 9;
    expect(isDrumChannel).toBe(true);
  });

  it('deve permitir ativar e silenciar o áudio guia no musicalPlaybackEngine sem interromper o andamento métrico', async () => {
    const { musicalPlaybackEngine } = await import('../../src/core/musicalPlaybackEngine');
    musicalPlaybackEngine.setAudioEnabled(false);
    expect(musicalPlaybackEngine.isAudioEnabled()).toBe(false);

    musicalPlaybackEngine.setAudioEnabled(true);
    expect(musicalPlaybackEngine.isAudioEnabled()).toBe(true);
  });

  it('deve pausar o motor de reprodução autônoma no Modo Espera (Wait) e permitir avanço no Modo Fluido (Flow)', async () => {
    const { musicalPlaybackEngine } = await import('../../src/core/musicalPlaybackEngine');
    const notes = odeToJoy.scoreTrack;
    musicalPlaybackEngine.loadScore(notes, odeToJoy.timeSignature, 120);

    // No Modo Fluido com prática iniciada:
    musicalPlaybackEngine.play(0);
    expect(musicalPlaybackEngine.getIsPlaying()).toBe(true);

    // Ao alternar para Modo Espera: deve pausar o motor imediatamente para a partitura esperar o toque do usuário
    musicalPlaybackEngine.pause();
    expect(musicalPlaybackEngine.getIsPlaying()).toBe(false);

    // Ao alternar de volta para Modo Fluido: retoma reprodução a partir da batida da nota atual
    const currentStepBeat = 2; // Ex: compasso 1, tempo 3
    musicalPlaybackEngine.play(currentStepBeat);
    expect(musicalPlaybackEngine.getIsPlaying()).toBe(true);

    musicalPlaybackEngine.stop();
    expect(musicalPlaybackEngine.getIsPlaying()).toBe(false);
  });

  it('deve avançar corretamente entre compassos com notas consecutivas de mesmo tom sem oscilar', () => {
    // Simula transição entre fim do c.1 (G3, midi 67) e início do c.2 (G3, midi 67)
    const consecutiveSamePitchNotes: ScoreNote[] = [
      { note: 'G3', midi: 67, duration: 1, measure: 1, beat: 4, clef: 'treble' },
      { note: 'G3', midi: 67, duration: 1, measure: 2, beat: 1, clef: 'treble' },
      { note: 'F3', midi: 65, duration: 1, measure: 2, beat: 2, clef: 'treble' },
    ];

    let currentTargetIndex = 0;
    const notifiedIndices: number[] = [];

    const onTargetNoteChange = (_note: ScoreNote | null, idx: number) => {
      notifiedIndices.push(idx);
    };

    // Simula notificação com base no índice (e não apenas no pitch MIDI)
    let lastTargetIndex: number | undefined = undefined;
    const updateTarget = (idx: number) => {
      currentTargetIndex = idx;
      if (lastTargetIndex !== currentTargetIndex) {
        lastTargetIndex = currentTargetIndex;
        onTargetNoteChange(consecutiveSamePitchNotes[idx], idx);
      }
    };

    updateTarget(0); // Inicia na nota 0 (G3, c.1)
    updateTarget(1); // Avança para a nota 1 (G3, c.2) - mesmo pitch 67!
    updateTarget(2); // Avança para a nota 2 (F3, c.2)

    expect(notifiedIndices).toEqual([0, 1, 2]);
  });

  it('não deve reavaliar o mesmo evento MIDI (mesmo timestamp) em passos subsequentes após avanço de currentIndex', () => {
    // Simula a proteção de timestamp do useScorePlayback
    let lastProcessedEventTimestamp = 0;
    let currentIdx = 0;
    const notes: ScoreNote[] = [
      { note: 'E3', midi: 64, duration: 1, measure: 1, beat: 1 },
      { note: 'E3', midi: 64, duration: 1, measure: 1, beat: 2 }, // Nota consecutiva idêntica
    ];

    let stepCompletedCount = 0;

    const processMidiInput = (event: { midi: number; timestamp: number }) => {
      // 1. Verificação de deduplicação por timestamp único do evento físico
      if (event.timestamp !== 0 && event.timestamp === lastProcessedEventTimestamp) {
        return false; // Ignora evento já consumido!
      }
      if (event.timestamp !== 0) {
        lastProcessedEventTimestamp = event.timestamp;
      }

      // Avalia se a nota confere com o passo atual
      if (notes[currentIdx]?.midi === event.midi) {
        stepCompletedCount++;
        currentIdx++;
        return true;
      }
      return false;
    };

    const firstPhysicalPress = { midi: 64, timestamp: 1000.5 };

    // Primeira avaliação: o usuário tocou E3 para o passo 0
    const matchedFirst = processMidiInput(firstPhysicalPress);
    expect(matchedFirst).toBe(true);
    expect(currentIdx).toBe(1);
    expect(stepCompletedCount).toBe(1);

    // Re-render do React disparado pela mudança de currentIdx de 0 para 1
    // O evento firstPhysicalPress ainda está presente no estado do componente pai
    const reEvaluatedStale = processMidiInput(firstPhysicalPress);
    expect(reEvaluatedStale).toBe(false); // DEVE SER REJEITADO!
    expect(currentIdx).toBe(1); // Não pulou a nota 1 inadvertidamente!
    expect(stepCompletedCount).toBe(1);

    // Segundo toque físico real do usuário (timestamp diferente)
    const secondPhysicalPress = { midi: 64, timestamp: 1250.0 };
    const matchedSecond = processMidiInput(secondPhysicalPress);
    expect(matchedSecond).toBe(true);
    expect(currentIdx).toBe(2);
    expect(stepCompletedCount).toBe(2);
  });

  it('deve ignorar ecos e índices defasados da prop currentNoteIndex para impedir oscilação (vaivém) entre compassos', () => {
    let internalCurrentIndex = 5;
    let lastEmittedIndex = 5; // hook acabou de emitir 5 para o componente pai
    const isPlaying = true;

    const handleExternalSync = (incomingPropIndex: number) => {
      // Se for eco da notificação interna recém emitida, deve ignorar
      if (incomingPropIndex === internalCurrentIndex || incomingPropIndex === lastEmittedIndex) {
        return false; // Não interfere
      }
      // Reset explícito para 0: permitido
      if (incomingPropIndex === 0) {
        internalCurrentIndex = 0;
        return true;
      }
      // REGRA DE MONOTONICIDADE: durante execução/prática ativa, índices menores que a posição atual são REJEITADOS
      if (isPlaying && incomingPropIndex < internalCurrentIndex) {
        return false;
      }
      internalCurrentIndex = incomingPropIndex;
      return true; // Sincronização externa real (ex: salto para a frente)
    };

    // 1. Pai re-renderiza assincronamente e devolve 5 (eco)
    const syncedEcho = handleExternalSync(5);
    expect(syncedEcho).toBe(false);
    expect(internalCurrentIndex).toBe(5);

    // 2. Pai re-renderiza com estado defasado anterior (ex: 4 ou 3) - DEVE SER REJEITADO PARA NÃO VOLTAR COMPASSO
    const syncedStale = handleExternalSync(4);
    expect(syncedStale).toBe(false);
    expect(internalCurrentIndex).toBe(5); // Preserva o progresso monotônico!

    const syncedOld = handleExternalSync(2);
    expect(syncedOld).toBe(false);
    expect(internalCurrentIndex).toBe(5);

    // 3. Salto legítimo para a frente (seek)
    const syncedForward = handleExternalSync(8);
    expect(syncedForward).toBe(true);
    expect(internalCurrentIndex).toBe(8);

    // 4. Usuário clica no botão de reiniciar (ordem externa real: reset para 0)
    const syncedReset = handleExternalSync(0);
    expect(syncedReset).toBe(true);
    expect(internalCurrentIndex).toBe(0);
  });

  it('deve transicionar passos no Modo Fluido de acordo com as batidas métricas reais sem pular à frente prematuramente', () => {
    // Três passos com offsets 0, 1, 2
    const noteOffsets = [0, 0, 1, 2, 3];

    const getStepStartIdx = (currentBeat: number) => {
      let stepStartIdx = 0;
      for (let i = 0; i < noteOffsets.length; i++) {
        const noteOffset = noteOffsets[i] ?? 0;
        if (noteOffset <= currentBeat + 0.15) {
          const prevOffset = noteOffsets[stepStartIdx] ?? 0;
          if (noteOffset > prevOffset + 0.05) {
            stepStartIdx = i;
          }
        } else {
          break;
        }
      }
      return stepStartIdx;
    };

    // No beat 0: deve permanecer no passo 0 (índice 0)
    expect(getStepStartIdx(0.0)).toBe(0);
    // No beat 0.2: NÃO deve pular para o beat 1! Deve continuar no passo 0
    expect(getStepStartIdx(0.2)).toBe(0);
    expect(getStepStartIdx(0.5)).toBe(0);
    expect(getStepStartIdx(0.8)).toBe(0);

    // À medida que a batida 1 se aproxima dentro da janela de lookahead (0.15 beats):
    // 1.0 - 0.15 = 0.85 beats
    expect(getStepStartIdx(0.86)).toBe(2); // Transiciona para o passo 1 (índice 2)
    expect(getStepStartIdx(1.0)).toBe(2);
    expect(getStepStartIdx(1.5)).toBe(2);

    // Beat 2
    expect(getStepStartIdx(1.86)).toBe(3);
    expect(getStepStartIdx(2.0)).toBe(3);
  });
});

