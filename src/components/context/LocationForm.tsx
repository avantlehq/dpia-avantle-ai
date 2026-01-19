/**
 * Location Form Component
 *
 * Shared form for creating and editing physical locations.
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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ContextFormShell } from './ContextFormShell'
import { JurisdictionSelect } from './JurisdictionSelect'
import { createLocation, updateLocation, type Location } from '@/lib/context/locations'

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(255, 'Name too long'),
  jurisdiction_id: z.string().uuid('Please select a jurisdiction'),
  description: z.string().max(1000, 'Description too long').optional(),
  address: z.string().max(500, 'Address too long').optional(),
  city: z.string().max(100, 'City name too long').optional(),
  status: z.enum(['active', 'inactive']).optional(),
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
      jurisdiction_id: initialData?.jurisdiction_id || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      status: initialData?.status || 'active',
    },
  })

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
    ? (locale === 'sk' ? 'Pridať novú fyzickú lokalitu (kancelária, dátové centrum, zariadenie) s priradenou jurisdikciou.' : 'Add a new physical location (office, data center, facility) with assigned jurisdiction.')
    : (locale === 'sk' ? 'Aktualizovať informácie o fyzickej lokalite.' : 'Update the physical location information.')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/locations`}
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
                    <FormLabel>{locale === 'sk' ? 'Názov lokality' : 'Location Name'} *</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., Hlavná kancelária Bratislava' : 'e.g., Main Office Bratislava'} {...field} />
                    </FormControl>
                    <FormDescription>
                      {locale === 'sk' ? 'Názov fyzickej lokality (napr., kancelárie, dátové centrum)' : 'Name of the physical location (e.g., office, data center)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jurisdiction_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Jurisdikcia' : 'Jurisdiction'} *</FormLabel>
                    <FormControl>
                      <JurisdictionSelect
                        value={field.value}
                        onChange={field.onChange}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      {locale === 'sk' ? 'Krajina alebo jurisdikcia tejto lokality. ✓ = Má rozhodnutie o primeranosti GDPR' : 'Country or jurisdiction of this location. ✓ = Has GDPR adequacy decision'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Popis (voliteľné)' : 'Description (Optional)'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Podrobný popis lokality' : 'Detailed location description'}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {locale === 'sk' ? 'Dodatočné informácie o lokalite' : 'Additional information about the location'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Adresa (voliteľné)' : 'Address (Optional)'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={locale === 'sk' ? 'napr., Hlavná 123' : 'e.g., Main Street 123'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Mesto (voliteľné)' : 'City (Optional)'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={locale === 'sk' ? 'napr., Bratislava' : 'e.g., Bratislava'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === 'edit' && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Stav' : 'Status'}</FormLabel>
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
              )}
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
