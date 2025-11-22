import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export function createServerClient(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient({ req: request, res: response })

  return { supabase, response }
}