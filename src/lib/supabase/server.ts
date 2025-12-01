import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const createServerClient = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase environment variables')
      return null
    }
    
    // Use anon key for compatibility, but we'll handle auth in actions
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Supabase server client error:', error)
    return null
  }
}

// Separate client for admin operations that need service role
export const createAdminClient = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return null
    }
    
    return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (error) {
    console.warn('Admin client error:', error)
    return null
  }
}