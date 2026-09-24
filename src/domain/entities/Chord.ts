/**
 * Entidade de Domínio: Chord
 * Modelagem de tríades, inversões e verificação de voicings.
 * Regra: Domínio puro, sem dependências de frameworks (< 90 linhas).
 */

import { Note } from './Note';

export type ChordQuality = 'MAJOR' | 'MINOR' | 'DIMINISHED' | 'AUGMENTED';

export interface CreateTriadOptions {
  readonly root: string;
  readonly quality: ChordQuality;
  readonly octave?: number;
}

export class Chord {
  private static readonly TRIAD_INTERVALS: Record<ChordQuality, number[]> = {
    MAJOR: [0, 4, 7],
    MINOR: [0, 3, 7],
    DIMINISHED: [0, 3, 6],
    AUGMENTED: [0, 4, 8],
  };

  public readonly symbol: string;
  public readonly notes: Note[];
  public readonly bassNote: Note;
  public readonly inversion: number;

  constructor(symbol: string, notes: Note[], inversion = 0) {
    this.symbol = symbol;
    this.notes = notes;
    this.inversion = inversion;
    this.bassNote = notes[0];
  }

  public static createTriad(options: CreateTriadOptions): Chord {
    const rootNote = Note.fromName(options.root, options.octave ?? 4);
    const intervals = Chord.TRIAD_INTERVALS[options.quality];
    const notes = intervals.map(semitones => rootNote.transpose(semitones));
    const symbolSuffix = options.quality === 'MINOR' ? 'm' : options.quality === 'DIMINISHED' ? 'dim' : options.quality === 'AUGMENTED' ? 'aug' : '';
    return new Chord(`${options.root}${symbolSuffix}`, notes, 0);
  }

  public toInversion(inversionNumber: number): Chord {
    if (inversionNumber === 0) return this;
    const inv = inversionNumber % this.notes.length;
    const newNotes: Note[] = [];
    for (let i = 0; i < this.notes.length; i++) {
      const original = this.notes[(i + inv) % this.notes.length];
      newNotes.push(i + inv >= this.notes.length ? original.transpose(12) : original);
    }
    const rootSymbol = this.symbol.split('/')[0];
    const bassName = newNotes[0].name;
    return new Chord(`${rootSymbol}/${bassName}`, newNotes, inv);
  }

  public matchesVoicing(playedNoteFullNames: string[]): boolean {
    const expected = new Set(this.notes.map(n => n.fullName));
    if (expected.size !== playedNoteFullNames.length) return false;
    return playedNoteFullNames.every(name => expected.has(name));
  }
}
