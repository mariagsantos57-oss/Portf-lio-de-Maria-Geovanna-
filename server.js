
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// CONEXÃO COM O SUPABASE
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000
});

// TESTAR CONEXÃO COM O BANCO
pool.query("SELECT NOW()")
    .then(() => {
        console.log("Conectado ao Supabase com sucesso!");
    })
    .catch((erro) => {
        console.error(
            "Erro ao conectar ao banco de dados:",
            erro.message
        );
    });

// ROTA DE CADASTRO
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
        `;

        await pool.query(sql, [
            nome,
            email.trim().toLowerCase(),
            hashSenha
        ]);

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!"
        });

    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(400).json({
                mensagem: "E-mail já cadastrado."
            });
        }

        console.error("Erro ao cadastrar:", erro.message);

        res.status(500).json({
            mensagem: "Erro ao cadastrar usuário."
        });
    }
});

// ROTA DE LOGIN
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "Preencha e-mail e senha."
        });
    }

    try {
        const sql = `
            SELECT id, nome, email, senha
            FROM usuarios
            WHERE LOWER(email) = LOWER($1)
        `;

        const resultado = await pool.query(sql, [
            email.trim()
        ]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({
                mensagem: "E-mail não encontrado."
            });
        }

        const usuario = resultado.rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(400).json({
                mensagem: "Senha incorreta."
            });
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

        res.status(500).json({
            mensagem: "Erro no servidor ao realizar login."
        });
    }
});

// PÁGINA INICIAL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// INICIAR SERVIDOR
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
