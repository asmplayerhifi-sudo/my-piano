/**
 * repertoireDataExtended.ts
 * Barrel e agregador central de todo o repertorio da aplicacao.
 *
 * Cada musica do catalogo estendido esta em src/core/songs/.
 * Este arquivo:
 *   1. Importa os arrays dos catalagos especializados (World & Psych).
 *   2. Importa individualmente cada musica do catalogo estendido.
 *   3. Exporta EXTENDED_REPERTOIRE_SONGS com todo o repertorio unificado.
 *
 * Catalogo Estendido (proprias):
 *  1. Three Little Birds    — Bob Marley, 1977        | A  | 4/4 | 74 BPM | Iniciante
 *  2. O Xote das Meninas    — Luiz Gonzaga, 1953      | Dm | 4/4 | 90 BPM | Intermediario
 *  3. Diga Pra Mim          — Zezo dos Teclados       | Am | 4/4 | 86 BPM | Iniciante
 *  4. Porque Ele Vive       — Bill & Gloria Gaither   | G  | 4/4 | 72 BPM | Intermediario
 *  5. Dona                  — Sa & Guarabyra, 1985    | G  | 4/4 | 68 BPM | Intermediario
 *  6. Every Breath You Take — The Police, 1983        | A  | 4/4 | 113 BPM | Intermediario
 */

import type { RepertoireSong } from './repertoireData';
import { WORLD_FOLK_SONGS } from './repertoireDataWorld';
import { PSYCHEDELIC_ROCK_SONGS } from './repertoireDataPsych';

import { THREE_LITTLE_BIRDS } from './songs/threeLittleBirds';
import { XOTE_DAS_MENINAS } from './songs/xoteDasMeninas';
import { DIGA_PRA_MIM_ZEZO } from './songs/digaPraMimZezo';
import { PORQUE_ELE_VIVE } from './songs/porqueEleVive';
import { DONA_ROUPA_NOVA } from './songs/donaRoupaNova';
import { EVERY_BREATH_YOU_TAKE } from './songs/everyBreathYouTake';

export {
  THREE_LITTLE_BIRDS,
  XOTE_DAS_MENINAS,
  DIGA_PRA_MIM_ZEZO,
  PORQUE_ELE_VIVE,
  DONA_ROUPA_NOVA,
  EVERY_BREATH_YOU_TAKE,
};

const EXTENDED_OWN_SONGS: RepertoireSong[] = [
  THREE_LITTLE_BIRDS,
  XOTE_DAS_MENINAS,
  DIGA_PRA_MIM_ZEZO,
  PORQUE_ELE_VIVE,
  DONA_ROUPA_NOVA,
  EVERY_BREATH_YOU_TAKE,
];

export const EXTENDED_REPERTOIRE_SONGS: RepertoireSong[] = [
  ...EXTENDED_OWN_SONGS,
  ...WORLD_FOLK_SONGS,
  ...PSYCHEDELIC_ROCK_SONGS,
];
