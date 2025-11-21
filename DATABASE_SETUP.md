# Database Setup Guide for DPIA Agent

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for initialization to complete

### 2. Run SQL Migration
1. In Supabase dashboard, go to "SQL Editor"
2. Copy the content from `database/migrations/001_initial_schema.sql`
3. Paste and run the SQL migration

### 3. Get API Credentials
1. Go to Project Settings → API
2. Copy the Project URL and API Keys
3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_key
JWT_SECRET=your_32_character_jwt_secret_here
```

### 4. Test the Setup
```bash
pnpm dev
```

Navigate to http://localhost:3000/dashboard and check if assessments load from database.

## Current Status
✅ Database schema ready
✅ TypeScript types generated
✅ API endpoints implemented with fallback
✅ Environment template created

🔄 **NEXT**: Configure actual Supabase project and update .env.local

## Fallback Mode
The application currently runs with mock data if database connection fails, so it's safe to test even without Supabase configured.