import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Environment variables:', {
    VITE_SUPABASE_URL: SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? '[REDACTED]' : 'undefined'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file or Vercel environment variables.');
}

// Validate URL format
try {
  new URL(SUPABASE_URL);
} catch (error) {
  console.error('Invalid SUPABASE_URL format:', SUPABASE_URL);
  throw new Error(`Invalid SUPABASE_URL format: ${SUPABASE_URL}. Please ensure it's a valid URL (e.g., https://your-project.supabase.co)`);
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
