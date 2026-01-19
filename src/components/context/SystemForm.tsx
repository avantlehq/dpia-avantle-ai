/**
 * System Form Component
 *
 * Shared form for creating and editing IT systems.
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
import { createSystem, updateSystem, type System } from '@/lib/context/systems'

// Phase 1: Zod validation messages remain in English (to be translated in Phase 2)
const systemSchema = z.object({
  name: z.string().min(1, 'System name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  system_type: z.string().min(1, 'System type is required'),
  criticality: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['active', 'inactive']),
  owner_team: z.string().max(100, 'Owner team too long').optional(),
  technical_contact: z.string().email('Invalid email').max(100, 'Email too long').optional().or(z.literal('')),
})

type SystemFormData = z.infer<typeof systemSchema>

interface SystemFormProps {
  mode: 'create' | 'edit'
  systemId?: string
  initialData?: System
}

export function SystemForm({ mode, systemId, initialData }: SystemFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Translations
  const tc = useTranslations('common')
  const tcc = useTranslations('context.common')
  const t = useTranslations('context.systems')

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      system_type: initialData?.system_type || '',
      criticality: initialData?.criticality || 'medium',
      status: initialData?.status || 'active',
      owner_team: initialData?.owner_team || '',
      technical_contact: initialData?.technical_contact || '',
    },
  })

  const onSubmit = async (data: SystemFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await createSystem(data)
        toast.success(t('createdSuccess'))
      } else if (systemId) {
        await updateSystem(systemId, data)
        toast.success(t('updatedSuccess'))
      }

      router.push(`/${locale}/context/systems`)
      router.refresh() // Invalidate cache
    } catch (error) {
      console.error('Error saving system:', error)
      toast.error(error instanceof Error ? error.message : t('failedSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/systems`)
  }

  const title = mode === 'create' ? t('createTitle') : t('editTitle')
  const description = mode === 'create' ? t('createDescription') : t('editDescription')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/systems`}
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
            </div>
          </div>

          {/* System Configuration Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {tcc('configuration')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="system_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('systemType')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('systemType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="database">{t('typeDatabase')}</SelectItem>
                        <SelectItem value="application">{t('typeApplication')}</SelectItem>
                        <SelectItem value="api">{t('typeApi')}</SelectItem>
                        <SelectItem value="storage">{t('typeStorage')}</SelectItem>
                        <SelectItem value="analytics">{t('typeAnalytics')}</SelectItem>
                        <SelectItem value="crm">{t('typeCrm')}</SelectItem>
                        <SelectItem value="erp">{t('typeErp')}</SelectItem>
                        <SelectItem value="other">{t('typeOther')}</SelectItem>
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
                    <FormLabel>{t('criticality')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">{t('criticalityLow')}</SelectItem>
                        <SelectItem value="medium">{t('criticalityMedium')}</SelectItem>
                        <SelectItem value="high">{t('criticalityHigh')}</SelectItem>
                        <SelectItem value="critical">{t('criticalityCritical')}</SelectItem>
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

          {/* Ownership & Contacts Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('owner')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="owner_team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('owner')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('ownerPlaceholder')} {...field} />
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
                    <FormLabel>{t('technicalContact')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('technicalContactPlaceholder')}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
              {mode === 'create' ? tc('create') : tc('save')}
            </Button>
          </div>
        </form>
      </Form>
    </ContextFormShell>
  )
}
