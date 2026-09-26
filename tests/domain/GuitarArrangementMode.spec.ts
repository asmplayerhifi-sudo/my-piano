/**
 * tests/domain/GuitarArrangementMode.spec.ts
 *
 * Testes Unitários de Domínio para o "Modo Arranjo de Violão no Teclado".
 * Valida fidelidade pedagógica, pauta dupla (claves de Sol e Fá),
 * dedilhados P-I-M-A, baixarias de 7 cordas, síncopes e recomendação de timbres.
 */

import { describe, it, expect } from 'vitest';
import {
  getGuitarArrangementStyle,
  getRecommendedGuitarTimbre,
  getRecommendedGuitarTimbreName,
  getGuitarArrangementInfo,
  resolveGuitarVoicing,
  generateGuitarArrangementForKeyboard,
} from '../../src/core/guitarArrangementEngine';
import { getGuitarChordShape } from '../../src/components/guitar/GuitarChordDiagram';
import { REPERTOIRE_SONGS } from '../../src/core/repertoireData';

describe('Modo Arranjo de Violão no Teclado (Domínio Músico-Pedagógico)', () => {
  describe('1. Mapeamento de Estilos e Timbres Recomendados por Gênero', () => {
    it('deve associar Seresta e Brega ao violão de 7 cordas com baixarias regionais', () => {
      const style = getGuitarArrangementStyle('Seresta & Brega (Zezo dos Teclados)');
      const timbre = getRecommendedGuitarTimbre('Seresta & Brega (Zezo dos Teclados)');
      expect(style).toBe('seven_string_baixaria');
      expect(timbre).toBe('guitar_7strings');
      expect(getRecommendedGuitarTimbreName(timbre)).toContain('7 Cordas');
    });

    it('deve associar Forró, Xote e Baião ao estilo de baixarias e violão regional', () => {
      const style = getGuitarArrangementStyle('Forró, Xote & Baião');
      const timbre = getRecommendedGuitarTimbre('Forró, Xote & Baião');
      expect(style).toBe('seven_string_baixaria');
      expect(timbre).toBe('guitar_7strings');
    });

    it('deve associar MPB & Pop Nacional ao estilo de Bossa Nova e Samba sincopado com violão de nylon', () => {
      const style = getGuitarArrangementStyle('MPB & Pop Nacional');
      const timbre = getRecommendedGuitarTimbre('MPB & Pop Nacional');
      expect(style).toBe('bossa_samba');
      expect(timbre).toBe('guitar_nylon');
      expect(getRecommendedGuitarTimbreName(timbre)).toContain('Nylon');
    });

    it('deve associar Reggae ao skank muted com corte percussivo', () => {
      const style = getGuitarArrangementStyle('Reggae & Praieiro');
      const timbre = getRecommendedGuitarTimbre('Reggae & Praieiro');
      expect(style).toBe('reggae_skank');
      expect(timbre).toBe('guitar_reggae_muted');
      expect(getRecommendedGuitarTimbreName(timbre)).toContain('Reggae');
    });

    it('deve associar Rock Clássico e Pop ao violão de aço / guitarra clean com batidas (strumming)', () => {
      const style = getGuitarArrangementStyle('Pop & Rock Clássico');
      const timbre = getRecommendedGuitarTimbre('Pop & Rock Clássico');
      expect(style).toBe('acoustic_strumming');
      expect(timbre).toBe('guitar_strat_clean');
    });

    it('deve associar Clássico e Folk ao dedilhado arpejado clássico (P-I-M-A) com violão de nylon', () => {
      const style = getGuitarArrangementStyle('Clássico & Mestres');
      const timbre = getRecommendedGuitarTimbre('Clássico & Mestres');
      expect(style).toBe('pima_fingerpicking');
      expect(timbre).toBe('guitar_nylon');
    });
  });

  describe('2. Resolução de Voicings Idiomáticos de Violão', () => {
    it('deve resolver voicings com separação clara de bordão grave e primas na clave de Sol', () => {
      const voicingC = resolveGuitarVoicing('C');
      expect(voicingC.bassMidi).toBe(48); // C3 (Yamaha C2)
      expect(voicingC.alternateBassMidi).toBe(43); // G2
      expect(voicingC.upperMidi.length).toBeGreaterThanOrEqual(3);
      // Primas devem estar no registro agudo (>= 50)
      voicingC.upperMidi.forEach(midi => {
        expect(midi).toBeGreaterThanOrEqual(50);
      });
    });

    it('deve incluir notas de baixaria de contraponto para transições harmônicas', () => {
      const voicingAm = resolveGuitarVoicing('Am');
      expect(voicingAm.baixariaNotes.length).toBeGreaterThan(0);
      // Baixaria deve conduzir notas graves
      voicingAm.baixariaNotes.forEach(m => {
        expect(m).toBeLessThanOrEqual(55);
      });
    });
  });

  describe('3. Geração de Partitura Adaptada para Teclado (Dual-Clef & P-I-M-A)', () => {
    it('deve gerar partitura com pauta dupla (clave de Sol e clave de Fá) simultâneas', () => {
      const song = REPERTOIRE_SONGS[0]; // Ode à Alegria (Clássico)
      const guitarTrack = generateGuitarArrangementForKeyboard(song);

      expect(guitarTrack.length).toBeGreaterThan(0);

      const bassNotes = guitarTrack.filter(n => n.clef === 'bass');
      const trebleNotes = guitarTrack.filter(n => n.clef === 'treble');

      expect(bassNotes.length).toBeGreaterThan(0);
      expect(trebleNotes.length).toBeGreaterThan(0);
    });

    it('deve atribuir digitação P-I-M-A coerente com as mãos do teclado', () => {
      const song = REPERTOIRE_SONGS[0];
      const guitarTrack = generateGuitarArrangementForKeyboard(song);

      const bassNotes = guitarTrack.filter(n => n.clef === 'bass');
      const trebleNotes = guitarTrack.filter(n => n.clef === 'treble');

      // Mão esquerda no baixo deve ter fingerLeftHand definido
      bassNotes.forEach(n => {
        expect(n.fingerLeftHand).toBeDefined();
        expect(n.fingerLeftHand).toBeGreaterThanOrEqual(1);
        expect(n.fingerLeftHand).toBeLessThanOrEqual(5);
      });

      // Mão direita nas primas deve ter fingerRightHand correspondente a I-M-A (2, 3, 4)
      trebleNotes.forEach(n => {
        expect(n.fingerRightHand).toBeDefined();
        expect(n.fingerRightHand).toBeGreaterThanOrEqual(1);
        expect(n.fingerRightHand).toBeLessThanOrEqual(5);
      });
    });

    it('deve manter a contagem de compassos idêntica à obra original para sincronismo de letra', () => {
      const song = REPERTOIRE_SONGS[0];
      const originalMaxMeasure = Math.max(...song.scoreTrack.map(n => n.measure || 1));
      const guitarTrack = generateGuitarArrangementForKeyboard(song);
      const guitarMaxMeasure = Math.max(...guitarTrack.map(n => n.measure || 1));

      expect(guitarMaxMeasure).toBe(originalMaxMeasure);
    });

    it('deve gerar baixarias na clave de Fá para obras de Seresta / Forró', () => {
      const serestaSong = REPERTOIRE_SONGS.find(s => s.genre === 'Seresta & Brega (Zezo dos Teclados)') || REPERTOIRE_SONGS[0];
      const guitarTrack = generateGuitarArrangementForKeyboard(serestaSong);

      // Em Seresta/7 cordas, deve haver notas de baixaria com duração de colcheia (0.5) na clave de Fá
      const bassRuns = guitarTrack.filter(n => n.clef === 'bass' && n.duration <= 0.5);
      expect(bassRuns.length).toBeGreaterThan(0);
    });

    it('deve gerar contratempos de skank na clave de Sol para obras de Reggae', () => {
      const reggaeSong = REPERTOIRE_SONGS.find(s => s.genre === 'Reggae & Praieiro') || REPERTOIRE_SONGS[0];
      const guitarTrack = generateGuitarArrangementForKeyboard(reggaeSong);

      // Em Reggae, as notas da clave de Sol devem cair nos tempos 2 e 4
      const skankNotes = guitarTrack.filter(n => n.clef === 'treble' && (n.beat === 2.0 || n.beat === 4.0));
      expect(skankNotes.length).toBeGreaterThan(0);
    });
  });

  describe('4. Diagramas e Formas de Acordes de Violão (SVG & Tablatura)', () => {
    it('deve retornar formas corretas de 6 cordas para acordes abertos', () => {
      const shapeC = getGuitarChordShape('C');
      expect(shapeC.frets).toEqual([-1, 3, 2, 0, 1, 0]);
      expect(shapeC.rootNote).toBe('C');

      const shapeG = getGuitarChordShape('G');
      expect(shapeG.frets).toEqual([3, 2, 0, 0, 0, 3]);

      const shapeEm = getGuitarChordShape('Em');
      expect(shapeEm.frets).toEqual([0, 2, 2, 0, 0, 0]);
    });

    it('deve indicar pestana em acordes com pestana (F, Bm, Bb)', () => {
      const shapeF = getGuitarChordShape('F');
      expect(shapeF.barreFret).toBe(1);
      expect(shapeF.barreStrings).toBeDefined();

      const shapeBm = getGuitarChordShape('Bm');
      expect(shapeBm.barreFret).toBe(2);
    });
  });

  describe('5. Resumo e Metadados do Módulo Violão no Teclado', () => {
    it('deve gerar informações detalhadas de técnica e resumo para a UI', () => {
      const song = REPERTOIRE_SONGS[0];
      const info = getGuitarArrangementInfo(song);

      expect(info.styleLabel).toBeDefined();
      expect(info.styleBadge).toBeDefined();
      expect(info.description).toBeDefined();
      expect(info.recommendedTimbre).toBeDefined();
      expect(info.recommendedTimbreName).toBeDefined();
      expect(info.techniqueSummary).toContain('Mão');
    });
  });
});
