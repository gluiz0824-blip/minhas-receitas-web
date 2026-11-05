// Módulo responsável por conversar com o servidor usando Fetch API.
async function fazerRequisicao(endereco, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(endereco, opcoes);
  } catch (erro) {
    throw new Error("Não foi possível conectar ao servidor. Verifique a conexão.");
  }

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "O servidor retornou um erro.");
  }
  return dados;
}

export async function listarReceitas(simularErro = false) {
  return fazerRequisicao("/api/receitas" + (simularErro ? "?simularErro=1" : ""));
}

export async function buscarReceita(id) {
  return fazerRequisicao("/api/receitas/" + encodeURIComponent(id));
}

export async function cadastrarReceita(receita, simularErro = false) {
  return fazerRequisicao("/api/receitas" + (simularErro ? "?simularErro=1" : ""), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receita)
  });
}

export async function excluirReceita(id) {
  return fazerRequisicao("/api/receitas/" + encodeURIComponent(id), {
    method: "DELETE"
  });
}

// Aproveita receitas criadas na Etapa 04, se o navegador estiver na mesma origem.
export async function migrarReceitasAntigas() {
  let antigas;
  try {
    antigas = JSON.parse(localStorage.getItem("receitasSalvas") || "[]");
  } catch (erro) {
    return; // Ignora dados antigos danificados.
  }

  if (!Array.isArray(antigas) || antigas.length === 0) return;

  for (const receita of antigas) {
    await cadastrarReceita(receita);
  }
  localStorage.removeItem("receitasSalvas"); // Só limpa após todas serem enviadas.
}
