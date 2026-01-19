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
import { useLocale, useTranslations } from 'next-intl'
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

// Phase 1: Zod validation messages remain in English (to be translated in Phase 2)
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
  locationId?: string
  initialData?: Location
}

export function LocationForm({ mode, locationId, initialData }: LocationFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Translations
  const tc = useTranslations('common')
  const tcc = useTranslations('context.common')
  const t = useTranslations('context.locations')

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
        toast.success(t('createdSuccess'))
      } else if (locationId) {
        await updateLocation(locationId, data)
        toast.success(t('updatedSuccess'))
      }

      router.push(`/${locale}/context/locations`)
      router.refresh()
    } catch (error) {
      console.error('Error saving location:', error)
      toast.error(error instanceof Error ? error.message : t('failedSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/locations`)
  }

  const title = mode === 'create' ? t('createTitle') : t('editTitle')
  const description = mode === 'create' ? t('createDescription') : t('editDescription')

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
                    <FormDescription>
                      {t('nameDescription')}
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
                    <FormLabel>{t('jurisdiction')} *</FormLabel>
                    <FormControl>
                      <JurisdictionSelect
                        value={field.value}
                        onChange={field.onChange}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('jurisdictionDescription')}
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
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('descriptionPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('descriptionHelp')}
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
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('addressPlaceholder')}
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
                    <FormLabel>{t('city')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('cityPlaceholder')}
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
                      <FormLabel>{t('status')}</FormLabel>
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
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-default)]">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {tc('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? tc('create') : tc('save')}
            </Button>
          </div>
        </form>
      </Form>
    </ContextFormShell>
  )
}
