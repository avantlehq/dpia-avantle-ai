import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const createServerClient = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.warn('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'SET' : 'MISSING',
        serviceRole: supabaseServiceRoleKey ? 'SET' : 'MISSING'
      })
      return null
    }
    
    // Use service role key for server-side operations with full database access
    return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (error) {
    console.warn('Supabase server client error:', error)
    return null
  }
}