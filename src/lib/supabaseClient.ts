import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const RAW_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Normalize Supabase URL: accept full URL, domain, or just project ref and coerce to a valid URL
function normalizeSupabaseUrl(value?: string): string | undefined {
  if (!value) return undefined;
  const raw = value.trim();
  // If only a 20-char project ref is provided, build full URL
  if (/^[a-z0-9]{20}$/i.test(raw)) return `https://${raw}.supabase.co`;
  // If a bare domain is provided, prepend https
  if (/^[a-z0-9.-]+\.supabase\.co$/i.test(raw) && !/^https?:\/\//i.test(raw)) {
    return `https://${raw}`;
  }
  // If no scheme, assume https
  if (!/^https?:\/\//i.test(raw)) return `https://${raw}`;
  return raw;
}

const SUPABASE_URL = normalizeSupabaseUrl(RAW_SUPABASE_URL);

// Validate environment variables with a helpful message
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
      'VITE_SUPABASE_URL can be the full URL (https://<ref>.supabase.co), the domain (<ref>.supabase.co) or the 20‑char project ref.'
  );
}

// Create the Supabase client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const supabase = supabaseClient;

export default supabase;
