'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Bell, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { ProfileMenu } from './profile-menu'
import { NavigationLinks } from './navigation-links'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, isEmployee, isHR, isCHRO } = useAuth()

  // Don't show header on login page
  const isLoginPage = pathname?.startsWith('/login')

  return (
    <header className="sticky top-0 z-50 bg-gray-900 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3">
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

        {/* Desktop Navigation - Only for authenticated users */}
        {isAuthenticated && !isLoginPage && (
          <nav className="hidden lg:flex items-center gap-2">
            <NavigationLinks />
          </nav>
        )}

        {/* Search Bar (Employee only, Desktop) */}
        {isAuthenticated && isEmployee && !isLoginPage && (
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-10 rounded-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:bg-gray-700 focus-visible:border-primary"
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && !isLoginPage ? (
            <>
              {/* Notification Bell (HR/CHRO only) */}
              {(isHR || isCHRO) && (
                <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <Bell className="h-5 w-5 text-gray-300" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                </button>
              )}

              {/* Profile Menu */}
              <ProfileMenu />
            </>
          ) : !isLoginPage ? (
            /* Login Button for non-authenticated users */
            <Link href="/login">
              <Button variant="secondary" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
