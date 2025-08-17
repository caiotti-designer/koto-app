-- Fix for updated_at trigger errors
-- This script removes triggers that reference non-existent updated_at columns

-- Drop triggers that reference updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;

-- Drop the function that tries to update updated_at
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Verify triggers are removed
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%updated_at%';