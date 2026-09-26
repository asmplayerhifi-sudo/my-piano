import { describe, it, expect } from 'vitest';
import {
  RHYTHM_STYLES, RHYTHM_GENRES, DRUM_PADS,
} from '../../src/core/rhythmArrangerData';
import {
  drumEngine, DRUM_KITS,
} from '../../src/core/drumEngine';

describe('Módulo Arranjador v2.0 — Especificação Unificada e Profissional', () => {
  describe('1. Arquitetura de Informação e Desacoplamento de Catálogo', () => {
    it('deve separar rigorosamente Gêneros Musicais de Artistas de Referência', () => {
      const validGenres = new Set([
        'Forró', 'Piseiro', 'Baião', 'Xote', 'Seresta', 'Sertanejo',
        'Rock', 'Reggae', 'Pop', 'Regional',
      ]);

      // Nenhum gênero na lista oficial pode ser o nome de um artista
      const forbiddenArtistNamesAsGenres = ['Elton John', 'The Doors', 'Zezo', 'Bob Marley', 'Queen'];
      RHYTHM_GENRES.forEach(g => {
        expect(forbiddenArtistNamesAsGenres).not.toContain(g.id);
      });

      // Todos os estilos devem pertencer a um gênero válido
      RHYTHM_STYLES.forEach(style => {
        expect(validGenres.has(style.genre)).toBe(true);
      });
    });

    it('deve possuir nomenclatura padronizada com Groove como título e Artista como referência', () => {
      // Exemplo específico da especificação: 70s Piano Rock com ref. Elton John - Crocodile Rock
      const pianoRock = RHYTHM_STYLES.find(s => s.id === 'PIANO_ROCK_70S');
      expect(pianoRock).toBeDefined();
      expect(pianoRock?.name).toBe('70s Piano Rock Boogie');
      expect(pianoRock?.referenceArtist).toBe('Elton John');
      expect(pianoRock?.referenceSong).toBe('Crocodile Rock');
      expect(pianoRock?.genre).toBe('Rock');
      expect(pianoRock?.bpm).toBe(150);
      expect(pianoRock?.timeSignature).toBe('4/4');

      // Exemplo de Forró Tradicional
      const forro = RHYTHM_STYLES.find(s => s.id === 'FORRO_MASTRUZ');
      expect(forro).toBeDefined();
      expect(forro?.name).toBe('Forró Tradicional Mastruz');
      expect(forro?.referenceArtist).toBe('Mastruz com Leite');
      expect(forro?.genre).toBe('Forró');
    });

    it('deve conter metadados obrigatórios (BPM, Compasso, Kit Recomendado, Descrição)', () => {
      RHYTHM_STYLES.forEach(style => {
        expect(style.id).toBeTruthy();
        expect(style.name).toBeTruthy();
        expect(style.bpm).toBeGreaterThan(40);
        expect(style.bpm).toBeLessThanOrEqual(250);
        expect(['4/4', '3/4', '6/8']).toContain(style.timeSignature);
        expect(style.description.length).toBeGreaterThan(15);
        expect(style.recommendedKit).toBeDefined();
      });
    });
  });

  describe('2. Fidelidade Musical e Evolução Progressiva entre Seções', () => {
    it('deve conter todas as 8 seções obrigatórias padrão Workstation (Intro, Main A-D, Fills, Ending)', () => {
      const expectedSections = [
        'intro', 'mainA', 'fillAA', 'mainB', 'fillBB', 'mainC', 'mainD', 'ending',
      ];

      RHYTHM_STYLES.forEach(style => {
        expectedSections.forEach(secId => {
          const sec = style.sections[secId as keyof typeof style.sections];
          expect(sec, `Estilo ${style.id} deve conter a seção ${secId}`).toBeDefined();
          expect(sec.label).toBeTruthy();
          expect(sec.shortLabel).toBeTruthy();
          expect(sec.pattern).toBeDefined();
        });
      });
    });

    it('deve apresentar densidade rítmica progressiva entre Main A e Main D', () => {
      // No Forró e no Piseiro, Main C/D devem possuir maior densidade de notas do que Main A
      const forro = RHYTHM_STYLES.find(s => s.id === 'FORRO_MASTRUZ')!;
      const countActiveSteps = (pattern: typeof forro.sections.mainA.pattern) => {
        let count = 0;
        Object.values(pattern).forEach(stepDef => {
          count += stepDef.steps.filter(Boolean).length;
        });
        return count;
      };

      const densityMainA = countActiveSteps(forro.sections.mainA.pattern);
      const densityMainB = countActiveSteps(forro.sections.mainB.pattern);
      const densityMainC = countActiveSteps(forro.sections.mainC.pattern);

      expect(densityMainB).toBeGreaterThan(densityMainA);
      expect(densityMainC).toBeGreaterThanOrEqual(densityMainB);
    });

    it('Fills e Intros devem possuir padrões estruturados de transição', () => {
      const rock = RHYTHM_STYLES.find(s => s.id === 'PIANO_ROCK_70S')!;
      const fillA = rock.sections.fillAA.pattern;
      // Fill A deve ter toms ou caixa para conduzir a transição
      const hasSnareOrToms = fillA.snare.steps.some(Boolean) ||
                            fillA.tomFloor.steps.some(Boolean) ||
                            fillA.tomMid.steps.some(Boolean);
      expect(hasSnareOrToms).toBe(true);
    });
  });

  describe('3. Pads de Estúdio e Padrão de Controlador de Hardware', () => {
    it('deve conter 14 pads de bateria técnicos mapeados com atalhos de teclado e grupos semânticos', () => {
      expect(DRUM_PADS.length).toBe(14);

      const keys = new Set(DRUM_PADS.map(p => p.key));
      expect(keys.has('kick')).toBe(true);
      expect(keys.has('snare')).toBe(true);
      expect(keys.has('hihatClosed')).toBe(true);
      expect(keys.has('hihatOpen')).toBe(true);
      expect(keys.has('triangle')).toBe(true);
      expect(keys.has('tambourine')).toBe(true);

      // Todos os pads devem ter atalho de teclado definido
      DRUM_PADS.forEach(pad => {
        expect(pad.shortcut).toBeTruthy();
        expect(['primary', 'cymbals', 'percussion']).toContain(pad.group);
      });
    });

    it('não deve conter emojis ou vetores infantis nas definições dos pads', () => {
      DRUM_PADS.forEach(pad => {
        // Rótulos técnicos em texto
        expect(pad.label).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
        expect(pad.shortLabel).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
      });
    });
  });

  describe('4. Mixer de Stems e Troca Dinâmica de Soundkits', () => {
    it('deve suportar os 5 Soundkits de alta definição da especificação', () => {
      const kitIds = DRUM_KITS.map(k => k.id);
      expect(kitIds).toContain('acoustic');
      expect(kitIds).toContain('piseiro');
      expect(kitIds).toContain('tr808');
      expect(kitIds).toContain('regional');
      expect(kitIds).toContain('power_rock');

      // Troca dinâmica de kit no engine
      drumEngine.setKit('piseiro');
      expect(drumEngine.getKit()).toBe('piseiro');
      drumEngine.setKit('regional');
      expect(drumEngine.getKit()).toBe('regional');
    });

    it('deve gerenciar canais de stems (Drums, Cymbals, Percussion, Bass, Harmony) com Mute e Solo', () => {
      drumEngine.setStemVolume('drums', 1.2);
      drumEngine.setStemPan('drums', -0.5);
      drumEngine.setStemMute('drums', true);

      let states = drumEngine.getStemStates();
      expect(states.drums.volume).toBe(1.2);
      expect(states.drums.pan).toBe(-0.5);
      expect(states.drums.muted).toBe(true);

      drumEngine.setStemMute('drums', false);
      drumEngine.setStemSolo('cymbals', true);

      states = drumEngine.getStemStates();
      expect(states.drums.muted).toBe(false);
      expect(states.cymbals.solo).toBe(true);

      // Reseta solo
      drumEngine.setStemSolo('cymbals', false);
    });

    it('deve suportar ajuste de Humanize (microtiming e dinamização de velocity)', () => {
      drumEngine.setHumanize(0.4);
      expect(drumEngine.getHumanize()).toBe(0.4);
      drumEngine.setHumanize(0.0);
      expect(drumEngine.getHumanize()).toBe(0.0);
    });
  });
});
