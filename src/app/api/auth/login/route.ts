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
