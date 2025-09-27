import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

function createSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  cachedClient = createSupabaseAdmin();
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseAdmin());
}
