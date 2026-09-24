/**
 * Caso de Uso: VerifyChordVoicingUseCase
 * Validação harmônica entre conjunto de notas tocadas e o acorde esperado.
 * Regra: SRP, isolamento de domínio (< 85 linhas).
 */

import { Chord } from '../../domain/entities/Chord';

export interface VerifyChordVoicingInput {
  readonly expectedChord: Chord;
  readonly playedNoteNames: string[];
}

export interface VerifyChordVoicingResult {
  readonly isMatch: boolean;
  readonly isExactInversion: boolean;
  readonly missingNotes: string[];
  readonly extraNotes: string[];
  readonly detectedBass: string | null;
}

export class VerifyChordVoicingUseCase {
  public execute(input: VerifyChordVoicingInput): VerifyChordVoicingResult {
    const expectedSet = new Set(input.expectedChord.notes.map(n => n.name));
    const playedNormalized = input.playedNoteNames.map(n => n.replace(/\d+$/, '').trim().toUpperCase());
    const playedSet = new Set(playedNormalized);

    const missingNotes = Array.from(expectedSet).filter(note => !playedSet.has(note));
    const extraNotes = Array.from(playedSet).filter(note => !expectedSet.has(note));
    const isMatch = missingNotes.length === 0 && extraNotes.length === 0;

    const detectedBass = input.playedNoteNames.length > 0 ? input.playedNoteNames[0] : null;
    const isExactInversion = isMatch && detectedBass !== null && detectedBass.startsWith(input.expectedChord.bassNote.name);

    return {
      isMatch,
      isExactInversion,
      missingNotes,
      extraNotes,
      detectedBass,
    };
  }
}
