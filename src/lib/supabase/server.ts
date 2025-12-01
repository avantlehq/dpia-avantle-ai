import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const createServerClient = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'SET' : 'MISSING',
        anonKey: supabaseAnonKey ? 'SET' : 'MISSING'
      })
      return null
    }
    
    // Direct Supabase client without auth-helpers to avoid cookies issues
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  } catch (error) {
    console.warn('Supabase server client error:', error)
    return null
  }
}