-- Supabase RLS Policies Update for Anonymous User Support
-- Run this if your tables already exist and you only need to update policies

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can insert their own tools" ON public.tools;
DROP POLICY IF EXISTS "Authenticated users can upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload cover images" ON storage.objects;

-- Create updated RLS policies for prompts
CREATE POLICY "Users can insert their own prompts" 
  ON public.prompts FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create updated RLS policies for tools
CREATE POLICY "Users can insert their own tools" 
  ON public.tools FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create storage bucket for cover images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Create updated RLS policy for storage
CREATE POLICY "Anyone can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers');

-- Drop and recreate other storage policies to ensure they exist
DROP POLICY IF EXISTS "Anyone can view cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own cover images" ON storage.objects;

CREATE POLICY "Anyone can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Users can update their own cover images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own cover images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.uid() = owner);