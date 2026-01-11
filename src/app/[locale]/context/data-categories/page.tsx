'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Folder,
  Shield,
  CheckCircle
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
import { DataCategoryModal } from '@/components/context/DataCategoryModal'
import { DeleteDataCategoryDialog } from '@/components/context/DeleteDataCategoryDialog'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

type DataCategory = {
  id: string
  name: string
  description?: string
  category_type: 'personal' | 'special' | 'criminal' | 'anonymous'
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  special_category_basis?: 'explicit_consent' | 'employment' | 'vital_interests' | 'public_interest' | 'healthcare' | 'research' | 'legal_claims'
  is_standard: boolean
  parent_id?: string
  parent?: { name: string }
  children?: DataCategory[]
  status: 'active' | 'inactive'
  created_at: string
}

const categoryTypeLabels = {
  personal: 'Personal Data',
  special: 'Special Category',
  criminal: 'Criminal Data',
  anonymous: 'Anonymous'
}

const sensitivityLabels = {
  public: 'Public',
  internal: 'Internal',
  confidential: 'Confidential',
  restricted: 'Restricted'
}

const getCategoryTypeColor = (type: DataCategory['category_type']) => {
  switch (type) {
    case 'personal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'special': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'criminal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'anonymous': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const getSensitivityColor = (sensitivity: DataCategory['sensitivity']) => {
  switch (sensitivity) {
    case 'public': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'internal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'confidential': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'restricted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function DataCategoriesPage() {
  const [categories, setCategories] = useState<DataCategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedSensitivity, setSelectedSensitivity] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<DataCategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<{ id: string; name: string } | null>(null)
  
  // Fetch data categories from API
  const fetchDataCategories = async () => {
    try {
      const { contextApiService } = await import('@/lib/context-api-service')
      const response = await contextApiService.getDataCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch data categories:', error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDataCategories()
  }, [])

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchQuery || 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = !selectedType || selectedType === 'all' || 
      category.category_type === selectedType
      
    const matchesSensitivity = !selectedSensitivity || selectedSensitivity === 'all' || 
      category.sensitivity === selectedSensitivity
    
    return matchesSearch && matchesType && matchesSensitivity
  })

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: DataCategory) => {
    setEditingCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = (category: DataCategory) => {
    setDeleteCategory({ id: category.id, name: category.name })
  }

  const handleModalSuccess = () => {
    fetchDataCategories() // Refresh the list
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* Header - matching assessments style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Data Categories</h1>
          <p className="text-muted-foreground">
            Personal data classification and categorization for GDPR Article 6 & 9 compliance
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="md"
          className="gap-2"
          onClick={handleAddCategory}
        >
          <Plus className="h-4 w-4" />
          Add Data Category
        </Button>
      </div>

      {/* Data Categories Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          Data Categories Overview
        </h2>
        
        {/* Status Pills Group - matching assessments style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Active Categories Pill */}
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
              Active Categories
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {categories.filter(c => c.status === 'active').length}
            </span>
          </div>

          {/* Special Categories Pill */}
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
              Special Categories
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {categories.filter(c => c.category_type === 'special').length}
            </span>
          </div>

          {/* High Sensitivity Pill */}
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
              High Sensitivity
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {categories.filter(c => c.sensitivity === 'confidential' || c.sensitivity === 'restricted').length}
            </span>
          </div>

          {/* Nested Categories Pill */}
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
              Nested Categories
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {categories.filter(c => c.parent_id).length}
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
            placeholder="Search data categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Category Type Filter */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="personal">Personal Data</SelectItem>
            <SelectItem value="special">Special Category</SelectItem>
            <SelectItem value="criminal">Criminal Data</SelectItem>
            <SelectItem value="anonymous">Anonymous</SelectItem>
          </SelectContent>
        </Select>

        {/* Sensitivity Filter */}
        <Select value={selectedSensitivity} onValueChange={setSelectedSensitivity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by sensitivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sensitivity</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="confidential">Confidential</SelectItem>
            <SelectItem value="restricted">Restricted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Increased Spacing Before Data Categories */}
      <div className="mt-12"></div>

      {/* Data Categories Table - matching assessments structure */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Categories ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading data categories...</p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || selectedType || selectedSensitivity ? 'No data categories found' : 'Ready to classify your data'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || selectedType || selectedSensitivity
                  ? 'Try adjusting your filters or search query.'
                  : 'Start building your data classification system for GDPR Article 6 & 9 compliance.'
                }
              </p>
              <Button variant="primary" className="gap-2" onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
                Add First Category
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
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Sensitivity
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Parent
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Standard
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground flex items-center gap-2">
                              {category.parent_id && <span className="text-muted-foreground">└</span>}
                              {category.name}
                              {category.category_type === 'special' && (
                                <Shield className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground">{category.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getCategoryTypeColor(category.category_type)}>
                            {categoryTypeLabels[category.category_type]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getSensitivityColor(category.sensitivity)}>
                            {sensitivityLabels[category.sensitivity]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {category.parent?.name || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {category.is_standard ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-muted-foreground text-sm">Custom</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              title="Edit category"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
                              title="Delete category"
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
                  Showing {filteredCategories.length} data categories
                </p>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddCategory}>
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DataCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSuccess={handleModalSuccess}
        categoryId={editingCategory?.id}
        initialData={editingCategory || undefined}
      />

      {deleteCategory && (
        <DeleteDataCategoryDialog
          isOpen={Boolean(deleteCategory)}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleModalSuccess}
          categoryId={deleteCategory.id}
          categoryName={deleteCategory.name}
        />
      )}
    </div>
  )
}