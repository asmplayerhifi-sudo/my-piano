import { describe, it, expect } from 'vitest';
import {
  syllabifyText,
  parseSolfegeToken,
  convertTextToMelody,
  transposePhrase,
  calculateErgonomicFingering,
} from '../../src/core/phrasingEngine';
import { PHRASING_LICKS } from '../../src/core/phrasingLicksData';

describe('PhrasingEngine & Text-to-Melody', () => {
  describe('Separação Silábica (syllabifyText)', () => {
    it('deve separar texto com hífens explícitos', () => {
      const syls = syllabifyText('Pa-ra-béns pra vo-cê');
      expect(syls).toEqual(['Pa', 'ra', 'béns', 'pra', 'vo', 'cê']);
    });

    it('deve separar solfejo simples por espaços', () => {
      const syls = syllabifyText('do re mi fa sol la si do');
      expect(syls.length).toBe(8);
      expect(syls[0]).toBe('do');
      expect(syls[2]).toBe('mi');
    });

    it('deve lidar com texto vazio ou espaços em branco', () => {
      expect(syllabifyText('')).toEqual([]);
      expect(syllabifyText('   ')).toEqual([]);
    });
  });

  describe('Identificação de Solfejo (parseSolfegeToken)', () => {
    it('deve identificar sílabas de solfejo clássico em português', () => {
      expect(parseSolfegeToken('dó')?.pitchOffset).toBe(0);
      expect(parseSolfegeToken('ré')?.pitchOffset).toBe(2);
      expect(parseSolfegeToken('mi')?.pitchOffset).toBe(4);
      expect(parseSolfegeToken('fá')?.pitchOffset).toBe(5);
      expect(parseSolfegeToken('sol')?.pitchOffset).toBe(7);
      expect(parseSolfegeToken('lá')?.pitchOffset).toBe(9);
      expect(parseSolfegeToken('si')?.pitchOffset).toBe(11);
    });

    it('deve identificar cifras em letras com oitava', () => {
      const res = parseSolfegeToken('C4');
      expect(res?.pitchOffset).toBe(0);
      expect(res?.octaveShift).toBe(0);

      const resHigh = parseSolfegeToken('G5');
      expect(resHigh?.pitchOffset).toBe(7);
      expect(resHigh?.octaveShift).toBe(12);
    });

    it('deve retornar null para palavras normais que não são notas', () => {
      expect(parseSolfegeToken('amor')).toBeNull();
      expect(parseSolfegeToken('coração')).toBeNull();
    });
  });

  describe('Conversão Text-to-Melody (convertTextToMelody)', () => {
    it('deve converter solfejo em alturas exatas', () => {
      const notes = convertTextToMelody('dó ré mi fá sol', { rootMidi: 60 });
      expect(notes.length).toBe(5);
      expect(notes[0].midi).toBe(60); // Dó
      expect(notes[1].midi).toBe(62); // Ré
      expect(notes[2].midi).toBe(64); // Mi
      expect(notes[3].midi).toBe(65); // Fá
      expect(notes[4].midi).toBe(67); // Sol
    });

    it('deve gerar melodia expressiva para letra lírica com repouso na tônica', () => {
      const notes = convertTextToMelody('Eu sei que vou te amar', {
        rootMidi: 60,
        scaleType: 'pentatonic',
      });

      expect(notes.length).toBeGreaterThanOrEqual(5);
      // Última nota repousa na tônica
      expect(notes[notes.length - 1].midi).toBe(60);
      // Todas as notas possuem dedilhado atribuído (1 a 5)
      expect(notes.every(n => n.fingering && n.fingering >= 1 && n.fingering <= 5)).toBe(true);
    });
  });

  describe('Transposição Tonal (transposePhrase)', () => {
    it('deve transpor todas as notas preservando intervalos e durações', () => {
      const original = convertTextToMelody('dó mi sol', { rootMidi: 60 });
      const transposed = transposePhrase(original, 2); // Transpõe 1 tom (+2 semitons)

      expect(transposed[0].midi).toBe(62); // Ré
      expect(transposed[1].midi).toBe(66); // Fá#
      expect(transposed[2].midi).toBe(69); // Lá

      // Sílabas e durações devem permanecer intactas
      expect(transposed[0].syllable).toBe(original[0].syllable);
      expect(transposed[0].duration).toBe(original[0].duration);
    });
  });

  describe('Dedilhado Ergonômico (calculateErgonomicFingering)', () => {
    it('deve atribuir dedilhado 1 a 5 coerente para escala ascendente', () => {
      const notes = convertTextToMelody('dó ré mi fá sol', { rootMidi: 60 });
      const fingerings = calculateErgonomicFingering(notes);

      expect(fingerings).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('Biblioteca de Licks por Gênero (PHRASING_LICKS)', () => {
    it('deve conter licks para todos os 5 gêneros principais', () => {
      const genres = new Set(PHRASING_LICKS.map(l => l.genre));
      expect(genres.has('blues')).toBe(true);
      expect(genres.has('jazz')).toBe(true);
      expect(genres.has('bossa')).toBe(true);
      expect(genres.has('pop')).toBe(true);
      expect(genres.has('classical')).toBe(true);
    });

    it('todos os licks devem possuir notas válidas com durações e dedilhados', () => {
      for (const lick of PHRASING_LICKS) {
        expect(lick.notes.length).toBeGreaterThan(0);
        expect(lick.bpm).toBeGreaterThan(40);
        for (const n of lick.notes) {
          expect(n.midi).toBeGreaterThanOrEqual(21);
          expect(n.midi).toBeLessThanOrEqual(108);
          expect(n.duration).toBeGreaterThan(0);
          expect(n.fingering).toBeGreaterThanOrEqual(1);
          expect(n.fingering).toBeLessThanOrEqual(5);
        }
      }
    });
  });
});
