# Koto App

## Supabase Integration

This application uses Supabase for backend services including:
- Authentication (GitHub and Google OAuth)
- Database storage for prompts and tools
- File storage for cover images

## Environment Variables

The following environment variables are required:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Local Development

1. Clone the repository
2. Install dependencies: `yarn install`
3. Create a `.env` file with the required environment variables
4. Run the development server: `yarn dev`

## Deployment to Vercel

### Prerequisites

1. A GitHub repository with your code
2. A Supabase project
3. A Vercel account

### Steps

1. Push your code to GitHub
2. Log in to Vercel and create a new project
3. Import your GitHub repository
4. Configure the following environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy the project

### Automatic Deployments

Vercel will automatically deploy your application when you push changes to your GitHub repository.

## Database Schema

The application uses the following tables in Supabase:

### prompts
- id: string (primary key)
- title: string
- content: string
- model: string
- tags: string[] (array)
- category: string
- subcategory: string (nullable)
- cover_image: string (nullable)
- created_at: timestamp
- user_id: string (foreign key to auth.users)

### tools
- id: string (primary key)
- name: string
- url: string
- description: string (nullable)
- category: string (nullable)
- favicon: string (nullable)
- created_at: timestamp
- user_id: string (foreign key to auth.users)

## Storage Buckets

The application uses the following storage bucket in Supabase:

- covers: For storing prompt cover images
