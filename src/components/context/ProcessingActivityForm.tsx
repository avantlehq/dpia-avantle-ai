/**
 * Processing Activity Form Component
 *
 * Shared form for creating and editing processing activities.
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
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ContextFormShell } from './ContextFormShell'
import { createProcessingActivity, updateProcessingActivity, type ProcessingActivity } from '@/lib/context/processing-activities'

const processingActivitySchema = z.object({
  name: z.string().min(1, 'Activity name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  purpose: z.string().min(1, 'Purpose is required').max(1000, 'Purpose too long'),
  lawful_basis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  lawful_basis_explanation: z.string().max(1000, 'Explanation too long').optional(),
  data_subject_categories: z.string().max(500, 'Categories description too long').optional(),
  special_category_basis: z.enum(['none', 'explicit_consent', 'employment', 'vital_interests', 'public_interest', 'healthcare', 'research', 'legal_claims']).optional(),
  automated_decision_making: z.boolean(),
  profiling: z.boolean(),
  data_source: z.string().max(500, 'Data source description too long').optional(),
  dpo_review_required: z.boolean(),
  review_date: z.string().optional(),
})

type ProcessingActivityFormData = z.infer<typeof processingActivitySchema>

interface ProcessingActivityFormProps {
  mode: 'create' | 'edit'
  activityId?: string
  initialData?: ProcessingActivity
}

export function ProcessingActivityForm({ mode, activityId, initialData }: ProcessingActivityFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Translations
  const tc = useTranslations('common')
  const tcc = useTranslations('context.common')
  const t = useTranslations('context.processing')

  const form = useForm<ProcessingActivityFormData>({
    resolver: zodResolver(processingActivitySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      purpose: initialData?.purpose || '',
      lawful_basis: initialData?.lawful_basis || 'consent',
      lawful_basis_explanation: initialData?.lawful_basis_explanation || '',
      data_subject_categories: initialData?.data_subject_categories || '',
      special_category_basis: initialData?.special_category_basis || undefined,
      automated_decision_making: initialData?.automated_decision_making ?? false,
      profiling: initialData?.profiling ?? false,
      data_source: initialData?.data_source || '',
      dpo_review_required: initialData?.dpo_review_required ?? false,
      review_date: initialData?.review_date || '',
    },
  })

  const onSubmit = async (data: ProcessingActivityFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up data - remove special_category_basis if "none"
      const submitData = { ...data }
      if (submitData.special_category_basis === 'none') {
        delete submitData.special_category_basis
      }

      if (mode === 'create') {
        await createProcessingActivity(submitData)
        toast.success(t('createdSuccess'))
      } else if (activityId) {
        await updateProcessingActivity(activityId, submitData)
        toast.success(t('updatedSuccess'))
      }

      router.push(`/${locale}/context/processing`)
      router.refresh()
    } catch (error) {
      console.error('Error saving processing activity:', error)
      toast.error(error instanceof Error ? error.message :
        t('failedSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/processing`)
  }

  const title = mode === 'create' ? t('createTitle') : t('editTitle')
  const description = mode === 'create' ? t('createDescription') : t('editDescription')

  

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/processing`}
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
                    <FormLabel>{t('purpose')} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('purposePlaceholder')}
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

          {/* Legal Basis Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('legalBasis')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="lawful_basis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('lawfulBasis')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="consent">{t('lawfulBasisConsent')}</SelectItem>
                        <SelectItem value="contract">{t('lawfulBasisContract')}</SelectItem>
                        <SelectItem value="legal_obligation">{t('lawfulBasisLegalObligation')}</SelectItem>
                        <SelectItem value="vital_interests">{t('lawfulBasisVitalInterests')}</SelectItem>
                        <SelectItem value="public_task">{t('lawfulBasisPublicTask')}</SelectItem>
                        <SelectItem value="legitimate_interests">{t('lawfulBasisLegitimateInterests')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lawful_basis_explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('lawfulBasisExplanation')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('lawfulBasisExplanationPlaceholder')}
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
                name="special_category_basis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('specialCategoryBasis')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectSpecialCategoryBasis')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t('specialCategoryNone')}</SelectItem>
                        <SelectItem value="explicit_consent">{t('specialCategoryExplicitConsent')}</SelectItem>
                        <SelectItem value="employment">{t('specialCategoryEmployment')}</SelectItem>
                        <SelectItem value="vital_interests">{t('specialCategoryVitalInterests')}</SelectItem>
                        <SelectItem value="public_interest">{t('specialCategoryPublicInterest')}</SelectItem>
                        <SelectItem value="healthcare">{t('specialCategoryHealthcare')}</SelectItem>
                        <SelectItem value="research">{t('specialCategoryResearch')}</SelectItem>
                        <SelectItem value="legal_claims">{t('specialCategoryLegalClaims')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Data Subjects & Source Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('dataSubjectsSource')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="data_subject_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dataSubjectCategories')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('dataSubjectCategoriesPlaceholder')}
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dataSource')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('dataSourcePlaceholder')}
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

          {/* Processing Characteristics Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('processingCharacteristics')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="automated_decision_making"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('automatedDecisionMaking')}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('automatedDecisionMakingDescription')}
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
                name="profiling"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('profiling')}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('profilingDescription')}
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

          {/* Review Settings Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('reviewSettings')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="dpo_review_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('dpoReviewRequired')}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('dpoReviewRequiredDescription')}
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
                name="review_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('reviewDate')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
