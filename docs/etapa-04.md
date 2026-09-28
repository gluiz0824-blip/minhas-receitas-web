# Etapa 04 — Interatividade com JavaScript

## Objetivo
Nesta etapa foi adicionado JavaScript ao projeto para deixar as páginas interativas. O código foi mantido simples e está concentrado no arquivo `js/script.js`.

## Funcionalidades implementadas

### 1. Busca de receitas
Na página inicial, o usuário pode digitar o nome ou a categoria de uma receita no campo de busca.

A lista é atualizada enquanto o usuário digita. Para isso, o JavaScript usa o evento `input`, o método `filter()` e manipulação do DOM.

**Arquivos envolvidos:**
- `index.html`
- `js/script.js`

### 2. Cadastro e validação de receita
O formulário de cadastro é validado pelo JavaScript antes de salvar a receita.

Foram criadas as seguintes regras:
- nome com pelo menos 3 caracteres;
- categoria obrigatória;
- tempo de preparo maior que zero;
- pelo menos 2 ingredientes;
- modo de preparo com pelo menos 10 caracteres.

Se existir algum problema, a página mostra as mensagens de erro sem recarregar. Se os dados estiverem corretos, a receita é salva no navegador e uma mensagem de sucesso é exibida.

**Arquivos envolvidos:**
- `cadastro.html`
- `js/script.js`
- `css/style.css`

### 3. Lista dinâmica de receitas
As receitas fixas ficam em um array no JavaScript. As receitas criadas pelo usuário são guardadas no `localStorage`.

Na página inicial, os dois grupos são unidos e os cards são criados pelo JavaScript usando `createElement()`, `appendChild()` e `forEach()`.

**Arquivos envolvidos:**
- `index.html`
- `js/script.js`

### 4. Exclusão de receita cadastrada
As receitas adicionadas pelo usuário recebem um botão **Excluir receita**. Antes da exclusão, o sistema pede uma confirmação. Se o usuário cancelar, nada é apagado.

Depois da exclusão, o array salvo é atualizado e a interface é renderizada novamente.

**Arquivos envolvidos:**
- `index.html`
- `js/script.js`

### 5. Contador de ingredientes
Enquanto o usuário digita os ingredientes, o sistema conta quantas linhas preenchidas existem e atualiza o texto abaixo do campo.

**Arquivos envolvidos:**
- `cadastro.html`
- `js/script.js`

## Principais conceitos de programação utilizados
- variáveis com `const` e `let`;
- funções;
- arrays;
- objetos;
- `forEach()`;
- `filter()`;
- eventos com `addEventListener()`;
- manipulação do DOM;
- estruturas condicionais com `if`;
- `localStorage`;
- `JSON.stringify()` e `JSON.parse()`.

## Validações implementadas
O formulário não aceita nome muito curto, categoria vazia, tempo igual ou menor que zero, menos de dois ingredientes ou modo de preparo muito curto.

Os erros são colocados em um array e mostrados de uma vez para o usuário.

## Situações inválidas tratadas
- formulário preenchido de forma incorreta;
- busca sem resultados;
- tentativa de excluir uma receita cancelada pelo usuário;
- erro ao ler dados inválidos do `localStorage`;
- erro ao salvar ou excluir dados no `localStorage`.

## Matriz de evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
|---|---|---|---|
| Manipulação do DOM | Criação dos cards e mensagens | `js/script.js`, `index.html`, `cadastro.html` | Funções `mostrarReceitas()` e `mostrarMensagem()` |
| Tratamento de eventos | Busca, envio do formulário e contador | `js/script.js` | Eventos `submit`, `input` e `click` |
| Validação de formulários | Cadastro de receita | `js/script.js` | Função `validarFormulario()` |
| Alteração dinâmica da interface | Atualização da lista, contador e mensagens | `js/script.js` | Elementos são atualizados sem recarregar a página |
| Uso de funções | Todas as funcionalidades | `js/script.js` | Funções de carregar, salvar, buscar, validar e renderizar |
| Uso de arrays | Receitas e lista de erros | `js/script.js` | `receitasPadrao`, receitas salvas e `erros` |
| Métodos de iteração | Renderização e filtragem | `js/script.js` | Uso de `forEach()` e `filter()` |
| Tratamento de situações inválidas | Formulário, busca, exclusão e armazenamento | `js/script.js` | Mensagens de erro, lista vazia, confirmação e `try/catch` |

## Evidências do funcionamento
Foi criado um registro de testes com os resultados observados em cada funcionalidade:

`docs/evidencias/etapa-04/testes.md`

O registro cobre a listagem dinâmica, busca, validações, contador de ingredientes, cadastro e exclusão de receita.

## Como testar
1. Inicie o projeto com Live Server ou com `python -m http.server 8000`.
2. Abra `index.html` e digite `bolo` na busca. Somente a receita correspondente deve aparecer.
3. Abra `cadastro.html` e clique em **Cadastrar receita** sem preencher corretamente. As mensagens de erro devem aparecer.
4. Preencha o formulário com dados válidos. Deve aparecer uma mensagem de sucesso.
5. Volte para a página inicial. A nova receita deve aparecer junto das receitas padrão.
6. Clique em **Excluir receita** no card criado e confirme a exclusão. O card deve desaparecer.

## Tag de entrega
A versão da entrega deve ser identificada pela tag:

`etapa-04`
