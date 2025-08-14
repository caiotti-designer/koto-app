-- Migration script to add missing columns to existing tables
-- Run this BEFORE applying the full schema v2

-- Add missing columns to prompts table
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Add missing columns to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Update existing records to have a user_id (replace with your actual user ID)
-- You can get your user ID from auth.users table
-- UPDATE public.prompts SET user_id = 'YOUR_USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE public.tools SET user_id = 'YOUR_USER_ID_HERE' WHERE user_id IS NULL;

-- Make user_id NOT NULL after updating existing records
-- ALTER TABLE public.prompts ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE public.tools ALTER COLUMN user_id SET NOT NULL;