'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowRight,
  Plus,
  Search,
  Edit,
  Trash2,
  GitBranch,
  Globe,
  AlertTriangle,
  Database,
  Network
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

type FlowDirection = 'inbound' | 'outbound' | 'bidirectional' | 'internal'
type Criticality = 'low' | 'medium' | 'high' | 'critical'

type DataFlow = {
  id: string
  name: string
  description?: string
  purpose?: string
  flow_direction: FlowDirection
  frequency?: string
  volume_estimate?: string
  criticality?: Criticality
  status: 'active' | 'inactive'
  from_system?: string
  to_system?: string
  from_vendor?: string
  to_vendor?: string
  encryption_in_transit: boolean
  cross_border_transfer: boolean
  created_at: string
}

const flowDirectionLabels: Record<FlowDirection, string> = {
  inbound: 'Inbound',
  outbound: 'Outbound', 
  bidirectional: 'Bidirectional',
  internal: 'Internal'
}

const getFlowDirectionColor = (direction: FlowDirection) => {
  switch (direction) {
    case 'inbound': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'outbound': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'bidirectional': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'internal': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const getCriticalityColor = (criticality?: Criticality) => {
  switch (criticality) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function DataFlowsPage() {
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDirection, setSelectedDirection] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch data flows from API
  useEffect(() => {
    const fetchDataFlows = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')
        const response = await contextApiService.getDataFlows()
        setDataFlows(response.data || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch data flows:', error)
        setIsLoading(false)
      }
    }

    fetchDataFlows()
  }, [])

  const filteredDataFlows = dataFlows.filter(flow => {
    const matchesSearch = !searchQuery || 
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDirection = !selectedDirection || flow.flow_direction === selectedDirection
    
    return matchesSearch && matchesDirection
  })

  const getFlowEndpoints = (flow: DataFlow) => {
    const from = flow.from_system || flow.from_vendor || 'Unknown'
    const to = flow.to_system || flow.to_vendor || 'Unknown'
    return { from, to }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Data Flows</h1>
          <p className="text-muted-foreground">
            Map and track data movement across systems and vendors
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="md"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Data Flow
        </Button>
      </div>

      {/* Filters & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Flow Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data flows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDirection} onValueChange={setSelectedDirection}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Directions</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
                <SelectItem value="bidirectional">Bidirectional</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground">{dataFlows.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                Active: <span className="font-medium text-foreground">
                  {dataFlows.filter(f => f.status === 'active').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">
                Cross-Border: <span className="font-medium text-foreground">
                  {dataFlows.filter(f => f.cross_border_transfer).length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-muted-foreground">
                Critical: <span className="font-medium text-foreground">
                  {dataFlows.filter(f => f.criticality === 'critical').length}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flows List */}
      <Card>
        <CardHeader>
          <CardTitle>Data Flows ({filteredDataFlows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading data flows...</div>
            </div>
          ) : filteredDataFlows.length === 0 ? (
            <div className="text-center py-8">
              <Network className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No data flows found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedDirection
                  ? 'Try adjusting your filters or search query.'
                  : 'Start mapping data flows between your systems and vendors.'
                }
              </p>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Flow
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDataFlows.map((flow) => {
                const endpoints = getFlowEndpoints(flow)
                return (
                  <div key={flow.id} className="border rounded-lg p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-medium text-foreground text-lg">{flow.name}</h3>
                          <Badge className={getFlowDirectionColor(flow.flow_direction)}>
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {flowDirectionLabels[flow.flow_direction]}
                          </Badge>
                          {flow.criticality && (
                            <Badge className={getCriticalityColor(flow.criticality)}>
                              {flow.criticality}
                            </Badge>
                          )}
                          {flow.cross_border_transfer && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              <Globe className="h-3 w-3 mr-1" />
                              Cross-Border
                            </Badge>
                          )}
                          {!flow.encryption_in_transit && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Unencrypted
                            </Badge>
                          )}
                        </div>
                        
                        {/* Flow Path Visualization */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{endpoints.from}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{endpoints.to}</span>
                          </div>
                        </div>
                        
                        {flow.purpose && (
                          <p className="text-sm text-foreground font-medium">{flow.purpose}</p>
                        )}
                        {flow.description && (
                          <p className="text-sm text-muted-foreground">{flow.description}</p>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {flow.frequency && (
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <p className="text-foreground font-medium">{flow.frequency}</p>
                        </div>
                      )}
                      {flow.volume_estimate && (
                        <div>
                          <span className="text-muted-foreground">Volume:</span>
                          <p className="text-foreground font-medium">{flow.volume_estimate}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Encryption:</span>
                        <p className="text-foreground font-medium">
                          {flow.encryption_in_transit ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cross-Border:</span>
                        <p className="text-foreground font-medium">
                          {flow.cross_border_transfer ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}