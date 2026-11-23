# Minhas Receitas Web 🍳

Projeto acadêmico de Engenharia da Computação da PUC Goiás. Caderno digital para cadastrar, buscar, consultar e excluir receitas.

## Etapa atual — Etapa 06: API REST da aplicação

O projeto possui uma API REST local feita com **Node.js**, sem frameworks nem pacotes adicionais. O recurso principal é **receitas** e os dados são salvos em `dados/receitas.json`.

As cinco operações pedidas nesta etapa estão disponíveis:

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/api/receitas` | Listar receitas |
| GET | `/api/receitas/:id` | Consultar uma receita |
| POST | `/api/receitas` | Cadastrar receita |
| PUT | `/api/receitas/:id` | Atualizar receita |
| DELETE | `/api/receitas/:id` | Excluir receita |

A API recebe e devolve JSON, valida as informações e utiliza códigos HTTP (200, 201, 400, 404, 405 e outros). A interface das etapas anteriores continua funcionando. **A atualização PUT é demonstrada pelo Postman**, sem acrescentar uma tela nova que não foi solicitada.

## Como executar

1. Instale o Node.js se ainda não tiver.
2. Baixe este repositório e abra a pasta no VS Code.
3. Abra o terminal na pasta do projeto e execute:

~~~bash
node servidor.js
~~~

4. Acesse **http://localhost:8000** para usar o site.
5. Acesse **http://localhost:8000/api/receitas** para consultar a API.
6. Para encerrar, use **Ctrl + C** no terminal.

Não use apenas o Live Server e não abra os arquivos HTML diretamente: o Node.js precisa estar executando o servidor. O GitHub armazena o código, mas não hospeda essa API automaticamente.

## Como testar a Etapa 06

A coleção do Postman contém exemplos dos cinco métodos e de erros:

1. Inicie o servidor com `node servidor.js`.
2. Abra o Postman e importe [`docs/postman-etapa-06.json`](docs/postman-etapa-06.json).
3. Execute o GET para listar e o GET para consultar uma receita.
4. Execute POST para cadastrar; copie o `id` numérico devolvido pela API.
5. Na coleção, abra **Variables** e substitua o valor da variável `id` pelo número criado.
6. Execute PUT para atualizar e DELETE para excluir essa receita.
7. Execute os testes de erro 400 e 404.

As respostas, os códigos HTTP, a validação e as falas para apresentação estão explicados em [**Etapa 06 — API REST**](docs/etapa-06.md).

## Estrutura principal

~~~text
index.html                  Página inicial e lista
cadastro.html               Formulário de receitas
detalhes.html               Detalhes da receita
css/style.css               Estilos do site
js/main.js                  Inicia os módulos
js/api.js                   Comunicação fetch com o servidor
js/lista.js                 Busca, lista e exclusão
js/cadastro.js              Validação e cadastro
js/detalhes.js              Consulta individual
servidor.js                 Servidor Node.js e rotas da API REST
dados/receitas.json         Arquivo onde as receitas são armazenadas
docs/etapa-06.md            Documentação e exemplos da Etapa 06
docs/postman-etapa-06.json  Coleção de testes do Postman
~~~

## Documentação das etapas

- [Etapa 01 — Proposta](docs/proposta.md)
- [Etapa 02 — Protótipo](docs/etapa-02.md)
- [Etapa 03 — Interface](docs/etapa-03.md)
- [Etapa 04 — Interatividade](docs/etapa-04.md)
- [Etapa 05 — Modularização e comunicação assíncrona](docs/etapa-05.md)
- [Etapa 06 — API REST](docs/etapa-06.md)

## Tecnologias

HTML, CSS, JavaScript, Fetch API, async/await, Node.js, HTTP e JSON. Sem dependências externas.
