# Database Schema Mismatch Issues

**Status:** 🟡 MITIGATED - All CRUD operations functional with workarounds (v3.25.19 - v3.25.44)
**Impact:** Complex workaround code, UX degradation (edit form dropdowns), no soft delete, no audit trail
**Root Cause:** Production database schema fundamentally differs from TypeScript types
**Last Updated:** 2026-01-17 (Phase 1 Testing Complete)

---

## Summary

Production database has critical schema mismatches with TypeScript types:
1. **Missing columns** - deleted_at, created_by, updated_by, parent_id, special_category_basis, description, address, city
2. **Missing enum values** - 'employment', 'anonymous' (intentionally excluded from database)
3. **Schema differences** - physical_locations uses country_code VARCHAR instead of jurisdiction_id UUID FK
4. **Missing localization** - jurisdictions missing name_en/name_sk columns

**Phase 1 Complete:** All Context modules tested (Systems, Vendors, Locations, Data Categories, Processing Activities)
**Status:** ✅ All CRUD operations working with extensive repository workarounds
**Next Phase:** Apply database migration and remove all workarounds

## Affected Tables

### 1. `processing_activities`

**Missing Columns:**
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID)
- `updated_by` (UUID)
- `data_source` (VARCHAR)

**Missing Enum Values:**
- `special_category_basis` enum missing value: `'employment'`

**Impact:**
- Soft delete not possible (hard delete only)
- No audit trail for who created/modified records
- Cannot track data lineage
- "employment" basis silently mapped to null

**Workaround Applied:** v3.25.24, v3.25.26, v3.25.27, v3.25.29
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `prepareCreateData()` - whitelist fields, filter employment enum
- Override `prepareUpdateData()` - whitelist fields, filter employment enum
- Override `delete()` - use hard delete

---

### 2. `vendors`

**Missing Columns:**
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID) - not confirmed
- `updated_by` (UUID) - not confirmed

**Known Issues:**
- ⚠️ Edit form dropdowns not pre-selecting current values (reported by user, not debugged)
- Likely similar schema mismatch as data_categories (enum values or missing columns)
- CRUD operations functional but UX degraded

**Impact:**
- Soft delete not possible
- GET /api/v1/context/vendors returned 500 (fixed)
- Edit form requires re-selecting all dropdown values

**Workaround Applied:** v3.25.28
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `findByIdWithRelations()` - skip deleted_at filter

**TODO:** Investigate vendor edit form dropdown pre-selection issue

---

### 3. `physical_locations` ⚠️ CRITICAL SCHEMA MISMATCH

**Missing Columns:**
- `jurisdiction_id` (UUID) - **CRITICAL: Column doesn't exist, table uses country_code instead**
- `description` (VARCHAR) - **CONFIRMED v3.25.41** - POST failed with "Could not find the 'description' column"
- `address` (VARCHAR) - **CONFIRMED v3.25.41**
- `city` (VARCHAR) - **CONFIRMED v3.25.41**
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID)
- `updated_by` (UUID)

**Schema Difference - CRITICAL:**
- **TypeScript expects:** `jurisdiction_id UUID REFERENCES jurisdictions(id)`
- **Database has:** `country_code VARCHAR(2) NOT NULL` (just a 2-char string like "SK", not a foreign key)
- **Error:** "null value in column 'country_code' violates not-null constraint" (v3.25.42)

**Impact:**
- Cannot use foreign key joins to jurisdictions table
- Form sends UUID jurisdiction_id but database expects VARCHAR country_code
- Requires bidirectional translation layer:
  - **Write:** jurisdiction_id (UUID) → fetch jurisdiction → country_code (VARCHAR) → database
  - **Read:** country_code (VARCHAR) → fetch jurisdiction → jurisdiction_id (UUID) → API/form
- Edit form dropdown empty without reverse enrichment
- Cannot create locations without async jurisdiction lookup

**Workaround Applied:** v3.25.30, v3.25.39, v3.25.40, v3.25.41, v3.25.42, v3.25.43
- Override `findMany()` - skip deleted_at filter, enrich all locations with jurisdiction_id
- Override `findById()` - skip deleted_at filter, enrich location with jurisdiction_id
- Override `prepareCreateDataAsync()` - async fetch country_code from jurisdiction_id before insert
- Override `prepareUpdateDataAsync()` - async fetch country_code from jurisdiction_id on update
- Override `create()` - use async prepare, enrich returned location
- Override `update()` - use async prepare, enrich returned location
- Added `enrichWithJurisdictionId()` helper - reverse lookup jurisdiction_id from country_code
- Override `findByJurisdiction()` - convert jurisdiction_id to country_code, enrich results
- Override `getAvailableLocations()` - enrich all locations
- Override `advancedSearch()` - convert jurisdiction filters, enrich results
- Disabled `applyIncludes()` - cannot join on country_code string
- LocationForm rewritten 3 times to match actual schema

---

### 4. `jurisdictions`

**Missing Columns:**
- `name_en` (VARCHAR) - **CONFIRMED v3.25.40** - GET failed with "column jurisdictions.name_en does not exist"
- `name_sk` (VARCHAR) - **CONFIRMED v3.25.40**

**Impact:**
- Cannot display full country names in UI (only country codes)
- GET /api/v1/context/jurisdictions returned 500
- LocationForm jurisdiction dropdown failed to load
- All queries ordering/searching by name_en/name_sk fail

**Workaround Applied:** v3.25.40
- Override `findMany()` - use country_code for search and ordering instead of name_en
- Override `findEuEeaJurisdictions()` - order by country_code
- Override `findWithAdequacyDecision()` - order by country_code
- Override `findWithoutAdequacyDecision()` - order by country_code
- Override `search()` - search by country_code instead of name
- Override `getPopularJurisdictions()` - order by country_code
- LocationForm displays only country codes (e.g., "SK ✓" instead of "Slovakia (SK) ✓")

---

### 5. `data_categories`

**Missing Columns:**
- `special_category_basis` (ENUM) - **CONFIRMED v3.25.33** - POST failed with "Could not find the 'special_category_basis' column"
- `parent_id` (UUID) - **CONFIRMED v3.25.32** - POST failed with "column data_categories.parent_id does not exist"
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID)
- `updated_by` (UUID)

**Missing Enum Values:**
- `category_type` enum missing value: `'anonymous'` - **CONFIRMED v3.25.44** - POST failed with "invalid input value for enum data_category_type: 'anonymous'"
- Database enum `data_category_type` only has: `personal`, `special`, `criminal`

**Impact:**
- Cannot track Article 9 GDPR special category legal basis
- Cannot create hierarchical category structure
- Cannot categorize anonymous/aggregated data
- POST /api/v1/context/data-categories returned 500
- nameExistsInParent validation failed
- Edit form dropdowns empty (parent_id not returned from database)

**Workaround Applied:** v3.25.30, v3.25.32, v3.25.33, v3.25.34, v3.25.35, v3.25.44
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `prepareCreateData()` - whitelist fields, skip special_category_basis, skip parent_id
- Override `prepareUpdateData()` - whitelist fields, skip special_category_basis, skip parent_id
- Override `nameExistsInParent()` - check name uniqueness globally instead of per-parent
- Override `getChildCategories()` - return empty array (no hierarchy without parent_id)
- Override `delete()` - hard delete instead of soft delete
- Service: Disable `validateParentChange()` in updateDataCategory()
- Service: Disable `special_category_basis` and `parent_id` validation in validateDataCategoryData()
- Removed 'anonymous' from DataCategoryForm options, Zod schema, and TypeScript interfaces

---

### 6. `systems`

**Status:** ✅ CRUD operations functional - no errors discovered during testing

**Potentially Missing Columns:**
- `deleted_at` (TIMESTAMP) - may exist based on repository code
- Has `.is('deleted_at', null)` in repository code (lines 57, 123)

**Note:** Systems endpoint working correctly. If errors occur in production, apply same pattern as other repositories.

---

## Proper Fix: Database Migration

**RECOMMENDED:** Apply these migrations to production database to resolve schema mismatches permanently.

### Migration Script

```sql
-- ============================================================================
-- Context Module - Schema Alignment Migration
-- Version: 1.0.0
-- Date: 2026-01-17
-- Purpose: Add missing columns to align production DB with TypeScript types
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Add soft delete support to all Context tables
-- ----------------------------------------------------------------------------

ALTER TABLE processing_activities
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE physical_locations
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE systems
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Create index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_processing_activities_deleted_at
  ON processing_activities(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_vendors_deleted_at
  ON vendors(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_physical_locations_deleted_at
  ON physical_locations(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_data_categories_deleted_at
  ON data_categories(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_systems_deleted_at
  ON systems(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 2. Add audit trail columns
-- ----------------------------------------------------------------------------

ALTER TABLE processing_activities
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE physical_locations
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- ----------------------------------------------------------------------------
-- 3. Add data lineage column
-- ----------------------------------------------------------------------------

ALTER TABLE processing_activities
  ADD COLUMN IF NOT EXISTS data_source VARCHAR(255) DEFAULT 'manual';

-- ----------------------------------------------------------------------------
-- 4. Add jurisdictions localized names
-- ----------------------------------------------------------------------------

ALTER TABLE jurisdictions
  ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
  ADD COLUMN IF NOT EXISTS name_sk VARCHAR(255);

-- Populate with country code as fallback (update manually later)
UPDATE jurisdictions SET name_en = country_code WHERE name_en IS NULL;
UPDATE jurisdictions SET name_sk = country_code WHERE name_sk IS NULL;

-- Create index for searching by name
CREATE INDEX IF NOT EXISTS idx_jurisdictions_name_en
  ON jurisdictions(name_en);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_name_sk
  ON jurisdictions(name_sk);

-- ----------------------------------------------------------------------------
-- 5. Fix physical_locations schema - CRITICAL
-- ----------------------------------------------------------------------------

-- Add missing descriptive columns
ALTER TABLE physical_locations
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS address VARCHAR(500),
  ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Add jurisdiction_id foreign key column
ALTER TABLE physical_locations
  ADD COLUMN IF NOT EXISTS jurisdiction_id UUID REFERENCES jurisdictions(id);

-- Migrate existing country_code data to jurisdiction_id
UPDATE physical_locations pl
SET jurisdiction_id = j.id
FROM jurisdictions j
WHERE pl.country_code = j.country_code
  AND pl.jurisdiction_id IS NULL;

-- Create index for jurisdiction lookups
CREATE INDEX IF NOT EXISTS idx_physical_locations_jurisdiction_id
  ON physical_locations(jurisdiction_id);

-- After migration complete, country_code can be dropped or kept for denormalization
-- Recommend keeping country_code for performance but make it nullable:
ALTER TABLE physical_locations ALTER COLUMN country_code DROP NOT NULL;

-- ----------------------------------------------------------------------------
-- 6. Fix enum values
-- ----------------------------------------------------------------------------

-- Add 'employment' to special_category_basis enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'employment'
    AND enumtypid = 'special_category_basis'::regtype
  ) THEN
    ALTER TYPE special_category_basis ADD VALUE 'employment';
  END IF;
END$$;

-- Note: Cannot add 'anonymous' to data_category_type enum - intentionally excluded
-- Database design decision to only track personal data types (personal, special, criminal)

-- ----------------------------------------------------------------------------
-- 7. Add parent_id column for hierarchical structure
-- ----------------------------------------------------------------------------

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES data_categories(id) ON DELETE SET NULL;

-- Create index for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_data_categories_parent_id
  ON data_categories(parent_id);

-- ----------------------------------------------------------------------------
-- 8. Add special_category_basis column for GDPR Article 9 compliance
-- ----------------------------------------------------------------------------

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS special_category_basis special_category_basis DEFAULT NULL;

-- ----------------------------------------------------------------------------
-- 9. Update existing records with default values
-- ----------------------------------------------------------------------------

-- Set created_by/updated_by to first admin user for existing records
-- Adjust this based on your actual admin user ID
UPDATE processing_activities
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

UPDATE vendors
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

UPDATE physical_locations
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

UPDATE data_categories
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

COMMIT;
```

---

## After Migration: Revert Workarounds

Once migration is applied to production, **remove repository overrides** to use BaseRepository default behavior:

### Files to Update

1. **processing-activity.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `prepareCreateData()` override (or simplify to not filter employment)
   - Remove `prepareUpdateData()` override (or simplify to not filter employment)
   - Remove `delete()` override

2. **vendor.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `findByIdWithRelations()` modifications

3. **jurisdiction.repository.ts** (v3.25.40)
   - Remove `findMany()` override (restore name_en/name_sk ordering)
   - Remove `findEuEeaJurisdictions()` override
   - Remove `findWithAdequacyDecision()` override
   - Remove `findWithoutAdequacyDecision()` override
   - Remove `search()` override (restore name search)
   - Remove `getPopularJurisdictions()` override

4. **physical-location.repository.ts** ⚠️ CRITICAL - MAJOR REFACTOR REQUIRED
   - Remove `enrichWithJurisdictionId()` helper method completely
   - Remove `findMany()` override - restore standard query with jurisdiction_id filter
   - Remove `findById()` override - restore standard query
   - Replace `prepareCreateDataAsync()` with standard `prepareCreateData()` - use jurisdiction_id directly
   - Replace `prepareUpdateDataAsync()` with standard `prepareUpdateData()` - use jurisdiction_id directly
   - Remove `create()` override - use base class implementation
   - Remove `update()` override - use base class implementation
   - Remove `findByJurisdiction()` override - use standard jurisdiction_id filtering
   - Remove `getAvailableLocations()` override
   - Remove `advancedSearch()` override - use standard jurisdiction_id filtering
   - Re-enable `applyIncludes()` - restore jurisdiction joins
   - Re-enable `findByIdWithJurisdiction()` - restore foreign key joins
   - Re-enable `findManyWithJurisdictions()` - restore proper joins

5. **LocationForm.tsx** (Frontend)
   - Simplify jurisdiction dropdown handling - no special enrichment needed
   - Edit form will automatically show jurisdiction_id from database

6. **data-category.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `prepareCreateData()` override
   - Remove `prepareUpdateData()` override
   - Remove `nameExistsInParent()` override (restore parent_id filtering)
   - Remove `getChildCategories()` override (restore parent_id query)
   - Remove `delete()` override (use soft delete)

7. **data-category.service.ts**
   - Re-enable `validateParentChange()` call in updateDataCategory()
   - Re-enable `special_category_basis` validation in validateDataCategoryData()
   - Re-enable `parent_id` validation in validateDataCategoryData()

8. **DataCategoryForm.tsx** (Frontend)
   - Re-add 'anonymous' option to categoryTypeOptions (if desired after design review)
   - Parent category dropdown will work automatically with parent_id column

---

## Verification Steps

After applying migration:

```bash
# 1. Verify columns exist
psql -h <host> -U <user> -d <database> -c "
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'processing_activities'
  AND column_name IN ('deleted_at', 'created_by', 'updated_by', 'data_source');
"

# 2. Verify enum values
psql -h <host> -U <user> -d <database> -c "
  SELECT enumlabel
  FROM pg_enum
  WHERE enumtypid = 'special_category_basis'::regtype;
"

# 3. Test endpoints
curl https://dpia.avantle.ai/api/v1/context/processing-activities
curl -X POST https://dpia.avantle.ai/api/v1/context/processing-activities \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","purpose":"Test","lawful_basis":"consent"}'
```

---

## Technical Debt

**Current State:**
- ✅ Workarounds functional (v3.25.19 - v3.25.44)
- ✅ All Context CRUD operations working (Systems, Vendors, Locations, Data Categories, Processing Activities)
- ⚠️ Complex bidirectional translation layer for physical_locations (jurisdiction_id ↔ country_code)
- ⚠️ Edit form dropdowns require manual re-selection in some modules (UX degradation)
- ❌ Soft delete unavailable (hard delete only)
- ❌ Audit trail incomplete (missing created_by, updated_by)
- ❌ Data lineage tracking missing
- ❌ Hierarchical data categories unavailable (no parent_id)
- ❌ GDPR Article 9 basis tracking unavailable (no special_category_basis)

**Target State:**
- ✅ Schema aligned with TypeScript types
- ✅ Soft delete operational across all tables
- ✅ Full audit trail (created_by, updated_by tracking)
- ✅ Data lineage tracked (data_source column)
- ✅ Hierarchical data categories working (parent_id relationships)
- ✅ GDPR Article 9 compliance (special_category_basis tracking)
- ✅ Simplified repository code (remove all workaround overrides)
- ✅ Jurisdictions display full names instead of codes

**Migration Priority:** HIGH
**Estimated Effort:** 1 hour (migration) + 4 hours (testing + revert workarounds + verification)

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v3.25.24 | 2026-01-17 | Processing activities: deleted_at workaround |
| v3.25.26 | 2026-01-17 | Processing activities: audit columns workaround |
| v3.25.27 | 2026-01-17 | Processing activities: data_source whitelist |
| v3.25.28 | 2026-01-17 | Vendors: deleted_at workaround |
| v3.25.29 | 2026-01-17 | Processing activities: employment enum filter |
| v3.25.30 | 2026-01-17 | Preventive: locations, data-categories |
| v3.25.32 | 2026-01-17 | Data categories: parent_id missing (confirmed) |
| v3.25.33 | 2026-01-17 | Data categories: special_category_basis missing (confirmed) |
| v3.25.34 | 2026-01-17 | Data categories: validation + getChildCategories fix |
| v3.25.35 | 2026-01-17 | Data categories: delete() hard delete fix |
| v3.25.39 | 2026-01-17 | Locations: Complete form rewrite - schema mismatch fix |
| v3.25.40 | 2026-01-17 | Jurisdictions: name_en/name_sk missing - use country_code |
| v3.25.41 | 2026-01-17 | Locations: description/address/city missing |
| v3.25.42 | 2026-01-17 | **CRITICAL:** Locations jurisdiction_id → country_code conversion |
| v3.25.43 | 2026-01-17 | Locations: Dropdown pre-selection via reverse enrichment |
| v3.25.44 | 2026-01-17 | Data categories: Remove 'anonymous' enum value |

---

**Generated:** 2026-01-17 (Phase 1 Complete)
**Updated:** 2026-01-17 (v3.25.44 - All Context modules tested and documented)
**Author:** Claude Code
**Testing Sessions:**
- v3.25.19-35: Processing Activities, Vendors, Data Categories initial discovery
- v3.25.39-44: Locations & Jurisdictions comprehensive testing, Data Categories enum fix
**Contact:** See CLAUDE.md for development context
