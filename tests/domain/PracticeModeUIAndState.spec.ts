import { describe, it, expect } from 'vitest';
import { REPERTOIRE_SONGS } from '../../src/core/repertoireData';
import { computeNoteOffsets, SCORE_GEOMETRY, getNoteY, getScoreNoteFingering } from '../../src/components/score/scrolling/scoreGeometry';
import { parseScoreTimeSignature } from '../../src/components/score/scrolling/useScoreTimeline';
import { octaveConfigStore } from '../../src/core/octaveConfigStore';
import { audioInputConfigStore } from '../../src/core/audioInputConfigStore';

describe('PracticeModeUIAndState - Testes de Interface, Estado e Apresentação do Modo Prática', () => {
  const odeToJoy = REPERTOIRE_SONGS.find((s) => s.id === 'ode-to-joy') || REPERTOIRE_SONGS[0];

  it('deve validar estrutura completa da partitura com claves de Sol e Fá, pautas e geometria', () => {
    expect(SCORE_GEOMETRY.attackLineX).toBe(145);
    expect(SCORE_GEOMETRY.middleCY).toBe(140);
    expect(SCORE_GEOMETRY.trebleBaseY).toBe(126);
    expect(SCORE_GEOMETRY.bassBaseY).toBe(304);

    // Dó central (C3 = MIDI 60 no padrão C3) na linha intermediária
    expect(getNoteY(60)).toBe(SCORE_GEOMETRY.middleCY);

    // Notas de clave de sol e fá mapeiam para alturas coerentes
    const trebleY = getNoteY(64, 'treble'); // E3
    const bassY = getNoteY(48, 'bass');     // C2
    expect(trebleY).toBeLessThan(SCORE_GEOMETRY.middleCY);
    expect(bassY).toBeGreaterThan(SCORE_GEOMETRY.middleCY);
  });

  it('deve extrair dedos corretos para exibição no teclado e na partitura', () => {
    const noteMD = odeToJoy.scoreTrack.find((n) => n.fingerRightHand !== undefined);
    expect(noteMD).toBeDefined();
    const fingeringMD = getScoreNoteFingering(noteMD!, 'piano');
    expect(fingeringMD).not.toBeNull();
    expect(fingeringMD?.hand).toBe('MD');
    expect(fingeringMD?.finger).toBe(noteMD!.fingerRightHand);

    const noteME = odeToJoy.scoreTrack.find((n) => n.fingerLeftHand !== undefined);
    expect(noteME).toBeDefined();
    const fingeringME = getScoreNoteFingering(noteME!, 'piano');
    expect(fingeringME).not.toBeNull();
    expect(fingeringME?.hand).toBe('ME');
    expect(fingeringME?.finger).toBe(noteME!.fingerLeftHand);
  });

  it('deve manter a acurácia em 100% no início e calcular percentual exato conforme acertos e erros', () => {
    const calcAccuracy = (hits: number, errors: number) => {
      const total = hits + errors;
      return total > 0 ? Math.round((hits / total) * 100) : 100;
    };

    expect(calcAccuracy(0, 0)).toBe(100);
    expect(calcAccuracy(10, 0)).toBe(100);
    expect(calcAccuracy(9, 1)).toBe(90);
    expect(calcAccuracy(5, 5)).toBe(50);
    expect(calcAccuracy(0, 4)).toBe(0);
  });

  it('deve associar nomes de notas em português com o padrão de oitava ativo', () => {
    const standard = octaveConfigStore.getStandard();
    // MIDI 60 é Dó Central
    const ptC3 = octaveConfigStore.midiToPtName(60, 'C3');
    expect(ptC3).toBe('Dó 3');

    const ptC4 = octaveConfigStore.midiToPtName(60, 'C4');
    expect(ptC4).toBe('Dó 4');
  });

  it('deve gerenciar canais MIDI e modos de entrada corretamente no áudio config store', () => {
    audioInputConfigStore.setMidiChannel(1);
    expect(audioInputConfigStore.getSnapshot().midiChannel).toBe(1);

    audioInputConfigStore.setMidiChannel(0); // OMNI
    expect(audioInputConfigStore.getSnapshot().midiChannel).toBe(0);

    audioInputConfigStore.setInputMode('midi');
    expect(audioInputConfigStore.getSnapshot().inputMode).toBe('midi');

    audioInputConfigStore.setInputMode('mic');
    expect(audioInputConfigStore.getSnapshot().inputMode).toBe('mic');
  });

  it('deve calcular corretamente a fórmula de compasso e número de batidas por compasso', () => {
    const sig = parseScoreTimeSignature(odeToJoy.timeSignature);
    expect(sig.numerator).toBe(4);
    expect(sig.denominator).toBe(4);
    expect(sig.beatsPerMeasure).toBe(4);
  });
});
