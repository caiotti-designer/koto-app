-- Migration: Add only missing sharing functionality
-- Run this if you get policy conflicts with the full schema v2

-- Add share_token columns if they don't exist
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Create indexes for share tokens
CREATE INDEX IF NOT EXISTS idx_prompts_share_token ON public.prompts(share_token);
CREATE INDEX IF NOT EXISTS idx_tools_share_token ON public.tools(share_token);

-- Create the share token generation function (fixed encoding)
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
BEGIN
  -- Use base64 encoding instead of base64url (which is not supported in PostgreSQL)
  RETURN replace(replace(encode(gen_random_bytes(32), 'base64'), '+', '-'), '/', '_');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add sharing policies (with IF NOT EXISTS equivalent using DO blocks)
DO $$
BEGIN
  -- Policy for viewing shared prompts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompts' 
    AND policyname = 'Anyone can view shared prompts'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view shared prompts" ON public.prompts FOR SELECT USING (share_token IS NOT NULL)';
  END IF;
  
  -- Policy for viewing shared tools
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tools' 
    AND policyname = 'Anyone can view shared tools'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view shared tools" ON public.tools FOR SELECT USING (share_token IS NOT NULL)';
  END IF;
END
$$;