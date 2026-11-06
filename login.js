import { supabaseClient } from "./supabase-config.js";

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha e-mail e senha.");
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) {
            alert("Erro ao entrar: " + error.message);
            return;
        }

        if (!data.session) {
            alert("Não foi possível iniciar sua sessão.");
            return;
        }

        // Salva que o usuário realizou o login
        localStorage.setItem("logado", "true");

        alert("Login realizado com sucesso!");

        // Redireciona para o portfólio
        window.location.href = "./portfolio.html";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao Supabase.");
    }
});

// Botão cancelar
window.cancelar = function () {
    window.location.href = "index.html";
};