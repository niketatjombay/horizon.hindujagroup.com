import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { MobileMenu } from '@/components/layout/mobile-menu'

export const metadata: Metadata = {
  title: {
    default: 'HR Dashboard - Horizon',
    template: '%s | HR - Horizon',
  },
  description: 'Manage applicants and job postings',
}

const HR_NAV_LINKS = [
  { href: '/hr/dashboard', label: 'Dashboard' },
  { href: '/hr/jobs', label: 'Jobs' },
  { href: '/hr/applicants', label: 'Applicants' },
]

export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Mobile Menu for HR (hamburger menu instead of bottom tabs) */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <MobileMenu navLinks={HR_NAV_LINKS} />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        <div className="container mx-auto max-w-7xl px-5 py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
