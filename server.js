require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname)));

// ==========================================
// CONEXÃO COM O BANCO DE DADOS PostgreSQL
// ==========================================
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

pool.connect((err, client) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
        return;
    }
    console.log("Conectado ao banco de dados PostgreSQL (Supabase) com sucesso!");
    client.release();
});

// ==========================================
// ROTA DE CADASTRO
// ==========================================
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);

        const sql = "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)";
        const resultado = await pool.query(sql, [nome, email, hashSenha]);
        res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(400).json({ mensagem: "E-mail já cadastrado." });
        }
        console.error("Erro ao cadastrar:", erro.message);
        res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
    }
});

// ==========================================
// ROTA DE LOGIN
// ==========================================
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Preencha e-mail e senha." });
    }

    try {
        const sql = "SELECT * FROM usuarios WHERE email = $1";
        const resultado = await pool.query(sql, [email]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({ mensagem: "E-mail não encontrado." });
        }

        const usuario = resultado.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(400).json({ mensagem: "Senha incorreta." });
        }

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (erro) {
        console.error("Erro no login:", erro.message);
        res.status(500).json({ mensagem: "Erro no servidor ao buscar usuário." });
    }
});

// ==========================================
// ROTA PARA PÁGINAS HTML (fallback)
// ==========================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ==========================================
// INICIAR O SERVIDOR
// ==========================================
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});