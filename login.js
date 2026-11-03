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
        const { error } = await supabaseClient.auth
            .signInWithPassword({
                email: email,
                password: senha
            });

        if (error) {
            alert("Erro ao entrar: " + error.message);
            return;
        }

        alert("Login realizado com sucesso!");
        window.location.href = "portfolio.html";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao Supabase.");
    }
});

window.cancelar = function () {
    window.location.href = "index.html";
}