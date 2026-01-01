// Force dynamic rendering to avoid SSR issues with context module pages
export const dynamic = 'force-dynamic'

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}