/**
 * tests/domain/StudioImportExport.spec.ts
 *
 * Suíte de Testes do Serviço de Importação e Exportação do Estúdio Harmonia.
 *
 * Cobre:
 *  1. Exportação JSON com schema versionado
 *  2. Importação JSON com validação e conflito
 *  3. Exportação MIDI binária (buildMidiFromEnvelope)
 *  4. Importação MIDI (parseMidiFile → notas, BPM, compasso)
 *  5. Roundtrip Export→Import com integridade de dados
 *  6. Casos de borda: extensão inválida, schema incompat., módulo errado
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportProject,
  importProjectFromFile,
  parseMidiFile,
  buildMidiFromEnvelope,
  ticksToDuration,
  midiToNoteName,
  slugify,
  EXPORT_SCHEMA_VERSION,
  SUPPORTED_SCHEMA_VERSIONS,
} from '../../src/core/studio/studioImportExportService';
import type { StudioProjectEnvelope, StudioManifestItem } from '../../src/core/studio/studioStorageTypes';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeScoreEnvelope(overrides: Partial<StudioProjectEnvelope<unknown>> = {}): StudioProjectEnvelope<unknown> {
  return {
    id: 'test-score-001',
    title: 'Minha Partitura Teste',
    module: 'score',
    category: 'Partitura',
    version: '1.0.0',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
    metadata: { bpm: 120, notesCount: 3, timeSignature: [4, 4] },
    data: {
      title: 'Minha Partitura Teste',
      bpm: 120,
      timeSignature: [4, 4],
      notes: [
        { id: 'n1', midi: 60, noteName: 'C4', clef: 'treble', duration: 1, beat: 0, measure: 0 },
        { id: 'n2', midi: 62, noteName: 'D4', clef: 'treble', duration: 1, beat: 1, measure: 0 },
        { id: 'n3', midi: 64, noteName: 'E4', clef: 'treble', duration: 1, beat: 2, measure: 0 },
      ],
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z',
    },
    ...overrides,
  };
}

function makeManifestItem(id: string, title: string): StudioManifestItem {
  return {
    id,
    title,
    category: 'Partitura',
    module: 'score',
    relativePath: `Partituras/${id}.json`,
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
    version: '1.0.0',
  };
}

/** Cria um File a partir de conteúdo de texto */
function makeJsonFile(content: unknown, filename = 'projeto.json'): File {
  const json = JSON.stringify(content);
  return new File([json], filename, { type: 'application/json' });
}

/** Cria um File a partir de bytes MIDI */
function makeMidiFile(bytes: Uint8Array, filename = 'projeto.mid'): File {
  return new File([bytes.buffer], filename, { type: 'audio/midi' });
}

// ─── Mock do triggerDownload para não chamar DOM real ─────────────────────────

vi.mock('../../src/core/studio/studioImportExportService', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../src/core/studio/studioImportExportService')>();
  return {
    ...original,
    triggerDownload: vi.fn(), // não fazer download real nos testes
  };
});

// ─── 1. Utilitários ───────────────────────────────────────────────────────────

describe('1. Utilitários Auxiliares', () => {
  it('slugify deve remover acentos, espaços e caracteres especiais', () => {
    expect(slugify('Minha Partitura Incrível!')).toBe('minha_partitura_incrivel');
    expect(slugify('C# e Dó Maior')).toBe('c_e_do_maior');
    expect(slugify('')).toBe('projeto');
    expect(slugify('   ')).toBe('projeto');
  });

  it('midiToNoteName deve converter MIDI para nome científico correto', () => {
    expect(midiToNoteName(60)).toBe('C4');
    expect(midiToNoteName(69)).toBe('A4');
    expect(midiToNoteName(48)).toBe('C3');
    expect(midiToNoteName(72)).toBe('C5');
    expect(midiToNoteName(61)).toBe('C#4');
  });

  it('ticksToDuration deve retornar a figura rítmica mais próxima', () => {
    const tpb = 480; // ticks per beat
    expect(ticksToDuration(480 * 4, tpb)).toBe(4);   // semibreve
    expect(ticksToDuration(480 * 2, tpb)).toBe(2);   // mínima
    expect(ticksToDuration(480, tpb)).toBe(1);        // semínima
    expect(ticksToDuration(240, tpb)).toBe(0.5);      // colcheia
    expect(ticksToDuration(120, tpb)).toBe(0.25);     // semicolcheia
    expect(ticksToDuration(60, tpb)).toBe(0.25);      // mínima de semicolcheia
  });
});

// ─── 2. Exportação JSON ───────────────────────────────────────────────────────

describe('2. Exportação JSON', () => {
  let capturedBlob: Blob | null = null;
  let capturedFilename: string | null = null;

  beforeEach(() => {
    capturedBlob = null;
    capturedFilename = null;

    // Intercepta o download
    const urlMock = 'blob:mock-url';
    vi.stubGlobal('URL', {
      createObjectURL: (blob: Blob) => { capturedBlob = blob; return urlMock; },
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal('document', {
      createElement: () => ({
        click: vi.fn(),
        set download(v: string) { capturedFilename = v; },
        href: '',
        style: {},
      }),
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
    });
  });

  it('deve exportar um envelope de partitura como JSON com schemaVersion correto', async () => {
    const envelope = makeScoreEnvelope();
    exportProject({ module: 'score', title: 'Minha Partitura', envelope, format: 'json' });

    expect(capturedBlob).not.toBeNull();
    const text = await capturedBlob!.text();
    const parsed = JSON.parse(text);

    expect(parsed.schemaVersion).toBe(EXPORT_SCHEMA_VERSION);
    expect(parsed.id).toBe('test-score-001');
    expect(parsed.module).toBe('score');
    expect(parsed.data).toBeDefined();
    expect((parsed.data as { notes: unknown[] }).notes).toHaveLength(3);
  });

  it('deve usar slug no nome do arquivo exportado', () => {
    const envelope = makeScoreEnvelope();
    exportProject({ module: 'score', title: 'Partitura Ação Incrível!', envelope, format: 'json' });
    expect(capturedFilename).toMatch(/^partitura_acao_incrivel_?\.harmonia\.json$/);
  });
});

// ─── 3. Exportação e Geração MIDI ─────────────────────────────────────────────

describe('3. Exportação e Geração MIDI', () => {
  it('buildMidiFromEnvelope deve gerar bytes com header MThd válido', () => {
    const envelope = makeScoreEnvelope();
    const bytes = buildMidiFromEnvelope(envelope);

    expect(bytes[0]).toBe(0x4D); // 'M'
    expect(bytes[1]).toBe(0x54); // 'T'
    expect(bytes[2]).toBe(0x68); // 'h'
    expect(bytes[3]).toBe(0x64); // 'd'
  });

  it('buildMidiFromEnvelope deve incluir MTrk chunk', () => {
    const envelope = makeScoreEnvelope();
    const bytes = buildMidiFromEnvelope(envelope);

    // O chunk de track começa no byte 14 (header = 14 bytes)
    expect(bytes[14]).toBe(0x4D); // 'M'
    expect(bytes[15]).toBe(0x54); // 'T'
    expect(bytes[16]).toBe(0x72); // 'r'
    expect(bytes[17]).toBe(0x6B); // 'k'
  });

  it('buildMidiFromEnvelope com envelope vazio de notas não deve lançar erro', () => {
    const envelope = makeScoreEnvelope({
      data: { title: 'Vazio', bpm: 90, timeSignature: [4, 4], notes: [], createdAt: '', updatedAt: '' },
    });
    expect(() => buildMidiFromEnvelope(envelope)).not.toThrow();
  });

  it('deve lançar erro ao tentar exportar MIDI de módulo não-Partitura', () => {
    const envelope: StudioProjectEnvelope<unknown> = {
      ...makeScoreEnvelope(),
      module: 'phrase',
    };
    expect(() =>
      exportProject({ module: 'phrase', title: 'Frase', envelope, format: 'midi' })
    ).toThrow('apenas para o módulo Partitura');
  });
});

// ─── 4. Parser MIDI ───────────────────────────────────────────────────────────

describe('4. Parser MIDI Binário', () => {
  function buildMinimalMidi(
    bpmValue = 120,
    notes: Array<{ midi: number; startTick: number; durationTicks: number }> = [],
    ticksPerBeat = 480
  ): Uint8Array {
    const microsecs = Math.round(60_000_000 / bpmValue);
    const writeVarLen = (v: number, arr: number[]) => {
      const buf: number[] = [];
      buf.unshift(v & 0x7f);
      v >>= 7;
      while (v > 0) { buf.unshift((v & 0x7f) | 0x80); v >>= 7; }
      buf.forEach(b => arr.push(b));
    };

    const track: Array<{ tick: number; data: number[] }> = [
      { tick: 0, data: [0xFF, 0x51, 0x03, (microsecs >> 16) & 0xFF, (microsecs >> 8) & 0xFF, microsecs & 0xFF] },
      { tick: 0, data: [0xFF, 0x58, 0x04, 4, 2, 24, 8] },
    ];
    for (const n of notes) {
      track.push({ tick: n.startTick, data: [0x90, n.midi, 90] });
      track.push({ tick: n.startTick + n.durationTicks, data: [0x80, n.midi, 0] });
    }
    track.sort((a, b) => a.tick - b.tick);

    const trackBytes: number[] = [];
    let cur = 0;
    for (const ev of track) {
      writeVarLen(ev.tick - cur, trackBytes);
      cur = ev.tick;
      ev.data.forEach(b => trackBytes.push(b));
    }
    writeVarLen(0, trackBytes);
    trackBytes.push(0xFF, 0x2F, 0x00);

    const all: number[] = [
      0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1,
      (ticksPerBeat >> 8) & 0xFF, ticksPerBeat & 0xFF,
      0x4D, 0x54, 0x72, 0x6B,
    ];
    all.push((trackBytes.length >> 24) & 0xFF, (trackBytes.length >> 16) & 0xFF,
              (trackBytes.length >> 8) & 0xFF, trackBytes.length & 0xFF);
    trackBytes.forEach(b => all.push(b));
    return new Uint8Array(all);
  }

  it('deve parsear header e extrair ticksPerBeat corretamente', () => {
    const bytes = buildMinimalMidi(120, [], 480);
    const result = parseMidiFile(bytes);
    expect(result.ticksPerBeat).toBe(480);
  });

  it('deve extrair BPM corretamente do meta event Set Tempo (120 BPM)', () => {
    const bytes = buildMinimalMidi(120);
    const result = parseMidiFile(bytes);
    expect(result.bpm).toBe(120);
  });

  it('deve extrair BPM de 90 BPM corretamente', () => {
    const bytes = buildMinimalMidi(90);
    const result = parseMidiFile(bytes);
    expect(result.bpm).toBe(90);
  });

  it('deve extrair notas com startTick e durationTicks corretos', () => {
    const bytes = buildMinimalMidi(120, [
      { midi: 60, startTick: 0, durationTicks: 480 },
      { midi: 64, startTick: 480, durationTicks: 480 },
    ]);
    const result = parseMidiFile(bytes);
    expect(result.notes).toHaveLength(2);
    expect(result.notes[0].midi).toBe(60);
    expect(result.notes[0].startTick).toBe(0);
    expect(result.notes[0].durationTicks).toBe(480);
    expect(result.notes[1].midi).toBe(64);
    expect(result.notes[1].startTick).toBe(480);
  });

  it('deve lançar erro em arquivo não-MIDI (sem MThd)', () => {
    const bytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    expect(() => parseMidiFile(bytes)).toThrow('MThd');
  });
});

// ─── 5. Importação JSON ───────────────────────────────────────────────────────

describe('5. Importação JSON', () => {
  it('deve importar um arquivo JSON de partitura válido com sucesso', async () => {
    const payload = {
      ...makeScoreEnvelope(),
      schemaVersion: '2.0.0',
    };
    const file = makeJsonFile(payload);
    const result = await importProjectFromFile(file, { existingItems: [], expectedModule: 'score' });

    expect(result.success).toBe(true);
    expect(result.hasConflict).toBe(false);
    expect(result.envelope).toBeDefined();
    expect(result.envelope!.id).toBe('test-score-001');
    expect(result.format).toBe('json');
  });

  it('deve aceitar arquivos com schemaVersion 1.0.0 (compatibilidade legada)', async () => {
    const payload = { ...makeScoreEnvelope(), schemaVersion: '1.0.0' };
    const file = makeJsonFile(payload);
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar arquivos com schemaVersion desconhecido', async () => {
    const payload = { ...makeScoreEnvelope(), schemaVersion: '99.0.0' };
    const file = makeJsonFile(payload);
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(false);
    expect(result.error).toContain('99.0.0');
  });

  it('deve detectar conflito quando ID já existe no manifesto', async () => {
    const payload = { ...makeScoreEnvelope(), schemaVersion: '2.0.0' };
    const file = makeJsonFile(payload);
    const existing = [makeManifestItem('test-score-001', 'Partitura Existente')];
    const result = await importProjectFromFile(file, { existingItems: existing });

    expect(result.success).toBe(true);
    expect(result.hasConflict).toBe(true);
    expect(result.conflictingItem?.id).toBe('test-score-001');
    expect(result.conflictingItem?.title).toBe('Partitura Existente');
  });

  it('deve rejeitar importação de módulo errado quando expectedModule definido', async () => {
    const payload = { ...makeScoreEnvelope(), module: 'phrase', schemaVersion: '2.0.0' };
    const file = makeJsonFile(payload);
    const result = await importProjectFromFile(file, { existingItems: [], expectedModule: 'score' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('phrase');
    expect(result.error).toContain('score');
  });

  it('deve rejeitar JSON malformado', async () => {
    const file = new File(['{ broken json {{'], 'projeto.json', { type: 'application/json' });
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(false);
    expect(result.error).toContain('JSON');
  });

  it('deve rejeitar extensão de arquivo inválida', async () => {
    const file = new File(['data'], 'projeto.xml', { type: 'text/xml' });
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(false);
    expect(result.error).toContain('.xml');
  });
});

// ─── 6. Importação MIDI ───────────────────────────────────────────────────────

describe('6. Importação MIDI', () => {
  it('deve importar arquivo .mid e reconstruir ScoreProject com notas corretas', async () => {
    const envelope = makeScoreEnvelope();
    const midiBytes = buildMidiFromEnvelope(envelope);
    const file = makeMidiFile(midiBytes, 'partitura.mid');

    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(true);
    expect(result.format).toBe('midi');
    expect(result.envelope).toBeDefined();

    const data = result.envelope!.data as { notes: unknown[]; bpm: number };
    expect(data.notes).toHaveLength(3);
    expect(data.bpm).toBe(120);
  });

  it('deve aceitar arquivos com extensão .midi (dupla extensão)', async () => {
    const envelope = makeScoreEnvelope();
    const midiBytes = buildMidiFromEnvelope(envelope);
    const file = makeMidiFile(midiBytes, 'partitura.midi');
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar arquivo MIDI binário inválido com mensagem de erro clara', async () => {
    const invalid = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
    const file = makeMidiFile(invalid, 'invalido.mid');
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(false);
    expect(result.error).toContain('MIDI');
  });
});

// ─── 7. Roundtrip Export → Import ─────────────────────────────────────────────

describe('7. Roundtrip Export → Import (integridade de dados)', () => {
  it('deve manter todos os dados de notas no ciclo JSON Export → Import', async () => {
    const originalEnvelope = makeScoreEnvelope();
    const originalData = originalEnvelope.data as { notes: { midi: number }[]; bpm: number; timeSignature: [number, number] };

    // Serializa para JSON (simula exportação)
    const exportedPayload = {
      ...originalEnvelope,
      schemaVersion: EXPORT_SCHEMA_VERSION,
    };
    const file = makeJsonFile(exportedPayload);

    // Importa de volta
    const result = await importProjectFromFile(file, { existingItems: [], expectedModule: 'score' });

    expect(result.success).toBe(true);
    const importedData = result.envelope!.data as { notes: { midi: number }[]; bpm: number; timeSignature: [number, number] };

    // Verifica integridade das notas
    expect(importedData.notes).toHaveLength(originalData.notes.length);
    originalData.notes.forEach((note, idx) => {
      expect(importedData.notes[idx].midi).toBe(note.midi);
    });

    // Verifica metadados musicais
    expect(importedData.bpm).toBe(originalData.bpm);
    expect(importedData.timeSignature).toEqual(originalData.timeSignature);
  });

  it('deve manter BPM no ciclo MIDI Export → Import', async () => {
    const originalEnvelope = makeScoreEnvelope();
    const midiBytes = buildMidiFromEnvelope(originalEnvelope);
    const file = makeMidiFile(midiBytes);

    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(true);

    const data = result.envelope!.data as { bpm: number };
    expect(data.bpm).toBe(120);
  });

  it('deve preservar schemaVersion no JSON exportado como versão atual', async () => {
    const envelope = makeScoreEnvelope();
    const exported = { ...envelope, schemaVersion: EXPORT_SCHEMA_VERSION };
    const file = makeJsonFile(exported);
    const result = await importProjectFromFile(file, { existingItems: [] });

    expect(result.success).toBe(true);
    // Versão aceita = uma das suportadas
    expect(SUPPORTED_SCHEMA_VERSIONS).toContain(EXPORT_SCHEMA_VERSION);
  });
});

// ─── 8. Casos de Borda ────────────────────────────────────────────────────────

describe('8. Casos de Borda', () => {
  it('deve gerar ID único para projetos sem id no JSON legado', async () => {
    const payload = {
      title: 'Projeto Antigo',
      module: 'score',
      data: { notes: [], bpm: 90, timeSignature: [4, 4] },
      // sem id, sem schemaVersion
    };
    const file = makeJsonFile(payload);
    const result = await importProjectFromFile(file, { existingItems: [] });

    expect(result.success).toBe(true);
    expect(result.envelope!.id).toBeTruthy();
    expect(result.envelope!.id).toContain('imported_');
  });

  it('deve usar o nome do arquivo como título quando title não está no JSON', async () => {
    const payload = { module: 'score', data: { notes: [] } };
    const file = makeJsonFile(payload, 'meu_projeto_especial.json');
    const result = await importProjectFromFile(file, { existingItems: [] });

    expect(result.success).toBe(true);
    // Título vem do nome do arquivo sem extensão
    expect(result.envelope!.title).toContain('meu_projeto_especial');
  });

  it('deve aceitar arquivo JSON sem campo data (legado com estrutura plana)', async () => {
    const payload = {
      id: 'legacy-001',
      title: 'Projeto Legado',
      module: 'phrase',
      notes: [{ id: 'n1', midi: 60 }],
      bpm: 90,
    };
    const file = makeJsonFile(payload, 'legado.json');
    const result = await importProjectFromFile(file, { existingItems: [] });
    expect(result.success).toBe(true);
    // Dados devem vir do objeto raiz
    expect(result.envelope!.data).toBeDefined();
  });

  it('buildMidiFromEnvelope deve tolerar notes sem campo beat ou duration', () => {
    const envelope: StudioProjectEnvelope<unknown> = {
      ...makeScoreEnvelope(),
      data: {
        bpm: 120,
        timeSignature: [4, 4],
        notes: [
          { id: 'n1', midi: 60 }, // sem beat, sem duration
        ],
        title: 'Teste',
        createdAt: '',
        updatedAt: '',
      },
    };
    expect(() => buildMidiFromEnvelope(envelope)).not.toThrow();
  });
});
