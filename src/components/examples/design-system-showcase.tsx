'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Save, X, Search, Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormHeader,
  FormFooter,
  FormSection,
  FormGrid
} from '@/components/ui/form'
import { FormField as SimpleFormField } from '@/components/ui/form-field'

// Example form schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  email: z.string().email('Invalid email address'),
  notes: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

export function DesignSystemShowcase() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: '',
      email: '',
      notes: ''
    }
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[--text-primary]">Design System Showcase</h1>
        <p className="text-[--text-muted]">
          Comprehensive demonstration of all enhanced components with design tokens.
        </p>
      </div>

      {/* Button Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Button Component System</CardTitle>
          <CardDescription>
            Complete button variants with loading states, icons, and accessibility features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[--text-primary]">Primary Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="primary" size="md">Medium Primary</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>With Icon</Button>
              <Button variant="primary" isLoading>Loading</Button>
            </div>
          </div>

          {/* Secondary & Other Variants */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[--text-primary]">All Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="primary" fullWidth>Full Width</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Component Family */}
      <Card>
        <CardHeader>
          <CardTitle>Input Component Family</CardTitle>
          <CardDescription>
            Enhanced inputs with variants, validation states, and design token integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Variants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-primary]">Default Input</label>
              <Input placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-primary]">Error State</label>
              <Input variant="error" placeholder="Error input..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-primary]">Success State</label>
              <Input variant="success" placeholder="Success input..." />
            </div>
          </div>

          {/* Select Component */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[--text-primary]">Select Dropdown</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[--text-primary]">Textarea</label>
            <Textarea placeholder="Enter multiline text..." />
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Component System</CardTitle>
          <CardDescription>
            Advanced form layouts with React Hook Form integration and validation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormHeader 
                title="Sample Form"
                description="Demonstration of form components with validation and design tokens."
              />

              <FormSection title="Basic Information" variant="bordered">
                <FormGrid columns={2}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title..." {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title for your item.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="privacy">Privacy</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="compliance">Compliance</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormGrid>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional detailed description.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Additional Details" variant="card">
                <FormGrid columns={2}>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger variant="default">
                              <SelectValue placeholder="Select priority..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormGrid>
              </FormSection>

              <FormFooter align="between">
                <Button variant="ghost" type="button">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    <Filter className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="primary" type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Form
                  </Button>
                </div>
              </FormFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Simple Form Field Examples */}
      <Card>
        <CardHeader>
          <CardTitle>SimpleFormField Component</CardTitle>
          <CardDescription>
            Standalone form field wrapper for simple forms without React Hook Form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormGrid columns={2}>
            <SimpleFormField
              label="Required Field"
              required
              helperText="This field is required and shows a red asterisk."
            >
              <Input placeholder="Enter value..." />
            </SimpleFormField>

            <SimpleFormField
              label="Field with Error"
              errorMessage="This field has a validation error."
            >
              <Input variant="error" placeholder="Invalid value..." />
            </SimpleFormField>

            <SimpleFormField
              label="Success Field"
              successMessage="This field was validated successfully."
            >
              <Input variant="success" placeholder="Valid value..." />
            </SimpleFormField>

            <SimpleFormField
              label="Field with Warning"
              warningMessage="This field has a warning message."
            >
              <Select>
                <SelectTrigger variant="default">
                  <SelectValue placeholder="Choose option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </SimpleFormField>
          </FormGrid>
        </CardContent>
      </Card>

      {/* Card Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Card Component System</CardTitle>
          <CardDescription>
            Professional card layouts with headers, content, actions, and consistent design.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>Simple card with header and content.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[--text-muted]">
                  This is a basic card example with clean typography and proper spacing.
                </p>
              </CardContent>
            </Card>

            {/* Card with Action */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardAction>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </CardAction>
                <CardDescription>Card with header action button.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[--text-muted]">
                  Cards can include action buttons in the header for common operations.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            {/* Feature Card */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Card</CardTitle>
                <CardDescription>Complete card with footer actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-[--text-muted]">
                    Cards support complex layouts with multiple sections.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[--color-green]"></div>
                    <span className="text-xs text-[--text-muted]">Active</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" fullWidth>
                    Edit
                  </Button>
                  <Button variant="primary" size="sm" fullWidth>
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Design Tokens Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Design Tokens Reference</CardTitle>
          <CardDescription>
            Color system and design tokens used throughout the component library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Colors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[--text-primary]">Brand</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--brand-primary]"></div>
                  <span className="text-xs text-[--text-muted]">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--brand-destructive]"></div>
                  <span className="text-xs text-[--text-muted]">Destructive</span>
                </div>
              </div>
            </div>

            {/* Surface Colors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[--text-primary]">Surfaces</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--surface-0] border border-[--border-default]"></div>
                  <span className="text-xs text-[--text-muted]">Background</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--surface-1]"></div>
                  <span className="text-xs text-[--text-muted]">Cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--surface-2]"></div>
                  <span className="text-xs text-[--text-muted]">Secondary</span>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[--text-primary]">Text</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--text-primary]"></div>
                  <span className="text-xs text-[--text-muted]">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--text-secondary]"></div>
                  <span className="text-xs text-[--text-muted]">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--text-muted]"></div>
                  <span className="text-xs text-[--text-muted]">Muted</span>
                </div>
              </div>
            </div>

            {/* Status Colors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[--text-primary]">Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--color-green]"></div>
                  <span className="text-xs text-[--text-muted]">Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--color-orange]"></div>
                  <span className="text-xs text-[--text-muted]">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[--color-red]"></div>
                  <span className="text-xs text-[--text-muted]">Error</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}