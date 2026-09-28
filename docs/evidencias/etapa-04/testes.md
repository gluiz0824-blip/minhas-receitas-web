# Registro de testes — Etapa 04

Este arquivo registra os testes realizados nas funcionalidades JavaScript da Etapa 04.

| Teste | Ação realizada | Resultado observado |
|---|---|---|
| Listagem inicial | Abrir a página inicial | Foram exibidas 3 receitas padrão e o texto `3 receita(s) encontrada(s)` |
| Busca | Digitar `bolo` no campo de busca | A lista foi filtrada e ficou apenas o card **Bolo de cenoura** |
| Validação | Enviar o formulário vazio | Foram exibidas 5 mensagens de erro, sem recarregar a página |
| Contador | Informar 3 ingredientes em linhas diferentes | O contador mudou para `3 ingrediente(s) informado(s)` |
| Cadastro válido | Preencher todos os campos corretamente e enviar | Foi exibida a mensagem `Receita cadastrada com sucesso!` |
| Atualização da lista | Voltar para a página inicial depois do cadastro | A nova receita apareceu e a lista passou de 3 para 4 cards |
| Exclusão | Clicar em `Excluir receita` e confirmar | O card cadastrado foi removido e a lista voltou para 3 cards |

## Entradas usadas no teste de cadastro
- Nome: `Omelete simples`
- Categoria: `Lanches`
- Tempo: `15` minutos
- Ingredientes: 3 linhas preenchidas
- Modo de preparo: texto com mais de 10 caracteres

## Situações inválidas verificadas
- nome com menos de 3 caracteres;
- categoria não selecionada;
- tempo igual ou menor que zero;
- menos de 2 ingredientes;
- modo de preparo com menos de 10 caracteres;
- busca sem resultado;
- cancelamento da confirmação de exclusão;
- dados inválidos no `localStorage`, tratados com `try/catch`.
