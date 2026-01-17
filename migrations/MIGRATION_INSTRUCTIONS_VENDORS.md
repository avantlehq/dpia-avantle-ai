# Vendors Missing Columns Migration

## Overview

This supplemental migration adds missing columns to the `vendors` table that VendorForm requires for dropdown pre-selection.

**Status**: Required to fix vendor_role dropdown persistence issue

## Missing Columns

VendorForm sends these fields but vendors table doesn't have them:
- `vendor_role` (vendor_role_type enum) - Processor, Joint Controller, Recipient, Sub-processor
- `status` (entity_status enum) - Active/Inactive
- `has_dpa` (boolean) - Has Data Processing Agreement
- `dpa_expires` (date) - DPA expiration date
- `location` (varchar) - Vendor location (free text)

## Prerequisites

✅ Migration `20260117_context_schema_alignment.sql` already executed
✅ All verification queries passed

## Migration Steps

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT
2. Click "SQL Editor" in left sidebar
3. Click "New Query"

### Step 2: Copy Migration Script

Copy the entire contents of `20260117_vendors_missing_columns.sql`

### Step 3: Execute Migration

1. Paste the script into SQL Editor
2. Click "Run" (or press Cmd/Ctrl + Enter)
3. Wait for execution to complete (should take 1-2 seconds)

**Expected Output:**
```
SUCCESS
```

### Step 4: Run Verification Queries

Execute each query individually:

**Query 1: Check columns exist**
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND column_name IN ('vendor_role', 'status', 'has_dpa', 'dpa_expires', 'location')
ORDER BY column_name;
```

**Expected Result:** 5 rows showing all columns

**Query 2: Check enum values**
```sql
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'vendor_role_type'::regtype;
```

**Expected Result:**
```
processor
joint_controller
recipient
sub_processor
```

**Query 3: Verify existing vendors**
```sql
SELECT id, name, vendor_role, status, has_dpa, dpa_expires, location
FROM vendors LIMIT 10;
```

**Expected Result:** All existing vendors should have vendor_role='processor', status='active', has_dpa=false

### Step 5: Test VendorForm

1. Go to https://dpia.avantle.ai/en/context/vendors/new
2. Create vendor with vendor_role = "Joint Controller"
3. Save vendor
4. Edit the vendor
5. **VERIFY**: Dropdown should pre-select "Joint Controller" (not revert to "Processor")

## Rollback

If migration fails, rollback script is at bottom of migration file (commented out).

## Files Modified

- `migrations/20260117_vendors_missing_columns.sql` (new)
- `migrations/MIGRATION_INSTRUCTIONS_VENDORS.md` (new)

## Next Steps After Migration

1. Test vendor_role dropdown pre-selection
2. Test status dropdown pre-selection
3. Test has_dpa switch persistence
4. Update DATABASE_SCHEMA_ISSUES.md to mark vendors as complete
