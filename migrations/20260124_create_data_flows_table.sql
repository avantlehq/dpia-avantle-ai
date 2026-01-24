-- Migration: Create data_flows table
-- Date: 2026-01-24
-- Description: Create data_flows table with all necessary columns for flow mapping

-- Create flow_direction enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE flow_direction AS ENUM ('inbound', 'outbound', 'bidirectional', 'internal');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create data_flows table
CREATE TABLE IF NOT EXISTS data_flows (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenancy
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,

  -- Basic flow information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  purpose TEXT,
  flow_direction flow_direction NOT NULL,
  frequency VARCHAR(255),
  volume_estimate VARCHAR(255),
  criticality VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' NOT NULL,

  -- Flow endpoints
  from_system UUID REFERENCES systems(id) ON DELETE SET NULL,
  to_system UUID REFERENCES systems(id) ON DELETE SET NULL,
  from_vendor UUID REFERENCES vendors(id) ON DELETE SET NULL,
  to_vendor UUID REFERENCES vendors(id) ON DELETE SET NULL,

  -- Security and compliance
  encryption_in_transit BOOLEAN DEFAULT true NOT NULL,
  cross_border_transfer BOOLEAN DEFAULT false NOT NULL,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID NOT NULL,
  updated_by UUID NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Add comments
COMMENT ON TABLE data_flows IS 'Data flows between systems and vendors for GDPR mapping';
COMMENT ON COLUMN data_flows.name IS 'Descriptive name of the data flow';
COMMENT ON COLUMN data_flows.flow_direction IS 'Direction of data movement: inbound, outbound, bidirectional, or internal';
COMMENT ON COLUMN data_flows.criticality IS 'Business criticality level: low, medium, high, critical';
COMMENT ON COLUMN data_flows.from_system IS 'Source system for this data flow';
COMMENT ON COLUMN data_flows.to_system IS 'Destination system for this data flow';
COMMENT ON COLUMN data_flows.from_vendor IS 'Source vendor for this data flow';
COMMENT ON COLUMN data_flows.to_vendor IS 'Destination vendor for this data flow';
COMMENT ON COLUMN data_flows.encryption_in_transit IS 'Whether data is encrypted during transmission';
COMMENT ON COLUMN data_flows.cross_border_transfer IS 'Whether this flow crosses jurisdictional boundaries';

-- Create indexes for multi-tenancy
CREATE INDEX IF NOT EXISTS idx_data_flows_tenant ON data_flows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_data_flows_workspace ON data_flows(workspace_id);

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_data_flows_from_system ON data_flows(from_system) WHERE from_system IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_to_system ON data_flows(to_system) WHERE to_system IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_from_vendor ON data_flows(from_vendor) WHERE from_vendor IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_to_vendor ON data_flows(to_vendor) WHERE to_vendor IS NOT NULL;

-- Create indexes for queries
CREATE INDEX IF NOT EXISTS idx_data_flows_flow_direction ON data_flows(flow_direction);
CREATE INDEX IF NOT EXISTS idx_data_flows_criticality ON data_flows(criticality) WHERE criticality IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_flows_status ON data_flows(status);
CREATE INDEX IF NOT EXISTS idx_data_flows_cross_border ON data_flows(cross_border_transfer) WHERE cross_border_transfer = true;
CREATE INDEX IF NOT EXISTS idx_data_flows_unencrypted ON data_flows(encryption_in_transit) WHERE encryption_in_transit = false;
CREATE INDEX IF NOT EXISTS idx_data_flows_deleted ON data_flows(deleted_at) WHERE deleted_at IS NULL;

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_data_flows_created_at ON data_flows(created_at DESC);

-- Enable Row Level Security
ALTER TABLE data_flows ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for workspace isolation
CREATE POLICY workspace_isolation ON data_flows
  FOR ALL
  USING (workspace_id = current_setting('app.current_workspace_id', TRUE)::UUID);

-- Create RLS policy to allow service role to bypass RLS
CREATE POLICY service_role_bypass ON data_flows
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_data_flows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_data_flows_updated_at
  BEFORE UPDATE ON data_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_data_flows_updated_at();
