# Etapa 02 — Protótipo Estrutural com HTML Semântico

## Objetivo
Nesta etapa, a proposta do projeto **Minhas Receitas Web** foi transformada em um primeiro protótipo de interface Web. O foco foi criar a estrutura das páginas utilizando HTML5 semântico, sem implementar banco de dados, API ou lógica complexa.

## Funcionalidades implementadas
- Visualização de uma lista de receitas de exemplo.
- Campo de busca de receitas por nome (apenas interface nesta etapa).
- Navegação entre as páginas do sistema.
- Formulário para cadastro de uma nova receita.
- Visualização dos detalhes de uma receita, incluindo ingredientes, tempo e modo de preparo.
- Layout responsivo básico com CSS.

## Páginas criadas
### 1. Página inicial — `index.html`
Apresenta o sistema, uma busca e uma listagem de receitas usando elementos `main`, `section`, `article` e navegação semântica.

### 2. Cadastro de receita — `cadastro.html`
Contém um formulário para nome, categoria, tempo de preparo, ingredientes e modo de preparo. Todos os campos possuem elementos `label` associados pelos atributos `for` e `id`.

### 3. Detalhes da receita — `detalhes.html`
Apresenta uma receita específica com ingredientes e modo de preparo. A receita é representada por `article` e seu conteúdo é dividido em `section`.

## Decisões relacionadas à estrutura HTML
Foi utilizada a estrutura semântica do HTML5 para tornar o documento mais organizado e dar significado às partes da interface:

- `header`: cabeçalho das páginas e cabeçalho da receita.
- `nav`: menu principal de navegação.
- `main`: conteúdo principal de cada página.
- `section`: agrupamento de conteúdos relacionados.
- `article`: representação de cada receita e da receita detalhada.
- `footer`: rodapé geral e ações finais da receita.
- `form`: busca e cadastro de receita.
- `label`: identificação acessível dos campos dos formulários.
- `button`: envio dos formulários.
- `time`: representação semântica do tempo de preparo.

## Estrutura de arquivos
```text
minhas-receitas-web/
├── index.html
├── cadastro.html
├── detalhes.html
├── css/
│   └── style.css
├── docs/
│   ├── proposta.md
│   └── etapa-02.md
└── README.md
```

## Observação
Os dados exibidos são estáticos e servem apenas para representar o funcionamento futuro da aplicação. Persistência, edição, exclusão, autenticação e integração com banco de dados poderão ser implementadas nas próximas etapas.

## Tag de entrega
`etapa-02`
