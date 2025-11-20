import { NextResponse } from 'next/server'
import { getVersionInfo } from '@/lib/version'

export async function GET() {
  try {
    const versionInfo = getVersionInfo()
    
    // Basic health checks
    const checks = {
      server: 'healthy',
      database: 'healthy', // TODO: Add actual database health check
      version: versionInfo.version,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      status: 'healthy',
      checks,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'unknown',
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}