/**
 * repertoireLyricEnricher.ts
 *
 * Serviço de Enriquecimento Retroativo do Repertório.
 *
 * Responsabilidade:
 *  - Receber um RepertoireSong (com scoreTrack e extension.lyrics legado)
 *  - Produzir um array de EnrichedLyricLine via lyricEnrichmentEngine
 *  - Determinar o syncLevel adequado para a música
 *  - Não modificar o arquivo original da música — retorna dados derivados
 *
 * Estratégia por tipo de música:
 *  - VOCAL simples (folk, hinos, cirandas):     proportional → synchronized
 *  - VOCAL complexo (rock, pop):                equal → partial
 *  - INSTRUMENTAL (Bach, Chopin, Mozart, etc.): unavailable
 *  - Licença bloqueada:                         text_only (exibe mas não sincroniza)
 *
 * Uso:
 *  - RepertoireView: enriquece on-the-fly ao carregar a música
 *  - ScoreLyricsStrip: recebe EnrichedLyricLine[] ou LyricLine[]
 *  - Prática: acessa syllable.noteRef para sincronização exata
 */

import type { RepertoireSong } from './repertoireData';
import type { ScoreNote } from './coursesData';
import {
  enrichLyrics,
  enrichFromLyricLines,
} from './lyricEnrichmentEngine';
import type {
  EnrichedLyricLine,
  LyricEnrichmentResult,
} from './lyricSyllableTypes';

/** Nivel de sincronizacao de letra. Espelho do syncLevel em LyricEnrichmentResult. */
export type LyricSyncLevel = LyricEnrichmentResult['syncLevel'];

// ─── Músicas classificadas como instrumentais (sem letra por natureza) ──────────

const INSTRUMENTAL_IDS = new Set([
  'fur-elise',
  'canon-in-d',
  'prelude-c-major-bach',
  'prelude-c-bach',
  'sonata-k545-mozart',
  'chopin-prelude-e-minor',
  'tico-tico-no-fuba',    // instrumental tradicional
  'aquarela-do-brasil',   // versão instrumental no repertório
]);

// ─── Músicas com letra bloqueada (direitos autorais restritivos) ─────────────

const BLOCKED_LICENSE_IDS = new Set<string>([
  // Nenhuma no momento — as licenças creative_commons permitem uso didático.
  // Adicionar aqui se necessário no futuro.
]);

// ─── Músicas simples onde a associação 1:1 nota-sílaba é confiável ───────────

const SIMPLE_VOCAL_IDS = new Set([
  'ciranda-cirandinha',
  'peixe-vivo',
  'cai-cai-balao',
  'amazing-grace',
  'three-little-birds',
  'bella-ciao',
  'guantanamera',
  'greensleeves',
  'asa-branca',
  'ode-to-joy',
  'knockin-on-heavens-door',
  'no-woman-no-cry',
  'porque-ele-vive',
  'rude-cruz',
  'grandioso-es-tu',
  'sabia-luiz-gonzaga',
  'xote-das-meninas',
  'diga-pra-mim-zezo',
  'eu-so-quero-um-xodo',
  'riacho-do-navio',
  'dores-do-amor-zezo',
  'garcon-reginaldo-rossi',
  'a-raposa-e-as-uvas',
  'leviana-barto-galeno',
  'is-this-love',
  'blowin-in-the-wind',
  'riders-on-the-storm',
  'wish-you-were-here',
  'the-river',
  'dona-roupa-nova',
  'linda-demais',
  'garota-de-ipanema',
  'let-it-be',
  'every-breath-you-take',
  'like-a-rolling-stone',
  'house-of-the-rising-sun',
  'el-condor-pasa',
  'hasta-siempre',
  'people-are-strange',
  'another-brick-in-the-wall',
  'light-my-fire',
  'born-to-run',
  'dancing-in-the-dark',
  'comfortably-numb',
  'take-on-me',
  'bohemian-rhapsody',
]);

// ─── Letras das músicas que não possuem extension.lyrics ────────────────────

/**
 * Banco de letras complementares para músicas sem `extension.lyrics`.
 * Cada entrada usa hifenização silábica explícita nas palavras polissílabas.
 */
const LYRIC_BANK: Record<string, string[]> = {
  'amazing-grace': [
    '[Verso 1]\nA-ma-zing grace, how sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.',
    '[Verso 2]\n\'Twas grace that taught my heart to fear,\nAnd grace my fears re-lieved;\nHow pre-cious did that grace ap-pear\nThe hour I first be-lieved!',
  ],
  'greensleeves': [
    '[Verso]\nA-las, my love, you do me wrong\nTo cast me off dis-cour-te-ous-ly;\nFor I have loved you so long,\nDe-light-ing in your com-pa-ny.',
    '[Refrão]\nGreen-sleeves was all my joy,\nGreen-sleeves was my de-light;\nGreen-sleeves was my heart of gold,\nAnd who but my la-dy Green-sleeves.',
  ],
  'bella-ciao': [
    '[Verso 1]\nU-na mat-ti-na mi son sve-glia-to,\no bel-la, cia-o, bel-la, cia-o, bel-la, cia-o, cia-o, cia-o,\nu-na mat-ti-na mi son sve-glia-to,\ne ho tro-va-to l\'in-va-sor.',
  ],
  'guantanamera': [
    '[Refrão]\nGuan-ta-na-me-ra, gua-ji-ra guan-ta-na-me-ra,\nGuan-ta-na-me-ra, gua-ji-ra guan-ta-na-me-ra.',
    '[Verso]\nYo soy un hom-bre sin-ce-ro,\nDe don-de cre-cen las pal-mas;\nY an-tes de mo-rir-me quie-ro,\nE-char mis ver-sos del al-ma.',
  ],
  'el-condor-pasa': [
    '[Verso]\nI\'d ra-ther be a spar-row than a snail,\nYes I would, if I could, I sure-ly would.',
    '[Refrão]\nA-way, I\'d ra-ther sail a-way,\nLi-ke a swan that\'s here and gone;',
  ],
  'house-of-the-rising-sun': [
    '[Verso 1]\nThere is a house in New Or-leans\nThey call the Ri-sing Sun,\nAnd it\'s been the ru-in of ma-ny a poor boy,\nAnd God, I know I\'m one.',
  ],
  'people-are-strange': [
    '[Verso]\nPeo-ple are stran-ge when you\'re a stran-ger,\nFa-ces look ug-ly when you\'re a-lone;\nWo-men seem wic-ked when you\'re un-wan-ted,\nStreets are u-ne-ven when you\'re down.',
  ],
  'another-brick-in-the-wall': [
    '[Refrão]\nWe don\'t need no e-du-ca-tion,\nWe don\'t need no thought con-trol,\nNo dark sar-casm in the class-room,\nTea-cher, leave them kids a-lone!',
  ],
  'light-my-fire': [
    '[Verso]\nYou know that it would be un-true,\nYou know that I would be a li-ar,\nIf I was to say to you,\nGirl, we could-n\'t get much high-er.',
    '[Refrão]\nCome on ba-by, light my fire!\nCome on ba-by, light my fire!\nTry to set the night on fi-re!',
  ],
  'riders-on-the-storm': [
    '[Verso]\nRi-ders on the storm,\nRi-ders on the storm,\nIn-to this house we\'re born,\nIn-to this world we\'re thrown.',
  ],
  'comfortably-numb': [
    '[Verso]\nHel-lo? Is there a-ny-bo-dy in there?\nJust nod if you can hear me.\nIs there a-ny-one at home?',
    '[Refrão]\nThere is no pain, you are re-ce-ding,\nA dis-tant ship\'s smoke on the ho-ri-zon.',
  ],
  'wish-you-were-here': [
    '[Verso]\nSo, so you think you can tell\nHea-ven from hell, blue skies from pain;\nCan you tell a green field\nFrom a cold steel rail?',
    '[Refrão]\nHow I wish, how I wish you were here;\nWe\'re just two lost souls swim-ming in a fish bowl,\nYear af-ter year.',
  ],
  'like-a-rolling-stone': [
    '[Verso]\nOnce u-pon a time you dressed so fine,\nThrew the bums a dime in your prime, did-n\'t you?',
    '[Refrão]\nHow does it feel, how does it feel\nTo be on your own, with no di-rec-tion home,\nA com-plete un-known, like a rol-ling stone?',
  ],
  'born-to-run': [
    '[Verso]\nIn the day we sweat it out on the streets\nOf a ru-na-way A-me-ri-can dream.',
    '[Refrão]\nBa-by, we were born to run!',
  ],
  'dancing-in-the-dark': [
    '[Verso]\nI get up in the eve-ning, and I ain\'t got no-thing to say,\nI come home in the mor-ning, I go to bed feel-ing the same way.',
    '[Refrão]\nYou can\'t start a fire, you can\'t start a fire with-out a spark,\nThis gun\'s for hire, e-ven if we\'re just dan-cing in the dark.',
  ],
  'the-river': [
    '[Verso]\nI come from down in the val-ley where mis-ter, when you\'re young,\nThey bring you up to do li-ke your dad-dy done.',
  ],
  'take-on-me': [
    '[Verso]\nTal-king a-way, I don\'t know what I\'m to say,\nI\'ll say it a-ny-way, to-day\'s a-no-ther day to find you,\nShying a-way.',
    '[Refrão]\nTake on me! Take on me!\nTake me on! Take on me!\nI\'ll be gone, in a day or two!',
  ],
  'bohemian-rhapsody': [
    '[Intro]\nIs this the real life? Is this just fan-ta-sy?\nCaught in a land-slide, no es-cape from re-a-li-ty.',
    '[Verso]\nMa-ma, just killed a man,\nPut a gun a-gainst his head, pulled my trig-ger, now he\'s dead.',
    '[Refrão]\nWe will, we will rock you!\nWe will, we will rock you!',
  ],
  'every-breath-you-take': [
    '[Verso]\nEv-ery breath you take, ev-ery move you make,\nEv-ery bond you break, ev-ery step you take,\nI\'ll be watch-ing you.',
    '[Refrão]\nOh, can\'t you see, you be-long to me?\nHow my poor heart aches with ev-ery step you take.',
  ],
};

// ─── Função Principal de Enriquecimento ─────────────────────────────────────

export interface RepertoireLyricEnrichmentResult {
  songId: string;
  syncLevel: LyricSyncLevel;
  enrichedLines: EnrichedLyricLine[];
  totalSyllables: number;
  resolvedSyllables: number;
  unresolvedSyllables: number;
}

/**
 * Enriquece a letra de uma música do repertório, associando sílabas a notas.
 *
 * Lógica de prioridade:
 * 1. Se a música é instrumental → unavailable
 * 2. Se a música tem licença bloqueada → text_only via enrichFromLyricLines
 * 3. Se há `enrichedLyrics` já presentes → retorna como está
 * 4. Se há `extension.lyrics` → enriquece com lyricEnrichmentEngine
 * 5. Se há texto no LYRIC_BANK → enriquece com lyricEnrichmentEngine
 * 6. Caso contrário → unavailable
 */
export function enrichRepertoireSong(song: RepertoireSong): RepertoireLyricEnrichmentResult {
  const songId = song.id;

  // 1. Instrumental
  if (INSTRUMENTAL_IDS.has(songId)) {
    return emptyResult(songId, 'unavailable');
  }

  // 2. Licença bloqueada
  if (BLOCKED_LICENSE_IDS.has(songId)) {
    if (song.extension?.lyrics && song.extension.lyrics.length > 0) {
      const result = enrichFromLyricLines(song.extension.lyrics, {
        type: 'manual', validated: false, description: 'Licença restritiva — text_only',
      });
      return {
        songId,
        syncLevel: 'text_only',
        enrichedLines: result.lines,
        totalSyllables: result.totalSyllables,
        resolvedSyllables: 0,
        unresolvedSyllables: result.totalSyllables,
      };
    }
    return emptyResult(songId, 'unavailable');
  }

  // 3. Já enriquecido
  if (song.extension?.enrichedLyrics && song.extension.enrichedLyrics.length > 0) {
    const lines = song.extension.enrichedLyrics;
    const total = lines.reduce((s, l) => s + l.syllables.length, 0);
    const resolved = lines.reduce((s, l) => s + l.syllables.filter(sy => sy.state === 'confirmed' || sy.state === 'inferred').length, 0);
    const syncRatio = total > 0 ? resolved / total : 0;
    const syncLevel: LyricSyncLevel = syncRatio >= 0.9 ? 'synchronized' : syncRatio >= 0.5 ? 'partial' : 'text_only';
    return {
      songId,
      syncLevel,
      enrichedLines: lines,
      totalSyllables: total,
      resolvedSyllables: resolved,
      unresolvedSyllables: total - resolved,
    };
  }

  // Filtra apenas notas de sol (treble) para associação de letra
  const trebleNotes = song.scoreTrack.filter(
    (n): n is ScoreNote => n.clef === 'treble' && typeof n.beat === 'number'
  );

  // Parse da fórmula de compasso
  const timeSig = song.timeSignature || '4/4';
  const bpmParts = timeSig.split('/');
  const beatsPerMeasure = parseInt(bpmParts[0], 10) || 4;

  const isSimple = SIMPLE_VOCAL_IDS.has(songId);
  const strategy = isSimple ? 'proportional' : 'equal';

  // 4. Tem extension.lyrics legado
  if (song.extension?.lyrics && song.extension.lyrics.length > 0) {
    // Reconstrói o texto a partir das linhas legadas para enriquecimento
    const rawText = song.extension.lyrics
      .map(l => {
        const prefix = l.lineType ? `[${lineTypeLabel(l.lineType)}]\n` : '';
        return prefix + l.text;
      })
      .join('\n');

    const result = enrichLyrics({
      rawText,
      scoreNotes: trebleNotes,
      config: {
        beatsPerMeasure,
        distributionStrategy: strategy,
        trebleOnlyAssociation: true,
        markUnresolvedAsPending: !isSimple,
      },
      source: {
        type: 'manual',
        validated: true,
        description: `Enriquecido a partir do texto legado de ${song.title}`,
      },
    });

    return {
      songId,
      syncLevel: result.syncLevel,
      enrichedLines: result.lines,
      totalSyllables: result.totalSyllables,
      resolvedSyllables: result.resolvedSyllables,
      unresolvedSyllables: result.unresolvedSyllables,
    };
  }

  // 5. Banco de letras complementar
  const bankTexts = LYRIC_BANK[songId];
  if (bankTexts && bankTexts.length > 0) {
    const rawText = bankTexts.join('\n\n');
    const result = enrichLyrics({
      rawText,
      scoreNotes: trebleNotes,
      config: {
        beatsPerMeasure,
        distributionStrategy: strategy,
        trebleOnlyAssociation: true,
        markUnresolvedAsPending: !isSimple,
      },
      source: {
        type: 'manual',
        validated: false,
        description: `Letra obtida do banco complementar para ${song.title}`,
      },
    });

    return {
      songId,
      syncLevel: result.syncLevel,
      enrichedLines: result.lines,
      totalSyllables: result.totalSyllables,
      resolvedSyllables: result.resolvedSyllables,
      unresolvedSyllables: result.unresolvedSyllables,
    };
  }

  // 6. Sem dados disponíveis
  return emptyResult(songId, 'unavailable');
}

/**
 * Enriquece todas as músicas de um catálogo de uma vez.
 * Útil para pré-computar e cachear os dados enriquecidos.
 */
export function enrichAllSongs(
  songs: RepertoireSong[]
): Map<string, RepertoireLyricEnrichmentResult> {
  const results = new Map<string, RepertoireLyricEnrichmentResult>();
  for (const song of songs) {
    results.set(song.id, enrichRepertoireSong(song));
  }
  return results;
}

/**
 * Retorna um resultado vazio com o syncLevel especificado.
 */
function emptyResult(songId: string, syncLevel: LyricSyncLevel): RepertoireLyricEnrichmentResult {
  return { songId, syncLevel, enrichedLines: [], totalSyllables: 0, resolvedSyllables: 0, unresolvedSyllables: 0 };
}

/**
 * Converte o lineType do LyricLine para o label de seção usado no parser de texto.
 */
function lineTypeLabel(lineType: string): string {
  const map: Record<string, string> = {
    verse: 'Verso',
    chorus: 'Refrão',
    bridge: 'Ponte',
    intro: 'Introdução',
    outro: 'Coda',
    instrumental: 'Instrumental',
  };
  return map[lineType] ?? lineType;
}

// ─── Hook de Cache por Sessão ────────────────────────────────────────────────

let _cache: Map<string, RepertoireLyricEnrichmentResult> | null = null;

/**
 * Retorna o resultado de enriquecimento de uma música, usando cache de sessão.
 * Evita reprocessar o mesmo conjunto de notas repetidamente.
 */
export function getCachedEnrichment(
  song: RepertoireSong,
  allSongs?: RepertoireSong[]
): RepertoireLyricEnrichmentResult {
  // Se chamado com a lista completa, popula o cache antecipadamente
  if (allSongs && !_cache) {
    _cache = enrichAllSongs(allSongs);
  }

  if (_cache?.has(song.id)) {
    return _cache.get(song.id)!;
  }

  const result = enrichRepertoireSong(song);
  if (!_cache) _cache = new Map();
  _cache.set(song.id, result);
  return result;
}

/** Limpa o cache de enriquecimento (útil após importação de novos dados). */
export function clearEnrichmentCache(): void {
  _cache = null;
}
