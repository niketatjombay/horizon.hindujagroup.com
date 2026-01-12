'use client'

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CustomTooltip } from './custom-tooltip'
import {
  CHART_NEUTRAL,
  formatChartNumber,
  getChartColor,
  getGradientDefinition,
  createGradientId,
} from '@/lib/utils/chart-helpers'

export interface AreaChartDataPoint {
  name: string
  [key: string]: string | number
}

interface AreaChartProps {
  data: AreaChartDataPoint[]
  dataKeys: string[]
  colors?: string[]
  height?: number
  xAxisKey?: string
  yAxisLabel?: string
  xAxisLabel?: string
  showLegend?: boolean
  showGrid?: boolean
  stacked?: boolean
  curved?: boolean
  animationDuration?: number
}

export function AreaChart({
  data,
  dataKeys,
  colors,
  height = 300,
  xAxisKey = 'name',
  yAxisLabel,
  xAxisLabel,
  showLegend = true,
  showGrid = true,
  stacked = false,
  curved = true,
  animationDuration = 1000,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* Gradient Definitions */}
        <defs>
          {dataKeys.map((key, index) => {
            const color = colors?.[index] || getChartColor(index)
            const gradient = getGradientDefinition(color)
            return (
              <linearGradient
                key={key}
                id={createGradientId(color, index)}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={gradient.top} stopOpacity={1} />
                <stop offset="95%" stopColor={gradient.bottom} stopOpacity={1} />
              </linearGradient>
            )
          })}
        </defs>

        {showGrid && (
          <CartesianGrid
            stroke={CHART_NEUTRAL.gridLine}
            strokeDasharray="3 3"
            vertical={false}
          />
        )}

        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12, fill: CHART_NEUTRAL.axisLabel }}
          tickLine={false}
          axisLine={{ stroke: CHART_NEUTRAL.gridLine }}
          label={
            xAxisLabel
              ? {
                  value: xAxisLabel,
                  position: 'insideBottom',
                  offset: -5,
                  style: { fontSize: 12, fill: CHART_NEUTRAL.axisLabel },
                }
              : undefined
          }
        />

        <YAxis
          tick={{ fontSize: 12, fill: CHART_NEUTRAL.axisLabel }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatChartNumber}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: CHART_NEUTRAL.axisLabel },
                }
              : undefined
          }
        />

        <Tooltip content={<CustomTooltip />} />

        {showLegend && dataKeys.length > 1 && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="rect"
            iconSize={12}
            wrapperStyle={{ fontSize: 12 }}
          />
        )}

        {dataKeys.map((key, index) => {
          const color = colors?.[index] || getChartColor(index)
          return (
            <Area
              key={key}
              type={curved ? 'monotone' : 'linear'}
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${createGradientId(color, index)})`}
              stackId={stacked ? 'stack' : undefined}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
            />
          )
        })}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
