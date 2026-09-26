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

/**
 * Divide uma palavra em sílabas usando hífen explícito ou mantém inteira.
 * "ma-ra-vi-lho-sa" → ["ma", "ra", "vi", "lho", "sa"]
 * "linda" → ["linda"]
 */
function splitWordIntoSyllables(word: string): string[] {
  const trimmed = word.trim();
  if (!trimmed) return [];
  // Aceita hífen padrão, hífen suave (U+00AD) e travessão suave
  const parts = trimmed.split(/[-\u00AD\u2010]/).map(p => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
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

// ─── Estratégias de Distribuição ──────────────────────────────────────────────

/**
 * Distribui sílabas entre notas usando a estratégia 'equal' (1 sílaba por nota).
 * Retorna um mapa: índice da sílaba → nota correspondente (ou null se excedente).
 */
function distributeEqual(
  syllables: string[],
  notes: ScoreNote[]
): Array<ScoreNote | null> {
  return syllables.map((_, i) => notes[i] ?? null);
}

/**
 * Distribui sílabas entre notas usando a estratégia 'proportional'.
 * Sílabas são consumidas em proporção à duração acumulada das notas.
 * Notas longas (mínima, semibreve) podem conter mais de uma sílaba.
 */
function distributeProportional(
  syllables: string[],
  notes: ScoreNote[]
): Array<ScoreNote | null> {
  if (notes.length === 0) return syllables.map(() => null);
  if (syllables.length <= notes.length) {
    // Mais notas que sílabas: distribuição direta com melisma implícito
    return distributeEqual(syllables, notes);
  }

  // Mais sílabas que notas: distribui proporcionalmente pela duração
  const totalDuration = notes.reduce((acc, n) => acc + n.duration, 0);
  const result: Array<ScoreNote | null> = new Array(syllables.length).fill(null);

  let syllableOffset = 0;
  for (let ni = 0; ni < notes.length; ni++) {
    const note = notes[ni];
    const proportion = note.duration / totalDuration;
    // Quantas sílabas esta nota suporta?
    const shareCount = ni === notes.length - 1
      ? syllables.length - syllableOffset
      : Math.max(1, Math.round(proportion * syllables.length));

    const end = Math.min(syllableOffset + shareCount, syllables.length);
    for (let si = syllableOffset; si < end; si++) {
      result[si] = note;
    }
    syllableOffset = end;
    if (syllableOffset >= syllables.length) break;
  }
  return result;
}

/**
 * Distribui sílabas usando a estratégia 'onset_only' (estritamente 1 sílaba por onset).
 * Idêntico ao 'equal' mas sem melismas automáticos.
 */
function distributeOnsetOnly(
  syllables: string[],
  notes: ScoreNote[]
): Array<ScoreNote | null> {
  return distributeEqual(syllables, notes);
}

// ─── Builder de Sílaba ─────────────────────────────────────────────────────────

function buildSyllable(
  text: string,
  syllabic: SyllabicPosition,
  note: ScoreNote | null,
  beatsPerMeasure: number,
  lyricLineIndex: number,
  wordId: string,
  syllableIndex: number,
  syllablesInWord: number,
  config: LyricEnrichmentConfig
): LyricSyllable {
  let state: SyllableAssociationState;
  let noteRef: NoteRef;

  if (note) {
    state = 'inferred';
    noteRef = noteToRef(note, beatsPerMeasure);
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
 *
 * Um melisma ocorre quando várias notas consecutivas sustentam a mesma sílaba.
 */
function annotateMelismas(
  syllables: LyricSyllable[],
  noteAssignment: Array<ScoreNote | null>,
  beatsPerMeasure: number
): void {
  for (let i = 0; i < syllables.length - 1; i++) {
    const curr = syllables[i];
    const next = syllables[i + 1];

    if (!curr.noteRef.midi || !next.noteRef.midi) continue;

    const currBeat = curr.noteRef.absoluteBeat;
    const nextBeat = next.noteRef.absoluteBeat;

    // Se a próxima sílaba começa após a duração da nota atual, há melisma
    const noteDurationEnd = curr.noteRef.absoluteBeat + curr.noteRef.duration;
    if (nextBeat > noteDurationEnd + 0.01) {
      curr.hasMelisma = true;
      curr.melismaEndBeat = nextBeat;
    }

    // Também marca melisma quando a mesma nota é atribuída a sílabas consecutivas
    const currAssignment = noteAssignment[i];
    const nextAssignment = noteAssignment[i + 1];
    if (currAssignment && nextAssignment && currBeat === nextBeat) {
      // Mesma nota para duas sílabas consecutivas — melisma implícito
      curr.hasMelisma = true;
      curr.melismaEndBeat = nextBeat + next.noteRef.duration;
    }
  }
}

// ─── Processamento de uma Linha ────────────────────────────────────────────────

interface RawLyricLine {
  text: string;
  lineType?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'instrumental';
  startMeasure?: number;
}

function processLine(
  rawLine: RawLyricLine,
  lineIndex: number,
  notes: ScoreNote[],
  allLines: RawLyricLine[],
  config: LyricEnrichmentConfig,
  noteOffset: { value: number }
): EnrichedLyricLine {
  const beatsPerMeasure = config.beatsPerMeasure;
  const strategy = config.distributionStrategy ?? 'proportional';

  // Seleciona notas disponíveis para esta linha
  const associableNotes = filterAssociableNotes(notes, config);
  const dedupedNotes = deduplicateByOnset(associableNotes);

  // Tokeniza a linha em palavras
  const rawWords = tokenizeWords(rawLine.text);

  // Constrói todas as sílabas da linha
  const allLineSyllables: string[] = [];
  const wordBoundaries: Array<{ wordIdx: number; sylCount: number }> = [];

  for (let wi = 0; wi < rawWords.length; wi++) {
    const syls = splitWordIntoSyllables(rawWords[wi]);
    wordBoundaries.push({ wordIdx: wi, sylCount: syls.length });
    allLineSyllables.push(...syls);
  }

  // Seleciona fatia de notas para esta linha
  const notesForLine = dedupedNotes.slice(noteOffset.value);

  // Aplica a estratégia de distribuição
  let assignment: Array<ScoreNote | null>;
  if (strategy === 'proportional') {
    assignment = distributeProportional(allLineSyllables, notesForLine);
  } else if (strategy === 'onset_only') {
    assignment = distributeOnsetOnly(allLineSyllables, notesForLine);
  } else {
    assignment = distributeEqual(allLineSyllables, notesForLine);
  }

  // Avança o offset de notas globais
  const usedNotesCount = assignment.filter(Boolean).length;
  noteOffset.value += usedNotesCount;

  // Constrói StructuredLyricWord[] e LyricSyllable[]
  const structuredWords: StructuredLyricWord[] = [];
  const allSyllables: LyricSyllable[] = [];
  let sylGlobalIdx = 0;

  for (const { wordIdx, sylCount } of wordBoundaries) {
    const wordText = rawWords[wordIdx].replace(/-/g, ''); // texto sem hífens
    const wordId = uid();
    const wordSyllableTexts = splitWordIntoSyllables(rawWords[wordIdx]);
    const wordSyllables: LyricSyllable[] = [];

    for (let si = 0; si < wordSyllableTexts.length; si++) {
      const assignedNote = assignment[sylGlobalIdx] ?? null;
      const syl = buildSyllable(
        wordSyllableTexts[si],
        syllabicPosition(si, sylCount),
        assignedNote,
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
  const enrichedLines: EnrichedLyricLine[] = lines.map((line, idx) => {
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

export { parseRawLyricText, splitWordIntoSyllables, tokenizeWords, syllabicPosition };
