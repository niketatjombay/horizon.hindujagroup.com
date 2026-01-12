'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, FileText, Bookmark, User } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const EMPLOYEE_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/applications', label: 'Applications', icon: FileText },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { isAuthenticated, isEmployee } = useAuth()

  // Only show mobile nav for authenticated employees
  if (!isAuthenticated || !isEmployee) return null

  // Don't show on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/forgot-password')) {
    return null
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-300 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex h-14 items-center justify-around">
        {EMPLOYEE_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <Icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? 'text-primary' : 'text-gray-600'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
