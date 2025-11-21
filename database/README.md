# DPIA Agent Database Setup

This guide explains how to set up the Supabase database for the DPIA Agent.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new Supabase project

## Setup Instructions

### 1. Create Database Schema

Run the migration script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of migrations/001_initial_schema.sql
-- into the Supabase SQL editor and execute
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your Supabase credentials:

```bash
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Generate a random JWT secret
JWT_SECRET=your-random-jwt-secret-here
```

### 3. Enable Authentication (Optional for Phase 1B)

For now, the system uses a default workspace. To enable full authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable email authentication
3. Configure your site URL: `https://dpia.avantle.ai`

## Database Schema Overview

### Core Tables

- **users**: User accounts (integrates with Supabase Auth)
- **tenants**: Organizations using the system
- **workspaces**: Projects/departments within a tenant
- **members**: User access to workspaces with roles
- **assessments**: Main DPIA assessments
- **assessment_answers**: Responses to template fields
- **precheck_assessments**: Quick DPIA necessity evaluations
- **domain_events**: Audit trail and system events
- **export_history**: Track generated documents

### Multi-Tenant Architecture

The database implements Row Level Security (RLS) to ensure data isolation:

- Users can only see data from workspaces they're members of
- Different roles (admin, dpo, editor, viewer) have different permissions
- All operations are logged in the domain_events table

### Data Flow

1. **Precheck Assessment**: 8-question evaluation → `precheck_assessments`
2. **Full DPIA**: 3-section assessment → `assessments` + `assessment_answers`
3. **Progress Tracking**: Auto-save → `assessment_answers`
4. **Audit Trail**: All actions → `domain_events`
5. **Document Export**: Generated PDFs/DOCX → `export_history`

## Development vs Production

### Development Mode
- Uses fallback mock data if database is not configured
- Graceful degradation ensures UI continues to work
- Console logging for debugging

### Production Mode
- Requires properly configured Supabase environment
- Full database persistence and audit trails
- RLS policies enforce security

## Migration Strategy

The system is designed to work in both modes:

1. **Phase 1**: Mock data for rapid development and demo
2. **Phase 2**: Hybrid mode with database fallbacks (current implementation)
3. **Phase 3**: Full database mode for production

## Testing the Setup

1. Start the development server: `pnpm dev`
2. Check the console for database connection status
3. Create a test assessment to verify data persistence
4. Check your Supabase dashboard to see the data

## Troubleshooting

### Common Issues

1. **"Supabase client error"**: Check your environment variables
2. **"Failed to fetch assessments"**: Verify RLS policies are correct
3. **"Assessment not found"**: Check if the assessment exists in the database

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env.local` to see detailed database logs.

## Security Considerations

1. **RLS Policies**: Ensure users can only access their workspace data
2. **API Keys**: Never expose service role key in client-side code
3. **CORS**: Configure allowed origins in Supabase dashboard
4. **Rate Limiting**: Consider implementing rate limits for API endpoints

## Performance Optimization

1. **Indexes**: Already created for common query patterns
2. **Caching**: Consider Redis for frequently accessed data
3. **Connection Pooling**: Supabase handles this automatically
4. **Query Optimization**: Use `select()` to limit returned fields

## Backup Strategy

1. **Automated Backups**: Enabled by default in Supabase Pro
2. **Export Scripts**: Use Supabase CLI for regular exports
3. **Version Control**: Database migrations are tracked in Git
4. **Recovery Testing**: Regularly test backup restoration

## Next Steps

1. Complete Phase 1B implementation
2. Add user authentication flow
3. Implement PDF/DOCX export system
4. Set up monitoring and alerting
5. Configure staging environment