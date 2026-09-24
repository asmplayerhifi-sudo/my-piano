# Especificação de Requisitos, Engenharia de Software & Arquitetura Modular

## Plataforma Interativa de Educação Musical (Teclado, Violão & Laboratório Rítmico)

---

## 1. Diretrizes Fundamentais de Engenharia & Clean Code

Para garantir a escalabilidade sustentável, manutenibilidade contínua e testabilidade absoluta do ecossistema, o projeto adota regras estritas de desenvolvimento baseadas nos princípios **SOLID**, **Clean Code** e **Domain-Driven Design (DDD)**.

### 1.1 Regras Normativas de Modularidade e Limites de Arquivo
1. **Princípio da Responsabilidade Única (SRP):** Cada classe, componente ou módulo deve ter uma, e apenas uma, razão para mudar. Um arquivo que cuida do cálculo de frequência de nota **não pode** conter regras de animação visual ou agendamento de áudio.
2. **Teto Rígido de Linhas por Arquivo:** Nenhum arquivo de código-fonte de lógica de domínio ou aplicação deve ultrapassar **150 linhas de código útil**. Componentes visuais não devem exceder **200 linhas**. Se ultrapassarem, devem ser imediatamente decompostos em subcomponentes ou hooks/serviços especializados.
3. **Complexidade Ciclomática Máxima:** Funções de cálculo ou avaliação devem manter complexidade ciclomática $\le 6$. Métodos com múltiplos desvios condicionais aninhados devem ser decompostos com os padrões *Strategy*, *Chain of Responsibility* ou *State*.
4. **Isolamento do Core Musical:** O pacote `music-domain-core` deve ser $100\%$ agnóstico de plataforma. Ele não pode importar dependências de tela (React, Flutter Widgets, Canvas DOM) nem dependências de drivers de som (Web Audio API, Oboe, AAudio). Ele consiste apenas em modelos matemáticos e funções puras determinísticas.

```
+─────────────────────────────────────────────────────────────────────────────+
|                         HIERARQUIA DE ISOLAMENTO LIMPO                      |
+─────────────────────────────────────────────────────────────────────────────+
| [UI / Telas]          ──(Dispara ação)──> [Casos de Uso Atômicos (<120 lin)]|
|                                                    │                        |
|                                       (Consome)    ▼                        |
| [Drivers de Entrada]  ──(Eventos brutos)──> [Serviços de Domínio Puros]     |
| (Web MIDI / Microfone)                     (Note, Interval, Chord, Scale)   |
+─────────────────────────────────────────────────────────────────────────────+
```

---

## 2. Padrão Didático Unificado: Microlearning & Validação Interativa

A retenção cognitiva de teoria e mecânica instrumental depende de ciclos rápidos de **Exposição Concisa $\to$ Visualização Imediata $\to$ Prática Motora $\to$ Feedback Instantâneo**.

### 2.1 A Tríade Obrigatória de Toda Aula
Toda e qualquer aula contida nos cursos de Teclado, Violão e Ritmo deve respeitar a estrutura modular invariável:

| Componente | Especificação Pedagógica | Limite de Tempo / Formato |
| :--- | :--- | :--- |
| **1. Texto Conciso** | Explicação ultra-objetiva sem jargões desnecessários; foco no *porquê* e no *como*. | Leitura estimada entre **60 a 90 segundos** (< 180 palavras). |
| **2. Figura Explicativa** | Diagrama vetorial (SVG limpo) ou mapa mental focado na geometria do instrumento. | 1 infográfico central em alta definição com destaque cromático funcional. |
| **3. Exercício Interativo** | Prática hands-on imediata avaliada por entrada MIDI, microfone acústico ou toque em tela. | Avaliação em tempo real com **feedback corretivo em $< 45\text{ ms}$**. |

### 2.2 Critério de Passagem e Gamificação Formativa
* **Barra de Sucesso:** O aluno só progride para a aula seguinte se obtiver acurácia rítmica e posicional $\ge 80\%$.
* **Detecção e Correção de Erro Comum:** O sistema detecta o tipo de falha (ex: *dedo incorreto*, *corda abafada por ângulo ruim*, *atraso rítmico recorrente*) e exibe imediatamente um card de ajuste biomecânico antes da próxima tentativa.

---

## 3. Especificação Detalhada das Telas (UI/UX & Estados de Interação)

Cada tela do aplicativo é modelada sob os padrões internacionais de acessibilidade **WCAG 2.1 nível AAA**, suporte nativo a toque e layout responsivo de alto desempenho.

```
+─────────────────────────────────────────────────────────────────────────────+
| TELAS DO SISTEMA                                                            |
| 1. SCREEN_DASHBOARD       | Visão geral, trilha de progresso e métricas     |
| 2. SCREEN_LESSON_PLAYER   | Sala de aula: teoria concisa + esteira + instrumento|
| 3. SCREEN_RHYTHM_LAB      | Metrônomo sonoro, esteira rítmica e pulso oculto|
| 4. SCREEN_CHORD_LAB       | Mapeador interativo: Teclado vs. Violão (CAGED) |
| 5. SCREEN_SIGHT_READING   | Leitura de partitura à primeira vista e solfejo |
+─────────────────────────────────────────────────────────────────────────────+
```

---

### 3.1 SCREEN_LESSON_PLAYER: A Sala de Aula Interativa

#### Diagrama de Blocos da Interface
```
+─────────────────────────────────────────────────────────────────────────────+
| [◄ Voltar]  Módulo T3.1: Tríades Maiores (Dó Maior)       Progresso: [65%]  |
+─────────────────────────────────────────────────────────────────────────────+
| [CARD DIDÁTICO CONCISO]                                                     |
| "A tríade maior soma: Fundamental (C) + 4 semitons (E) + 3 semitons (G)."   |
| [FIGURA VETORIAL EXPLICATIVA DA REGRA CROMÁTICA: C -> E -> G]               |
+─────────────────────────────────────────────────────────────────────────────+
| ESTEIRA DINÂMICA / PARTITURA DESLIZANTE                                     |
|                              BARRA DE IMPACTO                               |
| 𝄞 4/4  ─────[ C ]──────────────│──[ E ]───────────[ G ]───────────►         |
+─────────────────────────────────────────────────────────────────────────────+
| INSTRUMENTO SINCRONIZADO (TECLADO VIRTUAL OU BRAÇO DE VIOLÃO)               |
|  [ C ] [ D ] [ E ] [ F ] [ G ] [ A ] [ B ] [ C ]                            |
|   (1)         (3)         (5)                                               |
|  [Vermelho]  [Azul]      [Verde]                                            |
+─────────────────────────────────────────────────────────────────────────────+
| FEEDBACK: "PERFEITO (+8ms)" | BOTÕES: [ ↺ Repetir ] [ 🎚️ 60 BPM ] [ 💡 Dica ]|
+─────────────────────────────────────────────────────────────────────────────+
```

#### Especificação de Estados da Máquina de UI (`LessonPlayerState`)
* **`IDLE_EXPLANATION`:** Exibe a teoria concisa e a figura vetorial. O áudio do exemplo pode ser ouvido sob demanda.
* **`WAITING_INPUT`:** Modo "Espere pela Nota". A partitura fica fixa no primeiro acorde; o sistema aguarda que o usuário pressione as notas corretas no teclado/violão.
* **`FLOW_EVALUATING`:** A partitura rola continuamente no BPM estabelecido. O analisador rítmico quantiza os tempos de ataque e sustentação.
* **`FEEDBACK_SUCCESS`:** Realce luminoso em verde (`#16a34a`), emissão de som sutil de recompensa e liberação da próxima lição.
* **`FEEDBACK_RETRY`:** Realce de correção em âmbar (`#d97706`) com a mensagem diagnóstica (ex.: *"Você tocou o Ré em vez do Mi. Observe a tecla preta intermediária"*).

---

### 3.2 SCREEN_RHYTHM_LAB: O Laboratório de Precisão e Pulso Interno

#### Requisitos de Interface e Interação
* **Esteira Rítmica de Alta Taxa de Quadros:** Marcadores de tempo deslizam horizontalmente a $60\text{ ou }120\text{ FPS}$ em direção a uma mira central de impacto.
* **Área de Toque Cinestésica:** Botão tátil amplo cobrindo o terço inferior da tela, permitindo que o estudante bata palmas ou toque com o polegar sem desviar o olhar da mira.
* **Display de Métricas em Tempo Real:** Indicador numérico em milissegundos ($\Delta t$) para cada toque:
  * Verde ($\le \pm 25\text{ ms}$): *Perfeito*.
  * Azul ($\pm 25\text{ a } \pm 60\text{ ms}$): *Bom*.
  * Vermelho ($> \pm 60\text{ ms}$): *Adiantado / Atrasado*.
* **Comutador de Modo "Metrônomo Oculto":** Permite definir ciclos automáticos de 2 compassos sonoros seguidos por 2 compassos em silêncio absoluto para forçar a internalização do pulso.

---

### 3.3 SCREEN_CHORD_LAB: Mapeador Comparativo Teclado vs. Violão

#### Requisitos Funcionais e Geométricos
* **Modo Teclado:**
  * Exibição de 2 oitavas completas com transposição rápida de oitava ($-1, 0, +1$).
  * Destaque cromático estrutural: Fundamental em Vermelho (`#dc2626`), Terça em Azul (`#2563eb`), Quinta em Verde (`#16a34a`), Sétima em Roxo (`#7e22ce`).
  * Sugestão de dedilhado internacional para Mão Direita (MD: $1, 2, 3, 4, 5$) e Mão Esquerda (ME: $5, 4, 3, 2, 1$).
  * Alternador de Inversão instantâneo: Botões `[Fundamental]`, `[1ª Inversão]`, `[2ª Inversão]`, exibindo as notas em movimento suave.
* **Modo Violão:**
  * Braço com 15 casas e 6 cordas vetoriais.
  * Marcador de pestana em bloco arredondado.
  * Identificador claro de cordas soltas com som ativo ($O$) e cordas mudas/abafadas ($X$).
  * Seletor do Sistema CAGED para alternar os 5 shapes do mesmo acorde ao longo do braço.
  * Seletor de Baixo Invertido ($C, C/E, C/G$), destacando a nota mais grave que deve ser tocada.

---

## 4. Arquitetura Modular de Classes Pequenas (Clean Architecture)

Seguindo o princípio de classes pequenas, cada responsabilidade é dividida em arquivos independentes com interfaces formais.

```
src/
├── domain/                               # REGRAS DE NEGÓCIO PURAS (ZERO DEPENDÊNCIAS DE FRAMEWORK)
│   ├── entities/
│   │   ├── Note.ts                       # Representação imutável de uma nota musical (< 60 linhas)
│   │   ├── Interval.ts                   # Cálculo de semitons e qualidade de intervalos (< 70 linhas)
│   │   ├── Chord.ts                      # Estrutura de tríades, tétrades e inversões (< 90 linhas)
│   │   └── MetricMeasure.ts              # Modelo métrico e subdivisão temporal (< 80 linhas)
│   ├── value-objects/
│   │   ├── PitchFrequency.ts             # Conversão Hz <-> MIDI <-> Nome da Nota (< 50 linhas)
│   │   └── FingeringMap.ts               # Mapeamento biomecânico de dedos (< 40 linhas)
│   └── services/
│       ├── CAGEDCalculator.ts            # Cálculo matemático de posições no violão (< 110 linhas)
│       └── VoiceLeadingOptimizer.ts      # Lei do menor esforço em inversões (< 100 linhas)
│
├── application/                          # CASOS DE USO ATÔMICOS (1 CLASSE = 1 RESPONSABILIDADE)
│   ├── use-cases/
│   │   ├── EvaluateRhythmStrikeUseCase.ts# Quantização de precisão em milissegundos (< 75 linhas)
│   │   ├── VerifyChordVoicingUseCase.ts  # Comparação de notas tocadas vs esperadas (< 85 linhas)
│   │   └── TransposeLessonUseCase.ts     # Transposição modal e tonal dinâmica (< 60 linhas)
│   └── ports/
│       ├── AudioClockPort.ts             # Interface para relógio de alta precisão (< 30 linhas)
│       ├── AudioSynthesisPort.ts         # Interface para reprodução sonoplástica (< 40 linhas)
│       └── MidiInputPort.ts              # Interface de escuta Web MIDI (< 35 linhas)
│
└── infrastructure/                       # IMPLEMENTAÇÕES CONCRETAS DE HARDWARE E UI
    ├── audio/
    │   ├── LookaheadScheduler.ts         # Agendador Web Audio livre de drift/jitter (< 120 linhas)
    │   └── SyntheticInstrumentSynth.ts   # Oscilador polifônico sintetizado (< 110 linhas)
    ├── midi/
    │   └── BrowserMidiDriver.ts          # Conexão física com teclados USB (< 95 linhas)
    └── ui/                               # COMPONENTES VISUAIS COMPACTOS
        ├── PianoKeyboard/
        ├── FretboardView/
        └── ScrollingScoreCanvas/
```

### 4.1 Exemplo Canônico de Caso de Uso Compacto (SRP)

```typescript
// src/application/use-cases/EvaluateRhythmStrikeUseCase.ts
import { PerformanceGrade, PerformanceEvaluation } from '../../domain/entities/MetricMeasure';

export interface RhythmStrikeInput {
  readonly expectedTimeMs: number;
  readonly actualTimeMs: number;
  readonly currentBpm: number;
}

export class EvaluateRhythmStrikeUseCase {
  private readonly PERFECT_WINDOW_MS = 25.0;
  private readonly GOOD_WINDOW_MS = 60.0;

  public execute(input: RhythmStrikeInput): PerformanceEvaluation {
    const deltaMs = input.actualTimeMs - input.expectedTimeMs;
    const absDelta = Math.abs(deltaMs);

    let grade: PerformanceGrade = 'MISSED';
    let points = 0;

    if (absDelta <= this.PERFECT_WINDOW_MS) {
      grade = 'PERFECT';
      points = 100;
    } else if (absDelta <= this.GOOD_WINDOW_MS) {
      grade = 'GOOD';
      points = 70;
    } else if (absDelta <= 120.0) {
      grade = 'OFF_TIME';
      points = 30;
    }

    return {
      timeDeltaMs: deltaMs,
      grade,
      scorePoints: points,
      isEarly: deltaMs < -this.PERFECT_WINDOW_MS,
      isLate: deltaMs > this.PERFECT_WINDOW_MS
    };
  }
}
```

---

## 5. Suíte de Testes Unitários & Comportamentais (TDD & BDD)

Cada caso de uso e cálculo harmônico deve possuir cobertura de testes automatizados com execução em milissegundos via Jest, Vitest ou Dart Test.

### 5.1 Cenários BDD em Linguagem Gherkin

```gherkin
Funcionalidade: Avaliação de Precisão de Ataque Rítmico
  Como um estudante com dificuldades de andamento
  Eu quero receber um feedback milimétrico do meu ataque no metrônomo
  Para que eu possa ajustar meu pulso interno e eliminar a hesitação

  Cenário: Ataque rítmico perfeito dentro da janela estrita de 25ms
    Dado que a lição está configurada para 60 BPM
    E a semínima alvo deve soar exatamente no timestamp 1000.0 ms
    Quando o estudante toca na tela no timestamp 1012.0 ms (+12ms)
    Então o sistema deve classificar o ataque como "PERFECT"
    E atribuir 100 pontos de acurácia
    E o indicador não deve marcar nem adiantado nem atrasado

  Cenário: Ataque rítmico adiantado fora da tolerância ideal
    Dado que a lição está configurada para 80 BPM
    E a nota alvo deve soar no timestamp 2000.0 ms
    Quando o estudante toca na tela no timestamp 1930.0 ms (-70ms)
    Então o sistema deve classificar o ataque como "OFF_TIME"
    E marcar o alerta visual como "ADIANTADO"
    E sugerir ao aluno que respire e aguarde o clique do pulso
```

### 5.2 Testes Unitários do Core Musical (TypeScript / Vitest)

```typescript
// tests/domain/ChordVoicing.spec.ts
import { describe, it, expect } from 'vitest';
import { Chord } from '../../src/domain/entities/Chord';
import { Note } from '../../src/domain/entities/Note';

describe('Chord Domain Entity & Inversions', () => {
  it('deve construir a tríade de Dó Maior (C) na posição fundamental corretamente', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    
    expect(cMajor.symbol).toBe('C');
    expect(cMajor.notes.map((n: Note) => n.fullName)).toEqual(['C4', 'E4', 'G4']);
    expect(cMajor.bassNote.fullName).toBe('C4');
  });

  it('deve calcular a 1ª Inversão (C/E) com baixo na terça Mi', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    const firstInversion = cMajor.toInversion(1);

    expect(firstInversion.symbol).toBe('C/E');
    expect(firstInversion.notes.map((n: Note) => n.fullName)).toEqual(['E4', 'G4', 'C5']);
    expect(firstInversion.bassNote.fullName).toBe('E4');
  });

  it('deve calcular a 2ª Inversão (C/G) com baixo na quinta Sol', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    const secondInversion = cMajor.toInversion(2);

    expect(secondInversion.symbol).toBe('C/G');
    expect(secondInversion.notes.map((n: Note) => n.fullName)).toEqual(['G4', 'C5', 'E5']);
    expect(secondInversion.bassNote.fullName).toBe('G4');
  });

  it('deve validar se um conjunto de notas tocadas corresponde à tríade esperada independente da ordem', () => {
    const cMajor = Chord.createTriad({ root: 'C', quality: 'MAJOR', octave: 4 });
    const playedKeys = ['G4', 'C4', 'E4']; // Tocado desordenado

    const isMatch = cMajor.matchesVoicing(playedKeys);
    expect(isMatch).toBe(true);
  });
});
```

### 5.3 Testes Unitários de Agendamento do Metrônomo (Prevenção de Jitter)

```typescript
// tests/infrastructure/LookaheadScheduler.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { LookaheadScheduler } from '../../src/infrastructure/audio/LookaheadScheduler';

describe('LookaheadScheduler Temporal Precision', () => {
  it('deve calcular os instantes de pulso com intervalo matematicamente exato para 60 BPM', () => {
    const scheduler = new LookaheadScheduler({ bpm: 60, meter: 4 });
    
    // Em 60 BPM, o intervalo exato entre semínimas é rigorosamente 1.000000 segundo
    const beatInterval = scheduler.calculateBeatDurationSec();
    expect(beatInterval).toBeCloseTo(1.0, 6);
  });

  it('deve agendar todos os pulsos dentro da janela de lookahead sem omissões', () => {
    const mockAudioContext = { currentTime: 0.0 };
    const scheduledBeats: number[] = [];

    const scheduler = new LookaheadScheduler({
      bpm: 120, // 0.5s por batida
      meter: 4,
      onScheduleBeat: (time: number) => scheduledBeats.push(time)
    });

    // Simula varredura para os próximos 1.2 segundos (devem caber 2 pulsos futuros: 0.5s e 1.0s)
    scheduler.tick(0.0, 1.2);

    expect(scheduledBeats).toEqual([0.0, 0.5, 1.0]);
  });
});
```

---

## 6. Matriz de Rastreabilidade e Critérios Não Funcionais (QoS)

| Identificador | Requisito | Meta Técnica Mensurável | Método de Verificação |
| :--- | :--- | :--- | :--- |
| **RNF-LAT-01** | Latência Total de Feedback | $\le 45\text{ ms}$ entre a nota tocada e o realce visual na tela. | Profiler de Performance em Chromium e iOS Safari. |
| **RNF-TIM-02** | Variação Temporal (*Jitter*) | Desvio padrão $< \pm 1.5\text{ ms}$ em 15 minutos de metrônomo ininterrupto. | Teste de estresse com `LookaheadScheduler.spec.ts`. |
| **RNF-FPS-03** | Fluidez de Animação | $60\text{ FPS}$ sustentados em celulares de entrada ($120\text{ FPS}$ em telas ProMotion). | Monitor de quadros (Canvas WebGL / Skia). |
| **RNF-ACC-04** | Acessibilidade Cromática | Relação de contraste $\ge 7:1$ para todos os textos e notas sobre teclas/cordas. | Auditoria automatizada via Lighthouse / axe-core. |
| **RNF-OFF-05** | Operação Offline-First | $100\%$ do conteúdo didático, sons e lógica funcionais sem internet. | Cache em Service Worker e IndexedDB local. |

---

## 7. Próximos Passos de Implementação
1. **Compilação do Núcleo Matemático:** Empacotar `music-domain-core` com TypeScript para validação dos 12 tons, tétrades e fórmulas de compasso.
2. **Implementação da Tela Única Interativa:** Montar o componente interativo que integra a Esteira Deslizante com o Visualizador de Teclado e Braço de Violão sincronizados pelo relógio Web Audio de alta precisão.