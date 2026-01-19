/**
 * System Form Component
 *
 * Shared form for creating and editing IT systems.
 * Used in both /new and /[id] routes.
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ContextFormShell } from './ContextFormShell'
import { createSystem, updateSystem, type System } from '@/lib/context/systems'

const systemSchema = z.object({
  name: z.string().min(1, 'System name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  system_type: z.string().min(1, 'System type is required'),
  criticality: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['active', 'inactive']),
  owner_team: z.string().max(100, 'Owner team too long').optional(),
  technical_contact: z.string().email('Invalid email').max(100, 'Email too long').optional().or(z.literal('')),
})

type SystemFormData = z.infer<typeof systemSchema>

interface SystemFormProps {
  mode: 'create' | 'edit'
  locale: string
  systemId?: string
  initialData?: System
}

export function SystemForm({ mode, locale, systemId, initialData }: SystemFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      system_type: initialData?.system_type || '',
      criticality: initialData?.criticality || 'medium',
      status: initialData?.status || 'active',
      owner_team: initialData?.owner_team || '',
      technical_contact: initialData?.technical_contact || '',
    },
  })

  const onSubmit = async (data: SystemFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await createSystem(data)
        toast.success(locale === 'sk' ? 'Systém bol vytvorený' : 'System created successfully')
      } else if (systemId) {
        await updateSystem(systemId, data)
        toast.success(locale === 'sk' ? 'Systém bol aktualizovaný' : 'System updated successfully')
      }

      router.push(`/${locale}/context/systems`)
      router.refresh() // Invalidate cache
    } catch (error) {
      console.error('Error saving system:', error)
      toast.error(error instanceof Error ? error.message :
        (locale === 'sk' ? 'Nepodarilo sa uložiť systém' : 'Failed to save system'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${locale}/context/systems`)
  }

  const title = mode === 'create'
    ? (locale === 'sk' ? 'Nový systém' : 'New System')
    : (locale === 'sk' ? 'Upraviť systém' : 'Edit System')

  const description = mode === 'create'
    ? (locale === 'sk' ? 'Pridať nový IT systém pre sledovanie spracovania údajov a správu súladu.' : 'Add a new IT system for data processing tracking and compliance management.')
    : (locale === 'sk' ? 'Aktualizovať informácie o IT systéme.' : 'Update the IT system information.')

  return (
    <ContextFormShell
      title={title}
      description={description}
      backUrl={`/${locale}/context/systems`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Základné informácie' : 'Basic Information'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Názov systému' : 'System Name'} *</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., Databáza zákazníkov' : 'e.g., Customer Database'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Popis' : 'Description'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={locale === 'sk' ? 'Stručný popis účelu systému...' : 'Briefly describe the system\'s purpose...'}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* System Configuration Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Konfigurácia systému' : 'System Configuration'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="system_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Typ' : 'Type'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={locale === 'sk' ? 'Vybrať typ' : 'Select type'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="database">{locale === 'sk' ? 'Databáza' : 'Database'}</SelectItem>
                        <SelectItem value="application">{locale === 'sk' ? 'Aplikácia' : 'Application'}</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="storage">{locale === 'sk' ? 'Úložisko' : 'Storage'}</SelectItem>
                        <SelectItem value="analytics">{locale === 'sk' ? 'Analytika' : 'Analytics'}</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="erp">ERP</SelectItem>
                        <SelectItem value="other">{locale === 'sk' ? 'Iné' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criticality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Kritickosť' : 'Criticality'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">{locale === 'sk' ? 'Nízka' : 'Low'}</SelectItem>
                        <SelectItem value="medium">{locale === 'sk' ? 'Stredná' : 'Medium'}</SelectItem>
                        <SelectItem value="high">{locale === 'sk' ? 'Vysoká' : 'High'}</SelectItem>
                        <SelectItem value="critical">{locale === 'sk' ? 'Kritická' : 'Critical'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Stav' : 'Status'} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{locale === 'sk' ? 'Aktívny' : 'Active'}</SelectItem>
                        <SelectItem value="inactive">{locale === 'sk' ? 'Neaktívny' : 'Inactive'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Ownership & Contacts Section */}
          <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'sk' ? 'Vlastníctvo a kontakty' : 'Ownership & Contacts'}
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="owner_team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Vlastnícky tím' : 'Owner Team'}</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'sk' ? 'napr., IT Prevádzka' : 'e.g., IT Operations'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technical_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === 'sk' ? 'Technický kontakt' : 'Technical Contact'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={locale === 'sk' ? 'technicky-kontakt@spolocnost.sk' : 'technical-contact@company.com'}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-default)]">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {locale === 'sk' ? 'Zrušiť' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create'
                ? (locale === 'sk' ? 'Vytvoriť' : 'Create')
                : (locale === 'sk' ? 'Uložiť' : 'Save')
              }
            </Button>
          </div>
        </form>
      </Form>
    </ContextFormShell>
  )
}
