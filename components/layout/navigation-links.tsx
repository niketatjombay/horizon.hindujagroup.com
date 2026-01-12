'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface NavLink {
  href: string
  label: string
  roles: UserRole[]
}

const NAV_LINKS: NavLink[] = [
  // Employee routes
  { href: '/dashboard', label: 'Dashboard', roles: ['employee'] },
  { href: '/jobs', label: 'Jobs', roles: ['employee', 'hr'] },
  { href: '/applications', label: 'Applications', roles: ['employee'] },
  { href: '/saved', label: 'Saved', roles: ['employee'] },
  // HR routes
  { href: '/hr/dashboard', label: 'Dashboard', roles: ['hr'] },
  { href: '/applicants', label: 'Applicants', roles: ['hr'] },
  // CHRO routes
  { href: '/chro/dashboard', label: 'Dashboard', roles: ['chro'] },
  { href: '/chro/reports', label: 'Reports', roles: ['chro'] },
  // Admin routes
  { href: '/admin/dashboard', label: 'Dashboard', roles: ['admin'] },
  { href: '/admin/companies', label: 'Companies', roles: ['admin'] },
  { href: '/admin/users', label: 'Users', roles: ['admin'] },
  { href: '/admin/sync', label: 'Sync', roles: ['admin'] },
]

export function NavigationLinks() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  // Filter links based on user role
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(user.role)
  )

  return (
    <>
      {visibleLinks.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'relative px-4 py-3 text-base font-medium transition-colors',
              isActive
                ? 'text-primary'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {link.label}
            {/* Active indicator - orange underline */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Link>
        )
      })}
    </>
  )
}
