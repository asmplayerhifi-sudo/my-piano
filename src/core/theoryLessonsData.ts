// Base de Dados Didática para o Curso e Seção Completa de Estudos de Teoria Musical
// Abrange da física acústica elementar até a harmonia funcional e modos gregos avançados

export interface AudioExample {
  title: string;
  description: string;
  notes?: number[];            // Array linear de MIDIs (melodias e notas individuais)
  chords?: number[][];         // Lista estruturada de acordes: ex [[60, 64, 67], [65, 69, 72]]
  chordNames?: string[];       // Nomes dos acordes para exibição visual
  type: 'melodic' | 'harmonic' | 'cadence' | 'comparison';
  duration?: number;
  tempoMs?: number;            // Intervalo entre notas ou acordes (ms)
  noteDurationsMs?: number[];  // Durações personalizadas para ritmos
}

export interface TheoryQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TheoryLesson {
  id: string;
  moduleCode: string;
  moduleTitle: string;
  modulePhase: string;
  title: string;
  subtitle: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  readingTimeMinutes: number;
  summary: string;
  keyTakeaway: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
    formulaOrBox?: string;
  }>;
  goldenRule: string;
  audioExamples?: AudioExample[];
  quiz: TheoryQuiz;
}

export interface TheoryModuleData {
  code: string;
  title: string;
  phase: string;
  iconName: string;
  description: string;
  lessons: TheoryLesson[];
}

export const THEORY_MODULES: TheoryModuleData[] = [
  // =========================================================================
  // MÓDULO 1: Fundamentos do Som, Notação & Pentagrama
  // =========================================================================
  {
    code: 'M1',
    title: 'Fundamentos do Som, Notação & Pentagrama',
    phase: 'Fase 1: Alfabetização Musical',
    iconName: 'Compass',
    description: 'A física acústica do som, as 4 propriedades musicais, leitura nas claves de Sol e Fá e métrica de tempo.',
    lessons: [
      {
        id: 'm1-1',
        moduleCode: 'M1',
        moduleTitle: 'Fundamentos do Som, Notação & Pentagrama',
        modulePhase: 'Fase 1: Alfabetização Musical',
        title: 'As 4 Propriedades do Som & A Física da Música',
        subtitle: 'Como o ar vibrando se transforma na experiência sonora da música',
        level: 'Iniciante',
        readingTimeMinutes: 5,
        summary: 'Toda música que ouvimos é vibração física transmitida pelo ar. O cérebro humano decodifica essas ondas através de quatro propriedades fundamentais: Altura, Duração, Intensidade e Timbre.',
        keyTakeaway: 'Altura é frequência (grave vs agudo); Duração é tempo; Intensidade é amplitude (volume); Timbre é a impressão digital acústica do instrumento.',
        sections: [
          {
            heading: '1. As Quatro Dimensões do Som',
            paragraphs: [
              'O som é uma onda mecânica provocada pela vibração de um corpo sonoro (as cordas de um piano ou violão, a coluna de ar em uma flauta, ou as cordas vocais). Ao se propagar pelo ar, chega aos nossos tímpanos e gera impulsos elétricos decodificados pelo cérebro.',
              'Para dominar a teoria musical, o músico precisa compreender as 4 qualidades inseparáveis de qualquer som:'
            ],
            bulletPoints: [
              'Altura: Determinada pela frequência de vibração, medida em Hertz (Hz). Quanto mais rápida a vibração, mais AGUDO o som; quanto mais lenta, mais GRAVE. O Dó central (C3) vibra por volta de 261.6 Hz, enquanto o Lá de afinação (A3 a 440 Hz) vibra com precisão.',
              'Duração: O tempo durante o qual o som é sustentado. Na partitura, é representado pelas figuras rítmicas (semibreve, mínima, semínima, colcheia).',
              'Intensidade: A energia ou amplitude da onda sonoro (volume). Representada na música por sinais de dinâmica: Pianíssimo (pp), Piano (p), Mezzo-forte (mf), Forte (f) e Fortíssimo (ff).',
              'Timbre: A "cor" do som. É a característica que nos permite distinguir perfeitamente um Dó tocado em um piano de cauda de um Dó tocado em um violão ou saxofone, mesmo estando na mesmíssima altura e intensidade. O timbre é gerado pela combinação única de harmônicos (Série Harmônica).'
            ]
          }
        ],
        goldenRule: 'Nunca confunda Altura com Intensidade! Na música clássica e popular, "tocar mais alto" significa tocar mais agudo, enquanto tocar com mais força é "tocar com maior intensidade".',
        audioExamples: [
          {
            title: 'Contraste Grave vs Agudo (Altura)',
            description: 'Ouça o contraste de frequência entre um Dó grave (C2) e um Dó agudo (C5).',
            notes: [36, 72],
            noteDurationsMs: [800, 900],
            type: 'melodic'
          },
          {
            title: 'Ouvir Lá de Afinação Universal (A4 - 440 Hz)',
            description: 'A frequência padrão internacional de calibração orquestral e de instrumentos.',
            notes: [69],
            noteDurationsMs: [1200],
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Qual propriedade nos permite distinguir dois instrumentos diferentes tocando a mesma nota na mesma altura e no mesmo volume?',
          options: ['Intensidade', 'Timbre', 'Duração', 'Frequência'],
          correctIndex: 1,
          explanation: 'O Timbre é a identidade sonora do instrumento gerada pela composição da série harmônica, permitindo reconhecer piano, violão ou saxofone.'
        }
      },
      {
        id: 'm1-2',
        moduleCode: 'M1',
        moduleTitle: 'Fundamentos do Som, Notação & Pentagrama',
        modulePhase: 'Fase 1: Alfabetização Musical',
        title: 'A Pauta Musical, Claves de Sol e Fá e Linhas Suplementares',
        subtitle: 'A cartografia bidimensional da notação ocidental',
        level: 'Iniciante',
        readingTimeMinutes: 6,
        summary: 'A partitura utiliza o Pentagrama (5 linhas e 4 espaços) para mapear o tempo no eixo horizontal e a altura no eixo vertical. As Claves servem como pontos de referência para batizar as linhas.',
        keyTakeaway: 'A Clave de Sol fixa a nota Sol na 2ª linha (mão direita no piano / violão). A Clave de Fá fixa a nota Fá na 4ª linha (mão esquerda / contrabaixo).',
        sections: [
          {
            heading: '1. O Pentagrama e a Leitura de Baixo para Cima',
            paragraphs: [
              'O pentagrama tradicional é composto por 5 linhas horizontais paralelas e 4 espaços entre elas, contados sempre de baixo para cima (1ª linha na base, 5ª linha no topo).',
              'Cada linha ou espaço sucessivo representa o salto de uma nota diatônica (segunda natural). Para sons muito agudos ou muito graves que ultrapassam os limites das 5 linhas, utilizamos as Linhas Suplementares Superiores e Inferiores.'
            ],
            bulletPoints: [
              'Clave de Sol: Usada para instrumentos de registro médio e agudo (violão, flauta, violino, mão direita do piano). Seu desenho começa na 2ª linha, batizando-a como Sol3 (G3).',
              'Clave de Fá: Usada para instrumentos graves (violoncelo, contrabaixo, mão esquerda do piano). Os dois pontos circundam a 4ª linha, batizando-a como Fá2 (F2).',
              'O Sistema de Grande Pauta (Grand Staff): Une a Clave de Sol (acima) e a Clave de Fá (abaixo). O Dó Central (C3) fica exatamente entre as duas pautas sobre uma linha suplementar neutra.'
            ]
          }
        ],
        goldenRule: 'O Dó Central (C3) é a ponte cósmica entre a Clave de Sol e a Clave de Fá.',
        audioExamples: [
          {
            title: 'Grande Pauta: Do Grave da Clave de Fá ao Agudo da Clave de Sol',
            description: 'Ouça o percurso sonoro que conecta Fá2 (Clave de Fá), Dó Central e Sol3 (Clave de Sol).',
            notes: [41, 60, 67],
            noteDurationsMs: [750, 750, 850],
            type: 'melodic'
          },
          {
            title: 'Dó Central — O Ponto de Encontro',
            description: 'A nota fundamental de referência desenhada na linha suplementar central entre as duas claves.',
            notes: [60],
            noteDurationsMs: [1200],
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Em qual linha do pentagrama a Clave de Sol fixa o seu ponto de referência?',
          options: ['1ª linha', '2ª linha', '3ª linha', '4ª linha'],
          correctIndex: 1,
          explanation: 'O desenho da Clave de Sol tem sua espiral originada na 2ª linha, definindo que toda nota pousada nessa linha chama-se Sol.'
        }
      },
      {
        id: 'm1-3',
        moduleCode: 'M1',
        moduleTitle: 'Fundamentos do Som, Notação & Pentagrama',
        modulePhase: 'Fase 1: Alfabetização Musical',
        title: 'Figuras Musicais, Pausas, Equivalências e Regras de Notação',
        subtitle: 'As 7 figuras, valores negativos (silêncios), regras caligráficas, ligaduras e compassos',
        level: 'Iniciante',
        readingTimeMinutes: 8,
        summary: 'O ritmo musical é governado pela relação proporcional entre 7 figuras de som (valores positivos) e seus silêncios correspondentes (valores negativos). Sinais de alteração como ligadura, ponto de aumento e staccato expandem a expressividade temporal.',
        keyTakeaway: '1 Semibreve = 2 Mínimas = 4 Semínimas = 8 Colcheias = 16 Semicolcheias = 32 Fusas = 64 Semifusas. Hastes abaixo da 3ª linha sobem à direita (d); acima descem à esquerda (q).',
        sections: [
          {
            heading: '1. As 7 Figuras de Som e suas Pausas (Valores Positivos e Negativos)',
            paragraphs: [
              'Na notação musical ocidental, a duração é expressa por dois grupos complementares de símbolos: os Valores Positivos (notas que soam, emitindo vibração acústica) e os Valores Negativos (pausas que indicam silêncio absoluto com idêntica correspondência temporal).',
              'Cada figura completa é constituída por até três elementos anatômicos: a Cabeça da nota (elipse vazada ou preenchida), a Haste (traço vertical) e o Colchete ou Bandeirola (gancho curvado preso à ponta da haste).'
            ],
            formulaOrBox:
`TABELA OFICIAL DAS 7 FIGURAS E SUAS PAUSAS CORRESPONDENTES:
┌──────────────┬────────┬────────┬─────────────────────────┬──────────────────────────────┐
│ FIGURA       │ NÚMERO │ RAZÃO  │ VALOR POSITIVO (SOM)    │ VALOR NEGATIVO (PAUSA)       │
├──────────────┼────────┼────────┼─────────────────────────┼──────────────────────────────┤
│ Semibreve    │   1    │   1    │ Cabeça branca sem haste │ Retângulo sob a 4ª linha     │
│ Mínima       │   2    │  1/2   │ Cabeça branca com haste │ Retângulo sobre a 3ª linha   │
│ Semínima     │   4    │  1/4   │ Cabeça preta com haste  │ Símbolo sinuoso (estilo raio)│
│ Colcheia     │   8    │  1/8   │ Haste com 1 bandeirola  │ Haste com 1 gancho à esquerda│
│ Semicolcheia │  16    │  1/16  │ Haste com 2 bandeirolas │ Haste com 2 ganchos paralelos│
│ Fusa         │  32    │  1/32  │ Haste com 3 bandeirolas │ Haste com 3 ganchos paralelos│
│ Semifusa     │  64    │  1/64  │ Haste com 4 bandeirolas │ Haste com 4 ganchos paralelos│
└──────────────┴────────┴────────┴─────────────────────────┴──────────────────────────────┘`,
            bulletPoints: [
              'Semibreve (Número 1 • Razão 1): A figura de maior valor do sistema moderno. Ocupa 4 tempos no compasso 4/4. Sua pausa fica suspensa abaixo da 4ª linha do pentagrama.',
              'Mínima (Número 2 • Razão 1/2): Vale a metade da semibreve (2 tempos no 4/4). Sua pausa é um retângulo repousado sobre a 3ª linha.',
              'Semínima (Número 4 • Razão 1/4): Representa a pulsação básica padrão (1 tempo no 4/4). Sua pausa é desenhada com um traço sinuoso vertical central.',
              'Colcheia (Número 8 • Razão 1/8): Vale metade da semínima (½ tempo no 4/4). Possui 1 bandeirola. Sua pausa tem 1 gancho à esquerda.',
              'Semicolcheia (Número 16 • Razão 1/16): Vale ¼ de tempo no 4/4. Possui 2 bandeirolas paralelas. Sua pausa tem 2 ganchos.',
              'Fusa (Número 32 • Razão 1/32): Vale ⅛ de tempo no 4/4. Possui 3 bandeirolas paralelas. Sua pausa tem 3 ganchos.',
              'Semifusa (Número 64 • Razão 1/64): A menor divisão rítmica habitual, valendo 1/16 de tempo no 4/4. Possui 4 bandeirolas. Sua pausa tem 4 ganchos.'
            ]
          },
          {
            heading: '2. Pirâmide de Equivalências e Agrupamento por Barras de Ligação (Beams)',
            paragraphs: [
              'As figuras não possuem duração fixa em segundos; sua velocidade depende do andamento (BPM). O que permanece rigoroso é a proporção binária geométrica entre elas: cada figura equivale a 2 da figura imediatamente inferior e à metade da superior.',
              'Para facilitar a leitura à primeira vista, figuras rápidas com bandeirolas (colcheias, semicolcheias, fusas e semifusas) são unidas por Barras de Ligação horizontais contínuas (Beams), agrupando notas que pertencem ao mesmo tempo ou pulso métrico.'
            ],
            formulaOrBox:
`PIRÂMIDE DE EQUIVALÊNCIAS RELATIVAS:
1 Semibreve    = 2 Mínimas = 4 Semínimas = 8 Colcheias = 16 Semicolcheias = 32 Fusas = 64 Semifusas
1 Mínima       = 2 Semínimas = 4 Colcheias = 8 Semicolcheias = 16 Fusas = 32 Semifusas
1 Semínima     = 2 Colcheias = 4 Semicolcheias = 8 Fusas = 16 Semifusas
1 Colcheia     = 2 Semicolcheias = 4 Fusas = 8 Semifusas
1 Semicolcheia = 2 Fusas = 4 Semifusas
1 Fusa         = 2 Semifusas

FIGURAS AGRUPADAS (BARRAS DE LIGAÇÃO / BEAMS):
• 2 Colcheias     ➔ Unidas por 1 barra horizontal contínua
• 2 Semicolcheias ➔ Unidas por 2 barras horizontais paralelas
• 2 Fusas         ➔ Unidas por 3 barras horizontais paralelas
• 2 Semifusas     ➔ Unidas por 4 barras horizontais paralelas`,
            bulletPoints: [
              'Regra de Métrica: As barras de ligação organizam a leitura visual agrupando notas dentro do mesmo tempo ou compasso. Jamais devem cruzar travessões (barlines) e nunca devem ser aplicadas a figuras sem bandeirola (como mínimas).',
              'Clareza de Pulsação: O agrupamento orienta o cérebro a reconhecer instantaneamente onde começam e terminam os tempos fortes e fracos do compasso.'
            ]
          },
          {
            heading: '3. Regras Caligráficas de Grafia das Figuras e a Regra da 3ª Linha',
            paragraphs: [
              'A escrita no pentagrama segue normas caligráficas internacionais para manter a partitura legível e equilibrada, evitando que as hastes invadam sistemas vizinhos.',
              'A linha de equilíbrio do pentagrama é a 3ª linha (a nota Si na Clave de Sol). Ela atua como um espelho de inversão para a orientação das hastes.'
            ],
            formulaOrBox:
`REGRAS DE ORIENTAÇÃO DA HASTE:
• Abaixo da 3ª linha  ➔ Haste para CIMA pelo lado DIREITO   (formato visual da letra "d")
• Acima da 3ª linha   ➔ Haste para BAIXO pelo lado ESQUERDO (formato visual da letra "q")
• Na própria 3ª linha ➔ Direção CONTEXTUAL (segue o fluxo das notas vizinhas)
• Comprimento padrão  ➔ Aproximadamente 3,5 espaços do pentagrama (intervalo de 1 oitava)`,
            bulletPoints: [
              'Notas abaixo da 3ª linha: A haste é desenhada para cima e nasce no lado direito da cabeça (como a letra "d").',
              'Notas acima da 3ª linha: A haste é desenhada para baixo e nasce no lado esquerdo da cabeça (como a letra "q").',
              'Notas na 3ª linha: A haste pode ir para cima ou para baixo, orientada pela direção predominante das notas que compõem o desenho melódico.',
              'Bandeirolas Soltas: São sempre desenhadas voltadas para o lado direito da haste, curvadas para dentro em direção à cabeça, quer a haste aponte para cima ou para baixo.'
            ]
          },
          {
            heading: '4. Sinais de Modificação da Duração: Ponto de Aumento, Ligaduras e Staccato',
            paragraphs: [
              'A notação musical utiliza três recursos essenciais para expandir, conectar ou encurtar a duração original das notas sem alterar a pulsação do compasso:'
            ],
            formulaOrBox:
`SINAIS MODIFICADORES DE DURAÇÃO:
• Ponto de Aumento Simples (•)  ➔ +50% do valor da nota  (Ex: Semínima pontuada = 1 + 1/2 = 1,5 tempos)
• Ponto de Aumento Duplo (••)   ➔ +75% do valor da nota  (Ex: Mínima duplo ponto = 2 + 1 + 0,5 = 3,5 tempos)
• Ligadura de Prolongamento     ➔ Soma 2 notas de MESMA altura num som contínuo
• Ligadura de Fraseado (Legato) ➔ Conecta notas de ALTURAS DIFERENTES sem corte de articulação
• Ponto de Diminuição (Staccato)➔ Reduz 50% da duração em som e 50% em pausa (toque seco e leve)`,
            bulletPoints: [
              'Ponto de Aumento Simples: Posicionado à direita da cabeça da nota. Acrescenta a metade (+50%) do seu valor nominal. Exemplo: Mínima pontuada = 2 + 1 = 3 tempos.',
              'Ponto de Aumento Duplo: O segundo ponto acrescenta metade do valor do primeiro ponto (+25% do valor base). Exemplo: Mínima com ponto duplo = 2 + 1 + 0,5 = 3,5 tempos.',
              'Ligadura de Prolongamento (ou de Valor): Linha curva que une duas notas de MESMA altura e nome. Soma suas durações numa única nota sustentada. É a única forma de sustentar notas que ultrapassam a barra de compasso.',
              'Ligadura de Fraseado (ou Legato): Linha curva sobre notas de ALTURAS DIFERENTES. Não soma tempos; indica que as notas devem ser tocadas ligadas, sem articulação dura ou corte de ar entre elas.',
              'Ponto de Diminuição (Staccato): Ponto posicionado acima ou abaixo da cabeça da nota. Corta a sustentação da nota pela metade: 50% soa e os outros 50% viram pausa, produzindo articulação curta e destacada.'
            ]
          },
          {
            heading: '5. Fórmulas de Compasso e a Unidade de Tempo',
            paragraphs: [
              'A fórmula de compasso aparece no início da pauta musical logo após a clave e a armadura. É expressa por dois números dispostos verticalmente:',
              'O número SUPERIOR (numerador) indica QUANTOS tempos cabem em cada compasso (2, 3, 4, 6 tempos). O número INFERIOR (denominador) indica QUAL figura musical vale 1 tempo completo, utilizando o seu número identificador oficial (1=Semibreve, 2=Mínima, 4=Semínima, 8=Colcheia).'
            ],
            bulletPoints: [
              '4/4 (Quaternário Simples): 4 tempos por compasso, com a semínima valendo 1 tempo. O primeiro tempo é o mais forte de todos.',
              '3/4 (Ternário Simples): 3 tempos por compasso (forte - fraco - fraco). Ritmo característico de valsas e minuetos.',
              '2/4 (Binário Simples): 2 tempos por compasso. Métrica enérgica marcante em marchas, sambas e choros.',
              '6/8 (Binário Composto): 2 pulsos principais subdivididos em 3 colcheias cada (a semínima pontuada vale 1 tempo composto).'
            ]
          }
        ],
        goldenRule: 'A Semibreve rege a matemática rítmica ocidental: todos os denominadores de compasso (1, 2, 4, 8, 16, 32, 64) nascem da fração proporcional da Semibreve.',
        audioExamples: [
          {
            title: 'Pulsação 4/4 com Semínimas Regulares',
            description: 'Quatro pulsos regulares e uniformes a 120 BPM em Dó (unidade de tempo semínima).',
            notes: [60, 60, 60, 60],
            noteDurationsMs: [500, 500, 500, 500],
            type: 'melodic'
          },
          {
            title: 'Semínima Pontuada + Colcheia (Balanço Rítmico)',
            description: 'Primeira nota prolongada (+50% de duração) seguida da colcheia complementar.',
            notes: [60, 64, 67],
            noteDurationsMs: [750, 250, 600],
            type: 'melodic'
          },
          {
            title: 'Articulação: Som Sustentado vs Staccato Curto',
            description: 'Ouça o contraste entre uma nota sustentada (mínima) e duas notas curtas e destacadas (staccato).',
            notes: [60, 64, 67],
            noteDurationsMs: [800, 250, 250],
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Segundo as regras de grafia musical, como deve ser traçada a haste de uma nota posicionada acima da 3ª linha do pentagrama?',
          options: [
            'Para baixo, no lado esquerdo da cabeça da nota (formato "q")',
            'Para cima, no lado direito da cabeça da nota (formato "d")',
            'Para baixo, no lado direito da cabeça da nota',
            'Para cima, no lado esquerdo da cabeça da nota'
          ],
          correctIndex: 0,
          explanation: 'Pela Regra da 3ª Linha, notas situadas acima da 3ª linha do pentagrama têm a haste traçada para baixo pelo lado esquerdo da cabeça (silhueta da letra "q"), mantendo a notação equilibrada dentro do pentagrama.'
        }
      }
    ]
  },

  // =========================================================================
  // MÓDULO 2: Intervalos Musicais — O DNA da Harmonia
  // =========================================================================
  {
    code: 'M2',
    title: 'Intervalos Musicais — O DNA da Harmonia',
    phase: 'Fase 2: Estruturas & Relações',
    iconName: 'Ruler',
    description: 'Tons, semitons, classificação quantitativa e qualitativa dos intervalos, trítono e inversão de intervalos.',
    lessons: [
      {
        id: 'm2-1',
        moduleCode: 'M2',
        moduleTitle: 'Intervalos Musicais — O DNA da Harmonia',
        modulePhase: 'Fase 2: Estruturas & Relações',
        title: 'Tons, Semitons Naturais e Enarmonia',
        subtitle: 'A menor distância acústica da música ocidental temperada',
        level: 'Iniciante',
        readingTimeMinutes: 5,
        summary: 'No sistema ocidental temperado de 12 sons, o semitom (ou meio-tom) é a menor distância entre duas notas adjacentes. Um tom é composto por 2 semitons.',
        keyTakeaway: 'Entre Mi e Fá, e entre Si e Dó, NÃO existem teclas pretas no piano: são os Semitons Naturais!',
        sections: [
          {
            heading: '1. A Geografia dos Semitons Naturais',
            paragraphs: [
              'Olhe para o teclado do piano: em quase todos os lugares, existe uma tecla preta entre duas brancas (indicando um Tom inteiro de distância: C para D, D para E, F para G, G para A, A para B).',
              'Porém, em dois lugares específicos do teclado, NÃO existe tecla preta intermediária. As teclas brancas encostam diretamente uma na outra:'
            ],
            bulletPoints: [
              'Entre Mi (E) e Fá (F) = 1 Semitom Natural.',
              'Entre Si (B) e Dó (C) = 1 Semitom Natural.',
              'Todos os outros passos entre notas brancas vizinhas medem 1 Tom (2 semitons): Dó-Ré, Ré-Mi, Fá-Sol, Sol-Lá, Lá-Si.'
            ]
          },
          {
            heading: '2. Enarmonia: Dois Nomes, o Mesmo Som Físico',
            paragraphs: [
              'Enarmonia é o fenômeno sonoro onde duas notas possuem grafias e nomes diferentes na pauta, mas produzem exatamente a mesma frequência em Hertz e são tocadas na mesmíssima tecla física.',
              'Exemplo: C♯ (Dó sustenido) e D♭ (Ré bemol) são a mesma tecla preta. Se você subir meio tom a partir de Dó, chega em C♯; se descer meio tom a partir de Ré, chega em D♭.'
            ]
          }
        ],
        goldenRule: 'Decore para sempre: Mi-Fá e Si-Dó são os dois únicos semitons naturais da escala diatônica.',
        audioExamples: [
          {
            title: 'Semitom Natural (Mi -> Fá)',
            description: 'Ouça o passo imediato de meio-tom entre Mi4 (64) e Fá4 (65).',
            notes: [64, 65],
            tempoMs: 650,
            type: 'melodic'
          },
          {
            title: 'Tom Inteiro (Dó -> Ré)',
            description: 'Ouça o passo de 2 semitons entre Dó4 (60) e Ré4 (62).',
            notes: [60, 62],
            tempoMs: 650,
            type: 'melodic'
          },
          {
            title: 'Enarmonia Sonora (Dó# vs Ré♭)',
            description: 'Duas notas teoricamente distintas (C# e Db) soando na mesmíssima frequência física (277.18 Hz).',
            notes: [61, 61],
            noteDurationsMs: [600, 600],
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Entre quais pares de notas naturais abaixo a distância é de apenas 1 Semitom?',
          options: ['Dó e Ré', 'Fá e Sol', 'Mi e Fá', 'Lá e Si'],
          correctIndex: 2,
          explanation: 'Mi e Fá (assim como Si e Dó) são os semitons naturais que não possuem tecla intermediária no sistema temperado.'
        }
      },
      {
        id: 'm2-2',
        moduleCode: 'M2',
        moduleTitle: 'Intervalos Musicais — O DNA da Harmonia',
        modulePhase: 'Fase 2: Estruturas & Relações',
        title: 'Classificação Completa dos Intervalos (Maiores, Menores e Justos)',
        subtitle: 'A régua universal para medir distâncias e sonoridades harmônicas',
        level: 'Intermediário',
        readingTimeMinutes: 8,
        summary: 'Os intervalos são a distância em altura entre duas notas. Classificam-se numericamente (2ª, 3ª, 4ª, 5ª, 6ª, 7ª, 8ª) e qualitativamente (Maior, Menor, Justo, Aumentado, Diminuto).',
        keyTakeaway: 'Uníssono, 4ª, 5ª e 8ª são JUSTOS (perfeita consonância). 2ª, 3ª, 6ª e 7ª podem ser MAIORES ou MENORES.',
        sections: [
          {
            heading: '1. A Tabela Oficial de Distâncias em Semitons (a partir da Tônica)',
            paragraphs: [
              'Tomando a nota Dó como ponto de partida (tônica), podemos mapear todos os intervalos cromáticos e suas distâncias exatas:'
            ],
            bulletPoints: [
              '2ª Menor: 1 semitom (ex: C -> D♭) — Dissonância penetrante.',
              '2ª Maior: 2 semitons / 1 tom (ex: C -> D) — Movimento de passo escalar.',
              '3ª Menor: 3 semitons / 1½ tom (ex: C -> E♭) — Sonoridade triste, introspectiva ou blues.',
              '3ª Maior: 4 semitons / 2 tons (ex: C -> E) — Sonoridade alegre, luminosa e triunfante.',
              '4ª Justa: 5 semitons / 2½ tons (ex: C -> F) — Consonância aberta neutra.',
              'Trítono (4ª Aum / 5ª Dim): 6 semitons / 3 tons (ex: C -> F♯ ou G♭) — Tensão máxima.',
              '5ª Justa: 7 semitons / 3½ tons (ex: C -> G) — A espinha dorsal dos power chords.',
              '6ª Menor: 8 semitons / 4 tons (ex: C -> A♭) — Nostalgia e lirismo.',
              '6ª Maior: 9 semitons / 4½ tons (ex: C -> A) — O brilho elegante do Jazz e Bossa Nova.',
              '7ª Menor: 10 semitons / 5 tons (ex: C -> B♭) — A sétima dominante de tensão.',
              '7ª Maior: 11 semitons / 5½ tons (ex: C -> B) — O som sonhador e aveludado dos acordes 7M.',
              '8ª Justa: 12 semitons / 6 tons (ex: C -> C) — Repetição na oitava superior.'
            ]
          }
        ],
        goldenRule: 'A Terça (Maior ou Menor) é quem define a polaridade emocional de um acorde: 3ª Maior = Feliz/Luminoso; 3ª Menor = Triste/Profundo.',
        audioExamples: [
          {
            title: 'Terça Maior Harmônica (C - E)',
            description: 'Consonância brilhante, luminosa e alegre (4 semitons).',
            notes: [60, 64],
            type: 'harmonic'
          },
          {
            title: 'Terça Menor Harmônica (C - E♭)',
            description: 'Sonoridade suave, emotiva e melancólica (3 semitons).',
            notes: [60, 63],
            type: 'harmonic'
          },
          {
            title: 'Quinta Justa (Power Chord C - G)',
            description: 'A estabilidade e força imutável da quinta justa com fundamental.',
            notes: [48, 55, 60],
            type: 'harmonic'
          }
        ],
        quiz: {
          question: 'Quantos semitons existem no intervalo de Terça Menor?',
          options: ['2 semitons', '3 semitons', '4 semitons', '5 semitons'],
          correctIndex: 1,
          explanation: 'A Terça Menor possui exatamente 3 semitons (1 tom e meio), enquanto a Terça Maior possui 4 semitons (2 tons).'
        }
      },
      {
        id: 'm2-3',
        moduleCode: 'M2',
        moduleTitle: 'Intervalos Musicais — O DNA da Harmonia',
        modulePhase: 'Fase 2: Estruturas & Relações',
        title: 'O Trítono & A Inversão de Intervalos (Regra do 9)',
        subtitle: 'A força motriz das resoluções dominantes e o truque mental das inversões',
        level: 'Intermediário',
        readingTimeMinutes: 7,
        summary: 'O trítono mede exatamente 3 tons inteiros e divide a oitava perfeitamente ao meio. Por séculos chamado de "Diabolus in Musica", hoje é o coração gravitacional que faz o acorde dominante resolver na tônica.',
        keyTakeaway: 'Na inversão de intervalos: 9 menos o número original dá o novo número. Maior vira Menor, Justo continua Justo, Aumentado vira Diminuto.',
        sections: [
          {
            heading: '1. O Trítono: O Motor da Música Ocidental',
            paragraphs: [
              'O intervalo de 3 tons (ex: entre as notas Fá e Si na escala de Dó Maior) gera uma tensão magnética intensa. O ouvido humano anseia por sua resolução: o Fá quer descer meio tom para Mi, e o Si (sensível) quer subir meio tom para Dó.',
              'Esse movimento de resolução convergente é o que faz o acorde G7 resolver com tanta satisfação no acorde C!'
            ]
          },
          {
            heading: '2. A Famosa Regra do 9 para Inversões',
            paragraphs: [
              'Inverter um intervalo significa passar a nota de baixo para a oitava superior (ou a de cima para a inferior).',
              'Para saber instantaneamente em que qualquer intervalo se transforma ao ser invertido, use a Regra do 9:'
            ],
            bulletPoints: [
              'Segunda (2ª) inverte em Sétima (7ª) [pois 9 - 2 = 7].',
              'Terça (3ª) inverte em Sexta (6ª) [pois 9 - 3 = 6].',
              'Quarta (4ª) inverte em Quinta (5ª) [pois 9 - 4 = 5].',
              'Qualidade invertida: Maior vira Menor; Menor vira Maior.',
              'Qualidade invertida: Aumentado vira Diminuto; Diminuto vira Aumentado.',
              'Qualidade especial: Justo SEMPRE continua Justo! (ex: 4ª Justa inverte em 5ª Justa).'
            ]
          }
        ],
        goldenRule: '9 menos o intervalo dá a inversão: 3ª Maior invertida vira 6ª Menor. 5ª Justa invertida vira 4ª Justa.',
        audioExamples: [
          {
            title: 'O Trítono Instável (Fá e Si simultâneos)',
            description: 'Ouça a tensão eletromagnética dos 3 tons inteiros (intervalo de 6 semitons).',
            notes: [65, 71],
            type: 'harmonic'
          },
          {
            title: 'Resolução do Trítono (F-B resolvendo em E-C)',
            description: 'A mágica da resolução convergente: Fá desce para Mi e Si sobe para Dó.',
            chords: [
              [65, 71],
              [64, 72]
            ],
            chordNames: ['Trítono (F - B)', 'Resolução (E - C)'],
            tempoMs: 900,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'De acordo com a Regra do 9, qual é o resultado da inversão de um intervalo de Terça Maior?',
          options: ['Sexta Maior', 'Sexta Menor', 'Quinta Justa', 'Sétima Menor'],
          correctIndex: 1,
          explanation: '9 - 3 = 6, e Maior inverte em Menor. Logo, uma Terça Maior invertida resulta em uma Sexta Menor.'
        }
      }
    ]
  },

  // =========================================================================
  // MÓDULO 3: Escalas, Tonalidades & Armaduras de Clave
  // =========================================================================
  {
    code: 'M3',
    title: 'Escalas, Tonalidades & Armaduras de Clave',
    phase: 'Fase 3: Tonalidade & Centros Gravitacionais',
    iconName: 'Sparkles',
    description: 'A fórmula da Escala Maior, armaduras de sustenidos e bemóis, o Círculo das Quintas e as 3 escalas menores.',
    lessons: [
      {
        id: 'm3-1',
        moduleCode: 'M3',
        moduleTitle: 'Escalas, Tonalidades & Armaduras de Clave',
        modulePhase: 'Fase 3: Tonalidade & Centros Gravitacionais',
        title: 'A Escala Maior Natural e a Fórmula T-T-ST-T-T-T-ST',
        subtitle: 'A matriz diatônica sobre a qual toda a harmonia ocidental foi erguida',
        level: 'Iniciante',
        readingTimeMinutes: 6,
        summary: 'A Escala Maior é uma sucessão ordenada de 7 sons dispostos em uma fórmula matemática rígida de tons e semitons: Tom, Tom, Semitom, Tom, Tom, Tom, Semitom.',
        keyTakeaway: 'Os semitons na Escala Maior ocorrem obrigatoriamente entre o 3º e 4º graus, e entre o 7º e 8º graus.',
        sections: [
          {
            heading: '1. A Fórmula Mestra da Escala Maior',
            paragraphs: [
              'Se você tocar apenas as teclas brancas do piano de Dó a Dó, ouvirá a Escala Maior em sua pureza natural, sem necessidade de acidentes.',
              'Essa sonoridade equilibrada decorre da fórmula intervalar T - T - ST - T - T - T - ST:'
            ],
            bulletPoints: [
              'Grau I (Tônica): Dó',
              'Grau II (Sobretônica): Ré [1 Tom]',
              'Grau III (Mediante): Mi [1 Tom]',
              'Grau IV (Subdominante): Fá [1 Semitom]',
              'Grau V (Dominante): Sol [1 Tom]',
              'Grau VI (Sobredominante / Relativa Menor): Lá [1 Tom]',
              'Grau VII (Sensível): Si [1 Tom]',
              'Grau VIII (Oitava / Tônica): Dó [1 Semitom]'
            ]
          },
          {
            heading: '2. Construindo Qualquer Escala Maior',
            paragraphs: [
              'Para montar a escala maior de qualquer outra nota (como Sol Maior ou Fá Maior), basta aplicar rigorosamente a mesma fórmula, adicionando sustenidos ou bemóis quando necessário para preservar as distâncias T-T-ST-T-T-T-ST.'
            ]
          }
        ],
        goldenRule: 'Na Escala Maior, os semitons SEMPRE estão entre o 3º-4º graus e entre o 7º-8º graus.',
        audioExamples: [
          {
            title: 'Escala Maior de Dó Completa',
            description: 'Ouça a escala ascendente de Dó Maior (C D E F G A B C).',
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            tempoMs: 320,
            type: 'melodic'
          },
          {
            title: 'Os Dois Semitons Diatônicos (E-F e B-C)',
            description: 'Os passos de atração gravitacional: Graus 3-4 (Mi para Fá) e Graus 7-8 (Si para Dó).',
            notes: [64, 65, 71, 72],
            noteDurationsMs: [450, 650, 450, 800],
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Em quais graus da Escala Maior Natural ocorrem os semitons?',
          options: ['Entre 1º-2º e 4º-5º', 'Entre 2º-3º e 6º-7º', 'Entre 3º-4º e 7º-8º', 'Entre 4º-5º e 7º-8º'],
          correctIndex: 2,
          explanation: 'A fórmula T-T-ST-T-T-T-ST posiciona os semitons exatamente entre o 3º e 4º graus, e entre o 7º e 8º graus.'
        }
      },
      {
        id: 'm3-2',
        moduleCode: 'M3',
        moduleTitle: 'Escalas, Tonalidades & Armaduras de Clave',
        modulePhase: 'Fase 3: Tonalidade & Centros Gravitacionais',
        title: 'Armaduras de Clave & A Ordem dos Sustenidos e Bemóis',
        subtitle: 'Como ler tonalidades instantaneamente na partitura',
        level: 'Intermediário',
        readingTimeMinutes: 7,
        summary: 'A armadura de clave indica no início da pauta quais notas devem ser tocadas alteradas durante toda a música. Os sustenidos e bemóis sempre aparecem em uma ordem matemática imutável.',
        keyTakeaway: 'Ordem dos Sustenidos: FÁ - DÓ - SOL - RÉ - LÁ - MI - SI. Ordem dos Bemóis: SI - MI - LÁ - RÉ - SOL - DÓ - FÁ (o inverso exato!).',
        sections: [
          {
            heading: '1. A Ordem dos Sustenidos (♯) e o Macete da Tonalidade',
            paragraphs: [
              'Os sustenidos sempre entram na pauta seguindo um ciclo de quintas ascendentes: Fá♯, Dó♯, Sol♯, Ré♯, Lá♯, Mi♯, Si♯.',
              'Macete Mágico dos Sustenidos: Para descobrir a tonalidade maior de uma armadura com sustenidos, pegue o ÚLTIMO sustenido desenhado à direita e suba MEIO TOM! Esse é o tom da música.',
              'Exemplo: Se a armadura tem Fá♯, Dó♯ e Sol♯ (último é Sol♯), subindo meio tom temos Lá Maior (A)!'
            ]
          },
          {
            heading: '2. A Ordem dos Bemóis (♭) e o Macete do Penúltimo',
            paragraphs: [
              'A ordem dos bemóis é exatamente o inverso da ordem dos sustenidos: Si♭, Mi♭, Lá♭, Ré♭, Sol♭, Dó♭, Fá♭.',
              'Macete Mágico dos Bemóis: Para descobrir a tonalidade maior em armaduras com 2 ou mais bemóis, olhe para o PENÚLTIMO bemol. O nome dele é o tom da música!',
              'Exemplo: Se a armadura tem Si♭, Mi♭ e Lá♭, o penúltimo é Mi♭. Logo, a tonalidade é Mi bemol Maior (E♭)!'
            ]
          }
        ],
        goldenRule: 'Com sustenidos: suba meio tom do último. Com bemóis: o penúltimo bemol é a tônica.',
        audioExamples: [
          {
            title: 'Escala com 1 Sustenido: Sol Maior (Fá#)',
            description: 'Ouça a escala de Sol Maior com seu sensível Fá# garantindo o semitom no final.',
            notes: [67, 69, 71, 72, 74, 76, 78, 79],
            tempoMs: 320,
            type: 'melodic'
          },
          {
            title: 'Escala com 1 Bemol: Fá Maior (Si♭)',
            description: 'Ouça a escala de Fá Maior com seu Si♭ no 4º grau mantendo a proporção T-T-ST.',
            notes: [65, 67, 69, 70, 72, 74, 76, 77],
            tempoMs: 320,
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Se uma partitura tem 3 sustenidos na armadura (Fá♯, Dó♯, Sol♯), qual é a sua tonalidade maior?',
          options: ['Mi Maior', 'Sol Maior', 'Lá Maior', 'Ré Maior'],
          correctIndex: 2,
          explanation: 'Pelo macete do último sustenido, subindo meio tom a partir de Sol♯ chegamos em Lá Maior (A).'
        }
      },
      {
        id: 'm3-3',
        moduleCode: 'M3',
        moduleTitle: 'Escalas, Tonalidades & Armaduras de Clave',
        modulePhase: 'Fase 3: Tonalidade & Centros Gravitacionais',
        title: 'As Três Escalas Menores: Natural, Harmônica e Melódica',
        subtitle: 'A solução engenhosa para criar a sensível e o mistério oriental do jazz',
        level: 'Intermediário',
        readingTimeMinutes: 8,
        summary: 'A escala menor possui três variantes históricas: a Menor Natural (relativa direta da escala maior), a Menor Harmônica (com 7º grau elevado para criar a sensível) e a Menor Melódica (com 6º e 7º graus elevados).',
        keyTakeaway: 'A Menor Harmônica eleva o 7º grau criando o intervalo exótico de 2ª aumentada. A Menor Melódica eleva o 6º e o 7º graus suavizando a condução melódica.',
        sections: [
          {
            heading: '1. O Problema da Menor Natural e a Solução Harmônica',
            paragraphs: [
              'A escala de Lá Menor Natural (A B C D E F G A) usa as mesmas notas de Dó Maior. Porém, seu 7º grau (Sol) fica a 1 tom inteiro de distância da tônica (Lá). Por isso, falta a ela a atração magnética da "Sensível".',
              'Para resolver isso, os compositores clássicos elevaram o 7º grau em meio tom (de Sol para Sol♯), criando a Escala Menor Harmônica: A - B - C - D - E - F - G♯ - A.',
              'Essa alteração permitiu a criação do acorde dominante maior (E7) na tonalidade menor!'
            ]
          },
          {
            heading: '2. A Menor Melódica (Jazz Minor)',
            paragraphs: [
              'Na Menor Harmônica, o salto entre Fá (6º grau) e Sol♯ (7º grau) mede 1 tom e meio (Segunda Aumentada), que tem uma sonoridade árabe ou mourisca que nem sempre era desejada nas linhas vocais suaves.',
              'Elevando também o 6º grau (de Fá para Fá♯), nasceu a Menor Melódica: A - B - C - D - E - F♯ - G♯ - A. Na música moderna e no Jazz, ela é a geradora de vários dos modos mais ricos da improvisação contemporânea.'
            ]
          }
        ],
        goldenRule: 'Menor Harmônica tem 7ª maior. Menor Melódica tem 6ª maior E 7ª maior.',
        audioExamples: [
          {
            title: 'Escala Menor Natural (Lá Menor)',
            description: 'A - B - C - D - E - F - G - A (relativa direta de Dó Maior, sem sensível).',
            notes: [57, 59, 60, 62, 64, 65, 67, 69],
            tempoMs: 320,
            type: 'melodic'
          },
          {
            title: 'Escala Menor Harmônica (Lá Menor)',
            description: 'A - B - C - D - E - F - G# - A (7º grau elevado com sensível e salto de 2ª aumentada).',
            notes: [57, 59, 60, 62, 64, 65, 68, 69],
            tempoMs: 320,
            type: 'melodic'
          },
          {
            title: 'Escala Menor Melódica (Lá Menor)',
            description: 'A - B - C - D - E - F# - G# - A (6º e 7º graus elevados para fluidez melódica).',
            notes: [57, 59, 60, 62, 64, 66, 68, 69],
            tempoMs: 320,
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Qual alteração transforma a Escala Menor Natural em Escala Menor Harmônica?',
          options: ['Elevação do 3º grau', 'Elevação do 5º grau', 'Elevação do 7º grau', 'Abaixamento do 6º grau'],
          correctIndex: 2,
          explanation: 'A Menor Harmônica eleva em meio tom o 7º grau para gerar a sensível necessária para criar o acorde dominante (V7).'
        }
      }
    ]
  },

  // =========================================================================
  // MÓDULO 4: Acordes, Tríades & Tétrades (Cifras e Inversões)
  // =========================================================================
  {
    code: 'M4',
    title: 'Acordes, Tríades & Tétrades (Cifras e Inversões)',
    phase: 'Fase 4: Arquitetura Vertical dos Acordes',
    iconName: 'Layers',
    description: 'Empilhamento de terças, as 4 tríades básicas, inversões no piano e violão, tétrades modernas e cifras internacionais.',
    lessons: [
      {
        id: 'm4-1',
        moduleCode: 'M4',
        moduleTitle: 'Acordes, Tríades & Tétrades (Cifras e Inversões)',
        modulePhase: 'Fase 4: Arquitetura Vertical dos Acordes',
        title: 'As 4 Tríades Fundamentais: Maior, Menor, Diminuta e Aumentada',
        subtitle: 'A combinação de duas terças que gera os blocos elementares da harmonia',
        level: 'Iniciante',
        readingTimeMinutes: 7,
        summary: 'Um acorde é a emissão simultânea de três ou mais sons. Uma tríade é formada pela Fundamental (raiz), Terça e Quinta, combinando terças maiores e menores.',
        keyTakeaway: 'Maior = 3M + 3m. Menor = 3m + 3M. Diminuta = 3m + 3m. Aumentada = 3M + 3M.',
        sections: [
          {
            heading: '1. O Algoritmo de Construção das 4 Tríades',
            paragraphs: [
              'Toda tríade básica é construída empilhando duas terças sobre uma nota fundamental. As quatro combinações possíveis geram as quatro qualidades essenciais:'
            ],
            bulletPoints: [
              'Tríade Maior (ex: C = C - E - G): Fundamental + Terça Maior (4 st) + Quinta Justa (7 st). Sonoridade luminosa, estável e consonante.',
              'Tríade Menor (ex: Cm = C - E♭ - G): Fundamental + Terça Menor (3 st) + Quinta Justa (7 st). Sonoridade nostálgica, reflexiva e profunda.',
              'Tríade Diminuta (ex: Cdim / C° = C - E♭ - G♭): Fundamental + Terça Menor (3 st) + Quinta Diminuta (6 st / trítono). Sonoridade tensa e instável.',
              'Tríade Aumentada (ex: Caug / C+ = C - E - G♯): Fundamental + Terça Maior (4 st) + Quinta Aumentada (8 st). Sonoridade sonhadora e suspensa no espaço.'
            ]
          }
        ],
        goldenRule: 'O que define a alma da tríade é a terça. O que define sua estabilidade é a quinta (justa, diminuta ou aumentada).',
        audioExamples: [
          {
            title: 'As 4 Tríades em Dó (Maior, Menor, Diminuta, Aumentada)',
            description: 'Ouça sequencialmente C (Maior), Cm (Menor), Cdim (Diminuta) e Caug (Aumentada).',
            chords: [
              [48, 60, 64, 67],
              [48, 60, 63, 67],
              [48, 60, 63, 66],
              [48, 60, 64, 68]
            ],
            chordNames: ['C Maior', 'C Menor', 'C Diminuta', 'C Aumentada'],
            tempoMs: 900,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'Quais intervalos compõem uma Tríade Diminuta a partir da fundamental?',
          options: ['Terça Maior e Quinta Justa', 'Terça Menor e Quinta Justa', 'Terça Menor e Quinta Diminuta', 'Terça Maior e Quinta Aumentada'],
          correctIndex: 2,
          explanation: 'A Tríade Diminuta é formada por Terça Menor (3 semitons) e Quinta Diminuta (6 semitons).'
        }
      },
      {
        id: 'm4-2',
        moduleCode: 'M4',
        moduleTitle: 'Acordes, Tríades & Tétrades (Cifras e Inversões)',
        modulePhase: 'Fase 4: Arquitetura Vertical dos Acordes',
        title: 'Inversões de Acordes & Notação de Baixo (Slash Chords)',
        subtitle: 'Como conduzir baixos suaves e criar linhas melódicas na mão esquerda',
        level: 'Intermediário',
        readingTimeMinutes: 7,
        summary: 'Um acorde não precisa ter sua fundamental na nota mais grave. Quando a terça ou a quinta vão para o baixo, temos as inversões (ex: C/E ou G/B), gerando conduções suaves.',
        keyTakeaway: 'Fundamental no baixo = Posição Fundamental. Terça no baixo = 1ª Inversão. Quinta no baixo = 2ª Inversão.',
        sections: [
          {
            heading: '1. O que são as Inversões?',
            paragraphs: [
              'Ao tocar a tríade de Dó Maior (C - E - G), podemos organizar as notas em três disposições verticais:'
            ],
            bulletPoints: [
              'Estado Fundamental: Dó no baixo (C - E - G). Estabilidade total.',
              '1ª Inversão: Terça no baixo (E - G - C). Cifrado como C/E ("Dó com baixo em Mi"). Sonoridade mais leve e fluida.',
              '2ª Inversão: Quinta no baixo (G - C - E). Cifrado como C/G ("Dó com baixo em Sol"). Muito usado em cadências cadenciais clássicas ou gospel.'
            ]
          },
          {
            heading: '2. Por que Inverter Acordes na Prática?',
            paragraphs: [
              'Se você tocar a progressão C -> G -> Am com as fundamentais no baixo, o baixo salta grandes distâncias (Dó pula para Sol, depois sobe para Lá).',
              'Se você usar uma inversão e tocar C -> G/B -> Am, o baixo faz uma linha melódica perfeitamente descendente por passo (Dó -> Si -> Lá). Esse é o segredo de arranjos profissionais no piano e violão!'
            ]
          }
        ],
        goldenRule: 'Na cifra em barra (ex: D/F#), a letra antes da barra é o acorde; a letra depois da barra é a nota que DEVE soar no baixo.',
        audioExamples: [
          {
            title: 'Linha de Baixo Descendente com Inversão (C -> G/B -> Am)',
            description: 'Condução melódica suave por passo no baixo: Dó (48) -> Si (47) -> Lá (45).',
            chords: [
              [48, 60, 64, 67],
              [47, 55, 59, 62],
              [45, 57, 60, 64]
            ],
            chordNames: ['C (Baixo Dó)', 'G/B (Baixo Si)', 'Am (Baixo Lá)'],
            tempoMs: 950,
            type: 'cadence'
          },
          {
            title: 'Baixo Fundamental sem Inversão (C -> G -> Am)',
            description: 'Ouça o contraste: sem inversão, o baixo é obrigado a dar grandes saltos.',
            chords: [
              [48, 60, 64, 67],
              [43, 55, 59, 62],
              [45, 57, 60, 64]
            ],
            chordNames: ['C', 'G (salto)', 'Am'],
            tempoMs: 950,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'Em uma cifra C/E, qual nota da tríade de Dó Maior está soando na região mais grave (no baixo)?',
          options: ['Dó (Fundamental)', 'Mi (Terça)', 'Sol (Quinta)', 'Si (Sétima)'],
          correctIndex: 1,
          explanation: 'C/E significa "acorde de Dó Maior com baixo na nota Mi", o que caracteriza a 1ª Inversão.'
        }
      },
      {
        id: 'm4-3',
        moduleCode: 'M4',
        moduleTitle: 'Acordes, Tríades & Tétrades (Cifras e Inversões)',
        modulePhase: 'Fase 4: Arquitetura Vertical dos Acordes',
        title: 'Tétrades: As 5 Famílias de Acordes com Sétima',
        subtitle: 'A linguagem essencial do Jazz, Soul, MPB, Bossa Nova e Pop moderno',
        level: 'Avançado',
        readingTimeMinutes: 9,
        summary: 'Tétrades são acordes de quatro notas formados pelo empilhamento de três terças: Fundamental, Terça, Quinta e Sétima. Elas enriquecem a textura musical com cores harmônicas refinadas.',
        keyTakeaway: 'As 5 tétrades mestras: 7M (Maj7), m7, 7 (Dominante), m7(♭5) (Meio-Diminuto) e dim7 (Diminuto Puro).',
        sections: [
          {
            heading: '1. O Catálogo das 5 Tétrades Principais',
            paragraphs: [
              'Cada combinação de tríade com sétima gera uma atmosfera sonora única e um papel funcional indispensável:'
            ],
            bulletPoints: [
              'Maior com Sétima Maior (7M / Maj7): Tríade Maior + 7ª Maior (ex: C7M = C - E - G - B). Sonoridade sonhadora, relaxante, lírica e sofisticada (Bossa Nova e Jazz).',
              'Menor com Sétima Menor (m7): Tríade Menor + 7ª Menor (ex: Dm7 = D - F - A - C). Sonoridade suave, aveludada e fluida.',
              'Dominante / Maior com Sétima Menor (7): Tríade Maior + 7ª Menor (ex: G7 = G - B - D - F). Contém o trítono entre a 3ª e a 7ª. É o gerador supremo de tensão para resolver na tônica.',
              'Meio-Diminuto / Menor com Sétima e Quinta Bemol (m7♭5 / ø): Tríade Diminuta + 7ª Menor (ex: Bm7(♭5) = B - D - F - A). Acorde típico do II grau do campo harmônico menor.',
              'Diminuto Puro (dim7 / °): Tríade Diminuta + 7ª Diminuta (ex: C° = C - E♭ - G♭ - B𝄫/A). Acorde simétrico de máxima instabilidade e dramaticidade clássica.'
            ]
          }
        ],
        goldenRule: 'O acorde 7 Dominante tem tríade maior com 7ª menor (G7). O acorde 7M tem tríade maior com 7ª maior (C7M). Essa diferença de meio-tom muda tudo!',
        audioExamples: [
          {
            title: 'Tétrade Maj7 (C7M)',
            description: 'Ouça o clima aveludado e lírico de C - E - G - B com fundamental no baixo.',
            notes: [48, 60, 64, 67, 71],
            type: 'harmonic'
          },
          {
            title: 'Tétrade Dominante 7 (G7) Resolvendo em C7M',
            description: 'Ouça a tensão do trítono no G7 e sua resolução repousante no C7M.',
            chords: [
              [43, 55, 59, 62, 65],
              [48, 60, 64, 67, 71]
            ],
            chordNames: ['G7', 'C7M'],
            tempoMs: 1000,
            type: 'cadence'
          },
          {
            title: 'Tétrade Meio-Diminuta (Bm7♭5 / Bø)',
            description: 'A sonoridade dramática e misteriosa da tétrade meio-diminuta (B - D - F - A).',
            notes: [47, 59, 62, 65, 69],
            type: 'harmonic'
          }
        ],
        quiz: {
          question: 'Qual é a estrutura de intervalos da tétrade Dominante (como o acorde G7)?',
          options: ['Tríade Maior + Sétima Maior', 'Tríade Maior + Sétima Menor', 'Tríade Menor + Sétima Menor', 'Tríade Diminuta + Sétima Diminuta'],
          correctIndex: 1,
          explanation: 'O acorde dominante (7) é formado por uma Tríade Maior combinada com uma Sétima Menor (gerando o trítono entre o 3º e o 7º graus).'
        }
      }
    ]
  },

  // =========================================================================
  // MÓDULO 5: Campo Harmônico Maior & Menor
  // =========================================================================
  {
    code: 'M5',
    title: 'Campo Harmônico Maior & Menor',
    phase: 'Fase 5: Sintaxe Harmônica & Funções',
    iconName: 'Network',
    description: 'A geração dos acordes da escala, as 3 grandes funções (Tônica, Subdominante, Dominante) e as cadências célebres.',
    lessons: [
      {
        id: 'm5-1',
        moduleCode: 'M5',
        moduleTitle: 'Campo Harmônico Maior & Menor',
        modulePhase: 'Fase 5: Sintaxe Harmônica & Funções',
        title: 'O Campo Harmônico Maior em Tríades e Tétrades',
        subtitle: 'A família de acordes nascida naturalmente das notas da escala',
        level: 'Intermediário',
        readingTimeMinutes: 8,
        summary: 'Quando construímos acordes sobre cada um dos 7 graus da Escala Maior usando exclusivamente as notas dessa mesma escala, obtemos o Campo Harmônico Maior.',
        keyTakeaway: 'Em Tétrades: I7M - IIm7 - IIIm7 - IV7M - V7 - VIm7 - VIIø. Essa regra vale para todas as 12 tonalidades!',
        sections: [
          {
            heading: '1. O Mapa Oficial dos Acordes em Dó Maior',
            paragraphs: [
              'Empilhando terças diatônicas sobre cada grau da escala de Dó Maior, obtemos a fórmula universal de qualquer tonalidade maior:'
            ],
            bulletPoints: [
              'Grau I: C7M (Maior com 7ª Maior)',
              'Grau II: Dm7 (Menor com 7ª Menor)',
              'Grau III: Em7 (Menor com 7ª Menor)',
              'Grau IV: F7M (Maior com 7ª Maior)',
              'Grau V: G7 (Dominante com 7ª Menor)',
              'Grau VI: Am7 (Menor com 7ª Menor / Relativa Menor)',
              'Grau VII: Bm7(♭5) (Meio-Diminuto)'
            ]
          },
          {
            heading: '2. Transpondo para Qualquer Tom',
            paragraphs: [
              'Essa sequência de qualidades é eterna e imutável. Em Sol Maior, teremos: G7M, Am7, Bm7, C7M, D7, Em7, F#m7(♭5).',
              'Saber o campo harmônico é o superpoder que permite tirar qualquer música de ouvido e compor com total clareza!'
            ]
          }
        ],
        goldenRule: 'No campo harmônico maior: Graus I e IV são 7M; Graus II, III e VI são m7; Grau V é 7 dominante; Grau VII é meio-diminuto (ø).',
        audioExamples: [
          {
            title: 'Campo Harmônico de Dó Maior em Tétrades (Graus I a VII)',
            description: 'Ouça os 7 acordes diatônicos em tétrades com suas qualidades modais e baixos fundamentais.',
            chords: [
              [48, 60, 64, 67, 71],
              [50, 62, 65, 69, 72],
              [52, 64, 67, 71, 74],
              [53, 65, 69, 72, 76],
              [55, 67, 71, 74, 77],
              [57, 69, 72, 76, 79],
              [59, 71, 74, 77, 81]
            ],
            chordNames: ['I: C7M', 'ii: Dm7', 'iii: Em7', 'IV: F7M', 'V: G7', 'vi: Am7', 'viiø: Bm7(b5)'],
            tempoMs: 800,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'Em qualquer tonalidade maior, qual é a qualidade harmônica do V grau em tétrades?',
          options: ['Menor com 7ª Menor (m7)', 'Maior com 7ª Maior (7M)', 'Dominante (7)', 'Meio-Diminuto (m7b5)'],
          correctIndex: 2,
          explanation: 'O V grau é sempre o acorde Dominante (7), responsável por conter o trítono e puxar a resolução de volta para o I grau.'
        }
      },
      {
        id: 'm5-2',
        moduleCode: 'M5',
        moduleTitle: 'Campo Harmônico Maior & Menor',
        modulePhase: 'Fase 5: Sintaxe Harmônica & Funções',
        title: 'As 3 Grandes Funções Harmônicas: Tônica, Subdominante e Dominante',
        subtitle: 'A física da gravidade musical: Repouso, Movimento e Tensão',
        level: 'Intermediário',
        readingTimeMinutes: 7,
        summary: 'Nem todos os acordes têm o mesmo peso. A harmonia funcional organiza os acordes em três famílias psicológicas fundamentais: Tônica (estabilidade), Subdominante (afastamento) e Dominante (tensão).',
        keyTakeaway: 'Tônica = I, VI, III. Subdominante = IV, II. Dominante = V, VII.',
        sections: [
          {
            heading: '1. O Triângulo de Forças da Música',
            paragraphs: [
              'Toda progressão musical bem sucedida funciona como uma respiração: sair da casa segura, explorar o mundo lá fora, sentir tensão e voltar para casa com alívio:'
            ],
            bulletPoints: [
              'Função Tônica (Estabilidade / Repouso): É o "porto seguro", onde a música descansa sem pedir continuidade urgente. Acordes principais: I7M (puro), VIm7 (relativa de repouso doce), IIIm7 (tônica fraca).',
              'Função Subdominante (Movimento / Afastamento): O acorde começa a se afastar da tônica, criando sensação de jornada, amplidão e calor. Não possui o trítono. Acordes: IV7M e IIm7.',
              'Função Dominante (Tensão Máxima / Atração): Contém o trítono instável e a sensível. Cria a necessidade psicológica irresistível de resolver e retornar para a Tônica. Acordes: V7 e VIIø.'
            ]
          }
        ],
        goldenRule: 'O fluxo harmônico natural da música ocidental é: Tônica -> Subdominante -> Dominante -> Tônica.',
        audioExamples: [
          {
            title: 'Ciclo Funcional Perfeito (C -> F -> G7 -> C)',
            description: 'Ouça: Repouso (C) -> Afastamento (F) -> Tensão (G7) -> Alívio e Resolução (C).',
            chords: [
              [48, 60, 64, 67],
              [41, 60, 65, 69],
              [43, 59, 65, 67],
              [48, 60, 64, 67]
            ],
            chordNames: ['C (Tônica)', 'F (Subdominante)', 'G7 (Dominante)', 'C (Tônica)'],
            tempoMs: 900,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'Qual família funcional tem a missão de criar a maior sensação de estabilidade e repouso na música?',
          options: ['Função Dominante', 'Função Subdominante', 'Função Tônica', 'Função Cromática'],
          correctIndex: 2,
          explanation: 'A Função Tônica (representada pelo I e VI graus) é o centro de repouso, estabilidade e conclusão da tonalidade.'
        }
      },
      {
        id: 'm5-3',
        moduleCode: 'M5',
        moduleTitle: 'Campo Harmônico Maior & Menor',
        modulePhase: 'Fase 5: Sintaxe Harmônica & Funções',
        title: 'Cadências Históricas: II - V - I e a Progressão Pop dos 4 Acordes',
        subtitle: 'As sequências mais tocadas na história da humanidade',
        level: 'Intermediário',
        readingTimeMinutes: 8,
        summary: 'Cadências são fórmulas consagradas de encadeamento de acordes. O II - V - I é a espinha dorsal de todo o Jazz e Bossa Nova, enquanto I - V - vi - IV é a matriz de centenas de hits mundiais do Pop e Rock.',
        keyTakeaway: 'II - V - I = Subdominante (IIm7) -> Dominante (V7) -> Tônica (I7M). Progressão Pop = I - V - vi - IV (ex: C - G - Am - F).',
        sections: [
          {
            heading: '1. O Lendário II - V - I (Dois - Cinco - Um)',
            paragraphs: [
              'Se você aprender a tocar o II - V - I em todos os 12 tons, estará apto a tocar mais de 70% dos standards de Jazz, Bossa Nova (Tom Jobim, João Gilberto) e MPB.',
              'Em Dó Maior: Dm7 (II) -> G7 (V) -> C7M (I). As notas do baixo caminham em saltos de quarta ascendente / quinta descendente, que é a condução mais poderosa da acústica musical.'
            ]
          },
          {
            heading: '2. A Progressão dos 4 Acordes do Pop (I - V - vi - IV)',
            paragraphs: [
              'De "Let It Be" (Beatles) a "With or Without You" (U2), "Someone Like You" (Adele), "No Woman No Cry" (Bob Marley) e "Faroeste Caboclo" (Legião Urbana):',
              'Em Dó Maior: C -> G -> Am -> F. Ela une a solidez da tônica (C), a força do dominante (G), a emoção da relativa menor (Am) e a nobreza da subdominante (F).'
            ]
          }
        ],
        goldenRule: 'Domine o II - V - I em três tonalidades (C, F e G) e um universo musical inteiro se abrirá para seus dedos.',
        audioExamples: [
          {
            title: 'Cadência II - V - I em Dó (Dm7 -> G7 -> C7M)',
            description: 'A progressão mais famosa da Bossa Nova e do Jazz com condução suave de vozes.',
            chords: [
              [50, 62, 65, 69, 72],
              [43, 59, 62, 65, 67],
              [48, 60, 64, 67, 71]
            ],
            chordNames: ['Dm7', 'G7', 'C7M'],
            tempoMs: 950,
            type: 'cadence'
          },
          {
            title: 'Progressão Pop dos 4 Acordes (C -> G -> Am -> F)',
            description: 'A progressão de ouro de centenas de sucessos mundiais.',
            chords: [
              [48, 60, 64, 67],
              [43, 55, 59, 62],
              [45, 57, 60, 64],
              [41, 53, 57, 60]
            ],
            chordNames: ['C', 'G', 'Am', 'F'],
            tempoMs: 850,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'Em Dó Maior, quais são os acordes que formam a cadência II - V - I em tétrades?',
          options: ['Em7 - A7 - D7M', 'Dm7 - G7 - C7M', 'F7M - G7 - C7M', 'Am7 - D7 - G7M'],
          correctIndex: 1,
          explanation: 'O II grau é Dm7, o V grau é G7 e o I grau é C7M, compondo a célebre cadência II-V-I.'
        }
      }
    ]
  },

  // =========================================================================
  // MÓDULO 6: Modos Gregos & Harmonia Modal
  // =========================================================================
  {
    code: 'M6',
    title: 'Modos Gregos & Harmonia Modal',
    phase: 'Fase 6: Cores Modais & Improvisação',
    iconName: 'Flame',
    description: 'Compreenda os 7 Modos Gregos a partir da nota característica de cada um e saiba onde aplicá-los.',
    lessons: [
      {
        id: 'm6-1',
        moduleCode: 'M6',
        moduleTitle: 'Modos Gregos & Harmonia Modal',
        modulePhase: 'Fase 6: Cores Modais & Improvisação',
        title: 'O Segredo dos Modos Gregos: A Mesma Escala com 7 Cores Diferentes',
        subtitle: 'Como mudar o centro gravitacional sem alterar as notas físicas',
        level: 'Avançado',
        readingTimeMinutes: 9,
        summary: 'Os modos gregos não são escalas misteriosas separadas. Eles são a rotação da mesma escala maior, porém elegendo notas diferentes como tônica (centro gravitacional).',
        keyTakeaway: 'Jônio (1º), Dórico (2º), Frígio (3º), Lídio (4º), Mixolídio (5º), Eólio (6º), Lócrio (7º).',
        sections: [
          {
            heading: '1. O Conceito Revolucionário da Gravidade Modal',
            paragraphs: [
              'Se você tocar as teclas brancas de Dó a Dó com um acorde de C soando no fundo, você ouve o som clássico e alegre do MODO JÔNIO (Maior).',
              'Porém, se você tocar EXATAMENTE as mesmas teclas brancas de Ré a Ré com um pedal de Ré Menor (Dm) soando no fundo, o clima muda completamente: você agora está no MODO DÓRICO, o som refinado de Carlos Santana e "So What" de Miles Davis!'
            ],
            bulletPoints: [
              'Jônio (I grau): A escala maior pura. Caráter luminoso e heróico.',
              'Dórico (II grau): Escala menor com a 6ª MAIOR. O som sofisticado do Soul, Funk e Fusion.',
              'Frígio (III grau): Escala menor com a 2ª MENOR. O clima exótico e misterioso espanhol / flamenco.',
              'Lídio (IV grau): Escala maior com a 4ª AUMENTADA. O som épico, cósmico e cinematográfico (John Williams / E.T. / Simpsons).',
              'Mixolídio (V grau): Escala maior com a 7ª MENOR. O som dominante do Rock, Blues e Baião.',
              'Eólio (VI grau): A escala menor natural pura. Caráter melancólico e reflexivo.',
              'Lócrio (VII grau): Escala diminuta com 2ª menor e 5ª diminuta. Instabilidade extrema.'
            ]
          }
        ],
        goldenRule: 'Um modo só existe de verdade quando o centro de gravidade (o acorde de base) ancora a nota tônica daquele modo.',
        audioExamples: [
          {
            title: 'Modo Dórico de Ré (D E F G A B C D)',
            description: 'Ouça a 6ª Maior (Si) dando o brilho característico do Dórico sobre Ré Menor.',
            notes: [62, 64, 65, 67, 69, 71, 72, 74],
            tempoMs: 320,
            type: 'melodic'
          },
          {
            title: 'Modo Lídio de Fá (F G A B C D E F)',
            description: 'Ouça a 4ª Aumentada (Si) criando a atmosfera mágica e espacial do Lídio.',
            notes: [65, 67, 69, 71, 72, 74, 76, 77],
            tempoMs: 320,
            type: 'melodic'
          },
          {
            title: 'Modo Mixolídio de Sol (G A B C D E F G)',
            description: 'A 7ª Menor (Fá natural) dando a alma do Rock, Blues e Forró/Baião nordestino.',
            notes: [67, 69, 71, 72, 74, 76, 77, 79],
            tempoMs: 320,
            type: 'melodic'
          }
        ],
        quiz: {
          question: 'Qual é a nota característica que diferencia o Modo Dórico de uma escala menor comum?',
          options: ['2ª Menor', '4ª Aumentada', '6ª Maior', '7ª Maior'],
          correctIndex: 2,
          explanation: 'O Modo Dórico é uma escala menor com a 6ª Maior (em vez da 6ª menor da escala eólia), conferindo sua sonoridade brilhante e sofisticada.'
        }
      }
    ]
  },

  // =========================================================================
  // MÓDULO 7: Harmonia Funcional Avançada & Re-harmonização
  // =========================================================================
  {
    code: 'M7',
    title: 'Harmonia Funcional Avançada & Re-harmonização',
    phase: 'Fase 7: Maestria Harmônica',
    iconName: 'Sparkles',
    description: 'Dominantes secundários, Empréstimo Modal (AEM), Substituição Tritônica (SubV7) e condução de vozes.',
    lessons: [
      {
        id: 'm7-1',
        moduleCode: 'M7',
        moduleTitle: 'Harmonia Funcional Avançada & Re-harmonização',
        modulePhase: 'Fase 7: Maestria Harmônica',
        title: 'Dominantes Secundários & Acordes de Empréstimo Modal (AEM)',
        subtitle: 'Como adicionar cores inesperadas e sofisticação às suas progressões',
        level: 'Avançado',
        readingTimeMinutes: 9,
        summary: 'Dominantes secundários preparam qualquer acorde diatônico com seu próprio V7 individual. O Empréstimo Modal importa acordes da escala homônima menor (como o célebre Fm em Dó Maior).',
        keyTakeaway: 'O acorde Fm em Dó Maior é um IVm emprestado de Dó Menor — o clássico "acorde de lágrima" dos Beatles e Tom Jobim.',
        sections: [
          {
            heading: '1. O Conceito de Dominante Secundário',
            paragraphs: [
              'Se você está em Dó Maior e vai caminhar para o acorde Dm7 (II grau), em vez de ir direto, você pode inserir antes dele o seu dominante próprio: A7 (que é o V grau de Ré)!',
              'Essa técnica batiza-se de V7/II (cinco do dois). Ela cria micro-tensões elegantes sem abandonar a tonalidade principal.'
            ]
          },
          {
            heading: '2. Acordes de Empréstimo Modal (AEM): O Segredo do IVm',
            paragraphs: [
              'Em Dó Maior, o IV grau diatônico é Fá Maior (F7M). Mas que tal "emprestar" o Fá Menor (Fm) da tonalidade paralela de Dó Menor?',
              'Ao tocar C -> F -> Fm -> C, a nota Lá bemol do Fm cai meio tom suavemente para o Sol do acorde de C. Essa resolução cromática descendente é uma das sensações mais emocionantes da música ocidental.'
            ]
          }
        ],
        goldenRule: 'O IVm (Fm em Dó) é o rei dos empréstimos modais: traz melancolia poética instantânea para uma progressão maior.',
        audioExamples: [
          {
            title: 'O Efeito do IVm Emprestado (C -> F -> Fm -> C)',
            description: 'Ouça a melancolia doce e poética do Fá Menor com o Lá♭ caindo no Sol de Dó Maior.',
            chords: [
              [48, 60, 64, 67],
              [41, 60, 65, 69],
              [41, 60, 65, 68],
              [48, 60, 64, 67]
            ],
            chordNames: ['C', 'F', 'Fm (AEM)', 'C'],
            tempoMs: 900,
            type: 'cadence'
          },
          {
            title: 'Dominante Secundário V7/II (C -> A7 -> Dm7 -> G7 -> C)',
            description: 'Ouça o acorde A7 com seu Dó# criando atração magnética direta para a chegada de Dm7.',
            chords: [
              [48, 60, 64, 67],
              [45, 57, 61, 64, 67],
              [50, 57, 62, 65, 69],
              [43, 59, 62, 65, 67],
              [48, 60, 64, 67]
            ],
            chordNames: ['C', 'A7 (V7/II)', 'Dm7', 'G7', 'C'],
            tempoMs: 850,
            type: 'cadence'
          }
        ],
        quiz: {
          question: 'Na tonalidade de Dó Maior, qual é o dominante secundário que prepara a chegada do acorde Dm (V7/II)?',
          options: ['E7', 'A7', 'B7', 'D7'],
          correctIndex: 1,
          explanation: 'O quinto grau de Ré é Lá. Portanto, o acorde dominante secundário que prepara o Dm é o acorde A7 (V7/II).'
        }
      }
    ]
  }
];
