/**
 * useJurisdictions Hook
 *
 * Fetches jurisdictions from API with caching and error handling.
 */

'use client'

import { useState, useEffect } from 'react'

interface Jurisdiction {
  id: string
  country_code: string
  name_en: string
  name_sk: string
  jurisdiction_type: 'eu_member_state' | 'eea_country' | 'third_country'
  adequacy_status: 'adequate' | 'not_adequate' | 'partially_adequate'
}

export function useJurisdictions() {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('/api/v1/context/jurisdictions?limit=100')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jurisdictions')
        return res.json()
      })
      .then((result) => {
        setJurisdictions(result.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching jurisdictions:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { jurisdictions, loading, error }
}
