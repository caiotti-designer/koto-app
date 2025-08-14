# Vercel Deployment Guide

This guide will walk you through deploying the Koto App to Vercel.

## Prerequisites

1. A GitHub account with your code repository
2. A Supabase project with the required tables and storage buckets
3. A Vercel account

## Step 1: Push Your Code to GitHub

Ensure your code is pushed to a GitHub repository. If you haven't done this yet:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository (replace with your GitHub repository URL)
git remote add origin https://github.com/yourusername/koto-app.git

# Push to GitHub
git push -u origin main
```

## Step 2: Connect Vercel to Your GitHub Repository

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "Add New..." > "Project"
3. Select your GitHub repository
4. Vercel will automatically detect that this is a Vite project

## Step 3: Configure Environment Variables

Add the following environment variables in the Vercel project settings:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Once deployed, Vercel will provide you with a URL to access your application

## Step 5: Set Up Custom Domain (Optional)

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions to configure DNS settings

## Troubleshooting

### Build Failures

If your build fails, check the build logs in Vercel for specific errors. Common issues include:

- Missing environment variables
- Dependency installation failures
- Build script errors

### Runtime Errors

If your application deploys but doesn't work correctly:

1. Check browser console for errors
2. Verify that environment variables are correctly set
3. Ensure Supabase project is properly configured

### Supabase Connection Issues

If your application can't connect to Supabase:

1. Verify that your Supabase project is active
2. Check that you've correctly set the environment variables
3. Ensure that your Supabase project allows requests from your Vercel domain

## Automatic Deployments

Vercel automatically deploys your application when you push changes to your GitHub repository. You can configure this behavior in the Vercel project settings under "Git".