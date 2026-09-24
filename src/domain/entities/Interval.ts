/**
 * Entidade de Domínio: Interval
 * Cálculo de semitons e classificação da qualidade de intervalos musicais.
 * Regra: Domínio puro, sem dependências de frameworks (< 70 linhas).
 */

import { Note } from './Note';

export type IntervalQuality = 'PERFECT' | 'MAJOR' | 'MINOR' | 'DIMINISHED' | 'AUGMENTED';

export class Interval {
  private static readonly INTERVAL_NAMES: Record<number, { name: string; quality: IntervalQuality }> = {
    0: { name: 'Uníssono', quality: 'PERFECT' },
    1: { name: 'Segunda Menor', quality: 'MINOR' },
    2: { name: 'Segunda Maior', quality: 'MAJOR' },
    3: { name: 'Terça Menor', quality: 'MINOR' },
    4: { name: 'Terça Maior', quality: 'MAJOR' },
    5: { name: 'Quarta Justa', quality: 'PERFECT' },
    6: { name: 'Trítono', quality: 'DIMINISHED' },
    7: { name: 'Quinta Justa', quality: 'PERFECT' },
    8: { name: 'Sexta Menor', quality: 'MINOR' },
    9: { name: 'Sexta Maior', quality: 'MAJOR' },
    10: { name: 'Sétima Menor', quality: 'MINOR' },
    11: { name: 'Sétima Maior', quality: 'MAJOR' },
    12: { name: 'Oitava Justa', quality: 'PERFECT' },
  };

  public readonly semitones: number;
  public readonly name: string;
  public readonly quality: IntervalQuality;

  constructor(fromNote: Note, toNote: Note) {
    this.semitones = Math.abs(toNote.midi - fromNote.midi);
    const mod = this.semitones % 12;
    const info = Interval.INTERVAL_NAMES[this.semitones === 12 ? 12 : mod] || {
      name: `Intervalo Composto (${this.semitones} semitons)`,
      quality: 'MAJOR' as IntervalQuality,
    };
    this.name = info.name;
    this.quality = info.quality;
  }

  public static between(fromMidi: number, toMidi: number): Interval {
    return new Interval(new Note(fromMidi), new Note(toMidi));
  }
}
