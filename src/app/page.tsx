import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to Privacy Overview as main landing page
  redirect('/privacy')
}
