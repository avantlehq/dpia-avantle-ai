-- Migration 6: Add audit columns to systems tables
-- Add created_by and updated_by columns if they don't exist

-- Add audit columns to systems table
DO $$
BEGIN
  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'systems' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE systems ADD COLUMN created_by uuid;
    -- Set a default value for existing rows (use first user or system user)
    UPDATE systems SET created_by = '00000000-0000-0000-0000-000000000001' WHERE created_by IS NULL;
    ALTER TABLE systems ALTER COLUMN created_by SET NOT NULL;
  END IF;

  -- Add updated_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'systems' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE systems ADD COLUMN updated_by uuid;
    -- Set a default value for existing rows (use first user or system user)
    UPDATE systems SET updated_by = '00000000-0000-0000-0000-000000000001' WHERE updated_by IS NULL;
    ALTER TABLE systems ALTER COLUMN updated_by SET NOT NULL;
  END IF;

  -- Add deleted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'systems' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE systems ADD COLUMN deleted_at timestamptz NULL;
  END IF;
END $$;

-- Add audit columns to system_endpoints table
DO $$
BEGIN
  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_endpoints' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE system_endpoints ADD COLUMN created_by uuid;
    UPDATE system_endpoints SET created_by = '00000000-0000-0000-0000-000000000001' WHERE created_by IS NULL;
    ALTER TABLE system_endpoints ALTER COLUMN created_by SET NOT NULL;
  END IF;

  -- Add updated_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_endpoints' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE system_endpoints ADD COLUMN updated_by uuid;
    UPDATE system_endpoints SET updated_by = '00000000-0000-0000-0000-000000000001' WHERE updated_by IS NULL;
    ALTER TABLE system_endpoints ALTER COLUMN updated_by SET NOT NULL;
  END IF;

  -- Add deleted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_endpoints' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE system_endpoints ADD COLUMN deleted_at timestamptz NULL;
  END IF;
END $$;

-- Add audit column to system_locations table
DO $$
BEGIN
  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_locations' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE system_locations ADD COLUMN created_by uuid;
    UPDATE system_locations SET created_by = '00000000-0000-0000-0000-000000000001' WHERE created_by IS NULL;
    ALTER TABLE system_locations ALTER COLUMN created_by SET NOT NULL;
  END IF;
END $$;
