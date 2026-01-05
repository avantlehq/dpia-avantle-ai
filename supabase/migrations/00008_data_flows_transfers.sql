-- Migration 8: Data Flows + Edges + Joins + Cross-Border Transfers (TENANT-SCOPED)
-- Context Module - Database Schema & RLS (Supabase)

-- Data flows table
CREATE TABLE data_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  purpose text,
  flow_direction flow_direction NOT NULL,
  frequency text,
  volume_estimate text,
  criticality text CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL
);

-- Data flow edges table (directed graph)
CREATE TABLE data_flow_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  data_flow_id uuid NOT NULL,
  from_system_id uuid,
  from_vendor_id uuid,
  to_system_id uuid,
  to_vendor_id uuid,
  edge_order integer NOT NULL DEFAULT 0,
  description text,
  encryption_in_transit boolean DEFAULT false,
  authentication_required boolean DEFAULT true,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT fk_data_flow_edges_flow
    FOREIGN KEY (data_flow_id) REFERENCES data_flows(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_data_flow_edges_from_system
    FOREIGN KEY (from_system_id) REFERENCES systems(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_data_flow_edges_from_vendor
    FOREIGN KEY (from_vendor_id) REFERENCES vendors(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_data_flow_edges_to_system
    FOREIGN KEY (to_system_id) REFERENCES systems(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_data_flow_edges_to_vendor
    FOREIGN KEY (to_vendor_id) REFERENCES vendors(id)
    ON DELETE SET NULL,
  CONSTRAINT data_flow_edges_endpoint_check
    CHECK (
      (from_system_id IS NOT NULL OR from_vendor_id IS NOT NULL) AND
      (to_system_id IS NOT NULL OR to_vendor_id IS NOT NULL) AND
      (from_system_id IS NULL OR from_vendor_id IS NULL) AND
      (to_system_id IS NULL OR to_vendor_id IS NULL)
    )
);

-- Data flow - Data categories join table
CREATE TABLE data_flow_data_categories (
  data_flow_id uuid NOT NULL,
  data_category_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (data_flow_id, data_category_id),
  
  CONSTRAINT fk_data_flow_data_categories_flow
    FOREIGN KEY (data_flow_id) REFERENCES data_flows(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_data_flow_data_categories_category
    FOREIGN KEY (data_category_id) REFERENCES data_categories(id)
    ON DELETE CASCADE
);

-- Processing activities - Data flows join table
CREATE TABLE processing_data_flows (
  processing_activity_id uuid NOT NULL,
  data_flow_id uuid NOT NULL,
  flow_purpose text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (processing_activity_id, data_flow_id),
  
  CONSTRAINT fk_processing_data_flows_activity
    FOREIGN KEY (processing_activity_id) REFERENCES processing_activities(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_processing_data_flows_flow
    FOREIGN KEY (data_flow_id) REFERENCES data_flows(id)
    ON DELETE CASCADE
);

-- Cross-border transfers table
CREATE TABLE cross_border_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  data_flow_edge_id uuid NOT NULL,
  exporter_jurisdiction_id uuid NOT NULL,
  importer_jurisdiction_id uuid NOT NULL,
  transfer_mechanism transfer_mechanism NOT NULL,
  adequacy_decision_ref text,
  safeguards_description text,
  tia_required boolean DEFAULT false,
  tia_reference text,
  tia_completed_date date,
  derogation_justification text,
  risk_assessment_completed boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT fk_cross_border_transfers_edge
    FOREIGN KEY (data_flow_edge_id) REFERENCES data_flow_edges(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cross_border_transfers_exporter_jurisdiction
    FOREIGN KEY (exporter_jurisdiction_id) REFERENCES jurisdictions(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_cross_border_transfers_importer_jurisdiction
    FOREIGN KEY (importer_jurisdiction_id) REFERENCES jurisdictions(id)
    ON DELETE RESTRICT,
  CONSTRAINT cross_border_transfers_different_jurisdictions
    CHECK (exporter_jurisdiction_id != importer_jurisdiction_id),
  CONSTRAINT cross_border_transfers_tia_check
    CHECK (
      (tia_required = false) OR 
      (tia_required = true AND tia_reference IS NOT NULL)
    ),
  CONSTRAINT cross_border_transfers_adequacy_check
    CHECK (
      (transfer_mechanism != 'adequacy_decision') OR 
      (transfer_mechanism = 'adequacy_decision' AND adequacy_decision_ref IS NOT NULL)
    ),
  CONSTRAINT cross_border_transfers_derogation_check
    CHECK (
      (transfer_mechanism != 'derogation') OR 
      (transfer_mechanism = 'derogation' AND derogation_justification IS NOT NULL)
    )
);

-- Indexes for data_flows
CREATE INDEX idx_data_flows_tenant_workspace ON data_flows(tenant_id, workspace_id);
CREATE INDEX idx_data_flows_tenant_workspace_status ON data_flows(tenant_id, workspace_id, status);
CREATE INDEX idx_data_flows_created_at ON data_flows(created_at);
CREATE INDEX idx_data_flows_name ON data_flows(name);
CREATE INDEX idx_data_flows_direction ON data_flows(flow_direction);
CREATE INDEX idx_data_flows_criticality ON data_flows(criticality);

-- Indexes for data_flow_edges
CREATE INDEX idx_data_flow_edges_tenant_workspace ON data_flow_edges(tenant_id, workspace_id);
CREATE INDEX idx_data_flow_edges_tenant_workspace_status ON data_flow_edges(tenant_id, workspace_id, status);
CREATE INDEX idx_data_flow_edges_created_at ON data_flow_edges(created_at);
CREATE INDEX idx_data_flow_edges_flow_id ON data_flow_edges(data_flow_id);
CREATE INDEX idx_data_flow_edges_from_system ON data_flow_edges(from_system_id);
CREATE INDEX idx_data_flow_edges_from_vendor ON data_flow_edges(from_vendor_id);
CREATE INDEX idx_data_flow_edges_to_system ON data_flow_edges(to_system_id);
CREATE INDEX idx_data_flow_edges_to_vendor ON data_flow_edges(to_vendor_id);
CREATE INDEX idx_data_flow_edges_order ON data_flow_edges(data_flow_id, edge_order);

-- Indexes for join tables
CREATE INDEX idx_data_flow_data_categories_flow_id ON data_flow_data_categories(data_flow_id);
CREATE INDEX idx_data_flow_data_categories_category_id ON data_flow_data_categories(data_category_id);
CREATE INDEX idx_data_flow_data_categories_created_at ON data_flow_data_categories(created_at);

CREATE INDEX idx_processing_data_flows_activity_id ON processing_data_flows(processing_activity_id);
CREATE INDEX idx_processing_data_flows_flow_id ON processing_data_flows(data_flow_id);
CREATE INDEX idx_processing_data_flows_created_at ON processing_data_flows(created_at);

-- Indexes for cross_border_transfers
CREATE INDEX idx_cross_border_transfers_tenant_workspace ON cross_border_transfers(tenant_id, workspace_id);
CREATE INDEX idx_cross_border_transfers_tenant_workspace_status ON cross_border_transfers(tenant_id, workspace_id, status);
CREATE INDEX idx_cross_border_transfers_created_at ON cross_border_transfers(created_at);
CREATE INDEX idx_cross_border_transfers_edge_id ON cross_border_transfers(data_flow_edge_id);
CREATE INDEX idx_cross_border_transfers_exporter ON cross_border_transfers(exporter_jurisdiction_id);
CREATE INDEX idx_cross_border_transfers_importer ON cross_border_transfers(importer_jurisdiction_id);
CREATE INDEX idx_cross_border_transfers_mechanism ON cross_border_transfers(transfer_mechanism);
CREATE INDEX idx_cross_border_transfers_tia_required ON cross_border_transfers(tia_required);

-- Updated at triggers
CREATE TRIGGER trigger_data_flows_updated_at
  BEFORE UPDATE ON data_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_data_flow_edges_updated_at
  BEFORE UPDATE ON data_flow_edges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_cross_border_transfers_updated_at
  BEFORE UPDATE ON cross_border_transfers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies for data_flows
ALTER TABLE data_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_flows_select_policy ON data_flows
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY data_flows_insert_policy ON data_flows
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY data_flows_update_policy ON data_flows
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  )
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    updated_by = (auth.jwt() ->> 'sub')::uuid
  );

-- RLS policies for data_flow_edges
ALTER TABLE data_flow_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_flow_edges_select_policy ON data_flow_edges
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY data_flow_edges_insert_policy ON data_flow_edges
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY data_flow_edges_update_policy ON data_flow_edges
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  )
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    updated_by = (auth.jwt() ->> 'sub')::uuid
  );

-- RLS policies for cross_border_transfers
ALTER TABLE cross_border_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY cross_border_transfers_select_policy ON cross_border_transfers
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY cross_border_transfers_insert_policy ON cross_border_transfers
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY cross_border_transfers_update_policy ON cross_border_transfers
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  )
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    updated_by = (auth.jwt() ->> 'sub')::uuid
  );

-- RLS policies for join tables
ALTER TABLE data_flow_data_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_data_flows ENABLE ROW LEVEL SECURITY;

-- data_flow_data_categories policies
CREATE POLICY data_flow_data_categories_select_policy ON data_flow_data_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM data_flows df 
      WHERE df.id = data_flow_id 
      AND df.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND df.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY data_flow_data_categories_insert_policy ON data_flow_data_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM data_flows df 
      WHERE df.id = data_flow_id 
      AND df.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND df.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY data_flow_data_categories_delete_policy ON data_flow_data_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM data_flows df 
      WHERE df.id = data_flow_id 
      AND df.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND df.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

-- processing_data_flows policies
CREATE POLICY processing_data_flows_select_policy ON processing_data_flows
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY processing_data_flows_insert_policy ON processing_data_flows
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY processing_data_flows_delete_policy ON processing_data_flows
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );