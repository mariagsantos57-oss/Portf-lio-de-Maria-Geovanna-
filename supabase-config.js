const SUPABASE_URL = "https://etptbehghrmofoaxhghp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vayhdKabenv4NTFP7ePP_g_cSe1aaZH";

export const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
