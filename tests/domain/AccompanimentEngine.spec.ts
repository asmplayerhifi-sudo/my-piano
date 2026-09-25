import { describe, it, expect, beforeEach } from 'vitest';
import { accompanimentStore } from '../../src/core/accompanimentStore';
import { buildProgressionChords, PROGRESSIONS } from '../../src/core/harmonicProgressions';
import { ACCOMPANIMENT_STYLES } from '../../src/core/accompanimentStyles';
import { metronomeScheduler } from '../../src/core/metronomeScheduler';

describe('Sistema de Metrônomo e Acompanhamento Musical', () => {
  beforeEach(() => {
    accompanimentStore.stop();
    accompanimentStore.setBpm(90);
    accompanimentStore.setTimeSignature('4/4');
    accompanimentStore.setSubdivision('quarter');
  });

  describe('1. Parâmetros de Andamento, Compasso e Subdivisão do Metrônomo', () => {
    it('deve limitar o BPM dentro da faixa musical aceita (30 a 280 BPM)', () => {
      accompanimentStore.setBpm(15);
      expect(accompanimentStore.getSnapshot().bpm).toBe(30);

      accompanimentStore.setBpm(350);
      expect(accompanimentStore.getSnapshot().bpm).toBe(280);

      accompanimentStore.setBpm(120);
      expect(accompanimentStore.getSnapshot().bpm).toBe(120);
    });

    it('deve calcular corretamente a quantidade de tempos para cada fórmula de compasso', () => {
      accompanimentStore.setTimeSignature('2/4');
      expect(accompanimentStore.getBeatsPerMeasure()).toBe(2);

      accompanimentStore.setTimeSignature('3/4');
      expect(accompanimentStore.getBeatsPerMeasure()).toBe(3);

      accompanimentStore.setTimeSignature('4/4');
      expect(accompanimentStore.getBeatsPerMeasure()).toBe(4);

      accompanimentStore.setTimeSignature('5/4');
      expect(accompanimentStore.getBeatsPerMeasure()).toBe(5);

      accompanimentStore.setTimeSignature('6/8');
      expect(accompanimentStore.getBeatsPerMeasure()).toBe(6);
    });

    it('deve calcular subdivisões por tempo (semínima, colcheia, semicolcheia, tercina)', () => {
      accompanimentStore.setSubdivision('quarter');
      expect(accompanimentStore.getSubdivisionsPerBeat()).toBe(1);

      accompanimentStore.setSubdivision('eighth');
      expect(accompanimentStore.getSubdivisionsPerBeat()).toBe(2);

      accompanimentStore.setSubdivision('sixteenth');
      expect(accompanimentStore.getSubdivisionsPerBeat()).toBe(4);

      accompanimentStore.setSubdivision('triplet');
      expect(accompanimentStore.getSubdivisionsPerBeat()).toBe(3);
    });

    it('deve retornar o termo clássico de andamento correto', () => {
      accompanimentStore.setBpm(50);
      expect(accompanimentStore.getTempoTerm()).toBe('Largo');

      accompanimentStore.setBpm(90);
      expect(accompanimentStore.getTempoTerm()).toBe('Andante');

      accompanimentStore.setBpm(115);
      expect(accompanimentStore.getTempoTerm()).toBe('Moderato');

      accompanimentStore.setBpm(130);
      expect(accompanimentStore.getTempoTerm()).toBe('Allegro');

      accompanimentStore.setBpm(180);
      expect(accompanimentStore.getTempoTerm()).toBe('Vivace');

      accompanimentStore.setBpm(210);
      expect(accompanimentStore.getTempoTerm()).toBe('Presto');
    });
  });

  describe('2. Matriz de Mute Independente do Metrônomo (Tempo Forte, Fracos e Subdivisões)', () => {
    it('deve permitir mutar apenas o tempo forte (downbeat) mantendo os fracos audíveis', () => {
      const initial = accompanimentStore.getSnapshot().muteDownbeat;
      accompanimentStore.toggleMuteDownbeat();
      expect(accompanimentStore.getSnapshot().muteDownbeat).toBe(!initial);

      // Reverte
      accompanimentStore.toggleMuteDownbeat();
      expect(accompanimentStore.getSnapshot().muteDownbeat).toBe(initial);
    });

    it('deve permitir mutar apenas os tempos fracos mantendo o tempo forte audível', () => {
      const initial = accompanimentStore.getSnapshot().muteUpbeats;
      accompanimentStore.toggleMuteUpbeats();
      expect(accompanimentStore.getSnapshot().muteUpbeats).toBe(!initial);

      accompanimentStore.toggleMuteUpbeats();
      expect(accompanimentStore.getSnapshot().muteUpbeats).toBe(initial);
    });

    it('deve permitir mutar subdivisões intermediárias independentemente', () => {
      const initial = accompanimentStore.getSnapshot().muteSubdivisions;
      accompanimentStore.toggleMuteSubdivisions();
      expect(accompanimentStore.getSnapshot().muteSubdivisions).toBe(!initial);

      accompanimentStore.toggleMuteSubdivisions();
      expect(accompanimentStore.getSnapshot().muteSubdivisions).toBe(initial);
    });

    it('deve permitir mutar o metrônomo por completo para ouvir apenas a banda de acompanhamento', () => {
      accompanimentStore.toggleMuteMetronomeMaster();
      expect(accompanimentStore.getSnapshot().muteMetronomeMaster).toBe(true);

      accompanimentStore.toggleMuteMetronomeMaster();
      expect(accompanimentStore.getSnapshot().muteMetronomeMaster).toBe(false);
    });
  });

  describe('3. Pistas de Acompanhamento: Bateria, Baixo, Acordes e Arpejo', () => {
    it('deve permitir ajustar o volume individual de cada pista', () => {
      accompanimentStore.setChannelVolume('drums', 65);
      expect(accompanimentStore.getSnapshot().drums.volume).toBe(65);

      accompanimentStore.setChannelVolume('bass', 85);
      expect(accompanimentStore.getSnapshot().bass.volume).toBe(85);

      accompanimentStore.setChannelVolume('chords', 50);
      expect(accompanimentStore.getSnapshot().chords.volume).toBe(50);

      accompanimentStore.setChannelVolume('arpeggio', 40);
      expect(accompanimentStore.getSnapshot().arpeggio.volume).toBe(40);
    });

    it('deve permitir mutar canais individuais de acompanhamento', () => {
      accompanimentStore.toggleChannelMute('drums');
      expect(accompanimentStore.getSnapshot().drums.muted).toBe(true);

      accompanimentStore.toggleChannelMute('drums');
      expect(accompanimentStore.getSnapshot().drums.muted).toBe(false);
    });

    it('ao ativar o modo Solo em um canal, deve isolar o solo exclusivamente para ele', () => {
      accompanimentStore.toggleChannelSolo('bass');
      const snap = accompanimentStore.getSnapshot();

      expect(snap.bass.solo).toBe(true);
      expect(snap.drums.solo).toBe(false);
      expect(snap.chords.solo).toBe(false);
      expect(snap.arpeggio.solo).toBe(false);

      // Alterna solo para outro canal
      accompanimentStore.toggleChannelSolo('drums');
      const snap2 = accompanimentStore.getSnapshot();
      expect(snap2.drums.solo).toBe(true);
      expect(snap2.bass.solo).toBe(false);

      // Desliga solo
      accompanimentStore.toggleChannelSolo('drums');
      expect(accompanimentStore.getSnapshot().drums.solo).toBe(false);
    });
  });

  describe('4. Progressões Harmônicas e Tonalidades Parametrizáveis', () => {
    it('deve calcular corretamente os 4 acordes da progressão Pop (I-V-vi-IV) em Dó Maior (C -> G -> Am -> F)', () => {
      const chords = buildProgressionChords('C', 'major', 'pop_4chords');
      expect(chords.length).toBe(4);

      expect(chords[0].symbol).toBe('C');
      expect(chords[1].symbol).toBe('G');
      expect(chords[2].symbol).toBe('Am');
      expect(chords[3].symbol).toBe('F');

      // Verifica fundamental no baixo: C = 36, G = 43, A = 45, F = 41
      expect(chords[0].rootMidi).toBe(36);
      expect(chords[1].rootMidi).toBe(43);
      expect(chords[2].rootMidi).toBe(45);
      expect(chords[3].rootMidi).toBe(41);
    });

    it('deve calcular a cadência de Jazz ii-V-I com tétrades em Dó Maior (Dm7 -> G7 -> C7M)', () => {
      const chords = buildProgressionChords('C', 'major', 'jazz_ii_v_i');
      expect(chords.length).toBe(4);

      expect(chords[0].symbol).toBe('Dm7');
      expect(chords[1].symbol).toBe('G7');
      expect(chords[2].symbol).toBe('C7M');
    });

    it('deve transpor os acordes para qualquer tonalidade (ex: Sol Maior I-V-vi-IV -> G, D, Em, C)', () => {
      const chords = buildProgressionChords('G', 'major', 'pop_4chords');
      expect(chords[0].symbol).toBe('G');
      expect(chords[1].symbol).toBe('D');
      expect(chords[2].symbol).toBe('Em');
      expect(chords[3].symbol).toBe('C');
    });
  });

  describe('5. Catálogo de Estilos Rítmicos', () => {
    it('deve conter todos os estilos rítmicos requeridos (pop/rock, bossa, valsa, jazz, funk, etc.)', () => {
      const styleIds = ACCOMPANIMENT_STYLES.map(s => s.id);

      expect(styleIds).toContain('pop_rock');
      expect(styleIds).toContain('ballad_4_4');
      expect(styleIds).toContain('ballad_6_8');
      expect(styleIds).toContain('bossa_nova');
      expect(styleIds).toContain('waltz_3_4');
      expect(styleIds).toContain('jazz_swing');
      expect(styleIds).toContain('funk_groove');
      expect(styleIds).toContain('reggae');
    });

    it('cada estilo deve possuir padrões estruturados de bateria, baixo, harmonia e arpejo', () => {
      ACCOMPANIMENT_STYLES.forEach((style) => {
        expect(style.drumPattern.length).toBeGreaterThan(0);
        expect(style.bassPattern.length).toBeGreaterThan(0);
        expect(style.chordPattern.length).toBeGreaterThan(0);
        expect(style.arpeggioPattern.length).toBeGreaterThan(0);
        expect(style.stepsPerMeasure).toBeGreaterThan(0);
      });
    });
  });

  describe('6. Compatibilidade e Sincronismo com metronomeScheduler', () => {
    it('o metronomeScheduler deve sincronizar alterações de BPM e compasso com o accompanimentStore', () => {
      metronomeScheduler.setBpm(135);
      expect(accompanimentStore.getSnapshot().bpm).toBe(135);
      expect(metronomeScheduler.getBpm()).toBe(135);

      metronomeScheduler.setTimeSignature('3/4');
      expect(accompanimentStore.getSnapshot().timeSignature).toBe('3/4');
      expect(metronomeScheduler.getBeatsPerMeasure()).toBe(3);
    });
  });
});
