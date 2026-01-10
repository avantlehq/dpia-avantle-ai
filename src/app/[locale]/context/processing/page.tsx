'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  Scale,
  FileText
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

type LawfulBasis = 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'

type ProcessingActivity = {
  id: string
  name: string
  description?: string
  purpose: string
  lawful_basis: LawfulBasis
  lawful_basis_explanation?: string
  data_subject_categories?: string
  automated_decision_making: boolean
  profiling: boolean
  status: 'active' | 'inactive'
  review_date?: string
  last_review_date?: string
  dpo_review_required: boolean
  created_at: string
}

const lawfulBasisLabels: Record<LawfulBasis, string> = {
  consent: 'Consent',
  contract: 'Contract',
  legal_obligation: 'Legal obligation',
  vital_interests: 'Vital interests',
  public_task: 'Public task',
  legitimate_interests: 'Legitimate interests'
}

const getLawfulBasisColor = (basis: LawfulBasis) => {
  switch (basis) {
    case 'consent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'contract': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'legal_obligation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'vital_interests': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'public_task': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'legitimate_interests': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function ProcessingPage() {
  const [activities, setActivities] = useState<ProcessingActivity[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBasis, setSelectedBasis] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch processing activities from API
  useEffect(() => {
    const fetchProcessingActivities = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')
        const response = await contextApiService.getProcessingActivities()
        setActivities(response.data || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch processing activities:', error)
        setIsLoading(false)
      }
    }

    fetchProcessingActivities()
  }, [])

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchQuery || 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBasis = !selectedBasis || selectedBasis === 'all' || activity.lawful_basis === selectedBasis
    
    return matchesSearch && matchesBasis
  })

  const isReviewOverdue = (reviewDate?: string) => {
    if (!reviewDate) return false
    return new Date(reviewDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header - matching assessments style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Processing Activities</h1>
          <p className="text-muted-foreground">
            Record of Processing Activities (ROPA) - GDPR Article 30 compliance
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="md"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Processing Activity
        </Button>
      </div>

      {/* Processing Activities Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          Processing Activities Overview
        </h2>
        
        {/* Status Pills Group - matching assessments style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Active Activities Pill */}
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
              Active Activities
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {activities.filter(a => a.status === 'active').length}
            </span>
          </div>

          {/* DPO Review Required Pill */}
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
              DPO Review Required
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {activities.filter(a => a.dpo_review_required).length}
            </span>
          </div>

          {/* Review Overdue Pill */}
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
              Review Overdue
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {activities.filter(a => isReviewOverdue(a.review_date)).length}
            </span>
          </div>

          {/* Inactive Activities Pill */}
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
              Inactive Activities
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {activities.filter(a => a.status === 'inactive').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters - streamlined without card wrapper */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search processing activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedBasis} onValueChange={setSelectedBasis}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by lawful basis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lawful Basis</SelectItem>
            <SelectItem value="consent">Consent</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="legal_obligation">Legal obligation</SelectItem>
            <SelectItem value="vital_interests">Vital interests</SelectItem>
            <SelectItem value="public_task">Public task</SelectItem>
            <SelectItem value="legitimate_interests">Legitimate interests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Increased Spacing Before Processing Activities */}
      <div className="mt-12"></div>

      {/* Processing Activities Table - matching assessments structure */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Processing Activities ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading processing activities...</p>
              </div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || selectedBasis ? 'No processing activities found' : 'Ready to build your ROPA'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || selectedBasis
                  ? 'Try adjusting your filters or search query.'
                  : 'Start building your Record of Processing Activities (ROPA) for GDPR Article 30 compliance.'
                }
              </p>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Activity
              </Button>
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
                        Purpose
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Lawful Basis
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Review Status
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">{activity.name}</div>
                            {activity.description && (
                              <div className="text-sm text-muted-foreground">{activity.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground max-w-xs">
                            {activity.purpose}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getLawfulBasisColor(activity.lawful_basis)}>
                            <Scale className="h-3 w-3 mr-1" />
                            {lawfulBasisLabels[activity.lawful_basis]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={activity.status === 'active' ? 'default' : 'outline'}
                            className={activity.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }
                          >
                            {activity.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            {activity.dpo_review_required && (
                              <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                DPO Review
                              </Badge>
                            )}
                            {isReviewOverdue(activity.review_date) && (
                              <Badge variant="destructive" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {!activity.dpo_review_required && !isReviewOverdue(activity.review_date) && (
                              <span className="text-muted-foreground text-sm">Up to date</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
                  Showing {filteredActivities.length} processing activities
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}