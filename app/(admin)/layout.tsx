import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { SystemHealthBar } from '@/components/admin/system-health-bar'

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard - Horizon',
    template: '%s | Admin - Horizon',
  },
  description: 'Platform administration and monitoring',
}

const ADMIN_NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/companies', label: 'Companies' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/sync', label: 'Sync' },
  { href: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Mobile Menu for Admin */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <MobileMenu navLinks={ADMIN_NAV_LINKS} />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-6 py-8 md:px-8">
          {/* System Health Bar */}
          <SystemHealthBar />

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  )
}
