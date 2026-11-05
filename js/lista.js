// Módulo da página inicial: listagem, busca e exclusão.
import { listarReceitas, excluirReceita, migrarReceitasAntigas } from "./api.js";

export async function iniciarLista() {
  const lista = document.getElementById("lista-receitas");
  const busca = document.getElementById("busca");
  const formBusca = document.getElementById("form-busca");
  const quantidade = document.getElementById("quantidade-receitas");
  const vazio = document.getElementById("sem-resultados");
  const carregando = document.getElementById("carregando-lista");
  const erroLista = document.getElementById("erro-lista");
  const testarErro = document.getElementById("testar-erro-lista");
  const tentarNovamente = document.getElementById("tentar-novamente");
  let receitas = [];

  function mostrarReceitas() {
    const termo = busca.value.trim().toLowerCase();
    const encontradas = receitas.filter((receita) =>
      receita.nome.toLowerCase().includes(termo) ||
      receita.categoria.toLowerCase().includes(termo)
    );

    lista.replaceChildren();
    quantidade.textContent = encontradas.length + " receita(s) encontrada(s)";
    vazio.textContent = termo ? "Nenhuma receita corresponde à sua busca." :
      "Você ainda não cadastrou receitas. Clique em Nova receita para começar.";
    vazio.hidden = encontradas.length > 0;

    encontradas.forEach((receita) => {
      const card = document.createElement("article");
      card.className = "card";
      const categoria = document.createElement("span");
      categoria.className = "categoria";
      categoria.textContent = receita.categoria;
      const titulo = document.createElement("h3");
      titulo.textContent = receita.nome;
      const tempo = document.createElement("small");
      tempo.className = "tempo-receita";
      tempo.textContent = "Tempo: " + receita.tempo + " minutos";

      const acoes = document.createElement("div");
      acoes.className = "acoes-card";
      const link = document.createElement("a");
      link.href = "detalhes.html?id=" + encodeURIComponent(receita.id);
      link.className = "botao";
      link.textContent = "Ver receita";
      const excluir = document.createElement("button");
      excluir.type = "button";
      excluir.className = "botao-excluir";
      excluir.textContent = "Excluir receita";

      excluir.addEventListener("click", async () => {
        if (!window.confirm("Deseja excluir esta receita?")) return;
        excluir.disabled = true;
        excluir.textContent = "Excluindo...";
        erroLista.hidden = true;
        try {
          await excluirReceita(receita.id);
          await carregarLista();
        } catch (erro) {
          erroLista.textContent = erro.message;
          erroLista.hidden = false;
          excluir.disabled = false;
          excluir.textContent = "Excluir receita";
        }
      });

      acoes.append(link, excluir);
      card.append(categoria, titulo, tempo, acoes);
      lista.appendChild(card);
    });
  }

  async function carregarLista(simularErro = false) {
    lista.replaceChildren();
    quantidade.textContent = "";
    vazio.hidden = true;
    erroLista.hidden = true;
    tentarNovamente.hidden = true;
    carregando.hidden = false;
    lista.setAttribute("aria-busy", "true");
    testarErro.disabled = true;

    try {
      receitas = await listarReceitas(simularErro);
      mostrarReceitas();
    } catch (erro) {
      erroLista.textContent = "Não foi possível carregar as receitas. " + erro.message;
      erroLista.hidden = false;
      tentarNovamente.hidden = false;
    } finally {
      carregando.hidden = true;
      lista.setAttribute("aria-busy", "false");
      testarErro.disabled = false;
    }
  }

  formBusca.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (erroLista.hidden) mostrarReceitas();
  });
  busca.addEventListener("input", () => {
    if (erroLista.hidden && carregando.hidden) mostrarReceitas();
  });
  testarErro.addEventListener("click", () => carregarLista(true));
  tentarNovamente.addEventListener("click", () => carregarLista());

  try {
    await migrarReceitasAntigas();
  } catch (erro) {
    console.warn("Não foi possível importar as receitas antigas:", erro.message);
    // A listagem funciona mesmo que a importação antiga falhe.
  }
  await carregarLista();
}
