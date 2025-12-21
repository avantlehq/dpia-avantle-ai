// Future-proof DPIA Assessments routing: /privacy/dpia/assessments
// This redirects to existing /assessments route for backward compatibility

import { redirect } from 'next/navigation'

export default function DPIAAssessmentsPage() {
  // Redirect to existing assessments route
  redirect('/assessments')
}