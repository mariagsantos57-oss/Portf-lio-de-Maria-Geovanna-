import { supabaseClient } from './supabase-config.js';

(async function () {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = "login.html";
    }
})();
