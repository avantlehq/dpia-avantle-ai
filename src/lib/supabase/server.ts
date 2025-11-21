import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

export const createServerClient = async () => {
  try {
    return createServerComponentClient<Database>({ cookies })
  } catch (error) {
    // Fallback for invalid Supabase configuration in demo/development
    console.warn('Supabase server client error:', error)
    return null
  }
}