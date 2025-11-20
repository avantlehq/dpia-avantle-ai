-- DPIA Agent Database Schema
-- Compatible with Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants table
CREATE TABLE tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members table (join table for users and workspaces)
CREATE TABLE members (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, workspace_id)
);

-- Assessments table
CREATE TABLE assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_progress', 'in_review', 'submitted', 'completed')) DEFAULT 'draft',
  schema_version TEXT NOT NULL DEFAULT '1.0',
  template_version TEXT NOT NULL DEFAULT 'dpia-basic-eu-v1',
  data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Answers table (individual form field answers)
CREATE TABLE assessment_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  field_id TEXT NOT NULL,
  value JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, section_id, field_id)
);

-- Form Sections progress tracking
CREATE TABLE form_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completion_percent INTEGER DEFAULT 0 CHECK (completion_percent >= 0 AND completion_percent <= 100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, section_id)
);

-- Risk Evaluations table
CREATE TABLE risk_evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL,
  likelihood INTEGER NOT NULL CHECK (likelihood >= 1 AND likelihood <= 5),
  impact INTEGER NOT NULL CHECK (impact >= 1 AND impact <= 5),
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 25),
  level TEXT NOT NULL CHECK (level IN ('low', 'medium', 'high', 'critical')),
  mitigation_measures TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Export History table
CREATE TABLE export_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'docx')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  exported_by UUID REFERENCES users(id),
  exported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_count INTEGER DEFAULT 0
);

-- User Preferences table
CREATE TABLE user_preferences (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'sk', 'de', 'cz')),
  email_notifications TEXT NOT NULL DEFAULT 'weekly' CHECK (email_notifications IN ('weekly', 'monthly', 'off')),
  timezone TEXT DEFAULT 'UTC',
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DPIA Pre-check Assessment table
CREATE TABLE assessment_precheck (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  answers JSONB NOT NULL DEFAULT '{}',
  result TEXT NOT NULL CHECK (result IN ('required', 'recommended', 'not_required')),
  score INTEGER NOT NULL,
  recommendation TEXT,
  created_assessment_id UUID REFERENCES assessments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domain events table
CREATE TABLE domain_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_precheck ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR ALL USING (auth.uid() = id);

-- Members can only see workspaces they belong to
CREATE POLICY "Members can view own workspaces" ON workspaces
  FOR ALL USING (
    id IN (
      SELECT workspace_id FROM members WHERE user_id = auth.uid()
    )
  );

-- Members can only see other members in their workspaces
CREATE POLICY "Members can view workspace members" ON members
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM members WHERE user_id = auth.uid()
    )
  );

-- Assessments are restricted to workspace members
CREATE POLICY "Members can view workspace assessments" ON assessments
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM members WHERE user_id = auth.uid()
    )
  );

-- Assessment answers are restricted to workspace members
CREATE POLICY "Members can manage assessment answers" ON assessment_answers
  FOR ALL USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN members m ON a.workspace_id = m.workspace_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Form sections are restricted to workspace members
CREATE POLICY "Members can manage form sections" ON form_sections
  FOR ALL USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN members m ON a.workspace_id = m.workspace_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Risk evaluations are restricted to workspace members
CREATE POLICY "Members can manage risk evaluations" ON risk_evaluations
  FOR ALL USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN members m ON a.workspace_id = m.workspace_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Export history is restricted to workspace members
CREATE POLICY "Members can view export history" ON export_history
  FOR ALL USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN members m ON a.workspace_id = m.workspace_id
      WHERE m.user_id = auth.uid()
    )
  );

-- User preferences are user-specific
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Pre-check assessments are user-specific
CREATE POLICY "Users can manage own precheck" ON assessment_precheck
  FOR ALL USING (auth.uid() = user_id);

-- Domain events are restricted to entities the user has access to
CREATE POLICY "Users can view related domain events" ON domain_events
  FOR SELECT USING (
    -- Allow if the entity is an assessment the user has access to
    entity_id IN (
      SELECT a.id FROM assessments a
      JOIN members m ON a.workspace_id = m.workspace_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_workspaces_tenant_id ON workspaces(tenant_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_workspace_id ON members(workspace_id);
CREATE INDEX idx_assessments_workspace_id ON assessments(workspace_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_updated_at ON assessments(updated_at);
CREATE INDEX idx_assessments_created_by ON assessments(created_by);
CREATE INDEX idx_assessment_answers_assessment_id ON assessment_answers(assessment_id);
CREATE INDEX idx_assessment_answers_section_field ON assessment_answers(section_id, field_id);
CREATE INDEX idx_form_sections_assessment_id ON form_sections(assessment_id);
CREATE INDEX idx_form_sections_status ON form_sections(status);
CREATE INDEX idx_risk_evaluations_assessment_id ON risk_evaluations(assessment_id);
CREATE INDEX idx_risk_evaluations_level ON risk_evaluations(level);
CREATE INDEX idx_export_history_assessment_id ON export_history(assessment_id);
CREATE INDEX idx_export_history_exported_by ON export_history(exported_by);
CREATE INDEX idx_assessment_precheck_user_id ON assessment_precheck(user_id);
CREATE INDEX idx_assessment_precheck_result ON assessment_precheck(result);
CREATE INDEX idx_domain_events_entity_id ON domain_events(entity_id);
CREATE INDEX idx_domain_events_type ON domain_events(type);
CREATE INDEX idx_domain_events_created_at ON domain_events(created_at);

-- Functions and Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_answers_updated_at
    BEFORE UPDATE ON assessment_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create default workspace and tenant for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_tenant_id UUID;
    new_workspace_id UUID;
BEGIN
    -- Create a tenant for the user
    INSERT INTO tenants (name) VALUES (NEW.email || '''s Organization')
    RETURNING id INTO new_tenant_id;
    
    -- Create a default workspace
    INSERT INTO workspaces (tenant_id, name) VALUES (new_tenant_id, 'Default Workspace')
    RETURNING id INTO new_workspace_id;
    
    -- Add user as owner of the workspace
    INSERT INTO members (user_id, workspace_id, role) VALUES (NEW.id, new_workspace_id, 'owner');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create tenant/workspace for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();