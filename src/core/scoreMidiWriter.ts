/**
 * scoreMidiWriter.ts
 * Núcleo de lógica musical para inserção, sincronização de compasso e quantização de notas MIDI na partitura.
 *
 * Responsabilidades:
 * 1. Mapeamento determinístico de notas para as claves de Sol (𝄞) e Fá (𝄢) com base no Dó Central (MIDI 60).
 * 2. Posicionamento de notas na grade métrica dos compassos (ex: 2/4, 3/4, 4/4, 6/8).
 * 3. Modo Passo a Passo (Step-Time Input): avança o cursor no andamento da figura rítmica selecionada.
 * 4. Modo Gravação em Tempo Real com Metrônomo: quantização rigorosa para a subdivisão rítmica ativa.
 * 5. Modo Acorde: empilhamento harmônico de notas simultâneas no mesmo beat do compasso.
 */

export type NoteDuration = 4 | 2 | 1 | 0.5 | 0.25;
export type NoteClef = 'treble' | 'bass';

export interface ScoreMidiNote {
  id: string;
  midi: number;
  noteName: string;
  clef: NoteClef;
  duration: NoteDuration;
  beat: number;
  measure: number;
}

export interface MidiInsertionParams {
  midi: number;
  noteName: string;
  currentNotes: ScoreMidiNote[];
  cursorBeat: number;
  selectedDuration: NoteDuration;
  selectedClef: NoteClef;
  beatsPerMeasure: number;
  isChordMode: boolean;
  isPlaying: boolean;
  playheadBeat: number | null;
  generateId?: () => string;
}

export interface MidiInsertionResult {
  updatedNotes: ScoreMidiNote[];
  nextCursorBeat: number;
  insertedNote: ScoreMidiNote;
  isNewMeasure: boolean;
  targetMeasure: number;
}

/**
 * Determina a clave apropriada para uma nota MIDI no sistema de pentagrama duplo (Grand Staff).
 * Notas a partir do Dó Central (MIDI 60) pertencem à Clave de Sol; notas abaixo pertencem à Clave de Fá.
 */
export function determineClefForMidi(midi: number, preferredClef?: NoteClef): NoteClef {
  if (midi < 60) return 'bass';
  if (midi >= 60) return 'treble';
  return preferredClef ?? 'treble';
}

/**
 * Quantiza um tempo contínuo (em beats) para a grade rítmica mais próxima baseada na figura selecionada.
 */
export function quantizeBeatToGrid(beat: number, snapDuration: NoteDuration): number {
  const snap = snapDuration;
  const quantized = Math.round(beat / snap) * snap;
  // Corrige imprecisões de ponto flutuante (ex: 0.25000000000000006)
  return Math.round(quantized * 1000) / 1000;
}

/**
 * Calcula o índice do compasso (0-based) a partir de uma posição em beats e da fórmula de compasso.
 */
export function calculateMeasureForBeat(beat: number, beatsPerMeasure: number): number {
  if (beatsPerMeasure <= 0) return 0;
  return Math.floor(Math.max(0, beat) / beatsPerMeasure);
}

/**
 * Calcula o total mínimo de compassos necessários para acomodar todas as notas e o cursor atual.
 */
export function calculateTotalMeasures(
  notes: ScoreMidiNote[],
  cursorBeat: number,
  beatsPerMeasure: number,
  minMeasures = 4
): number {
  let maxBeat = cursorBeat;
  for (const n of notes) {
    const end = n.beat + n.duration;
    if (end > maxBeat) maxBeat = end;
  }
  const needed = Math.ceil(maxBeat / beatsPerMeasure) + 1;
  return Math.max(minMeasures, needed);
}

let counter = 0;
function defaultNoteId(): string {
  return `score-note-${Date.now()}-${++counter}`;
}

/**
 * Insere uma nota originada de entrada MIDI física ou teclado virtual na partitura,
 * respeitando o compasso ativo, a figura rítmica e o modo de gravação.
 */
export function insertMidiNote(params: MidiInsertionParams): MidiInsertionResult {
  const {
    midi,
    noteName,
    currentNotes,
    cursorBeat,
    selectedDuration,
    selectedClef,
    beatsPerMeasure,
    isChordMode,
    isPlaying,
    playheadBeat,
    generateId = defaultNoteId,
  } = params;

  let targetBeat: number;

  if (isPlaying && playheadBeat !== null) {
    // Modo Gravação em Tempo Real: quantiza para a subdivisão rítmica selecionada
    targetBeat = quantizeBeatToGrid(playheadBeat, selectedDuration);
  } else {
    // Modo Passo a Passo: insere exatamente no cursor ativo
    targetBeat = cursorBeat;
  }

  const targetMeasure = calculateMeasureForBeat(targetBeat, beatsPerMeasure);
  const clef = determineClefForMidi(midi, selectedClef);

  // Evita duplicar a mesma nota exata no mesmo beat e mesma altura MIDI
  const existingIdx = currentNotes.findIndex(
    (n) => Math.abs(n.beat - targetBeat) < 0.05 && n.midi === midi
  );

  let updatedNotes: ScoreMidiNote[];
  let insertedNote: ScoreMidiNote;

  if (existingIdx >= 0) {
    // Atualiza a duração da nota existente
    insertedNote = {
      ...currentNotes[existingIdx],
      duration: selectedDuration,
    };
    updatedNotes = currentNotes.map((n, idx) => (idx === existingIdx ? insertedNote : n));
  } else {
    insertedNote = {
      id: generateId(),
      midi,
      noteName,
      clef,
      duration: selectedDuration,
      beat: targetBeat,
      measure: targetMeasure,
    };
    updatedNotes = [...currentNotes, insertedNote];
  }

  // Ordena cronologicamente por beat
  updatedNotes.sort((a, b) => a.beat - b.beat);

  let nextCursorBeat: number;
  if (isPlaying) {
    nextCursorBeat = targetBeat + selectedDuration;
  } else if (isChordMode) {
    // Modo Acorde: mantém o cursor no mesmo beat para empilhar notas harmônicas
    nextCursorBeat = targetBeat;
  } else {
    // Modo Melódico / Passo a Passo: avança para a próxima posição métrica
    nextCursorBeat = Math.round((targetBeat + selectedDuration) * 1000) / 1000;
  }

  const nextMeasure = calculateMeasureForBeat(nextCursorBeat, beatsPerMeasure);
  const isNewMeasure = nextMeasure > targetMeasure;

  return {
    updatedNotes,
    nextCursorBeat,
    insertedNote,
    isNewMeasure,
    targetMeasure,
  };
}
