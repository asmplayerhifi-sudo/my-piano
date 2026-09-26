/**
 * repertoireDataExtended.ts
 * Barrel e agregador central de todo o repertório estendido da aplicação.
 *
 * Cada música do catálogo estendido está em src/core/songs/.
 * Este arquivo:
 *   1. Importa os arrays dos catálogos especializados (World, Psych e Expansão).
 *   2. Importa individualmente cada música do catálogo estendido.
 *   3. Aplica a ordenação cronológica rigorosa (sortScoreTrack) e atribui o auditStatus.
 *   4. Exporta EXTENDED_REPERTOIRE_SONGS com todo o repertório unificado e auditado.
 */

import type { RepertoireSong } from './repertoireData';
import { sortScoreTrack } from './repertoireTypes';
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

// ─── NOVAS OBRAS DE AMPLIAÇÃO DO REPERTÓRIO (Auditoria & Enriquecimento) ───
// Gospel Clássico & Hinos Sacros
import { AMAZING_GRACE } from './songs/amazingGrace';
import { GRANDIOSO_ES_TU } from './songs/grandiosoEsTu';
import { RUDE_CRUZ } from './songs/rudeCruz';

// Clássico & Grandes Mestres
import { PRELUDE_C_MAJOR_BACH } from './songs/preludeCMajorBach';
import { SONATA_K545_MOZART } from './songs/sonataK545Mozart';
import { CHOPIN_PRELUDE_E_MINOR } from './songs/chopinPreludeEMinor';

// MPB & Choro Brasileiro
import { TICO_TICO_NO_FUBA } from './songs/ticoTicoNoFuba';
import { AQUARELA_DO_BRASIL } from './songs/aquarelaDoBrasil';

// Internacional & Folk Universal
import { GREENSLEEVES } from './songs/greensleeves';
import { HOUSE_OF_THE_RISING_SUN } from './songs/houseOfTheRisingSun';

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
  // Novas Obras
  AMAZING_GRACE,
  GRANDIOSO_ES_TU,
  RUDE_CRUZ,
  PRELUDE_C_MAJOR_BACH,
  SONATA_K545_MOZART,
  CHOPIN_PRELUDE_E_MINOR,
  TICO_TICO_NO_FUBA,
  AQUARELA_DO_BRASIL,
  GREENSLEEVES,
  HOUSE_OF_THE_RISING_SUN,
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

const NEW_EXPANSION_SONGS: RepertoireSong[] = [
  // Gospel Clássico & Hinos Sacros
  AMAZING_GRACE,
  GRANDIOSO_ES_TU,
  RUDE_CRUZ,
  // Clássico & Grandes Mestres
  PRELUDE_C_MAJOR_BACH,
  SONATA_K545_MOZART,
  CHOPIN_PRELUDE_E_MINOR,
  // MPB & Choro Brasileiro
  TICO_TICO_NO_FUBA,
  AQUARELA_DO_BRASIL,
  // Internacional & Folk Universal
  GREENSLEEVES,
  HOUSE_OF_THE_RISING_SUN,
];

const RAW_EXTENDED_CATALOG: RepertoireSong[] = [
  ...EXTENDED_OWN_SONGS,
  ...NEW_EXPANSION_SONGS,
  ...WORLD_FOLK_SONGS,
  ...PSYCHEDELIC_ROCK_SONGS,
];

/**
 * Catálogo estendido com garantia de ordenação cronológica rigorosa e estado de auditoria.
 */
export const EXTENDED_REPERTOIRE_SONGS: RepertoireSong[] = RAW_EXTENDED_CATALOG.map((song) => ({
  ...song,
  auditStatus: song.auditStatus || 'CORRECTED',
  scoreTrack: sortScoreTrack(song.scoreTrack, song.timeSignature),
}));
