/**
 * Context Module - Supabase Client Configuration
 * 
 * Configured Supabase client for Context module with RLS enforcement
 * and proper authentication handling. Integrates with existing DPIA platform.
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
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
export const createContextClient = (contextClaims: {
  tenant_id: string;
  workspace_id: string;
  sub: string;
}) => {
  // Create a JWT token with context claims for RLS
  const token = Buffer.from(JSON.stringify({
    iss: 'dpia-avantle-ai',
    sub: contextClaims.sub,
    tenant_id: contextClaims.tenant_id,
    workspace_id: contextClaims.workspace_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  })).toString('base64');

  return setAuthToken(supabase, token);
};

// Health check function
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('jurisdictions').select('id').limit(1);
    if (error) throw error;
    return { healthy: true, message: 'Connection successful' };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { healthy: false, message: 'Connection failed', error };
  }
};

export default supabase;