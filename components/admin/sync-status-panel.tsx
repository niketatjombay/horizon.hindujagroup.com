'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CompanySyncStatus, SyncStatus as SyncStatusType } from '@/lib/hooks/use-admin'

interface SyncStatusPanelProps {
  data: CompanySyncStatus[]
  onTriggerSync: (companyId: string) => void
  syncingCompanyId?: string | null
  isLoading?: boolean
}

const statusConfig: Record<
  SyncStatusType,
  {
    icon: typeof CheckCircle
    color: string
    bgColor: string
    label: string
  }
> = {
  success: {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Success',
  },
  failed: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    label: 'Failed',
  },
  pending: {
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    label: 'Pending',
  },
  syncing: {
    icon: Loader2,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Syncing',
  },
}

function SyncStatusCard({
  company,
  onTriggerSync,
  isSyncing,
}: {
  company: CompanySyncStatus
  onTriggerSync: () => void
  isSyncing: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = statusConfig[company.status]
  const Icon = config.icon

  const showError = company.status === 'failed' && company.errorMessage

  return (
    <Card className={cn('p-4 transition-all', config.bgColor)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon
              className={cn(
                'h-4 w-4 flex-shrink-0',
                config.color,
                company.status === 'syncing' && 'animate-spin'
              )}
            />
            <h4 className="font-medium text-gray-900 truncate">
              {company.companyName}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge
              variant={
                company.status === 'success'
                  ? 'success'
                  : company.status === 'failed'
                    ? 'error'
                    : company.status === 'pending'
                      ? 'warning'
                      : 'info'
              }
              size="sm"
            >
              {config.label}
            </Badge>
            <span className="text-gray-500">
              {formatDistanceToNow(new Date(company.lastSync), { addSuffix: true })}
            </span>
          </div>

          {company.status === 'success' && (
            <p className="text-sm text-gray-600 mt-1">
              {company.recordsProcessed} records processed
            </p>
          )}

          {/* Error message expandable section */}
          {showError && (
            <div className="mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-destructive hover:underline"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Hide error
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Show error
                  </>
                )}
              </button>
              {isExpanded && (
                <div className="mt-2 p-2 rounded bg-destructive/10 text-sm text-destructive font-mono">
                  {company.errorMessage}
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onTriggerSync}
          disabled={isSyncing || company.status === 'syncing'}
        >
          {isSyncing || company.status === 'syncing' ? (
            <>
              <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              Syncing
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1.5" />
              Sync Now
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}

export function SyncStatusPanel({
  data,
  onTriggerSync,
  syncingCompanyId,
  isLoading = false,
}: SyncStatusPanelProps) {
  const successCount = data.filter((c) => c.status === 'success').length
  const failedCount = data.filter((c) => c.status === 'failed').length

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sync Status
            </h3>
            <p className="text-sm text-gray-500">
              Data synchronization status for all companies
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-gray-600">{successCount} successful</span>
            </span>
            {failedCount > 0 && (
              <span className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-gray-600">{failedCount} failed</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((company) => (
          <SyncStatusCard
            key={company.companyId}
            company={company}
            onTriggerSync={() => onTriggerSync(company.companyId)}
            isSyncing={syncingCompanyId === company.companyId}
          />
        ))}
      </div>
    </Card>
  )
}
