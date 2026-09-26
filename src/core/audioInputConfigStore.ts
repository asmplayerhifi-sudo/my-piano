/**
 * audioInputConfigStore.ts
 *
 * Gerenciador reativo centralizado das configurações de entrada:
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

export interface AudioInputConfig {
  selectedDeviceId: string;
  sensitivityPercent: number;
}

const STORAGE_DEVICE_KEY = 'harmonia_selected_audio_device';

type Listener = () => void;

class AudioInputConfigStore {
  private state: AudioInputConfig;
  private listeners = new Set<Listener>();

  constructor() {
    const devId = this.loadDeviceId();
    const sens = micPitchDetector.getSensitivityPercent();
    this.state = {
      selectedDeviceId: devId,
      sensitivityPercent: sens,
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
}

export const audioInputConfigStore = new AudioInputConfigStore();

export function useAudioInputConfig(): AudioInputConfig {
  return useSyncExternalStore(
    audioInputConfigStore.subscribe,
    audioInputConfigStore.getSnapshot,
    audioInputConfigStore.getSnapshot
  );
}
