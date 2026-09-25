/**
 * Entidade de Domínio: Note
 * Representação imutável de uma nota musical com conversão matemática determinística.
 * Regra: Domínio puro, sem dependências de frameworks (< 60 linhas).
 */

import { octaveConfigStore, type OctaveStandard } from '../../core/octaveConfigStore';

export class Note {
  private static readonly NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  public readonly midi: number;
  public readonly name: string;
  public readonly octave: number;
  public readonly fullName: string;
  public readonly frequencyHz: number;
  public readonly standard: OctaveStandard;

  constructor(midi: number, standard?: OctaveStandard) {
    this.midi = Math.max(0, Math.min(127, Math.round(midi)));
    const noteIndex = ((this.midi % 12) + 12) % 12;
    this.name = Note.NOTE_NAMES[noteIndex];
    this.standard = standard ?? octaveConfigStore.getStandard();
    this.octave = Math.floor(this.midi / 12) + (this.standard === 'C4' ? -1 : -2);
    this.fullName = `${this.name}${this.octave}`;
    // A (MIDI 69) = 440 Hz
    this.frequencyHz = 440 * Math.pow(2, (this.midi - 69) / 12);
  }

  public get frequency(): number {
    return this.frequencyHz;
  }

  public static fromMidi(midi: number, standard?: OctaveStandard): Note {
    return new Note(midi, standard);
  }

  public static fromName(name: string, octave?: number, standard?: OctaveStandard): Note {
    const std = standard ?? octaveConfigStore.getStandard();
    const cleanName = name.trim().toUpperCase();
    const index = Note.NOTE_NAMES.indexOf(cleanName);
    if (index === -1) {
      throw new Error(`Nota inválida: ${name}`);
    }
    const defOctave = octave ?? (std === 'C4' ? 4 : 3);
    const offset = std === 'C4' ? 1 : 2;
    const midi = (defOctave + offset) * 12 + index;
    return new Note(midi, std);
  }

  public transpose(semitones: number): Note {
    return new Note(this.midi + semitones, this.standard);
  }
}
