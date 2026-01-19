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
import { useTranslations } from 'next-intl'

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
  const tc = useTranslations('common')
  const t = useTranslations('context.locations')

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/v1/context/locations/${locationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || t('deleteFailed'))
      }

      toast.success(t('deleteSuccess'))
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting location:', error)
      toast.error(error instanceof Error ? error.message : t('deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{tc('cancel')}</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tc('delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
