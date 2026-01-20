'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Flag
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
import { DeleteLocationDialog } from '@/components/context/DeleteLocationDialog'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

type AdequacyStatus = 'adequate' | 'not_adequate' | 'partial' | 'under_review'
type JurisdictionType = 'eu_member_state' | 'eea_country' | 'third_country' | 'international'

type Location = {
  id: string
  name: string
  country_code: string
  jurisdiction_type: JurisdictionType
  adequacy_status: AdequacyStatus
  adequacy_decision_date?: string
  adequacy_decision_reference?: string
  safeguards_required: boolean
  safeguards_description?: string
  data_localization_requirements: boolean
  status: 'active' | 'inactive'
  notes?: string
  created_at: string
}

const jurisdictionTypeLabels: Record<JurisdictionType, string> = {
  eu_member_state: 'EU Member State',
  eea_country: 'EEA Country',
  third_country: 'Third Country',
  international: 'International'
}

const adequacyStatusLabels: Record<AdequacyStatus, string> = {
  adequate: 'Adequate',
  not_adequate: 'Not Adequate',
  partial: 'Partial',
  under_review: 'Under Review'
}

const getJurisdictionTypeColor = (type: JurisdictionType) => {
  switch (type) {
    case 'eu_member_state': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'eea_country': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    case 'third_country': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'international': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const getAdequacyStatusColor = (status: AdequacyStatus) => {
  switch (status) {
    case 'adequate': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'not_adequate': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'under_review': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function LocationsPage() {
  const params = useParams()
  const locale = params?.locale as string || 'en'
  const t = useTranslations('context.pages.locations')

  const [locations, setLocations] = useState<Location[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('')
  const [selectedAdequacy, setSelectedAdequacy] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Delete dialog state
  const [deleteLocation, setDeleteLocation] = useState<{ id: string; name: string } | null>(null)

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      const { contextApiService } = await import('@/lib/context-api-service')
      const response = await contextApiService.getLocations()
      setLocations(response.data || [])
    } catch (error) {
      console.error('Failed to fetch locations:', error)
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const filteredLocations = locations.filter(location => {
    const matchesSearch = !searchQuery || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country_code.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJurisdiction = !selectedJurisdiction || selectedJurisdiction === 'all' || location.jurisdiction_type === selectedJurisdiction
    const matchesAdequacy = !selectedAdequacy || selectedAdequacy === 'all' || location.adequacy_status === selectedAdequacy
    
    return matchesSearch && matchesJurisdiction && matchesAdequacy
  })

  const getAdequacyIcon = (status: AdequacyStatus) => {
    switch (status) {
      case 'adequate': return <CheckCircle className="h-3 w-3 mr-1" />
      case 'not_adequate': return <AlertTriangle className="h-3 w-3 mr-1" />
      case 'partial': return <Shield className="h-3 w-3 mr-1" />
      case 'under_review': return <Globe className="h-3 w-3 mr-1" />
      default: return <Globe className="h-3 w-3 mr-1" />
    }
  }

  const handleDeleteLocation = (location: Location) => {
    setDeleteLocation({ id: location.id, name: location.name })
  }

  const handleDeleteSuccess = async () => {
    console.log('[LocationsPage] Delete successful, refreshing list...')
    await fetchLocations() // Refresh the list
    console.log('[LocationsPage] List refreshed')
  }

  const handleCloseDeleteDialog = () => {
    setDeleteLocation(null)
  }

  // v3.30.1 - Force rebuild: Bilingual translations active
  console.log("[Page] Locale:", locale, "Namespace: context.pages")
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

        <Link href={`/${locale}/context/locations/new`}>
          <Button
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addLocation')}
          </Button>
        </Link>
      </div>

      {/* Locations Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          {t('overviewTitle')}
        </h2>
        
        {/* Status Pills Group - matching assessments style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Adequate Countries Pill */}
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
              {t('adequateCountries')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {locations.filter(l => l.adequacy_status === 'adequate').length}
            </span>
          </div>

          {/* Third Countries Pill */}
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
              {t('thirdCountries')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {locations.filter(l => l.jurisdiction_type === 'third_country').length}
            </span>
          </div>

          {/* EU Locations Pill */}
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
              {t('euLocations')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {locations.filter(l => l.safeguards_required && !l.safeguards_description).length}
            </span>
          </div>

          {/* Active Locations Pill */}
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
              {t('activeLocations')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {locations.filter(l => l.adequacy_status === 'under_review').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters - streamlined without card wrapper */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder={t('filterByAdequacy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allJurisdictions')}</SelectItem>
            <SelectItem value="eu_member_state">EU Member State</SelectItem>
            <SelectItem value="eea_country">EEA Country</SelectItem>
            <SelectItem value="third_country">Third Country</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAdequacy} onValueChange={setSelectedAdequacy}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder={t('filterByAdequacy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allJurisdictions')}</SelectItem>
            <SelectItem value="adequate">Adequate</SelectItem>
            <SelectItem value="not_adequate">Not Adequate</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Increased Spacing Before Locations */}
      <div className="mt-12"></div>

      {/* Locations Table - matching assessments structure */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Locations & Jurisdictions ({filteredLocations.length})
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
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || selectedJurisdiction || selectedAdequacy ? t('noLocationsFound') : t('readyToManage')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || selectedJurisdiction || selectedAdequacy
                  ? t('adjustFilters')
                  : t('noLocationsDescription')
                }
              </p>
              <Link href={`/${locale}/context/locations/new`}>
                <Button variant="primary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('addFirstLocation')}
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
                        {t('tableHeaderAdequacy')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Safeguards
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderActions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocations.map((location) => (
                      <tr key={location.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <div className="font-medium text-foreground">{location.name}</div>
                              <span className="text-sm text-muted-foreground font-mono">({location.country_code})</span>
                            </div>
                            {location.notes && (
                              <div className="text-sm text-muted-foreground">{location.notes}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getJurisdictionTypeColor(location.jurisdiction_type)}>
                            <Globe className="h-3 w-3 mr-1" />
                            {jurisdictionTypeLabels[location.jurisdiction_type]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getAdequacyStatusColor(location.adequacy_status)}>
                            {getAdequacyIcon(location.adequacy_status)}
                            {adequacyStatusLabels[location.adequacy_status]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            {location.safeguards_required ? (
                              <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Required
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not Required</span>
                            )}
                            {location.data_localization_requirements && (
                              <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Data Localization
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title={t('editLocation')}
                              onClick={() => window.location.href = `/${locale}/context/locations/${location.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLocation(location)}
                              title={t('deleteLocation')}
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
                  {t('showingLocations', { count: filteredLocations.length })}
                </p>
                <Link href={`/${locale}/context/locations/new`}>
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

      {/* Delete Dialog */}
      {deleteLocation && (
        <DeleteLocationDialog
          isOpen={Boolean(deleteLocation)}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDeleteSuccess}
          locationId={deleteLocation.id}
          locationName={deleteLocation.name}
        />
      )}
    </div>
  )
}