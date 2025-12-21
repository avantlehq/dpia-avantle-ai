// Future-proof DPIA Pre-check routing: /privacy/dpia/precheck
// This redirects to existing /precheck route for backward compatibility

import { redirect } from 'next/navigation'

export default function DPIAPreCheckPage() {
  // Redirect to existing precheck route
  redirect('/precheck')
}