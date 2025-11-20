import { NextResponse } from 'next/server'
import { getVersionInfo, CHANGELOG } from '@/lib/version'

export async function GET() {
  try {
    const versionInfo = getVersionInfo()
    
    return NextResponse.json({
      version: versionInfo.version,
      name: versionInfo.name,
      buildDate: versionInfo.buildDate,
      displayName: versionInfo.displayName,
      fullDisplayName: versionInfo.fullDisplayName,
      changelog: CHANGELOG,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Version API error:', error)
    return NextResponse.json(
      { error: 'Failed to get version info' },
      { status: 500 }
    )
  }
}