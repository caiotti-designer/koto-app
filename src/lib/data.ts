import { getSupabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

// Types
export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  profile_public: boolean;
  created_at: string;
  // updated_at: string; // Commented out as this column may not exist in current database
}

export interface PromptRow {
  id: string;
  title: string;
  content: string;
  model: string;
  tags: string[];
  category: string;
  subcategory?: string | null;
  cover_image?: string;
  user_id: string;
  is_public: boolean;
  share_token?: string;
  created_at: string;
  // updated_at: string; // Commented out as this column may not exist in current database
}

export interface ToolRow {
  id: string;
  name: string;
  url: string;
  description?: string;
  category?: string;
  subcategory?: string | null;
  favicon?: string;
  user_id: string;
  is_public: boolean;
  share_token?: string;
  created_at: string;
  // updated_at: string; // Commented out as this column may not exist in current database
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  type: 'prompt' | 'tool';
  user_id: string;
  created_at: string;
  updated_at: string;
  // Optional ordering column; may not exist in all deployments yet
  sort_order?: number | null;
}

export interface SubcategoryRow {
  id: string;
  name: string;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  sort_order?: number | null;
}

// Auth
export async function signInWithGitHub() {
  const redirectUrl = window.location.origin + '/auth/callback';
  
  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: false,
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signInWithGoogle() {
  const redirectUrl = window.location.origin + '/auth/callback';
  
  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      // Remove flowType as it's not a valid option in the type definition
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export function onAuthChange(cb: (user: User | null) => void) {
  // Get current user immediately
  getSupabase().auth.getUser().then(({ data, error }) => {
    cb(data.user);
  });
  
  // Listen for auth state changes
  const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
    cb(session?.user ?? null);
  });
  
  return { data: { subscription } };
}

// Storage: cover images
export async function uploadCover(file: File, userId?: string) {
  const userFolder = userId || 'anonymous';
  const filePath = `${userFolder}/${Date.now()}_${file.name}`;
  const { error } = await getSupabase().storage.from('covers').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = getSupabase().storage.from('covers').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function removeCover(publicUrl: string) {
  // Convert public URL to path: everything after /object/public/covers/
  const idx = publicUrl.indexOf('/object/public/covers/');
  if (idx === -1) return; // nothing to do
  const path = publicUrl.substring(idx + '/object/public/covers/'.length);
  await getSupabase().storage.from('covers').remove([path]);
}

// Storage: avatar images
export async function uploadAvatar(file: File, userId: string) {
  const filePath = `${userId}/avatar_${Date.now()}_${file.name}`;
  
  const { error } = await getSupabase().storage.from('avatars').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
  
  const { data } = getSupabase().storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function removeAvatar(publicUrl: string) {
  // Convert public URL to path: everything after /object/public/avatars/
  const idx = publicUrl.indexOf('/object/public/avatars/');
  if (idx === -1) return; // nothing to do
  const path = publicUrl.substring(idx + '/object/public/avatars/'.length);
  await getSupabase().storage.from('avatars').remove([path]);
}

// Public profile helpers
export async function fetchPublicUserByUsername(username: string): Promise<UserProfile | null> {
  const { data: profile, error } = await getSupabase()
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .eq('profile_public', true)
    .single();

  if (error) {
    console.error('Error fetching public user by username:', error);
    return null;
  }
  return profile as UserProfile;
}

export async function countPublicPrompts(userId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_public', true);
  if (error) {
    console.error('Error counting public prompts:', error);
    return 0;
  }
  return count || 0;
}

export async function countPublicTools(userId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from('tools')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_public', true);
  if (error) {
    console.error('Error counting public tools:', error);
    return 0;
  }
  return count || 0;
}

export async function fetchPublicPrompts(
  userId: string,
  opts: { from: number; to: number; sort?: 'created_desc' | 'title_asc' }
): Promise<PromptRow[]> {
  let query = getSupabase()
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true);
  if (opts?.sort === 'title_asc') {
    query = query.order('title', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }
  const { data, error } = await query.range(opts.from, opts.to);
  if (error) {
    console.error('Error fetching public prompts:', error);
    return [];
  }
  return (data || []) as PromptRow[];
}

export async function fetchPublicTools(
  userId: string,
  opts: { from: number; to: number; sort?: 'created_desc' | 'title_asc' }
): Promise<ToolRow[]> {
  let query = getSupabase()
    .from('tools')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true);
  if (opts?.sort === 'title_asc') {
    query = query.order('name', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }
  const { data, error } = await query.range(opts.from, opts.to);
  if (error) {
    console.error('Error fetching public tools:', error);
    return [];
  }
  return (data || []) as ToolRow[];
}

// Public categories via view (preferred). Falls back to base table if view not present/policy allows.
export async function fetchPublicCategories(userId: string, type: 'prompt' | 'tool'): Promise<CategoryRow[]> {
  // Try view first
  let { data, error } = await getSupabase()
    .from('public_categories' as any)
    .select('*')
    .eq('user_id', userId)
    .eq('type', type);
  if (error) {
    console.warn('public_categories view not available, fallback to categories with RLS:', error?.message);
    const res = await getSupabase()
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type);
    data = res.data as any;
  }
  return (data || []) as any;
}
// Prompts CRUD
export async function fetchPrompts(userId?: string): Promise<PromptRow[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await getSupabase()
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

export async function createPrompt(prompt: Omit<PromptRow, 'id' | 'created_at' | 'user_id' | 'is_public' | 'share_token'>, userId: string): Promise<PromptRow | null> {
  const { data, error } = await getSupabase()
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
  // Remove updated_at from patch if it exists, as the database might not have this column
const cleanPatch = { ...patch } as any;
if ('updated_at' in cleanPatch) delete cleanPatch.updated_at;
  const { data, error } = await getSupabase().from('prompts').update(cleanPatch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as PromptRow;
}

export async function deletePrompt(id: string) {
  const { error } = await getSupabase().from('prompts').delete().eq('id', id);
  if (error) throw error;
}

// Tools CRUD
export async function fetchTools(userId?: string): Promise<ToolRow[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await getSupabase()
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

export async function createTool(tool: Omit<ToolRow, 'id' | 'created_at' | 'user_id' | 'is_public' | 'share_token'>, userId: string): Promise<ToolRow | null> {
  const { data, error } = await getSupabase()
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
  // Remove updated_at from patch if it exists, as the database might not have this column
const cleanPatch = { ...patch } as any;
if ('updated_at' in cleanPatch) delete cleanPatch.updated_at;
  const { data, error } = await getSupabase().from('tools').update(cleanPatch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as ToolRow;
}

export async function deleteTool(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}

// Categories CRUD
export async function fetchCategories(userId: string, type?: 'prompt' | 'tool'): Promise<CategoryRow[]> {
  if (!userId) {
    return [];
  }

  const buildQuery = () => {
    let base = getSupabase()
      .from('categories')
      .select('*')
      .eq('user_id', userId);
    if (type) {
      base = base.eq('type', type);
    }
    return base;
  };

  const { data, error } = await buildQuery()
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) {
    const message = (error.message || '').toLowerCase();
    if (message.includes('sort_order')) {
      const { data: fallbackData, error: fallbackError } = await buildQuery()
        .order('created_at', { ascending: true });
      if (fallbackError) {
        console.error('Error fetching categories:', fallbackError);
        return [];
      }
      return fallbackData || [];
    }
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function createCategory(category: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<CategoryRow | null> {
  const { data, error } = await getSupabase()
    .from('categories')
    .insert([{
      ...category,
      user_id: userId
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return null;
  }

  return data;
}

export async function updateCategory(id: string, patch: Partial<CategoryRow>): Promise<CategoryRow> {
  const cleanPatch = { ...patch } as any;
  if ('updated_at' in cleanPatch) delete cleanPatch.updated_at;
  
  const { data, error } = await getSupabase()
    .from('categories')
    .update(cleanPatch)
    .eq('id', id)
    .select('*')
    .single();
    
  if (error) throw error;
  return data as CategoryRow;
}

export async function resequenceCategories(userId: string, type: 'prompt' | 'tool', orderedIds: string[]): Promise<void> {
  if (!userId || orderedIds.length === 0) {
    return;
  }

  const { error } = await getSupabase().rpc('resequence_categories', {
    p_user_id: userId,
    p_type: type,
    p_order: orderedIds,
  });

  if (error) {
    const message = (error.message || '').toLowerCase();
    if (message.includes('resequence_categories')) {
      for (let i = 0; i < orderedIds.length; i += 1) {
        const id = orderedIds[i];
        await updateCategory(id, { sort_order: i + 1 } as Partial<CategoryRow>);
      }
      return;
    }
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Subcategories CRUD
export async function fetchSubcategories(userId: string, categoryId?: string): Promise<SubcategoryRow[]> {
  if (!userId) {
    return [];
  }

  const buildQuery = () => {
    let base = getSupabase()
      .from('subcategories')
      .select('*')
      .eq('user_id', userId);
    if (categoryId) {
      base = base.eq('category_id', categoryId);
    }
    return base;
  };

  const { data, error } = await buildQuery()
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) {
    const message = (error.message || '').toLowerCase();
    if (message.includes('sort_order')) {
      const { data: fallbackData, error: fallbackError } = await buildQuery()
        .order('created_at', { ascending: true });
      if (fallbackError) {
        console.error('Error fetching subcategories:', fallbackError);
        return [];
      }
      return fallbackData || [];
    }
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return data || [];
}

export async function createSubcategory(subcategory: Omit<SubcategoryRow, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<SubcategoryRow | null> {
  const { data, error } = await getSupabase()
    .from('subcategories')
    .insert([{
      ...subcategory,
      user_id: userId
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating subcategory:', error);
    return null;
  }

  return data;
}

export async function updateSubcategory(id: string, patch: Partial<SubcategoryRow>): Promise<SubcategoryRow> {
  const cleanPatch = { ...patch } as any;
  if ('updated_at' in cleanPatch) delete cleanPatch.updated_at;
  
  const { data, error } = await getSupabase()
    .from('subcategories')
    .update(cleanPatch)
    .eq('id', id)
    .select('*')
    .single();
    
  if (error) throw error;
  return data as SubcategoryRow;
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('subcategories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
}

// User Profile CRUD
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await getSupabase()
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
  // Use upsert to create profile if it doesn't exist or update if it does
  const profileData = {
    id: userId,
    ...updates
  };

  const { data, error } = await getSupabase()
    .from('user_profiles')
    .upsert(profileData, { onConflict: 'id' })
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
  const { data, error } = await getSupabase().rpc('generate_share_token');
  
  if (error) {
    console.error('Error generating share token:', error);
    throw error;
  }
  
  return data;
}

export async function sharePrompt(promptId: string): Promise<string | null> {
  try {
    const shareToken = await generateShareToken();
    
    const { error } = await getSupabase()
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
    
    const { error } = await getSupabase()
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
  const { data, error } = await getSupabase()
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
  const { data, error } = await getSupabase()
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

export async function shareCategory(categoryId: string): Promise<string | null> {
  try {
    const shareToken = await generateShareToken();
    if (!shareToken) return null;

    const { error } = await getSupabase()
      .from('categories')
      .update({ share_token: shareToken })
      .eq('id', categoryId);

    if (error) {
      console.error('Error sharing category:', error);
      return null;
    }

    return shareToken;
  } catch (error) {
    console.error('Error in shareCategory:', error);
    return null;
  }
}

export async function shareSubcategory(subcategoryId: string): Promise<string | null> {
  try {
    const shareToken = await generateShareToken();
    if (!shareToken) return null;

    const { error } = await getSupabase()
      .from('subcategories')
      .update({ share_token: shareToken })
      .eq('id', subcategoryId);

    if (error) {
      console.error('Error sharing subcategory:', error);
      return null;
    }

    return shareToken;
  } catch (error) {
    console.error('Error in shareSubcategory:', error);
    return null;
  }
}

export async function fetchSharedCategory(shareToken: string): Promise<{ category: CategoryRow; prompts: PromptRow[]; tools: ToolRow[] } | null> {
  try {
    // First get the shared category
    const { data: category, error: categoryError } = await getSupabase()
      .from('categories')
      .select('*')
      .eq('share_token', shareToken)
      .single();

    if (categoryError || !category) {
      console.error('Error fetching shared category:', categoryError);
      return null;
    }

    // Get prompts in this category
    const { data: prompts, error: promptsError } = await getSupabase()
      .from('prompts')
      .select('*')
      .eq('category', category.id)
      .order('created_at', { ascending: false });

    // Get tools in this category
    const { data: tools, error: toolsError } = await getSupabase()
      .from('tools')
      .select('*')
      .eq('category', category.id)
      .order('created_at', { ascending: false });

    if (promptsError || toolsError) {
      console.error('Error fetching category content:', promptsError || toolsError);
      return null;
    }

    return {
      category,
      prompts: prompts || [],
      tools: tools || []
    };
  } catch (error) {
    console.error('Error in fetchSharedCategory:', error);
    return null;
  }
}

export async function fetchSharedSubcategory(shareToken: string): Promise<{ subcategory: SubcategoryRow; prompts: PromptRow[]; tools: ToolRow[] } | null> {
  try {
    // First get the shared subcategory
    const { data: subcategory, error: subcategoryError } = await getSupabase()
      .from('subcategories')
      .select('*')
      .eq('share_token', shareToken)
      .single();

    if (subcategoryError || !subcategory) {
      console.error('Error fetching shared subcategory:', subcategoryError);
      return null;
    }

    // Get prompts in this subcategory
    const { data: prompts, error: promptsError } = await getSupabase()
      .from('prompts')
      .select('*')
      .eq('subcategory', subcategory.id)
      .order('created_at', { ascending: false });

    // Get tools in this subcategory
    const { data: tools, error: toolsError } = await getSupabase()
      .from('tools')
      .select('*')
      .eq('subcategory', subcategory.id)
      .order('created_at', { ascending: false });

    if (promptsError || toolsError) {
      console.error('Error fetching subcategory content:', promptsError || toolsError);
      return null;
    }

    return {
      subcategory,
      prompts: prompts || [],
      tools: tools || []
    };
  } catch (error) {
    console.error('Error in fetchSharedSubcategory:', error);
    return null;
  }
}

export async function fetchPublicProfile(username: string): Promise<{ profile: UserProfile; prompts: PromptRow[]; tools: ToolRow[] } | null> {
  // First get the user profile
  const { data: profile, error: profileError } = await getSupabase()
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
  const { data: prompts, error: promptsError } = await getSupabase()
    .from('prompts')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  // Get public tools
  const { data: tools, error: toolsError } = await getSupabase()
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

// Real-time subscriptions
export function subscribeToCategories(userId: string, callback: (payload: any) => void) {
  return getSupabase()
    .channel('categories')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'categories',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToSubcategories(userId: string, callback: (payload: any) => void) {
  return getSupabase()
    .channel('subcategories')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'subcategories',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToPrompts(userId: string, callback: (payload: any) => void) {
  return getSupabase()
    .channel('prompts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'prompts',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToTools(userId: string, callback: (payload: any) => void) {
  return getSupabase()
    .channel('tools')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tools',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

export function unsubscribeFromChannel(channel: any) {
  if (channel) {
    getSupabase().removeChannel(channel);
  }
}

