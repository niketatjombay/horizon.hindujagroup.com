'use client'

import { useState, Suspense, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

// Keeping these imports for future use when Admin login is added back
// import { User, Users, BarChart3, Shield, ChevronRight, Copy, Check } from 'lucide-react'

type Step = 'email' | 'otp'

interface DemoAccount {
  email: string
  role: UserRole
  label: string
  redirectTo: string
  credentials: { username: string; password: string }
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'rahul.sharma@hinduja.com',
    role: 'employee',
    label: 'Employee',
    redirectTo: '/jobs',
    credentials: { username: 'rahul.sharma@hinduja.com', password: 'employee123' },
  },
  {
    email: 'priya.mehta@hinduja.com',
    role: 'hr',
    label: 'HR Manager',
    redirectTo: '/hr/dashboard',
    credentials: { username: 'priya.mehta@hinduja.com', password: 'hr123' },
  },
  {
    email: 'vikram.singh@hinduja.com',
    role: 'chro',
    label: 'HR-Corporate',
    redirectTo: '/chro/dashboard',
    credentials: { username: 'vikram.singh@hinduja.com', password: 'chro123' },
  },
]

function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const length = 6

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split('')
    newValue[index] = digit.slice(-1)
    const updatedValue = newValue.join('').slice(0, length)
    onChange(updatedValue)

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pastedData)
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-14 text-center text-xl font-semibold rounded-lg border border-gray-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all'
          )}
        />
      ))}
    </div>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const redirectTo = searchParams.get('redirect') || '/jobs'

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) return

    setIsLoading(true)
    // Simulate OTP sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setOtpSent(true)
    setStep('otp')
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return

    setIsLoading(true)
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find matching demo account or default to employee
    const account = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase())
    const defaultAccount = DEMO_ACCOUNTS[0]
    const selectedAccount = account || defaultAccount

    await login(selectedAccount.credentials.username, selectedAccount.credentials.password)

    // Use account's redirect or the URL param redirect for employee
    const finalRedirect = account
      ? selectedAccount.redirectTo
      : (redirectTo.startsWith('/') ? redirectTo : '/jobs')

    router.push(finalRedirect)
    router.refresh()
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setOtp('')
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setOtpSent(false)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Email Step */}
          {step === 'email' && (
            <div className="animate-in fade-in duration-300">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sign in to Horizon
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your email to receive a one-time password
                </p>
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@hinduja.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isValidEmail(email)) {
                        handleSendOTP()
                      }
                    }}
                  />
                </div>

                {/* Demo Account Suggestions */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Quick login as:</p>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => setEmail(account.email)}
                        disabled={isLoading}
                        className={cn(
                          'px-3 py-1.5 text-xs rounded-full border transition-colors',
                          email.toLowerCase() === account.email.toLowerCase()
                            ? 'bg-primary text-white border-primary'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        )}
                      >
                        {account.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={!isValidEmail(email) || isLoading}
                  className="w-full"
                  size="md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>

              {/* Footer */}
              <p className="mt-6 text-center text-xs text-gray-400">
                Demo environment with mock data
              </p>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="animate-in fade-in duration-300">
              {/* Back Button */}
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Check your email
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {email}
                </p>
              </div>

              {/* OTP Form */}
              <div className="space-y-6">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                />

                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full"
                  size="md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign in'
                  )}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    <button
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs text-gray-400">
                Demo environment - any OTP will work
              </p>
            </div>
          )}
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
            <div className="mx-auto w-16 h-16 bg-gray-100 animate-pulse rounded-full mb-4" />
            <div className="h-7 w-48 bg-gray-100 animate-pulse rounded mx-auto" />
            <div className="mt-2 h-4 w-64 bg-gray-100 animate-pulse rounded mx-auto" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg" />
            <div className="h-12 w-full bg-gray-100 animate-pulse rounded-lg" />
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

// =============================================================================
// COMMENTED OUT: Role-based login UI (to be added back later with Admin)
// =============================================================================
// interface RoleOption {
//   role: UserRole
//   label: string
//   description: string
//   icon: React.ReactNode
//   redirectTo: string
//   username: string
//   password: string
//   color: {
//     bg: string
//     bgActive: string
//     text: string
//   }
// }
//
// const ROLE_OPTIONS: RoleOption[] = [
//   {
//     role: 'employee',
//     label: 'Employee',
//     description: 'Browse jobs, apply, and track applications',
//     icon: <User className="h-5 w-5" />,
//     redirectTo: '/jobs',
//     username: 'employee@hinduja.com',
//     password: 'employee123',
//     color: {
//       bg: 'bg-primary-light',
//       bgActive: 'bg-primary',
//       text: 'text-primary',
//     },
//   },
//   {
//     role: 'hr',
//     label: 'HR Manager',
//     description: 'Post jobs and manage applicants',
//     icon: <Users className="h-5 w-5" />,
//     redirectTo: '/hr/dashboard',
//     username: 'hr@hinduja.com',
//     password: 'hr123',
//     color: {
//       bg: 'bg-secondary-light',
//       bgActive: 'bg-secondary',
//       text: 'text-secondary',
//     },
//   },
//   {
//     role: 'chro',
//     label: 'CHRO',
//     description: 'View reports and analytics',
//     icon: <BarChart3 className="h-5 w-5" />,
//     redirectTo: '/chro/dashboard',
//     username: 'chro@hinduja.com',
//     password: 'chro123',
//     color: {
//       bg: 'bg-success-light',
//       bgActive: 'bg-success',
//       text: 'text-success',
//     },
//   },
//   // Admin login option - hidden for now, will be added later
//   // {
//   //   role: 'admin',
//   //   label: 'Admin',
//   //   description: 'Full system access',
//   //   icon: <Shield className="h-5 w-5" />,
//   //   redirectTo: '/admin/dashboard',
//   //   username: 'admin@hinduja.com',
//   //   password: 'admin123',
//   //   color: {
//   //     bg: 'bg-warning-light',
//   //     bgActive: 'bg-warning',
//   //     text: 'text-warning',
//   //   },
//   // },
// ]
