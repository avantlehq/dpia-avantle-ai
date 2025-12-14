'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Copy, Trash2, Download, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteAssessmentAction, duplicateAssessmentAction } from '@/lib/actions/assessment-actions'

interface AssessmentActionsProps {
  assessmentId: string
  assessmentName: string
  status: string
}

export function AssessmentActions({ assessmentId, assessmentName, status }: AssessmentActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const router = useRouter()

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const result = await duplicateAssessmentAction(
        assessmentId,
        `${assessmentName} (Copy)`
      )
      
      if (result.success && result.assessmentId) {
        router.push(`/assessment?id=${result.assessmentId}`)
      }
    } catch (error) {
      console.error('Error duplicating assessment:', error)
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log('Attempting to delete assessment:', assessmentId)
      const result = await deleteAssessmentAction(assessmentId)
      
      console.log('Delete result:', result)
      
      if (result.success) {
        setShowDeleteDialog(false)
        // Force a hard refresh to ensure the table updates
        window.location.reload()
      } else {
        console.error('Delete failed:', result.error)
        alert(`Failed to delete assessment: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting assessment:', error)
      alert(`Error deleting assessment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = () => {
    // Trigger export - this could open a modal or directly start download
    window.open(`/api/export?assessment_id=${assessmentId}&format=pdf`, '_blank')
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Edit Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/assessment?id=${assessmentId}`)}
          className="h-8 w-8 p-0 hover:bg-icon-blue transition-colors duration-200"
          title="Edit assessment"
        >
          <Edit className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
        </Button>

        {/* Duplicate Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          disabled={isDuplicating}
          className="h-8 w-8 p-0 hover:bg-icon-green transition-colors duration-200"
          title={isDuplicating ? 'Duplicating...' : 'Duplicate assessment'}
        >
          <Copy className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
        </Button>

        {/* Export Button - Only show for completed assessments */}
        {status === 'completed' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-8 w-8 p-0 hover:bg-icon-purple transition-colors duration-200"
            title="Export as PDF"
          >
            <Download className="h-4 w-4" style={{ color: 'var(--color-purple)' }} />
          </Button>
        )}

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="h-8 w-8 p-0 hover:bg-red-100 transition-colors duration-200"
          title="Delete assessment"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="avantle-border bg-card border-l-4 border-l-red-500 shadow-lg max-w-md w-full mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete &quot;{assessmentName}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="avantle-border"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}