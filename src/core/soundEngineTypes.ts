/**
 * soundEngineTypes.ts
 * Catálogo e definições formais de famílias instrumentais, metadados e tags técnicas
 * do motor de som (Sound Engine) Harmonia.
 */

export type TimbreCategory =
  | 'pianos'
  | 'epianos_organs'
  | 'percussion'
  | 'synths_leads'
  | 'orchestra'
  | 'guitars'
  | 'bass';

export type TimbreId =
  // Pianos Acústicos
  | 'grand_piano'
  | 'upright_piano'
  | 'honky_tonk'
  // Pianos Elétricos & Órgãos
  | 'rhodes'
  | 'rhodes_suitcase'
  | 'wurlitzer'
  | 'clavinet'
  | 'organ'
  | 'vox_continental'
  | 'farfisa'
  | 'accordion'
  // Percussão Afinada
  | 'vibraphone'
  | 'marimba'
  | 'celesta'
  | 'glockenspiel'
  // Sintetizadores & Leads
  | 'minimoog_lead'
  | 'synth_lead'
  | 'dx7_epiano'
  | 'synth_pad'
  | 'synth_brass'
  | 'brass_brega'
  // Cordas & Orquestra
  | 'strings'
  | 'violin'
  | 'cello'
  | 'harp'
  | 'flute'
  // Guitarras & Violões
  | 'guitar_nylon'
  | 'guitar_7strings'
  | 'guitar_strat_clean'
  | 'guitar_strat_drive'
  | 'guitar_reggae_muted'
  | 'harpsichord'
  // Baixos
  | 'bass'
  | 'bass_finger'
  | 'bass_acoustic'
  | 'bass_synth';

export interface CategoryMetadata {
  id: TimbreCategory;
  label: string;
  shortLabel: string;
  description: string;
  color: 'indigo' | 'amber' | 'cyan' | 'purple' | 'emerald' | 'orange' | 'rose';
  iconKey: string;
}

export const TIMBRE_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'pianos',
    label: 'Pianos Acústicos',
    shortLabel: 'Pianos',
    description: 'Pianos de cauda, armário e saloon com ressonância harmônica e modelagem de pedal.',
    color: 'indigo',
    iconKey: 'piano',
  },
  {
    id: 'epianos_organs',
    label: 'Pianos Elétricos & Órgãos',
    shortLabel: 'P. Elétricos & Órgãos',
    description: 'Rhodes, Wurlitzer, Hammond B3 com Leslie, Vox Continental psicodélico e Sanfona nordestina.',
    color: 'amber',
    iconKey: 'epiano',
  },
  {
    id: 'percussion',
    label: 'Percussão Afinada',
    shortLabel: 'Percussão Afinada',
    description: 'Vibrafone com vibrato rotativo, marimba de madeira nobre, celesta e glockenspiel.',
    color: 'cyan',
    iconKey: 'vibraphone',
  },
  {
    id: 'synths_leads',
    label: 'Sintetizadores & Leads',
    shortLabel: 'Sintetizadores',
    description: 'Minimoog Model D, DX7 FM clássico, pads atmosféricos e metais pop/brega estilo Zezo.',
    color: 'purple',
    iconKey: 'synth',
  },
  {
    id: 'orchestra',
    label: 'Cordas & Orquestra',
    shortLabel: 'Cordas & Orquestra',
    description: 'String Ensemble sinfônico, violino solo expressivo, cello, harpa e flauta orquestral.',
    color: 'rose',
    iconKey: 'strings',
  },
  {
    id: 'guitars',
    label: 'Guitarras & Violões',
    shortLabel: 'Guitarras & Violões',
    description: 'Violão nylon nordestino, 7 cordas de samba, Stratocaster clean/drive e muted reggae.',
    color: 'orange',
    iconKey: 'guitar',
  },
  {
    id: 'bass',
    label: 'Baixos & Sub-Graves',
    shortLabel: 'Baixos',
    description: 'Baixo elétrico com palheta e dedos, contrabaixo acústico de jazz e sub-bass analógico Moog.',
    color: 'emerald',
    iconKey: 'bass',
  },
];

export interface TimbreDefinition {
  id: TimbreId;
  label: string;
  subtitle: string;
  category: TimbreCategory;
  emoji: string;
  iconKey: string;
  tags: string[];
  description: string;
  presetOrigin?: string;
}

export const TIMBRES: TimbreDefinition[] = [
  // ─── 1. Pianos Acústicos ─────────────────────────────────────────────────
  {
    id: 'grand_piano',
    label: 'Grand Piano',
    subtitle: 'Piano Acústico de Cauda',
    category: 'pianos',
    emoji: '🎹',
    iconKey: 'grand_piano',
    tags: ['Multi-Velocity', 'Round-Robin', 'Sustain Resonance'],
    description: 'Piano de cauda acústico de concerto com 4 parciais harmônicos, ressonância simpática de cordas e decaimento natural.',
    presetOrigin: 'Acústico de Concerto',
  },
  {
    id: 'upright_piano',
    label: 'Upright Piano',
    subtitle: 'Piano de Armário Intimista',
    category: 'pianos',
    emoji: '🎹',
    iconKey: 'upright_piano',
    tags: ['Multi-Velocity', 'Warm Body', 'Round-Robin'],
    description: 'Piano vertical com sonoridade acolhedora, presença intimista e resposta ressonante de tampo harmônico.',
    presetOrigin: 'Estúdio Intimista',
  },
  {
    id: 'honky_tonk',
    label: 'Honky-Tonk Piano',
    subtitle: 'Saloon & Ragtime Vintage',
    category: 'pianos',
    emoji: '🎹',
    iconKey: 'honky_tonk',
    tags: ['Detuned Unison', 'Tack Attack', 'Multi-Velocity'],
    description: 'Piano acústico vintage com ligeiro desafinamento em uníssono e ataque percussivo brilhante para Ragtime e Country.',
    presetOrigin: 'Vintage American Saloon',
  },

  // ─── 2. Pianos Elétricos & Órgãos ────────────────────────────────────────
  {
    id: 'rhodes',
    label: 'Rhodes Mark I/II',
    subtitle: 'Piano Elétrico Clássico',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'rhodes',
    tags: ['FM Synthesis', 'Tines Bell', 'Chorus FX', 'Multi-Velocity'],
    description: 'O clássico piano elétrico dos anos 70 com tines de aço, ataque de sino cristalino e chorus aveludado.',
    presetOrigin: 'Vintage 1975 Stage',
  },
  {
    id: 'rhodes_suitcase',
    label: 'Rhodes Suitcase',
    subtitle: 'Suitcase 73 com Pré-Amp',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'rhodes_suitcase',
    tags: ['Stereo Tremolo', 'Warm Preamp', 'Round-Robin'],
    description: 'Modelo Rhodes Suitcase com pré-amplificador quente valvulado e tremolo estéreo pulsante.',
    presetOrigin: 'Vintage 1973 Suitcase',
  },
  {
    id: 'wurlitzer',
    label: 'Wurlitzer 200A',
    subtitle: 'Palhetas Eletromecânicas',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'wurlitzer',
    tags: ['Reed Tone', 'Dynamic Drive', 'Tremolo'],
    description: 'Piano elétrico com palhetas metálicas vibrantes, drive dinâmico e saturação expressiva.',
    presetOrigin: 'Vintage 1974 Wurly',
  },
  {
    id: 'clavinet',
    label: 'Clavinet D6',
    subtitle: 'Cordas Marteladas Funky',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'clavinet',
    tags: ['Percussive Pluck', 'Filter Bite', 'Staccato'],
    description: 'Clavinet eletromecânico funkeado com ataque imediato e corte cortante de agudos estilo Stevie Wonder.',
    presetOrigin: 'Funk & Soul 1972',
  },
  {
    id: 'organ',
    label: 'Hammond B3',
    subtitle: 'Tonewheel com Leslie Rotary',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'organ_hammond',
    tags: ['Drawbars 9-Pin', 'Leslie Rotary FX', 'Key Click'],
    description: 'O lendário órgão de rodas fônicas com drawbars ajustáveis, clique percussivo de teclas e rotor Leslie estéreo.',
    presetOrigin: 'Classic Rock & Gospel',
  },
  {
    id: 'vox_continental',
    label: 'Vox Continental',
    subtitle: 'Órgão Combo Psicodélico',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'vox_continental',
    tags: ['Transistor Reed', 'Psychedelic', 'The Doors'],
    description: 'Órgão combo transistorizado dos anos 60 com timbre brilhante e rasgado, a marca registrada de The Doors e British Invasion.',
    presetOrigin: 'Rock Psicodélico 1966',
  },
  {
    id: 'farfisa',
    label: 'Farfisa Compact',
    subtitle: 'Órgão Combo Italiano',
    category: 'epianos_organs',
    emoji: '🎹',
    iconKey: 'farfisa',
    tags: ['Compact Tabs', 'Vibrato FX', 'Pink Floyd Early'],
    description: 'Órgão italiano clássico com flautas rasgadas e vibrato rápido, eternizado no psicodelismo inicial de Pink Floyd.',
    presetOrigin: 'Pink Floyd Psychedelic Era',
  },
  {
    id: 'accordion',
    label: 'Sanfona Scandalli',
    subtitle: 'Sanfona Nordestina 120 Baixos',
    category: 'epianos_organs',
    emoji: '🪗',
    iconKey: 'accordion',
    tags: ['Musette Tuned', 'Dual Reeds', 'Baião & Xote'],
    description: 'Acordeon de 120 baixos com afinação musette limpa e batimento de palhetas para Baião, Xote, Piseiro e Forró.',
    presetOrigin: 'Regional Brasileiro / Luiz Gonzaga & Dominguinhos',
  },

  // ─── 3. Percussão Afinada ────────────────────────────────────────────────
  {
    id: 'vibraphone',
    label: 'Vibrafone',
    subtitle: 'Lâminas de Alumínio & Motor',
    category: 'percussion',
    emoji: '✨',
    iconKey: 'vibraphone',
    tags: ['Rotary Motor Vibrato', 'Metal Bar', 'Long Sustain'],
    description: 'Vibrafone de jazz com barras de alumínio, vibrato de motor rotativo e cauda longa ressonante.',
    presetOrigin: 'Modern Jazz & Film Score',
  },
  {
    id: 'marimba',
    label: 'Marimba',
    subtitle: 'Teclas de Madeira Nobre',
    category: 'percussion',
    emoji: '🪵',
    iconKey: 'marimba',
    tags: ['Rosewood Warmth', 'Wood Cavity', 'Round-Robin'],
    description: 'Marimba clássica com teclas de jacarandá e ressonadores de tubo, ataque macio e timbre aveludado.',
    presetOrigin: 'Orquestral & Latin Percussion',
  },
  {
    id: 'celesta',
    label: 'Celesta',
    subtitle: 'Campanólogo Orquestral',
    category: 'percussion',
    emoji: '🔔',
    iconKey: 'celesta',
    tags: ['Steel Plates', 'Crystalline Bell', 'Orchestral'],
    description: 'Instrumento de teclado orquestral com martelos percutindo placas de aço, criando um timbre cintilante de conto de fadas.',
    presetOrigin: 'Tchaikovsky / Sinfônico',
  },
  {
    id: 'glockenspiel',
    label: 'Glockenspiel',
    subtitle: 'Sinos Metálicos de Orquestra',
    category: 'percussion',
    emoji: '🔔',
    iconKey: 'glockenspiel',
    tags: ['High Bell Attack', 'Metallic Shimmer', 'Springsteen Hook'],
    description: 'Campanólogo de metal com ataque agudo brilhante e sustain cristalino, famoso na introdução de Born to Run.',
    presetOrigin: 'Rock de Arena & Orquestra',
  },

  // ─── 4. Sintetizadores & Leads ───────────────────────────────────────────
  {
    id: 'minimoog_lead',
    label: 'Minimoog Model D',
    subtitle: 'Sintetizador Analógico Gordo',
    category: 'synths_leads',
    emoji: '🎛️',
    iconKey: 'minimoog',
    tags: ['3-Osc Fat Lead', 'Ladder 24dB Filter', 'Portamento'],
    description: 'O sintetizador analógico supremo de 3 osciladores, filtro ladder ressonante de 24dB/oct e solos cortantes.',
    presetOrigin: 'Rock Progressivo & Funk',
  },
  {
    id: 'synth_lead',
    label: 'Analog Saw Lead',
    subtitle: 'Lead Analógico Cortante',
    category: 'synths_leads',
    emoji: '⚡',
    iconKey: 'synth_lead',
    tags: ['Detuned Saws', 'Resonant Sweep', 'Prog Rock'],
    description: 'Lead analógico de dente-de-serra rico em harmônicos e filtro dinâmico para solos de rock progressivo.',
    presetOrigin: 'Vintage Analog Synth',
  },
  {
    id: 'dx7_epiano',
    label: 'DX7 Electric Piano',
    subtitle: 'Síntese FM Anos 80',
    category: 'synths_leads',
    emoji: '🎹',
    iconKey: 'dx7',
    tags: ['FM 6-Operator', 'Glass Tine', '80s Ballad'],
    description: 'O som digital definitivo dos anos 80: piano elétrico FM de 6 operadores com claridade metálica e brilho cristalino.',
    presetOrigin: 'Yamaha DX7 1983',
  },
  {
    id: 'synth_pad',
    label: 'Pad Atmosférico',
    subtitle: 'Camadas Espaciais Flutuantes',
    category: 'synths_leads',
    emoji: '🌊',
    iconKey: 'synth_pad',
    tags: ['Multi-Detune', 'LFO Modulation', 'Ambient Space'],
    description: 'Pad sintético etéreo com osciladores polifônicos detunados, filtro modulado por LFO e cauda espacial.',
    presetOrigin: 'Ambient & Soundtrack',
  },
  {
    id: 'synth_brass',
    label: 'Brass Synth Anos 80',
    subtitle: 'Metais Sintéticos Analógicos',
    category: 'synths_leads',
    emoji: '🎺',
    iconKey: 'synth_brass',
    tags: ['Analog Brass', 'Fast Filter Envelope', 'Synthwave'],
    description: 'Metais analógicos dos anos 80 com ataque percussivo em dente-de-serra e abertura brilhante de filtro.',
    presetOrigin: 'New Wave & Pop 80s',
  },
  {
    id: 'brass_brega',
    label: 'Metais Pop & Brega',
    subtitle: 'Seção Sax & Trompete (Zezo / Seresta)',
    category: 'synths_leads',
    emoji: '🎷',
    iconKey: 'brass_brega',
    tags: ['Horn Section', 'Punchy Attack', 'Seresta & Piseiro'],
    description: 'Seção vibrante de sax e trompete com brilho e ataque percussivo, característica marcante de Zezo, Seresta e Piseiro.',
    presetOrigin: 'Bailes de Seresta & Forró Pop',
  },

  // ─── 5. Cordas & Orquestra ───────────────────────────────────────────────
  {
    id: 'strings',
    label: 'String Ensemble',
    subtitle: 'Orquestra de Cordas Sinfônica',
    category: 'orchestra',
    emoji: '🎻',
    iconKey: 'strings',
    tags: ['Violins & Cellos', 'Slow Bow Attack', 'Legato Expression'],
    description: 'Ensemble orquestral completo com violinos, violas e violoncelos em camadas estéreo com ataque de arco aveludado.',
    presetOrigin: 'Sinfônico Orquestral',
  },
  {
    id: 'violin',
    label: 'Violino Solo',
    subtitle: 'Violino Acústico Solo',
    category: 'orchestra',
    emoji: '🎻',
    iconKey: 'violin',
    tags: ['Dynamic Vibrato', 'Bow Formant', 'Solo Expression'],
    description: 'Violino solista acústico com vibrato natural progressivo, ataque expressivo de arco e corpo de madeira.',
    presetOrigin: 'Solo Erudito & Canção',
  },
  {
    id: 'cello',
    label: 'Cello Solo',
    subtitle: 'Violoncelo Grave e Expressivo',
    category: 'orchestra',
    emoji: '🎻',
    iconKey: 'cello',
    tags: ['Warm Low End', 'Resonant Cavity', 'Mellow Bow'],
    description: 'Violoncelo acústico encorpado com graves profundos, médios cantabile e ressonância orgânica.',
    presetOrigin: 'Câmara Clássica',
  },
  {
    id: 'harp',
    label: 'Harpa Clássica',
    subtitle: 'Harpa de Concerto Orquestral',
    category: 'orchestra',
    emoji: '🎵',
    iconKey: 'harp',
    tags: ['Plucked Strings', 'Arpeggio Shimmer', 'Orchestra'],
    description: 'Harpa de concerto com cordas dedilhadas brilhantes, decaimento aveludado e brilho polifônico.',
    presetOrigin: 'Concerto Clássico',
  },
  {
    id: 'flute',
    label: 'Flauta Orquestral',
    subtitle: 'Flauta Transversal com Sopro',
    category: 'orchestra',
    emoji: '🪈',
    iconKey: 'flute',
    tags: ['Breath Noise', 'Airy Vibrato', 'Woodwind'],
    description: 'Flauta transversal com componente de ruído de sopro dinâmico e tom senoidal doce.',
    presetOrigin: 'Sopros de Orquestra',
  },

  // ─── 6. Guitarras & Violões ──────────────────────────────────────────────
  {
    id: 'guitar_nylon',
    label: 'Violão Nylon Nordestino',
    subtitle: 'Violão Clássico Acústico',
    category: 'guitars',
    emoji: '🎸',
    iconKey: 'guitar_nylon',
    tags: ['Fingerstyle Nylon', 'Body Resonance', 'Bossa & Baião'],
    description: 'Violão acústico com cordas de nylon, ataque macio de ponta de dedo e ressonância de corpo de madeira para MPB e Xote.',
    presetOrigin: 'Tradição Brasileira',
  },
  {
    id: 'guitar_7strings',
    label: 'Violão de 7 Cordas',
    subtitle: 'Baixarias de Samba & Choro',
    category: 'guitars',
    emoji: '🎸',
    iconKey: 'guitar_7strings',
    tags: ['Low C2 String', 'Deep Bass Runs', 'Samba & Choro'],
    description: 'O violão tradicional de 7 cordas do choro e samba brasileiro, com extensão grave ampliada para baixarias.',
    presetOrigin: 'Samba & Choro Tradicional',
  },
  {
    id: 'guitar_strat_clean',
    label: 'Stratocaster Clean',
    subtitle: 'Guitarra Single-Coil Valvulada',
    category: 'guitars',
    emoji: '🎸',
    iconKey: 'strat_clean',
    tags: ['Single-Coil Spank', 'Tube Amp Clean', 'Classic Rock'],
    description: 'Guitarra Fender Stratocaster com captadores single-coil, médios cavados e brilho de amplificador valvulado clássico.',
    presetOrigin: 'Rock Clássico & Pop',
  },
  {
    id: 'guitar_strat_drive',
    label: 'Stratocaster Drive',
    subtitle: 'Overdrive Pink Floyd Solo',
    category: 'guitars',
    emoji: '🎸',
    iconKey: 'strat_drive',
    tags: ['Warm Overdrive', 'Cabinet Simulator', 'David Gilmour'],
    description: 'Guitarra elétrica com saturação cremosa valvulada, sustain prolongado e simulação de gabinete para solos de rock.',
    presetOrigin: 'Pink Floyd / Comfortably Numb',
  },
  {
    id: 'guitar_reggae_muted',
    label: 'Rhythm Guitar Reggae',
    subtitle: 'Acordes Abafados (Bob Marley Skank)',
    category: 'guitars',
    emoji: '🎸',
    iconKey: 'guitar_reggae',
    tags: ['Palm Muted', 'Quick Chop', 'Reggae Roots'],
    description: 'Guitarra rítmica com palhetada abafada (palm mute) nos contratempos 2 e 4 para o groove autêntico do reggae jamaicano.',
    presetOrigin: 'Kingston Roots Reggae',
  },
  {
    id: 'harpsichord',
    label: 'Cravo Barroco',
    subtitle: 'Plectro de Penas Barroco',
    category: 'guitars',
    emoji: '🎼',
    iconKey: 'harpsichord',
    tags: ['Plectrum Attack', 'Baroque Brightness', 'Bach & Scarlatti'],
    description: 'Cravo histórico barroco com cordas pinçadas por plectros, ataque imediato e textura contrapontística cristalina.',
    presetOrigin: 'Alemanha Barroca 1720',
  },

  // ─── 7. Baixos ───────────────────────────────────────────────────────────
  {
    id: 'bass',
    label: 'Baixo Elétrico Pick',
    subtitle: 'Palhetada Firme Rock',
    category: 'bass',
    emoji: '🎸',
    iconKey: 'bass_pick',
    tags: ['Pick Attack', 'Punchy Midrange', 'Classic Bass'],
    description: 'Baixo elétrico tocado com palheta, com ataque percussivo definido e presença marcante nos médios.',
    presetOrigin: 'Rock de Arena & Pop',
  },
  {
    id: 'bass_finger',
    label: 'Baixo Elétrico Finger',
    subtitle: 'Toque de Dedos Encorpado',
    category: 'bass',
    emoji: '🎸',
    iconKey: 'bass_finger',
    tags: ['Fingerstyle Warmth', 'Deep Fundamental', 'Soul & Funk'],
    description: 'Baixo elétrico tocado com os dedos, oferecendo grave profundo, sustentação redonda e corpo aveludado.',
    presetOrigin: 'Soul, Funk & MPB',
  },
  {
    id: 'bass_acoustic',
    label: 'Baixo Acústico (Upright)',
    subtitle: 'Contrabaixo Acústico de Madeira',
    category: 'bass',
    emoji: '🎻',
    iconKey: 'bass_acoustic',
    tags: ['Wooden Body', 'Hollow Resonance', 'Jazz & Folk'],
    description: 'Contrabaixo acústico de orquestra e jazz com ressonância profunda de madeira e toque orgânico de pizzicato.',
    presetOrigin: 'Jazz Club & Bluegrass',
  },
  {
    id: 'bass_synth',
    label: 'Baixo Sintético Moog',
    subtitle: 'Sub-Bass Analógico Gordo',
    category: 'bass',
    emoji: '🎛️',
    iconKey: 'bass_synth',
    tags: ['Analog Sub-Osc', 'Lowpass Resonance', 'Synth Bass'],
    description: 'Baixo sintetizado analógico estilo Moog Taurus com sub-oscilador gordo e corte de frequências sub-graves estrondosas.',
    presetOrigin: 'Moog Taurus / Synth Funk',
  },
];
