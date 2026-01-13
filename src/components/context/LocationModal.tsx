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

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Name too long'),
  country_code: z.string().min(2, 'Country code is required').max(3, 'Country code too long'),
  jurisdiction_type: z.enum(['eu_member_state', 'eea_country', 'third_country', 'international']),
  adequacy_status: z.enum(['adequate', 'not_adequate', 'partial', 'under_review']),
  adequacy_decision_date: z.string().optional(),
  adequacy_decision_reference: z.string().max(200, 'Reference too long').optional(),
  safeguards_required: z.boolean(),
  safeguards_description: z.string().max(1000, 'Description too long').optional(),
  data_localization_requirements: z.boolean(),
  status: z.enum(['active', 'inactive']),
  notes: z.string().max(500, 'Notes too long').optional(),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  locationId?: string
  initialData?: Partial<LocationFormData>
}

export function LocationModal({
  isOpen,
  onClose,
  onSuccess,
  locationId,
  initialData
}: LocationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = Boolean(locationId)

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      country_code: '',
      jurisdiction_type: 'third_country',
      adequacy_status: 'under_review',
      adequacy_decision_date: '',
      adequacy_decision_reference: '',
      safeguards_required: false,
      safeguards_description: '',
      data_localization_requirements: false,
      status: 'active',
      notes: '',
      ...initialData,
    },
  })

  const safeguardsRequired = form.watch('safeguards_required')
  const adequacyStatus = form.watch('adequacy_status')

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || '',
        country_code: initialData.country_code || '',
        jurisdiction_type: initialData.jurisdiction_type || 'third_country',
        adequacy_status: initialData.adequacy_status || 'under_review',
        adequacy_decision_date: initialData.adequacy_decision_date || '',
        adequacy_decision_reference: initialData.adequacy_decision_reference || '',
        safeguards_required: initialData.safeguards_required || false,
        safeguards_description: initialData.safeguards_description || '',
        data_localization_requirements: initialData.data_localization_requirements || false,
        status: initialData.status || 'active',
        notes: initialData.notes || '',
      })
    }
  }, [isOpen, initialData, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true)
    try {
      const url = locationId
        ? `/api/v1/context/locations/${locationId}`
        : '/api/v1/context/locations'

      const response = await fetch(url, {
        method: locationId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save location')
      }

      toast.success(isEditing ? 'Location updated successfully' : 'Location created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving location:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save location')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the location or jurisdiction information below.'
              : 'Add a new processing location or jurisdiction for GDPR compliance tracking and adequacy decision management.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., US, SK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jurisdiction_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eu_member_state">EU Member State</SelectItem>
                          <SelectItem value="eea_country">EEA Country</SelectItem>
                          <SelectItem value="third_country">Third Country</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this location..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* GDPR Adequacy Decision Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">GDPR Adequacy Decision</h3>

              <FormField
                control={form.control}
                name="adequacy_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adequacy Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="not_adequate">Not Adequate</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {adequacyStatus === 'adequate' && (
                <>
                  <FormField
                    control={form.control}
                    name="adequacy_decision_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decision Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adequacy_decision_reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decision Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Commission Decision 2016/1250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {/* Transfer Safeguards Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Transfer Safeguards</h3>

              <FormField
                control={form.control}
                name="safeguards_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Safeguards Required</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Indicates whether additional safeguards are needed for data transfers
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

              {safeguardsRequired && (
                <FormField
                  control={form.control}
                  name="safeguards_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safeguards Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the safeguards in place (e.g., Standard Contractual Clauses, Binding Corporate Rules)..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="data_localization_requirements"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Data Localization Requirements</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Indicates whether this jurisdiction has data localization laws
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

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Location' : 'Create Location'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
