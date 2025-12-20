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
import { MoreVertical } from 'lucide-react'
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-44 rounded-xl border-border/50 shadow-lg shadow-black/5 p-2"
          sideOffset={8}
        >
          {/* Primary Actions */}
          <DropdownMenuItem 
            onClick={() => router.push(`/assessment?id=${assessmentId}`)}
            className="font-medium cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="font-medium cursor-pointer"
          >
            {isDuplicating ? 'Duplicating...' : 'Duplicate'}
          </DropdownMenuItem>
          
          {status === 'completed' && (
            <DropdownMenuItem 
              onClick={handleExport}
              className="font-medium cursor-pointer"
            >
              Export PDF
            </DropdownMenuItem>
          )}
          
          {/* Subtle Divider */}
          <div className="h-px bg-border/40 my-2 mx-1" />
          
          {/* Destructive Action */}
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="font-medium cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{assessmentName}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}