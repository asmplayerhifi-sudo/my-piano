# Requisito Técnico: Gatekeeper de Viabilidade & Pipeline de Deploy no GitHub Pages

---

## 1. Objetivo & Instrução Mandatória para Agentes de IA

> **DIRETIVA MANDATÓRIA (GATEKEEPER):**  
> Antes de executar qualquer ação de compilação, commit ou deploy no GitHub Pages, o agente de IA ou engenheiro de software responsável **DEVE OBRIGATORIAMENTE** executar o checklist de viabilidade descrito na **Seção 2**.  
> Se qualquer verificação acusar dependência de servidor ativo em runtime, o deploy **NÃO DEVE** ser iniciado, e o plano de contingência (*BaaS / Mock Local*) deve ser acionado.

---

## 2. Checklist Crítico de Pré-Validação (Gatekeeper Protocol)

A IA/Engenheiro deve responder **"SIM"** a todas as perguntas abaixo para autorizar o procedimento de deploy no GitHub Pages:

| ID | Pergunta de Verificação | Critério Impeditivo (Falha = Abortar Deploy) | Status |
| :---: | :--- | :--- | :---: |
| **V-01** | O motor de áudio e metrônomo depende exclusivamente de APIs nativas do navegador (Web Audio API / AudioWorklet)? | Se depender de processamento de stream em servidor Node.js/Python, o deploy falhará. | [ ] APROVADO |
| **V-02** | O reconhecimento de acordes/notas opera localmente via Web MIDI e/ou WebAssembly (WASM/Rust)? | Se exigir envio contínuo de áudio para backend de inferência, o deploy é inviável no Pages. | [ ] APROVADO |
| **V-03** | A aplicação compila para uma pasta de artefatos estáticos puramente client-side (`/dist`, `/build` ou `/out`)? | Se exigir comando `npm start`, `node server.js` ou container Docker ativo, o deploy é inviável no Pages. | [ ] APROVADO |
| **V-04** | O roteamento de telas da SPA (Single Page Application) trata requisições diretas de URL? | Se não utilizar *HashRouter* (`/#/rota`) ou não possuir script de redirecionamento `404.html`, telas recarregadas darão erro 404 no Pages. | [ ] APROVADO |
| **V-05** | A persistência de dados e lições do aluno funciona sem banco relacional corporativo ativo? | O armazenamento deve operar via `IndexedDB`/`LocalStorage` local ou via SDK direto na nuvem (Supabase/Firebase REST). | [ ] APROVADO |

---

## 3. Matriz de Decisão Arquitetural: Quando e Como Subir

```
                           [ INÍCIO DO PROCESSO ]
                                      │
                                      ▼
                  Existe servidor backend em runtime no repositório?
                   (Node.js/Express, Python/FastAPI, Docker ativo)
                                      │
                     ┌────────────────┴────────────────┐
                    SIM                               NÃO
                     │                                 │
                     ▼                                 ▼
         Pode ser convertido para BaaS         Aplicação é 100% Client-Side
           (Supabase, Firebase, Mock)             (Vite, React, Flutter Web)
                     │                                 │
                     ▼                                 ▼
          [ EXECUTAR MIGRAÇÃO ]              [ APROVADO PARA GITHUB PAGES ]
                     │                                 │
                     └────────────────┬────────────────┘
                                      │
                                      ▼
                        Configurar GitHub Actions
                         (.github/workflows/deploy.yml)
                                      │
                                      ▼
                               [ DEPLOY ATIVO ]
```

---

## 4. Estratégia de Roteamento SPA para Prevenção de Erro 404

O GitHub Pages serve páginas estáticas a partir de caminhos de arquivos físicos. Em SPAs (como React com `react-router` em modo `BrowserRouter`), recarregar a URL `https://usuario.github.io/app-musica/licao/2` gerará um erro HTTP 404.

### 4.1 Solução Recomendada 1: Hash Router (Simplicidade Absoluta)
Configurar a rota base da aplicação para usar hash:
* URL resultante: `https://usuario.github.io/app-musica/#/licao/2`
* **Vantagem:** Compatibilidade nativa e imediata com o GitHub Pages, sem scripts adicionais.

### 4.2 Solução Recomendada 2: Fallback 404.html (Rotas Limpas)
Adicionar um arquivo `public/404.html` que intercepta requisições de página inexistente e redireciona os parâmetros para o `index.html` com preservação de rota.

---

## 5. Pipeline de Deploy Automatizado (GitHub Actions)

Abaixo está o contrato do arquivo de automação `.github/workflows/deploy.yml` que a IA deve implementar após a validação bem-sucedida:

```yaml
name: Deploy Automático para GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build_and_deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout do Código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar Dependências
        run: npm ci

      - name: Executar Testes Unitários Críticos (Zero Jitter & Core Musical)
        run: npm run test:run

      - name: Compilar Artefatos Estáticos
        run: npm run build
        env:
          VITE_BASE_PATH: '/${{ github.event.repository.name }}/'

      - name: Configurar Páginas
        uses: actions/configure-pages@v4

      - name: Upload do Artefato Compilado
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Publicar no GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 6. Critérios de Aceite para Conclusão da Tarefa

1. **Relatório de Verificação Pré-Deploy Emitido:** A IA/desenvolvedor deve apresentar um parecer formal atestando que nenhuma dependência exige servidor Node.js/Python rodando em tempo real.
2. **Pipeline Verde no GitHub Actions:** O workflow compila o projeto sem erros de TypeScript e sem quebra nos testes de áudio/métrica.
3. **Persistência Funcional:** As pontuações do estudante, lições concluídas e configurações de metrônomo persistem no recarregamento da página via IndexedDB local.
4. **Zero Erro de Recursos (Assets 404):** Os caminhos base de scripts, fontes e arquivos de áudio devem estar devidamente configurados com o prefixo do repositório (`base: './'` ou `base: '/nome-do-repo/'`).