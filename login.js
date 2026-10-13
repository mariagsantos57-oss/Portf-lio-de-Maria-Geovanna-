import { supabaseClient } from './supabase-config.js';

const formLogin = document.querySelector("form");

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
            email,
            password: senha
        });

        if (error) {
            alert("E-mail ou senha incorretos.");
            return;
        }

        localStorage.setItem("logado", "true");
        window.location.href = "portfolio.html";

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar. Tente novamente.");
    }
});

window.cancelar = function () {
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
};
