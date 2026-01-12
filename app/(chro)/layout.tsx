import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { MobileMenu } from '@/components/layout/mobile-menu'

export const metadata: Metadata = {
  title: {
    default: 'CHRO Dashboard - Horizon',
    template: '%s | CHRO - Horizon',
  },
  description: 'Strategic talent insights and analytics',
}

const CHRO_NAV_LINKS = [
  { href: '/chro/dashboard', label: 'Dashboard' },
  { href: '/chro/reports', label: 'Reports' },
]

export default function CHROLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Mobile Menu for CHRO (hamburger menu instead of bottom tabs) */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <MobileMenu navLinks={CHRO_NAV_LINKS} />
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
