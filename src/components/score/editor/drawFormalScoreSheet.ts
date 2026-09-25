/**
 * editor/drawFormalScoreSheet.ts
 * Renderização gráfica em Canvas da Partitura Formal com suporte a cliques, figuras e acordes polifônicos.
 * Regra: Função pura de renderização Canvas (< 340 linhas).
 */

import type { FormalScoreNote, ScoreSheetRenderOptions } from './scoreSheetTypes';
import { buildBeamGroups, renderBeamGroup } from '../scoreBeaming';
import type { BeamCandidate } from '../scoreBeaming';

interface DrawSheetParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  notes: FormalScoreNote[];
  timeSignature: [number, number];
  playheadBeat: number | null;
  selectedNoteId: string | null;
  options: ScoreSheetRenderOptions;
  totalMeasures: number;
  beatsPerMeasure: number;
  scrollLeft: number;
}

export const START_X = 95;

/** Calcula a posição vertical Y exata respeitando a respectiva clave com espaçamento de 6px por passo */
export function getDiatonicY(noteName: string, clef: 'treble' | 'bass' = 'treble'): number {
  const match = noteName.match(/^([A-G])([#b♭♯]?)(\d+)$/i);
  if (!match) return clef === 'treble' ? 120 : 172;
  const letter = match[1].toUpperCase();
  const octave = parseInt(match[3], 10);
  const letterSteps: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

  if (clef === 'treble') {
    // Linha 1 da Clave de Sol (Mi3 / E3) = Y 108, Dó Central (C3) = Y 120 (linha suplementar inferior)
    const diatonicIndex = (octave - 3) * 7 + (letterSteps[letter] ?? 0) - 2;
    return 108 - diatonicIndex * 6;
  } else {
    // Linha 4 da Clave de Fá (Fá2 / F2) = Y 196, Dó Central (C3) = Y 172 (linha suplementar superior)
    const diatonicIndex = (octave - 2) * 7 + (letterSteps[letter] ?? 0) - 3;
    return 196 - diatonicIndex * 6;
  }
}

/** Converte coordenada Y do clique do usuário na pauta em tom diatônico, clave e nota MIDI */
export function getPitchFromY(clickY: number): { clef: 'treble' | 'bass'; noteName: string; midi: number } {
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const SEMITONES = [0, 2, 4, 5, 7, 9, 11];

  if (clickY <= 145) {
    // Clave de Sol: Mi3 (E3) = Y 108
    const diatonicIndex = Math.round((108 - clickY) / 6);
    const totalDiatonic = diatonicIndex + 23;
    const octave = Math.floor(totalDiatonic / 7);
    const letterIndex = ((totalDiatonic % 7) + 7) % 7;
    const letter = LETTERS[letterIndex];
    const noteName = `${letter}${octave}`;
    const midi = (octave + 2) * 12 + SEMITONES[letterIndex];
    return { clef: 'treble', noteName, midi };
  } else {
    // Clave de Fá: Fá2 (F2) = Y 196
    const diatonicIndex = Math.round((196 - clickY) / 6);
    const totalDiatonic = diatonicIndex + 17;
    const octave = Math.floor(totalDiatonic / 7);
    const letterIndex = ((totalDiatonic % 7) + 7) % 7;
    const letter = LETTERS[letterIndex];
    const noteName = `${letter}${octave}`;
    const midi = (octave + 2) * 12 + SEMITONES[letterIndex];
    return { clef: 'bass', noteName, midi };
  }
}

/** Reconhece cifras harmônicas de notas empilhadas no mesmo beat */
function detectChordSymbol(groupNotes: FormalScoreNote[]): string | null {
  if (groupNotes.length < 2) return null;
  const NOTE_LETTERS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const pitchClasses = Array.from(new Set(groupNotes.map(n => ((n.midi % 12) + 12) % 12))).sort((a, b) => a - b);
  if (pitchClasses.length < 2) return null;

  for (const root of pitchClasses) {
    const intervals = pitchClasses.map(p => (p - root + 12) % 12).sort((a, b) => a - b);
    const intKey = intervals.join(',');
    const rootName = NOTE_LETTERS[root];

    if (intKey === '0,4,7') return rootName;
    if (intKey === '0,3,7') return `${rootName}m`;
    if (intKey === '0,3,6') return `${rootName}dim`;
    if (intKey === '0,4,8') return `${rootName}aug`;
    if (intKey === '0,4,7,10') return `${rootName}7`;
    if (intKey === '0,3,7,10') return `${rootName}m7`;
    if (intKey === '0,4,7,11') return `${rootName}maj7`;
    if (intKey === '0,3,6,10') return `${rootName}m7(♭5)`;
  }
  return null;
}

export function drawFormalScoreSheet({
  ctx,
  width,
  height,
  notes,
  timeSignature,
  playheadBeat,
  selectedNoteId,
  options,
  totalMeasures,
  beatsPerMeasure,
  scrollLeft,
}: DrawSheetParams): void {
  const isPaper = options.theme === 'paper';
  const { pixelsPerBeat } = options;

  // 1. Fundo
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = isPaper ? '#fcfbf7' : '#0a0a1a';
  ctx.fillRect(0, 0, width, height);

  // 2. Pentagramas (Sol: Y 60 a 108, Fá: Y 184 a 232)
  const trebleLinesY = [60, 72, 84, 96, 108];
  const bassLinesY = [184, 196, 208, 220, 232];
  const staffColor = isPaper ? '#18181b' : '#475569';

  ctx.strokeStyle = staffColor;
  ctx.lineWidth = 1.2;

  // Linhas horizontais do pentagrama
  [...trebleLinesY, ...bassLinesY].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
  });

  // Linha grossa e chave esquerda
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, trebleLinesY[0]);
  ctx.lineTo(20, bassLinesY[bassLinesY.length - 1]);
  ctx.stroke();

  // Símbolos de Clave
  ctx.fillStyle = isPaper ? '#09090b' : '#818cf8';
  ctx.font = 'bold 44px serif';
  ctx.fillText('𝄞', 30, 106);

  ctx.fillStyle = isPaper ? '#09090b' : '#a78bfa';
  ctx.font = 'bold 36px serif';
  ctx.fillText('𝄢', 32, 206);

  // Fórmula de Compasso (ex: 4/4)
  const [num, den] = timeSignature;
  ctx.fillStyle = isPaper ? '#1e293b' : '#e2e8f0';
  ctx.font = 'bold 20px "JetBrains Mono", serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${num}`, 72, 84);
  ctx.fillText(`${den}`, 72, 106);
  ctx.fillText(`${num}`, 72, 208);
  ctx.fillText(`${den}`, 72, 230);

  // 3. Barras de Compasso e Numeração
  for (let m = 0; m <= totalMeasures; m++) {
    const barX = START_X + m * beatsPerMeasure * pixelsPerBeat - scrollLeft;
    if (barX < 20 || barX > width + 40) continue;

    ctx.strokeStyle = isPaper ? '#64748b' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(barX, trebleLinesY[0]);
    ctx.lineTo(barX, bassLinesY[bassLinesY.length - 1]);
    ctx.stroke();

    if (m < totalMeasures && options.showMeasureNumbers) {
      ctx.fillStyle = isPaper ? '#475569' : '#94a3b8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`c.${m + 1}`, barX + 6, 48);
    }
  }

  // 4. Agrupamento por Beat e Clave para Suporte Real a Acordes (Chord Stacking)
  const beatGroups = new Map<string, FormalScoreNote[]>();
  notes.forEach(n => {
    const key = `${n.beat}_${n.clef}`;
    const list = beatGroups.get(key) || [];
    list.push(n);
    beatGroups.set(key, list);
  });

  // Também agrupa por beat geral para detectar e desenhar cifras de acordes no topo da pauta
  const totalBeatMap = new Map<number, FormalScoreNote[]>();
  notes.forEach(n => {
    const list = totalBeatMap.get(n.beat) || [];
    list.push(n);
    totalBeatMap.set(n.beat, list);
  });

  // Desenha identificador de Cifra de Acorde se houver 2 ou mais notas no mesmo beat
  totalBeatMap.forEach((bNotes, beat) => {
    if (bNotes.length >= 2) {
      const chordSymbol = detectChordSymbol(bNotes);
      if (chordSymbol) {
        const chordX = START_X + beat * pixelsPerBeat - scrollLeft;
        if (chordX > 20 && chordX < width - 20) {
          ctx.save();
          ctx.fillStyle = isPaper ? '#b45309' : '#fbbf24';
          ctx.font = 'bold 13px "JetBrains Mono", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(chordSymbol, chordX, 42);
          ctx.restore();
        }
      }
    }
  });

  // 4.1 Desenho de Notas e Acordes
  beatGroups.forEach((groupNotes) => {
    const firstNote = groupNotes[0];
    const beat = firstNote.beat;
    const clef = firstNote.clef;
    const noteX = START_X + beat * pixelsPerBeat - scrollLeft;
    if (noteX < -30 || noteX > width + 40) return;

    // Ordena do mais agudo (menor Y) para o mais grave (maior Y)
    const sorted = [...groupNotes].map(n => ({
      note: n,
      y: getDiatonicY(n.noteName, n.clef),
    })).sort((a, b) => a.y - b.y);

    const dur = firstNote.duration;
    const isWhole = dur >= 3.5;
    const isHalf = dur >= 1.75 && dur < 3.5;
    const middleLineY = clef === 'treble' ? 84 : 208;
    const avgY = sorted.reduce((sum, item) => sum + item.y, 0) / sorted.length;
    const isUp = avgY >= middleLineY;

    // Desenha cada cabeça de nota e acidentes do acorde
    sorted.forEach(({ note, y: noteY }) => {
      const isSelected = note.id === selectedNoteId;

      ctx.save();

      // Spotlight de Seleção
      if (isSelected) {
        ctx.fillStyle = isPaper ? 'rgba(99, 102, 241, 0.25)' : 'rgba(129, 140, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(noteX, noteY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Linhas Suplementares (Ledger lines)
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = staffColor;

      if (clef === 'treble') {
        if (noteY <= 48) {
          for (let ly = 48; ly >= noteY - 1; ly -= 12) {
            ctx.beginPath();
            ctx.moveTo(noteX - 12, ly);
            ctx.lineTo(noteX + 12, ly);
            ctx.stroke();
          }
        } else if (noteY >= 120) {
          for (let ly = 120; ly <= noteY + 1; ly += 12) {
            ctx.beginPath();
            ctx.moveTo(noteX - 12, ly);
            ctx.lineTo(noteX + 12, ly);
            ctx.stroke();
          }
        }
      } else {
        if (noteY <= 172) {
          for (let ly = 172; ly >= noteY - 1; ly -= 12) {
            ctx.beginPath();
            ctx.moveTo(noteX - 12, ly);
            ctx.lineTo(noteX + 12, ly);
            ctx.stroke();
          }
        } else if (noteY >= 244) {
          for (let ly = 244; ly <= noteY + 1; ly += 12) {
            ctx.beginPath();
            ctx.moveTo(noteX - 12, ly);
            ctx.lineTo(noteX + 12, ly);
            ctx.stroke();
          }
        }
      }

      // Acidente (♯ ou ♭)
      if (note.noteName.includes('#') || note.noteName.includes('♯')) {
        ctx.fillStyle = isPaper ? '#0f172a' : '#f8fafc';
        ctx.font = 'bold 16px serif';
        ctx.textAlign = 'right';
        ctx.fillText('♯', noteX - 9, noteY + 5);
      } else if (note.noteName.includes('b') || note.noteName.includes('♭')) {
        ctx.fillStyle = isPaper ? '#0f172a' : '#f8fafc';
        ctx.font = 'bold 16px serif';
        ctx.textAlign = 'right';
        ctx.fillText('♭', noteX - 9, noteY + 4);
      }

      // Cabeça da Nota
      const noteColor = isSelected ? '#6366f1' : isPaper ? '#09090b' : '#e2e8f0';
      ctx.fillStyle = noteColor;
      ctx.strokeStyle = noteColor;

      ctx.beginPath();
      ctx.ellipse(noteX, noteY, 8, 5.5, -Math.PI / 8, 0, Math.PI * 2);
      if (isWhole || isHalf) {
        ctx.lineWidth = 2.2;
        ctx.stroke();
      } else {
        ctx.fill();
      }

      // Rótulo da Nota (opcional)
      if (options.showNoteNames) {
        ctx.fillStyle = isPaper ? '#475569' : '#94a3b8';
        ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const labelY = clef === 'treble'
          ? (noteY >= 108 ? noteY + 16 : noteY - 12)
          : (noteY >= 232 ? noteY + 16 : noteY - 12);
        ctx.fillText(note.noteName, noteX, labelY);
      }

      ctx.restore();
    });

    // Haste Contínua Unificada para Acordes e Notas Simples (Mínimas e Semínimas)
    if (!isWhole && dur > 0.75) {
      ctx.save();
      const minY = sorted[0].y;
      const maxY = sorted[sorted.length - 1].y;
      const stemX = isUp ? noteX + 7 : noteX - 7;
      const startY = isUp ? maxY : minY;
      const endY = isUp ? minY - 32 : maxY + 32;

      ctx.strokeStyle = isPaper ? '#09090b' : '#e2e8f0';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(stemX, startY);
      ctx.lineTo(stemX, endY);
      ctx.stroke();
      ctx.restore();
    }
  });

  // 4.2 Agrupamento Formal de Figuras (Beaming de Colcheias e Semicolcheias)
  const beamCandidates: BeamCandidate[] = [];
  beatGroups.forEach((groupNotes) => {
    const firstNote = groupNotes[0];
    const dur = firstNote.duration;
    if (dur <= 0.75) {
      const noteX = START_X + firstNote.beat * pixelsPerBeat - scrollLeft;
      if (noteX < -30 || noteX > width + 40) return;
      const sorted = [...groupNotes].map(n => ({ n, y: getDiatonicY(n.noteName, n.clef) })).sort((a, b) => a.y - b.y);
      const middleLineY = firstNote.clef === 'treble' ? 84 : 208;
      const avgY = sorted.reduce((sum, item) => sum + item.y, 0) / sorted.length;
      const isUp = avgY >= middleLineY;
      // Para o feixe de ligação, conecta pela ponta da haste
      const anchorY = isUp ? sorted[0].y : sorted[sorted.length - 1].y;
      const isSelected = groupNotes.some(n => n.id === selectedNoteId);

      beamCandidates.push({
        id: firstNote.id,
        x: noteX,
        y: anchorY,
        duration: dur,
        beat: firstNote.beat,
        clef: firstNote.clef,
        color: isSelected ? '#6366f1' : (isPaper ? '#09090b' : '#e2e8f0'),
      });
    }
  });

  if (beamCandidates.length > 0) {
    const defaultColor = isPaper ? '#09090b' : '#e2e8f0';
    const beamGroups = buildBeamGroups(beamCandidates, {
      getMiddleLineY: (clef) => clef === 'treble' ? 84 : 208,
      stemOffset: 7,
      minStemLength: 30,
      beamThickness: 3.8,
      beatsPerMeasure: beatsPerMeasure || timeSignature[0] || 4,
    });

    beamGroups.forEach(group => {
      renderBeamGroup(ctx, group, defaultColor, 1.6);
    });
  }

  // 4.3 Cursor Fantasma / Hover Preview de Inserção na Pauta
  if (options.hoverPreview) {
    const { x, y, noteName, clef, isChord } = options.hoverPreview;
    ctx.save();
    ctx.strokeStyle = isPaper ? 'rgba(99, 102, 241, 0.6)' : 'rgba(129, 140, 248, 0.7)';
    ctx.fillStyle = isPaper ? 'rgba(99, 102, 241, 0.35)' : 'rgba(129, 140, 248, 0.45)';
    ctx.lineWidth = 1.5;

    // Linhas suplementares fantasmas
    if (clef === 'treble') {
      if (y <= 48) {
        for (let ly = 48; ly >= y - 1; ly -= 12) {
          ctx.beginPath();
          ctx.moveTo(x - 12, ly);
          ctx.lineTo(x + 12, ly);
          ctx.stroke();
        }
      } else if (y >= 120) {
        for (let ly = 120; ly <= y + 1; ly += 12) {
          ctx.beginPath();
          ctx.moveTo(x - 12, ly);
          ctx.lineTo(x + 12, ly);
          ctx.stroke();
        }
      }
    } else {
      if (y <= 172) {
        for (let ly = 172; ly >= y - 1; ly -= 12) {
          ctx.beginPath();
          ctx.moveTo(x - 12, ly);
          ctx.lineTo(x + 12, ly);
          ctx.stroke();
        }
      } else if (y >= 244) {
        for (let ly = 244; ly <= y + 1; ly += 12) {
          ctx.beginPath();
          ctx.moveTo(x - 12, ly);
          ctx.lineTo(x + 12, ly);
          ctx.stroke();
        }
      }
    }

    // Nota fantasma com ellipse translúcida
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 5.5, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rótulo da nota flutuante
    ctx.fillStyle = isPaper ? '#1e1b4b' : '#c7d2fe';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const badgeLabel = isChord ? `+ Acorde: ${noteName}` : noteName;
    ctx.fillText(badgeLabel, x, y > 150 ? y + 18 : y - 12);

    ctx.restore();
  }

  // 5. Cursor de Reprodução (Playhead)
  if (playheadBeat !== null) {
    const playheadX = START_X + playheadBeat * pixelsPerBeat - scrollLeft;
    ctx.save();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(playheadX, 40);
    ctx.lineTo(playheadX, 260);
    ctx.stroke();
    ctx.restore();
  }
}
