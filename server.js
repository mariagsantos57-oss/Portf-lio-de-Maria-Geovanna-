const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();

// Middlewares: Permitem conexão do frontend e uso de JSON
app.use(cors());
app.use(express.json());

// 1. CRIAÇÃO E CONEXÃO COM O BANCO DE DADOS
const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite com sucesso!");
    }
});

// 2. CRIAÇÃO DA TABELA DE USUÁRIOS
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
    )`);
});

// ==========================================
// 3. ROTA DE CADASTRO
// ==========================================
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." });
    }

    try {
        // Criptografa a senha antes de salvar no banco
        const hashSenha = await bcrypt.hash(senha, 10);
        
        const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
        db.run(sql, [nome, email, hashSenha], function(erro) {
            if (erro) {
                // Se der erro de UNIQUE, significa que o e-mail já existe
                return res.status(400).json({ mensagem: "E-mail já cadastrado." });
            }
            res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro interno no servidor ao cadastrar." });
    }
});

// ==========================================
// 4. ROTA DE LOGIN
// ==========================================
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Preencha e-mail e senha." });
    }

    // Busca o usuário pelo e-mail no banco de dados
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(sql, [email], async (erro, usuario) => {
        if (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor ao buscar usuário." });
        }

        // Se o usuário não existir no banco
        if (!usuario) {
            return res.status(400).json({ mensagem: "E-mail não encontrado." });
        }

        try {
            // Compara a senha digitada com a senha criptografada armazenada
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(400).json({ mensagem: "Senha incorreta." });
            }

            // Login bem-sucedido
            res.status(200).json({ 
                mensagem: "Login realizado com sucesso!",
                usuario: { 
                    id: usuario.id, 
                    nome: usuario.nome, 
                    email: usuario.email 
                }
            });
        } catch (erro) {
            res.status(500).json({ mensagem: "Erro ao validar a senha." });
        }
    });
});

// ==========================================
// 5. INICIAR O SERVIDOR
// ==========================================
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});