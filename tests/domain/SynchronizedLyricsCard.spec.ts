/**
 * SynchronizedLyricsCard.spec.ts
 *
 * Suíte de testes unitários para o Card de Letras Sincronizadas do Repertório.
 * Valida os critérios de aceitação:
 * 1. Resolução exata da linha ativa por beat absoluto e compasso;
 * 2. Ausência de lacunas temporais (dead zones) entre versos;
 * 3. Sincronização unificada entre Partitura, Playback e Modo Prática;
 * 4. Estabilidade do Modo Prática / Espera (Wait Mode) sem avanço por tempo isolado;
 * 5. Resolução de palavras/sílabas com temporização de alta resolução;
 * 6. Identificação correta de seções musicais (Intro, Verso, Refrão, Solo);
 * 7. Tratamento robusto de obras puramente instrumentais (sem crash).
 */

import { describe, it, expect } from 'vitest';
import {
  findActiveLyricLine,
  findActiveSection,
  toAbsoluteBeat,
  type LyricLine,
  type SongSection,
} from '../../src/core/repertoireTypes';
import { calculateLyricsSyncState } from '../../src/components/score/useLyricsSync';

describe('Card de Letras Sincronizadas — Domínio & Sincronização', () => {
  const sampleLyrics: LyricLine[] = [
    {
      text: 'Freude, schöner Götterfunken, Tochter aus Elysium,',
      startBeat: 1,
      endBeat: 17,
      startMeasure: 1,
      lineType: 'verse',
      words: [
        { text: 'Freu - de,', startBeat: 1, endBeat: 5 },
        { text: 'schö - ner', startBeat: 5, endBeat: 9 },
        { text: 'Göt - ter - fun - ken,', startBeat: 9, endBeat: 13 },
        { text: 'Toch - ter aus E - ly - si - um,', startBeat: 13, endBeat: 17 },
      ],
    },
    {
      text: 'Wir betreten feuertrunken, Himmlische, dein Heiligtum!',
      startBeat: 17,
      endBeat: 33,
      startMeasure: 5,
      lineType: 'verse',
    },
    {
      text: 'Deine Zauber binden wieder, was die Mode streng geteilt;',
      startBeat: 33,
      endBeat: 49,
      startMeasure: 9,
      lineType: 'bridge',
    },
    {
      text: 'Alle Menschen werden Brüder, wo dein sanfter Flügel weilt.',
      startBeat: 49,
      endBeat: 65,
      startMeasure: 13,
      lineType: 'chorus',
    },
  ];

  const sampleSections: SongSection[] = [
    { id: 'intro', label: 'Introdução', startMeasure: 1, endMeasure: 2, icon: 'intro' },
    { id: 'verse1', label: 'Tema Principal (Estrofe 1)', startMeasure: 3, endMeasure: 6, icon: 'verse' },
    { id: 'bridge', label: 'Ponte Central', startMeasure: 7, endMeasure: 10, icon: 'bridge' },
    { id: 'chorus', label: 'Refrão Triunfal', startMeasure: 11, endMeasure: 16, icon: 'chorus' },
  ];

  describe('1. Resolução de Linha Ativa (findActiveLyricLine)', () => {
    it('deve retornar a primeira linha nos beats iniciais (1..16.99)', () => {
      const lineStart = findActiveLyricLine(sampleLyrics, 1);
      expect(lineStart?.text).toBe(sampleLyrics[0].text);

      const lineMid = findActiveLyricLine(sampleLyrics, 8.5);
      expect(lineMid?.text).toBe(sampleLyrics[0].text);

      const lineBoundary = findActiveLyricLine(sampleLyrics, 16.9);
      expect(lineBoundary?.text).toBe(sampleLyrics[0].text);
    });

    it('deve transicionar exatamente para a segunda linha no beat 17 sem lacunas', () => {
      const line2 = findActiveLyricLine(sampleLyrics, 17);
      expect(line2?.text).toBe(sampleLyrics[1].text);

      const line2Mid = findActiveLyricLine(sampleLyrics, 25);
      expect(line2Mid?.text).toBe(sampleLyrics[1].text);
    });

    it('deve manter a última linha ativa quando o beat ultrapassar o final da partitura', () => {
      const lastLine = findActiveLyricLine(sampleLyrics, 80);
      expect(lastLine?.text).toBe(sampleLyrics[3].text);
    });

    it('deve utilizar fallback por compasso quando fornecido se o beat for atípico', () => {
      const line = findActiveLyricLine(sampleLyrics, -1, 9);
      expect(line?.text).toBe(sampleLyrics[2].text);
    });

    it('deve retornar null se o array de letras estiver vazio ou indefinido', () => {
      expect(findActiveLyricLine([], 5)).toBeNull();
      expect(findActiveLyricLine(undefined as unknown as LyricLine[], 5)).toBeNull();
    });
  });

  describe('2. Resolução de Seções Musicais (findActiveSection)', () => {
    it('deve encontrar a seção correta pelo número do compasso', () => {
      const secIntro = findActiveSection(sampleSections, 1);
      expect(secIntro?.id).toBe('intro');
      expect(secIntro?.label).toBe('Introdução');

      const secVerse = findActiveSection(sampleSections, 4);
      expect(secVerse?.id).toBe('verse1');

      const secChorus = findActiveSection(sampleSections, 14);
      expect(secChorus?.id).toBe('chorus');
    });

    it('deve retornar null caso o compasso esteja fora de qualquer seção', () => {
      expect(findActiveSection(sampleSections, 25)).toBeNull();
    });
  });

  describe('3. Conversão de Compasso/Tempo em Beat Absoluto (toAbsoluteBeat)', () => {
    it('deve calcular corretamente beats para compasso 4/4', () => {
      // Compasso 1, tempo 1 = beat 1
      expect(toAbsoluteBeat(1, 1, 4)).toBe(1);
      // Compasso 1, tempo 4 = beat 4
      expect(toAbsoluteBeat(1, 4, 4)).toBe(4);
      // Compasso 5, tempo 1 = (5 - 1)*4 + 1 = 17
      expect(toAbsoluteBeat(5, 1, 4)).toBe(17);
      // Compasso 13, tempo 1 = (13 - 1)*4 + 1 = 49
      expect(toAbsoluteBeat(13, 1, 4)).toBe(49);
    });

    it('deve calcular corretamente beats para compasso 3/4', () => {
      // Compasso 1, tempo 1 = beat 1
      expect(toAbsoluteBeat(1, 1, 3)).toBe(1);
      // Compasso 2, tempo 1 = 3 + 1 = 4
      expect(toAbsoluteBeat(2, 1, 3)).toBe(4);
      // Compasso 5, tempo 1 = 12 + 1 = 13
      expect(toAbsoluteBeat(5, 1, 3)).toBe(13);
    });
  });

  describe('4. Estado da Letra Sincronizada — Teleprompter & Karaokê Pedagógico', () => {
    it('deve calcular linha ativa, anterior e próxima corretamente', () => {
      const state = calculateLyricsSyncState({
        lyrics: sampleLyrics,
        sections: sampleSections,
        currentBeat: 18,
        currentMeasure: 5,
        isPlaying: true,
        isWaitMode: false,
      });

      expect(state.hasLyrics).toBe(true);
      expect(state.activeLineIndex).toBe(1);
      expect(state.activeLine?.text).toBe(sampleLyrics[1].text);
      expect(state.previousLine?.text).toBe(sampleLyrics[0].text);
      expect(state.nextLine?.text).toBe(sampleLyrics[2].text);
    });

    it('deve identificar estado de introdução antes do início da letra', () => {
      const state = calculateLyricsSyncState({
        lyrics: [
          {
            text: 'Primeira Linha',
            startBeat: 9,
            endBeat: 16,
            startMeasure: 3,
          },
        ],
        sections: sampleSections,
        currentBeat: 2,
        currentMeasure: 1,
        isPlaying: true,
        isWaitMode: false,
      });

      expect(state.isIntro).toBe(true);
      expect(state.activeLine).toBeNull();
      // Em introdução, a próxima linha antecipa a primeira linha que virá
      expect(state.nextLine?.text).toBe('Primeira Linha');
      expect(state.sectionLabel).toBe('Introdução');
    });

    it('deve calcular progresso da linha (lineProgress de 0.0 a 1.0)', () => {
      // Linha 1 vai de startBeat 1 até endBeat 17 (span = 16 beats)
      // No beat 9: (9 - 1) / 16 = 8 / 16 = 0.5 (50%)
      const state = calculateLyricsSyncState({
        lyrics: sampleLyrics,
        sections: sampleSections,
        currentBeat: 9,
        currentMeasure: 3,
        isPlaying: true,
        isWaitMode: false,
      });

      expect(state.lineProgress).toBeCloseTo(0.5, 2);
    });

    it('deve destacar a palavra/sílaba ativa quando words estiver preenchido', () => {
      // Na linha 1:
      // Palavra 0: 1..5
      // Palavra 1: 5..9
      // Palavra 2: 9..13
      // Palavra 3: 13..17
      const state = calculateLyricsSyncState({
        lyrics: sampleLyrics,
        sections: sampleSections,
        currentBeat: 7,
        currentMeasure: 2,
        isPlaying: true,
        isWaitMode: false,
      });

      expect(state.activeWordIndex).toBe(1);
      expect(state.activeLine?.words?.[state.activeWordIndex].text).toBe('schö - ner');
    });

    it('deve tratar com robustez obras puramente instrumentais sem letra', () => {
      const state = calculateLyricsSyncState({
        lyrics: undefined,
        sections: sampleSections,
        currentBeat: 10,
        currentMeasure: 3,
        isPlaying: true,
        isWaitMode: false,
      });

      expect(state.hasLyrics).toBe(false);
      expect(state.activeLine).toBeNull();
      expect(state.activeLineIndex).toBe(-1);
      expect(state.previousLine).toBeNull();
      expect(state.nextLine).toBeNull();
      expect(state.totalLines).toBe(0);
    });
  });

  describe('5. Modo Prática / Espera (Wait Mode) — Estabilidade e Não-Avanço Temporal', () => {
    it('deve manter a letra estritamente travada na nota aguardada enquanto o tempo transcorre', () => {
      // No modo Wait, o beat é determinado pelo offset da nota aguardada.
      // Se a nota aguardada está no compasso 5, beat 17:
      const targetBeat = 17;
      const targetMeasure = 5;

      const stateWaiting = calculateLyricsSyncState({
        lyrics: sampleLyrics,
        sections: sampleSections,
        currentBeat: targetBeat,
        currentMeasure: targetMeasure,
        isPlaying: false, // áudio pausado esperando o aluno
        isWaitMode: true,
      });

      expect(stateWaiting.activeLineIndex).toBe(1);
      expect(stateWaiting.activeLine?.text).toBe(sampleLyrics[1].text);

      // Simula passagem de tempo no ambiente externo (o aluno ainda não tocou):
      // As props NÃO mudam pois a partitura não avançou:
      const stateStillWaiting = calculateLyricsSyncState({
        lyrics: sampleLyrics,
        sections: sampleSections,
        currentBeat: targetBeat,
        currentMeasure: targetMeasure,
        isPlaying: false,
        isWaitMode: true,
      });

      expect(stateStillWaiting.activeLineIndex).toBe(1);
      expect(stateStillWaiting.activeLine?.text).toBe(sampleLyrics[1].text);

      // Agora o aluno toca a nota/acorde com sucesso e a partitura avança para o compasso 9 (beat 33):
      const stateAfterHit = calculateLyricsSyncState({
        lyrics: sampleLyrics,
        sections: sampleSections,
        currentBeat: 33,
        currentMeasure: 9,
        isPlaying: false,
        isWaitMode: true,
      });

      expect(stateAfterHit.activeLineIndex).toBe(2);
      expect(stateAfterHit.activeLine?.text).toBe(sampleLyrics[2].text);
    });
  });
});
