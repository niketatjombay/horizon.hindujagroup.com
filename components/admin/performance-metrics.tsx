'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { LineChart } from '@/components/charts'
import { Activity, Zap, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PerformanceMetricsProps {
  data: {
    timestamps: string[]
    responseTime: number[]
    throughput: number[]
    errorRate: number[]
  }
  height?: number
  isLoading?: boolean
}

type MetricTab = 'responseTime' | 'throughput' | 'errorRate'

const tabs: Array<{
  id: MetricTab
  label: string
  icon: typeof Activity
  color: string
  unit: string
  targetLine?: number
  targetLabel?: string
}> = [
  {
    id: 'responseTime',
    label: 'Response Time',
    icon: Activity,
    color: '#0066FF',
    unit: 'ms',
    targetLine: 200,
    targetLabel: 'Target: 200ms',
  },
  {
    id: 'throughput',
    label: 'Throughput',
    icon: Zap,
    color: '#00B87C',
    unit: 'req/min',
  },
  {
    id: 'errorRate',
    label: 'Error Rate',
    icon: AlertTriangle,
    color: '#E63946',
    unit: '%',
    targetLine: 1,
    targetLabel: 'Threshold: 1%',
  },
]

export function PerformanceMetrics({
  data,
  height = 300,
  isLoading = false,
}: PerformanceMetricsProps) {
  const [activeTab, setActiveTab] = useState<MetricTab>('responseTime')

  const activeTabConfig = tabs.find((t) => t.id === activeTab)!

  // Transform data for the chart
  const chartData = data.timestamps.map((timestamp, index) => ({
    name: format(new Date(timestamp), 'HH:mm'),
    value:
      activeTab === 'responseTime'
        ? data.responseTime[index]
        : activeTab === 'throughput'
          ? data.throughput[index]
          : Number(data.errorRate[index].toFixed(2)),
    ...(activeTabConfig.targetLine && { target: activeTabConfig.targetLine }),
  }))

  // Calculate averages
  const getAverage = (arr: number[]) => {
    if (arr.length === 0) return 0
    return arr.reduce((a, b) => a + b, 0) / arr.length
  }

  const avgResponseTime = Math.round(getAverage(data.responseTime))
  const avgThroughput = Math.round(getAverage(data.throughput))
  const avgErrorRate = getAverage(data.errorRate).toFixed(2)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
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
        <h3 className="text-lg font-semibold text-gray-900">
          Performance Metrics
        </h3>
        <p className="text-sm text-gray-500">
          System performance over the last 24 hours
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all flex-1',
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn('h-4 w-4', isActive && 'text-primary')}
                style={isActive ? { color: tab.color } : undefined}
              />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Avg Response</p>
          <p className="text-lg font-semibold text-gray-900">
            {avgResponseTime}
            <span className="text-xs font-normal text-gray-500 ml-1">ms</span>
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Avg Throughput</p>
          <p className="text-lg font-semibold text-gray-900">
            {avgThroughput}
            <span className="text-xs font-normal text-gray-500 ml-1">req/min</span>
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Avg Error Rate</p>
          <p className="text-lg font-semibold text-gray-900">
            {avgErrorRate}
            <span className="text-xs font-normal text-gray-500 ml-1">%</span>
          </p>
        </div>
      </div>

      {/* Target line indicator */}
      {activeTabConfig.targetLabel && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <div
            className="w-4 h-0.5 rounded"
            style={{ backgroundColor: '#E8EAED' }}
          />
          <span className="text-gray-500">
            {activeTabConfig.targetLabel}
          </span>
        </div>
      )}

      {/* Chart */}
      <LineChart
        data={chartData}
        dataKeys={
          activeTabConfig.targetLine ? ['value', 'target'] : ['value']
        }
        colors={
          activeTabConfig.targetLine
            ? [activeTabConfig.color, '#E8EAED']
            : [activeTabConfig.color]
        }
        height={height}
        showArea={true}
        showDots={false}
        showLegend={false}
        showGrid={true}
        curved={true}
      />
    </Card>
  )
}
