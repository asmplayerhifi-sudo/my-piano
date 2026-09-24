/**
 * Entidade de Domínio: Note
 * Representação imutável de uma nota musical com conversão matemática determinística.
 * Regra: Domínio puro, sem dependências de frameworks (< 60 linhas).
 */

export class Note {
  private static readonly NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  public readonly midi: number;
  public readonly name: string;
  public readonly octave: number;
  public readonly fullName: string;
  public readonly frequencyHz: number;

  constructor(midi: number) {
    this.midi = Math.max(0, Math.min(127, Math.round(midi)));
    const noteIndex = ((this.midi % 12) + 12) % 12;
    this.name = Note.NOTE_NAMES[noteIndex];
    this.octave = Math.floor(this.midi / 12) - 2;
    this.fullName = `${this.name}${this.octave}`;
    // A3 (MIDI 69) = 440 Hz
    this.frequencyHz = 440 * Math.pow(2, (this.midi - 69) / 12);
  }

  public static fromMidi(midi: number): Note {
    return new Note(midi);
  }

  public static fromName(name: string, octave = 3): Note {
    const cleanName = name.trim().toUpperCase();
    const index = Note.NOTE_NAMES.indexOf(cleanName);
    if (index === -1) {
      throw new Error(`Nota inválida: ${name}`);
    }
    const midi = (octave + 2) * 12 + index;
    return new Note(midi);
  }

  public transpose(semitones: number): Note {
    return new Note(this.midi + semitones);
  }
}
