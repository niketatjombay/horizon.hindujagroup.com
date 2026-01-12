'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CustomTooltip } from './custom-tooltip'
import {
  CHART_COLORS,
  CHART_NEUTRAL,
  formatChartNumber,
  getChartColor,
} from '@/lib/utils/chart-helpers'

export interface BarChartDataPoint {
  name: string
  [key: string]: string | number
}

interface BarChartProps {
  data: BarChartDataPoint[]
  dataKeys: string[]
  colors?: string[]
  height?: number
  stacked?: boolean
  xAxisKey?: string
  yAxisLabel?: string
  xAxisLabel?: string
  showLegend?: boolean
  showGrid?: boolean
  barSize?: number
  animationDuration?: number
}

export function BarChart({
  data,
  dataKeys,
  colors,
  height = 300,
  stacked = false,
  xAxisKey = 'name',
  yAxisLabel,
  xAxisLabel,
  showLegend = true,
  showGrid = true,
  barSize,
  animationDuration = 1000,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
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

        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_NEUTRAL.hoverOverlay }} />

        {showLegend && dataKeys.length > 1 && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="square"
            iconSize={12}
            wrapperStyle={{ fontSize: 12 }}
          />
        )}

        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={getChartColor(index)}
            stackId={stacked ? 'stack' : undefined}
            radius={stacked && index < dataKeys.length - 1 ? 0 : [8, 8, 0, 0]}
            barSize={barSize}
            animationDuration={animationDuration}
            animationEasing="ease-out"
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
