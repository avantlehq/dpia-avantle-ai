# Data Flows Endpoints Migration Instructions

## Overview
This migration adds endpoint and security columns to the `data_flows` table to support flow mapping between systems and vendors.

## Migration File
- **Forward**: `20260124_data_flows_endpoints.sql`
- **Rollback**: `20260124_data_flows_endpoints_rollback.sql`

## Changes
1. Adds foreign key columns for flow endpoints:
   - `from_system` (UUID, references systems table)
   - `to_system` (UUID, references systems table)
   - `from_vendor` (UUID, references vendors table)
   - `to_vendor` (UUID, references vendors table)

2. Adds security and compliance columns:
   - `encryption_in_transit` (BOOLEAN, default true)
   - `cross_border_transfer` (BOOLEAN, default false)

3. Creates indexes for:
   - Foreign key lookups
   - Cross-border transfer queries
   - Unencrypted flow detection

## Execution Steps

### 1. Connect to Supabase
```bash
# Using Supabase CLI
supabase db remote commit

# Or connect directly to PostgreSQL
psql postgresql://[connection-string]
```

### 2. Run Migration
```sql
-- Execute the migration script
\i migrations/20260124_data_flows_endpoints.sql
```

### 3. Verify Migration
```sql
-- Check columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'data_flows'
AND column_name IN (
  'from_system', 'to_system', 'from_vendor', 'to_vendor',
  'encryption_in_transit', 'cross_border_transfer'
);

-- Check indexes were created
SELECT indexname
FROM pg_indexes
WHERE tablename = 'data_flows'
AND indexname LIKE 'idx_data_flows_%';
```

### 4. Test Foreign Key Constraints
```sql
-- Test system reference (should succeed)
INSERT INTO data_flows (
  name, flow_direction, from_system, to_system,
  tenant_id, workspace_id, created_by, updated_by
)
SELECT
  'Test Flow',
  'internal',
  s1.id,
  s2.id,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
FROM systems s1, systems s2
WHERE s1.id != s2.id
LIMIT 1;

-- Clean up test
DELETE FROM data_flows WHERE name = 'Test Flow';
```

## Rollback Instructions

If you need to rollback the migration:

```sql
\i migrations/20260124_data_flows_endpoints_rollback.sql
```

**Warning**: Rollback will delete all data in the endpoint columns. Back up data first if needed.

## Impact Assessment

### Breaking Changes
- **None**: All new columns are nullable or have defaults
- Existing data flows will have:
  - NULL endpoint references (can be populated later)
  - encryption_in_transit = true (secure default)
  - cross_border_transfer = false (safe default)

### Application Changes Required
- Frontend forms updated to capture endpoint selections
- API routes updated to validate endpoint references
- Client library updated with new field types

### Performance Impact
- Minimal: Indexes created for foreign key lookups
- Cross-border queries will benefit from dedicated index

## Post-Migration Tasks

1. **Update existing flows** (if any):
```sql
-- Example: Set endpoints for existing flows
UPDATE data_flows
SET from_system = (SELECT id FROM systems WHERE name = 'Source System')
WHERE name = 'Existing Flow Name';
```

2. **Verify data integrity**:
```sql
-- Check for flows without endpoints
SELECT id, name
FROM data_flows
WHERE from_system IS NULL
  AND from_vendor IS NULL;
```

## Troubleshooting

### Issue: Foreign key constraint fails
**Cause**: Referenced system/vendor doesn't exist
**Solution**: Create the system/vendor first, or use NULL for optional endpoints

### Issue: Migration fails with "column already exists"
**Cause**: Migration was partially run before
**Solution**: Check which columns exist and manually add missing ones:
```sql
ALTER TABLE data_flows ADD COLUMN IF NOT EXISTS from_system UUID;
-- Repeat for each column
```

## Support
- Check logs: `tail -f /var/log/postgresql/postgresql-main.log`
- Verify schema: `\d data_flows` in psql
- Contact: Development team
