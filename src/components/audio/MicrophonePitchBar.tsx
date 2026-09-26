/**
 * MicrophonePitchBar.tsx
 * Re-exporta UniversalInputBar para compatibilidade plena com os componentes existentes.
 * O UniversalInputBar unifica Entrada MIDI USB e Microfone Acústico em todas as telas.
 */

export { UniversalInputBar, type UniversalInputBarProps } from './UniversalInputBar';
export { UniversalInputBar as MicrophonePitchBar } from './UniversalInputBar';
