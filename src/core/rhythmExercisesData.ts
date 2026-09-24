import type { ScoreNote } from './coursesData';
import type { TimeSignature } from './types';

export interface RhythmExercise {
  id: string;
  instrument: 'keyboard' | 'guitar';
  title: string;
  subtitle: string;
  category: 'Pulso Fundamental' | 'Métrica Ternária' | 'Subdivisão & Contratempo' | 'Síncopa & Ligaduras' | 'Arpejos & Levadas';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  timeSignature: TimeSignature;
  recommendedBpm: number;
  description: string;
  pedagogicalFocus: string;
  techniqueTips: string[];
  chordsSummary?: string;
  strumPattern?: string;
  scoreTrack: ScoreNote[];
}

export const RHYTHM_EXERCISES: RhythmExercise[] = [
  // =========================================================================
  // EXERCÍCIOS DE TECLADO / PIANO
  // =========================================================================
  {
    id: 'k-pulse-5fingers',
    instrument: 'keyboard',
    title: 'Pulso Fundamental de 5 Dedos',
    subtitle: 'Semínimas na Região do Dó Central (C3–G3)',
    category: 'Pulso Fundamental',
    difficulty: 'Iniciante',
    timeSignature: '4/4',
    recommendedBpm: 75,
    description: 'Desenvolva o pulso interno estável tocando uma semínima em cada batida do metrônomo. Mantenha a mão direita em formato de cúpula com o polegar relaxado sobre o Dó Central.',
    pedagogicalFocus: 'Isocronia métrica, postura da mão curvada e independência individual de cada um dos 5 dedos.',
    techniqueTips: [
      'Posicione o dedo 1 (polegar) exatamente no Dó Central (C3).',
      'Articule a tecla com a polpa do dedo, sem deixar a mão "cair" para os lados.',
      'Sincronize o impacto exato do dedo com o clique audível do metrônomo.',
    ],
    scoreTrack: [
      // Compasso 1: Subida C3, D3, E3, F3
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, noteName: 'C3', fingerRightHand: 1 },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 1, noteName: 'D3', fingerRightHand: 2 },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'E3', fingerRightHand: 3 },
      { midi: 65, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'F3', fingerRightHand: 4 },
      // Compasso 2: Descida G3, F3, E3, D3
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, noteName: 'G3', fingerRightHand: 5 },
      { midi: 65, clef: 'treble', duration: 1, beat: 2, measure: 2, noteName: 'F3', fingerRightHand: 4 },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, noteName: 'E3', fingerRightHand: 3 },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, noteName: 'D3', fingerRightHand: 2 },
      // Compasso 3: Saltos melódicos C3, E3, G3, E3
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, noteName: 'C3', fingerRightHand: 1 },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 3, noteName: 'E3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, noteName: 'G3', fingerRightHand: 5 },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, noteName: 'E3', fingerRightHand: 3 },
      // Compasso 4: Resolução em semibreve no Dó Central
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 4, noteName: 'C3', fingerRightHand: 1 },
    ],
  },
  {
    id: 'k-waltz-34',
    instrument: 'keyboard',
    title: 'Valsa Clássica & Compasso Ternário',
    subtitle: 'Acentuação Dinâmica 3/4 (Forte - Fraco - Fraco)',
    category: 'Métrica Ternária',
    difficulty: 'Iniciante',
    timeSignature: '3/4',
    recommendedBpm: 84,
    description: 'No compasso ternário, o tempo 1 é nobre e acentuado, enquanto os tempos 2 e 3 são leves como passos de dança.',
    pedagogicalFocus: 'Diferenciação dinâmica de peso: o tempo 1 deve soar firme, os tempos 2 e 3 suaves e aéreos.',
    techniqueTips: [
      'Deixe o peso do braço cair no tempo 1 (baixo na Clave de Fá).',
      'Nos tempos 2 e 3, toque com toque mais leve nos acordes/notas agudas.',
      'Sinta a contagem interna: UM (forte), dois (fraco), três (fraco).',
    ],
    scoreTrack: [
      // Compasso 1 (3/4): C3 (Fá), E4, G4 (Sol)
      { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 1, noteName: 'C2', fingerLeftHand: 5 },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 1, noteName: 'E3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'G3', fingerRightHand: 5 },
      // Compasso 2 (3/4): C3 (Fá), E4, G4 (Sol)
      { midi: 48, clef: 'bass', duration: 1, beat: 1, measure: 2, noteName: 'C2', fingerLeftHand: 5 },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, noteName: 'E3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 2, noteName: 'G3', fingerRightHand: 5 },
      // Compasso 3 (3/4): G1, D3, F3
      { midi: 43, clef: 'bass', duration: 1, beat: 1, measure: 3, noteName: 'G1', fingerLeftHand: 5 },
      { midi: 62, clef: 'treble', duration: 1, beat: 2, measure: 3, noteName: 'D3', fingerRightHand: 2 },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 3, noteName: 'F3', fingerRightHand: 4 },
      // Compasso 4 (3/4): Resolução em C3 (mínima pontuada de 3 tempos)
      { midi: 60, clef: 'treble', duration: 3, beat: 1, measure: 4, noteName: 'C3', fingerRightHand: 1 },
    ],
  },
  {
    id: 'k-subdivision-eighths',
    instrument: 'keyboard',
    title: 'Subdivisão em Colcheias & Contratempo',
    subtitle: 'Contagem Rítmica "1 e 2 e 3 e 4 e"',
    category: 'Subdivisão & Contratempo',
    difficulty: 'Intermediário',
    timeSignature: '4/4',
    recommendedBpm: 72,
    description: 'Aprenda a dividir cada tempo ao meio com precisão milimétrica. Não corra nas colcheias — cada metade do tempo possui exatamente a mesma duração.',
    pedagogicalFocus: 'Metrônomo mental e controle de velocidade em notas de menor duração.',
    techniqueTips: [
      'Fale em voz alta: "Um - e - Dois - e - Três - e - Quatro - e".',
      'A nota do "e" deve cair exatamente no ponto intermediário entre dois cliques.',
      'Mantenha os dedos próximos das teclas para evitar toques atrasados.',
    ],
    scoreTrack: [
      // Compasso 1: Semínima no 1, duas colcheias no 2, semínimas no 3 e 4
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, noteName: 'C3', fingerRightHand: 1 },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'D3', fingerRightHand: 2 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'E3', fingerRightHand: 3 },
      { midi: 65, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'F3', fingerRightHand: 4 },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'G3', fingerRightHand: 5 },
      // Compasso 2: Colcheias contínuas descendentes e resolução
      { midi: 67, clef: 'treble', duration: 0.5, beat: 1, measure: 2, noteName: 'G3', fingerRightHand: 5 },
      { midi: 65, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, noteName: 'F3', fingerRightHand: 4 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 2, noteName: 'E3', fingerRightHand: 3 },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, noteName: 'D3', fingerRightHand: 2 },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 2, noteName: 'C3', fingerRightHand: 1 },
      // Compasso 3: Colcheias intercaladas
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 3, noteName: 'C3', fingerRightHand: 1 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 3, noteName: 'E3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, noteName: 'G3', fingerRightHand: 5 },
      { midi: 72, clef: 'treble', duration: 1, beat: 3, measure: 3, noteName: 'C4', fingerRightHand: 5 },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, noteName: 'G3', fingerRightHand: 3 },
      // Compasso 4: Mínima no 1 e Mínima no 3
      { midi: 64, clef: 'treble', duration: 2, beat: 1, measure: 4, noteName: 'E3', fingerRightHand: 2 },
      { midi: 60, clef: 'treble', duration: 2, beat: 3, measure: 4, noteName: 'C3', fingerRightHand: 1 },
    ],
  },
  {
    id: 'k-syncopation-jazz',
    instrument: 'keyboard',
    title: 'Síncopa & Acentuação Contratemporal',
    subtitle: 'Prolongamento do Tempo Fraco sobre o Tempo Forte',
    category: 'Síncopa & Ligaduras',
    difficulty: 'Avançado',
    timeSignature: '4/4',
    recommendedBpm: 80,
    description: 'A síncopa ocorre quando uma nota executada no tempo fraco é prolongada através do tempo forte seguinte, criando uma sensação vibrante de impulso rítmico.',
    pedagogicalFocus: 'Segurar notas através da barra de tempo sem adiantar o próximo ataque.',
    techniqueTips: [
      'Não bata o pé duas vezes durante a nota sincopada; mantenha o pulso com firmeza.',
      'Sinta a energia da nota que atravessa a fronteira do tempo.',
      'Mantenha o metrônomo audível para verificar se você não acelerou durante a síncopa.',
    ],
    scoreTrack: [
      // Compasso 1: Semínima no 1, síncopa de 1.5 tempo no 2, colcheia no 3.5, semínima no 4
      { midi: 60, clef: 'treble', duration: 1, beat: 1, measure: 1, noteName: 'C3', fingerRightHand: 1 },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 2, measure: 1, noteName: 'E3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, noteName: 'G3', fingerRightHand: 5 },
      { midi: 72, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'C4', fingerRightHand: 5 },
      // Compasso 2: Semínima no 1, contratempo no 2.5 prolongado
      { midi: 67, clef: 'treble', duration: 1, beat: 1, measure: 2, noteName: 'G3', fingerRightHand: 3 },
      { midi: 64, clef: 'treble', duration: 1.5, beat: 2.5, measure: 2, noteName: 'E3', fingerRightHand: 2 },
      { midi: 62, clef: 'treble', duration: 1, beat: 4, measure: 2, noteName: 'D3', fingerRightHand: 1 },
      // Compasso 3: Frase sincopada
      { midi: 60, clef: 'treble', duration: 1.5, beat: 1, measure: 3, noteName: 'C3', fingerRightHand: 1 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, noteName: 'E3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 1, beat: 3, measure: 3, noteName: 'G3', fingerRightHand: 4 },
      { midi: 64, clef: 'treble', duration: 1, beat: 4, measure: 3, noteName: 'E3', fingerRightHand: 2 },
      // Compasso 4: Resolução em semibreve no C3
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 4, noteName: 'C3', fingerRightHand: 1 },
    ],
  },
  {
    id: 'k-broken-chords',
    instrument: 'keyboard',
    title: 'Arpejo Contínuo & Fluidez Dó Maior',
    subtitle: 'Fluxo Ininterrupto de Colcheias Isócronas',
    category: 'Arpejos & Levadas',
    difficulty: 'Intermediário',
    timeSignature: '4/4',
    recommendedBpm: 84,
    description: 'Arpejar notas com precisão requer que cada dedo toque exatamente no instante milimétrico determinado pela métrica, sem engasgos nas mudanças de direção.',
    pedagogicalFocus: 'Fluidez do punho e articulação homogênea sem variação involuntária de tempo.',
    techniqueTips: [
      'O punho deve acompanhar o movimento ascendente da mão suavemente.',
      'Evite acentuar inadvertidamente o polegar ou o dedo 5.',
      'Cada colcheia deve soar com o mesmo volume e duração.',
    ],
    scoreTrack: [
      // Compasso 1: Arpejo C3-E3-G3-C4-G3-E3 e semínima C3
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 1, noteName: 'C3', fingerRightHand: 1 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'E3', fingerRightHand: 2 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'G3', fingerRightHand: 3 },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'C4', fingerRightHand: 5 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 1, noteName: 'G3', fingerRightHand: 3 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, noteName: 'E3', fingerRightHand: 2 },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'C3', fingerRightHand: 1 },
      // Compasso 2: Arpejo em Sol Maior (G2-B2-D3-G3-D3-B2-G2)
      { midi: 55, clef: 'treble', duration: 0.5, beat: 1, measure: 2, noteName: 'G2', fingerRightHand: 1 },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, noteName: 'B2', fingerRightHand: 2 },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 2, noteName: 'D3', fingerRightHand: 3 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, noteName: 'G3', fingerRightHand: 5 },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3, measure: 2, noteName: 'D3', fingerRightHand: 3 },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, noteName: 'B2', fingerRightHand: 2 },
      { midi: 55, clef: 'treble', duration: 1, beat: 4, measure: 2, noteName: 'G2', fingerRightHand: 1 },
      // Compasso 3: Retorno a Dó Maior
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1, measure: 3, noteName: 'C3', fingerRightHand: 1 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, noteName: 'E3', fingerRightHand: 2 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 2, measure: 3, noteName: 'G3', fingerRightHand: 3 },
      { midi: 72, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, noteName: 'C4', fingerRightHand: 5 },
      { midi: 67, clef: 'treble', duration: 0.5, beat: 3, measure: 3, noteName: 'G3', fingerRightHand: 3 },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, noteName: 'E3', fingerRightHand: 2 },
      { midi: 60, clef: 'treble', duration: 1, beat: 4, measure: 3, noteName: 'C3', fingerRightHand: 1 },
      // Compasso 4: Acorde Dó Maior em semibreve
      { midi: 60, clef: 'treble', duration: 4, beat: 1, measure: 4, noteName: 'C3', fingerRightHand: 1 },
    ],
  },

  // =========================================================================
  // EXERCÍCIOS DE VIOLÃO / GUITARRA ACÚSTICA
  // =========================================================================
  {
    id: 'g-strum-down',
    instrument: 'guitar',
    title: 'Batida Básica de Semínimas (↓ ↓ ↓ ↓)',
    subtitle: 'Ataques Constantes para Baixo nos Acordes Em e G',
    category: 'Pulso Fundamental',
    difficulty: 'Iniciante',
    timeSignature: '4/4',
    recommendedBpm: 75,
    description: 'A base rítmica de todo violonista. Quatro movimentos para baixo por compasso, com foco em manter a palheta ou o polegar passando uniformemente por todas as cordas.',
    pedagogicalFocus: 'Relaxamento do punho direito e sincronização milimétrica com os 4 tempos da batida.',
    techniqueTips: [
      'Gire o punho como se estivesse sacudindo água dos dedos, sem travar o cotovelo.',
      'No tempo 1, acerte bem o bordão mais grave (corda 6 em Em e G).',
      'Nos tempos 2, 3 e 4, mantenha a mesma velocidade de descida.',
    ],
    chordsSummary: 'Em  |  Em  |  G  |  Em',
    strumPattern: '↓    ↓    ↓    ↓',
    scoreTrack: [
      // Compasso 1: Em (4 tempos para baixo)
      { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 1, noteName: 'E1', chordName: 'Em' },
      { midi: 52, clef: 'treble', duration: 1, beat: 2, measure: 1, noteName: 'E2', chordName: 'Em' },
      { midi: 55, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'G2', chordName: 'Em' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 1, noteName: 'B2', chordName: 'Em' },
      // Compasso 2: Em (4 tempos para baixo)
      { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 2, noteName: 'E1', chordName: 'Em' },
      { midi: 52, clef: 'treble', duration: 1, beat: 2, measure: 2, noteName: 'E2', chordName: 'Em' },
      { midi: 55, clef: 'treble', duration: 1, beat: 3, measure: 2, noteName: 'G2', chordName: 'Em' },
      { midi: 59, clef: 'treble', duration: 1, beat: 4, measure: 2, noteName: 'B2', chordName: 'Em' },
      // Compasso 3: G (Sol Maior - Baixo G2 no tempo 1)
      { midi: 43, clef: 'bass', duration: 1, beat: 1, measure: 3, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 1, beat: 2, measure: 3, noteName: 'G2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 1, beat: 3, measure: 3, noteName: 'B2', chordName: 'G' },
      { midi: 67, clef: 'treble', duration: 1, beat: 4, measure: 3, noteName: 'G3', chordName: 'G' },
      // Compasso 4: Retorno a Em com sustentação final
      { midi: 40, clef: 'bass', duration: 4, beat: 1, measure: 4, noteName: 'E1', chordName: 'Em' },
    ],
  },
  {
    id: 'g-waltz-pim',
    instrument: 'guitar',
    title: 'Valsa & Balada Dedilhada (P - i - m)',
    subtitle: 'Polegar no Baixo e Puxadas nas Cordas Agudas',
    category: 'Métrica Ternária',
    difficulty: 'Iniciante',
    timeSignature: '3/4',
    recommendedBpm: 84,
    description: 'A clássica levada ternária de violão: Polegar (P) no bordão no tempo 1 (baixo forte), e dedos Indicador (i) e Médio (m) puxando as cordas agudas nos tempos 2 e 3.',
    pedagogicalFocus: 'Separação de planos sonoros no violão: baixo nítido e harmonia suave e aérea.',
    techniqueTips: [
      'Polegar (P) ataca a corda para baixo com firmeza no tempo 1.',
      'Indicador (i) e Médio (m) puxam as cordas 2 e 1 para cima suavemente nos tempos 2 e 3.',
      'Mantenha a mão direita parada em posição de concha, sem pular.',
    ],
    chordsSummary: 'Am  |  Am  |  E7  |  Am',
    strumPattern: 'P    i    m',
    scoreTrack: [
      // Compasso 1 (3/4): Am -> Baixo A2 (P), C4 (i), E4 (m)
      { midi: 45, clef: 'bass', duration: 1, beat: 1, measure: 1, noteName: 'A1', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 1, noteName: 'C3', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 1, noteName: 'E3', chordName: 'Am' },
      // Compasso 2 (3/4): Am
      { midi: 45, clef: 'bass', duration: 1, beat: 1, measure: 2, noteName: 'A1', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 1, beat: 2, measure: 2, noteName: 'C3', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 1, beat: 3, measure: 2, noteName: 'E3', chordName: 'Am' },
      // Compasso 3 (3/4): E7 -> Baixo E2 (P), B3 (i), D4 (m)
      { midi: 40, clef: 'bass', duration: 1, beat: 1, measure: 3, noteName: 'E1', chordName: 'E7' },
      { midi: 59, clef: 'treble', duration: 1, beat: 2, measure: 3, noteName: 'B2', chordName: 'E7' },
      { midi: 62, clef: 'treble', duration: 1, beat: 3, measure: 3, noteName: 'D3', chordName: 'E7' },
      // Compasso 4 (3/4): Acorde Am arpejado em 3 tempos
      { midi: 45, clef: 'bass', duration: 3, beat: 1, measure: 4, noteName: 'A1', chordName: 'Am' },
    ],
  },
  {
    id: 'g-pop-alternate',
    instrument: 'guitar',
    title: 'Levada Pop/Rock Alternada (↓ ↑ ↓ ↑)',
    subtitle: 'Subdivisão Rítmica de Colcheias com Movimento Pendular',
    category: 'Subdivisão & Contratempo',
    difficulty: 'Intermediário',
    timeSignature: '4/4',
    recommendedBpm: 80,
    description: 'O braço direito funciona como um pêndulo contínuo: bate para baixo no tempo principal e para cima no contratempo. Dominar esse movimento garante que seu ritmo nunca oscile.',
    pedagogicalFocus: 'Movimento pendular ininterrupto e acentuação da "caixa" nos tempos 2 e 4.',
    techniqueTips: [
      'Suba com o indicador ou palheta suavemente, tocando apenas as 3 cordas mais agudas no contratempo.',
      'Dê uma ênfase extra na batida para baixo nos tempos 2 e 4.',
      'Mesmo nas pausas, o braço continua oscilando sem tocar as cordas.',
    ],
    chordsSummary: 'C  |  Am  |  F  |  G',
    strumPattern: '↓ ↑ ↓ ↑  ↓ ↑ ↓ ↑',
    scoreTrack: [
      // Compasso 1 (C): 8 colcheias alternadas
      { midi: 48, clef: 'bass', duration: 0.5, beat: 1, measure: 1, noteName: 'C2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'C3', chordName: 'C' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 2, measure: 1, noteName: 'E2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'E3', chordName: 'C' },
      { midi: 55, clef: 'treble', duration: 0.5, beat: 3, measure: 1, noteName: 'G2', chordName: 'C' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, noteName: 'C3', chordName: 'C' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 4, measure: 1, noteName: 'E2', chordName: 'C' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, noteName: 'E3', chordName: 'C' },
      // Compasso 2 (Am): 8 colcheias alternadas
      { midi: 45, clef: 'bass', duration: 0.5, beat: 1, measure: 2, noteName: 'A1', chordName: 'Am' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, noteName: 'A2', chordName: 'Am' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 2, measure: 2, noteName: 'E2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, noteName: 'C3', chordName: 'Am' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 3, measure: 2, noteName: 'A2', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, noteName: 'E3', chordName: 'Am' },
      { midi: 52, clef: 'bass', duration: 0.5, beat: 4, measure: 2, noteName: 'E2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 4.5, measure: 2, noteName: 'C3', chordName: 'Am' },
      // Compasso 3 (G): 8 colcheias
      { midi: 43, clef: 'bass', duration: 0.5, beat: 1, measure: 3, noteName: 'G1', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, noteName: 'G2', chordName: 'G' },
      { midi: 50, clef: 'bass', duration: 0.5, beat: 2, measure: 3, noteName: 'D2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, noteName: 'B2', chordName: 'G' },
      { midi: 55, clef: 'treble', duration: 0.5, beat: 3, measure: 3, noteName: 'G2', chordName: 'G' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, noteName: 'D3', chordName: 'G' },
      { midi: 50, clef: 'bass', duration: 0.5, beat: 4, measure: 3, noteName: 'D2', chordName: 'G' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, noteName: 'B2', chordName: 'G' },
      // Compasso 4: Resolução em C em semibreve
      { midi: 48, clef: 'bass', duration: 4, beat: 1, measure: 4, noteName: 'C2', chordName: 'C' },
    ],
  },
  {
    id: 'g-baiao-syncopation',
    instrument: 'guitar',
    title: 'Baião & Balanço Sincopado Nordestino',
    subtitle: 'O Clássico Ritmo Brasileiro ("Tum... Tá-Tá-Tum")',
    category: 'Síncopa & Ligaduras',
    difficulty: 'Avançado',
    timeSignature: '2/4',
    recommendedBpm: 88,
    description: 'O baião é um dos tesouros da música brasileira. A batida do zabumba é transportada para o violão: o bordão grave sustenta e antecipa o balanço, enquanto os dedos puxam os acordes sincopados.',
    pedagogicalFocus: 'Suíngue brasileiro e controle de dinâmica na síncopa sem perder o compasso binário.',
    techniqueTips: [
      'Polegar no bordão dá o "TUM" pesado no início do compasso.',
      'As puxadas dos dedos devem ser curtas e percussivas (staccato sutil).',
      'Abraçe a síncopa sem acelerar; o tempo deve balançar com precisão.',
    ],
    chordsSummary: 'A7  |  D7  |  A7  |  E7',
    strumPattern: 'Tum... Tá-Tá-Tum',
    scoreTrack: [
      // Compasso 1 (2/4): Bordão A2 (0.75 tempo), puxada C#4 (0.25), puxada E4 (0.5), resposta A2 (0.5)
      { midi: 45, clef: 'bass', duration: 0.75, beat: 1, measure: 1, noteName: 'A1', chordName: 'A7' },
      { midi: 61, clef: 'treble', duration: 0.25, beat: 1.75, measure: 1, noteName: 'C#3', chordName: 'A7' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'E3', chordName: 'A7' },
      // Compasso 2 (2/4):
      { midi: 45, clef: 'bass', duration: 0.5, beat: 1, measure: 2, noteName: 'A1', chordName: 'A7' },
      { midi: 61, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, noteName: 'C#3', chordName: 'A7' },
      { midi: 64, clef: 'treble', duration: 1, beat: 2, measure: 2, noteName: 'E3', chordName: 'A7' },
      // Compasso 3 (2/4): D7
      { midi: 50, clef: 'bass', duration: 0.75, beat: 1, measure: 3, noteName: 'D2', chordName: 'D7' },
      { midi: 60, clef: 'treble', duration: 0.25, beat: 1.75, measure: 3, noteName: 'C3', chordName: 'D7' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2, measure: 3, noteName: 'D3', chordName: 'D7' },
      // Compasso 4 (2/4): Batida seca final em A7
      { midi: 45, clef: 'bass', duration: 2, beat: 1, measure: 4, noteName: 'A1', chordName: 'A7' },
    ],
  },
  {
    id: 'g-classical-pima',
    instrument: 'guitar',
    title: 'Arpejo Canônico Erudito P-I-M-A',
    subtitle: 'Técnica Canônica de Violão de Concerto',
    category: 'Arpejos & Levadas',
    difficulty: 'Avançado',
    timeSignature: '4/4',
    recommendedBpm: 75,
    description: 'A fórmula mais nobre do violão clássico: P (Polegar no baixo), I (Indicador na 3ª corda), M (Médio na 2ª corda) e A (Anelar na 1ª corda). Cada dedo deve soar como uma gota d’água perfeitamente afinada e pontual.',
    pedagogicalFocus: 'Isocronia estrita, independência dos 4 dedos da mão direita e equilíbrio de volume.',
    techniqueTips: [
      'P apoia levemente na corda de baixo após o toque; I, M e A tocam "sem apoio" (tirando a corda).',
      'O anelar (A) costuma ser o dedo mais fraco: pratique dando atenção para que ele não soe sumido.',
      'Mantenha o andamento lento no início para garantir que o tempo entre as 4 notas seja 100% idêntico.',
    ],
    chordsSummary: 'Am  |  Dm  |  E7  |  Am',
    strumPattern: 'P - I - M - A',
    scoreTrack: [
      // Compasso 1 (Am): P(A1), I(A2), M(C3), A(E3) x 2 vezes
      { midi: 45, clef: 'bass', duration: 0.5, beat: 1, measure: 1, noteName: 'A1', chordName: 'Am' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 1.5, measure: 1, noteName: 'A2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 2, measure: 1, noteName: 'C3', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 1, noteName: 'E3', chordName: 'Am' },
      { midi: 45, clef: 'bass', duration: 0.5, beat: 3, measure: 1, noteName: 'A1', chordName: 'Am' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 3.5, measure: 1, noteName: 'A2', chordName: 'Am' },
      { midi: 60, clef: 'treble', duration: 0.5, beat: 4, measure: 1, noteName: 'C3', chordName: 'Am' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 4.5, measure: 1, noteName: 'E3', chordName: 'Am' },
      // Compasso 2 (Dm): P(D3), I(F3), M(A3), A(D4) x 2 vezes
      { midi: 50, clef: 'bass', duration: 0.5, beat: 1, measure: 2, noteName: 'D2', chordName: 'Dm' },
      { midi: 53, clef: 'treble', duration: 0.5, beat: 1.5, measure: 2, noteName: 'F2', chordName: 'Dm' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 2, measure: 2, noteName: 'A2', chordName: 'Dm' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 2.5, measure: 2, noteName: 'D3', chordName: 'Dm' },
      { midi: 50, clef: 'bass', duration: 0.5, beat: 3, measure: 2, noteName: 'D2', chordName: 'Dm' },
      { midi: 53, clef: 'treble', duration: 0.5, beat: 3.5, measure: 2, noteName: 'F2', chordName: 'Dm' },
      { midi: 57, clef: 'treble', duration: 0.5, beat: 4, measure: 2, noteName: 'A2', chordName: 'Dm' },
      { midi: 62, clef: 'treble', duration: 0.5, beat: 4.5, measure: 2, noteName: 'D3', chordName: 'Dm' },
      // Compasso 3 (E7): P(E2), I(G#3), M(B3), A(E4) x 2 vezes
      { midi: 40, clef: 'bass', duration: 0.5, beat: 1, measure: 3, noteName: 'E1', chordName: 'E7' },
      { midi: 56, clef: 'treble', duration: 0.5, beat: 1.5, measure: 3, noteName: 'G#2', chordName: 'E7' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 2, measure: 3, noteName: 'B2', chordName: 'E7' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 2.5, measure: 3, noteName: 'E3', chordName: 'E7' },
      { midi: 40, clef: 'bass', duration: 0.5, beat: 3, measure: 3, noteName: 'E1', chordName: 'E7' },
      { midi: 56, clef: 'treble', duration: 0.5, beat: 3.5, measure: 3, noteName: 'G#2', chordName: 'E7' },
      { midi: 59, clef: 'treble', duration: 0.5, beat: 4, measure: 3, noteName: 'B2', chordName: 'E7' },
      { midi: 64, clef: 'treble', duration: 0.5, beat: 4.5, measure: 3, noteName: 'E3', chordName: 'E7' },
      // Compasso 4: Arpejo lento de encerramento em Am
      { midi: 45, clef: 'bass', duration: 4, beat: 1, measure: 4, noteName: 'A1', chordName: 'Am' },
    ],
  },
];
