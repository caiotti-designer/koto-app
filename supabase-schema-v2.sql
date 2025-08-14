-- Koto App Database Schema v2.0
-- User-Specific Workspaces with Sharing Features
-- Run this to create the complete new schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  profile_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompts table with sharing features
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT,
  cover_image TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tools table with sharing features
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  favicon TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_share_token ON public.prompts(share_token);
CREATE INDEX IF NOT EXISTS idx_prompts_public ON public.prompts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON public.tools(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_share_token ON public.tools(share_token);
CREATE INDEX IF NOT EXISTS idx_tools_public ON public.tools(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_public ON public.user_profiles(profile_public) WHERE profile_public = true;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view public profiles" 
  ON public.user_profiles FOR SELECT 
  USING (profile_public = true OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
  ON public.user_profiles FOR DELETE 
  USING (auth.uid() = id);

-- RLS Policies for prompts
CREATE POLICY "Users can view their own prompts" 
  ON public.prompts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public prompts" 
  ON public.prompts FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Anyone can view shared prompts" 
  ON public.prompts FOR SELECT 
  USING (share_token IS NOT NULL);

CREATE POLICY "Users can insert their own prompts" 
  ON public.prompts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts" 
  ON public.prompts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts" 
  ON public.prompts FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for tools
CREATE POLICY "Users can view their own tools" 
  ON public.tools FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public tools" 
  ON public.tools FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Anyone can view shared tools" 
  ON public.tools FOR SELECT 
  USING (share_token IS NOT NULL);

CREATE POLICY "Users can insert their own tools" 
  ON public.tools FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tools" 
  ON public.tools FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tools" 
  ON public.tools FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for cover images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own cover images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own cover images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.uid() = owner);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate share tokens
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();