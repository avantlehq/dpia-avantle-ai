'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  Search,
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
import { Pagination } from '@/components/ui/pagination'
import { DeleteVendorDialog } from '@/components/context/DeleteVendorDialog'
import { ContextTableActions } from '@/components/context/ContextTableActions'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

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
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('context.pages.vendors')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Delete dialog state only (modal-to-page refactoring complete)
  const [deleteVendor, setDeleteVendor] = useState<{ id: string; name: string } | null>(null)

  // Fetch vendors from API
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

  useEffect(() => {
    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchQuery ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = !selectedRole || selectedRole === 'all' || vendor.vendor_role === selectedRole

    return matchesSearch && matchesRole
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedRole])

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

  const handleDeleteVendor = (vendor: Vendor) => {
    setDeleteVendor({ id: vendor.id, name: vendor.name })
  }

  const handleDeleteSuccess = async () => {
    await fetchVendors() // Refresh the list
  }

  const handleCloseDeleteDialog = () => {
    setDeleteVendor(null)
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

        <Link href={`/${locale}/context/vendors/new`}>
          <Button
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addVendor')}
          </Button>
        </Link>
      </div>

      {/* Vendors Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          {t('overviewTitle')}
        </h2>
        
        {/* Status Pills Group - matching assessments style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Active Vendors Pill */}
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
              {t('activeVendors')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {vendors.filter(v => v.status === 'active').length}
            </span>
          </div>

          {/* Missing DPAs Pill */}
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
              {t('needingDpaRenewal')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {vendors.filter(v => !v.has_dpa).length}
            </span>
          </div>

          {/* DPA Expiring Soon Pill */}
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
              {t('processors')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {vendors.filter(v => isDpaExpiringSoon(v.dpa_expires)).length}
            </span>
          </div>

          {/* Inactive Vendors Pill */}
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
              {t('inactiveVendors')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {vendors.filter(v => v.status === 'inactive').length}
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

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder={t('filterByRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allRoles')}</SelectItem>
            <SelectItem value="processor">Processor</SelectItem>
            <SelectItem value="joint_controller">Joint Controller</SelectItem>
            <SelectItem value="recipient">Recipient</SelectItem>
            <SelectItem value="sub_processor">Sub-processor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Increased Spacing Before Vendors */}
      <div className="mt-12"></div>

      {/* Vendors Table - matching assessments structure */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vendors & Processors ({filteredVendors.length})
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
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || selectedRole ? t('noVendorsFound') : t('readyToManage')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || selectedRole
                  ? t('adjustFilters')
                  : t('noVendorsDescription')
                }
              </p>
              <Link href={`/${locale}/context/vendors/new`}>
                <Button variant="primary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('addFirstVendor')}
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
                        {t('tableHeaderRole')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderDpa')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderLocation')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Contact
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        {t('tableHeaderActions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Link
                            href={`/${locale}/context/vendors/${vendor.id}`}
                            className="block space-y-1 group"
                          >
                            <div className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                              {vendor.name}
                            </div>
                            {vendor.description && (
                              <div className="text-sm text-muted-foreground">{vendor.description}</div>
                            )}
                            {vendor.website && (
                              <span className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                Website
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getVendorRoleColor(vendor.vendor_role)}>
                            <Users className="h-3 w-3 mr-1" />
                            {vendorRoleLabels[vendor.vendor_role]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {vendor.has_dpa ? (
                            isDpaExpired(vendor.dpa_expires) ? (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {t('dpaExpired')}
                              </Badge>
                            ) : isDpaExpiringSoon(vendor.dpa_expires) ? (
                              <Badge variant="outline" className="text-amber-600 border-amber-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {t('dpaExpiresSoon')}
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <FileText className="h-3 w-3 mr-1" />
                                {t('dpaActive')}
                              </Badge>
                            )
                          ) : (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {t('dpaMissing')}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {vendor.location || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {vendor.contact_email && (
                              <div className="text-sm text-foreground">
                                <Mail className="h-3 w-3 inline mr-1" />
                                {vendor.contact_email}
                              </div>
                            )}
                            {vendor.primary_contact && (
                              <div className="text-sm text-muted-foreground">
                                {vendor.primary_contact}
                              </div>
                            )}
                            {!vendor.contact_email && !vendor.primary_contact && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <ContextTableActions
                            itemId={vendor.id}
                            itemName={vendor.name}
                            module="vendors"
                            onDelete={() => handleDeleteVendor(vendor)}
                            editLabel={t('editVendor')}
                            deleteLabel={t('deleteVendor')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {t('showingVendors', { count: filteredVendors.length })}
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog (lightweight modal for confirmations is acceptable) */}
      {deleteVendor && (
        <DeleteVendorDialog
          isOpen={Boolean(deleteVendor)}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDeleteSuccess}
          vendorId={deleteVendor.id}
          vendorName={deleteVendor.name}
        />
      )}
    </div>
  )
}