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
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_progress', 'submitted', 'completed')) DEFAULT 'draft',
  schema_version TEXT NOT NULL DEFAULT '1.0',
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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