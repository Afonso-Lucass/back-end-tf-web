import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = process.env.PORT || 3008;
const { Pool } = pkg;
let pool = null;

app.use(express.json());

// Função para obter uma conexão com o banco de dados
function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}

// Rota raiz
app.get("/", async (req, res) => {
  const db = new Pool({
    connectionString: process.env.URL_BD,
  });

  let dbStatus = "ok";
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }
  console.log("Rota GET / solicitada");
  res.json({
    message: "API para E-commerce Cama, Mesa e Banho",
    author: "Lucas Afonso Martins Santos",
    statusBD: dbStatus
  });
});

//  ENDPOINTS PRODUTO 

// GET /produto  retorna todos os produtos
app.get("/produto", async (req, res) => {
  console.log("Rota GET /produto solicitada");
  
  try {
    const db = conectarBD();
    const resultado = await db.query("SELECT * FROM Produto ORDER BY id_produto ASC");
    res.json(resultado.rows);
  } catch (e) {
    console.error("Erro ao buscar produtos:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar os produtos"
    });
  }
});

// GET /produto/:id  retorna um produto específico
app.get("/produto/:id", async (req, res) => {
  console.log("Rota GET /produto/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    const consulta = "SELECT * FROM Produto WHERE id_produto = $1";
    const resultado = await db.query(consulta, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    
    res.json(resultado.rows[0]);
  } catch (e) {
    console.error("Erro ao buscar produto:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// POST /produto  cria um novo produto
app.post("/produto", async (req, res) => {
  console.log("Rota POST /produto solicitada");
  
  try {
    const data = req.body;
    
    // Validação dos dados recebidos
    if (!data.nome || !data.preco || !data.id_admin) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem: "Os campos nome, preco e id_admin são obrigatórios."
      });
    }
    
    const db = conectarBD();
    
    const consulta = `
      INSERT INTO Produto (nome, categoria, descricao, preco, imagem, cores, id_admin) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const produto = [
      data.nome, 
      data.categoria || null, 
      data.descricao || null, 
      data.preco, 
      data.imagem || null, 
      data.cores || null, 
      data.id_admin
    ];
    const resultado = await db.query(consulta, produto);
    
    res.status(201).json({
      mensagem: "Produto criado com sucesso!",
      produto: resultado.rows[0]
    });
  } catch (e) {
    console.error("Erro ao inserir produto:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// PUT /produto/:id  atualiza um produto
app.put("/produto/:id", async (req, res) => {
  console.log("Rota PUT /produto/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    
    let consulta = "SELECT * FROM Produto WHERE id_produto = $1";
    let resultado = await db.query(consulta, [id]);
    let produto = resultado.rows;
    
    if (produto.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    
    const data = req.body;
    
    // Usa o valor enviado ou mantém o valor atual do banco
    data.nome = data.nome || produto[0].nome;
    data.categoria = data.categoria || produto[0].categoria;
    data.descricao = data.descricao || produto[0].descricao;
    data.preco = data.preco || produto[0].preco;
    data.imagem = data.imagem || produto[0].imagem;
    data.cores = data.cores || produto[0].cores;
    data.id_admin = data.id_admin || produto[0].id_admin;
    
    consulta = `
      UPDATE Produto 
      SET nome = $1, categoria = $2, descricao = $3, preco = $4, 
          imagem = $5, cores = $6, id_admin = $7 
      WHERE id_produto = $8 RETURNING *
    `;
    resultado = await db.query(consulta, [
      data.nome, data.categoria, data.descricao, data.preco,
      data.imagem, data.cores, data.id_admin, id
    ]);
    
    res.status(200).json({
      mensagem: "Produto atualizado com sucesso!",
      produto: resultado.rows[0]
    });
  } catch (e) {
    console.error("Erro ao atualizar produto:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// DELETE /produto/:id  exclui um produto
app.delete("/produto/:id", async (req, res) => {
  console.log("Rota DELETE /produto/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    
    let consulta = "SELECT * FROM Produto WHERE id_produto = $1";
    let resultado = await db.query(consulta, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    
    consulta = "DELETE FROM Produto WHERE id_produto = $1";
    await db.query(consulta, [id]);
    
    res.status(200).json({ mensagem: "Produto excluído com sucesso!" });
  } catch (e) {
    console.error("Erro ao excluir produto:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

//  ENDPOINTS ADMINISTRADOR 

// GET /administrador  retorna todos os administradores
app.get("/administrador", async (req, res) => {
  console.log("Rota GET /administrador solicitada");
  
  try {
    const db = conectarBD();
    const resultado = await db.query("SELECT id_admin, usuario FROM Administrador ORDER BY id_admin ASC");
    res.json(resultado.rows);
  } catch (e) {
    console.error("Erro ao buscar administradores:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar os administradores"
    });
  }
});

// GET /administrador/:id  retorna um administrador específico
app.get("/administrador/:id", async (req, res) => {
  console.log("Rota GET /administrador/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    const consulta = "SELECT id_admin, usuario FROM Administrador WHERE id_admin = $1";
    const resultado = await db.query(consulta, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Administrador não encontrado" });
    }
    
    res.json(resultado.rows[0]);
  } catch (e) {
    console.error("Erro ao buscar administrador:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// POST /administrador  cria um novo administrador
app.post("/administrador", async (req, res) => {
  console.log("Rota POST /administrador solicitada");
  
  try {
    const data = req.body;
    
    // Validação dos dados recebidos
    if (!data.usuario || !data.senha) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem: "Os campos usuario e senha são obrigatórios."
      });
    }
    
    const db = conectarBD();
    
    // Verifica se usuário já existe
    const verificaUsuario = await db.query("SELECT * FROM Administrador WHERE usuario = $1", [data.usuario]);
    if (verificaUsuario.rows.length > 0) {
      return res.status(400).json({ erro: "Usuário já cadastrado" });
    }
    
    const consulta = "INSERT INTO Administrador (usuario, senha) VALUES ($1, $2) RETURNING id_admin, usuario";
    const administrador = [data.usuario, data.senha];
    const resultado = await db.query(consulta, administrador);
    
    res.status(201).json({
      mensagem: "Administrador criado com sucesso!",
      administrador: resultado.rows[0]
    });
  } catch (e) {
    console.error("Erro ao inserir administrador:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// PUT /administrador/:id  atualiza um administrador
app.put("/administrador/:id", async (req, res) => {
  console.log("Rota PUT /administrador/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    
    let consulta = "SELECT * FROM Administrador WHERE id_admin = $1";
    let resultado = await db.query(consulta, [id]);
    let administrador = resultado.rows;
    
    if (administrador.length === 0) {
      return res.status(404).json({ mensagem: "Administrador não encontrado" });
    }
    
    const data = req.body;
    
    // Verifica se usuário já está sendo usado por outro admin
    if (data.usuario) {
      const verificaUsuario = await db.query(
        "SELECT * FROM Administrador WHERE usuario = $1 AND id_admin != $2",
        [data.usuario, id]
      );
      if (verificaUsuario.rows.length > 0) {
        return res.status(400).json({ erro: "Usuário já cadastrado" });
      }
    }
    
    // Usa o valor enviado ou mantém o valor atual do banco
    data.usuario = data.usuario || administrador[0].usuario;
    data.senha = data.senha || administrador[0].senha;
    
    consulta = "UPDATE Administrador SET usuario = $1, senha = $2 WHERE id_admin = $3 RETURNING id_admin, usuario";
    resultado = await db.query(consulta, [data.usuario, data.senha, id]);
    
    res.status(200).json({
      mensagem: "Administrador atualizado com sucesso!",
      administrador: resultado.rows[0]
    });
  } catch (e) {
    console.error("Erro ao atualizar administrador:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// DELETE /administrador/:id  exclui um administrador
app.delete("/administrador/:id", async (req, res) => {
  console.log("Rota DELETE /administrador/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    
    let consulta = "SELECT * FROM Administrador WHERE id_admin = $1";
    let resultado = await db.query(consulta, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Administrador não encontrado" });
    }
    
    consulta = "DELETE FROM Administrador WHERE id_admin = $1";
    await db.query(consulta, [id]);
    
    res.status(200).json({ mensagem: "Administrador excluído com sucesso!" });
  } catch (e) {
    console.error("Erro ao excluir administrador:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

//  ENDPOINTS BANNER_ROTATIVO 

// GET /banner  retorna todos os banners
app.get("/banner", async (req, res) => {
  console.log("Rota GET /banner solicitada");
  
  try {
    const db = conectarBD();
    const resultado = await db.query("SELECT * FROM BannerRotativo ORDER BY id_banner ASC");
    res.json(resultado.rows);
  } catch (e) {
    console.error("Erro ao buscar banners:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar os banners"
    });
  }
});

// GET /banner/:id  retorna um banner específico
app.get("/banner/:id", async (req, res) => {
  console.log("Rota GET /banner/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    const consulta = "SELECT * FROM BannerRotativo WHERE id_banner = $1";
    const resultado = await db.query(consulta, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Banner não encontrado" });
    }
    
    res.json(resultado.rows[0]);
  } catch (e) {
    console.error("Erro ao buscar banner:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// POST /banner  cria um novo banner
app.post("/banner", async (req, res) => {
  console.log("Rota POST /banner solicitada");
  
  try {
    const data = req.body;
    
    // Validação dos dados recebidos
    if (!data.id_banner || !data.imagens || !data.id_admin) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem: "Os campos id_banner, imagens e id_admin são obrigatórios."
      });
    }
    
    const db = conectarBD();
    
    const consulta = "INSERT INTO BannerRotativo (id_banner, imagens, id_admin) VALUES ($1, $2, $3) RETURNING *";
    const banner = [data.id_banner, data.imagens, data.id_admin];
    const resultado = await db.query(consulta, banner);
    
    res.status(201).json({
      mensagem: "Banner criado com sucesso!",
      banner: resultado.rows[0]
    });
  } catch (e) {
    console.error("Erro ao inserir banner:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// PUT /banner/:id  atualiza um banner
app.put("/banner/:id", async (req, res) => {
  console.log("Rota PUT /banner/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    
    let consulta = "SELECT * FROM BannerRotativo WHERE id_banner = $1";
    let resultado = await db.query(consulta, [id]);
    let banner = resultado.rows;
    
    if (banner.length === 0) {
      return res.status(404).json({ mensagem: "Banner não encontrado" });
    }
    
    const data = req.body;
    
    // Usa o valor enviado ou mantém o valor atual do banco
    data.imagens = data.imagens || banner[0].imagens;
    data.id_admin = data.id_admin || banner[0].id_admin;
    
    consulta = "UPDATE BannerRotativo SET imagens = $1, id_admin = $2 WHERE id_banner = $3 RETURNING *";
    resultado = await db.query(consulta, [data.imagens, data.id_admin, id]);
    
    res.status(200).json({
      mensagem: "Banner atualizado com sucesso!",
      banner: resultado.rows[0]
    });
  } catch (e) {
    console.error("Erro ao atualizar banner:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// DELETE /banner/:id  exclui um banner
app.delete("/banner/:id", async (req, res) => {
  console.log("Rota DELETE /banner/:id solicitada");
  
  try {
    const id = req.params.id;
    const db = conectarBD();
    
    let consulta = "SELECT * FROM BannerRotativo WHERE id_banner = $1";
    let resultado = await db.query(consulta, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Banner não encontrado" });
    }
    
    consulta = "DELETE FROM BannerRotativo WHERE id_banner = $1";
    await db.query(consulta, [id]);
    
    res.status(200).json({ mensagem: "Banner excluído com sucesso!" });
  } catch (e) {
    console.error("Erro ao excluir banner:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.listen(port, () => {
  console.log(`Serviço rodando na porta: ${port}`);
});