/**
 * repertoireDataWorld.ts
 * Barrel de importacao do Repertorio Internacional & Folk.
 *
 * Cada musica esta em seu proprio arquivo dentro de src/core/songs/.
 * Este arquivo centraliza os imports e exporta o array consolidado
 * WORLD_FOLK_SONGS para uso em repertoireDataExtended.ts.
 *
 * Composicoes:
 *  1. Bella Ciao            — Tradicao Italiana (D.P.) | Am | 3/4 | 100 BPM | Iniciante
 *  2. Hasta Siempre         — Carlos Puebla, 1965       | Dm | 3/4 |  88 BPM | Intermediario
 *  3. El Condor Pasa        — D. A. Robles, 1913 (D.P.) | Gm | 4/4 |  76 BPM | Intermediario
 *  4. Guantanamera          — Joseito Fernandez, 1928   | C  | 4/4 |  92 BPM | Iniciante
 *
 * Licencas: obras de dominio publico ou creative commons com atribuicao.
 */

import { BELLA_CIAO } from './songs/bellaCiao';
import { HASTA_SIEMPRE } from './songs/hastaSimepre';
import { EL_CONDOR_PASA } from './songs/elCondorPasa';
import { GUANTANAMERA } from './songs/guantanamera';

export {
  BELLA_CIAO,
  HASTA_SIEMPRE,
  EL_CONDOR_PASA,
  GUANTANAMERA,
};

export const WORLD_FOLK_SONGS = [
  BELLA_CIAO,
  HASTA_SIEMPRE,
  EL_CONDOR_PASA,
  GUANTANAMERA,
];
