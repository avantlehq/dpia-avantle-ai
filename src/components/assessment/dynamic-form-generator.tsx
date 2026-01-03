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
  onChange?: (data: Record<string, unknown>) => void
}

// Enhanced semantic validation states using design tokens
const getValidationState = (hasError: boolean, hasValue: boolean) => {
  if (hasError) {
    return {
      borderColor: 'var(--status-error-border)',
      backgroundColor: 'var(--status-error-bg)',
      textColor: 'var(--status-error)',
      iconColor: 'var(--status-error)'
    }
  }
  
  if (hasValue) {
    return {
      borderColor: 'var(--status-success-border)',
      backgroundColor: 'var(--status-success-bg)',
      textColor: 'var(--status-success)',
      iconColor: 'var(--status-success)'
    }
  }
  
  return {
    borderColor: 'var(--border-default)',
    backgroundColor: 'var(--surface-1)',
    textColor: 'var(--text-primary)',
    iconColor: 'var(--text-muted)'
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
  submitButtonText = 'Complete Section',
  onChange: _onChange
}: DynamicFormGeneratorProps) {
  const schema = createZodSchema(section.fields)
  const formDefaults = { ...getDefaultValues(section.fields), ...defaultValues }
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formDefaults,
  })


  // Enhanced form state tracking
  const watchedFields = form.watch()

  // Enhanced submit handler with validation and focus management
  const handleSubmit = useCallback((data: Record<string, unknown>) => {
    // Validation is already handled by react-hook-form
    // Just call the onSubmit function
    
    // If validation passes, call onSubmit
    onSubmit(data)
  }, [onSubmit])

  // Set field ref for focus management
  const setFieldRef = useCallback((fieldId: string, element: HTMLElement | null) => {
    fieldRefs.current[fieldId] = element
  }, [])

  const renderField = (field: FieldDefinition) => {
    const hasError = !!form.formState.errors[field.id]
    const fieldValue = watchedFields[field.id]
    const hasValue = Boolean(fieldValue && fieldValue !== '')
    const validationState = getValidationState(hasError, hasValue)
    
    switch (field.type) {
      case 'text':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem 
                className="transition-[--transition-colors] duration-200"
                style={{
                  borderLeft: hasError || hasValue ? `4px solid ${validationState.borderColor}` : undefined,
                  paddingLeft: hasError || hasValue ? 'var(--space-4)' : undefined,
                  backgroundColor: hasError ? validationState.backgroundColor : undefined,
                  borderRadius: hasError || hasValue ? 'var(--radius-md)' : undefined,
                  padding: hasError || hasValue ? 'var(--space-3)' : undefined
                }}
              >
                <FormLabel 
                  className="text-[--text-lg] font-semibold leading-relaxed mb-[--space-3] block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {field.label}
                  {field.required && <span style={{ color: 'var(--status-error)' }} className="ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={field.placeholder} 
                    variant={hasError ? 'error' : hasValue ? 'success' : 'default'}
                    {...formField}
                    ref={(el) => {
                      formField.ref(el)
                      setFieldRef(field.id, el)
                    }}
                    value={formField.value as string}
                    className="text-[--text-base] h-[--height-lg] ml-[--space-6]"
                  />
                </FormControl>
                <FormMessage 
                  className="ml-[--space-6] mt-[--space-1]" 
                  style={{ color: 'var(--status-error)' }}
                />
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
                  className="text-lg font-semibold text-muted-foreground leading-relaxed mb-3 block"
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
                  className="text-lg font-semibold text-muted-foreground leading-relaxed mb-3 block"
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
                      className="text-lg font-semibold text-muted-foreground leading-relaxed block"
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                  </div>
                  
                  {/* Modern inline button controls */}
                  <div className="ml-6">
                    <div className="flex gap-3 items-center">
                      {field.options?.map((option) => {
                        const isSelected = formField.value === option
                        return (
                          <FormControl key={option}>
                            <button
                              type="button"
                              className={`
                                px-6 py-3 rounded-lg text-base font-medium transition-all duration-150
                                focus:outline-none focus:ring-2 focus:ring-offset-1 text-center
                                min-w-[100px] shadow-sm
                                ${isSelected 
                                  ? 'text-white border border-indigo-500/20' 
                                  : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                }
                              `}
                              style={{
                                backgroundColor: isSelected ? 'var(--brand-primary)' : undefined,
                                fontSize: '16px'
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
                      className="text-lg font-semibold text-muted-foreground leading-relaxed block"
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
                                  ? 'text-white shadow-sm border border-indigo-500/20' 
                                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }
                              `}
                              style={{
                                backgroundColor: isSelected ? 'var(--brand-primary)' : undefined
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
                    className="text-lg font-semibold text-muted-foreground leading-relaxed block"
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
                                ? 'text-white shadow-sm border border-indigo-500/20' 
                                : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                              }
                            `}
                            style={{
                              backgroundColor: isSelected ? 'var(--brand-primary)' : undefined
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
                    className="text-lg font-semibold text-muted-foreground leading-relaxed block"
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
                                    ? 'text-white shadow-sm border border-indigo-500/20' 
                                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                  }
                                `}
                                style={{
                                  backgroundColor: isSelected ? 'var(--brand-primary)' : undefined
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
                    className="text-lg font-semibold text-muted-foreground leading-relaxed"
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

          {/* Sticky Primary CTA Footer */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-6 -mx-6 -mb-6 mt-8">
            <div className="flex justify-end max-w-4xl mx-auto">
              <Button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 font-bold rounded-xl cursor-pointer min-w-[200px] text-lg"
                style={{
                  backgroundColor: loading ? 'var(--text-muted)' : 'var(--status-success)',
                  borderColor: loading ? 'var(--text-muted)' : 'var(--status-success)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '700',
                  border: 'none'
                }}
              >
                {loading ? 'Processing...' : submitButtonText}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}