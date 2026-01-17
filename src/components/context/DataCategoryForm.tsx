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
  locale: string
  categoryId?: string
  initialData?: DataCategory
}

const categoryTypeOptions = [
  { value: 'personal', label: 'Personal Data (Article 6)', labelSk: 'Osobné údaje (Článok 6)', description: 'Standard personal data under GDPR Article 6', descriptionSk: 'Štandardné osobné údaje podľa článku 6 GDPR' },
  { value: 'special', label: 'Special Category (Article 9)', labelSk: 'Osobitná kategória (Článok 9)', description: 'Sensitive personal data requiring explicit consent', descriptionSk: 'Citlivé osobné údaje vyžadujúce výslovný súhlas' },
  { value: 'criminal', label: 'Criminal Convictions', labelSk: 'Trestné odsúdenia', description: 'Criminal offences and convictions data', descriptionSk: 'Údaje o trestných činoch a odsúdeniach' },
  // Note: 'anonymous' removed - database enum data_category_type doesn't have this value
]

const sensitivityOptions = [
  { value: 'public', label: 'Public', labelSk: 'Verejné', description: 'Data that can be freely shared', descriptionSk: 'Údaje, ktoré možno voľne zdieľať' },
  { value: 'internal', label: 'Internal', labelSk: 'Interné', description: 'Data for internal use only', descriptionSk: 'Údaje len pre internú potrebu' },
  { value: 'confidential', label: 'Confidential', labelSk: 'Dôverné', description: 'Sensitive data requiring protection', descriptionSk: 'Citlivé údaje vyžadujúce ochranu' },
  { value: 'restricted', label: 'Restricted', labelSk: 'Obmedzené', description: 'Highly sensitive data with strict access controls', descriptionSk: 'Vysoko citlivé údaje s prísnou kontrolou prístupu' },
]

const specialCategoryBasisOptions = [
  { value: 'explicit_consent', label: 'Explicit Consent', labelSk: 'Výslovný súhlas', description: 'Clear and informed consent from data subject', descriptionSk: 'Jasný a informovaný súhlas dotknutej osoby' },
  { value: 'employment', label: 'Employment Law', labelSk: 'Pracovné právo', description: 'Processing for employment purposes', descriptionSk: 'Spracovanie na účely zamestnania' },
  { value: 'vital_interests', label: 'Vital Interests', labelSk: 'Životne dôležité záujmy', description: 'Protection of life or physical integrity', descriptionSk: 'Ochrana života alebo telesnej integrity' },
  { value: 'public_interest', label: 'Public Interest', labelSk: 'Verejný záujem', description: 'Substantial public interest with legal basis', descriptionSk: 'Podstatný verejný záujem s právnym základom' },
  { value: 'healthcare', label: 'Healthcare', labelSk: 'Zdravotná starostlivosť', description: 'Medical diagnosis, health or social care', descriptionSk: 'Lekárska diagnóza, zdravotná alebo sociálna starostlivosť' },
  { value: 'research', label: 'Research', labelSk: 'Výskum', description: 'Scientific, historical or statistical research', descriptionSk: 'Vedecký, historický alebo štatistický výskum' },
  { value: 'legal_claims', label: 'Legal Claims', labelSk: 'Právne nároky', description: 'Establishment, exercise or defence of legal claims', descriptionSk: 'Uplatnenie, výkon alebo obrana právnych nárokov' },
]

export function DataCategoryForm({ mode, locale, categoryId, initialData }: DataCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentCategories, setParentCategories] = useState<Array<{ id: string; name: string }>>([])

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
        toast.success(locale === 'sk' ? 'Kategória údajov bola vytvorená' : 'Data category created successfully')
      } else if (categoryId) {
        await updateDataCategory(categoryId, submitData)
        toast.success(locale === 'sk' ? 'Kategória údajov bola aktualizovaná' : 'Data category updated successfully')
      }

      router.push(`/${locale}/context/data-categories`)
      router.refresh() // Invalidate cache
    } catch (error) {
      console.error('Error saving data category:', error)
      toast.error(error instanceof Error ? error.message :
        (locale === 'sk' ? 'Nepodarilo sa uložiť kategóriu údajov' : 'Failed to save data category'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/data-categories`)
  }

  const title = mode === 'create'
    ? (locale === 'sk' ? 'Nová kategória údajov' : 'New Data Category')
    : (locale === 'sk' ? 'Upraviť kategóriu údajov' : 'Edit Data Category')

  const description = mode === 'create'
    ? (locale === 'sk' ? 'Vytvoriť novú kategóriu údajov pre klasifikáciu a sledovanie súladu podľa GDPR.' : 'Create a new data category for GDPR classification and compliance tracking.')
    : (locale === 'sk' ? 'Aktualizovať informácie o kategórii údajov.' : 'Update the data category information.')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/data-categories`}
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Názov kategórie' : 'Category Name'} *</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., E-mailové adresy, Zdravotné záznamy' : 'e.g., Email Addresses, Health Records'} {...field} />
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
                        placeholder={locale === 'sk' ? 'Opíšte túto kategóriu údajov a čo zahŕňa...' : 'Describe this data category and what it includes...'}
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
              {locale === 'sk' ? 'Klasifikácia podľa GDPR' : 'GDPR Classification'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="category_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Typ kategórie' : 'Category Type'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={locale === 'sk' ? 'Vybrať typ kategórie' : 'Select category type'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{locale === 'sk' ? option.labelSk : option.label}</span>
                              <span className="text-sm text-muted-foreground">{locale === 'sk' ? option.descriptionSk : option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
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
                      <FormLabel>{locale === 'sk' ? 'Právny základ osobitnej kategórie (Článok 9)' : 'Special Category Legal Basis (Article 9)'} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať právny základ podľa článku 9' : 'Select Article 9 legal basis'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialCategoryBasisOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{locale === 'sk' ? option.labelSk : option.label}</span>
                                <span className="text-sm text-muted-foreground">{locale === 'sk' ? option.descriptionSk : option.description}</span>
                              </div>
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
                name="sensitivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Citlivosť údajov' : 'Data Sensitivity'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={locale === 'sk' ? 'Vybrať úroveň citlivosti' : 'Select sensitivity level'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sensitivityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{locale === 'sk' ? option.labelSk : option.label}</span>
                              <span className="text-sm text-muted-foreground">{locale === 'sk' ? option.descriptionSk : option.description}</span>
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
          </div>

          {/* Category Hierarchy Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Hierarchia kategórií' : 'Category Hierarchy'}
            </h3>

            <div className="space-y-4">
              {parentCategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === 'sk' ? 'Nadriadená kategória (voliteľné)' : 'Parent Category (Optional)'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'sk' ? 'Vybrať nadradenú kategóriu' : 'Select parent category'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'sk' ? 'Žiadny nadradený prvok (kategória najvyššej úrovne)' : 'No parent (top-level category)'}</SelectItem>
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
                      <FormLabel>{locale === 'sk' ? 'Štandardná kategória GDPR' : 'Standard GDPR Category'}</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'sk'
                          ? 'Je to štandardná kategória GDPR alebo vlastná obchodná kategória?'
                          : 'Is this a standard GDPR category or custom business category?'}
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
