'use client'

import React from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formDefaults,
  })

  const renderField = (field: FieldDefinition) => {
    switch (field.type) {
      case 'text':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={field.placeholder} 
                    {...formField} 
                    value={formField.value as string}
                    className="text-base h-11"
                    style={{ fontSize: '16px' }}
                  />
                </FormControl>
                <FormMessage />
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
              <FormItem>
                <FormLabel className="text-base font-medium">{field.label}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={field.placeholder}
                    className="min-h-[120px] text-base"
                    style={{ fontSize: '16px' }}
                    {...formField} 
                    value={formField.value as string}
                  />
                </FormControl>
                <FormMessage />
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
              <FormItem>
                <FormLabel className="text-base font-medium">{field.label}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value as string}>
                  <FormControl>
                    <SelectTrigger className="text-base h-11" style={{ fontSize: '16px' }}>
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
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'radio':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">{field.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value as string}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => (
                      <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <FormLabel className="font-normal text-base" style={{ fontSize: '16px' }}>
                          {option}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
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
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">{field.label}</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {field.options?.map((option) => (
                    <FormField
                      key={option}
                      control={form.control}
                      name={field.id}
                      render={({ field: formField }) => (
                        <FormItem
                          key={option}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={(formField.value as string[])?.includes(option)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...((formField.value as string[]) || []), option]
                                  : ((formField.value as string[]) || []).filter((value: string) => value !== option)
                                formField.onChange(updatedValue)
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal leading-tight">
                            {option}
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
        )

      case 'checkbox':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value as boolean}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.fields.map(renderField)}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: loading ? '#9ca3af' : '#ea580c',
                borderColor: loading ? '#9ca3af' : '#ea580c',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500'
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