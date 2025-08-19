-- Migration to add subcategory column to tools table
-- This allows tools to be organized into subcategories like prompts

ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create index for better performance when filtering by subcategory
CREATE INDEX IF NOT EXISTS idx_tools_subcategory ON public.tools(subcategory);

-- Update the updated_at trigger if it exists
-- (This is optional and depends on your trigger setup)