/**
 * studioImportExportService.ts
 *
 * Serviço Centralizado de Importação e Exportação do Estúdio Harmonia.
 *
 * Responsabilidades:
 *  1. Exportar projetos em JSON (com versionamento de schema) e MIDI (Partitura).
 *  2. Importar e validar arquivos JSON e MIDI, reconstruindo o projeto no CRUD.
 *  3. Detectar conflitos de importação (título/ID já existente no manifesto).
 *  4. Fornecer API reutilizável para todos os módulos do Estúdio.
 *
 * Contratos:
 *  - JSON exportado sempre usa StudioProjectEnvelope com campo `schemaVersion`.
 *  - Importação rejeita arquivos com schemaVersion incompatível.
 *  - Nunca sobrescreve silenciosamente: retorna conflito para o chamador decidir.
 */

import type { StudioModuleName, StudioProjectEnvelope, StudioManifestItem } from './studioStorageTypes';

// ─── Schema Versions ─────────────────────────────────────────────────────────

/** Versão atual do schema de exportação JSON. */
export const EXPORT_SCHEMA_VERSION = '2.0.0';

/** Versões aceitas na importação (compatibilidade retroativa). */
export const SUPPORTED_SCHEMA_VERSIONS = ['1.0.0', '2.0.0'];

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ExportFormat = 'json' | 'midi';

export interface ExportOptions {
  module: StudioModuleName;
  title: string;
  envelope: StudioProjectEnvelope<unknown>;
  format: ExportFormat;
}

export interface ImportResult<T = unknown> {
  success: boolean;
  envelope?: StudioProjectEnvelope<T>;
  format?: ExportFormat;
  error?: string;
  hasConflict?: boolean;
  conflictingItem?: StudioManifestItem;
}

export interface ImportOptions {
  existingItems: StudioManifestItem[];
  expectedModule?: StudioModuleName;
}

export interface MidiNoteEvent {
  midi: number;
  startTick: number;
  durationTicks: number;
}

export interface ParsedMidiFile {
  ticksPerBeat: number;
  bpm: number;
  timeSignatureNumerator: number;
  timeSignatureDenominator: number;
  notes: MidiNoteEvent[];
}

// ─── Exportação ───────────────────────────────────────────────────────────────

/**
 * Exporta um projeto do Estúdio em JSON (schema versionado) ou MIDI.
 * Dispara o download direto no navegador.
 */
export function exportProject(options: ExportOptions): void {
  const { module, title, envelope, format } = options;

  if (format === 'midi') {
    if (module !== 'score') {
      throw new Error('Exportação MIDI é suportada apenas para o módulo Partitura.');
    }
    const midiBytes = buildMidiFromEnvelope(envelope);
    triggerDownload(
      new Blob([midiBytes.buffer as ArrayBuffer], { type: 'audio/midi' }),
      `${slugify(title)}.mid`
    );
    return;
  }

  // JSON com schema versionado
  const exportable = {
    ...envelope,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };

  triggerDownload(
    new Blob([JSON.stringify(exportable, null, 2)], { type: 'application/json' }),
    `${slugify(title)}.harmonia.json`
  );
}

// ─── Importação ───────────────────────────────────────────────────────────────

/**
 * Importa um arquivo JSON ou MIDI escolhido pelo usuário.
 * Valida o formato, a versão do schema e detecta conflitos com projetos existentes.
 */
export async function importProjectFromFile<T = unknown>(
  file: File,
  options: ImportOptions
): Promise<ImportResult<T>> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'mid' || extension === 'midi') {
    return importMidiFile<T>(file);
  }

  if (extension === 'json') {
    return importJsonFile<T>(file, options);
  }

  return {
    success: false,
    error: `Formato de arquivo não suportado: ".${extension}". Use .json ou .mid/.midi.`,
  };
}

// ─── Implementação Interna — JSON ─────────────────────────────────────────────

async function importJsonFile<T>(
  file: File,
  options: ImportOptions
): Promise<ImportResult<T>> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { success: false, error: 'Não foi possível ler o arquivo.' };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { success: false, error: 'O arquivo não é um JSON válido ou está corrompido.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { success: false, error: 'Estrutura de arquivo inválida.' };
  }

  // Schema legado sem schemaVersion → assume '1.0.0'
  const schemaVersion = (parsed['schemaVersion'] as string | undefined) ?? '1.0.0';

  if (!SUPPORTED_SCHEMA_VERSIONS.includes(schemaVersion)) {
    return {
      success: false,
      error: `Schema version "${schemaVersion}" não é suportado. Aceitos: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}.`,
    };
  }

  const module = parsed['module'] as StudioModuleName | undefined;
  if (options.expectedModule && module && module !== options.expectedModule) {
    return {
      success: false,
      error: `O arquivo pertence ao módulo "${module}", mas você está em "${options.expectedModule}".`,
    };
  }

  const id = (parsed['id'] as string | undefined) || generateId(parsed['title'] as string || 'Importado');
  const title = (parsed['title'] as string | undefined) || file.name.replace(/\.[^.]+$/, '');
  const now = new Date().toISOString();

  const envelope: StudioProjectEnvelope<T> = {
    id,
    title,
    module: (module as StudioModuleName) || options.expectedModule || 'score',
    category: (parsed['category'] as string | undefined) || 'Importado',
    version: (parsed['version'] as string | undefined) || '1.0.0',
    createdAt: (parsed['createdAt'] as string | undefined) || now,
    updatedAt: now,
    metadata: (parsed['metadata'] as Record<string, unknown> | undefined) || {},
    data: ('data' in parsed ? parsed['data'] : parsed) as T,
  };

  const conflictingItem = options.existingItems.find((item) => item.id === id);
  if (conflictingItem) {
    return { success: true, envelope, format: 'json', hasConflict: true, conflictingItem };
  }

  return { success: true, envelope, format: 'json', hasConflict: false };
}

// ─── Implementação Interna — MIDI ─────────────────────────────────────────────

async function importMidiFile<T>(file: File): Promise<ImportResult<T>> {
  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    return { success: false, error: 'Não foi possível ler o arquivo MIDI.' };
  }

  let parsed: ParsedMidiFile;
  try {
    parsed = parseMidiFile(new Uint8Array(buffer));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Falha ao interpretar arquivo MIDI: ${msg}` };
  }

  const notes = parsed.notes.map((ev, idx) => ({
    id: `midi-import-${idx}`,
    midi: ev.midi,
    noteName: midiToNoteName(ev.midi),
    clef: ev.midi >= 60 ? 'treble' as const : 'bass' as const,
    duration: ticksToDuration(ev.durationTicks, parsed.ticksPerBeat),
    beat: ev.startTick / parsed.ticksPerBeat,
    measure: Math.floor(ev.startTick / parsed.ticksPerBeat / parsed.timeSignatureNumerator),
  }));

  const scoreProject = {
    title: file.name.replace(/\.[^.]+$/, ''),
    bpm: parsed.bpm,
    timeSignature: [parsed.timeSignatureNumerator, parsed.timeSignatureDenominator] as [number, number],
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const envelope: StudioProjectEnvelope<T> = {
    id: generateId(scoreProject.title),
    title: scoreProject.title,
    module: 'score',
    category: 'Importado',
    version: '1.0.0',
    createdAt: scoreProject.createdAt,
    updatedAt: scoreProject.updatedAt,
    metadata: { bpm: parsed.bpm, notesCount: notes.length },
    data: scoreProject as unknown as T,
  };

  return { success: true, envelope, format: 'midi', hasConflict: false };
}

// ─── Parser MIDI Binário ──────────────────────────────────────────────────────

/**
 * Interpreta um arquivo MIDI SMF (Format 0 ou 1) e extrai notas, andamento e
 * fórmula de compasso. Suporta running status e meta events.
 */
export function parseMidiFile(bytes: Uint8Array): ParsedMidiFile {
  let pos = 0;

  const readU8  = (): number => bytes[pos++] ?? 0;
  const readU16 = (): number => { const v = (readU8() << 8) | readU8(); return v; };
  const readU32 = (): number => {
    const v = (readU8() << 24) | (readU8() << 16) | (readU8() << 8) | readU8();
    return v >>> 0;
  };
  const readVarLen = (): number => {
    let val = 0;
    let b: number;
    do {
      b = readU8();
      val = (val << 7) | (b & 0x7f);
    } while (b & 0x80);
    return val;
  };

  // Header
  const magic = [readU8(), readU8(), readU8(), readU8()];
  if (String.fromCharCode(...magic) !== 'MThd') {
    throw new Error('Não é um arquivo MIDI válido (cabeçalho MThd ausente).');
  }
  readU32(); // header length = 6
  const format = readU16();
  if (format !== 0 && format !== 1) {
    throw new Error(`Formato MIDI ${format} não suportado. Use Format 0 ou 1.`);
  }
  const numTracks = readU16();
  const ticksPerBeat = readU16();

  let bpm = 120;
  let timeSignatureNumerator = 4;
  let timeSignatureDenominator = 4;
  const noteEvents: MidiNoteEvent[] = [];

  for (let t = 0; t < numTracks; t++) {
    const trackMagic = [readU8(), readU8(), readU8(), readU8()];
    if (String.fromCharCode(...trackMagic) !== 'MTrk') break;

    const trackLength = readU32();
    const trackEnd = pos + trackLength;

    let tick = 0;
    const openNotes = new Map<number, number>(); // midi → startTick
    let runningStatus = 0;

    while (pos < trackEnd) {
      const delta = readVarLen();
      tick += delta;

      let statusByte = bytes[pos] ?? 0;
      if (statusByte & 0x80) {
        runningStatus = statusByte;
        pos++;
      } else {
        statusByte = runningStatus;
      }

      const type = statusByte >> 4;

      if (type === 0x9) {
        const midi = readU8();
        const velocity = readU8();
        if (velocity > 0) {
          openNotes.set(midi, tick);
        } else {
          const start = openNotes.get(midi);
          if (start !== undefined) {
            noteEvents.push({ midi, startTick: start, durationTicks: tick - start });
            openNotes.delete(midi);
          }
        }
      } else if (type === 0x8) {
        const midi = readU8();
        readU8();
        const start = openNotes.get(midi);
        if (start !== undefined) {
          noteEvents.push({ midi, startTick: start, durationTicks: tick - start });
          openNotes.delete(midi);
        }
      } else if (type === 0xA) {
        readU8(); readU8(); // Aftertouch
      } else if (type === 0xB) {
        readU8(); readU8(); // Control Change
      } else if (type === 0xC) {
        readU8(); // Program Change
      } else if (type === 0xD) {
        readU8(); // Channel Pressure
      } else if (type === 0xE) {
        readU8(); readU8(); // Pitch Bend
      } else if (statusByte === 0xFF) {
        const metaType = readU8();
        const metaLen = readVarLen();
        const metaData = bytes.slice(pos, pos + metaLen);
        pos += metaLen;

        if (metaType === 0x51 && metaLen === 3) {
          const usPerBeat = (metaData[0]! << 16) | (metaData[1]! << 8) | metaData[2]!;
          bpm = Math.round(60_000_000 / usPerBeat);
        } else if (metaType === 0x58 && metaLen >= 4) {
          timeSignatureNumerator = metaData[0]!;
          timeSignatureDenominator = Math.pow(2, metaData[1]!);
        } else if (metaType === 0x2F) {
          break;
        }
      } else if (statusByte === 0xF0 || statusByte === 0xF7) {
        const sysexLen = readVarLen();
        pos += sysexLen;
      } else {
        pos++;
      }
    }

    pos = trackEnd;

    for (const [midi, start] of openNotes) {
      noteEvents.push({ midi, startTick: start, durationTicks: ticksPerBeat });
    }
  }

  return { ticksPerBeat, bpm, timeSignatureNumerator, timeSignatureDenominator, notes: noteEvents };
}

// ─── Gerador MIDI a partir de StudioProjectEnvelope ──────────────────────────

/**
 * Gera bytes MIDI Format 0 a partir de um StudioProjectEnvelope de partitura.
 */
export function buildMidiFromEnvelope(envelope: StudioProjectEnvelope<unknown>): Uint8Array {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = envelope.data as any;
  const bpm: number = data?.bpm ?? 120;
  const timeSignature: [number, number] = data?.timeSignature ?? [4, 4];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notes: any[] = Array.isArray(data?.notes) ? data.notes : [];

  const microsecsPerBeat = Math.round(60_000_000 / bpm);
  const ticksPerBeat = 480;

  const writeVarLen = (val: number, arr: number[]): void => {
    const buf: number[] = [];
    buf.unshift(val & 0x7f);
    val >>= 7;
    while (val > 0) {
      buf.unshift((val & 0x7f) | 0x80);
      val >>= 7;
    }
    buf.forEach((b) => arr.push(b));
  };

  const writeU16 = (v: number, arr: number[]): void => arr.push((v >> 8) & 0xff, v & 0xff);
  const writeU32 = (v: number, arr: number[]): void => {
    arr.push((v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff);
  };

  const header: number[] = [];
  header.push(0x4d, 0x54, 0x68, 0x64);
  writeU32(6, header);
  writeU16(0, header);
  writeU16(1, header);
  writeU16(ticksPerBeat, header);

  const trackEvents: Array<{ tick: number; data: number[] }> = [];

  trackEvents.push({
    tick: 0,
    data: [
      0xff, 0x51, 0x03,
      (microsecsPerBeat >> 16) & 0xff,
      (microsecsPerBeat >> 8) & 0xff,
      microsecsPerBeat & 0xff,
    ],
  });

  const [num, den] = timeSignature;
  const denPow = Math.round(Math.log2(den));
  trackEvents.push({ tick: 0, data: [0xff, 0x58, 0x04, num, denPow, 24, 8] });

  const titleBytes = Array.from(new TextEncoder().encode(envelope.title.slice(0, 64)));
  trackEvents.push({ tick: 0, data: [0xff, 0x03, titleBytes.length, ...titleBytes] });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sorted: any[] = [...notes].sort((a, b) => a.beat - b.beat);
  for (const note of sorted) {
    const startTick = Math.round((note.beat ?? 0) * ticksPerBeat);
    const durTicks  = Math.round((note.duration ?? 1) * ticksPerBeat);
    const vel       = note.velocity ?? 90;
    trackEvents.push({ tick: startTick, data: [0x90, note.midi, vel] });
    trackEvents.push({ tick: startTick + durTicks, data: [0x80, note.midi, 0] });
  }

  trackEvents.sort((a, b) => a.tick - b.tick);

  const trackBytes: number[] = [];
  let currentTick = 0;
  for (const ev of trackEvents) {
    writeVarLen(ev.tick - currentTick, trackBytes);
    currentTick = ev.tick;
    ev.data.forEach((b) => trackBytes.push(b));
  }
  writeVarLen(0, trackBytes);
  trackBytes.push(0xff, 0x2f, 0x00);

  const all: number[] = [...header];
  all.push(0x4d, 0x54, 0x72, 0x6b);
  writeU32(trackBytes.length, all);
  trackBytes.forEach((b) => all.push(b));

  return new Uint8Array(all);
}

// ─── Utilitários Públicos ─────────────────────────────────────────────────────

/** Dispara o download de um Blob no navegador. */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Gera um slug simples a partir de texto. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'projeto';
}

/** Gera ID único para projetos importados. */
function generateId(title: string): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `imported_${slugify(title)}_${rand}`;
}

/**
 * Converte ticks para a figura rítmica mais próxima suportada pelo editor.
 */
export function ticksToDuration(ticks: number, ticksPerBeat: number): 4 | 2 | 1 | 0.5 | 0.25 {
  const beats = ticks / ticksPerBeat;
  if (beats >= 3)    return 4;
  if (beats >= 1.5)  return 2;
  if (beats >= 0.75) return 1;
  if (beats >= 0.375) return 0.5;
  return 0.25;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Converte número MIDI para nome de nota científico (ex: 60 → C4). */
export function midiToNoteName(midi: number): string {
  const name = NOTE_NAMES[midi % 12] ?? 'C';
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}
