import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API endpoints are working',
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'MISSING'
    }
  })
}