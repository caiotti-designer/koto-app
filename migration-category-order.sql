-- Add sort_order column to categories for manual ordering
ALTER TABLE IF EXISTS public.categories
  ADD COLUMN IF NOT EXISTS sort_order integer;

-- Backfill sort_order grouped by user and type using created_at as baseline
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY user_id, type ORDER BY created_at ASC) AS rn
  FROM public.categories
)
UPDATE public.categories c
SET sort_order = r.rn
FROM ranked r
WHERE c.id = r.id AND c.sort_order IS NULL;

-- Helpful index for ordered queries
CREATE INDEX IF NOT EXISTS idx_categories_user_type_order
  ON public.categories(user_id, type, sort_order);

-- Note:
-- Update your API to order by sort_order ASC, created_at ASC as a fallback.
-- The UI code already attempts to persist sort_order when reordering.

