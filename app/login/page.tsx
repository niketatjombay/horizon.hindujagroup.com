'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Users, BarChart3, Shield, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/lib/hooks'
import type { UserRole } from '@/types'

interface RoleOption {
  role: UserRole
  label: string
  description: string
  icon: React.ReactNode
  redirectTo: string
  username: string
  password: string
  features: string[]
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'employee',
    label: 'Employee',
    description: 'Browse jobs, apply, and track applications',
    icon: <User className="h-6 w-6" />,
    redirectTo: '/dashboard',
    username: 'employee@hinduja.com',
    password: 'employee123',
    features: ['Browse internal job postings', 'Apply to jobs', 'Track application status', 'Save favorite jobs'],
  },
  {
    role: 'hr',
    label: 'HR Manager',
    description: 'Post jobs and manage applicants',
    icon: <Users className="h-6 w-6" />,
    redirectTo: '/hr/dashboard',
    username: 'hr@hinduja.com',
    password: 'hr123',
    features: ['Post new job openings', 'Review applications', 'Update application status', 'View hiring metrics'],
  },
  {
    role: 'chro',
    label: 'CHRO',
    description: 'View reports and analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    redirectTo: '/chro/dashboard',
    username: 'chro@hinduja.com',
    password: 'chro123',
    features: ['Group-wide analytics dashboard', 'Detailed reports & exports', 'Talent flow analysis', 'Company comparisons'],
  },
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full system access',
    icon: <Shield className="h-6 w-6" />,
    redirectTo: '/admin/dashboard',
    username: 'admin@hinduja.com',
    password: 'admin123',
    features: ['User management', 'Company management', 'System settings', 'Data sync controls'],
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
      className="p-1 rounded hover:bg-gray-200 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3 text-gray-400" />
      )}
    </button>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState<UserRole | null>(null)
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)

  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleLogin = async (roleOption: RoleOption) => {
    setIsLoading(roleOption.role)

    // Use auth store login which updates state and sets cookies
    await login(roleOption.username, roleOption.password)

    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Redirect to the appropriate dashboard or the redirect URL
    if (roleOption.role === 'employee' && redirectTo.startsWith('/')) {
      router.push(redirectTo)
    } else {
      router.push(roleOption.redirectTo)
    }

    router.refresh()
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Horizon
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Internal Job Portal for Hinduja Group - Select a role below to explore the application.
            This is a demo environment with mock data.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {ROLE_OPTIONS.map((option) => (
            <Card
              key={option.role}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedRole?.role === option.role
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole(option)}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                  selectedRole?.role === option.role
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {option.description}
                  </p>

                  {/* Credentials */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Test Credentials
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Username:</span>
                        <div className="flex items-center gap-1">
                          <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                            {option.username}
                          </code>
                          <CopyButton text={option.username} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Password:</span>
                        <div className="flex items-center gap-1">
                          <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                            {option.password}
                          </code>
                          <CopyButton text={option.password} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Key Features:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <Button
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLogin(option)
                }}
                disabled={isLoading !== null}
              >
                {isLoading === option.role ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Logging in...
                  </>
                ) : (
                  `Login as ${option.label}`
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Quick Login Buttons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Quick Login
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {ROLE_OPTIONS.map((option) => (
              <Button
                key={option.role}
                variant={selectedRole?.role === option.role ? 'default' : 'secondary'}
                onClick={() => handleLogin(option)}
                disabled={isLoading !== null}
                className="gap-2"
              >
                {option.icon}
                {option.label}
                {isLoading === option.role && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ml-1" />
                )}
              </Button>
            ))}
          </div>
        </Card>

        {/* Info */}
        <p className="mt-6 text-center text-sm text-gray-500">
          This is a development/testing login page. No actual authentication is performed.
          <br />
          Select any role to explore its features with mock data.
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-9 w-64 bg-gray-200 animate-pulse rounded mx-auto" />
            <div className="mt-2 h-5 w-96 bg-gray-200 animate-pulse rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
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
