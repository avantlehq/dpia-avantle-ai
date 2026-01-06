'use client'

import React, { useState, useEffect } from 'react'
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
  const [locations, setLocations] = useState<Location[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('')
  const [selectedAdequacy, setSelectedAdequacy] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')
        const response = await contextApiService.getLocations()
        setLocations(response.data || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch locations:', error)
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const filteredLocations = locations.filter(location => {
    const matchesSearch = !searchQuery || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country_code.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJurisdiction = !selectedJurisdiction || location.jurisdiction_type === selectedJurisdiction
    const matchesAdequacy = !selectedAdequacy || location.adequacy_status === selectedAdequacy
    
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Locations & Jurisdictions</h1>
          <p className="text-muted-foreground">
            Manage data processing locations, jurisdictions, and adequacy decisions
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="md"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Filters & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Jurisdiction Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Jurisdictions</SelectItem>
                <SelectItem value="eu_member_state">EU Member State</SelectItem>
                <SelectItem value="eea_country">EEA Country</SelectItem>
                <SelectItem value="third_country">Third Country</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAdequacy} onValueChange={setSelectedAdequacy}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by adequacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Adequacy Status</SelectItem>
                <SelectItem value="adequate">Adequate</SelectItem>
                <SelectItem value="not_adequate">Not Adequate</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground">{locations.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                Adequate: <span className="font-medium text-foreground">
                  {locations.filter(l => l.adequacy_status === 'adequate').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">
                Safeguards Required: <span className="font-medium text-foreground">
                  {locations.filter(l => l.safeguards_required).length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-muted-foreground">
                Data Localization: <span className="font-medium text-foreground">
                  {locations.filter(l => l.data_localization_requirements).length}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations List */}
      <Card>
        <CardHeader>
          <CardTitle>Locations ({filteredLocations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading locations...</div>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No locations found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedJurisdiction || selectedAdequacy
                  ? 'Try adjusting your filters or search query.'
                  : 'Start by adding your first processing location or jurisdiction.'
                }
              </p>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Location
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLocations.map((location) => (
                <div key={location.id} className="border rounded-lg p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-medium text-foreground text-lg">{location.name}</h3>
                          <span className="text-sm text-muted-foreground font-mono">({location.country_code})</span>
                        </div>
                        
                        <Badge className={getJurisdictionTypeColor(location.jurisdiction_type)}>
                          <Globe className="h-3 w-3 mr-1" />
                          {jurisdictionTypeLabels[location.jurisdiction_type]}
                        </Badge>
                        
                        <Badge className={getAdequacyStatusColor(location.adequacy_status)}>
                          {getAdequacyIcon(location.adequacy_status)}
                          {adequacyStatusLabels[location.adequacy_status]}
                        </Badge>
                        
                        {location.safeguards_required && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Safeguards Required
                          </Badge>
                        )}
                        
                        {location.data_localization_requirements && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Data Localization
                          </Badge>
                        )}
                      </div>
                      
                      {location.notes && (
                        <p className="text-sm text-muted-foreground">{location.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {location.adequacy_decision_date && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <CheckCircle className="h-3 w-3" />
                          Adequacy Decision:
                        </span>
                        <p className="text-foreground font-medium">
                          {new Date(location.adequacy_decision_date).toLocaleDateString()}
                        </p>
                        {location.adequacy_decision_reference && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {location.adequacy_decision_reference}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {location.safeguards_required && location.safeguards_description && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Shield className="h-3 w-3" />
                          Required Safeguards:
                        </span>
                        <p className="text-foreground text-xs">{location.safeguards_description}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1">
                        <Globe className="h-3 w-3" />
                        Data Localization:
                      </span>
                      <p className="text-foreground">
                        {location.data_localization_requirements ? 'Required' : 'Not Required'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}