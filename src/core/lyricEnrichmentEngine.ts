/**
 * lyricEnrichmentEngine.ts
 *
 * Motor de Enriquecimento Musical de Letra por Sílaba e Nota.
 *
 * Responsabilidade: receber a letra (texto cru ou pré-silabificado) e as notas
 * da partitura, e produzir um LyricEnrichmentResult com cada sílaba vinculada
 * à sua nota correspondente (NoteRef), posição silábica (SyllabicPosition) e
 * estado de validação (SyllableAssociationState).
 *
 * Estratégias de distribuição implementadas:
 * - 'proportional': cada sílaba consome notas em proporção à duração acumulada
 * - 'equal': distribui N sílabas entre N notas igualmente
 * - 'onset_only': uma sílaba por nota, sem melisma automático
 *
 * Esta implementação não inventa associações — quando as notas são insuficientes
 * para todas as sílabas, as sílabas excedentes ficam 'unresolved'.
 */

import type { ScoreNote } from './coursesData';
import type {
  LyricEnrichmentInput,
  LyricEnrichmentResult,
  LyricEnrichmentConfig,
  LyricSource,
  EnrichedLyricLine,
  LyricSyllable,
  StructuredLyricWord,
  NoteRef,
  SyllabicPosition,
  SyllableAssociationState,
} from './lyricSyllableTypes';

// ─── Utilitários Internos ──────────────────────────────────────────────────────

/** Gera um ID único leve para sílabas e palavras */
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Converte ScoreNote em NoteRef, calculando o beat absoluto.
 * @param note    - Nota da partitura
 * @param bpm     - Beats por compasso (para cálculo de beat absoluto)
 */
function noteToRef(note: ScoreNote, beatsPerMeasure: number): NoteRef {
  const absoluteBeat = (note.measure - 1) * beatsPerMeasure + note.beat;
  return {
    measure: note.measure,
    beat: note.beat,
    midi: note.midi,
    clef: note.clef,
    duration: note.duration,
    absoluteBeat,
  };
}

/**
 * Determina a posição silábica (MusicXML <syllabic>) com base no índice e total.
 */
function syllabicPosition(index: number, total: number): SyllabicPosition {
  if (total === 1) return 'single';
  if (index === 0) return 'begin';
  if (index === total - 1) return 'end';
  return 'middle';
}

// ─── Divisão Silábica da Língua Portuguesa ──────────────────────────────────

/**
 * Divide uma palavra em português em sílabas fonéticas caso não haja hífens explícitos.
 * Aplica regras gramaticais e fonológicas:
 * - Dígrafos inseparáveis: ch, lh, nh, gu, qu
 * - Dígrafos separáveis: rr, ss, sc, sç, xc
 * - Encontros consonantais inseparáveis: bl, br, cl, cr, dl, dr, fl, fr, gl, gr, pl, pr, tl, tr, vl, vr
 * - Hiatos e ditongos abertos
 * - Consoantes de final de sílaba (l, r, s, z, m, n, x)
 */
function syllabifyPortugueseWord(word: string): string[] {
  if (word.includes('-') || word.includes('\u00AD') || word.includes('\u2010')) {
    return word.split(/[-\u00AD\u2010]/).map(s => s.trim()).filter(Boolean);
  }

  const clean = word.trim();
  if (clean.length <= 2) return [clean];

  const isVowel = (c: string) => /[aeiouáéíóúâêîôûãõàü]/i.test(c);
  const isUnsplittableDigraph = (s: string) => /^(ch|lh|nh|gu|qu)$/i.test(s);
  const isUnsplittableCluster = (s: string) => /^[bcdfgptv][lr]$/i.test(s);

  const syllables: string[] = [];
  let current = '';
  const chars = clean.split('');
  let i = 0;

  while (i < chars.length) {
    current += chars[i];

    if (isVowel(chars[i])) {
      let nextConsonants = '';
      let j = i + 1;
      while (j < chars.length && !isVowel(chars[j])) {
        nextConsonants += chars[j];
        j++;
      }

      if (j === chars.length && nextConsonants.length > 0) {
        current += nextConsonants;
        break;
      }

      if (nextConsonants.length === 0) {
        if (i + 1 < chars.length && isVowel(chars[i + 1])) {
          const pair = (chars[i] + chars[i + 1]).toLowerCase();
          const isHiatus = /[áéíóú]/i.test(chars[i + 1]) ||
                           /^(aa|ee|ii|oo|uu)$/i.test(pair) ||
                           (/^(ia|ie|io|ua|ue|uo)$/i.test(pair) && !/^[gq]u/i.test(current.slice(-2)) && i > 0 && isVowel(chars[i - 1]));
          if (isHiatus) {
            syllables.push(current);
            current = '';
          }
        }
      } else if (nextConsonants.length === 1) {
        syllables.push(current);
        current = '';
      } else if (nextConsonants.length === 2) {
        const pair = nextConsonants.toLowerCase();
        if (isUnsplittableDigraph(pair) || isUnsplittableCluster(pair)) {
          syllables.push(current);
          current = '';
        } else {
          current += nextConsonants[0];
          syllables.push(current);
          current = '';
          i++;
        }
      } else if (nextConsonants.length >= 3) {
        const pairEnd = nextConsonants.slice(-2).toLowerCase();
        if (isUnsplittableCluster(pairEnd) || isUnsplittableDigraph(pairEnd)) {
          current += nextConsonants.slice(0, -2);
          syllables.push(current);
          current = '';
          i += nextConsonants.length - 2;
        } else {
          current += nextConsonants.slice(0, 1);
          syllables.push(current);
          current = '';
          i++;
        }
      }
    }
    i++;
  }

  if (current) {
    if (syllables.length > 0 && !/[aeiouáéíóúâêîôûãõàü]/i.test(current)) {
      syllables[syllables.length - 1] += current;
    } else {
      syllables.push(current);
    }
  }

  return syllables.length > 0 ? syllables : [clean];
}

/**
 * Divide uma palavra em sílabas usando hífen explícito ou (opcionalmente) regras fonéticas.
 * "ma-ra-vi-lho-sa" → ["ma", "ra", "vi", "lho", "sa"]
 * "linda" → ["linda"] (ou ["lin", "da"] se autoSyllabify=true)
 */
function splitWordIntoSyllables(word: string, autoSyllabify = false): string[] {
  const trimmed = word.trim();
  if (!trimmed) return [];
  // Aceita hífen padrão, hífen suave (U+00AD) e travessão suave
  if (trimmed.includes('-') || trimmed.includes('\u00AD') || trimmed.includes('\u2010')) {
    const parts = trimmed.split(/[-\u00AD\u2010]/).map(p => p.trim()).filter(Boolean);
    return parts.length > 0 ? parts : [trimmed];
  }
  if (autoSyllabify) {
    return syllabifyPortugueseWord(trimmed);
  }
  return [trimmed];
}

/**
 * Tokeniza uma linha de texto em palavras, preservando a ordem e ignorando
 * tokens vazios ou de pontuação pura.
 */
function tokenizeWords(line: string): string[] {
  // Divide por espaços, pontuação final, mas preserva hífens internos (sílabas)
  return line
    .replace(/[,.!?;:""''()\[\]]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);
}

/**
 * Filtra notas de baixo se trebleOnlyAssociation estiver ativo.
 * Prioriza clave de sol para associação de letra (voz principal).
 */
function filterAssociableNotes(notes: ScoreNote[], config: LyricEnrichmentConfig): ScoreNote[] {
  if (config.trebleOnlyAssociation) {
    const treble = notes.filter(n => n.clef === 'treble');
    // Se não houver notas de sol, usa todas (partitura monofônica)
    return treble.length > 0 ? treble : notes;
  }
  return notes;
}

/**
 * Remove notas duplicadas no mesmo beat/compasso (acordes: mantém apenas a voz mais aguda).
 * Garante que cada beat de onset receba no máximo uma sílaba.
 */
function deduplicateByOnset(notes: ScoreNote[]): ScoreNote[] {
  const seen = new Map<string, ScoreNote>();
  for (const note of notes) {
    const key = `${note.measure}_${note.beat}`;
    const existing = seen.get(key);
    if (!existing || note.midi > existing.midi) {
      seen.set(key, note);
    }
  }
  // Retorna em ordem de ocorrência original
  return notes.filter(n => seen.get(`${n.measure}_${n.beat}`) === n);
}

// ─── Estrutura de Associação Sílaba ↔ Nota ────────────────────────────────────

export interface SyllableAssignment {
  note: ScoreNote | null;
  subIndex: number;
  subTotal: number;
  hasMelisma?: boolean;
  melismaEndBeat?: number;
}

// ─── Estratégias de Distribuição ──────────────────────────────────────────────

/**
 * Distribui sílabas entre notas usando a estratégia 'equal' (1 sílaba por nota).
 * Retorna um array de SyllableAssignment.
 */
function distributeEqual(
  syllables: string[],
  notes: ScoreNote[]
): SyllableAssignment[] {
  return syllables.map((_, i) => ({
    note: notes[i] ?? null,
    subIndex: 0,
    subTotal: 1,
  }));
}

/**
 * Distribui sílabas entre notas usando a estratégia 'proportional'.
 * - Se syllables == notes: mapeamento 1:1 exato
 * - Se syllables > notes: notas longas (mínimas/semibreves dur >= 1.5) recebem sílabas adicionais com subdivisão temporal
 * - Se syllables < notes: notas restantes estendem a sílaba com melisma
 */
function distributeProportional(
  syllables: string[],
  notes: ScoreNote[],
  beatsPerMeasure = 4
): SyllableAssignment[] {
  if (notes.length === 0) {
    return syllables.map(() => ({ note: null, subIndex: 0, subTotal: 1 }));
  }

  // Caso 1: Quantidade idêntica — 1:1
  if (syllables.length === notes.length) {
    return syllables.map((_, i) => ({ note: notes[i], subIndex: 0, subTotal: 1 }));
  }

  // Caso 2: Mais sílabas que notas (ex: 10 sílabas para 8 notas onde a última é mínima dur=2)
  if (syllables.length > notes.length) {
    const noteCounts = new Array(notes.length).fill(1);
    let remainingSyllables = syllables.length - notes.length;

    // Prioriza notas longas (duration >= 1.5) para receber as sílabas adicionais
    const longNoteIndices = notes
      .map((n, idx) => ({ idx, dur: n.duration }))
      .filter(item => item.dur >= 1.5)
      .sort((a, b) => b.dur - a.dur);

    if (longNoteIndices.length > 0) {
      while (remainingSyllables > 0) {
        longNoteIndices.sort((a, b) => (a.dur / noteCounts[a.idx]) - (b.dur / noteCounts[b.idx]));
        const target = longNoteIndices[longNoteIndices.length - 1];
        noteCounts[target.idx]++;
        remainingSyllables--;
      }
    } else {
      // Se não houver notas com dur >= 1.5, distribui pelas notas com maior razão duration/count
      while (remainingSyllables > 0) {
        let bestIdx = -1;
        let maxRatio = -1;
        for (let i = 0; i < notes.length; i++) {
          const ratio = notes[i].duration / noteCounts[i];
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestIdx = i;
          }
        }
        if (bestIdx >= 0) {
          noteCounts[bestIdx]++;
          remainingSyllables--;
        } else {
          break;
        }
      }
    }

    const result: SyllableAssignment[] = [];
    for (let ni = 0; ni < notes.length; ni++) {
      const count = noteCounts[ni];
      for (let sub = 0; sub < count; sub++) {
        result.push({
          note: notes[ni],
          subIndex: sub,
          subTotal: count,
        });
      }
    }
    return result;
  }

  // Caso 3: Mais notas que sílabas (ex: 5 sílabas para 8 notas)
  // Sílabas são mapeadas proporcionalmente e notas restantes geram melisma
  const result: SyllableAssignment[] = [];
  const notesPerSyl = notes.length / syllables.length;
  for (let si = 0; si < syllables.length; si++) {
    const startNoteIdx = Math.floor(si * notesPerSyl);
    const endNoteIdx = si === syllables.length - 1
      ? notes.length - 1
      : Math.floor((si + 1) * notesPerSyl) - 1;
    const count = Math.max(1, endNoteIdx - startNoteIdx + 1);

    const mainNote = notes[startNoteIdx];
    const lastNote = notes[startNoteIdx + count - 1];
    const hasMelisma = count > 1;
    const melismaEndBeat = hasMelisma && lastNote
      ? (lastNote.measure - 1) * beatsPerMeasure + lastNote.beat + lastNote.duration
      : undefined;

    result.push({
      note: mainNote,
      subIndex: 0,
      subTotal: 1,
      hasMelisma,
      melismaEndBeat,
    });
  }
  return result;
}

/**
 * Distribui sílabas usando a estratégia 'onset_only' (estritamente 1 sílaba por onset).
 */
function distributeOnsetOnly(
  syllables: string[],
  notes: ScoreNote[]
): SyllableAssignment[] {
  return distributeEqual(syllables, notes);
}

// ─── Builder de Sílaba ─────────────────────────────────────────────────────────

function buildSyllable(
  text: string,
  syllabic: SyllabicPosition,
  assigned: SyllableAssignment,
  beatsPerMeasure: number,
  lyricLineIndex: number,
  wordId: string,
  syllableIndex: number,
  syllablesInWord: number,
  config: LyricEnrichmentConfig
): LyricSyllable {
  let state: SyllableAssociationState;
  let noteRef: NoteRef;

  const note = assigned.note;
  if (note) {
    state = 'inferred';
    const baseRef = noteToRef(note, beatsPerMeasure);
    if (assigned.subTotal > 1) {
      const subDur = note.duration / assigned.subTotal;
      const subOffset = assigned.subIndex * subDur;
      noteRef = {
        measure: note.measure,
        beat: Number((note.beat + subOffset).toFixed(3)),
        midi: note.midi,
        clef: note.clef,
        duration: Number(subDur.toFixed(3)),
        absoluteBeat: Number((baseRef.absoluteBeat + subOffset).toFixed(3)),
      };
    } else {
      noteRef = baseRef;
    }
  } else {
    state = config.markUnresolvedAsPending ? 'pending_validation' : 'unresolved';
    // Cria uma NoteRef placeholder com beat 0 para sílabas não resolvidas
    noteRef = {
      measure: 0,
      beat: 0,
      midi: 0,
      clef: 'treble',
      duration: 1,
      absoluteBeat: 0,
    };
  }

  return {
    id: uid(),
    text,
    syllabic,
    noteRef,
    hasMelisma: assigned.hasMelisma,
    melismaEndBeat: assigned.melismaEndBeat,
    state,
    lyricLine: lyricLineIndex,
    wordId,
    syllableIndex,
    syllablesInWord,
  };
}

// ─── Detecção de Melisma ───────────────────────────────────────────────────────

/**
 * Detecta e anota melismas: quando uma sílaba é seguida pela próxima com gap
 * de notas (mais notas entre elas do que sílabas), a sílaba anterior tem melisma.
 */
function annotateMelismas(
  syllables: LyricSyllable[],
  assignment: SyllableAssignment[],
  _beatsPerMeasure?: number
): void {
  for (let i = 0; i < syllables.length; i++) {
    const curr = syllables[i];
    const assigned = assignment[i];
    if (assigned?.hasMelisma && assigned.melismaEndBeat) {
      curr.hasMelisma = true;
      curr.melismaEndBeat = assigned.melismaEndBeat;
    }
  }
}

// ─── Processamento de uma Linha ────────────────────────────────────────────────

interface RawLyricLine {
  text: string;
  lineType?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'instrumental';
  startMeasure?: number;
  endMeasure?: number;
  startBeat?: number;
  endBeat?: number;
  words?: Array<{
    text: string;
    syllables?: string[];
    startBeat?: number;
    endBeat?: number;
  }>;
}

function processLine(
  rawLine: RawLyricLine,
  lineIndex: number,
  notes: ScoreNote[],
  _allLines: RawLyricLine[],
  config: LyricEnrichmentConfig,
  noteOffset: { value: number }
): EnrichedLyricLine {
  const beatsPerMeasure = config.beatsPerMeasure;
  const strategy = config.distributionStrategy ?? 'proportional';
  const autoSyllabify = config.autoSyllabifyPortuguese ?? false;

  // Seleciona notas disponíveis para esta linha
  const associableNotes = filterAssociableNotes(notes, config);
  const dedupedNotes = deduplicateByOnset(associableNotes);

  // Seleciona fatia de notas para esta linha respeitando limites de compasso/beat quando fornecidos
  let notesForLine: ScoreNote[];
  if (rawLine.startBeat !== undefined && rawLine.endBeat !== undefined) {
    notesForLine = dedupedNotes.filter(n => {
      const absBeat = (n.measure - 1) * beatsPerMeasure + n.beat;
      return absBeat >= rawLine.startBeat! - 0.01 && absBeat < rawLine.endBeat! - 0.01;
    });
  } else if (rawLine.startMeasure !== undefined) {
    const endM = rawLine.endMeasure ?? rawLine.startMeasure;
    notesForLine = dedupedNotes.filter(n => n.measure >= rawLine.startMeasure! && n.measure <= endM);
  } else {
    notesForLine = dedupedNotes.slice(noteOffset.value);
  }

  // Tokeniza a linha em palavras
  const rawWords = tokenizeWords(rawLine.text);

  // Constrói todas as sílabas da linha
  const allLineSyllables: string[] = [];
  const wordBoundaries: Array<{ wordIdx: number; sylCount: number }> = [];

  for (let wi = 0; wi < rawWords.length; wi++) {
    const syls = splitWordIntoSyllables(rawWords[wi], autoSyllabify);
    wordBoundaries.push({ wordIdx: wi, sylCount: syls.length });
    allLineSyllables.push(...syls);
  }

  // Aplica a estratégia de distribuição
  let assignment: SyllableAssignment[];
  if (strategy === 'proportional') {
    assignment = distributeProportional(allLineSyllables, notesForLine, beatsPerMeasure);
  } else if (strategy === 'onset_only') {
    assignment = distributeOnsetOnly(allLineSyllables, notesForLine);
  } else {
    assignment = distributeEqual(allLineSyllables, notesForLine);
  }

  // Avança o offset de notas globais
  const usedUniqueNotes = new Set(assignment.map(a => a.note).filter(Boolean));
  noteOffset.value += usedUniqueNotes.size;

  // Constrói StructuredLyricWord[] e LyricSyllable[]
  const structuredWords: StructuredLyricWord[] = [];
  const allSyllables: LyricSyllable[] = [];
  let sylGlobalIdx = 0;

  for (const { wordIdx, sylCount } of wordBoundaries) {
    const wordText = rawWords[wordIdx].replace(/[-\u00AD\u2010]/g, ''); // texto sem hífens
    const wordId = uid();
    const wordSyllableTexts = splitWordIntoSyllables(rawWords[wordIdx], autoSyllabify);
    const wordSyllables: LyricSyllable[] = [];

    for (let si = 0; si < wordSyllableTexts.length; si++) {
      const assigned = assignment[sylGlobalIdx] ?? { note: null, subIndex: 0, subTotal: 1 };
      const syl = buildSyllable(
        wordSyllableTexts[si],
        syllabicPosition(si, sylCount),
        assigned,
        beatsPerMeasure,
        lineIndex,
        wordId,
        si,
        sylCount,
        config
      );
      wordSyllables.push(syl);
      allSyllables.push(syl);
      sylGlobalIdx++;
    }

    // Anota melismas dentro da palavra
    annotateMelismas(wordSyllables, assignment.slice(sylGlobalIdx - sylCount, sylGlobalIdx), beatsPerMeasure);

    const firstResolved = wordSyllables.find(s => s.noteRef.absoluteBeat > 0);
    const lastResolved = [...wordSyllables].reverse().find(s => s.noteRef.absoluteBeat > 0);

    const wordStartBeat = firstResolved?.noteRef.absoluteBeat ?? 0;
    const wordEndBeat = lastResolved
      ? lastResolved.noteRef.absoluteBeat + lastResolved.noteRef.duration
      : wordStartBeat + 1;
    const wordStartMeasure = firstResolved?.noteRef.measure ?? (rawLine.startMeasure ?? 1);

    const word: StructuredLyricWord = {
      id: wordId,
      fullText: wordText,
      syllables: wordSyllables,
      startBeat: wordStartBeat,
      endBeat: wordEndBeat,
      startMeasure: wordStartMeasure,
      spansMeasures: wordSyllables.some(s =>
        s.noteRef.measure !== wordStartMeasure && s.noteRef.measure > 0
      ),
      sectionType: rawLine.lineType as StructuredLyricWord['sectionType'],
    };
    structuredWords.push(word);
  }

  // Anota melismas entre palavras
  annotateMelismas(allSyllables, assignment, beatsPerMeasure);

  // Calcula beats da linha
  const firstSyl = allSyllables.find(s => s.noteRef.absoluteBeat > 0);
  const lastSyl = [...allSyllables].reverse().find(s => s.noteRef.absoluteBeat > 0);
  const lineStartBeat = firstSyl?.noteRef.absoluteBeat ?? ((rawLine.startMeasure ?? 1) - 1) * beatsPerMeasure + 1;
  const lineEndBeat = lastSyl
    ? lastSyl.noteRef.absoluteBeat + lastSyl.noteRef.duration
    : lineStartBeat + beatsPerMeasure;
  const lineStartMeasure = firstSyl?.noteRef.measure ?? (rawLine.startMeasure ?? 1);
  const lineEndMeasure = lastSyl?.noteRef.measure ?? lineStartMeasure;

  // Calcula confiança de sincronização
  const resolvedCount = allSyllables.filter(
    s => s.state === 'confirmed' || s.state === 'inferred'
  ).length;
  const syncConfidence = allSyllables.length > 0
    ? Math.round((resolvedCount / allSyllables.length) * 100)
    : 0;

  let enrichmentState: EnrichedLyricLine['enrichmentState'];
  if (allSyllables.length === 0) {
    enrichmentState = 'text_only';
  } else if (syncConfidence >= 90) {
    enrichmentState = 'complete';
  } else if (syncConfidence >= 50) {
    enrichmentState = 'partial';
  } else if (syncConfidence > 0) {
    enrichmentState = 'partial';
  } else {
    enrichmentState = 'unresolved';
  }

  return {
    text: rawLine.text,
    startBeat: lineStartBeat,
    endBeat: lineEndBeat,
    startMeasure: lineStartMeasure,
    endMeasure: lineEndMeasure,
    lineType: rawLine.lineType,
    structuredWords,
    syllables: allSyllables,
    enrichmentState,
    syncConfidence,
  };
}

// ─── Parsing de Texto Cru ──────────────────────────────────────────────────────

/**
 * Parseia texto cru da letra, detectando marcadores de seção opcionais.
 *
 * Formatos suportados:
 *   [Verso 1]
 *   Linha da letra aqui
 *
 *   [Refrão]
 *   Outra linha aqui
 *
 * Linhas sem marcador herdam o tipo da última seção detectada.
 */
function parseRawLyricText(rawText: string): RawLyricLine[] {
  const lines = rawText.split('\n');
  const result: RawLyricLine[] = [];
  let currentType: RawLyricLine['lineType'] = 'verse';

  const SECTION_PATTERNS: Array<[RegExp, RawLyricLine['lineType']]> = [
    [/\[(intro|introdução|introduction)\]/i,   'intro'],
    [/\[(verso|verse|copla)\s*\d*/i,           'verse'],
    [/\[(refrão|chorus|coro|refrain)\]/i,      'chorus'],
    [/\[(bridge|ponte|middle\s*8)\]/i,         'bridge'],
    [/\[(outro|coda|final)\]/i,                'outro'],
    [/\[(instrumental|solo|interlúdio)\]/i,    'instrumental'],
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detecta marcadores de seção
    let foundSection = false;
    for (const [pattern, type] of SECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        currentType = type;
        foundSection = true;
        break;
      }
    }
    if (foundSection) continue;

    result.push({ text: trimmed, lineType: currentType });
  }

  return result;
}

// ─── API Pública ───────────────────────────────────────────────────────────────

/**
 * Executa o processo completo de enriquecimento de letra.
 *
 * Etapas:
 * 1. Parsing do texto cru ou uso de entrada pré-silabificada
 * 2. Seleção e deduplicação de notas associáveis
 * 3. Distribuição de sílabas por notas (estratégia configurável)
 * 4. Anotação de melismas
 * 5. Cálculo de métricas de sincronização
 * 6. Produção do LyricEnrichmentResult
 */
export function enrichLyrics(input: LyricEnrichmentInput): LyricEnrichmentResult {
  const { scoreNotes, config, source } = input;

  // ── 1. Obtém linhas de texto ─────────────────────────────────────────────────
  let rawLines: RawLyricLine[];

  if (input.preSyllabifiedLines && input.preSyllabifiedLines.length > 0) {
    rawLines = input.preSyllabifiedLines.map(l => ({
      text: l.text,
      lineType: l.lineType,
      startMeasure: l.startMeasure,
      endMeasure: l.endMeasure,
      startBeat: l.startBeat,
      endBeat: l.endBeat,
      words: l.words,
    }));
  } else if (input.rawText && input.rawText.trim()) {
    rawLines = parseRawLyricText(input.rawText);
  } else {
    // Nenhuma letra fornecida
    return {
      lines: [],
      totalSyllables: 0,
      resolvedSyllables: 0,
      unresolvedSyllables: 0,
      syncLevel: 'unavailable',
      source,
      enrichedAt: new Date().toISOString(),
    };
  }

  if (rawLines.length === 0) {
    return {
      lines: [],
      totalSyllables: 0,
      resolvedSyllables: 0,
      unresolvedSyllables: 0,
      syncLevel: 'unavailable',
      source,
      enrichedAt: new Date().toISOString(),
    };
  }

  // ── 2. Prepara notas ordenadas por compasso/beat ──────────────────────────────
  const sortedNotes = [...scoreNotes].sort((a, b) => {
    const beatA = (a.measure - 1) * config.beatsPerMeasure + a.beat;
    const beatB = (b.measure - 1) * config.beatsPerMeasure + b.beat;
    if (Math.abs(beatA - beatB) > 0.001) return beatA - beatB;
    return a.clef === 'treble' ? -1 : 1;
  });

  // ── 3. Processa cada linha de texto ───────────────────────────────────────────
  const noteOffset = { value: 0 };
  const enrichedLines: EnrichedLyricLine[] = rawLines.map((rawLine, idx) =>
    processLine(rawLine, idx, sortedNotes, rawLines, config, noteOffset)
  );

  // ── 4. Calcula estatísticas globais ───────────────────────────────────────────
  const allSyllables = enrichedLines.flatMap(l => l.syllables);
  const totalSyllables = allSyllables.length;
  const resolvedSyllables = allSyllables.filter(
    s => s.state === 'confirmed' || s.state === 'inferred'
  ).length;
  const unresolvedSyllables = totalSyllables - resolvedSyllables;
  const resolvedPercent = totalSyllables > 0
    ? (resolvedSyllables / totalSyllables) * 100
    : 0;

  let syncLevel: LyricEnrichmentResult['syncLevel'];
  if (totalSyllables === 0) {
    syncLevel = 'unavailable';
  } else if (resolvedPercent >= 90) {
    syncLevel = 'synchronized';
  } else if (resolvedPercent >= 50) {
    syncLevel = 'partial';
  } else {
    syncLevel = 'text_only';
  }

  return {
    lines: enrichedLines,
    totalSyllables,
    resolvedSyllables,
    unresolvedSyllables,
    syncLevel,
    source,
    enrichedAt: new Date().toISOString(),
  };
}

/**
 * Cria um LyricEnrichmentResult a partir de LyricLine[] existentes (formato legado),
 * enriquecendo com dados estruturais mínimos (sem associação nota-a-nota).
 * Útil para músicas que possuem letra por linha mas sem partitura completa.
 */
export function enrichFromLyricLines(
  lines: import('./repertoireTypes').LyricLine[],
  source: LyricSource
): LyricEnrichmentResult {
  const enrichedLines: EnrichedLyricLine[] = lines.map((line) => {
    const structuredWords: StructuredLyricWord[] = (line.words ?? []).map(w => ({
      id: uid(),
      fullText: w.text,
      syllables: [],
      startBeat: w.startBeat ?? line.startBeat,
      endBeat: w.endBeat ?? line.endBeat,
      startMeasure: line.startMeasure,
      sectionType: line.lineType as StructuredLyricWord['sectionType'],
    }));

    return {
      text: line.text,
      startBeat: line.startBeat,
      endBeat: line.endBeat,
      startMeasure: line.startMeasure,
      endMeasure: line.startMeasure,
      section: line.section,
      lineType: line.lineType,
      structuredWords,
      syllables: [],
      enrichmentState: structuredWords.length > 0 ? 'text_only' : 'unresolved',
      syncConfidence: 0,
    };
  });

  return {
    lines: enrichedLines,
    totalSyllables: 0,
    resolvedSyllables: 0,
    unresolvedSyllables: 0,
    syncLevel: 'text_only',
    source,
    enrichedAt: new Date().toISOString(),
  };
}

// ─── Exportações de Utilitários ────────────────────────────────────────────────

export { parseRawLyricText, splitWordIntoSyllables, tokenizeWords, syllabicPosition, syllabifyPortugueseWord };
