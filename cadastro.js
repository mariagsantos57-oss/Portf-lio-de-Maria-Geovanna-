import { supabaseClient } from './supabase-config.js';

const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password: senha,
            options: {
                data: {
                    nome
                }
            }
        });

        if (error) {
            if (error.message.includes("already")) {
                alert("E-mail já cadastrado.");
            } else {
                alert("Erro ao cadastrar: " + error.message);
            }
            return;
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar. Tente novamente.");
    }
});

window.cancelar = function () {
    window.location.href = "index.html";
};
