import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_KEY } from "$env/static/private";

export const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
);
