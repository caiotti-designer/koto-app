import supabase from './supabaseClient';

// Types
export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  profile_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptRow {
  id: string;
  title: string;
  content: string;
  model: string;
  tags: string[];
  category: string;
  subcategory?: string;
  cover_image?: string;
  user_id: string;
  is_public: boolean;
  share_token?: string;
  created_at: string;
  updated_at: string;
}

export interface ToolRow {
  id: string;
  name: string;
  url: string;
  description?: string;
  category?: string;
  favicon?: string;
  user_id: string;
  is_public: boolean;
  share_token?: string;
  created_at: string;
  updated_at: string;
}

// Auth
export async function signInWithGitHub() {
  const redirectUrl = window.location.origin + '/auth/callback';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl,
      flowType: 'pkce',
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signInWithGoogle() {
  const redirectUrl = window.location.origin + '/auth/callback';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      flowType: 'pkce',
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthChange(cb: (user: any) => void) {
  // Get current user immediately
  supabase.auth.getUser().then(({ data, error }) => {
    cb(data.user);
  });
  
  // Listen for auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    cb(session?.user ?? null);
  });
  
  return { data: { subscription } };
}

// Storage: cover images
export async function uploadCover(file: File, userId?: string) {
  const userFolder = userId || 'anonymous';
  const filePath = `${userFolder}/${Date.now()}_${file.name}`;
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
export async function fetchPrompts(userId?: string): Promise<PromptRow[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }

  return data || [];
}

export async function createPrompt(prompt: Omit<PromptRow, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_public' | 'share_token'>, userId: string): Promise<PromptRow | null> {
  const { data, error } = await supabase
    .from('prompts')
    .insert([{
      ...prompt,
      user_id: userId,
      is_public: false
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating prompt:', error);
    return null;
  }

  return data;
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
export async function fetchTools(userId?: string): Promise<ToolRow[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tools:', error);
    return [];
  }

  return data || [];
}

export async function createTool(tool: Omit<ToolRow, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_public' | 'share_token'>, userId: string): Promise<ToolRow | null> {
  const { data, error } = await supabase
    .from('tools')
    .insert([{
      ...tool,
      user_id: userId,
      is_public: false
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating tool:', error);
    return null;
  }

  return data;
}

export async function updateTool(id: string, patch: Partial<ToolRow>) {
  const { data, error } = await supabase.from('tools').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as ToolRow;
}

export async function deleteTool(id: string): Promise<void> {
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}

// User Profile CRUD
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

// Sharing Functions
export async function generateShareToken(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_share_token');
  
  if (error) {
    console.error('Error generating share token:', error);
    throw error;
  }
  
  return data;
}

export async function sharePrompt(promptId: string): Promise<string | null> {
  try {
    const shareToken = await generateShareToken();
    
    const { error } = await supabase
      .from('prompts')
      .update({ share_token: shareToken })
      .eq('id', promptId);

    if (error) {
      console.error('Error sharing prompt:', error);
      return null;
    }

    return shareToken;
  } catch (error) {
    console.error('Error in sharePrompt:', error);
    return null;
  }
}

export async function shareTool(toolId: string): Promise<string | null> {
  try {
    const shareToken = await generateShareToken();
    
    const { error } = await supabase
      .from('tools')
      .update({ share_token: shareToken })
      .eq('id', toolId);

    if (error) {
      console.error('Error sharing tool:', error);
      return null;
    }

    return shareToken;
  } catch (error) {
    console.error('Error in shareTool:', error);
    return null;
  }
}

export async function fetchSharedPrompt(shareToken: string): Promise<PromptRow | null> {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('share_token', shareToken)
    .single();

  if (error) {
    console.error('Error fetching shared prompt:', error);
    return null;
  }

  return data;
}

export async function fetchSharedTool(shareToken: string): Promise<ToolRow | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('share_token', shareToken)
    .single();

  if (error) {
    console.error('Error fetching shared tool:', error);
    return null;
  }

  return data;
}

export async function fetchPublicProfile(username: string): Promise<{ profile: UserProfile; prompts: PromptRow[]; tools: ToolRow[] } | null> {
  // First get the user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .eq('profile_public', true)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching public profile:', profileError);
    return null;
  }

  // Get public prompts
  const { data: prompts, error: promptsError } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  // Get public tools
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (promptsError || toolsError) {
    console.error('Error fetching public content:', promptsError || toolsError);
    return null;
  }

  return {
    profile,
    prompts: prompts || [],
    tools: tools || []
  };
}
