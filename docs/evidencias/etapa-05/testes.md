# Registro de testes — Etapa 05

## Testes executados na API local

Foi iniciado o servidor Node.js e foram realizadas requisições HTTP locais.

| Teste | Requisição | Resultado verificado |
| --- | --- | --- |
| Listar receitas | GET /api/receitas | HTTP 200 e três receitas iniciais |
| Erro simulado | GET /api/receitas?simularErro=1 | HTTP 503 e mensagem de erro |
| Cadastro inválido | POST /api/receitas com dados incompletos | HTTP 400 e mensagem de validação |
| Cadastro correto | POST /api/receitas com dados válidos | HTTP 201 e ID gerado |
| Consultar detalhes | GET /api/receitas/:id | HTTP 200 com dados da receita |
| Excluir receita | DELETE /api/receitas/:id | HTTP 200 e confirmação |
| Consultar excluída | GET /api/receitas/:id | HTTP 404 |
| Persistência | Conferir o arquivo JSON após cadastro e exclusão | Arquivo reflete as operações |

**Observação:** estes são testes da API; a verificação visual da interface está organizada como checklist para execução manual.

## Checklist de demonstração da interface

- [ ] Abrir http://localhost:8000 e observar Carregando receitas do servidor.
- [ ] Ver três receitas e filtrar por bolo.
- [ ] Clicar em Simular erro na consulta e verificar a mensagem.
- [ ] Clicar em Tentar novamente para recuperar a lista.
- [ ] Enviar o formulário vazio e verificar as mensagens de validação.
- [ ] Preencher corretamente e marcar Simular erro de comunicação: a submissão falha.
- [ ] Desmarcar e enviar: ver Salvando e depois sucesso.
- [ ] Voltar à lista, abrir os detalhes, excluir e confirmar.
- [ ] Atualizar a página e verificar a persistência.

## Exemplo de requisição POST

~~~json
{
  "nome": "Omelete simples",
  "categoria": "Lanches",
  "tempo": 15,
  "ingredientes": "2 ovos\nSal a gosto",
  "preparo": "Misture os ovos e prepare na frigideira."
}
~~~

## Arquivos para mostrar ao professor

- js/api.js: fetch, await e throw new Error.
- js/cadastro.js: validação e try/catch/finally.
- js/lista.js: consulta, carregamento e renderização.
- servidor.js: rotas que recebem GET, POST e DELETE.
- dados/receitas.json: conteúdo antes e depois do cadastro.
