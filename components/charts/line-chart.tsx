'use client'

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { CustomTooltip } from './custom-tooltip'
import {
  CHART_NEUTRAL,
  formatChartNumber,
  getChartColor,
  getGradientDefinition,
  createGradientId,
} from '@/lib/utils/chart-helpers'

export interface LineChartDataPoint {
  name: string
  [key: string]: string | number
}

interface LineChartProps {
  data: LineChartDataPoint[]
  dataKeys: string[]
  colors?: string[]
  height?: number
  showArea?: boolean
  showDots?: boolean
  xAxisKey?: string
  yAxisLabel?: string
  xAxisLabel?: string
  showLegend?: boolean
  showGrid?: boolean
  curved?: boolean
  animationDuration?: number
}

export function LineChart({
  data,
  dataKeys,
  colors,
  height = 300,
  showArea = false,
  showDots = true,
  xAxisKey = 'name',
  yAxisLabel,
  xAxisLabel,
  showLegend = true,
  showGrid = true,
  curved = true,
  animationDuration = 1000,
}: LineChartProps) {
  const ChartComponent = showArea ? AreaChart : RechartsLineChart

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* Gradient Definitions for Area */}
        {showArea && (
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
        )}

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
            iconType="line"
            iconSize={12}
            wrapperStyle={{ fontSize: 12 }}
          />
        )}

        {dataKeys.map((key, index) => {
          const color = colors?.[index] || getChartColor(index)

          if (showArea) {
            return (
              <Area
                key={key}
                type={curved ? 'monotone' : 'linear'}
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${createGradientId(color, index)})`}
                dot={
                  showDots
                    ? {
                        r: 4,
                        fill: color,
                        stroke: '#FFFFFF',
                        strokeWidth: 2,
                      }
                    : false
                }
                activeDot={{
                  r: 6,
                  stroke: color,
                  strokeWidth: 2,
                  fill: '#FFFFFF',
                }}
                animationDuration={animationDuration}
                animationEasing="ease-in-out"
              />
            )
          }

          return (
            <Line
              key={key}
              type={curved ? 'monotone' : 'linear'}
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={
                showDots
                  ? {
                      r: 4,
                      fill: color,
                      stroke: '#FFFFFF',
                      strokeWidth: 2,
                    }
                  : false
              }
              activeDot={{
                r: 6,
                stroke: color,
                strokeWidth: 2,
                fill: '#FFFFFF',
              }}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
            />
          )
        })}
      </ChartComponent>
    </ResponsiveContainer>
  )
}
