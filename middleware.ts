import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname
  
  // Allow access to maintenance page and static assets
  if (pathname === '/maintenance' || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check for secret URL parameter
  const adminSecret = url.searchParams.get('admin')
  if (adminSecret === 'life2026') {
    // Set admin access cookie for 30 days
    const response = NextResponse.next()
    response.cookies.set('admin_access', 'authenticated', { 
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    return response
  }

  // Check for existing admin access cookie
  const adminCookie = request.cookies.get('admin_access')
  if (adminCookie?.value === 'authenticated') {
    return NextResponse.next()
  }

  // All other requests redirect to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /favicon.ico, /sitemap.xml, /robots.txt (metadata files)
     * 5. /maintenance page itself
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|maintenance).*)',
  ],
}