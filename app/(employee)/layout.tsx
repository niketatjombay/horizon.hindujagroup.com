import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'

export const metadata: Metadata = {
  title: {
    default: 'Horizon - Find Your Next Opportunity',
    template: '%s | Horizon',
  },
  description: 'Explore internal job opportunities across the Hinduja Group',
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with search bar */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 pb-14 md:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Navigation (Employee only) */}
      <MobileNav />
    </div>
  )
}
