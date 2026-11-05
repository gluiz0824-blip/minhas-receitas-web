// Módulo do formulário: valida os campos e envia a receita ao servidor.
import { cadastrarReceita } from "./api.js";

export function iniciarCadastro() {
  const form = document.getElementById("form-receita");
  const nome = document.getElementById("nome");
  const categoria = document.getElementById("categoria");
  const tempo = document.getElementById("tempo");
  const ingredientes = document.getElementById("ingredientes");
  const preparo = document.getElementById("preparo");
  const contador = document.getElementById("contador-ingredientes");
  const mensagem = document.getElementById("mensagem-form");
  const botao = form.querySelector('button[type="submit"]');
  const simularErro = document.getElementById("simular-erro-cadastro");

  function contarIngredientes() {
    const linhas = ingredientes.value.split("\n").filter((linha) => linha.trim());
    contador.textContent = linhas.length + " ingrediente(s) informado(s)";
  }

  function validarFormulario() {
    const erros = [];
    if (nome.value.trim().length < 3) erros.push("O nome da receita deve ter pelo menos 3 caracteres.");
    if (!categoria.value) erros.push("Selecione uma categoria.");
    if (!tempo.value || Number(tempo.value) <= 0) erros.push("O tempo de preparo deve ser maior que zero.");
    if (ingredientes.value.split("\n").filter((linha) => linha.trim()).length < 2) {
      erros.push("Informe pelo menos 2 ingredientes, um por linha.");
    }
    if (preparo.value.trim().length < 10) {
      erros.push("Explique o modo de preparo com pelo menos 10 caracteres.");
    }
    return erros;
  }

  function mostrarMensagem(textos, tipo) {
    mensagem.replaceChildren();
    mensagem.className = "mensagem " + tipo;
    const lista = document.createElement("ul");
    textos.forEach((texto) => {
      const item = document.createElement("li");
      item.textContent = texto;
      lista.appendChild(item);
    });
    mensagem.appendChild(lista);
  }

  ingredientes.addEventListener("input", contarIngredientes);
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const erros = validarFormulario();
    if (erros.length > 0) {
      mostrarMensagem(erros, "erro");
      return;
    }

    const receita = {
      nome: nome.value.trim(),
      categoria: categoria.value,
      tempo: Number(tempo.value),
      ingredientes: ingredientes.value,
      preparo: preparo.value.trim()
    };

    botao.disabled = true;
    botao.textContent = "Salvando...";
    mostrarMensagem(["Enviando receita ao servidor..."], "carregamento");

    try {
      await cadastrarReceita(receita, simularErro.checked);
      mostrarMensagem(["Receita cadastrada com sucesso no servidor!"], "sucesso");
      form.reset();
      contarIngredientes();
    } catch (erro) {
      mostrarMensagem(["Não foi possível cadastrar a receita. " + erro.message], "erro");
    } finally {
      botao.disabled = false;
      botao.textContent = "Cadastrar receita";
    }
  });
  contarIngredientes();
}
