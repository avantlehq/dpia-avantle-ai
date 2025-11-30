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
      // Import Supabase client for direct database access
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      if (!supabase) {
        setResult('❌ Error: Could not connect to database')
        return
      }

      // Get assessments first
      const { data: assessments, error: fetchError } = await supabase
        .from('assessments')
        .select('id, name')
        .eq('workspace_id', '00000000-0000-0000-0000-000000000002')

      if (fetchError) {
        setResult(`❌ Error fetching assessments: ${fetchError.message}`)
        return
      }

      if (!assessments || assessments.length === 0) {
        setResult('✅ No assessments to delete')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
        return
      }

      setResult(`🔄 Found ${assessments.length} assessments, deleting...`)

      // Delete all assessments
      const { error: deleteError } = await supabase
        .from('assessments')
        .delete()
        .eq('workspace_id', '00000000-0000-0000-0000-000000000002')

      if (deleteError) {
        setResult(`❌ Error deleting assessments: ${deleteError.message}`)
        return
      }

      setResult(`✅ Success: Deleted ${assessments.length} assessments!`)
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 3000)

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
            This will permanently delete ALL assessments from the database. 
            Use this to start with a clean database.
          </div>
          
          {result && (
            <div className="p-3 rounded bg-muted text-sm">
              {result}
            </div>
          )}
          
          <Button
            onClick={handleCleanup}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Assessments
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/dashboard'}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}