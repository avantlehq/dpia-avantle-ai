-- Rollback: Drop data_flows table
-- Date: 2026-01-24

-- Drop trigger
DROP TRIGGER IF EXISTS trigger_data_flows_updated_at ON data_flows;
DROP FUNCTION IF EXISTS update_data_flows_updated_at();

-- Drop RLS policies
DROP POLICY IF EXISTS service_role_bypass ON data_flows;
DROP POLICY IF EXISTS workspace_isolation ON data_flows;

-- Drop table (will cascade to dependent objects)
DROP TABLE IF EXISTS data_flows CASCADE;

-- Note: We don't drop the flow_direction enum as it might be used by other tables
-- If you need to drop it, run: DROP TYPE IF EXISTS flow_direction CASCADE;
