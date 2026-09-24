import { midiToFrequency } from './musicTheory';

// Engine de áudio Web Audio API de alta fidelidade e baixa latência
class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.8;
  private isMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public async ensureAudioReady(): Promise<boolean> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
        return true;
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

  private activeVoices: Map<number, {
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    gainNode: GainNode;
    filter: BiquadFilterNode;
    stopTimeout?: number;
  }> = new Map();


  // Inicia uma nota com sustentação ativa enquanto o clique ou som estiver ativo
  public startPianoNote(midi: number, velocity = 0.8) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Se já houver uma voz ativa para essa nota, encerra suavemente a anterior
      if (this.activeVoices.has(midi)) {
        this.stopPianoNote(midi, 0.05);
      }

      const now = this.ctx.currentTime;
      const freq = midiToFrequency(midi);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 4.5, 6500), now);
      filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 1.8, 2200), now + 1.5);

      const peakGain = 0.42 * velocity;
      const attackTime = 0.006;
      const decayTime = 0.22;
      const sustainLevel = Math.max(0.0001, peakGain * 0.40);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(peakGain, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + decayTime);
      // Decaimento natural lento das cordas se mantida indefinidamente
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 8.0);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);

      // Limpeza de segurança caso o stop nunca seja disparado
      const stopTimeout = window.setTimeout(() => {
        this.stopPianoNote(midi, 0.2);
      }, 8500);

      this.activeVoices.set(midi, { osc1, osc2, gainNode, filter, stopTimeout });
    } catch (err) {
      console.warn('Erro ao iniciar nota no soundEngine:', err);
    }
  }

  // Interrompe a nota liberada com abafamento (damper) realista de piano
  public stopPianoNote(midi: number, releaseDuration = 0.14) {
    const voice = this.activeVoices.get(midi);
    if (!voice || !this.ctx) return;

    if (voice.stopTimeout) {
      window.clearTimeout(voice.stopTimeout);
    }

    try {
      const now = this.ctx.currentTime;
      voice.gainNode.gain.cancelScheduledValues(now);
      const curGain = Math.max(0.0001, voice.gainNode.gain.value);
      voice.gainNode.gain.setValueAtTime(curGain, now);
      voice.gainNode.gain.exponentialRampToValueAtTime(0.00001, now + releaseDuration);

      setTimeout(() => {
        try {
          voice.osc1.stop();
          voice.osc2.stop();
          voice.osc1.disconnect();
          voice.osc2.disconnect();
          voice.gainNode.disconnect();
          voice.filter.disconnect();
        } catch {
          // Ignora se já estiver desconectado
        }
      }, Math.round(releaseDuration * 1000 + 40));
    } catch {
      // Ignora erro
    }

    this.activeVoices.delete(midi);
  }

  // Toca uma nota de piano sintetizado com envelope ADSR acústico de duração fixa
  public playPianoNote(midi: number, duration = 1.2, time?: number, velocity = 0.8) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Garante que o timestamp de início nunca seja no passado
      const startTime = Math.max(now, time ?? now);
      const freq = midiToFrequency(midi);

      // Oscilador fundamental (Triangular + Senoidal para calor harmônico)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);

      // Segundo harmônico sutil
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      // Filtro passa-baixa para emular ressonância da tábua harmônica
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 4, 6000), startTime);
      filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 1.5, 2000), startTime + duration);

      // Envelope percussivo de Piano com tempos calculados de forma segura
      const peakGain = 0.4 * velocity;
      const attackTime = Math.min(0.005, duration * 0.1);
      const decayTime = Math.min(0.18, duration * 0.45);
      const totalDuration = Math.max(duration, decayTime + 0.05);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * 0.4), startTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDuration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + totalDuration);
      osc2.stop(startTime + totalDuration);
    } catch (err) {
      console.warn('Erro ao tocar nota de piano no soundEngine:', err);
    }
  }

  // Toca uma corda de violão (ataque brilhante com decaimento metálico/nylon)
  public playGuitarPluck(midi: number, duration = 1.8, time?: number, velocity = 0.8) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const startTime = Math.max(now, time ?? now);
      const freq = midiToFrequency(midi);

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 6, startTime);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + Math.min(0.3, duration * 0.4));

      const peakGain = 0.35 * velocity;
      const attackTime = Math.min(0.004, duration * 0.08);
      const decayTime = Math.min(0.3, duration * 0.45);
      const totalDuration = Math.max(duration, decayTime + 0.05);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * 0.25), startTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDuration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + totalDuration);
    } catch (err) {
      console.warn('Erro ao tocar violão no soundEngine:', err);
    }
  }

  // Toca um acorde simultâneo
  public playChord(midiNotes: number[], instrument: 'piano' | 'guitar' = 'piano', duration = 1.6) {
    midiNotes.forEach(midi => {
      if (instrument === 'piano') {
        this.playPianoNote(midi, duration);
      } else {
        this.playGuitarPluck(midi, duration);
      }
    });
  }

  // Toca um arpejo dedilhado (ex: violão passando pelas cordas com 45ms de intervalo)
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

  // Clique de metrônomo de alta precisão sonoro com timbres calibrados
  public playMetronomeClick(isDownbeat: boolean, isSubdivision = false, time?: number) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const startTime = Math.max(now, time ?? now);
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      if (isDownbeat) {
        // Tempo 1 Forte: 1400 Hz com estalo penetrante
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, startTime);
        osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.035);
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);
        osc.stop(startTime + 0.05);
      } else if (isSubdivision) {
        // Subdivisão suave: 600 Hz
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, startTime);
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.025);
        osc.stop(startTime + 0.03);
      } else {
        // Tempos regulares: 900 Hz claro
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, startTime);
        osc.frequency.exponentialRampToValueAtTime(450, startTime + 0.03);
        gainNode.gain.setValueAtTime(0.35, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);
        osc.stop(startTime + 0.04);
      }

      osc.connect(gainNode);
      gainNode.connect(this.masterGain);
      osc.start(startTime);
    } catch (err) {
      console.warn('Erro no metrônomo do soundEngine:', err);
    }
  }
}

export const soundEngine = new SoundEngine();
