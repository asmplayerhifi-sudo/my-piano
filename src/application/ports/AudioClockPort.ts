/**
 * Port: AudioClockPort
 * Interface abstrata para relógio de áudio de alta precisão (livre de drift).
 * Regra: Contrato puro (< 30 linhas).
 */

export interface AudioClockPort {
  getCurrentTimeSec(): number;
  scheduleCallback(timeSec: number, callback: () => void): number;
  cancelCallback(id: number): void;
}
