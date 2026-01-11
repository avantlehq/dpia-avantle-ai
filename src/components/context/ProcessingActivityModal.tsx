'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const processingActivitySchema = z.object({
  name: z.string().min(1, 'Activity name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  purpose: z.string().min(1, 'Purpose is required').max(1000, 'Purpose too long'),
  lawful_basis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  lawful_basis_explanation: z.string().max(1000, 'Explanation too long').optional(),
  data_subject_categories: z.string().max(500, 'Categories description too long').optional(),
  special_category_basis: z.enum(['none', 'explicit_consent', 'employment', 'vital_interests', 'public_interest', 'healthcare', 'research', 'legal_claims']).optional(),
  automated_decision_making: z.boolean(),
  profiling: z.boolean(),
  data_source: z.string().max(500, 'Data source description too long').optional(),
  dpo_review_required: z.boolean(),
  review_date: z.string().optional(),
})

type ProcessingActivityFormData = z.infer<typeof processingActivitySchema>

interface ProcessingActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  activityId?: string
  initialData?: Partial<ProcessingActivityFormData>
}

const lawfulBasisOptions = [
  { value: 'consent', label: 'Consent' },
  { value: 'contract', label: 'Contract' },
  { value: 'legal_obligation', label: 'Legal obligation' },
  { value: 'vital_interests', label: 'Vital interests' },
  { value: 'public_task', label: 'Public task' },
  { value: 'legitimate_interests', label: 'Legitimate interests' },
]

const specialCategoryBasisOptions = [
  { value: 'explicit_consent', label: 'Explicit consent' },
  { value: 'employment', label: 'Employment' },
  { value: 'vital_interests', label: 'Vital interests' },
  { value: 'public_interest', label: 'Public interest' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'research', label: 'Research' },
  { value: 'legal_claims', label: 'Legal claims' },
]

export function ProcessingActivityModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  activityId, 
  initialData 
}: ProcessingActivityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = Boolean(activityId)

  const form = useForm<ProcessingActivityFormData>({
    resolver: zodResolver(processingActivitySchema),
    defaultValues: {
      name: '',
      description: '',
      purpose: '',
      lawful_basis: 'consent',
      lawful_basis_explanation: '',
      data_subject_categories: '',
      special_category_basis: undefined,
      automated_decision_making: false,
      profiling: false,
      data_source: '',
      dpo_review_required: false,
      review_date: '',
      ...initialData,
    },
  })

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        purpose: initialData.purpose || '',
        lawful_basis: initialData.lawful_basis || 'consent',
        lawful_basis_explanation: initialData.lawful_basis_explanation || '',
        data_subject_categories: initialData.data_subject_categories || '',
        special_category_basis: initialData.special_category_basis,
        automated_decision_making: initialData.automated_decision_making || false,
        profiling: initialData.profiling || false,
        data_source: initialData.data_source || '',
        dpo_review_required: initialData.dpo_review_required || false,
        review_date: initialData.review_date || '',
      })
    }
  }, [isOpen, initialData, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: ProcessingActivityFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up data - remove special_category_basis if "none"
      const submitData = { ...data }
      if (submitData.special_category_basis === 'none') {
        delete submitData.special_category_basis
      }

      const url = activityId 
        ? `/api/v1/context/processing-activities/${activityId}`
        : '/api/v1/context/processing-activities'
      
      const response = await fetch(url, {
        method: activityId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save processing activity')
      }

      toast.success(isEditing ? 'Processing activity updated successfully' : 'Processing activity created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving processing activity:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save processing activity')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Processing Activity' : 'Add New Processing Activity'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the processing activity information below.' 
              : 'Create a new processing activity for GDPR Article 30 Record of Processing Activities (ROPA) compliance.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Customer Data Processing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the processing activity..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of processing..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Legal Basis */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Legal Basis</h3>
              
              <FormField
                control={form.control}
                name="lawful_basis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lawful Basis *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lawful basis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lawfulBasisOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lawful_basis_explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lawful Basis Explanation</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide additional explanation for the lawful basis..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="special_category_basis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Category Basis (if applicable)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select special category basis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {specialCategoryBasisOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data Subjects & Source */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Details</h3>
              
              <FormField
                control={form.control}
                name="data_subject_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Subject Categories</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Customers, employees, website visitors..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Source</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe where the data comes from..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Processing Characteristics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Processing Characteristics</h3>
              
              <FormField
                control={form.control}
                name="automated_decision_making"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Automated Decision Making</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Does this processing involve automated decision making?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profiling"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Profiling</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Does this processing involve profiling of individuals?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Review Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Settings</h3>
              
              <FormField
                control={form.control}
                name="dpo_review_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>DPO Review Required</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Does this activity require DPO review?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Activity' : 'Create Activity'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}