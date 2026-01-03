'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Save, X, Search, Filter, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import Link from 'next/link'
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
        <h1 className="text-[--text-3xl] font-bold text-[--text-primary]">Enhanced Design Token System</h1>
        <p className="text-[--text-lg] text-[--text-muted]">
          Comprehensive demonstration of 200+ design tokens with semantic colors, mathematical spacing, and typography scale.
        </p>
        <div className="flex flex-wrap gap-[--space-2] items-center">
          <div className="flex flex-wrap gap-[--space-2]">
            <span className="px-[--space-3] py-[--space-1] bg-[--status-success-bg] text-[--status-success] rounded-[--radius-md] text-[--text-xs] font-medium">
              v3.21.119 Enhanced Tokens
            </span>
            <span className="px-[--space-3] py-[--space-1] bg-[--status-info-bg] text-[--status-info] rounded-[--radius-md] text-[--text-xs] font-medium">
              200+ CSS Variables
            </span>
            <span className="px-[--space-3] py-[--space-1] bg-[--status-warning-bg] text-[--status-warning] rounded-[--radius-md] text-[--text-xs] font-medium">
              4px Grid System
            </span>
          </div>
          <div className="ml-auto flex items-center gap-[--space-3]">
            <Link href="/design-system/playground">
              <Button variant="primary" size="sm" leftIcon={<Info className="h-4 w-4" />}>
                Interactive Playground
              </Button>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Enhanced Button System with Semantic Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Button System</CardTitle>
          <CardDescription>
            Complete button variants with new semantic colors (success, warning, info) and mathematical spacing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[--space-6]">
          {/* Semantic Color Variants - NEW */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">NEW: Semantic Color Variants</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[--space-3]">
              <div className="space-y-[--space-2]">
                <Button variant="success" size="md" leftIcon={<CheckCircle className="h-4 w-4" />} fullWidth>
                  Success Action
                </Button>
                <p className="text-[--text-xs] text-[--text-muted]">Positive feedback, completion states</p>
              </div>
              <div className="space-y-[--space-2]">
                <Button variant="warning" size="md" leftIcon={<AlertTriangle className="h-4 w-4" />} fullWidth>
                  Warning Action
                </Button>
                <p className="text-[--text-xs] text-[--text-muted]">Caution states, important notices</p>
              </div>
              <div className="space-y-[--space-2]">
                <Button variant="destructive" size="md" leftIcon={<XCircle className="h-4 w-4" />} fullWidth>
                  Error Action
                </Button>
                <p className="text-[--text-xs] text-[--text-muted]">Destructive actions, error states</p>
              </div>
              <div className="space-y-[--space-2]">
                <Button variant="info" size="md" leftIcon={<Info className="h-4 w-4" />} fullWidth>
                  Info Action
                </Button>
                <p className="text-[--text-xs] text-[--text-muted]">Information, neutral feedback</p>
              </div>
            </div>
          </div>

          {/* Mathematical Spacing Demo */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Mathematical Spacing (4px Grid)</h3>
            <div className="space-y-[--space-3]">
              <div className="flex flex-wrap gap-[--space-1]">
                <Button variant="primary" size="sm">space-1 gap</Button>
                <Button variant="secondary" size="sm">4px spacing</Button>
              </div>
              <div className="flex flex-wrap gap-[--space-3]">
                <Button variant="primary" size="md">space-3 gap</Button>
                <Button variant="secondary" size="md">12px spacing</Button>
              </div>
              <div className="flex flex-wrap gap-[--space-6]">
                <Button variant="primary" size="lg">space-6 gap</Button>
                <Button variant="secondary" size="lg">24px spacing</Button>
              </div>
            </div>
          </div>

          {/* Original Button Variants */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Core Button Variants</h3>
            <div className="space-y-[--space-4]">
              {/* Size Variants */}
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Size Variants</h4>
                <div className="flex flex-wrap items-center gap-[--space-3]">
                  <Button variant="primary" size="sm">Small (sm)</Button>
                  <Button variant="primary" size="md">Medium (md)</Button>
                  <Button variant="primary" size="lg">Large (lg)</Button>
                </div>
              </div>

              {/* Style Variants */}
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Style Variants</h4>
                <div className="flex flex-wrap gap-[--space-3]">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                </div>
              </div>

              {/* State Variants */}
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Interactive States</h4>
                <div className="flex flex-wrap gap-[--space-3]">
                  <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>With Icon</Button>
                  <Button variant="primary" isLoading>Loading State</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Input Component Family */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Input Component Family</CardTitle>
          <CardDescription>
            Input family with semantic color variants, mathematical spacing, and comprehensive validation states.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[--space-6]">
          {/* Semantic Input Variants - NEW */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">NEW: Semantic Color Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[--space-4]">
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Default State</label>
                <Input placeholder="Enter text..." />
                <p className="text-[--text-xs] text-[--text-muted]">Standard input state</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Success State</label>
                <Input variant="success" placeholder="Valid input..." />
                <p className="text-[--text-xs] text-[--status-success]">✓ Validation passed</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Warning State</label>
                <Input variant="warning" placeholder="Warning input..." />
                <p className="text-[--text-xs] text-[--status-warning]">⚠ Please review</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Error State</label>
                <Input variant="error" placeholder="Invalid input..." />
                <p className="text-[--text-xs] text-[--status-error]">✗ Validation failed</p>
              </div>
            </div>
          </div>

          {/* Enhanced Select Component */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Enhanced Select Component</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[--space-4]">
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Default Select</label>
                <Select>
                  <SelectTrigger variant="default">
                    <SelectValue placeholder="Choose option..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Success Select</label>
                <Select>
                  <SelectTrigger variant="success">
                    <SelectValue placeholder="Valid selection..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valid1">Valid Option 1</SelectItem>
                    <SelectItem value="valid2">Valid Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[--text-xs] text-[--status-success]">✓ Good choice</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Warning Select</label>
                <Select>
                  <SelectTrigger variant="warning">
                    <SelectValue placeholder="Caution required..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warn1">Caution Option 1</SelectItem>
                    <SelectItem value="warn2">Caution Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[--text-xs] text-[--status-warning]">⚠ Review carefully</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Error Select</label>
                <Select>
                  <SelectTrigger variant="error">
                    <SelectValue placeholder="Invalid selection..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error1">Error Option 1</SelectItem>
                    <SelectItem value="error2">Error Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[--text-xs] text-[--status-error]">✗ Selection required</p>
              </div>
            </div>
          </div>

          {/* Size Variants with Mathematical Spacing */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Size Variants (Mathematical Spacing)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[--space-4]">
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Small (sm)</label>
                <Input size="sm" placeholder="Small input (h-[--height-sm])" />
                <p className="text-[--text-xs] text-[--text-muted]">32px height, 12px padding</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Medium (md)</label>
                <Input size="md" placeholder="Medium input (h-[--height-md])" />
                <p className="text-[--text-xs] text-[--text-muted]">40px height, 16px padding</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Large (lg)</label>
                <Input size="lg" placeholder="Large input (h-[--height-lg])" />
                <p className="text-[--text-xs] text-[--text-muted]">48px height, 20px padding</p>
              </div>
            </div>
          </div>

          {/* Enhanced Textarea */}
          <div className="space-y-[--space-3]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Enhanced Textarea</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[--space-4]">
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Default Textarea</label>
                <Textarea placeholder="Enter multiline text with design token spacing..." />
                <p className="text-[--text-xs] text-[--text-muted]">Mathematical padding and border radius</p>
              </div>
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">Success Textarea</label>
                <Textarea variant="success" placeholder="Valid multiline content..." />
                <p className="text-[--text-xs] text-[--status-success]">✓ Content looks good</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Scale System - NEW */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Scale System</CardTitle>
          <CardDescription>
            Professional typography hierarchy with design tokens from 3xl to xs with proper line heights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[--space-6]">
          <div className="space-y-[--space-4]">
            <div className="space-y-[--space-3]">
              <h3 className="text-[--text-base] font-medium text-[--text-primary]">Typography Hierarchy</h3>
              <div className="space-y-[--space-4] border-l-2 border-[--border-default] pl-[--space-4]">
                <div className="space-y-[--space-1]">
                  <h1 className="text-[--text-3xl] font-bold text-[--text-primary] leading-[--leading-tight]">
                    3XL Heading (36px)
                  </h1>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-3xl] • Page titles, major headings
                  </code>
                </div>
                <div className="space-y-[--space-1]">
                  <h2 className="text-[--text-2xl] font-semibold text-[--text-primary] leading-[--leading-tight]">
                    2XL Heading (30px)
                  </h2>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-2xl] • Section headings
                  </code>
                </div>
                <div className="space-y-[--space-1]">
                  <h3 className="text-[--text-xl] font-medium text-[--text-primary] leading-[--leading-normal]">
                    XL Heading (24px)
                  </h3>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-xl] • Subsection headings
                  </code>
                </div>
                <div className="space-y-[--space-1]">
                  <h4 className="text-[--text-lg] font-medium text-[--text-primary] leading-[--leading-normal]">
                    Large Text (18px)
                  </h4>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-lg] • Card titles, form labels
                  </code>
                </div>
                <div className="space-y-[--space-1]">
                  <p className="text-[--text-base] text-[--text-primary] leading-[--leading-relaxed]">
                    Base Text (16px) - Primary body content with comfortable reading experience
                  </p>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-base] • Body text, primary content
                  </code>
                </div>
                <div className="space-y-[--space-1]">
                  <p className="text-[--text-sm] text-[--text-secondary] leading-[--leading-normal]">
                    Small Text (14px) - Secondary text and captions
                  </p>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-sm] • Secondary text, captions
                  </code>
                </div>
                <div className="space-y-[--space-1]">
                  <p className="text-[--text-xs] text-[--text-muted] leading-[--leading-normal]">
                    Extra Small (12px) - Fine print and metadata
                  </p>
                  <code className="text-[--text-xs] text-[--text-muted] bg-[--surface-2] px-[--space-2] py-[--space-1] rounded-[--radius-sm]">
                    text-[--text-xs] • Fine print, metadata
                  </code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mathematical Spacing System - NEW */}
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Spacing System</CardTitle>
          <CardDescription>
            4px grid-based spacing system ensuring pixel-perfect alignment and scalable layouts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[--space-6]">
          <div className="space-y-[--space-4]">
            <div className="space-y-[--space-3]">
              <h3 className="text-[--text-base] font-medium text-[--text-primary]">Spacing Scale (4px Base Unit)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[--space-4]">
                {/* Small Spacing */}
                <div className="space-y-[--space-3]">
                  <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Small Spacing</h4>
                  <div className="space-y-[--space-2]">
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-1] h-[--space-4] bg-[--status-info]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-1 (4px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-2] h-[--space-4] bg-[--status-info]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-2 (8px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-3] h-[--space-4] bg-[--status-info]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-3 (12px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-4] h-[--space-4] bg-[--status-info]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-4 (16px)</code>
                    </div>
                  </div>
                </div>

                {/* Medium Spacing */}
                <div className="space-y-[--space-3]">
                  <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Medium Spacing</h4>
                  <div className="space-y-[--space-2]">
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-5] h-[--space-4] bg-[--status-success]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-5 (20px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-6] h-[--space-4] bg-[--status-success]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-6 (24px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-4] bg-[--status-success]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-8 (32px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-10] h-[--space-4] bg-[--status-success]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-10 (40px)</code>
                    </div>
                  </div>
                </div>

                {/* Large Spacing */}
                <div className="space-y-[--space-3]">
                  <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Large Spacing</h4>
                  <div className="space-y-[--space-2]">
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-12] h-[--space-4] bg-[--status-warning]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-12 (48px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-16] h-[--space-4] bg-[--status-warning]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-16 (64px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-20] h-[--space-4] bg-[--status-warning]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">space-20 (80px)</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-[--space-3]">
              <h3 className="text-[--text-base] font-medium text-[--text-primary]">Component Tokens</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[--space-6]">
                {/* Border Radius */}
                <div className="space-y-[--space-3]">
                  <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Border Radius</h4>
                  <div className="space-y-[--space-2]">
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-8] bg-[--surface-2] rounded-[--radius-sm]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">radius-sm (8px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-8] bg-[--surface-2] rounded-[--radius-default]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">radius-default (12px)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-8] bg-[--surface-2] rounded-[--radius-lg]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">radius-lg (14px)</code>
                    </div>
                  </div>
                </div>

                {/* Shadow Scale */}
                <div className="space-y-[--space-3]">
                  <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Shadow Scale</h4>
                  <div className="space-y-[--space-3]">
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-8] bg-[--surface-1] shadow-[--shadow-sm] rounded-[--radius-default]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">shadow-sm</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-8] bg-[--surface-1] shadow-[--shadow-md] rounded-[--radius-default]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">shadow-md</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-8] h-[--space-8] bg-[--surface-1] shadow-[--shadow-lg] rounded-[--radius-default]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">shadow-lg</code>
                    </div>
                  </div>
                </div>

                {/* Transition Tokens */}
                <div className="space-y-[--space-3]">
                  <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Transition System</h4>
                  <div className="space-y-[--space-2]">
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-6] h-[--space-6] bg-[--brand-primary] rounded-[--radius-default] transition-[--transition-fast] hover:scale-110"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">transition-fast (150ms)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-6] h-[--space-6] bg-[--status-success] rounded-[--radius-default] transition-[--transition-colors] hover:bg-[--status-success-hover]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">transition-colors (200ms)</code>
                    </div>
                    <div className="flex items-center gap-[--space-2]">
                      <div className="w-[--space-6] h-[--space-6] bg-[--surface-2] rounded-[--radius-default] transition-[--transition-shadow] hover:shadow-[--shadow-md]"></div>
                      <code className="text-[--text-xs] text-[--text-muted]">transition-shadow (300ms)</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Enhanced Design Tokens Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Design Tokens Reference</CardTitle>
          <CardDescription>
            Complete reference of 200+ design tokens with semantic colors, spacing, and component tokens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[--space-6]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[--space-6]">
            {/* Brand Colors */}
            <div className="space-y-[--space-3]">
              <h4 className="text-[--text-sm] font-medium text-[--text-primary]">Brand Colors</h4>
              <div className="space-y-[--space-2]">
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--brand-primary]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">brand-primary</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--brand-primary-hover]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">brand-primary-hover</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--brand-primary-active]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">brand-primary-active</code>
                </div>
              </div>
            </div>

            {/* Semantic Status Colors - NEW */}
            <div className="space-y-[--space-3]">
              <h4 className="text-[--text-sm] font-medium text-[--text-primary]">Semantic Colors</h4>
              <div className="space-y-[--space-2]">
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--status-success]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">status-success</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--status-warning]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">status-warning</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--status-error]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">status-error</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--status-info]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">status-info</code>
                </div>
              </div>
            </div>

            {/* Surface Colors */}
            <div className="space-y-[--space-3]">
              <h4 className="text-[--text-sm] font-medium text-[--text-primary]">Surface Colors</h4>
              <div className="space-y-[--space-2]">
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--surface-0] border border-[--border-default]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">surface-0</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--surface-1]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">surface-1</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--surface-2]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">surface-2</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--surface-3]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">surface-3</code>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-[--space-3]">
              <h4 className="text-[--text-sm] font-medium text-[--text-primary]">Text Colors</h4>
              <div className="space-y-[--space-2]">
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--text-primary]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">text-primary</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--text-secondary]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">text-secondary</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--text-muted]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">text-muted</code>
                </div>
              </div>
            </div>

            {/* Interactive Colors */}
            <div className="space-y-[--space-3]">
              <h4 className="text-[--text-sm] font-medium text-[--text-primary]">Interactive</h4>
              <div className="space-y-[--space-2]">
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full border border-[--border-default]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">border-default</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full border-2 border-[--focus-ring-color]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">focus-ring-color</code>
                </div>
                <div className="flex items-center gap-[--space-2]">
                  <div className="w-[--space-4] h-[--space-4] rounded-full bg-[--interactive-hover]"></div>
                  <code className="text-[--text-xs] text-[--text-muted]">interactive-hover</code>
                </div>
              </div>
            </div>
          </div>

          {/* Copy-Paste Code Examples */}
          <div className="space-y-[--space-3] border-t border-[--border-default] pt-[--space-6]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Copy-Paste Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[--space-4]">
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Button with Semantic Colors</h4>
                <div className="bg-[--surface-2] p-[--space-3] rounded-[--radius-default] border border-[--border-default]">
                  <code className="text-[--text-xs] text-[--text-muted] whitespace-pre-wrap">
{`<Button variant="success" leftIcon={<CheckCircle />}>
  Success Action
</Button>`}
                  </code>
                </div>
              </div>
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--text-secondary]">Input with Mathematical Spacing</h4>
                <div className="bg-[--surface-2] p-[--space-3] rounded-[--radius-default] border border-[--border-default]">
                  <code className="text-[--text-xs] text-[--text-muted] whitespace-pre-wrap">
{`<div className="space-y-[--space-2]">
  <Input variant="error" />
  <p className="text-[--text-xs] text-[--status-error]">
    ✗ Validation failed
  </p>
</div>`}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Token Usage Guidelines */}
          <div className="space-y-[--space-3] border-t border-[--border-default] pt-[--space-6]">
            <h3 className="text-[--text-base] font-medium text-[--text-primary]">Token Usage Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[--space-4]">
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--status-success]">✓ Do</h4>
                <ul className="text-[--text-xs] text-[--text-muted] space-y-[--space-1]">
                  <li>• Use semantic colors for appropriate states</li>
                  <li>• Apply mathematical spacing consistently</li>
                  <li>• Follow typography hierarchy for readability</li>
                  <li>• Use component tokens for consistency</li>
                </ul>
              </div>
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--status-error]">✗ Don&apos;t</h4>
                <ul className="text-[--text-xs] text-[--text-muted] space-y-[--space-1]">
                  <li>• Mix hardcoded values with tokens</li>
                  <li>• Use success colors for destructive actions</li>
                  <li>• Break the 4px grid spacing system</li>
                  <li>• Override component token values</li>
                </ul>
              </div>
              <div className="space-y-[--space-2]">
                <h4 className="text-[--text-sm] font-medium text-[--status-info]">ℹ Tips</h4>
                <ul className="text-[--text-xs] text-[--text-muted] space-y-[--space-1]">
                  <li>• Use CSS variables for all styling</li>
                  <li>• Test in both light and dark contexts</li>
                  <li>• Maintain consistent spacing ratios</li>
                  <li>• Document custom token usage</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}