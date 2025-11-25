'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal, Copy, Trash2, Download, Edit } from 'lucide-react'
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
        router.push(`/assessments/${result.assessmentId}`)
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
      const result = await deleteAssessmentAction(assessmentId)
      
      if (result.success) {
        setShowDeleteDialog(false)
        // The page will automatically refresh due to revalidatePath
      }
    } catch (error) {
      console.error('Error deleting assessment:', error)
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="avantle-border bg-card shadow-lg">
          <DropdownMenuItem 
            onClick={() => router.push(`/assessments/${assessmentId}`)}
            className="text-foreground hover:bg-primary/10"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="text-foreground hover:bg-primary/10"
          >
            <Copy className="mr-2 h-4 w-4" />
            {isDuplicating ? 'Duplicating...' : 'Duplicate'}
          </DropdownMenuItem>
          {status === 'completed' && (
            <DropdownMenuItem 
              onClick={handleExport}
              className="text-foreground hover:bg-primary/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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