/**
 * audioInputConfigStore.ts
 *
 * Gerenciador reativo centralizado das configurações de entrada:
 * - Tipo de Entrada / Modo de Conexão: 'midi' | 'mic' | 'line-in' | 'headset'
 * - Canal MIDI (0 = todos / OMNI, 1..16)
 * - Dispositivo de Entrada de Áudio Selecionado (Microfone, Cabo P2, Interface USB)
 * - Sensibilidade do Microfone (10% a 100%)
 * - Presets: 'low' (25%), 'normal' (50%), 'high' (75%)
 *
 * Regra Estrita useSyncExternalStore (React 18/19):
 * O método getSnapshot DEVE retornar SEMPRE a mesma referência imutável de objeto (this.state),
 * atualizada somente quando houver alteração real de estado. Nunca retornar objeto literal inline.
 */

import { useSyncExternalStore } from 'react';
import { micPitchDetector } from './pitchDetector';

export type InputModeType = 'midi' | 'mic' | 'line-in' | 'headset';

export interface AudioInputConfig {
  selectedDeviceId: string;
  sensitivityPercent: number;
  inputMode: InputModeType;
  midiChannel: number;
}

const STORAGE_DEVICE_KEY = 'harmonia_selected_audio_device';
const STORAGE_MODE_KEY = 'harmonia_selected_input_mode';
const STORAGE_CHANNEL_KEY = 'harmonia_selected_midi_channel';

type Listener = () => void;

class AudioInputConfigStore {
  private state: AudioInputConfig;
  private listeners = new Set<Listener>();

  constructor() {
    const devId = this.loadDeviceId();
    const sens = micPitchDetector.getSensitivityPercent();
    const mode = this.loadInputMode();
    const ch = this.loadMidiChannel();
    this.state = {
      selectedDeviceId: devId,
      sensitivityPercent: sens,
      inputMode: mode,
      midiChannel: ch,
    };
  }

  private loadDeviceId(): string {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(STORAGE_DEVICE_KEY) || '';
    } catch {
      return '';
    }
  }

  private loadInputMode(): InputModeType {
    if (typeof window === 'undefined') return 'mic';
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      if (saved === 'midi' || saved === 'mic' || saved === 'line-in' || saved === 'headset') {
        return saved;
      }
      return 'mic';
    } catch {
      return 'mic';
    }
  }

  private loadMidiChannel(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(STORAGE_CHANNEL_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 16) {
          return parsed;
        }
      }
      return 0;
    } catch {
      return 0;
    }
  }

  public getSnapshot = (): AudioInputConfig => {
    return this.state;
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public setSelectedDeviceId(id: string) {
    if (this.state.selectedDeviceId === id) return;
    this.state = {
      ...this.state,
      selectedDeviceId: id,
    };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_DEVICE_KEY, id);
      }
    } catch {
      // ignore
    }
    this.notify();
  }

  public setSensitivityPercent(percent: number) {
    const clamped = Math.max(10, Math.min(100, Math.round(percent)));
    if (this.state.sensitivityPercent === clamped) return;
    this.state = {
      ...this.state,
      sensitivityPercent: clamped,
    };
    micPitchDetector.setSensitivityPercent(clamped);
    this.notify();
  }

  public setPreset(preset: 'low' | 'normal' | 'high') {
    const target = preset === 'high' ? 75 : preset === 'low' ? 25 : 50;
    this.setSensitivityPercent(target);
  }

  public setInputMode(mode: InputModeType) {
    if (this.state.inputMode === mode) return;
    this.state = {
      ...this.state,
      inputMode: mode,
    };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_MODE_KEY, mode);
      }
    } catch {
      // ignore
    }
    this.notify();
  }

  public setMidiChannel(channel: number) {
    const clamped = Math.max(0, Math.min(16, Math.round(channel)));
    if (this.state.midiChannel === clamped) return;
    this.state = {
      ...this.state,
      midiChannel: clamped,
    };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CHANNEL_KEY, clamped.toString());
      }
    } catch {
      // ignore
    }
    this.notify();
  }
}

export const audioInputConfigStore = new AudioInputConfigStore();

export function useAudioInputConfig(): AudioInputConfig {
  return useSyncExternalStore(
    audioInputConfigStore.subscribe,
    audioInputConfigStore.getSnapshot,
    audioInputConfigStore.getSnapshot
  );
}
