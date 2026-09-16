const express = require('express');
const cors = require('cors');

const app = express();

// Configurações importantes
app.use(cors()); // Permite que o seu HTML (frontend) se comunique com este backend
app.use(express.json()); // Permite que o servidor entenda os dados enviados no formato JSON

// Banco de dados simulado (na memória)
const usuarios = [];

// Rota POST para "/cadastro" (O mesmo endereço que colocamos no cadastro.js)
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    
    // Verificação simples no servidor
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }

    // Verifica se o email já existe no banco de dados simulado
    const emailExiste = usuarios.find(user => user.email === email);
    if (emailExiste) {
        return res.status(400).json({ mensagem: "Este e-mail já está cadastrado!" });
    }

    // Salva o novo usuário
    const novoUsuario = { nome, email, senha };
    usuarios.push(novoUsuario);

    console.log("-------------------------------");
    console.log("NOVO CADASTRO RECEBIDO:");
    console.log(novoUsuario);
    console.log("Total de usuários cadastrados:", usuarios.length);
    console.log("-------------------------------");
    
    // Retorna sucesso para o frontend
    res.status(200).json({ mensagem: "Cadastro realizado com sucesso!" });
});

// Liga o servidor na porta 3000
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`✅ Servidor backend rodando perfeitamente em http://localhost:${PORTA}`);
    console.log(`Aguardando cadastros...`);
});