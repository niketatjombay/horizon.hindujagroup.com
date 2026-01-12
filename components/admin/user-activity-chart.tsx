'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { AreaChart, LineChart } from '@/components/charts'
import { cn } from '@/lib/utils'

interface UserActivityChartProps {
  data: {
    dates: string[]
    employees: number[]
    hr: number[]
    chro: number[]
    admin: number[]
  }
  height?: number
  isLoading?: boolean
}

type ViewTab = 'all' | 'byRole'

export function UserActivityChart({
  data,
  height = 300,
  isLoading = false,
}: UserActivityChartProps) {
  const [activeView, setActiveView] = useState<ViewTab>('all')

  // Transform data for the stacked area chart (all users)
  const stackedChartData = data.dates.map((date, index) => ({
    name: format(new Date(date), 'MMM dd'),
    Employees: data.employees[index],
    HR: data.hr[index],
    CHRO: data.chro[index],
    Admin: data.admin[index],
  }))

  // Transform data for the line chart (by role)
  const lineChartData = data.dates.map((date, index) => ({
    name: format(new Date(date), 'MMM dd'),
    Employees: data.employees[index],
    HR: data.hr[index],
    CHRO: data.chro[index],
    Admin: data.admin[index],
  }))

  // Calculate totals
  const totalEmployees = data.employees.reduce((a, b) => a + b, 0)
  const totalHR = data.hr.reduce((a, b) => a + b, 0)
  const totalCHRO = data.chro.reduce((a, b) => a + b, 0)
  const totalAdmin = data.admin.reduce((a, b) => a + b, 0)
  const totalAll = totalEmployees + totalHR + totalCHRO + totalAdmin

  const roleColors = ['#0066FF', '#7B61FF', '#FFA733', '#E63946']

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-10 bg-gray-100 rounded animate-pulse mb-4" />
        <div
          className="bg-gray-100 rounded animate-pulse"
          style={{ height }}
        />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              User Activity
            </h3>
            <p className="text-sm text-gray-500">
              Active users over time by role
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{totalAll}</p>
            <p className="text-sm text-gray-500">Total sessions</p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
        <button
          onClick={() => setActiveView('all')}
          className={cn(
            'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all',
            activeView === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveView('byRole')}
          className={cn(
            'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all',
            activeView === 'byRole'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          By Role
        </button>
      </div>

      {/* Stats by role */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Employees', value: totalEmployees, color: roleColors[0] },
          { label: 'HR', value: totalHR, color: roleColors[1] },
          { label: 'CHRO', value: totalCHRO, color: roleColors[2] },
          { label: 'Admin', value: totalAdmin, color: roleColors[3] },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-2 rounded-lg"
            style={{ backgroundColor: `${stat.color}10` }}
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-sm font-semibold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {activeView === 'all' ? (
        <AreaChart
          data={stackedChartData}
          dataKeys={['Employees', 'HR', 'CHRO', 'Admin']}
          colors={roleColors}
          height={height}
          showLegend={true}
          showGrid={true}
          stacked={true}
        />
      ) : (
        <LineChart
          data={lineChartData}
          dataKeys={['Employees', 'HR', 'CHRO', 'Admin']}
          colors={roleColors}
          height={height}
          showLegend={true}
          showDots={true}
          showGrid={true}
          curved={true}
        />
      )}
    </Card>
  )
}
