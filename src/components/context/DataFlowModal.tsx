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

const dataFlowSchema = z.object({
  name: z.string().min(1, 'Flow name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  purpose: z.string().max(1000, 'Purpose too long').optional(),
  flow_direction: z.enum(['inbound', 'outbound', 'bidirectional', 'internal']),
  frequency: z.string().max(100, 'Frequency description too long').optional(),
  volume_estimate: z.string().max(100, 'Volume estimate too long').optional(),
  criticality: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['active', 'inactive']),
  from_system: z.string().optional(),
  to_system: z.string().optional(),
  from_vendor: z.string().optional(),
  to_vendor: z.string().optional(),
  encryption_in_transit: z.boolean(),
  cross_border_transfer: z.boolean(),
})

type DataFlowFormData = z.infer<typeof dataFlowSchema>

interface DataFlowModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  flowId?: string
  initialData?: Partial<DataFlowFormData>
}

const flowDirectionOptions = [
  { value: 'inbound', label: 'Inbound', description: 'Data flowing into the organization' },
  { value: 'outbound', label: 'Outbound', description: 'Data flowing out of the organization' },
  { value: 'bidirectional', label: 'Bidirectional', description: 'Data flowing in both directions' },
  { value: 'internal', label: 'Internal', description: 'Data flowing within the organization' },
]

const criticalityOptions = [
  { value: 'low', label: 'Low', description: 'Minimal impact if disrupted' },
  { value: 'medium', label: 'Medium', description: 'Moderate impact if disrupted' },
  { value: 'high', label: 'High', description: 'Significant impact if disrupted' },
  { value: 'critical', label: 'Critical', description: 'Business critical data flow' },
]

const frequencyOptions = [
  'Real-time',
  'Continuous',
  'Hourly',
  'Daily',
  'Weekly',
  'Monthly',
  'On-demand',
  'Batch',
]

const volumeOptions = [
  'Low (< 1GB)',
  'Medium (1-10GB)',
  'High (10-100GB)',
  'Very High (> 100GB)',
]

export function DataFlowModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  flowId, 
  initialData 
}: DataFlowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [systems, setSystems] = useState<Array<{ id: string; name: string }>>([])
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>([])
  const isEditing = Boolean(flowId)

  const form = useForm<DataFlowFormData>({
    resolver: zodResolver(dataFlowSchema),
    defaultValues: {
      name: '',
      description: '',
      purpose: '',
      flow_direction: 'internal',
      frequency: '',
      volume_estimate: '',
      criticality: 'medium',
      status: 'active',
      from_system: '',
      to_system: '',
      from_vendor: '',
      to_vendor: '',
      encryption_in_transit: true,
      cross_border_transfer: false,
      ...initialData,
    },
  })

  // Fetch systems and vendors for dropdowns
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')

        const [systemsResponse, vendorsResponse] = await Promise.all([
          contextApiService.getSystems(),
          contextApiService.getVendors(),
        ])

        setSystems((systemsResponse.data || []).map((sys: { id: string; name: string }) => ({ id: sys.id, name: sys.name })))
        setVendors((vendorsResponse.data || []).map((vendor: { id: string; name: string }) => ({ id: vendor.id, name: vendor.name })))
      } catch (error) {
        console.error('Failed to fetch reference data:', error)
      }
    }

    if (isOpen) {
      fetchReferences()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        purpose: initialData.purpose || '',
        flow_direction: initialData.flow_direction || 'internal',
        frequency: initialData.frequency || '',
        volume_estimate: initialData.volume_estimate || '',
        criticality: initialData.criticality || 'medium',
        status: initialData.status || 'active',
        from_system: initialData.from_system || '',
        to_system: initialData.to_system || '',
        from_vendor: initialData.from_vendor || '',
        to_vendor: initialData.to_vendor || '',
        encryption_in_transit: initialData.encryption_in_transit ?? true,
        cross_border_transfer: initialData.cross_border_transfer ?? false,
      })
    }
  }, [isOpen, initialData, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: DataFlowFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up data - remove empty optional fields
      const submitData = { ...data }
      
      // Remove empty system/vendor references
      if (!submitData.from_system || submitData.from_system === 'none') {
        delete submitData.from_system
      }
      if (!submitData.to_system || submitData.to_system === 'none') {
        delete submitData.to_system
      }
      if (!submitData.from_vendor || submitData.from_vendor === 'none') {
        delete submitData.from_vendor
      }
      if (!submitData.to_vendor || submitData.to_vendor === 'none') {
        delete submitData.to_vendor
      }

      const url = flowId 
        ? `/api/v1/context/data-flows/${flowId}`
        : '/api/v1/context/data-flows'
      
      const response = await fetch(url, {
        method: flowId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save data flow')
      }

      toast.success(isEditing ? 'Data flow updated successfully' : 'Data flow created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving data flow:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save data flow')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Data Flow' : 'Add New Data Flow'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the data flow information below.' 
              : 'Create a new data flow for GDPR data mapping and compliance tracking.'}
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
                    <FormLabel>Flow Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Customer Data Export, Payment Processing" {...field} />
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
                        placeholder="Describe this data flow and what data it includes..."
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
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain the business purpose and necessity of this data flow..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Flow Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Flow Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flow_direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flow Direction *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {flowDirectionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-sm text-muted-foreground">{option.description}</span>
                              </div>
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
                  name="criticality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Criticality</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select criticality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {criticalityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-sm text-muted-foreground">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Not specified</SelectItem>
                          {frequencyOptions.map((freq) => (
                            <SelectItem key={freq} value={freq}>
                              {freq}
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
                  name="volume_estimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume Estimate</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select volume" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Not specified</SelectItem>
                          {volumeOptions.map((vol) => (
                            <SelectItem key={vol} value={vol}>
                              {vol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Endpoints */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Flow Endpoints</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-md font-medium">Source (From)</h4>
                  
                  <FormField
                    control={form.control}
                    name="from_system"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From System</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source system" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No system</SelectItem>
                            {systems.map((system) => (
                              <SelectItem key={system.id} value={system.id}>
                                {system.name}
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
                    name="from_vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Vendor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No vendor</SelectItem>
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium">Destination (To)</h4>
                  
                  <FormField
                    control={form.control}
                    name="to_system"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To System</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination system" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No system</SelectItem>
                            {systems.map((system) => (
                              <SelectItem key={system.id} value={system.id}>
                                {system.name}
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
                    name="to_vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Vendor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No vendor</SelectItem>
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Security & Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security & Compliance</h3>
              
              <FormField
                control={form.control}
                name="encryption_in_transit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Encryption in Transit</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Is data encrypted during transmission (TLS/SSL)?
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
                name="cross_border_transfer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Cross-Border Transfer</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Does this flow transfer data across international borders?
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

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Flow' : 'Create Flow'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}