-- Apply all Context Module migrations in sequence
-- Run this script in Supabase SQL Editor

-- Migration 1: Enums + Helper Functions + Triggers
-- Context Module - Database Schema & RLS (Supabase)

-- Check if enums already exist to avoid errors
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lawful_basis') THEN
    CREATE TYPE lawful_basis AS ENUM (
      'consent',
      'contract', 
      'legal_obligation',
      'vital_interests',
      'public_task',
      'legitimate_interests'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'special_category_basis') THEN
    CREATE TYPE special_category_basis AS ENUM (
      'explicit_consent',
      'employment_law',
      'vital_interests_no_consent',
      'public_activities',
      'manifestly_public_info',
      'legal_claims',
      'substantial_public_interest',
      'healthcare',
      'public_health',
      'archiving_research_statistics'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'data_category_type') THEN
    CREATE TYPE data_category_type AS ENUM (
      'personal',
      'special',
      'criminal'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'data_sensitivity') THEN
    CREATE TYPE data_sensitivity AS ENUM (
      'public',
      'internal',
      'confidential',
      'restricted'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'endpoint_type') THEN
    CREATE TYPE endpoint_type AS ENUM (
      'api',
      'database', 
      'file',
      'manual',
      'message_bus'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_role') THEN
    CREATE TYPE vendor_role AS ENUM (
      'processor',
      'joint_controller',
      'recipient'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_type') THEN
    CREATE TYPE contract_type AS ENUM (
      'dpa',
      'scc',
      'bcr',
      'adequacy_decision',
      'other'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transfer_mechanism') THEN
    CREATE TYPE transfer_mechanism AS ENUM (
      'adequacy_decision',
      'scc',
      'bcr',
      'certification',
      'codes_of_conduct',
      'ad_hoc_safeguards',
      'derogation'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flow_direction') THEN
    CREATE TYPE flow_direction AS ENUM (
      'inbound',
      'outbound',
      'internal'
    );
  END IF;
END $$;

-- Helper function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function for email validation
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function for ISO 3166-1 alpha-2 validation
CREATE OR REPLACE FUNCTION is_valid_country_code(code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN code ~* '^[A-Z]{2}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add criticality and entity_status enums (if needed from other migrations)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'criticality') THEN
    CREATE TYPE criticality AS ENUM (
      'low',
      'medium',
      'high',
      'critical'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_status') THEN
    CREATE TYPE entity_status AS ENUM (
      'active',
      'inactive',
      'draft',
      'archived'
    );
  END IF;
END $$;

-- === MIGRATION 2: Tables Creation ===

-- jurisdictions table
CREATE TABLE IF NOT EXISTS jurisdictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL CHECK (length(country_code) = 2),
  jurisdiction_type TEXT NOT NULL CHECK (jurisdiction_type IN ('eu_member_state', 'eea_country', 'third_country')),
  adequacy_status TEXT NOT NULL CHECK (adequacy_status IN ('adequate', 'not_adequate', 'partially_adequate')),
  adequacy_decision_date DATE,
  adequacy_decision_reference TEXT,
  safeguards_required BOOLEAN NOT NULL DEFAULT false,
  safeguards_description TEXT,
  data_localization_requirements BOOLEAN NOT NULL DEFAULT false,
  status entity_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_country_code CHECK (is_valid_country_code(country_code)),
  CONSTRAINT unique_jurisdiction_per_workspace UNIQUE (workspace_id, country_code)
);

-- physical_locations table
CREATE TABLE IF NOT EXISTS physical_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state_province TEXT,
  country_code TEXT NOT NULL,
  postal_code TEXT,
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  security_measures TEXT[],
  access_controls TEXT[],
  environmental_controls TEXT[],
  is_primary_location BOOLEAN NOT NULL DEFAULT false,
  status entity_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_country_code CHECK (is_valid_country_code(country_code))
);

-- vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  contact_email TEXT CHECK (is_valid_email(contact_email)),
  primary_contact TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state_province TEXT,
  country_code TEXT,
  postal_code TEXT,
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  vendor_role vendor_role NOT NULL,
  has_dpa BOOLEAN NOT NULL DEFAULT false,
  dpa_signed_date DATE,
  dpa_expires DATE,
  contract_reference TEXT,
  iso_certifications TEXT[],
  security_assessment_date DATE,
  security_rating TEXT CHECK (security_rating IN ('low', 'medium', 'high')),
  privacy_policy_url TEXT,
  data_breach_notification_email TEXT CHECK (is_valid_email(data_breach_notification_email)),
  status entity_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- systems table
CREATE TABLE IF NOT EXISTS systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  system_type TEXT,
  version TEXT,
  vendor_id UUID REFERENCES vendors(id),
  primary_location_id UUID REFERENCES physical_locations(id),
  criticality criticality NOT NULL DEFAULT 'medium',
  availability_requirements TEXT,
  backup_frequency TEXT,
  data_retention_policy TEXT,
  encryption_at_rest BOOLEAN NOT NULL DEFAULT false,
  encryption_in_transit BOOLEAN NOT NULL DEFAULT false,
  access_logging_enabled BOOLEAN NOT NULL DEFAULT false,
  owner_team TEXT,
  technical_contact TEXT,
  business_contact TEXT,
  maintenance_window TEXT,
  last_security_review DATE,
  next_security_review DATE,
  compliance_frameworks TEXT[],
  status entity_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- data_categories table
CREATE TABLE IF NOT EXISTS data_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_type data_category_type NOT NULL DEFAULT 'personal',
  is_special_category BOOLEAN NOT NULL DEFAULT false,
  sensitivity data_sensitivity NOT NULL DEFAULT 'internal',
  retention_period TEXT,
  disposal_method TEXT,
  legal_basis_notes TEXT,
  examples TEXT[],
  related_regulations TEXT[],
  status entity_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT unique_category_per_workspace UNIQUE (workspace_id, name)
);

-- processing_activities table
CREATE TABLE IF NOT EXISTS processing_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  purpose TEXT,
  lawful_basis lawful_basis NOT NULL,
  lawful_basis_explanation TEXT,
  special_category_basis special_category_basis,
  special_category_explanation TEXT,
  data_subject_categories TEXT,
  automated_decision_making BOOLEAN NOT NULL DEFAULT false,
  profiling BOOLEAN NOT NULL DEFAULT false,
  profiling_description TEXT,
  data_sources TEXT[],
  recipients TEXT[],
  international_transfers BOOLEAN NOT NULL DEFAULT false,
  transfer_countries TEXT[],
  transfer_safeguards TEXT,
  retention_period TEXT,
  disposal_method TEXT,
  technical_security_measures TEXT[],
  organizational_security_measures TEXT[],
  dpo_review_required BOOLEAN NOT NULL DEFAULT true,
  last_review_date DATE,
  review_date DATE,
  controller_name TEXT,
  controller_contact TEXT,
  joint_controllers TEXT[],
  status entity_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === Add triggers for updated_at ===

CREATE TRIGGER update_jurisdictions_updated_at
  BEFORE UPDATE ON jurisdictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_physical_locations_updated_at
  BEFORE UPDATE ON physical_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_systems_updated_at
  BEFORE UPDATE ON systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_data_categories_updated_at
  BEFORE UPDATE ON data_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_processing_activities_updated_at
  BEFORE UPDATE ON processing_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- === Enable RLS on all tables ===

ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_activities ENABLE ROW LEVEL SECURITY;

-- === Create RLS Policies ===

-- Policies for jurisdictions
CREATE POLICY "Users can view jurisdictions in their workspace"
  ON jurisdictions FOR SELECT
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can insert jurisdictions in their workspace"
  ON jurisdictions FOR INSERT
  WITH CHECK (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can update jurisdictions in their workspace"
  ON jurisdictions FOR UPDATE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can delete jurisdictions in their workspace"
  ON jurisdictions FOR DELETE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

-- Policies for physical_locations
CREATE POLICY "Users can view physical locations in their workspace"
  ON physical_locations FOR SELECT
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can insert physical locations in their workspace"
  ON physical_locations FOR INSERT
  WITH CHECK (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can update physical locations in their workspace"
  ON physical_locations FOR UPDATE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can delete physical locations in their workspace"
  ON physical_locations FOR DELETE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

-- Policies for vendors
CREATE POLICY "Users can view vendors in their workspace"
  ON vendors FOR SELECT
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can insert vendors in their workspace"
  ON vendors FOR INSERT
  WITH CHECK (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can update vendors in their workspace"
  ON vendors FOR UPDATE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can delete vendors in their workspace"
  ON vendors FOR DELETE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

-- Policies for systems
CREATE POLICY "Users can view systems in their workspace"
  ON systems FOR SELECT
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can insert systems in their workspace"
  ON systems FOR INSERT
  WITH CHECK (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can update systems in their workspace"
  ON systems FOR UPDATE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can delete systems in their workspace"
  ON systems FOR DELETE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

-- Policies for data_categories
CREATE POLICY "Users can view data categories in their workspace"
  ON data_categories FOR SELECT
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can insert data categories in their workspace"
  ON data_categories FOR INSERT
  WITH CHECK (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can update data categories in their workspace"
  ON data_categories FOR UPDATE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can delete data categories in their workspace"
  ON data_categories FOR DELETE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

-- Policies for processing_activities
CREATE POLICY "Users can view processing activities in their workspace"
  ON processing_activities FOR SELECT
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can insert processing activities in their workspace"
  ON processing_activities FOR INSERT
  WITH CHECK (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can update processing activities in their workspace"
  ON processing_activities FOR UPDATE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

CREATE POLICY "Users can delete processing activities in their workspace"
  ON processing_activities FOR DELETE
  USING (workspace_id = current_setting('request.jwt.claims', true)::json->>'workspace_id'::uuid);

-- === Insert default jurisdictions ===

INSERT INTO jurisdictions (
  tenant_id, 
  workspace_id,
  name,
  country_code,
  jurisdiction_type,
  adequacy_status,
  adequacy_decision_date,
  adequacy_decision_reference,
  safeguards_required,
  data_localization_requirements
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'European Union - Slovakia',
    'SK',
    'eu_member_state',
    'adequate',
    '2018-05-25',
    'GDPR Article 45',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'United States',
    'US',
    'third_country',
    'not_adequate',
    NULL,
    'Privacy Shield invalidated by Schrems II',
    true,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'United Kingdom',
    'GB',
    'third_country',
    'adequate',
    '2021-06-28',
    'Commission Implementing Decision (EU) 2021/1772',
    false,
    false
  )
ON CONFLICT (workspace_id, country_code) DO NOTHING;

-- === Insert default data categories ===

INSERT INTO data_categories (
  tenant_id,
  workspace_id,
  name,
  description,
  category_type,
  is_special_category,
  sensitivity
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Contact Information',
    'Basic contact details like name, email, phone number',
    'personal',
    false,
    'internal'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Financial Information',
    'Payment details, bank account information, financial records',
    'personal',
    false,
    'confidential'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Health Data',
    'Medical records, health insurance information, fitness data',
    'special',
    true,
    'restricted'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Employment Data',
    'HR records, salary information, performance reviews',
    'personal',
    false,
    'confidential'
  )
ON CONFLICT (workspace_id, name) DO NOTHING;

-- Migration completed successfully
SELECT 'Context Module Database Setup Complete!' as result;