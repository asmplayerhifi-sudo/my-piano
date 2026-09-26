import { describe, it, expect } from 'vitest';
import {
  insertMidiNote,
  determineClefForMidi,
  quantizeBeatToGrid,
  calculateMeasureForBeat,
  calculateTotalMeasures,
  type ScoreMidiNote,
} from '../../src/core/scoreMidiWriter';

describe('MidiScoreEditorIntegration & Universal Input Rules', () => {
  describe('Clave e Notação do Pentagrama Duplo', () => {
    it('deve atribuir Clave de Sol para notas a partir do Dó Central (MIDI 60)', () => {
      expect(determineClefForMidi(60)).toBe('treble'); // C4 / C3 Central
      expect(determineClefForMidi(64)).toBe('treble'); // E4
      expect(determineClefForMidi(72)).toBe('treble'); // C5
    });

    it('deve atribuir Clave de Fá para notas abaixo do Dó Central (MIDI < 60)', () => {
      expect(determineClefForMidi(59)).toBe('bass'); // B3
      expect(determineClefForMidi(48)).toBe('bass'); // C3 Grave
      expect(determineClefForMidi(36)).toBe('bass'); // C2
    });
  });

  describe('Sincronização de Compasso e Inserção Passo a Passo (Step-Time Input)', () => {
    it('deve inserir nota MIDI no início do compasso 1 (beat 0) com a duração selecionada', () => {
      const result = insertMidiNote({
        midi: 60,
        noteName: 'C4',
        currentNotes: [],
        cursorBeat: 0,
        selectedDuration: 1, // Semínima
        selectedClef: 'treble',
        beatsPerMeasure: 4,
        isChordMode: false,
        isPlaying: false,
        playheadBeat: null,
      });

      expect(result.updatedNotes).toHaveLength(1);
      expect(result.insertedNote.midi).toBe(60);
      expect(result.insertedNote.beat).toBe(0);
      expect(result.insertedNote.measure).toBe(0);
      expect(result.insertedNote.duration).toBe(1);
      expect(result.nextCursorBeat).toBe(1); // Avança 1 beat
      expect(result.isNewMeasure).toBe(false);
    });

    it('deve avançar o cursor de beat em beat e cruzar para o compasso seguinte (c.2) em 4/4', () => {
      let notes: ScoreMidiNote[] = [];
      let cursor = 0;
      const midis = [60, 62, 64, 65, 67]; // C, D, E, F, G (5 notas semínimas)

      for (let i = 0; i < midis.length; i++) {
        const res = insertMidiNote({
          midi: midis[i],
          noteName: `Note-${midis[i]}`,
          currentNotes: notes,
          cursorBeat: cursor,
          selectedDuration: 1, // Semínima = 1 beat
          selectedClef: 'treble',
          beatsPerMeasure: 4, // Compasso 4/4
          isChordMode: false,
          isPlaying: false,
          playheadBeat: null,
        });
        notes = res.updatedNotes;
        cursor = res.nextCursorBeat;

        if (i === 3) {
          // A 4ª nota (índice 3) preenche o compasso 1 (beats 0, 1, 2, 3), o próximo beat é 4 (compasso 2)
          expect(res.isNewMeasure).toBe(true);
        }
      }

      expect(notes).toHaveLength(5);
      // As primeiras 4 notas estão no compasso 0 (c.1)
      expect(notes[0].measure).toBe(0);
      expect(notes[3].measure).toBe(0);
      // A 5ª nota está no compasso 1 (c.2, beat 4)
      expect(notes[4].measure).toBe(1);
      expect(notes[4].beat).toBe(4);
      expect(cursor).toBe(5);
    });

    it('deve respeitar diferentes fórmulas de compasso (ex: 3/4 e 2/4)', () => {
      // Compasso 3/4 (3 beats por compasso)
      expect(calculateMeasureForBeat(0, 3)).toBe(0);
      expect(calculateMeasureForBeat(2, 3)).toBe(0);
      expect(calculateMeasureForBeat(3, 3)).toBe(1); // Entrou em c.2
      expect(calculateMeasureForBeat(6, 3)).toBe(2); // Entrou em c.3

      // Compasso 2/4 (2 beats por compasso)
      expect(calculateMeasureForBeat(0, 2)).toBe(0);
      expect(calculateMeasureForBeat(1.5, 2)).toBe(0);
      expect(calculateMeasureForBeat(2, 2)).toBe(1);
    });

    it('deve manter o cursor no mesmo beat quando isChordMode estiver ativado (empilhamento de tríades)', () => {
      let notes: ScoreMidiNote[] = [];
      const chordMidis = [60, 64, 67]; // C, E, G
      let cursor = 2; // Inserindo no beat 2

      for (const m of chordMidis) {
        const res = insertMidiNote({
          midi: m,
          noteName: `Note-${m}`,
          currentNotes: notes,
          cursorBeat: cursor,
          selectedDuration: 2, // Mínima
          selectedClef: 'treble',
          beatsPerMeasure: 4,
          isChordMode: true, // Modo Acorde
          isPlaying: false,
          playheadBeat: null,
        });
        notes = res.updatedNotes;
        cursor = res.nextCursorBeat;
      }

      expect(notes).toHaveLength(3);
      // Todas as 3 notas compartilham exatamente o mesmo beat (acorde empilhado)
      expect(notes[0].beat).toBe(2);
      expect(notes[1].beat).toBe(2);
      expect(notes[2].beat).toBe(2);
      expect(cursor).toBe(2); // Cursor não se moveu
    });
  });

  describe('Quantização Rítmica na Gravação em Tempo Real', () => {
    it('deve quantizar a chegada da nota para a semínima mais próxima (snap = 1)', () => {
      expect(quantizeBeatToGrid(0.92, 1)).toBe(1);
      expect(quantizeBeatToGrid(1.08, 1)).toBe(1);
      expect(quantizeBeatToGrid(1.49, 1)).toBe(1);
      expect(quantizeBeatToGrid(1.51, 1)).toBe(2);
    });

    it('deve quantizar a chegada da nota para colcheias (snap = 0.5) e semicolcheias (snap = 0.25)', () => {
      expect(quantizeBeatToGrid(0.48, 0.5)).toBe(0.5);
      expect(quantizeBeatToGrid(0.62, 0.5)).toBe(0.5);
      expect(quantizeBeatToGrid(0.76, 0.5)).toBe(1);

      expect(quantizeBeatToGrid(0.23, 0.25)).toBe(0.25);
      expect(quantizeBeatToGrid(0.38, 0.25)).toBe(0.5);
    });

    it('deve inserir nota com quantização ao vivo durante execução com metrônomo', () => {
      const res = insertMidiNote({
        midi: 65,
        noteName: 'F4',
        currentNotes: [],
        cursorBeat: 0,
        selectedDuration: 0.5, // Colcheia
        selectedClef: 'treble',
        beatsPerMeasure: 4,
        isChordMode: false,
        isPlaying: true, // Reprodução ativa
        playheadBeat: 2.47, // Tocado ligeiramente antes do beat 2.5
      });

      expect(res.insertedNote.beat).toBe(2.5); // Quantizado com precisão
      expect(res.insertedNote.duration).toBe(0.5);
      expect(res.insertedNote.measure).toBe(0);
    });
  });

  describe('Expansão Dinâmica da Grade de Compassos', () => {
    it('deve expandir totalMeasures quando notas ou cursor avançam', () => {
      const notes: ScoreMidiNote[] = [
        { id: '1', midi: 60, noteName: 'C4', clef: 'treble', duration: 4, beat: 0, measure: 0 },
        { id: '2', midi: 62, noteName: 'D4', clef: 'treble', duration: 4, beat: 4, measure: 1 },
      ];

      // Mínimo de 4 compassos
      expect(calculateTotalMeasures(notes, 8, 4, 4)).toBe(4);

      // Inserindo no beat 16 (início do compasso c.5) -> expande para 5 compassos (c.1 a c.5)
      expect(calculateTotalMeasures(notes, 16, 4, 4)).toBe(5);
    });
  });
});
