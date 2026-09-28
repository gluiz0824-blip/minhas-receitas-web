// JavaScript da Etapa 04

const receitasPadrao = [
  {
    id: "bolo-cenoura",
    nome: "Bolo de cenoura",
    categoria: "Sobremesas",
    descricao: "Bolo fofinho de cenoura com cobertura simples de chocolate.",
    tempo: 50,
    fixa: true
  },
  {
    id: "macarrao-tomate",
    nome: "Macarrão ao molho de tomate",
    categoria: "Massas",
    descricao: "Uma opção prática para o almoço ou jantar do dia a dia.",
    tempo: 30,
    fixa: true
  },
  {
    id: "pao-queijo",
    nome: "Pão de queijo",
    categoria: "Lanches",
    descricao: "Receita fácil para acompanhar o café da manhã ou da tarde.",
    tempo: 40,
    fixa: true
  }
];

function carregarReceitasSalvas() {
  const dados = localStorage.getItem("receitasSalvas");

  if (dados === null) {
    return [];
  }

  try {
    return JSON.parse(dados);
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
  let todasReceitas = receitasPadrao.concat(receitasSalvas);

  function mostrarReceitas(receitas) {
    listaReceitas.innerHTML = "";
    quantidadeReceitas.textContent = receitas.length + " receita(s) encontrada(s)";

    if (receitas.length === 0) {
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

      const descricao = document.createElement("p");
      descricao.textContent = receita.descricao;

      const tempo = document.createElement("small");
      tempo.className = "tempo-receita";
      tempo.textContent = "Tempo: " + receita.tempo + " minutos";

      card.appendChild(categoria);
      card.appendChild(titulo);
      card.appendChild(descricao);
      card.appendChild(tempo);

      if (receita.fixa === true) {
        const link = document.createElement("a");
        link.href = "detalhes.html";
        link.textContent = "Ver receita";
        card.appendChild(link);
      } else {
        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "botao-excluir";
        botaoExcluir.textContent = "Excluir receita";

        botaoExcluir.addEventListener("click", function () {
          excluirReceita(receita.id);
        });

        card.appendChild(botaoExcluir);
      }

      listaReceitas.appendChild(card);
    });
  }

  function aplicarBusca() {
    const termo = campoBusca.value.trim().toLowerCase();

    const receitasFiltradas = todasReceitas.filter(function (receita) {
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

    todasReceitas = receitasPadrao.concat(receitasSalvas);
    aplicarBusca();
  }

  formBusca.addEventListener("submit", function (evento) {
    evento.preventDefault();
    aplicarBusca();
  });

  campoBusca.addEventListener("input", function () {
    aplicarBusca();
  });

  mostrarReceitas(todasReceitas);
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
      descricao: "Receita cadastrada pelo formulário.",
      tempo: Number(campoTempo.value),
      ingredientes: campoIngredientes.value,
      preparo: campoPreparo.value.trim(),
      fixa: false
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

iniciarPaginaInicial();
iniciarCadastro();
