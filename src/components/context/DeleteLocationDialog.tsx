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

interface DeleteLocationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  locationId: string
  locationName: string
}

export function DeleteLocationDialog({
  isOpen,
  onClose,
  onSuccess,
  locationId,
  locationName,
}: DeleteLocationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/v1/context/locations/${locationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete location')
      }

      toast.success('Location deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting location:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete location')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Location</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&ldquo;{locationName}&rdquo;</strong>?
            This action cannot be undone and will remove all associated data, including adequacy decisions and safeguard documentation.
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
            Delete Location
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
