import { redirect } from 'next/navigation'

export default function DashboardRedirect() {
  // Redirect to locale-based dashboard
  redirect('/en/dashboard')
}