// Arquivo inicial: identifica a página e chama somente o módulo necessário.
import { iniciarLista } from "./lista.js";
import { iniciarCadastro } from "./cadastro.js";
import { iniciarDetalhes } from "./detalhes.js";

if (document.getElementById("lista-receitas")) iniciarLista();
if (document.getElementById("form-receita")) iniciarCadastro();
if (document.getElementById("conteudo-receita")) iniciarDetalhes();
