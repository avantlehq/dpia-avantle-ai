'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  Mail,
  ExternalLink,
  FileText,
  AlertTriangle
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

type VendorRole = 'processor' | 'joint_controller' | 'recipient' | 'sub_processor'

type Vendor = {
  id: string
  name: string
  description?: string
  website?: string
  contact_email?: string
  primary_contact?: string
  status: 'active' | 'inactive'
  vendor_role: VendorRole
  has_dpa: boolean
  dpa_expires?: string
  location?: string
  created_at: string
}

const vendorRoleLabels: Record<VendorRole, string> = {
  processor: 'Processor',
  joint_controller: 'Joint Controller',
  recipient: 'Recipient',
  sub_processor: 'Sub-processor'
}

const getVendorRoleColor = (role: VendorRole) => {
  switch (role) {
    case 'processor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'joint_controller': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'recipient': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'sub_processor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { contextApiService } = await import('@/lib/context-api-service')
        const response = await contextApiService.getVendors()
        setVendors(response.data || [])
      } catch (error) {
        console.error('Failed to fetch vendors:', error)
        setVendors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchQuery || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = !selectedRole || selectedRole === 'all' || vendor.vendor_role === selectedRole
    
    return matchesSearch && matchesRole
  })

  const isDpaExpiringSoon = (dpaExpires?: string) => {
    if (!dpaExpires) return false
    const expiryDate = new Date(dpaExpires)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate < threeMonthsFromNow
  }

  const isDpaExpired = (dpaExpires?: string) => {
    if (!dpaExpires) return false
    return new Date(dpaExpires) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Vendors & Processors</h1>
          <p className="text-muted-foreground">
            Manage third-party data processors, vendors, and DPA agreements
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="md"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Filters & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Vendor Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="processor">Processor</SelectItem>
                <SelectItem value="joint_controller">Joint Controller</SelectItem>
                <SelectItem value="recipient">Recipient</SelectItem>
                <SelectItem value="sub_processor">Sub-processor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground">{vendors.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                With DPA: <span className="font-medium text-foreground">
                  {vendors.filter(v => v.has_dpa).length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-muted-foreground">
                DPA Expiring Soon: <span className="font-medium text-foreground">
                  {vendors.filter(v => isDpaExpiringSoon(v.dpa_expires)).length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">
                No DPA: <span className="font-medium text-foreground">
                  {vendors.filter(v => !v.has_dpa).length}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors List */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading vendors...</div>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedRole
                  ? 'Try adjusting your filters or search query.'
                  : 'Start by adding your first vendor or data processor.'
                }
              </p>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Vendor
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="border rounded-lg p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-medium text-foreground text-lg">{vendor.name}</h3>
                        <Badge className={getVendorRoleColor(vendor.vendor_role)}>
                          <Users className="h-3 w-3 mr-1" />
                          {vendorRoleLabels[vendor.vendor_role]}
                        </Badge>
                        {vendor.has_dpa ? (
                          isDpaExpired(vendor.dpa_expires) ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              DPA Expired
                            </Badge>
                          ) : isDpaExpiringSoon(vendor.dpa_expires) ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              DPA Expiring Soon
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <FileText className="h-3 w-3 mr-1" />
                              DPA Active
                            </Badge>
                          )
                        ) : (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            No DPA
                          </Badge>
                        )}
                      </div>
                      {vendor.description && (
                        <p className="text-sm text-muted-foreground">{vendor.description}</p>
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
                    {vendor.contact_email && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3" />
                          Contact:
                        </span>
                        <p className="text-foreground">{vendor.contact_email}</p>
                      </div>
                    )}
                    {vendor.primary_contact && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3" />
                          Primary Contact:
                        </span>
                        <p className="text-foreground">{vendor.primary_contact}</p>
                      </div>
                    )}
                    {vendor.location && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Building className="h-3 w-3" />
                          Location:
                        </span>
                        <p className="text-foreground">{vendor.location}</p>
                      </div>
                    )}
                    {vendor.dpa_expires && (
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1 mb-1">
                          <FileText className="h-3 w-3" />
                          DPA Expires:
                        </span>
                        <p className={`text-foreground ${
                          isDpaExpired(vendor.dpa_expires) || isDpaExpiringSoon(vendor.dpa_expires)
                            ? 'text-red-600 font-medium' 
                            : ''
                        }`}>
                          {new Date(vendor.dpa_expires).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {vendor.website && (
                    <div className="pt-2 border-t">
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {vendor.website}
                      </a>
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