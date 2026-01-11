'use client'

import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteDataCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categoryId: string
  categoryName: string
}

export function DeleteDataCategoryDialog({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  categoryName,
}: DeleteDataCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/v1/context/data-categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete data category')
      }

      toast.success('Data category deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting data category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete data category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Data Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>"{categoryName}"</strong>? 
            This action cannot be undone and may impact:
            <br />
            <br />
            • Processing activities that reference this category
            <br />
            • Data lineage and mapping relationships  
            <br />
            • GDPR compliance documentation
            <br />
            • Any child categories nested under this category
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
            Delete Category
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}