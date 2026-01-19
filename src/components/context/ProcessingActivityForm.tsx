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
  locale: string
  activityId?: string
  initialData?: ProcessingActivity
}

const lawfulBasisOptions = [
  { value: 'consent', label: { en: 'Consent', sk: 'Súhlas' } },
  { value: 'contract', label: { en: 'Contract', sk: 'Zmluva' } },
  { value: 'legal_obligation', label: { en: 'Legal obligation', sk: 'Právna povinnosť' } },
  { value: 'vital_interests', label: { en: 'Vital interests', sk: 'Životne dôležité záujmy' } },
  { value: 'public_task', label: { en: 'Public task', sk: 'Verejná úloha' } },
  { value: 'legitimate_interests', label: { en: 'Legitimate interests', sk: 'Oprávnené záujmy' } },
]

const specialCategoryBasisOptions = [
  { value: 'explicit_consent', label: { en: 'Explicit consent', sk: 'Výslovný súhlas' } },
  { value: 'employment', label: { en: 'Employment', sk: 'Zamestnanecké právo' } },
  { value: 'vital_interests', label: { en: 'Vital interests', sk: 'Životne dôležité záujmy' } },
  { value: 'public_interest', label: { en: 'Public interest', sk: 'Verejný záujem' } },
  { value: 'healthcare', label: { en: 'Healthcare', sk: 'Zdravotná starostlivosť' } },
  { value: 'research', label: { en: 'Research', sk: 'Vedecký výskum' } },
  { value: 'legal_claims', label: { en: 'Legal claims', sk: 'Právne nároky' } },
]

export function ProcessingActivityForm({ mode, locale, activityId, initialData }: ProcessingActivityFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        toast.success(locale === 'sk' ? 'Aktivita spracovania bola vytvorená' : 'Processing activity created successfully')
      } else if (activityId) {
        await updateProcessingActivity(activityId, submitData)
        toast.success(locale === 'sk' ? 'Aktivita spracovania bola aktualizovaná' : 'Processing activity updated successfully')
      }

      router.push(`/${locale}/context/processing`)
      router.refresh()
    } catch (error) {
      console.error('Error saving processing activity:', error)
      toast.error(error instanceof Error ? error.message :
        (locale === 'sk' ? 'Nepodarilo sa uložiť aktivitu spracovania' : 'Failed to save processing activity'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/processing`)
  }

  const title = mode === 'create'
    ? (locale === 'sk' ? 'Nová aktivita spracovania' : 'New Processing Activity')
    : (locale === 'sk' ? 'Upraviť aktivitu spracovania' : 'Edit Processing Activity')

  const description = mode === 'create'
    ? (locale === 'sk' ? 'Vytvoriť novú aktivitu spracovania pre evidenciu podľa článku 30 GDPR (ROPA).' : 'Create a new processing activity for GDPR Article 30 Record of Processing Activities (ROPA) compliance.')
    : (locale === 'sk' ? 'Aktualizovať informácie o aktivite spracovania.' : 'Update the processing activity information.')

  const lang = locale === 'sk' ? 'sk' : 'en'

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
              {locale === 'sk' ? 'Základné informácie' : 'Basic Information'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Názov aktivity' : 'Activity Name'} *</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., Spracovanie zákazníckych údajov' : 'e.g., Customer Data Processing'} {...field} />
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
                        placeholder={locale === 'sk' ? 'Popis aktivity spracovania...' : 'Describe the processing activity...'}
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
                    <FormLabel>{locale === 'sk' ? 'Účel' : 'Purpose'} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Popis účelu spracovania...' : 'Describe the purpose of processing...'}
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
              {locale === 'sk' ? 'Právny základ' : 'Legal Basis'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="lawful_basis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Zákonný základ' : 'Lawful Basis'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lawfulBasisOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label[lang]}
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
                name="lawful_basis_explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Vysvetlenie zákonného základu' : 'Lawful Basis Explanation'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Dodatočné vysvetlenie zákonného základu...' : 'Provide additional explanation for the lawful basis...'}
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
                    <FormLabel>{locale === 'sk' ? 'Základ pre osobitnú kategóriu (ak sa použije)' : 'Special Category Basis (if applicable)'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={locale === 'sk' ? 'Vybrať základ pre osobitnú kategóriu' : 'Select special category basis'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{locale === 'sk' ? 'Žiadny' : 'None'}</SelectItem>
                        {specialCategoryBasisOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label[lang]}
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

          {/* Data Subjects & Source Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Subjekty údajov a zdroj' : 'Data Subjects & Source'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="data_subject_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Kategórie subjektov údajov' : 'Data Subject Categories'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'napr., Zákazníci, zamestnanci, návštevníci webu...' : 'e.g., Customers, employees, website visitors...'}
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
                    <FormLabel>{locale === 'sk' ? 'Zdroj údajov' : 'Data Source'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Popis odkiaľ údaje pochádzajú...' : 'Describe where the data comes from...'}
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
              {locale === 'sk' ? 'Charakteristiky spracovania' : 'Processing Characteristics'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="automated_decision_making"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {locale === 'sk' ? 'Automatizované rozhodovanie' : 'Automated Decision Making'}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'sk'
                          ? 'Zahŕňa toto spracovanie automatizované rozhodovanie?'
                          : 'Does this processing involve automated decision making?'}
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
                        {locale === 'sk' ? 'Profilovanie' : 'Profiling'}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'sk'
                          ? 'Zahŕňa toto spracovanie profilovanie jednotlivcov?'
                          : 'Does this processing involve profiling of individuals?'}
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
              {locale === 'sk' ? 'Nastavenia kontroly' : 'Review Settings'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="dpo_review_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {locale === 'sk' ? 'Vyžaduje sa kontrola DPO' : 'DPO Review Required'}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'sk'
                          ? 'Vyžaduje táto aktivita kontrolu poverenou osobou (DPO)?'
                          : 'Does this activity require DPO review?'}
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
                    <FormLabel>{locale === 'sk' ? 'Dátum kontroly' : 'Review Date'}</FormLabel>
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
