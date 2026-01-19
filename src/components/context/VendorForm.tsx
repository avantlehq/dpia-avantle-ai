/**
 * Vendor Form Component
 *
 * Shared form for creating and editing vendors/processors.
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
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ContextFormShell } from './ContextFormShell'
import { createVendor, updateVendor, type Vendor } from '@/lib/context/vendors'

// Phase 1: Zod validation messages remain in English (to be translated in Phase 2)
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

interface VendorFormProps {
  mode: 'create' | 'edit'
  vendorId?: string
  initialData?: Vendor
}

export function VendorForm({ mode, vendorId, initialData }: VendorFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Translations
  const tc = useTranslations('common')
  const tcc = useTranslations('context.common')
  const t = useTranslations('context.vendors')

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      website: initialData?.website || '',
      contact_email: initialData?.contact_email || '',
      primary_contact: initialData?.primary_contact || '',
      vendor_role: initialData?.vendor_role || 'processor',
      status: initialData?.status || 'active',
      has_dpa: initialData?.has_dpa || false,
      dpa_expires: initialData?.dpa_expires || '',
      location: initialData?.location || '',
    },
  })

  const hasDpa = form.watch('has_dpa')

  const onSubmit = async (data: VendorFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await createVendor(data)
        toast.success(t('createdSuccess'))
      } else if (vendorId) {
        await updateVendor(vendorId, data)
        toast.success(t('updatedSuccess'))
      }

      router.push(`/${locale}/context/vendors`)
      router.refresh()
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast.error(error instanceof Error ? error.message : t('failedSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/vendors`)
  }

  const title = mode === 'create' ? t('createTitle') : t('editTitle')
  const description = mode === 'create' ? t('createDescription') : t('editDescription')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/vendors`}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vendor_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vendorRole')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="processor">{t('roleProcessor')}</SelectItem>
                          <SelectItem value="joint_controller">{t('roleJointController')}</SelectItem>
                          <SelectItem value="recipient">{t('roleRecipient')}</SelectItem>
                          <SelectItem value="sub_processor">{t('roleSubProcessor')}</SelectItem>
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
          </div>

          {/* Contact Information Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('contact')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="primary_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactPerson')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('contactPersonPlaceholder')} {...field} />
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
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        {...field}
                      />
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
                    <FormLabel>{t('location')}</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.vendor.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('location')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('locationDescription')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* DPA Compliance Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('compliance')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="has_dpa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('hasDpa')}
                      </FormLabel>
                      <FormDescription>
                        {t('hasDpa')}
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

              {hasDpa && (
                <FormField
                  control={form.control}
                  name="dpa_expires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dpaExpires')}</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
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
