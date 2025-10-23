import { getSupabase } from '../supabaseClient';
import type { PromptRow, ToolRow } from '../data';

export async function updatePrompt(id: string, patch: Partial<PromptRow>) {
  const { data, error } = await getSupabase()
    .from('prompts')
    .update(patch as any)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PromptRow;
}

export async function deletePrompt(id: string) {
  const { error } = await getSupabase()
    .from('prompts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function sharePrompt(promptId: string): Promise<string | null> {
  const { data: existing, error: fetchErr } = await getSupabase()
    .from('prompts')
    .select('share_token')
    .eq('id', promptId)
    .single();
  if (fetchErr) throw fetchErr;
  if (existing?.share_token) return existing.share_token;
  const token = crypto.randomUUID();
  const { error } = await getSupabase()
    .from('prompts')
    .update({ share_token: token })
    .eq('id', promptId);
  if (error) throw error;
  return token;
}

export async function updateTool(id: string, patch: Partial<ToolRow>) {
  const { data, error } = await getSupabase()
    .from('tools')
    .update(patch as any)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as ToolRow;
}

export async function deleteTool(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('tools')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function shareTool(toolId: string): Promise<string | null> {
  const { data: existing, error: fetchErr } = await getSupabase()
    .from('tools')
    .select('share_token')
    .eq('id', toolId)
    .single();
  if (fetchErr) throw fetchErr;
  if (existing?.share_token) return existing.share_token;
  const token = crypto.randomUUID();
  const { error } = await getSupabase()
    .from('tools')
    .update({ share_token: token })
    .eq('id', toolId);
  if (error) throw error;
  return token;
}
