# Database Schema Migration Guide

To apply the new user-specific workspace schema to your Supabase database, follow these steps:

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section
3. Create a new query

## Step 2: Apply the Schema

Copy and paste the contents of `supabase-schema-v2.sql` into the SQL Editor and execute it.

This will:
- Create the `user_profiles` table
- Add `user_id`, `is_public`, and `share_token` columns to existing `prompts` and `tools` tables
- Set up Row Level Security (RLS) policies
- Create helper functions for user profile creation and share token generation

## Step 3: Migrate Existing Data (if any)

If you have existing prompts and tools in your database, you'll need to:

1. Assign them to a user (or delete them if they're test data)
2. Set `is_public` to `false` for privacy
3. Generate share tokens if needed

```sql
-- Example: Assign existing data to a specific user
UPDATE prompts SET user_id = 'your-user-id', is_public = false WHERE user_id IS NULL;
UPDATE tools SET user_id = 'your-user-id', is_public = false WHERE user_id IS NULL;
```

## Step 4: Test the Application

1. Sign in to the application
2. Create a new prompt or tool
3. Try sharing functionality
4. Test profile settings

## Features Now Available

✅ **User-specific workspaces**: Each user sees only their own content
✅ **Public profiles**: Users can make their profiles public
✅ **Content sharing**: Share individual prompts and tools via secure tokens
✅ **Profile management**: Edit profile information and privacy settings
✅ **Authentication required**: Anonymous users must sign in to create content

## New Routes

- `/settings/profile` - Profile settings page
- `/shared/prompt?token=xxx` - View shared prompt
- `/shared/tool?token=xxx` - View shared tool  
- `/profile/username` - View public user profile

## Security Features

- Row Level Security (RLS) ensures users can only access their own data
- Share tokens provide secure access to individual items
- Public profiles are opt-in only
- All sharing functionality requires authentication