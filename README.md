# Minhas Receitas Web 🍳

Projeto acadêmico desenvolvido no curso de Engenharia da Computação da PUC Goiás. O objetivo é criar um caderno digital simples para cadastrar, organizar e consultar receitas culinárias.

## Etapa atual — Etapa 04
O projeto agora possui interatividade com JavaScript.

Principais funcionalidades:

- busca de receitas por nome ou categoria;
- cadastro de novas receitas com validação dos campos;
- armazenamento das receitas no `localStorage` do navegador;
- exibição automática das receitas cadastradas na página inicial;
- exclusão de receitas cadastradas pelo usuário;
- contador de ingredientes preenchidos no formulário.

## Como executar
Não é necessário instalar dependências.

A forma recomendada é abrir a pasta do projeto no VS Code e usar a extensão **Live Server**. Também é possível executar um servidor local com Python:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador.

## Estrutura
```text
├── index.html
├── cadastro.html
├── detalhes.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── docs/
    ├── proposta.md
    ├── etapa-02.md
    ├── etapa-03.md
    ├── etapa-04.md
    └── evidencias/
        ├── etapa-03/
        └── etapa-04/
```

## Documentação
- [Etapa 01 — Proposta do Projeto](docs/proposta.md)
- [Etapa 02 — Protótipo Estrutural](docs/etapa-02.md)
- [Etapa 03 — Interface Responsiva](docs/etapa-03.md)
- [Etapa 04 — Interatividade com JavaScript](docs/etapa-04.md)

## Tecnologias
- HTML5
- CSS3
- JavaScript
- LocalStorage
- Flexbox
- CSS Grid
- Media Queries
