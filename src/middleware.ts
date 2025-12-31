import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export async function middleware(request: NextRequest) {
  const { pathname: _pathname } = request.nextUrl

  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(request)
  
  // If i18n middleware wants to redirect, respect that
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse
  }

  // Continue with security headers
  const response = intlResponse.status !== 200 ? intlResponse : NextResponse.next()
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Note: Authentication will be handled by individual pages/components
  // using our AuthGuard service for better error handling and UX
  
  return response
}

export const config = {
  matcher: [
    // Match all paths except:
    // - _next/static (static files)
    // - _next/image (image optimization files) 
    // - favicon.ico (favicon file)
    // - public folder files
    // - api routes (handled separately)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Also match root path
    '/',
    // Match internationalized paths
    '/(sk|en)/:path*'
  ],
}