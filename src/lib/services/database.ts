import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Tables = Database['public']['Tables']
type Assessment = Tables['assessments']['Row']
type AssessmentInsert = Tables['assessments']['Insert']
type AssessmentAnswer = Tables['assessment_answers']['Row']
type PrecheckAssessment = Tables['precheck_assessments']['Row']

export class DatabaseService {
  // Using any for internal client to avoid complex type issues while maintaining type safety on public methods
  private supabase: any // eslint-disable-line @typescript-eslint/no-explicit-any
  private isServer: boolean

  private constructor(supabaseClient: any, isServer = true) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.isServer = isServer
    this.supabase = supabaseClient
  }

  static async create(isServer = true) {
    try {
      const client = isServer ? await createServerClient() : createClient()
      
      if (!client) {
        console.warn('Supabase client not initialized. Please check environment variables.')
        return new DatabaseService(null, isServer)
      }
      
      return new DatabaseService(client, isServer)
    } catch (error) {
      console.warn('Supabase client initialization failed:', error)
      return new DatabaseService(null, isServer)
    }
  }

  static async createAdmin() {
    try {
      const adminClient = await createAdminClient()
      
      if (!adminClient) {
        console.warn('Admin Supabase client not initialized. Please check service role key.')
        return new DatabaseService(null, true)
      }
      
      return new DatabaseService(adminClient, true)
    } catch (error) {
      console.warn('Admin Supabase client initialization failed:', error)
      return new DatabaseService(null, true)
    }
  }

  // Assessment CRUD operations
  async getAssessments(workspaceId: string): Promise<Assessment[]> {
    console.log('Database: getAssessments called with workspaceId:', workspaceId)
    
    if (!this.supabase) {
      console.error('Database: Supabase client not configured')
      throw new Error('Database not configured')
    }

    console.log('Database: Executing query to assessments table')
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    console.log('Database: Query result - data:', data, 'error:', error)

    if (error) {
      console.error('Database: Error fetching assessments:', error)
      throw new Error(`Failed to fetch assessments: ${error.message}`)
    }

    console.log('Database: Returning', (data || []).length, 'assessments')
    return data || []
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Error fetching assessment:', error)
      throw new Error('Failed to fetch assessment')
    }

    return data
  }

  async createAssessment(data: AssessmentInsert): Promise<Assessment> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { data: assessment, error } = await this.supabase
      .from('assessments')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating assessment:', error)
      throw new Error('Failed to create assessment')
    }

    return assessment as Assessment
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { data, error } = await this.supabase
      .from('assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating assessment:', error)
      throw new Error('Failed to update assessment')
    }

    return data as Assessment
  }

  async deleteAssessment(id: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { error } = await this.supabase
      .from('assessments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting assessment:', error)
      throw new Error('Failed to delete assessment')
    }
  }

  // Assessment answers CRUD operations
  async getAssessmentAnswers(assessmentId: string): Promise<Record<string, Record<string, unknown>>> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { data, error } = await this.supabase
      .from('assessment_answers')
      .select('*')
      .eq('assessment_id', assessmentId)

    if (error) {
      console.error('Error fetching assessment answers:', error)
      throw new Error('Failed to fetch assessment answers')
    }

    // Transform flat array into nested object structure
    const answers: Record<string, Record<string, unknown>> = {}
    data?.forEach((answer: AssessmentAnswer) => {
      if (!answers[answer.section_id]) {
        answers[answer.section_id] = {}
      }
      answers[answer.section_id][answer.field_id] = answer.value
    })

    return answers
  }

  async saveAssessmentAnswers(
    assessmentId: string, 
    sectionId: string, 
    answers: Record<string, unknown>
  ): Promise<void> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const operations = Object.entries(answers).map(([fieldId, value]) => ({
      assessment_id: assessmentId,
      section_id: sectionId,
      field_id: fieldId,
      value: value
    }))

    const { error } = await this.supabase
      .from('assessment_answers')
      .upsert(operations, {
        onConflict: 'assessment_id,section_id,field_id'
      })

    if (error) {
      console.error('Error saving assessment answers:', error)
      throw new Error('Failed to save assessment answers')
    }

    // Update the assessment's updated_at timestamp
    await this.updateAssessment(assessmentId, { updated_at: new Date().toISOString() })
  }

  // Precheck assessment operations
  async createPrecheckAssessment(data: {
    workspaceId: string
    answers: Record<string, unknown>
    result: unknown
  }): Promise<PrecheckAssessment> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { data: precheck, error } = await this.supabase
      .from('precheck_assessments')
      .insert({
        workspace_id: data.workspaceId,
        answers: data.answers,
        result: data.result
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating precheck assessment:', error)
      throw new Error('Failed to create precheck assessment')
    }

    return precheck
  }

  async getPrecheckAssessments(workspaceId: string): Promise<PrecheckAssessment[]> {
    if (!this.supabase) {
      throw new Error('Database not configured')
    }

    const { data, error } = await this.supabase
      .from('precheck_assessments')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching precheck assessments:', error)
      throw new Error('Failed to fetch precheck assessments')
    }

    return data || []
  }

  // Workspace operations
  async getDefaultWorkspace(): Promise<string> {
    // For now, return the demo workspace ID
    // In production, this would get the user's actual workspace
    return '00000000-0000-0000-0000-000000000002'
  }

  async getCurrentUser() {
    if (!this.supabase) {
      return null
    }

    const { data: { user }, error } = await this.supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    return user
  }

  // Domain events (audit trail)
  async logEvent(event: {
    type: string
    entityType: string
    entityId: string
    workspaceId?: string
    payload?: Record<string, unknown>
  }): Promise<void> {
    if (!this.supabase) {
      console.warn('Database not configured, skipping event logging')
      return
    }

    try {
      const { error } = await this.supabase
        .from('domain_events')
        .insert({
          type: event.type,
          entity_type: event.entityType,
          entity_id: event.entityId,
          workspace_id: event.workspaceId,
          payload: event.payload || {}
        })

      if (error) {
        console.error('Error logging domain event:', error)
        // Don't throw here - logging failures shouldn't break the main flow
      }
    } catch (error) {
      console.error('Error logging domain event:', error)
    }
  }
}