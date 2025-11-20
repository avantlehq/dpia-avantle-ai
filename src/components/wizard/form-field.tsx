'use client'

import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RiskAssessmentField } from './risk-assessment-field'
import { FormField as FieldConfig } from '@/lib/validations/dpia'

interface UniversalFormFieldProps {
  field: FieldConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  disabled?: boolean
}

export function UniversalFormField({ field, control, disabled = false }: UniversalFormFieldProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <FormField
            control={control}
            name={field.id}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    placeholder={field.placeholder}
                    disabled={disabled}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'textarea':
        return (
          <FormField
            control={control}
            name={field.id}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder={field.placeholder}
                    disabled={disabled}
                    rows={4}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'select':
        return (
          <FormField
            control={control}
            name={field.id}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <Select 
                  onValueChange={formField.onChange} 
                  defaultValue={formField.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'radio':
        return (
          <FormField
            control={control}
            name={field.id}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={formField.value}
                    onValueChange={formField.onChange}
                    disabled={disabled}
                    className="space-y-2"
                  >
                    {field.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label 
                          htmlFor={option.value}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                          {option.description && (
                            <span className="block text-muted-foreground text-xs mt-1">
                              {option.description}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'checkboxGroup':
        return (
          <FormField
            control={control}
            name={field.id}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <div className="space-y-3">
                  {field.options?.map((option) => (
                    <div key={option.value} className="flex items-start space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formField.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValue = formField.value || []
                          if (checked) {
                            formField.onChange([...currentValue, option.value])
                          } else {
                            formField.onChange(currentValue.filter((val: string) => val !== option.value))
                          }
                        }}
                        disabled={disabled}
                      />
                      <Label 
                        htmlFor={option.value}
                        className="text-sm cursor-pointer leading-normal"
                      >
                        {option.label}
                        {option.description && (
                          <span className="block text-muted-foreground text-xs mt-1">
                            {option.description}
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
                {field.description && <FormDescription className="mt-2">{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'riskAssessment':
        return (
          <RiskAssessmentField
            name={field.id}
            label={field.label}
            description={field.description}
            control={control}
            required={field.required}
          />
        )

      default:
        return (
          <div className="p-4 border border-dashed border-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Unsupported field type: {field.type}
            </p>
          </div>
        )
    }
  }

  return <div className="space-y-4">{renderField()}</div>
}