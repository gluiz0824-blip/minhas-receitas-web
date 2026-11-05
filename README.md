# Minhas Receitas Web 🍳

Projeto acadêmico de Engenharia da Computação da PUC Goiás. Caderno digital para cadastrar, buscar, consultar e excluir receitas.

## Etapa atual — Etapa 05

Nesta etapa o JavaScript foi dividido em **módulos** e o front-end passou a conversar com um **servidor simulado** usando **Fetch API** e **async/await**. O servidor utiliza Node.js sem dependências adicionais e guarda receitas em um arquivo JSON.

- Consulta assíncrona de receitas (GET).
- Cadastro enviado ao servidor (POST).
- Consulta dos detalhes (GET por ID).
- Exclusão de receitas (DELETE).
- Busca por nome ou categoria, validação do formulário e contador de ingredientes.
- Mensagens de carregamento, sucesso e erro.
- Controles para simular erros de comunicação durante a apresentação.
- Importação de receitas da Etapa 04 que ainda estejam no localStorage, **somente se a origem do navegador for a mesma**.

## Como executar

**É necessário ter o Node.js instalado. Não é necessário instalar pacotes.**

1. Baixe o repositório e abra a pasta no VS Code.
2. Abra o terminal do VS Code (Terminal > Novo Terminal).
3. Execute o comando:

~~~bash
node servidor.js
~~~

4. Abra http://localhost:8000 no navegador.
5. Deixe o terminal aberto enquanto usa o site. Para encerrar, pressione Ctrl + C.

**Não abra o HTML diretamente e não use apenas o Live Server nesta etapa.** O servidor Node.js disponibiliza as páginas e a API. O GitHub armazena o código, mas não executa esse servidor automaticamente.

## Estrutura

~~~text
index.html             # lista e busca
cadastro.html          # formulário
detalhes.html          # detalhes
css/style.css          # estilos
js/main.js             # inicia a página correta
js/api.js              # requisições HTTP com fetch
js/lista.js            # consulta, busca e exclusão
js/cadastro.js         # validação e cadastro
js/detalhes.js         # consulta por ID
servidor.js            # servidor HTTP e API simulada
dados/receitas.json    # dados persistidos pelo servidor
docs/etapa-05.md       # explicação e roteiro de apresentação
~~~

## Como apresentar ao professor

1. Inicie o servidor e abra a página inicial. Mostre **Carregando receitas do servidor...** e as três receitas de exemplo.
2. Busque por **bolo** e abra os detalhes.
3. Clique em **Simular erro na consulta** e depois em **Tentar novamente**.
4. Abra o cadastro e envie vazio para mostrar a validação.
5. Preencha corretamente, marque **Simular erro de comunicação** e tente cadastrar. O sistema mostra o erro.
6. Desmarque a opção e envie novamente. O botão muda para **Salvando...**; depois aparece o sucesso.
7. Volte ao início, encontre a receita cadastrada, veja detalhes e exclua.

## Documentação

- [Etapa 01 — Proposta](docs/proposta.md)
- [Etapa 02 — Protótipo](docs/etapa-02.md)
- [Etapa 03 — Interface](docs/etapa-03.md)
- [Etapa 04 — Interatividade](docs/etapa-04.md)
- [Etapa 05 — Modularização e comunicação assíncrona](docs/etapa-05.md)
- [Registro de testes — Etapa 05](docs/evidencias/etapa-05/testes.md)

## Tecnologias

HTML5, CSS3, JavaScript (módulos ES), Fetch API, Promises, async/await, Node.js e JSON. Sem frameworks e sem dependências externas.
