/**
 * phrasingTypes.ts
 *
 * Tipos e interfaces fundamentais para o Editor de Fraseados,
 * Biblioteca de Licks, Conversor Text-to-Melody e Treinador de Loop.
 */

export type PhrasingArticulation = 'normal' | 'legato' | 'staccato' | 'accent' | 'tenuto';

export type PhrasingGenre = 'blues' | 'jazz' | 'bossa' | 'pop' | 'classical';

export interface PhrasingNote {
  id: string;
  midi: number;
  noteName: string;
  duration: number; // em beats (ex: 1 = semínima, 0.5 = colcheia, 2 = mínima, 0.25 = semicolcheia)
  syllable?: string; // sílaba da letra associada (ex: "Pa", "ra", "béns")
  fingering?: number; // dedilhado recomendado de 1 a 5
  articulation?: PhrasingArticulation;
  beat: number; // posição em beats desde o início da frase (0-based)
}

export interface PhrasingLick {
  id: string;
  title: string;
  genre: PhrasingGenre;
  genreLabel: string;
  description: string;
  key: string;
  bpm: number;
  timeSignature: [number, number]; // [4, 4], [3, 4], etc.
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  notes: PhrasingNote[];
  pedagogicalTip?: string;
}

export interface TextToMelodyOptions {
  key?: string; // ex: 'C', 'G', 'F', 'Am', 'Dm'
  scaleType?: 'major' | 'minor' | 'pentatonic' | 'blues' | 'bossa';
  rootMidi?: number; // Dó central = 60
  timeSignature?: [number, number];
  defaultDuration?: number; // 0.5 (colcheias) ou 1.0 (semínimas)
}
