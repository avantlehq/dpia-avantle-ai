'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export function RefreshButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-300 hover:border-gray-400 transform hover:scale-102 transition-all duration-300 px-4 py-2 font-semibold rounded-lg cursor-pointer"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#9ca3af',
        borderRadius: '8px',
        color: '#4b5563',
        fontSize: '14px',
        fontWeight: '600'
      }}
    >
      <RefreshCw className="mr-2 h-3 w-3" />
      Refresh
    </Button>
  )
}