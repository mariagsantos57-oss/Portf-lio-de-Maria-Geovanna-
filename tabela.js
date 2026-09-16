// Seleciona o corpo da tabela no HTML
const corpoTabela = document.getElementById('corpoTabela');

// Busca os usuários no banco de dados local (localStorage)
const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Para cada usuário cadastrado, cria uma linha na tabela
usuarios.forEach(function(usuario) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td>${usuario.nome}</td>
        <td>${usuario.login}</td>
        <td>${usuario.email}</td>
        <td>${usuario.senha}</td>
    `;
    
    // Adiciona a linha na tabela
    corpoTabela.appendChild(tr);
});