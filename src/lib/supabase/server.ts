import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const createServerClient = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'SET' : 'MISSING',
        serviceKey: supabaseServiceKey ? 'SET' : 'MISSING'
      })
      return null
    }
    
    console.log('ServerClient: Creating service client with service role key...')
    // Use service role key to bypass RLS restrictions for server operations
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
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