import type { LatencyCalibrationProfile } from './types';

const STORAGE_KEY = 'harmonia_latency_profile';

class LatencyManager {
  private profile: LatencyCalibrationProfile;

  constructor() {
    this.profile = this.loadProfile();
  }

  private loadProfile(): LatencyCalibrationProfile {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil de latência:', e);
    }

    return {
      deviceType: 'speaker',
      offsetMs: 0,
      isCalibrated: false,
    };
  }

  public saveProfile(profile: Partial<LatencyCalibrationProfile>) {
    this.profile = {
      ...this.profile,
      ...profile,
      lastCalibrationDate: new Date().toISOString(),
    };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      }
    } catch (e) {
      console.error('Erro ao salvar perfil de latência:', e);
    }
  }

  public getProfile(): LatencyCalibrationProfile {
    return this.profile;
  }

  public getOffsetMs(): number {
    return this.profile.offsetMs;
  }

  public setOffsetMs(offset: number) {
    this.saveProfile({ offsetMs: offset, isCalibrated: true });
  }

  private toleranceMs = 70; // Padrão: 70ms

  public getToleranceMs(): number {
    return this.toleranceMs;
  }

  public setToleranceMs(tolerance: number) {
    this.toleranceMs = Math.max(20, Math.min(200, Math.round(tolerance)));
  }

  // Avalia o toque do usuário considerando o offset do hardware e a sensibilidade configurada
  public evaluateTap(targetTimeMs: number, tapTimeMs: number, customToleranceMs?: number): {
    diffMs: number;
    rawDiffMs: number;
    result: 'perfect' | 'good' | 'early' | 'late';
    label: string;
    color: string;
  } {
    // rawDiffMs = tempo de toque - tempo alvo
    const rawDiffMs = tapTimeMs - targetTimeMs;
    // Compensa a latência de saída (se o áudio atrasa 100ms, o usuário ouve 100ms depois e bate 100ms depois)
    const diffMs = rawDiffMs - this.profile.offsetMs;
    const absDiff = Math.abs(diffMs);

    const tol = customToleranceMs !== undefined ? customToleranceMs : this.toleranceMs;
    const perfectLimit = Math.max(12, Math.round(tol * 0.4));
    const goodLimit = tol;

    if (absDiff <= perfectLimit) {
      return {
        diffMs,
        rawDiffMs,
        result: 'perfect',
        label: `PERFEITO! (±${Math.round(absDiff)}ms)`,
        color: 'text-emerald-400',
      };
    } else if (absDiff <= goodLimit) {
      return {
        diffMs,
        rawDiffMs,
        result: 'good',
        label: diffMs < 0 ? `BOM (-${Math.round(absDiff)}ms)` : `BOM (+${Math.round(absDiff)}ms)`,
        color: 'text-cyan-400',
      };
    } else if (diffMs < -goodLimit) {
      return {
        diffMs,
        rawDiffMs,
        result: 'early',
        label: `ADIANTADO (${Math.round(diffMs)}ms)`,
        color: 'text-amber-400',
      };
    } else {
      return {
        diffMs,
        rawDiffMs,
        result: 'late',
        label: `ATRASADO (+${Math.round(diffMs)}ms)`,
        color: 'text-rose-400',
      };
    }
  }
}

export const latencyManager = new LatencyManager();
