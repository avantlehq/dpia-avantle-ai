'use client'

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteProcessingActivityDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  activityId: string
  activityName: string
}

export function DeleteProcessingActivityDialog({
  isOpen,
  onClose,
  onSuccess,
  activityId,
  activityName,
}: DeleteProcessingActivityDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/v1/context/processing-activities/${activityId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete processing activity')
      }

      toast.success('Processing activity deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting processing activity:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete processing activity')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Processing Activity</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&ldquo;{activityName}&rdquo;</strong>? 
            This action cannot be undone and will remove all associated ROPA data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Activity
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}