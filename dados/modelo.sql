-- Uma categoria pode ter várias receitas.
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE CHECK (length(trim(nome)) > 0)
);

CREATE TABLE IF NOT EXISTS receitas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK (length(trim(nome)) >= 3),
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    tempo REAL NOT NULL CHECK (tempo > 0),
    ingredientes TEXT NOT NULL,
    preparo TEXT NOT NULL CHECK (length(trim(preparo)) >= 10)
);
