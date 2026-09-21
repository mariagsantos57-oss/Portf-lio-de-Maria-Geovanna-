const formLogin = document.querySelector("form"); // ou document.getElementById("id-do-seu-form")

formLogin.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que a página recarregue

    // Captura os valores digitados
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha e-mail e senha.");
        return;
    }

    try {
        // Envia os dados para a nova rota de login do servidor
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        // Se o servidor retornar erro (ex: e-mail não encontrado ou senha incorreta)
        if (!resposta.ok) {
            alert(dados.mensagem); 
            return;
        }

        // Se deu tudo certo
        alert("Login realizado com sucesso!");
        
        // Redireciona para a página principal após o login
        window.location.href = "index.html"; 

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar ao servidor. Verifique se ele está rodando.");
    }
});
function cancelar() {
    // Redireciona para a página principal se o usuário cancelar
    window.location.href = "index.html"; 
}