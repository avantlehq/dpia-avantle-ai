-- Rollback: Remove endpoint and security columns from data_flows table
-- Date: 2026-01-24

-- Drop indexes
DROP INDEX IF EXISTS idx_data_flows_unencrypted;
DROP INDEX IF EXISTS idx_data_flows_cross_border;
DROP INDEX IF EXISTS idx_data_flows_to_vendor;
DROP INDEX IF EXISTS idx_data_flows_from_vendor;
DROP INDEX IF EXISTS idx_data_flows_to_system;
DROP INDEX IF EXISTS idx_data_flows_from_system;

-- Drop columns
ALTER TABLE data_flows
  DROP COLUMN IF EXISTS cross_border_transfer,
  DROP COLUMN IF EXISTS encryption_in_transit,
  DROP COLUMN IF EXISTS to_vendor,
  DROP COLUMN IF EXISTS from_vendor,
  DROP COLUMN IF EXISTS to_system,
  DROP COLUMN IF EXISTS from_system;
