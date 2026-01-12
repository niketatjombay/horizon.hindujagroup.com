'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Users, BarChart3, Shield, ChevronRight, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface RoleOption {
  role: UserRole
  label: string
  description: string
  icon: React.ReactNode
  redirectTo: string
  username: string
  password: string
  color: {
    bg: string
    bgActive: string
    text: string
  }
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'employee',
    label: 'Employee',
    description: 'Browse jobs, apply, and track applications',
    icon: <User className="h-5 w-5" />,
    redirectTo: '/dashboard',
    username: 'employee@hinduja.com',
    password: 'employee123',
    color: {
      bg: 'bg-primary-light',
      bgActive: 'bg-primary',
      text: 'text-primary',
    },
  },
  {
    role: 'hr',
    label: 'HR Manager',
    description: 'Post jobs and manage applicants',
    icon: <Users className="h-5 w-5" />,
    redirectTo: '/hr/dashboard',
    username: 'hr@hinduja.com',
    password: 'hr123',
    color: {
      bg: 'bg-secondary-light',
      bgActive: 'bg-secondary',
      text: 'text-secondary',
    },
  },
  {
    role: 'chro',
    label: 'CHRO',
    description: 'View reports and analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    redirectTo: '/chro/dashboard',
    username: 'chro@hinduja.com',
    password: 'chro123',
    color: {
      bg: 'bg-success-light',
      bgActive: 'bg-success',
      text: 'text-success',
    },
  },
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full system access',
    icon: <Shield className="h-5 w-5" />,
    redirectTo: '/admin/dashboard',
    username: 'admin@hinduja.com',
    password: 'admin123',
    color: {
      bg: 'bg-warning-light',
      bgActive: 'bg-warning',
      text: 'text-warning',
    },
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-gray-100 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-gray-400" />
      )}
    </button>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState<UserRole | null>(null)
  const [expandedRole, setExpandedRole] = useState<UserRole | null>(null)

  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleLogin = async (roleOption: RoleOption) => {
    setIsLoading(roleOption.role)

    await login(roleOption.username, roleOption.password)
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (roleOption.role === 'employee' && redirectTo.startsWith('/')) {
      router.push(redirectTo)
    } else {
      router.push(roleOption.redirectTo)
    }

    router.refresh()
  }

  const handleRowClick = (role: UserRole) => {
    setExpandedRole(expandedRole === role ? null : role)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Choose an account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              to continue to Horizon
            </p>
          </div>

          {/* Role List */}
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
            {ROLE_OPTIONS.map((option) => {
              const isExpanded = expandedRole === option.role
              const isLoadingThis = isLoading === option.role

              return (
                <div key={option.role}>
                  {/* Role Row */}
                  <button
                    onClick={() => handleRowClick(option.role)}
                    disabled={isLoading !== null}
                    className={cn(
                      'w-full flex items-center gap-4 px-4 py-4 text-left transition-colors',
                      'hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
                      isExpanded && 'bg-gray-50',
                      isLoading !== null && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors',
                        isExpanded
                          ? `${option.color.bgActive} text-white`
                          : `${option.color.bg} ${option.color.text}`
                      )}
                    >
                      {option.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {option.username}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronRight
                      className={cn(
                        'h-5 w-5 text-gray-400 transition-transform shrink-0',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  </button>

                  {/* Expanded Content */}
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200 ease-in-out',
                      isExpanded ? 'max-h-48' : 'max-h-0'
                    )}
                  >
                    <div className="px-4 pb-4 pt-1 bg-gray-50">
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4">
                        {option.description}
                      </p>

                      {/* Credentials (muted) */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <span>Password:</span>
                          <code className="font-mono">{option.password}</code>
                          <CopyButton text={option.password} />
                        </div>
                      </div>

                      {/* Login Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLogin(option)
                        }}
                        disabled={isLoading !== null}
                        className="w-full"
                        size="md"
                      >
                        {isLoadingThis ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                            Signing in...
                          </>
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Demo environment with mock data
          </p>
        </div>
      </div>
    </>
  )
}

function LoginPageFallback() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-7 w-48 bg-gray-100 animate-pulse rounded mx-auto" />
            <div className="mt-2 h-4 w-32 bg-gray-100 animate-pulse rounded mx-auto" />
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mb-2" />
                  <div className="h-3 w-36 bg-gray-100 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
