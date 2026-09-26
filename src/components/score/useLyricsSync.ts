/**
 * useLyricsSync.ts
 *
 * Hook de domínio e apresentação para sincronização de letras no Repertório.
 * Sincroniza a posição musical exata (Áudio -> Posição Musical -> Partitura -> Letra)
 * suportando modo Reprodução contínuo e Modo Prática / Espera (Wait Mode).
 *
 * Não cria temporizadores independentes: consome a referência de tempo unificada da partitura.
 */

import { useMemo } from 'react';
import type { LyricLine, SongSection } from '../../core/repertoireTypes';
import { findActiveSection } from '../../core/repertoireTypes';

export interface LyricsSyncState {
  /** Se a obra atual possui letra estruturada */
  hasLyrics: boolean;
  /** Linha atualmente ativa (em foco) */
  activeLine: LyricLine | null;
  /** Índice da linha ativa no array de lyrics (-1 se em introdução ou sem letra) */
  activeLineIndex: number;
  /** Linha anterior para contexto pedagógico */
  previousLine: LyricLine | null;
  /** Próxima linha para antecipação de leitura */
  nextLine: LyricLine | null;
  /** Seção musical ativa (ex: Intro, Verso, Refrão, Solo) */
  currentSection: SongSection | null;
  /** Rótulo textual da seção atual formatado para exibição */
  sectionLabel: string;
  /** Progresso normalizado (0.0 a 1.0) dentro da linha ativa */
  lineProgress: number;
  /** Índice da palavra ativa se houver divisão por palavras/sílabas */
  activeWordIndex: number;
  /** Indica se está em introdução instrumental antes do início da letra */
  isIntro: boolean;
  /** Total de linhas da letra */
  totalLines: number;
}

export interface LyricsSyncInput {
  lyrics?: LyricLine[];
  sections?: SongSection[];
  currentBeat: number;
  currentMeasure: number;
  isPlaying?: boolean;
  isWaitMode?: boolean;
}

/**
 * Função pura de cálculo do estado da letra sincronizada.
 * Permite testes unitários rápidos e determinísticos sem dependência de ciclo de renderização.
 */
export function calculateLyricsSyncState({
  lyrics,
  sections = [],
  currentBeat,
  currentMeasure,
}: LyricsSyncInput): LyricsSyncState {
  if (!lyrics || lyrics.length === 0) {
    return {
      hasLyrics: false,
      activeLine: null,
      activeLineIndex: -1,
      previousLine: null,
      nextLine: null,
      currentSection: null,
      sectionLabel: '',
      lineProgress: 0,
      activeWordIndex: -1,
      isIntro: false,
      totalLines: 0,
    };
  }

  const totalLines = lyrics.length;
  const firstLine = lyrics[0];

  // 1. Verifica se estamos antes do início da primeira linha (Introdução)
  const isIntro = currentBeat < firstLine.startBeat && currentMeasure < firstLine.startMeasure;

  let activeLineIndex = -1;
  let activeLine: LyricLine | null = null;

  if (isIntro) {
    activeLineIndex = -1;
    activeLine = null;
  } else {
    // 2. Busca pela linha ativa considerando o intervalo até a próxima linha (zero dead-zones)
    for (let i = 0; i < lyrics.length; i++) {
      const line = lyrics[i];
      const nextLine = lyrics[i + 1];
      const effectiveEnd = nextLine ? nextLine.startBeat : (line.endBeat || line.startBeat + 4);

      if (currentBeat >= line.startBeat && currentBeat < effectiveEnd) {
        activeLineIndex = i;
        activeLine = line;
        break;
      }
    }

    // Se passou da última linha, fixa na última linha
    if (activeLineIndex === -1 && currentBeat >= lyrics[lyrics.length - 1].startBeat) {
      activeLineIndex = lyrics.length - 1;
      activeLine = lyrics[activeLineIndex];
    }

    // Fallback por compasso se beat não encontrou correspondência
    if (activeLineIndex === -1) {
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentMeasure >= lyrics[i].startMeasure) {
          activeLineIndex = i;
          activeLine = lyrics[i];
          break;
        }
      }
    }

    // Se ainda for nulo (mas não é intro), assume a primeira linha
    if (activeLineIndex === -1) {
      activeLineIndex = 0;
      activeLine = lyrics[0];
    }
  }

  // 3. Determina linhas de contexto (anterior e posterior)
  const previousLine = activeLineIndex > 0 ? lyrics[activeLineIndex - 1] : null;
  const nextLine = isIntro
    ? lyrics[0]
    : activeLineIndex >= 0 && activeLineIndex < lyrics.length - 1
    ? lyrics[activeLineIndex + 1]
    : null;

  // 4. Calcula progresso dentro da linha ativa (0 a 1)
  let lineProgress = 0;
  let activeWordIndex = -1;

  if (activeLine) {
    const lineStart = activeLine.startBeat;
    const lineEnd = activeLine.endBeat || (activeLineIndex < lyrics.length - 1 ? lyrics[activeLineIndex + 1].startBeat : lineStart + 4);
    const span = Math.max(1, lineEnd - lineStart);
    const elapsed = Math.max(0, currentBeat - lineStart);
    lineProgress = Math.min(1, Math.max(0, elapsed / span));

    // Se houver divisão por palavras/sílabas
    if (activeLine.words && activeLine.words.length > 0) {
      for (let w = 0; w < activeLine.words.length; w++) {
        const word = activeLine.words[w];
        const wStart = word.startBeat ?? (lineStart + (w / activeLine.words.length) * span);
        const wEnd = word.endBeat ?? (lineStart + ((w + 1) / activeLine.words.length) * span);

        if (currentBeat >= wStart && currentBeat < wEnd) {
          activeWordIndex = w;
          break;
        } else if (currentBeat >= wEnd) {
          activeWordIndex = w;
        }
      }
      if (activeWordIndex === -1 && currentBeat >= lineStart) {
        activeWordIndex = 0;
      }
    }
  }

  // 5. Identifica Seção Musical atual
  const sectionFromMeasure = findActiveSection(sections, currentMeasure);
  let sectionLabel = sectionFromMeasure ? sectionFromMeasure.label : '';

  if (!sectionLabel && activeLine) {
    if (activeLine.lineType === 'chorus') {
      sectionLabel = 'Refrão';
    } else if (activeLine.lineType === 'verse') {
      sectionLabel = 'Verso';
    } else if (activeLine.lineType === 'bridge') {
      sectionLabel = 'Ponte';
    } else if (activeLine.lineType === 'intro') {
      sectionLabel = 'Introdução';
    } else if (activeLine.lineType === 'outro') {
      sectionLabel = 'Finalização';
    } else if (activeLine.section) {
      sectionLabel = activeLine.section;
    }
  }

  if (!sectionLabel && isIntro) {
    sectionLabel = 'Introdução';
  }

  return {
    hasLyrics: true,
    activeLine,
    activeLineIndex,
    previousLine,
    nextLine,
    currentSection: sectionFromMeasure,
    sectionLabel,
    lineProgress,
    activeWordIndex,
    isIntro,
    totalLines,
  };
}

export function useLyricsSync(props: LyricsSyncInput): LyricsSyncState {
  return useMemo(() => {
    return calculateLyricsSyncState(props);
  }, [props.lyrics, props.sections, props.currentBeat, props.currentMeasure]);
}
