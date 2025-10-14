# Supabase Setup Instructions

## Problem
The registration functionality is currently not working because Supabase credentials are not configured. The application is using placeholder values (`YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY`).

## Solution
To fix the registration functionality, you need to set up Supabase and configure the credentials.

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `glaam-flower-shop` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
6. Click "Create new project"

### Step 2: Get Your Supabase Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 3: Configure Environment Variables

#### Option A: For Vercel Deployment
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `PUBLIC_SUPABASE_URL`: Your Project URL
   - `PUBLIC_SUPABASE_ANON_KEY`: Your anon public key
5. Redeploy your application

#### Option B: For Local Development
1. Create a `.env.local` file in your project root
2. Add the following content:
   ```
   PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Restart your development server

### Step 4: Enable Email Authentication
1. In Supabase dashboard, go to Authentication → Settings
2. Under "Auth Providers", make sure "Email" is enabled
3. Configure email templates if needed
4. Set up email confirmation settings

### Step 5: Test Registration
1. Deploy your application with the new environment variables
2. Try to register a new user
3. Check your email for the confirmation link
4. Verify that the registration works correctly

## Security Notes
- Never commit your Supabase credentials to version control
- Use environment variables for all sensitive configuration
- The `anon` key is safe to use in client-side code
- Consider setting up Row Level Security (RLS) policies for your database tables

## Troubleshooting
- If registration still fails, check the browser console for error messages
- Verify that your Supabase project is active and not paused
- Ensure that email authentication is enabled in your Supabase project
- Check that your environment variables are correctly set in your deployment platform

## Additional Features
Once Supabase is configured, you can also:
- Set up user profiles
- Implement password reset functionality
- Add social authentication (Google, Facebook, etc.)
- Create database tables for user data, orders, etc.
