'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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

const dataCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  category_type: z.enum(['personal', 'special', 'criminal', 'anonymous']),
  sensitivity: z.enum(['public', 'internal', 'confidential', 'restricted']),
  special_category_basis: z.enum(['none', 'explicit_consent', 'employment', 'vital_interests', 'public_interest', 'healthcare', 'research', 'legal_claims']).optional(),
  is_standard: z.boolean(),
  parent_id: z.string().optional(),
}).refine(
  (data) => {
    // Special category data must have special category basis
    if (data.category_type === 'special') {
      return data.special_category_basis !== undefined;
    }
    // Non-special category data should not have special category basis
    return data.special_category_basis === undefined;
  },
  {
    message: "Special category data must have a legal basis under Article 9",
    path: ["special_category_basis"],
  }
)

type DataCategoryFormData = z.infer<typeof dataCategorySchema>

interface DataCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categoryId?: string
  initialData?: Partial<DataCategoryFormData>
}

const categoryTypeOptions = [
  { value: 'personal', label: 'Personal Data (Article 6)', description: 'Standard personal data under GDPR Article 6' },
  { value: 'special', label: 'Special Category (Article 9)', description: 'Sensitive personal data requiring explicit consent' },
  { value: 'criminal', label: 'Criminal Convictions', description: 'Criminal offences and convictions data' },
  { value: 'anonymous', label: 'Anonymous Data', description: 'Data that cannot identify individuals' },
]

const sensitivityOptions = [
  { value: 'public', label: 'Public', description: 'Data that can be freely shared' },
  { value: 'internal', label: 'Internal', description: 'Data for internal use only' },
  { value: 'confidential', label: 'Confidential', description: 'Sensitive data requiring protection' },
  { value: 'restricted', label: 'Restricted', description: 'Highly sensitive data with strict access controls' },
]

const specialCategoryBasisOptions = [
  { value: 'explicit_consent', label: 'Explicit Consent', description: 'Clear and informed consent from data subject' },
  { value: 'employment', label: 'Employment Law', description: 'Processing for employment purposes' },
  { value: 'vital_interests', label: 'Vital Interests', description: 'Protection of life or physical integrity' },
  { value: 'public_interest', label: 'Public Interest', description: 'Substantial public interest with legal basis' },
  { value: 'healthcare', label: 'Healthcare', description: 'Medical diagnosis, health or social care' },
  { value: 'research', label: 'Research', description: 'Scientific, historical or statistical research' },
  { value: 'legal_claims', label: 'Legal Claims', description: 'Establishment, exercise or defence of legal claims' },
]

export function DataCategoryModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  categoryId, 
  initialData 
}: DataCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentCategories, setParentCategories] = useState<Array<{ id: string; name: string }>>([])
  const isEditing = Boolean(categoryId)

  const form = useForm<DataCategoryFormData>({
    resolver: zodResolver(dataCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      category_type: 'personal',
      sensitivity: 'internal',
      special_category_basis: undefined,
      is_standard: false,
      parent_id: '',
      ...initialData,
    },
  })

  const watchCategoryType = form.watch('category_type')

  // Fetch parent categories for nested structure
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')
        const response = await contextApiService.getDataCategories()
        
        // Define proper type for category data
        interface CategoryData {
          id: string
          name: string
        }
        
        setParentCategories(
          (response.data || [])
            .filter((cat: CategoryData) => cat.id !== categoryId) // Exclude self from parent options
            .map((cat: CategoryData) => ({ id: cat.id, name: cat.name }))
        )
      } catch (error) {
        console.error('Failed to fetch parent categories:', error)
      }
    }

    if (isOpen) {
      fetchParentCategories()
    }
  }, [isOpen, categoryId])

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        category_type: initialData.category_type || 'personal',
        sensitivity: initialData.sensitivity || 'internal',
        special_category_basis: initialData.special_category_basis,
        is_standard: initialData.is_standard || false,
        parent_id: initialData.parent_id || '',
      })
    }
  }, [isOpen, initialData, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

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

      const url = categoryId 
        ? `/api/v1/context/data-categories/${categoryId}`
        : '/api/v1/context/data-categories'
      
      const response = await fetch(url, {
        method: categoryId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save data category')
      }

      toast.success(isEditing ? 'Data category updated successfully' : 'Data category created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving data category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save data category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Data Category' : 'Add New Data Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the data category information below.' 
              : 'Create a new data category for GDPR classification and compliance tracking.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Email Addresses, Health Records" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe this data category and what it includes..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* GDPR Classification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">GDPR Classification</h3>
              
              <FormField
                control={form.control}
                name="category_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-sm text-muted-foreground">{option.description}</span>
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
                      <FormLabel>Special Category Legal Basis (Article 9) *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Article 9 legal basis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialCategoryBasisOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-sm text-muted-foreground">{option.description}</span>
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
                    <FormLabel>Data Sensitivity *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sensitivity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sensitivityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-sm text-muted-foreground">{option.description}</span>
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

            {/* Category Hierarchy */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Category Hierarchy</h3>
              
              {parentCategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No parent (top-level category)</SelectItem>
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
                      <FormLabel>Standard GDPR Category</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Is this a standard GDPR category or custom business category?
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

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}