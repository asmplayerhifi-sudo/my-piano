# Especificação de Requisitos e Arquitetura de Software
## Projeto: Plataforma Interativa de Educação Musical (Teclado, Violão & Ritmo)
### Plataformas Exclusivas Alvo: Web (PWA) e Android (App Nativo via Capacitor)

---

## 1. Visão Geral do Produto e Benchmarking

### 1.1 Proposta de Valor
Desenvolver uma plataforma gamificada e interativa para ensino musical prático e teórico, voltada prioritariamente a **Web** e **Android**, com foco primordial na eliminação de gargalos cognitivos comuns em iniciantes e intermediários:
1. **Déficit de precisão rítmica** (oscilações de andamento, antecipação e atraso métrico).
2. **Dificuldade de visualização espacial dos instrumentos** (relação entre notas na pauta, teclas do piano e casas do braço do violão).
3. **Compreensão fragmentada da harmonia** (escalas, graus, formação de acordes, inversões e o Sistema CAGED).

---

### 1.2 Benchmarking de Aplicações de Sucesso

| Aplicativo | Pontos Fortes Analisados | Pontos Fracos / Oportunidade de Mercado |
| :--- | :--- | :--- |
| **Simply Piano** | Gamificação envolvente, *pitch detection* acústico estável para piano, visualização linear de teclas em rolagem contínua. | Fraco em fundamentos teóricos profundos; foco excessivo em decorar dedilhados sem entender funções harmônicas. |
| **Yousician** | Suporte multiplataforma (violão, teclado, baixo, voz), feedback visual de acerto temporal (faixa de tolerância em ms). | Interface sobrecarregada; curva de aprendizado rítmico rápida demais para alunos com déficits de andamento. |
| **Flowkey** | Integração excelente com teclados via Web MIDI, repertório dividido em mãos separadas (MD / ME). | Quase nenhum foco em violão ou treino de independência métrica cinestésica. |
| **Ultimate Guitar / Tabs** | Enorme banco de acordes, visualizador interativo do braço do violão com posições e pestanas. | Foco apenas em cifras/repertório; ausência de método pedagógico progressivo e treino de solfejo. |
| **Tenuto / musictheory.net** | Rigor pedagógico impecável em intervalos, graus, armaduras e fórmulas de compasso. | Interface estática, acadêmica e pouco atraente para dispositivos móveis modernos; sem escuta ativa. |
| **Complete Rhythm Trainer** | Protocolo exemplar de treino rítmico com subdivisões, palmas no microfone e quantização de erro. | Não conecta os exercícios rítmicos diretamente com os acordes e as notas no instrumento. |

---

## 2. Decisão Arquitetural: Foco Exclusivo em Web e Android

Para garantir agilidade de evolução, máxima manutenibilidade e entrega de alta fidelidade para as duas plataformas alvo (**Web** e **Android**), adota-se a **Arquitetura de Núcleo Único com Adaptadores de Plataforma**:

```
+-------------------------------------------------------------------------+
|                  NÚCLEO COMPARTILHADO (Core TypeScript)                 |
|   Domínio Musical (Tonal), Metrônomo, Esteira Rítmica, Teclado/Violão   |
+-------------------------------------------------------------------------+
                                     |
                 +-------------------+-------------------+
                 |                                       |
+----------------v----------------+     +----------------v----------------+
|         VERSÃO WEB (PWA)        |     |       VERSÃO ANDROID (APK)      |
|  - Web Audio API (Lookahead)    |     |  - Empacotado via Capacitor     |
|  - Web MIDI API                 |     |  - Android Foreground Service   |
|  - Web Workers (Scheduler)      |     |  - USB-OTG MIDI Nativo          |
|  - Screen Wake Lock API         |     |  - Alerta de Latência Bluetooth |
|  - IndexedDB Offline Storage    |     |  - Notificação de Segundo Plano |
+---------------------------------+     +---------------------------------+
```

### 2.1 Justificativa Técnica da Arquitetura
1. **Compartilhamento de 95% do Código:** O motor teórico de notas, enarmonia, intervalos, escalas, dicionário de acordes, desenho do teclado, visualizador do braço do violão e física da esteira rítmica rodam exatamente com o mesmo código em React + TypeScript.
2. **Especializações Nativas do Android:**
   - **Foreground Service de Áudio:** O metrônomo continua tocando com a tela bloqueada ou com o celular no bolso durante práticas cinestésicas.
   - **Detecção de Fone Bluetooth:** O Android avisa nativamente o usuário sobre latências de periféricos sem fio e ajusta a compensação temporal.
   - **USB-OTG MIDI:** Conexão direta plug-and-play com teclados controladores e pianos digitais via cabo USB.
3. **Versão Web Sem Atrito:**
   - Execução direta em qualquer navegador moderno (Chrome, Edge, Firefox, Safari) e instalação instantânea como PWA (Progressive Web App) com suporte 100% offline.

---

## 3. Requisitos Funcionais (RFs) por Módulo

### Módulo 1: Teoria Musical & Mapas Mentais Interativos
* **RF01.1 - Régua Cromática e Semitons:**
  * Exibição interativa da linha cromática de 12 semitons.
  * Destaque visual dinâmico das zonas de semitons naturais ($\text{Mi} \leftrightarrow \text{Fá}$ e $\text{Si} \leftrightarrow \text{Dó}$).
* **RF01.2 - Construtor da Escala Maior e Menor:**
  * Seleção de qualquer tônica e cálculo da fórmula intervalar ($T - T - ST - T - T - T - ST$).
  * Feedback auditivo instantâneo sintetizado ao clicar ou reproduzir a escala.
* **RF01.3 - Gestão Rigorosa de Enarmonia:**
  * O sistema diferencia notas enarmônicas de acordo com o contexto tonal (ex: na escala de $\text{Lá}$ maior, a terça é $\text{Dó}\sharp$ e nunca $\text{Ré}\flat$).
* **RF01.4 - Círculo das Quintas Dinâmico:**
  * Interface rotativa com as 12 tonalidades maiores e relativas menores.
  * Destaque automático da armadura de clave correspondente e das funções harmônicas ($I, IV, V$).
* **RF01.5 - Calculador e Comparador de Intervalos:**
  * Treinador auditivo e visual comparando uníssonos, segundas, terças maiores/menores, quartas, quintas justas e oitavas.

---

### Módulo 2: Laboratório Rítmico Especial (Anti-Déficit)
* **RF02.1 - Metrônomo Sonoro de Alta Precisão:**
  * Andamentos contínuos de $30$ a $240\text{ BPM}$.
  * Diferenciação de timbres de clique: tempo forte (agudo/marcante), tempos secundários (médio) e subdivisões (suave).
  * Fórmulas de compasso: $\frac{2}{4}, \frac{3}{4}, \frac{4}{4}, \frac{6}{8}$.
  * **No Web:** Agendamento antecipado com `AudioContext.currentTime` e `Web Worker` de pulso para evitar engasgos em segundo plano.
  * **No Android:** Suporte a `Foreground Service` para manter o clique ativo com a tela desligada.
* **RF02.2 - Esteira Rítmica de Precisão Temporal (Visualizer):**
  * Marcadores rítmicos que deslizam em direção a uma linha de impacto.
  * Quantização e classificação de precisão por milissegundos ($ms$):
    * **Perfeito:** Diferença $< \pm 25\text{ ms}$
    * **Bom:** Diferença entre $\pm 25\text{ ms}$ e $\pm 60\text{ ms}$
    * **Adiantado / Atrasado:** Diferença $> \pm 60\text{ ms}$
* **RF02.3 - Wizard de Calibração de Latência de Hardware:**
  * Assistente de calibração interativo (4 batidas de teste).
  * O sistema calcula o offset de atraso do hardware (especialmente para fones Bluetooth) e desconta automaticamente da pontuação na esteira.
* **RF02.4 - Algoritmo de Andamento Adaptativo (*Adaptive BPM Engine*):**
  * Caso o usuário apresente 3 falhas consecutivas de tempo, o sistema desacelera automaticamente o metrônomo em $5$ a $10\text{ BPM}$.
  * Ao sustentar 8 compassos com precisão superior a $90\%$, o sistema sugere o avanço gradativo do andamento.
* **RF02.5 - Modo "Metrônomo Oculto" (Treino de Pulso Interno):**
  * O metrônomo soa durante 2 compassos e silencia nos 2 seguintes. O usuário deve manter o pulso e é avaliado no retorno do som.
* **RF02.6 - Protocolo Cinestésico Guiado:**
  * Etapa 1: Vocalização com sílabas rítmicas (*"TA-CA-TE-CA"*).
  * Etapa 2: Palmas na tela ou no microfone com detecção de picos de transiente.
  * Etapa 3: Execução direta no instrumento.

---

### Módulo 3: Módulo Prático para Teclado & Piano
* **RF03.1 - Visualizador de Teclado Linear:**
  * Teclado virtual escalável (mínimo de 2 oitavas na tela do celular com botão de transposição de oitavas).
  * Colorização contextual de notas: Fundamental (Vermelho), Terça (Azul), Quinta (Verde), Sétima (Roxo).
* **RF03.2 - Dicionário e Montador de Acordes:**
  * Seleção de fundamental e tipo de acorde (Maior, Menor, $7$, $\text{maj}7$, $m7$, $m7(\flat 5)$, diminuto).
  * Exibição visual das teclas ativas e da numeração exata dos dedos ($1$ = Polegar até $5$ = Mínimo).
* **RF03.3 - Praticador de Inversões e Condução de Vozes (*Voice Leading*):**
  * Exibição comparativa da **Posição Fundamental**, **1ª Inversão** e **2ª Inversão**.
  * Demonstração gráfica da economia de movimento da mão ao encadear acordes (ex: $C \to F/A \to G/B$).
* **RF03.4 - Entrada via MIDI e Microfone Acústico:**
  * Conexão via **Web MIDI API** (Web) e **USB-OTG** (Android) para pianos e teclados digitais (latência $< 5\text{ ms}$).
  * Microfone acústico para validação de arpejos melódicos nota a nota com algoritmo monofônico YIN.

---

### Módulo 4: Módulo Prático para Violão
* **RF04.1 - Braço Interativo Matricial:**
  * Representação realista do braço do violão (6 cordas, 12 a 15 casas).
  * Indicação clara de cordas soltas ($O$), cordas abafadas/não tocadas ($X$), casas premidas, dedos utilizados ($1$ = Indicador até $4$ = Mínimo) e pestanas com barra sólida.
* **RF04.2 - Mapeador do Sistema CAGED:**
  * Visualização comparativa do mesmo acorde nos 5 formatos ao longo do braço (Shapes C, A, G, E, D).
  * Filtro para destacar visualmente onde estão as tônicas/fundamentais em cada formato.
* **RF04.3 - Treinador de Baixos Invertidos:**
  * Ensino visual de acordes com baixos trocados (ex: $C$, $C/E$, $C/G$, $D/F\sharp$).
  * Alertas de segurança postural: cordas graves tocadas pelo polegar ou abafadas pela palma.
* **RF04.4 - Explicador do "Salto da 2ª Corda (Si)":**
  * Marcador geométrico que demonstra por que as digitações sofrem avanço de 1 casa ao cruzar a fronteira entre as cordas 3 (Sol) e 2 (Si) devido à afinação em terça maior ($G \to B$).

---

### Módulo 5: Módulo Integrador "Ritmo + Harmonia" (Anti-Déficit)
* **RF05.1 - Trilha Rítmico-Harmônica em Tempo Real:**
  * A esteira rítmica apresenta blocos de troca de acordes sincronizados ao metrônomo (ex: $C \to G \to Am \to F$).
  * O aluno deve armar o acorde no teclado ou no violão e tocar na cabeça do tempo demarcado.
* **RF05.2 - Validação Bivalente (Nota + Tempo):**
  * O sistema avalia se a harmonia está correta (notas tocadas) e se o ataque ocorreu dentro da janela de precisão de milissegundos.

---

### Módulo 6: Leitura de Partitura & Solfejo
* **RF06.1 - Motor de Partituras Dinâmicas:**
  * Renderização vetorial responsiva de partituras (Claves de Sol e Fá).
  * Cursor interativo que acompanha a execução nota por nota.
* **RF06.2 - Treino de Leitura Progressiva (Flashcards e Quiz):**
  * Exercícios de reconhecimento rápido de notas nas linhas e espaços.
  * Categorização de entradas melódicas: **Tética**, **Anacrústica** e **Acéfala**.

---

## 4. Requisitos Não Funcionais (RNFs)

* **RNF01 - Latência de Resposta:** O atraso entre a ação do usuário e a resposta visual/sonora deve ser inferior a $30\text{ ms}$, com suporte a offset de calibração para fones sem fio.
* **RNF02 - Design Responsivo Mobile-First:** Todas as interfaces (teclado, braço do violão e esteira rítmica) devem ser perfeitamente utilizáveis tanto na orientação vertical (modo retrato) quanto no modo horizontal (paisagem).
* **RNF03 - Arquitetura 100% Offline-First:** Todo o conteúdo teórico, gerador de acordes, metrônomo e esteira rítmica devem funcionar sem conexão com a internet (Service Workers no Web e empacotamento local no Android).
* **RNF04 - Precisão Temporal Sem Jitter:** O timer do metrônomo deve ser acoplado ao clock do subsistema de áudio (`AudioContext.currentTime`), com Web Worker dedicado para evitar atrasos causados pela renderização da interface.
* **RNF05 - Manutenção de Tela Ativa (*Wake Lock*):** O aplicativo deve solicitar a manutenção da tela ligada enquanto exercícios ou o metrônomo estiverem em execução (`navigator.wakeLock` no Web e `FLAG_KEEP_SCREEN_ON` no Android).

---

## 5. Arquitetura de Dados Conceitual

```
+---------------------------------------------------------------+
|                        DOMÍNIO MUSICAL                        |
+---------------------------------------------------------------+
| Note { name, midiNumber, frequency, accidental }             |
| Interval { semitones, shortName, quality }                    |
| Scale { rootNote, intervals[], formulaPattern }               |
| Chord { rootNote, chordType, notes[], bassNote, inversions[] }|
+---------------------------------------------------------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
+-------v-----------------------+       +---------------v---------------+
|        MAPA DE TECLADO        |       |        MAPA DE VIOLÃO         |
+-------------------------------+       +-------------------------------+
| KeyPosition { note, isBlack } |       | FretboardCoordinate {         |
| HandFingering { hand, finger }|       |   stringNumber, fretNumber,   |
| ChordVoicingKeyboard {        |       |   note, finger, isRoot,       |
|   keysPressed[], fingering[]  |       |   isMuted, isBarre            |
| }                             |       | }                             |
+-------------------------------+       | CAGEDShape { shapeName, ... } |
                                        +-------------------------------+
```

---

## 6. Roadmap de Entrega (Fases)

### Fase 1: MVP Web & Android Ready
* Setup da infraestrutura unificada (React + Vite + TypeScript + Tailwind CSS + Capacitor Android).
* Motor de áudio de alta precisão (Web Audio API + Síntese polifônica de piano e violão).
* Laboratório Rítmico com Metrônomo, Esteira Rítmica Canvas e Assistente de Calibração de Latência.
* Teclado Virtual interativo com mapeamento de acordes e inversões.
* Braço de Violão interativo com Sistema CAGED e baixos invertidos.
* Módulo Teórico de Escalas e Círculo das Quintas com rigor enarmônico.

### Fase 2: Escuta Ativa, MIDI & Módulo Híbrido
* Suporte completo a Web MIDI e USB-OTG MIDI.
* Módulo Híbrido "Ritmo + Harmonia" (acordes armados em tempo real na esteira rítmica).
* Reconhecimento monofônico de arpejos via microfone (algoritmo YIN).
* Android Foreground Service para metrônomo com tela apagada.

### Fase 3: Partituras & Gamificação Avançada
* Flashcards e leitura de partitura à primeira vista (Claves de Sol e Fá).
* Sistema de metas diárias, andamento adaptativo salvo no perfil do aluno e gráficos de evolução temporal.