-- Supabase SQL Schema for Koto App

-- Enable Row Level Security (RLS)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Create prompts table
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tools table
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  favicon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create RLS policies for prompts
CREATE POLICY "Users can view all prompts" 
  ON public.prompts FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own prompts" 
  ON public.prompts FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own prompts" 
  ON public.prompts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts" 
  ON public.prompts FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for tools
CREATE POLICY "Users can view all tools" 
  ON public.tools FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own tools" 
  ON public.tools FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own tools" 
  ON public.tools FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tools" 
  ON public.tools FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

-- Create RLS policy for storage
CREATE POLICY "Anyone can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Anyone can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Users can update their own cover images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own cover images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.uid() = owner);