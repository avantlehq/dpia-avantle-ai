'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { deleteAssessmentAction } from '@/lib/actions/assessment-actions'
import { DashboardService } from '@/lib/services/dashboard'
import { isError } from '@/lib/types/result'

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
      console.log('Starting cleanup - getting assessments...')
      setResult('🔄 Getting assessments list...')
      
      // Use the same method the dashboard uses
      const dashboardResult = await DashboardService.loadAssessments()
      
      if (isError(dashboardResult)) {
        setResult(`❌ Error loading assessments: ${dashboardResult.message}`)
        return
      }
      
      const assessments = dashboardResult.data
      console.log(`Found ${assessments.length} assessments to delete:`, assessments.map(a => a.name))
      
      if (assessments.length === 0) {
        setResult('✅ No assessments to delete - database is already clean!')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
        return
      }
      
      setResult(`🔄 Deleting ${assessments.length} assessments...`)
      
      // Delete each assessment individually using the working action
      let deletedCount = 0
      for (const assessment of assessments) {
        try {
          console.log(`Deleting assessment: ${assessment.name} (${assessment.id})`)
          const deleteResult = await deleteAssessmentAction(assessment.id)
          
          if (deleteResult.success) {
            deletedCount++
            setResult(`🔄 Deleted ${deletedCount}/${assessments.length}: ${assessment.name}`)
          } else {
            console.error(`Failed to delete ${assessment.name}:`, deleteResult.error)
          }
        } catch (deleteError) {
          console.error(`Error deleting ${assessment.name}:`, deleteError)
        }
      }
      
      setResult(`✅ Success: Deleted ${deletedCount}/${assessments.length} assessments!`)
      
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