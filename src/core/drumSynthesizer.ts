/**
 * Sintetizador Analógico & Acústico de Bateria e Percussão via Web Audio API.
 * Gera sons de percussão em tempo real sem latência ou dependência de arquivos externos.
 */

import { soundEngine } from './soundEngine';

class DrumSynthesizer {
  private noiseBuffer: AudioBuffer | null = null;

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer || this.noiseBuffer.sampleRate !== ctx.sampleRate) {
      const bufferSize = ctx.sampleRate * 2; // 2 segundos de ruído branco de alta densidade
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  /**
   * Bumbo (Kick Drum): Golpe inicial encorpado com queda de frequência rápida e sustentação sub-grave.
   */
  public playKick(time?: number, velocity = 0.9, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    // 1. Oscilador principal de tom com pitch drop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(155, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.085);

    gain.gain.setValueAtTime(1.0 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.33);

    // 2. Click de ataque para dar definição (punch)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(320, t);
    clickOsc.frequency.exponentialRampToValueAtTime(50, t + 0.02);

    clickGain.gain.setValueAtTime(0.5 * vel, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(dest);

    clickOsc.start(t);
    clickOsc.stop(t + 0.026);
  }

  /**
   * Caixa (Snare Drum): Combinação de corpo tonal (180 Hz) e esteira de ruído metálico.
   */
  public playSnare(time?: number, velocity = 0.8, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    // 1. Corpo tonal da caixa
    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();

    toneOsc.type = 'triangle';
    toneOsc.frequency.setValueAtTime(190, t);
    toneOsc.frequency.exponentialRampToValueAtTime(95, t + 0.06);

    toneGain.gain.setValueAtTime(0.7 * vel, t);
    toneGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    toneOsc.connect(toneGain);
    toneGain.connect(dest);

    toneOsc.start(t);
    toneOsc.stop(t + 0.13);

    // 2. Esteira de ruído (Snare wire)
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85 * vel, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(t);
    noise.stop(t + 0.23);
  }

  /**
   * Chimbal (Hi-Hat): Fechado (curto e metálico) ou Aberto (com sustentação estaladiça).
   */
  public playHiHat(time?: number, isOpen = false, velocity = 0.7, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));
    const duration = isOpen ? 0.32 : 0.045;

    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    // Filtro passa-banda em frequências agudas metálicas
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(9500, t);
    bandpass.Q.setValueAtTime(1.8, t);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(7500, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.65 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(dest);

    noise.start(t);
    noise.stop(t + duration + 0.01);
  }

  /**
   * Rimshot / Aro de Madeira (Essencial para Bossa Nova, Samba e Reggae).
   */
  public playRimshot(time?: number, velocity = 0.8, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    // Ressonância em bloco de madeira / aro
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1250, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.025);

    gain.gain.setValueAtTime(0.9 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.055);
  }

  /**
   * Shaker / Chocalho (Perfeito para Bossa Nova, Pop e ritmos acústicos).
   */
  public playShaker(time?: number, velocity = 0.6, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8200, t);
    filter.Q.setValueAtTime(2.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.45 * vel, t + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(t);
    noise.stop(t + 0.085);
  }

  /**
   * Surdo Brasileiro / Tom Grave (Grave acústico brasileiro com ressonância profunda).
   */
  public playSurdo(time?: number, isAccent = true, velocity = 0.85, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = isAccent ? 98 : 82;
    const endFreq = isAccent ? 52 : 44;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.12);

    const decayTime = isAccent ? 0.38 : 0.22;
    gain.gain.setValueAtTime((isAccent ? 1.0 : 0.65) * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decayTime);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + decayTime + 0.01);
  }

  /**
   * Ride Cymbal (Prato de condução para Jazz Swing e Baladas).
   */
  public playRide(time?: number, velocity = 0.7, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(11000, t);
    bandpass.Q.setValueAtTime(3.0, t);

    // Adiciona ressonância harmônica metálica (bell do ride)
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(587.33, t); // D5

    bellGain.gain.setValueAtTime(0.2 * vel, t);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

    bellOsc.connect(bellGain);
    bellGain.connect(dest);
    bellOsc.start(t);
    bellOsc.stop(t + 0.46);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55 * vel, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(t);
    noise.stop(t + 0.56);
  }

  /**
   * Palmas / Handclap
   */
  public playClap(time?: number, velocity = 0.8, destinationNode?: AudioNode) {
    const ctx = soundEngine.getAudioContext();
    const dest = destinationNode || soundEngine.getMasterGain();
    if (!ctx || !dest) return;

    const t = Math.max(ctx.currentTime, time ?? ctx.currentTime);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    // 3 micro-estalos rápidos simulando mãos batendo juntas
    [0, 0.012, 0.024].forEach((offset, idx) => {
      const burstTime = t + offset;
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, burstTime);
      filter.Q.setValueAtTime(1.5, burstTime);

      const gain = ctx.createGain();
      const burstDur = idx === 2 ? 0.18 : 0.02;
      const burstGain = idx === 2 ? 0.8 * vel : 0.45 * vel;

      gain.gain.setValueAtTime(burstGain, burstTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, burstTime + burstDur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      noise.start(burstTime);
      noise.stop(burstTime + burstDur + 0.01);
    });
  }
}

export const drumSynthesizer = new DrumSynthesizer();
