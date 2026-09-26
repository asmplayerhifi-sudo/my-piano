/**
 * repertoireDataExtended.ts
 * Barrel e agregador central de todo o repertorio da aplicacao.
 *
 * Cada musica do catalogo estendido esta em src/core/songs/.
 * Este arquivo:
 *   1. Importa os arrays dos catalogos especializados (World & Psych).
 *   2. Importa individualmente cada musica do catalogo estendido.
 *   3. Exporta EXTENDED_REPERTOIRE_SONGS com todo o repertorio unificado.
 */

import type { RepertoireSong } from './repertoireData';
import { WORLD_FOLK_SONGS } from './repertoireDataWorld';
import { PSYCHEDELIC_ROCK_SONGS } from './repertoireDataPsych';

// Canções existentes
import { THREE_LITTLE_BIRDS } from './songs/threeLittleBirds';
import { XOTE_DAS_MENINAS } from './songs/xoteDasMeninas';
import { DIGA_PRA_MIM_ZEZO } from './songs/digaPraMimZezo';
import { PORQUE_ELE_VIVE } from './songs/porqueEleVive';
import { DONA_ROUPA_NOVA } from './songs/donaRoupaNova';
import { EVERY_BREATH_YOU_TAKE } from './songs/everyBreathYouTake';

// Pink Floyd
import { COMFORTABLY_NUMB } from './songs/comfortablyNumb';
import { WISH_YOU_WERE_HERE } from './songs/wishYouWereHere';
import { ANOTHER_BRICK_IN_THE_WALL } from './songs/anotherBrickInTheWall';

// The Doors
import { LIGHT_MY_FIRE } from './songs/lightMyFire';
import { RIDERS_ON_THE_STORM } from './songs/ridersOnTheStorm';
import { PEOPLE_ARE_STRANGE } from './songs/peopleAreStrange';

// Bob Dylan
import { LIKE_A_ROLLING_STONE } from './songs/likeARollingStone';
import { KNOCKIN_ON_HEAVENS_DOOR } from './songs/knockinOnHeavensDoor';
import { BLOWIN_IN_THE_WIND } from './songs/blowinInTheWind';

// Bruce Springsteen
import { BORN_TO_RUN } from './songs/bornToRun';
import { DANCING_IN_THE_DARK } from './songs/dancingInTheDark';
import { THE_RIVER } from './songs/theRiver';

// Bob Marley (Reggae / Roots)
import { IS_THIS_LOVE } from './songs/isThisLove';
import { NO_WOMAN_NO_CRY } from './songs/noWomanNoCry';

// Xote & Baião
import { SABIA_LUIZ_GONZAGA } from './songs/sabiaLuizGonzaga';
import { EU_SO_QUERO_UM_XODO } from './songs/euSoQueroUmXodo';
import { RIACHO_DO_NAVIO } from './songs/riachoDoNavio';

// Zezo & Seresta / Brega
import { DORES_DO_AMOR_ZEZO } from './songs/doresDoAmorZezo';
import { GARCON_REGINALDO_ROSSI } from './songs/garconReginaldoRossi';
import { A_RAPOSA_E_AS_UVAS } from './songs/aRaposaEAsUvas';
import { LEVIANA_BARTO_GALENO } from './songs/levianaBartoGaleno';

export {
  THREE_LITTLE_BIRDS,
  XOTE_DAS_MENINAS,
  DIGA_PRA_MIM_ZEZO,
  PORQUE_ELE_VIVE,
  DONA_ROUPA_NOVA,
  EVERY_BREATH_YOU_TAKE,
  COMFORTABLY_NUMB,
  WISH_YOU_WERE_HERE,
  ANOTHER_BRICK_IN_THE_WALL,
  LIGHT_MY_FIRE,
  RIDERS_ON_THE_STORM,
  PEOPLE_ARE_STRANGE,
  LIKE_A_ROLLING_STONE,
  KNOCKIN_ON_HEAVENS_DOOR,
  BLOWIN_IN_THE_WIND,
  BORN_TO_RUN,
  DANCING_IN_THE_DARK,
  THE_RIVER,
  IS_THIS_LOVE,
  NO_WOMAN_NO_CRY,
  SABIA_LUIZ_GONZAGA,
  EU_SO_QUERO_UM_XODO,
  RIACHO_DO_NAVIO,
  DORES_DO_AMOR_ZEZO,
  GARCON_REGINALDO_ROSSI,
  A_RAPOSA_E_AS_UVAS,
  LEVIANA_BARTO_GALENO,
};

const EXTENDED_OWN_SONGS: RepertoireSong[] = [
  THREE_LITTLE_BIRDS,
  XOTE_DAS_MENINAS,
  DIGA_PRA_MIM_ZEZO,
  PORQUE_ELE_VIVE,
  DONA_ROUPA_NOVA,
  EVERY_BREATH_YOU_TAKE,
  // Pink Floyd
  COMFORTABLY_NUMB,
  WISH_YOU_WERE_HERE,
  ANOTHER_BRICK_IN_THE_WALL,
  // The Doors
  LIGHT_MY_FIRE,
  RIDERS_ON_THE_STORM,
  PEOPLE_ARE_STRANGE,
  // Bob Dylan
  LIKE_A_ROLLING_STONE,
  KNOCKIN_ON_HEAVENS_DOOR,
  BLOWIN_IN_THE_WIND,
  // Bruce Springsteen
  BORN_TO_RUN,
  DANCING_IN_THE_DARK,
  THE_RIVER,
  // Bob Marley
  IS_THIS_LOVE,
  NO_WOMAN_NO_CRY,
  // Xote & Baião
  SABIA_LUIZ_GONZAGA,
  EU_SO_QUERO_UM_XODO,
  RIACHO_DO_NAVIO,
  // Zezo & Seresta / Brega
  DORES_DO_AMOR_ZEZO,
  GARCON_REGINALDO_ROSSI,
  A_RAPOSA_E_AS_UVAS,
  LEVIANA_BARTO_GALENO,
];

export const EXTENDED_REPERTOIRE_SONGS: RepertoireSong[] = [
  ...EXTENDED_OWN_SONGS,
  ...WORLD_FOLK_SONGS,
  ...PSYCHEDELIC_ROCK_SONGS,
];
