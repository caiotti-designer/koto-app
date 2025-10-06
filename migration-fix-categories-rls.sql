-- Migration: Fix categories RLS recursion by using a definer helper
-- Date: 2025-01-14

-- Drop the previous policy to avoid recursion
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'public_categories_with_public_items'
  ) THEN
    EXECUTE 'DROP POLICY "public_categories_with_public_items" ON public.categories';
  END IF;
END
$$;

-- Helper function evaluated with owner privileges so it is safe to reference prompts/tools
DROP FUNCTION IF EXISTS public.category_has_public_content(uuid, text);
CREATE FUNCTION public.category_has_public_content(cat_id uuid, cat_type text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT CASE
    WHEN cat_type = 'prompt' THEN EXISTS (
      SELECT 1
      FROM public.prompts p
      WHERE p.category = cat_id::text
        AND p.is_public = true
    )
    WHEN cat_type = 'tool' THEN EXISTS (
      SELECT 1
      FROM public.tools t
      WHERE t.category = cat_id::text
        AND t.is_public = true
    )
    ELSE false
  END;
$$;

GRANT EXECUTE ON FUNCTION public.category_has_public_content(uuid, text) TO anon, authenticated;

-- Recreate a safe SELECT policy that relies on the helper
CREATE POLICY "public_categories_with_public_items"
  ON public.categories
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.category_has_public_content(id, type)
  );
