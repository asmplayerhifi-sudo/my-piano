import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { soundEngine } from '../../core/soundEngine';
import { TimbreSelector } from '../audio/TimbreSelector';
import {
  Play, Pause, Square, Plus, Trash2, Download,
  Music, ChevronLeft, ChevronRight, Save, FileMusic,
  Undo2, Redo2, SkipBack,
} from 'lucide-react';
import { FormalScoreSheet } from './editor/FormalScoreSheet';

// ────────────────────────────────────────────────────────────────────────────
// Tipos do Editor
// ────────────────────────────────────────────────────────────────────────────

type NoteDuration = 4 | 2 | 1 | 0.5 | 0.25;
type NoteClef = 'treble' | 'bass';

interface EditorNote {
  id: string;
  midi: number;
  noteName: string;  // ex: 'C4'
  clef: NoteClef;
  duration: NoteDuration;
  beat: number;      // posição em beats desde o início (0-based)
  measure: number;   // compasso (0-based)
}

interface ScoreProject {
  title: string;
  bpm: number;
  timeSignature: [number, number]; // [numerator, denominator]
  notes: EditorNote[];
  createdAt: string;
  updatedAt: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Constantes Musicais
// ────────────────────────────────────────────────────────────────────────────

const TREBLE_NOTES: { midi: number; name: string; label: string }[] = [
  { midi: 93, name: 'A5', label: 'Lá5' },
  { midi: 92, name: 'G#5', label: 'Sol♯5' },
  { midi: 91, name: 'G5', label: 'Sol5' },
  { midi: 90, name: 'F#5', label: 'Fá♯5' },
  { midi: 89, name: 'F5', label: 'Fá5' },
  { midi: 88, name: 'E5', label: 'Mi5' },
  { midi: 87, name: 'D#5', label: 'Ré♯5' },
  { midi: 86, name: 'D5', label: 'Ré5' },
  { midi: 85, name: 'C#5', label: 'Dó♯5' },
  { midi: 84, name: 'C5', label: 'Dó5' },
  { midi: 83, name: 'B4', label: 'Si4' },
  { midi: 82, name: 'A#4', label: 'Lá♯4' },
  { midi: 81, name: 'A4', label: 'Lá4' },
  { midi: 80, name: 'G#4', label: 'Sol♯4' },
  { midi: 79, name: 'G4', label: 'Sol4' },
  { midi: 78, name: 'F#4', label: 'Fá♯4' },
  { midi: 77, name: 'F4', label: 'Fá4' },
  { midi: 76, name: 'E4', label: 'Mi4' },
  { midi: 75, name: 'D#4', label: 'Ré♯4' },
  { midi: 74, name: 'D4', label: 'Ré4' },
  { midi: 73, name: 'C#4', label: 'Dó♯4' },
  { midi: 72, name: 'C4', label: 'Dó4' },
  { midi: 71, name: 'B3', label: 'Si3' },
  { midi: 70, name: 'A#3', label: 'Lá♯3' },
  { midi: 69, name: 'A3', label: 'Lá3 (A440)' },
  { midi: 68, name: 'G#3', label: 'Sol♯3' },
  { midi: 67, name: 'G3', label: 'Sol3' },
  { midi: 66, name: 'F#3', label: 'Fá♯3' },
  { midi: 65, name: 'F3', label: 'Fá3' },
  { midi: 64, name: 'E3', label: 'Mi3' },
  { midi: 63, name: 'D#3', label: 'Ré♯3' },
  { midi: 62, name: 'D3', label: 'Ré3' },
  { midi: 61, name: 'C#3', label: 'Dó♯3' },
  { midi: 60, name: 'C3', label: 'Dó3 (Central)' },
];

const BASS_NOTES: { midi: number; name: string; label: string }[] = [
  { midi: 60, name: 'C3', label: 'Dó3 (Central)' },
  { midi: 59, name: 'B2', label: 'Si2' },
  { midi: 58, name: 'A#2', label: 'Lá♯2' },
  { midi: 57, name: 'A2', label: 'Lá2' },
  { midi: 56, name: 'G#2', label: 'Sol♯2' },
  { midi: 55, name: 'G2', label: 'Sol2' },
  { midi: 54, name: 'F#2', label: 'Fá♯2' },
  { midi: 53, name: 'F2', label: 'Fá2' },
  { midi: 52, name: 'E2', label: 'Mi2' },
  { midi: 51, name: 'D#2', label: 'Ré♯2' },
  { midi: 50, name: 'D2', label: 'Ré2' },
  { midi: 49, name: 'C#2', label: 'Dó♯2' },
  { midi: 48, name: 'C2', label: 'Dó2 (Grave)' },
  { midi: 47, name: 'B1', label: 'Si1' },
  { midi: 46, name: 'A#1', label: 'Lá♯1' },
  { midi: 45, name: 'A1', label: 'Lá1' },
  { midi: 44, name: 'G#1', label: 'Sol♯1' },
  { midi: 43, name: 'G1', label: 'Sol1' },
  { midi: 42, name: 'F#1', label: 'Fá♯1' },
  { midi: 41, name: 'F1', label: 'Fá1' },
  { midi: 40, name: 'E1', label: 'Mi1' },
  { midi: 39, name: 'D#1', label: 'Ré♯1' },
  { midi: 38, name: 'D1', label: 'Ré1' },
  { midi: 37, name: 'C#1', label: 'Dó♯1' },
  { midi: 36, name: 'C1', label: 'Dó1 (Muito Grave)' },
];

const DURATION_OPTIONS: { value: NoteDuration; label: string; symbol: string; beats: number }[] = [
  { value: 4,    label: 'Semibreve',  symbol: '𝅝',  beats: 4 },
  { value: 2,    label: 'Mínima',     symbol: '𝅗𝅥',  beats: 2 },
  { value: 1,    label: 'Semínima',   symbol: '♩',  beats: 1 },
  { value: 0.5,  label: 'Colcheia',   symbol: '♪',  beats: 0.5 },
  { value: 0.25, label: 'Semicolcheia', symbol: '𝅘𝅥𝅯', beats: 0.25 },
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

let noteIdCounter = 0;
const newNoteId = () => `note-${Date.now()}-${++noteIdCounter}`;

const isBlackKey = (midi: number) => [1, 3, 6, 8, 10].includes(midi % 12);

function buildDefaultProject(): ScoreProject {
  return {
    title: 'Nova Partitura',
    bpm: 90,
    timeSignature: [4, 4],
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Calcula a duração de um beat em segundos */
function beatDurationSec(bpm: number) {
  return 60 / bpm;
}

/** Gera bytes de arquivo MIDI 0 */
function projectToMidi(project: ScoreProject): Uint8Array {
  const bpm = project.bpm;
  const microsecsPerBeat = Math.round(60_000_000 / bpm);
  const ticksPerBeat = 480;

  const bytes: number[] = [];

  const writeVarLen = (val: number) => {
    const buf: number[] = [];
    buf.unshift(val & 0x7f);
    val >>= 7;
    while (val > 0) {
      buf.unshift((val & 0x7f) | 0x80);
      val >>= 7;
    }
    buf.forEach(b => bytes.push(b));
  };

  const writeU16BE = (v: number) => { bytes.push((v >> 8) & 0xff, v & 0xff); };
  const writeU32BE = (v: number) => {
    bytes.push((v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff);
  };

  // ── MIDI Header Chunk ──
  bytes.push(0x4D, 0x54, 0x68, 0x64); // "MThd"
  writeU32BE(6);
  writeU16BE(0);           // Format 0
  writeU16BE(1);           // 1 track
  writeU16BE(ticksPerBeat);

  // ── Track Chunk (collect events first) ──
  const trackEvents: Array<{ tick: number; data: number[] }> = [];

  // Tempo
  trackEvents.push({
    tick: 0,
    data: [0xff, 0x51, 0x03,
      (microsecsPerBeat >> 16) & 0xff,
      (microsecsPerBeat >> 8) & 0xff,
      microsecsPerBeat & 0xff,
    ],
  });

  // Time Signature
  const [num, den] = project.timeSignature;
  const denPow = Math.log2(den);
  trackEvents.push({
    tick: 0,
    data: [0xff, 0x58, 0x04, num, denPow, 24, 8],
  });

  // Notes — sorted by beat
  const sorted = [...project.notes].sort((a, b) => a.beat - b.beat);

  for (const note of sorted) {
    const startTick = Math.round(note.beat * ticksPerBeat);
    const durTicks = Math.round(note.duration * ticksPerBeat);
    const vel = 90;

    trackEvents.push({ tick: startTick, data: [0x90, note.midi, vel] });
    trackEvents.push({ tick: startTick + durTicks, data: [0x80, note.midi, 0] });
  }

  // Sort all events by tick
  trackEvents.sort((a, b) => a.tick - b.tick);

  // Build delta-timed track bytes
  const trackBytes: number[] = [];
  let currentTick = 0;

  const writeVarLenTo = (val: number, arr: number[]) => {
    const buf: number[] = [];
    buf.unshift(val & 0x7f);
    val >>= 7;
    while (val > 0) {
      buf.unshift((val & 0x7f) | 0x80);
      val >>= 7;
    }
    buf.forEach(b => arr.push(b));
  };

  for (const ev of trackEvents) {
    const delta = ev.tick - currentTick;
    currentTick = ev.tick;
    writeVarLenTo(delta, trackBytes);
    ev.data.forEach(b => trackBytes.push(b));
  }

  // End of track
  writeVarLenTo(0, trackBytes);
  trackBytes.push(0xff, 0x2f, 0x00);

  // Track header
  bytes.push(0x4D, 0x54, 0x72, 0x6B); // "MTrk"
  writeU32BE(trackBytes.length);
  trackBytes.forEach(b => bytes.push(b));

  void writeVarLen; // suppress unused warning

  return new Uint8Array(bytes);
}

// ────────────────────────────────────────────────────────────────────────────
// Componente: Pauta de Notas (Piano Roll estilo lista)
// ────────────────────────────────────────────────────────────────────────────

interface NoteGridProps {
  notes: EditorNote[];
  beatsPerMeasure: number;
  playheadBeat: number | null;
  selectedNoteId: string | null;
  onSelectNote: (id: string | null) => void;
  onDeleteNote: (id: string) => void;
  totalMeasures: number;
}

const NOTE_ROW_HEIGHT = 22;
const BEAT_WIDTH = 72;
const LABEL_WIDTH = 120;

const NoteGrid: React.FC<NoteGridProps> = ({
  notes, beatsPerMeasure, playheadBeat, selectedNoteId,
  onSelectNote, onDeleteNote, totalMeasures,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll automático ao playhead
  useEffect(() => {
    if (playheadBeat !== null && containerRef.current) {
      const x = LABEL_WIDTH + playheadBeat * BEAT_WIDTH - 80;
      containerRef.current.scrollLeft = Math.max(0, x);
    }
  }, [playheadBeat]);

  const allNoteRows = useMemo(() => {
    const seen = new Set<number>();
    const list: { midi: number; name: string; label: string }[] = [];
    [...TREBLE_NOTES, ...BASS_NOTES].forEach(n => {
      if (!seen.has(n.midi)) {
        seen.add(n.midi);
        list.push(n);
      }
    });
    return list;
  }, []);
  const totalBeats = totalMeasures * beatsPerMeasure;

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto rounded-2xl border border-white/10 bg-[#09091a]"
      style={{ maxHeight: 480 }}
    >
      <div style={{ minWidth: LABEL_WIDTH + totalBeats * BEAT_WIDTH + 40, position: 'relative' }}>
        {/* Header de Compassos */}
        <div
          className="sticky top-0 z-20 flex bg-[#0d0d22] border-b border-white/10"
          style={{ paddingLeft: LABEL_WIDTH }}
        >
          {Array.from({ length: totalMeasures }, (_, m) => (
            <div
              key={m}
              style={{ width: beatsPerMeasure * BEAT_WIDTH, minWidth: beatsPerMeasure * BEAT_WIDTH }}
              className="border-r border-white/10 px-2 py-1.5 text-[10px] font-bold text-slate-400 font-mono shrink-0"
            >
              ■ {m + 1}
            </div>
          ))}
        </div>

        {/* Linhas de Notas */}
        {allNoteRows.map((row) => {
          const isTreble = row.midi >= 60;
          const rowNotes = notes.filter(n => n.midi === row.midi);
          const isBlack = isBlackKey(row.midi);
          const isSeparator = row.midi === 60; // Dó3 central
          const isClefSep = row.midi === 59; // separação treble/bass

          return (
            <React.Fragment key={row.midi}>
              {isClefSep && (
                <div className="h-px bg-indigo-500/30 mx-0" />
              )}
              <div
                key={row.midi}
                className={`flex items-center border-b transition-colors ${
                  isSeparator
                    ? 'border-white/20 bg-indigo-500/10'
                    : 'border-white/[0.04]'
                } ${isBlack ? 'bg-white/[0.012]' : ''}`}
                style={{ height: NOTE_ROW_HEIGHT }}
              >
                {/* Label da Nota */}
                <div
                  className={`sticky left-0 z-10 flex items-center justify-between px-2 shrink-0 border-r ${
                    isSeparator ? 'border-white/20 bg-[#0f0f26]' : 'border-white/[0.06] bg-[#0a0a1c]'
                  }`}
                  style={{ width: LABEL_WIDTH, height: NOTE_ROW_HEIGHT }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isTreble ? 'bg-violet-400' : 'bg-amber-400'
                      } ${isBlack ? 'opacity-50' : ''}`}
                    />
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isSeparator
                          ? 'text-indigo-300'
                          : isBlack
                          ? 'text-slate-500'
                          : 'text-slate-300'
                      }`}
                    >
                      {row.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 truncate hidden sm:block">
                    {isTreble ? '𝄞' : '𝄢'}
                  </span>
                </div>

                {/* Área de Notas */}
                <div className="relative flex-1" style={{ height: NOTE_ROW_HEIGHT }}>
                  {/* Grid de batidas */}
                  {Array.from({ length: totalBeats }, (_, b) => (
                    <div
                      key={b}
                      className={`absolute inset-y-0 border-r ${
                        b % beatsPerMeasure === 0
                          ? 'border-white/15'
                          : 'border-white/[0.04]'
                      }`}
                      style={{ left: b * BEAT_WIDTH, width: BEAT_WIDTH }}
                    />
                  ))}

                  {/* Notas Colocadas */}
                  {rowNotes.map(note => {
                    const isSelected = note.id === selectedNoteId;
                    const noteWidth = Math.max(note.duration * BEAT_WIDTH - 3, 10);
                    return (
                      <div
                        key={note.id}
                        onClick={(e) => { e.stopPropagation(); onSelectNote(note.id); }}
                        onDoubleClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                        title={`${note.noteName} — ${note.duration} beat(s) | Duplo clique para remover`}
                        className={`absolute top-1 cursor-pointer rounded flex items-center justify-center transition-all
                          ${isSelected
                            ? 'ring-2 ring-white/80 z-10'
                            : 'hover:brightness-110 z-[1]'
                          }
                          ${isTreble
                            ? 'bg-gradient-to-r from-violet-600 to-purple-500'
                            : 'bg-gradient-to-r from-amber-600 to-orange-500'
                          }
                          ${isBlack ? 'opacity-80' : 'opacity-95'}
                        `}
                        style={{
                          left: note.beat * BEAT_WIDTH + 1,
                          width: noteWidth,
                          height: NOTE_ROW_HEIGHT - 8,
                        }}
                      >
                        {noteWidth > 28 && (
                          <span className="text-[8px] font-black text-white/90 leading-none">
                            {row.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Playhead */}
        {playheadBeat !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/90 z-30 pointer-events-none"
            style={{
              left: LABEL_WIDTH + playheadBeat * BEAT_WIDTH,
              boxShadow: '0 0 8px rgba(52,211,153,0.6)',
            }}
          />
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Componente Principal: ScoreEditor
// ────────────────────────────────────────────────────────────────────────────

export const ScoreEditor: React.FC = () => {
  const [project, setProject] = useState<ScoreProject>(buildDefaultProject);
  const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(1);
  const [selectedClef, setSelectedClef] = useState<NoteClef>('treble');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadBeat, setPlayheadBeat] = useState<number | null>(null);
  const [history, setHistory] = useState<EditorNote[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [viewLayout, setViewLayout] = useState<'both' | 'score' | 'grid'>('both');

  const playbackRef = useRef<{ raf: number; startTime: number; startBeat: number } | null>(null);
  const projectRef = useRef(project);
  projectRef.current = project;

  const totalMeasures = useMemo(() => {
    if (project.notes.length === 0) return 4;
    const maxBeat = Math.max(...project.notes.map(n => n.beat + n.duration));
    return Math.max(4, Math.ceil(maxBeat / project.timeSignature[0]) + 1);
  }, [project.notes, project.timeSignature]);

  const beatsPerMeasure = project.timeSignature[0];

  // ── Desfazer / Refazer ───────────────────────────────────────────────────

  const pushHistory = useCallback((notes: EditorNote[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, notes].slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
    setIsSaved(false);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    setProject(p => ({ ...p, notes: history[newIdx] }));
    setIsSaved(false);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    setProject(p => ({ ...p, notes: history[newIdx] }));
    setIsSaved(false);
  }, [history, historyIndex]);

  // ── Adição de Nota ───────────────────────────────────────────────────────

  const addNote = useCallback((midi: number, noteName: string) => {
    const current = projectRef.current;
    const bpm = current.notes;

    // Calcula a próxima posição disponível
    let nextBeat = 0;
    if (bpm.length > 0) {
      const lastNote = [...bpm].sort((a, b) => (b.beat + b.duration) - (a.beat + a.duration))[0];
      nextBeat = lastNote.beat + lastNote.duration;
    }

    const measure = Math.floor(nextBeat / beatsPerMeasure);
    const newNote: EditorNote = {
      id: newNoteId(),
      midi,
      noteName,
      clef: selectedClef,
      duration: selectedDuration,
      beat: nextBeat,
      measure,
    };

    const newNotes = [...current.notes, newNote];
    setProject(p => ({ ...p, notes: newNotes, updatedAt: new Date().toISOString() }));
    pushHistory(newNotes);

    // Preview sonoro da nota
    soundEngine.ensureAudioReady().then(() => {
      soundEngine.playPianoNote(midi, selectedDuration * beatDurationSec(current.bpm) * 0.85);
    });
  }, [selectedClef, selectedDuration, beatsPerMeasure, pushHistory]);

  const deleteNote = useCallback((id: string) => {
    const newNotes = projectRef.current.notes.filter(n => n.id !== id);
    setProject(p => ({ ...p, notes: newNotes, updatedAt: new Date().toISOString() }));
    pushHistory(newNotes);
    setSelectedNoteId(null);
  }, [pushHistory]);

  const deleteSelectedNote = useCallback(() => {
    if (selectedNoteId) deleteNote(selectedNoteId);
  }, [selectedNoteId, deleteNote]);

  // ── Reprodução ───────────────────────────────────────────────────────────

  const stopPlayback = useCallback(() => {
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current.raf);
      playbackRef.current = null;
    }
    setIsPlaying(false);
    setPlayheadBeat(null);
  }, []);

  const startPlayback = useCallback(async () => {
    await soundEngine.ensureAudioReady();
    const current = projectRef.current;
    if (current.notes.length === 0) return;

    const sortedNotes = [...current.notes].sort((a, b) => a.beat - b.beat);
    const bpSec = beatDurationSec(current.bpm);
    const now = performance.now();
    const scheduledSet = new Set<string>();

    setIsPlaying(true);
    const totalDuration = Math.max(...sortedNotes.map(n => n.beat + n.duration));

    const tick = (timestamp: number) => {
      const elapsed = (timestamp - now) / 1000;
      const currentBeat = elapsed / bpSec;

      setPlayheadBeat(currentBeat);

      // Agenda notas que estão prestes a soar (lookahead de 0.2s)
      for (const note of sortedNotes) {
        if (scheduledSet.has(note.id)) continue;
        const noteTimeSec = note.beat * bpSec;
        if (noteTimeSec <= elapsed + 0.2) {
          const audioTime = soundEngine.getCurrentTime() + (noteTimeSec - elapsed);
          soundEngine.playPianoNote(note.midi, note.duration * bpSec * 0.9, Math.max(soundEngine.getCurrentTime(), audioTime));
          scheduledSet.add(note.id);
        }
      }

      if (currentBeat >= totalDuration + 0.5) {
        stopPlayback();
        return;
      }

      playbackRef.current = {
        ...playbackRef.current!,
        raf: requestAnimationFrame(tick),
      };
    };

    playbackRef.current = { raf: requestAnimationFrame(tick), startTime: now, startBeat: 0 };
  }, [stopPlayback]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  // ── Salvar / Exportar ────────────────────────────────────────────────────

  const saveToLocalStorage = useCallback(() => {
    const updated = { ...projectRef.current, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem('harmonia-score-editor', JSON.stringify(updated));
      setIsSaved(true);
      setProject(updated);
    } catch (e) {
      console.warn('Falha ao salvar no localStorage:', e);
    }
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem('harmonia-score-editor');
      if (raw) {
        const parsed = JSON.parse(raw) as ScoreProject;
        setProject(parsed);
        pushHistory(parsed.notes);
        setIsSaved(true);
      }
    } catch (e) {
      console.warn('Falha ao carregar do localStorage:', e);
    }
  }, [pushHistory]);

  const exportMidi = useCallback(() => {
    const midi = projectToMidi(projectRef.current);
    const blob = new Blob([midi.buffer as ArrayBuffer], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectRef.current.title.replace(/\s+/g, '_')}.mid`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportJson = useCallback(() => {
    const json = JSON.stringify(projectRef.current, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectRef.current.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Carrega projeto salvo ao montar
  useEffect(() => {
    loadFromLocalStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveToLocalStorage(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedNoteId) { e.preventDefault(); deleteSelectedNote(); } }
      if (e.key === ' ') { e.preventDefault(); togglePlayback(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, saveToLocalStorage, selectedNoteId, deleteSelectedNote, togglePlayback]);

  const noteRows = selectedClef === 'treble' ? TREBLE_NOTES : BASS_NOTES;

  return (
    <div className="w-full space-y-5" onClick={() => setSelectedNoteId(null)}>
      {/* ── Header ── */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <FileMusic className="w-4 h-4" />
            <span>Editor de Partitura</span>
          </div>
          <input
            className="text-2xl sm:text-3xl font-black font-display text-white bg-transparent outline-none border-b border-transparent hover:border-white/20 focus:border-violet-400 transition-colors w-full max-w-md"
            value={project.title}
            onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
            placeholder="Nome da Partitura"
          />
          <p className="text-xs text-slate-400 mt-1">
            Construa melodias, exporte para MIDI e salve seus arranjos
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <TimbreSelector compact />
        </div>
      </div>

      {/* ── Barra de Transporte + Configurações ── */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center gap-3">
        {/* Controles de Reprodução */}
        <div className="flex items-center gap-1.5 bg-black/30 rounded-xl p-1 border border-white/5">
          <button
            onClick={stopPlayback}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Parar e Voltar ao Início (Space)"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            id="score-editor-play-btn"
            onClick={togglePlayback}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? 'Pausar (Space)' : 'Reproduzir (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={stopPlayback}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Parar"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BPM */}
        <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2 border border-white/5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">BPM</span>
          <button
            onClick={() => setProject(p => ({ ...p, bpm: Math.max(40, p.bpm - 5) }))}
            className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min={40} max={240}
            value={project.bpm}
            onChange={e => setProject(p => ({ ...p, bpm: Math.max(40, Math.min(240, Number(e.target.value))) }))}
            className="w-12 text-center text-sm font-black font-mono text-white bg-transparent outline-none"
          />
          <button
            onClick={() => setProject(p => ({ ...p, bpm: Math.min(240, p.bpm + 5) }))}
            className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compassagem */}
        <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2 border border-white/5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Comp.</span>
          {([
            [2, 4], [3, 4], [4, 4], [6, 8], [5, 4],
          ] as [number, number][]).map(([n, d]) => (
            <button
              key={`${n}/${d}`}
              onClick={() => setProject(p => ({ ...p, timeSignature: [n, d] }))}
              className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                project.timeSignature[0] === n && project.timeSignature[1] === d
                  ? 'bg-violet-500/30 text-violet-300 border border-violet-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {n}/{d}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Ações de Histórico */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Salvar */}
        <button
          onClick={saveToLocalStorage}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isSaved
              ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
          }`}
          title="Salvar (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaved ? 'Salvo' : 'Salvar'}
        </button>

        {/* Exportar */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-[#0e0d24] border border-white/15 rounded-xl overflow-hidden shadow-xl z-50 min-w-[130px]">
            <button
              onClick={exportMidi}
              className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Music className="w-3.5 h-3.5" />
              Exportar MIDI
            </button>
            <button
              onClick={exportJson}
              className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileMusic className="w-3.5 h-3.5" />
              Exportar JSON
            </button>
          </div>
        </div>
      </div>

      {/* ── Paleta de Duração + Clave ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Duração */}
        <div className="flex items-center gap-1 bg-[#0a091e] rounded-xl p-1 border border-white/8">
          {DURATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              id={`duration-btn-${opt.value}`}
              onClick={() => setSelectedDuration(opt.value)}
              title={`${opt.label} (${opt.beats} beat${opt.beats !== 1 ? 's' : ''})`}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all cursor-pointer ${
                selectedDuration === opt.value
                  ? 'bg-violet-500/25 border border-violet-500/50 text-violet-200'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <span className="text-lg leading-none">{opt.symbol}</span>
              <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Clave */}
        <div className="flex items-center gap-1 bg-[#0a091e] rounded-xl p-1 border border-white/8">
          <button
            onClick={() => setSelectedClef('treble')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedClef === 'treble'
                ? 'bg-violet-500/25 border border-violet-500/50 text-violet-200'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            <span className="text-lg leading-none">𝄞</span>
            Clave de Sol
          </button>
          <button
            onClick={() => setSelectedClef('bass')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedClef === 'bass'
                ? 'bg-amber-500/25 border border-amber-500/50 text-amber-200'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            <span className="text-lg leading-none">𝄢</span>
            Clave de Fá
          </button>
        </div>

        {/* Seletor de Modo de Visualização */}
        <div className="flex items-center gap-1 bg-[#0a091e] rounded-xl p-1 border border-white/8 text-xs">
          <button
            onClick={() => setViewLayout('both')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewLayout === 'both'
                ? 'bg-violet-500/25 border border-violet-500/50 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔀 Partitura + Grade
          </button>
          <button
            onClick={() => setViewLayout('score')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewLayout === 'score'
                ? 'bg-violet-500/25 border border-violet-500/50 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎼 Apenas Partitura
          </button>
          <button
            onClick={() => setViewLayout('grid')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewLayout === 'grid'
                ? 'bg-violet-500/25 border border-violet-500/50 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎹 Apenas Grade
          </button>
        </div>

        {/* Notas na Partitura */}
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono">
            {project.notes.length} nota{project.notes.length !== 1 ? 's' : ''}
          </span>
          {selectedNoteId && (
            <button
              onClick={deleteSelectedNote}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors cursor-pointer"
              title="Deletar nota selecionada (Delete)"
            >
              <Trash2 className="w-3 h-3" />
              Remover
            </button>
          )}
        </div>
      </div>

      {/* ── Paleta Superior de Inserção de Notas (Posicionada acima da Partitura) ── */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/10 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>Inserir Nota — {selectedClef === 'treble' ? '𝄞 Clave de Sol' : '𝄢 Clave de Fá'}</span>
              <span className="text-[10px] font-normal text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30">
                Dó Central = C3 (MIDI 60)
              </span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Clique na nota para inserir no compasso ativo
          </span>
        </div>

        <div className="flex flex-wrap gap-1 items-center">
          {noteRows.map(row => {
            const black = isBlackKey(row.midi);
            const isCenter = row.midi === 60;
            const isC2 = row.midi === 48;
            return (
              <button
                key={row.midi}
                id={`insert-note-${row.name}`}
                onClick={e => { e.stopPropagation(); addNote(row.midi, row.name); }}
                title={`Inserir ${row.label} (${row.midi})`}
                className={`flex flex-col items-center justify-center min-w-[34px] px-2 py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer border ${
                  black
                    ? 'bg-slate-800/80 border-slate-600/40 text-slate-300 hover:bg-slate-700 hover:text-white'
                    : isCenter
                    ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/50 hover:bg-indigo-500/35'
                    : isC2
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-100 hover:bg-amber-500/30'
                    : selectedClef === 'treble'
                    ? 'bg-violet-500/15 border-violet-500/30 text-violet-200 hover:bg-violet-500/25 hover:text-white'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-200 hover:bg-amber-500/25 hover:text-white'
                }`}
              >
                <span className="leading-none">{row.name}</span>
                {black ? (
                  <span className="text-[7px] leading-none opacity-60 mt-0.5">♯/♭</span>
                ) : isCenter ? (
                  <span className="text-[6.5px] font-bold text-indigo-200 leading-none mt-0.5 uppercase tracking-tighter">Central</span>
                ) : isC2 ? (
                  <span className="text-[6.5px] font-bold text-amber-200 leading-none mt-0.5 uppercase tracking-tighter">Grave</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desenho Formal da Partitura em Tempo Real ── */}
      {(viewLayout === 'both' || viewLayout === 'score') && (
        <FormalScoreSheet
          notes={project.notes}
          timeSignature={project.timeSignature}
          playheadBeat={playheadBeat}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          beatsPerMeasure={beatsPerMeasure}
          totalMeasures={totalMeasures}
        />
      )}

      {/* ── Piano Roll / Grade de Notas ── */}
      {(viewLayout === 'both' || viewLayout === 'grid') && (
        <NoteGrid
          notes={project.notes}
          beatsPerMeasure={beatsPerMeasure}
          playheadBeat={playheadBeat}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onDeleteNote={deleteNote}
          totalMeasures={totalMeasures}
        />
      )}

      {/* ── Dicas de Uso ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500">
        {[
          ['Space', 'Play / Pause'],
          ['Ctrl+Z / Y', 'Desfazer / Refazer'],
          ['Delete', 'Remover nota selecionada'],
          ['Ctrl+S', 'Salvar projeto'],
        ].map(([key, desc]) => (
          <div key={key} className="flex items-center gap-2 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5">
            <kbd className="bg-white/10 text-[9px] px-1.5 py-0.5 rounded font-mono text-slate-300 whitespace-nowrap">{key}</kbd>
            <span>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
