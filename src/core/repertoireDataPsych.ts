/**
 * repertoireDataPsych.ts
 * Barrel de importacao das composicoes originais de Rock Psicodelico & Progressivo.
 *
 * Cada musica esta em seu proprio arquivo dentro de src/core/songs/.
 * Este arquivo centraliza os imports e exporta o array consolidado
 * PSYCHEDELIC_ROCK_SONGS para uso em repertoireDataExtended.ts.
 *
 * Composicoes:
 *  1. Ethereal Drift     — Em | 4/4 | 72 BPM  | Intermediario
 *  2. Stone Mandala      — Dm | 4/4 | 88 BPM  | Intermediario
 *  3. The Quiet Storm    — Am | 4/4 | 60 BPM  | Intermediario
 *  4. Crimson Tide Rising — Bm | 4/4 | 104 BPM | Avancado
 *  5. Stellar Requiem    — Gm | 4/4 | 68 BPM  | Avancado
 *
 * Licenca: Composicoes originais da Harmonia App — uso livre educativo.
 */

import { ETHEREAL_DRIFT } from './songs/etherealDrift';
import { STONE_MANDALA } from './songs/stoneMandala';
import { THE_QUIET_STORM } from './songs/theQuietStorm';
import { CRIMSON_TIDE_RISING } from './songs/crimsonTideRising';
import { STELLAR_REQUIEM } from './songs/stellarRequiem';

export {
  ETHEREAL_DRIFT,
  STONE_MANDALA,
  THE_QUIET_STORM,
  CRIMSON_TIDE_RISING,
  STELLAR_REQUIEM,
};

export const PSYCHEDELIC_ROCK_SONGS = [
  ETHEREAL_DRIFT,
  STONE_MANDALA,
  THE_QUIET_STORM,
  CRIMSON_TIDE_RISING,
  STELLAR_REQUIEM,
];
