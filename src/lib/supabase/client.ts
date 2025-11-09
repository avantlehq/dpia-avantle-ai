import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

export const createClient = () => {
  try {
    return createClientComponentClient<Database>()
  } catch (error) {
    // Fallback for invalid Supabase configuration in demo/development
    console.warn('Supabase client error:', error)
    return null
  }
}