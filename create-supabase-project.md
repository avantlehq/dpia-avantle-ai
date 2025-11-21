# 🚀 Quick Supabase Setup for DPIA Agent

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose your organization (or create one)
4. Project settings:
   - **Name**: `DPIA Agent`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. ⏱️ Wait 2-3 minutes for initialization

## Step 2: Get API Keys

1. In your new project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon public key**: `eyJ...` (long string starting with eyJ)
   - **service_role key**: `eyJ...` (different long string)

## Step 3: Update Environment Variables

Replace the content of `.env.local` with your actual values:

```env
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Supabase - REPLACE WITH YOUR ACTUAL VALUES
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# JWT Secret for additional encryption
JWT_SECRET=your_generated_jwt_secret_here_32_chars_min

# Feature Flags
NEXT_PUBLIC_ENABLE_E2EE=false
NEXT_PUBLIC_ENABLE_DOMAIN_EVENTS=true

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,sk,de
```

## Step 4: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire content from `database/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** 
6. You should see: ✅ **"Success. No rows returned"**

## Step 5: Test Connection

```bash
# Test the database connection
node test-database.js

# Restart development server
pnpm dev

# Visit the application
# http://localhost:3001/dashboard
```

## ✅ What You'll See When It Works

- Dashboard loads with real database connection
- Creating assessments persists to Supabase
- Assessment answers are saved automatically
- Export functionality generates real documents
- All audit events are logged to database

## 🔧 If Something Goes Wrong

### Common Issues:

1. **"Database not configured"** → Check `.env.local` credentials
2. **"Table does not exist"** → Run the SQL migration again
3. **"RLS policy"** errors → Migration includes all necessary policies
4. **Connection timeout** → Check Supabase project is active (not paused)

### Debug Steps:

```bash
# Check environment variables are loaded
echo $NEXT_PUBLIC_SUPABASE_URL

# Test basic connection
node test-database.js

# Check server logs
pnpm dev
# Then visit http://localhost:3001/dashboard
# Check browser console and terminal output
```

---

**🎯 Next**: Once database is connected, your DPIA Agent will be fully functional with real data persistence, user authentication ready, and production-ready deployment capabilities!