import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and public assets
  const publicPaths = ['/login', '/_next', '/favicon.ico', '/api/auth/login']
  const isPublicPath = publicPaths.some(path => pathname.includes(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check authentication
  const authCookie = request.cookies.get('dpia_auth')

  if (!authCookie || authCookie.value !== 'authenticated') {
    // Get locale from pathname or default to 'en'
    const locale = pathname.split('/')[1] || 'en'
    const loginUrl = new URL(`/${locale}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}