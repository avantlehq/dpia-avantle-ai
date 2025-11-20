'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface TemplateField {
  id: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ value: string; label: string; description?: string }>
}

interface FormFieldProps {
  field: TemplateField
  value: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
}

export function FormField({ field, value, onChange, onBlur }: FormFieldProps) {
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className="w-full"
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={4}
            className="w-full"
          />
        )

      case 'select':
        return (
          <Select value={typeof value === 'string' ? value : ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'radio':
        return (
          <RadioGroup
            value={typeof value === 'string' ? value : ''}
            onValueChange={onChange}
            className="space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label 
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm cursor-pointer flex-1"
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
        )

      case 'checkboxGroup':
        const currentValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-start space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={currentValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...currentValues, option.value])
                    } else {
                      onChange(currentValues.filter((val: string) => val !== option.value))
                    }
                  }}
                />
                <Label 
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm cursor-pointer leading-normal flex-1"
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

  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold">
        {field.label} {field.required && <span className="text-destructive">*</span>}
      </Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {renderField()}
    </div>
  )
}