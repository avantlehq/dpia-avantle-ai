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
  locale: string
  vendorId?: string
  initialData?: Vendor
}

export function VendorForm({ mode, locale, vendorId, initialData }: VendorFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        toast.success(locale === 'sk' ? 'Dodávateľ bol vytvorený' : 'Vendor created successfully')
      } else if (vendorId) {
        await updateVendor(vendorId, data)
        toast.success(locale === 'sk' ? 'Dodávateľ bol aktualizovaný' : 'Vendor updated successfully')
      }

      router.push(`/${locale}/context/vendors`)
      router.refresh()
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast.error(error instanceof Error ? error.message :
        (locale === 'sk' ? 'Nepodarilo sa uložiť dodávateľa' : 'Failed to save vendor'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/vendors`)
  }

  const title = mode === 'create'
    ? (locale === 'sk' ? 'Nový dodávateľ' : 'New Vendor')
    : (locale === 'sk' ? 'Upraviť dodávateľa' : 'Edit Vendor')

  const description = mode === 'create'
    ? (locale === 'sk' ? 'Pridať nového dodávateľa alebo spracovateľa údajov pre sledovanie súladu s GDPR a správu DPA.' : 'Add a new vendor or data processor for GDPR compliance tracking and DPA management.')
    : (locale === 'sk' ? 'Aktualizovať informácie o dodávateľovi alebo spracovateľovi údajov.' : 'Update the vendor or data processor information.')

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
              {locale === 'sk' ? 'Základné informácie' : 'Basic Information'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Názov dodávateľa' : 'Vendor Name'} *</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., Microsoft Corporation' : 'e.g., Microsoft Corporation'} {...field} />
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
                        placeholder={locale === 'sk' ? 'Stručný popis služieb dodávateľa...' : 'Briefly describe the vendor\'s services...'}
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
                      <FormLabel>{locale === 'sk' ? 'Rola dodávateľa' : 'Vendor Role'} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="processor">{locale === 'sk' ? 'Spracovateľ' : 'Processor'}</SelectItem>
                          <SelectItem value="joint_controller">{locale === 'sk' ? 'Spoločný prevádzkovateľ' : 'Joint Controller'}</SelectItem>
                          <SelectItem value="recipient">{locale === 'sk' ? 'Príjemca' : 'Recipient'}</SelectItem>
                          <SelectItem value="sub_processor">{locale === 'sk' ? 'Podspracovateľ' : 'Sub-processor'}</SelectItem>
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
          </div>

          {/* Contact Information Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Kontaktné informácie' : 'Contact Information'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="primary_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Primárny kontakt' : 'Primary Contact'}</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'Meno kontaktnej osoby' : 'Contact person name'} {...field} />
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
                    <FormLabel>{locale === 'sk' ? 'Kontaktný email' : 'Contact Email'}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={locale === 'sk' ? 'kontakt@dodavatel.sk' : 'contact@vendor.com'}
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
                    <FormLabel>{locale === 'sk' ? 'Webová stránka' : 'Website'}</FormLabel>
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
                    <FormLabel>{locale === 'sk' ? 'Lokalita' : 'Location'}</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., Spojené štáty' : 'e.g., United States'} {...field} />
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
              {locale === 'sk' ? 'Súlad DPA' : 'DPA Compliance'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="has_dpa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {locale === 'sk' ? 'Zmluva o spracovaní údajov (DPA)' : 'Data Processing Agreement (DPA)'}
                      </FormLabel>
                      <FormDescription>
                        {locale === 'sk'
                          ? 'Či je s dodávateľom podpísaná zmluva DPA'
                          : 'Whether a DPA is signed with this vendor'}
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
                      <FormLabel>{locale === 'sk' ? 'Dátum exspirácie DPA' : 'DPA Expiration Date'}</FormLabel>
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
