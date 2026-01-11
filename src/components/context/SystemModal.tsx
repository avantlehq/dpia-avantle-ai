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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const systemSchema = z.object({
  name: z.string().min(1, 'System name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  system_type: z.string().min(1, 'System type is required'),
  criticality: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['active', 'inactive']),
  owner_team: z.string().max(100, 'Owner team too long').optional(),
  technical_contact: z.string().email('Invalid email').max(100, 'Email too long').optional(),
})

type SystemFormData = z.infer<typeof systemSchema>

interface SystemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  systemId?: string
  initialData?: Partial<SystemFormData>
}

export function SystemModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  systemId, 
  initialData 
}: SystemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = Boolean(systemId)

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      name: '',
      description: '',
      system_type: '',
      criticality: 'medium',
      status: 'active',
      owner_team: '',
      technical_contact: '',
      ...initialData,
    },
  })

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        system_type: initialData.system_type || '',
        criticality: initialData.criticality || 'medium',
        status: initialData.status || 'active',
        owner_team: initialData.owner_team || '',
        technical_contact: initialData.technical_contact || '',
      })
    }
  }, [isOpen, initialData, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: SystemFormData) => {
    setIsSubmitting(true)
    try {
      const url = systemId 
        ? `/api/v1/context/systems/${systemId}`
        : '/api/v1/context/systems'
      
      const response = await fetch(url, {
        method: systemId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save system')
      }

      toast.success(isEditing ? 'System updated successfully' : 'System created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving system:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save system')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit IT System' : 'Add New IT System'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the IT system information below.' 
              : 'Add a new IT system for data processing tracking and compliance management.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Customer Database" {...field} />
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
                      placeholder="Briefly describe the system's purpose..."
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
                name="system_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="erp">ERP</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criticality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Criticality *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="owner_team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Team</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., IT Operations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technical_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="technical-contact@company.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update System' : 'Create System'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}