'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Users,
  BarChart3,
  Building2,
  ArrowRight,
  CheckCircle,
  Globe,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/lib/hooks'

const FEATURES = [
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: 'Internal Job Marketplace',
    description: 'Browse and apply to jobs across all Hinduja Group companies in one place.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Career Growth',
    description: 'Discover internal mobility opportunities and advance your career within the group.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Cross-Company Visibility',
    description: 'Access opportunities from 17+ companies across diverse industries.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Smart Recommendations',
    description: 'Get personalized job recommendations based on your skills and experience.',
  },
]

const STATS = [
  { value: '17+', label: 'Group Companies' },
  { value: '500+', label: 'Active Jobs' },
  { value: '10,000+', label: 'Employees' },
  { value: '95%', label: 'Satisfaction Rate' },
]

const COMPANIES = [
  'Hinduja Global Solutions',
  'Ashok Leyland',
  'IndusInd Bank',
  'Hinduja Tech',
  'GOCL Corporation',
  'Gulf Oil',
  'Hinduja Ventures',
  'NXT Digital',
]

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Show nothing while checking auth or redirecting
  if (isLoading || isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Next Career Move
              <br />
              <span className="text-primary">Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Horizon is the Internal Job Portal for Hinduja Group employees.
              Discover opportunities across 17+ companies, apply seamlessly, and
              grow your career within the group.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="gap-2 text-lg px-8">
                  Explore as Demo User
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Horizon?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover, apply, and grow within the Hinduja Group ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're an employee looking for opportunities, an HR manager hiring talent, or an executive tracking metrics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-l-4 border-l-primary">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employees</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Browse all internal jobs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Apply with one click
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Track applications
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-secondary">
              <Briefcase className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HR Managers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Post job openings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Review applications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Manage pipeline
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-success">
              <BarChart3 className="h-8 w-8 text-success mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CHRO</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Group-wide analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Detailed reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Export & share
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-warning">
              <Shield className="h-8 w-8 text-warning mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admins</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  User management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Company setup
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  System configuration
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hinduja Group Companies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access opportunities from leading companies across diverse industries.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {COMPANIES.map((company, idx) => (
              <div
                key={idx}
                className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
              >
                {company}
              </div>
            ))}
            <div className="px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
              + More Companies
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Login to discover internal opportunities and take the next step in your career.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
              Login Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Jombay"
                width={80}
                height={26}
                className="h-6 w-auto"
              />
              <div className="h-6 w-px bg-gray-600" />
              <Image
                src="/hinduja_logo.svg"
                alt="Hinduja Group"
                width={60}
                height={20}
                className="h-5 w-auto brightness-0 invert"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/summary" className="hover:text-white transition-colors">
                Implementation Summary
              </Link>
              <span>|</span>
              <span>Horizon - Internal Job Portal</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Hinduja Group. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
