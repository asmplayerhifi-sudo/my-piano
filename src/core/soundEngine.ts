import { activeMidiStore } from './activeMidiStore';
import {
  type TimbreId,
  type TimbreCategory,
  type TimbreDefinition,
  type CategoryMetadata,
  TIMBRES,
  TIMBRE_CATEGORIES,
} from './soundEngineTypes';
import { soundEngineSynthesizers } from './soundEngineSynthesizers';

export type { TimbreId, TimbreCategory, TimbreDefinition, CategoryMetadata };
export { TIMBRES, TIMBRE_CATEGORIES };

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
    // Interrompe com fade-out suave de 25ms as vozes do timbre anterior para prevenir cliques/pops
    this.stopAllNotes(0.025);
    this.currentTimbre = id;

    // Ajusta o nível de reverb por timbre
    if (this.reverbGain && this.dryGain && this.ctx) {
      const reverbLevels: Record<TimbreId, number> = {
        // Pianos Acústicos
        grand_piano: 0.25,
        upright_piano: 0.20,
        honky_tonk: 0.15,
        // Pianos Elétricos & Órgãos
        rhodes: 0.20,
        rhodes_suitcase: 0.22,
        wurlitzer: 0.18,
        clavinet: 0.12,
        organ: 0.18,
        vox_continental: 0.20,
        farfisa: 0.18,
        accordion: 0.15,
        // Percussão Afinada
        vibraphone: 0.35,
        marimba: 0.25,
        celesta: 0.30,
        glockenspiel: 0.30,
        // Sintetizadores & Leads
        minimoog_lead: 0.15,
        synth_lead: 0.20,
        dx7_epiano: 0.25,
        synth_pad: 0.60,
        synth_brass: 0.25,
        brass_brega: 0.22,
        // Cordas & Orquestra
        strings: 0.45,
        violin: 0.35,
        cello: 0.30,
        harp: 0.40,
        flute: 0.30,
        // Guitarras & Violões
        guitar_nylon: 0.20,
        guitar_7strings: 0.18,
        guitar_strat_clean: 0.25,
        guitar_strat_drive: 0.22,
        guitar_reggae_muted: 0.15,
        harpsichord: 0.12,
        // Baixos
        bass: 0.05,
        bass_finger: 0.05,
        bass_acoustic: 0.10,
        bass_synth: 0.05,
      };
      const rev = reverbLevels[id] ?? 0.2;
      this.reverbGain.gain.setTargetAtTime(rev, this.ctx.currentTime, 0.05);
    }
  }

  public getTimbre(): TimbreId {
    return this.currentTimbre;
  }

  // ── Síntese de Áudio Multi-Timbre (Sound Engine de Alta Fidelidade) ────────

  private synthNote(
    midi: number,
    startTime: number,
    duration: number,
    velocity: number,
    sustained: boolean,
  ): { nodes: AudioNode[]; gainNode: GainNode } {
    return soundEngineSynthesizers.synthesize(
      this.ctx!,
      this.masterGain!,
      this.currentTimbre,
      midi,
      startTime,
      duration,
      velocity,
      sustained
    );
  }

  // ── Utilitários ──────────────────────────────────────────────────────────

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
  public cancelSustainedNotes(fadeDuration = 0.025) {
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
  public stopAllNotes(releaseDuration = 0.025) {
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
    this.stopAllNotes(0.025);
  }

  /** Rotina Global de Limpeza de Áudio (Panic Function) */
  public panic() {
    this.resetAudioEngine();
  }

  /** Restaura o motor de áudio a zero e reabre sem estalidos */
  public resetAudioEngine() {
    this.stopAllNotes(0.025);
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
