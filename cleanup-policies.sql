-- Cleanup script to remove existing policies before applying schema v2
-- Run this BEFORE applying the full schema v2

-- Drop existing RLS policies for prompts
DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Anyone can view public prompts" ON public.prompts;
DROP POLICY IF EXISTS "Anyone can view shared prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;

-- Drop existing RLS policies for tools
DROP POLICY IF EXISTS "Users can view their own tools" ON public.tools;
DROP POLICY IF EXISTS "Anyone can view public tools" ON public.tools;
DROP POLICY IF EXISTS "Anyone can view shared tools" ON public.tools;
DROP POLICY IF EXISTS "Users can insert their own tools" ON public.tools;
DROP POLICY IF EXISTS "Users can update their own tools" ON public.tools;
DROP POLICY IF EXISTS "Users can delete their own tools" ON public.tools;

-- Drop existing RLS policies for user_profiles (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profiles;
        DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
        DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
    END IF;
END $$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view cover images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own cover images" ON storage.objects;

-- Drop existing triggers (if tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prompts') THEN
        DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
    END IF;
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.generate_share_token();
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;