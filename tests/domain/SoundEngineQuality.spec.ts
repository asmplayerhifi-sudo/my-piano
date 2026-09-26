import { describe, it, expect, vi, beforeEach } from 'vitest';
import { soundEngine } from '../../src/core/soundEngine';
import {
  TIMBRES,
  TIMBRE_CATEGORIES,
} from '../../src/core/soundEngineTypes';
import {
  computeVelocityDynamics,
  getNextRoundRobin,
} from '../../src/core/soundEngineSynthesizers';

describe('Sound Engine & Seletor de Timbres — Padrão Profissional e Expansão', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Catálogo e Organização por Categorias da Indústria', () => {
    it('deve disponibilizar exatamente as 7 categorias profissionais de instrumentos', () => {
      const categoryIds = TIMBRE_CATEGORIES.map(c => c.id);
      expect(categoryIds).toEqual([
        'pianos',
        'epianos_organs',
        'percussion',
        'synths_leads',
        'orchestra',
        'guitars',
        'bass',
      ]);
    });

    it('deve conter catálogo expandido com pelo menos 34 instrumentos profissionais', () => {
      expect(TIMBRES.length).toBeGreaterThanOrEqual(34);
    });

    it('todo instrumento deve possuir metadados completos, tags de áudio e descrição detalhada', () => {
      TIMBRES.forEach(timbre => {
        expect(timbre.id).toBeDefined();
        expect(timbre.label.trim().length).toBeGreaterThan(0);
        expect(timbre.subtitle.trim().length).toBeGreaterThan(0);
        expect(timbre.description.trim().length).toBeGreaterThan(15);
        expect(timbre.iconKey.trim().length).toBeGreaterThan(0);
        expect(timbre.tags.length).toBeGreaterThan(0);
        expect(TIMBRE_CATEGORIES.some(c => c.id === timbre.category)).toBe(true);
      });
    });

    it('não deve possuir ícones genéricos (Rhodes, Baixo, Hammond, Vibrafone possuem iconKey dedicados)', () => {
      const rhodes = TIMBRES.find(t => t.id === 'rhodes');
      const bass = TIMBRES.find(t => t.id === 'bass');
      const organ = TIMBRES.find(t => t.id === 'organ');
      const vibraphone = TIMBRES.find(t => t.id === 'vibraphone');

      expect(rhodes?.iconKey).toBe('rhodes');
      expect(bass?.iconKey).toBe('bass_pick');
      expect(organ?.iconKey).toBe('organ_hammond');
      expect(vibraphone?.iconKey).toBe('vibraphone');

      // Rhodes e Baixo não compartilham o mesmo ícone
      expect(rhodes?.iconKey).not.toEqual(bass?.iconKey);
    });
  });

  describe('2. Timbres Regionais Brasileiros e Vintage / Psicodélico Internacional', () => {
    it('deve conter Sanfona Scandalli 120 baixos para Baião, Xote e Piseiro', () => {
      const accordion = TIMBRES.find(t => t.id === 'accordion');
      expect(accordion).toBeDefined();
      expect(accordion?.tags).toContain('Musette Tuned');
      expect(accordion?.label).toContain('Scandalli');
      expect(accordion?.description).toContain('Baião');
    });

    it('deve conter Metais Pop/Brega estilo Zezo/Seresta e Violão de 7 Cordas', () => {
      const brassBrega = TIMBRES.find(t => t.id === 'brass_brega');
      const guitar7 = TIMBRES.find(t => t.id === 'guitar_7strings');
      expect(brassBrega).toBeDefined();
      expect(guitar7).toBeDefined();
      expect(brassBrega?.subtitle).toContain('Zezo');
      expect(guitar7?.presetOrigin).toContain('Samba');
    });

    it('deve conter Órgãos Vintage: Hammond B3 com Leslie, Vox Continental e Farfisa', () => {
      const hammond = TIMBRES.find(t => t.id === 'organ');
      const vox = TIMBRES.find(t => t.id === 'vox_continental');
      const farfisa = TIMBRES.find(t => t.id === 'farfisa');

      expect(hammond).toBeDefined();
      expect(vox).toBeDefined();
      expect(farfisa).toBeDefined();
      expect(hammond?.tags).toContain('Leslie Rotary FX');
      expect(vox?.tags).toContain('The Doors');
      expect(farfisa?.tags).toContain('Pink Floyd Early');
    });

    it('deve conter Minimoog Model D, Rhodes Suitcase, Wurlitzer 200A e Guitarras Strat/Reggae', () => {
      const minimoog = TIMBRES.find(t => t.id === 'minimoog_lead');
      const suitcase = TIMBRES.find(t => t.id === 'rhodes_suitcase');
      const wurly = TIMBRES.find(t => t.id === 'wurlitzer');
      const stratClean = TIMBRES.find(t => t.id === 'guitar_strat_clean');
      const reggae = TIMBRES.find(t => t.id === 'guitar_reggae_muted');

      expect(minimoog).toBeDefined();
      expect(suitcase).toBeDefined();
      expect(wurly).toBeDefined();
      expect(stratClean).toBeDefined();
      expect(reggae).toBeDefined();
    });
  });

  describe('3. Requisitos Técnicos Sonoros: Velocity Layers e Round-Robin', () => {
    it('deve calcular camadas dinâmicas de Velocity (toque suave pianissimo vs forte fortissimo)', () => {
      const soft = computeVelocityDynamics(0.25);
      const forte = computeVelocityDynamics(0.95);

      // Ganho do toque forte deve ser substancialmente maior que o suave
      expect(forte.dynamicGain).toBeGreaterThan(soft.dynamicGain * 2);

      // Escala do filtro no toque forte deve ser mais aberta (harmônicos brilhantes)
      expect(forte.filterScale).toBeGreaterThan(soft.filterScale);

      // Deteção de toque forte
      expect(forte.isHardStrike).toBe(true);
      expect(soft.isHardStrike).toBe(false);
    });

    it('sistema Round-Robin deve alternar micro-detuning e offset para eliminar o efeito metralhadora', () => {
      const rr1 = getNextRoundRobin();
      const rr2 = getNextRoundRobin();
      const rr3 = getNextRoundRobin();
      const rr4 = getNextRoundRobin();
      const rr5 = getNextRoundRobin();

      // Detunings sucessivos devem variar
      const detunes = [rr1.detune, rr2.detune, rr3.detune, rr4.detune];
      const uniqueDetunes = new Set(detunes);
      expect(uniqueDetunes.size).toBeGreaterThanOrEqual(3);

      // Após 4 ciclos deve retornar ao primeiro ciclo
      expect(rr5.detune).toBe(rr1.detune);
    });
  });

  describe('4. Troca Segura de Timbres e Prevenção de Falhas', () => {
    it('deve permitir trocar entre todos os 34 timbres sem lançar exceções', () => {
      TIMBRES.forEach(timbre => {
        expect(() => soundEngine.setTimbre(timbre.id)).not.toThrow();
        expect(soundEngine.getTimbre()).toBe(timbre.id);
      });
      // Retorna ao default
      soundEngine.setTimbre('grand_piano');
      expect(soundEngine.getTimbre()).toBe('grand_piano');
    });

    it('ao trocar de timbre, as vozes do timbre anterior sofrem fade-out suave de 25ms para evitar cliques', () => {
      const stopSpy = vi.spyOn(soundEngine, 'stopAllNotes');
      soundEngine.setTimbre('vox_continental');
      expect(stopSpy).toHaveBeenCalledWith(0.025);
    });
  });
});
