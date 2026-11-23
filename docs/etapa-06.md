# Etapa 06 — API REST da aplicação

## Objetivo

Disponibilizar as receitas do Minhas Receitas Web por meio de uma API REST. O recurso principal é **receitas**. O servidor usa Node.js e salva os dados em \`dados/receitas.json\`, aproveitando a estrutura da Etapa 05.

Não é necessário instalar bibliotecas. O site continua funcionando como antes.

## Como executar

1. Instale o Node.js, se ainda não tiver.
2. Baixe este repositório e abra a pasta no VS Code.
3. Abra **Terminal > Novo Terminal** e digite:

~~~bash
node servidor.js
~~~

4. Acesse http://localhost:8000 para abrir o site.
5. Para testar a API, use http://localhost:8000/api/receitas no navegador ou importe a coleção do Postman.
6. Para parar o servidor, pressione **Ctrl + C** no terminal.

**Importante:** o código deve rodar no computador com Node.js. Só abrir os arquivos HTML ou acessar o repositório no GitHub não inicia a API.

## Endpoints disponíveis

| Método | Endereço | O que faz | Código de sucesso |
| --- | --- | --- | --- |
| GET | \`/api/receitas\` | Lista todas as receitas | 200 |
| GET | \`/api/receitas/:id\` | Consulta uma receita pelo ID | 200 |
| POST | \`/api/receitas\` | Cadastra uma receita | 201 |
| PUT | \`/api/receitas/:id\` | Atualiza uma receita existente | 200 |
| DELETE | \`/api/receitas/:id\` | Exclui uma receita | 200 |

Em \`:id\`, substitua pelo número da receita. Por exemplo: \`/api/receitas/1\`.

## Exemplos de requisições e respostas

### 1. Listar receitas — GET

**Requisição:** \`GET http://localhost:8000/api/receitas\`

**Resposta:** HTTP 200, com uma lista JSON. Exemplo abreviado:

~~~json
[
  {
    "id": 1,
    "nome": "Bolo de cenoura",
    "categoria": "Sobremesas",
    "tempo": 45,
    "ingredientes": "2 cenouras médias\n3 ovos\n2 xícaras de farinha de trigo\n1 xícara de açúcar",
    "preparo": "Bata as cenouras com os ovos, misture os demais ingredientes e asse por aproximadamente 35 minutos."
  }
]
~~~

A resposta real inclui todas as receitas cadastradas.

### 2. Consultar uma receita — GET

**Requisição:** \`GET http://localhost:8000/api/receitas/1\`

**Resposta:** HTTP 200, um objeto JSON com os campos \`id\`, \`nome\`, \`categoria\`, \`tempo\`, \`ingredientes\` e \`preparo\` da receita encontrada.

Se o ID não existir, responde HTTP 404:

~~~json
{
  "erro": "Receita não encontrada."
}
~~~

### 3. Cadastrar receita — POST

**Requisição:** \`POST http://localhost:8000/api/receitas\`

Cabeçalho: \`Content-Type: application/json\`

Corpo (JSON):

~~~json
{
  "nome": "Omelete simples",
  "categoria": "Lanches",
  "tempo": 15,
  "ingredientes": "2 ovos\nSal a gosto",
  "preparo": "Misture os ovos e prepare na frigideira."
}
~~~

**Resposta:** HTTP 201, com a receita cadastrada e um \`id\` numérico gerado pelo servidor. O ID muda a cada cadastro.

### 4. Atualizar receita — PUT

**Requisição:** \`PUT http://localhost:8000/api/receitas/1\`

Cabeçalho: \`Content-Type: application/json\`

Corpo (JSON):

~~~json
{
  "nome": "Bolo de cenoura atualizado",
  "categoria": "Sobremesas",
  "tempo": 50,
  "ingredientes": "2 cenouras\n3 ovos\nFarinha de trigo",
  "preparo": "Misture os ingredientes e asse até ficar pronto."
}
~~~

**Resposta:** HTTP 200, com a receita completa atualizada em JSON, mantendo o mesmo \`id\`.

No PUT é necessário enviar todos os campos, não só o campo alterado. Se o ID não existir, retorna 404.

### 5. Excluir receita — DELETE

**Requisição:** \`DELETE http://localhost:8000/api/receitas/1\`

**Resposta:** HTTP 200:

~~~json
{
  "mensagem": "Receita excluída com sucesso."
}
~~~

Se a receita não existir, retorna HTTP 404 com a propriedade \`erro\`.

## Validação e códigos HTTP

Para POST e PUT, o servidor verifica:

- \`nome\`: texto com pelo menos 3 caracteres.
- \`categoria\`: texto não vazio.
- \`tempo\`: número maior que zero.
- \`ingredientes\`: texto com pelo menos 2 linhas não vazias.
- \`preparo\`: texto com pelo menos 10 caracteres.

Todas as respostas da API usam JSON. Os erros seguem o formato \`{ "erro": "Mensagem explicando o problema." }\`.

| Código | Significado |
| --- | --- |
| 200 | Consulta, atualização ou exclusão realizada |
| 201 | Receita cadastrada |
| 400 | Dados inválidos, JSON incorreto ou ID inválido |
| 404 | Receita ou rota não encontrada |
| 405 | Método HTTP não permitido na rota |
| 415 | Falta o cabeçalho \`Content-Type: application/json\` no POST/PUT |
| 500 | Falha interna do servidor |
| 503 | Falha simulada da Etapa 05, usando \`?simularErro=1\` |

Exemplo de erro de validação (HTTP 400):

~~~json
{
  "erro": "Preencha corretamente todos os campos da receita."
}
~~~

## Como testar no Postman

1. Inicie o servidor com \`node servidor.js\`.
2. Abra o Postman e escolha **Import > File**.
3. Selecione [\`docs/postman-etapa-06.json\`](postman-etapa-06.json).
4. Execute **1 - Listar receitas** e **2 - Consultar receita por ID**.
5. Execute **3 - Cadastrar receita**. Anote o número \`id\` que veio na resposta.
6. Na coleção, abra **Variables** e troque o valor de \`id\` pelo número criado.
7. Execute **4 - Atualizar receita** e depois **5 - Excluir receita**.
8. Faça também os testes de erro 400 e 404 incluídos na coleção.

**Dica:** altere ou exclua a receita que você acabou de criar, em vez de apagar uma receita de exemplo.

## O que mostrar ao professor

1. Explique que **API** é a parte do servidor que recebe requisições do cliente e responde em JSON.
2. Abra \`servidor.js\` e mostre as rotas GET, POST, PUT e DELETE.
3. Faça um GET no Postman para listar as receitas.
4. Faça POST para cadastrar uma receita e mostre o código HTTP **201**.
5. Use o ID recebido para fazer PUT. Mostre que o nome mudou, mas o ID continua igual.
6. Faça DELETE e depois GET do mesmo ID: a API retorna **404**.
7. Envie um POST incompleto: a API retorna **400** com uma mensagem de erro.
8. Abra \`dados/receitas.json\` para mostrar onde as informações ficam salvas.

**Fala resumida:** "Na Etapa 05 eu já usava fetch para conversar com um servidor. Nesta etapa completei a API REST, que agora permite consultar, cadastrar, atualizar e excluir receitas. Os dados vão e voltam em JSON, as entradas são validadas e a API responde com códigos HTTP adequados."

## Arquivos da entrega

- \`servidor.js\`: código da API.
- \`dados/receitas.json\`: dados das receitas.
- \`docs/etapa-06.md\`: documentação, exemplos e instruções.
- \`docs/postman-etapa-06.json\`: coleção para importar no Postman.
