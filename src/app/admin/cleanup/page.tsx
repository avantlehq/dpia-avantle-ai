'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Trash2 } from 'lucide-react'

export default function CleanupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to DELETE ALL assessments? This cannot be undone!')) {
      return
    }

    if (!confirm('This will permanently delete Employee Data Processing, Customer CRM System, and Marketing Analytics. Continue?')) {
      return
    }

    setLoading(true)
    setResult('🔄 Deleting assessments...')

    try {
      console.log('Starting cleanup via API...')
      
      // Use API endpoint instead of server action to avoid import issues
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirm: 'DELETE_ALL_ASSESSMENTS'
        }),
      })

      const data = await response.json()
      console.log('API response:', data)

      if (data.success) {
        setResult(`✅ Success: ${data.message || 'All assessments deleted!'}`)
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 3000)
      } else {
        console.error('API failed:', data.error)
        setResult(`❌ Error: ${data.error || 'Failed to delete assessments'}`)
      }

    } catch (error) {
      console.error('Cleanup error:', error)
      setResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Database Cleanup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <strong>Database configuration issue detected.</strong>
            <br /><br />
            To clean the database manually:
            <br />
            1. Go to <strong>Dashboard</strong>
            <br />
            2. Click the <strong>actions menu (⋮)</strong> for each assessment
            <br />
            3. Select <strong>Delete</strong> for each one
            <br /><br />
            Current assessments to delete:
            <br />
            • Employee Data Processing
            <br />
            • Customer CRM System  
            <br />
            • Marketing Analytics
          </div>
          
          {result && (
            <div className="p-3 rounded bg-muted text-sm">
              {result}
            </div>
          )}
          
          <div className="space-y-2">
            <Button
              onClick={handleCleanup}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              {loading ? (
                'Attempting Cleanup...'
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Try Automated Cleanup
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard (Manual Delete)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}