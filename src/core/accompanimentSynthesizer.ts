/**
 * Sintetizador dedicado para Metrônomo Avançado, Baixo Elétrico,
 * Acordes Harmônicos e Arpejos do Acompanhamento Musical.
 */

import { soundEngine } from './soundEngine';
import { midiToFrequency } from './musicTheory';

export type MetronomeSoundType = 'cowbell' | 'woodblock' | 'keyboard-sidestick' | 'mechanical' | 'digital';

export interface MetronomeSoundOption {
  id: MetronomeSoundType;
  label: string;
}

export const METRONOME_SOUND_OPTIONS: MetronomeSoundOption[] = [
  { id: 'cowbell', label: 'Cowbell 808' },
  { id: 'woodblock', label: 'Bloco de Madeira' },
  { id: 'keyboard-sidestick', label: 'Aro de Teclado' },
  { id: 'mechanical', label: 'Mecânico Tradicional' },
  { id: 'digital', label: 'Digital Beep' },
];

class AccompanimentSynthesizer {
  private metronomeBusGain: GainNode | null = null;

  private getMetronomeBusGain(ctx: AudioContext): GainNode {
    if (!this.metronomeBusGain) {
      this.metronomeBusGain = ctx.createGain();
      this.metronomeBusGain.gain.setValueAtTime(1.0, ctx.currentTime);
      const dest = soundEngine.getMasterGain();
      if (dest) {
        this.metronomeBusGain.connect(dest);
      }
    }
    return this.metronomeBusGain;
  }

  /**
   * Silencia o barramento do metrônomo instantaneamente com rampa suave de 5ms,
   * eliminando estalidos, picos de som e cancelando eventos pendentes ao desligar.
   */
  public silenceMetronome() {
    const ctx = soundEngine.getAudioContext();
    if (!ctx || !this.metronomeBusGain) return;
    const now = ctx.currentTime;
    try {
      this.metronomeBusGain.gain.cancelScheduledValues(now);
      this.metronomeBusGain.gain.setValueAtTime(Math.max(0.0001, this.metronomeBusGain.gain.value), now);
      this.metronomeBusGain.gain.linearRampToValueAtTime(0.00001, now + 0.005);
    } catch { /* ignora */ }
  }

  public armMetronome() {
    const ctx = soundEngine.getAudioContext();
    if (!ctx || !this.metronomeBusGain) return;
    const now = ctx.currentTime;
    try {
      this.metronomeBusGain.gain.cancelScheduledValues(now);
      this.metronomeBusGain.gain.setValueAtTime(1.0, now);
    } catch { /* ignora */ }
  }

  /**
   * Toca o clique do metrônomo configurável por tipo de som e função métrica.
   * Síntese procedural de alta definição (Web Audio API) com envelopes seguros e livres de pops/DC offset.
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
    if (!ctx || volume <= 0.001) return;
    const dest = destinationNode || this.getMetronomeBusGain(ctx);

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);

    // Garante que o barramento do metrônomo esteja ativo no momento do clique
    if (!destinationNode && this.metronomeBusGain) {
      try {
        this.metronomeBusGain.gain.setValueAtTime(1.0, t);
      } catch {}
    }

    switch (soundType) {
      case 'cowbell': {
        // Roland TR-808 Cowbell Autêntico:
        // Dois osciladores de onda quadrada na proporção harmônica clássica (~1.481)
        // Passando por filtro passa-banda ressonante com decaimento metálico percussivo.
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        // Downbeat (tempo forte) tem afinação superior; tempos normais com 540Hz e 800Hz padrão 808
        const baseF = isDownbeat ? 780 : isSubdivision ? 440 : 540;
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(baseF, t);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(Math.round(baseF * 1.481), t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseF * 1.35, t);
        filter.Q.setValueAtTime(3.2, t);

        const peak = (isDownbeat ? 0.7 : isSubdivision ? 0.35 : 0.55) * volume;
        const decayTime = isDownbeat ? 0.09 : isSubdivision ? 0.05 : 0.075;

        // Rampa suave de 5ms anti-pop na entrada e saída
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);
        gain.gain.setValueAtTime(0, t + decayTime + 0.005);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + decayTime + 0.01);
        osc2.stop(t + decayTime + 0.01);

        // Limpeza de nós de áudio após execução (Garbage Collection)
        osc1.onended = () => {
          try {
            osc1.disconnect();
            osc2.disconnect();
            filter.disconnect();
            gain.disconnect();
          } catch {}
        };
        break;
      }

      case 'woodblock': {
        // Bloco de Madeira Orgânico Ressonante:
        // Fundamental com queda de tom rápida + sobretom cilíndrico (razão 1.62)
        // Filtragem passa-banda que confere a cavidade oca acústica ("tok!")
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const baseF = isDownbeat ? 1350 : isSubdivision ? 680 : 960;
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(baseF, t);
        osc1.frequency.exponentialRampToValueAtTime(baseF * 0.65, t + 0.02);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseF * 1.62, t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseF * 1.15, t);
        filter.Q.setValueAtTime(3.8, t);

        const peak = (isDownbeat ? 0.9 : isSubdivision ? 0.45 : 0.75) * volume;
        const decayTime = isDownbeat ? 0.06 : isSubdivision ? 0.035 : 0.05;

        // Rampa suave de 5ms anti-pop
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);
        gain.gain.setValueAtTime(0, t + decayTime + 0.005);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + decayTime + 0.01);
        osc2.stop(t + decayTime + 0.01);

        osc1.onended = () => {
          try {
            osc1.disconnect();
            osc2.disconnect();
            filter.disconnect();
            gain.disconnect();
          } catch {}
        };
        break;
      }

      case 'keyboard-sidestick': {
        // Aro de Teclado / Rimshot Acústico:
        // Estalido percussivo rápido de baqueta no aro (transiente brilhante + corpo da caixa)
        const snapOsc = ctx.createOscillator();
        const bodyOsc = ctx.createOscillator();
        const snapFilter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const snapFreq = isDownbeat ? 3400 : isSubdivision ? 1800 : 2600;
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(snapFreq, t);
        snapOsc.frequency.exponentialRampToValueAtTime(750, t + 0.012);

        snapFilter.type = 'highpass';
        snapFilter.frequency.setValueAtTime(900, t);

        const bodyFreq = isDownbeat ? 880 : isSubdivision ? 500 : 720;
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(bodyFreq, t);
        bodyOsc.frequency.exponentialRampToValueAtTime(bodyFreq * 0.6, t + 0.025);

        const peak = (isDownbeat ? 0.9 : isSubdivision ? 0.4 : 0.75) * volume;
        const decayTime = isDownbeat ? 0.05 : isSubdivision ? 0.03 : 0.04;

        // Rampa suave de 5ms anti-pop
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);
        gain.gain.setValueAtTime(0, t + decayTime + 0.005);

        snapOsc.connect(snapFilter);
        snapFilter.connect(gain);
        bodyOsc.connect(gain);
        gain.connect(dest);

        snapOsc.start(t);
        bodyOsc.start(t);
        snapOsc.stop(t + decayTime + 0.01);
        bodyOsc.stop(t + decayTime + 0.01);

        snapOsc.onended = () => {
          try {
            snapOsc.disconnect();
            bodyOsc.disconnect();
            snapFilter.disconnect();
            gain.disconnect();
          } catch {}
        };
        break;
      }

      case 'mechanical': {
        // Metrônomo Mecânico Tradicional (Maelzel / Wittner):
        // Pêndulo acústico de madeira: "Tick" agudo no tempo 1 e "Tock" encorpado nos tempos fracos
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const freq = isDownbeat ? 2100 : isSubdivision ? 1100 : 1550;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.018);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isDownbeat ? 1600 : 1200, t);
        filter.Q.setValueAtTime(2.8, t);

        const peak = (isDownbeat ? 0.85 : isSubdivision ? 0.4 : 0.7) * volume;
        const decayTime = isDownbeat ? 0.04 : isSubdivision ? 0.025 : 0.035;

        // Rampa suave de 5ms anti-pop
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);
        gain.gain.setValueAtTime(0, t + decayTime + 0.005);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t);
        osc.stop(t + decayTime + 0.01);

        osc.onended = () => {
          try {
            osc.disconnect();
            filter.disconnect();
            gain.disconnect();
          } catch {}
        };
        break;
      }

      case 'digital':
      default: {
        // Digital Beep de Precisão:
        // Senoide pura com notas calibradas (A6 para tempo 1, A5 para tempos normais)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = isDownbeat ? 1760 : isSubdivision ? 440 : 880;
        osc.type = isSubdivision ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const peak = (isDownbeat ? 0.7 : isSubdivision ? 0.35 : 0.55) * volume;
        const decayTime = isDownbeat ? 0.045 : isSubdivision ? 0.025 : 0.035;

        // Rampa suave de 5ms anti-pop
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);
        gain.gain.setValueAtTime(0, t + decayTime + 0.005);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t);
        osc.stop(t + decayTime + 0.01);

        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch {}
        };
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

    subOsc.onended = () => {
      try {
        subOsc.disconnect();
        sawOsc.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {}
    };
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
