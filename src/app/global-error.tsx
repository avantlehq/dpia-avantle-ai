'use client'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Global error page that doesn't use any React context
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Global error occurred:', error)

  return (
    <html lang="en">
      <head>
        <title>Something went wrong - DPIA Agent</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#192734',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '28rem',
          width: '100%',
          padding: '2rem',
          backgroundColor: '#1F2D3A',
          borderRadius: '0.5rem',
          border: '1px solid #2F404E',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            margin: '0 0 1rem 0'
          }}>
            Something went wrong
          </h1>
          <p style={{ 
            color: '#9CA3AF', 
            marginBottom: '1.5rem',
            margin: '0 0 1.5rem 0'
          }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {error?.message && (
            <details style={{ 
              marginBottom: '1rem', 
              textAlign: 'left',
              fontSize: '0.875rem'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Error details
              </summary>
              <code style={{ 
                backgroundColor: '#111827',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {error.message}
              </code>
            </details>
          )}
          <button
            onClick={() => {
              try {
                reset()
              } catch {
                window.location.reload()
              }
            }}
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginRight: '0.5rem'
            }}
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: 'transparent',
              color: '#4A90E2',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #4A90E2',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Go home
          </button>
        </div>
      </body>
    </html>
  )
}