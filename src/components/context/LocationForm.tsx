/**
 * Location Form Component
 *
 * Shared form for creating and editing locations/jurisdictions.
 * Used in both /new and /[id] routes.
 */

'use client'

import React, { useState } from 'react'
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
  FormDescription,
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
import { createLocation, updateLocation, type Location } from '@/lib/context/locations'

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

interface LocationFormProps {
  mode: 'create' | 'edit'
  locale: string
  locationId?: string
  initialData?: Location
}

export function LocationForm({ mode, locale, locationId, initialData }: LocationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: initialData?.name || '',
      country_code: initialData?.country_code || '',
      jurisdiction_type: initialData?.jurisdiction_type || 'third_country',
      adequacy_status: initialData?.adequacy_status || 'under_review',
      adequacy_decision_date: initialData?.adequacy_decision_date || '',
      adequacy_decision_reference: initialData?.adequacy_decision_reference || '',
      safeguards_required: initialData?.safeguards_required || false,
      safeguards_description: initialData?.safeguards_description || '',
      data_localization_requirements: initialData?.data_localization_requirements || false,
      status: initialData?.status || 'active',
      notes: initialData?.notes || '',
    },
  })

  const safeguardsRequired = form.watch('safeguards_required')
  const adequacyStatus = form.watch('adequacy_status')

  const onSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await createLocation(data)
        toast.success(locale === 'sk' ? 'Lokalita bola vytvorená' : 'Location created successfully')
      } else if (locationId) {
        await updateLocation(locationId, data)
        toast.success(locale === 'sk' ? 'Lokalita bola aktualizovaná' : 'Location updated successfully')
      }

      router.push(`/${locale}/context/locations`)
      router.refresh()
    } catch (error) {
      console.error('Error saving location:', error)
      toast.error(error instanceof Error ? error.message :
        (locale === 'sk' ? 'Nepodarilo sa uložiť lokalitu' : 'Failed to save location'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/locations`)
  }

  const title = mode === 'create'
    ? (locale === 'sk' ? 'Nová lokalita' : 'New Location')
    : (locale === 'sk' ? 'Upraviť lokalitu' : 'Edit Location')

  const description = mode === 'create'
    ? (locale === 'sk' ? 'Pridať novú lokalitu alebo jurisdikciu pre sledovanie súladu s GDPR a správu rozhodnutí o primeranosti.' : 'Add a new processing location or jurisdiction for GDPR compliance tracking and adequacy decision management.')
    : (locale === 'sk' ? 'Aktualizovať informácie o lokalite alebo jurisdikcii.' : 'Update the location or jurisdiction information.')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/locations`}
      locale={locale}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Základné informácie' : 'Basic Information'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Názov lokality' : 'Location Name'} *</FormLabel>
                      <FormControl>
                        <Input placeholder={locale === 'sk' ? 'napr., Spojené štáty' : 'e.g., United States'} {...field} />
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
                      <FormLabel>{locale === 'sk' ? 'Kód krajiny' : 'Country Code'} *</FormLabel>
                      <FormControl>
                        <Input placeholder={locale === 'sk' ? 'napr., US, SK' : 'e.g., US, SK'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jurisdiction_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Typ jurisdikcie' : 'Jurisdiction Type'} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eu_member_state">{locale === 'sk' ? 'Členský štát EU' : 'EU Member State'}</SelectItem>
                          <SelectItem value="eea_country">{locale === 'sk' ? 'Krajina EHP' : 'EEA Country'}</SelectItem>
                          <SelectItem value="third_country">{locale === 'sk' ? 'Tretia krajina' : 'Third Country'}</SelectItem>
                          <SelectItem value="international">{locale === 'sk' ? 'Medzinárodná' : 'International'}</SelectItem>
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
                      <FormLabel>{locale === 'sk' ? 'Stav' : 'Status'} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">{locale === 'sk' ? 'Aktívna' : 'Active'}</SelectItem>
                          <SelectItem value="inactive">{locale === 'sk' ? 'Neaktívna' : 'Inactive'}</SelectItem>
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
                    <FormLabel>{locale === 'sk' ? 'Poznámky' : 'Notes'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Ďalšie poznámky o tejto lokalite...' : 'Additional notes about this location...'}
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

          {/* GDPR Adequacy Decision Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Rozhodnutie o primeranosti GDPR' : 'GDPR Adequacy Decision'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="adequacy_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Stav primeranosti' : 'Adequacy Status'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="adequate">{locale === 'sk' ? 'Primeraná' : 'Adequate'}</SelectItem>
                        <SelectItem value="not_adequate">{locale === 'sk' ? 'Neprimeraná' : 'Not Adequate'}</SelectItem>
                        <SelectItem value="partial">{locale === 'sk' ? 'Čiastočná' : 'Partial'}</SelectItem>
                        <SelectItem value="under_review">{locale === 'sk' ? 'Prehodnocuje sa' : 'Under Review'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {adequacyStatus === 'adequate' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="adequacy_decision_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{locale === 'sk' ? 'Dátum rozhodnutia' : 'Decision Date'}</FormLabel>
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
                        <FormLabel>{locale === 'sk' ? 'Referencia rozhodnutia' : 'Decision Reference'}</FormLabel>
                        <FormControl>
                          <Input placeholder={locale === 'sk' ? 'napr., Rozhodnutie Komisie 2016/1250' : 'e.g., Commission Decision 2016/1250'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Transfer Safeguards Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Záruky prenosu' : 'Transfer Safeguards'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="safeguards_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {locale === 'sk' ? 'Vyžadujú sa záruky' : 'Safeguards Required'}
                      </FormLabel>
                      <FormDescription>
                        {locale === 'sk'
                          ? 'Či sú potrebné ďalšie záruky pre prenos údajov'
                          : 'Whether additional safeguards are needed for data transfers'}
                      </FormDescription>
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
                      <FormLabel>{locale === 'sk' ? 'Popis záruk' : 'Safeguards Description'}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={locale === 'sk' ? 'Popíšte zavedené záruky (napr., štandardné zmluvné doložky, záväzné podnikové pravidlá)...' : 'Describe the safeguards in place (e.g., Standard Contractual Clauses, Binding Corporate Rules)...'}
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
                      <FormLabel className="text-base">
                        {locale === 'sk' ? 'Požiadavky na lokalizáciu údajov' : 'Data Localization Requirements'}
                      </FormLabel>
                      <FormDescription>
                        {locale === 'sk'
                          ? 'Či táto jurisdikcia má zákony o lokalizácii údajov'
                          : 'Whether this jurisdiction has data localization laws'}
                      </FormDescription>
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
