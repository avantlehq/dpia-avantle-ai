'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Save, FileText, AlertCircle } from 'lucide-react'
import { saveAssessmentSectionAction, getAssessmentSectionAction } from '@/lib/actions/assessment-section-actions'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Form validation schema
const contextScopeSchema = z.object({
  // Processing Description
  processingDescription: z.string().min(10, 'Processing description must be at least 10 characters'),
  processingPurpose: z.string().min(5, 'Processing purpose is required'),
  
  // Personal Data Categories
  personalDataCategories: z.array(z.string()).min(1, 'Select at least one category of personal data'),
  specialCategories: z.array(z.string()).optional(),
  
  // Data Subjects
  dataSubjects: z.array(z.string()).min(1, 'Select at least one category of data subjects'),
  dataSubjectsNumber: z.string().min(1, 'Estimated number of data subjects is required'),
  
  // Data Sources
  dataSources: z.array(z.string()).min(1, 'Select at least one data source'),
  dataCollection: z.string().min(5, 'Data collection method is required'),
  
  // Retention
  retentionPeriod: z.string().min(1, 'Retention period is required'),
  retentionJustification: z.string().min(10, 'Retention justification is required'),
  
  // Processing Location
  processingLocation: z.string().min(1, 'Processing location is required'),
  dataStorage: z.string().min(5, 'Data storage details are required'),
})

type ContextScopeFormData = z.infer<typeof contextScopeSchema>

interface ContextScopeFormProps {
  assessmentId: string
  onComplete: () => void
  onNext: () => void
}

const personalDataOptions = [
  'Identification data (name, ID number)',
  'Contact details (email, phone, address)', 
  'Financial data (bank details, payment info)',
  'Employment data (job title, salary)',
  'Location data (GPS, IP address)',
  'Biometric data (fingerprints, photos)',
  'Behavioral data (website usage, preferences)',
  'Technical data (device info, cookies)',
  'Health data',
  'Other'
]

const specialCategoryOptions = [
  'Health data',
  'Racial or ethnic origin',
  'Political opinions', 
  'Religious beliefs',
  'Trade union membership',
  'Genetic data',
  'Biometric data for identification',
  'Sex life or sexual orientation',
  'Criminal convictions'
]

const dataSubjectOptions = [
  'Employees',
  'Customers',
  'Website visitors',
  'Suppliers/partners',
  'Children (under 16)',
  'Vulnerable individuals',
  'General public',
  'Other'
]

const dataSourceOptions = [
  'Direct from data subject',
  'From third parties',
  'Public sources',
  'Automatic collection (cookies, analytics)',
  'CCTV/surveillance',
  'Other systems/databases'
]

export function ContextScopeForm({ assessmentId, onComplete, onNext }: ContextScopeFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)

  const form = useForm<ContextScopeFormData>({
    resolver: zodResolver(contextScopeSchema),
    defaultValues: {
      processingDescription: '',
      processingPurpose: '',
      personalDataCategories: [],
      specialCategories: [],
      dataSubjects: [],
      dataSubjectsNumber: '',
      dataSources: [],
      dataCollection: '',
      retentionPeriod: '',
      retentionJustification: '',
      processingLocation: '',
      dataStorage: '',
    },
  })

  // Load existing data on mount
  useEffect(() => {
    loadSectionData()
  }, [assessmentId])

  // Auto-save setup
  useEffect(() => {
    const subscription = form.watch(() => {
      if (!loading) {
        handleAutoSave()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, loading])

  const loadSectionData = async () => {
    setLoading(true)
    try {
      const result = await getAssessmentSectionAction(assessmentId, 'context')
      if (result.success && result.data) {
        // Populate form with existing data
        Object.keys(result.data).forEach((key) => {
          form.setValue(key as keyof ContextScopeFormData, result.data[key])
        })
      }
    } catch (error) {
      console.error('Error loading section data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSave = async () => {
    if (autoSaving) return
    
    setAutoSaving(true)
    try {
      const formData = form.getValues()
      await saveAssessmentSectionAction(assessmentId, 'context', formData)
    } catch (error) {
      console.error('Auto-save error:', error)
    } finally {
      setAutoSaving(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const formData = form.getValues()
      const result = await saveAssessmentSectionAction(assessmentId, 'context', formData)
      
      if (result.success) {
        toast({
          title: 'Section saved',
          description: 'Context & Scope section has been saved successfully.',
        })
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save section. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ContextScopeFormData) => {
    setLoading(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'context', data)
      
      if (result.success) {
        onComplete()
        toast({
          title: 'Section completed',
          description: 'Context & Scope section completed successfully.',
        })
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete section. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-dpia-orange" />
          <h2 className="text-2xl font-semibold">Context & Scope</h2>
          {autoSaving && (
            <Badge variant="secondary" className="text-xs">
              Auto-saving...
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Define the processing context, scope, and purpose of your data processing activities.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Processing Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing Description</CardTitle>
              <CardDescription>
                Describe what personal data processing activities this DPIA covers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="processingDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the data processing activities, systems involved, and overall context..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a comprehensive description of your data processing operations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Purpose</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Customer relationship management, HR management..." {...field} />
                    </FormControl>
                    <FormDescription>
                      What is the main purpose of this data processing?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Personal Data Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Data Categories</CardTitle>
              <CardDescription>
                Select the categories of personal data that will be processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="personalDataCategories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Personal Data Categories</FormLabel>
                      <FormDescription>
                        Select all categories of personal data that apply.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {personalDataOptions.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="personalDataCategories"
                          render={({ field }) => (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), item]
                                      : (field.value || []).filter((value) => value !== item)
                                    field.onChange(updatedValue)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal leading-tight">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialCategories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Special Categories (Optional)</FormLabel>
                      <FormDescription>
                        <AlertCircle className="inline h-4 w-4 mr-1" />
                        Special categories require extra protection under GDPR Article 9.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {specialCategoryOptions.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="specialCategories"
                          render={({ field }) => (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), item]
                                      : (field.value || []).filter((value) => value !== item)
                                    field.onChange(updatedValue)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal leading-tight">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                'min-w-[120px]',
                form.formState.isValid && 'bg-dpia-orange hover:bg-dpia-orange/90'
              )}
            >
              {loading ? 'Saving...' : 'Complete Section'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}