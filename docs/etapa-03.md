# Etapa 03 — Interface Responsiva com CSS

## Objetivo
Nesta etapa, as três interfaces desenvolvidas na Etapa 02 receberam estilização com CSS e comportamento responsivo para funcionar de forma adequada em desktop, tablet e smartphone.

## Interfaces apresentadas
1. **Tela 01 — Página inicial (`index.html`)**
   - Apresentação do sistema.
   - Campo de busca.
   - Cards com receitas cadastradas.

2. **Tela 02 — Cadastro de receita (`cadastro.html`)**
   - Formulário de cadastro com campos para nome, categoria, tempo de preparo, ingredientes e modo de preparo.

3. **Tela 03 — Detalhes da receita (`detalhes.html`)**
   - Informações da receita.
   - Lista de ingredientes.
   - Modo de preparo.
   - Ações de navegação.

## CSS utilizado
O arquivo responsável pela estilização e pela responsividade é:

`/css/style.css`

## Recursos de layout utilizados
- **Flexbox** no cabeçalho, menu de navegação, busca, cards, botões e ações dos formulários.
- **CSS Grid** na grade de receitas e na organização dos campos do formulário.
- Espaçamentos, tamanhos de fonte e larguras máximas consistentes para manter legibilidade.
- Campos de formulário com largura adaptável.

## Breakpoints utilizados
Foram utilizados dois breakpoints principais:

- **Até 900 px:** adaptação para tablets. A grade de receitas passa de três para duas colunas, a área de título e busca passa para uma organização vertical e os espaçamentos são reduzidos.
- **Até 600 px:** adaptação para smartphones. O menu passa a ficar em coluna, a grade de receitas passa para uma coluna, busca e botões ocupam melhor a largura disponível e as ações dos formulários ficam empilhadas.

## Principais decisões de responsividade
No desktop, a interface utiliza maior largura e apresenta três cards por linha. No tablet, a grade passa para duas colunas para evitar cards estreitos. No smartphone, os elementos são empilhados em uma única coluna, facilitando leitura e interação por toque.

O formulário mantém os campos com largura de 100% e os botões passam a ocupar toda a largura em telas pequenas. O menu também muda de horizontal para vertical no breakpoint de smartphone.

## Viewports das evidências
As mesmas três interfaces foram registradas nos três tamanhos solicitados:

### Desktop — 1440 × 900 px
- `docs/evidencias/etapa-03/desktop-tela-01.png`
- `docs/evidencias/etapa-03/desktop-tela-02.png`
- `docs/evidencias/etapa-03/desktop-tela-03.png`

### Tablet — 768 × 1024 px
- `docs/evidencias/etapa-03/tablet-tela-01.png`
- `docs/evidencias/etapa-03/tablet-tela-02.png`
- `docs/evidencias/etapa-03/tablet-tela-03.png`

### Smartphone — 390 × 844 px
- `docs/evidencias/etapa-03/smartphone-tela-01.png`
- `docs/evidencias/etapa-03/smartphone-tela-02.png`
- `docs/evidencias/etapa-03/smartphone-tela-03.png`

## Estrutura principal da Etapa 03
```text
minhas-receitas-web/
├── index.html
├── cadastro.html
├── detalhes.html
├── css/
│   └── style.css
├── docs/
│   ├── proposta.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   └── evidencias/
│       └── etapa-03/
│           ├── desktop-tela-01.png
│           ├── desktop-tela-02.png
│           ├── desktop-tela-03.png
│           ├── tablet-tela-01.png
│           ├── tablet-tela-02.png
│           ├── tablet-tela-03.png
│           ├── smartphone-tela-01.png
│           ├── smartphone-tela-02.png
│           └── smartphone-tela-03.png
└── README.md
```

## Tag de entrega
`etapa-03`
