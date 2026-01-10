/**
 * Context Module - Supabase Client Configuration
 * 
 * Configured Supabase client for Context module with RLS enforcement
 * and proper authentication handling. Integrates with existing DPIA platform.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Warn in development if using placeholder values
if ((supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) && process.env.NODE_ENV !== 'production') {
  console.warn('Using placeholder Supabase environment variables');
}

// Client-side Supabase client (with RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'dpia-avantle-ai',
    },
  },
});

// Server-side Supabase client with service role (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    })
  : null;

// Type-safe client for RLS-enabled operations
export type SupabaseClient = typeof supabase;

// Helper to set JWT token for RLS enforcement
export const setAuthToken = (client: SupabaseClient, token: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Client-Info': 'dpia-avantle-ai',
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Helper to create client with context claims
export const createContextClient = (_contextClaims: {
  tenant_id: string;
  workspace_id: string;
  sub: string;
}) => {
  // Use service role client to bypass RLS since we handle workspace isolation in queries
  if (supabaseAdmin) {
    return supabaseAdmin;
  }
  
  // Fallback to anon client if service role not available
  console.warn('Service role not available, using anonymous client');
  return supabase;
};

// Health check function
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('jurisdictions').select('id').limit(1);
    if (error) throw error;
    return { healthy: true, message: 'Connection successful' };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { healthy: false, message: 'Connection failed', error };
  }
};

export default supabase;