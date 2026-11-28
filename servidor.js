// Etapa 07: servidor HTTP com API REST de receitas e banco SQLite.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORTA = Number(process.env.PORT || 8000);
const PASTA_PROJETO = __dirname;
const banco = require("./banco");

// Arquivos que o navegador pode abrir. O banco de dados não é público.
const arquivosPublicos = [
  "/index.html", "/cadastro.html", "/detalhes.html", "/css/style.css",
  "/js/main.js", "/js/api.js", "/js/lista.js",
  "/js/cadastro.js", "/js/detalhes.js"
];

function responderJSON(resposta, codigo, dados) {
  resposta.writeHead(codigo, { "Content-Type": "application/json; charset=utf-8" });
  resposta.end(JSON.stringify(dados));
}

function esperar(milisegundos) {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

async function lerCorpo(requisicao) {
  let texto = "";
  for await (const parte of requisicao) {
    texto += parte;
    if (texto.length > 100000) {
      throw new Error("Dados enviados muito grandes.");
    }
  }
  return JSON.parse(texto);
}

function receitaValida(receita) {
  return receita && typeof receita === "object" && !Array.isArray(receita) &&
    typeof receita.nome === "string" && receita.nome.trim().length >= 3 &&
    typeof receita.categoria === "string" && receita.categoria.trim().length > 0 &&
    (typeof receita.tempo === "number" || typeof receita.tempo === "string") &&
    Number.isFinite(Number(receita.tempo)) && Number(receita.tempo) > 0 &&
    typeof receita.ingredientes === "string" &&
    receita.ingredientes.split(/\r?\n/).filter((item) => item.trim()).length >= 2 &&
    typeof receita.preparo === "string" && receita.preparo.trim().length >= 10;
}

// Organiza os dados da mesma forma no cadastro e na atualização.
function montarReceita(dados) {
  return {
    nome: dados.nome.trim(),
    categoria: dados.categoria.trim(),
    tempo: Number(dados.tempo),
    ingredientes: dados.ingredientes.trim(),
    preparo: dados.preparo.trim()
  };
}

async function atenderAPI(requisicao, resposta, url) {
  // Mantida da Etapa 05: a pausa mostra "Carregando..." na página.
  await esperar(600);

  const partes = url.pathname.split("/").filter(Boolean);
  const ehColecao = partes.length === 2 && partes[0] === "api" && partes[1] === "receitas";
  const ehItem = partes.length === 3 && partes[0] === "api" && partes[1] === "receitas";

  if (!ehColecao && !ehItem) {
    responderJSON(resposta, 404, { erro: "Rota não encontrada." });
    return;
  }

  if (url.searchParams.get("simularErro") === "1") {
    responderJSON(resposta, 503, { erro: "Erro de comunicação simulado para a apresentação." });
    return;
  }

  const id = ehItem ? Number(partes[2]) : null;
  if (ehItem && (!/^[1-9]\d*$/.test(partes[2]) || !Number.isSafeInteger(id))) {
    responderJSON(resposta, 400, { erro: "O ID da receita deve ser um número inteiro positivo." });
    return;
  }

  if (ehColecao && requisicao.method === "GET") {
    responderJSON(resposta, 200, banco.listarReceitas());
    return;
  }

  if (ehItem && requisicao.method === "GET") {
    const receita = banco.buscarReceita(id);
    responderJSON(resposta, receita ? 200 : 404, receita || { erro: "Receita não encontrada." });
    return;
  }

  // POST e PUT recebem JSON e precisam dos mesmos campos obrigatórios.
  if ((ehColecao && requisicao.method === "POST") || (ehItem && requisicao.method === "PUT")) {
    const tipo = requisicao.headers["content-type"] || "";
    if (!tipo.toLowerCase().startsWith("application/json")) {
      responderJSON(resposta, 415, { erro: "Envie os dados com Content-Type: application/json." });
      return;
    }

    let dados;
    try {
      dados = await lerCorpo(requisicao);
    } catch (erro) {
      responderJSON(resposta, 400, { erro: "Os dados enviados não são um JSON válido." });
      return;
    }

    if (!receitaValida(dados)) {
      responderJSON(resposta, 400, { erro: "Preencha corretamente todos os campos da receita." });
      return;
    }

    if (requisicao.method === "POST") {
      // O banco gera o ID; um ID antigo pode ser usado na migração.
      const idAntigo = Number(dados.id);
      const idImportado = Number.isSafeInteger(idAntigo) && idAntigo > 0 ? idAntigo : null;
      const resultado = banco.criarReceita(montarReceita(dados), idImportado);
      responderJSON(resposta, resultado.criada ? 201 : 200, resultado.receita);
      return;
    }

    const receitaAtualizada = banco.atualizarReceita(id, montarReceita(dados));
    responderJSON(resposta, receitaAtualizada ? 200 : 404,
      receitaAtualizada || { erro: "Receita não encontrada." });
    return;
  }

  if (ehItem && requisicao.method === "DELETE") {
    if (!banco.excluirReceita(id)) {
      responderJSON(resposta, 404, { erro: "Receita não encontrada." });
      return;
    }
    responderJSON(resposta, 200, { mensagem: "Receita excluída com sucesso." });
    return;
  }

  resposta.setHeader("Allow", ehColecao ? "GET, POST" : "GET, PUT, DELETE");
  responderJSON(resposta, 405, { erro: "Método HTTP não permitido nesta rota." });
}

const servidor = http.createServer(async (requisicao, resposta) => {
  try {
    const url = new URL(requisicao.url, "http://localhost:" + PORTA);
    const endereco = url.pathname === "/" ? "/index.html" : url.pathname;

    if (endereco.startsWith("/api/")) {
      await atenderAPI(requisicao, resposta, url);
      return;
    }

    if (requisicao.method !== "GET" || !arquivosPublicos.includes(endereco)) {
      resposta.writeHead(404);
      resposta.end("Página não encontrada.");
      return;
    }

    const conteudo = fs.readFileSync(path.join(PASTA_PROJETO, endereco));
    const tipo = endereco.endsWith(".js") ? "text/javascript" :
      endereco.endsWith(".css") ? "text/css" : "text/html";
    resposta.writeHead(200, { "Content-Type": tipo + "; charset=utf-8" });
    resposta.end(conteudo);
  } catch (erro) {
    console.error("Erro no servidor:", erro.message);
    if (!resposta.headersSent) {
      // Erros reais do SQLite retornam HTTP 500 sem expor detalhes internos.
      const mensagem = erro.code === "ERR_SQLITE_ERROR"
        ? "Não foi possível acessar ou gravar os dados no banco."
        : "O servidor não conseguiu processar a solicitação.";
      responderJSON(resposta, 500, { erro: mensagem });
    } else {
      resposta.end();
    }
  }
});

servidor.listen(PORTA, () => {
  console.log("Minhas Receitas Web: http://localhost:" + PORTA);
});
