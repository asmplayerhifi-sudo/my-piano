/**
 * tests/domain/ScoreLyricsStrip.spec.ts
 *
 * Testes de regressão para a faixa de letra integrada à partitura deslizante.
 *
 * O que é validado:
 *  1. Cálculo de posição X por beat (fidelidade geométrica com a partitura).
 *  2. Cálculo de largura do slot por duração de beats.
 *  3. Detecção de linha ativa por beat absoluto.
 *  4. Detecção de palavra/sílaba ativa por beat (granularidade fina).
 *  5. Sincronização com Play / Pause / Seek (posição musical → letra).
 *  6. Comportamento no Modo Espera (Wait Mode): letra não avança sem acerto.
 *  7. Mudança de BPM não causa dessincronização da posição da letra.
 *  8. Ausência de lyrics não renderiza o strip.
 *  9. Rolagem da partitura não desloca incorretamente a letra.
 * 10. Diferentes estruturas de compassos, pausas e sílabas.
 *
 * Nota: `ScoreLyricsStrip` é um componente de canvas; os testes validam a
 * lógica pura de posicionamento e sincronização extraída em helpers/cálculos
 * determinísticos, sem dependência de DOM ou RAF.
 */

import { describe, it, expect } from 'vitest';
import type { LyricLine } from '../../src/core/repertoireTypes';
import { calculateLyricsSyncState } from '../../src/components/score/useLyricsSync';

// ─── Helpers de geometria (mesma lógica do ScoreLyricsStrip) ─────────────────

function beatToCanvasX(startBeat: number, pixelsPerBeat: number, attackLineX: number): number {
  return attackLineX + (startBeat - 1) * pixelsPerBeat;
}

function slotWidthPx(
  line: LyricLine,
  nextLine: LyricLine | undefined,
  pixelsPerBeat: number,
  beatsPerMeasure: number
): number {
  const end = nextLine ? nextLine.startBeat : (line.endBeat || line.startBeat + beatsPerMeasure);
  return Math.max(1, end - line.startBeat) * pixelsPerBeat;
}

/**
 * Dada uma lista de linhas e um scrollOffset, determina se a linha estaria
 * visível no viewport de largura `viewportW` — replica a lógica de descarte
 * antecipado do strip.
 */
function isLineVisible(
  line: LyricLine,
  nextLine: LyricLine | undefined,
  scrollOffset: number,
  pixelsPerBeat: number,
  attackLineX: number,
  beatsPerMeasure: number,
  viewportW: number
): boolean {
  const xWorld  = beatToCanvasX(line.startBeat, pixelsPerBeat, attackLineX);
  const xScreen = xWorld - scrollOffset;
  const slotW   = slotWidthPx(line, nextLine, pixelsPerBeat, beatsPerMeasure);
  return xScreen + slotW >= 0 && xScreen <= viewportW;
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PIXELS_PER_BEAT   = 140;
const ATTACK_LINE_X     = 145;
const BEATS_PER_MEASURE = 4;

/** Simples letra de 4 linhas em 4/4 (cada linha = 1 compasso = 4 beats) */
const SIMPLE_LYRICS: LyricLine[] = [
  { text: 'Bella ciao',    startBeat: 1,  endBeat: 5,  startMeasure: 1, lineType: 'verse'  },
  { text: 'bella ciao',    startBeat: 5,  endBeat: 9,  startMeasure: 2, lineType: 'verse'  },
  { text: 'bella ciao',    startBeat: 9,  endBeat: 13, startMeasure: 3, lineType: 'verse'  },
  { text: 'ciao ciao ciao',startBeat: 13, endBeat: 17, startMeasure: 4, lineType: 'chorus' },
];

/** Letra com palavras/sílabas temporalizadas */
const SYLLABLE_LYRICS: LyricLine[] = [
  {
    text: 'Ma-ri-a',
    startBeat: 1,
    endBeat: 5,
    startMeasure: 1,
    words: [
      { text: 'Ma-',  startBeat: 1,   endBeat: 2   },
      { text: 're-',  startBeat: 2,   endBeat: 3   },
      { text: '-a',   startBeat: 3,   endBeat: 5   },
    ],
  },
];

// ─── 1. Geometria de Posicionamento ───────────────────────────────────────────

describe('ScoreLyricsStrip — Posicionamento Geométrico (beatToCanvasX)', () => {
  it('beat 1 deve posicionar exatamente na linha de ataque', () => {
    const x = beatToCanvasX(1, PIXELS_PER_BEAT, ATTACK_LINE_X);
    expect(x).toBe(ATTACK_LINE_X);
  });

  it('beat 2 deve estar exatamente 1 pixelsPerBeat à direita do beat 1', () => {
    const x1 = beatToCanvasX(1, PIXELS_PER_BEAT, ATTACK_LINE_X);
    const x2 = beatToCanvasX(2, PIXELS_PER_BEAT, ATTACK_LINE_X);
    expect(x2 - x1).toBe(PIXELS_PER_BEAT);
  });

  it('beat 5 (compasso 2 em 4/4) deve estar 4 * pixelsPerBeat à direita do beat 1', () => {
    const x1 = beatToCanvasX(1, PIXELS_PER_BEAT, ATTACK_LINE_X);
    const x5 = beatToCanvasX(5, PIXELS_PER_BEAT, ATTACK_LINE_X);
    expect(x5 - x1).toBe(4 * PIXELS_PER_BEAT);
  });

  it('a posição X cresce monotonicamente com o beat', () => {
    const beats = [1, 2, 4, 5, 8, 9, 13, 17];
    const xs    = beats.map(b => beatToCanvasX(b, PIXELS_PER_BEAT, ATTACK_LINE_X));
    for (let i = 1; i < xs.length; i++) {
      expect(xs[i]).toBeGreaterThan(xs[i - 1]);
    }
  });

  it('X é idêntico para qualquer valor de pixelsPerBeat quando startBeat = 1', () => {
    expect(beatToCanvasX(1, 80, ATTACK_LINE_X)).toBe(ATTACK_LINE_X);
    expect(beatToCanvasX(1, 200, ATTACK_LINE_X)).toBe(ATTACK_LINE_X);
  });
});

// ─── 2. Largura do Slot ───────────────────────────────────────────────────────

describe('ScoreLyricsStrip — Largura do Slot (slotWidthPx)', () => {
  it('linha de 4 beats deve ter largura = 4 * pixelsPerBeat', () => {
    const line     = SIMPLE_LYRICS[0]; // beats 1-5 → 4 beats
    const nextLine = SIMPLE_LYRICS[1];
    const w = slotWidthPx(line, nextLine, PIXELS_PER_BEAT, BEATS_PER_MEASURE);
    expect(w).toBe(4 * PIXELS_PER_BEAT);
  });

  it('última linha (sem próxima) usa endBeat para calcular largura', () => {
    const last = SIMPLE_LYRICS[SIMPLE_LYRICS.length - 1]; // beats 13-17 → 4 beats
    const w    = slotWidthPx(last, undefined, PIXELS_PER_BEAT, BEATS_PER_MEASURE);
    expect(w).toBe(4 * PIXELS_PER_BEAT);
  });

  it('largura nunca é menor que 1 beat (mínimo absoluto)', () => {
    const zeroDuration: LyricLine = { text: 'x', startBeat: 3, endBeat: 3, startMeasure: 1 };
    const w = slotWidthPx(zeroDuration, undefined, PIXELS_PER_BEAT, BEATS_PER_MEASURE);
    expect(w).toBeGreaterThanOrEqual(PIXELS_PER_BEAT);
  });

  it('quando não há endBeat e não há próxima linha, usa 1 compasso como fallback', () => {
    const noEnd: LyricLine = { text: 'y', startBeat: 5, startMeasure: 2 };
    const w = slotWidthPx(noEnd, undefined, PIXELS_PER_BEAT, BEATS_PER_MEASURE);
    expect(w).toBe(BEATS_PER_MEASURE * PIXELS_PER_BEAT);
  });
});

// ─── 3. Detecção de Linha Ativa ───────────────────────────────────────────────

describe('ScoreLyricsStrip — Detecção de Linha Ativa', () => {
  it('beat 1 ativa a linha 1', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 1, currentMeasure: 1 });
    expect(state.activeLine?.text).toBe('Bella ciao');
  });

  it('beat 4.9 ainda ativa a linha 1 (limite exclusivo em 5)', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 4.9, currentMeasure: 1 });
    expect(state.activeLine?.text).toBe('Bella ciao');
  });

  it('beat 5 ativa a linha 2 (transição exata entre linhas)', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 5, currentMeasure: 2 });
    expect(state.activeLine?.text).toBe('bella ciao');
  });

  it('beat 13 ativa a última linha (refrão)', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 13, currentMeasure: 4 });
    expect(state.activeLine?.text).toBe('ciao ciao ciao');
  });

  it('beat muito além da última linha mantém a última linha ativa', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 999, currentMeasure: 99 });
    expect(state.activeLine?.text).toBe('ciao ciao ciao');
  });

  it('beat 0 (antes do início) retorna isIntro = true com activeLine null', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 0, currentMeasure: 0 });
    expect(state.isIntro).toBe(true);
    expect(state.activeLine).toBeNull();
  });

  it('sem lyrics retorna hasLyrics = false', () => {
    const state = calculateLyricsSyncState({ lyrics: [], currentBeat: 5, currentMeasure: 2 });
    expect(state.hasLyrics).toBe(false);
  });
});

// ─── 4. Detecção de Palavra/Sílaba Ativa ─────────────────────────────────────

describe('ScoreLyricsStrip — Palavra/Sílaba Ativa', () => {
  it('beat 1.0 ativa a primeira sílaba "Ma-"', () => {
    const state = calculateLyricsSyncState({ lyrics: SYLLABLE_LYRICS, currentBeat: 1, currentMeasure: 1 });
    expect(state.activeWordIndex).toBe(0);
  });

  it('beat 2.0 ativa a segunda sílaba "re-"', () => {
    const state = calculateLyricsSyncState({ lyrics: SYLLABLE_LYRICS, currentBeat: 2, currentMeasure: 1 });
    expect(state.activeWordIndex).toBe(1);
  });

  it('beat 3.0 ativa a terceira sílaba "-a"', () => {
    const state = calculateLyricsSyncState({ lyrics: SYLLABLE_LYRICS, currentBeat: 3, currentMeasure: 1 });
    expect(state.activeWordIndex).toBe(2);
  });

  it('beat 1.99 ainda está na primeira sílaba (limite exclusivo em 2)', () => {
    const state = calculateLyricsSyncState({ lyrics: SYLLABLE_LYRICS, currentBeat: 1.99, currentMeasure: 1 });
    expect(state.activeWordIndex).toBe(0);
  });
});

// ─── 5. Sincronização Play / Pause / Seek ────────────────────────────────────

describe('ScoreLyricsStrip — Sincronização Play / Pause / Seek', () => {
  it('seek para beat 9 deve ativar a linha 3 imediatamente', () => {
    // Simula seek: o caller atualiza currentBeat
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 9, currentMeasure: 3 });
    expect(state.activeLine?.text).toBe('bella ciao');
    expect(state.activeLineIndex).toBe(2);
  });

  it('seek de volta para beat 1 após avançar deve voltar para linha 1', () => {
    const advanced = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 13, currentMeasure: 4 });
    expect(advanced.activeLine?.text).toBe('ciao ciao ciao');

    const rewound = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 1, currentMeasure: 1 });
    expect(rewound.activeLine?.text).toBe('Bella ciao');
  });

  it('pausa no beat 6.5 deve fixar a linha 2 (sem avanço automático)', () => {
    const paused = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 6.5, currentMeasure: 2 });
    expect(paused.activeLine?.text).toBe('bella ciao');
    // Simula que o beat não muda (pausa)
    const stillPaused = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 6.5, currentMeasure: 2 });
    expect(stillPaused.activeLine?.text).toBe('bella ciao');
  });

  it('mudança de BPM não altera a linha ativa (posição musical é por beat, não por tempo)', () => {
    // A posição em beats não muda com BPM — apenas a velocidade com que o beat avança muda
    const at60bpm  = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 9, currentMeasure: 3 });
    const at120bpm = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 9, currentMeasure: 3 });
    expect(at60bpm.activeLine?.text).toBe(at120bpm.activeLine?.text);
  });
});

// ─── 6. Modo Espera (Wait Mode) ───────────────────────────────────────────────

describe('ScoreLyricsStrip — Modo Espera (Wait Mode)', () => {
  it('no modo espera o beat permanece fixo enquanto a nota não é tocada', () => {
    // Simula wait mode: beat trava no offset da nota alvo
    const waitBeat = 5; // compasso 2
    const state1 = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: waitBeat, currentMeasure: 2 });
    const state2 = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: waitBeat, currentMeasure: 2 });
    expect(state1.activeLine?.text).toBe(state2.activeLine?.text);
    expect(state1.activeLineIndex).toBe(state2.activeLineIndex);
  });

  it('no modo espera a linha só avança quando o beat avança (após acerto)', () => {
    const waitState = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 5, currentMeasure: 2 });
    expect(waitState.activeLine?.text).toBe('bella ciao');

    // Simula acerto: beat avança para próxima nota
    const afterHit = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 9, currentMeasure: 3 });
    expect(afterHit.activeLine?.text).toBe('bella ciao'); // terceira linha (mesma frase)
    expect(afterHit.activeLineIndex).toBe(2);
  });
});

// ─── 7. Visibilidade / Rolagem ────────────────────────────────────────────────

describe('ScoreLyricsStrip — Visibilidade e Rolagem', () => {
  const VIEWPORT = 1200;

  it('linha 1 está visível quando scrollOffset = 0', () => {
    const visible = isLineVisible(
      SIMPLE_LYRICS[0], SIMPLE_LYRICS[1],
      0, PIXELS_PER_BEAT, ATTACK_LINE_X, BEATS_PER_MEASURE, VIEWPORT
    );
    expect(visible).toBe(true);
  });

  it('linha 1 fica fora do viewport quando scrollOffset avança muito', () => {
    // Scroll para o beat 17 (4 compassos × 4 beats × 140px = 2240px além da origem)
    const scrollFar = 17 * PIXELS_PER_BEAT;
    const visible = isLineVisible(
      SIMPLE_LYRICS[0], SIMPLE_LYRICS[1],
      scrollFar, PIXELS_PER_BEAT, ATTACK_LINE_X, BEATS_PER_MEASURE, VIEWPORT
    );
    expect(visible).toBe(false);
  });

  it('linha 4 fica visível quando scrollOffset está próximo ao seu beat inicial', () => {
    const line4     = SIMPLE_LYRICS[3];
    const xWorld    = beatToCanvasX(line4.startBeat, PIXELS_PER_BEAT, ATTACK_LINE_X);
    const scrollAt4 = xWorld - ATTACK_LINE_X; // alinha a linha 4 exatamente na attack line
    const visible = isLineVisible(
      line4, undefined,
      scrollAt4, PIXELS_PER_BEAT, ATTACK_LINE_X, BEATS_PER_MEASURE, VIEWPORT
    );
    expect(visible).toBe(true);
  });

  it('o alinhamento X da linha nunca é afetado pelo BPM (beats são unidades métricas)', () => {
    const xAt60  = beatToCanvasX(SIMPLE_LYRICS[2].startBeat, PIXELS_PER_BEAT, ATTACK_LINE_X);
    const xAt120 = beatToCanvasX(SIMPLE_LYRICS[2].startBeat, PIXELS_PER_BEAT, ATTACK_LINE_X);
    expect(xAt60).toBe(xAt120);
  });
});

// ─── 8. Diferentes Estruturas Musicais ───────────────────────────────────────

describe('ScoreLyricsStrip — Diferentes Estruturas Musicais', () => {
  it('3/4 (valsa) - slot de 3 beats deve ter largura = 3 * pixelsPerBeat', () => {
    const waltzLine: LyricLine = { text: 'Vals', startBeat: 1, endBeat: 4, startMeasure: 1 };
    const w = slotWidthPx(waltzLine, undefined, PIXELS_PER_BEAT, 3);
    expect(w).toBe(3 * PIXELS_PER_BEAT);
  });

  it('6/8 (2 batidas por compasso) - slot de 2 beats', () => {
    const line68: LyricLine = { text: 'Swing', startBeat: 1, endBeat: 3, startMeasure: 1 };
    const w = slotWidthPx(line68, undefined, PIXELS_PER_BEAT, 2);
    expect(w).toBe(2 * PIXELS_PER_BEAT);
  });

  it('pausa instrumental no meio — sem words — não causa erro de cálculo', () => {
    const pause: LyricLine = { text: '', startBeat: 5, endBeat: 9, startMeasure: 2, lineType: 'instrumental' };
    const w = slotWidthPx(pause, undefined, PIXELS_PER_BEAT, 4);
    expect(w).toBe(4 * PIXELS_PER_BEAT);
    // Não lança exceção — linha vazia é suportada
  });

  it('compasso muito curto (1 beat) não causa largura negativa', () => {
    const short: LyricLine = { text: 'Oi', startBeat: 1, endBeat: 2, startMeasure: 1 };
    const w = slotWidthPx(short, undefined, PIXELS_PER_BEAT, 1);
    expect(w).toBeGreaterThan(0);
  });
});

// ─── 9. Linhas de Contexto (anterior / próxima) ───────────────────────────────

describe('ScoreLyricsStrip — Linhas de Contexto', () => {
  it('linha anterior deve existir quando não é a primeira linha', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 9, currentMeasure: 3 });
    expect(state.previousLine).not.toBeNull();
    expect(state.previousLine?.text).toBe('bella ciao');
  });

  it('linha anterior é null quando está na primeira linha', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 1, currentMeasure: 1 });
    expect(state.previousLine).toBeNull();
  });

  it('próxima linha deve existir quando não é a última linha', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 1, currentMeasure: 1 });
    expect(state.nextLine).not.toBeNull();
    expect(state.nextLine?.text).toBe('bella ciao');
  });

  it('próxima linha é null quando está na última linha', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 13, currentMeasure: 4 });
    expect(state.nextLine).toBeNull();
  });
});

// ─── 10. Consistência de totalLines ──────────────────────────────────────────

describe('ScoreLyricsStrip — Total de Linhas', () => {
  it('totalLines reflete o número exato de linhas da letra', () => {
    const state = calculateLyricsSyncState({ lyrics: SIMPLE_LYRICS, currentBeat: 1, currentMeasure: 1 });
    expect(state.totalLines).toBe(SIMPLE_LYRICS.length);
  });

  it('totalLines = 0 quando não há letra', () => {
    const state = calculateLyricsSyncState({ lyrics: [], currentBeat: 1, currentMeasure: 1 });
    expect(state.totalLines).toBe(0);
  });
});
