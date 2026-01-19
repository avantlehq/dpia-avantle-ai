/**
 * Data Flow Form Component
 *
 * Shared form for creating and editing data flows.
 * Used in both /new and /[id] routes.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocale, useTranslations } from 'next-intl'
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
import { ContextFormShell } from './ContextFormShell'
import { createDataFlow, updateDataFlow, type DataFlow } from '@/lib/context/data-flows'

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

interface DataFlowFormProps {
  mode: 'create' | 'edit'
  flowId?: string
  initialData?: DataFlow
}

export function DataFlowForm({ mode, flowId, initialData }: DataFlowFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [systems, setSystems] = useState<Array<{ id: string; name: string }>>([])
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>([])

  // Translations
  const tc = useTranslations('common')
  const tcc = useTranslations('context.common')
  const t = useTranslations('context.dataFlows')

  const form = useForm<DataFlowFormData>({
    resolver: zodResolver(dataFlowSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      purpose: initialData?.purpose || '',
      flow_direction: initialData?.flow_direction || 'internal',
      frequency: initialData?.frequency || '',
      volume_estimate: initialData?.volume_estimate || '',
      criticality: initialData?.criticality || 'medium',
      status: initialData?.status || 'active',
      from_system: initialData?.from_system || '',
      to_system: initialData?.to_system || '',
      from_vendor: initialData?.from_vendor || '',
      to_vendor: initialData?.to_vendor || '',
      encryption_in_transit: initialData?.encryption_in_transit ?? true,
      cross_border_transfer: initialData?.cross_border_transfer ?? false,
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

    fetchReferences()
  }, [])

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

      if (mode === 'create') {
        await createDataFlow(submitData)
        toast.success(t('createdSuccess'))
      } else if (flowId) {
        await updateDataFlow(flowId, submitData)
        toast.success(t('updatedSuccess'))
      }

      router.push(`/${locale}/context/data-flows`)
      router.refresh()
    } catch (error) {
      console.error('Error saving data flow:', error)
      toast.error(error instanceof Error ? error.message : t('failedSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/data-flows`)
  }

  const title = mode === 'create' ? t('createTitle') : t('editTitle')
  const description = mode === 'create' ? t('createDescription') : t('editDescription')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/data-flows`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {tcc('basicInfo')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('namePlaceholder')} {...field} />
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
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('descriptionPlaceholder')}
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
                    <FormLabel>{t('purpose')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('purposePlaceholder')}
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Flow Configuration Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('flowConfiguration')}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flow_direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('direction')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inbound">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('directionInbound')}</span>
                              <span className="text-sm text-muted-foreground">{t('directionInboundDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="outbound">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('directionOutbound')}</span>
                              <span className="text-sm text-muted-foreground">{t('directionOutboundDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="bidirectional">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('directionBidirectional')}</span>
                              <span className="text-sm text-muted-foreground">{t('directionBidirectionalDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="internal">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('directionInternal')}</span>
                              <span className="text-sm text-muted-foreground">{t('directionInternalDesc')}</span>
                            </div>
                          </SelectItem>
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
                      <FormLabel>{t('criticality')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCriticality')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex flex-col">
                              <span className="font-medium">{tcc('criticalityLow')}</span>
                              <span className="text-sm text-muted-foreground">{t('criticalityLowDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex flex-col">
                              <span className="font-medium">{tcc('criticalityMedium')}</span>
                              <span className="text-sm text-muted-foreground">{t('criticalityMediumDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex flex-col">
                              <span className="font-medium">{tcc('criticalityHigh')}</span>
                              <span className="text-sm text-muted-foreground">{t('criticalityHighDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="critical">
                            <div className="flex flex-col">
                              <span className="font-medium">{tcc('criticalityCritical')}</span>
                              <span className="text-sm text-muted-foreground">{t('criticalityCriticalDesc')}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('frequency')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectFrequency')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('notSpecified')}</SelectItem>
                          <SelectItem value="Real-time">{t('frequencyRealtime')}</SelectItem>
                          <SelectItem value="Continuous">{t('frequencyContinuous')}</SelectItem>
                          <SelectItem value="Hourly">{t('frequencyHourly')}</SelectItem>
                          <SelectItem value="Daily">{t('frequencyDaily')}</SelectItem>
                          <SelectItem value="Weekly">{t('frequencyWeekly')}</SelectItem>
                          <SelectItem value="Monthly">{t('frequencyMonthly')}</SelectItem>
                          <SelectItem value="On-demand">{t('frequencyOnDemand')}</SelectItem>
                          <SelectItem value="Batch">{t('frequencyBatch')}</SelectItem>
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
                      <FormLabel>{t('volume')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectVolume')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('notSpecified')}</SelectItem>
                          <SelectItem value="Low (< 1GB)">{t('volumeLow')}</SelectItem>
                          <SelectItem value="Medium (1-10GB)">{t('volumeMedium')}</SelectItem>
                          <SelectItem value="High (10-100GB)">{t('volumeHigh')}</SelectItem>
                          <SelectItem value="Very High (> 100GB)">{t('volumeVeryHigh')}</SelectItem>
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
                    <FormLabel>{t('status')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{tcc('active')}</SelectItem>
                        <SelectItem value="inactive">{tcc('inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Flow Endpoints Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('flowEndpoints')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {t('source')}
                </h4>

                <FormField
                  control={form.control}
                  name="from_system"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fromSystem')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectSourceSystem')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('noSystem')}</SelectItem>
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
                      <FormLabel>{t('fromVendor')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectSourceVendor')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('noVendor')}</SelectItem>
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
                <h4 className="text-md font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {t('destination')}
                </h4>

                <FormField
                  control={form.control}
                  name="to_system"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('toSystem')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectDestinationSystem')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('noSystem')}</SelectItem>
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
                      <FormLabel>{t('toVendor')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectDestinationVendor')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('noVendor')}</SelectItem>
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

          {/* Security & Compliance Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('securityCompliance')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="encryption_in_transit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('encryptionInTransit')}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('encryptionInTransitDescription')}
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
                      <FormLabel className="text-base">
                        {t('crossBorderTransfer')}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('crossBorderTransferDescription')}
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
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-default)]">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {tc('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create'
                ? tc('create')
                : tc('save')
              }
            </Button>
          </div>
        </form>
      </Form>
    </ContextFormShell>
  )
}
