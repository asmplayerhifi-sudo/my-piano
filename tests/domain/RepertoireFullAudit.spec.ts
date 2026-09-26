import { describe, it, expect } from 'vitest';
import { REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from '../../src/core/repertoireData';
import { RepertoireAccuracyValidator } from '../../src/core/repertoireAccuracyValidator';

describe('Auditoria Completa e Ampliação do Repertório (PRD Harmonia)', () => {
  it('garante que 100% das obras possuem estado de auditoria identificável e válido (Critério 1 e 2)', () => {
    const validStatuses = ['VALIDATED', 'CORRECTED', 'COMPLETED', 'ENRICHED', 'PENDING_VALIDATION', 'BLOCKED_LICENSE'];

    expect(REPERTOIRE_SONGS.length).toBe(68);

    for (const song of REPERTOIRE_SONGS) {
      expect(song.auditStatus, `Música "${song.title}" (${song.id}) deve ter auditStatus definido`).toBeDefined();
      expect(validStatuses, `Status "${song.auditStatus}" de "${song.title}" deve ser válido`).toContain(song.auditStatus);
    }
  });

  it('valida que 100% das obras do repertório atingem nível PERFECT no RepertoireAccuracyValidator (Critério 3 e 4)', () => {
    const allResults = RepertoireAccuracyValidator.validateAll(REPERTOIRE_SONGS);

    expect(allResults.globalAverageScore).toBe(100);
    expect(allResults.perfectCount).toBe(REPERTOIRE_SONGS.length);

    for (const report of allResults.reports) {
      expect(report.accuracyScore, `Obra "${report.songTitle}" (${report.songId}) deve ter score 100`).toBe(100);
      expect(report.status).toBe('PERFECT');
      expect(report.diagnostics.length, `Obra "${report.songTitle}" não deve ter diagnósticos de erro/aviso`).toBe(0);
    }
  });

  it('assegura que todas as notas estão estritamente ordenadas cronologicamente (sem saltos temporais regressivos)', () => {
    for (const song of REPERTOIRE_SONGS) {
      const parts = (song.timeSignature || '4/4').split('/');
      const beatsPerMeasure = parseInt(parts[0], 10) || 4;

      let prevOffset = -1;
      for (let i = 0; i < song.scoreTrack.length; i++) {
        const note = song.scoreTrack[i];
        const m = Math.max(1, note.measure || 1);
        const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
        const currentOffset = (m - 1) * beatsPerMeasure + b;

        expect(
          currentOffset,
          `Nota ${i} de "${song.title}" no compasso ${m}, tempo ${b + 1} não deve regredir no tempo (atual: ${currentOffset}, anterior: ${prevOffset})`
        ).toBeGreaterThanOrEqual(prevOffset);

        prevOffset = currentOffset;
      }
    }
  });

  it('confirma a presença de partitura dupla balanceada (clave de Sol e clave de Fá) em 100% das obras', () => {
    for (const song of REPERTOIRE_SONGS) {
      const trebleNotes = song.scoreTrack.filter((n) => n.clef === 'treble');
      const bassNotes = song.scoreTrack.filter((n) => n.clef === 'bass');

      expect(trebleNotes.length, `"${song.title}" deve ter notas na clave de Sol`).toBeGreaterThan(0);
      expect(bassNotes.length, `"${song.title}" deve ter notas na clave de Fá`).toBeGreaterThan(0);
    }
  });

  it('verifica a incorporação e fidelidade musical das 10 novas obras de expansão do repertório (Critério 9)', () => {
    const newMasterpieces = [
      { id: 'amazing-grace', genre: 'Gospel Clássico & Sacro', timeSig: '3/4', key: 'G' },
      { id: 'grandioso-es-tu', genre: 'Gospel Clássico & Sacro', timeSig: '4/4', key: 'C' },
      { id: 'rude-cruz', genre: 'Gospel Clássico & Sacro', timeSig: '3/4', key: 'F' },
      { id: 'prelude-c-major-bach', genre: 'Clássico & Mestres', timeSig: '4/4', key: 'C' },
      { id: 'sonata-k545-mozart', genre: 'Clássico & Mestres', timeSig: '4/4', key: 'C' },
      { id: 'chopin-prelude-e-minor', genre: 'Clássico & Mestres', timeSig: '4/4', key: 'Em' },
      { id: 'tico-tico-no-fuba', genre: 'MPB & Pop Nacional', timeSig: '4/4', key: 'Am' },
      { id: 'aquarela-do-brasil', genre: 'MPB & Pop Nacional', timeSig: '4/4', key: 'G' },
      { id: 'greensleeves', genre: 'Internacional & Folk', timeSig: '3/4', key: 'Am' },
      { id: 'house-of-the-rising-sun', genre: 'Internacional & Folk', timeSig: '6/8', key: 'Am' },
    ];

    for (const item of newMasterpieces) {
      const song = REPERTOIRE_SONGS.find((s) => s.id === item.id);
      expect(song, `Obra de expansão "${item.id}" deve existir no catálogo`).toBeDefined();
      expect(song!.genre).toBe(item.genre);
      expect(song!.timeSignature).toBe(item.timeSig);
      expect(song!.auditStatus).toBe('ENRICHED');
      expect(song!.extension, `"${item.id}" deve conter metadados de extensão completos`).toBeDefined();
      expect(song!.extension?.credits?.composer).toBeDefined();
      expect(song!.extension?.audit?.sources.length).toBeGreaterThan(0);
      expect(song!.extension?.sections?.length).toBeGreaterThan(0);
      expect(song!.scoreTrack.length).toBeGreaterThanOrEqual(40);
    }
  });

  it('confirma a coerência entre as categorias de REPERTOIRE_CATEGORIES e os gêneros das obras', () => {
    for (const cat of REPERTOIRE_CATEGORIES) {
      if (cat.id === 'Todos') {
        expect(cat.badge).toBe(`${REPERTOIRE_SONGS.length} Obras`);
      } else {
        const matchingSongs = REPERTOIRE_SONGS.filter((s) => s.genre === cat.id);
        expect(matchingSongs.length).toBeGreaterThan(0);
        expect(cat.badge).toBe(`${matchingSongs.length} Obras`);
      }
    }
  });
});
