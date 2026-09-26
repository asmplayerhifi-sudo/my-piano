/**
 * lyricSyllableTypes.ts
 *
 * Sistema de Tipos para Enriquecimento Musical de Letra por Sílaba e Nota.
 *
 * Inspirado no padrão MusicXML 4.0 (W3C), onde cada <lyric> é vinculado a uma
 * <note> e carrega a posição silábica (<syllabic>: single, begin, middle, end)
 * e extensão (<extend> para melismas).
 *
 * Referências:
 *  - https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/lyric/
 *  - https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/syllabic/
 *
 * Esta estrutura é o contrato central para:
 *  - Partitura Deslizante (ScoreLyricsStrip)
 *  - Modo Prática (SightReadingView)
 *  - Playback/Seek (ScrollingScoreCanvas)
 *  - Importação/Exportação (studioImportExportService)
 *  - Enriquecimento automático (lyricEnrichmentEngine)
 */

import type { ScoreNote } from './coursesData';

// ─── Posição Silábica (MusicXML <syllabic>) ───────────────────────────────────

/**
 * Posição da sílaba dentro de uma palavra com múltiplas sílabas.
 *
 * Compatível com MusicXML <syllabic>:
 * - 'single': palavra de uma sílaba só, ou sílaba não dividida
 * - 'begin': primeira sílaba de uma palavra polissílaba
 * - 'middle': sílaba intermediária
 * - 'end': última sílaba de uma palavra polissílaba
 */
export type SyllabicPosition = 'single' | 'begin' | 'middle' | 'end';

// ─── Estado de Validação da Associação ────────────────────────────────────────

/**
 * Estado de confiança da associação sílaba ↔ nota.
 *
 * - 'confirmed': associação derivada de fonte estruturada (MusicXML, MIDI+texto)
 * - 'inferred': associação calculada por heurística de proporção/duração
 * - 'unresolved': sílaba presente mas nota correspondente não pôde ser determinada
 * - 'pending_validation': marcada para revisão humana ou de fonte externa
 */
export type SyllableAssociationState =
  | 'confirmed'
  | 'inferred'
  | 'unresolved'
  | 'pending_validation';

// ─── Referência a Nota Musical ────────────────────────────────────────────────

/**
 * Referência imutável a uma nota na partitura.
 * Identifica unicamente a posição de uma nota pelo par (measure, beat, midi).
 */
export interface NoteRef {
  /** Número do compasso (1-indexed) */
  measure: number;
  /** Beat dentro do compasso (1-indexed, pode ser fracionário: 1.5 = segundo tempo e meio) */
  beat: number;
  /** Número MIDI da nota */
  midi: number;
  /** Clave da nota */
  clef: 'treble' | 'bass';
  /** Duração em beats (semínima=1, mínima=2, colcheia=0.5, etc.) */
  duration: number;
  /** Beat absoluto (1-indexed, para seek e sincronização temporal) */
  absoluteBeat: number;
}

// ─── Sílaba Musical ──────────────────────────────────────────────────────────

/**
 * Sílaba ou palavra vinculada a uma nota ou posição musical específica.
 *
 * É a unidade atômica do sistema de letra estruturada.
 * Equivale a um <lyric> em MusicXML.
 *
 * Exemplos:
 *   "ma-ra-vi-lho-sa" → 5 LyricSyllable com syllabic: begin, middle, middle, middle, end
 *   "linda"            → 1 LyricSyllable com syllabic: single
 */
export interface LyricSyllable {
  /** Identificador único da sílaba no contexto da música (gerado automaticamente) */
  id: string;

  /** Texto da sílaba (ex: "ma", "ra", "vi") ou palavra inteira (ex: "linda") */
  text: string;

  /**
   * Posição desta sílaba dentro de sua palavra (MusicXML <syllabic>).
   * Controla renderização visual: hyphen entre begin/middle/end, nada em single.
   */
  syllabic: SyllabicPosition;

  /** Referência à nota musical à qual esta sílaba está vinculada */
  noteRef: NoteRef;

  /**
   * Indica se a sílaba tem melisma (sustentada por mais de uma nota).
   * Quando true, a linha de melisma (_____) deve ser desenhada até a próxima sílaba.
   * Equivale a <extend> em MusicXML.
   */
  hasMelisma?: boolean;

  /**
   * Para melismas: beat absoluto até onde o melisma se estende.
   * Corresponde ao início da próxima sílaba ou ao fim da nota mais longa.
   */
  melismaEndBeat?: number;

  /**
   * Estado de validação da associação sílaba ↔ nota.
   * 'unresolved' e 'pending_validation' são sinalizados visualmente.
   */
  state: SyllableAssociationState;

  /**
   * Número do verso/linha da letra ao qual esta sílaba pertence.
   * Equivale ao atributo number em MusicXML <lyric number="1">.
   */
  lyricLine: number;

  /**
   * Indica a qual palavra original esta sílaba pertence.
   * Sílabas da mesma palavra compartilham o mesmo wordId.
   */
  wordId: string;

  /** Índice da sílaba dentro de sua palavra (0-based) */
  syllableIndex: number;

  /** Total de sílabas na palavra desta sílaba */
  syllablesInWord: number;
}

// ─── Palavra com Estrutura Silábica ───────────────────────────────────────────

/**
 * Palavra com estrutura silábica explícita e associação musical completa.
 * Agrupa as sílabas de uma mesma palavra com metadados semânticos.
 *
 * Extensão backward-compatible de LyricWord (repertoireTypes.ts).
 */
export interface StructuredLyricWord {
  /** Identificador único da palavra no contexto da música */
  id: string;
  /** Texto completo da palavra (sem hifenização) */
  fullText: string;
  /** Sílabas individuais da palavra com seus vínculos musicais */
  syllables: LyricSyllable[];
  /** Beat absoluto do início da palavra (= primeiro absoluteBeat das sílabas) */
  startBeat: number;
  /** Beat absoluto do fim da palavra (= absoluteBeat + duration da última sílaba) */
  endBeat: number;
  /** Compasso de início da palavra */
  startMeasure: number;
  /** true se a palavra está distribuída por mais de um compasso */
  spansMeasures?: boolean;
  /** true se a palavra estiver em pausa (sem nota correspondente nesta posição) */
  onRest?: boolean;
  /** Tipo de seção musical onde esta palavra ocorre */
  sectionType?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'instrumental';
}

// ─── Linha Enriquecida com Estrutura Silábica ─────────────────────────────────

/**
 * Linha da letra com enriquecimento silábico completo.
 * Estende LyricLine de repertoireTypes.ts com dados estruturais de nível MusicXML.
 */
export interface EnrichedLyricLine {
  /** Texto visível completo da linha */
  text: string;
  /** Beat absoluto de início (1-indexed) */
  startBeat: number;
  /** Beat absoluto de fim (exclusivo) */
  endBeat: number;
  /** Compasso de início */
  startMeasure: number;
  /** Compasso de fim */
  endMeasure: number;
  /** Seção musical */
  section?: string;
  /** Tipo de linha para estilo visual */
  lineType?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'instrumental';
  /** Palavras com estrutura silábica e associação musical */
  structuredWords: StructuredLyricWord[];
  /** Todas as sílabas da linha em ordem (flatten de structuredWords.syllables) */
  syllables: LyricSyllable[];
  /** Estado geral de enriquecimento da linha */
  enrichmentState: 'complete' | 'partial' | 'text_only' | 'unresolved';
  /** Percentual de sílabas com associação confirmada ou inferida (0–100) */
  syncConfidence: number;
}

// ─── Resultado de Enriquecimento ──────────────────────────────────────────────

/**
 * Resultado completo do processo de enriquecimento de uma música.
 * Representa a estrutura final que alimenta a renderização e o playback.
 */
export interface LyricEnrichmentResult {
  /** Linhas enriquecidas com sílabas e associações musicais */
  lines: EnrichedLyricLine[];
  /** Total de sílabas processadas */
  totalSyllables: number;
  /** Sílabas com associação confirmada ou inferida */
  resolvedSyllables: number;
  /** Sílabas não resolvidas (precisam de validação) */
  unresolvedSyllables: number;
  /**
   * Nível geral de sincronização:
   * - 'synchronized': ≥ 90% confirmado/inferido → exibição plena nota-a-nota
   * - 'partial':  50–89% → exibição por palavra com destaque parcial
   * - 'text_only': < 50% → exibição por linha, sem associação nota-a-nota
   * - 'unavailable': nenhuma letra encontrada ou não autorizada
   */
  syncLevel: 'synchronized' | 'partial' | 'text_only' | 'unavailable';
  /** Proveniência dos dados de letra */
  source: LyricSource;
  /** Data do enriquecimento */
  enrichedAt: string;
}

// ─── Proveniência da Letra ────────────────────────────────────────────────────

/**
 * Descreve a origem e autorização da letra para fins de auditoria e licença.
 */
export interface LyricSource {
  /**
   * Tipo de fonte:
   * - 'musicxml': letra extraída diretamente de arquivo MusicXML
   * - 'structured_midi_text': MIDI com texto sincronizado (karaokê MIDI)
   * - 'manual': inserida manualmente pelo usuário ou curador
   * - 'inferred': derivada heuristicamente de partitura + texto cru
   * - 'unavailable': nenhuma fonte disponível ou autorizada
   */
  type: 'musicxml' | 'structured_midi_text' | 'manual' | 'inferred' | 'unavailable';
  /** URL ou identificador da fonte externa consultada */
  url?: string;
  /** Descrição legível da fonte */
  description?: string;
  /** Licença da fonte (ex: 'public_domain', 'creative_commons', 'traditional') */
  license?: string;
  /** true se a fonte foi validada contra a partitura */
  validated: boolean;
}

// ─── Configuração do Engine de Enriquecimento ─────────────────────────────────

/**
 * Parâmetros de configuração para o LyricEnrichmentEngine.
 */
export interface LyricEnrichmentConfig {
  /** Número de beats por compasso da partitura */
  beatsPerMeasure: number;
  /**
   * Estratégia de distribuição quando a fonte não é estruturada:
   * - 'proportional': distribui sílabas proporcional à duração de cada nota
   * - 'equal': distribui igualmente entre as notas disponíveis
   * - 'onset_only': associa cada sílaba apenas ao onset (ataque) da nota
   */
  distributionStrategy?: 'proportional' | 'equal' | 'onset_only';
  /**
   * Tolerância em beats para aceitar associação inferida.
   * Ex: 0.25 aceita diferenças de até um semicolcheia de desvio.
   */
  inferenceToleranceBeats?: number;
  /**
   * Se true, sílabas não resolvidas são marcadas como 'pending_validation'
   * em vez de 'unresolved', ativando destaque visual diferente.
   */
  markUnresolvedAsPending?: boolean;
  /**
   * Se true, notas de baixo (clave de fá) são ignoradas na associação.
   * Útil para músicas onde a letra segue a voz da mão direita.
   */
  trebleOnlyAssociation?: boolean;
}

// ─── Tipo de entrada para o Engine ────────────────────────────────────────────

/**
 * Entrada para o processo de enriquecimento.
 * O engine aceita texto cru (rawText) ou sílabas pré-divididas.
 */
export interface LyricEnrichmentInput {
  /**
   * Texto cru da letra (linhas separadas por '\n', sílabas com hífen: "ma-ra-vi-lho-sa").
   * Quando fornecido, o engine faz a divisão silábica automaticamente.
   */
  rawText?: string;
  /**
   * Linhas de letra já estruturadas com words (se disponível de fonte externa).
   * Quando fornecido, rawText é ignorado.
   */
  preSyllabifiedLines?: Array<{
    text: string;
    lineType?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro';
    words: Array<{
      text: string;
      syllables: string[];
    }>;
  }>;
  /** Notas da partitura para associação */
  scoreNotes: ScoreNote[];
  /** Configuração do processo */
  config: LyricEnrichmentConfig;
  /** Metadados da fonte */
  source: LyricSource;
}

// ─── Utilitários de Tipo ──────────────────────────────────────────────────────

/**
 * Verifica se uma sílaba está "ativa" em um beat absoluto dado.
 * Considera o beat de início da nota e sua duração.
 */
export function isSyllableActive(syllable: LyricSyllable, absoluteBeat: number): boolean {
  const { absoluteBeat: start, duration } = syllable.noteRef;
  return absoluteBeat >= start && absoluteBeat < start + duration;
}

/**
 * Encontra a sílaba ativa mais próxima para um beat absoluto dado.
 * Retorna a sílaba que começa mais próxima (sem ultrapassar) o beat dado.
 */
export function findActiveSyllable(
  syllables: LyricSyllable[],
  absoluteBeat: number
): LyricSyllable | null {
  let best: LyricSyllable | null = null;
  for (const s of syllables) {
    const start = s.noteRef.absoluteBeat;
    const end = start + s.noteRef.duration;
    if (absoluteBeat >= start && absoluteBeat < end) {
      return s; // match exato
    }
    if (absoluteBeat >= start && (!best || start > best.noteRef.absoluteBeat)) {
      best = s; // candidato mais próximo pelo passado
    }
  }
  return best;
}

/**
 * Encontra a linha enriquecida ativa para um beat absoluto.
 */
export function findActiveEnrichedLine(
  lines: EnrichedLyricLine[],
  absoluteBeat: number
): EnrichedLyricLine | null {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1];
    const effectiveEnd = next ? next.startBeat : line.endBeat;
    if (absoluteBeat >= line.startBeat && absoluteBeat < effectiveEnd) {
      return line;
    }
  }
  if (lines.length > 0 && absoluteBeat >= lines[lines.length - 1].startBeat) {
    return lines[lines.length - 1];
  }
  return null;
}

/**
 * Converte um EnrichedLyricLine[] de volta para o formato LyricLine[]
 * para compatibilidade backward com o ScoreLyricsStrip atual.
 */
export function enrichedToLyricLines(enriched: EnrichedLyricLine[]): import('./repertoireTypes').LyricLine[] {
  return enriched.map(line => ({
    text: line.text,
    startBeat: line.startBeat,
    endBeat: line.endBeat,
    startMeasure: line.startMeasure,
    section: line.section,
    lineType: line.lineType,
    words: line.structuredWords.map(w => ({
      text: w.fullText,
      startBeat: w.startBeat,
      endBeat: w.endBeat,
    })),
  }));
}
