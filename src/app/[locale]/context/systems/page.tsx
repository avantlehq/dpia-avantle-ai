'use client'

import React, { useState, useEffect } from 'react'
import { 
  Database,
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

// Force dynamic rendering to avoid SSR issues
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
  const [systems, setSystems] = useState<System[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCriticality, setSelectedCriticality] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch systems from API
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')
        const response = await contextApiService.getSystems()
        setSystems(response.data || [])
      } catch (error) {
        console.error('Failed to fetch systems:', error)
        setSystems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSystems()
  }, [])

  const filteredSystems = systems.filter(system => {
    const matchesSearch = !searchQuery || 
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCriticality = !selectedCriticality || 
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">IT Systems</h1>
          <p className="text-muted-foreground">
            Manage IT systems and infrastructure components for data processing
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="md"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add System
        </Button>
      </div>

      {/* Filters & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Criticality Filter */}
            <Select value={selectedCriticality} onValueChange={setSelectedCriticality}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Criticality</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground">{systems.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                Active: <span className="font-medium text-foreground">
                  {systems.filter(s => s.status === 'active').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">
                Critical: <span className="font-medium text-foreground">
                  {systems.filter(s => s.criticality === 'critical').length}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Systems Table */}
      <Card>
        <CardHeader>
          <CardTitle>Systems ({filteredSystems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading systems...</div>
            </div>
          ) : filteredSystems.length === 0 ? (
            <div className="text-center py-8">
              <Server className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No systems found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCriticality 
                  ? 'Try adjusting your filters or search query.'
                  : 'Get started by adding your first IT system.'
                }
              </p>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First System
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSystems.map((system) => (
                <div key={system.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{system.name}</h3>
                        {system.criticality && (
                          <Badge className={getCriticalityColor(system.criticality)}>
                            {system.criticality}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {system.status}
                        </Badge>
                      </div>
                      {system.description && (
                        <p className="text-sm text-muted-foreground">{system.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {system.system_type && (
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 text-foreground">{system.system_type}</span>
                      </div>
                    )}
                    {system.owner_team && (
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="ml-2 text-foreground">{system.owner_team}</span>
                      </div>
                    )}
                    {system.technical_contact && (
                      <div>
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="ml-2 text-foreground">{system.technical_contact}</span>
                      </div>
                    )}
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