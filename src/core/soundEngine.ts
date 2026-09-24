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
      this.ctx.resume();
    }
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

  // Toca uma nota de piano sintetizado com envelope ADSR acústico
  public playPianoNote(midi: number, duration = 1.2, time?: number, velocity = 0.8) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = time ?? this.ctx.currentTime;
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

    // Envelope percussivo de Piano (Ataque 3ms, Decay rápido, Release gradual)
    const peakGain = 0.4 * velocity;
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.004); // Ataque do martelo
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.4, startTime + 0.2); // Decaimento inicial
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration); // Cauda

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Toca uma corda de violão (ataque brilhante com decaimento metálico/nylon)
  public playGuitarPluck(midi: number, duration = 1.8, time?: number, velocity = 0.8) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = time ?? this.ctx.currentTime;
    const freq = midiToFrequency(midi);

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    // Filtro simulando o dedilhado/palhetada com abertura rápida
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + 0.3);

    const peakGain = 0.3 * velocity;
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003); // Impacto da palheta
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.25, startTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
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
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = time ?? this.ctx.currentTime;
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
  }
}

export const soundEngine = new SoundEngine();
