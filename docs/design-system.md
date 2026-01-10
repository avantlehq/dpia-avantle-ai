# Design System Documentation

## Design Token System

Complete CSS variable system for consistent theming across dark/light modes. Enhanced in v3.21.169 with standardized module overview patterns.

### Brand Colors
```css
--brand-primary: #3b82f6          /* Blue-500 for primary actions */
--brand-primary-hover: #2563eb    /* Blue-600 for hover states */
--brand-primary-border: #60a5fa   /* Blue-400 for borders */
--text-on-primary: #ffffff        /* White text on primary backgrounds */
```

### Surface Colors
```css
--surface-0: #0f1419             /* Page background (dark) / #ffffff (light) */
--surface-1: #1a202c             /* Card backgrounds (dark) / #f8fafc (light) */
--surface-2: #2d3748             /* Elevated surfaces (dark) / #f1f5f9 (light) */
--surface-3: #4a5568             /* Higher elevation (dark) / #e2e8f0 (light) */
```

### Text Colors
```css
--text-primary: #f7fafc          /* Primary text (dark) / #1e293b (light) */
--text-secondary: #e2e8f0        /* Secondary text (dark) / #475569 (light) */
--text-muted: #a0aec0            /* Muted text (dark) / #64748b (light) */
```

### Semantic Colors
```css
--status-success: #10b981        /* Success states */
--status-success-bg: #065f4615   /* Success backgrounds */
--status-success-border: #34d39920 /* Success borders */

--status-error: #ef4444          /* Error states */
--status-error-bg: #dc262615     /* Error backgrounds */
--status-error-border: #f8717120 /* Error borders */

--status-warning: #f59e0b        /* Warning states */
--status-warning-bg: #d9770315   /* Warning backgrounds */
--status-warning-border: #fbbf2420 /* Warning borders */

--status-info: #3b82f6           /* Info states */
--status-info-bg: #3b82f615      /* Info backgrounds */
--status-info-border: #60a5fa20  /* Info borders */
```

### Spacing System
```css
--space-1: 4px    --space-11: 44px
--space-2: 8px    --space-12: 48px
--space-3: 12px   --space-14: 56px
--space-4: 16px   --space-16: 64px
--space-5: 20px   --space-20: 80px
--space-6: 24px
--space-7: 28px   /* 4px grid system */
--space-8: 32px
--space-9: 36px
--space-10: 40px
```

### Typography
```css
--text-3xl: 30px    /* Page titles */
--text-2xl: 24px    /* Section headers */
--text-xl: 20px     /* Card titles */
--text-lg: 18px     /* Form labels */
--text-base: 16px   /* Body text */
--text-sm: 14px     /* Helper text */
--text-xs: 12px     /* Captions */
```

## Component System

### Button Component

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

// Primary action
<Button variant="default" size="lg">Save Assessment</Button>

// Secondary actions  
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Export PDF</Button>
<Button variant="ghost">Skip</Button>

// Semantic variants
<Button variant="success">Complete</Button>
<Button variant="warning">Review</Button>
<Button variant="destructive">Delete</Button>

// With icons
<Button variant="default" leftIcon={<Plus />}>New Assessment</Button>
<Button variant="outline" rightIcon={<Download />}>Export</Button>

// Loading state
<Button variant="default" isLoading>Processing...</Button>
```

**Variants:**
- `default` - Primary blue, white text
- `secondary` - Dark surface, white text  
- `outline` - Transparent, border, primary text
- `ghost` - Transparent, primary text
- `success` - Green semantic
- `warning` - Orange semantic
- `destructive` - Red semantic

### Form Components

**DynamicFormGenerator:**
```tsx
import { DynamicFormGenerator } from '@/components/assessment/dynamic-form-generator'

<DynamicFormGenerator
  section={sectionDefinition}
  onSubmit={handleSubmit}
  defaultValues={existingData}
  loading={isSubmitting}
  submitButtonText="Complete Section"
/>
```

**ValidationPanel:**
```tsx
import { ValidationPanel } from '@/components/validation/validation-panel'

<ValidationPanel
  validationResult={result}
  isValidating={loading}
  className="mt-6"
/>
```

### Navigation Components

**WizardNavigation:**
```tsx
import { WizardNavigation } from '@/components/assessment/wizard-navigation'

<WizardNavigation
  onPrevious={handlePrevious}
  onNext={handleNext}
  canProceed={isValid}
  isLastSection={currentStep === 4}
  assessmentId={assessment.id}
/>
```

## Theme Implementation

### ThemeProvider Setup
```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider 
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Component Theme Usage
```tsx
// Use design tokens, not hardcoded colors
style={{
  backgroundColor: 'var(--surface-1)',
  borderColor: 'var(--border-default)',
  color: 'var(--text-primary)'
}}

// CSS classes with tokens
className="bg-[--surface-1] text-[--text-primary] border-[--border-default]"
```

### Dark/Light Toggle
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

<ThemeToggle />
```

## Form Validation States

### Semantic States
```tsx
const getValidationState = (hasError: boolean, hasValue: boolean) => {
  if (hasError) {
    return {
      borderColor: 'var(--status-error-border)',
      backgroundColor: 'var(--status-error-bg)',
      textColor: 'var(--status-error)'
    }
  }
  
  if (hasValue) {
    return {
      borderColor: 'var(--status-success-border)', 
      backgroundColor: 'var(--status-success-bg)',
      textColor: 'var(--status-success)'
    }
  }
  
  return {
    borderColor: 'var(--border-default)',
    backgroundColor: 'var(--surface-1)',
    textColor: 'var(--text-primary)'
  }
}
```

## Design Principles

### Single CTA Rule
One primary button per screen. Secondary actions use outline/ghost variants.

### Module Overview Pattern (v3.21.169)
Standardized layout structure for all module overview pages:
1. **Header Section**: Module title + primary/secondary CTAs with 32px gap
2. **Status Cards Section**: Horizontal status cards with navigation integration
3. **Quick Actions Section**: Button grid for common module actions
4. **Foundation Components**: Simplified bottom content area

### Status Card Standards
- **Clickable Navigation**: All status cards link to relevant sidebar positions
- **Color Coding**: Green (active/good), Red (critical/issues), Amber (warnings)
- **Hover Effects**: `hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`
- **Consistent Dimensions**: 38px height, 12px left padding, 16px right padding
- **Border Indicators**: 3px left border with semantic colors

### Quick Actions Pattern
- **Consistent Spacing**: 12px gaps using `style={{ gap: '12px' }}`
- **Button Variants**: All outline variant with icons for visual clarity
- **Navigation Integration**: Direct links to corresponding module sections

### Color Hierarchy
- Primary blue for main actions
- Semantic colors for state feedback
- Neutral surfaces for content
- Muted text for hierarchy

### Spacing Consistency
4px grid system. Use design tokens, not arbitrary values.

### Theme Compatibility
All components must work in dark/light themes using CSS variables.