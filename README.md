# Poções & Soluções

Loja virtual de poções desenvolvida para a disciplina `SCC0219 - Introdução ao Desenvolvimento Web`.

- Letícia Raddatz Jönck - NUSP 14589066


## Tecnologias

- Node.js
- Express
- Sequelize
- SQLite
- HTML
- CSS
- JavaScript

## Como executar

```bash
npm install
npm start
```

Depois, acesse:

- Loja pública: `http://localhost:3000`
- Carrinho: `http://localhost:3000/carrinho`
- Administração: `http://localhost:3000/admin`

## Funcionalidades

### Loja pública

- Exibe a identidade da loja e a história de Anabelle Merigold
- Mostra o catálogo de poções disponível
- Permite adicionar e remover itens do carrinho

### Carrinho

- Lista os itens adicionados
- Exibe quantidade e valor total
- Permite remover itens individualmente

### Administração

- Cadastra novas poções
- Lista as poções cadastradas
- Remove poções do catálogo
- Aceita imagem por URL no formulário de cadastro

## Banco de dados

O projeto utiliza SQLite em memória com Sequelize.

Isso significa que os dados são reiniciados sempre que o servidor é encerrad e ao subir a aplicação, o banco é recriado com as poções iniciais.

Configuração atual:

```js
{
  dialect: "sqlite",
  storage: ":memory:"
}
```

## Estrutura principal

```text
public/
  assets/
  css/
  js/
  index.html
  cart.html
  admin.html

src/
  app.js
  server.js
  database.js
  potionController.js
  models/
  seed/
```

## Scripts disponíveis

```bash
npm start
```

Inicia o servidor.

```bash
npm run dev
```

Inicia o servidor em modo watch.

