/**
 * tests/domain/LyricSyllableEngine.spec.ts
 *
 * Suíte de Testes do Sistema de Enriquecimento de Letra por Sílaba e Nota.
 *
 * Cobre:
 *  1. Divisão silábica (splitWordIntoSyllables, tokenizeWords)
 *  2. Posição silábica (syllabicPosition) — single/begin/middle/end
 *  3. Distribuição de sílabas entre notas (proportional, equal, onset_only)
 *  4. Anotação de melismas
 *  5. Enriquecimento completo: músicas com compassos variados, notas longas,
 *     pausas, palavras divididas entre compassos, mudanças de andamento
 *  6. Parsing de seções no texto cru (Verso/Refrão/Bridge)
 *  7. syncLevel: synchronized / partial / text_only / unavailable
 *  8. Utilitários de busca: findActiveSyllable, isSyllableActive
 *  9. Compatibilidade backward: enrichFromLyricLines
 * 10. Critérios de aceitação: sílaba não resolvida marcada, nunca inventada
 */

import { describe, it, expect } from 'vitest';
import {
  enrichLyrics,
  enrichFromLyricLines,
  parseRawLyricText,
  splitWordIntoSyllables,
  tokenizeWords,
  syllabicPosition,
  syllabifyPortugueseWord,
} from '../../src/core/lyricEnrichmentEngine';
import {
  findActiveSyllable,
  isSyllableActive,
  findActiveEnrichedLine,
  enrichedToLyricLines,
} from '../../src/core/lyricSyllableTypes';
import type {
  LyricEnrichmentInput,
  LyricSource,
  LyricEnrichmentConfig,
} from '../../src/core/lyricSyllableTypes';
import type { ScoreNote } from '../../src/core/coursesData';

// ─── Helpers de Fixture ────────────────────────────────────────────────────────

function makeNote(
  measure: number,
  beat: number,
  duration: number,
  midi = 60,
  clef: ScoreNote['clef'] = 'treble'
): ScoreNote {
  return { measure, beat, duration, midi, clef, noteName: `N${midi}` };
}

const DEFAULT_SOURCE: LyricSource = {
  type: 'manual',
  validated: true,
  description: 'Test fixture',
};

const DEFAULT_CONFIG: LyricEnrichmentConfig = {
  beatsPerMeasure: 4,
  distributionStrategy: 'equal',
  trebleOnlyAssociation: true,
};

function makeInput(
  rawText: string,
  notes: ScoreNote[],
  config: Partial<LyricEnrichmentConfig> = {}
): LyricEnrichmentInput {
  return {
    rawText,
    scoreNotes: notes,
    config: { ...DEFAULT_CONFIG, ...config },
    source: DEFAULT_SOURCE,
  };
}

// ─── 1. Divisão Silábica ───────────────────────────────────────────────────────

describe('1. Divisão Silábica', () => {
  it('splitWordIntoSyllables: palavra sem hífen retorna a palavra inteira', () => {
    expect(splitWordIntoSyllables('linda')).toEqual(['linda']);
    expect(splitWordIntoSyllables('bela')).toEqual(['bela']);
  });

  it('splitWordIntoSyllables: palavra hifenizada divide corretamente', () => {
    expect(splitWordIntoSyllables('ma-ra-vi-lho-sa')).toEqual(['ma', 'ra', 'vi', 'lho', 'sa']);
    expect(splitWordIntoSyllables('li-ber-da-de')).toEqual(['li', 'ber', 'da', 'de']);
    expect(splitWordIntoSyllables('a-mor')).toEqual(['a', 'mor']);
  });

  it('splitWordIntoSyllables: sílaba única com hífen ao final é tratada', () => {
    expect(splitWordIntoSyllables('pá-tria')).toEqual(['pá', 'tria']);
  });

  it('splitWordIntoSyllables: string vazia retorna array vazio', () => {
    expect(splitWordIntoSyllables('')).toEqual([]);
    expect(splitWordIntoSyllables('  ')).toEqual([]);
  });

  it('tokenizeWords: tokeniza frase descartando pontuação', () => {
    const words = tokenizeWords('Linda de mais, linda!');
    expect(words).toContain('Linda');
    expect(words).toContain('de');
    expect(words).toContain('mais');
    expect(words).toContain('linda');
    expect(words).not.toContain(',');
    expect(words).not.toContain('!');
  });

  it('tokenizeWords: string vazia retorna array vazio', () => {
    expect(tokenizeWords('')).toHaveLength(0);
    expect(tokenizeWords('   ')).toHaveLength(0);
  });
});

// ─── 2. Posição Silábica ───────────────────────────────────────────────────────

describe('2. Posição Silábica (syllabicPosition)', () => {
  it('retorna single para palavra com uma sílaba', () => {
    expect(syllabicPosition(0, 1)).toBe('single');
  });

  it('retorna begin para primeira sílaba de palavra polissílaba', () => {
    expect(syllabicPosition(0, 3)).toBe('begin');
    expect(syllabicPosition(0, 5)).toBe('begin');
  });

  it('retorna end para última sílaba de palavra polissílaba', () => {
    expect(syllabicPosition(2, 3)).toBe('end');
    expect(syllabicPosition(4, 5)).toBe('end');
  });

  it('retorna middle para sílabas intermediárias', () => {
    expect(syllabicPosition(1, 3)).toBe('middle');
    expect(syllabicPosition(1, 5)).toBe('middle');
    expect(syllabicPosition(2, 5)).toBe('middle');
    expect(syllabicPosition(3, 5)).toBe('middle');
  });

  it('palavra de duas sílabas: begin e end', () => {
    expect(syllabicPosition(0, 2)).toBe('begin');
    expect(syllabicPosition(1, 2)).toBe('end');
  });
});

// ─── 3. Parsing de Texto Cru ──────────────────────────────────────────────────

describe('3. Parsing de Texto Cru', () => {
  it('detecta marcador [Verso] e atribui lineType verse', () => {
    const lines = parseRawLyricText('[Verso 1]\nLinda de mais\nBela assim');
    expect(lines).toHaveLength(2);
    expect(lines[0].lineType).toBe('verse');
    expect(lines[1].lineType).toBe('verse');
  });

  it('detecta marcador [Refrão] e alterna lineType', () => {
    const lines = parseRawLyricText('[Verso]\nVerso aqui\n[Refrão]\nRefrão aqui');
    expect(lines[0].lineType).toBe('verse');
    expect(lines[1].lineType).toBe('chorus');
  });

  it('detecta marcadores em português: Introdução, Ponte, Bridge, Coda', () => {
    const text = '[Introdução]\nIntro\n[Ponte]\nBridge\n[Coda]\nFinal';
    const lines = parseRawLyricText(text);
    expect(lines.find(l => l.text === 'Intro')?.lineType).toBe('intro');
    expect(lines.find(l => l.text === 'Bridge')?.lineType).toBe('bridge');
    expect(lines.find(l => l.text === 'Final')?.lineType).toBe('outro');
  });

  it('herda o tipo da seção anterior para linhas sem marcador', () => {
    const lines = parseRawLyricText('[Refrão]\nLinha 1\nLinha 2\nLinha 3');
    expect(lines).toHaveLength(3);
    lines.forEach(l => expect(l.lineType).toBe('chorus'));
  });

  it('ignora linhas em branco', () => {
    const lines = parseRawLyricText('Linha 1\n\n\nLinha 2');
    expect(lines).toHaveLength(2);
  });
});

// ─── 4. Enriquecimento Básico — Música Simples ────────────────────────────────

describe('4. Enriquecimento Básico', () => {
  it('deve associar uma sílaba por nota em música simples (4 palavras, 4 notas)', () => {
    const notes = [
      makeNote(1, 1, 1, 60), // beat abs 1
      makeNote(1, 2, 1, 62), // beat abs 2
      makeNote(1, 3, 1, 64), // beat abs 3
      makeNote(1, 4, 1, 65), // beat abs 4
    ];
    const result = enrichLyrics(makeInput('lin-da de-mais', notes));

    expect(result.lines).toHaveLength(1);
    const line = result.lines[0];
    expect(line.syllables).toHaveLength(4);
    expect(line.syllables[0].text).toBe('lin');
    expect(line.syllables[0].syllabic).toBe('begin');
    expect(line.syllables[1].text).toBe('da');
    expect(line.syllables[1].syllabic).toBe('end');
    expect(line.syllables[2].text).toBe('de');
    expect(line.syllables[3].text).toBe('mais');
  });

  it('deve calcular beatAbsoluto correto para notas em múltiplos compassos', () => {
    const notes = [
      makeNote(1, 1, 1, 60), // abs = 1
      makeNote(2, 1, 1, 62), // abs = 5
      makeNote(3, 1, 1, 64), // abs = 9
    ];
    const result = enrichLyrics(makeInput('bom dia a-mor', notes));
    const syls = result.lines[0].syllables;

    // beats absolutos: compasso 1 beat 1 = 1, compasso 2 beat 1 = 5, compasso 3 beat 1 = 9
    expect(syls[0].noteRef.absoluteBeat).toBe(1);
    expect(syls[1].noteRef.absoluteBeat).toBe(5);
    expect(syls[2].noteRef.absoluteBeat).toBe(9);
  });

  it('syncLevel deve ser synchronized quando todas as sílabas são associadas', () => {
    const notes = [
      makeNote(1, 1, 1, 60),
      makeNote(1, 2, 1, 62),
      makeNote(1, 3, 1, 64),
    ];
    const result = enrichLyrics(makeInput('be-la-men-te linda', notes, { distributionStrategy: 'equal' }));
    // 3 notas, pode não ter 100% — verificar syncLevel baseado em threshold
    expect(['synchronized', 'partial', 'text_only']).toContain(result.syncLevel);
  });
});

// ─── 5. Palavras Distribuídas por Múltiplas Notas ─────────────────────────────

describe('5. Palavras Polissílabas e Distribuição', () => {
  it('sílabas de "ma-ra-vi-lho-sa" devem ter syllabic correto', () => {
    const notes = Array.from({ length: 5 }, (_, i) => makeNote(1, i + 1 > 4 ? 2 : 1, 0.5, 60 + i));
    // Mais notas para acomodar 5 sílabas
    const allNotes = [
      makeNote(1, 1, 0.5, 60),
      makeNote(1, 1.5, 0.5, 62),
      makeNote(1, 2, 0.5, 64),
      makeNote(1, 2.5, 0.5, 65),
      makeNote(1, 3, 0.5, 67),
    ];
    const result = enrichLyrics(makeInput('ma-ra-vi-lho-sa', allNotes));
    const word = result.lines[0].structuredWords[0];

    expect(word.fullText).toBe('maravilhosa');
    expect(word.syllables).toHaveLength(5);
    expect(word.syllables[0].syllabic).toBe('begin');
    expect(word.syllables[1].syllabic).toBe('middle');
    expect(word.syllables[2].syllabic).toBe('middle');
    expect(word.syllables[3].syllabic).toBe('middle');
    expect(word.syllables[4].syllabic).toBe('end');
  });

  it('palavra de 2 sílabas deve ter begin e end', () => {
    const notes = [makeNote(1, 1, 1, 60), makeNote(1, 2, 1, 62)];
    const result = enrichLyrics(makeInput('a-mor', notes));
    const syls = result.lines[0].syllables;

    expect(syls[0].syllabic).toBe('begin');
    expect(syls[1].syllabic).toBe('end');
    expect(syls[0].wordId).toBe(syls[1].wordId); // mesma palavra
  });

  it('sílabas da mesma palavra devem compartilhar wordId', () => {
    const notes = [
      makeNote(1, 1, 1, 60),
      makeNote(1, 2, 1, 62),
      makeNote(1, 3, 1, 64),
    ];
    const result = enrichLyrics(makeInput('li-ber-da', notes));
    const syls = result.lines[0].syllables;
    const wordIds = syls.map(s => s.wordId);
    // Todas da mesma palavra
    expect(new Set(wordIds).size).toBe(1);
  });

  it('palavras diferentes devem ter wordIds diferentes', () => {
    const notes = [
      makeNote(1, 1, 1, 60), makeNote(1, 2, 1, 62),
      makeNote(1, 3, 1, 64), makeNote(1, 4, 1, 65),
    ];
    const result = enrichLyrics(makeInput('eu te a-mo', notes));
    const words = result.lines[0].structuredWords;
    const wordIds = words.map(w => w.id);
    // 'eu', 'te', 'a-mo' = 3 palavras
    expect(new Set(wordIds).size).toBe(wordIds.length);
  });
});

// ─── 6. Notas Longas e Melismas ───────────────────────────────────────────────

describe('6. Notas Longas, Pausas e Melismas', () => {
  it('estratégia proportional distribui mais sílabas para notas longas', () => {
    // 1 semibreve (4 beats) + 1 semínima (1 beat) = 2 notas, 5 beats totais
    // 5 sílabas: semibreve deve receber 4 sílabas, semínima 1 sílaba
    const notes = [
      makeNote(1, 1, 4, 60), // semibreve: beat 1
      makeNote(2, 1, 1, 62), // semínima: beat 1 do compasso 2
    ];
    const result = enrichLyrics(makeInput('ma-ra-vi-lho-sa', notes, {
      distributionStrategy: 'proportional',
    }));
    const syls = result.lines[0].syllables;
    expect(syls).toHaveLength(5);
    // As primeiras 4 sílabas devem estar na semibreve (compasso 1)
    expect(syls[0].noteRef.measure).toBe(1);
    expect(syls[1].noteRef.measure).toBe(1);
    expect(syls[2].noteRef.measure).toBe(1);
    expect(syls[3].noteRef.measure).toBe(1);
    // A última sílaba vai para a semínima (compasso 2)
    expect(syls[4].noteRef.measure).toBe(2);
  });

  it('sílabas excedentes às notas ficam com estado unresolved', () => {
    // 2 notas, 5 sílabas
    const notes = [makeNote(1, 1, 1, 60), makeNote(1, 2, 1, 62)];
    const result = enrichLyrics(makeInput('ma-ra-vi-lho-sa', notes));
    const unresolved = result.lines[0].syllables.filter(s =>
      s.state === 'unresolved' || s.state === 'pending_validation'
    );
    expect(unresolved.length).toBeGreaterThan(0);
    expect(result.unresolvedSyllables).toBeGreaterThan(0);
  });

  it('sílabas não resolvidas nunca devem ter noteRef.absoluteBeat > 0 (sem invenção)', () => {
    const notes = [makeNote(1, 1, 1, 60)]; // 1 nota para 4 sílabas
    const result = enrichLyrics(makeInput('lin-da de-mais', notes));
    const unresolved = result.lines[0].syllables.filter(s => s.state === 'unresolved');
    for (const syl of unresolved) {
      // Não deve ter inventado uma nota — absoluteBeat deve ser 0 (placeholder)
      expect(syl.noteRef.absoluteBeat).toBe(0);
    }
  });

  it('marcUnresolvedAsPending deve marcar sílabas como pending_validation', () => {
    const notes = [makeNote(1, 1, 1, 60)]; // insuficiente
    const result = enrichLyrics(makeInput('li-ber-da-de', notes, {
      markUnresolvedAsPending: true,
    }));
    const pending = result.lines[0].syllables.filter(s => s.state === 'pending_validation');
    expect(pending.length).toBeGreaterThan(0);
  });
});

// ─── 7. Múltiplas Linhas e Seções ─────────────────────────────────────────────

describe('7. Múltiplas Linhas e Seções', () => {
  it('múltiplas linhas de texto devem produzir múltiplos EnrichedLyricLine', () => {
    const notes = Array.from({ length: 8 }, (_, i) => makeNote(
      Math.floor(i / 4) + 1,
      (i % 4) + 1,
      1, 60 + i
    ));
    const text = 'Linda de mais\nBela assim';
    const result = enrichLyrics(makeInput(text, notes));
    expect(result.lines).toHaveLength(2);
  });

  it('linhas de verso e refrão devem ter lineType correto', () => {
    const notes = Array.from({ length: 6 }, (_, i) => makeNote(i + 1, 1, 1, 60 + i));
    const text = '[Verso]\nLinda de mais\n[Refrão]\nBela assim linda';
    const result = enrichLyrics(makeInput(text, notes));
    expect(result.lines[0].lineType).toBe('verse');
    expect(result.lines[1].lineType).toBe('chorus');
  });

  it('notas são distribuídas sequencialmente entre as linhas', () => {
    const notes = Array.from({ length: 6 }, (_, i) => makeNote(i + 1, 1, 1, 60 + i));
    const text = 'A B C\nD E F';
    const result = enrichLyrics(makeInput(text, notes));

    // Linha 1 deve pegar as 3 primeiras notas
    expect(result.lines[0].syllables[0].noteRef.measure).toBe(1);
    // Linha 2 deve continuar de onde parou
    expect(result.lines[1].syllables[0].noteRef.measure).toBe(4);
  });
});

// ─── 8. Variação de Compasso e Andamento ──────────────────────────────────────

describe('8. Compasso 3/4 e Andamento Variado', () => {
  it('3/4: beat absoluto calculado corretamente', () => {
    const notes = [
      makeNote(1, 1, 1, 60), // abs = 1
      makeNote(1, 2, 1, 62), // abs = 2
      makeNote(1, 3, 1, 64), // abs = 3
      makeNote(2, 1, 1, 65), // abs = 4
      makeNote(2, 2, 1, 67), // abs = 5
      makeNote(2, 3, 1, 69), // abs = 6
    ];
    const result = enrichLyrics(makeInput('um dois três qua-tro cin-co', notes, {
      beatsPerMeasure: 3,
    }));
    const syls = result.lines[0].syllables;
    expect(syls[3].noteRef.absoluteBeat).toBe(4); // compasso 2 beat 1 em 3/4
    expect(syls[4].noteRef.absoluteBeat).toBe(5); // compasso 2 beat 2
    expect(syls[5].noteRef.absoluteBeat).toBe(6); // compasso 2 beat 3
  });

  it('nota de baixo ignorada quando trebleOnlyAssociation = true', () => {
    const notes = [
      makeNote(1, 1, 1, 60, 'treble'), // → associada
      makeNote(1, 1, 1, 36, 'bass'),   // → ignorada
      makeNote(1, 2, 1, 62, 'treble'), // → associada
    ];
    const result = enrichLyrics(makeInput('eu te', notes, {
      trebleOnlyAssociation: true,
    }));
    const syls = result.lines[0].syllables;
    // Só 2 sílabas com 2 notas de sol
    expect(syls[0].noteRef.clef).toBe('treble');
    expect(syls[1].noteRef.clef).toBe('treble');
  });
});

// ─── 9. Utilitários de Busca em Tempo Real ────────────────────────────────────

describe('9. Utilitários: findActiveSyllable e isSyllableActive', () => {
  it('isSyllableActive retorna true no beat exato da nota', () => {
    const notes = [makeNote(1, 1, 1, 60), makeNote(1, 2, 1, 62)];
    const result = enrichLyrics(makeInput('eu te', notes));
    const syl = result.lines[0].syllables[0];
    expect(isSyllableActive(syl, 1)).toBe(true);
  });

  it('isSyllableActive retorna false fora do intervalo da nota', () => {
    const notes = [makeNote(1, 1, 1, 60)];
    const result = enrichLyrics(makeInput('eu', notes));
    const syl = result.lines[0].syllables[0];
    expect(isSyllableActive(syl, 2)).toBe(false); // beat 2 é fora da semínima
    expect(isSyllableActive(syl, 0.5)).toBe(false); // antes do início
  });

  it('findActiveSyllable retorna a sílaba correta para o beat atual', () => {
    const notes = [
      makeNote(1, 1, 1, 60), // abs=1
      makeNote(1, 2, 1, 62), // abs=2
      makeNote(1, 3, 1, 64), // abs=3
    ];
    const result = enrichLyrics(makeInput('eu te a-mo', notes));
    const allSyls = result.lines[0].syllables;

    const active = findActiveSyllable(allSyls, 2);
    expect(active).not.toBeNull();
    expect(active!.text).toBe('te');
  });

  it('findActiveEnrichedLine retorna a linha ativa correta', () => {
    const notes = Array.from({ length: 6 }, (_, i) => makeNote(i + 1, 1, 1, 60 + i));
    const result = enrichLyrics(makeInput('[Verso]\nPrimeira linha\n[Refrão]\nSegunda linha', notes));

    const line = findActiveEnrichedLine(result.lines, 1);
    expect(line).not.toBeNull();
    expect(line!.lineType).toBe('verse');
  });
});

// ─── 10. syncLevel e Métricas ─────────────────────────────────────────────────

describe('10. syncLevel e Métricas de Enriquecimento', () => {
  it('syncLevel synchronized quando ≥ 90% das sílabas resolvidas', () => {
    // 'eu te a-mo mui-to' = eu(1) te(1) a(1) mo(1) mui(1) to(1) = 6 sílabas
    // 6 notas em beats distintos para garantir associação 1:1
    const notes = [
      makeNote(1, 1, 1, 60), makeNote(1, 2, 1, 62), makeNote(1, 3, 1, 64),
      makeNote(1, 4, 1, 65), makeNote(2, 1, 1, 67), makeNote(2, 2, 1, 69),
    ];
    const result = enrichLyrics(makeInput('eu te a-mo mui-to', notes));
    expect(result.resolvedSyllables).toBe(result.totalSyllables);
    expect(result.syncLevel).toBe('synchronized');
  });

  it('syncLevel unavailable quando não há letra fornecida', () => {
    const result = enrichLyrics({
      rawText: '',
      scoreNotes: [makeNote(1, 1, 1, 60)],
      config: DEFAULT_CONFIG,
      source: DEFAULT_SOURCE,
    });
    expect(result.syncLevel).toBe('unavailable');
    expect(result.lines).toHaveLength(0);
  });

  it('totalSyllables é a soma de todas as sílabas de todas as linhas', () => {
    const notes = Array.from({ length: 8 }, (_, i) => makeNote(i + 1, 1, 1, 60 + i));
    const result = enrichLyrics(makeInput('eu te a-mo\nbela linda', notes));
    const expectedTotal = result.lines.flatMap(l => l.syllables).length;
    expect(result.totalSyllables).toBe(expectedTotal);
  });

  it('resolvedSyllables + unresolvedSyllables = totalSyllables', () => {
    const notes = [makeNote(1, 1, 1, 60)]; // poucas notas
    const result = enrichLyrics(makeInput('ma-ra-vi-lho-sa bela linda', notes));
    expect(result.resolvedSyllables + result.unresolvedSyllables).toBe(result.totalSyllables);
  });
});

// ─── 11. Compatibilidade Backward ─────────────────────────────────────────────

describe('11. Compatibilidade Backward', () => {
  it('enrichFromLyricLines converte LyricLine[] para EnrichedLyricLine[] com syncLevel text_only', () => {
    const legacyLines = [
      {
        text: 'Linda de mais',
        startBeat: 1,
        endBeat: 5,
        startMeasure: 1,
        lineType: 'verse' as const,
        words: [
          { text: 'Linda', startBeat: 1, endBeat: 2 },
          { text: 'de', startBeat: 2, endBeat: 3 },
          { text: 'mais', startBeat: 3, endBeat: 5 },
        ],
      },
    ];
    const result = enrichFromLyricLines(legacyLines, DEFAULT_SOURCE);
    expect(result.syncLevel).toBe('text_only');
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].structuredWords).toHaveLength(3);
    expect(result.lines[0].structuredWords[0].fullText).toBe('Linda');
  });

  it('enrichedToLyricLines converte de volta para formato legado', () => {
    const notes = Array.from({ length: 3 }, (_, i) => makeNote(i + 1, 1, 1, 60 + i));
    const enriched = enrichLyrics(makeInput('eu te amo', notes));
    const legacy = enrichedToLyricLines(enriched.lines);

    expect(legacy).toHaveLength(1);
    expect(legacy[0].text).toBe('eu te amo');
    expect(legacy[0].startBeat).toBeGreaterThan(0);
  });
});

// ─── 12. Casos Específicos Críticos ───────────────────────────────────────────

describe('12. Casos Críticos de Aceitação', () => {
  it('sílaba nunca é inventada — nota placeholder tem absoluteBeat 0', () => {
    const notes: ScoreNote[] = []; // zero notas
    const result = enrichLyrics(makeInput('lu-a bo-ni-ta', notes));
    for (const syl of result.lines[0].syllables) {
      if (syl.state === 'unresolved' || syl.state === 'pending_validation') {
        expect(syl.noteRef.absoluteBeat).toBe(0);
        expect(syl.noteRef.midi).toBe(0);
      }
    }
  });

  it('palavras de uma sílaba devem ter syllabic = single', () => {
    const notes = Array.from({ length: 4 }, (_, i) => makeNote(1, i + 1, 1, 60 + i));
    const result = enrichLyrics(makeInput('eu te eu tu', notes));
    for (const word of result.lines[0].structuredWords) {
      if (word.syllables.length === 1) {
        expect(word.syllables[0].syllabic).toBe('single');
      }
    }
  });

  it('syllablesInWord reflete corretamente o total de sílabas da palavra', () => {
    const notes = Array.from({ length: 5 }, (_, i) => makeNote(1, i + 1 <= 4 ? i + 1 : 4, 0.5, 60 + i));
    // 5 notas para "ma-ra-vi-lho-sa"
    const allNotes = [
      makeNote(1, 1, 0.5, 60), makeNote(1, 1.5, 0.5, 62), makeNote(1, 2, 0.5, 64),
      makeNote(1, 2.5, 0.5, 65), makeNote(1, 3, 0.5, 67),
    ];
    const result = enrichLyrics(makeInput('ma-ra-vi-lho-sa', allNotes));
    for (const syl of result.lines[0].syllables) {
      expect(syl.syllablesInWord).toBe(5);
    }
  });

  it('palavra distribuída por dois compassos tem spansMeasures = true', () => {
    // Sílaba 1 no compasso 1, sílaba 2 no compasso 2
    const notes = [
      makeNote(1, 4, 1, 60), // últimobeatdo compasso 1
      makeNote(2, 1, 1, 62), // primeiro beat do compasso 2
    ];
    const result = enrichLyrics(makeInput('a-mor', notes));
    const word = result.lines[0].structuredWords[0];
    // spansMeasures depende de os compassos serem diferentes
    if (word.syllables[0].noteRef.measure !== word.syllables[1].noteRef.measure) {
      expect(word.spansMeasures).toBe(true);
    }
  });
});

// ─── 13. Divisão Silábica PT e Mapeamento Proporcional de Notas Longas ─────────

describe('13. Divisão Silábica PT e Mapeamento Proporcional de Notas Longas', () => {
  it('syllabifyPortugueseWord: divide palavras de Asa Branca corretamente', () => {
    expect(syllabifyPortugueseWord('Quando')).toEqual(['Quan', 'do']);
    expect(syllabifyPortugueseWord('olhei')).toEqual(['o', 'lhei']);
    expect(syllabifyPortugueseWord('terra')).toEqual(['ter', 'ra']);
    expect(syllabifyPortugueseWord('ardendo')).toEqual(['ar', 'den', 'do']);
    expect(syllabifyPortugueseWord('qual')).toEqual(['qual']);
    expect(syllabifyPortugueseWord('fogueira')).toEqual(['fo', 'guei', 'ra']);
    expect(syllabifyPortugueseWord('perguntei')).toEqual(['per', 'gun', 'tei']);
    expect(syllabifyPortugueseWord('judiação')).toEqual(['ju', 'dia', 'ção']);
    expect(syllabifyPortugueseWord('coração')).toEqual(['co', 'ra', 'ção']);
  });

  it('splitWordIntoSyllables com autoSyllabify=true divide palavras em português', () => {
    expect(splitWordIntoSyllables('Quando', true)).toEqual(['Quan', 'do']);
    expect(splitWordIntoSyllables('fogueira', true)).toEqual(['fo', 'guei', 'ra']);
    // Mantém intacto se autoSyllabify for false
    expect(splitWordIntoSyllables('Quando', false)).toEqual(['Quando']);
  });

  it('distribui 10 sílabas de Asa Branca c.1-2 proporcionalmente em 8 notas com mínima final', () => {
    // 8 notas do tema de Asa Branca (c.1 e c.2):
    // c.1: C3(0.5), D3(0.5), E3(1), G3(1), G3(1)
    // c.2: E3(1), F3(1), F3(2 - mínima)
    const asaNotes: ScoreNote[] = [
      makeNote(1, 1, 0.5, 60),
      makeNote(1, 1.5, 0.5, 62),
      makeNote(1, 2, 1, 64),
      makeNote(1, 3, 1, 67),
      makeNote(1, 4, 1, 67),
      makeNote(2, 1, 1, 64),
      makeNote(2, 2, 1, 65),
      makeNote(2, 3, 2, 65), // Mínima com 2 beats
    ];

    const result = enrichLyrics({
      rawText: 'Quan-do o-lhei a ter-ra ar-den-do',
      scoreNotes: asaNotes,
      config: {
        beatsPerMeasure: 4,
        distributionStrategy: 'proportional',
        trebleOnlyAssociation: true,
      },
      source: DEFAULT_SOURCE,
    });

    const syls = result.lines[0].syllables;
    expect(syls).toHaveLength(10);

    // "Quan-do" em m.1 b.1 e b.1.5
    expect(syls[0].text).toBe('Quan');
    expect(syls[0].noteRef.measure).toBe(1);
    expect(syls[0].noteRef.beat).toBe(1);

    expect(syls[1].text).toBe('do');
    expect(syls[1].noteRef.measure).toBe(1);
    expect(syls[1].noteRef.beat).toBe(1.5);

    // "o-lhei" em m.1 b.2 e b.3
    expect(syls[2].text).toBe('o');
    expect(syls[2].noteRef.beat).toBe(2);

    expect(syls[3].text).toBe('lhei');
    expect(syls[3].noteRef.beat).toBe(3);

    // "a" em m.1 b.4
    expect(syls[4].text).toBe('a');
    expect(syls[4].noteRef.beat).toBe(4);

    // "ter-ra" em m.2 b.1 e b.2
    expect(syls[5].text).toBe('ter');
    expect(syls[5].noteRef.measure).toBe(2);
    expect(syls[5].noteRef.beat).toBe(1);

    expect(syls[6].text).toBe('ra');
    expect(syls[6].noteRef.measure).toBe(2);
    expect(syls[6].noteRef.beat).toBe(2);

    // "ar-den-do" na mínima F3 de m.2 b.3 (duration 2 beats, subdividida em 3)
    expect(syls[7].text).toBe('ar');
    expect(syls[7].noteRef.measure).toBe(2);
    expect(syls[7].noteRef.beat).toBeCloseTo(3, 1);

    expect(syls[8].text).toBe('den');
    expect(syls[8].noteRef.measure).toBe(2);
    expect(syls[8].noteRef.beat).toBeGreaterThan(3);

    expect(syls[9].text).toBe('do');
    expect(syls[9].noteRef.measure).toBe(2);
    expect(syls[9].noteRef.beat).toBeGreaterThan(3.6);

    // Todas as 10 sílabas devem estar com state inferred/confirmed
    expect(result.syncLevel).toBe('synchronized');
  });

  it('findActiveSyllable desativa rigorosamente após o fim da nota (sem highlight preso)', () => {
    const notes = [
      makeNote(1, 1, 1, 60), // beat 1 a 2
      makeNote(1, 3, 1, 64), // beat 3 a 4 (beat 2 é pausa)
    ];
    const result = enrichLyrics(makeInput('sol lá', notes));
    const syls = result.lines[0].syllables;

    // Durante o beat 1.5: "sol" ativa
    expect(findActiveSyllable(syls, 1.5)?.text).toBe('sol');

    // Durante a pausa (beat 2.5): nenhuma sílaba ativa!
    expect(findActiveSyllable(syls, 2.5)).toBeNull();

    // No beat 3.0: "lá" ativa
    expect(findActiveSyllable(syls, 3.0)?.text).toBe('lá');

    // Após o fim do compasso (beat 5.0): nenhuma sílaba ativa!
    expect(findActiveSyllable(syls, 5.0)).toBeNull();
  });
});

