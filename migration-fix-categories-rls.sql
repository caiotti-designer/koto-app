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
-- Ensure deterministic ordering support without manual migrations
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS sort_order INTEGER;

ALTER TABLE public.subcategories
  ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Backfill sort_order values when missing
WITH ranked_categories AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, type
           ORDER BY sort_order NULLS LAST, created_at
         ) AS seq
  FROM public.categories
)
UPDATE public.categories AS c
SET sort_order = ranked_categories.seq
FROM ranked_categories
WHERE c.id = ranked_categories.id
  AND c.sort_order IS NULL;

WITH ranked_subcategories AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, category_id
           ORDER BY sort_order NULLS LAST, created_at
         ) AS seq
  FROM public.subcategories
)
UPDATE public.subcategories AS s
SET sort_order = ranked_subcategories.seq
FROM ranked_subcategories
WHERE s.id = ranked_subcategories.id
  AND s.sort_order IS NULL;

CREATE INDEX IF NOT EXISTS idx_categories_user_type_sort
  ON public.categories(user_id, type, sort_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_sort
  ON public.subcategories(category_id, sort_order);

-- RPC helper for resequencing categories from the client
DROP FUNCTION IF EXISTS public.resequence_categories(uuid, text, uuid[]);
CREATE FUNCTION public.resequence_categories(p_user_id uuid, p_type text, p_order uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  provided_count integer := COALESCE(array_length(p_order, 1), 0);
BEGIN
  IF p_user_id IS NULL OR p_type IS NULL THEN
    RAISE EXCEPTION 'user id and type are required';
  END IF;

  IF provided_count = 0 THEN
    RETURN;
  END IF;

  WITH ordered AS (
    SELECT id, ordinality
    FROM unnest(p_order) WITH ORDINALITY AS t(id, ordinality)
  )
  UPDATE public.categories AS c
  SET sort_order = ordered.ordinality,
      updated_at = NOW()
  FROM ordered
  WHERE c.id = ordered.id
    AND c.user_id = p_user_id
    AND c.type = p_type;

  WITH remaining AS (
    SELECT c.id,
           ROW_NUMBER() OVER (
             ORDER BY COALESCE(c.sort_order, 2147483647), c.created_at
           ) + provided_count AS seq
    FROM public.categories AS c
    WHERE c.user_id = p_user_id
      AND c.type = p_type
      AND NOT (c.id = ANY(p_order))
  )
  UPDATE public.categories AS c
  SET sort_order = remaining.seq,
      updated_at = NOW()
  FROM remaining
  WHERE c.id = remaining.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resequence_categories(uuid, text, uuid[]) TO authenticated;
