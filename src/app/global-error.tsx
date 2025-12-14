'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#192734',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#1F2D3A',
          borderRadius: '8px',
          border: '1px solid #2F404E',
          maxWidth: '500px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            marginBottom: '1rem',
            color: '#FF6B6B' 
          }}>
            Application Error
          </h1>
          <p style={{ 
            marginBottom: '1.5rem',
            color: '#9ca3af' 
          }}>
            A client-side exception has occurred. Please try refreshing the page.
          </p>
          <button 
            onClick={reset}
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}