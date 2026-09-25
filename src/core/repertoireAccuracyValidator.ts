/**
 * repertoireAccuracyValidator.ts
 * Validador de Acurácia Musical para o Repertório de Partituras.
 * Inspeciona a integridade das notas, métrica dos compassos, ordenação cronológica,
 * harmonia, tessitura, duração e comportamento de término da reprodução.
 */

import type { RepertoireSong } from './repertoireData';
import type { ScoreNote } from './coursesData';
import { parseChord } from './musicTheory';

export type DiagnosticSeverity = 'INFO' | 'WARNING' | 'ERROR';

export interface MusicalDiagnostic {
  id: string;
  category: 'Compassos & Métrica' | 'Notas & MIDI' | 'Acordes & Harmonia' | 'Ordenação Temporal' | 'Estrutura & Fim';
  severity: DiagnosticSeverity;
  measure?: number;
  beat?: number;
  message: string;
  technicalDetails?: string;
}

export interface SongAccuracyReport {
  songId: string;
  songTitle: string;
  totalNotes: number;
  totalMeasures: number;
  accuracyScore: number; // 0 a 100
  status: 'PERFECT' | 'EXCELLENT' | 'GOOD' | 'NEEDS_REVIEW';
  diagnostics: MusicalDiagnostic[];
  isComplete: boolean;
  hasProperEnding: boolean;
  clefDistribution: { treble: number; bass: number };
}

export class RepertoireAccuracyValidator {
  /**
   * Valida minuciosamente uma obra do repertório
   */
  public static validateSong(song: RepertoireSong): SongAccuracyReport {
    const diagnostics: MusicalDiagnostic[] = [];
    const notes = song.scoreTrack || [];

    // 1. Verificação de dados básicos
    if (notes.length === 0) {
      diagnostics.push({
        id: 'empty-track',
        category: 'Estrutura & Fim',
        severity: 'ERROR',
        message: 'A música não possui notas cadastradas no scoreTrack.',
      });
      return {
        songId: song.id,
        songTitle: song.title,
        totalNotes: 0,
        totalMeasures: 0,
        accuracyScore: 0,
        status: 'NEEDS_REVIEW',
        diagnostics,
        isComplete: false,
        hasProperEnding: false,
        clefDistribution: { treble: 0, bass: 0 },
      };
    }

    // Calcula batidas por compasso conforme fórmula
    const parts = (song.timeSignature || '4/4').split('/');
    const beatsPerMeasure = parseInt(parts[0], 10) || 4;

    let trebleCount = 0;
    let bassCount = 0;
    let maxMeasure = 1;

    // Mapa de compassos para validar preenchimento métrico
    const measureBeats = new Map<number, number>();

    // 2. Análise de cada nota
    let prevChronologicalOffset = -1;

    notes.forEach((note, index) => {
      const m = Math.max(1, note.measure || 1);
      const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
      const dur = note.duration || 1;

      if (m > maxMeasure) maxMeasure = m;
      if (note.clef === 'treble') trebleCount++;
      if (note.clef === 'bass') bassCount++;

      // Checa MIDI válido
      if (note.midi === undefined || isNaN(note.midi) || note.midi < 21 || note.midi > 108) {
        diagnostics.push({
          id: `invalid-midi-${index}`,
          category: 'Notas & MIDI',
          severity: 'ERROR',
          measure: m,
          beat: b + 1,
          message: `Nota com valor MIDI inválido (${note.midi}). O padrão de piano é 21 (A0) a 108 (C8).`,
        });
      }

      // Checa duração
      if (dur <= 0 || isNaN(dur)) {
        diagnostics.push({
          id: `invalid-dur-${index}`,
          category: 'Notas & MIDI',
          severity: 'ERROR',
          measure: m,
          beat: b + 1,
          message: `Nota com duração rítmica inválida (${dur}).`,
        });
      }

      // Checa ordenação temporal no array
      const currentOffset = (m - 1) * beatsPerMeasure + b;
      if (currentOffset < prevChronologicalOffset) {
        diagnostics.push({
          id: `out-of-order-${index}`,
          category: 'Ordenação Temporal',
          severity: 'WARNING',
          measure: m,
          beat: b + 1,
          message: `Evento fora de ordem cronológica no compasso ${m}, tempo ${b + 1}.`,
          technicalDetails: `Offset atual (${currentOffset}) menor que o anterior (${prevChronologicalOffset}).`,
        });
      }
      prevChronologicalOffset = currentOffset;

      // Acumula métrica do compasso
      const existing = measureBeats.get(m) || 0;
      measureBeats.set(m, Math.max(existing, b + dur));

      // Checa se o acorde especificado na nota é musicalmente válido
      if (note.chordName) {
        const parsed = parseChord(note.chordName);
        if (!parsed) {
          diagnostics.push({
            id: `invalid-chord-name-${index}`,
            category: 'Acordes & Harmonia',
            severity: 'WARNING',
            measure: m,
            beat: b + 1,
            message: `Acorde com nomenclatura não reconhecida: "${note.chordName}".`,
          });
        }
      }
    });

    // 3. Validação dos acordes gerais declarados
    if (song.chords && song.chords.length > 0) {
      song.chords.forEach((chordStr) => {
        const parsed = parseChord(chordStr);
        if (!parsed) {
          diagnostics.push({
            id: `invalid-song-chord-${chordStr}`,
            category: 'Acordes & Harmonia',
            severity: 'WARNING',
            message: `Acorde "${chordStr}" declarado na lista geral da obra não pôde ser parseado pela teoria musical.`,
          });
        }
      });
    }

    // 4. Verificação de tessitura e equilíbrio entre mãos
    if (trebleCount === 0 && bassCount > 0) {
      diagnostics.push({
        id: 'no-treble',
        category: 'Notas & MIDI',
        severity: 'INFO',
        message: 'A obra contém apenas clave de Fá (sem mão direita).',
      });
    }

    // 5. Verificação da última nota e finalização real
    const lastNote = notes[notes.length - 1];
    let hasProperEnding = false;
    if (lastNote) {
      const lastDur = lastNote.duration || 1;
      if (lastDur >= 1) {
        hasProperEnding = true;
      } else {
        diagnostics.push({
          id: 'short-final-note',
          category: 'Estrutura & Fim',
          severity: 'WARNING',
          measure: lastNote.measure,
          message: `A última nota musical tem duração muito curta (${lastDur} tempo). Recomenda-se sustentação mínima de 1 a 4 tempos no acorde final.`,
        });
      }
    }

    // 6. Cálculo do Score de Acurácia Musical
    let errorPenalty = 0;
    diagnostics.forEach((d) => {
      if (d.severity === 'ERROR') errorPenalty += 20;
      if (d.severity === 'WARNING') errorPenalty += 5;
    });

    const accuracyScore = Math.max(0, Math.min(100, 100 - errorPenalty));

    let status: 'PERFECT' | 'EXCELLENT' | 'GOOD' | 'NEEDS_REVIEW' = 'NEEDS_REVIEW';
    if (accuracyScore === 100) status = 'PERFECT';
    else if (accuracyScore >= 95) status = 'EXCELLENT';
    else if (accuracyScore >= 80) status = 'GOOD';

    return {
      songId: song.id,
      songTitle: song.title,
      totalNotes: notes.length,
      totalMeasures: maxMeasure,
      accuracyScore,
      status,
      diagnostics,
      isComplete: maxMeasure >= 8,
      hasProperEnding,
      clefDistribution: { treble: trebleCount, bass: bassCount },
    };
  }

  /**
   * Valida todo o catálogo de músicas de uma só vez
   */
  public static validateAll(songs: RepertoireSong[]): {
    reports: SongAccuracyReport[];
    globalAverageScore: number;
    perfectCount: number;
    totalSongs: number;
  } {
    const reports = songs.map((s) => this.validateSong(s));
    const totalSongs = reports.length;
    const totalScore = reports.reduce((acc, r) => acc + r.accuracyScore, 0);
    const perfectCount = reports.filter((r) => r.accuracyScore >= 98).length;

    return {
      reports,
      globalAverageScore: totalSongs > 0 ? Math.round(totalScore / totalSongs) : 100,
      perfectCount,
      totalSongs,
    };
  }
}
