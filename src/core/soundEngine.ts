import { midiToFrequency } from './musicTheory';
import { activeMidiStore } from './activeMidiStore';

// ────────────────────────────────────────────────────────────────────────────
// Catálogo de Timbres
// ────────────────────────────────────────────────────────────────────────────

export type TimbreId =
  | 'grand_piano'
  | 'rhodes'
  | 'strings'
  | 'vibraphone'
  | 'flute'
  | 'organ'
  | 'bass'
  | 'synth_pad'
  | 'guitar_nylon'
  | 'harpsichord';

export interface TimbreDefinition {
  id: TimbreId;
  label: string;
  emoji: string;
  category: 'keyboard' | 'strings' | 'wind' | 'synth' | 'pluck';
  description: string;
}

export const TIMBRES: TimbreDefinition[] = [
  {
    id: 'grand_piano',
    label: 'Grand Piano',
    emoji: '🎹',
    category: 'keyboard',
    description: 'Piano de cauda acústico com harmônicos ricos e sustain natural',
  },
  {
    id: 'rhodes',
    label: 'Rhodes',
    emoji: '🎸',
    category: 'keyboard',
    description: 'Piano elétrico Rhodes com chorus suave e ataque metálico',
  },
  {
    id: 'organ',
    label: 'Órgão Hammond',
    emoji: '🎵',
    category: 'keyboard',
    description: 'Órgão Hammond B3 com drawbars e rotary speaker',
  },
  {
    id: 'harpsichord',
    label: 'Cravo',
    emoji: '🎼',
    category: 'keyboard',
    description: 'Cravo barroco com ataque vivo e decaimento rápido',
  },
  {
    id: 'strings',
    label: 'Cordas',
    emoji: '🎻',
    category: 'strings',
    description: 'Ensemble de cordas com arco suave e ataque legato',
  },
  {
    id: 'vibraphone',
    label: 'Vibrafone',
    emoji: '✨',
    category: 'keyboard',
    description: 'Vibrafone metálico com vibrato e longa ressonância',
  },
  {
    id: 'flute',
    label: 'Flauta',
    emoji: '🪈',
    category: 'wind',
    description: 'Flauta transversal com sopro suave e expressão dinâmica',
  },
  {
    id: 'guitar_nylon',
    label: 'Violão Nylon',
    emoji: '🎸',
    category: 'pluck',
    description: 'Violão clássico com cordas de nylon e toque brasileiro',
  },
  {
    id: 'bass',
    label: 'Baixo Elétrico',
    emoji: '🎸',
    category: 'strings',
    description: 'Baixo elétrico com ataque firme e grave encorpado',
  },
  {
    id: 'synth_pad',
    label: 'Synth Pad',
    emoji: '🌊',
    category: 'synth',
    description: 'Pad sintético atmosférico com evolução lenta e reverb espacial',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Engine de Áudio Multi-Timbre de Alta Fidelidade
// ────────────────────────────────────────────────────────────────────────────

export interface ActiveVoice {
  id: number;
  midi: number;
  nodes: AudioNode[];
  gainNode: GainNode;
  stopTimeout?: number;
  startTime: number;
  isSustained: boolean;
  released?: boolean;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private volume = 0.8;
  private isMuted = false;
  private currentTimbre: TimbreId = 'grand_piano';

  public static readonly MAX_VOICES = 32;
  private voiceCounter = 0;
  private activeVoiceList: ActiveVoice[] = [];
  private activeVoices: Map<number, ActiveVoice> = new Map();
  private scheduledVoices: Set<ActiveVoice> = new Set();

  // ── Inicialização do contexto com cadeia de efeitos ──────────────────────

  private initContext() {
    if (!this.ctx) {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx({ latencyHint: 'interactive', sampleRate: 44100 });

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Cadeia de saída: dry + reverb convoluído
      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.reverbNode = this.buildSyntheticReverb();

      this.masterGain.connect(this.dryGain);
      this.masterGain.connect(this.reverbNode);
      this.reverbNode.connect(this.reverbGain);
      this.dryGain.connect(this.ctx.destination);
      this.reverbGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /** Cria um reverb sintético de sala usando noise convoluído */
  private buildSyntheticReverb(): ConvolverNode {
    const ctx = this.ctx!;
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 2.5; // 2.5 segundos de cauda
    const impulse = ctx.createBuffer(2, length, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2.8);
        data[i] = (Math.random() * 2 - 1) * decay;
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }

  // ── API Pública de Configuração ──────────────────────────────────────────

  public async ensureAudioReady(): Promise<boolean> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        // Dispara o resume com timeout limite de 150ms para prevenir travamento eterno
        // da cadeia assíncrona caso o navegador ainda restrinja a retomada do contexto de áudio
        await Promise.race([
          this.ctx.resume(),
          new Promise((resolve) => setTimeout(resolve, 150)),
        ]);
        return (this.ctx.state as AudioContextState) === 'running';
      } catch (err) {
        console.warn('AudioContext resume failed:', err);
        return false;
      }
    }
    return true;
  }

  public getCurrentTime(): number {
    this.initContext();
    return this.ctx ? this.ctx.currentTime : performance.now() / 1000;
  }

  public getAudioContext(): AudioContext | null {
    this.initContext();
    return this.ctx;
  }

  public getMasterGain(): GainNode | null {
    this.initContext();
    return this.masterGain;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setTimbre(id: TimbreId) {
    // Interrompe imediatamente todas as vozes ativas do timbre anterior (previne acúmulo de notas e sustain infinito)
    this.stopAllNotes(0.005);
    this.currentTimbre = id;

    // Ajusta o nível de reverb por timbre
    if (this.reverbGain && this.dryGain && this.ctx) {
      const reverbLevels: Record<TimbreId, number> = {
        grand_piano: 0.25,
        rhodes: 0.2,
        organ: 0.15,
        harpsichord: 0.1,
        strings: 0.45,
        vibraphone: 0.35,
        flute: 0.3,
        guitar_nylon: 0.2,
        bass: 0.05,
        synth_pad: 0.6,
      };
      const rev = reverbLevels[id] ?? 0.2;
      this.reverbGain.gain.setTargetAtTime(rev, this.ctx.currentTime, 0.05);
    }
  }

  public getTimbre(): TimbreId {
    return this.currentTimbre;
  }

  // ── Sintetizadores por Timbre ────────────────────────────────────────────

  private synthNote(
    midi: number,
    startTime: number,
    duration: number,
    velocity: number,
    sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    switch (this.currentTimbre) {
      case 'rhodes':       return this.synthRhodes(midi, startTime, duration, velocity, sustained);
      case 'strings':      return this.synthStrings(midi, startTime, duration, velocity, sustained);
      case 'vibraphone':   return this.synthVibraphone(midi, startTime, duration, velocity, sustained);
      case 'flute':        return this.synthFlute(midi, startTime, duration, velocity, sustained);
      case 'organ':        return this.synthOrgan(midi, startTime, duration, velocity, sustained);
      case 'bass':         return this.synthBass(midi, startTime, duration, velocity, sustained);
      case 'synth_pad':    return this.synthPad(midi, startTime, duration, velocity, sustained);
      case 'guitar_nylon': return this.synthGuitarNylon(midi, startTime, duration, velocity, sustained);
      case 'harpsichord':  return this.synthHarpsichord(midi, startTime, duration, velocity, sustained);
      default:             return this.synthGrandPiano(midi, startTime, duration, velocity, sustained);
    }
  }

  // Grand Piano — Modelo acústico multi-parcial
  private synthGrandPiano(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const oscs: OscillatorNode[] = [];
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const comprPos = ctx.createDynamicsCompressor();

    // 4 parciais para riqueza harmônica
    const partials: [number, OscillatorType, number][] = [
      [1.000, 'triangle', 0.55],
      [2.001, 'sine',     0.22],
      [3.003, 'sine',     0.12],
      [4.005, 'sine',     0.06],
    ];

    for (const [ratio, type, amp] of partials) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * ratio, startTime);
      // Leve detuning para brilho natural
      osc.detune.setValueAtTime((Math.random() - 0.5) * 3, startTime);
      oscGain.gain.setValueAtTime(amp, startTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      oscs.push(osc);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 5, 8000), startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 1.8, 2500), startTime + Math.min(1.8, duration));
    filter.Q.setValueAtTime(0.8, startTime);

    const peakGain = 0.38 * velocity;
    const attack = 0.006;
    const decay = 0.22;
    const sustain = Math.max(0.0001, peakGain * 0.42);

    filter.connect(comprPos);
    comprPos.connect(gainNode);
    gainNode.connect(this.masterGain!);

    if (sustained) {
      // Ressonância acústica de piano com pedal de sustain (cordas livres sem abafadores)
      const naturalDecay = Math.max(duration + 1.8, 4.8 + Math.max(0, (60 - midi) * 0.06));
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + decay);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain * 0.4), startTime + Math.min(2.5, naturalDecay * 0.5));
      gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + naturalDecay);
      oscs.forEach(o => { o.start(startTime); o.stop(startTime + naturalDecay + 0.1); });
    } else {
      // Sem sustain: nota toca na duração rítmica com abafamento acústico rápido
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

    return { nodes: [...oscs, gainNode, filter, comprPos], gainNode };
  }

  // Rhodes — FM Synthesis com chorus sutil
  private synthRhodes(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, startTime);

    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * 7.0, startTime);

    const modDepth = freq * 2.5 * velocity;
    modGain.gain.setValueAtTime(modDepth, startTime);
    modGain.gain.exponentialRampToValueAtTime(Math.max(0.001, modDepth * 0.05), startTime + 0.8);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 3, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    const peakGain = 0.42 * velocity;
    const attack = 0.003;
    const decay = 0.18;
    const sustain = Math.max(0.0001, peakGain * 0.45);

    carrier.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    carrier.start(startTime);
    modulator.start(startTime);

    if (sustained) {
      const totalDur = Math.max(duration + 2.0, 7.5);
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + decay);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);
      carrier.stop(startTime + totalDur + 0.1);
      modulator.stop(startTime + totalDur + 0.1);
    } else {
      const holdDuration = Math.max(0.12, duration);
      const releaseStart = Math.max(startTime + decay, startTime + holdDuration);
      const releaseDur = 0.07;
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + decay);
      gainNode.gain.setValueAtTime(sustain, releaseStart);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, releaseStart + releaseDur);
      carrier.stop(releaseStart + releaseDur + 0.05);
      modulator.stop(releaseStart + releaseDur + 0.05);
    }

    return { nodes: [carrier, modulator, modGain, gainNode, filter], gainNode };
  }

  // Strings — Ensemble com violinos, violas e cellos
  private synthStrings(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const oscs: OscillatorNode[] = [];
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const vibLfo = ctx.createOscillator();
    const vibDepth = ctx.createGain();

    // 3 camadas de vozes com detuning diferente para ensemble
    const layers: [number, number][] = [[1.0, 0], [1.0, 7], [2.0, -5]];
    for (const [ratio, detune] of layers) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * ratio, startTime);
      osc.detune.setValueAtTime(detune, startTime);
      osc.connect(filter);
      osc.start(startTime);
      oscs.push(osc);
    }

    // Vibrato suave
    vibLfo.type = 'sine';
    vibLfo.frequency.setValueAtTime(5.2, startTime);
    vibDepth.gain.setValueAtTime(0, startTime);
    vibDepth.gain.linearRampToValueAtTime(8, startTime + 0.8); // Vibrato entra gradualmente
    vibLfo.connect(vibDepth);
    vibDepth.connect(oscs[0].frequency);
    vibLfo.start(startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, startTime);
    filter.Q.setValueAtTime(0.6, startTime);

    const peakGain = 0.28 * velocity;
    const attack = 0.12; // Ataque lento tipo arco
    const totalDur = sustained ? 15.0 : Math.max(duration + 0.2, 0.5);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    oscs.forEach(o => o.stop(startTime + totalDur + 0.08));
    vibLfo.stop(startTime + totalDur + 0.08);

    return { nodes: [...oscs, vibLfo, vibDepth, gainNode, filter], gainNode };
  }

  // Vibrafone — Senoidal pura com vibrato de motor
  private synthVibraphone(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 4.0, startTime);

    // Vibrato tipo motor rotativo
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6.5, startTime);
    lfoGain.gain.setValueAtTime(freq * 0.015, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    const peakGain = 0.45 * velocity;
    const attack = 0.004;
    const totalDur = sustained ? 8.0 : Math.max(duration + 0.3, 0.5);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    const mix1 = ctx.createGain();
    const mix2 = ctx.createGain();
    mix1.gain.setValueAtTime(0.7, startTime);
    mix2.gain.setValueAtTime(0.12, startTime);

    osc1.connect(mix1);
    osc2.connect(mix2);
    mix1.connect(gainNode);
    mix2.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc1.start(startTime);
    osc2.start(startTime);
    lfo.start(startTime);

    osc1.stop(startTime + totalDur + 0.08);
    osc2.stop(startTime + totalDur + 0.08);
    lfo.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, lfo, lfoGain, mix1, mix2, gainNode], gainNode };
  }

  // Flauta — Subtração com noise de ar e senoidal pura
  private synthFlute(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const osc = ctx.createOscillator();
    const noiseBuffer = this.createNoiseBuffer(0.4);
    const noiseSource = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Ruído de ar suave no sopro
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(freq * 2, startTime);
    noiseFilter.Q.setValueAtTime(3.0, startTime);
    noiseGain.gain.setValueAtTime(0.04 * velocity, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);

    const peakGain = 0.35 * velocity;
    const attack = 0.06;
    const totalDur = sustained ? 12.0 : Math.max(duration + 0.1, 0.3);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gainNode);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start(startTime);
    noiseSource.start(startTime);

    osc.stop(startTime + totalDur + 0.08);
    noiseSource.stop(startTime + totalDur + 0.08);

    return { nodes: [osc, noiseSource, noiseFilter, noiseGain, gainNode, filter], gainNode };
  }

  // Órgão Hammond — Somadores de drawbars (parciais sinusoidais)
  private synthOrgan(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const drawbars = [0.5, 1.0, 0.85, 0.75, 0.65, 0.55, 0.45, 0.3, 0.2];
    const ratios =  [0.5, 1.0, 2.0,  3.0,  4.0,  5.0,  6.0,  8.0, 16.0];
    const oscs: OscillatorNode[] = [];
    const gainNode = ctx.createGain();
    const clickGain = ctx.createGain();
    const clickOsc = ctx.createOscillator();

    // Click de contato (ataque do órgão)
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(freq * 8, startTime);
    clickGain.gain.setValueAtTime(0.08 * velocity, startTime);
    clickGain.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.012);
    clickOsc.connect(clickGain);
    clickGain.connect(gainNode);
    clickOsc.start(startTime);
    clickOsc.stop(startTime + 0.015);

    for (let i = 0; i < drawbars.length; i++) {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratios[i], startTime);
      og.gain.setValueAtTime(drawbars[i] * 0.08, startTime);
      osc.connect(og);
      og.connect(gainNode);
      osc.start(startTime);
      oscs.push(osc);
    }

    const totalDur = sustained ? 20.0 : Math.max(duration, 0.2);
    gainNode.gain.setValueAtTime(velocity * 0.7, startTime);
    gainNode.gain.setValueAtTime(velocity * 0.7, startTime + totalDur - 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.02);
    gainNode.connect(this.masterGain!);

    oscs.forEach(o => o.stop(startTime + totalDur + 0.08));

    return { nodes: [...oscs, gainNode, clickGain], gainNode };
  }

  // Baixo Elétrico — Dente-de-serra com corpo grave
  private synthBass(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 8, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.15);
    filter.Q.setValueAtTime(2.5, startTime);

    const peakGain = 0.5 * velocity;
    const attack = 0.004;
    const sustain = Math.max(0.0001, peakGain * 0.6);
    const totalDur = sustained ? 8.0 : Math.max(duration + 0.1, 0.2);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    const mix1 = ctx.createGain();
    const mix2 = ctx.createGain();
    mix1.gain.setValueAtTime(0.6, startTime);
    mix2.gain.setValueAtTime(0.3, startTime);
    osc1.connect(mix1); mix1.connect(filter);
    osc2.connect(mix2); mix2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.08);
    osc2.stop(startTime + totalDur + 0.08);

    return { nodes: [osc1, osc2, mix1, mix2, gainNode, filter], gainNode };
  }

  // Synth Pad — Layers de sines com LFO e longa cauda
  private synthPad(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const oscs: OscillatorNode[] = [];
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    const detunings = [-12, -5, 0, 5, 12, 7];
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
    lfo.frequency.setValueAtTime(0.8, startTime);
    lfoGain.gain.setValueAtTime(300, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.linearRampToValueAtTime(3500, startTime + 1.5);
    filter.Q.setValueAtTime(1.2, startTime);

    const peakGain = 0.25 * velocity;
    const attack = 0.8;
    const totalDur = sustained ? 20.0 : Math.max(duration + 0.5, 1.2);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    oscs.forEach(o => o.stop(startTime + totalDur + 0.1));
    lfo.stop(startTime + totalDur + 0.1);

    return { nodes: [...oscs, lfo, lfoGain, gainNode, filter], gainNode };
  }

  // Violão de Nylon — Karplus-Strong simplificado
  private synthGuitarNylon(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const bodyFilter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 7, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.3, startTime + Math.min(0.4, duration * 0.5));

    // Ressonância do corpo do violão
    bodyFilter.type = 'peaking';
    bodyFilter.frequency.setValueAtTime(300, startTime);
    bodyFilter.gain.setValueAtTime(6, startTime);
    bodyFilter.Q.setValueAtTime(1.5, startTime);

    const peakGain = 0.38 * velocity;
    const attack = 0.003;
    const totalDur = sustained ? 6.0 : Math.max(duration + 0.2, 0.4);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * 0.2), startTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur);

    osc.connect(filter);
    filter.connect(bodyFilter);
    bodyFilter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.08);

    return { nodes: [osc, gainNode, filter, bodyFilter], gainNode };
  }

  // Cravo Barroco — Ataque vivo com plectro e decaimento rápido
  private synthHarpsichord(
    midi: number, startTime: number, duration: number, velocity: number, sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    const ctx = this.ctx!;
    const freq = midiToFrequency(midi);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(200, startTime);

    const peakGain = 0.28 * velocity;
    const attack = 0.002;
    const decayTime = 0.8 + Math.max(0, (60 - midi) * 0.02); // Notas graves decaem mais lento
    const totalDur = sustained ? decayTime : Math.min(Math.max(duration, decayTime), decayTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDur + 0.1);

    const mix1 = ctx.createGain(); mix1.gain.setValueAtTime(0.6, startTime);
    const mix2 = ctx.createGain(); mix2.gain.setValueAtTime(0.25, startTime);
    osc1.connect(mix1); mix1.connect(filter);
    osc2.connect(mix2); mix2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc1.start(startTime); osc2.start(startTime);
    osc1.stop(startTime + totalDur + 0.15);
    osc2.stop(startTime + totalDur + 0.15);

    return { nodes: [osc1, osc2, mix1, mix2, gainNode, filter], gainNode };
  }

  // ── Utilitários ──────────────────────────────────────────────────────────

  private createNoiseBuffer(durationSec: number): AudioBuffer {
    const ctx = this.ctx!;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * durationSec), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  private disconnectVoiceNodes(nodes: AudioNode[]) {
    for (const node of nodes) {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          try { node.stop(); } catch {}
        }
        node.disconnect();
      } catch {}
    }
  }

  /**
   * Executa voice stealing com rampa suave de 10ms (linearRampToValueAtTime).
   * Prioriza o roubo de notas antigas sustentadas pelo pedal (isSustained = true)
   * mantendo a polifonia estritamente dentro do limite de 32 vozes (REQ-BUG-AUDIO-REPLAY-REPERTOIRE-01.1).
   */
  private stealExcessVoices() {
    while (this.activeVoiceList.length >= SoundEngine.MAX_VOICES) {
      // Prioridade 1: Voz sustentada mais antiga não liberada
      let victimIdx = this.activeVoiceList.findIndex(v => v.isSustained && !v.released);
      if (victimIdx === -1) {
        victimIdx = this.activeVoiceList.findIndex(v => v.isSustained);
      }
      // Prioridade 2: Voz mais antiga de todas
      if (victimIdx === -1) {
        victimIdx = 0;
      }

      const [victim] = this.activeVoiceList.splice(victimIdx, 1);
      if (!victim) break;

      victim.released = true;
      if (victim.stopTimeout) {
        clearTimeout(victim.stopTimeout);
        victim.stopTimeout = undefined;
      }
      this.scheduledVoices.delete(victim);
      if (this.activeVoices.get(victim.midi) === victim) {
        this.activeVoices.delete(victim.midi);
      }

      if (this.ctx) {
        try {
          const now = this.ctx.currentTime;
          const curGain = Math.max(0.0001, victim.gainNode.gain.value);
          victim.gainNode.gain.cancelScheduledValues(now);
          victim.gainNode.gain.setValueAtTime(curGain, now);
          victim.gainNode.gain.linearRampToValueAtTime(0.00001, now + 0.010);
        } catch {}
      }

      setTimeout(() => {
        this.disconnectVoiceNodes(victim.nodes);
      }, 15);
    }
  }

  private registerVoice(
    midi: number,
    nodes: AudioNode[],
    gainNode: GainNode,
    isSustained: boolean,
    durationSec: number,
    startTime: number
  ): ActiveVoice {
    this.stealExcessVoices();

    const voice: ActiveVoice = {
      id: ++this.voiceCounter,
      midi,
      nodes,
      gainNode,
      startTime,
      isSustained,
      released: false,
    };

    const cleanupMs = Math.max(500, Math.round((durationSec + (isSustained ? 4.5 : 0.6)) * 1000));
    voice.stopTimeout = (typeof window !== 'undefined' ? window.setTimeout : setTimeout)(() => {
      this.removeAndDisconnectVoice(voice);
    }, cleanupMs) as unknown as number;

    this.activeVoiceList.push(voice);
    this.scheduledVoices.add(voice);
    return voice;
  }

  private removeAndDisconnectVoice(voice: ActiveVoice) {
    const idx = this.activeVoiceList.indexOf(voice);
    if (idx !== -1) {
      this.activeVoiceList.splice(idx, 1);
    }
    this.scheduledVoices.delete(voice);
    if (this.activeVoices.get(voice.midi) === voice) {
      this.activeVoices.delete(voice.midi);
    }
    this.disconnectVoiceNodes(voice.nodes);
  }

  /**
   * Cancela todas as notas atualmente sustentadas pelo pedal com fade-out suave de 10ms
   * e desconexão de nós WebAudio. Previne acúmulo e sobreposição ao desativar o sustain.
   */
  public cancelSustainedNotes(fadeDuration = 0.010) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const sustained = this.activeVoiceList.filter(v => v.isSustained && !v.released);

    sustained.forEach(voice => {
      voice.released = true;
      if (voice.stopTimeout) {
        clearTimeout(voice.stopTimeout);
        voice.stopTimeout = undefined;
      }
      const idx = this.activeVoiceList.indexOf(voice);
      if (idx !== -1) {
        this.activeVoiceList.splice(idx, 1);
      }
      this.scheduledVoices.delete(voice);
      if (this.activeVoices.get(voice.midi) === voice) {
        this.activeVoices.delete(voice.midi);
      }

      try {
        const curGain = Math.max(0.0001, voice.gainNode.gain.value);
        voice.gainNode.gain.cancelScheduledValues(now);
        voice.gainNode.gain.setValueAtTime(curGain, now);
        voice.gainNode.gain.linearRampToValueAtTime(0.00001, now + fadeDuration);
      } catch {}

      setTimeout(() => {
        this.disconnectVoiceNodes(voice.nodes);
      }, Math.round(fadeDuration * 1000 + 10));
    });
  }

  public getActiveVoiceCount(): number {
    return this.activeVoiceList.length;
  }

  private stopAllNodes(nodes: AudioNode[], gainNode: GainNode, releaseDuration = 0.14) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      const curGain = Math.max(0.0001, gainNode.gain.value);
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(curGain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + releaseDuration);
    } catch { /* ignora */ }

    setTimeout(() => {
      this.disconnectVoiceNodes(nodes);
    }, Math.round(releaseDuration * 1000 + 50));
  }

  // ── API de Reprodução de Notas ───────────────────────────────────────────

  /** Inicia nota com sustain enquanto a tecla está pressionada */
  public startPianoNote(midi: number, velocity = 0.8) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      if (this.activeVoices.has(midi)) {
        this.stopPianoNote(midi, 0.05);
      }

      const { nodes, gainNode } = this.synthNote(midi, this.ctx.currentTime, 0, velocity, true);
      const voice = this.registerVoice(midi, nodes, gainNode, true, 12.0, this.ctx.currentTime);
      this.activeVoices.set(midi, voice);
    } catch (err) {
      console.warn('Erro ao iniciar nota:', err);
    }
  }

  /** Para a nota com abafamento realista */
  public stopPianoNote(midi: number, releaseDuration = 0.14) {
    const voice = this.activeVoices.get(midi);
    if (!voice || !this.ctx) return;

    if (voice.stopTimeout) {
      window.clearTimeout(voice.stopTimeout);
      voice.stopTimeout = undefined;
    }

    this.stopAllNodes(voice.nodes, voice.gainNode, releaseDuration);
    this.activeVoices.delete(midi);
    const idx = this.activeVoiceList.indexOf(voice);
    if (idx !== -1) {
      this.activeVoiceList.splice(idx, 1);
    }
    this.scheduledVoices.delete(voice);
  }

  /**
   * Para todas as vozes e notas ativas imediatamente (Rotina Global de Limpeza / Panic Function).
   * Elimina notas presas (stuck notes) e acúmulo de vozes ao trocar de instrumento, pausar ou trocar de lição.
   */
  public stopAllNotes(releaseDuration = 0.005) {
    if (this.ctx) {
      const now = this.ctx.currentTime;

      // Limpa todas as vozes registradas em activeVoiceList
      const allVoices = [...this.activeVoiceList];
      allVoices.forEach((voice) => {
        voice.released = true;
        if (voice.stopTimeout) {
          window.clearTimeout(voice.stopTimeout);
          voice.stopTimeout = undefined;
        }
        try {
          const curGain = Math.max(0.0001, voice.gainNode.gain.value);
          voice.gainNode.gain.cancelScheduledValues(now);
          voice.gainNode.gain.setValueAtTime(curGain, now);
          voice.gainNode.gain.linearRampToValueAtTime(0.00001, now + releaseDuration);
        } catch { /* ignora */ }

        setTimeout(() => {
          this.disconnectVoiceNodes(voice.nodes);
        }, Math.round(releaseDuration * 1000 + 15));
      });
    }

    this.activeVoices.clear();
    this.scheduledVoices.clear();
    this.activeVoiceList = [];

    // Limpa teclado visual global
    activeMidiStore.clearAll();
  }

  /** Alias padrão MIDI: allNotesOff */
  public allNotesOff() {
    this.stopAllNotes(0.005);
  }

  /** Rotina Global de Limpeza de Áudio (Panic Function) */
  public panic() {
    this.resetAudioEngine();
  }

  /** Restaura o motor de áudio a zero e reabre sem estalidos */
  public resetAudioEngine() {
    this.stopAllNotes(0.005);
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const curVol = this.isMuted ? 0 : this.volume;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(curVol, now + 0.005);
      } catch { /* ignora */ }
    }
  }

  /** Toca uma nota de duração fixa (para partitura, repertório, etc.) */
  public playPianoNote(midi: number, duration = 1.2, time?: number, velocity = 0.8, sustained = false) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const startTime = Math.max(now, time ?? now);

      const synthRes = this.synthNote(midi, startTime, duration, velocity, sustained);

      if (synthRes) {
        this.registerVoice(midi, synthRes.nodes, synthRes.gainNode, sustained, duration, startTime);
      }

      // Reflete no teclado global: acende a tecla pela duração sonora da nota
      const delayMs = Math.max(0, (startTime - now) * 1000);
      const visualDurSec = sustained ? Math.max(duration * 1.3, 1.8) : duration;
      const durationMs = Math.max(150, visualDurSec * 1000);
      if (delayMs < 300) {
        // Nota imediata ou com lookahead pequeno: acende agora
        activeMidiStore.noteOn(midi, durationMs);
      } else {
        // Nota agendada no futuro (partitura): acende no momento certo
        const timerFn = typeof window !== 'undefined' ? window.setTimeout : setTimeout;
        timerFn(() => activeMidiStore.noteOn(midi, durationMs), delayMs);
      }
    } catch (err) {
      console.warn('Erro ao tocar nota:', err);
    }
  }

  /** Toca uma corda de violão dedilhada (mantém compatibilidade) */
  public playGuitarPluck(midi: number, duration = 1.8, time?: number, velocity = 0.8, sustained = false) {
    this.playPianoNote(midi, duration, time, velocity, sustained);
  }

  /** Toca um acorde simultâneo */
  public playChord(midiNotes: number[], instrument: 'piano' | 'guitar' = 'piano', duration = 1.6, sustained = false) {
    // Acende todas as teclas do acorde simultaneamente
    const visualDuration = sustained ? Math.max(1200, duration * 1000) : Math.max(350, duration * 1000);
    activeMidiStore.chordOn(midiNotes, visualDuration);
    midiNotes.forEach(midi => {
      if (instrument === 'guitar') {
        this.playGuitarPluck(midi, duration, undefined, 0.8, sustained);
      } else {
        this.playPianoNote(midi, duration, undefined, 0.8, sustained);
      }
    });
  }

  /** Toca um arpejo dedilhado */
  public playArpeggio(midiNotes: number[], instrument: 'piano' | 'guitar' = 'guitar', staggerMs = 45) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    midiNotes.forEach((midi, idx) => {
      const scheduledTime = now + (idx * staggerMs) / 1000;
      if (instrument === 'piano') {
        this.playPianoNote(midi, 1.5, scheduledTime);
      } else {
        this.playGuitarPluck(midi, 1.8, scheduledTime);
      }
    });
  }

  /** Clique de metrônomo de alta precisão */
  public playMetronomeClick(isDownbeat: boolean, isSubdivision = false, time?: number) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const startTime = Math.max(now, time ?? now);
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      let stopDuration = 0.05;
      if (isDownbeat) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, startTime);
        osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.035);
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);
        stopDuration = 0.05;
      } else if (isSubdivision) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, startTime);
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.025);
        stopDuration = 0.03;
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, startTime);
        osc.frequency.exponentialRampToValueAtTime(450, startTime + 0.03);
        gainNode.gain.setValueAtTime(0.35, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);
        stopDuration = 0.04;
      }

      osc.connect(gainNode);
      gainNode.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + stopDuration);

      // Desconecta e libera recursos WebAudio imediatamente após o clique (Garbage Collection)
      osc.onended = () => {
        try {
          osc.disconnect();
          gainNode.disconnect();
        } catch {}
      };
    } catch (err) {
      console.warn('Erro no metrônomo:', err);
    }
  }
}

export const soundEngine = new SoundEngine();
