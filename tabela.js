import { supabaseClient } from './supabase-config.js';

const corpoTabela = document.getElementById('corpoTabela');

(async function () {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const { data, error } = await supabaseClient
        .from('profiles')
        .select('nome, email, created_at')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Erro ao buscar perfil:", error.message);
        return;
    }

    if (data) {
        const tr = document.createElement('tr');
        const dataFormatada = new Date(data.created_at).toLocaleDateString('pt-BR');
        tr.innerHTML = `
            <td>${data.nome || ''}</td>
            <td>${data.email || ''}</td>
            <td>${dataFormatada}</td>
        `;
        corpoTabela.appendChild(tr);
    }
})();
