// Módulo da página de detalhes: consulta uma receita pelo ID.
import { buscarReceita, migrarReceitasAntigas } from "./api.js";

export async function iniciarDetalhes() {
  const conteudo = document.getElementById("conteudo-receita");
  const naoEncontrada = document.getElementById("receita-nao-encontrada");
  const carregando = document.getElementById("carregando-detalhes");
  const erroComunicacao = document.getElementById("erro-detalhes");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    naoEncontrada.hidden = false;
    return;
  }

  carregando.hidden = false;
  try {
    await migrarReceitasAntigas();
    const receita = await buscarReceita(id);
    document.getElementById("detalhe-categoria").textContent = receita.categoria;
    document.getElementById("detalhe-nome").textContent = receita.nome;
    const tempo = document.getElementById("detalhe-tempo");
    tempo.textContent = receita.tempo + " minutos";
    tempo.dateTime = "PT" + receita.tempo + "M";

    const listaIngredientes = document.getElementById("detalhe-ingredientes");
    listaIngredientes.replaceChildren();
    receita.ingredientes.split(/\r?\n/).forEach((linha) => {
      if (linha.trim()) {
        const item = document.createElement("li");
        item.textContent = linha.trim();
        listaIngredientes.appendChild(item);
      }
    });

    document.getElementById("detalhe-preparo").textContent = receita.preparo;
    document.title = receita.nome + " | Minhas Receitas Web";
    conteudo.hidden = false;
  } catch (erro) {
    if (erro.message === "Receita não encontrada.") {
      naoEncontrada.hidden = false;
      document.title = "Receita não encontrada | Minhas Receitas Web";
    } else {
      erroComunicacao.textContent = "Erro ao consultar a receita: " + erro.message;
      erroComunicacao.hidden = false;
    }
  } finally {
    carregando.hidden = true;
  }
}
