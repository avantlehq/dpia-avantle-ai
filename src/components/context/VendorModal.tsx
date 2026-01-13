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

const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  contact_email: z.string().email('Invalid email').max(100, 'Email too long').or(z.literal('')).optional(),
  primary_contact: z.string().max(100, 'Name too long').optional(),
  vendor_role: z.enum(['processor', 'joint_controller', 'recipient', 'sub_processor']),
  status: z.enum(['active', 'inactive']),
  has_dpa: z.boolean(),
  dpa_expires: z.string().optional(),
  location: z.string().max(100, 'Location too long').optional(),
})

type VendorFormData = z.infer<typeof vendorSchema>

interface VendorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vendorId?: string
  initialData?: Partial<VendorFormData>
}

export function VendorModal({
  isOpen,
  onClose,
  onSuccess,
  vendorId,
  initialData
}: VendorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = Boolean(vendorId)

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      contact_email: '',
      primary_contact: '',
      vendor_role: 'processor',
      status: 'active',
      has_dpa: false,
      dpa_expires: '',
      location: '',
      ...initialData,
    },
  })

  const hasDpa = form.watch('has_dpa')

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        website: initialData.website || '',
        contact_email: initialData.contact_email || '',
        primary_contact: initialData.primary_contact || '',
        vendor_role: initialData.vendor_role || 'processor',
        status: initialData.status || 'active',
        has_dpa: initialData.has_dpa || false,
        dpa_expires: initialData.dpa_expires || '',
        location: initialData.location || '',
      })
    }
  }, [isOpen, initialData, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: VendorFormData) => {
    setIsSubmitting(true)
    try {
      const url = vendorId
        ? `/api/v1/context/vendors/${vendorId}`
        : '/api/v1/context/vendors'

      const response = await fetch(url, {
        method: vendorId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save vendor')
      }

      toast.success(isEditing ? 'Vendor updated successfully' : 'Vendor created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the vendor or data processor information below.'
              : 'Add a new vendor or data processor for GDPR compliance tracking and DPA management.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Microsoft Corporation" {...field} />
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
                        placeholder="Briefly describe the vendor's services..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vendor_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Role *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="processor">Processor</SelectItem>
                          <SelectItem value="joint_controller">Joint Controller</SelectItem>
                          <SelectItem value="recipient">Recipient</SelectItem>
                          <SelectItem value="sub_processor">Sub-processor</SelectItem>
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Jurisdiction</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., United States, European Union" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Contact Information</h3>

              <FormField
                control={form.control}
                name="primary_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@vendor.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://vendor.com" type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DPA Information Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Data Processing Agreement (DPA)</h3>

              <FormField
                control={form.control}
                name="has_dpa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">DPA Signed</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Indicates whether a Data Processing Agreement is in place
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

              {hasDpa && (
                <FormField
                  control={form.control}
                  name="dpa_expires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DPA Expiration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Vendor' : 'Create Vendor'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
