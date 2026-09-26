/**
 * tests/domain/RepertoireLyricEnrichment.spec.ts
 *
 * Testes de Regressão do Enriquecimento Retroativo do Repertório.
 *
 * Cobre (Critérios de Aceite do Requisito):
 *  1.  100% das músicas são submetidas à auditoria sem exceção.
 *  2.  Cada música possui syncLevel claramente identificado.
 *  3.  Músicas com dados suficientes têm letra ↔ sílaba ↔ nota estruturada.
 *  4.  Instrumentais retornam unavailable (sem inventar letra).
 *  5.  Nenhuma sílaba com state='resolved' tem absoluteBeat=0 (invenção proibida).
 *  6.  resolvedSyllables + unresolvedSyllables = totalSyllables (invariante).
 *  7.  Sílabas pertencentes à mesma palavra têm o mesmo wordId.
 *  8.  Músicas sem dados ficam como unavailable, não como synchronized.
 *  9.  syncLevel 'synchronized' exige ≥90% de sílabas resolvidas.
 * 10.  Casos de borda: melismas, notas longas, múltiplos compassos.
 * 11.  Cache de sessão retorna o mesmo resultado para a mesma música.
 * 12.  enrichAllSongs processa todo o catálogo sem lançar exceções.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { REPERTOIRE_SONGS } from '../../src/core/repertoireData';
import {
  enrichRepertoireSong,
  enrichAllSongs,
  getCachedEnrichment,
  clearEnrichmentCache,
} from '../../src/core/repertoireLyricEnricher';
import type { RepertoireLyricEnrichmentResult } from '../../src/core/repertoireLyricEnricher';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

let allResults: Map<string, RepertoireLyricEnrichmentResult>;

beforeAll(() => {
  clearEnrichmentCache();
  allResults = enrichAllSongs(REPERTOIRE_SONGS);
});

// ─── 1. Cobertura 100% ────────────────────────────────────────────────────────

describe('1. Cobertura — 100% das músicas são auditadas', () => {
  it('enrichAllSongs deve retornar resultado para cada música do catálogo', () => {
    expect(allResults.size).toBe(REPERTOIRE_SONGS.length);
    for (const song of REPERTOIRE_SONGS) {
      expect(allResults.has(song.id), `Faltando resultado para: ${song.id}`).toBe(true);
    }
  });

  it('nenhum resultado deve ter syncLevel undefined ou inválido', () => {
    const valid = ['synchronized', 'partial', 'text_only', 'unavailable'];
    for (const [id, result] of allResults) {
      expect(valid, `syncLevel inválido em: ${id}`).toContain(result.syncLevel);
    }
  });
});

// ─── 2. Instrumentais identificados corretamente ─────────────────────────────

describe('2. Instrumentais → syncLevel unavailable', () => {
  const instrumentalIds = ['fur-elise', 'canon-in-d'];

  for (const id of instrumentalIds) {
    it(`${id} deve ter syncLevel unavailable`, () => {
      const song = REPERTOIRE_SONGS.find(s => s.id === id);
      if (!song) return; // música pode não existir nesta build
      const result = enrichRepertoireSong(song);
      expect(result.syncLevel).toBe('unavailable');
      expect(result.enrichedLines).toHaveLength(0);
      expect(result.totalSyllables).toBe(0);
    });
  }
});

// ─── 3. Invariante: resolved + unresolved = total ────────────────────────────

describe('3. Invariante de contagem de sílabas', () => {
  it('para todas as músicas: resolvedSyllables + unresolvedSyllables = totalSyllables', () => {
    for (const [id, result] of allResults) {
      const sum = result.resolvedSyllables + result.unresolvedSyllables;
      expect(sum, `Invariante violada em: ${id}`).toBe(result.totalSyllables);
    }
  });

  it('sílabas resolvidas nunca têm absoluteBeat = 0 (proibição de invenção)', () => {
    for (const [id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const syl of line.syllables) {
          if (syl.state === 'confirmed' || syl.state === 'inferred') {
            expect(syl.noteRef.absoluteBeat, `Sílaba inventada em ${id}: "${syl.text}"`).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});

// ─── 4. syncLevel synchronized exige ≥90% ───────────────────────────────────

describe('4. syncLevel synchronized exige ≥90% de sílabas resolvidas', () => {
  it('toda música com syncLevel synchronized tem resolvedSyllables/total ≥ 0.90', () => {
    for (const [id, result] of allResults) {
      if (result.syncLevel === 'synchronized' && result.totalSyllables > 0) {
        const ratio = result.resolvedSyllables / result.totalSyllables;
        expect(ratio, `${id} declarado synchronized mas ratio=${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(0.9);
      }
    }
  });
});

// ─── 5. Sílabas da mesma palavra têm o mesmo wordId ─────────────────────────

describe('5. Integridade de wordId — sílabas da mesma palavra compartilham wordId', () => {
  it('para todas as músicas com linhas enriquecidas, sílabas de uma palavra têm wordId único por palavra', () => {
    for (const [id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const word of line.structuredWords) {
          const wordIds = new Set(word.syllables.map(s => s.wordId));
          expect(wordIds.size, `Palavra "${word.fullText}" em ${id} tem múltiplos wordIds`).toBe(1);
        }
      }
    }
  });

  it('palavras diferentes de uma linha têm wordIds diferentes', () => {
    for (const [id, result] of allResults) {
      for (const line of result.enrichedLines) {
        if (line.structuredWords.length < 2) continue;
        const allWordIds = line.structuredWords.map(w => w.id);
        const unique = new Set(allWordIds);
        expect(unique.size, `Linha em ${id} tem palavras com wordIds duplicados`).toBe(allWordIds.length);
      }
    }
  });
});

// ─── 6. SyllabicPosition correto ─────────────────────────────────────────────

describe('6. SyllabicPosition — single/begin/middle/end correto', () => {
  it('palavra de 1 sílaba tem syllabic = single', () => {
    for (const [_id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const word of line.structuredWords) {
          if (word.syllables.length === 1) {
            expect(word.syllables[0].syllabic).toBe('single');
          }
        }
      }
    }
  });

  it('palavra de 2+ sílabas tem begin na primeira e end na última', () => {
    for (const [_id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const word of line.structuredWords) {
          if (word.syllables.length >= 2) {
            expect(word.syllables[0].syllabic).toBe('begin');
            expect(word.syllables[word.syllables.length - 1].syllabic).toBe('end');
          }
        }
      }
    }
  });

  it('sílabas intermediárias têm syllabic = middle', () => {
    for (const [_id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const word of line.structuredWords) {
          if (word.syllables.length >= 3) {
            for (let i = 1; i < word.syllables.length - 1; i++) {
              expect(word.syllables[i].syllabic).toBe('middle');
            }
          }
        }
      }
    }
  });
});

// ─── 7. Músicas sem dados ficam como unavailable ─────────────────────────────

describe('7. Músicas sem letra → unavailable, não synchronized', () => {
  it('música sem extension e sem entry no LYRIC_BANK → unavailable', () => {
    // Cria uma fixture de música sem qualquer dado de letra
    const fakeSong = {
      ...REPERTOIRE_SONGS[0],
      id: 'fake-instrumental-xyz',
      extension: undefined,
    };
    const result = enrichRepertoireSong(fakeSong);
    // Deve ser unavailable porque não tem letra nem está no LYRIC_BANK
    expect(result.syncLevel).toBe('unavailable');
    expect(result.totalSyllables).toBe(0);
  });
});

// ─── 8. Cache de sessão ───────────────────────────────────────────────────────

describe('8. Cache de sessão', () => {
  it('getCachedEnrichment retorna o mesmo objeto para a mesma música (referência estável)', () => {
    const song = REPERTOIRE_SONGS[0];
    clearEnrichmentCache();
    const r1 = getCachedEnrichment(song);
    const r2 = getCachedEnrichment(song);
    expect(r1).toBe(r2); // mesma referência — cache funcionando
  });

  it('clearEnrichmentCache invalida o cache e força reprocessamento', () => {
    const song = REPERTOIRE_SONGS[0];
    clearEnrichmentCache();
    const r1 = getCachedEnrichment(song);
    clearEnrichmentCache();
    const r2 = getCachedEnrichment(song);
    // Diferentes objetos mas mesmo conteúdo
    expect(r1).not.toBe(r2);
    expect(r1.syncLevel).toBe(r2.syncLevel);
    expect(r1.totalSyllables).toBe(r2.totalSyllables);
  });
});

// ─── 9. Músicas com letra legada são enriquecidas ────────────────────────────

describe('9. Músicas com lyrics legado → não ficam como unavailable', () => {
  it('ode-to-joy tem letra e deve ser enriquecida (não unavailable)', () => {
    const song = REPERTOIRE_SONGS.find(s => s.id === 'ode-to-joy');
    if (!song) return;
    const result = enrichRepertoireSong(song);
    expect(result.syncLevel).not.toBe('unavailable');
    expect(result.totalSyllables).toBeGreaterThan(0);
  });

  it('three-little-birds tem letra e deve ser enriquecida', () => {
    const song = REPERTOIRE_SONGS.find(s => s.id === 'three-little-birds');
    if (!song) return;
    const result = enrichRepertoireSong(song);
    expect(result.syncLevel).not.toBe('unavailable');
    expect(result.totalSyllables).toBeGreaterThan(0);
  });
});

// ─── 10. Casos de borda: notas longas, melismas, múltiplos compassos ─────────

describe('10. Casos de borda — melismas, notas longas, múltiplos compassos', () => {
  it('sílabas com múltiplas notas por beat ficam em estado válido (confirmed, inferred, unresolved ou pending)', () => {
    const validStates = ['confirmed', 'inferred', 'unresolved', 'pending_validation'];
    for (const [id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const syl of line.syllables) {
          expect(validStates, `Estado inválido em ${id}: "${syl.state}"`).toContain(syl.state);
        }
      }
    }
  });

  it('sílabas de palavras que atravessam compassos: measure do begin ≤ measure do end', () => {
    for (const [_id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const word of line.structuredWords) {
          if (word.syllables.length >= 2 && word.spansMeasures) {
            const firstMeasure = word.syllables[0].noteRef.measure;
            const lastMeasure = word.syllables[word.syllables.length - 1].noteRef.measure;
            expect(firstMeasure).toBeLessThanOrEqual(lastMeasure);
          }
        }
      }
    }
  });

  it('syllablesInWord é consistente com o número real de sílabas da palavra', () => {
    for (const [id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const word of line.structuredWords) {
          for (const syl of word.syllables) {
            expect(syl.syllablesInWord, `syllablesInWord inconsistente em ${id}`)
              .toBe(word.syllables.length);
          }
        }
      }
    }
  });
});

// ─── 11. Auditoria de não-invenção de associações ────────────────────────────

describe('11. Não-invenção — sílabas unresolved não têm NoteRef sintético com dados reais', () => {
  it('sílabas unresolved/pending têm absoluteBeat = 0 (sem nota atribuída)', () => {
    for (const [id, result] of allResults) {
      for (const line of result.enrichedLines) {
        for (const syl of line.syllables) {
          if (syl.state === 'unresolved' || syl.state === 'pending_validation') {
            expect(
              syl.noteRef.absoluteBeat,
              `Sílaba unresolved com beat inventado em ${id}: "${syl.text}"`
            ).toBe(0);
          }
        }
      }
    }
  });
});

// ─── 12. Desempenho: enriquecimento completo em tempo razoável ───────────────

describe('12. Desempenho do enriquecimento retroativo', () => {
  it('enriquecimento de todo o catálogo deve completar em menos de 3s', () => {
    clearEnrichmentCache();
    const start = performance.now();
    enrichAllSongs(REPERTOIRE_SONGS);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });
});
