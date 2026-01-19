'use client'

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface DeleteDataFlowDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  flowId: string | null
  flowName: string | null
}

export function DeleteDataFlowDialog({
  isOpen,
  onClose,
  onSuccess,
  flowId,
  flowName
}: DeleteDataFlowDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const tc = useTranslations('common')
  const t = useTranslations('context.dataFlows')

  const handleDelete = async () => {
    if (!flowId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/v1/context/data-flows/${flowId}`, {
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
      console.error('Error deleting data flow:', error)
      toast.error(error instanceof Error ? error.message : t('deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteDescription')}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                  Data Lineage Impact
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Deleting this data flow will remove important data lineage information that may be required for:
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                  <li>GDPR Article 30 Record of Processing Activities compliance</li>
                  <li>Data Protection Impact Assessments (DPIA)</li>
                  <li>Cross-border transfer documentation</li>
                  <li>Data security and encryption audit trails</li>
                  <li>Vendor data processing agreement validation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  This action cannot be undone
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Once deleted, you will need to recreate the data flow mapping and reconfigure all endpoints, 
                  security settings, and compliance documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {tc('cancel')}
          </Button>
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