import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background, #192734)' }}>
      <div className="w-full max-w-md p-8 rounded-lg border shadow-sm" style={{ 
        backgroundColor: 'var(--card, #1F2D3A)',
        borderColor: 'var(--border, #2F404E)'
      }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground, #ffffff)' }}>
            Page Not Found
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground, #9CA3AF)' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl sm:text-6xl font-bold mb-4" style={{ color: 'var(--muted-foreground, #9CA3AF)' }}>
            404
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors"
            style={{ 
              backgroundColor: 'var(--color-blue, #4A90E2)',
              color: 'white'
            }}
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          
          <Link 
            href="/precheck"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors"
            style={{ 
              borderColor: 'var(--border, #2F404E)',
              color: 'var(--foreground, #ffffff)'
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            DPIA Pre-check
          </Link>
        </div>
        
        <div className="text-center text-sm" style={{ color: 'var(--muted-foreground, #9CA3AF)' }}>
          <p>Available pages:</p>
          <ul className="mt-2 space-y-1">
            <li key="home">• <Link href="/" className="hover:underline" style={{ color: 'var(--color-blue, #4A90E2)' }}>Homepage</Link></li>
            <li key="precheck">• <Link href="/precheck" className="hover:underline" style={{ color: 'var(--color-blue, #4A90E2)' }}>DPIA Pre-check</Link></li>
            <li key="dashboard">• <Link href="/dashboard" className="hover:underline" style={{ color: 'var(--color-blue, #4A90E2)' }}>Dashboard</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}