// Disabled i18n middleware for production deployment
// import createMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'

// Empty middleware function for now
export default function middleware() {
  // No middleware processing needed for public routes
}

export const config = {
  // Disabled for now to fix production deployment
  matcher: []
}