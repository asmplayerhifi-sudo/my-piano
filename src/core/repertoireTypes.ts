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

/**
 * Extensão opcional de RepertoireSong.
 *
 * Adicionado como campo `extension?: SongExtension` ao tipo existente,
 * sem quebrar compatibilidade com músicas que não possuem esses dados.
 *
 * Uma nova música pode ter:
 * - Apenas `lyrics` (sem seções)
 * - Apenas `sections` (sem letra)
 * - `arrangements` sem `chordProgression`
 * - Qualquer combinação desses campos
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
}

// ─── Utilitários ──────────────────────────────────────────────────────────────

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
export function findActiveLyricLine(lyrics: LyricLine[], absoluteBeat: number): LyricLine | null {
  for (const line of lyrics) {
    if (absoluteBeat >= line.startBeat && absoluteBeat < line.endBeat) {
      return line;
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
