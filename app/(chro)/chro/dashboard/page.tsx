'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  FileText,
  Users,
  CheckCircle,
  TrendingUp,
  Clock,
  Building2,
  Filter,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  UserCheck,
  RefreshCw,
  Globe,
  MessageSquare,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/hooks'
import { cn } from '@/lib/utils'

type TimeRange = '30d' | '90d' | '180d'

// Mock data - in production, this would come from API
const MOCK_STATS = {
  '30d': {
    totalJobPostings: 47,
    totalApplications: 312,
    uniqueApplicants: 189,
    internalHires: 23,
    hireRate: 7.4,
    avgTimeToHire: 18,
  },
  '90d': {
    totalJobPostings: 124,
    totalApplications: 892,
    uniqueApplicants: 456,
    internalHires: 67,
    hireRate: 7.5,
    avgTimeToHire: 21,
  },
  '180d': {
    totalJobPostings: 231,
    totalApplications: 1647,
    uniqueApplicants: 823,
    internalHires: 134,
    hireRate: 8.1,
    avgTimeToHire: 19,
  },
}

const MOCK_COMPANY_DATA = [
  { name: 'Ashok Leyland', jobsPosted: 12, applications: 78, hires: 6, workforce: 45000, flag: 'strong' },
  { name: 'Hinduja Global', jobsPosted: 8, applications: 45, hires: 4, workforce: 32000, flag: 'normal' },
  { name: 'IndusInd Bank', jobsPosted: 15, applications: 92, hires: 3, workforce: 28000, flag: 'low-conversion' },
  { name: 'Hinduja Leyland', jobsPosted: 5, applications: 23, hires: 2, workforce: 12000, flag: 'normal' },
  { name: 'Gulf Oil', jobsPosted: 3, applications: 8, hires: 1, workforce: 5000, flag: 'low-adoption' },
  { name: 'GOCL Corporation', jobsPosted: 2, applications: 12, hires: 1, workforce: 3500, flag: 'normal' },
  { name: 'Hinduja Tech', jobsPosted: 6, applications: 34, hires: 4, workforce: 8000, flag: 'strong' },
  { name: 'Hinduja Housing', jobsPosted: 4, applications: 18, hires: 2, workforce: 4500, flag: 'normal' },
]

const MOCK_ADOPTION = {
  loggedInPercentage: 67,
  repeatApplicants: 34,
  crossCompanyApplications: 89,
  noResponseApplicants: 23,
}

const MOCK_INSIGHTS = [
  { type: 'highlight', text: '45% of internal hires happened within the same business vertical' },
  { type: 'warning', text: 'Only 3 companies account for 70% of internal moves' },
  { type: 'success', text: 'Roles with highest internal fill success: Operations, Finance' },
  { type: 'highlight', text: 'Average internal move takes 18 days less than external hiring' },
  { type: 'info', text: 'Cross-company applications increased by 23% this quarter' },
]

export default function CHRODashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [functionFilter, setFunctionFilter] = useState<string>('all')

  const stats = MOCK_STATS[timeRange]
  const firstName = user?.firstName || 'there'

  const timeRangeLabel = {
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '180d': 'Last 180 Days',
  }[timeRange]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Welcome, {firstName}!
          </h1>
          <p className="mt-1 text-gray-600">
            Internal mobility insights across Hinduja Group companies
          </p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {(['30d', '90d', '180d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '180 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<Briefcase className="h-4 w-4" />}
          label="Job Postings"
          value={stats.totalJobPostings}
          color="primary"
        />
        <StatCard
          icon={<FileText className="h-4 w-4" />}
          label="Applications"
          value={stats.totalApplications}
          color="secondary"
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Unique Applicants"
          value={stats.uniqueApplicants}
          color="info"
        />
        <StatCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Internal Hires"
          value={stats.internalHires}
          color="success"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Hire Rate"
          value={`${stats.hireRate}%`}
          color="warning"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Avg Time to Hire"
          value={`${stats.avgTimeToHire}d`}
          color="gray"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters:</span>
        </div>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[160px] h-9 bg-white">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {MOCK_COMPANY_DATA.map((c) => (
              <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={functionFilter} onValueChange={setFunctionFilter}>
          <SelectTrigger className="w-[140px] h-9 bg-white">
            <SelectValue placeholder="All Functions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Functions</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[130px] h-9 bg-white">
            <SelectValue placeholder="Job Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="lateral">Lateral</SelectItem>
            <SelectItem value="promotion">Promotion</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9 bg-white">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="chennai">Chennai</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company-wise Mobility Table */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Company-wise Mobility View
            </h2>
          </div>
          <Link
            href="/chro/reports"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View reports
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-600">Company</th>
                <th className="pb-3 font-medium text-gray-600 text-right">Jobs Posted</th>
                <th className="pb-3 font-medium text-gray-600 text-right">Applications</th>
                <th className="pb-3 font-medium text-gray-600 text-right">Internal Hires</th>
                <th className="pb-3 font-medium text-gray-600 text-right">Conversion %</th>
                <th className="pb-3 font-medium text-gray-600 text-right">% Workforce Applied</th>
                <th className="pb-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPANY_DATA.map((company) => {
                const conversion = company.applications > 0
                  ? ((company.hires / company.applications) * 100).toFixed(1)
                  : '0.0'
                const workforceApplied = ((company.applications / company.workforce) * 100).toFixed(2)

                return (
                  <tr key={company.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{company.name}</td>
                    <td className="py-3 text-right text-gray-700">{company.jobsPosted}</td>
                    <td className="py-3 text-right text-gray-700">{company.applications}</td>
                    <td className="py-3 text-right text-gray-700">{company.hires}</td>
                    <td className="py-3 text-right">
                      <span className={cn(
                        'font-medium',
                        parseFloat(conversion) >= 10 ? 'text-success' :
                        parseFloat(conversion) >= 5 ? 'text-gray-700' : 'text-warning'
                      )}>
                        {conversion}%
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-700">{workforceApplied}%</td>
                    <td className="py-3">
                      <CompanyStatusBadge flag={company.flag} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Two Column Layout: Adoption + Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Employee Adoption & Trust Signals */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Adoption & Trust
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <AdoptionMetric
              icon={<Users className="h-4 w-4" />}
              label="Employees Logged In"
              value={`${MOCK_ADOPTION.loggedInPercentage}%`}
              trend="+5%"
              trendUp
            />
            <AdoptionMetric
              icon={<RefreshCw className="h-4 w-4" />}
              label="Repeat Applicants"
              value={MOCK_ADOPTION.repeatApplicants}
              trend="+12"
              trendUp
            />
            <AdoptionMetric
              icon={<Globe className="h-4 w-4" />}
              label="Cross-company Apps"
              value={MOCK_ADOPTION.crossCompanyApplications}
              trend="+23%"
              trendUp
            />
            <AdoptionMetric
              icon={<MessageSquare className="h-4 w-4" />}
              label="Awaiting Response"
              value={MOCK_ADOPTION.noResponseApplicants}
              sublabel="No feedback yet"
              warning
            />
          </div>
        </Card>

        {/* Policy & Decision Support Insights */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold text-gray-900">
              Key Insights
            </h2>
          </div>

          <div className="space-y-3">
            {MOCK_INSIGHTS.map((insight, index) => (
              <InsightItem key={index} type={insight.type} text={insight.text} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sublabel?: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'gray'
}) {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-100 text-gray-600',
  }

  return (
    <Card className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', colorStyles[color])}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
        </div>
      </div>
    </Card>
  )
}

// Company Status Badge Component
function CompanyStatusBadge({ flag }: { flag: string }) {
  switch (flag) {
    case 'strong':
      return (
        <Badge className="bg-success/10 text-success border-0 gap-1">
          <Sparkles className="h-3 w-3" />
          Strong Mobility
        </Badge>
      )
    case 'low-adoption':
      return (
        <Badge className="bg-warning/10 text-warning border-0 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Low Adoption
        </Badge>
      )
    case 'low-conversion':
      return (
        <Badge className="bg-destructive/10 text-destructive border-0 gap-1">
          <ArrowDown className="h-3 w-3" />
          Low Conversion
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-600 border-0">
          Normal
        </Badge>
      )
  }
}

// Adoption Metric Component
function AdoptionMetric({
  icon,
  label,
  value,
  trend,
  trendUp,
  sublabel,
  warning,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
  sublabel?: string
  warning?: boolean
}) {
  return (
    <div className={cn(
      'rounded-lg p-4',
      warning ? 'bg-warning/5 border border-warning/20' : 'bg-gray-50'
    )}>
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'text-xl font-bold',
          warning ? 'text-warning' : 'text-gray-900'
        )}>
          {value}
        </span>
        {trend && (
          <span className={cn(
            'flex items-center text-xs font-medium',
            trendUp ? 'text-success' : 'text-destructive'
          )}>
            {trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="mt-1 text-xs text-gray-400">{sublabel}</p>
      )}
    </div>
  )
}

// Insight Item Component
function InsightItem({ type, text }: { type: string; text: string }) {
  const styles = {
    highlight: 'bg-primary/5 border-l-primary text-gray-700',
    warning: 'bg-warning/5 border-l-warning text-gray-700',
    success: 'bg-success/5 border-l-success text-gray-700',
    info: 'bg-blue-50 border-l-blue-500 text-gray-700',
  }

  const icons = {
    highlight: <TrendingUp className="h-4 w-4 text-primary shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-warning shrink-0" />,
    success: <CheckCircle className="h-4 w-4 text-success shrink-0" />,
    info: <Lightbulb className="h-4 w-4 text-blue-500 shrink-0" />,
  }

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-lg border-l-4 p-3',
      styles[type as keyof typeof styles] || styles.info
    )}>
      {icons[type as keyof typeof icons] || icons.info}
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  )
}
