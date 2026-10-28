import { supabaseClient } from "./supabase-config.js";

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
            email: email,
            password: senha,
            options: {
                data: {
                    nome: nome
                },
                emailRedirectTo:
                    "https://mariagsantos57-oss.github.io/Portf-lio-de-Maria-Geovanna-/login.html"
            }
        });

        if (error) {
            alert("Erro no cadastro: " + error.message);
            return;
        }

        if (data.session) {
            alert("Cadastro realizado com sucesso!");
        } else {
            alert("Cadastro realizado! Confira seu e-mail para confirmar a conta.");
        }

        window.location.href = "login.html";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao Supabase.");
    }
});

window.cancelar = function () {
    window.location.href = "login.html";
}