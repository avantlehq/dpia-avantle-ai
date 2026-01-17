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

interface DeleteSystemDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  systemId: string
  systemName: string
}

export function DeleteSystemDialog({
  isOpen,
  onClose,
  onSuccess,
  systemId,
  systemName,
}: DeleteSystemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log('[DeleteSystemDialog] Deleting system:', systemId)
      const response = await fetch(`/api/v1/context/systems/${systemId}`, {
        method: 'DELETE',
      })

      console.log('[DeleteSystemDialog] Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[DeleteSystemDialog] Error response:', errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          throw new Error(`Delete failed with status ${response.status}: ${errorText}`)
        }
        throw new Error(errorData.message || errorData.error || 'Failed to delete system')
      }

      const result = await response.json()
      console.log('[DeleteSystemDialog] Delete successful:', result)

      toast.success('System deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('[DeleteSystemDialog] Error deleting system:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete system')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete IT System</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&ldquo;{systemName}&rdquo;</strong>? 
            This action cannot be undone and will remove all associated data.
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
            Delete System
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}