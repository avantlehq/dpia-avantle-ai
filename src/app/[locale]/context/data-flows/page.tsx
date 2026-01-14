'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowRight,
  Plus,
  Search,
  Edit,
  Trash2,
  Globe,
  AlertTriangle,
  Network,
  Shield
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
import { DeleteDataFlowDialog } from '@/components/context/DeleteDataFlowDialog'

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
  const params = useParams()
  const locale = params?.locale as string || 'en'
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDirection, setSelectedDirection] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Delete dialog states only
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [flowToDelete, setFlowToDelete] = useState<{id: string; name: string} | null>(null)
  
  // Fetch data flows from API
  const fetchDataFlows = async () => {
    try {
      setIsLoading(true)
      const { contextApiService } = await import('@/lib/context-api-service')
      const response = await contextApiService.getDataFlows()
      setDataFlows(response.data || [])
    } catch (error) {
      console.error('Failed to fetch data flows:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDataFlows()
  }, [])

  // Delete handlers only
  const handleDelete = (flow: DataFlow) => {
    setFlowToDelete({ id: flow.id, name: flow.name })
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false)
    setFlowToDelete(null)
  }

  const handleDeleteSuccess = () => {
    fetchDataFlows()
    handleDeleteDialogClose()
  }

  const filteredDataFlows = dataFlows.filter(flow => {
    const matchesSearch = !searchQuery || 
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDirection = !selectedDirection || selectedDirection === 'all' || flow.flow_direction === selectedDirection
    
    return matchesSearch && matchesDirection
  })

  const getFlowEndpoints = (flow: DataFlow) => {
    const from = flow.from_system || flow.from_vendor || 'Unknown'
    const to = flow.to_system || flow.to_vendor || 'Unknown'
    return { from, to }
  }

  return (
    <div className="space-y-6">
      {/* Header - matching assessments style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Data Flows</h1>
          <p className="text-muted-foreground">
            Map and track data movement across systems and vendors
          </p>
        </div>
        
        <Link href={`/${locale}/context/data-flows/new`}>
          <Button
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Data Flow
          </Button>
        </Link>
      </div>

      {/* Data Flows Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          Data Flows Overview
        </h2>
        
        {/* Status Pills Group - matching assessments style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Active Flows Pill */}
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
              Active Flows
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {dataFlows.filter(f => f.status === 'active').length}
            </span>
          </div>

          {/* Cross-Border Transfers Pill */}
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
              Cross-Border Transfers
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {dataFlows.filter(f => f.cross_border_transfer).length}
            </span>
          </div>

          {/* Critical Flows Pill */}
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
              Critical Flows
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {dataFlows.filter(f => f.criticality === 'critical').length}
            </span>
          </div>

          {/* Encrypted Flows Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #3b82f6',
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
              Encrypted Flows
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {dataFlows.filter(f => f.encryption_in_transit).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters - streamlined without card wrapper */}
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
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
            <SelectItem value="bidirectional">Bidirectional</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Increased Spacing Before Data Flows */}
      <div className="mt-12"></div>

      {/* Data Flows Table - matching assessments structure */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Flows ({filteredDataFlows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading data flows...</p>
              </div>
            </div>
          ) : filteredDataFlows.length === 0 ? (
            <div className="text-center py-12">
              <Network className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || selectedDirection ? 'No data flows found' : 'Ready to map data flows'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || selectedDirection
                  ? 'Try adjusting your filters or search query.'
                  : 'Start mapping data flows between your systems and vendors for better data governance.'
                }
              </p>
              <Link href={`/${locale}/context/data-flows/new`}>
                <Button variant="primary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Flow
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
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Direction
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        From → To
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Criticality
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Security
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataFlows.map((flow) => {
                      const endpoints = getFlowEndpoints(flow)
                      return (
                        <tr key={flow.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="font-medium text-foreground">{flow.name}</div>
                              {flow.description && (
                                <div className="text-sm text-muted-foreground">{flow.description}</div>
                              )}
                              {flow.purpose && (
                                <div className="text-xs text-muted-foreground">Purpose: {flow.purpose}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getFlowDirectionColor(flow.flow_direction)}>
                              <ArrowRight className="h-3 w-3 mr-1" />
                              {flowDirectionLabels[flow.flow_direction]}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-foreground font-medium">{endpoints.from}</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="text-foreground font-medium">{endpoints.to}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {flow.criticality ? (
                              <Badge className={getCriticalityColor(flow.criticality)}>
                                {flow.criticality}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              {flow.encryption_in_transit ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Encrypted
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Unencrypted
                                </Badge>
                              )}
                              {flow.cross_border_transfer && (
                                <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Cross-Border
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/${locale}/context/data-flows/${flow.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(flow)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredDataFlows.length} data flows
                </p>
                <Link href={`/${locale}/context/data-flows/new`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <DeleteDataFlowDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onSuccess={handleDeleteSuccess}
        flowId={flowToDelete?.id || null}
        flowName={flowToDelete?.name || null}
      />
    </div>
  )
}