/**
 * Data Category Form Component
 *
 * Shared form for creating and editing data categories.
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
import {
  createDataCategory,
  updateDataCategory,
  getDataCategories,
  type DataCategory
} from '@/lib/context/data-categories'

const dataCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  category_type: z.enum(['personal', 'special', 'criminal']), // Note: 'anonymous' removed - database enum doesn't have this value
  sensitivity: z.enum(['public', 'internal', 'confidential', 'restricted']),
  special_category_basis: z.enum(['none', 'explicit_consent', 'employment', 'vital_interests', 'public_interest', 'healthcare', 'research', 'legal_claims']).optional(),
  is_standard: z.boolean(),
  parent_id: z.string().optional(),
}).refine(
  (data) => {
    // Special category data must have special category basis
    if (data.category_type === 'special') {
      return data.special_category_basis !== undefined && data.special_category_basis !== 'none';
    }
    return true;
  },
  {
    message: "Special category data must have a legal basis under Article 9",
    path: ["special_category_basis"],
  }
)

type DataCategoryFormData = z.infer<typeof dataCategorySchema>

interface DataCategoryFormProps {
  mode: 'create' | 'edit'
  categoryId?: string
  initialData?: DataCategory
}

export function DataCategoryForm({ mode, categoryId, initialData }: DataCategoryFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentCategories, setParentCategories] = useState<Array<{ id: string; name: string }>>([])

  // Translations
  const tc = useTranslations('common')
  const tcc = useTranslations('context.common')
  const t = useTranslations('context.dataCategories')

  const form = useForm<DataCategoryFormData>({
    resolver: zodResolver(dataCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category_type: initialData?.category_type || 'personal',
      sensitivity: initialData?.sensitivity || 'internal',
      special_category_basis: initialData?.special_category_basis || undefined,
      is_standard: initialData?.is_standard || false,
      parent_id: initialData?.parent_id || '',
    },
  })

  const watchCategoryType = form.watch('category_type')

  // Fetch parent categories for nested structure
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const categories = await getDataCategories()
        setParentCategories(
          categories
            .filter(cat => cat.id !== categoryId) // Exclude self from parent options
            .map(cat => ({ id: cat.id, name: cat.name }))
        )
      } catch (error) {
        console.error('Failed to fetch parent categories:', error)
      }
    }

    fetchParentCategories()
  }, [categoryId])

  const onSubmit = async (data: DataCategoryFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up data - remove special_category_basis if not special category
      const submitData = { ...data }
      if (data.category_type !== 'special') {
        delete submitData.special_category_basis
      }

      // Remove parent_id if empty or "none"
      if (!submitData.parent_id || submitData.parent_id === 'none') {
        delete submitData.parent_id
      }

      if (mode === 'create') {
        await createDataCategory(submitData)
        toast.success(t('createdSuccess'))
      } else if (categoryId) {
        await updateDataCategory(categoryId, submitData)
        toast.success(t('updatedSuccess'))
      }

      router.push(`/${locale}/context/data-categories`)
      router.refresh() // Invalidate cache
    } catch (error) {
      console.error('Error saving data category:', error)
      toast.error(error instanceof Error ? error.message : t('failedSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/data-categories`)
  }

  const title = mode === 'create' ? t('createTitle') : t('editTitle')
  const description = mode === 'create' ? t('createDescription') : t('editDescription')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/data-categories`}
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

          {/* GDPR Classification Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('gdprClassification')}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="category_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('categoryType')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectCategoryType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('typePersonal')}</span>
                            <span className="text-sm text-muted-foreground">{t('typePersonalDesc')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="special">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('typeSpecial')}</span>
                            <span className="text-sm text-muted-foreground">{t('typeSpecialDesc')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="criminal">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('typeCriminal')}</span>
                            <span className="text-sm text-muted-foreground">{t('typeCriminalDesc')}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchCategoryType === 'special' && (
                <FormField
                  control={form.control}
                  name="special_category_basis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('specialCategoryBasis')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectSpecialCategoryBasis')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="explicit_consent">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisExplicitConsent')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisExplicitConsentDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="employment">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisEmployment')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisEmploymentDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="vital_interests">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisVitalInterests')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisVitalInterestsDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="public_interest">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisPublicInterest')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisPublicInterestDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="healthcare">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisHealthcare')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisHealthcareDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="research">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisResearch')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisResearchDesc')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="legal_claims">
                            <div className="flex flex-col">
                              <span className="font-medium">{t('basisLegalClaims')}</span>
                              <span className="text-sm text-muted-foreground">{t('basisLegalClaimsDesc')}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sensitivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sensitivity')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectSensitivity')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('sensitivityPublic')}</span>
                            <span className="text-sm text-muted-foreground">{t('sensitivityPublicDesc')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="internal">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('sensitivityInternal')}</span>
                            <span className="text-sm text-muted-foreground">{t('sensitivityInternalDesc')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="confidential">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('sensitivityConfidential')}</span>
                            <span className="text-sm text-muted-foreground">{t('sensitivityConfidentialDesc')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="restricted">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('sensitivityRestricted')}</span>
                            <span className="text-sm text-muted-foreground">{t('sensitivityRestrictedDesc')}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Category Hierarchy Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('categoryHierarchy')}
            </h3>

            <div className="space-y-4">
              {parentCategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('parentCategory')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectParentCategory')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('noParent')}</SelectItem>
                          {parentCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="is_standard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>{t('isStandard')}</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('isStandardDescription')}
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
              {mode === 'create' ? tc('create') : tc('save')}
            </Button>
          </div>
        </form>
      </Form>
    </ContextFormShell>
  )
}
