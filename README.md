# 🎹 Harmonia Music — Plataforma Interativa de Educação Musical

> Plataforma completa de aprendizado musical interativo para **Teclado**, **Piano** e **Violão**, com suporte a **Web** e **Android** (Capacitor). Conta com motor de áudio Web Audio API de alta fidelidade, escuta acústica via microfone com cancelamento de falsos erros, integração MIDI USB/Bluetooth, partitura interativa em rolagem contínua e motor de acompanhamento rítmico harmônico.

---

## 🚀 Como Executar a Aplicação

### 1. Pré-requisitos
* **Node.js** (versão 18+ recomendada)
* **NPM** ou gerenciador de pacotes equivalente

### 2. Instalação de Dependências
Na raiz do projeto (`c:\DEV\APPS\my-piano`), instale os pacotes:
```bash
npm install
```

### 3. Executando em Modo de Desenvolvimento (Local)
Inicie o servidor de desenvolvimento Vite:
```bash
npm run dev
```
* A aplicação estará disponível em: **`http://localhost:5173/`**
* Suporte a acesso em rede local (ex: testar no celular ou tablet conectado no mesmo Wi-Fi): `http://<seu-ip-local>:5173/`

> **Dica para Windows (PowerShell/CMD):**
> Caso os binários globais não estejam no `PATH`, você também pode iniciar diretamente com:
> ```powershell
> node ./node_modules/vite/bin/vite.js --host
> ```

---

## 🛠️ Outros Comandos Úteis

### Compilação de Produção (Build)
Valida a tipagem estática do TypeScript e gera o bundle otimizado para produção:
```bash
npm run build
```
*(ou `node ./node_modules/typescript/bin/tsc -b ; node ./node_modules/vite/bin/vite.js build` no PowerShell)*

### Visualizar Build de Produção Localmente (Preview)
```bash
npm run preview
```

### Executar Testes Automatizados (Vitest)
Executa a suíte de testes de domínio, teoria musical, validação de eventos e acurácia de áudio:
```bash
npm test
```
*(ou `node ./node_modules/vitest/vitest.mjs run`)*

### Sincronização e Build para Android (Capacitor)
Para compilar a aplicação e sincronizar os assets com o projeto Android nativo:
```bash
npm run build:android
```

---

## ✨ Principais Funcionalidades

### 1. 🎙️ Escuta Acústica em Tempo Real & Ciclo de Vida do Evento Musical
* **Detecção por Autocorrelação Normalizada:** Captação precisa pelo microfone integrado, interface de áudio USB ou cabo auxiliar (P2/P10).
* **Ciclo de Vida Completo do Evento Musical:**
  $$\text{Ataque (Onset)} \longrightarrow \text{Sustentação (Tracking)} \longrightarrow \text{Transição / Término (Finalize)}$$
* **Avaliação Integrada:**
  - **Nota(s) e Acordes:** Avalia tríades e tétrades com agrupamento em janela harmônica (evitando que notas arpejadas gerem erros individuais).
  - **Duração:** Mede o tempo exato em que a nota permaneceu sustentada.
  - **Intensidade / Dinâmica:** Monitora o volume RMS acústico ou velocity MIDI (0-127).
  - **Timing Rítmico:** Calcula o desvio milissegundo a milissegundo em relação à partitura.
* **Anti-Falsos Erros:** Sem erros prematuros; pequenas oscilações de afinação (vibrato) e resíduos de sustain da nota anterior não interrompem nem penalizam o músico. A nota é selada somente ao atingir a próxima nota ou silêncio confirmado.

### 2. 🎼 Padrão de Oitavas Configurável (C3 Brasil vs C4 Internacional)
* **Dó Central Selecionável:** Escolha entre **C3 (Padrão Teclado Brasileiro / Yamaha)** e **C4 (Padrão Internacional / Roland / Scientific Pitch Notation)**.
* **Consistência Global:** A configuração é aplicada dinamicamente em todas as pautas, teclados visuais, labels e cifras sem alterar a frequência real ou valor MIDI.

### 3. 📚 Cursos Interativos de Teclado e Violão
* Material teórico completo integrado com exercícios práticos na partitura.
* Rolagem dinâmica da partitura com cursor rítmico, metrônomo visual e sonoro.
* Feedback de afinação e precisão: *PERFECT*, *GOOD*, *OFF TIME*.

### 4. 🎹 Treinador Rápido de Acordes e Avaliador de Escalas
* Identificação instantânea de tríades maiores, menores, diminutas, aumentadas e tétrades com sétima.
* Suporte a inversões de acordes (*Slash Chords*, ex: `C/E`, `G/B`).
* Treinamento livre e guiado com microfone ao vivo ou teclado MIDI.

### 5. 🥁 Motor de Metrônomo & Acompanhamento Musical Parametrizável
* Ajuste de BPM (30 a 240), compassos (4/4, 3/4, 2/4, 6/8).
* Controle independente de volume do tempo forte e tempos fracos (com opção de mute individual sem perda de sincronismo).
* Estilos de acompanhamento rítmico (*Pop Ballad*, *Eight Beat*, *Pop Rock*, *Waltz*).

---

## 🏗️ Estrutura Arquitetural do Projeto

```text
src/
├── application/             # Casos de uso e portas de entrada (DDD / Clean Architecture)
│   ├── ports/               # Interfaces abstratas de sintetizador, relógio e MIDI
│   └── use-cases/           # Casos de uso (EvaluateRhythmStrike, VerifyChordVoicing)
├── core/                    # Motores de áudio, teoria e validação
│   ├── musicalEventEvaluator.ts # Motor de rastreamento do evento musical completo
│   ├── noteConfirmationValidator.ts # Janelas de confirmação e tolerância de sustain
│   ├── pitchDetector.ts     # Autocorrelação de áudio e microfone em tempo real
│   ├── musicTheory.ts       # Identificação de acordes, intervalos e escalas
│   ├── soundEngine.ts       # Síntese polifônica Web Audio (Piano, Violão, Baixo, Bateria)
│   ├── midiManager.ts       # Gerenciador Web MIDI API (USB / Bluetooth)
│   └── octaveConfigStore.ts # Gerenciador de padrão de oitavas (C3/C4)
├── domain/                  # Entidades fundamentais puras
│   └── entities/            # Note, Chord, Interval, MetricMeasure, MusicalEvent
├── components/              # Componentes de interface React
│   ├── audio/               # MicrophonePitchBar, Controles de Microfone e Sensibilidade
│   ├── course/              # KeyboardCourseView, módulos didáticos e partitura interativa
│   ├── piano/               # PianoKeyboard, FastChordTrainer
│   ├── score/               # ScrollingScoreView, useScorePlayback
│   └── theory/              # ScalePerformanceEvaluator, visualizadores harmônicos
└── tests/                   # Suíte de testes automatizados com Vitest
```

---

## 📄 Licença
Projeto privado — Harmonia Music. Todos os direitos reservados.
