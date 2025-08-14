import { createClient } from '@supabase/supabase-js';

// Hardcoded values from .env file for direct use
const SUPABASE_URL = 'https://tpyxitnoafxlsnraofnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweXhpdG5vYWZ4bHNucmFvZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjUzODMsImV4cCI6MjA3MDcwMTM4M30.5ykhhsPCModTuZ6fYJlB3PkmO-tjrZy5RwOujP4XupE';

// Create the Supabase client with the hardcoded URL and key
let supabaseClient;
try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('[supabaseClient] Successfully created Supabase client with URL:', SUPABASE_URL);
} catch (error) {
  console.error('[supabaseClient] Error creating Supabase client:', error);
  // Provide a fallback client with hardcoded values
  supabaseClient = createClient('http://localhost:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs');
}

export const supabase = supabaseClient;

export default supabase;
