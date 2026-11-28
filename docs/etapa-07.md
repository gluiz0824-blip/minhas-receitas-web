# Etapa 07 — Persistência e CRUD com banco de dados

## Objetivo e escolha do banco

Na Etapa 06, as receitas eram gravadas em um arquivo JSON. Nesta etapa, a API usa um banco relacional SQLite, que guarda os dados em um arquivo `dados/receitas.db`.

Escolhi SQLite porque o projeto é pequeno, funciona localmente e não precisa de um servidor de banco separado. Ele permite criar tabelas, usar SQL e relacionar receitas com categorias. O Node.js já fornece o módulo `node:sqlite` nas versões indicadas abaixo.

## Modelo do banco

```text
CATEGORIAS                       RECEITAS
id (PK)          1 -------- N   id (PK)
nome (UNIQUE)                    nome
                                 categoria_id (FK)
                                 tempo
                                 ingredientes
                                 preparo
```

PK = chave primária; FK = chave estrangeira.

| Entidade | Campo | Tipo e função |
| --- | --- | --- |
| categorias | id | INTEGER, chave primária |
| categorias | nome | TEXT, obrigatório e único |
| receitas | id | INTEGER, chave primária com incremento automático |
| receitas | nome | TEXT, obrigatório, mínimo de 3 caracteres |
| receitas | categoria_id | INTEGER, chave estrangeira obrigatória para categorias.id |
| receitas | tempo | REAL, tempo em minutos maior que zero |
| receitas | ingredientes | TEXT, obrigatório; a API exige pelo menos dois ingredientes |
| receitas | preparo | TEXT, obrigatório, mínimo de 10 caracteres |

Uma categoria pode ter várias receitas, mas cada receita pertence a uma única categoria (relação 1:N). Por exemplo, bolo e pudim podem pertencer à mesma categoria Sobremesas. O banco evita duplicar o nome da categoria. A categoria é criada quando necessário, junto com o cadastro ou a atualização de uma receita. As operações CRUD da API são sobre receitas; categorias são gerenciadas internamente e não possuem rotas próprias. Ao excluir uma receita, sua categoria continua existindo.

O SQL completo está em [dados/modelo.sql](../dados/modelo.sql).

## Como criar o banco e executar

1. Instale o Node.js 22.13 ou superior (recomendado: Node 22 LTS).
2. Baixe o projeto, abra a pasta no VS Code e abra o terminal.
3. Execute `node servidor.js`.
4. Abra http://localhost:8000.

Não é necessário instalar pacotes npm nem criar tabelas manualmente. Na primeira execução, o módulo banco.js cria o arquivo e executa o modelo SQL. Depois importa as receitas de exemplo de dados/receitas.json, mantendo os IDs. O banco registra que a importação já ocorreu; nas próximas execuções usa somente o SQLite. O JSON é mantido apenas como origem da carga inicial, não é mais atualizado pela API.

O arquivo .db não é enviado ao GitHub: ele é criado no computador de quem executar. Para preservar os dados, não apague esse arquivo. Para inspecionar as tabelas visualmente, é possível abrir receitas.db no DB Browser for SQLite (opcional).

## CRUD da API

A interface e o formato JSON continuam iguais aos da Etapa 06. Para testar, importe a [coleção Postman da Etapa 06](postman-etapa-06.json), que continua compatível.

| Operação | Método e caminho | SQL usado | Sucesso |
| --- | --- | --- | --- |
| Criar | POST /api/receitas | INSERT | 201 |
| Consultar todas | GET /api/receitas | SELECT + JOIN | 200 |
| Consultar uma | GET /api/receitas/:id | SELECT + WHERE | 200 |
| Atualizar | PUT /api/receitas/:id | UPDATE | 200 |
| Excluir | DELETE /api/receitas/:id | DELETE | 200 |

No Postman, faça o POST em http://localhost:8000/api/receitas com Content-Type: application/json e o corpo abaixo:

```json
{
  "nome": "Omelete simples",
  "categoria": "Lanches",
  "tempo": 15,
  "ingredientes": "2 ovos\nSal a gosto",
  "preparo": "Misture os ovos e prepare na frigideira."
}
```

Copie o ID retornado. Nos próximos exemplos, suponha que ele seja 4 (use o ID real retornado).

- GET http://localhost:8000/api/receitas/4: consulta o cadastro.
- PUT http://localhost:8000/api/receitas/4: envie o mesmo JSON completo, mudando o nome para "Omelete de queijo" e o tempo para 20.
- Pare o servidor com Ctrl+C, execute node servidor.js novamente e repita o GET. A receita deve continuar com o novo nome.
- DELETE http://localhost:8000/api/receitas/4: exclui a receita.
- GET da mesma URL: retorna 404, inclusive após reiniciar o servidor.

## Validações e tratamento de erros

A API verifica nome, categoria, tempo positivo e finito, pelo menos dois ingredientes em linhas separadas, preparo com mínimo de 10 caracteres e ID inteiro positivo. JSON inválido e dados incompletos retornam HTTP 400; receita inexistente retorna 404. O banco também possui NOT NULL, UNIQUE, CHECK e chave estrangeira. As consultas usam parâmetros (?) em vez de concatenar os valores no SQL.

No cadastro e na atualização usamos uma transação. Se uma gravação falhar, ROLLBACK desfaz as alterações da operação. Erros do SQLite durante a requisição são tratados pelo servidor com HTTP 500 e mensagem genérica; o erro detalhado fica no terminal. Se não for possível abrir ou inicializar o banco, a aplicação não inicia. O erro de comunicação simulado da Etapa 05 continua retornando 503 e não representa uma falha real do banco.

## Separação de responsabilidades

```text
Navegador (Fetch API)
        |
        v
servidor.js — rotas HTTP, validação e respostas
        |
        v
banco.js — funções CRUD e SQL
        |
        v
dados/receitas.db — tabelas e dados
```

A API chama as funções listarReceitas, buscarReceita, criarReceita, atualizarReceita e excluirReceita do módulo banco.js. Assim, servidor.js não precisa conhecer os comandos SQL ou o caminho do banco.

## Teste automatizado

Execute `node --test testes/etapa-07.test.js` com o servidor normal desligado (o teste usa a porta 18007 e um banco temporário). O teste cobre importação inicial, CRUD, relacionamento, validação, persistência após reinicialização e falha real de acesso a uma tabela. Ele não altera o banco do usuário.

## Como apresentar ao professor

1. Mostre dados/modelo.sql e explique as duas tabelas e a chave estrangeira.
2. Abra banco.js e mostre uma consulta SELECT, um INSERT, um UPDATE e um DELETE.
3. Abra servidor.js e mostre que as rotas chamam as funções do banco.
4. Cadastre uma receita pelo site ou Postman e anote o ID.
5. Atualize pelo PUT, reinicie o servidor e consulte o mesmo ID.
6. Exclua e consulte novamente (404). Envie um POST inválido para mostrar a validação (400).

**Fala sugerida:** "Antes, eu salvava as receitas em um JSON. Agora estou usando SQLite, porque ele é simples e grava os dados em um arquivo. Criei as tabelas de receitas e categorias, relacionadas pelo ID da categoria. Separei o código da API do código do banco. Com isso consigo cadastrar, consultar, atualizar e excluir receitas sem perder os dados quando reinicio o servidor."
