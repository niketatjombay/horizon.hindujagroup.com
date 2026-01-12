'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import { ProfileMenu } from './profile-menu'

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Don't show header on login page
  const isLoginPage = pathname?.startsWith('/login')

  return (
    <header className="sticky top-0 z-50 bg-gray-900 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href={isAuthenticated ? '/jobs' : '/'} className="flex items-center gap-3">
          {/* Jombay Logo */}
          <div className="relative h-8 w-auto">
            <Image
              src="/logo.png"
              alt="Jombay"
              width={100}
              height={32}
              className="h-8 w-auto object-contain brightness-0 invert"
              priority
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-gray-600" />

          {/* Hinduja Logo */}
          <div className="hidden sm:block relative h-8 w-auto">
            <Image
              src="/hinduja_logo.svg"
              alt="Hinduja Group"
              width={80}
              height={32}
              className="h-8 w-auto object-contain brightness-0 invert"
              priority
            />
          </div>

          {/* App Name */}
          <div className="hidden md:block ml-2">
            <span className="text-lg font-bold text-white">Horizon</span>
            <span className="hidden lg:inline text-sm text-gray-400 ml-2">
              Internal Job Portal
            </span>
          </div>
        </Link>

        {/* Right Section - Profile Menu */}
        {isAuthenticated && !isLoginPage && (
          <ProfileMenu />
        )}
      </div>
    </header>
  )
}
