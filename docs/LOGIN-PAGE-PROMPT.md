# Temporary Login Page Implementation - DPIA Platform

**Date:** 2026-02-08
**Project:** dpia.avantle.ai
**Version:** 3.36.0
**Purpose:** Temporary authentication barrier before full auth system implementation

---

## REQUIREMENTS SUMMARY

Create a temporary login page for https://dpia.avantle.ai with:
- **Fixed credentials**: username `toplegal26`, password `tvarohacek26`
- **Design**: Must fully match existing DPIA platform design system
- **Bilingual**: Slovak/English support
- **Session**: Simple session management (localStorage or cookie)
- **Routing**: Protect all routes except login page

---

## DESIGN SYSTEM SPECIFICATIONS

### Color System (Dark Theme - Default)

**Background Colors:**
```css
--surface-0: #192734    /* App background */
--surface-1: #1F2D3A    /* Cards, panels */
--surface-2: #374151    /* Secondary surfaces */
--surface-3: #4B5563    /* Hover states */
```

**Text Colors:**
```css
--text-primary: #FFFFFF     /* Headings, primary text */
--text-secondary: #E5E7EB   /* Secondary text, labels */
--text-muted: #9CA3AF       /* Muted text, placeholders */
```

**Brand Colors:**
```css
--brand-primary: #4A90E2        /* Primary buttons, links */
--brand-primary-hover: #3B82E7  /* Button hover */
--brand-primary-active: #2563eb /* Button pressed */
```

**Status Colors:**
```css
--status-error: #ef4444         /* Error messages */
--status-error-bg: rgba(239, 68, 68, 0.1)
--status-error-border: rgba(239, 68, 68, 0.3)
```

**Border & Focus:**
```css
--border-default: #4B5563
--border-subtle: #2F404E
--border-focus: #4A90E2
```

### Typography

**Font Family:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font Sizes:**
```css
--text-3xl: 2.25rem    /* 36px - Page titles */
--text-2xl: 1.875rem   /* 30px - Section headings */
--text-xl: 1.5rem      /* 24px - Subsection headings */
--text-lg: 1.125rem    /* 18px - Card titles */
--text-base: 1rem      /* 16px - Body text, buttons */
--text-sm: 0.875rem    /* 14px - Helper text */
```

**Font Weights:**
```css
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing (4px Grid System)

```css
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-12: 3rem      /* 48px */
```

### Border Radius

```css
--radius-default: 0.625rem  /* 10px - default */
--radius-lg: 0.75rem        /* 12px - cards */
```

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)
```

---

## COMPONENT SPECIFICATIONS

### Button Component Pattern

Use existing `Button` component from `@/components/ui/button`:

```tsx
import { Button } from "@/components/ui/button"

<Button
  variant="primary"   // primary | secondary | ghost | outline
  size="lg"           // sm | md | lg
  fullWidth           // optional - makes button 100% width
  isLoading={false}   // optional - shows spinner
>
  Button Text
</Button>
```

**Button Variants:**
- `primary`: Blue background (`--brand-primary`), white text
- `secondary`: Gray background (`--surface-2`), border
- `ghost`: Transparent, hover effect
- `outline`: Transparent with border

### Input Component Pattern

Use existing `Input` component from `@/components/ui/input`:

```tsx
import { Input } from "@/components/ui/input"

<Input
  type="text"
  variant="default"   // default | error | success
  size="lg"           // sm | md | lg
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

**Input States:**
- `default`: Standard border color
- `error`: Red border (`--status-error`)
- Focus: Blue ring (`--border-focus`)

### Card Component Pattern

Use existing `Card` components from `@/components/ui/card`:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card className="max-w-md mx-auto">
  <CardHeader>
    <CardTitle>Page Title</CardTitle>
    <CardDescription>Subtitle or description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form fields here */}
  </CardContent>
  <CardFooter>
    {/* Actions here */}
  </CardFooter>
</Card>
```

---

## AUTHENTICATION LOGIC

### Fixed Credentials

```typescript
const FIXED_CREDENTIALS = {
  username: 'toplegal26',
  password: 'tvarohacek26'
} as const
```

### Session Management Options

**Option 1: Cookie-based (Recommended)**
```typescript
// Set cookie on successful login
import { cookies } from 'next/headers'

async function login(username: string, password: string) {
  if (username === FIXED_CREDENTIALS.username &&
      password === FIXED_CREDENTIALS.password) {
    const cookieStore = await cookies()
    cookieStore.set('dpia_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid credentials' }
}
```

**Option 2: localStorage (Client-side)**
```typescript
// client-side only
if (username === FIXED_CREDENTIALS.username &&
    password === FIXED_CREDENTIALS.password) {
  localStorage.setItem('dpia_auth', 'true')
  router.push('/en/dashboard')
}
```

### Middleware for Route Protection

Create/update `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname.includes('/login')) {
    return NextResponse.next()
  }

  // Check auth cookie
  const authCookie = request.cookies.get('dpia_auth')

  if (!authCookie || authCookie.value !== 'authenticated') {
    // Redirect to login
    const loginUrl = new URL('/en/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## FILE STRUCTURE

```
src/
├── app/
│   ├── [locale]/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page component
│   │   └── ...existing routes
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts      # POST /api/auth/login
│           └── logout/
│               └── route.ts      # POST /api/auth/logout
├── middleware.ts                 # Route protection
└── components/
    └── auth/
        └── LoginForm.tsx         # Login form component (optional)
```

---

## IMPLEMENTATION CODE

### 1. Login Page (`src/app/[locale]/login/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth.login')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/en/dashboard')
        router.refresh()
      } else {
        setError(data.error || t('invalidCredentials'))
      }
    } catch (err) {
      setError(t('loginError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--surface-0] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-[--text-3xl] font-bold">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-[--text-base]">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[--status-error-bg] border border-[--status-error-border] text-[--status-error] text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-[--text-secondary]"
              >
                {t('usernameLabel')}
              </label>
              <Input
                id="username"
                type="text"
                size="lg"
                variant={error ? 'error' : 'default'}
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[--text-secondary]"
              >
                {t('passwordLabel')}
              </label>
              <Input
                id="password"
                type="password"
                size="lg"
                variant={error ? 'error' : 'default'}
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              {t('loginButton')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
```

### 2. Login API Route (`src/app/api/auth/login/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const FIXED_CREDENTIALS = {
  username: 'toplegal26',
  password: 'tvarohacek26'
} as const

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username === FIXED_CREDENTIALS.username &&
        password === FIXED_CREDENTIALS.password) {

      // Set authentication cookie
      const cookieStore = await cookies()
      cookieStore.set('dpia_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return NextResponse.json({
        success: true,
        message: 'Authentication successful'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
```

### 3. Logout API Route (`src/app/api/auth/logout/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('dpia_auth')

  return NextResponse.json({ success: true })
}
```

### 4. Middleware (`middleware.ts` - update existing)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

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
```

---

## TRANSLATION KEYS

Add to `/messages/en.json`:

```json
{
  "auth": {
    "login": {
      "title": "DPIA Platform Login",
      "subtitle": "Automated GDPR Data Protection Impact Assessments",
      "usernameLabel": "Username",
      "usernamePlaceholder": "Enter your username",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Enter your password",
      "loginButton": "Sign In",
      "invalidCredentials": "Invalid username or password",
      "loginError": "An error occurred. Please try again.",
      "logoutButton": "Sign Out"
    }
  }
}
```

Add to `/messages/sk.json`:

```json
{
  "auth": {
    "login": {
      "title": "Prihlásenie do DPIA Platformy",
      "subtitle": "Automatizované GDPR posúdenia vplyvu na ochranu údajov",
      "usernameLabel": "Používateľské meno",
      "usernamePlaceholder": "Zadajte používateľské meno",
      "passwordLabel": "Heslo",
      "passwordPlaceholder": "Zadajte heslo",
      "loginButton": "Prihlásiť sa",
      "invalidCredentials": "Neplatné používateľské meno alebo heslo",
      "loginError": "Vyskytla sa chyba. Skúste to prosím znova.",
      "logoutButton": "Odhlásiť sa"
    }
  }
}
```

---

## OPTIONAL: LOGOUT BUTTON

Add to topbar (`src/components/layout/modern-topbar.tsx`):

```tsx
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

// In component:
const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/en/login'
}

// Add to user menu or topbar:
<Button
  variant="ghost"
  size="sm"
  onClick={handleLogout}
  leftIcon={<LogOut className="h-4 w-4" />}
>
  {t('auth.login.logoutButton')}
</Button>
```

---

## TESTING CHECKLIST

After implementation, verify:

- [ ] Login page accessible at `/en/login` and `/sk/login`
- [ ] All other routes redirect to login when not authenticated
- [ ] Correct credentials (`toplegal26` / `tvarohacek26`) grant access
- [ ] Incorrect credentials show error message
- [ ] Error message styled correctly (red background, border)
- [ ] Login page matches DPIA design (colors, typography, spacing)
- [ ] Both English and Slovak translations work
- [ ] Session persists across page refreshes
- [ ] Logout functionality clears session
- [ ] Mobile responsive layout works correctly

---

## VERSION MANAGEMENT

After implementation:

1. Update `src/lib/version.ts`:
   - Increment VERSION (e.g., 3.36.0 → 3.37.0)
   - Update VERSION_NAME: "Temporary Login Authentication"
   - Update BUILD_DATE
   - Add CHANGELOG entry

2. Update `package.json` version to match

3. Commit:
```bash
git add -A
git commit -m "feat: Add temporary login page

- Fixed credentials authentication (toplegal26/tvarohacek26)
- Route protection with middleware
- Bilingual support (EN/SK)
- Matches DPIA design system
- Session management with cookies

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

---

## SECURITY NOTES

**⚠️ IMPORTANT - TEMPORARY SOLUTION ONLY:**

- This is a temporary authentication mechanism
- Fixed credentials are hardcoded (not production-ready)
- No password hashing (credentials in plain text)
- No brute force protection
- No session encryption beyond httpOnly cookie
- Replace with proper authentication system (Supabase Auth, NextAuth, etc.) before production

**Production TODO:**
- Implement proper user authentication system
- Add password hashing (bcrypt, argon2)
- Implement rate limiting
- Add CSRF protection
- Use secure session management
- Add 2FA support
- Implement proper user roles and permissions

---

## QUESTIONS TO CLARIFY

If needed, clarify with user:

1. **Session Duration**: Should login persist for 7 days or shorter? (Currently set to 7 days)
2. **Logout UI**: Where should logout button be placed? (Topbar user menu recommended)
3. **Redirect After Login**: Should always redirect to `/dashboard` or remember previous URL?
4. **Error Messages**: Should show specific error (username vs password) or generic message? (Generic recommended for security)
5. **Branding**: Should login page show logo or company name?

---

**END OF PROMPT**
