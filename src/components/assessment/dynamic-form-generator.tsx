'use client'

import React, { useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

// JSON template field types
interface FieldDefinition {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface SectionDefinition {
  sectionId: string
  title: string
  description: string
  fields: FieldDefinition[]
}

interface DynamicFormGeneratorProps {
  section: SectionDefinition
  onSubmit: (data: Record<string, unknown>) => void
  defaultValues?: Record<string, unknown>
  loading?: boolean
  submitButtonText?: string
}

// Section color mapping based on DPIA workflow
const getSectionColor = (sectionId: string): string => {
  switch (sectionId) {
    case 'context_scope':
      return 'var(--color-blue)'
    case 'data_flow_processing':
      return 'var(--color-orange)'
    case 'risk_assessment':
      return 'var(--color-red)'
    case 'mitigation':
      return 'var(--color-purple)'
    default:
      return 'var(--color-blue)'
  }
}


// Helper to create Zod schema from JSON field definitions
function createZodSchema(fields: FieldDefinition[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {}
  
  fields.forEach((field) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        schemaShape[field.id] = field.required 
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional()
        break
      
      case 'select':
      case 'radio':
        schemaShape[field.id] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional()
        break
      
      case 'multiselect':
        schemaShape[field.id] = field.required
          ? z.array(z.string()).min(1, `Select at least one ${field.label.toLowerCase()}`)
          : z.array(z.string()).optional()
        break
      
      case 'checkbox':
        schemaShape[field.id] = z.boolean().optional()
        break
    }
  })
  
  return z.object(schemaShape)
}

// Helper to get default values from field definitions
function getDefaultValues(fields: FieldDefinition[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  
  fields.forEach((field) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'select':
      case 'radio':
        defaults[field.id] = ''
        break
      case 'multiselect':
        defaults[field.id] = []
        break
      case 'checkbox':
        defaults[field.id] = false
        break
    }
  })
  
  return defaults
}

export function DynamicFormGenerator({
  section,
  onSubmit,
  defaultValues,
  loading = false,
  submitButtonText = 'Complete Section'
}: DynamicFormGeneratorProps) {
  const schema = createZodSchema(section.fields)
  const formDefaults = { ...getDefaultValues(section.fields), ...defaultValues }
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formDefaults,
  })

  const sectionColor = getSectionColor(section.sectionId)

  // Enhanced submit handler with validation and focus management
  const handleSubmit = useCallback((data: Record<string, unknown>) => {
    // First trigger form validation
    const isValid = form.trigger()
    if (!isValid) {
      // Find first error field and focus it
      setTimeout(() => {
        const firstErrorField = Object.keys(form.formState.errors)[0]
        if (firstErrorField && fieldRefs.current[firstErrorField]) {
          fieldRefs.current[firstErrorField]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
          fieldRefs.current[firstErrorField]?.focus()
        }
      }, 100)
      return
    }
    
    // If validation passes, call onSubmit
    onSubmit(data)
  }, [onSubmit, form])

  // Set field ref for focus management
  const setFieldRef = useCallback((fieldId: string, element: HTMLElement | null) => {
    fieldRefs.current[fieldId] = element
  }, [])

  const renderField = (field: FieldDefinition) => {
    const hasError = !!form.formState.errors[field.id]
    
    switch (field.type) {
      case 'text':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem 
                className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30" : ""}
              >
                <FormLabel 
                  className="text-lg font-bold leading-relaxed mb-3 block"
                  style={{ color: sectionColor }}
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={field.placeholder} 
                    {...formField}
                    ref={(el) => {
                      formField.ref(el)
                      setFieldRef(field.id, el)
                    }}
                    value={formField.value as string}
                    className={`text-base h-11 ml-6 ${hasError ? 'border-red-500 ring-red-200' : ''}`}
                    style={{ fontSize: '16px' }}
                  />
                </FormControl>
                <FormMessage className="ml-6" />
              </FormItem>
            )}
          />
        )

      case 'textarea':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem 
                className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30" : ""}
              >
                <FormLabel 
                  className="text-lg font-bold leading-relaxed mb-3 block"
                  style={{ color: sectionColor }}
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={field.placeholder}
                    {...formField}
                    ref={(el) => {
                      formField.ref(el)
                      setFieldRef(field.id, el)
                    }}
                    value={formField.value as string}
                    className={`min-h-[120px] text-base ml-6 ${hasError ? 'border-red-500 ring-red-200' : ''}`}
                    style={{ fontSize: '16px' }}
                  />
                </FormControl>
                <FormMessage className="ml-6" />
              </FormItem>
            )}
          />
        )

      case 'select':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem 
                className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30" : ""}
              >
                <FormLabel 
                  className="text-lg font-bold leading-relaxed mb-3 block"
                  style={{ color: sectionColor }}
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value as string}>
                  <FormControl>
                    <SelectTrigger 
                      className={`text-base h-11 ml-6 ${hasError ? 'border-red-500 ring-red-200' : ''}`} 
                      style={{ fontSize: '16px' }}
                      ref={(el) => setFieldRef(field.id, el)}
                    >
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option} className="text-base" style={{ fontSize: '16px' }}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="ml-6" />
              </FormItem>
            )}
          />
        )

      case 'radio':
        // Smart rendering logic based on option count
        const optionCount = field.options?.length || 0
        
        // 1 option → don't display (invalid choice)
        if (optionCount <= 1) {
          return null
        }
        
        // 2 options (Yes/No) → segmented control pills
        if (optionCount === 2) {
          return (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem 
                  className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30 mb-8" : "mb-8"}
                >
                  {/* Question - visually separated */}
                  <div className="mb-4">
                    <FormLabel 
                      className="text-lg font-bold leading-relaxed block"
                      style={{ color: sectionColor }}
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                  </div>
                  
                  {/* Segmented control - equal width pills */}
                  <div className="ml-6">
                    <div className="flex gap-1 max-w-xs">
                      {field.options?.map((option) => {
                        const isSelected = formField.value === option
                        return (
                          <FormControl key={option}>
                            <button
                              type="button"
                              className={`
                                flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                                focus:outline-none focus:ring-2 focus:ring-offset-1 text-center
                                ${isSelected 
                                  ? 'text-white shadow-sm' 
                                  : 'text-gray-600 bg-transparent hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                }
                              `}
                              style={{
                                backgroundColor: isSelected ? sectionColor : undefined,
                                minHeight: '48px'
                              }}
                              onClick={() => {
                                setFieldRef(field.id, document.activeElement as HTMLElement)
                                formField.onChange(option)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  formField.onChange(option)
                                }
                              }}
                              aria-pressed={isSelected}
                              aria-label={option}
                            >
                              {option}
                            </button>
                          </FormControl>
                        )
                      })}
                    </div>
                  </div>
                  <FormMessage className="ml-6 mt-2" />
                </FormItem>
              )}
            />
          )
        }
        
        // 3-8 options → pill group (flex-wrap)
        if (optionCount >= 3 && optionCount <= 8) {
          return (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem 
                  className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30 mb-8" : "mb-8"}
                >
                  {/* Question - visually separated */}
                  <div className="mb-4">
                    <FormLabel 
                      className="text-lg font-bold leading-relaxed block"
                      style={{ color: sectionColor }}
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                  </div>
                  
                  {/* Pill group - flex wrap */}
                  <div className="ml-6">
                    <div className="flex flex-wrap gap-2">
                      {field.options?.map((option) => {
                        const isSelected = formField.value === option
                        return (
                          <FormControl key={option}>
                            <button
                              type="button"
                              className={`
                                inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150
                                focus:outline-none focus:ring-2 focus:ring-offset-1
                                ${isSelected 
                                  ? 'text-white shadow-sm' 
                                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }
                              `}
                              style={{
                                backgroundColor: isSelected ? sectionColor : undefined
                              }}
                              onClick={() => {
                                setFieldRef(field.id, document.activeElement as HTMLElement)
                                formField.onChange(option)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  formField.onChange(option)
                                }
                              }}
                              aria-pressed={isSelected}
                              aria-label={option}
                            >
                              {option}
                            </button>
                          </FormControl>
                        )
                      })}
                    </div>
                  </div>
                  <FormMessage className="ml-6 mt-2" />
                </FormItem>
              )}
            />
          )
        }
        
        // 9+ options → TODO: searchable multiselect (future implementation)
        // For now, fallback to pill group
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem 
                className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30 mb-8" : "mb-8"}
              >
                <div className="mb-4">
                  <FormLabel 
                    className="text-lg font-bold leading-relaxed block"
                    style={{ color: sectionColor }}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                
                <div className="ml-6">
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((option) => {
                      const isSelected = formField.value === option
                      return (
                        <FormControl key={option}>
                          <button
                            type="button"
                            className={`
                              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150
                              focus:outline-none focus:ring-2 focus:ring-offset-1
                              ${isSelected 
                                ? 'text-white shadow-sm' 
                                : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                              }
                            `}
                            style={{
                              backgroundColor: isSelected ? sectionColor : undefined
                            }}
                            onClick={() => {
                              setFieldRef(field.id, document.activeElement as HTMLElement)
                              formField.onChange(option)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                formField.onChange(option)
                              }
                            }}
                            aria-pressed={isSelected}
                            aria-label={option}
                          >
                            {option}
                          </button>
                        </FormControl>
                      )
                    })}
                  </div>
                </div>
                <FormMessage className="ml-6 mt-2" />
              </FormItem>
            )}
          />
        )

      case 'multiselect':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={() => (
              <FormItem 
                className={hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30 mb-8" : "mb-8"}
              >
                {/* Question - visually separated */}
                <div className="mb-4">
                  <FormLabel 
                    className="text-lg font-bold leading-relaxed block"
                    style={{ color: sectionColor }}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                
                {/* Answer cluster - flex wrap pills */}
                <div className="ml-6">
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((option, _index) => (
                      <FormField
                        key={option}
                        control={form.control}
                        name={field.id}
                        render={({ field: formField }) => {
                          const isSelected = (formField.value as string[])?.includes(option)
                          return (
                            <FormControl key={option}>
                              <button
                                type="button"
                                className={`
                                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150
                                  focus:outline-none focus:ring-2 focus:ring-offset-1
                                  ${isSelected 
                                    ? 'text-white shadow-sm' 
                                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                  }
                                `}
                                style={{
                                  backgroundColor: isSelected ? sectionColor : undefined
                                }}
                                onClick={() => {
                                  if (_index === 0) setFieldRef(field.id, document.activeElement as HTMLElement)
                                  const updatedValue = isSelected
                                    ? ((formField.value as string[]) || []).filter((value: string) => value !== option)
                                    : [...((formField.value as string[]) || []), option]
                                  formField.onChange(updatedValue)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    const updatedValue = isSelected
                                      ? ((formField.value as string[]) || []).filter((value: string) => value !== option)
                                      : [...((formField.value as string[]) || []), option]
                                    formField.onChange(updatedValue)
                                  }
                                }}
                                aria-pressed={isSelected}
                                aria-label={option}
                              >
                                {option}
                              </button>
                            </FormControl>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>
                <FormMessage className="ml-6 mt-2" />
              </FormItem>
            )}
          />
        )

      case 'checkbox':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem 
                className={`flex flex-row items-start space-x-3 space-y-0 ml-6 ${hasError ? "border-l-4 border-l-red-500 pl-4 bg-red-50/30" : ""}`}
              >
                <FormControl>
                  <Checkbox
                    checked={formField.value as boolean}
                    onCheckedChange={(checked) => {
                      setFieldRef(field.id, document.activeElement as HTMLElement)
                      formField.onChange(checked)
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel 
                    className="text-lg font-bold leading-relaxed"
                    style={{ color: sectionColor }}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
        <p className="text-muted-foreground">
          {section.description}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {section.fields.map(renderField)}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl border border-orange-500 hover:border-orange-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer min-w-[180px]"
              style={{
                backgroundColor: loading ? '#9ca3af' : '#ea580c',
                borderColor: loading ? '#9ca3af' : '#f97316',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Saving...' : submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}