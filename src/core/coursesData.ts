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

// ============================================================================
// CURSO COMPLETO DE TECLADO & PIANO: EMENTA PEDAGÓGICA (T1 a T10 - 30 LIÇÕES)
// ============================================================================
export const KEYBOARD_COURSE_MODULES: CourseModule[] = [
  // -------------------------------------------------------------
  // MÓDULO T1: Topografia, Postura & Biomecânica da Mão
  // -------------------------------------------------------------
  {
    id: 'mod-t1',
    instrument: 'keyboard',
    code: 'T1',
    title: 'Topografia, Postura e Biomecânica da Mão',
    phase: 'Fase 1: Fundamentos & Anatomia',
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
          text: 'O teclado do piano é organizado visualmente em grupos alternados de 2 teclas pretas e 3 teclas pretas.',
          bulletPoints: [
            'A nota Dó (C) SEMPRE fica imediatamente à esquerda de qualquer grupo de 2 teclas pretas.',
            'A nota Fá (F) SEMPRE fica imediatamente à esquerda de qualquer grupo de 3 teclas pretas.',
            'O Dó Central (C3) fica no centro do teclado, em frente à marca do fabricante ou na altura do umbigo.',
            'Identifique visualmente as notas Dó, Ré e Mi no grupo de duas pretas sem hesitar.',
          ],
          fingeringTip: 'Use o dedo 1 (polegar) da mão direita no Dó Central (C3).',
          postureAlert: 'Mantenha os ombros relaxados e os antebraços nivelados com a altura das teclas brancas.',
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
          text: 'Imagine que você segura uma maçã média na palma da mão ou uma bolha de sabão delicada.',
          bulletPoints: [
            'As articulações dos nós dos dedos (juntas) nunca devem afundar para dentro.',
            'O polegar toca com a borda lateral macia da ponta, nunca reto como uma vareta.',
            'Os dedos 2, 3, 4 e 5 atacam a tecla com a polpa próxima à unha, em arco firme.',
            'Ao tocar uma nota, os outros dedos repousam relaxados sobre as teclas vizinhas sem flutuar.',
          ],
          fingeringTip: 'Sinta o peso do braço transferido suavemente para a ponta de cada dedo.',
          postureAlert: 'Evite punhos caídos! O dorso da mão deve formar uma linha suave com o antebraço.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
      {
        id: 't1-3',
        moduleCode: 'T1',
        title: 'Lição 1.3: O Peso do Braço e Respiração Musical',
        subtitle: 'Toque com expressividade e dinâmica sem fadiga nos tendões',
        level: 'Iniciante',
        durationMinutes: 10,
        instructions: {
          heading: 'Gravidade vs Força Muscular',
          text: 'Os grandes pianistas não martelam as teclas com força bruta: eles soltam o peso natural do braço em queda livre controlada.',
          bulletPoints: [
            'Ao iniciar uma frase musical, respire fundo e sinta o peso do braço caindo suavemente na tecla.',
            'No final de cada frase, levante o punho com leveza, como se uma pena o puxasse para cima.',
            'O som legato (ligado) é obtido quando o dedo anterior só solta a tecla no exato milissegundo em que o próximo dedo desce.',
          ],
          fingeringTip: 'Transfira o peso de um dedo para o outro de forma líquida, sem interrupção sonora.',
          postureAlert: 'Pés sempre plantados no chão para dar suporte ao tronco.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T2: Clave de Sol & Leitura Rítmica (Mão Direita)
  // -------------------------------------------------------------
  {
    id: 'mod-t2',
    instrument: 'keyboard',
    code: 'T2',
    title: 'Clave de Sol & Leitura Rítmica (Mão Direita)',
    phase: 'Fase 2: Notação Musical Fluida',
    iconName: 'Music',
    lessons: [
      {
        id: 't2-1',
        moduleCode: 'T2',
        title: 'Lição 2.1: Leitura Fluida nas Linhas e Espaços da Clave de Sol',
        subtitle: 'Decore as 5 linhas (Mi-Sol-Si-Ré-Fá) e 4 espaços (Fá-Lá-Dó-Mi)',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'O Mapa do Pentagrama Superior',
          text: 'A Clave de Sol indica que a nota Sol (G4) fica na 2ª linha de baixo para cima.',
          bulletPoints: [
            'Linhas (de baixo para cima): 1ª Mi (E4), 2ª Sol (G4), 3ª Si (B4), 4ª Ré (D5), 5ª Fá (F5).',
            'Espaços (de baixo para cima): 1º Fá (F4), 2º Lá (A4), 3º Dó (C5), 4º Mi (E5).',
            'Memorize o mnemônico das linhas: "Minha Sorte Sempre Rende Frutos".',
          ],
          fingeringTip: 'Associe a linha 1 (E4) ao Dedo 3 e a linha 2 (G4) ao Dedo 5.',
        },
        scoreTrack: [
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'G4' },
          { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'B4' },
          { midi: 74, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'D5' },
          { midi: 71, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'B4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'G4' },
          { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'E4' },
        ],
      },
      {
        id: 't2-2',
        moduleCode: 'T2',
        title: 'Lição 2.2: O Pulso Rítmico em 4/4 e 3/4 (Semínima e Mínima)',
        subtitle: 'Sinta o batimento interno e a contagem precisa dos compassos',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'A Divisão do Tempo Musical',
          text: 'O compasso 4/4 possui 4 tempos por compasso, com o tempo 1 forte e o tempo 3 meio-forte.',
          bulletPoints: [
            'Semínima (1 tempo inteiro): Cabeça preenchida com haste vertical — o pulso padrão ("Tá").',
            'Mínima (2 tempos sustentados): Cabeça vazada com haste vertical ("Tá-á").',
            'Semibreve (4 tempos completos): Cabeça vazada sem haste ("Tá-á-á-á").',
            'Conte sempre em voz alta "1, 2, 3, 4" junto com o metrônomo para internalizar a precisão da pulsação.',
          ],
          fingeringTip: 'Mantenha o andamento constante, sem acelerar nas notas fáceis.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'F4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
        ],
      },
      {
        id: 't2-3',
        moduleCode: 'T2',
        title: 'Lição 2.3: Peça Clássica: Ode à Alegria (L. v. Beethoven)',
        subtitle: 'Toque a famosa 9ª Sinfonia com fraseado nítido e dinâmica',
        level: 'Iniciante',
        durationMinutes: 15,
        instructions: {
          heading: 'Ode à Alegria no Piano',
          text: 'Composta com perfeição pedagógica, utiliza exatamente os 5 dedos da mão direita na posição de Dó Maior.',
          bulletPoints: [
            'A melodia começa no dedo 3 (E4) e sobe até o dedo 5 (G4).',
            'Atenção ao ponto rítmico no compasso 4 (mínima pontuada e semínima).',
            'Toque com energia solene e alegre.',
          ],
          fingeringTip: 'E4 (3) ➔ E4 (3) ➔ F4 (4) ➔ G4 (5) ➔ G4 (5) ➔ F4 (4) ➔ E4 (3) ➔ D4 (2).',
        },
        scoreTrack: [
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 4, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 4, noteName: 'F4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
          { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 3, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, fingerRightHand: 2, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 1.5, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'E4' },
          { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 4, fingerRightHand: 2, noteName: 'D4' },
          { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 2, noteName: 'D4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T3: Clave de Fá & O Universo dos Graves (Mão Esquerda)
  // -------------------------------------------------------------
  {
    id: 'mod-t3',
    instrument: 'keyboard',
    code: 'T3',
    title: 'Clave de Fá & O Universo dos Graves (Mão Esquerda)',
    phase: 'Fase 3: Mão Esquerda & Grande Pauta',
    iconName: 'Layers',
    lessons: [
      {
        id: 't3-1',
        moduleCode: 'T3',
        title: 'Lição 3.1: Decodificando a Clave de Fá (Bass Clef)',
        subtitle: 'Aprenda a ler notas graves com facilidade e segurança',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'O Mapa dos Graves',
          text: 'Os dois pontos da Clave de Fá abraçam a 4ª linha de baixo para cima, definindo a nota Fá2 (F2).',
          bulletPoints: [
            'Linhas (de baixo para cima): 1ª Sol (G1), 2ª Si (B1), 3ª Ré (D2), 4ª Fá (F2), 5ª Lá (A2).',
            'Espaços: 1º Lá (A1), 2º Dó (C2), 3º Mi (E2), 4º Sol (G2).',
            'Dó Central (C3) fica na linha suplementar superior da Clave de Fá.',
          ],
          fingeringTip: 'O dedo 5 (mínimo) da mão esquerda é a âncora natural nas notas mais graves.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 3, noteName: 'E3' },
          { midi: 55, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerLeftHand: 1, noteName: 'G3' },
          { midi: 52, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 3, noteName: 'E3' },
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3' },
        ],
      },
      {
        id: 't3-2',
        moduleCode: 'T3',
        title: 'Lição 3.2: O Alicerce Harmônico (Baixos Sustentados em Semibreve)',
        subtitle: 'Sustente o baixo firme enquanto a harmonia se constrói',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'A Função do Baixo no Piano',
          text: 'O baixo é a fundação de qualquer edifício musical. Se o baixo oscilar, a música inteira perde o equilíbrio.',
          bulletPoints: [
            'Ataque o baixo exatamente na cabeça do tempo 1 de cada compasso.',
            'Segure a tecla pressionada durante toda a duração da semibreve (4 tempos).',
            'Solte a nota apenas no milissegundo em que o próximo compasso iniciar.',
          ],
          fingeringTip: 'Mantenha o punho esquerdo relaxado para evitar tensões acumuladas.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2' },
          { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A2' },
          { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F2' },
        ],
      },
      {
        id: 't3-3',
        moduleCode: 'T3',
        title: 'Lição 3.3: Coordenação Motora & Mãos Juntas (Hands Together)',
        subtitle: 'O salto definitivo para tocar com as duas mãos em sincronia perfeita',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'O Desafio das Mãos Juntas',
          text: 'Tocar com ambas as mãos exige pensar em camadas verticais (pontos de sincronia onde as duas mãos tocam juntas).',
          bulletPoints: [
            'Primeiro passo: pratique a mão direita sozinha até não precisar olhar para as teclas.',
            'Segundo passo: pratique a mão esquerda sozinha com metrônomo.',
            'Terceiro passo: junte as mãos bem devagar, em 50% do andamento original.',
            'Sinta o "peso sincronizado" nos tempos 1 onde as duas mãos descem simultaneamente.',
          ],
          fingeringTip: 'Mão Esquerda no Dedo 5 (C2), Mão Direita no Dedo 1 (C3).',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 55, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'G3' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'F4' },
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T4: Arquitetura das Tríades: Montagem Instantânea
  // -------------------------------------------------------------
  {
    id: 'mod-t4',
    instrument: 'keyboard',
    code: 'T4',
    title: 'Arquitetura das Tríades: Montagem Instantânea',
    phase: 'Fase 4: Acordes & Harmonia Fundamental',
    iconName: 'Shapes',
    lessons: [
      {
        id: 't4-1',
        moduleCode: 'T4',
        title: 'Lição 4.1: A Geometria das Tríades Maiores',
        subtitle: 'Monte qualquer tríade maior em menos de 2 segundos com o método dos shapes',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'A Fórmula das Tríades Maiores',
          text: 'Uma tríade maior é composta por Fundamental + Terça Maior (4 semitons) + Quinta Justa (7 semitons).',
          bulletPoints: [
            'Shape visual 1-3-5: dedos 1 (polegar), 3 (médio) e 5 (mínimo) caem exatamente em teclas alternadas.',
            'As três "Tríades Brancas" idênticas: Dó Maior (C-E-G), Fá Maior (F-A-C) e Sol Maior (G-B-D).',
            'Treine bater o bloco harmônico com os 3 dedos descendo exatamente ao mesmo tempo.',
          ],
          fingeringTip: 'Polegar na fundamental, dedo 3 na terça, dedo 5 na quinta.',
        },
        targetChords: [
          { root: 'C', quality: 'major', inversion: 0, symbol: 'C', targetNotes: ['C', 'E', 'G'] },
          { root: 'F', quality: 'major', inversion: 0, symbol: 'F', targetNotes: ['F', 'A', 'C'] },
          { root: 'G', quality: 'major', inversion: 0, symbol: 'G', targetNotes: ['G', 'B', 'D'] },
        ],
      },
      {
        id: 't4-2',
        moduleCode: 'T4',
        title: 'Lição 4.2: O Movimento Único para Tríades Menores',
        subtitle: 'Abaixe o dedo 3 em 1 semitom para transformar alegria em melancolia',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'A Magia da Terça Menor',
          text: 'Para transformar qualquer acorde maior em menor, a fundamental e a quinta NÃO mudam: apenas a terça desce meio tom.',
          bulletPoints: [
            'C Maior (C - E - G) ➔ Cm (C - E♭ - G).',
            'D Maior (D - F# - A) ➔ Dm (D - F - A).',
            'A Maior (A - C# - E) ➔ Am (A - C - E).',
            'Observe como a mudança de apenas uma tecla altera dramaticamente o sentimento da música.',
          ],
          fingeringTip: 'O dedo 3 apenas escorrega para a tecla esquerda mais próxima.',
        },
        targetChords: [
          { root: 'A', quality: 'minor', inversion: 0, symbol: 'Am', targetNotes: ['A', 'C', 'E'] },
          { root: 'D', quality: 'minor', inversion: 0, symbol: 'Dm', targetNotes: ['D', 'F', 'A'] },
          { root: 'E', quality: 'minor', inversion: 0, symbol: 'Em', targetNotes: ['E', 'G', 'B'] },
        ],
      },
      {
        id: 't4-3',
        moduleCode: 'T4',
        title: 'Lição 4.3: Conexão de Acordes: A Progressão Pop I - V - vi - IV',
        subtitle: 'A sequência harmônica mais famosa da história: de U2 a Coldplay',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'A Máquina de Hits do Pop',
          text: 'Centenas de sucessos mundiais utilizam a mesma progressão em Dó Maior: C ➔ G ➔ Am ➔ F.',
          bulletPoints: [
            'Compasso 1: C (Dó Maior) - 4 tempos.',
            'Compasso 2: G (Sol Maior) - 4 tempos.',
            'Compasso 3: Am (Lá Menor) - 4 tempos.',
            'Compasso 4: F (Fá Maior) - 4 tempos.',
            'A mão esquerda toca a tônica no baixo enquanto a direita executa a tríade.',
          ],
          fingeringTip: 'Antecipe o movimento da mão antes do início do próximo compasso.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
          { midi: 59, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'B3' },
          { midi: 62, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
          { midi: 59, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'B3' },
          { midi: 62, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'G4' },

          { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'E4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 5, noteName: 'A4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 3, noteName: 'E4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 5, noteName: 'A4' },

          { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 4, fingerLeftHand: 5, noteName: 'F2', chordName: 'F' },
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 1, noteName: 'C4' },
          { midi: 65, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 3, noteName: 'F4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 4, fingerRightHand: 5, noteName: 'A4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 1, noteName: 'C4' },
          { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 3, noteName: 'F4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 4, fingerRightHand: 5, noteName: 'A4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T5: Inversões de Acordes & Condução Harmônica (Voice Leading)
  // -------------------------------------------------------------
  {
    id: 'mod-t5',
    instrument: 'keyboard',
    code: 'T5',
    title: 'Inversões de Acordes & Condução Harmônica (Voice Leading)',
    phase: 'Fase 5: Fluidez & Conexão Vocal',
    iconName: 'Shuffle',
    lessons: [
      {
        id: 't5-1',
        moduleCode: 'T5',
        title: 'Lição 5.1: As 3 Faces de um Acorde (Fundamental, 1ª e 2ª Inversão)',
        subtitle: 'Mude a ordem das notas mantendo a harmonia idêntica',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'O Conceito de Inversão',
          text: 'Qualquer tríade possui 3 notas que podem ser rearranjadas em 3 posições verticais diferentes.',
          bulletPoints: [
            'Estado Fundamental (C): C - E - G (Fundamental na base).',
            '1ª Inversão (C/E): E - G - C (Terça na base - dedos 1-2-5).',
            '2ª Inversão (C/G): G - C - E (Quinta na base - dedos 1-3-5).',
            'As notas são idênticas, mas a cor timbrística e a facilidade de transição mudam completamente.',
          ],
          fingeringTip: 'Na 1ª inversão, use os dedos 1-2-5 para dar espaço anatômico entre o Mi e o Dó.',
        },
        targetChords: [
          { root: 'C', quality: 'major', inversion: 0, symbol: 'C (Fund)', targetNotes: ['C', 'E', 'G'] },
          { root: 'C', quality: 'major', inversion: 1, symbol: 'C/E (1ª Inv)', targetNotes: ['E', 'G', 'C'] },
          { root: 'C', quality: 'major', inversion: 2, symbol: 'C/G (2ª Inv)', targetNotes: ['G', 'C', 'E'] },
        ],
      },
      {
        id: 't5-2',
        moduleCode: 'T5',
        title: 'Lição 5.2: A Lei do Menor Movimento Possível (Voice Leading Suave)',
        subtitle: 'Pare de pular a mão pelo teclado e conecte notas vizinhas',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'O Princípio do Voice Leading',
          text: 'Em vez de pular a mão inteira de Dó para Fá e para Sol:',
          bulletPoints: [
            'De C (C-E-G) para F (C-F-A): a nota Dó é comum e NÃO se mexe! O Mi sobe para Fá e o Sol sobe para Lá.',
            'De C (C-E-G) para G (B-D-G): a nota Sol é comum e NÃO se mexe! O Dó desce para Si e o Mi desce para Ré.',
            'O movimento da mão é inferior a 2 centímetros, garantindo velocidade e precisão no escuro.',
          ],
          fingeringTip: 'Mantenha as notas comuns seguras como âncoras na mão direita.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },
          { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'G4' },

          { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'C4', chordName: 'F/C' },
          { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'F4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'A4' },

          { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'B3', chordName: 'G/B' },
          { midi: 62, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
      {
        id: 't5-3',
        moduleCode: 'T5',
        title: 'Lição 5.3: Hinos do Rock: Let It Be (The Beatles)',
        subtitle: 'A condução de inversões aplicada na canção mais icônica de Paul McCartney',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'Let It Be com Voice Leading Real',
          text: 'Paul McCartney construiu Let It Be mantendo a mão direita no registro médio com inversões perfeitas.',
          bulletPoints: [
            'C (C-E-G) ➔ G (B-D-G) ➔ Am (C-E-A) ➔ F (C-F-A).',
            'A mão esquerda toca os baixos fundamentais em oitavas.',
            'O Dó Central (C3) atua como linha condutora melódica que ancora o ouvido.',
          ],
          fingeringTip: 'Dedos 1-3-5 no C ➔ 1-2-5 no G ➔ 1-3-5 no Am ➔ 1-3-5 no F.',
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

          { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A2', chordName: 'Am' },
          { midi: 60, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'A4' },
          { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 3, noteName: 'E4' },
          { midi: 69, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'A4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T6: Levadas Rítmicas, Arpejos & Acompanhamento
  // -------------------------------------------------------------
  {
    id: 'mod-t6',
    instrument: 'keyboard',
    code: 'T6',
    title: 'Levadas Rítmicas, Arpejos & Acompanhamento',
    phase: 'Fase 6: Estilos de Acompanhamento',
    iconName: 'Waves',
    lessons: [
      {
        id: 't6-1',
        moduleCode: 'T6',
        title: 'Lição 6.1: O Arpejo Aberto 1-5-8 (Trilhas Sonoras & Baladas)',
        subtitle: 'O padrão dos filmes de Hollywood e do estilo Ludovico Einaudi',
        level: 'Intermediário',
        durationMinutes: 16,
        instructions: {
          heading: 'A Textura Espacial 1-5-8',
          text: 'Tocar acordes em bloco fechado soa pesado no registro grave. O arpejo aberto 1-5-8 espalha o som pelo teclado.',
          bulletPoints: [
            'Fórmula: Fundamental (1) ➔ Quinta (5) ➔ Oitava (8) com a mão esquerda.',
            'Mão direita dedilha notas melódicas suaves na região aguda.',
            'Use o pedal de sustain para conectar as notas sem emendar sons de acordes diferentes.',
          ],
          fingeringTip: 'Mão esquerda: Dedos 5 (1), 2 (5) e 1 (8).',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 2, noteName: 'G3' },
          { midi: 60, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerLeftHand: 1, noteName: 'C4' },
          { midi: 45, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'A2' },
          { midi: 52, clef: 'bass', duration: 1, beat: 2, measure: 2, fingerLeftHand: 2, noteName: 'E3' },
          { midi: 57, clef: 'bass', duration: 2, beat: 3, measure: 2, fingerLeftHand: 1, noteName: 'A3' },
        ],
      },
      {
        id: 't6-2',
        moduleCode: 'T6',
        title: 'Lição 6.2: Balada Pop 4/4 com Baixo Oitavado',
        subtitle: 'Padrão rítmico moderno para acompanhar cantores com segurança',
        level: 'Intermediário',
        durationMinutes: 16,
        instructions: {
          heading: 'O Ritmo da Balada Contemporânea',
          text: 'No tempo 1, baixo e acorde soam juntos. Nos tempos 2, 3 e 4, a mão direita pulsa em semínimas leves.',
          bulletPoints: [
            'Baixo oitavado com dedos 5 e 1 na mão esquerda no tempo 1.',
            'Acordes pulsados na mão direita no tempo 2, 3 e 4.',
            'Adicione a síncopa suave no contratempo "e" do tempo 2 para dar balanço moderno.',
          ],
          fingeringTip: 'Mantenha o pulso flexível como um amortecedor suave.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 4, noteName: 'A2', chordName: 'Am' },
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'C4' },
          { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 1, noteName: 'C4' },
          { midi: 60, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'C4' },
          { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'C4' },
        ],
      },
      {
        id: 't6-3',
        moduleCode: 'T6',
        title: 'Lição 6.3: A Valsa em 3/4 & Levadas Tradicionais',
        subtitle: 'Balanço ternário clássico: Baixo no tempo 1, acordes nos tempos 2 e 3',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'O Balanço Ternário "Um-Dois-Três"',
          text: 'Na valsa clássica, o tempo 1 é o passo firme no chão e os tempos 2 e 3 são giros flutuantes no ar.',
          bulletPoints: [
            'Tempo 1: Baixo solo e profundo com o dedo 5 da mão esquerda.',
            'Tempos 2 e 3: Acordes leves e destacados com a mão direita.',
            'Nunca toque os tempos 2 e 3 mais fortes que o tempo 1!',
          ],
          fingeringTip: 'Ataque o tempo 1 com peso e levante a mão direita suavemente nos tempos 2 e 3.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3', chordName: 'C' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 43, clef: 'bass', duration: 1, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G' },
          { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 2, noteName: 'D4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'D4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T7: Escalas Maiores, Passagem de Polegar & Agilidade Hanon
  // -------------------------------------------------------------
  {
    id: 'mod-t7',
    instrument: 'keyboard',
    code: 'T7',
    title: 'Escalas Maiores, Passagem de Polegar & Agilidade Hanon',
    phase: 'Fase 7: Técnica & Independência Digital',
    iconName: 'Activity',
    lessons: [
      {
        id: 't7-1',
        moduleCode: 'T7',
        title: 'Lição 7.1: A Passagem Secreta do Polegar (Thumb Under)',
        subtitle: 'A mecânica que permite viajar pelo teclado inteiro com apenas 5 dedos',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'O Polegar que Desliza por Baixo',
          text: 'Você tem apenas 5 dedos, mas o teclado tem 88 teclas. Para subir uma escala sem pausas:',
          bulletPoints: [
            'Toque C (1), D (2), E (3).',
            'Enquanto o dedo 3 toca o Mi, o polegar (1) passa por baixo da palma em direção ao Fá (F4).',
            'No exato momento em que o dedo 3 levanta, o polegar já está posicionado e pronto para atacar o Fá.',
            'Em seguida, os dedos 2, 3, 4 e 5 continuam: G (2), A (3), B (4), C (5).',
          ],
          fingeringTip: 'Digitação universal da Escala de Dó Maior na Mão Direita: 1-2-3-1-2-3-4-5.',
          postureAlert: 'Não levante o cotovelo para o lado! O punho deve permanecer estável.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'G4' },
          { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'A4' },
          { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'B4' },
          { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'C5' },
        ],
      },
      {
        id: 't7-2',
        moduleCode: 'T7',
        title: 'Lição 7.2: Escala de Sol Maior & O Primeiro Acidente (Fá#)',
        subtitle: 'Entenda os semitons diatônicos e a armadura de clave',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'A Fórmula das Escalas Maiores: T-T-S-T-T-T-S',
          text: 'Toda escala maior segue o mesmo padrão de intervalos: Tom, Tom, Semitom, Tom, Tom, Tom, Semitom.',
          bulletPoints: [
            'Para manter a fórmula a partir de Sol (G), o 7º grau precisa ser elevado em meio tom: Fá sustenido (F#).',
            'O Fá# é tocado com o dedo 4 da mão direita na tecla preta.',
            'Ouça a sensação de "tensão que quer resolver" ao tocar a sensível F# antes de chegar no Sol final.',
          ],
          fingeringTip: 'Mão Direita: 1 (G) ➔ 2 (A) ➔ 3 (B) ➔ 1 (C) ➔ 2 (D) ➔ 3 (E) ➔ 4 (F#) ➔ 5 (G).',
        },
        scoreTrack: [
          { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'G4' },
          { midi: 69, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'A4' },
          { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B4' },
          { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'C5' },
          { midi: 74, clef: 'treble', duration: 1, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'D5' },
          { midi: 76, clef: 'treble', duration: 1, beat: 2, measure: 2, fingerRightHand: 3, noteName: 'E5' },
          { midi: 78, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 4, noteName: 'F#5' },
          { midi: 79, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 5, noteName: 'G5' },
        ],
      },
      {
        id: 't7-3',
        moduleCode: 'T7',
        title: 'Lição 7.3: Hanon Essencial: Independência do 4º e 5º Dedos',
        subtitle: 'Elimine a fraqueza anatômica entre o anelar e o mínimo',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'O Famoso Exercício nº 1 de C. L. Hanon',
          text: 'Os dedos 4 e 5 compartilham o mesmo tendão extensor na mão, tornando o anelar naturalmente preso.',
          bulletPoints: [
            'O exercício de Hanon estica o intervalo entre os dedos 1 e 2, forçando o 4º e 5º dedos a articularem sozinhos.',
            'Toque cada nota articulada com clareza cristalina, como pequenas gotas de água caindo.',
            'Comece lento (60 BPM) e aumente 5 BPM por dia.',
          ],
          fingeringTip: 'Não aperte as teclas com tensão: levante apenas o dedo que vai tocar.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, fingerRightHand: 2, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 0.5, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 4, noteName: 'G4' },
          { midi: 69, clef: 'treble', duration: 0.5, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'A4' },
          { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, fingerRightHand: 4, noteName: 'G4' },
          { midi: 65, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 3, noteName: 'F4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, fingerRightHand: 2, noteName: 'E4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T8: Tétrades, Sétimas & Harmonia Moderna Pop/Worship
  // -------------------------------------------------------------
  {
    id: 'mod-t8',
    instrument: 'keyboard',
    code: 'T8',
    title: 'Tétrades, Sétimas & Harmonia Moderna Pop/Worship',
    phase: 'Fase 8: Harmonia Contemporânea',
    iconName: 'Sparkles',
    lessons: [
      {
        id: 't8-1',
        moduleCode: 'T8',
        title: 'Lição 8.1: Dominando as Sétimas (maj7, dom7, m7)',
        subtitle: 'Adicione calor, sofisticação e alma aos seus acordes',
        level: 'Avançado',
        durationMinutes: 16,
        instructions: {
          heading: 'O Truque Visual para Achar a Sétima em 1 Segundo',
          text: 'Em vez de contar 7 graus demoradamente para cima:',
          bulletPoints: [
            'Sétima Maior (maj7): toque a tecla situada 1 semitom ABAIXO da oitava (ex: em C, 1 semitom abaixo de C5 é B).',
            'Sétima Dominante (7): toque a tecla situada 2 semitons ABAIXO da oitava (ex: em C, 2 semitons abaixo é B♭).',
            'Menor com Sétima (m7): tríade menor com a tecla 2 semitons abaixo da oitava.',
          ],
          fingeringTip: 'Dedos 1-2-3-5 na mão direita para tétrades completas.',
        },
        targetChords: [
          { root: 'C', quality: 'maj7', inversion: 0, symbol: 'Cmaj7', targetNotes: ['C', 'E', 'G', 'B'] },
          { root: 'G', quality: 'dom7', inversion: 0, symbol: 'G7', targetNotes: ['G', 'B', 'D', 'F'] },
          { root: 'A', quality: 'min7', inversion: 0, symbol: 'Am7', targetNotes: ['A', 'C', 'E', 'G'] },
          { root: 'D', quality: 'min7', inversion: 0, symbol: 'Dm7', targetNotes: ['D', 'F', 'A', 'C'] },
        ],
      },
      {
        id: 't8-2',
        moduleCode: 'T8',
        title: 'Lição 8.2: Acordes Sus4, Sus2 e Add9 (A Textura Worship)',
        subtitle: 'A sonoridade flutuante e luminosa das grandes igrejas e canções modernas',
        level: 'Avançado',
        durationMinutes: 16,
        instructions: {
          heading: 'Suspensões que Criam Espaço e Brilho',
          text: 'Os acordes suspensos substituem a terça pela segunda (sus2) ou pela quarta (sus4), eliminando o caráter maior ou menor.',
          bulletPoints: [
            'Csus4: C - F - G (substitui o Mi pelo Fá, criando tensão que resolve no Mi).',
            'Csus2: C - D - G (substitui o Mi pelo Ré, criando um som aberto e etéreo).',
            'Cadd9: C - E - G - D (a tríade maior clássica mais a nona cintilante no topo).',
          ],
          fingeringTip: 'Alterne Csus4 ➔ C com o dedo 4 descendo para o dedo 3.',
        },
        targetChords: [
          { root: 'C', quality: 'sus4', inversion: 0, symbol: 'Csus4', targetNotes: ['C', 'F', 'G'] },
          { root: 'C', quality: 'sus2', inversion: 0, symbol: 'Csus2', targetNotes: ['C', 'D', 'G'] },
          { root: 'C', quality: 'add9', inversion: 0, symbol: 'Cadd9', targetNotes: ['C', 'E', 'G', 'D'] },
        ],
      },
      {
        id: 't8-3',
        moduleCode: 'T8',
        title: 'Lição 8.3: A Progressão ii - V - I do Jazz e da Bossa Nova',
        subtitle: 'O ciclo harmônico mais rico e respeitado da música universal',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'O Ciclo ii7 - V7 - Imaj7 em Dó Maior',
          text: 'Em Dó Maior: Dm7 (ii) ➔ G7 (V) ➔ Cmaj7 (I). A resolução do trítono entre o Fá e o Si cria a magia.',
          bulletPoints: [
            'Dm7: D no baixo; F-A-C na mão direita.',
            'G7: G no baixo; F-G-B na mão direita.',
            'Cmaj7: C no baixo; E-G-B na mão direita.',
            'Observe como a condução é ultra-suave com inversões elegantes.',
          ],
          fingeringTip: 'Mão esquerda toca o baixo e mão direita foca nos voicings refinados.',
        },
        scoreTrack: [
          { midi: 50, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'D3', chordName: 'Dm7' },
          { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'F4' },
          { midi: 69, clef: 'treble', duration: 4, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'A4' },
          { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 1, fingerRightHand: 5, noteName: 'C5' },

          { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2', chordName: 'G7' },
          { midi: 65, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'G4' },
          { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 4, noteName: 'B4' },

          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 3, fingerLeftHand: 5, noteName: 'C3', chordName: 'Cmaj7' },
          { midi: 64, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 1, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 2, noteName: 'G4' },
          { midi: 71, clef: 'treble', duration: 4, beat: 1, measure: 3, fingerRightHand: 4, noteName: 'B4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T9: Blues, Shuffle & Síncopas Brasileiras
  // -------------------------------------------------------------
  {
    id: 'mod-t9',
    instrument: 'keyboard',
    code: 'T9',
    title: 'Blues, Shuffle & Síncopas Brasileiras',
    phase: 'Fase 9: Ritmos de Raiz & Improviso',
    iconName: 'Flame',
    lessons: [
      {
        id: 't9-1',
        moduleCode: 'T9',
        title: 'Lição 9.1: A Escala de Blues & As Blue Notes',
        subtitle: 'Aprenda a fórmula mágica do blues para improvisar em qualquer tom',
        level: 'Avançado',
        durationMinutes: 18,
        instructions: {
          heading: 'A Alma do Blues: A Blue Note (5ª Diminuta)',
          text: 'A Escala de Blues de Dó consiste em: Dó, Mi♭, Fá, Fá# (Blue Note), Sol, Si♭.',
          bulletPoints: [
            'A nota Fá# (tecla preta entre Fá e Sol) é a nota de passagem mais expressiva da música popular.',
            'Esmague suavemente a tecla Fá# deslizando rapidamente para o Sol para obter o efeito "crushed note".',
            'Toque com balanço swingado (tercinas de colcheia).',
          ],
          fingeringTip: 'Digitação da Escala de Blues: 1 (C) ➔ 2 (E♭) ➔ 3 (F) ➔ 4 (F#) ➔ 1 (G) ➔ 3 (B♭).',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 63, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'Eb4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'F4' },
          { midi: 66, clef: 'treble', duration: 0.5, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'F#4' },
          { midi: 67, clef: 'treble', duration: 1.5, beat: 4.5, measure: 1, fingerRightHand: 1, noteName: 'G4' },
          { midi: 70, clef: 'treble', duration: 2, beat: 1, measure: 2, fingerRightHand: 3, noteName: 'Bb4' },
          { midi: 72, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 5, noteName: 'C5' },
        ],
      },
      {
        id: 't9-2',
        moduleCode: 'T9',
        title: 'Lição 9.2: O Baixo Shuffle Ostinato (Boogie-Woogie)',
        subtitle: 'A independência motora máxima: mão esquerda no piloto automático',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'O Motor Rítmico do Boogie',
          text: 'O baixo caminha alternando entre a 5ª e a 6ª justa: C-G, C-A, C-G, C-A.',
          bulletPoints: [
            'Mão esquerda mantém o ritmo estrito sem flutuar nem 1 milissegundo.',
            'Mão direita responde com acordes de 7ª pontuados no tempo fraco.',
            'O segredo do boogie é não pensar na mão esquerda: deixe-a como um metrônomo biológico.',
          ],
          fingeringTip: 'Mão esquerda: 5-1 no C-G e 5-1 no C-A abrindo suavemente a mão.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 55, clef: 'bass', duration: 1, beat: 2, measure: 1, fingerLeftHand: 1, noteName: 'G3' },
          { midi: 48, clef: 'bass', duration: 1, beat: 3, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 57, clef: 'bass', duration: 1, beat: 4, measure: 1, fingerLeftHand: 1, noteName: 'A3' },
        ],
      },
      {
        id: 't9-3',
        moduleCode: 'T9',
        title: 'Lição 9.3: Bossa Nova Brasileira: Garota de Ipanema (Tom Jobim)',
        subtitle: 'Síncopa flutuante com acordes de Sétima Maior (Fmaj7 e G7)',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'Garota de Ipanema (Tom Jobim & Vinicius)',
          text: 'O clássico mundial que levou a síncopa brasileira ao topo das paradas.',
          bulletPoints: [
            'A melodia inicia no tempo 1 e antecipa o balanço nos tempos fracos.',
            'Acordes sofisticados: Fmaj7 (Fá, Lá, Dó, Mi) e G7 (Sol, Si, Ré, Fá).',
            'Toque com toque aveludado, sofisticado e relaxado.',
          ],
          fingeringTip: 'Fraseado leve e suave, sem agressividade no ataque.',
        },
        scoreTrack: [
          { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'F2' },
          { midi: 69, clef: 'treble', duration: 1.5, beat: 1, measure: 1, fingerRightHand: 3, noteName: 'A4', chordName: 'Fmaj7' },
          { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, fingerRightHand: 2, noteName: 'G4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 2, noteName: 'G4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 1, noteName: 'E4' },

          { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2' },
          { midi: 67, clef: 'treble', duration: 1.5, beat: 1, measure: 2, fingerRightHand: 2, noteName: 'G4', chordName: 'G7' },
          { midi: 65, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, fingerRightHand: 1, noteName: 'F4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 2, fingerRightHand: 1, noteName: 'F4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, fingerRightHand: 1, noteName: 'D4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO T10: Expressão Dinâmica, Pedal de Sustain & Maestria
  // -------------------------------------------------------------
  {
    id: 'mod-t10',
    instrument: 'keyboard',
    code: 'T10',
    title: 'Expressão Dinâmica, Pedal de Sustain & Maestria',
    phase: 'Fase 10: Maestria e Interpretação Emocional',
    iconName: 'Crown',
    lessons: [
      {
        id: 't10-1',
        moduleCode: 'T10',
        title: 'Lição 10.1: A Física e o Timing do Pedal de Sustain',
        subtitle: 'Troque o pedal de forma limpa sem borrar a harmonia',
        level: 'Avançado',
        durationMinutes: 18,
        instructions: {
          heading: 'O "Pedal Sincopado" (Pedale Tardio)',
          text: 'O erro comum é abaixar o pé junto com a mão ao tocar o acorde.',
          bulletPoints: [
            'Abaixe a mão na nova tecla PRIMEIRO.',
            'No exato instante em que o novo som soa, levante o pé rapidamente para limpar o acorde anterior e abaixe-o novamente.',
            'O pedal nunca limpa antes da nova nota: ele limpa no momento exato em que a nova nota nasce.',
          ],
          fingeringTip: 'Mantenha o calcanhar sempre firme no chão, usando apenas a ponta do pé no pedal.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4', chordName: 'C' },
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, fingerLeftHand: 5, noteName: 'C3' },
          { midi: 59, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'B3', chordName: 'G' },
          { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 2, fingerLeftHand: 5, noteName: 'G2' },
        ],
      },
      {
        id: 't10-2',
        moduleCode: 'T10',
        title: 'Lição 10.2: A Escala de Dinâmica: Pianíssimo ao Fortíssimo',
        subtitle: 'De pp a ff: transforme notas mecânicas em pura emoção humana',
        level: 'Avançado',
        durationMinutes: 18,
        instructions: {
          heading: 'As 6 Camadas de Intensidade Sonora',
          text: 'Pianissimo (pp), Piano (p), Mezzo-piano (mp), Mezzo-forte (mf), Forte (f), Fortissimo (ff).',
          bulletPoints: [
            'O volume do piano acústico e digital depende da velocidade com que o martelo atinge a corda (Velocity).',
            'Toque o tema principal em Mezzo-forte (mf) e o acompanhamento suavemente em Piano (p).',
            'Crescendo (<) e Decrescendo (>): desenhe arcos dinâmicos que contam uma história.',
          ],
          fingeringTip: 'Para tocar piano (suave), desça a tecla com lentidão e controle, nunca com fraqueza muscular.',
        },
        scoreTrack: [
          { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 5, noteName: 'G4' },
          { midi: 72, clef: 'treble', duration: 4, beat: 1, measure: 2, fingerRightHand: 5, noteName: 'C5' },
        ],
      },
      {
        id: 't10-3',
        moduleCode: 'T10',
        title: 'Lição 10.3: Peça de Concerto Integrada: Für Elise (Beethoven)',
        subtitle: 'A consagração do pianista: sintetize técnica, dinâmica e fraseado',
        level: 'Avançado',
        durationMinutes: 25,
        instructions: {
          heading: 'Für Elise (Bagatela em Lá Menor)',
          text: 'A obra clássica mais querida de todos os tempos. Requer toque perolado nos semitons cromáticos e baixo arpejado suave.',
          bulletPoints: [
            'Motivo inicial: Mi5 (dedo 5) e Ré#5 (dedo 4) repetidos com toque levíssimo.',
            'Mão esquerda entra com o arpejo Lá-Mi-Lá em semínimas.',
            'Execute o ritardando sutil no final da frase para respirar com a plateia.',
          ],
          fingeringTip: 'E5 (5) ➔ D#5 (4) ➔ E5 (5) ➔ D#5 (4) ➔ E5 (5) ➔ B4 (2) ➔ D5 (4) ➔ C5 (3) ➔ A4 (1).',
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
];

// ============================================================================
// CURSO COMPLETO DE VIOLÃO: EMENTA PEDAGÓGICA (V1 a V10 - 30 LIÇÕES)
// ============================================================================
export const GUITAR_COURSE_MODULES: CourseModule[] = [
  // -------------------------------------------------------------
  // MÓDULO V1: Anatomia, Afinação & Som Cristalino
  // -------------------------------------------------------------
  {
    id: 'mod-v1',
    instrument: 'guitar',
    code: 'V1',
    title: 'Anatomia, Afinação & Som Cristalino',
    phase: 'Fase 1: Conexão Inicial & Som Limpo',
    iconName: 'Guitar',
    lessons: [
      {
        id: 'v1-1',
        moduleCode: 'V1',
        title: 'Lição 1.1: Mecânica dos Dedos Junto ao Traste',
        subtitle: 'Elimine de vez o som zumbido (fret buzz) sem fazer força bruta',
        level: 'Iniciante',
        durationMinutes: 10,
        instructions: {
          heading: 'Onde Pressionar na Casa do Violão?',
          text: 'O erro nº 1 de quem começa é apertar no meio da casa com força excessiva, machucando a ponta dos dedos.',
          bulletPoints: [
            'Posicione a ponta do dedo imediatamente ANTES do ferrinho (traste metálico).',
            'Quanto mais perto do traste você posicionar o dedo, menor será a força necessária para obter som limpo.',
            'O polegar atrás do braço deve funcionar como um eixo de pinça suave, na metade da largura do braço.',
          ],
          fingeringTip: 'Mão esquerda: use a ponta óssea dos dedos 1, 2, 3 e 4 perpendicularmente ao braço.',
          postureAlert: 'Não deite os dedos sobre as cordas vizinhas! Mantenha as articulações arqueadas.',
        },
        scoreTrack: [
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 1, fingerRightHand: 2, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 3, noteName: 'F4' },
          { midi: 67, clef: 'treble', duration: 2, beat: 3, measure: 1, fingerRightHand: 5, noteName: 'G4' },
        ],
      },
      {
        id: 'v1-2',
        moduleCode: 'V1',
        title: 'Lição 1.2: A Mão Direita: Técnica de Apoio e Sem Apoio (P-I-M-A)',
        subtitle: 'O ataque correto dos bordões com o polegar e das primas com os dedos',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'A Mecânica P-I-M-A',
          text: 'P = Polegar (toca os bordões: cordas 6, 5 e 4). I = Indicador, M = Médio, A = Anelar (tocam as cordas 3, 2 e 1).',
          bulletPoints: [
            'O polegar ataca para baixo, saindo do caminho dos outros dedos.',
            'Indicador, médio e anelar puxam para cima em gancho suave em direção à palma.',
            'O pulso da mão direita fica levemente arqueado, nunca colado no tampo do violão.',
          ],
          fingeringTip: 'Pratique o dedilhado P-I-M-A com cordas soltas até o som soar límpido como água.',
        },
        scoreTrack: [
          { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E2' },
          { midi: 55, clef: 'treble', duration: 1, beat: 2, measure: 1, fingerRightHand: 2, noteName: 'G3' },
          { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 1, fingerRightHand: 3, noteName: 'B3' },
          { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 1, fingerRightHand: 4, noteName: 'E4' },
        ],
      },
      {
        id: 'v1-3',
        moduleCode: 'V1',
        title: 'Lição 1.3: Afinação Precisa & As 6 Cordas do Violão',
        subtitle: 'Decore as notas fundamentais das 6 cordas (Mi, Lá, Ré, Sol, Si, Mi)',
        level: 'Iniciante',
        durationMinutes: 10,
        instructions: {
          heading: 'O Padrão E-A-D-G-B-E',
          text: 'As 6 cordas são numeradas da mais fina (1ª) para a mais grossa (6ª).',
          bulletPoints: [
            '1ª Corda (aguda): Mi (E4).',
            '2ª Corda: Si (B3).',
            '3ª Corda: Sol (G3).',
            '4ª Corda: Ré (D3).',
            '5ª Corda: Lá (A2).',
            '6ª Corda (grave): Mi (E2).',
          ],
          fingeringTip: 'Memorize a frase de ouro: "Ele Andava De Guarda-chuva Bem Elegante".',
        },
        scoreTrack: [
          { midi: 40, clef: 'bass', duration: 2, beat: 1, measure: 1, fingerRightHand: 1, noteName: 'E2' },
          { midi: 45, clef: 'bass', duration: 2, beat: 3, measure: 1, fingerRightHand: 1, noteName: 'A2' },
          { midi: 50, clef: 'bass', duration: 2, beat: 1, measure: 2, fingerRightHand: 1, noteName: 'D3' },
          { midi: 55, clef: 'treble', duration: 2, beat: 3, measure: 2, fingerRightHand: 2, noteName: 'G3' },
          { midi: 59, clef: 'treble', duration: 2, beat: 1, measure: 3, fingerRightHand: 3, noteName: 'B3' },
          { midi: 64, clef: 'treble', duration: 2, beat: 3, measure: 3, fingerRightHand: 4, noteName: 'E4' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V2: Primeiros Acordes Abertos & Técnica do Dedo Âncora
  // -------------------------------------------------------------
  {
    id: 'mod-v2',
    instrument: 'guitar',
    code: 'V2',
    title: 'Primeiros Acordes Abertos & Técnica do Dedo Âncora',
    phase: 'Fase 2: Acordes Abertos Sem Interrupções',
    iconName: 'Zap',
    lessons: [
      {
        id: 'v2-1',
        moduleCode: 'V2',
        title: 'Lição 2.1: A Tríade Essencial: C, Am e Em',
        subtitle: 'Troque de acordes sem tirar a mão do braço usando dedos âncora',
        level: 'Iniciante',
        durationMinutes: 14,
        instructions: {
          heading: 'O Princípio da Mão Estável',
          text: 'Ao trocar de Dó Maior (C) para Lá Menor (Am):',
          bulletPoints: [
            'O dedo 1 (2ª corda casa 1) e o dedo 2 (4ª corda casa 2) NÃO saem do lugar!',
            'Apenas o dedo 3 (anelar) se move da 5ª corda casa 3 para a 3ª corda casa 2.',
            'Isso economiza 70% do tempo de troca e mantém o ritmo estável sem engasgos.',
          ],
          fingeringTip: 'Mantenha os dedos 1 e 2 grudados nas cordas como trilhos de trem.',
        },
      },
      {
        id: 'v2-2',
        moduleCode: 'V2',
        title: 'Lição 2.2: O Dedo Pivô nas Trocas de Sol (G) e Ré (D)',
        subtitle: 'O dedo 3 como âncora na 2ª corda casa 3',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'A Conexão G ➔ D Mais Rápida do Mundo',
          text: 'Ao tocar Sol Maior (G) com quatro dedos e Ré Maior (D):',
          bulletPoints: [
            'O Dedo 3 fica fixo na 2ª corda casa 3 em ambos os acordes.',
            'Ele atua como uma âncora fixa enquanto os dedos 1 e 2 pulam com facilidade.',
            'Nunca retire a mão inteira para procurar a nova posição.',
          ],
          fingeringTip: 'Mantenha o dedo 3 pressionado com firmeza durante toda a transição.',
        },
      },
      {
        id: 'v2-3',
        moduleCode: 'V2',
        title: 'Lição 2.3: Exercício de Troca Rítmica Contínua no Tempo 4',
        subtitle: 'Como antecipar o movimento e nunca mais travar o ritmo da música',
        level: 'Iniciante',
        durationMinutes: 15,
        instructions: {
          heading: 'O Segredo da Troca Antecipada',
          text: 'O erro de quem começa é esperar o tempo 1 do próximo compasso para só então mover os dedos.',
          bulletPoints: [
            'No contratempo do tempo 4 ("e"), levante levemente os dedos preparando o novo shape.',
            'No tempo 1 exato, todos os dedos caem juntos como um carimbo no braço.',
            'Mesmo que o acorde não saia 100% limpo, NUNCA pare a mão direita do ritmo!',
          ],
          fingeringTip: 'A mão direita é o chefe: o ritmo não para nunca.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, noteName: 'C3', chordName: 'C' },
          { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 2, noteName: 'A2', chordName: 'Am' },
          { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 3, noteName: 'E2', chordName: 'Em' },
          { midi: 43, clef: 'bass', duration: 4, beat: 1, measure: 4, noteName: 'G2', chordName: 'G' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V3: O Motor do Ritmo: Levadas & Batidas Universais
  // -------------------------------------------------------------
  {
    id: 'mod-v3',
    instrument: 'guitar',
    code: 'V3',
    title: 'O Motor do Ritmo: Levadas & Batidas Universais',
    phase: 'Fase 3: Levadas Rítmicas & Batidas',
    iconName: 'Sliders',
    lessons: [
      {
        id: 'v3-1',
        moduleCode: 'V3',
        title: 'Lição 3.1: A Batida Pop/Folk 4/4 Universal',
        subtitle: '↓ ↓↑ ↑↓↑ — A levada mais tocada da história da música popular',
        level: 'Iniciante',
        durationMinutes: 15,
        instructions: {
          heading: 'O Movimento Contínuo de Pêndulo',
          text: 'Sua mão direita deve funcionar como um pêndulo constante que desce e sobe sem parar.',
          bulletPoints: [
            'Tempo 1: Baixo (↓).',
            'Tempo 2: Baixo (↓) e Cima (↑).',
            'Tempo 3: Movimento fantasma no tempo 3 e batida na subida (↑).',
            'Tempo 4: Baixo (↓) e Cima (↑).',
            'Fórmula clássica: Baixo, Baixo-Cima, Cima-Baixo-Cima.',
          ],
          fingeringTip: 'Use a unha do polegar para descer ou as unhas dos dedos indicador/médio para subir.',
        },
      },
      {
        id: 'v3-2',
        moduleCode: 'V3',
        title: 'Lição 3.2: O Balanço da Valsa em 3/4 no Violão',
        subtitle: 'Baixo no polegar e duas puxadas nas cordas agudas',
        level: 'Iniciante',
        durationMinutes: 12,
        instructions: {
          heading: 'O Ritmo Ternário no Violão',
          text: 'Padrão essencial para canções tradicionais, MPB e música caipira raiz.',
          bulletPoints: [
            'Tempo 1: Polegar toca o bordão grave correspondente ao acorde.',
            'Tempos 2 e 3: Dedos Indicador, Médio e Anelar puxam as 3 primeiras cordas simultaneamente.',
            'Sinta o balanço elegante do "Bum - Tchá - Tchá".',
          ],
          fingeringTip: 'Mantenha o polegar firme e as puxadas suaves com toque aveludado.',
        },
      },
      {
        id: 'v3-3',
        moduleCode: 'V3',
        title: 'Lição 3.3: O Som Percussivo com Palm Mute',
        subtitle: 'Apoie a lateral da mão na ponte para criar o groove abafado do pop e rock',
        level: 'Intermediário',
        durationMinutes: 14,
        instructions: {
          heading: 'A Técnica do Abafamento (Palm Mute)',
          text: 'Ao repousar a almofada carnuda da palma da mão direita exatamente onde as cordas encontram o rastilho:',
          bulletPoints: [
            'O som ganha um timbre percussivo e encorpado (thud).',
            'Excelente para estrofes de músicas pop antes do refrão explodir em som aberto.',
            'Controle a pressão: se apertar muito, o som morre; se apertar pouco, o som continua soando aberto.',
          ],
          fingeringTip: 'Mantenha a palhetada ou batida de polegar com precisão de metrônomo.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V4: O Fim do Bloqueio da Pestana (Biomecânica Sem Dor)
  // -------------------------------------------------------------
  {
    id: 'mod-v4',
    instrument: 'guitar',
    code: 'V4',
    title: 'O Fim do Bloqueio da Pestana (Biomecânica Sem Dor)',
    phase: 'Fase 4: Domínio da Pestana',
    iconName: 'ShieldCheck',
    lessons: [
      {
        id: 'v4-1',
        moduleCode: 'V4',
        title: 'Lição 4.1: A Física Real da Pestana: Peso do Braço e Borda do Osso',
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
      {
        id: 'v4-2',
        moduleCode: 'V4',
        title: 'Lição 4.2: Progressão Gradual: Da Casa 5 (Lá) à Casa 1 (Fá)',
        subtitle: 'Como desenvolver a calosidade e a resistência muscular sem lesões',
        level: 'Iniciante',
        durationMinutes: 15,
        instructions: {
          heading: 'O Treino Progressivo de Pestana',
          text: 'A casa 1 é a mais dura do violão porque fica colada na pestana de osso/plástico.',
          bulletPoints: [
            'Dia 1: Pratique a pestana na casa 7 (Si Maior).',
            'Dia 2: Desça para a casa 5 (Lá Maior).',
            'Dia 3: Desça para a casa 3 (Sol Maior).',
            'Dia 4: Conquiste a casa 1 (Fá Maior) com facilidade surpreendente.',
          ],
          fingeringTip: 'Treine 3 minutos por dia com foco total em som limpo corda por corda.',
        },
      },
      {
        id: 'v4-3',
        moduleCode: 'V4',
        title: 'Lição 4.3: O Acorde Si Menor (Bm) no Shape de Lá Menor',
        subtitle: 'A pestana de 5 cordas mais utilizada do cancioneiro popular',
        level: 'Intermediário',
        durationMinutes: 15,
        instructions: {
          heading: 'Pestana de 5 Cordas (Shape de Am)',
          text: 'No Si Menor (Bm), a pestana cobre da 5ª à 1ª corda na casa 2.',
          bulletPoints: [
            'A ponta do dedo indicador encosta suavemente na 6ª corda por baixo para abafá-la.',
            'Dedos 2, 3 e 4 montam o shape de Lá Menor na frente da pestana.',
            'O baixo fundamental soa na 5ª corda casa 2 (nota Si).',
          ],
          fingeringTip: 'Pestana casa 2 + dedo 2 (2ª corda casa 3), dedo 3 (4ª corda casa 4), dedo 4 (3ª corda casa 4).',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V5: O Sistema CAGED: O Braço Totalmente Decodificado
  // -------------------------------------------------------------
  {
    id: 'mod-v5',
    instrument: 'guitar',
    code: 'V5',
    title: 'O Sistema CAGED: O Braço Totalmente Decodificado',
    phase: 'Fase 5: Mapeamento Total do Braço',
    iconName: 'Layers',
    lessons: [
      {
        id: 'v5-1',
        moduleCode: 'V5',
        title: 'Lição 5.1: Os 5 Shapes Móveis (C-A-G-E-D)',
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
      {
        id: 'v5-2',
        moduleCode: 'V5',
        title: 'Lição 5.2: As Raízes de Referência nas Cordas 6, 5 e 4',
        subtitle: 'Encontre qualquer tom em 1 segundo no braço do violão',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'Os 3 Faróis do Braço do Violão',
          text: 'Você não precisa decorar as 120 notas do braço de uma vez: basta memorizar as cordas 6, 5 e 4.',
          bulletPoints: [
            'Corda 6: F (casa 1), G (casa 3), A (casa 5), B (casa 7), C (casa 8).',
            'Corda 5: C (casa 3), D (casa 5), E (casa 7), F (casa 8), G (casa 10).',
            'Corda 4: F (casa 3), G (casa 5), A (casa 7), B (casa 9), C (casa 10).',
          ],
          fingeringTip: 'Ao saber a raiz na corda 6, aplique o shape de E instantaneamente.',
        },
      },
      {
        id: 'v5-3',
        moduleCode: 'V5',
        title: 'Lição 5.3: Conectando os 5 Shapes pelo Braço Inteiro',
        subtitle: 'A visão holográfica: como transitar de C para Dó no braço todo',
        level: 'Avançado',
        durationMinutes: 22,
        instructions: {
          heading: 'A Trilha Conectada do CAGED',
          text: 'Os 5 formatos se conectam como peças de um quebra-cabeça ininterrupto ao longo do braço.',
          bulletPoints: [
            'Shape C se conecta no Shape A.',
            'Shape A se conecta no Shape G.',
            'Shape G se conecta no Shape E.',
            'Shape E se conecta no Shape D.',
            'Shape D volta a se conectar no Shape C uma oitava acima.',
          ],
          fingeringTip: 'Toque o acorde de Dó Maior subindo as 5 posições consecutivas.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V6: Condução de Baixos & Bordões Cromáticos
  // -------------------------------------------------------------
  {
    id: 'mod-v6',
    instrument: 'guitar',
    code: 'V6',
    title: 'Condução de Baixos & Bordões Cromáticos',
    phase: 'Fase 6: Harmonia Funcional no Braço',
    iconName: 'GitBranch',
    lessons: [
      {
        id: 'v6-1',
        moduleCode: 'V6',
        title: 'Lição 6.1: Condução de Baixos Cromáticos (C ➔ C/B ➔ Am ➔ Am/G)',
        subtitle: 'Crie linhas melódicas de contrabaixo com o polegar enquanto dedilha',
        level: 'Intermediário',
        durationMinutes: 16,
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
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 2, beat: 1, measure: 1, noteName: 'C3', chordName: 'C' },
          { midi: 47, clef: 'bass', duration: 2, beat: 3, measure: 1, noteName: 'B2', chordName: 'C/B' },
          { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 2, noteName: 'A2', chordName: 'Am' },
          { midi: 43, clef: 'bass', duration: 2, beat: 3, measure: 2, noteName: 'G2', chordName: 'Am/G' },
        ],
      },
      {
        id: 'v6-2',
        moduleCode: 'V6',
        title: 'Lição 6.2: Baixos Alternados (Country, Folk e Sertanejo)',
        subtitle: 'Alterne a raiz e a 5ª do acorde em ritmo contínuo de marcha',
        level: 'Intermediário',
        durationMinutes: 14,
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
      {
        id: 'v6-3',
        moduleCode: 'V6',
        title: 'Lição 6.3: Baixos Caminhantes (Walking Bass no Violão)',
        subtitle: 'Conecte acordes distantes com pequenas passagens cromáticas',
        level: 'Avançado',
        durationMinutes: 18,
        instructions: {
          heading: 'Aproximação Cromática',
          text: 'Para ir de Dó Maior para Fá Maior, em vez de pular direto, faça o baixo caminhar: C ➔ D ➔ D# ➔ E ➔ F.',
          bulletPoints: [
            'O baixo ganha vida própria e conduz o ouvinte suavemente até o próximo acorde.',
            'Padrão clássico do samba e choro brasileiro.',
            'Mantenha as notas do baixo staccato ou tenuto conforme o estilo.',
          ],
          fingeringTip: 'Sincronize o polegar com a respiração para manter o swing solto.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V7: Ritmos Brasileiros & Levadas com Groove
  // -------------------------------------------------------------
  {
    id: 'mod-v7',
    instrument: 'guitar',
    code: 'V7',
    title: 'Ritmos Brasileiros & Levadas com Groove',
    phase: 'Fase 7: Brasilidades & Síncopas Vivas',
    iconName: 'Sparkles',
    lessons: [
      {
        id: 'v7-1',
        moduleCode: 'V7',
        title: 'Lição 7.1: A Batida da Bossa Nova de João Gilberto',
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
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 1, noteName: 'C3', chordName: 'Cmaj7(9)' },
          { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'E4' },
          { midi: 71, clef: 'treble', duration: 1, beat: 2.5, measure: 1, noteName: 'B4' },
        ],
      },
      {
        id: 'v7-2',
        moduleCode: 'V7',
        title: 'Lição 7.2: O Samba Tradicional no Violão',
        subtitle: 'Batucada harmônica: o balanço do repique e do pandeiro nas cordas',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'A Levada do Samba Brasileiro',
          text: 'No samba, a acentuação principal cai no segundo tempo do compasso binário (2/4).',
          bulletPoints: [
            'O polegar toca o tempo 1 mais leve e desce com peso no tempo 2 (surdo de marcação).',
            'Os dedos I-M-A fazem pequenas puxadas e abafamentos sincopados.',
            'Acordes com 7ª e 9ª com pestana curta (sem a 1ª corda).',
          ],
          fingeringTip: 'Apoie o antebraço levemente no aro do violão para dar estabilidade ao balanço.',
        },
      },
      {
        id: 'v7-3',
        moduleCode: 'V7',
        title: 'Lição 7.3: Baião e Toada Nordestina (Luiz Gonzaga)',
        subtitle: 'O zabumba no polegar e o triângulo cortante nos dedos',
        level: 'Avançado',
        durationMinutes: 18,
        instructions: {
          heading: 'O Ritmo Ancestral do Sertão',
          text: 'O baião tem uma síncopa rítmica inconfundível: "Tum... Tá-Tum... Tá".',
          bulletPoints: [
            'O polegar ataca o bordão com força percussiva.',
            'Os dedos respondem com acordes curtos e secos (staccato).',
            'Modo Mixolídio clássico do Nordeste (escala com 7ª menor).',
          ],
          fingeringTip: 'Abra mão de floreios: o que comanda o baião é a firmeza do pulso.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V8: Fingerstyle & Polifonia de Cordas
  // -------------------------------------------------------------
  {
    id: 'mod-v8',
    instrument: 'guitar',
    code: 'V8',
    title: 'Fingerstyle & Polifonia de Cordas',
    phase: 'Fase 8: Dedilhado Solo & Expressão',
    iconName: 'Fingerprint',
    lessons: [
      {
        id: 'v8-1',
        moduleCode: 'V8',
        title: 'Lição 8.1: Padrões de Dedilhado Universal (P-I-M-A) & Travis Picking',
        subtitle: 'Faça o violão soar como dois músicos tocando juntos ao mesmo tempo',
        level: 'Intermediário',
        durationMinutes: 18,
        instructions: {
          heading: 'O Segredo da Polifonia no Violão',
          text: 'No fingerstyle moderno, o polegar executa a linha de contrabaixo enquanto os dedos tocam a melodia e o recheio harmônico.',
          bulletPoints: [
            'Padrão P-I-M-A circular: P (baixo) ➔ I (3ª) ➔ M (2ª) ➔ A (1ª) ➔ M (2ª) ➔ I (3ª).',
            'Travis Picking: o polegar salta alternadamente entre duas cordas graves em semínimas estritas.',
            'Mantenha as notas da melodia cantando mais alto que as notas de acompanhamento.',
          ],
          fingeringTip: 'Treine com metrônomo a 70 BPM até o movimento ser 100% automático.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 0.5, beat: 1, measure: 1, noteName: 'C3' },
          { midi: 55, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'G3' },
          { midi: 60, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'C4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'E4' },
          { midi: 60, clef: 'treble', duration: 0.5, beat: 3, measure: 1, noteName: 'C4' },
          { midi: 55, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, noteName: 'G3' },
        ],
      },
      {
        id: 'v8-2',
        moduleCode: 'V8',
        title: 'Lição 8.2: Clássico Imortal: Romance Anônimo (Romanza Espanhola)',
        subtitle: 'A peça espanhola mais famosa do mundo para violão clássico',
        level: 'Avançado',
        durationMinutes: 22,
        instructions: {
          heading: 'Romanza (Romance d\'Amour)',
          text: 'Melodia expressiva sustentada no anelar enquanto o polegar conduz o baixo e os dedos médio/indicador tecem o arpejo.',
          bulletPoints: [
            'Fórmula: P e A soam juntos no tempo 1 ➔ M ➔ I.',
            'Destaque o dedo anelar (A) para que a melodia cante como uma voz lírica.',
            'Mantenha os dedos da mão esquerda pousados com leveza nas casas 7, 5, 3 e 2.',
          ],
          fingeringTip: 'Mão direita: P + A simultâneos ➔ M ➔ I.',
        },
        scoreTrack: [
          { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 1, noteName: 'E2' },
          { midi: 71, clef: 'treble', duration: 1, beat: 1, measure: 1, noteName: 'B4' },
          { midi: 59, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'B3' },
          { midi: 55, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'G3' },
          { midi: 71, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'B4' },
        ],
      },
      {
        id: 'v8-3',
        moduleCode: 'V8',
        title: 'Lição 8.3: Villa-Lobos Essencial: Estudo nº 1 Adaptado',
        subtitle: 'O arpejo fluído que desenvolve a flexibilidade e velocidade dos grandes mestres',
        level: 'Avançado',
        durationMinutes: 25,
        instructions: {
          heading: 'O Monumento de Heitor Villa-Lobos',
          text: 'Composto em Paris em 1928, é o exercício de agilidade de mão direita mais célebre da história do violão.',
          bulletPoints: [
            'O arpejo sobe P-I-M-A e desce M-I em velocidade contínua.',
            'A mão esquerda muda pequenas notas pivô enquanto a direita mantém o fluxo como uma cascata de água.',
            'Relaxe o polegar para não criar tensão nos flexores do antebraço.',
          ],
          fingeringTip: 'Ataque suave sem puxar a corda contra a madeira: faça a corda vibrar paralelamente ao tampo.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V9: Escalas Pentatônicas, Solos & Articulações Expressivas
  // -------------------------------------------------------------
  {
    id: 'mod-v9',
    instrument: 'guitar',
    code: 'V9',
    title: 'Escalas Pentatônicas, Solos & Articulações Expressivas',
    phase: 'Fase 9: Solos & Improvisação Melódica',
    iconName: 'Zap',
    lessons: [
      {
        id: 'v9-1',
        moduleCode: 'V9',
        title: 'Lição 9.1: Os 5 Desenhos da Pentatônica Conectados ao CAGED',
        subtitle: 'Improvise solos fluidos com precisão cirúrgica em qualquer tom',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'A Sobreposição Perfeita: Pentatônica + CAGED',
          text: 'Cada um dos 5 desenhos da escala pentatônica encaixa perfeitamente em cima de um shape do CAGED.',
          bulletPoints: [
            'Padrão 1: Encaixa sobre o Shape de E (ex: casa 5 a 8 em Lá Menor).',
            'Padrão 2: Encaixa sobre o Shape de D.',
            'Padrão 3: Encaixa sobre o Shape de C.',
            'Padrão 4: Encaixa sobre o Shape de A.',
            'Padrão 5: Encaixa sobre o Shape de G.',
          ],
          fingeringTip: 'Memorize as notas fundamentais dentro de cada shape para saber onde pousar com segurança.',
        },
        scoreTrack: [
          { midi: 57, clef: 'treble', duration: 0.5, beat: 1, measure: 1, noteName: 'A3' },
          { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'E4' },
          { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 1, noteName: 'G4' },
          { midi: 69, clef: 'treble', duration: 1.5, beat: 3.5, measure: 1, noteName: 'A4' },
        ],
      },
      {
        id: 'v9-2',
        moduleCode: 'V9',
        title: 'Lição 9.2: Técnicas de Expressão: Hammer-on, Pull-off e Slide',
        subtitle: 'Faça suas frases soarem vocais, fluidas e cheias de emoção',
        level: 'Avançado',
        durationMinutes: 18,
        instructions: {
          heading: 'As Articulações Vocais da Guitarra',
          text: 'Tocar palhetando nota por nota soa mecânico. As ligaduras dão velocidade e expressividade humana.',
          bulletPoints: [
            'Hammer-on (Ligadura Ascendente): martele o dedo com firmeza na casa sem tocar novamente na mão direita.',
            'Pull-off (Ligadura Descendente): puxe a corda ligeiramente para baixo como se beliscasse a corda com o dedo que sai.',
            'Slide: deslize o dedo suavemente mantendo a pressão até a casa de destino.',
          ],
          fingeringTip: 'Mantenha o polegar firme como fulcro no centro do braço.',
        },
      },
      {
        id: 'v9-3',
        moduleCode: 'V9',
        title: 'Lição 9.3: Blues Solo em Mi Menor / Lá Menor',
        subtitle: 'Bends de meio tom, vibrato largo e perguntas/respostas melódicas',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'A Alma do Blues no Violão',
          text: 'O blues não é sobre tocar rápido: é sobre o silêncio, a intenção e a expressão de cada nota.',
          bulletPoints: [
            'Use o bend de meio tom para aproximar a 4ª da 5ª diminuta (Blue Note).',
            'O vibrato largo com o antebraço dá sustentação e calor sonoro.',
            'Construa frases em formato de Pergunta (tensa) e Resposta (resolvida na fundamental).',
          ],
          fingeringTip: 'Use os dedos 2 e 1 como apoio atrás do dedo 3 para dar força nos bends.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // MÓDULO V10: Harmonia Funcional, Tétrades & Chord Melody
  // -------------------------------------------------------------
  {
    id: 'mod-v10',
    instrument: 'guitar',
    code: 'V10',
    title: 'Harmonia Funcional, Tétrades & Chord Melody',
    phase: 'Fase 10: Maestria & Violão Solo',
    iconName: 'Crown',
    lessons: [
      {
        id: 'v10-1',
        moduleCode: 'V10',
        title: 'Lição 10.1: Acordes com Sétima e Nona (maj7, 7, m7 e 9) no Violão',
        subtitle: 'As aberturas harmônicas mais sofisticadas do Jazz e da MPB',
        level: 'Avançado',
        durationMinutes: 20,
        instructions: {
          heading: 'Voicings Fechados e Abertos no Braço',
          text: 'No violão moderno, eliminamos cordas dobradas para focar apenas nas notas essenciais (Fundamental, 3ª e 7ª).',
          bulletPoints: [
            'Shape Drop 2 e Drop 3 nas quatro cordas do meio (cordas 5, 4, 3 e 2).',
            'Cmaj7: 5ª corda casa 3 (C), 4ª corda casa 5 (G), 3ª corda casa 4 (B), 2ª corda casa 5 (E).',
            'G7: 6ª corda casa 3 (G), 4ª corda casa 3 (F), 3ª corda casa 4 (B), 2ª corda casa 3 (D).',
          ],
          fingeringTip: 'Abra mão de tocar a 1ª corda quando tocar voicings modernos de jazz.',
        },
      },
      {
        id: 'v10-2',
        moduleCode: 'V10',
        title: 'Lição 10.2: Introdução ao Chord Melody: Melodia e Harmonia Juntas',
        subtitle: 'Toque o arranjo completo sozinho: a nota mais aguda é a melodia cantada',
        level: 'Avançado',
        durationMinutes: 22,
        instructions: {
          heading: 'A Arte do Chord Melody',
          text: 'No Chord Melody, o violonista atua como cantor e banda ao mesmo tempo.',
          bulletPoints: [
            'A nota melódica que o ouvinte acompanha fica SEMPRE na corda mais aguda do acorde (1ª ou 2ª corda).',
            'Embaixo da nota melódica, seus outros dedos posicionam o baixo e as notas guias (3ª e 7ª).',
            'Você não precisa tocar acordes em todos os tempos: sustente a harmonia e dedilhe a melodia solta.',
          ],
          fingeringTip: 'Planeje as digitações com foco na sustentação da voz superior.',
        },
      },
      {
        id: 'v10-3',
        moduleCode: 'V10',
        title: 'Lição 10.3: Peça de Formatura: Asa Branca em Fingerstyle & Bossa',
        subtitle: 'A consagração do violonista: o hino de Luiz Gonzaga em arranjo solo de concerto',
        level: 'Avançado',
        durationMinutes: 25,
        instructions: {
          heading: 'Asa Branca (Humberto Teixeira & Luiz Gonzaga)',
          text: 'O monumento cultural do Brasil arranjado em solo completo com baixos caminhantes e acordes encorpados.',
          bulletPoints: [
            'Tema melódico clássico nas cordas 2 e 1 acompanhado por baixos marcados no polegar.',
            'Variação harmônica sofisticada passando por C, C7, F, G7 e Am.',
            'Finalize com harmônicos naturais na casa 12 com som etéreo e brilhante.',
          ],
          fingeringTip: 'Toque com alma e respeito à história e à força da música brasileira.',
        },
        scoreTrack: [
          { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 1, noteName: 'C3' },
          { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, noteName: 'C4' },
          { midi: 62, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'D4' },
          { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, noteName: 'E4', chordName: 'C' },
          { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'G4' },
          { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'G4' },

          { midi: 41, clef: 'bass', duration: 4, beat: 1, measure: 2, noteName: 'F2' },
          { midi: 64, clef: 'treble', duration: 1, beat: 1, measure: 2, noteName: 'E4' },
          { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, noteName: 'F4' },
          { midi: 65, clef: 'treble', duration: 2, beat: 3, measure: 2, noteName: 'F4', chordName: 'F' },
        ],
      },
    ],
  },
];
