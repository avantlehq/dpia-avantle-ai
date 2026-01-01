'use client'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

// Minimal global error with no React hooks or context dependencies
export default function GlobalError({
  reset,
}: {
  error?: Error & { digest?: string }
  reset: () => void
}) {
  // Handle reset with try-catch to prevent any potential issues
  const handleReset = () => {
    try {
      reset()
    } catch (err) {
      // Fallback: reload the page
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  }

  return (
    <html lang="en">
      <body>
        <div style={{ 
          minHeight: '100vh',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#1a1f2e',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              marginBottom: '1rem',
              color: '#ff6b6b'
            }}>
              Something went wrong
            </h1>
            <p style={{ 
              marginBottom: '2rem',
              color: '#9ca3af'
            }}>
              A global error has occurred. Please try again.
            </p>
            <button
              onClick={handleReset}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                marginRight: '0.5rem'
              }}
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: 'transparent',
                color: '#9ca3af',
                border: '1px solid #6b7280',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}