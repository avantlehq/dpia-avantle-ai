'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { Copy, CheckCircle, Info, RefreshCw, Play, Code } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'

// Type definitions for playground state
interface PlaygroundState {
  component: 'button' | 'input' | 'select' | 'card'
  variant: string
  size: string
  state: 'default' | 'loading' | 'disabled'
  theme: 'light' | 'dark'
}

// Component variant type definitions
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'
type ButtonSize = 'sm' | 'md' | 'lg'
type InputVariant = 'default' | 'success' | 'warning' | 'error'
type InputSize = 'sm' | 'md' | 'lg'
type SelectVariant = 'default' | 'success' | 'warning' | 'error'
type SelectSize = 'sm' | 'default' | 'lg'

export function ComponentPlayground() {
  const [playground, setPlayground] = useState<PlaygroundState>({
    component: 'button',
    variant: 'primary',
    size: 'md',
    state: 'default',
    theme: 'dark'
  })

  const [copied, setCopied] = useState(false)

  // Component configuration options
  const componentOptions = {
    button: {
      variants: ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'success', 'warning', 'info'],
      sizes: ['sm', 'md', 'lg']
    },
    input: {
      variants: ['default', 'success', 'warning', 'error'],
      sizes: ['sm', 'md', 'lg']
    },
    select: {
      variants: ['default', 'success', 'warning', 'error'],
      sizes: ['sm', 'default', 'lg']
    },
    card: {
      variants: ['default'],
      sizes: ['default']
    }
  }

  // Generate code examples
  const generateCode = () => {
    const { component, variant, size, state } = playground
    
    switch (component) {
      case 'button':
        return `<Button 
  variant="${variant}" 
  size="${size}"${state === 'loading' ? '\n  isLoading' : ''}${state === 'disabled' ? '\n  disabled' : ''}
  leftIcon={<CheckCircle className="h-4 w-4" />}
>
  ${variant.charAt(0).toUpperCase() + variant.slice(1)} Action
</Button>`
      
      case 'input':
        return `<Input 
  variant="${variant}" 
  size="${size}"${state === 'disabled' ? '\n  disabled' : ''}
  placeholder="Enter text..."
/>`
      
      case 'select':
        return `<Select${state === 'disabled' ? ' disabled' : ''}>
  <SelectTrigger variant="${variant}" size="${size}">
    <SelectValue placeholder="Choose option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`
      
      case 'card':
        return `<Card>
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
    <CardDescription>Card with design token integration</CardDescription>
  </CardHeader>
  <CardContent>
    Card content with mathematical spacing and design tokens.
  </CardContent>
</Card>`
      
      default:
        return ''
    }
  }

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Render the selected component with current configuration
  const renderComponent = () => {
    const { component, variant, size, state } = playground
    
    const commonProps = {
      ...(state === 'loading' && { isLoading: true }),
      ...(state === 'disabled' && { disabled: true })
    }

    switch (component) {
      case 'button':
        return (
          <Button 
            variant={variant as ButtonVariant} 
            size={size as ButtonSize}
            leftIcon={<CheckCircle className="h-4 w-4" />}
            {...commonProps}
          >
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Action
          </Button>
        )
      
      case 'input':
        return (
          <Input 
            variant={variant as InputVariant} 
            size={size as InputSize}
            placeholder="Enter text..."
            {...commonProps}
          />
        )
      
      case 'select':
        return (
          <Select disabled={state === 'disabled'}>
            <SelectTrigger variant={variant as SelectVariant} size={size as SelectSize}>
              <SelectValue placeholder="Choose option..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        )
      
      case 'card':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-[--space-2]">
                <Info className="h-5 w-5 text-[--status-info]" />
                Interactive Card
              </CardTitle>
              <CardDescription>
                Card with design token integration and mathematical spacing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[--text-sm] text-[--text-muted]">
                This card demonstrates the enhanced design token system with proper spacing, typography, and semantic colors.
              </p>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-[--space-8] space-y-[--space-8]">
      {/* Header */}
      <div className="space-y-[--space-4]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[--text-3xl] font-bold text-[--text-primary]">Component Playground</h1>
            <p className="text-[--text-lg] text-[--text-muted]">
              Interactive testing environment for all design token variants and component combinations.
            </p>
          </div>
          <ThemeSwitcher />
        </div>
        
        <div className="flex flex-wrap gap-[--space-2]">
          <Badge className="bg-[--status-info-bg] text-[--status-info]">
            Live Testing
          </Badge>
          <Badge className="bg-[--status-success-bg] text-[--status-success]">
            Code Generation
          </Badge>
          <Badge className="bg-[--status-warning-bg] text-[--status-warning]">
            All Variants
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[--space-6]">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-[--space-2]">
              <RefreshCw className="h-5 w-5 text-[--brand-primary]" />
              Configuration
            </CardTitle>
            <CardDescription>
              Configure component variants and states to see live changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-[--space-4]">
            {/* Component Selection */}
            <div className="space-y-[--space-2]">
              <label className="text-[--text-sm] font-medium text-[--text-primary]">Component</label>
              <Select value={playground.component} onValueChange={(value) => setPlayground(prev => ({ 
                ...prev, 
                component: value as any,
                variant: componentOptions[value as keyof typeof componentOptions].variants[0],
                size: componentOptions[value as keyof typeof componentOptions].sizes[0]
              }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Variant Selection */}
            <div className="space-y-[--space-2]">
              <label className="text-[--text-sm] font-medium text-[--text-primary]">Variant</label>
              <Select value={playground.variant} onValueChange={(value) => setPlayground(prev => ({ ...prev, variant: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {componentOptions[playground.component].variants.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-[--space-2]">
              <label className="text-[--text-sm] font-medium text-[--text-primary]">Size</label>
              <Select value={playground.size} onValueChange={(value) => setPlayground(prev => ({ ...prev, size: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {componentOptions[playground.component].sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State Selection */}
            {playground.component !== 'card' && (
              <div className="space-y-[--space-2]">
                <label className="text-[--text-sm] font-medium text-[--text-primary]">State</label>
                <Select value={playground.state} onValueChange={(value) => setPlayground(prev => ({ ...prev, state: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    {playground.component === 'button' && <SelectItem value="loading">Loading</SelectItem>}
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Component Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-[--space-2]">
              <Play className="h-5 w-5 text-[--status-success]" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Live component with your selected configuration and current theme.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[200px] bg-[--surface-0] border border-[--border-default] rounded-[--radius-default]">
            {renderComponent()}
          </CardContent>
        </Card>

        {/* Generated Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-[--space-2]">
                <Code className="h-5 w-5 text-[--status-warning]" />
                Generated Code
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="gap-[--space-1]"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-[--status-success]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </CardTitle>
            <CardDescription>
              Copy-paste ready JSX code for your component configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-[--surface-2] p-[--space-3] rounded-[--radius-md] text-[--text-xs] text-[--text-primary] overflow-x-auto border border-[--border-default]">
              <code>{generateCode()}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Spacing Demonstration */}
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Spacing Demonstration</CardTitle>
          <CardDescription>
            Visual demonstration of the 4px grid system with the current component.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[--space-4]">
          <div className="space-y-[--space-3]">
            <h4 className="text-[--text-sm] font-medium text-[--text-primary]">Different Spacing Values</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[--space-4]">
              <div className="space-y-[--space-1]">
                <p className="text-[--text-xs] text-[--text-muted]">space-1 gap (4px)</p>
                <div className="flex gap-[--space-1]">
                  {renderComponent()}
                  {renderComponent()}
                </div>
              </div>
              <div className="space-y-[--space-2]">
                <p className="text-[--text-xs] text-[--text-muted]">space-3 gap (12px)</p>
                <div className="flex gap-[--space-3]">
                  {renderComponent()}
                  {renderComponent()}
                </div>
              </div>
              <div className="space-y-[--space-2]">
                <p className="text-[--text-xs] text-[--text-muted]">space-6 gap (24px)</p>
                <div className="flex gap-[--space-6]">
                  {renderComponent()}
                  {renderComponent()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Variants Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>All Variants Overview</CardTitle>
          <CardDescription>
            Quick overview of all available variants for the selected component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[--space-4]">
            {componentOptions[playground.component].variants.map((variant) => (
              <div key={variant} className="space-y-[--space-2]">
                <p className="text-[--text-xs] font-medium text-[--text-secondary] capitalize">
                  {variant}
                </p>
                {playground.component === 'button' && (
                  <Button variant={variant as ButtonVariant} size={playground.size as ButtonSize}>
                    {variant}
                  </Button>
                )}
                {playground.component === 'input' && (
                  <Input variant={variant as InputVariant} size={playground.size as InputSize} placeholder={`${variant} input`} />
                )}
                {playground.component === 'select' && (
                  <Select>
                    <SelectTrigger variant={variant as SelectVariant} size={playground.size as SelectSize}>
                      <SelectValue placeholder={`${variant} select`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test Option</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}