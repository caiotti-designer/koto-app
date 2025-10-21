import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase env. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    throw new Error('Supabase not configured');
  }
  try {
    // Validate URL once
    new URL(SUPABASE_URL);
  } catch {
    console.error('Invalid VITE_SUPABASE_URL:', SUPABASE_URL);
    throw new Error('Invalid Supabase URL');
  }

  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}

// Back-compat: named export alias
export const supabase = undefined as unknown as SupabaseClient;

export default undefined as unknown as SupabaseClient;
