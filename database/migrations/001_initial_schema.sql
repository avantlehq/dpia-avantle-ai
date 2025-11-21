-- DPIA Agent Database Schema
-- Initial migration for Phase 1B
-- Implements multi-tenant architecture with RLS

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE assessment_status AS ENUM ('draft', 'in_progress', 'in_review', 'completed', 'archived');
CREATE TYPE member_role AS ENUM ('admin', 'dpo', 'editor', 'viewer');

-- Users table (integrates with Supabase Auth)
CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tenants table (organizations using the system)
CREATE TABLE tenants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    domain text UNIQUE,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Workspaces table (projects/departments within a tenant)
CREATE TABLE workspaces (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Members table (user access to workspaces)
CREATE TABLE members (
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'viewer',
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, workspace_id)
);

-- Assessments table (main DPIA assessments)
CREATE TABLE assessments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by uuid REFERENCES users(id),
    name text NOT NULL,
    description text,
    status assessment_status DEFAULT 'draft',
    schema_version text DEFAULT 'dpia-basic-eu-v1',
    -- Store all assessment data as JSON for flexibility
    data jsonb DEFAULT '{}',
    -- Track completion progress
    completed_sections text[] DEFAULT '{}',
    -- Precheck results if started from precheck
    precheck_result jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Assessment answers table (responses to template fields)
CREATE TABLE assessment_answers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    section_id text NOT NULL,
    field_id text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (assessment_id, section_id, field_id)
);

-- Precheck assessments table (quick DPIA necessity evaluations)
CREATE TABLE precheck_assessments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by uuid REFERENCES users(id),
    -- Store answers as JSON for flexibility
    answers jsonb NOT NULL,
    -- Store evaluation result
    result jsonb NOT NULL,
    -- Link to full DPIA if created
    assessment_id uuid REFERENCES assessments(id),
    created_at timestamptz DEFAULT now()
);

-- Domain events table (audit trail and system events)
CREATE TABLE domain_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    workspace_id uuid REFERENCES workspaces(id),
    created_by uuid REFERENCES users(id),
    payload jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Export history table (track generated documents)
CREATE TABLE export_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    export_type text NOT NULL, -- 'pdf', 'docx', 'json'
    file_path text,
    file_size bigint,
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_assessments_workspace_id ON assessments(workspace_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);
CREATE INDEX idx_assessment_answers_assessment_id ON assessment_answers(assessment_id);
CREATE INDEX idx_assessment_answers_section_id ON assessment_answers(assessment_id, section_id);
CREATE INDEX idx_precheck_assessments_workspace_id ON precheck_assessments(workspace_id);
CREATE INDEX idx_domain_events_entity ON domain_events(entity_type, entity_id);
CREATE INDEX idx_domain_events_workspace_id ON domain_events(workspace_id);
CREATE INDEX idx_export_history_assessment_id ON export_history(assessment_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE precheck_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for workspaces (users can only see workspaces they're members of)
CREATE POLICY "Users can view own workspaces" ON workspaces
    FOR SELECT USING (
        id IN (
            SELECT workspace_id FROM members WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for members
CREATE POLICY "Users can view workspace members" ON members
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM members WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for assessments
CREATE POLICY "Users can view workspace assessments" ON assessments
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create assessments in their workspaces" ON assessments
    FOR INSERT WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM members 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'dpo', 'editor')
        )
    );

CREATE POLICY "Users can update assessments in their workspaces" ON assessments
    FOR UPDATE USING (
        workspace_id IN (
            SELECT workspace_id FROM members 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'dpo', 'editor')
        )
    );

-- RLS Policies for assessment_answers
CREATE POLICY "Users can view assessment answers" ON assessment_answers
    FOR SELECT USING (
        assessment_id IN (
            SELECT a.id FROM assessments a
            JOIN members m ON m.workspace_id = a.workspace_id
            WHERE m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage assessment answers" ON assessment_answers
    FOR ALL USING (
        assessment_id IN (
            SELECT a.id FROM assessments a
            JOIN members m ON m.workspace_id = a.workspace_id
            WHERE m.user_id = auth.uid() 
            AND m.role IN ('admin', 'dpo', 'editor')
        )
    );

-- RLS Policies for precheck_assessments
CREATE POLICY "Users can view workspace precheck assessments" ON precheck_assessments
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create precheck assessments" ON precheck_assessments
    FOR INSERT WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM members WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for domain_events (audit trail)
CREATE POLICY "Users can view workspace events" ON domain_events
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM members WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for export_history
CREATE POLICY "Users can view export history" ON export_history
    FOR SELECT USING (
        assessment_id IN (
            SELECT a.id FROM assessments a
            JOIN members m ON m.workspace_id = a.workspace_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_answers_updated_at BEFORE UPDATE ON assessment_answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial seed data for development
INSERT INTO tenants (id, name, domain) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Demo Organization', 'demo.dpia.local');

INSERT INTO workspaces (id, tenant_id, name, description) VALUES 
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Default Workspace', 'Default workspace for assessments');