/**
 * useActiveNotes.ts
 * Hook centralizado para combinar e identificar notas ativas de múltiplas fontes.
 *
 * Elimina a duplicação de lógica presente em PianoModule e KeyboardCourseView,
 * onde a fusão de globalActiveMidi + micAcousticNotes + micHearingMidi e a
 * chamada a `identifyChordFromMidi` eram replicadas manualmente.
 *
 * Responsabilidades:
 *  - Subscrever ao `activeMidiStore` (notas de teclado MIDI físico e partitura).
 *  - Fundir as fontes: MIDI global, notas acústicas do microfone e nota única sustentada.
 *  - Identificar o acorde resultante em tempo real via `identifyChordFromMidi`.
 *  - Respeitar o padrão de oitava configurado pelo usuário.
 *
 * Uso:
 *   const { activeNotes, liveChord, globalActiveMidi } = useActiveNotes({
 *     micHearingMidi,
 *     micAcousticNotes,   // opcional
 *   });
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';
import { activeMidiStore } from '../core/activeMidiStore';
import { identifyChordFromMidi, type IdentifiedChord } from '../core/musicTheory';
import { useOctaveStandard } from '../core/octaveConfigStore';

export interface UseActiveNotesOptions {
  /** Nota MIDI sustentada pelo microfone (detector de pitch de nota única). */
  micHearingMidi: number | null;
  /**
   * Buffer de notas acústicas recentes detectadas pelo microfone para
   * identificação de acordes. Opcional — apenas o cursor de teclado usa isso.
   */
  micAcousticNotes?: number[];
}

export interface UseActiveNotesReturn {
  /**
   * Array unificado de todos os MIDIs ativos no momento:
   * MIDI físico/USB + notas acústicas do mic + nota do detector de pitch.
   */
  activeNotes: number[];
  /**
   * Acorde identificado a partir das `activeNotes`. `null` quando nenhum
   * acorde reconhecível está sendo tocado.
   */
  liveChord: IdentifiedChord | null;
  /**
   * Notas do `activeMidiStore` puro (teclados USB/OTG/partitura),
   * sem adição de fontes de microfone. Útil quando o consumidor precisa
   * separar as origens.
   */
  globalActiveMidi: readonly number[];
}

export function useActiveNotes({
  micHearingMidi,
  micAcousticNotes = [],
}: UseActiveNotesOptions): UseActiveNotesReturn {
  const octaveStandard = useOctaveStandard();

  const globalActiveMidi = useSyncExternalStore(
    activeMidiStore.subscribe,
    activeMidiStore.getSnapshot,
  );

  const activeNotes = useMemo<number[]>(() => {
    const set = new Set<number>(globalActiveMidi);
    for (const m of micAcousticNotes) set.add(m);
    if (micHearingMidi !== null) set.add(micHearingMidi);
    return Array.from(set);
  }, [globalActiveMidi, micAcousticNotes, micHearingMidi]);

  const liveChord = useMemo<IdentifiedChord | null>(() => {
    if (activeNotes.length === 0) return null;
    return identifyChordFromMidi(activeNotes, octaveStandard);
  }, [activeNotes, octaveStandard]);

  return { activeNotes, liveChord, globalActiveMidi };
}
