/**
 * hooks/index.ts
 * Barrel de re-exportação dos hooks compartilhados da aplicação.
 */

export { useFullscreen } from './useFullscreen';
export type { UseFullscreenReturn } from './useFullscreen';

export { useActiveNotes } from './useActiveNotes';
export type { UseActiveNotesOptions, UseActiveNotesReturn } from './useActiveNotes';
