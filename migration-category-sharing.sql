-- Migration: Add sharing functionality to categories and subcategories
-- This enables shareable links for categories that show all tools/prompts within them

-- Add share_token columns to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Add share_token columns to subcategories table
ALTER TABLE public.subcategories 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Create indexes for share tokens
CREATE INDEX IF NOT EXISTS idx_categories_share_token ON public.categories(share_token);
CREATE INDEX IF NOT EXISTS idx_subcategories_share_token ON public.subcategories(share_token);

-- Add sharing policies for categories
DO $$
BEGIN
  -- Policy for viewing shared categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Anyone can view shared categories'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view shared categories" ON public.categories FOR SELECT USING (share_token IS NOT NULL)';
  END IF;
  
  -- Policy for viewing shared subcategories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subcategories' 
    AND policyname = 'Anyone can view shared subcategories'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view shared subcategories" ON public.subcategories FOR SELECT USING (share_token IS NOT NULL)';
  END IF;
END
$$;

-- Add policies for viewing prompts/tools within shared categories
DO $$
BEGIN
  -- Policy for viewing prompts in shared categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompts' 
    AND policyname = 'Anyone can view prompts in shared categories'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view prompts in shared categories" ON public.prompts FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.categories c 
        WHERE c.id = prompts.category 
        AND c.share_token IS NOT NULL
      ) OR
      EXISTS (
        SELECT 1 FROM public.subcategories s 
        WHERE s.id = prompts.subcategory 
        AND s.share_token IS NOT NULL
      )
    )';
  END IF;
  
  -- Policy for viewing tools in shared categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tools' 
    AND policyname = 'Anyone can view tools in shared categories'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view tools in shared categories" ON public.tools FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.categories c 
        WHERE c.id = tools.category 
        AND c.share_token IS NOT NULL
      ) OR
      EXISTS (
        SELECT 1 FROM public.subcategories s 
        WHERE s.id = tools.subcategory 
        AND s.share_token IS NOT NULL
      )
    )';
  END IF;
END
$$;