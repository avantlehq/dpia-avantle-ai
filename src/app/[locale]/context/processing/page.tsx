'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  Scale
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
    
    const matchesBasis = !selectedBasis || activity.lawful_basis === selectedBasis
    
    return matchesSearch && matchesBasis
  })

  const isReviewOverdue = (reviewDate?: string) => {
    if (!reviewDate) return false
    return new Date(reviewDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filters & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ROPA Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
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
                <SelectItem value="">All Lawful Basis</SelectItem>
                <SelectItem value="consent">Consent</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="legal_obligation">Legal obligation</SelectItem>
                <SelectItem value="vital_interests">Vital interests</SelectItem>
                <SelectItem value="public_task">Public task</SelectItem>
                <SelectItem value="legitimate_interests">Legitimate interests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground">{activities.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                Active: <span className="font-medium text-foreground">
                  {activities.filter(a => a.status === 'active').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-muted-foreground">
                DPO Review Required: <span className="font-medium text-foreground">
                  {activities.filter(a => a.dpo_review_required).length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">
                Review Overdue: <span className="font-medium text-foreground">
                  {activities.filter(a => isReviewOverdue(a.review_date)).length}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading processing activities...</div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No processing activities found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedBasis
                  ? 'Try adjusting your filters or search query.'
                  : 'Start building your Record of Processing Activities (ROPA).'
                }
              </p>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-medium text-foreground text-lg">{activity.name}</h3>
                        <Badge className={getLawfulBasisColor(activity.lawful_basis)}>
                          <Scale className="h-3 w-3 mr-1" />
                          {lawfulBasisLabels[activity.lawful_basis]}
                        </Badge>
                        {activity.dpo_review_required && (
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            DPO Review
                          </Badge>
                        )}
                        {isReviewOverdue(activity.review_date) && (
                          <Badge variant="destructive">
                            <Calendar className="h-3 w-3 mr-1" />
                            Review Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground font-medium">{activity.purpose}</p>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
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
                    {activity.data_subject_categories && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3" />
                          Data Subjects:
                        </span>
                        <p className="text-foreground">{activity.data_subject_categories}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3" />
                        Automated Decisions:
                      </span>
                      <p className="text-foreground">{activity.automated_decision_making ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 mb-1">
                        <Users className="h-3 w-3" />
                        Profiling:
                      </span>
                      <p className="text-foreground">{activity.profiling ? 'Yes' : 'No'}</p>
                    </div>
                    {activity.review_date && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          Next Review:
                        </span>
                        <p className={`text-foreground ${isReviewOverdue(activity.review_date) ? 'text-red-600 font-medium' : ''}`}>
                          {new Date(activity.review_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {activity.lawful_basis_explanation && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-sm">Legal Basis Explanation:</span>
                      <p className="text-sm text-foreground mt-1">{activity.lawful_basis_explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}