// Base de dados didática estruturada para os Cursos Interativos de Teclado e Violão

export interface ScoreNote {
  midi: number;
  clef: 'treble' | 'bass';   // Clave de Sol ou Fá
  duration: number;          // 1 = semínima, 2 = mínima, 4 = semibreve, 0.5 = colcheia
  beat: number;              // Posição no compasso (1.0, 2.0...)
  measure: number;           // Número do compasso
  fingerRightHand?: number;  // 1 a 5
  fingerLeftHand?: number;   // 1 a 5
  noteName: string;          // ex: 'C4', 'E4'
  chordName?: string;        // ex: 'C', 'G/B'
}

export interface CourseLesson {
  id: string;
  moduleCode: string;        // ex: 'T1', 'T4', 'V2'
  title: string;
  subtitle: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  durationMinutes: number;
  instructions: {
    heading: string;
    text: string;
    bulletPoints: string[];
    fingeringTip?: string;
    postureAlert?: string;
  };
  scoreTrack?: ScoreNote[];   // Notas para a Partitura Deslizante
  targetChords?: Array<{     // Para treinos de montagem rápida de acordes
    root: string;
    quality: string;
    inversion: 0 | 1 | 2;
    symbol: string;
    targetNotes: string[];
    pivotFingerHint?: string;
  }>;
}

export interface CourseModule {
  id: string;
  instrument: 'keyboard' | 'guitar';
  code: string;              // 'T1', 'T2' ... 'V1', 'V2'
  title: string;
  phase: string;
  iconName: string;
  lessons: CourseLesson[];
}

// -------------------------------------------------------------
// CURSO COMPLETO DE TECLADO: DO ZERO AO AVANÇADO (T1 a T7)
// -------------------------------------------------------------
export const KEYBOARD_COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-t1',
    instrument: 'keyboard',
    code: 'T1',
    title: 'Topografia, Postura e Mão Curvada',
    phase: 'Fase 1: Fundamentos Absolutos',
    iconName: 'Compass',
    lessons: [
      {
        id: 't1-1',
        moduleCode: 'T1',
        title: 'Lição 1.1: A Geografia das Teclas Pretas e o Dó Central',
        subtitle: 'Encontre qualquer nota no piano em 1 segundo sem contar do começo',
        level: 'Iniciante',
        durationMinutes: 8,
        instructions: {
          heading: 'O Segredo Visual do Teclado',
          text: 'O teclado do piano não é uma sequência aleatória de teclas: ele é organizado em grupos alternados de 2 teclas pretas e 3 teclas pretas.',
          bulletPoints: [
            'A nota Dó (C) SEMPRE fica imediatamente à esquerda de qualquer grupo de 2 teclas pretas.',
            'A nota Fá (F) SEMPRE fica imediatamente à esquerda de qualquer grupo de 3 teclas pretas.',
            'O Dó Central (C4) fica bem no centro do teclado, em frente à marca do fabricante ou na altura do umbigo.',
          ],
          fingeringTip: 'Use o dedo 1 (polegar) da mão direita no Dó Central (C4).',
          postureAlert: 'Mantenha os ombros soltos e o antebraço em linha horizontal reta (90° em relação ao braço).',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'D4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'C4' },
        ],
      },
      {
        id: 't1-2',
        moduleCode: 'T1',
        title: 'Lição 1.2: A Maçã Invisível (Biomecânica dos Dedos)',
        subtitle: 'Como tocar com firmeza, velocidade e sem dores musculares',
        level: 'Iniciante',
        durationMinutes: 10,
        instructions: {
          heading: 'Formato da Mão Curvada',
          text: 'Imagine que você está segurando uma maçã ou uma bola de tênis. Os dedos não devem desabar retos sobre as teclas.',
          bulletPoints: [
            'Ataque sempre com a polpa próxima à ponta dos dedos (com exceção do polegar, que ataca com a lateral externa).',
            'Não dobre a primeira falange para trás (evite o dedo "quebrado").',
            'Toque Legato: transfira o peso do braço de um dedo para o outro sem bater com força bruta.',
          ],
          fingeringTip: 'Exercite a posição de 5 dedos (Dó a Sol) tocando com dedos 1 - 2 - 3 - 4 - 5.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
        ],
      },
    ],
  },
  {
    id: 'mod-t2',
    instrument: 'keyboard',
    code: 'T2',
    title: 'Clave de Sol, Clave de Fá e Ambas as Mãos',
    phase: 'Fase 2: Leitura Dinâmica & Independência',
    iconName: 'Music2',
    lessons: [
      {
        id: 't2-1',
        moduleCode: 'T2',
        title: 'Lição 2.1: Leitura Fluida em Clave de Sol (Mão Direita)',
        subtitle: 'Linhas (Mi-Sol-Si-Ré-Fá) e Espaços (Fá-Lá-Dó-Mi)',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'O Pentagrama da Mão Direita',
          text: 'A Clave de Sol dá nome à nota Sol na 2ª linha do pentagrama. Memorize as linhas de baixo para cima:',
          bulletPoints: [
            'Linhas: Mi (1ª), Sol (2ª), Si (3ª), Ré (4ª), Fá (5ª).',
            'Espaços: Fá (1º), Lá (2º), Dó (3º), Mi (4º) — Fácil de lembrar: F-A-C-E em inglês.',
            'Acompanhe o cursor e toque no momento exato em que a nota cruzar a linha de ataque.',
          ],
          fingeringTip: 'Dedos 1, 2, 3, 4 e 5 cobrem a região C4 a G4 confortavelmente.',
        },
        scoreTrack: [
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'B4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'G4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'F4' },
          { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'A4' },
          { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'C5' },
        ],
      },
      {
        id: 't2-2',
        moduleCode: 'T2',
        title: 'Lição 2.2: O Mundo dos Baixos (Clave de Fá e Mão Esquerda)',
        subtitle: 'A 4ª linha como Fá3 e a independência inicial',
        level: 'Iniciante',
        durationMinutes: 15,
        instructions: {
          heading: 'A Clave de Fá (Mão Esquerda)',
          text: 'Os baixos que dão suporte à harmonia são escritos na Clave de Fá. A mão esquerda posiciona o dedo 5 (mínimo) no C3 grave e o dedo 1 (polegar) no G3.',
          bulletPoints: [
            'A 4ª linha (onde os dois pontos da clave estão) é a nota Fá (F3).',
            'Espaços: Lá, Dó, Mi, Sol.',
            'Mão Esquerda sustenta notas longas enquanto a Mão Direita cria melodias.',
          ],
          fingeringTip: 'Mão Esquerda: Dedo 5 = Dó3, Dedo 3 = Mi3, Dedo 1 = Sol3.',
        },
        scoreTrack: [
          // Mão Esquerda no Pentagrama de Fá + Mão Direita no de Sol
          { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G3' },
          { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
    ],
  },
  {
    id: 'mod-t3',
    instrument: 'keyboard',
    code: 'T3',
    title: 'Acelerador de Acordes: Montagem Instantânea',
    phase: 'Fase 3: Harmonia Prática & Memória Muscular',
    iconName: 'Zap',
    lessons: [
      {
        id: 't3-1',
        moduleCode: 'T3',
        title: 'Lição 3.1: A Geometria das Tríades Maiores',
        subtitle: 'Monte qualquer tríade em menos de 2 segundos com o método dos shapes',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'Os 3 Formatos Visuais das Tríades',
          text: 'Em vez de contar semitons nos dedos a cada acorde, memorize os 3 grupos visuais:',
          bulletPoints: [
            'Grupo Totalmente Branco: Dó (C), Fá (F) e Sol (G) — 3 teclas brancas (Formato Garfo).',
            'Grupo Biscoito Recheado (Branca - Preta - Branca): Ré (D), Mi (E) e Lá (A).',
            'Grupo Invertido (Preta - Branca - Preta): Ré♭ (D♭), Mi♭ (E♭) e Lá♭ (A♭).',
            'Exceções únicas: Si Maior (B = Branca, Preta, Preta) e Si Bemol (B♭ = Preta, Branca, Branca).',
          ],
          fingeringTip: 'Mão Direita: sempre dedos 1 (Polegar), 3 (Médio) e 5 (Mínimo).',
        },
        targetChords: [
          { root: 'C', quality: 'major', inversion: 0, symbol: 'C', targetNotes: ['C', 'E', 'G'] },
          { root: 'F', quality: 'major', inversion: 0, symbol: 'F', targetNotes: ['F', 'A', 'C'] },
          { root: 'G', quality: 'major', inversion: 0, symbol: 'G', targetNotes: ['G', 'B', 'D'] },
          { root: 'D', quality: 'major', inversion: 0, symbol: 'D', targetNotes: ['D', 'F#', 'A'] },
          { root: 'A', quality: 'major', inversion: 0, symbol: 'A', targetNotes: ['A', 'C#', 'E'] },
        ],
      },
      {
        id: 't3-2',
        moduleCode: 'T3',
        title: 'Lição 3.2: O Movimento Único para Acordes Menores',
        subtitle: 'Abaixe o dedo 3 em 1 semitom para transformar alegria em melancolia',
        level: 'Iniciante',
        durationMinutes: 10,
        instructions: {
          heading: 'A Regra da Terça Menor',
          text: 'Qualquer acorde menor é gerado alterando apenas 1 nota em relação ao maior:',
          bulletPoints: [
            'Mantenha o polegar (1) e o mínimo (5) no mesmo lugar.',
            'Abaixe o dedo médio (3) exatamente 1 semitom para a esquerda.',
            'Exemplo: C (Dó-Mi-Sol) vira Cm (Dó-Mi♭-Sol).',
            'Exemplo: G (Sol-Si-Ré) vira Gm (Sol-Si♭-Ré).',
          ],
          fingeringTip: 'O polegar e o mínimo funcionam como âncoras na raiz e na quinta.',
        },
        targetChords: [
          { root: 'C', quality: 'minor', inversion: 0, symbol: 'Cm', targetNotes: ['C', 'Eb', 'G'] },
          { root: 'A', quality: 'minor', inversion: 0, symbol: 'Am', targetNotes: ['A', 'C', 'E'] },
          { root: 'E', quality: 'minor', inversion: 0, symbol: 'Em', targetNotes: ['E', 'G', 'B'] },
          { root: 'D', quality: 'minor', inversion: 0, symbol: 'Dm', targetNotes: ['D', 'F', 'A'] },
        ],
      },
    ],
  },
  {
    id: 'mod-t4',
    instrument: 'keyboard',
    code: 'T4',
    title: 'Inversões de Acordes & Condução Harmônica (Voice Leading)',
    phase: 'Fase 4: Fluência & Economia de Movimento',
    iconName: 'Layers',
    lessons: [
      {
        id: 't4-1',
        moduleCode: 'T4',
        title: 'Lição 4.1: As 3 Faces de um Acorde (Fundamental, 1ª e 2ª Inversão)',
        subtitle: 'Mude a ordem das notas mantendo a harmonia idêntica',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'O Que é uma Inversão?',
          text: 'Inverter um acorde é simplesmente escolher qual das suas notas será a mais grave (baixo).',
          bulletPoints: [
            'Posição Fundamental: 1 - 3 - 5 (ex: C-E-G). Dedos 1 - 3 - 5.',
            '1ª Inversão: 3 - 5 - 1 (ex: E-G-C). O Dó subiu uma oitava! Dedos 1 - 2 - 5.',
            '2ª Inversão: 5 - 1 - 3 (ex: G-C-E). O Dó e o Mi subiram! Dedos 1 - 3 - 5 ou 1 - 2 - 4.',
          ],
          fingeringTip: 'Na 1ª Inversão, use o dedo 2 no lugar do dedo 3 para maior conforto anatômico.',
        },
        targetChords: [
          { root: 'C', quality: 'major', inversion: 0, symbol: 'C (Fund)', targetNotes: ['C', 'E', 'G'] },
          { root: 'C', quality: 'major', inversion: 1, symbol: 'C/E (1ª Inv)', targetNotes: ['E', 'G', 'C'] },
          { root: 'C', quality: 'major', inversion: 2, symbol: 'C/G (2ª Inv)', targetNotes: ['G', 'C', 'E'] },
        ],
      },
      {
        id: 't4-2',
        moduleCode: 'T4',
        title: 'Lição 4.2: A Lei do Menor Esforço: C ➔ F ➔ G Sem Pular a Mão',
        subtitle: 'Nunca mais pule a mão inteira pelo teclado ao trocar de acorde',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'Voice Leading Profissional',
          text: 'Pianistas profissionais não pulam as mãos pelo teclado. Eles conectam os acordes pelas notas em comum.',
          bulletPoints: [
            'Dó Maior (Fundamental): Dó (dedo 1) - Mi (dedo 3) - Sol (dedo 5).',
            'Fá Maior (2ª Inversão): Mantenha o Dó no dedo 1! Mova apenas o Mi para Fá (dedo 3) e o Sol para Lá (dedo 5). O punho fica exatamente no mesmo lugar!',
            'Sol Maior (1ª Inversão): Mova o polegar para Si, mantenha o Ré no dedo 2 e o Sol no dedo 5.',
          ],
          fingeringTip: 'A nota Dó é o "Dedo Âncora" entre C e F. Não retire o polegar da tecla!',
          postureAlert: 'Mantenha o punho relaxado e flexível.',
        },
        targetChords: [
          { root: 'C', quality: 'major', inversion: 0, symbol: 'C (1-3-5)', targetNotes: ['C', 'E', 'G'], pivotFingerHint: 'Inicie com 1-3-5' },
          { root: 'F', quality: 'major', inversion: 2, symbol: 'F/A (1-3-5)', targetNotes: ['C', 'F', 'A'], pivotFingerHint: 'Mantenha o Polegar no C!' },
          { root: 'G', quality: 'major', inversion: 1, symbol: 'G/B (1-2-5)', targetNotes: ['B', 'D', 'G'], pivotFingerHint: 'Mínimo no Sol!' },
        ],
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },
          { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'C4', chordName: 'F/A' },
          { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'F4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'A4' },

          { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'B3', chordName: 'G/B' },
          { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
    ],
  },
  {
    id: 'mod-t5',
    instrument: 'keyboard',
    code: 'T5',
    title: 'Partitura Deslizante Fluida & Compasso Composto',
    phase: 'Fase 5: Leitura à Primeira Vista',
    iconName: 'Activity',
    lessons: [
      {
        id: 't5-1',
        moduleCode: 'T5',
        title: 'Lição 5.1: Peça Clássica Interativa: Ode à Alegria (Beethoven)',
        subtitle: 'Sincronização em tempo real de melodia e acordes',
        level: 'Intermediário',
        durationMinutes: 20,
        instructions: {
          heading: 'Ode à Alegria (9ª Sinfonia)',
          text: 'Esta peça desenvolve o legato nos dedos da mão direita com apoio de baixos na mão esquerda.',
          bulletPoints: [
            'Andamento recomendado: 80 BPM.',
            'Mão Direita: posição de 5 dedos fixa em Dó (C4 a G4).',
            'Mão Esquerda: sustenta o baixo no tempo 1 de cada compasso.',
          ],
          fingeringTip: 'E4 (dedo 3) ➔ E4 (dedo 3) ➔ F4 (dedo 4) ➔ G4 (dedo 5).',
        },
        scoreTrack: [
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4', chordName: 'C' },
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4', chordName: 'G' },
          { midi: 55, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'G3' },
          { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },
        ],
      },
      {
        id: 't5-2',
        moduleCode: 'T5',
        title: 'Lição 5.2: Peça Clássica: Minueto em Sol Maior (Bach / Petzold)',
        subtitle: 'Dança ternária barroca (3/4) e independência contrapontística',
        level: 'Intermediário',
        durationMinutes: 20,
        instructions: {
          heading: 'Minueto em Sol Maior (Anna Magdalena)',
          text: 'Um clássico do período barroco. Pratique o ritmo ternário com acentuação graciosa no tempo 1.',
          bulletPoints: [
            'Compasso 3/4: sinta o balanço 1 (forte), 2 (fraco), 3 (fraco).',
            'Mão Direita: fraseado lírico alternando dedos 5, 1, 2, 3, 4.',
            'Mão Esquerda: sustenta os baixos fundamentais.',
          ],
          fingeringTip: 'Inicie com o dedo 5 no D5 agudo.',
        },
        scoreTrack: [
          { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'D5', chordName: 'G' },
          { midi: 55, clef: 'bass', duration: 3, beat: 1, measure: 1, fingerLeftHand: 1, noteName: 'G3' },
          { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'G4' },
          { midi: 69, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'A4' },
          { midi: 71, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B4' },
          { midi: 72, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'C5' },

          { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'D5' },
          { midi: 47, clef: 'bass', duration: 3, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'B2' },
          { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'G4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'G4' },
        ],
      },
      {
        id: 't5-3',
        moduleCode: 'T5',
        title: 'Lição 5.3: Obra-Prima Clássica: Für Elise (Beethoven)',
        subtitle: 'O semitom perolado mais famoso do piano e arpejos em Lá Menor',
        level: 'Intermediário',
        durationMinutes: 25,
        instructions: {
          heading: 'Für Elise (Para Elise - WoO 59)',
          text: 'O tema imortal de Beethoven. Concentre-se na transferência de peso suave entre os dedos 5 e 4.',
          bulletPoints: [
            'Alternância E5 e D#5 com punho flexível.',
            'Arpejo de Lá Menor na mão esquerda (A2 - E3 - A3).',
            'Toque com expressividade romântica cantabile.',
          ],
          fingeringTip: 'Dedos 5 e 4 no E5 e D#5.',
        },
        scoreTrack: [
          { midi: 76, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'E5' },
          { midi: 75, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
          { midi: 76, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'E5' },
          { midi: 75, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'D#5' },
          { midi: 76, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'E5' },
          { midi: 71, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 2, noteName: 'B4' },

          { midi: 74, clef: 'treble', duration: 0.5, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'D5' },
          { midi: 72, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, fingerRightHand: 3, noteName: 'C5' },
          { midi: 69, clef: 'treble', duration: 1.5, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'A4', chordName: 'Am' },
          { midi: 45, clef: 'bass', duration: 0.5, beat: 2, measure: 2, fingerLeftHand: 5, noteName: 'A2' },
          { midi: 52, clef: 'bass', duration: 0.5, beat: 2.5, measure: 2, fingerLeftHand: 3, noteName: 'E3' },
          { midi: 57, clef: 'bass', duration: 0.5, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A3' },
        ],
      },
    ],
  },
  {
    id: 'mod-t6',
    instrument: 'keyboard',
    code: 'T6',
    title: 'Tétrades, Sétimas & Dissonâncias Pop/Worship',
    phase: 'Fase 6: Harmonia Moderna',
    iconName: 'Sparkles',
    lessons: [
      {
        id: 't6-1',
        moduleCode: 'T6',
        title: 'Lição 6.1: Dominando as Sétimas (maj7, 7, m7)',
        subtitle: 'Adicione calor e sofisticação aos seus acordes',
        level: 'Avançado',
        durationMinutes: 15,
        instructions: {
          heading: 'Como Achar a 7ª Rapidamente',
          text: 'Em vez de contar 7 graus acima da raiz:',
          bulletPoints: [
            'Sétima Maior (maj7): toque a tecla situada 1 semitom abaixo da oitava da fundamental (ex: em C, 1 semitom abaixo de C5 é B).',
            'Sétima Dominante (7): toque a tecla situada 2 semitons (1 tom) abaixo da oitava (ex: em C, 2 semitons abaixo é B♭).',
            'Menor com Sétima (m7): tríade menor + tecla a 2 semitons abaixo da oitava.',
          ],
          fingeringTip: 'Dedos 1 - 2 - 3 - 5 para tétrades na mão direita.',
        },
        targetChords: [
          { root: 'C', quality: 'maj7', inversion: 0, symbol: 'Cmaj7', targetNotes: ['C', 'E', 'G', 'B'] },
          { root: 'G', quality: 'dom7', inversion: 0, symbol: 'G7', targetNotes: ['G', 'B', 'D', 'F'] },
          { root: 'A', quality: 'min7', inversion: 0, symbol: 'Am7', targetNotes: ['A', 'C', 'E', 'G'] },
          { root: 'D', quality: 'min7', inversion: 0, symbol: 'Dm7', targetNotes: ['D', 'F', 'A', 'C'] },
        ],
      },
      {
        id: 't6-2',
        moduleCode: 'T6',
        title: 'Lição 6.2: Rock Clássico: Let It Be (The Beatles)',
        subtitle: 'A progressão I - V - vi - IV em blocos harmônicos com a mão direita',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'Let It Be (Paul McCartney)',
          text: 'O hino dos Beatles construído sobre acordes conectados por condução suave.',
          bulletPoints: [
            'Conecte C ➔ G ➔ Am ➔ F com a mão direita em semínimas.',
            'Mão esquerda segura o baixo fundamental no tempo 1 e 3.',
            'Aplique o Dedo Âncora ao passar para o acorde de Fá.',
          ],
          fingeringTip: 'C (1-3-5) ➔ G (1-2-5) ➔ Am (1-3-5) ➔ F (1-3-5).',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G2', chordName: 'G' },
          { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'B3' },
          { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'B3' },
          { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
      {
        id: 't6-3',
        moduleCode: 'T6',
        title: 'Lição 6.3: MPB & Bossa: Garota de Ipanema (Tom Jobim)',
        subtitle: 'Síncopa flutuante com acordes de Sétima Maior (Fmaj7 e G7)',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'Garota de Ipanema (Bossa Nova)',
          text: 'A obra-prima de Tom Jobim e Vinicius de Moraes. Aprenda a síncopa característica brasileira.',
          bulletPoints: [
            'A melodia inicia no tempo 1 e antecipa o balanço nos tempos fracos.',
            'Acordes sofisticados: Fmaj7 (Fá, Lá, Dó, Mi) e G7 (Sol, Si, Ré, Fá).',
            'Toque com toque aveludado e relaxado.',
          ],
          fingeringTip: 'Dedos 5, 3, 2 na frase "Olha que coisa mais linda".',
        },
        scoreTrack: [
          { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2', chordName: 'Fmaj7' },
          { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 2, noteName: 'D4' },

          { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },
        ],
      },
    ],
  },
  {
    id: 'mod-t7',
    instrument: 'keyboard',
    code: 'T7',
    title: 'Harmonização Avançada, ii-V-I e Re-harmonização',
    phase: 'Fase 7: Domínio & Improvisação Profissional',
    iconName: 'Wand2',
    lessons: [
      {
        id: 't7-1',
        moduleCode: 'T7',
        title: 'Lição 7.1: A Cadência Mãe ii - V - I com Tensões Modernas',
        subtitle: 'Domine a sequência harmônica mais importante do Jazz, Pop e MPB',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'A Conexão ii - V - I Fluida',
          text: 'A progressão ii - V - I resolve a tensão harmônica com elegância suprema em qualquer tonalidade.',
          bulletPoints: [
            'No tom de Dó Maior: ii = Dm7 (ou Dm9), V = G7 (ou G13), I = Cmaj7 (ou Cmaj9).',
            'Economia de movimento: a 7ª do acorde anterior desce meio tom para virar a 3ª do próximo acorde (Voice Leading perfeito).',
            'Rootless Voicings: a mão esquerda toca apenas a tônica e a 7ª, enquanto a mão direita foca nas tensões (9, 11 e 13).',
          ],
          fingeringTip: 'Mão Esquerda faz o baixo fundamental e a Mão Direita expressa as tensões.',
        },
        targetChords: [
          { root: 'D', quality: 'min7', inversion: 0, symbol: 'Dm9', targetNotes: ['F', 'A', 'C', 'E'] },
          { root: 'G', quality: 'dom7', inversion: 0, symbol: 'G13', targetNotes: ['F', 'B', 'E'] },
          { root: 'C', quality: 'maj7', inversion: 0, symbol: 'Cmaj9', targetNotes: ['E', 'G', 'B', 'D'] },
        ],
        scoreTrack: [
          { midi: 62, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D3', chordName: 'Dm9' },
          { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'F4' },
          { midi: 72, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'C5' },

          { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'G2', chordName: 'G13' },
          { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'F4' },
          { midi: 71, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'B4' },

          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C3', chordName: 'Cmaj9' },
          { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'E4' },
          { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'B4' },
        ],
      },
      {
        id: 't7-2',
        moduleCode: 'T7',
        title: 'Lição 7.2: Re-harmonização Instantânea e SubV7',
        subtitle: 'Substituição tritônica e acordes diminutos de passagem',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'O Poder da Substituição Tritônica (SubV7)',
          text: 'Qualquer dominante (V7) pode ser substituído por outro dominante situado a uma distância de trítono (3 tons inteiros).',
          bulletPoints: [
            'Em vez de G7 ➔ C, experimente D♭7 ➔ C: a resolução cromática no baixo cria um efeito sofisticado imediato.',
            'Acorde diminuto de passagem ascendente: C ➔ C#°7 ➔ Dm7.',
            'Acorde diminuto de passagem descendente: Em7 ➔ E♭°7 ➔ Dm7.',
          ],
          fingeringTip: 'Sinta o movimento cromático descendente suave no baixo com a mão esquerda.',
        },
      },
    ],
  },
];

// -------------------------------------------------------------
// CURSO COMPLETO DE VIOLÃO: DO ZERO AO AVANÇADO (V1 a V7)
// -------------------------------------------------------------
export const GUITAR_COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-v1',
    instrument: 'guitar',
    code: 'V1',
    title: 'Fundamentos, Postura e Som Limpo',
    phase: 'Fase 1: Conexão com o Instrumento',
    iconName: 'Guitar',
    lessons: [
      {
        id: 'v1-1',
        moduleCode: 'V1',
        title: 'Lição 1.1: Mecânica dos Dedos Junto ao Traste',
        subtitle: 'Elimine de vez o som zumbido (fret buzz) e ganhe afinação cristalina',
        level: 'Iniciante',
        durationMinutes: 10,
        instructions: {
          heading: 'Onde Pressionar na Casa?',
          text: 'O erro nº 1 de quem começa no violão é apertar no meio da casa com força excessiva.',
          bulletPoints: [
            'Posicione a ponta do dedo imediatamente antes do ferrinho (traste metálico).',
            'Quanto mais perto do traste você posicionar o dedo, menor será a força necessária para obter som limpo.',
            'O polegar atrás do braço deve funcionar como um eixo de pinça suave, na metade da largura do mastro.',
          ],
          fingeringTip: 'Mão esquerda: use a ponta óssea dos dedos 1, 2, 3 e 4 perpendicularmente ao braço.',
          postureAlert: 'Não deite os dedos sobre as cordas vizinhas!',
        },
      },
      {
        id: 'v1-2',
        moduleCode: 'V1',
        title: 'Lição 1.2: A Técnica do Dedo Âncora (Troca C ➔ Am ➔ Em)',
        subtitle: 'Acelere as trocas de acordes sem olhar para as mãos',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'O Dedo Pivô / Âncora',
          text: 'Ao trocar de Dó Maior (C) para Lá Menor (Am):',
          bulletPoints: [
            'O dedo 1 (2ª corda casa 1) e o dedo 2 (4ª corda casa 2) NÃO saem do lugar!',
            'Apenas o dedo 3 (anelar) se move da 5ª para a 3ª corda casa 2.',
            'Isso economiza 70% do tempo de troca e mantém o ritmo estável.',
          ],
          fingeringTip: 'Pratique a troca no ar sentindo os dedos 1 e 2 grudados.',
        },
      },
    ],
  },
  {
    id: 'mod-v2',
    instrument: 'guitar',
    code: 'V2',
    title: 'O Fim do Bloqueio da Pestana',
    phase: 'Fase 2: Biomecânica da Pestana',
    iconName: 'ShieldCheck',
    lessons: [
      {
        id: 'v2-1',
        moduleCode: 'V2',
        title: 'Lição 2.1: A Pestana com o Peso do Braço (Sem Dor)',
        subtitle: 'Aprenda a fazer Fá Maior (F) usando alavanca corporal, não força bruta',
        level: 'Iniciante',
        durationMinutes: 15,
        instructions: {
          heading: 'A Física Real da Pestana',
          text: 'Se você tentar apertar a pestana esmagando o polegar contra o indicador, sua mão vai travar em 30 segundos.',
          bulletPoints: [
            'Gire levemente o dedo indicador para a lateral externa, usando a borda do osso que é rígida e reta.',
            'Use o peso natural do braço esquerdo puxando suavemente o violão contra o peito.',
            'O polegar serve apenas como guia de apoio, sem aplicar força de esmagamento.',
            'Comece praticando a pestana na casa 5 (Lá Maior) onde as cordas são mais macias, e depois desça para a casa 1 (Fá Maior).',
          ],
          fingeringTip: 'Indicador esticado com a lateral externa em contato com as 6 cordas.',
          postureAlert: 'Se sentir dor na base do polegar, pare imediatamente e relaxe os ombros.',
        },
      },
    ],
  },
  {
    id: 'mod-v3',
    instrument: 'guitar',
    code: 'V3',
    title: 'O Sistema CAGED: O Braço Totalmente Decodificado',
    phase: 'Fase 3: Mapeamento Total do Braço',
    iconName: 'Layers',
    lessons: [
      {
        id: 'v3-1',
        moduleCode: 'V3',
        title: 'Lição 3.1: Os 5 Shapes Móveis (C-A-G-E-D)',
        subtitle: 'Toque qualquer música em qualquer região do instrumento',
        level: 'Intermediário',
        durationMinutes: 20,
        instructions: {
          heading: 'O Conceito do Capotraste Móvel',
          text: 'Todo acorde com pestana é apenas um formato aberto (C, A, G, E ou D) transportado com o indicador fazendo o papel de pestana móvel.',
          bulletPoints: [
            'Shape de E: Pestana na casa 8 gera Dó Maior.',
            'Shape de A: Pestana na casa 3 gera Dó Maior.',
            'Shape de C: Pestana na casa 12 gera Dó Maior oitavado.',
            'Aprenda a localizar onde está a nota fundamental em cada um dos 5 formatos!',
          ],
          fingeringTip: 'Shape E tem fundamentais nas cordas 6 e 1. Shape A tem fundamental na corda 5.',
        },
      },
    ],
  },
  {
    id: 'mod-v4',
    instrument: 'guitar',
    code: 'V4',
    title: 'Baixos Invertidos & Condução de Bordões',
    phase: 'Fase 4: Harmonia Funcional no Braço',
    iconName: 'Sliders',
    lessons: [
      {
        id: 'v4-1',
        moduleCode: 'V4',
        title: 'Lição 4.1: Condução de Baixos Cromáticos (C ➔ C/B ➔ Am ➔ Am/G)',
        subtitle: 'Crie linhas melódicas de contrabaixo com o polegar enquanto dedilha',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'A Linha Descendente de Baixo',
          text: 'Uma das marcas registradas da música brasileira e do folk é descer o baixo nota por nota sob o mesmo acorde.',
          bulletPoints: [
            'C (Dó na 5ª corda casa 3).',
            'C/B (Si na 5ª corda casa 2 - dedo 1 ou 2).',
            'Am (Lá na 5ª corda solta).',
            'Am/G (Sol na 6ª corda casa 3 - dedo 3 ou 4).',
          ],
          fingeringTip: 'O polegar ataca com firmeza a nota do baixo no tempo 1 de cada compasso.',
        },
      },
      {
        id: 'v4-2',
        moduleCode: 'V4',
        title: 'Lição 4.2: Baixos Alternados (Country, Folk e Sertanejo)',
        subtitle: 'Alterne a raiz e a 5ª do acorde em ritmo contínuo',
        level: 'Intermediário',
        durationMinutes: 12,
        instructions: {
          heading: 'O Pêndulo do Polegar',
          text: 'No acorde de C, alterne entre a 5ª corda (Dó) e a 6ª corda pressionada na casa 3 (Sol).',
          bulletPoints: [
            'Tempo 1: Baixo fundamental (5ª corda).',
            'Tempo 2: Acorde puxado nas cordas agudas.',
            'Tempo 3: Baixo alternado na 5ª justa (6ª corda casa 3).',
            'Tempo 4: Acorde puxado nas cordas agudas.',
          ],
          fingeringTip: 'Mão direita: P (polegar) nos bordões e dedos I-M-A puxando em gancho.',
        },
      },
    ],
  },
  {
    id: 'mod-v5',
    instrument: 'guitar',
    code: 'V5',
    title: 'Leitura Dinâmica de Tablatura e Partitura com Rolagem',
    phase: 'Fase 5: Leitura Rítmica Aplicada',
    iconName: 'FileText',
    lessons: [
      {
        id: 'v5-1',
        moduleCode: 'V5',
        title: 'Lição 5.1: Tablatura com Métrica e Hastes Rítmicas',
        subtitle: 'Pare de adivinhar o tempo e leia o ritmo com precisão de metrônomo',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'Tablatura Moderna com Hastes',
          text: 'Ao contrário de cifras amadoras, nossa esteira rítmica mostra exatamente a duração de cada nota no braço.',
          bulletPoints: [
            'Números representam as casas do violão.',
            'Linhas horizontais representam as cordas (1ª aguda no topo, 6ª grave na base).',
            'Hastes verticais mostram a métrica: semínimas, colcheias e pausas.',
          ],
          fingeringTip: 'Mantenha os dedos da mão esquerda preparados na casa antes do ataque.',
        },
      },
    ],
  },
  {
    id: 'mod-v6',
    instrument: 'guitar',
    code: 'V6',
    title: 'Ritmos do Brasil: Samba, Bossa Nova e Guarania',
    phase: 'Fase 6: Levadas Brasileiras & Groove',
    iconName: 'Sparkles',
    lessons: [
      {
        id: 'v6-1',
        moduleCode: 'V6',
        title: 'Lição 6.1: A Batida da Bossa Nova de João Gilberto',
        subtitle: 'A independência do polegar e a síncopa mágica dos dedos agudos',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'A Síncopa Imortal da Bossa',
          text: 'O violão de João Gilberto imita a marcação do surdo no polegar e o tamborim nos dedos I-M-A.',
          bulletPoints: [
            'O polegar marca o tempo 1 e o tempo 2 com precisão cirúrgica.',
            'Os dedos indicador, médio e anelar puxam os acordes sincopados nos contratempos.',
            'Acordes sofisticados com 9ª e 13ª: Cmaj7(9), Dm7(9), G7(13).',
          ],
          fingeringTip: 'Toque com as cordas relaxadas, sem puxar com agressividade.',
        },
      },
    ],
  },
  {
    id: 'mod-v7',
    instrument: 'guitar',
    code: 'V7',
    title: 'Fingerstyle Avançado & Solo com Pentatônicas',
    phase: 'Fase 7: Expressão Solo e Virtuosismo',
    iconName: 'Flame',
    lessons: [
      {
        id: 'v7-1',
        moduleCode: 'V7',
        title: 'Lição 7.1: Os 5 Desenhos da Pentatônica Conectados ao CAGED',
        subtitle: 'Improvise solos fluidos com bends, slides e vibrato em qualquer tom',
        level: 'Avançado',
        durationMinutes: 25,
        instructions: {
          heading: 'A Sobreposição Perfeita: Pentatônica + CAGED',
          text: 'Cada um dos 5 desenhos da escala pentatônica encaixa perfeitamente em cima de um shape do CAGED.',
          bulletPoints: [
            'Padrão 1: Encaixa sobre o Shape de E (ex: casa 5 a 8 em Lá Menor).',
            'Padrão 2: Encaixa sobre o Shape de D.',
            'Padrão 3: Encaixa sobre o Shape de C.',
            'Articulações expressivas: Hammer-on (ligadura ascendente), Pull-off (ligadura descendente) e Slide.',
          ],
          fingeringTip: 'Apoie o polegar no topo do braço para dar sustentação aos bends.',
        },
      },
    ],
  },
];

