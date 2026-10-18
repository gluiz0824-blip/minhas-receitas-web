// JavaScript do Minhas Receitas Web

function carregarReceitasSalvas() {
  try {
    const dados = localStorage.getItem("receitasSalvas");

    if (dados === null) {
      return [];
    }

    const receitas = JSON.parse(dados);
    return Array.isArray(receitas) ? receitas : [];
  } catch (erro) {
    return [];
  }
}

function salvarReceitas(receitas) {
  try {
    localStorage.setItem("receitasSalvas", JSON.stringify(receitas));
    return true;
  } catch (erro) {
    return false;
  }
}

function iniciarPaginaInicial() {
  const listaReceitas = document.getElementById("lista-receitas");

  if (listaReceitas === null) {
    return;
  }

  const formBusca = document.getElementById("form-busca");
  const campoBusca = document.getElementById("busca");
  const semResultados = document.getElementById("sem-resultados");
  const quantidadeReceitas = document.getElementById("quantidade-receitas");

  let receitasSalvas = carregarReceitasSalvas();

  function mostrarReceitas(receitas) {
    listaReceitas.innerHTML = "";
    quantidadeReceitas.textContent = receitas.length + " receita(s) encontrada(s)";

    if (receitas.length === 0) {
      semResultados.textContent = campoBusca.value.trim()
        ? "Nenhuma receita corresponde à sua busca."
        : "Você ainda não cadastrou receitas. Clique em Nova receita para começar.";
      semResultados.hidden = false;
      return;
    }

    semResultados.hidden = true;

    receitas.forEach(function (receita) {
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

      card.appendChild(categoria);
      card.appendChild(titulo);
      card.appendChild(tempo);

      const acoes = document.createElement("div");
      acoes.className = "acoes-card";

      const link = document.createElement("a");
      link.href = "detalhes.html?id=" + encodeURIComponent(receita.id);
      link.className = "botao";
      link.textContent = "Ver receita";

      const botaoExcluir = document.createElement("button");
      botaoExcluir.type = "button";
      botaoExcluir.className = "botao-excluir";
      botaoExcluir.textContent = "Excluir receita";

      botaoExcluir.addEventListener("click", function () {
        excluirReceita(receita.id);
      });

      acoes.appendChild(link);
      acoes.appendChild(botaoExcluir);
      card.appendChild(acoes);

      listaReceitas.appendChild(card);
    });
  }

  function aplicarBusca() {
    const termo = campoBusca.value.trim().toLowerCase();

    const receitasFiltradas = receitasSalvas.filter(function (receita) {
      return receita.nome.toLowerCase().includes(termo) ||
        receita.categoria.toLowerCase().includes(termo);
    });

    mostrarReceitas(receitasFiltradas);
  }

  function excluirReceita(id) {
    const confirmar = window.confirm("Deseja excluir esta receita?");

    if (confirmar === false) {
      return;
    }

    receitasSalvas = receitasSalvas.filter(function (receita) {
      return receita.id !== id;
    });

    const salvou = salvarReceitas(receitasSalvas);

    if (salvou === false) {
      window.alert("Não foi possível excluir a receita.");
      return;
    }

    aplicarBusca();
  }

  formBusca.addEventListener("submit", function (evento) {
    evento.preventDefault();
    aplicarBusca();
  });

  campoBusca.addEventListener("input", function () {
    aplicarBusca();
  });

  mostrarReceitas(receitasSalvas);
}

function iniciarCadastro() {
  const formReceita = document.getElementById("form-receita");

  if (formReceita === null) {
    return;
  }

  const campoNome = document.getElementById("nome");
  const campoCategoria = document.getElementById("categoria");
  const campoTempo = document.getElementById("tempo");
  const campoIngredientes = document.getElementById("ingredientes");
  const campoPreparo = document.getElementById("preparo");
  const mensagemForm = document.getElementById("mensagem-form");
  const contadorIngredientes = document.getElementById("contador-ingredientes");

  function contarIngredientes() {
    const linhas = campoIngredientes.value.split("\n");

    const ingredientesPreenchidos = linhas.filter(function (linha) {
      return linha.trim() !== "";
    });

    contadorIngredientes.textContent = ingredientesPreenchidos.length + " ingrediente(s) informado(s)";
  }

  function validarFormulario() {
    const erros = [];
    const ingredientes = campoIngredientes.value.split("\n").filter(function (linha) {
      return linha.trim() !== "";
    });

    if (campoNome.value.trim().length < 3) {
      erros.push("O nome da receita deve ter pelo menos 3 caracteres.");
    }

    if (campoCategoria.value === "") {
      erros.push("Selecione uma categoria.");
    }

    if (Number(campoTempo.value) <= 0) {
      erros.push("O tempo de preparo deve ser maior que zero.");
    }

    if (ingredientes.length < 2) {
      erros.push("Informe pelo menos 2 ingredientes, um por linha.");
    }

    if (campoPreparo.value.trim().length < 10) {
      erros.push("Explique o modo de preparo com pelo menos 10 caracteres.");
    }

    return erros;
  }

  function mostrarMensagem(mensagens, tipo) {
    mensagemForm.innerHTML = "";
    mensagemForm.className = "mensagem " + tipo;

    const lista = document.createElement("ul");

    mensagens.forEach(function (mensagem) {
      const item = document.createElement("li");
      item.textContent = mensagem;
      lista.appendChild(item);
    });

    mensagemForm.appendChild(lista);
  }

  campoIngredientes.addEventListener("input", function () {
    contarIngredientes();
  });

  formReceita.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const erros = validarFormulario();

    if (erros.length > 0) {
      mostrarMensagem(erros, "erro");
      return;
    }

    const novaReceita = {
      id: Date.now(),
      nome: campoNome.value.trim(),
      categoria: campoCategoria.value,
      tempo: Number(campoTempo.value),
      ingredientes: campoIngredientes.value,
      preparo: campoPreparo.value.trim()
    };

    const receitasSalvas = carregarReceitasSalvas();
    receitasSalvas.push(novaReceita);

    const salvou = salvarReceitas(receitasSalvas);

    if (salvou === false) {
      mostrarMensagem(["Não foi possível salvar a receita no navegador."], "erro");
      return;
    }

    mostrarMensagem(["Receita cadastrada com sucesso! Ela já aparece na página inicial."], "sucesso");
    formReceita.reset();
    contarIngredientes();
  });

  contarIngredientes();
}

function iniciarPaginaDetalhes() {
  const conteudoReceita = document.getElementById("conteudo-receita");

  if (conteudoReceita === null) {
    return;
  }

  const mensagemErro = document.getElementById("receita-nao-encontrada");
  const id = new URLSearchParams(window.location.search).get("id");
  const receitasSalvas = carregarReceitasSalvas();

  const receita = receitasSalvas.find(function (item) {
    return item && String(item.id) === id;
  });

  if (!receita || typeof receita.ingredientes !== "string" || typeof receita.preparo !== "string") {
    mensagemErro.hidden = false;
    document.title = "Receita não encontrada | Minhas Receitas Web";
    return;
  }

  document.getElementById("detalhe-categoria").textContent = receita.categoria;
  document.getElementById("detalhe-nome").textContent = receita.nome;

  const tempo = document.getElementById("detalhe-tempo");
  tempo.textContent = receita.tempo + " minutos";
  tempo.dateTime = "PT" + receita.tempo + "M";

  const listaIngredientes = document.getElementById("detalhe-ingredientes");
  receita.ingredientes.split(/\r?\n/).forEach(function (linha) {
    const ingrediente = linha.trim();

    if (ingrediente !== "") {
      const item = document.createElement("li");
      item.textContent = ingrediente;
      listaIngredientes.appendChild(item);
    }
  });

  document.getElementById("detalhe-preparo").textContent = receita.preparo;
  document.title = receita.nome + " | Minhas Receitas Web";
  conteudoReceita.hidden = false;
}

iniciarPaginaInicial();
iniciarCadastro();
iniciarPaginaDetalhes();
