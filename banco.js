// Etapa 07: todas as consultas SQL ficam neste arquivo.
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const arquivo = process.env.BANCO_ARQUIVO || path.join(__dirname, "dados", "receitas.db");
const banco = new DatabaseSync(arquivo);
banco.exec("PRAGMA foreign_keys = ON");

// Uma transação garante que todas as alterações sejam feitas juntas.
function transacao(operacao) {
  banco.exec("BEGIN");
  try {
    const resultado = operacao();
    banco.exec("COMMIT");
    return resultado;
  } catch (erro) {
    banco.exec("ROLLBACK");
    throw erro;
  }
}

function obterCategoria(nome) {
  banco.prepare("INSERT OR IGNORE INTO categorias (nome) VALUES (?)").run(nome);
  return banco.prepare("SELECT id FROM categorias WHERE nome = ?").get(nome).id;
}

// JOIN devolve o nome da categoria para manter o JSON da API anterior.
const consulta = `SELECT receitas.id, receitas.nome, categorias.nome AS categoria,
  receitas.tempo, receitas.ingredientes, receitas.preparo
  FROM receitas JOIN categorias ON receitas.categoria_id = categorias.id`;

function listarReceitas() {
  return banco.prepare(consulta + " ORDER BY receitas.id").all();
}

function buscarReceita(id) {
  return banco.prepare(consulta + " WHERE receitas.id = ?").get(id);
}

function criarReceita(receita, id = null) {
  return transacao(() => {
    // Mantém a importação de receitas antigas feita pelo navegador.
    if (id !== null) {
      const existente = buscarReceita(id);
      if (existente) return { receita: existente, criada: false };
    }

    const categoriaId = obterCategoria(receita.categoria);
    const resultado = banco.prepare(`INSERT INTO receitas
      (id, nome, categoria_id, tempo, ingredientes, preparo)
      VALUES (?, ?, ?, ?, ?, ?)`).run(
      id, receita.nome, categoriaId, receita.tempo, receita.ingredientes, receita.preparo
    );
    return { receita: buscarReceita(Number(resultado.lastInsertRowid)), criada: true };
  });
}

function atualizarReceita(id, receita) {
  return transacao(() => {
    if (!buscarReceita(id)) return null;
    const categoriaId = obterCategoria(receita.categoria);
    banco.prepare(`UPDATE receitas SET nome = ?, categoria_id = ?, tempo = ?,
      ingredientes = ?, preparo = ? WHERE id = ?`).run(
      receita.nome, categoriaId, receita.tempo, receita.ingredientes, receita.preparo, id
    );
    return buscarReceita(id);
  });
}

function excluirReceita(id) {
  const resultado = banco.prepare("DELETE FROM receitas WHERE id = ?").run(id);
  return resultado.changes > 0;
}

// Cria as tabelas automaticamente e importa o JSON somente na primeira execução.
function iniciarBanco() {
  banco.exec(fs.readFileSync(path.join(__dirname, "dados", "modelo.sql"), "utf8"));
  if (banco.prepare("PRAGMA user_version").get().user_version === 0) {
    const antigas = JSON.parse(fs.readFileSync(path.join(__dirname, "dados", "receitas.json"), "utf8"));
    transacao(() => {
      for (const receita of antigas) {
        const categoriaId = obterCategoria(receita.categoria);
        banco.prepare(`INSERT INTO receitas (id, nome, categoria_id, tempo, ingredientes, preparo)
          VALUES (?, ?, ?, ?, ?, ?)`).run(
          receita.id, receita.nome, categoriaId, receita.tempo, receita.ingredientes, receita.preparo
        );
      }
      banco.exec("PRAGMA user_version = 1");
    });
  }
}

try {
  iniciarBanco();
} catch (erro) {
  banco.close();
  throw new Error("Não foi possível iniciar o banco de dados: " + erro.message);
}

module.exports = { listarReceitas, buscarReceita, criarReceita, atualizarReceita, excluirReceita };
