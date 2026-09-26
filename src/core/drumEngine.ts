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

export type DrumKitId = 'acoustic' | 'piseiro' | 'tr808' | 'regional' | 'power_rock';

export interface DrumKitInfo {
  id: DrumKitId;
  name: string;
  shortName: string;
  description: string;
}

export const DRUM_KITS: DrumKitInfo[] = [
  { id: 'acoustic',   name: 'Kit Acústico Estúdio',     shortName: 'Acústico', description: 'Bateria acústica quente com bumbo encorpado e caixa aveludada' },
  { id: 'piseiro',    name: 'Kit Piseiro / Paredão',    shortName: 'Piseiro',  description: 'Bumbo seco de ataque rápido, clap cortante e pratos brilhantes' },
  { id: 'tr808',      name: 'Kit Vintage TR-808',       shortName: 'TR-808',   description: 'Sub-grave analógico profundo, caixa clássica e cowbell 808' },
  { id: 'regional',   name: 'Kit Regional Nordestino',  shortName: 'Regional', description: 'Zabumba potente de pele animal, triângulo estalado e pandeiro' },
  { id: 'power_rock', name: 'Kit Power Rock Estúdio',   shortName: 'Power Rock', description: 'Bumbo de arena com punch de 60Hz, caixa pesada e toms abertos' },
];

export type StemId = 'drums' | 'cymbals' | 'percussion' | 'bass' | 'harmony';

export interface StemChannelState {
  volume: number; // 0..1.5
  pan: number;    // -1..1
  muted: boolean;
  solo: boolean;
}

class DrumEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // Stems mixer nodes
  private stemGains: Map<StemId, GainNode> = new Map();
  private stemPanners: Map<StemId, StereoPannerNode> = new Map();

  // State
  private currentKit: DrumKitId = 'acoustic';
  private humanizeAmount: number = 0.25; // 0..1
  private stemStates: Record<StemId, StemChannelState> = {
    drums:      { volume: 1.0, pan: 0.0, muted: false, solo: false },
    cymbals:    { volume: 0.9, pan: 0.1, muted: false, solo: false },
    percussion: { volume: 0.95, pan: -0.1, muted: false, solo: false },
    bass:       { volume: 1.0, pan: 0.0, muted: false, solo: false },
    harmony:    { volume: 0.85, pan: 0.15, muted: false, solo: false },
  };

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

    // Inicializa barramentos de Stems
    const stemIds: StemId[] = ['drums', 'cymbals', 'percussion', 'bass', 'harmony'];
    for (const sid of stemIds) {
      const g = this.ctx.createGain();
      const p = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      if (p) {
        g.connect(p);
        p.connect(this.compressor);
        this.stemPanners.set(sid, p);
      } else {
        g.connect(this.compressor);
      }
      this.stemGains.set(sid, g);
    }
    this.updateStemRouting();
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

  // ── Controle de Stems Mixer ──────────────────────────────────────────────
  public getStemNode(stemId: StemId): AudioNode {
    this.initContext();
    return this.stemGains.get(stemId) || this.compressor!;
  }

  public setStemVolume(stemId: StemId, volume: number) {
    this.stemStates[stemId].volume = Math.max(0, Math.min(1.5, volume));
    this.updateStemRouting();
  }

  public setStemPan(stemId: StemId, pan: number) {
    this.stemStates[stemId].pan = Math.max(-1, Math.min(1, pan));
    const p = this.stemPanners.get(stemId);
    if (p && this.ctx) {
      p.pan.setValueAtTime(this.stemStates[stemId].pan, this.ctx.currentTime);
    }
  }

  public setStemMute(stemId: StemId, muted: boolean) {
    this.stemStates[stemId].muted = muted;
    this.updateStemRouting();
  }

  public setStemSolo(stemId: StemId, solo: boolean) {
    this.stemStates[stemId].solo = solo;
    this.updateStemRouting();
  }

  public getStemStates(): Record<StemId, StemChannelState> {
    return { ...this.stemStates };
  }

  public setKit(kitId: DrumKitId) {
    this.currentKit = kitId;
  }

  public getKit(): DrumKitId {
    return this.currentKit;
  }

  public setHumanize(amount: number) {
    this.humanizeAmount = Math.max(0, Math.min(1, amount));
  }

  public getHumanize(): number {
    return this.humanizeAmount;
  }

  private updateStemRouting() {
    if (!this.ctx) return;
    const anySolo = Object.values(this.stemStates).some(s => s.solo);

    for (const [sid, state] of Object.entries(this.stemStates) as [StemId, StemChannelState][]) {
      const g = this.stemGains.get(sid);
      if (!g) continue;

      let effectiveGain = state.volume;
      if (state.muted) {
        effectiveGain = 0;
      } else if (anySolo && !state.solo) {
        effectiveGain = 0;
      }

      g.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
    }
  }


  // ── Bumbo (Kick) ──────────────────────────────────────────────────────────
  public playKick(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    let startFreq = 160;
    let endFreq = 40;
    let sweepTime = 0.06;
    let decayTime = 0.4;
    let peakGain = 0.95;

    if (this.currentKit === 'piseiro') {
      // Kick seco, punchy, rápido para paredão
      startFreq = 220;
      endFreq = 52;
      sweepTime = 0.035;
      decayTime = 0.22;
      peakGain = 1.05;
    } else if (this.currentKit === 'tr808') {
      // Sub analógico com cauda profunda
      startFreq = 130;
      endFreq = 36;
      sweepTime = 0.12;
      decayTime = 0.65;
      peakGain = 1.0;
    } else if (this.currentKit === 'regional') {
      // Zabumba nordestina: grave encorpado com estalo de couro
      startFreq = 180;
      endFreq = 48;
      sweepTime = 0.07;
      decayTime = 0.45;
      peakGain = 1.0;
    } else if (this.currentKit === 'power_rock') {
      startFreq = 190;
      endFreq = 45;
      sweepTime = 0.055;
      decayTime = 0.38;
      peakGain = 1.0;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq * v, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + sweepTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, t);

    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(peakGain * v, t + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.getStemNode('drums'));
    osc.start(t);
    osc.stop(t + decayTime + 0.05);

    // Se for Regional (Zabumba), adiciona estalo superior da baqueta na pele
    if (this.currentKit === 'regional') {
      const slapOsc = this.ctx.createOscillator();
      const slapGain = this.ctx.createGain();
      slapOsc.type = 'triangle';
      slapOsc.frequency.setValueAtTime(450, t);
      slapOsc.frequency.exponentialRampToValueAtTime(110, t + 0.02);
      slapGain.gain.setValueAtTime(0.35 * v, t);
      slapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      slapOsc.connect(slapGain);
      slapGain.connect(this.getStemNode('drums'));
      slapOsc.start(t);
      slapOsc.stop(t + 0.04);
    }
  }

  // ── Caixa (Snare) ─────────────────────────────────────────────────────────
  public playSnare(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    let toneFreq = 180;
    let noiseFilterFreq = 1800;
    let noiseDecay = 0.22;

    if (this.currentKit === 'piseiro') {
      toneFreq = 220;
      noiseFilterFreq = 2600;
      noiseDecay = 0.14; // Caixa seca e cortante
    } else if (this.currentKit === 'tr808') {
      toneFreq = 170;
      noiseFilterFreq = 1600;
      noiseDecay = 0.26;
    } else if (this.currentKit === 'power_rock') {
      toneFreq = 200;
      noiseFilterFreq = 2200;
      noiseDecay = 0.32;
    } else if (this.currentKit === 'regional') {
      toneFreq = 240;
      noiseFilterFreq = 2400;
      noiseDecay = 0.16;
    }

    // Corpo tonal
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(toneFreq, t);
    osc.frequency.exponentialRampToValueAtTime(toneFreq * 0.55, t + 0.08);
    oscGain.gain.setValueAtTime(0.38 * v, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.getStemNode('drums'));
    osc.start(t);
    osc.stop(t + 0.15);

    // Corpo de ruído (esteira)
    const buf = this.createNoiseBuf(0.3);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(noiseFilterFreq, t);
    noiseFilter.Q.setValueAtTime(0.8, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, t);
    noiseGain.gain.linearRampToValueAtTime(0.75 * v, t + 0.002);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + noiseDecay);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.getStemNode('drums'));
    noise.start(t);
    noise.stop(t + noiseDecay + 0.02);
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
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.035);
    gainNode.gain.setValueAtTime(0.55 * v, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    osc.connect(gainNode);
    gainNode.connect(this.getStemNode('drums'));
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
    filter.frequency.setValueAtTime(this.currentKit === 'piseiro' ? 8500 : 7000, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.42 * v, t + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.getStemNode('cymbals'));
    noise.start(t);
    noise.stop(t + 0.07);
  }

  // ── Chimbal Aberto (Open HH) ──────────────────────────────────────────────
  public playHihatOpen(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const buf = this.createNoiseBuf(0.4);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8500, t);
    filter.Q.setValueAtTime(0.6, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.48 * v, t + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.getStemNode('cymbals'));
    noise.start(t);
    noise.stop(t + 0.35);
  }

  // ── Clap ──────────────────────────────────────────────────────────────────
  public playClap(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    for (let i = 0; i < 3; i++) {
      const offset = i * 0.011;
      const buf = this.createNoiseBuf(0.06);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(this.currentKit === 'piseiro' ? 1400 : 1200, t + offset);
      filter.Q.setValueAtTime(1.6, t + offset);
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, t + offset);
      gainNode.gain.linearRampToValueAtTime(0.6 * v, t + offset + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.05);
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.getStemNode('percussion'));
      noise.start(t + offset);
      noise.stop(t + offset + 0.06);
    }
  }

  // ── Toms ──────────────────────────────────────────────────────────────────
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
    gainNode.gain.linearRampToValueAtTime(0.8 * v, t + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    osc.connect(gainNode);
    gainNode.connect(this.getStemNode('drums'));
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
      gainNode.gain.setValueAtTime(0.28 * v, t);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      osc.connect(gainNode);
      gainNode.connect(this.getStemNode('cymbals'));
      osc.start(t);
      osc.stop(t + 0.5);
    }
  }

  // ── Triângulo ─────────────────────────────────────────────────────────────
  public playTriangle(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    const freqs = [2800, 5600, 8400];
    for (const freq of freqs) {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gainNode.gain.setValueAtTime(0.19 * v, t);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(gainNode);
      gainNode.connect(this.getStemNode('percussion'));
      osc.start(t);
      osc.stop(t + 1.2);
    }
  }

  // ── Agogô ─────────────────────────────────────────────────────────────────
  public playAgogo(time?: number, velocity = 1.0, high = false) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));
    const freq = high ? 920 : 690;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gainNode.gain.setValueAtTime(0.32 * v, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    osc.connect(gainNode);
    gainNode.connect(this.getStemNode('percussion'));
    osc.start(t);
    osc.stop(t + 0.6);
  }

  // ── Pandeiro / Tambourine ─────────────────────────────────────────────────
  public playTambourine(time?: number, velocity = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    // Golpe de polegar no couro
    const buf = this.createNoiseBuf(0.1);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3800, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.42 * v, t + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.getStemNode('percussion'));
    noise.start(t);
    noise.stop(t + 0.1);

    // Platinelas (tinidos metálicos)
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const og = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200 + i * 850, t + i * 0.007);
      og.gain.setValueAtTime(0.09 * v, t + i * 0.007);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.11 + i * 0.007);
      osc.connect(og);
      og.connect(this.getStemNode('percussion'));
      osc.start(t + i * 0.007);
      osc.stop(t + 0.14);
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
    filter.frequency.setValueAtTime(5400, t);
    filter.Q.setValueAtTime(2.2, t);
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(0.28 * v, t + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.095);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.getStemNode('percussion'));
    noise.start(t);
    noise.stop(t + 0.12);
  }

  // ── Acompanhamento: Baixo Estilístico ─────────────────────────────────────
  public playBass(midiNote: number, time?: number, duration = 0.35, velocity = 0.8) {
    this.initContext();
    if (!this.ctx) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc.type = this.currentKit === 'piseiro' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.currentKit === 'piseiro' ? 950 : 550, t);
    filter.frequency.exponentialRampToValueAtTime(160, t + Math.min(0.2, duration * 0.7));

    gainNode.gain.setValueAtTime(0.001, t);
    gainNode.gain.linearRampToValueAtTime(0.65 * v, t + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.getStemNode('bass'));

    osc.start(t);
    subOsc.start(t);
    osc.stop(t + duration + 0.05);
    subOsc.stop(t + duration + 0.05);
  }

  // ── Acompanhamento: Acordes Harmônicos ────────────────────────────────────
  public playChord(midiNotes: number[], time?: number, duration = 0.8, velocity = 0.7) {
    this.initContext();
    if (!this.ctx || midiNotes.length === 0) return;
    const t = Math.max(this.ctx.currentTime, time ?? this.ctx.currentTime);
    const v = Math.min(1, Math.max(0.1, velocity));

    midiNotes.forEach((midi, idx) => {
      const noteTime = t + idx * 0.006;
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime((0.36 / Math.sqrt(midiNotes.length)) * v, noteTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.getStemNode('harmony'));

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
    });
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
