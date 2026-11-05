# Etapa 05 — Modularização e Comunicação Assíncrona

## Objetivo

Separar as responsabilidades do front-end e trocar a leitura direta do armazenamento local por requisições HTTP a um **servidor simulado**. O projeto usa ferramentas básicas para facilitar a explicação em sala.

## O que mudou da Etapa 04 para a 05?

Antes, quase tudo ficava em um só arquivo JavaScript e as receitas eram consultadas diretamente do localStorage do navegador. Agora, cada funcionalidade tem um arquivo próprio. A API simulada lê e grava o arquivo dados/receitas.json. **Isso não é um banco de dados real nem um serviço hospedado na internet.**

| Arquivo | Para que serve |
| --- | --- |
| js/main.js | Identifica a página e inicia o módulo correto. |
| js/api.js | Centraliza fetch, verifica a resposta HTTP e lança erros. |
| js/lista.js | Lista, busca, cria cards e exclui receitas. |
| js/cadastro.js | Valida o formulário e envia a receita. |
| js/detalhes.js | Busca uma receita por ID e mostra seus detalhes. |
| servidor.js | Recebe GET, POST e DELETE e responde com JSON. |
| dados/receitas.json | Guarda os dados no serviço simulado. |

## O que significa comunicação assíncrona?

O navegador pede informações ao servidor e não precisa congelar a tela enquanto espera. O fetch devolve uma **Promise** (uma promessa de um resultado futuro). A palavra **await** aguarda essa Promise dentro de uma função declarada como **async**.

Exemplo bem simples:

~~~javascript
async function consultar() {
  try {
    const resposta = await fetch("/api/receitas");
    if (!resposta.ok) throw new Error("Falha na consulta");
    const receitas = await resposta.json();
    console.log(receitas);
  } catch (erro) {
    console.log("Erro: " + erro.message);
  }
}
~~~

No projeto, essa comunicação fica concentrada em js/api.js.

## Como funciona uma consulta GET?

1. A página mostra a mensagem Carregando receitas do servidor.
2. js/lista.js chama listarReceitas() de js/api.js.
3. A Fetch API solicita GET /api/receitas.
4. servidor.js lê dados/receitas.json e responde com um JSON.
5. A lista de cards aparece. Se houver falha, o catch mostra erro e o botão Tentar novamente permite repetir a chamada.

## Como funciona o cadastro POST?

1. O formulário valida nome, categoria, tempo, ingredientes e preparo.
2. O botão muda para Salvando e fica temporariamente desabilitado.
3. js/cadastro.js chama cadastrarReceita() em js/api.js.
4. O fetch usa method POST e converte a receita para JSON com JSON.stringify().
5. O servidor valida, cria um ID e grava a receita no arquivo JSON.
6. No sucesso, uma mensagem confirma o cadastro e o formulário é limpo. Na falha, aparece o erro e os dados preenchidos são preservados.

## Outras operações da API

- GET /api/receitas/:id consulta uma receita ou retorna HTTP 404.
- DELETE /api/receitas/:id exclui uma receita e retorna sucesso.
- GET /api/receitas?simularErro=1 retorna HTTP 503 propositalmente.
- POST /api/receitas?simularErro=1 também retorna 503 sem gravar nada.

O servidor aguarda cerca de **600 milissegundos** antes da resposta, somente para facilitar a visualização do carregamento.

## Onde ficam os dados?

Na Etapa 05, as receitas ficam no arquivo dados/receitas.json. Elas permanecem após atualizar a página e reiniciar o servidor, mas não ficam hospedadas na nuvem.

O código também tenta importar as receitas da Etapa 04 do localStorage se o navegador estiver usando a mesma origem, inclusive a mesma porta. Se o Live Server anterior usava outra porta, o armazenamento daquele endereço não pode ser acessado automaticamente.

## Requisitos do professor

| Requisito | Implementação |
| --- | --- |
| Modularizar | main.js, api.js, lista.js, cadastro.js, detalhes.js |
| Evitar arquivo único | Cada arquivo tem uma responsabilidade |
| Chamadas assíncronas | Funções async com await |
| Fetch API | Requisições HTTP em js/api.js |
| Promises | fetch retorna uma Promise |
| Carregamento | Carregando, Salvando e botões desabilitados |
| Erros de comunicação | try/catch, verificação de response.ok e HTTP 503 |
| Dados externos ou simulados | API local e arquivo JSON |
| Consulta | GET na lista e nos detalhes |
| Submissão | POST no formulário |
| Sucesso e erro | Mensagens visíveis na tela |

## Roteiro de apresentação: falas simples

**Modularização:** “Antes eu tinha praticamente tudo em um arquivo só. Agora separei o código por tela e deixei a comunicação com o servidor em um módulo próprio.”

**Consulta:** “Quando a página abre, usamos fetch para pedir receitas. Enquanto aguardamos, mostramos Carregando. O servidor devolve os dados em JSON e o JavaScript monta os cards.”

**Cadastro:** “Primeiro validamos os campos. Depois enviamos um POST com a receita. O servidor guarda essa informação e devolve uma resposta de sucesso.”

**Tratamento de erro:** “Criei um teste controlado para fazer o servidor responder com erro 503. O catch identifica a falha, mostra a mensagem e permite uma nova tentativa.”

**Diferença da Etapa 04:** “Antes o armazenamento ficava somente no navegador. Agora o front-end se comunica por HTTP com um serviço simulado, que grava em um arquivo JSON.”

## Como executar

No terminal, dentro da pasta do projeto:

~~~bash
node servidor.js
~~~

Acesse http://localhost:8000. Não basta abrir o HTML diretamente ou utilizar apenas o Live Server: a API precisa do servidor em execução.

Veja também o [registro de testes](evidencias/etapa-05/testes.md).
