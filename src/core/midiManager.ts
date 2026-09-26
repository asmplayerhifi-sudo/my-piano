/**
 * midiManager.ts
 * Gerenciador universal de entrada MIDI física (USB, Cabo OTG e Bluetooth MIDI).
 * Conecta instrumentos reais (teclados, pianos digitais, controladores) à engine sonora e ao teclado visual.
 * Regra: Camada Core, singleton determinístico sem dependências de UI (< 160 linhas).
 */

import { soundEngine } from './soundEngine';
import { activeMidiStore } from './activeMidiStore';
import { sustainPedalStore } from './sustainPedalStore';
import { getNoteInfo } from './musicTheory';

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: string;
}

export interface MidiEventPayload {
  midi: number;
  noteName: string;
  velocity: number;
  isDown: boolean;
  channel: number;
}

export type MidiListener = (event: MidiEventPayload) => void;
export type DeviceChangeListener = (devices: MidiDevice[]) => void;

class MidiManager {
  private midiAccess: MIDIAccess | null = null;
  private isSupported = false;
  private connectedDevices: Map<string, MidiDevice> = new Map();
  private listeners: Set<MidiListener> = new Set();
  private deviceListeners: Set<DeviceChangeListener> = new Set();
  private isInitialized = false;

  constructor() {
    this.checkSupport();
  }

  public checkSupport(): boolean {
    if (typeof window !== 'undefined' && 'navigator' in window && 'requestMIDIAccess' in navigator) {
      this.isSupported = true;
      return true;
    }
    this.isSupported = false;
    return false;
  }

  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (!this.checkSupport()) return false;

    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      this.midiAccess = access;
      this.isInitialized = true;

      this.updateInputs(access);

      access.onstatechange = () => {
        if (this.midiAccess) {
          this.updateInputs(this.midiAccess);
        }
      };

      return true;
    } catch (err) {
      console.warn('[MidiManager] Falha ao solicitar acesso Web MIDI:', err);
      return false;
    }
  }

  private updateInputs(access: MIDIAccess): void {
    const devices: MidiDevice[] = [];
    this.connectedDevices.clear();

    access.inputs.forEach((input) => {
      const device: MidiDevice = {
        id: input.id,
        name: input.name || 'Teclado MIDI USB',
        manufacturer: input.manufacturer || 'Dispositivo USB/MIDI',
        state: input.state,
      };
      this.connectedDevices.set(input.id, device);
      devices.push(device);

      // Associa o listener de notas para este teclado / controlador físico
      input.onmidimessage = (event: MIDIMessageEvent) => this.handleMidiMessage(event);
    });

    this.deviceListeners.forEach(listener => listener(devices));
  }

  private handleMidiMessage(event: MIDIMessageEvent): void {
    if (!event.data || event.data.length < 2) return;

    const [status, note, velocity = 0] = event.data;
    const command = status >> 4;
    const channel = status & 0x0f;

    // 0x0B (11): Control Change (CC)
    // CC 64: Damper Pedal / Sustain (>= 64 pressionado, < 64 liberado)
    if (command === 11 && note === 64) {
      const isPedalDown = velocity >= 64;
      sustainPedalStore.setSustain(isPedalDown);
      return;
    }

    // 0x09: Note On (com velocity > 0)
    // 0x08: Note Off (ou Note On com velocity = 0)
    if (command === 9 && velocity > 0) {
      const noteInfo = getNoteInfo(note);
      // 1. Toca na engine de som com volume proporcional à sensibilidade ao toque (velocity)
      soundEngine.startPianoNote(note, Math.max(0.15, velocity / 127));
      // 2. Acende a tecla no teclado virtual / visualizador global
      activeMidiStore.noteOn(note, 2500);

      const payload: MidiEventPayload = {
        midi: note,
        noteName: `${noteInfo.name}${noteInfo.octave}`,
        velocity,
        isDown: true,
        channel,
      };
      this.listeners.forEach(cb => cb(payload));
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      const noteInfo = getNoteInfo(note);
      soundEngine.stopPianoNote(note);
      activeMidiStore.noteOff(note);

      const payload: MidiEventPayload = {
        midi: note,
        noteName: `${noteInfo.name}${noteInfo.octave}`,
        velocity: 0,
        isDown: false,
        channel,
      };
      this.listeners.forEach(cb => cb(payload));
    }
  }

  public getDevices(): MidiDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  public hasSupport(): boolean {
    return this.isSupported;
  }

  public subscribe(listener: MidiListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeDevices(listener: DeviceChangeListener): () => void {
    this.deviceListeners.add(listener);
    listener(this.getDevices());
    return () => this.deviceListeners.delete(listener);
  }
}

export const midiManager = new MidiManager();
