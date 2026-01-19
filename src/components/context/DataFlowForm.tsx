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
  locale: string
  flowId?: string
  initialData?: DataFlow
}

const flowDirectionOptions = [
  { value: 'inbound', label: { en: 'Inbound', sk: 'Vstupný' }, description: { en: 'Data flowing into the organization', sk: 'Údaje plynúce do organizácie' } },
  { value: 'outbound', label: { en: 'Outbound', sk: 'Výstupný' }, description: { en: 'Data flowing out of the organization', sk: 'Údaje plynúce z organizácie' } },
  { value: 'bidirectional', label: { en: 'Bidirectional', sk: 'Obojsmerný' }, description: { en: 'Data flowing in both directions', sk: 'Údaje plynúce oboma smermi' } },
  { value: 'internal', label: { en: 'Internal', sk: 'Interný' }, description: { en: 'Data flowing within the organization', sk: 'Údaje plynúce v rámci organizácie' } },
]

const criticalityOptions = [
  { value: 'low', label: { en: 'Low', sk: 'Nízka' }, description: { en: 'Minimal impact if disrupted', sk: 'Minimálny dopad pri prerušení' } },
  { value: 'medium', label: { en: 'Medium', sk: 'Stredná' }, description: { en: 'Moderate impact if disrupted', sk: 'Stredný dopad pri prerušení' } },
  { value: 'high', label: { en: 'High', sk: 'Vysoká' }, description: { en: 'Significant impact if disrupted', sk: 'Značný dopad pri prerušení' } },
  { value: 'critical', label: { en: 'Critical', sk: 'Kritická' }, description: { en: 'Business critical data flow', sk: 'Kritický dátový tok pre podnikanie' } },
]

const frequencyOptions = [
  { value: 'Real-time', label: { en: 'Real-time', sk: 'V reálnom čase' } },
  { value: 'Continuous', label: { en: 'Continuous', sk: 'Nepretržite' } },
  { value: 'Hourly', label: { en: 'Hourly', sk: 'Každú hodinu' } },
  { value: 'Daily', label: { en: 'Daily', sk: 'Denne' } },
  { value: 'Weekly', label: { en: 'Weekly', sk: 'Týždenne' } },
  { value: 'Monthly', label: { en: 'Monthly', sk: 'Mesačne' } },
  { value: 'On-demand', label: { en: 'On-demand', sk: 'Na požiadanie' } },
  { value: 'Batch', label: { en: 'Batch', sk: 'Dávkovo' } },
]

const volumeOptions = [
  { value: 'Low (< 1GB)', label: { en: 'Low (< 1GB)', sk: 'Nízky (< 1GB)' } },
  { value: 'Medium (1-10GB)', label: { en: 'Medium (1-10GB)', sk: 'Stredný (1-10GB)' } },
  { value: 'High (10-100GB)', label: { en: 'High (10-100GB)', sk: 'Vysoký (10-100GB)' } },
  { value: 'Very High (> 100GB)', label: { en: 'Very High (> 100GB)', sk: 'Veľmi vysoký (> 100GB)' } },
]

export function DataFlowForm({ mode, locale, flowId, initialData }: DataFlowFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [systems, setSystems] = useState<Array<{ id: string; name: string }>>([])
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>([])

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
        toast.success(locale === 'sk' ? 'Dátový tok bol vytvorený' : 'Data flow created successfully')
      } else if (flowId) {
        await updateDataFlow(flowId, submitData)
        toast.success(locale === 'sk' ? 'Dátový tok bol aktualizovaný' : 'Data flow updated successfully')
      }

      router.push(`/${locale}/context/data-flows`)
      router.refresh()
    } catch (error) {
      console.error('Error saving data flow:', error)
      toast.error(error instanceof Error ? error.message :
        (locale === 'sk' ? 'Nepodarilo sa uložiť dátový tok' : 'Failed to save data flow'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/data-flows`)
  }

  const title = mode === 'create'
    ? (locale === 'sk' ? 'Nový dátový tok' : 'New Data Flow')
    : (locale === 'sk' ? 'Upraviť dátový tok' : 'Edit Data Flow')

  const description = mode === 'create'
    ? (locale === 'sk' ? 'Vytvoriť nový dátový tok pre mapovanie údajov a sledovanie súladu s GDPR.' : 'Create a new data flow for GDPR data mapping and compliance tracking.')
    : (locale === 'sk' ? 'Aktualizovať informácie o dátovom toku.' : 'Update the data flow information.')

  const lang = locale === 'sk' ? 'sk' : 'en'

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
              {locale === 'sk' ? 'Základné informácie' : 'Basic Information'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Názov toku' : 'Flow Name'} *</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., Export zákazníckych údajov' : 'e.g., Customer Data Export'} {...field} />
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
                    <FormLabel>{locale === 'sk' ? 'Popis' : 'Description'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Popis tohto dátového toku a aké údaje obsahuje...' : 'Describe this data flow and what data it includes...'}
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
                    <FormLabel>{locale === 'sk' ? 'Účel' : 'Purpose'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Vysvetlite obchodný účel a nevyhnutnosť tohto dátového toku...' : 'Explain the business purpose and necessity of this data flow...'}
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
              {locale === 'sk' ? 'Konfigurácia toku' : 'Flow Configuration'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flow_direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Smer toku' : 'Flow Direction'} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {flowDirectionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label[lang]}</span>
                                <span className="text-sm text-muted-foreground">{option.description[lang]}</span>
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
                      <FormLabel>{locale === 'sk' ? 'Kritickosť' : 'Criticality'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať kritickosť' : 'Select criticality'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {criticalityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label[lang]}</span>
                                <span className="text-sm text-muted-foreground">{option.description[lang]}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Frekvencia' : 'Frequency'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať frekvenciu' : 'Select frequency'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Nešpecifikované' : 'Not specified'}</SelectItem>
                          {frequencyOptions.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label[lang]}
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
                      <FormLabel>{locale === 'sk' ? 'Odhad objemu' : 'Volume Estimate'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať objem' : 'Select volume'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Nešpecifikované' : 'Not specified'}</SelectItem>
                          {volumeOptions.map((vol) => (
                            <SelectItem key={vol.value} value={vol.value}>
                              {vol.label[lang]}
                            </SelectItem>
                          ))}
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
                    <FormLabel>{locale === 'sk' ? 'Stav' : 'Status'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{locale === 'sk' ? 'Aktívny' : 'Active'}</SelectItem>
                        <SelectItem value="inactive">{locale === 'sk' ? 'Neaktívny' : 'Inactive'}</SelectItem>
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
              {locale === 'sk' ? 'Koncové body toku' : 'Flow Endpoints'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {locale === 'sk' ? 'Zdroj (Z)' : 'Source (From)'}
                </h4>

                <FormField
                  control={form.control}
                  name="from_system"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Zo systému' : 'From System'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať zdrojový systém' : 'Select source system'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Žiadny systém' : 'No system'}</SelectItem>
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
                      <FormLabel>{locale === 'sk' ? 'Od dodávateľa' : 'From Vendor'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať zdrojového dodávateľa' : 'Select source vendor'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Žiadny dodávateľ' : 'No vendor'}</SelectItem>
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
                  {locale === 'sk' ? 'Cieľ (Do)' : 'Destination (To)'}
                </h4>

                <FormField
                  control={form.control}
                  name="to_system"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Do systému' : 'To System'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať cieľový systém' : 'Select destination system'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Žiadny systém' : 'No system'}</SelectItem>
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
                      <FormLabel>{locale === 'sk' ? 'K dodávateľovi' : 'To Vendor'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať cieľového dodávateľa' : 'Select destination vendor'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Žiadny dodávateľ' : 'No vendor'}</SelectItem>
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
              {locale === 'sk' ? 'Bezpečnosť a súlad' : 'Security & Compliance'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="encryption_in_transit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {locale === 'sk' ? 'Šifrovanie počas prenosu' : 'Encryption in Transit'}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'sk'
                          ? 'Sú údaje šifrované počas prenosu (TLS/SSL)?'
                          : 'Is data encrypted during transmission (TLS/SSL)?'}
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
                        {locale === 'sk' ? 'Cezhraničný prenos' : 'Cross-Border Transfer'}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'sk'
                          ? 'Prenáša tento tok údaje cez medzinárodné hranice?'
                          : 'Does this flow transfer data across international borders?'}
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
              {locale === 'sk' ? 'Zrušiť' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create'
                ? (locale === 'sk' ? 'Vytvoriť' : 'Create')
                : (locale === 'sk' ? 'Uložiť' : 'Save')
              }
            </Button>
          </div>
        </form>
      </Form>
    </ContextFormShell>
  )
}
