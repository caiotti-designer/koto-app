import supabase from './supabaseClient';

// Types
export type PromptRow = {
  id: string;
  title: string;
  content: string;
  model: string;
  tags: string[] | null;
  category: string;
  subcategory: string | null;
  cover_image: string | null;
  created_at: string;
  user_id: string | null;
};

export type ToolRow = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  favicon: string | null;
  created_at: string;
  user_id: string | null;
};

// Auth
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin + '/auth/callback'
    }
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback'
    }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthChange(cb: (user: any) => void) {
  supabase.auth.getUser().then(({ data }) => cb(data.user));
  return supabase.auth.onAuthStateChange((_event, session) => cb(session?.user ?? null));
}

// Storage: cover images
export async function uploadCover(file: File, userId: string) {
  const filePath = `${userId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('covers').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('covers').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function removeCover(publicUrl: string) {
  // Convert public URL to path: everything after /object/public/covers/
  const idx = publicUrl.indexOf('/object/public/covers/');
  if (idx === -1) return; // nothing to do
  const path = publicUrl.substring(idx + '/object/public/covers/'.length);
  await supabase.storage.from('covers').remove([path]);
}

// Prompts CRUD
export async function fetchPrompts() {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as PromptRow[];
}

export async function createPrompt(row: Partial<PromptRow> & { user_id: string }) {
  const { data, error } = await supabase.from('prompts').insert(row).select('*').single();
  if (error) throw error;
  return data as PromptRow;
}

export async function updatePrompt(id: string, patch: Partial<PromptRow>) {
  const { data, error } = await supabase.from('prompts').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as PromptRow;
}

export async function deletePrompt(id: string) {
  const { error } = await supabase.from('prompts').delete().eq('id', id);
  if (error) throw error;
}

// Tools CRUD
export async function fetchTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as ToolRow[];
}

export async function createTool(row: Partial<ToolRow> & { user_id: string }) {
  const { data, error } = await supabase.from('tools').insert(row).select('*').single();
  if (error) throw error;
  return data as ToolRow;
}

export async function updateTool(id: string, patch: Partial<ToolRow>) {
  const { data, error } = await supabase.from('tools').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as ToolRow;
}

export async function deleteTool(id: string) {
  const { error } = await supabase.from('tools').delete().eq('id', id);
  if (error) throw error;
}
