/**
 * Sintetizador dedicado para Metrônomo Avançado, Baixo Elétrico,
 * Acordes Harmônicos e Arpejos do Acompanhamento Musical.
 */

import { soundEngine } from './soundEngine';
import { midiToFrequency } from './musicTheory';

export type MetronomeSoundType = 'digital' | 'woodblock' | 'mechanical' | 'cowbell' | 'keyboard-sidestick';

class AccompanimentSynthesizer {
  /**
   * Toca o clique do metrônomo configurável por tipo de som e função métrica
   */
  public playMetronomeSound(
    soundType: MetronomeSoundType,
    isDownbeat: boolean,
    isSubdivision = false,
    time?: number,
    volume = 1.0,
    destinationNode?: AudioNode
  ) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest || volume <= 0.001) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);

    switch (soundType) {
      case 'digital': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (isDownbeat) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1600, t);
          osc.frequency.exponentialRampToValueAtTime(700, t + 0.035);
          gain.gain.setValueAtTime(0.7 * volume, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
          osc.stop(t + 0.05);
        } else if (isSubdivision) {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(650, t);
          gain.gain.setValueAtTime(0.3 * volume, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
          osc.stop(t + 0.03);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1050, t);
          osc.frequency.exponentialRampToValueAtTime(500, t + 0.03);
          gain.gain.setValueAtTime(0.5 * volume, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
          osc.stop(t + 0.04);
        }

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        break;
      }

      case 'woodblock': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';

        const freq = isDownbeat ? 1400 : isSubdivision ? 720 : 980;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.03);

        const peak = (isDownbeat ? 0.8 : isSubdivision ? 0.35 : 0.55) * volume;
        gain.gain.setValueAtTime(peak, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      case 'keyboard-sidestick': {
        // Som musical de sidestick / aro de teclado (madeira orgânica + estalido harmônico)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';

        const freq = isDownbeat ? 1750 : isSubdivision ? 880 : 1250;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.025);

        const peak = (isDownbeat ? 0.85 : isSubdivision ? 0.35 : 0.6) * volume;
        gain.gain.setValueAtTime(peak, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.045);
        break;
      }

      case 'cowbell': {
        // Cowbell tipo 808 clássico (dois osciladores de onda quadrada com filtro passa-banda)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const baseF = isDownbeat ? 840 : isSubdivision ? 520 : 640;
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(baseF, t);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(baseF * 1.5, t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseF * 1.25, t);
        filter.Q.setValueAtTime(3.0, t);

        const peak = (isDownbeat ? 0.55 : isSubdivision ? 0.25 : 0.4) * volume;
        gain.gain.setValueAtTime(peak, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.085);
        osc2.stop(t + 0.085);
        break;
      }

      case 'mechanical':
      default: {
        // Metrônomo mecânico antigo (clique seco com ruído de madeira)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';

        const freq = isDownbeat ? 2200 : isSubdivision ? 1100 : 1600;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.015);

        const peak = (isDownbeat ? 0.85 : isSubdivision ? 0.35 : 0.6) * volume;
        gain.gain.setValueAtTime(peak, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.03);
        break;
      }
    }
  }

  /**
   * Linha de baixo sintetizada com ataque encorpado e ressonância quente
   */
  public playBassNote(
    midi: number,
    durationBeats = 0.8,
    secondsPerBeat = 0.5,
    time?: number,
    velocity = 0.85,
    destinationNode?: AudioNode
  ) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest || velocity <= 0.01) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const freq = midiToFrequency(Math.max(28, Math.min(55, midi)));
    const duration = Math.max(0.1, durationBeats * secondsPerBeat);

    // Oscilador 1: Onda triangular de sub-grave encorpado
    const subOsc = ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq, t);

    // Oscilador 2: Dente de serra suave para harmônicos do baixo
    const sawOsc = ctx.createOscillator();
    sawOsc.type = 'sawtooth';
    sawOsc.frequency.setValueAtTime(freq, t);

    // Filtro passa-baixa com envelope de corte para o punch
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, t);
    filter.frequency.exponentialRampToValueAtTime(280, t + Math.min(0.2, duration * 0.5));
    filter.Q.setValueAtTime(2.0, t);

    // Envelope de Ganho
    const gain = ctx.createGain();
    const peak = 0.65 * velocity;
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.012); // Ataque de palheta/dedo
    gain.gain.setValueAtTime(peak * 0.85, t + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    subOsc.connect(filter);
    sawOsc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    subOsc.start(t);
    sawOsc.start(t);
    subOsc.stop(t + duration + 0.02);
    sawOsc.stop(t + duration + 0.02);
  }

  /**
   * Acorde harmônico estendido (Piano, Rhodes, Violão ou Pad)
   */
  public playHarmonicChord(
    midiNotes: number[],
    instrument: 'piano' | 'rhodes' | 'guitar_nylon' | 'synth_pad',
    durationBeats = 1.8,
    secondsPerBeat = 0.5,
    time?: number,
    velocity = 0.75,
    destinationNode?: AudioNode
  ) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest || velocity <= 0.01 || midiNotes.length === 0) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const duration = Math.max(0.15, durationBeats * secondsPerBeat);

    // Micro-strumming (espalhamento suave de dedos entre as notas: 8ms)
    midiNotes.forEach((midi, idx) => {
      const noteTime = t + (idx * 0.009);
      const freq = midiToFrequency(midi);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (instrument === 'rhodes') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Harmônico secundário para o brilho do Rhodes
        const oscBell = ctx.createOscillator();
        const bellGain = ctx.createGain();
        oscBell.type = 'triangle';
        oscBell.frequency.setValueAtTime(freq * 3, noteTime);

        bellGain.gain.setValueAtTime(0.12 * velocity, noteTime);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.15);
        oscBell.connect(bellGain);
        bellGain.connect(dest);
        oscBell.start(noteTime);
        oscBell.stop(noteTime + 0.16);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.28 * velocity, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);
      } else if (instrument === 'synth_pad') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.22 * velocity, noteTime + 0.08); // Ataque suave de pad
        gain.gain.setValueAtTime(0.2 * velocity, noteTime + duration * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);
      } else if (instrument === 'guitar_nylon') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.3 * velocity, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.9);
      } else {
        // Piano padrão
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.32 * velocity, noteTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);
      }

      osc.connect(gain);
      gain.connect(dest);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.02);
    });
  }

  /**
   * Nota de arpejo melódica
   */
  public playArpeggioNote(
    midi: number,
    durationBeats = 0.5,
    secondsPerBeat = 0.5,
    time?: number,
    velocity = 0.75,
    destinationNode?: AudioNode
  ) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest || velocity <= 0.01) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const freq = midiToFrequency(midi);
    const duration = Math.max(0.1, durationBeats * secondsPerBeat);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35 * velocity, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 1.1);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + duration * 1.15);
  }
}

export const accompanimentSynthesizer = new AccompanimentSynthesizer();
