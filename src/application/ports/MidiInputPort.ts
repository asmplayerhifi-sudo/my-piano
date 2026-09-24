/**
 * Port: MidiInputPort
 * Interface abstrata para escuta de controladores MIDI e eventos físicos de tecla.
 * Regra: Contrato puro (< 35 linhas).
 */

export interface MidiNoteEvent {
  readonly midi: number;
  readonly velocity: number;
  readonly timestampMs: number;
}

export interface MidiInputPort {
  onNoteOn(listener: (event: MidiNoteEvent) => void): () => void;
  onNoteOff(listener: (event: MidiNoteEvent) => void): () => void;
  isConnected(): boolean;
}
