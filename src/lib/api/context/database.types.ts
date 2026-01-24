/**
 * Context Module - Database Types
 * 
 * TypeScript type definitions for Supabase database schema.
 * Generated to match the Context module migration files.
 */

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
      cross_border_transfers: {
        Row: {
          adequacy_decision_ref: string | null
          created_at: string
          created_by: string
          data_flow_edge_id: string
          derogation_justification: string | null
          deleted_at: string | null
          exporter_jurisdiction_id: string
          id: string
          importer_jurisdiction_id: string
          risk_assessment_completed: boolean
          safeguards_description: string | null
          status: string
          tenant_id: string
          tia_completed_date: string | null
          tia_reference: string | null
          tia_required: boolean
          transfer_mechanism: Database['public']['Enums']['transfer_mechanism']
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          adequacy_decision_ref?: string | null
          created_at?: string
          created_by: string
          data_flow_edge_id: string
          derogation_justification?: string | null
          deleted_at?: string | null
          exporter_jurisdiction_id: string
          id?: string
          importer_jurisdiction_id: string
          risk_assessment_completed?: boolean
          safeguards_description?: string | null
          status?: string
          tenant_id: string
          tia_completed_date?: string | null
          tia_reference?: string | null
          tia_required?: boolean
          transfer_mechanism: Database['public']['Enums']['transfer_mechanism']
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          adequacy_decision_ref?: string | null
          created_at?: string
          created_by?: string
          data_flow_edge_id?: string
          derogation_justification?: string | null
          deleted_at?: string | null
          exporter_jurisdiction_id?: string
          id?: string
          importer_jurisdiction_id?: string
          risk_assessment_completed?: boolean
          safeguards_description?: string | null
          status?: string
          tenant_id?: string
          tia_completed_date?: string | null
          tia_reference?: string | null
          tia_required?: boolean
          transfer_mechanism?: Database['public']['Enums']['transfer_mechanism']
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cross_border_transfers_edge"
            columns: ["data_flow_edge_id"]
            isOneToOne: false
            referencedRelation: "data_flow_edges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cross_border_transfers_exporter_jurisdiction"
            columns: ["exporter_jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cross_border_transfers_importer_jurisdiction"
            columns: ["importer_jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
        ]
      }
      data_categories: {
        Row: {
          category_type: Database['public']['Enums']['data_category_type']
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: string
          is_standard: boolean
          name: string
          parent_id: string | null
          sensitivity: Database['public']['Enums']['data_sensitivity']
          special_category_basis: Database['public']['Enums']['special_category_basis'] | null
          status: string
          tenant_id: string
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          category_type: Database['public']['Enums']['data_category_type']
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_standard?: boolean
          name: string
          parent_id?: string | null
          sensitivity?: Database['public']['Enums']['data_sensitivity']
          special_category_basis?: Database['public']['Enums']['special_category_basis'] | null
          status?: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          category_type?: Database['public']['Enums']['data_category_type']
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_standard?: boolean
          name?: string
          parent_id?: string | null
          sensitivity?: Database['public']['Enums']['data_sensitivity']
          special_category_basis?: Database['public']['Enums']['special_category_basis'] | null
          status?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_data_categories_parent"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "data_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      data_flow_data_categories: {
        Row: {
          created_at: string
          created_by: string
          data_category_id: string
          data_flow_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          data_category_id: string
          data_flow_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          data_category_id?: string
          data_flow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_data_flow_data_categories_category"
            columns: ["data_category_id"]
            isOneToOne: false
            referencedRelation: "data_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_data_flow_data_categories_flow"
            columns: ["data_flow_id"]
            isOneToOne: false
            referencedRelation: "data_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      data_flow_edges: {
        Row: {
          authentication_required: boolean
          created_at: string
          created_by: string
          data_flow_id: string
          deleted_at: string | null
          description: string | null
          edge_order: number
          encryption_in_transit: boolean
          from_system_id: string | null
          from_vendor_id: string | null
          id: string
          status: string
          tenant_id: string
          to_system_id: string | null
          to_vendor_id: string | null
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          authentication_required?: boolean
          created_at?: string
          created_by: string
          data_flow_id: string
          deleted_at?: string | null
          description?: string | null
          edge_order?: number
          encryption_in_transit?: boolean
          from_system_id?: string | null
          from_vendor_id?: string | null
          id?: string
          status?: string
          tenant_id: string
          to_system_id?: string | null
          to_vendor_id?: string | null
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          authentication_required?: boolean
          created_at?: string
          created_by?: string
          data_flow_id?: string
          deleted_at?: string | null
          description?: string | null
          edge_order?: number
          encryption_in_transit?: boolean
          from_system_id?: string | null
          from_vendor_id?: string | null
          id?: string
          status?: string
          tenant_id?: string
          to_system_id?: string | null
          to_vendor_id?: string | null
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_data_flow_edges_flow"
            columns: ["data_flow_id"]
            isOneToOne: false
            referencedRelation: "data_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_data_flow_edges_from_system"
            columns: ["from_system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_data_flow_edges_from_vendor"
            columns: ["from_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_data_flow_edges_to_system"
            columns: ["to_system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_data_flow_edges_to_vendor"
            columns: ["to_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      data_flows: {
        Row: {
          created_at: string
          created_by: string
          criticality: string | null
          cross_border_transfer: boolean
          deleted_at: string | null
          description: string | null
          encryption_in_transit: boolean
          flow_direction: Database['public']['Enums']['flow_direction']
          frequency: string | null
          from_system: string | null
          from_vendor: string | null
          id: string
          name: string
          purpose: string | null
          status: string
          tenant_id: string
          to_system: string | null
          to_vendor: string | null
          updated_at: string
          updated_by: string
          volume_estimate: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          criticality?: string | null
          cross_border_transfer?: boolean
          deleted_at?: string | null
          description?: string | null
          encryption_in_transit?: boolean
          flow_direction: Database['public']['Enums']['flow_direction']
          frequency?: string | null
          from_system?: string | null
          from_vendor?: string | null
          id?: string
          name: string
          purpose?: string | null
          status?: string
          tenant_id: string
          to_system?: string | null
          to_vendor?: string | null
          updated_at?: string
          updated_by: string
          volume_estimate?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          criticality?: string | null
          cross_border_transfer?: boolean
          deleted_at?: string | null
          description?: string | null
          encryption_in_transit?: boolean
          flow_direction?: Database['public']['Enums']['flow_direction']
          frequency?: string | null
          from_system?: string | null
          from_vendor?: string | null
          id?: string
          name?: string
          purpose?: string | null
          status?: string
          tenant_id?: string
          to_system?: string | null
          to_vendor?: string | null
          updated_at?: string
          updated_by?: string
          volume_estimate?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_flows_from_system_fkey"
            columns: ["from_system"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_flows_to_system_fkey"
            columns: ["to_system"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_flows_from_vendor_fkey"
            columns: ["from_vendor"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_flows_to_vendor_fkey"
            columns: ["to_vendor"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      jurisdictions: {
        Row: {
          country_code: string
          gdpr_adequacy: boolean
          id: string
          name_en: string
          name_sk: string
          supervisory_authority: string | null
        }
        Insert: {
          country_code: string
          gdpr_adequacy: boolean
          id?: string
          name_en: string
          name_sk: string
          supervisory_authority?: string | null
        }
        Update: {
          country_code?: string
          gdpr_adequacy?: boolean
          id?: string
          name_en?: string
          name_sk?: string
          supervisory_authority?: string | null
        }
        Relationships: []
      }
      physical_locations: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: string
          jurisdiction_id: string
          name: string
          status: string
          tenant_id: string
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          jurisdiction_id: string
          name: string
          status?: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          jurisdiction_id?: string
          name?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_physical_locations_jurisdiction"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_activities: {
        Row: {
          automated_decision_making: boolean
          created_at: string
          created_by: string
          data_source: string | null
          data_subject_categories: string | null
          deleted_at: string | null
          description: string | null
          dpo_review_required: boolean
          id: string
          last_review_date: string | null
          lawful_basis: Database['public']['Enums']['lawful_basis']
          lawful_basis_explanation: string | null
          name: string
          profiling: boolean
          purpose: string
          review_date: string | null
          special_category_basis: Database['public']['Enums']['special_category_basis'] | null
          status: string
          tenant_id: string
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          automated_decision_making?: boolean
          created_at?: string
          created_by: string
          data_source?: string | null
          data_subject_categories?: string | null
          deleted_at?: string | null
          description?: string | null
          dpo_review_required?: boolean
          id?: string
          last_review_date?: string | null
          lawful_basis: Database['public']['Enums']['lawful_basis']
          lawful_basis_explanation?: string | null
          name: string
          profiling?: boolean
          purpose: string
          review_date?: string | null
          special_category_basis?: Database['public']['Enums']['special_category_basis'] | null
          status?: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          automated_decision_making?: boolean
          created_at?: string
          created_by?: string
          data_source?: string | null
          data_subject_categories?: string | null
          deleted_at?: string | null
          description?: string | null
          dpo_review_required?: boolean
          id?: string
          last_review_date?: string | null
          lawful_basis?: Database['public']['Enums']['lawful_basis']
          lawful_basis_explanation?: string | null
          name?: string
          profiling?: boolean
          purpose?: string
          review_date?: string | null
          special_category_basis?: Database['public']['Enums']['special_category_basis'] | null
          status?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: []
      }
      processing_data_categories: {
        Row: {
          created_at: string
          created_by: string
          data_category_id: string
          necessity_justification: string | null
          processing_activity_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          data_category_id: string
          necessity_justification?: string | null
          processing_activity_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          data_category_id?: string
          necessity_justification?: string | null
          processing_activity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_processing_data_categories_activity"
            columns: ["processing_activity_id"]
            isOneToOne: false
            referencedRelation: "processing_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_processing_data_categories_category"
            columns: ["data_category_id"]
            isOneToOne: false
            referencedRelation: "data_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_data_flows: {
        Row: {
          created_at: string
          created_by: string
          data_flow_id: string
          flow_purpose: string | null
          processing_activity_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          data_flow_id: string
          flow_purpose?: string | null
          processing_activity_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          data_flow_id?: string
          flow_purpose?: string | null
          processing_activity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_processing_data_flows_activity"
            columns: ["processing_activity_id"]
            isOneToOne: false
            referencedRelation: "processing_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_processing_data_flows_flow"
            columns: ["data_flow_id"]
            isOneToOne: false
            referencedRelation: "data_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_retention: {
        Row: {
          applies_to_category: string | null
          created_at: string
          created_by: string
          processing_activity_id: string
          retention_policy_id: string
        }
        Insert: {
          applies_to_category?: string | null
          created_at?: string
          created_by: string
          processing_activity_id: string
          retention_policy_id: string
        }
        Update: {
          applies_to_category?: string | null
          created_at?: string
          created_by?: string
          processing_activity_id?: string
          retention_policy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_processing_retention_activity"
            columns: ["processing_activity_id"]
            isOneToOne: false
            referencedRelation: "processing_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_processing_retention_policy"
            columns: ["retention_policy_id"]
            isOneToOne: false
            referencedRelation: "retention_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_systems: {
        Row: {
          created_at: string
          created_by: string
          processing_activity_id: string
          system_id: string
          system_role: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          processing_activity_id: string
          system_id: string
          system_role?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          processing_activity_id?: string
          system_id?: string
          system_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_processing_systems_activity"
            columns: ["processing_activity_id"]
            isOneToOne: false
            referencedRelation: "processing_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_processing_systems_system"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_vendors: {
        Row: {
          contract_required: boolean
          created_at: string
          created_by: string
          processing_activity_id: string
          vendor_id: string
          vendor_role: Database['public']['Enums']['vendor_role']
        }
        Insert: {
          contract_required?: boolean
          created_at?: string
          created_by: string
          processing_activity_id: string
          vendor_id: string
          vendor_role: Database['public']['Enums']['vendor_role']
        }
        Update: {
          contract_required?: boolean
          created_at?: string
          created_by?: string
          processing_activity_id?: string
          vendor_id?: string
          vendor_role?: Database['public']['Enums']['vendor_role']
        }
        Relationships: [
          {
            foreignKeyName: "fk_processing_vendors_activity"
            columns: ["processing_activity_id"]
            isOneToOne: false
            referencedRelation: "processing_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_processing_vendors_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      retention_policies: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          disposal_method: string | null
          id: string
          legal_basis_for_retention: string | null
          name: string
          retention_criteria: string
          retention_period_months: number | null
          retention_period_years: number | null
          review_frequency_months: number
          status: string
          tenant_id: string
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          disposal_method?: string | null
          id?: string
          legal_basis_for_retention?: string | null
          name: string
          retention_criteria: string
          retention_period_months?: number | null
          retention_period_years?: number | null
          review_frequency_months?: number
          status?: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          disposal_method?: string | null
          id?: string
          legal_basis_for_retention?: string | null
          name?: string
          retention_criteria?: string
          retention_period_months?: number | null
          retention_period_years?: number | null
          review_frequency_months?: number
          status?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: []
      }
      system_endpoints: {
        Row: {
          authentication_method: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          encryption_at_rest: boolean
          encryption_in_transit: boolean
          endpoint_type: Database['public']['Enums']['endpoint_type']
          id: string
          name: string
          status: string
          system_id: string
          tenant_id: string
          updated_at: string
          updated_by: string
          url: string | null
          workspace_id: string
        }
        Insert: {
          authentication_method?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          encryption_at_rest?: boolean
          encryption_in_transit?: boolean
          endpoint_type: Database['public']['Enums']['endpoint_type']
          id?: string
          name: string
          status?: string
          system_id: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          url?: string | null
          workspace_id: string
        }
        Update: {
          authentication_method?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          encryption_at_rest?: boolean
          encryption_in_transit?: boolean
          endpoint_type?: Database['public']['Enums']['endpoint_type']
          id?: string
          name?: string
          status?: string
          system_id?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          url?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_system_endpoints_system"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      system_locations: {
        Row: {
          created_at: string
          created_by: string
          location_id: string
          system_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          location_id: string
          system_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          location_id?: string
          system_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_system_locations_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "physical_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_system_locations_system"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      systems: {
        Row: {
          business_contact: string | null
          created_at: string
          created_by: string
          criticality: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          owner_team: string | null
          status: string
          system_type: string | null
          technical_contact: string | null
          tenant_id: string
          updated_at: string
          updated_by: string
          workspace_id: string
        }
        Insert: {
          business_contact?: string | null
          created_at?: string
          created_by: string
          criticality?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_team?: string | null
          status?: string
          system_type?: string | null
          technical_contact?: string | null
          tenant_id: string
          updated_at?: string
          updated_by: string
          workspace_id: string
        }
        Update: {
          business_contact?: string | null
          created_at?: string
          created_by?: string
          criticality?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_team?: string | null
          status?: string
          system_type?: string | null
          technical_contact?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          workspace_id?: string
        }
        Relationships: []
      }
      vendor_contracts: {
        Row: {
          contract_type: string
          created_at: string
          created_by: string
          deleted_at: string | null
          end_date: string | null
          id: string
          reference_number: string | null
          review_date: string | null
          start_date: string
          status: string
          tenant_id: string
          updated_at: string
          updated_by: string
          vendor_id: string
          workspace_id: string
        }
        Insert: {
          contract_type: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          end_date?: string | null
          id?: string
          reference_number?: string | null
          review_date?: string | null
          start_date: string
          status?: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          vendor_id: string
          workspace_id: string
        }
        Update: {
          contract_type?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          end_date?: string | null
          id?: string
          reference_number?: string | null
          review_date?: string | null
          start_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          vendor_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vendor_contracts_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_locations: {
        Row: {
          created_at: string
          created_by: string
          location_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          location_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          location_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vendor_locations_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "physical_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vendor_locations_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          contact_email: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          primary_contact: string | null
          status: string
          tenant_id: string
          updated_at: string
          updated_by: string
          website: string | null
          workspace_id: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          primary_contact?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          updated_by: string
          website?: string | null
          workspace_id: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          primary_contact?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          website?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      seed_standard_data_categories: {
        Args: {
          p_tenant_id: string
          p_workspace_id: string
          p_created_by: string
        }
        Returns: undefined
      }
      update_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      validate_email: {
        Args: {
          email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      data_category_type: "personal" | "special" | "criminal" | "anonymous"
      data_sensitivity: "public" | "internal" | "confidential" | "restricted"
      endpoint_type: "api" | "database" | "file_share" | "email" | "web_interface" | "other"
      flow_direction: "inbound" | "outbound" | "bidirectional" | "internal"
      lawful_basis: "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests"
      special_category_basis: "explicit_consent" | "employment" | "vital_interests" | "public_interest" | "healthcare" | "research" | "legal_claims"
      transfer_mechanism: "adequacy_decision" | "standard_contractual_clauses" | "binding_corporate_rules" | "derogation" | "other"
      vendor_role: "processor" | "joint_controller" | "recipient" | "sub_processor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}