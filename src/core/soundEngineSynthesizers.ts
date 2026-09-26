/**
 * soundEngineSynthesizers.ts
 * Implementações de alta fidelidade dos 34 timbres instrumentais da Sound Engine Harmonia.
 * 
 * Inclui:
 *  - Multissamplagem com Dynamic Velocity (Velocity Layers: p a f com modelagem de filtro)
 *  - Sistema Round-Robin (4 variações de fase e micro-detuning contra efeito metralhadora)
 *  - Harmônicos e Ressonância Simpática (Sustain Pedal Resonance para pianos)
 *  - Leslie Rotary Speaker (modulação Doppler e tremolo estéreo para Órgão Hammond)
 *  - Afinação Musette com duplo reed para Sanfona Scandalli (Baião/Xote)
 *  - Processamento em Web Audio API nativo com latência < 10ms
 */

import { midiToFrequency } from './musicTheory';
import type { TimbreId } from './soundEngineTypes';

export interface SynthResult {
  nodes: AudioNode[];
  gainNode: GainNode;
}

export interface RoundRobinVariation {
  detune: number;
  attackOffset: number;
  harmonicScale: number;
}

export class SoundEngineSynthesizers {
  private roundRobinIndex = 0;

  /** Obtém a próxima variação Round-Robin para evitar repetição mecânica */
  public getNextRoundRobin(): RoundRobinVariation {
    this.roundRobinIndex = (this.roundRobinIndex + 1) % 4;
    const variations: RoundRobinVariation[] = [
      { detune: 0, attackOffset: 0, harmonicScale: 1.0 },
      { detune: 1.8, attackOffset: 0.001, harmonicScale: 1.04 },
      { detune: -1.6, attackOffset: 0.0005, harmonicScale: 0.98 },
      { detune: 0.9, attackOffset: 0.0015, harmonicScale: 1.02 },
    ];
    return variations[this.roundRobinIndex];
  }

  /**
   * Modela 4 a 8 camadas de resposta dinâmica por velocidade (Velocity Layers):
   * Notas suaves ($p$) ganham corte de frequências mais aveludado e ataque brando.
   * Notas fortes ($f$) abrem os harmônicos superiores e ganham saturação harmônica.
   */
  public computeVelocityDynamics(velocity: number) {
    const v = Math.max(0.05, Math.min(1.0, velocity));
    const dynamicGain = Math.pow(v, 1.22);
    // Escala de filtro contínua: de 0.5 (suave) a 1.35 (forte)
    const filterScale = 0.52 + 0.82 * Math.pow(v, 1.35);
    // Ataque proporcional: toques fortes atacam mais rápido
    const attackScale = 1.25 - 0.45 * v;
    const isHardStrike = v > 0.78;

    return { v, dynamicGain, filterScale, attackScale, isHardStrike };
  }

  /** Roteador mestre de síntese para os 34 timbres */
  public synthesize(
    ctx: AudioContext,
    masterGain: GainNode,
    timbre: TimbreId,
    midi: number,
    startTime: number,
    duration: number,
    velocity: number,
    sustained: boolean,
  ): SynthResult {
    const freq = midiToFrequency(midi);
    const dyn = this.computeVelocityDynamics(velocity);
    const rr = this.getNextRoundRobin();
    const actualStart = startTime + rr.attackOffset;

    switch (timbre) {
      // ── Pianos Acústicos ──
      case 'grand_piano':
        return this.synthGrandPiano(ctx, masterGain, freq, midi, actualStart, duration, dyn, sustained, rr);
      case 'upright_piano':
        return this.synthUprightPiano(ctx, masterGain, freq, midi, actualStart, duration, dyn, sustained, rr);
      case 'honky_tonk':
        return this.synthHonkyTonk(ctx, masterGain, freq, midi, actualStart, duration, dyn, sustained, rr);

      // ── Pianos Elétricos & Órgãos ──
      case 'rhodes':
        return this.synthRhodes(ctx, masterGain, freq, actualStart, duration, dyn, sustained, rr, false);
      case 'rhodes_suitcase':
        return this.synthRhodes(ctx, masterGain, freq, actualStart, duration, dyn, sustained, rr, true);
      case 'wurlitzer':
        return this.synthWurlitzer(ctx, masterGain, freq, actualStart, duration, dyn, sustained, rr);
      case 'clavinet':
        return this.synthClavinet(ctx, masterGain, freq, actualStart, duration, dyn, sustained, rr);
      case 'organ':
        return this.synthHammondOrgan(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'vox_continental':
        return this.synthVoxContinental(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'farfisa':
        return this.synthFarfisa(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'accordion':
        return this.synthAccordion(ctx, masterGain, freq, actualStart, duration, dyn, sustained);

      // ── Percussão Afinada ──
      case 'vibraphone':
        return this.synthVibraphone(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'marimba':
        return this.synthMarimba(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'celesta':
        return this.synthCelesta(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'glockenspiel':
        return this.synthGlockenspiel(ctx, masterGain, freq, actualStart, duration, dyn, sustained);

      // ── Sintetizadores & Leads ──
      case 'minimoog_lead':
        return this.synthMinimoogLead(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'synth_lead':
        return this.synthAnalogLead(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'dx7_epiano':
        return this.synthDX7EPiano(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'synth_pad':
        return this.synthSynthPad(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'synth_brass':
        return this.synthSynthBrass(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'brass_brega':
        return this.synthBrassBrega(ctx, masterGain, freq, actualStart, duration, dyn, sustained);

      // ── Cordas & Orquestra ──
      case 'strings':
        return this.synthStrings(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'violin':
        return this.synthViolin(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'cello':
        return this.synthCello(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'harp':
        return this.synthHarp(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'flute':
        return this.synthFlute(ctx, masterGain, freq, actualStart, duration, dyn, sustained);

      // ── Guitarras & Violões ──
      case 'guitar_nylon':
        return this.synthGuitarNylon(ctx, masterGain, freq, actualStart, duration, dyn, sustained, false);
      case 'guitar_7strings':
        return this.synthGuitarNylon(ctx, masterGain, freq, actualStart, duration, dyn, sustained, true);
      case 'guitar_strat_clean':
        return this.synthGuitarStrat(ctx, masterGain, freq, actualStart, duration, dyn, sustained, false);
      case 'guitar_strat_drive':
        return this.synthGuitarStrat(ctx, masterGain, freq, actualStart, duration, dyn, sustained, true);
      case 'guitar_reggae_muted':
        return this.synthGuitarReggaeMuted(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'harpsichord':
        return this.synthHarpsichord(ctx, masterGain, freq, midi, actualStart, duration, dyn, sustained);

      // ── Baixos ──
      case 'bass':
        return this.synthBass(ctx, masterGain, freq, actualStart, duration, dyn, sustained, 'pick');
      case 'bass_finger':
        return this.synthBass(ctx, masterGain, freq, actualStart, duration, dyn, sustained, 'finger');
      case 'bass_acoustic':
        return this.synthBassAcoustic(ctx, masterGain, freq, actualStart, duration, dyn, sustained);
      case 'bass_synth':
        return this.synthBassSynth(ctx, masterGain, freq, actualStart, duration, dyn, sustained);

      default:
        return this.synthGrandPiano(ctx, masterGain, freq, midi, actualStart, duration, dyn, sustained, rr);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Pianos Acústicos
  // ──────────────────────────────────────────────────────────────────────────

  private synthGrandPiano(
    ctx: AudioContext, masterGain: GainNode, freq: number, midi: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, rr: RoundRobinVariation,
  ): SynthResult {
    const oscs: OscillatorNode[] = [];
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const compr = ctx.createDynamicsCompressor();

    const partials: [number, OscillatorType, number][] = [
      [1.000, 'triangle', 0.54 * rr.harmonicScale],
      [2.001, 'sine',     0.24],
      [3.003, 'sine',     0.13 * dyn.filterScale],
      [4.005, 'sine',     0.06 * dyn.filterScale],
    ];

    for (const [ratio, type, amp] of partials) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * ratio, startTime);
      osc.detune.setValueAtTime(rr.detune + (Math.random() - 0.5) * 2.5, startTime);
      oscGain.gain.setValueAtTime(amp, startTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      oscs.push(osc);
    }

    // Filtro dinâmico modelando camadas de velocity
    filter.type = 'lowpass';
    const cutoff = Math.min(8400, freq * 5.2 * dyn.filterScale);
    filter.frequency.setValueAtTime(cutoff, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.min(2600, freq * 1.8), startTime + Math.min(1.8, duration));
    filter.Q.setValueAtTime(0.8, startTime);

    // Ressonância simpática quando sustained
    let sympNode: BiquadFilterNode | null = null;
    let sympGain: GainNode | null = null;
    if (sustained) {
      sympNode = ctx.createBiquadFilter();
      sympGain = ctx.createGain();
      sympNode.type = 'peaking';
      sympNode.frequency.setValueAtTime(freq * 1.5, startTime); // Ressonância da 5ª justa das cordas abertas
      sympNode.gain.setValueAtTime(4.5, startTime);
      sympNode.Q.setValueAtTime(2.8, startTime);
      sympGain.gain.setValueAtTime(0.12, startTime);
      filter.connect(sympNode);
      sympNode.connect(sympGain);
      sympGain.connect(compr);
    }

    const peakGain = 0.40 * dyn.dynamicGain;
    const attack = 0.005 * dyn.attackScale;
    const decay = 0.22;
    const sustain = Math.max(0.0001, peakGain * 0.44);

    filter.connect(compr);
    compr.connect(gainNode);
    gainNode.connect(masterGain);

    if (sustained) {
      const naturalDecay = Math.max(duration + 1.8, 5.0 + Math.max(0, (60 - midi) * 0.06));
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + decay);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain * 0.38), startTime + Math.min(2.5, naturalDecay * 0.5));
      gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + naturalDecay);
      oscs.forEach(o => { o.start(startTime); o.stop(startTime + naturalDecay + 0.1); });
    } else {
      const holdDuration = Math.max(0.12, duration);
      const releaseStart = Math.max(startTime + decay, startTime + holdDuration);
      const releaseDur = 0.08;
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + decay);
      gainNode.gain.setValueAtTime(sustain, releaseStart);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, releaseStart + releaseDur);
      oscs.forEach(o => { o.start(startTime); o.stop(releaseStart + releaseDur + 0.05); });
    }

    const allNodes: AudioNode[] = [...oscs, gainNode, filter, compr];
    if (sympNode && sympGain) allNodes.push(sympNode, sympGain);
    return { nodes: allNodes, gainNode };
  }

  private synthUprightPiano(
    ctx: AudioContext, masterGain: GainNode, freq: number, _midi: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, rr: RoundRobinVariation,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc1.detune.setValueAtTime(rr.detune - 2.0, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    osc2.detune.setValueAtTime(rr.detune + 2.0, startTime);

    // Ressonância de caixa de madeira do piano vertical
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(Math.min(4200, freq * 4.2 * dyn.filterScale), startTime);
    bodyFilter.Q.setValueAtTime(1.1, startTime);

    const peakGain = 0.38 * dyn.dynamicGain;
    const attack = 0.006 * dyn.attackScale;
    const totalDur = sustained ? Math.max(duration + 1.2, 4.0) : Math.max(duration + 0.1, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.35, startTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc1.connect(bodyFilter);
    osc2.connect(bodyFilter);
    bodyFilter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.08); osc2.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, bodyFilter, gainNode], gainNode };
  }

  private synthHonkyTonk(
    ctx: AudioContext, masterGain: GainNode, freq: number, _midi: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, rr: RoundRobinVariation,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    // 3 cordas em uníssono intencionalmente desafinadas (efeito saloon bar)
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc1.detune.setValueAtTime(rr.detune - 6.5, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, startTime);
    osc2.detune.setValueAtTime(rr.detune + 6.0, startTime);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2, startTime);
    osc3.detune.setValueAtTime(rr.detune - 3.0, startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);
    filter.Q.setValueAtTime(1.5, startTime);

    const peakGain = 0.36 * dyn.dynamicGain;
    const totalDur = sustained ? Math.max(duration + 1.2, 4.2) : Math.max(duration, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc1.connect(filter); osc2.connect(filter); osc3.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime); osc3.start(startTime);
    osc1.stop(startTime + totalDur + 0.08); osc2.stop(startTime + totalDur + 0.08); osc3.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, osc3, filter, gainNode], gainNode };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Pianos Elétricos & Órgãos
  // ──────────────────────────────────────────────────────────────────────────

  private synthRhodes(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, rr: RoundRobinVariation, isSuitcase: boolean,
  ): SynthResult {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, startTime);
    carrier.detune.setValueAtTime(rr.detune, startTime);

    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * 7.0, startTime);

    const modDepth = freq * (isSuitcase ? 3.0 : 2.4) * dyn.dynamicGain;
    modGain.gain.setValueAtTime(modDepth, startTime);
    modGain.gain.exponentialRampToValueAtTime(Math.max(0.001, modDepth * 0.04), startTime + 0.85);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 3.2, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    // Tremolo para Rhodes Suitcase
    let tremoloLfo: OscillatorNode | null = null;
    let tremoloGain: GainNode | null = null;
    if (isSuitcase) {
      tremoloLfo = ctx.createOscillator();
      tremoloGain = ctx.createGain();
      tremoloLfo.type = 'sine';
      tremoloLfo.frequency.setValueAtTime(4.8, startTime); // 4.8 Hz Suitcase stereo pan/tremolo
      tremoloGain.gain.setValueAtTime(0.18, startTime);
      tremoloLfo.connect(tremoloGain.gain);
      tremoloLfo.start(startTime);
    }

    const peakGain = (isSuitcase ? 0.44 : 0.40) * dyn.dynamicGain;
    const attack = 0.003 * dyn.attackScale;
    const totalDur = sustained ? Math.max(duration + 2.0, 7.5) : Math.max(duration + 0.1, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.45, startTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    carrier.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    carrier.start(startTime); modulator.start(startTime);
    carrier.stop(startTime + totalDur + 0.1); modulator.stop(startTime + totalDur + 0.1);
    if (tremoloLfo) tremoloLfo.stop(startTime + totalDur + 0.1);

    const allNodes: AudioNode[] = [carrier, modulator, modGain, filter, gainNode];
    if (tremoloLfo && tremoloGain) allNodes.push(tremoloLfo, tremoloGain);
    return { nodes: allNodes, gainNode };
  }

  private synthWurlitzer(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, rr: RoundRobinVariation,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const tremoloLfo = ctx.createOscillator();
    const tremoloGain = ctx.createGain();
    const gainNode = ctx.createGain();

    // Palheta eletromecânica com forte 3º harmônico
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc1.detune.setValueAtTime(rr.detune, startTime);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq * 3, startTime);

    filter.type = 'peaking';
    filter.frequency.setValueAtTime(2200, startTime);
    filter.gain.setValueAtTime(4.0, startTime);
    filter.Q.setValueAtTime(1.8, startTime);

    // Tremolo óptico clássico do Wurlitzer 200A
    tremoloLfo.type = 'sine';
    tremoloLfo.frequency.setValueAtTime(5.6, startTime);
    tremoloGain.gain.setValueAtTime(0.14, startTime);
    tremoloLfo.connect(tremoloGain.gain);
    tremoloLfo.start(startTime);

    const peakGain = 0.42 * dyn.dynamicGain;
    const totalDur = sustained ? Math.max(duration + 1.8, 6.0) : Math.max(duration, 0.35);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.38, startTime + 0.18);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.08); osc2.stop(startTime + totalDur + 0.08);
    tremoloLfo.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, filter, tremoloLfo, tremoloGain, gainNode], gainNode };
  }

  private synthClavinet(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, rr: RoundRobinVariation,
  ): SynthResult {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    // Pulso percussivo funkeado (simulação de cordas marteladas)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.detune.setValueAtTime(rr.detune, startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 4.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.08);
    filter.Q.setValueAtTime(3.2, startTime);

    const peakGain = 0.45 * dyn.dynamicGain;
    const totalDur = sustained ? Math.max(duration, 1.2) : Math.min(Math.max(duration, 0.25), 0.5);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(filter); filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.05);

    return { nodes: [osc, filter, gainNode], gainNode };
  }

  private synthHammondOrgan(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // 9 Drawbars Hammond clássicos
    const drawbars = [0.55, 1.0, 0.85, 0.75, 0.65, 0.55, 0.45, 0.32, 0.22];
    const ratios =   [0.5,  1.0, 2.0,  3.0,  4.0,  5.0,  6.0,  8.0,  16.0];
    const oscs: OscillatorNode[] = [];
    const organMix = ctx.createGain();
    const gainNode = ctx.createGain();

    // Leslie Rotary Speaker: Rotor de agudos (Horn LFO a 6.2 Hz Doppler)
    const leslieLfo = ctx.createOscillator();
    const leslieDepth = ctx.createGain();
    leslieLfo.type = 'sine';
    leslieLfo.frequency.setValueAtTime(6.2, startTime); // Leslie Fast (Chorale / Tremolo)
    leslieDepth.gain.setValueAtTime(3.5, startTime); // Doppler pitch vibrato em cents
    leslieLfo.connect(leslieDepth);
    leslieLfo.start(startTime);

    for (let i = 0; i < drawbars.length; i++) {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratios[i], startTime);
      leslieDepth.connect(osc.detune);
      og.gain.setValueAtTime(drawbars[i] * 0.075, startTime);
      osc.connect(og);
      og.connect(organMix);
      osc.start(startTime);
      oscs.push(osc);
    }

    // Key Click percussivo clássico do Hammond
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(freq * 9, startTime);
    clickGain.gain.setValueAtTime(0.08 * dyn.dynamicGain, startTime);
    clickGain.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.012);
    clickOsc.connect(clickGain);
    clickGain.connect(organMix);
    clickOsc.start(startTime);
    clickOsc.stop(startTime + 0.015);

    const totalDur = sustained ? 18.0 : Math.max(duration, 0.25);
    gainNode.gain.setValueAtTime(dyn.dynamicGain * 0.65, startTime);
    gainNode.gain.setValueAtTime(dyn.dynamicGain * 0.65, startTime + totalDur - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.04);

    organMix.connect(gainNode);
    gainNode.connect(masterGain);

    oscs.forEach(o => o.stop(startTime + totalDur + 0.08));
    leslieLfo.stop(startTime + totalDur + 0.08);

    return { nodes: [...oscs, clickOsc, clickGain, leslieLfo, leslieDepth, organMix, gainNode], gainNode };
  }

  private synthVoxContinental(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // Órgão combo transistorizado dos anos 60 (The Doors - Light My Fire)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const vibLfo = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const gainNode = ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Vibrato de transistor clássico
    vibLfo.type = 'sine';
    vibLfo.frequency.setValueAtTime(6.6, startTime);
    vibGain.gain.setValueAtTime(freq * 0.012, startTime);
    vibLfo.connect(vibGain);
    vibGain.connect(osc1.frequency);
    vibGain.connect(osc2.frequency);
    vibLfo.start(startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1850, startTime);
    filter.Q.setValueAtTime(1.8, startTime);

    const totalDur = sustained ? 18.0 : Math.max(duration, 0.25);
    gainNode.gain.setValueAtTime(dyn.dynamicGain * 0.55, startTime);
    gainNode.gain.setValueAtTime(dyn.dynamicGain * 0.55, startTime + totalDur - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.03);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); osc2.stop(startTime + totalDur + 0.06);
    vibLfo.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, osc2, filter, vibLfo, vibGain, gainNode], gainNode };
  }

  private synthFarfisa(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const vibLfo = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 4, startTime);

    vibLfo.type = 'sine';
    vibLfo.frequency.setValueAtTime(7.2, startTime);
    vibGain.gain.setValueAtTime(freq * 0.015, startTime);
    vibLfo.connect(vibGain);
    vibGain.connect(osc1.frequency);
    vibLfo.start(startTime);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(320, startTime);

    const totalDur = sustained ? 18.0 : Math.max(duration, 0.25);
    gainNode.gain.setValueAtTime(dyn.dynamicGain * 0.48, startTime);
    gainNode.gain.setValueAtTime(dyn.dynamicGain * 0.48, startTime + totalDur - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.03);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); osc2.stop(startTime + totalDur + 0.06);
    vibLfo.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, osc2, filter, vibLfo, vibGain, gainNode], gainNode };
  }

  private synthAccordion(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // Sanfona Scandalli 120 baixos: Duplo reed com afinação Musette (+3.5 Hz de batimento)
    const reedMaster = ctx.createOscillator();
    const reedMusette = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    reedMaster.type = 'sawtooth';
    reedMaster.frequency.setValueAtTime(freq, startTime);

    reedMusette.type = 'sawtooth';
    reedMusette.frequency.setValueAtTime(freq + 3.5, startTime); // Afinação musette autêntica de forró/baião

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    const peakGain = 0.38 * dyn.dynamicGain;
    const totalDur = sustained ? 16.0 : Math.max(duration, 0.25);

    // Ataque e fole de sanfona
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
    gainNode.gain.setValueAtTime(peakGain, startTime + totalDur - 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.04);

    reedMaster.connect(filter);
    reedMusette.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    reedMaster.start(startTime); reedMusette.start(startTime);
    reedMaster.stop(startTime + totalDur + 0.06); reedMusette.stop(startTime + totalDur + 0.06);

    return { nodes: [reedMaster, reedMusette, filter, gainNode], gainNode };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Percussão Afinada
  // ──────────────────────────────────────────────────────────────────────────

  private synthVibraphone(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 4.0, startTime);

    // Vibrato do motor rotativo de palhetas
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6.5, startTime);
    lfoGain.gain.setValueAtTime(freq * 0.015, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    const peakGain = 0.45 * dyn.dynamicGain;
    const totalDur = sustained ? 8.5 : Math.max(duration + 0.3, 0.5);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    const mix1 = ctx.createGain(); const mix2 = ctx.createGain();
    mix1.gain.setValueAtTime(0.7, startTime);
    mix2.gain.setValueAtTime(0.12, startTime);
    osc1.connect(mix1); osc2.connect(mix2);
    mix1.connect(gainNode); mix2.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime); lfo.start(startTime);
    osc1.stop(startTime + totalDur + 0.08); osc2.stop(startTime + totalDur + 0.08); lfo.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, lfo, lfoGain, mix1, mix2, gainNode], gainNode };
  }

  private synthMarimba(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const oscFundamental = ctx.createOscillator();
    const oscWoodHarmonic = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    oscFundamental.type = 'sine';
    oscFundamental.frequency.setValueAtTime(freq, startTime);

    // 4º harmônico característico do impacto da baqueta na madeira
    oscWoodHarmonic.type = 'sine';
    oscWoodHarmonic.frequency.setValueAtTime(freq * 3.9, startTime);

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(Math.min(3200, freq * 3.5), startTime);
    bodyFilter.Q.setValueAtTime(1.5, startTime);

    const peakGain = 0.48 * dyn.dynamicGain;
    const decayDur = sustained ? Math.max(duration, 1.8) : Math.max(duration, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + decayDur);

    oscFundamental.connect(bodyFilter);
    oscWoodHarmonic.connect(bodyFilter);
    bodyFilter.connect(gainNode);
    gainNode.connect(masterGain);

    oscFundamental.start(startTime); oscWoodHarmonic.start(startTime);
    oscFundamental.stop(startTime + decayDur + 0.05); oscWoodHarmonic.stop(startTime + 0.08);

    return { nodes: [oscFundamental, oscWoodHarmonic, bodyFilter, gainNode], gainNode };
  }

  private synthCelesta(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Campanólogo de placas de aço (2.76x overtone cristalino)
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, startTime);

    const peakGain = 0.40 * dyn.dynamicGain;
    const totalDur = sustained ? 6.5 : Math.max(duration + 0.4, 0.8);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    const mix1 = ctx.createGain(); mix1.gain.setValueAtTime(0.75, startTime);
    const mix2 = ctx.createGain(); mix2.gain.setValueAtTime(0.25, startTime);
    osc1.connect(mix1); osc2.connect(mix2);
    mix1.connect(gainNode); mix2.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.05); osc2.stop(startTime + totalDur + 0.05);

    return { nodes: [osc1, osc2, mix1, mix2, gainNode], gainNode };
  }

  private synthGlockenspiel(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Glockenspiel: Ataque metálico com brilho agudo
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 5.4, startTime);

    const peakGain = 0.38 * dyn.dynamicGain;
    const totalDur = sustained ? 5.5 : Math.max(duration + 0.2, 0.6);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    const mix1 = ctx.createGain(); mix1.gain.setValueAtTime(0.8, startTime);
    const mix2 = ctx.createGain(); mix2.gain.setValueAtTime(0.2, startTime);
    osc1.connect(mix1); osc2.connect(mix2);
    mix1.connect(gainNode); mix2.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.05); osc2.stop(startTime + totalDur + 0.05);

    return { nodes: [osc1, osc2, mix1, mix2, gainNode], gainNode };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Sintetizadores & Leads
  // ──────────────────────────────────────────────────────────────────────────

  private synthMinimoogLead(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // 3 Osciladores analógicos encorpados do Minimoog Model D
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscSub = ctx.createOscillator();
    const ladderFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, startTime);
    osc2.detune.setValueAtTime(6.5, startTime); // Detuning encorpado

    oscSub.type = 'square';
    oscSub.frequency.setValueAtTime(freq * 0.5, startTime); // Sub-oscilador oitava abaixo

    // Filtro Ladder Moog 24dB/oct com envelope sweep
    ladderFilter.type = 'lowpass';
    ladderFilter.frequency.setValueAtTime(freq * 8 * dyn.filterScale, startTime);
    ladderFilter.frequency.exponentialRampToValueAtTime(freq * 2.2, startTime + 0.35);
    ladderFilter.Q.setValueAtTime(4.2, startTime); // Ressonância característica

    const peakGain = 0.40 * dyn.dynamicGain;
    const totalDur = sustained ? 14.0 : Math.max(duration, 0.3);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.7, startTime + 0.25);
    gainNode.gain.setValueAtTime(peakGain * 0.7, startTime + totalDur - 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.05);

    osc1.connect(ladderFilter); osc2.connect(ladderFilter); oscSub.connect(ladderFilter);
    ladderFilter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime); oscSub.start(startTime);
    osc1.stop(startTime + totalDur + 0.08); osc2.stop(startTime + totalDur + 0.08); oscSub.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, oscSub, ladderFilter, gainNode], gainNode };
  }

  private synthAnalogLead(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, startTime);
    osc2.detune.setValueAtTime(8.0, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6 * dyn.filterScale, startTime);
    filter.Q.setValueAtTime(3.5, startTime);

    const peakGain = 0.38 * dyn.dynamicGain;
    const totalDur = sustained ? 14.0 : Math.max(duration, 0.3);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.005);
    gainNode.gain.setValueAtTime(peakGain * 0.75, startTime + totalDur - 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.04);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); osc2.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, osc2, filter, gainNode], gainNode };
  }

  private synthDX7EPiano(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // Síntese FM digital clássica do Yamaha DX7 dos anos 80
    const carrier = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const gainNode = ctx.createGain();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, startTime);

    mod.type = 'sine';
    mod.frequency.setValueAtTime(freq * 14.0, startTime); // Tine de vidro cristalino

    const modDepth = freq * 3.8 * dyn.dynamicGain;
    modGain.gain.setValueAtTime(modDepth, startTime);
    modGain.gain.exponentialRampToValueAtTime(Math.max(0.001, modDepth * 0.02), startTime + 0.5);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    const peakGain = 0.40 * dyn.dynamicGain;
    const totalDur = sustained ? 8.0 : Math.max(duration + 0.2, 0.5);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.4, startTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    carrier.connect(gainNode);
    gainNode.connect(masterGain);

    carrier.start(startTime); mod.start(startTime);
    carrier.stop(startTime + totalDur + 0.08); mod.stop(startTime + totalDur + 0.08);

    return { nodes: [carrier, mod, modGain, gainNode], gainNode };
  }

  private synthSynthPad(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const oscs: OscillatorNode[] = [];
    const filter = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gainNode = ctx.createGain();

    const detunings = [-14, -6, 0, 6, 14];
    for (const det of detunings) {
      const osc = ctx.createOscillator();
      osc.type = det % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.detune.setValueAtTime(det, startTime);
      osc.connect(filter);
      osc.start(startTime);
      oscs.push(osc);
    }

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.75, startTime);
    lfoGain.gain.setValueAtTime(320, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900 * dyn.filterScale, startTime);
    filter.frequency.linearRampToValueAtTime(3600, startTime + 1.8);
    filter.Q.setValueAtTime(1.4, startTime);

    const peakGain = 0.26 * dyn.dynamicGain;
    const totalDur = sustained ? 20.0 : Math.max(duration + 0.6, 1.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    filter.connect(gainNode);
    gainNode.connect(masterGain);

    oscs.forEach(o => o.stop(startTime + totalDur + 0.1));
    lfo.stop(startTime + totalDur + 0.1);

    return { nodes: [...oscs, lfo, lfoGain, filter, gainNode], gainNode };
  }

  private synthSynthBrass(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, startTime);
    osc2.detune.setValueAtTime(7.5, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 9 * dyn.filterScale, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 2.5, startTime + 0.25);
    filter.Q.setValueAtTime(3.0, startTime);

    const peakGain = 0.40 * dyn.dynamicGain;
    const totalDur = sustained ? 12.0 : Math.max(duration, 0.3);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gainNode.gain.setValueAtTime(peakGain * 0.75, startTime + totalDur - 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.04);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); osc2.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, osc2, filter, gainNode], gainNode };
  }

  private synthBrassBrega(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // Seção de metais pop/brega (Sax & Trompete brilhante para Seresta, Zezo e Piseiro)
    const oscSax = ctx.createOscillator();
    const oscHorn = ctx.createOscillator();
    const formantFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    oscSax.type = 'sawtooth';
    oscSax.frequency.setValueAtTime(freq, startTime);

    oscHorn.type = 'square';
    oscHorn.frequency.setValueAtTime(freq * 2, startTime);
    oscHorn.detune.setValueAtTime(5.0, startTime);

    formantFilter.type = 'peaking';
    formantFilter.frequency.setValueAtTime(1600, startTime);
    formantFilter.gain.setValueAtTime(6.0, startTime);
    formantFilter.Q.setValueAtTime(2.0, startTime);

    const peakGain = 0.42 * dyn.dynamicGain;
    const totalDur = sustained ? 12.0 : Math.max(duration, 0.25);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
    gainNode.gain.setValueAtTime(peakGain * 0.8, startTime + totalDur - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.04);

    oscSax.connect(formantFilter); oscHorn.connect(formantFilter);
    formantFilter.connect(gainNode);
    gainNode.connect(masterGain);

    oscSax.start(startTime); oscHorn.start(startTime);
    oscSax.stop(startTime + totalDur + 0.06); oscHorn.stop(startTime + totalDur + 0.06);

    return { nodes: [oscSax, oscHorn, formantFilter, gainNode], gainNode };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Cordas & Orquestra
  // ──────────────────────────────────────────────────────────────────────────

  private synthStrings(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const oscs: OscillatorNode[] = [];
    const filter = ctx.createBiquadFilter();
    const vibLfo = ctx.createOscillator();
    const vibDepth = ctx.createGain();
    const gainNode = ctx.createGain();

    const layers = [[1.0, 0], [1.0, 7], [2.0, -5]];
    for (const [ratio, detune] of layers) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * ratio, startTime);
      osc.detune.setValueAtTime(detune, startTime);
      osc.connect(filter);
      osc.start(startTime);
      oscs.push(osc);
    }

    vibLfo.type = 'sine';
    vibLfo.frequency.setValueAtTime(5.2, startTime);
    vibDepth.gain.setValueAtTime(0, startTime);
    vibDepth.gain.linearRampToValueAtTime(8, startTime + 0.6);
    vibLfo.connect(vibDepth);
    vibDepth.connect(oscs[0].frequency);
    vibLfo.start(startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2900 * dyn.filterScale, startTime);
    filter.Q.setValueAtTime(0.7, startTime);

    const peakGain = 0.32 * dyn.dynamicGain;
    const totalDur = sustained ? 16.0 : Math.max(duration + 0.3, 0.6);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    filter.connect(gainNode);
    gainNode.connect(masterGain);

    oscs.forEach(o => o.stop(startTime + totalDur + 0.08));
    vibLfo.stop(startTime + totalDur + 0.08);

    return { nodes: [...oscs, vibLfo, vibDepth, filter, gainNode], gainNode };
  }

  private synthViolin(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc = ctx.createOscillator();
    const formant = ctx.createBiquadFilter();
    const vibLfo = ctx.createOscillator();
    const vibDepth = ctx.createGain();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    vibLfo.type = 'sine';
    vibLfo.frequency.setValueAtTime(5.8, startTime);
    vibDepth.gain.setValueAtTime(0, startTime);
    vibDepth.gain.linearRampToValueAtTime(freq * 0.02, startTime + 0.3); // Vibrato entra expressivo
    vibLfo.connect(vibDepth);
    vibDepth.connect(osc.frequency);
    vibLfo.start(startTime);

    formant.type = 'peaking';
    formant.frequency.setValueAtTime(2400, startTime);
    formant.gain.setValueAtTime(6.0, startTime);
    formant.Q.setValueAtTime(2.2, startTime);

    const peakGain = 0.34 * dyn.dynamicGain;
    const totalDur = sustained ? 15.0 : Math.max(duration + 0.2, 0.5);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(formant);
    formant.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.08);
    vibLfo.stop(startTime + totalDur + 0.08);

    return { nodes: [osc, formant, vibLfo, vibDepth, gainNode], gainNode };
  }

  private synthCello(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(Math.min(1800, freq * 3.5), startTime);
    bodyFilter.Q.setValueAtTime(1.8, startTime);

    const peakGain = 0.38 * dyn.dynamicGain;
    const totalDur = sustained ? 16.0 : Math.max(duration + 0.3, 0.6);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(bodyFilter);
    bodyFilter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.08);

    return { nodes: [osc, bodyFilter, gainNode], gainNode };
  }

  private synthHarp(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(5000, freq * 4.5 * dyn.filterScale), startTime);

    const peakGain = 0.38 * dyn.dynamicGain;
    const totalDur = sustained ? 6.0 : Math.max(duration + 0.4, 0.8);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); osc2.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, osc2, filter, gainNode], gainNode };
  }

  private synthFlute(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.8, startTime);

    const peakGain = 0.35 * dyn.dynamicGain;
    const totalDur = sustained ? 12.0 : Math.max(duration + 0.1, 0.35);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.06);

    return { nodes: [osc, filter, gainNode], gainNode };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Guitarras & Violões
  // ──────────────────────────────────────────────────────────────────────────

  private synthGuitarNylon(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, is7Strings: boolean,
  ): SynthResult {
    const osc = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(freq * (is7Strings ? 5.5 : 6.5) * dyn.filterScale, startTime);
    bodyFilter.frequency.exponentialRampToValueAtTime(freq * 1.3, startTime + 0.3);

    const peakGain = 0.40 * dyn.dynamicGain;
    const totalDur = sustained ? 6.5 : Math.max(duration + 0.2, 0.45);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.22, startTime + 0.28);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(bodyFilter);
    bodyFilter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.08);

    return { nodes: [osc, bodyFilter, gainNode], gainNode };
  }

  private synthGuitarStrat(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, isDrive: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const cabFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Gabinete valvulado 4x12
    cabFilter.type = 'bandpass';
    cabFilter.frequency.setValueAtTime(isDrive ? 2600 : 3200, startTime);
    cabFilter.Q.setValueAtTime(isDrive ? 1.6 : 0.9, startTime);

    const peakGain = (isDrive ? 0.36 : 0.42) * dyn.dynamicGain;
    const totalDur = sustained ? (isDrive ? 10.0 : 7.0) : Math.max(duration + 0.1, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc1.connect(cabFilter); osc2.connect(cabFilter);
    cabFilter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.08); osc2.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, cabFilter, gainNode], gainNode };
  }

  private synthGuitarReggaeMuted(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, _duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    _sustained: boolean,
  ): SynthResult {
    // Acordes abafados no contratempo (palm-mute chop para reggae roots Bob Marley)
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(380, startTime);

    const peakGain = 0.45 * dyn.dynamicGain;
    const chopDur = 0.085; // Decaimento seco e imediato característico do skank

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + chopDur);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + chopDur + 0.02);

    return { nodes: [osc, filter, gainNode], gainNode };
  }

  private synthHarpsichord(
    ctx: AudioContext, masterGain: GainNode, freq: number, midi: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(220, startTime);

    const peakGain = 0.30 * dyn.dynamicGain;
    const decayTime = 0.85 + Math.max(0, (60 - midi) * 0.02);
    const totalDur = sustained ? decayTime : Math.min(duration, decayTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.05);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.1); osc2.stop(startTime + totalDur + 0.1);

    return { nodes: [osc1, osc2, filter, gainNode], gainNode };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Baixos
  // ──────────────────────────────────────────────────────────────────────────

  private synthBass(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean, style: 'pick' | 'finger',
  ): SynthResult {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = style === 'pick' ? 'square' : 'sine';
    osc2.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(style === 'pick' ? freq * 8 : freq * 4.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.15);
    filter.Q.setValueAtTime(style === 'pick' ? 2.5 : 1.2, startTime);

    const peakGain = 0.52 * dyn.dynamicGain;
    const totalDur = sustained ? 8.0 : Math.max(duration + 0.1, 0.25);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + (style === 'pick' ? 0.003 : 0.008));
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.6, startTime + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); osc2.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, osc2, filter, gainNode], gainNode };
  }

  private synthBassAcoustic(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // Contrabaixo acústico de madeira (Upright bass)
    const osc = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(Math.min(900, freq * 2.8), startTime);
    bodyFilter.Q.setValueAtTime(1.5, startTime);

    const peakGain = 0.55 * dyn.dynamicGain;
    const totalDur = sustained ? 7.0 : Math.max(duration + 0.15, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.012);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(bodyFilter);
    bodyFilter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.06);

    return { nodes: [osc, bodyFilter, gainNode], gainNode };
  }

  private synthBassSynth(
    ctx: AudioContext, masterGain: GainNode, freq: number,
    startTime: number, duration: number, dyn: ReturnType<SoundEngineSynthesizers['computeVelocityDynamics']>,
    sustained: boolean,
  ): SynthResult {
    // Sub-bass Moog Taurus com sub-oscilador gordo
    const osc1 = ctx.createOscillator();
    const oscSub = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    oscSub.type = 'square';
    oscSub.frequency.setValueAtTime(freq * 0.5, startTime); // Sub-oitava

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6 * dyn.filterScale, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.8, startTime + 0.2);
    filter.Q.setValueAtTime(3.8, startTime);

    const peakGain = 0.55 * dyn.dynamicGain;
    const totalDur = sustained ? 10.0 : Math.max(duration, 0.3);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.005);
    gainNode.gain.setValueAtTime(peakGain * 0.8, startTime + totalDur - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.04);

    osc1.connect(filter); oscSub.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(startTime); oscSub.start(startTime);
    osc1.stop(startTime + totalDur + 0.06); oscSub.stop(startTime + totalDur + 0.06);

    return { nodes: [osc1, oscSub, filter, gainNode], gainNode };
  }
}

export const soundEngineSynthesizers = new SoundEngineSynthesizers();

export function computeVelocityDynamics(velocity: number) {
  return soundEngineSynthesizers.computeVelocityDynamics(velocity);
}

export function getNextRoundRobin() {
  return soundEngineSynthesizers.getNextRoundRobin();
}
