import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { soundEngine } from '../../core/soundEngine';
import { getNoteInfo } from '../../core/musicTheory';
import { octaveConfigStore, useOctaveStandard, type OctaveStandard } from '../../core/octaveConfigStore';
import { TimbreSelector } from '../audio/TimbreSelector';
import { metronomeEngine, useMetronome } from '../../core/metronomeEngine';
import { UniversalInputBar } from '../audio/UniversalInputBar';
import {
  insertMidiNote,
  calculateMeasureForBeat,
  calculateTotalMeasures,
} from '../../core/scoreMidiWriter';
import {
  Play, Pause, Square, Plus, Trash2,
  ChevronLeft, ChevronRight, Save, FileMusic,
  Undo2, Redo2, SkipBack, Radio, FolderOpen, FilePlus2, Copy,
} from 'lucide-react';
import { FormalScoreSheet } from './editor/FormalScoreSheet';
import { StudioFolderBar } from '../common/StudioFolderBar';
import { StudioProjectModal } from '../common/StudioProjectModal';
import { StudioImportExportBar } from '../common/StudioImportExportBar';
import { useStudioStorage } from '../../core/studio/useStudioStorage';
import type { StudioProjectEnvelope } from '../../core/studio/studioStorageTypes';
import type { ExportFormat } from '../../core/studio/studioImportExportService';

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
// Constantes Musicais Dinâmicas (Aderentes ao padrão C3 Brasil ou C4 Internacional)
// ────────────────────────────────────────────────────────────────────────────

function getTrebleNotes(standard: OctaveStandard): { midi: number; name: string; label: string }[] {
  const TREBLE_MIDIS = [
    93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78,
    77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60
  ];
  return TREBLE_MIDIS.map(midi => {
    const info = getNoteInfo(midi, false, standard);
    let label = info.namePt || info.fullName;
    if (midi === 60) label = `Dó${info.octave} (Central)`;
    else if (midi === 69) label = `Lá${info.octave} (A440)`;
    return { midi, name: info.fullName, label };
  });
}

function getBassNotes(standard: OctaveStandard): { midi: number; name: string; label: string }[] {
  const BASS_MIDIS = [
    60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45,
    44, 43, 42, 41, 40, 39, 38, 37, 36
  ];
  return BASS_MIDIS.map(midi => {
    const info = getNoteInfo(midi, false, standard);
    let label = info.namePt || info.fullName;
    if (midi === 60) label = `Dó${info.octave} (Central)`;
    else if (midi === 48) label = `Dó${info.octave} (Grave)`;
    else if (midi === 36) label = `Dó${info.octave} (Muito Grave)`;
    return { midi, name: info.fullName, label };
  });
}

const DURATION_OPTIONS: { value: NoteDuration; label: string; symbol: string; beats: number }[] = [
  { value: 4,    label: 'Semibreve',  symbol: '𝅝',  beats: 4 },
  { value: 2,    label: 'Mínima',     symbol: '𝅗𝅥',  beats: 2 },
  { value: 1,    label: 'Semínima',   symbol: '♩',  beats: 1 },
  { value: 0.5,  label: 'Colcheia',   symbol: '♪',  beats: 0.5 },
  { value: 0.25, label: 'Semicolcheia', symbol: '𝅘𝅥𝅯', beats: 0.25 },
];

function getQuickTriads(standard: OctaveStandard): { name: string; label: string; notes: { midi: number; name: string }[] }[] {
  const BASE_TRIADS = [
    { name: 'C', label: 'Dó Maior', midis: [60, 64, 67] },
    { name: 'Dm', label: 'Ré Menor', midis: [62, 65, 69] },
    { name: 'Em', label: 'Mi Menor', midis: [64, 67, 71] },
    { name: 'F', label: 'Fá Maior', midis: [65, 69, 72] },
    { name: 'G', label: 'Sol Maior', midis: [67, 71, 74] },
    { name: 'Am', label: 'Lá Menor', midis: [69, 72, 76] },
    { name: 'Bdim', label: 'Si Dim', midis: [71, 74, 77] },
    { name: 'G7', label: 'Sol 7ª', midis: [67, 71, 74, 77] },
  ];
  return BASE_TRIADS.map(t => ({
    name: t.name,
    label: t.label,
    notes: t.midis.map(m => ({ midi: m, name: getNoteInfo(m, false, standard).fullName })),
  }));
}

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

  const octaveStandard = useOctaveStandard();

  const allNoteRows = useMemo(() => {
    const seen = new Set<number>();
    const list: { midi: number; name: string; label: string }[] = [];
    [...getTrebleNotes(octaveStandard), ...getBassNotes(octaveStandard)].forEach(n => {
      if (!seen.has(n.midi)) {
        seen.add(n.midi);
        list.push(n);
      }
    });
    return list;
  }, [octaveStandard]);
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
                        title={`${getNoteInfo(note.midi, false, octaveStandard).fullName} — ${note.duration} beat(s) | Duplo clique para remover`}
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
  const [cursorBeat, setCursorBeat] = useState<number>(0);
  const [history, setHistory] = useState<EditorNote[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [viewLayout, setViewLayout] = useState<'both' | 'score' | 'grid'>('both');
  const [isChordMode, setIsChordMode] = useState<boolean>(false);
  const metronome = useMetronome();

  const studioStorage = useStudioStorage();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [storageFeedback, setStorageFeedback] = useState<string | null>(null);

  const playbackRef = useRef<{ raf: number; startTime: number; startBeat: number } | null>(null);
  const projectRef = useRef(project);
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  const handleToggleMetronome = useCallback(async () => {
    await soundEngine.ensureAudioReady();
    metronomeEngine.toggle({
      bpm: project.bpm,
      timeSignature: `${project.timeSignature[0]}/${project.timeSignature[1]}` as any,
    });
  }, [project.bpm, project.timeSignature]);

  const handleBpmChange = useCallback((newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    setProject(p => ({ ...p, bpm: clamped }));
    metronomeEngine.setBpm(clamped);
  }, []);

  const handleTimeSignatureChange = useCallback((sig: [number, number]) => {
    setProject(p => ({ ...p, timeSignature: sig }));
    metronomeEngine.setTimeSignature(`${sig[0]}/${sig[1]}` as any);
  }, []);

  useEffect(() => {
    return () => {
      if (metronomeEngine.getSnapshot().isPlaying) {
        metronomeEngine.stop();
      }
    };
  }, []);

  const beatsPerMeasure = project.timeSignature[0];

  const activeMeasureIndex = useMemo(() => {
    return calculateMeasureForBeat(cursorBeat, beatsPerMeasure);
  }, [cursorBeat, beatsPerMeasure]);

  const activeMeasureNumber = activeMeasureIndex + 1;

  const totalMeasures = useMemo(() => {
    return calculateTotalMeasures(project.notes, cursorBeat, beatsPerMeasure, 4);
  }, [project.notes, cursorBeat, beatsPerMeasure]);

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

  // ── Inserção de Notas via MIDI USB / Microfone / Teclado Real ───────────

  const handleInputNote = useCallback((midi: number, noteName: string) => {
    const current = projectRef.current;
    const result = insertMidiNote({
      midi,
      noteName,
      currentNotes: current.notes,
      cursorBeat,
      selectedDuration,
      selectedClef,
      beatsPerMeasure,
      isChordMode,
      isPlaying,
      playheadBeat,
      generateId: newNoteId,
    });

    setProject(p => ({
      ...p,
      notes: result.updatedNotes,
      updatedAt: new Date().toISOString(),
    }));
    pushHistory(result.updatedNotes);
    setCursorBeat(result.nextCursorBeat);

    soundEngine.ensureAudioReady().then(() => {
      const durSec = selectedDuration * beatDurationSec(current.bpm) * 0.85;
      soundEngine.playPianoNote(midi, durSec);
    });
  }, [cursorBeat, selectedDuration, selectedClef, beatsPerMeasure, isChordMode, isPlaying, playheadBeat, pushHistory]);

  // Adição de nota a partir da paleta gráfica (aproveita o mesmo fluxo unificado de inserção)
  const addNote = useCallback((midi: number, noteName: string) => {
    handleInputNote(midi, noteName);
  }, [handleInputNote]);

  // ── Inserção Direta na Pauta por Clique ──────────────────────────────────

  const insertNoteAt = useCallback((newNoteData: {
    midi: number;
    noteName: string;
    clef: NoteClef;
    duration: NoteDuration;
    beat: number;
    measure: number;
  }) => {
    const current = projectRef.current;
    const existingIndex = current.notes.findIndex(
      n => Math.abs(n.beat - newNoteData.beat) < 0.05 && n.midi === newNoteData.midi
    );

    let newNotes: EditorNote[];
    if (existingIndex >= 0) {
      newNotes = current.notes.filter((_, idx) => idx !== existingIndex);
    } else {
      const newNote: EditorNote = {
        id: newNoteId(),
        ...newNoteData,
      };
      newNotes = [...current.notes, newNote];
    }

    setProject(p => ({ ...p, notes: newNotes, updatedAt: new Date().toISOString() }));
    pushHistory(newNotes);
    setCursorBeat(newNoteData.beat + newNoteData.duration);

    const notesAtBeat = newNotes.filter(n => Math.abs(n.beat - newNoteData.beat) < 0.05);
    const midisAtBeat = notesAtBeat.map(n => n.midi);

    soundEngine.ensureAudioReady().then(() => {
      const durSec = newNoteData.duration * beatDurationSec(current.bpm) * 0.85;
      if (midisAtBeat.length > 1) {
        soundEngine.playChord(midisAtBeat, 'piano', durSec);
      } else {
        soundEngine.playPianoNote(newNoteData.midi, durSec);
      }
    });
  }, [pushHistory]);

  // ── Inserção Rápida de Tríades / Acordes Pré-configurados ─────────────────

  const insertTriadChord = useCallback((chordNotes: { midi: number; name: string }[]) => {
    const current = projectRef.current;
    const bpm = current.notes;
    let targetBeat = 0;
    if (bpm.length > 0) {
      const lastNote = [...bpm].sort((a, b) => (b.beat + b.duration) - (a.beat + a.duration))[0];
      targetBeat = lastNote.beat + lastNote.duration;
    }
    const measure = Math.floor(targetBeat / beatsPerMeasure);

    const addedNotes: EditorNote[] = chordNotes.map(cn => ({
      id: newNoteId(),
      midi: cn.midi,
      noteName: cn.name,
      clef: cn.midi >= 60 ? 'treble' : 'bass',
      duration: selectedDuration,
      beat: targetBeat,
      measure,
    }));

    const newNotes = [...current.notes, ...addedNotes];
    setProject(p => ({ ...p, notes: newNotes, updatedAt: new Date().toISOString() }));
    pushHistory(newNotes);

    soundEngine.ensureAudioReady().then(() => {
      soundEngine.playChord(
        chordNotes.map(cn => cn.midi),
        'piano',
        selectedDuration * beatDurationSec(current.bpm) * 0.95
      );
    });
  }, [selectedDuration, beatsPerMeasure, pushHistory]);

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

  // ── Salvar / Exportar Soberano ───────────────────────────────────────────

  const handleSaveToSovereignFolder = useCallback(async () => {
    if (!studioStorage.folderInfo?.isAvailable) {
      setIsProjectModalOpen(true);
      return;
    }

    try {
      const current = projectRef.current;
      if (currentProjectId) {
        await studioStorage.saveProject({
          id: currentProjectId,
          module: 'score',
          title: current.title,
          data: current,
          metadata: {
            bpm: current.bpm,
            timeSignature: current.timeSignature,
            notesCount: current.notes.length,
          },
        });
        setIsSaved(true);
        setStorageFeedback('Partitura salva com sucesso na pasta local!');
        setTimeout(() => setStorageFeedback(null), 3000);
      } else {
        const res = await studioStorage.createProject({
          module: 'score',
          title: current.title || 'Minha Partitura',
          data: current,
          metadata: {
            bpm: current.bpm,
            timeSignature: current.timeSignature,
            notesCount: current.notes.length,
          },
        });
        setCurrentProjectId(res.item.id);
        setIsSaved(true);
        setStorageFeedback(`Projeto criado: ${res.item.relativePath}`);
        setTimeout(() => setStorageFeedback(null), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStorageFeedback(`Erro ao salvar: ${msg}`);
      setTimeout(() => setStorageFeedback(null), 4000);
    }
  }, [studioStorage, currentProjectId]);

  const handleOpenProject = useCallback((_path: string, envelope: StudioProjectEnvelope<any>) => {
    const data = envelope.data;
    if (data && Array.isArray(data.notes)) {
      setProject({
        title: envelope.title || data.title,
        bpm: data.bpm || 120,
        timeSignature: data.timeSignature || [4, 4],
        notes: data.notes || [],
        createdAt: envelope.createdAt || new Date().toISOString(),
        updatedAt: envelope.updatedAt || new Date().toISOString(),
      });
      setCurrentProjectId(envelope.id);
      pushHistory(data.notes || []);
      setIsSaved(true);
      setStorageFeedback(`Partitura "${envelope.title}" carregada.`);
      setTimeout(() => setStorageFeedback(null), 3000);
    }
  }, [pushHistory]);

  const handleCreateNewProject = useCallback(async (title: string) => {
    const blank = buildDefaultProject();
    blank.title = title;
    try {
      if (studioStorage.folderInfo?.isAvailable) {
        const res = await studioStorage.createProject({
          module: 'score',
          title,
          data: blank,
          metadata: {
            bpm: blank.bpm,
            timeSignature: blank.timeSignature,
            notesCount: 0,
          },
        });
        setCurrentProjectId(res.item.id);
      } else {
        setCurrentProjectId(null);
      }
      setProject(blank);
      pushHistory([]);
      setIsSaved(true);
      setStorageFeedback(`Nova partitura criada: ${title}`);
      setTimeout(() => setStorageFeedback(null), 3000);
    } catch (err) {
      console.warn('Falha ao criar projeto na pasta:', err);
      setProject(blank);
      pushHistory([]);
    }
  }, [studioStorage, pushHistory]);

  const handleSaveCurrentAs = useCallback(async (newTitle: string) => {
    if (!studioStorage.folderInfo?.isAvailable) {
      setIsProjectModalOpen(true);
      return;
    }
    const current = { ...projectRef.current, title: newTitle };
    try {
      const res = await studioStorage.saveProjectAs({
        originalId: currentProjectId || 'temp',
        module: 'score',
        newTitle,
        data: current,
        metadata: {
          bpm: current.bpm,
          timeSignature: current.timeSignature,
          notesCount: current.notes.length,
        },
      });
      setCurrentProjectId(res.item.id);
      setProject(current);
      setIsSaved(true);
      setStorageFeedback(`Cópia salva como "${newTitle}"`);
      setTimeout(() => setStorageFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStorageFeedback(`Erro ao salvar como: ${msg}`);
      setTimeout(() => setStorageFeedback(null), 4000);
    }
  }, [studioStorage, currentProjectId]);

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
    // Mantido para atalhos de teclado legados se necessário; o StudioImportExportBar é o caminho preferido.
    const json = JSON.stringify(projectRef.current, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectRef.current.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ── Envelope atual do projeto para o StudioImportExportBar ──────────────────

  const currentEnvelope = useMemo((): StudioProjectEnvelope<ScoreProject> => ({
    id: currentProjectId ?? `local_${Date.now()}`,
    title: project.title,
    module: 'score',
    category: 'Partitura',
    version: '1.0.0',
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    metadata: {
      bpm: project.bpm,
      timeSignature: project.timeSignature,
      notesCount: project.notes.length,
    },
    data: project,
  }), [currentProjectId, project]);

  /** Reconstrói o projeto no editor a partir de um envelope importado. */
  const handleImport = useCallback((envelope: StudioProjectEnvelope<unknown>, _format: ExportFormat) => {
    const data = envelope.data as Partial<ScoreProject>;
    const rebuilt: ScoreProject = {
      title: envelope.title || data.title || 'Projeto Importado',
      bpm: data.bpm ?? 120,
      timeSignature: data.timeSignature ?? [4, 4],
      notes: Array.isArray(data.notes) ? data.notes : [],
      createdAt: envelope.createdAt,
      updatedAt: new Date().toISOString(),
    };
    setProject(rebuilt);
    setCurrentProjectId(envelope.id);
    pushHistory(rebuilt.notes);
    setIsSaved(false);
  }, [pushHistory]);

  // Atalhos de teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveToSovereignFolder(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedNoteId) { e.preventDefault(); deleteSelectedNote(); } }
      if (e.key === ' ') { e.preventDefault(); togglePlayback(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, handleSaveToSovereignFolder, selectedNoteId, deleteSelectedNote, togglePlayback]);

  const octaveStandard = useOctaveStandard();
  const trebleNotes = useMemo(() => getTrebleNotes(octaveStandard), [octaveStandard]);
  const bassNotes = useMemo(() => getBassNotes(octaveStandard), [octaveStandard]);
  const quickTriads = useMemo(() => getQuickTriads(octaveStandard), [octaveStandard]);
  const noteRows = selectedClef === 'treble' ? trebleNotes : bassNotes;

  return (
    <div className="w-full space-y-4" onClick={() => setSelectedNoteId(null)}>
      {/* ── 1. Barra Soberana da Pasta do Usuário ── */}
      <StudioFolderBar onOpenCatalog={() => setIsProjectModalOpen(true)} />

      {/* Toast de Feedback */}
      {storageFeedback && (
        <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{storageFeedback}</span>
        </div>
      )}

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
            onClick={() => handleBpmChange(project.bpm - 5)}
            className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min={40} max={240}
            value={project.bpm}
            onChange={e => handleBpmChange(Number(e.target.value))}
            className="w-12 text-center text-sm font-black font-mono text-white bg-transparent outline-none"
          />
          <button
            onClick={() => handleBpmChange(project.bpm + 5)}
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
              onClick={() => handleTimeSignatureChange([n, d])}
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

        {/* Metrônomo Sonoro */}
        <button
          onClick={handleToggleMetronome}
          title={metronome.isPlaying ? 'Metrônomo ativo com som (Clique para desligar)' : 'Metrônomo desligado (Clique para ativar)'}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            metronome.isPlaying
              ? 'bg-amber-500/25 border-amber-500/60 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${metronome.isPlaying ? 'animate-pulse text-amber-400' : ''}`} />
          <span>Metrônomo: {metronome.isPlaying ? 'ON' : 'OFF'}</span>
          {metronome.isPlaying && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

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

        {/* Ações Soberanas do Estúdio */}
        <button
          onClick={() => handleCreateNewProject('Nova Partitura')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Criar Nova Partitura"
        >
          <FilePlus2 className="w-3.5 h-3.5 text-violet-400" />
          Novo
        </button>

        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600/30 border border-violet-500/40 text-violet-200 hover:bg-violet-600/50 transition-all cursor-pointer shadow-md shadow-violet-600/20"
          title="Abrir Catálogo de Partituras na Pasta Soberana"
        >
          <FolderOpen className="w-3.5 h-3.5 text-violet-300" />
          Catálogo
        </button>

        <button
          onClick={handleSaveToSovereignFolder}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isSaved
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-emerald-500/30 border-emerald-400 text-emerald-200 animate-pulse hover:bg-emerald-500/40'
          }`}
          title="Salvar na Pasta Soberana do Usuário (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaved ? 'Salvo no Disco' : 'Salvar'}
        </button>

        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Salvar Cópia do Projeto"
        >
          <Copy className="w-3.5 h-3.5 text-amber-400" />
          Salvar Como
        </button>

        {/* Importar / Exportar — componente reutilizável do Estúdio */}
        <StudioImportExportBar
          module="score"
          projectTitle={project.title}
          envelope={currentEnvelope}
          existingManifestItems={studioStorage.manifest?.modules.scores ?? []}
          onImport={handleImport}
        />
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

        {/* Modo de Inserção: Nota Única vs Modo Acorde */}
        <div className="flex items-center gap-1 bg-[#0a091e] rounded-xl p-1 border border-white/8 text-xs">
          <button
            onClick={() => setIsChordMode(false)}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              !isChordMode
                ? 'bg-violet-500/25 border border-violet-500/50 text-violet-200'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Cada nota é inserida no tempo seguinte"
          >
            🎵 Nota
          </button>
          <button
            onClick={() => setIsChordMode(true)}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              isChordMode
                ? 'bg-amber-500/25 border border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Notas inseridas empilham no mesmo tempo formando acordes"
          >
            🎹 Acorde
          </button>
        </div>

        {/* Tríades Rápidas */}
        <div className="hidden md:flex items-center gap-1 bg-[#0a091e] rounded-xl p-1 border border-white/8 text-xs">
          <span className="text-[10px] text-slate-400 font-bold px-1.5 font-mono">Tríades:</span>
          {quickTriads.map(triad => (
            <button
              key={triad.name}
              onClick={() => insertTriadChord(triad.notes)}
              title={`Inserir tríade ${triad.label} (${triad.notes.map(n => n.name).join(' - ')})`}
              className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 hover:border-amber-500/40 text-amber-200 font-bold font-mono text-[10px] transition-all cursor-pointer"
            >
              {triad.name}
            </button>
          ))}
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
              <span
                onClick={octaveConfigStore.toggleStandard}
                title="Clique para alternar entre os padrões C3 (Brasil) e C4 (Internacional)"
                className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 px-2 py-0.5 rounded-full border border-indigo-500/30 transition-all cursor-pointer"
              >
                Dó Central = {octaveStandard === 'C4' ? 'C4' : 'C3'} (MIDI 60)
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

      {/* ── Seletor de Entrada Universal: MIDI USB & Microfone (Teclado Real) ── */}
      <UniversalInputBar
        onNoteDetected={handleInputNote}
        onNoteHold={(midi) => {
          if (midi !== null) {
            soundEngine.ensureAudioReady().then(() => {
              soundEngine.playPianoNote(midi, 0.4);
            });
          }
        }}
        customLabel="Gravação / Escrita na Partitura"
        activeMeasureNumber={activeMeasureNumber}
        totalMeasures={totalMeasures}
        onSelectMeasure={(measureIdx) => setCursorBeat(measureIdx * beatsPerMeasure)}
        showMeasureControls={true}
      />

      {/* ── Desenho Formal da Partitura em Tempo Real ── */}
      {(viewLayout === 'both' || viewLayout === 'score') && (
        <FormalScoreSheet
          notes={project.notes}
          timeSignature={project.timeSignature}
          playheadBeat={playheadBeat}
          selectedNoteId={selectedNoteId}
          onSelectNote={(id) => {
            setSelectedNoteId(id);
            if (id) {
              const found = project.notes.find(n => n.id === id);
              if (found) setCursorBeat(found.beat);
            }
          }}
          onInsertNote={insertNoteAt}
          onDeleteNote={deleteNote}
          beatsPerMeasure={beatsPerMeasure}
          totalMeasures={totalMeasures}
          selectedDuration={selectedDuration}
          isChordMode={isChordMode}
          activeMeasure={activeMeasureIndex}
          cursorBeat={cursorBeat}
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-slate-500">
        {[
          ['Clique na Pauta', 'Inserir Nota / Acorde'],
          ['Space', 'Play / Pause'],
          ['Ctrl+Z / Y', 'Desfazer / Refazer'],
          ['Delete', 'Remover nota'],
          ['Ctrl+S', 'Salvar projeto'],
        ].map(([key, desc]) => (
          <div key={key} className="flex items-center gap-2 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5">
            <kbd className="bg-white/10 text-[9px] px-1.5 py-0.5 rounded font-mono text-slate-300 whitespace-nowrap">{key}</kbd>
            <span>{desc}</span>
          </div>
        ))}
      </div>

      {/* ── Modal Soberano de Projetos ── */}
      <StudioProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        activeModule="score"
        currentProjectId={currentProjectId}
        onOpenProject={handleOpenProject}
        onCreateNewProject={handleCreateNewProject}
        onSaveCurrentAs={handleSaveCurrentAs}
      />
    </div>
  );
};
