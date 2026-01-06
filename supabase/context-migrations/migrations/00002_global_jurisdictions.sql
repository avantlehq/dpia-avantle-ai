-- Migration 2: Global Jurisdictions (GLOBAL)
-- Context Module - Database Schema & RLS (Supabase)

-- Global jurisdictions table
CREATE TABLE jurisdictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  name_en text NOT NULL,
  name_sk text NOT NULL,
  gdpr_adequacy boolean NOT NULL DEFAULT false,
  supervisory_authority text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT jurisdictions_country_code_check CHECK (is_valid_country_code(country_code)),
  CONSTRAINT jurisdictions_country_code_unique UNIQUE (country_code)
);

-- Indexes
CREATE INDEX idx_jurisdictions_country_code ON jurisdictions(country_code);
CREATE INDEX idx_jurisdictions_gdpr_adequacy ON jurisdictions(gdpr_adequacy);
CREATE INDEX idx_jurisdictions_created_at ON jurisdictions(created_at);

-- Updated at trigger
CREATE TRIGGER trigger_jurisdictions_updated_at
  BEFORE UPDATE ON jurisdictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies for global table
ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY jurisdictions_select_policy ON jurisdictions
  FOR SELECT
  USING (true);

-- Service role write access only
CREATE POLICY jurisdictions_insert_policy ON jurisdictions
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY jurisdictions_update_policy ON jurisdictions
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY jurisdictions_delete_policy ON jurisdictions
  FOR DELETE
  USING (auth.role() = 'service_role');