/**
 * scrolling/useScoreTimeline.ts
 * Cálculo da régua temporal, compassos, acordes e pausas musicais.
 * Regra: Hook puro de cálculo e memoização (< 140 linhas).
 */

import { useMemo } from 'react';
import type { ScoreNote } from '../../../core/coursesData';
import type { ChordSpan, RestItem } from './types';

export function parseScoreTimeSignature(ts = '4/4') {
  const parts = ts.split('/');
  const num = parseInt(parts[0], 10) || 4;
  const den = parseInt(parts[1], 10) || 4;
  let beatsPerMeasure = num;
  if (den === 8 && num >= 6) {
    beatsPerMeasure = num / 3;
  }
  return { numerator: num, denominator: den, beatsPerMeasure };
}

export function useScoreTimeline(notes: ScoreNote[], timeSignature: string) {
  const { numerator, denominator, beatsPerMeasure } = useMemo(
    () => parseScoreTimeSignature(timeSignature),
    [timeSignature]
  );

  const timeline = useMemo(() => {
    const measureStartBeats = new Map<number, number>();
    const noteOffsets: number[] = [];

    if (!notes || notes.length === 0) {
      return { noteOffsets, measureStartBeats, maxMeasure: 1, totalBeats: 4, chordSpans: [] as ChordSpan[] };
    }

    let maxMeasure = 1;
    let maxBeat = 0;

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const m = Math.max(1, note.measure || 1);
      const b = note.beat !== undefined ? Math.max(0, note.beat - 1) : 0;
      const dur = note.duration || 1;
      const beatOffset = (m - 1) * beatsPerMeasure + b;

      noteOffsets.push(beatOffset);
      if (!measureStartBeats.has(m)) {
        measureStartBeats.set(m, (m - 1) * beatsPerMeasure);
      }
      if (m > maxMeasure) maxMeasure = m;
      if (beatOffset + dur > maxBeat) maxBeat = beatOffset + dur;
    }

    const rawChords: ChordSpan[] = [];
    notes.forEach((n, idx) => {
      const chord = n.chordName || (n as unknown as { chord?: string }).chord;
      if (chord) {
        rawChords.push({
          chordName: chord,
          startBeat: noteOffsets[idx],
          duration: n.duration || 1,
          measure: n.measure || 1,
        });
      }
    });

    const chordSpans: ChordSpan[] = [];
    for (const rc of rawChords) {
      if (chordSpans.length === 0) {
        chordSpans.push({ ...rc });
      } else {
        const prev = chordSpans[chordSpans.length - 1];
        if (prev.chordName === rc.chordName && rc.startBeat <= prev.startBeat + prev.duration + 0.05) {
          prev.duration = Math.max(prev.duration, (rc.startBeat - prev.startBeat) + rc.duration);
        } else if (rc.startBeat === prev.startBeat) {
          prev.duration = Math.max(prev.duration, rc.duration);
        } else {
          chordSpans.push({ ...rc });
        }
      }
    }

    for (let i = 0; i < chordSpans.length; i++) {
      const curr = chordSpans[i];
      const next = chordSpans[i + 1];
      const measureEndBeat = curr.measure * beatsPerMeasure;
      if (next && next.startBeat > curr.startBeat) {
        const gap = next.startBeat - curr.startBeat;
        if (gap <= beatsPerMeasure * 2) {
          curr.duration = Math.max(curr.duration, gap);
        }
      } else if (measureEndBeat > curr.startBeat) {
        curr.duration = Math.max(curr.duration, measureEndBeat - curr.startBeat);
      }
    }

    return {
      noteOffsets,
      measureStartBeats,
      maxMeasure,
      totalBeats: Math.max(maxMeasure * beatsPerMeasure, maxBeat),
      chordSpans,
    };
  }, [notes, beatsPerMeasure]);

  const restsList = useMemo(() => {
    const list: RestItem[] = [];
    if (!notes || notes.length === 0) return list;

    const measuresMap = new Map<number, { treble: ScoreNote[]; bass: ScoreNote[] }>();
    for (let m = 1; m <= timeline.maxMeasure; m++) {
      measuresMap.set(m, { treble: [], bass: [] });
    }

    notes.forEach(note => {
      const m = note.measure || 1;
      const entry = measuresMap.get(m);
      if (entry) {
        if (note.clef === 'treble') entry.treble.push(note);
        else entry.bass.push(note);
      }
    });

    measuresMap.forEach((entry, m) => {
      const measureStartBeat = timeline.measureStartBeats.get(m) ?? (m - 1) * beatsPerMeasure;
      if (entry.treble.length === 0) {
        list.push({ clef: 'treble', beatOffset: measureStartBeat, duration: beatsPerMeasure, measure: m });
      }
      if (entry.bass.length === 0) {
        list.push({ clef: 'bass', beatOffset: measureStartBeat, duration: beatsPerMeasure, measure: m });
      }
    });

    return list;
  }, [notes, timeline, beatsPerMeasure]);

  return { numerator, denominator, beatsPerMeasure, timeline, restsList };
}
