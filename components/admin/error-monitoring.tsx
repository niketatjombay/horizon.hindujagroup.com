'use client'

import { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  XCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ErrorLogEntry, ErrorSeverity } from '@/lib/hooks/use-admin'

interface ErrorMonitoringProps {
  errors: ErrorLogEntry[]
  onResolve: (errorId: string) => void
  resolvingErrorId?: string | null
  isLoading?: boolean
}

const severityConfig: Record<
  ErrorSeverity,
  {
    color: string
    bgColor: string
    badgeVariant: 'default' | 'success' | 'warning' | 'error' | 'info'
    label: string
  }
> = {
  low: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    badgeVariant: 'default',
    label: 'Low',
  },
  medium: {
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    badgeVariant: 'warning',
    label: 'Medium',
  },
  high: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    badgeVariant: 'warning',
    label: 'High',
  },
  critical: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    badgeVariant: 'error',
    label: 'Critical',
  },
}

function ErrorItem({
  error,
  onResolve,
  isResolving,
}: {
  error: ErrorLogEntry
  onResolve: () => void
  isResolving: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = severityConfig[error.severity]

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all',
        error.resolved ? 'bg-gray-50 opacity-60' : config.bgColor,
        error.severity === 'critical' && !error.resolved && 'animate-pulse'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant={config.badgeVariant} size="sm">
              {config.label}
            </Badge>
            <Badge variant="default" size="sm">
              {error.type}
            </Badge>
            {error.resolved && (
              <Badge variant="success" size="sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </Badge>
            )}
          </div>

          <p className={cn('font-medium', config.color)}>{error.message}</p>

          <p className="text-sm text-gray-500 mt-1">
            {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
            {error.resolvedAt && (
              <span className="ml-2">
                | Resolved{' '}
                {formatDistanceToNow(new Date(error.resolvedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </p>

          {/* Stack trace */}
          {error.stackTrace && (
            <div className="mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Hide stack trace
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Show stack trace
                  </>
                )}
              </button>
              {isExpanded && (
                <pre className="mt-2 p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
                  {error.stackTrace}
                </pre>
              )}
            </div>
          )}
        </div>

        {!error.resolved && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResolve}
            disabled={isResolving}
          >
            {isResolving ? (
              'Resolving...'
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Resolve
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function ErrorMonitoring({
  errors,
  onResolve,
  resolvingErrorId,
  isLoading = false,
}: ErrorMonitoringProps) {
  const [showResolved, setShowResolved] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const errorTypes = useMemo(
    () => [...new Set(errors.map((e) => e.type))],
    [errors]
  )

  const filteredErrors = useMemo(() => {
    return errors.filter((error) => {
      // Show resolved filter
      if (!showResolved && error.resolved) return false

      // Severity filter
      if (severityFilter !== 'all' && error.severity !== severityFilter) {
        return false
      }

      // Type filter
      if (typeFilter !== 'all' && error.type !== typeFilter) {
        return false
      }

      return true
    })
  }, [errors, showResolved, severityFilter, typeFilter])

  const unresolvedCount = errors.filter((e) => !e.resolved).length
  const criticalCount = errors.filter(
    (e) => e.severity === 'critical' && !e.resolved
  ).length

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Error Monitoring
            </h3>
            <p className="text-sm text-gray-500">
              System errors and issues
            </p>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="error" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {criticalCount} Critical
              </Badge>
            )}
            <Badge variant={unresolvedCount > 0 ? 'warning' : 'success'}>
              {unresolvedCount} Unresolved
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {errorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show-resolved"
            checked={showResolved}
            onCheckedChange={setShowResolved}
          />
          <Label htmlFor="show-resolved" className="text-sm text-gray-600">
            Show resolved
          </Label>
        </div>
      </div>

      {/* Error list */}
      <div className="space-y-3 max-h-[400px] overflow-auto">
        {filteredErrors.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <p className="text-gray-600">No errors matching your criteria</p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <ErrorItem
              key={error.id}
              error={error}
              onResolve={() => onResolve(error.id)}
              isResolving={resolvingErrorId === error.id}
            />
          ))
        )}
      </div>
    </Card>
  )
}
