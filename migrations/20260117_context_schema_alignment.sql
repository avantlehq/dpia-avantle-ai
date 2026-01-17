-- ============================================================================
-- Context Module - Schema Alignment Migration
-- Version: 1.0.0
-- Date: 2026-01-17
-- Purpose: Add missing columns to align production DB with TypeScript types
--
-- IMPORTANT: Review this script before executing in production
-- Estimated execution time: 2-5 minutes
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

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Run these queries after migration to verify success:

-- 1. Check physical_locations has jurisdiction_id populated
-- SELECT id, name, country_code, jurisdiction_id FROM physical_locations LIMIT 10;

-- 2. Check jurisdictions has names populated
-- SELECT id, country_code, name_en, name_sk FROM jurisdictions LIMIT 10;

-- 3. Check data_categories can have parent relationships
-- SELECT id, name, parent_id FROM data_categories LIMIT 10;

-- 4. Check all tables have audit columns
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'processing_activities' AND column_name IN ('deleted_at', 'created_by', 'updated_by');

-- ============================================================================
-- Rollback Script (if needed)
-- ============================================================================

-- WARNING: This will drop all added columns and data. Use with caution.
-- Only run if migration fails and you need to revert.

/*
BEGIN;

-- Drop audit columns
ALTER TABLE processing_activities DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_at, DROP COLUMN IF EXISTS data_source;
ALTER TABLE vendors DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE physical_locations DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_at, DROP COLUMN IF EXISTS jurisdiction_id, DROP COLUMN IF EXISTS description, DROP COLUMN IF EXISTS address, DROP COLUMN IF EXISTS city;
ALTER TABLE data_categories DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_at, DROP COLUMN IF EXISTS parent_id, DROP COLUMN IF EXISTS special_category_basis;
ALTER TABLE systems DROP COLUMN IF EXISTS deleted_at;

-- Drop jurisdictions localization
ALTER TABLE jurisdictions DROP COLUMN IF EXISTS name_en, DROP COLUMN IF EXISTS name_sk;

-- Restore country_code NOT NULL constraint
ALTER TABLE physical_locations ALTER COLUMN country_code SET NOT NULL;

COMMIT;
*/
