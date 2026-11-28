const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

test("CRUD, relacionamento e persistência no SQLite", async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), "receitas-etapa-07-"));
  const arquivo = path.join(pasta, "teste.db");
  const raiz = path.join(__dirname, "..");
  const base = "http://127.0.0.1:18007/api/receitas";
  let servidor;

  async function iniciar() {
    servidor = spawn(process.execPath, ["servidor.js"], {
      cwd: raiz,
      env: { ...process.env, PORT: "18007", BANCO_ARQUIVO: arquivo },
      stdio: "ignore"
    });
    for (let i = 0; i < 50; i++) {
      if (servidor.exitCode !== null) throw new Error("Servidor não iniciou.");
      try {
        const resposta = await fetch("http://127.0.0.1:18007/");
        if (resposta.ok) {
          await resposta.text();
          return;
        }
      } catch (erro) {
        // Aguarda o servidor abrir a porta.
      }
      await new Promise((resolver) => setTimeout(resolver, 100));
    }
    throw new Error("Servidor não respondeu.");
  }

  async function parar() {
    if (servidor && servidor.exitCode === null && servidor.signalCode === null) {
      const fim = once(servidor, "exit");
      servidor.kill();
      await fim;
    }
  }

  async function requisicao(metodo, rota = "", corpo, status = 200) {
    const opcoes = { method: metodo };
    if (corpo !== undefined) {
      opcoes.headers = { "Content-Type": "application/json" };
      opcoes.body = JSON.stringify(corpo);
    }
    const resposta = await fetch(base + rota, opcoes);
    assert.equal(resposta.status, status);
    return resposta.json();
  }

  const receita = {
    nome: "Omelete de teste",
    categoria: "Lanches",
    tempo: 15,
    ingredientes: "2 ovos\nSal",
    preparo: "Misture e prepare na frigideira."
  };

  try {
    await iniciar();
    const iniciais = await requisicao("GET");
    assert.ok(iniciais.length > 0);
    await requisicao("POST", "", { nome: "A" }, 400);
    const criada = await requisicao("POST", "", receita, 201);
    const rota = "/" + criada.id;
    assert.equal((await requisicao("GET", rota)).nome, receita.nome);

    // Confere a chave estrangeira e a reutilização da categoria.
    const banco = new DatabaseSync(arquivo);
    try {
      const categorias = banco.prepare("SELECT COUNT(*) AS total FROM categorias WHERE nome = ?").get("Lanches");
      assert.equal(categorias.total, 1);
      const vinculada = banco.prepare(`SELECT categorias.nome FROM receitas
        JOIN categorias ON categorias.id = receitas.categoria_id WHERE receitas.id = ?`).get(criada.id);
      assert.equal(vinculada.nome, "Lanches");
    } finally {
      banco.close();
    }

    const atualizada = await requisicao("PUT", rota, { ...receita, nome: "Omelete atualizado", tempo: 20 });
    assert.equal(atualizada.id, criada.id);
    assert.equal(atualizada.tempo, 20);

    await parar();
    await iniciar();
    assert.equal((await requisicao("GET", rota)).nome, "Omelete atualizado");
    await requisicao("DELETE", rota);
    await requisicao("GET", rota, undefined, 404);

    // Uma receita excluída da carga inicial também não pode reaparecer.
    const rotaInicial = "/" + iniciais[0].id;
    await requisicao("DELETE", rotaInicial);
    await parar();
    await iniciar();
    await requisicao("GET", rota, undefined, 404);
    await requisicao("GET", rotaInicial, undefined, 404);

    // Provoca uma falha de persistência real somente no banco temporário.
    const bancoComErro = new DatabaseSync(arquivo);
    try {
      bancoComErro.exec("DROP TABLE receitas");
    } finally {
      bancoComErro.close();
    }
    const erro = await requisicao("GET", "", undefined, 500);
    assert.equal(typeof erro.erro, "string");
  } finally {
    await parar();
    fs.rmSync(pasta, { recursive: true, force: true });
  }
});
