import { describe, it, expect } from 'vitest';
import { parseScoreTimeSignature } from '../../src/components/score/scrolling/useScoreTimeline';
import { KEYBOARD_COURSE_MODULES } from '../../src/core/coursesData';
import { REPERTOIRE_SONGS } from '../../src/core/repertoireData';

describe('Score Timeline & Final Barline Accuracy', () => {
  it('deve decompor corretamente fórmulas de compasso simples e compostas', () => {
    expect(parseScoreTimeSignature('4/4')).toEqual({ numerator: 4, denominator: 4, beatsPerMeasure: 4 });
    expect(parseScoreTimeSignature('3/4')).toEqual({ numerator: 3, denominator: 4, beatsPerMeasure: 3 });
    expect(parseScoreTimeSignature('2/4')).toEqual({ numerator: 2, denominator: 4, beatsPerMeasure: 2 });
    expect(parseScoreTimeSignature('6/8')).toEqual({ numerator: 6, denominator: 8, beatsPerMeasure: 2 });
  });

  it('o fim da partitura (totalBeats) em todos os exercícios deve ser estritamente posterior a todas as notas', () => {
    for (const mod of KEYBOARD_COURSE_MODULES) {
      for (const lesson of mod.lessons) {
        for (const ex of lesson.exercises || []) {
          if (!ex.scoreTrack || ex.scoreTrack.length === 0) continue;

          const { beatsPerMeasure } = parseScoreTimeSignature(ex.timeSignature || '4/4');
          let maxMeasure = 1;
          let maxBeat = 0;

          for (const note of ex.scoreTrack) {
            const m = Math.max(1, note.measure || 1);
            const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
            const dur = note.duration || 1;
            const beatOffset = (m - 1) * beatsPerMeasure + b;

            if (m > maxMeasure) maxMeasure = m;
            if (beatOffset + dur > maxBeat) maxBeat = beatOffset + dur;
          }

          const totalMeasures = Math.max(maxMeasure, Math.ceil(maxBeat / beatsPerMeasure));
          const totalBeats = Math.max(totalMeasures * beatsPerMeasure, maxBeat);

          // Todas as notas devem terminar rigorosamente antes ou exatamente na barra final (FIM)
          expect(totalBeats).toBeGreaterThanOrEqual(maxBeat);

          for (const note of ex.scoreTrack) {
            const m = Math.max(1, note.measure || 1);
            const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
            const beatOffset = (m - 1) * beatsPerMeasure + b;
            const dur = note.duration || 1;

            // O início da nota deve ser estritamente menor que totalBeats
            expect(beatOffset).toBeLessThan(totalBeats);
            // O término da nota não pode ultrapassar totalBeats
            expect(beatOffset + dur).toBeLessThanOrEqual(totalBeats);
          }
        }
      }
    }
  });

  it('em todas as músicas do repertório, nenhuma nota deve ultrapassar o fim total da partitura', () => {
    for (const song of REPERTOIRE_SONGS) {
      if (!song.scoreTrack || song.scoreTrack.length === 0) continue;

      const { beatsPerMeasure } = parseScoreTimeSignature(song.timeSignature || '4/4');
      let maxMeasure = 1;
      let maxBeat = 0;

      for (const note of song.scoreTrack) {
        const m = Math.max(1, note.measure || 1);
        const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
        const dur = note.duration || 1;
        const beatOffset = (m - 1) * beatsPerMeasure + b;

        if (m > maxMeasure) maxMeasure = m;
        if (beatOffset + dur > maxBeat) maxBeat = beatOffset + dur;
      }

      const totalMeasures = Math.max(maxMeasure, Math.ceil(maxBeat / beatsPerMeasure));
      const totalBeats = Math.max(totalMeasures * beatsPerMeasure, maxBeat);

      expect(totalBeats).toBeGreaterThanOrEqual(maxBeat);
    }
  });
});
