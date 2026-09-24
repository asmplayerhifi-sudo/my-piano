/**
 * Port: AudioSynthesisPort
 * Interface abstrata para reprodução e síntese sonoplástica de instrumentos.
 * Regra: Contrato puro (< 40 linhas).
 */

export interface AudioSynthesisPort {
  playNote(midi: number, durationSec?: number, velocity?: number): void;
  playClick(isAccented: boolean): void;
  stopAll(): void;
  ensureReady(): Promise<void>;
}
