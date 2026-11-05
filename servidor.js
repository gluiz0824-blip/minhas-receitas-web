// Servidor simulado da Etapa 05. Usa apenas recursos do Node.js.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORTA = Number(process.env.PORT || 8000);
const PASTA_PROJETO = __dirname;
const ARQUIVO_RECEITAS = path.join(PASTA_PROJETO, "dados", "receitas.json");

// Arquivos que o navegador pode abrir. O banco JSON não é servido diretamente.
const arquivosPublicos = [
  "/index.html", "/cadastro.html", "/detalhes.html", "/css/style.css",
  "/js/main.js", "/js/api.js", "/js/lista.js",
  "/js/cadastro.js", "/js/detalhes.js"
];

function responderJSON(resposta, codigo, dados) {
  resposta.writeHead(codigo, { "Content-Type": "application/json; charset=utf-8" });
  resposta.end(JSON.stringify(dados));
}

function lerReceitas() {
  return JSON.parse(fs.readFileSync(ARQUIVO_RECEITAS, "utf8"));
}

function salvarReceitas(receitas) {
  fs.writeFileSync(ARQUIVO_RECEITAS, JSON.stringify(receitas, null, 2) + "\n");
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
  return receita && typeof receita.nome === "string" && receita.nome.trim().length >= 3 &&
    typeof receita.categoria === "string" && receita.categoria.trim().length > 0 &&
    Number.isFinite(Number(receita.tempo)) && Number(receita.tempo) > 0 &&
    typeof receita.ingredientes === "string" &&
    receita.ingredientes.split(/\r?\n/).filter((item) => item.trim()).length >= 2 &&
    typeof receita.preparo === "string" && receita.preparo.trim().length >= 10;
}

async function atenderAPI(requisicao, resposta, url) {
  // A pequena pausa permite enxergar o estado "Carregando..." na apresentação.
  await esperar(600);

  if (url.searchParams.get("simularErro") === "1") {
    responderJSON(resposta, 503, { erro: "Erro de comunicação simulado para a apresentação." });
    return;
  }

  const partes = url.pathname.split("/").filter(Boolean);
  const ehColecao = partes.length === 2; // /api/receitas
  const ehItem = partes.length === 3; // /api/receitas/123
  const id = ehItem ? Number(partes[2]) : null;
  const receitas = lerReceitas();

  if (ehColecao && requisicao.method === "GET") {
    responderJSON(resposta, 200, receitas);
    return;
  }

  if (ehItem && requisicao.method === "GET") {
    const receita = receitas.find((item) => item.id === id);
    responderJSON(resposta, receita ? 200 : 404, receita || { erro: "Receita não encontrada." });
    return;
  }

  if (ehColecao && requisicao.method === "POST") {
    let novaReceita;
    try {
      novaReceita = await lerCorpo(requisicao);
    } catch (erro) {
      responderJSON(resposta, 400, { erro: "Os dados enviados não são um JSON válido." });
      return;
    }

    if (!receitaValida(novaReceita)) {
      responderJSON(resposta, 400, { erro: "Preencha corretamente todos os campos da receita." });
      return;
    }

    // Ao migrar receitas antigas, o ID original pode ser reutilizado sem duplicar.
    const idAntigo = Number(novaReceita.id);
    if (Number.isSafeInteger(idAntigo) && idAntigo > 0) {
      const existente = receitas.find((item) => item.id === idAntigo);
      if (existente) {
        responderJSON(resposta, 200, existente);
        return;
      }
    }

    let novoId = Number.isSafeInteger(idAntigo) && idAntigo > 0 ? idAntigo : Date.now();
    while (receitas.some((item) => item.id === novoId)) novoId++;

    const receita = {
      id: novoId,
      nome: novaReceita.nome.trim(),
      categoria: novaReceita.categoria.trim(),
      tempo: Number(novaReceita.tempo),
      ingredientes: novaReceita.ingredientes.trim(),
      preparo: novaReceita.preparo.trim()
    };
    receitas.push(receita);
    salvarReceitas(receitas);
    responderJSON(resposta, 201, receita);
    return;
  }

  if (ehItem && requisicao.method === "DELETE") {
    const restantes = receitas.filter((item) => item.id !== id);
    if (restantes.length === receitas.length) {
      responderJSON(resposta, 404, { erro: "Receita não encontrada." });
      return;
    }
    salvarReceitas(restantes);
    responderJSON(resposta, 200, { mensagem: "Receita excluída com sucesso." });
    return;
  }

  responderJSON(resposta, 404, { erro: "Rota não encontrada." });
}

const servidor = http.createServer(async (requisicao, resposta) => {
  try {
    const url = new URL(requisicao.url, "http://localhost:" + PORTA);
    const endereco = url.pathname === "/" ? "/index.html" : url.pathname;

    if (endereco.startsWith("/api/receitas")) {
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
      responderJSON(resposta, 500, { erro: "O servidor não conseguiu processar a solicitação." });
    } else {
      resposta.end();
    }
  }
});

servidor.listen(PORTA, () => {
  console.log("Minhas Receitas Web: http://localhost:" + PORTA);
});
