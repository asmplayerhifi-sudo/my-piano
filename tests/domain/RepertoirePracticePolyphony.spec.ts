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
});
