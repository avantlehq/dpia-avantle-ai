'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Server
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteSystemDialog } from '@/components/context/DeleteSystemDialog'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

// Force dynamic rendering to avoid SSR issues
// v3.30.0 - Bilingual support with context.pages.systems namespace
export const dynamic = 'force-dynamic'

type System = {
  id: string
  name: string
  description?: string
  system_type?: string
  criticality?: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'inactive'
  owner_team?: string
  technical_contact?: string
  created_at: string
}

export default function SystemsPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('context.pages.systems')
  const [systems, setSystems] = useState<System[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCriticality, setSelectedCriticality] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Delete dialog state only (modal-to-page refactoring complete)
  const [deleteSystem, setDeleteSystem] = useState<{ id: string; name: string } | null>(null)
  
  // Fetch systems from API
  const fetchSystems = async () => {
    try {
      setIsLoading(true)
      console.log('[SystemsPage] Fetching systems...')
      const { contextApiService } = await import('@/lib/context-api-service')
      const response = await contextApiService.getSystems()
      console.log('[SystemsPage] Systems fetched:', response.data?.length || 0, 'systems')
      setSystems(response.data || [])
    } catch (error) {
      console.error('[SystemsPage] Failed to fetch systems:', error)
      setSystems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSystems()
  }, [])

  const filteredSystems = systems.filter(system => {
    const matchesSearch = !searchQuery || 
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCriticality = !selectedCriticality || selectedCriticality === 'all' ||
      system.criticality === selectedCriticality
    
    return matchesSearch && matchesCriticality
  })

  const getCriticalityColor = (criticality?: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const handleDeleteSystem = (system: System) => {
    setDeleteSystem({ id: system.id, name: system.name })
  }

  const handleDeleteSuccess = async () => {
    console.log('[SystemsPage] Delete successful, refreshing list...')
    await fetchSystems() // Refresh the list
    console.log('[SystemsPage] List refreshed')
  }

  const handleCloseDeleteDialog = () => {
    setDeleteSystem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header - matching assessments style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <Link href={`/${locale}/context/systems/new`}>
          <Button
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addSystem')}
          </Button>
        </Link>
      </div>

      {/* Systems Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          {t('overviewTitle')}
        </h2>

        {/* Status Pills Group - matching assessments style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Active Systems Pill */}
          <div
            className="inline-flex items-center rounded-lg"
            style={{
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #22c55e',
              gap: '8px'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('activeSystems')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {systems.filter(s => s.status === 'active').length}
            </span>
          </div>

          {/* Critical Systems Pill */}
          <div
            className="inline-flex items-center rounded-lg"
            style={{
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #ef4444',
              gap: '8px'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('criticalSystems')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {systems.filter(s => s.criticality === 'critical').length}
            </span>
          </div>

          {/* Needing Review Pill */}
          <div
            className="inline-flex items-center rounded-lg"
            style={{
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #f59e0b',
              gap: '8px'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('needingReview')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {systems.filter(s => s.criticality === 'high').length}
            </span>
          </div>

          {/* Inactive Systems Pill */}
          <div
            className="inline-flex items-center rounded-lg"
            style={{
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #9ca3af',
              gap: '8px'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('inactiveSystems')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {systems.filter(s => s.status === 'inactive').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters - streamlined without card wrapper */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Criticality Filter */}
        <Select value={selectedCriticality} onValueChange={setSelectedCriticality}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('filterByCriticality')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCriticality')}</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Increased Spacing Before Systems */}
      <div className="mt-12"></div>

      {/* Systems Table - matching assessments structure */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            IT Systems ({filteredSystems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('loading')}</p>
              </div>
            </div>
          ) : filteredSystems.length === 0 ? (
            <div className="text-center py-12">
              <Server className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || selectedCriticality ? t('noSystemsFound') : t('readyToManage')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || selectedCriticality
                  ? t('adjustFilters')
                  : t('noSystemsDescription')
                }
              </p>
              <Link href={`/${locale}/context/systems/new`}>
                <Button variant="primary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('addFirstSystem')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderName')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderType')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderStatus')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderCriticality')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderOwner')}
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderActions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSystems.map((system) => (
                      <tr key={system.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">{system.name}</div>
                            {system.description && (
                              <div className="text-sm text-muted-foreground">{system.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {system.system_type || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={system.status === 'active' ? 'default' : 'outline'}
                            className={system.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }
                          >
                            {system.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {system.criticality ? (
                            <Badge className={getCriticalityColor(system.criticality)}>
                              {system.criticality}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {system.owner_team || '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title={t('editSystem')}
                              onClick={() => window.location.href = `/${locale}/context/systems/${system.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSystem(system)}
                              title={t('deleteSystem')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {t('showingSystems', { count: filteredSystems.length })}
                </p>
                <Link href={`/${locale}/context/systems/new`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('addNew')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog (lightweight modal for confirmations is acceptable) */}
      {deleteSystem && (
        <DeleteSystemDialog
          isOpen={Boolean(deleteSystem)}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDeleteSuccess}
          systemId={deleteSystem.id}
          systemName={deleteSystem.name}
        />
      )}
    </div>
  )
}