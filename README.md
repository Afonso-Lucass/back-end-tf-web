# back-end-tf-web

Back-End do trabalho final da disciplina de WEB

## Integrantes

Ângelo Gabriel Souza e Silva <https://github.com/AngeloGSeS> Cristiane Martins Silva <https://github.com/CMSILVA4> Lucas Afonso Martins Santos <https://github.com/Afonso-Lucass> Maria Clara Veríssimo Ferreira Araújo <https://github.com/mariaclaravfa> Matheus Ruhan Costa <https://github.com/matheusruhancosta>

# API REST - E-commerce Cama, Mesa e Banho

**URL API:** <https://back-end-tf-web-main.vercel.app/>

---

## Endpoints - Produto

### [GET] /produto

**Descrição:** Retorna todos os produtos cadastrados.

**Resposta de sucesso (200):**

```json
[
  {
    "id_produto": 1,
    "nome": "Jogo de Cama Percal 400 Fios",
    "categoria": "cama, mesa e banho",
    "descricao": "Conjunto de lençóis e fronhas em percal egípcio, toque acetinado.",
    "preco": "450.99",
    "imagem": null,
    "cores": "Branco, Azul Marinho, Cinza Chumbo",
    "id_admin": 1
  }
]
```

---

### [GET] /produto/{id}

**Descrição:** Retorna um único produto pelo ID.

**Parâmetros:**

- `id` (número) - ID do produto

**Resposta de sucesso (200):**

```json
{
  "id_produto": 1,
  "nome": "Jogo de Cama Percal 400 Fios",
  "categoria": "cama, mesa e banho",
  "descricao": "Conjunto de lençóis e fronhas em percal egípcio, toque acetinado.",
  "preco": "450.99",
  "imagem": null,
  "cores": "Branco, Azul Marinho, Cinza Chumbo",
  "id_admin": 1
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Produto não encontrado"
}
```

---

### [POST] /produto

**Descrição:** Cadastra um novo produto.

**Body:**

```json
{
  "nome": "Edredom King Size Premium",
  "categoria": "cama, mesa e banho",
  "descricao": "Edredom de pluma de ganso, tamanho king",
  "preco": 890.00,
  "imagem": null,
  "cores": "Branco, Bege",
  "id_admin": 1
}
```

**Observação:** Os campos obrigatórios são: `nome`, `preco` e `id_admin`.

**Resposta de sucesso (201):**

```json
{
  "mensagem": "Produto criado com sucesso!",
  "produto": {
    "id_produto": 4,
    "nome": "Edredom King Size Premium",
    "categoria": "cama, mesa e banho",
    "descricao": "Edredom de pluma de ganso, tamanho king",
    "preco": "890.00",
    "imagem": null,
    "cores": "Branco, Bege",
    "id_admin": 1
  }
}
```

**Resposta de erro (400):**

```json
{
  "erro": "Dados inválidos",
  "mensagem": "Os campos nome, preco e id_admin são obrigatórios."
}
```

---

### [PUT] /produto/{id}

**Descrição:** Atualiza dados de um produto existente.

**Parâmetros:**

- `id` (número) - ID do produto

**Body:**

```json
{
  "nome": "Jogo de Cama Percal 400 Fios Atualizado",
  "categoria": "cama, mesa e banho",
  "descricao": "Nova descrição do produto",
  "preco": 499.99,
  "imagem": null,
  "cores": "Branco, Preto",
  "id_admin": 1
}
```

**Observação:** Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

**Resposta de sucesso (200):**

```json
{
  "mensagem": "Produto atualizado com sucesso!",
  "produto": {
    "id_produto": 1,
    "nome": "Jogo de Cama Percal 400 Fios Atualizado",
    "categoria": "cama, mesa e banho",
    "descricao": "Nova descrição do produto",
    "preco": "499.99",
    "imagem": null,
    "cores": "Branco, Preto",
    "id_admin": 1
  }
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Produto não encontrado"
}
```

---

### [DELETE] /produto/{id}

**Descrição:** Exclui um único produto.

**Parâmetros:**

- `id` (número) - ID do produto

**Resposta de sucesso (200):**

```json
{
  "mensagem": "Produto excluído com sucesso!"
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Produto não encontrado"
}
```

---

## Endpoints - Administrador

### [GET] /administrador

**Descrição:** Retorna todos os administradores cadastrados.

**Resposta de sucesso (200):**

```json
[
  {
    "id_admin": 1,
    "usuario": "gerente.sistema"
  },
  {
    "id_admin": 2,
    "usuario": "editor.conteudo"
  }
]
```

---

### [GET] /administrador/{id}

**Descrição:** Retorna um único administrador pelo ID.

**Parâmetros:**

- `id` (número) - ID do administrador

**Resposta de sucesso (200):**

```json
{
  "id_admin": 1,
  "usuario": "gerente.sistema"
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Administrador não encontrado"
}
```

---

### [POST] /administrador

**Descrição:** Cadastra um novo administrador.

**Body:**

```json
{
  "usuario": "novo.admin",
  "senha": "senha_segura_123"
}
```

**Resposta de sucesso (201):**

```json
{
  "mensagem": "Administrador criado com sucesso!",
  "administrador": {
    "id_admin": 3,
    "usuario": "novo.admin"
  }
}
```

**Resposta de erro (400):**

```json
{
  "erro": "Dados inválidos",
  "mensagem": "Os campos usuario e senha são obrigatórios."
}
```

ou

```json
{
  "erro": "Usuário já cadastrado"
}
```

---

### [PUT] /administrador/{id}

**Descrição:** Atualiza dados de um administrador existente.

**Parâmetros:**

- `id` (número) - ID do administrador

**Body:**

```json
{
  "usuario": "gerente.sistema.novo",
  "senha": "nova_senha_123"
}
```

**Observação:** Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

**Resposta de sucesso (200):**

```json
{
  "mensagem": "Administrador atualizado com sucesso!",
  "administrador": {
    "id_admin": 1,
    "usuario": "gerente.sistema.novo"
  }
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Administrador não encontrado"
}
```

**Resposta de erro (400):**

```json
{
  "erro": "Usuário já cadastrado"
}
```

---

### [DELETE] /administrador/{id}

**Descrição:** Exclui um único administrador.

**Parâmetros:**

- `id` (número) - ID do administrador

**Resposta de sucesso (200):**

```json
{
  "mensagem": "Administrador excluído com sucesso!"
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Administrador não encontrado"
}
```

---

## Endpoints - Banner Rotativo

### [GET] /banner

**Descrição:** Retorna todos os banners cadastrados.

**Resposta de sucesso (200):**

```json
[
  {
    "id_banner": 1,
    "imagens": ["base64_image_1", "base64_image_2"],
    "id_admin": 1
  }
]
```

---

### [GET] /banner/{id}

**Descrição:** Retorna um único banner pelo ID.

**Parâmetros:**

- `id` (número) - ID do banner

**Resposta de sucesso (200):**

```json
{
  "id_banner": 1,
  "imagens": ["base64_image_1", "base64_image_2"],
  "id_admin": 1
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Banner não encontrado"
}
```

---

### [POST] /banner

**Descrição:** Cadastra um novo banner.

**Body:**

```json
{
  "id_banner": 2,
  "imagens": ["base64_image_1", "base64_image_2", "base64_image_3"],
  "id_admin": 1
}
```

**Resposta de sucesso (201):**

```json
{
  "mensagem": "Banner criado com sucesso!",
  "banner": {
    "id_banner": 2,
    "imagens": ["base64_image_1", "base64_image_2", "base64_image_3"],
    "id_admin": 1
  }
}
```

**Resposta de erro (400):**

```json
{
  "erro": "Dados inválidos",
  "mensagem": "Os campos id_banner, imagens e id_admin são obrigatórios."
}
```

---

### [PUT] /banner/{id}

**Descrição:** Atualiza dados de um banner existente.

**Parâmetros:**

- `id` (número) - ID do banner

**Body:**

```json
{
  "imagens": ["nova_image_1", "nova_image_2"],
  "id_admin": 2
}
```

**Observação:** Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

**Resposta de sucesso (200):**

```json
{
  "mensagem": "Banner atualizado com sucesso!",
  "banner": {
    "id_banner": 1,
    "imagens": ["nova_image_1", "nova_image_2"],
    "id_admin": 2
  }
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Banner não encontrado"
}
```

---

### [DELETE] /banner/{id}

**Descrição:** Exclui um único banner.

**Parâmetros:**

- `id` (número) - ID do banner

**Resposta de sucesso (200):**

```json
{
  "mensagem": "Banner excluído com sucesso!"
}
```

**Resposta de erro (404):**

```json
{
  "mensagem": "Banner não encontrado"
}
```

---

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL (pg)
- dotenv
- Neon Database
