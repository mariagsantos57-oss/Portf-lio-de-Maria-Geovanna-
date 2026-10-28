import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://etptbehghrmofoaxhghp.supabase.co";
const supabasePublishableKey = "sb_publishable_vayhdKabenv4NTFP7ePP_g_cSe1aaZH";

export const supabaseClient = createClient(
    supabaseUrl,
    supabasePublishableKey
);