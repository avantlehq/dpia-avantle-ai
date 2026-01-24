-- Migration: Add endpoint and security columns to data_flows table
-- Date: 2026-01-24
-- Description: Add columns for flow endpoints (systems/vendors) and security properties

-- Add columns for flow endpoints
ALTER TABLE data_flows
  ADD COLUMN IF NOT EXISTS from_system UUID REFERENCES systems(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS to_system UUID REFERENCES systems(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS from_vendor UUID REFERENCES vendors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS to_vendor UUID REFERENCES vendors(id) ON DELETE SET NULL;

-- Add columns for security and compliance
ALTER TABLE data_flows
  ADD COLUMN IF NOT EXISTS encryption_in_transit BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS cross_border_transfer BOOLEAN DEFAULT false NOT NULL;

-- Add comments
COMMENT ON COLUMN data_flows.from_system IS 'Source system for this data flow';
COMMENT ON COLUMN data_flows.to_system IS 'Destination system for this data flow';
COMMENT ON COLUMN data_flows.from_vendor IS 'Source vendor for this data flow';
COMMENT ON COLUMN data_flows.to_vendor IS 'Destination vendor for this data flow';
COMMENT ON COLUMN data_flows.encryption_in_transit IS 'Whether data is encrypted during transmission';
COMMENT ON COLUMN data_flows.cross_border_transfer IS 'Whether this flow crosses jurisdictional boundaries';

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_data_flows_from_system ON data_flows(from_system) WHERE from_system IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_to_system ON data_flows(to_system) WHERE to_system IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_from_vendor ON data_flows(from_vendor) WHERE from_vendor IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_to_vendor ON data_flows(to_vendor) WHERE to_vendor IS NOT NULL;

-- Create index for security compliance queries
CREATE INDEX IF NOT EXISTS idx_data_flows_cross_border ON data_flows(cross_border_transfer) WHERE cross_border_transfer = true;
CREATE INDEX IF NOT EXISTS idx_data_flows_unencrypted ON data_flows(encryption_in_transit) WHERE encryption_in_transit = false;
