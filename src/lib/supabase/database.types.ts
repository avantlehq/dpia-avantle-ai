export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          id: string
          name: string
          domain: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          id: string
          tenant_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      members: {
        Row: {
          user_id: string
          workspace_id: string
          role: string
          created_at: string
        }
        Insert: {
          user_id: string
          workspace_id: string
          role: string
          created_at?: string
        }
        Update: {
          user_id?: string
          workspace_id?: string
          role?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      assessments: {
        Row: {
          id: string
          workspace_id: string
          created_by: string | null
          name: string
          description: string | null
          status: string
          schema_version: string
          data: Json
          completed_sections: string[]
          precheck_result: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          created_by?: string | null
          name: string
          description?: string | null
          status?: string
          schema_version?: string
          data?: Json
          completed_sections?: string[]
          precheck_result?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          created_by?: string | null
          name?: string
          description?: string | null
          status?: string
          schema_version?: string
          data?: Json
          completed_sections?: string[]
          precheck_result?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      assessment_answers: {
        Row: {
          id: string
          assessment_id: string
          section_id: string
          field_id: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          section_id: string
          field_id: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          section_id?: string
          field_id?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_answers_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          }
        ]
      }
      precheck_assessments: {
        Row: {
          id: string
          workspace_id: string | null
          created_by: string | null
          answers: Json
          result: Json
          assessment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          created_by?: string | null
          answers: Json
          result: Json
          assessment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          created_by?: string | null
          answers?: Json
          result?: Json
          assessment_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "precheck_assessments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precheck_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          }
        ]
      }
      domain_events: {
        Row: {
          id: string
          type: string
          entity_type: string
          entity_id: string
          workspace_id: string | null
          created_by: string | null
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          entity_type: string
          entity_id: string
          workspace_id?: string | null
          created_by?: string | null
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          entity_type?: string
          entity_id?: string
          workspace_id?: string | null
          created_by?: string | null
          payload?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      export_history: {
        Row: {
          id: string
          assessment_id: string
          export_type: string
          file_path: string | null
          file_size: number | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          export_type: string
          file_path?: string | null
          file_size?: number | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          export_type?: string
          file_path?: string | null
          file_size?: number | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_history_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}