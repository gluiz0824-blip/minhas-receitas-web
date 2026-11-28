# Minhas Receitas Web 🍳

Projeto acadêmico de Engenharia da Computação da PUC Goiás. Caderno digital para cadastrar, buscar, consultar e excluir receitas.

## Etapa atual — Etapa 07: Persistência e CRUD

A API REST em Node.js usa SQLite com duas tabelas relacionadas: receitas e categorias. Os dados são gravados em `dados/receitas.db` e permanecem após reiniciar o servidor. O JSON antigo serve apenas para a carga inicial. A interface e as rotas da Etapa 06 continuam funcionando.

### Como executar

1. Instale o Node.js 22.13 ou superior (recomendado: Node 22 LTS).
2. Abra a pasta do projeto no VS Code.
3. Execute `node servidor.js` no terminal.
4. Acesse http://localhost:8000.

O banco é criado automaticamente. Não precisa de npm install.

| Método | Rota | Função |
| --- | --- | --- |
| GET | /api/receitas | Listar receitas |
| GET | /api/receitas/:id | Consultar uma receita |
| POST | /api/receitas | Cadastrar receita |
| PUT | /api/receitas/:id | Atualizar receita |
| DELETE | /api/receitas/:id | Excluir receita |

A atualização PUT continua sendo demonstrada pelo Postman. Importe a [coleção da Etapa 06](docs/postman-etapa-06.json). Para o teste automatizado, execute `node --test testes/etapa-07.test.js`.

## Estrutura principal

~~~text
index.html                  Página inicial e lista
cadastro.html               Formulário de receitas
detalhes.html               Detalhes da receita
css/style.css               Estilos
js/                         Módulos da interface
servidor.js                 API REST e validações
banco.js                    Operações SQL
dados/modelo.sql            Modelo relacional
dados/receitas.json         Carga inicial da Etapa 06
dados/receitas.db           Banco gerado localmente
testes/etapa-07.test.js     Teste da API e persistência
docs/etapa-07.md            Documentação da entrega
~~~

## Documentação das etapas

- [Etapa 01 — Proposta](docs/proposta.md)
- [Etapa 02 — Protótipo](docs/etapa-02.md)
- [Etapa 03 — Interface](docs/etapa-03.md)
- [Etapa 04 — Interatividade](docs/etapa-04.md)
- [Etapa 05 — Modularização e comunicação assíncrona](docs/etapa-05.md)
- [Etapa 06 — API REST](docs/etapa-06.md)
- [Etapa 07 — Persistência e CRUD](docs/etapa-07.md)

## Tecnologias

HTML, CSS, JavaScript, Fetch API, async/await, Node.js, HTTP, JSON e SQLite. Sem dependências externas.
