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
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
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
          name: string
          description: string | null
          status: string
          schema_version: string
          data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          status?: string
          schema_version?: string
          data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          status?: string
          schema_version?: string
          data?: Json
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
      domain_events: {
        Row: {
          id: string
          type: string
          entity_id: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          entity_id: string
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          entity_id?: string
          payload?: Json
          created_at?: string
        }
        Relationships: []
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