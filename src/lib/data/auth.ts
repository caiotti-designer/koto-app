import { getSupabase } from '../supabaseClient';

export async function signInWithGitHub() {
  const redirectUrl = window.location.origin + '/auth/callback';
  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: redirectUrl, skipBrowserRedirect: false },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const redirectUrl = window.location.origin + '/auth/callback';
  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}
