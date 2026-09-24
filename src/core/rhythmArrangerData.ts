// ─────────────────────────────────────────────────────────────────────────────
// Dados de Arranjos e Ritmos — Baseado na Coleção PSR-E433
// ─────────────────────────────────────────────────────────────────────────────

export type SectionId = 'intro' | 'mainA' | 'fillAA' | 'mainB' | 'fillBB' | 'ending';

export interface DrumStep {
  /** 16 passos booleanos (1 compasso 4/4 em semicolcheias) */
  steps: boolean[];
  /** Velocidade por passo (0–127) */
  velocity?: number[];
}

export interface DrumPattern {
  kick: DrumStep;
  snare: DrumStep;
  hihatClosed: DrumStep;
  hihatOpen: DrumStep;
  clap: DrumStep;
  tomHigh: DrumStep;
  tomMid: DrumStep;
  tomFloor: DrumStep;
  rimshot: DrumStep;
  cowbell: DrumStep;
  triangle: DrumStep;
  agogo: DrumStep;
  shaker: DrumStep;
  tambourine: DrumStep;
}

export interface ArrangementSection {
  id: SectionId;
  label: string;
  emoji: string;
  pattern: DrumPattern;
  tempoMultiplier: number;
  bars: number;
}

export interface RhythmStyle {
  id: string;
  name: string;
  category: string;
  bpm: number;
  timeSignature: '4/4' | '3/4' | '6/8';
  genre: string;
  description: string;
  referenceArtist?: string;
  sections: Record<SectionId, ArrangementSection>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyStep(): DrumStep { return { steps: Array(16).fill(false) }; }

function emptyPattern(): DrumPattern {
  return {
    kick: emptyStep(), snare: emptyStep(), hihatClosed: emptyStep(),
    hihatOpen: emptyStep(), clap: emptyStep(), tomHigh: emptyStep(),
    tomMid: emptyStep(), tomFloor: emptyStep(), rimshot: emptyStep(),
    cowbell: emptyStep(), triangle: emptyStep(), agogo: emptyStep(),
    shaker: emptyStep(), tambourine: emptyStep(),
  };
}

function steps(...positions: number[]): DrumStep {
  const s: boolean[] = Array(16).fill(false);
  positions.forEach(p => { s[p] = true; });
  return { steps: s };
}

function stepsVel(data: Array<[number, number]>): DrumStep {
  const s: boolean[] = Array(16).fill(false);
  const v: number[] = Array(16).fill(80);
  data.forEach(([p, vel]) => { s[p] = true; v[p] = vel; });
  return { steps: s, velocity: v };
}

function makeSection(
  id: SectionId, label: string, emoji: string,
  pattern: Partial<DrumPattern>, tempoMultiplier = 1.0, bars = 2,
): ArrangementSection {
  return { id, label, emoji, pattern: { ...emptyPattern(), ...pattern }, tempoMultiplier, bars };
}

// ─── Padrões Base ────────────────────────────────────────────────────────────

const P = {
  rock44: (): Partial<DrumPattern> => ({
    kick: steps(0, 8),
    snare: steps(4, 12),
    hihatClosed: steps(0, 2, 4, 6, 8, 10, 12, 14),
  }),
  forro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 110], [6, 80], [8, 110], [14, 80]]),
    snare: steps(3, 11),
    hihatClosed: steps(0, 4, 8, 12),
    triangle: steps(0, 2, 4, 6, 8, 10, 12, 14),
    rimshot: steps(3, 7, 11, 15),
  }),
  baiao: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 115], [3, 70], [8, 115], [11, 70]]),
    snare: steps(5, 13),
    triangle: steps(0, 2, 4, 6, 8, 10, 12, 14),
    rimshot: steps(3, 7, 11, 15),
    tambourine: steps(0, 4, 8, 12),
  }),
  reggae: (): Partial<DrumPattern> => ({
    kick: steps(8),
    snare: stepsVel([[8, 115]]),
    hihatClosed: steps(0, 4, 8, 12),
    hihatOpen: steps(2, 6, 10, 14),
    rimshot: steps(4, 12),
  }),
  xote: (): Partial<DrumPattern> => ({
    kick: steps(0, 8),
    snare: steps(4, 12),
    hihatClosed: steps(0, 2, 4, 6, 8, 10),
    triangle: steps(0, 2, 4, 6, 8, 10, 12, 14),
    tambourine: steps(2, 6, 10, 14),
  }),
  piseiro: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 90], [8, 120], [11, 90]]),
    snare: steps(4, 12),
    clap: steps(2, 6, 10, 14),
    hihatClosed: steps(0, 2, 4, 6, 8, 10, 12, 14),
    hihatOpen: steps(6, 14),
  }),
  arrocha: (): Partial<DrumPattern> => ({
    kick: steps(0, 3, 8, 11),
    snare: steps(4, 12),
    hihatClosed: steps(0, 2, 4, 6, 8, 10, 12, 14),
    tambourine: steps(2, 6, 10, 14),
    rimshot: steps(4, 12),
  }),
  rock80s: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [3, 80], [8, 120], [11, 80]]),
    snare: stepsVel([[4, 110], [12, 110]]),
    hihatClosed: steps(0, 2, 4, 6, 8, 10, 12, 14),
    hihatOpen: steps(7, 15),
  }),
  boogie: (): Partial<DrumPattern> => ({
    kick: stepsVel([[0, 120], [5, 85], [8, 110], [13, 85]]),
    snare: stepsVel([[4, 110], [12, 110]]),
    hihatClosed: stepsVel([[0,100],[2,70],[4,100],[6,70],[8,100],[10,70],[12,100],[14,70]]),
    rimshot: steps(2, 6, 10, 14),
  }),
  guarania: (): Partial<DrumPattern> => ({
    kick: steps(0, 6),
    snare: steps(4, 10),
    hihatClosed: steps(0, 2, 4, 6, 8, 10),
    tambourine: steps(2, 6, 10),
  }),
  bandinha: (): Partial<DrumPattern> => ({
    kick: steps(0, 4, 8, 12),
    snare: steps(2, 6, 10, 14),
    hihatClosed: steps(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15),
    cowbell: steps(0, 4, 8, 12),
  }),
};

function variantB(base: Partial<DrumPattern>): Partial<DrumPattern> {
  return {
    ...base,
    tomHigh: steps(13, 14),
    tomMid: steps(14, 15),
    tomFloor: steps(15),
  };
}

function makeStyle(
  id: string, name: string, category: string, bpm: number,
  timeSignature: '4/4' | '3/4' | '6/8', genre: string, description: string,
  base: () => Partial<DrumPattern>, referenceArtist?: string,
): RhythmStyle {
  const A = base();
  const B = variantB(A);
  return {
    id, name, category, bpm, timeSignature, genre, description, referenceArtist,
    sections: {
      intro:  makeSection('intro',  'Intro',    '🎬', { ...A, kick: steps(0, 4, 8, 12) }, 1.0, 1),
      mainA:  makeSection('mainA',  'Main A',   '🅰️', A, 1.0, 2),
      fillAA: makeSection('fillAA', 'Fill A→A', '⚡', { ...A, tomHigh: steps(12,13), tomMid: steps(14), tomFloor: steps(15) }, 1.0, 1),
      mainB:  makeSection('mainB',  'Main B',   '🅱️', B, 1.0, 2),
      fillBB: makeSection('fillBB', 'Fill B→B', '🔥', { ...B, snare: steps(3,7,11,15) }, 1.0, 1),
      ending: makeSection('ending', 'Ending',   '🏁', { ...A, kick: steps(0,4,8,12,13,14,15) }, 1.0, 1),
    },
  };
}

export const RHYTHM_STYLES: RhythmStyle[] = [
  makeStyle('BRASAS_FORRO',   'Brasas do Forró',      'Forró',      118, '4/4', 'Forró Tradicional',  'Forró puxado no acordeon com zabumba marcante', P.forro, 'Mastruz com Leite'),
  makeStyle('BONDE_BRASIL',   'Bonde do Brasil',      'Forró',      114, '4/4', 'Forró Romântico',    'Forró romântico de teclado', P.forro),
  makeStyle('BONDEFOR',       'Bonde do Forró',       'Forró',      116, '4/4', 'Forró Bregado',      'Bregado dançante com pisada forte', P.forro),
  makeStyle('CAMISA_SUADA',   'Camisa Suada',         'Forró',      120, '4/4', 'Forró das Antigas',  'Forró clássico com gosto de sanfona', P.forro, 'Mastruz com Leite'),
  makeStyle('FLAVIO_JOSE',    'Flávio José',          'Forró',      118, '4/4', 'Forró Nordestino',   'Clássico autêntico de Flávio José', P.forro, 'Flávio José'),
  makeStyle('FORROSER',       'Forró Sertanejo',      'Forró',      120, '4/4', 'Forró Sertanejo',    'Forró sertanejo dançante', P.forro),
  makeStyle('FORRO_NATAN',    'Forró Natan',          'Forró',      128, '4/4', 'Forró Moderno',      'Forró moderno de paredão', P.forro),
  makeStyle('FORRO_PEGADO',   'Forró Pegado',         'Forró',      132, '4/4', 'Forró Rápido',       'Pegada rápida de forró animado', P.forro),
  makeStyle('ARRASTA_PE',     'Arrasta-Pé',           'Forró',      124, '4/4', 'Quadrilha',          'Arrasta-pé festivo e quadrilhas', P.forro),
  makeStyle('CATCHACA',       'Cachaça',              'Forró',      118, '4/4', 'Forró Balançado',    'Pisada e forró balançado', P.forro),

  makeStyle('PISEIRO_BAROES', 'Barões Show',          'Piseiro',    138, '4/4', 'Piseiro',            'Kick seco e clap, baixo synth punchy, teclado staccato e sanfona', P.piseiro, 'Barões da Pisadinha'),
  makeStyle('PISEIRO_VAQUEJ', 'Vaquejada',            'Piseiro',    142, '4/4', 'Piseiro Galopado',   'Levada galopada estilo João Gomes / Vaquejada de arena', P.piseiro, 'João Gomes'),
  makeStyle('PISADINHA_MOD',  'Pisadinha Moderna',    'Piseiro',    138, '4/4', 'Piseiro de Paredão', 'Piseiro de paredão com viradas secas', P.piseiro),

  makeStyle('DEO_SERESTEIRO', 'Déo Seresteiro',       'Seresta',    100, '4/4', 'Seresta',            'Seresta tradicional de barzinho com toms marcantes', P.arrocha),
  makeStyle('ARROCHA_V',      'Arrocha',              'Seresta',    104, '4/4', 'Arrocha',            'Arrocha romântico dançante', P.arrocha),
  makeStyle('BREGA',          'Brega Clássico',       'Seresta',    100, '4/4', 'Brega',              'Brega clássico brasileiro', P.arrocha),
  makeStyle('BREGA_LIGHT',    'Brega Light',          'Seresta',     96, '4/4', 'Brega Suave',        'Brega suave e romântico', P.arrocha),
  makeStyle('GARCON',         'Garçom (R. Rossi)',    'Seresta',     98, '4/4', 'Brega Clássico',     'O hino do brega de Reginaldo Rossi', P.arrocha, 'Reginaldo Rossi'),
  makeStyle('SERESTA_NOITE',  'Seresta da Noite',     'Seresta',    102, '4/4', 'Seresta',            'A levada clássica da noite nordestina', P.arrocha),

  makeStyle('ZEZO_SERESTA',   'Zezo — Seresta Show',  'Zezo',       106, '4/4', 'Seresta de Teclado', 'Piano DX7 nos contratempos, baixo dedilhado e sax', P.arrocha, 'Zezo dos Teclados'),
  makeStyle('ZEZO_BOLERO',    'Zezo — Bolero',        'Zezo',       106, '4/4', 'Bolero Seresteiro',  'Bolero seresteiro marcante e emotivo', P.arrocha, 'Zezo dos Teclados'),
  makeStyle('ARROCHA_ZEZO',   'Arrocha Seresteiro',   'Zezo',       104, '4/4', 'Arrocha Seresta',    'Arrocha seresteiro apaixonado ao estilo Zezo', P.arrocha, 'Zezo dos Teclados'),

  makeStyle('BAIAO_GONZAGA',  'Baião Luiz Gonzaga',   'Baião',      112, '4/4', 'Baião Clássico',     'Zabumba sincopada, triângulo corrido e sanfona oitavada', P.baiao, 'Luiz Gonzaga'),
  makeStyle('BAIAO_PE_SERRA', 'Baião Pé de Serra',    'Baião',      112, '4/4', 'Baião Nordestino',   'Baião tradicional de Pernambuco', P.baiao),
  makeStyle('ARRASTA_QUADRI', 'Arrasta-Pé Quadrilha', 'Baião',      118, '4/4', 'Quadrilha',          'Arrasta-pé animado de quadrilha', P.baiao),

  makeStyle('XOTE_PE_SERRA',  'Xote Pé de Serra',     'Xote',        84, '4/4', 'Xote Nordestino',    'Cadência de Dominguinhos com triângulo suave e sanfona dengosa', P.xote, 'Dominguinhos'),
  makeStyle('XOTE_UNIVERSI',  'Xote Universitário',   'Xote',        84, '4/4', 'Xote Alegre',        'Xote alegre com violão de aço batido e acordeon', P.xote),
  makeStyle('FLAVIO_JOSE_X',  'Xote Flávio José',     'Xote',        86, '4/4', 'Xote Clássico',      'O legítimo toque nordestino de Flávio José', P.xote, 'Flávio José'),

  makeStyle('CLASSIC_ROCK',   'Classic Rock 80s',     'Rock',       124, '4/4', 'Rock Clássico',      'Rock 4/4 direto com power chords e baixo palhetado pulsante', P.rock80s),
  makeStyle('HARD_ROCK',      'Hard Rock Groove',     'Rock',       124, '4/4', 'Hard Rock',          'Rock pesado com guitarras distorcidas dobradas e órgão de rock', P.rock80s),
  makeStyle('POP_ROCK_BALAD', 'Pop Rock Ballad',      'Rock',        95, '4/4', 'Balada Rock',        'Balada pop rock com violão, piano e cordas crescentes', P.rock44),

  makeStyle('DOORS_LMF',      'Light My Fire',        'Doors',      126, '4/4', 'Psicodélico',        'Órgão Vox Continental e bateria latina/jazz de John Densmore', P.boogie, 'The Doors'),
  makeStyle('DOORS_ORGAN',    'Organ Rock',           'Doors',      126, '4/4', 'Rock Modal',         'Levada hipnótica modal com clímax de solo no Main B', P.boogie, 'The Doors'),
  makeStyle('DOORS_ROADHOUS', 'Roadhouse Blues',      'Doors',      124, '4/4', 'Blues Shuffle',      'Shuffle blues cru com piano barrelhouse e riff de guitarra clássico', P.boogie, 'The Doors'),

  makeStyle('REGGAE_ROOTS',   'One Drop Roots',       'Reggae',      76, '4/4', 'Reggae Roots',       'Autêntico One Drop jamaicano: bumbo+aro no tempo 3, skanks no 2 e 4', P.reggae, 'Bob Marley'),
  makeStyle('REGGAE_BOB',     'Bob Marley Reggae',    'Reggae',      76, '4/4', 'Roots Reggae',       'Linha de baixo melódica profunda e órgão Hammond com bubble', P.reggae, 'Bob Marley'),
  makeStyle('REGGAE_MARANH',  'Reggae Maranhão',      'Reggae',      76, '4/4', 'Reggae Brasileiro',  'Reggae de São Luís com metais marcantes', P.reggae),

  makeStyle('ELTON_CROC',     'Crocodile Rock',       'Elton John', 150, '4/4', 'Boogie-Woogie',      'Boogie-woogie acelerado no piano Honky-Tonk e walking bass', P.boogie, 'Elton John'),
  makeStyle('ELTON_YOUR',     'Your Song',            'Elton John',  72, '4/4', 'Balada Pop',         'Balada pop de piano acústico com arpejos emotivos e cordas', P.rock44, 'Elton John'),
  makeStyle('ELTON_BOOGIE',   'Boogie Piano',         'Elton John', 150, '4/4', 'Rock and Roll',      'Rock and Roll alegre com seção de metais', P.boogie, 'Elton John'),

  makeStyle('BANDAP50',       'Bandinha Baile',        'Outros',    118, '4/4', 'Bandinha',           'Bandinha de baile / Bailão animado', P.bandinha),
  makeStyle('BUGIU',          'Bugiu',                 'Outros',    100, '4/4', 'Regional Sul',       'Música regional gaúcha', P.guarania),
  makeStyle('CHAMAME',        'Chamame',               'Outros',     96, '4/4', 'Regional Sul',       'Chamamé clássico da fronteira', P.guarania),
  makeStyle('CAPRICHO',       'Capricho',              'Outros',    108, '4/4', 'Toada',              'Toada tradicional do Norte', P.arrocha),
  makeStyle('GARANTIDO',      'Garantido — Boi Bumba', 'Outros',   112, '4/4', 'Boi Bumba',          'Toada do Boi Garantido — Festival de Parintins', P.baiao),
  makeStyle('GUARANIA',       'Guarânia',              'Outros',     80, '3/4', 'Guarânia Sertaneja', 'Guarânia clássica sertaneja', P.guarania),
];

export const RHYTHM_CATEGORIES = [
  { id: 'Forró',      label: 'Forró',      emoji: '🪗', color: 'orange' },
  { id: 'Piseiro',    label: 'Piseiro',    emoji: '🥾', color: 'red' },
  { id: 'Seresta',    label: 'Seresta',    emoji: '🌹', color: 'pink' },
  { id: 'Zezo',       label: 'Zezo',       emoji: '🎹', color: 'violet' },
  { id: 'Baião',      label: 'Baião',      emoji: '🎸', color: 'yellow' },
  { id: 'Xote',       label: 'Xote',       emoji: '🩰', color: 'lime' },
  { id: 'Rock',       label: 'Rock',       emoji: '🎸', color: 'red' },
  { id: 'Doors',      label: 'The Doors',  emoji: '🚪', color: 'indigo' },
  { id: 'Reggae',     label: 'Reggae',     emoji: '🌿', color: 'green' },
  { id: 'Elton John', label: 'Elton John', emoji: '🎭', color: 'cyan' },
  { id: 'Outros',     label: 'Outros',     emoji: '🌎', color: 'slate' },
];

export interface DrumPadDef {
  key: keyof DrumPattern;
  label: string;
  shortLabel: string;
  emoji: string;
  midi: number;
  color: string;
  row: number;
  col: number;
}

export const DRUM_PADS: DrumPadDef[] = [
  { key: 'hihatOpen',   label: 'Chimbal Aberto',  shortLabel: 'HH Aberto', emoji: '🔔', midi: 46, color: 'cyan',    row: 0, col: 0 },
  { key: 'hihatClosed', label: 'Chimbal Fechado', shortLabel: 'HH',        emoji: '🥁', midi: 42, color: 'sky',     row: 0, col: 1 },
  { key: 'clap',        label: 'Clap',            shortLabel: 'Clap',      emoji: '👏', midi: 39, color: 'rose',    row: 0, col: 2 },
  { key: 'rimshot',     label: 'Rimshot',          shortLabel: 'Rim',       emoji: '🎯', midi: 37, color: 'orange',  row: 0, col: 3 },
  { key: 'tomHigh',     label: 'Tom Alto',         shortLabel: 'T.Alto',    emoji: '🎵', midi: 50, color: 'violet',  row: 0, col: 4 },
  { key: 'cowbell',     label: 'Cowbell',          shortLabel: 'Cowbell',   emoji: '🔔', midi: 56, color: 'yellow',  row: 0, col: 5 },
  { key: 'triangle',    label: 'Triângulo',        shortLabel: 'Triang.',   emoji: '△',  midi: 81, color: 'teal',    row: 1, col: 0 },
  { key: 'snare',       label: 'Caixa',            shortLabel: 'Caixa',     emoji: '🥁', midi: 38, color: 'amber',   row: 1, col: 1 },
  { key: 'tomMid',      label: 'Tom Médio',        shortLabel: 'T.Médio',   emoji: '🎶', midi: 48, color: 'purple',  row: 1, col: 2 },
  { key: 'tomFloor',    label: 'Tom de Chão',      shortLabel: 'T.Chão',    emoji: '🎸', midi: 45, color: 'indigo',  row: 1, col: 3 },
  { key: 'agogo',       label: 'Agogô',            shortLabel: 'Agogô',     emoji: '🔔', midi: 67, color: 'lime',    row: 1, col: 4 },
  { key: 'tambourine',  label: 'Pandeiro',         shortLabel: 'Pandeiro',  emoji: '🪘', midi: 54, color: 'emerald', row: 1, col: 5 },
  { key: 'kick',        label: 'Bumbo',            shortLabel: 'Bumbo',     emoji: '💥', midi: 36, color: 'red',     row: 2, col: 0 },
  { key: 'shaker',      label: 'Shaker',           shortLabel: 'Shaker',    emoji: '🎶', midi: 70, color: 'green',   row: 2, col: 1 },
];
