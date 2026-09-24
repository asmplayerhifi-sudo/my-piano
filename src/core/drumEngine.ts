/**
 * DrumEngine — Motor de Percussão Sintético de Alta Fidelidade
 *
 * Sintetiza cada instrumento de percussão usando técnicas específicas:
 * - Bumbo: oscilador senoidal com pitch sweep + membranas
 * - Caixa: noise branco filtrado + transiente de oscilador
 * - Chimbal: noise filtrado por high-pass / bandpass
 * - Toms: osciladores de frequência média com sustain
 * - Percussões étnicas: síntese específica por tipo
 */

class DrumEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  private initContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    const AudioCtx = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx({ latencyHint: 'interactive', sampleRate: 44100 });

    // Compressor master para coesão da mix
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  public async ensureReady(): Promise<boolean> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); return true; } catch { return false; }
    }
    return true;
  }

  public getCurrentTime(): number {
    this.initContext();
    return this.ctx?.currentTime ?? performance.now() / 1000;
  }

  private get output(): AudioNode {
    return this.compressor!;
  }

  // ── Bumbo (Kick) ──────────────────────────────────────────────────────────
  // Pitch sweep de 80→40Hz com envelope curto — som profundo e encorpado
  public playKick(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 * v, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);

    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.95 * v, t + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.output);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // ── Caixa (Snare) ─────────────────────────────────────────────────────────
  // Noise branco + oscilador + filtro bandpass para crack papelão claro
  public playSnare(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    // Corpo tonal
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
    oscGain.gain.setValueAtTime(0.35 * v, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.output);
    osc.start(t);
    osc.stop(t + 0.15);

    // Corpo de noise
    const buf = this.createNoiseBuf(0.25);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, t);
    noiseFilter.Q.setValueAtTime(0.7, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, t);
    noiseGain.gain.linearRampToValueAtTime(0.7 * v, t + 0.002);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.output);
    noise.start(t);
    noise.stop(t + 0.25);
  }

  // ── Rimshot ───────────────────────────────────────────────────────────────
  public playRimshot(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);
    gainNode.gain.setValueAtTime(0.5 * v, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gainNode);
    gainNode.connect(this.output);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // ── Chimbal Fechado (Closed HH) ───────────────────────────────────────────
  public playHihatClosed(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const buf = this.createNoiseBuf(0.08);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.4 * v, t + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.output);
    noise.start(t);
    noise.stop(t + 0.08);
  }

  // ── Chimbal Aberto (Open HH) ──────────────────────────────────────────────
  public playHihatOpen(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const buf = this.createNoiseBuf(0.35);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8000, t);
    filter.Q.setValueAtTime(0.5, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.45 * v, t + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.output);
    noise.start(t);
    noise.stop(t + 0.35);
  }

  // ── Clap (eletrônico) ─────────────────────────────────────────────────────
  // 3 bursts de noise muito curtos em rápida sucessão
  public playClap(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    for (let i = 0; i < 3; i++) {
      const offset = i * 0.012;
      const buf = this.createNoiseBuf(0.06);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t + offset);
      filter.Q.setValueAtTime(1.5, t + offset);
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, t + offset);
      gainNode.gain.linearRampToValueAtTime(0.55 * v, t + offset + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.05);
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.output);
      noise.start(t + offset);
      noise.stop(t + offset + 0.06);
    }
  }

  // ── Tom (genérico com frequência variável) ────────────────────────────────
  private playTom(freq: number, time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.08);
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.75 * v, t + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gainNode);
    gainNode.connect(this.output);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  public playTomHigh(time?: number, velocity = 1.0) { this.playTom(220, time, velocity); }
  public playTomMid(time?: number, velocity = 1.0)  { this.playTom(160, time, velocity); }
  public playTomFloor(time?: number, velocity = 1.0){ this.playTom(100, time, velocity); }

  // ── Cowbell ───────────────────────────────────────────────────────────────
  public playCowbell(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const freqs = [562, 845];
    for (const freq of freqs) {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gainNode.gain.setValueAtTime(0.25 * v, t);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gainNode);
      gainNode.connect(this.output);
      osc.start(t);
      osc.stop(t + 0.55);
    }
  }

  // ── Triângulo (percussão nordestina) ──────────────────────────────────────
  // Toque puro metálico — sino de alta frequência com longo sustain
  public playTriangle(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const freqs = [2500, 5000, 7500];
    for (const freq of freqs) {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gainNode.gain.setValueAtTime(0.18 * v, t);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc.connect(gainNode);
      gainNode.connect(this.output);
      osc.start(t);
      osc.stop(t + 1.3);
    }
  }

  // ── Agogô ─────────────────────────────────────────────────────────────────
  public playAgogo(time?: number, velocity = 1.0, high = false) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));
    const freq = high ? 900 : 680;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gainNode.gain.setValueAtTime(0.3 * v, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc.connect(gainNode);
    gainNode.connect(this.output);
    osc.start(t);
    osc.stop(t + 0.65);
  }

  // ── Pandeiro / Tambourine ─────────────────────────────────────────────────
  public playTambourine(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    // Golpe principal (couro)
    const buf = this.createNoiseBuf(0.1);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4000, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.4 * v, t + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.output);
    noise.start(t);
    noise.stop(t + 0.1);

    // Platinelas (tinidos metálicos)
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const og = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3000 + i * 800, t + i * 0.008);
      og.gain.setValueAtTime(0.08 * v, t + i * 0.008);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12 + i * 0.008);
      osc.connect(og);
      og.connect(this.output);
      osc.start(t + i * 0.008);
      osc.stop(t + 0.15);
    }
  }

  // ── Shaker ────────────────────────────────────────────────────────────────
  public playShaker(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const buf = this.createNoiseBuf(0.12);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(5000, t);
    filter.Q.setValueAtTime(2.5, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.25 * v, t + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.output);
    noise.start(t);
    noise.stop(t + 0.13);
  }

  // ── Dispatcher universal pelo nome do pad ────────────────────────────────
  public playDrum(padKey: string, time?: number, velocity = 1.0) {
    switch (padKey) {
      case 'kick':        return this.playKick(time, velocity);
      case 'snare':       return this.playSnare(time, velocity);
      case 'hihatClosed': return this.playHihatClosed(time, velocity);
      case 'hihatOpen':   return this.playHihatOpen(time, velocity);
      case 'clap':        return this.playClap(time, velocity);
      case 'rimshot':     return this.playRimshot(time, velocity);
      case 'tomHigh':     return this.playTomHigh(time, velocity);
      case 'tomMid':      return this.playTomMid(time, velocity);
      case 'tomFloor':    return this.playTomFloor(time, velocity);
      case 'cowbell':     return this.playCowbell(time, velocity);
      case 'triangle':    return this.playTriangle(time, velocity);
      case 'agogo':       return this.playAgogo(time, velocity);
      case 'tambourine':  return this.playTambourine(time, velocity);
      case 'shaker':      return this.playShaker(time, velocity);
    }
  }

  // ── Utilitário: buffer de ruído branco ───────────────────────────────────
  private createNoiseBuf(durationSec: number): AudioBuffer {
    const ctx = this.ctx!;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.ceil(sr * durationSec), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }
}

export const drumEngine = new DrumEngine();
