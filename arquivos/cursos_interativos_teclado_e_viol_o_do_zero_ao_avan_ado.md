# Grade Curricular & Arquitetura Pedagógica Interativa
## Cursos Completos do Zero ao Avançado: Teclado e Violão

---

## 1. Arquitetura da Engine de Ensino Interativo

Para que o aprendizado seja intuitivo e elimine travamentos, o sistema implementa três motores interativos centrais:

### 1.1 Motor de Partitura Dinâmica Deslizante (*Interactive Scrolling Score Engine*)
* **Rolagem Contínua e Cursor Guia:** A partitura move-se horizontalmente em direção a uma barra fixa de ataque (ou o cursor varre a partitura em compassos fixos sem interrupções bruscas).
* **Modo "Esperar Pela Nota" (*Wait-for-Note Mode*):** No início do aprendizado, a partitura pausa até que o aluno posicione a mão e toque a nota/acorde correto no instrumento.
* **Modo "Fluxo Contínuo em Tempo Real" (*Strict Flow Mode*):** A partitura avança no andamento estipulado ($30$ a $180\text{ BPM}$). O motor avalia:
  * **Janela Temporal:** Perfeito ($< \pm 25\text{ ms}$), Bom ($\pm 25\text{ a } 60\text{ ms}$), Atrasado/Adiantado ($> \pm 60\text{ ms}$).
  * **Sustentação:** Alerta se a tecla ou corda for solta antes do valor métrico estipulado.
* **Pentagrama Duplo Dinâmico (*Grand Staff*):** Suporte simultâneo à Clave de Sol (mão direita no teclado / melodia) e Clave de Fá (mão esquerda / baixos).

### 1.2 Assistente Biomecânico de Digitação (*Smart Fingering Guide*)
* **Mapa de Mãos no Teclado:** Representação gráfica das mãos esquerda e direita com numeração internacional:
  * $1 = \text{Polegar}$ | $2 = \text{Indicador}$ | $3 = \text{Médio}$ | $4 = \text{Anelar}$ | $5 = \text{Mínimo}$.
  * Destaque luminoso indicando qual dedo deve pousar em qual tecla com antecipação visual de $1$ compasso.
* **Mapa de Mãos no Violão:**
  * **Mão Esquerda (Escalação no Braço):** $1 = \text{Indicador}$, $2 = \text{Médio}$, $3 = \text{Anelar}$, $4 = \text{Mínimo}$, $T = \text{Polegar no bordão}$.
  * **Mão Direita (Ataque/Dedilhado):** $P = \text{Polegar}$, $I = \text{Indicador}$, $M = \text{Médio}$, $A = \text{Anelar}$.
* **Alertas de Postura e Tensão:** Orientações sobre inclinação de punho, relaxamento de ombros e ponto de apoio do polegar.

### 1.3 Acelerador de Montagem de Acordes (*Fast Chord Memory*)
* **Algoritmo do Dedo Âncora (*Pivot Finger*):** O app identifica qual dedo não precisa sair do lugar durante a transição de acordes (ex.: de $C$ para $Am$, ou de $G$ para $Em$), reduzindo o esforço motor.
* **Treino de Troca em Flashcards com Metrônomo:** O app exibe o acorde alvo e dá $4$ tempos para a troca, reduzindo progressivamente para $2$ tempos e $1$ tempo até a fixação neuromuscular.

---

## 2. Curso Completo de Teclado: Do Zero ao Avançado

```
+-----------------------------------------------------------------------------------+
|                           JORNADA DE TECLADO & PIANO                              |
+-----------------------------------------------------------------------------------+
| Fase 1: Fundamentos, Topografia e Clave de Sol (Mão Direita)                      |
| Fase 2: Clave de Fá, Baixos e Independência Motora (Mão Esquerda + Ambas)         |
| Fase 3: Tríades Rápidas, Inversões e Condução Harmônica (Voice Leading)          |
| Fase 4: Leitura Dinâmica de Partitura Fluida e Compasso Composto                  |
| Fase 5: Tétrades, Dissonâncias Modernas e Baladas Pop/Worship                     |
| Fase 6: Técnicas Avançadas: Re-harmonização, Modulações e Improvisação            |
+-----------------------------------------------------------------------------------+
```

---

### Módulo T1: Boas-Vindas, Postura e Topografia do Teclado (Nível Iniciante)
* **Lição T1.1 - A Anatomia do Teclado:**
  * Identificação visual dos grupos de $2$ teclas pretas e $3$ teclas pretas.
  * Localização imediata de todos os Dós ($C$) do instrumento sem precisar contar do início.
  * O Dó Central ($C_4$ / Dó 3) como referencial absoluto.
* **Lição T1.2 - Postura e Biomecânica Pianística:**
  * Altura do banco em relação ao cotovelo ($90^\circ$).
  * Formato natural da mão: "segurar uma maçã imaginária", dedos curvados atacando com as pontas, sem quebrar as falanges.
* **Lição T1.3 - Os Primeiros 5 Sons e Digitação Básica:**
  * Posição de Dó Maior de 5 dedos: Dedo $1$ em $C$, $2$ em $D$, $3$ em $E$, $4$ em $F$, $5$ em $G$.
  * Exercícios de toque legato e staccato guiados por áudio.

---

### Módulo T2: Leitura Dinâmica em Clave de Sol & Primeira Independência
* **Lição T2.1 - Decodificando a Clave de Sol na Prática:**
  * Leitura das 5 linhas ($Mi - Sol - Si - Ré - Fá$) e 4 espaços ($Fá - Lá - Dó - Mi$).
  * Partitura interativa com cursor rolante: o aluno toca as notas correspondentes em tempo real.
* **Lição T2.2 - Introdução à Clave de Fá:**
  * O mundo dos graves: a 4ª linha como nota Fá ($F_3$).
  * Leitura das linhas ($Sol - Si - Ré - Fá - Lá$) e espaços ($Lá - Dó - Mi - Sol$).
  * Posição da mão esquerda espelhada: dedo $5$ no Dó grave, dedo $1$ no Sol.
* **Lição T2.3 - Sincronização Mão Direita + Mão Esquerda (MD + ME):**
  * Exercício do "Espelho": ambas as mãos tocando juntas em movimento contrário e movimento paralelo.
  * Padrão básico de acompanhamento: Mão Esquerda segura semibreves (baixo fundamental) enquanto a Mão Direita toca a melodia em semínimas.

---

### Módulo T3: Acelerador de Acordes — Construção Rápida e Semitons
* **Lição T3.1 - A Fórmula Visual das Tríades Maiores:**
  * Método da contagem mental simplificada: Fundamental $+ 4$ semitons (3ª Maior) $+ 3$ semitons (3ª menor).
  * O "Shape" geométrico das tríades totalmente brancas ($C$, $F$, $G$).
  * O "Shape" das tríades com tecla preta no meio ($D$, $E$, $A$).
  * A exceção simétrica: Si Maior ($B$: branca, preta, preta) e Si Bemol ($B\flat$: preta, branca, preta).
* **Lição T3.2 - Tríades Menores com 1 Movimento:**
  * Regra prática de ouro: "Abaixe a nota do meio em $1$ semitom diatônico".
  * Comparação lado a lado no visualizador: $C \longleftrightarrow Cm$, $F \longleftrightarrow Fm$, $G \longleftrightarrow Gm$.
* **Lição T3.3 - Dicionário de Formação Instantânea:**
  * Treinador com cronômetro: o app pede um acorde aleatório (ex.: $E\flat m$) e o aluno deve acionar as 3 teclas em menos de $2$ segundos.

---

### Módulo T4: Inversões e Condução de Vozes (*Voice Leading*)
* **Lição T4.1 - Desmistificando as Inversões:**
  * **Posição Fundamental ($1 - 3 - 5$):** $C - E - G$ (Baixo no Dó).
  * **1ª Inversão ($1 - 2 - 5$ ou $1 - 3 - 5$):** $E - G - C$ (Baixo no Mi). Espaçamento visual: intervalo de 4ª no topo.
  * **2ª Inversão ($1 - 2 - 4$ ou $1 - 3 - 5$):** $G - C - E$ (Baixo no Sol). Espaçamento visual: intervalo de 4ª na base.
* **Lição T4.2 - A Lei do Menor Esforço (Economia de Movimento):**
  * O erro clássico de iniciantes: pular a mão inteira para fazer $C \to F \to G$.
  * A conexão elegante com inversões sem mover o punho do lugar:
    $$\text{C (Fundamental: } C - E - G) \longrightarrow \text{F (2ª Inversão: } C - F - A) \longrightarrow \text{G (1ª Inversão: } B - D - G)$$
  * O aluno pratica no teclado virtual vendo as notas em comum permanecerem fixas sob os mesmos dedos.
* **Lição T4.3 - Cadências e Progressões Pop/Worship Fundamentais:**
  * Progressão $I - V - vi - IV$ (ex.: $C - G - Am - F$) com encadeamento suave em ambas as mãos.

---

### Módulo T5: Leitura de Partitura Avançada com Scrolling em Tempo Real
* **Lição T5.1 - Pentagrama Duplo com Acidentes Fixos (Armaduras):**
  * Treino com peças em Sol Maior ($1\sharp$) e Fá Maior ($1\flat$).
  * Adaptação automática dos dedos para sustenidos e bemóis sem olhar para a mão.
* **Lição T5.2 - Subdivisões Métricas Complexas na Partitura:**
  * Notas pontuadas, síncopas, pausas em contratempo e semicolcheias.
  * Feedback milimétrico de precisão rítmica com a esteira temporal.
* **Lição T5.3 - O Uso Correto do Pedal de Sustain:**
  * Princípio do pedal sincopado: abaixar a tecla $\to$ pisar no pedal $\to$ trocar a harmonia $\to$ limpar e repisar no instante exato do novo ataque para não empastar o som.

---

### Módulo T6: Tétrades, Dissonâncias e Estilos Modernos (Intermediário a Avançado)
* **Lição T6.1 - Acordes com Sétima (Tétrades):**
  * Sétima Maior ($\text{maj}7$), Sétima Dominante ($7$), Menor com Sétima ($m7$) e Meio-Diminuto ($m7\flat 5$).
  * Formação rápida: tríade base $+$ tecla situada a $1$ ou $2$ semitons abaixo da oitava da fundamental.
* **Lição T6.2 - Notas de Tensão e Acordes Estendidos:**
  * Adição de nonas ($add9$, $9$), décima primeira ($11$) e décima terceira ($13$).
  * O conceito de *Rootless Voicings* (tocar o acorde sem a fundamental na mão direita, deixando o baixo livre para a mão esquerda).
* **Lição T6.3 - Padrões de Acompanhamento por Gênero:**
  * **Balada / Pop:** Arpejos fluidos com nonas adicionadas.
  * **Bossa Nova e Jazz:** Levada sincopada com notas curtas e acordes alterados.
  * **R&B / Soul:** Riffs e *grace notes* cromáticas entre as notas da melodia.

---

### Módulo T7: Harmonização Avançada, Re-harmonização e Solo (Nível Avançado)
* **Lição T7.1 - Cadência Fundamental $ii - V - I$:**
  * Aplicação com tensões nos 12 tons: $Dm9 \to G13 \to C\text{maj}9$.
* **Lição T7.2 - Re-harmonização Instantânea:**
  * Substituição tritônica ($SubV7$).
  * Acordes diminutos de passagem e dominantes secundários ($V/V$, $V/ii$).
* **Lição T7.3 - Improvisação Melódica sobre Bases de Teclado:**
  * Escalas Pentatônicas Maiores e Menores, Escala Blues e Modos Gregos (Dórico, Lídio, Mixolídio).

---

## 3. Curso Completo de Violão: Do Zero ao Avançado

```
+-----------------------------------------------------------------------------------+
|                            JORNADA DO VIOLÃO & GUITARRA                           |
+-----------------------------------------------------------------------------------+
| Fase 1: Anatomia, Afinação, Postura e Primeiras Notas Limpas                     |
| Fase 2: Acordes Abertos, Troca Ágil com Dedo Pivô e Levadas Pop/Balada           |
| Fase 3: Domínio da Pestana Sem Dor e Ritmos Populares Brasileiros                |
| Fase 4: O Sistema CAGED Completo (Mapeamento Total do Braço)                     |
| Fase 5: Baixos Invertidos, Condução de Bordões e Tríades Agudas                  |
| Fase 6: Leitura Dinâmica de Tablatura e Partitura com Cursor                     |
| Fase 7: Fingerstyle Avançado, Dissonâncias de Bossa Nova e Solos Pentatônicos    |
+-----------------------------------------------------------------------------------+
```

---

### Módulo V1: Fundamentos Físicos, Afinação e Primeira Emissão Sonora
* **Lição V1.1 - Afinação Precisa e Coordenadas do Braço:**
  * Uso do afinador cromático do app (detecção da frequência em Hertz de cada corda: $E_2, A_2, D_3, G_3, B_3, E_4$).
  * Como segurar o violão: apoio na perna direita (modo popular) vs. perna esquerda elevada (modo clássico).
* **Lição V1.2 - Mecânica dos Dedos da Mão Esquerda:**
  * Posicionamento perto do traste metálico (não no meio da casa) para obter som limpo sem zumbido (*fret buzz*).
  * Polegar atrás do braço como eixo móvel na altura média do mastro, nunca estrangulando o braço.
* **Lição V1.3 - Mão Direita: Toque com e sem Apoio:**
  * Uso do polegar descendente nos bordões ($6^{\underline{a}}, 5^{\underline{a}}, 4^{\underline{a}}$ cordas).
  * Dedos indicador, médio e anelar trabalhando em gancho puxando as cordas agudas ($3^{\underline{a}}, 2^{\underline{a}}, 1^{\underline{a}}$).

---

### Módulo V2: Acordes Abertos e o Método da Troca Instantânea
* **Lição V2.1 - O Quarteto Inicial de Acordes:**
  * $Em$ (Mi menor), $A$ (Lá Maior), $D$ (Ré Maior) e $C$ (Dó Maior).
  * Diagramas dinâmicos com indicação de: cordas tocadas, cordas abafadas ($X$) e dedos exatos ($1, 2, 3$).
* **Lição V2.2 - A Técnica do Dedo Âncora (*Anchor Finger*):**
  * Troca de $C$ para $Am$: o dedo 1 e o dedo 2 permanecem parados; apenas o dedo 3 se move.
  * Troca de $G$ para $D$: manutenção do dedo 3 na 2ª corda.
  * Treinador de transição: cronômetro com feedback visual da tela.
* **Lição V2.3 - A Primeira Levada Rítmica Estável (Pop/Balada 4/4):**
  * Padrão rítmico: $\downarrow \quad \downarrow \uparrow \quad \uparrow \downarrow \uparrow$
  * Execução sobre a esteira rítmica com avaliação da precisão temporal.

---

### Módulo V3: O Fim do Bloqueio da Pestana & Batidas Brasileiras
* **Lição V3.1 - A Engenharia Corporal da Pestana (Sem Lesão):**
  * Por que a força bruta falha: a pestana utiliza o **peso do braço** e alavanca suave, não o esmagamento do polegar contra o indicador.
  * O indicador ligeiramente lateralizado (usando a borda óssea mais rígida, não a parte macia da polpa).
  * Exercício progressivo: pestana de $2$ cordas $\to$ $3$ cordas $\to$ pestana completa de 6 cordas no Fá Maior ($F$).
* **Lição V3.2 - Levadas Rítmicas Diversificadas:**
  * **Valsa e Guarania ($\frac{3}{4}$):** Baixo no tempo 1 $+$ dois acordes puxados nos tempos 2 e 3.
  * **Samba e Choro ($\frac{2}{4}$):** O ritmo sincopado do tamborim transposto para as cordas.
  * **Levada Reggae / Ska:** Batida em contratempo com corte imediato de som (*palm mute* e alívio da pressão da mão esquerda).

---

### Módulo V4: O Sistema CAGED — O Braço do Violão Decodificado
* **Lição V4.1 - O Conceito do Capotraste Humano:**
  * Compreensão de que todo acorde pestanado nada mais é do que um acorde aberto móvel transposto ao longo do braço.
* **Lição V4.2 - Mapeamento das 5 Regiões para Qualquer Tonalidade:**
  * O ciclo correlato: Shape de $C \to$ Shape de $A \to$ Shape de $G \to$ Shape de $E \to$ Shape de $D$.
  * Identificação visual das fundamentais/tônicas nas cordas 6, 5 e 4 em cada formato.
* **Lição V4.3 - Treinador Interativo CAGED:**
  * O aplicativo solicita: *"Toque Sol Maior no Shape de A"* ou *"Toque Ré Maior no Shape de E"*. O sistema valida a afinação e posição via microfone/áudio.

---

### Módulo V5: Inversões no Violão, Baixos Alternados e Condução Melódica
* **Lição V5.1 - Baixos Alternados no Polegar (Country/Folk/Sertanejo):**
  * Acorde de Dó ($C$): alterna o baixo entre a 5ª corda (Dó) e a 6ª corda pressionada na casa 3 (Sol).
  * Acorde de Sol ($G$): alterna entre 6ª e 5ª ou 4ª cordas.
* **Lição V5.2 - Condução de Baixos Cromáticos:**
  * Ligação harmônica de bordões entre acordes (ex.: $C \to C/B \to Am \to Am/G$).
* **Lição V5.3 - Tríades Fechadas nos Grupos de Cordas Agudas:**
  * Formação de acordes compactos nas cordas $1-2-3$ e $2-3-4$ para atuar em conjunto com teclado ou banda sem embolar o som com o contrabaixo.

---

### Módulo V6: Leitura Dinâmica de Tablatura e Partitura com Cursor
* **Lição V6.1 - Tablatura com Rítmica Integrada:**
  * Diferente de sites comuns de cifras que omitem o tempo, a engine exibe as hastes e valores rítmicos diretamente sobre os números da tablatura.
  * Rolagem horizontal contínua sincronizada com áudio de acompanhamento (*backing track*).
* **Lição V6.2 - Leitura de Partitura Tradicional no Violão:**
  * Como o violão é um instrumento transpositor de oitava (soa $1$ oitava abaixo do escrito na clave de Sol).
  * Posições alternativas da mesma nota no braço (ex.: a nota $Mi_4$ pode ser tocada na 1ª corda solta, na 2ª corda casa 5, ou na 3ª corda casa 9). O app indica a melhor escolha de dedilhado.

---

### Módulo V7: Fingerstyle, Bossa Nova e Solo Avançado (Nível Avançado)
* **Lição V7.1 - Princípios do Fingerstyle Moderno:**
  * Mão direita independente: o polegar mantém a linha de contrabaixo constante (*steady bass*) enquanto os outros dedos tocam a melodia polifônica.
  * Técnicas percussivas de caixa e bumbo no tampo do instrumento (*thumb slap*).
* **Lição V7.2 - A Harmonia da Bossa Nova (João Gilberto & Tom Jobim):**
  * Acordes densos e sofisticados: $C\text{maj}7(9)$, $Dm7(11)$, $G7(\flat 13)$, $F\sharp m7(\flat 5)$.
  * A síncopa característica de mão direita que flutua sem marcação do tempo 1 estático.
* **Lição V7.3 - Escalas Pentatônicas, Blues e Improvisação no Braço:**
  * Conexão dos 5 desenhos da Pentatônica sobrepostos aos 5 shapes do CAGED.
  * Articulações expressivas: *Hammer-on*, *Pull-off*, *Slide*, *Bends* e *Vibrato*.

---

## 4. Matriz Pedagógica Comparativa: Teclado vs. Violão

| Habilidade / Tópico | Abordagem no Teclado | Abordagem no Violão |
| :--- | :--- | :--- |
| **Visualização Espacial** | **Linear e Contínua:** Teclas brancas e pretas em linha reta; intervalos são distâncias visíveis de semitons adjacentes. | **Matricial Bidimensional:** Grade de $6$ cordas verticais $\times 15$ casas horizontais com assimetria na 2ª corda. |
| **Formação de Acordes** | **Terças Sobrepostas:** Dedos $1-3-5$ assumem o formato de "garfo" fixo em blocos abertos ou fechados. | **Formas Geométricas Fechadas (Shapes):** Padrões geométricos móveis que dependem de pestana e cordas mudas. |
| **Inversões** | Muito intuitivas: basta trocar a nota do topo para a base mantendo a mão na mesma oitava. | Complexas: exigem selecionar qual corda grave receberá a nota do baixo ou montar voicings em cordas agudas. |
| **Polifonia e Autonomia** | Independência total entre Mão Esquerda (harmonia/baixos) e Mão Direita (melodia). | Coordenação mista: Mão Esquerda dita a afinação nas casas, enquanto a Mão Direita governa o ritmo e polifonia. |
| **Dificuldade Inicial** | **Baixa barreira motora:** Apertar a tecla produz som afinado imediatamente. | **Alta barreira motora:** Requer calos nos dedos, pressão nos trastes e coordenação para evitar abafamento involuntário. |

---

## 5. Especificação dos Componentes de UI/UX do Aplicativo

### 5.1 Tela de Treino de Partitura com Rolagem (*Scrolling Sheet Screen*)
```
+-----------------------------------------------------------------------------------+
| [◄ Voltar]  Lição T4.2: Encadeamento C -> F -> G        BPM: [ 75 ]  Modo: Fluido  |
+-----------------------------------------------------------------------------------+
|  AVALIAÇÃO EM TEMPO REAL:  [ PERFEITO! +5ms ]   PRECISÃO RÍTMICA: 98%             |
|                                                                                   |
|                               BARRA DE ATAQUE                                     |
|                                      │                                            |
|   𝄞  4 ───œ───────œ───────œ───────œ──┼───œ───────œ───────œ───────œ───────────────►|
|      4   (C)     (E)     (G)     (C) │  (F)     (A)     (C)     (F)               |
|                                      │                                            |
|   𝄢  4 ───w──────────────────────────┼───w───────────────────────────────────────►|
|      4   (C)                         │  (F)                                       |
|                                      │                                            |
+-----------------------------------------------------------------------------------+
|  VISUALIZADOR DO INSTRUMENTO (TECLADO VIRTUAL / BRAÇO DE VIOLÃO SINCRONIZADO):     |
|                                                                                   |
|  [C] [D] [E] [F] [G] [A] [B] [C] [D] [E] [F] [G] [A] [B] [C]                      |
|   1       3       5           1       3       5                                   |
|  (MD)    (MD)    (MD)        (ME)    (ME)    (ME)                                 |
+-----------------------------------------------------------------------------------+
| [ ⏸ Pausar ]    [ ↺ Reiniciar Compasso ]    [ 🎚️ Metrônomo: ON ]    [ 💡 Dica ]   |
+-----------------------------------------------------------------------------------+
```

### 5.2 Algoritmo de Gamificação & Análise de Desempenho
1. **Pontuação por Nota:**
   * **100 pts:** Nota certa no tempo correto ($< \pm 25\text{ ms}$).
   * **70 pts:** Nota certa com leve atraso/adiantamento ($\pm 25\text{ a } 60\text{ ms}$).
   * **0 pts:** Nota errada ou nota omitida.
2. **Diagnóstico de Erros Comuns:**
   * Se o usuário atrasar recorrentemente na troca entre dois acordes específicos (ex.: $F \to G$), o app ativa um micro-exercício de repetição isolada daquela transição com contagem guiada.
3. **Relatório Diário de Fluência:**
   * Gráficos demonstrando evolução da precisão rítmica, tempo médio de resposta para montagem de novos acordes e taxa de leitura à primeira vista.