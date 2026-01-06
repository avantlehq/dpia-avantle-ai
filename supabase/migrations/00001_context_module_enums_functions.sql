-- Migration 1: Enums + Helper Functions + Triggers
-- Context Module - Database Schema & RLS (Supabase)

-- Enums
CREATE TYPE lawful_basis AS ENUM (
  'consent',
  'contract', 
  'legal_obligation',
  'vital_interests',
  'public_task',
  'legitimate_interests'
);

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

CREATE TYPE data_category_type AS ENUM (
  'personal',
  'special',
  'criminal'
);

CREATE TYPE data_sensitivity AS ENUM (
  'public',
  'internal',
  'confidential',
  'restricted'
);

CREATE TYPE endpoint_type AS ENUM (
  'api',
  'database', 
  'file',
  'manual',
  'message_bus'
);

CREATE TYPE vendor_role AS ENUM (
  'processor',
  'joint_controller',
  'recipient'
);

CREATE TYPE contract_type AS ENUM (
  'dpa',
  'scc',
  'bcr',
  'adequacy_decision',
  'other'
);

CREATE TYPE transfer_mechanism AS ENUM (
  'adequacy_decision',
  'scc',
  'bcr',
  'certification',
  'codes_of_conduct',
  'ad_hoc_safeguards',
  'derogation'
);

CREATE TYPE flow_direction AS ENUM (
  'inbound',
  'outbound',
  'internal'
);

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