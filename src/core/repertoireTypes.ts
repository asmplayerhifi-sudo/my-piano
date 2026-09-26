/**
 * Contratos de Domínio para a Infraestrutura de Repertório Musical.
 *
 * Responsabilidade: definir os tipos puros que sustentam a extensão do
 * repertório, incluindo sincronização de letra, seções musicais, arranjos,
 * modo de estudo e metadados de autoria.
 *
 * Estes tipos são EXTENSÕES OPCIONAIS do RepertoireSong existente.
 * Nenhum campo existente é alterado ou removido.
 *
 * Integração:
 * - RepertoireSong.extension?: SongExtension (campo único adicionado)
 * - useLyricsSync.ts: usa LyricLine[] + beat atual para sincronização
 * - LyricsSyncPanel.tsx: renderiza LyricLine[] com destaque dinâmico
 * - SectionNavigator.tsx: renderiza SongSection[] e permite seek
 * - ArrangementSelector.tsx: aplica SongArrangement ao AccompanimentStore
 * - StudyModePanel.tsx: usa LoopRange e SongSection[] para modo estudo
 */

import type { AccompanimentStyleId } from './accompanimentStyles';

// ─── Sincronização de Letra ───────────────────────────────────────────────────

/**
 * Palavra ou sílaba individual para karaokê e teleprompter de alta resolução temporal.
 */
export interface LyricWord {
  /** Texto da palavra ou sílaba */
  text: string;
  /** Beat absoluto de início (1-indexed) */
  startBeat?: number;
  /** Beat absoluto de término */
  endBeat?: number;
}

/**
 * Uma linha da letra sincronizada com a partitura.
 * startBeat e endBeat são beats absolutos (não relativos ao compasso).
 *
 * Exemplo: linha "Bella ciao, bella ciao" começa no beat 1 do compasso 5
 * e termina no beat 4 do compasso 6, portanto startBeat=17, endBeat=24
 * em um compasso 4/4.
 */
export interface LyricLine {
  /** Texto visível da linha */
  text: string;
  /** Beat absoluto de início (beat 1 do compasso 1 = beat 1) */
  startBeat: number;
  /** Beat absoluto de fim (exclusivo: a linha termina ANTES deste beat) */
  endBeat: number;
  /** Compasso de início — facilita busca por compasso */
  startMeasure: number;
  /** Identificador de seção a que esta linha pertence */
  section?: string;
  /** Indica se é linha de refrão, verso, bridge, etc. (para estilo visual) */
  lineType?: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'instrumental';
  /** Palavras ou sílabas individuais com temporização fina para teleprompter */
  words?: LyricWord[];
}

// ─── Seções Musicais ─────────────────────────────────────────────────────────

/**
 * Uma seção estrutural da música (introdução, verso, refrão, etc.).
 * Usada para navegação, loop de seção e modo de estudo.
 */
export interface SongSection {
  /** Identificador único da seção */
  id: string;
  /** Rótulo exibido ao usuário */
  label: string;
  /** Compasso de início (1-indexed) */
  startMeasure: number;
  /** Compasso de fim (inclusive) */
  endMeasure: number;
  /** Mudança de andamento dentro desta seção (opcional) */
  tempo?: number;
  /** Dinâmica predominante da seção */
  dynamic?: 'pp' | 'p' | 'mp' | 'mf' | 'f' | 'ff';
  /** Número de repetições padrão desta seção */
  repeatCount?: number;
  /** Ícone sugerido para a UI */
  icon?: 'intro' | 'verse' | 'chorus' | 'bridge' | 'solo' | 'outro' | 'interlude';
}

// ─── Arranjos ─────────────────────────────────────────────────────────────────

/**
 * Um arranjo específico de uma música.
 * Define quais instrumentos/canais estão habilitados e qual estilo de
 * acompanhamento é usado, sem duplicar a partitura.
 */
export interface SongArrangement {
  /** Identificador único do arranjo */
  id: string;
  /** Rótulo exibido ao usuário */
  label: string;
  /** Descrição do arranjo para o usuário */
  description: string;
  /** BPM padrão para este arranjo */
  defaultBpm: number;
  /** Estilo rítmico de acompanhamento a ser aplicado */
  styleId: AccompanimentStyleId;
  /** Canais habilitados por padrão neste arranjo */
  enabledChannels: {
    drums: boolean;
    bass: boolean;
    chords: boolean;
    arpeggio: boolean;
  };
  /** Timbre sugerido para a melodia/partitura */
  melodicTimbre?: string;
  /** Emoji decorativo para a UI */
  icon?: string;
}

// ─── Progressão Harmônica ─────────────────────────────────────────────────────

/**
 * Acorde em uma posição específica da música.
 * Complementa o campo `chords: string[]` existente com posicionamento temporal.
 */
export interface ChordEvent {
  /** Número do compasso (1-indexed) */
  measure: number;
  /** Beat dentro do compasso onde o acorde ocorre */
  beat: number;
  /** Símbolo do acorde (ex: 'Am', 'G7', 'Cmaj7') */
  chord: string;
  /** Duração em beats */
  durationBeats?: number;
}

// ─── Intervalo de Loop para Modo Estudo ──────────────────────────────────────

/** Intervalo de compassos para loop no modo estudo */
export interface LoopRange {
  startMeasure: number;
  endMeasure: number;
  /** Se verdadeiro, o loop repete indefinidamente */
  active: boolean;
}

// ─── Metadados de Autoria e Licença ──────────────────────────────────────────

/**
 * Informações de autoria, fonte e licença de uma música.
 * A aplicação não presume que conteúdo disponível na internet pode ser
 * incorporado livremente — cada música deve ter sua origem registrada.
 */
export interface SongCredits {
  /** Compositor(es) da música */
  composer: string;
  /** Letrista(s), se diferente do compositor */
  lyricist?: string;
  /** Intérprete ou referência original */
  originalArtist?: string;
  /** Autor do arranjo específico desta entrada */
  arrangementAuthor?: string;
  /** Versão do arranjo */
  arrangementVersion?: string;
  /** Fonte da partitura utilizada */
  scoreSource?: string;
  /** Fonte da letra utilizada */
  lyricsSource?: string;
  /**
   * Licença de uso:
   * - public_domain: obra em domínio público (anterior a 1926 ou expirada)
   * - traditional: canção folclórica / anônima / tradição oral
   * - creative_commons: licença Creative Commons com atribuição
   * - original: composição original da aplicação
   */
  license: 'public_domain' | 'traditional' | 'creative_commons' | 'original';
  /** Ano de publicação original */
  publishedYear?: number;
  /** País / contexto cultural de origem */
  origin?: string;
  /** Notas adicionais sobre licença ou uso */
  notes?: string;
}

// ─── Extensão Principal ───────────────────────────────────────────────────────

// ─── Auditoria Musical do Repertório ──────────────────────────────────────────

/**
 * Estado formal de auditoria de uma música no catálogo.
 * Critério 2 do Requisito de Auditoria:
 * - VALIDATED: auditada e validada contra referências confiáveis
 * - CORRECTED: possuía erros (métrica, nota, ordenação) que foram corrigidos
 * - COMPLETED: versão incompleta que foi expandida e completada
 * - ENRICHED: enriquecida com extensões (harmonia, seções, créditos, fontes)
 * - PENDING_VALIDATION: aguardando confirmação de fonte externa
 * - BLOCKED_LICENSE: limitada por restrições legais/direitos autorais
 */
export type SongAuditStatus =
  | 'VALIDATED'
  | 'CORRECTED'
  | 'COMPLETED'
  | 'ENRICHED'
  | 'PENDING_VALIDATION'
  | 'BLOCKED_LICENSE';

export interface SongAuditInfo {
  /** Estado atual da auditoria */
  status: SongAuditStatus;
  /** Data da última auditoria ou revisão */
  auditedAt: string;
  /** Descrição das verificações ou correções realizadas */
  notes: string;
  /** Fontes bibliográficas, musicológicas ou fonográficas consultadas */
  sources: string[];
  /** Verificação de melodia, oitavas e contorno */
  melodyVerified: boolean;
  /** Verificação de harmonia e cifras */
  harmonyVerified: boolean;
  /** Verificação de ritmo, métrica e compassos */
  rhythmVerified: boolean;
  /** Estrutura formal da obra (ex: A-B-A, Intro-Verso-Refrão, Rondó, Tema com Variações) */
  musicalForm?: string;
}

// ─── Extensão Principal ───────────────────────────────────────────────────────

/**
 * Extensão opcional de RepertoireSong.
 *
 * Adicionado como campo `extension?: SongExtension` ao tipo existente,
 * sem quebrar compatibilidade com músicas que não possuem esses dados.
 */
export interface SongExtension {
  /** Letra sincronizada com a partitura, linha a linha */
  lyrics?: LyricLine[];
  /** Seções estruturais da música */
  sections?: SongSection[];
  /** Arranjos disponíveis para esta música */
  arrangements?: SongArrangement[];
  /** Créditos e metadados de autoria */
  credits?: SongCredits;
  /** Progressão harmônica posicionada temporalmente */
  chordProgression?: ChordEvent[];
  /** Informações formais da auditoria musicológica */
  audit?: SongAuditInfo;
}

// ─── Utilitários ──────────────────────────────────────────────────────────────

/**
 * Ordena cronologicamente e de forma determinística os eventos de um scoreTrack.
 * Garante que notas simultâneas estejam contíguas no array e que a linha temporal
 * avance estritamente de forma monotônica, sem saltos para trás.
 */
export function sortScoreTrack<T extends { measure?: number; beat?: number; duration?: number; clef?: string; midi?: number }>(
  notes: T[],
  timeSignature: string = '4/4'
): T[] {
  const parts = timeSignature.split('/');
  const num = parseInt(parts[0], 10) || 4;
  const den = parseInt(parts[1], 10) || 4;
  let beatsPerMeasure = num;
  if (den === 8 && num >= 6) {
    beatsPerMeasure = num / 3;
  }

  return [...notes].sort((a, b) => {
    const ma = Math.max(1, a.measure || 1);
    const mb = Math.max(1, b.measure || 1);
    const ba = a.beat !== undefined ? Math.max(0, a.beat - 1) : 0;
    const bb = b.beat !== undefined ? Math.max(0, b.beat - 1) : 0;
    const offA = (ma - 1) * beatsPerMeasure + ba;
    const offB = (mb - 1) * beatsPerMeasure + bb;

    if (Math.abs(offA - offB) > 0.001) {
      return offA - offB;
    }
    // No mesmo instante temporal: clave de sol antes de clave de fá
    if (a.clef !== b.clef) {
      return a.clef === 'treble' ? -1 : 1;
    }
    // No mesmo instante e mesma clave: ordenação determinística por pitch
    return (a.midi || 0) - (b.midi || 0);
  });
}

/**
 * Calcula o beat absoluto a partir do número do compasso e beat dentro do compasso.
 * Assume compasso homogêneo (mesma fórmula durante toda a música).
 *
 * @param measure        - Número do compasso (1-indexed)
 * @param beatInMeasure  - Beat dentro do compasso (1-indexed)
 * @param beatsPerMeasure - Número de beats por compasso (ex: 4 para 4/4)
 */
export function toAbsoluteBeat(measure: number, beatInMeasure: number, beatsPerMeasure: number): number {
  return (measure - 1) * beatsPerMeasure + beatInMeasure;
}

/**
 * Encontra a linha de letra correspondente a um beat absoluto.
 *
 * @param lyrics       - Array de LyricLine
 * @param absoluteBeat - Beat absoluto atual
 * @returns A linha ativa, ou null se nenhuma corresponder
 */
export function findActiveLyricLine(
  lyrics: LyricLine[],
  absoluteBeat: number,
  currentMeasure?: number
): LyricLine | null {
  if (!lyrics || lyrics.length === 0) return null;

  // 1. Busca por intervalo temporal contínuo (cobre até o início da próxima linha para evitar lacunas)
  for (let i = 0; i < lyrics.length; i++) {
    const line = lyrics[i];
    const nextLine = lyrics[i + 1];
    const effectiveEnd = nextLine ? nextLine.startBeat : (line.endBeat || line.startBeat + 4);
    if (absoluteBeat >= line.startBeat && absoluteBeat < effectiveEnd) {
      return line;
    }
  }

  // 2. Se o beat estiver além do início da última linha da obra
  if (lyrics.length > 0 && absoluteBeat >= lyrics[lyrics.length - 1].startBeat) {
    return lyrics[lyrics.length - 1];
  }

  // 3. Fallback inteligente por compasso (útil para anacruses ou contagens iniciais)
  if (currentMeasure !== undefined) {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentMeasure >= lyrics[i].startMeasure) {
        return lyrics[i];
      }
    }
  }

  return null;
}

/**
 * Encontra a seção musical correspondente a um compasso.
 *
 * @param sections - Array de SongSection
 * @param measure  - Número do compasso atual
 * @returns A seção ativa, ou null
 */
export function findActiveSection(sections: SongSection[], measure: number): SongSection | null {
  for (const section of sections) {
    if (measure >= section.startMeasure && measure <= section.endMeasure) {
      return section;
    }
  }
  return null;
}

